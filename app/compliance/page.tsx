import type { Metadata } from "next"
import Link from "next/link"
import {
  FAQStructuredData,
  BreadcrumbStructuredData,
} from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"

const pageTitle = "Accessibility Compliance Guides: ADA, EAA, 508"

export const metadata: Metadata = {
  title: pageTitle,
  description:
    "Plain-English guides to web accessibility law: the ADA, European Accessibility Act, Section 508, EN 301 549, and California and New York state requirements — deadlines, standards, penalties.",
  keywords: [
    "accessibility compliance",
    "web accessibility laws",
    "ADA compliance guide",
    "european accessibility act",
    "section 508",
    "EN 301 549",
    "california accessibility law",
    "new york accessibility law",
    "WCAG legal requirements",
  ],
  alternates: {
    canonical: "/compliance",
  },
  openGraph: {
    title: pageTitle,
    description:
      "Jurisdiction-by-jurisdiction guides to accessibility law: ADA, EAA, Section 508, EN 301 549, California, and New York — what applies to you and what to do about it.",
    url: "/compliance",
    type: "website",
    siteName: "Accessibility.build",
    images: [
      {
        url: `/api/og?title=${encodeURIComponent(pageTitle)}&section=Compliance`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description:
      "Which accessibility laws apply to you? Guides to the ADA, EAA, Section 508, EN 301 549, and key US state laws — standards, deadlines, and penalties.",
    images: [`/api/og?title=${encodeURIComponent(pageTitle)}&section=Compliance`],
  },
}

const faqs = [
  {
    question: "Which accessibility law applies to my website?",
    answer:
      "Usually more than one. A US business open to the public falls under ADA Title III; if it has customers or operations in California or New York, state laws like the Unruh Act add statutory damages on top. Selling products or covered services to EU consumers brings the European Accessibility Act into play, and selling to the US federal government triggers Section 508 procurement requirements. The practical convergence point is WCAG: conforming to WCAG 2.1/2.2 Level AA addresses the technical core of every major regime at once.",
  },
  {
    question: "What technical standard should I build to?",
    answer:
      "WCAG 2.2 Level AA is the safest single target today. The DOJ's ADA Title II rule requires WCAG 2.1 AA, the EU's EN 301 549 incorporates WCAG 2.1 AA, and Section 508 formally requires WCAG 2.0 AA — and because WCAG 2.x versions are backwards-compatible, content that meets 2.2 AA satisfies all three baselines. Building to 2.2 AA also covers the criteria newer laws and procurement requirements are starting to reference.",
  },
  {
    question: "What is the difference between a law and a standard like EN 301 549 or WCAG?",
    answer:
      "Laws (the ADA, the European Accessibility Act, Section 508, state statutes) create the legal obligation and the enforcement mechanism — lawsuits, regulators, procurement rules. Standards (WCAG, EN 301 549) define the technical test for what 'accessible' means. Laws point at standards: the EAA points at EN 301 549, which points at WCAG 2.1 AA; the ADA Title II rule points directly at WCAG 2.1 AA. You comply with a law by conforming to the standard it references and meeting its process duties, such as accessibility statements and feedback channels.",
  },
  {
    question: "Where do I start if I'm not compliant with any of these?",
    answer:
      "Start with an audit of your highest-traffic user journeys against WCAG 2.2 AA — that tells you your real exposure under every regime at once. Fix blocking barriers in core flows first (navigation, forms, checkout, login), publish an accessibility statement, and add automated checks to your development pipeline so regressions get caught. Then work through the jurisdiction-specific duties — VPATs for federal sales, EAA service information for EU markets — from a foundation that is already solid.",
  },
]

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Compliance", url: "https://accessibility.build/compliance" },
]

const guides = [
  {
    href: "/compliance/ada",
    region: "United States",
    title: "ADA",
    subtitle: "Americans with Disabilities Act",
    description:
      "The US law behind thousands of website lawsuits a year. Titles II and III, the WCAG 2.1 AA rule for state and local governments, and what private businesses must do.",
    facts: ["Private lawsuits + DOJ enforcement", "Title II: WCAG 2.1 AA required"],
  },
  {
    href: "/compliance/section-508",
    region: "United States · Federal",
    title: "Section 508",
    subtitle: "Rehabilitation Act",
    description:
      "Binding on federal agencies and every vendor that sells them technology. The 2017 refresh, WCAG 2.0 AA baseline, and how VPATs and ACRs work in procurement.",
    facts: ["Federal agencies + vendors", "WCAG 2.0 AA baseline · VPAT/ACR"],
  },
  {
    href: "/compliance/eaa",
    region: "European Union",
    title: "EAA",
    subtitle: "European Accessibility Act",
    description:
      "The EU law covering e-commerce, banking, e-books, transport, and consumer devices — including non-EU companies selling into the EU. Applies since June 28, 2025.",
    facts: ["Applied June 28, 2025", "Reaches non-EU sellers"],
  },
  {
    href: "/compliance/en-301-549",
    region: "European Union · Standard",
    title: "EN 301 549",
    subtitle: "Harmonized ICT accessibility standard",
    description:
      "The technical standard behind EU accessibility law. Chapter structure for web, documents, and software, WCAG 2.1 AA incorporation, and version history.",
    facts: ["Incorporates WCAG 2.1 AA", "Presumption of conformity for EAA/WAD"],
  },
  {
    href: "/compliance/california",
    region: "United States · California",
    title: "California",
    subtitle: "Unruh Act & state requirements",
    description:
      "The most expensive US jurisdiction for accessibility claims: statutory damages of $4,000 minimum per violation under the Unruh Civil Rights Act, plus state-sector rules.",
    facts: ["$4,000 min. per violation", "Top litigation jurisdiction"],
  },
  {
    href: "/compliance/new-york",
    region: "United States · New York",
    title: "New York",
    subtitle: "State & city human rights laws",
    description:
      "The busiest venue for federal web accessibility filings, with state and city human rights laws that extend protections beyond the federal ADA baseline.",
    facts: ["Most federal filings of any state", "State + NYC human rights laws"],
  },
]

export default function ComplianceHubPage() {
  return (
    <>
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />
      <FAQStructuredData faqs={faqs} />

      <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
        <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <li>
                  <Link href="/" className="hover:text-blue-600 transition-colors">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true" className="text-slate-400">/</li>
                <li>
                  <span className="text-slate-900 dark:text-white font-medium">
                    Compliance
                  </span>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <header className="max-w-3xl mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-200 text-xs font-semibold uppercase tracking-wide mb-5">
              <span aria-hidden="true">●</span>
              Compliance Guides · Updated July 2026
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-6 leading-tight">
              Accessibility Compliance, Jurisdiction by Jurisdiction
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              Web accessibility is regulated by overlapping laws on both sides
              of the Atlantic — and most organizations answer to more than one.
              These guides explain each regime in plain English: who it
              applies to, which technical standard it references, how it is
              enforced, and what to do about it. The good news: they all
              converge on WCAG, so one solid remediation program addresses
              them together.
            </p>
          </header>

          <div
            className="max-w-3xl rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-5 mb-12"
            role="note"
          >
            <p className="text-sm text-amber-900 dark:text-amber-200 leading-relaxed">
              <strong>Not legal advice.</strong> These guides are educational
              information about accessibility laws and standards, not legal
              advice. Obligations depend on your jurisdiction, sector, and
              specific facts — consult a qualified lawyer before making
              compliance decisions.
            </p>
          </div>

          <section aria-labelledby="guides-heading" className="mb-16">
            <h2 id="guides-heading" className="sr-only">
              Compliance guides
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {guides.map((guide) => (
                <Link
                  key={guide.href}
                  href={guide.href}
                  className="group flex flex-col rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-md transition-all"
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
                    {guide.region}
                  </p>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {guide.title}
                  </h3>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">
                    {guide.subtitle}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4 flex-grow">
                    {guide.description}
                  </p>
                  <ul className="space-y-1.5 mb-4">
                    {guide.facts.map((fact) => (
                      <li
                        key={fact}
                        className="text-xs text-slate-500 dark:text-slate-400 flex items-start gap-2"
                      >
                        <span aria-hidden="true" className="text-blue-500 mt-0.5">
                          ✓
                        </span>
                        {fact}
                      </li>
                    ))}
                  </ul>
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    Read the guide{" "}
                    <span aria-hidden="true" className="inline-block group-hover:translate-x-0.5 transition-transform">
                      →
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </section>

          <section className="max-w-3xl mb-16">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              One standard underneath them all
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Every regime above ultimately points at the Web Content
              Accessibility Guidelines. The ADA Title II rule requires{" "}
              <Link href="/wcag" className="text-blue-600 dark:text-blue-400 hover:underline">
                WCAG
              </Link>{" "}
              2.1 AA, EN 301 549 incorporates WCAG 2.1 AA for the EU, and
              Section 508 incorporates WCAG 2.0 AA. Because WCAG versions are
              backwards-compatible, conforming to the{" "}
              <Link href="/checklists/wcag-2-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                WCAG 2.2 AA checklist
              </Link>{" "}
              puts you at or ahead of the technical baseline in every
              jurisdiction on this page.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              For the raw data behind these guides — statutes, penalties, and
              deadlines across 35+ jurisdictions, plus US litigation trends —
              see the{" "}
              <Link href="/research/accessibility-laws" className="text-blue-600 dark:text-blue-400 hover:underline">
                global accessibility laws tracker
              </Link>{" "}
              and the{" "}
              <Link href="/research/accessibility-lawsuits" className="text-blue-600 dark:text-blue-400 hover:underline">
                accessibility lawsuit tracker
              </Link>
              .
            </p>
          </section>

          <section className="mb-16">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-8 max-w-3xl">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                Find out where you stand
              </h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                A WCAG 2.2 AA audit tells you your exposure under every one of
                these laws at once — and gives you the remediation roadmap.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/services/accessibility-audits"
                  className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Professional Accessibility Audit
                </Link>
                <Link
                  href="/tools/url-accessibility-auditor"
                  className="inline-flex items-center px-5 py-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg font-medium border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  Scan Your Site Free
                </Link>
                <Link
                  href="/tools/ada-compliance-risks"
                  className="inline-flex items-center px-5 py-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg font-medium border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  ADA Risk Checker
                </Link>
              </div>
            </div>
          </section>

          <section className="max-w-3xl mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              Frequently asked questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6"
                >
                  <summary className="cursor-pointer text-lg font-semibold text-slate-900 dark:text-white list-none flex justify-between items-start gap-4">
                    <span>{faq.question}</span>
                    <span
                      aria-hidden="true"
                      className="text-slate-400 group-open:rotate-180 transition-transform flex-shrink-0"
                    >
                      ▾
                    </span>
                  </summary>
                  <p className="mt-4 text-slate-600 dark:text-slate-300 leading-relaxed">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>
        </div>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <RelatedContent
            content="accessibility compliance laws ADA EAA section 508 EN 301 549 WCAG legal requirements audit"
            maxItems={6}
          />
        </section>
      </div>
    </>
  )
}
