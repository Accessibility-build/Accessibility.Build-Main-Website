import { NextRequest, NextResponse } from "next/server"
import { desc, eq, sql } from "drizzle-orm"
import { AdminAccessError, requireAdminApi } from "@/lib/admin-auth"
import { db } from "@/lib/db"
import { courseLicences, courseSeats, users } from "@/lib/db/schema"
import { grantCourseLicence } from "@/lib/courses/access"
import { COURSES, EMAIL_RE, getCourse, isCourseLicenceType, normalizeEmail } from "@/lib/courses/config"

export const dynamic = "force-dynamic"

function fail(e: unknown) {
  if (e instanceof AdminAccessError) return NextResponse.json({ error: e.message }, { status: e.statusCode })
  return NextResponse.json({ error: e instanceof Error ? e.message : "Server error" }, { status: 500 })
}

export async function GET() {
  try {
    await requireAdminApi()
    const rows = await db
      .select({
        id: courseLicences.id,
        courseSlug: courseLicences.courseSlug,
        licenceType: courseLicences.licenceType,
        seats: courseLicences.seats,
        ownerEmail: courseLicences.ownerEmail,
        source: courseLicences.source,
        note: courseLicences.note,
        billingOrderId: courseLicences.billingOrderId,
        revokedAt: courseLicences.revokedAt,
        createdAt: courseLicences.createdAt,
        seatsUsed: sql<number>`(select count(*)::int from ${courseSeats} where ${courseSeats.licenceId} = ${courseLicences.id})`,
      })
      .from(courseLicences)
      .orderBy(desc(courseLicences.createdAt))
      .limit(200)
    return NextResponse.json({ licences: rows, courses: Object.values(COURSES).map((c) => ({ slug: c.slug, title: c.title })) })
  } catch (e) {
    return fail(e)
  }
}

/** Grant: { action: "grant", courseSlug, email, licenceType, seats?, note }. Revoke: { action: "revoke", licenceId, reason }. */
export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdminApi()
    const body = await req.json().catch(() => ({}))
    if (body.action === "grant") {
      const course = getCourse(String(body.courseSlug || ""))
      const email = normalizeEmail(String(body.email || ""))
      if (!course) return NextResponse.json({ error: "Unknown course" }, { status: 400 })
      if (!EMAIL_RE.test(email)) return NextResponse.json({ error: "Enter a valid email" }, { status: 400 })
      if (!isCourseLicenceType(body.licenceType)) return NextResponse.json({ error: "Choose individual or team" }, { status: 400 })
      const note = String(body.note || "").trim()
      if (!note) return NextResponse.json({ error: "Add a note (for example the invoice number)" }, { status: 400 })
      const seats = body.licenceType === "team" ? Math.max(2, Math.min(100, Number(body.seats) || course.licences.team.seats)) : 1
      const [user] = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1)
      const adminId = admin.emailAddresses[0]?.emailAddress || admin.id
      const id = await grantCourseLicence({
        slug: course.slug,
        licenceType: body.licenceType,
        ownerUserId: user?.id ?? null,
        ownerEmail: email,
        source: "admin",
        grantedBy: String(adminId),
        note,
        seats,
      })
      return NextResponse.json({ ok: true, licenceId: id, matchedUser: Boolean(user) })
    }
    if (body.action === "revoke") {
      const reason = String(body.reason || "").trim()
      if (!reason) return NextResponse.json({ error: "Give a reason" }, { status: 400 })
      await db
        .update(courseLicences)
        .set({ revokedAt: new Date(), revokedReason: reason, updatedAt: new Date() })
        .where(eq(courseLicences.id, String(body.licenceId || "")))
      return NextResponse.json({ ok: true })
    }
    return NextResponse.json({ error: "Unknown action" }, { status: 400 })
  } catch (e) {
    return fail(e)
  }
}
