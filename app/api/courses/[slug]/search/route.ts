import { NextRequest, NextResponse } from "next/server"
import { getCourseAccess } from "@/lib/courses/access"
import { getCourse } from "@/lib/courses/config"
import { getCourseChapters } from "@/lib/courses/content"
import { searchCourse } from "@/lib/courses/search"

export const dynamic = "force-dynamic"
export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!getCourse(slug)) return NextResponse.json({ error: "Not found" }, { status: 404 })
  const access = await getCourseAccess(slug)
  if (!access.viewer) return NextResponse.json({ error: "Sign in required" }, { status: 401 })
  if (!access.hasAccess) return NextResponse.json({ error: "Course access required" }, { status: 403 })
  const query = req.nextUrl.searchParams.get("q")?.trim() ?? ""
  if (query.length < 2 || query.length > 100) return NextResponse.json({ hits: [] }, { headers: { "Cache-Control": "private, no-store" } })
  try {
    const hits = searchCourse(await getCourseChapters(slug), query)
    return NextResponse.json({ hits }, { headers: { "Cache-Control": "private, no-store" } })
  } catch { return NextResponse.json({ error: "Lesson search is temporarily unavailable. Please retry." }, { status: 503, headers: { "Cache-Control": "private, no-store" } }) }
}
