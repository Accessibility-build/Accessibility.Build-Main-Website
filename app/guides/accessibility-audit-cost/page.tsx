import type { Metadata } from "next"
import Link from "next/link"
import { BreadcrumbStructuredData, FAQStructuredData } from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"

const ogTitle = encodeURIComponent("Web Accessibility Audit Cost (UK & Ireland Guide)")

export const metadata: Metadata = {
  title: "Web Accessibility Audit Cost (UK & Ireland Guide)",
  description:
    "What a WCAG audit really costs: sourced US price ranges, one published UK figure, fixed pricing from $950, and the factors that drive quotes up or down.",
  keywords: [
    "accessibility audit cost",
    "web accessibility audit cost uk",
    "wcag audit cost",
    "how much does an accessibility audit cost",
    "accessibility audit pricing",
    "ada audit cost",
    "accessibility audit cost ireland",
  ],
  alternates: {
    canonical: "/guides/accessibility-audit-cost",
  },
  openGraph: {
    title: "Web Accessibility Audit Cost (UK & Ireland Guide)",
    description:
      "What a WCAG audit really costs: sourced US price ranges, one published UK figure, fixed pricing from $950, and the factors that drive quotes up or down.",
    url: "/guides/accessibility-audit-cost",
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
    title: "Web Accessibility Audit Cost (UK & Ireland Guide)",
    description:
      "What a WCAG audit really costs, why most UK and Irish firms only quote on request, and how to compare audit quotes like with like.",
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
    question: "How much does a WCAG audit cost for a small business website?",
    answer:
      "There is no single market rate, and most UK and Irish agencies do not publish prices at all. US vendors such as AudioEye and DigitalA11Y publish ranges of roughly $1,500 to $5,500 for small business sites, with per-page rates around $100 to $250. In the UK, independent consultant Jim Byrne publishes audit prices from 2,500 GBP. Our own fixed-price WCAG 2.2 AA audits start at $950, including manual testing, assistive technology checks, a full report, and a verification retest. Whatever you pay, get the scope itemised in writing so you can compare quotes like with like.",
  },
  {
    question: "Why do audit prices vary so much?",
    answer:
      "Because an audit is not one product. The main cost drivers are structural: how many unique templates and page types your site has (not the raw page count), how many user flows need testing (checkout, signup, account management), the depth of testing (automated scan versus manual and screen reader testing versus a full assistive technology matrix), the platforms covered (web only, or also iOS and Android apps and PDFs), the deliverables (a defect list, a full report with remediation guidance, or VPAT and ACR production), the number of retest rounds, and the day rates of the consultants doing the work. Two quotes that differ by thousands are usually describing two different products.",
  },
  {
    question: "Is a free automated scan enough?",
    answer:
      "No. Automated scanners are genuinely useful and worth running first, but they detect only a subset of WCAG failures. They cannot judge whether alt text is meaningful, whether a keyboard user can complete your checkout, or whether a screen reader announces form errors sensibly. Those judgments require a human tester working with assistive technology, and that manual work is where both the cost and the value of a professional audit live. Use free tools to establish a baseline and clear the obvious defects, then pay for manual testing on what remains.",
  },
  {
    question: "How long does an accessibility audit take?",
    answer:
      "It depends on scope, and be wary of anyone quoting a fixed duration before seeing your site. As a general shape: a small site with a handful of templates is typically a matter of days of testing and reporting, while a large engagement covering many flows, native apps, and documents runs to weeks. The same structural factors that drive cost (template count, flow count, testing depth, and platforms) drive duration in the same way.",
  },
  {
    question: "What should an accessibility audit report include?",
    answer:
      "A written scope stating which pages, templates, flows, browsers, and assistive technologies were tested; findings mapped to specific WCAG 2.2 success criteria; severity ratings; evidence such as screenshots or code references; plain-language remediation guidance your developers can act on; and a defined retest to verify fixes. If a quote does not specify the deliverable, ask to see a sample report before you sign. A cheap audit that produces an unusable spreadsheet of scanner output is not a bargain.",
  },
  {
    question: "Do UK companies legally need an accessibility audit?",
    answer:
      "No law mandates an audit as such. What the law requires is accessibility: the Equality Act 2010 places an anticipatory duty on UK service providers to make reasonable adjustments for disabled people, and the European Accessibility Act imposes accessibility requirements on in-scope products and services in the EU, with criminal penalties available in Ireland. An audit is not the legal obligation; it is how you find out where you stand against the obligation, and the evidence base for fixing what it finds.",
  },
  {
    question: "Is a VPAT or ACR included in an audit?",
    answer:
      "Usually not by default. A VPAT (the template used to produce an Accessibility Conformance Report, or ACR) is a distinct deliverable that documents your conformance position for procurement teams. Most vendors price it as an add-on to an audit, because it requires the audit evidence plus additional authoring work. If you sell to government, education, or enterprise buyers who ask for an ACR, tell prospective auditors up front so the quote includes it.",
  },
]

export default function AccessibilityAuditCostPage() {
  return (
    <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "Guides", url: "https://accessibility.build/guides" },
          {
            name: "Accessibility Audit Cost",
            url: "https://accessibility.build/guides/accessibility-audit-cost",
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
                Accessibility Audit Cost
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
              Buyer&apos;s Guide &bull; UK &amp; Ireland
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              How Much Does a Web Accessibility{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                Audit Cost?
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl">
              The honest answer: it depends on what you are buying, and in the UK and Ireland it is
              hard to even find out, because most firms quote on request rather than publishing
              prices. This guide sets out the price figures that are actually published, with
              sources, and the structural factors that make one audit cost five times another.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <p className="text-slate-400 text-sm font-medium mb-1">Our Audits</p>
              <p className="text-2xl md:text-3xl font-bold text-white">From $950</p>
              <p className="text-slate-400 text-xs mt-1">Fixed price, WCAG 2.2 AA</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <p className="text-slate-400 text-sm font-medium mb-1">Pricing Scales On</p>
              <p className="text-2xl md:text-3xl font-bold text-white">Templates, not pages</p>
              <p className="text-slate-400 text-xs mt-1">Unique page types drive effort</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <p className="text-slate-400 text-sm font-medium mb-1">Where the Value Is</p>
              <p className="text-2xl md:text-3xl font-bold text-white">Manual testing</p>
              <p className="text-slate-400 text-xs mt-1">Scans find only a subset of failures</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <p className="text-slate-400 text-sm font-medium mb-1">UK &amp; Irish Market</p>
              <p className="text-2xl md:text-3xl font-bold text-white">Quote culture</p>
              <p className="text-slate-400 text-xs mt-1">Most firms price on request</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="max-w-3xl mx-auto space-y-16">
          {/* Honest answer */}
          <section aria-labelledby="honest-heading">
            <h2 id="honest-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              The Honest Answer: What Audits Actually Cost
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              There is no standard price for a web accessibility audit, and any page that gives you
              a single confident number without a source is guessing. What we can do is tell you
              what is actually published, who published it, and what our own audits cost.
            </p>
            <ul className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed list-disc pl-5 mb-4">
              <li>
                <strong className="text-slate-900 dark:text-white">Published US figures.</strong>{" "}
                US vendors such as AudioEye and DigitalA11Y publish ranges of roughly $1,500 to
                $5,500 for small business sites, per-page rates around $100 to $250, and $50,000
                or more for large enterprise engagements. These are US market figures from
                vendor-published content, not quotes, and your site may sit anywhere on or off
                those ranges depending on scope.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">The one published UK data point we know of.</strong>{" "}
                Independent UK consultant Jim Byrne publishes audit prices from 2,500 GBP. Beyond
                that, published UK and Irish pricing is genuinely scarce: most agencies and
                consultancies quote on request only, which makes it hard for buyers to compare
                offers or even sanity-check a quote. We would rather say that plainly than invent a
                UK market rate that does not exist in print.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Our pricing.</strong> We publish
                ours: fixed-price WCAG 2.2 AA{" "}
                <Link href="/services/accessibility-audits" className="text-blue-600 dark:text-blue-400 hover:underline">
                  accessibility audits
                </Link>{" "}
                from $950, including manual testing, assistive technology checks, a full report,
                and verification retests, with each tier and what it covers listed on the service
                page.
              </li>
            </ul>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              The spread between those numbers is not vendors being greedy or cheap. It reflects
              genuinely different products sold under the same word, which is why the next section
              matters more than any headline figure.
            </p>
          </section>

          {/* Cost drivers */}
          <section aria-labelledby="drivers-heading">
            <h2 id="drivers-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              What Drives the Price
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              Audit effort, and therefore cost, scales on a handful of structural factors. When you
              request quotes, these are the variables each vendor is silently estimating:
            </p>
            <ul className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed list-disc pl-5 mb-4">
              <li>
                <strong className="text-slate-900 dark:text-white">Unique templates and page types, not raw page count.</strong>{" "}
                A 10,000-page site built from 12 templates is a smaller job than a 40-page site
                where every page is bespoke. Auditors test representative instances of each
                template, so template count is the real unit of work.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">User flows.</strong> Checkout,
                signup, login, account management, and search each need end-to-end testing with
                keyboard and screen reader, because a flow can fail even when every individual page
                in it passes.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Depth of testing.</strong> An
                automated scan, a manual audit with screen reader testing, and a full
                assistive-technology matrix across multiple screen readers, browsers, and
                magnification tools are three different price brackets.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Platforms.</strong> Web only is
                the baseline. Adding iOS and Android apps or a library of PDFs adds testers,
                tooling, and time.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Deliverables.</strong> A raw
                defect list is cheaper than a full report with remediation guidance, which is
                cheaper than also producing a{" "}
                <Link href="/guides/vpat-accessibility-conformance-report" className="text-blue-600 dark:text-blue-400 hover:underline">
                  VPAT or Accessibility Conformance Report
                </Link>{" "}
                for procurement.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Retesting rounds.</strong>{" "}
                Verifying fixes is real work. Check whether a retest is included or billed
                separately; a quote without one is not comparable to a quote with one.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Day rates.</strong> Much of the
                market prices audits as consultancy days, so the same scope costs different amounts
                at different firms simply because their day rates differ.
              </li>
            </ul>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              This is also why per-page pricing can mislead: two vendors quoting the same per-page
              rate can produce wildly different totals depending on how they count pages, templates,
              and flow states.
            </p>
          </section>

          {/* Automated vs manual */}
          <section aria-labelledby="automated-heading">
            <h2 id="automated-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              Automated vs Manual: Why the Cheap Number Is Not the Same Product
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              The cheapest audits on the market are automated scans dressed up as audits. Automated
              testing is cheap or free for a reason: it can only detect a subset of WCAG failures,
              the ones a machine can judge without context. It can tell you an image has no alt
              attribute; it cannot tell you the alt text that is there is wrong. It can find a form
              field with no label; it cannot tell you the checkout is impossible to complete with a
              keyboard.
            </p>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              Manual testing, with a human working through your site using a keyboard and screen
              reader, is where both the cost and the value of a professional audit live. That is
              the part you are actually paying for, and the part a scan-only product quietly
              omits while using the same word.
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              The smart move is to use both, in order. Run our free{" "}
              <Link href="/tools/url-accessibility-auditor" className="text-blue-600 dark:text-blue-400 hover:underline">
                URL accessibility auditor
              </Link>{" "}
              and{" "}
              <Link href="/tools/contrast-checker" className="text-blue-600 dark:text-blue-400 hover:underline">
                contrast checker
              </Link>{" "}
              to establish a baseline before paying anyone. Fix what they find, then spend your
              audit budget on the manual testing that machines cannot do.
            </p>
          </section>

          {/* What a proper audit includes */}
          <section aria-labelledby="includes-heading">
            <h2 id="includes-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              What a Proper Audit Should Include
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              Whatever you pay, the deliverable should contain the same core elements. Use this as
              a checklist when comparing quotes:
            </p>
            <ul className="space-y-3 text-slate-600 dark:text-slate-400 leading-relaxed list-disc pl-5 mb-4">
              <li>
                <strong>A written scope</strong>: which templates, pages, and user flows were
                tested, on which browsers and assistive technologies.
              </li>
              <li>
                <strong>Testing against WCAG 2.2 Level AA</strong>, the current version of the
                standard, with each finding mapped to a specific success criterion.
              </li>
              <li>
                <strong>Manual and assistive technology testing</strong>, including screen reader
                and keyboard-only passes, not just scanner output.
              </li>
              <li>
                <strong>A usable report</strong>: severity ratings, evidence, and plain-language
                remediation guidance a developer can act on without an accessibility background.
              </li>
              <li>
                <strong>A verification retest</strong> after fixes, so you end with evidence that
                issues were resolved rather than a list of things that were once wrong.
              </li>
            </ul>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Never buy a report sight unseen. We publish a{" "}
              <Link href="/sample-audit-report" className="text-blue-600 dark:text-blue-400 hover:underline">
                sample audit report
              </Link>{" "}
              so you can see exactly what the deliverable looks like; ask any vendor you are
              considering for the same.
            </p>
          </section>

          {/* Keeping cost down */}
          <section aria-labelledby="savings-heading">
            <h2 id="savings-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              How to Keep the Cost Down Without Buying Junk
            </h2>
            <ol className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed list-decimal pl-5">
              <li>
                <strong className="text-slate-900 dark:text-white">Arrive with a template inventory.</strong>{" "}
                List your unique page types and key user flows before requesting quotes. Vendors
                who do not have to guess at scope quote tighter, and you can compare offers on an
                identical scope.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Clear the free findings first.</strong>{" "}
                Run automated tools yourself and fix what they surface. Paying a consultant day
                rate to be told about missing alt attributes is the most expensive possible way to
                learn something a free scan reports in seconds.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Scope by flow, not by everything.</strong>{" "}
                If budget is tight, audit the flows where users and legal risk concentrate first
                (home, search, product, checkout, signup) and phase the rest.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Do not spend the budget on an overlay instead.</strong>{" "}
                Overlay widgets do not make a site conform to WCAG and do not remove the need for
                an audit; our{" "}
                <Link href="/guides/accessibility-overlays" className="text-blue-600 dark:text-blue-400 hover:underline">
                  overlay guide
                </Link>{" "}
                explains why. Money spent there is money you will spend again on real remediation.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">Buy the retest.</strong>{" "}
                Skipping verification to save money means you cannot prove anything was fixed,
                which undermines the point of paying for the audit at all.
              </li>
            </ol>
          </section>

          {/* UK and Ireland */}
          <section aria-labelledby="uk-ireland-heading">
            <h2 id="uk-ireland-heading" className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              UK and Ireland Specifics
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              For UK and Irish organisations, the question behind the price question is legal
              exposure, and the drivers on this side of the Atlantic are different from the US
              lawsuit machine:
            </p>
            <ul className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed list-disc pl-5 mb-4">
              <li>
                <strong className="text-slate-900 dark:text-white">The Equality Act 2010 (UK).</strong>{" "}
                Service providers owe an anticipatory duty to make reasonable adjustments for
                disabled people, meaning you are expected to have addressed barriers before a
                disabled customer encounters them, not after a complaint. Our{" "}
                <Link href="/compliance/uk" className="text-blue-600 dark:text-blue-400 hover:underline">
                  UK compliance guide
                </Link>{" "}
                covers how this applies to websites.
              </li>
              <li>
                <strong className="text-slate-900 dark:text-white">The European Accessibility Act.</strong>{" "}
                In force since June 2025 for in-scope products and services, with enforcement that
                in Ireland includes criminal penalties. Our{" "}
                <Link href="/compliance/eaa-ireland" className="text-blue-600 dark:text-blue-400 hover:underline">
                  EAA Ireland guide
                </Link>{" "}
                explains who is in scope and what is required.
              </li>
            </ul>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              Weigh the audit price against the cost of not knowing where you stand. For the US
              picture, where an inaccessible site can turn directly into legal spend, see our{" "}
              <Link href="/guides/ada-website-lawsuit-cost" className="text-blue-600 dark:text-blue-400 hover:underline">
                ADA website lawsuit cost guide
              </Link>
              . And an audit is not only risk avoidance: accessible sites reach more customers, and
              our{" "}
              <Link href="/tools/accessibility-roi-calculator" className="text-blue-600 dark:text-blue-400 hover:underline">
                accessibility ROI calculator
              </Link>{" "}
              lets you put your own numbers on that.
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              One practical note on the quote-on-request culture: because so few UK and Irish firms
              publish prices, the burden of making quotes comparable falls on you. Send every
              vendor the same written scope, insist on an itemised quote against it, and ask for a
              sample report. That is the closest thing this market offers to price transparency.
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
                Educational Content, Not a Quote
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                This page is provided for general educational purposes. Third-party price figures
                are drawn from the named sources&apos; published content and are indicative only;
                they are not offers, and actual pricing for any engagement, including ours, depends
                on scope. Nothing here is legal advice. For obligations under the Equality Act, the
                European Accessibility Act, or other laws, consult a qualified professional.
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Related Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-20">
        <RelatedContent
          content="accessibility audit cost WCAG audit pricing manual testing accessibility services UK Ireland compliance"
          title="Related Resources"
          maxItems={3}
        />
      </section>
    </div>
  )
}
