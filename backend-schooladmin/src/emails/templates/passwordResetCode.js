import { baseLayout } from './_layout.js';

// Covers both "password reset request" and "password reset verification
// code" requirements — the request action IS the code-delivery email.
export function passwordResetCodeTemplate({ code, expiresInMinutes }) {
  const subject = 'Your EduManage password reset code';
  const text = `Your verification code is ${code}. It expires in ${expiresInMinutes} minutes. If you did not request this, ignore this email.`;
  const html = baseLayout({
    title: 'Reset your password',
    bodyHtml: `
      <p style="color:#334155;font-size:14px;">Use the code below to reset your password. It expires in <strong>${expiresInMinutes} minutes</strong>.</p>
      <p style="text-align:center;margin:24px 0;">
        <span style="display:inline-block;padding:12px 24px;background:#f1f5f9;border-radius:10px;font-size:28px;font-weight:bold;letter-spacing:6px;color:#1d4ed8;">${code}</span>
      </p>
      <p style="color:#94a3b8;font-size:12px;">If you did not request this, you can safely ignore this email.</p>
    `,
  });
  return { subject, text, html };
}
