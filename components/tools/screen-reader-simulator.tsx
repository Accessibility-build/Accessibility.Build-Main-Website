"use client"

import { useCallback, useEffect, useId, useRef, useState } from "react"
import { AlertTriangle, CheckCircle2, Info } from "lucide-react"
import { SiteScanHandoff } from "@/components/tools/site-scan-handoff"
import { UrlCheckForm } from "@/components/tools/url-check-form"
import { postTool } from "@/lib/render/client"
import type { LineFilter } from "@/lib/screen-reader/cursor"
import type { ScreenReaderResult } from "@/lib/screen-reader/types"
import { SummaryTabs } from "./screen-reader-simulator/summary-tabs"
import { TranscriptPanel } from "./screen-reader-simulator/transcript-panel"

// Screen reader preview. The server renders the page in Chrome, reads the accessibility tree and
// sends back a browse-mode transcript with summaries; this component shows them with a virtual
// cursor and optional speech. It is a preview of the data screen readers start from, not an
// emulation of any one screen reader, and the copy says so.

const ENDPOINT = "/api/tools/screen-reader-simulator"

function plural(count: number, one: string, many: string): string {
  return `${count.toLocaleString("en-GB")} ${count === 1 ? one : many}`
}

export default function ScreenReaderSimulator() {
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState("")
  const [result, setResult] = useState<ScreenReaderResult | null>(null)
  const [runId, setRunId] = useState(0)
  const [cursor, setCursor] = useState(0)
  const [filter, setFilter] = useState<LineFilter>("all")
  const [focusToken, setFocusToken] = useState(0)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const controllerRef = useRef<AbortController | null>(null)
  const headingId = useId()
  const transcriptHeadingId = useId()
  const summaryHeadingId = useId()

  useEffect(() => () => controllerRef.current?.abort(), [])

  useEffect(() => {
    if (result) headingRef.current?.focus()
  }, [result])

  const run = async () => {
    if (!url.trim()) {
      setError("Enter a page address, for example https://example.com")
      return
    }
    controllerRef.current?.abort()
    const controller = new AbortController()
    controllerRef.current = controller
    setLoading(true)
    setError(null)
    setStatus("Loading the page in Chrome and reading its accessibility tree. This usually takes 10 to 30 seconds.")
    try {
      const data = await postTool<ScreenReaderResult>(ENDPOINT, { url }, controller.signal)
      const problems = Object.values(data.summaries).reduce((sum, summary) => sum + summary.problems, 0)
      setResult(data)
      setRunId((value) => value + 1)
      setCursor(0)
      setFilter("all")
      setStatus(`Preview ready: ${plural(data.lines.length, "line", "lines")}, ${plural(problems, "problem", "problems")} flagged.`)
    } catch (caught) {
      if ((caught as Error)?.name === "AbortError") return
      setError(caught instanceof Error ? caught.message : "The check failed. Please try again.")
      setStatus("")
    } finally {
      if (controllerRef.current === controller) setLoading(false)
    }
  }

  const showLine = useCallback((line: number) => {
    setFilter("all")
    setCursor(line)
    setFocusToken((value) => value + 1)
  }, [])

  const problems = result ? Object.values(result.summaries).reduce((sum, summary) => sum + summary.problems, 0) : 0

  return (
    <div>
      <UrlCheckForm
        value={url}
        onChange={setUrl}
        onSubmit={run}
        loading={loading}
        submitLabel="Preview this page"
        loadingLabel="Reading the page"
        help="Any public page. We load it in Chrome, read its accessibility tree and write out what a screen reader would come across, in reading order. The transcript is not saved."
        error={error}
      />

      <div role="status" aria-live="polite" className="mt-4 text-sm text-slate-700 dark:text-slate-300">
        {status}
      </div>

      {result && (
        <section aria-labelledby={headingId} className="mt-8 space-y-10">
          <div>
            <h2
              id={headingId}
              ref={headingRef}
              tabIndex={-1}
              className="font-serif text-2xl font-semibold text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 dark:text-white sm:text-3xl"
            >
              What a screen reader would come across
            </h2>
            <p className="mt-2 break-words text-slate-700 dark:text-slate-300">
              <span className="font-medium text-slate-900 dark:text-white">{result.title || "Untitled page"}</span>
              <span className="text-slate-600 dark:text-slate-400"> &middot; {result.finalUrl}</span>
            </p>
            <ul className="mt-4 space-y-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
              <li className="flex items-start gap-2">
                {problems > 0 ? (
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-700 dark:text-red-300" aria-hidden="true" />
                ) : (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-700 dark:text-teal-300" aria-hidden="true" />
                )}
                <span>
                  {problems > 0
                    ? `${plural(problems, "problem", "problems")} flagged in the headings, landmarks, links, form fields, images and buttons. They are listed under the transcript and marked on the lines that announce them.`
                    : "No problems flagged in the headings, landmarks, links, form fields, images or buttons. Whether the names make sense still needs a person to judge."}
                </span>
              </li>
              {result.trimmed && (
                <li className="flex items-start gap-2">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-slate-600 dark:text-slate-400" aria-hidden="true" />
                  <span>
                    This page has {plural(result.trimmed.elements, "element", "elements")}, more than the preview can read.
                    It covers the first {result.trimmed.read.toLocaleString("en-GB")} in source order, so the transcript
                    and the lists stop part way down the page.
                  </span>
                </li>
              )}
              {result.truncated && (
                <li className="flex items-start gap-2">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-slate-600 dark:text-slate-400" aria-hidden="true" />
                  <span>
                    {result.trimmed ? "The part read" : "This page"} reads as about {plural(result.totalLines, "line", "lines")}. The
                    transcript shows the first {result.lines.length.toLocaleString("en-GB")};{" "}
                    {result.trimmed ? "the lists cover everything that was read." : "the lists further down cover the whole page."}
                  </span>
                </li>
              )}
              <li className="flex items-start gap-2">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-slate-600 dark:text-slate-400" aria-hidden="true" />
                <span>
                  Built from Chrome&apos;s accessibility tree. NVDA, JAWS, VoiceOver and TalkBack word things differently and
                  add behaviour of their own, so treat this as a preview and confirm with a real screen reader.
                </span>
              </li>
            </ul>
          </div>

          <section aria-labelledby={transcriptHeadingId}>
            <h3 id={transcriptHeadingId} className="text-xl font-semibold text-slate-900 dark:text-white">
              Transcript in reading order
            </h3>
            <p className="mt-1 max-w-[68ch] text-sm leading-6 text-slate-600 dark:text-slate-400">
              One line per stop, the way a screen reader&apos;s browse mode moves with the down arrow. Filter it like a
              screen reader&apos;s list of elements, step through it with the virtual cursor, or have it read aloud.
            </p>
            <div className="mt-4">
              <TranscriptPanel
                key={runId}
                lines={result.lines}
                cursor={cursor}
                onCursor={setCursor}
                filter={filter}
                onFilter={setFilter}
                focusToken={focusToken}
              />
            </div>
          </section>

          <section aria-labelledby={summaryHeadingId}>
            <h3 id={summaryHeadingId} className="text-xl font-semibold text-slate-900 dark:text-white">
              What a screen reader user would list
            </h3>
            <p className="mt-1 max-w-[68ch] text-sm leading-6 text-slate-600 dark:text-slate-400">
              Screen reader users jump around a page by pulling up its headings, landmarks, links and controls. These
              are those lists for this page, with the problems that make them hard to use.
            </p>
            <div className="mt-4">
              <SummaryTabs key={runId} summaries={result.summaries} onShowLine={showLine} />
            </div>
          </section>

          <SiteScanHandoff
            source="screen_reader_simulator"
            heading="Check the rest of the page"
            body="The transcript shows what is announced. The free scan runs axe-core on the same page for contrast, missing labels, ARIA errors and other failures, and scores it."
            defaultValue={result.url}
            headingLevel="h3"
          />
        </section>
      )}
    </div>
  )
}
