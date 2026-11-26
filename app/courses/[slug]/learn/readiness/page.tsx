import { randomInt } from "node:crypto"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { CourseShell } from "@/components/courses/course-shell"
import { ReadinessCheck, type ReadinessQuestion } from "@/components/courses/readiness-check"
import { requireCourseAccess } from "@/lib/courses/access"
import { getCourse } from "@/lib/courses/config"
import { getCourseBank, getCourseMeta } from "@/lib/courses/content"
import { buildOutline } from "@/lib/courses/outline"
import { getCourseProgress } from "@/lib/courses/progress"
import { drawReadiness } from "@/lib/courses/readiness"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  return { title: `${getCourse(slug)?.title ?? "Course"}: readiness check`, robots: { index: false, follow: false } }
}

/** An optional rehearsal before the final exam: one question per topic, drawn fresh on every visit. */
export default async function ReadinessPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const course = getCourse(slug)
  if (!course?.finalExam) notFound()
  const access = await requireCourseAccess(slug, `${course.homeRoute}/readiness`)
  const [meta, bank, progress] = await Promise.all([getCourseMeta(slug), getCourseBank(slug), getCourseProgress(access.viewer.userId, slug)])
  if (!meta) notFound()
  const drawn = drawReadiness(bank.questions, meta.sections, (count) => randomInt(count))
  if (!drawn.length) notFound()
  const lessons = new Map(meta.chapters.map((c) => [c.key, c]))
  const topics = new Map(meta.sections.map((s) => [s.ref, s.title]))
  const questions: ReadinessQuestion[] = drawn.map((q) => {
    const lesson = q.lessonKey ? lessons.get(q.lessonKey) : undefined
    return { id: q.id, sec: q.sec, topic: topics.get(q.sec) ?? q.secTitle, stem: q.stem, ...(q.code ? { code: q.code } : {}), options: q.options, answer: q.answer, exp: q.exp, ...(lesson ? { lesson: { href: `${course.homeRoute}/chapters/${lesson.key}`, label: `Lesson ${lesson.number}: ${lesson.title}` } } : {}) }
  })
  const ring = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 dark:focus-visible:ring-blue-300 dark:focus-visible:ring-offset-slate-950"
  return (
    <CourseShell title={course.title} homeRoute={course.homeRoute} outline={buildOutline(meta, progress)} view="exam" hasTeam={access.ownedLicences.some((l) => l.licenceType === "team")}>
      <div className="mx-auto w-full max-w-5xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-300">Before the final exam</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Readiness check</h1>
        <p className="mt-3 max-w-3xl text-lg text-slate-700 dark:text-slate-300">
          {questions.length} questions, one from every topic, written to the same standard as the final exam. You get the answer and the reasoning for each one, and a list of topics to revisit. It is optional, it is not saved, and it does not use an exam attempt.
        </p>
        <p className="mt-2 max-w-3xl text-slate-700 dark:text-slate-300">
          None of these questions appear in the final exam. <Link href={`${course.homeRoute}/exam`} className={`rounded font-semibold text-blue-700 underline underline-offset-2 hover:decoration-2 dark:text-blue-300 ${ring}`}>Back to the final exam</Link>.
        </p>
        <div className="mt-8">
          <ReadinessCheck questions={questions} passPercent={course.finalExam.passPercent} examHref={`${course.homeRoute}/exam`} retryHref={`${course.homeRoute}/readiness`} />
        </div>
      </div>
    </CourseShell>
  )
}
