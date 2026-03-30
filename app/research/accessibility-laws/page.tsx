import type { Metadata } from "next"
import Link from "next/link"
import { ArticleStructuredData, BreadcrumbStructuredData, DatasetStructuredData } from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"
import { lawsSummary } from "@/lib/data/accessibility-laws"
import { AccessibilityLawsClient } from "./AccessibilityLawsClient"

export const metadata: Metadata = {
  title: "Accessibility Laws by Jurisdiction | Global Legal Tracker 2026 | Accessibility.build",
  description:
    "Track 50+ accessibility laws across 35+ jurisdictions worldwide. Compare WCAG requirements, penalties, and enforcement timelines. Covers ADA Title II April 2026 deadline, European Accessibility Act, Section 508, and more.",
  keywords: [
    "accessibility laws",
    "ada compliance",
    "european accessibility act",
    "wcag legal requirements",
    "section 508",
    "ada title ii deadline",
    "web accessibility regulations",
    "accessibility penalties",
    "global accessibility laws",
    "accessibility compliance requirements",
  ],
  alternates: {
    canonical: "https://accessibility.build/research/accessibility-laws",
  },
  openGraph: {
    title: "Accessibility Laws by Jurisdiction | Global Legal Tracker 2026 | Accessibility.build",
    description:
      "Track 50+ accessibility laws across 35+ jurisdictions worldwide. Compare WCAG requirements, penalties, and enforcement timelines. Covers ADA Title II April 2026 deadline, European Accessibility Act, Section 508, and more.",
    url: "https://accessibility.build/research/accessibility-laws",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Accessibility Laws by Jurisdiction | Global Legal Tracker 2026",
    description:
      "Track 50+ accessibility laws across 35+ jurisdictions. Compare WCAG requirements, penalties, and enforcement. ADA Title II deadline April 2026.",
  },
}

export default function AccessibilityLawsPage() {
  return (
    <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "Research", url: "https://accessibility.build/research" },
          {
            name: "Accessibility Laws",
            url: "https://accessibility.build/research/accessibility-laws",
          },
        ]}
      />

      <ArticleStructuredData
        headline="Accessibility Laws by Jurisdiction | Global Legal Tracker 2026"
        description="Comprehensive database of 50+ accessibility laws across 35+ jurisdictions worldwide. Track WCAG requirements, penalties, enforcement timelines, and compliance deadlines."
        author={{ name: "Accessibility.build Research", url: "https://accessibility.build" }}
        publisher={{
          name: "Accessibility.build",
          logo: "https://accessibility.build/android-chrome-512x512.png",
        }}
        datePublished="2026-03-15"
        dateModified="2026-03-30"
        image="https://accessibility.build/og-image.png"
        url="https://accessibility.build/research/accessibility-laws"
        wordCount={4000}
        keywords={[
          "accessibility laws",
          "ada compliance",
          "european accessibility act",
          "wcag legal requirements",
          "section 508",
          "global accessibility regulations",
        ]}
      />

      <DatasetStructuredData
        name="Global Accessibility Laws Dataset 2026"
        description="Structured dataset of 50+ accessibility laws and regulations across 35+ jurisdictions worldwide, including WCAG requirements, penalties, enforcement mechanisms, and compliance deadlines."
        url="https://accessibility.build/research/accessibility-laws"
        datePublished="2026-03-15"
        dateModified="2026-03-30"
        creator={{ name: "Accessibility.build", url: "https://accessibility.build" }}
        temporalCoverage="1959/2026"
        keywords={[
          "accessibility laws",
          "wcag requirements",
          "ada compliance",
          "european accessibility act",
          "section 508",
          "global accessibility regulations",
        ]}
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
              <span className="text-slate-500 dark:text-slate-500">Research</span>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <span className="font-medium text-slate-900 dark:text-white" aria-current="page">
                Accessibility Laws
              </span>
            </li>
          </ol>
        </div>
      </nav>

      {/* Hero Section with Server-Rendered Stats for SEO */}
      <header className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-4xl">
            <p className="text-blue-300 font-semibold text-sm tracking-wider uppercase mb-4">
              Research Report &bull; Updated March 2026 &bull; 35+ Jurisdictions
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Accessibility Laws{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                by Jurisdiction
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl">
              Comprehensive database of global accessibility laws and regulations. Compare WCAG
              requirements, penalties, enforcement mechanisms, and compliance deadlines across
              jurisdictions worldwide.
            </p>
          </div>

          {/* Server-rendered key stats for SEO crawlers */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <p className="text-slate-400 text-sm font-medium mb-1">Laws Tracked</p>
              <p className="text-3xl md:text-4xl font-bold text-white">
                {lawsSummary.totalLawsTracked}+
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <p className="text-slate-400 text-sm font-medium mb-1">Jurisdictions</p>
              <p className="text-3xl md:text-4xl font-bold text-white">
                {lawsSummary.totalJurisdictions}+
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <p className="text-slate-400 text-sm font-medium mb-1">ADA Title II Deadline</p>
              <p className="text-xl md:text-2xl font-bold text-white">
                {lawsSummary.nextMajorDeadline}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <p className="text-slate-400 text-sm font-medium mb-1">Max Federal Penalty</p>
              <p className="text-3xl md:text-4xl font-bold text-white">
                {lawsSummary.maxFederalPenalty}
              </p>
            </div>
          </div>

          {/* Critical Deadline Alert */}
          <div className="mt-8 bg-red-500/15 border border-red-400/30 rounded-xl p-5">
            <p className="text-red-200 font-semibold text-sm">
              <span className="uppercase tracking-wider">CRITICAL DEADLINE:</span>{" "}
              ADA Title II compliance required by April 24, 2026 for state and local government
              websites serving 50,000+ people.
            </p>
          </div>
        </div>
      </header>

      {/* Interactive Client Component */}
      <main>
        <AccessibilityLawsClient />
      </main>

      {/* FAQ Section with Schema.org Microdata for SEO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-10 text-center">
          Frequently Asked Questions
        </h2>
        <div
          className="max-w-3xl mx-auto space-y-6"
          itemScope
          itemType="https://schema.org/FAQPage"
        >
          <div
            className="border border-slate-200 dark:border-slate-700 rounded-lg p-6"
            itemScope
            itemProp="mainEntity"
            itemType="https://schema.org/Question"
          >
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2" itemProp="name">
              Is web accessibility legally required?
            </h3>
            <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
              <p className="text-slate-600 dark:text-slate-400" itemProp="text">
                Yes, web accessibility is legally required in many jurisdictions worldwide. In the
                United States, the ADA, Section 508, and numerous state laws mandate digital
                accessibility for public and private sector organizations. The European Accessibility
                Act (EAA) requires compliance across all EU member states by June 2025, affecting
                products and services sold in the European market.
              </p>
            </div>
          </div>

          <div
            className="border border-slate-200 dark:border-slate-700 rounded-lg p-6"
            itemScope
            itemProp="mainEntity"
            itemType="https://schema.org/Question"
          >
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2" itemProp="name">
              Which WCAG version do I need to comply with?
            </h3>
            <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
              <p className="text-slate-600 dark:text-slate-400" itemProp="text">
                Most current laws reference WCAG 2.1 Level AA as the minimum standard. The US
                ADA Title II rule explicitly requires WCAG 2.1 AA for state and local government
                websites. The European Accessibility Act references EN 301 549, which aligns with
                WCAG 2.1 AA. Some jurisdictions are beginning to reference WCAG 2.2, published in
                October 2023.
              </p>
            </div>
          </div>

          <div
            className="border border-slate-200 dark:border-slate-700 rounded-lg p-6"
            itemScope
            itemProp="mainEntity"
            itemType="https://schema.org/Question"
          >
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2" itemProp="name">
              What are the penalties for non-compliance?
            </h3>
            <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
              <p className="text-slate-600 dark:text-slate-400" itemProp="text">
                Penalties vary significantly by jurisdiction. Under US federal law, first-time ADA
                violations can result in civil penalties up to $75,000, with subsequent violations
                reaching $150,000. Private lawsuits can add attorney fees and damages. In the EU,
                member states set their own penalties for EAA non-compliance, with some countries
                imposing fines up to 5% of annual turnover.
              </p>
            </div>
          </div>

          <div
            className="border border-slate-200 dark:border-slate-700 rounded-lg p-6"
            itemScope
            itemProp="mainEntity"
            itemType="https://schema.org/Question"
          >
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2" itemProp="name">
              Does the European Accessibility Act apply to my business?
            </h3>
            <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
              <p className="text-slate-600 dark:text-slate-400" itemProp="text">
                The European Accessibility Act applies to products and services placed on the EU
                market, including e-commerce websites, banking services, e-books, and transportation
                services. It applies to businesses of all sizes except micro-enterprises (fewer than
                10 employees and under 2 million EUR turnover). Non-EU companies selling into the EU
                market are also subject to its requirements.
              </p>
            </div>
          </div>

          <div
            className="border border-slate-200 dark:border-slate-700 rounded-lg p-6"
            itemScope
            itemProp="mainEntity"
            itemType="https://schema.org/Question"
          >
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2" itemProp="name">
              What is the ADA Title II April 2026 deadline?
            </h3>
            <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
              <p className="text-slate-600 dark:text-slate-400" itemProp="text">
                The ADA Title II final rule, published April 24, 2024, requires state and local
                government entities with populations of 50,000 or more to make their websites and
                mobile apps conform to WCAG 2.1 Level AA by April 24, 2026. Smaller entities have
                until April 24, 2027. This is the first time the DOJ has codified specific technical
                standards for web accessibility under the ADA.
              </p>
            </div>
          </div>

          <div
            className="border border-slate-200 dark:border-slate-700 rounded-lg p-6"
            itemScope
            itemProp="mainEntity"
            itemType="https://schema.org/Question"
          >
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2" itemProp="name">
              How do US state laws differ from federal requirements?
            </h3>
            <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
              <p className="text-slate-600 dark:text-slate-400" itemProp="text">
                Several US states have enacted accessibility laws that go beyond federal requirements.
                California&apos;s Unruh Civil Rights Act allows statutory damages of $4,000 per
                violation. New York requires state agency websites to meet WCAG standards, and
                Colorado&apos;s HB21-1110 mandates accessibility for state and local government
                technology. These state laws often provide additional private rights of action not
                available under Section 508.
              </p>
            </div>
          </div>

          <div
            className="border border-slate-200 dark:border-slate-700 rounded-lg p-6"
            itemScope
            itemProp="mainEntity"
            itemType="https://schema.org/Question"
          >
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2" itemProp="name">
              Which countries have web accessibility laws?
            </h3>
            <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
              <p className="text-slate-600 dark:text-slate-400" itemProp="text">
                Over 35 countries and jurisdictions have enacted web accessibility legislation. Major
                examples include the United States (ADA, Section 508), Canada (ACA, AODA), all 27 EU
                member states (European Accessibility Act), the United Kingdom (Equality Act 2010),
                Australia (Disability Discrimination Act), Japan (JIS X 8341-3), Israel (Equal Rights
                for Persons with Disabilities), and South Korea (Act on Welfare of Persons with
                Disabilities).
              </p>
            </div>
          </div>

          <div
            className="border border-slate-200 dark:border-slate-700 rounded-lg p-6"
            itemScope
            itemProp="mainEntity"
            itemType="https://schema.org/Question"
          >
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2" itemProp="name">
              What is the difference between Section 508 and ADA?
            </h3>
            <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
              <p className="text-slate-600 dark:text-slate-400" itemProp="text">
                Section 508 of the Rehabilitation Act specifically requires federal agencies and
                contractors to make their electronic and information technology accessible, referencing
                WCAG 2.0 Level AA standards. The ADA is broader in scope, applying to state and local
                governments (Title II) and private businesses open to the public (Title III), but
                historically lacked specific technical standards until the 2024 Title II rulemaking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-20">
        <RelatedContent
          content="accessibility laws global regulations WCAG compliance ADA Section 508 European Accessibility Act legal requirements"
          title="Related Resources"
          maxItems={3}
        />
      </section>
    </div>
  )
}
