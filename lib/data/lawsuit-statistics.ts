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
  type: "Court decision" | "Regulation" | "Settlement" | "Enforcement" | "Litigation"
  sourceUrl?: string
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
  { year: 2020, totalFiled: 2523, federalCourt: 2523, demandLetters: 0, yearOverYearChange: 14.0 },
  { year: 2021, totalFiled: 2895, federalCourt: 2895, demandLetters: 0, yearOverYearChange: 12.0 },
  { year: 2022, totalFiled: 3255, federalCourt: 3255, demandLetters: 1000, yearOverYearChange: 12.0 },
  { year: 2023, totalFiled: 2794, federalCourt: 2794, demandLetters: 1500, yearOverYearChange: -14.2 },
  { year: 2024, totalFiled: 2452, federalCourt: 2452, demandLetters: 1800, yearOverYearChange: -12.2 },
  { year: 2025, totalFiled: 3117, federalCourt: 3117, demandLetters: 1900, yearOverYearChange: 27.1 },
]

// Snapshot of the mid-2026 regulatory & litigation landscape — used for the post-chart callout.
// Verified against the DOJ Interim Final Rule (Apr 20, 2026), the HHS Section 504 rule, and
// the 2026 mid-year litigation reports (AudioEye 2026 Litigation Report, UsableNet 2026 trends).
export const may2026RegulatorySnapshot = {
  asOfDate: "2026-07-09",
  items: [
    {
      label: "HHS Section 504 deadline extended to May 11, 2027",
      detail:
        "HHS extended the first Section 504 web and mobile-app compliance deadline by one year. Covered recipients with 15 or more employees now have until May 11, 2027. A May 2026 federal lawsuit challenges that extension, so covered organizations should track the rulemaking and litigation rather than treating the new date as settled indefinitely.",
      tone: "warning" as const,
    },
    {
      label: "DOJ Title II compliance — EXTENDED to 2027/2028",
      detail:
        "On April 20, 2026 the DOJ issued an Interim Final Rule pushing Phase 1 (entities ≥50,000 pop.) from April 24, 2026 to April 26, 2027, and Phase 2 (smaller entities, special districts) to April 26, 2028. WCAG 2.1 Level AA remains the standard. The public comment window closed June 19, 2026; the extension does not pause private Title III litigation.",
      tone: "warning" as const,
    },
    {
      label: "2025 federal filings closed at 3,117",
      detail:
        "Seyfarth Shaw identified 3,117 federal website-accessibility lawsuits in 2025, 27% more than in 2024. A comparable full-year federal total for 2026 is not yet available, so this tracker does not present a 2026 filing projection as an observed count.",
      tone: "info" as const,
    },
    {
      label: "Federal and state datasets are not interchangeable",
      detail:
        "Industry reports use different search terms, court databases, date windows, and definitions of a filing. Federal-only counts should not be added to broader state-court datasets unless the source confirms that the scopes and deduplication rules align.",
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
    date: "2026-05-21",
    caseName: "NFB challenges DOJ and HHS deadline extensions",
    court: "U.S. District Court for the District of Maryland",
    summary: "The National Federation of the Blind filed suit challenging the interim final rules that extended the first DOJ Title II and HHS Section 504 web-accessibility deadlines by one year. The complaint asks the court to set the extensions aside under the Administrative Procedure Act.",
    significance: "The operative dates are extended, but the litigation means covered organizations should monitor the case and continue remediation rather than treating the delay as a permanent change.",
    outcome: "plaintiff",
    type: "Litigation",
    sourceUrl: "https://www.adatitleiii.com/2026/06/national-federation-of-the-blind-challenges-last-minute-deadline-extensions-for-website-and-mobile-app-accessibility/",
  },
  {
    date: "2025-07-11",
    caseName: "Alcazar v. Fashion Nova — $5.15M Proposed Class Settlement",
    court: "U.S. District Court / California (Unruh Act)",
    summary: "Fashion Nova agreed to a proposed $5.15 million class settlement concerning claims that its website was inaccessible to blind shoppers using screen readers. The proposal includes injunctive relief and potential payments of up to $4,000 for eligible California class members. Fashion Nova denies wrongdoing, and the agreement is not an admission of liability.",
    significance: "The proposed amount is one of the largest publicly reported resolutions involving website accessibility. Because court approval has been contested, it should be described as a proposed settlement rather than a final judgment or paid award.",
    outcome: "settled",
    type: "Settlement",
    sourceUrl: "https://www.fashionnovaaccessibilitysettlement.com/",
  },
  {
    date: "2026-04-20",
    caseName: "DOJ Interim Final Rule Extends Title II Web Compliance",
    court: "Department of Justice",
    summary: "The DOJ issued an Interim Final Rule extending the Title II web/mobile compliance deadlines by one year. State and local governments serving 50,000 or more residents now have until April 26, 2027; smaller entities and special districts have until April 26, 2028. WCAG 2.1 AA remains the technical standard.",
    significance: "Removes the immediate enforcement cliff for public entities, but private-sector courts continue to cite the underlying rule as persuasive authority on what 'accessible' means under Title III",
    outcome: "defendant",
    type: "Regulation",
    sourceUrl: "https://www.adatitleiii.com/2026/04/doj-extends-ada-title-ii-website-accessibility-deadlines-for-governmental-entities-but-litigation-and-compliance-risks-remain/",
  },
  {
    date: "2025-06-28",
    caseName: "European Accessibility Act Enforcement Begins",
    court: "EU Member States",
    summary: "The European Accessibility Act (EAA) compliance deadline of June 28, 2025 took effect, requiring e-commerce, banking, transport, and digital products serving EU consumers to meet EN 301 549 (which incorporates WCAG 2.1 AA). U.S. companies with EU customers now face dual U.S./EU exposure",
    significance: "Expanded global accessibility liability for U.S. firms and increased the business case for proactive WCAG conformance",
    outcome: "plaintiff",
    type: "Regulation",
    sourceUrl: "https://commission.europa.eu/strategy-and-policy/policies/justice-and-fundamental-rights/disability/union-equality-strategy-rights-persons-disabilities-2021-2030/european-accessibility-act_en",
  },
  {
    date: "2025-01-15",
    caseName: "FTC v. Accessibility Overlay Provider",
    court: "Federal Trade Commission",
    summary: "FTC reached a $1 million settlement with a prominent accessibility overlay provider for misleading businesses about what their widget could actually do for compliance",
    significance: "Undermines the overlay-as-compliance defense and validates lawsuit claims against widget-reliant sites",
    outcome: "plaintiff",
    type: "Enforcement",
    sourceUrl: "https://www.ftc.gov/news-events/news/press-releases/2025/01/ftc-order-requires-online-marketer-pay-1-million-deceptive-claims-its-ai-product-could-make-websites",
  },
  {
    date: "2024-06-28",
    caseName: "Loper Bright v. Raimondo",
    court: "Supreme Court",
    summary: "Overturned Chevron deference, potentially affecting how courts interpret ADA digital requirements without explicit agency rulemaking",
    significance: "May require Congress to explicitly address website accessibility in legislation",
    outcome: "plaintiff",
    type: "Court decision",
  },
  {
    date: "2022-03-18",
    caseName: "Domino's Pizza v. Robles",
    court: "Supreme Court (Denied Cert)",
    summary: "Supreme Court declined to hear Domino's appeal, letting stand the 9th Circuit ruling that the ADA applies to websites",
    significance: "Established precedent that websites connected to physical locations must be accessible",
    outcome: "plaintiff",
    type: "Court decision",
  },
  {
    date: "2021-06-25",
    caseName: "Gil v. Winn-Dixie",
    court: "11th Circuit",
    summary: "Reversed lower court ruling, holding that Winn-Dixie's website was not a place of public accommodation under ADA Title III",
    significance: "Created circuit split on whether websites are covered by ADA",
    outcome: "defendant",
    type: "Court decision",
  },
  {
    date: "2019-01-09",
    caseName: "Robles v. Domino's Pizza",
    court: "9th Circuit",
    summary: "Ruled that the ADA applies to Domino's website and mobile app",
    significance: "Major precedent affirming web accessibility requirements under ADA",
    outcome: "plaintiff",
    type: "Court decision",
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
  { state: "Missouri", abbreviation: "MO", count: 86, perCapita: 1.4 },
  { state: "Massachusetts", abbreviation: "MA", count: 57, perCapita: 0.8 },
  { state: "Wisconsin", abbreviation: "WI", count: 47, perCapita: 0.8 },
  { state: "Indiana", abbreviation: "IN", count: 34, perCapita: 0.5 },
  { state: "New Jersey", abbreviation: "NJ", count: 22, perCapita: 0.2 },
  { state: "California", abbreviation: "CA", count: 4, perCapita: 0.01 },
]

export const lawsuitSummary = {
  // Cumulative 2018-2025 federal-court website accessibility filings (sum of lawsuitsByYear).
  totalLawsuitsFiled: 21550,
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
  // Additional 2025 litigation-economics signals from industry reports.
  largestSettlement2025: 5150000,
  largestSettlementDefendant: "Fashion Nova",
  companiesOver25MRevenueShare2025: 36,
  top500EcommerceSuedShare: 35.8,
  alreadyHadAccessibilitySolutionShare: 38.5,
  interiorPageCitationShare: 64,
  repeatDefendantFederalShare2025: 46,
}
