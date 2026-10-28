"use client"

import { AlertTriangle, CheckCircle2, Info, LocateFixed, XCircle } from "lucide-react"
import type { FocusProblem, FocusStop, Severity, TargetItem } from "@/lib/focus-order/types"
import { stopHasProblem } from "@/lib/focus-order/describe"
import { cn } from "@/lib/utils"

// The text equivalent of the screenshot overlay: one list item per marker, in the same order and
// with the same number, each with its problems spelled out. Hovering or focusing an item lights up
// its marker; "Show on screenshot" also scrolls the screenshot to it.

const SEVERITY: Record<Severity, { label: string; icon: typeof XCircle; className: string }> = {
  fail: { label: "Fails", icon: XCircle, className: "text-red-800 dark:text-red-300" },
  warning: { label: "Check", icon: AlertTriangle, className: "text-amber-900 dark:text-amber-200" },
  info: { label: "Note", icon: Info, className: "text-slate-700 dark:text-slate-300" },
}

export function ProblemLine({ problem }: { problem: Pick<FocusProblem, "severity" | "criterion" | "message"> }) {
  const { label, icon: Icon, className } = SEVERITY[problem.severity]
  return (
    <li className={cn("flex items-start gap-2", className)}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <span>
        <strong className="font-semibold">
          {label}
          {problem.criterion ? ` (WCAG ${problem.criterion})` : ""}:
        </strong>{" "}
        {problem.message}
      </span>
    </li>
  )
}

function Badge({ index, square, tone }: { index: number; square: boolean; tone: "ok" | "fail" | "spacing" }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex h-7 min-w-7 shrink-0 items-center justify-center px-1 text-xs font-bold text-white",
        square ? "rounded-sm" : "rounded-full",
        tone === "ok" && "bg-teal-700",
        tone === "fail" && "bg-red-700",
        tone === "spacing" && "bg-amber-700",
      )}
    >
      {index}
    </span>
  )
}

interface ItemEvents {
  activeIndex: number | null
  onHover: (index: number | null) => void
  onShow: (index: number) => void
}

function ShowButton({ index, noun, onShow }: { index: number; noun: string; onShow: (index: number) => void }) {
  return (
    <button
      type="button"
      onClick={() => onShow(index)}
      className="mt-2 inline-flex items-center gap-1.5 rounded-md border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
    >
      <LocateFixed className="h-3.5 w-3.5" aria-hidden="true" />
      Show on screenshot<span className="sr-only"> ({noun} {index})</span>
    </button>
  )
}

function itemClass(active: boolean) {
  return cn(
    "rounded-lg border p-3 transition-colors motion-reduce:transition-none",
    active ? "border-teal-600 bg-teal-50 dark:border-teal-400 dark:bg-teal-950/40" : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900",
  )
}

export function StopList({ stops, activeIndex, onHover, onShow }: { stops: FocusStop[] } & ItemEvents) {
  return (
    <ol className="space-y-2" aria-label="Focus stops in Tab order">
      {stops.map((stop) => {
        const problem = stopHasProblem(stop)
        return (
          <li
            key={stop.index}
            className={itemClass(activeIndex === stop.index)}
            onMouseEnter={() => onHover(stop.index)}
            onMouseLeave={() => onHover(null)}
            onFocus={() => onHover(stop.index)}
          >
            <div className="flex items-start gap-3">
              <Badge index={stop.index} square={problem} tone={problem ? "fail" : "ok"} />
              <div className="min-w-0 flex-1 text-sm">
                <p className="font-medium text-slate-900 dark:text-white">
                  <span className="sr-only">Stop {stop.index}: </span>
                  {stop.role || stop.tag}{" "}
                  {stop.name ? <q>{stop.name}</q> : <span className="italic text-slate-600 dark:text-slate-400">(no accessible name)</span>}
                  {stop.tabindex !== null && stop.tabindex !== 0 && (
                    <span className="ml-1 font-mono text-xs text-slate-600 dark:text-slate-400">tabindex={stop.tabindex}</span>
                  )}
                </p>
                <p className="mt-0.5 break-all font-mono text-xs text-slate-600 dark:text-slate-400">{stop.selector}</p>
                {!problem && stop.indicator === "visible" && (
                  <p className="mt-2 flex items-start gap-2 text-emerald-800 dark:text-emerald-300">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>
                      <strong className="font-semibold">Passes:</strong> focus is visible
                      {stop.covered === "none" ? " and nothing covers it" : " and not entirely covered"}.
                    </span>
                  </p>
                )}
                {stop.problems.length > 0 && (
                  <ul className="mt-2 space-y-1.5">
                    {stop.problems.map((item, i) => (
                      <ProblemLine key={i} problem={item} />
                    ))}
                  </ul>
                )}
                {stop.indicator === "visible" && stop.styleChanges.length > 0 && (
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">Changed on focus: {stop.styleChanges.join(", ")}.</p>
                )}
                {stop.marker ? (
                  <ShowButton index={stop.index} noun="stop" onShow={onShow} />
                ) : (
                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">Not drawn on the screenshot: it is no longer shown, or it is outside the captured area.</p>
                )}
              </div>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

export function TargetList({ targets, activeIndex, onHover, onShow }: { targets: TargetItem[] } & ItemEvents) {
  return (
    <ol className="space-y-2" aria-label="Undersized targets">
      {targets.map((target) => {
        const fail = target.status === "fail"
        return (
          <li
            key={target.index}
            className={itemClass(activeIndex === target.index)}
            onMouseEnter={() => onHover(target.index)}
            onMouseLeave={() => onHover(null)}
            onFocus={() => onHover(target.index)}
          >
            <div className="flex items-start gap-3">
              <Badge index={target.index} square={fail} tone={fail ? "fail" : "spacing"} />
              <div className="min-w-0 flex-1 text-sm">
                <p className="font-medium text-slate-900 dark:text-white">
                  <span className="sr-only">Target {target.index}: </span>
                  {target.role || target.tag}{" "}
                  {target.name ? <q>{target.name}</q> : <span className="italic text-slate-600 dark:text-slate-400">(no accessible name)</span>}
                  <span className="ml-1 text-slate-700 dark:text-slate-300">
                    {target.box.width} by {target.box.height} px
                  </span>
                </p>
                <p className="mt-0.5 break-all font-mono text-xs text-slate-600 dark:text-slate-400">{target.selector}</p>
                <ul className="mt-2 space-y-1.5">
                  {fail ? (
                    <ProblemLine
                      problem={{
                        severity: "fail",
                        criterion: "2.5.8",
                        message: `Smaller than 24 by 24 pixels, and its 24 px spacing circle touches ${target.conflicts.length ? target.conflicts.map((name) => `“${name}”`).join(", ") : "another target"}.`,
                      }}
                    />
                  ) : (
                    <ProblemLine
                      problem={{
                        severity: "info",
                        criterion: "2.5.8",
                        message: "Smaller than 24 by 24 pixels, but passes by spacing: no other target is within reach of its 24 px circle.",
                      }}
                    />
                  )}
                </ul>
                <ShowButton index={target.index} noun="target" onShow={onShow} />
              </div>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

export function ExemptTargetList({ targets }: { targets: TargetItem[] }) {
  return (
    <ul className="mt-3 space-y-1.5 text-sm text-slate-700 dark:text-slate-300">
      {targets.map((target) => (
        <li key={target.index} className="flex items-start gap-2">
          <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>
            <strong className="font-semibold">{target.status === "inline" ? "Inline link" : "Browser default control"}:</strong>{" "}
            {target.role || target.tag} {target.name ? <q>{target.name}</q> : "(no accessible name)"}, {target.box.width} by {target.box.height} px
          </span>
        </li>
      ))}
    </ul>
  )
}
