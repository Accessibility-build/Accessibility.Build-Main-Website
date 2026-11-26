// Facts behind /compliance/title-ii.
//
// Every date and citation here was read in the primary source on the reviewed
// date: 28 CFR part 35 subpart H and section 35.104 on eCFR, the interim final
// rule at 91 FR 20902, and the HHS rule at 91 FR 25496. The page is linked from
// government resource pages, so a wrong date costs more here than anywhere
// else on the site.
//
// Restamp when any of these change: a ruling in NFB v. DOJ (D. Md.
// 1:26-cv-02007), a DOJ proposed or final rule under RIN 1190-AA82, or an edit
// to 35.200(b). Update TITLE_II_REVIEWED, the dates below, the rule status
// timeline, and lib/data/compliance-deadlines.ts in the same commit.
//
// No em or en dashes in any string.

export const TITLE_II_REVIEWED_ON = "27 November 2026"
export const TITLE_II_REVIEWED_ISO = "2026-11-27"

export const TITLE_II_ROUTE = "/compliance/title-ii"

export const DATES = {
  large: { iso: "2027-04-26", label: "26 April 2027", cite: "28 CFR 35.200(b)(1)" },
  small: { iso: "2028-04-26", label: "26 April 2028", cite: "28 CFR 35.200(b)(2)" },
  hhsLarge: { iso: "2027-05-11", label: "11 May 2027", cite: "45 CFR 84.84(b)(1)" },
  hhsSmall: { iso: "2028-05-10", label: "10 May 2028", cite: "45 CFR 84.84(b)(2)" },
} as const

/** Calendar feed ids from lib/data/compliance-deadlines.ts. */
export const CALENDAR_IDS = {
  large: "us-ada-title-ii-large",
  small: "us-ada-title-ii-small",
  hhsLarge: "us-hhs-504-large",
  hhsSmall: "us-hhs-504-small",
} as const

export const SOURCES = {
  subpartH: "https://www.ecfr.gov/current/title-28/chapter-I/part-35/subpart-H",
  s35200: "https://www.ecfr.gov/current/title-28/chapter-I/part-35/subpart-H/section-35.200",
  s35201: "https://www.ecfr.gov/current/title-28/chapter-I/part-35/subpart-H/section-35.201",
  s35104: "https://www.ecfr.gov/current/title-28/chapter-I/part-35/subpart-A/section-35.104",
  ifr: "https://www.federalregister.gov/documents/2026/04/20/2026-07663/extension-of-compliance-dates-for-nondiscrimination-on-the-basis-of-disability-accessibility-of-web",
  hhsIfr: "https://www.federalregister.gov/documents/2026/05/11/2026-09266/extension-of-compliance-dates-for-nondiscrimination-on-the-basis-of-disability-accessibility-of-web",
  hhs8484: "https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-A/part-84/subpart-I/section-84.84",
  factSheet: "https://www.ada.gov/resources/2024-03-08-web-rule/",
  smallEntityGuide: "https://www.ada.gov/resources/small-entity-compliance-guide/",
  firstSteps: "https://www.ada.gov/resources/web-rule-first-steps/",
  nfbComplaint: "https://browngold.com/wp-content/uploads/2026/05/NFB-v.-DOJ_5-21-2026.pdf",
  unifiedAgenda: "https://www.reginfo.gov/public/do/eAgendaViewRule?pubId=202510&RIN=1190-AA82",
  wcag21: "https://www.w3.org/TR/WCAG21/",
  wcagQuickRef: "https://www.w3.org/WAI/WCAG21/quickref/?versions=2.1&levels=aaa",
  w3cStatements: "https://www.w3.org/WAI/planning/statements/",
  w3cPdfTechniques: "https://www.w3.org/WAI/WCAG21/Techniques/#pdf",
  censusData: "https://data.census.gov/",
  saipe: "https://www.census.gov/programs-surveys/saipe.html",
  censusGovernments: "https://www.census.gov/programs-surveys/cog.html",
  section508Buy: "https://www.section508.gov/buy/",
  pac: "https://pac.pdf-accessibility.org/en",
} as const

/* ------------------------------------------------------------------ */
/* Deadline checker                                                    */
/* ------------------------------------------------------------------ */

export type EntityKind = "state" | "local" | "school" | "instrumentality" | "special" | "unsure"

export const ENTITY_OPTIONS: { value: EntityKind; label: string; hint: string }[] = [
  {
    value: "state",
    label: "A state government, or one of its agencies",
    hint: "State departments, boards, commissions, courts, and state colleges and universities.",
  },
  {
    value: "local",
    label: "A county, city, town, township or village",
    hint: "A general purpose local government with its own Census population.",
  },
  {
    value: "school",
    label: "An independent public school district",
    hint: "A school district that is its own government, not run by a city or county.",
  },
  {
    value: "instrumentality",
    label: "A department, authority or board of one or more local governments",
    hint: "For example a city housing authority, a county library, or a transit authority set up by several cities.",
  },
  {
    value: "special",
    label: "A special district",
    hint: "An independent single purpose government under state law, such as a fire, water, sewer, park, library, hospital or port district.",
  },
  {
    value: "unsure",
    label: "I'm not sure which of these we are",
    hint: "We'll show both dates and how to tell which applies.",
  },
]

export type PopulationAnswer = "large" | "small" | "unknown"

export interface PopulationQuestion {
  legend: string
  hint: string
  lookup: { label: string; href: string }
}

export const POPULATION_QUESTION: Partial<Record<EntityKind, PopulationQuestion>> = {
  local: {
    legend: "What was your population in the 2020 Census?",
    hint: "The rule uses the most recent decennial Census count, not a later estimate (28 CFR 35.104, total population, paragraph 1).",
    lookup: { label: "Look it up on data.census.gov", href: SOURCES.censusData },
  },
  school: {
    legend: "What is your district's population in the latest Census Small Area Income and Poverty Estimates?",
    hint: "This is the total population living in the district, not student enrollment (28 CFR 35.104, total population, paragraph 2).",
    lookup: { label: "Find your district in SAIPE", href: SOURCES.saipe },
  },
  instrumentality: {
    legend: "What is the combined 2020 Census population of the government or governments you belong to?",
    hint: "An instrumentality without its own Census count uses the combined population of the governments it serves (28 CFR 35.104, total population, paragraph 3). If you belong to a school district, use that district's SAIPE figure instead.",
    lookup: { label: "Look it up on data.census.gov", href: SOURCES.censusData },
  },
}

export type DeadlineTier = "large" | "small" | "either"

export interface DeadlineResult {
  tier: DeadlineTier
  /** One sentence on why, citing the paragraph of the rule that decides it. */
  reason: string
}

export function resolveDeadline(entity: EntityKind, population: PopulationAnswer | null): DeadlineResult | null {
  switch (entity) {
    case "state":
      return {
        tier: "large",
        reason:
          "Every state has a Census population well over 50,000, and a state agency counts the population of the state it belongs to (28 CFR 35.104, total population, paragraphs 1 and 3).",
      }
    case "special":
      return {
        tier: "small",
        reason:
          "Every special district government has the later date, whatever the size of the area it serves (28 CFR 35.200(b)(2)).",
      }
    case "unsure":
      return {
        tier: "either",
        reason:
          "The date depends on how your state's law classifies you. The Census Bureau's Census of Governments lists, state by state, which bodies count as special districts and which are dependent agencies of another government.",
      }
    case "local":
    case "school":
    case "instrumentality": {
      if (!population) return null
      if (population === "unknown") {
        return {
          tier: "either",
          reason: "Your date turns on whether the population figure the rule uses is 50,000 or more. Check the figure, then come back.",
        }
      }
      const basis =
        entity === "local"
          ? "your 2020 Census population"
          : entity === "school"
            ? "your district's population in the latest Small Area Income and Poverty Estimates"
            : "the combined Census population of the governments you belong to"
      return population === "large"
        ? { tier: "large", reason: `Your date follows from ${basis} being 50,000 or more (28 CFR 35.200(b)(1)).` }
        : { tier: "small", reason: `Your date follows from ${basis} being under 50,000 (28 CFR 35.200(b)(2)).` }
    }
  }
}

/* ------------------------------------------------------------------ */
/* Rule status                                                         */
/* ------------------------------------------------------------------ */

export type StatusState = "done" | "pending" | "upcoming"

export interface StatusEvent {
  iso: string
  label: string
  title: string
  detail: string
  state: StatusState
  source?: { label: string; href: string }
}

export const RULE_STATUS: StatusEvent[] = [
  {
    iso: "2024-04-24",
    label: "24 April 2024",
    title: "DOJ publishes the Title II web rule",
    detail:
      "The rule adds subpart H to 28 CFR part 35 and adopts WCAG 2.1 Level A and AA as the technical standard for state and local government web content and mobile apps. The original dates were 24 April 2026 and 26 April 2027.",
    state: "done",
    source: { label: "89 FR 31320, DOJ fact sheet", href: SOURCES.factSheet },
  },
  {
    iso: "2026-04-20",
    label: "20 April 2026",
    title: "Interim final rule moves both dates back one year",
    detail:
      "Effective on publication. Only the dates changed: the standard, the scope and the exceptions are the same as in 2024.",
    state: "done",
    source: { label: "91 FR 20902", href: SOURCES.ifr },
  },
  {
    iso: "2026-05-11",
    label: "11 May 2026",
    title: "HHS moves its Section 504 web dates to match",
    detail:
      "Recipients of HHS funding, such as public health departments and public hospitals, have a separate rule with dates of 11 May 2027 and 10 May 2028.",
    state: "done",
    source: { label: "91 FR 25496", href: SOURCES.hhsIfr },
  },
  {
    iso: "2026-05-21",
    label: "21 May 2026",
    title: "National Federation of the Blind sues to undo both extensions",
    detail:
      "NFB v. DOJ, D. Md. No. 1:26-cv-02007, argues the extensions skipped notice and comment and asks the court to restore the 2024 dates.",
    state: "done",
    source: { label: "Complaint", href: SOURCES.nfbComplaint },
  },
  {
    iso: "2026-06-22",
    label: "22 June 2026",
    title: "Comments close on the interim final rule",
    detail: "The interim rule stays in force while DOJ considers the comments. No final rule has followed.",
    state: "done",
    source: { label: "91 FR 20902", href: SOURCES.ifr },
  },
  {
    iso: TITLE_II_REVIEWED_ISO,
    label: "Now",
    title: "Waiting on the court",
    detail:
      "Summary judgment briefing in NFB v. DOJ is under way and we found no ruling as of the review date. DOJ's regulatory agenda also lists a possible proposed rule to revisit parts of the 2024 rule, with no date, and nothing has been proposed.",
    state: "pending",
    source: { label: "DOJ regulatory agenda, RIN 1190-AA82", href: SOURCES.unifiedAgenda },
  },
  {
    iso: DATES.large.iso,
    label: DATES.large.label,
    title: "Compliance date for larger public entities",
    detail: "Public entities other than special districts with a total population of 50,000 or more.",
    state: "upcoming",
    source: { label: DATES.large.cite, href: SOURCES.s35200 },
  },
  {
    iso: DATES.small.iso,
    label: DATES.small.label,
    title: "Compliance date for smaller entities and every special district",
    detail: "Public entities with a total population under 50,000, and all special district governments.",
    state: "upcoming",
    source: { label: DATES.small.cite, href: SOURCES.s35200 },
  },
]

export const WHAT_COULD_CHANGE = [
  {
    title: "A court ruling",
    text: "If the court agrees with the NFB, it could set aside one or both extensions. Both interim rules say each extension is severable, so a ruling could restore the earlier date for larger entities and leave the later one in place, or the reverse.",
  },
  {
    title: "A new DOJ rule",
    text: "A proposed rule would have to go through public comment before it could change the standard or the dates. Nothing has been proposed.",
  },
  {
    title: "Nothing",
    text: "If neither happens, DOJ has said it expects the rule to take effect on the dates in the interim rule.",
  },
]

/* ------------------------------------------------------------------ */
/* Scope and exceptions                                                */
/* ------------------------------------------------------------------ */

export const EXCEPTIONS: { cite: string; title: string; text: string; catch: string }[] = [
  {
    cite: "35.201(a)",
    title: "Archived web content",
    text: "Content made before your compliance date (or a copy of paper records from before it), kept only for reference, research or recordkeeping, never changed after archiving, and kept in a clearly marked archive area. It must meet all four conditions.",
    catch: "Last year's budget in an archive section can qualify. The same file linked from a current page with live information does not.",
  },
  {
    cite: "35.201(b)",
    title: "Older PDFs, Word, PowerPoint and Excel files",
    text: "Documents that were already online before your compliance date.",
    catch: "Not if anyone still uses the document to apply for, get access to, or take part in a service, program or activity. An old permit application still in use is covered.",
  },
  {
    cite: "35.201(c)",
    title: "Content posted by third parties",
    text: "Comments, posts and uploads by members of the public.",
    catch: "Not if the third party posts on your behalf under a contract, licence or other arrangement, such as a vendor that posts content for you under contract.",
  },
  {
    cite: "35.201(d)",
    title: "Secured documents about one person",
    text: "Documents about a specific person, their property or their account, behind a password or otherwise secured, such as a utility bill or tax statement.",
    catch: "Title II's general duties still apply, so a person who needs an accessible version of their own document must be able to get one.",
  },
  {
    cite: "35.201(e)",
    title: "Older social media posts",
    text: "Posts made before your compliance date.",
    catch: "Posts made on or after your compliance date are covered, so their images need text alternatives and their videos need captions.",
  },
]

export const OTHER_PROVISIONS: { cite: string; title: string; text: string }[] = [
  {
    cite: "35.202",
    title: "Alternate versions only as a last resort",
    text: "A separate accessible version is allowed only where technical or legal limits make it impossible to make the original content accessible.",
  },
  {
    cite: "35.203",
    title: "Equivalent facilitation",
    text: "Another design or technique is fine if it gives substantially equivalent or greater accessibility and usability.",
  },
  {
    cite: "35.204",
    title: "Fundamental alteration or undue burden",
    text: "You carry the burden of proving it. The head of the entity or a designee must decide, in a written statement of reasons, and you must still do everything else you can.",
  },
  {
    cite: "35.205",
    title: "Minimal impact",
    text: "Small gaps don't break compliance if you can show they have so little impact that people with disabilities can still use the content with substantially the same timeliness, privacy, independence and ease of use.",
  },
]
