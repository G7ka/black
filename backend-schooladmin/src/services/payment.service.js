import crypto from 'crypto';
import { pesapalClient } from './pesapal/pesapalClient.service.js';
import { pesapalIpnSetupService } from './pesapal/pesapalIpnSetup.service.js';
import { pesapalConfig } from '../config/pesapal.js';
import { paymentTransactionRepository } from '../repositories/paymentTransaction.repository.js';
import { pesapalIpnEventRepository } from '../repositories/pesapalIpnEvent.repository.js';
import { invoiceRepository } from '../repositories/invoice.repository.js';
import { schoolRepository } from '../repositories/school.repository.js';
import { auditLogRepository } from '../repositories/auditLog.repository.js';
import { billingService } from './billing.service.js';
import { currentPeriod, dueDateForPeriod } from '../utils/billingPeriod.js';
import { enqueueEmail } from '../emails/emailQueue.js';
import { ApiError } from '../utils/ApiError.js';

// Pesapal status_code -> our enum. Names are identical by design (matches
// the doc's payment_status_description values), so this is a direct map.
const STATUS_CODE_MAP = { 0: 'INVALID', 1: 'COMPLETED', 2: 'FAILED', 3: 'REVERSED' };

const PENDING_RETRY_WINDOW_MS = 60 * 60 * 1000; // reuse an in-flight order for 1 hour before creating a fresh one

function buildMerchantReference(invoiceId) {
  // Pesapal's `id` field: alphanumeric, -, _, ., : only, max 50 chars.
  return `PAY-${invoiceId.slice(0, 8)}-${crypto.randomBytes(6).toString('hex')}`;
}

async function getOrCreateCurrentInvoice(schoolId) {
  const period = currentPeriod();
  let invoice = await invoiceRepository.findBySchoolAndPeriod(schoolId, period);
  if (invoice) return invoice;

  const school = await schoolRepository.findById(schoolId);
  if (!school) throw ApiError.notFound('School not found');
  if (school.status !== 'ACTIVE') throw ApiError.conflict('School is not active');

  const pricePerStudent = await billingService.getPricePerStudent();
  const due = dueDateForPeriod(period);

  invoice = await invoiceRepository.create({
    schoolId,
    period,
    amount: school.numStudentsDeclared * pricePerStudent,
    dueDate: due,
    status: due < new Date() ? 'OVERDUE' : 'PENDING',
  });
  return invoice;
}

export const paymentService = {
  /**
   * Initiates a Pesapal order for the school's current-period invoice.
   * Mirrors SubmitOrderRequest exactly per the doc — no invented fields.
   */
  async initiatePayment(schoolId) {
    const invoice = await getOrCreateCurrentInvoice(schoolId);
    if (invoice.status === 'PAID') {
      throw ApiError.conflict('This invoice has already been paid');
    }

    const school = await schoolRepository.findById(schoolId);
    if (!school) throw ApiError.notFound('School not found');

    // Reuse a still-fresh in-flight order instead of creating a duplicate
    // Pesapal order on rapid repeat clicks.
    const latest = await paymentTransactionRepository.findLatestForSchool(schoolId);
    if (
      latest &&
      latest.invoiceId === invoice.id &&
      latest.status === 'PENDING' &&
      latest.redirectUrl &&
      Date.now() - new Date(latest.initiatedAt).getTime() < PENDING_RETRY_WINDOW_MS
    ) {
      return {
        redirectUrl: latest.redirectUrl,
        orderTrackingId: latest.orderTrackingId,
        merchantReference: latest.merchantReference,
        reused: true,
      };
    }

    const ipnId = await pesapalIpnSetupService.getOrRegisterIpnId();
    const merchantReference = buildMerchantReference(invoice.id);
    const description = `School fees — ${invoice.period}`.slice(0, 100);

    const transaction = await paymentTransactionRepository.create({
      invoiceId: invoice.id,
      schoolId,
      merchantReference,
      currency: 'UGX',
      amount: invoice.amount,
      description,
      status: 'PENDING',
    });

    const [firstName, ...lastNameParts] = (school.contactName || '').trim().split(' ');

    let submitResponse;
    try {
      submitResponse = await pesapalClient.submitOrderRequest({
        id: merchantReference,
        currency: 'UGX',
        amount: invoice.amount,
        description,
        callback_url: pesapalConfig.callbackUrl,
        notification_id: ipnId,
        account_number: schoolId, // ties this order to the school for recurring/reference purposes
        billing_address: {
          email_address: school.contactEmail,
          phone_number: school.contactPhone,
          country_code: 'UG',
          first_name: firstName || school.contactName,
          last_name: lastNameParts.join(' ') || undefined,
        },
      });
    } catch (err) {
      // Record the failed attempt rather than leaving a silent PENDING
      // row with no Pesapal order behind it.
      await paymentTransactionRepository.updateFromStatus(transaction.id, {
        status: 'FAILED',
        rawSubmitResponse: err.details ? { error: err.details } : { error: err.message },
      });
      throw err;
    }

    await paymentTransactionRepository.attachOrderTrackingId(
      transaction.id,
      submitResponse.order_tracking_id,
      submitResponse.redirect_url,
      submitResponse
    );

    return {
      redirectUrl: submitResponse.redirect_url,
      orderTrackingId: submitResponse.order_tracking_id,
      merchantReference,
      reused: false,
    };
  },

  /**
   * Shared by both the callback redirect and the IPN handler — per the
   * doc, neither carries the actual payment status, so both must
   * independently call GetTransactionStatus. Idempotent: re-running this
   * for an already-COMPLETED transaction is a safe no-op (no duplicate
   * emails, no double invoice updates) — this is our duplicate-callback
   * protection.
   */
  async reconcileByOrderTrackingId(orderTrackingId) {
    const transaction = await paymentTransactionRepository.findByOrderTrackingId(orderTrackingId);
    if (!transaction) {
      throw ApiError.notFound(`No payment transaction found for order ${orderTrackingId}`);
    }

    if (transaction.status === 'COMPLETED') {
      return { transaction, alreadyProcessed: true };
    }

    const statusResp = await pesapalClient.getTransactionStatus(orderTrackingId);
    const newStatus = STATUS_CODE_MAP[statusResp.status_code] ?? 'INVALID';
    const previousStatus = transaction.status;

    const updated = await paymentTransactionRepository.updateFromStatus(transaction.id, {
      status: newStatus,
      statusCode: statusResp.status_code,
      paymentMethod: statusResp.payment_method,
      confirmationCode: statusResp.confirmation_code,
      paymentAccount: statusResp.payment_account,
      rawStatusResponse: statusResp,
      ...(newStatus === 'COMPLETED' ? { completedAt: new Date() } : {}),
    });

    const school = await schoolRepository.findById(transaction.schoolId);

    if (newStatus === 'COMPLETED' && previousStatus !== 'COMPLETED') {
      await invoiceRepository.markPaid(transaction.invoiceId);

      await auditLogRepository.record({
        action: 'INVOICE_PAID_VIA_PESAPAL',
        performedById: 'pesapal',
        performedByName: 'Pesapal (automated)',
        reason: `Order ${orderTrackingId}`,
        metadata: {
          schoolId: transaction.schoolId,
          invoiceId: transaction.invoiceId,
          amount: transaction.amount,
          confirmationCode: statusResp.confirmation_code,
        },
      });

      if (school) {
        await enqueueEmail({
          type: 'INVOICE_PAYMENT_CONFIRMED',
          to: school.contactEmail,
          params: {
            schoolName: school.name,
            amount: transaction.amount,
            currency: transaction.currency,
            period: currentPeriod(),
            confirmationCode: statusResp.confirmation_code,
            paymentMethod: statusResp.payment_method,
          },
        });
      }
    } else if ((newStatus === 'FAILED' || newStatus === 'INVALID') && previousStatus === 'PENDING') {
      await auditLogRepository.record({
        action: 'PAYMENT_FAILED',
        performedById: 'pesapal',
        performedByName: 'Pesapal (automated)',
        reason: statusResp.description || newStatus,
        metadata: { schoolId: transaction.schoolId, invoiceId: transaction.invoiceId, orderTrackingId },
      });

      if (school) {
        await enqueueEmail({
          type: 'PAYMENT_FAILED',
          to: school.contactEmail,
          params: {
            schoolName: school.name,
            amount: transaction.amount,
            currency: transaction.currency,
            period: currentPeriod(),
            reason: statusResp.description,
          },
        });
      }
    } else if (newStatus === 'REVERSED' && previousStatus !== 'REVERSED') {
      // A previously-completed payment was reversed by the processor —
      // put the invoice back into a payable state rather than silently
      // leaving it marked PAID with no money actually received.
      const invoice = await invoiceRepository.findManyBySchoolAndPeriod([transaction.schoolId], currentPeriod());
      const currentInvoice = invoice.find((inv) => inv.id === transaction.invoiceId);
      if (currentInvoice?.status === 'PAID') {
        await invoiceRepository.markOverdue(transaction.invoiceId);
      }

      await auditLogRepository.record({
        action: 'PAYMENT_REVERSED',
        performedById: 'pesapal',
        performedByName: 'Pesapal (automated)',
        reason: `Order ${orderTrackingId} reversed`,
        metadata: { schoolId: transaction.schoolId, invoiceId: transaction.invoiceId },
      });
    }

    return { transaction: updated, alreadyProcessed: false, newStatus };
  },

  /**
   * IPN entry point — logs the raw event BEFORE processing (so a crash
   * mid-processing still leaves an audit trail), then reconciles, then
   * records the outcome. Returns the exact status Pesapal expects back.
   */
  async handleIpn({ orderTrackingId, orderMerchantReference, orderNotificationType, rawPayload }) {
    const transaction = await paymentTransactionRepository.findByOrderTrackingId(orderTrackingId).catch(() => null);

    const event = await pesapalIpnEventRepository.record({
      paymentTransactionId: transaction?.id ?? null,
      orderTrackingId,
      orderMerchantReference,
      orderNotificationType,
      rawPayload,
    });

    try {
      await this.reconcileByOrderTrackingId(orderTrackingId);
      await pesapalIpnEventRepository.markProcessed(event.id, 200);
      return 200;
    } catch (err) {
      await pesapalIpnEventRepository.markFailed(event.id, err.message, 500);
      return 500;
    }
  },

  async requestRefund({ schoolId, amount, remarks, requestedBy }) {
    const transaction = await paymentTransactionRepository.findLatestForSchool(schoolId);
    if (!transaction || transaction.status !== 'COMPLETED') {
      throw ApiError.conflict('No completed payment found to refund');
    }
    if (transaction.refundRequestedAt) {
      throw ApiError.conflict('A refund has already been requested for this payment');
    }
    if (!transaction.confirmationCode) {
      throw ApiError.conflict('This transaction has no confirmation code to refund against');
    }
    if (amount > transaction.amount) {
      throw ApiError.badRequest('Refund amount cannot exceed the original payment amount');
    }

    const result = await pesapalClient.refundRequest({
      confirmationCode: transaction.confirmationCode,
      amount,
      username: requestedBy,
      remarks,
    });

    await paymentTransactionRepository.updateFromStatus(transaction.id, {
      refundRequestedAt: new Date(),
      refundStatus: result.message || result.status,
    });

    await auditLogRepository.record({
      action: 'PAYMENT_REFUND_REQUESTED',
      performedById: requestedBy,
      performedByName: requestedBy,
      reason: remarks,
      metadata: { schoolId, transactionId: transaction.id, amount },
    });

    return result;
  },

  async cancelPendingPayment({ schoolId, requestedBy }) {
    const transaction = await paymentTransactionRepository.findLatestForSchool(schoolId);
    if (!transaction) throw ApiError.notFound('No payment attempt found for this school');
    if (!['PENDING', 'FAILED', 'INVALID'].includes(transaction.status)) {
      throw ApiError.conflict('Only pending or failed payments can be cancelled');
    }
    if (transaction.cancelledAt) {
      throw ApiError.conflict('This payment attempt was already cancelled');
    }
    if (!transaction.orderTrackingId) {
      throw ApiError.conflict('This payment attempt has no order to cancel');
    }

    const result = await pesapalClient.cancelOrder(transaction.orderTrackingId);

    await paymentTransactionRepository.updateFromStatus(transaction.id, {
      status: 'CANCELLED',
      cancelledAt: new Date(),
    });

    await auditLogRepository.record({
      action: 'PAYMENT_CANCELLED',
      performedById: requestedBy,
      performedByName: requestedBy,
      metadata: { schoolId, transactionId: transaction.id },
    });

    return result;
  },
};
