import type { Metadata } from "next"
import Link from "next/link"
import { BreadcrumbStructuredData } from "@/components/seo/structured-data"
import { FaqSection } from "@/components/seo/faq-section"
import { RelatedContent } from "@/components/seo/related-content"
import { PageByline } from "@/components/seo/page-byline"
import { KeyFacts } from "@/components/research/key-facts"
import { clampDescription } from "@/lib/metadata"
import { cn } from "@/lib/utils"
import {
  DEADLINES_CALENDAR_PATH,
  DEADLINES_REVIEWED_ISO,
  DEADLINES_REVIEWED_ON,
  DEADLINE_REGIONS,
  DEADLINE_STATUS_META,
  getCalendarDeadlines,
  getSortedDeadlines,
  type ComplianceDeadline,
  type DeadlineStatus,
} from "@/lib/data/compliance-deadlines"

// Regenerate daily so "next 90 days" and the passed/upcoming split follow the
// calendar without a redeploy.
export const revalidate = 86400

const ROUTE = "/compliance/deadlines"
const SITE = "https://accessibility.build"

const pageTitle = "Accessibility Compliance Deadlines Calendar 2026 to 2030"
const pageDescription =
  "Dated accessibility deadlines for 2026 to 2030, from ADA Title II and Section 504 to the EAA and Canada, each with a primary source and an .ics file."
const ogTitle = encodeURIComponent(pageTitle)

export const metadata: Metadata = {
  title: pageTitle,
  description: clampDescription(pageDescription),
  keywords: [
    "accessibility compliance deadlines",
    "web accessibility deadlines 2027",
    "ada title ii deadline",
    "section 504 web accessibility deadline",
    "european accessibility act deadlines",
    "en 301 549 official journal",
    "accessible canada regulations ict deadline",
    "aoda compliance report 2026",
    "accessibility calendar ics",
    "digital accessibility law timeline",
  ],
  alternates: {
    canonical: ROUTE,
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: ROUTE,
    type: "article",
    images: [{ url: `/api/og?title=${ogTitle}&section=Compliance`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
    images: [{ url: `/api/og?title=${ogTitle}&section=Compliance`, width: 1200, height: 630 }],
  },
}

// ---------- helpers ----------

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number)
  return `${d} ${MONTHS[m - 1]} ${y}`
}

function addDays(iso: string, days: number): string {
  const t = Date.UTC(Number(iso.slice(0, 4)), Number(iso.slice(5, 7)) - 1, Number(iso.slice(8, 10)))
  return new Date(t + days * 86400000).toISOString().slice(0, 10)
}

/** The status to show: anything dated before today reads as passed. */
function displayStatus(row: ComplianceDeadline, today: string): DeadlineStatus {
  return row.date < today ? "passed" : row.status
}

function calendarHref(params: string): string {
  return `${DEADLINES_CALENDAR_PATH}${params ? `?${params}` : ""}`
}

function webcalHref(params: string): string {
  return `webcal://accessibility.build${calendarHref(params)}`
}

const STATUS_BADGE: Record<DeadlineStatus, string> = {
  "in-force": "border-blue-700 text-blue-800 dark:border-blue-400 dark:text-blue-300",
  "final-not-yet-in-force": "border-emerald-700 text-emerald-800 dark:border-emerald-400 dark:text-emerald-300",
  proposed: "border-purple-700 text-purple-800 dark:border-purple-400 dark:text-purple-300",
  expected: "border-amber-700 text-amber-900 dark:border-amber-400 dark:text-amber-200",
  computed: "border-slate-600 text-slate-800 dark:border-slate-400 dark:text-slate-200",
  passed: "border-slate-400 text-slate-700 dark:border-slate-500 dark:text-slate-300",
}

const linkClass =
  "text-blue-700 dark:text-blue-400 underline underline-offset-2 hover:decoration-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-sm"

function StatusBadge({ status }: { status: DeadlineStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded border px-2 py-0.5 text-xs font-semibold",
        STATUS_BADGE[status],
      )}
    >
      <span className="sr-only">Status: </span>
      {DEADLINE_STATUS_META[status].label}
    </span>
  )
}

function DeadlineRow({
  row,
  today,
  headingLevel,
  idPrefix = "",
}: {
  row: ComplianceDeadline
  today: string
  headingLevel: "h3" | "h4"
  idPrefix?: string
}) {
  const status = displayStatus(row, today)
  const Heading = headingLevel
  const showCalendarLink = row.status !== "passed"
  const dateText = formatDate(row.date)
  return (
    <li
      id={idPrefix ? undefined : row.id}
      data-region={row.region}
      className="scroll-mt-24 rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900/40"
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mb-2">
        <time dateTime={row.date} className="font-mono text-sm font-semibold tabular-nums text-slate-900 dark:text-white">
          {row.dateApprox ? `About ${dateText}` : dateText}
        </time>
        <span className="text-sm text-slate-600 dark:text-slate-400">{row.jurisdiction}</span>
        <StatusBadge status={status} />
        {row.challenged && status !== "passed" ? (
          <span className="inline-flex items-center rounded border border-red-700 px-2 py-0.5 text-xs font-semibold text-red-800 dark:border-red-400 dark:text-red-300">
            Challenged in court
          </span>
        ) : null}
        {row.confidence === "unverified" ? (
          <span className="inline-flex items-center rounded border border-amber-700 px-2 py-0.5 text-xs font-semibold text-amber-900 dark:border-amber-400 dark:text-amber-200">
            Not re-confirmed
          </span>
        ) : null}
      </div>
      <Heading className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{row.title}</Heading>
      <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3">{row.description}</p>
      <dl className="grid gap-x-4 gap-y-1 text-sm sm:grid-cols-[8rem_1fr]">
        <dt className="font-semibold text-slate-900 dark:text-white">Who</dt>
        <dd className="text-slate-600 dark:text-slate-400">{row.appliesTo}</dd>
        <dt className="font-semibold text-slate-900 dark:text-white">What</dt>
        <dd className="text-slate-600 dark:text-slate-400">{row.requirement}</dd>
        {row.standard ? (
          <>
            <dt className="font-semibold text-slate-900 dark:text-white">Standard</dt>
            <dd className="text-slate-600 dark:text-slate-400">{row.standard}</dd>
          </>
        ) : null}
        {row.cadence ? (
          <>
            <dt className="font-semibold text-slate-900 dark:text-white">How the date was computed</dt>
            <dd className="text-slate-600 dark:text-slate-400">{row.cadence}</dd>
          </>
        ) : null}
        {row.note ? (
          <>
            <dt className="font-semibold text-slate-900 dark:text-white">Note</dt>
            <dd className="text-slate-600 dark:text-slate-400">{row.note}</dd>
          </>
        ) : null}
        <dt className="font-semibold text-slate-900 dark:text-white">Source</dt>
        <dd className="text-slate-600 dark:text-slate-400">
          <a href={row.sourceUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
            {row.sourceLabel}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </dd>
      </dl>
      {row.related || showCalendarLink ? (
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {row.related ? (
            <Link href={row.related.href} className={linkClass}>
              {row.related.label}
            </Link>
          ) : null}
          {showCalendarLink ? (
            <a href={calendarHref(`id=${row.id}`)} className={linkClass}>
              Add to calendar (.ics)
              <span className="sr-only">
                : {row.title}, {dateText}
              </span>
            </a>
          ) : null}
        </div>
      ) : null}
    </li>
  )
}

// ---------- content ----------

const sortedDeadlines = getSortedDeadlines()
const calendarDeadlines = getCalendarDeadlines()

const regionCounts = DEADLINE_REGIONS.map((r) => ({
  ...r,
  total: sortedDeadlines.filter((d) => d.region === r.slug).length,
  upcoming: calendarDeadlines.filter((d) => d.region === r.slug).length,
}))

const sources = Array.from(
  new Map(sortedDeadlines.map((d) => [d.sourceUrl, d.sourceLabel] as const)).entries(),
).map(([href, label]) => ({ href, label }))

const faqs = [
  {
    question: "What are the next major digital accessibility compliance deadlines?",
    answer:
      "In the United States, state and local governments with a population of 50,000 or more must meet WCAG 2.1 AA for web content and mobile apps under ADA Title II by 26 April 2027, and recipients of HHS funding with 15 or more employees must do the same under Section 504 by 11 May 2027. Smaller governments and special districts follow on 26 April 2028 and smaller HHS recipients on 10 May 2028. In Canada, the first wave of the Accessible Canada Regulations ICT requirements starts on 5 December 2027 and the second on 5 December 2028. In Ontario, businesses and non-profits with 20 or more employees must file their AODA compliance report by 31 December 2026.",
  },
  {
    question: "Are the ADA Title II and Section 504 dates final?",
    answer:
      "They are in force but not settled. Both come from interim final rules: DOJ's of 20 April 2026 for Title II and HHS's of May 2026 for Section 504, each moving the original deadlines back a year. The National Federation of the Blind sued in Maryland federal court on 21 May 2026 (NFB v. DOJ, No. 1:26-cv-02007-RDB) to vacate both extensions and restore the 2024 dates. We found no ruling as of 11 November 2026, and DOJ has not issued a final rule. If the court sides with the NFB, the dates could move earlier, so plan to the dates shown and check back.",
  },
  {
    question: "Has EN 301 549 V4.1.1 been cited in the Official Journal yet?",
    answer:
      "No. As of 10 November 2026 no Commission decision citing V4.1.1 under the European Accessibility Act had been published. Ireland's National Disability Authority says the citation is currently expected on 16 December 2026. Deque updated its own post on 10 November 2026 to say 22 January 2027, without giving a source. The 30 November 2026 date you may see elsewhere is ETSI's date of announcement for national standards bodies, printed in the standard itself; it is not an Official Journal date. Until a citation happens, no edition of EN 301 549 gives a presumption of conformity under the EAA.",
  },
  {
    question: "What do the statuses on this calendar mean?",
    answer:
      "Binding date means the date is set by a law, rule or standard that has already been adopted. Adopted, takes effect on this date means the rule is final and published but does not apply until that day. Expected, not confirmed means an official body has said it expects something to happen then, which is not binding. Computed from cadence means the law sets a recurring cycle and we worked out the specific date from it. Passed means the date has happened. Dates marked challenged in court rest on a rule being contested, and dates marked not re-confirmed could not be re-read in the primary source on the review date.",
  },
  {
    question: "How do I add these deadlines to my calendar?",
    answer:
      "Use the subscribe link to add the whole calendar, or one region, as a feed your calendar app refreshes, so changes reach you when we update the data. Use the download link if you would rather import a one-off copy, or the Add to calendar link on any single deadline. The files are standard iCalendar (.ics) with all-day events and a reminder 14 days before each date. Google Calendar applies your own default reminders to subscribed calendars rather than the ones in the feed. Each event keeps the same identifier across updates, so a changed date updates the existing event instead of creating a duplicate.",
  },
  {
    question: "Why are Hawaii and India not on the calendar with compliance dates?",
    answer:
      "Neither has a fixed date yet. Hawaii's Act 257 directs the Hawaii Civil Rights Commission to adopt digital accessibility rules, and the proposed rules would start their clocks 24 or 36 months after the final rule, but no final rule had been adopted as of 11 November 2026. India's draft Rights of Persons with Disabilities (Amendment) Rules 2026 count their one-year, 18-month and two-year deadlines from final publication, and they had not been notified as of the same date. Both will get dated rows once the rules are final.",
  },
  {
    question: "Does the EAA have any more deadlines for websites and apps?",
    answer:
      "Not for the core requirements, which have applied since 28 June 2025. The 28 June 2030 date ends the transition for service contracts agreed before 28 June 2025 and for products already used to provide services; websites and apps were never covered by that grace period. The other EAA dates on this calendar are the 28 June 2027 latest start for accessible answering of 112 emergency calls, which Ireland already applied from 28 June 2025, and the Commission's first report on the Directive, also due 28 June 2030.",
  },
  {
    question: "Which Ontario organizations must file an AODA compliance report by 31 December 2026?",
    answer:
      "Businesses and non-profits with 20 or more employees in Ontario, on their three-year cycle. Designated public sector organizations report every two years and their last deadline was 31 December 2025, so they are not due in 2026. Organizations with fewer than 20 employees do not file a report but must still comply. Separately, designated public sector organizations and organizations with 50 or more employees in Ontario must already meet WCAG 2.0 Level AA for their websites, except success criteria 1.2.4 and 1.2.5.",
  },
]

const noFirmDate = [
  {
    title: "NFB v. DOJ ruling",
    text: "No ruling found in the Maryland case as of 11 November 2026. A ruling could restore earlier ADA Title II and Section 504 dates.",
  },
  {
    title: "DOJ reconsideration of the 2024 Title II rule",
    text: "Listed in the Unified Agenda (RIN 1190-AA82) with its date to be determined.",
  },
  {
    title: "Hawaii digital accessibility rules",
    text: "No final rule. The proposal counts 24 or 36 months from adoption.",
  },
  {
    title: "India draft accessibility rules",
    text: "Draft S.O. 3962(E) not notified. Its deadlines run from final publication.",
  },
  {
    title: "WAI-ARIA 1.3 and WCAG2Mobile",
    text: "W3C plans a WAI-ARIA 1.3 Candidate Recommendation Snapshot and an updated WCAG2Mobile draft in November or December 2026, with no day given.",
  },
  {
    title: "Apple Accessibility Nutrition Labels",
    text: "Voluntary to start; Apple says developers will get ample time before they become mandatory. No date.",
  },
  {
    title: "Ofcom on-demand accessibility code (UK)",
    text: "Still at consultation under the Media Act 2024, with no commencement date.",
  },
  {
    title: "Canada accessibility plans and progress reports",
    text: "Due relative to when each entity last published its plan, so there is no single calendar date.",
  },
]

// Region filter: pure CSS (:has), so it works with JavaScript off. Every row
// stays in the HTML; choosing a region hides the others and any month or year
// left empty.
const filterCss = DEADLINE_REGIONS.map(
  ({ slug }) => `
#deadline-list:has(#region-${slug}:checked) li[data-region]:not([data-region="${slug}"]) { display: none; }
#deadline-list:has(#region-${slug}:checked) [data-month]:not(:has(li[data-region="${slug}"])) { display: none; }
#deadline-list:has(#region-${slug}:checked) [data-year]:not(:has(li[data-region="${slug}"])) { display: none; }`,
).join("\n")

export default function ComplianceDeadlinesPage() {
  const today = new Date().toISOString().slice(0, 10)
  const horizon = addDays(today, 90)
  const next90 = sortedDeadlines.filter((d) => d.date >= today && d.date <= horizon)
  const upcomingCount = sortedDeadlines.filter((d) => d.date >= today).length

  // Group by year, then month.
  const years = new Map<string, Map<string, ComplianceDeadline[]>>()
  for (const row of sortedDeadlines) {
    const y = row.date.slice(0, 4)
    const m = row.date.slice(5, 7)
    if (!years.has(y)) years.set(y, new Map())
    const months = years.get(y)!
    if (!months.has(m)) months.set(m, [])
    months.get(m)!.push(row)
  }

  return (
    <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: SITE },
          { name: "Compliance", url: `${SITE}/compliance` },
          { name: "Deadlines Calendar", url: `${SITE}${ROUTE}` },
        ]}
      />
      <style>{filterCss}</style>

      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <ol className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
            <li>
              <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/compliance" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Compliance
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <span className="font-medium text-slate-900 dark:text-white" aria-current="page">
                Deadlines Calendar
              </span>
            </li>
          </ol>
        </div>
      </nav>

      {/* Hero */}
      <header className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-4xl">
            <p className="text-blue-300 font-semibold text-sm tracking-wider uppercase mb-4">
              Compliance Guide &bull; Deadlines
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Accessibility Compliance Deadlines:{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                2026 to 2030
              </span>
            </h1>
            <PageByline route={ROUTE} variant="hero" tone="inverse" className="mt-0 mb-5" />
            <p className="text-lg md:text-xl text-slate-300 mb-6 max-w-2xl">
              Every dated digital accessibility deadline we could trace to a primary source, across
              US federal and state law, the European Union, the UK and Ireland, Canada and the
              standards bodies. Each entry says who it applies to, what has to happen, how firm the
              date is and where it comes from, and every upcoming date can go straight into your
              calendar.
            </p>
            <p
              className="inline-flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border border-amber-300/40 bg-amber-400/10 px-4 py-3 text-sm text-amber-100 mb-8"
              aria-label="Page status"
            >
              <strong className="font-semibold text-amber-200">
                Reviewed <time dateTime={DEADLINES_REVIEWED_ISO}>{DEADLINES_REVIEWED_ON}</time>.
              </strong>
              <span>
                {sortedDeadlines.length} dated entries, {upcomingCount} still ahead. The US Title II
                and Section 504 dates are being challenged in court.
              </span>
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={webcalHref("")}
                className="inline-flex items-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
              >
                Subscribe to all deadlines
              </a>
              <a
                href={calendarHref("")}
                className="inline-flex items-center rounded-lg border border-white/40 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
              >
                Download .ics file
              </a>
              <a
                href="#calendar-files"
                className="inline-flex items-center px-2 py-3 text-sm font-semibold text-blue-200 underline underline-offset-2 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-sm"
              >
                Calendars by region
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <KeyFacts
          title="The dates most organizations ask about"
          facts={[
            {
              value: "26 Apr 2027",
              label: "ADA Title II: governments with a population of 50,000 or more meet WCAG 2.1 AA for web and apps (28 CFR 35.200)",
              source: "eCFR, as amended by FR 2026-07663",
              sourceHref: "https://www.ecfr.gov/current/title-28/chapter-I/part-35/subpart-H/section-35.200",
              asOf: DEADLINES_REVIEWED_ISO,
            },
            {
              value: "11 May 2027",
              label: "Section 504: HHS-funded recipients with 15 or more employees meet WCAG 2.1 AA (45 CFR 84.84)",
              source: "eCFR, as amended by FR 2026-09266",
              sourceHref: "https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-A/part-84/subpart-I/section-84.84",
              asOf: DEADLINES_REVIEWED_ISO,
            },
            {
              value: "Not cited",
              label: "EN 301 549 V4.1.1 under the EAA as of 10 November 2026; Ireland's NDA expects 16 December 2026",
              source: "National Disability Authority (Ireland)",
              sourceHref: "https://nda.ie/news/en301549-published",
              asOf: DEADLINES_REVIEWED_ISO,
            },
            {
              value: "31 Dec 2026",
              label: "Ontario AODA compliance reports due from businesses and non-profits with 20 or more employees",
              source: "Government of Ontario",
              sourceHref: "https://www.ontario.ca/page/completing-your-accessibility-compliance-report",
              asOf: DEADLINES_REVIEWED_ISO,
            },
            {
              value: "5 Dec 2027",
              label: "Accessible Canada Regulations ICT duties begin for federal public sector web pages and ICT training",
              source: "SOR/2025-255, s. 18(1)",
              sourceHref: "https://gazette.gc.ca/rp-pr/p2/2025/2025-12-17/html/sor-dors255-eng.html",
              asOf: DEADLINES_REVIEWED_ISO,
            },
            {
              value: "28 Jun 2030",
              label: "EAA transition ends for pre-2025 service contracts and products used to provide services",
              source: "Directive (EU) 2019/882, Article 32",
              sourceHref: "https://eur-lex.europa.eu/eli/dir/2019/882/oj/eng",
              asOf: DEADLINES_REVIEWED_ISO,
            },
          ]}
        />

        <div className="max-w-4xl mx-auto space-y-16">
          {/* Next 90 days */}
          <section aria-labelledby="next-90-heading" className="scroll-mt-24">
            <h2 id="next-90-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
              In the Next 90 Days
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
              Dates from <time dateTime={today}>{formatDate(today)}</time> to{" "}
              <time dateTime={horizon}>{formatDate(horizon)}</time>. This list updates daily.
            </p>
            {next90.length === 0 ? (
              <p className="text-slate-600 dark:text-slate-400">No dated entries fall in the next 90 days.</p>
            ) : (
              <ol className="space-y-4">
                {next90.map((row) => (
                  <DeadlineRow key={row.id} row={row} today={today} headingLevel="h3" idPrefix="next-" />
                ))}
              </ol>
            )}
          </section>

          {/* How to read */}
          <section aria-labelledby="statuses-heading">
            <h2 id="statuses-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              How to Read This Calendar
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
              Each entry carries a status in words, so you can tell a binding deadline from an
              expectation without relying on colour.
            </p>
            <dl className="space-y-4">
              {(Object.keys(DEADLINE_STATUS_META) as DeadlineStatus[]).map((status) => (
                <div key={status} className="sm:grid sm:grid-cols-[16rem_1fr] sm:gap-4">
                  <dt className="mb-1 sm:mb-0">
                    <StatusBadge status={status} />
                  </dt>
                  <dd className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {DEADLINE_STATUS_META[status].explanation}
                  </dd>
                </div>
              ))}
            </dl>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-10 mb-3">
              Approximate, computed and challenged dates
            </h3>
            <ul className="space-y-3 text-slate-600 dark:text-slate-400 leading-relaxed list-disc pl-5">
              <li>
                <strong className="text-slate-900 dark:text-white">Approximate dates</strong> start
                with &ldquo;About&rdquo;. The only one now is the expected Official Journal citation
                of EN 301 549 V4.1.1, which is an expectation stated by Ireland&apos;s National
                Disability Authority, not a scheduled event.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Computed dates</strong> come from
                a cycle the law states, such as the EU Web Accessibility Directive&apos;s
                three-yearly monitoring reports or Ontario&apos;s two-year public sector reporting.
                Each computed entry says how the date was worked out. Confirm it with the regulator
                before you rely on it.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Challenged dates</strong> are the
                four US ADA Title II and Section 504 deadlines. They are in force today, but the
                rules that set them are being contested in NFB v. DOJ and could change.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Not re-confirmed</strong> marks an
                entry whose primary source could not be re-read on the review date. Entries with no
                primary source at all are left off.
              </li>
            </ul>
          </section>

          {/* Calendar files */}
          <section aria-labelledby="calendar-files" className="scroll-mt-24">
            <h2 id="calendar-files" className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              Add the Deadlines to Your Calendar
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              Subscribing adds a calendar your app refreshes on its own, so corrected or new dates
              reach you after each review. Downloading imports a fixed copy. The feeds hold every
              entry that has not passed, as all-day events with a reminder 14 days before. Each
              event links to its primary source. If your calendar app does not open subscribe links,
              copy the download address and paste it into the app&apos;s option to add a calendar
              from a URL.
            </p>
            <div
              tabIndex={0}
              role="region"
              aria-label="Calendar files by region"
              className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              <table className="w-full text-left text-sm">
                <caption className="sr-only">Calendar files by region</caption>
                <thead className="bg-slate-50 dark:bg-slate-900">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-semibold text-slate-900 dark:text-white">Region</th>
                    <th scope="col" className="px-4 py-3 font-semibold text-slate-900 dark:text-white">Upcoming entries</th>
                    <th scope="col" className="px-4 py-3 font-semibold text-slate-900 dark:text-white">Subscribe</th>
                    <th scope="col" className="px-4 py-3 font-semibold text-slate-900 dark:text-white">Download</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  <tr>
                    <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white">All regions</th>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{calendarDeadlines.length}</td>
                    <td className="px-4 py-3">
                      <a href={webcalHref("")} className={linkClass}>
                        Subscribe<span className="sr-only"> to all regions</span>
                      </a>
                    </td>
                    <td className="px-4 py-3">
                      <a href={calendarHref("")} className={linkClass}>
                        Download .ics<span className="sr-only"> for all regions</span>
                      </a>
                    </td>
                  </tr>
                  {regionCounts.map((r) => (
                    <tr key={r.slug}>
                      <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white">{r.label}</th>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{r.upcoming}</td>
                      {r.upcoming > 0 ? (
                        <>
                          <td className="px-4 py-3">
                            <a href={webcalHref(`region=${r.slug}`)} className={linkClass}>
                              Subscribe<span className="sr-only"> to {r.label}</span>
                            </a>
                          </td>
                          <td className="px-4 py-3">
                            <a href={calendarHref(`region=${r.slug}`)} className={linkClass}>
                              Download .ics<span className="sr-only"> for {r.label}</span>
                            </a>
                          </td>
                        </>
                      ) : (
                        <td colSpan={2} className="px-4 py-3 text-slate-600 dark:text-slate-400">
                          No upcoming dated entries
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Full list */}
          <section aria-labelledby="all-deadlines-heading" id="deadline-list" className="scroll-mt-24">
            <h2 id="all-deadlines-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-3">
              All Deadlines by Date
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
              Recently passed dates from May 2026 onwards, then everything ahead to the end of 2030.
            </p>

            <fieldset className="mb-6 rounded-lg border border-slate-200 p-4 dark:border-slate-800">
              <legend className="px-1 text-sm font-semibold text-slate-900 dark:text-white">Show deadlines for</legend>
              <div className="flex flex-wrap gap-2">
                {[{ slug: "all", label: "All regions", total: sortedDeadlines.length }, ...regionCounts].map((r) => (
                  <span key={r.slug} className="relative">
                    <input
                      type="radio"
                      name="deadline-region"
                      id={`region-${r.slug}`}
                      value={r.slug}
                      defaultChecked={r.slug === "all"}
                      className="peer sr-only"
                    />
                    <label
                      htmlFor={`region-${r.slug}`}
                      className="inline-flex min-h-[44px] cursor-pointer items-center rounded-full border border-slate-300 bg-white px-4 text-sm font-medium text-slate-800 hover:border-blue-600 peer-checked:border-blue-700 peer-checked:bg-blue-700 peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-blue-600 peer-focus-visible:ring-offset-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:peer-checked:border-blue-500 dark:peer-checked:bg-blue-600 dark:peer-focus-visible:ring-offset-slate-950"
                    >
                      {r.label} ({r.total})
                    </label>
                  </span>
                ))}
              </div>
            </fieldset>

            <p className="mb-8 text-sm text-slate-600 dark:text-slate-400">
              Jump to year:{" "}
              {Array.from(years.keys()).map((y, i) => (
                <span key={y}>
                  {i > 0 ? ", " : null}
                  <a href={`#year-${y}`} className={linkClass}>
                    {y}
                  </a>
                </span>
              ))}
            </p>

            <div className="space-y-12">
              {Array.from(years.entries()).map(([year, months]) => (
                <div key={year} data-year={year}>
                  <h2
                    id={`year-${year}`}
                    className="scroll-mt-24 text-2xl font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-800 pb-2 mb-6"
                  >
                    {year}
                  </h2>
                  <div className="space-y-8">
                    {Array.from(months.entries()).map(([month, rows]) => (
                      <div key={month} data-month={`${year}-${month}`}>
                        <h3 className="text-lg font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-300 mb-3">
                          {MONTHS[Number(month) - 1]} {year}
                        </h3>
                        <ol className="space-y-4">
                          {rows.map((row) => (
                            <DeadlineRow key={row.id} row={row} today={today} headingLevel="h4" />
                          ))}
                        </ol>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* No firm date */}
          <section aria-labelledby="no-date-heading">
            <h2 id="no-date-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              Checked, but No Firm Date Yet
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
              These are on our watch list. Each will get a dated entry once an official source sets
              one.
            </p>
            <ul className="grid gap-4 sm:grid-cols-2">
              {noFirmDate.map((item) => (
                <li
                  key={item.title}
                  className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900"
                >
                  <p className="font-semibold text-slate-900 dark:text-white mb-1">{item.title}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.text}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* FAQ */}
          <FaqSection faqs={faqs} title="Frequently Asked Questions" as="h2" className="scroll-mt-24" />

          {/* Sources */}
          <section aria-labelledby="sources-heading">
            <h2 id="sources-heading" className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Sources
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              Every entry was checked against the primary documents below on{" "}
              <time dateTime={DEADLINES_REVIEWED_ISO}>{DEADLINES_REVIEWED_ON}</time>: statutes,
              regulations, the Federal Register and eCFR, EUR-Lex, the Canada Gazette, court filings,
              regulator pages and the standards bodies. Vendor and law-firm posts were used only to
              find them. Where a source could not be re-read that day, the entry says so.
            </p>
            <ol className="space-y-2 text-sm text-slate-600 dark:text-slate-400 list-decimal pl-5">
              {sources.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    {s.label}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ol>
          </section>

          {/* Disclaimer */}
          <section aria-label="Disclaimer">
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2">
                Educational Content, Not Legal Advice
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                This calendar is provided for general educational purposes only and does not
                constitute legal advice. Deadlines can move when courts rule, regulators issue final
                rules or official expectations change, and several dates here are expectations or
                computed from a cycle. Whether a date applies to you depends on your organization and
                where it operates. For advice about your situation, consult a lawyer qualified in the
                relevant jurisdiction.
              </p>
            </div>
          </section>
        </div>
      </div>

      {/* Related Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-20">
        <RelatedContent
          content="accessibility compliance deadlines ADA Title II Section 504 European Accessibility Act EN 301 549 Accessible Canada AODA WCAG 2.1 calendar"
          title="Related Resources"
          maxItems={3}
        />
      </section>
    </div>
  )
}
