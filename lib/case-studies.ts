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
      "A blind man could not order a pizza. Every barrier was a Level A failure, and Domino's spent nearly six years and a Supreme Court petition arguing it did not have to fix them.",
    jurisdiction: "United States",
    regime: "ADA Title III",
    period: "2016 to 2022",
    outcome: "Judgment for the plaintiff, then a confidential settlement",
    datePublished: "2026-09-02",
    facts: [
      { label: "Filed", value: "1 September 2016" },
      { label: "Closed", value: "21 June 2022" },
      { label: "Duration", value: "5 years, 9 months" },
      { label: "Courts", value: "Three" },
      { label: "Damages", value: "$4,000" },
      { label: "Outcome", value: "Confidential settlement" },
    ],
    tags: ["ADA", "Screen readers", "Mobile apps", "Nexus test", "WCAG 2.0"],
    readingMinutes: 32,
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
