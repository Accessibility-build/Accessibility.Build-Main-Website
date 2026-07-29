"use client"

import { useEffect } from "react"
import posthog from "posthog-js"
import { useAnalyticsConsent } from "@/lib/analytics/consent"
import { PostHogUserSync } from "@/components/posthog-user-sync"

const TOKEN = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN

/** Has posthog.init() already run in this page session? */
let initialised = false

/**
 * Remove every PostHog cookie and localStorage entry.
 *
 * Needed because visitors were tracked before this gate existed, so returning
 * visitors can arrive with a `ph_<token>_posthog` cookie already set. Declining
 * has to clear it, not merely stop sending new events.
 */
function isPostHogKey(key: string) {
  return key.startsWith("ph_") || key.startsWith("__ph_") || key.includes("posthog")
}

function purgePostHogStorage() {
  try {
    for (const key of Object.keys(window.localStorage)) {
      if (isPostHogKey(key)) {
        window.localStorage.removeItem(key)
      }
    }
    for (const cookie of document.cookie.split("; ")) {
      const name = cookie.split("=")[0]
      if (isPostHogKey(name)) {
        // Expire on this host and on the parent domain, path-wide.
        document.cookie = `${name}=; Max-Age=0; path=/`
        document.cookie = `${name}=; Max-Age=0; path=/; domain=${window.location.hostname}`
        document.cookie = `${name}=; Max-Age=0; path=/; domain=.${window.location.hostname}`
      }
    }
  } catch {
    // Storage can be unavailable (Safari private mode); nothing to clean up.
  }
}

/**
 * Loads PostHog only after the visitor has explicitly allowed analytics.
 *
 * PostHog used to be initialised from `instrumentation-client.ts`, which Next.js
 * executes on every page load with no way to consult the consent banner. That
 * meant autocapture, exception capture and session recording all started for
 * visitors who had not answered the banner — or who had actively declined.
 * Google Analytics was already gated this way; PostHog now uses the same gate.
 */
export function PostHogProvider() {
  const consent = useAnalyticsConsent()

  useEffect(() => {
    if (!TOKEN) return

    if (consent === "accepted") {
      if (initialised) {
        // Re-accepting after a decline: restore persistence, then resume.
        posthog.set_config({ persistence: "localStorage+cookie" })
        posthog.opt_in_capturing()
        return
      }
      {
        posthog.init(TOKEN, {
          api_host: "/ingest",
          ui_host: "https://us.posthog.com",
          defaults: "2026-01-30",
          capture_exceptions: true,
          // The banner asks to "allow analytics". Session replay records what a
          // visitor does on screen, which is a bigger ask than analytics and is
          // not what they agreed to — so it stays off.
          disable_session_recording: true,
          persistence: "localStorage+cookie",
          debug: process.env.NODE_ENV === "development",
        })
        initialised = true
      }
      return
    }

    // Not accepted: either undecided ("unresolved"/null) or declined.
    if (initialised) {
      // Order matters. Switching persistence to memory first stops the SDK
      // writing to cookies/localStorage, otherwise it re-creates the very
      // entries purgePostHogStorage() removes on the next tick.
      posthog.set_config({ persistence: "memory" })
      posthog.opt_out_capturing()
      posthog.reset()
    }
    if (consent === "rejected") {
      purgePostHogStorage()
    }
  }, [consent])

  // Only tie analytics events to a signed-in user once analytics is allowed.
  return consent === "accepted" ? <PostHogUserSync /> : null
}
