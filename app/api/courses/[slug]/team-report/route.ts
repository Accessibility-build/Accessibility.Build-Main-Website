import { NextRequest, NextResponse } from "next/server"
import { getCourseAccess, getLicenceSeats } from "@/lib/courses/access"
import { getCourse } from "@/lib/courses/config"
import { getCourseMeta } from "@/lib/courses/content"
import { getTeamReport } from "@/lib/courses/team-report"
import { teamReportCsv } from "@/lib/courses/team-report-model"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/** Team licence owners download their team's completion record as CSV. */
export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const course = getCourse(slug)
  if (!course) return NextResponse.json({ error: "Not found" }, { status: 404 })
  const access = await getCourseAccess(slug)
  if (!access.viewer) return NextResponse.json({ error: "Sign in required" }, { status: 401 })
  const licenceId = req.nextUrl.searchParams.get("licence") ?? ""
  // Only the owner of this Team licence may read its report.
  const licence = access.ownedLicences.find((l) => l.id === licenceId && l.licenceType === "team")
  if (!licence) return NextResponse.json({ error: "You do not manage this team licence" }, { status: 403 })
  const meta = await getCourseMeta(slug)
  if (!meta) return NextResponse.json({ error: "The course is being updated. Try again in a few minutes." }, { status: 503 })
  const withExam = Boolean(course.finalExam)
  const rows = await getTeamReport(slug, meta, await getLicenceSeats(licence.id), withExam)
  const date = new Date().toISOString().slice(0, 10)
  return new NextResponse(teamReportCsv(rows, { exam: withExam }), {
    headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": `attachment; filename="${slug}-team-progress-${date}.csv"`, "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex" },
  })
}
