import type { Metadata } from "next"
import Link from "next/link"
import {
  ArticleStructuredData,
  FAQStructuredData,
  BreadcrumbStructuredData,
} from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"
import { getRouteDate } from "@/lib/site-routes"
import { PageByline } from "@/components/seo/page-byline"
import { clampDescription } from "@/lib/metadata"

const changes = [
  "Corrected the compliance dates. An earlier version said HHS had not extended the deadline. HHS extended it by interim final rule to May 11, 2027 and May 10, 2028.",
  "Removed the editorial argument that HHS was right not to extend the deadline, including an unsourced claim about deaths, because it depended on the wrong date.",
  "Added what still applies during the extension and the lawsuit challenging it.",
  "Corrected the kiosk requirement. The rule does not set WCAG as the technical standard for kiosks.",
  "Stopped listing an accessibility statement and a complaint process as rule requirements. We still recommend both.",
  "Replaced the missed-deadline recovery plan with steps for using the extra time.",
  "Removed the health insurance exchange row from the coverage table.",
]

export const metadata: Metadata = {
  title: "HHS Section 504 Web Accessibility Deadline: May 2027",
  description: clampDescription(
    "HHS extended the Section 504 web accessibility deadline to May 11, 2027, or May 10, 2028 for recipients with under 15 employees. Who is covered and what to do now."
  ),
  keywords: [
    "Section 504 deadline",
    "HHS Section 504 web rule",
    "Section 504 web accessibility deadline 2027",
    "504 healthcare web compliance",
    "Section 504 May 11 2027",
    "Rehabilitation Act web accessibility",
    "HHS web accessibility rule",
    "healthcare accessibility deadline",
    "Medicaid web accessibility",
    "504 Final Rule WCAG 2.1",
    "HHS funding accessibility",
    "Section 504 vs Title II",
  ],
  alternates: {
    canonical:
      "https://accessibility.build/guides/section-504-web-accessibility-deadline",
  },
  openGraph: {
    title: "HHS Section 504 Web Accessibility Deadline: May 11, 2027",
    description:
      "HHS extended the Section 504 web deadlines by one year. The WCAG 2.1 AA standard did not change, and a federal lawsuit challenges the extension.",
    url: "https://accessibility.build/guides/section-504-web-accessibility-deadline",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: "https://accessibility.build/og-image.png",
        width: 1200,
        height: 630,
        alt: "Section 504 Web Accessibility Deadline: May 11, 2027",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "HHS Section 504 Web Accessibility Deadline: May 11, 2027",
    description:
      "HHS extended the Section 504 web deadlines by one year. Who is covered and what to do now.",
  },
}

const faqs = [
  {
    question: "What is the HHS Section 504 web accessibility rule?",
    answer:
      "It is a May 2024 final rule from the U.S. Department of Health and Human Services under Section 504 of the Rehabilitation Act of 1973. It requires recipients of HHS federal financial assistance to make web content and mobile apps conform to WCAG 2.1 Level AA, with limited exceptions. It also requires kiosks to be accessible, though it does not set WCAG as a technical standard for them.",
  },
  {
    question: "What is the Section 504 web accessibility deadline now?",
    answer:
      "May 11, 2027 for recipients with 15 or more employees, and May 10, 2028 for recipients with fewer than 15. An HHS interim final rule published May 11, 2026 moved both dates back one year from May 11, 2026 and May 10, 2027.",
  },
  {
    question: "Was the Section 504 deadline extended like the DOJ Title II deadline?",
    answer:
      "Yes. The DOJ extended its Title II web rule by interim final rule on April 20, 2026, and HHS followed with its own interim final rule, effective May 7, 2026, citing consistency between the two rules among its reasons. Only the compliance dates changed. WCAG 2.1 AA remains the standard.",
  },
  {
    question: "Could the new date change?",
    answer:
      "It could. The National Federation of the Blind sued in May 2026 to set aside the DOJ and HHS extensions (No. 1:26-cv-02007). The plaintiffs moved for summary judgment on September 28, 2026, and there was no ruling as of October 28, 2026. Treat the 2027 date as the latest safe target, not a guaranteed one.",
  },
  {
    question: "Does the extension mean there are no obligations until 2027?",
    answer:
      "No. HHS states that the delay does not relieve recipients of other Section 504 obligations. They must still make reasonable modifications to avoid disability discrimination, subject to the undue burden and fundamental alteration limits, and must keep their programs and activities accessible. Section 504 is also enforceable through private lawsuits.",
  },
  {
    question: "Who is covered by the rule?",
    answer:
      "Any entity that receives federal financial assistance from HHS. That commonly includes state Medicaid agencies, hospitals that take Medicare or Medicaid, community health centers, state and local public health departments, academic medical centers, HHS-funded research institutions, social services agencies with HHS grants, and many nursing homes. The trigger is the funding, not the type of organization, so check with counsel if your funding is unusual.",
  },
  {
    question: "What technical standard does Section 504 require?",
    answer:
      "WCAG 2.1 Level AA for web content and mobile apps. The rule does not require WCAG 2.2, though auditing against 2.2 covers 2.1 AA as well, apart from the removed 4.1.1 Parsing criterion, and prepares you for later updates.",
  },
  {
    question: "What are the consequences of non-compliance?",
    answer:
      "Section 504 is enforced through HHS funding, so the ultimate sanction is suspension or termination of federal financial assistance. People can also file complaints with the HHS Office for Civil Rights or bring private lawsuits. ADA Title II or Title III may also apply to the same web properties under separate authority.",
  },
  {
    question: "How is Section 504 different from ADA Title II and Title III?",
    answer:
      "Section 504 covers recipients of federal financial assistance. ADA Title II covers state and local governments regardless of funding. ADA Title III covers private businesses that are places of public accommodation. One organization can fall under more than one. A public hospital is typically covered by both Title II and Section 504, and the earlier applicable date is the safer plan: April 26, 2027 for a Title II entity serving 50,000 or more people.",
  },
  {
    question: "What should healthcare organizations do now?",
    answer:
      "Audit patient-facing systems against WCAG 2.1 AA, starting with the portal, scheduling, telehealth, bill-pay and enrollment. Check PDFs and other documents in those journeys. Test mobile apps on iOS and Android. Ask vendors for current conformance reports. Keep a dated remediation plan with owners, and give patients a clear way to report barriers.",
  },
]

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Guides", url: "https://accessibility.build/guides" },
  {
    name: "Section 504 Web Accessibility Deadline",
    url: "https://accessibility.build/guides/section-504-web-accessibility-deadline",
  },
]

export default function Section504DeadlinePage() {
  return (
    <>
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />
      <ArticleStructuredData
        headline="HHS Section 504 Web Accessibility Deadline: May 11, 2027"
        description="HHS extended the Section 504 web accessibility deadlines by one year, to May 11, 2027 and May 10, 2028. Who is covered, what WCAG 2.1 AA requires, and how to use the time."
        author={{
          name: "Accessibility.build Editorial",
          url: "https://accessibility.build/about",
        }}
        publisher={{
          name: "Accessibility.build",
          logo: "https://accessibility.build/android-chrome-512x512.png",
        }}
        datePublished="2026-05-18"
        dateModified={getRouteDate("/guides/section-504-web-accessibility-deadline") ?? "2026-05-18"}
        image="https://accessibility.build/og-image.png"
        url="https://accessibility.build/guides/section-504-web-accessibility-deadline"
        wordCount={1400}
        keywords={[
          "Section 504 deadline",
          "HHS Section 504 web rule",
          "Section 504 May 11 2027",
          "healthcare web accessibility",
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
                    Section 504 Deadline
                  </span>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <header className="mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 text-xs font-semibold uppercase tracking-wide mb-5">
              <span aria-hidden="true">●</span>
              Guide · Corrected October 31, 2026
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-6 leading-tight">
              The Section 504 Web Deadline Moved to May 2027
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              HHS extended the Section 504 web and mobile accessibility
              deadlines by one year. Recipients with 15 or more employees now
              have until May 11, 2027, and smaller recipients until May 10,
              2028. The standard is still WCAG 2.1 Level AA, and a federal
              lawsuit is challenging the extension.
            </p>
            <PageByline route="/guides/section-504-web-accessibility-deadline" variant="hero" />
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
              Corrected October 31, 2026: an earlier version said HHS had not
              extended this deadline.{" "}
              <a href="#changes" className="underline underline-offset-2">
                See what changed
              </a>
              .
            </p>
          </header>

<section className="prose prose-slate dark:prose-invert max-w-none mb-12">
            <h2>The dates at a glance</h2>
            <div className="not-prose rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto my-6" role="region" aria-label="Section 504 compliance dates" tabIndex={0}>
              <table className="w-full text-sm">
                <thead className="bg-slate-100 dark:bg-slate-800">
                  <tr>
                    <th scope="col" className="text-left p-4 font-semibold">Recipient size</th>
                    <th scope="col" className="text-left p-4 font-semibold">Original date</th>
                    <th scope="col" className="text-left p-4 font-semibold">Current date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-slate-200 dark:border-slate-800">
                    <th scope="row" className="text-left p-4 font-medium">15 or more employees</th>
                    <td className="p-4">May 11, 2026</td>
                    <td className="p-4">May 11, 2027</td>
                  </tr>
                  <tr className="border-t border-slate-200 dark:border-slate-800">
                    <th scope="row" className="text-left p-4 font-medium">Fewer than 15 employees</th>
                    <td className="p-4">May 10, 2027</td>
                    <td className="p-4">May 10, 2028</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              The change comes from an{" "}
              <a href="https://www.federalregister.gov/documents/2026/05/11/2026-09266/extension-of-compliance-dates-for-nondiscrimination-on-the-basis-of-disability-accessibility-of-web">
                HHS interim final rule
              </a>{" "}
              published May 11, 2026 and effective May 7, 2026. It changes only
              these two dates. HHS cited recipients&apos; resource and staffing
              limits, litigation risk, and consistency with the{" "}
              <Link href="/guides/doj-title-ii-deadline-extension">
                DOJ Title II extension
              </Link>
              . Public comments closed July 6, 2026.
            </p>

            <h2>Why the date is not settled</h2>
            <p>
              The National Federation of the Blind sued in May 2026 to set
              aside both the DOJ and HHS extensions (No. 1:26-cv-02007). The
              plaintiffs moved for summary judgment on September 28, 2026, and
              there was no ruling as of October 28, 2026. Our{" "}
              <Link href="/research/accessibility-lawsuits">lawsuit tracker</Link>{" "}
              follows the case. Plan to finish early rather than on the last
              permitted day.
            </p>

            <h2>What still applies today</h2>
            <p>
              The extension does not pause Section 504. HHS says recipients
              must still make reasonable modifications to avoid disability
              discrimination, and have an ongoing obligation to keep their
              programs and activities accessible. A patient who cannot use a
              portal can still ask for access or complain, and Section 504 is
              enforceable through private lawsuits. This is general information,
              not legal advice.
            </p>

            <h2>Who is covered</h2>
            <p>
              The trigger is receipt of federal financial assistance from HHS,
              not a particular corporate form or line of business. These are
              common patterns, so confirm your own position with counsel.
            </p>

            <div className="not-prose rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto my-6" role="region" aria-label="Who Section 504 commonly covers" tabIndex={0}>
              <table className="w-full text-sm">
                <thead className="bg-slate-100 dark:bg-slate-800">
                  <tr>
                    <th scope="col" className="text-left p-4 font-semibold">Entity type</th>
                    <th scope="col" className="text-left p-4 font-semibold">Usually covered?</th>
                    <th scope="col" className="text-left p-4 font-semibold">Why</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Hospital taking Medicare or Medicaid", "Yes", "These payments are generally treated as federal financial assistance"],
                    ["State Medicaid agency", "Yes", "Direct HHS funding recipient"],
                    ["FQHC or community health center", "Yes", "HRSA grants are HHS financial assistance"],
                    ["Public university medical center", "Yes, plus Title II", "Covered under both rules, so plan for the earlier date"],
                    ["Nursing home receiving Medicaid", "Yes", "Medicaid reimbursement triggers coverage"],
                    ["Private cash-pay specialty clinic", "Likely no", "Only if it receives HHS grants or other HHS funding"],
                    ["Pharma manufacturer with no HHS grants", "Generally no", "Section 504 does not reach entities without federal financial assistance"],
                  ].map((row) => (
                    <tr key={row[0]} className="border-t border-slate-200 dark:border-slate-800">
                      <th scope="row" className="text-left p-4 font-medium">{row[0]}</th>
                      <td className="p-4">{row[1]}</td>
                      <td className="p-4 text-slate-600 dark:text-slate-400">{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h2>What the rule requires</h2>
            <ul>
              <li>
                <strong>WCAG 2.1 Level AA</strong> for web content and mobile
                apps a recipient provides or makes available, directly or
                through contractual, licensing, or other arrangements.
              </li>
              <li>
                <strong>Accessible kiosks.</strong> The rule covers kiosks
                separately and does not set WCAG as their technical standard.
                WCAG can still be useful guidance for kiosk software.
              </li>
              <li>
                <strong>Limited exceptions</strong>, including certain archived
                web content, preexisting conventional electronic documents,
                content posted by independent third parties, some
                password-protected individualized documents, and social media
                posts made before the compliance date. Read each exception
                closely before relying on it.
              </li>
            </ul>
            <p>
              An accessibility statement and a barrier-reporting route are not
              listed above as rule requirements, but we recommend both because
              they show good faith and surface problems early.
            </p>

            <h2>How to use the extra time</h2>
            <ol>
              <li>
                <strong>Audit what patients use.</strong> Test the patient
                portal, scheduling, telehealth, online bill-pay, and insurance
                enrollment against WCAG 2.1 AA. Our{" "}
                <Link href="/guides/how-to-audit-website-accessibility">
                  step-by-step audit guide
                </Link>{" "}
                explains the method.
              </li>
              <li>
                <strong>Triage by patient impact.</strong> Fix critical barriers
                on patient-facing systems first.
              </li>
              <li>
                <strong>Keep a dated remediation plan.</strong> Track every open
                finding with an owner, severity, deadline, and status.
              </li>
              <li>
                <strong>Publish an honest accessibility statement.</strong>{" "}
                Describe known gaps, target dates, and a contact for reporting
                barriers. Our{" "}
                <Link href="/tools/accessibility-statement-generator">
                  statement generator
                </Link>{" "}
                can start the draft.
              </li>
              <li>
                <strong>Press your vendors.</strong> Ask for a current ACR or
                VPAT and a credible roadmap. Content provided through a vendor
                arrangement can still be your responsibility.
              </li>
              <li>
                <strong>Train the people who ship content.</strong> Developers
                and authors need the basics of semantic HTML, keyboard
                interaction, ARIA, and accessible documents.
              </li>
            </ol>

            <h2>Our view</h2>
            <p>
              The extension gives organizations time, not permission to wait.
              Patients who meet inaccessible portals and telehealth today carry
              the cost of each delay, and the deadline could still change in
              court. Start now, and fix the journeys people depend on first.
            </p>
          </section>

          <section className="mb-16">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                Start your Section 504 audit
              </h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                The first deadline is May 11, 2027, and the standard is WCAG 2.1
                AA. Run the audit and document the plan.
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
                  href="/guides/doj-title-ii-deadline-extension"
                  className="inline-flex items-center px-5 py-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg font-medium border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  Title II Extension
                </Link>
                <Link
                  href="/tools/accessibility-statement-generator"
                  className="inline-flex items-center px-5 py-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg font-medium border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  Statement Generator
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

          <section id="changes" aria-labelledby="changes-heading" className="scroll-mt-24 border-t border-slate-200 pt-8 dark:border-slate-800">
            <h2 id="changes-heading" className="text-xl font-semibold text-slate-900 dark:text-white">
              Changes to this guide
            </h2>
            <h3 className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">October 31, 2026</h3>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-600 dark:text-slate-400">
              {changes.map((change) => (
                <li key={change}>{change}</li>
              ))}
            </ul>
          </section>
        </article>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <RelatedContent
            content="Section 504 HHS healthcare web accessibility WCAG 2.1 AA patient portal Medicaid Rehabilitation Act"
            maxItems={6}
          />
        </section>
      </div>
    </>
  )
}
