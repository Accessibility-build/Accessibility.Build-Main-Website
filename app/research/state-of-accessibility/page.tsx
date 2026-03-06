import type { Metadata } from "next"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { ArticleStructuredData, BreadcrumbStructuredData, FAQStructuredData } from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"
import { Badge } from "@/components/ui/badge"
import snapshotData from "@/lib/data/accessibility-snapshot.json"
import { StateOfAccessibilityClient } from "./StateOfAccessibilityClient"

export const metadata: Metadata = {
  title: "State of Web Accessibility 2026 | Research Report & Statistics",
  description:
    "Data-driven analysis of web accessibility across 1 million websites. Key findings on the most common WCAG violations, accessibility scores, and year-over-year trends.",
  keywords: [
    "state of web accessibility",
    "accessibility statistics",
    "web accessibility report",
    "wcag compliance statistics",
    "most common accessibility errors",
    "accessibility research data",
    "web accessibility trends",
  ],
  alternates: {
    canonical: "https://accessibility.build/research/state-of-accessibility",
  },
  openGraph: {
    title: "State of Web Accessibility 2026 | Research Report & Statistics",
    description:
      "Data-driven analysis of web accessibility across 1 million websites. Key findings on the most common WCAG violations, accessibility scores, and year-over-year trends.",
    url: "https://accessibility.build/research/state-of-accessibility",
    type: "article",
    publishedTime: "2026-02-15T00:00:00Z",
    modifiedTime: "2026-03-01T00:00:00Z",
    images: [
      {
        url: "https://accessibility.build/og-image.png",
        width: 1200,
        height: 630,
        alt: "State of Web Accessibility 2026 Report",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "State of Web Accessibility 2026 | Research Report & Statistics",
    description:
      "Data-driven analysis of web accessibility across 1 million websites.",
  },
}

const faqs = [
  {
    question: "What percentage of websites have accessibility errors?",
    answer:
      "According to the WebAIM Million 2025 analysis, 94.8% of the top 1 million homepages had detectable WCAG 2 failures. This means only about 5.2% of the most popular websites passed automated accessibility checks without any errors.",
  },
  {
    question: "What is the most common web accessibility error?",
    answer:
      "Low contrast text is the most common accessibility error, found on 79.1% of homepages analyzed. This violates WCAG Success Criterion 1.4.3 (Contrast Minimum) and makes text difficult or impossible to read for users with low vision or color vision deficiencies.",
  },
  {
    question: "How many accessibility errors does an average web page have?",
    answer:
      "The average web page has 51 detectable accessibility errors according to the WebAIM Million 2025 study. This number has fluctuated over the years, declining from 60.9 in 2020 to 50.0 in 2023, rising to 56.8 in 2024, then dropping to 51 in 2025.",
  },
  {
    question: "Which industries have the worst web accessibility?",
    answer:
      "Travel and e-commerce websites tend to have the worst accessibility scores, with average scores of 34 and 36 respectively, and error rates above 97%. Government and education websites generally perform best, with average scores of 56 and 53, likely due to legal requirements like Section 508.",
  },
  {
    question:
      "Is web accessibility improving over time?",
    answer:
      "Web accessibility is showing slow improvement in some metrics. The percentage of sites with errors has declined from 98.1% in 2020 to 94.8% in 2025. However, the average number of errors per page changed from 56.8 in 2024 to 51 in 2025, suggesting that efforts to reduce page complexity and improve accessibility may be gaining traction.",
  },
]

export default function StateOfAccessibilityPage() {
  return (
    <>
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "Research", url: "https://accessibility.build/research" },
          {
            name: "State of Web Accessibility",
            url: "https://accessibility.build/research/state-of-accessibility",
          },
        ]}
      />
      <ArticleStructuredData
        headline="State of Web Accessibility 2026 - Research Report & Statistics"
        description="Data-driven analysis of web accessibility across 1 million websites. Key findings on the most common WCAG violations, accessibility scores, and year-over-year trends."
        author={{ name: "Accessibility.build Research Team" }}
        publisher={{
          name: "Accessibility.build",
          logo: "https://accessibility.build/android-chrome-512x512.png",
        }}
        datePublished="2026-02-15"
        dateModified="2026-03-01"
        image="https://accessibility.build/og-image.png"
        url="https://accessibility.build/research/state-of-accessibility"
        wordCount={3500}
        keywords={[
          "web accessibility",
          "WCAG",
          "accessibility statistics",
          "accessibility report",
        ]}
      />
      <FAQStructuredData faqs={faqs} />

      <div className="min-h-screen bg-white dark:bg-gray-950">
        {/* Header */}
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <nav
              className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4"
              aria-label="Breadcrumb"
            >
              <Link
                href="/"
                className="hover:text-gray-700 dark:hover:text-gray-300"
              >
                Home
              </Link>
              <ChevronRight className="mx-2 h-4 w-4" />
              <Link
                href="/research"
                className="hover:text-gray-700 dark:hover:text-gray-300"
              >
                Research
              </Link>
              <ChevronRight className="mx-2 h-4 w-4" />
              <span className="text-gray-900 dark:text-white font-medium">
                State of Web Accessibility
              </span>
            </nav>

            <div className="flex flex-wrap gap-2 mb-4">
              <Badge
                variant="secondary"
                className="text-xs font-medium"
              >
                Research Report
              </Badge>
              <Badge
                variant="secondary"
                className="text-xs font-medium"
              >
                2026
              </Badge>
              <Badge
                variant="outline"
                className="text-xs font-medium"
              >
                Data Updated: Mar 2026
              </Badge>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
              State of Web Accessibility 2026
            </h1>

            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-6 max-w-3xl">
              A data-driven analysis of web accessibility across the top 1 million
              websites. Research compiled from WebAIM Million 2025, HTTP Archive, and
              industry reports.
            </p>

            {/* Key stat for SEO - visible server-rendered text */}
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4 max-w-2xl">
              <p className="text-red-800 dark:text-red-200 font-semibold text-base">
                94.8% of the top 1 million homepages have detectable WCAG
                failures, with an average of 51 accessibility errors per page.
              </p>
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                Source: WebAIM Million 2025 analysis of {snapshotData.keyFindings.totalSitesAnalyzed.toLocaleString()} homepages
              </p>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Server-rendered summary for SEO */}
          <section className="mb-12" aria-label="Report summary">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Executive Summary
            </h2>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                This report presents a comprehensive analysis of web accessibility
                across the internet, drawing from automated scans of the top 1
                million websites. The data reveals that the vast majority of
                websites continue to have significant accessibility barriers. Out
                of {snapshotData.keyFindings.totalSitesAnalyzed.toLocaleString()} sites
                analyzed, {snapshotData.keyFindings.percentWithErrors}% contained
                at least one detectable WCAG failure. The most prevalent issue
                remains low contrast text, affecting {snapshotData.topViolations[0].percentage}%
                of all pages tested. Only {snapshotData.scoreDistribution[4].percentage}%
                of sites achieved a score of 80 or above, which is considered a
                minimum threshold for reasonable accessibility.
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mt-4">
                Year-over-year data shows a slow but measurable decline in the
                percentage of sites with errors, from{" "}
                {snapshotData.yearOverYearTrends[1].percentWithErrors}% in 2020 to{" "}
                {snapshotData.yearOverYearTrends[6].percentWithErrors}% in 2025.
                However, the average number of errors per page has fluctuated, changing
                from {snapshotData.yearOverYearTrends[5].avgErrorsPerPage} in 2024
                to {snapshotData.yearOverYearTrends[6].avgErrorsPerPage} in 2025,
                suggesting that efforts to reduce page complexity and improve
                accessibility may be gaining traction.
              </p>
            </div>
          </section>

          {/* Interactive client component with all charts */}
          <StateOfAccessibilityClient initialData={snapshotData} />

          {/* FAQ Section with microdata */}
          <section className="mt-16 mb-12" aria-label="Frequently asked questions">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
              Frequently Asked Questions
            </h2>
            <div
              className="space-y-6"
              itemScope
              itemType="https://schema.org/FAQPage"
            >
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-6"
                  itemScope
                  itemProp="mainEntity"
                  itemType="https://schema.org/Question"
                >
                  <h3
                    className="text-lg font-semibold text-gray-900 dark:text-white mb-3"
                    itemProp="name"
                  >
                    {faq.question}
                  </h3>
                  <div
                    itemScope
                    itemProp="acceptedAnswer"
                    itemType="https://schema.org/Answer"
                  >
                    <p
                      className="text-gray-600 dark:text-gray-400 leading-relaxed"
                      itemProp="text"
                    >
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Related Content */}
          <RelatedContent
            content="web accessibility WCAG compliance testing audit checker statistics research report violations errors contrast alt text form labels"
            maxItems={3}
          />
        </main>
      </div>
    </>
  )
}
