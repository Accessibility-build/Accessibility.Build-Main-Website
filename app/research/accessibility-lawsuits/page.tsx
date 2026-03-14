import type { Metadata } from "next"
import Link from "next/link"
import { ArticleStructuredData, BreadcrumbStructuredData } from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"
import { lawsuitSummary } from "@/lib/data/lawsuit-statistics"
import { LawsuitTrackerClient } from "./LawsuitTrackerClient"

export const metadata: Metadata = {
  title: "Accessibility Lawsuit Tracker 2026 | ADA & Digital Accessibility Litigation Data",
  description:
    "Comprehensive data on web accessibility lawsuits in the United States. Track trends by year, industry, state, and settlement costs. Updated annually.",
  keywords: [
    "accessibility lawsuits",
    "ada lawsuit tracker",
    "web accessibility litigation",
    "ada compliance lawsuits",
    "accessibility lawsuit statistics",
    "digital accessibility legal",
    "ada title iii lawsuits",
    "accessibility settlement costs",
  ],
  alternates: {
    canonical: "https://accessibility.build/research/accessibility-lawsuits",
  },
  openGraph: {
    title: "Accessibility Lawsuit Tracker 2026 | ADA & Digital Accessibility Litigation Data",
    description:
      "Comprehensive data on web accessibility lawsuits in the United States. Track trends by year, industry, state, and settlement costs. Updated annually.",
    url: "https://accessibility.build/research/accessibility-lawsuits",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Accessibility Lawsuit Tracker 2026",
    description:
      "Comprehensive data on web accessibility lawsuits in the United States. Track trends by year, industry, state, and settlement costs.",
  },
}

export default function AccessibilityLawsuitsPage() {
  return (
    <div className="min-h-screen pt-24 bg-white dark:bg-slate-950">
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "Research", url: "https://accessibility.build/research" },
          {
            name: "Accessibility Lawsuit Tracker",
            url: "https://accessibility.build/research/accessibility-lawsuits",
          },
        ]}
      />

      <ArticleStructuredData
        headline="Accessibility Lawsuit Tracker 2026 | ADA & Digital Accessibility Litigation Data"
        description="Comprehensive data on web accessibility lawsuits in the United States. Track trends by year, industry, state, and settlement costs."
        author={{ name: "Accessibility.build Research", url: "https://accessibility.build" }}
        publisher={{
          name: "Accessibility.build",
          logo: "https://accessibility.build/android-chrome-512x512.png",
        }}
        datePublished="2026-01-15"
        dateModified="2026-03-01"
        image="https://accessibility.build/og-image.png"
        url="https://accessibility.build/research/accessibility-lawsuits"
        wordCount={3500}
        keywords={[
          "accessibility lawsuits",
          "ada lawsuit tracker",
          "web accessibility litigation",
          "ada title iii lawsuits",
          "accessibility settlement costs",
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
                Accessibility Lawsuit Tracker
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
              Research & Data
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Accessibility Lawsuit{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                Tracker 2026
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl">
              Comprehensive data on ADA and digital accessibility lawsuits filed in the United
              States. Track litigation trends by year, industry, state, and settlement costs.
            </p>
          </div>

          {/* Server-rendered key stats for SEO crawlers */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <p className="text-slate-400 text-sm font-medium mb-1">Total Lawsuits (2018-2025)</p>
              <p className="text-3xl md:text-4xl font-bold text-white">
                {lawsuitSummary.totalLawsuitsFiled.toLocaleString()}+
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <p className="text-slate-400 text-sm font-medium mb-1">2025 Federal Lawsuits</p>
              <p className="text-3xl md:text-4xl font-bold text-white">
                {lawsuitSummary.latestYearTotal.toLocaleString()}
              </p>
              <p className="text-red-300 text-xs mt-1">
                {lawsuitSummary.yearOverYearChange > 0 ? '+' : ''}{lawsuitSummary.yearOverYearChange}% vs 2024
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <p className="text-slate-400 text-sm font-medium mb-1">Average Settlement</p>
              <p className="text-3xl md:text-4xl font-bold text-white">
                ${lawsuitSummary.averageSettlement.toLocaleString()}
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <p className="text-slate-400 text-sm font-medium mb-1">Most Targeted Industry</p>
              <p className="text-xl md:text-2xl font-bold text-white">
                {lawsuitSummary.mostTargetedIndustry}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Interactive Client Component */}
      <main>
        <LawsuitTrackerClient />
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
              How many accessibility lawsuits are filed each year?
            </h3>
            <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
              <p className="text-slate-600 dark:text-slate-400" itemProp="text">
                In 2025, over 5,000 federal ADA digital accessibility lawsuits were filed
                in the United States. This number has fluctuated between 2,200 and 5,000 annually
                since 2018, with 2025 seeing a dramatic surge. Additionally, thousands of demand letters
                are sent each year that never result in formal litigation.
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
              Which industries are most targeted by accessibility lawsuits?
            </h3>
            <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
              <p className="text-slate-600 dark:text-slate-400" itemProp="text">
                E-Commerce and Retail businesses are the most targeted industry, accounting for
                approximately 69% of all digital accessibility lawsuits. Food and Beverage companies
                are the second most targeted at 21%, followed by Entertainment (2.5%), Travel and
                Hospitality (1.8%), and Banking and Finance (1.5%).
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
              How much does an accessibility lawsuit cost to settle?
            </h3>
            <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
              <p className="text-slate-600 dark:text-slate-400" itemProp="text">
                Settlement costs vary widely. Demand letter settlements typically range from $1,000
                to $25,000. Out-of-court settlements average around $25,000 but can reach $100,000.
                Court judgments average $75,000 and class action settlements can exceed $6 million.
                Even defending a lawsuit with no damages typically costs $5,000 to $100,000 in legal
                fees.
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
              Does the ADA apply to websites?
            </h3>
            <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
              <p className="text-slate-600 dark:text-slate-400" itemProp="text">
                While the ADA does not explicitly mention websites, multiple federal courts have
                ruled that websites of businesses open to the public are subject to ADA Title III
                requirements. The landmark Robles v. Domino's Pizza case in the 9th Circuit
                established that the ADA applies to websites and mobile apps. However, a circuit
                split exists, as the 11th Circuit ruled differently in Gil v. Winn-Dixie.
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
              Which states have the most accessibility lawsuits?
            </h3>
            <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
              <p className="text-slate-600 dark:text-slate-400" itemProp="text">
                New York leads the nation by a wide margin with approximately 1,750 federal accessibility
                lawsuits filed annually, driven in part by proactive plaintiff attorneys and
                favorable state laws. Florida surged to second place with approximately 1,100 cases, followed
                by California with 950. New York also leads in per capita lawsuit rates at 8.9 per
                100,000 residents.
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
              How can businesses protect themselves from accessibility lawsuits?
            </h3>
            <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
              <p className="text-slate-600 dark:text-slate-400" itemProp="text">
                The best protection against accessibility lawsuits is proactive WCAG 2.2 Level AA
                compliance. Businesses should conduct regular accessibility audits, implement
                automated and manual testing, train development teams on accessible coding
                practices, publish an accessibility statement, and establish a process for receiving
                and addressing accessibility feedback. An ongoing accessibility program is far less
                expensive than litigation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-20">
        <RelatedContent
          content="accessibility lawsuits ADA compliance WCAG audit legal requirements digital accessibility litigation"
          title="Related Resources"
          maxItems={3}
        />
      </section>
    </div>
  )
}
