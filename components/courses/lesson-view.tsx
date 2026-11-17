import Link from "next/link"
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, ChevronRight, ClipboardCheck, Clock, Target } from "lucide-react"
import { LessonReading } from "@/components/courses/lesson-reading"
import { LessonWorkspace } from "@/components/courses/lesson-workspace"
import { CourseSources } from "@/components/courses/course-sources"
import { CourseTutor } from "@/components/courses/course-tutor"
import { CourseShell } from "@/components/courses/course-shell"
import { MarkDoneButton } from "@/components/courses/mark-done-button"
import type { CourseConfig } from "@/lib/courses/config"
import { buildOutline, formatMinutes, lessonHeadings, lessonSections } from "@/lib/courses/outline"
import type { CourseChapter, CourseMeta, CourseProgressData, CourseQuestion } from "@/lib/courses/types"
import { cn } from "@/lib/utils"

const ring = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-300 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"

export function LessonView({ slug, userId, lessonKey: key, course, meta, chapter, progress, hasTeam, questions }: {
  slug: string
  userId: string
  lessonKey: string
  course: CourseConfig
  meta: CourseMeta
  chapter: CourseChapter
  progress: CourseProgressData
  hasTeam: boolean
  questions: CourseQuestion[]
}) {
  const outline = buildOutline(meta, progress)
  const i = meta.chapters.findIndex((c) => c.key === key)
  const entry = meta.chapters[i]
  const prev = i > 0 ? meta.chapters[i - 1] : null
  const next = i < meta.chapters.length - 1 ? meta.chapters[i + 1] : null
  const done = (progress.chaptersDone ?? []).includes(key)
  const idPrefix = `c${chapter.number}`
  const headings = lessonHeadings(chapter.blocks, idPrefix)
  const sections = lessonSections(chapter.objectiveRefs ?? chapter.outlineRef, meta)

  const toc = headings.length > 1 ? (
    <ol className="space-y-1 text-sm" role="list">
      {headings.map((h) => (
        <li key={h.id}>
          <a href={`#${h.id}`} className={cn("block rounded-lg px-3 py-2 leading-relaxed text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white", ring)}>
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
          <li aria-hidden="true"><ChevronRight aria-hidden="true" focusable="false" strokeWidth={1.75} className="h-4 w-4 text-slate-400 dark:text-slate-500" /></li>
          <li>{chapter.part}</li>
          <li aria-hidden="true"><ChevronRight aria-hidden="true" focusable="false" strokeWidth={1.75} className="h-4 w-4 text-slate-400 dark:text-slate-500" /></li>
          <li><span aria-current="page" className="font-medium text-slate-900 dark:text-white">Lesson {chapter.number}</span></li>
        </ol>
      </nav>

      <div className="mt-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-300">
          Lesson {i + 1} of {meta.chapters.length}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white md:text-4xl">{chapter.title}</h1>
        <ul className="mt-4 flex flex-wrap gap-2 text-sm" role="list" aria-label="About this lesson">
          {entry?.readingMinutes ? (
            <li className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
              <Clock aria-hidden="true" focusable="false" strokeWidth={1.75} className="h-4 w-4 shrink-0" />
              About {formatMinutes(entry.readingMinutes)} to read
            </li>
          ) : null}
          {chapter.bokPages ? (
            <li className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
              <BookOpen aria-hidden="true" focusable="false" strokeWidth={1.75} className="h-4 w-4 shrink-0" />
              Body of Knowledge pages {chapter.bokPages}
            </li>
          ) : null}
          {chapter.outlineRef ? (
            <li className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
              Content outline {chapter.outlineRef}
            </li>
          ) : null}
          {done ? (
            <li className="inline-flex items-center gap-1.5 rounded-md border border-emerald-300 bg-emerald-50 px-2.5 py-1.5 font-semibold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
              <CheckCircle2 aria-hidden="true" focusable="false" strokeWidth={1.75} className="h-4 w-4 shrink-0" />
              Completed
            </li>
          ) : null}
        </ul>
      </div>

      {toc ? (
        <details className="group/toc mt-6 rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50 xl:hidden">
          <summary className={cn("flex min-h-[48px] cursor-pointer list-none items-center justify-between gap-3 rounded-xl px-4 font-semibold text-slate-950 [&::-webkit-details-marker]:hidden dark:text-white", ring)}>
            <span>On this page ({headings.length} sections)</span>
            <ChevronRight aria-hidden="true" focusable="false" strokeWidth={1.75} className="h-4 w-4 shrink-0 text-slate-500 group-open/toc:rotate-90 dark:text-slate-400" />
          </summary>
          <nav aria-label="On this page" className="border-t border-slate-200 px-2 py-2 dark:border-slate-800">{toc}</nav>
        </details>
      ) : null}

      {chapter.outcomes?.length ? <section aria-labelledby="lesson-outcomes" className="mt-6 min-w-0 rounded-xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/50">
        <h2 id="lesson-outcomes" className="flex items-start gap-2.5 font-semibold text-slate-950 dark:text-white"><Target aria-hidden="true" focusable="false" strokeWidth={1.75} className="mt-0.5 h-5 w-5 shrink-0 text-blue-700 dark:text-blue-300" />After this lesson, you should be able to</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-slate-600 marker:text-blue-700 dark:text-slate-400 dark:marker:text-blue-300">{chapter.outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}</ul>
      </section> : null}

      <div className={cn("mt-8 min-w-0", toc && "xl:grid xl:grid-cols-[minmax(0,1fr)_13rem] xl:gap-10")}>
        <article className="min-w-0 w-full">
          <LessonReading key={`${chapter.key}:${meta.edition}`} blocks={chapter.blocks} idPrefix={idPrefix} />
          <CourseSources sources={chapter.sources} slug={slug} item={chapter.key} />
        </article>
        {toc ? (
          <div className="hidden min-w-0 xl:block">
            <nav aria-label="On this page" className="sticky top-4 max-h-[calc(100dvh-2rem)] overflow-y-auto border-l border-slate-200 pl-4 dark:border-slate-800">
              <p className="px-2 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">On this page</p>
              <div className="mt-2">{toc}</div>
            </nav>
          </div>
        ) : null}
      </div>

      <section aria-labelledby="finish-heading" className="mt-12 min-w-0 rounded-xl border border-slate-200 bg-slate-50 p-5 sm:p-6 dark:border-slate-800 dark:bg-slate-900/50">
        <h2 id="finish-heading" className="text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
          {done ? "You have completed this lesson" : "Finished this lesson?"}
        </h2>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
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
                  className={cn("inline-flex min-h-[44px] max-w-full items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-blue-700 hover:border-blue-300 hover:bg-blue-50 dark:border-slate-700 dark:bg-slate-950 dark:text-blue-300 dark:hover:border-blue-700 dark:hover:bg-slate-900", ring)}
                >
                  <ClipboardCheck aria-hidden="true" focusable="false" strokeWidth={1.75} className="h-4 w-4 shrink-0" />
                  Practice questions: {s.title}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </section>

      <LessonWorkspace key={`${userId}:${slug}:${chapter.key}:${meta.edition}`} slug={slug} userId={userId} chapter={chapter} edition={meta.edition} initial={progress.study} questions={questions} />
      <CourseTutor key={`${slug}:${chapter.key}`} slug={slug} chapterKey={chapter.key} />

      <nav aria-label="Lesson navigation" className="mt-8 grid min-w-0 gap-4 sm:grid-cols-2">
        {prev ? (
          <Link href={`${course.homeRoute}/chapters/${prev.key}`} className={cn("group rounded-xl border border-slate-200 bg-white p-5 hover:border-blue-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-blue-700 dark:hover:bg-slate-900", ring)}>
            <span className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400"><ArrowLeft aria-hidden="true" focusable="false" strokeWidth={1.75} className="h-4 w-4" />Previous lesson</span>
            <span className="mt-1 block font-semibold text-slate-900 group-hover:text-blue-800 dark:text-white dark:group-hover:text-blue-300">{prev.number}. {prev.title}</span>
          </Link>
        ) : <span className="hidden sm:block" />}
        {next ? (
          <Link href={`${course.homeRoute}/chapters/${next.key}`} className={cn("group rounded-xl border border-slate-200 bg-white p-5 text-right hover:border-blue-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-blue-700 dark:hover:bg-slate-900", ring)}>
            <span className="flex items-center justify-end gap-1.5 text-sm text-slate-600 dark:text-slate-400">Next lesson<ArrowRight aria-hidden="true" focusable="false" strokeWidth={1.75} className="h-4 w-4" /></span>
            <span className="mt-1 block font-semibold text-slate-900 group-hover:text-blue-800 dark:text-white dark:group-hover:text-blue-300">{next.number}. {next.title}</span>
          </Link>
        ) : (
          <Link href={`${course.homeRoute}/practice`} className={cn("group rounded-xl border border-slate-200 bg-white p-5 text-right hover:border-blue-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-blue-700 dark:hover:bg-slate-900", ring)}>
            <span className="flex items-center justify-end gap-1.5 text-sm text-slate-600 dark:text-slate-400">Last lesson done<ArrowRight aria-hidden="true" focusable="false" strokeWidth={1.75} className="h-4 w-4" /></span>
            <span className="mt-1 block font-semibold text-slate-900 group-hover:text-blue-800 dark:text-white dark:group-hover:text-blue-300">Go to the mock exams</span>
          </Link>
        )}
      </nav>
    </CourseShell>
  )
}
