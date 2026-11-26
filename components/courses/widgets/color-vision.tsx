"use client"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { wLabel } from "./ui"

// Widely used linear approximations (Viénot/Brettel style). Real color vision varies; this is a design aid only.
const MODES = [
  { id: "none", label: "Typical color vision", matrix: null },
  { id: "protanopia", label: "Protanopia (no red cones)", matrix: "0.567 0.433 0 0 0 0.558 0.442 0 0 0 0 0.242 0.758 0 0 0 0 0 1 0" },
  { id: "deuteranopia", label: "Deuteranopia (no green cones)", matrix: "0.625 0.375 0 0 0 0.7 0.3 0 0 0 0 0.3 0.7 0 0 0 0 0 1 0" },
  { id: "tritanopia", label: "Tritanopia (no blue cones)", matrix: "0.95 0.05 0 0 0 0 0.433 0.567 0 0 0 0.475 0.525 0 0 0 0 0 1 0" },
  { id: "achromatopsia", label: "Achromatopsia (no color)", matrix: "0.299 0.587 0.114 0 0 0.299 0.587 0.114 0 0 0.299 0.587 0.114 0 0 0 0 0 1 0" },
] as const

const SCENES = {
  chart: "Bar chart of quarterly sales for two regions",
  status: "List of three deployment statuses",
  form: "Sign-up form with one field in error",
  links: "Paragraph with two links",
} as const
type Scene = keyof typeof SCENES

function SceneSvg({ scene, cues, pid }: { scene: Scene; cues: boolean; pid: string }) {
  const t = { fontFamily: "system-ui, sans-serif", fontSize: 14, fill: "#1f2937" }
  if (scene === "chart") {
    const north = [60, 90, 75, 110], south = [80, 70, 100, 95]
    return (
      <svg viewBox="0 0 360 220" className="h-auto w-full">
        {cues ? <defs><pattern id={pid} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="6" height="6" fill="#16a34a" /><rect width="3" height="6" fill="#ffffff" /></pattern></defs> : null}
        <line x1="40" y1="170" x2="340" y2="170" stroke="#4b5563" />
        {north.map((h, i) => <rect key={`n${i}`} x={52 + i * 72} y={170 - h} width="24" height={h} fill="#dc2626" />)}
        {south.map((h, i) => <rect key={`s${i}`} x={78 + i * 72} y={170 - h} width="24" height={h} fill={cues ? `url(#${pid})` : "#16a34a"} stroke={cues ? "#166534" : "none"} />)}
        {["Q1", "Q2", "Q3", "Q4"].map((q, i) => <text key={q} x={66 + i * 72} y="190" {...t}>{q}</text>)}
        {cues ? (
          <>
            {north.map((h, i) => <text key={`nl${i}`} x={56 + i * 72} y={164 - h} {...t} fontSize="11">N</text>)}
            {south.map((h, i) => <text key={`sl${i}`} x={83 + i * 72} y={164 - south[i]} {...t} fontSize="11">S</text>)}
          </>
        ) : null}
        <rect x="60" y="202" width="14" height="14" fill="#dc2626" /><text x="80" y="214" {...t}>North{cues ? " (N, solid)" : ""}</text>
        <rect x="200" y="202" width="14" height="14" fill={cues ? `url(#${pid})` : "#16a34a"} stroke={cues ? "#166534" : "none"} /><text x="220" y="214" {...t}>South{cues ? " (S, striped)" : ""}</text>
      </svg>
    )
  }
  if (scene === "status") {
    const rows = [["API", "#16a34a", "Healthy", "✓"], ["Website", "#dc2626", "Down", "✕"], ["Search", "#ca8a04", "Degraded", "!"]] as const
    return (
      <svg viewBox="0 0 360 170" className="h-auto w-full">
        {rows.map(([name, color, label, glyph], i) => (
          <g key={name} transform={`translate(20 ${25 + i * 48})`}>
            <rect width="320" height="38" rx="6" fill="#f9fafb" stroke="#d1d5db" />
            <circle cx="22" cy="19" r="9" fill={color} />
            {cues ? <text x="17.5" y="24" fontFamily="system-ui, sans-serif" fontSize="13" fontWeight="700" fill="#ffffff">{glyph}</text> : null}
            <text x="42" y="24" {...t} fontWeight="600">{name}</text>
            {cues ? <text x="200" y="24" {...t}>{label}</text> : null}
          </g>
        ))}
      </svg>
    )
  }
  if (scene === "form") {
    return (
      <svg viewBox="0 0 360 200" className="h-auto w-full">
        <text x="20" y="30" {...t} fontWeight="600">Email</text>
        <rect x="20" y="40" width="320" height="38" rx="4" fill="#fff" stroke="#6b7280" strokeWidth="1.5" />
        <text x="32" y="64" {...t}>sam@example.com</text>
        <text x="20" y="110" {...t} fontWeight="600">Phone</text>
        <rect x="20" y="120" width="320" height="38" rx="4" fill="#fff" stroke="#dc2626" strokeWidth={cues ? 2.5 : 1.5} />
        <text x="32" y="144" {...t}>12345</text>
        {cues ? <><circle cx="29" cy="178" r="8" fill="#b91c1c" /><text x="26" y="183" fontFamily="system-ui, sans-serif" fontSize="12" fontWeight="700" fill="#fff">!</text><text x="44" y="183" {...t} fill="#b91c1c">Enter a phone number with 10 digits</text></> : null}
      </svg>
    )
  }
  return (
    <svg viewBox="0 0 360 120" className="h-auto w-full">
      <text x="20" y="40" {...t}>Read our <tspan fill="#2563eb" textDecoration={cues ? "underline" : undefined}>returns policy</tspan> before you</text>
      <text x="20" y="64" {...t}>send items back, or <tspan fill="#2563eb" textDecoration={cues ? "underline" : undefined}>contact support</tspan>.</text>
    </svg>
  )
}

export function ColorVision({ preset, idPrefix }: { preset?: Record<string, string>; idPrefix: string }) {
  const scene: Scene = preset?.scene && preset.scene in SCENES ? (preset.scene as Scene) : "chart"
  const [mode, setMode] = useState<string>("deuteranopia")
  const [cues, setCues] = useState(false)
  const [all, setAll] = useState(false)
  const fid = (id: string) => `${idPrefix}-cv-${id}`.replace(/[^a-zA-Z0-9_-]/g, "")
  const shown = all ? MODES : MODES.filter((m) => m.id === "none" || m.id === mode)
  return (
    <div className="space-y-4">
      <svg aria-hidden="true" focusable="false" className="absolute h-0 w-0">
        <defs>{MODES.filter((m) => m.matrix).map((m) => <filter key={m.id} id={fid(m.id)} colorInterpolationFilters="linearRGB"><feColorMatrix type="matrix" values={m.matrix!} /></filter>)}</defs>
      </svg>
      <div className="grid gap-4 sm:grid-cols-2">
        <fieldset>
          <legend className={wLabel}>Simulate</legend>
          <div className="mt-2 space-y-1">
            {MODES.filter((m) => m.matrix).map((m) => (
              <label key={m.id} className="flex min-h-11 cursor-pointer items-center gap-3 text-sm">
                <input type="radio" name={`${idPrefix}-mode`} value={m.id} checked={mode === m.id} disabled={all} onChange={() => setMode(m.id)} className="h-5 w-5 accent-blue-700" />{m.label}
              </label>
            ))}
          </div>
        </fieldset>
        <div className="space-y-1">
          <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm font-semibold"><input type="checkbox" checked={cues} onChange={(e) => setCues(e.target.checked)} className="h-5 w-5 accent-blue-700" />Add non-color cues (text, icons, patterns, underlines)</label>
          <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm font-semibold"><input type="checkbox" checked={all} onChange={(e) => setAll(e.target.checked)} className="h-5 w-5 accent-blue-700" />Show all simulations side by side</label>
        </div>
      </div>
      <ul role="list" className={cn("grid gap-4", shown.length > 1 && "sm:grid-cols-2")} aria-label={`${SCENES[scene]}, ${cues ? "with" : "without"} non-color cues`}>
        {shown.map((m) => (
          <li key={m.id} className="overflow-hidden rounded-lg border border-slate-300 dark:border-slate-700">
            <p className="border-b border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold dark:border-slate-800 dark:bg-slate-900">{m.label}</p>
            <div className="bg-white p-3" style={m.matrix ? { filter: `url(#${fid(m.id)})` } : undefined} role="img" aria-label={`${SCENES[scene]} as seen with ${m.label.toLowerCase()}`}>
              <SceneSvg scene={scene} cues={cues} pid={fid(`stripe-${m.id}`)} />
            </div>
          </li>
        ))}
      </ul>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        {cues
          ? "With text, icons, patterns or underlines, the information survives every simulation, including no color at all. That is what 1.4.1 Use of Color asks for."
          : "Compare the panels: when color is the only cue, some simulations make the categories hard or impossible to tell apart. Turn on non-color cues to see the difference."}
        {" "}Simulations are approximations. They help you spot problems; they cannot show how any individual sees.
      </p>
      <p className="sr-only" aria-live="polite">{cues ? "Non-color cues are on." : "Non-color cues are off."}</p>
    </div>
  )
}

