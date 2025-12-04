export interface RiskAssessmentData {
  industryType: 'government' | 'healthcare' | 'finance' | 'education' | 'ecommerce' | 'saas' | 'content' | 'nonprofit' | 'other'
  websiteType: 'ecommerce' | 'saas' | 'content' | 'government' | 'healthcare' | 'education' | 'other'
  currentWCAGLevel: 'none' | 'A' | 'AA' | 'AAA'
  knownViolations: {
    critical: number
    serious: number
    moderate: number
    minor: number
  }
  trafficVolume: 'low' | 'medium' | 'high' | 'very-high'
  geographicLocation: 'us' | 'eu' | 'canada' | 'australia' | 'global'
  hasAccessibilityStatement: boolean
  hasComplianceProgram: boolean
  lastAuditDate?: string
}

export interface RiskAssessmentResult {
  legalExposureScore: number // 0-100
  financialRiskEstimate: {
    low: number
    high: number
    currency: string
  }
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  priorityViolations: string[]
  immediateActions: string[]
  shortTermFixes: string[]
  longTermImprovements: string[]
  complianceRoadmap: Array<{
    phase: string
    duration: string
    actions: string[]
    priority: 'high' | 'medium' | 'low'
  }>
  industrySpecificRisks: string[]
}

const industryRiskMultipliers: Record<string, number> = {
  government: 1.5,
  healthcare: 1.4,
  finance: 1.3,
  education: 1.2,
  ecommerce: 1.1,
  saas: 1.0,
  content: 0.9,
  nonprofit: 0.8,
  other: 1.0
}

const trafficRiskMultipliers: Record<string, number> = {
  'low': 0.8,
  'medium': 1.0,
  'high': 1.3,
  'very-high': 1.5
}

const locationRiskMultipliers: Record<string, number> = {
  'us': 1.2, // ADA enforcement
  'eu': 1.1, // EN 301 549
  'canada': 1.1, // AODA
  'australia': 1.0, // DDA
  'global': 1.3 // Multiple jurisdictions
}

export function calculateADARisk(data: RiskAssessmentData): RiskAssessmentResult {
  // Base risk score from violations
  let baseScore = 0
  
  baseScore += data.knownViolations.critical * 25
  baseScore += data.knownViolations.serious * 15
  baseScore += data.knownViolations.moderate * 5
  baseScore += data.knownViolations.minor * 1

  // WCAG level adjustment
  const wcagAdjustments: Record<string, number> = {
    'none': 30,
    'A': 15,
    'AA': 0,
    'AAA': -10
  }
  baseScore += wcagAdjustments[data.currentWCAGLevel] || 0

  // Apply multipliers
  const industryMultiplier = industryRiskMultipliers[data.industryType] || 1.0
  const trafficMultiplier = trafficRiskMultipliers[data.trafficVolume] || 1.0
  const locationMultiplier = locationRiskMultipliers[data.geographicLocation] || 1.0

  let adjustedScore = baseScore * industryMultiplier * trafficMultiplier * locationMultiplier

  // Mitigation factors
  if (data.hasAccessibilityStatement) adjustedScore -= 5
  if (data.hasComplianceProgram) adjustedScore -= 10
  if (data.lastAuditDate) {
    const daysSinceAudit = Math.floor((Date.now() - new Date(data.lastAuditDate).getTime()) / (1000 * 60 * 60 * 24))
    if (daysSinceAudit < 90) adjustedScore -= 5
    else if (daysSinceAudit > 365) adjustedScore += 10
  }

  // Clamp score to 0-100
  const legalExposureScore = Math.min(100, Math.max(0, Math.round(adjustedScore)))

  // Determine risk level
  let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low'
  if (legalExposureScore >= 75) riskLevel = 'critical'
  else if (legalExposureScore >= 50) riskLevel = 'high'
  else if (legalExposureScore >= 25) riskLevel = 'medium'

  // Financial risk estimate (based on industry and risk level)
  const baseFinancialRisk: Record<string, { low: number; high: number }> = {
    'government': { low: 50000, high: 500000 },
    'healthcare': { low: 75000, high: 750000 },
    'finance': { low: 100000, high: 1000000 },
    'education': { low: 50000, high: 500000 },
    'ecommerce': { low: 25000, high: 250000 },
    'saas': { low: 50000, high: 500000 },
    'content': { low: 10000, high: 100000 },
    'nonprofit': { low: 5000, high: 50000 },
    'other': { low: 25000, high: 250000 }
  }

  const baseFinancial = baseFinancialRisk[data.industryType] || baseFinancialRisk.other
  const riskMultiplier = {
    'low': 0.5,
    'medium': 1.0,
    'high': 2.0,
    'critical': 4.0
  }[riskLevel]

  const financialRiskEstimate = {
    low: Math.round(baseFinancial.low * riskMultiplier),
    high: Math.round(baseFinancial.high * riskMultiplier),
    currency: 'USD'
  }

  // Generate recommendations
  const immediateActions = generateImmediateActions(data, riskLevel)
  const shortTermFixes = generateShortTermFixes(data)
  const longTermImprovements = generateLongTermImprovements(data)
  const priorityViolations = generatePriorityViolations(data)
  const complianceRoadmap = generateComplianceRoadmap(data, riskLevel)
  const industrySpecificRisks = generateIndustrySpecificRisks(data)

  return {
    legalExposureScore,
    financialRiskEstimate,
    riskLevel,
    priorityViolations,
    immediateActions,
    shortTermFixes,
    longTermImprovements,
    complianceRoadmap,
    industrySpecificRisks
  }
}

function generateImmediateActions(data: RiskAssessmentData, riskLevel: string): string[] {
  const actions: string[] = []
  
  if (data.knownViolations.critical > 0) {
    actions.push(`Address ${data.knownViolations.critical} critical violation(s) immediately`)
  }
  if (data.knownViolations.serious > 3) {
    actions.push(`Prioritize fixing ${data.knownViolations.serious} serious violations`)
  }
  if (!data.hasAccessibilityStatement) {
    actions.push('Create and publish an accessibility statement')
  }
  if (riskLevel === 'critical' || riskLevel === 'high') {
    actions.push('Consult with legal counsel about ADA compliance requirements')
    actions.push('Implement emergency accessibility fixes for critical barriers')
  }
  if (data.currentWCAGLevel === 'none' || data.currentWCAGLevel === 'A') {
    actions.push('Begin WCAG 2.2 Level AA compliance program')
  }

  return actions
}

function generateShortTermFixes(data: RiskAssessmentData): string[] {
  const fixes: string[] = []
  
  fixes.push('Conduct comprehensive accessibility audit')
  fixes.push('Fix all Level AA violations within 90 days')
  fixes.push('Implement automated accessibility testing in CI/CD pipeline')
  fixes.push('Train development team on WCAG 2.2 requirements')
  fixes.push('Establish accessibility testing procedures')
  
  if (!data.hasComplianceProgram) {
    fixes.push('Create accessibility compliance program and policies')
  }

  return fixes
}

function generateLongTermImprovements(data: RiskAssessmentData): string[] {
  const improvements: string[] = []
  
  improvements.push('Achieve and maintain WCAG 2.2 Level AA conformance')
  improvements.push('Implement regular accessibility audits (quarterly)')
  improvements.push('Include accessibility in design and development processes')
  improvements.push('Conduct user testing with people with disabilities')
  improvements.push('Maintain accessibility documentation and training programs')
  improvements.push('Monitor and respond to accessibility feedback')

  return improvements
}

function generatePriorityViolations(data: RiskAssessmentData): string[] {
  const violations: string[] = []
  
  if (data.knownViolations.critical > 0) {
    violations.push('Critical: Missing alt text on images')
    violations.push('Critical: Keyboard navigation barriers')
    violations.push('Critical: Missing form labels')
  }
  if (data.knownViolations.serious > 0) {
    violations.push('Serious: Color contrast issues (WCAG 1.4.3)')
    violations.push('Serious: Missing ARIA labels')
    violations.push('Serious: Focus management issues')
  }
  if (data.knownViolations.moderate > 0) {
    violations.push('Moderate: Heading structure issues')
    violations.push('Moderate: Link purpose clarity')
  }

  return violations.slice(0, 5)
}

function generateComplianceRoadmap(data: RiskAssessmentData, riskLevel: string): Array<{
  phase: string
  duration: string
  actions: string[]
  priority: 'high' | 'medium' | 'low'
}> {
  const roadmap = []

  if (riskLevel === 'critical' || riskLevel === 'high') {
    roadmap.push({
      phase: 'Emergency Response',
      duration: '1-2 weeks',
      actions: [
        'Fix all critical violations',
        'Publish accessibility statement',
        'Legal consultation'
      ],
      priority: 'high' as const
    })
  }

  roadmap.push({
    phase: 'Initial Compliance',
    duration: '3-6 months',
    actions: [
      'Complete WCAG 2.2 Level AA audit',
      'Fix all Level AA violations',
      'Implement automated testing',
      'Train development team'
    ],
    priority: 'high' as const
  })

  roadmap.push({
    phase: 'Ongoing Maintenance',
    duration: 'Ongoing',
    actions: [
      'Quarterly accessibility audits',
      'Monitor and fix new violations',
      'User testing with disabled users',
      'Continuous improvement program'
    ],
    priority: 'medium' as const
  })

  return roadmap
}

function generateIndustrySpecificRisks(data: RiskAssessmentData): string[] {
  const risks: string[] = []

  switch (data.industryType) {
    case 'government':
      risks.push('Section 508 compliance required for federal agencies')
      risks.push('Higher scrutiny from accessibility advocates')
      risks.push('Potential loss of federal contracts')
      break
    case 'healthcare':
      risks.push('ADA Title III applies to healthcare websites')
      risks.push('Patient access requirements')
      risks.push('Regulatory compliance issues')
      break
    case 'finance':
      risks.push('ADA compliance required for financial services')
      risks.push('Regulatory oversight (CFPB, SEC)')
      risks.push('Customer discrimination claims')
      break
    case 'education':
      risks.push('Section 504 and ADA requirements')
      risks.push('Student accommodation requirements')
      risks.push('Federal funding at risk')
      break
    case 'ecommerce':
      risks.push('High volume of ADA website lawsuits')
      risks.push('Customer discrimination claims')
      risks.push('Lost revenue from inaccessible checkout')
      break
    default:
      risks.push('General ADA compliance requirements')
      risks.push('Potential legal action from users with disabilities')
  }

  return risks
}

