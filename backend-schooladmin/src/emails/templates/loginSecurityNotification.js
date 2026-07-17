import { baseLayout } from './_layout.js';

export function loginSecurityNotificationTemplate({ fullName, occurredAt, ipAddress }) {
  const subject = 'New login to your EduManage account';
  const text = `Hi ${fullName}, a login to your account was detected at ${occurredAt} from IP ${ipAddress}. If this wasn't you, reset your password immediately.`;
  const html = baseLayout({
    title: 'New login detected',
    bodyHtml: `
      <p style="color:#334155;font-size:14px;">Hi ${fullName},</p>
      <p style="color:#334155;font-size:14px;">A login to your account was detected:</p>
      <p style="color:#334155;font-size:13px;">Time: <strong>${occurredAt}</strong><br/>IP address: <strong>${ipAddress}</strong></p>
      <p style="color:#dc2626;font-size:13px;">If this wasn't you, reset your password immediately.</p>
    `,
  });
  return { subject, text, html };
}
