"use client"

import { useSyncExternalStore } from "react"

/**
 * Single source of truth for the site's optional-analytics consent.
 *
 * Both the cookie banner (components/privacy/analytics-consent.tsx) and the
 * PostHog provider (components/analytics/posthog-provider.tsx) read the same
 * localStorage key and the same custom event through this module, so a single
 * "Allow analytics" / "Decline" choice governs Google Analytics AND PostHog.
 */

export type ConsentChoice = "accepted" | "rejected"
export type ConsentState = ConsentChoice | null | "unresolved"

export const ANALYTICS_CONSENT_STORAGE_KEY =
  "accessibility-build-analytics-consent"
export const ANALYTICS_CONSENT_EVENT =
  "accessibility-build:open-cookie-settings"

/** Subscribe to consent changes in this tab (custom event) and other tabs (storage). */
export function subscribeToConsent(callback: () => void) {
  window.addEventListener(ANALYTICS_CONSENT_EVENT, callback)
  window.addEventListener("storage", callback)
  return () => {
    window.removeEventListener(ANALYTICS_CONSENT_EVENT, callback)
    window.removeEventListener("storage", callback)
  }
}

/** The current choice, or null when the visitor has not decided yet. */
export function getConsentSnapshot(): ConsentState {
  const stored = window.localStorage.getItem(ANALYTICS_CONSENT_STORAGE_KEY)
  return stored === "accepted" || stored === "rejected" ? stored : null
}

/** During SSR there is no stored choice; report "unresolved" so nothing loads. */
export function getServerConsentSnapshot(): ConsentState {
  return "unresolved"
}

/** React hook returning the live consent state. */
export function useAnalyticsConsent(): ConsentState {
  return useSyncExternalStore(
    subscribeToConsent,
    getConsentSnapshot,
    getServerConsentSnapshot,
  )
}

/** Persist a choice and notify every listener (this tab and others). */
export function setAnalyticsConsent(choice: ConsentChoice) {
  window.localStorage.setItem(ANALYTICS_CONSENT_STORAGE_KEY, choice)
  window.dispatchEvent(new Event(ANALYTICS_CONSENT_EVENT))
}

/** Clear the stored choice so the banner reappears (used by "Review analytics choice"). */
export function clearAnalyticsConsent() {
  window.localStorage.removeItem(ANALYTICS_CONSENT_STORAGE_KEY)
  window.dispatchEvent(new Event(ANALYTICS_CONSENT_EVENT))
}
