# EduManage Backend

Multi-tenant School Management System API. Node.js + Express + PostgreSQL
(Prisma) + JWT. Built in phases — see `docs/PHASE_HISTORY.md` for what
shipped when.

## Stack
- **Runtime:** Node.js (ESM), Express 4
- **Database:** PostgreSQL via Prisma ORM
- **Auth:** JWT (access + rotating refresh tokens), two independent
  audiences — `platform` (Super Admin team) and `tenant` (school users)
- **Mail:** Self-hosted SMTP via Nodemailer (no third-party email APIs)
- **Validation:** Zod
- **Architecture:** Controllers → Services → Repositories, with
  Middlewares / Validators / DTOs / Utils as cross-cutting layers

## Quick start

```bash
cp .env.example .env
# edit .env: DATABASE_URL, JWT secrets, ENCRYPTION_KEY, MAIL_* (see below)

npm install
npx prisma migrate dev --name init
npm run prisma:seed        # creates hatalabdallah@gmail.com / ChangeMe123!
npm run dev                # http://localhost:4000
```

## Environment variables

See `.env.example` for the full list with inline explanations. Required
groups:

| Group | Vars | Notes |
|---|---|---|
| Database | `DATABASE_URL` | Include `connection_limit`/`pool_timeout` for production (see Phase 4 notes in `docs/ARCHITECTURE.md`) |
| JWT | `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `*_EXPIRES_IN` | Use long random strings in production, never reuse across environments |
| Encryption | `ENCRYPTION_KEY` | 64-char hex (32 bytes) — `openssl rand -hex 32`. Encrypts integration secrets at rest. |
| Mail | `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_ENCRYPTION`, `MAIL_FROM_ADDRESS`, `MAIL_FROM_NAME` | Self-hosted SMTP only — see `docs/EMAIL_SYSTEM.md` |
| CORS | `CORS_MAIN_DOMAIN`, `CORS_DEV_ORIGIN` | Controls which origins (main domain + tenant subdomains) can call the API |

## Project structure

```
prisma/
  schema.prisma        # all models — see docs/DATABASE_SCHEMA.md
  seed.js
src/
  config/              # env, prisma client, cors, mail transport, uploads
  middlewares/          # auth, tenant resolution, validation, rate limiting, errors
  utils/                # jwt, password/reset codes, crypto (AES-256-GCM), ApiError
  validators/           # zod schemas, one file per module
  dtos/                  # response shaping — strips password hashes etc
  repositories/          # all Prisma queries — no business logic
  services/              # business logic — no Express req/res
  controllers/            # thin — validate via middleware, call service, format response
  routes/                 # wires middleware + controller per endpoint
  emails/
    templates/            # one render function per notification type
    emailQueue.js          # single dispatch point, queue-ready for Phase 8
```

## Documentation index

- `docs/API_REFERENCE.md` — every endpoint, method, auth requirement, request/response shape
- `docs/ARCHITECTURE.md` — multi-tenancy model, auth flow, layering rules
- `docs/DATABASE_SCHEMA.md` — models, relationships, indexes and why they exist
- `docs/EMAIL_SYSTEM.md` — SMTP config, template list, how to add a new notification type
- `docs/PHASE_HISTORY.md` — what was built in each phase and known gaps
- `postman/` — importable Postman collections per phase

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start with nodemon |
| `npm start` | Start (production) |
| `npm run prisma:generate` | Regenerate Prisma client after schema changes |
| `npm run prisma:migrate` | Create + apply a migration |
| `npm run prisma:studio` | Browse the DB visually |
| `npm run prisma:seed` | Seed the default super admin |
