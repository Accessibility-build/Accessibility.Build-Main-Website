import { 
  SmartPrioritization,
  WebsiteClassification,
  UserImpactAnalysis,
  TechnicalContext,
  ROI_FACTORS
} from './accessibility-intelligence'

interface ViolationForPrioritization {
  violationId: string
  description: string
  impact: 'critical' | 'serious' | 'moderate' | 'minor'
  wcagLevel: string
  wcagCriteria: any[]
  selector: string
  html: string
  userImpactAnalysis: UserImpactAnalysis
  technicalContext: TechnicalContext
}

interface PrioritizationContext {
  websiteClassification: WebsiteClassification
  totalViolations: number
  businessGoals: string[]
  timeline: 'immediate' | 'short' | 'medium' | 'long'
  resources: 'limited' | 'moderate' | 'extensive'
}

export function calculateSmartPrioritization(
  violation: ViolationForPrioritization,
  context: PrioritizationContext,
  allViolations: ViolationForPrioritization[]
): SmartPrioritization {
  // Calculate individual priority scores
  const businessPriority = calculateBusinessPriority(violation, context)
  const technicalPriority = calculateTechnicalPriority(violation, context)
  const legalRisk = calculateLegalRisk(violation, context)
  const userExperienceImpact = calculateUserExperienceImpact(violation, context)
  
  // Calculate overall priority score (weighted average)
  const overallScore = calculateOverallPriority(
    businessPriority,
    technicalPriority,
    legalRisk,
    userExperienceImpact,
    context
  )
  
  // Determine recommended order within all violations
  const recommendedOrder = calculateRecommendedOrder(violation, allViolations, overallScore)
  
  // Identify quick wins and strategic fixes
  const quickWins = isQuickWin(businessPriority, technicalPriority)
  const strategicFix = isStrategicFix(businessPriority, technicalPriority)
  
  // Generate reasoning
  const reasoning = generatePrioritizationReasoning(
    violation,
    context,
    businessPriority,
    technicalPriority,
    legalRisk,
    userExperienceImpact,
    quickWins,
    strategicFix
  )
  
  // Identify dependencies
  const dependencies = identifyDependencies(violation, allViolations)
  
  return {
    businessPriority,
    technicalPriority,
    legalRisk,
    userExperienceImpact,
    recommendedOrder,
    quickWins,
    strategicFix,
    reasoning,
    dependencies
  }
}

function calculateBusinessPriority(
  violation: ViolationForPrioritization,
  context: PrioritizationContext
): number {
  let score = 0
  
  // Base score from impact level
  const impactScores = {
    critical: 90,
    serious: 70,
    moderate: 50,
    minor: 30
  }
  score += impactScores[violation.impact]
  
  // Adjust for user percentage affected
  const userPercentage = violation.userImpactAnalysis.affectedUserPercentage
  score += Math.min(20, userPercentage)
  
  // Adjust for revenue impact
  const revenueImpact = violation.userImpactAnalysis.revenueImpact.estimatedLoss
  if (revenueImpact > 3000) score += 15
  else if (revenueImpact > 1000) score += 10
  else if (revenueImpact > 500) score += 5
  
  // Industry-specific adjustments
  const industryMultipliers = {
    government: 1.3,  // Higher compliance requirements
    healthcare: 1.25, // Critical user impact
    finance: 1.2,     // High legal risk
    education: 1.15,  // Accessibility focus
    ecommerce: 1.1,   // Revenue impact
    saas: 1.05,       // User experience focus
    content: 1.0,     // Baseline
    nonprofit: 0.95   // Resource constraints
  }
  
  const multiplier = industryMultipliers[context.websiteClassification.type as keyof typeof industryMultipliers] || 1.0
  score *= multiplier
  
  // Adjust for business severity
  const severityMultipliers = {
    critical: 1.2,
    high: 1.1,
    medium: 1.0,
    low: 0.9
  }
  score *= severityMultipliers[violation.userImpactAnalysis.severityForBusinessType]
  
  // Timeline urgency adjustment
  const timelineMultipliers = {
    immediate: 1.2,
    short: 1.1,
    medium: 1.0,
    long: 0.9
  }
  score *= timelineMultipliers[context.timeline]
  
  return Math.min(100, Math.max(1, Math.round(score)))
}

function calculateTechnicalPriority(
  violation: ViolationForPrioritization,
  context: PrioritizationContext
): number {
  let score = 50 // Base score
  
  // Complexity adjustment (inverse - easier fixes get higher priority)
  const complexityScores = {
    simple: 30,    // Easy to fix = higher priority
    moderate: 0,   // Neutral
    complex: -20   // Hard to fix = lower priority
  }
  score += complexityScores[violation.technicalContext.implementationComplexity]
  
  // Time estimate adjustment
  const timeEstimate = violation.technicalContext.estimatedFixTime
  if (timeEstimate.includes('minute') || timeEstimate.includes('30')) score += 20
  else if (timeEstimate.includes('hour') && timeEstimate.includes('1')) score += 10
  else if (timeEstimate.includes('hour') && timeEstimate.includes('2')) score += 5
  else if (timeEstimate.includes('day')) score -= 10
  else if (timeEstimate.includes('week')) score -= 20
  
  // Framework-specific considerations
  if (violation.technicalContext.frameworkSpecific) {
    score += 5 // Easier to maintain consistency
  }
  
  // Resource availability adjustment
  const resourceMultipliers = {
    limited: 0.8,    // Prefer easier fixes
    moderate: 1.0,   // Neutral
    extensive: 1.2   // Can handle complex fixes
  }
  score *= resourceMultipliers[context.resources]
  
  // Skill requirements adjustment
  const skillCount = violation.technicalContext.requiredSkills.length
  if (skillCount <= 2) score += 10
  else if (skillCount >= 4) score -= 10
  
  return Math.min(100, Math.max(1, Math.round(score)))
}

function calculateLegalRisk(
  violation: ViolationForPrioritization,
  context: PrioritizationContext
): number {
  let score = 0
  
  // Base risk from impact
  const impactRisk = {
    critical: 85,
    serious: 65,
    moderate: 40,
    minor: 20
  }
  score += impactRisk[violation.impact]
  
  // WCAG level risk
  if (violation.wcagLevel === 'AA') score += 15
  else if (violation.wcagLevel === 'AAA') score += 5
  
  // Industry-specific legal risk
  const industryRisk = {
    government: 90,   // Section 508 compliance required
    healthcare: 80,   // ADA high risk
    finance: 75,      // ADA + SOX considerations
    education: 70,    // Section 508 + ADA
    ecommerce: 65,    // ADA lawsuits common
    saas: 60,         // B2B + enterprise compliance
    content: 50,      // General ADA risk
    nonprofit: 45     // Lower lawsuit risk
  }
  
  const industryScore = industryRisk[context.websiteClassification.type as keyof typeof industryRisk] || 50
  score = Math.max(score, industryScore)
  
  // Compliance requirements boost
  const complianceRequirements = context.websiteClassification.complianceRequirements
  if (complianceRequirements.includes('Section 508')) score += 10
  if (complianceRequirements.includes('ADA')) score += 10
  if (complianceRequirements.includes('WCAG 2.1 AA')) score += 5
  
  // Target audience risk
  if (context.websiteClassification.targetAudience === 'b2c') score += 5
  else if (context.websiteClassification.targetAudience === 'mixed') score += 3
  
  return Math.min(100, Math.max(1, Math.round(score)))
}

function calculateUserExperienceImpact(
  violation: ViolationForPrioritization,
  context: PrioritizationContext
): number {
  let score = 0
  
  // Base UX impact from violation impact
  const impactScores = {
    critical: 80,
    serious: 60,
    moderate: 40,
    minor: 20
  }
  score += impactScores[violation.impact]
  
  // User percentage affected
  const userPercentage = violation.userImpactAnalysis.affectedUserPercentage
  score += Math.min(15, userPercentage)
  
  // User types impact
  const userTypes = violation.userImpactAnalysis.userTypes
  userTypes.forEach(userType => {
    if (userType.impactLevel === 'severe') score += 10
    else if (userType.impactLevel === 'high') score += 7
    else if (userType.impactLevel === 'moderate') score += 4
    else if (userType.impactLevel === 'low') score += 2
  })
  
  // Conversion impact consideration
  const conversionImpact = violation.userImpactAnalysis.revenueImpact.conversionImpact
  if (conversionImpact.includes('severe') || conversionImpact.includes('major')) score += 15
  else if (conversionImpact.includes('moderate')) score += 10
  else if (conversionImpact.includes('minor')) score += 5
  
  // Website type UX priorities
  const uxPriorities = {
    ecommerce: 1.2,   // Conversion critical
    saas: 1.15,       // User experience critical
    content: 1.1,     // Readability important
    government: 1.0,  // Compliance focus
    education: 1.05,  // Learning experience
    healthcare: 1.1,  // Critical information access
    finance: 1.05,    // Trust and usability
    nonprofit: 1.0    // Standard priority
  }
  
  const multiplier = uxPriorities[context.websiteClassification.type as keyof typeof uxPriorities] || 1.0
  score *= multiplier
  
  return Math.min(100, Math.max(1, Math.round(score)))
}

function calculateOverallPriority(
  businessPriority: number,
  technicalPriority: number,
  legalRisk: number,
  userExperienceImpact: number,
  context: PrioritizationContext
): number {
  // Default weights
  let businessWeight = 0.3
  let technicalWeight = 0.2
  let legalWeight = 0.3
  let uxWeight = 0.2
  
  // Adjust weights based on industry
  switch (context.websiteClassification.type) {
    case 'government':
      legalWeight = 0.4
      businessWeight = 0.2
      break
    case 'healthcare':
      legalWeight = 0.35
      uxWeight = 0.25
      break
    case 'ecommerce':
      businessWeight = 0.4
      uxWeight = 0.25
      break
    case 'saas':
      uxWeight = 0.3
      technicalWeight = 0.25
      break
  }
  
  // Adjust weights based on resources
  if (context.resources === 'limited') {
    technicalWeight += 0.1 // Prioritize easier fixes
    businessWeight -= 0.05
    legalWeight -= 0.05
  } else if (context.resources === 'extensive') {
    technicalWeight -= 0.1 // Can handle complex fixes
    businessWeight += 0.05
    legalWeight += 0.05
  }
  
  // Adjust weights based on timeline
  if (context.timeline === 'immediate') {
    technicalWeight += 0.15 // Need quick fixes
    legalWeight += 0.1 // Risk mitigation
    businessWeight -= 0.15
    uxWeight -= 0.1
  }
  
  const overallScore = 
    (businessPriority * businessWeight) +
    (technicalPriority * technicalWeight) +
    (legalRisk * legalWeight) +
    (userExperienceImpact * uxWeight)
  
  return Math.min(100, Math.max(1, Math.round(overallScore)))
}

function calculateRecommendedOrder(
  violation: ViolationForPrioritization,
  allViolations: ViolationForPrioritization[],
  overallScore: number
): number {
  // Sort all violations by their overall scores (descending)
  const sortedViolations = [...allViolations].sort((a, b) => {
    // This is a simplified version - in practice, you'd calculate all scores
    const aScore = getViolationScore(a)
    const bScore = getViolationScore(b)
    return bScore - aScore
  })
  
  // Find the position of current violation
  const position = sortedViolations.findIndex(v => v.violationId === violation.violationId)
  return position + 1
}

function getViolationScore(violation: ViolationForPrioritization): number {
  // Simplified scoring for sorting - in practice, use full calculation
  const impactScores = { critical: 90, serious: 70, moderate: 50, minor: 30 }
  return impactScores[violation.impact] + 
         (violation.userImpactAnalysis.affectedUserPercentage * 0.5) +
         (violation.technicalContext.implementationComplexity === 'simple' ? 20 : 0)
}

function isQuickWin(businessPriority: number, technicalPriority: number): boolean {
  // High business impact + easy to implement = quick win
  return businessPriority >= 60 && technicalPriority >= 70
}

function isStrategicFix(businessPriority: number, technicalPriority: number): boolean {
  // High business impact + complex to implement = strategic fix
  return businessPriority >= 70 && technicalPriority <= 40
}

function generatePrioritizationReasoning(
  violation: ViolationForPrioritization,
  context: PrioritizationContext,
  businessPriority: number,
  technicalPriority: number,
  legalRisk: number,
  userExperienceImpact: number,
  quickWins: boolean,
  strategicFix: boolean
): string {
  const reasons = []
  
  // Business priority reasoning
  if (businessPriority >= 80) {
    reasons.push(`High business impact (${businessPriority}/100) due to ${violation.userImpactAnalysis.affectedUserPercentage}% user impact`)
  } else if (businessPriority >= 60) {
    reasons.push(`Moderate business impact (${businessPriority}/100)`)
  } else {
    reasons.push(`Lower business priority (${businessPriority}/100)`)
  }
  
  // Technical priority reasoning
  if (technicalPriority >= 70) {
    reasons.push(`easy to implement (${violation.technicalContext.implementationComplexity} complexity)`)
  } else if (technicalPriority >= 50) {
    reasons.push(`moderate implementation effort`)
  } else {
    reasons.push(`complex implementation required`)
  }
  
  // Legal risk reasoning
  if (legalRisk >= 70) {
    reasons.push(`high legal/compliance risk for ${context.websiteClassification.industry}`)
  } else if (legalRisk >= 50) {
    reasons.push(`moderate compliance risk`)
  }
  
  // UX impact reasoning
  if (userExperienceImpact >= 70) {
    reasons.push(`significant user experience impact`)
  }
  
  // Quick win or strategic fix
  if (quickWins) {
    reasons.push(`identified as quick win - high impact, low effort`)
  } else if (strategicFix) {
    reasons.push(`strategic fix requiring planning and resources`)
  }
  
  // Industry-specific reasoning
  if (context.websiteClassification.type === 'government') {
    reasons.push(`government site requires Section 508 compliance`)
  } else if (context.websiteClassification.type === 'ecommerce') {
    reasons.push(`e-commerce site with direct revenue impact`)
  } else if (context.websiteClassification.type === 'healthcare') {
    reasons.push(`healthcare site with critical accessibility needs`)
  }
  
  return reasons.join('; ')
}

function identifyDependencies(
  violation: ViolationForPrioritization,
  allViolations: ViolationForPrioritization[]
): string[] {
  const dependencies = []
  
  // Check for common dependency patterns
  const violationId = violation.violationId
  const selector = violation.selector
  
  // Color contrast dependencies
  if (violationId === 'color-contrast') {
    const colorSchemeViolations = allViolations.filter(v => 
      v.violationId.includes('color') && v.violationId !== violationId
    )
    dependencies.push(...colorSchemeViolations.map(v => v.violationId))
  }
  
  // Form-related dependencies
  if (violationId.includes('form') || violationId.includes('label')) {
    const formViolations = allViolations.filter(v => 
      v.selector.includes('form') || v.selector.includes('input') || v.selector.includes('label')
    )
    dependencies.push(...formViolations.map(v => v.violationId))
  }
  
  // Heading structure dependencies
  if (violationId.includes('heading') || violationId.includes('h1') || violationId.includes('h2')) {
    const headingViolations = allViolations.filter(v => 
      v.violationId.includes('heading') && v.violationId !== violationId
    )
    dependencies.push(...headingViolations.map(v => v.violationId))
  }
  
  // Navigation dependencies
  if (violationId.includes('navigation') || violationId.includes('menu')) {
    const navViolations = allViolations.filter(v => 
      v.selector.includes('nav') || v.selector.includes('menu')
    )
    dependencies.push(...navViolations.map(v => v.violationId))
  }
  
  // Remove duplicates and self-references
  return [...new Set(dependencies)].filter(dep => dep !== violationId)
}

export function prioritizeViolations(
  violations: ViolationForPrioritization[],
  context: PrioritizationContext
): Array<ViolationForPrioritization & { prioritization: SmartPrioritization }> {
  return violations.map(violation => ({
    ...violation,
    prioritization: calculateSmartPrioritization(violation, context, violations)
  })).sort((a, b) => {
    // Sort by recommended order
    return a.prioritization.recommendedOrder - b.prioritization.recommendedOrder
  })
}

export function getQuickWins(
  violations: Array<ViolationForPrioritization & { prioritization: SmartPrioritization }>
): Array<ViolationForPrioritization & { prioritization: SmartPrioritization }> {
  return violations.filter(v => v.prioritization.quickWins)
}

export function getStrategicFixes(
  violations: Array<ViolationForPrioritization & { prioritization: SmartPrioritization }>
): Array<ViolationForPrioritization & { prioritization: SmartPrioritization }> {
  return violations.filter(v => v.prioritization.strategicFix)
}

export function createPrioritizationContext(
  websiteClassification: WebsiteClassification,
  totalViolations: number,
  userPreferences?: {
    timeline?: 'immediate' | 'short' | 'medium' | 'long'
    resources?: 'limited' | 'moderate' | 'extensive'
    businessGoals?: string[]
  }
): PrioritizationContext {
  return {
    websiteClassification,
    totalViolations,
    businessGoals: userPreferences?.businessGoals || ['compliance', 'user-experience'],
    timeline: userPreferences?.timeline || 'medium',
    resources: userPreferences?.resources || 'moderate'
  }
} 
 
 