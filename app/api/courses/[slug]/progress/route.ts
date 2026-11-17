import { NextRequest, NextResponse } from "next/server"
import { getCourseAccess } from "@/lib/courses/access"
import { getCourse } from "@/lib/courses/config"
import { getCourseProgress, savePracticeState, saveStudyState, setChapterDone, ProgressConflictError, ProgressValidationError } from "@/lib/courses/progress"
import { MAX_PROGRESS_REQUEST_BYTES } from "@/lib/courses/progress-contract"
import { getCourseMeta } from "@/lib/courses/content"

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
  const headers = { "Cache-Control": "no-store" }
  try {
    if (Number(req.headers.get("content-length")) > MAX_PROGRESS_REQUEST_BYTES) return NextResponse.json({ error: "Progress is too large to save" }, { status: 413, headers })
    const raw = await req.text()
    if (Buffer.byteLength(raw, "utf8") > MAX_PROGRESS_REQUEST_BYTES) return NextResponse.json({ error: "Progress is too large to save" }, { status: 413, headers })
    let body: Record<string, unknown>
    try { body = JSON.parse(raw) } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400, headers }) }
    if (!body || typeof body !== "object" || Array.isArray(body)) return NextResponse.json({ error: "Bad request" }, { status: 400, headers })
    if (body.op === "chapterDone" && typeof body.key === "string" && typeof body.done === "boolean") {
      const meta = await getCourseMeta(slug)
      if (!meta?.chapters.some((chapter) => chapter.key === body.key)) return NextResponse.json({ error: "Lesson not found" }, { status: 404, headers })
      const progress = await setChapterDone(g.userId, slug, body.key, body.done)
      return NextResponse.json({ ok: true, progress }, { headers })
    } else if (body?.op === "practice" && body.state && typeof body.state === "object") {
      return NextResponse.json(await savePracticeState(g.userId, slug, body.state, body.baseRevision, body.requestId), { headers })
    } else if (body?.op === "study") {
      return NextResponse.json(await saveStudyState(g.userId, slug, body.change, body.requestId), { headers })
    } else {
      return NextResponse.json({ error: "Bad request" }, { status: 400, headers })
    }
  } catch (e) {
    if (e instanceof ProgressConflictError) return NextResponse.json({ error: e.message, code: "PROGRESS_CONFLICT", revision: e.revision, progress: e.progress }, { status: 409, headers })
    if (e instanceof ProgressValidationError) return NextResponse.json({ error: e.message }, { status: 400, headers })
    console.error("[courses/progress] Could not persist progress", e instanceof Error ? e.name : "UnknownError")
    return NextResponse.json({ error: "Progress could not be saved. Your work is kept on this device; please try again." }, { status: 500, headers })
  }
}
