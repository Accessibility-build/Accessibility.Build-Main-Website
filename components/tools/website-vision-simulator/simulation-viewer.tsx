"use client"

import { useCallback, useId, useState } from "react"
import { cn } from "@/lib/utils"
import { describeSimulation, filterPrimitives, type BlurLevel, type VisionCondition } from "@/lib/vision/filters"
import { VisionFilter } from "./vision-filter"

// Shows one screenshot three ways: filtered on its own, as a split with the original on the left of
// a divider, or as two panes. The divider is a native range input, so it works with a pointer, the
// arrow keys, Home and End, and a screen reader's slider controls alike.

export type ViewMode = "single" | "split" | "side"

interface SimulationViewerProps {
  src: string
  naturalWidth: number
  naturalHeight: number
  /** "Screenshot of GOV.UK", "Your image, mockup.png": the start of every alt text. */
  subject: string
  condition: VisionCondition
  severity: number
  blur: BlurLevel
  view: ViewMode
  fullSize: boolean
}

export function SimulationViewer({ src, naturalWidth, naturalHeight, subject, condition, severity, blur, view, fullSize }: SimulationViewerProps) {
  const baseId = `vision-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`
  const splitId = useId()
  const [split, setSplit] = useState(50)
  const [shownWidth, setShownWidth] = useState(0)

  // The simulated image's on-screen width, so a blur stays the same size relative to the page
  // whether the screenshot is shown at full size, fitted, or in a half-width pane.
  const measure = useCallback((node: HTMLImageElement | null) => {
    if (!node) return
    const observer = new ResizeObserver(([entry]) => setShownWidth(entry.contentRect.width))
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const scale = shownWidth > 0 ? shownWidth / naturalWidth : 1
  const primitives = filterPrimitives(condition, { severity, blur, scale })
  const filterId = `${baseId}-${condition}-${Math.round(severity * 100)}-${blur}-${Math.round(scale * 100)}`
  const filterStyle = primitives ? { filter: `url(#${filterId})` } : undefined
  const simulated = describeSimulation(condition, { severity, blur })
  const simulatedAlt = condition === "none" ? `${subject}, without simulation` : `${subject}, as simulated for ${simulated}`
  const originalAlt = `${subject}, without simulation`
  const imageClass = fullSize ? "block h-auto max-w-none" : "block h-auto w-full"
  const imageStyle = fullSize ? { width: naturalWidth } : undefined

  return (
    <div>
      {primitives && <VisionFilter id={filterId} primitives={primitives} />}

      {view === "split" && (
        <div className="mb-3">
          <label htmlFor={splitId} className="flex flex-wrap justify-between gap-2 text-sm font-medium text-slate-800 dark:text-slate-200">
            <span>Divider: original on the left, simulation on the right</span>
            <span className="tabular-nums text-slate-600 dark:text-slate-400">{split}% from the left</span>
          </label>
          <input
            id={splitId}
            type="range"
            min={0}
            max={100}
            step={1}
            value={split}
            onChange={(event) => setSplit(Number(event.target.value))}
            aria-valuetext={`${split}% original, ${100 - split}% simulated`}
            className="mt-2 w-full accent-teal-700"
          />
        </div>
      )}

      <div
        role="region"
        aria-label="Screenshot viewer, scrollable"
        tabIndex={0}
        className="max-h-[80vh] overflow-auto rounded-lg border border-slate-200 bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 dark:border-slate-800 dark:bg-slate-900"
      >
        {view === "single" && (
          // eslint-disable-next-line @next/next/no-img-element -- a data or blob URL, never optimised
          <img ref={measure} src={src} alt={simulatedAlt} width={naturalWidth} height={naturalHeight} className={imageClass} style={{ ...imageStyle, ...filterStyle }} />
        )}

        {view === "split" && (
          <div className={cn("relative", fullSize ? "w-max" : "w-full")}>
            {/* eslint-disable-next-line @next/next/no-img-element -- a data or blob URL, never optimised */}
            <img src={src} alt={`${originalAlt} (left of the divider)`} width={naturalWidth} height={naturalHeight} className={imageClass} style={imageStyle} />
            {/* eslint-disable-next-line @next/next/no-img-element -- a data or blob URL, never optimised */}
            <img
              ref={measure}
              src={src}
              alt={`${simulatedAlt} (right of the divider)`}
              width={naturalWidth}
              height={naturalHeight}
              className={cn(imageClass, "absolute inset-0")}
              style={{ ...imageStyle, ...filterStyle, clipPath: `inset(0 0 0 ${split}%)` }}
            />
            <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_0_1px_#0f172a]" style={{ left: `${split}%` }} />
            <span aria-hidden="true" className="pointer-events-none absolute left-2 top-2 rounded bg-slate-900/85 px-2 py-0.5 text-xs font-semibold text-white">
              Original
            </span>
            <span aria-hidden="true" className="pointer-events-none absolute right-2 top-2 rounded bg-slate-900/85 px-2 py-0.5 text-xs font-semibold text-white">
              Simulated
            </span>
          </div>
        )}

        {view === "side" && (
          <div className={cn("grid gap-2 p-2 sm:grid-cols-2", fullSize && "w-max sm:grid-cols-[auto_auto]")}>
            <figure className="min-w-0">
              <figcaption className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">Original</figcaption>
              {/* eslint-disable-next-line @next/next/no-img-element -- a data or blob URL, never optimised */}
              <img src={src} alt={originalAlt} width={naturalWidth} height={naturalHeight} className={imageClass} style={imageStyle} />
            </figure>
            <figure className="min-w-0">
              <figcaption className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">
                Simulated: {simulated}
              </figcaption>
              {/* eslint-disable-next-line @next/next/no-img-element -- a data or blob URL, never optimised */}
              <img ref={measure} src={src} alt={simulatedAlt} width={naturalWidth} height={naturalHeight} className={imageClass} style={{ ...imageStyle, ...filterStyle }} />
            </figure>
          </div>
        )}
      </div>
    </div>
  )
}
