import { sendMail } from '../services/mailer.service.js';
import { userRegistrationConfirmationTemplate } from './templates/userRegistrationConfirmation.js';
import { schoolRegistrationReceivedTemplate } from './templates/schoolRegistrationReceived.js';
import { platformAdminNotificationTemplate } from './templates/platformAdminNotification.js';
import { schoolAdminNotificationTemplate } from './templates/schoolAdminNotification.js';
import { passwordResetCodeTemplate } from './templates/passwordResetCode.js';
import { passwordResetCompletedTemplate } from './templates/passwordResetCompleted.js';
import { loginSecurityNotificationTemplate } from './templates/loginSecurityNotification.js';
import { accountActivationTemplate } from './templates/accountActivation.js';
import { accountSuspensionTemplate } from './templates/accountSuspension.js';
import { systemAnnouncementTemplate } from './templates/systemAnnouncement.js';
import { applicationRejectedTemplate } from './templates/applicationRejected.js';
import { invoicePaymentConfirmedTemplate } from './templates/invoicePaymentConfirmed.js';
import { paymentFailedTemplate } from './templates/paymentFailed.js';

/**
 * EMAIL_TYPES maps a stable type key -> template renderer. This is the
 * single place that knows about all 11 required notification types.
 *
 * `enqueue()` executes synchronously today. When a real queue (BullMQ +
 * Redis) is introduced in Phase 8, only the body of `enqueue()` changes
 * to `await queue.add(type, { to, params })` — no call site in the rest
 * of the app needs to change.
 */
const EMAIL_TYPES = {
  USER_REGISTRATION_CONFIRMATION: userRegistrationConfirmationTemplate,
  SCHOOL_REGISTRATION_RECEIVED: schoolRegistrationReceivedTemplate,
  PLATFORM_ADMIN_NOTIFICATION: platformAdminNotificationTemplate,
  SCHOOL_ADMIN_NOTIFICATION: schoolAdminNotificationTemplate,
  PASSWORD_RESET_CODE: passwordResetCodeTemplate,
  PASSWORD_RESET_COMPLETED: passwordResetCompletedTemplate,
  LOGIN_SECURITY_NOTIFICATION: loginSecurityNotificationTemplate,
  ACCOUNT_ACTIVATION: accountActivationTemplate,
  ACCOUNT_SUSPENSION: accountSuspensionTemplate,
  SYSTEM_ANNOUNCEMENT: systemAnnouncementTemplate,
  APPLICATION_REJECTED: applicationRejectedTemplate,
  INVOICE_PAYMENT_CONFIRMED: invoicePaymentConfirmedTemplate,
  PAYMENT_FAILED: paymentFailedTemplate,
};

export async function enqueueEmail({ type, to, params }) {
  const render = EMAIL_TYPES[type];
  if (!render) {
    console.error(`[MAIL] Unknown email type: ${type}`);
    return { success: false, error: 'unknown_email_type' };
  }

  const { subject, text, html } = render(params);
  return sendMail({ to, subject, text, html, type });
}
