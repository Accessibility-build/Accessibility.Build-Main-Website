"use client"

import { useEffect, useRef } from "react"
import type { MouseEvent } from "react"
import { Star } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { company } from "@/lib/company"
import { cn } from "@/lib/utils"

// "Add as a preferred source" prompt for Google Search. Readers who pick a
// site see more of it in Top Stories, AI Overviews and AI Mode.
//
// It renders as a plain link to Google's source preferences page, so it works
// with no JavaScript. Google's publisher.js is fetched only when the reader
// clicks: loading it on page view would tell Google about every visit before
// the reader has agreed to anything (analytics already waits for consent, see
// components/privacy/analytics-consent.tsx). Once loaded, the script runs
// Google's add-source flow over the page, so the reader stays where they
// were. If it fails to load, the click falls back to the plain link.

const SCRIPT_SRC = "https://news.google.com/swg/js/v1/publisher.js"
const LOAD_TIMEOUT_MS = 5000

export const PREFERRED_SOURCE_URL = `https://www.google.com/preferences/source?q=${new URL(company.website).hostname}`

interface PreferredSourceApi {
  init: (options: { theme?: "light" | "dark"; lang?: string }) => void
  addPreferredSource: () => void
}

type PreferredSourceCallback = (api: PreferredSourceApi) => void

declare global {
  interface Window {
    // An array queue until the script loads, then Google's own object, which
    // runs pushed callbacks straight away.
    PREFERRED_SOURCE?: { push: (...callbacks: PreferredSourceCallback[]) => void }
  }
}

let apiPromise: Promise<PreferredSourceApi> | null = null

function loadPreferredSourceApi(theme: "light" | "dark") {
  if (apiPromise) return apiPromise

  apiPromise = new Promise<PreferredSourceApi>((resolve, reject) => {
    const queue = window.PREFERRED_SOURCE ?? ([] as PreferredSourceCallback[])
    window.PREFERRED_SOURCE = queue
    queue.push((api) => {
      api.init({ theme, lang: "en" })
      resolve(api)
    })

    const script = document.createElement("script")
    script.async = true
    script.src = SCRIPT_SRC
    // Manual mode: no auto-rendered buttons, we start the flow ourselves.
    script.setAttribute("preferred-sources-control", "manual")
    script.onerror = () => {
      script.remove()
      window.PREFERRED_SOURCE = undefined
      apiPromise = null
      reject(new Error("Google preferred sources script failed to load"))
    }
    document.head.appendChild(script)
  })

  return apiPromise
}

function withTimeout<T>(promise: Promise<T>, ms: number) {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error("timed out")), ms)),
  ])
}

export function PreferredSource({ className }: { className?: string }) {
  const { resolvedTheme } = useTheme()
  const opening = useRef(false)

  // When the browser blocks Google's popup, the flow redirects the whole tab
  // and sends the reader back with its result in the URL hash. Nothing here
  // reads that result, so clear it from the address bar.
  useEffect(() => {
    if (window.location.hash.includes("__WA_RES__")) {
      window.history.replaceState(window.history.state, "", window.location.pathname + window.location.search)
    }
  }, [])

  const handleClick = async (event: MouseEvent<HTMLAnchorElement>) => {
    // Modified clicks keep their usual meaning (new tab, new window).
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    if (opening.current) return
    opening.current = true

    try {
      const api = await withTimeout(
        loadPreferredSourceApi(resolvedTheme === "dark" ? "dark" : "light"),
        LOAD_TIMEOUT_MS,
      )
      api.addPreferredSource()
    } catch {
      window.location.assign(PREFERRED_SOURCE_URL)
    } finally {
      opening.current = false
    }
  }

  return (
    <div
      className={cn(
        "not-prose flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 p-5 font-sans dark:border-slate-800",
        className,
      )}
    >
      <div className="max-w-[48ch]">
        <p className="text-sm font-semibold text-slate-900 dark:text-white">
          Prefer {company.brandName} on Google
        </p>
        <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
          Add us as a preferred source and Google will show our new articles and research more
          often in your Top Stories and AI Overviews.
        </p>
      </div>
      <Button asChild variant="outline" className="min-h-11 w-full whitespace-normal sm:w-auto">
        <a href={PREFERRED_SOURCE_URL} onClick={handleClick}>
          <Star aria-hidden="true" />
          Add as a preferred source on Google
        </a>
      </Button>
    </div>
  )
}
