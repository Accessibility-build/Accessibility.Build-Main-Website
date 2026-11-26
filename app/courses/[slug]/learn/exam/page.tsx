import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { CourseShell } from "@/components/courses/course-shell"
import { ExamApp } from "@/components/courses/exam-app"
import { requireCourseAccess } from "@/lib/courses/access"
import { getCourse } from "@/lib/courses/config"
import { getCourseBank, getCourseMeta } from "@/lib/courses/content"
import { buildOutline } from "@/lib/courses/outline"
import { getCourseProgress } from "@/lib/courses/progress"
import { certificateProgress } from "@/lib/courses/certificate-rules"
import { examTimeOptions, getExamOverview, getRenewalOverview } from "@/lib/courses/exam"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  return { title: `${getCourse(slug)?.title ?? "Course"}: final exam`, robots: { index: false, follow: false } }
}

export default async function CourseExamPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ mode?: string }> }) {
  const [{ slug }, sp] = await Promise.all([params, searchParams])
  const course = getCourse(slug)
  if (!course?.finalExam) notFound()
  const access = await requireCourseAccess(slug, `${course.homeRoute}/exam`)
  const [meta, progress] = await Promise.all([getCourseMeta(slug), getCourseProgress(access.viewer.userId, slug)])
  if (!meta) notFound()
  const renewalMode = sp.mode === "renewal" && Boolean(course.certificate)
  const [overview, renewal] = await Promise.all([getExamOverview(access.viewer.userId, course), renewalMode ? getRenewalOverview(access.viewer.userId, course) : Promise.resolve(null)])
  const status = certificateProgress(meta, progress)
  const hasReadiness = !renewalMode && (await getCourseBank(slug)).questions.some((q) => q.use === "readiness")
  return (
    <CourseShell title={course.title} homeRoute={course.homeRoute} outline={buildOutline(meta, progress)} view="exam" hasTeam={access.ownedLicences.some((l) => l.licenceType === "team")}>
      <ExamApp
        slug={slug}
        homeRoute={course.homeRoute}
        exam={course.finalExam}
        timeOptions={examTimeOptions(renewalMode ? course.certificate!.renewal.minutes : course.finalExam.minutes)}
        sectionTitles={Object.fromEntries(meta.sections.map((s) => [s.ref, s.title]))}
        questionCount={course.finalExam.questions}
        courseComplete={status.eligible}
        remaining={{ lessons: status.remainingLessons.length, activities: status.remainingActivities.length }}
        readinessHref={hasReadiness ? `${course.homeRoute}/readiness` : undefined}
        initial={overview}
        mode={renewalMode ? "renewal" : "final"}
        renewal={renewal && course.certificate ? { overview: renewal, rules: course.certificate.renewal, validityMonths: course.certificate.validityMonths } : undefined}
      />
    </CourseShell>
  )
}
