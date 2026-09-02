// Registry of published accessibility case studies (/cases/<slug>).
//
// Case studies are long-form React pages, like the guides, because each one has
// its own structure (timelines, evidence tables, myth corrections). This file
// holds only the metadata that other parts of the site need: the index page, the
// XML sitemap, structured data, internal linking, and comment slug validation.
//
// A slug that is not in this list cannot receive comments. That is deliberate:
// the comment API validates against `isCaseSlug()` so an attacker cannot create
// rows for arbitrary strings.

export interface CaseStudyFact {
  label: string
  value: string
}

export interface CaseStudy {
  slug: string
  /** Case name as it should appear in a heading. */
  title: string
  /** Formal citation line, shown under the title. */
  citation: string
  /** One-sentence summary used on the index and in meta descriptions. */
  summary: string
  /** Jurisdiction label for filtering and display, e.g. "United States". */
  jurisdiction: string
  /** Short label for the legal regime at issue, e.g. "ADA Title III". */
  regime: string
  /** Years the matter ran, for the index card. */
  period: string
  /** Outcome in three or four words. */
  outcome: string
  /** Date the page was first published, YYYY-MM-DD. Used for schema. */
  datePublished: string
  /** Key facts rendered in the hero panel. */
  facts: CaseStudyFact[]
  /** Topic tags, used for the index and related content. */
  tags: string[]
  /** Approximate reading time in minutes. */
  readingMinutes: number
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "robles-v-dominos",
    title: "Robles v. Domino's Pizza",
    citation:
      "Robles v. Domino's Pizza LLC, No. 2:16-cv-06599 (C.D. Cal.), No. 17-55504 (9th Cir.), No. 18-1539 (U.S.)",
    summary:
      "A blind customer could not complete a pizza order through Domino's website or app. The resulting six-year case established how the ADA's physical-place nexus applies to those digital services in the Ninth Circuit.",
    jurisdiction: "United States",
    regime: "ADA Title III",
    period: "2016 to 2022",
    outcome: "Website judgment, then settlement on confidential terms",
    datePublished: "2026-09-02",
    facts: [
      { label: "Filed", value: "1 September 2016" },
      { label: "Closed", value: "21 June 2022" },
      { label: "Duration", value: "5 years, 9 months" },
      { label: "Courts", value: "Three" },
      { label: "Damages awarded", value: "$4,000" },
      { label: "Outcome", value: "Settlement; terms confidential" },
    ],
    tags: ["ADA", "Screen readers", "Mobile apps", "Nexus test", "WCAG 2.0"],
    readingMinutes: 32,
  },
  {
    slug: "gil-v-winn-dixie",
    title: "Gil v. Winn-Dixie Stores",
    citation:
      "Gil v. Winn-Dixie Stores, Inc., No. 1:16-cv-23020 (S.D. Fla.), 257 F. Supp. 3d 1340; No. 17-13467 (11th Cir.), 993 F.3d 1266, vacated as moot, 21 F.4th 775",
    summary:
      "The only web accessibility case to go through a full trial. A blind customer won an injunction against a grocery chain, an appeals court reversed two to one, and then erased its own opinion because the injunction had expired while the appeal waited. Nothing it decided binds anyone.",
    jurisdiction: "United States",
    regime: "ADA Title III",
    period: "2016 to 2022",
    outcome: "Trial judgment, reversed, then vacated as moot",
    datePublished: "2026-09-02",
    facts: [
      { label: "Filed", value: "12 July 2016" },
      { label: "Closed", value: "10 March 2022" },
      { label: "Duration", value: "5 years, 8 months" },
      { label: "Courts", value: "Two" },
      { label: "Damages awarded", value: "$0" },
      { label: "Outcome", value: "Judgment vacated as moot" },
    ],
    tags: ["ADA", "Screen readers", "Bench trial", "Nexus test", "Mootness", "WCAG 2.0"],
    readingMinutes: 23,
  },
  {
    slug: "nfb-v-target",
    title: "National Federation of the Blind v. Target",
    citation:
      "National Federation of the Blind v. Target Corp., No. 3:06-cv-01802 (N.D. Cal.), 452 F. Supp. 2d 946 (2006), 582 F. Supp. 2d 1185 (2007)",
    summary:
      "The first web accessibility ruling against a retailer. A blind student could not buy towels for his dorm room. The 2006 order created the nexus test every later case has argued about, a nationwide class was certified, and Target settled for a $6 million fund and three years of monitoring.",
    jurisdiction: "United States",
    regime: "ADA Title III and California law",
    period: "2006 to 2009",
    outcome: "Class settlement, $6 million fund, no admission",
    datePublished: "2026-09-02",
    facts: [
      { label: "Filed", value: "7 February 2006" },
      { label: "Closed", value: "3 August 2009" },
      { label: "Duration", value: "3 years, 6 months" },
      { label: "Courts", value: "Two" },
      { label: "Class fund", value: "$6,000,000" },
      { label: "Outcome", value: "Settlement; no admission of liability" },
    ],
    tags: ["ADA", "Unruh Act", "Class action", "Nexus test", "Screen readers", "Settlement"],
    readingMinutes: 20,
  },
]

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug)
}

/** Whether a slug names a real, published case study. Used to gate comments. */
export function isCaseSlug(slug: string): boolean {
  return caseStudies.some((c) => c.slug === slug)
}

export const caseStudySlugs = caseStudies.map((c) => c.slug)
