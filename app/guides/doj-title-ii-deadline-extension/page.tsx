import type { Metadata } from "next"
import Link from "next/link"
import {
  ArticleStructuredData,
  FAQStructuredData,
  BreadcrumbStructuredData,
} from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"

export const metadata: Metadata = {
  title:
    "DOJ Title II Deadline Extension (April 2026): What Changed, What Didn't, Why You Shouldn't Slow Down",
  description:
    "The DOJ's April 20, 2026 Interim Final Rule pushed ADA Title II web accessibility deadlines to 2027 and 2028. Here's exactly what changed, what didn't, and our editorial take: the extension is a setback for disability rights, but the WCAG 2.1 AA standard is unchanged and lawsuits continue at record pace.",
  keywords: [
    "Title II deadline extension",
    "DOJ Title II extension",
    "ADA Title II deadline 2027",
    "Title II web accessibility deadline",
    "DOJ Interim Final Rule April 2026",
    "ADA web compliance deadline",
    "WCAG 2.1 AA Title II",
    "state local government accessibility deadline",
    "Title II compliance extended",
    "public entity web accessibility deadline",
    "ADA Title II rule extension",
  ],
  alternates: {
    canonical:
      "https://accessibility.build/guides/doj-title-ii-deadline-extension",
  },
  openGraph: {
    title:
      "DOJ Title II Deadline Extension (April 2026): What Changed, What Didn't",
    description:
      "The DOJ pushed Title II web compliance to 2027/2028. Here's our editorial take: the extension is a setback, the WCAG 2.1 AA standard hasn't changed, and you shouldn't slow down.",
    url: "https://accessibility.build/guides/doj-title-ii-deadline-extension",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: "https://accessibility.build/og-image.png",
        width: 1200,
        height: 630,
        alt: "DOJ Title II Deadline Extension — Editorial Analysis",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "DOJ Title II Deadline Extension (April 2026): What Changed, What Didn't",
    description:
      "The DOJ pushed Title II web compliance to 2027/2028. Editorial take: the extension is a setback, the standard is unchanged.",
  },
}

const faqs = [
  {
    question:
      "What did the DOJ Title II Interim Final Rule on April 20, 2026 actually do?",
    answer:
      "It extended the compliance deadlines from the 2024 final rule by one year. Public entities with a total population of 50,000 or more now have until April 26, 2027 to make web content and mobile apps conform to WCAG 2.1 Level AA. Smaller public entities and special-district governments now have until April 26, 2028. The technical standard, the scope, and the exceptions are unchanged — only the dates moved.",
  },
  {
    question: "Was the WCAG 2.1 Level AA standard itself changed?",
    answer:
      "No. The rule still requires conformance with WCAG 2.1 Level AA for web content and mobile apps. The DOJ did not adopt WCAG 2.2, did not change the conformance level, and did not narrow the scope. If anything, the gap between the rule's WCAG 2.1 AA floor and the de facto industry standard (WCAG 2.2 AA) has widened, because most accessibility programs already audit against 2.2.",
  },
  {
    question: "Does the extension apply to private businesses?",
    answer:
      "No. Title II covers state and local governments and their instrumentalities — courts, transit authorities, public universities, public libraries, public schools, public hospitals operated by state or county governments. Private businesses fall under Title III of the ADA, which the DOJ has never published a corresponding web rule for. Title III lawsuits continue under court-developed standards and routinely cite WCAG 2.1 AA as the de facto benchmark — Title III plaintiffs filed over 3,117 federal cases in 2025, a 27% year-over-year increase. The Title II extension changes nothing for the private sector.",
  },
  {
    question:
      "Does the extension apply to entities that receive federal HHS funding?",
    answer:
      "No. Healthcare providers, state Medicaid agencies, public hospitals, and other entities receiving funding from the U.S. Department of Health and Human Services are covered by a separate rule — the HHS Section 504 web accessibility final rule. That rule was not extended. Its compliance deadline was May 11, 2026, which has now passed for most covered entities. If a public hospital is covered by both Title II and Section 504, the earlier Section 504 deadline controls. See our guide on the Section 504 deadline for details.",
  },
  {
    question: "Why did the DOJ extend the deadline?",
    answer:
      "The DOJ's own rationale in the Interim Final Rule cited implementation difficulty for smaller public entities, resource constraints, and the request of state and local government associations. Our editorial view: those concerns were known when the original 2024 final rule was published, they were addressed by giving smaller entities a longer original timeline already, and the disability community has waited 35 years since the ADA was signed in 1990. The extension prioritized institutional convenience over civil rights enforcement.",
  },
  {
    question: "What should public entities do now?",
    answer:
      "Keep the original April 24, 2026 timeline as your internal target — that was the date you planned around, your vendors planned around, and your remediation budgets were sized for. The extension is breathing room, not permission to stop. Public-records requests, OCR complaints, private lawsuits under Section 504, and parallel state laws (Unruh Act in California, Human Rights Law in New York, AODA in Ontario for cross-border services) do not move just because the federal deadline did. Continue your audit, continue remediating critical and high-severity issues, and treat April 2027 / 2028 as the absolute floor — not the target.",
  },
  {
    question:
      "Are there state laws that override the federal Title II extension?",
    answer:
      "Yes, in several jurisdictions. California's Unruh Civil Rights Act independently requires equal access and has been used to bring private-action accessibility cases against public entities. New York's Human Rights Law similarly imposes obligations beyond the federal floor. Illinois's Web Accessibility Act and Colorado's HB21-1110 set state-specific deadlines for state agencies. The federal extension does not preempt any of these. Public entities operating in these states should treat the original federal deadlines as binding regardless of the federal pause.",
  },
  {
    question:
      "Does the extension affect website accessibility lawsuits in 2026?",
    answer:
      "Private-sector lawsuits under ADA Title III continue at record pace — over 3,117 federal filings in 2025 with state-court totals pushing the combined number above 5,000. None of those cases depend on the Title II deadline. Plaintiffs cite WCAG 2.1 AA (and increasingly WCAG 2.2 AA) regardless of the DOJ's enforcement timeline. The Title II extension affects only when the DOJ itself can begin formal enforcement against state and local governments. Private litigation is unaffected.",
  },
]

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Guides", url: "https://accessibility.build/guides" },
  {
    name: "DOJ Title II Deadline Extension",
    url: "https://accessibility.build/guides/doj-title-ii-deadline-extension",
  },
]

export default function TitleIIExtensionPage() {
  return (
    <>
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />
      <ArticleStructuredData
        headline="DOJ Title II Deadline Extension (April 2026): What Changed, What Didn't, Why You Shouldn't Slow Down"
        description="The DOJ's April 20, 2026 Interim Final Rule pushed ADA Title II web accessibility deadlines to 2027 and 2028. Editorial analysis of what changed, what didn't, and why the extension is a setback for disability rights even though the WCAG 2.1 AA standard is unchanged."
        author={{
          name: "Accessibility.build Editorial",
          url: "https://accessibility.build/about",
        }}
        publisher={{
          name: "Accessibility.build",
          logo: "https://accessibility.build/android-chrome-512x512.png",
        }}
        datePublished="2026-05-18"
        dateModified="2026-05-18"
        image="https://accessibility.build/og-image.png"
        url="https://accessibility.build/guides/doj-title-ii-deadline-extension"
        wordCount={2400}
        keywords={[
          "Title II deadline extension",
          "DOJ Title II extension",
          "ADA Title II deadline 2027",
          "Title II web accessibility deadline",
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
                    Title II Deadline Extension
                  </span>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <header className="mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 text-xs font-semibold uppercase tracking-wide mb-5">
              <span aria-hidden="true">●</span>
              Editorial · Updated May 18, 2026
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-6 leading-tight">
              The DOJ Just Pushed Title II to 2027. Don&apos;t Slow Down.
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              On April 20, 2026 — four days before the original deadline — the
              U.S. Department of Justice issued an Interim Final Rule extending
              its Title II web and mobile accessibility deadlines by one year.
              Large public entities now have until April 26, 2027. Smaller
              entities have until April 26, 2028. Here is the unvarnished
              analysis of what that means, what it does not mean, and the
              editorial position we are taking.
            </p>
          </header>

          <section className="mb-10 rounded-xl border-2 border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-6">
            <p className="text-sm font-bold uppercase tracking-wide text-amber-800 dark:text-amber-200 mb-3">
              Our editorial position
            </p>
            <p className="text-lg text-slate-900 dark:text-white leading-relaxed mb-3">
              The extension is a setback for the 61 million Americans with a
              disability who interact with state and local government services
              every day. The ADA was signed in 1990. WCAG 2.0 was published in
              2008. Public entities have had two decades of clear guidance and
              fifteen months of formal notice that this rule was coming. A
              one-year pause four days before the deadline rewards
              procrastination and punishes the public entities that did the
              work on time.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              We will continue auditing, advising, and reporting on Title II
              compliance as if the original April 24, 2026 deadline still
              applied. So should you. The DOJ paused enforcement. It did not
              repeal the underlying obligation to provide accessible
              government services.
            </p>
          </section>

          <section className="prose prose-slate dark:prose-invert max-w-none mb-12">
            <h2>What the extension actually changed</h2>
            <p>
              The 2024 DOJ final rule under Title II of the Americans with
              Disabilities Act required state and local governments to make
              their web content and mobile applications conform to WCAG 2.1
              Level AA on a tiered timeline. The April 20, 2026 Interim Final
              Rule moves the dates and only the dates:
            </p>

            <div className="not-prose rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6">
              <table className="w-full text-sm">
                <thead className="bg-slate-100 dark:bg-slate-800">
                  <tr>
                    <th scope="col" className="text-left p-4 font-semibold">
                      Entity
                    </th>
                    <th scope="col" className="text-left p-4 font-semibold">
                      Original deadline
                    </th>
                    <th scope="col" className="text-left p-4 font-semibold">
                      New deadline
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-slate-200 dark:border-slate-800">
                    <th scope="row" className="text-left p-4 font-medium">
                      Public entities, total population ≥ 50,000
                    </th>
                    <td className="p-4 text-slate-500 line-through">
                      April 24, 2026
                    </td>
                    <td className="p-4 font-semibold text-amber-700 dark:text-amber-300">
                      April 26, 2027
                    </td>
                  </tr>
                  <tr className="border-t border-slate-200 dark:border-slate-800">
                    <th scope="row" className="text-left p-4 font-medium">
                      Smaller public entities & special districts
                    </th>
                    <td className="p-4 text-slate-500 line-through">
                      April 26, 2027
                    </td>
                    <td className="p-4 font-semibold text-amber-700 dark:text-amber-300">
                      April 26, 2028
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2>What the extension did not change</h2>
            <ul>
              <li>
                <strong>The technical standard is still WCAG 2.1 Level AA.</strong>{" "}
                The DOJ declined to upgrade to WCAG 2.2 even as the industry
                has largely moved on. If you have been auditing against 2.2,
                you remain over-compliant.
              </li>
              <li>
                <strong>The scope is unchanged.</strong> Web content, mobile
                apps, and digital documents (PDFs, Word docs) made available
                to the public are all still covered.
              </li>
              <li>
                <strong>The exceptions are unchanged.</strong> Archived
                content, third-party content, pre-existing conventional
                electronic documents, password-protected individualized
                content, and pre-existing social media posts retain their
                narrow carve-outs.
              </li>
              <li>
                <strong>Section 504 was not extended.</strong> Entities that
                receive HHS funding are covered by a separate rule that took
                effect May 11, 2026.{" "}
                <Link href="/guides/section-504-web-accessibility-deadline">
                  See our Section 504 guide.
                </Link>
              </li>
              <li>
                <strong>State laws were not preempted.</strong> California,
                New York, Illinois, Colorado, and others enforce parallel or
                stricter accessibility obligations on state and local
                entities. The federal extension does not pause state
                deadlines.
              </li>
              <li>
                <strong>Private litigation continues.</strong> Title III
                plaintiffs filed over 3,117 federal accessibility cases in
                2025 — a 27% year-over-year increase — and they cite WCAG 2.1
                AA regardless of what the DOJ is doing on Title II.
              </li>
            </ul>

            <h2>The honest case for the extension</h2>
            <p>
              In fairness, the DOJ&apos;s stated rationale is not nothing.
              Small public entities — towns of a few thousand residents, rural
              special districts, single-school districts — often run their
              websites on volunteer or two-person teams with no in-house
              accessibility expertise. Remediating decades of inaccessible
              content while keeping basic services online is a real
              constraint. The 2024 final rule already gave those entities an
              extra year over the larger entities for this reason.
            </p>
            <p>
              The defensible version of the extension would have been narrow:
              additional relief for entities under, say, 10,000 population
              with a documented good-faith effort. What the DOJ actually did
              was extend everyone, including the largest cities and states
              that have had ample resources and notice. That is the part we
              cannot accept.
            </p>

            <h2>Why we&apos;re telling clients to treat April 2026 as the real deadline</h2>
            <p>
              Three reasons, independent of the federal pause:
            </p>
            <ol>
              <li>
                <strong>State laws are unmoved.</strong> A California county
                that misses accessibility obligations is still exposed under
                the Unruh Civil Rights Act. A New York City agency is still
                exposed under the city&apos;s Human Rights Law. The federal
                extension is irrelevant to either.
              </li>
              <li>
                <strong>Private complaints don&apos;t wait for the DOJ.</strong>{" "}
                Disability rights organizations file Office for Civil Rights
                complaints, Section 504 complaints, and §1983 actions against
                public entities every week. None of these depend on Title II
                enforcement timing.
              </li>
              <li>
                <strong>The work is the same either way.</strong> WCAG 2.1
                AA hasn&apos;t changed. The audit you scoped in 2025 still
                produces the same findings. Pausing now means doing the same
                work in 2027 at higher cost (developers leave, vendors raise
                prices) with worse outcomes (more accumulated inaccessible
                content to remediate).
              </li>
            </ol>

            <h2>What to do this week</h2>
            <ol>
              <li>
                <strong>Do not pause your remediation backlog.</strong> Email
                your accessibility lead, your CIO, and your procurement team
                today and confirm the program continues on the original
                timeline. The cost of stopping and restarting is real.
              </li>
              <li>
                <strong>Update your accessibility statement honestly.</strong>{" "}
                Document your current conformance level, your remaining
                known gaps, and your target dates. Do not claim conformance
                you have not achieved. Use our{" "}
                <Link href="/tools/accessibility-statement-generator">
                  accessibility statement generator
                </Link>{" "}
                to draft language that is defensible.
              </li>
              <li>
                <strong>Audit against WCAG 2.2 AA, not just 2.1.</strong> The
                regulatory floor is 2.1, but 2.2 added critical criteria
                around target size (2.5.8), focus appearance (2.4.11), and
                drag alternatives (2.5.7) that map to real-world barriers.
                Use our{" "}
                <Link href="/tools/accessibility-audit-helper">
                  AI Audit Helper
                </Link>{" "}
                to triage findings against either version.
              </li>
              <li>
                <strong>Document everything for OCR complaints.</strong>{" "}
                Records of your audit cadence, remediation backlog, and
                training program are the difference between an OCR resolution
                agreement and a structural reform consent decree.
              </li>
            </ol>

            <h2>Where we stand</h2>
            <p>
              We build tools for the people who do this work — the
              accessibility engineers, the OCR coordinators, the disability
              services directors, the procurement officers writing VPAT
              language into RFPs. Every one of those roles spent the last
              eighteen months building toward an April 2026 deadline that the
              DOJ erased with four days&apos; notice. That is not how
              regulatory policy should work, and it is not how civil rights
              enforcement should work. We will continue treating the original
              dates as the operative dates in everything we publish.
            </p>
            <p>
              If you are a public entity that hit your April 2026 target on
              time: thank you. You did the work. The extension does not
              diminish that.
            </p>
            <p>
              If you are a public entity that did not hit the original
              deadline: the extension is breathing room, not absolution. The
              users you serve still need access. Get back to the audit.
            </p>
          </section>

          <section className="mb-16">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                Keep your audit moving
              </h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                The deadlines moved. The standard didn&apos;t. Use the tools
                you were going to use anyway.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/tools/accessibility-audit-helper"
                  className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  AI Audit Helper
                </Link>
                <Link
                  href="/guides/how-to-audit-website-accessibility"
                  className="inline-flex items-center px-5 py-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg font-medium border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  WCAG Audit Guide
                </Link>
                <Link
                  href="/guides/section-504-web-accessibility-deadline"
                  className="inline-flex items-center px-5 py-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg font-medium border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  Section 504 Deadline
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
            content="ADA Title II Section 504 WCAG 2.1 AA public entity government accessibility deadline lawsuit"
            maxItems={6}
          />
        </section>
      </div>
    </>
  )
}
