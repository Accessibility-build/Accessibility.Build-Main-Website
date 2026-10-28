import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { createRateLimit } from "@/lib/rate-limit"
import { ASSISTANT_EVENT_TYPES, isSameOriginRequest, recordAssistantEvent, requestFacts } from "@/lib/assistant/analytics"

// Widget interactions for /admin/assistant: opening Curb, starter suggestions, link clicks and
// new chats. Link clicks arrive by navigator.sendBeacon, which posts text/plain, so the body is
// read as text and parsed here.

export const runtime = "nodejs"

const limit = createRateLimit({ max: 300, windowMs: 60 * 60 * 1000 })

const BodySchema = z.object({
  type: z.enum(ASSISTANT_EVENT_TYPES),
  conversationId: z.string().trim().max(64).optional(),
  messageId: z.string().uuid().optional(),
  path: z.string().max(500).optional(),
  detail: z.string().max(500).optional(),
})

export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  const limited = await limit(request)
  if (limited) return limited

  let body: z.infer<typeof BodySchema>
  try {
    body = BodySchema.parse(JSON.parse(await request.text()))
  } catch {
    return NextResponse.json({ error: "Invalid event" }, { status: 400 })
  }

  const { visitorHash, device } = requestFacts(request)
  await recordAssistantEvent({
    type: body.type,
    conversationId: body.conversationId || null,
    messageId: body.messageId ?? null,
    pagePath: body.path?.split(/[?#]/)[0] || null,
    detail: body.detail || null,
    visitorHash,
    device,
  })
  return new NextResponse(null, { status: 204 })
}
