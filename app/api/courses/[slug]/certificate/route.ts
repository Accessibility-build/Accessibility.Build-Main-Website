import { NextRequest, NextResponse } from "next/server"
import { getCourseAccess } from "@/lib/courses/access"
import { getCourse } from "@/lib/courses/config"
import { getCourseMeta } from "@/lib/courses/content"
import { getCourseProgress } from "@/lib/courses/progress"
import { addMonthsUtc, certificateProgress, normalizeCertificateName, renewalWindow } from "@/lib/courses/certificate-rules"
import { getUserCertificate, issueCertificate, renewCertificateExpiry } from "@/lib/courses/certificates"
import { hasPassedExam } from "@/lib/courses/exam"

export const dynamic = "force-dynamic"
const headers = { "Cache-Control": "no-store" }

/** Claim a completion certificate. The server re-checks completion; the client's view is never trusted. */
export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const course = getCourse(slug)
  if (!course?.certificate) return NextResponse.json({ error: "This course has no certificate" }, { status: 404, headers })
  const access = await getCourseAccess(slug)
  if (!access.viewer) return NextResponse.json({ error: "Sign in required" }, { status: 401, headers })
  if (!access.hasAccess) return NextResponse.json({ error: "No access to this course" }, { status: 403, headers })
  const body = await req.json().catch(() => null)
  const name = normalizeCertificateName(body?.name)
  if (!name) return NextResponse.json({ error: "Enter your name as you want it to appear, using 2 to 80 characters and no symbols such as < > / or @." }, { status: 400, headers })
  const existing = await getUserCertificate(access.viewer.userId, slug)
  // A certificate that expired past its renewal window is renewed by finishing the course and exam again.
  const lapsed = existing?.expiresAt && !existing.revokedAt && renewalWindow(existing.expiresAt, course.certificate.renewal).phase === "closed"
  if (existing && !lapsed) return NextResponse.json({ code: existing.code, created: false }, { headers })
  const [meta, progress] = await Promise.all([getCourseMeta(slug), getCourseProgress(access.viewer.userId, slug)])
  if (!meta) return NextResponse.json({ error: "Course content is being updated. Try again shortly." }, { status: 503, headers })
  const status = certificateProgress(meta, progress)
  if (!status.eligible) return NextResponse.json({ error: `Finish the remaining ${status.remainingLessons.length} lessons and ${status.remainingActivities.length} activities first.`, status }, { status: 409, headers })
  if (course.finalExam && !(await hasPassedExam(access.viewer.userId, slug))) return NextResponse.json({ error: "Pass the final exam to claim your certificate." }, { status: 409, headers })
  if (existing && lapsed) {
    const until = addMonthsUtc(new Date(), course.certificate.validityMonths)
    await renewCertificateExpiry(existing.id, until, access.viewer.email, `Course and final exam completed again; valid until ${until.toISOString().slice(0, 10)}`)
    return NextResponse.json({ code: existing.code, created: false, renewed: true }, { headers })
  }
  const { certificate, created } = await issueCertificate({ userId: access.viewer.userId, slug, name, email: access.viewer.email, edition: meta.edition, source: "earned", by: access.viewer.email, validityMonths: course.certificate.validityMonths })
  return NextResponse.json({ code: certificate.code, created }, { status: created ? 201 : 200, headers })
}
