import { 
  ImprovementRoadmap,
  ImprovementPhase,
  WebsiteClassification,
  SmartPrioritization,
  AccessibilityROI,
  ComplianceStatus
} from './accessibility-intelligence'

interface ViolationForRoadmap {
  violationId: string
  description: string
  impact: 'critical' | 'serious' | 'moderate' | 'minor'
  wcagLevel: string
  smartPrioritization: SmartPrioritization
  roiAnalysis: AccessibilityROI
  status: 'open' | 'in_progress' | 'testing' | 'resolved'
}

interface RoadmapContext {
  websiteClassification: WebsiteClassification
  complianceStatus: ComplianceStatus
  businessGoals: string[]
  timeline: 'aggressive' | 'moderate' | 'conservative'
  budget: number
  teamSize: number
  currentScore: number
  targetScore: number
}

export function generateImprovementRoadmap(
  violations: ViolationForRoadmap[],
  context: RoadmapContext
): ImprovementRoadmap {
  // Filter open violations and sort by priority
  const openViolations = violations.filter(v => v.status === 'open')
  const sortedViolations = openViolations.sort((a, b) => 
    a.smartPrioritization.recommendedOrder - b.smartPrioritization.recommendedOrder
  )
  
  // Generate phases based on priority and constraints
  const phases = generatePhases(sortedViolations, context)
  
  // Identify quick wins
  const quickWins = identifyQuickWins(sortedViolations, context)
  
  // Identify strategic initiatives
  const strategicInitiatives = identifyStrategicInitiatives(sortedViolations, context)
  
  // Calculate totals
  const totalTimeToCompliance = calculateTotalTimeToCompliance(phases)
  const totalInvestment = phases.reduce((sum, phase) => sum + phase.cost, 0)
  const totalROI = phases.reduce((sum, phase) => sum + (phase.cost * phase.roi / 100), 0)
  
  return {
    phases,
    quickWins,
    strategicInitiatives,
    totalTimeToCompliance,
    totalInvestment,
    totalROI: Math.round(totalROI)
  }
}

function generatePhases(
  violations: ViolationForRoadmap[],
  context: RoadmapContext
): ImprovementPhase[] {
  const phases: ImprovementPhase[] = []
  
  // Phase 1: Critical Issues (Immediate - 0-4 weeks)
  const criticalViolations = violations.filter(v => 
    v.impact === 'critical' || v.smartPrioritization.quickWins
  )
  
  if (criticalViolations.length > 0) {
    phases.push(createPhase(
      'Critical Issues & Quick Wins',
      '2-4 weeks',
      'high',
      criticalViolations,
      context,
      1
    ))
  }
  
  // Phase 2: High Priority Issues (Short term - 1-3 months)
  const highPriorityViolations = violations.filter(v => 
    v.impact === 'serious' && 
    !criticalViolations.includes(v) &&
    v.smartPrioritization.businessPriority >= 70
  )
  
  if (highPriorityViolations.length > 0) {
    phases.push(createPhase(
      'High Priority Fixes',
      '4-8 weeks',
      'high',
      highPriorityViolations,
      context,
      2
    ))
  }
  
  // Phase 3: Strategic Improvements (Medium term - 3-6 months)
  const strategicViolations = violations.filter(v => 
    v.smartPrioritization.strategicFix && 
    !criticalViolations.includes(v) &&
    !highPriorityViolations.includes(v)
  )
  
  if (strategicViolations.length > 0) {
    phases.push(createPhase(
      'Strategic Improvements',
      '8-16 weeks',
      'medium',
      strategicViolations,
      context,
      3
    ))
  }
  
  // Phase 4: Remaining Issues (Long term - 6+ months)
  const remainingViolations = violations.filter(v => 
    !criticalViolations.includes(v) &&
    !highPriorityViolations.includes(v) &&
    !strategicViolations.includes(v)
  )
  
  if (remainingViolations.length > 0) {
    phases.push(createPhase(
      'Comprehensive Compliance',
      '12-24 weeks',
      'low',
      remainingViolations,
      context,
      4
    ))
  }
  
  return phases
}

function createPhase(
  name: string,
  duration: string,
  effort: 'low' | 'medium' | 'high',
  violations: ViolationForRoadmap[],
  context: RoadmapContext,
  priority: number
): ImprovementPhase {
  const violationIds = violations.map(v => v.violationId)
  
  // Calculate expected score improvement
  const impactWeights = { critical: 8, serious: 5, moderate: 3, minor: 1 }
  const totalImpactPoints = violations.reduce((sum, v) => sum + impactWeights[v.impact], 0)
  const expectedScoreImprovement = Math.min(30, Math.round(totalImpactPoints * 0.5))
  
  // Calculate business impact
  const businessImpact = calculatePhaseBusinessImpact(violations, context)
  
  // Identify dependencies
  const dependencies = identifyPhaseDependencies(violations, context)
  
  // Calculate cost
  const cost = violations.reduce((sum, v) => sum + v.roiAnalysis.fixCosts.estimatedCost, 0)
  
  // Calculate ROI
  const totalBenefit = violations.reduce((sum, v) => {
    const roi = v.roiAnalysis
    return sum + roi.benefits.marketExpansion.revenueOpportunity + 
           roi.benefits.seoImpact.conversionImprovement +
           roi.benefits.operationalEfficiency.supportTicketReduction
  }, 0)
  
  const roi = cost > 0 ? Math.round(((totalBenefit - cost) / cost) * 100) : 0
  
  return {
    name,
    duration,
    effort,
    violations: violationIds,
    expectedScoreImprovement,
    businessImpact,
    dependencies,
    cost: Math.round(cost),
    roi,
    priority
  }
}

function identifyQuickWins(
  violations: ViolationForRoadmap[],
  context: RoadmapContext
): ImprovementRoadmap['quickWins'] {
  const quickWinViolations = violations.filter(v => v.smartPrioritization.quickWins)
  
  return quickWinViolations.slice(0, 8).map(violation => ({
    violation: violation.violationId,
    fixTime: violation.roiAnalysis.fixCosts.developerHours <= 2 ? 
      `${violation.roiAnalysis.fixCosts.developerHours} hours` : 
      `${Math.round(violation.roiAnalysis.fixCosts.developerHours / 8)} days`,
    impact: `${violation.smartPrioritization.businessPriority}/100 business impact`,
    instructions: generateQuickWinInstructions(violation),
    codeExample: generateQuickWinCodeExample(violation),
    businessValue: generateQuickWinBusinessValue(violation, context)
  }))
}

function identifyStrategicInitiatives(
  violations: ViolationForRoadmap[],
  context: RoadmapContext
): ImprovementRoadmap['strategicInitiatives'] {
  const strategicViolations = violations.filter(v => v.smartPrioritization.strategicFix)
  
  // Group by category
  const categories = groupViolationsByCategory(strategicViolations)
  
  return Object.entries(categories).map(([category, categoryViolations]) => ({
    category,
    description: generateCategoryDescription(category, categoryViolations),
    longTermBenefit: generateLongTermBenefit(category, categoryViolations, context),
    requiredResources: generateRequiredResources(category, categoryViolations),
    timeline: estimateCategoryTimeline(categoryViolations),
    roi: calculateCategoryROI(categoryViolations)
  }))
}

function calculatePhaseBusinessImpact(
  violations: ViolationForRoadmap[],
  context: RoadmapContext
): string {
  const totalUsers = violations.reduce((sum, v) => 
    sum + v.roiAnalysis.benefits.marketExpansion.additionalUsers, 0
  )
  
  const totalRevenue = violations.reduce((sum, v) => 
    sum + v.roiAnalysis.benefits.marketExpansion.revenueOpportunity, 0
  )
  
  const complianceImprovement = Math.min(25, violations.length * 2)
  
  return `Improves accessibility for ${totalUsers.toLocaleString()} users, ` +
         `potential revenue impact of $${totalRevenue.toLocaleString()}, ` +
         `${complianceImprovement}% compliance improvement`
}

function identifyPhaseDependencies(
  violations: ViolationForRoadmap[],
  context: RoadmapContext
): string[] {
  const dependencies = new Set<string>()
  
  // Check for common dependencies
  const hasFormViolations = violations.some(v => v.violationId.includes('form'))
  const hasColorViolations = violations.some(v => v.violationId.includes('color'))
  const hasNavigationViolations = violations.some(v => v.violationId.includes('navigation'))
  
  if (hasFormViolations) {
    dependencies.add('Form accessibility framework implementation')
  }
  
  if (hasColorViolations) {
    dependencies.add('Design system color palette update')
  }
  
  if (hasNavigationViolations) {
    dependencies.add('Navigation structure redesign')
  }
  
  // Check for technical dependencies
  const hasAriaViolations = violations.some(v => v.violationId.includes('aria'))
  if (hasAriaViolations) {
    dependencies.add('ARIA implementation guidelines')
  }
  
  return Array.from(dependencies)
}

function generateQuickWinInstructions(violation: ViolationForRoadmap): string {
  const instructionMap: Record<string, string> = {
    'color-contrast': 'Update color values to meet WCAG AA contrast ratio of 4.5:1 for normal text',
    'alt-text': 'Add descriptive alt text to images describing their content and purpose',
    'form-label': 'Associate form inputs with descriptive labels using <label> elements',
    'heading-order': 'Ensure headings follow logical hierarchy (h1 → h2 → h3)',
    'link-name': 'Provide descriptive link text that explains the destination or purpose',
    'button-name': 'Ensure buttons have accessible names via text content or aria-label',
    'focus-visible': 'Add visible focus indicators using CSS :focus-visible pseudo-class'
  }
  
  // Find matching instruction
  for (const [key, instruction] of Object.entries(instructionMap)) {
    if (violation.violationId.includes(key)) {
      return instruction
    }
  }
  
  return 'Review WCAG guidelines and implement appropriate accessibility fix'
}

function generateQuickWinCodeExample(violation: ViolationForRoadmap): string {
  const codeExamples: Record<string, string> = {
    'color-contrast': `/* Before */
.button { color: #999; background: #fff; }

/* After */
.button { color: #666; background: #fff; }`,
    
    'alt-text': `<!-- Before -->
<img src="chart.png">

<!-- After -->
<img src="chart.png" alt="Sales increased 25% from Q1 to Q2">`,
    
    'form-label': `<!-- Before -->
<input type="email" placeholder="Email">

<!-- After -->
<label for="email">Email Address</label>
<input type="email" id="email" placeholder="Email">`,
    
    'heading-order': `<!-- Before -->
<h1>Page Title</h1>
<h3>Section Title</h3>

<!-- After -->
<h1>Page Title</h1>
<h2>Section Title</h2>`,
    
    'link-name': `<!-- Before -->
<a href="/products">Click here</a>

<!-- After -->
<a href="/products">View our products</a>`,
    
    'button-name': `<!-- Before -->
<button><i class="icon-save"></i></button>

<!-- After -->
<button aria-label="Save document">
  <i class="icon-save"></i>
</button>`,
    
    'focus-visible': `/* CSS */
button:focus-visible {
  outline: 2px solid #0066cc;
  outline-offset: 2px;
}`
  }
  
  // Find matching example
  for (const [key, example] of Object.entries(codeExamples)) {
    if (violation.violationId.includes(key)) {
      return example
    }
  }
  
  return '// Implement accessibility fix according to WCAG guidelines'
}

function generateQuickWinBusinessValue(
  violation: ViolationForRoadmap,
  context: RoadmapContext
): string {
  const roi = violation.roiAnalysis
  const userImpact = roi.benefits.marketExpansion.additionalUsers
  const revenueOpportunity = roi.benefits.marketExpansion.revenueOpportunity
  
  if (revenueOpportunity > 10000) {
    return `High value: ${userImpact.toLocaleString()} users, $${revenueOpportunity.toLocaleString()} revenue opportunity`
  } else if (revenueOpportunity > 5000) {
    return `Medium value: ${userImpact.toLocaleString()} users, $${revenueOpportunity.toLocaleString()} revenue opportunity`
  } else {
    return `Compliance value: Improves accessibility for ${userImpact.toLocaleString()} users`
  }
}

function groupViolationsByCategory(violations: ViolationForRoadmap[]): Record<string, ViolationForRoadmap[]> {
  const categories: Record<string, ViolationForRoadmap[]> = {}
  
  violations.forEach(violation => {
    let category = 'General Accessibility'
    
    if (violation.violationId.includes('color') || violation.violationId.includes('contrast')) {
      category = 'Visual Design & Color'
    } else if (violation.violationId.includes('form') || violation.violationId.includes('input')) {
      category = 'Forms & Input'
    } else if (violation.violationId.includes('navigation') || violation.violationId.includes('menu')) {
      category = 'Navigation & Structure'
    } else if (violation.violationId.includes('aria') || violation.violationId.includes('role')) {
      category = 'ARIA & Semantics'
    } else if (violation.violationId.includes('keyboard') || violation.violationId.includes('focus')) {
      category = 'Keyboard & Focus'
    } else if (violation.violationId.includes('heading') || violation.violationId.includes('landmark')) {
      category = 'Content Structure'
    }
    
    if (!categories[category]) {
      categories[category] = []
    }
    categories[category].push(violation)
  })
  
  return categories
}

function generateCategoryDescription(
  category: string,
  violations: ViolationForRoadmap[]
): string {
  const descriptions: Record<string, string> = {
    'Visual Design & Color': 'Comprehensive color accessibility including contrast ratios, color independence, and visual indicators',
    'Forms & Input': 'Complete form accessibility including labels, validation, error handling, and input assistance',
    'Navigation & Structure': 'Site-wide navigation improvements including skip links, breadcrumbs, and consistent navigation patterns',
    'ARIA & Semantics': 'Advanced ARIA implementation for complex interactive components and dynamic content',
    'Keyboard & Focus': 'Comprehensive keyboard navigation and focus management across all interactive elements',
    'Content Structure': 'Semantic HTML structure including proper heading hierarchy and landmark regions',
    'General Accessibility': 'Foundational accessibility improvements across multiple areas'
  }
  
  return descriptions[category] || 'Accessibility improvements in this category'
}

function generateLongTermBenefit(
  category: string,
  violations: ViolationForRoadmap[],
  context: RoadmapContext
): string {
  const benefits: Record<string, string> = {
    'Visual Design & Color': 'Establishes accessible design system that prevents future color accessibility issues and improves brand consistency',
    'Forms & Input': 'Creates reusable form components that improve conversion rates and reduce user support requests',
    'Navigation & Structure': 'Improves overall site usability and SEO performance through better content structure',
    'ARIA & Semantics': 'Enables rich interactive experiences that work for all users including assistive technology users',
    'Keyboard & Focus': 'Ensures full keyboard accessibility enabling power users and assistive technology users',
    'Content Structure': 'Improves content discoverability and SEO through proper semantic markup',
    'General Accessibility': 'Establishes foundation for long-term accessibility compliance and inclusive design'
  }
  
  const totalRevenue = violations.reduce((sum, v) => 
    sum + v.roiAnalysis.benefits.marketExpansion.revenueOpportunity, 0
  )
  
  let benefit = benefits[category] || 'Long-term accessibility and compliance benefits'
  
  if (totalRevenue > 50000) {
    benefit += ` with significant revenue potential ($${totalRevenue.toLocaleString()})`
  }
  
  return benefit
}

function generateRequiredResources(
  category: string,
  violations: ViolationForRoadmap[]
): string[] {
  const baseResources = ['Frontend Developer', 'Accessibility Specialist']
  
  const resourceMap: Record<string, string[]> = {
    'Visual Design & Color': [...baseResources, 'UI/UX Designer', 'Design System Manager'],
    'Forms & Input': [...baseResources, 'UX Designer', 'QA Engineer'],
    'Navigation & Structure': [...baseResources, 'Information Architect', 'UX Designer'],
    'ARIA & Semantics': [...baseResources, 'Senior Frontend Developer', 'Accessibility Expert'],
    'Keyboard & Focus': [...baseResources, 'Interaction Designer'],
    'Content Structure': [...baseResources, 'Content Strategist', 'SEO Specialist'],
    'General Accessibility': baseResources
  }
  
  return resourceMap[category] || baseResources
}

function estimateCategoryTimeline(violations: ViolationForRoadmap[]): string {
  const totalHours = violations.reduce((sum, v) => sum + v.roiAnalysis.fixCosts.developerHours, 0)
  const weeks = Math.ceil(totalHours / 40) // 40 hours per week
  
  if (weeks <= 2) return '1-2 weeks'
  if (weeks <= 4) return '2-4 weeks'
  if (weeks <= 8) return '1-2 months'
  if (weeks <= 16) return '2-4 months'
  return '4+ months'
}

function calculateCategoryROI(violations: ViolationForRoadmap[]): number {
  const totalCost = violations.reduce((sum, v) => sum + v.roiAnalysis.fixCosts.estimatedCost, 0)
  const totalBenefit = violations.reduce((sum, v) => {
    const roi = v.roiAnalysis
    return sum + roi.benefits.marketExpansion.revenueOpportunity + 
           roi.benefits.seoImpact.conversionImprovement +
           roi.benefits.operationalEfficiency.supportTicketReduction
  }, 0)
  
  return totalCost > 0 ? Math.round(((totalBenefit - totalCost) / totalCost) * 100) : 0
}

function calculateTotalTimeToCompliance(phases: ImprovementPhase[]): string {
  if (phases.length === 0) return 'Already compliant'
  
  // Parse duration and calculate total weeks
  let totalWeeks = 0
  
  phases.forEach(phase => {
    const duration = phase.duration
    if (duration.includes('week')) {
      const weeks = parseInt(duration.split('-')[1] || duration.split(' ')[0])
      totalWeeks += weeks
    } else if (duration.includes('month')) {
      const months = parseInt(duration.split('-')[1] || duration.split(' ')[0])
      totalWeeks += months * 4
    }
  })
  
  // Account for parallel work (reduce by 20%)
  totalWeeks = Math.round(totalWeeks * 0.8)
  
  if (totalWeeks <= 4) return '3-4 weeks'
  if (totalWeeks <= 8) return '6-8 weeks'
  if (totalWeeks <= 16) return '3-4 months'
  if (totalWeeks <= 24) return '4-6 months'
  if (totalWeeks <= 48) return '6-12 months'
  return '12+ months'
}

export function createRoadmapContext(
  websiteClassification: WebsiteClassification,
  complianceStatus: ComplianceStatus,
  userPreferences: {
    businessGoals?: string[]
    timeline?: 'aggressive' | 'moderate' | 'conservative'
    budget?: number
    teamSize?: number
    currentScore?: number
    targetScore?: number
  } = {}
): RoadmapContext {
  return {
    websiteClassification,
    complianceStatus,
    businessGoals: userPreferences.businessGoals || ['compliance', 'user-experience'],
    timeline: userPreferences.timeline || 'moderate',
    budget: userPreferences.budget || 50000,
    teamSize: userPreferences.teamSize || 3,
    currentScore: userPreferences.currentScore || complianceStatus.wcag21AA.currentCompliance,
    targetScore: userPreferences.targetScore || 95
  }
}

export function generateRoadmapSummary(roadmap: ImprovementRoadmap): {
  overview: string
  keyMetrics: Record<string, string | number>
  recommendations: string[]
} {
  const overview = `Comprehensive accessibility improvement plan with ${roadmap.phases.length} phases over ${roadmap.totalTimeToCompliance}. Total investment of $${roadmap.totalInvestment.toLocaleString()} with projected ROI of ${roadmap.totalROI}%.`
  
  const keyMetrics = {
    'Total Phases': roadmap.phases.length,
    'Quick Wins': roadmap.quickWins.length,
    'Strategic Initiatives': roadmap.strategicInitiatives.length,
    'Timeline': roadmap.totalTimeToCompliance,
    'Investment': `$${roadmap.totalInvestment.toLocaleString()}`,
    'Projected ROI': `${roadmap.totalROI}%`
  }
  
  const recommendations = [
    'Start with quick wins to build momentum and demonstrate early value',
    'Run phases in parallel where possible to accelerate timeline',
    'Establish accessibility testing processes early to prevent regression',
    'Consider training team members on accessibility best practices',
    'Monitor progress with regular accessibility audits'
  ]
  
  return {
    overview,
    keyMetrics,
    recommendations
  }
} 
 
 