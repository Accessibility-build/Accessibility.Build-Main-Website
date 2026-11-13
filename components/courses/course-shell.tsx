import Link from "next/link"
import type { ReactNode } from "react"
import { CheckCircle2, Circle, CircleDot } from "lucide-react"
import { SkipLink } from "@/components/skip-link"
import { cn } from "@/lib/utils"
import { formatMinutes, type CourseOutline } from "@/lib/courses/outline"

export type CourseView = "overview" | "lesson" | "practice" | "flashcards" | "team"

interface ShellProps {
  title: string
  homeRoute: string
  outline: CourseOutline
  view: CourseView
  /** Key of the lesson being shown, when view is "lesson". */
  lessonKey?: string
  hasTeam?: boolean
  children: ReactNode
}

const ring = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"

/**
 * The course frame: a course bar with overall progress and section links, a course outline
 * (sticky sidebar on large screens, a disclosure on small ones) and the page content.
 * The layout already renders <main>, so this uses plain divs and two labelled navs.
 */
export function CourseShell({ title, homeRoute, outline, view, lessonKey, hasTeam, children }: ShellProps) {
  const sections: Array<{ view: CourseView; label: string; href: string }> = [
    { view: "overview", label: "Overview", href: homeRoute },
    { view: "practice", label: "Practice and mock exams", href: `${homeRoute}/practice` },
    { view: "flashcards", label: "Flashcards", href: `${homeRoute}/practice?view=flashcards` },
  ]
  if (hasTeam) sections.push({ view: "team", label: "Team", href: `${homeRoute}/team` })

  return (
    <div className="relative min-h-screen bg-white pt-8 dark:bg-slate-950">
      <SkipLink targetId="course-content">Skip to course content</SkipLink>

      <div className="border-b border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3 pt-4">
            <p className="text-lg font-bold text-slate-900 dark:text-white">
              <Link href={homeRoute} className={cn("rounded hover:text-blue-700 dark:hover:text-blue-300", ring)}>
                {title}
              </Link>
            </p>
            <div className="w-full max-w-xs">
              <p id="course-progress-label" className="text-sm text-slate-700 dark:text-slate-300">
                <span className="font-semibold">Course progress:</span> {outline.doneCount} of {outline.total} lessons ({outline.percent}%)
              </p>
              <progress
                aria-labelledby="course-progress-label"
                max={outline.total}
                value={outline.doneCount}
                className="course-progress mt-1.5 h-2 w-full"
              />
            </div>
          </div>
          <nav aria-label="Course sections" className="-mb-px mt-3">
            <ul className="flex flex-wrap gap-x-1" role="list">
              {sections.map((s) => {
                const current = s.view === view
                return (
                  <li key={s.view}>
                    <Link
                      href={s.href}
                      aria-current={current ? "page" : undefined}
                      className={cn(
                        "inline-flex min-h-[44px] items-center whitespace-nowrap border-b-[3px] px-3 text-sm font-semibold",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600",
                        current
                          ? "border-blue-700 text-blue-800 dark:border-blue-400 dark:text-blue-300"
                          : "border-transparent text-slate-700 hover:border-slate-400 hover:text-slate-900 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:text-white"
                      )}
                    >
                      {s.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:grid lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-10 lg:px-8">
        <div className="hidden lg:block">
          <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto py-8 pr-2">
            <CourseOutlineNav outline={outline} homeRoute={homeRoute} lessonKey={lessonKey} idPrefix="desk" />
          </div>
        </div>

        <details className="group mt-4 rounded-xl border border-slate-300 dark:border-slate-700 lg:hidden">
          <summary className={cn("flex min-h-[48px] cursor-pointer list-none items-center justify-between gap-3 rounded-xl px-4 font-semibold text-slate-900 dark:text-white", ring)}>
            <span>Course outline</span>
            <span className="text-sm font-normal text-slate-700 dark:text-slate-300">
              {outline.doneCount} of {outline.total} done
              <span aria-hidden="true" className="ml-2 inline-block transition-transform group-open:rotate-180 motion-reduce:transition-none">▾</span>
            </span>
          </summary>
          <div className="border-t border-slate-200 px-2 pb-3 dark:border-slate-800">
            <CourseOutlineNav outline={outline} homeRoute={homeRoute} lessonKey={lessonKey} idPrefix="mob" />
          </div>
        </details>

        <div id="course-content" className="min-w-0 py-8">
          {children}
        </div>
      </div>
    </div>
  )
}

function CourseOutlineNav({ outline, homeRoute, lessonKey, idPrefix }: { outline: CourseOutline; homeRoute: string; lessonKey?: string; idPrefix: string }) {
  const firstOpen = lessonKey
    ? outline.parts.findIndex((p) => p.lessons.some((l) => l.key === lessonKey))
    : outline.parts.findIndex((p) => p.doneCount < p.lessons.length)
  return (
    <nav aria-label="Course outline">
      <p className="px-2 pt-3 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 lg:pt-0">Course outline</p>
      <ol className="mt-2 space-y-1" role="list">
        {outline.parts.map((part, pi) => (
          <li key={part.title}>
            <details open={pi === firstOpen || (firstOpen === -1 && pi === 0)} className="group/part">
              <summary
                className={cn(
                  "flex cursor-pointer list-none items-start gap-2 rounded-lg px-2 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-900",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                )}
              >
                <span aria-hidden="true" className="mt-0.5 inline-block w-3 text-slate-600 transition-transform group-open/part:rotate-90 motion-reduce:transition-none dark:text-slate-400">▸</span>
                <span className="flex-1">
                  {part.title}
                  <span className="block text-xs font-normal text-slate-600 dark:text-slate-400">
                    {part.doneCount} of {part.lessons.length} done
                  </span>
                </span>
              </summary>
              <ol className="mb-2 ml-3 mt-1 space-y-0.5 border-l border-slate-200 pl-2 dark:border-slate-800" role="list">
                {part.lessons.map((l) => {
                  const current = l.key === lessonKey
                  const Icon = l.done ? CheckCircle2 : current ? CircleDot : Circle
                  return (
                    <li key={l.key}>
                      <Link
                        id={`${idPrefix}-lesson-${l.key}`}
                        href={`${homeRoute}/chapters/${l.key}`}
                        aria-current={current ? "page" : undefined}
                        className={cn(
                          "flex min-h-[40px] items-start gap-2 rounded-md px-2 py-2 text-sm",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600",
                          current
                            ? "bg-blue-50 font-semibold text-blue-900 dark:bg-blue-950 dark:text-blue-100"
                            : "text-slate-800 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900"
                        )}
                      >
                        <Icon
                          aria-hidden="true"
                          className={cn(
                            "mt-0.5 h-4 w-4 shrink-0",
                            l.done ? "text-emerald-700 dark:text-emerald-400" : current ? "text-blue-700 dark:text-blue-300" : "text-slate-500 dark:text-slate-400"
                          )}
                        />
                        <span className="flex-1">
                          <span>{l.number}. {l.title}</span>
                          {l.readingMinutes ? (
                            <span className="block text-xs font-normal text-slate-600 dark:text-slate-400">{formatMinutes(l.readingMinutes)}</span>
                          ) : null}
                        </span>
                        <span className="sr-only">{l.done ? ", completed" : ", not completed"}</span>
                      </Link>
                    </li>
                  )
                })}
              </ol>
            </details>
          </li>
        ))}
      </ol>
    </nav>
  )
}
