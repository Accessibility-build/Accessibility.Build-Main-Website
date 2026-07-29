/**
 * Client instrumentation.
 *
 * PostHog is deliberately NOT initialised here. Next.js runs this file on every
 * page load, before React mounts and with no access to the analytics-consent
 * banner, so initialising PostHog at this point started autocapture, exception
 * capture and session recording for visitors who had not answered the banner —
 * or who had actively declined. Initialisation now lives in
 * `components/analytics/posthog-provider.tsx`, which waits for an explicit
 * "Allow analytics" choice (the same gate Google Analytics already used).
 *
 * Anything added to this file must be safe to run without consent.
 */

export {}
