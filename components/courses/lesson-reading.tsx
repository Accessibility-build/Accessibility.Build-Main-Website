"use client"
import { useEffect, useMemo, useRef, useState } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { ChapterBlocks } from "./chapter-blocks"
import { studyButton } from "./study-save-status"
import type { CourseBlock } from "@/lib/courses/types"
import { cn } from "@/lib/utils"

export function LessonReading({ blocks, idPrefix, skills = false }: { blocks: CourseBlock[]; idPrefix: string; skills?: boolean }) {
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
    {starts.length > 1 ? <div className="mb-6 max-w-[46rem] rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/50">
      <label className="flex min-h-[44px] cursor-pointer items-center gap-3 font-semibold text-slate-950 dark:text-white"><input type="checkbox" className="h-5 w-5 shrink-0 accent-blue-700 dark:accent-blue-400 dark:[color-scheme:dark]" checked={guided} onChange={(e) => setGuided(e.target.checked)} />Read one section at a time</label>
      <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">Keep the full reference open, or work through smaller sections at your own pace.</p>
      {guided ? <p ref={heading} tabIndex={-1} className="mt-3 inline-block rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1 text-sm font-semibold text-blue-800 focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-300 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-200">Section {section + 1} of {starts.length}</p> : null}
    </div> : null}
    <div id={needsStartAnchor ? `${idPrefix}-${start}` : undefined} className="scroll-mt-4">
      <ChapterBlocks blocks={guided ? blocks.slice(start, end) : blocks} idPrefix={idPrefix} startIndex={start} skills={skills} />
    </div>
    {guided ? <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-slate-200 pt-4 dark:border-slate-800"><button className={cn(studyButton, "gap-2")} disabled={section === 0} onClick={() => move(section - 1)}><ArrowLeft aria-hidden="true" focusable="false" strokeWidth={1.75} className="h-4 w-4 shrink-0" />Previous section</button><button className={cn(studyButton, "gap-2")} disabled={section === starts.length - 1} onClick={() => move(section + 1)}>Next section<ArrowRight aria-hidden="true" focusable="false" strokeWidth={1.75} className="h-4 w-4 shrink-0" /></button><span className="text-sm text-slate-600 dark:text-slate-400">After reading, use the checks and activities below.</span></div> : null}
  </div>
}
