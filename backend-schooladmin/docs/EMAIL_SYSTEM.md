# Email System

## Policy

Self-hosted SMTP only. No SendGrid, Mailgun, SES, Resend, Firebase, or
Supabase mail — this was a hard requirement, verified in `src/config/mailTransport.js`
and `.env.example`. If you're reading this considering adding one back,
don't — re-read the Phase 2 review gate in project history first.

## Configuration

```
MAIL_MAILER=smtp
MAIL_HOST=mail.yourdomain.com
MAIL_PORT=465
MAIL_USERNAME=you@yourdomain.com
MAIL_PASSWORD=********
MAIL_ENCRYPTION=ssl        # 'ssl' (port 465, implicit TLS) or 'tls' (port 587, STARTTLS)
MAIL_FROM_ADDRESS=you@yourdomain.com
MAIL_FROM_NAME="Your Platform Name"
```

## How a send works

```
enqueueEmail({ type, to, params })
  → looks up the template renderer for `type`
  → renders { subject, text, html }
  → sendMail({ to, subject, text, html, type })
      → nodemailer transporter.sendMail(...)
      → on success: EmailLog row (status=SENT)
      → on failure: EmailLog row (status=FAILED, error message) — never throws
```

**Never throws** is deliberate: a mail server hiccup must not fail the
business operation that triggered it (e.g. school registration should
still succeed even if the confirmation email bounces). Every attempt is
logged either way, so failures are debuggable via Developer
Tools → Logs or Monitoring → Activity Log, not silently lost.

## The 10 notification types

| Type key | Trigger | Template file |
|---|---|---|
| `USER_REGISTRATION_CONFIRMATION` | A school admin creates a teacher/student/parent login (endpoint lands in a later phase; template exists now) | `userRegistrationConfirmation.js` |
| `SCHOOL_REGISTRATION_RECEIVED` | Public school registration submitted | `schoolRegistrationReceived.js` |
| `PLATFORM_ADMIN_NOTIFICATION` | New school application (fans out to all active Super Admins) | `platformAdminNotification.js` |
| `SCHOOL_ADMIN_NOTIFICATION` | SAHome "Send Alert", billing reminders, support replies | `schoolAdminNotification.js` |
| `PASSWORD_RESET_CODE` | Forgot-password step 1, and every "set your own password" credential handoff (new admin, admin-created school) | `passwordResetCode.js` |
| `PASSWORD_RESET_COMPLETED` | Forgot-password step 3 success | `passwordResetCompleted.js` |
| `LOGIN_SECURITY_NOTIFICATION` | Every successful login, both audiences (fire-and-forget, never blocks login) | `loginSecurityNotification.js` |
| `ACCOUNT_ACTIVATION` | School approved | `accountActivation.js` |
| `ACCOUNT_SUSPENSION` | School suspended | `accountSuspension.js` |
| `APPLICATION_REJECTED` | School application rejected | `applicationRejected.js` |
| `SYSTEM_ANNOUNCEMENT` | Emergency broadcast | `systemAnnouncement.js` |

(11 in the original requirement list — "password reset request" and
"password reset verification code" are the same email in practice, since
requesting a reset *is* how the code gets delivered.)

## Adding a new notification type

1. Add a template file in `src/emails/templates/` exporting
   `({ ...params }) => ({ subject, text, html })`. Use `baseLayout()` from
   `_layout.js` for consistent branding.
2. Register it in `EMAIL_TYPES` in `src/emails/emailQueue.js`.
3. Call `enqueueEmail({ type: 'YOUR_TYPE', to, params })` from wherever
   the trigger lives — a service, never a controller.

No other file needs to change. This is deliberate: `emailQueue.js` is the
single seam where a real queue (BullMQ + Redis) gets introduced in a
production-readiness phase — only its internals change, not any call site.

## Secrets

Third-party integration keys entered via Configuration → Integrations
(Africa's Talking, MTN MoMo, Airtel Money, AWS, etc. — unrelated to the
mail system itself, but stored the same way) are encrypted with
AES-256-GCM (`src/utils/crypto.js`) using `ENCRYPTION_KEY` and are only
ever returned to the client masked, never decrypted for display.
