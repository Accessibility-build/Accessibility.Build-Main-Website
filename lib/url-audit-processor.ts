import puppeteer, { Browser, Page } from 'puppeteer'
import { AxePuppeteer } from '@axe-core/puppeteer'
import { Result as AxeResult, AxeResults } from 'axe-core'
import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'
import { db } from '@/lib/db'
import { urlAccessibilityAudits, auditViolations } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { getAIModel } from './openrouter'

// Dynamically import chromium for serverless environments
let chromium: any = null

// Function to dynamically load chromium
async function loadChromium() {
  if (chromium) return chromium
  
  try {
    chromium = await import('@sparticuz/chromium')
    return chromium.default || chromium
  } catch (error) {
    // Chromium not available in development
    return null
  }
}

// Define proper types to match axe-core and database schema
interface AxeViolation {
  id: string
  description: string
  help: string
  helpUrl: string
  impact: 'minor' | 'moderate' | 'serious' | 'critical'
  tags: string[]
  nodes: Array<{
    target: string[]
    html: string
    failureSummary?: string
    any?: Array<any>
    all?: Array<any>
    none?: Array<any>
  }>
}

interface ProcessedViolation {
  violationId: string
  description: string
  impact: 'minor' | 'moderate' | 'serious' | 'critical'
  helpUrl: string
  wcagCriteria: Array<{
    criterion: string
    level: string
    guideline: string
  }>
  wcagLevel: string
  selector: string
  html: string
  target: string[]
  aiExplanation: string
  fixSuggestion: string
  codeExample: string | null
}

interface ViolationCounts {
  critical: number
  serious: number
  moderate: number
  minor: number
}

interface AIAnalysisResult {
  explanation: string
  fixSuggestion: string
  codeExample: string | null
}

interface AISummaryResult {
  summary: string
  priorityRecommendations: Array<{
    title: string
    description: string
    impact: 'critical' | 'serious' | 'moderate' | 'minor'
    effort: 'low' | 'medium' | 'high'
  }>
}

interface AccessibilityAnalysisResult {
  violations: AxeViolation[]
  passes: any[]
  incomplete: any[]
  inapplicable: any[]
  url: string
  timestamp: string
  testEngine: any
  testEnvironment: any
}

// Resource limits for production
const PUPPETEER_TIMEOUT = 30000
const MAX_VIOLATIONS_TO_ANALYZE = 25
const AI_ANALYSIS_TIMEOUT = 20000
const PAGE_LOAD_TIMEOUT = 30000

// axe-core configuration for comprehensive testing (used with axe.configure())
const AXE_CORE_CONFIG = {
  // Configure comprehensive rule coverage
  rules: [
    // Color and contrast rules
    { id: 'color-contrast', enabled: true },
    { id: 'color-contrast-enhanced', enabled: true },
    
    // Form rules
    { id: 'label', enabled: true },
    { id: 'label-title-only', enabled: true },
    { id: 'form-field-multiple-labels', enabled: true },
    
    // Image rules
    { id: 'image-alt', enabled: true },
    { id: 'image-redundant-alt', enabled: true },
    { id: 'object-alt', enabled: true },
    { id: 'input-image-alt', enabled: true },
    
    // Heading and structure rules
    { id: 'heading-order', enabled: true },
    { id: 'empty-heading', enabled: true },
    { id: 'p-as-heading', enabled: true },
    
    // Link rules
    { id: 'link-name', enabled: true },
    { id: 'link-in-text-block', enabled: true },
    
    // Table rules
    { id: 'table-fake-caption', enabled: true },
    { id: 'td-headers-attr', enabled: true },
    { id: 'th-has-data-cells', enabled: true },
    
    // ARIA rules
    { id: 'aria-allowed-attr', enabled: true },
    { id: 'aria-command-name', enabled: true },
    { id: 'aria-hidden-body', enabled: true },
    { id: 'aria-hidden-focus', enabled: true },
    { id: 'aria-input-field-name', enabled: true },
    { id: 'aria-meter-name', enabled: true },
    { id: 'aria-progressbar-name', enabled: true },
    { id: 'aria-required-attr', enabled: true },
    { id: 'aria-required-children', enabled: true },
    { id: 'aria-required-parent', enabled: true },
    { id: 'aria-roledescription', enabled: true },
    { id: 'aria-roles', enabled: true },
    { id: 'aria-toggle-field-name', enabled: true },
    { id: 'aria-tooltip-name', enabled: true },
    { id: 'aria-valid-attr', enabled: true },
    { id: 'aria-valid-attr-value', enabled: true },
    
    // Keyboard navigation rules
    { id: 'accesskeys', enabled: true },
    { id: 'focus-order-semantics', enabled: true },
    { id: 'tabindex', enabled: true },
    
    // Language rules
    { id: 'html-has-lang', enabled: true },
    { id: 'html-lang-valid', enabled: true },
    { id: 'valid-lang', enabled: true },
    
    // Parsing and validation rules
    { id: 'duplicate-id', enabled: true },
    { id: 'duplicate-id-active', enabled: true },
    { id: 'duplicate-id-aria', enabled: true },
    
    // Bypass block rules
    { id: 'bypass', enabled: true },
    { id: 'skip-link', enabled: true },
    
    // Media and timing rules
    { id: 'audio-caption', enabled: true },
    { id: 'video-caption', enabled: true },
    { id: 'no-autoplay-audio', enabled: true },
    
    // Additional valuable rules
    { id: 'identical-links-same-purpose', enabled: true },
    { id: 'meta-refresh', enabled: true },
    { id: 'meta-viewport', enabled: true }
  ]
}

// Function to get browser configuration based on environment
async function getBrowserConfig() {
  const isProduction = process.env.NODE_ENV === 'production'
  const isVercel = process.env.VERCEL === '1'
  
  if (isProduction && isVercel) {
    // Try to load chromium for serverless
    const chromium = await loadChromium()
    
    if (chromium) {
      // Vercel serverless configuration
      return {
        args: [
          ...chromium.args,
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--disable-web-security',
          '--disable-features=VizDisplayCompositor',
          '--memory-pressure-off',
          '--max_old_space_size=512',
          '--disable-background-timer-throttling',
          '--disable-backgrounding-occluded-windows',
          '--disable-renderer-backgrounding',
          '--force-color-profile=srgb',
        ],
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
        timeout: PUPPETEER_TIMEOUT,
      }
    }
  }
  
  // Local development configuration
  return {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-web-security',
      '--disable-features=VizDisplayCompositor',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--memory-pressure-off',
      '--max_old_space_size=1024',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-renderer-backgrounding',
      '--force-color-profile=srgb',
    ],
    timeout: PUPPETEER_TIMEOUT,
  }
}

export async function processUrlAccessibilityAudit(auditId: string): Promise<void> {
  let browser: Browser | null = null
  
  try {
    console.log(`Starting comprehensive audit processing for ${auditId}`)
    
    // Update status to processing
    await db
      .update(urlAccessibilityAudits)
      .set({
        status: 'processing',
        processingStartedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(urlAccessibilityAudits.id, auditId))

    // Get audit record
    const [auditRecord] = await db
      .select()
      .from(urlAccessibilityAudits)
      .where(eq(urlAccessibilityAudits.id, auditId))
      .limit(1)

    if (!auditRecord) {
      throw new Error('Audit record not found')
    }

    // Validate URL to prevent SSRF attacks
    await validateUrl(auditRecord.url)

    console.log(`Processing URL with comprehensive accessibility checks: ${auditRecord.url}`)

    // Launch Puppeteer with enhanced configuration for accessibility testing
    browser = await puppeteer.launch(await getBrowserConfig())

    const page = await browser.newPage()
    
    // Enhanced page configuration for accessibility testing
    await page.setViewport({ width: 1200, height: 800 })
    await page.setDefaultNavigationTimeout(PAGE_LOAD_TIMEOUT)
    await page.setDefaultTimeout(PAGE_LOAD_TIMEOUT)
    
    // Set up enhanced request interception for better compatibility
    await page.setRequestInterception(true)
    page.on('request', (req) => {
      const resourceType = req.resourceType()
      const url = req.url()
      
      // Allow critical resources for accessibility testing
      if (['document', 'script', 'xhr', 'fetch'].includes(resourceType)) {
        req.continue()
      } 
      // Allow CSS for color contrast and layout checks
      else if (resourceType === 'stylesheet') {
        req.continue()
      }
      // Allow fonts for text rendering
      else if (resourceType === 'font') {
        req.continue()
      }
      // Block heavy resources but keep essentials
      else if (['image', 'media'].includes(resourceType)) {
        // Allow small images for alt text checks but block large media
        if (resourceType === 'image' && req.url().includes('data:')) {
          req.continue()
        } else {
          req.abort()
        }
      } else {
        req.abort()
      }
    })
    
    // Navigate to the URL with enhanced error handling
    console.log(`Navigating to ${auditRecord.url}`)
    const response = await page.goto(auditRecord.url, { 
      waitUntil: 'networkidle2',
      timeout: PAGE_LOAD_TIMEOUT 
    })

    if (!response || !response.ok()) {
      throw new Error(`Failed to load page: ${response?.status()} ${response?.statusText()}`)
    }

    // Get page title and additional metadata
    const pageTitle = await page.title()
    const pageUrl = page.url()
    
    // Wait for page to be fully loaded and interactive
    await new Promise(resolve => setTimeout(resolve, 3000))

    // Run comprehensive axe-core accessibility analysis
    console.log('Running comprehensive accessibility analysis with axe-core...')
    
    const axe = new AxePuppeteer(page)
    
    // Configure axe with our comprehensive settings and run analysis
    const results: AxeResults = await axe
      .configure(AXE_CORE_CONFIG)
      .withTags([
        // WCAG 2.0 levels
        'wcag2a', 'wcag2aa',
        // WCAG 2.1 levels  
        'wcag21a', 'wcag21aa',
        // WCAG 2.2 level AA
        'wcag22aa',
        // Section 508 compliance
        'section508',
        // Best practices
        'best-practice',
        // Category-specific tags for comprehensive coverage
        'cat.aria', 'cat.color', 'cat.forms', 'cat.keyboard', 'cat.language',
        'cat.name-role-value', 'cat.parsing', 'cat.semantics', 'cat.sensory-and-visual-cues',
        'cat.structure', 'cat.tables', 'cat.text-alternatives', 'cat.time-and-media'
      ])
      .analyze()

    console.log(`Comprehensive accessibility analysis completed:`)
    console.log(`- Violations: ${results.violations.length}`)
    console.log(`- Passes: ${results.passes.length}`)
    console.log(`- Incomplete: ${results.incomplete.length}`)
    console.log(`- Inapplicable: ${results.inapplicable.length}`)

    // Close browser early to free resources
    await browser.close()
    browser = null

    // Enhanced violation analysis with comprehensive categorization
    const violationCounts: ViolationCounts = {
      critical: results.violations.filter(v => v.impact === 'critical').length,
      serious: results.violations.filter(v => v.impact === 'serious').length,
      moderate: results.violations.filter(v => v.impact === 'moderate').length,
      minor: results.violations.filter(v => v.impact === 'minor').length,
    }

    const totalViolations = results.violations.length

    // Calculate enhanced accessibility score with more sophisticated algorithm
    const overallScore = calculateComprehensiveAccessibilityScore(results, violationCounts)

    // Process violations with enhanced AI analysis
    console.log('Starting enhanced AI analysis of violations...')
    const violationsToAnalyze = results.violations.slice(0, MAX_VIOLATIONS_TO_ANALYZE)
    const processedViolations: ProcessedViolation[] = await Promise.all(
      violationsToAnalyze.map(async (violation, index) => {
        try {
          console.log(`Analyzing violation ${index + 1}/${violationsToAnalyze.length}: ${violation.id} (${violation.impact})`)
          
          const aiAnalysis = await analyzeViolationWithAI(violation as AxeViolation, auditRecord.url)
          
          return {
            violationId: violation.id,
            description: violation.description,
            impact: violation.impact || 'moderate',
            helpUrl: violation.helpUrl,
            wcagCriteria: extractWcagCriteria(violation.tags),
            wcagLevel: extractWcagLevel(violation.tags),
            selector: violation.nodes[0]?.target.join(', ') || '',
            html: violation.nodes[0]?.html.substring(0, 500) || '',
            target: Array.isArray(violation.nodes[0]?.target) 
              ? violation.nodes[0].target.map(t => typeof t === 'string' ? t : String(t))
              : [],
            aiExplanation: aiAnalysis.explanation,
            fixSuggestion: aiAnalysis.fixSuggestion,
            codeExample: aiAnalysis.codeExample,
          }
        } catch (error) {
          console.error(`Error analyzing violation ${violation.id}:`, error)
          return {
            violationId: violation.id,
            description: violation.description,
            impact: violation.impact || 'moderate',
            helpUrl: violation.helpUrl,
            wcagCriteria: extractWcagCriteria(violation.tags),
            wcagLevel: extractWcagLevel(violation.tags),
            selector: violation.nodes[0]?.target.join(', ') || '',
            html: violation.nodes[0]?.html.substring(0, 500) || '',
            target: Array.isArray(violation.nodes[0]?.target) 
              ? violation.nodes[0].target.map(t => typeof t === 'string' ? t : String(t))
              : [],
            aiExplanation: 'AI analysis temporarily unavailable',
            fixSuggestion: 'Please refer to the help URL for guidance',
            codeExample: null,
          }
        }
      })
    )

    // Generate enhanced AI summary with comprehensive analysis
    console.log('Generating comprehensive AI summary...')
    const aiSummaryData = await generateComprehensiveAISummary(results, auditRecord.url, pageTitle)

    // Save violations to database
    if (processedViolations.length > 0) {
      await db.insert(auditViolations).values(
        processedViolations.map(violation => ({
          auditId: auditId,
          violationId: violation.violationId,
          description: violation.description,
          impact: violation.impact,
          helpUrl: violation.helpUrl,
          wcagCriteria: violation.wcagCriteria,
          wcagLevel: violation.wcagLevel,
          selector: violation.selector,
          html: violation.html,
          target: violation.target,
          aiExplanation: violation.aiExplanation,
          fixSuggestion: violation.fixSuggestion,
          codeExample: violation.codeExample,
          detectedBy: ['axe-core'], // Single-tool audit uses axe-core
        }))
      )
    }

    // Update audit record with comprehensive results
    await db
      .update(urlAccessibilityAudits)
      .set({
        title: pageTitle,
        status: 'completed',
        totalViolations: totalViolations,
        criticalCount: violationCounts.critical,
        seriousCount: violationCounts.serious,
        moderateCount: violationCounts.moderate,
        minorCount: violationCounts.minor,
        overallScore: overallScore,
        aiSummary: aiSummaryData.summary,
        priorityRecommendations: aiSummaryData.priorityRecommendations,
        processingCompletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(urlAccessibilityAudits.id, auditId))

    console.log(`Comprehensive audit ${auditId} completed successfully`)
    console.log(`Final score: ${overallScore}/100`)

  } catch (error) {
    console.error(`Audit ${auditId} failed:`, error)
    
    // Close browser if still open
    if (browser) {
      try {
        await browser.close()
      } catch (closeError) {
        console.error('Error closing browser:', closeError)
      }
    }

    // Update audit status to failed
    await db
      .update(urlAccessibilityAudits)
      .set({
        status: 'failed',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        updatedAt: new Date(),
      })
      .where(eq(urlAccessibilityAudits.id, auditId))

    throw error
  }
}

async function validateUrl(url: string): Promise<void> {
  try {
    const parsedUrl = new URL(url)
    
    // Block private/internal networks (SSRF protection)
    const hostname = parsedUrl.hostname.toLowerCase()
    
    // Block localhost, private IPs, and internal networks
    const blockedPatterns = [
      /^localhost$/,
      /^127\./,
      /^192\.168\./,
      /^10\./,
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
      /^169\.254\./,  // Link-local
      /^0\.0\.0\.0$/,
      /^::1$/,        // IPv6 localhost
      /^fe80:/,       // IPv6 link-local
      /^fc00:/,       // IPv6 unique local
    ]
    
    if (blockedPatterns.some(pattern => pattern.test(hostname))) {
      throw new Error('URL points to private/internal network')
    }
    
    // Only allow HTTP/HTTPS
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      throw new Error('Only HTTP and HTTPS URLs are allowed')
    }
    
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error('Invalid URL format')
    }
    throw error
  }
}

async function analyzeViolationWithAI(violation: AxeViolation, url: string): Promise<AIAnalysisResult> {
  try {
    // Enhanced prompt with more context about the violation
    const wcagLevel = extractWcagLevel(violation.tags)
    const categories = violation.tags.filter(tag => tag.startsWith('cat.')).join(', ')
    
    const prompt = `Analyze this accessibility violation and provide expert guidance:

VIOLATION DETAILS:
- Rule ID: ${violation.id}
- Description: ${violation.description}
- Help: ${violation.help}
- Impact Level: ${violation.impact}
- WCAG Level: ${wcagLevel}
- Categories: ${categories}
- URL: ${url}

HTML ELEMENT: ${violation.nodes[0]?.html || 'Not available'}
CSS SELECTOR: ${violation.nodes[0]?.target.join(', ') || 'Not available'}

CONTEXT:
This violation was found during a comprehensive accessibility audit using axe-core with WCAG 2.0, 2.1, 2.2, and Section 508 rules.

Please provide:
1. A clear explanation of why this is an accessibility issue and which users it affects
2. Specific, actionable steps to fix this violation
3. If possible, provide a code example showing the corrected version
4. Any additional considerations for this type of issue

Respond in JSON format:
{
  "explanation": "Detailed explanation of the accessibility issue and user impact",
  "fixSuggestion": "Specific, actionable steps to fix this issue",
  "codeExample": "Code example showing the fix (or null if not applicable)"
}`

    const { text } = await generateText({
      model: getAIModel(),
      messages: [
        {
          role: 'system',
          content: `You're a seasoned accessibility consultant who's passionate about creating inclusive digital experiences. You've worked with countless teams to solve real accessibility challenges, and you understand both the technical and human sides of this work.

Your approach:
- Start by acknowledging what the violation means for actual users - paint a picture of the experience
- Explain the accessibility barrier in plain language, then dive into the technical details
- Provide step-by-step guidance that developers can follow immediately
- Include practical code examples that show the before and after
- Mention testing strategies so they can verify their fixes work
- Be encouraging - accessibility can feel overwhelming, but every fix makes a difference

Your tone should be:
- Knowledgeable but approachable - you're the expert they can trust
- Empathetic to both developers and users with disabilities
- Practical and solution-focused
- Detailed enough to be genuinely helpful

Remember: You're not just identifying problems, you're empowering developers to create better, more inclusive experiences. Make your guidance comprehensive and actionable.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      maxTokens: 1200,  // Increased for more detailed explanations
      temperature: 0.3,
      abortSignal: AbortSignal.timeout(AI_ANALYSIS_TIMEOUT),
    })

    // Parse JSON response with better error handling
    const cleanedResponse = text.replace(/```(?:json)?\s*/, '').replace(/```\s*$/, '')
    try {
      const analysis = JSON.parse(cleanedResponse)
      return {
        explanation: analysis.explanation || 'Analysis not available',
        fixSuggestion: analysis.fixSuggestion || 'Please refer to the help URL',
        codeExample: analysis.codeExample || null,
      }
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError)
      return {
        explanation: text.substring(0, 300) + '...',
        fixSuggestion: 'Please refer to the help URL for guidance',
        codeExample: null,
      }
    }

  } catch (error) {
    console.error('AI analysis failed for violation:', error)
    return {
      explanation: 'AI analysis temporarily unavailable',
      fixSuggestion: 'Please refer to the help URL for guidance',
      codeExample: null,
    }
  }
}

async function generateComprehensiveAISummary(results: AxeResults, url: string, title: string): Promise<AISummaryResult> {
  try {
    // Enhanced analysis with more comprehensive data
    const topViolations = results.violations
      .sort((a, b) => {
        const impactOrder = { critical: 4, serious: 3, moderate: 2, minor: 1 }
        return (impactOrder[b.impact as keyof typeof impactOrder] || 0) - (impactOrder[a.impact as keyof typeof impactOrder] || 0)
      })
      .slice(0, 10)
      .map(v => `- ${v.id} (${v.impact}): ${v.description}`)
      .join('\n')

    const wcagComplianceData = analyzeWcagCompliance(results)
    const categoryBreakdown = analyzeCategoryBreakdown(results)

    const prompt = `Analyze this comprehensive accessibility audit and provide an executive summary:

WEBSITE INFORMATION:
- Title: ${title}
- URL: ${url}
- Analysis Coverage: WCAG 2.0/2.1/2.2 (A, AA), Section 508, Best Practices

AUDIT RESULTS:
- Total Violations: ${results.violations.length}
- Total Passes: ${results.passes.length}
- Incomplete/Review Items: ${results.incomplete.length}
- Inapplicable Rules: ${results.inapplicable.length}

TOP VIOLATIONS BY IMPACT:
${topViolations}

WCAG COMPLIANCE ANALYSIS:
${wcagComplianceData}

CATEGORY BREAKDOWN:
${categoryBreakdown}

Please provide:
1. An executive summary of the website's accessibility status
2. Assessment of WCAG compliance levels
3. Priority recommendations (top 5-8) focusing on the most critical issues
4. Overall accessibility maturity assessment

Respond in JSON format:
{
  "summary": "Executive summary including WCAG compliance assessment and overall accessibility status",
  "priorityRecommendations": [
    {
      "title": "Clear, actionable recommendation title",
      "description": "Detailed recommendation with implementation guidance",
      "impact": "critical|serious|moderate|minor",
      "effort": "low|medium|high"
    }
  ]
}`

    const { text } = await generateText({
      model: getAIModel(),
      messages: [
        {
          role: 'system',
          content: `You're a senior accessibility consultant who excels at translating technical findings into strategic insights that resonate with both technical teams and business stakeholders.

Your expertise includes:
- Understanding the real-world impact of accessibility issues on users
- Connecting accessibility improvements to business outcomes
- Prioritizing fixes based on user impact and implementation effort
- Communicating compliance risks in business terms
- Providing roadmaps that teams can actually follow

Your summary style:
- Start with the big picture - what does this audit reveal about the overall accessibility maturity?
- Highlight the most critical issues that need immediate attention
- Explain the user impact in human terms, not just technical jargon
- Connect findings to business benefits (broader audience, legal compliance, brand reputation)
- Provide a clear action plan with priorities and timelines
- Be encouraging about progress while being honest about challenges
- Include specific, actionable next steps

Remember: Your audience includes developers, designers, product managers, and executives. Make your insights valuable and actionable for everyone involved in creating more accessible experiences.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      maxTokens: 2000,  // Increased for more comprehensive summaries
      temperature: 0.3,
      abortSignal: AbortSignal.timeout(AI_ANALYSIS_TIMEOUT),
    })

    const cleanedResponse = text.replace(/```(?:json)?\s*/, '').replace(/```\s*$/, '')
    try {
      const analysis = JSON.parse(cleanedResponse)
      return {
        summary: analysis.summary || 'Summary not available',
        priorityRecommendations: analysis.priorityRecommendations || [],
      }
    } catch (parseError) {
      console.error('Failed to parse AI summary response:', parseError)
      return {
        summary: 'Comprehensive accessibility audit completed. Please review detailed results for specific violations and recommendations.',
        priorityRecommendations: [],
      }
    }

  } catch (error) {
    console.error('AI summary generation failed:', error)
    return {
      summary: 'AI summary temporarily unavailable',
      priorityRecommendations: [],
    }
  }
}

function calculateComprehensiveAccessibilityScore(results: AxeResults, violationCounts: ViolationCounts): number {
  // Enhanced scoring algorithm that considers multiple factors
  let score = 100

  // Base deductions for violations (weighted by impact)
  score -= violationCounts.critical * 25    // Critical issues are show-stoppers
  score -= violationCounts.serious * 15     // Serious issues significantly impact users
  score -= violationCounts.moderate * 8     // Moderate issues affect some users
  score -= violationCounts.minor * 3        // Minor issues are still important

  // Bonus points for comprehensive coverage (passes)
  const passBonus = Math.min(results.passes.length * 0.3, 15)
  score += passBonus

  // Penalty for incomplete tests (indicates potential issues)
  const incompletePenalty = Math.min(results.incomplete.length * 2, 10)
  score -= incompletePenalty

  // Consider the ratio of violations to total applicable rules
  const totalApplicableRules = results.violations.length + results.passes.length + results.incomplete.length
  if (totalApplicableRules > 0) {
    const violationRatio = results.violations.length / totalApplicableRules
    score -= violationRatio * 20
  }

  // Ensure score is between 0 and 100
  return Math.max(0, Math.min(100, Math.round(score)))
}

function analyzeWcagCompliance(results: AxeResults): string {
  const wcagLevels = {
    'wcag2a': results.violations.filter(v => v.tags.includes('wcag2a')).length,
    'wcag2aa': results.violations.filter(v => v.tags.includes('wcag2aa')).length,
    'wcag21a': results.violations.filter(v => v.tags.includes('wcag21a')).length,
    'wcag21aa': results.violations.filter(v => v.tags.includes('wcag21aa')).length,
    'wcag22aa': results.violations.filter(v => v.tags.includes('wcag22aa')).length,
    'section508': results.violations.filter(v => v.tags.includes('section508')).length,
  }

  return Object.entries(wcagLevels)
    .map(([level, count]) => `${level.toUpperCase()}: ${count} violations`)
    .join(', ')
}

function analyzeCategoryBreakdown(results: AxeResults): string {
  const categories = [
    'cat.aria', 'cat.color', 'cat.forms', 'cat.keyboard', 'cat.language',
    'cat.name-role-value', 'cat.parsing', 'cat.semantics', 'cat.sensory-and-visual-cues',
    'cat.structure', 'cat.tables', 'cat.text-alternatives', 'cat.time-and-media'
  ]

  return categories
    .map(cat => {
      const count = results.violations.filter(v => v.tags.includes(cat)).length
      return count > 0 ? `${cat.replace('cat.', '')}: ${count}` : null
    })
    .filter(Boolean)
    .join(', ') || 'No major category issues found'
}

function extractWcagCriteria(tags: string[]): Array<{ criterion: string; level: string; guideline: string }> {
  const wcagTags = tags.filter(tag => tag.startsWith('wcag'))
  return wcagTags.map(tag => {
    const parts = tag.split(/(\d+)/)
    return {
      criterion: tag,
      level: extractWcagLevel([tag]),
      guideline: parts[0] || 'Unknown'
    }
  })
}

function extractWcagLevel(tags: string[]): string {
  if (tags.some(tag => tag.includes('wcag2aaa') || tag.includes('wcag21aaa'))) return 'AAA'
  if (tags.some(tag => tag.includes('wcag2aa') || tag.includes('wcag21aa'))) return 'AA'
  if (tags.some(tag => tag.includes('wcag2a') || tag.includes('wcag21a'))) return 'A'
  return 'Unknown'
} 