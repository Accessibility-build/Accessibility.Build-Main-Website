import Link from "next/link"
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, ClipboardCheck, Clock } from "lucide-react"
import { ChapterBlocks } from "@/components/courses/chapter-blocks"
import { CourseShell } from "@/components/courses/course-shell"
import { MarkDoneButton } from "@/components/courses/mark-done-button"
import type { CourseConfig } from "@/lib/courses/config"
import { buildOutline, formatMinutes, lessonHeadings, lessonSections } from "@/lib/courses/outline"
import type { CourseChapter, CourseMeta, CourseProgressData } from "@/lib/courses/types"
import { cn } from "@/lib/utils"

const ring = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"

export function LessonView({ slug, lessonKey: key, course, meta, chapter, progress, hasTeam }: {
  slug: string
  lessonKey: string
  course: CourseConfig
  meta: CourseMeta
  chapter: CourseChapter
  progress: CourseProgressData
  hasTeam: boolean
}) {
  const outline = buildOutline(meta, progress)
  const i = meta.chapters.findIndex((c) => c.key === key)
  const entry = meta.chapters[i]
  const prev = i > 0 ? meta.chapters[i - 1] : null
  const next = i < meta.chapters.length - 1 ? meta.chapters[i + 1] : null
  const done = (progress.chaptersDone ?? []).includes(key)
  const idPrefix = `c${chapter.number}`
  const headings = lessonHeadings(chapter.blocks, idPrefix)
  const sections = chapter.outlineRef ? lessonSections(chapter.outlineRef, meta) : []

  const toc = headings.length > 1 ? (
    <ol className="space-y-1 text-sm" role="list">
      {headings.map((h) => (
        <li key={h.id}>
          <a href={`#${h.id}`} className={cn("block rounded px-2 py-1.5 text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white", ring)}>
            {h.text}
          </a>
        </li>
      ))}
    </ol>
  ) : null

  return (
    <CourseShell title={course.title} homeRoute={course.homeRoute} outline={outline} view="lesson" lessonKey={key} hasTeam={hasTeam}>
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-x-2 text-sm text-slate-600 dark:text-slate-400" role="list">
          <li><Link href={course.homeRoute} className={cn("rounded underline underline-offset-2 hover:decoration-2", ring)}>Course overview</Link></li>
          <li aria-hidden="true">/</li>
          <li>{chapter.part}</li>
          <li aria-hidden="true">/</li>
          <li><span aria-current="page" className="font-medium text-slate-900 dark:text-white">Lesson {chapter.number}</span></li>
        </ol>
      </nav>

      <div className="mt-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-300">
          Lesson {i + 1} of {meta.chapters.length}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white md:text-4xl">{chapter.title}</h1>
        <ul className="mt-4 flex flex-wrap gap-2 text-sm" role="list" aria-label="About this lesson">
          {entry?.readingMinutes ? (
            <li className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 px-3 py-1 text-slate-700 dark:border-slate-700 dark:text-slate-300">
              <Clock aria-hidden="true" className="h-4 w-4" />
              About {formatMinutes(entry.readingMinutes)} to read
            </li>
          ) : null}
          {chapter.bokPages ? (
            <li className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 px-3 py-1 text-slate-700 dark:border-slate-700 dark:text-slate-300">
              <BookOpen aria-hidden="true" className="h-4 w-4" />
              Body of Knowledge pages {chapter.bokPages}
            </li>
          ) : null}
          {chapter.outlineRef ? (
            <li className="inline-flex items-center rounded-full border border-slate-300 px-3 py-1 text-slate-700 dark:border-slate-700 dark:text-slate-300">
              Content outline {chapter.outlineRef}
            </li>
          ) : null}
          {done ? (
            <li className="inline-flex items-center gap-1.5 rounded-full border border-emerald-700 bg-emerald-50 px-3 py-1 font-semibold text-emerald-900 dark:border-emerald-400 dark:bg-emerald-950 dark:text-emerald-100">
              <CheckCircle2 aria-hidden="true" className="h-4 w-4" />
              Completed
            </li>
          ) : null}
        </ul>
      </div>

      {toc ? (
        <details className="mt-6 rounded-xl border border-slate-300 dark:border-slate-700 xl:hidden">
          <summary className={cn("flex min-h-[44px] cursor-pointer items-center rounded-xl px-4 font-semibold text-slate-900 dark:text-white", ring)}>
            On this page ({headings.length} sections)
          </summary>
          <nav aria-label="On this page" className="border-t border-slate-200 px-2 py-2 dark:border-slate-800">{toc}</nav>
        </details>
      ) : null}

      <div className="mt-8 xl:grid xl:grid-cols-[minmax(0,1fr)_13rem] xl:gap-10">
        <article className="min-w-0 max-w-[72ch]">
          <ChapterBlocks blocks={chapter.blocks} idPrefix={idPrefix} />
        </article>
        {toc ? (
          <div className="hidden xl:block">
            <nav aria-label="On this page" className="sticky top-24">
              <p className="px-2 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">On this page</p>
              <div className="mt-2">{toc}</div>
            </nav>
          </div>
        ) : null}
      </div>

      <section aria-labelledby="finish-heading" className="mt-14 max-w-[72ch] rounded-2xl border border-slate-300 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-900">
        <h2 id="finish-heading" className="text-xl font-bold text-slate-900 dark:text-white">
          {done ? "You have completed this lesson" : "Finished this lesson?"}
        </h2>
        <p className="mt-1 text-slate-700 dark:text-slate-300">
          Mark it complete to track your progress{sections.length ? ", then test yourself on its section" : ""}.
        </p>
        <div className="mt-4">
          <MarkDoneButton slug={slug} chapterKey={key} initialDone={done} />
        </div>
        {sections.length ? (
          <ul className="mt-5 flex flex-wrap gap-3" role="list">
            {sections.map((s) => (
              <li key={s.ref}>
                <Link
                  href={`${course.homeRoute}/practice?topic=${encodeURIComponent(s.ref)}`}
                  className={cn("inline-flex min-h-[44px] items-center gap-2 rounded-lg border-2 border-blue-700 bg-white px-4 py-2 font-semibold text-blue-800 hover:bg-blue-50 dark:border-blue-400 dark:bg-slate-950 dark:text-blue-200 dark:hover:bg-slate-900", ring)}
                >
                  <ClipboardCheck aria-hidden="true" className="h-4 w-4" />
                  Practice questions: {s.title}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      <nav aria-label="Lesson navigation" className="mt-8 grid max-w-[72ch] gap-4 sm:grid-cols-2">
        {prev ? (
          <Link href={`${course.homeRoute}/chapters/${prev.key}`} className={cn("group rounded-xl border border-slate-300 p-4 hover:border-blue-700 dark:border-slate-700 dark:hover:border-blue-400", ring)}>
            <span className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400"><ArrowLeft aria-hidden="true" className="h-4 w-4" />Previous lesson</span>
            <span className="mt-1 block font-semibold text-slate-900 group-hover:text-blue-800 dark:text-white dark:group-hover:text-blue-300">{prev.number}. {prev.title}</span>
          </Link>
        ) : <span className="hidden sm:block" />}
        {next ? (
          <Link href={`${course.homeRoute}/chapters/${next.key}`} className={cn("group rounded-xl border border-slate-300 p-4 text-right hover:border-blue-700 dark:border-slate-700 dark:hover:border-blue-400", ring)}>
            <span className="flex items-center justify-end gap-1.5 text-sm text-slate-600 dark:text-slate-400">Next lesson<ArrowRight aria-hidden="true" className="h-4 w-4" /></span>
            <span className="mt-1 block font-semibold text-slate-900 group-hover:text-blue-800 dark:text-white dark:group-hover:text-blue-300">{next.number}. {next.title}</span>
          </Link>
        ) : (
          <Link href={`${course.homeRoute}/practice`} className={cn("group rounded-xl border border-slate-300 p-4 text-right hover:border-blue-700 dark:border-slate-700 dark:hover:border-blue-400", ring)}>
            <span className="flex items-center justify-end gap-1.5 text-sm text-slate-600 dark:text-slate-400">Last lesson done<ArrowRight aria-hidden="true" className="h-4 w-4" /></span>
            <span className="mt-1 block font-semibold text-slate-900 group-hover:text-blue-800 dark:text-white dark:group-hover:text-blue-300">Go to the mock exams</span>
          </Link>
        )}
      </nav>
    </CourseShell>
  )
}
