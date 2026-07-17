# API Reference

Base URL: `{{baseUrl}}` = `http://localhost:4000/api/v1` (dev)

All responses share this envelope:
```json
{ "success": true, "message": "...", "data": { } }
```
Errors: `{ "success": false, "message": "...", "details": null | {...} }`

**Auth header:** `Authorization: Bearer <accessToken>`
**Tenant header:** `X-Tenant-Subdomain: <subdomain>` — required on tenant-side
requests when the client can't hit a real subdomain (e.g. Postman, or the
Vite dev server hitting a single API host). In production, the real `Host`
header subdomain is used automatically.

---

## Auth (`/auth`)

| Method | Path | Auth | Body | Notes |
|---|---|---|---|---|
| POST | `/auth/platform/login` | none | `{ email, password, rememberMe? }` | Super Admin / platform team login |
| POST | `/auth/tenant/login` | none + `X-Tenant-Subdomain` | `{ identifier, password, rememberMe? }` | `identifier` = email, username, or student code — server resolves which |
| POST | `/auth/refresh` | none | `{ refreshToken }` | Rotates the refresh token; old one is revoked |
| POST | `/auth/logout` | none | `{ refreshToken }` | Revokes that refresh token |
| GET | `/auth/me` | Bearer | — | Returns the decoded JWT payload (`sub`, `type`, `role`, `schoolId?`) |
| POST | `/auth/forgot-password/request` | none | `{ email, audience: 'platform'\|'tenant' }` | Always returns success (no account enumeration) |
| POST | `/auth/forgot-password/verify` | none | `{ email, audience, code }` | Validates the 6-digit code without consuming it |
| POST | `/auth/forgot-password/reset` | none | `{ email, audience, code, newPassword }` | Consumes the code, revokes all refresh tokens for that account |

## Public school registration (`/schools`)

| Method | Path | Auth | Body | Notes |
|---|---|---|---|---|
| GET | `/schools/check-subdomain?subdomain=` | none | — | `{ available, reason? }` |
| POST | `/schools/register` | none | multipart/form-data | Fields: `schoolName, level, physicalAddress, district, numStudents, contactName, contactPhone, contactEmail, schoolWebsite?, subdomain, adminUsername, adminPassword, confirmPassword, recoveryEmail, licenseFile?` — creates School (PENDING) + first schooladmin (PENDING) |

## Super Admin — Schools (`/admin/schools`) — `SUPER_ADMIN` only

| Method | Path | Body/Query | Notes |
|---|---|---|---|
| GET | `/admin/schools` | `?status&level&search&page&pageSize` | Paginated list |
| POST | `/admin/schools` | `{ schoolName, level, district, physicalAddress, numStudents, contactName, contactPhone, contactEmail, subdomain }` | Platform-created school, goes straight to ACTIVE; admin gets a set-password email code (no raw password ever emailed) |
| GET | `/admin/schools/:id` | — | Single school |
| POST | `/admin/schools/:id/approve` | — | PENDING → ACTIVE, activates admin user, sends activation email |
| POST | `/admin/schools/:id/reject` | `{ reason }` | PENDING → REJECTED |
| POST | `/admin/schools/:id/suspend` | `{ reason? }` | ACTIVE → SUSPENDED |
| POST | `/admin/schools/:id/reactivate` | — | SUSPENDED → ACTIVE |
| DELETE | `/admin/schools/:id` | — | Hard delete (cascades to users/documents/tickets/invoices) |
| PATCH | `/admin/schools/:id/name` | `{ newName }` | Renames school |
| POST | `/admin/schools/:id/impersonate` | — | Issues a short-lived tenant access token for the school's primary admin; audit-logged |

All destructive/sensitive actions above write an `EmergencyAuditLog` entry.

## Billing (`/admin/billing`) — `SUPER_ADMIN`, `FINANCE_ADMIN`

| Method | Path | Body | Notes |
|---|---|---|---|
| GET | `/admin/billing` | — | `{ schools: [...], summary: {...} }` — lazily generates this month's invoices for active schools if missing |
| PUT | `/admin/billing/price` | `{ pricePerStudent }` | Clamped to 2000–4000, rounded to nearest 500 |
| POST | `/admin/billing/:schoolId/remind` | — | Emails the school's contact about the current invoice |
| POST | `/admin/billing/:schoolId/initiate-payment` | — | Creates a real Pesapal order (`SubmitOrderRequest`) for the current invoice; returns `{ redirectUrl, orderTrackingId, merchantReference, reused }`. Reuses an in-flight order if one exists (<1hr old, still pending) instead of duplicating. |
| GET | `/admin/billing/:schoolId/transaction` | — | Latest `PaymentTransaction` for the school, or `null` |
| POST | `/admin/billing/:schoolId/refund` | `{ amount, remarks }` | Only on a `COMPLETED` transaction, once — see `PESAPAL_INTEGRATION.md` |
| POST | `/admin/billing/:schoolId/cancel-payment` | — | Only on `PENDING`/`FAILED`/`INVALID`, once |

## Payments — Pesapal-facing (`/payments`) — public, no auth possible

| Method | Path | Notes |
|---|---|---|
| GET, POST | `/payments/pesapal/ipn` | Pesapal's server-to-server notification. Responds `{ orderNotificationType, orderTrackingId, orderMerchantReference, status: 200\|500 }` exactly per the doc. Rate-limited (60/min), not JWT-protected — Pesapal cannot send one. |
| GET | `/payments/pesapal/status/:orderTrackingId` | Called by the frontend `PaymentCallback.jsx` page after Pesapal redirects the payer's browser here. Triggers the same idempotent reconciliation as the IPN. |

## Platform Admins (`/admin/platform-admins`) — `SUPER_ADMIN` only

| Method | Path | Body | Notes |
|---|---|---|---|
| GET | `/admin/platform-admins` | — | List all |
| POST | `/admin/platform-admins` | `{ name, email, role }` | `role` ∈ `SUPER_ADMIN\|FINANCE_ADMIN\|SUPPORT_AGENT\|CONTENT_MANAGER`. Sends set-password code by email. |
| DELETE | `/admin/platform-admins/:id` | — | Blocked: removing yourself, or the last active `SUPER_ADMIN` |

## Support Tickets (`/admin/support-tickets`) — `SUPER_ADMIN`, `SUPPORT_AGENT`

| Method | Path | Body/Query | Notes |
|---|---|---|---|
| GET | `/admin/support-tickets` | `?status&search&page&pageSize` | |
| GET | `/admin/support-tickets/stats` | — | Counts by status |
| GET | `/admin/support-tickets/:id` | — | Includes reply thread |
| POST | `/admin/support-tickets/:id/reply` | `{ body }` | Auto-flips OPEN→IN_PROGRESS on first admin reply; emails the school |
| POST | `/admin/support-tickets/:id/resolve` | — | → RESOLVED |

## Configuration (`/admin/configuration`) — `SUPER_ADMIN` only

| Method | Path | Body | Notes |
|---|---|---|---|
| GET | `/admin/configuration` | — | Returns `{ appearance, branding, features, security, integrations }` — integration secrets come back masked |
| PUT | `/admin/configuration/appearance` | `{ darkMode }` | |
| PUT | `/admin/configuration/branding` | `{ platformName, supportEmail, primaryColor, logoUrl?, emailFooter }` | |
| PUT | `/admin/configuration/features` | `{ sms, email, biometric, momo, airtel, s3, twoFactor, api }` (all booleans) | |
| PUT | `/admin/configuration/security` | `{ sessionTimeoutMinutes, maxLoginAttempts, ipWhitelist[], enforce2faForAdmins }` | |
| PUT | `/admin/configuration/integrations` | any subset of the 7 integration key fields | Values encrypted (AES-256-GCM) before storage; response is masked |

## Developer Tools (`/admin/developer-tools`) — `SUPER_ADMIN` only

| Method | Path | Body | Notes |
|---|---|---|---|
| GET | `/admin/developer-tools/api-keys` | — | List (hash never returned) |
| POST | `/admin/developer-tools/api-keys` | `{ name }` | Raw key returned **once** in the response — capture it immediately |
| POST | `/admin/developer-tools/api-keys/:id/revoke` | — | |
| GET | `/admin/developer-tools/logs?q=` | — | Real EmailLog + EmergencyAuditLog activity feed, optionally filtered |

## Emergency (`/admin/emergency`) — `SUPER_ADMIN` only

| Method | Path | Body | Notes |
|---|---|---|---|
| POST | `/admin/emergency/force-logout` | `{ reason }` | Revokes **every** active refresh token platform-wide (real) |
| POST | `/admin/emergency/shutdown` | `{ reason }` | Sets a real, checkable `maintenanceMode` config flag — does **not** stop the process |
| POST | `/admin/emergency/resume` | `{ reason }` | Clears the maintenance flag |
| POST | `/admin/emergency/rollback` | `{ reason }` | Always returns 400 — logs the request, explains rollback needs CI/CD, does not pretend to roll back code |
| POST | `/admin/emergency/broadcast` | `{ title?, message }` | Emails every ACTIVE school's contact |
| GET | `/admin/emergency/audit-log` | — | Last 100 sensitive actions across the platform |

## Analytics (`/admin/analytics`) — `SUPER_ADMIN`, `FINANCE_ADMIN`

| Method | Path | Notes |
|---|---|---|
| GET | `/admin/analytics/overview` | Real counts/sums only — no churn/CAC/LTV (not enough data to compute yet) |
| GET | `/admin/analytics/growth` | Real registration-date histogram, however many months of data exist |

## Monitoring (`/admin/monitoring`) — `SUPER_ADMIN` only

| Method | Path | Notes |
|---|---|---|
| GET | `/admin/monitoring/stats` | Real `os.loadavg()`/`os.freemem()`/`process.uptime()`/active-session count |
| GET | `/admin/monitoring/alerts` | Derived from real conditions (overdue invoices, recent failed emails, maintenance flag) |
| GET | `/admin/monitoring/logs` | Same feed as Developer Tools logs |

## Notifications (`/admin/notifications`) — `SUPER_ADMIN` only

| Method | Path | Body | Notes |
|---|---|---|---|
| POST | `/admin/notifications/school-message` | `{ schoolId: uuid \| 'all', messageType: 'info'\|'warning'\|'urgent', message }` | Emails one school or every ACTIVE school |

## School Administration (`/school/*`) — `SCHOOLADMIN_PRIMARY`, `SCHOOLADMIN_SECONDARY`

Tenant-side, requires `X-Tenant-Subdomain` (or real subdomain in prod) matching the JWT's `schoolId`. Shared by Primary and Secondary — level differences are data (streams exist or don't), not separate endpoints.

| Method | Path | Notes |
|---|---|---|
| GET, POST | `/school/classes` | List / create classes |
| POST, DELETE | `/school/classes/:classId/streams(/:streamId)` | Streams (Secondary uses these; Primary typically doesn't) |
| PUT | `/school/classes/:classId/subjects` | Set which subjects a class teaches |
| GET, POST, DELETE | `/school/classes/subjects(/:subjectId)` | School-wide subject catalog |
| GET, POST | `/school/teachers` | List / add (set-password email flow, same pattern as Phase 3) |
| GET | `/school/teachers/:id` | |
| POST | `/school/teachers/:id/leave\|activate\|deactivate` | Staff status |
| PUT | `/school/teachers/:id/classes` | Class/subject assignment |
| GET | `/school/teachers/absence-reports`, POST `/school/teachers/absence-reports/:id/review` | |
| GET, POST | `/school/students` | List / enroll (auto-generates `STU-{year}-####`, find-or-creates linked parent) |
| GET | `/school/students/:id` | |
| POST | `/school/students/:id/relocate\|promote\|repeat` | |
| POST | `/school/students/bulk-promote` | Explicit per-student decisions — see note below |
| GET, POST | `/school/parents` | |
| GET, PUT | `/school/parents/:id` | |
| POST | `/school/parents/:id/inactive\|activate` | |
| GET | `/school/attendance?date=` | Real per-class breakdown; zero until a Teacher module exists to mark it |
| GET | `/school/timetable/:classId?streamId=` | |
| POST, DELETE | `/school/timetable` / `/school/timetable/:classId` | |
| GET, POST | `/school/fees/structures` | Per-class tuition/lunch/activities |
| GET, POST | `/school/fees/payments` | Real payment ledger, status computed from actual sums |
| POST | `/school/fees/payments/:studentId/remind` | |
| GET, PUT | `/school/config`, `/school/config/info\|terms\|notifications` | Tenant-scoped settings, distinct from platform config |
| GET | `/school/config/billing` | The school's own EduManage subscription status (real Invoice from the Pesapal integration) — distinct from the parent fee ledger above |
| GET, POST | `/school/alerts` | Broadcast — delivered via email only (see note below) |
| GET | `/school/reports/overview?term=` | |
| GET, POST | `/school/support`, `/school/support/:id`, `/school/support/:id/reply` | Tenant-side wiring of the existing (Phase 3) `SupportTicket` model |

**Notes:**
- Bulk auto-promotion by score threshold isn't implemented — there's no Grades module yet to know real scores, and fabricating a pass/fail cutoff against data that doesn't exist would violate this project's no-fabrication standard. `bulk-promote` takes explicit per-student decisions instead.
- Alert `channel` (SMS/EMAIL/APP/EMERGENCY) is recorded for history, but every channel is actually delivered via email — there's no SMS gateway or push infrastructure wired up. The UI should be honest about this rather than implying SMS was sent.

## Health


| Method | Path | Notes |
|---|---|---|
| GET | `/health` | `{ success: true, message: 'OK' }` — no auth |

---

## Error codes you'll actually see

| Status | Meaning |
|---|---|
| 400 | Validation failure (Zod), or a deliberately-unsupported action (e.g. rollback) |
| 401 | Missing/invalid/expired JWT, or wrong credentials |
| 403 | Authenticated but wrong role/audience, or resource not in an actionable state (e.g. approving a non-PENDING school) |
| 404 | Resource not found |
| 409 | Conflict (duplicate subdomain/email, invalid state transition) |
| 429 | Rate limited (login attempts, password reset requests) |
| 500 | Unhandled server error |
