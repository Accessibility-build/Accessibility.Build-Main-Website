"use client"
import { useEffect, useRef, useState } from "react"
import { useAnnouncer } from "./use-announcer"
import { Verdict } from "./verdict"
import { wLabel } from "./ui"

function Layout({ responsive }: { responsive: boolean }) {
  return (
    <div style={{ font: "16px/1.5 system-ui, sans-serif", color: "#111827", minWidth: responsive ? undefined : 900 }}>
      <div style={{ display: "flex", flexWrap: responsive ? "wrap" : "nowrap", gap: 16, alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "#1e3a8a", color: "#fff" }}>
        <strong>Northwind Travel</strong>
        <span style={{ display: "flex", flexWrap: responsive ? "wrap" : "nowrap", gap: 16 }}><span>Flights</span><span>Hotels</span><span>Help</span><span>Sign in</span></span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: responsive ? "repeat(auto-fit, minmax(220px, 1fr))" : "260px 1fr 220px", gap: 16, padding: 16 }}>
        <div style={{ background: "#f1f5f9", padding: 12, borderRadius: 8 }}><strong>Filters</strong><p style={{ margin: "8px 0 0" }}>Price, stops, airline</p></div>
        <div style={{ padding: 12, border: "1px solid #cbd5e1", borderRadius: 8 }}><strong>London to Lisbon</strong><p style={{ margin: "8px 0 0" }}>Departs 08:15, arrives 11:00. Direct. From $142 return including a cabin bag.</p></div>
        <div style={{ background: "#f1f5f9", padding: 12, borderRadius: 8 }}><strong>Your trip</strong><p style={{ margin: "8px 0 0" }}>2 adults, 5 nights</p></div>
      </div>
    </div>
  )
}

export function Reflow({ idPrefix }: { idPrefix: string }) {
  const [width, setWidth] = useState(1280)
  const [responsive, setResponsive] = useState(false)
  const frame = useRef<HTMLDivElement>(null)
  const inner = useRef<HTMLDivElement>(null)
  const [available, setAvailable] = useState(640)
  const [height, setHeight] = useState(300)
  useEffect(() => {
    const el = frame.current, content = inner.current
    if (!el || !content) return
    const ro = new ResizeObserver(() => { setAvailable(el.clientWidth - 16); setHeight(content.offsetHeight) })
    ro.observe(el)
    ro.observe(content)
    return () => ro.disconnect()
  }, [])
  const scale = Math.min(1, available / width)
  const scrolls = !responsive && width < 900
  const zoom = Math.round((1280 / width) * 100)
  const spoken = useAnnouncer(`${width} CSS pixels wide, equivalent to ${zoom} percent zoom on a 1280 pixel window. ${scrolls ? "Needs horizontal scrolling." : "No horizontal scrolling."}`)
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${idPrefix}-width`} className={wLabel}>Viewport width: {width} CSS px (about {zoom}% zoom on a 1280 px window)</label>
          <input id={`${idPrefix}-width`} type="range" min={320} max={1280} step={10} value={width} onChange={(e) => setWidth(Number(e.target.value))} className="mt-3 w-full accent-blue-700" />
        </div>
        <fieldset>
          <legend className={wLabel}>Layout</legend>
          <div className="mt-1 flex flex-wrap gap-4">
            <label className="flex min-h-11 cursor-pointer items-center gap-2 text-sm"><input type="radio" name={`${idPrefix}-layout`} checked={!responsive} onChange={() => setResponsive(false)} className="h-5 w-5 accent-blue-700" />Fixed three columns</label>
            <label className="flex min-h-11 cursor-pointer items-center gap-2 text-sm"><input type="radio" name={`${idPrefix}-layout`} checked={responsive} onChange={() => setResponsive(true)} className="h-5 w-5 accent-blue-700" />Responsive</label>
          </div>
        </fieldset>
      </div>
      <div ref={frame} className="rounded-lg border border-slate-300 bg-slate-100 p-2 dark:border-slate-700 dark:bg-slate-900">
        <div style={{ width: width * scale, height: height * scale }} className="mx-auto overflow-hidden">
          <div ref={inner} aria-label={`Preview of a travel search page at ${width} CSS pixels wide, scaled to fit. ${scrolls ? "The right side of the layout is cut off." : "All content fits the width."}`} role="img" className="overflow-hidden bg-white" style={{ width, transform: `scale(${scale})`, transformOrigin: "top left", outline: scrolls ? "3px dashed #b91c1c" : undefined, outlineOffset: -3 }}>
            <div style={{ overflow: "hidden", width }}><Layout responsive={responsive} /></div>
          </div>
        </div>
      </div>
      <p className="flex flex-wrap items-center gap-2 text-sm"><Verdict pass={!scrolls} passText="Reflows: no horizontal scrolling" failText="Content is cut off: horizontal scrolling needed" />{scrolls ? "The dashed outline marks the visible viewport; the fixed layout is 900 px wide." : null}</p>
      <p className="text-sm text-slate-600 dark:text-slate-400">1.4.10 Reflow (AA) asks that content works at 320 CSS px wide without scrolling in two directions, which is what a 1280 px window shows at 400% zoom. Data tables, maps and diagrams that need two dimensions are excepted.</p>
      <p aria-live="polite" className="sr-only">{spoken}</p>
    </div>
  )
}
