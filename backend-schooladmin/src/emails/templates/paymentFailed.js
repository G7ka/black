import { baseLayout } from './_layout.js';

export function paymentFailedTemplate({ schoolName, amount, currency, period, reason }) {
  const subject = `Payment unsuccessful — ${schoolName}`;
  const text = `Your payment of ${currency} ${amount} for ${period} was not successful. ${reason || ''} Please try again.`;
  const html = baseLayout({
    title: 'Payment Unsuccessful',
    bodyHtml: `
      <p style="color:#334155;font-size:14px;">Your payment attempt for <strong>${schoolName}</strong> (${period}, ${currency} ${Number(amount).toLocaleString()}) was not successful.</p>
      ${reason ? `<p style="color:#dc2626;font-size:13px;">${reason}</p>` : ''}
      <p style="color:#334155;font-size:13px;">Please try again or contact your account manager for help.</p>
    `,
  });
  return { subject, text, html };
}
