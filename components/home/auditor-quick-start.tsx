"use client"

import { useId, useState } from "react"
import { useRouter } from "next/navigation"
import posthog from "posthog-js"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SCAN_HANDOFF_STORAGE_KEY } from "@/lib/free-scan"
import { normalizeInputUrl } from "@/lib/url-safety"

/**
 * The home page's way into the URL Accessibility Auditor. The address travels through
 * sessionStorage (never a query string, which would mint crawlable URL variants) and the auditor
 * starts the scan as soon as it opens.
 */
export function AuditorQuickStart() {
  const router = useRouter()
  const inputId = useId()
  const helpId = useId()
  const errorId = useId()
  const [value, setValue] = useState("")
  const [error, setError] = useState<string | null>(null)

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const normalized = normalizeInputUrl(value)
    if (!normalized || !normalized.hostname.includes(".")) {
      setError("Enter a page address, for example https://example.com")
      return
    }
    setError(null)
    posthog.capture("scan_handoff_submitted", { source: "home_auditor_showcase" })
    try {
      window.sessionStorage.setItem(SCAN_HANDOFF_STORAGE_KEY, normalized.toString())
    } catch {
      // Storage blocked: the auditor opens with an empty field instead.
    }
    router.push("/tools/url-accessibility-auditor")
  }

  return (
    <form onSubmit={onSubmit} noValidate className="border bg-background p-4 sm:p-5">
      <label htmlFor={inputId} className="text-sm font-semibold">
        Audit a page now
      </label>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <Input
          id={inputId}
          type="url"
          inputMode="url"
          autoComplete="url"
          spellCheck={false}
          placeholder="https://example.com"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={[helpId, error ? errorId : null].filter(Boolean).join(" ")}
          className="h-12 rounded-none bg-background text-base sm:flex-1"
        />
        <Button type="submit" className="h-12 rounded-none px-6 text-base">
          Run free audit
          <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
      {error && (
        <p id={errorId} role="alert" className="mt-2 text-sm font-medium text-red-700 dark:text-red-300">
          {error}
        </p>
      )}
      <p id={helpId} className="mt-3 text-sm text-muted-foreground">
        One free audit a day, no account needed. Results in about a minute.
      </p>
    </form>
  )
}
