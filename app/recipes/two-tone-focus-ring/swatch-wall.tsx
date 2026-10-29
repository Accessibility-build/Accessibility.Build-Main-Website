"use client"

import { useId, useState } from "react"
import { cn } from "@/lib/utils"
import { useLab } from "./lab-context"
import { BLUE, NON_TEXT_MIN, contrastRatioWCAG, formatRatio, readableOn, twoTone } from "./ring-math"
import styles from "./rings.module.css"

type Swatch = { name: string; hex: string } | { name: string; gradient: string }

const SWATCHES: Swatch[] = [
  { name: "Paper", hex: "#ffffff" },
  { name: "Ink", hex: "#000000" },
  { name: "Tie-break grey", hex: "#767676" },
  { name: "Focus blue", hex: BLUE },
  { name: "Navy", hex: "#1e3a8a" },
  { name: "Sunflower", hex: "#facc15" },
  { name: "Tomato", hex: "#ef4444" },
  { name: "Mint", hex: "#34d399" },
  { name: "Violet", hex: "#7c3aed" },
  { name: "Tangerine", hex: "#f97316" },
  { name: "Charcoal", hex: "#1f2937" },
  { name: "Fade", gradient: "linear-gradient(135deg, #ffffff 0%, #000000 100%)" },
]

type Mode = "blue" | "twoTone"

export function SwatchWall() {
  const { setBackground } = useLab()
  const [mode, setMode] = useState<Mode>("blue")
  const [loaded, setLoaded] = useState("")
  const name = useId()

  return (
    <div>
      <fieldset className="mb-6 rounded-2xl border border-slate-300 p-4 dark:border-slate-700">
        <legend className="px-2 text-sm font-semibold text-slate-900 dark:text-white">Focus style on the wall</legend>
        {/* Grid, not flex-col sm:flex-row: the root layout's inline critical CSS redefines .flex-col
            after Tailwind's stylesheet, which overrides every responsive flex-row. */}
        <div className="grid gap-3 sm:grid-flow-col sm:justify-start sm:gap-8">
          {(
            [
              ["blue", "One blue ring (this site's usual style)"],
              ["twoTone", "Two-tone ring (the recipe)"],
            ] as const
          ).map(([value, label]) => (
            <label key={value} className="flex min-h-6 cursor-pointer items-center gap-2 text-sm text-slate-800 dark:text-slate-200">
              <input
                type="radio"
                name={name}
                value={value}
                checked={mode === value}
                onChange={() => setMode(value)}
                className="h-4 w-4 accent-slate-900 dark:accent-white"
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <ul className="grid grid-cols-1 gap-3 xs3:grid-cols-2 lg:grid-cols-3" aria-label="Background swatches">
        {SWATCHES.map((swatch) => {
          const solid = "hex" in swatch
          const ink = solid ? readableOn(swatch.hex) : "#000000"
          const blue = solid ? contrastRatioWCAG(BLUE, swatch.hex) : 0
          const tone = solid ? twoTone(swatch.hex) : null
          return (
            <li
              key={swatch.name}
              className="flex min-w-0 flex-col gap-3 rounded-2xl p-4 ring-1 ring-inset ring-black/10 dark:ring-white/15"
              style={{ background: solid ? swatch.hex : swatch.gradient, color: ink }}
            >
              <div className={cn("flex items-baseline justify-between gap-2", !solid && "self-start rounded-md bg-white px-2 py-1 text-black")}>
                <span className="font-semibold">{swatch.name}</span>
                <span className="font-mono text-xs">{solid ? swatch.hex : "gradient"}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!solid) return
                  setBackground(swatch.hex)
                  setLoaded(`${swatch.name} (${swatch.hex}) is now the background in the lab below.`)
                }}
                aria-disabled={!solid || undefined}
                className={cn(
                  "min-h-11 self-start rounded-full border border-slate-500 bg-white px-4 text-sm font-medium text-slate-900",
                  mode === "blue" ? styles.blue : styles.twoTone,
                  !solid && "cursor-not-allowed",
                )}
              >
                {solid ? `Load ${swatch.name} into the lab` : "Gradients can't be loaded"}
              </button>
              {solid && tone ? (
                <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-xs">
                  <dt>Blue ring</dt>
                  <dd className="font-mono">
                    {formatRatio(blue)} {blue >= NON_TEXT_MIN ? "passes" : "fails"}
                  </dd>
                  <dt>Two-tone</dt>
                  <dd className="font-mono">{formatRatio(tone.best)} passes</dd>
                </dl>
              ) : (
                <p className="self-start rounded-md bg-white px-2 py-1 text-xs text-black">
                  Not one solid colour, so no guarantee: check this one by eye.
                </p>
              )}
            </li>
          )
        })}
      </ul>
      <p role="status" className="sr-only">
        {loaded}
      </p>
    </div>
  )
}
