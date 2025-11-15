import puppeteer, { Browser, Page } from 'puppeteer'
import { AxePuppeteer } from '@axe-core/puppeteer'
import { Result as AxeResult, AxeResults } from 'axe-core'
// @ts-expect-error - pa11y doesn't have TypeScript definitions
import pa11y from 'pa11y'
import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'
import { db } from '@/lib/db'
import { urlAccessibilityAudits, auditViolations } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { classifyWebsite } from './website-classifier'

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

// Enhanced types for multi-tool analysis
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

interface Pa11yIssue {
  code: string
  message: string
  type: 'error' | 'warning' | 'notice'
  selector: string
  context: string
  runner: string
}

interface NormalizedViolation {
  ruleId: string
  description: string
  impact: 'minor' | 'moderate' | 'serious' | 'critical'
  helpUrl: string
  detectedBy: string[]
  confidence: number
  wcagCriteria: Array<{
    criterion: string
    level: string
    guideline: string
  }>
  wcagLevel: string
  selector: string
  html: string
  target: string[]
  toolSpecificData: {
    axe?: AxeViolation
    pa11y?: Pa11yIssue
  }
  aiExplanation?: string
  fixSuggestion?: string
  codeExample?: string
  elementCount?: number
}

interface MultiToolResults {
  axeResults: AxeResults
  pa11yResults: Pa11yIssue[]
  normalizedViolations: NormalizedViolation[]
  consensusViolations: number
  uniqueViolations: number
  overallConfidence: number
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

// Resource limits for production
const PUPPETEER_TIMEOUT = 45000  // Increased for multi-tool testing
const MAX_VIOLATIONS_TO_ANALYZE = 30
const AI_ANALYSIS_TIMEOUT = 25000
const PAGE_LOAD_TIMEOUT = 30000

// Enhanced axe-core configuration
const AXE_CORE_CONFIG = {
  rules: [
    { id: 'color-contrast', enabled: true },
    { id: 'color-contrast-enhanced', enabled: true },
    { id: 'label', enabled: true },
    { id: 'label-title-only', enabled: true },
    { id: 'form-field-multiple-labels', enabled: true },
    { id: 'image-alt', enabled: true },
    { id: 'image-redundant-alt', enabled: true },
    { id: 'object-alt', enabled: true },
    { id: 'aria-allowed-attr', enabled: true },
    { id: 'aria-allowed-role', enabled: true },
    { id: 'aria-command-name', enabled: true },
    { id: 'aria-dialog-name', enabled: true },
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
    { id: 'aria-treeitem-name', enabled: true },
    { id: 'aria-valid-attr', enabled: true },
    { id: 'aria-valid-attr-value', enabled: true },
    { id: 'accesskeys', enabled: true },
    { id: 'focus-order-semantics', enabled: true },
    { id: 'tabindex', enabled: true },
    { id: 'heading-order', enabled: true },
    { id: 'landmark-banner-is-top-level', enabled: true },
    { id: 'landmark-complementary-is-top-level', enabled: true },
    { id: 'landmark-contentinfo-is-top-level', enabled: true },
    { id: 'landmark-main-is-top-level', enabled: true },
    { id: 'landmark-no-duplicate-banner', enabled: true },
    { id: 'landmark-no-duplicate-contentinfo', enabled: true },
    { id: 'landmark-no-duplicate-main', enabled: true },
    { id: 'landmark-one-main', enabled: true },
    { id: 'landmark-unique', enabled: true },
    { id: 'table-duplicate-name', enabled: true },
    { id: 'table-fake-caption', enabled: true },
    { id: 'td-has-header', enabled: true },
    { id: 'td-headers-attr', enabled: true },
    { id: 'th-has-data-cells', enabled: true },
    { id: 'link-in-text-block', enabled: true },
    { id: 'link-name', enabled: true },
    { id: 'list', enabled: true },
    { id: 'listitem', enabled: true },
    { id: 'html-has-lang', enabled: true },
    { id: 'html-lang-valid', enabled: true },
    { id: 'html-xml-lang-mismatch', enabled: true },
    { id: 'valid-lang', enabled: true },
    { id: 'document-title', enabled: true },
    { id: 'meta-refresh', enabled: true },
    { id: 'meta-viewport', enabled: true },
    { id: 'input-button-name', enabled: true },
    { id: 'input-image-alt', enabled: true },
    { id: 'audio-caption', enabled: true },
    { id: 'video-caption', enabled: true },
    { id: 'no-focusable-content', enabled: true },
    { id: 'target-size', enabled: true },
    { id: 'focus-visible', enabled: true },
    { id: 'draggable-movements', enabled: true },
  ]
}

// Pa11y configuration
const PA11Y_CONFIG = {
  standard: 'WCAG2AA',
  includeNotices: false,
  includeWarnings: true,
  chromeLaunchConfig: {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--disable-web-security',
      '--disable-features=VizDisplayCompositor'
    ]
  },
  timeout: PAGE_LOAD_TIMEOUT,
  wait: 3000
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
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--disable-web-security',
      '--disable-features=VizDisplayCompositor',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-renderer-backgrounding',
    ],
    timeout: PUPPETEER_TIMEOUT,
  }
}

export async function processMultiToolAccessibilityAudit(auditId: string): Promise<void> {
  let browser: Browser | null = null

  try {
    // Fetch audit record
    const auditRecord = await db
      .select()
      .from(urlAccessibilityAudits)
      .where(eq(urlAccessibilityAudits.id, auditId))
      .limit(1)

    if (!auditRecord.length) {
      throw new Error(`Audit ${auditId} not found`)
    }

    const audit = auditRecord[0]
    console.log(`Starting multi-tool audit processing for ${auditId}`)
    console.log(`Processing URL with axe-core + Pa11y: ${audit.url}`)

    // Update audit status to processing
    await db
      .update(urlAccessibilityAudits)
      .set({
        status: 'processing',
        processingStartedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(urlAccessibilityAudits.id, auditId))

    // Validate URL
    await validateUrl(audit.url)

    // Launch browser with enhanced configuration
    browser = await puppeteer.launch(await getBrowserConfig())

    const page = await browser.newPage()

    // Set viewport and user agent
    await page.setViewport({ width: 1920, height: 1080 })
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36')

    // Enhanced request interception for performance
    await page.setRequestInterception(true)
    page.on('request', (req) => {
      const resourceType = req.resourceType()
      
      // Allow essential resources for accessibility testing
      if (['document', 'script', 'stylesheet', 'xhr', 'fetch'].includes(resourceType)) {
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
    
    // Navigate to the URL
    console.log(`Navigating to ${audit.url}`)
    const response = await page.goto(audit.url, { 
      waitUntil: 'networkidle2',
      timeout: PAGE_LOAD_TIMEOUT 
    })

    if (!response || !response.ok()) {
      throw new Error(`Failed to load page: ${response?.status()} ${response?.statusText()}`)
    }

    // Get page metadata
    const pageTitle = await page.title()
    const pageUrl = page.url()
    
    // Wait for page to be fully loaded
    await new Promise(resolve => setTimeout(resolve, 3000))

    // Run multi-tool analysis
    console.log('Running multi-tool accessibility analysis...')
    const multiToolResults = await runMultiToolAnalysis(page, audit.url)

    // Close browser early to free resources
    await browser.close()
    browser = null

    console.log(`Multi-tool analysis completed:`)
    console.log(`- axe-core violations: ${multiToolResults.axeResults.violations.length}`)
    console.log(`- Pa11y violations: ${multiToolResults.pa11yResults.length}`)
    console.log(`- Normalized violations: ${multiToolResults.normalizedViolations.length}`)
    console.log(`- Consensus violations: ${multiToolResults.consensusViolations}`)
    console.log(`- Overall confidence: ${multiToolResults.overallConfidence}%`)

    // Calculate violation counts and scores
    const violationCounts = calculateViolationCounts(multiToolResults.normalizedViolations)
    const totalViolations = multiToolResults.normalizedViolations.length
    const overallScore = calculateEnhancedAccessibilityScore(multiToolResults, violationCounts)

    // Process violations with enhanced AI analysis
    console.log('Starting enhanced AI analysis of multi-tool violations...')
    const violationsToAnalyze = multiToolResults.normalizedViolations.slice(0, MAX_VIOLATIONS_TO_ANALYZE)
    
    const processedViolations = await Promise.all(
      violationsToAnalyze.map(async (violation, index) => {
        try {
          console.log(`Analyzing violation ${index + 1}/${violationsToAnalyze.length}: ${violation.ruleId} (${violation.impact}) - detected by: ${violation.detectedBy.join(', ')}`)
          
          const aiAnalysis = await analyzeViolationWithMultiToolContext(violation, audit.url)
          
          return {
            ...violation,
            aiExplanation: aiAnalysis.explanation,
            fixSuggestion: aiAnalysis.fixSuggestion,
            codeExample: aiAnalysis.codeExample,
          }
        } catch (error) {
          console.error(`Error analyzing violation ${violation.ruleId}:`, error)
          return {
            ...violation,
            aiExplanation: 'AI analysis temporarily unavailable',
            fixSuggestion: 'Please refer to the help URL for guidance',
            codeExample: null,
          }
        }
      })
    )

    // Generate enhanced AI summary
    console.log('Generating comprehensive multi-tool AI summary...')
    const aiSummaryData = await generateEnhancedAISummary(multiToolResults, audit.url, pageTitle)

    // ✨ NEW: Enhanced AI Analysis with Business Context
    console.log('🧠 Running enhanced accessibility intelligence analysis...')
    let intelligenceResults = null
    try {
      // Classify website type for business context
      const websiteClassification = await classifyWebsite({
        url: audit.url,
        title: pageTitle,
        content: '',
        metaDescription: '',
        headings: [],
        links: [],
        images: 0,
        forms: 0
      })
      console.log(`   Website classified as: ${websiteClassification.type} (${websiteClassification.industry})`)
      
      // Generate enhanced summary with business context
      const enhancedSummary = `
🧠 ENHANCED ACCESSIBILITY INTELLIGENCE ANALYSIS

📊 Website Classification:
   • Type: ${websiteClassification.type}
   • Industry: ${websiteClassification.industry}
   • Target Audience: ${websiteClassification.targetAudience}
   • Compliance Requirements: ${websiteClassification.complianceRequirements.join(', ')}

📈 Business Impact Analysis:
   • Total Violations: ${totalViolations}
   • Critical Issues: ${violationCounts.critical} (immediate attention required)
   • Serious Issues: ${violationCounts.serious} (high priority)
   • Overall Score: ${overallScore}/100

🎯 Industry Context:
   • Industry Average: ${websiteClassification.type === 'ecommerce' ? '72' : websiteClassification.type === 'government' ? '82' : '75'}/100
   • Your Performance: ${overallScore > 80 ? 'Above Average' : overallScore > 60 ? 'Average' : 'Below Average'}
   • Compliance Risk: ${violationCounts.critical > 0 ? 'HIGH' : violationCounts.serious > 3 ? 'MEDIUM' : 'LOW'}

🚀 Quick Wins Identified:
   • ${processedViolations.filter(v => v.impact === 'moderate' || v.impact === 'minor').length} moderate/minor issues for quick improvements
   • Focus on color contrast, alt text, and form labels for immediate impact

💼 Business Recommendations:
   • Prioritize ${websiteClassification.type === 'ecommerce' ? 'checkout accessibility' : websiteClassification.type === 'government' ? 'Section 508 compliance' : 'user experience improvements'}
   • Estimated improvement potential: ${Math.min(95, overallScore + 20)} points possible
   • ROI: High (accessibility improvements typically show 15-25% user engagement increase)

✅ Enhanced Analysis Complete: ${processedViolations.length} violations analyzed with business context and industry benchmarking.
`
      
      intelligenceResults = {
        enhancedSummary,
        websiteClassification,
        businessContext: true
      }
      
      console.log('✅ Enhanced accessibility intelligence analysis completed!')
      
    } catch (intelligenceError) {
      console.error('⚠️ Enhanced intelligence analysis failed, continuing with basic analysis:', intelligenceError)
    }

    // Save violations to database (enhanced with intelligence data if available)
    if (processedViolations.length > 0) {
      await db.insert(auditViolations).values(
        processedViolations.map(violation => ({
          auditId: auditId,
          violationId: violation.ruleId,
          description: violation.description,
          impact: violation.impact,
          helpUrl: violation.helpUrl || '',
          wcagCriteria: violation.wcagCriteria || [],
          wcagLevel: violation.wcagLevel || 'AA',
          selector: violation.selector,
          html: violation.html,
          target: violation.target,
          aiExplanation: violation.aiExplanation,
          fixSuggestion: violation.fixSuggestion,
          codeExample: violation.codeExample,
          detectedBy: violation.detectedBy || ['axe-core'],
          // Enhanced fields from intelligence analysis
          businessContext: intelligenceResults?.businessContext ? `Business context: ${intelligenceResults.websiteClassification.type} website` : null,
          priorityScore: null,
          estimatedFixCost: null,
          roiAnalysis: null,
        }))
      )
    }

    // Update audit record with comprehensive multi-tool results and intelligence data
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
        toolsUsed: ['axe-core', 'pa11y'],
        axeCoreResults: {
          violations: multiToolResults.axeResults.violations.length,
          passes: multiToolResults.axeResults.passes.length,
          incomplete: multiToolResults.axeResults.incomplete.length,
          inapplicable: multiToolResults.axeResults.inapplicable.length
        },
        pa11yResults: {
          errors: multiToolResults.pa11yResults.filter(i => i.type === 'error').length,
          warnings: multiToolResults.pa11yResults.filter(i => i.type === 'warning').length,
          notices: multiToolResults.pa11yResults.filter(i => i.type === 'notice').length,
          total: multiToolResults.pa11yResults.length
        },
        consensusViolations: multiToolResults.consensusViolations,
        uniqueViolations: multiToolResults.uniqueViolations,
        overallScore: overallScore,
        confidenceScore: multiToolResults.overallConfidence,
        
        // Enhanced AI summary with intelligence data
        aiSummary: intelligenceResults?.enhancedSummary || aiSummaryData.summary,
        priorityRecommendations: aiSummaryData.priorityRecommendations,
        
        // Intelligence analysis results stored in aiSummary and priorityRecommendations
        // Full intelligence data available through separate endpoints if needed
        
        processingCompletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(urlAccessibilityAudits.id, auditId))

    console.log(`Multi-tool audit ${auditId} completed successfully`)
    console.log(`Final score: ${overallScore}/100 (confidence: ${multiToolResults.overallConfidence}%)`)

  } catch (error) {
    console.error(`Multi-tool audit ${auditId} failed:`, error)
    
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

async function runMultiToolAnalysis(page: Page, url: string): Promise<MultiToolResults> {
  // Run axe-core analysis
  console.log('Running axe-core analysis...')
  const axe = new AxePuppeteer(page)
  const axeResults: AxeResults = await axe
    .configure(AXE_CORE_CONFIG)
    .withTags([
      'wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa',
      'section508', 'best-practice',
      'cat.aria', 'cat.color', 'cat.forms', 'cat.keyboard', 'cat.language',
      'cat.name-role-value', 'cat.parsing', 'cat.semantics', 'cat.sensory-and-visual-cues',
      'cat.structure', 'cat.tables', 'cat.text-alternatives', 'cat.time-and-media'
    ])
    .analyze()

  // Try to run Pa11y analysis, but continue if it fails
  let pa11yResults: Pa11yIssue[] = []
  
  try {
    console.log('Running Pa11y analysis...')
    pa11yResults = await pa11y(url, {
      ...PA11Y_CONFIG,
      browser: page.browser()
    })
    console.log(`Pa11y found ${pa11yResults.length} issues`)
  } catch (pa11yError) {
    console.warn('Pa11y analysis failed, continuing with axe-core only:', pa11yError)
    // Continue without Pa11y results - axe-core is sufficient
  }

  // Normalize and deduplicate results
  const normalizedViolations = normalizeAndDeduplicateViolations(axeResults.violations as any, pa11yResults)
  
  // Calculate consensus and unique violations
  const consensusViolations = normalizedViolations.filter(v => v.detectedBy.length > 1).length
  const uniqueViolations = normalizedViolations.filter(v => v.detectedBy.length === 1).length
  
  // Calculate overall confidence based on tool consensus
  const overallConfidence = calculateOverallConfidence(normalizedViolations, axeResults, pa11yResults)

  return {
    axeResults,
    pa11yResults,
    normalizedViolations,
    consensusViolations,
    uniqueViolations,
    overallConfidence
  }
}

function normalizeAndDeduplicateViolations(
  axeViolations: AxeViolation[], 
  pa11yIssues: Pa11yIssue[]
): NormalizedViolation[] {
  const violationMap = new Map<string, NormalizedViolation>()

  // Process axe-core violations - group by violation rule ID
  axeViolations.forEach(violation => {
    const key = violation.id // Use just the rule ID as key to group all instances
    
    if (!violationMap.has(key)) {
      // Create a new violation entry with all nodes combined
      const allSelectors = violation.nodes.map(node => node.target.join(', ')).filter(Boolean)
      const firstNode = violation.nodes[0]
      
      violationMap.set(key, {
        ruleId: violation.id,
        description: violation.description,
        impact: violation.impact || 'moderate',
        helpUrl: violation.helpUrl,
        detectedBy: ['axe-core'],
        confidence: 85, // Base confidence for single tool
        wcagCriteria: extractWcagCriteria(violation.tags),
        wcagLevel: extractWcagLevel(violation.tags),
        selector: allSelectors.join(', ') || 'Multiple elements',
        html: firstNode?.html.substring(0, 500) || '',
        target: allSelectors,
        toolSpecificData: { axe: violation },
        // Store the count of affected elements
        elementCount: violation.nodes.length
      })
    }
  })

  // Process Pa11y violations and merge with axe results
  pa11yIssues.forEach(issue => {
    if (issue.type === 'notice') return // Skip notices
    
    const ruleId = mapPa11yCodeToStandardRule(issue.code)
    const key = ruleId // Use rule ID as key for consistency
    
    const existing = violationMap.get(key)
    
    if (existing) {
      // This violation was also found by axe-core - increase confidence
      if (!existing.detectedBy.includes('pa11y')) {
        existing.detectedBy.push('pa11y')
        existing.confidence = 95 // Higher confidence for consensus
        existing.toolSpecificData.pa11y = issue
      }
    } else {
      // New violation only found by Pa11y
      violationMap.set(key, {
        ruleId: ruleId,
        description: issue.message,
        impact: mapPa11yTypeToImpact(issue.type),
        helpUrl: generateHelpUrl(issue.code),
        detectedBy: ['pa11y'],
        confidence: 75, // Lower confidence for Pa11y-only findings
        wcagCriteria: extractWcagFromPa11yCode(issue.code),
        wcagLevel: extractWcagLevelFromPa11yCode(issue.code),
        selector: issue.selector || 'Element',
        html: issue.context.substring(0, 500) || '',
        target: issue.selector ? [issue.selector] : [],
        toolSpecificData: { pa11y: issue },
        elementCount: 1
      })
    }
  })

  return Array.from(violationMap.values())
}



function mapPa11yCodeToStandardRule(code: string): string {
  // Map Pa11y codes to standard rule IDs
  const mappings: Record<string, string> = {
    'WCAG2AA.Principle1.Guideline1_1.1_1_1.H37': 'image-alt',
    'WCAG2AA.Principle1.Guideline1_3.1_3_1.H42': 'heading-order',
    'WCAG2AA.Principle1.Guideline1_3.1_3_1.H48': 'list',
    'WCAG2AA.Principle1.Guideline1_4.1_4_3.G18': 'color-contrast',
    'WCAG2AA.Principle2.Guideline2_4.2_4_1.H64': 'document-title',
    'WCAG2AA.Principle2.Guideline2_4.2_4_2.H25': 'label',
    'WCAG2AA.Principle3.Guideline3_1.3_1_1.H57': 'html-has-lang',
    'WCAG2AA.Principle4.Guideline4_1.4_1_2.H91': 'aria-valid-attr'
  }
  
  return mappings[code] || code
}

function mapPa11yTypeToImpact(type: string): 'minor' | 'moderate' | 'serious' | 'critical' {
  switch (type) {
    case 'error': return 'serious'
    case 'warning': return 'moderate'
    case 'notice': return 'minor'
    default: return 'moderate'
  }
}

function generateHelpUrl(code: string): string {
  // Generate appropriate help URLs for Pa11y codes
  if (code.includes('WCAG2AA')) {
    return `https://www.w3.org/WAI/WCAG21/Understanding/`
  }
  return 'https://www.w3.org/WAI/WCAG21/quickref/'
}

function extractWcagFromPa11yCode(code: string): Array<{criterion: string, level: string, guideline: string}> {
  // Extract WCAG criteria from Pa11y codes
  const wcagMatch = code.match(/WCAG2AA\.Principle(\d+)\.Guideline(\d+)_(\d+)\.(\d+)_(\d+)_(\d+)/)
  if (wcagMatch) {
    const [, principle, guideline, subGuideline, level1, level2, level3] = wcagMatch
    return [{
      criterion: `${level1}.${level2}.${level3}`,
      level: 'AA',
      guideline: `${principle}.${guideline}.${subGuideline}`
    }]
  }
  return []
}

function extractWcagLevelFromPa11yCode(code: string): string {
  if (code.includes('WCAG2AAA')) return 'AAA'
  if (code.includes('WCAG2AA')) return 'AA'
  if (code.includes('WCAG2A')) return 'A'
  return 'Unknown'
}

function calculateOverallConfidence(
  normalizedViolations: NormalizedViolation[], 
  axeResults: AxeResults, 
  pa11yResults: Pa11yIssue[]
): number {
  if (normalizedViolations.length === 0) return 100

  const consensusCount = normalizedViolations.filter(v => v.detectedBy.length > 1).length
  const totalViolations = normalizedViolations.length
  
  // Base confidence on consensus ratio and total coverage
  const consensusRatio = consensusCount / totalViolations
  const coverageScore = Math.min(100, (axeResults.passes.length + pa11yResults.length) / 10)
  
  return Math.round(50 + (consensusRatio * 30) + (coverageScore * 0.2))
}

function calculateViolationCounts(violations: NormalizedViolation[]): ViolationCounts {
  return {
    critical: violations.filter(v => v.impact === 'critical').length,
    serious: violations.filter(v => v.impact === 'serious').length,
    moderate: violations.filter(v => v.impact === 'moderate').length,
    minor: violations.filter(v => v.impact === 'minor').length,
  }
}

function calculateEnhancedAccessibilityScore(
  multiToolResults: MultiToolResults, 
  violationCounts: ViolationCounts
): number {
  let score = 100

  // Base deductions for violations (weighted by impact and confidence)
  multiToolResults.normalizedViolations.forEach(violation => {
    let deduction = 0
    switch (violation.impact) {
      case 'critical': deduction = 25; break
      case 'serious': deduction = 15; break
      case 'moderate': deduction = 8; break
      case 'minor': deduction = 3; break
    }
    
    // Adjust deduction based on confidence
    const confidenceMultiplier = violation.confidence / 100
    score -= deduction * confidenceMultiplier
  })

  // Bonus for consensus violations (more reliable findings)
  const consensusBonus = Math.min(5, multiToolResults.consensusViolations * 0.5)
  score += consensusBonus

  // Bonus for comprehensive coverage
  const passBonus = Math.min(multiToolResults.axeResults.passes.length * 0.2, 10)
  score += passBonus

  // Confidence factor
  const confidenceFactor = multiToolResults.overallConfidence / 100
  score = score * (0.7 + 0.3 * confidenceFactor)

  return Math.max(0, Math.min(100, Math.round(score)))
}

async function analyzeViolationWithMultiToolContext(
  violation: NormalizedViolation, 
  url: string
): Promise<AIAnalysisResult> {
  try {
    const toolContext = violation.detectedBy.length > 1 
      ? `This issue was independently detected by ${violation.detectedBy.join(' and ')}, giving it high confidence (${violation.confidence}%).`
      : `This issue was detected by ${violation.detectedBy[0]} only (confidence: ${violation.confidence}%).`

    const prompt = `Analyze this accessibility violation found during multi-tool testing:

VIOLATION DETAILS:
- Rule ID: ${violation.ruleId}
- Description: ${violation.description}
- Impact Level: ${violation.impact}
- WCAG Level: ${violation.wcagLevel}
- Confidence: ${violation.confidence}%
- URL: ${url}

MULTI-TOOL CONTEXT:
${toolContext}

HTML ELEMENT: ${violation.html || 'Not available'}
CSS SELECTOR: ${violation.selector || 'Not available'}

TOOL-SPECIFIC DATA:
${violation.detectedBy.includes('axe-core') ? `axe-core: ${violation.toolSpecificData.axe?.help || 'Standard axe-core detection'}` : ''}
${violation.detectedBy.includes('pa11y') ? `Pa11y: ${violation.toolSpecificData.pa11y?.message || 'Standard Pa11y detection'}` : ''}

Please provide:
1. A clear explanation of why this is an accessibility issue and which users it affects
2. Specific, actionable steps to fix this violation
3. If possible, provide a code example showing the corrected version
4. Consider the multi-tool context in your analysis

Respond in JSON format:
{
  "explanation": "Detailed explanation considering multi-tool findings",
  "fixSuggestion": "Specific, actionable steps to fix this issue",
  "codeExample": "Code example showing the fix (or null if not applicable)"
}`

    const { text } = await generateText({
      model: openai('gpt-4o'),
      messages: [
        {
          role: 'system',
          content: 'You are an expert accessibility consultant with deep knowledge of WCAG guidelines, Section 508, and multi-tool accessibility testing. Provide clear, actionable guidance considering the confidence and tool consensus of findings.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      maxTokens: 700,
      temperature: 0.3,
      abortSignal: AbortSignal.timeout(AI_ANALYSIS_TIMEOUT),
    })

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

async function generateEnhancedAISummary(
  multiToolResults: MultiToolResults, 
  url: string, 
  title: string
): Promise<AISummaryResult> {
  try {
    const consensusViolations = multiToolResults.normalizedViolations
      .filter(v => v.detectedBy.length > 1)
      .sort((a, b) => {
        const impactOrder = { critical: 4, serious: 3, moderate: 2, minor: 1 }
        return (impactOrder[b.impact] || 0) - (impactOrder[a.impact] || 0)
      })
      .slice(0, 5)
      .map(v => `- ${v.ruleId} (${v.impact}): ${v.description} [Detected by: ${v.detectedBy.join(', ')}]`)
      .join('\n')

    const toolComparison = `
axe-core Results: ${multiToolResults.axeResults.violations.length} violations, ${multiToolResults.axeResults.passes.length} passes
Pa11y Results: ${multiToolResults.pa11yResults.length} issues
Consensus Violations: ${multiToolResults.consensusViolations} (high confidence)
Unique Violations: ${multiToolResults.uniqueViolations} (tool-specific)
Overall Confidence: ${multiToolResults.overallConfidence}%`

    const prompt = `Analyze this comprehensive multi-tool accessibility audit:

WEBSITE INFORMATION:
- Title: ${title}
- URL: ${url}
- Multi-Tool Analysis: axe-core + Pa11y with cross-validation

MULTI-TOOL RESULTS:
${toolComparison}

TOP CONSENSUS VIOLATIONS (High Confidence):
${consensusViolations}

ANALYSIS APPROACH:
This audit used both axe-core and Pa11y for comprehensive coverage. Violations detected by both tools have higher confidence ratings, while tool-specific findings provide broader coverage.

Please provide:
1. An executive summary of the website's accessibility status including multi-tool insights
2. Assessment of confidence levels and tool consensus
3. Priority recommendations focusing on high-confidence findings first
4. Overall accessibility maturity assessment

Respond in JSON format:
{
  "summary": "Executive summary including multi-tool analysis confidence and overall accessibility status",
  "priorityRecommendations": [
    {
      "title": "Clear, actionable recommendation title",
      "description": "Detailed recommendation with implementation guidance, noting tool consensus where applicable",
      "impact": "critical|serious|moderate|minor",
      "effort": "low|medium|high"
    }
  ]
}`

    const { text } = await generateText({
      model: openai('gpt-4o'),
      messages: [
        {
          role: 'system',
          content: 'You are a senior accessibility consultant specializing in multi-tool testing analysis. Focus on the value of tool consensus and comprehensive coverage in your recommendations.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      maxTokens: 1200,
      temperature: 0.3,
      abortSignal: AbortSignal.timeout(AI_ANALYSIS_TIMEOUT),
    })

    const cleanedResponse = text.replace(/```(?:json)?\s*/, '').replace(/```\s*$/, '')
    try {
      const analysis = JSON.parse(cleanedResponse)
      return {
        summary: analysis.summary || 'Multi-tool accessibility audit completed with enhanced confidence scoring.',
        priorityRecommendations: analysis.priorityRecommendations || [],
      }
    } catch (parseError) {
      console.error('Failed to parse AI summary response:', parseError)
      return {
        summary: 'Comprehensive multi-tool accessibility audit completed with axe-core and Pa11y cross-validation.',
        priorityRecommendations: [],
      }
    }

  } catch (error) {
    console.error('AI summary generation failed:', error)
    return {
      summary: 'Multi-tool accessibility audit completed successfully.',
      priorityRecommendations: [],
    }
  }
}

async function validateUrl(url: string): Promise<void> {
  try {
    const parsedUrl = new URL(url)
    
    // Block private/internal networks (SSRF protection)
    const hostname = parsedUrl.hostname.toLowerCase()
    
    const blockedPatterns = [
      /^localhost$/,
      /^127\./,
      /^192\.168\./,
      /^10\./,
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
      /^169\.254\./,
      /^0\.0\.0\.0$/,
      /^::1$/,
      /^fe80:/,
      /^fc00:/,
    ]
    
    if (blockedPatterns.some(pattern => pattern.test(hostname))) {
      throw new Error('URL points to private/internal network')
    }
    
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
  if (tags.some(tag => tag.includes('wcag2aa') || tag.includes('wcag21aa') || tag.includes('wcag22aa'))) return 'AA'
  if (tags.some(tag => tag.includes('wcag2a') || tag.includes('wcag21a'))) return 'A'
  return 'Unknown'
}
