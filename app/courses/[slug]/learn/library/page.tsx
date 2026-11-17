import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { requireCourseAccess } from "@/lib/courses/access"
import { getCourse } from "@/lib/courses/config"
import { getCourseMeta } from "@/lib/courses/content"
import { getCourseProgress } from "@/lib/courses/progress"
import { buildOutline } from "@/lib/courses/outline"
import { CourseShell } from "@/components/courses/course-shell"
import { CourseLibrary } from "@/components/courses/course-library"

export const dynamic = "force-dynamic"
export const metadata: Metadata = { title: "Course search and saved work", robots: { index: false, follow: false } }
export default async function CourseLibraryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const course = getCourse(slug)
  if (!course) notFound()
  const access = await requireCourseAccess(slug, `${course.homeRoute}/library`)
  const [meta, progress] = await Promise.all([getCourseMeta(slug), getCourseProgress(access.viewer.userId, slug)])
  if (!meta) notFound()
  return <CourseShell title={course.title} homeRoute={course.homeRoute} outline={buildOutline(meta, progress)} view="library" hasTeam={access.ownedLicences.some((licence) => licence.licenceType === "team")}><CourseLibrary slug={slug} meta={meta} progress={progress} /></CourseShell>
}
