"use client"
import { useEffect, useRef, useState } from "react"
import { useAnnouncer } from "./use-announcer"
import { Verdict } from "./verdict"
import { wLabel, wRing } from "./ui"

const SIZES = [
  { value: 1, label: "100% (default)" },
  { value: 1.3, label: "130%" },
  { value: 1.6, label: "160%" },
  { value: 2, label: "200%" },
  { value: 3.1, label: "Largest accessibility size (about three times the default)" },
]
const VISITS = [
  { title: "Annual checkup", place: "Riverside clinic, room 4", when: "Tuesday, May 12", time: "9:30 AM" },
  { title: "Physical therapy", place: "Harbor Street clinic", when: "Thursday, May 21", time: "2:15 PM" },
  { title: "Blood test", place: "Riverside clinic, lab", when: "Monday, June 1", time: "8:00 AM" },
]
const BASE = 15
// Tall enough for three lines of text at the default size, and no taller.
const ROW = 80

export function TextScaling({ idPrefix }: { idPrefix: string }) {
  const [scale, setScale] = useState(1)
  const [flexible, setFlexible] = useState(false)
  const screen = useRef<HTMLDivElement>(null)
  const [clipped, setClipped] = useState({ cut: 0, total: 0 })
  useEffect(() => {
    const el = screen.current
    if (!el) return
    const measure = () => {
      const items = [...el.querySelectorAll<HTMLElement>("[data-measure]")]
      const cut = items.filter((item) => item.scrollWidth > item.clientWidth + 1 || item.scrollHeight > item.clientHeight + 1).length
      setClipped((previous) => (previous.cut === cut && previous.total === items.length ? previous : { cut, total: items.length }))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [scale, flexible])
  const size = BASE * scale
  const label = SIZES.find((s) => s.value === scale)?.label ?? ""
  const ok = clipped.cut === 0
  const spoken = useAnnouncer(`Text size ${label}. ${flexible ? "Rows that wrap and grow" : "Fixed-height rows"}. ${ok ? "All text is visible." : `${clipped.cut} of ${clipped.total} labels are cut off.`}`)
  // One line that truncates (fixed layout) or wraps (flexible layout).
  const line = (extra: React.CSSProperties = {}): React.CSSProperties => (flexible ? { overflowWrap: "anywhere", ...extra } : { whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", ...extra })
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${idPrefix}-size`} className={wLabel}>System text size</label>
          <select id={`${idPrefix}-size`} value={scale} onChange={(e) => setScale(Number(e.target.value))} className={`mt-1 block min-h-11 w-full rounded-md border border-slate-500 bg-white px-3 py-2 text-base text-slate-950 dark:bg-slate-900 dark:text-white ${wRing}`}>
            {SIZES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
        <fieldset>
          <legend className={wLabel}>Row layout</legend>
          <div className="mt-1 flex flex-wrap gap-4">
            <label className="flex min-h-11 cursor-pointer items-center gap-2 text-sm"><input type="radio" name={`${idPrefix}-layout`} checked={!flexible} onChange={() => setFlexible(false)} className="h-5 w-5 accent-blue-700" />Fixed height, one line</label>
            <label className="flex min-h-11 cursor-pointer items-center gap-2 text-sm"><input type="radio" name={`${idPrefix}-layout`} checked={flexible} onChange={() => setFlexible(true)} className="h-5 w-5 accent-blue-700" />Wraps and grows</label>
          </div>
        </fieldset>
      </div>
      <div className="rounded-lg border border-slate-300 bg-slate-100 p-4 dark:border-slate-700 dark:bg-slate-900">
        <div className="mx-auto w-full max-w-[20rem] rounded-[1.75rem] border-4 border-slate-800 bg-slate-800 p-1.5">
          <div
            ref={screen}
            tabIndex={0}
            role="group"
            aria-label={`Phone screen preview: appointment list at ${label}. ${flexible ? "Rows wrap and grow; the screen scrolls." : "Rows have a fixed height and one line of text."}`}
            className={`relative h-[30rem] overflow-y-auto overflow-x-hidden rounded-[1.25rem] bg-white text-slate-900 ${wRing}`}
            style={{ fontFamily: "system-ui, sans-serif", fontSize: size, lineHeight: 1.3 }}
          >
            <div data-measure style={{ padding: "12px 14px", background: "#0F766E", color: "#ffffff", fontWeight: 700, fontSize: size * 1.2, ...(flexible ? { overflowWrap: "anywhere" } : { height: 48, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }) }}>Appointments</div>
            <ul role="list" style={{ margin: 0, padding: 0, listStyle: "none" }}>
              {VISITS.map((v) => (
                <li key={v.title} data-measure style={{ display: "flex", flexWrap: flexible ? "wrap" : "nowrap", gap: flexible ? 4 : 10, alignItems: flexible ? "flex-start" : "center", justifyContent: "space-between", padding: "10px 14px", borderBottom: "1px solid #94a3b8", ...(flexible ? { minHeight: ROW } : { height: ROW, overflow: "hidden" }) }}>
                  <div style={{ minWidth: 0, flex: flexible ? "1 1 100%" : "1 1 auto" }}>
                    <p data-measure style={line({ margin: 0, fontWeight: 600 })}>{v.title}</p>
                    <p data-measure style={line({ margin: 0, color: "#334155", fontSize: size * 0.9 })}>{v.place}</p>
                    <p data-measure style={line({ margin: 0, color: "#334155", fontSize: size * 0.9 })}>{v.when}</p>
                  </div>
                  <p data-measure style={flexible ? { margin: 0, fontWeight: 600, color: "#0F5F59" } : { margin: 0, fontWeight: 600, color: "#0F5F59", flex: "0 0 76px", width: 76, whiteSpace: "nowrap", overflow: "hidden", textAlign: "right" }}>{v.time}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <p className="flex flex-wrap items-center gap-2 text-sm"><Verdict pass={ok} passText="All text visible" failText={`${clipped.cut} of ${clipped.total} labels are cut off`} />{ok ? (flexible && scale > 1 ? "The rows grew and the screen scrolls. Nothing is lost." : null) : "An ellipsis or a clipped row hides words that people chose a larger size to read."}</p>
      <p className="text-sm text-slate-600 dark:text-slate-400">Phones let people choose a larger system text size, including extra-large accessibility sizes. Design rows that wrap and grow, let the screen scroll, and check your largest size before handoff.</p>
      <p aria-live="polite" className="sr-only">{spoken}</p>
    </div>
  )
}
