export function baseLayout({ title, bodyHtml }) {
  return `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:24px 0;">
      <tr>
        <td align="center">
          <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;">
            <tr>
              <td style="background:#1d4ed8;padding:20px 28px;">
                <span style="color:#ffffff;font-size:18px;font-weight:bold;">EduManage</span>
              </td>
            </tr>
            <tr>
              <td style="padding:28px;">
                <h2 style="margin:0 0 12px;color:#0f172a;font-size:18px;">${title}</h2>
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:16px 28px;background:#f8fafc;color:#94a3b8;font-size:11px;">
                © ${new Date().getFullYear()} EduManage Uganda. This is an automated message.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
