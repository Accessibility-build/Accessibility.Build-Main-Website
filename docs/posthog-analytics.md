# PostHog Analytics

Product analytics for Accessibility.build, integrated end to end and gated on the
site's existing optional-analytics consent. Nothing is captured until a visitor
chooses **Allow analytics** — the same choice that controls Google Analytics.

## What is tracked

Once consent is granted:

- **Pageviews** — captured manually on every App Router navigation (`$pageview`).
- **Autocapture** — clicks, form submissions, and input changes (input values are
  masked). Turn specific elements off with the PostHog HTML attributes.
- **Pageleave** — time on page / bounce signals.
- **Client-side exceptions** — unhandled errors (`capture_exceptions`).
- **Session recordings** — enabled in code with `maskAllInputs`; the actual on/off
  switch also lives in your PostHog project settings. Add `data-ph-mask` to any
  element whose text should never be recorded.
- **User identity** — signed-in users are identified by their Clerk user id
  (with email / name / username); sign-out resets the association.
- **Server-side events** — backend/API/webhook events via
  `lib/analytics/posthog-server.ts`.

## Required environment variables

Add these to `.env.local` (and to your Vercel project settings for production):

```bash
# Client (public) — REQUIRED to enable PostHog. Without it the integration no-ops.
NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN=phc_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Client host. Default "/ingest" routes through the reverse proxy (recommended —
# avoids content blockers). Set to a direct host to bypass the proxy.
NEXT_PUBLIC_POSTHOG_HOST=/ingest

# Where "View in PostHog" links point (the app UI, not ingestion).
# US cloud: https://us.posthog.com   EU cloud: https://eu.posthog.com
NEXT_PUBLIC_POSTHOG_UI_HOST=https://us.posthog.com
```

Optional — only needed to override the reverse-proxy targets (see below) or to
capture server-side events:

```bash
# Reverse-proxy targets (next.config.mjs). Defaults are PostHog US cloud.
# For EU cloud, set these two:
POSTHOG_INGEST_HOST=https://eu.i.posthog.com
POSTHOG_ASSETS_HOST=https://eu-assets.i.posthog.com

# Server-side capture (posthog-node). Falls back to the NEXT_PUBLIC_* values.
POSTHOG_KEY=phc_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
POSTHOG_HOST=https://us.i.posthog.com
```

> **Region:** the defaults target PostHog **US** cloud. If your project is on EU
> cloud, set `NEXT_PUBLIC_POSTHOG_UI_HOST`, `POSTHOG_INGEST_HOST`, and
> `POSTHOG_ASSETS_HOST` to the EU hosts above.

## How the reverse proxy works

`next.config.mjs` rewrites proxy analytics through the site's own domain so ad
and tracking blockers do not drop events:

- `/ingest/static/:path*` → PostHog assets host (recorder, surveys, toolbar)
- `/ingest/:path*` → PostHog ingestion host (events, feature flags)

The browser SDK points `api_host` at `/ingest`, so all traffic looks first-party.
`skipTrailingSlashRedirect: true` keeps those paths verbatim.

## Consent model

- Single source of truth: `lib/analytics/consent.ts` (localStorage key
  `accessibility-build-analytics-consent` + a custom event). Both the cookie
  banner and PostHog read it.
- PostHog is initialized with `opt_out_capturing_by_default: true`, then opted in
  only when the stored choice is `accepted`; `rejected` or undecided → opted out.
- Declining, or reopening the banner via **Review analytics choice**, stops all
  capture immediately.

Disclosures were updated to match: the cookie banner, the cookie policy
(`/cookies`), and the subprocessor register (`/subprocessors`) all name PostHog.

## Capturing custom events

Client (React), anywhere under the provider:

```tsx
import { usePostHog } from "posthog-js/react"

const posthog = usePostHog()
posthog?.capture("tool_used", { tool: "contrast-checker", result: "pass" })
```

Server (API routes, server actions, webhooks):

```ts
import { captureServerEvent } from "@/lib/analytics/posthog-server"

await captureServerEvent({
  distinctId: userId,               // Clerk user id, or an anonymous id
  event: "report_generated",
  properties: { tool: "url-auditor", pages: 12 },
})
```

## Files

| File | Role |
| --- | --- |
| `lib/analytics/consent.ts` | Shared consent store (GA + PostHog) |
| `components/analytics/posthog-provider.tsx` | Client init, consent gate, pageviews, Clerk identify |
| `lib/analytics/posthog-server.ts` | Server-side capture helper |
| `next.config.mjs` | Reverse-proxy rewrites |
| `app/layout.tsx` | Mounts `<PostHogProvider>` |

## Consent gating (added 2026-07-30)

PostHog was originally initialised in `instrumentation-client.ts`, which Next.js
runs on every page load with no access to the consent banner. Verified on
production: visitors who had never answered the banner already had a
`ph_<token>_posthog` cookie, and the browser was loading
`posthog-recorder.js` (session replay) and `POST`ing to `/ingest/s/`.

The current arrangement:

- `lib/analytics/consent.ts` is the single source of truth for the consent
  choice (`localStorage` key `accessibility-build-analytics-consent`). Both the
  banner and PostHog read it, so one choice governs Google Analytics and
  PostHog together.
- `components/analytics/posthog-provider.tsx` calls `posthog.init()` only when
  the choice is `accepted`. It also renders `<PostHogUserSync/>` (Clerk identify)
  only when accepted.
- `instrumentation-client.ts` deliberately initialises nothing. Anything added
  there must be safe to run without consent.
- **Session replay is disabled** (`disable_session_recording: true`). The banner
  asks to "allow analytics"; recording a visitor's screen is a larger ask and is
  not what they agreed to.
- Declining switches persistence to `memory`, opts out, resets, and then purges
  every `ph_*` / `__ph_*` cookie and `localStorage` entry. Setting persistence to
  memory **before** purging matters — otherwise the SDK immediately rewrites the
  entries that were just removed.

Verified end to end on `next start`: undecided → no `/ingest` requests and no
storage; accepted → events flow (`POST /ingest/e/`) with no recorder script;
declined after accepting → storage fully purged; re-accepted → capture resumes.

Server-side capture (`lib/posthog-server.ts`, used by webhooks, API routes and
server actions) is unaffected. Those are first-party server-to-server
operational events, not browser tracking, and set no cookies on the visitor.
