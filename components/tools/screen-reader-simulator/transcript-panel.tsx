"use client"

import { memo, useCallback, useEffect, useId, useMemo, useRef, useState } from "react"
import { AlertTriangle, ArrowDown, ArrowUp, ChevronRight, ClipboardCopy, Info, Pause, Play, Square } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  FILTERS,
  filterLines,
  positionOf,
  stepHeading,
  stepLine,
  transcriptText,
  type IndexedLine,
  type LineFilter,
} from "@/lib/screen-reader/cursor"
import type { TranscriptLine } from "@/lib/screen-reader/types"
import { cn } from "@/lib/utils"
import { useSpeech } from "./use-speech"

// The transcript as a list with a virtual cursor: Next and Previous line, jumps between headings,
// filters like a screen reader's elements list, and optional speech that reads from the cursor.
//
// No live region follows the transcript while speech plays, because a visitor using a real screen
// reader would hear both. Only a step the visitor takes with the buttons is announced.

interface TranscriptPanelProps {
  lines: TranscriptLine[]
  cursor: number
  onCursor: (index: number) => void
  filter: LineFilter
  onFilter: (filter: LineFilter) => void
  /** Changes when the summaries ask the transcript to take focus ("Show in transcript"). */
  focusToken: number
}

function prefersReducedMotion(): boolean {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches
  } catch {
    return false
  }
}

function describe(line: IndexedLine): string {
  return `Line ${line.index + 1}: ${line.text}${line.issue ? `. Problem: ${line.issue}` : ""}`
}

const LineItem = memo(function LineItem({ line, current }: { line: IndexedLine; current: boolean }) {
  return (
    <li
      data-index={line.index}
      aria-current={current ? "true" : undefined}
      className={cn(
        "flex gap-2 border-l-4 py-1.5 pl-2 pr-3",
        current ? "border-teal-700 bg-teal-50 dark:border-teal-300 dark:bg-teal-950/50" : "border-transparent",
      )}
    >
      <span className="w-10 shrink-0 text-right font-mono text-xs leading-6 tabular-nums text-slate-600 dark:text-slate-400">
        {line.index + 1}
      </span>
      <span className="flex w-4 shrink-0 items-start pt-1" aria-hidden="true">
        {current && <ChevronRight className="h-4 w-4 text-teal-800 dark:text-teal-300" />}
      </span>
      <span className="min-w-0 flex-1 break-words leading-6">
        {current && <span className="sr-only">Current line: </span>}
        <span
          className={cn(
            line.kind === "heading" && "font-semibold text-slate-900 dark:text-white",
            line.kind === "landmark" && "italic text-teal-800 dark:text-teal-300",
            line.kind !== "heading" && line.kind !== "landmark" && "text-slate-800 dark:text-slate-200",
            current && "font-semibold",
          )}
        >
          {line.text}
        </span>
        {line.issue && (
          <span className="mt-0.5 flex items-start gap-1.5 text-sm text-red-700 dark:text-red-300">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>Problem: {line.issue}</span>
          </span>
        )}
        {line.note && (
          <span className="mt-0.5 flex items-start gap-1.5 text-sm text-slate-600 dark:text-slate-400">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>{line.note}</span>
          </span>
        )}
      </span>
    </li>
  )
})

export function TranscriptPanel({ lines, cursor, onCursor, filter, onFilter, focusToken }: TranscriptPanelProps) {
  const speech = useSpeech()
  const { stop: stopSpeech, pause: pauseSpeech } = speech
  const [announcement, setAnnouncement] = useState("")
  const [copyStatus, setCopyStatus] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)
  const id = useId()

  const visible = useMemo(() => filterLines(lines, filter), [lines, filter])
  const counts = useMemo(() => new Map(FILTERS.map((option) => [option.value, filterLines(lines, option.value).length])), [lines])
  const position = positionOf(visible, cursor)
  const current = position >= 0 ? visible[position] : undefined

  // Keep the cursor on a visible line when the filter hides the one it was on.
  useEffect(() => {
    if (current && current.index !== cursor) onCursor(current.index)
  }, [current, cursor, onCursor])

  // A different filter is a different reading order; stop rather than jump.
  useEffect(() => {
    stopSpeech()
  }, [filter, lines, stopSpeech])

  // Scroll the transcript box, not the page, so the current line stays in view.
  useEffect(() => {
    const box = scrollRef.current
    if (!box || !current) return
    const item = box.querySelector<HTMLElement>(`[data-index="${current.index}"]`)
    if (!item) return
    const top = item.offsetTop
    const bottom = top + item.offsetHeight
    if (top >= box.scrollTop && bottom <= box.scrollTop + box.clientHeight) return
    box.scrollTo({ top: Math.max(0, top - box.clientHeight / 3), behavior: prefersReducedMotion() ? "auto" : "smooth" })
  }, [current])

  useEffect(() => {
    if (focusToken > 0) scrollRef.current?.focus()
  }, [focusToken])

  // The buttons stay focusable at either end (aria-disabled), so focus is never dropped; a press
  // there says why nothing moved.
  const move = useCallback(
    (target: number | null, none: string) => {
      if (target === null) {
        setAnnouncement(none)
        return
      }
      if (speech.state === "playing") pauseSpeech()
      onCursor(target)
      const line = lines[target]
      if (line) setAnnouncement(describe({ ...line, index: target }))
    },
    [lines, onCursor, pauseSpeech, speech.state],
  )

  const previousLine = stepLine(visible, cursor, -1)
  const nextLine = stepLine(visible, cursor, 1)
  const previousHeading = stepHeading(visible, cursor, -1)
  const nextHeading = stepHeading(visible, cursor, 1)

  const togglePlay = () => {
    if (speech.state === "playing") {
      speech.pause()
      return
    }
    const start = Math.max(0, position)
    speech.play(
      visible.slice(start).map((line) => ({ index: line.index, text: line.text })),
      onCursor,
    )
  }

  const stop = () => {
    if (speech.state === "stopped") return
    speech.stop()
    if (visible[0]) onCursor(visible[0].index)
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(transcriptText(visible))
      setCopyStatus(`Copied ${visible.length} ${visible.length === 1 ? "line" : "lines"}.`)
    } catch {
      setCopyStatus("Copying failed. Select the transcript text and copy it instead.")
    }
  }

  const buttonClass =
    "focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 aria-disabled:cursor-not-allowed aria-disabled:opacity-60 dark:focus-visible:ring-offset-slate-950"

  return (
    <div className="space-y-5">
      <fieldset>
        <legend className="text-sm font-semibold text-slate-900 dark:text-white">Show</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {FILTERS.map((option) => {
            const inputId = `${id}-filter-${option.value}`
            return (
              <div key={option.value}>
                <input
                  type="radio"
                  id={inputId}
                  name={`${id}-filter`}
                  value={option.value}
                  checked={filter === option.value}
                  onChange={() => onFilter(option.value)}
                  className="peer sr-only"
                />
                <label
                  htmlFor={inputId}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 peer-checked:border-teal-700 peer-checked:bg-teal-700 peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-teal-600 peer-focus-visible:ring-offset-2 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800 dark:peer-checked:border-teal-300 dark:peer-checked:bg-teal-300 dark:peer-checked:text-slate-950 dark:peer-focus-visible:ring-offset-slate-950"
                >
                  {option.label}
                  <span className="tabular-nums">({counts.get(option.value) ?? 0})</span>
                </label>
              </div>
            )
          })}
        </div>
      </fieldset>

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">
          {current ? `Virtual cursor: line ${current.index + 1} (${position + 1} of ${visible.length} shown)` : "Virtual cursor"}
        </p>
        <p className="mt-1 break-words text-lg font-medium text-slate-900 dark:text-white">
          {current ? current.text : "No lines match this filter."}
        </p>
        {current?.issue && (
          <p className="mt-1 flex items-start gap-1.5 text-sm text-red-700 dark:text-red-300">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <span>Problem: {current.issue}</span>
          </p>
        )}
        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Move the virtual cursor">
          <Button type="button" variant="outline" size="sm" className={buttonClass} aria-disabled={previousLine === null || undefined} onClick={() => move(previousLine, "No earlier lines.")}>
            <ArrowUp aria-hidden="true" />
            Previous line
          </Button>
          <Button type="button" variant="outline" size="sm" className={buttonClass} aria-disabled={nextLine === null || undefined} onClick={() => move(nextLine, "No more lines.")}>
            <ArrowDown aria-hidden="true" />
            Next line
          </Button>
          <Button type="button" variant="outline" size="sm" className={buttonClass} aria-disabled={previousHeading === null || undefined} onClick={() => move(previousHeading, "No earlier headings.")}>
            Previous heading
          </Button>
          <Button type="button" variant="outline" size="sm" className={buttonClass} aria-disabled={nextHeading === null || undefined} onClick={() => move(nextHeading, "No more headings.")}>
            Next heading
          </Button>
        </div>
        <p aria-live="polite" className="sr-only">
          {announcement}
        </p>
      </div>

      <fieldset className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
        <legend className="px-1 text-sm font-semibold text-slate-900 dark:text-white">Speech (optional)</legend>
        {speech.supported ? (
          <>
            <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
              Reads the shown lines aloud from the virtual cursor with your browser&apos;s built-in voices. It only
              starts when you press Play. If you use a screen reader, you may prefer to move through the lines with
              the buttons above instead.
            </p>
            <div className="mt-3 flex flex-wrap items-end gap-3">
              <Button
                type="button"
                size="sm"
                className={cn(buttonClass, "bg-teal-700 text-white hover:bg-teal-800 dark:bg-teal-300 dark:text-slate-950 dark:hover:bg-teal-200")}
                onClick={togglePlay}
                disabled={!current}
              >
                {speech.state === "playing" ? (
                  <>
                    <Pause aria-hidden="true" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play aria-hidden="true" />
                    {speech.state === "paused" ? "Resume" : "Play"}
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className={buttonClass}
                onClick={stop}
                aria-disabled={speech.state === "stopped" || undefined}
              >
                <Square aria-hidden="true" />
                Stop
              </Button>
              <div>
                <label htmlFor={`${id}-rate`} className="block text-sm font-medium text-slate-900 dark:text-white">
                  Rate <span className="tabular-nums text-slate-600 dark:text-slate-400">{speech.rate.toFixed(1)}x</span>
                </label>
                <input
                  id={`${id}-rate`}
                  type="range"
                  min={0.5}
                  max={2.5}
                  step={0.1}
                  value={speech.rate}
                  onChange={(event) => speech.setRate(Number(event.target.value))}
                  aria-valuetext={`${speech.rate.toFixed(1)} times normal speed`}
                  className="mt-1 w-40 accent-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 dark:accent-teal-300"
                />
              </div>
              {speech.voices.length > 0 && (
                <div className="min-w-0">
                  <label htmlFor={`${id}-voice`} className="block text-sm font-medium text-slate-900 dark:text-white">
                    Voice
                  </label>
                  <select
                    id={`${id}-voice`}
                    value={speech.voiceURI}
                    onChange={(event) => speech.setVoiceURI(event.target.value)}
                    className="mt-1 h-9 w-full max-w-[16rem] rounded-md border border-slate-300 bg-white px-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 dark:border-slate-600 dark:bg-slate-950 dark:text-slate-100"
                  >
                    <option value="">Browser default</option>
                    {speech.voices.map((voice) => (
                      <option key={voice.voiceURI} value={voice.voiceURI}>
                        {voice.name} ({voice.lang})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-400">
              Changes to the rate or voice apply from the next line.
            </p>
          </>
        ) : (
          <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
            Your browser does not offer speech, so the preview is text only. Everything else works the same.
          </p>
        )}
      </fieldset>

      <div>
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {visible.length} {visible.length === 1 ? "line" : "lines"} shown
          </p>
          <div className="flex items-center gap-3">
            <p role="status" className="text-sm text-slate-600 dark:text-slate-400">
              {copyStatus}
            </p>
            <Button type="button" variant="outline" size="sm" className={buttonClass} onClick={copy} disabled={visible.length === 0}>
              <ClipboardCopy aria-hidden="true" />
              Copy transcript
            </Button>
          </div>
        </div>
        <div
          ref={scrollRef}
          role="region"
          aria-label="Transcript lines"
          tabIndex={0}
          className="relative max-h-[36rem] overflow-y-auto rounded-lg border border-slate-200 bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 dark:border-slate-800 dark:bg-slate-950 dark:focus-visible:ring-offset-slate-950"
        >
          {visible.length === 0 ? (
            <p className="p-4 text-sm text-slate-600 dark:text-slate-400">No lines match this filter.</p>
          ) : (
            <ol className="divide-y divide-slate-100 py-1 text-sm dark:divide-slate-800/70 sm:text-base">
              {visible.map((line) => (
                <LineItem key={line.index} line={line} current={line.index === current?.index} />
              ))}
            </ol>
          )}
        </div>
      </div>
    </div>
  )
}
