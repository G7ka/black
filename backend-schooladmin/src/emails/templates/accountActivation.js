import { baseLayout } from './_layout.js';

export function accountActivationTemplate({ recipientName, contextLabel, loginUrl }) {
  const subject = `${contextLabel} approved — you're all set`;
  const text = `Hi ${recipientName}, ${contextLabel} has been approved and activated. Log in at ${loginUrl}.`;
  const html = baseLayout({
    title: `${contextLabel} activated`,
    bodyHtml: `
      <p style="color:#334155;font-size:14px;">Hi ${recipientName},</p>
      <p style="color:#334155;font-size:14px;"><strong>${contextLabel}</strong> has been approved and is now active.</p>
      <p style="color:#334155;font-size:14px;">Log in here: <a href="${loginUrl}">${loginUrl}</a></p>
    `,
  });
  return { subject, text, html };
}
