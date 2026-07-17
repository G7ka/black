# Database Schema

Full source of truth: `prisma/schema.prisma`. This document explains the
*why* behind each model and index, not just the *what*.

## Core identity models

### `School`
The tenant. `subdomain` is globally unique and is how every tenant request
gets routed. `status` (`PENDING → ACTIVE`/`REJECTED`, `ACTIVE ↔ SUSPENDED`)
gates login on the tenant side. `pricePerStudent` exists on the row but
billing actually reads the platform-wide value from `PlatformConfig` —
the per-school field is a placeholder for a future per-school override,
not currently used by the billing service.

### `PlatformAdmin`
Main-domain login. `role` drives `requireRole()` checks across
`/admin/*` routes.

### `User`
Every tenant-side login (school admin, teacher, student, parent) —
one polymorphic table distinguished by `role`, not five separate tables.
Identifiers (`email`, `username`, `studentCode`) are **unique per school**,
not globally — `@@unique([schoolId, email])` etc. — because two different
schools may legitimately have a `admin@school.com`-style collision, or a
`STU-001` student code reused across schools.

## Auth support

- `PasswordResetToken` — hashed 6-digit codes, `ownerType`/`ownerId` polymorphic
  across `PLATFORM_ADMIN`/`USER`, `consumedAt` prevents replay.
- `RefreshToken` — hashed token, revocable individually or in bulk
  (`revokedAt`), which is what powers both normal logout and Emergency
  ⇒ Force Logout.

## Phase 3 (Super Admin) models

- `SupportTicket` / `TicketReply` — one ticket, many replies, `authorType`
  distinguishes platform-admin replies from school-side replies (the
  latter isn't wired to an endpoint yet — tenant support pages are a
  later phase, but the schema already supports it).
- `Invoice` — one row per `(schoolId, period)` — the unique constraint is
  what makes "lazy generation" in the billing service safe (can't double-
  create an invoice for the same month).
- `PlatformConfig` — generic key/value (JSON) store for anything that's
  "one row of settings," to avoid a new table per settings tab
  (`appearance`, `branding`, `features`, `security`, `integrations`,
  `maintenanceMode`, `billing` all live here as separate keys).
- `ApiKey` — only the SHA-256 hash and a display prefix are stored; the
  raw key is returned exactly once, at creation.
- `EmergencyAuditLog` — every sensitive action (approve/reject/suspend/
  delete/rename/impersonate school, emergency controls) writes here.
  Not just for Emergency Controls — the name predates the broader usage.
- `EmailLog` — every email send attempt, success or failure, feeds both
  the Developer Tools/Monitoring "activity log" views and lets you
  actually debug SMTP problems instead of guessing.

## Payment models (Pesapal integration)

- `PaymentTransaction` — one row per Pesapal order attempt (`SubmitOrderRequest`
  call), linked to the `Invoice` it's paying. `merchantReference` and
  `orderTrackingId` are both `@unique`. Stores the raw Pesapal responses
  (`rawSubmitResponse`, `rawStatusResponse`) as `Json` for debugging/audit
  without needing to re-call the API. Refund/cancellation state lives on
  the same row (`refundRequestedAt`, `refundStatus`, `cancelledAt`) since
  the doc only allows one of each per transaction.
- `PesapalIpnEvent` — every IPN call Pesapal makes, logged *before*
  processing starts. This is what makes duplicate-callback protection
  something you can actually verify happened, not just trust. See
  `PESAPAL_INTEGRATION.md`.

## Indexing decisions (Phase 4)

Indexes were added to match actual query patterns in the service layer,
not speculatively:

| Table | Index | Backs |
|---|---|---|
| `School` | `[level]`, `[district]`, `[status, level]` | Admin list filters (`SASchools.jsx`) |
| `User` | `[schoolId, role]`, `[schoolId, status]` | Per-school role/status queries (Phase 5+ tenant dashboards) |
| `SupportTicket` | `[schoolId]`, `[status]`, `[createdAt]` | List filters + ordering |
| `Invoice` | `[status]`, `[status, dueDate]` | Overdue-invoice queries (monitoring alerts, billing summary) |
| `EmailLog` | `[status, createdAt]` | "Failures in the last 24h" monitoring alert |
| `EmergencyAuditLog` | `[createdAt]`, `[action]` | Audit log pagination/lookup |
| `RefreshToken` | `[revokedAt, expiresAt]` | Active-session counts, force-logout bulk update |

Deliberately **not** added where a composite unique index already covers
the query as a leftmost-column prefix (e.g. `User.schoolId` alone doesn't
need its own index — `[schoolId, email]` already serves it).

## Cascade rules

Every child-of-`School` relation uses `onDelete: Cascade`. Deleting a
school (Super Admin "Delete School") removes its users, documents,
tickets, and invoices in one transaction-safe operation — no orphaned rows.
