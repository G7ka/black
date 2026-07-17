import { baseLayout } from './_layout.js';

export function passwordResetCompletedTemplate({ occurredAt }) {
  const subject = 'Your EduManage password was changed';
  const text = `Your password was successfully changed at ${occurredAt}. If this wasn't you, contact support immediately.`;
  const html = baseLayout({
    title: 'Password changed',
    bodyHtml: `
      <p style="color:#334155;font-size:14px;">Your password was successfully changed at <strong>${occurredAt}</strong>.</p>
      <p style="color:#dc2626;font-size:13px;">If this wasn't you, contact support immediately — your account may be compromised.</p>
    `,
  });
  return { subject, text, html };
}
