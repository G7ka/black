import { baseLayout } from './_layout.js';

export function accountSuspensionTemplate({ recipientName, contextLabel, reason }) {
  const subject = `${contextLabel} has been suspended`;
  const text = `Hi ${recipientName}, ${contextLabel} has been suspended. Reason: ${reason || 'Not provided'}. Contact support for details.`;
  const html = baseLayout({
    title: `${contextLabel} suspended`,
    bodyHtml: `
      <p style="color:#334155;font-size:14px;">Hi ${recipientName},</p>
      <p style="color:#334155;font-size:14px;"><strong>${contextLabel}</strong> has been suspended.</p>
      ${reason ? `<p style="color:#334155;font-size:13px;">Reason: ${reason}</p>` : ''}
      <p style="color:#334155;font-size:13px;">Contact support if you believe this is a mistake.</p>
    `,
  });
  return { subject, text, html };
}
