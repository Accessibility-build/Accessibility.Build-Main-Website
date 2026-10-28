"use client"

import { useCallback, useEffect, useId, useRef, useState, type ChangeEvent, type DragEvent } from "react"
import Link from "next/link"
import { ImagePlus } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UrlCheckForm } from "@/components/tools/url-check-form"
import { SiteScanHandoff } from "@/components/tools/site-scan-handoff"
import { postTool } from "@/lib/render/client"
import { BLUR_LEVELS, CONDITIONS, describeSimulation, type BlurLevel, type VisionCondition } from "@/lib/vision/filters"
import { cn } from "@/lib/utils"
import { SimulationViewer, type ViewMode } from "./website-vision-simulator/simulation-viewer"

// What does this page look like with a colour vision deficiency, blurred vision or low contrast
// sensitivity? The server renders the page once (app/api/tools/website-vision-simulator) and
// returns a screenshot; every simulation is an SVG filter applied here, so switching conditions,
// severities and views is instant and costs no further requests. An uploaded image never leaves
// the browser at all.
//
// The point is to find information carried by colour alone (WCAG 1.4.1) and contrast that is too
// weak (1.4.3, 1.4.11), not to claim what any one person sees. The copy says so wherever a
// simulation is shown.

const ENDPOINT = "/api/tools/website-vision-simulator"
const MAX_FILE_BYTES = 25 * 1024 * 1024

interface CaptureResponse {
  finalUrl: string
  title: string
  screenshot: { dataUrl: string; width: number; height: number; truncated: boolean; quality: number; bytes: number }
}

interface Source {
  src: string
  width: number
  height: number
  /** Start of every alt text. */
  subject: string
  /** Heading text. */
  name: string
  kind: "url" | "upload"
  finalUrl?: string
  truncated?: boolean
}

const VIEWS: { id: ViewMode; label: string }[] = [
  { id: "single", label: "Single view" },
  { id: "split", label: "Split with the original" },
  { id: "side", label: "Side by side" },
]

const radioClass = "mt-0.5 h-4 w-4 shrink-0 accent-teal-700"

export default function WebsiteVisionSimulator() {
  const [tab, setTab] = useState("url")
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [urlError, setUrlError] = useState<string | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [status, setStatus] = useState("")
  const [source, setSource] = useState<Source | null>(null)
  const [condition, setCondition] = useState<VisionCondition>("deutan")
  const [severityPercent, setSeverityPercent] = useState(100)
  const [blur, setBlur] = useState<BlurLevel>("moderate")
  const [view, setView] = useState<ViewMode>("single")
  const [fullSize, setFullSize] = useState(false)
  const [dropActive, setDropActive] = useState(false)

  const controllerRef = useRef<AbortController | null>(null)
  const objectUrlRef = useRef<string | null>(null)
  const focusResultsRef = useRef(false)
  const resultsHeadingRef = useRef<HTMLHeadingElement>(null)

  const fileId = useId()
  const fileHelpId = useId()
  const groupName = useId()
  const severityId = useId()
  const resultsHeadingId = useId()
  const descriptionId = useId()

  const info = CONDITIONS.find((c) => c.id === condition) ?? CONDITIONS[0]
  const severity = severityPercent / 100

  useEffect(() => {
    return () => {
      controllerRef.current?.abort()
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
    }
  }, [])

  useEffect(() => {
    if (source && focusResultsRef.current) {
      focusResultsRef.current = false
      resultsHeadingRef.current?.focus()
    }
  }, [source])

  const replaceSource = (next: Source) => {
    if (objectUrlRef.current && objectUrlRef.current !== next.src) {
      URL.revokeObjectURL(objectUrlRef.current)
      objectUrlRef.current = null
    }
    if (next.kind === "upload") objectUrlRef.current = next.src
    focusResultsRef.current = true
    setSource(next)
  }

  const submitUrl = async () => {
    if (!url.trim()) {
      setUrlError("Enter a page address, for example https://example.com")
      return
    }
    controllerRef.current?.abort()
    const controller = new AbortController()
    controllerRef.current = controller
    setLoading(true)
    setUrlError(null)
    setStatus("Loading the page in a headless browser and taking a screenshot. This usually takes 10 to 30 seconds.")
    try {
      const data = await postTool<CaptureResponse>(ENDPOINT, { url }, controller.signal)
      let host = data.finalUrl
      try {
        host = new URL(data.finalUrl).hostname.replace(/^www\./, "")
      } catch {
        // Keep the raw address.
      }
      const name = data.title || host
      replaceSource({
        src: data.screenshot.dataUrl,
        width: data.screenshot.width,
        height: data.screenshot.height,
        subject: `Screenshot of ${name}`,
        name,
        kind: "url",
        finalUrl: data.finalUrl,
        truncated: data.screenshot.truncated,
      })
      setStatus(
        `Screenshot ready: ${name}, ${data.screenshot.width} by ${data.screenshot.height} pixels${
          data.screenshot.truncated ? ", the top 4,000 pixels of a longer page" : ""
        }. Choose a condition to simulate.`,
      )
    } catch (error) {
      if ((error as Error)?.name === "AbortError") return
      const message = error instanceof Error ? error.message : "The check failed. Please try again."
      setUrlError(message)
      setStatus(message)
    } finally {
      if (controllerRef.current === controller) setLoading(false)
    }
  }

  const loadFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setUploadError("That file isn't an image. Choose a PNG, JPEG, WebP, GIF or AVIF file.")
      return
    }
    if (file.size > MAX_FILE_BYTES) {
      setUploadError("That image is larger than 25 MB. Export a smaller copy.")
      return
    }
    setUploadError(null)
    const src = URL.createObjectURL(file)
    const img = new Image()
    img.src = src
    try {
      await img.decode()
    } catch {
      URL.revokeObjectURL(src)
      setUploadError("That file couldn't be read as an image. Try a PNG or JPEG.")
      return
    }
    const name = file.name || "pasted image"
    setTab("upload")
    // Not replaceSource's closure: this callback is shared with the paste listener.
    setSource((previous) => {
      if (previous?.kind === "upload" && previous.src !== src) URL.revokeObjectURL(previous.src)
      return { src, width: img.naturalWidth, height: img.naturalHeight, subject: `Your image ${name}`, name, kind: "upload" }
    })
    objectUrlRef.current = src
    focusResultsRef.current = true
    setStatus(`Image loaded: ${name}, ${img.naturalWidth} by ${img.naturalHeight} pixels. Choose a condition to simulate.`)
  }, [])

  // Pasting an image anywhere on the page loads it; pasting text into a field is left alone.
  useEffect(() => {
    const onPaste = (event: ClipboardEvent) => {
      const file = Array.from(event.clipboardData?.files ?? []).find((f) => f.type.startsWith("image/"))
      if (!file) return
      event.preventDefault()
      void loadFile(file)
    }
    window.addEventListener("paste", onPaste)
    return () => window.removeEventListener("paste", onPaste)
  }, [loadFile])

  const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) void loadFile(file)
    event.target.value = ""
  }

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDropActive(false)
    const file = Array.from(event.dataTransfer.files).find((f) => f.type.startsWith("image/"))
    if (file) void loadFile(file)
    else setUploadError("Drop an image file, such as a PNG or JPEG.")
  }

  const severityName =
    info.severity && info.fullName && info.partialName ? (severityPercent >= 100 ? info.fullName : info.partialName) : ""

  return (
    <div className="space-y-8">
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="h-auto flex-wrap">
          <TabsTrigger value="url">Website address</TabsTrigger>
          <TabsTrigger value="upload">Upload an image</TabsTrigger>
        </TabsList>
        <TabsContent value="url" className="mt-4">
          <UrlCheckForm
            value={url}
            onChange={setUrl}
            onSubmit={() => void submitUrl()}
            loading={loading}
            submitLabel="Simulate this page"
            loadingLabel="Loading the page"
            error={urlError}
            help="We load the page once in a headless browser, 1280 pixels wide, as a signed-out visitor, and take a screenshot up to 4,000 pixels tall. Pages behind a login can't be loaded: upload a screenshot instead."
          />
        </TabsContent>
        <TabsContent value="upload" className="mt-4">
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
            <p id={fileHelpId} className="max-w-[60ch] text-sm leading-6 text-slate-600 dark:text-slate-400">
              Choose, drop or paste a screenshot, mock-up or design export (up to 25 MB). It stays in your browser and is never
              uploaded.
            </p>
            <input id={fileId} type="file" accept="image/*" onChange={onFileChange} aria-describedby={fileHelpId} className="peer sr-only" />
            <label
              htmlFor={fileId}
              className="mt-4 inline-flex h-10 cursor-pointer items-center gap-2 rounded-md bg-teal-700 px-4 text-sm font-semibold text-white hover:bg-teal-800 peer-focus-visible:ring-2 peer-focus-visible:ring-teal-600 peer-focus-visible:ring-offset-2 dark:peer-focus-visible:ring-offset-slate-900"
            >
              <ImagePlus className="h-4 w-4" aria-hidden="true" />
              Choose an image
            </label>
            {uploadError && (
              <p role="alert" className="mt-3 text-sm font-medium text-red-700 dark:text-red-300">
                {uploadError}
              </p>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <div role="status" aria-live="polite" className={cn(!status && "sr-only")}>
        {status && (
          <p className="rounded-md border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
            {status}
          </p>
        )}
      </div>

      {source && (
        <section aria-labelledby={resultsHeadingId} className="space-y-6">
          <div>
            <h2
              id={resultsHeadingId}
              ref={resultsHeadingRef}
              tabIndex={-1}
              className="break-words font-serif text-2xl font-semibold text-slate-900 outline-none focus-visible:ring-2 focus-visible:ring-teal-600 dark:text-white"
            >
              Simulations of {source.name}
            </h2>
            {source.kind === "url" && source.finalUrl && (
              <p className="mt-1 break-words text-sm text-slate-600 dark:text-slate-400">
                Captured from {source.finalUrl} at 1280 by 800 with reduced motion
                {source.truncated ? ". The page is longer than 4,000 pixels, so the screenshot stops there." : "."}
              </p>
            )}
          </div>

          <div className="grid gap-8 xl:grid-cols-[18rem_minmax(0,1fr)]">
            <div className="space-y-6">
              <fieldset>
                <legend className="text-sm font-semibold text-slate-900 dark:text-white">Condition</legend>
                <div className="mt-2 space-y-2 text-sm text-slate-800 dark:text-slate-200">
                  {CONDITIONS.map((c) => (
                    <label key={c.id} className="flex items-start gap-2">
                      <input
                        type="radio"
                        name={`${groupName}-condition`}
                        value={c.id}
                        checked={condition === c.id}
                        onChange={() => setCondition(c.id)}
                        aria-describedby={condition === c.id ? descriptionId : undefined}
                        className={radioClass}
                      />
                      <span>{c.label}</span>
                    </label>
                  ))}
                </div>
                <p id={descriptionId} className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  {info.description}
                </p>
              </fieldset>

              {info.severity && (
                <div>
                  <label htmlFor={severityId} className="flex flex-wrap justify-between gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                    <span>Severity</span>
                    <span className="font-normal tabular-nums text-slate-700 dark:text-slate-300">
                      {severityPercent}%, {severityName}
                    </span>
                  </label>
                  <input
                    id={severityId}
                    type="range"
                    min={10}
                    max={100}
                    step={10}
                    value={severityPercent}
                    onChange={(event) => setSeverityPercent(Number(event.target.value))}
                    aria-valuetext={`${severityPercent}%, ${severityName}`}
                    aria-describedby={`${severityId}-help`}
                    className="mt-2 w-full accent-teal-700"
                  />
                  <p id={`${severityId}-help`} className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-400">
                    100% is the full loss of one cone type. Lower values approximate the milder, more common anomalous forms.
                  </p>
                </div>
              )}

              {condition === "blur" && (
                <fieldset>
                  <legend className="text-sm font-semibold text-slate-900 dark:text-white">Blur level</legend>
                  <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-800 dark:text-slate-200">
                    {BLUR_LEVELS.map((level) => (
                      <label key={level.id} className="flex items-start gap-2">
                        <input
                          type="radio"
                          name={`${groupName}-blur`}
                          value={level.id}
                          checked={blur === level.id}
                          onChange={() => setBlur(level.id)}
                          className={radioClass}
                        />
                        <span>{level.label}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}

              <fieldset>
                <legend className="text-sm font-semibold text-slate-900 dark:text-white">View</legend>
                <div className="mt-2 space-y-2 text-sm text-slate-800 dark:text-slate-200">
                  {VIEWS.map((v) => (
                    <label key={v.id} className="flex items-start gap-2">
                      <input
                        type="radio"
                        name={`${groupName}-view`}
                        value={v.id}
                        checked={view === v.id}
                        onChange={() => setView(v.id)}
                        className={radioClass}
                      />
                      <span>{v.label}</span>
                    </label>
                  ))}
                  <label className="flex items-start gap-2 pt-2">
                    <input
                      type="checkbox"
                      checked={fullSize}
                      onChange={(event) => setFullSize(event.target.checked)}
                      className={radioClass}
                    />
                    <span>Show at full size instead of fitting the width</span>
                  </label>
                </div>
              </fieldset>
            </div>

            <div className="min-w-0 space-y-3">
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                Showing: {condition === "none" ? "the original, with no simulation" : describeSimulation(condition, { severity, blur })}
              </p>
              <SimulationViewer
                src={source.src}
                naturalWidth={source.width}
                naturalHeight={source.height}
                subject={source.subject}
                condition={condition}
                severity={severity}
                blur={blur}
                view={view}
                fullSize={fullSize}
              />
              <p className="text-xs leading-5 text-slate-600 dark:text-slate-400">
                A simulation is an approximation from a model of typical cone loss or blur. Real vision varies from person to
                person, so use it to find problems, not to decide what someone sees.
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 p-5 dark:border-slate-800">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">What to look for</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700 dark:text-slate-300">
              <li>
                Links, errors, required fields, chart series or status labels that you can only tell apart by colour. That fails{" "}
                <Link href="/wcag/1-4-1" className="font-medium text-teal-700 underline underline-offset-2 dark:text-teal-300">
                  1.4.1 Use of Color
                </Link>
                : add text, an icon, a pattern or an underline as well.
              </li>
              <li>
                Text that fades or blurs away before the rest of the page does. Measure it with the{" "}
                <Link href="/tools/contrast-checker" className="font-medium text-teal-700 underline underline-offset-2 dark:text-teal-300">
                  contrast checker
                </Link>{" "}
                against{" "}
                <Link href="/wcag/1-4-3" className="font-medium text-teal-700 underline underline-offset-2 dark:text-teal-300">
                  1.4.3 Contrast (Minimum)
                </Link>
                ; a simulation cannot give you the ratio.
              </li>
              <li>
                Field borders, icons and focus indicators that vanish. Those need 3:1 against what is next to them under{" "}
                <Link href="/wcag/1-4-11" className="font-medium text-teal-700 underline underline-offset-2 dark:text-teal-300">
                  1.4.11 Non-text Contrast
                </Link>
                .
              </li>
            </ul>
          </div>

          {source.kind === "url" && source.finalUrl && (
            <SiteScanHandoff
              source="website_vision_simulator"
              heading="Check the rest of this page"
              body="A simulation shows colour and contrast problems. The free scan runs axe-core on the same page and lists the other WCAG failures it can find automatically, from missing labels to empty links."
              defaultValue={source.finalUrl}
            />
          )}
        </section>
      )}
    </div>
  )
}
