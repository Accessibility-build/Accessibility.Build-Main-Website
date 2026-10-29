"use client"

import { useEffect, useId, useMemo, useRef, useState } from "react"
import { AlertTriangle, CheckCircle2, Info, Keyboard, MousePointerClick, XCircle } from "lucide-react"
import { UrlCheckForm } from "@/components/tools/url-check-form"
import { SiteScanHandoff } from "@/components/tools/site-scan-handoff"
import { ScreenshotOverlay, type OverlayMarker } from "@/components/tools/focus-order-checker/screenshot-overlay"
import { ExemptTargetList, ProblemLine, StopList, TargetList } from "@/components/tools/focus-order-checker/result-lists"
import { postTool } from "@/lib/render/client"
import { focusAltText, focusHeadline, plural, stopHasProblem, targetsAltText, targetsHeadline } from "@/lib/focus-order/describe"
import type { CheckMode, CheckResult, FocusResult, TargetDevice, TargetsResult } from "@/lib/focus-order/types"
import { cn } from "@/lib/utils"

// Keyboard focus order checker. The server loads the page in Chrome and either presses Tab through
// it, recording every stop, or measures every pointer target against WCAG 2.5.8. This component
// draws the result over the page screenshot and lists the same items as text, so the screenshot is
// never the only way to read it.

const ENDPOINT = "/api/tools/focus-order-checker"

const MODES: { value: CheckMode; label: string; help: string; icon: typeof Keyboard }[] = [
  {
    value: "focus",
    label: "Focus order and visibility",
    help: "Presses Tab through the page, up to 80 stops, and checks each one.",
    icon: Keyboard,
  },
  {
    value: "targets",
    label: "Target size (WCAG 2.5.8)",
    help: "Measures every link, button and control against 24 by 24 pixels.",
    icon: MousePointerClick,
  },
]

const DEVICES: { value: TargetDevice; label: string; help: string }[] = [
  { value: "desktop", label: "Desktop", help: "1280 by 800 pixels" },
  { value: "mobile", label: "Phone", help: "390 by 844 pixels, with touch" },
]

interface FocusOrderCheckerProps {
  /** Which check is selected first: the target size checker page opens on "targets". */
  initialMode?: CheckMode
  /** Screen size selected first for target size. */
  initialDevice?: TargetDevice
  /** Analytics source for the scan handoff, so the two pages can be told apart. */
  source?: string
}

export default function FocusOrderChecker({ initialMode = "focus", initialDevice = "desktop", source = "focus_order_checker" }: FocusOrderCheckerProps) {
  const [url, setUrl] = useState("")
  const [mode, setMode] = useState<CheckMode>(initialMode)
  const [device, setDevice] = useState<TargetDevice>(initialDevice)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<CheckResult | null>(null)
  const [status, setStatus] = useState("")
  const abortRef = useRef<AbortController | null>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const modeName = useId()
  const deviceName = useId()

  useEffect(() => () => abortRef.current?.abort(), [])

  useEffect(() => {
    if (result) headingRef.current?.focus()
  }, [result])

  const run = async () => {
    if (!url.trim()) {
      setError("Enter a page address, for example https://example.com")
      return
    }
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller
    setLoading(true)
    setError(null)
    setResult(null)
    setStatus(
      mode === "focus"
        ? "Loading the page and pressing Tab through it. This can take up to a minute."
        : "Loading the page and measuring its targets. This usually takes 15 to 30 seconds.",
    )
    try {
      const data = await postTool<CheckResult>(ENDPOINT, { url, mode, device }, controller.signal)
      setResult(data)
      setStatus(`Results ready. ${data.mode === "focus" ? focusHeadline(data) : targetsHeadline(data)}`)
    } catch (caught) {
      if ((caught as Error)?.name === "AbortError") return
      // The form announces the error itself (role="alert"), so the status region stays quiet.
      setError(caught instanceof Error ? caught.message : "The check failed. Please try again.")
      setStatus("")
    } finally {
      if (abortRef.current === controller) setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <UrlCheckForm
        value={url}
        onChange={setUrl}
        onSubmit={run}
        loading={loading}
        submitLabel="Check this page"
        loadingLabel={mode === "focus" ? "Tabbing through the page" : "Measuring targets"}
        help={
          mode === "targets" && device === "mobile"
            ? "A public page. We load it in Chrome as a 390 by 844 pixel phone with touch, as a first-time visitor with no cookies."
            : "A public page. We load it in Chrome at 1280 by 800 pixels, as a first-time visitor with no cookies."
        }
        error={error}
      >
        <fieldset>
          <legend className="text-sm font-semibold text-slate-900 dark:text-white">What to check</legend>
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            {MODES.map((option) => {
              const Icon = option.icon
              const id = `${modeName}-${option.value}`
              return (
                <label
                  key={option.value}
                  htmlFor={id}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-teal-600",
                    mode === option.value
                      ? "border-teal-600 bg-teal-50 dark:border-teal-400 dark:bg-teal-950/40"
                      : "border-slate-300 dark:border-slate-700",
                  )}
                >
                  <input
                    id={id}
                    type="radio"
                    name={modeName}
                    value={option.value}
                    checked={mode === option.value}
                    onChange={() => setMode(option.value)}
                    className="mt-1 h-4 w-4 accent-teal-700"
                  />
                  <span>
                    <span className="flex items-center gap-1.5 font-medium text-slate-900 dark:text-white">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                      {option.label}
                    </span>
                    <span className="mt-0.5 block text-slate-600 dark:text-slate-400">{option.help}</span>
                  </span>
                </label>
              )
            })}
          </div>
        </fieldset>
        {mode === "targets" && (
          <fieldset className="mt-4">
            <legend className="text-sm font-semibold text-slate-900 dark:text-white">Screen size</legend>
            <div className="mt-2 flex flex-wrap gap-3">
              {DEVICES.map((option) => {
                const id = `${deviceName}-${option.value}`
                return (
                  <label
                    key={option.value}
                    htmlFor={id}
                    className={cn(
                      "flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-teal-600",
                      device === option.value
                        ? "border-teal-600 bg-teal-50 dark:border-teal-400 dark:bg-teal-950/40"
                        : "border-slate-300 dark:border-slate-700",
                    )}
                  >
                    <input
                      id={id}
                      type="radio"
                      name={deviceName}
                      value={option.value}
                      checked={device === option.value}
                      onChange={() => setDevice(option.value)}
                      className="h-4 w-4 accent-teal-700"
                    />
                    <span className="font-medium text-slate-900 dark:text-white">{option.label}</span>
                    <span className="text-slate-600 dark:text-slate-400">{option.help}</span>
                  </label>
                )
              })}
            </div>
          </fieldset>
        )}
      </UrlCheckForm>

      <p role="status" aria-live="polite" className={cn("text-sm text-slate-700 dark:text-slate-300", !status && "sr-only")}>
        {status}
      </p>

      {result && (
        <section aria-labelledby="focus-order-results" className="space-y-6">
          <div>
            <h2
              id="focus-order-results"
              ref={headingRef}
              tabIndex={-1}
              className="font-serif text-2xl font-semibold text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 dark:text-white sm:text-3xl"
            >
              {result.mode === "focus" ? "Focus order results" : `Target size results${result.device === "mobile" ? " on a phone" : ""}`}
            </h2>
            <p className="mt-2 break-all text-sm text-slate-600 dark:text-slate-400">
              {result.title ? `${result.title}, ` : ""}
              {result.finalUrl}
            </p>
          </div>
          {result.mode === "focus" ? <FocusResults result={result} /> : <TargetResults result={result} />}
          <SiteScanHandoff
            source={source}
            heading="Check the rest of this page"
            body="Keyboard access is one part of WCAG. The free scan runs axe-core on the same page and reports colour contrast, missing labels, alt text and more."
            defaultValue={result.finalUrl}
          />
        </section>
      )}
    </div>
  )
}

/** Shared state for the screenshot and its list: which item is highlighted, and scroll requests. */
function useHighlight() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [reveal, setReveal] = useState<{ index: number; nonce: number } | null>(null)
  return {
    activeIndex,
    reveal,
    onHover: setActiveIndex,
    onShow: (index: number) => {
      setActiveIndex(index)
      setReveal((previous) => ({ index, nonce: (previous?.nonce ?? 0) + 1 }))
    },
  }
}

function Stat({ label, value, tone }: { label: string; value: string | number; tone: "neutral" | "good" | "bad" | "note" }) {
  const Icon = tone === "bad" ? XCircle : tone === "good" ? CheckCircle2 : tone === "note" ? Info : null
  return (
    <div
      className={cn(
        "rounded-lg border p-3",
        tone === "bad" ? "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/40" : "border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900",
      )}
    >
      <dt className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400">
        {Icon && (
          <Icon
            className={cn(
              "h-3.5 w-3.5",
              tone === "bad" && "text-red-700 dark:text-red-300",
              tone === "good" && "text-emerald-700 dark:text-emerald-300",
            )}
            aria-hidden="true"
          />
        )}
        {label}
      </dt>
      <dd className="mt-1 text-2xl font-semibold text-slate-900 dark:text-white">{value}</dd>
    </div>
  )
}

function FocusResults({ result }: { result: FocusResult }) {
  const highlight = useHighlight()
  const [onlyProblems, setOnlyProblems] = useState(false)
  const filterId = useId()
  const { summary } = result
  const stops = onlyProblems ? result.stops.filter(stopHasProblem) : result.stops
  const markers = useMemo<OverlayMarker[]>(
    () =>
      result.stops
        .filter((stop) => stop.marker)
        .map((stop) => {
          const problem = stopHasProblem(stop)
          return { index: stop.index, box: stop.marker!, tone: problem ? "fail" : "ok", shape: problem ? "square" : "circle", dashed: problem }
        }),
    [result],
  )
  const tone = (count: number) => (count > 0 ? "bad" : "good")
  const ended = result.ended === "trap" || result.ended === "dialog" || result.ended === "time-limit" || result.ended === "stop-limit"

  return (
    <div className="space-y-6">
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Stat label="Stops checked" value={summary.stops} tone="neutral" />
        <Stat label="No visible focus" value={summary.noIndicator} tone={tone(summary.noIndicator)} />
        <Stat label="Hidden behind content" value={summary.obscured} tone={tone(summary.obscured)} />
        <Stat label="Invisible or off-screen" value={summary.invisible} tone={tone(summary.invisible)} />
        <Stat label="Keyboard trap" value={summary.trap ? "Yes" : "No"} tone={summary.trap ? "bad" : "good"} />
        <Stat label="Positive tabindex" value={summary.positiveTabindex} tone={summary.positiveTabindex > 0 ? "note" : "good"} />
      </dl>

      <div
        className={cn(
          "flex items-start gap-3 rounded-lg border p-4 text-sm",
          ended ? "border-amber-300 bg-amber-50 text-amber-950 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100" : "border-slate-200 bg-slate-50 text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200",
        )}
      >
        {ended ? <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /> : <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />}
        <div className="space-y-1">
          <p>
            <strong className="font-semibold">How the run ended:</strong> {result.endNote}
          </p>
          {(summary.uncertain > 0 || summary.partlyObscured > 0 || summary.backwardJumps > 0 || summary.frames > 0) && (
            <p>
              Also noted:{" "}
              {[
                summary.uncertain && `${plural(summary.uncertain, "stop")} we could not judge because the area moves`,
                summary.partlyObscured && `${plural(summary.partlyObscured, "stop")} partly covered (AAA)`,
                summary.backwardJumps && `${plural(summary.backwardJumps, "jump")} back up the page`,
                summary.frames && `${plural(summary.frames, "embedded frame")} not inspected`,
              ]
                .filter(Boolean)
                .join("; ")}
              .
            </p>
          )}
        </div>
      </div>

      {(result.problems.length > 0 || result.revisits.length > 0) && (
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Page-wide findings</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {result.problems.map((problem, i) => (
              <ProblemLine key={i} problem={problem} />
            ))}
            {result.revisits.map((entry) => (
              <ProblemLine
                key={`${entry.after}-${entry.to}`}
                problem={{
                  severity: "info",
                  criterion: "2.4.3",
                  message: `After stop ${entry.after}, Tab moved focus back to stop ${entry.to}. Check that this is intended.`,
                }}
              />
            ))}
          </ul>
          {result.positiveTabindex.selectors.length > 0 && (
            <details className="mt-2 text-sm">
              <summary className="cursor-pointer font-medium text-teal-800 underline underline-offset-2 dark:text-teal-300">
                Elements with a positive tabindex
              </summary>
              <ul className="mt-2 space-y-1 font-mono text-xs text-slate-700 dark:text-slate-300">
                {result.positiveTabindex.selectors.map((selector) => (
                  <li key={selector} className="break-all">
                    {selector}
                  </li>
                ))}
              </ul>
            </details>
          )}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <div className="min-w-0 lg:sticky lg:top-28 lg:self-start">
          <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">The page, with the Tab order drawn on it</h3>
          <Legend kind="focus" />
          <ScreenshotOverlay
            screenshot={result.screenshot}
            alt={focusAltText(result)}
            label="Screenshot with focus stops"
            markers={markers}
            path
            activeIndex={highlight.activeIndex}
            reveal={highlight.reveal}
          />
          {result.screenshot.truncated && (
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">The page is taller than the screenshot, which stops at {result.screenshot.height} pixels.</p>
          )}
        </div>
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Every stop, in order</h3>
            <label htmlFor={filterId} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
              <input
                id={filterId}
                type="checkbox"
                checked={onlyProblems}
                onChange={(event) => setOnlyProblems(event.target.checked)}
                className="h-4 w-4 accent-teal-700"
              />
              Only stops with problems
            </label>
          </div>
          {stops.length > 0 ? (
            <StopList stops={stops} {...highlight} />
          ) : (
            <p className="text-sm text-slate-700 dark:text-slate-300">{result.stops.length === 0 ? "Pressing Tab did not reach anything." : "No stop has a problem."}</p>
          )}
        </div>
      </div>
    </div>
  )
}

function TargetResults({ result }: { result: TargetsResult }) {
  const highlight = useHighlight()
  const { totals } = result
  const drawn = result.targets.filter((target) => target.status === "fail" || target.status === "spacing")
  const exempt = result.targets.filter((target) => target.status === "inline" || target.status === "user-agent")
  const markers = useMemo<OverlayMarker[]>(
    () =>
      drawn.map((target) => ({
        index: target.index,
        box: target.box,
        tone: target.status === "fail" ? "fail" : "spacing",
        shape: target.status === "fail" ? "square" : "circle",
        dashed: target.status === "spacing",
      })),
    [drawn],
  )

  return (
    <div className="space-y-6">
      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Stat label="Targets measured" value={totals.targets} tone="neutral" />
        <Stat label="24 px or larger" value={totals.largeEnough} tone="neutral" />
        <Stat label="Fail 2.5.8" value={totals.failing} tone={totals.failing > 0 ? "bad" : "good"} />
        <Stat label="Pass by spacing" value={totals.passBySpacing} tone="note" />
        <Stat label="Inline links" value={totals.inline} tone="note" />
        <Stat label="Browser default" value={totals.userAgent} tone="note" />
      </dl>
      <p className="text-sm text-slate-700 dark:text-slate-300">
        {targetsHeadline(result)}{" "}Inline links and controls left at the browser&apos;s default size are exempt. A target can also pass
        if another control on the page does the same thing at full size, or if its size is essential; we cannot detect those,
        so review the failures with that in mind.
        {result.listTruncated && ` The list shows the first ${result.targets.length} undersized targets.`}
      </p>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
        <div className="min-w-0 lg:sticky lg:top-28 lg:self-start">
          <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">The page, with undersized targets outlined</h3>
          <Legend kind="targets" />
          <ScreenshotOverlay
            screenshot={result.screenshot}
            alt={targetsAltText(result)}
            label="Screenshot with undersized targets"
            markers={markers}
            activeIndex={highlight.activeIndex}
            reveal={highlight.reveal}
          />
          {result.screenshot.truncated && (
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">The page is taller than the screenshot, which stops at {result.screenshot.height} pixels.</p>
          )}
        </div>
        <div className="min-w-0">
          <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">Undersized targets</h3>
          {drawn.length > 0 ? (
            <TargetList targets={drawn} {...highlight} />
          ) : (
            <p className="flex items-start gap-2 text-sm text-emerald-800 dark:text-emerald-300">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              Every target is at least 24 by 24 pixels, or exempt.
            </p>
          )}
          {exempt.length > 0 && (
            <details className="mt-6 rounded-lg border border-slate-200 p-3 dark:border-slate-800">
              <summary className="cursor-pointer text-sm font-medium text-slate-900 dark:text-white">
                {plural(exempt.length, "exempt target")} (not drawn on the screenshot)
              </summary>
              <ExemptTargetList targets={exempt} />
            </details>
          )}
        </div>
      </div>
    </div>
  )
}

function Legend({ kind }: { kind: "focus" | "targets" }) {
  return (
    <ul className="mb-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-700 dark:text-slate-300" aria-label="Key to the screenshot">
      {kind === "focus" ? (
        <>
          <li className="flex items-center gap-1.5">
            <span aria-hidden="true" className="h-4 w-4 rounded-full bg-teal-700" />
            Round badge, solid outline: no problem found
          </li>
          <li className="flex items-center gap-1.5">
            <span aria-hidden="true" className="h-4 w-4 rounded-sm bg-red-700" />
            Square badge, dashed outline: has a problem
          </li>
          <li className="flex items-center gap-1.5">
            <span aria-hidden="true" className="w-5 border-t-2 border-dashed border-teal-700" />
            Line: the order Tab follows
          </li>
        </>
      ) : (
        <>
          <li className="flex items-center gap-1.5">
            <span aria-hidden="true" className="h-4 w-4 rounded-sm bg-red-700" />
            Square badge, solid outline: fails
          </li>
          <li className="flex items-center gap-1.5">
            <span aria-hidden="true" className="h-4 w-4 rounded-full bg-amber-700" />
            Round badge, dashed outline: passes by spacing
          </li>
        </>
      )}
    </ul>
  )
}
