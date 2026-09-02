import type { Metadata } from "next"
import Link from "next/link"
import { BreadcrumbStructuredData, FAQStructuredData } from "@/components/seo/structured-data"
import { GuideArticleSchema } from "@/components/seo/guide-article-schema"
import { PageByline } from "@/components/seo/page-byline"
import { RelatedContent } from "@/components/seo/related-content"
import { KeyFacts } from "@/components/research/key-facts"
import { DatasetDownloads } from "@/components/research/dataset-downloads"
import { clampDescription } from "@/lib/metadata"
import data from "@/lib/data/accessibility-statements-2026.json"

// The statement is the one accessibility document with mandatory contents
// and a regulator that reads it, and nobody measures it at scale. Every
// "EAA checker" on the market scans a site for WCAG faults. This study runs
// the site's own statement checker over two defined samples and reports what
// it finds: whether a statement exists, and which mandatory elements are
// missing when it does.

const ROUTE = "/research/accessibility-statements-2026"
const pageTitle = "State of Accessibility Statements 2026"
const pageDescription =
  "We ran our accessibility statement checker over the home pages of UK local authorities and the FTSE 100. How many publish a statement, how many statements carry every mandatory element, and which elements are most often missing. Per-site results published."

export const metadata: Metadata = {
  title: pageTitle,
  description: clampDescription(pageDescription),
  keywords: [
    "accessibility statement compliance",
    "accessibility statement study 2026",
    "UK council accessibility statements",
    "PSBAR accessibility statement",
    "FTSE 100 accessibility statement",
    "EAA accessibility statement",
    "accessibility statement missing information",
    "GDS accessibility monitoring",
    "accessibility statement checker",
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
        url: `/api/og?title=${encodeURIComponent("State of Accessibility Statements 2026")}&section=Research`,
        width: 1200,
        height: 630,
        alt: "State of accessibility statements 2026",
      },
    ],
  },
}

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Research", url: "https://accessibility.build/research" },
  { name: "Accessibility statements 2026", url: `https://accessibility.build${ROUTE}` },
]

interface StatementSite {
  name: string
  host: string
  statementUrl: string
  percent: number
  verdict: string
  mandatoryPassed: number
  mandatoryTotal: number
  via: string
}

interface Group {
  label: string
  regime: string
  checked: number
  statementFound: number
  statementFoundPct: number
  lowConfidencePage: number
  noStatementFound: number
  verdicts: Record<string, number>
  fullyCompliant: number
  fullyCompliantPctOfFound: number
  medianPercent: number | null
  meanPercent: number | null
  mandatoryFailures: { id: string; label: string; count: number; pctOfFound: number }[]
  sites: StatementSite[]
}

const VERDICT_LABEL: Record<string, string> = {
  compliant: "Every mandatory element present",
  "missing-information": "Statement present, mandatory elements missing",
  "not-compliant": "Statement present, most mandatory elements missing",
}

function pct(n: number, d: number) {
  return d ? `${Math.round((100 * n) / d)}%` : "n/a"
}

const FAQS = [
  {
    question: "What has to be in an accessibility statement?",
    answer:
      "Under the UK Public Sector Bodies Accessibility Regulations and the EU Web Accessibility Directive, a statement must say what standard the site is measured against and how far it complies, list the content that is not accessible and why, say how the statement was prepared and when, give a way to report problems and request alternatives, and explain the enforcement procedure. The European Accessibility Act requires service providers to publish equivalent information about how the service meets the accessibility requirements. Our checker tests for each element.",
  },
  {
    question: "Does a missing statement mean a company is breaking the law?",
    answer:
      "For a UK public sector body, publishing a compliant statement has been mandatory since September 2020. For a listed company it depends on scope: the European Accessibility Act applies to in-scope services sold in the EU, and the Equality Act imposes no statement requirement at all. We report presence and completeness; we do not report breaches.",
  },
  {
    question: "How does this compare with the government's own monitoring?",
    answer:
      "GDS examined 593 public sector statements between February 2020 and November 2021 and found 39 fully compliant, about 7%, with 83% missing mandatory information. Our sample, method and date differ (councils only, an automated checker, September 2026), so the figures are not a like-for-like trend, but they show the same shape: most statements exist, and most that exist omit something the regulations require.",
  },
  {
    question: "How reliable is an automated check of a statement?",
    answer:
      "It is reliable at finding whether each required element is present in the text, and unreliable at judging whether the element is true. A statement can name WCAG 2.2 AA and be wrong about its own conformance. The checker also cannot verify dates or evaluation claims. Low-confidence results, where the page found reads like an accessibility hub rather than a statement, are reported separately and not scored.",
  },
]

function Failures({ g }: { g: Group }) {
  return (
    <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
      <table className="w-full border-collapse text-sm">
        <caption className="px-4 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
          {g.label}: mandatory elements missing, across the {g.statementFound} statements found
        </caption>
        <thead>
          <tr>
            {["Mandatory element", "Statements missing it", "Share of statements"].map((h, i) => (
              <th key={h} scope="col" className={`border-b border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 ${i ? "text-right" : "text-left"}`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-slate-700 dark:text-slate-300">
          {g.mandatoryFailures.map((f) => (
            <tr key={f.id}>
              <th scope="row" className="border-t border-slate-200 px-4 py-2 text-left font-normal dark:border-slate-800">{f.label}</th>
              <td className="border-t border-slate-200 px-4 py-2 text-right font-mono tabular-nums dark:border-slate-800">{f.count}</td>
              <td className="border-t border-slate-200 px-4 py-2 text-right font-mono tabular-nums dark:border-slate-800">{f.pctOfFound}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Summary({ g }: { g: Group }) {
  const rows: [string, string][] = [
    ["Home pages checked", g.checked.toLocaleString()],
    ["A statement was found", `${g.statementFound} (${g.statementFoundPct}%)`],
    ["A page that looks like a hub, not a statement", `${g.lowConfidencePage}`],
    ["No statement found", `${g.noStatementFound} (${pct(g.noStatementFound, g.checked)})`],
    ["Statements with every mandatory element", `${g.fullyCompliant} (${g.fullyCompliantPctOfFound}% of found)`],
    ["Statements missing some mandatory elements", `${g.verdicts["missing-information"] ?? 0}`],
    ["Statements missing most mandatory elements", `${g.verdicts["not-compliant"] ?? 0}`],
    ["Median score (mandatory elements present)", g.medianPercent === null ? "n/a" : `${g.medianPercent}%`],
  ]
  return (
    <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
      <table className="w-full border-collapse text-sm">
        <caption className="px-4 py-3 text-left text-sm font-semibold text-slate-900 dark:text-white">
          {g.label}, scored against the {g.regime === "uk-psbar" ? "UK public sector regulations" : "European Accessibility Act"}
        </caption>
        <tbody className="text-slate-700 dark:text-slate-300">
          {rows.map(([k, v]) => (
            <tr key={k}>
              <th scope="row" className="border-t border-slate-200 px-4 py-2.5 text-left font-normal dark:border-slate-800">{k}</th>
              <td className="border-t border-slate-200 px-4 py-2.5 text-right font-mono tabular-nums text-slate-900 dark:border-slate-800 dark:text-white">{v}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Sites({ g }: { g: Group }) {
  return (
    <details className="mt-6 rounded-lg border border-slate-200 dark:border-slate-800">
      <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-slate-900 dark:text-white">
        Every statement found in {g.label} ({g.sites.length}), lowest score first
      </summary>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <caption className="sr-only">Per-site statement scores for {g.label}</caption>
          <thead>
            <tr>
              {["Organisation", "Statement", "Mandatory elements", "Score", "Result"].map((h, i) => (
                <th key={h} scope="col" className={`border-y border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 ${i > 1 ? "text-right" : "text-left"}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-slate-700 dark:text-slate-300">
            {g.sites.map((s) => (
              <tr key={s.host + s.name}>
                <th scope="row" className="whitespace-nowrap border-b border-slate-200 px-3 py-1.5 text-left font-normal dark:border-slate-800">{s.name}</th>
                <td className="border-b border-slate-200 px-3 py-1.5 dark:border-slate-800">
                  <a href={s.statementUrl} target="_blank" rel="noopener noreferrer" className="break-all font-mono text-xs text-teal-700 underline decoration-teal-700/40 underline-offset-2 dark:text-teal-300">
                    {s.statementUrl.replace(/^https?:\/\/(www\.)?/, "").slice(0, 60)}
                  </a>
                </td>
                <td className="border-b border-slate-200 px-3 py-1.5 text-right font-mono tabular-nums dark:border-slate-800">{s.mandatoryPassed} / {s.mandatoryTotal}</td>
                <td className={`border-b border-slate-200 px-3 py-1.5 text-right font-mono tabular-nums dark:border-slate-800 ${s.percent < 100 ? "font-semibold text-rose-800 dark:text-rose-300" : "text-emerald-800 dark:text-emerald-300"}`}>{s.percent}%</td>
                <td className="border-b border-slate-200 px-3 py-1.5 text-right dark:border-slate-800">{VERDICT_LABEL[s.verdict] ?? s.verdict}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  )
}

export default function StatementsStudyPage() {
  const c = data.groups.councils as unknown as Group
  const f = data.groups.ftse100 as unknown as Group
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
                <li><Link href="/" className="hover:text-teal-700 dark:hover:text-teal-300">Home</Link></li>
                <li aria-hidden="true">/</li>
                <li><Link href="/research" className="hover:text-teal-700 dark:hover:text-teal-300">Research</Link></li>
                <li aria-hidden="true">/</li>
                <li className="text-slate-900 dark:text-white">Accessibility statements 2026</li>
              </ol>
            </nav>
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">
              Research &middot; Original measurement, September 2026
            </p>
            <h1 className="mt-3 max-w-4xl font-serif text-4xl font-semibold leading-[1.1] tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              State of accessibility statements, 2026
            </h1>
            <p className="mt-6 max-w-[62ch] text-lg leading-8 text-slate-700 dark:text-slate-300">
              The accessibility statement is the one document in this field with mandatory contents
              and a regulator that reads it, and almost nobody measures it. We ran our{" "}
              <Link href="/tools/accessibility-statement-checker" className="font-medium text-teal-700 underline underline-offset-2 dark:text-teal-300">statement checker</Link>{" "}
              over {c.checked} UK local authority home pages and {f.checked} FTSE 100 home pages:
              does a statement exist, and when it does, which of the required elements is missing.
            </p>
            <div className="mt-6">
              <PageByline route={ROUTE} reviewer={{ name: "The Accessibility.build team", href: "/about", credential: "" }} />
            </div>
          </div>
        </header>

        <div className="container-wide">
          <div className="mx-auto max-w-6xl py-12">
            <KeyFacts
              title="Headline results"
              facts={[
                { value: `${c.statementFoundPct}%`, label: `of ${c.checked} UK councils have a findable accessibility statement, six years after it became mandatory`, source: "This study", asOf: data.measuredOn },
                { value: `${c.fullyCompliantPctOfFound}%`, label: "of council statements found carry every mandatory element", source: "This study", asOf: data.measuredOn },
                { value: c.mandatoryFailures[0] ? `${c.mandatoryFailures[0].pctOfFound}%` : "n/a", label: `of council statements omit the most-missed element: ${c.mandatoryFailures[0]?.label ?? ""}`, source: "This study", asOf: data.measuredOn },
                { value: `${f.statementFoundPct}%`, label: `of ${f.checked} FTSE 100 companies have a findable accessibility statement`, source: "This study", asOf: data.measuredOn },
                { value: `${f.fullyCompliantPctOfFound}%`, label: "of FTSE 100 statements found carry every element the EAA asks for", source: "This study", asOf: data.measuredOn },
                { value: "39 of 593", label: "statements GDS found fully compliant in its first monitoring round (7%)", source: "Government Digital Service, 2020 to 2021", sourceHref: "https://accessibility.blog.gov.uk/category/accessibility-monitoring/", asOf: "2022-01-01" },
              ]}
            />

            <section aria-labelledby="method-heading" className="mt-12 max-w-[68ch]">
              <h2 id="method-heading" className="font-serif text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">
                Method
              </h2>
              <div className="mt-4 space-y-4 leading-7 text-slate-700 dark:text-slate-300">
                <p>
                  Two samples, reproducible from Wikidata: UK local authorities with an official
                  website, and FTSE 100 constituents with an official website. On {data.measuredOn}{" "}
                  each home page was passed to our statement checker, which follows footer links and
                  common paths to locate the statement, then tests its text for each mandatory
                  element of the chosen regime. Councils were scored against the Public Sector Bodies
                  Accessibility Regulations 2018; companies against the European Accessibility
                  Act&apos;s information requirements, since no UK law requires a company to publish a
                  statement at all.
                </p>
                <p>
                  A statement counts as found when the checker located it with high or medium
                  confidence. Pages that read like an accessibility hub or help page rather than a
                  statement are reported separately and not scored. The score is the share of
                  mandatory elements present; it measures completeness, not truth.
                </p>
              </div>
            </section>

            <section aria-labelledby="councils-heading" className="mt-12">
              <h2 id="councils-heading" className="font-serif text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">
                UK local authorities
              </h2>
              <p className="mt-3 max-w-[62ch] leading-7 text-slate-600 dark:text-slate-400">
                These bodies have been required to publish a compliant statement since 23 September
                2020 and are monitored by GDS.
              </p>
              <Summary g={c} />
              <Failures g={c} />
              <Sites g={c} />
            </section>

            <section aria-labelledby="ftse-heading" className="mt-12">
              <h2 id="ftse-heading" className="font-serif text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">
                FTSE 100
              </h2>
              <p className="mt-3 max-w-[62ch] leading-7 text-slate-600 dark:text-slate-400">
                No UK law requires these companies to publish a statement. Those that sell in-scope
                services in the EU are subject to the European Accessibility Act&apos;s information
                duties, which is the yardstick used here; a missing statement is therefore an
                observation, not a breach.
              </p>
              <Summary g={f} />
              {f.statementFound > 0 ? <Failures g={f} /> : null}
              {f.sites.length > 0 ? <Sites g={f} /> : null}
            </section>

            <section aria-labelledby="reading-heading" className="mt-12 max-w-[68ch]">
              <h2 id="reading-heading" className="font-serif text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">
                What to take from it
              </h2>
              <div className="mt-4 space-y-4 leading-7 text-slate-700 dark:text-slate-300">
                <p>
                  <strong className="font-semibold text-slate-900 dark:text-white">Existence is mostly solved in the public sector; completeness is not.</strong>{" "}
                  Six years after the deadline, {c.statementFoundPct}% of councils have a findable
                  statement, but only {c.fullyCompliantPctOfFound}% of those carry every element the
                  regulations require. The elements most often missing are the ones that require
                  the organisation to say something specific about itself: which content is not
                  accessible and why, what the statement covers, how it was prepared and when.
                </p>
                <p>
                  <strong className="font-semibold text-slate-900 dark:text-white">The private sector has not started.</strong>{" "}
                  Among the largest listed companies in the country, {f.statementFoundPct}% have a
                  statement our checker can find from the home page. Where the European Accessibility
                  Act applies, that document is now a legal requirement, and where it does not, its
                  absence is the first thing a procurement team or a plaintiff&apos;s lawyer notices.
                </p>
                <p>
                  <strong className="font-semibold text-slate-900 dark:text-white">A statement is evidence, and it cuts both ways.</strong>{" "}
                  Winn-Dixie had no statement when it was sued and was ordered to publish one;
                  Domino&apos;s policy names a standard two revisions old. A complete, dated, honest
                  statement is the cheapest accessibility artefact there is, and the{" "}
                  <Link href="/guides/how-to-write-an-accessibility-statement" className="font-medium text-teal-700 underline underline-offset-2 dark:text-teal-300">guide to writing one</Link>{" "}
                  and the{" "}
                  <Link href="/tools/accessibility-statement-generator" className="font-medium text-teal-700 underline underline-offset-2 dark:text-teal-300">generator</Link>{" "}
                  cover every element this study checks.
                </p>
              </div>
            </section>

            <DatasetDownloads
              dataset="accessibility-statements"
              name="Accessibility statements of UK councils and the FTSE 100, 2026"
              description="Per-organisation results of an automated check of accessibility statements: whether one was found, its URL, the mandatory elements present, and the most commonly missing elements, for UK local authorities and FTSE 100 constituents."
              pageUrl={`https://accessibility.build${ROUTE}`}
              datePublished="2026-09-03"
              dateModified={data.measuredOn}
              temporalCoverage="2026-09"
              attribution="Accessibility.build measurement; samples from Wikidata"
              tables={[
                { key: "councils", label: "UK local authority statements" },
                { key: "ftse100", label: "FTSE 100 statements" },
                { key: "councilFailures", label: "Missing elements, councils" },
                { key: "ftse100Failures", label: "Missing elements, FTSE 100" },
              ]}
            />

            <section aria-labelledby="faq-heading" className="mt-14 max-w-[68ch]">
              <h2 id="faq-heading" className="font-serif text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">Frequently asked questions</h2>
              <dl className="mt-6 space-y-6">
                {FAQS.map((q) => (
                  <div key={q.question}>
                    <dt className="font-semibold text-slate-900 dark:text-white">{q.question}</dt>
                    <dd className="mt-2 leading-7 text-slate-700 dark:text-slate-300">{q.answer}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <div className="mt-14">
              <RelatedContent content="accessibility statement PSBAR EAA compliance UK public sector checker" title="Related reading" maxItems={4} showDescriptions />
            </div>
          </div>
        </div>
      </article>
    </>
  )
}
