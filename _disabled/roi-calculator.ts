import { 
  AccessibilityROI,
  WebsiteClassification,
  UserImpactAnalysis,
  TechnicalContext,
  ROI_FACTORS
} from './accessibility-intelligence'

interface ViolationForROI {
  violationId: string
  description: string
  impact: 'critical' | 'serious' | 'moderate' | 'minor'
  wcagLevel: string
  userImpactAnalysis: UserImpactAnalysis
  technicalContext: TechnicalContext
}

interface BusinessContext {
  websiteClassification: WebsiteClassification
  monthlyTraffic: number
  averageOrderValue?: number
  conversionRate?: number
  annualRevenue?: number
  employeeCount?: number
  industryRisk: 'low' | 'medium' | 'high'
}

export function calculateAccessibilityROI(
  violation: ViolationForROI,
  businessContext: BusinessContext
): AccessibilityROI {
  // Calculate fix costs
  const fixCosts = calculateFixCosts(violation, businessContext)
  
  // Calculate benefits
  const benefits = calculateBenefits(violation, businessContext)
  
  // Calculate ROI
  const totalCosts = fixCosts.estimatedCost
  const lawsuitRiskValue = ROI_FACTORS.legalRisk[benefits.riskMitigation.lawsuitRisk] || 0
  const totalBenefits = 
    benefits.marketExpansion.revenueOpportunity +
    lawsuitRiskValue +
    benefits.seoImpact.conversionImprovement +
    benefits.operationalEfficiency.supportTicketReduction
  
  const estimatedROI = totalCosts > 0 ? ((totalBenefits - totalCosts) / totalCosts) * 100 : 0
  
  // Calculate payback period
  const paybackPeriod = calculatePaybackPeriod(totalCosts, totalBenefits)
  
  // Determine confidence level
  const confidenceLevel = determineConfidenceLevel(violation, businessContext)
  
  // Generate assumptions
  const assumptions = generateAssumptions(violation, businessContext)
  
  return {
    fixCosts,
    benefits,
    estimatedROI: Math.round(estimatedROI),
    paybackPeriod,
    confidenceLevel,
    assumptions
  }
}

function calculateFixCosts(
  violation: ViolationForROI,
  businessContext: BusinessContext
): AccessibilityROI['fixCosts'] {
  const complexity = violation.technicalContext.implementationComplexity
  const estimatedFixTime = violation.technicalContext.estimatedFixTime
  
  // Parse time estimate to hours
  let hours = 2 // Default
  if (estimatedFixTime.includes('minute')) {
    hours = 0.5
  } else if (estimatedFixTime.includes('hour')) {
    const hourMatch = estimatedFixTime.match(/(\d+)/)
    hours = hourMatch ? parseInt(hourMatch[1]) : 2
  } else if (estimatedFixTime.includes('day')) {
    const dayMatch = estimatedFixTime.match(/(\d+)/)
    hours = dayMatch ? parseInt(dayMatch[1]) * 8 : 16
  } else if (estimatedFixTime.includes('week')) {
    const weekMatch = estimatedFixTime.match(/(\d+)/)
    hours = weekMatch ? parseInt(weekMatch[1]) * 40 : 40
  }
  
  // Get hourly rate based on complexity
  const hourlyRate = ROI_FACTORS.developerRates[complexity]
  
  // Calculate base cost
  let estimatedCost = hours * hourlyRate
  
  // Add testing and QA time (20% of development time)
  estimatedCost *= 1.2
  
  // Add project management overhead (10% for small fixes, 25% for complex)
  const pmOverhead = complexity === 'simple' ? 1.1 : complexity === 'moderate' ? 1.15 : 1.25
  estimatedCost *= pmOverhead
  
  // Industry-specific cost adjustments
  const industryMultipliers = {
    government: 1.3,  // More bureaucracy and compliance
    healthcare: 1.25, // High standards required
    finance: 1.2,     // Security and compliance overhead
    education: 1.1,   // Moderate oversight
    ecommerce: 1.0,   // Standard
    saas: 1.05,       // Technical complexity
    content: 0.95,    // Simpler requirements
    nonprofit: 0.9    // Budget constraints
  }
  
  const multiplier = industryMultipliers[businessContext.websiteClassification.type as keyof typeof industryMultipliers] || 1.0
  estimatedCost *= multiplier
  
  // Determine if one-time or recurring
  const oneTimeVsRecurring = violation.technicalContext.frameworkSpecific ? 'one-time' : 'one-time'
  
  // Required skills
  const skillRequirements = violation.technicalContext.requiredSkills
  
  return {
    developerHours: Math.round(hours * 10) / 10,
    estimatedCost: Math.round(estimatedCost),
    oneTimeVsRecurring,
    skillRequirements
  }
}

function calculateBenefits(
  violation: ViolationForROI,
  businessContext: BusinessContext
): AccessibilityROI['benefits'] {
  const marketExpansion = calculateMarketExpansion(violation, businessContext)
  const riskMitigation = calculateRiskMitigation(violation, businessContext)
  const seoImpact = calculateSEOImpact(violation, businessContext)
  const operationalEfficiency = calculateOperationalEfficiency(violation, businessContext)
  
  return {
    marketExpansion,
    riskMitigation,
    seoImpact,
    operationalEfficiency
  }
}

function calculateMarketExpansion(
  violation: ViolationForROI,
  businessContext: BusinessContext
): AccessibilityROI['benefits']['marketExpansion'] {
  const userPercentage = violation.userImpactAnalysis.affectedUserPercentage
  const monthlyTraffic = businessContext.monthlyTraffic
  
  // Calculate additional users that could be reached
  const additionalUsers = Math.round((monthlyTraffic * userPercentage) / 100)
  
  // Calculate revenue opportunity
  let revenueOpportunity = 0
  if (businessContext.averageOrderValue && businessContext.conversionRate) {
    // E-commerce calculation
    const newConversions = additionalUsers * (businessContext.conversionRate / 100)
    revenueOpportunity = newConversions * businessContext.averageOrderValue * 12 // Annual
  } else if (businessContext.annualRevenue) {
    // General business calculation
    const revenuePerUser = businessContext.annualRevenue / (monthlyTraffic * 12)
    revenueOpportunity = additionalUsers * revenuePerUser * 12
  } else {
    // Fallback calculation
    const industryMultiplier = ROI_FACTORS.marketExpansion[businessContext.websiteClassification.type as keyof typeof ROI_FACTORS.marketExpansion] || 0.1
    revenueOpportunity = monthlyTraffic * industryMultiplier * 12 * 10 // $10 per user assumption
  }
  
  // Calculate market share impact
  const marketShare = Math.min(5, userPercentage * 0.3) // Conservative estimate
  
  return {
    additionalUsers: additionalUsers * 12, // Annual
    revenueOpportunity: Math.round(revenueOpportunity),
    marketShare
  }
}

function calculateRiskMitigation(
  violation: ViolationForROI,
  businessContext: BusinessContext
): AccessibilityROI['benefits']['riskMitigation'] {
  const impact = violation.impact
  const industryRisk = businessContext.industryRisk
  
  // Determine lawsuit risk level
  let lawsuitRisk: 'low' | 'medium' | 'high' = 'low'
  if (impact === 'critical' || impact === 'serious') {
    if (industryRisk === 'high') lawsuitRisk = 'high'
    else if (industryRisk === 'medium') lawsuitRisk = 'medium'
    else lawsuitRisk = 'low'
  } else {
    lawsuitRisk = industryRisk === 'high' ? 'medium' : 'low'
  }
  
  // Calculate compliance benefit
  const complianceRequirements = businessContext.websiteClassification.complianceRequirements
  let complianceBenefit = 'Improved accessibility compliance'
  if (complianceRequirements.includes('Section 508')) {
    complianceBenefit = 'Meets Section 508 requirements for government contracts'
  } else if (complianceRequirements.includes('ADA')) {
    complianceBenefit = 'Reduces ADA lawsuit risk and improves compliance'
  }
  
  // Brand protection value
  const brandProtection = getBrandProtectionValue(violation, businessContext)
  
  return {
    lawsuitRisk,
    complianceBenefit,
    brandProtection
  }
}

function calculateSEOImpact(
  violation: ViolationForROI,
  businessContext: BusinessContext
): AccessibilityROI['benefits']['seoImpact'] {
  const impact = violation.impact
  const violationId = violation.violationId
  
  // SEO impact varies by violation type
  let searchRankingImprovement = 'Minimal SEO impact'
  let organicTrafficIncrease = '0-2%'
  let conversionImprovement = 0
  
  // High SEO impact violations
  if (violationId.includes('heading') || violationId.includes('alt') || violationId.includes('link')) {
    searchRankingImprovement = 'Moderate SEO improvement through better content structure'
    organicTrafficIncrease = '3-8%'
    conversionImprovement = businessContext.monthlyTraffic * 0.05 * 12 // 5% traffic increase
  } else if (violationId.includes('contrast') || violationId.includes('focus')) {
    searchRankingImprovement = 'Improved user experience signals'
    organicTrafficIncrease = '1-3%'
    conversionImprovement = businessContext.monthlyTraffic * 0.02 * 12 // 2% traffic increase
  }
  
  // Convert traffic increase to revenue
  if (businessContext.averageOrderValue && businessContext.conversionRate) {
    conversionImprovement *= (businessContext.conversionRate / 100) * businessContext.averageOrderValue
  } else {
    conversionImprovement *= 5 // $5 per additional visitor assumption
  }
  
  return {
    searchRankingImprovement,
    organicTrafficIncrease,
    conversionImprovement: Math.round(conversionImprovement)
  }
}

function calculateOperationalEfficiency(
  violation: ViolationForROI,
  businessContext: BusinessContext
): AccessibilityROI['benefits']['operationalEfficiency'] {
  const userPercentage = violation.userImpactAnalysis.affectedUserPercentage
  const monthlyTraffic = businessContext.monthlyTraffic
  
  // Calculate support ticket reduction
  const affectedUsers = (monthlyTraffic * userPercentage) / 100
  const supportTicketReduction = Math.round(affectedUsers * 0.1 * 12) // 10% of affected users might contact support
  
  // Calculate cost savings (assume $15 per support ticket)
  const supportCostSavings = supportTicketReduction * 15
  
  // User satisfaction increase
  const userSatisfactionIncrease = Math.min(20, userPercentage * 2) // Conservative estimate
  
  return {
    supportTicketReduction: supportCostSavings,
    userSatisfactionIncrease
  }
}

function calculatePaybackPeriod(totalCosts: number, totalBenefits: number): string {
  if (totalBenefits <= 0) return 'No clear payback period'
  
  const monthlyBenefits = totalBenefits / 12
  const paybackMonths = totalCosts / monthlyBenefits
  
  if (paybackMonths < 1) return 'Less than 1 month'
  if (paybackMonths < 3) return `${Math.round(paybackMonths)} months`
  if (paybackMonths < 12) return `${Math.round(paybackMonths)} months`
  if (paybackMonths < 24) return `${Math.round(paybackMonths / 12 * 10) / 10} years`
  
  return 'More than 2 years'
}

function determineConfidenceLevel(
  violation: ViolationForROI,
  businessContext: BusinessContext
): 'low' | 'medium' | 'high' {
  let confidenceScore = 50
  
  // Impact level confidence
  if (violation.impact === 'critical') confidenceScore += 20
  else if (violation.impact === 'serious') confidenceScore += 10
  else if (violation.impact === 'minor') confidenceScore -= 10
  
  // Business data availability
  if (businessContext.averageOrderValue && businessContext.conversionRate) {
    confidenceScore += 15 // Good e-commerce data
  } else if (businessContext.annualRevenue) {
    confidenceScore += 10 // Some revenue data
  } else {
    confidenceScore -= 10 // Limited data
  }
  
  // Industry risk certainty
  if (businessContext.industryRisk === 'high') confidenceScore += 10
  else if (businessContext.industryRisk === 'low') confidenceScore -= 5
  
  // Technical complexity certainty
  if (violation.technicalContext.implementationComplexity === 'simple') {
    confidenceScore += 10
  } else if (violation.technicalContext.implementationComplexity === 'complex') {
    confidenceScore -= 10
  }
  
  if (confidenceScore >= 70) return 'high'
  if (confidenceScore >= 50) return 'medium'
  return 'low'
}

function generateAssumptions(
  violation: ViolationForROI,
  businessContext: BusinessContext
): string[] {
  const assumptions = []
  
  // Traffic assumptions
  assumptions.push(`Monthly traffic: ${businessContext.monthlyTraffic.toLocaleString()} users`)
  
  // Revenue assumptions
  if (businessContext.averageOrderValue && businessContext.conversionRate) {
    assumptions.push(`Average order value: $${businessContext.averageOrderValue}`)
    assumptions.push(`Conversion rate: ${businessContext.conversionRate}%`)
  } else if (businessContext.annualRevenue) {
    assumptions.push(`Annual revenue: $${businessContext.annualRevenue.toLocaleString()}`)
  } else {
    assumptions.push('Revenue calculations based on industry averages')
  }
  
  // User impact assumptions
  assumptions.push(`${violation.userImpactAnalysis.affectedUserPercentage}% of users affected by this violation`)
  
  // Cost assumptions
  assumptions.push(`Developer rate: $${ROI_FACTORS.developerRates[violation.technicalContext.implementationComplexity]}/hour`)
  assumptions.push(`Implementation time: ${violation.technicalContext.estimatedFixTime}`)
  
  // Market expansion assumptions
  const marketExpansionRate = ROI_FACTORS.marketExpansion[businessContext.websiteClassification.type as keyof typeof ROI_FACTORS.marketExpansion] || 0.1
  assumptions.push(`Market expansion potential: ${(marketExpansionRate * 100).toFixed(1)}% for ${businessContext.websiteClassification.industry}`)
  
  // Legal risk assumptions
  if (businessContext.industryRisk === 'high') {
    assumptions.push('High legal risk industry with frequent accessibility lawsuits')
  } else if (businessContext.industryRisk === 'medium') {
    assumptions.push('Moderate legal risk with some accessibility enforcement')
  } else {
    assumptions.push('Lower legal risk but still subject to ADA compliance')
  }
  
  // SEO assumptions
  assumptions.push('SEO benefits calculated based on improved user experience signals')
  
  return assumptions
}

function getBrandProtectionValue(
  violation: ViolationForROI,
  businessContext: BusinessContext
): string {
  const impact = violation.impact
  const websiteType = businessContext.websiteClassification.type
  
  if (impact === 'critical' || impact === 'serious') {
    if (websiteType === 'government') {
      return 'Critical for public trust and regulatory compliance'
    } else if (websiteType === 'healthcare') {
      return 'Essential for patient trust and medical ethics'
    } else if (websiteType === 'finance') {
      return 'Important for customer trust and regulatory reputation'
    } else if (websiteType === 'education') {
      return 'Demonstrates commitment to inclusive education'
    } else {
      return 'Protects brand reputation and demonstrates social responsibility'
    }
  } else {
    return 'Moderate brand protection through improved accessibility'
  }
}

export function calculateAggregateROI(
  violations: ViolationForROI[],
  businessContext: BusinessContext
): {
  totalCost: number
  totalBenefit: number
  aggregateROI: number
  paybackPeriod: string
  priorityOrder: string[]
} {
  let totalCost = 0
  let totalBenefit = 0
  const violationROIs: Array<{ id: string; roi: number; cost: number }> = []
  
  violations.forEach(violation => {
    const roi = calculateAccessibilityROI(violation, businessContext)
    const cost = roi.fixCosts.estimatedCost
    const benefit = 
      roi.benefits.marketExpansion.revenueOpportunity +
      roi.benefits.seoImpact.conversionImprovement +
      roi.benefits.operationalEfficiency.supportTicketReduction
    
    totalCost += cost
    totalBenefit += benefit
    
    violationROIs.push({
      id: violation.violationId,
      roi: roi.estimatedROI,
      cost
    })
  })
  
  const aggregateROI = totalCost > 0 ? ((totalBenefit - totalCost) / totalCost) * 100 : 0
  const paybackPeriod = calculatePaybackPeriod(totalCost, totalBenefit)
  
  // Sort by ROI efficiency (ROI / cost ratio)
  const priorityOrder = violationROIs
    .sort((a, b) => (b.roi / b.cost) - (a.roi / a.cost))
    .map(v => v.id)
  
  return {
    totalCost: Math.round(totalCost),
    totalBenefit: Math.round(totalBenefit),
    aggregateROI: Math.round(aggregateROI),
    paybackPeriod,
    priorityOrder
  }
}

export function createBusinessContext(
  websiteClassification: WebsiteClassification,
  businessData: {
    monthlyTraffic: number
    averageOrderValue?: number
    conversionRate?: number
    annualRevenue?: number
    employeeCount?: number
  }
): BusinessContext {
  // Determine industry risk based on website type
  const industryRiskMap = {
    government: 'high' as const,
    healthcare: 'high' as const,
    finance: 'high' as const,
    education: 'medium' as const,
    ecommerce: 'medium' as const,
    saas: 'medium' as const,
    content: 'low' as const,
    nonprofit: 'low' as const,
    portfolio: 'low' as const,
    other: 'low' as const
  }
  
  return {
    websiteClassification,
    monthlyTraffic: businessData.monthlyTraffic,
    averageOrderValue: businessData.averageOrderValue,
    conversionRate: businessData.conversionRate,
    annualRevenue: businessData.annualRevenue,
    employeeCount: businessData.employeeCount,
    industryRisk: industryRiskMap[websiteClassification.type]
  }
} 
 
 