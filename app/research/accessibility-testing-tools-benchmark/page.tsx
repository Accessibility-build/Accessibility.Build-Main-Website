import type { Metadata } from "next"
import Link from "next/link"
import { BreadcrumbStructuredData } from "@/components/seo/structured-data"
import { FaqSection } from "@/components/seo/faq-section"
import { FileCode2, FileJson } from "lucide-react"
import { GuideArticleSchema } from "@/components/seo/guide-article-schema"
import { PageByline } from "@/components/seo/page-byline"
import { RelatedContent } from "@/components/seo/related-content"
import { clampDescription } from "@/lib/metadata"

// Four automated checkers, one page, thirty defects we planted ourselves.
//
// Every "best accessibility testing tools" article compares feature lists.
// None of them runs the tools against a page where the answer is known. This
// one does. The fixture is published so the numbers can be reproduced, and the
// result table records not just whether each tool flagged a defect but
// whether it flagged it for the right reason.

const ROUTE = "/research/accessibility-testing-tools-benchmark"
const pageTitle = "Accessibility Testing Tools Benchmark 2026"
const pageDescription =
  "axe-core, Lighthouse, HTML_CodeSniffer (via Pa11y) and IBM Equal Access run against one page seeded with thirty known WCAG defects. Per-defect results, what none of them found, and why a Lighthouse score of 46 is not a measure of anything. Re-run October 2026 on current versions."

export const metadata: Metadata = {
  title: pageTitle,
  description: clampDescription(pageDescription),
  keywords: [
    "accessibility testing tools comparison",
    "axe vs lighthouse",
    "axe vs pa11y",
    "IBM Equal Access vs axe",
    "automated accessibility testing coverage",
    "how many WCAG issues do automated tools find",
    "accessibility tool benchmark",
    "lighthouse accessibility score meaning",
    "HTML_CodeSniffer",
    "best free accessibility checker",
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
        url: `/api/og?title=${encodeURIComponent("Accessibility Testing Tools Benchmark 2026")}&section=Research`,
        width: 1200,
        height: 630,
        alt: "Accessibility testing tools benchmark 2026",
      },
    ],
  },
}

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Research", url: "https://accessibility.build/research" },
  { name: "Testing tools benchmark", url: `https://accessibility.build${ROUTE}` },
]

type Result = "yes" | "no" | "review" | "wrong"

interface Defect {
  id: string
  defect: string
  criterion: string
  axe: Result
  lighthouse: Result
  htmlcs: Result
  ibm: Result
  note?: string
}

const DEFECTS: Defect[] = [
  { id: "F01", defect: "No lang attribute on the html element", criterion: "3.1.1", axe: "yes", lighthouse: "yes", htmlcs: "yes", ibm: "yes" },
  { id: "F02", defect: "Image with no alt attribute", criterion: "1.1.1", axe: "yes", lighthouse: "yes", htmlcs: "yes", ibm: "yes" },
  { id: "F03", defect: "First heading is an h3 (skipped levels)", criterion: "1.3.1, 2.4.6", axe: "no", lighthouse: "no", htmlcs: "no", ibm: "no", note: "axe has a heading-order rule tagged best-practice; it did not fire here." },
  { id: "F04", defect: "Grey text on white at 2.85:1", criterion: "1.4.3", axe: "yes", lighthouse: "yes", htmlcs: "yes", ibm: "yes" },
  { id: "F05", defect: "Small grey text at 4.48:1", criterion: "1.4.3", axe: "yes", lighthouse: "yes", htmlcs: "no", ibm: "yes", note: "HTML_CodeSniffer flagged only the first contrast failure." },
  { id: "F06", defect: "Link text 'click here'", criterion: "2.4.4", axe: "no", lighthouse: "no", htmlcs: "no", ibm: "no", note: "A name exists; whether it is a useful name is a judgement no tool makes." },
  { id: "F07", defect: "Link whose only content is an image with empty alt", criterion: "2.4.4, 4.1.2", axe: "yes", lighthouse: "yes", htmlcs: "yes", ibm: "yes" },
  { id: "F08", defect: "Button with no content", criterion: "4.1.2", axe: "yes", lighthouse: "yes", htmlcs: "yes", ibm: "yes" },
  { id: "F09", defect: "div with onclick, no role, no tabindex", criterion: "2.1.1, 4.1.2", axe: "no", lighthouse: "no", htmlcs: "no", ibm: "yes", note: "IBM's aria_eventhandler_role_valid is the only rule that looks for click handlers on non-controls." },
  { id: "F10", defect: "Text input with no label", criterion: "1.3.1, 3.3.2", axe: "yes", lighthouse: "yes", htmlcs: "yes", ibm: "yes" },
  { id: "F11", defect: "Select with no label", criterion: "1.3.1, 3.3.2", axe: "yes", lighthouse: "yes", htmlcs: "yes", ibm: "yes" },
  { id: "F12", defect: "Label whose for attribute points at nothing", criterion: "1.3.1", axe: "no", lighthouse: "no", htmlcs: "no", ibm: "yes" },
  { id: "F13", defect: "Checkbox with no label", criterion: "1.3.1, 3.3.2", axe: "yes", lighthouse: "yes", htmlcs: "yes", ibm: "yes" },
  { id: "F14", defect: "Submit input with an empty value", criterion: "4.1.2", axe: "yes", lighthouse: "yes", htmlcs: "yes", ibm: "no" },
  { id: "F15", defect: "Table used for data with no header cells (layout markup)", criterion: "1.3.1", axe: "no", lighthouse: "no", htmlcs: "no", ibm: "yes" },
  { id: "F16", defect: "Captioned data table with no header cells", criterion: "1.3.1", axe: "no", lighthouse: "no", htmlcs: "wrong", ibm: "yes", note: "HTML_CodeSniffer flagged this table as a layout table that should not have a caption, which is the opposite of the defect." },
  { id: "F17", defect: "role=button with no tabindex", criterion: "2.1.1", axe: "no", lighthouse: "no", htmlcs: "no", ibm: "review", note: "IBM raised it as a potential violation (widget_tabbable_exists)." },
  { id: "F18", defect: "role=checkbox with no aria-checked", criterion: "4.1.2", axe: "yes", lighthouse: "yes", htmlcs: "no", ibm: "yes" },
  { id: "F19", defect: "aria-labelledby pointing at a missing id", criterion: "4.1.2", axe: "review", lighthouse: "no", htmlcs: "no", ibm: "yes", note: "axe reported it under 'incomplete', which most CI setups ignore." },
  { id: "F20", defect: "Invalid role value (role=banana)", criterion: "4.1.2", axe: "yes", lighthouse: "yes", htmlcs: "no", ibm: "yes" },
  { id: "F21", defect: "iframe with no title", criterion: "4.1.2", axe: "yes", lighthouse: "yes", htmlcs: "yes", ibm: "yes" },
  { id: "F22", defect: "Focus outline removed in CSS", criterion: "2.4.7", axe: "no", lighthouse: "no", htmlcs: "no", ibm: "no", note: "Needs the element to be focused and its rendered style compared; no static checker does this." },
  { id: "F23", defect: "Duplicate id attribute", criterion: "4.1.1 (removed in 2.2)", axe: "no", lighthouse: "no", htmlcs: "yes", ibm: "no", note: "axe 4 dropped its duplicate-id rules; only ids referenced by ARIA are checked now." },
  { id: "F24", defect: "marquee element (moving text)", criterion: "2.2.2", axe: "yes", lighthouse: "no", htmlcs: "no", ibm: "yes" },
  { id: "F25", defect: "Two 'Read more' links to different targets", criterion: "2.4.4", axe: "no", lighthouse: "no", htmlcs: "no", ibm: "no" },
  { id: "F26", defect: "Alt text that is the file name", criterion: "1.1.1", axe: "no", lighthouse: "no", htmlcs: "no", ibm: "review", note: "IBM's img_alt_misuse raised it for review." },
  { id: "F27", defect: "Image input with no alt", criterion: "1.1.1, 4.1.2", axe: "yes", lighthouse: "yes", htmlcs: "yes", ibm: "yes" },
  { id: "F28", defect: "Positive tabindex", criterion: "2.4.3", axe: "yes", lighthouse: "yes", htmlcs: "no", ibm: "no" },
  { id: "F29", defect: "Autoplaying video with no captions track", criterion: "1.2.2, 1.4.2", axe: "review", lighthouse: "no", htmlcs: "no", ibm: "review" },
  { id: "F30", defect: "h1 placed after all the content", criterion: "2.4.6", axe: "no", lighthouse: "no", htmlcs: "no", ibm: "no" },
]

const TOOLS: { key: keyof Pick<Defect, "axe" | "lighthouse" | "htmlcs" | "ibm">; name: string; version: string; note: string }[] = [
  { key: "axe", name: "axe-core", version: "4.14.0 via @axe-core/puppeteer", note: "Also reported 26 'region' and 2 'landmark-one-main' best-practice findings that are not WCAG failures." },
  { key: "lighthouse", name: "Lighthouse", version: "13.5.0 (axe-core 4.14.0), accessibility category only", note: "Runs a subset of axe rules. Scored the page 46 out of 100; Lighthouse 12.8.2 scored the same page 49 while finding the same fifteen defects." },
  { key: "htmlcs", name: "HTML_CodeSniffer", version: "via Pa11y 10.0.0, WCAG2AA standard", note: "Reported 17 messages; one was a misclassification of a data table." },
  { key: "ibm", name: "IBM Equal Access", version: "accessibility-checker 4.0.34, WCAG_2_2 policy", note: "20 violations plus 10 potential violations flagged for review." },
]

const RESULT_LABEL: Record<Result, { text: string; cls: string; glyph: string }> = {
  yes: { text: "Found", cls: "bg-emerald-50 text-emerald-900 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-200 dark:ring-emerald-900", glyph: "Yes" },
  no: { text: "Missed", cls: "bg-rose-50 text-rose-900 ring-rose-200 dark:bg-rose-950/40 dark:text-rose-200 dark:ring-rose-900", glyph: "No" },
  review: { text: "Flagged for review only", cls: "bg-amber-50 text-amber-900 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-200 dark:ring-amber-900", glyph: "Review" },
  wrong: { text: "Flagged, wrong reason", cls: "bg-amber-50 text-amber-900 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-200 dark:ring-amber-900", glyph: "Wrong" },
}

function count(key: (typeof TOOLS)[number]["key"], r: Result) {
  return DEFECTS.filter((d) => d[key] === r).length
}

const FAQS = [
  {
    question: "Which automated accessibility tool finds the most issues?",
    answer:
      "On a page with thirty seeded WCAG defects, IBM Equal Access found 19 outright and flagged 3 more for review; axe-core found 16 and flagged 2; Lighthouse found 15; HTML_CodeSniffer found 12. A re-run on 14 October 2026 with axe-core 4.14.0, Lighthouse 13.5.0 and accessibility-checker 4.0.34 produced identical per-defect results. Ten defects were found by all four, and five were found by none. Coverage is not the only measure: axe produced 28 best-practice findings that are not WCAG failures, and HTML_CodeSniffer misclassified a data table.",
  },
  {
    question: "What percentage of WCAG issues can automated tools detect?",
    answer:
      "On this fixture, between 40% and 63% of the seeded defects, depending on the tool, and 17% were undetectable by any of them. The undetected ones are the judgement calls: whether link text is meaningful, whether the heading order makes sense, whether focus is visible. Published estimates that automation finds 30% to 57% of issues are consistent with this.",
  },
  {
    question: "Is a Lighthouse accessibility score of 100 the same as WCAG conformance?",
    answer:
      "No. Lighthouse runs a subset of axe-core's rules and scores them by weight. This fixture scored 46 with fifteen detected failures (49 under the previous Lighthouse version, with the same fifteen found); a page could score 100 and still fail every judgement-based criterion. WebAIM's 2026 evaluation found a median Lighthouse score of 85 across the top million home pages, of which 95.9% had detectable failures.",
  },
  {
    question: "Should I run more than one tool?",
    answer:
      "Yes, if the cost is low, because the tools disagree at the edges: only IBM caught the div with a click handler, the orphaned label and the missing table headers; only HTML_CodeSniffer caught the duplicate id; only axe and Lighthouse caught the positive tabindex. But no combination of the four found the five judgement defects, so the second tool you need is a person with a keyboard and a screen reader.",
  },
]

// Result encoding for the visual summaries. Each result has its own shape as
// well as its own colour (solid, half, striped, hollow), so colour is never
// the only cue; every visual is aria-hidden next to a text or table equivalent.
const BENCH_VARS = `
.bench{--b-found:#14996a;--b-review:#b45309;--b-wrong:#eb6834;--b-miss:#64748b;--b-surface:#ffffff}
.dark .bench{--b-found:#199e70;--b-review:#d97706;--b-wrong:#d95926;--b-miss:#94a3b8;--b-surface:#0f172a}
@media (forced-colors: active){.bench-mark,.bench-mark *{forced-color-adjust:none}}
`

const MARK_STYLE: Record<Result, React.CSSProperties> = {
  yes: { background: "var(--b-found)" },
  review: { background: "linear-gradient(to top, var(--b-review) 50%, transparent 50%)", boxShadow: "inset 0 0 0 1.5px var(--b-review)" },
  wrong: { background: "repeating-linear-gradient(45deg, var(--b-wrong) 0 2px, transparent 2px 4px)", boxShadow: "inset 0 0 0 1.5px var(--b-wrong)" },
  no: { background: "transparent", boxShadow: "inset 0 0 0 1.5px var(--b-miss)" },
}

const LEGEND: { r: Result; label: string }[] = [
  { r: "yes", label: "Found" },
  { r: "review", label: "Review only" },
  { r: "wrong", label: "Wrong reason" },
  { r: "no", label: "Missed" },
]

function Mark({ r, className = "h-3.5 w-3.5" }: { r: Result; className?: string }) {
  return <span aria-hidden="true" className={`bench-mark inline-block shrink-0 rounded-[3px] ${className}`} style={MARK_STYLE[r]} />
}

const linkCls = "font-medium text-teal-700 underline underline-offset-2 dark:text-teal-300"
const card = "min-w-0 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900/60 sm:p-8"

function SectionHead({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: React.ReactNode; children?: React.ReactNode }) {
  return (
    <div className="max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-teal-700 dark:text-teal-300">{eyebrow}</p>
      <h2 id={id} className="mt-2 font-serif text-3xl font-semibold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-4xl">
        {title}
      </h2>
      {children ? <div className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300">{children}</div> : null}
    </div>
  )
}

const FINDINGS: { title: string; body: React.ReactNode }[] = [
  {
    title: "The core is shared.",
    body: (
      <>
        Ten defects were found by all four tools, and they are the ones that matter most in litigation: missing
        alt text, unlabelled fields, empty buttons and links, untitled frames, low contrast, no page language. These
        are the failures that appeared in the complaints in{" "}
        <Link href="/cases/robles-v-dominos" className={linkCls}>Domino&apos;s</Link>,{" "}
        <Link href="/cases/gil-v-winn-dixie" className={linkCls}>Winn-Dixie</Link> and{" "}
        <Link href="/cases/nfb-v-target" className={linkCls}>Target</Link>, and any of the four would have caught them.
      </>
    ),
  },
  {
    title: "The edges differ, and IBM covers more of them.",
    body: (
      <>
        Only IBM Equal Access caught the div with a click handler and no role, the label pointing at nothing, and the
        two tables with no header cells. Only HTML_CodeSniffer caught the duplicate id, a check axe dropped in version
        4. Only axe and Lighthouse caught the positive tabindex. Running two engines is cheap and finds more than either
        alone; IBM plus axe covered 21 of the 30 outright.
      </>
    ),
  },
  {
    title: "Review categories hide real failures.",
    body: (
      <>
        axe put the broken aria-labelledby reference and the uncaptioned video in its incomplete list; IBM put the
        untabbable widget, the filename alt text and the video in potential violations. A build that fails only on
        violations never sees these. Read the review lists.
      </>
    ),
  },
  {
    title: "Five defects are invisible to automation, and they are common.",
    body: (
      <>
        Meaningless link text, repeated link text with different targets, a skipped heading level, a page title
        placed after the content, and a focus outline removed in CSS were missed by every tool. Screen reader users
        rank nonsensical links and buttons third among their most serious problems, and GDS found lack of visible
        focus among the top issues in UK public sector monitoring. A clean automated run says nothing about them.
      </>
    ),
  },
  {
    title: "A score is not a measurement.",
    body: (
      <>
        Lighthouse gave this page 49 in September and 46 in October. It found the same fifteen of thirty defects both
        times; the number moved with the tool version, not with the page. WebAIM&apos;s 2026 evaluation found a median
        Lighthouse score of 85 across the top million home pages, 95.9% of which had detectable failures. Use it to
        spot regressions, not to make a claim.
      </>
    ),
  },
  {
    title: "Noise is a cost.",
    body: (
      <>
        axe reported twenty-eight best-practice findings on a page with no landmarks, all correct and none a WCAG
        failure. HTML_CodeSniffer reported a captioned data table as a layout table with a caption. Both are the kind
        of result that trains developers to ignore the report.
      </>
    ),
  },
]

const TOOL_KEYS = ["axe", "lighthouse", "htmlcs", "ibm"] as const

export default function ToolsBenchmarkPage() {
  const foundByAll = DEFECTS.filter((d) => [d.axe, d.lighthouse, d.htmlcs, d.ibm].every((r) => r === "yes")).length
  const noneDefects = DEFECTS.filter((d) => [d.axe, d.lighthouse, d.htmlcs, d.ibm].every((r) => r === "no"))
  const foundByNone = noneDefects.length
  const ranked = [...TOOLS].sort((x, y) => count(y.key, "yes") - count(x.key, "yes"))
  const shortName: Record<string, string> = { axe: "axe-core", lighthouse: "Lighthouse", htmlcs: "HTML_CS", ibm: "IBM" }
  return (
    <>
      <style>{BENCH_VARS}</style>
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />
      <GuideArticleSchema
        route={ROUTE}
        title={pageTitle}
        description={pageDescription}
        datePublished="2026-09-03"
        section="Research"
        author={{ name: "The Accessibility.build team", url: "https://accessibility.build/about", type: "Organization" }}
      />

      <article className="bench bg-white pb-24 dark:bg-slate-950">
        {/* Hero */}
        <header className="border-b border-slate-200 bg-slate-50 pt-12 dark:border-slate-800 dark:bg-slate-900/40">
          <div className="container-wide grid items-center gap-12 py-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:py-14">
            <div>
              <nav aria-label="Breadcrumb" className="mb-6">
                <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <li><Link href="/" className="hover:text-teal-700 dark:hover:text-teal-300">Home</Link></li>
                  <li aria-hidden="true">/</li>
                  <li><Link href="/research" className="hover:text-teal-700 dark:hover:text-teal-300">Research</Link></li>
                  <li aria-hidden="true">/</li>
                  <li className="text-slate-900 dark:text-white" aria-current="page">Testing tools benchmark</li>
                </ol>
              </nav>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-teal-700 dark:text-teal-300">
                Research &middot; Original test, September 2026 &middot; Re-run 14 October 2026
              </p>
              <h1 className="mt-3 font-serif text-4xl font-semibold leading-[1.05] tracking-tight text-slate-900 dark:text-white sm:text-5xl">
                Four accessibility checkers, one page, thirty known defects
              </h1>
              <p className="mt-6 max-w-[58ch] text-lg leading-8 text-slate-700 dark:text-slate-300">
                We wrote a page with thirty WCAG failures we could name, then ran axe-core, Lighthouse,
                HTML_CodeSniffer and IBM Equal Access against it. This is what each tool found, what it missed, what
                it flagged for the wrong reason, and the five defects that no automated checker can find. The fixture
                is published so you can repeat it.
              </p>
              <div className="mt-8">
                <PageByline route={ROUTE} reviewer={{ name: "The Accessibility.build team", href: "/about", credential: "" }} />
              </div>
            </div>

            <figure className={`${card} mx-auto w-full max-w-xl lg:mx-0 lg:justify-self-end`}>
              <figcaption className="text-sm font-semibold text-slate-900 dark:text-white">
                Every result at a glance
                <span className="mt-1 block text-sm font-normal text-slate-600 dark:text-slate-400">
                  One square per seeded defect (F01 to F30), one row per tool. The full table is further down.
                </span>
                <span className="sr-only">
                  {TOOLS.map((t) => `${t.name}: ${count(t.key, "yes")} found, ${count(t.key, "review")} review only, ${count(t.key, "wrong")} wrong reason, ${count(t.key, "no")} missed.`).join(" ")}
                </span>
              </figcaption>
              <div aria-hidden="true" className="mt-6 space-y-3">
                {TOOL_KEYS.map((k) => (
                  <div key={k} className="grid grid-cols-[5.5rem_1fr] items-center gap-3">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{shortName[k]}</span>
                    <span className="grid grid-cols-[repeat(30,minmax(0,1fr))] gap-[3px]">
                      {DEFECTS.map((d) => (
                        <Mark key={d.id} r={d[k]} className="aspect-square w-full" />
                      ))}
                    </span>
                  </div>
                ))}
              </div>
              <ul aria-hidden="true" className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-600 dark:text-slate-300">
                {LEGEND.map((l) => (
                  <li key={l.r} className="flex items-center gap-1.5"><Mark r={l.r} className="h-3 w-3" />{l.label}</li>
                ))}
              </ul>
            </figure>
          </div>
        </header>

        <div className="container-wide">
          {/* Scoreboard */}
          <section aria-labelledby="results-heading" className="pt-16">
            <SectionHead id="results-heading" eyebrow="Headline results" title="Defects found outright, out of 30" />
            <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {ranked.map((t) => {
                const parts = LEGEND.map((l) => ({ ...l, n: count(t.key, l.r) }))
                return (
                  <li key={t.key} className={card}>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{t.name}</h3>
                    <p className="mt-3 font-mono text-4xl font-semibold tabular-nums text-slate-900 dark:text-white">
                      {count(t.key, "yes")}
                      <span className="text-lg text-slate-500 dark:text-slate-400"> of 30</span>
                    </p>
                    <div aria-hidden="true" className="bench-mark mt-4 flex h-3 gap-[2px] overflow-hidden rounded-full">
                      {parts.filter((p) => p.n > 0).map((p) => (
                        <span key={p.r} style={{ width: `${(100 * p.n) / 30}%`, ...MARK_STYLE[p.r] }} />
                      ))}
                    </div>
                    <dl className="mt-4 grid gap-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                      {parts.map((p) => (
                        <div key={p.r} className="flex items-center gap-1.5">
                          <Mark r={p.r} className="h-2.5 w-2.5" />
                          <dt>{p.label}</dt>
                          <dd className="ml-auto font-mono font-semibold tabular-nums text-slate-900 dark:text-white">{p.n}</dd>
                        </div>
                      ))}
                    </dl>
                  </li>
                )
              })}
            </ul>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div className={`${card} flex items-center gap-5`}>
                <p className="font-mono text-4xl font-semibold tabular-nums text-slate-900 dark:text-white">{foundByAll}</p>
                <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                  <strong className="font-semibold text-slate-900 dark:text-white">found by all four tools:</strong> missing alt text, unlabelled fields, empty buttons and links, untitled frames, low contrast, no page language.
                </p>
              </div>
              <div className={`${card} flex items-center gap-5`}>
                <p className="font-mono text-4xl font-semibold tabular-nums text-slate-900 dark:text-white">{foundByNone}</p>
                <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                  <strong className="font-semibold text-slate-900 dark:text-white">found by none of them.</strong> They are listed below, and every one needs a person to find.
                </p>
              </div>
            </div>
          </section>

          {/* Method */}
          <section aria-labelledby="method-heading" className="grid gap-10 pt-20 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
            <div>
              <SectionHead id="method-heading" eyebrow="Method" title="How the benchmark was run" />
              <div className="mt-6 space-y-4 leading-7 text-slate-700 dark:text-slate-300">
                <p>
                  The fixture is a single HTML page containing thirty deliberate defects, each mapped to a WCAG 2.2
                  success criterion, chosen to span the common failure classes (text alternatives, names and labels,
                  contrast, structure, ARIA, keyboard, timing and media) and to include several that require judgement
                  rather than pattern matching. It was served over HTTP from localhost and each tool was first run on 2
                  September 2026 in headless Chrome 143 with default settings and the WCAG 2.2 AA policy where a tool
                  offers one. On 14 October 2026 we re-ran all four on their current releases (axe-core 4.14.0,
                  Lighthouse 13.5.0, Pa11y 10.0.0 and accessibility-checker 4.0.34) in headless Chrome 155. Every
                  per-defect result was the same; only the Lighthouse score moved, from 49 to 46. Lighthouse 13.6.0,
                  released on 27 October 2026 after this run, bundles the same axe-core 4.14.0 and its release notes
                  list no accessibility audit changes, so these results are expected to hold.
                </p>
                <p>
                  A defect counts as found when the tool reports a violation on the right element for the right reason.
                  A report that only appears in a needs-review or potential category is recorded separately, because
                  most continuous-integration setups fail a build on violations and never surface the rest. A report on
                  the right element for the wrong reason is recorded as wrong.
                </p>
              </div>
            </div>
            <div className="space-y-4 lg:pt-12">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Run it yourself</p>
              <a href="/benchmarks/tool-benchmark-fixture-2026-09.html" className="group block rounded-2xl border border-slate-200 p-5 hover:border-teal-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-800 dark:hover:border-teal-400">
                <span className="flex items-center justify-between gap-3 font-semibold text-slate-900 underline decoration-slate-300 underline-offset-4 group-hover:decoration-teal-600 dark:text-white dark:decoration-slate-600">
                  Fixture page <FileCode2 aria-hidden="true" className="h-5 w-5 text-slate-500" />
                </span>
                <span className="mt-1 block text-sm leading-6 text-slate-600 dark:text-slate-400">The HTML page with all thirty defects. It is marked noindex; each defect is labelled in a comment.</span>
              </a>
              <a href="/benchmarks/tool-benchmark-results-2026-10.json" className="group block rounded-2xl border border-slate-200 p-5 hover:border-teal-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-800 dark:hover:border-teal-400">
                <span className="flex items-center justify-between gap-3 font-semibold text-slate-900 underline decoration-slate-300 underline-offset-4 group-hover:decoration-teal-600 dark:text-white dark:decoration-slate-600">
                  Raw output of the October run <FileJson aria-hidden="true" className="h-5 w-5 text-slate-500" />
                </span>
                <span className="mt-1 block text-sm leading-6 text-slate-600 dark:text-slate-400">Every violation, incomplete and potential finding from each tool, as JSON.</span>
              </a>
            </div>
          </section>

          {/* Tools */}
          <section aria-labelledby="tools-heading" className="pt-20">
            <SectionHead id="tools-heading" eyebrow="The tools" title="Versions and totals" />
            <div tabIndex={0} role="region" aria-label="Tools tested, versions, and totals found, missed and flagged for review" className={`${card} relative mt-10 overflow-x-auto !p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500`}>
              <table className="w-full border-collapse text-sm">
                <caption className="sr-only">Tools tested, versions, and totals found, missed and flagged for review</caption>
                <thead>
                  <tr>
                    {["Tool", "Version", "Found", "Review only", "Wrong reason", "Missed", "Note"].map((h, i) => (
                      <th key={h} scope="col" className={`border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 ${i >= 2 && i <= 5 ? "text-right" : "text-left"}`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-slate-700 dark:text-slate-300">
                  {TOOLS.map((t) => (
                    <tr key={t.key} className="align-top">
                      <th scope="row" className="whitespace-nowrap border-b border-slate-100 px-4 py-3 text-left font-semibold text-slate-900 dark:border-slate-800 dark:text-white">{t.name}</th>
                      <td className="min-w-[12rem] border-b border-slate-100 px-4 py-3 font-mono text-xs leading-5 dark:border-slate-800">{t.version}</td>
                      {(["yes", "review", "wrong", "no"] as const).map((r) => (
                        <td key={r} className="border-b border-slate-100 px-4 py-3 text-right font-mono tabular-nums dark:border-slate-800">
                          <span className="inline-flex items-center gap-1.5"><Mark r={r} className="h-2.5 w-2.5" />{count(t.key, r)}</span>
                        </td>
                      ))}
                      <td className="min-w-[18rem] border-b border-slate-100 px-4 py-3 leading-6 dark:border-slate-800">{t.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Missed by all */}
          <section aria-labelledby="none-heading" className="pt-20">
            <SectionHead id="none-heading" eyebrow="The blind spot" title={`${foundByNone} defects no tool found`}>
              <p>These need a person: a keyboard, a screen reader, and judgement about whether a name or an order makes sense.</p>
            </SectionHead>
            <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {noneDefects.map((d) => (
                <li key={d.id} className="flex min-w-0 flex-col rounded-2xl border border-dashed border-slate-300 p-5 dark:border-slate-700">
                  <p className="font-mono text-xs font-semibold text-slate-600 dark:text-slate-400">{d.id} &middot; WCAG {d.criterion}</p>
                  <p className="mt-2 font-semibold leading-snug text-slate-900 dark:text-white">{d.defect}</p>
                  {d.note ? <p className="mt-2 text-xs leading-5 text-slate-600 dark:text-slate-400">{d.note}</p> : null}
                </li>
              ))}
            </ul>
          </section>

          {/* Matrix */}
          <section aria-labelledby="matrix-heading" className="pt-20">
            <SectionHead id="matrix-heading" eyebrow="Defect by defect" title="Every seeded defect, every tool">
              <p>
                Each result is a word, not a colour: Found, Missed, Review (reported only as needing human review) or
                Wrong (reported on the right element for the wrong reason).
              </p>
            </SectionHead>
            <div tabIndex={0} role="region" aria-label="Thirty seeded defects with the criterion each fails and the result from each of the four tools" className={`${card} relative mt-10 overflow-x-auto !p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500`}>
              <table className="w-full border-collapse text-sm">
                <caption className="sr-only">Thirty seeded defects with the criterion each fails and the result from each of the four tools</caption>
                <thead>
                  <tr>
                    {["ID", "Seeded defect", "Criterion", "axe-core", "Lighthouse", "HTML_CS", "IBM"].map((h) => (
                      <th key={h} scope="col" className="border-b border-slate-200 bg-slate-50 px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-slate-700 dark:text-slate-300">
                  {DEFECTS.map((d) => (
                    <tr key={d.id} className="align-top even:bg-slate-50/60 dark:even:bg-slate-900/40">
                      <th scope="row" className="border-b border-slate-100 px-3 py-2.5 text-left font-mono text-xs text-slate-600 dark:border-slate-800 dark:text-slate-400">{d.id}</th>
                      <td className="min-w-[16rem] border-b border-slate-100 px-3 py-2.5 leading-6 dark:border-slate-800">
                        {d.defect}
                        {d.note ? <span className="mt-0.5 block text-xs leading-5 text-slate-600 dark:text-slate-400">{d.note}</span> : null}
                      </td>
                      <td className="whitespace-nowrap border-b border-slate-100 px-3 py-2.5 font-mono text-xs dark:border-slate-800">{d.criterion}</td>
                      {TOOL_KEYS.map((k) => {
                        const r = RESULT_LABEL[d[k]]
                        return (
                          <td key={k} className="border-b border-slate-100 px-3 py-2.5 dark:border-slate-800">
                            <span className={`inline-flex items-center gap-1.5 rounded-sm px-2 py-0.5 text-xs font-semibold ring-1 ${r.cls}`}>
                              <Mark r={d[k]} className="h-2.5 w-2.5" />
                              {r.glyph}
                              <span className="sr-only">: {r.text}</span>
                            </span>
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Findings */}
          <section aria-labelledby="findings-heading" className="pt-20">
            <SectionHead id="findings-heading" eyebrow="Analysis" title="What the results mean" />
            <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {FINDINGS.map((f) => (
                <li key={f.title} className={card}>
                  <h3 className="text-lg font-semibold leading-snug text-slate-900 dark:text-white">{f.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{f.body}</p>
                </li>
              ))}
            </ul>
            <p className="mt-8 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
              Versions and dates are in the tools table. Results apply to this fixture and these versions; every tool
              updates its rules, and the benchmark will be rerun when they do. For choosing between tools day to day,
              see <Link href="/guides/axe-vs-wave" className={linkCls}>axe vs WAVE</Link> and{" "}
              <Link href="/guides/automated-vs-manual-accessibility-testing" className={linkCls}>automated vs manual testing</Link>.
              WAVE is not in this benchmark because its engine is not available to run locally.
            </p>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
              <strong className="font-semibold text-slate-900 dark:text-white">Correction, 16 November 2026:</strong> earlier
              versions of this page said twelve defects were found by all four tools and that IBM plus axe covered 22. The
              per-defect results, which have not changed, give ten and 21.
            </p>
          </section>

          <div className="mt-20 max-w-3xl">
            <FaqSection faqs={FAQS} />
          </div>

          <div className="mt-16">
            <RelatedContent content="automated accessibility testing axe lighthouse pa11y WAVE tools comparison" title="Related reading" maxItems={4} showDescriptions />
          </div>
        </div>
      </article>
    </>
  )
}
