import type { Metadata } from "next"
import Link from "next/link"
import { BreadcrumbStructuredData } from "@/components/seo/structured-data"
import { FaqSection } from "@/components/seo/faq-section"
import { RelatedContent } from "@/components/seo/related-content"
import { BuyBox } from "@/components/products/buy-box"
import { clampDescription } from "@/lib/metadata"
import { formatUsd, lowestPrice, productJsonLd, products } from "@/lib/products"

const product = products.titleIiKit
const ROUTE = product.route

const pageTitle = "ADA Title II Compliance Kit: Policy and Templates"
const pageDescription = `Word templates and a planning workbook for the DOJ Title II web rule: policy, accessibility statement, notice, grievance procedure, procurement clauses and more. From ${formatUsd(lowestPrice(product))}.`
const ogTitle = encodeURIComponent("ADA Title II Compliance Kit")

export const metadata: Metadata = {
  title: pageTitle,
  description: clampDescription(pageDescription),
  keywords: [
    "ada title ii web accessibility policy template",
    "title ii accessibility statement template",
    "ada title ii compliance kit",
    "website accessibility policy template government",
    "28 cfr 35.200 template",
    "title ii procurement accessibility clause",
    "ada title ii web rule deadline",
    "local government accessibility policy",
  ],
  alternates: { canonical: ROUTE },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: ROUTE,
    type: "website",
    images: [{ url: `/api/og?title=${ogTitle}&section=Templates`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
    images: [{ url: `/api/og?title=${ogTitle}&section=Templates`, width: 1200, height: 630 }],
  },
}

const files = [
  { name: "00 Read Me First", body: "The rule in plain English: who is covered, the dates, the five exceptions and their exact conditions, the limits, and a table of what is required and what is only recommended." },
  { name: "Planning workbook", body: "Compliance date calculator, digital inventory, exceptions triage against the exact conditions in 28 CFR 35.201, prioritized fix plan, vendor tracker, training log and request log." },
  { name: "01 Accessibility policy", body: "Internal web and mobile app policy: standard, scope, roles, publishing, archives, testing, procurement, requests, decisions and training." },
  { name: "02 Accessibility statement", body: "Public page text with three honest status options and a route to request accessible versions of excepted content." },
  { name: "03 ADA notice and coordinator", body: "Web and app language for the notice every entity must give (35.106) and the coordinator designation for entities with 50 or more employees (35.107)." },
  { name: "04 Grievance procedure", body: "A complaint procedure that covers websites, documents and apps, and gets the person access first." },
  { name: "05 Procurement language", body: "Solicitation requirements and contract clauses keyed to WCAG 2.1 Level AA and 28 CFR 35.200: warranty, ACR, testing, remediation, acceptance and no disclaimers." },
  { name: "06 Vendor letter and questionnaire", body: "A letter asking current vendors for an ACR and a fix schedule, and a 12-question questionnaire for bidders." },
  { name: "07 Request letters", body: "Acknowledgment, fulfillment and alternative-offer letters, plus a phone and counter script." },
  { name: "08 Undue burden statement", body: "The written statement of reasons 28 CFR 35.204 requires, with the guardrails DOJ sets out." },
  { name: "09 Decision records", body: "Records for conforming alternate versions (35.202) and equivalent facilitation (35.203)." },
  { name: "10 Adoption resolution", body: "A resolution for your council, board or commission." },
  { name: "11 Content author checklist", body: "A two-page publishing checklist for staff who post pages, documents, video and social media." },
]

const faqs = [
  {
    question: "What are the ADA Title II web accessibility deadlines?",
    answer:
      "Under 28 CFR 35.200(b), as amended by DOJ's interim final rule of April 20, 2026, a public entity with a total population of 50,000 or more must comply from April 26, 2027. Entities under 50,000, and every special district government whatever its size, must comply from April 26, 2028. The standard is WCAG 2.1 Level A and AA. The kit's planning workbook works out your date from your entity type and Census population.",
  },
  {
    question: "Does the rule require an accessibility statement or a policy?",
    answer:
      "No. DOJ's guidance in Appendix D to part 35 says contact methods are not required by subpart H but encouraged, and DOJ declined to let policies count as compliance. The kit labels these as recommended, and marks the items that are required: the 35.106 notice for every entity, and the coordinator and grievance procedure for entities with 50 or more employees.",
  },
  {
    question: "Is this legal advice?",
    answer:
      "No. The templates are educational and cite the regulation for every requirement, but every government is different. Have your attorney review each template before you adopt or publish it.",
  },
  {
    question: "Who wrote the kit and what is it based on?",
    answer:
      "Accessibility.build, run by a CPACC-certified accessibility consultant. It is written from the regulation on eCFR, DOJ's April 2026 interim final rule, Appendix D to part 35, and DOJ's Fact Sheet, Small Entity Compliance Guide and First Steps guidance. No text is copied from other organizations' templates.",
  },
  {
    question: "Can a consultant or attorney use it with clients?",
    answer:
      "Yes, with the consultant licence. It covers any number of client governments; each client may adapt and publish the documents as its own. The single government licence covers one entity and its departments.",
  },
  {
    question: "What if DOJ changes the rule again?",
    answer:
      "Every date and citation in the kit is current as of the date shown on this page. DOJ has said it will consider proposing changes to the substance of the rule, and the 2026 extension is being challenged in court. Check the dates against eCFR before relying on them, and watch this page for a new edition.",
  },
]

export default function TitleIiKitPage() {
  const jsonLd = productJsonLd(product, pageDescription)
  return (
    <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "Templates", url: "https://accessibility.build/templates" },
          { name: "ADA Title II Compliance Kit", url: `https://accessibility.build${ROUTE}` },
        ]}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav aria-label="Breadcrumb" className="border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <ol className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
            <li>
              <Link href="/" className="hover:text-blue-700 dark:hover:text-blue-400">Home</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/templates" className="hover:text-blue-700 dark:hover:text-blue-400">Templates</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <span className="font-medium text-slate-900 dark:text-white" aria-current="page">ADA Title II Compliance Kit</span>
            </li>
          </ol>
        </div>
      </nav>

      <header className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
          <div className="max-w-4xl">
            <p className="text-indigo-200 font-semibold text-sm tracking-wider uppercase mb-4">Template kit &bull; State and local government</p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">ADA Title II Web Accessibility Compliance Kit</h1>
            <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-3xl">{product.tagline}</p>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#buy"
                className="inline-flex items-center rounded-lg bg-white px-5 py-3 font-semibold text-slate-900 hover:bg-indigo-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
              >
                From {formatUsd(lowestPrice(product))}
              </a>
              <a href="#inside" className="text-indigo-100 underline underline-offset-4 hover:text-white">
                See what is inside
              </a>
            </div>
            <p className="mt-6 text-sm text-slate-300">Dates and citations current as of {product.updated}.</p>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-16">
        <section aria-labelledby="dates-heading">
          <h2 id="dates-heading" className="text-2xl font-bold text-slate-900 dark:text-white mb-4">The deadlines the kit is built around</h2>
          <div
            tabIndex={0}
            role="region"
            aria-label="ADA Title II web rule compliance dates"
            className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <table className="w-full text-left text-sm">
              <caption className="sr-only">ADA Title II web rule compliance dates</caption>
              <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
                <tr>
                  <th scope="col" className="p-3">Public entity</th>
                  <th scope="col" className="p-3">Must comply from</th>
                  <th scope="col" className="p-3">Rule</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                <tr>
                  <th scope="row" className="p-3 font-medium text-slate-900 dark:text-white">Total population of 50,000 or more (not a special district)</th>
                  <td className="p-3">April 26, 2027</td>
                  <td className="p-3">28 CFR 35.200(b)(1)</td>
                </tr>
                <tr>
                  <th scope="row" className="p-3 font-medium text-slate-900 dark:text-white">Total population under 50,000</th>
                  <td className="p-3">April 26, 2028</td>
                  <td className="p-3">28 CFR 35.200(b)(2)</td>
                </tr>
                <tr>
                  <th scope="row" className="p-3 font-medium text-slate-900 dark:text-white">Any special district government</th>
                  <td className="p-3">April 26, 2028</td>
                  <td className="p-3">28 CFR 35.200(b)(2)</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">
            As amended by DOJ&apos;s interim final rule of April 20, 2026 (91 FR 20902). The standard is WCAG 2.1 Level A and AA. More on the rule in our{" "}
            <Link href="/compliance/deadlines" className="underline underline-offset-2 hover:text-blue-700 dark:hover:text-blue-400">
              compliance deadlines calendar
            </Link>
            .
          </p>
        </section>

        <section aria-labelledby="why-heading">
          <h2 id="why-heading" className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Why this kit</h2>
          <ul className="grid gap-4 md:grid-cols-2 text-slate-700 dark:text-slate-300" role="list">
            <li className="rounded-xl border border-slate-200 dark:border-slate-800 p-5"><strong className="text-slate-900 dark:text-white">Current dates, correctly cited.</strong> Every date and citation reflects the rule after the April 2026 extension, with exceptions cited to 35.201.</li>
            <li className="rounded-xl border border-slate-200 dark:border-slate-800 p-5"><strong className="text-slate-900 dark:text-white">Required versus recommended.</strong> Each template says whether the rule requires it or DOJ guidance recommends it, so you never overstate what the law demands.</li>
            <li className="rounded-xl border border-slate-200 dark:border-slate-800 p-5"><strong className="text-slate-900 dark:text-white">The hard parts included.</strong> An exceptions triage that asks each exact condition, and the 35.204 written statement no free toolkit provides.</li>
            <li className="rounded-xl border border-slate-200 dark:border-slate-800 p-5"><strong className="text-slate-900 dark:text-white">Accessible files.</strong> Real heading styles, simple tables with header rows, and placeholders that do not rely on colour, so what you publish starts accessible.</li>
          </ul>
        </section>

        <section id="inside" aria-labelledby="inside-heading" className="scroll-mt-24">
          <h2 id="inside-heading" className="text-2xl font-bold text-slate-900 dark:text-white mb-4">What is inside</h2>
          <dl className="divide-y divide-slate-200 dark:divide-slate-800 border-y border-slate-200 dark:border-slate-800">
            {files.map((f) => (
              <div key={f.name} className="grid gap-1 py-4 md:grid-cols-[14rem_1fr] md:gap-6">
                <dt className="font-semibold text-slate-900 dark:text-white">{f.name}</dt>
                <dd className="text-slate-700 dark:text-slate-300">{f.body}</dd>
              </div>
            ))}
          </dl>
        </section>

        <BuyBox product={product} />

        <FaqSection faqs={faqs} title="Frequently Asked Questions" as="h2" className="scroll-mt-24" />

        <section aria-label="Disclaimer">
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 text-sm text-slate-600 dark:text-slate-400 space-y-2">
            <p>
              <strong className="text-slate-900 dark:text-white">Educational templates, not legal advice.</strong> Have counsel review each document before adoption. VPAT® is a registered service mark of the Information Technology Industry Council (ITI); this kit is not affiliated with ITI.
            </p>
          </div>
        </section>
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-20">
        <RelatedContent content="ada title ii web rule state local government wcag 2.1 deadline section 504 policy" title="Related resources" />
      </section>
    </div>
  )
}
