"use client"

import { useId, useState } from "react"
import { useRouter } from "next/navigation"
import posthog from "posthog-js"
import { ArrowRight, ScanSearch } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SCAN_HANDOFF_STORAGE_KEY } from "@/lib/free-scan"
import { normalizeInputUrl } from "@/lib/url-safety"

interface SiteScanHandoffProps {
  /** Where the handoff sits, for analytics: "color_palette_generator" and so on. */
  source: string
  heading: string
  body: string
  /** Heading level, so the block fits the outline of the page it is placed in. */
  headingLevel?: "h2" | "h3"
  className?: string
  /** Prefills the field, for tools that already know which page the visitor is working on. */
  defaultValue?: string
}

/**
 * Takes a visitor from a single-purpose tool to the URL Accessibility Auditor
 * with their page already entered. The colour tools carry most of the site's
 * search traffic and used to end at "copy CSS"; this is the next step for the
 * ones who are responsible for a real site.
 */
export function SiteScanHandoff({
  source,
  heading,
  body,
  headingLevel = "h2",
  className = "",
  defaultValue = "",
}: SiteScanHandoffProps) {
  const router = useRouter()
  const inputId = useId()
  const errorId = useId()
  const [value, setValue] = useState(defaultValue)
  // A tool that checks a new address passes it again; follow it (state adjusted during render,
  // React's pattern for resetting state when a prop changes).
  const [seenDefault, setSeenDefault] = useState(defaultValue)
  if (defaultValue !== seenDefault) {
    setSeenDefault(defaultValue)
    setValue(defaultValue)
  }
  const [error, setError] = useState<string | null>(null)
  const Heading = headingLevel

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const normalized = normalizeInputUrl(value)
    if (!normalized || !normalized.hostname.includes(".")) {
      setError("Enter a page address, for example https://example.com")
      return
    }
    setError(null)
    posthog.capture("scan_handoff_submitted", { source })
    try {
      window.sessionStorage.setItem(SCAN_HANDOFF_STORAGE_KEY, normalized.toString())
    } catch {
      // Storage blocked: the auditor opens with an empty field instead.
    }
    router.push("/tools/url-accessibility-auditor")
  }

  return (
    <section
      aria-labelledby={`${inputId}-heading`}
      className={`rounded-xl border-2 border-primary/30 bg-primary/5 p-6 md:p-8 ${className}`}
    >
      <div className="flex items-start gap-4">
        <span className="hidden rounded-lg bg-primary/10 p-3 text-primary sm:block">
          <ScanSearch className="h-6 w-6" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <Heading id={`${inputId}-heading`} className="text-2xl font-bold tracking-tight">
            {heading}
          </Heading>
          <p className="mt-2 max-w-3xl leading-relaxed text-muted-foreground">{body}</p>

          <form onSubmit={onSubmit} noValidate className="mt-5">
            <label htmlFor={inputId} className="text-sm font-medium">
              Page to scan
            </label>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <Input
                id={inputId}
                type="url"
                inputMode="url"
                autoComplete="url"
                placeholder="https://example.com"
                value={value}
                onChange={(event) => setValue(event.target.value)}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? errorId : undefined}
                className="h-12 bg-background text-base sm:flex-1"
              />
              <Button type="submit" className="h-12 px-6 text-base">
                Scan this page free
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
            {error && (
              <p id={errorId} role="alert" className="mt-2 text-sm font-medium text-red-700 dark:text-red-300">
                {error}
              </p>
            )}
            <p className="mt-3 text-sm text-muted-foreground">
              One free scan a day, no account. It runs axe-core on the live page and shows your score
              and the most severe findings.
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}
