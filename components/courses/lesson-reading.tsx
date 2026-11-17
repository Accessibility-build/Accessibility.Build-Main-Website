"use client"
import { useEffect, useMemo, useRef, useState } from "react"
import { ChapterBlocks } from "./chapter-blocks"
import { studyButton } from "./study-save-status"
import type { CourseBlock } from "@/lib/courses/types"

export function LessonReading({ blocks, idPrefix }: { blocks: CourseBlock[]; idPrefix: string }) {
  const [guided, setGuided] = useState(false)
  const [section, setSection] = useState(0)
  const heading = useRef<HTMLParagraphElement>(null)
  const starts = useMemo(() => [0, ...blocks.flatMap((b, i) => b.type === "h2" && i > 0 ? [i] : [])], [blocks])
  const end = starts[section + 1] ?? blocks.length
  const start = guided ? starts[section] : 0
  // Introductory prose has no heading ID. Give it an anchor without duplicating
  // the existing IDs rendered for headings, key terms or callouts.
  const needsStartAnchor = !["h2", "h3", "keyterms", "callout"].includes(blocks[start]?.type ?? "")
  useEffect(() => {
    const followHash = () => {
      const match = window.location.hash.match(new RegExp(`^#${idPrefix}-(\\d+)$`))
      if (!match) return
      const index = Number(match[1])
      const part = starts.findIndex((start, i) => start <= index && (starts[i + 1] ?? blocks.length) > index)
      if (part >= 0) setSection(part)
      requestAnimationFrame(() => document.getElementById(window.location.hash.slice(1))?.scrollIntoView({ block: "start" }))
    }
    followHash()
    window.addEventListener("hashchange", followHash)
    return () => window.removeEventListener("hashchange", followHash)
  }, [idPrefix, blocks, starts])
  function move(next: number) {
    setSection(next)
    // A real hash change also lets the workspace save the reading location and
    // makes the browser's Back/Forward controls restore the previous section.
    window.location.hash = `${idPrefix}-${starts[next]}`
    requestAnimationFrame(() => heading.current?.focus())
  }
  return <div>
    {starts.length > 1 ? <div className="mb-6 rounded-lg border border-slate-300 p-4 dark:border-slate-700">
      <label className="flex min-h-[44px] items-center gap-3 font-medium"><input type="checkbox" className="h-5 w-5" checked={guided} onChange={(e) => setGuided(e.target.checked)} />Read one section at a time</label>
      <p className="text-sm text-slate-600 dark:text-slate-400">Keep the full reference open, or work through smaller sections at your own pace.</p>
      {guided ? <p ref={heading} tabIndex={-1} className="mt-2 rounded font-semibold focus-visible:ring-2 focus-visible:ring-blue-600">Section {section + 1} of {starts.length}</p> : null}
    </div> : null}
    <div id={needsStartAnchor ? `${idPrefix}-${start}` : undefined} className="scroll-mt-28">
      <ChapterBlocks blocks={guided ? blocks.slice(start, end) : blocks} idPrefix={idPrefix} startIndex={start} />
    </div>
    {guided ? <div className="mt-6 flex flex-wrap items-center gap-3"><button className={studyButton} disabled={section === 0} onClick={() => move(section - 1)}>Previous section</button><button className={studyButton} disabled={section === starts.length - 1} onClick={() => move(section + 1)}>Next section</button><span className="text-sm text-slate-600 dark:text-slate-400">After reading, use the checks and activities below.</span></div> : null}
  </div>
}
