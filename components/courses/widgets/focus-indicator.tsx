"use client"
import { useId, useState } from "react"
import { contrast, formatRatio } from "./color"
import { useAnnouncer } from "./use-announcer"
import { Verdict } from "./verdict"
import { wInput, wLabel } from "./ui"

const BACKGROUNDS = [
  { id: "white", label: "White page", bg: "#ffffff", text: "#111827", btn: "#1d4ed8", btnText: "#ffffff" },
  { id: "navy", label: "Dark navy band", bg: "#1e293b", text: "#f8fafc", btn: "#f8fafc", btnText: "#0f172a" },
  { id: "brand", label: "Brand blue band", bg: "#2563eb", text: "#ffffff", btn: "#ffffff", btnText: "#1e3a8a" },
]
type Style = "solid" | "dashed" | "two-tone"

export function FocusIndicator({ idPrefix }: { idPrefix: string }) {
  const scope = `fi-${useId().replace(/[^a-zA-Z0-9]/g, "")}`
  const [width, setWidth] = useState(2)
  const [offset, setOffset] = useState(2)
  const [color, setColor] = useState("#2563eb")
  const [style, setStyle] = useState<Style>("solid")
  const twoTone = style === "two-tone"
  // Two-tone: a dark outline plus a white halo, so one of the two meets 3:1 on any background.
  const ring = twoTone
    ? `outline: ${width}px solid #0b1f3a; outline-offset: ${offset}px; box-shadow: 0 0 0 ${offset + width + 2}px #ffffff;`
    : `outline: ${width}px ${style} ${color}; outline-offset: ${offset}px;`
  const css = `.${scope} .fi-target:focus { outline: none; } .${scope} .fi-target:focus-visible, .${scope} .fi-target.fi-forced { ${ring} }`
  const results = BACKGROUNDS.map((b) => {
    const r = twoTone ? Math.max(contrast("#0b1f3a", b.bg) ?? 1, contrast("#ffffff", b.bg) ?? 1) : contrast(color, b.bg) ?? 1
    return { ...b, ratio: r, pass: r >= 3 }
  })
  const thick = width >= 2
  const spoken = useAnnouncer(`${results.filter((r) => r.pass).length} of 3 backgrounds reach 3 to 1. Thickness ${width} pixels.`)
  return (
    <div className={`${scope} space-y-4`}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label htmlFor={`${idPrefix}-w`} className={wLabel}>Thickness: {width} px</label>
          <input id={`${idPrefix}-w`} type="range" min={1} max={6} value={width} onChange={(e) => setWidth(Number(e.target.value))} className="mt-3 w-full accent-blue-700" />
        </div>
        <div>
          <label htmlFor={`${idPrefix}-o`} className={wLabel}>Offset: {offset} px</label>
          <input id={`${idPrefix}-o`} type="range" min={0} max={6} value={offset} onChange={(e) => setOffset(Number(e.target.value))} className="mt-3 w-full accent-blue-700" />
        </div>
        <div>
          <label htmlFor={`${idPrefix}-s`} className={wLabel}>Style</label>
          <select id={`${idPrefix}-s`} value={style} onChange={(e) => setStyle(e.target.value as Style)} className={wInput}>
            <option value="solid">Solid outline</option>
            <option value="dashed">Dashed outline</option>
            <option value="two-tone">Two-tone ring (dark and white)</option>
          </select>
        </div>
        <div>
          <label htmlFor={`${idPrefix}-c`} className={wLabel}>Color{twoTone ? " (fixed for two-tone)" : ""}</label>
          <input id={`${idPrefix}-c`} type="color" value={color} disabled={twoTone} onChange={(e) => setColor(e.target.value)} className="mt-1 h-11 w-full cursor-pointer rounded-md border border-slate-500 bg-white p-1 disabled:opacity-50 dark:bg-slate-900" />
        </div>
      </div>
      <ul role="list" className="grid gap-3 md:grid-cols-3">
        {results.map((b) => (
          <li key={b.id} className="overflow-hidden rounded-lg border border-slate-300 dark:border-slate-700">
            <div className="flex flex-wrap items-center gap-4 p-5" style={{ background: b.bg, color: b.text }}>
              <span className="fi-target fi-forced inline-flex min-h-11 items-center rounded-md px-4 text-sm font-semibold" style={{ background: b.btn, color: b.btnText }}>Focused</span>
              <button type="button" className="fi-target inline-flex min-h-11 items-center rounded-md px-4 text-sm font-semibold" style={{ background: b.btn, color: b.btnText }}>Tab to me</button>
            </div>
            <div className="space-y-1 p-3 text-sm">
              <p className="font-semibold">{b.label}</p>
              <p className="flex flex-wrap items-center gap-2">Indicator against background: <span className="tabular-nums">{formatRatio(b.ratio)}</span> <Verdict pass={b.pass} passText="3:1 met" failText="Below 3:1" /></p>
            </div>
          </li>
        ))}
      </ul>
      <p className="flex flex-wrap items-center gap-2 text-sm">Thickness of at least 2 CSS px (one input to 2.4.13 Focus Appearance, AAA): <Verdict pass={thick} passText="Yes" failText="No" /></p>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        The left control in each panel shows the focus style permanently. Press Tab to reach the right control and see it live. 2.4.7 Focus Visible (AA) only asks that focus is visible; aiming for 3:1 against adjacent colors and at least 2 px follows 2.4.13 and 1.4.11, and works on any background when you use a two-tone ring.
      </p>
      <p aria-live="polite" className="sr-only">{spoken}</p>
    </div>
  )
}
