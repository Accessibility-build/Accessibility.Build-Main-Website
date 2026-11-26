"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import posthog from "posthog-js"
import { useUser } from "@clerk/nextjs"
import { toast } from "sonner"
import { Check, Coins, History, Search, Zap } from "lucide-react"
import { useCredits } from "@/hooks/use-credits"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UrlCheckForm } from "@/components/tools/url-check-form"
import { SCAN_HANDOFF_STORAGE_KEY } from "@/lib/free-scan"
import { normalizeInputUrl } from "@/lib/url-safety"
import type { AuditHistory, UrlAuditResult } from "@/lib/url-accessibility-auditor-types"
import type { AuditFinding } from "@/lib/url-audit/types"
import { formatRemainingTime, getUnlimitedAccessRemainingTime, hasUnlimitedAccess } from "@/lib/unlimited-access"
import { AuditProgress } from "./audit-progress"
import { AuditReport } from "./audit-report"
import { AuditHistoryList } from "./audit-history"

const WHAT_WE_CHECK = [
  "axe-core WCAG 2.2 rules",
  "Keyboard Tab pass",
  "Visible focus, by screenshot",
  "Focus hidden by sticky content",
  "Reflow at 320 pixels",
  "Text spacing (1.4.12)",
  "Reduced motion",
  "Alt text, forms and link text",
]

/**
 * The URL Accessibility Auditor: start an audit, follow it, read the report, and reopen saved
 * audits. The scan itself is the server action in app/actions/url-accessibility-auditor-actions.ts.
 */
export default function UrlAuditor() {
  const { isSignedIn } = useUser()
  const { refreshCredits } = useCredits()

  const [url, setUrl] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [runningUrl, setRunningUrl] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [audit, setAudit] = useState<UrlAuditResult | null>(null)
  const [announcement, setAnnouncement] = useState("")
  const [tab, setTab] = useState("audit")
  const [history, setHistory] = useState<AuditHistory | null>(null)
  const [historyLoading, setHistoryLoading] = useState(false)
  const [unlimitedAccess, setUnlimitedAccess] = useState(false)
  const [remainingTime, setRemainingTime] = useState(0)
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const check = () => {
      const access = hasUnlimitedAccess()
      setUnlimitedAccess(access)
      if (access) setRemainingTime(getUnlimitedAccessRemainingTime())
    }
    check()
    const interval = setInterval(check, 60_000)
    return () => clearInterval(interval)
  }, [])

  const loadHistory = async () => {
    setHistoryLoading(true)
    try {
      const { getAuditHistory } = await import("@/app/actions/url-accessibility-auditor-actions")
      setHistory(await getAuditHistory())
    } catch (err) {
      console.error("Failed to load audit history:", err)
    } finally {
      setHistoryLoading(false)
    }
  }

  useEffect(() => {
    if (isSignedIn) void loadHistory()
  }, [isSignedIn])

  // Move focus to the report heading once it is on the page. Done from an effect keyed on the
  // result, because focusing straight after the await runs before React has rendered it.
  const focusKey = audit?.status === "completed" ? audit.auditId : null
  useEffect(() => {
    if (focusKey) headingRef.current?.focus()
  }, [focusKey])

  const startAudit = async (rawUrl: string, source: "form" | "handoff") => {
    const normalized = normalizeInputUrl(rawUrl)
    if (!normalized) {
      setError("Enter a full public address, for example https://example.com")
      return
    }
    const target = normalized.toString()
    setUrl(target)
    setRunningUrl(target)
    setIsRunning(true)
    setError(null)
    setAudit(null)
    setTab("audit")
    setAnnouncement(`Auditing ${target}. This usually takes 30 to 60 seconds.`)
    posthog.capture("scan_started", { source, is_signed_in: Boolean(isSignedIn) })

    try {
      const { runUrlAccessibilityAudit } = await import("@/app/actions/url-accessibility-auditor-actions")
      const result = await runUrlAccessibilityAudit(target, unlimitedAccess)
      if (result.status === "failed") throw new Error(result.errorMessage || "The audit failed.")

      setAudit(result)
      setAnnouncement(
        `Audit complete. Score ${result.overallScore} out of 100, ${result.totalViolations ?? 0} failing rules and ${result.reviewCount ?? 0} items to review.`,
      )
      posthog.capture("scan_completed", {
        source,
        is_signed_in: Boolean(isSignedIn),
        is_preview: Boolean(result.preview),
        overall_score: result.overallScore,
        total_violations: result.totalViolations,
        review_count: result.reviewCount,
        locked_count: result.preview?.lockedCount ?? 0,
      })
      if (isSignedIn) {
        refreshCredits()
        void loadHistory()
      }
    } catch (err) {
      const message = err instanceof Error && err.message ? err.message : "The audit failed. Please try again."
      setError(message)
      setAnnouncement(`The audit failed. ${message}`)
      posthog.capture("scan_failed", { source, is_signed_in: Boolean(isSignedIn) })
    } finally {
      setIsRunning(false)
    }
  }

  // A tool page (palette generator, contrast checker, lawsuit tracker) can hand a URL over through
  // sessionStorage. The visitor already pressed "scan" there, so start straight away. The ref stops
  // React's development double-invoke from spending their one free scan twice.
  const handoffConsumed = useRef(false)
  useEffect(() => {
    if (handoffConsumed.current) return
    handoffConsumed.current = true
    try {
      const handedOver = window.sessionStorage.getItem(SCAN_HANDOFF_STORAGE_KEY)
      if (!handedOver) return
      window.sessionStorage.removeItem(SCAN_HANDOFF_STORAGE_KEY)
      void startAudit(handedOver, "handoff")
    } catch {
      // Storage can be blocked; the form still works.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const openFromHistory = async (auditId: string) => {
    try {
      const { getAudit } = await import("@/app/actions/url-accessibility-auditor-actions")
      const saved = await getAudit(auditId)
      if (!saved) {
        toast.error("That audit could not be found.")
        return
      }
      setError(null)
      setAudit(saved)
      setTab("audit")
    } catch (err) {
      console.error("Failed to load audit:", err)
      toast.error("The audit could not be opened.")
    }
  }

  const deleteById = async (auditId: string) => {
    try {
      const { deleteAudit } = await import("@/app/actions/url-accessibility-auditor-actions")
      await deleteAudit(auditId)
      if (audit?.auditId === auditId) setAudit(null)
      void loadHistory()
      toast.success("Audit deleted")
    } catch {
      toast.error("The audit could not be deleted.")
    }
  }

  const clearCurrent = () => {
    if (!audit) return
    if (isSignedIn && audit.auditId && !audit.preview) void deleteById(audit.auditId)
    else setAudit(null)
  }

  const onUnlocked = (findings: AuditFinding[]) => {
    setAudit((current) => (current ? { ...current, findings, preview: undefined } : current))
  }

  const formHelp = isSignedIn ? (
    <span className="inline-flex flex-wrap items-center gap-1">
      <Coins className="h-3.5 w-3.5" aria-hidden="true" />
      {unlimitedAccess ? "Unlimited access: no credits are used." : "Five credits per audit. Saved to your history."}
    </span>
  ) : (
    <>
      One free scan a day without an account: the score, every check above and the three most severe findings.{" "}
      <Link href="/sign-up" className="font-medium text-teal-800 underline underline-offset-2 dark:text-teal-300">
        Create a free account
      </Link>{" "}
      for 100 credits and full results, or{" "}
      <Link href="/sign-in" className="font-medium text-teal-800 underline underline-offset-2 dark:text-teal-300">
        sign in
      </Link>
      .
    </>
  )

  const workspace = (
    <div className="space-y-8">
      <UrlCheckForm
        value={url}
        onChange={setUrl}
        onSubmit={() => {
          if (url.trim()) void startAudit(url, "form")
          else setError("Enter the address of the page to audit.")
        }}
        loading={isRunning}
        submitLabel={isSignedIn ? "Audit this page" : "Run my free audit"}
        loadingLabel="Auditing"
        label="Page address"
        help={formHelp}
        error={error}
        className="mx-auto max-w-3xl"
      />
      {isRunning && <AuditProgress url={runningUrl} />}
      {!isRunning && audit?.status === "completed" && <AuditReport ref={headingRef} audit={audit} isSignedIn={Boolean(isSignedIn)} onDelete={clearCurrent} onUnlocked={onUnlocked} />}
    </div>
  )

  return (
    <div className="container-wide py-10 sm:py-14">
      <p className="sr-only" role="status" aria-live="polite">
        {announcement}
      </p>

      {unlimitedAccess && (
        <div className="mx-auto mb-8 flex max-w-3xl flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm text-emerald-950 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-100">
          <span className="flex items-center gap-2 font-medium">
            <Zap className="h-4 w-4" aria-hidden="true" />
            Unlimited access is on. Expires in {formatRemainingTime(remainingTime)}.
          </span>
          <Link href="/unlimitedaccess" className="font-medium underline underline-offset-2">
            Manage access
          </Link>
        </div>
      )}

      <header className="mx-auto max-w-4xl text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-teal-800 dark:text-teal-300">WCAG 2.2 page audit</p>
        <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-5xl">URL Accessibility Auditor</h1>
        <p className="mx-auto mt-4 max-w-3xl text-lg leading-8 text-slate-700 dark:text-slate-300">
          Most scanners stop at axe-core. This one also presses Tab through your page, narrows it to a phone&apos;s width, stretches the text spacing and checks patterns axe-core skips, then maps every result to WCAG 2.2 and tells you what is left to test by hand.
        </p>
        <ul className="mx-auto mt-6 flex max-w-3xl flex-wrap justify-center gap-2" aria-label="What the audit checks">
          {WHAT_WE_CHECK.map((item) => (
            <li key={item} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-800 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
              <Check className="h-3.5 w-3.5 text-teal-700 dark:text-teal-400" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </header>

      <div className="mx-auto mt-10 max-w-7xl">
        {isSignedIn ? (
          <Tabs value={tab} onValueChange={setTab} className="space-y-8">
            <TabsList className="mx-auto grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="audit" className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                <Search className="h-4 w-4" aria-hidden="true" />
                Audit
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                <History className="h-4 w-4" aria-hidden="true" />
                History{history ? ` (${history.audits.length})` : ""}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="audit" className="mt-0">
              {workspace}
            </TabsContent>
            <TabsContent value="history" className="mt-0">
              <AuditHistoryList history={history} loading={historyLoading} onOpen={openFromHistory} onDelete={deleteById} />
            </TabsContent>
          </Tabs>
        ) : (
          workspace
        )}
      </div>
    </div>
  )
}
