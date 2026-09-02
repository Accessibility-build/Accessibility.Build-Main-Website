import type { Metadata } from "next"
import Link from "next/link"
import { BreadcrumbStructuredData, FAQStructuredData } from "@/components/seo/structured-data"
import { GuideArticleSchema } from "@/components/seo/guide-article-schema"
import { PageByline } from "@/components/seo/page-byline"
import { RelatedContent } from "@/components/seo/related-content"
import { KeyFacts } from "@/components/research/key-facts"
import { clampDescription } from "@/lib/metadata"

// One page, one number per passage.
//
// Answer engines retrieve passage by passage, so a statistic is only useful
// to them when it can be lifted on its own: the figure, what it measures, who
// measured it, and when. Every entry below is written to that shape, and every
// entry links to the source or to the site's own dataset page for it. Nothing
// here is estimated; where a figure is a projection or a survey, it says so.

const ROUTE = "/research/web-accessibility-statistics"
const UPDATED = "2026-09-03"
const pageTitle = "Web Accessibility Statistics 2026"
const pageDescription =
  "Sourced web accessibility statistics for 2026: disability prevalence, WebAIM Million failure rates, screen reader usage, lawsuit counts, public sector compliance, audit costs and salaries. Each figure dated and linked to its source."

export const metadata: Metadata = {
  title: pageTitle,
  description: clampDescription(pageDescription),
  keywords: [
    "web accessibility statistics",
    "accessibility statistics 2026",
    "disability statistics",
    "screen reader statistics",
    "WebAIM Million 2026",
    "ADA lawsuit statistics 2026",
    "accessibility lawsuit numbers",
    "how many websites are accessible",
    "accessibility audit cost statistics",
    "accessibility salary statistics",
  ],
  alternates: { canonical: ROUTE },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: ROUTE,
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: `/api/og?title=${encodeURIComponent("Web Accessibility Statistics 2026")}&section=Research`,
        width: 1200,
        height: 630,
        alt: "Web accessibility statistics 2026",
      },
    ],
  },
}

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Research", url: "https://accessibility.build/research" },
  { name: "Web accessibility statistics", url: `https://accessibility.build${ROUTE}` },
]

interface Stat {
  value: string
  /** The claim as one sentence a reader or a model can lift on its own. */
  claim: string
  /** What it does and does not measure. */
  note?: string
  source: string
  sourceHref: string
  /** ISO date of the source publication or data period. */
  date: string
  /** Site page that holds the underlying dataset. */
  more?: string
}

interface Section {
  id: string
  title: string
  lede: string
  stats: Stat[]
}

const SECTIONS: Section[] = [
  {
    id: "people",
    title: "How many people have a disability",
    lede: "Prevalence figures from national statistical agencies and the WHO. Definitions differ between them, so the figures are not directly comparable with each other; each is comparable with itself over time.",
    stats: [
      { value: "1.3 billion", claim: "About 1.3 billion people, 16% of the world's population, live with a significant disability.", source: "World Health Organization, disability fact sheet", sourceHref: "https://www.who.int/news-room/fact-sheets/detail/disability-and-health", date: "2023-03-07" },
      { value: "28.7%", claim: "28.7% of adults in the United States, about 73.4 million people, report a disability.", note: "Behavioral Risk Factor Surveillance System, 2022 data; the highest figure the CDC has recorded.", source: "CDC Disability and Health Data System", sourceHref: "https://data.cdc.gov/d/s2qv-b27b", date: "2024-07-16", more: "/research/disability-statistics" },
      { value: "13.9%", claim: "Cognitive disability is the most common type among US adults, at 13.9% (33.2 million), ahead of mobility at 12.2%.", note: "Cognitive rose from 10.8% in 2016 to 13.9% in 2022, the fastest-growing category and not where most accessibility effort goes.", source: "CDC BRFSS via DHDS", sourceHref: "https://data.cdc.gov/d/s2qv-b27b", date: "2024-07-16", more: "/research/disability-statistics" },
      { value: "5.5%", claim: "5.5% of US adults, about 14.4 million, report serious difficulty seeing even with glasses; 6.2% (17.7 million) report serious difficulty hearing.", source: "CDC BRFSS via DHDS", sourceHref: "https://data.cdc.gov/d/s2qv-b27b", date: "2024-07-16", more: "/research/disability-statistics" },
      { value: "23.9%", claim: "23.9% of people aged 16 or over in the EU, about 90 million, reported a disability (activity limitation) in 2024, ranging from 12.7% in Bulgaria to 41.2% in Latvia.", source: "Eurostat, population with disability", sourceHref: "https://ec.europa.eu/eurostat/statistics-explained/index.php?title=Population_with_disability", date: "2025-12-03" },
      { value: "16.1 million", claim: "16.1 million people in the UK, 24% of the population, had a disability in 2022/23.", source: "House of Commons Library, from the DWP Family Resources Survey", sourceHref: "https://commonslibrary.parliament.uk/research-briefings/cbp-9602/", date: "2024-10-07" },
    ],
  },
  {
    id: "web",
    title: "How accessible the web is",
    lede: "WebAIM's annual automated evaluation of the home pages of the top one million websites is the largest consistent series. It detects the machine-detectable subset of WCAG failures, so every figure here is a floor, not a measure of usability.",
    stats: [
      { value: "95.9%", claim: "95.9% of the top one million home pages had at least one detectable WCAG 2 failure in February 2026, up from 94.8% in 2025, reversing six years of gradual improvement.", source: "WebAIM Million 2026", sourceHref: "https://webaim.org/projects/million/", date: "2026-03-30", more: "/research/state-of-accessibility" },
      { value: "56.1", claim: "Home pages averaged 56.1 detectable errors each in 2026, up 10.1% from 51 in 2025; 56,114,377 errors were detected across the sample.", note: "One error for every 26 page elements on average.", source: "WebAIM Million 2026", sourceHref: "https://webaim.org/projects/million/", date: "2026-03-30", more: "/research/state-of-accessibility" },
      { value: "83.9%", claim: "Low-contrast text appeared on 83.9% of home pages in 2026, the most common failure, up from 79.1% in 2025.", source: "WebAIM Million 2026", sourceHref: "https://webaim.org/projects/million/", date: "2026-03-30", more: "/research/state-of-accessibility" },
      { value: "53.1%", claim: "53.1% of home pages had images with missing alternative text, 51.0% had form inputs without labels, 46.3% had empty links and 30.6% had empty buttons.", note: "The same six failure types account for 96% of all detected errors, every year since the series began.", source: "WebAIM Million 2026", sourceHref: "https://webaim.org/projects/million/", date: "2026-03-30", more: "/research/state-of-accessibility" },
      { value: "59.1 vs 42", claim: "Home pages that use ARIA averaged 59.1 errors; pages without ARIA averaged 42. ARIA was present on 82.7% of pages, at 133 attributes per page.", note: "Correlation, not cause: heavier pages use more ARIA and have more of everything.", source: "WebAIM Million 2026", sourceHref: "https://webaim.org/projects/million/", date: "2026-03-30", more: "/research/state-of-accessibility" },
      { value: "17.1%", claim: "Only 17.1% of home pages had a skip link, 46.1% had a main landmark, 41.8% skipped heading levels and 18.1% had more than one h1.", source: "WebAIM Million 2026", sourceHref: "https://webaim.org/projects/million/", date: "2026-03-30", more: "/research/state-of-accessibility" },
      { value: "42.4 vs 71.4", claim: "Government sites averaged the fewest detected errors of any category (42.4 per page) and sports sites the most (71.4); shopping sites averaged 71.0.", source: "WebAIM Million 2026, category analysis", sourceHref: "https://webaim.org/projects/million/", date: "2026-03-30", more: "/research/accessibility-by-industry" },
      { value: "85", claim: "The median Lighthouse accessibility score across the sample was 85 out of 100, on pages where 95.9% had detectable failures.", note: "A high automated score and a failing page are not contradictory; the score weights a small set of checks.", source: "WebAIM Million 2026", sourceHref: "https://webaim.org/projects/million/", date: "2026-03-30", more: "/research/state-of-accessibility" },
    ],
  },
  {
    id: "users",
    title: "Screen reader users",
    lede: "WebAIM's tenth screen reader user survey, 1,539 respondents in December 2023 and January 2024, is the most recent large sample of how blind and low-vision people actually use the web.",
    stats: [
      { value: "40.5%", claim: "JAWS is the primary desktop screen reader for 40.5% of respondents, NVDA for 37.7%, VoiceOver for 9.7% and Narrator for 0.7%.", source: "WebAIM Screen Reader User Survey #10", sourceHref: "https://webaim.org/projects/screenreadersurvey10/", date: "2024-02-22" },
      { value: "71.6%", claim: "71.6% of screen reader users use more than one screen reader; NVDA is used by 65.6% of respondents and JAWS by 60.5%.", note: "Testing with one screen reader covers the primary tool of well under half of users.", source: "WebAIM Screen Reader User Survey #10", sourceHref: "https://webaim.org/projects/screenreadersurvey10/", date: "2024-02-22" },
      { value: "91.3%", claim: "91.3% of screen reader users also use a screen reader on a mobile device; VoiceOver is used by 70.6% of them and TalkBack by 34.7%.", source: "WebAIM Screen Reader User Survey #10", sourceHref: "https://webaim.org/projects/screenreadersurvey10/", date: "2024-02-22" },
      { value: "24.7%", claim: "JAWS with Chrome is the single most common screen reader and browser combination at 24.7%; Chrome is the primary browser for 52.3% of respondents.", source: "WebAIM Screen Reader User Survey #10", sourceHref: "https://webaim.org/projects/screenreadersurvey10/", date: "2024-02-22" },
      { value: "71.6%", claim: "71.6% of screen reader users navigate an unfamiliar page by its headings first, which is why heading structure ranks with alternative text as a first-order requirement.", source: "WebAIM Screen Reader User Survey #10", sourceHref: "https://webaim.org/projects/screenreadersurvey10/", date: "2024-02-22" },
      { value: "18.6%", claim: "18.6% of screen reader users said web accessibility had got worse over the previous year, 46.8% said it was unchanged and 34.6% said it had improved.", source: "WebAIM Screen Reader User Survey #10", sourceHref: "https://webaim.org/projects/screenreadersurvey10/", date: "2024-02-22" },
      { value: "#1", claim: "CAPTCHA is the most problematic item screen reader users report, ahead of interactive elements behaving unexpectedly, nonsensical link and button text, unexpected screen changes and missing keyboard access.", source: "WebAIM Screen Reader User Survey #10", sourceHref: "https://webaim.org/projects/screenreadersurvey10/", date: "2024-02-22" },
    ],
  },
  {
    id: "lawsuits",
    title: "Lawsuits",
    lede: "Two series are commonly mixed. Seyfarth Shaw counts federal-court website cases by manual review; UsableNet counts federal and state filings together and runs much higher. Both are given here, labelled.",
    stats: [
      { value: "3,117", claim: "3,117 website accessibility lawsuits were filed in US federal courts in 2025, up 27% on 2024 and the highest annual total in the series.", note: "Website cases were 36% of all 8,667 ADA Title III federal filings in 2025.", source: "Seyfarth Shaw, federal filing series", sourceHref: "https://www.adatitleiii.com/2026/03/federal-court-website-accessibility-lawsuit-filings-bounce-back-in-2025/", date: "2026-03-01", more: "/research/accessibility-lawsuits" },
      { value: "21,550", claim: "21,550 website accessibility lawsuits were filed in federal court between 2018 and 2025.", source: "Seyfarth Shaw series, summed", sourceHref: "/research/accessibility-lawsuits", date: "2026-03-01", more: "/research/accessibility-lawsuits" },
      { value: "+177%", claim: "Federal website filings rose 177% in 2018, from 814 to 2,258, after the Justice Department withdrew its web accessibility rulemaking in December 2017. The 2019 Supreme Court denial in Domino's was followed by a flat year.", source: "Seyfarth Shaw series", sourceHref: "/cases/robles-v-dominos", date: "2026-03-01", more: "/cases/robles-v-dominos" },
      { value: "6,176", claim: "UsableNet projects about 6,176 digital accessibility lawsuits across federal and state courts in 2026, a record and nearly 20% above 2025, based on filings to 14 June 2026.", note: "A projection, and a different series from the federal count above.", source: "UsableNet 2026 midyear report", sourceHref: "https://info.usablenet.com/2026-midyear-report", date: "2026-06-30", more: "/research/accessibility-lawsuits" },
      { value: "80%", claim: "About 80% of digital accessibility lawsuits are brought against e-commerce companies.", source: "UsableNet 2026 midyear report", sourceHref: "https://blog.usablenet.com/inside-the-2026-midyear-numbers-where-digital-accessibility-litigation-is-going", date: "2026-06-30", more: "/research/accessibility-lawsuits" },
      { value: "1,021", claim: "New York was the leading federal venue in 2025 with 1,021 website filings.", source: "Seyfarth Shaw series", sourceHref: "/research/accessibility-lawsuits", date: "2026-03-01", more: "/research/accessibility-lawsuits" },
      { value: "46%", claim: "46% of federal website cases in 2025 were filed against a company that had already been sued at least once before; 1,427 defendants were repeat defendants.", source: "Industry litigation reports compiled in the lawsuit tracker", sourceHref: "/research/accessibility-lawsuits", date: "2026-08-27", more: "/research/accessibility-lawsuits" },
      { value: "$0", claim: "Title III of the ADA provides no damages to a private plaintiff; the remedy is an injunction and legal fees. Every dollar awarded in the landmark cases came from state law, mainly California's Unruh Act at $4,000 per violation.", source: "42 U.S.C. 12188; the three case studies", sourceHref: "/reference/ada-website-case-law", date: "2026-09-02", more: "/reference/ada-website-case-law" },
      { value: "$37,000", claim: "The only remediation estimate ever given in evidence at a web accessibility trial was $37,000 or less, against a $250,000 budget the defendant had set aside; the judge found the difference of no moment.", source: "Gil v. Winn-Dixie, trial verdict", sourceHref: "/cases/gil-v-winn-dixie", date: "2017-06-12", more: "/cases/gil-v-winn-dixie" },
      { value: "500+", claim: "In February 2026 the Justice Department recorded that one class counsel had filed substantially the same website lawsuit more than 500 times between 2019 and 2023, in a statement opposing a $2.52 million fee award.", source: "US Department of Justice, statement of interest in Alcazar v. Fashion Nova", sourceHref: "https://www.justice.gov/opa/pr/department-justice-opposes-unfair-class-action-settlement-involving-accessibility-website", date: "2026-02-02", more: "/blog/doj-opposes-website-accessibility-class-settlement-2026" },
    ],
  },
  {
    id: "public-sector",
    title: "Public sector and regulation",
    lede: "Where a regulator publishes its own monitoring, the numbers are usually worse than the sector's statements claim.",
    stats: [
      { value: "1,203", claim: "The UK Government Digital Service monitored 1,203 public sector websites and 21 mobile apps between January 2022 and September 2024; 85% had published an accessibility statement, and 16,482 issues were fixed as a direct result of monitoring.", source: "GDS accessibility monitoring report, December 2024", sourceHref: "https://accessibility.blog.gov.uk/2024/12/17/what-gds-has-found-from-public-sector-accessibility-monitoring/", date: "2024-12-17", more: "/tools/accessibility-statement-checker" },
      { value: "39 of 593", claim: "In GDS's first monitoring round, only 39 of 593 UK public sector accessibility statements examined between February 2020 and November 2021 were fully compliant with the regulations.", note: "The statement is a legal document with mandatory content; most failures were missing required information, not tone.", source: "GDS accessibility monitoring, first report", sourceHref: "https://accessibility.blog.gov.uk/category/accessibility-monitoring/", date: "2022-01-01", more: "/tools/accessibility-statement-checker" },
      { value: "26 Apr 2027", claim: "US state and local governments serving 50,000 or more people must meet WCAG 2.1 AA under ADA Title II by 26 April 2027, and smaller entities by 26 April 2028, after a Justice Department interim final rule of 20 April 2026 extended each deadline by a year.", source: "US Department of Justice, Title II web rule and 2026 interim final rule", sourceHref: "https://www.ada.gov/resources/2024-03-08-web-rule/", date: "2026-04-20", more: "/compliance/ada" },
      { value: "28 Jun 2025", claim: "The European Accessibility Act has applied to in-scope products and services since 28 June 2025; all 27 member states have notified transposing measures, 378 national instruments in total.", source: "Directive (EU) 2019/882, Article 31; Commission transposition register", sourceHref: "/research/european-accessibility-act", date: "2026-08-27", more: "/research/european-accessibility-act" },
      { value: "60", claim: "The Section 508 assessment covers 60 US federal agencies for fiscal year 2025, rating each on conformance and implementation maturity.", source: "GSA and OMB, Section 508 assessment", sourceHref: "https://www.section508.gov/manage/section-508-assessment/", date: "2026-08-27", more: "/research/section-508-assessment" },
      { value: "0", claim: "There is still no federal technical accessibility regulation for private business websites under ADA Title III; the 2024 rule that adopted WCAG 2.1 AA binds state and local government only.", source: "US Department of Justice, Title II rule", sourceHref: "https://www.ada.gov/resources/2024-03-08-web-rule/", date: "2024-04-24", more: "/compliance/ada" },
      { value: "28 Aug 2026", claim: "Missouri's SB 907 safe harbour, operative 28 August 2026, creates a rebuttable presumption against abusive litigation where a defendant takes substantial good-faith steps to fix a noticed violation within 90 days; it does not change the federal duty.", source: "Missouri Senate Bill 907", sourceHref: "https://www.senate.mo.gov/26info/pdf-bill/tat/SB907.pdf", date: "2026-08-28", more: "/blog/missouri-sb-907-accessibility-litigation-safe-harbor" },
    ],
  },
  {
    id: "cost",
    title: "What it costs and what it pays",
    lede: "Published prices, dated. Most providers do not publish; these are the ones that do, and our own page on audit pricing explains what drives the differences.",
    stats: [
      { value: "$100 to $250", claim: "A fully manual WCAG 2.1 or 2.2 AA audit is priced at $100 to $250 per page or screen, with $25 to $100 for light pages, and typical projects at $1,250 to $2,750.", source: "Accessible.org published pricing", sourceHref: "https://accessible.org/pricing/", date: "2026-07-25", more: "/guides/accessibility-audit-cost" },
      { value: "£4,950", claim: "AbilityNet's fixed-price Digital Accessibility Review, covering up to ten pages, components or features with screen reader testing against WCAG 2.2, is £4,950 plus VAT.", source: "AbilityNet published pricing", sourceHref: "https://abilitynet.org.uk/accessibility-services/digital-accessibility-review", date: "2026-09-03", more: "/guides/accessibility-audit-cost" },
      { value: "$1,500 to $5,000", claim: "DigitalA11Y prices web accessibility audits at $1,500 to $5,000, each including a screen reader user tester.", source: "DigitalA11Y audit cost guide", sourceHref: "https://www.digitala11y.com/how-much-does-a-web-accessibility-audit-cost/", date: "2026-02-05", more: "/guides/accessibility-audit-cost" },
      { value: "$350 to $950", claim: "A VPAT or accessibility conformance report is priced at $350 (WCAG edition), $550 (Section 508), $650 (EN 301 549) or $950 (international), on top of the audit.", source: "Accessible.org published pricing", sourceHref: "https://accessible.org/pricing/", date: "2026-07-25", more: "/guides/vpat-accessibility-conformance-report" },
      { value: "$101,688", claim: "The average salary of digital accessibility professionals worldwide was $101,688 in early 2026, with a median of $94,394, across 300 respondents in 23 countries.", note: "Down from $109,542 the year before, which WebAIM attributes to fewer very senior respondents rather than falling rates.", source: "WebAIM Global Digital Accessibility Salary Survey #2", sourceHref: "https://webaim.org/projects/salary2/", date: "2026-02-01", more: "/research/accessibility-salary" },
      { value: "35.9%", claim: "Accessibility professionals with more experience earn 35.9% more on average than those with less, the largest single pay gap in the survey.", source: "WebAIM Global Digital Accessibility Salary Survey #2", sourceHref: "https://webaim.org/projects/salary2/", date: "2026-02-01", more: "/research/accessibility-salary" },
      { value: "$3,738,864.96", claim: "The fee award in the first web accessibility class action, NFB v. Target, was $3,738,864.96, on top of a $6 million damages fund for California claimants.", source: "NFB v. Target, fee order of 3 August 2009", sourceHref: "/cases/nfb-v-target", date: "2009-08-03", more: "/cases/nfb-v-target" },
    ],
  },
  {
    id: "ai",
    title: "AI, agents and the accessibility tree",
    lede: "The newest numbers, and the reason accessibility is becoming a machine-readability problem as well as a human one.",
    stats: [
      { value: "50%", claim: "Automated agent and crawler traffic passed half of all internet traffic for the first time in June 2026.", source: "Cloudflare, reported by Ahrefs", sourceHref: "https://ahrefs.com/blog/ai-search-trends/", date: "2026-06-30" },
      { value: "19 Aug 2026", claim: "Anthropic's browser-use tool, generally available from 19 August 2026, operates web pages through their accessibility tree: the same names, roles and states a screen reader uses.", note: "A control with no accessible name is invisible to both.", source: "Anthropic release, August 2026", sourceHref: "https://www.anthropic.com/news", date: "2026-08-19", more: "/blog/claude-opus-5-accessibility-tree" },
      { value: "97%", claim: "97% of llms.txt files across 137,000 domains were never requested by any crawler in May 2026; Google has said it does not read the file.", note: "Robots.txt is honoured by every major crawler; llms.txt by almost none.", source: "Ahrefs server-log study", sourceHref: "https://ahrefs.com/blog/ai-search-trends/", date: "2026-06-30" },
    ],
  },
]

const FAQS = [
  {
    question: "What percentage of websites are accessible?",
    answer: "No large-scale study measures full accessibility. The closest proxy is WebAIM's automated evaluation of the top one million home pages: in February 2026, 95.9% had at least one detectable WCAG 2 failure, so at most 4.1% passed the automated checks, and true conformance is lower because automation finds only a subset of failures.",
  },
  {
    question: "How many accessibility lawsuits were filed in 2025?",
    answer: "3,117 website accessibility lawsuits were filed in US federal courts in 2025 according to Seyfarth Shaw's manually reviewed series, up 27% on 2024. Counts that include state courts run higher: UsableNet reported about 5,000 for 2025 and projects about 6,176 for 2026. The two series should not be mixed.",
  },
  {
    question: "What is the most common web accessibility failure?",
    answer: "Low-contrast text, found on 83.9% of the top one million home pages in 2026, followed by missing alternative text on images (53.1%), missing form labels (51.0%), empty links (46.3%) and empty buttons (30.6%). The same six failure types account for 96% of all detected errors.",
  },
  {
    question: "Which screen reader is most used?",
    answer: "JAWS is the primary desktop screen reader for 40.5% of users and NVDA for 37.7%, but NVDA is used at all by more people (65.6% against 60.5%), and 71.6% of users use more than one. On mobile, VoiceOver is used by 70.6% and TalkBack by 34.7%.",
  },
  {
    question: "How much does an accessibility audit cost?",
    answer: "Published prices in 2026 range from $100 to $250 per page for a fully manual audit (Accessible.org), $1,500 to $5,000 per audit (DigitalA11Y) and £4,950 plus VAT for a fixed ten-page review (AbilityNet). Most providers do not publish prices; our audit cost guide explains what drives them.",
  },
]

export default function WebAccessibilityStatisticsPage() {
  const total = SECTIONS.reduce((n, s) => n + s.stats.length, 0)
  return (
    <>
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />
      <GuideArticleSchema
        route={ROUTE}
        title={pageTitle}
        description={pageDescription}
        datePublished="2026-09-03"
        section="Research"
        author={{ name: "The Accessibility.build team", url: "https://accessibility.build/about", type: "Organization" }}
      />
      <FAQStructuredData faqs={FAQS} />

      <article className="bg-white pb-20 dark:bg-slate-950">
        <header className="border-b border-slate-200 bg-slate-50 pt-12 dark:border-slate-800 dark:bg-slate-900/40">
          <div className="container-wide py-10 lg:py-14">
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <li>
                  <Link href="/" className="hover:text-teal-700 dark:hover:text-teal-300">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link href="/research" className="hover:text-teal-700 dark:hover:text-teal-300">
                    Research
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-slate-900 dark:text-white">Web accessibility statistics</li>
              </ol>
            </nav>
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">
              Research &middot; Updated monthly
            </p>
            <h1 className="mt-3 max-w-4xl font-serif text-4xl font-semibold leading-[1.1] tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              Web accessibility statistics, 2026
            </h1>
            <p className="mt-6 max-w-[62ch] text-lg leading-8 text-slate-700 dark:text-slate-300">
              {total} figures on disability, the state of the web, screen reader use, litigation,
              regulation, cost and pay. Each one is written to stand on its own, with what it
              measures, who measured it and when, and links to the source. Where a number is a
              projection or a survey, it says so. Nothing here is estimated by us.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-600 dark:text-slate-400">
              <PageByline
                route={ROUTE}
                reviewer={{ name: "The Accessibility.build team", href: "/about", credential: "" }}
              />
            </div>
          </div>
        </header>

        <div className="container-wide">
          <div className="mx-auto max-w-5xl py-12">
            <KeyFacts
              title="The six most-asked numbers"
              facts={[
                { value: "95.9%", label: "of the top million home pages have a detectable WCAG failure", source: "WebAIM Million 2026", sourceHref: "https://webaim.org/projects/million/", asOf: "2026-03-30" },
                { value: "3,117", label: "US federal website accessibility lawsuits in 2025, up 27%", source: "Seyfarth Shaw", sourceHref: "https://www.adatitleiii.com/2026/03/federal-court-website-accessibility-lawsuit-filings-bounce-back-in-2025/", asOf: "2026-03-01" },
                { value: "28.7%", label: "of US adults report a disability, about 73.4 million people", source: "CDC BRFSS 2022", sourceHref: "https://data.cdc.gov/d/s2qv-b27b", asOf: "2024-07-16" },
                { value: "83.9%", label: "of home pages have low-contrast text, the most common failure", source: "WebAIM Million 2026", sourceHref: "https://webaim.org/projects/million/", asOf: "2026-03-30" },
                { value: "71.6%", label: "of screen reader users use more than one screen reader", source: "WebAIM survey #10", sourceHref: "https://webaim.org/projects/screenreadersurvey10/", asOf: "2024-02-22" },
                { value: "$0", label: "damages available to a private plaintiff under ADA Title III", source: "42 U.S.C. 12188", sourceHref: "/reference/ada-website-case-law", asOf: "2026-09" },
              ]}
            />

            <nav aria-label="Sections" className="mt-8 flex flex-wrap gap-2 text-sm">
              {SECTIONS.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="rounded-md border border-slate-200 px-3 py-1.5 text-slate-700 hover:border-slate-400 dark:border-slate-800 dark:text-slate-300 dark:hover:border-slate-600"
                >
                  {s.title}
                </a>
              ))}
            </nav>

            {SECTIONS.map((section) => (
              <section key={section.id} id={section.id} aria-labelledby={`${section.id}-heading`} className="mt-14 scroll-mt-28">
                <h2 id={`${section.id}-heading`} className="font-serif text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">
                  {section.title}
                </h2>
                <p className="mt-3 max-w-[62ch] leading-7 text-slate-600 dark:text-slate-400">{section.lede}</p>
                <ol className="mt-6 divide-y divide-slate-200 border-y border-slate-200 dark:divide-slate-800 dark:border-slate-800" role="list">
                  {section.stats.map((stat) => (
                    <li key={stat.claim} className="grid gap-x-8 gap-y-2 py-5 md:grid-cols-[10rem_minmax(0,1fr)]">
                      <p className="font-mono text-2xl font-semibold tabular-nums leading-tight text-slate-900 dark:text-white">
                        {stat.value}
                      </p>
                      <div>
                        <h3 className="text-[1.05rem] font-medium leading-7 text-slate-900 dark:text-white">{stat.claim}</h3>
                        {stat.note ? (
                          <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">{stat.note}</p>
                        ) : null}
                        <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
                          Source:{" "}
                          {stat.sourceHref.startsWith("/") ? (
                            <Link href={stat.sourceHref} className="underline decoration-slate-300 underline-offset-2 hover:decoration-slate-600 dark:decoration-slate-600">
                              {stat.source}
                            </Link>
                          ) : (
                            <a href={stat.sourceHref} target="_blank" rel="noopener noreferrer" className="underline decoration-slate-300 underline-offset-2 hover:decoration-slate-600 dark:decoration-slate-600">
                              {stat.source}
                            </a>
                          )}
                          , <time dateTime={stat.date}>{formatDate(stat.date)}</time>
                          {stat.more && stat.more !== stat.sourceHref ? (
                            <>
                              {" "}&middot;{" "}
                              <Link href={stat.more} className="font-medium text-teal-700 underline underline-offset-2 dark:text-teal-300">
                                Full dataset
                              </Link>
                            </>
                          ) : null}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            ))}

            <section aria-labelledby="faq-heading" className="mt-14 max-w-[68ch]">
              <h2 id="faq-heading" className="font-serif text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">
                Frequently asked questions
              </h2>
              <dl className="mt-6 space-y-6">
                {FAQS.map((f) => (
                  <div key={f.question}>
                    <dt className="font-semibold text-slate-900 dark:text-white">{f.question}</dt>
                    <dd className="mt-2 leading-7 text-slate-700 dark:text-slate-300">{f.answer}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section aria-labelledby="method-heading" className="mt-14 max-w-[68ch]">
              <h2 id="method-heading" className="font-serif text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">
                How this page is maintained
              </h2>
              <div className="mt-4 space-y-4 leading-7 text-slate-700 dark:text-slate-300">
                <p>
                  Every figure links to its source and carries the date of that source. Figures from
                  our own datasets link to the dataset page, where the numbers can be downloaded as
                  CSV or JSON. Series that measure different things (federal filings against federal
                  plus state filings; automated home-page checks against full audits) are labelled so
                  they are not added together.
                </p>
                <p>
                  The page is reviewed monthly. Last review:{" "}
                  <time dateTime={UPDATED}>{formatDate(UPDATED)}</time>. Corrections go through the{" "}
                  <Link href="/corrections-policy" className="font-medium text-teal-700 underline underline-offset-2 dark:text-teal-300">
                    corrections policy
                  </Link>
                  . To cite this page: Accessibility.build, Web Accessibility Statistics 2026,
                  accessibility.build/research/web-accessibility-statistics, with the individual
                  source for any figure you reuse.
                </p>
              </div>
            </section>

            <div className="mt-14">
              <RelatedContent
                content="accessibility statistics disability screen reader lawsuits WebAIM research data"
                title="Related reading"
                maxItems={4}
                showDescriptions
              />
            </div>
          </div>
        </div>
      </article>
    </>
  )
}

function formatDate(iso: string) {
  if (iso.length === 7) {
    const d = new Date(`${iso}-01`)
    return d.toLocaleDateString("en-GB", { month: "long", year: "numeric" })
  }
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
}
