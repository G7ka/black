import { baseLayout } from './_layout.js';

export function applicationRejectedTemplate({ contactName, schoolName, reason }) {
  const subject = `Update on your ${schoolName} application`;
  const text = `Hi ${contactName}, your application for ${schoolName} was not approved. Reason: ${reason}. You may correct the issue and reapply.`;
  const html = baseLayout({
    title: 'Application Not Approved',
    bodyHtml: `
      <p style="color:#334155;font-size:14px;">Hi ${contactName},</p>
      <p style="color:#334155;font-size:14px;">Your application for <strong>${schoolName}</strong> was not approved at this time.</p>
      <p style="color:#334155;font-size:13px;">Reason: ${reason}</p>
      <p style="color:#334155;font-size:13px;">You're welcome to correct the issue and submit a new application.</p>
    `,
  });
  return { subject, text, html };
}
