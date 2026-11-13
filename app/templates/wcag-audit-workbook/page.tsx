import type { Metadata } from "next"
import Link from "next/link"
import { BreadcrumbStructuredData } from "@/components/seo/structured-data"
import { FaqSection } from "@/components/seo/faq-section"
import { RelatedContent } from "@/components/seo/related-content"
import { BuyBox } from "@/components/products/buy-box"
import { clampDescription } from "@/lib/metadata"
import { formatUsd, lowestPrice, productJsonLd, products } from "@/lib/products"

const product = products.wcagWorkbook
const ROUTE = product.route

const pageTitle = "WCAG 2.2 Audit Template: Excel and Google Sheets"
const pageDescription = `A WCAG 2.2 and 2.1 audit workbook: test steps for all 86 criteria, results grid, issue log, suggested ACR conformance levels and draft remarks. From ${formatUsd(lowestPrice(product))}.`
const ogTitle = encodeURIComponent(product.name)

export const metadata: Metadata = {
  title: pageTitle,
  description: clampDescription(pageDescription),
  keywords: [
    "wcag audit template",
    "wcag 2.2 audit template excel",
    "accessibility audit spreadsheet",
    "wcag checklist excel",
    "wcag 2.2 audit google sheets",
    "acr remarks template",
    "accessibility conformance report template",
    "wcag-em sample",
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

const sheets = [
  { name: "Start here", body: "How to use the workbook in six steps, keyboard tips, the severity scale, how statuses are worked out, and the notices." },
  { name: "Project", body: "Scope, conformance target, accessibility support baseline, evaluation specifics and the report details an ACR needs. The target (WCAG 2.2 or 2.1, Level A, AA or AAA) decides which criteria are in scope everywhere." },
  { name: "Sample", body: "Up to 40 pages or screens, marked structured, random or process step. The summary works out a random sample of about 10 percent, as W3C's WCAG-EM 2.0 methodology suggests." },
  { name: "Results", body: "One row per criterion and one column per page: Pass, Fail, Cannot tell, Not present or Not tested. Counts, a suggested conformance level, your override, and a Check column that flags results and issues that disagree." },
  { name: "Issues", body: "One issue log for every method, with page and criterion dropdowns that fill in names and levels, severity, priority, steps to reproduce, recommended fix, workaround, evidence link, ticket ID and retest result." },
  { name: "Summary", body: "Counts by status, level, severity, principle and method, plus a draft conformance statement that updates as you test." },
  { name: "ACR remarks", body: "A conformance level and a draft remark for every criterion, ready to rewrite and paste into ITI's free VPAT® template." },
  { name: "Criteria", body: "All 86 WCAG 2.2 success criteria plus 4.1.1 for WCAG 2.1 audits, each with a primary test method, our step-by-step test procedure, common failures, and links to the W3C requirement, Understanding and How to Meet pages." },
]

const preview = [
  {
    ref: "1.4.3",
    title: "Contrast (Minimum)",
    level: "AA",
    method: "Colour contrast",
    steps:
      "Measure text contrast with a contrast tool or eyedropper. Body text needs at least 4.5:1; large text needs 3:1. Check text over images and gradients at the worst point, placeholder text, and text in every state.",
  },
  {
    ref: "2.4.11",
    title: "Focus Not Obscured (Minimum)",
    level: "AA",
    method: "Keyboard",
    steps:
      "Tab through the page with sticky headers, footers, cookie banners and chat widgets visible. A focused element must not be entirely hidden by author-created content. Test at default and higher zoom.",
  },
  {
    ref: "3.3.8",
    title: "Accessible Authentication (Minimum)",
    level: "AA",
    method: "Forms and errors",
    steps:
      "Check every login step. None may rely on a cognitive function test unless there is an alternative or help: password managers can fill fields and paste is allowed.",
  },
]

const faqs = [
  {
    question: "Does it work in Google Sheets?",
    answer:
      "Yes. Every formula uses functions that Excel, LibreOffice and Google Sheets all support, with no macros. Upload the file to Google Drive, open it, and choose File, Save as Google Sheets to get the full feature set, including protected ranges.",
  },
  {
    question: "Which WCAG versions does it cover?",
    answer:
      "WCAG 2.2 and WCAG 2.1, at Level A, AA or AAA. Choose the target on the Project sheet and every other sheet marks which criteria are in scope: 55 for WCAG 2.2 AA and 50 for WCAG 2.1 AA. WCAG 2.1 AA is the standard in the ADA Title II rule, and 4.1.1 Parsing is included for 2.1 audits, set to Supports as W3C's 2023 note and ITI's instructions advise.",
  },
  {
    question: "Does it include the WCAG text?",
    answer:
      "It includes each criterion's number, short name, level, principle and guideline, unchanged and attributed to W3C, and links every criterion to its full requirement, Understanding page and How to Meet page at W3C. The test steps and common failures are our own guidance, labelled as ours.",
  },
  {
    question: "Does it include the VPAT template?",
    answer:
      "No. VPAT is a registered service mark of the Information Technology Industry Council (ITI), and ITI publishes the template free at itic.org. The ACR remarks sheet gives you a conformance level and a draft remark for each criterion to paste into ITI's template. The workbook is not affiliated with ITI.",
  },
  {
    question: "How is the suggested conformance level worked out?",
    answer:
      "From your results on the sampled pages: no failures means Supports, failures on no more pages than pass means Partially Supports, failures on more pages than pass means Does Not Support, and only Not present results means Not Applicable. Cannot tell results are flagged for review. You can override any suggestion, and the workbook never produces an overall score, because W3C warns that single scores can mislead.",
  },
  {
    question: "Can I use it for paid client work?",
    answer:
      "Yes. Both licences allow unlimited audits, including paid client work, and you can share completed audits with your clients. The team licence covers everyone in one organisation. Please do not resell or share the blank workbook.",
  },
  {
    question: "Is the workbook itself accessible?",
    answer:
      "It follows Microsoft's and the UK Analysis Function's guidance for accessible spreadsheets: a title in cell A1 and a description in A2 on every sheet, one table per sheet with a single header row, no merged cells, text values so colour is never the only cue, and descriptive link text.",
  },
]

export default function WcagAuditWorkbookPage() {
  const jsonLd = productJsonLd(product, pageDescription)
  return (
    <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "Templates", url: "https://accessibility.build/templates" },
          { name: product.name, url: `https://accessibility.build${ROUTE}` },
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
              <span className="font-medium text-slate-900 dark:text-white" aria-current="page">WCAG Audit Workbook</span>
            </li>
          </ol>
        </div>
      </nav>

      <header className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
          <div className="max-w-4xl">
            <p className="text-blue-200 font-semibold text-sm tracking-wider uppercase mb-4">Template &bull; Excel and Google Sheets</p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">WCAG Audit Workbook</h1>
            <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-3xl">{product.tagline}</p>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#buy"
                className="inline-flex items-center rounded-lg bg-white px-5 py-3 font-semibold text-slate-900 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
              >
                From {formatUsd(lowestPrice(product))}
              </a>
              <a href="#inside" className="text-blue-100 underline underline-offset-4 hover:text-white">
                See what is inside
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-16">
        <section aria-labelledby="why-heading">
          <h2 id="why-heading" className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Built for real audits</h2>
          <ul className="grid gap-4 md:grid-cols-2 text-slate-700 dark:text-slate-300" role="list">
            <li className="rounded-xl border border-slate-200 dark:border-slate-800 p-5"><strong className="text-slate-900 dark:text-white">Every criterion has test steps.</strong> A primary method, a step-by-step procedure and the common failures for all 86 WCAG 2.2 criteria, written by a CPACC-certified auditor.</li>
            <li className="rounded-xl border border-slate-200 dark:border-slate-800 p-5"><strong className="text-slate-900 dark:text-white">Follows W3C&apos;s method.</strong> Scope, explore, sample, evaluate and report, in the shape of WCAG-EM 2.0, with W3C&apos;s result values.</li>
            <li className="rounded-xl border border-slate-200 dark:border-slate-800 p-5"><strong className="text-slate-900 dark:text-white">ACR-ready.</strong> Suggested conformance levels in ITI&apos;s terms, with checks such as Not Evaluated being allowed only at Level AAA.</li>
            <li className="rounded-xl border border-slate-200 dark:border-slate-800 p-5"><strong className="text-slate-900 dark:text-white">Catches mistakes.</strong> Flags an issue logged with no Fail recorded, a Fail with no issue, results on out-of-scope criteria, and unresolved Cannot tell results.</li>
          </ul>
        </section>

        <section id="inside" aria-labelledby="inside-heading" className="scroll-mt-24">
          <h2 id="inside-heading" className="text-2xl font-bold text-slate-900 dark:text-white mb-4">What is inside</h2>
          <p className="text-slate-700 dark:text-slate-300 mb-6">
            Nine sheets, plus a filled-in example audit of a fictional council website so you can see every formula working.
          </p>
          <dl className="divide-y divide-slate-200 dark:divide-slate-800 border-y border-slate-200 dark:border-slate-800">
            {sheets.map((s) => (
              <div key={s.name} className="grid gap-1 py-4 md:grid-cols-[12rem_1fr] md:gap-6">
                <dt className="font-semibold text-slate-900 dark:text-white">{s.name}</dt>
                <dd className="text-slate-700 dark:text-slate-300">{s.body}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="preview-heading">
          <h2 id="preview-heading" className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Preview: three rows from the Criteria sheet</h2>
          <div
            tabIndex={0}
            role="region"
            aria-label="Preview of three rows from the Criteria sheet"
            className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <table className="w-full text-left text-sm">
              <caption className="sr-only">Preview of three rows from the Criteria sheet</caption>
              <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
                <tr>
                  <th scope="col" className="p-3">Ref</th>
                  <th scope="col" className="p-3">Success criterion</th>
                  <th scope="col" className="p-3">Level</th>
                  <th scope="col" className="p-3">Primary method</th>
                  <th scope="col" className="p-3">How to test (our guidance)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {preview.map((r) => (
                  <tr key={r.ref}>
                    <th scope="row" className="p-3 font-medium text-slate-900 dark:text-white">{r.ref}</th>
                    <td className="p-3">{r.title}</td>
                    <td className="p-3">{r.level}</td>
                    <td className="p-3">{r.method}</td>
                    <td className="p-3 min-w-[20rem]">{r.steps}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">Shortened for the preview. The workbook also lists common failures and links each criterion to W3C.</p>
        </section>

        <BuyBox product={product} />

        <FaqSection faqs={faqs} title="Frequently Asked Questions" as="h2" className="scroll-mt-24" />

        <section aria-labelledby="notices-heading">
          <h2 id="notices-heading" className="text-xl font-bold text-slate-900 dark:text-white mb-3">Notices</h2>
          <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
            <p>
              Success criterion numbers, short names and levels are reproduced without change from{" "}
              <a href="https://www.w3.org/TR/WCAG22/" className="underline underline-offset-2" target="_blank" rel="noopener noreferrer">
                Web Content Accessibility Guidelines (WCAG) 2.2
              </a>
              , W3C Recommendation 12 December 2024. Copyright © 2020-2024 World Wide Web Consortium. W3C does not endorse this product.
            </p>
            <p>
              VPAT® is a registered service mark of the Information Technology Industry Council (ITI). This product is not affiliated with or endorsed by ITI.
            </p>
            <p>The workbook supports an evaluation. It does not make a product conform, and it is not legal advice.</p>
          </div>
        </section>
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-20">
        <RelatedContent content="wcag audit template checklist acr vpat conformance report evaluation" title="Related resources" />
      </section>
    </div>
  )
}
