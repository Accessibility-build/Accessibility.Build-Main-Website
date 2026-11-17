"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Bookmark, BriefcaseBusiness, ChevronRight, CircleCheck, ClipboardCheck, Download, NotebookPen, Search, Target } from "lucide-react"
import type { CourseMeta, CourseProgressData } from "@/lib/courses/types"
import type { CourseSearchHit } from "@/lib/courses/search"
import { lessonSections } from "@/lib/courses/outline"
import { studyButton } from "./study-save-status"
import { cn } from "@/lib/utils"

export function CourseLibrary({ slug, meta, progress }: { slug: string; meta: CourseMeta; progress: CourseProgressData }) {
  const [query, setQuery] = useState("")
  const [hits, setHits] = useState<CourseSearchHit[]>([])
  const [status, setStatus] = useState("")
  const route = `/courses/${slug}/learn`
  useEffect(() => {
    const controller = new AbortController()
    if (query.trim().length < 2) { setHits([]); setStatus(""); return }
    setStatus("Searching lessons…")
    setHits([])
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/courses/${slug}/search?q=${encodeURIComponent(query.trim())}`, { signal: controller.signal })
        if (!response.ok) throw new Error()
        const result = await response.json()
        if (!controller.signal.aborted) { setHits(result.hits); setStatus(`${result.hits.length} matching sections.`) }
      } catch { if (!controller.signal.aborted) setStatus("Search could not load. Check your connection and try again.") }
    }, 300)
    return () => { clearTimeout(timer); controller.abort() }
  }, [query, slug])
  const saved = meta.chapters.filter((chapter) => progress.study?.bookmarks?.includes(chapter.key) || progress.study?.notes?.[chapter.key])
  const activities = meta.chapters.filter((chapter) => chapter.activityIds?.length)
  function exportWork() {
    const lines = [meta.slug, `Course edition ${meta.edition}`, "Personal learning record — self-assessed work, not certification", ""]
    for (const chapter of saved) lines.push(chapter.title, progress.study?.notes?.[chapter.key] ?? "Bookmarked", "")
    for (const [id, activity] of Object.entries(progress.study?.activities ?? {})) {
      const chapter = meta.chapters.find((entry) => entry.activityIds?.includes(id) || id === `checks-${entry.key}`)
      lines.push(`Activity ${id}`, `Version ${activity.version}`, chapter ? `Lesson: ${chapter.title}\nhttps://accessibility.build${route}/chapters/${chapter.key}` : "Earlier course activity", activity.completedAt ? `Completed ${activity.completedAt}` : "In progress", activity.reflection || "No reflection recorded", ...(activity.code ? ["Code:", activity.code] : []), "Complete saved evidence (decisions, checks, rubric, transfer and confidence):", JSON.stringify(activity, null, 2), "")
    }
    const url = URL.createObjectURL(new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" }))
    const link = document.createElement("a"); link.href = url; link.download = `${slug}-learning-record.txt`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  return <div className="min-w-0 w-full space-y-10 [overflow-wrap:anywhere]">
    <section aria-labelledby="course-search-heading">
      <h1 id="course-search-heading" className="text-3xl font-bold tracking-tight text-slate-950 dark:text-white">Search and saved work</h1>
      <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-400">Find an explanation, revisit a source, or continue your notes and practical work. Mock exam answers are excluded from search.</p>
      <label htmlFor="course-search" className="mt-6 block font-semibold text-slate-950 dark:text-white">Search lessons and key terms</label>
      <div className="relative mt-3"><Search aria-hidden="true" focusable="false" strokeWidth={1.75} className="pointer-events-none absolute left-4 top-4 h-4 w-4 text-slate-500 dark:text-slate-400" /><input id="course-search" type="search" maxLength={100} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="For example: focus order or universal design" className="min-h-[48px] w-full rounded-lg border border-slate-500 bg-white pl-11 pr-4 text-slate-950 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-300 dark:border-slate-500 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-400" /></div>
      <p role="status" className="mt-2 text-sm text-slate-600 dark:text-slate-400">{status}</p>
      <ol className="mt-4 divide-y divide-slate-200 dark:divide-slate-800">{hits.map((hit) => <li key={`${hit.chapterKey}:${hit.anchor}`} className="py-4"><Link className="rounded font-semibold text-blue-700 underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-300 dark:text-blue-300" href={`${route}/chapters/${hit.chapterKey}${hit.anchor ? `#${hit.anchor}` : ""}`}>{hit.title} — {hit.heading}</Link><p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{hit.excerpt}</p></li>)}</ol>
    </section>
    <section aria-labelledby="saved-work-heading"><div className="flex flex-wrap items-center justify-between gap-3"><h2 id="saved-work-heading" className="flex items-center gap-2.5 text-xl font-semibold tracking-tight text-slate-950 dark:text-white"><NotebookPen aria-hidden="true" focusable="false" strokeWidth={1.75} className="h-5 w-5 shrink-0 text-blue-700 dark:text-blue-300" />Your notes and bookmarks</h2><button className={studyButton} onClick={exportWork}><Download aria-hidden="true" focusable="false" strokeWidth={1.75} className="h-4 w-4 shrink-0" />Download my learning record</button></div>
      {!saved.length ? <p className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-5 text-slate-600 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400">Use the learning workspace in any lesson to save a note or bookmark.</p> : <ul className="mt-4 space-y-3">{saved.map((chapter) => <li key={chapter.key} className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-950"><Link href={`${route}/chapters/${chapter.key}#lesson-work-heading`} className="rounded font-semibold text-blue-700 underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-300 dark:text-blue-300">{chapter.title}</Link>{progress.study?.bookmarks?.includes(chapter.key) ? <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400"><Bookmark aria-hidden="true" focusable="false" strokeWidth={1.75} className="h-4 w-4 shrink-0" />Bookmarked</p> : null}<p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-700 dark:text-slate-300">{progress.study?.notes?.[chapter.key]}</p></li>)}</ul>}
    </section>
    <section aria-labelledby="casebook-heading"><h2 id="casebook-heading" className="flex items-center gap-2.5 text-xl font-semibold tracking-tight text-slate-950 dark:text-white"><BriefcaseBusiness aria-hidden="true" focusable="false" strokeWidth={1.75} className="h-5 w-5 shrink-0 text-blue-700 dark:text-blue-300" />Your accessibility casebook</h2><p className="mt-2 leading-relaxed text-slate-600 dark:text-slate-400">Apply the course to a fictional public service. Decisions, reflections and repair evidence build a personal learning portfolio.</p><ul className="mt-4 space-y-3">{activities.map((chapter) => {
      const complete = chapter.activityIds?.filter((id) => progress.study?.activities?.[id]?.completedAt && (!chapter.activityVersions?.[id] || progress.study.activities[id].version === chapter.activityVersions[id])).length ?? 0
      return <li key={chapter.key}><Link href={`${route}/chapters/${chapter.key}#apply-lesson-heading`} className={cn(studyButton, "w-full flex-wrap justify-between gap-3 rounded-xl px-4 py-3 text-left")}><span className="min-w-0">{chapter.title}</span><span className="flex items-center gap-3"><span className={cn("inline-flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 text-xs", complete === chapter.activityIds?.length ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200" : "bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-400")}>{complete === chapter.activityIds?.length ? <CircleCheck aria-hidden="true" focusable="false" strokeWidth={1.75} className="h-4 w-4 shrink-0" /> : null}{complete}/{chapter.activityIds?.length} completed</span><ChevronRight aria-hidden="true" focusable="false" strokeWidth={1.75} className="h-4 w-4 shrink-0 text-slate-500 dark:text-slate-400" /></span></Link></li>
    })}</ul></section>
    <section aria-labelledby="objectives-heading"><h2 id="objectives-heading" className="flex items-center gap-2.5 text-xl font-semibold tracking-tight text-slate-950 dark:text-white"><Target aria-hidden="true" focusable="false" strokeWidth={1.75} className="h-5 w-5 shrink-0 text-blue-700 dark:text-blue-300" />Find a syllabus objective</h2><p className="mt-2 text-sm text-slate-600 dark:text-slate-400">A reading checkmark is not proof of mastery. Use the linked lessons, practice and activities together.</p><ul className="mt-4 space-y-3">{meta.sections.map((section) => {
      const lessons = meta.chapters.filter((chapter) => lessonSections(chapter.objectiveRefs ?? chapter.outlineRef, meta).some((entry) => entry.ref === section.ref))
      return <li key={section.ref}><details className="group/objective rounded-xl border border-slate-200 bg-white px-4 py-2 dark:border-slate-800 dark:bg-slate-950"><summary className="flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-3 rounded-lg py-2 font-semibold text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-300 [&::-webkit-details-marker]:hidden dark:text-white"><span>{section.ref} · {section.title}</span><ChevronRight aria-hidden="true" focusable="false" strokeWidth={1.75} className="h-4 w-4 shrink-0 text-slate-500 group-open/objective:rotate-90 dark:text-slate-400" /></summary><ul className="mt-3 space-y-3 border-t border-slate-200 pt-3 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-400">{lessons.map((chapter) => <li key={chapter.key}><Link href={`${route}/chapters/${chapter.key}`} className="rounded text-blue-700 underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-300 dark:text-blue-300">{chapter.title}</Link>{progress.chaptersDone?.includes(chapter.key) ? " · marked read" : ""}{chapter.activityIds?.length ? " · includes an activity" : ""}</li>)}</ul><Link href={`${route}/practice?topic=${encodeURIComponent(section.ref)}`} className={cn(studyButton, "mb-2 mt-4")}><ClipboardCheck aria-hidden="true" focusable="false" strokeWidth={1.75} className="h-4 w-4 shrink-0" />Practise this objective</Link></details></li>
    })}</ul></section>
  </div>
}
