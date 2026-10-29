"use client"

import { useMemo, useState, useSyncExternalStore } from "react"
import * as XLSX from "xlsx"
import checklistData from "@/lib/data/eaa-checklist.json"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  CheckCircle2,
  ChevronDown,
  FileSpreadsheet,
  RotateCcw,
  Search,
  StickyNote,
} from "lucide-react"

/**
 * Interactive European Accessibility Act readiness checklist.
 *
 * Rows come from lib/data/eaa-checklist.json, one per obligation in
 * Directive (EU) 2019/882, each cited to its article, annex, section and
 * point. Every row carries a four-state status (not started, in progress,
 * done, not applicable) and a free-text note. State lives in localStorage
 * through a small external store so server and client render the same
 * empty checklist first and hydrate without a mismatch.
 */

type Status = "open" | "progress" | "done" | "na"

interface Row {
  id: string
  section: string
  obligation: string
  source: string
  appliesTo: string
  evidence: string
  notes: string
}

interface Section {
  id: string
  title: string
  source: string
  summary: string
}

interface RowState {
  status: Status
  note: string
}

type ChecklistState = Record<string, RowState>

const ROWS = checklistData.rows as Row[]
const SECTIONS = checklistData.sections as Section[]
const SECTION_IDS = SECTIONS.map((s) => s.id)
const STORAGE_KEY = "eaa-checklist-state"

const STATUS_ORDER: Status[] = ["open", "progress", "done", "na"]
const STATUS_LABEL: Record<Status, string> = {
  open: "Not started",
  progress: "In progress",
  done: "Done",
  na: "Not applicable",
}

// Sections every service provider works through regardless of sector.
const COMMON_SERVICE_SECTIONS = [
  "scope",
  "general-services",
  "service-provider",
  "burden",
  "transition",
  "enforcement",
  "standards",
]

const PRESETS: { id: string; label: string; sections: string[] }[] = [
  { id: "all", label: "Everything", sections: [] },
  { id: "web", label: "Websites, apps and e-commerce", sections: [...COMMON_SERVICE_SECTIONS, "ecommerce"] },
  { id: "banking", label: "Consumer banking", sections: [...COMMON_SERVICE_SECTIONS, "banking"] },
  { id: "ebooks", label: "E-books", sections: [...COMMON_SERVICE_SECTIONS, "ebooks"] },
  { id: "transport", label: "Passenger transport", sections: [...COMMON_SERVICE_SECTIONS, "transport"] },
  { id: "telecoms", label: "Telecoms", sections: [...COMMON_SERVICE_SECTIONS, "telecoms"] },
  { id: "av", label: "Audiovisual media access", sections: [...COMMON_SERVICE_SECTIONS, "av-media"] },
  {
    id: "products",
    label: "Products and terminals",
    sections: ["scope", "products", "burden", "transition", "enforcement", "standards"],
  },
]

type StatusFilter = "all" | "remaining" | Status

/* ------------------------------------------------------------------ */
/* localStorage-backed external store                                  */
/* ------------------------------------------------------------------ */

const EMPTY_STATE: ChecklistState = {}
let cachedState: ChecklistState | null = null
const listeners = new Set<() => void>()

function isStatus(value: unknown): value is Status {
  return typeof value === "string" && (STATUS_ORDER as string[]).includes(value)
}

function readState(): ChecklistState {
  if (cachedState) return cachedState
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? (JSON.parse(raw) as Record<string, Partial<RowState>>) : {}
    const clean: ChecklistState = {}
    for (const [id, value] of Object.entries(parsed)) {
      if (!value || typeof value !== "object") continue
      clean[id] = {
        status: isStatus(value.status) ? value.status : "open",
        note: typeof value.note === "string" ? value.note : "",
      }
    }
    cachedState = clean
  } catch {
    // Private windows or blocked storage: run without persistence.
    cachedState = EMPTY_STATE
  }
  return cachedState
}

function writeState(next: ChecklistState) {
  cachedState = next
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // Ignore storage failures; the in-memory checklist still works.
  }
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function getServerSnapshot(): ChecklistState {
  return EMPTY_STATE
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export default function InteractiveEAAChecklist() {
  const state = useSyncExternalStore(subscribe, readState, getServerSnapshot)
  const [preset, setPreset] = useState("all")
  const [section, setSection] = useState<string>("all")
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [expandAll, setExpandAll] = useState(false)
  const [openNotes, setOpenNotes] = useState<Record<string, boolean>>({})

  const activePreset = PRESETS.find((p) => p.id === preset) ?? PRESETS[0]

  const activeSections = useMemo(() => {
    if (section !== "all") return [section]
    if (activePreset.sections.length > 0) {
      return SECTION_IDS.filter((id) => activePreset.sections.includes(id))
    }
    return SECTION_IDS
  }, [section, activePreset])

  const statusOf = (id: string): Status => state[id]?.status ?? "open"

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return ROWS.filter((r) => {
      if (!activeSections.includes(r.section)) return false
      const status = state[r.id]?.status ?? "open"
      if (statusFilter === "remaining") {
        if (status === "done" || status === "na") return false
      } else if (statusFilter !== "all" && status !== statusFilter) {
        return false
      }
      if (q) {
        const sectionTitle = SECTIONS.find((s) => s.id === r.section)?.title ?? ""
        const hay = `${r.id} ${r.source} ${r.obligation} ${r.appliesTo} ${r.evidence} ${r.notes} ${sectionTitle}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [activeSections, query, statusFilter, state])

  const grouped = useMemo(() => {
    const g: Record<string, Row[]> = {}
    for (const r of filtered) (g[r.section] ||= []).push(r)
    return SECTIONS.filter((s) => g[s.id]?.length).map((s) => ({ section: s, rows: g[s.id] }))
  }, [filtered])

  const progress = useMemo(() => {
    const inScope = ROWS.filter((r) => activeSections.includes(r.section))
    let done = 0
    let inProgress = 0
    let na = 0
    for (const r of inScope) {
      const s = state[r.id]?.status ?? "open"
      if (s === "done") done++
      else if (s === "progress") inProgress++
      else if (s === "na") na++
    }
    const applicable = inScope.length - na
    return {
      total: inScope.length,
      applicable,
      done,
      inProgress,
      na,
      pct: applicable ? Math.round((done / applicable) * 100) : 0,
    }
  }, [state, activeSections])

  const sectionProgress = useMemo(() => {
    const out: Record<string, { done: number; applicable: number }> = {}
    for (const r of ROWS) {
      const s = state[r.id]?.status ?? "open"
      const entry = (out[r.section] ||= { done: 0, applicable: 0 })
      if (s !== "na") entry.applicable++
      if (s === "done") entry.done++
    }
    return out
  }, [state])

  const setStatus = (id: string, status: Status) => {
    const current = readState()
    writeState({ ...current, [id]: { status, note: current[id]?.note ?? "" } })
  }

  const setNote = (id: string, note: string) => {
    const current = readState()
    writeState({ ...current, [id]: { status: current[id]?.status ?? "open", note } })
  }

  const resetAll = () => {
    if (!window.confirm("Clear every status and note in this checklist?")) return
    writeState(EMPTY_STATE)
  }

  const exportExcel = () => {
    const header = [
      "ID",
      "Section",
      "Obligation",
      "Source (Directive (EU) 2019/882)",
      "Applies to",
      "Evidence to keep",
      "Directive notes",
      "Status",
      "Your notes",
    ]
    const rows = ROWS.filter((r) => activeSections.includes(r.section)).map((r) => [
      r.id,
      SECTIONS.find((s) => s.id === r.section)?.title ?? r.section,
      r.obligation,
      r.source,
      r.appliesTo,
      r.evidence,
      r.notes,
      STATUS_LABEL[statusOf(r.id)],
      state[r.id]?.note ?? "",
    ])
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.aoa_to_sheet([header, ...rows])
    ws["!cols"] = [
      { wch: 26 },
      { wch: 34 },
      { wch: 80 },
      { wch: 36 },
      { wch: 40 },
      { wch: 70 },
      { wch: 90 },
      { wch: 14 },
      { wch: 40 },
    ]
    const range = XLSX.utils.decode_range(ws["!ref"] || "A1")
    ws["!autofilter"] = { ref: XLSX.utils.encode_range(range) }
    XLSX.utils.book_append_sheet(wb, ws, "EAA checklist")

    const summary = [
      ["European Accessibility Act readiness checklist export"],
      [""],
      ["Exported", new Date().toLocaleDateString()],
      ["Scope", activePreset.label],
      ["Obligations in scope", String(progress.total)],
      ["Marked done", String(progress.done)],
      ["In progress", String(progress.inProgress)],
      ["Not applicable", String(progress.na)],
      ["Progress (done / applicable)", `${progress.pct}%`],
      [""],
      ["Source", checklistData.directive],
      ["Text", checklistData.textUrl],
      ["Verified against the Directive text", checklistData.verified],
      [""],
      [checklistData.sourceNote],
      [""],
      [checklistData.standardsNote],
      [""],
      ["Exported from https://accessibility.build/checklists/eaa"],
    ]
    const ws2 = XLSX.utils.aoa_to_sheet(summary)
    ws2["!cols"] = [{ wch: 34 }, { wch: 80 }]
    XLSX.utils.book_append_sheet(wb, ws2, "Summary")
    XLSX.writeFile(wb, "eaa-readiness-checklist.xlsx")
  }

  return (
    <div>
      {/* Controls */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900 sm:p-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Your sector
        </p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter the checklist by sector">
          {PRESETS.map((p) => (
            <Button
              key={p.id}
              size="sm"
              variant={preset === p.id ? "default" : "outline"}
              aria-pressed={preset === p.id}
              onClick={() => {
                setPreset(p.id)
                setSection("all")
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
            <label htmlFor="eaa-checklist-search" className="sr-only">
              Search obligations
            </label>
            <Input
              id="eaa-checklist-search"
              type="search"
              placeholder="Search obligation, article or annex"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div>
            <label htmlFor="eaa-checklist-section" className="sr-only">
              Filter by section
            </label>
            <select
              id="eaa-checklist-section"
              value={section}
              onChange={(e) => setSection(e.target.value)}
              className="h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 text-sm dark:border-slate-700 dark:bg-slate-900"
            >
              <option value="all">All sections in scope</option>
              {SECTIONS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="eaa-checklist-status" className="sr-only">
              Filter by status
            </label>
            <select
              id="eaa-checklist-status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 text-sm dark:border-slate-700 dark:bg-slate-900"
            >
              <option value="all">All statuses</option>
              <option value="remaining">Still to do</option>
              <option value="open">Not started</option>
              <option value="progress">In progress</option>
              <option value="done">Done</option>
              <option value="na">Not applicable</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <input
              type="checkbox"
              checked={expandAll}
              onChange={(e) => setExpandAll(e.target.checked)}
              className="h-4 w-4"
            />
            Show evidence and notes for every row
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
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200" role="status">
            {progress.done} of {progress.applicable} applicable obligations done ({progress.pct}%)
            {progress.inProgress > 0 && `, ${progress.inProgress} in progress`}
            {progress.na > 0 && `, ${progress.na} marked not applicable`}
            {preset !== "all" && ` in the ${activePreset.label} scope`}
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
              className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all"
              style={{ width: `${progress.pct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Section navigation */}
      {grouped.length > 1 && (
        <nav aria-label="Checklist sections" className="mt-6">
          <ul className="flex flex-wrap gap-2">
            {grouped.map(({ section: s }) => {
              const sp = sectionProgress[s.id] ?? { done: 0, applicable: 0 }
              return (
                <li key={s.id}>
                  <a
                    href={`#eaa-sec-${s.id}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700 hover:border-blue-300 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-blue-700 dark:hover:text-blue-300"
                  >
                    {s.title}
                    <span className="text-slate-600 dark:text-slate-400">
                      {sp.done}/{sp.applicable}
                    </span>
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      )}

      {/* Rows grouped by section */}
      {grouped.length === 0 && (
        <p className="mt-8 text-center text-slate-500 dark:text-slate-400">
          No obligations match the current filters.
        </p>
      )}

      {grouped.map(({ section: s, rows }) => {
        const sp = sectionProgress[s.id] ?? { done: 0, applicable: 0 }
        return (
          <section key={s.id} aria-labelledby={`eaa-sec-${s.id}`} className="mt-10 scroll-mt-24">
            <h2 id={`eaa-sec-${s.id}`} className="mb-1 text-xl font-bold text-slate-900 dark:text-white">
              {s.title}
            </h2>
            <p className="mb-1 font-mono text-xs text-blue-700 dark:text-blue-300">{s.source}</p>
            <p className="mb-4 max-w-3xl text-sm text-slate-600 dark:text-slate-400">
              {s.summary}{" "}
              <span className="text-slate-500 dark:text-slate-500">
                {sp.done} of {sp.applicable} done; {rows.length} shown.
              </span>
            </p>
            <ul className="space-y-3">
              {rows.map((r) => {
                const rs = state[r.id]
                const status = rs?.status ?? "open"
                const notesOpen = openNotes[r.id] ?? Boolean(rs?.note)
                return (
                  <li
                    key={r.id}
                    className={cn(
                      "rounded-lg border p-4 transition-colors",
                      status === "done" &&
                        "border-emerald-200 bg-emerald-50/60 dark:border-emerald-800/60 dark:bg-emerald-950/20",
                      status === "progress" &&
                        "border-amber-200 bg-amber-50/50 dark:border-amber-800/60 dark:bg-amber-950/20",
                      status === "na" &&
                        "border-dashed border-slate-200 bg-slate-50 dark:border-slate-700/70 dark:bg-slate-900/40",
                      status === "open" && "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"
                    )}
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs text-blue-700 dark:text-blue-300">{r.source}</span>
                          {status === "done" && (
                            <CheckCircle2
                              className="h-4 w-4 text-emerald-600 dark:text-emerald-400"
                              aria-hidden="true"
                            />
                          )}
                        </div>
                        <p
                          id={`eaa-ob-${r.id}`}
                          className={cn(
                            "mt-1 font-semibold text-slate-900 dark:text-white",
                            status === "na" && "text-slate-500 dark:text-slate-400"
                          )}
                        >
                          {r.obligation}
                        </p>
                        <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400">
                          Applies to: {r.appliesTo}
                        </p>
                        <details open={expandAll} className="mt-2 group">
                          <summary className="inline-flex cursor-pointer list-none items-center gap-1 text-xs font-medium text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 [&::-webkit-details-marker]:hidden">
                            Evidence to keep and notes
                            <ChevronDown
                              className="h-3.5 w-3.5 transition-transform group-open:rotate-180"
                              aria-hidden="true"
                            />
                          </summary>
                          <div className="mt-2 space-y-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                            <p>
                              <span className="font-semibold text-slate-700 dark:text-slate-300">
                                Evidence to keep:
                              </span>{" "}
                              {r.evidence}
                            </p>
                            {r.notes && (
                              <p>
                                <span className="font-semibold text-slate-700 dark:text-slate-300">Note:</span>{" "}
                                {r.notes}
                              </p>
                            )}
                          </div>
                        </details>
                        <div className="mt-2">
                          <button
                            type="button"
                            onClick={() => setOpenNotes((prev) => ({ ...prev, [r.id]: !notesOpen }))}
                            aria-expanded={notesOpen}
                            aria-controls={`eaa-note-wrap-${r.id}`}
                            className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                          >
                            <StickyNote className="h-3.5 w-3.5" aria-hidden="true" />
                            {rs?.note ? "Edit your note" : "Add your note"}
                            <ChevronDown
                              className={cn("h-3.5 w-3.5 transition-transform", notesOpen && "rotate-180")}
                              aria-hidden="true"
                            />
                          </button>
                          <div id={`eaa-note-wrap-${r.id}`} hidden={!notesOpen} className="mt-2">
                            <label htmlFor={`eaa-note-${r.id}`} className="sr-only">
                              Your note for {r.source}
                            </label>
                            <textarea
                              id={`eaa-note-${r.id}`}
                              value={rs?.note ?? ""}
                              onChange={(e) => setNote(r.id, e.target.value)}
                              rows={2}
                              placeholder="Owner, evidence location, findings..."
                              className="w-full rounded-md border border-slate-200 bg-white p-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="shrink-0 sm:w-44">
                        <label htmlFor={`eaa-status-${r.id}`} className="sr-only">
                          Status for {r.source}
                        </label>
                        <select
                          id={`eaa-status-${r.id}`}
                          value={status}
                          onChange={(e) => setStatus(r.id, e.target.value as Status)}
                          aria-describedby={`eaa-ob-${r.id}`}
                          className={cn(
                            "h-9 w-full rounded-md border px-3 text-sm font-medium",
                            status === "done" &&
                              "border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-200",
                            status === "progress" &&
                              "border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-200",
                            status === "na" &&
                              "border-slate-300 bg-slate-100 text-slate-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300",
                            status === "open" &&
                              "border-slate-200 bg-white text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                          )}
                        >
                          {STATUS_ORDER.map((s) => (
                            <option key={s} value={s}>
                              {STATUS_LABEL[s]}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
