import { NextRequest, NextResponse } from "next/server"
import { getCourseAccess } from "@/lib/courses/access"
import { getCourse } from "@/lib/courses/config"
import { saveCourseAttempt, listCourseAttempts } from "@/lib/courses/attempts"
import { validateAttempt } from "@/lib/courses/attempt-validation"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!getCourse(slug)) return NextResponse.json({ error: "Course not found" }, { status: 404 })
  const access = await getCourseAccess(slug)
  if (!access.viewer) return NextResponse.json({ error: "Sign in required" }, { status: 401 })
  if (!access.hasAccess) return NextResponse.json({ error: "Course access required" }, { status: 403 })
  const offset = Number(req.nextUrl.searchParams.get("offset") ?? 0)
  if (!Number.isSafeInteger(offset) || offset < 0 || offset > 100000) return NextResponse.json({ error: "Invalid review page" }, { status: 400 })
  try { return NextResponse.json(await listCourseAttempts(access.viewer.userId, slug, offset), { headers: { "Cache-Control": "private, no-store" } }) }
  catch { return NextResponse.json({ error: "Saved reviews are temporarily unavailable. Please retry." }, { status: 503 }) }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!getCourse(slug)) return NextResponse.json({ error: "Course not found" }, { status: 404 })
  const access = await getCourseAccess(slug)
  if (!access.viewer) return NextResponse.json({ error: "Sign in required" }, { status: 401 })
  if (!access.hasAccess) return NextResponse.json({ error: "Course access required" }, { status: 403 })
  const text = await req.text()
  if (new TextEncoder().encode(text).length > 2 * 1024 * 1024) return NextResponse.json({ error: "Attempt is too large" }, { status: 413 })
  let attempt
  try { attempt = validateAttempt(JSON.parse(text)) }
  catch { return NextResponse.json({ error: "The attempt could not be read. Keep your recovery copy and try again." }, { status: 400 }) }
  try {
    const saved = await saveCourseAttempt(access.viewer.userId, slug, attempt)
    return NextResponse.json({ attempt: saved }, { headers: { "Cache-Control": "private, no-store" } })
  } catch {
    return NextResponse.json({ error: "Review could not be saved yet. Please retry." }, { status: 503 })
  }
}
