"use client"

import { useId, useRef, useState, type PointerEvent } from "react"

const SCALE = 4 // the pad is drawn 4x actual size
const VIEW = 240 // SVG units; the centre is the aim point
const SIZES = [
  { px: 16, label: "the 16px icon", stroke: "currentColor" },
  { px: 24, label: "a 24px target", stroke: "#b45309" },
  { px: 44, label: "a 44px target", stroke: "#0369a1" },
]

type Tap = { x: number; y: number } // CSS pixels from the aim point

// A normally distributed offset (Box-Muller), so most taps land near the aim and a few stray.
function gaussian(spread: number) {
  const u = 1 - Math.random()
  const v = Math.random()
  const r = Math.sqrt(-2 * Math.log(u)) * spread
  return { x: r * Math.cos(2 * Math.PI * v), y: r * Math.sin(2 * Math.PI * v) }
}

const inside = (t: Tap, px: number) => Math.abs(t.x) <= px / 2 && Math.abs(t.y) <= px / 2
const pct = (n: number, d: number) => (d ? Math.round((n / d) * 100) : 0)

export function TapTest() {
  const [spread, setSpread] = useState(6)
  const [taps, setTaps] = useState<Tap[]>([])
  const [summary, setSummary] = useState("")
  const svgRef = useRef<SVGSVGElement>(null)
  const spreadId = useId()

  const rates = SIZES.map((s) => pct(taps.filter((t) => inside(t, s.px)).length, taps.length))

  const simulate = () => {
    const next = [...taps, ...Array.from({ length: 50 }, () => gaussian(spread))]
    setTaps(next)
    const r = SIZES.map((s) => pct(next.filter((t) => inside(t, s.px)).length, next.length))
    setSummary(`${next.length} taps. ${SIZES.map((s, i) => `${s.px} pixel target: ${r[i]} percent hit`).join(". ")}.`)
  }

  // Real taps and clicks land on the pad too, measured back to actual CSS pixels.
  const onPointerDown = (e: PointerEvent<SVGSVGElement>) => {
    const box = svgRef.current?.getBoundingClientRect()
    if (!box) return
    const ux = ((e.clientX - box.left) / box.width) * VIEW - VIEW / 2
    const uy = ((e.clientY - box.top) / box.height) * VIEW - VIEW / 2
    setTaps((t) => [...t, { x: ux / SCALE, y: uy / SCALE }])
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="min-w-0 space-y-5">
        <p className="text-slate-700 dark:text-slate-300">
          Fingers do not land exactly where people aim. Each simulated tap aims at the centre of the icon and lands a little off,
          more so for a shaky hand, a bumpy bus or a cold thumb. Raise the scatter and watch the 16px icon miss.
        </p>
        <div>
          <label htmlFor={spreadId} className="flex justify-between text-sm font-medium text-slate-900 dark:text-white">
            How far taps scatter <span className="font-mono text-slate-600 dark:text-slate-300">{spread}px</span>
          </label>
          <input
            id={spreadId}
            type="range"
            min={2}
            max={14}
            value={spread}
            aria-valuetext={`${spread} pixels`}
            onChange={(e) => setSpread(Number(e.target.value))}
            className="h-11 w-full cursor-pointer accent-[#0b2545] dark:accent-amber-300"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={simulate} className="min-h-11 rounded-full bg-[#0b2545] px-5 text-sm font-semibold text-white dark:bg-amber-300 dark:text-slate-950">
            Simulate 50 taps
          </button>
          <button
            type="button"
            onClick={() => {
              setTaps([])
              setSummary("Taps cleared.")
            }}
            className="min-h-11 rounded-full border border-slate-500 px-5 text-sm font-semibold text-slate-900 dark:text-white"
          >
            Clear
          </button>
        </div>
        <dl className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-2 rounded-2xl border border-slate-300 p-4 text-sm dark:border-slate-700">
          <dt className="text-slate-700 dark:text-slate-300">Taps so far</dt>
          <dd className="font-mono font-semibold text-slate-900 dark:text-white">{taps.length}</dd>
          {SIZES.map((s, i) => (
            <div key={s.px} className="contents">
              <dt className="text-slate-700 dark:text-slate-300">Landed on {s.label}</dt>
              <dd className="font-mono font-semibold text-slate-900 dark:text-white">{taps.length ? `${rates[i]}%` : "-"}</dd>
            </div>
          ))}
        </dl>
        <p className="text-sm text-slate-600 dark:text-slate-400">You can also tap or click on the pad yourself. It is drawn four times actual size.</p>
        <p className="sr-only" role="status">
          {summary}
        </p>
      </div>

      <div className="min-w-0">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${VIEW} ${VIEW}`}
          role="img"
          aria-label={`Tap plot, four times actual size: ${taps.length} taps around a 16 pixel icon, with 24 and 44 pixel target outlines.`}
          onPointerDown={onPointerDown}
          className="mx-auto block w-full max-w-sm cursor-crosshair touch-manipulation rounded-3xl bg-white text-[#0b2545] ring-1 ring-slate-300 dark:bg-slate-900 dark:text-amber-200 dark:ring-slate-700"
        >
          {SIZES.slice()
            .reverse()
            .map((s) => {
              const side = s.px * SCALE
              return (
                <rect
                  key={s.px}
                  x={VIEW / 2 - side / 2}
                  y={VIEW / 2 - side / 2}
                  width={side}
                  height={side}
                  rx={s.px === 16 ? 8 : 12}
                  fill={s.px === 16 ? "currentColor" : "none"}
                  fillOpacity={s.px === 16 ? 0.15 : 0}
                  stroke={s.stroke}
                  strokeWidth={2}
                  strokeDasharray={s.px === 16 ? undefined : "6 4"}
                />
              )
            })}
          <text x={VIEW / 2} y={VIEW / 2 + 9} textAnchor="middle" fontSize="28" fontWeight="900" fill="currentColor">
            ×
          </text>
          {taps.map((t, i) => {
            const hit16 = inside(t, 16)
            const hit24 = inside(t, 24)
            return (
              <circle
                key={i}
                cx={VIEW / 2 + t.x * SCALE}
                cy={VIEW / 2 + t.y * SCALE}
                r={3}
                fill={hit16 ? "#047857" : hit24 ? "#b45309" : inside(t, 44) ? "#0369a1" : "#be123c"}
              />
            )
          })}
          <text x={10} y={VIEW - 10} fontSize="11" fill="currentColor">
            16px solid · 24px amber · 44px blue
          </text>
        </svg>
      </div>
    </div>
  )
}
