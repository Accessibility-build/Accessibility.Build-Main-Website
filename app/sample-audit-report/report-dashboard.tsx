"use client"

/**
 * Interactive viewer for the sample audit report.
 *
 * This component is itself a demonstration: an accessibility report viewer that
 * is not accessible would undercut everything the report says. So the view
 * switch uses aria-pressed rather than a tab pattern (both views show the same
 * content, there is no tabpanel relationship), filters are native selects with
 * real labels, the result count is announced politely, and every expandable row
 * is a real button with aria-expanded and aria-controls.
 */

import { Fragment, useId, useMemo, useState } from "react"
import Link from "next/link"
import {
  AlertOctagon,
  AlertTriangle,
  ChevronDown,
  Download,
  Info,
  LayoutGrid,
  ListChecks,
  Rows3,
  Search,
  Target,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  getReportStats,
  sampleAuditReport,
  severityMeta,
  severityOrder,
  type ConformanceLevel,
  type Finding,
  type Principle,
  type Severity,
} from "@/lib/sample-audit-report"

const findings = sampleAuditReport.findings as unknown as Finding[]
const stats = getReportStats()

/**
 * Severity styling. Every badge also carries its label as text, so the colour
 * is reinforcement rather than the sole carrier of meaning (1.4.1).
 */
const severityStyle: Record<Severity, string> = {
  Critical:
    "bg-red-100 text-red-900 border-red-300 dark:bg-red-950/50 dark:text-red-200 dark:border-red-900",
  High: "bg-orange-100 text-orange-900 border-orange-300 dark:bg-orange-950/50 dark:text-orange-200 dark:border-orange-900",
  Medium:
    "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-900",
  Low: "bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700",
}

const severityBar: Record<Severity, string> = {
  Critical: "bg-red-600",
  High: "bg-orange-500",
  Medium: "bg-amber-400",
  Low: "bg-slate-400",
}

function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded border px-2 py-0.5 text-xs font-semibold whitespace-nowrap",
        severityStyle[severity],
      )}
    >
      {severity}
    </span>
  )
}

function LevelBadge({ level }: { level: ConformanceLevel }) {
  return (
    <span className="inline-flex items-center rounded border border-blue-300 bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-900 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-200">
      Level {level}
    </span>
  )
}

function CriteriaLinks({ finding }: { finding: Finding }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {finding.criteria.map((c) => (
        <li key={c.id}>
          <Link
            href={c.href}
            className="inline-flex items-center gap-1 rounded border border-slate-300 bg-white px-2 py-0.5 text-xs font-medium text-blue-700 hover:bg-blue-50 hover:underline dark:border-slate-700 dark:bg-slate-900 dark:text-blue-300 dark:hover:bg-slate-800"
          >
            <span className="font-semibold">{c.id}</span>
            <span className="text-slate-600 dark:text-slate-400">{c.name}</span>
            <span className="text-slate-400 dark:text-slate-500">({c.level})</span>
          </Link>
        </li>
      ))}
    </ul>
  )
}

/** The full body of a finding, shared by both views so they cannot drift. */
function FindingDetail({ finding }: { finding: Finding }) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="space-y-5">
        <div>
          <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Description
          </h4>
          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {finding.description}
          </p>
        </div>

        <div>
          <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Steps to reproduce
          </h4>
          <ol className="list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {finding.reproSteps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>

        <div className="rounded-lg border border-red-200 bg-red-50/60 p-4 dark:border-red-900/60 dark:bg-red-950/20">
          <h4 className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-red-800 dark:text-red-300">
            <AlertOctagon className="h-3.5 w-3.5" aria-hidden="true" />
            Actual result
          </h4>
          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {finding.actualResult}
          </p>
        </div>

        <div className="rounded-lg border border-emerald-200 bg-emerald-50/60 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/20">
          <h4 className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
            <Target className="h-3.5 w-3.5" aria-hidden="true" />
            Expected result
          </h4>
          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {finding.expectedResult}
          </p>
        </div>
      </section>

      <section className="space-y-5">
        <div>
          <h4 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            User impact
          </h4>
          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {finding.userImpact}
          </p>
          <ul className="mt-2.5 flex flex-wrap gap-1.5">
            {finding.affectedGroups.map((group) => (
              <li
                key={group}
                className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                {group}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-blue-200 bg-blue-50/60 p-4 dark:border-blue-900/60 dark:bg-blue-950/20">
          <h4 className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-blue-900 dark:text-blue-300">
            <ListChecks className="h-3.5 w-3.5" aria-hidden="true" />
            Suggested resolution
          </h4>
          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {finding.suggestedResolution}
          </p>
        </div>

        {finding.codeExample ? (
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Code
            </h4>
            <div>
              <p className="mb-1 text-xs font-semibold text-red-700 dark:text-red-300">
                Current
              </p>
              <pre className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950 p-3 text-xs leading-relaxed text-slate-100">
                <code>{finding.codeExample.bad}</code>
              </pre>
            </div>
            <div>
              <p className="mb-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                Suggested
              </p>
              <pre className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950 p-3 text-xs leading-relaxed text-slate-100">
                <code>{finding.codeExample.good}</code>
              </pre>
            </div>
          </div>
        ) : null}

        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 border-t border-slate-200 pt-4 text-xs dark:border-slate-800">
          <div>
            <dt className="font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Location
            </dt>
            <dd className="mt-0.5 text-slate-700 dark:text-slate-300">
              {finding.location}
            </dd>
          </div>
          <div>
            <dt className="font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Component
            </dt>
            <dd className="mt-0.5 break-words font-mono text-slate-700 dark:text-slate-300">
              {finding.component}
            </dd>
          </div>
        </dl>
      </section>
    </div>
  )
}

export function ReportDashboard() {
  const [view, setView] = useState<"table" | "cards">("table")
  const [query, setQuery] = useState("")
  const [severity, setSeverity] = useState<Severity | "All">("All")
  const [level, setLevel] = useState<ConformanceLevel | "All">("All")
  const [principle, setPrinciple] = useState<Principle | "All">("All")
  const [expanded, setExpanded] = useState<string[]>([])
  const [exporting, setExporting] = useState(false)

  const uid = useId()
  const searchId = `${uid}-search`
  const sevId = `${uid}-sev`
  const levelId = `${uid}-level`
  const princId = `${uid}-princ`

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return findings.filter((f) => {
      if (severity !== "All" && f.severity !== severity) return false
      if (level !== "All" && f.conformanceLevel !== level) return false
      if (principle !== "All" && !f.criteria.some((c) => c.principle === principle))
        return false
      if (!q) return true
      return (
        f.title.toLowerCase().includes(q) ||
        f.id.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q) ||
        f.location.toLowerCase().includes(q) ||
        f.criteria.some(
          (c) =>
            c.id.includes(q) || c.name.toLowerCase().includes(q),
        )
      )
    })
  }, [query, severity, level, principle])

  const toggleRow = (id: string) =>
    setExpanded((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )

  const filtersActive =
    query.trim() !== "" || severity !== "All" || level !== "All" || principle !== "All"

  const resetFilters = () => {
    setQuery("")
    setSeverity("All")
    setLevel("All")
    setPrinciple("All")
  }

  /**
   * xlsx is heavy, so it is only pulled in when someone actually exports.
   * Keeping it out of the initial bundle matters more here than the tiny
   * delay on click.
   */
  const exportExcel = async () => {
    setExporting(true)
    try {
      const XLSX = await import("xlsx")

      const rows = visible.map((f) => ({
        ID: f.id,
        Issue: f.title,
        Description: f.description,
        Severity: f.severity,
        "Conformance level": f.conformanceLevel,
        "WCAG criteria": f.criteria
          .map((c) => `${c.id} ${c.name} (Level ${c.level})`)
          .join("\n"),
        Principle: [...new Set(f.criteria.map((c) => c.principle))].join(", "),
        Location: f.location,
        Component: f.component,
        "Steps to reproduce": f.reproSteps
          .map((s, i) => `${i + 1}. ${s}`)
          .join("\n"),
        "Actual result": f.actualResult,
        "Expected result": f.expectedResult,
        "User impact": f.userImpact,
        "Affected groups": f.affectedGroups.join(", "),
        "Suggested resolution": f.suggestedResolution,
        Status: f.status,
      }))

      const sheet = XLSX.utils.json_to_sheet(rows)
      // Column widths, or every long field collapses into an unreadable sliver.
      sheet["!cols"] = [
        { wch: 9 }, { wch: 52 }, { wch: 70 }, { wch: 10 }, { wch: 12 },
        { wch: 40 }, { wch: 22 }, { wch: 34 }, { wch: 34 }, { wch: 70 },
        { wch: 70 }, { wch: 70 }, { wch: 70 }, { wch: 34 }, { wch: 70 },
        { wch: 10 },
      ]

      const summary = XLSX.utils.json_to_sheet([
        { Field: "Report", Value: sampleAuditReport.title },
        { Field: "Product", Value: sampleAuditReport.product },
        { Field: "Version", Value: sampleAuditReport.version },
        { Field: "Issued", Value: sampleAuditReport.issued },
        { Field: "Conformance target", Value: sampleAuditReport.target },
        { Field: "Total findings in report", Value: stats.total },
        { Field: "Rows in this export", Value: visible.length },
        { Field: "Critical and High", Value: stats.blocking },
        { Field: "Distinct WCAG criteria", Value: stats.uniqueCriteria },
        { Field: "Disclosure", Value: sampleAuditReport.disclosure },
      ])
      summary["!cols"] = [{ wch: 26 }, { wch: 110 }]

      const book = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(book, summary, "Summary")
      XLSX.utils.book_append_sheet(book, sheet, "Findings")
      XLSX.writeFile(book, "northstar-checkout-accessibility-audit.xlsx")
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* ---------- Summary tiles ---------- */}
      <section aria-labelledby={`${uid}-summary`}>
        <h2
          id={`${uid}-summary`}
          className="mb-4 text-xl font-semibold text-slate-900 dark:text-white"
        >
          Report summary
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Total findings
            </p>
            <p className="mt-1 text-3xl font-bold tabular-nums text-slate-900 dark:text-white">
              {stats.total}
            </p>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
              Across {sampleAuditReport.scope.length} audited states
            </p>
          </div>

          <div className="rounded-xl border border-red-200 bg-red-50/50 p-5 dark:border-red-900/60 dark:bg-red-950/20">
            <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-red-800 dark:text-red-300">
              <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
              Blocking
            </p>
            <p className="mt-1 text-3xl font-bold tabular-nums text-red-900 dark:text-red-200">
              {stats.blocking}
            </p>
            <p className="mt-1 text-xs text-red-800/80 dark:text-red-300/80">
              Critical and High, fix these first
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              WCAG criteria affected
            </p>
            <p className="mt-1 text-3xl font-bold tabular-nums text-slate-900 dark:text-white">
              {stats.uniqueCriteria}
            </p>
            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
              Distinct success criteria failed
            </p>
          </div>

        </div>

        {/* Severity distribution. The bar is decorative; the table below it
            carries the same numbers as text. */}
        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
          <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">
            Severity distribution
          </h3>
          <div
            className="flex h-2.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
            aria-hidden="true"
          >
            {stats.bySeverity
              .filter((s) => s.count > 0)
              .map((s) => (
                <div
                  key={s.severity}
                  className={severityBar[s.severity]}
                  style={{ width: `${(s.count / stats.total) * 100}%` }}
                />
              ))}
          </div>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {stats.bySeverity.map((s) => (
              <div key={s.severity} className="flex items-start gap-2.5">
                <span
                  className={cn("mt-1 h-3 w-3 shrink-0 rounded-sm", severityBar[s.severity])}
                  aria-hidden="true"
                />
                <div>
                  <dt className="text-sm font-semibold text-slate-900 dark:text-white">
                    {s.count} {s.severity}
                  </dt>
                  <dd className="text-xs leading-snug text-slate-600 dark:text-slate-400">
                    {severityMeta[s.severity].blurb}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------- Toolbar ---------- */}
      <section aria-labelledby={`${uid}-findings`} className="space-y-4">
        <h2
          id={`${uid}-findings`}
          className="text-xl font-semibold text-slate-900 dark:text-white"
        >
          Detailed findings
        </h2>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
          <div className="flex flex-wrap items-end gap-4">
            <div className="min-w-[16rem] flex-1">
              <label
                htmlFor={searchId}
                className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400"
              >
                Search findings
              </label>
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  aria-hidden="true"
                />
                <input
                  id={searchId}
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Title, ID, criterion, or location"
                  className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor={sevId}
                className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400"
              >
                Severity
              </label>
              <select
                id={sevId}
                value={severity}
                onChange={(e) => setSeverity(e.target.value as Severity | "All")}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              >
                <option value="All">All severities</option>
                {severityOrder.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor={levelId}
                className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400"
              >
                Conformance
              </label>
              <select
                id={levelId}
                value={level}
                onChange={(e) => setLevel(e.target.value as ConformanceLevel | "All")}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              >
                <option value="All">All levels</option>
                <option value="A">Level A</option>
                <option value="AA">Level AA</option>
              </select>
            </div>

            <div>
              <label
                htmlFor={princId}
                className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400"
              >
                Principle
              </label>
              <select
                id={princId}
                value={principle}
                onChange={(e) => setPrinciple(e.target.value as Principle | "All")}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              >
                <option value="All">All principles</option>
                <option value="Perceivable">Perceivable</option>
                <option value="Operable">Operable</option>
                <option value="Understandable">Understandable</option>
                <option value="Robust">Robust</option>
              </select>
            </div>

            {/* View switch. Both buttons render the same data, so aria-pressed
                is correct here and a tablist would not be. */}
            <div
              role="group"
              aria-label="Choose how findings are displayed"
              className="flex overflow-hidden rounded-lg border border-slate-300 dark:border-slate-700"
            >
              <button
                type="button"
                aria-pressed={view === "table"}
                onClick={() => setView("table")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500",
                  view === "table"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-slate-700 hover:bg-slate-100 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-800",
                )}
              >
                <Rows3 className="h-4 w-4" aria-hidden="true" />
                Table
              </button>
              <button
                type="button"
                aria-pressed={view === "cards"}
                onClick={() => setView("cards")}
                className={cn(
                  "flex items-center gap-1.5 border-l border-slate-300 px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500 dark:border-slate-700",
                  view === "cards"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-slate-700 hover:bg-slate-100 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-800",
                )}
              >
                <LayoutGrid className="h-4 w-4" aria-hidden="true" />
                Cards
              </button>
            </div>

            <Button
              type="button"
              onClick={exportExcel}
              disabled={exporting || visible.length === 0}
              className="gap-2"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              {exporting ? "Preparing..." : "Download Excel"}
            </Button>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            {/* Announced politely so filtering is perceivable without sight. */}
            <p
              aria-live="polite"
              className="text-sm text-slate-600 dark:text-slate-400"
            >
              Showing {visible.length} of {stats.total} findings
            </p>
            {filtersActive ? (
              <button
                type="button"
                onClick={resetFilters}
                className="text-sm font-medium text-blue-700 underline underline-offset-2 hover:text-blue-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-blue-300"
              >
                Clear filters
              </button>
            ) : null}
          </div>
        </div>

        {visible.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-700 dark:bg-slate-900">
            <p className="font-medium text-slate-900 dark:text-white">
              No findings match these filters.
            </p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Try widening the severity or principle filter.
            </p>
            <Button variant="outline" onClick={resetFilters} className="mt-4">
              Clear filters
            </Button>
          </div>
        ) : view === "table" ? (
          /* ---------- Table view ---------- */
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            <table className="w-full min-w-[64rem] text-left text-sm">
              <caption className="sr-only">
                Accessibility findings for {sampleAuditReport.product}. Each row
                can be expanded for reproduction steps, actual and expected
                results, and the suggested resolution.
              </caption>
              <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/80">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    <span className="sr-only">Expand</span>
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">ID</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Issue</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Severity</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Level</th>
                  <th scope="col" className="px-4 py-3 font-semibold">WCAG criteria</th>
                  <th scope="col" className="px-4 py-3 font-semibold">Location</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {visible.map((f) => {
                  const isOpen = expanded.includes(f.id)
                  const panelId = `${uid}-panel-${f.id}`
                  return (
                    <Fragment key={f.id}>
                      <tr className="align-top">
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => toggleRow(f.id)}
                            aria-expanded={isOpen}
                            aria-controls={panelId}
                            className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:bg-slate-800 dark:hover:text-white"
                          >
                            <ChevronDown
                              className={cn(
                                "h-4 w-4 transition-transform",
                                isOpen && "rotate-180",
                              )}
                              aria-hidden="true"
                            />
                            <span className="sr-only">
                              {isOpen ? "Hide" : "Show"} details for {f.id}, {f.title}
                            </span>
                          </button>
                        </td>
                        <th
                          scope="row"
                          className="whitespace-nowrap px-4 py-3 font-mono text-xs font-semibold text-slate-900 dark:text-white"
                        >
                          {f.id}
                        </th>
                        <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                          {f.title}
                        </td>
                        <td className="px-4 py-3">
                          <SeverityBadge severity={f.severity} />
                        </td>
                        <td className="px-4 py-3">
                          <LevelBadge level={f.conformanceLevel} />
                        </td>
                        <td className="px-4 py-3">
                          <CriteriaLinks finding={f} />
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                          {f.location}
                        </td>
                      </tr>
                      {isOpen ? (
                        <tr id={panelId}>
                          <td
                            colSpan={7}
                            className="border-t border-slate-200 bg-slate-50/70 px-6 py-6 dark:border-slate-800 dark:bg-slate-900/50"
                          >
                            <FindingDetail finding={f} />
                          </td>
                        </tr>
                      ) : null}
                    </Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* ---------- Card view ---------- */
          <ul className="grid gap-6 2xl:grid-cols-2">
            {visible.map((f) => (
              <li
                key={f.id}
                className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-slate-500 dark:text-slate-400">
                    {f.id}
                  </span>
                  <SeverityBadge severity={f.severity} />
                  <LevelBadge level={f.conformanceLevel} />
                  <span className="ml-auto text-xs text-slate-500 dark:text-slate-400">
                    {severityMeta[f.severity].sla}
                  </span>
                </div>
                <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">
                  {f.title}
                </h3>
                <div className="mb-5">
                  <CriteriaLinks finding={f} />
                </div>
                <FindingDetail finding={f} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
        <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <span>
          The Excel export contains every column shown here plus the full
          reproduction steps, actual and expected results, and suggested
          resolution for each finding, on a Findings sheet with a Summary sheet
          alongside it. It exports whatever your current filters show, so you can
          hand a developer just the Critical rows if that is all they need.
        </span>
      </p>
    </div>
  )
}
