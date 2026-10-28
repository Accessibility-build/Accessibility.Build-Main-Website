import "server-only"
import { sql, type SQL } from "drizzle-orm"
import { db } from "@/lib/db"
import { ASSISTANT_RETENTION_DAYS } from "./analytics"
import { MODEL_PRICING } from "./pricing"

// Everything /admin/assistant shows, in one call. Aggregates run in SQL; the message log is the
// latest rows in the range, filtered and searched in the browser. Days and hours are reported in
// REPORT_TIME_ZONE so the charts line up with the site owner's working day.

export const REPORT_TIME_ZONE = "Asia/Kolkata"
export const REPORT_TIME_ZONE_LABEL = "India Standard Time"
export const RANGE_OPTIONS = [1, 7, 30, 90] as const
export type RangeDays = (typeof RANGE_OPTIONS)[number]
const LOG_LIMIT = 500

// Rate-limited and unavailable requests never reached the model, so they are not "questions".
const ASKED = sql.raw(`status not in ('rate_limited', 'unavailable')`)

export interface PeriodTotals {
  questions: number
  answered: number
  failed: number
  stopped: number
  rateLimited: number
  unavailable: number
  conversations: number
  visitors: number
  signedIn: number
  helpful: number
  unhelpful: number
  noSiteMatch: number
  withPageContext: number
  aboutPage: number
  inputTokens: number
  outputTokens: number
  costUsd: number
  p50LatencyMs: number | null
  p90LatencyMs: number | null
  p50FirstTokenMs: number | null
  opens: number
  openVisitors: number
  askVisitors: number
  suggestionClicks: number
  sourceClicks: number
  answerLinkClicks: number
  newChats: number
  serviceInterest: number
  serviceConversations: number
  hireIntent: number
  leadOffers: number
  leads: number
  manualLeads: number
  leadFormsOpened: number
  leadDismissals: number
}

export interface DailyPoint {
  day: string
  questions: number
  failed: number
  conversations: number
  opens: number
}

export interface AssistantLogEntry {
  id: string
  createdAt: string
  conversationId: string
  turn: number
  pagePath: string | null
  pageTitle: string | null
  question: string
  answer: string | null
  status: string
  errorMessage: string | null
  model: string | null
  inputTokens: number | null
  outputTokens: number | null
  latencyMs: number | null
  firstTokenMs: number | null
  searchHits: number
  topScore: number | null
  sources: { path: string; title: string }[]
  feedback: string | null
  device: string | null
  country: string | null
  signedIn: boolean
  refersToPage: boolean
  pageContextSent: boolean
  intent: string | null
  intentSummary: string | null
  leadScore: number | null
  leadOffered: boolean
}

export interface LeadEntry {
  id: string
  createdAt: string
  conversationId: string
  source: string
  name: string
  email: string
  organisation: string | null
  website: string | null
  message: string
  services: string[]
  urgency: string | null
  trigger: string | null
  aiSummary: string | null
  score: number
  pagePath: string | null
  prospectId: string | null
  notified: boolean
  country: string | null
}

export type AssistantStats =
  | { state: "missing" }
  | { state: "error"; message: string }
  | {
      state: "ok"
      range: RangeDays
      generatedAt: string
      dataSince: string | null
      totalRows: number
      current: PeriodTotals
      previous: PeriodTotals
      daily: DailyPoint[]
      hours: { hour: number; questions: number }[]
      pages: { path: string; title: string; questions: number; conversations: number; helpful: number; unhelpful: number; failed: number }[]
      repeated: { question: string; count: number; lastAsked: string }[]
      links: { href: string; source: number; inAnswer: number }[]
      suggestions: { text: string; count: number }[]
      devices: { label: string; conversations: number }[]
      countries: { label: string; conversations: number }[]
      models: { model: string; questions: number; inputTokens: number; outputTokens: number; costUsd: number }[]
      intents: { intent: string; count: number }[]
      services: { service: string; count: number }[]
      triggers: { trigger: string; count: number }[]
      leads: LeadEntry[]
      log: AssistantLogEntry[]
    }

type Row = Record<string, unknown>

const num = (value: unknown): number => (value == null ? 0 : Number(value))
const numOrNull = (value: unknown): number | null => (value == null ? null : Math.round(Number(value)))

function costOf(model: string | null, input: number, output: number): number {
  const price = (model && MODEL_PRICING[model]) || MODEL_PRICING["anthropic/claude-haiku-5.5"]
  return (input * price.input + output * price.output) / 1_000_000
}

async function rows(query: SQL): Promise<Row[]> {
  return [...((await db.execute(query)) as unknown as Row[])]
}

function inRange(from: Date, to: Date): SQL {
  return sql`created_at >= ${from.toISOString()}::timestamptz and created_at < ${to.toISOString()}::timestamptz`
}

const LOCAL = sql.raw(`((created_at at time zone 'UTC') at time zone '${REPORT_TIME_ZONE}')`)

async function periodTotals(from: Date, to: Date): Promise<PeriodTotals> {
  const [m] = await rows(sql`
    select
      count(*) filter (where ${ASKED}) as questions,
      count(*) filter (where status = 'answered') as answered,
      count(*) filter (where status in ('error', 'empty')) as failed,
      count(*) filter (where status = 'aborted') as stopped,
      count(*) filter (where status = 'rate_limited') as rate_limited,
      count(*) filter (where status = 'unavailable') as unavailable,
      count(distinct conversation_id) filter (where ${ASKED}) as conversations,
      count(distinct visitor_hash) filter (where ${ASKED}) as visitors,
      count(*) filter (where ${ASKED} and user_id is not null) as signed_in,
      count(*) filter (where feedback = 'helpful') as helpful,
      count(*) filter (where feedback = 'unhelpful') as unhelpful,
      count(*) filter (where status = 'answered' and search_hits = 0) as no_site_match,
      count(*) filter (where ${ASKED} and page_context_sent) as with_page_context,
      count(*) filter (where ${ASKED} and refers_to_page) as about_page,
      percentile_cont(0.5) within group (order by latency_ms) filter (where status = 'answered') as p50_latency,
      percentile_cont(0.9) within group (order by latency_ms) filter (where status = 'answered') as p90_latency,
      percentile_cont(0.5) within group (order by first_token_ms) filter (where status = 'answered') as p50_first_token,
      count(*) filter (where intent in ('hire', 'evaluate')) as service_interest,
      count(distinct conversation_id) filter (where intent in ('hire', 'evaluate')) as service_conversations,
      count(*) filter (where intent = 'hire') as hire,
      count(*) filter (where lead_offered) as lead_offers
    from assistant_messages where ${inRange(from, to)}
  `)
  const [leadTotals] = await rows(sql`
    select count(*) as n, count(*) filter (where source = 'manual') as manual
    from assistant_leads where ${inRange(from, to)}
  `)
  const models = await rows(sql`
    select model, coalesce(sum(input_tokens), 0) as input_tokens, coalesce(sum(output_tokens), 0) as output_tokens
    from assistant_messages where ${inRange(from, to)} group by model
  `)
  const events = await rows(sql`
    select type, count(*) as n, count(distinct visitor_hash) as visitors
    from assistant_events where ${inRange(from, to)} group by type
  `)
  const event = (type: string) => events.find((e) => e.type === type)

  const inputTokens = models.reduce((sum, r) => sum + num(r.input_tokens), 0)
  const outputTokens = models.reduce((sum, r) => sum + num(r.output_tokens), 0)
  return {
    questions: num(m?.questions),
    answered: num(m?.answered),
    failed: num(m?.failed),
    stopped: num(m?.stopped),
    rateLimited: num(m?.rate_limited),
    unavailable: num(m?.unavailable),
    conversations: num(m?.conversations),
    visitors: num(m?.visitors),
    signedIn: num(m?.signed_in),
    helpful: num(m?.helpful),
    unhelpful: num(m?.unhelpful),
    noSiteMatch: num(m?.no_site_match),
    withPageContext: num(m?.with_page_context),
    aboutPage: num(m?.about_page),
    inputTokens,
    outputTokens,
    costUsd: models.reduce((sum, r) => sum + costOf(r.model as string | null, num(r.input_tokens), num(r.output_tokens)), 0),
    p50LatencyMs: numOrNull(m?.p50_latency),
    p90LatencyMs: numOrNull(m?.p90_latency),
    p50FirstTokenMs: numOrNull(m?.p50_first_token),
    opens: num(event("opened")?.n),
    openVisitors: num(event("opened")?.visitors),
    askVisitors: num(m?.visitors),
    suggestionClicks: num(event("suggestion_clicked")?.n),
    sourceClicks: num(event("source_clicked")?.n),
    answerLinkClicks: num(event("answer_link_clicked")?.n),
    newChats: num(event("new_chat")?.n),
    serviceInterest: num(m?.service_interest),
    serviceConversations: num(m?.service_conversations),
    hireIntent: num(m?.hire),
    leadOffers: num(m?.lead_offers),
    leads: num(leadTotals?.n),
    manualLeads: num(leadTotals?.manual),
    leadFormsOpened: num(event("lead_form_opened")?.n),
    leadDismissals: num(event("lead_dismissed")?.n),
  }
}

/** Calendar days from `from` to `to` in the report time zone, oldest first. */
function dayKeys(from: Date, to: Date): string[] {
  const format = new Intl.DateTimeFormat("en-CA", { timeZone: REPORT_TIME_ZONE })
  const keys: string[] = []
  for (let t = from.getTime(); t < to.getTime(); t += 60 * 60 * 1000) {
    const key = format.format(new Date(t))
    if (keys[keys.length - 1] !== key) keys.push(key)
  }
  return keys
}

export async function getAssistantStats(range: RangeDays): Promise<AssistantStats> {
  const to = new Date()
  const from = new Date(to.getTime() - range * 24 * 60 * 60 * 1000)
  const previousFrom = new Date(from.getTime() - range * 24 * 60 * 60 * 1000)

  try {
    const [current, previous] = await Promise.all([periodTotals(from, to), periodTotals(previousFrom, from)])

    const [intentRows, serviceRows, triggerRows, leadRows] = await Promise.all([
      rows(sql`
        select coalesce(intent, 'unclassified') as intent, count(*) as n
        from assistant_messages where ${ASKED} and ${inRange(from, to)} group by 1 order by 2 desc
      `),
      rows(sql`
        select service, count(*) as n
        from assistant_messages, jsonb_array_elements_text(coalesce(intent_services, '[]'::jsonb)) as service
        where intent in ('hire', 'evaluate') and ${inRange(from, to)}
        group by 1 order by 2 desc
      `),
      rows(sql`
        select intent_trigger as trigger, count(*) as n from assistant_messages
        where intent in ('hire', 'evaluate') and intent_trigger is not null and intent_trigger <> 'unknown' and ${inRange(from, to)}
        group by 1 order by 2 desc
      `),
      rows(sql`select * from assistant_leads where ${inRange(from, to)} order by created_at desc limit 200`),
    ])

    const [dailyRows, dailyOpens, hourRows, pageRows, repeatedRows, linkRows, suggestionRows, deviceRows, countryRows, modelRows, logRows, totalsRows] =
      await Promise.all([
        rows(sql`
          select to_char(${LOCAL}, 'YYYY-MM-DD') as day,
            count(*) filter (where ${ASKED}) as questions,
            count(*) filter (where status in ('error', 'empty')) as failed,
            count(distinct conversation_id) filter (where ${ASKED}) as conversations
          from assistant_messages where ${inRange(from, to)} group by 1
        `),
        rows(sql`
          select to_char(${LOCAL}, 'YYYY-MM-DD') as day, count(*) as opens
          from assistant_events where type = 'opened' and ${inRange(from, to)} group by 1
        `),
        rows(sql`
          select extract(hour from ${LOCAL})::int as hour, count(*) as questions
          from assistant_messages where ${ASKED} and ${inRange(from, to)} group by 1
        `),
        rows(sql`
          select coalesce(page_path, '(unknown)') as path, max(page_title) as title,
            count(*) as questions, count(distinct conversation_id) as conversations,
            count(*) filter (where feedback = 'helpful') as helpful,
            count(*) filter (where feedback = 'unhelpful') as unhelpful,
            count(*) filter (where status in ('error', 'empty')) as failed
          from assistant_messages where ${ASKED} and ${inRange(from, to)}
          group by 1 order by questions desc, conversations desc limit 20
        `),
        rows(sql`
          select lower(regexp_replace(btrim(question), '[[:space:][:punct:]]+$', '')) as question,
            count(*) as n, max(created_at) as last_asked
          from assistant_messages where ${ASKED} and ${inRange(from, to)}
          group by 1 having count(*) > 1 order by n desc, last_asked desc limit 25
        `),
        rows(sql`
          select detail as href,
            count(*) filter (where type = 'source_clicked') as source,
            count(*) filter (where type = 'answer_link_clicked') as in_answer
          from assistant_events
          where type in ('source_clicked', 'answer_link_clicked') and detail is not null and ${inRange(from, to)}
          group by 1 order by count(*) desc limit 20
        `),
        rows(sql`
          select detail as text, count(*) as n from assistant_events
          where type = 'suggestion_clicked' and detail is not null and ${inRange(from, to)}
          group by 1 order by n desc limit 20
        `),
        rows(sql`
          select coalesce(device, 'unknown') as label, count(distinct conversation_id) as conversations
          from assistant_messages where ${ASKED} and ${inRange(from, to)} group by 1 order by 2 desc
        `),
        rows(sql`
          select coalesce(country, 'unknown') as label, count(distinct conversation_id) as conversations
          from assistant_messages where ${ASKED} and ${inRange(from, to)} group by 1 order by 2 desc limit 12
        `),
        rows(sql`
          select coalesce(model, 'none') as model, count(*) filter (where ${ASKED}) as questions,
            coalesce(sum(input_tokens), 0) as input_tokens, coalesce(sum(output_tokens), 0) as output_tokens
          from assistant_messages where ${inRange(from, to)} group by 1 order by 2 desc
        `),
        rows(sql`
          select * from assistant_messages where ${inRange(from, to)}
          order by created_at desc limit ${LOG_LIMIT}
        `),
        rows(sql`select count(*) as n, min(created_at) as since from assistant_messages`),
      ])

    const byDay = new Map(dailyRows.map((r) => [String(r.day), r]))
    const opensByDay = new Map(dailyOpens.map((r) => [String(r.day), num(r.opens)]))
    const daily = dayKeys(from, to).map((day) => ({
      day,
      questions: num(byDay.get(day)?.questions),
      failed: num(byDay.get(day)?.failed),
      conversations: num(byDay.get(day)?.conversations),
      opens: opensByDay.get(day) ?? 0,
    }))
    const hourMap = new Map(hourRows.map((r) => [num(r.hour), num(r.questions)]))

    const iso = (value: unknown) => (value ? new Date(String(value).replace(" ", "T") + (String(value).includes("Z") ? "" : "Z")).toISOString() : "")
    const log: AssistantLogEntry[] = logRows.map((r) => ({
      id: String(r.id),
      createdAt: r.created_at instanceof Date ? r.created_at.toISOString() : iso(r.created_at),
      conversationId: String(r.conversation_id),
      turn: num(r.turn),
      pagePath: (r.page_path as string | null) ?? null,
      pageTitle: (r.page_title as string | null) ?? null,
      question: String(r.question),
      answer: (r.answer as string | null) ?? null,
      status: String(r.status),
      errorMessage: (r.error_message as string | null) ?? null,
      model: (r.model as string | null) ?? null,
      inputTokens: numOrNull(r.input_tokens),
      outputTokens: numOrNull(r.output_tokens),
      latencyMs: numOrNull(r.latency_ms),
      firstTokenMs: numOrNull(r.first_token_ms),
      searchHits: num(r.search_hits),
      topScore: r.top_score == null ? null : Number(r.top_score),
      sources: Array.isArray(r.sources) ? (r.sources as { path: string; title: string }[]) : [],
      feedback: (r.feedback as string | null) ?? null,
      device: (r.device as string | null) ?? null,
      country: (r.country as string | null) ?? null,
      signedIn: r.user_id != null,
      refersToPage: Boolean(r.refers_to_page),
      pageContextSent: Boolean(r.page_context_sent),
      intent: (r.intent as string | null) ?? null,
      intentSummary: (r.intent_summary as string | null) ?? null,
      leadScore: numOrNull(r.lead_score),
      leadOffered: Boolean(r.lead_offered),
    }))
    const leads: LeadEntry[] = leadRows.map((r) => ({
      id: String(r.id),
      createdAt: r.created_at instanceof Date ? r.created_at.toISOString() : iso(r.created_at),
      conversationId: String(r.conversation_id),
      source: String(r.source),
      name: String(r.name),
      email: String(r.email),
      organisation: (r.organisation as string | null) ?? null,
      website: (r.website as string | null) ?? null,
      message: String(r.message),
      services: Array.isArray(r.services) ? (r.services as string[]) : [],
      urgency: (r.urgency as string | null) ?? null,
      trigger: (r.trigger as string | null) ?? null,
      aiSummary: (r.ai_summary as string | null) ?? null,
      score: num(r.score),
      pagePath: (r.page_path as string | null) ?? null,
      prospectId: (r.prospect_id as string | null) ?? null,
      notified: Boolean(r.notified),
      country: (r.country as string | null) ?? null,
    }))

    const since = totalsRows[0]?.since
    return {
      state: "ok",
      range,
      generatedAt: to.toISOString(),
      dataSince: since ? (since instanceof Date ? since.toISOString() : iso(since)) : null,
      totalRows: num(totalsRows[0]?.n),
      current,
      previous,
      daily,
      hours: Array.from({ length: 24 }, (_, hour) => ({ hour, questions: hourMap.get(hour) ?? 0 })),
      pages: pageRows.map((r) => ({
        path: String(r.path),
        title: String(r.title ?? r.path),
        questions: num(r.questions),
        conversations: num(r.conversations),
        helpful: num(r.helpful),
        unhelpful: num(r.unhelpful),
        failed: num(r.failed),
      })),
      repeated: repeatedRows.map((r) => ({
        question: String(r.question),
        count: num(r.n),
        lastAsked: r.last_asked instanceof Date ? r.last_asked.toISOString() : iso(r.last_asked),
      })),
      links: linkRows.map((r) => ({ href: String(r.href), source: num(r.source), inAnswer: num(r.in_answer) })),
      suggestions: suggestionRows.map((r) => ({ text: String(r.text), count: num(r.n) })),
      devices: deviceRows.map((r) => ({ label: String(r.label), conversations: num(r.conversations) })),
      countries: countryRows.map((r) => ({ label: String(r.label), conversations: num(r.conversations) })),
      models: modelRows.map((r) => ({
        model: String(r.model),
        questions: num(r.questions),
        inputTokens: num(r.input_tokens),
        outputTokens: num(r.output_tokens),
        costUsd: costOf(String(r.model), num(r.input_tokens), num(r.output_tokens)),
      })),
      intents: intentRows.map((r) => ({ intent: String(r.intent), count: num(r.n) })),
      services: serviceRows.map((r) => ({ service: String(r.service), count: num(r.n) })),
      triggers: triggerRows.map((r) => ({ trigger: String(r.trigger), count: num(r.n) })),
      leads,
      log,
    }
  } catch (error) {
    const code = (error as { code?: string; cause?: { code?: string } })?.code ?? (error as { cause?: { code?: string } })?.cause?.code
    if (code === "42P01") return { state: "missing" }
    console.error("Assistant stats failed:", error)
    return { state: "error", message: error instanceof Error ? error.message : String(error) }
  }
}

export { ASSISTANT_RETENTION_DAYS }
