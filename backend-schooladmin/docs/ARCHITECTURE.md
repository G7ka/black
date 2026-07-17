# Architecture

## Multi-tenancy model

Subdomain-based. One `School` row = one tenant. Two separate "sides":

- **Main domain** (`edumanage.ug` / dev: no subdomain) — public marketing
  pages, school registration, and the Super Admin platform. Auth type: `platform`.
- **Tenant subdomain** (`{subdomain}.edumanage.ug` / dev: `*.lvh.me:5173`) —
  a single school's portal (school admin, teacher, student, parent logins).
  Auth type: `tenant`.

The backend resolves which school a request belongs to from the `Host`
header (or `X-Tenant-Subdomain` override for API clients) — see
`src/utils/tenant.js`. Every tenant-scoped table has a `schoolId` foreign
key; every tenant query is filtered by it. There is no shared "cross-tenant"
query path in the codebase — a bug that leaked another school's data would
have to bypass the repository layer entirely.

## Auth: two independent JWT audiences

A single access token is never valid for both sides. The payload always
carries `type: 'platform' | 'tenant'`:

```
platform: { sub: platformAdminId, type: 'platform', role }
tenant:   { sub: userId, type: 'tenant', role, schoolId }
```

- `authenticate` middleware verifies the signature/expiry only.
- `requirePlatformAuth` / `requireTenantAuth` check `type`.
- `requireRole(...)` checks `role` within that type.
- `enforceTenantScope` (tenant-side protected routes, used from Phase 5+
  tenant dashboards) additionally checks the JWT's `schoolId` against the
  subdomain the request arrived on — a stolen tenant token from School A
  can't be replayed against School B's subdomain.

Refresh tokens are opaque JWTs whose hash is stored in `RefreshToken` and
can be individually or platform-wide revoked (used by Emergency ⇒ Force
Logout, and automatically on password reset).

## Request lifecycle (typical write endpoint)

```
route → rateLimiter? → validate(zodSchema) → authenticate → requireRole
  → controller (thin: pull req.body/params, call service, format response)
    → service (business logic, calls 1+ repositories, may enqueue email)
      → repository (only Prisma calls, no business logic)
```

Controllers never call Prisma directly. Services never touch `req`/`res`.
This is enforced by convention, not tooling — reviewers should push back
on violations.

## Email system

See `EMAIL_SYSTEM.md`. Short version: self-hosted SMTP only, templates
separated from business logic, every send attempt logged (success or
failure) to `EmailLog`, never blocks the calling request flow.

## Honesty principle (applies to every phase, not just one)

Where the frontend mock implied data or capabilities the backend can't
genuinely provide yet (fake CPU graphs, teacher headcounts before academic
entities exist, a rollback button with no CI/CD integration, a sandbox
mode with no request interception), the response has consistently been:
**return real data or a clear "not available yet," never a fabricated
number or a button that lies about what it did.** This shows up in:
Phase 3 analytics/monitoring, Phase 5's removal of the DevTools sandbox
and Emergency rollback button, and the `EmailLog`/`EmergencyAuditLog`
tables backing every "system activity" view instead of hardcoded sample
rows.

## Known gaps (by design, not oversight)

- No academic entities yet (students/teachers/classes/grades/attendance) —
  planned for a dedicated phase; several Super Admin metrics (teacher
  counts, real enrolled-student counts vs. self-reported) depend on it.
- No scheduled jobs — invoice generation is lazy (created on first read of
  a billing period), not cron-driven. Fine at current scale; revisit if
  billing reads become a bottleneck.
- No real deployment rollback, log aggregation service, or metrics
  pipeline — Emergency/Monitoring/DevTools are honest about this rather
  than faking it (see above).
- Rate limiting and slow-query logging are dev-time safety nets, not a
  production-grade observability stack (no persisted request logs, no
  APM). Production readiness phase.
