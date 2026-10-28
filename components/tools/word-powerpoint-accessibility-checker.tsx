"use client"

import { useCallback, useEffect, useId, useRef, useState, type DragEvent } from "react"
import Link from "next/link"
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  FileUp,
  Lightbulb,
  Loader2,
  MinusCircle,
  ShieldCheck,
  XCircle,
} from "lucide-react"
import { analyseOfficeFile, OfficeFileError, refuseByNameAndSize, type CheckResult, type CheckStatus, type OfficeReport, type Severity } from "@/lib/office-a11y"
import { EXPORT_HEADER, STATUS_LABEL, exportBaseName, exportRows, toCsv } from "@/lib/office-a11y/export"
import { CRITERIA, criterionLabel, wcagPath } from "@/lib/office-a11y/types"
import { plural } from "@/lib/office-a11y/xml"
import { cn } from "@/lib/utils"

// Word and PowerPoint accessibility checker.
//
// The file is read with File.arrayBuffer(), unzipped with fflate and parsed
// with the browser's DOMParser, all on this device: nothing is uploaded and
// no request is made with its contents. The checks live in lib/office-a11y
// so they can be tested in Node; this component handles choosing the file,
// showing the report and the CSV and Excel downloads.
//
// The tool container carries ph-no-capture so that, for visitors who allowed
// analytics, PostHog autocapture records nothing from the file or the report.

const ACCEPT = ".docx,.pptx,.docm,.pptm,.dotx,.potx,.ppsx,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.presentationml.presentation"
const FINDINGS_SHOWN = 8

const parseXml = (xml: string) => new DOMParser().parseFromString(xml, "application/xml")

type Phase = "idle" | "working" | "done" | "error"

const SEVERITY: Record<Severity, { label: string; icon: typeof XCircle; className: string }> = {
  error: {
    label: "Error",
    icon: XCircle,
    className: "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200",
  },
  warning: {
    label: "Warning",
    icon: AlertTriangle,
    className: "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200",
  },
  tip: {
    label: "Tip",
    icon: Lightbulb,
    className: "border-sky-200 bg-sky-50 text-sky-900 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-200",
  },
}

const STATUS: Record<CheckStatus, { icon: typeof XCircle; className: string }> = {
  fail: { icon: XCircle, className: "text-rose-800 dark:text-rose-300" },
  review: { icon: Lightbulb, className: "text-sky-800 dark:text-sky-300" },
  pass: { icon: CheckCircle2, className: "text-emerald-800 dark:text-emerald-300" },
  "not-applicable": { icon: MinusCircle, className: "text-slate-600 dark:text-slate-400" },
}

const STATUS_ORDER: CheckStatus[] = ["fail", "review", "pass", "not-applicable"]

const linkClass = "font-medium text-teal-700 underline underline-offset-2 hover:text-teal-900 dark:text-teal-300 dark:hover:text-teal-200"
const secondaryButton =
  "inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:focus-visible:ring-offset-slate-950"

function download(name: string, blob: Blob) {
  const href = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = href
  a.download = name
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(href), 1000)
}

function SeverityBadge({ severity }: { severity: Severity }) {
  const s = SEVERITY[severity]
  const Icon = s.icon
  return (
    <span className={cn("inline-flex shrink-0 items-center gap-1 rounded border px-1.5 py-0.5 text-xs font-semibold", s.className)}>
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {s.label}
    </span>
  )
}

function CheckItem({ check, app }: { check: CheckResult; app: "Word" | "PowerPoint" }) {
  const [showAll, setShowAll] = useState(false)
  const listId = useId()
  const status = STATUS[check.status]
  const StatusIcon = status.icon
  const visible = showAll ? check.findings : check.findings.slice(0, FINDINGS_SHOWN)
  const criterion = CRITERIA[check.criterion]

  return (
    <li className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">{check.title}</h3>
        <p className={cn("inline-flex items-center gap-1.5 text-sm font-semibold", status.className)}>
          <StatusIcon className="h-4 w-4" aria-hidden="true" />
          {STATUS_LABEL[check.status]}
          {check.findings.length > 0 && <span className="font-normal">({check.findings.length})</span>}
        </p>
      </div>
      <p className="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-300">{check.summary}</p>
      <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-400">
        WCAG{" "}
        <Link href={wcagPath(check.criterion)} className={linkClass}>
          {check.criterion} {criterion?.name}
        </Link>{" "}
        (Level {criterion?.level})
      </p>

      {check.findings.length > 0 && (
        <>
          <ul id={listId} className="mt-4 space-y-3" aria-label={`${check.title}: findings`}>
            {visible.map((f, i) => (
              <li key={i} className="flex flex-col gap-1.5 border-l-2 border-slate-200 pl-3 dark:border-slate-700 sm:flex-row sm:items-start sm:gap-3">
                <SeverityBadge severity={f.severity} />
                <div className="min-w-0 text-sm leading-6">
                  <p className="text-slate-800 [overflow-wrap:anywhere] dark:text-slate-200">{f.message}</p>
                  <p className="text-slate-600 [overflow-wrap:anywhere] dark:text-slate-400">
                    <span className="font-medium text-slate-700 dark:text-slate-300">Where: </span>
                    {f.location}
                    {f.criterion && f.criterion !== check.criterion && (
                      <>
                        {" "}
                        (WCAG{" "}
                        <Link href={wcagPath(f.criterion)} className={linkClass}>
                          {criterionLabel(f.criterion)}
                        </Link>
                        )
                      </>
                    )}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          {check.findings.length > FINDINGS_SHOWN && (
            <button type="button" aria-expanded={showAll} aria-controls={listId} onClick={() => setShowAll((v) => !v)} className={cn(secondaryButton, "mt-3 px-2.5 py-1 text-xs")}>
              {showAll ? "Show fewer" : `Show all ${check.findings.length}`}
            </button>
          )}
          <div className="mt-4 rounded-md bg-slate-50 p-3 text-sm leading-6 text-slate-700 dark:bg-slate-800/60 dark:text-slate-300">
            <p>
              <span className="font-semibold text-slate-900 dark:text-white">How to fix it in {app}: </span>
              {check.fix}
            </p>
          </div>
        </>
      )}
    </li>
  )
}

export default function WordPowerPointAccessibilityChecker() {
  const [phase, setPhase] = useState<Phase>("idle")
  const [message, setMessage] = useState("")
  const [report, setReport] = useState<OfficeReport | null>(null)
  const [dragging, setDragging] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [exportError, setExportError] = useState("")
  const inputId = useId()
  const helpId = useId()
  const statusId = useId()
  const resultsRef = useRef<HTMLHeadingElement>(null)
  // Controls stay enabled while a file is checked (disabling the focused one
  // would drop keyboard focus); a second request is ignored instead.
  const busy = useRef(false)

  const run = useCallback(async (name: string, size: number, read: () => Promise<Uint8Array>) => {
    if (busy.current) return
    const refusal = refuseByNameAndSize(name, size)
    if (refusal) {
      setReport(null)
      setPhase("error")
      setMessage(refusal)
      return
    }
    busy.current = true
    setExportError("")
    setPhase("working")
    setMessage(`Checking ${name}...`)
    // Let the status render before the parsing blocks the main thread.
    await new Promise((resolve) => setTimeout(resolve, 30))
    try {
      const bytes = await read()
      const result = analyseOfficeFile(bytes, name, parseXml)
      setReport(result)
      setPhase("done")
      const failed = result.checks.filter((c) => c.status === "fail").length
      setMessage(
        `Checked ${name}: ${plural(result.counts.error, "error")}, ${plural(result.counts.warning, "warning")} and ${plural(result.counts.tip, "tip")}. ${failed} of ${result.checks.length} checks need attention.`,
      )
    } catch (err) {
      setReport(null)
      setPhase("error")
      setMessage(
        err instanceof OfficeFileError
          ? err.message
          : "This file could not be checked. It may be damaged, or use something this checker does not understand. Try opening it and saving it again in Word or PowerPoint.",
      )
    } finally {
      busy.current = false
    }
  }, [])

  const checkFile = useCallback((file: File) => run(file.name, file.size, async () => new Uint8Array(await file.arrayBuffer())), [run])

  const trySample = useCallback(
    async (kind: "docx" | "pptx") => {
      const samples = await import("@/lib/office-a11y/samples")
      const bytes = kind === "docx" ? samples.sampleWordDocument() : samples.samplePresentation()
      await run(kind === "docx" ? "sample-newsletter.docx" : "sample-open-day.pptx", bytes.byteLength, async () => bytes)
    },
    [run],
  )

  useEffect(() => {
    if (phase === "done" && report) resultsRef.current?.focus()
  }, [phase, report])

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) void checkFile(file)
  }

  const onDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.type === "dragenter" || e.type === "dragover") setDragging(true)
    else if (e.type === "dragleave" && !e.currentTarget.contains(e.relatedTarget as Node | null)) setDragging(false)
  }

  const exportCsv = () => {
    if (!report) return
    download(`${exportBaseName(report.fileName)}.csv`, new Blob([toCsv(report)], { type: "text/csv;charset=utf-8" }))
  }

  const exportExcel = async () => {
    if (!report) return
    setExporting(true)
    setExportError("")
    try {
      const XLSX = await import("xlsx")
      const wb = XLSX.utils.book_new()
      const ws = XLSX.utils.aoa_to_sheet([EXPORT_HEADER, ...exportRows(report)])
      ws["!cols"] = [{ wch: 34 }, { wch: 16 }, { wch: 10 }, { wch: 10 }, { wch: 30 }, { wch: 7 }, { wch: 60 }, { wch: 90 }, { wch: 90 }, { wch: 40 }]
      const range = XLSX.utils.decode_range(ws["!ref"] || "A1")
      ws["!autofilter"] = { ref: XLSX.utils.encode_range(range) }
      XLSX.utils.book_append_sheet(wb, ws, "Findings")
      const summary = [
        [`${report.kind === "docx" ? "Word" : "PowerPoint"} accessibility check`],
        [""],
        ["File", report.fileName],
        ["Checked", new Date().toLocaleDateString("en-GB")],
        ["Errors", String(report.counts.error)],
        ["Warnings", String(report.counts.warning)],
        ["Tips", String(report.counts.tip)],
        ...STATUS_ORDER.map((s) => [STATUS_LABEL[s], String(report.checks.filter((c) => c.status === s).length)]),
        [""],
        ...report.facts.map((f) => [f.label, f.value]),
        [""],
        ["Automated checks find common problems but cannot confirm that a document is accessible. Review the results, run Review > Check Accessibility in Office, and test with a screen reader."],
        [""],
        ["Checked in the browser at https://accessibility.build/tools/word-powerpoint-accessibility-checker"],
      ]
      const ws2 = XLSX.utils.aoa_to_sheet(summary)
      ws2["!cols"] = [{ wch: 22 }, { wch: 70 }]
      XLSX.utils.book_append_sheet(wb, ws2, "Summary")
      XLSX.writeFile(wb, `${exportBaseName(report.fileName)}.xlsx`)
    } catch {
      setExportError("The Excel file could not be created. Check your connection and try again, or download the CSV instead.")
    } finally {
      setExporting(false)
    }
  }

  const app = report?.kind === "pptx" ? "PowerPoint" : "Word"
  const sorted = report ? [...report.checks].sort((a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status)) : []
  const passed = report ? report.checks.filter((c) => c.status === "pass").length : 0

  return (
    <div className="ph-no-capture space-y-8">
      <section aria-labelledby={`${inputId}-heading`} className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <h2 id={`${inputId}-heading`} className="text-lg font-semibold text-slate-900 dark:text-white">
          Check a document or presentation
        </h2>

        <div className="mt-4 flex items-start gap-3 rounded-lg border border-teal-200 bg-teal-50 p-4 text-sm leading-6 text-teal-950 dark:border-teal-900 dark:bg-teal-950/40 dark:text-teal-100">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <p>
            <strong className="font-semibold">Your file never leaves this device.</strong> It is opened and checked by your
            browser. Nothing is uploaded, stored or sent anywhere, so it is safe to check confidential documents.
          </p>
        </div>

        <div
          onDragEnter={onDrag}
          onDragOver={onDrag}
          onDragLeave={onDrag}
          onDrop={onDrop}
          className={cn(
            "mt-4 rounded-lg border-2 border-dashed px-4 py-8 text-center transition-colors motion-reduce:transition-none",
            dragging ? "border-teal-600 bg-teal-50 dark:border-teal-400 dark:bg-teal-950/30" : "border-slate-300 dark:border-slate-700",
          )}
        >
          <FileUp className="mx-auto h-8 w-8 text-slate-500 dark:text-slate-400" aria-hidden="true" />
          <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">Drop a .docx or .pptx file here, or</p>
          <input
            id={inputId}
            type="file"
            accept={ACCEPT}
            className="peer sr-only"
            aria-describedby={phase === "error" ? `${helpId} ${statusId}` : helpId}
            aria-invalid={phase === "error" || undefined}
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) void checkFile(file)
              // Clear the value so choosing the same file again still runs the check.
              e.target.value = ""
            }}
          />
          <label
            htmlFor={inputId}
            className={cn(
              "mt-3 inline-flex cursor-pointer items-center gap-2 rounded-md bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800",
              "peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-teal-600 peer-focus-visible:ring-offset-2 dark:peer-focus-visible:ring-offset-slate-900",
              phase === "working" && "cursor-wait opacity-70",
            )}
          >
            Choose a Word or PowerPoint file
          </label>
          <p id={helpId} className="mx-auto mt-3 max-w-prose text-xs leading-5 text-slate-600 dark:text-slate-400">
            Word documents (.docx) and PowerPoint presentations (.pptx), up to 50 MB. Older .doc and .ppt files and
            password-protected files cannot be read.
          </p>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-slate-600 dark:text-slate-400">No file to hand? Try an example:</span>
          <button type="button" onClick={() => void trySample("docx")} className={cn(secondaryButton, "px-2.5 py-1 text-xs")}>
            Sample Word newsletter
          </button>
          <button type="button" onClick={() => void trySample("pptx")} className={cn(secondaryButton, "px-2.5 py-1 text-xs")}>
            Sample PowerPoint deck
          </button>
        </div>

        <div
          id={statusId}
          role="status"
          aria-live="polite"
          className={cn(
            "mt-4 text-sm leading-6",
            phase === "error" && "flex items-start gap-2 rounded-md border border-rose-200 bg-rose-50 p-3 text-rose-900 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200",
            phase === "working" && "flex items-center gap-2 text-slate-700 dark:text-slate-300",
            phase === "done" && "sr-only",
          )}
        >
          {phase === "error" && <XCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />}
          {phase === "working" && <Loader2 className="h-4 w-4 shrink-0 motion-safe:animate-spin" aria-hidden="true" />}
          {message}
        </div>
      </section>

      {report && phase === "done" && (
        <section aria-labelledby={`${inputId}-results`}>
          <h2
            id={`${inputId}-results`}
            ref={resultsRef}
            tabIndex={-1}
            className="font-serif text-2xl font-semibold text-slate-900 [overflow-wrap:anywhere] focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 dark:text-white"
          >
            Results for {report.fileName}
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {report.kind === "docx" ? "Word document" : "PowerPoint presentation"} &middot;{" "}
            {report.facts.map((f) => `${f.label}: ${f.value}`).join(" \u00b7 ")}
          </p>

          <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {(
              [
                ["Errors", report.counts.error, SEVERITY.error],
                ["Warnings", report.counts.warning, SEVERITY.warning],
                ["Tips", report.counts.tip, SEVERITY.tip],
              ] as const
            ).map(([label, n, s]) => {
              const Icon = s.icon
              return (
                <div key={label} className={cn("rounded-lg border p-3", s.className)}>
                  <dt className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {label}
                  </dt>
                  <dd className="mt-1 text-2xl font-semibold">{n}</dd>
                </div>
              )
            })}
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">
              <dt className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                Checks passed
              </dt>
              <dd className="mt-1 text-2xl font-semibold">
                {passed} <span className="text-base font-normal">of {report.checks.length}</span>
              </dd>
            </div>
          </dl>

          <div className="mt-5 flex flex-wrap gap-2">
            <button type="button" onClick={exportCsv} className={secondaryButton}>
              <Download className="h-4 w-4" aria-hidden="true" />
              Download CSV
            </button>
            <button type="button" onClick={() => !exporting && void exportExcel()} aria-busy={exporting || undefined} className={secondaryButton}>
              <FileSpreadsheet className="h-4 w-4" aria-hidden="true" />
              {exporting ? "Preparing Excel file..." : "Download Excel"}
            </button>
          </div>
          <p role="status" aria-live="polite" className={cn("text-sm text-rose-800 dark:text-rose-300", exportError && "mt-2")}>
            {exportError}
          </p>

          <p className="mt-5 max-w-[68ch] text-sm leading-6 text-slate-700 dark:text-slate-300">
            Use this alongside {app}&apos;s own checker: select <strong className="font-semibold">Review &gt; Check Accessibility</strong>{" "}
            in {app}. Neither replaces reading the {report.kind === "docx" ? "document" : "slides"} with a screen reader.
            {report.kind === "docx" && " Page numbers come from the last time Word laid out the document, so they can be a page out."}
          </p>

          <ol className="mt-6 space-y-4" aria-label="Checks, failed first">
            {sorted.map((c) => (
              <CheckItem key={c.id} check={c} app={app} />
            ))}
          </ol>
        </section>
      )}
    </div>
  )
}
