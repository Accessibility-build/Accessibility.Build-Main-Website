"use client"

import { forwardRef, useMemo, useState } from "react"
import { Download, ExternalLink, FileSpreadsheet, FileText, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import type { UrlAuditResult } from "@/lib/url-accessibility-auditor-types"
import type { AuditFinding } from "@/lib/url-audit/types"
import { FreeScanUnlock, AuditNextStep } from "@/components/tools/free-scan-unlock"
import { CoverageMap } from "./coverage-map"
import { FindingsExplorer } from "./findings-explorer"
import { AiSummaryPanel, EngineDetails, ManualChecks, PageStructure, ScorePanel, SignalCards, parseSummary } from "./report-panels"
import { exportCsv, exportPdf, exportXlsx } from "./export"
import { hostOf } from "./meta"

interface AuditReportProps {
  audit: UrlAuditResult
  isSignedIn: boolean
  onDelete: () => void
  onUnlocked: (findings: AuditFinding[]) => void
}

/** The completed audit. The heading receives focus when a new result arrives (see UrlAuditor). */
export const AuditReport = forwardRef<HTMLHeadingElement, AuditReportProps>(function AuditReport({ audit, isSignedIn, onDelete, onUnlocked }, headingRef) {
  const [scFilter, setScFilter] = useState<string | null>(null)
  const findings = useMemo(() => audit.findings ?? [], [audit.findings])
  const summary = parseSummary(audit.aiSummary)
  const extras = audit.extras
  const elements = audit.violationElements ?? findings.filter((f) => f.outcome === "violation").reduce((sum, f) => sum + f.nodeCount, 0)
  const scanned = new Date(audit.processingCompletedAt ?? audit.createdAt)
  const locked = Boolean(audit.preview)

  const sections = [
    { id: "audit-overview", label: "Overview" },
    { id: "audit-findings", label: "Findings" },
    ...(extras ? [{ id: "audit-coverage", label: "WCAG coverage" }, { id: "audit-structure", label: "Structure & keyboard" }, { id: "audit-manual", label: "Manual testing plan" }] : []),
  ]

  const selectCriterion = (sc: string) => {
    setScFilter((current) => (current === sc ? null : sc))
    document.getElementById("audit-findings")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" })
  }

  const runExport = async (kind: "csv" | "xlsx" | "pdf") => {
    try {
      if (kind === "csv") exportCsv(audit)
      else if (kind === "xlsx") await exportXlsx(audit)
      else await exportPdf(audit)
    } catch (error) {
      console.error("Export failed:", error)
      toast.error("The download could not be created. Please try again.")
    }
  }

  return (
    <section aria-labelledby="audit-report-title" className="space-y-10">
      {/* Header */}
      <div id="audit-overview" className="scroll-mt-40 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="grid gap-0 md:grid-cols-[minmax(0,18rem)_minmax(0,1fr)]">
          <div className="relative border-b border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-950 md:border-b-0 md:border-r">
            {audit.screenshot ? (
              // eslint-disable-next-line @next/next/no-img-element -- a data URL from the scan, not an optimisable asset
              <img src={audit.screenshot} alt={`The first screen of ${audit.title || hostOf(audit.url)} as our browser saw it`} className="h-full max-h-64 w-full object-cover object-top md:max-h-none" />
            ) : (
              <div className="flex h-40 items-center justify-center p-6 text-center text-sm text-slate-600 dark:text-slate-400 md:h-full">{hostOf(audit.url)}</div>
            )}
          </div>
          <div className="min-w-0 p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-teal-800 dark:text-teal-300">Audit report</p>
            <h2 id="audit-report-title" ref={headingRef} tabIndex={-1} className="mt-1 break-words font-serif text-2xl font-semibold leading-tight text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 dark:text-white sm:text-3xl">
              {audit.title || hostOf(audit.url)}
            </h2>
            <a href={audit.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex max-w-full items-center gap-1 break-all text-sm font-medium text-teal-800 underline underline-offset-2 hover:decoration-2 dark:text-teal-300">
              {audit.url}
              <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Scanned <time dateTime={scanned.toISOString()}>{scanned.toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}</time>
              {extras ? ` in ${Math.round(extras.engine.durationMs / 1000)} seconds with axe-core ${extras.engine.axeVersion} and the accessibility.build checks` : " with axe-core"}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {!locked && findings.length > 0 && (
                <>
                  <ActionButton onClick={() => runExport("pdf")} icon={FileText}>
                    PDF
                  </ActionButton>
                  <ActionButton onClick={() => runExport("xlsx")} icon={FileSpreadsheet}>
                    Excel
                  </ActionButton>
                  <ActionButton onClick={() => runExport("csv")} icon={Download}>
                    CSV
                  </ActionButton>
                </>
              )}
              <ActionButton onClick={onDelete} icon={Trash2}>
                {isSignedIn ? "Delete audit" : "Clear result"}
              </ActionButton>
            </div>
          </div>
        </div>
      </div>

      {/* In-page navigation */}
      <nav aria-label="Report sections" className="-mx-1 overflow-x-auto rounded-xl border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <ul className="flex min-w-max gap-1">
          {sections.map((section) => (
            <li key={section.id}>
              <a href={`#${section.id}`} className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white">
                {section.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <ScorePanel
          score={audit.overallScore ?? 0}
          counts={{ critical: audit.criticalCount ?? 0, serious: audit.seriousCount ?? 0, moderate: audit.moderateCount ?? 0, minor: audit.minorCount ?? 0 }}
          totalViolations={audit.totalViolations ?? 0}
          elements={elements}
          reviewCount={audit.reviewCount ?? 0}
        />
        {summary ? (
          <AiSummaryPanel summary={summary} />
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm leading-6 text-slate-700 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300">
            <p className="font-semibold text-slate-900 dark:text-white">How to read this report</p>
            <p className="mt-2">Violations are confirmed failures and count toward the score. Items to review are leads a person needs to judge. The coverage map shows which WCAG criteria a machine could test here at all; the manual testing plan covers the rest.</p>
          </div>
        )}
      </div>

      {extras && (
        <div>
          <h2 className="mb-1 font-serif text-xl font-semibold text-slate-900 dark:text-white">Beyond axe-core</h2>
          <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">What we checked by driving the page like a person: keyboard, zoom, spacing and motion.</p>
          <SignalCards extras={extras} />
        </div>
      )}

      <div id="audit-findings" className="scroll-mt-40">
        <h2 className="mb-4 font-serif text-2xl font-semibold text-slate-900 dark:text-white">Findings</h2>
        <FindingsExplorer
          findings={findings}
          scFilter={scFilter}
          onClearSc={() => setScFilter(null)}
          totals={{ violation: audit.totalViolations ?? 0, review: audit.reviewCount ?? 0 }}
          lockedNotice={audit.preview ? <FreeScanUnlock scanId={audit.preview.scanId} lockedCount={audit.preview.lockedCount} onUnlocked={onUnlocked} /> : undefined}
        />
      </div>

      {extras && (
        <>
          <div id="audit-coverage" className="scroll-mt-40">
            <h2 className="mb-4 font-serif text-2xl font-semibold text-slate-900 dark:text-white">WCAG 2.2 coverage</h2>
            <CoverageMap coverage={extras.coverage} selected={scFilter} onSelect={selectCriterion} />
          </div>

          <div id="audit-structure" className="scroll-mt-40">
            <h2 className="mb-4 font-serif text-2xl font-semibold text-slate-900 dark:text-white">Structure and keyboard</h2>
            <PageStructure extras={extras} />
          </div>

          <div id="audit-manual" className="scroll-mt-40">
            <h2 className="mb-4 font-serif text-2xl font-semibold text-slate-900 dark:text-white">Your manual testing plan</h2>
            <ManualChecks checks={extras.manualChecks} />
          </div>

          <EngineDetails extras={extras} />
        </>
      )}

      {!extras && (
        <p className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          This audit was saved before the keyboard, reflow and coverage checks were added. Run it again for the full report.
        </p>
      )}

      <AuditNextStep isPreview={locked} />
    </section>
  )
})

function ActionButton({ onClick, icon: Icon, children }: { onClick: () => void; icon: typeof Download; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-10 items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 text-sm font-medium text-slate-800 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600",
        "dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800",
      )}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      {children}
    </button>
  )
}
