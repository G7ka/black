import { baseLayout } from './_layout.js';

const typeColor = { info: '#2563eb', warning: '#d97706', urgent: '#dc2626' };

export function schoolAdminNotificationTemplate({ schoolName, messageType = 'info', message }) {
  const subject = `[EduManage] Notice for ${schoolName}`;
  const text = message;
  const html = baseLayout({
    title: 'Message from EduManage Platform',
    bodyHtml: `
      <p style="display:inline-block;padding:2px 10px;border-radius:999px;background:${typeColor[messageType] || typeColor.info}1a;color:${typeColor[messageType] || typeColor.info};font-size:11px;font-weight:bold;text-transform:uppercase;">${messageType}</p>
      <p style="color:#334155;font-size:14px;margin-top:12px;">${message}</p>
    `,
  });
  return { subject, text, html };
}
