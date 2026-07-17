# Pesapal Payment Integration

Source of truth: Pesapal API 3.0 official docs (JSON), as supplied. Every
endpoint below maps 1:1 to a documented Pesapal operation — nothing here
was invented.

## Environment

| Env | Base URL |
|---|---|
| Sandbox | `https://cybqa.pesapal.com/pesapalv3` |
| Live | `https://pay.pesapal.com/v3` |

Selected via `PESAPAL_ENV=sandbox\|live`. Credentials, IPN URL, and
callback URL are env vars (`PESAPAL_CONSUMER_KEY`, `PESAPAL_CONSUMER_SECRET`,
`PESAPAL_IPN_URL`, `PESAPAL_CALLBACK_URL`) — same pattern as the mail
config, not the encrypted-integrations blob, because these are core
payment infra, not an optional toggle.

**`PESAPAL_CALLBACK_URL` is a frontend URL**, not a backend one — per the
doc, Pesapal redirects the payer's browser directly there with
`?OrderTrackingId=...` in the query string, and "your callback page
should not implement a json response... redirect the customer to a page
... showing the payment details." That page is `src/pages/PaymentCallback.jsx`
in the frontend, which then calls our public status endpoint.

## Request flow

```
Super Admin clicks "Initiate Payment" for a school's current invoice
  → POST /admin/billing/:schoolId/initiate-payment
    → paymentService.initiatePayment()
      → pesapalIpnSetupService.getOrRegisterIpnId()   [RegisterIPN, cached]
      → pesapalClient.submitOrderRequest(...)          [SubmitOrderRequest]
      → PaymentTransaction row created (PENDING), orderTrackingId attached
    ← { redirectUrl, orderTrackingId }

Redirect the payer (school contact) to redirectUrl — Pesapal's hosted
payment page. They pay via card/mobile money.

Pesapal redirects their browser to PESAPAL_CALLBACK_URL
  (frontend PaymentCallback.jsx)
    → GET /payments/pesapal/status/:orderTrackingId (public)
      → paymentService.reconcileByOrderTrackingId()    [GetTransactionStatus]
      → updates PaymentTransaction + Invoice, sends confirmation/failure email
    ← current status shown to the payer

Independently, Pesapal calls our IPN URL (server-to-server)
  GET/POST /payments/pesapal/ipn (public)
    → paymentService.handleIpn()
      → logs a PesapalIpnEvent row BEFORE processing (audit trail even
        on crash)
      → calls the SAME reconcileByOrderTrackingId() — idempotent, so if
        the callback already reconciled this order, this is a safe no-op
    ← { orderNotificationType, orderTrackingId, orderMerchantReference, status: 200|500 }
```

Both the callback-triggered and IPN-triggered paths converge on one
function (`reconcileByOrderTrackingId`). This is what the doc means by
"you will be required to fetch the status... using GetTransactionStatus"
for *both* triggers — we don't trust either notification's payload for
the actual status, only as a signal to go check.

## Idempotency & duplicate-callback protection

- `reconcileByOrderTrackingId` checks `transaction.status === 'COMPLETED'`
  first and short-circuits — re-running it (IPN retry, or callback fires
  after IPN already processed) never double-marks an invoice paid or
  double-sends a confirmation email.
- Every IPN call is logged to `PesapalIpnEvent` regardless of outcome —
  Pesapal's own retry behavior is fully auditable, not just trusted.
- `PaymentTransaction.orderTrackingId` and `.merchantReference` are both
  `@unique` — a second `SubmitOrderRequest` for the same invoice always
  gets a fresh merchant reference (see below), so there's no collision
  risk at the DB level.
- Rapid repeat "Initiate Payment" clicks reuse an existing in-flight
  order (< 1 hour old, still PENDING) instead of creating a duplicate
  Pesapal order — see `PENDING_RETRY_WINDOW_MS` in `payment.service.js`.

## Merchant reference format

Pesapal requires `id` to be alphanumeric plus `-_.: ` only, max 50 chars,
unique per request. We use `PAY-{first 8 chars of invoiceId}-{12 hex
chars}` — traceable back to the invoice, collision-proof, well under the
limit.

## Status mapping

| Pesapal `status_code` | `payment_status_description` | Our `PaymentTransactionStatus` |
|---|---|---|
| 0 | INVALID | `INVALID` |
| 1 | COMPLETED | `COMPLETED` |
| 2 | FAILED | `FAILED` |
| 3 | REVERSED | `REVERSED` |

`CANCELLED` is our own addition (not a Pesapal status) — set when the
Super Admin cancels a pending/failed order via `CancelOrder`.

## What happens to the Invoice on each outcome

| New status | Effect |
|---|---|
| `COMPLETED` (first time) | `Invoice.status → PAID`, `paidAt` set, `INVOICE_PAID_VIA_PESAPAL` audit entry, confirmation email |
| `FAILED` / `INVALID` (from PENDING) | Invoice untouched (stays PENDING/OVERDUE), `PAYMENT_FAILED` audit entry, failure email |
| `REVERSED` | If the invoice had been marked PAID by this transaction, reverted to `OVERDUE` so it shows as payable again; `PAYMENT_REVERSED` audit entry |

## Refunds & cancellation

Both follow the doc's stated limitations exactly — enforced in
`payment.service.js`, not just described:

- **Refund** (`POST /admin/billing/:schoolId/refund`): only allowed on a
  `COMPLETED` transaction with a `confirmationCode`; blocked if a refund
  was already requested (`refundRequestedAt` set) — matches "Multiple
  refunds are not allowed."
- **Cancel** (`POST /admin/billing/:schoolId/cancel-payment`): only
  allowed on `PENDING`/`FAILED`/`INVALID`; blocked if already cancelled —
  matches "Cancellation is exclusively supported for failed or pending
  payments" and "can only be submitted once."

## Recurring payments

The doc's recurring/subscription feature (`account_number` +
`subscription_details`) is **not wired up** — EduManage's billing model
is "generate one invoice per school per month," which is a better fit
for one-off `SubmitOrderRequest` calls per invoice than Pesapal's
card-tokenized auto-debit subscriptions. `account_number` is still sent
(set to `schoolId`) purely as a reference field, not to enroll in
recurring billing. If true recurring billing is wanted later, the
`subscription_transaction_info` handling described in the doc's IPN
section would need its own `OrderNotificationType === 'RECURRING'`
branch in `handleIpn` — not built, since it wasn't requested.

## New database models

See `DATABASE_SCHEMA.md` for `PaymentTransaction` and `PesapalIpnEvent`.

## New endpoints

See `API_REFERENCE.md` — added under `/admin/billing/*` (protected) and
`/payments/pesapal/*` (public, unauthenticated by necessity).

## Runtime requirement

Uses the global `fetch` API (Node 18+) for all Pesapal HTTP calls — no
new HTTP client dependency was added.
