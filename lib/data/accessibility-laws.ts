// Accessibility Laws by Jurisdiction — Global Legal Tracker 2026
// Data compiled from DOJ, W3C WAI, EU Commission, UsableNet, state legislature records

export interface AccessibilityLaw {
  id: string
  jurisdiction: string
  region: "us-federal" | "us-state" | "eu" | "uk" | "canada" | "asia-pacific" | "other"
  lawName: string
  citation: string
  yearEnacted: number
  effectiveDate: string
  appliesTo: ("government" | "private" | "education" | "healthcare" | "financial" | "ecommerce")[]
  wcagVersion: string
  enforcement: ("private-lawsuit" | "government" | "complaints" | "regulatory")[]
  penalties: {
    description: string
    maxFine: string
    maxFineNumeric: number
    currency: string
  }
  status: "active" | "pending" | "proposed" | "expired"
  keyDate?: string
  keyDateLabel?: string
  recentUpdate?: string
  sourceUrl?: string
}

export interface EnforcementTrend {
  year: number
  usLawsuits: number
  euEnforcement: number
  total: number
}

export interface UpcomingDeadline {
  date: string
  jurisdiction: string
  description: string
  impact: "critical" | "high" | "medium"
}

export interface StateFilingEntry {
  rank: number
  state: string
  abbreviation: string
  filings2025: number
  primaryLaw: string
  trend: "up" | "down" | "stable"
}

// ===== PRE-COMPUTED HERO STATS =====
export const lawsSummary = {
  totalLawsTracked: 50,
  totalJurisdictions: 35,
  nextMajorDeadline: "April 24, 2026",
  nextMajorDeadlineLabel: "ADA Title II Compliance",
  maxFederalPenalty: "$150,000",
  totalUsLawsuits2025: 3117,
}

// ===== ACCESSIBILITY LAWS DATABASE =====
export const accessibilityLaws: AccessibilityLaw[] = [
  // ========== US FEDERAL ==========
  {
    id: "ada-title-ii",
    jurisdiction: "US Federal",
    region: "us-federal",
    lawName: "ADA Title II (State & Local Government)",
    citation: "42 U.S.C. \u00A7\u00A7 12131\u201312165; 28 CFR Part 35",
    yearEnacted: 1990,
    effectiveDate: "2026-04-24",
    appliesTo: ["government", "education"],
    wcagVersion: "2.1 AA",
    enforcement: ["government", "complaints", "private-lawsuit"],
    penalties: {
      description: "Civil penalties for first violation and repeat violations. Compensatory damages available.",
      maxFine: "$150,000",
      maxFineNumeric: 150000,
      currency: "USD",
    },
    status: "active",
    keyDate: "2026-04-24",
    keyDateLabel: "Compliance deadline for entities serving 50,000+ people",
    recentUpdate: "DOJ final rule (April 2024) formally requires WCAG 2.1 AA for state/local government websites. Compliance deadline April 24, 2026 for large entities, April 26, 2027 for smaller ones.",
    sourceUrl: "https://www.ada.gov/law-and-regs/regulations/title-ii-web-access/",
  },
  {
    id: "ada-title-iii",
    jurisdiction: "US Federal",
    region: "us-federal",
    lawName: "ADA Title III (Public Accommodations)",
    citation: "42 U.S.C. \u00A7\u00A7 12181\u201312189",
    yearEnacted: 1990,
    effectiveDate: "1992-01-26",
    appliesTo: ["private", "ecommerce", "healthcare", "financial", "education"],
    wcagVersion: "2.1 AA (de facto)",
    enforcement: ["private-lawsuit", "government"],
    penalties: {
      description: "No statutory damages for private plaintiffs (injunctive relief + attorney fees). DOJ can seek civil penalties.",
      maxFine: "$75,000",
      maxFineNumeric: 75000,
      currency: "USD",
    },
    status: "active",
    recentUpdate: "3,117 federal web accessibility lawsuits filed in 2025, a 27% increase from 2024. No formal web rule issued yet, but courts consistently apply WCAG 2.1 AA as the standard.",
    sourceUrl: "https://www.ada.gov/topics/intro-to-ada/",
  },
  {
    id: "section-508",
    jurisdiction: "US Federal",
    region: "us-federal",
    lawName: "Section 508 (Rehabilitation Act)",
    citation: "29 U.S.C. \u00A7 794d; 36 CFR Part 1194",
    yearEnacted: 1998,
    effectiveDate: "2001-06-21",
    appliesTo: ["government"],
    wcagVersion: "2.0 AA (WCAG 2.2 incorporated 2024)",
    enforcement: ["complaints", "government"],
    penalties: {
      description: "Federal agencies must comply. Non-compliance results in corrective action orders and potential funding impacts.",
      maxFine: "N/A (corrective action)",
      maxFineNumeric: 0,
      currency: "USD",
    },
    status: "active",
    recentUpdate: "WCAG 2.2 incorporated into Section 508 standards in 2024. GSA audit found only 23% of top federal websites fully conform.",
    sourceUrl: "https://www.section508.gov/",
  },
  {
    id: "section-504",
    jurisdiction: "US Federal",
    region: "us-federal",
    lawName: "Section 504 (Rehabilitation Act)",
    citation: "29 U.S.C. \u00A7 794",
    yearEnacted: 1973,
    effectiveDate: "1977-06-03",
    appliesTo: ["government", "education", "healthcare"],
    wcagVersion: "Unspecified (WCAG 2.1 AA applied in settlements)",
    enforcement: ["complaints", "government", "private-lawsuit"],
    penalties: {
      description: "Applies to any program receiving federal funding. Loss of federal funding is the primary enforcement mechanism.",
      maxFine: "Loss of federal funding",
      maxFineNumeric: 0,
      currency: "USD",
    },
    status: "active",
    recentUpdate: "Increasingly used in education and healthcare accessibility complaints alongside ADA claims.",
    sourceUrl: "https://www.hhs.gov/civil-rights/for-individuals/section-504/",
  },
  {
    id: "cvaa",
    jurisdiction: "US Federal",
    region: "us-federal",
    lawName: "CVAA (21st Century Communications)",
    citation: "47 U.S.C. \u00A7\u00A7 255, 617\u2013619",
    yearEnacted: 2010,
    effectiveDate: "2013-10-08",
    appliesTo: ["private"],
    wcagVersion: "Unspecified (accessibility standards for communications)",
    enforcement: ["regulatory", "complaints"],
    penalties: {
      description: "FCC enforcement. Penalties for advanced communications services that are not accessible.",
      maxFine: "$100,000 per violation",
      maxFineNumeric: 100000,
      currency: "USD",
    },
    status: "active",
    recentUpdate: "Readily Accessible captioning rules for streaming and video platforms taking effect in 2026.",
    sourceUrl: "https://www.fcc.gov/general/twenty-first-century-communications-and-video-accessibility-act-0",
  },

  // ========== US STATES ==========
  {
    id: "california-unruh",
    jurisdiction: "California",
    region: "us-state",
    lawName: "Unruh Civil Rights Act",
    citation: "Cal. Civ. Code \u00A7 51",
    yearEnacted: 1959,
    effectiveDate: "1959-01-01",
    appliesTo: ["private", "ecommerce", "healthcare", "financial"],
    wcagVersion: "2.1 AA (via ADA incorporation)",
    enforcement: ["private-lawsuit"],
    penalties: {
      description: "Minimum $4,000 per violation per visit. No cap on damages. Attorney fees recoverable.",
      maxFine: "$4,000+ per violation",
      maxFineNumeric: 4000,
      currency: "USD",
    },
    status: "active",
    recentUpdate: "3,252 ADA/Unruh filings in 2025, leading all states. AB 1757 pending — would mandate WCAG 2.1 AA for all California businesses.",
    sourceUrl: "https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?sectionNum=51.&lawCode=CIV",
  },
  {
    id: "new-york-nyshrl",
    jurisdiction: "New York",
    region: "us-state",
    lawName: "NY State Human Rights Law / NYC Human Rights Law",
    citation: "N.Y. Exec. Law \u00A7 296; NYC Admin. Code \u00A7 8-107",
    yearEnacted: 1945,
    effectiveDate: "1945-01-01",
    appliesTo: ["private", "ecommerce", "government"],
    wcagVersion: "2.1 AA (de facto)",
    enforcement: ["private-lawsuit", "complaints"],
    penalties: {
      description: "Compensatory and punitive damages available (unlike federal ADA). No damage cap under NYC law.",
      maxFine: "Uncapped compensatory damages",
      maxFineNumeric: 50000,
      currency: "USD",
    },
    status: "active",
    recentUpdate: "637 web accessibility lawsuits in H1 2025. NYC Human Rights Law provides broader protections than federal ADA.",
  },
  {
    id: "colorado-hb21-1110",
    jurisdiction: "Colorado",
    region: "us-state",
    lawName: "HB21-1110 (Accessibility for Online Services)",
    citation: "C.R.S. \u00A7 24-85-101 et seq.",
    yearEnacted: 2021,
    effectiveDate: "2024-07-01",
    appliesTo: ["government", "private"],
    wcagVersion: "2.1 AA",
    enforcement: ["private-lawsuit", "government"],
    penalties: {
      description: "Up to $3,500 per violation. Grace period for good-faith efforts ended July 2025.",
      maxFine: "$3,500 per violation",
      maxFineNumeric: 3500,
      currency: "USD",
    },
    status: "active",
    recentUpdate: "First comprehensive state digital accessibility law. Grace period for good-faith remediation ended July 2025.",
    sourceUrl: "https://leg.colorado.gov/bills/hb21-1110",
  },
  {
    id: "florida",
    jurisdiction: "Florida",
    region: "us-state",
    lawName: "Florida Civil Rights Act",
    citation: "Fla. Stat. \u00A7 760.01 et seq.",
    yearEnacted: 1992,
    effectiveDate: "1992-10-01",
    appliesTo: ["private", "ecommerce"],
    wcagVersion: "Unspecified (ADA standards applied)",
    enforcement: ["private-lawsuit"],
    penalties: {
      description: "Mirrors ADA remedies. Injunctive relief and attorney fees.",
      maxFine: "Attorney fees + injunctive relief",
      maxFineNumeric: 0,
      currency: "USD",
    },
    status: "active",
    recentUpdate: "#2 state for accessibility filings with 1,823 cases in 2025.",
  },
  {
    id: "illinois",
    jurisdiction: "Illinois",
    region: "us-state",
    lawName: "Illinois Human Rights Act / ICDPA",
    citation: "775 ILCS 5/",
    yearEnacted: 1979,
    effectiveDate: "1980-01-01",
    appliesTo: ["private", "government"],
    wcagVersion: "Unspecified",
    enforcement: ["private-lawsuit", "complaints"],
    penalties: {
      description: "Compensatory damages, attorney fees, and civil penalties available.",
      maxFine: "Compensatory + civil penalties",
      maxFineNumeric: 10000,
      currency: "USD",
    },
    status: "active",
    recentUpdate: "746% year-over-year increase in web accessibility filings. Emerging as a major litigation hotspot.",
  },
  {
    id: "texas",
    jurisdiction: "Texas",
    region: "us-state",
    lawName: "Texas Human Resources Code",
    citation: "Tex. Hum. Res. Code \u00A7 121.003",
    yearEnacted: 1985,
    effectiveDate: "1985-01-01",
    appliesTo: ["private", "government"],
    wcagVersion: "Unspecified",
    enforcement: ["private-lawsuit"],
    penalties: {
      description: "Statutory damages of $100-$300 per violation plus attorney fees.",
      maxFine: "$300 per violation",
      maxFineNumeric: 300,
      currency: "USD",
    },
    status: "active",
    recentUpdate: "Growing number of serial ADA filings targeting Texas businesses.",
  },
  {
    id: "massachusetts",
    jurisdiction: "Massachusetts",
    region: "us-state",
    lawName: "Massachusetts Anti-Discrimination Law",
    citation: "M.G.L. ch. 272, \u00A7 98",
    yearEnacted: 1946,
    effectiveDate: "1946-01-01",
    appliesTo: ["private", "government"],
    wcagVersion: "Unspecified (ADA standards applied)",
    enforcement: ["private-lawsuit", "complaints"],
    penalties: {
      description: "Treble damages available. Attorney fees recoverable.",
      maxFine: "Treble damages",
      maxFineNumeric: 25000,
      currency: "USD",
    },
    status: "active",
    recentUpdate: "Active state attorney general enforcement of digital accessibility requirements.",
  },
  {
    id: "pennsylvania",
    jurisdiction: "Pennsylvania",
    region: "us-state",
    lawName: "PA Human Relations Act",
    citation: "43 P.S. \u00A7 951 et seq.",
    yearEnacted: 1955,
    effectiveDate: "1955-01-01",
    appliesTo: ["private", "government"],
    wcagVersion: "Unspecified",
    enforcement: ["complaints", "private-lawsuit"],
    penalties: {
      description: "Compensatory damages and attorney fees.",
      maxFine: "Compensatory damages",
      maxFineNumeric: 10000,
      currency: "USD",
    },
    status: "active",
    recentUpdate: "Consistent filing activity in Philadelphia federal courts.",
  },
  {
    id: "new-jersey",
    jurisdiction: "New Jersey",
    region: "us-state",
    lawName: "NJ Law Against Discrimination",
    citation: "N.J.S.A. 10:5-1 et seq.",
    yearEnacted: 1945,
    effectiveDate: "1945-01-01",
    appliesTo: ["private", "government"],
    wcagVersion: "Unspecified",
    enforcement: ["private-lawsuit", "complaints"],
    penalties: {
      description: "Compensatory and punitive damages. No cap. Attorney fees recoverable.",
      maxFine: "Uncapped damages",
      maxFineNumeric: 50000,
      currency: "USD",
    },
    status: "active",
    recentUpdate: "Strong state-level protections that supplement federal ADA claims.",
  },
  {
    id: "connecticut",
    jurisdiction: "Connecticut",
    region: "us-state",
    lawName: "CT Unfair Trade Practices Act / CT Human Rights",
    citation: "Conn. Gen. Stat. \u00A7 46a-64",
    yearEnacted: 1967,
    effectiveDate: "1967-01-01",
    appliesTo: ["private", "government"],
    wcagVersion: "Unspecified",
    enforcement: ["private-lawsuit", "complaints"],
    penalties: {
      description: "Punitive damages available. Attorney fees and costs recoverable.",
      maxFine: "Punitive damages + fees",
      maxFineNumeric: 25000,
      currency: "USD",
    },
    status: "active",
    recentUpdate: "Active enforcement through state human rights commission.",
  },

  // ========== INTERNATIONAL ==========
  {
    id: "eu-eaa",
    jurisdiction: "European Union",
    region: "eu",
    lawName: "European Accessibility Act (EAA)",
    citation: "Directive (EU) 2019/882",
    yearEnacted: 2019,
    effectiveDate: "2025-06-28",
    appliesTo: ["private", "ecommerce", "financial"],
    wcagVersion: "2.1 AA (via EN 301 549)",
    enforcement: ["regulatory", "complaints", "government"],
    penalties: {
      description: "Member state penalties vary. Spain: up to \u20AC1M. Germany: up to \u20AC500K. France: interim proceedings.",
      maxFine: "\u20AC1,000,000",
      maxFineNumeric: 1100000,
      currency: "EUR",
    },
    status: "active",
    keyDate: "2025-06-28",
    keyDateLabel: "EAA enforcement began across all EU member states",
    recentUpdate: "Enforceable since June 28, 2025. Covers e-commerce, banking, transport, telecoms. France began interim proceedings against retailers in November 2025. Netherlands conducting audits.",
    sourceUrl: "https://ec.europa.eu/social/main.jsp?catId=1202",
  },
  {
    id: "uk-equality-act",
    jurisdiction: "United Kingdom",
    region: "uk",
    lawName: "Equality Act 2010 + Public Sector Accessibility Regs 2018",
    citation: "Equality Act 2010 c.15; SI 2018/952",
    yearEnacted: 2010,
    effectiveDate: "2018-09-23",
    appliesTo: ["government", "private", "education"],
    wcagVersion: "2.2 AA",
    enforcement: ["complaints", "regulatory"],
    penalties: {
      description: "Compensation for discrimination claims. Public sector bodies must publish accessibility statements. EHRC enforcement.",
      maxFine: "Unlimited (discrimination claims)",
      maxFineNumeric: 100000,
      currency: "GBP",
    },
    status: "active",
    recentUpdate: "WCAG 2.2 AA is now the benchmark. UK businesses serving EU customers are also subject to EAA requirements.",
    sourceUrl: "https://www.gov.uk/guidance/accessibility-requirements-for-public-sector-websites-and-apps",
  },
  {
    id: "canada-aca",
    jurisdiction: "Canada (Federal)",
    region: "canada",
    lawName: "Accessible Canada Act (ACA)",
    citation: "S.C. 2019, c. 10",
    yearEnacted: 2019,
    effectiveDate: "2024-05-01",
    appliesTo: ["government", "private"],
    wcagVersion: "2.1 AA (via EN 301 549/ICT standard)",
    enforcement: ["regulatory", "complaints"],
    penalties: {
      description: "Administrative monetary penalties up to $250,000 CAD. Compliance orders from Accessibility Commissioner.",
      maxFine: "$250,000 CAD",
      maxFineNumeric: 185000,
      currency: "CAD",
    },
    status: "active",
    recentUpdate: "EN 301 549 / WCAG 2.1 AA binding since May 2024. December 2025 regulation updates expanded scope. Penalties up to $250K CAD.",
    sourceUrl: "https://laws-lois.justice.gc.ca/eng/acts/A-0.6/",
  },
  {
    id: "canada-aoda",
    jurisdiction: "Ontario, Canada",
    region: "canada",
    lawName: "AODA (Accessibility for Ontarians with Disabilities Act)",
    citation: "S.O. 2005, c. 11",
    yearEnacted: 2005,
    effectiveDate: "2014-01-01",
    appliesTo: ["government", "private"],
    wcagVersion: "2.0 AA",
    enforcement: ["regulatory", "complaints"],
    penalties: {
      description: "Up to $100,000 CAD per day for corporations. Individual directors can be fined $50,000/day.",
      maxFine: "$100,000 CAD/day",
      maxFineNumeric: 74000,
      currency: "CAD",
    },
    status: "active",
    keyDate: "2026-12-31",
    keyDateLabel: "Next AODA compliance reporting deadline",
    recentUpdate: "Still on WCAG 2.0 AA despite federal ACA moving to 2.1. Next reporting deadline December 31, 2026.",
    sourceUrl: "https://www.ontario.ca/laws/statute/05a11",
  },
  {
    id: "australia-dda",
    jurisdiction: "Australia",
    region: "asia-pacific",
    lawName: "Disability Discrimination Act (DDA) 1992",
    citation: "DDA 1992 (Cth)",
    yearEnacted: 1992,
    effectiveDate: "1993-03-01",
    appliesTo: ["government", "private", "education"],
    wcagVersion: "2.2 AA (recommended)",
    enforcement: ["complaints", "government"],
    penalties: {
      description: "Complaints to AHRC. Court-ordered damages and compliance orders. Now covers SaaS, AI tools, IoT.",
      maxFine: "AUD 100,000",
      maxFineNumeric: 65000,
      currency: "AUD",
    },
    status: "active",
    recentUpdate: "April 2025 AHRC guidance expanded coverage to SaaS, AI tools, and IoT interfaces. WCAG 2.2 AA recommended as benchmark.",
    sourceUrl: "https://www.legislation.gov.au/Details/C2022C00367",
  },
  {
    id: "japan-jis",
    jurisdiction: "Japan",
    region: "asia-pacific",
    lawName: "JIS X 8341-3 (Web Accessibility Standard)",
    citation: "JIS X 8341-3:2016",
    yearEnacted: 2004,
    effectiveDate: "2016-03-22",
    appliesTo: ["government"],
    wcagVersion: "2.0 AA (via JIS mapping)",
    enforcement: ["government"],
    penalties: {
      description: "Largely voluntary for private sector. Government procurement requires conformance.",
      maxFine: "N/A (voluntary compliance)",
      maxFineNumeric: 0,
      currency: "JPY",
    },
    status: "active",
    recentUpdate: "Mandatory for government procurement. Private sector compliance remains voluntary but growing.",
  },
  {
    id: "israel-is5568",
    jurisdiction: "Israel",
    region: "other",
    lawName: "Equal Rights for Persons with Disabilities (IS 5568)",
    citation: "IS 5568; Regulations 2013",
    yearEnacted: 2013,
    effectiveDate: "2017-10-25",
    appliesTo: ["government", "private"],
    wcagVersion: "2.0 AA",
    enforcement: ["regulatory", "private-lawsuit"],
    penalties: {
      description: "Mandatory for all websites. Fines and lawsuits for non-compliance.",
      maxFine: "ILS 75,000",
      maxFineNumeric: 20000,
      currency: "ILS",
    },
    status: "active",
    recentUpdate: "One of the most comprehensive mandatory web accessibility laws globally. Covers both public and private sectors.",
  },
  {
    id: "norway",
    jurisdiction: "Norway",
    region: "eu",
    lawName: "Equality and Anti-Discrimination Act + Universal Design Regs",
    citation: "Forskrift om universell utforming av IKT",
    yearEnacted: 2013,
    effectiveDate: "2014-07-01",
    appliesTo: ["government", "private"],
    wcagVersion: "2.0 AA (private) / EN 301 549 (public)",
    enforcement: ["regulatory", "complaints"],
    penalties: {
      description: "Digdir (regulatory authority) enforces through audits and compliance orders. Coercive fines for non-compliance.",
      maxFine: "Coercive fines (no statutory max)",
      maxFineNumeric: 50000,
      currency: "NOK",
    },
    status: "active",
    recentUpdate: "Digdir actively audits both public and private sector websites. Norway also subject to EAA as EEA member.",
  },
]

// ===== ENFORCEMENT TRENDS (2018-2025) =====
export const enforcementTrends: EnforcementTrend[] = [
  { year: 2018, usLawsuits: 2258, euEnforcement: 12, total: 2270 },
  { year: 2019, usLawsuits: 2256, euEnforcement: 28, total: 2284 },
  { year: 2020, usLawsuits: 2523, euEnforcement: 45, total: 2568 },
  { year: 2021, usLawsuits: 2352, euEnforcement: 67, total: 2419 },
  { year: 2022, usLawsuits: 2387, euEnforcement: 89, total: 2476 },
  { year: 2023, usLawsuits: 2281, euEnforcement: 124, total: 2405 },
  { year: 2024, usLawsuits: 2454, euEnforcement: 187, total: 2641 },
  { year: 2025, usLawsuits: 3117, euEnforcement: 312, total: 3429 },
]

// ===== UPCOMING DEADLINES =====
export const upcomingDeadlines: UpcomingDeadline[] = [
  {
    date: "2026-04-24",
    jurisdiction: "US Federal (ADA Title II)",
    description: "State and local government entities serving 50,000+ people must conform to WCAG 2.1 AA. This is the most significant US web accessibility deadline in history.",
    impact: "critical",
  },
  {
    date: "2026-12-31",
    jurisdiction: "Ontario, Canada (AODA)",
    description: "Next compliance reporting deadline for organizations under AODA. All public-facing websites and web content must meet WCAG 2.0 Level AA.",
    impact: "medium",
  },
  {
    date: "2027-04-26",
    jurisdiction: "US Federal (ADA Title II — Small Entities)",
    description: "State and local government entities serving fewer than 50,000 people must conform to WCAG 2.1 AA.",
    impact: "high",
  },
  {
    date: "2027-06-28",
    jurisdiction: "European Union (EAA Transition)",
    description: "Two-year transition period ends for existing products and services under the European Accessibility Act. All covered products must fully comply.",
    impact: "high",
  },
  {
    date: "2026-06-30",
    jurisdiction: "EU Member States",
    description: "First EAA compliance reports due from national monitoring authorities. Member states report to European Commission on enforcement activities.",
    impact: "medium",
  },
  {
    date: "2026-09-01",
    jurisdiction: "Canada (Federal ACA)",
    description: "Next wave of Accessible Canada Act regulations expected. Expanding scope to cover additional sectors and digital services.",
    impact: "medium",
  },
]

// ===== STATE FILING DATA (Top 10 US States 2025) =====
export const stateFilingData: StateFilingEntry[] = [
  { rank: 1, state: "California", abbreviation: "CA", filings2025: 3252, primaryLaw: "Unruh Civil Rights Act", trend: "up" },
  { rank: 2, state: "Florida", abbreviation: "FL", filings2025: 1823, primaryLaw: "Florida Civil Rights Act", trend: "up" },
  { rank: 3, state: "New York", abbreviation: "NY", filings2025: 1274, primaryLaw: "NYSHRL / NYCHRL", trend: "stable" },
  { rank: 4, state: "Illinois", abbreviation: "IL", filings2025: 892, primaryLaw: "IL Human Rights Act", trend: "up" },
  { rank: 5, state: "Pennsylvania", abbreviation: "PA", filings2025: 567, primaryLaw: "PA Human Relations Act", trend: "up" },
  { rank: 6, state: "Texas", abbreviation: "TX", filings2025: 498, primaryLaw: "TX Human Resources Code", trend: "up" },
  { rank: 7, state: "New Jersey", abbreviation: "NJ", filings2025: 423, primaryLaw: "NJ Law Against Discrimination", trend: "stable" },
  { rank: 8, state: "Massachusetts", abbreviation: "MA", filings2025: 387, primaryLaw: "MA Anti-Discrimination Law", trend: "up" },
  { rank: 9, state: "Connecticut", abbreviation: "CT", filings2025: 312, primaryLaw: "CT CUTPA / Human Rights", trend: "up" },
  { rank: 10, state: "Colorado", abbreviation: "CO", filings2025: 287, primaryLaw: "HB21-1110", trend: "up" },
]

// ===== PENALTY COMPARISON (for chart, normalized to USD) =====
export const penaltyComparisonData = [
  { jurisdiction: "EU (Spain)", maxPenaltyUSD: 1100000, label: "\u20AC1,000,000", color: "#3b82f6" },
  { jurisdiction: "EU (Germany)", maxPenaltyUSD: 550000, label: "\u20AC500,000", color: "#6366f1" },
  { jurisdiction: "Canada (ACA)", maxPenaltyUSD: 185000, label: "$250K CAD", color: "#ef4444" },
  { jurisdiction: "US (ADA Title II)", maxPenaltyUSD: 150000, label: "$150,000", color: "#f59e0b" },
  { jurisdiction: "UK", maxPenaltyUSD: 130000, label: "\u00A3100,000+", color: "#10b981" },
  { jurisdiction: "US (CVAA)", maxPenaltyUSD: 100000, label: "$100,000", color: "#f97316" },
  { jurisdiction: "US (ADA Title III)", maxPenaltyUSD: 75000, label: "$75,000", color: "#eab308" },
  { jurisdiction: "Canada (AODA)", maxPenaltyUSD: 74000, label: "$100K CAD/day", color: "#ec4899" },
  { jurisdiction: "Australia", maxPenaltyUSD: 65000, label: "AUD 100,000", color: "#8b5cf6" },
  { jurisdiction: "Israel", maxPenaltyUSD: 20000, label: "ILS 75,000", color: "#14b8a6" },
]

// ===== WCAG VERSION GROUPING =====
export const wcagVersionGroups = [
  {
    version: "WCAG 2.2 AA",
    color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    laws: ["UK Equality Act"],
  },
  {
    version: "WCAG 2.1 AA",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    laws: ["ADA Title II", "ADA Title III (de facto)", "EU/EAA (EN 301 549)", "Canada ACA", "Colorado HB21-1110", "California Unruh (via ADA)"],
  },
  {
    version: "WCAG 2.0 AA",
    color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
    laws: ["Section 508", "Canada AODA", "Japan JIS", "Israel IS 5568", "Norway (private sector)"],
  },
  {
    version: "Unspecified",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
    laws: ["Section 504", "Florida", "Illinois", "Texas", "Massachusetts", "Pennsylvania", "New Jersey", "Connecticut"],
  },
]
