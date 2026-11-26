import { NextRequest, NextResponse } from "next/server"
import { AdminAccessError, requireAdminApi } from "@/lib/admin-auth"
import { COURSES, EMAIL_RE, getCourse, normalizeEmail } from "@/lib/courses/config"
import { getCourseMeta } from "@/lib/courses/content"
import { normalizeCertificateName } from "@/lib/courses/certificate-rules"
import { findUserIdByEmail, issueCertificate, listCertificates, reinstateCertificate, renameCertificate, revokeCertificate } from "@/lib/courses/certificates"

export const dynamic = "force-dynamic"
const headers = { "Cache-Control": "no-store" }

function fail(e: unknown) {
  if (e instanceof AdminAccessError) return NextResponse.json({ error: e.message }, { status: e.statusCode, headers })
  console.error("admin certificates", e)
  return NextResponse.json({ error: "Server error" }, { status: 500, headers })
}

const certificateCourses = () => Object.values(COURSES).filter((c) => c.certificate).map((c) => ({ slug: c.slug, title: c.title }))

export async function GET(req: NextRequest) {
  try {
    await requireAdminApi()
    const p = req.nextUrl.searchParams
    const status = p.get("status")
    const rows = await listCertificates({ q: p.get("q") ?? undefined, slug: p.get("course") || undefined, status: status === "active" || status === "revoked" ? status : undefined })
    return NextResponse.json({ certificates: rows, courses: certificateCourses() }, { headers })
  } catch (e) {
    return fail(e)
  }
}

/**
 * { action: "issue", courseSlug, email, name, note }
 * { action: "rename", id, name, reason } · { action: "revoke", id, reason } · { action: "reinstate", id, reason }
 */
export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdminApi()
    const by = admin.emailAddresses[0]?.emailAddress || admin.id
    const body = await req.json().catch(() => ({}))
    const reason = String(body.reason ?? body.note ?? "").trim().slice(0, 500)
    const bad = (error: string) => NextResponse.json({ error }, { status: 400, headers })
    if (body.action === "issue") {
      const course = getCourse(String(body.courseSlug || ""))
      if (!course?.certificate) return bad("Choose a course that offers a certificate")
      const email = normalizeEmail(String(body.email || ""))
      if (!EMAIL_RE.test(email)) return bad("Enter a valid email address")
      const name = normalizeCertificateName(body.name)
      if (!name) return bad("Enter the name to print: 2 to 80 characters, no symbols such as < > / or @")
      if (!reason) return bad("Add a note explaining why this certificate is issued manually")
      const meta = await getCourseMeta(course.slug)
      const { certificate, created } = await issueCertificate({ userId: await findUserIdByEmail(email), slug: course.slug, name, email, edition: meta?.edition ?? "1.0", source: "admin", by, note: reason, validityMonths: course.certificate.validityMonths })
      return NextResponse.json({ certificate, created }, { status: created ? 201 : 200, headers })
    }
    const id = String(body.id || "")
    if (!/^[0-9a-f-]{36}$/i.test(id)) return bad("Unknown certificate")
    if (!reason) return bad("Add a reason; it is kept in the certificate's history")
    if (body.action === "rename") {
      const name = normalizeCertificateName(body.name)
      if (!name) return bad("Enter the corrected name: 2 to 80 characters, no symbols such as < > / or @")
      const row = await renameCertificate(id, name, by, reason)
      return row ? NextResponse.json({ certificate: row }, { headers }) : bad("Certificate not found")
    }
    if (body.action === "revoke") {
      const row = await revokeCertificate(id, reason, by)
      return row ? NextResponse.json({ certificate: row }, { headers }) : bad("Certificate not found or already revoked")
    }
    if (body.action === "reinstate") {
      const row = await reinstateCertificate(id, by, reason)
      return row ? NextResponse.json({ certificate: row }, { headers }) : bad("Certificate not found or not revoked")
    }
    return bad("Unknown action")
  } catch (e) {
    return fail(e)
  }
}
