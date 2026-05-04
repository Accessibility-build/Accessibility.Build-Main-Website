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

// Federal-court website accessibility lawsuits (ADA Title III digital cases).
// Sources: Seyfarth Shaw ADA Title III tracker, UsableNet annual reports, PACER.
// Note: 2025's widely cited "5,000+" figure includes state-court filings (NY/CA mostly);
// the federalCourt column tracks federal filings only, per Seyfarth's published count.
export const lawsuitsByYear: LawsuitYearData[] = [
  { year: 2018, totalFiled: 2258, federalCourt: 2258, demandLetters: 0, yearOverYearChange: 177 },
  { year: 2019, totalFiled: 2256, federalCourt: 2256, demandLetters: 265, yearOverYearChange: -0.1 },
  { year: 2020, totalFiled: 3550, federalCourt: 3550, demandLetters: 0, yearOverYearChange: 57.3 },
  { year: 2021, totalFiled: 4011, federalCourt: 4011, demandLetters: 0, yearOverYearChange: 13.0 },
  { year: 2022, totalFiled: 3255, federalCourt: 3255, demandLetters: 1000, yearOverYearChange: -18.8 },
  { year: 2023, totalFiled: 2794, federalCourt: 2794, demandLetters: 1500, yearOverYearChange: -14.2 },
  { year: 2024, totalFiled: 2452, federalCourt: 2452, demandLetters: 1800, yearOverYearChange: -12.2 },
  { year: 2025, totalFiled: 3117, federalCourt: 3117, demandLetters: 1900, yearOverYearChange: 27.1 },
]

// Snapshot of the May 2026 regulatory landscape — used for the post-chart callout.
// Verified against the DOJ Interim Final Rule (Apr 20, 2026) and HHS Section 504 rule.
export const may2026RegulatorySnapshot = {
  asOfDate: "2026-05-04",
  items: [
    {
      label: "DOJ Title II compliance — EXTENDED",
      detail:
        "On April 20, 2026 the DOJ issued an Interim Final Rule pushing Phase 1 (entities ≥50,000 pop.) from April 24, 2026 to April 26, 2027, and Phase 2 (smaller entities, special districts) to April 26, 2028. WCAG 2.1 Level AA remains the standard. Comments due June 22, 2026.",
      tone: "warning" as const,
    },
    {
      label: "HHS Section 504 web rule — IN FORCE May 11, 2026",
      detail:
        "Recipients of HHS funding (most hospitals, health systems, state Medicaid agencies, and many federally qualified health centers) must conform their web content and mobile apps to WCAG 2.1 AA by May 11, 2026. HHS has not announced an extension. Healthcare-sector enforcement risk is the highest single regulatory exposure right now.",
      tone: "critical" as const,
    },
    {
      label: "Pro se / AI-drafted complaints surging",
      detail:
        "Per Seyfarth Shaw, ~40% of 2025 federal ADA Title III filings were filed pro se, with plaintiffs increasingly using generative AI to draft complaints and identify violations. Combined with the fact that 1,427 of 2025's filings (≈45% of federal cases) targeted repeat defendants, the cost-of-entry to file has dropped sharply.",
      tone: "info" as const,
    },
  ],
}

// Industry breakdown — share of all 2025 digital accessibility lawsuits (federal + state).
// Source: UsableNet 2025 year-end report. Counts proportioned against the ~5,000 combined total.
export const lawsuitsByIndustry: LawsuitIndustryData[] = [
  { industry: "E-Commerce & Retail", percentage: 70.0, count: 3500, trend: "up", color: "#3b82f6" },
  { industry: "Food & Beverage", percentage: 21.0, count: 1050, trend: "up", color: "#10b981" },
  { industry: "Healthcare", percentage: 2.5, count: 125, trend: "up", color: "#06b6d4" },
  { industry: "Entertainment", percentage: 2.0, count: 100, trend: "down", color: "#8b5cf6" },
  { industry: "Travel & Hospitality", percentage: 1.5, count: 75, trend: "down", color: "#f59e0b" },
  { industry: "Banking & Finance", percentage: 1.2, count: 60, trend: "stable", color: "#ef4444" },
  { industry: "Education", percentage: 0.8, count: 40, trend: "stable", color: "#ec4899" },
  { industry: "Real Estate", percentage: 0.5, count: 25, trend: "stable", color: "#84cc16" },
  { industry: "Other", percentage: 0.5, count: 25, trend: "stable", color: "#6b7280" },
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
    date: "2026-05-11",
    caseName: "HHS Section 504 Web Accessibility Rule — Compliance Deadline",
    court: "Department of Health and Human Services",
    summary: "Recipients of HHS federal financial assistance (hospitals, health systems, state Medicaid agencies, federally qualified health centers, and many other healthcare entities) must, as of May 11, 2026, ensure their websites and mobile apps conform to WCAG 2.1 Level AA. HHS has not announced an extension parallel to DOJ's Title II delay, leaving healthcare as the most acute regulatory exposure of 2026",
    significance: "First federal web-accessibility deadline to actually take effect on schedule; fuels Q2/Q3 2026 enforcement risk for the healthcare industry and adds weight to the rising healthcare share of private litigation",
    outcome: "plaintiff",
  },
  {
    date: "2026-04-20",
    caseName: "DOJ Interim Final Rule Extends Title II Web Compliance",
    court: "Department of Justice",
    summary: "The DOJ issued an Interim Final Rule extending the Title II web/mobile compliance deadlines by one year. State and local governments serving ≥50,000 residents now have until April 26, 2027 (was April 24, 2026); smaller entities and special districts have until April 26, 2028 (was April 26, 2027). WCAG 2.1 AA remains the standard. The DOJ cited overestimated technology readiness and entity resource constraints; written comments are due June 22, 2026",
    significance: "Removes the immediate enforcement cliff for public entities, but private-sector courts continue to cite the underlying rule as persuasive authority on what 'accessible' means under Title III",
    outcome: "defendant",
  },
  {
    date: "2025-06-28",
    caseName: "European Accessibility Act Enforcement Begins",
    court: "EU Member States",
    summary: "The European Accessibility Act (EAA) compliance deadline of June 28, 2025 took effect, requiring e-commerce, banking, transport, and digital products serving EU consumers to meet EN 301 549 (which incorporates WCAG 2.1 AA). U.S. companies with EU customers now face dual U.S./EU exposure",
    significance: "Expanded global accessibility liability for U.S. firms and increased the business case for proactive WCAG conformance",
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

// Top states by 2025 federal court website-accessibility filings.
// Source: Seyfarth Shaw / adatitleiii.com 2025 year-end review (federal-court only).
// California's count collapsed because state-court rulings closed off ADA coverage for online-only
// businesses, pushing plaintiffs to file in NY/FL/IL federal courts instead.
export const topStates: StateData[] = [
  { state: "New York", abbreviation: "NY", count: 1021, perCapita: 5.2 },
  { state: "Florida", abbreviation: "FL", count: 961, perCapita: 4.3 },
  { state: "Illinois", abbreviation: "IL", count: 585, perCapita: 4.7 },
  { state: "Minnesota", abbreviation: "MN", count: 162, perCapita: 2.8 },
  { state: "Pennsylvania", abbreviation: "PA", count: 137, perCapita: 1.1 },
  { state: "New Jersey", abbreviation: "NJ", count: 80, perCapita: 0.9 },
  { state: "Massachusetts", abbreviation: "MA", count: 55, perCapita: 0.8 },
  { state: "Texas", abbreviation: "TX", count: 40, perCapita: 0.1 },
  { state: "Missouri", abbreviation: "MO", count: 35, perCapita: 0.6 },
  { state: "California", abbreviation: "CA", count: 4, perCapita: 0.01 },
]

export const lawsuitSummary = {
  // Cumulative 2018-2025 federal-court website accessibility filings (sum of lawsuitsByYear).
  totalLawsuitsFiled: 23693,
  latestYearTotal: 3117,
  yearOverYearChange: 27.1,
  // Combined federal + state-court filings reported by UsableNet for 2025
  combinedFederalStateTotal2025: 5000,
  averageSettlement: 30000,
  mostTargetedIndustry: "E-Commerce & Retail",
  mostTargetedIndustryShare: 70,
  topState: "New York",
  averageLegalDefenseCost: 30000,
  demandLettersGrowth: 22,
  // Litigation-economics signals from Seyfarth & UsableNet 2025 reports
  proSeFederalShare2025: 40,
  repeatDefendants2025: 1427,
}
