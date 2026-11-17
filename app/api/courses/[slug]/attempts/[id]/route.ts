import { NextRequest, NextResponse } from "next/server"
import { getCourseAccess } from "@/lib/courses/access"
import { getCourse } from "@/lib/courses/config"
import { getCourseAttempt } from "@/lib/courses/attempts"

export const dynamic = "force-dynamic"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string; id: string }> }) {
  const { slug, id } = await params
  if (!getCourse(slug) || !/^[a-zA-Z0-9_.:-]{1,120}$/.test(id)) return NextResponse.json({ error: "Not found" }, { status: 404 })
  const access = await getCourseAccess(slug)
  if (!access.viewer) return NextResponse.json({ error: "Sign in required" }, { status: 401 })
  if (!access.hasAccess) return NextResponse.json({ error: "Course access required" }, { status: 403 })
  try {
    const attempt = await getCourseAttempt(access.viewer.userId, slug, id)
    if (!attempt) return NextResponse.json({ error: "Saved review not found" }, { status: 404, headers: { "Cache-Control": "private, no-store" } })
    return NextResponse.json({ attempt }, { headers: { "Cache-Control": "private, no-store" } })
  } catch { return NextResponse.json({ error: "Saved review is temporarily unavailable. Please retry." }, { status: 503, headers: { "Cache-Control": "private, no-store" } }) }
}
