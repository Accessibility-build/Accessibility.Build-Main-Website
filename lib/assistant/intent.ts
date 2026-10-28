import "server-only"
import { generateText, tool } from "ai"
import { z } from "zod"
import { INTENT_MODEL, NO_REASONING, openrouter } from "./model"
import type { LeadState } from "./config"
import { SERVICE_KEYS } from "./services"

export { SERVICE_KEYS, SERVICE_LABELS } from "./services"

// Works out what a visitor wants from the whole conversation, with a second model call rather
// than keywords: "we got a demand letter, can you sort this out" has no service words in it but
// is a buyer. A forced tool call returns the verdict as validated structured data (Claude via
// OpenRouter does not return reliable JSON through response_format). It runs alongside the
// answer, so it adds no wait before the first words appear.

const IntentSchema = z.object({
  intent: z
    .enum(["hire", "evaluate", "learn", "support", "other"])
    .describe(
      "hire: wants the team to do work, or asks for a quote, call, proposal or availability. evaluate: commercial interest such as prices, process, timelines or what a service includes, without asking to engage yet. learn: a knowledge question. support: help using this website, its tools or an account. other: off topic, job seekers, vendors pitching to us, spam.",
    ),
  confidence: z.number().min(0).max(1).describe("How sure you are of the intent, 0 to 1."),
  services: z.array(z.enum(SERVICE_KEYS)).describe("Services the visitor needs or is asking about. Empty when none."),
  urgency: z
    .enum(["none", "soon", "urgent"])
    .describe("urgent: a legal threat, a deadline within about a month, or explicit urgency. soon: a stated deadline further out. none: otherwise."),
  trigger: z
    .enum(["legal_threat", "procurement", "regulatory_deadline", "redesign_or_launch", "proactive", "unknown"])
    .describe("What is driving the need, if the visitor said or clearly implied it."),
  offerContact: z
    .boolean()
    .describe(
      "Whether to show a short contact form under the answer now. True when the visitor wants the team to do work or describes a concrete need: a demand letter or lawsuit, a procurement or contract requirement, a regulatory deadline, or a specific site, app or set of documents to assess or fix. False for knowledge questions, tool help, support, a general price question with no concrete need (answer the price instead), job seekers, students and vendors.",
    ),
  summary: z.string().describe("One sentence for the sales team: who they are if known, what they need, and why now. Under 200 characters."),
  requestDraft: z
    .string()
    .describe("For hire or evaluate: a first-person draft of the visitor's request for a contact form, using only what they said, under 400 characters. Empty string otherwise."),
  name: z.string().nullable().describe("The visitor's name, only if they wrote it."),
  email: z.string().nullable().describe("The visitor's email address, only if they wrote it."),
  organisation: z.string().nullable().describe("Their organisation, only if they wrote it."),
  website: z.string().nullable().describe("Their website or product URL, only if they wrote it."),
})

export type IntentResult = z.infer<typeof IntentSchema>

const SYSTEM = `You read conversations between visitors and Curb, the assistant on Accessibility.build, and judge what the visitor wants. Judge from meaning and context, not keywords, and use the whole conversation: a follow-up such as "ok, can you do that for us?" inherits the topic before it.

Accessibility.build is an accessibility consultancy. It sells: accessibility audits (/services/accessibility-audits), remediation support (/services/remediation-support), PDF remediation (/services/pdf-remediation), compliance documentation such as VPATs, ACRs and accessibility statements (/services/compliance-documentation), accessibility training (/services/accessibility-training), design reviews (/services/design-reviews) and user testing with disabled people (/services/user-testing). It also offers free tools and guides, which are not sales.

Lead state tells you what already happened in this chat:
- "submitted": the visitor already sent their details. Set offerContact to false.
- "offered" or "dismissed": the form was shown before. Set offerContact to true only if the visitor now clearly asks to be contacted or to hire.
- "none": decide normally.

Never guess contact details: copy them only if the visitor wrote them. Always call the record_intent tool.`

function transcript(history: { role: "user" | "assistant"; content: string }[]): string {
  return history
    .slice(-6)
    .map((m) => `${m.role === "user" ? "Visitor" : "Curb"}: ${m.role === "assistant" ? m.content.slice(0, 500) : m.content}`)
    .join("\n\n")
}

export async function classifyIntent({
  history,
  page,
  leadState,
  signal,
}: {
  history: { role: "user" | "assistant"; content: string }[]
  page: { path: string; title: string } | null
  leadState: LeadState
  signal?: AbortSignal
}): Promise<IntentResult | null> {
  try {
    const result = await generateText({
      model: openrouter.chatModel(INTENT_MODEL),
      system: SYSTEM,
      prompt: `Page the visitor is on: ${page ? `${page.title} (${page.path})` : "unknown"}\nLead state: ${leadState}\n\nConversation, latest message last:\n${transcript(history)}`,
      tools: { record_intent: tool({ description: "Record your judgement of what the visitor wants.", inputSchema: IntentSchema }) },
      toolChoice: { type: "tool", toolName: "record_intent" },
      temperature: 0,
      maxOutputTokens: 500,
      providerOptions: NO_REASONING,
      abortSignal: signal,
    })
    const parsed = IntentSchema.safeParse(result.toolCalls[0]?.input)
    return parsed.success ? parsed.data : null
  } catch (error) {
    if (!signal?.aborted) console.error("Assistant intent classification failed:", error)
    return null
  }
}

/** Whether this answer should carry the contact form, given the verdict and the chat's lead state. */
export function shouldOfferContact(result: IntentResult | null, leadState: LeadState): boolean {
  if (!result?.offerContact || leadState === "submitted") return false
  return leadState === "none" || result.intent === "hire"
}

/** 0 to 100, for sorting leads. Deterministic from the verdict so it can be explained. */
export function leadScore(result: IntentResult | null): number {
  if (!result) return 0
  let score = result.intent === "hire" ? 60 : result.intent === "evaluate" ? 35 : 0
  if (!score) return 0
  score += result.urgency === "urgent" ? 20 : result.urgency === "soon" ? 10 : 0
  score += { legal_threat: 15, procurement: 10, regulatory_deadline: 10, redesign_or_launch: 5, proactive: 0, unknown: 0 }[result.trigger]
  if (result.email || result.website || result.organisation) score += 5
  return Math.min(100, Math.round(score * (0.5 + result.confidence / 2)))
}
