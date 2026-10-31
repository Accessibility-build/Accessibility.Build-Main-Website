import type { Metadata } from "next"
import Link from "next/link"
import { BreadcrumbStructuredData } from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"
import { ArrowRight } from "lucide-react"
import {
  AgentTreeIllustration,
  BenchmarkGridIllustration,
  HubHeroIllustration,
  StatementIllustration,
} from "@/components/research/hub-illustrations"
import { getRouteDate } from "@/lib/site-routes"
import { createMetadata } from "@/lib/metadata"
import agentReadiness from "@/lib/data/agent-readiness-2026.json"
import statementsStudy from "@/lib/data/accessibility-statements-2026.json"
import { lawsSummary } from "@/lib/data/accessibility-laws"

export const metadata: Metadata = {
  ...createMetadata({
    title: "Accessibility Research & Data Reports",
    path: "/research",
    description:
      "Accessibility research synthesis, source-linked data reports, lawsuit tracking, and jurisdiction analysis with interactive charts and documented references.",
    keywords: [
      "accessibility research",
      "web accessibility data",
      "accessibility statistics",
      "accessibility reports",
      "digital accessibility research",
      "wcag compliance data",
    ],
    type: "website",
  }),
}

interface Report {
  title: string
  description: string
  href: string
  stat: { label: string; value: string }
}

const originalReports: (Report & { Illustration: typeof AgentTreeIllustration })[] = [
  {
    title: "Can an AI Agent Use Your Website?",
    description:
      "We took the accessibility-tree view a browser-use agent receives of FTSE 100 and UK council home pages and counted the controls it cannot name, the images without alt text and the unlabelled fields.",
    href: "/research/ai-agent-readiness",
    stat: {
      label: "Home pages measured",
      value: String(agentReadiness.groups.ftse100.measured + agentReadiness.groups.councils.measured),
    },
    Illustration: AgentTreeIllustration,
  },
  {
    title: "State of Accessibility Statements 2026",
    description:
      "Our statement checker run over every UK local authority and the FTSE 100: who publishes a statement, how many carry every mandatory element, and which elements are most often missing.",
    href: "/research/accessibility-statements-2026",
    stat: {
      label: "Organisations checked",
      value: String(statementsStudy.groups.councils.checked + statementsStudy.groups.ftse100.checked),
    },
    Illustration: StatementIllustration,
  },
  {
    title: "Accessibility Testing Tools Benchmark",
    description:
      "axe-core, Lighthouse, HTML_CodeSniffer and IBM Equal Access run against one page seeded with thirty known WCAG defects. Which tool finds what, and which defects nobody finds.",
    href: "/research/accessibility-testing-tools-benchmark",
    stat: { label: "Seeded defects found by all four", value: "12 of 30" },
    Illustration: BenchmarkGridIllustration,
  },
]

const dataReports: Report[] = [
  {
    title: "Web Accessibility Statistics 2026",
    description:
      "Disability prevalence, WebAIM Million failure rates, screen reader use, lawsuit counts, audit prices and salaries on one page. Each number is dated and sourced.",
    href: "/research/web-accessibility-statistics",
    stat: { label: "Sourced figures", value: "50+" },
  },
  {
    title: "State of Web Accessibility",
    description:
      "A source-linked synthesis of large-scale third-party datasets: reported failure rates, recurring barriers and year-over-year trends.",
    href: "/research/state-of-accessibility",
    stat: { label: "Dataset coverage", value: "Up to 1M" },
  },
  {
    title: "Accessibility by Technology Stack",
    description:
      "WordPress, Drupal, React, Vue, Shopify, Bootstrap and 40 more, set against the million-page average. Almost every popular widget library correlates with more errors, not fewer.",
    href: "/research/accessibility-by-technology",
    stat: { label: "Technologies compared", value: "46" },
  },
  {
    title: "Accessibility by Industry",
    description:
      "Government, non-profit and education lead; shopping and sport trail by roughly 29 errors per page. Average detected errors across 29 sectors and 17 languages.",
    href: "/research/accessibility-by-industry",
    stat: { label: "Sectors ranked", value: "29" },
  },
  {
    title: "US Disability Prevalence",
    description:
      "28.7% of US adults report a disability, about 73.4 million people. Prevalence by type and the 2016 to 2022 trend, from the CDC data API.",
    href: "/research/disability-statistics",
    stat: { label: "Of US adults", value: "28.7%" },
  },
  {
    title: "Section 508 Federal Scorecard",
    description:
      "58% of US federal agencies scored Low or Very Low on whether their technology is actually accessible. All 60 agencies ranked, from the government's own response data.",
    href: "/research/section-508-assessment",
    stat: { label: "Agencies scored", value: "60" },
  },
  {
    title: "Screen Reader Survey 2026",
    description:
      "WebAIM's 2026 survey set against 2024: JAWS rose to 55.0% primary use, NVDA fell to 32.9%, and 60.1% now use AI for image descriptions.",
    href: "/research/screen-reader-survey-2026",
    stat: { label: "JAWS primary", value: "55.0%" },
  },
  {
    title: "Digital Accessibility Salary Report",
    description:
      "What accessibility professionals earn by country, experience, work location and organisation size. Ten years of experience is worth a 36% premium.",
    href: "/research/accessibility-salary",
    stat: { label: "Average full-time", value: "$101,688" },
  },
]

const lawReports: Report[] = [
  {
    title: "Accessibility Laws by Jurisdiction",
    description: `Web accessibility laws, regulations and standards compared across ${lawsSummary.totalJurisdictions} jurisdictions: WCAG requirements, penalties, enforcement and upcoming deadlines.`,
    href: "/research/accessibility-laws",
    stat: { label: "Laws tracked", value: String(lawsSummary.totalLawsTracked) },
  },
  {
    title: "Accessibility Lawsuit Tracker",
    description:
      "ADA digital accessibility litigation across federal and state courts. 2025 closed at 3,117 federal filings. Filing trends, target industries and settlement costs.",
    href: "/research/accessibility-lawsuits",
    stat: { label: "Cases tracked", value: "25,500+" },
  },
  {
    title: "European Accessibility Act Tracker",
    description:
      "Every EAA date quoted from Directive (EU) 2019/882, plus transposition measures for all 27 Member States. There is no EU-wide enforcement dataset, and the first Commission report is not due until 2030.",
    href: "/research/european-accessibility-act",
    stat: { label: "Member States", value: "27 of 27" },
  },
  {
    title: "EAA Fines and Penalties by Country",
    description:
      "What each EU state's law says about EAA penalties, split by enforcement route, with the provision quoted and a plain label showing how far we verified it.",
    href: "/research/eaa-penalties",
    stat: { label: "States fully verified", value: "13 of 27" },
  },
]

const allReports = [...originalReports, ...dataReports, ...lawReports]

const shortcuts = [
  { question: "A number I can cite", href: "/research/web-accessibility-statistics" },
  { question: "Which laws apply where", href: "/research/accessibility-laws" },
  { question: "How often websites get sued", href: "/research/accessibility-lawsuits" },
  { question: "EU fines by country", href: "/research/eaa-penalties" },
  { question: "How much testing tools catch", href: "/research/accessibility-testing-tools-benchmark" },
]

function reportDate(href: string): string | null {
  return getRouteDate(href)
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`))
}

const latestUpdate = allReports
  .map((report) => reportDate(report.href))
  .filter((date): date is string => Boolean(date))
  .sort()
  .at(-1)

function UpdatedLine({ href }: { href: string }) {
  const date = reportDate(href)
  if (!date) return null
  return (
    <p className="text-sm text-muted-foreground">
      Updated <time dateTime={date}>{formatDate(date)}</time>
    </p>
  )
}

function ReportRows({ reports }: { reports: Report[] }) {
  return (
    <ul className="divide-y divide-border border-y border-border">
      {reports.map((report) => (
        <li
          key={report.href}
          className="group relative grid gap-4 py-6 transition-colors hover:bg-muted/50 md:grid-cols-[minmax(0,1fr)_11rem_1.5rem] md:items-center md:gap-8 md:px-4"
        >
          <div className="min-w-0">
            <h3 className="text-lg font-semibold sm:text-xl">
              <Link
                href={report.href}
                className="rounded-sm after:absolute after:inset-0 group-hover:text-primary focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-inset focus-visible:after:ring-primary"
              >
                {report.title}
              </Link>
            </h3>
            <p className="mt-2 max-w-3xl leading-7 text-muted-foreground">{report.description}</p>
            <div className="mt-2">
              <UpdatedLine href={report.href} />
            </div>
          </div>
          <div>
            <p className="font-mono text-2xl font-semibold tabular-nums">{report.stat.value}</p>
            <p className="mt-1 text-sm leading-5 text-muted-foreground">{report.stat.label}</p>
          </div>
          <ArrowRight
            className="hidden h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary motion-reduce:transition-none md:block"
            aria-hidden="true"
          />
        </li>
      ))}
    </ul>
  )
}

function SectionIntro({
  id,
  number,
  title,
  text,
}: {
  id: string
  number: string
  title: string
  text: string
}) {
  return (
    <div className="mb-8 grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-10">
      <div>
        <p className="font-mono text-sm font-semibold text-muted-foreground">{number}</p>
        <h2 id={id} className="mt-2 text-3xl font-semibold sm:text-4xl">
          {title}
        </h2>
      </div>
      <p className="max-w-xl leading-7 text-muted-foreground md:self-end">{text}</p>
    </div>
  )
}

export default function ResearchPage() {
  return (
    <div className="min-h-screen">
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "Research", url: "https://accessibility.build/research" },
        ]}
      />

      <section aria-labelledby="research-heading" className="border-b border-border">
        <div className="container-wide grid gap-10 pb-12 pt-12 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:items-end lg:gap-16 lg:pb-16">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-semibold uppercase">
              <span className="inline-flex items-center gap-2">
                <span className="h-2.5 w-2.5 bg-a11y-teal" aria-hidden="true" />
                Research
              </span>
              <span className="text-muted-foreground">Free to read, free to cite</span>
            </div>
            <h1
              id="research-heading"
              className="mt-6 max-w-3xl text-4xl font-semibold leading-[1.08] sm:text-6xl"
            >
              Accessibility research you can{" "}
              <span className="relative mt-2 inline-block bg-primary px-2 pb-1 text-primary-foreground sm:mt-0">
                check.
                <span className="absolute -left-1 -top-1 h-3 w-3 border-l-2 border-t-2 border-foreground" aria-hidden="true" />
                <span className="absolute -right-1 -top-1 h-3 w-3 border-r-2 border-t-2 border-foreground" aria-hidden="true" />
                <span className="absolute -bottom-1 -left-1 h-3 w-3 border-b-2 border-l-2 border-foreground" aria-hidden="true" />
                <span className="absolute -bottom-1 -right-1 h-3 w-3 border-b-2 border-r-2 border-foreground" aria-hidden="true" />
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              Our own measurements, analysis of published datasets, and trackers of the law. We say
              which is which, and we link the sources so you can check the numbers yourself.
            </p>
          </div>
          <HubHeroIllustration className="hidden w-full max-w-md justify-self-end lg:block" />
        </div>

        <div className="container-wide">
          <dl className="grid grid-cols-2 border-t border-border sm:grid-cols-3">
            <div className="py-5 pr-4">
              <dt className="text-sm text-muted-foreground">Reports</dt>
              <dd className="mt-1 font-mono text-2xl font-semibold tabular-nums">{allReports.length}</dd>
            </div>
            <div className="py-5 pr-4">
              <dt className="text-sm text-muted-foreground">Our own measurements</dt>
              <dd className="mt-1 font-mono text-2xl font-semibold tabular-nums">{originalReports.length}</dd>
            </div>
            {latestUpdate ? (
              <div className="col-span-2 border-t border-border py-5 pr-4 sm:col-span-1 sm:border-t-0">
                <dt className="text-sm text-muted-foreground">Latest update</dt>
                <dd className="mt-1 font-mono text-2xl font-semibold tabular-nums">
                  <time dateTime={latestUpdate}>{formatDate(latestUpdate)}</time>
                </dd>
              </div>
            ) : null}
          </dl>
        </div>
      </section>

      <section aria-labelledby="shortcuts-heading" className="border-b border-border bg-muted/40">
        <div className="container-wide py-8">
          <h2 id="shortcuts-heading" className="text-base font-semibold">
            I am looking for
          </h2>
          <ul className="mt-4 flex flex-wrap gap-3">
            {shortcuts.map((shortcut) => (
              <li key={shortcut.href}>
                <Link
                  href={shortcut.href}
                  className="inline-flex min-h-11 items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  {shortcut.question}
                  <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="original-heading" className="container-wide py-14 md:py-20">
        <SectionIntro
          id="original-heading"
          number="01"
          title="Our own measurements"
          text="Studies we ran ourselves rather than summarised from someone else. Each report explains how we did it."
        />
        <ul className="grid gap-6 lg:grid-cols-3">
          {originalReports.map(({ Illustration, ...report }) => (
            <li
              key={report.href}
              className="group relative flex flex-col rounded-lg border border-border transition-colors hover:border-primary"
            >
              <div className="border-b border-border bg-muted/40 p-4">
                <Illustration className="mx-auto h-36 w-full max-w-xs" />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-xl font-semibold">
                  <Link
                    href={report.href}
                    className="rounded-sm after:absolute after:inset-0 after:rounded-lg group-hover:text-primary focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-primary"
                  >
                    {report.title}
                  </Link>
                </h3>
                <p className="mt-3 flex-1 leading-7 text-muted-foreground">{report.description}</p>
                <div className="mt-5 border-t border-border pt-4">
                  <p className="font-mono text-2xl font-semibold tabular-nums">{report.stat.value}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{report.stat.label}</p>
                  <div className="mt-2">
                    <UpdatedLine href={report.href} />
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="data-heading" className="container-wide pb-14 md:pb-20">
        <SectionIntro
          id="data-heading"
          number="02"
          title="The numbers, from their sources"
          text="Our analysis of datasets other people publish, including WebAIM, the CDC and the US government. Each report names its source, so cite the source as well as us."
        />
        <ReportRows reports={dataReports} />
      </section>

      <section aria-labelledby="law-heading" className="container-wide pb-14 md:pb-20">
        <SectionIntro
          id="law-heading"
          number="03"
          title="Law and enforcement"
          text="Trackers of laws, deadlines, lawsuits and penalties, kept close to primary sources. They are for information and are not legal advice."
        />
        <ReportRows reports={lawReports} />
      </section>

      <section aria-labelledby="cite-heading" className="border-y border-border bg-muted/40">
        <div className="container-wide grid gap-6 py-12 md:grid-cols-2 md:gap-10">
          <div>
            <h2 id="cite-heading" className="text-3xl font-semibold">
              Cite this research
            </h2>
            <p className="mt-4 max-w-xl leading-7 text-muted-foreground">
              You are welcome to use our findings. Please credit Accessibility.build and link to the
              report. If you spot an error, our{" "}
              <Link href="/corrections-policy" className="font-medium text-foreground underline underline-offset-2 hover:no-underline">
                corrections policy
              </Link>{" "}
              explains how we handle it.
            </p>
          </div>
          <figure className="min-w-0 rounded-lg border border-border bg-background p-5">
            <figcaption className="text-sm font-semibold">Example citation</figcaption>
            <p className="mt-3 leading-7 [overflow-wrap:anywhere]">
              Accessibility.build. &ldquo;Accessibility Testing Tools Benchmark.&rdquo;
              https://accessibility.build/research/accessibility-testing-tools-benchmark
            </p>
          </figure>
        </div>
      </section>

      <section className="container-wide py-14 md:py-20">
        <RelatedContent
          links={[
            {
              url: "/tools",
              title: "Accessibility Testing Tools",
              description:
                "Test your site with our free accessibility scanning tools.",
              type: "tool",
            },
            {
              url: "/checklists",
              title: "WCAG Checklists",
              description:
                "Step-by-step checklists for WCAG 2.2 compliance.",
              type: "checklist",
            },
            {
              url: "/guides",
              title: "Accessibility Guides",
              description:
                "In-depth interactive guides for keyboard and screen reader accessibility.",
              type: "guide",
            },
          ]}
        />
      </section>
    </div>
  )
}
