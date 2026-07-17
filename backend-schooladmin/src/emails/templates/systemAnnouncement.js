import { baseLayout } from './_layout.js';

export function systemAnnouncementTemplate({ title, message }) {
  const subject = `[EduManage Announcement] ${title}`;
  const text = message;
  const html = baseLayout({
    title,
    bodyHtml: `<p style="color:#334155;font-size:14px;">${message}</p>`,
  });
  return { subject, text, html };
}
