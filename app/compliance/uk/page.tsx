import type { Metadata } from "next"
import Link from "next/link"
import { BreadcrumbStructuredData, FAQStructuredData } from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"
import { PageByline } from "@/components/seo/page-byline"

const ogTitle = encodeURIComponent("UK Website Accessibility Law: Equality Act & PSBAR")

export const metadata: Metadata = {
  title: "UK Website Accessibility Law: Equality Act & PSBAR",
  description:
    "How the Equality Act 2010 and PSBAR apply to websites: anticipatory reasonable adjustments, WCAG 2.2 AA, GDS monitoring, and practical steps.",
  keywords: [
    "uk website accessibility law",
    "equality act 2010 website accessibility",
    "psbar",
    "public sector bodies accessibility regulations",
    "wcag uk law",
    "reasonable adjustments website",
    "web accessibility uk requirements",
  ],
  alternates: {
    canonical: "/compliance/uk",
  },
  openGraph: {
    title: "UK Website Accessibility Law: Equality Act & PSBAR",
    description:
      "How the Equality Act 2010 and PSBAR apply to websites: anticipatory reasonable adjustments, WCAG 2.2 AA, GDS monitoring, and practical steps.",
    url: "/compliance/uk",
    type: "article",
    images: [
      {
        url: `/api/og?title=${ogTitle}&section=Compliance`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "UK Website Accessibility Law: Equality Act & PSBAR",
    description:
      "The Equality Act's anticipatory reasonable adjustments duty, PSBAR's public sector rules, and where UK accessibility pressure actually comes from.",
    images: [
      {
        url: `/api/og?title=${ogTitle}&section=Compliance`,
        width: 1200,
        height: 630,
      },
    ],
  },
}

const faqs = [
  {
    question: "Is web accessibility legally required in the UK?",
    answer:
      "Yes. The Equality Act 2010 is the anti-discrimination law for England, Wales, and Scotland (Northern Ireland uses the Disability Discrimination Act 1995). Section 29 prohibits discrimination in the provision of services, and section 20 imposes a duty to make reasonable adjustments for disabled people. For service providers that duty is anticipatory: you must plan adjustments for disabled people generally, in advance, rather than waiting for an individual to be locked out and complain. A website that a business uses to deliver its services falls within this framework. Public sector bodies face an additional, more prescriptive regime under PSBAR, the Public Sector Bodies (Websites and Mobile Applications) (No. 2) Accessibility Regulations 2018.",
  },
  {
    question: "What accessibility standard does UK law require?",
    answer:
      "The Equality Act names no technical standard for websites. It is outcome-based: the question is whether disabled people can actually access the service. In practice, WCAG 2.2 Level AA (previously 2.1 AA) is the de facto benchmark used by courts, regulators, and the public sector. Under PSBAR, the Government Digital Service now monitors public sector websites against WCAG 2.2 AA. For private organisations, conforming to WCAG 2.2 AA is the most reliable way to evidence that the reasonable adjustments duty has been met.",
  },
  {
    question: "What is PSBAR and who does it apply to?",
    answer:
      "PSBAR is the Public Sector Bodies (Websites and Mobile Applications) (No. 2) Accessibility Regulations 2018 (SI 2018/952). It applies to public sector bodies and requires their websites and mobile apps to be perceivable, operable, understandable, and robust (the WCAG principles), to publish an accessibility statement in the model format, and to keep it under review. The Government Digital Service monitors compliance and now tests against WCAG 2.2 AA, with complaints escalating to the Equality and Human Rights Commission in Great Britain or the Equality Commission for Northern Ireland. The compliance deadlines are long past (23 September 2020 for existing websites, 23 June 2021 for mobile apps), so PSBAR is fully in force. It also reaches private suppliers indirectly: companies selling digital products or services to the public sector face accessibility requirements in procurement.",
  },
  {
    question: "Can I be sued in the UK for an inaccessible website?",
    answer:
      "Yes. Individuals bring Equality Act claims in the County Court in England and Wales or the Sheriff Court in Scotland. Remedies include compensation, which can cover injury to feelings, plus injunctions requiring the barriers to be fixed, and the Equality and Human Rights Commission has its own enforcement powers. There is no statutory per-violation damages figure like California's $4,000 minimum, and no ADA-style wave of court filings. Most UK matters settle privately before reaching a courtroom, which is why reported case law is thin. That does not mean the risk is low: the UK is a major venue for accessibility pressure through complaints and settlements rather than litigation counts.",
  },
  {
    question: "Does the European Accessibility Act apply to UK businesses?",
    answer:
      "Not domestically in Great Britain: post-Brexit, the European Accessibility Act does not apply inside GB. But UK businesses selling to consumers in the EU are in scope for those services, and the EAA applies from 28 June 2025. A UK retailer or SaaS company serving EU customers therefore needs to meet EAA requirements for that part of its business even though no UK statute demands it. The Northern Ireland position under the Windsor Framework is nuanced: NI businesses trading in goods with the EU face additional considerations and should take specific advice.",
  },
  {
    question: "Do accessibility overlays satisfy the Equality Act?",
    answer:
      "No. The Equality Act duty is about actual access: can disabled people use the service or not. Overlay widgets sit on top of a page and leave the underlying barriers in the code, so screen reader users, keyboard users, and others still hit the same problems. Bolting on a widget does not discharge an anticipatory duty to plan accessible services in advance; remediation at the code level, measured against WCAG 2.2 AA, does. Our accessibility overlays guide covers why these tools fall short in detail.",
  },
  {
    question: "What changed in August 2026?",
    answer:
      "A new statutory Code of Practice for Services, Public Functions and Associations under the Equality Act came into force on 5 August 2026, replacing the 2011 code. It is statutory guidance that courts must consider, and it covers the reasonable adjustments duty that underpins digital accessibility claims. Organisations relying on assumptions formed under the old code should review their approach against the current one.",
  },
]

export default function UKCompliancePage() {
  return (
    <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "Compliance", url: "https://accessibility.build/compliance" },
          { name: "United Kingdom", url: "https://accessibility.build/compliance/uk" },
        ]}
      />
      <FAQStructuredData faqs={faqs} />

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
              <Link href="/compliance" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Compliance
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <span className="font-medium text-slate-900 dark:text-white" aria-current="page">
                United Kingdom
              </span>
            </li>
          </ol>
        </div>
      </nav>

      {/* Hero */}
      <header className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-4xl">
            <p className="text-blue-300 font-semibold text-sm tracking-wider uppercase mb-4">
              Compliance Guide &bull; United Kingdom
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              UK Website Accessibility Law:{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                Equality Act &amp; PSBAR
              </span>
            </h1>
            <PageByline route="/compliance/uk" className="mb-5" />
            <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl">
              No UK statute names WCAG for private websites, yet the legal duty is real and it is
              anticipatory. The Equality Act 2010 expects service providers to plan reasonable
              adjustments for disabled people in advance, and the public sector is tested against
              WCAG 2.2 AA under PSBAR. Most UK accessibility pressure arrives as complaints and
              settlements, not court filings.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <p className="text-slate-400 text-sm font-medium mb-1">Reasonable Adjustments</p>
              <p className="text-2xl md:text-3xl font-bold text-white">Anticipatory</p>
              <p className="text-slate-400 text-xs mt-1">Planned in advance, not per request</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <p className="text-slate-400 text-sm font-medium mb-1">Named Technical Standard</p>
              <p className="text-2xl md:text-3xl font-bold text-white">None</p>
              <p className="text-slate-400 text-xs mt-1">WCAG 2.2 AA is the de facto benchmark</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <p className="text-slate-400 text-sm font-medium mb-1">New Services Code</p>
              <p className="text-2xl md:text-3xl font-bold text-white">5 Aug 2026</p>
              <p className="text-slate-400 text-xs mt-1">Statutory Code of Practice in force</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <p className="text-slate-400 text-sm font-medium mb-1">GDS Monitoring Standard</p>
              <p className="text-2xl md:text-3xl font-bold text-white">WCAG 2.2 AA</p>
              <p className="text-slate-400 text-xs mt-1">PSBAR public sector testing</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="max-w-3xl mx-auto space-y-16">
          {/* Equality Act */}
          <section aria-labelledby="equality-act-heading">
            <h2 id="equality-act-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              The Equality Act 2010 and Websites
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              The Equality Act 2010 is the anti-discrimination law covering England, Wales, and
              Scotland; Northern Ireland relies on the Disability Discrimination Act 1995 instead.
              Two provisions do the work for websites. Section 29 prohibits discrimination in the
              provision of services. Section 20 sets the duty to make reasonable adjustments, and
              for service providers that duty is <strong>anticipatory</strong>: you must plan
              adjustments for disabled people generally, in advance, rather than reacting after an
              individual has already been excluded.
            </p>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              That anticipatory framing matters more than any technical rule. A business cannot
              wait for a blind customer to complain that the checkout is unusable with a screen
              reader; the duty exists before any specific customer arrives. An inaccessible website
              is, in effect, a failure to make adjustments that should already have been made.
            </p>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              The Act names no technical standard for websites. It is outcome-based: the legal
              question is whether disabled people can access the service, not whether a checklist
              was completed. In practice, <strong>WCAG 2.2 Level AA</strong> (previously 2.1 AA) is
              the de facto benchmark used by courts, regulators, and the public sector, so it is
              the sensible target for any UK organisation. Our{" "}
              <Link href="/guides/wcag-2-2-aa-requirements" className="text-blue-600 dark:text-blue-400 hover:underline">
                WCAG 2.2 AA requirements guide
              </Link>{" "}
              explains what the standard actually asks for.
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              The surrounding guidance was refreshed recently: a new statutory Code of Practice for
              Services, Public Functions and Associations came into force on 5 August 2026,
              replacing the 2011 code. Courts must consider it, and it covers the reasonable
              adjustments duty that underpins digital accessibility claims.
            </p>
          </section>

          {/* Reasonable adjustments in practice */}
          <section aria-labelledby="adjustments-heading">
            <h2 id="adjustments-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              What Reasonable Adjustments Mean for a Website in Practice
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              Because the Act is outcome-based, &ldquo;reasonable adjustments&rdquo; for a website
              translate into removing the barriers that stop disabled people completing real tasks:
              reading content, navigating, filling in forms, and paying. In practical terms that
              means the things WCAG 2.2 AA measures:
            </p>
            <ul className="space-y-3 text-slate-600 dark:text-slate-400 leading-relaxed list-disc pl-5 mb-4">
              <li>
                <strong>Screen reader compatibility:</strong> meaningful alternative text, labelled
                form fields and buttons, and a heading structure that makes sense when heard rather
                than seen.
              </li>
              <li>
                <strong>Keyboard access:</strong> every interactive element reachable and operable
                without a mouse, with a visible focus indicator.
              </li>
              <li>
                <strong>Readable content:</strong> sufficient colour contrast, text that can be
                resized, and layouts that do not break when it is.
              </li>
              <li>
                <strong>Robust code:</strong> markup that assistive technologies can interpret
                reliably across browsers and devices.
              </li>
            </ul>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              The anticipatory duty means these belong in your build and procurement processes, not
              in a reactive fix-on-complaint queue. Working through our{" "}
              <Link href="/checklists/wcag-2-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                WCAG 2.2 checklist
              </Link>{" "}
              is a concrete way to turn the abstract duty into a task list.
            </p>
          </section>

          {/* PSBAR */}
          <section aria-labelledby="psbar-heading">
            <h2 id="psbar-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              PSBAR: The Public Sector Regime
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              For the public sector, the UK does have a prescriptive regime: the Public Sector
              Bodies (Websites and Mobile Applications) (No. 2) Accessibility Regulations 2018
              (SI 2018/952), usually shortened to PSBAR. It requires public sector websites and
              mobile apps to be <strong>perceivable, operable, understandable, and robust</strong>,
              the four WCAG principles, and adds two administrative obligations: publishing an
              accessibility statement in the model format, and keeping it under review.
            </p>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              Compliance is actively monitored by the Government Digital Service (GDS), whose
              monitoring now tests against <strong>WCAG 2.2 AA</strong>. Complaints escalate to the
              Equality and Human Rights Commission in Great Britain or the Equality Commission for
              Northern Ireland. The deadlines are long past: existing websites had to comply by
              23 September 2020 and mobile apps by 23 June 2021, so PSBAR is fully in force with no
              transition period left.
            </p>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              PSBAR also reaches beyond the public sector itself. Private companies selling digital
              products or services to public bodies face accessibility requirements in procurement,
              so a supplier whose product fails WCAG can lose bids even though PSBAR never names
              them directly.
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              The accessibility statement requirement trips up many teams because the model format
              is specific about structure and content. Our guide on{" "}
              <Link href="/guides/how-to-write-an-accessibility-statement" className="text-blue-600 dark:text-blue-400 hover:underline">
                how to write an accessibility statement
              </Link>{" "}
              walks through what a compliant statement needs to say.
            </p>
          </section>

          {/* Private sector pressure */}
          <section aria-labelledby="pressure-heading">
            <h2 id="pressure-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              Private Companies: Where UK Legal Pressure Actually Comes From
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              The UK does not look like the United States. There is no statutory per-violation
              damages figure like California&apos;s, and no ADA-style wave of federal filings.
              Individuals bring Equality Act claims in the County Court in England and Wales or the
              Sheriff Court in Scotland, where remedies include compensation, including for injury
              to feelings, plus injunctions. The Equality and Human Rights Commission (EHRC) holds
              its own enforcement powers on top of individual claims.
            </p>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              In practice, most UK matters settle privately, which is exactly why reported case law
              is thin. A complaint letter citing the Equality Act, followed by a negotiated
              settlement and a remediation commitment, is the typical shape of UK enforcement. The
              UK is a major venue for accessibility pressure through complaints and settlements
              rather than litigation counts, so the absence of headline lawsuits should not be read
              as an absence of risk.
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Commercial pressure compounds the legal kind: public sector procurement pushes WCAG
              requirements onto suppliers, and large private buyers increasingly copy the practice.
              For how the UK regime compares with other jurisdictions, see our{" "}
              <Link href="/research/accessibility-laws" className="text-blue-600 dark:text-blue-400 hover:underline">
                accessibility laws tracker
              </Link>
              .
            </p>
          </section>

          {/* EAA */}
          <section aria-labelledby="eaa-heading">
            <h2 id="eaa-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              UK Businesses and the European Accessibility Act
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              Post-Brexit, the{" "}
              <Link href="/compliance/eaa" className="text-blue-600 dark:text-blue-400 hover:underline">
                European Accessibility Act
              </Link>{" "}
              does not apply domestically inside Great Britain. But UK businesses{" "}
              <strong>selling to consumers in the EU</strong> are in scope for those services, and
              the EAA applies from 28 June 2025. A UK e-commerce site shipping to EU customers, or
              a UK SaaS product sold to EU consumers, needs to meet EAA requirements for that part
              of the business, typically evidenced through{" "}
              <Link href="/compliance/en-301-549" className="text-blue-600 dark:text-blue-400 hover:underline">
                EN 301 549
              </Link>
              , the European standard that maps onto WCAG.
            </p>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              The Northern Ireland position under the Windsor Framework is nuanced: NI businesses
              trading in goods with the EU face additional considerations and should take specific
              legal advice rather than assuming the GB position applies.
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Many UK companies feel the EAA first through their Irish operations or customers; our{" "}
              <Link href="/compliance/eaa-ireland" className="text-blue-600 dark:text-blue-400 hover:underline">
                EAA in Ireland guide
              </Link>{" "}
              covers how the directive lands in the nearest EU market.
            </p>
          </section>

          {/* Practical steps */}
          <section aria-labelledby="steps-heading">
            <h2 id="steps-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              Practical Steps for UK Organisations
            </h2>
            <ol className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed list-decimal pl-5">
              <li>
                <strong className="text-slate-900 dark:text-white">Adopt WCAG 2.2 AA as your target.</strong>{" "}
                The Equality Act names no standard, but WCAG 2.2 AA is what courts, regulators, and
                GDS measure against, so conforming to it is the most defensible position for both
                private and public sector organisations.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Audit your key user journeys.</strong>{" "}
                An anticipatory duty means finding barriers before your users do. Our fixed-price{" "}
                <Link href="/services/accessibility-audits" className="text-blue-600 dark:text-blue-400 hover:underline">
                  WCAG 2.2 AA audits
                </Link>{" "}
                start at $950 and combine automated, manual, and screen reader testing; the{" "}
                <Link href="/sample-audit-report" className="text-blue-600 dark:text-blue-400 hover:underline">
                  sample audit report
                </Link>{" "}
                shows exactly what you would receive.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Publish an accessibility statement.</strong>{" "}
                Mandatory for public sector bodies under PSBAR, and good practice for everyone else
                because it evidences the anticipatory planning the Act expects. Our{" "}
                <Link href="/tools/accessibility-statement-generator" className="text-blue-600 dark:text-blue-400 hover:underline">
                  accessibility statement generator
                </Link>{" "}
                produces a solid starting point in minutes.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Fix barriers in the code, not with a widget.</strong>{" "}
                Overlay tools leave the underlying barriers in place, and the Equality Act cares
                about actual access. Our{" "}
                <Link href="/guides/accessibility-overlays" className="text-blue-600 dark:text-blue-400 hover:underline">
                  accessibility overlays guide
                </Link>{" "}
                explains why they fall short.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Set up a working complaints route.</strong>{" "}
                Most UK enforcement starts with a complaint. Make sure accessibility feedback
                reaches someone empowered to act quickly; a fast, genuine response often resolves
                matters before they become legal ones.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Check your EU exposure.</strong>{" "}
                If you sell to consumers in the EU, the European Accessibility Act applies to those
                services from 28 June 2025 regardless of your UK compliance position, so scope that
                work alongside your Equality Act efforts.
              </li>
            </ol>
          </section>

          {/* FAQ */}
          <section aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-10">
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
                Educational Content, Not Legal Advice
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                This page is provided for general educational purposes only and does not constitute
                legal advice. UK accessibility law, including how the Equality Act&apos;s reasonable
                adjustments duty applies to websites and how the new statutory Code of Practice is
                interpreted, continues to evolve. For advice about your specific situation, consult
                a solicitor experienced in discrimination and accessibility law.
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Related Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-20">
        <RelatedContent
          content="UK Equality Act website accessibility PSBAR public sector WCAG reasonable adjustments compliance law"
          title="Related Resources"
          maxItems={3}
        />
      </section>
    </div>
  )
}
