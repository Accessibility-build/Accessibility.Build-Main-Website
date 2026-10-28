import { NextRequest, NextResponse } from "next/server"
import { and, eq } from "drizzle-orm"
import { z } from "zod"
import { db } from "@/lib/db"
import { assistantLeads, assistantMessages } from "@/lib/db/schema"
import { createRateLimit } from "@/lib/rate-limit"
import { company } from "@/lib/company"
import { sendAssistantLeadNotification } from "@/lib/email/service"
import { isSameOriginRequest, recordAssistantEvent, requestFacts } from "@/lib/assistant/analytics"
import { SERVICE_LABELS, SERVICE_KEYS } from "@/lib/assistant/services"
import { normaliseWebsite, prospectKey, upsertInboundProspect } from "@/lib/assistant/leads"

// Contact requests from Curb's lead form. The AI verdict (services, urgency, what is driving it,
// score) is read from the answer's analytics row, never from the browser, so it cannot be set
// by whoever posts the form. Each lead is stored, upserted into prospects as "inbound", and
// emailed to the site owner. The visitor gets no email: Curb confirms in the chat.

export const runtime = "nodejs"

const limit = createRateLimit({
  max: 5,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this connection. Please email us instead.",
})

const BodySchema = z.object({
  conversationId: z.string().trim().min(1).max(64),
  messageId: z.string().uuid().optional(),
  source: z.enum(["ai_offer", "manual"]),
  name: z.string().trim().min(1, "Enter your name.").max(120),
  email: z.string().trim().toLowerCase().email("Enter a valid email address, like name@example.com.").max(254),
  organisation: z.string().trim().max(160).optional().default(""),
  website: z.string().trim().max(300).optional().default(""),
  message: z.string().trim().min(1, "Tell us briefly what you need.").max(2000),
  pagePath: z.string().max(500).optional(),
  // Honeypot: hidden from people, so only bots fill it in.
  confirmWebsite: z.string().max(500).optional(),
})

const isServiceKey = (value: string): value is (typeof SERVICE_KEYS)[number] => (SERVICE_KEYS as readonly string[]).includes(value)

export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  const limited = await limit(request)
  if (limited) return limited

  const parsed = BodySchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    const issue = parsed.error.errors[0]
    return NextResponse.json({ error: issue?.message ?? "Please check the form.", field: issue?.path[0] ?? null }, { status: 400 })
  }
  const body = parsed.data
  // Look like success to a bot, store nothing.
  if (body.confirmWebsite) return NextResponse.json({ ok: true })

  const website = body.website ? normaliseWebsite(body.website) : null
  if (body.website && !website) {
    return NextResponse.json({ error: "Enter a website address like example.com, or leave it blank.", field: "website" }, { status: 400 })
  }

  try {
    const [verdict] = body.messageId
      ? await db
          .select({
            intentServices: assistantMessages.intentServices,
            intentUrgency: assistantMessages.intentUrgency,
            intentTrigger: assistantMessages.intentTrigger,
            intentSummary: assistantMessages.intentSummary,
            leadScore: assistantMessages.leadScore,
            pagePath: assistantMessages.pagePath,
          })
          .from(assistantMessages)
          .where(and(eq(assistantMessages.id, body.messageId), eq(assistantMessages.conversationId, body.conversationId)))
          .limit(1)
      : []

    const services = (verdict?.intentServices ?? []).filter(isServiceKey)
    // Sending the form is itself a request for help, so a lead never scores below the free-scan
    // baseline of 60; urgency and legal or procurement pressure lift it from there.
    const score = Math.max(60, verdict?.leadScore ?? 0)
    const pagePath = verdict?.pagePath ?? body.pagePath?.split(/[?#]/)[0] ?? null
    const facts = requestFacts(request)

    const [lead] = await db
      .insert(assistantLeads)
      .values({
        conversationId: body.conversationId,
        messageId: body.messageId ?? null,
        source: body.source,
        name: body.name,
        email: body.email,
        organisation: body.organisation || null,
        website,
        message: body.message,
        services,
        urgency: verdict?.intentUrgency ?? null,
        trigger: verdict?.intentTrigger ?? null,
        aiSummary: verdict?.intentSummary ?? null,
        score,
        pagePath,
        visitorHash: facts.visitorHash,
        country: facts.country,
        device: facts.device,
      })
      .returning({ id: assistantLeads.id })

    const serviceLabels = services.map((key) => SERVICE_LABELS[key])
    const prospectId = await upsertInboundProspect({
      key: prospectKey(body.email, website),
      website,
      email: body.email,
      name: body.name,
      organisation: body.organisation,
      message: body.message,
      summary: [
        verdict?.intentSummary ?? `Asked for help through Curb: ${body.message.slice(0, 200)}`,
        serviceLabels.length ? `Services: ${serviceLabels.join(", ")}.` : "",
        verdict?.intentUrgency ? `Urgency: ${verdict.intentUrgency}.` : "",
      ]
        .filter(Boolean)
        .join(" "),
      score,
    }).catch((error) => {
      console.error("Curb lead prospect upsert failed:", error)
      return null
    })

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://accessibility.build"
    const sent = await sendAssistantLeadNotification({
      leadId: lead.id,
      to: process.env.LEAD_NOTIFICATION_EMAIL || company.email,
      name: body.name,
      email: body.email,
      organisation: body.organisation,
      website,
      message: body.message,
      summary: verdict?.intentSummary ?? null,
      services: serviceLabels,
      urgency: verdict?.intentUrgency ?? null,
      trigger: verdict?.intentTrigger?.replace(/_/g, " ") ?? null,
      score,
      pagePath,
      conversationUrl: `${appUrl}/admin/assistant?range=90&conversation=${encodeURIComponent(body.conversationId)}`,
      source: body.source,
    })

    await db
      .update(assistantLeads)
      .set({ prospectId, notified: sent.success })
      .where(eq(assistantLeads.id, lead.id))
    await recordAssistantEvent({
      type: "lead_submitted",
      conversationId: body.conversationId,
      messageId: body.messageId ?? null,
      pagePath,
      detail: body.source,
      visitorHash: facts.visitorHash,
      device: facts.device,
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Curb lead failed:", error)
    return NextResponse.json(
      { error: `Your request could not be sent. Please email ${company.email} instead.` },
      { status: 500 },
    )
  }
}
