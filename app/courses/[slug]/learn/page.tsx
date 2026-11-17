import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { CourseOverview } from "@/components/courses/course-overview"
import { requireCourseAccess } from "@/lib/courses/access"
import { getCourse } from "@/lib/courses/config"
import { getCourseMeta } from "@/lib/courses/content"
import { getCourseProgress } from "@/lib/courses/progress"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const course = getCourse(slug)
  return { title: course ? `${course.title}: your course` : "Course", robots: { index: false, follow: false } }
}

export default async function CourseHomePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const course = getCourse(slug)
  if (!course) notFound()
  const access = await requireCourseAccess(slug, course.homeRoute)
  const meta = await getCourseMeta(slug)
  if (!meta) {
    return (
      <div className="min-h-dvh w-full bg-white dark:bg-slate-950">
        <div className="px-4 py-8 sm:px-6">
          <Link href="/courses" className="mb-6 inline-flex min-h-[44px] items-center rounded px-2 font-medium text-blue-800 underline focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-300">Exit course</Link>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{course.title}</h1>
          <p className="mt-4 text-slate-700 dark:text-slate-300">The course content is being updated. Please try again in a few minutes.</p>
        </div>
      </div>
    )
  }
  const progress = await getCourseProgress(access.viewer.userId, slug)
  const teamLicence = access.ownedLicences.find((l) => l.licenceType === "team")
  return <CourseOverview course={course} meta={meta} progress={progress} userId={access.viewer.userId} firstName={access.viewer.firstName ?? null} teamLicence={teamLicence ? { seats: teamLicence.seats } : null} />
}
