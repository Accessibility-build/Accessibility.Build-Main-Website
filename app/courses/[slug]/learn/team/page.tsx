import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { CourseShell } from "@/components/courses/course-shell"
import { TeamProgress } from "@/components/courses/team-progress"
import { TeamSeats } from "@/components/courses/team-seats"
import { getTeamReport } from "@/lib/courses/team-report"
import { getLicenceSeats, requireCourseAccess } from "@/lib/courses/access"
import { getCourse } from "@/lib/courses/config"
import { getCourseMeta } from "@/lib/courses/content"
import { buildOutline } from "@/lib/courses/outline"
import { getCourseProgress } from "@/lib/courses/progress"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  return { title: `${getCourse(slug)?.title ?? "Course"}: your team`, robots: { index: false, follow: false } }
}

export default async function TeamPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const course = getCourse(slug)
  if (!course) notFound()
  const access = await requireCourseAccess(slug, `${course.homeRoute}/team`)
  const licences = access.ownedLicences.filter((l) => l.licenceType === "team")
  if (!licences.length) redirect(course.homeRoute)

  const [meta, progress] = await Promise.all([getCourseMeta(slug), getCourseProgress(access.viewer.userId, slug)])
  if (!meta) notFound()
  const outline = buildOutline(meta, progress)

  const withExam = Boolean(course.finalExam)
  const data = await Promise.all(
    licences.map(async (l) => {
      const seats = await getLicenceSeats(l.id)
      return {
        licence: l,
        seats: seats.map((s) => ({
          id: s.id,
          email: s.email,
          claimed: Boolean(s.userId),
          isOwner: s.userId === access.viewer.userId || s.email === access.viewer.email,
        })),
        report: await getTeamReport(slug, meta, seats, withExam),
      }
    })
  )

  return (
    <CourseShell title={course.title} homeRoute={course.homeRoute} outline={outline} view="team" hasTeam>
      <div className="min-w-0 w-full">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Your team</h1>
        <p className="mt-3 text-slate-700 dark:text-slate-300">
          Your Team licence covers up to {licences[0].seats} people, including you. Add colleagues by email and each of them can use the full course with their own progress. As the licence owner you can see which lessons and activities each person has completed; the course tells them so.
        </p>
        {data.map(({ licence, seats, report }, i) => (
          <div key={licence.id} className="mt-8">
            {data.length > 1 ? <p className="mb-2 font-semibold text-slate-900 dark:text-white">Team licence {i + 1}</p> : null}
            <TeamSeats slug={slug} licenceId={licence.id} seats={seats} limit={licence.seats} />
            <TeamProgress slug={slug} licenceId={licence.id} rows={report} withExam={withExam} />
          </div>
        ))}
      </div>
    </CourseShell>
  )
}
