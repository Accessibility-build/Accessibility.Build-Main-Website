"use client"
import { useState } from "react"
import { contrast, formatRatio, parseHex, toHex } from "./color"
import { useAnnouncer } from "./use-announcer"
import { Verdict } from "./verdict"
import { wLabel, wRing } from "./ui"

type Background = "none" | "translucent" | "solid"
type Position = "over" | "above" | "top"

const CAPTION = "[door closes] See you at ten tomorrow."
const TEXT = "#ffffff"
const SCENES = [
  { id: "light", name: "Bright scene", color: "#DCE6EA", shape: "#F5F9FB" },
  { id: "dark", name: "Dark scene", color: "#1B2733", shape: "#2A3A4A" },
]
const SIZES = [
  { value: 16, label: "Small, 16 px" },
  { value: 20, label: "Medium, 20 px" },
  { value: 28, label: "Large, 28 px" },
]
const BACKGROUNDS: Array<{ value: Background; label: string; alpha: number }> = [
  { value: "none", label: "None", alpha: 0 },
  { value: "translucent", label: "Translucent black, 40%", alpha: 0.4 },
  { value: "solid", label: "Solid black", alpha: 1 },
]
const POSITIONS: Array<{ value: Position; label: string }> = [
  { value: "over", label: "Bottom, over the controls" },
  { value: "above", label: "Bottom, above the controls" },
  { value: "top", label: "Top" },
]
const CONTROLS = 40

/** The color actually behind the caption text: black at the chosen opacity over the scene. */
function behind(scene: string, alpha: number) {
  const rgb = parseHex(scene) ?? [0, 0, 0]
  return toHex(rgb.map((c) => c * (1 - alpha)) as [number, number, number])
}

export function CaptionStyler({ idPrefix }: { idPrefix: string }) {
  const [size, setSize] = useState(16)
  const [background, setBackground] = useState<Background>("none")
  const [position, setPosition] = useState<Position>("over")
  const alpha = BACKGROUNDS.find((b) => b.value === background)?.alpha ?? 0
  // Large-scale text starts at 24 CSS px at regular weight, where 3:1 is enough.
  const threshold = size >= 24 ? 3 : 4.5
  const results = SCENES.map((scene) => {
    const ratio = contrast(TEXT, behind(scene.color, alpha)) ?? 1
    return { ...scene, ratio, pass: ratio >= threshold }
  })
  const covers = position === "over"
  const spoken = useAnnouncer(`${results.map((r) => `${r.name}: ${formatRatio(r.ratio)}, ${r.pass ? "passes" : "fails"}`).join(". ")}. ${covers ? "The caption covers the player controls." : "The controls stay clear."}`)
  const select = `mt-1 block min-h-11 w-full rounded-md border border-slate-500 bg-white px-3 py-2 text-base text-slate-950 dark:bg-slate-900 dark:text-white ${wRing}`
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor={`${idPrefix}-size`} className={wLabel}>Caption text size</label>
          <select id={`${idPrefix}-size`} value={size} onChange={(e) => setSize(Number(e.target.value))} className={select}>{SIZES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}</select>
        </div>
        <div>
          <label htmlFor={`${idPrefix}-bg`} className={wLabel}>Caption background</label>
          <select id={`${idPrefix}-bg`} value={background} onChange={(e) => setBackground(e.target.value as Background)} className={select}>{BACKGROUNDS.map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}</select>
        </div>
        <div>
          <label htmlFor={`${idPrefix}-pos`} className={wLabel}>Caption position</label>
          <select id={`${idPrefix}-pos`} value={position} onChange={(e) => setPosition(e.target.value as Position)} className={select}>{POSITIONS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}</select>
        </div>
      </div>
      <ul role="list" className="grid gap-4 md:grid-cols-2">
        {results.map((scene) => (
          <li key={scene.id} className="space-y-2">
            <div
              role="img"
              aria-label={`Video frame, ${scene.name.toLowerCase()}. White caption text at ${size} pixels with ${background === "none" ? "no background" : background === "solid" ? "a solid black background" : "a translucent black background"}, ${position === "top" ? "at the top" : position === "above" ? "above the player controls" : "on top of the player controls"}.`}
              className="relative aspect-video w-full overflow-hidden rounded-lg border border-slate-400"
              style={{ background: scene.color, fontFamily: "system-ui, sans-serif" }}
            >
              <span aria-hidden="true" className="absolute rounded-full" style={{ left: "8%", top: "30%", width: "22%", height: "38%", background: scene.shape }} />
              <span aria-hidden="true" className="absolute rounded-md" style={{ right: "10%", top: "24%", width: "30%", height: "30%", background: scene.shape }} />
              <span aria-hidden="true" className="absolute inset-x-0 bottom-0 flex items-center gap-3 px-3" style={{ height: CONTROLS, background: "#0b1220", color: "#ffffff" }}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M7 4v16l13-8z" /></svg>
                <span className="h-1 flex-1 rounded-full" style={{ background: "#94a3b8" }}><span className="block h-1 w-1/3 rounded-full" style={{ background: "#ffffff" }} /></span>
                <span className="rounded border border-white px-1 text-xs font-bold">CC</span>
              </span>
              <span
                aria-hidden="true"
                className="absolute left-1/2 max-w-[92%] -translate-x-1/2 rounded px-2 py-0.5 text-center"
                style={{ color: TEXT, fontSize: size, lineHeight: 1.3, background: `rgba(0,0,0,${alpha})`, ...(position === "top" ? { top: 10 } : { bottom: position === "above" ? CONTROLS + 8 : 6 }) }}
              >{CAPTION}</span>
            </div>
            <p className="flex flex-wrap items-center gap-2 text-sm"><span className="font-semibold">{scene.name}:</span> {formatRatio(scene.ratio)} <Verdict pass={scene.pass} passText={`Meets ${threshold}:1`} failText={`Below ${threshold}:1`} /></p>
          </li>
        ))}
      </ul>
      <p className="flex flex-wrap items-center gap-2 text-sm"><Verdict pass={!covers} passText="Controls stay clear" failText="Caption covers the player controls" />{position === "top" ? "At the top, check that captions do not cover faces or on-screen text." : null}</p>
      <p className="text-sm text-slate-600 dark:text-slate-400">The verdicts use the 1.4.3 Contrast (Minimum) thresholds for white caption text against what is directly behind it: 4.5:1, or 3:1 for large text (24 CSS px and up at regular weight). Footage changes from shot to shot, so a caption style has to work on the brightest frame, not only the darkest.</p>
      <p aria-live="polite" className="sr-only">{spoken}</p>
    </div>
  )
}
