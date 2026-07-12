import type { Metadata } from "next"
import Link from "next/link"
import { ArticleStructuredData, BreadcrumbStructuredData } from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"
import { lawsuitSummary } from "@/lib/data/lawsuit-statistics"
import { LawsuitTrackerClient } from "./LawsuitTrackerClient"

export const metadata: Metadata = {
  title: "Accessibility Lawsuit Tracker 2026 | ADA & Digital Accessibility Litigation Data",
  description:
    "Source-linked data on U.S. website accessibility lawsuits: 21,550 identified federal filings from 2018-2025, 3,117 in 2025, state trends, reported costs, methodology, and 2026 legal updates.",
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
  authors: [{ name: "Accessibility.build", url: "https://accessibility.build" }],
  creator: "Accessibility.build",
  publisher: "Accessibility.build",
  alternates: {
    canonical: "https://accessibility.build/research/accessibility-lawsuits",
  },
  openGraph: {
    title: "Accessibility Lawsuit Tracker 2026 | ADA & Digital Accessibility Litigation Data",
    description:
      "Source-linked federal website-accessibility lawsuit data through 2025, plus state trends, reported costs, methodology, and 2026 legal updates.",
    url: "https://accessibility.build/research/accessibility-lawsuits",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Accessibility Lawsuit Tracker 2026",
    description:
      "3,117 identified federal website-accessibility filings in 2025, up 27% from 2024. Explore the source-linked series, state data, costs, and methodology.",
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
        author={{
          name: "Accessibility.build",
          url: "https://accessibility.build",
        }}
        authorType="Organization"
        publisher={{
          name: "Accessibility.build",
          logo: "https://accessibility.build/android-chrome-512x512.png",
        }}
        datePublished="2026-01-15"
        dateModified="2026-07-12"
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
              <span className="text-slate-500 dark:text-slate-400">Research</span>
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
      <header className="border-b border-slate-800 bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
          <div className="max-w-4xl">
            <p className="mb-4 text-sm font-semibold uppercase text-blue-300">
              Research & Data
            </p>
            <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Accessibility Lawsuit Tracker 2026
            </h1>
            <p className="max-w-3xl text-lg leading-relaxed text-slate-300 md:text-xl">
              A source-linked view of U.S. website-accessibility litigation, built around a
              consistent federal-court series through 2025. Compare annual filings, industries,
              reported costs, states, and legal developments without mixing incompatible datasets.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-slate-300">
              <time dateTime="2026-07-12">Updated July 12, 2026</time>
              <span aria-hidden="true" className="text-slate-600">|</span>
              <span>Federal series through 2025</span>
            </div>
          </div>

          {/* Server-rendered key stats for SEO crawlers */}
          <div id="overview" className="mt-10 grid scroll-mt-28 grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            <div className="rounded-md border border-slate-700 bg-slate-900 p-4 md:p-5">
              <p className="mb-1 text-sm font-medium text-slate-300">Federal filings, 2018-2025</p>
              <p className="text-3xl md:text-4xl font-bold text-white">
                {lawsuitSummary.totalLawsuitsFiled.toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-slate-400">Identified website-accessibility cases</p>
            </div>
            <div className="rounded-md border border-slate-700 bg-slate-900 p-4 md:p-5">
              <p className="mb-1 text-sm font-medium text-slate-300">2025 federal filings</p>
              <p className="text-3xl md:text-4xl font-bold text-white">
                {lawsuitSummary.latestYearTotal.toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-slate-400">Observed full-year count</p>
            </div>
            <div className="rounded-md border border-slate-700 bg-slate-900 p-4 md:p-5">
              <p className="mb-1 text-sm font-medium text-slate-300">Year-over-year change</p>
              <p className="text-3xl md:text-4xl font-bold text-white">+{lawsuitSummary.yearOverYearChange}%</p>
              <p className="mt-1 text-xs text-slate-400">2025 compared with 2024</p>
            </div>
            <div className="rounded-md border border-slate-700 bg-slate-900 p-4 md:p-5">
              <p className="mb-1 text-sm font-medium text-slate-300">Leading federal venue</p>
              <p className="text-3xl md:text-4xl font-bold text-white">1,021</p>
              <p className="mt-1 text-xs text-slate-400">New York filings in 2025</p>
            </div>
          </div>
          <p className="mt-4 max-w-4xl text-xs leading-relaxed text-slate-400">
            Headline figures use Seyfarth Shaw&apos;s manually reviewed federal-court series. See the{" "}
            <a href="#methodology" className="font-medium text-blue-300 underline underline-offset-4 hover:text-white">methodology and limitations</a>{" "}
            before comparing them with broader state-court reports.
          </p>
        </div>
      </header>

      <nav aria-label="On this page" className="sticky top-12 z-30 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 py-2 sm:px-6 lg:px-8">
          {[
            ["#overview", "Overview"],
            ["#methodology", "Methodology"],
            ["#trends", "Trends"],
            ["#industries", "Industries"],
            ["#costs", "Costs"],
            ["#states", "States"],
            ["#developments", "Developments"],
            ["#faq", "FAQ"],
          ].map(([href, label]) => (
            <a key={href} href={href} className="whitespace-nowrap rounded px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white">
              {label}
            </a>
          ))}
        </div>
      </nav>

      <LawsuitTrackerClient />

      {/* FAQ Section with Schema.org Microdata for SEO */}
      <section id="faq" className="mx-auto max-w-7xl scroll-mt-28 px-4 py-14 sm:px-6 md:py-16 lg:px-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-10 text-center">
          Frequently Asked Questions
        </h2>
        <div
          className="max-w-3xl mx-auto space-y-6"
          itemScope
          itemType="https://schema.org/FAQPage"
        >
          <details
            className="group overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700"
            itemScope
            itemProp="mainEntity"
            itemType="https://schema.org/Question"
          >
            <summary className="cursor-pointer list-none px-5 py-4 font-semibold text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500 dark:text-white [&::-webkit-details-marker]:hidden">
              <span itemProp="name">How many accessibility lawsuits are filed each year?</span>
            </summary>
            <div className="border-t border-slate-200 px-5 py-4 dark:border-slate-700" itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
              <p className="text-slate-600 dark:text-slate-400" itemProp="text">
                In 2025, plaintiffs filed <strong>3,117 website accessibility lawsuits in U.S.
                federal court</strong> &mdash; a 27% jump over 2024&apos;s 2,452 cases (Seyfarth
                Shaw / adatitleiii.com). Federal volume in that source series ranged from 2,256 to
                3,255 filings per year between 2018 and 2025. State-court cases and private demand
                letters are additional activity, but their totals should be cited from the relevant
                publisher rather than added to the federal series. A comparable full-year 2026
                federal count is not yet available on this page.
              </p>
            </div>
          </details>

          <details
            className="group overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700"
            itemScope
            itemProp="mainEntity"
            itemType="https://schema.org/Question"
          >
            <summary className="cursor-pointer list-none px-5 py-4 font-semibold text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500 dark:text-white [&::-webkit-details-marker]:hidden">
              <span itemProp="name">Which industries are most targeted by accessibility lawsuits?</span>
            </summary>
            <div className="border-t border-slate-200 px-5 py-4 dark:border-slate-700" itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
              <p className="text-slate-600 dark:text-slate-400" itemProp="text">
                E-Commerce and Retail businesses are the most targeted industry, accounting for
                approximately 70% of all 2025 digital accessibility lawsuits. Food and Beverage
                companies are the second most targeted at 21%, followed by Healthcare (~2.5%), Entertainment
                (~2%), and Travel and Hospitality (~1.5%).
              </p>
            </div>
          </details>

          <details
            className="group overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700"
            itemScope
            itemProp="mainEntity"
            itemType="https://schema.org/Question"
          >
            <summary className="cursor-pointer list-none px-5 py-4 font-semibold text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500 dark:text-white [&::-webkit-details-marker]:hidden">
              <span itemProp="name">How much does an accessibility lawsuit cost to settle?</span>
            </summary>
            <div className="border-t border-slate-200 px-5 py-4 dark:border-slate-700" itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
              <p className="text-slate-600 dark:text-slate-400" itemProp="text">
                Settlement costs vary widely. Demand letter settlements typically range from $1,000
                to $25,000. Out-of-court settlements average around $30,000 but can reach $150,000.
                Court judgments average $85,000 and class action settlements can exceed $6 million.
                In 2025, online retailer <strong>Fashion Nova agreed to a proposed $5.15 million
                class-action settlement</strong> in Alcazar v. Fashion Nova. The proposal has faced
                objections and should not be treated as a final judgment or admission of liability. Even
                defending a lawsuit with no damages typically costs $5,000 to $125,000 in legal
                fees.
              </p>
            </div>
          </details>

          <details
            className="group overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700"
            itemScope
            itemProp="mainEntity"
            itemType="https://schema.org/Question"
          >
            <summary className="cursor-pointer list-none px-5 py-4 font-semibold text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500 dark:text-white [&::-webkit-details-marker]:hidden">
              <span itemProp="name">Does the ADA apply to websites?</span>
            </summary>
            <div className="border-t border-slate-200 px-5 py-4 dark:border-slate-700" itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
              <p className="text-slate-600 dark:text-slate-400" itemProp="text">
                While the ADA does not explicitly mention websites, multiple federal courts have
                ruled that websites of businesses open to the public are subject to ADA Title III
                requirements. The landmark Robles v. Domino&apos;s Pizza case in the 9th Circuit
                established that the ADA applies to websites and mobile apps. A circuit split
                exists, as the 11th Circuit ruled differently in Gil v. Winn-Dixie. On
                <strong> April 20, 2026</strong>, the DOJ issued an Interim Final Rule extending
                its Title II web/mobile compliance dates by a year — large public entities
                (population ≥ 50,000) now must conform to WCAG 2.1 Level AA by April 26, 2027,
                and smaller entities by April 26, 2028. HHS also extended the first Section 504
                web-accessibility deadline for covered funding recipients to <strong>May 11,
                2027</strong>. A federal lawsuit filed in May 2026 challenges the DOJ and HHS
                extensions. These rules concern Title II and Section 504; they do not create a
                general safe harbor from private Title III litigation.
              </p>
            </div>
          </details>

          <details
            className="group overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700"
            itemScope
            itemProp="mainEntity"
            itemType="https://schema.org/Question"
          >
            <summary className="cursor-pointer list-none px-5 py-4 font-semibold text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500 dark:text-white [&::-webkit-details-marker]:hidden">
              <span itemProp="name">Which states have the most accessibility lawsuits?</span>
            </summary>
            <div className="border-t border-slate-200 px-5 py-4 dark:border-slate-700" itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
              <p className="text-slate-600 dark:text-slate-400" itemProp="text">
                In 2025, New York led federal-court filings with 1,021 cases, followed by
                Florida (961, nearly double its 2024 total of 470), Illinois (585), Minnesota
                (162), and Pennsylvania (137). California recorded just 4 federal filings in the
                same review. The source attributes California&apos;s low federal count partly to appellate
                decisions concerning online-only businesses. It also notes that state-court lawsuits
                and demand letters are outside the federal figures shown here.
              </p>
            </div>
          </details>

          <details
            className="group overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700"
            itemScope
            itemProp="mainEntity"
            itemType="https://schema.org/Question"
          >
            <summary className="cursor-pointer list-none px-5 py-4 font-semibold text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500 dark:text-white [&::-webkit-details-marker]:hidden">
              <span itemProp="name">How can businesses reduce accessibility barriers and litigation risk?</span>
            </summary>
            <div className="border-t border-slate-200 px-5 py-4 dark:border-slate-700" itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
              <p className="text-slate-600 dark:text-slate-400" itemProp="text">
                No checklist can guarantee that an organization will avoid a claim. A practical
                response is to work toward WCAG 2.2 Level AA, conduct regular accessibility audits, implement
                automated and manual testing, train development teams on accessible coding
                practices, publish an accessibility statement, and establish a process for receiving
                and addressing accessibility feedback. Organizations should ask qualified counsel
                to assess their specific legal obligations and jurisdictions.
              </p>
            </div>
          </details>

          <details
            className="group overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700"
            itemScope
            itemProp="mainEntity"
            itemType="https://schema.org/Question"
          >
            <summary className="cursor-pointer list-none px-5 py-4 font-semibold text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500 dark:text-white [&::-webkit-details-marker]:hidden">
              <span itemProp="name">Do accessibility overlay widgets protect against lawsuits?</span>
            </summary>
            <div className="border-t border-slate-200 px-5 py-4 dark:border-slate-700" itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
              <p className="text-slate-600 dark:text-slate-400" itemProp="text">
                No product can guarantee that a website is accessible or immune from a lawsuit.
                Industry reporting continues to identify claims involving sites that had widgets or
                other accessibility products in place. Automated tools can support a program, but
                they do not replace code remediation, keyboard and screen-reader testing, accessible
                design, monitoring, or a process for responding to disabled users&apos; feedback.
              </p>
            </div>
          </details>

          <details
            className="group overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700"
            itemScope
            itemProp="mainEntity"
            itemType="https://schema.org/Question"
          >
            <summary className="cursor-pointer list-none px-5 py-4 font-semibold text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500 dark:text-white [&::-webkit-details-marker]:hidden">
              <span itemProp="name">How is AI changing accessibility litigation in 2026?</span>
            </summary>
            <div className="border-t border-slate-200 px-5 py-4 dark:border-slate-700" itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
              <p className="text-slate-600 dark:text-slate-400" itemProp="text">
                AI-assisted drafting and automated scanning can reduce the effort needed to identify
                recurring barriers and prepare legal documents, but public datasets do not provide a
                consistent measure of how many filings were created with AI. Organizations should
                focus on the underlying user barriers and review complete journeys rather than trying
                to infer a claimant&apos;s tools. See our guide on{" "}
                <Link
                  href="/guides/ai-accessibility-lawsuits"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  how AI is fueling ADA website lawsuits
                </Link>{" "}
                for the full picture.
              </p>
            </div>
          </details>
        </div>
      </section>

      {/* Go deeper: jurisdictions, costs, and prevention */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
          Go Deeper
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { href: "/compliance/ada", title: "ADA Website Compliance", description: "Requirements, deadlines, and lawsuit exposure under Title II and III" },
            { href: "/compliance/california", title: "California & the Unruh Act", description: "Why California drives statutory-damages lawsuits" },
            { href: "/compliance/new-york", title: "New York Lawsuits & Laws", description: "The top federal filing venue, explained" },
            { href: "/compliance/eaa", title: "European Accessibility Act", description: "EU requirements now in force for digital services" },
            { href: "/guides/ada-website-lawsuit-cost", title: "What a Lawsuit Costs", description: "Demand letters, settlements, and defense fees" },
            { href: "/tools/ada-compliance-risks", title: "Assess Your Risk", description: "Interactive risk assessment with current lawsuit data" },
            { href: "/checklists/wcag-2-2", title: "WCAG 2.2 Checklist", description: "The standard courts and regulators point to" },
            { href: "/services/accessibility-audits", title: "Professional Audit", description: "Manual and automated review of priority user journeys" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group block rounded-lg border border-slate-200 dark:border-slate-700 p-4 transition-colors hover:border-blue-300 dark:hover:border-blue-600"
            >
              <p className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-1">
                {item.title}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">{item.description}</p>
            </Link>
          ))}
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
