"use client"
import { useState } from "react"
import { useAnnouncer } from "./use-announcer"
import { Verdict } from "./verdict"
import { wLabel } from "./ui"

const ICONS = [
  { name: "Bold", d: "M7 5h6a3.5 3.5 0 0 1 0 7H7zM7 12h7a3.5 3.5 0 0 1 0 7H7z" },
  { name: "Italic", d: "M10 5h8M6 19h8M14 5 10 19" },
  { name: "Link", d: "M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" },
  { name: "List", d: "M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01" },
]

export function TargetSize({ idPrefix }: { idPrefix: string }) {
  const [size, setSize] = useState(20)
  const [gap, setGap] = useState(2)
  const [circles, setCircles] = useState(true)
  const minSize = size >= 24
  // Undersized targets pass by spacing when a 24 px circle centred on each one does not
  // intersect another target or another target's circle. For an evenly spaced row this
  // reduces to: centre-to-centre distance (size + gap) of at least 24 px.
  const spacing = !minSize && size + gap >= 24
  const aa = minSize || spacing
  const aaa = size >= 44
  const spoken = useAnnouncer(`Targets ${size} pixels, gap ${gap}. 2.5.8 ${aa ? "met" : "not met"}. 2.5.5 ${aaa ? "met" : "not met"}.`)
  const scale = 2
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor={`${idPrefix}-size`} className={wLabel}>Target size: {size} × {size} CSS px</label>
          <input id={`${idPrefix}-size`} type="range" min={12} max={56} value={size} onChange={(e) => setSize(Number(e.target.value))} className="mt-3 w-full accent-blue-700" />
        </div>
        <div>
          <label htmlFor={`${idPrefix}-gap`} className={wLabel}>Space between targets: {gap} CSS px</label>
          <input id={`${idPrefix}-gap`} type="range" min={0} max={24} value={gap} onChange={(e) => setGap(Number(e.target.value))} className="mt-3 w-full accent-blue-700" />
        </div>
        <label className="flex min-h-11 cursor-pointer items-center gap-3 self-end text-sm font-semibold"><input type="checkbox" checked={circles} onChange={(e) => setCircles(e.target.checked)} className="h-5 w-5 accent-blue-700" />Show 24 px spacing circles</label>
      </div>
      <div className="overflow-x-auto rounded-lg border border-slate-300 bg-white p-6 dark:border-slate-700" role="img" aria-label={`Toolbar of four icon buttons, each ${size} by ${size} CSS pixels with ${gap} pixels between them, drawn at twice actual size.`}>
        <div className="relative flex w-max items-center" style={{ gap: gap * scale }}>
          {ICONS.map((icon) => (
            <span key={icon.name} className="relative inline-flex items-center justify-center rounded-md bg-slate-200 text-slate-900" style={{ width: size * scale, height: size * scale }}>
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ width: Math.min(size * scale * 0.6, 40), height: Math.min(size * scale * 0.6, 40) }}><path d={icon.d} /></svg>
              {circles && !minSize ? <span aria-hidden="true" className="pointer-events-none absolute rounded-full border-2 border-dashed" style={{ width: 24 * scale, height: 24 * scale, borderColor: spacing ? "#047857" : "#b91c1c" }} /> : null}
            </span>
          ))}
        </div>
        <p className="mt-4 text-xs text-slate-700">Drawn at 2× actual size. Dashed circles: 24 CSS px diameter, centred on each undersized target.</p>
      </div>
      <dl className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-slate-300 p-4 dark:border-slate-700">
          <dt className="text-sm font-semibold">2.5.8 Target Size (Minimum), AA</dt>
          <dd className="mt-2 flex flex-wrap items-center gap-2 text-sm"><Verdict pass={aa} passText="Met" failText="Not met" />{minSize ? "Each target is at least 24 by 24 CSS px." : spacing ? "Met through the spacing exception: the circles do not overlap other targets or circles." : "Too small, and the spacing circles overlap. Enlarge the targets or add space."}</dd>
        </div>
        <div className="rounded-lg border border-slate-300 p-4 dark:border-slate-700">
          <dt className="text-sm font-semibold">2.5.5 Target Size (Enhanced), AAA</dt>
          <dd className="mt-2 flex flex-wrap items-center gap-2 text-sm"><Verdict pass={aaa} passText="Met" failText="Not met" />{aaa ? "At least 44 by 44 CSS px." : "Needs 44 by 44 CSS px; spacing does not count here."}</dd>
        </div>
      </dl>
      <p className="text-sm text-slate-600 dark:text-slate-400">2.5.8 also has exceptions for an equivalent control elsewhere on the page, targets inside a sentence, size set by the browser, and essential presentation. Platform guidance is larger still: Apple suggests 44 by 44 points, Material Design 48 by 48 dp.</p>
      <p aria-live="polite" className="sr-only">{spoken}</p>
    </div>
  )
}
