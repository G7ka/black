import { baseLayout } from './_layout.js';

export function invoicePaymentConfirmedTemplate({ schoolName, amount, currency, period, confirmationCode, paymentMethod }) {
  const subject = `Payment received — ${schoolName}`;
  const text = `Payment of ${currency} ${amount} for ${period} was received via ${paymentMethod}. Confirmation code: ${confirmationCode}.`;
  const html = baseLayout({
    title: 'Payment Received',
    bodyHtml: `
      <p style="color:#334155;font-size:14px;">We've received your payment for <strong>${schoolName}</strong>.</p>
      <table style="width:100%;font-size:13px;color:#334155;margin-top:12px;">
        <tr><td style="padding:4px 0;color:#94a3b8;">Period</td><td style="text-align:right;font-weight:bold;">${period}</td></tr>
        <tr><td style="padding:4px 0;color:#94a3b8;">Amount</td><td style="text-align:right;font-weight:bold;">${currency} ${Number(amount).toLocaleString()}</td></tr>
        <tr><td style="padding:4px 0;color:#94a3b8;">Method</td><td style="text-align:right;">${paymentMethod}</td></tr>
        <tr><td style="padding:4px 0;color:#94a3b8;">Confirmation Code</td><td style="text-align:right;font-family:monospace;">${confirmationCode}</td></tr>
      </table>
      <p style="color:#94a3b8;font-size:12px;margin-top:16px;">Keep this email as your payment receipt.</p>
    `,
  });
  return { subject, text, html };
}
