"use client"

import { useSyncExternalStore } from "react"
import Link from "next/link"
import type { SuccessCriterion } from "@/lib/wcag-data"
import { wcagPath, wcagSlug } from "@/lib/wcag-pages"

// Progressive-enhancement layer for /checklists/interactive.
//
// The full grouped list of criteria is rendered on the server (this component
// is server-rendered like any client component) so every criterion, its level,
// and its link are in the served HTML. After hydration the checkboxes read and
// write the same localStorage key the full checklist at /checklists/wcag-2-2
// uses, so progress is shared between the two pages. Notes saved on the full
// checklist are preserved when a box is toggled here.

const STORAGE_KEY = "wcag-checklist-state"

interface CriterionStatus {
  checked: boolean
  note: string
}

type ChecklistState = Record<string, CriterionStatus>

export interface GuidelineGroup {
  guideline: string
  criteria: SuccessCriterion[]
}

export interface PrincipleGroup {
  principle: string
  guidelines: GuidelineGroup[]
}

const EMPTY_STATE: ChecklistState = {}
const listeners = new Set<() => void>()
let cachedRaw: string | null = null
let cachedState: ChecklistState = EMPTY_STATE
let storageUnavailable = false

function readState(): ChecklistState {
  if (storageUnavailable) return cachedState
  let raw: string | null = null
  try {
    raw = window.localStorage.getItem(STORAGE_KEY)
  } catch {
    storageUnavailable = true
    return cachedState
  }
  if (raw === cachedRaw) return cachedState
  cachedRaw = raw
  if (!raw) {
    cachedState = EMPTY_STATE
    return cachedState
  }
  try {
    const parsed: unknown = JSON.parse(raw)
    cachedState = parsed && typeof parsed === "object" ? (parsed as ChecklistState) : EMPTY_STATE
  } catch {
    cachedState = EMPTY_STATE
  }
  return cachedState
}

function writeState(next: ChecklistState) {
  cachedState = next
  try {
    const raw = JSON.stringify(next)
    window.localStorage.setItem(STORAGE_KEY, raw)
    cachedRaw = raw
  } catch {
    storageUnavailable = true
  }
  listeners.forEach((listener) => listener())
}

function subscribe(callback: () => void) {
  listeners.add(callback)
  const onStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === STORAGE_KEY) callback()
  }
  window.addEventListener("storage", onStorage)
  return () => {
    listeners.delete(callback)
    window.removeEventListener("storage", onStorage)
  }
}

function getServerSnapshot(): ChecklistState {
  return EMPTY_STATE
}

const levelClasses: Record<SuccessCriterion["level"], string> = {
  A: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
  AA: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200",
  AAA: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200",
}

interface WcagCriteriaChecklistProps {
  groups: PrincipleGroup[]
  total: number
}

export function WcagCriteriaChecklist({ groups, total }: WcagCriteriaChecklistProps) {
  const state = useSyncExternalStore(subscribe, readState, getServerSnapshot)

  const allNumbers = groups.flatMap((p) => p.guidelines.flatMap((g) => g.criteria.map((c) => c.number)))
  const checkedCount = allNumbers.filter((number) => state[number]?.checked).length
  const percentage = total > 0 ? Math.round((checkedCount / total) * 100) : 0

  const toggle = (number: string) => {
    const current = state[number]
    writeState({
      ...state,
      [number]: { checked: !current?.checked, note: current?.note ?? "" },
    })
  }

  return (
    <div className="space-y-12">
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5">
        <p className="text-sm font-medium text-slate-900 dark:text-white">
          {checkedCount} of {total} criteria checked ({percentage}%)
        </p>
        <div
          className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={checkedCount}
          aria-label="Criteria checked"
        >
          <div className="h-full bg-blue-600 transition-[width] duration-300" style={{ width: `${percentage}%` }} />
        </div>
        <p className="mt-3 text-xs text-slate-600 dark:text-slate-400">
          Progress is stored in this browser only and is shared with the{" "}
          <Link href="/checklists/wcag-2-2" className="underline hover:no-underline">
            full WCAG 2.2 checklist
          </Link>
          , where you can add notes, filter, reset, and export.
        </p>
      </div>

      {groups.map((principleGroup) => {
        const principleId = `principle-${principleGroup.principle.charAt(0)}`
        return (
          <section key={principleGroup.principle} aria-labelledby={principleId} className="space-y-8">
            <h2 id={principleId} className="text-2xl font-bold text-slate-900 dark:text-white">
              {principleGroup.principle}
            </h2>
            {principleGroup.guidelines.map((guidelineGroup) => {
              const guidelineId = `guideline-${guidelineGroup.guideline.split(" ")[0].replace(/\./g, "-")}`
              return (
                <div key={guidelineGroup.guideline}>
                  <h3 id={guidelineId} className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-3">
                    Guideline {guidelineGroup.guideline}
                  </h3>
                  <ol aria-labelledby={guidelineId} className="space-y-3">
                    {guidelineGroup.criteria.map((criterion) => {
                      const slug = wcagSlug(criterion.number)
                      const inputId = `check-${slug}`
                      const checked = Boolean(state[criterion.number]?.checked)
                      return (
                        <li
                          key={criterion.number}
                          id={`sc-${slug}`}
                          className="flex gap-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4"
                        >
                          <input
                            id={inputId}
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggle(criterion.number)}
                            className="mt-1 h-5 w-5 shrink-0 rounded border-slate-400 accent-blue-600"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <label htmlFor={inputId} className="font-medium text-slate-900 dark:text-white">
                                {criterion.number} {criterion.title}
                              </label>
                              <span className={`rounded px-2 py-0.5 text-xs font-semibold ${levelClasses[criterion.level]}`}>
                                Level {criterion.level}
                              </span>
                              {criterion.introduced !== "2.0" ? (
                                <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                  New in {criterion.introduced}
                                </span>
                              ) : null}
                            </div>
                            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{criterion.description}</p>
                            <Link
                              href={wcagPath(criterion.number)}
                              className="mt-2 inline-block text-sm text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              How to meet {criterion.number}
                            </Link>
                          </div>
                        </li>
                      )
                    })}
                  </ol>
                </div>
              )
            })}
          </section>
        )
      })}
    </div>
  )
}
