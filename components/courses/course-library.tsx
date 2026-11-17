"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
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
      <h1 id="course-search-heading" className="text-3xl font-bold">Search and saved work</h1>
      <p className="mt-3 text-slate-700 dark:text-slate-300">Find an explanation, revisit a source, or continue your notes and practical work. Mock exam answers are excluded from search.</p>
      <label htmlFor="course-search" className="mt-5 block font-semibold">Search lessons and key terms</label>
      <input id="course-search" type="search" maxLength={100} value={query} onChange={(e) => setQuery(e.target.value)} placeholder="For example: focus order or universal design" className="mt-2 min-h-[48px] w-full rounded-lg border border-slate-400 bg-white px-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:bg-slate-950" />
      <p role="status" className="mt-2 text-sm text-slate-600 dark:text-slate-400">{status}</p>
      <ol className="mt-4 divide-y divide-slate-300 dark:divide-slate-700">{hits.map((hit) => <li key={`${hit.chapterKey}:${hit.anchor}`} className="py-4"><Link className="rounded font-semibold text-blue-800 underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-300" href={`${route}/chapters/${hit.chapterKey}${hit.anchor ? `#${hit.anchor}` : ""}`}>{hit.title} — {hit.heading}</Link><p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{hit.excerpt}</p></li>)}</ol>
    </section>
    <section aria-labelledby="saved-work-heading"><div className="flex flex-wrap items-center justify-between gap-3"><h2 id="saved-work-heading" className="text-xl font-semibold">Your notes and bookmarks</h2><button className={studyButton} onClick={exportWork}>Download my learning record</button></div>
      {!saved.length ? <p className="mt-3 text-slate-600 dark:text-slate-400">Use the learning workspace in any lesson to save a note or bookmark.</p> : <ul className="mt-4 space-y-4">{saved.map((chapter) => <li key={chapter.key} className="rounded-lg border border-slate-300 p-4 dark:border-slate-700"><Link href={`${route}/chapters/${chapter.key}#lesson-work-heading`} className="font-semibold text-blue-800 underline dark:text-blue-300">{chapter.title}</Link>{progress.study?.bookmarks?.includes(chapter.key) ? <p className="text-sm text-slate-600 dark:text-slate-400">Bookmarked</p> : null}<p className="mt-2 whitespace-pre-wrap text-sm">{progress.study?.notes?.[chapter.key]}</p></li>)}</ul>}
    </section>
    <section aria-labelledby="casebook-heading"><h2 id="casebook-heading" className="text-xl font-semibold">Your accessibility casebook</h2><p className="mt-2 text-slate-700 dark:text-slate-300">Apply the course to a fictional public service. Decisions, reflections and repair evidence build a personal learning portfolio.</p><ul className="mt-4 space-y-3">{activities.map((chapter) => {
      const complete = chapter.activityIds?.filter((id) => progress.study?.activities?.[id]?.completedAt && (!chapter.activityVersions?.[id] || progress.study.activities[id].version === chapter.activityVersions[id])).length ?? 0
      return <li key={chapter.key}><Link href={`${route}/chapters/${chapter.key}#apply-lesson-heading`} className={cn(studyButton, "w-full flex-wrap justify-between gap-2 text-left")}><span className="min-w-0">{chapter.title}</span><span className="shrink-0 text-xs">{complete}/{chapter.activityIds?.length} completed</span></Link></li>
    })}</ul></section>
    <section aria-labelledby="objectives-heading"><h2 id="objectives-heading" className="text-xl font-semibold">Find a syllabus objective</h2><p className="mt-2 text-sm text-slate-600 dark:text-slate-400">A reading checkmark is not proof of mastery. Use the linked lessons, practice and activities together.</p><ul className="mt-4 space-y-3">{meta.sections.map((section) => {
      const lessons = meta.chapters.filter((chapter) => lessonSections(chapter.objectiveRefs ?? chapter.outlineRef, meta).some((entry) => entry.ref === section.ref))
      return <li key={section.ref}><details className="rounded-lg border border-slate-300 p-4 dark:border-slate-700"><summary className="cursor-pointer rounded font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600">{section.ref} · {section.title}</summary><ul className="mt-3 space-y-2">{lessons.map((chapter) => <li key={chapter.key}><Link href={`${route}/chapters/${chapter.key}`} className="text-blue-800 underline dark:text-blue-300">{chapter.title}</Link>{progress.chaptersDone?.includes(chapter.key) ? " · marked read" : ""}{chapter.activityIds?.length ? " · includes an activity" : ""}</li>)}</ul><Link href={`${route}/practice?topic=${encodeURIComponent(section.ref)}`} className={cn(studyButton, "mt-3")}>Practise this objective</Link></details></li>
    })}</ul></section>
  </div>
}
