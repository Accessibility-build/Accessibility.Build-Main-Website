"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import * as XLSX from "xlsx"
import v3Data from "@/lib/data/en-301-549-checklist.json"
import v4Data from "@/lib/data/en-301-549-v4-checklist.json"
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
 * Interactive EN 301 549 checklist with a version switch.
 *
 * Two datasets, one component:
 * - V3.2.1 rows come from lib/data/en-301-549-checklist.json (the edition
 *   cited in the Official Journal for the Web Accessibility Directive).
 * - V4.1.1 rows come from lib/data/en-301-549-v4-checklist.json, generated
 *   from the ETSI PDF by scripts/en301549/build-v4-checklist.mjs, and carry
 *   a changeType against v3.2.1 plus the clause A.2 conformance tables.
 *
 * Each version keeps its own localStorage key and its own Excel export, so
 * an assessment started against one edition is never mixed with the other.
 * Only rows of kind "requirement" are checkable; statements (v3 clause 4),
 * void slots, and not-applicable clauses render as information rows so the
 * clause numbering the standard uses stays visible and explainable.
 */

type Version = "v3" | "v4"

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
  changeType?: "new" | "changed" | "unchanged"
  previous?: { clause: string; title: string } | null
  changeNote?: string | null
}

interface RemovedRow {
  clause: string
  title: string
  chapter: string
  note: string
}

interface RowState {
  done: boolean
  note: string
}

interface Preset {
  id: string
  label: string
  prefixes: string[]
}

interface Dataset {
  id: Version
  label: string
  edition: string
  status: string
  wcagVersion: string
  rows: Row[]
  chapters: Record<string, string>
  storageKey: string
  fileName: string
  sheetName: string
  presets: Preset[]
  eaaTables?: Record<string, { label: string; clauses: string[] }>
  removed?: RemovedRow[]
}

const VERSION_KEY = "en301549-checklist-version"

const DATASETS: Record<Version, Dataset> = {
  v3: {
    id: "v3",
    label: "v3.2.1",
    edition: "EN 301 549 V3.2.1 (2021-03)",
    status: "Cited in the Official Journal for the Web Accessibility Directive",
    wcagVersion: "2.1",
    rows: v3Data.rows as Row[],
    chapters: v3Data.chapters as Record<string, string>,
    storageKey: "en301549-checklist-state",
    fileName: "en-301-549-checklist.xlsx",
    sheetName: "EN 301 549 v3.2.1",
    presets: [
      { id: "all", label: "Everything", prefixes: [] },
      { id: "web", label: "Websites & web apps", prefixes: ["9.", "12."] },
      { id: "docs", label: "Documents", prefixes: ["10.", "12."] },
      { id: "software", label: "Software & mobile apps", prefixes: ["11.", "12."] },
      { id: "hardware", label: "Hardware & terminals", prefixes: ["4.", "5.", "6.", "7.", "8.", "12."] },
    ],
  },
  v4: {
    id: "v4",
    label: "v4.1.1",
    edition: "EN 301 549 V4.1.1 (2026-09)",
    status: "Published 2 September 2026; Official Journal citation pending",
    wcagVersion: "2.2",
    rows: v4Data.rows as Row[],
    chapters: v4Data.chapters as Record<string, string>,
    storageKey: "en301549-v4-checklist-state",
    fileName: "en-301-549-v4-1-1-checklist.xlsx",
    sheetName: "EN 301 549 v4.1.1",
    presets: [
      { id: "all", label: "Everything", prefixes: [] },
      { id: "web", label: "Websites & web apps", prefixes: ["9.", "12."] },
      { id: "docs", label: "Documents", prefixes: ["10.", "12."] },
      { id: "software", label: "Software & mobile apps", prefixes: ["11.", "5.10.", "12."] },
      { id: "hardware", label: "Hardware & terminals", prefixes: ["4.", "5.", "6.", "7.", "8.", "12."] },
    ],
    eaaTables: v4Data.eaaTables as Record<string, { label: string; clauses: string[] }>,
    removed: v4Data.removedFromV3 as RemovedRow[],
  },
}

const KIND_LABEL: Record<Row["kind"], string> = {
  requirement: "Requirement",
  statement: "Statement",
  void: "Void",
  na: "Not applicable",
}

const CHANGE_LABEL: Record<NonNullable<Row["changeType"]>, string> = {
  new: "New in v4.1.1",
  changed: "Changed from v3.2.1",
  unchanged: "Unchanged",
}

const inPrefixes = (clause: string, prefixes: string[]) =>
  prefixes.length === 0 || prefixes.some((p) => clause.startsWith(p) || clause === p.replace(/\.$/, ""))

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export default function InteractiveEN301549Checklist({ initialVersion = "v3" }: { initialVersion?: Version }) {
  const [version, setVersion] = useState<Version>(initialVersion)
  const [states, setStates] = useState<Record<Version, Record<string, RowState>>>({ v3: {}, v4: {} })
  const [loaded, setLoaded] = useState(false)
  const [preset, setPreset] = useState("all")
  const [chapter, setChapter] = useState<string>("all")
  const [eaaTable, setEaaTable] = useState<string>("all")
  const [onlyChanges, setOnlyChanges] = useState(false)
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState<"all" | "remaining" | "done">("all")
  const [showInfoRows, setShowInfoRows] = useState(true)
  const [openNotes, setOpenNotes] = useState<Record<string, boolean>>({})
  const liveRef = useRef<HTMLParagraphElement>(null)

  const data = DATASETS[version]
  const state = states[version]

  // Restore both editions' progress and the last chosen edition. The URL
  // (?version=v4) wins over the remembered choice so links to one edition work.
  useEffect(() => {
    setStates({
      v3: readStorage(DATASETS.v3.storageKey, {}),
      v4: readStorage(DATASETS.v4.storageKey, {}),
    })
    try {
      const fromUrl = new URLSearchParams(window.location.search).get("version")
      const remembered = localStorage.getItem(VERSION_KEY)
      const pick = fromUrl === "v4" || fromUrl === "v3" ? fromUrl : remembered === "v4" || remembered === "v3" ? remembered : null
      if (pick) setVersion(pick)
    } catch {
      // Private windows or blocked storage: keep the default edition.
    }
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (!loaded) return
    try {
      localStorage.setItem(data.storageKey, JSON.stringify(state))
    } catch {
      // Ignore storage failures; the in-memory checklist still works.
    }
  }, [state, loaded, data.storageKey])

  const switchVersion = (next: Version) => {
    if (next === version) return
    setVersion(next)
    setPreset("all")
    setChapter("all")
    setEaaTable("all")
    setOnlyChanges(false)
    setOpenNotes({})
    try {
      localStorage.setItem(VERSION_KEY, next)
      const url = new URL(window.location.href)
      url.searchParams.set("version", next)
      window.history.replaceState(null, "", url.toString())
    } catch {
      // Ignore storage and history failures.
    }
  }

  const activePrefixes = useMemo(() => {
    if (chapter !== "all") return [`${chapter}.`]
    const p = data.presets.find((x) => x.id === preset)
    return p ? p.prefixes : []
  }, [preset, chapter, data.presets])

  const tableClauses = useMemo(() => {
    if (version !== "v4" || eaaTable === "all" || !data.eaaTables) return null
    return new Set(data.eaaTables[eaaTable]?.clauses ?? [])
  }, [version, eaaTable, data.eaaTables])

  const inScope = (r: Row) => {
    if (!inPrefixes(r.clause, activePrefixes)) return false
    if (tableClauses && !tableClauses.has(r.clause)) return false
    if (onlyChanges && r.changeType === "unchanged") return false
    return true
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return data.rows.filter((r) => {
      if (!inScope(r)) return false
      if (!showInfoRows && r.kind !== "requirement") return false
      if (q) {
        const hay = `${r.clause} ${r.title} ${r.summary} ${r.appliesTo} ${r.wcag ?? ""} ${r.changeNote ?? ""}`.toLowerCase()
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.rows, activePrefixes, tableClauses, onlyChanges, query, status, state, showInfoRows])

  const grouped = useMemo(() => {
    const g: Record<string, Row[]> = {}
    for (const r of filtered) (g[r.chapter] ||= []).push(r)
    return g
  }, [filtered])

  const progress = useMemo(() => {
    const scoped = data.rows.filter((r) => r.kind === "requirement" && inScope(r))
    const done = scoped.filter((r) => state[r.clause]?.done).length
    return {
      total: scoped.length,
      done,
      pct: scoped.length ? Math.round((done / scoped.length) * 100) : 0,
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.rows, state, activePrefixes, tableClauses, onlyChanges])

  const updateState = (updater: (prev: Record<string, RowState>) => Record<string, RowState>) => {
    setStates((all) => ({ ...all, [version]: updater(all[version]) }))
  }

  const toggle = (clause: string) => {
    updateState((prev) => ({
      ...prev,
      [clause]: { done: !(prev[clause]?.done ?? false), note: prev[clause]?.note ?? "" },
    }))
  }

  const setNote = (clause: string, note: string) => {
    updateState((prev) => ({
      ...prev,
      [clause]: { done: prev[clause]?.done ?? false, note },
    }))
  }

  const resetAll = () => {
    if (!window.confirm(`Clear every checkmark and note in the ${data.label} checklist?`)) return
    updateState(() => ({}))
  }

  const scopeLabel = () => {
    const parts: string[] = []
    const p = data.presets.find((x) => x.id === preset)
    if (p && p.id !== "all") parts.push(p.label)
    if (chapter !== "all") parts.push(`chapter ${chapter}`)
    if (tableClauses && data.eaaTables) parts.push(`EAA Table ${eaaTable}`)
    if (onlyChanges) parts.push("new or changed rows only")
    return parts.length ? parts.join(", ") : "Everything"
  }

  const exportExcel = () => {
    const isV4 = version === "v4"
    const header = [
      "Clause",
      "Title",
      "Chapter",
      "Type",
      "Applies to",
      `WCAG ${data.wcagVersion} criterion`,
      "Level",
      "Advisory",
      "Status",
      "Notes",
      "Summary",
      ...(isV4 ? ["Change vs v3.2.1", "v3.2.1 clause", "Change note"] : []),
    ]
    const rows = data.rows
      .filter((r) => inScope(r))
      .map((r) => [
        r.clause,
        r.title,
        `${r.chapter} ${data.chapters[r.chapter]}`,
        KIND_LABEL[r.kind],
        r.appliesTo,
        r.wcag ?? "",
        r.wcagLevel ?? "",
        r.advisory ? "Advisory (should)" : "",
        r.kind === "requirement" ? (state[r.clause]?.done ? "Done" : "Open") : "",
        state[r.clause]?.note ?? "",
        r.summary,
        ...(isV4 ? [r.changeType ? CHANGE_LABEL[r.changeType] : "", r.previous?.clause ?? "", r.changeNote ?? ""] : []),
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
      ...(isV4 ? [{ wch: 20 }, { wch: 14 }, { wch: 70 }] : []),
    ]
    const range = XLSX.utils.decode_range(ws["!ref"] || "A1")
    ws["!autofilter"] = { ref: XLSX.utils.encode_range(range) }
    XLSX.utils.book_append_sheet(wb, ws, data.sheetName)

    const summary = [
      [`${data.sheetName} checklist export`],
      [""],
      ["Exported", new Date().toLocaleDateString()],
      ["Edition", data.edition],
      ["Legal status", isV4
        ? "Published 2 September 2026. Not yet cited in the Official Journal of the EU. No edition of EN 301 549 is cited under the European Accessibility Act until V4.1.1 is; V3.2.1 remains the edition cited for the Web Accessibility Directive."
        : "Cited in the Official Journal of the EU for the Web Accessibility Directive (Decision (EU) 2018/2048 as amended by Decision (EU) 2021/1339). Not cited under the European Accessibility Act."],
      ["Scope", scopeLabel()],
      ["Requirements in scope", String(progress.total)],
      ["Marked done", String(progress.done)],
      ["Progress", `${progress.pct}%`],
      [""],
      [`Clause numbers and titles follow ETSI ${data.edition}.`],
      ["Summaries are plain-language explanations from accessibility.build,"],
      ["not the normative text. Always verify against the published standard."],
      ["https://accessibility.build/checklists/en-301-549"],
    ]
    const ws2 = XLSX.utils.aoa_to_sheet(summary)
    ws2["!cols"] = [{ wch: 26 }, { wch: 110 }]
    XLSX.utils.book_append_sheet(wb, ws2, "Summary")

    if (isV4 && data.removed) {
      const ws3 = XLSX.utils.aoa_to_sheet([
        ["v3.2.1 clause", "Title", "Chapter", "What happened in v4.1.1"],
        ...data.removed.map((r) => [r.clause, r.title, r.chapter, r.note]),
      ])
      ws3["!cols"] = [{ wch: 14 }, { wch: 50 }, { wch: 8 }, { wch: 110 }]
      XLSX.utils.book_append_sheet(wb, ws3, "Removed from v3.2.1")
    }
    XLSX.writeFile(wb, data.fileName)
  }

  const changeCounts = useMemo(() => {
    if (version !== "v4") return null
    const c = { new: 0, changed: 0 }
    for (const r of data.rows) {
      if (r.changeType === "new") c.new++
      if (r.changeType === "changed") c.changed++
    }
    return c
  }, [version, data.rows])

  return (
    <div>
      {/* Edition switch */}
      <div
        className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900 sm:p-5"
        role="group"
        aria-labelledby="en-version-label"
      >
        <p id="en-version-label" className="text-sm font-semibold text-slate-900 dark:text-white">
          Standard edition
        </p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {(Object.keys(DATASETS) as Version[]).map((v) => {
            const d = DATASETS[v]
            const active = version === v
            return (
              <button
                key={v}
                type="button"
                aria-pressed={active}
                onClick={() => switchVersion(v)}
                className={`rounded-lg border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 ${
                  active
                    ? "border-blue-600 bg-blue-50 dark:border-blue-400 dark:bg-blue-950/40"
                    : "border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
                }`}
              >
                <span className="block font-semibold text-slate-900 dark:text-white">
                  EN 301 549 {d.label}
                  {active && <span className="sr-only"> (selected)</span>}
                </span>
                <span className="mt-0.5 block text-xs text-slate-600 dark:text-slate-300">{d.status}</span>
                <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
                  WCAG {d.wcagVersion} in clauses 9 to 11 &middot;{" "}
                  {d.rows.filter((r) => r.kind === "requirement").length} requirements
                </span>
              </button>
            )
          })}
        </div>
        {version === "v4" && changeCounts && (
          <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
            Against v3.2.1: {changeCounts.new} new rows, {changeCounts.changed} changed rows, and{" "}
            {data.removed?.length ?? 0} v3.2.1 clauses with no v4.1.1 row (listed at the end). Progress and notes are
            stored separately for each edition.{" "}
            <Link href="/compliance/en-301-549-v4" className="underline hover:no-underline">
              Read the clause-by-clause guide to v4.1.1
            </Link>
            .
          </p>
        )}
      </div>

      {/* Controls */}
      <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900 sm:p-5">
        <div
          className="flex flex-wrap gap-2"
          role="group"
          aria-label="Filter the checklist by product type"
        >
          {data.presets.map((p) => (
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
              {Object.entries(data.chapters).map(([num, label]) => (
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

        {version === "v4" && data.eaaTables && (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="en-checklist-eaa-table" className="mb-1 block text-xs font-medium text-slate-600 dark:text-slate-300">
                EAA conformance table (clause A.2 of v4.1.1)
              </label>
              <select
                id="en-checklist-eaa-table"
                value={eaaTable}
                onChange={(e) => setEaaTable(e.target.value)}
                className="h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 text-sm dark:border-slate-700 dark:bg-slate-900"
              >
                <option value="all">Not filtered by table</option>
                {Object.entries(data.eaaTables).map(([id, t]) => (
                  <option key={id} value={id}>
                    Table {id}: {t.label} ({t.clauses.length})
                  </option>
                ))}
              </select>
            </div>
            <label className="flex cursor-pointer items-center gap-2 self-end pb-2 text-sm text-slate-600 dark:text-slate-300">
              <input
                type="checkbox"
                checked={onlyChanges}
                onChange={(e) => setOnlyChanges(e.target.checked)}
                className="h-4 w-4"
              />
              Only rows that are new or changed since v3.2.1
            </label>
          </div>
        )}

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
              Export Excel ({data.label})
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
            {data.label}: {progress.done} of {progress.total} requirements marked done ({progress.pct}%)
            {scopeLabel() !== "Everything" && ` in scope: ${scopeLabel()}`}
          </p>
          <div
            className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
            role="progressbar"
            aria-valuenow={progress.pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Checklist progress for ${data.label}`}
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
          <section key={`${version}-${ch}`} aria-labelledby={`en-ch-${ch}`} className="mt-10">
            <h2
              id={`en-ch-${ch}`}
              className="mb-1 text-xl font-bold text-slate-900 dark:text-white"
            >
              {ch}. {data.chapters[ch]}
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
                const checkId = `en-check-${version}-${r.clause}`
                const noteId = `en-note-${version}-${r.clause}`
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
                          id={checkId}
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
                              htmlFor={checkId}
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
                          {r.changeType === "new" && (
                            <Badge
                              variant="outline"
                              className="border-emerald-300 text-xs text-emerald-700 dark:border-emerald-700 dark:text-emerald-300"
                            >
                              New in v4.1.1
                            </Badge>
                          )}
                          {r.changeType === "changed" && (
                            <Badge
                              variant="outline"
                              className="border-blue-300 text-xs text-blue-700 dark:border-blue-700 dark:text-blue-300"
                            >
                              Changed from v3.2.1
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
                        {r.changeNote && (
                          <p className="mt-1.5 text-xs leading-relaxed text-blue-800 dark:text-blue-200">
                            <span className="font-semibold">v3.2.1 to v4.1.1:</span> {r.changeNote}
                          </p>
                        )}
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
                                <label htmlFor={noteId} className="sr-only">
                                  Notes for clause {r.clause}
                                </label>
                                <textarea
                                  id={noteId}
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

      {/* Removed v3.2.1 clauses (v4 only) */}
      {version === "v4" && data.removed && data.removed.length > 0 && (
        <section aria-labelledby="en-removed" className="mt-12">
          <details className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900 sm:p-5">
            <summary className="cursor-pointer">
              <h2 id="en-removed" className="inline text-lg font-bold text-slate-900 dark:text-white">
                {data.removed.length} v3.2.1 clauses with no row in v4.1.1
              </h2>
              <span className="ml-2 text-sm text-slate-500 dark:text-slate-400">
                (merged, moved, dropped, or made informative)
              </span>
            </summary>
            <ul className="mt-4 space-y-2">
              {data.removed.map((r) => (
                <li key={r.clause} className="text-sm text-slate-600 dark:text-slate-400">
                  <span className="font-mono text-slate-700 dark:text-slate-300">{r.clause}</span>{" "}
                  <span className="font-medium text-slate-800 dark:text-slate-200">{r.title}</span>: {r.note}
                </li>
              ))}
            </ul>
          </details>
        </section>
      )}
    </div>
  )
}
