import "server-only"
import { lt } from "drizzle-orm"
import type { NextRequest } from "next/server"
import { db } from "@/lib/db"
import { assistantEvents, assistantMessages, type NewAssistantEvent, type NewAssistantMessage } from "@/lib/db/schema"
import { clientIpFrom, hashIp } from "@/lib/case-comments-server"

// Server-side analytics for Curb, read by /admin/assistant. Writes never throw: if the tables
// are missing (drizzle/0015_assistant_analytics.sql not applied) or the database is down, the
// assistant keeps answering and the row is simply lost.

export const ASSISTANT_RETENTION_DAYS = 90

export const ASSISTANT_EVENT_TYPES = [
  "opened",
  "suggestion_clicked",
  "source_clicked",
  "answer_link_clicked",
  "new_chat",
] as const
export type AssistantEventType = (typeof ASSISTANT_EVENT_TYPES)[number]

/**
 * Masks the personal data people most often paste into a chat box before it is stored: email
 * addresses, card-length digit runs and phone numbers. WCAG numbers (1.4.3), ratios (4.5:1),
 * years and ISO dates are left alone.
 */
export function redact(text: string): string {
  return text
    .replace(/[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g, "[email]")
    .replace(/\b(?:\d[ -]?){12,18}\d\b/g, "[number]")
    .replace(/\+?\d[\d\s().-]{6,}\d/g, (match) => {
      const digits = match.replace(/\D/g, "")
      if (digits.length < 8 || /^\d{4}-\d{2}-\d{2}$/.test(match.trim())) return match
      return "[phone]"
    })
}

export function isSameOriginRequest(request: NextRequest): boolean {
  const origin = request.headers.get("origin")
  if (!origin) return true
  try {
    return new URL(origin).host === request.nextUrl.host
  } catch {
    return false
  }
}

function deviceFrom(userAgent: string | null): string | null {
  if (!userAgent) return null
  if (/ipad|tablet|(android(?!.*mobile))/i.test(userAgent)) return "tablet"
  if (/mobi|iphone|android/i.test(userAgent)) return "mobile"
  return "desktop"
}

/** Facts about the visitor that every analytics row carries. No raw IP leaves this function. */
export function requestFacts(request: NextRequest) {
  const country = request.headers.get("x-vercel-ip-country")
  return {
    visitorHash: hashIp(clientIpFrom(request.headers)),
    device: deviceFrom(request.headers.get("user-agent")),
    country: country && /^[A-Z]{2}$/.test(country) ? country : null,
  }
}

async function purgeExpired() {
  const cutoff = new Date(Date.now() - ASSISTANT_RETENTION_DAYS * 24 * 60 * 60 * 1000)
  await db.delete(assistantMessages).where(lt(assistantMessages.createdAt, cutoff))
  await db.delete(assistantEvents).where(lt(assistantEvents.createdAt, cutoff))
}

/** Deletes rows past the retention window. Called by the admin page and now and then on write. */
export async function purgeExpiredAssistantData(): Promise<void> {
  try {
    await purgeExpired()
  } catch (error) {
    console.error("Assistant analytics purge failed:", error)
  }
}

export async function recordAssistantMessage(row: NewAssistantMessage): Promise<void> {
  try {
    await db.insert(assistantMessages).values({
      ...row,
      question: redact(row.question).slice(0, 4000),
      answer: row.answer ? redact(row.answer).slice(0, 12000) : row.answer,
      errorMessage: row.errorMessage?.slice(0, 500),
    })
    // Roughly one write in fifty also clears out expired rows, so retention holds even if
    // nobody opens the admin page.
    if (Math.random() < 0.02) await purgeExpired()
  } catch (error) {
    console.error("Assistant analytics write failed:", error)
  }
}

export async function recordAssistantEvent(row: NewAssistantEvent): Promise<void> {
  try {
    await db.insert(assistantEvents).values({
      ...row,
      detail: row.detail ? redact(row.detail).slice(0, 500) : row.detail,
    })
  } catch (error) {
    console.error("Assistant event write failed:", error)
  }
}
