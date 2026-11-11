// Digital accessibility compliance deadlines, 2026 to 2030.
//
// Feeds /compliance/deadlines and its calendar feed at
// /compliance/deadlines/calendar.ics. Every row was read in a primary source
// (statute, regulation, Federal Register or eCFR, EUR-Lex, Canada Gazette,
// court filing, regulator page or the standards body itself) on the reviewed
// date below, unless its confidence says otherwise.
//
// Rules for editing:
// - `id` is permanent. It is the calendar UID stem (<id>@accessibility.build),
//   so a changed date must keep the same id or subscribers get a duplicate event.
// - Rows with no primary source URL stay out (the Carrefour France order and
//   penalty start, and the NFB summary judgment filing date, were left out for
//   that reason on 11 November 2026).
// - `computed` rows are dates worked out from a cadence the law states; say the
//   cadence in `cadence`. `expected` rows are an official body's expectation and
//   are not binding.
// - When a date passes, set status to "passed" on the next review. The page
//   also treats any date before today as passed when it renders.
// - No em or en dashes in any string.

export const DEADLINES_REVIEWED_ON = "11 November 2026"
export const DEADLINES_REVIEWED_ISO = "2026-11-11"

export type DeadlineRegion = "us-federal" | "us-states" | "eu" | "uk-ireland" | "canada" | "other"

export type DeadlineStatus =
  | "in-force"
  | "final-not-yet-in-force"
  | "proposed"
  | "expected"
  | "passed"
  | "computed"

export type DeadlineConfidence = "verified" | "derived" | "unverified"

export interface ComplianceDeadline {
  /** Stable slug. Doubles as the .ics UID stem and the page anchor. Never change it. */
  id: string
  /** ISO date, YYYY-MM-DD. */
  date: string
  /** True when the day itself is an expectation rather than a fixed date. */
  dateApprox?: boolean
  jurisdiction: string
  region: DeadlineRegion
  title: string
  /** Who the date applies to. */
  appliesTo: string
  /** What has to happen by the date. */
  requirement: string
  /** Technical standard named by the rule, where there is one. */
  standard?: string
  status: DeadlineStatus
  /** The date rests on a rule that is being challenged in court. */
  challenged?: boolean
  confidence: DeadlineConfidence
  /** For computed rows: the cadence the date was derived from. */
  cadence?: string
  /** A caveat shown with the row. */
  note?: string
  /** One or two sentences. */
  description: string
  sourceLabel: string
  sourceUrl: string
  /** An existing page on this site that covers the rule in depth. */
  related?: { href: string; label: string }
}

export const DEADLINE_REGIONS: { slug: DeadlineRegion; label: string }[] = [
  { slug: "us-federal", label: "US federal" },
  { slug: "us-states", label: "US states" },
  { slug: "eu", label: "European Union" },
  { slug: "uk-ireland", label: "UK and Ireland" },
  { slug: "canada", label: "Canada" },
  { slug: "other", label: "Other" },
]

export const DEADLINE_STATUS_META: Record<DeadlineStatus, { label: string; explanation: string }> = {
  "in-force": {
    label: "Binding date",
    explanation:
      "A compliance or reporting date set by a law, rule or standard that has already been adopted. Dates marked as challenged rest on a rule that is being contested in court.",
  },
  "final-not-yet-in-force": {
    label: "Adopted, takes effect on this date",
    explanation:
      "The law or rule has been adopted and published, but it does not take effect until the date shown.",
  },
  proposed: {
    label: "Proposed",
    explanation:
      "A draft rule. The date could change or disappear before the rule is adopted.",
  },
  expected: {
    label: "Expected, not confirmed",
    explanation:
      "An official body has said it expects something to happen on this date. It is not binding and may move.",
  },
  computed: {
    label: "Computed from cadence",
    explanation:
      "The law sets a recurring cycle (for example every two or three years) but does not print this specific date. We worked it out from the cycle, so confirm it with the regulator before relying on it.",
  },
  passed: {
    label: "Passed",
    explanation: "The date has already happened. Recently passed dates stay listed for context.",
  },
}

const FR_HHS_IFR =
  "https://www.federalregister.gov/documents/2026/05/11/2026-09266/extension-of-compliance-dates-for-nondiscrimination-on-the-basis-of-disability-accessibility-of-web"
const FR_DOJ_IFR =
  "https://www.federalregister.gov/documents/2026/04/20/2026-07663/extension-of-compliance-dates-for-nondiscrimination-on-the-basis-of-disability-accessibility-of-web"
const FR_ONC =
  "https://www.federalregister.gov/documents/2026/10/28/2026-21943/health-data-technology-and-interoperability-onc-deregulatory-actions-to-unleash-prosperity"
const ECFR_TITLE_II = "https://www.ecfr.gov/current/title-28/chapter-I/part-35/subpart-H/section-35.200"
const ECFR_504 = "https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-A/part-84/subpart-I/section-84.84"
const ECFR_HAC = "https://www.ecfr.gov/current/title-47/chapter-I/subchapter-B/part-20/section-20.19"
const ETSI_V411 = "https://www.etsi.org/deliver/etsi_en/301500_301599/301549/04.01.01_60/en_301549v040101p.pdf"
const EU_AI_OMNIBUS = "https://eur-lex.europa.eu/eli/reg/2026/1744/oj/eng"
const EU_EAA = "https://eur-lex.europa.eu/eli/dir/2019/882/oj/eng"
const EU_WAD = "https://eur-lex.europa.eu/eli/dir/2016/2102/oj/eng"
const EU_EDC = "https://eur-lex.europa.eu/eli/dir/2024/2841/oj/eng"
const CPPA_REGS = "https://cppa.ca.gov/regulations/pdf/ccpa_updates_cyber_risk_admt_appr_text.pdf"
const ONTARIO_REPORTING = "https://www.ontario.ca/page/completing-your-accessibility-compliance-report"
const CANADA_SOR_2025_255 = "https://gazette.gc.ca/rp-pr/p2/2025/2025-12-17/html/sor-dors255-eng.html"

const TITLE_II_GUIDE = { href: "/guides/doj-title-ii-deadline-extension", label: "DOJ Title II deadline extension guide" }
const SECTION_504_GUIDE = { href: "/guides/section-504-web-accessibility-deadline", label: "Section 504 deadline guide" }
const EN_V4_PAGE = { href: "/compliance/en-301-549-v4", label: "EN 301 549 V4.1.1 clause by clause" }
const EAA_PAGE = { href: "/compliance/eaa", label: "European Accessibility Act guide" }
const AI_LAW_PAGE = { href: "/compliance/ai", label: "AI accessibility law guide" }
const CANADA_PAGE = { href: "/compliance/canada", label: "Canada accessibility law guide" }

const CHALLENGED_NOTE =
  "Set by an interim final rule that the National Federation of the Blind is challenging in NFB v. DOJ (D. Md.). No ruling found as of 11 November 2026."

export const complianceDeadlines: ComplianceDeadline[] = [
  // ===== Recently passed (11 May to 10 November 2026) =====
  {
    id: "us-hhs-504-ifr-2026",
    date: "2026-05-11",
    jurisdiction: "United States (HHS)",
    region: "us-federal",
    title: "HHS extends Section 504 web and app deadlines",
    appliesTo: "Recipients of HHS federal financial assistance",
    requirement:
      "Interim final rule moves the WCAG 2.1 AA compliance dates to 11 May 2027 (15 or more employees) and 10 May 2028 (fewer than 15). Effective 7 May 2026.",
    standard: "WCAG 2.1 AA",
    status: "passed",
    confidence: "verified",
    description:
      "HHS published an interim final rule pushing its Section 504 web and mobile app deadlines back one year. The NFB is challenging it in federal court.",
    sourceLabel: "Federal Register 2026-09266, 91 FR 25496",
    sourceUrl: FR_HHS_IFR,
    related: SECTION_504_GUIDE,
  },
  {
    id: "co-sb26-189-signed",
    date: "2026-05-14",
    jurisdiction: "Colorado",
    region: "us-states",
    title: "Colorado signs SB26-189 automated decision-making law",
    appliesTo: "Developers and deployers of covered automated decision-making technology",
    requirement: "Repeals and replaces the 2024 Colorado AI Act; operative 1 January 2027.",
    status: "passed",
    confidence: "verified",
    description:
      "Colorado replaced its AI Act with a narrower automated decision-making law that takes effect on 1 January 2027 and requires notices to be accessible to people with disabilities.",
    sourceLabel: "Colorado General Assembly, SB26-189",
    sourceUrl: "https://leg.colorado.gov/bills/sb26-189",
    related: AI_LAW_PAGE,
  },
  {
    id: "us-nfb-v-doj-filed",
    date: "2026-05-21",
    jurisdiction: "United States (D. Md.)",
    region: "us-federal",
    title: "NFB sues DOJ and HHS over web rule delays",
    appliesTo: "DOJ ADA Title II and HHS Section 504 interim final rules",
    requirement:
      "Administrative Procedure Act challenge asking the court to vacate both extensions and restore the 2024 deadlines. No. 1:26-cv-02007-RDB.",
    status: "passed",
    confidence: "verified",
    description:
      "The National Federation of the Blind filed suit in Maryland federal court to undo the one-year extensions. No ruling found as of 11 November 2026.",
    sourceLabel: "Complaint, NFB v. DOJ (D. Md.)",
    sourceUrl: "https://browngold.com/wp-content/uploads/2026/05/NFB-v.-DOJ_5-21-2026.pdf",
    related: TITLE_II_GUIDE,
  },
  {
    id: "us-doj-title-ii-ifr-comments-close",
    date: "2026-06-22",
    jurisdiction: "United States (DOJ)",
    region: "us-federal",
    title: "Comments close on DOJ Title II extension",
    appliesTo: "Public",
    requirement:
      "Comment period on the 20 April 2026 interim final rule ended. No final rule found as of 11 November 2026.",
    status: "passed",
    confidence: "verified",
    description:
      "The public comment window on DOJ's one-year Title II extension closed. The interim rule remains in force.",
    sourceLabel: "Federal Register 2026-07663, 91 FR 20902",
    sourceUrl: FR_DOJ_IFR,
    related: TITLE_II_GUIDE,
  },
  {
    id: "hi-act-257-signed",
    date: "2026-07-14",
    jurisdiction: "Hawaii",
    region: "us-states",
    title: "Hawaii Act 257 signed",
    appliesTo: "Places of public accommodation",
    requirement:
      "Bars requiring inaccessible technology and directs the Hawaii Civil Rights Commission to adopt rules consistent with the DOJ Title II web rule.",
    standard: "WCAG 2.1 AA (proposed rules)",
    status: "passed",
    confidence: "verified",
    description:
      "Hawaii directed its civil rights commission to write a private-sector digital accessibility rule tied to the federal Title II framework. Compliance dates depend on the final rules.",
    sourceLabel: "Gov. Msg. No. 1359 (Act 257, S.B. 2852 CD1)",
    sourceUrl: "https://data.capitol.hawaii.gov/sessions/session2026/bills/GM1359_.PDF",
    related: { href: "/research/accessibility-laws", label: "Accessibility laws tracker" },
  },
  {
    id: "eu-ai-omnibus-in-force",
    date: "2026-07-27",
    jurisdiction: "European Union",
    region: "eu",
    title: "Digital Omnibus on AI enters into force",
    appliesTo: "AI providers and deployers",
    requirement:
      "Regulation (EU) 2026/1744 (Official Journal, 24 July 2026) moves the AI Act high-risk dates to 2 December 2027 (Annex III) and 2 August 2028 (Annex I).",
    status: "passed",
    confidence: "verified",
    description:
      "The AI Act amendment that delays high-risk obligations, including the Article 16(l) accessibility duty, entered into force three days after publication.",
    sourceLabel: "Regulation (EU) 2026/1744",
    sourceUrl: EU_AI_OMNIBUS,
    related: AI_LAW_PAGE,
  },
  {
    id: "eu-ai-act-art-50",
    date: "2026-08-02",
    jurisdiction: "European Union",
    region: "eu",
    title: "AI Act transparency duties apply (Article 50)",
    appliesTo: "Providers and deployers of AI systems that interact with people or generate content",
    requirement:
      "Tell people they are dealing with AI and label deepfakes. Article 50(5) requires this information to conform to the applicable accessibility requirements.",
    status: "passed",
    confidence: "verified",
    description:
      "The AI Act's general application date brought in chatbot and synthetic-content disclosure duties, which must themselves be accessible.",
    sourceLabel: "Regulation (EU) 2024/1689, Articles 50 and 113",
    sourceUrl: "https://eur-lex.europa.eu/eli/reg/2024/1689/oj/eng",
    related: AI_LAW_PAGE,
  },
  {
    id: "uk-services-code-2026",
    date: "2026-08-05",
    jurisdiction: "United Kingdom (Great Britain)",
    region: "uk-ireland",
    title: "New Equality Act Services Code of Practice in force",
    appliesTo: "Service providers, public bodies and associations",
    requirement:
      "Statutory code replacing the 2011 code. Courts must take it into account, including on reasonable adjustments.",
    status: "passed",
    confidence: "verified",
    description: "The EHRC's updated statutory code for services came into force, replacing the 2011 version.",
    sourceLabel: "GOV.UK, Equality Act 2010 Code of Practice 2026",
    sourceUrl:
      "https://www.gov.uk/government/publications/equality-act-2010-code-of-practice-for-services-public-functions-and-associations-2026",
    related: { href: "/compliance/uk", label: "UK website accessibility law" },
  },
  {
    id: "us-fcc-caption-settings",
    date: "2026-08-17",
    jurisdiction: "United States (FCC)",
    region: "us-federal",
    title: "FCC caption display settings rule applies",
    appliesTo: "Device manufacturers and multichannel video programming distributors",
    requirement:
      "Caption settings must be readily accessible on devices using next-generation operating systems deployed after this date (47 CFR 79.103(e)).",
    status: "passed",
    confidence: "verified",
    description: "New devices must make caption display settings easy to find and pass them to apps.",
    sourceLabel: "47 CFR 79.103(e)",
    sourceUrl: "https://www.ecfr.gov/current/title-47/chapter-I/subchapter-C/part-79/subpart-B/section-79.103",
  },
  {
    id: "etsi-en-301-549-v4-published",
    date: "2026-09-02",
    jurisdiction: "European Union (ETSI, CEN, CENELEC)",
    region: "eu",
    title: "EN 301 549 V4.1.1 published",
    appliesTo: "Reference standard for the EAA and the Web Accessibility Directive",
    requirement: "Aligns the web, document and software clauses with WCAG 2.2 and maps to EAA Annex I.",
    standard: "WCAG 2.2 AA",
    status: "passed",
    confidence: "verified",
    description:
      "The new European ICT accessibility standard was published. It has no legal effect under the EAA until it is cited in the Official Journal.",
    sourceLabel: "ETSI EN 301 549 V4.1.1 (2026-09)",
    sourceUrl: ETSI_V411,
    related: EN_V4_PAGE,
  },
  {
    id: "w3c-wcag-3-wd-2026-09",
    date: "2026-09-10",
    jurisdiction: "W3C",
    region: "other",
    title: "WCAG 3.0 Working Draft published",
    appliesTo: "Standard (draft)",
    requirement: "Draft only; not a compliance target.",
    status: "passed",
    confidence: "verified",
    description: "W3C published another WCAG 3.0 draft. W3C says it is years from being final.",
    sourceLabel: "W3C Technical Reports, WCAG 3.0 Working Draft",
    sourceUrl: "https://www.w3.org/TR/2026/WD-wcag-3.0-20260910/",
    related: { href: "/wcag-3", label: "WCAG 3.0 overview" },
  },
  {
    id: "us-texas-v-kennedy-judgment",
    date: "2026-09-23",
    jurisdiction: "United States (N.D. Tex.)",
    region: "us-federal",
    title: "Texas v. Kennedy final judgment",
    appliesTo: "HHS Section 504 rule",
    requirement:
      "Vacates the most integrated setting provisions of the 2024 rule. The web and app requirements in subpart I are not affected.",
    status: "passed",
    confidence: "verified",
    description:
      "A Texas federal court vacated the integration provisions of HHS's 2024 Section 504 rule. The web accessibility deadlines in subpart I still stand.",
    sourceLabel: "Order and Final Judgment, No. 5:24-cv-225-H, ECF 125",
    sourceUrl: "https://dredf.org/wp-content/uploads/2026/09/2026.09.23-DREDF-125.-Order-and-Final-Judgment-Access-Pass.pdf",
    related: SECTION_504_GUIDE,
  },
  {
    id: "us-onc-rule-published",
    date: "2026-10-28",
    jurisdiction: "United States (HHS ONC)",
    region: "us-federal",
    title: "ONC deregulatory health IT rule published",
    appliesTo: "Certified health IT developers",
    requirement: "Effective 28 December 2026.",
    status: "passed",
    confidence: "verified",
    description:
      "ONC published a rule that removes the WCAG 2.0 Level A requirement from a patient-access certification criterion.",
    sourceLabel: "Federal Register 2026-21943, 91 FR 67916",
    sourceUrl: FR_ONC,
  },
  {
    id: "hi-hcrc-comments-close",
    date: "2026-10-30",
    jurisdiction: "Hawaii",
    region: "us-states",
    title: "Comments close on Hawaii digital accessibility rules",
    appliesTo: "Places of public accommodation",
    requirement:
      "Comment period on the Hawaii Civil Rights Commission's proposed digital accessibility rules (WCAG 2.1 A and AA).",
    standard: "WCAG 2.1 AA (proposed)",
    status: "passed",
    confidence: "unverified",
    note: "Date carried from our earlier review. The commission's page blocked automated access on 11 November 2026, so it was not re-read.",
    description:
      "Public comment closed on Hawaii's proposed rules. No adopted rule found yet, so there is no compliance date.",
    sourceLabel: "Hawaii Civil Rights Commission, notice seeking public comment",
    sourceUrl: "https://labor.hawaii.gov/hcrc/notice-seeking-public-comment-on-proposed-admin-rules-on-digital-accessibility/",
    related: { href: "/research/accessibility-laws", label: "Accessibility laws tracker" },
  },

  // ===== Upcoming =====
  {
    id: "us-fcc-peg-captioning-cert",
    date: "2026-11-25",
    jurisdiction: "United States (FCC)",
    region: "us-federal",
    title: "FCC captioning certification changes take effect",
    appliesTo: "PEG channel programmers, nonbroadcast networks and multichannel video programming distributors",
    requirement:
      "Exempts certain PEG and network programmers from registering and certifying captioning compliance; 47 CFR 79.1(i)(4) and (m)(6) are delayed indefinitely.",
    status: "final-not-yet-in-force",
    confidence: "verified",
    description:
      "A narrow FCC captioning rule trims certification paperwork. Captioning duties themselves are unchanged.",
    sourceLabel: "Federal Register 2026-21808, 91 FR 67220",
    sourceUrl: "https://www.federalregister.gov/documents/2026/10/26/2026-21808/closed-captioning-of-video-programming",
  },
  {
    id: "etsi-en-301-549-v4-doa",
    date: "2026-11-30",
    jurisdiction: "European Union (ETSI)",
    region: "eu",
    title: "EN 301 549 V4.1.1: latest national announcement",
    appliesTo: "National standards bodies",
    requirement: "Date of latest announcement (doa) printed in the standard.",
    standard: "EN 301 549 V4.1.1",
    status: "in-force",
    confidence: "verified",
    note: "A standards-body date, not a legal deadline and not an Official Journal citation date.",
    description:
      "National standards bodies must announce V4.1.1 by this date. It is often misreported as the EU citation date.",
    sourceLabel: "ETSI EN 301 549 V4.1.1, national transposition dates",
    sourceUrl: ETSI_V411,
    related: EN_V4_PAGE,
  },
  {
    id: "eu-ai-act-art-50-2-legacy",
    date: "2026-12-02",
    jurisdiction: "European Union",
    region: "eu",
    title: "AI Act: legacy generative systems must mark synthetic content",
    appliesTo: "Providers of generative AI systems placed on the market before 2 August 2026",
    requirement:
      "Comply with the Article 50(2) machine-readable marking duty (Article 111(4) as added by Regulation (EU) 2026/1744).",
    status: "in-force",
    confidence: "verified",
    description:
      "Generative AI systems already on the market get until this date to label their output as AI-generated.",
    sourceLabel: "Regulation (EU) 2026/1744",
    sourceUrl: EU_AI_OMNIBUS,
    related: AI_LAW_PAGE,
  },
  {
    id: "us-fcc-hac-manufacturers",
    date: "2026-12-14",
    jurisdiction: "United States (FCC)",
    region: "us-federal",
    title: "100% hearing aid compatible handsets: manufacturers",
    appliesTo: "Wireless handset manufacturers",
    requirement:
      "Every handset model offered must be hearing aid compatible, including Bluetooth coupling. Non-compatible models can no longer be certified and de minimis status ends.",
    standard: "47 CFR 20.19; 2019 ANSI C63.19",
    status: "in-force",
    confidence: "verified",
    description: "Every new phone model from a manufacturer must work with hearing aids, including over Bluetooth.",
    sourceLabel: "47 CFR 20.19(b)(2), (b)(5) and (c)(2)",
    sourceUrl: ECFR_HAC,
  },
  {
    id: "eu-en-301-549-v4-oj-expected",
    date: "2026-12-16",
    dateApprox: true,
    jurisdiction: "European Union",
    region: "eu",
    title: "EN 301 549 V4.1.1 expected in the Official Journal",
    appliesTo: "Economic operators under the European Accessibility Act",
    requirement:
      "Not cited as of 10 November 2026. Citation would give a presumption of conformity with the EAA accessibility requirements, effectively making WCAG 2.2 AA the EU benchmark.",
    standard: "EN 301 549 V4.1.1 (WCAG 2.2 AA)",
    status: "expected",
    confidence: "verified",
    note: "Deque updated its post on 10 November 2026 to say 22 January 2027, without giving a source. 30 November 2026 is ETSI's announcement date, not a citation date.",
    description:
      "Ireland's National Disability Authority says the citation is currently expected on 16 December 2026. Until it happens, no edition of EN 301 549 is cited under the EAA.",
    sourceLabel: "National Disability Authority (Ireland), EN 301 549 V4.1.1 published",
    sourceUrl: "https://nda.ie/news/en301549-published",
    related: EN_V4_PAGE,
  },
  {
    id: "us-onc-rule-effective",
    date: "2026-12-28",
    jurisdiction: "United States (HHS ONC)",
    region: "us-federal",
    title: "ONC rule drops WCAG 2.0 Level A from patient-access certification",
    appliesTo: "Certified health IT developers",
    requirement:
      "Removes the WCAG 2.0 Level A requirement from 45 CFR 170.315(e)(1)(i). Section 504 and Section 1557 duties on providers are unchanged.",
    status: "final-not-yet-in-force",
    confidence: "verified",
    description:
      "A health IT certification accessibility requirement is removed. Providers' own accessibility duties stay.",
    sourceLabel: "Federal Register 2026-21943",
    sourceUrl: FR_ONC,
  },
  {
    id: "on-aoda-report-business-2026",
    date: "2026-12-31",
    jurisdiction: "Ontario, Canada",
    region: "canada",
    title: "AODA compliance report due: businesses and non-profits",
    appliesTo: "Businesses and non-profits with 20 or more employees in Ontario",
    requirement:
      "File the accessibility compliance report (three-year cycle). Organizations with 50 or more employees must already meet WCAG 2.0 AA for web content under the IASR.",
    standard: "WCAG 2.0 AA",
    status: "in-force",
    confidence: "verified",
    note: "Designated public sector organizations are not due this year: their deadline was 31 December 2025.",
    description:
      "Ontario businesses and non-profits with 20 or more staff must file their AODA compliance report by year end. Public sector organizations filed in 2025.",
    sourceLabel: "Government of Ontario, completing your accessibility compliance report",
    sourceUrl: ONTARIO_REPORTING,
    related: CANADA_PAGE,
  },
  {
    id: "ny-stl-103d",
    date: "2027-01-01",
    jurisdiction: "New York",
    region: "us-states",
    title: "New York state agency websites must meet WCAG AA",
    appliesTo: "New York state agencies",
    requirement:
      "Websites created or modified after the effective date must conform to the most current WCAG Level AA to the extent practicable, or the agency posts a written progress report, updated annually.",
    standard: "Most current WCAG AA (ITS policy NYS-P08-005 names WCAG 2.2)",
    status: "in-force",
    confidence: "verified",
    description:
      "New York state agencies must have accessible websites or publish a progress report explaining why not.",
    sourceLabel: "N.Y. State Technology Law 103-d",
    sourceUrl: "https://www.nysenate.gov/legislation/laws/STT/103-D",
    related: { href: "/compliance/new-york", label: "New York accessibility laws" },
  },
  {
    id: "co-sb26-189-effective",
    date: "2027-01-01",
    jurisdiction: "Colorado",
    region: "us-states",
    title: "Colorado automated decision-making law takes effect",
    appliesTo: "Developers and deployers of covered automated decision-making technology used in consequential decisions",
    requirement:
      "Point-of-interaction notices and post-adverse-outcome disclosures, which must be reasonably accessible to consumers with disabilities (C.R.S. 6-1-1704(8)). Applies to decisions made on or after this date.",
    standard: "Accessible notices and disclosures",
    status: "final-not-yet-in-force",
    confidence: "verified",
    description:
      "Colorado's automated decision-making law starts applying. Its required notices must be accessible to people with disabilities.",
    sourceLabel: "SB26-189 final act, section 5",
    sourceUrl: "https://leg.colorado.gov/bill_files/116432/download",
    related: AI_LAW_PAGE,
  },
  {
    id: "ca-ccpa-admt-compliance",
    date: "2027-01-01",
    jurisdiction: "California",
    region: "us-states",
    title: "CCPA automated decision-making rules: compliance date",
    appliesTo: "CCPA-covered businesses already using automated decision-making technology for significant decisions",
    requirement:
      "Comply with Article 11 (pre-use notice, opt-out and access) by this date (11 CCR 7200(b)). Online notices must follow WCAG 2.1 (11 CCR 7003).",
    standard: "WCAG 2.1 for online notices",
    status: "in-force",
    confidence: "verified",
    description:
      "California's automated decision-making rules apply to businesses already using automated decisions. The notices they must give have to be accessible.",
    sourceLabel: "California Privacy Protection Agency, approved regulations text",
    sourceUrl: CPPA_REGS,
    related: AI_LAW_PAGE,
  },
  {
    id: "us-119th-congress-ends",
    date: "2027-01-03",
    jurisdiction: "United States (Congress)",
    region: "us-federal",
    title: "119th Congress ends",
    appliesTo: "Pending federal accessibility bills",
    requirement:
      "Bills not enacted lapse at noon, including H.R. 3417 and S. 3974 (Websites and Software Applications Accessibility Act).",
    status: "in-force",
    confidence: "verified",
    note: "A constitutional date, not a compliance deadline.",
    description:
      "Federal web accessibility bills still pending die when the Congress ends and would need to be reintroduced.",
    sourceLabel: "U.S. Constitution, 20th Amendment, section 1",
    sourceUrl: "https://constitution.congress.gov/constitution/amendment-20/",
  },
  {
    id: "us-ada-title-ii-large",
    date: "2027-04-26",
    jurisdiction: "United States (DOJ)",
    region: "us-federal",
    title: "ADA Title II web and app deadline: large governments",
    appliesTo: "State and local governments with a population of 50,000 or more (excluding special districts)",
    requirement: "Web content and mobile apps must conform to WCAG 2.1 Level A and AA (28 CFR 35.200(b)(1)).",
    standard: "WCAG 2.1 AA",
    status: "in-force",
    challenged: true,
    confidence: "verified",
    note: CHALLENGED_NOTE,
    description:
      "Large state and local governments must have accessible websites and apps. The date comes from an interim rule the NFB is challenging.",
    sourceLabel: "28 CFR 35.200, as amended by Federal Register 2026-07663",
    sourceUrl: ECFR_TITLE_II,
    related: TITLE_II_GUIDE,
  },
  {
    id: "us-hhs-504-large",
    date: "2027-05-11",
    jurisdiction: "United States (HHS)",
    region: "us-federal",
    title: "Section 504 web and app deadline: recipients with 15 or more employees",
    appliesTo: "Recipients of HHS federal financial assistance with 15 or more employees",
    requirement: "Web content and mobile apps must conform to WCAG 2.1 A and AA (45 CFR 84.84(b)(1)).",
    standard: "WCAG 2.1 AA",
    status: "in-force",
    challenged: true,
    confidence: "verified",
    note: CHALLENGED_NOTE,
    description:
      "Hospitals, clinics, insurers and other HHS-funded bodies with 15 or more staff must have accessible websites and apps.",
    sourceLabel: "45 CFR 84.84, as amended by Federal Register 2026-09266",
    sourceUrl: ECFR_504,
    related: SECTION_504_GUIDE,
  },
  {
    id: "etsi-en-301-549-v4-dop",
    date: "2027-05-31",
    jurisdiction: "European Union (ETSI)",
    region: "eu",
    title: "EN 301 549 V4.1.1: latest national publication",
    appliesTo: "National standards bodies",
    requirement: "Date of latest publication or endorsement as a national standard (dop/e).",
    standard: "EN 301 549 V4.1.1",
    status: "in-force",
    confidence: "verified",
    note: "A standards-body date, not a legal deadline.",
    description: "National standards bodies must publish V4.1.1 as a national standard by this date.",
    sourceLabel: "ETSI EN 301 549 V4.1.1",
    sourceUrl: ETSI_V411,
    related: EN_V4_PAGE,
  },
  {
    id: "eu-edc-transposition",
    date: "2027-06-05",
    jurisdiction: "European Union",
    region: "eu",
    title: "European Disability Card Directive transposition deadline",
    appliesTo: "EU Member States",
    requirement:
      "Adopt national measures for Directive (EU) 2024/2841. Article 11 requires card information in accessible formats, including digital and easy-to-read.",
    status: "in-force",
    confidence: "verified",
    description:
      "Member States must transpose the European Disability Card and Parking Card rules, including the accessible information duties.",
    sourceLabel: "Directive (EU) 2024/2841, Article 21",
    sourceUrl: EU_EDC,
  },
  {
    id: "us-fcc-hac-nationwide",
    date: "2027-06-14",
    jurisdiction: "United States (FCC)",
    region: "us-federal",
    title: "100% hearing aid compatible handsets: nationwide carriers",
    appliesTo: "Nationwide wireless service providers",
    requirement: "Every handset model offered must meet the manufacturer hearing aid compatibility requirements; de minimis status ends.",
    standard: "47 CFR 20.19",
    status: "in-force",
    confidence: "verified",
    description: "National carriers may only offer hearing aid compatible phones.",
    sourceLabel: "47 CFR 20.19(c)(4) and (e)(4)",
    sourceUrl: ECFR_HAC,
  },
  {
    id: "eu-eaa-112",
    date: "2027-06-28",
    jurisdiction: "European Union",
    region: "eu",
    title: "EAA: latest start for accessible 112 emergency communications",
    appliesTo: "Public safety answering points in Member States that deferred",
    requirement:
      "Article 31(3) lets Member States defer applying Article 4(8) (answering 112 emergency communications accessibly) until this date at the latest.",
    status: "in-force",
    confidence: "verified",
    note: "Some Member States applied it earlier. Ireland did not defer: S.I. 636/2023 applies it from 28 June 2025.",
    description: "The last permitted start date for accessible emergency-number answering across the EU.",
    sourceLabel: "Directive (EU) 2019/882, Article 31(3)",
    sourceUrl: EU_EAA,
    related: EAA_PAGE,
  },
  {
    id: "ca-gov-11546-7-cert-2027",
    date: "2027-06-30",
    jurisdiction: "California",
    region: "us-states",
    title: "California state agency website accessibility certification",
    appliesTo: "California state agencies and entities",
    requirement:
      "The director and chief information officer post a signed certification on the home page that the site meets Government Code 7405 and 11135 and WCAG 2.0 AA or later. The statute says before 1 July, so 30 June is the last day.",
    standard: "WCAG 2.0 AA or later",
    status: "computed",
    confidence: "derived",
    cadence: "Before 1 July every two years, starting 2019 (2019, 2021, 2023, 2025, 2027).",
    description:
      "California agencies must re-certify their websites' accessibility every two years. 2027 follows the 2025 cycle.",
    sourceLabel: "Cal. Gov. Code 11546.7 (AB 434)",
    sourceUrl: "https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=GOV&sectionNum=11546.7",
    related: { href: "/compliance/california", label: "California accessibility law" },
  },
  {
    id: "eu-ai-act-annex-iii",
    date: "2027-12-02",
    jurisdiction: "European Union",
    region: "eu",
    title: "AI Act high-risk rules apply (Annex III), including accessibility",
    appliesTo: "Providers of high-risk AI systems listed in Annex III (employment, education, essential services and others)",
    requirement:
      "Chapter III Sections 1 to 3 apply. Article 16(l): the system must comply with the accessibility requirements of Directives 2016/2102 and 2019/882.",
    status: "in-force",
    confidence: "verified",
    description: "High-risk AI used in areas like hiring and credit must meet EU accessibility requirements from this date.",
    sourceLabel: "Regulation (EU) 2024/1689 Article 113, as amended by Regulation (EU) 2026/1744",
    sourceUrl: EU_AI_OMNIBUS,
    related: AI_LAW_PAGE,
  },
  {
    id: "ca-acr-ict-wave-1",
    date: "2027-12-05",
    jurisdiction: "Canada (federal)",
    region: "canada",
    title: "Accessible Canada Regulations ICT requirements: first wave",
    appliesTo:
      "Federal public sector entities (web pages and accessibility statements); ICT training for the public sector and federally regulated businesses with 100 or more employees",
    requirement:
      "Web pages created or updated on or after this date must conform to the ICT Standard to the extent feasible; publish accessibility statements; train staff who develop, maintain or procure ICT.",
    standard: "CAN/ASC - EN 301 549 (WCAG 2.1 AA)",
    status: "final-not-yet-in-force",
    confidence: "verified",
    description:
      "Federal government web pages must meet the Canadian ICT accessibility standard, and covered employers must train ICT staff. Existing pages that are not updated do not have to be fixed.",
    sourceLabel: "SOR/2025-255, section 18(1), Canada Gazette Part II",
    sourceUrl: CANADA_SOR_2025_255,
    related: CANADA_PAGE,
  },
  {
    id: "eu-wad-monitoring-2027",
    date: "2027-12-23",
    jurisdiction: "European Union",
    region: "eu",
    title: "Web Accessibility Directive monitoring reports due",
    appliesTo: "EU Member States",
    requirement: "Report monitoring outcomes and measurement data to the Commission (Article 8(4)).",
    status: "computed",
    confidence: "derived",
    cadence: "By 23 December 2021 and every three years after (2021, 2024, 2027, 2030).",
    description: "Member States report how accessible public sector websites and apps are. The previous rounds were 2021 and 2024.",
    sourceLabel: "Directive (EU) 2016/2102, Article 8(4)",
    sourceUrl: EU_WAD,
  },
  {
    id: "ca-ccpa-risk-assessment-legacy",
    date: "2027-12-31",
    jurisdiction: "California",
    region: "us-states",
    title: "CCPA risk assessments due for pre-2026 processing",
    appliesTo: "CCPA-covered businesses with in-scope processing begun before 1 January 2026",
    requirement:
      "Conduct and document risk assessments (11 CCR 7155(b)), including automated decision-making for significant decisions.",
    status: "in-force",
    confidence: "verified",
    note: "A privacy rule rather than an accessibility rule, listed because it covers automated decision-making.",
    description: "Businesses must complete risk assessments for processing that started before 2026 and continues.",
    sourceLabel: "11 CCR 7155(b), CPPA approved regulations text",
    sourceUrl: CPPA_REGS,
    related: AI_LAW_PAGE,
  },
  {
    id: "on-aoda-report-public-2027",
    date: "2027-12-31",
    jurisdiction: "Ontario, Canada",
    region: "canada",
    title: "AODA compliance report due: designated public sector",
    appliesTo: "Designated public sector organizations in Ontario",
    requirement: "File the accessibility compliance report (two-year cycle; the previous deadline was 31 December 2025).",
    standard: "WCAG 2.0 AA (IASR)",
    status: "computed",
    confidence: "derived",
    cadence: "Every two years; Ontario says the last deadline was 31 December 2025 but has not printed the next one.",
    description: "Ontario's public sector files every two years. Confirm the 2027 date with Ontario before relying on it.",
    sourceLabel: "Government of Ontario, completing your accessibility compliance report",
    sourceUrl: ONTARIO_REPORTING,
    related: CANADA_PAGE,
  },
  {
    id: "ca-ccpa-risk-submission-2028",
    date: "2028-04-01",
    jurisdiction: "California",
    region: "us-states",
    title: "CCPA risk assessment submissions due",
    appliesTo: "CCPA-covered businesses",
    requirement:
      "Submit information on 2026 and 2027 risk assessments to the CPPA (11 CCR 7157(a)(1)), then annually by 1 April.",
    status: "in-force",
    confidence: "verified",
    note: "A privacy rule rather than an accessibility rule, listed because it covers automated decision-making.",
    description: "Businesses file summaries of their risk assessments with California's privacy regulator.",
    sourceLabel: "11 CCR 7157(a), CPPA approved regulations text",
    sourceUrl: CPPA_REGS,
    related: AI_LAW_PAGE,
  },
  {
    id: "us-ada-title-ii-small",
    date: "2028-04-26",
    jurisdiction: "United States (DOJ)",
    region: "us-federal",
    title: "ADA Title II web and app deadline: small governments and special districts",
    appliesTo: "Public entities with a population under 50,000 and all special district governments",
    requirement: "Web content and mobile apps must conform to WCAG 2.1 A and AA (28 CFR 35.200(b)(2)).",
    standard: "WCAG 2.1 AA",
    status: "in-force",
    challenged: true,
    confidence: "verified",
    note: CHALLENGED_NOTE,
    description: "Smaller towns, counties, school and transit districts must have accessible websites and apps.",
    sourceLabel: "28 CFR 35.200(b)(2)",
    sourceUrl: ECFR_TITLE_II,
    related: TITLE_II_GUIDE,
  },
  {
    id: "us-hhs-504-small",
    date: "2028-05-10",
    jurisdiction: "United States (HHS)",
    region: "us-federal",
    title: "Section 504 web and app deadline: recipients with fewer than 15 employees",
    appliesTo: "HHS-funded recipients with fewer than 15 employees",
    requirement: "Web content and mobile apps must conform to WCAG 2.1 A and AA (45 CFR 84.84(b)(2)).",
    standard: "WCAG 2.1 AA",
    status: "in-force",
    challenged: true,
    confidence: "verified",
    note: CHALLENGED_NOTE,
    description: "Small HHS-funded providers must have accessible websites and apps.",
    sourceLabel: "45 CFR 84.84(b)(2)",
    sourceUrl: ECFR_504,
    related: SECTION_504_GUIDE,
  },
  {
    id: "etsi-en-301-549-v4-dow",
    date: "2028-05-31",
    jurisdiction: "European Union (ETSI)",
    region: "eu",
    title: "EN 301 549: conflicting national standards withdrawn",
    appliesTo: "National standards bodies",
    requirement: "Date of withdrawal (dow) of conflicting national standards.",
    standard: "EN 301 549 V4.1.1",
    status: "in-force",
    confidence: "verified",
    note: "A standards-body date. Legal citations follow the Commission, not this date.",
    description: "National versions of earlier editions that conflict with V4.1.1 must be withdrawn.",
    sourceLabel: "ETSI EN 301 549 V4.1.1",
    sourceUrl: ETSI_V411,
    related: EN_V4_PAGE,
  },
  {
    id: "eu-edc-apply",
    date: "2028-06-05",
    jurisdiction: "European Union",
    region: "eu",
    title: "European Disability Card rules apply",
    appliesTo: "EU Member States",
    requirement: "Apply the Directive (EU) 2024/2841 measures; cards carry a QR code and digital anti-fraud features by this date.",
    status: "in-force",
    confidence: "verified",
    description: "Mutual recognition of the European Disability Card starts across Member States.",
    sourceLabel: "Directive (EU) 2024/2841, Articles 4 and 21",
    sourceUrl: EU_EDC,
  },
  {
    id: "us-fcc-hac-non-nationwide",
    date: "2028-06-13",
    jurisdiction: "United States (FCC)",
    region: "us-federal",
    title: "100% hearing aid compatible handsets: non-nationwide carriers",
    appliesTo: "Non-nationwide wireless service providers",
    requirement: "Every handset model offered must meet the manufacturer hearing aid compatibility requirements; de minimis status ends.",
    standard: "47 CFR 20.19",
    status: "in-force",
    confidence: "verified",
    description: "Regional and smaller carriers may only offer hearing aid compatible phones.",
    sourceLabel: "47 CFR 20.19(c)(6) and (e)(4)",
    sourceUrl: ECFR_HAC,
  },
  {
    id: "eu-ai-act-annex-i",
    date: "2028-08-02",
    jurisdiction: "European Union",
    region: "eu",
    title: "AI Act high-risk rules apply (Annex I products)",
    appliesTo: "Providers of AI that is a safety component of products under Annex I legislation",
    requirement: "Chapter III Sections 1 to 3 apply, including the Article 16(l) accessibility duty.",
    status: "in-force",
    confidence: "verified",
    description:
      "High-risk AI built into regulated products such as machinery, medical devices and toys must meet accessibility requirements.",
    sourceLabel: "Regulation (EU) 2024/1689 Article 113, as amended by Regulation (EU) 2026/1744",
    sourceUrl: EU_AI_OMNIBUS,
    related: AI_LAW_PAGE,
  },
  {
    id: "ca-acr-ict-wave-2",
    date: "2028-12-05",
    jurisdiction: "Canada (federal)",
    region: "canada",
    title: "Accessible Canada Regulations ICT requirements: second wave",
    appliesTo: "Federally regulated businesses with 100 or more employees, and the federal public sector",
    requirement:
      "Businesses with 100 or more employees: new and updated web pages conform. Large businesses (500 or more) and the federal public sector: new mobile apps and downloadable documents, an assessment of existing apps, and conformity checks when procuring ICT. Large businesses also publish accessibility statements.",
    standard: "CAN/ASC - EN 301 549 (WCAG 2.1 AA)",
    status: "final-not-yet-in-force",
    confidence: "verified",
    note: "Broadcasting, telecommunications and transportation providers are excluded from the public-facing web, app and document duties.",
    description:
      "Banks, parcel and pipeline companies and other federally regulated businesses with 100 or more staff come under the Canadian ICT accessibility standard.",
    sourceLabel: "SOR/2025-255, section 18(2), Canada Gazette Part II",
    sourceUrl: CANADA_SOR_2025_255,
    related: CANADA_PAGE,
  },
  {
    id: "us-fcc-hac-bluetooth-standard",
    date: "2028-12-13",
    jurisdiction: "United States (FCC)",
    region: "us-federal",
    title: "Hearing aid Bluetooth coupling must use a non-proprietary standard",
    appliesTo: "Handset manufacturers",
    requirement:
      "The Bluetooth coupling requirement may only be met with a global, low-power, non-proprietary standard (47 CFR 20.19(b)(3)(ii)).",
    status: "in-force",
    confidence: "verified",
    description: "Phones must connect to hearing aids using an open Bluetooth standard rather than a proprietary one.",
    sourceLabel: "47 CFR 20.19(b)(3)",
    sourceUrl: ECFR_HAC,
  },
  {
    id: "eu-avmsd-report-2028",
    date: "2028-12-19",
    jurisdiction: "European Union",
    region: "eu",
    title: "Audiovisual Media Services Directive accessibility reports due",
    appliesTo: "EU Member States (reporting on media service providers)",
    requirement: "Report on making audiovisual media services progressively more accessible (Article 7(2)).",
    status: "computed",
    confidence: "derived",
    cadence: "By 19 December 2022 and every three years after (2022, 2025, 2028).",
    description: "Member States report progress on accessible TV and on-demand services.",
    sourceLabel: "Directive (EU) 2018/1808, Article 7(2)",
    sourceUrl: "https://eur-lex.europa.eu/eli/dir/2018/1808/oj/eng",
  },
  {
    id: "on-aoda-report-business-2029",
    date: "2029-12-31",
    jurisdiction: "Ontario, Canada",
    region: "canada",
    title: "AODA compliance report due: businesses and non-profits",
    appliesTo: "Businesses and non-profits with 20 or more employees in Ontario",
    requirement: "The next three-year reporting cycle after 2026.",
    standard: "WCAG 2.0 AA (IASR)",
    status: "computed",
    confidence: "derived",
    cadence: "Every three years after the 31 December 2026 deadline.",
    description: "The following AODA reporting deadline for private-sector organizations, assuming the three-year cycle continues.",
    sourceLabel: "Government of Ontario, completing your accessibility compliance report",
    sourceUrl: ONTARIO_REPORTING,
    related: CANADA_PAGE,
  },
  {
    id: "eu-eaa-transition-end",
    date: "2030-06-28",
    jurisdiction: "European Union",
    region: "eu",
    title: "EAA transition ends for pre-2025 contracts and products",
    appliesTo: "Service providers",
    requirement:
      "Service contracts agreed before 28 June 2025 can run unaltered for no longer than five years, and products lawfully used to provide services may be used until this date (Article 32(1)). Self-service terminals: up to 20 years from entry into use where national law allows (Article 32(2)).",
    status: "in-force",
    confidence: "verified",
    description: "The EAA's grace period for older contracts and equipment ends. Websites and apps were never covered by it.",
    sourceLabel: "Directive (EU) 2019/882, Article 32",
    sourceUrl: EU_EAA,
    related: EAA_PAGE,
  },
  {
    id: "eu-eaa-commission-report",
    date: "2030-06-28",
    jurisdiction: "European Union",
    region: "eu",
    title: "First Commission report on the EAA",
    appliesTo: "European Commission",
    requirement: "Report on the application of the Directive, then every five years (Article 33(1)).",
    status: "in-force",
    confidence: "verified",
    description: "The first EU-wide review of how the EAA is working, including enforcement.",
    sourceLabel: "Directive (EU) 2019/882, Article 33(1)",
    sourceUrl: EU_EAA,
    related: EAA_PAGE,
  },
  {
    id: "eu-wad-monitoring-2030",
    date: "2030-12-23",
    jurisdiction: "European Union",
    region: "eu",
    title: "Web Accessibility Directive monitoring reports due",
    appliesTo: "EU Member States",
    requirement: "The next three-year monitoring report (Article 8(4)).",
    status: "computed",
    confidence: "derived",
    cadence: "By 23 December 2021 and every three years after (2021, 2024, 2027, 2030).",
    description: "The following Web Accessibility Directive reporting round.",
    sourceLabel: "Directive (EU) 2016/2102, Article 8(4)",
    sourceUrl: EU_WAD,
  },
]

/** All rows, sorted by date, then id, so output is stable. */
export function getSortedDeadlines(rows: ComplianceDeadline[] = complianceDeadlines): ComplianceDeadline[] {
  return [...rows].sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id))
}

/**
 * Rows for the calendar feed: everything whose status is not "passed". This
 * uses the stored status, not today's date, so the feed is deterministic
 * between reviews and subscribers do not see events vanish the day they pass.
 */
export function getCalendarDeadlines(): ComplianceDeadline[] {
  return getSortedDeadlines(complianceDeadlines.filter((d) => d.status !== "passed"))
}

export function isDeadlineRegion(value: string): value is DeadlineRegion {
  return DEADLINE_REGIONS.some((r) => r.slug === value)
}

export function getRegionLabel(region: DeadlineRegion): string {
  return DEADLINE_REGIONS.find((r) => r.slug === region)?.label ?? region
}

export const DEADLINES_CALENDAR_PATH = "/compliance/deadlines/calendar.ics"
