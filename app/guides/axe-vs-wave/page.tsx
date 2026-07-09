import type { Metadata } from "next"
import Link from "next/link"
import {
  BreadcrumbStructuredData,
  FAQStructuredData,
} from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  Braces,
  Eye,
  GitBranch,
  GraduationCap,
  Layers,
  Terminal,
} from "lucide-react"

const pageTitle = "axe vs WAVE: Accessibility Testing Tools Compared"
const pageDescription =
  "axe (Deque) and WAVE (WebAIM) are the two most-used free accessibility checkers. Compare engines, workflows, CI support, pricing, and when to reach for each."

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords: [
    "axe vs wave",
    "wave vs axe",
    "axe accessibility tool",
    "wave accessibility tool",
    "axe-core",
    "webaim wave",
    "axe devtools",
    "accessibility testing tools comparison",
    "best accessibility checker",
  ],
  alternates: {
    canonical: "/guides/axe-vs-wave",
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: "/guides/axe-vs-wave",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: `/api/og?title=${encodeURIComponent(pageTitle)}&section=Guide`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
    images: [
      {
        url: `/api/og?title=${encodeURIComponent(pageTitle)}&section=Guide`,
        width: 1200,
        height: 630,
      },
    ],
  },
}

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Guides", url: "https://accessibility.build/guides" },
  {
    name: "axe vs WAVE",
    url: "https://accessibility.build/guides/axe-vs-wave",
  },
]

const faqs = [
  {
    question: "Is axe better than WAVE?",
    answer:
      "Neither is universally better — they are optimized for different workflows. axe is the stronger choice for developers and teams that want automated checks in code: its open-source axe-core engine runs in unit tests, Playwright, Cypress, and CI pipelines, and its results are designed to minimize false positives. WAVE is the stronger choice for visual, in-context evaluation: it overlays icons directly on the page, which makes issues tangible for designers, content authors, auditors, and students. Many accessibility professionals use both on the same page.",
  },
  {
    question: "Are axe and WAVE free?",
    answer:
      "Both have genuinely useful free tiers. The axe DevTools browser extension is free for automated page scans, and the underlying axe-core engine is free and open source (Mozilla Public License 2.0). Deque sells paid tiers (axe DevTools Pro and enterprise products) that add guided intelligent testing, saved results, and team features. WAVE's browser extensions for Chrome, Firefox, and Edge are free with no account required, as is the wave.webaim.org online checker; WebAIM charges for the WAVE API and stand-alone/enterprise versions used for large-scale or private scanning.",
  },
  {
    question: "Do axe and WAVE find the same issues?",
    answer:
      "There is heavy overlap on the core machine-checkable issues — missing alt text, form label problems, low contrast, ARIA misuse, empty links and buttons — but the results are not identical because the engines use different rules and different philosophies. axe aims to report only definite failures plus clearly separated 'needs review' items, while WAVE intentionally surfaces more alerts (possible issues) and structural information for a human to evaluate. Running both on the same page routinely turns up items the other framed differently or skipped, which is exactly why auditors often pair them.",
  },
  {
    question: "Can WAVE be used in CI like axe?",
    answer:
      "Not in the same way. WAVE's automation story is its commercial API and stand-alone server, which you can script against for scheduled or bulk scanning. It does not have the free, in-process test-runner integration that makes axe-core the default for CI: with axe you can fail a pull request from a Jest, Playwright, or Cypress test at no cost. If build-pipeline integration is a requirement, axe-core is the practical choice; WAVE then serves as a complementary manual review tool.",
  },
  {
    question: "Does Lighthouse replace axe or WAVE?",
    answer:
      "No. Lighthouse's accessibility audit actually runs a subset of axe-core rules, so it is a convenient built-in spot check in Chrome DevTools rather than an independent or more complete engine. Its accessibility score is useful for tracking direction over time, but a 100 score does not mean a page is accessible — it means the tested subset of automated rules passed. For deeper automated coverage use axe or WAVE directly, and remember that most WCAG issues still require manual testing.",
  },
  {
    question: "Which tool should a beginner start with?",
    answer:
      "Most beginners find WAVE more approachable: the icons appear directly on the page next to each issue, the details panel explains what each icon means and why it matters, and no setup or account is needed. WebAIM built it with education in mind. Developers comfortable with browser DevTools often prefer starting with axe because findings include the exact failing element, the violated rule, and remediation guidance in a familiar inspector layout. Either way, learn one well — then add the other, since they complement each other.",
  },
]

export default function AxeVsWaveGuidePage() {
  return (
    <>
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />
      <FAQStructuredData faqs={faqs} />

      <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
        {/* Breadcrumb Navigation */}
        <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <li>
                  <Link
                    href="/"
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li aria-hidden="true" className="text-slate-400">
                  /
                </li>
                <li>
                  <Link
                    href="/guides"
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    Guides
                  </Link>
                </li>
                <li aria-hidden="true" className="text-slate-400">
                  /
                </li>
                <li>
                  <span className="text-slate-900 dark:text-white font-medium">
                    axe vs WAVE
                  </span>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <article>
          {/* Hero */}
          <section className="pt-12 pb-8 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl text-center">
              <Badge variant="secondary" className="mb-4 text-sm px-3 py-1">
                Tool Comparison &bull; Updated July 2026
              </Badge>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
                axe vs WAVE: Which Accessibility Testing Tool Should You Use?
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                axe by Deque and WAVE by WebAIM are the two most widely used
                free accessibility checkers. They overlap less than you might
                think — one is built for developer automation, the other for
                visual, human-in-the-loop evaluation. Here is how to choose.
              </p>
            </div>
          </section>

          {/* Quick verdict */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                The Short Answer
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-blue-200 dark:border-blue-900">
                  <CardHeader className="flex flex-row items-start gap-3 pb-3">
                    <div className="rounded-lg bg-blue-100 dark:bg-blue-900/30 p-2">
                      <Terminal className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <CardTitle className="text-lg">
                      Choose axe when&hellip;
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm text-muted-foreground leading-relaxed space-y-2 list-disc pl-4">
                      <li>
                        You want accessibility checks in CI, unit tests, or
                        end-to-end tests
                      </li>
                      <li>
                        Developers are the primary audience for the findings
                      </li>
                      <li>
                        You need low-false-positive results you can gate
                        builds on
                      </li>
                      <li>
                        You want one engine shared across extension, tests,
                        and tooling
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className="border-emerald-200 dark:border-emerald-900">
                  <CardHeader className="flex flex-row items-start gap-3 pb-3">
                    <div className="rounded-lg bg-emerald-100 dark:bg-emerald-900/30 p-2">
                      <Eye className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <CardTitle className="text-lg">
                      Choose WAVE when&hellip;
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm text-muted-foreground leading-relaxed space-y-2 list-disc pl-4">
                      <li>
                        You want to see issues visually, in place on the page
                      </li>
                      <li>
                        Designers, content authors, or students are evaluating
                        pages
                      </li>
                      <li>
                        You are doing manual review and want structure,
                        headings, and ARIA made visible
                      </li>
                      <li>
                        You need a zero-setup check anyone can run in seconds
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
              <p className="text-muted-foreground leading-relaxed mt-6">
                Experienced auditors rarely treat this as either/or: axe in
                the pipeline, WAVE in the review. Both are automated checkers,
                so both inherit the same ceiling — automation finds only a
                fraction of WCAG issues, as we cover in our{" "}
                <Link
                  href="/guides/automated-vs-manual-accessibility-testing"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  automated vs manual testing guide
                </Link>
                .
              </p>
            </div>
          </section>

          {/* axe deep dive */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Braces className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                axe: The Developer&apos;s Engine
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  axe is built by Deque Systems, one of the largest
                  accessibility consultancies. Its foundation is{" "}
                  <strong>axe-core</strong>, an open-source JavaScript rules
                  engine (Mozilla Public License 2.0) that has become the de
                  facto standard for automated accessibility testing — it
                  powers Google Lighthouse&apos;s accessibility audit, many
                  commercial scanners, and our own{" "}
                  <Link
                    href="/tools/url-accessibility-auditor"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    URL accessibility auditor
                  </Link>
                  .
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The <strong>axe DevTools browser extension</strong> (Chrome,
                  Firefox, Edge) adds a panel to the browser inspector: run a
                  scan and each violation lists the failing element, the rule
                  and WCAG criterion involved, severity, and remediation
                  guidance, with a highlight-and-inspect link. Deque&apos;s
                  stated design philosophy is to report only issues it can
                  verify as failures — ambiguous cases are set aside as
                  &quot;needs review&quot; rather than mixed in with
                  violations — which is why teams trust axe results enough to
                  fail builds on them.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Where axe really pulls ahead is automation.{" "}
                  <strong>axe-core integrates directly into test code</strong>{" "}
                  via official and community packages: @axe-core/playwright,
                  cypress-axe, jest-axe, @axe-core/react, plus CLI wrappers.
                  That means an accessibility violation can fail a pull
                  request the same way a broken unit test does. The free tier
                  covers automated scans; paid axe DevTools Pro adds guided
                  &quot;intelligent&quot; semi-automated walkthroughs, saved
                  and shareable results, and enterprise reporting.
                </p>
              </div>
            </div>
          </section>

          {/* WAVE deep dive */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Eye className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
                WAVE: The Visual Evaluator
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  WAVE (Web Accessibility Evaluation Tool) is built by{" "}
                  <strong>WebAIM</strong>, the nonprofit accessibility
                  organization at Utah State University known for its screen
                  reader user surveys and the WebAIM Million study. That
                  educational DNA shows in the product: WAVE&apos;s goal is
                  not just to list errors but to help humans understand a
                  page&apos;s accessibility.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Instead of a findings list in a panel, WAVE{" "}
                  <strong>annotates the page itself</strong>: red icons for
                  errors (missing alt text, empty buttons, contrast failures),
                  yellow icons for alerts that deserve a human look, and green
                  and blue icons for features and structural elements — labels,
                  landmarks, headings, ARIA. Companion views show the heading
                  outline, reading order, and a dedicated contrast tool. This
                  in-context presentation is why WAVE is a fixture in
                  accessibility courses and design reviews: you see exactly
                  where each issue lives in the layout.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  WAVE is available as a free online checker
                  (wave.webaim.org) and free browser extensions for Chrome,
                  Firefox, and Edge — no account, no setup, and the extension
                  evaluates entirely in your browser, so it works on
                  password-protected and local pages. For automation, WebAIM
                  sells the <strong>WAVE API and a stand-alone server</strong>{" "}
                  for bulk or private scanning; there is no free test-runner
                  integration equivalent to axe-core.
                </p>
              </div>
            </div>
          </section>

          {/* Comparison table */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                Feature-by-Feature Comparison
              </h2>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    Feature comparison of axe and WAVE accessibility testing
                    tools
                  </caption>
                  <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        Feature
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        axe (Deque)
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        WAVE (WebAIM)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                    <tr>
                      <th
                        scope="row"
                        className="px-4 py-3 font-medium text-slate-900 dark:text-white"
                      >
                        Maker
                      </th>
                      <td className="px-4 py-3">
                        Deque Systems (commercial consultancy)
                      </td>
                      <td className="px-4 py-3">
                        WebAIM (nonprofit, Utah State University)
                      </td>
                    </tr>
                    <tr>
                      <th
                        scope="row"
                        className="px-4 py-3 font-medium text-slate-900 dark:text-white"
                      >
                        Engine
                      </th>
                      <td className="px-4 py-3">
                        axe-core, open source (MPL 2.0)
                      </td>
                      <td className="px-4 py-3">
                        Proprietary WAVE engine
                      </td>
                    </tr>
                    <tr>
                      <th
                        scope="row"
                        className="px-4 py-3 font-medium text-slate-900 dark:text-white"
                      >
                        Primary interface
                      </th>
                      <td className="px-4 py-3">
                        DevTools panel with element inspector
                      </td>
                      <td className="px-4 py-3">
                        Icons overlaid visually on the page
                      </td>
                    </tr>
                    <tr>
                      <th
                        scope="row"
                        className="px-4 py-3 font-medium text-slate-900 dark:text-white"
                      >
                        Results philosophy
                      </th>
                      <td className="px-4 py-3">
                        Definite violations plus separate needs-review items;
                        minimizes false positives
                      </td>
                      <td className="px-4 py-3">
                        Errors plus generous alerts and structural info for
                        human judgment
                      </td>
                    </tr>
                    <tr>
                      <th
                        scope="row"
                        className="px-4 py-3 font-medium text-slate-900 dark:text-white"
                      >
                        CI / test integration
                      </th>
                      <td className="px-4 py-3">
                        Free and first-class: Playwright, Cypress, Jest,
                        React, CLI
                      </td>
                      <td className="px-4 py-3">
                        Via paid WAVE API / stand-alone server only
                      </td>
                    </tr>
                    <tr>
                      <th
                        scope="row"
                        className="px-4 py-3 font-medium text-slate-900 dark:text-white"
                      >
                        Free tier
                      </th>
                      <td className="px-4 py-3">
                        Extension scans + full open-source engine
                      </td>
                      <td className="px-4 py-3">
                        Extension + online checker, no account needed
                      </td>
                    </tr>
                    <tr>
                      <th
                        scope="row"
                        className="px-4 py-3 font-medium text-slate-900 dark:text-white"
                      >
                        Paid offering
                      </th>
                      <td className="px-4 py-3">
                        axe DevTools Pro: guided tests, saved results,
                        enterprise reporting
                      </td>
                      <td className="px-4 py-3">
                        WAVE API and stand-alone version for bulk/private
                        scanning
                      </td>
                    </tr>
                    <tr>
                      <th
                        scope="row"
                        className="px-4 py-3 font-medium text-slate-900 dark:text-white"
                      >
                        Best audience
                      </th>
                      <td className="px-4 py-3">
                        Developers, QA engineers, CI pipelines
                      </td>
                      <td className="px-4 py-3">
                        Auditors, designers, content authors, educators
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Complementary workflows */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <GitBranch className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                How They Work Together in a Real Workflow
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Because the two tools sit at different points in the
                development lifecycle, the strongest setup uses both:
              </p>
              <ul className="space-y-3 text-muted-foreground leading-relaxed list-disc pl-6">
                <li>
                  <strong className="text-slate-900 dark:text-white">
                    While coding:
                  </strong>{" "}
                  axe DevTools extension on the component you are building;
                  jest-axe or @axe-core/playwright assertions in the test
                  suite.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">
                    In CI:
                  </strong>{" "}
                  axe-core gates every pull request so machine-detectable
                  regressions never merge.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">
                    In design and content review:
                  </strong>{" "}
                  WAVE&apos;s on-page icons let non-developers verify
                  headings, labels, alt text, and contrast without opening
                  DevTools.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">
                    During audits:
                  </strong>{" "}
                  run both — differences in what each flags are useful
                  prompts — then do the manual keyboard and screen reader
                  testing that neither can automate. Our{" "}
                  <Link
                    href="/guides/how-to-audit-website-accessibility"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    step-by-step audit guide
                  </Link>{" "}
                  covers the full methodology.
                </li>
              </ul>
            </div>
          </section>

          {/* Alternatives */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Layers className="h-7 w-7 text-purple-600 dark:text-purple-400" />
                Worth Knowing: Other Tools in the Space
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Lighthouse</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Built into Chrome DevTools; its accessibility audit runs
                      a subset of axe-core rules and produces a 0-100 score.
                      Convenient for trend tracking, not a replacement for
                      either tool.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">
                      IBM Equal Access
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      IBM&apos;s open-source checker (browser extension +
                      accessibility-checker npm package) with its own rules
                      engine mapped to WCAG and IBM requirements — a good
                      second opinion to axe-core in CI.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Pa11y</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Open-source CLI and dashboard for scripted and scheduled
                      scans; can run HTML_CodeSniffer and axe-core as its test
                      runners. Popular for lightweight monitoring of many
                      URLs.
                    </p>
                  </CardContent>
                </Card>
              </div>
              <p className="text-muted-foreground leading-relaxed mt-6 flex items-start gap-2">
                <GraduationCap className="h-5 w-5 mt-0.5 flex-shrink-0 text-muted-foreground" />
                <span>
                  Whichever checker you choose, remember the shared ceiling:
                  automated tools verify machine-checkable rules, not the
                  human experience. Keyboard flows, screen reader usability,
                  and content quality still require manual testing to confirm.
                </span>
              </p>
            </div>
          </section>

          {/* CTA */}
          <section className="py-12 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <div className="rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20 p-8 text-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  Try an axe-core Scan Without Installing Anything
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6 max-w-lg mx-auto">
                  Our free URL accessibility auditor runs the same axe-core
                  engine discussed in this guide and returns a prioritized,
                  plain-English report for any public page.
                </p>
                <Button asChild size="lg" className="gap-2">
                  <Link href="/tools/url-accessibility-auditor">
                    Audit a URL Free
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="py-12 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl font-bold mb-6 text-center text-slate-900 dark:text-white">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {faqs.map((item, i) => (
                  <details
                    key={i}
                    className="group border rounded-lg p-4 bg-card"
                  >
                    <summary className="cursor-pointer font-medium list-none flex items-center justify-between">
                      {item.question}
                      <span className="ml-2 text-muted-foreground group-open:rotate-180 transition-transform">
                        &#9662;
                      </span>
                    </summary>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                      {item.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          {/* Related Content */}
          <section className="pb-12 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <RelatedContent
                content="axe wave accessibility testing tools audit wcag automated checker"
                title="Related Tools & Resources"
                maxItems={6}
                showDescriptions={true}
              />
            </div>
          </section>
        </article>
      </div>
    </>
  )
}
