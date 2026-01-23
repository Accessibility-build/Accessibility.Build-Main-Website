"use server"

import { AxePuppeteer } from '@axe-core/puppeteer'
import chromium from '@sparticuz/chromium'
import puppeteerCore, { Page, Browser } from 'puppeteer-core'
import { currentUser } from "@clerk/nextjs/server"
import { 
  creditTransactions, 
  db, 
  toolUsage, 
  users, 
  urlAccessibilityAudits, 
  auditViolations 
} from "@/lib/db"
import { eq, desc } from "drizzle-orm"
import { checkTrialLimit, recordTrialUsage } from "@/lib/trial-usage"
import { UrlAuditResult, AuditHistory } from '@/lib/url-accessibility-auditor-types'
import { v4 as uuidv4 } from 'uuid'
import OpenAI from "openai"
import {
  isOpenRouterConfigured,
  isOpenRouterModel,
  openrouter,
} from "@/lib/openrouter"

const CREDIT_COST = 5
const DEFAULT_MODEL = "gpt-4o"
const MAX_AI_TOKENS = 1000
const MAX_AI_TEMP = 0.3

/**
 * Create and return a Puppeteer Browser instance appropriate for the runtime environment.
 *
 * In production this will launch a serverless-optimized Chromium; in development it attempts to
 * import and launch the locally installed Puppeteer binary.
 *
 * @returns A configured Puppeteer `Browser` instance for the current environment.
 * @throws Error if launching the local Puppeteer fails (for example, when Puppeteer is not installed).
 */
async function getBrowserInstance(): Promise<Browser> {
  const isProduction = process.env.NODE_ENV === 'production'

  if (isProduction) {
    // In production, we use a lightweight version of Chromium optimized for serverless functions
    return puppeteerCore.launch({
      args: chromium.args,
      defaultViewport: { width: 1920, height: 1080 },
      executablePath: await chromium.executablePath(),
      headless: true,
      ignoreHTTPSErrors: true,
    } as any)
  } else {
    // In development (local machine), we use the full installed Puppeteer
    try {
      const puppeteer = (await import('puppeteer')).default
      return puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
        ignoreHTTPSErrors: true,
      } as any)
    } catch (error) {
      console.error("Local puppeteer error:", error)
      throw new Error("Could not launch browser. Is puppeteer installed?")
    }
  }
}

/**
 * Runs an Axe accessibility scan against the provided Puppeteer page.
 *
 * Executes Axe with a tag set covering WCAG 2.x/2.1/2.2 and best-practice checks and returns the raw scan output.
 *
 * @param page - The Puppeteer `Page` to analyze
 * @returns The AxePuppeteer `analyze()` result containing `violations`, `passes`, `incomplete`, and `inapplicable` sections
 */
async function performAxeScan(page: Page) {
  // @ts-ignore
  const results = await new AxePuppeteer(page)
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
    .analyze()

  return results
}

/**
 * Produce a business-oriented JSON summary derived from an accessibility audit.
 *
 * Sends audit metadata to an AI service and returns a JSON-formatted summary describing
 * website classification, business impact, industry context, quick wins, and recommendations.
 *
 * @param auditData - Audit context object. Expected properties: `url`, `overallScore`, `totalViolations`, `criticalCount`, and `topViolations`.
 * @returns A JSON string conforming to the schema:
 * {
 *   "websiteClassification": { "type": string, "industry": string, "targetAudience": string, "complianceRequirements": string },
 *   "businessImpact": { "userExperience": string, "reach": string },
 *   "industryContext": { "industryAverage": string, "yourPerformance": string, "complianceRisk": string },
 *   "quickWins": string[],
 *   "businessRecommendations": { "prioritize": string, "improvementPotential": string, "expectedROI": string }
 * }
 * or a JSON error object (e.g., `{"error":"AI Key missing"}` or `{"error":"AI Service Unavailable"}`) when the AI key/service is unavailable.
 */
async function generateBusinessSummary(auditData: any): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    return JSON.stringify({ error: "AI Key missing" })
  }

  const systemPrompt = `
    You are an expert accessibility auditor. Analyze this audit data.
    Return ONLY a JSON object with this exact schema:
    {
      "websiteClassification": {
        "type": "E-commerce/Blog/Corporate/etc",
        "industry": "Industry Name",
        "targetAudience": "General/Specific",
        "complianceRequirements": "WCAG 2.1 AA/ADA"
      },
      "businessImpact": {
        "userExperience": "Impact description",
        "reach": "Impact on market reach"
      },
      "industryContext": {
        "industryAverage": "e.g. 'Below Average (75)'",
        "yourPerformance": "Above Average/Average/Below Average",
        "complianceRisk": "LOW/MEDIUM/HIGH"
      },
      "quickWins": ["Quick fix 1", "Quick fix 2"],
      "businessRecommendations": {
        "prioritize": "Top priority",
        "improvementPotential": "+10% Score",
        "expectedROI": "High/Med/Low"
      }
    }
  `

  const userPrompt = JSON.stringify({
    url: auditData.url,
    score: auditData.overallScore,
    issues: auditData.totalViolations,
    critical: auditData.criticalCount,
    top_issues: auditData.topViolations
  })

  try {
    const client = (isOpenRouterModel(DEFAULT_MODEL) && isOpenRouterConfigured()) 
      ? openrouter 
      : new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    
    const response = await client.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: MAX_AI_TEMP,
      max_tokens: MAX_AI_TOKENS,
      response_format: { type: "json_object" }
    })

    return response.choices[0]?.message?.content || "{}"
  } catch (error) {
    console.error("AI Error:", error)
    return JSON.stringify({ error: "AI Service Unavailable" })
  }
}


/**
 * Performs a full accessibility audit of the given URL, runs axe-core in a headless browser, computes a weighted accessibility score, obtains an AI-generated business summary, and persists results when a user is signed in.
 *
 * @param url - The full URL to scan (must include scheme, e.g. `https://example.com`).
 * @param unlimitedAccess - If `true`, skip credit deduction checks for authenticated users; does not grant extra behavior for unauthenticated users.
 * @returns The completed or failed UrlAuditResult containing audit metadata, violation list, computed scores, AI summary, timestamps, and error information when applicable.
 * @throws Error - If `url` is not a valid absolute URL (message: "Invalid URL. Please enter a full URL (e.g. https://google.com)").
 * @throws Error - If an authenticated user is found but the account is missing (message: "User account not found.") or the user lacks sufficient credits (message: "You need 5 credits to run an audit.").
 */
export async function runUrlAccessibilityAudit(
  url: string,
  unlimitedAccess: boolean = false
): Promise<UrlAuditResult> {
  const auditId = uuidv4()
  const startTime = new Date()

  // Step 1: Check if the URL is valid
  try {
    new URL(url)
  } catch {
    throw new Error("Invalid URL. Please enter a full URL (e.g. https://google.com)")
  }

  // Step 2: User Authentication & Credit Check
  const currentUserObj = await currentUser()
  let dbUser = null
  let currentCredits = 0

  if (!unlimitedAccess) {
    if (currentUserObj) {
      const usersList = await db.select().from(users).where(eq(users.id, currentUserObj.id)).limit(1)
      dbUser = usersList[0]

      if (!dbUser) throw new Error("User account not found.")

      currentCredits = dbUser.credits
      if (currentCredits < CREDIT_COST) {
        throw new Error(`You need ${CREDIT_COST} credits to run an audit.`)
      }
    } else {
      const trial = await checkTrialLimit("url_accessibility_auditor")
      if (!trial.allowed) throw new Error(trial.message)
    }
  } else {
    if (currentUserObj) {
      const usersList = await db.select().from(users).where(eq(users.id, currentUserObj.id)).limit(1)
      dbUser = usersList[0]
    }
  }

  // Step 3: Run the Browser Scan
  let browser: Browser | null = null
  try {
    browser = await getBrowserInstance()
    const page = await browser.newPage()
    
    // Set a timeout of 60 seconds (1 minute) for loading pages
    page.setDefaultNavigationTimeout(60000)
    await page.setViewport({ width: 1920, height: 1080 })

    // Navigate to the URL
    await page.goto(url, { waitUntil: 'load', timeout: 30000 })
    const pageTitle = await page.title() || url
    const scanStart = new Date()

    // Execute axe-core
    const axeResults = await performAxeScan(page)

    // Step 4: Process the Results
    // Transform the raw axe-core data into our clean "Violation" structure
    const processedViolations = axeResults.violations.map(v => ({
      id: uuidv4(),
      violationId: v.id,
      description: v.description,
      impact: (v.impact || 'minor') as 'critical' | 'serious' | 'moderate' | 'minor',
      helpUrl: v.helpUrl,
      wcagCriteria: v.tags.filter(t => t.includes('wcag')),
      wcagLevel: v.tags.some(t => t.includes('wcag2aa') || t.includes('wcag21aa')) ? 'AA' : 'A',
      selector: v.nodes[0]?.target.join(', ') || '',
      html: v.nodes[0]?.html || '',
      target: v.nodes[0]?.target || [],
      aiExplanation: "",
      fixSuggestion: v.help,
    }))

    // Calculate Scores & Counts
    const totalViolations = processedViolations.length
    const criticalCount = processedViolations.filter(v => v.impact === 'critical').length
    const seriousCount = processedViolations.filter(v => v.impact === 'serious').length
    const moderateCount = processedViolations.filter(v => v.impact === 'moderate').length
    const minorCount = processedViolations.filter(v => v.impact === 'minor').length

    // Weighted Scoring System:
    // Instead of a simple percentage (which can vary wildly based on how many 'passes' a page has),
    // we use a penalty system starting from 100. This ensures high-impact violations always hurt the score.
    
    let penaltyScore = 0
    penaltyScore += criticalCount * 10
    penaltyScore += seriousCount * 5
    penaltyScore += moderateCount * 2
    penaltyScore += minorCount * 1

    const overallScore = Math.max(0, 100 - penaltyScore)

    // Step 5: Get AI Analysis
    const aiSummary = await generateBusinessSummary({
      url,
      title: pageTitle,
      overallScore,
      totalViolations,
      criticalCount,
      topViolations: processedViolations.slice(0, 3) // Send only top 3 to save tokens
    })

    const scanEnd = new Date()

    // Step 6: Create the Result Object
    const result: UrlAuditResult = {
      auditId,
      status: 'completed',
      url,
      title: pageTitle,
      createdAt: startTime.toISOString(),
      processingStartedAt: scanStart.toISOString(),
      processingCompletedAt: scanEnd.toISOString(),
      totalViolations,
      criticalCount,
      seriousCount,
      moderateCount,
      minorCount,
      overallScore,
      aiSummary,
      violations: processedViolations as any 
    }

    // Step 7: Save to Database (if User is logged in)
    if (currentUserObj && dbUser) {
      
      // 7a. Deduct Credits (if not unlimited)
      let creditsUsed = 0
      if (!unlimitedAccess) {
        creditsUsed = CREDIT_COST
        const newBalance = currentCredits - CREDIT_COST
        
        await db.update(users)
          .set({ credits: newBalance, totalCreditsUsed: dbUser.totalCreditsUsed + CREDIT_COST })
          .where(eq(users.id, currentUserObj.id))

        await db.insert(creditTransactions).values({
          userId: dbUser.id,
          type: 'usage',
          amount: -CREDIT_COST,
          balanceBefore: currentCredits,
          balanceAfter: newBalance,
          description: 'URL Accessibility Audit',
          toolUsed: 'url_accessibility_auditor',
        })
      }

      // 7b. Save the Audit Record
      const [savedAudit] = await db.insert(urlAccessibilityAudits).values({
        userId: dbUser.id,
        url,
        title: pageTitle,
        status: 'completed',
        creditsUsed,
        totalViolations,
        criticalCount,
        seriousCount,
        moderateCount,
        minorCount,
        overallScore,
        aiSummary,
        processingStartedAt: scanStart,
        processingCompletedAt: scanEnd,
      }).returning()

      // Update the result ID to match the real DB ID
      result.auditId = savedAudit.id

      // 7c. Save Violations (Batch Insert)
      if (processedViolations.length > 0) {
        await db.insert(auditViolations).values(processedViolations.map(v => ({
           auditId: savedAudit.id,
           violationId: v.violationId,
           description: v.description,
           impact: v.impact,
           helpUrl: v.helpUrl,
           wcagCriteria: v.wcagCriteria,
           wcagLevel: v.wcagLevel,
           selector: v.selector,
           html: v.html,
           target: v.target || [], 
           detectedBy: ['axe-core'],
           fixSuggestion: v.fixSuggestion,
           aiExplanation: v.aiExplanation
        })))
      }

    } else {
      await recordTrialUsage("url_accessibility_auditor")
    }

    return result

  } catch (error) {
    console.error("Audit Failed:", error)
    return {
      auditId,
      status: 'failed',
      url,
      createdAt: startTime.toISOString(),
      errorMessage: error instanceof Error ? error.message : "Unknown system error"
    }
  } finally {
    if (browser) await browser.close()
  }
}


/**
 * Fetches the current user's most recent URL accessibility audits (up to 20).
 *
 * @returns An object with an `audits` array where each entry includes stored audit fields; `title` defaults to the URL when missing, `createdAt` is an ISO string, `overallScore` is included when defined, and `totalViolations` defaults to 0.
 */
export async function getAuditHistory(): Promise<AuditHistory> {
  const user = await currentUser()
  if (!user) return { audits: [] }

  const records = await db.select().from(urlAccessibilityAudits)
    .where(eq(urlAccessibilityAudits.userId, user.id))
    .orderBy(desc(urlAccessibilityAudits.createdAt))
    .limit(20)

  return { 
    audits: records.map(r => ({
      ...r,
      title: r.title || r.url,
      createdAt: r.createdAt.toISOString(),
      overallScore: r.overallScore ?? undefined,
      totalViolations: r.totalViolations ?? 0
    }))
  }
}

/**
 * Deletes a saved URL accessibility audit belonging to the current user.
 *
 * @param auditId - The ID of the audit to delete.
 * @returns An object with `success: true` when the audit was deleted.
 * @throws Error if there is no authenticated user.
 */
export async function deleteAudit(auditId: string) {
  const user = await currentUser()
  if (!user) throw new Error("Please log in to delete audits.")

  await db.delete(urlAccessibilityAudits).where(eq(urlAccessibilityAudits.id, auditId))
  return { success: true }
}

/**
 * Retrieves a previously saved URL accessibility audit and its associated violations for the current authenticated user.
 *
 * Fetches the audit by `auditId` and returns a combined result containing audit metadata, counts, overall score, and a list of violations. Returns `null` if no user is signed in or if the requested audit does not exist.
 *
 * @param auditId - The identifier of the audit to retrieve
 * @returns The audit and its violations as a `UrlAuditResult`, or `null` when not found or the user is not authenticated
 */
export async function getAudit(auditId: string): Promise<UrlAuditResult | null> {
  const user = await currentUser()
  if (!user) return null

  // 1. Get the Audit
  const [audit] = await db.select().from(urlAccessibilityAudits).where(eq(urlAccessibilityAudits.id, auditId)).limit(1)
  if (!audit) return null

  // 2. Get the Violations
  const violations = await db.select().from(auditViolations).where(eq(auditViolations.auditId, auditId))

  // 3. Combine them
  return {
    auditId: audit.id,
    status: audit.status as any,
    url: audit.url,
    title: audit.title || undefined,
    createdAt: audit.createdAt.toISOString(),
    aiSummary: audit.aiSummary || undefined,
    overallScore: audit.overallScore || 0,
    totalViolations: audit.totalViolations || 0,
    criticalCount: audit.criticalCount || 0,
    seriousCount: audit.seriousCount || 0,
    moderateCount: audit.moderateCount || 0,
    minorCount: audit.minorCount || 0,
    violations: violations.map(v => ({
      id: v.id,
      violationId: v.violationId,
      description: v.description,
      impact: v.impact as any,
      helpUrl: v.helpUrl || '',
      wcagCriteria: v.wcagCriteria as any[],
      wcagLevel: v.wcagLevel || 'A',
      selector: v.selector || '',
      html: v.html || '',
      target: (v.target as string[]) || [],
      aiExplanation: v.aiExplanation || '',
      fixSuggestion: v.fixSuggestion || ''
    }))
  }
}