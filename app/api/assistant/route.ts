import { randomUUID } from "node:crypto"
import { NextRequest, NextResponse, after } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { streamText } from "ai"
import { createOpenAICompatible } from "@ai-sdk/openai-compatible"
import { z } from "zod"
import { isOpenRouterConfigured } from "@/lib/openrouter"
import { createRateLimit } from "@/lib/rate-limit"
import { ASSISTANT_LIMITS, PRIVATE_ROUTE_PREFIXES, matchesPrefix, splitLanguageMarker, type AssistantSource } from "@/lib/assistant/config"
import { findPage, searchSite } from "@/lib/assistant/search"
import { buildSystemPrompt, type PageContext } from "@/lib/assistant/prompt"
import { isSameOriginRequest, recordAssistantMessage, requestFacts } from "@/lib/assistant/analytics"
import type { NewAssistantMessage } from "@/lib/db/schema"

// Curb, the site's accessibility assistant. Free and anonymous, so it is rate limited per
// visitor and answers with a small, fast model. Each question is grounded in search results
// from the site index plus the text of the page the visitor is on. Every outcome, including
// refusals, is recorded once for /admin/assistant.

export const runtime = "nodejs"
export const maxDuration = 60

// Haiku through OpenRouter: the key is already configured for the site's other AI tools.
const MODEL = process.env.ASSISTANT_MODEL || "anthropic/claude-haiku-5.5"

// The generic OpenAI-compatible provider, not @ai-sdk/openai: that one treats any model id it
// does not recognise as an OpenAI reasoning model, which drops temperature and sends the system
// prompt as a "developer" message. includeUsage makes the stream report token counts.
const openrouter = createOpenAICompatible({
  name: "openrouter",
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  headers: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "https://accessibility.build",
    "X-Title": "Accessibility.build Curb assistant",
  },
  includeUsage: true,
})

const HUB_PAGES = new Set([
  "/",
  "/blog",
  "/checklists",
  "/compliance",
  "/guides",
  "/industries",
  "/learn",
  "/research",
  "/resources",
  "/services",
  "/sitemap-page",
  "/tools",
  "/wcag",
])

const hourlyLimit = createRateLimit({
  max: 30,
  windowMs: 60 * 60 * 1000,
  message: "You have asked a lot of questions in the last hour. Please try again a little later.",
})
const dailyLimit = createRateLimit({
  max: 120,
  windowMs: 24 * 60 * 60 * 1000,
  message: "You have reached today's question limit. Please come back tomorrow.",
})

const MessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(12000),
})

const BodySchema = z.object({
  messages: z.array(MessageSchema).min(1).max(40),
  conversationId: z.string().trim().min(1).max(64).optional(),
  page: z
    .object({
      path: z.string().max(500),
      title: z.string().max(500).optional().default(""),
      content: z.string().max(20000).optional().default(""),
    })
    .optional(),
})

function json(status: number, error: string) {
  return NextResponse.json({ error }, { status, headers: { "Cache-Control": "no-store" } })
}

async function signedInUserId(): Promise<string | null> {
  try {
    return (await auth()).userId ?? null
  } catch {
    return null
  }
}

export async function POST(request: NextRequest) {
  const startedAt = Date.now()
  if (!isSameOriginRequest(request)) return json(403, "Requests must come from Accessibility.build.")

  let body: z.infer<typeof BodySchema>
  try {
    body = BodySchema.parse(await request.json())
  } catch {
    return json(400, "That message could not be read. Please try again.")
  }

  const history = body.messages.slice(-ASSISTANT_LIMITS.maxHistoryMessages)
  const question = history[history.length - 1]
  if (question.role !== "user") return json(400, "The last message must be a question.")
  if (question.content.length > ASSISTANT_LIMITS.maxQuestionChars) {
    return json(400, `Please keep questions under ${ASSISTANT_LIMITS.maxQuestionChars} characters.`)
  }

  let page: PageContext | null = null
  if (body.page?.path?.startsWith("/")) {
    const pathname = body.page.path.split(/[?#]/)[0].replace(/\/$/, "") || "/"
    const indexed = findPage(pathname)
    const isPrivate = matchesPrefix(pathname, PRIVATE_ROUTE_PREFIXES)
    page = {
      path: pathname,
      title: indexed?.title || body.page.title.slice(0, 200) || pathname,
      description: indexed?.description,
      content: isPrivate ? "" : body.page.content.slice(0, ASSISTANT_LIMITS.maxPageChars),
    }
  }

  const messageId = randomUUID()
  const refersToPage = /\b(this|these|here)\b|\bsummari[sz]e\b/i.test(question.content)
  const baseRow: NewAssistantMessage = {
    id: messageId,
    conversationId: body.conversationId || messageId,
    turn: history.filter((m) => m.role === "user").length,
    userId: await signedInUserId(),
    pagePath: page?.path ?? null,
    pageTitle: page?.title ?? null,
    pageContextSent: Boolean(page?.content),
    refersToPage,
    question: question.content,
    status: "answered",
    model: MODEL,
    ...requestFacts(request),
  }

  if (!isOpenRouterConfigured()) {
    after(() => recordAssistantMessage({ ...baseRow, status: "unavailable", model: null }))
    return json(503, "The assistant is not available right now.")
  }

  const limited = (await hourlyLimit(request)) ?? (await dailyLimit(request))
  if (limited) {
    after(() => recordAssistantMessage({ ...baseRow, status: "rate_limited", model: null }))
    return limited
  }

  // Follow-ups such as "what about on mobile?" need the previous question to search well,
  // and "how do I test for this?" says nothing about its topic until the page title is added.
  const earlierQuestions = history.filter((m) => m.role === "user").slice(-2, -1).map((m) => m.content)
  const query = [question.content, question.content, ...earlierQuestions, refersToPage ? page?.title ?? "" : ""]
  const hits = searchSite(query.join(" "), { limit: 6 })

  // Section index pages still inform the answer, but a link to one is rarely the useful next step.
  const sources: AssistantSource[] = []
  for (const hit of hits) {
    if (hit.path === page?.path || HUB_PAGES.has(hit.path) || sources.some((s) => s.path === hit.path)) continue
    sources.push({ path: hit.path, title: hit.title })
    if (sources.length === 3) break
  }

  // Exactly one row per question, whichever way the stream ends. Every ending resolves `outcome`
  // (the first one wins), and the write happens in after(), registered here inside the request
  // so the platform keeps the function alive for it. A visitor pressing Stop cancels the
  // response stream, and the SDK's own onAbort never fires then, so the request's abort signal
  // is watched directly.
  let streamed = ""
  let firstTokenAt: number | null = null
  let settle: (patch: Partial<NewAssistantMessage>) => void = () => undefined
  const outcome = new Promise<Partial<NewAssistantMessage>>((resolve) => {
    settle = (patch) => resolve({ ...patch, latencyMs: Date.now() - startedAt })
  })
  const stopped = () => settle({ status: "aborted", answer: splitLanguageMarker(streamed).text || null })
  request.signal.addEventListener("abort", stopped, { once: true })

  after(async () => {
    let timer: ReturnType<typeof setTimeout> | undefined
    const patch = await Promise.race([
      outcome,
      new Promise<Partial<NewAssistantMessage>>((resolve) => {
        timer = setTimeout(() => resolve({ status: "error", answer: splitLanguageMarker(streamed).text || null, errorMessage: "No outcome within 55 seconds" }), 55_000)
      }),
    ])
    clearTimeout(timer)
    request.signal.removeEventListener("abort", stopped)
    await recordAssistantMessage({
      ...baseRow,
      searchHits: hits.length,
      topScore: hits[0]?.score ?? null,
      sources,
      firstTokenMs: firstTokenAt ? firstTokenAt - startedAt : null,
      ...patch,
    })
  })

  const result = streamText({
    model: openrouter.chatModel(MODEL),
    system: buildSystemPrompt({ hits, page, today: new Date().toISOString().slice(0, 10) }),
    messages: history.map((m) => ({
      role: m.role,
      content: m.role === "assistant" ? m.content.slice(0, 4000) : m.content,
    })),
    maxOutputTokens: 1200,
    temperature: 0.3,
    abortSignal: request.signal,
    onChunk: ({ chunk }) => {
      if (chunk.type !== "text-delta") return
      firstTokenAt ??= Date.now()
      streamed += chunk.text
    },
    onFinish: ({ text, totalUsage }) =>
      settle({
        status: splitLanguageMarker(text).text.trim() ? "answered" : "empty",
        answer: splitLanguageMarker(text).text,
        inputTokens: totalUsage.inputTokens ?? null,
        outputTokens: totalUsage.outputTokens ?? null,
      }),
    onError: ({ error }) => {
      console.error("Assistant stream failed:", error)
      settle({
        status: "error",
        answer: splitLanguageMarker(streamed).text || null,
        errorMessage: error instanceof Error ? error.message : String(error),
      })
    },
    onAbort: stopped,
  })

  return result.toTextStreamResponse({
    headers: {
      "Cache-Control": "no-store",
      "X-Assistant-Message-Id": messageId,
      "X-Assistant-Sources": encodeURIComponent(JSON.stringify(sources)),
    },
  })
}
