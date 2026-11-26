import { NextRequest, NextResponse } from "next/server"
import { AdminAccessError, requireAdminApi } from "@/lib/admin-auth"
import { EMAIL_RE, getCourse, normalizeEmail } from "@/lib/courses/config"
import { findUserIdByEmail } from "@/lib/courses/certificates"
import { adminExamAction, adminExamLookup } from "@/lib/courses/exam"

export const dynamic = "force-dynamic"
const headers = { "Cache-Control": "no-store" }

function fail(e: unknown) {
  if (e instanceof AdminAccessError) return NextResponse.json({ error: e.message }, { status: e.statusCode, headers })
  console.error("admin exams", e)
  return NextResponse.json({ error: "Server error" }, { status: 500, headers })
}

async function resolve(emailRaw: unknown, slugRaw: unknown) {
  const course = getCourse(String(slugRaw || ""))
  if (!course?.finalExam) return { error: "Choose a course with a final exam" }
  const email = normalizeEmail(String(emailRaw || ""))
  if (!EMAIL_RE.test(email)) return { error: "Enter a valid email address" }
  const userId = await findUserIdByEmail(email)
  if (!userId) return { error: "No account uses that email" }
  return { course, userId, email }
}

/** GET ?email=&course= : the learner's exam status and attempts (scores only). */
export async function GET(req: NextRequest) {
  try {
    await requireAdminApi()
    const r = await resolve(req.nextUrl.searchParams.get("email"), req.nextUrl.searchParams.get("course"))
    if ("error" in r) return NextResponse.json({ error: r.error }, { status: 400, headers })
    return NextResponse.json({ email: r.email, exam: r.course.finalExam, ...(await adminExamLookup(r.userId, r.course.slug)) }, { headers })
  } catch (e) {
    return fail(e)
  }
}

/** POST { action: "grant-attempt" | "clear-cooldown" | "grant-renewal", email, courseSlug, reason } */
export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdminApi()
    const body = await req.json().catch(() => ({}))
    if (body.action !== "grant-attempt" && body.action !== "clear-cooldown" && body.action !== "grant-renewal") return NextResponse.json({ error: "Unknown action" }, { status: 400, headers })
    const reason = String(body.reason || "").trim().slice(0, 500)
    if (!reason) return NextResponse.json({ error: "Add a reason; it is kept in the learner's exam history" }, { status: 400, headers })
    const r = await resolve(body.email, body.courseSlug)
    if ("error" in r) return NextResponse.json({ error: r.error }, { status: 400, headers })
    const status = await adminExamAction(r.userId, r.course.slug, body.action, admin.emailAddresses[0]?.emailAddress || admin.id, reason, r.course.certificate?.renewal.attemptsPerPurchase ?? 3)
    return NextResponse.json({ status }, { headers })
  } catch (e) {
    return fail(e)
  }
}
