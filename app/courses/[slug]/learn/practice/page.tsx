import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { CourseShell } from "@/components/courses/course-shell"
import { PracticeApp } from "@/components/courses/practice-app"
import { requireCourseAccess } from "@/lib/courses/access"
import { getCourse } from "@/lib/courses/config"
import { getCourseBank, getCourseMeta } from "@/lib/courses/content"
import { buildOutline } from "@/lib/courses/outline"
import { getCourseProgress } from "@/lib/courses/progress"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  return { title: `${getCourse(slug)?.title ?? "Course"}: practice`, robots: { index: false, follow: false } }
}

export default async function PracticePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ view?: string; topic?: string }>
}) {
  const { slug } = await params
  const sp = await searchParams
  const course = getCourse(slug)
  if (!course) notFound()
  const query = new URLSearchParams(Object.entries(sp).filter((e): e is [string, string] => typeof e[1] === "string")).toString()
  const access = await requireCourseAccess(slug, `${course.homeRoute}/practice${query ? `?${query}` : ""}`)
  const [meta, bank, progress] = await Promise.all([getCourseMeta(slug), getCourseBank(slug), getCourseProgress(access.viewer.userId, slug)])
  if (!meta) notFound()

  const view = sp.view === "flashcards" ? "flashcards" : sp.view === "topics" ? "topics" : undefined
  const topics = (sp.topic ?? "").split(",").map((t) => t.trim()).filter((t) => meta.sections.some((s) => s.ref === t))
  const outline = buildOutline(meta, progress)

  return (
    <CourseShell
      title={course.title}
      homeRoute={course.homeRoute}
      outline={outline}
      view={view === "flashcards" ? "flashcards" : "practice"}
      hasTeam={access.ownedLicences.some((l) => l.licenceType === "team")}
    >
      <div className="max-w-4xl">
        <PracticeApp
          slug={slug}
          courseTitle={course.title}
          exam={course.exam}
          sections={meta.sections}
          questions={bank.questions}
          flashcards={bank.flashcards}
          initial={progress}
          start={{ view, topics }}
        />
      </div>
    </CourseShell>
  )
}
