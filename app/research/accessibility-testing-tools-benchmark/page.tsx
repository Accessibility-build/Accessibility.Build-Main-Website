import type { Metadata } from "next"
import Link from "next/link"
import { BreadcrumbStructuredData, FAQStructuredData } from "@/components/seo/structured-data"
import { GuideArticleSchema } from "@/components/seo/guide-article-schema"
import { PageByline } from "@/components/seo/page-byline"
import { RelatedContent } from "@/components/seo/related-content"
import { KeyFacts } from "@/components/research/key-facts"
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
  "axe-core, Lighthouse, HTML_CodeSniffer (via Pa11y) and IBM Equal Access run against one page seeded with thirty known WCAG defects. Per-defect results, what none of them found, and why a Lighthouse score of 49 is not a measure of anything."

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
  { key: "axe", name: "axe-core", version: "4.13.0 via @axe-core/puppeteer", note: "Also reported 26 'region' and 2 'landmark-one-main' best-practice findings that are not WCAG failures." },
  { key: "lighthouse", name: "Lighthouse", version: "12.8.2, accessibility category only", note: "Runs a subset of axe rules. Scored the page 49 out of 100." },
  { key: "htmlcs", name: "HTML_CodeSniffer", version: "via Pa11y 10.0.0, WCAG2AA standard", note: "Reported 17 messages; one was a misclassification of a data table." },
  { key: "ibm", name: "IBM Equal Access", version: "accessibility-checker 4.0.31, WCAG_2_2 policy", note: "20 violations plus 10 potential violations flagged for review." },
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
      "On a page with thirty seeded WCAG defects, IBM Equal Access found 19 outright and flagged 3 more for review; axe-core found 16 and flagged 2; Lighthouse found 15; HTML_CodeSniffer found 12. Twelve defects were found by all four, and five were found by none. Coverage is not the only measure: axe produced 28 best-practice findings that are not WCAG failures, and HTML_CodeSniffer misclassified a data table.",
  },
  {
    question: "What percentage of WCAG issues can automated tools detect?",
    answer:
      "On this fixture, between 40% and 63% of the seeded defects, depending on the tool, and 17% were undetectable by any of them. The undetected ones are the judgement calls: whether link text is meaningful, whether the heading order makes sense, whether focus is visible. Published estimates that automation finds 30% to 57% of issues are consistent with this.",
  },
  {
    question: "Is a Lighthouse accessibility score of 100 the same as WCAG conformance?",
    answer:
      "No. Lighthouse runs a subset of axe-core's rules and scores them by weight. This fixture scored 49 with fifteen detected failures; a page could score 100 and still fail every judgement-based criterion. WebAIM's 2026 evaluation found a median Lighthouse score of 85 across the top million home pages, of which 95.9% had detectable failures.",
  },
  {
    question: "Should I run more than one tool?",
    answer:
      "Yes, if the cost is low, because the tools disagree at the edges: only IBM caught the div with a click handler, the orphaned label and the missing table headers; only HTML_CodeSniffer caught the duplicate id; only axe and Lighthouse caught the positive tabindex. But no combination of the four found the five judgement defects, so the second tool you need is a person with a keyboard and a screen reader.",
  },
]

export default function ToolsBenchmarkPage() {
  const foundByAll = DEFECTS.filter((d) => [d.axe, d.lighthouse, d.htmlcs, d.ibm].every((r) => r === "yes")).length
  const foundByNone = DEFECTS.filter((d) => [d.axe, d.lighthouse, d.htmlcs, d.ibm].every((r) => r === "no")).length
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
                <li className="text-slate-900 dark:text-white">Testing tools benchmark</li>
              </ol>
            </nav>
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">
              Research &middot; Original test, September 2026
            </p>
            <h1 className="mt-3 max-w-4xl font-serif text-4xl font-semibold leading-[1.1] tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              Four accessibility checkers, one page, thirty known defects
            </h1>
            <p className="mt-6 max-w-[62ch] text-lg leading-8 text-slate-700 dark:text-slate-300">
              We wrote a page with thirty WCAG failures we could name, then ran axe-core,
              Lighthouse, HTML_CodeSniffer and IBM Equal Access against it. This is what each tool
              found, what it missed, what it flagged for the wrong reason, and the five defects that
              no automated checker can find. The fixture is published so you can repeat it.
            </p>
            <div className="mt-6">
              <PageByline route={ROUTE} reviewer={{ name: "The Accessibility.build team", href: "/about", credential: "" }} />
            </div>
          </div>
        </header>

        <div className="container-wide">
          <div className="mx-auto max-w-5xl py-12">
            <KeyFacts
              title="Headline results"
              facts={[
                { value: "19 of 30", label: "defects found outright by IBM Equal Access, the most of the four", source: "This benchmark", asOf: "2026-09-02" },
                { value: "16 of 30", label: "found by axe-core, with 2 more flagged for review", source: "This benchmark", asOf: "2026-09-02" },
                { value: "15 of 30", label: "found by Lighthouse, which scored the page 49 out of 100", source: "This benchmark", asOf: "2026-09-02" },
                { value: "12 of 30", label: "found by HTML_CodeSniffer via Pa11y", source: "This benchmark", asOf: "2026-09-02" },
                { value: `${foundByAll} of 30`, label: "found by all four tools", source: "This benchmark", asOf: "2026-09-02" },
                { value: `${foundByNone} of 30`, label: "found by none of them", source: "This benchmark", asOf: "2026-09-02" },
              ]}
            />

            <section aria-labelledby="method-heading" className="mt-12 max-w-[68ch]">
              <h2 id="method-heading" className="font-serif text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">
                Method
              </h2>
              <div className="mt-4 space-y-4 leading-7 text-slate-700 dark:text-slate-300">
                <p>
                  The fixture is a single HTML page containing thirty deliberate defects, each mapped
                  to a WCAG 2.2 success criterion, chosen to span the common failure classes
                  (text alternatives, names and labels, contrast, structure, ARIA, keyboard, timing
                  and media) and to include several that require judgement rather than pattern
                  matching. It was served over HTTP from localhost and each tool was run on 2
                  September 2026 in headless Chrome 143 with default settings and the WCAG 2.2 AA
                  policy where a tool offers one.
                </p>
                <p>
                  A defect counts as found when the tool reports a violation on the right element for
                  the right reason. A report that only appears in a needs-review or potential category
                  is recorded separately, because most continuous-integration setups fail a build on
                  violations and never surface the rest. A report on the right element for the wrong
                  reason is recorded as wrong.
                </p>
                <p>
                  Download the{" "}
                  <a href="/benchmarks/tool-benchmark-fixture-2026-09.html" className="font-medium text-teal-700 underline underline-offset-2 dark:text-teal-300">
                    fixture page
                  </a>{" "}
                  and run it yourself. It is marked noindex; each defect is labelled in a comment.
                </p>
              </div>
            </section>

            <section aria-labelledby="tools-heading" className="mt-12">
              <h2 id="tools-heading" className="font-serif text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">
                The tools
              </h2>
              <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
                <table className="w-full border-collapse text-sm">
                  <caption className="sr-only">Tools tested, versions, and totals found, missed and flagged for review</caption>
                  <thead>
                    <tr>
                      {["Tool", "Version", "Found", "Review only", "Wrong reason", "Missed", "Note"].map((h) => (
                        <th key={h} scope="col" className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-slate-700 dark:text-slate-300">
                    {TOOLS.map((t) => (
                      <tr key={t.key} className="align-top">
                        <th scope="row" className="whitespace-nowrap border-b border-slate-200 px-4 py-3 text-left font-medium text-slate-900 dark:border-slate-800 dark:text-white">{t.name}</th>
                        <td className="border-b border-slate-200 px-4 py-3 font-mono text-xs dark:border-slate-800">{t.version}</td>
                        <td className="border-b border-slate-200 px-4 py-3 font-mono tabular-nums text-emerald-800 dark:border-slate-800 dark:text-emerald-300">{count(t.key, "yes")}</td>
                        <td className="border-b border-slate-200 px-4 py-3 font-mono tabular-nums dark:border-slate-800">{count(t.key, "review")}</td>
                        <td className="border-b border-slate-200 px-4 py-3 font-mono tabular-nums dark:border-slate-800">{count(t.key, "wrong")}</td>
                        <td className="border-b border-slate-200 px-4 py-3 font-mono tabular-nums text-rose-800 dark:border-slate-800 dark:text-rose-300">{count(t.key, "no")}</td>
                        <td className="min-w-[18rem] border-b border-slate-200 px-4 py-3 leading-6 dark:border-slate-800">{t.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section aria-labelledby="matrix-heading" className="mt-12">
              <h2 id="matrix-heading" className="font-serif text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">
                Defect by defect
              </h2>
              <p className="mt-3 max-w-[62ch] leading-7 text-slate-600 dark:text-slate-400">
                Each result is a word, not a colour: Found, Missed, Review (reported only as needing
                human review) or Wrong (reported on the right element for the wrong reason).
              </p>
              <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
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
                      <tr key={d.id} className="align-top">
                        <th scope="row" className="border-b border-slate-200 px-3 py-2.5 text-left font-mono text-xs text-slate-500 dark:border-slate-800 dark:text-slate-400">{d.id}</th>
                        <td className="min-w-[16rem] border-b border-slate-200 px-3 py-2.5 leading-6 dark:border-slate-800">
                          {d.defect}
                          {d.note ? <span className="mt-0.5 block text-xs leading-5 text-slate-500 dark:text-slate-400">{d.note}</span> : null}
                        </td>
                        <td className="whitespace-nowrap border-b border-slate-200 px-3 py-2.5 font-mono text-xs dark:border-slate-800">{d.criterion}</td>
                        {(["axe", "lighthouse", "htmlcs", "ibm"] as const).map((k) => {
                          const r = RESULT_LABEL[d[k]]
                          return (
                            <td key={k} className="border-b border-slate-200 px-3 py-2.5 dark:border-slate-800">
                              <span className={`inline-block rounded-sm px-2 py-0.5 text-xs font-semibold ring-1 ${r.cls}`} title={r.text}>
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

            <section aria-labelledby="findings-heading" className="mt-12 max-w-[68ch]">
              <h2 id="findings-heading" className="font-serif text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">
                What the results mean
              </h2>
              <div className="mt-4 space-y-4 leading-7 text-slate-700 dark:text-slate-300">
                <p>
                  <strong className="font-semibold text-slate-900 dark:text-white">The core is shared.</strong>{" "}
                  Twelve defects were found by all four tools, and they are the ones that matter most
                  in litigation: missing alt text, unlabelled fields, empty buttons and links,
                  untitled frames, low contrast, no page language. These are the failures that
                  appeared in the complaints in{" "}
                  <Link href="/cases/robles-v-dominos" className="font-medium text-teal-700 underline underline-offset-2 dark:text-teal-300">Domino&apos;s</Link>,{" "}
                  <Link href="/cases/gil-v-winn-dixie" className="font-medium text-teal-700 underline underline-offset-2 dark:text-teal-300">Winn-Dixie</Link> and{" "}
                  <Link href="/cases/nfb-v-target" className="font-medium text-teal-700 underline underline-offset-2 dark:text-teal-300">Target</Link>, and any of the four would have caught them.
                </p>
                <p>
                  <strong className="font-semibold text-slate-900 dark:text-white">The edges differ, and IBM covers more of them.</strong>{" "}
                  Only IBM Equal Access caught the div with a click handler and no role, the label
                  pointing at nothing, and the two tables with no header cells. Only HTML_CodeSniffer
                  caught the duplicate id, a check axe dropped in version 4. Only axe and Lighthouse
                  caught the positive tabindex. Running two engines is cheap and finds more than
                  either alone; IBM plus axe covered 22 of the 30 outright.
                </p>
                <p>
                  <strong className="font-semibold text-slate-900 dark:text-white">Review categories hide real failures.</strong>{" "}
                  axe put the broken aria-labelledby reference and the uncaptioned video in its
                  incomplete list; IBM put the untabbable widget, the filename alt text and the
                  video in potential violations. A build that fails only on violations never sees
                  these. Read the review lists.
                </p>
                <p>
                  <strong className="font-semibold text-slate-900 dark:text-white">Five defects are invisible to automation, and they are common.</strong>{" "}
                  Meaningless link text, repeated link text with different targets, a skipped heading
                  level, a page title placed after the content, and a focus outline removed in CSS
                  were missed by every tool. Screen reader users rank nonsensical links and buttons
                  third among their most serious problems, and GDS found lack of visible focus among
                  the top issues in UK public sector monitoring. A clean automated run says nothing
                  about them.
                </p>
                <p>
                  <strong className="font-semibold text-slate-900 dark:text-white">A score is not a measurement.</strong>{" "}
                  Lighthouse gave this page 49. It found fifteen of thirty defects, and its weighting
                  means the number would move if the same defects were rearranged. WebAIM&apos;s 2026
                  evaluation found a median Lighthouse score of 85 across the top million home pages,
                  95.9% of which had detectable failures. Use it to spot regressions, not to make a
                  claim.
                </p>
                <p>
                  <strong className="font-semibold text-slate-900 dark:text-white">Noise is a cost.</strong>{" "}
                  axe reported twenty-eight best-practice findings on a page with no landmarks, all
                  correct and none a WCAG failure. HTML_CodeSniffer reported a captioned data table as
                  a layout table with a caption. Both are the kind of result that trains developers to
                  ignore the report.
                </p>
              </div>
              <p className="mt-6 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Versions and dates are in the tools table. Results apply to this fixture and these
                versions; every tool updates its rules, and the benchmark will be rerun when they do.
                For choosing between tools day to day, see{" "}
                <Link href="/guides/axe-vs-wave" className="font-medium text-teal-700 underline underline-offset-2 dark:text-teal-300">axe vs WAVE</Link> and{" "}
                <Link href="/guides/automated-vs-manual-accessibility-testing" className="font-medium text-teal-700 underline underline-offset-2 dark:text-teal-300">automated vs manual testing</Link>.
                WAVE is not in this benchmark because its engine is not available to run locally.
              </p>
            </section>

            <section aria-labelledby="faq-heading" className="mt-14 max-w-[68ch]">
              <h2 id="faq-heading" className="font-serif text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">Frequently asked questions</h2>
              <dl className="mt-6 space-y-6">
                {FAQS.map((f) => (
                  <div key={f.question}>
                    <dt className="font-semibold text-slate-900 dark:text-white">{f.question}</dt>
                    <dd className="mt-2 leading-7 text-slate-700 dark:text-slate-300">{f.answer}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <div className="mt-14">
              <RelatedContent content="automated accessibility testing axe lighthouse pa11y WAVE tools comparison" title="Related reading" maxItems={4} showDescriptions />
            </div>
          </div>
        </div>
      </article>
    </>
  )
}
