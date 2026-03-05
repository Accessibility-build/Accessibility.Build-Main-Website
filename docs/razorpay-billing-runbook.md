# Razorpay Billing Runbook

## 1) Scope
- Provider: Razorpay (`BILLING_PROVIDER=razorpay`)
- Billing model: one-time credit purchases only
- Checkout: Razorpay Orders + Standard Checkout modal
- Fallback: Razorpay Payment Links
- Management: in-app Billing Center (`/billing/manage`)
- Fulfillment: webhook-driven, idempotent credit grants/reversals

## 2) Environment Variables
Set these variables in each environment:

- `BILLING_PROVIDER` (`razorpay`)
- `BILLING_ENABLED` (`true` by default)
- `RAZORPAY_BILLING_ENABLED` (`true` by default)
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `RAZORPAY_WEBHOOK_SECRET`
- `OPENEXCHANGERATES_APP_ID`
- `BILLING_USD_INR_FALLBACK_RATE` (optional, default `83`)
- `NEXT_PUBLIC_APP_URL`

Legacy compatibility (keep configured, disabled for new traffic):
- `STRIPE_BILLING_ENABLED=false`
- Stripe credentials/price IDs retained for historical reconciliation only

## 3) Razorpay Dashboard Setup
1. Enable international payments for USD acceptance.
2. Verify payment methods required for target geographies.
3. Configure webhook endpoint:
   - `https://www.accessibility.build/api/webhooks/razorpay`
4. Store webhook secret in `RAZORPAY_WEBHOOK_SECRET`.
5. Ensure test and live keys are available for deployment stages.

## 4) Webhook Events and Mapping
Subscribed/handled events:
- `payment.captured` -> mark paid + grant credits exactly once
- `payment.failed` -> mark order failed
- `payment_link.paid` -> resolve fallback payment and grant credits
- `refund.processed` / `payment.refunded` -> proportional credit reversal

Idempotency and safety:
- Event id header: `x-razorpay-event-id`
- Stored in `razorpay_webhook_events`
- Duplicate deliveries never double-credit
- Processing runs transactionally against `billing_orders` + `credit_transactions`

## 5) FX and Dual Currency Behavior
- Catalog source of truth is fixed USD amounts.
- INR checkout amount is computed using live USD->INR quote from OpenExchangeRates.
- Quote snapshot is persisted per order:
  - `base_amount_usd_cents`
  - `amount_total_usd_cents`
  - `fx_rate_usd_to_inr`
  - `fx_rate_timestamp`
- Fallback rate from env is used when live FX fetch fails.

## 6) Billing Center Operations
- User billing history route: `/billing`
- Billing action center: `/billing/manage`
- Receipt download endpoint:
  - `GET /api/billing/receipt/:orderId`
- User-facing history filters to active provider (Razorpay) only.
- Historical Stripe orders remain admin/internal only.

Admin support endpoint:
- `GET /api/admin/billing/action-required` for review queue
- `POST /api/admin/billing/action-required` to resolve reviewed holds

## 7) Telemetry and Monitoring
Funnel events write to `billing_funnel_events` (best-effort, no-throw).

Core event families:
- Checkout: `checkout_click`, `checkout_session_created`, `checkout_session_failed`, `checkout_fallback_payment_link`
- Manage: `manage_click`, `manage_session_created`, `manage_session_failed`
- Webhook: `webhook_paid`, `webhook_pending`, `webhook_failed`, `webhook_refund`, `webhook_duplicate`, `webhook_error`

Admin monitoring:
- API: `GET /api/admin/billing/funnel`
- UI: `/admin/billing`
- Includes:
  - conversion + fallback rates
  - provider split
  - currency split
  - FX diagnostics
  - stale pending orders (older than 30 minutes)

## 8) Incident Triage
### Webhook failures
1. Query `razorpay_webhook_events` where `processing_status='failed'`.
2. Inspect `error_message` and payload.
3. Replay webhook from Razorpay dashboard after fix.

### Credit mismatch
1. Compare `billing_orders` row with `credit_transactions` and `users.credits`.
2. Validate `credit_transaction_id` for paid orders.
3. Reprocess missing event if order is paid upstream but not fulfilled.

### Refund reversal blocked
1. `billing_orders.status='action_required'` indicates insufficient credits to reverse.
2. Account is put on hold (`users.is_active=false`).
3. Admin resolves by credit adjustment + reactivation after verification.

### Conversion drop or fallback spike
1. Check `/admin/billing` for:
   - `checkout_session_failed` increase
   - fallback rate spike
   - webhook error baseline breach
2. Correlate with recent deployments and Razorpay status incidents.

## 9) Rollback and Safety Switches
Immediate stop for new checkouts:
- Set `BILLING_ENABLED=false`

Provider rollback (if required):
- Set `BILLING_PROVIDER=stripe`
- Keep Razorpay webhooks active until pending events are drained/reconciled

## 10) Deployment Checklist
1. Apply latest DB migrations.
2. Deploy with Razorpay test keys and `BILLING_PROVIDER=razorpay`.
3. Generate Clerk API test token (see `docs/clerk-testing.md`) and validate authenticated billing routes.
4. Validate USD + INR synthetic purchases end-to-end.
5. Validate fallback payment-link flow.
6. Validate refund webhook reversal behavior.
7. Validate `/admin/billing` KPI and recent feed updates.
8. Switch to live keys and monitor first 48 hours.

## 11) Alert Thresholds
- `webhook_error` above baseline
- `webhook_failed` above baseline
- pending orders older than 30 minutes > baseline
- fallback usage spike vs 7-day baseline
- any double-credit incident (should remain zero)
