import { NextRequest, NextResponse } from "next/server"
import { and, eq } from "drizzle-orm"
import { z } from "zod"
import { db } from "@/lib/db"
import { assistantMessages } from "@/lib/db/schema"
import { createRateLimit } from "@/lib/rate-limit"
import { isSameOriginRequest } from "@/lib/assistant/analytics"

// Helpful / not helpful on a Curb answer. The conversation id must match the message's, so a
// rating can only be set by the browser that received the answer.

export const runtime = "nodejs"

const limit = createRateLimit({ max: 120, windowMs: 60 * 60 * 1000 })

const BodySchema = z.object({
  messageId: z.string().uuid(),
  conversationId: z.string().trim().min(1).max(64),
  feedback: z.enum(["helpful", "unhelpful"]).nullable(),
})

export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  const limited = await limit(request)
  if (limited) return limited

  let body: z.infer<typeof BodySchema>
  try {
    body = BodySchema.parse(await request.json())
  } catch {
    return NextResponse.json({ error: "Invalid feedback" }, { status: 400 })
  }

  try {
    await db
      .update(assistantMessages)
      .set({ feedback: body.feedback, feedbackAt: body.feedback ? new Date() : null })
      .where(and(eq(assistantMessages.id, body.messageId), eq(assistantMessages.conversationId, body.conversationId)))
  } catch (error) {
    console.error("Assistant feedback write failed:", error)
  }
  return new NextResponse(null, { status: 204 })
}
