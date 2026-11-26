"use client"

import { useEffect, useState } from "react"
import { Check, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { hostOf } from "./meta"

// The server action reports nothing until it finishes, so the steps advance on typical timings.
// The copy says so: these are the steps in order, with an estimate of where the scan has got to.
const STEPS: { label: string; detail: string; startsAt: number }[] = [
  { label: "Loading the page", detail: "Headless Chrome at 1280 by 800, scrolling to load lazy content", startsAt: 0 },
  { label: "Running axe-core", detail: "WCAG 2.0 to 2.2 A and AA rules plus best practices", startsAt: 9 },
  { label: "Page checks", detail: "Alt text, forms, link text, media, clickable elements", startsAt: 15 },
  { label: "Keyboard pass", detail: "Pressing Tab and comparing screenshots at every stop", startsAt: 18 },
  { label: "Text spacing and reflow", detail: "WCAG 1.4.12 spacing, then a 320 pixel wide window", startsAt: 34 },
  { label: "Writing the summary", detail: "Scoring, WCAG coverage and the manual testing plan", startsAt: 40 },
]

export function AuditProgress({ url }: { url: string }) {
  const [elapsed, setElapsed] = useState(0)
  useEffect(() => {
    const started = Date.now()
    const timer = setInterval(() => setElapsed(Math.floor((Date.now() - started) / 1000)), 1000)
    return () => clearInterval(timer)
  }, [])
  const current = STEPS.reduce((index, step, i) => (elapsed >= step.startsAt ? i : index), 0)

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-serif text-xl font-semibold text-slate-900 dark:text-white">Auditing {hostOf(url)}</h2>
        <p className="text-sm tabular-nums text-slate-600 dark:text-slate-400" aria-hidden="true">
          {elapsed}s
        </p>
      </div>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Usually 30 to 60 seconds. Keep this tab open.</p>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800" aria-hidden="true">
        <div className="h-full rounded-full bg-teal-600 transition-[width] duration-1000 ease-linear motion-reduce:transition-none" style={{ width: `${Math.min(95, (elapsed / 50) * 100)}%` }} />
      </div>
      <ol className="mt-5 space-y-3">
        {STEPS.map((step, index) => {
          const state = index < current ? "done" : index === current ? "active" : "waiting"
          return (
            <li key={step.label} className="flex gap-3">
              <span
                className={cn(
                  "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                  state === "done" && "border-teal-700 bg-teal-700 text-white",
                  state === "active" && "border-teal-700 text-teal-800 dark:border-teal-400 dark:text-teal-300",
                  state === "waiting" && "border-slate-300 text-slate-500 dark:border-slate-700",
                )}
                aria-hidden="true"
              >
                {state === "done" ? <Check className="h-3.5 w-3.5" /> : state === "active" ? <Loader2 className="h-3.5 w-3.5 animate-spin motion-reduce:animate-none" /> : index + 1}
              </span>
              <span>
                <span className={cn("block text-sm font-medium", state === "waiting" ? "text-slate-600 dark:text-slate-400" : "text-slate-900 dark:text-white")}>
                  {step.label}
                  <span className="sr-only">{state === "done" ? " (probably done)" : state === "active" ? " (probably in progress)" : ""}</span>
                </span>
                <span className="block text-xs text-slate-600 dark:text-slate-400">{step.detail}</span>
              </span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
