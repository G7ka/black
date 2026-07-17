import { baseLayout } from './_layout.js';

// Sent when a school admin creates a teacher/student/parent login.
export function userRegistrationConfirmationTemplate({ fullName, schoolName, loginUrl, identifier }) {
  const subject = `Your ${schoolName} account is ready`;
  const text = `Hi ${fullName}, your EduManage account for ${schoolName} has been created. Login with: ${identifier}. Portal: ${loginUrl}`;
  const html = baseLayout({
    title: 'Your account is ready',
    bodyHtml: `
      <p style="color:#334155;font-size:14px;">Hi ${fullName},</p>
      <p style="color:#334155;font-size:14px;">Your account for <strong>${schoolName}</strong> has been created.</p>
      <p style="color:#334155;font-size:14px;">Login ID: <strong>${identifier}</strong></p>
      <p style="color:#334155;font-size:14px;">Portal: <a href="${loginUrl}">${loginUrl}</a></p>
    `,
  });
  return { subject, text, html };
}
