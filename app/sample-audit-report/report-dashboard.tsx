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

import { Fragment, useId, useMemo, useState, type ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import {
  AlertOctagon,
  AlertTriangle,
  Camera,
  ChevronDown,
  ChevronsDownUp,
  ChevronsUpDown,
  Download,
  ExternalLink,
  Info,
  LayoutGrid,
  ListChecks,
  Maximize2,
  Rows3,
  Search,
  Target,
  Users,
  X,
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
    <span className="inline-flex items-center whitespace-nowrap rounded border border-blue-300 bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-900 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-200">
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
            <span className="text-slate-600 dark:text-slate-400">
              ({c.level})
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}

const sectionLabel =
  "mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400"

/**
 * Full-size view of a finding's screenshot. `trigger` is the control that opens
 * it; Radix returns focus there on close.
 */
function EvidenceLightbox({
  finding,
  open,
  onOpenChange,
  trigger,
}: {
  finding: Finding
  open: boolean
  onOpenChange: (open: boolean) => void
  trigger: ReactNode
}) {
  const ev = finding.evidence
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[80] bg-slate-950/95" />
        <DialogPrimitive.Content className="fixed inset-0 z-[81] flex flex-col overflow-y-auto p-3 focus:outline-none sm:p-6">
          <div className="mx-auto flex w-full max-w-[1600px] flex-wrap items-start justify-between gap-3 pb-3">
            <div className="min-w-0">
              <DialogPrimitive.Title className="text-base font-semibold text-white sm:text-lg">
                {finding.id} evidence: {finding.title}
              </DialogPrimitive.Title>
              <DialogPrimitive.Description className="mt-1 text-sm text-slate-300">
                {ev.alt}
              </DialogPrimitive.Description>
            </div>
            <div className="flex shrink-0 gap-2">
              <a
                href={ev.src}
                target="_blank"
                rel="noopener"
                className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg border border-slate-600 px-3 text-sm font-medium text-white hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
                Full size
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
              <DialogPrimitive.Close className="inline-flex min-h-[40px] items-center gap-1.5 rounded-lg bg-white px-3 text-sm font-semibold text-slate-900 hover:bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950">
                <X className="h-4 w-4" aria-hidden="true" />
                Close
              </DialogPrimitive.Close>
            </div>
          </div>
          <div className="mx-auto w-full max-w-[1600px]">
            <Image
              src={ev.src}
              width={ev.width}
              height={ev.height}
              alt=""
              sizes="96vw"
              className="mx-auto h-auto max-h-[calc(100dvh-9rem)] w-auto max-w-full rounded-lg"
            />
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

/**
 * Small preview in the table row. The button carries the name, so the image
 * inside it is decorative; the full description is in the expanded row and the
 * lightbox.
 */
function EvidenceThumbnail({ finding }: { finding: Finding }) {
  const [open, setOpen] = useState(false)
  const ev = finding.evidence
  return (
    <EvidenceLightbox
      finding={finding}
      open={open}
      onOpenChange={setOpen}
      trigger={
        <button
          type="button"
          className="group relative block h-[72px] w-[120px] overflow-hidden rounded-md border border-slate-200 bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:border-slate-700 dark:bg-slate-800 dark:focus-visible:ring-offset-slate-900"
        >
          <Image
            src={ev.src}
            width={ev.width}
            height={ev.height}
            alt=""
            sizes="120px"
            className="h-full w-full object-contain transition-transform duration-200 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
          <span
            aria-hidden="true"
            className="absolute bottom-1 right-1 grid h-5 w-5 place-items-center rounded bg-slate-900/80 text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
          >
            <Maximize2 className="h-3 w-3" />
          </span>
          <span className="sr-only">View screenshot for {finding.id}</span>
        </button>
      }
    />
  )
}

/**
 * Screenshot with the red-box notes as real text. The Enlarge button is the
 * keyboard path to the full-size view; clicking the image does the same for
 * pointer users.
 */
function EvidenceFigure({ finding }: { finding: Finding }) {
  const [open, setOpen] = useState(false)
  const ev = finding.evidence
  // A phone-width capture (the reflow finding) would fill the column at a
  // huge size, so it is shown at the width it represents.
  const portrait = ev.height > ev.width
  return (
    <figure className="overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-4 py-2.5 dark:border-slate-800">
        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
          <Camera className="h-3.5 w-3.5" aria-hidden="true" />
          Evidence
        </p>
        <EvidenceLightbox
          finding={finding}
          open={open}
          onOpenChange={setOpen}
          trigger={
            <button
              type="button"
              className="inline-flex min-h-[32px] items-center gap-1.5 rounded-md border border-slate-300 bg-white px-2.5 text-xs font-medium text-slate-800 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <Maximize2 className="h-3.5 w-3.5" aria-hidden="true" />
              Enlarge
              <span className="sr-only"> screenshot for {finding.id}</span>
            </button>
          }
        />
      </div>
      <div
        className="cursor-zoom-in bg-slate-100 dark:bg-slate-900"
        onClick={() => setOpen(true)}
      >
        <Image
          src={ev.src}
          width={ev.width}
          height={ev.height}
          alt={ev.alt}
          sizes={
            portrait
              ? "320px"
              : "(min-width: 1280px) 52vw, (min-width: 640px) 90vw, 100vw"
          }
          className={cn("h-auto w-full", portrait && "mx-auto max-w-[320px]")}
        />
      </div>
      <figcaption className="space-y-2 border-t border-slate-200 px-4 py-3 dark:border-slate-800">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
          What the red {ev.marks.length === 1 ? "box shows" : "boxes show"}
        </p>
        <ul role="list" className="space-y-1.5">
          {ev.marks.map((mark, i) => (
            <li
              key={i}
              className="flex gap-2.5 text-sm leading-snug text-slate-700 dark:text-slate-300"
            >
              <span
                aria-hidden="true"
                className="mt-[3px] h-3.5 w-3.5 shrink-0 rounded-[3px] border-2 border-rose-600"
              />
              <span>{mark}</span>
            </li>
          ))}
        </ul>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Recreated screen. Northstar is fictional, so the state is drawn to
          match the defect rather than captured from a live product.
        </p>
      </figcaption>
    </figure>
  )
}

/** The full body of a finding, shared by both views so they cannot drift. */
function FindingDetail({ finding }: { finding: Finding }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <EvidenceFigure finding={finding} />

        <div className="space-y-5">
          <div>
            <h4 className={sectionLabel}>Description</h4>
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              {finding.description}
            </p>
          </div>

          <dl className="grid gap-x-4 gap-y-3 rounded-xl border border-slate-200 bg-white p-4 text-sm dark:border-slate-800 dark:bg-slate-950 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <dt className={sectionLabel.replace("mb-2", "mb-0.5")}>
                Location
              </dt>
              <dd className="text-slate-800 dark:text-slate-200">
                {finding.location}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className={sectionLabel.replace("mb-2", "mb-0.5")}>
                Component
              </dt>
              <dd className="break-words font-mono text-xs text-slate-800 dark:text-slate-200">
                {finding.component}
              </dd>
            </div>
            <div>
              <dt className={sectionLabel.replace("mb-2", "mb-0.5")}>Fix by</dt>
              <dd className="text-slate-800 dark:text-slate-200">
                {severityMeta[finding.severity].sla}
              </dd>
            </div>
            <div>
              <dt className={sectionLabel.replace("mb-2", "mb-0.5")}>Status</dt>
              <dd className="text-slate-800 dark:text-slate-200">
                {finding.status}
              </dd>
            </div>
          </dl>

          <div>
            <h4 className={sectionLabel}>Who it affects</h4>
            <ul className="flex flex-wrap gap-1.5">
              {finding.affectedGroups.map((group) => (
                <li
                  key={group}
                  className="rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                >
                  {group}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
        <h4 className={sectionLabel}>Steps to reproduce</h4>
        <ol role="list" className="grid gap-2.5 md:grid-cols-2">
          {finding.reproSteps.map((step, i) => (
            <li
              key={i}
              className="flex gap-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300"
            >
              <span
                aria-hidden="true"
                className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-slate-900 text-xs font-semibold text-white dark:bg-slate-100 dark:text-slate-900"
              >
                {i + 1}
              </span>
              <span>
                <span className="sr-only">Step {i + 1}: </span>
                {step}
              </span>
            </li>
          ))}
        </ol>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-red-200 bg-red-50/70 p-5 dark:border-red-900/60 dark:bg-red-950/20">
          <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-red-800 dark:text-red-300">
            <AlertOctagon className="h-3.5 w-3.5" aria-hidden="true" />
            Actual result
          </h4>
          <p className="text-sm leading-relaxed text-slate-800 dark:text-slate-200">
            {finding.actualResult}
          </p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-5 dark:border-emerald-900/60 dark:bg-emerald-950/20">
          <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
            <Target className="h-3.5 w-3.5" aria-hidden="true" />
            Expected result
          </h4>
          <p className="text-sm leading-relaxed text-slate-800 dark:text-slate-200">
            {finding.expectedResult}
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950">
          <h4 className={cn(sectionLabel, "flex items-center gap-1.5")}>
            <Users className="h-3.5 w-3.5" aria-hidden="true" />
            User impact
          </h4>
          <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
            {finding.userImpact}
          </p>
        </div>
        <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-5 dark:border-blue-900/60 dark:bg-blue-950/20">
          <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-blue-900 dark:text-blue-300">
            <ListChecks className="h-3.5 w-3.5" aria-hidden="true" />
            Suggested resolution
          </h4>
          <p className="text-sm leading-relaxed text-slate-800 dark:text-slate-200">
            {finding.suggestedResolution}
          </p>
        </div>
      </div>

      {finding.codeExample ? (
        <div>
          <h4 className={sectionLabel}>Code</h4>
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="min-w-0">
              <p className="mb-1 text-xs font-semibold text-red-700 dark:text-red-300">
                Current
              </p>
              <pre
                tabIndex={0}
                className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950 p-3 text-xs leading-relaxed text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <code>{finding.codeExample.bad}</code>
              </pre>
            </div>
            <div className="min-w-0">
              <p className="mb-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                Suggested
              </p>
              <pre
                tabIndex={0}
                className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950 p-3 text-xs leading-relaxed text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <code>{finding.codeExample.good}</code>
              </pre>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export function ReportDashboard() {
  const [view, setView] = useState<"table" | "cards">("table")
  const [query, setQuery] = useState("")
  const [severity, setSeverity] = useState<Severity | "All">("All")
  const [level, setLevel] = useState<ConformanceLevel | "All">("All")
  const [principle, setPrinciple] = useState<Principle | "All">("All")
  // The first finding starts open so the full anatomy of a finding is visible
  // without a click.
  const [expanded, setExpanded] = useState<string[]>([findings[0].id])
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
      if (
        principle !== "All" &&
        !f.criteria.some((c) => c.principle === principle)
      )
        return false
      if (!q) return true
      return (
        f.title.toLowerCase().includes(q) ||
        f.id.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q) ||
        f.location.toLowerCase().includes(q) ||
        f.criteria.some(
          (c) => c.id.includes(q) || c.name.toLowerCase().includes(q),
        )
      )
    })
  }, [query, severity, level, principle])

  const toggleRow = (id: string) =>
    setExpanded((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )

  const allOpen =
    visible.length > 0 && visible.every((f) => expanded.includes(f.id))
  const toggleAll = () => setExpanded(allOpen ? [] : visible.map((f) => f.id))

  const filtersActive =
    query.trim() !== "" ||
    severity !== "All" ||
    level !== "All" ||
    principle !== "All"

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
        Screenshot: `https://accessibility.build${f.evidence.src}`,
        "Screenshot notes": f.evidence.marks
          .map((m, i) => `${i + 1}. ${m}`)
          .join("\n"),
        Status: f.status,
      }))

      const sheet = XLSX.utils.json_to_sheet(rows)
      // Column widths, or every long field collapses into an unreadable sliver.
      sheet["!cols"] = [
        { wch: 9 },
        { wch: 52 },
        { wch: 70 },
        { wch: 10 },
        { wch: 12 },
        { wch: 40 },
        { wch: 22 },
        { wch: 34 },
        { wch: 34 },
        { wch: 70 },
        { wch: 70 },
        { wch: 70 },
        { wch: 70 },
        { wch: 34 },
        { wch: 70 },
        { wch: 60 },
        { wch: 70 },
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
              <div key={s.severity}>
                <dt className="flex items-start gap-2.5 text-sm font-semibold text-slate-900 dark:text-white">
                  <span
                    className={cn(
                      "mt-1 h-3 w-3 shrink-0 rounded-sm",
                      severityBar[s.severity],
                    )}
                    aria-hidden="true"
                  />
                  {s.count} {s.severity}
                </dt>
                <dd className="pl-[1.375rem] text-xs leading-snug text-slate-600 dark:text-slate-400">
                  {severityMeta[s.severity].blurb}
                </dd>
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
                onChange={(e) =>
                  setSeverity(e.target.value as Severity | "All")
                }
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
                onChange={(e) =>
                  setLevel(e.target.value as ConformanceLevel | "All")
                }
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
                onChange={(e) =>
                  setPrinciple(e.target.value as Principle | "All")
                }
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
              className="hidden overflow-hidden rounded-lg border border-slate-300 dark:border-slate-700 lg:flex"
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
            {view === "table" && visible.length > 0 ? (
              <button
                type="button"
                onClick={toggleAll}
                className="hidden items-center gap-1 text-sm font-medium text-blue-700 underline underline-offset-2 hover:text-blue-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-blue-300 lg:inline-flex"
              >
                {allOpen ? (
                  <ChevronsDownUp className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <ChevronsUpDown className="h-4 w-4" aria-hidden="true" />
                )}
                {allOpen ? "Collapse all findings" : "Expand all findings"}
              </button>
            ) : null}
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
        ) : (
          <>
            {/* The table needs about 64rem, and an expanded row inside it would
                force sideways scrolling on a phone. Below the lg breakpoint
                the findings always render as cards, whichever view is chosen. */}
            {view === "table" ? (
              <div className="hidden lg:block">
                {/* ---------- Table view ---------- */}
                <div
                  tabIndex={0}
                  role="region"
                  aria-label={`Accessibility findings for ${sampleAuditReport.product}`}
                  className="relative overflow-x-auto rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <table className="w-full min-w-[72rem] text-left text-sm">
                    <caption className="sr-only">
                      Accessibility findings for {sampleAuditReport.product}.
                      Each row can be expanded for an annotated screenshot,
                      reproduction steps, actual and expected results, and the
                      suggested resolution.
                    </caption>
                    <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/80">
                      <tr>
                        <th scope="col" className="px-4 py-3 font-semibold">
                          <span className="sr-only">Expand</span>
                        </th>
                        <th scope="col" className="px-4 py-3 font-semibold">
                          ID
                        </th>
                        <th scope="col" className="px-4 py-3 font-semibold">
                          Screenshot
                        </th>
                        <th scope="col" className="px-4 py-3 font-semibold">
                          Issue
                        </th>
                        <th scope="col" className="px-4 py-3 font-semibold">
                          Severity
                        </th>
                        <th scope="col" className="px-4 py-3 font-semibold">
                          Level
                        </th>
                        <th scope="col" className="px-4 py-3 font-semibold">
                          WCAG criteria
                        </th>
                        <th scope="col" className="px-4 py-3 font-semibold">
                          Location
                        </th>
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
                                    {isOpen ? "Hide" : "Show"} details for{" "}
                                    {f.id}, {f.title}
                                  </span>
                                </button>
                              </td>
                              <th
                                scope="row"
                                className="whitespace-nowrap px-4 py-3 font-mono text-xs font-semibold text-slate-900 dark:text-white"
                              >
                                {f.id}
                              </th>
                              <td className="px-4 py-3">
                                <EvidenceThumbnail finding={f} />
                              </td>
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
                                  colSpan={8}
                                  className="border-t border-slate-200 bg-slate-50/70 px-6 py-6 dark:border-slate-800 dark:bg-slate-900/50"
                                >
                                  <h3 className="sr-only">
                                    {f.id}: {f.title}
                                  </h3>
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
              </div>
            ) : null}
            {/* ---------- Card view ---------- */}
            <ul className={cn("grid gap-6", view === "table" && "lg:hidden")}>
              {visible.map((f) => (
                <li
                  key={f.id}
                  className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:p-6"
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
          </>
        )}
      </section>

      <p className="flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
        <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        <span>
          The Excel export contains every column shown here plus the full
          reproduction steps, actual and expected results, suggested resolution,
          and a link to the annotated screenshot for each finding, on a Findings
          sheet with a Summary sheet alongside it. It exports whatever your
          current filters show, so you can hand a developer just the Critical
          rows if that is all they need.
        </span>
      </p>
    </div>
  )
}
