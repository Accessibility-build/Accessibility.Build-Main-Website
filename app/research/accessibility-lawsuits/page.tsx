import type { Metadata } from "next"
import Link from "next/link"
import { ArticleStructuredData, BreadcrumbStructuredData } from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"
import { lawsuitSummary } from "@/lib/data/lawsuit-statistics"
import { LawsuitTrackerClient } from "./LawsuitTrackerClient"

export const metadata: Metadata = {
  title: "Accessibility Lawsuit Tracker 2026 | ADA & Digital Accessibility Litigation Data",
  description:
    "Comprehensive data on web accessibility lawsuits in the United States. 2025 closed at 3,117 federal filings (+27% YoY) — over 5,000 with state-court cases — and 2026 is projected to top 5,500. Fashion Nova settled for $5.15M; HHS Section 504 is now in force; DOJ Title II was extended to 2027. Updated July 2026.",
  keywords: [
    "accessibility lawsuits",
    "ada lawsuit tracker",
    "web accessibility litigation",
    "ada compliance lawsuits",
    "accessibility lawsuit statistics",
    "digital accessibility legal",
    "ada title iii lawsuits",
    "accessibility settlement costs",
    "2026 accessibility lawsuits",
    "fashion nova settlement",
  ],
  alternates: {
    canonical: "https://accessibility.build/research/accessibility-lawsuits",
  },
  openGraph: {
    title: "Accessibility Lawsuit Tracker 2026 | ADA & Digital Accessibility Litigation Data",
    description:
      "2025 closed at 3,117 federal website-accessibility lawsuits (+27% YoY); over 5,000 with state-court cases. 2026 is on pace to exceed 5,500. Fashion Nova settled for $5.15M; HHS Section 504 is now in force; DOJ Title II was extended to 2027/2028.",
    url: "https://accessibility.build/research/accessibility-lawsuits",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Accessibility Lawsuit Tracker 2026",
    description:
      "3,117 federal filings in 2025 (+27% YoY), with 2026 projected to top 5,500. Fashion Nova settled for $5.15M; HHS Section 504 now in force; DOJ Title II pushed to 2027.",
  },
}

export default function AccessibilityLawsuitsPage() {
  return (
    <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
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
        dateModified="2026-07-09"
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
              States. Federal-court trends through 2025, the mid-2026 landscape (2026 on pace to
              exceed 5,500 filings, HHS Section 504 now in force, DOJ Title II extended), the
              record $5.15M Fashion Nova settlement, and settlement-cost benchmarks.
            </p>
          </div>

          {/* Server-rendered key stats for SEO crawlers */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <p className="text-slate-400 text-sm font-medium mb-1">Federal Filings (2018-2025)</p>
              <p className="text-3xl md:text-4xl font-bold text-white">
                {lawsuitSummary.totalLawsuitsFiled.toLocaleString()}
              </p>
              <p className="text-slate-400 text-xs mt-1">
                Cumulative ADA Title III digital cases
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <p className="text-slate-400 text-sm font-medium mb-1">2025 Federal Lawsuits</p>
              <p className="text-3xl md:text-4xl font-bold text-white">
                {lawsuitSummary.latestYearTotal.toLocaleString()}
              </p>
              <p className="text-red-300 text-xs mt-1">
                +{lawsuitSummary.yearOverYearChange}% vs 2024
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <p className="text-slate-400 text-sm font-medium mb-1">2025 Federal + State</p>
              <p className="text-3xl md:text-4xl font-bold text-white">
                {lawsuitSummary.combinedFederalStateTotal2025.toLocaleString()}+
              </p>
              <p className="text-slate-400 text-xs mt-1">
                Including NY/CA state-court filings
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <p className="text-slate-400 text-sm font-medium mb-1">Most Targeted Industry</p>
              <p className="text-xl md:text-2xl font-bold text-white">
                {lawsuitSummary.mostTargetedIndustry}
              </p>
              <p className="text-slate-400 text-xs mt-1">
                {lawsuitSummary.mostTargetedIndustryShare}% of all 2025 filings
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
                In 2025, plaintiffs filed <strong>3,117 website accessibility lawsuits in U.S.
                federal court</strong> &mdash; a 27% jump over 2024&apos;s 2,452 cases (Seyfarth
                Shaw / adatitleiii.com). Including state-court filings (mostly in New York and
                California), total digital accessibility lawsuits topped <strong>5,000</strong> for
                the year (UsableNet). <strong>2026 is on pace for a record</strong>: U.S. courts
                logged over 2,000 filings in the first half of 2025 (+37% year over year), and if
                that trajectory holds, federal filings are projected to exceed <strong>5,500 in
                2026</strong>. Federal volume has fluctuated between roughly 2,256 and 4,011 each
                year since 2018, and several thousand additional demand letters are sent annually
                that never reach formal litigation. Roughly 40% of 2025&apos;s federal filings were
                filed pro se, with plaintiffs increasingly using generative AI to draft complaints.
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
                approximately 70% of all 2025 digital accessibility lawsuits. Food and Beverage
                companies are the second most targeted at 21%, followed by Healthcare (~2.5%, and
                rising fast ahead of the May 11, 2026 HHS Section 504 deadline), Entertainment
                (~2%), and Travel and Hospitality (~1.5%).
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
                to $25,000. Out-of-court settlements average around $30,000 but can reach $150,000.
                Court judgments average $85,000 and class action settlements can exceed $6 million.
                In July 2025, online retailer <strong>Fashion Nova agreed to a $5.15 million
                class-action settlement</strong> (Alcazar v. Fashion Nova) — the second-largest
                web accessibility settlement on record, behind only NFB v. Target (2008). Even
                defending a lawsuit with no damages typically costs $5,000 to $125,000 in legal
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
                requirements. The landmark Robles v. Domino&apos;s Pizza case in the 9th Circuit
                established that the ADA applies to websites and mobile apps. A circuit split
                exists, as the 11th Circuit ruled differently in Gil v. Winn-Dixie. On
                <strong> April 20, 2026</strong>, the DOJ issued an Interim Final Rule extending
                its Title II web/mobile compliance dates by a year — large public entities
                (population ≥ 50,000) now must conform to WCAG 2.1 Level AA by April 26, 2027,
                and smaller entities by April 26, 2028. The separate <strong>HHS Section 504 web
                accessibility rule</strong> is not extended and takes effect <strong>May 11,
                2026</strong> for healthcare entities receiving HHS funding. Private-sector
                courts continue to cite both rules as persuasive authority in ADA Title III cases.
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
                In 2025, New York led federal-court filings with 1,021 cases, followed by
                Florida (961, nearly double its 2024 total of 470), Illinois (585), Minnesota
                (162), and Pennsylvania (137). California fell to just 4 federal filings after
                state-court rulings closed off ADA coverage for online-only businesses, pushing
                California-targeted plaintiffs to state court instead — which is why combined
                federal-plus-state totals exceed 5,000 even though federal-only is 3,117.
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

          <div
            className="border border-slate-200 dark:border-slate-700 rounded-lg p-6"
            itemScope
            itemProp="mainEntity"
            itemType="https://schema.org/Question"
          >
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2" itemProp="name">
              Do accessibility overlay widgets protect against lawsuits?
            </h3>
            <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
              <p className="text-slate-600 dark:text-slate-400" itemProp="text">
                No. Overlay and widget products do not prevent litigation and are frequently named
                in it. In the first half of 2025, roughly <strong>456 lawsuits (about 22.6% of all
                filings)</strong> targeted websites that already had an accessibility overlay
                installed — a share that rose sharply year over year. About 38.5% of sued
                businesses reported already having some accessibility solution in place. The 2025
                FTC settlement with a major overlay provider further undermined the
                &ldquo;overlay-as-compliance&rdquo; defense. Real protection comes from fixing the
                underlying code to meet WCAG 2.2 Level AA, not from a third-party script.
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
              How is AI changing accessibility litigation in 2026?
            </h3>
            <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
              <p className="text-slate-600 dark:text-slate-400" itemProp="text">
                Generative AI has sharply lowered the cost of filing. Roughly 40% of 2025&apos;s
                federal ADA Title III filings were brought <strong>pro se</strong> (without a
                lawyer), with plaintiffs using AI tools to draft complaints in minutes and
                automated scanners to flag violations such as missing alt text or empty links —
                no technical expertise required. Combined with repeat-defendant activity (46% of
                federal cases in 2025 involved companies that had already been sued), the barrier
                to entry has collapsed, which is a major reason 2026 is projected to exceed 5,500
                federal filings. See our guide on{" "}
                <Link
                  href="/guides/ai-accessibility-lawsuits"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  how AI is fueling ADA website lawsuits
                </Link>{" "}
                for the full picture.
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
