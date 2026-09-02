"use client"

import Link from "next/link"
import Script from "next/script"
import { Button } from "@/components/ui/button"
import {
  clearAnalyticsConsent,
  setAnalyticsConsent,
  useAnalyticsConsent,
  type ConsentChoice,
} from "@/lib/analytics/consent"

export function AnalyticsConsent() {
  // Shared store: this one choice gates Google Analytics here and PostHog in
  // components/analytics/posthog-provider.tsx.
  const choice = useAnalyticsConsent()

  const saveChoice = (nextChoice: ConsentChoice) => {
    setAnalyticsConsent(nextChoice)
  }

  return (
    <>
      {choice === "accepted" && (
        <>
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-F2G9QQF96G"
            strategy="afterInteractive"
          />
          <Script id="google-analytics-consent" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-F2G9QQF96G', { anonymize_ip: true });
            `}
          </Script>
        </>
      )}

      {choice === null && (
        <section
          aria-labelledby="analytics-consent-title"
          aria-describedby="analytics-consent-description"
          className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-300 bg-white px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 dark:border-slate-700 dark:bg-slate-950 sm:px-6"
        >
          <div className="mx-auto grid max-w-6xl gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-6">
            <div className="max-w-3xl">
              <h2 id="analytics-consent-title" className="sr-only">
                Optional analytics
              </h2>
              <p
                id="analytics-consent-description"
                className="text-sm leading-5 text-slate-700 dark:text-slate-300"
              >
                <strong className="font-semibold text-slate-950 dark:text-white">
                  Optional analytics.{" "}
                </strong>
                Google Analytics and PostHog load only if you allow them. Essential account and
                security storage still works if you decline. Read our{" "}
                <Link href="/cookies" className="font-medium underline underline-offset-4">
                  cookie policy
                </Link>
                .
              </p>
            </div>
            <div className="flex w-full shrink-0 gap-2 sm:w-auto">
              <Button
                className="min-h-11 flex-1 sm:flex-none"
                variant="outline"
                onClick={() => saveChoice("rejected")}
              >
                Decline
              </Button>
              <Button
                className="min-h-11 flex-1 sm:flex-none"
                onClick={() => saveChoice("accepted")}
              >
                Allow analytics
              </Button>
            </div>
          </div>
        </section>
      )}
    </>
  )
}

export function CookieSettingsButton() {
  const reopenSettings = () => {
    clearAnalyticsConsent()
  }

  return (
    <Button type="button" variant="outline" onClick={reopenSettings}>
      Review analytics choice
    </Button>
  )
}
