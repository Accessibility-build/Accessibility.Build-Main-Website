"use server"

import { currentUser } from "@clerk/nextjs/server"
import {
  creditTransactions,
  db,
  users,
  urlAccessibilityAudits,
  auditViolations
} from "@/lib/db"
import { and, desc, eq, gte, sql } from "drizzle-orm"
import OpenAI from "openai"
import { checkTrialLimit, recordTrialUsage } from "@/lib/trial-usage"
import { isBlockedHostname, normalizeHostname } from "@/lib/url-safety"
import { PublicUrlError } from "@/lib/public-url"
import { FREE_SCAN_VISIBLE_FINDINGS } from "@/lib/free-scan"
import { UrlAuditResult, AuditHistory } from '@/lib/url-accessibility-auditor-types'
import { runAudit } from "@/lib/url-audit/run"
import { countViolations, scFromTag, scoreFrom } from "@/lib/url-audit/report"
import type { AiSummary, AuditExtras, AuditFinding, FindingCategory, Impact } from "@/lib/url-audit/types"
import { v4 as uuidv4 } from 'uuid'
import {
  isOpenRouterConfigured,
  isOpenRouterModel,
  openrouter,
} from "@/lib/openrouter"
import { hasServerUnlimitedAccess } from "@/lib/unlimited-access-server"
import { getPostHogClient } from "@/lib/posthog-server"

const CREDIT_COST = 5
const DEFAULT_MODEL = "gpt-4o"
/** The page segment allows 120 s; the browser work must finish by this point to leave room for the summary and the save. */
const SCAN_BUDGET_MS = 88_000
const AI_TIMEOUT_MS = 18_000

/**
 * A short plain-language summary of the findings for people who will not read the table. It is
 * written from the findings only and told not to invent statistics, benchmarks or legal outcomes.
 */
async function generateAiSummary(input: {
  url: string
  title: string
  score: number
  findings: AuditFinding[]
  extras: AuditExtras
}): Promise<string | undefined> {
  if (!process.env.OPENAI_API_KEY && !isOpenRouterConfigured()) return undefined

  const violations = input.findings.filter((f) => f.outcome === "violation")
  const review = input.findings.filter((f) => f.outcome === "review")
  // Nothing confirmed means nothing to summarise; the report explains a clean result itself.
  if (violations.length === 0) return undefined
  const describe = (f: AuditFinding) => ({
    title: f.title,
    impact: f.outcome === "violation" ? f.impact : `${f.impact}, if a person confirms it`,
    wcag: f.wcag.join(", ") || "best practice",
    elements: f.nodeCount,
    checkedBy: f.source,
  })

  const systemPrompt = `You are a senior accessibility auditor writing the summary at the top of an automated audit report.
Write for a product owner or developer. Plain English, short sentences, no marketing language, no em dashes.
Use only the facts provided. Never invent statistics, industry averages, benchmarks, legal risk ratings or percentages.
Do not claim the page is compliant or non-compliant; automated testing cannot establish conformance.

There are two kinds of result:
- "violations" are confirmed failures. Only these may be called issues, failures or barriers.
- "needsReview" items are NOT failures. A check could not decide, or found something a person must judge. Never call them issues, problems or failures, never call the page's state serious because of them, and never tell the reader to "fix" them. Call them things to check.

Return ONLY a JSON object with this schema:
{
  "headline": "one sentence, at most 18 words, on the overall state",
  "summary": "2 to 4 sentences: what works, what blocks people, and who is affected",
  "fixFirst": [{ "title": "imperative, at most 8 words", "why": "one sentence naming who is affected and how" }],
  "quickWins": ["short imperative actions that take under an hour"]
}

fixFirst has 2 to 4 items drawn from the violations, most severe first. quickWins has 2 to 4 small actions that are NOT already in fixFirst; return an empty array rather than repeat fixFirst.`

  const userPrompt = JSON.stringify({
    url: input.url,
    title: input.title,
    score: input.score,
    violations: violations.slice(0, 12).map(describe),
    needsReview: review.slice(0, 8).map(describe),
    keyboard: input.extras.keyboard.ran
      ? { tabStops: input.extras.keyboard.stops, noVisibleFocus: input.extras.keyboard.noIndicator, trapped: input.extras.keyboard.trap }
      : "not run",
    reflowAt320px: input.extras.layout.reflowScrollWidth,
    overlayWidget: input.extras.facts.overlay,
    accessibilityStatementLink: Boolean(input.extras.facts.statementLink),
  })

  try {
    const useOpenRouter = isOpenRouterModel(DEFAULT_MODEL) && isOpenRouterConfigured()
    const client = useOpenRouter ? openrouter : new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    const response = await client.chat.completions.create(
      {
        model: DEFAULT_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.2,
        max_tokens: 700,
        response_format: { type: "json_object" },
      },
      { signal: AbortSignal.timeout(AI_TIMEOUT_MS) },
    )
    const parsed = JSON.parse(response.choices[0]?.message?.content || "{}") as Partial<AiSummary>
    if (!parsed.headline || !parsed.summary) return undefined
    const headline = String(parsed.headline).replace(/\s*—\s*/g, ", ")
    const summaryText = String(parsed.summary).replace(/\s*—\s*/g, ", ")
    const summary: AiSummary = {
      headline,
      summary: summaryText,
      fixFirst: Array.isArray(parsed.fixFirst) ? parsed.fixFirst.slice(0, 4).filter((item) => item?.title && item?.why) : [],
      quickWins: Array.isArray(parsed.quickWins) ? parsed.quickWins.slice(0, 4).map(String) : [],
    }
    return JSON.stringify(summary)
  } catch (error) {
    console.error("URL audit AI summary failed:", error)
    return undefined
  }
}

/** Chromium's navigation errors are accurate and unreadable; say what happened instead. */
function friendlyScanError(error: unknown): string {
  if (error instanceof PublicUrlError) return error.message
  const message = error instanceof Error ? error.message : ""
  if (/ERR_NAME_NOT_RESOLVED/.test(message)) {
    return "That address could not be found. Check the spelling and try again."
  }
  if (/ERR_CONNECTION_(REFUSED|RESET|CLOSED|TIMED_OUT)|ERR_ADDRESS_UNREACHABLE/.test(message)) {
    return "The site did not respond. It may be down, or it may block automated visitors."
  }
  if (/ERR_CERT_|ERR_SSL_/.test(message)) {
    return "The site's security certificate could not be verified, so the page was not loaded."
  }
  if (/timeout|timed out/i.test(message)) {
    return "The page took too long to load and check, so the scan stopped. Try again, or try a lighter page."
  }
  if (/Target closed|Session closed|Protocol error/i.test(message)) {
    return "The page closed our browser while it was being checked. Try again in a minute."
  }
  return "The scan could not finish. Try again in a minute."
}

/** The stored form of a finding: the columns audit_violations already has, plus the rest in tool_specific_data. */
function findingRow(auditId: string, finding: AuditFinding) {
  return {
    auditId,
    violationId: finding.ruleId,
    description: finding.description,
    impact: finding.impact,
    helpUrl: finding.helpUrl,
    wcagCriteria: finding.wcag,
    wcagLevel: finding.wcagLevel,
    selector: finding.nodes[0]?.selector ?? "",
    html: finding.nodes[0]?.html ?? "",
    target: finding.nodes.map((node) => node.selector),
    detectedBy: [finding.source],
    confidence: finding.outcome === "violation" ? 100 : 50,
    fixSuggestion: finding.fix,
    aiExplanation: "",
    toolSpecificData: {
      version: 2,
      title: finding.title,
      outcome: finding.outcome,
      category: finding.category,
      nodes: finding.nodes,
      nodeCount: finding.nodeCount,
    },
  }
}

/**
 * Audits one public URL: axe-core plus the accessibility.build checks (keyboard pass, reflow, text
 * spacing, reduced motion and DOM checks), a short AI summary, and, for signed-in users, a saved
 * record and the credit charge.
 *
 * Refusals (invalid or non-public URL, missing account, too few credits, free-scan limit reached)
 * come back as a result with `status: 'failed'` and the reason in `errorMessage`; nothing is thrown
 * for them, because Next.js hides the message of errors thrown from server actions in production.
 */
export async function runUrlAccessibilityAudit(
  url: string,
  unlimitedAccess: boolean = false
): Promise<UrlAuditResult> {
  const auditId = uuidv4()
  const startTime = new Date()

  const refuse = (message: string): UrlAuditResult => ({
    auditId,
    status: 'failed',
    url,
    createdAt: startTime.toISOString(),
    errorMessage: message,
  })

  let parsedUrl: URL
  try {
    parsedUrl = new URL(url)
  } catch {
    return refuse("Invalid URL. Please enter a full URL (e.g. https://google.com)")
  }
  if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
    return refuse("Only http and https URLs can be scanned.")
  }
  if (isBlockedHostname(parsedUrl.hostname)) {
    return refuse("Private or local network URLs cannot be scanned. Enter a public website URL.")
  }

  // Authentication and credits
  const currentUserObj = await currentUser()
  const hasUnlimitedAccess = await hasServerUnlimitedAccess()
  const effectiveUnlimitedAccess = unlimitedAccess && hasUnlimitedAccess
  let dbUser = null

  if (currentUserObj) {
    const usersList = await db.select().from(users).where(eq(users.id, currentUserObj.id)).limit(1)
    dbUser = usersList[0]
  }
  if (!effectiveUnlimitedAccess) {
    if (currentUserObj) {
      if (!dbUser) return refuse("User account not found.")
      if (dbUser.credits < CREDIT_COST) return refuse(`You need ${CREDIT_COST} credits to run an audit.`)
    } else {
      const trial = await checkTrialLimit("url_accessibility_auditor")
      if (!trial.allowed) return refuse(trial.message)
    }
  }

  try {
    const scanStart = new Date()
    const run = await runAudit(parsedUrl, { deadline: Date.now() + SCAN_BUDGET_MS })
    const counts = countViolations(run.findings)
    const overallScore = scoreFrom(counts)
    const reviewCount = run.findings.filter((finding) => finding.outcome === "review").length
    const violationElements = run.findings.filter((finding) => finding.outcome === "violation").reduce((sum, finding) => sum + finding.nodeCount, 0)

    const aiSummary = await generateAiSummary({ url, title: run.title, score: overallScore, findings: run.findings, extras: run.extras })
    const scanEnd = new Date()

    const result: UrlAuditResult = {
      auditId,
      status: 'completed',
      url,
      title: run.title,
      createdAt: startTime.toISOString(),
      processingStartedAt: scanStart.toISOString(),
      processingCompletedAt: scanEnd.toISOString(),
      ...counts,
      reviewCount,
      violationElements,
      overallScore,
      aiSummary,
      findings: run.findings,
      extras: run.extras,
      screenshot: run.screenshot ?? undefined,
    }

    if (currentUserObj && dbUser) {
      let savedAuditId = ''

      await db.transaction(async (tx) => {
        let creditsUsed = 0

        if (!effectiveUnlimitedAccess) {
          creditsUsed = CREDIT_COST
          const [updatedUser] = await tx.update(users)
            .set({
              credits: sql`${users.credits} - ${CREDIT_COST}`,
              totalCreditsUsed: sql`${users.totalCreditsUsed} + ${CREDIT_COST}`,
              updatedAt: new Date()
            })
            .where(and(eq(users.id, currentUserObj.id), gte(users.credits, CREDIT_COST)))
            .returning({ credits: users.credits })

          if (!updatedUser) {
            throw new Error(`You need ${CREDIT_COST} credits to run an audit.`)
          }

          await tx.insert(creditTransactions).values({
            userId: dbUser.id,
            type: 'usage',
            amount: -CREDIT_COST,
            balanceBefore: updatedUser.credits + CREDIT_COST,
            balanceAfter: updatedUser.credits,
            description: 'URL Accessibility Audit',
            toolUsed: 'url_accessibility_auditor',
          })
        }

        const [savedAudit] = await tx.insert(urlAccessibilityAudits).values({
          userId: dbUser.id,
          url,
          title: run.title,
          status: 'completed',
          creditsUsed,
          ...counts,
          overallScore,
          aiSummary,
          toolsUsed: ['axe-core', 'accessibility.build'],
          axeCoreResults: run.extras,
          processingStartedAt: scanStart,
          processingCompletedAt: scanEnd,
        }).returning({ id: urlAccessibilityAudits.id })

        savedAuditId = savedAudit.id

        if (run.findings.length > 0) {
          await tx.insert(auditViolations).values(run.findings.map((finding) => findingRow(savedAudit.id, finding)))
        }
      })

      result.auditId = savedAuditId
    } else if (!effectiveUnlimitedAccess) {
      // Anonymous free scan. Keep the complete result on the server and hand
      // back only the most severe findings; /api/tools/url-audit-unlock returns
      // the rest once the visitor asks for them.
      const scanId = await recordTrialUsage("url_accessibility_auditor", undefined, {
        inputData: { url, domain: normalizeHostname(parsedUrl.hostname) },
        outputData: {
          version: 2,
          title: run.title,
          overallScore,
          ...counts,
          reviewCount,
          findings: run.findings,
        },
      })

      const lockedCount = Math.max(0, run.findings.length - FREE_SCAN_VISIBLE_FINDINGS)
      if (scanId && lockedCount > 0) {
        result.findings = run.findings.slice(0, FREE_SCAN_VISIBLE_FINDINGS)
        result.preview = { scanId, lockedCount }
      }
    }

    const posthog = getPostHogClient()
    if (posthog) {
      posthog.capture({
        distinctId: currentUserObj?.id ?? 'anonymous_auditor',
        event: 'url_audit_completed',
        properties: {
          overall_score: overallScore,
          total_violations: counts.totalViolations,
          critical_count: counts.criticalCount,
          serious_count: counts.seriousCount,
          review_count: reviewCount,
          keyboard_ran: run.extras.keyboard.ran,
          duration_ms: run.extras.engine.durationMs,
          is_authenticated: Boolean(currentUserObj),
          used_trial: !currentUserObj && !effectiveUnlimitedAccess,
          credits_used: currentUserObj && !effectiveUnlimitedAccess ? CREDIT_COST : 0,
        },
      })
      await posthog.flush()
    }

    return result
  } catch (error) {
    console.error("Audit Failed:", error)
    return refuse(friendlyScanError(error))
  }
}

/** The current user's 20 most recent audits. */
export async function getAuditHistory(): Promise<AuditHistory> {
  const user = await currentUser()
  if (!user) return { audits: [] }

  const records = await db.select({
    id: urlAccessibilityAudits.id,
    url: urlAccessibilityAudits.url,
    status: urlAccessibilityAudits.status,
    title: urlAccessibilityAudits.title,
    createdAt: urlAccessibilityAudits.createdAt,
    processingCompletedAt: urlAccessibilityAudits.processingCompletedAt,
    overallScore: urlAccessibilityAudits.overallScore,
    totalViolations: urlAccessibilityAudits.totalViolations,
    criticalCount: urlAccessibilityAudits.criticalCount,
    seriousCount: urlAccessibilityAudits.seriousCount,
    moderateCount: urlAccessibilityAudits.moderateCount,
    minorCount: urlAccessibilityAudits.minorCount,
  }).from(urlAccessibilityAudits)
    .where(eq(urlAccessibilityAudits.userId, user.id))
    .orderBy(desc(urlAccessibilityAudits.createdAt))
    .limit(20)

  return {
    audits: records.map(r => ({
      id: r.id,
      url: r.url,
      status: r.status,
      title: r.title || r.url,
      createdAt: r.createdAt.toISOString(),
      processingCompletedAt: r.processingCompletedAt ? r.processingCompletedAt.toISOString() : undefined,
      overallScore: r.overallScore ?? undefined,
      totalViolations: r.totalViolations ?? 0,
      criticalCount: r.criticalCount ?? 0,
      seriousCount: r.seriousCount ?? 0,
      moderateCount: r.moderateCount ?? 0,
      minorCount: r.minorCount ?? 0,
    }))
  }
}

/** Deletes one of the current user's saved audits. */
export async function deleteAudit(auditId: string) {
  const user = await currentUser()
  if (!user) throw new Error("Please log in to delete audits.")

  await db.delete(urlAccessibilityAudits).where(
    and(
      eq(urlAccessibilityAudits.id, auditId),
      eq(urlAccessibilityAudits.userId, user.id)
    )
  )
  return { success: true }
}

type StoredRow = typeof auditViolations.$inferSelect

interface StoredFindingData {
  version?: number
  title?: string
  outcome?: AuditFinding["outcome"]
  category?: FindingCategory
  nodes?: AuditFinding["nodes"]
  nodeCount?: number
}

/** Rebuilds a finding from its row. Rows saved before November 2026 hold one axe violation and one element. */
function findingFromRow(row: StoredRow): AuditFinding {
  const data = (row.toolSpecificData ?? {}) as StoredFindingData
  const rawCriteria = Array.isArray(row.wcagCriteria) ? (row.wcagCriteria as unknown[]) : []
  const wcag = Array.from(
    new Set(
      rawCriteria
        .map((entry) => (typeof entry === "string" ? entry : (entry as { criterion?: string })?.criterion ?? ""))
        .map((entry) => (/^\d\.\d\.\d{1,2}$/.test(entry) ? entry : scFromTag(entry)))
        .filter((entry): entry is string => !!entry),
    ),
  )
  const sources = Array.isArray(row.detectedBy) ? (row.detectedBy as string[]) : []
  const level = row.wcagLevel === "A" || row.wcagLevel === "AA" || row.wcagLevel === "AAA" || row.wcagLevel === "Best practice" ? row.wcagLevel : wcag.length ? "A" : "Best practice"
  return {
    id: row.id,
    ruleId: row.violationId,
    source: sources.includes("accessibility.build") ? "accessibility.build" : "axe-core",
    outcome: data.outcome ?? "violation",
    title: data.title || row.fixSuggestion || row.description,
    description: row.description,
    impact: row.impact as Impact,
    category: data.category ?? "structure",
    wcag,
    wcagLevel: level,
    helpUrl: row.helpUrl || "",
    fix: row.fixSuggestion || "",
    nodes: data.nodes ?? (row.selector || row.html ? [{ selector: row.selector || "", html: row.html || "" }] : []),
    nodeCount: data.nodeCount ?? 1,
  }
}

/** One of the current user's saved audits with its findings, or null. */
export async function getAudit(auditId: string): Promise<UrlAuditResult | null> {
  const user = await currentUser()
  if (!user) return null

  const [audit] = await db.select().from(urlAccessibilityAudits).where(
    and(
      eq(urlAccessibilityAudits.id, auditId),
      eq(urlAccessibilityAudits.userId, user.id)
    )
  ).limit(1)
  if (!audit) return null

  const rows = await db.select().from(auditViolations).where(eq(auditViolations.auditId, auditId))
  const findings = rows.map(findingFromRow)
  const order: Record<Impact, number> = { critical: 0, serious: 1, moderate: 2, minor: 3 }
  findings.sort((a, b) => (a.outcome === b.outcome ? 0 : a.outcome === "violation" ? -1 : 1) || order[a.impact] - order[b.impact] || b.nodeCount - a.nodeCount)
  const extras = (audit.axeCoreResults as AuditExtras | null)?.version === 2 ? (audit.axeCoreResults as AuditExtras) : undefined

  return {
    auditId: audit.id,
    status: audit.status as UrlAuditResult["status"],
    url: audit.url,
    title: audit.title || undefined,
    createdAt: audit.createdAt.toISOString(),
    processingStartedAt: audit.processingStartedAt?.toISOString(),
    processingCompletedAt: audit.processingCompletedAt?.toISOString(),
    aiSummary: audit.aiSummary || undefined,
    overallScore: audit.overallScore ?? 0,
    totalViolations: audit.totalViolations ?? 0,
    criticalCount: audit.criticalCount ?? 0,
    seriousCount: audit.seriousCount ?? 0,
    moderateCount: audit.moderateCount ?? 0,
    minorCount: audit.minorCount ?? 0,
    reviewCount: findings.filter((finding) => finding.outcome === "review").length,
    violationElements: findings.filter((finding) => finding.outcome === "violation").reduce((sum, finding) => sum + finding.nodeCount, 0),
    findings,
    extras,
  }
}
