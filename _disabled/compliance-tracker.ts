import { 
  ComplianceStatus,
  EnhancedViolation,
  WebsiteClassification
} from './accessibility-intelligence'

interface ViolationForCompliance {
  violationId: string
  description: string
  impact: 'critical' | 'serious' | 'moderate' | 'minor'
  wcagLevel: string
  wcagCriteria: any[]
  status: 'open' | 'in_progress' | 'testing' | 'resolved'
}

interface ComplianceRule {
  id: string
  standard: 'wcag21AA' | 'section508' | 'ada' | 'en301549' | 'aoda' | 'dda'
  criterion: string
  level: 'A' | 'AA' | 'AAA'
  required: boolean
  description: string
  relatedViolations: string[]
}

export function calculateComplianceStatus(
  violations: ViolationForCompliance[],
  websiteClassification: WebsiteClassification,
  totalElementsScanned: number = 1000
): ComplianceStatus {
  const wcag21AA = calculateWCAG21AACompliance(violations, totalElementsScanned)
  const section508 = calculateSection508Compliance(violations, websiteClassification)
  const ada = calculateADACompliance(violations, websiteClassification)
  const international = calculateInternationalCompliance(violations)
  
  const overallRisk = determineOverallRisk(wcag21AA, section508, ada, websiteClassification)
  const nextAuditRecommended = calculateNextAuditDate(overallRisk, websiteClassification)
  
  return {
    wcag21AA,
    section508,
    ada,
    international,
    overallRisk,
    nextAuditRecommended
  }
}

function calculateWCAG21AACompliance(
  violations: ViolationForCompliance[],
  totalElementsScanned: number
): ComplianceStatus['wcag21AA'] {
  // Get all WCAG 2.1 AA criteria
  const wcag21AACriteria = getWCAG21AACriteria()
  
  // Count violations by WCAG level
  const aaViolations = violations.filter(v => v.wcagLevel === 'AA' && v.status === 'open')
  const criticalGaps = violations.filter(v => v.impact === 'critical' && v.wcagLevel === 'AA').length
  
  // Calculate compliance percentage
  const violatedCriteria = new Set(aaViolations.flatMap(v => v.wcagCriteria.map(c => c.id || c)))
  const totalAACriteria = wcag21AACriteria.length
  const compliantCriteria = totalAACriteria - violatedCriteria.size
  const currentCompliance = Math.round((compliantCriteria / totalAACriteria) * 100)
  
  // Identify missing criteria
  const missingCriteria = wcag21AACriteria.filter(criterion => 
    violatedCriteria.has(criterion.id)
  ).map(c => c.name)
  
  // Estimate time to compliance
  const estimatedTimeToCompliance = estimateTimeToCompliance(aaViolations)
  
  return {
    currentCompliance,
    missingCriteria,
    estimatedTimeToCompliance,
    criticalGaps
  }
}

function calculateSection508Compliance(
  violations: ViolationForCompliance[],
  websiteClassification: WebsiteClassification
): ComplianceStatus['section508'] {
  // Section 508 is largely based on WCAG 2.0 AA, but with some specific requirements
  const section508Violations = violations.filter(v => 
    isSection508Relevant(v.violationId) && v.status === 'open'
  )
  
  const totalSection508Requirements = getSection508Requirements().length
  const violatedRequirements = new Set(section508Violations.map(v => mapToSection508Requirement(v.violationId)))
  const compliantRequirements = totalSection508Requirements - violatedRequirements.size
  const currentCompliance = Math.round((compliantRequirements / totalSection508Requirements) * 100)
  
  const criticalGaps = section508Violations
    .filter(v => v.impact === 'critical' || v.impact === 'serious')
    .map(v => v.description)
  
  const governmentReadiness = currentCompliance >= 95 && criticalGaps.length === 0
  
  return {
    currentCompliance,
    criticalGaps,
    governmentReadiness
  }
}

function calculateADACompliance(
  violations: ViolationForCompliance[],
  websiteClassification: WebsiteClassification
): ComplianceStatus['ada'] {
  // ADA compliance is generally based on WCAG 2.1 AA
  const adaRelevantViolations = violations.filter(v => v.status === 'open')
  const criticalViolations = adaRelevantViolations.filter(v => v.impact === 'critical')
  const seriousViolations = adaRelevantViolations.filter(v => v.impact === 'serious')
  
  // Determine risk level
  let riskLevel: 'low' | 'medium' | 'high' = 'low'
  
  if (criticalViolations.length > 0) {
    riskLevel = 'high'
  } else if (seriousViolations.length > 3) {
    riskLevel = 'high'
  } else if (seriousViolations.length > 0 || adaRelevantViolations.length > 10) {
    riskLevel = 'medium'
  }
  
  // Industry-specific risk adjustment
  const industryRiskMultipliers = {
    government: 1.5,
    healthcare: 1.4,
    finance: 1.3,
    education: 1.2,
    ecommerce: 1.1,
    saas: 1.0,
    content: 0.9,
    nonprofit: 0.8
  }
  
  const multiplier = industryRiskMultipliers[websiteClassification.type as keyof typeof industryRiskMultipliers] || 1.0
  if (multiplier > 1.2 && riskLevel === 'medium') riskLevel = 'high'
  if (multiplier > 1.3 && riskLevel === 'low') riskLevel = 'medium'
  
  const recommendedActions = generateADARecommendations(riskLevel, adaRelevantViolations, websiteClassification)
  const legalExposure = calculateLegalExposure(riskLevel, websiteClassification)
  
  return {
    riskLevel,
    recommendedActions,
    legalExposure
  }
}

function calculateInternationalCompliance(
  violations: ViolationForCompliance[]
): ComplianceStatus['international'] {
  // EN 301 549 (EU) - Similar to WCAG 2.1 AA
  const en301549Violations = violations.filter(v => v.status === 'open')
  const en301549 = Math.max(0, 100 - (en301549Violations.length * 2))
  
  // AODA (Ontario) - Based on WCAG 2.0 AA
  const aodaViolations = violations.filter(v => v.wcagLevel === 'AA' && v.status === 'open')
  const aoda = Math.max(0, 100 - (aodaViolations.length * 2.5))
  
  // DDA (Australia) - Based on WCAG 2.1 AA
  const ddaViolations = violations.filter(v => v.status === 'open')
  const dda = Math.max(0, 100 - (ddaViolations.length * 2))
  
  return {
    en301549: Math.round(en301549),
    aoda: Math.round(aoda),
    dda: Math.round(dda)
  }
}

function determineOverallRisk(
  wcag21AA: ComplianceStatus['wcag21AA'],
  section508: ComplianceStatus['section508'],
  ada: ComplianceStatus['ada'],
  websiteClassification: WebsiteClassification
): 'low' | 'medium' | 'high' | 'critical' {
  const scores = [wcag21AA.currentCompliance, section508.currentCompliance]
  const averageCompliance = scores.reduce((a, b) => a + b, 0) / scores.length
  
  // Base risk on compliance percentage
  let risk: 'low' | 'medium' | 'high' | 'critical' = 'low'
  
  if (averageCompliance < 60) {
    risk = 'critical'
  } else if (averageCompliance < 75) {
    risk = 'high'
  } else if (averageCompliance < 90) {
    risk = 'medium'
  } else {
    risk = 'low'
  }
  
  // Adjust for ADA risk
  if (ada.riskLevel === 'high' && risk !== 'critical') {
    risk = 'high'
  } else if (ada.riskLevel === 'medium' && risk === 'low') {
    risk = 'medium'
  }
  
  // Adjust for critical gaps
  if (wcag21AA.criticalGaps > 0) {
    if (risk === 'low') risk = 'medium'
    if (risk === 'medium') risk = 'high'
  }
  
  // Industry-specific adjustments
  const highRiskIndustries = ['government', 'healthcare', 'finance', 'education']
  if (highRiskIndustries.includes(websiteClassification.type) && risk === 'low') {
    risk = 'medium'
  }
  
  return risk
}

function calculateNextAuditDate(
  overallRisk: 'low' | 'medium' | 'high' | 'critical',
  websiteClassification: WebsiteClassification
): string {
  const riskIntervals = {
    critical: 1, // 1 month
    high: 3,     // 3 months
    medium: 6,   // 6 months
    low: 12      // 12 months
  }
  
  let interval = riskIntervals[overallRisk]
  
  // Industry-specific adjustments
  const highComplianceIndustries = ['government', 'healthcare', 'finance']
  if (highComplianceIndustries.includes(websiteClassification.type)) {
    interval = Math.max(1, interval / 2) // More frequent audits
  }
  
  const nextDate = new Date()
  nextDate.setMonth(nextDate.getMonth() + interval)
  
  return nextDate.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

// Helper functions
function getWCAG21AACriteria() {
  return [
    { id: '1.1.1', name: 'Non-text Content', level: 'A' },
    { id: '1.2.1', name: 'Audio-only and Video-only (Prerecorded)', level: 'A' },
    { id: '1.2.2', name: 'Captions (Prerecorded)', level: 'A' },
    { id: '1.2.3', name: 'Audio Description or Media Alternative (Prerecorded)', level: 'A' },
    { id: '1.2.4', name: 'Captions (Live)', level: 'AA' },
    { id: '1.2.5', name: 'Audio Description (Prerecorded)', level: 'AA' },
    { id: '1.3.1', name: 'Info and Relationships', level: 'A' },
    { id: '1.3.2', name: 'Meaningful Sequence', level: 'A' },
    { id: '1.3.3', name: 'Sensory Characteristics', level: 'A' },
    { id: '1.3.4', name: 'Orientation', level: 'AA' },
    { id: '1.3.5', name: 'Identify Input Purpose', level: 'AA' },
    { id: '1.4.1', name: 'Use of Color', level: 'A' },
    { id: '1.4.2', name: 'Audio Control', level: 'A' },
    { id: '1.4.3', name: 'Contrast (Minimum)', level: 'AA' },
    { id: '1.4.4', name: 'Resize text', level: 'AA' },
    { id: '1.4.5', name: 'Images of Text', level: 'AA' },
    { id: '1.4.10', name: 'Reflow', level: 'AA' },
    { id: '1.4.11', name: 'Non-text Contrast', level: 'AA' },
    { id: '1.4.12', name: 'Text Spacing', level: 'AA' },
    { id: '1.4.13', name: 'Content on Hover or Focus', level: 'AA' },
    { id: '2.1.1', name: 'Keyboard', level: 'A' },
    { id: '2.1.2', name: 'No Keyboard Trap', level: 'A' },
    { id: '2.1.4', name: 'Character Key Shortcuts', level: 'A' },
    { id: '2.2.1', name: 'Timing Adjustable', level: 'A' },
    { id: '2.2.2', name: 'Pause, Stop, Hide', level: 'A' },
    { id: '2.3.1', name: 'Three Flashes or Below Threshold', level: 'A' },
    { id: '2.4.1', name: 'Bypass Blocks', level: 'A' },
    { id: '2.4.2', name: 'Page Titled', level: 'A' },
    { id: '2.4.3', name: 'Focus Order', level: 'A' },
    { id: '2.4.4', name: 'Link Purpose (In Context)', level: 'A' },
    { id: '2.4.5', name: 'Multiple Ways', level: 'AA' },
    { id: '2.4.6', name: 'Headings and Labels', level: 'AA' },
    { id: '2.4.7', name: 'Focus Visible', level: 'AA' },
    { id: '2.5.1', name: 'Pointer Gestures', level: 'A' },
    { id: '2.5.2', name: 'Pointer Cancellation', level: 'A' },
    { id: '2.5.3', name: 'Label in Name', level: 'A' },
    { id: '2.5.4', name: 'Motion Actuation', level: 'A' },
    { id: '3.1.1', name: 'Language of Page', level: 'A' },
    { id: '3.1.2', name: 'Language of Parts', level: 'AA' },
    { id: '3.2.1', name: 'On Focus', level: 'A' },
    { id: '3.2.2', name: 'On Input', level: 'A' },
    { id: '3.2.3', name: 'Consistent Navigation', level: 'AA' },
    { id: '3.2.4', name: 'Consistent Identification', level: 'AA' },
    { id: '3.3.1', name: 'Error Identification', level: 'A' },
    { id: '3.3.2', name: 'Labels or Instructions', level: 'A' },
    { id: '3.3.3', name: 'Error Suggestion', level: 'AA' },
    { id: '3.3.4', name: 'Error Prevention (Legal, Financial, Data)', level: 'AA' },
    { id: '4.1.1', name: 'Parsing', level: 'A' },
    { id: '4.1.2', name: 'Name, Role, Value', level: 'A' },
    { id: '4.1.3', name: 'Status Messages', level: 'AA' }
  ].filter(c => c.level === 'A' || c.level === 'AA')
}

function getSection508Requirements() {
  return [
    'Keyboard Navigation',
    'Screen Reader Compatibility',
    'Color Independence',
    'Contrast Requirements',
    'Alternative Text',
    'Form Labels',
    'Heading Structure',
    'Focus Management',
    'Error Identification',
    'Consistent Navigation',
    'Timeout Warnings',
    'Bypass Mechanisms'
  ]
}

function isSection508Relevant(violationId: string): boolean {
  const section508RelevantViolations = [
    'keyboard-navigation',
    'color-contrast',
    'alt-text',
    'form-label',
    'heading-order',
    'focus-order',
    'aria-roles',
    'link-name',
    'button-name',
    'error-message'
  ]
  
  return section508RelevantViolations.some(relevant => violationId.includes(relevant))
}

function mapToSection508Requirement(violationId: string): string {
  const mapping: Record<string, string> = {
    'keyboard': 'Keyboard Navigation',
    'color-contrast': 'Contrast Requirements',
    'alt': 'Alternative Text',
    'form-label': 'Form Labels',
    'heading': 'Heading Structure',
    'focus': 'Focus Management',
    'aria': 'Screen Reader Compatibility',
    'link': 'Screen Reader Compatibility',
    'button': 'Screen Reader Compatibility',
    'error': 'Error Identification'
  }
  
  for (const [key, requirement] of Object.entries(mapping)) {
    if (violationId.includes(key)) {
      return requirement
    }
  }
  
  return 'General Compliance'
}

function estimateTimeToCompliance(violations: ViolationForCompliance[]): string {
  const totalViolations = violations.length
  const criticalViolations = violations.filter(v => v.impact === 'critical').length
  const seriousViolations = violations.filter(v => v.impact === 'serious').length
  
  // Estimate based on violation complexity
  let estimatedWeeks = 0
  estimatedWeeks += criticalViolations * 2    // 2 weeks per critical
  estimatedWeeks += seriousViolations * 1     // 1 week per serious
  estimatedWeeks += (totalViolations - criticalViolations - seriousViolations) * 0.5 // 0.5 weeks per moderate/minor
  
  if (estimatedWeeks < 2) return '1-2 weeks'
  if (estimatedWeeks < 4) return '2-4 weeks'
  if (estimatedWeeks < 8) return '1-2 months'
  if (estimatedWeeks < 16) return '2-4 months'
  if (estimatedWeeks < 24) return '4-6 months'
  return '6+ months'
}

function generateADARecommendations(
  riskLevel: 'low' | 'medium' | 'high',
  violations: ViolationForCompliance[],
  websiteClassification: WebsiteClassification
): string[] {
  const recommendations = []
  
  if (riskLevel === 'high') {
    recommendations.push('Immediate action required - address critical violations within 30 days')
    recommendations.push('Consider engaging accessibility legal counsel')
    recommendations.push('Implement comprehensive accessibility audit')
  } else if (riskLevel === 'medium') {
    recommendations.push('Address serious violations within 60 days')
    recommendations.push('Develop accessibility remediation plan')
    recommendations.push('Conduct regular accessibility testing')
  } else {
    recommendations.push('Maintain current accessibility standards')
    recommendations.push('Schedule regular accessibility reviews')
  }
  
  // Industry-specific recommendations
  if (websiteClassification.type === 'government') {
    recommendations.push('Ensure Section 508 compliance for government contracts')
  } else if (websiteClassification.type === 'healthcare') {
    recommendations.push('Consider patient accessibility needs in design decisions')
  } else if (websiteClassification.type === 'ecommerce') {
    recommendations.push('Focus on checkout and product accessibility')
  }
  
  // Violation-specific recommendations
  if (violations.some(v => v.violationId.includes('color-contrast'))) {
    recommendations.push('Implement color contrast monitoring in design system')
  }
  
  if (violations.some(v => v.violationId.includes('keyboard'))) {
    recommendations.push('Establish keyboard navigation testing protocols')
  }
  
  return recommendations
}

function calculateLegalExposure(
  riskLevel: 'low' | 'medium' | 'high',
  websiteClassification: WebsiteClassification
): string {
  const baseExposure = {
    low: 'Minimal legal exposure with current accessibility standards',
    medium: 'Moderate legal exposure - consider proactive remediation',
    high: 'High legal exposure - immediate action recommended'
  }
  
  let exposure = baseExposure[riskLevel]
  
  // Industry-specific adjustments
  if (websiteClassification.type === 'government') {
    exposure += '. Government entities face mandatory Section 508 compliance requirements.'
  } else if (websiteClassification.type === 'healthcare') {
    exposure += '. Healthcare organizations face increased scrutiny for patient accessibility.'
  } else if (websiteClassification.type === 'ecommerce') {
    exposure += '. E-commerce sites are frequent targets for ADA lawsuits.'
  }
  
  return exposure
}

export function generateComplianceReport(
  complianceStatus: ComplianceStatus,
  websiteClassification: WebsiteClassification
): {
  executiveSummary: string
  keyFindings: string[]
  recommendations: string[]
  nextSteps: string[]
} {
  const executiveSummary = `Website accessibility compliance assessment shows ${complianceStatus.wcag21AA.currentCompliance}% WCAG 2.1 AA compliance with ${complianceStatus.overallRisk} overall risk level. ${complianceStatus.wcag21AA.criticalGaps} critical gaps identified requiring immediate attention.`
  
  const keyFindings = [
    `WCAG 2.1 AA Compliance: ${complianceStatus.wcag21AA.currentCompliance}%`,
    `Section 508 Compliance: ${complianceStatus.section508.currentCompliance}%`,
    `ADA Risk Level: ${complianceStatus.ada.riskLevel}`,
    `Critical Gaps: ${complianceStatus.wcag21AA.criticalGaps}`,
    `Government Readiness: ${complianceStatus.section508.governmentReadiness ? 'Yes' : 'No'}`
  ]
  
  const recommendations = [
    ...complianceStatus.ada.recommendedActions,
    `Focus on ${complianceStatus.wcag21AA.missingCriteria.slice(0, 3).join(', ')} criteria`,
    `Estimated time to full compliance: ${complianceStatus.wcag21AA.estimatedTimeToCompliance}`
  ]
  
  const nextSteps = [
    'Address critical violations immediately',
    'Develop systematic remediation plan',
    'Implement accessibility testing in development workflow',
    `Schedule next audit for ${complianceStatus.nextAuditRecommended}`
  ]
  
  return {
    executiveSummary,
    keyFindings,
    recommendations,
    nextSteps
  }
} 
 
 