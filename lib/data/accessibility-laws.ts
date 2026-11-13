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
// Re-reviewed October 28, 2026: no DOJ or HHS final rule, no ruling in NFB v. DOJ, no EAA fine,
// no OJ citation of EN 301 549 v4.1.1. Added the HHS/ONC final rule (FR 2026-21943, October 28,
// 2026, effective December 28, 2026) that drops WCAG 2.0 Level A from health IT certification.
// Corrected penalties against primary sources: ADA Title III civil penalties are $118,225 / $236,451
// (28 CFR 85.5); ADA Title II has no civil-penalty provision; CVAA forfeitures are $144,329 per
// violation or day (47 CFR 1.80); Germany's BFSG caps fines at EUR 100,000 (section 37(2)); the
// Australian DDA sets no statutory fine. Removed an unsourced state filings table that contradicted
// the lawsuit tracker, and the summary counts are now derived from this file.
// Re-reviewed November 11, 2026 against primary sources (Justice Laws, Canada Gazette SOR/2025-255,
// ontario.ca, e-Laws, leg.colorado.gov, Irish Statute Book): Canada ACA effective date corrected to
// July 11, 2019 and its update and penalty text rewritten (SOR/2025-255 ICT duties are all "minor"
// violations); Ontario reporting row no longer says the public sector is due in 2026; AODA penalty
// text separates administrative penalties from offence fines; Colorado HB21-1110 covers public
// entities only; Hawaii comment period has closed with no final rule; deadlines sorted by date.
// Re-reviewed November 14, 2026: Norway row no longer claims the EAA applies via the EEA (Directive
// 2019/882 is not yet incorporated into the EEA Agreement); Texas penalty rewritten from Hum. Res.
// Code 121.004 and 121.0041; Unruh penalty from Civ. Code 52(a); Colorado statutory fine is a fixed
// $3,500; unsourced Florida, New York and Illinois filing figures replaced with the lawsuit tracker's
// Seyfarth counts; EAA row penalty text follows the EAA
// penalties register; placeholder maxFineNumeric values for laws with no fixed maximum set to 0;
// Japan row notes the April 1, 2024 reasonable accommodation duty for private businesses.
// Not changed (only secondary or unconfirmed evidence): Israel penalty, Massachusetts remedies,
// and the 2026 Missouri, Utah and Georgia laws on abusive website suits.

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
      description: "No civil-penalty provision. Remedies are court-ordered compliance, compensatory damages and attorney fees, through DOJ enforcement, agency complaints or private suits.",
      maxFine: "No civil penalty (injunctive relief + damages)",
      maxFineNumeric: 0,
      currency: "USD",
    },
    status: "active",
    keyDate: "2027-04-26",
    keyDateLabel: "Extended compliance deadline for entities serving 50,000+ people",
    recentUpdate: "DOJ final rule (April 2024) formally requires WCAG 2.1 AA for state/local government websites. On April 20, 2026 a DOJ Interim Final Rule extended the compliance deadlines by one year: April 26, 2027 for entities serving 50,000+ people and April 26, 2028 for smaller entities and special districts. The National Federation of the Blind is challenging the extension in federal court (D. Md. No. 1:26-cv-02007) and moved for summary judgment on September 28, 2026; the government moved for more time to respond on November 12, 2026, and there was no ruling as of November 14, 2026. DOJ's Unified Agenda also lists a proposed rule to reconsider parts of the 2024 rule, with its date to be determined.",
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
      description: "No damages for private plaintiffs (injunctive relief + attorney fees). In DOJ suits, courts can impose civil penalties of up to $118,225 for a first violation and $236,451 for a subsequent one (inflation-adjusted, 28 CFR 85.5).",
      maxFine: "$118,225 first / $236,451 repeat (DOJ suits)",
      maxFineNumeric: 236451,
      currency: "USD",
    },
    status: "active",
    recentUpdate: "3,117 federal web accessibility lawsuits filed in 2025, a 27% increase from 2024. There is no Title III web regulation; courts and settlements commonly use WCAG 2.1 AA as the benchmark, but it is not a binding Title III standard.",
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
      description: "FCC enforcement. Forfeitures under 47 U.S.C. 503(b)(2)(F) for inaccessible advanced communications services and equipment, inflation-adjusted to $144,329 per violation or day and $1,443,275 per act (47 CFR 1.80).",
      maxFine: "$144,329 per violation or day",
      maxFineNumeric: 144329,
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
    citation: "Cal. Civ. Code \u00A7\u00A7 51, 52",
    yearEnacted: 1959,
    effectiveDate: "1959-01-01",
    appliesTo: ["private", "ecommerce", "healthcare", "financial"],
    wcagVersion: "2.1 AA (via ADA incorporation)",
    enforcement: ["private-lawsuit"],
    penalties: {
      description: "Actual damages plus a statutory amount of up to three times actual damages, but never less than $4,000 per violation (Civ. Code 52(a)), plus attorney fees.",
      maxFine: "$4,000+ per violation",
      maxFineNumeric: 4000,
      currency: "USD",
    },
    status: "active",
    recentUpdate: "AB 1757 died without passage in 2024; its successor AB 2190, which would mandate WCAG conformance for California business websites, was ordered to the Assembly inactive file on May 21, 2026 and was never taken back up. August 31, 2026 was the final day for each house to pass bills in the 2025-26 session, so the bill died there and would have to be reintroduced in the 2027-28 session. California still has no statutory WCAG mandate for private business websites.",
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
      maxFineNumeric: 0,
      currency: "USD",
    },
    status: "active",
    recentUpdate: "New York was the top state for federal website accessibility lawsuits in 2025, with 1,021 of 3,117 (Seyfarth Shaw). The NYC Human Rights Law provides broader protections than the federal ADA, including damages.",
  },
  {
    id: "colorado-hb21-1110",
    jurisdiction: "Colorado",
    region: "us-state",
    lawName: "HB21-1110 (Accessibility for Online Services)",
    citation: "C.R.S. \u00A7 24-85-101 et seq.",
    yearEnacted: 2021,
    effectiveDate: "2024-07-01",
    appliesTo: ["government"],
    wcagVersion: "2.1 AA",
    enforcement: ["private-lawsuit", "government"],
    penalties: {
      description: "Court-ordered compliance, actual damages and attorney fees, or a statutory fine of $3,500 payable to each plaintiff for each violation.",
      maxFine: "$3,500 per violation",
      maxFineNumeric: 3500,
      currency: "USD",
    },
    status: "active",
    recentUpdate: "Covers the services, programs and activities of public entities and state agencies; it does not apply to private businesses. HB24-1454 gave entities that could show good-faith remediation efforts protection until July 1, 2025; that period has ended.",
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
    recentUpdate: "Florida was the second state for federal website accessibility lawsuits in 2025, with 961 of 3,117 (Seyfarth Shaw).",
  },
  {
    id: "illinois",
    jurisdiction: "Illinois",
    region: "us-state",
    lawName: "Illinois Human Rights Act",
    citation: "775 ILCS 5/",
    yearEnacted: 1979,
    effectiveDate: "1980-01-01",
    appliesTo: ["private", "government"],
    wcagVersion: "Unspecified",
    enforcement: ["private-lawsuit", "complaints"],
    penalties: {
      description: "Compensatory damages, attorney fees, and civil penalties available.",
      maxFine: "Compensatory + civil penalties",
      maxFineNumeric: 0,
      currency: "USD",
    },
    status: "active",
    recentUpdate: "Illinois was the third state for federal website accessibility lawsuits in 2025, with 585 of 3,117 (Seyfarth Shaw).",
  },
  {
    id: "texas",
    jurisdiction: "Texas",
    region: "us-state",
    lawName: "Texas Human Resources Code",
    citation: "Tex. Hum. Res. Code \u00A7\u00A7 121.003, 121.004, 121.0041",
    yearEnacted: 1985,
    effectiveDate: "1985-01-01",
    appliesTo: ["private", "government"],
    wcagVersion: "Unspecified",
    enforcement: ["private-lawsuit"],
    penalties: {
      description: "A violation is a misdemeanor with a fine of up to $300 plus 30 hours of community service (121.004(a)). In a civil action, damages are conclusively presumed to be at least $300 (121.004(b)), a floor rather than a cap.",
      maxFine: "Damages presumed at least $300",
      maxFineNumeric: 0,
      currency: "USD",
    },
    status: "active",
    recentUpdate: "Since September 1, 2017 (section 121.0041), a plaintiff suing over technical standards, which the section says include Internet website accessibility guidelines, must give the business 60 days' written notice and a chance to fix the problem before filing.",
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
      maxFineNumeric: 0,
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
      maxFineNumeric: 0,
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
      maxFineNumeric: 0,
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
      maxFineNumeric: 0,
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
    keyDateLabel: "Public comment closed on the HCRC proposed rules; no final rule adopted as of November 14, 2026, so no compliance date yet",
    recentUpdate: "Signed July 14, 2026, Act 257 makes it a discriminatory practice for a place of public accommodation to require technology that is not accessible, and directs the Hawaii Civil Rights Commission to adopt rules consistent with the DOJ Title II web rule. The HCRC posted proposed rules on September 18, 2026: WCAG 2.1 Level A and AA for web content and mobile apps, 24 months after the final rule for businesses with 100 or more employees and 36 months for everyone else. Comments closed October 30, 2026. No adopted rule and no scheduled public hearing were found as of November 14, 2026, so there is no compliance date yet, and the dates, tiers and size threshold may change in the final rule.",
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
      description: "Penalties are set by each Member State and vary widely: fixed maximums such as Germany's \u20AC100,000 (BFSG section 37(2)) and France's \u20AC7,500 per offence (\u20AC15,000 on repeat, Consumer Code R.451-4), and turnover-based or higher caps elsewhere. See the EAA penalties register for every verified route.",
      maxFine: "Varies by Member State",
      maxFineNumeric: 1100000,
      currency: "EUR",
    },
    status: "active",
    keyDate: "2025-06-28",
    keyDateLabel: "EAA enforcement began across all EU member states",
    recentUpdate: "Enforceable since June 28, 2025. Covers e-commerce, banking, transport, telecoms. First court order to comply: on June 4, 2026 the Tribunal judiciaire de Caen, in an interim first-instance order, told Carrefour France to comply, under a 500 euro daily penalty starting six months later, and awarded the associations that sued 10,000 euros in provisional damages and 3,000 euros in costs. The Dutch regulator ACM reported in March 2026 that 61% of the largest Dutch webshops fail accessibility requirements; NOS reported in June 2026 that it had visited ten large webshops and planned a new test after three months, with fines possible. In France the Lille court refused interim relief in a similar case against Auchan E-Commerce France in May 2026, without ruling on the merits, and the associations say they will appeal. ETSI published EN 301 549 v4.1.1, which incorporates WCAG 2.2 and maps to the EAA, on September 2, 2026. No edition is yet cited in the Official Journal under the EAA (v3.2.1, WCAG 2.1 AA, is cited only for the Web Accessibility Directive and is the working benchmark), so the EAA's presumption of conformity becomes available when v4.1.1 is cited; it was not yet cited as of November 14, 2026, and Ireland's National Disability Authority expects December 16, 2026. We found no EAA fine on a business publicly confirmed by a member-state regulator as of November 14, 2026. The only EAA fine so far is on a Member State: on March 19, 2026 the Court of Justice ordered Bulgaria to pay a EUR 1,500,000 lump sum for transposing the directive late (Case C-646/24).",
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
      maxFineNumeric: 0,
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
    effectiveDate: "2019-07-11",
    appliesTo: ["government", "private"],
    wcagVersion: "2.1 AA (via EN 301 549/ICT standard)",
    enforcement: ["regulatory", "complaints"],
    penalties: {
      description: "The Act caps an administrative monetary penalty at $250,000 CAD per violation (s. 91(2)), and a violation that continues for more than one day is a separate violation each day (s. 88). Every ICT obligation added by SOR/2025-255 is classed as a minor violation: for regulated entities other than small businesses, $1,000 to $10,000 for a first violation, rising to $50,000 to $75,000 for a fourth or later. The Accessibility Commissioner can also issue compliance orders and publish the names of violators.",
      maxFine: "$250,000 CAD cap per violation (ICT violations: $1,000 to $75,000)",
      maxFineNumeric: 185000,
      currency: "CAD",
    },
    status: "active",
    recentUpdate: "Amending regulations SOR/2025-255, registered December 5, 2025 and published December 17, 2025, add ICT requirements based on the CAN/ASC - EN 301 549 standard (WCAG 2.1 AA); none was in force as of November 11, 2026. From December 5, 2027, federal public sector web pages created or updated on or after that date must conform to the extent feasible, federal entities publish accessibility statements, and the public sector and federally regulated businesses with 100 or more employees must train staff who develop, maintain or procure ICT. From December 5, 2028, businesses with 100 or more employees must make new or updated web pages conform. Large businesses (500 or more) and the federal public sector also take on new mobile apps, downloadable documents, an assessment of existing apps and conformity checks when procuring ICT, and large businesses publish accessibility statements. Existing content does not have to be fixed unless it is updated. Broadcasting, telecommunications and transportation providers are excluded from the public-facing web, app and document duties. Every ICT obligation is classed as a minor violation.",
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
      description: "Administrative penalties for corporations run from $500 to $15,000 (O. Reg. 191/11, Schedule 3). Only where both the impact and the history of a contravention are major can a director treat the penalty as daily, up to $100,000 per day for a corporation. Convictions for offences under AODA s. 37 (false or misleading information in a report, failing to comply with an order, or reprisal) carry fines of up to $100,000 per day for a corporation and $50,000 per day for anyone else.",
      maxFine: "$100,000 CAD/day (offence fines and the most serious penalties)",
      maxFineNumeric: 74000,
      currency: "CAD",
    },
    status: "active",
    keyDate: "2026-12-31",
    keyDateLabel: "AODA compliance reports due from businesses and non-profits with 20 or more employees",
    recentUpdate: "Still on WCAG 2.0 AA despite federal ACA moving to 2.1. Businesses and non-profits with 20 or more employees report by December 31, 2026; designated public sector organizations report every two years and their last deadline was December 31, 2025.",
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
    recentUpdate: "IS 17802 (Parts 1 and 2), the Indian adoption of EN 301 549 V3.2.1, has been mandatory for websites, apps and other ICT under rule 15(1)(c)(iii) since May 11, 2023. On November 8, 2024 the Supreme Court (Rajive Raturi v. Union of India, 2024 INSC 858) held rule 15(1) ultra vires for offering guidelines rather than a non-negotiable floor and directed mandatory rules within three months. The draft Rights of Persons with Disabilities (Amendment) Rules, 2026 (S.O. 3962(E), Gazette of India Extraordinary, July 20, 2026) would replace rule 15(1)(c): every establishment, in India or abroad, serving persons in India must meet the Schedule I and II clauses within one year (turnover of ₹500 crore or more) or 18 months (others) and the full standard within two years of final publication, publish human-readable and machine-readable Accessibility Conformance Reports, and name a Grievance Redressal Officer. Comments closed in August 2026; not notified as of November 14, 2026. The Supreme Court listed the matter for January 2027.",
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
      description: "Complaints to the AHRC, then the Federal Court. No statutory fine; courts order damages and compliance.",
      maxFine: "No statutory fine (court remedies)",
      maxFineNumeric: 0,
      currency: "AUD",
    },
    status: "active",
    recentUpdate: "The DDA applies to goods, services and facilities offered online. The AHRC's World Wide Web Access advisory notes point to WCAG as the benchmark for accessible online services. The DDA itself does not name a WCAG version.",
    sourceUrl: "https://www.legislation.gov.au/C2004A04426/latest",
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
    recentUpdate: "JIS X 8341-3 is applied to government websites and procurement; private sector conformance is voluntary. Separately, since April 1, 2024 the amended Act for Eliminating Discrimination against Persons with Disabilities has required private businesses to provide reasonable accommodation, which can include accessible information and communication.",
    sourceUrl: "https://www8.cao.go.jp/shougai/suishin/sabekai.html",
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
      description: "Digdir enforces through audits and compliance orders, and can impose a running daily coercive fine (tvangsmulkt) with no statutory maximum (regulation section 7).",
      maxFine: "Coercive fines (no statutory max)",
      maxFineNumeric: 0,
      currency: "NOK",
    },
    status: "active",
    recentUpdate: "Private-sector websites must meet WCAG 2.0 A and AA except success criteria 1.2.3, 1.2.4 and 1.2.5; public bodies follow EN 301 549 V3.2.1. Digdir audits both sectors. The EAA is EEA-relevant but had not been incorporated into the EEA Agreement as of November 14, 2026, so it does not yet apply in Norway; Norwegian businesses selling into the EU must meet it there.",
    sourceUrl: "https://lovdata.no/dokument/SF/forskrift/2013-06-21-732",
  },
]

// ===== PRE-COMPUTED HERO STATS =====
// Counts are derived from the array above so headline copy cannot drift from the data.
export const lawsSummary = {
  totalLawsTracked: accessibilityLaws.length,
  totalJurisdictions: new Set(accessibilityLaws.map((l) => l.jurisdiction)).size,
  nextMajorDeadline: "April 26, 2027",
  nextMajorDeadlineLabel: "ADA Title II Compliance (extended)",
  maxAdaCivilPenalty: "$236,451",
  totalUsLawsuits2025: 3117,
}

// ===== ENFORCEMENT TRENDS (2018-2025) =====
// US federal website-accessibility filings, reused from the lawsuit tracker so the two research
// pages cannot disagree. The earlier EU enforcement series had no traceable source and was removed:
// no member state publishes a comparable count of EAA or Web Accessibility Directive actions.
export const enforcementTrends: EnforcementTrend[] = lawsuitsByYear.map((d) => ({
  year: d.year,
  usLawsuits: d.federalCourt,
}))

// ===== UPCOMING DEADLINES =====
// Reviewed November 14, 2026. Keep the list sorted by date. The original April 24, 2026 ADA Title II deadline was extended
// before it took effect by the DOJ Interim Final Rule of April 20, 2026. That rule took effect
// on publication and its comment period closed June 22, 2026 (Federal Register 2026-07663); no
// final rule has issued, so every date below still rests on the interim rule.
export const upcomingDeadlines: UpcomingDeadline[] = [
  {
    date: "2026-12-28",
    jurisdiction: "US Federal (HHS ONC health IT certification)",
    description: "An HHS/ONC final rule (Federal Register 2026-21943, October 28, 2026) takes effect, removing the WCAG 2.0 Level A requirement from the patient view, download and transmit certification criterion (45 CFR 170.315(e)(1)(i)). Section 504 and Section 1557 obligations on providers are unchanged.",
    impact: "medium",
  },
  {
    date: "2026-12-31",
    jurisdiction: "Ontario, Canada (AODA)",
    description: "Accessibility compliance reports due from businesses and non-profits with 20 or more employees in Ontario (three-year cycle). Designated public sector organizations report every two years; their last deadline was December 31, 2025. Separately, the IASR (O. Reg. 191/11, s. 14) already requires designated public sector organizations and organizations with 50 or more employees in Ontario to meet WCAG 2.0 Level AA for internet websites and web content published after January 1, 2012, where practicable, except success criteria 1.2.4 Captions (Live) and 1.2.5 Audio Description (Prerecorded).",
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
    description: "Latest date under Article 31(3) by which Member States must begin applying Article 4(8), the obligations on answering emergency communications to the single European emergency number 112. Some Member States applied it earlier: Ireland did not defer, and S.I. 636/2023 applies it from June 28, 2025.",
    impact: "high",
  },
  {
    date: "2027-12-05",
    jurisdiction: "Canada (Federal ACA)",
    description: "First wave of the Accessible Canada Regulations ICT requirements (SOR/2025-255, incorporating CAN/ASC - EN 301 549): federal public sector web pages created or updated on or after this date, federal accessibility statements, and digital accessibility training for the public sector and for large and medium-sized federally regulated employers.",
    impact: "medium",
  },
  {
    date: "2028-04-26",
    jurisdiction: "US Federal (ADA Title II, Small Entities)",
    description: "Extended deadline: state and local government entities serving fewer than 50,000 people and special district governments must conform to WCAG 2.1 AA.",
    impact: "high",
  },
  {
    date: "2028-12-05",
    jurisdiction: "Canada (Federal ACA)",
    description: "Second wave of SOR/2025-255: large and medium-sized federally regulated businesses must make new and updated web pages conform. Large businesses and the federal public sector must also make new mobile apps and downloadable documents conform, assess their existing apps, and obtain conformity assessments when procuring ICT; large businesses publish their first accessibility statement.",
    impact: "medium",
  },
]

// ===== PENALTY COMPARISON (for chart, normalized to USD) =====
// Statutory maximum fines or civil penalties per violation, at approximate exchange rates
// (EUR 1 = USD 1.10, CAD 1 = USD 0.74, ILS 1 = USD 0.27). Checked November 14, 2026 against 28 CFR 85.5 (ADA Title
// III; no 2026 inflation increase, FR 2026-14236), 47 CFR 1.80 (CVAA, 47 U.S.C. 503(b)(2)(F)),
// BFSG section 37(2) and RDL 1/2013 arts 83 and 96 (Spain, unchanged by Ley 4/2026).
// Jurisdictions with no fixed maximum (UK Equality Act, Australian DDA) and ADA Title II,
// which has no civil-penalty provision, are left out rather than given a placeholder figure.
export const penaltyComparisonData = [
  { jurisdiction: "EU (Spain)", maxPenaltyUSD: 1100000, label: "\u20AC1,000,000", color: "#3b82f6" },
  { jurisdiction: "US (ADA Title III)", maxPenaltyUSD: 236451, label: "$236,451 repeat violation, DOJ suits", color: "#eab308" },
  { jurisdiction: "Canada (ACA)", maxPenaltyUSD: 185000, label: "$250K CAD cap per violation", color: "#ef4444" },
  { jurisdiction: "US (CVAA)", maxPenaltyUSD: 144329, label: "$144,329 per violation or day", color: "#f97316" },
  { jurisdiction: "EU (Germany)", maxPenaltyUSD: 110000, label: "\u20AC100,000", color: "#6366f1" },
  { jurisdiction: "Canada (AODA)", maxPenaltyUSD: 74000, label: "$100K CAD/day (offences, major penalties)", color: "#ec4899" },
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
