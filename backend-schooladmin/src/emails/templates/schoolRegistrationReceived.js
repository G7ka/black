import { baseLayout } from './_layout.js';

export function schoolRegistrationReceivedTemplate({ contactName, schoolName, subdomain }) {
  const portalUrl = `https://${subdomain}.edumanage.ug`;
  const subject = 'EduManage — Application Received';
  const text = `Thank you, ${contactName}. Your application for ${schoolName} has been received. Our team will review your documents within 24 hours. Your portal will be at ${portalUrl} once approved.`;
  const html = baseLayout({
    title: 'Application Received',
    bodyHtml: `
      <p style="color:#334155;font-size:14px;">Thank you, ${contactName}!</p>
      <p style="color:#334155;font-size:14px;">Your application for <strong>${schoolName}</strong> has been received. Our team will review your documents within <strong>24 hours</strong>.</p>
      <p style="color:#334155;font-size:14px;">Your portal will be live at <a href="${portalUrl}">${portalUrl}</a> once approved.</p>
    `,
  });
  return { subject, text, html };
}
