import type { Metadata } from "next"
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
      <div className="min-h-screen bg-white pt-12 dark:bg-slate-950">
        <div className="mx-auto max-w-3xl px-4 py-16">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{course.title}</h1>
          <p className="mt-4 text-slate-700 dark:text-slate-300">The course content is being updated. Please try again in a few minutes.</p>
        </div>
      </div>
    )
  }
  const progress = await getCourseProgress(access.viewer.userId, slug)
  const teamLicence = access.ownedLicences.find((l) => l.licenceType === "team")
  return <CourseOverview course={course} meta={meta} progress={progress} firstName={access.viewer.firstName ?? null} teamLicence={teamLicence ? { seats: teamLicence.seats } : null} />
}
