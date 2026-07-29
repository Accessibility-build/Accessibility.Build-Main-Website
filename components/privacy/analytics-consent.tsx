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
          aria-label="Analytics preferences"
          className="fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-3xl border border-slate-300 bg-white p-5 shadow-2xl dark:border-slate-700 dark:bg-slate-950 sm:inset-x-6"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-xl">
              <h2 className="text-base font-semibold text-slate-950 dark:text-white">
                Optional analytics
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                We use Google Analytics and PostHog only with your permission. Essential account and security storage continues to work when analytics is declined. Read our{" "}
                <Link href="/cookies" className="font-medium underline underline-offset-4">
                  cookie policy
                </Link>
                .
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button variant="outline" onClick={() => saveChoice("rejected")}>
                Decline
              </Button>
              <Button onClick={() => saveChoice("accepted")}>Allow analytics</Button>
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
