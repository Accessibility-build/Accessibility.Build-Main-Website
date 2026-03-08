# Clerk Testing Guide

This repo tests Clerk in three layers only:

1. Bearer-token API smoke via live Clerk sessions.
2. Browser E2E via Playwright and `@clerk/testing/playwright`.
3. Svix-signed webhook integration against `/api/webhooks/clerk`.

The automated suites use short-lived fresh Clerk session tokens. Long-lived JWT templates remain a manual Postman/Insomnia option only.

## Environment Contract

Required for the automated suites:

```bash
NEXT_PUBLIC_APP_URL=http://127.0.0.1:3000
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx # optional alias for tooling
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxxx
CLERK_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
DATABASE_URL=postgresql://user:password@host:5432/db
ADMIN_EMAIL=admin@example.com
E2E_CLERK_USER_EMAIL=test-user@example.com
E2E_CLERK_USER_PASSWORD=your-password
E2E_CLERK_ADMIN_EMAIL=admin-user@example.com
E2E_CLERK_ADMIN_PASSWORD=your-password
EMAIL_SERVICE_ENABLED=false
EMAIL_MARKETING_ENABLED=false
```

Notes:

- Use a dedicated Clerk development instance only.
- The standard and admin E2E users must already exist in Clerk with email/password enabled.
- `ADMIN_EMAIL` must include the admin E2E email so `/admin` and `requireAdminApi()` can be exercised.
- Disabling email delivery keeps webhook tests from sending real welcome or marketing mail.

## Manual Session Token Helper

Keep using the existing helper when you want an ad hoc API token outside the automated suite:

```bash
npm run clerk:test-session-token -- --user-id <clerk_user_id>
```

Optional expiration:

```bash
npm run clerk:test-session-token -- --user-id <clerk_user_id> --expires-in 3600
```

The script prints a short-lived `SESSION_TOKEN` plus a ready-to-paste `Authorization` header.

## Automated API Smoke

Run:

```bash
npm run test:clerk:api
```

Coverage:

- `GET /api/user/credits`
- `POST /api/billing/checkout-session`
- `POST /api/billing/manage-session`
- `POST /api/billing/portal-session`
- `POST /api/billing/payment-link`
- `GET /api/billing/receipt/:orderId`
- `POST /api/billing/events`
- `GET /api/admin/dashboard`

The runner:

- boots an isolated local Next dev server
- mints a fresh Clerk session token per authenticated request
- re-mints once on `401` to avoid token TTL flake
- checks anonymous and stale-token failures
- checks valid standard-user and admin access paths
- creates one disposable Clerk user to verify first-request DB bootstrap

## Browser E2E

Run:

```bash
npm run test:e2e:clerk
```

Playwright coverage:

- `/sign-in` and `/sign-up` render with Clerk loaded
- signed-out redirects for `/billing`, `/billing/manage`, `/dashboard`, `/profile`, and `/admin`
- standard-user access to `/billing`, `/dashboard`, and `/profile`
- non-admin redirect away from `/admin`
- admin access to `/admin`
- Clerk sign-out clearing protected-route access
- one disposable sign-up flow using Clerk test-mode email verification

Project layout:

- `setup`: creates reusable auth states for the standard and admin users
- `signed-out`: public auth-page and redirect coverage
- `signed-in-user`: normal authenticated user coverage
- `signed-in-admin`: admin-only coverage

Useful filters:

```bash
npm run test:e2e:clerk -- --grep @smoke
npm run test:e2e:clerk -- --grep @extended
```

## Webhook Integration

Run:

```bash
npm run test:clerk:webhooks
```

The webhook runner:

- boots isolated local Next dev servers
- signs payloads with Svix headers
- verifies `500` when `CLERK_WEBHOOK_SECRET` is missing
- verifies `400` for missing headers and bad signatures
- checks `user.created`, duplicate `user.created`, `user.updated`, `user.deleted`, and unhandled events
- validates DB side effects in `users` and `credit_transactions`

## Combined Run

Run the full Clerk suite:

```bash
npm run test:clerk
```

This executes API smoke, webhook integration, and Playwright E2E in sequence.

## Failure Triage

- `401 Authentication required` on bearer-token routes:
  - confirm `proxy.ts` still matches `/api/*`
  - confirm the E2E users still exist in Clerk
  - confirm the route actually uses `auth()` or `getClerkApiIdentity()`
- Admin checks failing with `403`:
  - confirm the admin test email is listed in `ADMIN_EMAIL`
- Disposable sign-up failing on OTP:
  - use a `+clerk_test` email address
  - make sure Clerk email-code verification is enabled in the dev instance
- Webhook tests failing at `500`:
  - confirm `CLERK_WEBHOOK_SECRET` matches the secret used to sign the test payloads
  - confirm `DATABASE_URL` points at a writable database
