"use client"

import { useId, useState, type CSSProperties } from "react"
import { cn } from "@/lib/utils"
import { CodeSample } from "@/components/recipes/code-sample"
import { PAIR_MIN, formatRatio, normaliseHex, pairGuarantee, readableOn } from "./ring-math"
import styles from "./rings.module.css"

const PRESETS = [
  { label: "White and black", inner: "#ffffff", outer: "#000000" },
  { label: "White and navy", inner: "#ffffff", outer: "#1e3a8a" },
  { label: "W3C's example", inner: "#f9f9f9", outer: "#193146" },
  { label: "White and focus blue", inner: "#ffffff", outer: "#2563eb" },
]

function ColourField({ label, value, onChange }: { label: string; value: string; onChange: (hex: string) => void }) {
  const [draft, setDraft] = useState(value)
  const [shown, setShown] = useState(value)
  const ids = { text: useId(), picker: useId(), error: useId() }
  // A preset changed the value from outside: show it in the text field.
  if (value !== shown) {
    setShown(value)
    setDraft(value)
  }
  const valid = normaliseHex(draft) !== null
  return (
    <div>
      <label htmlFor={ids.text} className="text-sm font-medium text-slate-900 dark:text-white">
        {label}
      </label>
      <div className="mt-1 flex gap-2">
        <input
          id={ids.text}
          value={draft}
          spellCheck={false}
          autoComplete="off"
          aria-invalid={!valid || undefined}
          aria-describedby={valid ? undefined : ids.error}
          onChange={(e) => {
            setDraft(e.target.value)
            const hex = normaliseHex(e.target.value)
            if (hex) {
              setShown(hex)
              onChange(hex)
            }
          }}
          className="min-h-11 w-full min-w-0 rounded-lg border border-slate-500 bg-white px-3 font-mono text-slate-900 dark:bg-slate-900 dark:text-white"
        />
        <label htmlFor={ids.picker} className="sr-only">
          {label}, colour picker
        </label>
        <input
          id={ids.picker}
          type="color"
          value={normaliseHex(draft) ?? value}
          onChange={(e) => {
            setDraft(e.target.value)
            setShown(e.target.value)
            onChange(e.target.value)
          }}
          className="h-11 w-14 shrink-0 cursor-pointer rounded-lg border border-slate-500 bg-white p-1 dark:bg-slate-900"
        />
      </div>
      {!valid && (
        <p id={ids.error} className="mt-1 text-sm text-rose-700 dark:text-rose-300">
          Use 3 or 6 hex digits, like #1e3a8a.
        </p>
      )}
    </div>
  )
}

export function PairBuilder() {
  const [inner, setInner] = useState("#ffffff")
  const [outer, setOuter] = useState("#1e3a8a")
  const pair = pairGuarantee(inner, outer)
  const ringVars = { "--ring-inner": inner, "--ring-outer": outer } as CSSProperties

  const css = `/* Two-tone focus ring: ${inner} and ${outer} (${formatRatio(pair.ratio)} apart) */
:focus-visible {
  outline: 2px solid ${inner};
  outline-offset: 0;
  box-shadow: 0 0 0 4px ${outer};
}`

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Start from a pair">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            aria-pressed={inner === p.inner && outer === p.outer}
            onClick={() => {
              setInner(p.inner)
              setOuter(p.outer)
            }}
            className="min-h-11 rounded-full border border-slate-500 px-4 text-sm font-medium text-slate-900 aria-pressed:bg-slate-900 aria-pressed:text-white dark:text-white dark:aria-pressed:bg-white dark:aria-pressed:text-slate-900"
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="min-w-0 space-y-4">
          <ColourField label="Inner band (the outline)" value={inner} onChange={setInner} />
          <ColourField label="Outer band (the box-shadow)" value={outer} onChange={setOuter} />
          <div
            className={cn(
              "rounded-2xl border-2 p-4",
              pair.guaranteed ? "border-emerald-700 dark:border-emerald-400" : "border-rose-700 dark:border-rose-400",
            )}
          >
            <p className="text-sm text-slate-700 dark:text-slate-300">The two bands contrast with each other at</p>
            <p className="font-mono text-3xl font-bold text-slate-900 dark:text-white">{formatRatio(pair.ratio)}</p>
            <p className="mt-2 text-sm text-slate-900 dark:text-white">
              {pair.guaranteed ? (
                <>
                  <strong>Guaranteed.</strong> That is at least {PAIR_MIN}:1, so on any solid background one band reaches at
                  least {formatRatio(pair.floor)}.
                </>
              ) : (
                <>
                  <strong>Not guaranteed.</strong> Below {PAIR_MIN}:1, there are backgrounds where both bands drop under 3:1. The
                  worst is {pair.worstBackground}, where each band manages only {formatRatio(pair.floor)}.
                </>
              )}
            </p>
          </div>
        </div>

        <div className="min-w-0">
          <p className="mb-2 text-sm font-medium text-slate-900 dark:text-white">
            Your ring on its worst background, <span className="font-mono">{pair.worstBackground}</span>
          </p>
          <div
            className="flex min-h-48 items-center justify-center rounded-3xl p-8 ring-1 ring-inset ring-black/10 dark:ring-white/15"
            style={{ background: pair.worstBackground, color: readableOn(pair.worstBackground) }}
          >
            <button
              type="button"
              style={ringVars}
              className={cn("min-h-11 rounded-full bg-white px-5 text-sm font-semibold text-slate-900", styles.pairPreview, styles.pair)}
            >
              Your two-tone ring
            </button>
          </div>
          <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
            This grey sits halfway between your two colours, so it is the background the pair handles worst.
          </p>
        </div>
      </div>

      <CodeSample code={css} filename="focus-ring.css" />
    </div>
  )
}
