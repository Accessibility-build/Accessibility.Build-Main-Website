import { 
  WebsiteClassification,
  ComplianceStatus,
  INDUSTRY_BENCHMARKS
} from './accessibility-intelligence'

interface BenchmarkData {
  websiteUrl: string
  accessibilityScore: number
  wcagCompliance: number
  commonIssues: string[]
  strengths: string[]
  industryRanking: number
  lastUpdated: string
}

interface CompetitiveBenchmark {
  yourSite: {
    score: number
    ranking: number
    percentile: number
    strengths: string[]
    weaknesses: string[]
  }
  industryAverage: {
    score: number
    topQuartile: number
    commonIssues: string[]
    bestPractices: string[]
  }
  competitors: Array<{
    name: string
    score: number
    ranking: number
    keyAdvantages: string[]
    opportunities: string[]
  }>
  marketPosition: 'leader' | 'above-average' | 'average' | 'below-average' | 'lagging'
  improvementOpportunity: number
  competitiveAdvantages: string[]
  actionableInsights: string[]
}

interface BenchmarkContext {
  websiteClassification: WebsiteClassification
  complianceStatus: ComplianceStatus
  currentScore: number
  competitorUrls?: string[]
  industryFocus?: string[]
}

export function generateCompetitiveBenchmark(
  context: BenchmarkContext
): CompetitiveBenchmark {
  // Get industry benchmarks
  const industryData = getIndustryBenchmarks(context.websiteClassification.type)
  
  // Calculate your site's position
  const yourSite = calculateYourSitePosition(context, industryData)
  
  // Generate industry average data
  const industryAverage = generateIndustryAverage(context.websiteClassification.type)
  
  // Generate competitor analysis (simulated data for demo)
  const competitors = generateCompetitorAnalysis(context, industryData)
  
  // Determine market position
  const marketPosition = determineMarketPosition(context.currentScore, industryData)
  
  // Calculate improvement opportunity
  const improvementOpportunity = calculateImprovementOpportunity(context.currentScore, industryData)
  
  // Generate competitive advantages
  const competitiveAdvantages = generateCompetitiveAdvantages(context, industryData)
  
  // Generate actionable insights
  const actionableInsights = generateActionableInsights(context, industryData, competitors)
  
  return {
    yourSite,
    industryAverage,
    competitors,
    marketPosition,
    improvementOpportunity,
    competitiveAdvantages,
    actionableInsights
  }
}

function getIndustryBenchmarks(websiteType: string) {
  const benchmarks = INDUSTRY_BENCHMARKS[websiteType as keyof typeof INDUSTRY_BENCHMARKS]
  
  if (!benchmarks) {
    return {
      averageScore: 75,
      topQuartile: 88,
      distribution: {
        excellent: 15,  // 90-100
        good: 25,       // 80-89
        fair: 35,       // 70-79
        poor: 25        // <70
      }
    }
  }
  
  return {
    averageScore: benchmarks.averageScore,
    topQuartile: benchmarks.topQuartile,
    distribution: {
      excellent: 15,
      good: 25,
      fair: 35,
      poor: 25
    }
  }
}

function calculateYourSitePosition(
  context: BenchmarkContext,
  industryData: any
): CompetitiveBenchmark['yourSite'] {
  const score = context.currentScore
  const averageScore = industryData.averageScore
  const topQuartile = industryData.topQuartile
  
  // Calculate ranking (percentile)
  let percentile = 50 // Default to median
  
  if (score >= topQuartile) {
    percentile = 85 + ((score - topQuartile) / (100 - topQuartile)) * 15
  } else if (score >= averageScore) {
    percentile = 50 + ((score - averageScore) / (topQuartile - averageScore)) * 35
  } else {
    percentile = 15 + ((score - 60) / (averageScore - 60)) * 35
  }
  
  percentile = Math.max(5, Math.min(95, percentile))
  
  // Calculate ranking (1-100 scale)
  const ranking = Math.round(101 - percentile)
  
  // Generate strengths and weaknesses
  const strengths = generateSiteStrengths(context)
  const weaknesses = generateSiteWeaknesses(context)
  
  return {
    score,
    ranking,
    percentile: Math.round(percentile),
    strengths,
    weaknesses
  }
}

function generateIndustryAverage(websiteType: string): CompetitiveBenchmark['industryAverage'] {
  const industryData = getIndustryBenchmarks(websiteType)
  
  const commonIssuesMap = {
    ecommerce: ['Color contrast in product images', 'Checkout form accessibility', 'Product filter navigation'],
    saas: ['Dashboard navigation', 'Complex form interactions', 'Data visualization accessibility'],
    content: ['Image alt text', 'Heading structure', 'Link context'],
    government: ['Form accessibility', 'Document accessibility', 'Multi-language support'],
    education: ['Course navigation', 'Video accessibility', 'Interactive content'],
    healthcare: ['Form privacy', 'Medical terminology', 'Patient portal accessibility'],
    finance: ['Security-focused forms', 'Data table accessibility', 'Calculator interfaces'],
    nonprofit: ['Donation forms', 'Event registration', 'Volunteer portals']
  }
  
  const bestPracticesMap = {
    ecommerce: ['Accessible product search', 'Clear checkout flow', 'Mobile-first design'],
    saas: ['Keyboard navigation', 'Screen reader support', 'Progressive enhancement'],
    content: ['Semantic HTML', 'Consistent navigation', 'Readable typography'],
    government: ['Section 508 compliance', 'Multi-modal access', 'Plain language'],
    education: ['Universal design', 'Assistive technology support', 'Inclusive content'],
    healthcare: ['HIPAA-compliant accessibility', 'Patient-centered design', 'Clear information hierarchy'],
    finance: ['Secure accessible forms', 'Clear financial data presentation', 'Multi-factor authentication accessibility'],
    nonprofit: ['Inclusive fundraising', 'Volunteer accessibility', 'Community engagement']
  }
  
  return {
    score: industryData.averageScore,
    topQuartile: industryData.topQuartile,
    commonIssues: commonIssuesMap[websiteType as keyof typeof commonIssuesMap] || ['General accessibility issues'],
    bestPractices: bestPracticesMap[websiteType as keyof typeof bestPracticesMap] || ['Standard accessibility practices']
  }
}

function generateCompetitorAnalysis(
  context: BenchmarkContext,
  industryData: any
): CompetitiveBenchmark['competitors'] {
  // In a real implementation, this would analyze actual competitor sites
  // For demo purposes, we'll generate realistic competitor data
  
  const competitorCount = 5
  const competitors = []
  
  for (let i = 0; i < competitorCount; i++) {
    const baseScore = industryData.averageScore
    const variance = 15
    const score = Math.max(60, Math.min(95, baseScore + (Math.random() - 0.5) * variance))
    
    const ranking = Math.round(101 - (score / 100) * 100)
    
    competitors.push({
      name: `Competitor ${String.fromCharCode(65 + i)}`, // A, B, C, etc.
      score: Math.round(score),
      ranking,
      keyAdvantages: generateCompetitorAdvantages(score, context.websiteClassification.type),
      opportunities: generateCompetitorOpportunities(score, context.websiteClassification.type)
    })
  }
  
  // Sort by score (highest first)
  return competitors.sort((a, b) => b.score - a.score)
}

function generateCompetitorAdvantages(score: number, websiteType: string): string[] {
  const advantagePool = {
    ecommerce: [
      'Accessible product search and filtering',
      'Clear checkout process with screen reader support',
      'Mobile-optimized shopping experience',
      'Consistent color contrast across product pages',
      'Keyboard-accessible shopping cart'
    ],
    saas: [
      'Comprehensive keyboard navigation',
      'Well-structured dashboard layout',
      'Clear form validation and error messages',
      'Accessible data visualization',
      'Consistent focus management'
    ],
    content: [
      'Proper heading hierarchy',
      'Descriptive link text',
      'Well-structured article layout',
      'Accessible image descriptions',
      'Clear content navigation'
    ],
    government: [
      'Full Section 508 compliance',
      'Multi-language accessibility support',
      'Accessible document downloads',
      'Clear service navigation',
      'Plain language content'
    ],
    education: [
      'Accessible course materials',
      'Clear learning navigation',
      'Inclusive assessment tools',
      'Video accessibility features',
      'Student portal accessibility'
    ],
    healthcare: [
      'HIPAA-compliant accessible forms',
      'Clear patient information layout',
      'Accessible appointment scheduling',
      'Medical terminology clarity',
      'Emergency information accessibility'
    ],
    finance: [
      'Secure accessible authentication',
      'Clear financial data presentation',
      'Accessible calculators and tools',
      'Consistent transaction flows',
      'Clear account navigation'
    ],
    nonprofit: [
      'Accessible donation processes',
      'Clear volunteer registration',
      'Inclusive event information',
      'Community engagement features',
      'Accessible impact reporting'
    ]
  }
  
  const advantages = advantagePool[websiteType as keyof typeof advantagePool] || advantagePool.content
  
  // Higher scores get more advantages
  const advantageCount = score > 85 ? 3 : score > 75 ? 2 : 1
  
  return advantages.slice(0, advantageCount)
}

function generateCompetitorOpportunities(score: number, websiteType: string): string[] {
  const opportunityPool = {
    ecommerce: [
      'Improve product image alt text',
      'Enhance mobile checkout accessibility',
      'Better color contrast in promotional content',
      'Improve search result navigation',
      'Enhance product comparison accessibility'
    ],
    saas: [
      'Improve complex form interactions',
      'Enhance data table accessibility',
      'Better keyboard shortcuts',
      'Improve onboarding accessibility',
      'Enhance notification accessibility'
    ],
    content: [
      'Improve video accessibility',
      'Enhance comment system accessibility',
      'Better search functionality',
      'Improve social sharing accessibility',
      'Enhance newsletter signup'
    ],
    government: [
      'Improve document accessibility',
      'Enhance public service forms',
      'Better multi-language support',
      'Improve search functionality',
      'Enhance contact accessibility'
    ],
    education: [
      'Improve online testing accessibility',
      'Enhance course video accessibility',
      'Better assignment submission',
      'Improve grade portal accessibility',
      'Enhance discussion forums'
    ],
    healthcare: [
      'Improve patient portal accessibility',
      'Enhance appointment booking',
      'Better medical form accessibility',
      'Improve prescription management',
      'Enhance telehealth accessibility'
    ],
    finance: [
      'Improve mobile banking accessibility',
      'Enhance investment tool accessibility',
      'Better loan application process',
      'Improve account statement accessibility',
      'Enhance customer service chat'
    ],
    nonprofit: [
      'Improve donation form accessibility',
      'Enhance volunteer portal',
      'Better event registration',
      'Improve newsletter accessibility',
      'Enhance community features'
    ]
  }
  
  const opportunities = opportunityPool[websiteType as keyof typeof opportunityPool] || opportunityPool.content
  
  // Lower scores get more opportunities
  const opportunityCount = score < 70 ? 3 : score < 80 ? 2 : 1
  
  return opportunities.slice(0, opportunityCount)
}

function determineMarketPosition(
  currentScore: number,
  industryData: any
): 'leader' | 'above-average' | 'average' | 'below-average' | 'lagging' {
  const averageScore = industryData.averageScore
  const topQuartile = industryData.topQuartile
  
  if (currentScore >= topQuartile + 5) return 'leader'
  if (currentScore >= topQuartile) return 'above-average'
  if (currentScore >= averageScore - 5) return 'average'
  if (currentScore >= averageScore - 15) return 'below-average'
  return 'lagging'
}

function calculateImprovementOpportunity(
  currentScore: number,
  industryData: any
): number {
  const topQuartile = industryData.topQuartile
  const maxRealistic = 95 // Realistic maximum score
  
  if (currentScore >= topQuartile) {
    return Math.round(maxRealistic - currentScore)
  } else {
    return Math.round(topQuartile - currentScore)
  }
}

function generateCompetitiveAdvantages(
  context: BenchmarkContext,
  industryData: any
): string[] {
  const advantages = []
  const score = context.currentScore
  const averageScore = industryData.averageScore
  const complianceStatus = context.complianceStatus
  
  // Score-based advantages
  if (score > averageScore + 10) {
    advantages.push('Above-average accessibility performance')
  }
  
  if (score >= industryData.topQuartile) {
    advantages.push('Top quartile accessibility ranking')
  }
  
  // Compliance-based advantages
  if (complianceStatus.wcag21AA.currentCompliance >= 90) {
    advantages.push('Strong WCAG 2.1 AA compliance')
  }
  
  if (complianceStatus.section508.governmentReadiness) {
    advantages.push('Government contract ready (Section 508)')
  }
  
  if (complianceStatus.ada.riskLevel === 'low') {
    advantages.push('Low ADA lawsuit risk')
  }
  
  // Industry-specific advantages
  const industryAdvantages = {
    ecommerce: ['Accessible checkout process', 'Mobile commerce accessibility'],
    saas: ['Dashboard accessibility', 'API documentation accessibility'],
    content: ['Content accessibility', 'SEO-friendly accessibility'],
    government: ['Public service accessibility', 'Regulatory compliance'],
    education: ['Educational content accessibility', 'Student portal accessibility'],
    healthcare: ['Patient information accessibility', 'Medical form accessibility'],
    finance: ['Financial tool accessibility', 'Security-focused accessibility'],
    nonprofit: ['Community engagement accessibility', 'Donation process accessibility']
  }
  
  const typeAdvantages = industryAdvantages[context.websiteClassification.type as keyof typeof industryAdvantages]
  if (typeAdvantages && score > averageScore) {
    advantages.push(...typeAdvantages.slice(0, 2))
  }
  
  return advantages.slice(0, 5) // Limit to top 5 advantages
}

function generateActionableInsights(
  context: BenchmarkContext,
  industryData: any,
  competitors: CompetitiveBenchmark['competitors']
): string[] {
  const insights = []
  const score = context.currentScore
  const averageScore = industryData.averageScore
  const topQuartile = industryData.topQuartile
  
  // Performance insights
  if (score < averageScore) {
    insights.push(`Improve accessibility score by ${Math.round(averageScore - score)} points to reach industry average`)
  }
  
  if (score < topQuartile) {
    insights.push(`Target ${Math.round(topQuartile - score)} point improvement to reach top quartile performance`)
  }
  
  // Competitive insights
  const topCompetitor = competitors[0]
  if (topCompetitor && score < topCompetitor.score) {
    insights.push(`Close ${topCompetitor.score - score} point gap with leading competitor`)
  }
  
  // Compliance insights
  if (context.complianceStatus.wcag21AA.currentCompliance < 90) {
    insights.push('Focus on WCAG 2.1 AA compliance to reduce legal risk')
  }
  
  if (context.complianceStatus.ada.riskLevel === 'high') {
    insights.push('Address high ADA risk violations immediately')
  }
  
  // Industry-specific insights
  const industryInsights = {
    ecommerce: ['Optimize checkout accessibility for better conversion', 'Improve product search accessibility'],
    saas: ['Enhance dashboard keyboard navigation', 'Improve complex form accessibility'],
    content: ['Focus on content structure and readability', 'Improve multimedia accessibility'],
    government: ['Ensure Section 508 compliance for contracts', 'Improve public service accessibility'],
    education: ['Enhance learning platform accessibility', 'Improve course content accessibility'],
    healthcare: ['Focus on patient portal accessibility', 'Improve medical form compliance'],
    finance: ['Enhance financial tool accessibility', 'Improve secure form accessibility'],
    nonprofit: ['Optimize donation process accessibility', 'Improve volunteer portal accessibility']
  }
  
  const typeInsights = industryInsights[context.websiteClassification.type as keyof typeof industryInsights]
  if (typeInsights) {
    insights.push(...typeInsights.slice(0, 2))
  }
  
  return insights.slice(0, 6) // Limit to top 6 insights
}

function generateSiteStrengths(context: BenchmarkContext): string[] {
  const strengths = []
  const complianceStatus = context.complianceStatus
  
  if (complianceStatus.wcag21AA.currentCompliance >= 85) {
    strengths.push('Strong WCAG 2.1 AA compliance')
  }
  
  if (complianceStatus.wcag21AA.criticalGaps === 0) {
    strengths.push('No critical accessibility gaps')
  }
  
  if (complianceStatus.section508.currentCompliance >= 90) {
    strengths.push('Excellent Section 508 compliance')
  }
  
  if (complianceStatus.ada.riskLevel === 'low') {
    strengths.push('Low legal risk profile')
  }
  
  if (complianceStatus.international.en301549 >= 85) {
    strengths.push('Strong international compliance (EU)')
  }
  
  // Industry-specific strengths
  const industryStrengths = {
    ecommerce: ['Accessible shopping experience', 'Mobile commerce accessibility'],
    saas: ['Dashboard accessibility', 'User interface consistency'],
    content: ['Content readability', 'Navigation clarity'],
    government: ['Public service accessibility', 'Regulatory compliance'],
    education: ['Learning accessibility', 'Student support'],
    healthcare: ['Patient accessibility', 'Medical compliance'],
    finance: ['Financial accessibility', 'Security compliance'],
    nonprofit: ['Community accessibility', 'Inclusive design']
  }
  
  const typeStrengths = industryStrengths[context.websiteClassification.type as keyof typeof industryStrengths]
  if (typeStrengths && context.currentScore > 75) {
    strengths.push(...typeStrengths.slice(0, 1))
  }
  
  return strengths.slice(0, 4)
}

function generateSiteWeaknesses(context: BenchmarkContext): string[] {
  const weaknesses = []
  const complianceStatus = context.complianceStatus
  
  if (complianceStatus.wcag21AA.criticalGaps > 0) {
    weaknesses.push(`${complianceStatus.wcag21AA.criticalGaps} critical accessibility gaps`)
  }
  
  if (complianceStatus.wcag21AA.currentCompliance < 70) {
    weaknesses.push('Below-average WCAG compliance')
  }
  
  if (complianceStatus.ada.riskLevel === 'high') {
    weaknesses.push('High ADA lawsuit risk')
  }
  
  if (!complianceStatus.section508.governmentReadiness) {
    weaknesses.push('Not ready for government contracts')
  }
  
  if (complianceStatus.overallRisk === 'critical' || complianceStatus.overallRisk === 'high') {
    weaknesses.push('High overall compliance risk')
  }
  
  // Top missing criteria
  if (complianceStatus.wcag21AA.missingCriteria.length > 0) {
    weaknesses.push(`Missing: ${complianceStatus.wcag21AA.missingCriteria.slice(0, 2).join(', ')}`)
  }
  
  return weaknesses.slice(0, 4)
}

export function generateBenchmarkReport(
  benchmark: CompetitiveBenchmark,
  context: BenchmarkContext
): {
  executiveSummary: string
  keyMetrics: Record<string, string | number>
  recommendations: string[]
  competitiveAnalysis: string
} {
  const executiveSummary = `Your website ranks ${benchmark.yourSite.ranking} in accessibility performance with a score of ${benchmark.yourSite.score}/100, placing you in the ${benchmark.yourSite.percentile}th percentile of ${context.websiteClassification.industry} websites. Market position: ${benchmark.marketPosition}.`
  
  const keyMetrics = {
    'Your Score': benchmark.yourSite.score,
    'Industry Average': benchmark.industryAverage.score,
    'Top Quartile': benchmark.industryAverage.topQuartile,
    'Market Position': benchmark.marketPosition,
    'Percentile Ranking': `${benchmark.yourSite.percentile}th`,
    'Improvement Opportunity': `${benchmark.improvementOpportunity} points`
  }
  
  const recommendations = [
    ...benchmark.actionableInsights.slice(0, 3),
    'Monitor competitor accessibility improvements',
    'Establish regular accessibility benchmarking',
    'Focus on industry-specific accessibility requirements'
  ]
  
  const topCompetitor = benchmark.competitors[0]
  const competitiveAnalysis = `Leading competitor scores ${topCompetitor.score}/100 with key advantages in ${topCompetitor.keyAdvantages.join(', ')}. ${benchmark.competitiveAdvantages.length > 0 ? `Your advantages include ${benchmark.competitiveAdvantages.slice(0, 2).join(' and ')}.` : 'Focus on building competitive advantages through accessibility improvements.'}`
  
  return {
    executiveSummary,
    keyMetrics,
    recommendations,
    competitiveAnalysis
  }
}

export function createBenchmarkContext(
  websiteClassification: WebsiteClassification,
  complianceStatus: ComplianceStatus,
  currentScore: number,
  competitorUrls?: string[]
): BenchmarkContext {
  return {
    websiteClassification,
    complianceStatus,
    currentScore,
    competitorUrls,
    industryFocus: [websiteClassification.type, websiteClassification.industry]
  }
} 
 
 