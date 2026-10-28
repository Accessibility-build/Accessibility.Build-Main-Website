"use client"

import { useEffect, useRef, type KeyboardEvent, type PointerEvent, type RefObject } from "react"
import { cn } from "@/lib/utils"
import { areaFromPoints, clampArea, nudgeArea, sameArea, type Area } from "./geometry"

// The image with the marked area drawn over it. A pointer drag outside the area draws a new one,
// a drag inside moves it, and with focus on the image the arrow keys move it and Shift with the
// arrow keys resizes it. The four number fields beside it are the precise, screen-reader-friendly
// way to do the same thing, so nothing here is pointer-only.

interface RegionStageProps {
  src: string
  alt: string
  imageWidth: number
  imageHeight: number
  area: Area
  onAreaChange: (area: Area) => void
  onDraggingChange: (dragging: boolean) => void
  /** When true, a click picks the text colour instead of drawing. */
  picking: boolean
  onPick: (x: number, y: number) => void
  onCancelPick: () => void
  /** Heatmap pixels for `overlayArea`, at the resolution it was analysed. Hidden once the area moves. */
  overlay: ImageData | null
  overlayArea: Area | null
  /** The worst background pixel, in image pixels. */
  worstPoint: { x: number; y: number } | null
  label: string
  describedBy: string
  imgRef: RefObject<HTMLImageElement | null>
}

interface Drag {
  mode: "draw" | "move"
  pointerId: number
  startX: number
  startY: number
  origin: Area
  moved: boolean
}

const percent = (value: number, total: number) => `${(value / total) * 100}%`

export function RegionStage({
  src,
  alt,
  imageWidth,
  imageHeight,
  area,
  onAreaChange,
  onDraggingChange,
  picking,
  onPick,
  onCancelPick,
  overlay,
  overlayArea,
  worstPoint,
  label,
  describedBy,
  imgRef,
}: RegionStageProps) {
  const dragRef = useRef<Drag | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const overlayCurrent = !!overlay && sameArea(overlayArea, area)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !overlay) return
    canvas.width = overlay.width
    canvas.height = overlay.height
    canvas.getContext("2d")?.putImageData(overlay, 0, 0)
  }, [overlay])

  const toImagePoint = (event: PointerEvent<HTMLDivElement>) => {
    const rect = imgRef.current?.getBoundingClientRect()
    if (!rect || rect.width === 0 || rect.height === 0) return null
    return {
      x: Math.max(0, Math.min(imageWidth, ((event.clientX - rect.left) / rect.width) * imageWidth)),
      y: Math.max(0, Math.min(imageHeight, ((event.clientY - rect.top) / rect.height) * imageHeight)),
    }
  }

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return
    const point = toImagePoint(event)
    if (!point) return
    event.currentTarget.focus({ preventScroll: true })
    event.preventDefault()
    if (picking) {
      onPick(Math.min(imageWidth - 1, Math.floor(point.x)), Math.min(imageHeight - 1, Math.floor(point.y)))
      return
    }
    const inside = point.x >= area.x && point.x <= area.x + area.width && point.y >= area.y && point.y <= area.y + area.height
    dragRef.current = { mode: inside ? "move" : "draw", pointerId: event.pointerId, startX: point.x, startY: point.y, origin: area, moved: false }
    event.currentTarget.setPointerCapture(event.pointerId)
    onDraggingChange(true)
  }

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return
    const point = toImagePoint(event)
    if (!point) return
    const dx = point.x - drag.startX
    const dy = point.y - drag.startY
    // A few pixels of wobble is a click, not a drag.
    if (!drag.moved && Math.abs(dx) < 4 && Math.abs(dy) < 4) return
    drag.moved = true
    if (drag.mode === "move") {
      onAreaChange(clampArea({ ...drag.origin, x: drag.origin.x + dx, y: drag.origin.y + dy }, imageWidth, imageHeight))
    } else {
      onAreaChange(clampArea(areaFromPoints(drag.startX, drag.startY, point.x, point.y, imageWidth, imageHeight), imageWidth, imageHeight))
    }
  }

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return
    dragRef.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
    if (!drag.moved) onAreaChange(drag.origin)
    onDraggingChange(false)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape" && picking) {
      event.preventDefault()
      onCancelPick()
      return
    }
    if (event.altKey || event.ctrlKey || event.metaKey) return
    // One step is 1% of the image's longer side, so large images do not need hundreds of presses.
    const step = Math.max(1, Math.round(Math.max(imageWidth, imageHeight) / 100))
    const next = nudgeArea(area, event.key, event.shiftKey, step, imageWidth, imageHeight)
    if (!next) return
    event.preventDefault()
    onAreaChange(next)
  }

  return (
    <div
      role="group"
      aria-label={label}
      aria-describedby={describedBy}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      className={cn(
        "relative inline-block max-w-full cursor-crosshair touch-none select-none overflow-hidden rounded-md align-top",
        "outline-none focus-visible:ring-4 focus-visible:ring-teal-600 focus-visible:ring-offset-2 dark:focus-visible:ring-teal-400 dark:focus-visible:ring-offset-slate-950",
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- a local blob URL, never optimised */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        width={imageWidth}
        height={imageHeight}
        draggable={false}
        className="block h-auto max-h-[75vh] w-auto max-w-full"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute"
        style={{
          left: percent(area.x, imageWidth),
          top: percent(area.y, imageHeight),
          width: percent(area.width, imageWidth),
          height: percent(area.height, imageHeight),
          border: "2px dashed #0f172a",
          // A white ring keeps the dashed edge visible on dark images; the wide shadow dims the rest.
          boxShadow: "0 0 0 2px #ffffff, 0 0 0 9999px rgba(15, 23, 42, 0.45)",
        }}
      />
      {overlay && overlayArea && (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="pointer-events-none absolute"
          style={{
            left: percent(overlayArea.x, imageWidth),
            top: percent(overlayArea.y, imageHeight),
            width: percent(overlayArea.width, imageWidth),
            height: percent(overlayArea.height, imageHeight),
            visibility: overlayCurrent ? "visible" : "hidden",
          }}
        />
      )}
      {worstPoint && overlayCurrent && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white"
          style={{ left: percent(worstPoint.x + 0.5, imageWidth), top: percent(worstPoint.y + 0.5, imageHeight), boxShadow: "0 0 0 2px #0f172a, inset 0 0 0 2px #0f172a" }}
        />
      )}
    </div>
  )
}
