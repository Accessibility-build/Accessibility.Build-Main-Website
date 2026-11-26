"use client"
import { useId, useRef, useState } from "react"
import { Check, CircleAlert, RotateCcw, Search, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { AUDIT_ICONS, wrapAuditText } from "@/lib/courses/audit-svg"
import type { AuditElement } from "@/lib/courses/types"

const ring = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-300 dark:focus-visible:ring-offset-slate-950"
const btn = cn("inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-500 bg-white px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-slate-50 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800", ring)
const primary = cn(btn, "border-blue-700 bg-blue-700 text-white hover:bg-blue-800 dark:border-blue-400 dark:bg-blue-400 dark:text-slate-950 dark:hover:bg-blue-300")

const ICONS = AUDIT_ICONS
const wrap = wrapAuditText

function Shape({ e, uid }: { e: AuditElement; uid: string }) {
  const size = e.size ?? 16
  const font = { fontFamily: "system-ui, sans-serif", fontSize: size, fontWeight: e.weight ?? 400, fill: e.color ?? "#111827" }
  const label = (t: string, anchor: "start" | "middle", x: number) => {
    const lines = wrap(t, e.w - (anchor === "start" ? 24 : 16), size)
    const lh = size * 1.3
    const top = e.y + e.h / 2 - ((lines.length - 1) * lh) / 2 + size * 0.35
    return <text {...font} textAnchor={anchor}>{lines.map((l, i) => <tspan key={i} x={x} y={top + i * lh}>{l}</tspan>)}</text>
  }
  switch (e.kind) {
    case "box":
      return <g><rect x={e.x} y={e.y} width={e.w} height={e.h} rx={e.radius ?? 0} fill={e.fill ?? "#f9fafb"} stroke={e.stroke ?? "none"} strokeWidth={e.strokeWidth ?? 1} />{e.text ? label(e.text, e.align ?? "start", e.align === "middle" ? e.x + e.w / 2 : e.x + 12) : null}</g>
    case "text": {
      const lines = wrap(e.text ?? "", e.w, size)
      const anchor = e.align ?? "start"
      const x = anchor === "middle" ? e.x + e.w / 2 : e.x
      return <text {...font} textAnchor={anchor}>{lines.map((l, i) => <tspan key={i} x={x} y={e.y + size + i * size * 1.3}>{l}</tspan>)}</text>
    }
    case "button":
      return <g><rect x={e.x} y={e.y} width={e.w} height={e.h} rx={e.radius ?? 6} fill={e.fill ?? "#1d4ed8"} stroke={e.stroke ?? "none"} strokeWidth={e.strokeWidth ?? 1} />{label(e.text ?? "", "middle", e.x + e.w / 2)}</g>
    case "input":
      return <g><rect x={e.x} y={e.y} width={e.w} height={e.h} rx={e.radius ?? 4} fill={e.fill ?? "#ffffff"} stroke={e.stroke ?? "#6b7280"} strokeWidth={e.strokeWidth ?? 1} /><text {...font} fill={e.color ?? (e.value ? "#111827" : "#6b7280")} x={e.x + 12} y={e.y + e.h / 2 + size * 0.35}>{e.value ?? e.placeholder ?? ""}</text></g>
    case "icon": {
      const s = Math.min(e.w, e.h) * (e.fill ? 0.6 : 0.9)
      return <g>{e.fill ? <rect x={e.x} y={e.y} width={e.w} height={e.h} rx={e.radius ?? 6} fill={e.fill} /> : null}<g transform={`translate(${e.x + (e.w - s) / 2} ${e.y + (e.h - s) / 2}) scale(${s / 24})`}><path d={ICONS[e.icon ?? "info"] ?? ICONS.info} fill="none" stroke={e.color ?? "#111827"} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></g></g>
    }
    case "image":
      return <g><defs><linearGradient id={`${uid}-g-${e.id}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={e.fill ?? "#93c5fd"} /><stop offset="1" stopColor="#1e3a8a" stopOpacity="0.55" /></linearGradient></defs><rect x={e.x} y={e.y} width={e.w} height={e.h} rx={e.radius ?? 8} fill={`url(#${uid}-g-${e.id})`} /><path d={`M${e.x + e.w * 0.15} ${e.y + e.h * 0.8} L${e.x + e.w * 0.4} ${e.y + e.h * 0.45} L${e.x + e.w * 0.55} ${e.y + e.h * 0.62} L${e.x + e.w * 0.7} ${e.y + e.h * 0.38} L${e.x + e.w * 0.88} ${e.y + e.h * 0.8} Z`} fill="#ffffff" fillOpacity="0.55" />{e.text ? label(e.text, "middle", e.x + e.w / 2) : null}</g>
    case "bar":
      return <g>{e.pattern ? <defs><pattern id={`${uid}-p-${e.id}`} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform={e.pattern === "stripes" ? "rotate(45)" : undefined}><rect width="8" height="8" fill={e.fill ?? "#2563eb"} />{e.pattern === "stripes" ? <rect width="3" height="8" fill="#ffffff" fillOpacity="0.7" /> : <circle cx="4" cy="4" r="1.6" fill="#ffffff" fillOpacity="0.8" />}</pattern></defs> : null}<rect x={e.x} y={e.y} width={e.w} height={e.h} fill={e.pattern ? `url(#${uid}-p-${e.id})` : e.fill ?? "#2563eb"} stroke={e.stroke ?? "none"} /></g>
    case "line":
      return <line x1={e.x} y1={e.y} x2={e.x + e.w} y2={e.y + e.h} stroke={e.stroke ?? "#d1d5db"} strokeWidth={e.strokeWidth ?? 1} />
  }
}

type Outcome = "found" | "missed" | "wrong" | "ok"

export function DesignAudit({ title, intro, alt, canvas, elements, headingId }: { title: string; intro: string; alt: string; canvas: { w: number; h: number; bg?: string }; elements: AuditElement[]; headingId: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "")
  const [selected, setSelected] = useState<string[]>([])
  const [checked, setChecked] = useState(false)
  const resultRef = useRef<HTMLHeadingElement>(null)
  const selectable = elements.filter((e) => e.selectable !== false)
  const issues = selectable.filter((e) => e.issue)
  const toggle = (id: string) => { if (checked) return; setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id])) }
  const outcome = (e: AuditElement): Outcome => (e.issue ? (selected.includes(e.id) ? "found" : "missed") : selected.includes(e.id) ? "wrong" : "ok")
  const found = issues.filter((e) => selected.includes(e.id))
  const wrong = selectable.filter((e) => !e.issue && selected.includes(e.id))
  const missed = issues.filter((e) => !selected.includes(e.id))
  const markerFor = (o: Outcome) => (o === "found" ? { Icon: Check, label: "Found", cls: "bg-emerald-700 text-white" } : o === "missed" ? { Icon: CircleAlert, label: "Missed", cls: "bg-red-700 text-white" } : o === "wrong" ? { Icon: X, label: "Fine", cls: "bg-slate-700 text-white" } : null)

  return (
    <section aria-labelledby={headingId} className="max-w-[72rem] rounded-xl border border-indigo-300 bg-indigo-50/40 p-4 dark:border-indigo-800 dark:bg-indigo-950/30 sm:p-6">
      <p aria-hidden="true" className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-800 dark:text-indigo-200"><Search aria-hidden="true" className="h-4 w-4" />Spot the issues</p>
      <h3 id={headingId} className="mt-1 scroll-mt-4 text-xl font-semibold text-slate-900 dark:text-white"><span className="sr-only">Design audit: </span>{title}</h3>
      <p className="mt-2 max-w-[46rem] text-base leading-relaxed">{intro}</p>
      <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">Select each element you think has an accessibility problem, in the drawing or in the list below it, then check your audit.</p>

      {/* The drawing is a pointer shortcut; the checkbox list below is the full control for every input method. */}
      <div className="mx-auto mt-5 max-w-5xl overflow-hidden rounded-lg border border-slate-300 bg-white dark:border-slate-700">
        <svg role="img" aria-label={`Screen to audit: ${title}. ${alt}`} viewBox={`0 0 ${canvas.w} ${canvas.h}`} className="block h-auto w-full">
          <rect width={canvas.w} height={canvas.h} fill={canvas.bg ?? "#ffffff"} />
          {elements.map((e) => <Shape key={e.id} e={e} uid={uid} />)}
          {selectable.map((e) => {
            const isSel = selected.includes(e.id)
            const marker = checked ? markerFor(outcome(e)) : null
            const pad = 4
            return (
              <g key={e.id} onClick={() => toggle(e.id)} style={{ cursor: checked ? "default" : "pointer" }}>
                <rect x={e.x - pad} y={e.y - pad} width={e.w + pad * 2} height={Math.max(e.h, 1) + pad * 2} rx="6" fill="transparent" stroke={isSel ? "#d97706" : "transparent"} strokeWidth={isSel ? 4 : 0} className={checked ? undefined : "hover:stroke-slate-500"} />
                {isSel && !checked ? <g><circle cx={Math.min(e.x + e.w + pad, canvas.w - 12)} cy={Math.max(e.y - pad, 12)} r="11" fill="#d97706" /><text x={Math.min(e.x + e.w + pad, canvas.w - 12)} y={Math.max(e.y - pad, 12) + 4} textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="12" fontWeight="700" fill="#111827">{selected.indexOf(e.id) + 1}</text></g> : null}
                {marker ? (() => { const w = marker.label.length * 7.5 + 22; const x = Math.min(e.x + e.w + pad - w / 2, canvas.w - w - 2); const y = Math.max(e.y - pad - 12, 2); return <g><rect x={x} y={y} width={w} height="22" rx="11" fill={outcome(e) === "found" ? "#047857" : outcome(e) === "missed" ? "#b91c1c" : "#334155"} /><text x={x + w / 2} y={y + 15} textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="12" fontWeight="700" fill="#ffffff">{outcome(e) === "found" ? "✓ " : outcome(e) === "missed" ? "! " : "× "}{marker.label}</text></g> })() : null}
              </g>
            )
          })}
        </svg>
      </div>

      <fieldset className="mt-4 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-950">
        <legend className="px-1 font-semibold">Elements in the screen ({selected.length} selected)</legend>
        <p className="text-sm text-slate-600 dark:text-slate-400">Tick the elements with a problem here, or select them in the drawing.</p>
        <div className="mt-2 grid gap-x-6 md:grid-cols-2 2xl:grid-cols-3">
          {selectable.map((e) => {
            const o = checked ? outcome(e) : null
            return (
              <label key={e.id} className="flex min-h-11 cursor-pointer items-start gap-3 py-1 text-sm">
                <input type="checkbox" className="mt-0.5 h-5 w-5 shrink-0 accent-blue-700" checked={selected.includes(e.id)} disabled={checked} onChange={() => toggle(e.id)} />
                <span>{e.name}{o && o !== "ok" ? <span className={cn("ml-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold", o === "found" ? "bg-emerald-50 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-100" : o === "missed" ? "bg-red-50 text-red-900 dark:bg-red-950 dark:text-red-100" : "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100")}>{o === "found" ? "Issue found" : o === "missed" ? "Issue missed" : "Fine"}</span> : null}</span>
              </label>
            )
          })}
        </div>
      </fieldset>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {!checked ? <button type="button" className={primary} onClick={() => { setChecked(true); requestAnimationFrame(() => resultRef.current?.focus()) }}>Check my audit ({selected.length} selected)</button> : null}
        <button type="button" className={btn} onClick={() => { setSelected([]); setChecked(false) }}><RotateCcw aria-hidden="true" className="h-4 w-4" />Start again</button>
      </div>

      {checked ? (
        <div className="mt-5 space-y-4">
          <h4 ref={resultRef} tabIndex={-1} className="text-lg font-bold text-slate-900 focus-visible:outline-none dark:text-white">You found {found.length} of {issues.length} issues{wrong.length ? ` and flagged ${wrong.length} ${wrong.length === 1 ? "element that is" : "elements that are"} fine` : ""}.</h4>
          {[["Issues you found", found, "found"], ["Issues you missed", missed, "missed"]].map(([heading, list, kind]) => (list as AuditElement[]).length ? (
            <div key={heading as string}>
              <h5 className="flex items-center gap-2 font-semibold">{kind === "found" ? <Check aria-hidden="true" className="h-4 w-4 text-emerald-700 dark:text-emerald-400" /> : <CircleAlert aria-hidden="true" className="h-4 w-4 text-red-700 dark:text-red-400" />}{heading as string}</h5>
              <ul className="mt-2 space-y-3">
                {(list as AuditElement[]).map((e) => (
                  <li key={e.id} className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
                    <p className="font-semibold text-slate-900 dark:text-white">{e.issue!.title} <span className="font-normal text-slate-600 dark:text-slate-400">· {e.issue!.sc}</span></p>
                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{e.name}</p>
                    <p className="mt-2 text-base leading-relaxed">{e.issue!.explanation}</p>
                  </li>
                ))}
              </ul>
            </div>
          ) : null)}
          {wrong.length ? (
            <div>
              <h5 className="flex items-center gap-2 font-semibold"><X aria-hidden="true" className="h-4 w-4" />Selected, but fine</h5>
              <ul className="mt-2 list-disc space-y-1 pl-6 text-sm">{wrong.map((e) => <li key={e.id}>{e.name}</li>)}</ul>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  )
}
