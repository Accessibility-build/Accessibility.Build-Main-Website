"use client"

/**
 * Free PDF check for public documents. Runs in the browser; nothing is
 * uploaded. Built for the batch case local governments actually have: a folder
 * of agendas, minutes and forms, checked together, exported as a CSV.
 *
 * Accessibility notes: the file input is a real, visible control (the drop
 * zone is a pointer shortcut around it); progress and the final summary are
 * announced politely; each file's details sit behind a real button with
 * aria-expanded; outcomes are written as words, colour only reinforces them.
 */

import { useId, useRef, useState } from "react"
import { AlertTriangle, CheckCircle2, ChevronDown, Download, FileText, Lock, MinusCircle, Upload, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { CheckOutcome, PdfReport } from "@/lib/title-ii/pdf-checks"

const MAX_FILES = 25
const MAX_BYTES = 50 * 1024 * 1024

const OUTCOME: Record<CheckOutcome, { label: string; icon: typeof CheckCircle2; className: string }> = {
  pass: { label: "Pass", icon: CheckCircle2, className: "text-emerald-700 dark:text-emerald-400" },
  fail: { label: "Fail", icon: XCircle, className: "text-red-700 dark:text-red-400" },
  warn: { label: "Check", icon: AlertTriangle, className: "text-amber-700 dark:text-amber-400" },
  na: { label: "Not applicable", icon: MinusCircle, className: "text-slate-500 dark:text-slate-400" },
}

const VERDICT: Record<PdfReport["verdict"], { label: string; className: string }> = {
  fail: { label: "Fails basic checks", className: "border-red-300 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200" },
  warn: { label: "Needs a closer look", className: "border-amber-300 bg-amber-50 text-amber-950 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100" },
  pass: { label: "Passes basic checks", className: "border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200" },
  error: { label: "Couldn't be checked", className: "border-slate-300 bg-slate-100 text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200" },
}

/** Summary columns; each maps to a check id. */
const COLUMNS: { id: string; label: string }[] = [
  { id: "text", label: "Real text" },
  { id: "tags", label: "Tagged" },
  { id: "title", label: "Title" },
  { id: "lang", label: "Language" },
  { id: "alt", label: "Alt text" },
]

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function OutcomeMark({ outcome, compact = false }: { outcome?: CheckOutcome; compact?: boolean }) {
  if (!outcome) return <span className="text-slate-400 dark:text-slate-500">n/a</span>
  const meta = OUTCOME[outcome]
  const Icon = meta.icon
  return (
    <span className={cn("inline-flex items-center gap-1 font-medium", meta.className)}>
      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span className={compact ? "text-xs" : "text-sm"}>{compact && outcome === "na" ? "n/a" : meta.label}</span>
    </span>
  )
}

function csvCell(value: string | number) {
  const s = String(value)
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

export function TitleIIPdfCheck() {
  const uid = useId().replace(/:/g, "")
  const inputRef = useRef<HTMLInputElement>(null)
  const [reports, setReports] = useState<PdfReport[]>([])
  const [running, setRunning] = useState<{ done: number; total: number; name: string } | null>(null)
  const [skipped, setSkipped] = useState<string[]>([])
  const [open, setOpen] = useState<string[]>([])
  const [dragging, setDragging] = useState(false)
  const [announce, setAnnounce] = useState("")

  async function run(list: FileList | File[]) {
    const all = Array.from(list)
    const tooMany = all.length > MAX_FILES
    const pdfs = all.slice(0, MAX_FILES)
    const accepted: File[] = []
    const rejected: string[] = []
    for (const f of pdfs) {
      const isPdf = f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf")
      if (!isPdf) rejected.push(`${f.name} (not a PDF)`)
      else if (f.size > MAX_BYTES) rejected.push(`${f.name} (over 50 MB)`)
      else accepted.push(f)
    }
    if (tooMany) rejected.push(`${all.length - MAX_FILES} more files (up to ${MAX_FILES} at a time)`)
    setSkipped(rejected)
    if (accepted.length === 0) {
      setAnnounce(rejected.length ? "No PDFs to check." : "")
      return
    }

    const { checkPdf } = await import("@/lib/title-ii/pdf-checks")
    const out: PdfReport[] = []
    setReports([])
    setOpen([])
    for (let i = 0; i < accepted.length; i++) {
      const file = accepted[i]
      setRunning({ done: i, total: accepted.length, name: file.name })
      setAnnounce(`Checking ${i + 1} of ${accepted.length}: ${file.name}`)
      try {
        out.push(await checkPdf(file))
      } catch {
        out.push({ fileName: file.name, fileSize: file.size, pages: 0, pagesScanned: 0, checks: [], verdict: "error", error: "Something went wrong reading this file." })
      }
      setReports([...out])
    }
    setRunning(null)
    const failing = out.filter((r) => r.verdict === "fail").length
    setAnnounce(
      `Done. ${out.length} ${out.length === 1 ? "file" : "files"} checked, ${failing} ${failing === 1 ? "fails" : "fail"} basic checks.`,
    )
    if (out.length === 1) setOpen([`${out[0].fileName}-0`])
  }

  function exportCsv() {
    const header = ["File", "Pages", "Result", "Check", "Outcome", "What we found", "How to fix", "WCAG"]
    const rows = reports.flatMap((r) =>
      r.error
        ? [[r.fileName, r.pages, VERDICT[r.verdict].label, "", "", r.error, "", ""]]
        : r.checks.map((c) => [r.fileName, r.pages, VERDICT[r.verdict].label, c.label, OUTCOME[c.outcome].label, c.detail, c.fix ?? "", c.wcag.join(" ")]),
    )
    const csv = [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n")
    const blob = new Blob(["﻿", csv], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "pdf-accessibility-check.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  const toggle = (key: string) => setOpen((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]))
  const counts = {
    fail: reports.filter((r) => r.verdict === "fail").length,
    warn: reports.filter((r) => r.verdict === "warn").length,
    pass: reports.filter((r) => r.verdict === "pass").length,
    error: reports.filter((r) => r.verdict === "error").length,
  }

  return (
    <div className="min-w-0 space-y-6">
      {/* ---------- Picker ---------- */}
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          if (!running && e.dataTransfer.files.length) void run(e.dataTransfer.files)
        }}
        className={cn(
          "rounded-2xl border-2 border-dashed p-6 text-center transition-colors sm:p-10",
          dragging
            ? "border-blue-600 bg-blue-50 dark:border-blue-400 dark:bg-blue-950/40"
            : "border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900",
        )}
      >
        <FileText className="mx-auto h-10 w-10 text-slate-400 dark:text-slate-500" aria-hidden="true" />
        <p className="mt-3 text-base font-semibold text-slate-900 dark:text-white">Check up to {MAX_FILES} PDFs at once</p>
        <p className="mx-auto mt-1 max-w-lg text-sm text-slate-600 dark:text-slate-400">
          Drop files here or choose them. Agendas, minutes, forms and notices are typical. Up to 50 MB each.
        </p>
        <input
          ref={inputRef}
          id={`${uid}-files`}
          type="file"
          accept="application/pdf,.pdf"
          multiple
          className="sr-only"
          disabled={Boolean(running)}
          onChange={(e) => {
            if (e.target.files?.length) void run(e.target.files)
            e.target.value = ""
          }}
        />
        <label
          htmlFor={`${uid}-files`}
          className={cn(
            "mt-5 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-500",
            "[input:focus-visible+&]:outline-none [input:focus-visible+&]:ring-2 [input:focus-visible+&]:ring-blue-600 [input:focus-visible+&]:ring-offset-2 dark:[input:focus-visible+&]:ring-offset-slate-900",
            running && "cursor-not-allowed opacity-60",
          )}
        >
          <Upload className="h-4 w-4" aria-hidden="true" />
          Choose PDF files
        </label>
        <p className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400">
          <Lock className="h-3.5 w-3.5" aria-hidden="true" />
          Checked in your browser. Your files are never uploaded.
        </p>
      </div>

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {announce}
      </p>

      {running ? (
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm font-medium text-slate-900 dark:text-white">
            Checking {running.done + 1} of {running.total}: <span className="break-all font-normal">{running.name}</span>
          </p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800" aria-hidden="true">
            <div className="h-full rounded-full bg-blue-600 transition-[width] motion-reduce:transition-none" style={{ width: `${(running.done / running.total) * 100}%` }} />
          </div>
        </div>
      ) : null}

      {skipped.length > 0 ? (
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-100">
          <p className="font-semibold">Skipped</p>
          <ul className="mt-1 list-disc pl-5">
            {skipped.map((s) => (
              <li key={s} className="break-all">
                {s}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {/* ---------- Results ---------- */}
      {reports.length > 0 ? (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              {reports.length} {reports.length === 1 ? "file" : "files"} checked
              <span className="sr-only">: </span>
              <span className="ml-2 text-sm font-normal text-slate-600 dark:text-slate-400">
                {counts.fail} failing, {counts.warn} to look at, {counts.pass} passing
                {counts.error ? `, ${counts.error} unreadable` : ""}
              </span>
            </h3>
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={exportCsv} disabled={Boolean(running)} className="gap-1.5">
                <Download className="h-4 w-4" aria-hidden="true" />
                Download CSV
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => inputRef.current?.click()} disabled={Boolean(running)}>
                Check more files
              </Button>
            </div>
          </div>

          <div
            tabIndex={0}
            role="region"
            aria-label="PDF check results"
            className="relative overflow-x-auto rounded-xl border border-slate-200 bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:border-slate-800 dark:bg-slate-900"
          >
            <table className="w-full min-w-[52rem] text-left text-sm">
              <caption className="sr-only">
                PDF check results. Each row can be expanded to show every check, what was found and how to fix it.
              </caption>
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-600 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-400">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    File
                  </th>
                  <th scope="col" className="px-4 py-3 font-semibold">
                    Result
                  </th>
                  {COLUMNS.map((c) => (
                    <th key={c.id} scope="col" className="px-3 py-3 font-semibold">
                      {c.label}
                    </th>
                  ))}
                  <th scope="col" className="px-4 py-3 font-semibold">
                    <span className="sr-only">Details</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {reports.map((r, i) => {
                  const key = `${r.fileName}-${i}`
                  const isOpen = open.includes(key)
                  const panelId = `${uid}-pdf-${i}`
                  const byId = new Map(r.checks.map((c) => [c.id, c.outcome]))
                  return (
                    <FragmentRow key={key}>
                      <tr className="align-top">
                        <th scope="row" className="max-w-[16rem] px-4 py-3 font-medium text-slate-900 dark:text-white">
                          <span className="block break-all">{r.fileName}</span>
                          <span className="text-xs font-normal text-slate-600 dark:text-slate-400">
                            {r.pages ? `${r.pages} ${r.pages === 1 ? "page" : "pages"}, ` : ""}
                            {formatSize(r.fileSize)}
                          </span>
                        </th>
                        <td className="px-4 py-3">
                          <span className={cn("inline-block whitespace-nowrap rounded-md border px-2 py-0.5 text-xs font-semibold", VERDICT[r.verdict].className)}>
                            {VERDICT[r.verdict].label}
                          </span>
                        </td>
                        {COLUMNS.map((c) => (
                          <td key={c.id} className="px-3 py-3">
                            {r.error ? <span className="text-slate-400 dark:text-slate-500">n/a</span> : <OutcomeMark outcome={byId.get(c.id) ?? (c.id === "alt" ? byId.get("structure") : undefined)} compact />}
                          </td>
                        ))}
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => toggle(key)}
                            aria-expanded={isOpen}
                            aria-controls={panelId}
                            className="inline-flex items-center gap-1 whitespace-nowrap rounded-md px-2 py-1 text-sm font-medium text-blue-700 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-300 dark:hover:bg-slate-800"
                          >
                            {isOpen ? "Hide" : "Details"}
                            <span className="sr-only"> for {r.fileName}</span>
                            <ChevronDown className={cn("h-4 w-4 transition-transform motion-reduce:transition-none", isOpen && "rotate-180")} aria-hidden="true" />
                          </button>
                        </td>
                      </tr>
                      {isOpen ? (
                        <tr id={panelId}>
                          <td colSpan={COLUMNS.length + 3} className="bg-slate-50/70 px-4 py-5 sm:px-6 dark:bg-slate-950/40">
                            {r.error ? (
                              <p className="text-sm text-slate-700 dark:text-slate-300">{r.error}</p>
                            ) : (
                              <>
                                <ul className="space-y-3">
                                  {r.checks.map((c) => (
                                    <li key={c.id} className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                                        <p className="font-semibold text-slate-900 dark:text-white">{c.label}</p>
                                        <OutcomeMark outcome={c.outcome} />
                                      </div>
                                      <p className="mt-1 text-sm leading-relaxed text-slate-700 dark:text-slate-300">{c.detail}</p>
                                      {c.fix ? (
                                        <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                                          <span className="font-semibold text-slate-900 dark:text-white">How to fix: </span>
                                          {c.fix}
                                        </p>
                                      ) : null}
                                      <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">WCAG 2.1: {c.wcag.join(", ")}</p>
                                    </li>
                                  ))}
                                </ul>
                                {r.pagesScanned < r.pages ? (
                                  <p className="mt-3 text-xs text-slate-600 dark:text-slate-400">
                                    Text, structure and form fields were checked on the first {r.pagesScanned} of {r.pages} pages.
                                  </p>
                                ) : null}
                              </>
                            )}
                          </td>
                        </tr>
                      ) : null}
                    </FragmentRow>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function FragmentRow({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
