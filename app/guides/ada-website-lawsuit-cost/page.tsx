import type { Metadata } from "next"
import Link from "next/link"
import {
  ArticleStructuredData,
  FAQStructuredData,
  BreadcrumbStructuredData,
} from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"
import { settlementData } from "@/lib/data/lawsuit-statistics"

export const metadata: Metadata = {
  title:
    "How Much Does an ADA Website Lawsuit Cost? (2026 Settlement & Defense Data)",
  description:
    "A data-backed breakdown of what a web accessibility lawsuit actually costs in 2026 — demand-letter settlements ($1K–$25K), out-of-court settlements (~$30K), court judgments (~$85K), class actions (up to $5.15M), and legal-defense fees. Plus how to cut your risk for a fraction of the price.",
  keywords: [
    "ADA website lawsuit cost",
    "accessibility lawsuit settlement amount",
    "how much does an ADA lawsuit cost",
    "web accessibility settlement cost",
    "ADA demand letter cost",
    "accessibility lawsuit defense cost",
    "average ADA settlement",
    "website accessibility lawsuit damages",
    "ADA compliance cost vs lawsuit",
  ],
  alternates: {
    canonical: "https://accessibility.build/guides/ada-website-lawsuit-cost",
  },
  openGraph: {
    title: "How Much Does an ADA Website Lawsuit Cost? (2026 Data)",
    description:
      "Demand letters, settlements, judgments, and class actions — what a web accessibility lawsuit really costs in 2026, and how to cut your risk for far less.",
    url: "https://accessibility.build/guides/ada-website-lawsuit-cost",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: "https://accessibility.build/og-image.png",
        width: 1200,
        height: 630,
        alt: "The cost of an ADA website accessibility lawsuit in 2026",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "How Much Does an ADA Website Lawsuit Cost? (2026 Data)",
    description:
      "From $1K demand letters to a $5.15M class action — the real cost of a web accessibility lawsuit, and how to spend far less avoiding one.",
  },
}

const faqs = [
  {
    question: "What is the average cost of an ADA website lawsuit?",
    answer:
      "Most single-plaintiff web accessibility cases settle out of court for roughly $5,000 to $50,000, with an average around $30,000 once legal fees are included. Demand letters that never reach court typically resolve for $1,000 to $25,000. The figure rises steeply for class actions: in 2025, Fashion Nova settled a web accessibility class action for $5.15 million. Even winning costs money — defending a case with no damages award still runs $5,000 to $125,000 in legal fees.",
  },
  {
    question: "Do I have to pay damages under the ADA?",
    answer:
      "Under federal ADA Title III, private plaintiffs cannot recover money damages — only injunctive relief (an order to fix the site) plus their attorney's fees and costs. The money in most settlements is really the plaintiff's legal fees and a negotiated payment to make the case go away. Damages enter the picture through state laws: California's Unruh Act ($4,000 minimum per violation), New York's laws, and similar statutes let plaintiffs recover statutory damages, which is why California- and New York-linked cases cost more.",
  },
  {
    question: "How much does it cost to just defend and win?",
    answer:
      "Even a meritless case is expensive to fight. Retaining counsel, responding to the complaint, and negotiating typically costs $5,000 to $125,000 depending on how far the case goes. Because that defense cost often exceeds a quick settlement, many defendants settle even when they believe they would win — which is exactly what plaintiff's firms count on. The only durable way out is to remediate the site so future plaintiffs have nothing to allege.",
  },
  {
    question: "Is it cheaper to fix my site or risk a lawsuit?",
    answer:
      "For almost every business, remediation is cheaper. A professional WCAG 2.2 AA audit and remediation program is a one-time or annual cost that also improves SEO, conversion, and reach — while a lawsuit is a pure loss that does not even guarantee you have fixed the underlying problem. And because 46% of 2025's federal cases targeted repeat defendants, paying a settlement without remediating often just invites the next filing.",
  },
  {
    question: "What drives the price of a settlement up or down?",
    answer:
      "Key factors: whether a statutory-damages state law (California, New York) applies; whether it is a single plaintiff or a class action; the size and revenue of the business (36% of 2025 defendants had over $25M in revenue, and larger companies pay more); whether you have a prior lawsuit on record; how egregious and well-documented the barriers are; and how quickly you engage counsel and signal a remediation plan. Demonstrating a good-faith, in-progress accessibility program is one of the few things that reliably lowers exposure.",
  },
]

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Guides", url: "https://accessibility.build/guides" },
  {
    name: "ADA Website Lawsuit Cost",
    url: "https://accessibility.build/guides/ada-website-lawsuit-cost",
  },
]

function formatUSD(value: number): string {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(2)}M`
  if (value >= 1000) return `$${(value / 1000).toLocaleString()}K`
  return `$${value.toLocaleString()}`
}

export default function ADALawsuitCostPage() {
  return (
    <>
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />
      <ArticleStructuredData
        headline="How Much Does an ADA Website Lawsuit Cost? (2026 Settlement & Defense Data)"
        description="A data-backed breakdown of web accessibility lawsuit costs in 2026 — demand letters, settlements, judgments, class actions, and defense fees — and how proactive WCAG remediation costs far less."
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
        url="https://accessibility.build/guides/ada-website-lawsuit-cost"
        wordCount={2000}
        keywords={[
          "ADA website lawsuit cost",
          "accessibility lawsuit settlement amount",
          "web accessibility settlement cost",
          "accessibility lawsuit defense cost",
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
                  <Link href="/guides" className="hover:text-blue-600 transition-colors">
                    Guides
                  </Link>
                </li>
                <li aria-hidden="true" className="text-slate-400">/</li>
                <li>
                  <span className="text-slate-900 dark:text-white font-medium">
                    ADA Website Lawsuit Cost
                  </span>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <header className="mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-200 text-xs font-semibold uppercase tracking-wide mb-5">
              <span aria-hidden="true">●</span>
              Guide · Updated July 9, 2026
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-6 leading-tight">
              How Much Does an ADA Website Lawsuit Actually Cost?
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              The honest answer: anywhere from a $1,000 demand letter to a $5.15
              million class-action settlement — with most single-plaintiff cases
              landing around $30,000 once legal fees are counted. Below is the
              full range by resolution type, what actually drives the number up
              or down, and why the cheapest option is almost always to fix the
              site first.
            </p>
          </header>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Cost by resolution type (2026)
            </h2>
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-sm">
                <thead className="bg-slate-100 dark:bg-slate-800">
                  <tr>
                    <th scope="col" className="text-left p-4 font-semibold">Resolution type</th>
                    <th scope="col" className="text-right p-4 font-semibold">Average</th>
                    <th scope="col" className="text-right p-4 font-semibold">Typical range</th>
                  </tr>
                </thead>
                <tbody>
                  {settlementData.map((row) => (
                    <tr key={row.category} className="border-t border-slate-200 dark:border-slate-800">
                      <th scope="row" className="text-left p-4 font-medium text-slate-900 dark:text-white">
                        {row.category}
                      </th>
                      <td className="p-4 text-right tabular-nums text-slate-900 dark:text-white font-semibold">
                        {formatUSD(row.averageCost)}
                      </td>
                      <td className="p-4 text-right tabular-nums text-slate-500 dark:text-slate-400">
                        {formatUSD(row.range.min)} – {formatUSD(row.range.max)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
              Source: Accessibility.build{" "}
              <Link href="/research/accessibility-lawsuits" className="text-blue-600 dark:text-blue-400 hover:underline">
                Lawsuit Tracker
              </Link>
              , from public court records and legal-industry reports. Figures are
              indicative ranges, not legal advice.
            </p>
          </section>

          <section className="prose prose-slate dark:prose-invert max-w-none mb-12">
            <h2>The counter-intuitive part: the ADA has no damages</h2>
            <p>
              Here is what surprises most business owners. Under federal ADA
              Title III, a private plaintiff <strong>cannot win money
              damages</strong> — the statute only lets a court order you to fix
              the website and pay the plaintiff&apos;s attorney&apos;s fees. So
              where does the money in a &ldquo;settlement&rdquo; come from? Two
              places:
            </p>
            <ol>
              <li>
                <strong>Attorney&apos;s fees.</strong> The plaintiff&apos;s
                lawyer is entitled to reasonable fees, and a negotiated payment
                to resolve those fees is the bulk of most settlements.
              </li>
              <li>
                <strong>State statutory damages.</strong> This is the real
                multiplier. California&apos;s Unruh Civil Rights Act treats an
                ADA violation as an automatic state violation carrying{" "}
                <strong>$4,000 minimum per violation</strong>, with no need to
                prove actual harm. New York and a handful of other states have
                their own damages regimes. This is why a case tied to
                California or New York routinely costs several times more than
                the same barriers would in a state without such a law.
              </li>
            </ol>

            <h2>What pushes your number up</h2>
            <ul>
              <li>
                <strong>A statutory-damages state.</strong> California (Unruh)
                and New York are the most expensive jurisdictions. Most 2025
                filings clustered in New York, Florida, and Illinois federal
                courts, with California pushed into state court.
              </li>
              <li>
                <strong>Class-action structure.</strong> A single plaintiff is
                capped by their own fees and one $4,000 increment. A class
                multiplies statutory damages across everyone affected — the
                mechanism behind the{" "}
                <Link href="/guides/fashion-nova-accessibility-settlement">
                  $5.15M Fashion Nova settlement
                </Link>
                .
              </li>
              <li>
                <strong>Company size.</strong> In 2025, 36% of sued companies
                had revenue over $25 million, and larger firms settle for more
                because they can — and because they are more visible targets.
              </li>
              <li>
                <strong>A prior lawsuit on record.</strong> Repeat defendants
                made up 46% of 2025&apos;s federal cases. Being sued once marks
                you as a proven, un-remediated target.
              </li>
              <li>
                <strong>Egregious, well-documented barriers.</strong> A broken
                checkout or an inaccessible core flow is worth more to a
                plaintiff than a cosmetic issue on a rarely visited page.
              </li>
            </ul>

            <h2>What brings it down</h2>
            <ul>
              <li>
                <strong>A visible, in-progress accessibility program.</strong>{" "}
                Audit records, a remediation backlog, and a published{" "}
                accessibility statement signal good faith and weaken a
                plaintiff&apos;s leverage.
              </li>
              <li>
                <strong>Fast engagement.</strong> Responding quickly and
                credibly, with a remediation timeline, often resolves a case
                before fees balloon.
              </li>
              <li>
                <strong>Actually fixing the site.</strong> The single most
                effective cost control, because it removes the basis for the
                next claim.
              </li>
            </ul>

            <div className="not-prose rounded-xl border-2 border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 p-6 my-8">
              <p className="text-sm font-bold uppercase tracking-wide text-emerald-800 dark:text-emerald-200 mb-3">
                The math almost always favors remediation
              </p>
              <p className="text-slate-800 dark:text-slate-200 leading-relaxed">
                A single out-of-court settlement averages ~$30,000 and does not
                fix your site. A professional WCAG 2.2 AA audit and remediation
                program often costs the same or less, permanently removes the
                exposure, and improves SEO, conversion, and reach to the ~27% of
                U.S. adults with a disability. When 46% of federal cases are
                repeat defendants, paying to settle without remediating is
                paying twice.
              </p>
            </div>

            <h2>Don&apos;t forget the overlay trap</h2>
            <p>
              Businesses often buy an accessibility overlay widget expecting it
              to cap this risk. It does not. Overlays are named in hundreds of
              suits a year, and in 2025 the FTC settled with a major overlay
              provider over misleading compliance claims. Budgeting for a
              subscription widget instead of real remediation usually means
              paying for the widget <em>and</em> the lawsuit. See{" "}
              <Link href="/guides/accessibility-overlays">
                why overlays fail
              </Link>
              .
            </p>
          </section>

          <section className="mb-16">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                Put real numbers on your own risk
              </h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Estimate your lawsuit exposure and the ROI of fixing it before
                you spend a dollar on defense.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/tools/accessibility-roi-calculator"
                  className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  ROI Calculator
                </Link>
                <Link
                  href="/tools/url-accessibility-auditor"
                  className="inline-flex items-center px-5 py-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg font-medium border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  Scan Your Site
                </Link>
                <Link
                  href="/research/accessibility-lawsuits"
                  className="inline-flex items-center px-5 py-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg font-medium border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  Lawsuit Tracker
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
                    <span aria-hidden="true" className="text-slate-400 group-open:rotate-180 transition-transform flex-shrink-0">
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
        </article>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <RelatedContent
            content="accessibility lawsuit settlement cost ADA compliance ROI audit litigation Unruh Act remediation"
            maxItems={6}
          />
        </section>
      </div>
    </>
  )
}
