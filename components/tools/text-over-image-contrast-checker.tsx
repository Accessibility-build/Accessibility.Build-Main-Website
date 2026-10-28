"use client"

import { useCallback, useEffect, useId, useMemo, useRef, useState, type ChangeEvent, type DragEvent } from "react"
import { AlertTriangle, CheckCircle2, ClipboardCopy, ImagePlus, Pipette, ScanSearch, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DEFAULT_TOLERANCE,
  MASK_FAIL,
  MASK_TEXT,
  analyseRegion,
  detectTextColour,
  formatRatio,
  hexToRgb8,
  rgb8ToHex,
  smallestScrim,
  type RegionContrastResult,
  type Rgb8,
  type ScrimFit,
} from "@/lib/color/region-contrast"
import { cn } from "@/lib/utils"
import { RegionStage } from "./text-over-image-contrast-checker/region-stage"
import { clampArea, defaultArea, withField, type Area, type AreaField } from "./text-over-image-contrast-checker/geometry"
import { EXAMPLE_AREA, createExampleImage } from "./text-over-image-contrast-checker/example-image"

// Text over an image passes WCAG 1.4.3 only if it has enough contrast against the background at
// every point the letters sit on. A picker samples one pixel; this tool measures all of them.
//
// The visitor loads an image (it never leaves the browser), marks the text, and the area is read
// at the image's own resolution. lib/color/region-contrast.ts separates text from background,
// skips the anti-aliased blend around the letters, and scores the text colour against every
// background pixel with the same maths as the contrast checker. The heatmap and the summary are two
// views of the same per-pixel result, and the overlay search uses the same pixels, so the fix it
// suggests is measured rather than guessed.

const MAX_FILE_BYTES = 40 * 1024 * 1024
/** Areas larger than this are analysed scaled down, to keep the page responsive. */
const MAX_ANALYSED_PIXELS = 4_000_000

interface Target {
  id: string
  ratio: number
  label: string
}

const TARGETS: Target[] = [
  { id: "aa-normal", ratio: 4.5, label: "Normal text, Level AA (4.5:1)" },
  { id: "aa-large", ratio: 3, label: "Large text, Level AA (3:1)" },
  { id: "non-text", ratio: 3, label: "Icons and graphics, Level AA (3:1)" },
  { id: "aaa-normal", ratio: 7, label: "Normal text, Level AAA (7:1)" },
  { id: "aaa-large", ratio: 4.5, label: "Large text, Level AAA (4.5:1)" },
]

const THRESHOLD_ROWS: { ratio: number; appliesTo: string }[] = [
  { ratio: 3, appliesTo: "Large text (AA), icons and graphics (AA)" },
  { ratio: 4.5, appliesTo: "Normal text (AA), large text (AAA)" },
  { ratio: 7, appliesTo: "Normal text (AAA)" },
]

interface LoadedImage {
  src: string
  name: string
  width: number
  height: number
}

interface Analysis {
  area: Area
  /** 1 at full resolution, less when the area was larger than MAX_ANALYSED_PIXELS. */
  scale: number
  result: RegionContrastResult
  text: Rgb8
  source: "auto" | "set"
  target: Target
  scrims: { black: ScrimFit | null; white: ScrimFit | null }
  /** Heatmap stripe width in analysed pixels, so stripes stay visible however small the image is shown. */
  stripe: number
}

function formatShare(share: number | null): string {
  if (share === null) return "none"
  // Rounded down, so 99.96% does not read as 100%.
  return `${(Math.floor(share * 1000 + 1e-9) / 10).toFixed(share === 1 || share === 0 ? 0 : 1)}%`
}

function placeName(where: string): string {
  return where === "centre" ? "the centre" : `the ${where}`
}

/** Reads the marked area at the image's own resolution, flattened onto white. */
function readArea(source: HTMLImageElement, area: Area): { image: ImageData; scale: number } {
  const pixels = area.width * area.height
  const scale = pixels > MAX_ANALYSED_PIXELS ? Math.sqrt(MAX_ANALYSED_PIXELS / pixels) : 1
  const width = Math.max(1, Math.floor(area.width * scale))
  const height = Math.max(1, Math.floor(area.height * scale))
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext("2d", { willReadFrequently: true })
  if (!ctx) throw new Error("Canvas is not available in this browser.")
  ctx.fillStyle = "#ffffff"
  ctx.fillRect(0, 0, width, height)
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = "high"
  ctx.drawImage(source, area.x, area.y, area.width, area.height, 0, 0, width, height)
  return { image: ctx.getImageData(0, 0, width, height), scale }
}

/** Striped marks on failing pixels (pattern as well as colour), and an optional tint on text. */
function buildOverlay(result: RegionContrastResult, showFails: boolean, showText: boolean, stripe: number): ImageData | null {
  if (!showFails && !showText) return null
  const { width, height, mask } = result
  const out = new ImageData(width, height)
  const d = out.data
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const i = y * width + x
      const p = i * 4
      if (showFails && mask[i] === MASK_FAIL) {
        if (Math.floor((x + y) / stripe) % 2 === 0) {
          d[p] = 255
          d[p + 1] = 0
          d[p + 2] = 144
          d[p + 3] = 235
        } else {
          d[p] = 15
          d[p + 1] = 23
          d[p + 2] = 42
          d[p + 3] = 215
        }
      } else if (showText && mask[i] === MASK_TEXT) {
        d[p] = 0
        d[p + 1] = 190
        d[p + 2] = 255
        d[p + 3] = 160
      }
    }
  }
  return out
}

function overlayCss(fit: ScrimFit, fileName: string): string {
  const channel = fit.scrim === "black" ? 0 : 255
  const rgba = `rgba(${channel}, ${channel}, ${channel}, ${fit.opacity.toFixed(2)})`
  const file = fileName.replace(/["\\\n]/g, "") || "your-image.jpg"
  return `/* Option 1: an overlay across the whole image */
.hero {
  background-image:
    linear-gradient(${rgba}, ${rgba}),
    url("${file}");
  background-size: cover;
}

/* Option 2: a backing behind the text only */
.hero-text {
  background-color: ${rgba};
  padding: 0.25em 0.5em;
}`
}

function AreaNumberField({ label, value, max, onCommit }: { label: string; value: number; max: number; onCommit: (value: number) => void }) {
  const id = useId()
  // A draft lets the visitor clear the field and type a new number; it is committed as it parses.
  const [draft, setDraft] = useState<string | null>(null)
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-800 dark:text-slate-200">
        {label}
      </label>
      <Input
        id={id}
        type="number"
        inputMode="numeric"
        min={0}
        max={max}
        step={1}
        value={draft ?? String(value)}
        onChange={(event) => {
          setDraft(event.target.value)
          const parsed = Number(event.target.value)
          if (event.target.value.trim() !== "" && Number.isFinite(parsed)) onCommit(parsed)
        }}
        onBlur={() => setDraft(null)}
        className="mt-1 h-10 bg-background tabular-nums"
      />
    </div>
  )
}

export default function TextOverImageContrastChecker() {
  const [loaded, setLoaded] = useState<LoadedImage | null>(null)
  const [area, setArea] = useState<Area | null>(null)
  const [dragging, setDragging] = useState(false)
  const [colourMode, setColourMode] = useState<"auto" | "set">("auto")
  const [hexDraft, setHexDraft] = useState("#ffffff")
  const [tolerance, setTolerance] = useState(DEFAULT_TOLERANCE)
  const [targetId, setTargetId] = useState(TARGETS[0].id)
  const [showFails, setShowFails] = useState(true)
  const [showText, setShowText] = useState(false)
  const [picking, setPicking] = useState(false)
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [status, setStatus] = useState("")
  const [loadError, setLoadError] = useState<string | null>(null)
  const [reading, setReading] = useState(false)
  const [dropActive, setDropActive] = useState(false)
  const [copied, setCopied] = useState(false)

  const sourceRef = useRef<HTMLImageElement | null>(null)
  const displayRef = useRef<HTMLImageElement | null>(null)
  const urlRef = useRef<string | null>(null)
  const detectionRef = useRef<{ key: string; color: Rgb8 | null } | null>(null)
  const focusResultsRef = useRef(false)
  const resultsHeadingRef = useRef<HTMLHeadingElement>(null)

  const fileId = useId()
  const helpId = useId()
  const stageHelpId = useId()
  const hexId = useId()
  const hexErrorId = useId()
  const toleranceId = useId()
  const targetSelectId = useId()
  const resultsHeadingId = useId()

  const target = TARGETS.find((t) => t.id === targetId) ?? TARGETS[0]
  const setColour = useMemo(() => hexToRgb8(hexDraft), [hexDraft])
  const hexInvalid = colourMode === "set" && !setColour

  useEffect(() => {
    return () => {
      if (urlRef.current) URL.revokeObjectURL(urlRef.current)
    }
  }, [])

  const loadFile = useCallback(async (file: Blob, name: string, initialArea?: Area) => {
    if (!file.type.startsWith("image/")) {
      setLoadError("That file isn't an image. Choose a PNG, JPEG, WebP, GIF or AVIF file.")
      return
    }
    if (file.size > MAX_FILE_BYTES) {
      setLoadError("That image is larger than 40 MB. Export a smaller copy or a screenshot of the part with the text.")
      return
    }
    setReading(true)
    setLoadError(null)
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.src = url
    try {
      await img.decode()
    } catch {
      URL.revokeObjectURL(url)
      setReading(false)
      setLoadError("That file couldn't be read as an image. Try a PNG or JPEG.")
      return
    }
    if (urlRef.current) URL.revokeObjectURL(urlRef.current)
    urlRef.current = url
    sourceRef.current = img
    detectionRef.current = null
    const width = img.naturalWidth
    const height = img.naturalHeight
    setLoaded({ src: url, name, width, height })
    setArea(initialArea ? clampArea(initialArea, width, height) : defaultArea(width, height))
    setAnalysis(null)
    setPicking(false)
    setReading(false)
    setStatus(`Image loaded, ${width} by ${height} pixels. Move the marked area over the text, then read the results below the image.`)
  }, [])

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) void loadFile(file, file.name)
    event.target.value = ""
  }

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDropActive(false)
    const file = Array.from(event.dataTransfer.files).find((f) => f.type.startsWith("image/"))
    if (file) void loadFile(file, file.name)
    else setLoadError("Drop an image file, such as a PNG or JPEG.")
  }

  // Paste an image from anywhere on the page. Only clipboard contents with an image file are taken,
  // so pasting text into a field still works normally.
  useEffect(() => {
    const onPaste = (event: ClipboardEvent) => {
      const file = Array.from(event.clipboardData?.files ?? []).find((f) => f.type.startsWith("image/"))
      if (!file) return
      event.preventDefault()
      void loadFile(file, file.name || "pasted-image.png")
    }
    window.addEventListener("paste", onPaste)
    return () => window.removeEventListener("paste", onPaste)
  }, [loadFile])

  const loadExample = async () => {
    try {
      const blob = await createExampleImage()
      await loadFile(blob, "summer-sale.png", EXAMPLE_AREA)
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "The example could not be drawn.")
    }
  }

  const analyse = useCallback(() => {
    const source = sourceRef.current
    if (!source || !loaded || !area) return
    if (colourMode === "set" && !setColour) return
    let read: { image: ImageData; scale: number }
    try {
      read = readArea(source, area)
    } catch {
      setStatus("This browser couldn't read the image's pixels, so the area can't be measured.")
      return
    }

    let text: Rgb8 | null = colourMode === "set" ? setColour : null
    if (!text) {
      const key = `${loaded.src}|${area.x},${area.y},${area.width},${area.height}`
      if (detectionRef.current?.key !== key) {
        detectionRef.current = { key, color: detectTextColour(read.image)?.color ?? null }
      }
      text = detectionRef.current.color
    }
    if (!text) {
      setAnalysis(null)
      setStatus("The marked area is a single colour, so there is no text to measure. Move it over the text, or set the text colour yourself.")
      return
    }

    const result = analyseRegion(read.image, { textColor: text, tolerance, threshold: target.ratio })
    const passesAlready = !!result.worst && result.worst.ratio >= target.ratio
    const scrims = passesAlready || !result.worst
      ? { black: null, white: null }
      : {
          black: smallestScrim(result.backgroundColors, text, target.ratio, "black"),
          white: smallestScrim(result.backgroundColors, text, target.ratio, "white"),
        }
    const shown = displayRef.current?.getBoundingClientRect().width || loaded.width
    const areaOnScreen = Math.max(1, (area.width * shown) / loaded.width)
    const stripe = Math.max(3, Math.round((3 * result.width) / areaOnScreen))

    const next: Analysis = {
      area,
      scale: read.scale,
      result,
      text,
      source: colourMode,
      target,
      scrims,
      stripe,
    }
    setAnalysis(next)
    setStatus(summarise(next))
  }, [area, colourMode, loaded, setColour, target, tolerance])

  // Re-measure shortly after the area or a setting changes, but not in the middle of a drag.
  useEffect(() => {
    if (!loaded || !area || dragging) return
    const timer = window.setTimeout(analyse, 150)
    return () => window.clearTimeout(timer)
  }, [analyse, area, dragging, loaded])

  useEffect(() => {
    if (analysis && focusResultsRef.current) {
      focusResultsRef.current = false
      resultsHeadingRef.current?.focus()
    }
  }, [analysis])

  const checkNow = () => {
    focusResultsRef.current = true
    analyse()
  }

  const pickColour = (x: number, y: number) => {
    const source = sourceRef.current
    if (!source) return
    const canvas = document.createElement("canvas")
    canvas.width = 1
    canvas.height = 1
    const ctx = canvas.getContext("2d", { willReadFrequently: true })
    if (!ctx) return
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, 1, 1)
    ctx.drawImage(source, x, y, 1, 1, 0, 0, 1, 1)
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data
    const hex = rgb8ToHex({ r, g, b })
    setHexDraft(hex)
    setColourMode("set")
    setPicking(false)
    setStatus(`Text colour set to ${hex}, picked from the image at ${x}, ${y}.`)
  }

  const updateField = (field: AreaField, value: number) => {
    if (!loaded || !area) return
    setArea(withField(area, field, value, loaded.width, loaded.height))
  }

  const copyCss = async (css: string) => {
    try {
      await navigator.clipboard.writeText(css)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }

  const result = analysis?.result ?? null
  const overlay = useMemo(
    () => (analysis ? buildOverlay(analysis.result, showFails, showText, analysis.stripe) : null),
    [analysis, showFails, showText],
  )
  const worst = result?.worst ?? null
  const passes = !!worst && analysis !== null && worst.ratio >= analysis.target.ratio
  const worstNatural = useMemo(() => {
    if (!analysis?.result.worst) return null
    return {
      x: analysis.area.x + Math.min(analysis.area.width - 1, Math.floor(analysis.result.worst.x / analysis.scale)),
      y: analysis.area.y + Math.min(analysis.area.height - 1, Math.floor(analysis.result.worst.y / analysis.scale)),
    }
  }, [analysis])
  const bestScrim = analysis
    ? [analysis.scrims.black, analysis.scrims.white].filter((s): s is ScrimFit => !!s).sort((a, b) => a.opacity - b.opacity)[0] ?? null
    : null
  const css = bestScrim && loaded ? overlayCss(bestScrim, loaded.name) : ""
  const totalPixels = result ? result.width * result.height : 0

  return (
    <div className="space-y-8">
      <div
        onDragOver={(event) => {
          event.preventDefault()
          setDropActive(true)
        }}
        onDragLeave={() => setDropActive(false)}
        onDrop={onDrop}
        className={cn(
          "rounded-xl border-2 border-dashed bg-white p-5 dark:bg-slate-900 sm:p-6",
          dropActive ? "border-teal-600 bg-teal-50 dark:border-teal-400 dark:bg-teal-950/40" : "border-slate-300 dark:border-slate-700",
        )}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{loaded ? "Your image" : "Start with an image"}</h2>
            <p id={helpId} className="mt-1 max-w-[60ch] text-sm leading-6 text-slate-600 dark:text-slate-400">
              Choose, drop or paste a screenshot or design export (PNG, JPEG, WebP, GIF or AVIF, up to 40 MB). It is read
              in your browser and never uploaded.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <input id={fileId} type="file" accept="image/*" onChange={onFileChange} aria-describedby={helpId} className="peer sr-only" />
            <label
              htmlFor={fileId}
              className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-md bg-teal-700 px-4 text-sm font-semibold text-white hover:bg-teal-800 peer-focus-visible:ring-2 peer-focus-visible:ring-teal-600 peer-focus-visible:ring-offset-2 dark:peer-focus-visible:ring-offset-slate-900"
            >
              <ImagePlus className="h-4 w-4" aria-hidden="true" />
              {loaded ? "Choose another image" : "Choose an image"}
            </label>
            <Button type="button" variant="outline" onClick={() => void loadExample()}>
              <Sparkles aria-hidden="true" />
              Try an example
            </Button>
          </div>
        </div>
        {reading && <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">Reading the image...</p>}
        {loadError && (
          <p role="alert" className="mt-3 text-sm font-medium text-red-700 dark:text-red-300">
            {loadError}
          </p>
        )}
      </div>

      {loaded && area && (
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="min-w-0">
            <RegionStage
              src={loaded.src}
              alt={`Your image${loaded.name ? `, ${loaded.name}` : ""}, ${loaded.width} by ${loaded.height} pixels, with the measured area marked`}
              imageWidth={loaded.width}
              imageHeight={loaded.height}
              area={area}
              onAreaChange={setArea}
              onDraggingChange={setDragging}
              picking={picking}
              onPick={pickColour}
              onCancelPick={() => setPicking(false)}
              overlay={overlay}
              overlayArea={analysis?.area ?? null}
              worstPoint={worstNatural}
              label="Image with the measured area"
              describedBy={stageHelpId}
              imgRef={displayRef}
            />
            <p id={stageHelpId} className="mt-3 max-w-[70ch] text-sm leading-6 text-slate-600 dark:text-slate-400">
              {picking
                ? "Click the image on a solid part of a letter to use its colour. Press Escape to cancel."
                : "Drag across the text to mark it, leaving a little space around the letters, or drag inside the marked area to move it. With the image focused, arrow keys move the area and Shift with arrow keys resizes it. The fields beside the image set it exactly."}
            </p>

            <fieldset className="mt-4">
              <legend className="text-sm font-semibold text-slate-900 dark:text-white">Show on the image</legend>
              <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-800 dark:text-slate-200">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showFails}
                    onChange={(event) => setShowFails(event.target.checked)}
                    className="h-4 w-4 accent-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
                  />
                  <span
                    aria-hidden="true"
                    className="inline-block h-4 w-6 rounded-sm border border-slate-400"
                    style={{ background: "repeating-linear-gradient(45deg, #ff0090 0 4px, #0f172a 4px 8px)" }}
                  />
                  Failing background (striped)
                </label>
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showText}
                    onChange={(event) => setShowText(event.target.checked)}
                    className="h-4 w-4 accent-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
                  />
                  <span aria-hidden="true" className="inline-block h-4 w-6 rounded-sm border border-slate-400" style={{ background: "rgba(0, 190, 255, 0.7)" }} />
                  Pixels counted as text (tinted)
                </label>
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-400">
                The ringed point is the worst background pixel. Everything the marks show is also in the results as text.
              </p>
            </fieldset>
          </div>

          <div className="space-y-6">
            <fieldset>
              <legend className="text-sm font-semibold text-slate-900 dark:text-white">Measured area, in image pixels</legend>
              <div className="mt-2 grid grid-cols-2 gap-3">
                <AreaNumberField label="Left (x)" value={area.x} max={loaded.width - area.width} onCommit={(v) => updateField("x", v)} />
                <AreaNumberField label="Top (y)" value={area.y} max={loaded.height - area.height} onCommit={(v) => updateField("y", v)} />
                <AreaNumberField label="Width" value={area.width} max={loaded.width - area.x} onCommit={(v) => updateField("width", v)} />
                <AreaNumberField label="Height" value={area.height} max={loaded.height - area.y} onCommit={(v) => updateField("height", v)} />
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-sm font-semibold text-slate-900 dark:text-white">Text colour</legend>
              <div className="mt-2 space-y-2 text-sm text-slate-800 dark:text-slate-200">
                <label className="flex items-start gap-2">
                  <input
                    type="radio"
                    name={`${fileId}-colour`}
                    checked={colourMode === "auto"}
                    onChange={() => {
                      setColourMode("auto")
                      setPicking(false)
                    }}
                    className="mt-0.5 h-4 w-4 accent-teal-700"
                  />
                  <span>Detect it in the marked area</span>
                </label>
                <label className="flex items-start gap-2">
                  <input
                    type="radio"
                    name={`${fileId}-colour`}
                    checked={colourMode === "set"}
                    onChange={() => setColourMode("set")}
                    className="mt-0.5 h-4 w-4 accent-teal-700"
                  />
                  <span>Set it myself (also for an image that has no text in it yet)</span>
                </label>
              </div>

              {colourMode === "auto" && analysis?.source === "auto" && (
                <p className="mt-3 flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <span aria-hidden="true" className="inline-block h-5 w-5 rounded border border-slate-400" style={{ backgroundColor: rgb8ToHex(analysis.text) }} />
                  Detected <code className="font-mono">{rgb8ToHex(analysis.text)}</code>
                </p>
              )}

              {colourMode === "set" && (
                <div className="mt-3">
                  <label htmlFor={hexId} className="block text-sm font-medium text-slate-800 dark:text-slate-200">
                    Hex colour
                  </label>
                  <div className="mt-1 flex items-center gap-2">
                    <Input
                      id={hexId}
                      value={hexDraft}
                      onChange={(event) => setHexDraft(event.target.value)}
                      spellCheck={false}
                      autoComplete="off"
                      aria-invalid={hexInvalid || undefined}
                      aria-describedby={hexInvalid ? hexErrorId : undefined}
                      className="h-10 bg-background font-mono"
                    />
                    <input
                      type="color"
                      aria-label="Text colour picker"
                      value={setColour ? rgb8ToHex(setColour) : "#ffffff"}
                      onChange={(event) => setHexDraft(event.target.value)}
                      className="h-10 w-12 shrink-0 cursor-pointer rounded border border-slate-300 bg-transparent p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 dark:border-slate-700"
                    />
                  </div>
                  {hexInvalid && (
                    <p id={hexErrorId} className="mt-1 text-sm font-medium text-red-700 dark:text-red-300">
                      Enter a hex colour such as #ffffff.
                    </p>
                  )}
                  <Button type="button" variant="outline" size="sm" className="mt-2" aria-pressed={picking} onClick={() => setPicking((p) => !p)}>
                    <Pipette aria-hidden="true" />
                    {picking ? "Picking: click the image" : "Pick from the image"}
                  </Button>
                </div>
              )}

              <div className="mt-4">
                <label htmlFor={toleranceId} className="flex justify-between text-sm font-medium text-slate-800 dark:text-slate-200">
                  <span>Colour match tolerance</span>
                  <span className="tabular-nums">{tolerance}</span>
                </label>
                <input
                  id={toleranceId}
                  type="range"
                  min={8}
                  max={96}
                  step={4}
                  value={tolerance}
                  onChange={(event) => setTolerance(Number(event.target.value))}
                  aria-describedby={`${toleranceId}-help`}
                  className="mt-2 w-full accent-teal-700"
                />
                <p id={`${toleranceId}-help`} className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-400">
                  How close a pixel must be to the text colour to count as text. Raise it for JPEG or soft-edged text.
                </p>
              </div>
            </fieldset>

            <div>
              <label htmlFor={targetSelectId} className="block text-sm font-semibold text-slate-900 dark:text-white">
                Check against
              </label>
              <select
                id={targetSelectId}
                value={targetId}
                onChange={(event) => setTargetId(event.target.value)}
                aria-describedby={`${targetSelectId}-help`}
                className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 dark:text-slate-100"
              >
                {TARGETS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
              <p id={`${targetSelectId}-help`} className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-400">
                Large text is at least 24 px, or 18.66 px bold.
              </p>
            </div>

            <Button type="button" onClick={checkNow} disabled={hexInvalid} className="w-full bg-teal-700 text-white hover:bg-teal-800 focus-visible:ring-teal-600">
              <ScanSearch aria-hidden="true" />
              Check this area
            </Button>
          </div>
        </div>
      )}

      <div role="status" aria-live="polite" className={cn(!status && "sr-only")}>
        {status && (
          <p
            className={cn(
              "flex items-start gap-3 rounded-md border p-4 text-sm",
              !analysis
                ? "border-slate-200 bg-slate-50 text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                : passes
                  ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200"
                  : "border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-200",
            )}
          >
            {analysis &&
              (passes ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              ) : (
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              ))}
            <span>{status}</span>
          </p>
        )}
      </div>

      {analysis && result && (
        <section aria-labelledby={resultsHeadingId} className="space-y-6">
          <h2
            id={resultsHeadingId}
            ref={resultsHeadingRef}
            tabIndex={-1}
            className="font-serif text-2xl font-semibold text-slate-900 outline-none focus-visible:ring-2 focus-visible:ring-teal-600 dark:text-white"
          >
            Results for the marked area
          </h2>

          {analysis.scale < 1 && (
            <p className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
              This area is larger than 4 megapixels, so it was measured at {Math.round(analysis.scale * 100)}% of full size.
              Scaling averages very fine detail; mark a smaller area for a full-resolution check.
            </p>
          )}
          {result.textPixels === 0 && (
            <p className="rounded-md border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
              No pixels matched the text colour, so the whole area counts as background. That is right if the image has no
              text in it yet. If it does, check the text colour or raise the tolerance.
            </p>
          )}
          {totalPixels > 0 && result.textPixels / totalPixels > 0.5 && (
            <p className="rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
              More than half the area matched the text colour. Either the colour is wrong, or the background contains the
              text colour itself, and those parts are left out of the measurement. Turn on the text tint to see which.
            </p>
          )}

          {!worst ? (
            <p className="text-sm text-slate-700 dark:text-slate-300">
              There was no background left to measure. Make the area larger, or lower the tolerance.
            </p>
          ) : (
            <>
              <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                  <dt className="text-sm font-medium text-slate-600 dark:text-slate-400">Worst point</dt>
                  <dd className="mt-1">
                    <span className="text-2xl font-semibold tabular-nums text-slate-900 dark:text-white">{formatRatio(worst.ratio)}:1</span>
                    <span className="mt-2 flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                      {/* The text colour as a bar on the worst background: a picture of the failure, not text. */}
                      <span
                        aria-hidden="true"
                        className="mt-0.5 flex h-6 w-10 shrink-0 items-center justify-center rounded border border-slate-400"
                        style={{ backgroundColor: worst.hex }}
                      >
                        <span className="h-2 w-6 rounded-sm" style={{ backgroundColor: rgb8ToHex(analysis.text) }} />
                      </span>
                      <span>
                        against <code className="font-mono">{worst.hex}</code>, in {placeName(worst.where)} of the area
                        {worstNatural ? ` (pixel ${worstNatural.x}, ${worstNatural.y})` : ""}
                      </span>
                    </span>
                  </dd>
                </div>
                <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                  <dt className="text-sm font-medium text-slate-600 dark:text-slate-400">Background that reaches {analysis.target.ratio}:1</dt>
                  <dd className="mt-1">
                    <span className="text-2xl font-semibold tabular-nums text-slate-900 dark:text-white">{formatShare(result.passShare)}</span>
                    {result.hotspot && (
                      <span className="mt-2 block text-sm text-slate-700 dark:text-slate-300">
                        Failures are concentrated in {placeName(result.hotspot.where)}, where {formatShare(result.hotspot.failShare)} of the
                        background fails.
                      </span>
                    )}
                  </dd>
                </div>
                <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                  <dt className="text-sm font-medium text-slate-600 dark:text-slate-400">5th percentile</dt>
                  <dd className="mt-1">
                    <span className="text-2xl font-semibold tabular-nums text-slate-900 dark:text-white">
                      {result.percentile5 !== null ? `${result.percentile5.toFixed(2)}:1` : "none"}
                    </span>
                    <span className="mt-2 block text-sm text-slate-700 dark:text-slate-300">
                      95% of the background is at least this. Median {result.median !== null ? `${result.median.toFixed(2)}:1` : "none"}.
                    </span>
                  </dd>
                </div>
                <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                  <dt className="text-sm font-medium text-slate-600 dark:text-slate-400">Text colour used</dt>
                  <dd className="mt-1 flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <span aria-hidden="true" className="inline-block h-6 w-6 rounded border border-slate-400" style={{ backgroundColor: result.textHex }} />
                    <code className="font-mono text-base text-slate-900 dark:text-white">{result.textHex}</code>
                    {analysis.source === "auto" ? "detected" : "set by you"}
                  </dd>
                </div>
                <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                  <dt className="text-sm font-medium text-slate-600 dark:text-slate-400">APCA at the worst point</dt>
                  <dd className="mt-1">
                    <span className="text-2xl font-semibold tabular-nums text-slate-900 dark:text-white">Lc {worst.apcaLc.toFixed(1)}</span>
                    <span className="mt-2 block text-sm text-slate-700 dark:text-slate-300">
                      From the WCAG 3 draft, for reference only. It is not a WCAG 2 requirement.
                    </span>
                  </dd>
                </div>
                <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                  <dt className="text-sm font-medium text-slate-600 dark:text-slate-400">Pixels measured</dt>
                  <dd className="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-300">
                    {result.width.toLocaleString("en-GB")} by {result.height.toLocaleString("en-GB")}:{" "}
                    {formatShare(result.textPixels / totalPixels)} text, {formatShare(result.edgePixels / totalPixels)} letter edges
                    skipped, {formatShare(result.backgroundPixels / totalPixels)} background.
                  </dd>
                </div>
              </dl>

              <div
                role="region"
                aria-label="Thresholds table, scrolls sideways on small screens"
                tabIndex={0}
                className="overflow-x-auto rounded-lg border border-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 dark:border-slate-800"
              >
                <table className="w-full border-collapse text-sm">
                  <caption className="sr-only">Share of the background that reaches each WCAG contrast threshold</caption>
                  <thead>
                    <tr>
                      {["Ratio", "Applies to", "Background that passes", "Every point passes"].map((h) => (
                        <th
                          key={h}
                          scope="col"
                          className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-slate-700 dark:text-slate-300">
                    {THRESHOLD_ROWS.map((row) => {
                      const share = result.shares.find((s) => s.ratio === row.ratio)?.share ?? 0
                      const all = worst.ratio >= row.ratio
                      return (
                        <tr key={row.ratio}>
                          <th scope="row" className="border-b border-slate-200 px-4 py-3 text-left font-semibold tabular-nums text-slate-900 dark:border-slate-800 dark:text-white">
                            {row.ratio}:1
                          </th>
                          <td className="border-b border-slate-200 px-4 py-3 dark:border-slate-800">{row.appliesTo}</td>
                          <td className="border-b border-slate-200 px-4 py-3 tabular-nums dark:border-slate-800">{formatShare(share)}</td>
                          <td className="border-b border-slate-200 px-4 py-3 dark:border-slate-800">
                            <span className={cn("inline-flex items-center gap-1.5 font-medium", all ? "text-emerald-800 dark:text-emerald-300" : "text-rose-800 dark:text-rose-300")}>
                              {all ? <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> : <AlertTriangle className="h-4 w-4" aria-hidden="true" />}
                              {all ? "Yes" : "No"}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              <div className="rounded-lg border border-slate-200 p-5 dark:border-slate-800">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">How to fix it</h3>
                {passes ? (
                  <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
                    Nothing to fix in this area at {analysis.target.ratio}:1. If the image is cropped differently at other screen
                    widths (for example with background-size: cover), check a screenshot at each breakpoint, because different
                    parts of the image can end up behind the text.
                  </p>
                ) : bestScrim ? (
                  <div className="mt-2 space-y-3 text-sm leading-6 text-slate-700 dark:text-slate-300">
                    <p>
                      The smallest overlay that brings every measured point to {analysis.target.ratio}:1 is{" "}
                      <strong className="text-slate-900 dark:text-white">
                        {bestScrim.scrim} at {Math.round(bestScrim.opacity * 100)}% opacity
                      </strong>{" "}
                      (worst point {formatRatio(bestScrim.worstRatio)}:1 with it).
                      {analysis.scrims.black && analysis.scrims.white && bestScrim.scrim === "black"
                        ? ` A white overlay would need ${Math.round(analysis.scrims.white.opacity * 100)}%.`
                        : analysis.scrims.black && analysis.scrims.white
                          ? ` A black overlay would need ${Math.round(analysis.scrims.black.opacity * 100)}%.`
                          : ""}
                    </p>
                    <div>
                      <div className="flex items-center justify-between gap-3 rounded-t-md border border-b-0 border-slate-200 bg-slate-900 px-4 py-2 dark:border-slate-800">
                        <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">CSS</span>
                        <button
                          type="button"
                          onClick={() => void copyCss(css)}
                          className="inline-flex items-center gap-1.5 rounded-md border border-slate-600 bg-slate-900 px-2.5 py-1 text-xs font-medium text-slate-100 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
                        >
                          <ClipboardCopy className="h-3.5 w-3.5" aria-hidden="true" />
                          {copied ? "Copied" : "Copy CSS"}
                        </button>
                      </div>
                      <pre
                        role="region"
                        aria-label="CSS for the overlay"
                        tabIndex={0}
                        className="overflow-x-auto rounded-b-md border border-slate-200 bg-slate-950 p-4 font-mono text-sm leading-6 text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 dark:border-slate-800"
                      >
                        {css}
                      </pre>
                    </div>
                    <p>
                      This assumes the words are live text on top of the image. If they are part of the image file, an overlay
                      darkens them too, so edit the image instead. The figure covers only the marked area; if the image is cropped
                      differently at other screen widths, measure those too or add a margin.
                    </p>
                    <p>
                      Alternatives: a solid or semi-opaque panel behind the text (option 2 above), or a halo around every letter
                      in a colour that contrasts with the text. W3C&apos;s guidance treats a halo that surrounds the letters as their
                      background, but a faint or offset text-shadow leaves parts of each letter on the image, so screenshot the
                      result and check it here.
                    </p>
                  </div>
                ) : (
                  <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
                    No black or white overlay, even a fully opaque one, brings {result.textHex} to {analysis.target.ratio}:1. Change
                    the text colour first: white or near-black text leaves the most room, and then an overlay or a panel behind
                    the text can make up the rest.
                  </p>
                )}
              </div>
            </>
          )}
        </section>
      )}
    </div>
  )
}

function summarise(analysis: Analysis): string {
  const { result, target } = analysis
  const worst = result.worst
  if (!worst) {
    return "Every pixel in the area matched the text colour or sat right next to it, so there was no background to measure. Make the area larger, or check the text colour."
  }
  if (worst.ratio >= target.ratio) {
    return `Passes ${target.ratio}:1 at every background point. The worst point is ${formatRatio(worst.ratio)}:1.`
  }
  return `Fails ${target.ratio}:1. The worst point is ${formatRatio(worst.ratio)}:1, in ${placeName(worst.where)} of the area, and ${formatShare(result.passShare)} of the background passes.`
}
