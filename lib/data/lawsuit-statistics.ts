export interface LawsuitYearData {
  year: number
  totalFiled: number
  federalCourt: number
  demandLetters: number
  yearOverYearChange: number
}

export interface LawsuitIndustryData {
  industry: string
  percentage: number
  count: number
  trend: "up" | "down" | "stable"
  color: string
}

export interface SettlementData {
  category: string
  averageCost: number
  medianCost: number
  range: { min: number; max: number }
}

export interface KeyRuling {
  date: string
  caseName: string
  court: string
  summary: string
  significance: string
  outcome: "plaintiff" | "defendant" | "settled"
}

export interface StateData {
  state: string
  abbreviation: string
  count: number
  perCapita: number
}

// Digital accessibility-specific lawsuits filed in US federal courts
// Sources: UsableNet annual reports, Seyfarth Shaw ADA Title III tracker, PACER
export const lawsuitsByYear: LawsuitYearData[] = [
  { year: 2018, totalFiled: 2258, federalCourt: 2258, demandLetters: 0, yearOverYearChange: 177 },
  { year: 2019, totalFiled: 2256, federalCourt: 2256, demandLetters: 265, yearOverYearChange: -0.1 },
  { year: 2020, totalFiled: 3550, federalCourt: 3550, demandLetters: 0, yearOverYearChange: 57.3 },
  { year: 2021, totalFiled: 4011, federalCourt: 4011, demandLetters: 0, yearOverYearChange: 13.0 },
  { year: 2022, totalFiled: 3255, federalCourt: 3255, demandLetters: 1000, yearOverYearChange: -18.8 },
  { year: 2023, totalFiled: 2794, federalCourt: 2794, demandLetters: 1500, yearOverYearChange: -14.2 },
  { year: 2024, totalFiled: 2452, federalCourt: 2452, demandLetters: 1800, yearOverYearChange: -12.2 },
  { year: 2025, totalFiled: 5000, federalCourt: 5000, demandLetters: 2200, yearOverYearChange: 103.9 },
]

// Industry breakdown based on 2025 UsableNet data
export const lawsuitsByIndustry: LawsuitIndustryData[] = [
  { industry: "E-Commerce & Retail", percentage: 69.0, count: 3450, trend: "up", color: "#3b82f6" },
  { industry: "Food & Beverage", percentage: 21.0, count: 1050, trend: "up", color: "#10b981" },
  { industry: "Entertainment", percentage: 2.5, count: 125, trend: "down", color: "#8b5cf6" },
  { industry: "Travel & Hospitality", percentage: 1.8, count: 90, trend: "down", color: "#f59e0b" },
  { industry: "Banking & Finance", percentage: 1.5, count: 75, trend: "stable", color: "#ef4444" },
  { industry: "Healthcare", percentage: 1.2, count: 60, trend: "stable", color: "#06b6d4" },
  { industry: "Education", percentage: 0.8, count: 40, trend: "stable", color: "#ec4899" },
  { industry: "Real Estate", percentage: 0.7, count: 35, trend: "stable", color: "#84cc16" },
  { industry: "Other", percentage: 1.5, count: 75, trend: "stable", color: "#6b7280" },
]

export const settlementData: SettlementData[] = [
  { category: "Demand Letter Settlement", averageCost: 5000, medianCost: 3500, range: { min: 1000, max: 25000 } },
  { category: "Out-of-Court Settlement", averageCost: 30000, medianCost: 18000, range: { min: 5000, max: 150000 } },
  { category: "Court Judgment", averageCost: 85000, medianCost: 55000, range: { min: 10000, max: 500000 } },
  { category: "Class Action Settlement", averageCost: 400000, medianCost: 225000, range: { min: 50000, max: 6000000 } },
  { category: "Legal Defense (No Damages)", averageCost: 30000, medianCost: 18000, range: { min: 5000, max: 125000 } },
]

export const keyRulings: KeyRuling[] = [
  {
    date: "2025-04-24",
    caseName: "DOJ Title II Rule Takes Effect",
    court: "Department of Justice",
    summary: "The DOJ's Title II rule requiring state and local government websites to meet WCAG 2.1 Level AA takes effect for large entities in April 2026, solidifying WCAG 2.1 AA as the de facto standard courts reference in Title III cases",
    significance: "Establishes the first formal federal web accessibility standard, influencing Title III case law",
    outcome: "plaintiff",
  },
  {
    date: "2025-01-15",
    caseName: "FTC v. Accessibility Overlay Provider",
    court: "Federal Trade Commission",
    summary: "FTC reached a $1 million settlement with a prominent accessibility overlay provider for misleading businesses about what their widget could actually do for compliance",
    significance: "Undermines the overlay-as-compliance defense and validates lawsuit claims against widget-reliant sites",
    outcome: "plaintiff",
  },
  {
    date: "2024-06-28",
    caseName: "Loper Bright v. Raimondo",
    court: "Supreme Court",
    summary: "Overturned Chevron deference, potentially affecting how courts interpret ADA digital requirements without explicit agency rulemaking",
    significance: "May require Congress to explicitly address website accessibility in legislation",
    outcome: "plaintiff",
  },
  {
    date: "2022-03-18",
    caseName: "Domino's Pizza v. Robles",
    court: "Supreme Court (Denied Cert)",
    summary: "Supreme Court declined to hear Domino's appeal, letting stand the 9th Circuit ruling that the ADA applies to websites",
    significance: "Established precedent that websites connected to physical locations must be accessible",
    outcome: "plaintiff",
  },
  {
    date: "2021-06-25",
    caseName: "Gil v. Winn-Dixie",
    court: "11th Circuit",
    summary: "Reversed lower court ruling, holding that Winn-Dixie's website was not a place of public accommodation under ADA Title III",
    significance: "Created circuit split on whether websites are covered by ADA",
    outcome: "defendant",
  },
  {
    date: "2019-01-09",
    caseName: "Robles v. Domino's Pizza",
    court: "9th Circuit",
    summary: "Ruled that the ADA applies to Domino's website and mobile app",
    significance: "Major precedent affirming web accessibility requirements under ADA",
    outcome: "plaintiff",
  },
]

// Top states for digital accessibility lawsuit filings (2025 data)
// Sources: UsableNet, Seyfarth Shaw, PACER
export const topStates: StateData[] = [
  { state: "New York", abbreviation: "NY", count: 1750, perCapita: 8.9 },
  { state: "Florida", abbreviation: "FL", count: 1100, perCapita: 5.0 },
  { state: "California", abbreviation: "CA", count: 950, perCapita: 2.4 },
  { state: "Illinois", abbreviation: "IL", count: 475, perCapita: 3.8 },
  { state: "Pennsylvania", abbreviation: "PA", count: 280, perCapita: 2.2 },
  { state: "New Jersey", abbreviation: "NJ", count: 210, perCapita: 2.3 },
  { state: "Texas", abbreviation: "TX", count: 185, perCapita: 0.6 },
  { state: "Massachusetts", abbreviation: "MA", count: 155, perCapita: 2.2 },
  { state: "Minnesota", abbreviation: "MN", count: 120, perCapita: 2.1 },
  { state: "Missouri", abbreviation: "MO", count: 95, perCapita: 1.5 },
]

export const lawsuitSummary = {
  totalLawsuitsFiled: 25576,
  latestYearTotal: 5000,
  yearOverYearChange: 103.9,
  averageSettlement: 30000,
  mostTargetedIndustry: "E-Commerce & Retail",
  topState: "New York",
  averageLegalDefenseCost: 30000,
  demandLettersGrowth: 22,
}
