"use client"

import { useEffect, useId, useRef, useState, type CSSProperties } from "react"
import { Bold, Italic, Link2, RemoveFormatting, Underline } from "lucide-react"
import { cn } from "@/lib/utils"
import styles from "./hit.module.css"

type Mode = "none" | "aa" | "aaa"

const TOOLS = [
  { label: "Bold", icon: Bold, toggle: true },
  { label: "Italic", icon: Italic, toggle: true },
  { label: "Underline", icon: Underline, toggle: true },
  { label: "Link", icon: Link2, toggle: false },
  { label: "Clear formatting", icon: RemoveFormatting, toggle: false },
]

/** What 2.5.8 and 2.5.5 say about a single row of identical targets. */
export function verdict(size: number, gap: number, mode: Mode) {
  const target = mode === "none" ? size : Math.max(size, mode === "aa" ? 24 : 44)
  const pitch = size + gap // centre to centre
  const overlap = Math.max(0, target - pitch)
  const spacingExempt = size < 24 && pitch >= 24
  const aa = spacingExempt || (target >= 24 && overlap === 0)
  const aaa = target >= 44 && overlap === 0
  const aaWhy = aa
    ? target >= 24 && overlap === 0
      ? `Each target is ${target}px and none overlap.`
      : `The targets are ${size}px, but they sit ${pitch}px apart centre to centre, so 24px circles on them do not intersect. That is the spacing exception.`
    : overlap > 0
      ? `The hit areas overlap by ${overlap}px. Overlapping area does not count, so each target measures under 24px, and centres ${pitch}px apart are too close for the spacing exception.`
      : `The targets are ${size}px and only ${pitch}px apart centre to centre, so 24px circles on them intersect.`
  const aaaWhy = aaa
    ? `Each target is ${target}px with no overlap.`
    : overlap > 0
      ? `The hit areas overlap by ${overlap}px, and 2.5.5 has no spacing exception.`
      : `The targets are ${target}px. 2.5.5 needs 44px and has no spacing exception.`
  return { target, pitch, overlap, inset: (target - size) / 2, aa, aaa, aaWhy, aaaWhy }
}

function Verdict({ ok, label, why }: { ok: boolean; label: string; why: string }) {
  return (
    <div className={cn("rounded-2xl border-2 p-4", ok ? "border-emerald-700 dark:border-emerald-400" : "border-rose-700 dark:border-rose-400")}>
      <p className="flex items-center justify-between gap-3 font-semibold text-slate-900 dark:text-white">
        {label}
        <span
          className={cn(
            "rounded-full px-2.5 py-0.5 text-xs font-bold",
            ok ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200" : "bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-200",
          )}
        >
          {ok ? "Pass" : "Fail"}
        </span>
      </p>
      <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">{why}</p>
    </div>
  )
}

export function Inspector() {
  const [size, setSize] = useState(16)
  const [gap, setGap] = useState(4)
  const [mode, setMode] = useState<Mode>("none")
  const [reveal, setReveal] = useState(true)
  const [circles, setCircles] = useState(false)
  const [magnify, setMagnify] = useState(true)
  const [stageWidth, setStageWidth] = useState(0)
  const stageRef = useRef<HTMLDivElement>(null)
  const [pressed, setPressed] = useState<Record<string, boolean>>({ Bold: true })
  const [last, setLast] = useState("")
  const ids = { size: useId(), gap: useId(), mode: useId() }
  const v = verdict(size, gap, mode)
  const [summary, setSummary] = useState("")

  // Draw the toolbar as large as the panel allows; transforms scale the hit areas with it.
  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => setStageWidth(entry.contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const natural = TOOLS.length * size + (TOOLS.length - 1) * gap + 2 * v.inset
  const scale = magnify && stageWidth ? Math.max(1, Math.min(3, (stageWidth - 32) / natural)) : 1

  // One announcement after the controls settle, not one per slider step.
  useEffect(() => {
    const t = setTimeout(() => setSummary(`Target ${v.target} pixels. 2.5.8 ${v.aa ? "passes" : "fails"}. 2.5.5 ${v.aaa ? "passes" : "fails"}.`), 700)
    return () => clearTimeout(t)
  }, [v.target, v.aa, v.aaa])

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="min-w-0 space-y-5">
        <fieldset>
          <legend className="text-sm font-semibold text-slate-900 dark:text-white">Hit area</legend>
          <div className="mt-2 grid gap-2 sm:grid-flow-col sm:justify-start sm:gap-5">
            {(
              [
                ["none", "None (the icon only)"],
                ["aa", "24px (AA)"],
                ["aaa", "44px (AAA)"],
              ] as const
            ).map(([value, label]) => (
              <label key={value} className="flex min-h-6 cursor-pointer items-center gap-2 text-sm text-slate-800 dark:text-slate-200">
                <input
                  type="radio"
                  name={ids.mode}
                  value={value}
                  checked={mode === value}
                  onChange={() => setMode(value)}
                  className="h-4 w-4 accent-[#0b2545] dark:accent-amber-300"
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>
        <div>
          <label htmlFor={ids.size} className="flex justify-between text-sm font-medium text-slate-900 dark:text-white">
            Icon size <span className="font-mono text-slate-600 dark:text-slate-300">{size}px</span>
          </label>
          <input id={ids.size} type="range" min={12} max={28} value={size} aria-valuetext={`${size} pixels`} onChange={(e) => setSize(Number(e.target.value))} className="h-11 w-full cursor-pointer accent-[#0b2545] dark:accent-amber-300" />
        </div>
        <div>
          <label htmlFor={ids.gap} className="flex justify-between text-sm font-medium text-slate-900 dark:text-white">
            Gap between icons <span className="font-mono text-slate-600 dark:text-slate-300">{gap}px</span>
          </label>
          <input id={ids.gap} type="range" min={0} max={24} value={gap} aria-valuetext={`${gap} pixels`} onChange={(e) => setGap(Number(e.target.value))} className="h-11 w-full cursor-pointer accent-[#0b2545] dark:accent-amber-300" />
        </div>
        <div className="grid gap-2 sm:grid-flow-col sm:justify-start sm:gap-5">
          <label className="flex min-h-6 cursor-pointer items-center gap-2 text-sm text-slate-800 dark:text-slate-200">
            <input type="checkbox" checked={reveal} onChange={(e) => setReveal(e.target.checked)} className="h-4 w-4 accent-[#0b2545] dark:accent-amber-300" />
            Show hit areas
          </label>
          <label className="flex min-h-6 cursor-pointer items-center gap-2 text-sm text-slate-800 dark:text-slate-200">
            <input type="checkbox" checked={circles} onChange={(e) => setCircles(e.target.checked)} className="h-4 w-4 accent-[#0b2545] dark:accent-amber-300" />
            Show the 24px spacing circles
          </label>
          <label className="flex min-h-6 cursor-pointer items-center gap-2 text-sm text-slate-800 dark:text-slate-200">
            <input type="checkbox" checked={magnify} onChange={(e) => setMagnify(e.target.checked)} className="h-4 w-4 accent-[#0b2545] dark:accent-amber-300" />
            Draw it bigger
          </label>
        </div>
      </div>

      <div className="min-w-0 space-y-4">
        <div
          ref={stageRef}
          className={cn("flex items-center justify-center overflow-hidden rounded-3xl border border-slate-300 bg-white p-4 dark:border-slate-700 dark:bg-slate-900", reveal && styles.reveal)}
          style={{ minHeight: Math.max(160, (size + 2 * v.inset) * scale + 48) }}
        >
          <div role="group" aria-label="Text formatting (demo)" className="flex items-center" style={{ gap, transform: `scale(${scale})` }}>
            {TOOLS.map(({ label, icon: Icon, toggle }) => (
              <span key={label} className="relative flex">
                <button
                  type="button"
                  aria-label={label}
                  aria-pressed={toggle ? !!pressed[label] : undefined}
                  onClick={() => {
                    if (toggle) setPressed((p) => ({ ...p, [label]: !p[label] }))
                    setLast(`${label} ${toggle ? (pressed[label] ? "off" : "on") : "clicked"}`)
                  }}
                  className={cn(
                    styles.hit,
                    "flex items-center justify-center rounded text-slate-900 dark:text-white",
                    toggle && pressed[label] ? "bg-[#0b2545] text-white dark:bg-amber-300 dark:text-slate-950" : "bg-slate-200 dark:bg-slate-700",
                  )}
                  style={{ width: size, height: size, "--hit-inset": `${-v.inset}px` } as CSSProperties}
                >
                  <Icon aria-hidden="true" style={{ width: size * 0.75, height: size * 0.75 }} />
                </button>
                {circles && (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-sky-700 dark:border-sky-300"
                  />
                )}
              </span>
            ))}
          </div>
        </div>
        <p className="font-mono text-sm text-slate-700 dark:text-slate-300">
          Visible {size}px · target {v.target}px · centres {v.pitch}px apart · inset {v.inset ? `-${v.inset}px` : "0"}
          {scale > 1 && ` · drawn ×${scale.toFixed(1)}`}
          {v.overlap > 0 && <span className="text-rose-700 dark:text-rose-300"> · overlap {v.overlap}px</span>}
        </p>
        <Verdict ok={v.aa} label="2.5.8 Target Size (Minimum), AA" why={v.aaWhy} />
        <Verdict ok={v.aaa} label="2.5.5 Target Size (Enhanced), AAA" why={v.aaaWhy} />
        <p className="sr-only" role="status">
          {last}
        </p>
        <p className="sr-only" role="status">
          {summary}
        </p>
      </div>
    </div>
  )
}
