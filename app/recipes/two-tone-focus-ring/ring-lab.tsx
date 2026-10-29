"use client"

import { useEffect, useId, useState } from "react"
import { cn } from "@/lib/utils"
import { hexToOklch, oklchToHex, type OKLCH } from "@/lib/color/oklch"
import { useLab } from "./lab-context"
import { BLUE, NON_TEXT_MIN, contrastRatioWCAG, formatRatio, normaliseHex, readableOn, twoTone } from "./ring-math"
import styles from "./rings.module.css"

function Verdict({ ok }: { ok: boolean }) {
  return (
    <span
      className={cn(
        "ml-2 inline-block rounded-full px-2 py-0.5 font-sans text-xs font-semibold",
        ok ? "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200" : "bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-200",
      )}
    >
      {ok ? "Pass" : "Fail"}
    </span>
  )
}

export function RingLab() {
  const { background, setBackground } = useLab()
  const [oklch, setOklch] = useState<OKLCH>(() => hexToOklch(background))
  const [hexDraft, setHexDraft] = useState(background)
  const [summary, setSummary] = useState("")
  const ids = { l: useId(), c: useId(), h: useId(), hex: useId(), hexError: useId() }
  // The background the sliders and hex field currently describe.
  const [synced, setSynced] = useState(background)

  // Follow backgrounds loaded from elsewhere (the swatch wall, the shortcut buttons).
  if (background !== synced) {
    setSynced(background)
    setOklch(hexToOklch(background))
    setHexDraft(background)
  }

  const fromSliders = (next: OKLCH) => {
    const hex = oklchToHex(next)
    setOklch(next)
    setSynced(hex)
    setHexDraft(hex)
    setBackground(hex)
  }

  const blue = contrastRatioWCAG(BLUE, background)
  const tone = twoTone(background)
  const hexValid = normaliseHex(hexDraft) !== null

  // One calm announcement after the sliders stop, not one per step.
  useEffect(() => {
    const t = setTimeout(() => {
      setSummary(
        `Background ${background}. Blue ring ${formatRatio(blue)}, ${blue >= NON_TEXT_MIN ? "passes" : "fails"}. Two-tone ring ${formatRatio(tone.best)}, passes.`,
      )
    }, 700)
    return () => clearTimeout(t)
  }, [background, blue, tone.best])

  const slider = "h-11 w-full cursor-pointer accent-slate-900 dark:accent-white"

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <div className="min-w-0 space-y-5">
        <div>
          <label htmlFor={ids.l} className="flex justify-between text-sm font-medium text-slate-900 dark:text-white">
            Lightness <span className="font-mono text-slate-600 dark:text-slate-300">{Math.round(oklch.l * 100)}%</span>
          </label>
          <input
            id={ids.l}
            type="range"
            min={0}
            max={100}
            value={Math.round(oklch.l * 100)}
            aria-valuetext={`${Math.round(oklch.l * 100)} percent`}
            onChange={(e) => fromSliders({ ...oklch, l: Number(e.target.value) / 100 })}
            className={slider}
          />
        </div>
        <div>
          <label htmlFor={ids.c} className="flex justify-between text-sm font-medium text-slate-900 dark:text-white">
            Colourfulness <span className="font-mono text-slate-600 dark:text-slate-300">{Math.round((oklch.c / 0.37) * 100)}%</span>
          </label>
          <input
            id={ids.c}
            type="range"
            min={0}
            max={100}
            value={Math.round((oklch.c / 0.37) * 100)}
            aria-valuetext={`${Math.round((oklch.c / 0.37) * 100)} percent`}
            onChange={(e) => fromSliders({ ...oklch, c: (Number(e.target.value) / 100) * 0.37 })}
            className={slider}
          />
        </div>
        <div>
          <label htmlFor={ids.h} className="flex justify-between text-sm font-medium text-slate-900 dark:text-white">
            Hue <span className="font-mono text-slate-600 dark:text-slate-300">{Math.round(oklch.h)}°</span>
          </label>
          <input
            id={ids.h}
            type="range"
            min={0}
            max={360}
            value={Math.round(oklch.h)}
            aria-valuetext={`${Math.round(oklch.h)} degrees`}
            onChange={(e) => fromSliders({ ...oklch, h: Number(e.target.value) })}
            className={slider}
          />
        </div>
        <div>
          <label htmlFor={ids.hex} className="text-sm font-medium text-slate-900 dark:text-white">
            Or type a hex colour
          </label>
          <input
            id={ids.hex}
            value={hexDraft}
            spellCheck={false}
            autoComplete="off"
            aria-invalid={!hexValid || undefined}
            aria-describedby={hexValid ? undefined : ids.hexError}
            onChange={(e) => {
              setHexDraft(e.target.value)
              const hex = normaliseHex(e.target.value)
              if (hex) {
                setSynced(hex)
                setOklch(hexToOklch(hex))
                setBackground(hex)
              }
            }}
            className="mt-1 block min-h-11 w-full rounded-lg border border-slate-500 bg-white px-3 font-mono text-slate-900 dark:bg-slate-900 dark:text-white"
          />
          {!hexValid && (
            <p id={ids.hexError} className="mt-1 text-sm text-rose-700 dark:text-rose-300">
              Use 3 or 6 hex digits, like #767676.
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setBackground("#767676")}
            className="min-h-11 rounded-full border border-slate-500 px-4 text-sm font-medium text-slate-900 dark:text-white"
          >
            Hardest for two-tone
          </button>
          <button
            type="button"
            onClick={() => setBackground(BLUE)}
            className="min-h-11 rounded-full border border-slate-500 px-4 text-sm font-medium text-slate-900 dark:text-white"
          >
            Hardest for blue
          </button>
        </div>
      </div>

      <div className="min-w-0 space-y-4">
        <div
          className="flex min-h-56 flex-wrap items-center justify-center gap-6 rounded-3xl p-8 ring-1 ring-inset ring-black/10 dark:ring-white/15"
          style={{ background, color: readableOn(background) }}
        >
          <p className="sr-only">Both buttons are drawn as if focused. You can also Tab to them.</p>
          <button type="button" className={cn("min-h-11 rounded-full bg-white px-5 text-sm font-semibold text-slate-900", styles.bluePreview, styles.blue)}>
            Single blue ring
          </button>
          <button type="button" className={cn("min-h-11 rounded-full bg-white px-5 text-sm font-semibold text-slate-900", styles.twoTonePreview, styles.twoTone)}>
            Two-tone ring
          </button>
        </div>
        <dl className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-2 rounded-2xl border border-slate-300 p-4 font-mono text-sm text-slate-900 dark:border-slate-700 dark:text-white">
          <dt className="font-sans text-slate-700 dark:text-slate-300">Background</dt>
          <dd>{background}</dd>
          <dt className="font-sans text-slate-700 dark:text-slate-300">Blue ring against it</dt>
          <dd>
            {formatRatio(blue)}
            <Verdict ok={blue >= NON_TEXT_MIN} />
          </dd>
          <dt className="font-sans text-slate-700 dark:text-slate-300">White band against it</dt>
          <dd>{formatRatio(tone.white)}</dd>
          <dt className="font-sans text-slate-700 dark:text-slate-300">Black band against it</dt>
          <dd>{formatRatio(tone.black)}</dd>
          <dt className="font-sans font-semibold text-slate-900 dark:text-white">Better band</dt>
          <dd className="font-semibold">
            {formatRatio(tone.best)}
            <Verdict ok={tone.best >= NON_TEXT_MIN} />
          </dd>
          <dt className="border-t border-slate-300 pt-2 font-sans text-slate-700 dark:border-slate-700 dark:text-slate-300">White × black</dt>
          <dd className="border-t border-slate-300 pt-2 dark:border-slate-700">{tone.product.toFixed(2)}</dd>
        </dl>
        <p role="status" className="sr-only">
          {summary}
        </p>
      </div>
    </div>
  )
}
