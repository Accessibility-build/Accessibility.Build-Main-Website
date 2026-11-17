import Link from "next/link"
import type { ReactNode } from "react"
import { ArrowLeft, CheckCircle2, Circle, CircleDot } from "lucide-react"
import { CourseWorkspaceFrame } from "@/components/courses/course-workspace-frame"
import { cn } from "@/lib/utils"
import { formatMinutes, type CourseOutline } from "@/lib/courses/outline"

export type CourseView = "overview" | "lesson" | "practice" | "flashcards" | "team" | "library"

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
 * An edge-to-edge course workspace. The layout owns <main>; this supplies course-only
 * navigation and server-rendered outline/content to a small interactive frame.
 */
export function CourseShell({ title, homeRoute, outline, view, lessonKey, hasTeam, children }: ShellProps) {
  const sections: Array<{ view: CourseView; label: string; href: string }> = [
    { view: "overview", label: "Overview", href: homeRoute },
    { view: "practice", label: "Practice and mock exams", href: `${homeRoute}/practice` },
    { view: "flashcards", label: "Flashcards", href: `${homeRoute}/practice?view=flashcards` },
    { view: "library", label: "Search and saved work", href: `${homeRoute}/library` },
  ]
  if (hasTeam) sections.push({ view: "team", label: "Team", href: `${homeRoute}/team` })

  return (
    <CourseWorkspaceFrame
      homeRoute={homeRoute}
      header={
        <div className="flex min-w-0 flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-2 sm:px-6">
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-4 gap-y-1">
            <Link href="/courses" className={cn("inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-md px-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white", ring)}>
              <ArrowLeft aria-hidden="true" className="h-4 w-4" />Exit course
            </Link>
            <p className="min-w-0 text-base font-bold text-slate-900 dark:text-white">
              <Link href={homeRoute} className={cn("inline-flex min-h-[44px] items-center rounded-md py-2 hover:text-blue-700 dark:hover:text-blue-300", ring)}>
                {title}
              </Link>
            </p>
          </div>
          <div className="w-full sm:w-64">
            <p id="course-progress-label" className="text-xs text-slate-700 dark:text-slate-300">
              <span className="font-semibold">Reading progress:</span> {outline.doneCount} of {outline.total} lessons ({outline.percent}%)
            </p>
            <progress
              aria-labelledby="course-progress-label"
              max={Math.max(1, outline.total)}
              value={outline.doneCount}
              className="course-progress mt-1 h-1.5 w-full"
            />
          </div>
        </div>
      }
      sections={
        <nav aria-label="Course sections" className="min-w-0">
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
      }
      outline={<CourseOutlineNav outline={outline} homeRoute={homeRoute} lessonKey={lessonKey} idPrefix="desk" />}
      mobileOutline={<CourseOutlineNav outline={outline} homeRoute={homeRoute} lessonKey={lessonKey} idPrefix="mob" />}
    >
      {children}
    </CourseWorkspaceFrame>
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
                  "flex min-h-[44px] cursor-pointer list-none items-start gap-2 rounded-lg px-2 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-900",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                )}
              >
                <span aria-hidden="true" className="mt-0.5 inline-block w-3 text-slate-600 group-open/part:rotate-90 dark:text-slate-400">▸</span>
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
                          "flex min-h-[44px] items-start gap-2 rounded-md px-2 py-2 text-sm",
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
