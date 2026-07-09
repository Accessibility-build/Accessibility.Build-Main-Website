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
  AlertTriangle,
  ArrowRight,
  Code2,
  FileCheck,
  Gavel,
  GraduationCap,
  Search,
  Settings,
  ShieldCheck,
  Wrench,
} from "lucide-react"

const pageTitle = "Accessibility Overlay Alternatives That Actually Work"
const pageDescription =
  "Overlay widgets don't deliver ADA or WCAG compliance. Compare real alternatives — audits, remediation, CI testing, training — by cost, effort, and legal risk."

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords: [
    "accessibility overlay alternatives",
    "accessibe alternative",
    "userway alternative",
    "audioeye alternative",
    "overlay replacement",
    "remove accessibility overlay",
    "wcag remediation",
    "accessibility audit vs overlay",
    "ada compliance without overlay",
  ],
  alternates: {
    canonical: "/guides/accessibility-overlay-alternatives",
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: "/guides/accessibility-overlay-alternatives",
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
    name: "Accessibility Overlay Alternatives",
    url: "https://accessibility.build/guides/accessibility-overlay-alternatives",
  },
]

const faqs = [
  {
    question: "Do accessibility overlays make you compliant?",
    answer:
      "No. Overlays inject JavaScript that adjusts presentation at runtime, but WCAG conformance depends on the underlying code: semantic structure, accessible names, keyboard operability, focus management, and meaningful alternative text. Automated tools — including the engines overlays rely on — can only detect a minority of WCAG issues, and no widget can rewrite broken markup into conformant markup. Courts and regulators have treated overlay-equipped sites as non-compliant when real barriers remain.",
  },
  {
    question: "Are overlays ADA compliant?",
    answer:
      "The ADA does not certify products, so no tool can be 'ADA compliant' on its own. What matters is whether people with disabilities can actually use your site. Sites using overlays continue to be named in ADA lawsuits — UsableNet's litigation reports have repeatedly found hundreds of lawsuits per year filed against websites that had an accessibility widget installed. In January 2025, the FTC also ordered overlay vendor accessiBe to pay $1 million over claims that its product could make any website WCAG-compliant, finding those claims deceptive.",
  },
  {
    question: "What is the lawsuit risk of keeping an overlay installed?",
    answer:
      "Installing an overlay does not reduce your exposure, and several accessibility attorneys argue it can increase it: the widget signals awareness of accessibility obligations while the underlying barriers remain detectable by the same automated scanners plaintiffs' firms use. Overlay vendor contracts also commonly disclaim liability for legal claims, so if you are sued, your organization bears the cost. The durable risk reduction comes from fixing the barriers in your code.",
  },
  {
    question: "What should I do first after removing an overlay?",
    answer:
      "Run an automated scan and a keyboard-only pass to establish a baseline, then commission a professional audit that combines automated and manual testing. Prioritize fixes by user impact: keyboard access, form labels, accessible names, focus visibility, and alt text usually top the list. Our overlay detector tool can confirm the widget is fully removed, including copies loaded through tag managers.",
  },
  {
    question: "Is remediation more expensive than an overlay subscription?",
    answer:
      "Upfront, yes — overlays cost roughly $490 to $5,000 per year, while a professional audit plus remediation for a mid-size site commonly runs from several thousand to tens of thousands of dollars. But remediation is a one-time investment in your actual codebase that compounds: fixed components stay fixed, your team learns the patterns, and your legal exposure genuinely drops. An overlay is a perpetual subscription that leaves every underlying barrier — and the associated lawsuit risk — in place.",
  },
  {
    question: "Can I keep an overlay while I remediate?",
    answer:
      "You can, but be aware of the tradeoffs. Overlays can interfere with assistive technology, add page weight, and complicate testing because the widget mutates the DOM you are trying to fix. Many teams remove the overlay at the start of remediation so audits reflect the real user experience. If you keep it temporarily, make sure auditors test with the widget disabled so findings map to your source code.",
  },
]

export default function OverlayAlternativesGuidePage() {
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
                    Overlay Alternatives
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
                Accessibility Overlay Alternatives That Actually Work
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                If you are questioning your overlay subscription, you are in
                good company. This guide compares the proven alternatives —
                audits, code remediation, CI testing, and training — by cost,
                effort, and how much legal risk each one actually removes.
              </p>
            </div>
          </section>

          {/* Why teams look for alternatives */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                Why Teams Are Moving Away From Overlays
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Accessibility overlays are third-party JavaScript widgets that
                promise automated ADA and WCAG compliance. We cover how they
                work — and why they fall short technically — in depth in our{" "}
                <Link
                  href="/guides/accessibility-overlays"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  accessibility overlays guide
                </Link>
                . This page focuses on the practical question that follows:
                what should you do instead? Three developments have pushed that
                question to the top of many teams&apos; agendas.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <Card>
                  <CardHeader className="flex flex-row items-start gap-3 pb-3">
                    <div className="rounded-lg bg-amber-100 dark:bg-amber-900/30 p-2">
                      <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <CardTitle className="text-lg">
                      Technical Limits Are Real
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      A runtime JavaScript widget cannot rewrite inaccessible
                      source code into conformant code. It cannot author
                      meaningful alt text, restructure heading hierarchies, fix
                      reading order, or make a custom widget keyboard-operable.
                      The barriers stay in the page for assistive technology
                      users.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-start gap-3 pb-3">
                    <div className="rounded-lg bg-red-100 dark:bg-red-900/30 p-2">
                      <Gavel className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <CardTitle className="text-lg">
                      Overlay Sites Still Get Sued
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      UsableNet&apos;s digital accessibility lawsuit reports
                      have consistently documented hundreds of lawsuits each
                      year filed against websites that had an overlay or
                      accessibility widget installed — roughly a quarter of all
                      web accessibility suits in recent report years. The
                      widget is not a legal shield.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-start gap-3 pb-3">
                    <div className="rounded-lg bg-purple-100 dark:bg-purple-900/30 p-2">
                      <ShieldCheck className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <CardTitle className="text-lg">
                      Regulators Have Acted
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      In January 2025, the FTC announced a settlement requiring
                      overlay vendor accessiBe to pay $1 million over claims
                      that its accessWidget could make any website
                      WCAG-compliant, which the agency alleged were deceptive.
                      The order also covered undisclosed paid endorsements.
                    </p>
                  </CardContent>
                </Card>
              </div>
              <p className="text-muted-foreground leading-relaxed mt-8">
                Add to that the long-standing criticism from the accessibility
                community itself — the Overlay Fact Sheet has been signed by
                hundreds of practitioners and disability advocates, and the
                National Federation of the Blind has publicly criticized
                overlay marketing — and the case for a different approach is
                straightforward. Not sure whether your site currently runs an
                overlay? Our free{" "}
                <Link
                  href="/tools/overlay-detector"
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  overlay detector
                </Link>{" "}
                identifies installed widgets and the vendor behind them.
              </p>
            </div>
          </section>

          {/* The real alternatives */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4">
                The 5 Real Alternatives, Ranked by Effort and Impact
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                None of these are as cheap as pasting a script tag — and all of
                them, unlike an overlay, actually change what assistive
                technology users experience. They are listed roughly in the
                order most teams should adopt them.
              </p>
              <ol className="space-y-8">
                <li className="flex items-start gap-4">
                  <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold text-lg">
                    1
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2 flex-wrap">
                      <Search className="h-4 w-4" />
                      Manual Remediation Guided by a Professional Audit
                      <Badge variant="secondary">High impact</Badge>
                      <Badge variant="outline">Medium–high effort</Badge>
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mt-2">
                      The gold standard. A qualified auditor combines automated
                      scanning with manual keyboard and screen reader testing,
                      produces a prioritized findings report mapped to WCAG 2.2
                      success criteria, and your team (or a remediation
                      partner) fixes the issues in source code. This is the
                      only approach that directly removes the barriers a
                      lawsuit would cite. See our{" "}
                      <Link
                        href="/services/accessibility-audits"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        accessibility audit services
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/services/remediation-support"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        remediation support
                      </Link>
                      .
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold text-lg">
                    2
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2 flex-wrap">
                      <Code2 className="h-4 w-4" />
                      Semantic HTML and Design-System Fixes
                      <Badge variant="secondary">High impact</Badge>
                      <Badge variant="outline">Medium effort</Badge>
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mt-2">
                      A large share of common WCAG failures — unlabeled form
                      fields, div-based buttons, missing landmarks, broken
                      heading order — trace back to a handful of shared
                      components. Fixing your design system&apos;s buttons,
                      inputs, modals, and navigation once propagates the fix to
                      every page that uses them. This is the highest-leverage
                      engineering work in accessibility: semantic HTML gives
                      you keyboard support, accessible names, and screen reader
                      behavior for free.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold text-lg">
                    3
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2 flex-wrap">
                      <Settings className="h-4 w-4" />
                      Automated Testing in CI with axe-core
                      <Badge variant="secondary">Medium impact</Badge>
                      <Badge variant="outline">Low effort</Badge>
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mt-2">
                      Add axe-core (via jest-axe, Playwright, or Cypress
                      integrations) or Pa11y to your continuous integration
                      pipeline so accessibility regressions fail the build
                      before they ship. Automated checks only catch a portion
                      of WCAG issues, but they catch them on every commit for
                      near-zero marginal cost — the opposite economics of an
                      overlay, which charges annually while fixing nothing in
                      your code. Read our{" "}
                      <Link
                        href="/guides/automated-vs-manual-accessibility-testing"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        automated vs manual testing guide
                      </Link>{" "}
                      for where automation genuinely helps.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold text-lg">
                    4
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2 flex-wrap">
                      <FileCheck className="h-4 w-4" />
                      Professional Audit Plus VPAT / ACR Documentation
                      <Badge variant="secondary">Medium–high impact</Badge>
                      <Badge variant="outline">Medium effort</Badge>
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mt-2">
                      If you sell to enterprises, education, or government
                      buyers, a Voluntary Product Accessibility Template
                      (VPAT), completed as an Accessibility Conformance Report,
                      documents your actual WCAG and Section 508 conformance.
                      Unlike an overlay badge, an ACR is produced from real
                      testing evidence, holds up in procurement reviews, and
                      demonstrates the documented good-faith effort that
                      matters in legal contexts.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-bold text-lg">
                    5
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2 flex-wrap">
                      <GraduationCap className="h-4 w-4" />
                      Team Training
                      <Badge variant="secondary">
                        Compounding impact
                      </Badge>
                      <Badge variant="outline">Low–medium effort</Badge>
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mt-2">
                      Training designers, developers, and content authors on
                      WCAG 2.2 changes the cost curve permanently: teams that
                      understand accessibility stop introducing new barriers,
                      so every future feature ships accessible by default. A
                      practical starting point is working through the{" "}
                      <Link
                        href="/checklists/wcag-2-2"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        WCAG 2.2 checklist
                      </Link>{" "}
                      against a real page your team owns.
                    </p>
                  </div>
                </li>
              </ol>
            </div>
          </section>

          {/* Cost/benefit comparison table */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4">
                Cost and Benefit: Overlay vs Remediation vs Audit +
                Remediation
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Figures below are typical market ranges for small-to-mid-size
                sites; complex applications cost more. The decisive column is
                not price — it is whether the approach removes barriers from
                your code.
              </p>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    Comparison of accessibility overlay, DIY remediation, and
                    professional audit plus remediation by cost, coverage, and
                    legal risk
                  </caption>
                  <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-900 dark:text-white">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        Factor
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        Overlay widget
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        In-house remediation
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        Audit + remediation
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                    <tr>
                      <th
                        scope="row"
                        className="px-4 py-3 font-medium text-slate-900 dark:text-white"
                      >
                        Typical cost
                      </th>
                      <td className="px-4 py-3">
                        ~$490–$5,000/year, forever
                      </td>
                      <td className="px-4 py-3">
                        Engineering time (varies widely)
                      </td>
                      <td className="px-4 py-3">
                        ~$3,000–$30,000+ one-time, then maintenance
                      </td>
                    </tr>
                    <tr>
                      <th
                        scope="row"
                        className="px-4 py-3 font-medium text-slate-900 dark:text-white"
                      >
                        Fixes source code
                      </th>
                      <td className="px-4 py-3">No</td>
                      <td className="px-4 py-3">Yes</td>
                      <td className="px-4 py-3">Yes</td>
                    </tr>
                    <tr>
                      <th
                        scope="row"
                        className="px-4 py-3 font-medium text-slate-900 dark:text-white"
                      >
                        Issue coverage
                      </th>
                      <td className="px-4 py-3">
                        Cosmetic adjustments only; automated detection misses
                        most WCAG issues
                      </td>
                      <td className="px-4 py-3">
                        Good for known patterns; risks blind spots without
                        expert review
                      </td>
                      <td className="px-4 py-3">
                        Full WCAG 2.2 coverage including manual-only issues
                      </td>
                    </tr>
                    <tr>
                      <th
                        scope="row"
                        className="px-4 py-3 font-medium text-slate-900 dark:text-white"
                      >
                        Lawsuit risk reduction
                      </th>
                      <td className="px-4 py-3">
                        Minimal — overlay-equipped sites are sued regularly
                      </td>
                      <td className="px-4 py-3">
                        Substantial, proportional to what you fix
                      </td>
                      <td className="px-4 py-3">
                        Strongest — barriers removed and documented
                      </td>
                    </tr>
                    <tr>
                      <th
                        scope="row"
                        className="px-4 py-3 font-medium text-slate-900 dark:text-white"
                      >
                        Benefit to disabled users
                      </th>
                      <td className="px-4 py-3">
                        Little; widgets can conflict with assistive tech users
                        already have configured
                      </td>
                      <td className="px-4 py-3">Real and permanent</td>
                      <td className="px-4 py-3">Real, permanent, verified</td>
                    </tr>
                    <tr>
                      <th
                        scope="row"
                        className="px-4 py-3 font-medium text-slate-900 dark:text-white"
                      >
                        Long-term value
                      </th>
                      <td className="px-4 py-3">
                        None retained if you cancel the subscription
                      </td>
                      <td className="px-4 py-3">
                        Compounds — fixed components stay fixed
                      </td>
                      <td className="px-4 py-3">
                        Compounds, plus VPAT/ACR evidence for procurement
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Migration path */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-3">
                <Wrench className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                A Practical Migration Path Off an Overlay
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You do not need to do everything at once. A realistic
                  sequence for most teams looks like this:
                </p>
              </div>
              <ul className="space-y-3 text-muted-foreground leading-relaxed list-disc pl-6">
                <li>
                  <strong className="text-slate-900 dark:text-white">
                    Week 1:
                  </strong>{" "}
                  Confirm what is installed with the{" "}
                  <Link
                    href="/tools/overlay-detector"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    overlay detector
                  </Link>
                  , check your contract&apos;s renewal date and cancellation
                  terms, and run a baseline automated scan.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">
                    Weeks 2–4:
                  </strong>{" "}
                  Commission a professional{" "}
                  <Link
                    href="/services/accessibility-audits"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    accessibility audit
                  </Link>{" "}
                  covering your key user journeys, tested with the overlay
                  disabled so findings map to your real code.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">
                    Months 1–3:
                  </strong>{" "}
                  Remediate in priority order — critical keyboard and form
                  barriers first, then names/labels/alt text, then contrast and
                  structure. Fix shared components before individual pages.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">
                    Ongoing:
                  </strong>{" "}
                  Add axe-core checks to CI, remove the overlay script (check
                  tag managers and CMS plugins), publish an accessibility
                  statement, and schedule periodic re-audits.
                </li>
              </ul>
            </div>
          </section>

          {/* CTA */}
          <section className="py-12 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <div className="rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20 p-8 text-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  Find Out What Your Overlay Is Hiding
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6 max-w-lg mx-auto">
                  Scan any URL with our free overlay detector to identify the
                  installed widget and surface the WCAG violations that remain
                  underneath it.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button asChild size="lg" className="gap-2">
                    <Link href="/tools/overlay-detector">
                      Run the Overlay Detector
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="gap-2">
                    <Link href="/services/remediation-support">
                      Get Remediation Support
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
                content="accessibility overlay alternative audit remediation wcag compliance testing"
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
