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

const pageTitle = "EN 301 549: EU ICT Accessibility Standard Guide"

export const metadata: Metadata = {
  title: pageTitle,
  description:
    clampDescription("EN 301 549 explained: the EU's harmonized ICT accessibility standard, its chapter structure, how it incorporates WCAG 2.1 AA, its role under the EAA and Web Accessibility Directive, and who needs it."),
  keywords: [
    "EN 301 549",
    "EN 301 549 explained",
    "EU accessibility standard",
    "ICT accessibility requirements",
    "EN 301 549 WCAG 2.1",
    "EN 301 549 v3.2.1",
    "harmonized standard accessibility",
    "web accessibility directive standard",
    "EAA technical standard",
    "EN 301 549 chapters",
  ],
  alternates: {
    canonical: "/compliance/en-301-549",
  },
  openGraph: {
    title: pageTitle,
    description:
      "The EU's harmonized ICT accessibility standard: chapter structure (web, documents, software), WCAG 2.1 AA incorporation, versions, and its role under the EAA.",
    url: "/compliance/en-301-549",
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
      "EN 301 549 is the technical standard behind EU accessibility law. What its chapters require, how it maps to WCAG 2.1 AA, and who needs to conform.",
    images: [`/api/og?title=${encodeURIComponent(pageTitle)}&section=Compliance`],
  },
}

const faqs = [
  {
    question: "What is EN 301 549 in plain terms?",
    answer:
      "EN 301 549, 'Accessibility requirements for ICT products and services,' is the European standard that defines what 'accessible' means for technology in EU law. It was developed jointly by the European standards organizations ETSI, CEN, and CENELEC under a mandate from the European Commission. Where US rules point to WCAG for web content, EU laws point to EN 301 549, which itself incorporates WCAG 2.1 Level A and AA for web content and extends similar requirements to documents, software, hardware, and support services. Conforming to it gives a legal presumption that you meet the accessibility requirements of the EU laws that reference it.",
  },
  {
    question: "How does EN 301 549 relate to WCAG 2.1 AA?",
    answer:
      "Chapter 9 of EN 301 549 incorporates the WCAG 2.1 Level A and AA success criteria directly for web content: if your site conforms to WCAG 2.1 AA, you satisfy the web chapter. Chapters 10 (non-web documents) and 11 (software, including mobile apps) apply adapted versions of the same criteria to those contexts. So WCAG 2.1 AA is the core of EN 301 549 but not the whole of it: the standard also covers functional performance, hardware, two-way communication, video capabilities, and documentation and support services that WCAG never addressed.",
  },
  {
    question: "What is the current version of EN 301 549?",
    answer:
      "Version 3.2.1, published in March 2021, is the established baseline and the version harmonized in the Official Journal of the EU for the Web Accessibility Directive. It aligns web, document, and software requirements with WCAG 2.1. ETSI published V4.1.1 on 2 September 2026: it aligns the standard with WCAG 2.2 and adds a dedicated mapping to the European Accessibility Act. V4.1.1 has not yet been cited in the Official Journal; Ireland's National Disability Authority expects the citation on 16 December 2026. Until then no version of EN 301 549 is cited under the EAA, and v3.2.1 remains the version cited for the Web Accessibility Directive. Conformance claims should always name the version they were tested against.",
  },
  {
    question: "Who needs to conform to EN 301 549?",
    answer:
      "Three main groups. First, EU public-sector bodies: the Web Accessibility Directive requires their websites and mobile apps to meet the harmonized standard. Second, businesses covered by the European Accessibility Act (e-commerce, banking, e-books, transport, telecoms, and covered products), since EN 301 549 is the technical benchmark regulators and buyers use, and V4.1.1 is due to become the EAA's harmonised standard once it is cited in the Official Journal. Third, vendors selling ICT to European public-sector buyers, who are routinely asked for EN 301 549 conformance evidence in procurement (the VPAT EU edition exists exactly for this). Non-EU companies serving EU customers in covered sectors are included.",
  },
  {
    question: "Is EN 301 549 a law?",
    answer:
      "No. It is a technical standard, not legislation. Its legal force comes from the laws that reference it: the Web Accessibility Directive (2016/2102) for public-sector websites and apps, and the European Accessibility Act (2019/882) for private-sector products and services. When a version of the standard is cited in the Official Journal of the EU as a harmonized standard, conforming to it creates a presumption of conformity with the corresponding law. You can also comply with those laws by other means, but you then carry the burden of demonstrating the requirements are met without the standard's safe harbor.",
  },
  {
    question: "What do chapters 9, 10, and 11 cover?",
    answer:
      "These are the three chapters most digital teams work with. Chapter 9 (Web) applies WCAG 2.1 A and AA success criteria to web pages. Chapter 10 (Non-web documents) applies adapted WCAG criteria to documents that are not web pages (PDFs, Office files, e-books), whether distributed on the web or elsewhere. Chapter 11 (Software) applies adapted criteria to non-web software, including native mobile and desktop apps, and adds requirements like interoperability with assistive technology and accessible authoring tools. The adaptations mostly replace web-specific wording; the substance of the criteria stays the same.",
  },
  {
    question: "How do I test and document EN 301 549 conformance?",
    answer:
      "For web content, test against WCAG 2.1 AA (or 2.2 AA for headroom) using a combination of automated scanning, manual expert review, and assistive-technology testing; chapter 9 is satisfied by WCAG conformance. For apps and documents, apply the adapted criteria of chapters 11 and 10 respectively. Document the results in an accessibility statement (mandatory for public-sector bodies under the Web Accessibility Directive, and expected under the EAA's service-information requirements) or, for procurement, in an ACR using the VPAT EU edition, which mirrors the standard's clause structure.",
  },
]

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Compliance", url: "https://accessibility.build/compliance" },
  {
    name: "EN 301 549",
    url: "https://accessibility.build/compliance/en-301-549",
  },
]

const chapters = [
  {
    chapter: "Ch. 4–5",
    title: "Functional performance & generic requirements",
    scope: "Usage without vision, with limited hearing, without speech, with limited manipulation or strength, and more; requirements that apply across all ICT",
  },
  {
    chapter: "Ch. 6–7",
    title: "Two-way voice & video capabilities",
    scope: "Real-time text, audio quality, captioning and audio description capabilities for ICT that handles voice or video",
  },
  {
    chapter: "Ch. 8",
    title: "Hardware",
    scope: "Physical ICT: self-service terminals, kiosks, devices with operable parts and displays",
  },
  {
    chapter: "Ch. 9",
    title: "Web",
    scope: "Websites and web applications: incorporates WCAG 2.1 Level A and AA success criteria (WCAG 2.2 in v4.1.1)",
    highlight: true,
  },
  {
    chapter: "Ch. 10",
    title: "Non-web documents",
    scope: "PDFs, Office documents, e-books and other non-web documents, via adapted WCAG criteria",
    highlight: true,
  },
  {
    chapter: "Ch. 11",
    title: "Software",
    scope: "Native mobile and desktop apps and other non-web software, via adapted WCAG criteria plus assistive-technology interoperability",
    highlight: true,
  },
  {
    chapter: "Ch. 12–13",
    title: "Documentation, support & relay services",
    scope: "Accessible product documentation, accessible support channels, and relay/emergency service access",
  },
]

const versions = [
  {
    version: "v1.1.2 (2015)",
    note: "First edition; aligned with WCAG 2.0 for web content",
  },
  {
    version: "v2.1.2 (2018)",
    note: "First version harmonized for the Web Accessibility Directive; introduced WCAG 2.1 alignment",
  },
  {
    version: "v3.1.1 (2019)",
    note: "Restructured and extended requirements across document and software chapters",
  },
  {
    version: "v3.2.1 (2021)",
    note: "Current baseline cited for the Web Accessibility Directive; WCAG 2.1 A/AA for web, documents, and software",
  },
  {
    version: "v4.1.1 (September 2026)",
    note: "Published by ETSI on 2 September 2026: aligns web, document, and software chapters with WCAG 2.2, adds Annex ZB mapping requirements to the EAA, and rewrites the real-time text clause. Not yet cited in the Official Journal (expected December 2026)",
  },
]

export default function EN301549Page() {
  return (
    <>
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />
      <ArticleStructuredData
        headline="EN 301 549: EU ICT Accessibility Standard Guide"
        description="What EN 301 549 is, its chapter structure (web, documents, software), how it incorporates WCAG 2.1 AA, its versions, and its role under the European Accessibility Act and Web Accessibility Directive."
        author={{
          name: "Accessibility.build Editorial",
          url: "https://accessibility.build/about",
        }}
        publisher={{
          name: "Accessibility.build",
          logo: "https://accessibility.build/android-chrome-512x512.png",
        }}
        datePublished="2026-07-09"
        dateModified={getRouteDate("/compliance/en-301-549") ?? "2026-07-09"}
        image="https://accessibility.build/og-image.png"
        url="https://accessibility.build/compliance/en-301-549"
        wordCount={2300}
        keywords={[
          "EN 301 549",
          "EU accessibility standard",
          "ICT accessibility",
          "WCAG 2.1 AA",
          "harmonized standard",
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
                    EN 301 549
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
              Compliance Guide
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-6 leading-tight">
              EN 301 549: The EU&apos;s ICT Accessibility Standard, Explained
            </h1>
            <PageByline route="/compliance/en-301-549" variant="hero" tone="inverse" className="mt-0 mb-5" />
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              EN 301 549 is the harmonized European standard that defines what
              &ldquo;accessible&rdquo; means for technology in EU law. It sits
              behind both the Web Accessibility Directive and the European
              Accessibility Act, incorporates WCAG 2.1 Level AA for web
              content, and extends comparable requirements to documents,
              software, hardware, and support services. If you sell into
              Europe, this is the standard your conformance claims map to.
            </p>
          </header>

          <div
            className="rounded-xl border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-5 mb-12"
            role="note"
          >
            <p className="text-sm text-amber-900 dark:text-amber-200 leading-relaxed">
              <strong>Not legal advice.</strong> This guide is educational
              information about EN 301 549 and the EU laws that reference it,
              not legal advice. Which version of the standard applies, and how,
              depends on the law, the member state, and your product, so consult
              a qualified lawyer for compliance decisions.
            </p>
          </div>

          <section className="prose prose-slate dark:prose-invert max-w-none mb-12">
            <h2>What EN 301 549 is</h2>
            <p>
              Formally titled{" "}
              <em>&ldquo;Accessibility requirements for ICT products and
              services,&rdquo;</em>{" "}
              EN 301 549 is a European standard produced jointly by ETSI, CEN,
              and CENELEC, the three official European standardization
              organizations, under mandates from the European Commission. It
              began life as Europe&apos;s answer to the US Section 508
              standards: a single technical yardstick that public buyers and
              regulators could reference instead of writing their own
              accessibility specifications.
            </p>
            <p>
              Its legal significance comes from <strong>harmonization</strong>.
              When the European Commission cites a version of the standard in
              the Official Journal of the EU as a harmonized standard for a
              given law, conforming to it creates a{" "}
              <strong>presumption of conformity</strong>{" "}with that law&apos;s
              accessibility requirements. That makes EN 301 549 the safe,
              well-lit path to compliance with:
            </p>
            <ul>
              <li>
                the <strong>Web Accessibility Directive</strong> (Directive
                (EU) 2016/2102), which covers EU public-sector websites and
                mobile apps, and
              </li>
              <li>
                the{" "}
                <strong>
                  <Link href="/compliance/eaa">European Accessibility Act</Link>
                </strong>{" "}
                (Directive (EU) 2019/882), which extends accessibility duties
                to private-sector products and services from June 28, 2025. No
                edition is cited under the EAA yet; V4.1.1 is expected to be the
                first, with an Official Journal citation anticipated in December
                2026.
              </li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              How the standard is structured
            </h2>
            <div tabIndex={0} role="region" aria-label="How the standard is structured" className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
              <table className="w-full text-sm">
                <thead className="bg-slate-100 dark:bg-slate-800">
                  <tr>
                    <th scope="col" className="text-left p-4 font-semibold">Chapter</th>
                    <th scope="col" className="text-left p-4 font-semibold">Topic</th>
                    <th scope="col" className="text-left p-4 font-semibold">What it covers</th>
                  </tr>
                </thead>
                <tbody>
                  {chapters.map((row) => (
                    <tr
                      key={row.chapter}
                      className={`border-t border-slate-200 dark:border-slate-800 ${
                        row.highlight ? "bg-blue-50/60 dark:bg-blue-950/20" : ""
                      }`}
                    >
                      <th scope="row" className="text-left p-4 font-medium text-slate-900 dark:text-white align-top whitespace-nowrap">
                        {row.chapter}
                      </th>
                      <td className="p-4 font-medium text-slate-900 dark:text-white align-top whitespace-nowrap">
                        {row.title}
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-400 align-top">
                        {row.scope}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-3">
              Highlighted rows (chapters 9, 10, and 11) are the ones most
              digital product teams work with day to day.
            </p>
          </section>

          <section className="prose prose-slate dark:prose-invert max-w-none mb-12">
            <h2>The WCAG connection</h2>
            <p>
              For web content, EN 301 549 does not reinvent anything:{" "}
              <strong>chapter 9 incorporates the WCAG 2.1 Level A and AA
              success criteria</strong>. A website that conforms to{" "}
              <Link href="/wcag">WCAG 2.1 AA</Link>{" "}satisfies the web chapter
              outright. The standard&apos;s real added value is everywhere
              WCAG stops:
            </p>
            <ul>
              <li>
                <strong>Chapter 10</strong> applies adapted WCAG criteria to
                non-web documents: PDFs, Office files, e-books.
              </li>
              <li>
                <strong>Chapter 11</strong> applies adapted criteria to native
                software and mobile apps, and adds requirements such as
                interoperability with assistive technologies and preservation
                of platform accessibility features.
              </li>
              <li>
                <strong>Functional performance statements</strong> (chapter 4)
                describe outcomes (usable without vision, without hearing,
                with limited manipulation) that act as a benchmark where
                specific technical provisions do not apply.
              </li>
              <li>
                <strong>Chapters 6–8 and 12–13</strong> reach voice and video
                communication, hardware such as kiosks and terminals, product
                documentation, and support services.
              </li>
            </ul>
            <p>
              Since WCAG 2.2 is backwards-compatible with 2.1, auditing against
              the <Link href="/checklists/wcag-2-2">WCAG 2.2 AA checklist</Link>{" "}
              covers the EN 301 549 web baseline while future-proofing your
              conformance as the standard is revised to track newer WCAG
              versions.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              Versions of EN 301 549
            </h2>
            <div tabIndex={0} role="region" aria-label="Versions of EN 301 549" className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
              <table className="w-full text-sm">
                <thead className="bg-slate-100 dark:bg-slate-800">
                  <tr>
                    <th scope="col" className="text-left p-4 font-semibold">Version</th>
                    <th scope="col" className="text-left p-4 font-semibold">What changed</th>
                  </tr>
                </thead>
                <tbody>
                  {versions.map((row) => (
                    <tr key={row.version} className="border-t border-slate-200 dark:border-slate-800">
                      <th scope="row" className="text-left p-4 font-medium text-slate-900 dark:text-white align-top whitespace-nowrap">
                        {row.version}
                      </th>
                      <td className="p-4 text-slate-600 dark:text-slate-400 align-top">
                        {row.note}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-4">
              Version 3.2.1 (March 2021) is the established baseline. Version
              4.1.1, produced under the European Commission&apos;s
              standardisation request M/587 and published on 2 September 2026,
              is the edition aligned to the European Accessibility Act. When
              citing the standard in contracts or conformance reports, always
              name the exact version and check the Official Journal for the
              version currently harmonised for the law you care about.
            </p>
          </section>

          <section className="mb-12" aria-labelledby="v4-heading">
            <h2 id="v4-heading" className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
              EN 301 549 v4: exactly what is changing
            </h2>
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-5 mb-6">
              <p className="text-sm text-blue-900 dark:text-blue-200 leading-relaxed">
                <strong>Status as of 14 October 2026:</strong>{" "}ETSI published EN 301 549
                V4.1.1 (2026-09) on 2 September 2026, after the national vote on the V4.1.0
                final draft. It has NOT yet been cited in the Official Journal; Ireland&apos;s
                National Disability Authority expects that on 16 December 2026. Until then,
                v3.2.1 remains the version cited for the Web Accessibility Directive, and no
                version is cited under the European Accessibility Act, so the EAA&apos;s
                presumption of conformity is not yet available through any edition. Test
                against WCAG 2.2 AA now, and cite the version you tested against.
              </p>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              These changes come from the standard itself, produced by ETSI under the
              Commission&apos;s standardisation request M/587, not from second-hand summaries.
              We read them first in the V4.1.0 final draft and re-checked them against the
              published V4.1.1:
            </p>
            <ul className="space-y-3 text-slate-600 dark:text-slate-400 leading-relaxed list-disc pl-5 mb-4">
              <li>
                <strong className="text-slate-900 dark:text-white">WCAG 2.2 alignment.</strong>{" "}
                Clauses 9 (web), 10 (documents), and 11 (software) are updated to align with
                WCAG 2.2, referenced as the W3C Recommendation of 12 December 2024 and as
                ISO/IEC 40500:2025. WCAG 2.2 is now also an ISO standard, which matters for
                procurement language.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">A dedicated EAA mapping.</strong>{" "}
                A new Annex ZB maps the standard&apos;s requirements to the European
                Accessibility Act across five tables covering products and services, and a new
                clause A.2 lets a specific product or service be evaluated for EAA conformance.
                Today&apos;s v3.2.1 was harmonized for the Web Accessibility Directive; v4 is
                built to serve the EAA directly.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Real-time text rewritten.</strong>{" "}
                Clause 6.2 on real-time text is significantly revised and extended to cover
                total conversation, which connects to the EAA&apos;s June 2027 date for
                accessible answering of 112 emergency communications.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Web Accessibility Directive mapping refreshed.</strong>{" "}
                A new Annex ZA replaces the old Annex A for the 2016/2102 Directive mapping.
              </li>
            </ul>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              That is the summary. The clause-level detail, including the six WCAG 2.2 criteria now
              required, the user-preferences rework, the total conversation and real-time text rewrite
              with its link to the EAA&apos;s 28 June 2027 date for 112 calls, Annex ZB and the clause A.2
              conformance tables, and a migration list for teams on v3.2.1, is in our{" "}
              <Link href="/compliance/en-301-549-v4" className="text-blue-600 dark:text-blue-400 underline underline-offset-2 hover:decoration-2 font-medium">
                EN 301 549 V4.1.1 clause-by-clause guide
              </Link>
              .
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Practical takeaway: if you are remediating now, audit against the{" "}
              <Link href="/checklists/wcag-2-2" className="text-blue-600 dark:text-blue-400 underline underline-offset-2 hover:decoration-2">
                WCAG 2.2 AA checklist
              </Link>{" "}
              rather than 2.1. WCAG 2.2 is backwards-compatible with 2.1, so work done against
              2.2 satisfies today&apos;s v3.2.1 and is already aligned with where v4 lands. To
              work through the standard itself, clause by clause, use our free{" "}
              <Link href="/checklists/en-301-549" className="text-blue-600 dark:text-blue-400 underline underline-offset-2 hover:decoration-2">
                interactive EN 301 549 checklist
              </Link>{" "}
              with both editions, 285 requirements in v3.2.1 and 319 in v4.1.1, every new or changed
              v4 row flagged, product-type and EAA conformance-table scopes, and Excel export.
            </p>
          </section>

          <section className="prose prose-slate dark:prose-invert max-w-none mb-12">
            <h2>Who needs EN 301 549</h2>
            <ul>
              <li>
                <strong>EU public-sector bodies</strong>: websites and mobile
                apps must meet the harmonized standard under the Web
                Accessibility Directive, with a published accessibility
                statement and a feedback mechanism, monitored by national
                authorities.
              </li>
              <li>
                <strong>Businesses covered by the EAA</strong>: e-commerce,
                consumer banking, e-books, telecoms, transport services, and
                manufacturers of covered devices use EN 301 549 conformance as
                their technical benchmark, which becomes a formal
                presumption-of-conformity route once V4.1.1 is cited in the
                Official Journal. See the{" "}
                <Link href="/compliance/eaa">EAA compliance guide</Link> for
                scope and deadlines.
              </li>
              <li>
                <strong>Vendors selling ICT to European public buyers</strong>:
                public procurement rules require accessible ICT, and buyers
                request conformance evidence against the standard, typically as
                an ACR on the VPAT EU edition (the EU counterpart to the US{" "}
                <Link href="/compliance/section-508">Section 508</Link> VPAT).
              </li>
              <li>
                <strong>Non-EU companies serving EU customers</strong>: the
                laws that reference the standard apply based on where the
                product or service is offered, not where the company sits.
              </li>
            </ul>

            <h2>Conforming in practice</h2>
            <p>
              For a typical website or app, EN 301 549 conformance work is
              WCAG conformance work with a wider perimeter: audit web content
              against WCAG 2.1/2.2 AA, apply the adapted criteria to your
              mobile apps and customer-facing documents, verify assistive
              technology compatibility, and make sure support channels and
              documentation are accessible. Then document it (an accessibility
              statement for regulators and users, an ACR for procurement) and
              wire accessibility checks into your release process so
              conformance survives the next sprint. Litigation risk looks
              different in Europe than the US lawsuit wave (tracked in our{" "}
              <Link href="/research/accessibility-lawsuits">
                lawsuit tracker
              </Link>
              ), but regulator complaints and market-surveillance action follow
              the same trail of unfixed barriers.
            </p>
          </section>

          <section className="mb-16">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                Map your product against EN 301 549
              </h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Start with a WCAG audit of your web content, check your PDFs
                against the document requirements, and get expert help
                assembling conformance documentation for EU markets.
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
                <Link href="/compliance" className="text-blue-600 dark:text-blue-400 underline underline-offset-2 hover:decoration-2">
                  All compliance guides by jurisdiction
                </Link>
              </li>
              <li>
                <Link href="/compliance/en-301-549-v4" className="text-blue-600 dark:text-blue-400 underline underline-offset-2 hover:decoration-2">
                  EN 301 549 V4.1.1 clause by clause: what changed
                </Link>
              </li>
              <li>
                <Link href="/compliance/eaa" className="text-blue-600 dark:text-blue-400 underline underline-offset-2 hover:decoration-2">
                  European Accessibility Act compliance guide
                </Link>
              </li>
              <li>
                <Link href="/research/accessibility-laws" className="text-blue-600 dark:text-blue-400 underline underline-offset-2 hover:decoration-2">
                  Global accessibility laws tracker
                </Link>
              </li>
              <li>
                <Link href="/research/accessibility-lawsuits" className="text-blue-600 dark:text-blue-400 underline underline-offset-2 hover:decoration-2">
                  Accessibility lawsuit tracker
                </Link>
              </li>
              <li>
                <Link href="/checklists/wcag-2-2" className="text-blue-600 dark:text-blue-400 underline underline-offset-2 hover:decoration-2">
                  WCAG 2.2 compliance checklist
                </Link>
              </li>
              <li>
                <Link href="/wcag" className="text-blue-600 dark:text-blue-400 underline underline-offset-2 hover:decoration-2">
                  WCAG success criteria explained
                </Link>
              </li>
            </ul>
          </section>
        </article>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <RelatedContent
            content="EN 301 549 EU ICT accessibility standard WCAG 2.1 AA harmonized European Accessibility Act web accessibility directive audit"
            maxItems={6}
          />
        </section>
      </div>
    </>
  )
}
