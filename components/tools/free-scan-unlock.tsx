"use client"

import { useId, useState } from "react"
import Link from "next/link"
import posthog from "posthog-js"
import { Loader2, LockKeyhole, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { company } from "@/lib/company"
import type { UrlAuditResult } from "@/lib/url-accessibility-auditor-types"

type Violations = NonNullable<UrlAuditResult["violations"]>

interface FreeScanUnlockProps {
  scanId: string
  lockedCount: number
  onUnlocked: (violations: Violations) => void
}

/**
 * Shown under an anonymous free scan. The server kept every finding past the
 * three most severe; a work email releases them.
 */
export function FreeScanUnlock({ scanId, lockedCount, onUnlocked }: FreeScanUnlockProps) {
  const emailId = useId()
  const noticeId = useId()
  const errorId = useId()
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const honeypot = new FormData(event.currentTarget).get("website")
    setError(null)

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email address, for example name@company.com.")
      return
    }

    setIsSubmitting(true)
    posthog.capture("scan_unlock_submitted", { locked_count: lockedCount })

    try {
      const response = await fetch("/api/tools/url-audit-unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scanId,
          email: email.trim(),
          website: typeof honeypot === "string" ? honeypot : "",
        }),
      })
      const payload = await response.json().catch(() => ({}))

      if (!response.ok || !Array.isArray(payload.violations)) {
        throw new Error(payload.error || "Could not unlock the result. Please try again.")
      }

      posthog.capture("scan_unlocked", { findings: payload.violations.length })
      onUnlocked(payload.violations as Violations)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not unlock the result. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border-2 border-primary/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <LockKeyhole className="h-5 w-5" aria-hidden="true" />
          {lockedCount} more {lockedCount === 1 ? "finding" : "findings"} on this page
        </CardTitle>
        <CardDescription className="text-base text-slate-700 dark:text-slate-200">
          The free scan shows the three most severe. Enter your work email to see every finding
          with its selector, WCAG criterion and fix. I read each scan request myself and may reply
          once with a short fix plan. No newsletter.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} noValidate className="space-y-4">
          <div className="space-y-2">
            <label htmlFor={emailId} className="text-sm font-medium">
              Work email
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Input
                id={emailId}
                type="email"
                name="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? `${errorId} ${noticeId}` : noticeId}
                disabled={isSubmitting}
                className="h-12 text-base sm:flex-1"
              />
              <Button type="submit" disabled={isSubmitting} className="h-12 px-6 text-base">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                    Unlocking...
                  </>
                ) : (
                  <>
                    Show all findings
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Honeypot: hidden from people and assistive technology alike. */}
          <div className="hidden" aria-hidden="true">
            <label>
              Website
              <input type="text" name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>

          {error && (
            <p id={errorId} role="alert" className="text-sm font-medium text-red-700 dark:text-red-300">
              {error}
            </p>
          )}

          <p id={noticeId} className="text-sm text-muted-foreground">
            By continuing you agree that {company.legalOperator} may email you about this scan. See the{" "}
            <Link href="/privacy" className="font-medium text-foreground underline underline-offset-4">
              privacy policy
            </Link>
            . Prefer an account?{" "}
            <Link href="/sign-up" className="font-medium text-foreground underline underline-offset-4">
              Create one free
            </Link>{" "}
            for 100 credits and saved audit history.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}

/**
 * The step after a result, for every visitor: what an automated scan cannot
 * tell them, and where a person takes over.
 */
export function AuditNextStep({ isPreview }: { isPreview: boolean }) {
  const track = (target: string) =>
    posthog.capture("scan_next_step_clicked", { target, is_preview: isPreview })

  return (
    <Card className="bg-muted/40">
      <CardHeader>
        <CardTitle className="text-xl">What this scan cannot tell you</CardTitle>
        <CardDescription className="text-base text-slate-700 dark:text-slate-200">
          axe-core tests the rules that have a clear pass or fail. Keyboard traps, focus order, what
          a screen reader actually announces, and most of the criteria added in WCAG 2.2 need a
          person. A manual audit by a CPACC-certified auditor covers those and leaves you with a
          prioritised fix list your developers can work through.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 sm:flex-row">
        <Button asChild className="h-11">
          <Link href="/services/accessibility-audits" onClick={() => track("audit_service")}>
            See how a manual audit works
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-11">
          <Link href="/contact" onClick={() => track("contact")}>
            Ask a question about these results
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
