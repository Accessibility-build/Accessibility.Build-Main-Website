# Stripe Billing Runbook (Legacy)

This document is retained only for reconciliation of historical Stripe orders.
Active production operations now use Razorpay. See `docs/razorpay-billing-runbook.md`.

## 1) Environment Setup
Set these variables in each environment:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PORTAL_CONFIGURATION_ID`
- `STRIPE_BILLING_ENABLED` (`true` by default)
- `STRIPE_PRICE_STARTER_50`
- `STRIPE_PRICE_PRO_200`
- `STRIPE_PRICE_BUSINESS_500`
- `STRIPE_PRICE_GROWTH_2500`
- `STRIPE_PRICE_TEAM_5000`
- `STRIPE_PRICE_TEAM_15000`
- `NEXT_PUBLIC_APP_URL`

## 2) Stripe Dashboard Setup
1. Create products/prices for all six packs in USD.
2. Copy each Price ID into matching env vars.
3. Configure Stripe Tax registrations/rules.
4. Create a Customer Portal configuration and copy `bpc_...` ID.
5. Ensure portal configuration includes payment method updates and invoice history.

## 3) Webhook Setup
1. Add endpoint: `https://www.accessibility.build/api/webhooks/stripe`
2. Subscribe to events:
   - `checkout.session.completed`
   - `checkout.session.async_payment_succeeded`
   - `checkout.session.async_payment_failed`
   - `charge.refunded`
3. Copy signing secret into `STRIPE_WEBHOOK_SECRET`.
4. Validate signature errors are zero after deployment.

## 4) Test Plan (Stripe Test Mode)
1. Create checkout session from `/pricing` and `/dashboard` for each catalog pack.
2. Confirm webhook delivery and credit grant exactly once.
3. Replay same webhook event and confirm no double credit.
4. Trigger async success/failure scenarios and verify order status transitions.
5. Create partial and full refunds; verify credit reversals and order status updates.
6. Validate billing portal access from `/billing` and return URL behavior.

## 5) Funnel Telemetry
- Client and API events are written to `billing_funnel_events`.
- Client endpoint: `POST /api/billing/events` (allowlisted payload, best-effort logging).
- Admin monitoring endpoint: `GET /api/admin/billing/funnel`.
- Admin UI: `/admin/billing` shows checkout/portal conversion KPIs and recent event feed.

Primary event types:
- Checkout: `checkout_click`, `checkout_auth_required`, `checkout_session_created`, `checkout_session_failed`, `checkout_invalid_catalog`
- Portal: `portal_click`, `portal_auth_required`, `portal_session_created`, `portal_session_failed`
- Webhooks: `webhook_paid`, `webhook_pending`, `webhook_failed`, `webhook_refund`, `webhook_duplicate`, `webhook_error`

## 6) Incident Response
### Webhook failures
- Check `stripe_webhook_events.processing_status = 'failed'`.
- Inspect `error_message` and payload.
- Replay event from Stripe Dashboard after fix.

### Credit mismatch
- Compare `billing_orders` row with `credit_transactions` and `users.credits`.
- If order is paid but no purchase transaction, replay checkout completion event.

### Refund reversal blocked
- `billing_orders.status = 'action_required'` means refund exceeds available credits.
- User is put on hold (`users.is_active = false`).
- Admin resolves by manual credit adjustment then reactivation.

### Funnel drop or spike
- Use `/admin/billing` to check checkout conversion and webhook error counts by range.
- Query `billing_funnel_events` for clustered `checkout_session_failed` or `webhook_error`.
- Correlate with Stripe dashboard incidents and recent deployments.

## 7) Rollback Switch
Use `STRIPE_BILLING_ENABLED=false` to disable new checkout/portal launches immediately.

Behavior when disabled:
- `/api/billing/checkout-session` returns `503`.
- `/api/billing/portal-session` returns `503`.
- `/api/webhooks/stripe` acknowledges with `{ received: true, skipped: true }`.

## 8) Launch Checklist
1. Run DB migrations in production.
2. Deploy with Stripe test keys and validate end-to-end.
3. Switch to live keys.
4. Verify first live transactions and webhook processing.
5. Verify `billing_funnel_events` ingestion from pricing/dashboard/billing actions.
6. Monitor for `action_required` billing orders and funnel failure spikes in first 24 hours.
