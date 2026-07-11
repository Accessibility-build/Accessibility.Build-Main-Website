"use client"

import Link from "next/link"
import Script from "next/script"
import { useSyncExternalStore } from "react"
import { Button } from "@/components/ui/button"

type ConsentChoice = "accepted" | "rejected"
type ConsentState = ConsentChoice | null | "unresolved"

const STORAGE_KEY = "accessibility-build-analytics-consent"
const CONSENT_EVENT = "accessibility-build:open-cookie-settings"

function subscribeToConsent(callback: () => void) {
  window.addEventListener(CONSENT_EVENT, callback)
  return () => window.removeEventListener(CONSENT_EVENT, callback)
}

function getConsentSnapshot(): ConsentState {
  const stored = window.localStorage.getItem(STORAGE_KEY)
  return stored === "accepted" || stored === "rejected" ? stored : null
}

function getServerConsentSnapshot(): ConsentState {
  return "unresolved"
}

export function AnalyticsConsent() {
  const choice = useSyncExternalStore(
    subscribeToConsent,
    getConsentSnapshot,
    getServerConsentSnapshot,
  )

  const saveChoice = (nextChoice: ConsentChoice) => {
    window.localStorage.setItem(STORAGE_KEY, nextChoice)
    window.dispatchEvent(new Event(CONSENT_EVENT))
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
                We use Google Analytics only with your permission. Essential account and security storage continues to work when analytics is declined. Read our{" "}
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
    window.localStorage.removeItem(STORAGE_KEY)
    window.dispatchEvent(new Event(CONSENT_EVENT))
  }

  return (
    <Button type="button" variant="outline" onClick={reopenSettings}>
      Review analytics choice
    </Button>
  )
}
