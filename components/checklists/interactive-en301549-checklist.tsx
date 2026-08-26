"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import * as XLSX from "xlsx"
import checklistData from "@/lib/data/en-301-549-checklist.json"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  CheckCircle2,
  ChevronDown,
  FileSpreadsheet,
  Info,
  RotateCcw,
  Search,
  StickyNote,
} from "lucide-react"

/**
 * Interactive EN 301 549 v3.2.1 checklist.
 *
 * Rows come from lib/data/en-301-549-checklist.json, generated from the
 * published ETSI standard and verified clause by clause. Only rows of kind
 * "requirement" are checkable; functional performance statements (clause 4),
 * void slots, and not-applicable clauses render as information rows so the
 * clause numbering the standard uses stays visible and explainable.
 */

interface Row {
  clause: string
  title: string
  chapter: string
  kind: "requirement" | "statement" | "void" | "na"
  appliesTo: string
  wcag: string | null
  wcagLevel: string | null
  wcagPage: string | null
  advisory: boolean
  summary: string
}

interface RowState {
  done: boolean
  note: string
}

const ROWS = checklistData.rows as Row[]
const CHAPTERS = checklistData.chapters as Record<string, string>
const STORAGE_KEY = "en301549-checklist-state"

const PRESETS: { id: string; label: string; chapters: string[] }[] = [
  { id: "all", label: "Everything", chapters: [] },
  { id: "web", label: "Websites & web apps", chapters: ["9", "12"] },
  { id: "docs", label: "Documents", chapters: ["10", "12"] },
  { id: "software", label: "Software & mobile apps", chapters: ["11", "12"] },
  { id: "hardware", label: "Hardware & terminals", chapters: ["4", "5", "6", "7", "8", "12"] },
]

const KIND_LABEL: Record<Row["kind"], string> = {
  requirement: "Requirement",
  statement: "Statement",
  void: "Void",
  na: "Not applicable",
}

export default function InteractiveEN301549Checklist() {
  const [state, setState] = useState<Record<string, RowState>>({})
  const [loaded, setLoaded] = useState(false)
  const [preset, setPreset] = useState("all")
  const [chapter, setChapter] = useState<string>("all")
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState<"all" | "remaining" | "done">("all")
  const [showInfoRows, setShowInfoRows] = useState(true)
  const [openNotes, setOpenNotes] = useState<Record<string, boolean>>({})
  const liveRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setState(JSON.parse(saved))
    } catch {
      // Private windows or blocked storage: run without persistence.
    }
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (!loaded) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // Ignore storage failures; the in-memory checklist still works.
    }
  }, [state, loaded])

  const activeChapters = useMemo(() => {
    const p = PRESETS.find((x) => x.id === preset)
    if (chapter !== "all") return [chapter]
    if (p && p.chapters.length > 0) return p.chapters
    return Object.keys(CHAPTERS)
  }, [preset, chapter])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return ROWS.filter((r) => {
      if (!activeChapters.includes(r.chapter)) return false
      if (!showInfoRows && r.kind !== "requirement") return false
      if (q) {
        const hay = `${r.clause} ${r.title} ${r.summary} ${r.appliesTo} ${r.wcag ?? ""}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      if (status !== "all" && r.kind === "requirement") {
        const done = state[r.clause]?.done ?? false
        if (status === "remaining" && done) return false
        if (status === "done" && !done) return false
      } else if (status !== "all" && r.kind !== "requirement") {
        return false
      }
      return true
    })
  }, [activeChapters, query, status, state, showInfoRows])

  const grouped = useMemo(() => {
    const g: Record<string, Row[]> = {}
    for (const r of filtered) (g[r.chapter] ||= []).push(r)
    return g
  }, [filtered])

  const progress = useMemo(() => {
    const inScope = ROWS.filter((r) => r.kind === "requirement" && activeChapters.includes(r.chapter))
    const done = inScope.filter((r) => state[r.clause]?.done).length
    return {
      total: inScope.length,
      done,
      pct: inScope.length ? Math.round((done / inScope.length) * 100) : 0,
    }
  }, [state, activeChapters])

  const toggle = (clause: string) => {
    setState((prev) => {
      const next = {
        ...prev,
        [clause]: { done: !(prev[clause]?.done ?? false), note: prev[clause]?.note ?? "" },
      }
      return next
    })
  }

  const setNote = (clause: string, note: string) => {
    setState((prev) => ({
      ...prev,
      [clause]: { done: prev[clause]?.done ?? false, note },
    }))
  }

  const resetAll = () => {
    if (!window.confirm("Clear every checkmark and note in this checklist?")) return
    setState({})
  }

  const exportExcel = () => {
    const header = [
      "Clause",
      "Title",
      "Chapter",
      "Type",
      "Applies to",
      "WCAG 2.1 criterion",
      "Level",
      "Advisory",
      "Status",
      "Notes",
      "Summary",
    ]
    const rows = ROWS.filter((r) => activeChapters.includes(r.chapter)).map((r) => [
      r.clause,
      r.title,
      `${r.chapter} ${CHAPTERS[r.chapter]}`,
      KIND_LABEL[r.kind],
      r.appliesTo,
      r.wcag ?? "",
      r.wcagLevel ?? "",
      r.advisory ? "Advisory (should)" : "",
      r.kind === "requirement" ? (state[r.clause]?.done ? "Done" : "Open") : "",
      state[r.clause]?.note ?? "",
      r.summary,
    ])
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.aoa_to_sheet([header, ...rows])
    ws["!cols"] = [
      { wch: 12 },
      { wch: 42 },
      { wch: 30 },
      { wch: 14 },
      { wch: 30 },
      { wch: 10 },
      { wch: 6 },
      { wch: 16 },
      { wch: 8 },
      { wch: 30 },
      { wch: 90 },
    ]
    const range = XLSX.utils.decode_range(ws["!ref"] || "A1")
    ws["!autofilter"] = { ref: XLSX.utils.encode_range(range) }
    XLSX.utils.book_append_sheet(wb, ws, "EN 301 549 v3.2.1")

    const summary = [
      ["EN 301 549 v3.2.1 checklist export"],
      [""],
      ["Exported", new Date().toLocaleDateString()],
      ["Scope", PRESETS.find((p) => p.id === preset)?.label ?? "Everything"],
      ["Requirements in scope", String(progress.total)],
      ["Marked done", String(progress.done)],
      ["Progress", `${progress.pct}%`],
      [""],
      ["Clause numbers and titles follow ETSI EN 301 549 V3.2.1 (2021-03)."],
      ["Summaries are plain-language explanations from accessibility.build,"],
      ["not the normative text. Always verify against the published standard."],
    ]
    const ws2 = XLSX.utils.aoa_to_sheet(summary)
    ws2["!cols"] = [{ wch: 26 }, { wch: 60 }]
    XLSX.utils.book_append_sheet(wb, ws2, "Summary")
    XLSX.writeFile(wb, "en-301-549-checklist.xlsx")
  }

  return (
    <div>
      {/* Controls */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900 sm:p-5">
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Filter the checklist by product type"
        >
          {PRESETS.map((p) => (
            <Button
              key={p.id}
              size="sm"
              variant={preset === p.id ? "default" : "outline"}
              aria-pressed={preset === p.id}
              onClick={() => {
                setPreset(p.id)
                setChapter("all")
              }}
            >
              {p.label}
            </Button>
          ))}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative sm:col-span-2">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <label htmlFor="en-checklist-search" className="sr-only">
              Search clauses
            </label>
            <Input
              id="en-checklist-search"
              type="search"
              placeholder="Search clause, title, or WCAG number"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div>
            <label htmlFor="en-checklist-chapter" className="sr-only">
              Filter by chapter
            </label>
            <select
              id="en-checklist-chapter"
              value={chapter}
              onChange={(e) => setChapter(e.target.value)}
              className="h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 text-sm dark:border-slate-700 dark:bg-slate-900"
            >
              <option value="all">All chapters in scope</option>
              {Object.entries(CHAPTERS).map(([num, label]) => (
                <option key={num} value={num}>
                  {num}. {label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="en-checklist-status" className="sr-only">
              Filter by status
            </label>
            <select
              id="en-checklist-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as typeof status)}
              className="h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 text-sm dark:border-slate-700 dark:bg-slate-900"
            >
              <option value="all">All rows</option>
              <option value="remaining">Open requirements</option>
              <option value="done">Done requirements</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <input
              type="checkbox"
              checked={showInfoRows}
              onChange={(e) => setShowInfoRows(e.target.checked)}
              className="h-4 w-4"
            />
            Show statements, void, and not-applicable rows
          </label>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={exportExcel}>
              <FileSpreadsheet className="mr-1.5 h-4 w-4" aria-hidden="true" />
              Export Excel
            </Button>
            <Button size="sm" variant="outline" onClick={resetAll}>
              <RotateCcw className="mr-1.5 h-4 w-4" aria-hidden="true" />
              Reset
            </Button>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-5">
          <p ref={liveRef} className="text-sm font-medium text-slate-700 dark:text-slate-200" role="status">
            {progress.done} of {progress.total} requirements marked done ({progress.pct}%)
            {preset !== "all" && ` in the ${PRESETS.find((p) => p.id === preset)?.label} scope`}
          </p>
          <div
            className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
            role="progressbar"
            aria-valuenow={progress.pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Checklist progress"
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-600 to-teal-500 transition-all"
              style={{ width: `${progress.pct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Rows grouped by chapter */}
      {Object.keys(grouped).length === 0 && (
        <p className="mt-8 text-center text-slate-500 dark:text-slate-400">
          No clauses match the current filters.
        </p>
      )}

      {Object.entries(grouped)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([ch, rows]) => (
          <section key={ch} aria-labelledby={`en-ch-${ch}`} className="mt-10">
            <h2
              id={`en-ch-${ch}`}
              className="mb-1 text-xl font-bold text-slate-900 dark:text-white"
            >
              {ch}. {CHAPTERS[ch]}
            </h2>
            <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
              {rows.filter((r) => r.kind === "requirement").length} requirement
              {rows.filter((r) => r.kind === "requirement").length === 1 ? "" : "s"} shown
            </p>
            <ul className="space-y-3">
              {rows.map((r) => {
                const rs = state[r.clause]
                const checkable = r.kind === "requirement"
                const done = rs?.done ?? false
                const notesOpen = openNotes[r.clause] ?? Boolean(rs?.note)
                return (
                  <li
                    key={r.clause}
                    className={`rounded-lg border p-4 transition-colors ${
                      checkable
                        ? done
                          ? "border-emerald-200 bg-emerald-50/60 dark:border-emerald-800/60 dark:bg-emerald-950/20"
                          : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"
                        : "border-dashed border-slate-200 bg-slate-50 dark:border-slate-700/70 dark:bg-slate-900/40"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {checkable ? (
                        <input
                          type="checkbox"
                          id={`en-check-${r.clause}`}
                          checked={done}
                          onChange={() => toggle(r.clause)}
                          className="mt-1 h-4 w-4 shrink-0"
                        />
                      ) : (
                        <Info
                          className="mt-1 h-4 w-4 shrink-0 text-slate-400"
                          aria-hidden="true"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          {checkable ? (
                            <label
                              htmlFor={`en-check-${r.clause}`}
                              className="cursor-pointer font-semibold text-slate-900 dark:text-white"
                            >
                              <span className="font-mono text-sm text-blue-700 dark:text-blue-300">
                                {r.clause}
                              </span>{" "}
                              {r.title}
                            </label>
                          ) : (
                            <p className="font-semibold text-slate-700 dark:text-slate-300">
                              <span className="font-mono text-sm text-slate-500 dark:text-slate-400">
                                {r.clause}
                              </span>{" "}
                              {r.title}
                            </p>
                          )}
                          {r.kind !== "requirement" && (
                            <Badge variant="outline" className="text-xs">
                              {KIND_LABEL[r.kind]}
                            </Badge>
                          )}
                          {r.advisory && (
                            <Badge
                              variant="outline"
                              className="border-amber-300 text-xs text-amber-700 dark:border-amber-700 dark:text-amber-300"
                            >
                              Advisory
                            </Badge>
                          )}
                          {r.wcag && (
                            <Badge variant="outline" className="text-xs">
                              {r.wcagPage ? (
                                <Link href={r.wcagPage} className="hover:underline">
                                  WCAG {r.wcag} ({r.wcagLevel})
                                </Link>
                              ) : (
                                <>WCAG {r.wcag} ({r.wcagLevel})</>
                              )}
                            </Badge>
                          )}
                        </div>
                        <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                          {r.summary}
                        </p>
                        <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-500">
                          Applies to: {r.appliesTo}
                        </p>
                        {checkable && (
                          <div className="mt-2">
                            <button
                              type="button"
                              onClick={() =>
                                setOpenNotes((prev) => ({ ...prev, [r.clause]: !notesOpen }))
                              }
                              aria-expanded={notesOpen}
                              className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                            >
                              <StickyNote className="h-3.5 w-3.5" aria-hidden="true" />
                              {rs?.note ? "Edit note" : "Add note"}
                              <ChevronDown
                                className={`h-3.5 w-3.5 transition-transform ${notesOpen ? "rotate-180" : ""}`}
                                aria-hidden="true"
                              />
                            </button>
                            {notesOpen && (
                              <div className="mt-2">
                                <label htmlFor={`en-note-${r.clause}`} className="sr-only">
                                  Notes for clause {r.clause}
                                </label>
                                <textarea
                                  id={`en-note-${r.clause}`}
                                  value={rs?.note ?? ""}
                                  onChange={(e) => setNote(r.clause, e.target.value)}
                                  rows={2}
                                  placeholder="Findings, evidence, owner..."
                                  className="w-full rounded-md border border-slate-200 bg-white p-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      {checkable && done && (
                        <CheckCircle2
                          className="mt-1 h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400"
                          aria-hidden="true"
                        />
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          </section>
        ))}
    </div>
  )
}
