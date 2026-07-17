import { paymentService } from '../services/payment.service.js';
import { paymentTransactionRepository } from '../repositories/paymentTransaction.repository.js';
import { platformAdminRepository } from '../repositories/platformAdmin.repository.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok } from '../utils/apiResponse.js';
import { toPaymentTransactionDTO } from '../dtos/payment.dto.js';
import { ApiError } from '../utils/ApiError.js';

// ── Admin-triggered (protected, mounted under /admin/billing) ──

// POST /admin/billing/:schoolId/initiate-payment
export const initiatePayment = asyncHandler(async (req, res) => {
  const result = await paymentService.initiatePayment(req.params.schoolId);
  return ok(res, result, result.reused ? 'Reusing an in-progress payment link' : 'Payment link generated');
});

// POST /admin/billing/:schoolId/refund
export const refundPayment = asyncHandler(async (req, res) => {
  const admin = await platformAdminRepository.findById(req.auth.sub);
  const result = await paymentService.requestRefund({
    schoolId: req.params.schoolId,
    amount: req.body.amount,
    remarks: req.body.remarks,
    requestedBy: admin?.name || req.auth.sub,
  });
  return ok(res, result, 'Refund request submitted to Pesapal');
});

// POST /admin/billing/:schoolId/cancel-payment
export const cancelPayment = asyncHandler(async (req, res) => {
  const admin = await platformAdminRepository.findById(req.auth.sub);
  const result = await paymentService.cancelPendingPayment({
    schoolId: req.params.schoolId,
    requestedBy: admin?.name || req.auth.sub,
  });
  return ok(res, result, 'Payment attempt cancelled');
});

// GET /admin/billing/:schoolId/transaction
export const getLatestTransaction = asyncHandler(async (req, res) => {
  const tx = await paymentTransactionRepository.findLatestForSchool(req.params.schoolId);
  return ok(res, tx ? toPaymentTransactionDTO(tx) : null);
});

// ── Public — Pesapal calls these directly, no auth possible (mounted under /payments) ──

// GET|POST /payments/pesapal/ipn
export const pesapalIpn = asyncHandler(async (req, res) => {
  const source = req.method === 'GET' ? req.query : req.body;
  const orderTrackingId = source.OrderTrackingId || source.orderTrackingId;
  const orderMerchantReference = source.OrderMerchantReference || source.orderMerchantReference;
  const orderNotificationType = source.OrderNotificationType || source.orderNotificationType;

  if (!orderTrackingId) {
    // Still respond in Pesapal's expected shape even on malformed input —
    // returning a generic 400 here would just cause Pesapal to retry blindly.
    return res.status(200).json({
      orderNotificationType: orderNotificationType || 'UNKNOWN',
      orderTrackingId: orderTrackingId || '',
      orderMerchantReference: orderMerchantReference || '',
      status: 500,
    });
  }

  const responseStatus = await paymentService.handleIpn({
    orderTrackingId,
    orderMerchantReference,
    orderNotificationType,
    rawPayload: source,
  });

  return res.status(200).json({
    orderNotificationType,
    orderTrackingId,
    orderMerchantReference,
    status: responseStatus,
  });
});

// GET /payments/pesapal/status/:orderTrackingId
// Called by the frontend callback page (PaymentCallback.jsx) once Pesapal
// redirects the payer's browser there — the callback URL itself carries
// no status, per the doc, so the page fetches it from here.
export const getPublicTransactionStatus = asyncHandler(async (req, res) => {
  const { orderTrackingId } = req.params;
  if (!orderTrackingId) throw ApiError.badRequest('orderTrackingId is required');

  const { transaction } = await paymentService.reconcileByOrderTrackingId(orderTrackingId);
  return ok(res, {
    status: transaction.status,
    amount: transaction.amount,
    currency: transaction.currency,
    paymentMethod: transaction.paymentMethod,
    confirmationCode: transaction.confirmationCode,
  });
});
