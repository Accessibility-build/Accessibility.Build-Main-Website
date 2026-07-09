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
  Bot,
  Ear,
  Eye,
  GitBranch,
  Keyboard,
  ListChecks,
  Users,
  Zap,
} from "lucide-react"

const pageTitle = "Automated vs Manual Accessibility Testing"
const pageDescription =
  "Automated tools catch roughly 30-40% of WCAG issues; manual testing finds the rest. What each method catches, misses, and how to combine them in one workflow."

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords: [
    "automated vs manual accessibility testing",
    "automated accessibility testing",
    "manual accessibility testing",
    "accessibility testing coverage",
    "axe-core CI",
    "screen reader testing",
    "hybrid accessibility testing",
    "wcag testing tools",
    "accessibility testing workflow",
  ],
  alternates: {
    canonical: "/guides/automated-vs-manual-accessibility-testing",
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: "/guides/automated-vs-manual-accessibility-testing",
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
    name: "Automated vs Manual Accessibility Testing",
    url: "https://accessibility.build/guides/automated-vs-manual-accessibility-testing",
  },
]

const faqs = [
  {
    question: "What percentage of accessibility issues can automated testing find?",
    answer:
      "Commonly cited industry estimates put automated detection at roughly 30-40% of WCAG issues, though the true figure depends on how you count. Studies that measure by distinct success criteria tend to land in that range, while Deque has reported that axe-core rules can surface a higher share (around 57%) when measured by issue volume, because the failures automation catches — like missing alt attributes and low contrast — occur very frequently. The consistent finding across studies is that a meaningful majority of issue types require human judgment, so no automated tool can verify full WCAG conformance on its own.",
  },
  {
    question: "Can automated testing replace manual accessibility audits?",
    answer:
      "No. Automated tools verify machine-checkable facts: an attribute exists, a contrast ratio meets a threshold, an ARIA role is valid. They cannot judge quality or experience — whether alt text is accurate, whether focus order makes sense, whether a screen reader user can complete checkout, or whether error messages are understandable. A site can pass every automated scan and still be unusable with a keyboard or screen reader. Automation is a regression net; manual testing is how you establish actual conformance.",
  },
  {
    question: "Is manual accessibility testing worth the cost?",
    answer:
      "For any organization with real compliance obligations or real users with disabilities, yes. Manual testing is where the highest-impact barriers are found: broken keyboard flows, focus traps, inaccessible custom widgets, and confusing screen reader experiences — exactly the failures cited in ADA lawsuits and flagged in procurement reviews. The cost-effective pattern is to let cheap automated checks handle the machine-detectable issues continuously, reserving paid expert time for the issues only humans can find.",
  },
  {
    question: "How often should I run each type of testing?",
    answer:
      "Run automated checks continuously: in code review and CI on every pull request, plus scheduled scans of production. Run focused manual testing (keyboard pass, screen reader spot checks) whenever you ship a new user-facing flow or component. Commission a full expert audit on a recurring cadence — annually is a common baseline, or after major redesigns — and include usability testing with disabled participants for your most critical journeys.",
  },
  {
    question: "What tools do I need to start automated accessibility testing?",
    answer:
      "A practical free stack: the axe DevTools or WAVE browser extension for on-demand page checks; axe-core integrated into your test runner (jest-axe, @axe-core/playwright, or cypress-axe) for CI; Lighthouse for periodic scoring; and an online scanner such as our URL accessibility auditor for quick full-page reports without any setup. Add a linter like eslint-plugin-jsx-a11y to catch issues at author time.",
  },
  {
    question: "What is a hybrid accessibility testing workflow?",
    answer:
      "A hybrid workflow layers methods by cost and coverage: linting and automated tests in CI catch machine-detectable regressions on every commit; developers and QA run quick manual keyboard and screen reader checks on new features; periodic expert audits provide full WCAG 2.2 coverage and formal documentation; and usability testing with people with disabilities validates that key journeys genuinely work. Each layer catches what the cheaper layer below it misses.",
  },
]

export default function AutomatedVsManualTestingGuidePage() {
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
                    Automated vs Manual Testing
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
                Comparison Guide &bull; Updated July 2026
              </Badge>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
                Automated vs Manual Accessibility Testing: What Each Really
                Catches
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Automated scanners are fast, cheap, and tireless — and they
                still miss most of what makes a site unusable for people with
                disabilities. Here is an honest breakdown of what each method
                catches, what it misses, and how to combine them.
              </p>
            </div>
          </section>

          {/* The coverage question */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                The Coverage Question: How Much Can Automation Find?
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The most commonly cited industry estimate is that automated
                  tools detect roughly <strong>30-40% of WCAG issues</strong>.
                  It is worth being honest about where that number comes from:
                  it is an estimate range, not a single definitive study, and
                  the answer depends heavily on how you count. Measured by
                  distinct WCAG success criteria that can be fully verified by
                  a machine, coverage sits near the low end. Measured by raw
                  issue volume, it can look higher — Deque, the maker of axe,
                  has reported that axe-core rules surfaced about 57% of
                  issues by volume in its own dataset, largely because the
                  failures automation catches best (missing alt text, low
                  contrast, unlabeled fields) are also the most numerous.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Under any counting method, the conclusion is the same: a
                  clean automated scan does not mean a page is accessible. It
                  means the machine-checkable subset of problems is clean.
                  Whether a human can actually perceive, navigate, and operate
                  the page is a different question — one only manual testing
                  answers.
                </p>
              </div>
            </div>
          </section>

          {/* What automated catches */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Bot className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                What Automated Testing Catches Well
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Automated engines excel at binary, machine-verifiable checks —
                and because they run in milliseconds, they can apply those
                checks to every page on every commit.
              </p>
              <ul className="space-y-3 text-muted-foreground leading-relaxed list-disc pl-6">
                <li>
                  <strong className="text-slate-900 dark:text-white">
                    Missing or empty attributes:
                  </strong>{" "}
                  images without <code>alt</code>, form fields without labels,
                  buttons and links without accessible names, missing page
                  language and title.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">
                    Color contrast:
                  </strong>{" "}
                  text and background combinations below WCAG AA thresholds
                  (for programmatically determinable colors).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">
                    Invalid ARIA:
                  </strong>{" "}
                  nonexistent roles, disallowed attributes, broken{" "}
                  <code>aria-labelledby</code> references, ARIA on elements
                  that forbid it.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">
                    Structural red flags:
                  </strong>{" "}
                  skipped heading levels, duplicate IDs, missing landmarks,
                  tables without headers, positive <code>tabindex</code>{" "}
                  values.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">
                    Regressions:
                  </strong>{" "}
                  the single biggest strength — once a rule passes, CI ensures
                  it keeps passing on every future change, for free.
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-6">
                You can see this class of checks in action by running any URL
                through our free{" "}
                <Link
                  href="/tools/url-accessibility-auditor"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  URL accessibility auditor
                </Link>
                , which is powered by the axe-core engine.
              </p>
            </div>
          </section>

          {/* What only manual catches */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                What Only Manual Testing Catches
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                The issues below are largely invisible to scanners — and they
                are the ones users with disabilities hit hardest, and the ones
                most often cited in legal complaints.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-start gap-3 pb-3">
                    <div className="rounded-lg bg-blue-100 dark:bg-blue-900/30 p-2">
                      <Keyboard className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <CardTitle className="text-lg">
                      Keyboard Flows
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Can a user Tab through the whole page in a logical
                      order, operate every menu, modal, and widget, and never
                      get trapped? A scanner can verify an element is
                      focusable; it cannot verify the journey works. See our{" "}
                      <Link
                        href="/guides/keyboard-accessibility"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        keyboard accessibility guide
                      </Link>
                      .
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-start gap-3 pb-3">
                    <div className="rounded-lg bg-purple-100 dark:bg-purple-900/30 p-2">
                      <Ear className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <CardTitle className="text-lg">
                      Screen Reader Experience
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Announcements that make sense, live-region updates that
                      are actually heard, reading order that matches meaning,
                      and custom widgets that behave as their roles promise.
                      Our{" "}
                      <Link
                        href="/guides/screen-reader-testing"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        screen reader testing guide
                      </Link>{" "}
                      covers how to test with NVDA, JAWS, and VoiceOver.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-start gap-3 pb-3">
                    <div className="rounded-lg bg-amber-100 dark:bg-amber-900/30 p-2">
                      <Eye className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <CardTitle className="text-lg">
                      Quality and Accuracy
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      A scanner confirms alt text exists — not that it
                      describes the image. It confirms a label exists — not
                      that it makes sense. Meaningful link text, accurate
                      captions, and sensible error messages all require human
                      judgment.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-start gap-3 pb-3">
                    <div className="rounded-lg bg-emerald-100 dark:bg-emerald-900/30 p-2">
                      <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <CardTitle className="text-lg">
                      Cognitive Load and Context
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Is the flow understandable? Are instructions clear, is
                      enough time given, do error states help users recover,
                      does content on hover or focus behave predictably?
                      These experience-level criteria are inherently human
                      calls — best validated through{" "}
                      <Link
                        href="/services/user-testing"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        user testing with disabled participants
                      </Link>
                      .
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Comparison table */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                Side-by-Side Comparison
              </h2>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    Comparison of automated and manual accessibility testing
                    across speed, cost, coverage, and consistency
                  </caption>
                  <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        Dimension
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        Automated testing
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        Manual testing
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                    <tr>
                      <th
                        scope="row"
                        className="px-4 py-3 font-medium text-slate-900 dark:text-white"
                      >
                        Speed
                      </th>
                      <td className="px-4 py-3">
                        Seconds per page; scales to thousands of pages
                      </td>
                      <td className="px-4 py-3">
                        Hours to days per audit scope
                      </td>
                    </tr>
                    <tr>
                      <th
                        scope="row"
                        className="px-4 py-3 font-medium text-slate-900 dark:text-white"
                      >
                        Cost per run
                      </th>
                      <td className="px-4 py-3">
                        Near zero once integrated (most engines are free)
                      </td>
                      <td className="px-4 py-3">
                        Expert time — the main cost of an audit
                      </td>
                    </tr>
                    <tr>
                      <th
                        scope="row"
                        className="px-4 py-3 font-medium text-slate-900 dark:text-white"
                      >
                        WCAG coverage
                      </th>
                      <td className="px-4 py-3">
                        Roughly 30-40% of issues (common industry estimates;
                        varies by study and counting method)
                      </td>
                      <td className="px-4 py-3">
                        Full coverage, including all judgment-based criteria
                      </td>
                    </tr>
                    <tr>
                      <th
                        scope="row"
                        className="px-4 py-3 font-medium text-slate-900 dark:text-white"
                      >
                        Consistency
                      </th>
                      <td className="px-4 py-3">
                        Perfectly repeatable; ideal for regression detection
                      </td>
                      <td className="px-4 py-3">
                        Varies with tester skill and methodology
                      </td>
                    </tr>
                    <tr>
                      <th
                        scope="row"
                        className="px-4 py-3 font-medium text-slate-900 dark:text-white"
                      >
                        False positives
                      </th>
                      <td className="px-4 py-3">
                        Low with good engines, but flagged items still need
                        human triage
                      </td>
                      <td className="px-4 py-3">
                        Rare — findings come with context and reproduction
                        steps
                      </td>
                    </tr>
                    <tr>
                      <th
                        scope="row"
                        className="px-4 py-3 font-medium text-slate-900 dark:text-white"
                      >
                        Best used for
                      </th>
                      <td className="px-4 py-3">
                        CI gates, monitoring, catching regressions early
                      </td>
                      <td className="px-4 py-3">
                        Conformance claims, VPATs, real usability, legal
                        defensibility
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Tool categories */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                Tool Categories at a Glance
              </h2>
              <ul className="space-y-4 text-muted-foreground leading-relaxed list-disc pl-6">
                <li>
                  <strong className="text-slate-900 dark:text-white">
                    Browser extensions
                  </strong>{" "}
                  (axe DevTools, WAVE, Accessibility Insights): on-demand,
                  single-page checks during development and design review. See
                  our{" "}
                  <Link
                    href="/guides/axe-vs-wave"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    axe vs WAVE comparison
                  </Link>{" "}
                  for choosing between the two most popular options.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">
                    CI/test-runner libraries
                  </strong>{" "}
                  (axe-core with Playwright, Cypress, or Jest; Pa11y;
                  Lighthouse CI): fail builds when new violations are
                  introduced.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">
                    Site-wide scanners and monitors
                  </strong>{" "}
                  (crawler-based platforms and online checkers like our{" "}
                  <Link
                    href="/tools/url-accessibility-auditor"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    URL accessibility auditor
                  </Link>
                  ): track issues across many pages over time.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">
                    Linters
                  </strong>{" "}
                  (eslint-plugin-jsx-a11y, axe Linter): catch issues at author
                  time, before the code even runs.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">
                    Manual methods
                  </strong>
                  : keyboard-only passes, screen reader testing, zoom and
                  reflow checks, expert WCAG audits, and moderated usability
                  sessions with disabled participants.
                </li>
              </ul>
            </div>
          </section>

          {/* Hybrid workflow */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                <GitBranch className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                The Hybrid Workflow We Recommend
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                This is not automated <em>versus</em> manual — mature teams run
                both, layered by cost. Each layer catches what the cheaper
                layer below it misses.
              </p>
              <ol className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold text-lg">
                    1
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <Zap className="h-4 w-4" />
                      Automate in CI — every commit
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mt-1">
                      Lint accessibility at author time and run axe-core
                      checks in your test suite so machine-detectable
                      violations fail the build. This keeps the noise floor at
                      zero so human testers spend time on real problems.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold text-lg">
                    2
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <Keyboard className="h-4 w-4" />
                      Quick manual checks — every feature
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mt-1">
                      Before a user-facing feature ships, someone does a
                      keyboard-only pass and a brief screen reader check of
                      the new flow. Fifteen minutes here prevents most of the
                      serious barriers automation cannot see.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold text-lg">
                    3
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <ListChecks className="h-4 w-4" />
                      Expert audits — periodically
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mt-1">
                      A full{" "}
                      <Link
                        href="/services/accessibility-audits"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        professional audit
                      </Link>{" "}
                      against WCAG 2.2 — typically annually or after major
                      redesigns — provides complete coverage, prioritized
                      findings, and the documentation you need for VPATs and
                      legal defensibility. Our{" "}
                      <Link
                        href="/guides/how-to-audit-website-accessibility"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        website accessibility audit guide
                      </Link>{" "}
                      walks through the methodology.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold text-lg">
                    4
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      User testing — for critical journeys
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mt-1">
                      For checkout, signup, and other revenue-critical flows,
                      moderated sessions with screen reader users,
                      keyboard-only users, and people with cognitive
                      disabilities reveal friction no audit checklist
                      captures.
                    </p>
                  </div>
                </li>
              </ol>
            </div>
          </section>

          {/* CTA */}
          <section className="py-12 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <div className="rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20 p-8 text-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  Start With a Free Automated Baseline
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6 max-w-lg mx-auto">
                  Run any page through our axe-core-powered auditor to see the
                  machine-detectable issues in seconds — then plan the manual
                  testing that covers the rest.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button asChild size="lg" className="gap-2">
                    <Link href="/tools/url-accessibility-auditor">
                      Scan a URL Now
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="gap-2">
                    <Link href="/services/accessibility-audits">
                      Book a Manual Audit
                    </Link>
                  </Button>
                </div>
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
                content="automated manual accessibility testing audit screen reader keyboard wcag tools"
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
