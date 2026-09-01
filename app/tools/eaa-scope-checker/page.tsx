import type { Metadata } from "next"
import Link from "next/link"
import EaaScopeChecker from "@/components/tools/eaa-scope-checker"
import {
  AccessibilityToolStructuredData,
  BreadcrumbStructuredData,
  FAQStructuredData,
} from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"
import { clampDescription } from "@/lib/metadata"

const ogTitle = encodeURIComponent("EAA Scope Checker: Does the Act Apply to You?")

export const metadata: Metadata = {
  title: "EAA Scope Checker: Does the Act Apply to You?",
  description:
    clampDescription("Free interactive checker for the European Accessibility Act. Answer four questions about your customers, sector, and size to see whether the EAA likely applies to your business."),
  keywords: [
    "eaa scope checker",
    "does the european accessibility act apply to me",
    "eaa applicability",
    "european accessibility act scope",
    "eaa microenterprise exemption",
    "eaa e-commerce",
    "is my website covered by the eaa",
    "eaa compliance checker",
  ],
  alternates: {
    canonical: "/tools/eaa-scope-checker",
  },
  openGraph: {
    title: "EAA Scope Checker: Does the Act Apply to You?",
    description:
      "Answer four questions to see whether the European Accessibility Act likely applies to your business, including the microenterprise exemption and the e-commerce net.",
    url: "/tools/eaa-scope-checker",
    type: "website",
    images: [
      {
        url: `/api/og?title=${ogTitle}&section=Tools`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EAA Scope Checker",
    description:
      "Four questions to see whether the European Accessibility Act likely applies to your business.",
    images: [
      {
        url: `/api/og?title=${ogTitle}&section=Tools`,
        width: 1200,
        height: 630,
      },
    ],
  },
}

const faqs = [
  {
    question: "Who does the European Accessibility Act apply to?",
    answer:
      "The EAA applies to businesses that place covered products on the EU market or provide covered services to consumers in the EU, wherever the business itself is established. The named service categories include e-commerce, consumer banking, e-books, passenger transport, electronic communications, and access to audiovisual media services; covered products include computers, smartphones, self-service terminals, and e-readers. The obligations have applied since 28 June 2025.",
  },
  {
    question: "Does the EAA apply to companies outside the EU?",
    answer:
      "Yes. The test is where your consumers are, not where you are. A UK, US, or any other non-EU company selling covered products or services to consumers in the EU is in scope for those products and services. This is why many British and American e-commerce businesses are affected despite the UK and US not being member states.",
  },
  {
    question: "What is the EAA microenterprise exemption?",
    answer:
      "Service-provider microenterprises, meaning fewer than 10 employees and an annual turnover or balance sheet total not exceeding 2 million euro, are exempt from the EAA service requirements. Both conditions must hold. Microenterprises dealing with covered products get lighter documentation duties rather than a full exemption, and any business relying on the exemption should be able to show documentation supporting it.",
  },
  {
    question: "Is an ordinary online shop really covered by the EAA?",
    answer:
      "Usually yes. E-commerce services are a named category, and it is the broadest one: if consumers in the EU can buy from you through a website or app, that sales journey is an e-commerce service under the Act, even if your core trade is not otherwise on the list. Purely informational sites with no consumer transactions are the typical genuinely out-of-scope case.",
  },
  {
    question: "What do I have to do if the EAA applies to me?",
    answer:
      "Meet the accessibility requirements for your product or service, provide the required accessibility information, and be able to demonstrate conformity. The practical technical route is EN 301 549, the harmonised European standard, which incorporates WCAG at Level AA for web content and apps. An audit against WCAG 2.2 AA tells you where you stand today, and an accessibility statement covers the information requirement.",
  },
  {
    question: "Does this checker store my answers?",
    answer:
      "No. The checker runs entirely in your browser. Nothing you select is stored, transmitted, or logged, and there is no account or email gate.",
  },
]

export default function EaaScopeCheckerPage() {
  return (
    <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "Tools", url: "https://accessibility.build/tools" },
          { name: "EAA Scope Checker", url: "https://accessibility.build/tools/eaa-scope-checker" },
        ]}
      />
      <FAQStructuredData faqs={faqs} />
      <AccessibilityToolStructuredData
        name="EAA Scope Checker"
        description="Interactive checker that indicates whether the European Accessibility Act likely applies to a business, based on EU consumer nexus, covered categories, and the microenterprise exemption."
        url="https://accessibility.build/tools/eaa-scope-checker"
        applicationCategory="AccessibilityApplication"
        operatingSystem="Web Browser"
        offers={{ price: "0", priceCurrency: "USD" }}
        accessibilityFeatures={["keyboardNavigation", "screenReaderSupport", "highContrastDisplay"]}
      />

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
              <Link href="/tools" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Tools
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <span className="font-medium text-slate-900 dark:text-white" aria-current="page">
                EAA Scope Checker
              </span>
            </li>
          </ol>
        </div>
      </nav>

      {/* Hero */}
      <header className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
          <div className="max-w-3xl">
            <p className="text-blue-300 font-semibold text-sm tracking-wider uppercase mb-4">
              Free Tool &bull; European Accessibility Act
            </p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Does the EAA{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                apply to you?
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl">
              The European Accessibility Act has applied since 28 June 2025, and the sanctions are
              real: Ireland enforces it with criminal penalties. Answer four questions about your
              customers, sector, and size to see where you likely stand. Nothing you enter leaves
              your browser.
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="max-w-3xl mx-auto space-y-14">
          <EaaScopeChecker />

          {/* Supporting content */}
          <section aria-labelledby="how-it-works-heading">
            <h2 id="how-it-works-heading" className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              How this checker decides
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              The questions mirror the structure of Directive (EU) 2019/882 itself. First, the
              consumer nexus: the Act protects consumers in the EU, wherever the trader is
              established. Second, the covered categories: the Directive names specific products
              and services rather than covering every website, but the e-commerce category
              catches any consumer sales journey. Third, the microenterprise exemption for
              service providers, which requires both the headcount and the turnover condition.
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              The result is deliberately phrased as likely or unlikely. Scope edge cases, such as
              mixed B2B and consumer offerings or the transitional rules for pre-2025 service
              contracts and terminals, deserve legal advice. For the legislative detail, see our{" "}
              <Link href="/research/european-accessibility-act" className="text-blue-600 dark:text-blue-400 hover:underline">
                EAA tracker
              </Link>{" "}
              with every statutory date quoted from the Directive, the{" "}
              <Link href="/compliance/eaa" className="text-blue-600 dark:text-blue-400 hover:underline">
                EAA compliance guide
              </Link>
              , and the{" "}
              <Link href="/compliance/eaa-ireland" className="text-blue-600 dark:text-blue-400 hover:underline">
                Ireland-specific enforcement picture
              </Link>
              .
            </p>
          </section>

          <section aria-labelledby="next-steps-heading">
            <h2 id="next-steps-heading" className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              If you are in scope, what next
            </h2>
            <ol className="space-y-3 text-slate-600 dark:text-slate-400 leading-relaxed list-decimal pl-5">
              <li>
                Find out where you stand: a{" "}
                <Link href="/services/accessibility-audits" className="text-blue-600 dark:text-blue-400 hover:underline">
                  fixed-price WCAG 2.2 AA audit
                </Link>{" "}
                establishes your baseline against the standard the EAA is measured with. See a{" "}
                <Link href="/sample-audit-report" className="text-blue-600 dark:text-blue-400 hover:underline">
                  sample report
                </Link>{" "}
                first.
              </li>
              <li>
                Understand the technical standard:{" "}
                <Link href="/compliance/en-301-549" className="text-blue-600 dark:text-blue-400 hover:underline">
                  EN 301 549 explained
                </Link>
                , and track your work with the{" "}
                <Link href="/checklists/wcag-2-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                  WCAG 2.2 checklist
                </Link>
                .
              </li>
              <li>
                Publish the required accessibility information:{" "}
                <Link href="/guides/how-to-write-an-accessibility-statement" className="text-blue-600 dark:text-blue-400 hover:underline">
                  write an accessibility statement
                </Link>{" "}
                or generate one with the{" "}
                <Link href="/tools/accessibility-statement-generator" className="text-blue-600 dark:text-blue-400 hover:underline">
                  free statement generator
                </Link>
                .
              </li>
              <li>
                Do not reach for an overlay widget:{" "}
                <Link href="/guides/accessibility-overlays-eu-uk-law" className="text-blue-600 dark:text-blue-400 hover:underline">
                  overlays do not satisfy the EAA
                </Link>
                .
              </li>
            </ol>
          </section>

          {/* FAQ */}
          <section aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {faqs.map((faq) => (
                <div key={faq.question} className="border border-slate-200 dark:border-slate-700 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Disclaimer */}
          <section aria-label="Disclaimer">
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Educational Tool, Not Legal Advice
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                This checker gives a structured indication based on the Directive&apos;s scope
                rules. It cannot account for every business model, national transposition detail,
                or transitional arrangement. For a decision you intend to rely on, consult a
                lawyer familiar with the European Accessibility Act and the member states you
                sell into.
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Related Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-20">
        <RelatedContent
          content="European Accessibility Act scope EAA compliance checker e-commerce microenterprise exemption EN 301 549 WCAG"
          title="Related Resources"
          maxItems={3}
        />
      </section>
    </div>
  )
}
