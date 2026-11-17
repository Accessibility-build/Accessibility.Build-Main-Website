import { NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { z } from "zod"
import { getCourseAccess } from "@/lib/courses/access"
import { getCourse } from "@/lib/courses/config"
import { getCourseChapter, getCourseMeta } from "@/lib/courses/content"
import { getCourseProgress } from "@/lib/courses/progress"
import { COURSE_TUTOR_PROMPT, tutorEvidence } from "@/lib/courses/tutor-context"
import { ASSISTANT_MODEL, NO_REASONING, openrouterFor } from "@/lib/assistant/model"
import { isOpenRouterConfigured } from "@/lib/openrouter"
import { createRateLimit } from "@/lib/rate-limit"

export const dynamic = "force-dynamic"
export const maxDuration = 45
const provider = openrouterFor("Accessibility.build course study coach")
const limit = createRateLimit({ max: 20, windowMs: 60 * 60 * 1000, message: "Please return to the lesson and try the study coach again later." })
const bodySchema = z.object({ chapterKey: z.string().min(1).max(160), question: z.string().trim().min(5).max(1000) })
const json = (body: object, status = 200) => NextResponse.json(body, { status, headers: { "Cache-Control": "private, no-store" } })

export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  if (!getCourse(slug)) return json({ error: "Course not found" }, 404)
  const access = await getCourseAccess(slug)
  if (!access.viewer) return json({ error: "Sign in required" }, 401)
  if (!access.hasAccess) return json({ error: "Course access required" }, 403)
  const origin = request.headers.get("origin")
  if (origin && origin !== request.nextUrl.origin) return json({ error: "Open the coach from your course lesson." }, 403)
  const limited = await limit(request)
  if (limited) return limited
  const text = await request.text()
  if (text.length > 6000) return json({ error: "Keep your question under 1,000 characters." }, 413)
  let input
  try { input = bodySchema.parse(JSON.parse(text)) } catch { return json({ error: "Enter a question about this lesson." }, 400) }
  let loaded
  try { loaded = await Promise.all([getCourseChapter(slug, input.chapterKey), getCourseMeta(slug), getCourseProgress(access.viewer.userId, slug)]) }
  catch { return json({ error: "Lesson data is temporarily unavailable. Please retry." }, 503) }
  const [chapter, meta, progress] = loaded
  if (!chapter || !meta) return json({ error: "Lesson not found" }, 404)
  if (progress.session?.mode === "exam") return json({ error: "Finish your active mock exam before using study help. Your exam progress is preserved." }, 409)
  if (!isOpenRouterConfigured()) return json({ error: "The study coach is temporarily unavailable. Use the lesson sources and worked examples below." }, 503)
  const evidence = tutorEvidence(chapter, input.question)
  if (!evidence.length) return json({ error: "There is not enough source material in this lesson. Use the course search or report your question." }, 422)
  try {
    const result = await generateText({ model: provider.chatModel(ASSISTANT_MODEL), system: COURSE_TUTOR_PROMPT, prompt: JSON.stringify({ course: slug, edition: meta.edition, lesson: chapter.title, sources: evidence, learnerQuestion: input.question }), maxOutputTokens: 700, temperature: 0.2, providerOptions: NO_REASONING, maxRetries: 1, abortSignal: AbortSignal.any([request.signal, AbortSignal.timeout(35000)]) })
    if (!result.text.trim()) return json({ error: "No explanation was returned. Please try a more specific question." }, 502)
    return json({ answer: result.text, edition: meta.edition, sources: evidence.map(({ id, title, anchor }) => ({ id, title, href: `/courses/${slug}/learn/chapters/${chapter.key}${anchor ? `#${anchor}` : ""}` })) })
  } catch { return json({ error: "The study coach could not respond. Your lesson and saved work are still available." }, 503) }
}
