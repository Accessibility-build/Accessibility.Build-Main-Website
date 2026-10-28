"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import type { Box, PageScreenshot } from "@/lib/focus-order/types"

// The page screenshot with the results drawn over it in an SVG that shares the image's coordinate
// system, so a box in page pixels lands on the right spot at any display size. Badges are sized
// in screen pixels (divided by the current scale) so the numbers stay readable when the image is
// shrunk. The SVG is hidden from assistive technology: the image's alt text summarises it and the
// list beside it is the full text equivalent.

export interface OverlayMarker {
  index: number
  box: Box
  tone: "ok" | "fail" | "spacing"
  /** Problems get a square badge, so markers differ by shape as well as colour. */
  shape: "circle" | "square"
  dashed: boolean
}

interface ScreenshotOverlayProps {
  screenshot: PageScreenshot
  alt: string
  /** Accessible name of the scrollable region around the image. */
  label: string
  markers: OverlayMarker[]
  /** Join the markers in index order (focus mode). */
  path?: boolean
  activeIndex: number | null
  /** Changes whenever the list asks for a marker to be scrolled into view. */
  reveal: { index: number; nonce: number } | null
}

const COLOURS = { ok: "#0f766e", fail: "#b91c1c", spacing: "#b45309" }

export function ScreenshotOverlay({ screenshot, alt, label, markers, path = false, activeIndex, reveal }: ScreenshotOverlayProps) {
  const regionRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const frame = frameRef.current
    if (!frame) return
    const update = () => setScale(frame.clientWidth / screenshot.width || 1)
    update()
    const observer = new ResizeObserver(update)
    observer.observe(frame)
    return () => observer.disconnect()
  }, [screenshot.width])

  useEffect(() => {
    if (!reveal) return
    const region = regionRef.current
    const marker = markers.find((entry) => entry.index === reveal.index)
    if (!region || !marker) return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    region.scrollTo({
      top: Math.max(0, marker.box.y * scale - region.clientHeight / 3),
      left: Math.max(0, marker.box.x * scale - region.clientWidth / 3),
      behavior: reduce ? "auto" : "smooth",
    })
    // Only a new request should scroll, not a resize.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reveal])

  const unit = 1 / scale
  const radius = 10 * unit
  const centre = (box: Box) => `${box.x + box.width / 2},${box.y + box.height / 2}`
  const ordered = [...markers].sort((a, b) => a.index - b.index)
  const active = markers.find((marker) => marker.index === activeIndex) ?? null

  return (
    <div
      ref={regionRef}
      role="region"
      aria-label={label}
      tabIndex={0}
      className="max-h-[75vh] overflow-auto rounded-lg border border-slate-200 bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 dark:border-slate-800 dark:bg-slate-900"
    >
      <div ref={frameRef} className="relative min-w-[640px]">
        <Image
          src={screenshot.dataUrl}
          alt={alt}
          width={screenshot.width}
          height={screenshot.height}
          unoptimized
          className="block h-auto w-full"
        />
        <svg
          aria-hidden="true"
          focusable="false"
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox={`0 0 ${screenshot.width} ${screenshot.height}`}
        >
          {path && ordered.length > 1 && (
            <>
              <polyline points={ordered.map((marker) => centre(marker.box)).join(" ")} fill="none" stroke="#ffffff" strokeWidth={4} strokeOpacity={0.8} vectorEffect="non-scaling-stroke" />
              <polyline
                points={ordered.map((marker) => centre(marker.box)).join(" ")}
                fill="none"
                stroke={COLOURS.ok}
                strokeWidth={2}
                strokeDasharray="6 4"
                vectorEffect="non-scaling-stroke"
              />
            </>
          )}
          {ordered.map((marker) => {
            const colour = COLOURS[marker.tone]
            const { x, y, width, height } = marker.box
            const cx = Math.min(Math.max(x, radius), screenshot.width - radius)
            const cy = Math.min(Math.max(y, radius), screenshot.height - radius)
            return (
              <g key={marker.index}>
                <rect x={x} y={y} width={width} height={height} fill="none" stroke="#ffffff" strokeWidth={4} vectorEffect="non-scaling-stroke" />
                <rect
                  x={x}
                  y={y}
                  width={width}
                  height={height}
                  fill="none"
                  stroke={colour}
                  strokeWidth={2}
                  strokeDasharray={marker.dashed ? "5 3" : undefined}
                  vectorEffect="non-scaling-stroke"
                />
                {marker.shape === "square" ? (
                  <rect x={cx - radius} y={cy - radius} width={radius * 2} height={radius * 2} rx={2 * unit} fill={colour} stroke="#ffffff" strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
                ) : (
                  <circle cx={cx} cy={cy} r={radius} fill={colour} stroke="#ffffff" strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
                )}
                <text
                  x={cx}
                  y={cy}
                  fill="#ffffff"
                  fontSize={(marker.index > 99 ? 9 : 11) * unit}
                  fontWeight={700}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontFamily="ui-sans-serif, system-ui, sans-serif"
                >
                  {marker.index}
                </text>
              </g>
            )
          })}
          {active && (
            <g className="motion-safe:animate-pulse">
              <rect
                x={active.box.x - 6 * unit}
                y={active.box.y - 6 * unit}
                width={active.box.width + 12 * unit}
                height={active.box.height + 12 * unit}
                fill="none"
                stroke="#facc15"
                strokeWidth={6}
                vectorEffect="non-scaling-stroke"
              />
              <rect
                x={active.box.x - 6 * unit}
                y={active.box.y - 6 * unit}
                width={active.box.width + 12 * unit}
                height={active.box.height + 12 * unit}
                fill="none"
                stroke="#0f172a"
                strokeWidth={1.5}
                vectorEffect="non-scaling-stroke"
              />
            </g>
          )}
        </svg>
      </div>
    </div>
  )
}
