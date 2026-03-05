# Clerk Testing Guide

This project now uses Clerk's route-handler auth pattern (`auth()`) for billing APIs so Bearer-token testing is reliable for local and staging checks.

## 1) Generate a Session Token (Recommended)

Use a real Clerk user ID and create a temporary session token from the Clerk Backend API.

Command:

```bash
npm run clerk:test-session-token -- --user-id <clerk_user_id>
```

Optional expiration:

```bash
npm run clerk:test-session-token -- --user-id <clerk_user_id> --expires-in 3600
```

Requirements:
- `CLERK_SECRET_KEY` must be set.
- The user ID must already exist in Clerk.

The script prints a `SESSION_TOKEN` and an `Authorization` header value.

## 2) Test Protected Billing APIs

Use the session token in Postman/cURL:

```bash
curl -X POST http://localhost:3000/api/billing/checkout-session \
  -H "Authorization: Bearer <SESSION_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"catalogKey":"starter_50","currency":"USD","returnPath":"/pricing"}'
```

Because these routes use `auth()`, this flow is stable for API-only testing and avoids UI cookie/session coupling.

## 3) Alternative: Long-Lived JWT Template (Postman/Insomnia)

Clerk also supports generating long-lived testing JWTs from a session token template for API clients.

If you use that method:
- include `Authorization: Bearer <token>`
- verify the token is accepted by your Clerk instance settings
- prefer short expirations for security

## 4) Browser E2E (Playwright/Cypress)

For browser automation, use Clerk's official testing helpers:
- `@clerk/testing/playwright`
- `@clerk/testing/cypress`

These helpers handle sign-in/session setup and reduce flaky auth behavior in end-to-end tests.

## 5) Current Billing Routes Updated for Clerk Testing

The following routes now rely on token-friendly `auth()` identity flow:
- `/api/billing/checkout-session`
- `/api/billing/manage-session`
- `/api/billing/portal-session`
- `/api/billing/payment-link`
- `/api/billing/receipt/:orderId`
- `/api/billing/events` (optional auth capture)

## 6) Troubleshooting

- `401 Authentication required`:
  - check token is valid and unexpired
  - ensure `proxy.ts` middleware is active for `/api/*`
- User missing in DB:
  - APIs auto-bootstrap user records by Clerk user ID
- Admin route errors:
  - admin routes still require an admin Clerk account and admin email allowlist
