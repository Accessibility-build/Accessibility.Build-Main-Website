import type { Metadata } from "next"
import Link from "next/link"
import {
  ArticleStructuredData,
  FAQStructuredData,
  BreadcrumbStructuredData,
} from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"

const pageTitle = "Section 508 Compliance: Requirements & VPAT Guide"

export const metadata: Metadata = {
  title: pageTitle,
  description:
    "Who must comply with Section 508, what the 2017 refresh requires (WCAG 2.0 AA), how VPATs and ACRs work, Trusted Tester testing, and how 508 differs from the ADA.",
  keywords: [
    "section 508 compliance",
    "section 508 requirements",
    "VPAT",
    "accessibility conformance report",
    "ACR",
    "section 508 refresh",
    "trusted tester",
    "section 508 vs ADA",
    "federal accessibility requirements",
    "508 compliance testing",
  ],
  alternates: {
    canonical: "/compliance/section-508",
  },
  openGraph: {
    title: pageTitle,
    description:
      "Section 508 explained: federal agency and vendor obligations, the 2017 refresh incorporating WCAG 2.0 AA, VPAT/ACR documentation, and Trusted Tester testing.",
    url: "/compliance/section-508",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: `/api/og?title=${encodeURIComponent(pageTitle)}&section=Compliance`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description:
      "Federal agencies and vendors selling to them must meet Section 508. What the standards require, how VPATs work, and how 508 relates to WCAG and the ADA.",
    images: [`/api/og?title=${encodeURIComponent(pageTitle)}&section=Compliance`],
  },
}

const faqs = [
  {
    question: "Who is required to comply with Section 508?",
    answer:
      "Section 508 directly binds US federal agencies: any information and communications technology (ICT) they develop, procure, maintain, or use must be accessible. It reaches the private sector through procurement — vendors selling ICT to the federal government must show their products conform, because agencies are required to buy accessible technology and write accessibility into contracts through the Federal Acquisition Regulation (FAR). Many state governments and universities also adopt Section 508 or equivalent standards, often as a condition of federal funding under the Assistive Technology Act, so the standard's practical reach is much wider than the federal government itself.",
  },
  {
    question: "What standard does Section 508 actually require?",
    answer:
      "The Revised 508 Standards — the 2017 refresh published by the US Access Board — incorporate WCAG 2.0 Level A and Level AA by reference. Uniquely, they apply those criteria not just to websites but also to non-web electronic documents (PDFs, Word files, presentations) and software. The standards also include hardware requirements, functional performance criteria for cases the technical requirements do not cover, and requirements for support documentation and services. Compliance with the refresh became required on January 18, 2018.",
  },
  {
    question: "What is the difference between Section 508 and the ADA?",
    answer:
      "They cover different actors. Section 508 (part of the Rehabilitation Act of 1973) applies to federal agencies and, via procurement, their vendors — with an explicit technical standard (WCAG 2.0 AA). The ADA applies to state and local governments (Title II) and businesses open to the public (Title III), and is enforced largely through DOJ action and private lawsuits. The DOJ's 2024 Title II rule requires WCAG 2.1 AA for state and local government web content, and courts routinely reference WCAG in Title III cases, so the two regimes are converging on the same technical family — but a private business is sued under the ADA, not Section 508.",
  },
  {
    question: "What is a VPAT and how is it different from an ACR?",
    answer:
      "A VPAT (Voluntary Product Accessibility Template) is the blank template published by the Information Technology Industry Council (ITI) for reporting how a product conforms to accessibility standards. Once a vendor fills it in with conformance results for a specific product and version, the completed document is an ACR (Accessibility Conformance Report). In practice people say 'VPAT' for both, but procurement officers increasingly ask for the ACR by name. The template comes in four editions: VPAT 508 (Revised 508 Standards), VPAT WCAG, VPAT EU (EN 301 549), and VPAT INT, which combines all three.",
  },
  {
    question: "Do I need a VPAT to sell software to the federal government?",
    answer:
      "There is no law that says 'you must have a VPAT,' but in practice you will not get far without one. Agencies must evaluate ICT accessibility during procurement, and a current, credible ACR is the standard evidence they request in solicitations. A vague or obviously inflated ACR is a real liability: agencies compare claims against their own testing (often using the DHS Trusted Tester process), and misrepresenting conformance can disqualify a bid or create contract disputes. The strongest position is an ACR based on documented testing by qualified evaluators, refreshed for each major release.",
  },
  {
    question: "Does Section 508 require WCAG 2.1 or 2.2?",
    answer:
      "Formally, no — the Revised 508 Standards still incorporate WCAG 2.0 Level AA, and that remains the legal baseline unless and until the Access Board updates the rule. In practice, many agencies ask for WCAG 2.1 or 2.2 conformance in solicitations, the DOJ's ADA Title II rule requires WCAG 2.1 AA for state and local governments, and WCAG 2.x is backwards-compatible: content that meets 2.2 AA also meets 2.0 AA. Building and testing against WCAG 2.2 AA is the pragmatic way to satisfy Section 508 today and stay aligned with where requirements are heading.",
  },
  {
    question: "What is the Trusted Tester program?",
    answer:
      "Trusted Tester is a standardized manual test process created by the Department of Homeland Security (DHS) for evaluating conformance with the Revised 508 Standards. Version 5 of the process is aligned with the ICT Testing Baseline for Web and uses defined test steps and the free ANDI browser tool, so two certified testers evaluating the same page should reach the same result. DHS offers free online training and certification, and many agencies require or prefer Trusted Tester results when validating vendor ACRs. It is a conformance-testing method, not a substitute for usability testing with people with disabilities.",
  },
  {
    question: "What happens if a federal agency's technology is not accessible?",
    answer:
      "Section 508 gives individuals with disabilities the right to file an administrative complaint with the agency concerned, using the same complaint process as Section 504 of the Rehabilitation Act, and to bring a private lawsuit for injunctive relief and attorney's fees. Federal employees can raise accessibility barriers through internal EEO processes. Agencies also report on 508 conformance to the General Services Administration and OMB, so persistent failures carry oversight and reputational consequences in addition to legal ones. For vendors, the practical penalty is commercial: inaccessible products lose federal deals.",
  },
]

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Compliance", url: "https://accessibility.build/compliance" },
  {
    name: "Section 508",
    url: "https://accessibility.build/compliance/section-508",
  },
]

const vpatEditions = [
  {
    edition: "VPAT 508",
    standard: "Revised Section 508 Standards (incorporating WCAG 2.0 AA)",
    audience: "US federal procurement",
  },
  {
    edition: "VPAT WCAG",
    standard: "WCAG 2.0 / 2.1 / 2.2 (Level A, AA, AAA)",
    audience: "Commercial buyers, states, global customers",
  },
  {
    edition: "VPAT EU",
    standard: "EN 301 549 (EU harmonized ICT standard)",
    audience: "EU public procurement, EAA-covered markets",
  },
  {
    edition: "VPAT INT",
    standard: "All of the above in one report",
    audience: "Vendors selling into multiple jurisdictions",
  },
]

const adaComparison = [
  {
    dimension: "Who it binds",
    s508: "Federal agencies + vendors via procurement",
    ada: "State/local governments (Title II), businesses open to the public (Title III)",
  },
  {
    dimension: "Technical standard",
    s508: "WCAG 2.0 AA (Revised 508 Standards, 2017)",
    ada: "WCAG 2.1 AA for Title II (2024 DOJ rule); no codified standard for Title III",
  },
  {
    dimension: "What is covered",
    s508: "All ICT: web, documents, software, hardware, support services",
    ada: "Websites, mobile apps, and other services of covered entities",
  },
  {
    dimension: "How it is enforced",
    s508: "Administrative complaints, private suits, procurement leverage, agency oversight",
    ada: "DOJ enforcement and private lawsuits (thousands filed per year)",
  },
]

const testingApproaches = [
  {
    name: "DHS Trusted Tester (manual)",
    text: "A standardized, repeatable manual process (v5) aligned with the ICT Testing Baseline, using the free ANDI tool. Certification available through DHS. The de facto benchmark for validating 508 conformance claims.",
  },
  {
    name: "Automated scanning",
    text: "Automated tools catch roughly a third of WCAG failures — missing alt text, contrast, form labels — quickly and at scale. Essential for regression coverage, insufficient alone for a conformance claim.",
  },
  {
    name: "Assistive technology testing",
    text: "Hands-on testing with screen readers (JAWS, NVDA, VoiceOver), magnification, and keyboard-only navigation confirms that content is usable, not just technically conformant.",
  },
  {
    name: "Document and software review",
    text: "Section 508 uniquely applies WCAG to non-web documents and software, so PDFs, Office files, and installed applications need their own test passes.",
  },
]

export default function Section508CompliancePage() {
  return (
    <>
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />
      <ArticleStructuredData
        headline="Section 508 Compliance: Requirements & VPAT Guide"
        description="Who must comply with Section 508, what the 2017 refresh requires, how it relates to WCAG 2.1/2.2 and the ADA, how VPATs and ACRs work, and how conformance is tested."
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
        url="https://accessibility.build/compliance/section-508"
        wordCount={2500}
        keywords={[
          "section 508 compliance",
          "VPAT",
          "accessibility conformance report",
          "trusted tester",
          "federal accessibility",
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
                  <Link href="/compliance" className="hover:text-blue-600 transition-colors">
                    Compliance
                  </Link>
                </li>
                <li aria-hidden="true" className="text-slate-400">/</li>
                <li>
                  <span className="text-slate-900 dark:text-white font-medium">
                    Section 508
                  </span>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <header className="mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-200 text-xs font-semibold uppercase tracking-wide mb-5">
              <span aria-hidden="true">●</span>
              Compliance Guide · Updated July 2026
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-6 leading-tight">
              Section 508 Compliance: Requirements, VPATs, and Testing
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              Section 508 of the Rehabilitation Act requires US federal
              agencies to make their information and communications technology
              accessible — and because agencies must buy accessible
              technology, it effectively binds every vendor that sells
              software, hardware, or content to the federal government. Here is
              what the standards require, how VPATs and ACRs work, and how
              conformance is actually tested.
            </p>
          </header>

          <div
            className="rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-5 mb-12"
            role="note"
          >
            <p className="text-sm text-amber-900 dark:text-amber-200 leading-relaxed">
              <strong>Not legal advice.</strong> This guide is educational
              information about Section 508, not legal advice. Procurement
              obligations and agency-specific requirements vary; consult a
              qualified attorney or your contracting officer for decisions
              about specific solicitations or complaints.
            </p>
          </div>

          <section className="prose prose-slate dark:prose-invert max-w-none mb-12">
            <h2>What Section 508 is</h2>
            <p>
              Section 508 is a provision of the Rehabilitation Act of 1973,
              added in 1986 and given real teeth by the Workforce Investment
              Act amendments of 1998. It requires that when federal agencies
              develop, procure, maintain, or use information and communications
              technology (ICT), that technology must be accessible to people
              with disabilities — both federal employees and members of the
              public — comparably to the access available to everyone else.
            </p>
            <p>
              &ldquo;ICT&rdquo; is deliberately broad: public websites,
              internal web applications, desktop and mobile software,
              electronic documents, multimedia, kiosks, copiers, phones, and
              the support documentation and services that come with them.
            </p>

            <h2>The 2017 refresh: WCAG 2.0 AA becomes the baseline</h2>
            <p>
              The US Access Board published the{" "}
              <strong>Revised 508 Standards</strong> in January 2017, with
              compliance required from January 18, 2018. The refresh did three
              important things:
            </p>
            <ul>
              <li>
                <strong>Incorporated WCAG 2.0 Level A and AA by reference</strong>{" "}
                as the technical standard for web content — aligning US federal
                requirements with the international standard instead of
                maintaining a separate checklist.
              </li>
              <li>
                <strong>Extended WCAG beyond the web.</strong> The refresh
                applies WCAG 2.0 success criteria to non-web electronic
                documents (PDFs, Word files, spreadsheets, presentations) and
                to software, not just websites.
              </li>
              <li>
                <strong>Reorganized around functionality.</strong> Requirements
                follow what the technology does rather than rigid product
                categories, with functional performance criteria as a backstop
                where technical provisions do not address a barrier. The same
                rulemaking also refreshed the Section 255 guidelines for
                telecommunications equipment.
              </li>
            </ul>

            <h2>How Section 508 relates to WCAG 2.1, 2.2, and the ADA</h2>
            <p>
              The legal baseline is still WCAG 2.0 AA, but the ecosystem has
              moved on. The DOJ&apos;s 2024 ADA Title II rule requires{" "}
              <strong>WCAG 2.1 AA</strong> for state and local government web
              content, agencies increasingly write WCAG 2.1 or 2.2 into
              solicitations, and{" "}
              <Link href="/wcag">WCAG 2.x versions are backwards-compatible</Link>{" "}
              — content that conforms to 2.2 AA also conforms to 2.0 AA.
              Testing against the{" "}
              <Link href="/checklists/wcag-2-2">WCAG 2.2 AA checklist</Link>{" "}
              therefore satisfies today&apos;s 508 baseline while covering the
              criteria buyers are starting to demand.
            </p>
          </section>

          <section className="mb-12">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              Section 508 vs. the ADA
            </h3>
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-sm">
                <thead className="bg-slate-100 dark:bg-slate-800">
                  <tr>
                    <th scope="col" className="text-left p-4 font-semibold"><span className="sr-only">Dimension</span></th>
                    <th scope="col" className="text-left p-4 font-semibold">Section 508</th>
                    <th scope="col" className="text-left p-4 font-semibold">ADA</th>
                  </tr>
                </thead>
                <tbody>
                  {adaComparison.map((row) => (
                    <tr key={row.dimension} className="border-t border-slate-200 dark:border-slate-800">
                      <th scope="row" className="text-left p-4 font-medium text-slate-900 dark:text-white align-top whitespace-nowrap">
                        {row.dimension}
                      </th>
                      <td className="p-4 text-slate-600 dark:text-slate-400 align-top">
                        {row.s508}
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-400 align-top">
                        {row.ada}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
              Private businesses are sued under the ADA, not Section 508 — see
              our{" "}
              <Link href="/research/accessibility-lawsuits" className="text-blue-600 dark:text-blue-400 hover:underline">
                accessibility lawsuit tracker
              </Link>{" "}
              for the litigation data, and the{" "}
              <Link href="/compliance/ada" className="text-blue-600 dark:text-blue-400 hover:underline">
                ADA compliance guide
              </Link>{" "}
              for that side of US law.
            </p>
          </section>

          <section className="prose prose-slate dark:prose-invert max-w-none mb-12">
            <h2>VPATs and ACRs: the paperwork of 508 compliance</h2>
            <p>
              If you sell to the federal government, the question you will hear
              is &ldquo;can you send us your VPAT?&rdquo; The{" "}
              <strong>Voluntary Product Accessibility Template (VPAT)</strong>{" "}
              is a standardized template maintained by the Information
              Technology Industry Council (ITI). A vendor fills it in —
              criterion by criterion: <em>Supports</em>,{" "}
              <em>Partially Supports</em>, <em>Does Not Support</em>, or{" "}
              <em>Not Applicable</em>, with remarks — and the completed
              document is an{" "}
              <strong>Accessibility Conformance Report (ACR)</strong> for that
              product and version.
            </p>
            <p>
              A credible ACR is based on actual testing, names the evaluation
              methods used, is specific in its remarks, and is updated for each
              major release. Agencies compare ACR claims against their own
              testing, so an inflated report is worse than an honest one that
              documents known gaps and a remediation plan.
            </p>
          </section>

          <section className="mb-12">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              The four VPAT editions
            </h3>
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-sm">
                <thead className="bg-slate-100 dark:bg-slate-800">
                  <tr>
                    <th scope="col" className="text-left p-4 font-semibold">Edition</th>
                    <th scope="col" className="text-left p-4 font-semibold">Standard covered</th>
                    <th scope="col" className="text-left p-4 font-semibold">Typical audience</th>
                  </tr>
                </thead>
                <tbody>
                  {vpatEditions.map((row) => (
                    <tr key={row.edition} className="border-t border-slate-200 dark:border-slate-800">
                      <th scope="row" className="text-left p-4 font-medium text-slate-900 dark:text-white align-top whitespace-nowrap">
                        {row.edition}
                      </th>
                      <td className="p-4 text-slate-600 dark:text-slate-400 align-top">
                        {row.standard}
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-400 align-top">
                        {row.audience}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
              Selling into the EU as well? The VPAT EU edition maps to{" "}
              <Link href="/compliance/en-301-549" className="text-blue-600 dark:text-blue-400 hover:underline">
                EN 301 549
              </Link>
              , the standard behind the{" "}
              <Link href="/compliance/eaa" className="text-blue-600 dark:text-blue-400 hover:underline">
                European Accessibility Act
              </Link>
              .
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              How Section 508 conformance is tested
            </h2>
            <div className="space-y-4">
              {testingApproaches.map((approach) => (
                <div
                  key={approach.name}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 p-5"
                >
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                    {approach.name}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    {approach.text}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-4">
              A defensible ACR combines all four: automated coverage for scale,
              Trusted Tester-style manual evaluation for rigor, assistive
              technology passes for real-world usability, and document/software
              review for the non-web scope that makes Section 508 unusual.
            </p>
          </section>

          <section className="mb-16">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                Preparing an ACR or a federal bid?
              </h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Get a documented WCAG audit you can stand behind in
                procurement, scan your product for the failures automated
                checks can find, and check your PDFs — Section 508 covers
                documents too.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/services/accessibility-audits"
                  className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Professional Accessibility Audit
                </Link>
                <Link
                  href="/tools/url-accessibility-auditor"
                  className="inline-flex items-center px-5 py-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg font-medium border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  Scan Your Site Free
                </Link>
                <Link
                  href="/tools/pdf-accessibility-checker"
                  className="inline-flex items-center px-5 py-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg font-medium border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  PDF Accessibility Checker
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
                    <span
                      aria-hidden="true"
                      className="text-slate-400 group-open:rotate-180 transition-transform flex-shrink-0"
                    >
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

          <section className="mb-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              Keep exploring
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <li>
                <Link href="/compliance" className="text-blue-600 dark:text-blue-400 hover:underline">
                  All compliance guides by jurisdiction
                </Link>
              </li>
              <li>
                <Link href="/compliance/ada" className="text-blue-600 dark:text-blue-400 hover:underline">
                  ADA web accessibility compliance guide
                </Link>
              </li>
              <li>
                <Link href="/research/accessibility-laws" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Global accessibility laws tracker
                </Link>
              </li>
              <li>
                <Link href="/research/accessibility-lawsuits" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Accessibility lawsuit tracker
                </Link>
              </li>
              <li>
                <Link href="/checklists/wcag-2-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                  WCAG 2.2 compliance checklist
                </Link>
              </li>
              <li>
                <Link href="/wcag" className="text-blue-600 dark:text-blue-400 hover:underline">
                  WCAG success criteria explained
                </Link>
              </li>
            </ul>
          </section>
        </article>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <RelatedContent
            content="section 508 compliance VPAT accessibility conformance report federal procurement trusted tester WCAG audit"
            maxItems={6}
          />
        </section>
      </div>
    </>
  )
}
