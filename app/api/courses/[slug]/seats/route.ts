import { NextRequest, NextResponse } from "next/server"
import { addSeat, getCourseAccess, removeSeat, SeatError } from "@/lib/courses/access"
import { EMAIL_RE, getCourse } from "@/lib/courses/config"
import { sendCourseSeatInviteEmail } from "@/lib/email/course-emails"

export const dynamic = "force-dynamic"

async function owner(slug: string, licenceId: unknown) {
  if (!getCourse(slug)) return { error: NextResponse.json({ error: "Not found" }, { status: 404 }) }
  const access = await getCourseAccess(slug)
  if (!access.viewer) return { error: NextResponse.json({ error: "Sign in required" }, { status: 401 }) }
  const licence = access.ownedLicences.find((l) => l.id === licenceId && l.licenceType === "team")
  if (!licence) return { error: NextResponse.json({ error: "Licence not found" }, { status: 404 }) }
  return { viewer: access.viewer, licence }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const body = await req.json().catch(() => ({}))
  const g = await owner(slug, body.licenceId)
  if ("error" in g) return g.error
  const email = typeof body.email === "string" ? body.email.trim() : ""
  if (!EMAIL_RE.test(email) || email.length > 254) return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 })
  try {
    const seat = await addSeat(g.licence.id, g.viewer.userId, email)
    sendCourseSeatInviteEmail({ to: seat.email, courseSlug: slug, inviterName: g.viewer.firstName, seatId: seat.seatId }).catch(() => {})
    return NextResponse.json({ ok: true, seatId: seat.seatId, email: seat.email })
  } catch (e) {
    if (e instanceof SeatError) return NextResponse.json({ error: e.message }, { status: e.status })
    throw e
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const body = await req.json().catch(() => ({}))
  const g = await owner(slug, body.licenceId)
  if ("error" in g) return g.error
  try {
    await removeSeat(g.licence.id, g.viewer.userId, String(body.seatId || ""))
    return NextResponse.json({ ok: true })
  } catch (e) {
    if (e instanceof SeatError) return NextResponse.json({ error: e.message }, { status: e.status })
    throw e
  }
}
