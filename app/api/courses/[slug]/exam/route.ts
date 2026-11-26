import { NextRequest, NextResponse } from "next/server"
import { getCourseAccess } from "@/lib/courses/access"
import { getCourse } from "@/lib/courses/config"
import { getCourseMeta } from "@/lib/courses/content"
import { getCourseProgress } from "@/lib/courses/progress"
import { certificateProgress } from "@/lib/courses/certificate-rules"
import { ExamError, finishAttempt, getAttemptView, getExamOverview, getRenewalOverview, restartCourse, saveAnswers, startExam } from "@/lib/courses/exam"

export const dynamic = "force-dynamic"
const headers = { "Cache-Control": "no-store" }

async function gate(slug: string) {
  const course = getCourse(slug)
  if (!course?.finalExam) return { error: NextResponse.json({ error: "This course has no final exam" }, { status: 404, headers }) }
  const access = await getCourseAccess(slug)
  if (!access.viewer) return { error: NextResponse.json({ error: "Sign in required" }, { status: 401, headers }) }
  if (!access.hasAccess) return { error: NextResponse.json({ error: "No access to this course" }, { status: 403, headers }) }
  return { course, userId: access.viewer.userId }
}

function fail(e: unknown) {
  if (e instanceof ExamError) return NextResponse.json({ error: e.message, code: e.code }, { status: e.status, headers })
  console.error("course exam", e)
  return NextResponse.json({ error: "Something went wrong. Your saved answers are kept; try again." }, { status: 500, headers })
}

/** GET: the learner's exam status, or ?attempt=<id> for the open paper (questions without answers). */
export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const g = await gate(slug)
  if ("error" in g) return g.error
  try {
    const id = req.nextUrl.searchParams.get("attempt")
    if (id) return NextResponse.json(await getAttemptView(g.userId, g.course, id), { headers })
    if (req.nextUrl.searchParams.get("mode") === "renewal") return NextResponse.json(await getRenewalOverview(g.userId, g.course), { headers })
    return NextResponse.json(await getExamOverview(g.userId, g.course), { headers })
  } catch (e) {
    return fail(e)
  }
}

/** POST { action: "start", minutes, mode?: "renewal" } | { action: "restart" } | { action: "save", attemptId, answers } | { action: "submit", attemptId, answers } */
export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const g = await gate(slug)
  if ("error" in g) return g.error
  const body = await req.json().catch(() => null)
  if (!body || typeof body !== "object") return NextResponse.json({ error: "Bad request" }, { status: 400, headers })
  try {
    if (body.action === "start" && body.mode === "renewal") {
      const meta = await getCourseMeta(slug)
      if (!meta) return NextResponse.json({ error: "Course content is being updated." }, { status: 503, headers })
      return NextResponse.json(await startExam(g.userId, g.course, meta.edition, Number(body.minutes), "renewal"), { headers })
    }
    if (body.action === "restart") { await restartCourse(g.userId, g.course); return NextResponse.json({ ok: true }, { headers }) }
    if (body.action === "start") {
      const [meta, progress] = await Promise.all([getCourseMeta(slug), getCourseProgress(g.userId, slug)])
      if (!meta) return NextResponse.json({ error: "Course content is being updated." }, { status: 503, headers })
      const status = certificateProgress(meta, progress)
      if (!status.eligible) return NextResponse.json({ error: `Complete every lesson and design activity first: ${status.remainingLessons.length} lessons and ${status.remainingActivities.length} activities are left.`, code: "INCOMPLETE" }, { status: 409, headers })
      return NextResponse.json(await startExam(g.userId, g.course, meta.edition, Number(body.minutes)), { headers })
    }
    if (body.action === "save") return NextResponse.json(await saveAnswers(g.userId, slug, String(body.attemptId ?? ""), body.answers), { headers })
    if (body.action === "submit") return NextResponse.json(await finishAttempt(g.userId, g.course, String(body.attemptId ?? ""), body.answers, "submitted"), { headers })
    return NextResponse.json({ error: "Unknown action" }, { status: 400, headers })
  } catch (e) {
    return fail(e)
  }
}
