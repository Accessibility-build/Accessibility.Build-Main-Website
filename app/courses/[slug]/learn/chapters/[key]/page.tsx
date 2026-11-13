import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { LessonView } from "@/components/courses/lesson-view"
import { requireCourseAccess } from "@/lib/courses/access"
import { getCourse } from "@/lib/courses/config"
import { getCourseChapter, getCourseMeta } from "@/lib/courses/content"
import { getCourseProgress } from "@/lib/courses/progress"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: Promise<{ slug: string; key: string }> }): Promise<Metadata> {
  const { slug, key } = await params
  const course = getCourse(slug)
  const meta = course ? await getCourseMeta(slug) : null
  const c = meta?.chapters.find((x) => x.key === key)
  return { title: c ? `Lesson ${c.number}: ${c.title}` : course?.title ?? "Course", robots: { index: false, follow: false } }
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string; key: string }> }) {
  const { slug, key } = await params
  const course = getCourse(slug)
  if (!course) notFound()
  const access = await requireCourseAccess(slug, `${course.homeRoute}/chapters/${key}`)
  const [meta, chapter, progress] = await Promise.all([
    getCourseMeta(slug),
    getCourseChapter(slug, key),
    getCourseProgress(access.viewer.userId, slug),
  ])
  if (!meta || !chapter) notFound()

  const hasTeam = access.ownedLicences.some((l) => l.licenceType === "team")
  return <LessonView slug={slug} lessonKey={key} course={course} meta={meta} chapter={chapter} progress={progress} hasTeam={hasTeam} />
}
