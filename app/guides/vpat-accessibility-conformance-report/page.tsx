import type { Metadata } from "next"
import Link from "next/link"
import { BreadcrumbStructuredData, FAQStructuredData } from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"

const ogTitle = encodeURIComponent("VPAT & ACR Guide: How to Read and Produce One")

export const metadata: Metadata = {
  title: "VPAT & ACR Guide: How to Read and Produce One",
  description:
    "What a VPAT is, how it differs from an ACR, the four editions (508, EU, WCAG, INT), how buyers read one, and how to produce a report that survives scrutiny.",
  keywords: [
    "vpat",
    "accessibility conformance report",
    "acr",
    "vpat template",
    "how to create a vpat",
    "vpat 508",
    "vpat en 301 549",
    "vpat wcag",
    "read a vpat",
  ],
  alternates: {
    canonical: "/guides/vpat-accessibility-conformance-report",
  },
  openGraph: {
    title: "VPAT & ACR Guide: How to Read and Produce One",
    description:
      "What a VPAT is, how it differs from an ACR, the four editions (508, EU, WCAG, INT), how buyers read one, and how to produce a report that survives scrutiny.",
    url: "/guides/vpat-accessibility-conformance-report",
    type: "article",
    images: [
      {
        url: `/api/og?title=${ogTitle}&section=Guides`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VPAT & ACR Guide: How to Read and Produce One",
    description:
      "The VPAT template, the ACR it becomes, the four editions, a buyer's reading checklist, and the five-step process for producing a credible report.",
    images: [
      {
        url: `/api/og?title=${ogTitle}&section=Guides`,
        width: 1200,
        height: 630,
      },
    ],
  },
}

const faqs = [
  {
    question: "What is the difference between a VPAT and an ACR?",
    answer:
      "The VPAT (Voluntary Product Accessibility Template) is the blank template, published free of charge by the Information Technology Industry Council (ITI). An ACR (Accessibility Conformance Report) is what you get when a vendor fills that template in for a specific product: a completed report stating, criterion by criterion, how the product conforms. In everyday procurement conversation the words blur together, and a buyer who says 'send me your VPAT' almost always means the completed ACR, not the empty form.",
  },
  {
    question: "Is a VPAT legally required?",
    answer:
      "No statute says 'you must publish a VPAT.' The pressure is contractual. Section 508 obliges US federal agencies to buy accessible information and communications technology, so agency procurement teams ask vendors for ACRs as evidence, and Section508.gov documents that process. State and local governments, universities, and large enterprises make similar demands in RFPs and vendor reviews. In Europe, public procurement references EN 301 549, and the European Accessibility Act is pushing accessibility documentation into private-sector purchasing too. In practice, if you sell software to these buyers, you will be asked for one.",
  },
  {
    question: "Which VPAT edition do I need?",
    answer:
      "It depends on who is asking. US federal buyers want the VPAT 508 edition, which maps the Revised Section 508 standards. European buyers increasingly want the VPAT EU edition, which maps EN 301 549. Commercial buyers with no statutory hook often accept the VPAT WCAG edition, which reports against WCAG alone. If you sell into several of these markets, the VPAT INT edition combines all three standards in one document, so you maintain a single report instead of three.",
  },
  {
    question: "Can I fill in a VPAT myself?",
    answer:
      "Yes. The template is free, and nothing stops a vendor from completing it internally. The catch is credibility: a self-reported ACR is only as good as the testing behind it, and experienced buyers know that. Third-party-produced ACRs, based on independent testing, carry more weight in procurement review than self-assessments. If you do self-report, document your testing methodology and write specific remarks; a self-produced ACR with named components, known defects, and a described test process reads far better than a vague one.",
  },
  {
    question: "How much testing does an ACR need behind it?",
    answer:
      "Enough to actually know the answers you are writing down: automated scanning, manual testing against each criterion, and assistive technology testing with tools such as screen readers. An ACR written without testing behind it is fiction, and it tends to show. Automated tools alone cannot evaluate most WCAG criteria, so a report generated purely from a scanner is incomplete by construction. The testing is the substance; the ACR is just the format that reports it.",
  },
  {
    question: "How often should an ACR be updated?",
    answer:
      "An ACR should be dated and versioned against a specific product release, and updated whenever the product changes materially: a redesign, a new module, a framework migration, or significant remediation work. A report that names no product version, or that is several years and many releases old, tells a careful buyer very little about the product they would actually be licensing. Treat the ACR as living documentation that tracks the product, not a one-time artifact.",
  },
  {
    question: "Does an ACR certify my product as accessible?",
    answer:
      "No. A VPAT or ACR is disclosure, not certification. There is no official accessibility certification body for WCAG, so no document can 'certify' WCAG conformance in any formal sense. An ACR documents where the product stands, including where it falls short, and that honesty is precisely what makes a good one useful. It does not make the product compliant with any law, and it does not immunize the vendor; it gives buyers the information they need to evaluate and gives the vendor a defensible record of transparency.",
  },
]

export default function VpatAcrGuidePage() {
  return (
    <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "Guides", url: "https://accessibility.build/guides" },
          {
            name: "VPAT & Accessibility Conformance Reports",
            url: "https://accessibility.build/guides/vpat-accessibility-conformance-report",
          },
        ]}
      />
      <FAQStructuredData faqs={faqs} />

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
              <Link href="/guides" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Guides
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <span className="font-medium text-slate-900 dark:text-white" aria-current="page">
                VPAT & ACR
              </span>
            </li>
          </ol>
        </div>
      </nav>

      {/* Hero */}
      <header className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-4xl">
            <p className="text-blue-300 font-semibold text-sm tracking-wider uppercase mb-4">
              Guide &bull; Procurement Documentation
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              VPATs &{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                Accessibility Conformance Reports
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl">
              When a buyer asks for your VPAT, they are really asking a harder question: do you
              actually know how accessible your product is, and can you prove it? This guide
              explains the template, the report it becomes, the four editions, how buyers read
              one, and how to produce one that survives procurement scrutiny.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <p className="text-slate-400 text-sm font-medium mb-1">VPAT Editions</p>
              <p className="text-2xl md:text-3xl font-bold text-white">4</p>
              <p className="text-slate-400 text-xs mt-1">508, EU, WCAG, and INT</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <p className="text-slate-400 text-sm font-medium mb-1">A Filled-In VPAT =</p>
              <p className="text-2xl md:text-3xl font-bold text-white">ACR</p>
              <p className="text-slate-400 text-xs mt-1">The template becomes the report</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <p className="text-slate-400 text-sm font-medium mb-1">Conformance Answers</p>
              <p className="text-2xl md:text-3xl font-bold text-white">5</p>
              <p className="text-slate-400 text-xs mt-1">Supports through Not Evaluated</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <p className="text-slate-400 text-sm font-medium mb-1">Quality Signal</p>
              <p className="text-2xl md:text-3xl font-bold text-white">Remarks</p>
              <p className="text-slate-400 text-xs mt-1">Thin remarks mean a weak report</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="max-w-3xl mx-auto space-y-16">
          {/* VPAT vs ACR */}
          <section aria-labelledby="vpat-vs-acr-heading">
            <h2 id="vpat-vs-acr-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              VPAT vs ACR: The Template and the Report
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              The <strong className="text-slate-900 dark:text-white">VPAT</strong> (Voluntary
              Product Accessibility Template) is a free template published by ITI, the
              Information Technology Industry Council. On its own it is a blank form: a
              structured list of accessibility criteria with empty columns waiting for answers.
            </p>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              An <strong className="text-slate-900 dark:text-white">ACR</strong> (Accessibility
              Conformance Report) is what the VPAT becomes once a vendor fills it in for a
              specific product: a completed report stating, criterion by criterion, whether the
              product supports each requirement, with remarks explaining each determination. The
              template is the blank form; the ACR is the report.
            </p>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              In practice the vocabulary is sloppy. Buyers say &ldquo;send me your VPAT&rdquo;
              when they mean the completed ACR, and most vendors answer in kind. That is fine as
              shorthand, as long as you understand what is actually being requested: not an empty
              template anyone can download, but a filled-in, dated, product-specific report
              backed by real testing.
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Each criterion in an ACR gets one of a fixed set of conformance answers:{" "}
              <strong className="text-slate-900 dark:text-white">Supports</strong>,{" "}
              <strong className="text-slate-900 dark:text-white">Partially Supports</strong>,{" "}
              <strong className="text-slate-900 dark:text-white">Does Not Support</strong>,{" "}
              <strong className="text-slate-900 dark:text-white">Not Applicable</strong>, and{" "}
              <strong className="text-slate-900 dark:text-white">Not Evaluated</strong>, the last
              of which is allowed only at WCAG Level AAA. Every answer needs a remark explaining
              how the determination was made. Empty remark columns are the single clearest mark
              of a low-quality ACR.
            </p>
          </section>

          {/* The four editions */}
          <section aria-labelledby="editions-heading">
            <h2 id="editions-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              The Four Editions and How to Pick One
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              The current VPAT 2.x family comes in four editions, each mapping a different
              accessibility standard. Choosing the right one is not a technical decision so much
              as a market decision: the edition you need is determined by who is asking.
            </p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-left text-sm border border-slate-200 dark:border-slate-700 rounded-lg">
                <caption className="sr-only">
                  The four VPAT editions, the standard each covers, and who typically asks for it
                </caption>
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                    <th scope="col" className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                      Edition
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                      Standard
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                      Who asks for it
                    </th>
                  </tr>
                </thead>
                <tbody className="text-slate-600 dark:text-slate-400">
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                      VPAT 508
                    </th>
                    <td className="px-4 py-3">US Revised Section 508</td>
                    <td className="px-4 py-3">US federal agencies and their contractors</td>
                  </tr>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                      VPAT EU
                    </th>
                    <td className="px-4 py-3">EN 301 549 (European standard)</td>
                    <td className="px-4 py-3">European public-sector and EAA-era buyers</td>
                  </tr>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                      VPAT WCAG
                    </th>
                    <td className="px-4 py-3">WCAG only</td>
                    <td className="px-4 py-3">Commercial and enterprise buyers</td>
                  </tr>
                  <tr>
                    <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                      VPAT INT
                    </th>
                    <td className="px-4 py-3">All three combined</td>
                    <td className="px-4 py-3">Vendors selling across multiple markets</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              US federal buyers want the 508 edition, because{" "}
              <Link href="/compliance/section-508" className="text-blue-600 dark:text-blue-400 hover:underline">
                Section 508
              </Link>{" "}
              is the standard their procurement rules reference. European buyers increasingly
              want the EU edition mapping{" "}
              <Link href="/compliance/en-301-549" className="text-blue-600 dark:text-blue-400 hover:underline">
                EN 301 549
              </Link>
              . Commercial buyers with no statutory hook often accept a WCAG edition. If you sell
              into more than one of these markets, the INT edition lets you maintain a single
              report instead of three parallel ones.
            </p>
          </section>

          {/* Reading an ACR */}
          <section aria-labelledby="read-heading">
            <h2 id="read-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              How to Read an ACR Before You Buy
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              An ACR is only useful to a buyer who reads it critically. Vendors write these
              documents to win deals, and the format makes optimism easy. A practical checklist:
            </p>
            <ul className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed list-disc pl-5 mb-4">
              <li>
                <strong className="text-slate-900 dark:text-white">Check the edition and the date.</strong>{" "}
                Does the edition match the standard you care about? A WCAG-only report does not
                answer a Section 508 question. And an undated report, or one several years old,
                describes a product that may no longer exist.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Check the product version it covers.</strong>{" "}
                A credible ACR names a specific release. If the report covers version 3 and you
                are buying version 5, ask for a current one.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">
                  Scan for Partially Supports clusters on core criteria.
                </strong>{" "}
                Partial support on keyboard access, form labels, or contrast is not a footnote;
                those are the criteria that decide whether disabled users can operate the product
                at all. Clusters there deserve direct questions before contract signature.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">
                  Be suspicious of 100% Supports with thin remarks.
                </strong>{" "}
                Real products have real defects. A report where every row says Supports and the
                remark columns are empty or boilerplate is more likely describing wishful
                thinking than testing.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Ask for the testing methodology.</strong>{" "}
                Who tested, with what tools and assistive technologies, on which pages or
                screens? A vendor who can answer crisply probably did the work. A vendor who
                cannot, probably did not.
              </li>
            </ul>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              If accessibility documentation is becoming part of your purchasing process more
              broadly, our{" "}
              <Link href="/procurement" className="text-blue-600 dark:text-blue-400 hover:underline">
                accessible procurement guide
              </Link>{" "}
              covers how to build these checks into RFPs and vendor reviews.
            </p>
          </section>

          {/* Producing an ACR */}
          <section aria-labelledby="produce-heading">
            <h2 id="produce-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              How to Produce an ACR That Survives Scrutiny
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              The order of operations matters more than anything else: testing comes first, and
              the document comes second. An ACR without testing behind it is fiction.
            </p>
            <ol className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed list-decimal pl-5">
              <li>
                <strong className="text-slate-900 dark:text-white">Test the product first.</strong>{" "}
                Combine automated scanning, manual testing against each criterion, and assistive
                technology testing with screen readers and keyboard-only operation. Automated
                tools alone cannot evaluate most criteria, so a scanner-only report is incomplete
                by construction. Our{" "}
                <Link
                  href="/guides/how-to-audit-website-accessibility"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  how-to-audit guide
                </Link>{" "}
                walks through the methodology, and the{" "}
                <Link href="/checklists/wcag-2-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                  WCAG 2.2 checklist
                </Link>{" "}
                covers the criteria themselves.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Pick the right edition.</strong>{" "}
                Match the edition to your buyers: 508 for US federal, EU for European
                procurement, WCAG for commercial deals, INT when you need all three in one
                document.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">
                  Fill in per-criterion conformance with specific remarks.
                </strong>{" "}
                For each criterion, record Supports, Partially Supports, Does Not Support, or Not
                Applicable (Not Evaluated is allowed only at WCAG Level AAA), and write remarks
                that name components and known defects. &ldquo;Date picker is not operable by
                keyboard; fix scheduled&rdquo; is a useful remark. An empty cell is not.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">
                  Date and version the report against a specific release.
                </strong>{" "}
                State the product version tested, the date, and the testing approach. This is
                what lets a buyer connect the report to the thing they are actually buying.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">
                  Update it when the product changes materially.
                </strong>{" "}
                Redesigns, new modules, and major remediation efforts all invalidate old answers.
                A stale ACR erodes exactly the trust it was written to build.
              </li>
            </ol>
            <p className="text-slate-600 dark:text-slate-400 mt-4 leading-relaxed">
              One more credibility lever: who did the testing. Third-party-produced ACRs carry
              more weight with buyers than self-reported ones, because the incentives are
              cleaner. Our{" "}
              <Link href="/services/accessibility-audits" className="text-blue-600 dark:text-blue-400 hover:underline">
                accessibility audit service
              </Link>{" "}
              produces exactly the automated, manual, and assistive technology testing an ACR
              needs behind it.
            </p>
          </section>

          {/* Europe */}
          <section aria-labelledby="europe-heading">
            <h2 id="europe-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              VPATs in Europe: EN 301 549 and the EAA
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              The VPAT conversation is often framed as a purely American, Section 508 story. That
              framing is out of date. The VPAT EU edition maps{" "}
              <Link href="/compliance/en-301-549" className="text-blue-600 dark:text-blue-400 hover:underline">
                EN 301 549
              </Link>
              , the European accessibility standard, and European public procurement references
              that standard directly.
            </p>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              The European Accessibility Act raises the stakes further. As EAA obligations flow
              through supply chains, accessibility documentation is moving beyond government
              tenders into private-sector purchasing: companies that must meet accessibility
              requirements themselves start demanding evidence from their software vendors. The
              VPAT EU edition, as a structured EN 301 549 conformance report, is a natural format
              for answering those requests.
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              For vendors, the practical takeaway is simple: if European customers are on your
              roadmap, an ACR that speaks only Section 508 will not be enough. Either produce a
              VPAT EU edition alongside your US report, or use the INT edition and cover both
              markets, plus WCAG, in one document.
            </p>
          </section>

          {/* Limits */}
          <section aria-labelledby="limits-heading">
            <h2 id="limits-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              Limits: What an ACR Is Not
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              A VPAT or ACR is <strong className="text-slate-900 dark:text-white">disclosure,
              not certification</strong>. There is no official accessibility certification body
              for WCAG, so no report, badge, or seal can formally certify conformance. An ACR
              does not make a product compliant with any law; it documents where the product
              stands, including where it falls short.
            </p>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              That limit is also the document&apos;s strength. An honest ACR that says
              &ldquo;Partially Supports&rdquo; in ten places, with specific remarks and a
              remediation plan, is worth more to a serious buyer than a perfect-looking report
              nobody believes. The goal is an accurate map of the product, not a marketing
              artifact.
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              It is also worth distinguishing the ACR from its public-facing sibling. An ACR is
              procurement-facing: a detailed, criterion-level report handed to buyers on request.
              An accessibility statement is public-facing: a page on your website telling users
              what to expect and how to get help. Most organizations selling software eventually
              need both; our{" "}
              <Link
                href="/guides/how-to-write-an-accessibility-statement"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                accessibility statement guide
              </Link>{" "}
              covers the other half.
            </p>
          </section>

          {/* FAQ */}
          <section aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-10">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {faqs.map((faq) => (
                <div key={faq.question} className="border border-slate-200 dark:border-slate-700 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Disclaimer */}
          <section aria-label="Disclaimer">
            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                Educational Content, Not Legal Advice
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                This page is provided for general educational purposes only and does not
                constitute legal advice. Procurement requirements, Section 508 obligations, EN
                301 549, and the European Accessibility Act all involve legal questions that
                depend on your specific situation and jurisdiction. For advice about your
                obligations, consult an attorney experienced in accessibility law.
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Related Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-20">
        <RelatedContent
          content="VPAT accessibility conformance report Section 508 EN 301 549 procurement WCAG documentation"
          title="Related Resources"
          maxItems={3}
        />
      </section>
    </div>
  )
}
