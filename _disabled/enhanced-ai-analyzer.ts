import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'
import { 
  EnhancedAIAnalysis,
  WebsiteClassification,
  UserImpactAnalysis,
  TechnicalContext,
  CompetitorComparison,
  IndustryBenchmark,
  ROI_FACTORS
} from './accessibility-intelligence'

interface ViolationContext {
  violationId: string
  description: string
  impact: 'critical' | 'serious' | 'moderate' | 'minor'
  wcagLevel: string
  selector: string
  html: string
  helpUrl: string
}

export async function generateEnhancedAIAnalysis(
  violation: ViolationContext,
  websiteClassification: WebsiteClassification,
  url: string,
  pageTitle: string
): Promise<EnhancedAIAnalysis> {
  try {
    // Generate all components in parallel for efficiency
    const [
      userImpactAnalysis,
      technicalContext,
      competitorComparison,
      businessJustification,
      executiveSummary,
      technicalImplementation
    ] = await Promise.all([
      generateUserImpactAnalysis(violation, websiteClassification),
      generateTechnicalContext(violation, websiteClassification),
      generateCompetitorComparison(violation, websiteClassification),
      generateBusinessJustification(violation, websiteClassification, url),
      generateExecutiveSummary(violation, websiteClassification, pageTitle),
      generateTechnicalImplementation(violation, websiteClassification)
    ])

    // Create industry benchmark
    const industryBenchmark = createIndustryBenchmark(websiteClassification)

    return {
      websiteClassification,
      industryBenchmark,
      userImpactAnalysis,
      technicalContext,
      competitorComparison,
      businessJustification,
      executiveSummary,
      technicalImplementation
    }
  } catch (error) {
    console.error('Enhanced AI analysis failed:', error)
    return createFallbackAnalysis(violation, websiteClassification)
  }
}

async function generateUserImpactAnalysis(
  violation: ViolationContext,
  websiteClassification: WebsiteClassification
): Promise<UserImpactAnalysis> {
  try {
    const prompt = `Analyze the user impact of this accessibility violation:

VIOLATION: ${violation.violationId} - ${violation.description}
WEBSITE TYPE: ${websiteClassification.type}
INDUSTRY: ${websiteClassification.industry}
TARGET AUDIENCE: ${websiteClassification.targetAudience}
IMPACT LEVEL: ${violation.impact}

Provide detailed user impact analysis considering:
1. What percentage of users are affected by this specific violation?
2. How does this impact vary by user type (screen reader users, keyboard users, etc.)?
3. What's the business severity for this website type?
4. How does this affect conversion rates and user experience?
5. What's the estimated revenue impact?

Consider that:
- Screen reader users: ~1-2% of population
- Keyboard-only users: ~2-5% of population  
- Users with cognitive disabilities: ~10-15% of population
- Users with visual impairments: ~8-12% of population
- Temporary disabilities: ~5-10% of users at any time

Respond in JSON format:
{
  "affectedUserPercentage": 15,
  "severityForBusinessType": "high",
  "revenueImpact": {
    "estimatedLoss": 5000,
    "conversionImpact": "15% reduction in conversion rate for affected users",
    "marketExpansion": 12000
  },
  "userTypes": [
    {
      "type": "Screen reader users",
      "percentage": 2,
      "impactLevel": "severe"
    }
  ]
}`

    const { text } = await generateText({
      model: openai('gpt-4o'),
      messages: [
        {
          role: 'system',
          content: 'You are an accessibility expert specializing in user impact analysis. Provide realistic, data-driven assessments based on actual user behavior and accessibility statistics.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      maxTokens: 400,
      temperature: 0.3,
    })

    const cleanedResponse = text.replace(/```(?:json)?\s*/, '').replace(/```\s*$/, '')
    const result = JSON.parse(cleanedResponse)
    
    return {
      affectedUserPercentage: result.affectedUserPercentage || 10,
      severityForBusinessType: result.severityForBusinessType || 'medium',
      revenueImpact: {
        estimatedLoss: result.revenueImpact?.estimatedLoss || 1000,
        conversionImpact: result.revenueImpact?.conversionImpact || 'Minor impact on conversion',
        marketExpansion: result.revenueImpact?.marketExpansion || 2000
      },
      userTypes: result.userTypes || [
        { type: 'Users with disabilities', percentage: 10, impactLevel: 'moderate' }
      ]
    }
  } catch (error) {
    console.error('User impact analysis failed:', error)
    return createFallbackUserImpact(violation, websiteClassification)
  }
}

async function generateTechnicalContext(
  violation: ViolationContext,
  websiteClassification: WebsiteClassification
): Promise<TechnicalContext> {
  try {
    const prompt = `Analyze the technical implementation context for this accessibility violation:

VIOLATION: ${violation.violationId} - ${violation.description}
HTML ELEMENT: ${violation.html}
CSS SELECTOR: ${violation.selector}
WEBSITE TYPE: ${websiteClassification.type}

Provide technical analysis including:
1. What technology stack is likely involved?
2. Implementation complexity (simple/moderate/complex)
3. Estimated fix time
4. Required skills/expertise
5. Framework-specific considerations

Respond in JSON format:
{
  "technologyStack": ["HTML", "CSS", "JavaScript"],
  "implementationComplexity": "simple",
  "estimatedFixTime": "30 minutes",
  "requiredSkills": ["HTML/CSS", "ARIA"],
  "frameworkSpecific": true
}`

    const { text } = await generateText({
      model: openai('gpt-4o'),
      messages: [
        {
          role: 'system',
          content: 'You are a senior web developer and accessibility expert. Provide realistic technical assessments based on common web development practices.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      maxTokens: 300,
      temperature: 0.3,
    })

    const cleanedResponse = text.replace(/```(?:json)?\s*/, '').replace(/```\s*$/, '')
    const result = JSON.parse(cleanedResponse)
    
    return {
      technologyStack: result.technologyStack || ['HTML', 'CSS'],
      implementationComplexity: result.implementationComplexity || 'moderate',
      estimatedFixTime: result.estimatedFixTime || '1-2 hours',
      requiredSkills: result.requiredSkills || ['HTML/CSS'],
      frameworkSpecific: result.frameworkSpecific || false
    }
  } catch (error) {
    console.error('Technical context analysis failed:', error)
    return createFallbackTechnicalContext(violation)
  }
}

async function generateCompetitorComparison(
  violation: ViolationContext,
  websiteClassification: WebsiteClassification
): Promise<CompetitorComparison> {
  try {
    // Use industry benchmarks to estimate competitive position
    const industryAverage = getIndustryAccessibilityAverage(websiteClassification.type)
    const violationPenalty = getViolationPenalty(violation.impact)
    
    const betterThan = Math.max(0, Math.min(100, industryAverage - violationPenalty))
    const industryStandard = betterThan >= 70
    
    const competitiveAdvantage = industryStandard 
      ? ['Meets industry accessibility standards', 'Reduced legal risk']
      : ['Opportunity to exceed competitors', 'First-mover advantage in accessibility']
    
    const marketOpportunity = industryStandard
      ? 'Maintain competitive position'
      : 'Gain competitive advantage by improving accessibility'

    return {
      betterThan,
      industryStandard,
      competitiveAdvantage,
      marketOpportunity
    }
  } catch (error) {
    console.error('Competitor comparison failed:', error)
    return {
      betterThan: 50,
      industryStandard: false,
      competitiveAdvantage: ['Opportunity for improvement'],
      marketOpportunity: 'Standard accessibility improvement'
    }
  }
}

async function generateBusinessJustification(
  violation: ViolationContext,
  websiteClassification: WebsiteClassification,
  url: string
): Promise<string> {
  try {
    const prompt = `Create a business justification for fixing this accessibility violation:

VIOLATION: ${violation.violationId} - ${violation.description}
WEBSITE TYPE: ${websiteClassification.type}
INDUSTRY: ${websiteClassification.industry}
TARGET AUDIENCE: ${websiteClassification.targetAudience}
URL: ${url}

Create a compelling business case that addresses:
1. Financial impact (revenue loss, market opportunity)
2. Legal/compliance risks
3. Brand reputation considerations
4. Competitive advantages
5. ROI of fixing this issue

Write 2-3 paragraphs in business language suitable for executives and stakeholders.`

    const { text } = await generateText({
      model: openai('gpt-4o'),
      messages: [
        {
          role: 'system',
          content: 'You are a business consultant specializing in accessibility ROI and risk management. Write compelling business justifications that resonate with executives and decision-makers.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      maxTokens: 400,
      temperature: 0.4,
    })

    return text.trim()
  } catch (error) {
    console.error('Business justification generation failed:', error)
    return createFallbackBusinessJustification(violation, websiteClassification)
  }
}

async function generateExecutiveSummary(
  violation: ViolationContext,
  websiteClassification: WebsiteClassification,
  pageTitle: string
): Promise<string> {
  try {
    const prompt = `Create an executive summary for this accessibility violation:

PAGE: ${pageTitle}
VIOLATION: ${violation.violationId} - ${violation.description}
IMPACT: ${violation.impact}
WEBSITE TYPE: ${websiteClassification.type}
INDUSTRY: ${websiteClassification.industry}

Create a 1-2 sentence executive summary that:
1. Clearly states the issue and its business impact
2. Provides the recommended action
3. Uses executive-friendly language

Example format: "The website's [issue] affects X% of users and poses [risk level] compliance risk. Immediate action recommended to [solution] within [timeframe] to [business benefit]."
`

    const { text } = await generateText({
      model: openai('gpt-4o'),
      messages: [
        {
          role: 'system',
          content: 'You are an executive communication specialist. Create concise, impactful summaries that executives can quickly understand and act upon.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      maxTokens: 150,
      temperature: 0.3,
    })

    return text.trim()
  } catch (error) {
    console.error('Executive summary generation failed:', error)
    return createFallbackExecutiveSummary(violation)
  }
}

async function generateTechnicalImplementation(
  violation: ViolationContext,
  websiteClassification: WebsiteClassification
): Promise<string> {
  try {
    const prompt = `Provide detailed technical implementation guidance for fixing this accessibility violation:

VIOLATION: ${violation.violationId} - ${violation.description}
HTML ELEMENT: ${violation.html}
CSS SELECTOR: ${violation.selector}
WEBSITE TYPE: ${websiteClassification.type}

Provide step-by-step technical implementation that includes:
1. Specific code changes needed
2. Testing instructions
3. Framework-specific considerations (React, Vue, Angular)
4. Best practices to prevent recurrence

Write in a technical but clear manner suitable for developers.`

    const { text } = await generateText({
      model: openai('gpt-4o'),
      messages: [
        {
          role: 'system',
          content: 'You are a senior accessibility developer. Provide practical, actionable technical guidance that developers can immediately implement.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      maxTokens: 500,
      temperature: 0.3,
    })

    return text.trim()
  } catch (error) {
    console.error('Technical implementation generation failed:', error)
    return createFallbackTechnicalImplementation(violation)
  }
}

// Helper functions
function createIndustryBenchmark(websiteClassification: WebsiteClassification): IndustryBenchmark {
  const industryData = {
    ecommerce: { average: 72, common: ['color-contrast', 'alt-text', 'keyboard-navigation'] },
    saas: { average: 78, common: ['aria-labels', 'focus-management', 'form-validation'] },
    content: { average: 75, common: ['heading-structure', 'alt-text', 'link-text'] },
    government: { average: 82, common: ['color-contrast', 'keyboard-navigation', 'screen-reader'] },
    education: { average: 80, common: ['alt-text', 'form-labels', 'heading-structure'] },
    healthcare: { average: 76, common: ['color-contrast', 'form-validation', 'error-handling'] },
    finance: { average: 79, common: ['security-focus', 'form-validation', 'error-messages'] },
    nonprofit: { average: 71, common: ['alt-text', 'color-contrast', 'simple-navigation'] }
  }

  const data = industryData[websiteClassification.type as keyof typeof industryData] || industryData.content

  return {
    averageScore: data.average,
    commonIssues: data.common,
    complianceRequirements: websiteClassification.complianceRequirements,
    marketPosition: 'average',
    improvementOpportunity: 100 - data.average
  }
}

function getIndustryAccessibilityAverage(websiteType: string): number {
  const averages: Record<string, number> = {
    ecommerce: 72,
    saas: 78,
    content: 75,
    government: 82,
    education: 80,
    healthcare: 76,
    finance: 79,
    nonprofit: 71
  }
  return averages[websiteType] || 75
}

function getViolationPenalty(impact: string): number {
  const penalties: Record<string, number> = {
    critical: 25,
    serious: 15,
    moderate: 8,
    minor: 3
  }
  return penalties[impact] || 8
}

// Fallback functions
function createFallbackAnalysis(
  violation: ViolationContext,
  websiteClassification: WebsiteClassification
): EnhancedAIAnalysis {
  return {
    websiteClassification,
    industryBenchmark: createIndustryBenchmark(websiteClassification),
    userImpactAnalysis: createFallbackUserImpact(violation, websiteClassification),
    technicalContext: createFallbackTechnicalContext(violation),
    competitorComparison: {
      betterThan: 50,
      industryStandard: false,
      competitiveAdvantage: ['Opportunity for improvement'],
      marketOpportunity: 'Standard accessibility improvement'
    },
    businessJustification: createFallbackBusinessJustification(violation, websiteClassification),
    executiveSummary: createFallbackExecutiveSummary(violation),
    technicalImplementation: createFallbackTechnicalImplementation(violation)
  }
}

function createFallbackUserImpact(
  violation: ViolationContext,
  websiteClassification: WebsiteClassification
): UserImpactAnalysis {
  const impactMap = {
    critical: { percentage: 20, severity: 'critical' as const, loss: 5000 },
    serious: { percentage: 15, severity: 'high' as const, loss: 3000 },
    moderate: { percentage: 10, severity: 'medium' as const, loss: 1500 },
    minor: { percentage: 5, severity: 'low' as const, loss: 500 }
  }

  const impact = impactMap[violation.impact] || impactMap.moderate

  return {
    affectedUserPercentage: impact.percentage,
    severityForBusinessType: impact.severity,
    revenueImpact: {
      estimatedLoss: impact.loss,
      conversionImpact: `${impact.percentage}% reduction in conversion for affected users`,
      marketExpansion: impact.loss * 2
    },
    userTypes: [
      { type: 'Users with disabilities', percentage: impact.percentage, impactLevel: impact.severity }
    ]
  }
}

function createFallbackTechnicalContext(violation: ViolationContext): TechnicalContext {
  const complexityMap = {
    critical: 'complex' as const,
    serious: 'moderate' as const,
    moderate: 'moderate' as const,
    minor: 'simple' as const
  }

  return {
    technologyStack: ['HTML', 'CSS', 'JavaScript'],
    implementationComplexity: complexityMap[violation.impact] || 'moderate',
    estimatedFixTime: '1-2 hours',
    requiredSkills: ['HTML/CSS', 'ARIA'],
    frameworkSpecific: false
  }
}

function createFallbackBusinessJustification(
  violation: ViolationContext,
  websiteClassification: WebsiteClassification
): string {
  return `This ${violation.impact} accessibility violation affects user experience and poses compliance risks for ${websiteClassification.industry} businesses. Fixing this issue will improve usability for all users, reduce legal exposure, and demonstrate commitment to inclusive design. The investment in accessibility improvements typically yields positive ROI through expanded market reach and improved user satisfaction.`
}

function createFallbackExecutiveSummary(violation: ViolationContext): string {
  return `${violation.impact.charAt(0).toUpperCase() + violation.impact.slice(1)} accessibility issue identified that impacts user experience and compliance. Immediate remediation recommended to reduce risk and improve usability.`
}

function createFallbackTechnicalImplementation(violation: ViolationContext): string {
  return `To fix this ${violation.violationId} violation: 1) Review the affected element at ${violation.selector}, 2) Apply appropriate ARIA attributes or semantic HTML, 3) Test with screen readers and keyboard navigation, 4) Validate against WCAG guidelines. Refer to ${violation.helpUrl} for detailed guidance.`
} 
 
 