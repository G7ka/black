import { getTransporter } from '../config/mailTransport.js';
import { env } from '../config/env.js';
import { emailLogRepository } from '../repositories/emailLog.repository.js';

/**
 * Sends mail through our own SMTP server (see config/mailTransport.js).
 * Never throws — a mail failure must not break the calling business flow
 * (e.g. school registration must still succeed even if the confirmation
 * email fails to send). Failures are persisted to EmailLog for follow-up.
 */
export async function sendMail({ to, subject, text, html, type = 'generic' }) {
  const from = `"${env.mail.fromName}" <${env.mail.fromAddress}>`;

  try {
    await getTransporter().sendMail({ from, to, subject, text, html });
    await emailLogRepository.logSent({ type, recipient: to, subject });
    return { success: true };
  } catch (error) {
    console.error(`[MAIL:FAILED] type=${type} to=${to} subject="${subject}" —`, error.message);
    try {
      await emailLogRepository.logFailed({ type, recipient: to, subject, error: error.message });
    } catch (logErr) {
      console.error('[MAIL:LOG_FAILED] Could not persist email failure log —', logErr.message);
    }
    return { success: false, error: error.message };
  }
}
