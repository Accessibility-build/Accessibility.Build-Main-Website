"use client"

import { useEffect, useId, useMemo, useState, type ReactNode } from "react"
import Link from "next/link"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import {
  ArrowDownRight,
  ArrowUpRight,
  Clock,
  DollarSign,
  MessageCircle,
  MessagesSquare,
  MousePointerClick,
  Search,
  ThumbsDown,
  ThumbsUp,
  Users,
  CheckCircle2,
  ChevronDown,
  Handshake,
  Target,
  X,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { AssistantMarkdown } from "@/components/assistant/assistant-markdown"
import { MODEL_PRICING_NOTE } from "@/lib/assistant/pricing"
import { INTENT_LABELS, SERVICE_LABELS, TRIGGER_LABELS, type ServiceKey } from "@/lib/assistant/services"
import type { AssistantLogEntry, AssistantStats, PeriodTotals } from "@/lib/assistant/admin-stats"
import { cn } from "@/lib/utils"

type Stats = Extract<AssistantStats, { state: "ok" }>

const fmt = (n: number) => n.toLocaleString("en-US")
const pct = (part: number, whole: number) => (whole ? `${Math.round((part / whole) * 100)}%` : "n/a")
const secs = (ms: number | null) => (ms == null ? "n/a" : `${(ms / 1000).toFixed(1)}s`)
const usd = (n: number) => (n === 0 ? "$0.00" : n < 0.01 ? `$${n.toFixed(4)}` : `$${n.toFixed(2)}`)

function change(current: number, previous: number): { text: string; direction: "up" | "down" | "flat" } {
  if (previous === 0) return current > 0 ? { text: "new this period", direction: "up" } : { text: "no change", direction: "flat" }
  const delta = Math.round(((current - previous) / previous) * 100)
  if (delta === 0) return { text: "no change", direction: "flat" }
  return { text: `${delta > 0 ? "up" : "down"} ${Math.abs(delta)}%`, direction: delta > 0 ? "up" : "down" }
}

const STATUS_LABEL: Record<string, string> = {
  answered: "Answered",
  empty: "Empty answer",
  error: "Failed",
  aborted: "Stopped by visitor",
  rate_limited: "Rate limited",
  unavailable: "Unavailable",
}

const STATUS_CLASS: Record<string, string> = {
  answered: "border-teal-300 bg-teal-50 text-teal-900 dark:border-teal-800 dark:bg-teal-950/50 dark:text-teal-200",
  empty: "border-red-300 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950/50 dark:text-red-200",
  error: "border-red-300 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950/50 dark:text-red-200",
  aborted: "border-slate-300 bg-slate-100 text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200",
  rate_limited: "border-amber-300 bg-amber-50 text-amber-950 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-200",
  unavailable: "border-red-300 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950/50 dark:text-red-200",
}

type Filter = "all" | "service" | "lead_offered" | "unhelpful" | "helpful" | "failed" | "stopped" | "rate_limited" | "no_match" | "about_page"

const serviceLabel = (key: string) => SERVICE_LABELS[key as ServiceKey] ?? key

const FILTERS: { value: Filter; label: string; test: (e: AssistantLogEntry) => boolean }[] = [
  { value: "all", label: "All", test: () => true },
  { value: "service", label: "Service interest", test: (e) => e.intent === "hire" || e.intent === "evaluate" },
  { value: "lead_offered", label: "Contact form shown", test: (e) => e.leadOffered },
  { value: "unhelpful", label: "Not helpful", test: (e) => e.feedback === "unhelpful" },
  { value: "helpful", label: "Helpful", test: (e) => e.feedback === "helpful" },
  { value: "no_match", label: "Not covered by the site", test: (e) => e.status === "answered" && e.searchHits === 0 },
  { value: "failed", label: "Failed", test: (e) => e.status === "error" || e.status === "empty" || e.status === "unavailable" },
  { value: "stopped", label: "Stopped", test: (e) => e.status === "aborted" },
  { value: "rate_limited", label: "Rate limited", test: (e) => e.status === "rate_limited" },
  { value: "about_page", label: "About the page", test: (e) => e.refersToPage },
]

function Kpi({
  label,
  value,
  detail,
  icon: Icon,
  current,
  previous,
  rangeLabel,
}: {
  label: string
  value: string
  detail?: string
  icon: typeof MessageCircle
  current?: number
  previous?: number
  rangeLabel: string
}) {
  const trend = current != null && previous != null ? change(current, previous) : null
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{label}</p>
          <Icon aria-hidden="true" className="h-4 w-4 shrink-0 text-teal-700 dark:text-teal-300" />
        </div>
        <p className="mt-2 text-3xl font-semibold tabular-nums text-slate-950 dark:text-white">{value}</p>
        {detail && <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">{detail}</p>}
        {trend && (
          <p className="mt-2 flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
            {trend.direction === "up" && <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />}
            {trend.direction === "down" && <ArrowDownRight aria-hidden="true" className="h-3.5 w-3.5" />}
            <span>
              {trend.text} on the previous {rangeLabel}
            </span>
          </p>
        )}
      </CardContent>
    </Card>
  )
}

function Section({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold leading-none tracking-tight text-slate-950 dark:text-white">{title}</h2>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

function Empty({ children }: { children: ReactNode }) {
  return <p className="text-sm text-slate-600 dark:text-slate-400">{children}</p>
}

function MeterRow({ label, value, max, display }: { label: string; value: number; max: number; display?: string }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1">
      <span className="truncate text-sm text-slate-800 dark:text-slate-200">{label}</span>
      <span className="text-sm font-semibold tabular-nums text-slate-950 dark:text-white">{display ?? fmt(value)}</span>
      <div className="col-span-2 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800" aria-hidden="true">
        <div className="h-full rounded-full bg-teal-600 dark:bg-teal-400" style={{ width: `${max ? (value / max) * 100 : 0}%` }} />
      </div>
    </div>
  )
}

function DataTable({ caption, head, rows }: { caption: string; head: string[]; rows: (string | number)[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-slate-200 text-left dark:border-slate-800">
            {head.map((h, i) => (
              <th key={h} scope="col" className={cn("py-2 pr-3 font-semibold text-slate-700 dark:text-slate-300", i > 0 && "text-right")}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={String(row[0])} className="border-b border-slate-100 dark:border-slate-800/70">
              {row.map((cell, i) =>
                i === 0 ? (
                  <th key={i} scope="row" className="py-2 pr-3 text-left font-normal text-slate-800 dark:text-slate-200">
                    {cell}
                  </th>
                ) : (
                  <td key={i} className="py-2 pr-3 text-right tabular-nums text-slate-800 dark:text-slate-200">
                    {cell}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ChartFigure({
  caption,
  summary,
  table,
  children,
}: {
  caption: string
  summary: string
  table: { head: string[]; rows: (string | number)[][] }
  children: ReactNode
}) {
  return (
    <figure>
      <div role="img" aria-label={summary} className="h-64 w-full text-xs text-slate-600 dark:text-slate-400">
        {children}
      </div>
      <figcaption className="sr-only">{caption}</figcaption>
      <details className="mt-3 text-sm">
        <summary className="cursor-pointer font-medium text-teal-800 underline underline-offset-2 dark:text-teal-300">
          Show the data as a table
        </summary>
        <div className="mt-2">
          <DataTable caption={caption} head={table.head} rows={table.rows} />
        </div>
      </details>
    </figure>
  )
}

function ratedSummary(t: PeriodTotals) {
  const rated = t.helpful + t.unhelpful
  return rated ? `${fmt(t.helpful)} helpful, ${fmt(t.unhelpful)} not, from ${fmt(rated)} rated` : "No answers rated yet"
}

export function AdminAssistantClient({
  stats,
  rangeLabel,
  timeZone,
  timeZoneLabel,
  initialConversation = null,
}: {
  stats: Stats
  rangeLabel: string
  timeZone: string
  timeZoneLabel: string
  /** From ?conversation=, the link in a lead notification email. */
  initialConversation?: string | null
}) {
  const { current: c, previous: p } = stats
  const searchId = useId()
  const [filter, setFilter] = useState<Filter>("all")
  const [query, setQuery] = useState("")
  const [pageFilter, setPageFilter] = useState<string | null>(null)
  const [conversationFilter, setConversationFilter] = useState<string | null>(initialConversation)
  const [visible, setVisible] = useState(50)

  const dateTime = useMemo(
    () => new Intl.DateTimeFormat("en-GB", { timeZone, day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }),
    [timeZone],
  )
  const dayLabel = (day: string) =>
    new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", timeZone: "UTC" }).format(new Date(`${day}T00:00:00Z`))

  const filtered = useMemo(() => {
    const test = FILTERS.find((f) => f.value === filter)?.test ?? (() => true)
    const q = query.trim().toLowerCase()
    return stats.log
      .filter(test)
      .filter((e) => !pageFilter || e.pagePath === pageFilter)
      .filter((e) => !conversationFilter || e.conversationId === conversationFilter)
      .filter((e) => !q || e.question.toLowerCase().includes(q) || (e.answer ?? "").toLowerCase().includes(q))
      .sort((a, b) => (conversationFilter ? a.turn - b.turn : b.createdAt.localeCompare(a.createdAt)))
  }, [stats.log, filter, query, pageFilter, conversationFilter])

  // Arriving from a lead email (?conversation=...): take the reader straight to that conversation.
  useEffect(() => {
    if (initialConversation) document.getElementById("conversation-log")?.focus()
  }, [initialConversation])

  const counts = useMemo(
    () => Object.fromEntries(FILTERS.map((f) => [f.value, stats.log.filter(f.test).length])) as Record<Filter, number>,
    [stats.log],
  )

  const showLog = (patch: { page?: string; conversation?: string; filter?: Filter }) => {
    if (patch.page !== undefined) setPageFilter(patch.page)
    if (patch.conversation !== undefined) setConversationFilter(patch.conversation)
    if (patch.filter) setFilter(patch.filter)
    setVisible(50)
    requestAnimationFrame(() => document.getElementById("conversation-log")?.focus())
  }

  const questionsPerConversation = c.conversations ? (c.questions / c.conversations).toFixed(1) : "n/a"
  const projectedMonthly = stats.range ? (c.costUsd / stats.range) * 30 : 0
  const maxHour = Math.max(...stats.hours.map((h) => h.questions), 0)
  const busiest = maxHour ? stats.hours.filter((h) => h.questions === maxHour).map((h) => `${String(h.hour).padStart(2, "0")}:00`) : []

  const formsShown = c.leadOffers
  const funnel = [
    { label: "Visitors who opened Curb", value: c.openVisitors },
    { label: "Visitors who asked a question", value: c.askVisitors },
    { label: "Conversations with service interest", value: c.serviceConversations },
    { label: "Contact forms shown", value: formsShown },
    { label: "Leads sent to the team", value: c.leads },
  ]
  const funnelMax = Math.max(...funnel.map((f) => f.value), 1)

  if (stats.totalRows === 0 && c.opens === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-sm leading-6 text-slate-700 dark:text-slate-300">
          <p className="font-semibold text-slate-950 dark:text-white">Nothing recorded yet.</p>
          <p className="mt-1">
            The tables are in place. Data appears here as soon as someone opens the assistant or asks a question.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      <p className="text-sm text-slate-600 dark:text-slate-400">
        Last {rangeLabel}, compared with the {rangeLabel} before. Data since{" "}
        {stats.dataSince ? dateTime.format(new Date(stats.dataSince)) : "n/a"}, {fmt(stats.totalRows)} questions stored in total.
      </p>

      <section aria-labelledby="kpi-heading">
        <h2 id="kpi-heading" className="sr-only">
          Key figures
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Kpi label="Questions" value={fmt(c.questions)} detail={`${questionsPerConversation} per conversation`} icon={MessageCircle} current={c.questions} previous={p.questions} rangeLabel={rangeLabel} />
          <Kpi label="Conversations" value={fmt(c.conversations)} detail={`${fmt(c.signedIn)} questions from signed-in users`} icon={MessagesSquare} current={c.conversations} previous={p.conversations} rangeLabel={rangeLabel} />
          <Kpi label="Visitors who asked" value={fmt(c.askVisitors)} detail={`${pct(c.askVisitors, c.openVisitors)} of the ${fmt(c.openVisitors)} who opened Curb`} icon={Users} current={c.askVisitors} previous={p.askVisitors} rangeLabel={rangeLabel} />
          <Kpi label="Times opened" value={fmt(c.opens)} detail={`${fmt(c.suggestionClicks)} starter suggestions used`} icon={MousePointerClick} current={c.opens} previous={p.opens} rangeLabel={rangeLabel} />
          <Kpi label="Answered successfully" value={pct(c.answered, c.questions)} detail={`${fmt(c.answered)} of ${fmt(c.questions)}; ${fmt(c.failed)} failed, ${fmt(c.stopped)} stopped`} icon={CheckCircle2} current={c.answered} previous={p.answered} rangeLabel={rangeLabel} />
          <Kpi label="Rated helpful" value={pct(c.helpful, c.helpful + c.unhelpful)} detail={ratedSummary(c)} icon={ThumbsUp} current={c.helpful} previous={p.helpful} rangeLabel={rangeLabel} />
          <Kpi label="Median answer time" value={secs(c.p50LatencyMs)} detail={`First words after ${secs(c.p50FirstTokenMs)}; slowest 10% over ${secs(c.p90LatencyMs)}`} icon={Clock} rangeLabel={rangeLabel} />
          <Kpi label="Service interest" value={fmt(c.serviceConversations)} detail={`conversations; ${fmt(c.hireIntent)} questions from people wanting to hire`} icon={Target} current={c.serviceConversations} previous={p.serviceConversations} rangeLabel={rangeLabel} />
          <Kpi label="Leads captured" value={fmt(c.leads)} detail={`${pct(c.leads, formsShown)} of the ${fmt(formsShown)} contact forms Curb offered`} icon={Handshake} current={c.leads} previous={p.leads} rangeLabel={rangeLabel} />
          <Kpi label="Model cost" value={usd(c.costUsd)} detail={`${usd(c.questions ? c.costUsd / c.questions : 0)} per question; about ${usd(projectedMonthly)} a month at this rate`} icon={DollarSign} current={c.costUsd} previous={p.costUsd} rangeLabel={rangeLabel} />
        </div>
      </section>

      <Section
        title="Leads from Curb"
        description="Contact requests sent through Curb's form, newest first. Each is also in Prospects under the Inbound tier, and was emailed to you."
      >
        {stats.leads.length ? (
          <ol className="divide-y divide-slate-200 rounded-lg border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
            {stats.leads.map((lead) => (
              <li key={lead.id}>
                <details className="group">
                  <summary className="flex cursor-pointer list-none flex-col gap-1.5 px-4 py-3 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-teal-700 dark:hover:bg-slate-900 sm:flex-row sm:items-start sm:gap-4 [&::-webkit-details-marker]:hidden">
                    <span className="w-28 shrink-0 text-xs tabular-nums text-slate-600 dark:text-slate-400">{dateTime.format(new Date(lead.createdAt))}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-slate-950 dark:text-white">
                        {lead.name}
                        {lead.organisation ? `, ${lead.organisation}` : ""}
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-slate-600 dark:text-slate-400">
                        {lead.services.length ? lead.services.map(serviceLabel).join(", ") : "Services not identified"}
                        {lead.trigger && lead.trigger !== "unknown" ? `. ${TRIGGER_LABELS[lead.trigger] ?? lead.trigger}` : ""}
                      </span>
                    </span>
                    <span className="flex shrink-0 items-center gap-2">
                      <ChevronDown aria-hidden="true" className="h-4 w-4 text-slate-500 transition-transform group-open:rotate-180" />
                      {lead.urgency === "urgent" && (
                        <span className="rounded-full border border-red-300 bg-red-50 px-2 py-0.5 text-xs font-medium text-red-900 dark:border-red-800 dark:bg-red-950/50 dark:text-red-200">Urgent</span>
                      )}
                      <span className="rounded-full border border-teal-300 bg-teal-50 px-2 py-0.5 text-xs font-semibold tabular-nums text-teal-900 dark:border-teal-800 dark:bg-teal-950/50 dark:text-teal-200">
                        Score {lead.score}
                      </span>
                    </span>
                  </summary>
                  <div className="space-y-4 border-t border-slate-200 bg-slate-50/60 px-4 py-4 text-sm dark:border-slate-800 dark:bg-slate-900/40">
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">Their message</h3>
                      <p className="mt-1 whitespace-pre-wrap text-slate-950 dark:text-white">{lead.message}</p>
                    </div>
                    {lead.aiSummary && (
                      <div>
                        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">Curb&apos;s read of the conversation</h3>
                        <p className="mt-1 text-slate-800 dark:text-slate-200">{lead.aiSummary}</p>
                      </div>
                    )}
                    <dl className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs sm:grid-cols-4">
                      {[
                        ["Email", lead.email],
                        ["Website", lead.website ?? "Not given"],
                        ["Urgency", lead.urgency ?? "Unknown"],
                        ["Asked on", lead.pagePath ?? "Unknown"],
                        ["Form", lead.source === "manual" ? "Opened by the visitor" : "Offered by Curb"],
                        ["Country", lead.country ?? "Unknown"],
                        ["Notification email", lead.notified ? "Sent" : "Not sent"],
                      ].map(([term, value]) => (
                        <div key={term} className="min-w-0">
                          <dt className="text-slate-600 dark:text-slate-400">{term}</dt>
                          <dd className="truncate text-slate-950 dark:text-white">{value}</dd>
                        </div>
                      ))}
                    </dl>
                    <div className="flex flex-wrap gap-2">
                      <a href={`mailto:${lead.email}`} className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-800 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-700 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
                        Email {lead.name}
                      </a>
                      <button type="button" onClick={() => showLog({ conversation: lead.conversationId, filter: "all", page: "" })} className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-800 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-700 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
                        Read the conversation
                      </button>
                      {lead.prospectId && (
                        <Link href={`/admin/prospects/${lead.prospectId}`} className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-800 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-700 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
                          Open in Prospects
                        </Link>
                      )}
                    </div>
                  </div>
                </details>
              </li>
            ))}
          </ol>
        ) : (
          <Empty>No leads in this period yet.</Empty>
        )}
      </Section>

      <div className="grid gap-8 lg:grid-cols-3">
        <Section title="What visitors want" description="Every question, as judged by Curb's intent classifier from the conversation, not from keywords.">
          {stats.intents.length ? (
            <div className="space-y-3">
              {stats.intents.map((i) => (
                <MeterRow key={i.intent} label={INTENT_LABELS[i.intent] ?? i.intent} value={i.count} max={stats.intents[0].count} />
              ))}
            </div>
          ) : (
            <Empty>No questions in this period.</Empty>
          )}
        </Section>
        <Section title="Services in demand" description="Services named or implied by visitors who want to hire or are weighing it up.">
          {stats.services.length ? (
            <div className="space-y-3">
              {stats.services.map((sv) => (
                <MeterRow key={sv.service} label={serviceLabel(sv.service)} value={sv.count} max={stats.services[0].count} />
              ))}
            </div>
          ) : (
            <Empty>No service interest in this period.</Empty>
          )}
        </Section>
        <Section title="What is driving it" description="The reason behind service interest, when the visitor said or clearly implied it.">
          {stats.triggers.length ? (
            <div className="space-y-3">
              {stats.triggers.map((t) => (
                <MeterRow key={t.trigger} label={TRIGGER_LABELS[t.trigger] ?? t.trigger} value={t.count} max={stats.triggers[0].count} />
              ))}
            </div>
          ) : (
            <Empty>No stated reasons in this period.</Empty>
          )}
        </Section>
      </div>

      <Section title="Activity by day" description={`Questions asked and times Curb was opened, per day in ${timeZoneLabel}.`}>
        <ChartFigure
          caption={`Questions and opens per day, last ${rangeLabel}`}
          summary={`Bar chart of questions and opens per day over the last ${rangeLabel}: ${fmt(c.questions)} questions and ${fmt(c.opens)} opens in total.`}
          table={{
            head: ["Day", "Questions", "Conversations", "Failed", "Opens"],
            rows: stats.daily.map((d) => [dayLabel(d.day), d.questions, d.conversations, d.failed, d.opens]),
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.daily.map((d) => ({ ...d, label: dayLabel(d.day) }))} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-slate-200 dark:stroke-slate-800" />
              <XAxis dataKey="label" tick={{ fill: "currentColor" }} interval="preserveStartEnd" minTickGap={16} />
              <YAxis allowDecimals={false} tick={{ fill: "currentColor" }} />
              <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="questions" name="Questions" fill="#0f766e" radius={[3, 3, 0, 0]} />
              <Bar dataKey="opens" name="Opens" fill="#94a3b8" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartFigure>
      </Section>

      <div className="grid gap-8 lg:grid-cols-2">
        <Section title="From opening to useful" description="How far visitors get once they find Curb.">
          <div className="space-y-4">
            {funnel.map((step) => (
              <MeterRow key={step.label} label={step.label} value={step.value} max={funnelMax} />
            ))}
          </div>
          <p className="mt-4 text-xs text-slate-600 dark:text-slate-400">
            {fmt(c.sourceClicks)} clicks on &quot;Related on this site&quot; and {fmt(c.answerLinkClicks)} on links inside answers.{" "}
            {fmt(c.newChats)} new chats started.
          </p>
        </Section>

        <Section title="Answer quality" description="Outcomes for every question in the period.">
          <dl className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-2 text-sm">
            {[
              ["Answered", fmt(c.answered)],
              ["Failed or empty", fmt(c.failed)],
              ["Stopped by the visitor", fmt(c.stopped)],
              ["Refused by the rate limit", fmt(c.rateLimited)],
              ["Assistant unavailable", fmt(c.unavailable)],
              ["Answered without any site match", `${fmt(c.noSiteMatch)} (${pct(c.noSiteMatch, c.answered)})`],
              ["Asked about the page being viewed", `${fmt(c.aboutPage)} (${pct(c.aboutPage, c.questions)})`],
              ["Sent with the page's text", `${fmt(c.withPageContext)} (${pct(c.withPageContext, c.questions)})`],
            ].map(([term, value]) => (
              <div key={term} className="contents">
                <dt className="text-slate-700 dark:text-slate-300">{term}</dt>
                <dd className="text-right font-semibold tabular-nums text-slate-950 dark:text-white">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" onClick={() => showLog({ filter: "unhelpful", page: "", conversation: "" })} className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-800 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-700 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
              Read the {fmt(counts.unhelpful)} rated not helpful
            </button>
            <button type="button" onClick={() => showLog({ filter: "no_match", page: "", conversation: "" })} className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-800 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-700 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
              Read the {fmt(counts.no_match)} the site does not cover
            </button>
            <button type="button" onClick={() => showLog({ filter: "failed", page: "", conversation: "" })} className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-800 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-700 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
              Read the {fmt(counts.failed)} failures
            </button>
          </div>
        </Section>
      </div>

      <Section title="Where people ask" description="Pages visitors were on when they asked. Use a page's button to read its questions.">
        {stats.pages.length ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <caption className="sr-only">Questions by page</caption>
              <thead>
                <tr className="border-b border-slate-200 text-left dark:border-slate-800">
                  {["Page", "Questions", "Conversations", "Helpful", "Not helpful", "Failed", ""].map((h, i) => (
                    <th key={h || "actions"} scope="col" className={cn("py-2 pr-3 font-semibold text-slate-700 dark:text-slate-300", i > 0 && "text-right")}>
                      {h || <span className="sr-only">Actions</span>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.pages.map((page) => (
                  <tr key={page.path} className="border-b border-slate-100 dark:border-slate-800/70">
                    <th scope="row" className="max-w-xs py-2 pr-3 text-left font-normal">
                      <Link href={page.path.startsWith("/") ? page.path : "/"} className="font-medium text-teal-800 underline underline-offset-2 dark:text-teal-300">
                        {page.title}
                      </Link>
                      <span className="block truncate font-mono text-xs text-slate-600 dark:text-slate-400">{page.path}</span>
                    </th>
                    {[page.questions, page.conversations, page.helpful, page.unhelpful, page.failed].map((value, i) => (
                      <td key={i} className="py-2 pr-3 text-right tabular-nums text-slate-800 dark:text-slate-200">
                        {fmt(value)}
                      </td>
                    ))}
                    <td className="py-2 text-right">
                      <button type="button" onClick={() => showLog({ page: page.path, conversation: "", filter: "all" })} className="whitespace-nowrap rounded-md border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-800 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-700 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
                        Read questions<span className="sr-only"> asked on {page.title}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty>No questions in this period.</Empty>
        )}
      </Section>

      <div className="grid gap-8 lg:grid-cols-2">
        <Section title="Asked more than once" description="Questions asked at least twice, ignoring case and trailing punctuation. Good candidates for FAQs or new pages.">
          {stats.repeated.length ? (
            <ol className="space-y-2 text-sm">
              {stats.repeated.map((r) => (
                <li key={r.question} className="flex items-start justify-between gap-3">
                  <button type="button" onClick={() => { setQuery(r.question); showLog({ filter: "all", page: "", conversation: "" }) }} className="text-left text-slate-800 underline decoration-slate-400 underline-offset-2 hover:text-teal-800 dark:text-slate-200 dark:hover:text-teal-300">
                    {r.question}
                  </button>
                  <span className="shrink-0 font-semibold tabular-nums text-slate-950 dark:text-white">{fmt(r.count)}×</span>
                </li>
              ))}
            </ol>
          ) : (
            <Empty>No question has been asked twice yet.</Empty>
          )}
        </Section>

        <Section title="Starter suggestions used" description="Which of the page-aware starter questions visitors clicked.">
          {stats.suggestions.length ? (
            <div className="space-y-3">
              {stats.suggestions.map((s) => (
                <MeterRow key={s.text} label={s.text} value={s.count} max={stats.suggestions[0].count} />
              ))}
            </div>
          ) : (
            <Empty>No starter suggestions clicked in this period.</Empty>
          )}
        </Section>
      </div>

      <Section title="Where Curb sends people" description="Site links clicked from answers, split between the 'Related on this site' list and links inside the answer text.">
        {stats.links.length ? (
          <DataTable
            caption="Links clicked from Curb answers"
            head={["Link", "Related list", "In answer", "Total"]}
            rows={stats.links.map((l) => [l.href, l.source, l.inAnswer, l.source + l.inAnswer])}
          />
        ) : (
          <Empty>No links clicked in this period.</Empty>
        )}
      </Section>

      <div className="grid gap-8 lg:grid-cols-3">
        <Section title="Devices" description="Conversations by device type.">
          {stats.devices.length ? (
            <div className="space-y-3">
              {stats.devices.map((d) => (
                <MeterRow key={d.label} label={d.label} value={d.conversations} max={stats.devices[0].conversations} />
              ))}
            </div>
          ) : (
            <Empty>No data.</Empty>
          )}
        </Section>
        <Section title="Countries" description="Conversations by country, from the hosting provider's IP lookup.">
          {stats.countries.length ? (
            <div className="space-y-3">
              {stats.countries.map((d) => (
                <MeterRow key={d.label} label={d.label} value={d.conversations} max={stats.countries[0].conversations} />
              ))}
            </div>
          ) : (
            <Empty>No data.</Empty>
          )}
        </Section>
        <Section title="Busiest hours" description={`Questions by hour of day, ${timeZoneLabel}.`}>
          <ChartFigure
            caption={`Questions by hour of day, ${timeZoneLabel}`}
            summary={busiest.length ? `Bar chart of questions by hour. Busiest: ${busiest.join(", ")} with ${maxHour} questions.` : "Bar chart of questions by hour. No questions yet."}
            table={{ head: ["Hour", "Questions"], rows: stats.hours.map((h) => [`${String(h.hour).padStart(2, "0")}:00`, h.questions]) }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.hours} margin={{ top: 8, right: 4, bottom: 0, left: -24 }}>
                <XAxis dataKey="hour" tick={{ fill: "currentColor" }} interval={5} />
                <YAxis allowDecimals={false} tick={{ fill: "currentColor" }} />
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 12 }} labelFormatter={(h) => `${String(h).padStart(2, "0")}:00`} />
                <Bar dataKey="questions" name="Questions" fill="#0f766e" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartFigure>
        </Section>
      </div>

      <Section title="Model usage and cost" description={MODEL_PRICING_NOTE}>
        {stats.models.length ? (
          <DataTable
            caption="Tokens and estimated cost by model"
            head={["Model", "Questions", "Input tokens", "Output tokens", "Estimated cost"]}
            rows={stats.models.map((m) => [m.model, fmt(m.questions), fmt(m.inputTokens), fmt(m.outputTokens), usd(m.costUsd)])}
          />
        ) : (
          <Empty>No model calls in this period.</Empty>
        )}
      </Section>

      <section aria-labelledby="log-heading">
        <Card>
          <CardHeader>
            <h2 id="log-heading" className="text-lg font-semibold leading-none tracking-tight text-slate-950 dark:text-white">
              Conversation log
            </h2>
            <CardDescription>
              The latest {fmt(stats.log.length)} questions in this period, newest first. Emails, phone and card numbers were masked before saving.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter questions">
              {FILTERS.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  aria-pressed={filter === f.value}
                  onClick={() => { setFilter(f.value); setVisible(50) }}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-teal-700",
                    filter === f.value
                      ? "border-teal-700 bg-teal-700 text-white dark:border-teal-400 dark:bg-teal-400 dark:text-slate-950"
                      : "border-slate-300 text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
                  )}
                >
                  {f.label} <span className="tabular-nums">({fmt(counts[f.value])})</span>
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <label htmlFor={searchId} className="sr-only">
                Search questions and answers
              </label>
              <div className="relative flex-1">
                <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  id={searchId}
                  type="search"
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setVisible(50) }}
                  placeholder="Search questions and answers"
                  className="h-10 w-full rounded-md border border-slate-500 bg-white pl-9 pr-3 text-sm text-slate-950 placeholder:text-slate-500 focus:border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-700/30 dark:border-slate-500 dark:bg-slate-950 dark:text-white"
                />
              </div>
              {(pageFilter || conversationFilter) && (
                <div className="flex flex-wrap gap-2">
                  {pageFilter && (
                    <button type="button" onClick={() => setPageFilter(null)} className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-3 py-1 text-xs text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
                      Page: <span className="font-mono">{pageFilter}</span>
                      <X aria-hidden="true" className="h-3 w-3" />
                      <span className="sr-only">Remove page filter</span>
                    </button>
                  )}
                  {conversationFilter && (
                    <button type="button" onClick={() => setConversationFilter(null)} className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-3 py-1 text-xs text-slate-800 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
                      One conversation
                      <X aria-hidden="true" className="h-3 w-3" />
                      <span className="sr-only">Show all conversations</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            <p id="conversation-log" tabIndex={-1} role="status" className="text-sm text-slate-700 outline-none dark:text-slate-300">
              Showing {fmt(Math.min(visible, filtered.length))} of {fmt(filtered.length)} matching questions.
            </p>

            {filtered.length ? (
              <ol className="divide-y divide-slate-200 rounded-lg border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
                {filtered.slice(0, visible).map((entry) => (
                  <li key={entry.id}>
                    <details className="group">
                      <summary className="flex cursor-pointer list-none flex-col [&::-webkit-details-marker]:hidden gap-1.5 px-4 py-3 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-teal-700 dark:hover:bg-slate-900 sm:flex-row sm:items-start sm:gap-4">
                        <span className="w-28 shrink-0 text-xs tabular-nums text-slate-600 dark:text-slate-400">
                          {dateTime.format(new Date(entry.createdAt))}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="line-clamp-2 text-sm font-medium text-slate-950 dark:text-white">{entry.question}</span>
                          <span className="mt-0.5 block truncate font-mono text-xs text-slate-600 dark:text-slate-400">{entry.pagePath ?? "unknown page"}</span>
                        </span>
                        <span className="flex shrink-0 items-center gap-2">
                          {entry.feedback === "helpful" && (
                            <span className="text-teal-700 dark:text-teal-300">
                              <ThumbsUp aria-hidden="true" className="h-4 w-4" />
                              <span className="sr-only">Rated helpful</span>
                            </span>
                          )}
                          {entry.feedback === "unhelpful" && (
                            <span className="text-red-700 dark:text-red-300">
                              <ThumbsDown aria-hidden="true" className="h-4 w-4" />
                              <span className="sr-only">Rated not helpful</span>
                            </span>
                          )}
                          <ChevronDown aria-hidden="true" className="h-4 w-4 text-slate-500 transition-transform group-open:rotate-180" />
                          {(entry.intent === "hire" || entry.intent === "evaluate") && (
                            <span className="rounded-full border border-blue-300 bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-900 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-200">
                              {INTENT_LABELS[entry.intent]}
                            </span>
                          )}
                          {entry.status === "answered" && entry.searchHits === 0 && (
                            <span className="rounded-full border border-slate-300 px-2 py-0.5 text-xs text-slate-700 dark:border-slate-700 dark:text-slate-300">No site match</span>
                          )}
                          <span className={cn("rounded-full border px-2 py-0.5 text-xs font-medium", STATUS_CLASS[entry.status] ?? STATUS_CLASS.aborted)}>
                            {STATUS_LABEL[entry.status] ?? entry.status}
                          </span>
                        </span>
                      </summary>
                      <div className="space-y-4 border-t border-slate-200 bg-slate-50/60 px-4 py-4 dark:border-slate-800 dark:bg-slate-900/40">
                        <div>
                          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">Question</h3>
                          <p className="mt-1 whitespace-pre-wrap text-sm text-slate-950 dark:text-white">{entry.question}</p>
                        </div>
                        <div>
                          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">Answer</h3>
                          <div className="mt-1">
                            {entry.answer ? <AssistantMarkdown content={entry.answer} /> : <p className="text-sm text-slate-600 dark:text-slate-400">No answer was produced.</p>}
                          </div>
                          {entry.errorMessage && <p className="mt-2 font-mono text-xs text-red-800 dark:text-red-300">{entry.errorMessage}</p>}
                        </div>
                        {entry.intentSummary && (
                          <div>
                            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">Intent read</h3>
                            <p className="mt-1 text-sm text-slate-800 dark:text-slate-200">{entry.intentSummary}</p>
                          </div>
                        )}
                        {entry.sources.length > 0 && (
                          <div>
                            <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-400">Related links shown</h3>
                            <ul className="mt-1 space-y-0.5 text-sm">
                              {entry.sources.map((s) => (
                                <li key={s.path}>
                                  <Link href={s.path} className="text-teal-800 underline underline-offset-2 dark:text-teal-300">{s.title}</Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        <dl className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs sm:grid-cols-4">
                          {[
                            ["Page", entry.pageTitle ?? entry.pagePath ?? "unknown"],
                            ["Turn in chat", String(entry.turn)],
                            ["Answer time", `${secs(entry.latencyMs)} (first words ${secs(entry.firstTokenMs)})`],
                            ["Tokens", entry.inputTokens != null ? `${fmt(entry.inputTokens)} in, ${fmt(entry.outputTokens ?? 0)} out` : "n/a"],
                            ["Site matches", `${entry.searchHits}${entry.topScore != null ? ` (best score ${entry.topScore.toFixed(1)})` : ""}`],
                            ["Page text sent", entry.pageContextSent ? "Yes" : "No"],
                            ["Device and country", `${entry.device ?? "unknown"}, ${entry.country ?? "unknown"}`],
                            ["Signed in", entry.signedIn ? "Yes" : "No"],
                            ["Intent", entry.intent ? `${INTENT_LABELS[entry.intent] ?? entry.intent}${entry.leadScore ? `, lead score ${entry.leadScore}` : ""}` : "Not classified"],
                            ["Contact form", entry.leadOffered ? "Shown under this answer" : "Not shown"],
                          ].map(([term, value]) => (
                            <div key={term} className="min-w-0">
                              <dt className="text-slate-600 dark:text-slate-400">{term}</dt>
                              <dd className="truncate text-slate-950 dark:text-white">{value}</dd>
                            </div>
                          ))}
                        </dl>
                        <div className="flex flex-wrap gap-2">
                          {!conversationFilter && (
                            <button type="button" onClick={() => showLog({ conversation: entry.conversationId, filter: "all", page: "" })} className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-800 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-700 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
                              Show the whole conversation
                            </button>
                          )}
                          {entry.pagePath && pageFilter !== entry.pagePath && (
                            <button type="button" onClick={() => showLog({ page: entry.pagePath ?? "", filter: "all", conversation: "" })} className="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-800 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-700 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
                              Show questions from this page
                            </button>
                          )}
                        </div>
                      </div>
                    </details>
                  </li>
                ))}
              </ol>
            ) : (
              <Empty>No questions match these filters.</Empty>
            )}

            {filtered.length > visible && (
              <button type="button" onClick={() => setVisible((v) => v + 50)} className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-teal-700 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">
                Show 50 more
              </button>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
