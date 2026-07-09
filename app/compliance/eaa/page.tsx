import type { Metadata } from "next"
import Link from "next/link"
import {
  ArticleStructuredData,
  FAQStructuredData,
  BreadcrumbStructuredData,
} from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"

const pageTitle = "European Accessibility Act (EAA): Compliance Guide"

export const metadata: Metadata = {
  title: pageTitle,
  description:
    "What the European Accessibility Act requires, who must comply, the June 28, 2025 deadline, the 2030 service transition, EN 301 549, penalties by member state, and practical compliance steps.",
  keywords: [
    "european accessibility act",
    "EAA compliance",
    "EAA requirements",
    "directive 2019/882",
    "EAA deadline June 2025",
    "EAA e-commerce",
    "EAA US companies",
    "EN 301 549",
    "EAA penalties",
    "EAA micro-enterprise exemption",
  ],
  alternates: {
    canonical: "/compliance/eaa",
  },
  openGraph: {
    title: pageTitle,
    description:
      "Who the EAA applies to, what it requires, the June 28, 2025 application date, EN 301 549 and WCAG 2.1 AA, enforcement, and practical compliance steps.",
    url: "/compliance/eaa",
    type: "article",
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
      "The EAA applies to e-commerce, banking, e-books and more sold in the EU — including by non-EU companies. Requirements, deadlines, penalties, and compliance steps.",
    images: [`/api/og?title=${encodeURIComponent(pageTitle)}&section=Compliance`],
  },
}

const faqs = [
  {
    question: "Does the European Accessibility Act apply to US companies?",
    answer:
      "Yes, if they sell covered products or services into the EU market. The EAA applies based on where the product or service is offered, not where the company is established. A US e-commerce site that ships to EU consumers, a US SaaS company with EU customers for a covered service, or a US publisher selling e-books in the EU all fall within scope. Non-EU companies typically meet the requirements through an EU-based importer, distributor, or authorized representative for products, and directly for services. If you deliberately target EU consumers — EU shipping, euro pricing, EU-language storefronts — you should assume the EAA applies.",
  },
  {
    question: "What is the difference between the EAA and the ADA?",
    answer:
      "The ADA is a US civil-rights law enforced largely through private lawsuits, and it did not historically name a specific technical standard for most websites. The EAA is an EU product-and-service regulation enforced by government market surveillance authorities in each member state, with a defined technical route to compliance: conformity with the harmonized standard EN 301 549, which incorporates WCAG 2.1 Level AA for web content. The EAA also covers things the ADA does not spell out, such as accessibility of packaging, instructions, support channels, and a public accessibility statement describing how the service meets the requirements.",
  },
  {
    question: "What does the EAA actually require for a website or app?",
    answer:
      "Covered services must be perceivable, operable, understandable, and robust — the same four principles as WCAG. In practice, conformance with EN 301 549 (which incorporates WCAG 2.1 Level AA for web content and adds requirements for software, documents, and support services) gives a presumption of conformity. Beyond the interface itself, the EAA requires accessible information about the service, an explanation of how the accessibility requirements are met (usually published in an accessibility statement), and accessible customer support and feedback channels.",
  },
  {
    question: "What are the EAA deadlines?",
    answer:
      "The core application date was June 28, 2025: products placed on the EU market and services provided to consumers from that date must comply. Two transition rules soften the edge: service contracts concluded before June 28, 2025 may run unchanged until they expire, but no later than June 28, 2030; and self-service terminals (ATMs, ticketing machines, check-in kiosks) lawfully in use before that date may continue in service until the end of their economically useful life, capped at 20 years. New websites, apps, and services launched after June 28, 2025 get no transition period.",
  },
  {
    question: "Are small businesses exempt from the EAA?",
    answer:
      "Only micro-enterprises providing services are exempt — defined as fewer than 10 employees AND annual turnover or balance sheet total not exceeding EUR 2 million. Both conditions must be met. Micro-enterprises that manufacture, import, or distribute covered products are not exempt from the substantive requirements, though they benefit from lighter documentation obligations. Small and medium-sized enterprises above the micro threshold must comply in full. Note that the exemption is per legal entity in the relevant member state's implementation, and member states may still encourage voluntary compliance.",
  },
  {
    question: "What are the penalties for EAA non-compliance?",
    answer:
      "Penalties are set by each member state, not by the directive itself, so they vary widely. The directive requires penalties to be effective, proportionate, and dissuasive. Examples from national implementing laws include fines reaching tens of thousands of euros per infringement in Ireland (up to EUR 60,000 and potential criminal liability for serious cases) and administrative fines up to EUR 100,000 in Germany. Beyond fines, market surveillance authorities can order corrective action, restrict or prohibit a product or service on the market, and require withdrawal — and consumers and disability organizations can lodge complaints or take action under national law.",
  },
  {
    question: "Is WCAG 2.1 AA conformance enough for EAA compliance?",
    answer:
      "It covers the largest part for websites and apps, but not everything. WCAG 2.1 AA maps to the web chapter of EN 301 549, and meeting it addresses the core interface requirements. The EAA additionally expects accessible non-web documents, accessible support and communication channels, information about the accessibility of the service (usually an accessibility statement), and — for products — accessible packaging, instructions, and labeling. Treat WCAG 2.1 AA as the necessary foundation and EN 301 549 plus the EAA's service-information duties as the complete picture. Auditing against WCAG 2.2 AA is a sensible way to stay ahead of standard updates.",
  },
  {
    question: "Which sectors does the EAA cover?",
    answer:
      "Services: e-commerce (any website or app selling to EU consumers), consumer banking and financial services, electronic communications, access to audiovisual media services, e-books and dedicated reading software, and elements of air, bus, rail, and waterborne passenger transport (websites, apps, e-ticketing, real-time travel information). Products: consumer computers and operating systems, smartphones and tablets, self-service terminals (ATMs, payment terminals, ticketing and check-in machines), e-readers, and TV equipment with digital services. If your service lets EU consumers conclude a contract online, e-commerce coverage almost certainly reaches you.",
  },
]

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Compliance", url: "https://accessibility.build/compliance" },
  {
    name: "European Accessibility Act",
    url: "https://accessibility.build/compliance/eaa",
  },
]

const coveredServices = [
  {
    sector: "E-commerce",
    examples: "Online shops, marketplaces, booking flows, checkout, account management",
  },
  {
    sector: "Consumer banking",
    examples: "Online banking, payment services, credit agreements, identification methods",
  },
  {
    sector: "Electronic communications",
    examples: "Phone, messaging, and VoIP services and their apps",
  },
  {
    sector: "Audiovisual media access",
    examples: "Streaming platforms' apps, EPGs, and websites providing access to content",
  },
  {
    sector: "E-books",
    examples: "E-book files and the dedicated software used to read them",
  },
  {
    sector: "Passenger transport",
    examples: "Air, bus, rail, and waterborne transport websites, apps, e-tickets, travel info",
  },
]

const penaltyExamples = [
  {
    state: "Ireland",
    regime: "Fines up to EUR 60,000 and potential criminal liability for serious offences",
  },
  {
    state: "Germany",
    regime: "Administrative fines up to EUR 100,000 under the BFSG",
  },
  {
    state: "France",
    regime: "Administrative fines per infringement, with separate penalties for missing accessibility statements",
  },
  {
    state: "All member states",
    regime: "Corrective orders, market restrictions, and product/service withdrawal by surveillance authorities",
  },
]

const complianceSteps = [
  {
    name: "Confirm whether you are in scope",
    text: "Map your products and services against the EAA's covered categories, check the micro-enterprise exemption, and identify every EU member state where you sell.",
  },
  {
    name: "Audit against EN 301 549 / WCAG 2.1 AA",
    text: "Run a full accessibility audit of websites, apps, documents, and support channels against EN 301 549, which incorporates WCAG 2.1 Level AA for web content.",
  },
  {
    name: "Remediate prioritized barriers",
    text: "Fix blocking issues in core user journeys first — checkout, login, forms, payment — then work through remaining WCAG 2.1 AA failures.",
  },
  {
    name: "Publish an accessibility statement",
    text: "Document how your service meets the accessibility requirements, in a public, accessible format, as the EAA's service-information duty requires.",
  },
  {
    name: "Set up accessible support and feedback channels",
    text: "Ensure customer support, contact methods, and complaint routes are themselves accessible and can handle accessibility feedback.",
  },
  {
    name: "Build monitoring into your release process",
    text: "Add automated and manual accessibility checks to CI and design reviews so new releases do not reintroduce barriers.",
  },
]

export default function EAACompliancePage() {
  return (
    <>
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />
      <ArticleStructuredData
        headline="European Accessibility Act (EAA): Compliance Guide"
        description="What the European Accessibility Act (Directive (EU) 2019/882) requires, who must comply, the June 28, 2025 application date, EN 301 549 and WCAG 2.1 AA, enforcement, penalties, and practical compliance steps."
        author={{
          name: "Accessibility.build Editorial",
          url: "https://accessibility.build/about",
        }}
        publisher={{
          name: "Accessibility.build",
          logo: "https://accessibility.build/android-chrome-512x512.png",
        }}
        datePublished="2026-07-09"
        dateModified="2026-07-09"
        image="https://accessibility.build/og-image.png"
        url="https://accessibility.build/compliance/eaa"
        wordCount={2600}
        keywords={[
          "european accessibility act",
          "EAA compliance",
          "directive 2019/882",
          "EN 301 549",
          "WCAG 2.1 AA",
        ]}
      />
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
                  <Link href="/compliance" className="hover:text-blue-600 transition-colors">
                    Compliance
                  </Link>
                </li>
                <li aria-hidden="true" className="text-slate-400">/</li>
                <li>
                  <span className="text-slate-900 dark:text-white font-medium">
                    European Accessibility Act
                  </span>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <header className="mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-200 text-xs font-semibold uppercase tracking-wide mb-5">
              <span aria-hidden="true">●</span>
              Compliance Guide · Updated July 2026
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-6 leading-tight">
              European Accessibility Act (EAA) Compliance Guide
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              The European Accessibility Act — Directive (EU) 2019/882 — is the
              EU&apos;s single biggest expansion of digital accessibility law
              into the private sector. It took effect for new products and
              services on June 28, 2025, covers e-commerce, banking, e-books,
              transport, and consumer devices, and reaches any company selling
              into the EU market — including companies based outside the EU.
            </p>
          </header>

          <div
            className="rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-5 mb-12"
            role="note"
          >
            <p className="text-sm text-amber-900 dark:text-amber-200 leading-relaxed">
              <strong>Not legal advice.</strong> This guide is educational
              information about the European Accessibility Act, not legal
              advice. EAA obligations depend on each member state&apos;s
              national implementing law and your specific products and
              services. Consult a qualified lawyer in the relevant jurisdiction
              before making compliance decisions.
            </p>
          </div>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              The EAA at a glance
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Legal instrument</p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  Directive (EU) 2019/882, adopted April 17, 2019
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Application date</p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  June 28, 2025 for new products and services
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Technical standard</p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  <Link href="/compliance/en-301-549" className="text-blue-600 dark:text-blue-400 hover:underline">
                    EN 301 549
                  </Link>
                  , incorporating WCAG 2.1 AA for web
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Enforcement</p>
                <p className="font-semibold text-slate-900 dark:text-white">
                  National market surveillance authorities in all 27 member states
                </p>
              </div>
            </div>
          </section>

          <section className="prose prose-slate dark:prose-invert max-w-none mb-12">
            <h2>What the European Accessibility Act is</h2>
            <p>
              The EAA is an EU directive that harmonizes accessibility
              requirements for a defined list of products and services across
              the single market. Unlike the earlier Web Accessibility Directive,
              which covered only public-sector websites and apps, the EAA
              targets <strong>private businesses</strong>. Each member state
              transposed the directive into national law (the deadline for
              transposition was June 28, 2022), so in practice you comply with
              27 national laws that share the directive&apos;s common core.
            </p>
            <p>
              The directive is built on the EU&apos;s internal-market logic: a
              product or service that meets the harmonized requirements can
              circulate in every member state without meeting 27 different
              national accessibility rules. For businesses, that cuts both
              ways — one standard to meet, but 27 national enforcement regimes
              if you miss it.
            </p>

            <h2>Who the EAA applies to</h2>
            <p>
              The EAA applies to <strong>economic operators</strong> —
              manufacturers, importers, distributors, and service providers —
              that place covered products on the EU market or provide covered
              services to EU consumers. Where the company is headquartered does
              not matter; what matters is whether the product or service is
              offered in the EU.
            </p>
          </section>

          <section className="mb-12">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              Covered services
            </h3>
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-sm">
                <thead className="bg-slate-100 dark:bg-slate-800">
                  <tr>
                    <th scope="col" className="text-left p-4 font-semibold">Sector</th>
                    <th scope="col" className="text-left p-4 font-semibold">What it covers</th>
                  </tr>
                </thead>
                <tbody>
                  {coveredServices.map((row) => (
                    <tr key={row.sector} className="border-t border-slate-200 dark:border-slate-800">
                      <th scope="row" className="text-left p-4 font-medium text-slate-900 dark:text-white whitespace-nowrap align-top">
                        {row.sector}
                      </th>
                      <td className="p-4 text-slate-600 dark:text-slate-400">
                        {row.examples}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-4">
              Covered <strong>products</strong> include consumer computers and
              operating systems, smartphones, tablets, e-readers, TV equipment
              with digital services, and self-service terminals such as ATMs,
              payment terminals, and ticketing or check-in machines.
            </p>
          </section>

          <section className="prose prose-slate dark:prose-invert max-w-none mb-12">
            <h3>Exemptions and limits</h3>
            <ul>
              <li>
                <strong>Micro-enterprise exemption (services only).</strong>{" "}
                Service providers with fewer than 10 employees{" "}
                <em>and</em> annual turnover or balance sheet total not
                exceeding EUR 2 million are exempt from the service
                requirements. Micro-enterprises dealing in covered products are
                not exempt, though they face lighter documentation duties.
              </li>
              <li>
                <strong>Disproportionate burden.</strong> An operator may limit
                compliance where meeting a requirement would impose a
                disproportionate burden, assessed against the criteria in Annex
                VI of the directive. The assessment must be documented, kept
                for inspection, and redone when the service changes or an
                authority asks — it is a narrow, evidence-based escape valve,
                not a general opt-out.
              </li>
              <li>
                <strong>Fundamental alteration.</strong> Requirements do not
                apply where they would require a fundamental alteration in the
                basic nature of the product or service.
              </li>
            </ul>

            <h2>Key dates and the 2030 transition</h2>
            <ul>
              <li>
                <strong>April 17, 2019</strong> — Directive (EU) 2019/882
                adopted.
              </li>
              <li>
                <strong>June 28, 2022</strong> — deadline for member states to
                transpose the directive into national law.
              </li>
              <li>
                <strong>June 28, 2025</strong> — the EAA applies: products
                placed on the market and services provided to consumers from
                this date must comply.
              </li>
              <li>
                <strong>Until June 28, 2030</strong> — service contracts
                concluded before June 28, 2025 may continue unchanged until
                they expire, but no later than this date.
              </li>
              <li>
                <strong>Self-service terminals</strong> — terminals lawfully in
                use before June 28, 2025 may remain in service until the end of
                their economically useful life, capped at 20 years.
              </li>
            </ul>
            <p>
              The transition rules are narrower than many teams assume: they
              protect <em>pre-existing contracts and installed terminals</em>,
              not websites or apps. A consumer-facing website or app operating
              after June 28, 2025 is expected to comply now.
            </p>

            <h2>EN 301 549 and WCAG 2.1 AA</h2>
            <p>
              The EAA states functional accessibility requirements rather than
              naming a web standard directly. Conformity is presumed when you
              meet harmonized standards referenced in the Official Journal of
              the EU — and for ICT, that standard is{" "}
              <Link href="/compliance/en-301-549">EN 301 549</Link>. Its web
              chapter incorporates{" "}
              <Link href="/wcag">WCAG 2.1 Level A and AA</Link> success
              criteria, so for websites and apps, WCAG 2.1 AA conformance is
              the practical technical baseline. EN 301 549 goes further than
              WCAG alone: it also covers non-web documents, software,
              hardware, and support services.
            </p>
            <p>
              Because WCAG 2.2 added criteria on top of 2.1 (published October
              2023), auditing against{" "}
              <Link href="/checklists/wcag-2-2">WCAG 2.2 AA</Link> is a
              sensible way to meet today&apos;s baseline with headroom as
              standards and national guidance evolve.
            </p>

            <h2>Enforcement: how the EAA is policed</h2>
            <p>
              Unlike the lawsuit-driven enforcement model of the US ADA (see
              our{" "}
              <Link href="/research/accessibility-lawsuits">
                accessibility lawsuit tracker
              </Link>
              ), the EAA is enforced by government authorities. Each member
              state designates <strong>market surveillance authorities</strong>{" "}
              for products and authorities responsible for checking service
              compliance. They can demand documentation, order corrective
              action, restrict or withdraw non-compliant products and
              services, and impose penalties under national law. Consumers and
              disability organizations can also lodge complaints and, in many
              member states, take action before courts or administrative
              bodies.
            </p>
          </section>

          <section className="mb-12">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              Penalties: set nationally, and they vary
            </h3>
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-sm">
                <thead className="bg-slate-100 dark:bg-slate-800">
                  <tr>
                    <th scope="col" className="text-left p-4 font-semibold">Member state</th>
                    <th scope="col" className="text-left p-4 font-semibold">Example penalty regime</th>
                  </tr>
                </thead>
                <tbody>
                  {penaltyExamples.map((row) => (
                    <tr key={row.state} className="border-t border-slate-200 dark:border-slate-800">
                      <th scope="row" className="text-left p-4 font-medium text-slate-900 dark:text-white whitespace-nowrap align-top">
                        {row.state}
                      </th>
                      <td className="p-4 text-slate-600 dark:text-slate-400">
                        {row.regime}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
              Indicative examples from national implementing laws; exact
              amounts and mechanisms vary and change. See our{" "}
              <Link href="/research/accessibility-laws" className="text-blue-600 dark:text-blue-400 hover:underline">
                global accessibility laws tracker
              </Link>{" "}
              for jurisdiction-by-jurisdiction detail.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Practical compliance steps
            </h2>
            <ol className="space-y-4">
              {complianceSteps.map((step, index) => (
                <li
                  key={step.name}
                  className="flex gap-4 rounded-xl border border-slate-200 dark:border-slate-800 p-5"
                >
                  <span
                    aria-hidden="true"
                    className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm"
                  >
                    {index + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                      {step.name}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                      {step.text}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="mb-16">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                Get ahead of EAA enforcement
              </h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Audit your site against WCAG 2.1/2.2 AA, generate the
                accessibility statement the EAA expects, and fix barriers
                before an authority — or a customer complaint — finds them.
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
                  href="/tools/accessibility-statement-generator"
                  className="inline-flex items-center px-5 py-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg font-medium border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  Accessibility Statement Generator
                </Link>
              </div>
            </div>
          </section>

          <section className="mb-12">
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

          <section className="mb-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              Keep exploring
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <li>
                <Link href="/compliance" className="text-blue-600 dark:text-blue-400 hover:underline">
                  All compliance guides by jurisdiction
                </Link>
              </li>
              <li>
                <Link href="/compliance/en-301-549" className="text-blue-600 dark:text-blue-400 hover:underline">
                  EN 301 549: the EAA&apos;s technical standard
                </Link>
              </li>
              <li>
                <Link href="/research/accessibility-laws" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Global accessibility laws tracker
                </Link>
              </li>
              <li>
                <Link href="/research/accessibility-lawsuits" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Accessibility lawsuit tracker
                </Link>
              </li>
              <li>
                <Link href="/checklists/wcag-2-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                  WCAG 2.2 compliance checklist
                </Link>
              </li>
              <li>
                <Link href="/wcag" className="text-blue-600 dark:text-blue-400 hover:underline">
                  WCAG success criteria explained
                </Link>
              </li>
            </ul>
          </section>
        </article>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <RelatedContent
            content="european accessibility act EAA compliance EN 301 549 WCAG 2.1 AA EU accessibility law e-commerce banking audit"
            maxItems={6}
          />
        </section>
      </div>
    </>
  )
}
