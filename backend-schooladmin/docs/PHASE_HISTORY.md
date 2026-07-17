# Phase History

## Phase 1 — Project Inspection
Read the frontend (App.jsx, routing, DashboardLayout, all Super Admin
pages, auth pages, tenant.js). Determined the multi-tenant subdomain
model, required entities, and auth flows before writing any backend code.

## Phase 2 — Authentication
- Prisma models: `School`, `PlatformAdmin`, `User`, `PasswordResetToken`, `RefreshToken`
- Platform login, tenant login (identifier resolution: email/username/studentCode),
  refresh/logout, 3-step forgot-password (shared by both audiences via `audience` param)
- Public school registration endpoint (multipart, license upload)
- **Review gate correction:** initial email implementation was a console.log
  stub — replaced with real self-hosted SMTP (Nodemailer), a template layer
  separated from business logic, an `EmailLog` table, and non-throwing
  send behavior. See `EMAIL_SYSTEM.md`.

## Phase 3 — Platform Owner (Super Admin)
Full backend for all 10 Super Admin pages: Schools management (approve/
reject/suspend/delete/rename/impersonate/add), Billing (global price,
per-school invoices, reminders), Platform Admins (add/remove, protected
against removing the last Super Admin or yourself), Support Tickets,
Configuration (branding/features/security/integrations — secrets
encrypted at rest), Developer Tools (real API keys, real log search),
Emergency Controls (real force-logout, real maintenance-mode flag, honest
rejection of fake rollback, real broadcast), Analytics and Monitoring
(real DB aggregates and real OS/process stats only — no fabricated
numbers for metrics that don't have real data behind them yet, e.g.
churn rate, CAC/LTV, teacher headcounts).

## Phase 4 — Database Optimization
Added indexes matched to actual query patterns (not speculative), removed
indexes made redundant by existing composite uniques, fixed an N+1 in
lazy invoice generation (batched `createMany` + single re-fetch instead
of one insert per school), documented connection-pool tuning, added
dev-time slow-query logging (Prisma query events, configurable threshold).

## Phase 5 — Frontend Integration
Wired the real frontend to the real API: axios client with JWT attach +
silent refresh-on-401, `AuthContext` + `ProtectedRoute`, all 4 auth pages,
all 10 Super Admin pages. Removed two mock UI elements that had zero
backend behind them (DevTools sandbox mode/fake request player, Emergency
rollback button) rather than wire them to nothing — consistent with the
no-fabrication principle from Phase 3.

## Phase 6 — Documentation *(this phase)*
`README.md`, `docs/API_REFERENCE.md`, `docs/ARCHITECTURE.md`,
`docs/DATABASE_SCHEMA.md`, `docs/EMAIL_SYSTEM.md`, this file, plus
per-phase Postman collections in `postman/`.

## School Administration (complete)
*(Phase 7 track — first frontend module after the Pesapal production
enhancement)*

Backend complete: Classes/Streams/Subjects, Teachers (staff creation
reuses the set-password-email pattern from Phase 3, leave management,
class assignment), Students (enrollment with find-or-create parent
linking, auto-generated `STU-{year}-####` codes, relocation, promotion),
Parents, Attendance (real per-class aggregation), Timetable, Fees (class
fee structures + a real payment ledger with computed status), tenant-side
Configuration (distinct from platform config, includes a real read-only
view of the school's own Pesapal subscription invoice), Alerts (email-only
— SMS/App recorded but not fabricated as delivered), Reports, and
tenant-side Support ticket wiring (reusing the Phase 3 `SupportTicket`
model, not a new one). One model set serves both Primary and Secondary —
streams are optional data on a class, not a schema fork.

Frontend: all 12 Primary pages wired end-to-end (Home, Classes, Teachers,
Students, Parents, Attendance, Timetable, Fees, Reports, Configuration,
Support, Alerts). Secondary variants implemented as thin wrappers around
the identical wired Primary components (passing `role="schooladmin-secondary"`)
wherever the two are genuinely the same feature — zero logic duplication —
except `SecondaryAdminClasses.jsx`, which has its own real implementation
for stream management (add/remove/view streams), since that's the one
place Primary and Secondary genuinely differ. Enrollment and Timetable
forms are stream-aware (show a stream picker when the selected class has
streams), so the shared Students/Timetable pages work correctly for both
levels without a second set of components.

A real module-resolution bug was caught and fixed during this module:
every service file under `src/services/schoolAdmin/` was importing
`../repositories/...` (one level too shallow, since those files live one
directory deeper than the top-level services) instead of
`../../repositories/...`. `node --check` only validates syntax, not
import resolution, so this was caught by a dedicated resolution-walk
script, not by the syntax check alone — worth remembering for future
nested-directory service files.

Honest scope calls, not silently skipped: bulk auto-promotion by score
threshold isn't implemented (no Grades module exists yet to know real
scores); Excel/CSV bulk import isn't wired (no file-parsing pipeline);
PDF/Excel report file generation isn't wired (no document pipeline);
per-payment receipt download isn't wired. Every one of these is flagged
in the UI itself, not silently missing.

## Production Enhancement — Pesapal Payment Integration
*(inserted after Phase 6, before Phase 7 — a production requirement, not
a new numbered phase)*

Replaced the non-functional part of Billing (Invoice.status was never
actually settable to PAID by anything) with a real Pesapal API 3.0
integration: authentication (token caching), IPN registration, order
submission, callback + IPN reconciliation (idempotent, shared code path),
refund and order cancellation — every documented constraint enforced in
code (single refund, single cancellation, pending/failed-only
cancellation). New models `PaymentTransaction` and `PesapalIpnEvent`.
Full detail in `PESAPAL_INTEGRATION.md`. Frontend: `SASubscriptions.jsx`
gained Pay/Refund/Cancel actions per school; one new minimal public page
(`PaymentCallback.jsx`) was added since the redirect flow requires
somewhere for the payer's browser to land — no other page was touched.

## Not yet built (upcoming phases)
- **Phase 7 — Testing:** no automated test suite exists yet (unit/integration/e2e).
- **Phase 8 — Production readiness:** real deployment rollback (CI/CD
  integration), scheduled invoice generation (cron, replacing lazy
  generation), a real metrics/observability pipeline (replacing dev-only
  slow-query logging and the OS-stats-based monitoring page), queue-backed
  email (Redis/BullMQ, replacing the currently-synchronous `emailQueue.js`),
  and academic-data entities (students/teachers/classes/grades/attendance)
  that several Super Admin metrics are waiting on.
