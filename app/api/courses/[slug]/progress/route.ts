import { NextRequest, NextResponse } from "next/server"
import { getCourseAccess } from "@/lib/courses/access"
import { getCourse } from "@/lib/courses/config"
import { getCourseProgress, savePracticeState, setChapterDone } from "@/lib/courses/progress"

export const dynamic = "force-dynamic"

async function gate(slug: string) {
  if (!getCourse(slug)) return { error: NextResponse.json({ error: "Not found" }, { status: 404 }) }
  const access = await getCourseAccess(slug)
  if (!access.viewer) return { error: NextResponse.json({ error: "Sign in required" }, { status: 401 }) }
  if (!access.hasAccess) return { error: NextResponse.json({ error: "No access to this course" }, { status: 403 }) }
  return { userId: access.viewer.userId }
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const g = await gate(slug)
  if ("error" in g) return g.error
  return NextResponse.json(await getCourseProgress(g.userId, slug), { headers: { "Cache-Control": "no-store" } })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const g = await gate(slug)
  if ("error" in g) return g.error
  const body = await req.json().catch(() => null)
  try {
    if (body?.op === "chapterDone" && typeof body.key === "string") {
      await setChapterDone(g.userId, slug, body.key, Boolean(body.done))
    } else if (body?.op === "practice" && body.state && typeof body.state === "object") {
      await savePracticeState(g.userId, slug, body.state)
    } else {
      return NextResponse.json({ error: "Bad request" }, { status: 400 })
    }
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Could not save" }, { status: 400 })
  }
  return NextResponse.json({ ok: true })
}
