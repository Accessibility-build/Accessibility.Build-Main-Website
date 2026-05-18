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
    "HHS Section 504 Web Accessibility Deadline (May 11, 2026): The Rule That Wasn't Extended",
  description:
    "The HHS Section 504 web accessibility rule took effect May 11, 2026 — and unlike the DOJ Title II deadline, it was not extended. Here's exactly who's covered, what WCAG 2.1 AA requires, what to do if you missed the deadline, and why HHS holding firm was the right call.",
  keywords: [
    "Section 504 deadline",
    "HHS Section 504 web rule",
    "Section 504 web accessibility deadline 2026",
    "504 healthcare web compliance",
    "Section 504 May 11 2026",
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
    title:
      "HHS Section 504 Web Accessibility Deadline (May 11, 2026): The Rule That Wasn't Extended",
    description:
      "The HHS Section 504 web accessibility rule took effect May 11, 2026 — and unlike Title II, it was not extended. Editorial analysis: HHS made the right call.",
    url: "https://accessibility.build/guides/section-504-web-accessibility-deadline",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: "https://accessibility.build/og-image.png",
        width: 1200,
        height: 630,
        alt: "Section 504 Web Accessibility Deadline — May 11, 2026",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "HHS Section 504 Web Accessibility Deadline (May 11, 2026)",
    description:
      "The Section 504 web rule took effect May 11, 2026 and was not extended. Here's who's covered and what to do.",
  },
}

const faqs = [
  {
    question: "What is the HHS Section 504 web accessibility rule?",
    answer:
      "It's a final rule published by the U.S. Department of Health and Human Services under Section 504 of the Rehabilitation Act of 1973. The rule requires recipients of HHS federal financial assistance to make their web content, mobile applications, and kiosks conform to WCAG 2.1 Level AA. It is the first federal rule to set a specific technical standard for web accessibility on healthcare-adjacent entities, and it carries the full force of Section 504 — meaning loss of federal funding is on the table for non-compliance.",
  },
  {
    question: "When did the Section 504 web rule take effect?",
    answer:
      "The compliance date for most covered entities was May 11, 2026. Smaller entities and certain narrow categories have phased timelines that extend further out, but the May 11, 2026 date applies to the majority of recipients — including most hospitals, state Medicaid agencies, large clinics, and HHS grantees. Unlike the DOJ's parallel Title II rule for state and local governments, the Section 504 deadline was not extended by HHS.",
  },
  {
    question: "Who is actually covered by the rule?",
    answer:
      "Any entity that receives federal financial assistance from HHS is covered. That includes: state Medicaid agencies and their contracted plans, hospitals participating in Medicare and Medicaid (which is effectively every hospital), community health centers (FQHCs), state and local public health departments funded by CDC or HRSA, university hospitals and academic medical centers, federally funded research institutions, social services agencies receiving HHS grants, and most nursing homes and home-health providers. The trigger is HHS funding, not entity type — a private hospital that bills Medicare is covered the same as a public one.",
  },
  {
    question:
      "Was the Section 504 deadline extended like the DOJ Title II deadline?",
    answer:
      "No. The DOJ extended its Title II web rule by one year on April 20, 2026 — pushing those deadlines to April 2027 and 2028. HHS did not follow suit. The Section 504 web accessibility deadline of May 11, 2026 stood. In our editorial view, HHS made the right call. Healthcare access is not a matter of administrative convenience — patients with disabilities have been excluded from telehealth, patient portals, appointment scheduling, and insurance enrollment for years. Extending the deadline would have prolonged real harm.",
  },
  {
    question: "What technical standard does Section 504 require?",
    answer:
      "WCAG 2.1 Level AA, the same standard as the DOJ Title II rule. Conformance is required for web content, mobile applications, and self-service kiosks made available to the public, to beneficiaries of HHS-funded programs, or to employees of covered entities. The rule does not yet require WCAG 2.2, but the gap between the regulatory floor (2.1) and the industry standard (2.2) is widening — auditing against 2.2 is the prudent move.",
  },
  {
    question: "What if my organization missed the May 11, 2026 deadline?",
    answer:
      "First, do not panic and do not stop. Section 504 enforcement typically begins with an HHS Office for Civil Rights complaint, an OCR-led investigation, and an opportunity for voluntary resolution before any funding action. The standard remedy is a corrective action plan with milestones — not immediate defunding. What OCR looks for is good-faith effort, documented progress, and a credible remediation roadmap. Run a complete audit immediately, prioritize the highest-impact patient-facing properties (patient portal, appointment scheduling, telehealth, eligibility and enrollment), publish an honest accessibility statement, and assign owners with deadlines for every open finding.",
  },
  {
    question: "What are the penalties for non-compliance?",
    answer:
      "Section 504 is enforced through HHS funding — the ultimate sanction is suspension or termination of federal financial assistance, which for most hospitals and Medicaid agencies would be existential. In practice, OCR pursues voluntary compliance through resolution agreements with documented corrective action plans before invoking funding penalties. Private plaintiffs can also bring Section 504 actions in federal court seeking injunctive relief and damages. Parallel ADA Title III lawsuits — which are filed at a rate exceeding 3,000 per year in federal court alone — can also reach the same web properties under separate authority.",
  },
  {
    question: "How is Section 504 different from ADA Title II and Title III?",
    answer:
      "Section 504 covers entities receiving federal financial assistance — primarily healthcare. ADA Title II covers state and local government services regardless of funding source. ADA Title III covers private businesses considered places of public accommodation. A given organization can be covered by more than one: a public hospital is typically covered by both Title II (because it's a state entity) and Section 504 (because it bills Medicare). When that happens, the strictest and earliest deadline controls — which, after the April 2026 Title II extension, is Section 504.",
  },
  {
    question: "What should healthcare organizations do this month?",
    answer:
      "Six concrete actions: (1) Audit your patient portal, telehealth platform, appointment scheduling, and online bill-pay against WCAG 2.1 AA — these are the most-complained-about properties. (2) Verify that PDF clinical documents (after-visit summaries, consent forms, lab results) are tagged and screen-reader accessible. (3) Confirm mobile apps for patient access conform to WCAG 2.1 AA on iOS and Android. (4) Publish an updated accessibility statement that honestly describes your conformance status and remediation roadmap. (5) Document training for clinical and IT staff on accessibility obligations. (6) Establish a process to receive and respond to accessibility complaints from patients — OCR specifically looks for this.",
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
        headline="HHS Section 504 Web Accessibility Deadline (May 11, 2026): The Rule That Wasn't Extended"
        description="The HHS Section 504 web accessibility rule took effect May 11, 2026 — and unlike the DOJ Title II deadline, it was not extended. Editorial analysis of who's covered, what WCAG 2.1 AA requires, what to do if you missed the deadline, and why HHS holding firm was the right call."
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
        url="https://accessibility.build/guides/section-504-web-accessibility-deadline"
        wordCount={2300}
        keywords={[
          "Section 504 deadline",
          "HHS Section 504 web rule",
          "Section 504 May 11 2026",
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
              Editorial · Updated May 18, 2026
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-6 leading-tight">
              Section 504 Took Effect May 11. HHS Was Right Not to Extend It.
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              One week ago, on May 11, 2026, the HHS Section 504 web
              accessibility rule took effect for most healthcare entities
              receiving federal funding. Three weeks before that, the
              Department of Justice quietly extended its parallel Title II
              deadline by a year. HHS did not follow suit. In our view, that
              was the correct call — and the contrast tells you everything
              about which agency is treating accessibility as a civil right
              and which is treating it as a policy timeline to manage.
            </p>
          </header>

          <section className="mb-10 rounded-xl border-2 border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/30 p-6">
            <p className="text-sm font-bold uppercase tracking-wide text-emerald-800 dark:text-emerald-200 mb-3">
              Our editorial position
            </p>
            <p className="text-lg text-slate-900 dark:text-white leading-relaxed mb-3">
              Healthcare access is not a matter of administrative convenience.
              Patients with disabilities have been locked out of patient
              portals, telehealth visits, appointment scheduling, and
              insurance enrollment for the entire two decades that those
              systems have existed. Extending the Section 504 deadline would
              have prolonged that exclusion for one more year — long enough,
              given U.S. patient demographics, that tens of thousands of
              people would have died before getting access to their own
              medical records.
            </p>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              HHS did not extend the rule. They were right not to. And if
              your hospital, health system, or Medicaid agency missed the
              deadline, you do not get to argue the rule was unreasonable —
              you get to file an OCR resolution plan and start the work you
              should have started in 2024.
            </p>
          </section>

          <section className="prose prose-slate dark:prose-invert max-w-none mb-12">
            <h2>The two-rule landscape, in one paragraph</h2>
            <p>
              There are two federal web accessibility rules currently in
              force in the United States. The{" "}
              <Link href="/guides/doj-title-ii-deadline-extension">
                DOJ Title II rule
              </Link>{" "}
              covers state and local government services; its deadlines were
              pushed to April 2027 and April 2028 by an Interim Final Rule on
              April 20, 2026. The <strong>HHS Section 504 rule</strong>{" "}
              covers entities receiving HHS funding; its compliance date was
              May 11, 2026, and HHS did not extend it. Both rules require
              WCAG 2.1 Level AA. Entities subject to both — most notably
              public hospitals and state university medical centers — must
              meet the earlier of the two, which is now Section 504.
            </p>

            <h2>Who is covered</h2>
            <p>
              The Section 504 rule is broader than most healthcare leaders
              realize. The trigger is receipt of federal financial assistance
              from HHS — not a particular corporate form, not a particular
              size, not a particular line of business. In practice:
            </p>

            <div className="not-prose rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6">
              <table className="w-full text-sm">
                <thead className="bg-slate-100 dark:bg-slate-800">
                  <tr>
                    <th scope="col" className="text-left p-4 font-semibold">
                      Entity type
                    </th>
                    <th scope="col" className="text-left p-4 font-semibold">
                      Covered?
                    </th>
                    <th scope="col" className="text-left p-4 font-semibold">
                      Why
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    [
                      "Hospital billing Medicare/Medicaid",
                      "Yes",
                      "Medicare/Medicaid reimbursement is federal financial assistance",
                    ],
                    [
                      "State Medicaid agency",
                      "Yes",
                      "Direct HHS funding recipient",
                    ],
                    [
                      "FQHC / community health center",
                      "Yes",
                      "HRSA grants are HHS financial assistance",
                    ],
                    [
                      "Public university medical center",
                      "Yes (Title II + 504)",
                      "Covered under both rules; earlier deadline controls",
                    ],
                    [
                      "Nursing home receiving Medicaid",
                      "Yes",
                      "Medicaid reimbursement triggers coverage",
                    ],
                    [
                      "Private cash-pay specialty clinic",
                      "Likely no",
                      "Only if it receives HHS grants or federal funding",
                    ],
                    [
                      "Health insurance issuer on a federal exchange",
                      "Yes",
                      "ACA marketplace participation involves federal assistance",
                    ],
                    [
                      "Pharma manufacturer (no HHS grants)",
                      "Generally no",
                      "Section 504 doesn't reach unfunded private entities",
                    ],
                  ].map((row) => (
                    <tr key={row[0]} className="border-t border-slate-200 dark:border-slate-800">
                      <th scope="row" className="text-left p-4 font-medium">
                        {row[0]}
                      </th>
                      <td className="p-4">{row[1]}</td>
                      <td className="p-4 text-slate-600 dark:text-slate-400">
                        {row[2]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h2>What the rule actually requires</h2>
            <ul>
              <li>
                <strong>WCAG 2.1 Level AA conformance</strong> on all web
                content and mobile applications made available to the public,
                to program beneficiaries, or to employees.
              </li>
              <li>
                <strong>Accessible self-service kiosks</strong> — registration
                kiosks, payment kiosks, lobby check-in tablets, telehealth
                kiosks.
              </li>
              <li>
                <strong>Accessible electronic documents</strong> — after-visit
                summaries, consent forms, billing statements, lab results, and
                clinical patient education materials distributed
                electronically.
              </li>
              <li>
                <strong>Accessible third-party tools</strong> used by the
                covered entity. Using an inaccessible vendor product does not
                shift liability away from the funded recipient — you are
                responsible for what you procure.
              </li>
              <li>
                <strong>An accessibility statement and a complaint
                process</strong> that allows patients to report barriers and
                receive timely response.
              </li>
            </ul>

            <h2>Why we&apos;re calling HHS holding firm the right move</h2>
            <p>
              Three reasons, in plain language:
            </p>
            <ol>
              <li>
                <strong>The harm is concrete and immediate.</strong> When a
                patient portal is inaccessible, a blind patient cannot view
                their own lab results without asking a sighted person to read
                them aloud. When telehealth is inaccessible, deaf patients
                cannot use it at all. When online appointment scheduling is
                inaccessible, motor-impaired patients call a phone line that
                is understaffed and routes to voicemail. These are not
                abstract failures of compliance. They are daily exclusions
                from healthcare.
              </li>
              <li>
                <strong>The rule was published in May 2024.</strong> Covered
                entities had a full two years of notice. Major healthcare
                vendor platforms — Epic, Cerner, the patient portal layers,
                the telehealth providers — published WCAG 2.1 AA roadmaps in
                2024 and 2025. Any health system that did not start the work
                in that window made a choice. The deadline was not a
                surprise.
              </li>
              <li>
                <strong>Federal funding is the right enforcement tool for
                this category of entity.</strong> Section 504 enforcement is
                slower and more deliberate than Title III litigation —
                exactly because it can reach the funding stream. Extending
                the deadline would have signaled that HHS is not willing to
                use that tool. Holding firm signals the opposite.
              </li>
            </ol>

            <h2>If you missed the deadline: a six-step recovery plan</h2>
            <ol>
              <li>
                <strong>Stop guessing about conformance.</strong> Run a real
                WCAG 2.1 AA audit on your patient portal, scheduling platform,
                telehealth, online bill-pay, and insurance enrollment. Use
                our{" "}
                <Link href="/guides/how-to-audit-website-accessibility">
                  step-by-step audit guide
                </Link>{" "}
                or paste findings into the{" "}
                <Link href="/tools/accessibility-audit-helper">
                  AI Audit Helper
                </Link>{" "}
                to map them to specific success criteria.
              </li>
              <li>
                <strong>Triage by patient impact.</strong> Fix critical and
                high-severity issues on patient-facing systems first.
                Administrative back-end tools can wait.
              </li>
              <li>
                <strong>Document the corrective action plan.</strong> Put
                every open finding into a tracked backlog with owner,
                severity, deadline, and status. This is what OCR will ask for
                if a complaint is filed.
              </li>
              <li>
                <strong>Publish an honest accessibility statement.</strong>{" "}
                Document current conformance level, known gaps, and target
                resolution dates. Provide a clearly-labeled contact for
                accessibility complaints. Use our{" "}
                <Link href="/tools/accessibility-statement-generator">
                  statement generator
                </Link>
                .
              </li>
              <li>
                <strong>Press your vendors.</strong> If your patient portal
                vendor cannot provide a current ACR / VPAT or a credible
                WCAG 2.1 AA conformance roadmap, escalate to your contract
                manager. Vendor non-conformance does not insulate you from
                Section 504 liability.
              </li>
              <li>
                <strong>Train the team that ships the website.</strong>{" "}
                Section 504 violations are usually shipped, not designed.
                Developers and content authors need to understand the basics
                of semantic HTML, ARIA, keyboard interaction, and accessible
                document authoring.
              </li>
            </ol>

            <h2>Where we stand</h2>
            <p>
              The contrast between the DOJ Title II extension and HHS holding
              the Section 504 line is the most consequential accessibility
              policy moment of 2026. One agency decided that institutional
              pushback was sufficient reason to defer civil rights
              enforcement by a year. The other agency decided that patients
              with disabilities cannot wait another year for access to their
              own healthcare. We are unambiguously on HHS&apos;s side of that
              contrast, and we will say so in every audit we publish, every
              report we deliver, and every statement we draft.
            </p>
            <p>
              If you are running a covered healthcare entity and you did the
              work on time: thank you. Your patients noticed, even if the
              policy headlines did not.
            </p>
            <p>
              If you did not: file the OCR resolution paperwork honestly,
              start the audit this week, and treat the next ninety days as
              the most important accessibility sprint your organization will
              run this decade.
            </p>
          </section>

          <section className="mb-16">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                Start your Section 504 recovery audit
              </h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                The deadline already passed. The standard is WCAG 2.1 AA.
                Run the audit and document the plan.
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
