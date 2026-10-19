// Accessibility Laws by Jurisdiction — Global Legal Tracker 2026
// Data compiled from DOJ, W3C WAI, EU Commission, UsableNet, state legislature records
// Reviewed and updated August 27, 2026: DOJ Title II deadlines extended by the April 20, 2026
// Interim Final Rule; HHS Section 504 deadline extended May 2026; Caen court ruling on the EAA
// (June 4, 2026); UK Services Code of Practice in force August 5, 2026; FCC caption display
// settings compliance date reached August 17, 2026; California AB 2190 status from leginfo.
// Re-reviewed September 16, 2026: California AB 2190 died on the inactive file when the 2025-26
// session's August 31, 2026 bill-passage deadline passed (last action still May 21, 2026 per
// leginfo). EUR-Lex NIM for CELEX 32019L0882 re-counted at 378 measures across 27 member states,
// unchanged. No DOJ final rule, no ruling in the NFB challenge, and still no confirmed EAA fine.
// Re-reviewed October 14, 2026: NFB moved for summary judgment on September 28, 2026 (D. Md.
// No. 1:26-cv-02007, docket entry 16), still no ruling. ETSI published EN 301 549 v4.1.1
// (WCAG 2.2) on September 2, 2026; not yet cited in the Official Journal (NDA Ireland expects
// December 16, 2026). v3.2.1 is cited only under the Web Accessibility Directive, not the EAA. Hawaii Act 257 signed
// July 14, 2026; HCRC proposed rules posted September 18, 2026 (comments to October 30, 2026).
// Corrected: Section 508 still incorporates WCAG 2.0 AA (2017 refresh); Canada ACA business
// dates are December 5, 2028. Enforcement chart now reuses the lawsuit tracker's federal series.
// Re-reviewed October 19, 2026: added India (RPwD Act 2016, IS 17802 mandatory since May 11, 2023,
// draft RPwD (Amendment) Rules 2026 S.O. 3962(E) of July 16, 2026, not yet notified).

import { lawsuitsByYear } from "./lawsuit-statistics"

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
  nextMajorDeadline: "April 26, 2027",
  nextMajorDeadlineLabel: "ADA Title II Compliance (extended)",
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
    effectiveDate: "2027-04-26",
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
    keyDate: "2027-04-26",
    keyDateLabel: "Extended compliance deadline for entities serving 50,000+ people",
    recentUpdate: "DOJ final rule (April 2024) formally requires WCAG 2.1 AA for state/local government websites. On April 20, 2026 a DOJ Interim Final Rule extended the compliance deadlines by one year: April 26, 2027 for entities serving 50,000+ people and April 26, 2028 for smaller entities and special districts. The National Federation of the Blind is challenging the extension in federal court (D. Md. No. 1:26-cv-02007) and moved for summary judgment on September 28, 2026; no ruling as of October 14, 2026.",
    sourceUrl: "https://www.ada.gov/resources/2024-03-08-web-rule/",
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
    wcagVersion: "2.0 AA (36 CFR 1194, 2017 refresh)",
    enforcement: ["complaints", "government"],
    penalties: {
      description: "Federal agencies must comply. Non-compliance results in corrective action orders and potential funding impacts.",
      maxFine: "N/A (corrective action)",
      maxFineNumeric: 0,
      currency: "USD",
    },
    status: "active",
    recentUpdate: "The Revised 508 Standards (36 CFR Part 1194, January 2017 refresh) incorporate WCAG 2.0 Level AA by reference; the Access Board has not adopted WCAG 2.1 or 2.2. The FY2025 Governmentwide Section 508 Assessment, published March 2026, rated 60 federal agencies on conformance and program maturity.",
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
    recentUpdate: "HHS extended the first web and mobile-app compliance deadline under its Section 504 rule to May 11, 2027 for recipients with 15 or more employees (May 10, 2028 for smaller recipients) via a May 2026 interim final rule that the NFB is challenging in the same D. Md. case (summary judgment motion filed September 28, 2026). Increasingly used in education and healthcare accessibility complaints alongside ADA claims.",
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
    recentUpdate: "The FCC's closed captioning display settings rule, requiring caption settings to be readily accessible on covered devices and services, reached its compliance deadline on August 17, 2026 and is now in effect.",
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
    recentUpdate: "3,252 ADA/Unruh filings in 2025, leading all states. AB 1757 died without passage in 2024; its successor AB 2190, which would mandate WCAG conformance for California business websites, was ordered to the Assembly inactive file on May 21, 2026 and was never taken back up. August 31, 2026 was the final day for each house to pass bills in the 2025-26 session, so the bill died there and would have to be reintroduced in the 2027-28 session. California still has no statutory WCAG mandate for private business websites.",
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
  {
    id: "hawaii-act-257",
    jurisdiction: "Hawaii",
    region: "us-state",
    lawName: "Hawaii Act 257 (2026): Digital Accessibility in Public Accommodations",
    citation: "SLH 2026, Act 257 (S.B. 2852); proposed HAR Title 12, Ch. 46, Subch. 10",
    yearEnacted: 2026,
    effectiveDate: "2026-07-14",
    appliesTo: ["private", "ecommerce"],
    wcagVersion: "2.1 AA (proposed rules)",
    enforcement: ["complaints", "regulatory"],
    penalties: {
      description: "A violation of the rules is an unlawful discriminatory practice under HRS chapter 489, enforced through the Hawaii Civil Rights Commission complaint process.",
      maxFine: "Set by HRS ch. 489",
      maxFineNumeric: 0,
      currency: "USD",
    },
    status: "pending",
    keyDate: "2026-10-30",
    keyDateLabel: "Public comment closes on the HCRC proposed digital accessibility rules",
    recentUpdate: "Signed July 14, 2026, Act 257 makes it a discriminatory practice for a place of public accommodation to require technology that is not accessible, and directs the Hawaii Civil Rights Commission to adopt rules consistent with the DOJ Title II web rule. The HCRC posted proposed rules on September 18, 2026: WCAG 2.1 Level A and AA for web content and mobile apps, 24 months after the final rule for businesses with 100 or more employees and 36 months for everyone else. Comments close October 30, 2026 and the size threshold is still open for comment, so dates and tiers may change.",
    sourceUrl: "https://labor.hawaii.gov/hcrc/notice-seeking-public-comment-on-proposed-admin-rules-on-digital-accessibility/",
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
    recentUpdate: "Enforceable since June 28, 2025. Covers e-commerce, banking, transport, telecoms. First court ruling: on June 4, 2026 the Tribunal judiciaire de Caen ordered Carrefour to make its site and app accessible within six months under a 500 euro daily penalty, holding accessibility to be an obligation of result. The Dutch regulator ACM reported in March 2026 that 61% of the largest Dutch webshops fail accessibility requirements; in June 2026 it met the 10 weakest and said it would re-test them after three months, with fines possible. In France the Lille court dismissed a similar case against Auchan in May 2026 and the associations have appealed. ETSI published EN 301 549 v4.1.1, which incorporates WCAG 2.2 and maps to the EAA, on September 2, 2026. No edition is yet cited in the Official Journal under the EAA (v3.2.1, WCAG 2.1 AA, is cited only for the Web Accessibility Directive and is the working benchmark), so the EAA's presumption of conformity becomes available when v4.1.1 is cited, expected December 2026. No member-state regulator has publicly confirmed an EAA fine as of October 14, 2026.",
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
    recentUpdate: "WCAG 2.2 AA is now the benchmark. A new statutory Code of Practice for Services, Public Functions and Associations under the Equality Act came into force on August 5, 2026, replacing the 2011 code. UK businesses serving EU customers are also subject to EAA requirements.",
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
    recentUpdate: "Amending regulations registered December 5, 2025 (SOR/2025-255) add ICT requirements incorporating the CAN/ASC EN 301 549 standard, Federal public sector web pages must conform from December 5, 2027; large and medium-sized federally regulated businesses follow on December 5, 2028 for web pages (and, for large businesses, mobile apps and digital documents). Employee training is due December 5, 2027. Penalties up to $250K CAD.",
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
    id: "india-rpwd-ict",
    jurisdiction: "India",
    region: "asia-pacific",
    lawName: "India: RPwD Act 2016, rule 15 (IS 17802) and Draft RPwD (Amendment) Rules 2026",
    citation: "Act 49 of 2016, ss. 40, 46, 89; RPwD Rules 2017, r. 15(1)(c)(iii) (G.S.R. 359(E), 10 May 2023); draft S.O. 3962(E), 16 July 2026",
    yearEnacted: 2016,
    effectiveDate: "2023-05-11",
    appliesTo: ["government", "private", "ecommerce", "financial", "education", "healthcare"],
    wcagVersion: "2.1 AA (via IS 17802, the adoption of EN 301 549 V3.2.1)",
    enforcement: ["complaints", "regulatory", "government"],
    penalties: {
      description: "Section 89 of the RPwD Act: fine up to ₹10,000 for a first contravention and ₹50,000 to ₹5 lakh for subsequent ones. The draft 2026 rules add 90-day remediation orders, enhanced fines, and suspension or cancellation of registrations, certifications or approvals for continued non-compliance.",
      maxFine: "₹5,00,000",
      maxFineNumeric: 5700,
      currency: "INR",
    },
    status: "pending",
    recentUpdate: "IS 17802 (Parts 1 and 2), the Indian adoption of EN 301 549 V3.2.1, has been mandatory for websites, apps and other ICT under rule 15(1)(c)(iii) since May 11, 2023. On November 8, 2024 the Supreme Court (Rajive Raturi v. Union of India, 2024 INSC 858) held rule 15(1) ultra vires for offering guidelines rather than a non-negotiable floor and directed mandatory rules within three months. The draft Rights of Persons with Disabilities (Amendment) Rules, 2026 (S.O. 3962(E), Gazette of India Extraordinary, July 20, 2026) would replace rule 15(1)(c): every establishment, in India or abroad, serving persons in India must meet the Schedule I and II clauses within one year (turnover of ₹500 crore or more) or 18 months (others) and the full standard within two years of final publication, publish human-readable and machine-readable Accessibility Conformance Reports, and name a Grievance Redressal Officer. Comments closed in August 2026; not notified as of October 19, 2026. The Supreme Court listed the matter for January 2027.",
    sourceUrl: "https://egazette.gov.in/WriteReadData/2026/274669.pdf",
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
      description: "Complaints to AHRC. Court-ordered damages and compliance orders.",
      maxFine: "AUD 100,000",
      maxFineNumeric: 65000,
      currency: "AUD",
    },
    status: "active",
    recentUpdate: "The DDA applies to goods, services and facilities offered online. The AHRC's World Wide Web Access advisory notes point to WCAG as the benchmark for accessible online services. The DDA itself does not name a WCAG version.",
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
// US federal website-accessibility filings, reused from the lawsuit tracker so the two research
// pages cannot disagree. The earlier EU enforcement series had no traceable source and was removed:
// no member state publishes a comparable count of EAA or Web Accessibility Directive actions.
export const enforcementTrends: EnforcementTrend[] = lawsuitsByYear.map((d) => ({
  year: d.year,
  usLawsuits: d.federalCourt,
}))

// ===== UPCOMING DEADLINES =====
// Reviewed October 14, 2026. The original April 24, 2026 ADA Title II deadline was extended
// before it took effect by the DOJ Interim Final Rule of April 20, 2026. That rule took effect
// on publication and its comment period closed June 22, 2026 (Federal Register 2026-07663); no
// final rule has issued, so every date below still rests on the interim rule.
export const upcomingDeadlines: UpcomingDeadline[] = [
  {
    date: "2026-12-31",
    jurisdiction: "Ontario, Canada (AODA)",
    description: "Accessibility compliance reports due from businesses and non-profits with 20+ employees and designated public-sector organizations. All public-facing websites and web content must meet WCAG 2.0 Level AA.",
    impact: "medium",
  },
  {
    date: "2027-04-26",
    jurisdiction: "US Federal (ADA Title II)",
    description: "Extended deadline: state and local government entities serving 50,000+ people must conform to WCAG 2.1 AA. Moved from April 24, 2026 by the DOJ Interim Final Rule of April 20, 2026; the extension is being challenged in court by the NFB, which moved for summary judgment on September 28, 2026.",
    impact: "critical",
  },
  {
    date: "2027-05-11",
    jurisdiction: "US Federal (HHS Section 504)",
    description: "Extended first compliance deadline for web and mobile-app accessibility under the HHS Section 504 rule, for federally funded recipients with 15 or more employees. Smaller recipients have until May 10, 2028.",
    impact: "high",
  },
  {
    date: "2027-06-28",
    jurisdiction: "European Union (EAA)",
    description: "End of the Article 4(8) derogation: the final date by which Member States may begin applying the obligations on answering emergency communications to the single European emergency number 112.",
    impact: "high",
  },
  {
    date: "2027-12-05",
    jurisdiction: "Canada (Federal ACA)",
    description: "First wave of the Accessible Canada Regulations ICT requirements (SOR/2025-255, incorporating CAN/ASC EN 301 549): federal public sector web pages, federal accessibility statements, and digital accessibility training for public sector, large and medium-sized employers.",
    impact: "medium",
  },
  {
    date: "2028-12-05",
    jurisdiction: "Canada (Federal ACA)",
    description: "Second wave of SOR/2025-255: large and medium-sized federally regulated businesses must make new and updated web pages conform, large businesses also new mobile apps and digital documents, and large businesses publish their first accessibility statement.",
    impact: "medium",
  },
  {
    date: "2028-04-26",
    jurisdiction: "US Federal (ADA Title II, Small Entities)",
    description: "Extended deadline: state and local government entities serving fewer than 50,000 people and special district governments must conform to WCAG 2.1 AA.",
    impact: "high",
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
    laws: ["ADA Title II", "ADA Title III (de facto)", "EU/EAA (EN 301 549)", "Canada ACA", "Colorado HB21-1110", "California Unruh (via ADA)", "Hawaii Act 257 (proposed rules)"],
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
