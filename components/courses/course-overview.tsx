import Link from "next/link"
import { ArrowRight, BookOpen, CheckCircle2, Circle, ClipboardCheck, Layers, Timer, Users } from "lucide-react"
import { CourseShell } from "@/components/courses/course-shell"
import type { CourseConfig } from "@/lib/courses/config"
import { buildOutline, formatMinutes, practiceSummary } from "@/lib/courses/outline"
import type { CourseMeta, CourseProgressData } from "@/lib/courses/types"
import { cn } from "@/lib/utils"

const ring = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950"
const primaryBtn = cn("inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-blue-700 px-5 py-2.5 font-semibold text-white hover:bg-blue-800", ring)

export function CourseOverview({ course, meta, progress, firstName, teamLicence }: {
  course: CourseConfig
  meta: CourseMeta
  progress: CourseProgressData
  firstName: string | null
  teamLicence: { seats: number } | null
}) {
  const outline = buildOutline(meta, progress)
  const practice = practiceSummary(progress)
  const next = outline.next
  const nextPart = next ? outline.parts.find((p) => p.lessons.some((l) => l.key === next.key)) : null
  const mockTotal = course.exam.mock.reduce((a, b) => a + b, 0)
  const pct = (v: number | null) => (v === null ? "Not taken" : `${v}%`)

  return (
    <CourseShell title={course.title} homeRoute={course.homeRoute} outline={outline} view="overview" hasTeam={Boolean(teamLicence)}>
      <p className="text-sm font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-300">Course overview</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white md:text-4xl">
        {firstName ? `Welcome back, ${firstName}` : `Welcome to the ${course.title}`}
      </h1>
      <p className="mt-3 max-w-3xl text-lg text-slate-700 dark:text-slate-300">
        {outline.total} lessons{outline.totalMinutes ? ` (about ${formatMinutes(outline.totalMinutes)} of reading)` : ""}, {meta.questionCount} practice questions, two timed {mockTotal}-question mock exams and {meta.flashcardCount} flashcards. Edition {meta.edition}.
      </p>

      <section aria-labelledby="continue-heading" className="mt-8 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-6 dark:border-blue-900 dark:from-blue-950/70 dark:to-slate-950">
        <h2 id="continue-heading" className="text-sm font-semibold uppercase tracking-wider text-blue-800 dark:text-blue-200">
          {next ? (outline.doneCount === 0 ? "Start here" : "Continue where you left off") : "All lessons complete"}
        </h2>
        {next ? (
          <>
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">Lesson {next.number}: {next.title}</p>
            <p className="mt-1 text-slate-700 dark:text-slate-300">
              {nextPart?.title}
              {next.readingMinutes ? ` · about ${formatMinutes(next.readingMinutes)}` : ""}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href={`${course.homeRoute}/chapters/${next.key}`} className={primaryBtn}>
                <BookOpen aria-hidden="true" className="h-4 w-4" />
                {outline.doneCount === 0 ? "Start lesson 1" : `Continue with lesson ${next.number}`}
              </Link>
            </div>
          </>
        ) : (
          <>
            <p className="mt-2 text-xl font-bold text-slate-900 dark:text-white">You have completed every lesson.</p>
            <p className="mt-1 text-slate-700 dark:text-slate-300">Sit the mock exams under timed conditions, then work through your missed questions.</p>
            <div className="mt-5">
              <Link href={`${course.homeRoute}/practice`} className={primaryBtn}>
                <Timer aria-hidden="true" className="h-4 w-4" />
                Go to the mock exams
              </Link>
            </div>
          </>
        )}
      </section>

      <section aria-labelledby="glance-heading" className="mt-10">
        <h2 id="glance-heading" className="text-xl font-bold text-slate-900 dark:text-white">Your progress at a glance</h2>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Lessons complete", value: `${outline.doneCount} of ${outline.total}`, note: `${outline.percent}% of the course` },
            { label: "Best score, Mock Exam A", value: pct(practice.bestMock.A), note: `${mockTotal} questions, timed` },
            { label: "Best score, Mock Exam B", value: pct(practice.bestMock.B), note: `${mockTotal} questions, timed` },
            { label: "Flashcards you know", value: `${practice.cardsKnown} of ${meta.flashcardCount}`, note: "Marked “I knew it”" },
          ].map((t) => (
            <div key={t.label} className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
              <dt className="text-sm font-medium text-slate-700 dark:text-slate-300">{t.label}</dt>
              <dd className="mt-1 text-2xl font-bold text-slate-900 dark:text-white">{t.value}</dd>
              <dd className="text-sm text-slate-600 dark:text-slate-400">{t.note}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
          IAAP does not publish the percentage needed to pass. As our own rule of thumb, keep practicing any domain where you score under 80%.
        </p>
      </section>

      <section aria-labelledby="practice-heading" className="mt-10">
        <h2 id="practice-heading" className="text-xl font-bold text-slate-900 dark:text-white">Practice</h2>
        <ul className="mt-4 grid gap-4 md:grid-cols-3" role="list">
          {[
            { icon: Timer, title: "Mock exams", body: `Two full ${mockTotal}-question exams in the published weighting, with a timer and a full review.`, href: `${course.homeRoute}/practice`, cta: "Open mock exams" },
            { icon: ClipboardCheck, title: "Topic practice", body: "Pick sections of the Body of Knowledge and see the answer and explanation after each question.", href: `${course.homeRoute}/practice?view=topics`, cta: "Practice by topic" },
            { icon: Layers, title: "Flashcards", body: `${meta.flashcardCount} cards for the terms, numbers and lists you need to recall.`, href: `${course.homeRoute}/practice?view=flashcards`, cta: "Open flashcards" },
          ].map((c) => (
            <li key={c.title} className="relative flex flex-col rounded-xl border border-slate-200 p-5 focus-within:ring-2 focus-within:ring-blue-600 hover:border-blue-700 dark:border-slate-800 dark:hover:border-blue-400">
              <c.icon aria-hidden="true" className="h-6 w-6 text-blue-700 dark:text-blue-300" />
              <h3 className="mt-3 font-semibold text-slate-900 dark:text-white">
                <Link href={c.href} className="after:absolute after:inset-0 focus-visible:outline-none">{c.title}</Link>
              </h3>
              <p className="mt-1 flex-1 text-sm text-slate-700 dark:text-slate-300">{c.body}</p>
              <p aria-hidden="true" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-blue-800 dark:text-blue-300">
                {c.cta}<ArrowRight className="h-4 w-4" />
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="curriculum-heading" className="mt-10">
        <h2 id="curriculum-heading" className="text-xl font-bold text-slate-900 dark:text-white">Curriculum</h2>
        <div className="mt-4 space-y-4">
          {outline.parts.map((part, pi) => {
            const partId = `part-${pi}`
            return (
              <div key={part.title} className="rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-800">
                  <h3 id={partId} className="font-semibold text-slate-900 dark:text-white">{part.title}</h3>
                  <div className="w-full sm:w-48">
                    <p id={`${partId}-p`} className="text-sm text-slate-700 dark:text-slate-300">{part.doneCount} of {part.lessons.length} complete</p>
                    <progress aria-labelledby={`${partId} ${partId}-p`} max={part.lessons.length} value={part.doneCount} className="course-progress mt-1 h-2 w-full" />
                  </div>
                </div>
                <ol className="divide-y divide-slate-200 dark:divide-slate-800" role="list" aria-labelledby={partId}>
                  {part.lessons.map((l) => (
                    <li key={l.key}>
                      <Link
                        href={`${course.homeRoute}/chapters/${l.key}`}
                        className="flex min-h-[52px] items-center gap-3 px-5 py-3 text-slate-800 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600 dark:text-slate-200 dark:hover:bg-slate-900"
                      >
                        {l.done
                          ? <CheckCircle2 aria-hidden="true" className="h-5 w-5 shrink-0 text-emerald-700 dark:text-emerald-400" />
                          : <Circle aria-hidden="true" className="h-5 w-5 shrink-0 text-slate-500 dark:text-slate-400" />}
                        <span className="flex-1">
                          <span className="font-medium">Lesson {l.number}: {l.title}</span>
                          {l.bokPages ? <span className="block text-sm text-slate-600 dark:text-slate-400">Body of Knowledge pages {l.bokPages}</span> : null}
                        </span>
                        {l.readingMinutes ? <span className="hidden text-sm text-slate-600 dark:text-slate-400 sm:inline">{formatMinutes(l.readingMinutes)}</span> : null}
                        <span className={l.done ? "text-sm font-semibold text-emerald-800 dark:text-emerald-300" : "sr-only"}>{l.done ? "Completed" : "Not completed"}</span>
                      </Link>
                    </li>
                  ))}
                </ol>
              </div>
            )
          })}
        </div>
      </section>

      {teamLicence ? (
        <section aria-labelledby="team-heading" className="mt-10 rounded-xl border border-slate-200 p-5 dark:border-slate-800">
          <h2 id="team-heading" className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
            <Users aria-hidden="true" className="h-5 w-5 text-blue-700 dark:text-blue-300" />
            Your team
          </h2>
          <p className="mt-1 text-slate-700 dark:text-slate-300">Your Team licence covers {teamLicence.seats} people. Add colleagues by email; each gets their own progress.</p>
          <Link href={`${course.homeRoute}/team`} className={cn("mt-3 inline-flex min-h-[44px] items-center font-semibold text-blue-800 underline underline-offset-2 hover:decoration-2 dark:text-blue-300", ring)}>
            Manage your team
          </Link>
        </section>
      ) : null}

      <p className="mt-12 text-sm text-slate-600 dark:text-slate-400">
        Independent study course. Not affiliated with, approved by or endorsed by IAAP. {course.certName} is a certification of the International Association of Accessibility Professionals. Found an error?{" "}
        <Link href="/contact" className="underline underline-offset-2 hover:decoration-2">Tell us</Link>.
      </p>
    </CourseShell>
  )
}
