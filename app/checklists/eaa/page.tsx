import Link from "next/link"
import { createMetadata } from "@/lib/metadata"
import { getRouteDate } from "@/lib/site-routes"
import checklistData from "@/lib/data/eaa-checklist.json"
import InteractiveEAAChecklist from "@/components/checklists/interactive-eaa-checklist"
import { FaqSection } from "@/components/seo/faq-section"
import { AccessibilityToolStructuredData, BreadcrumbStructuredData } from "@/components/seo/structured-data"
import { ClipboardCheck, FileSpreadsheet, Landmark, ScrollText, SearchCheck, TriangleAlert } from "lucide-react"

const ROW_COUNT = checklistData.rows.length
const SECTION_COUNT = checklistData.sections.length
const VERIFIED_LABEL = "19 October 2026"

export const metadata = createMetadata({
  title: "European Accessibility Act (EAA) Checklist: Excel Export",
  path: "/checklists/eaa",
  description: `Free interactive EAA readiness checklist: ${ROW_COUNT} obligations from Directive (EU) 2019/882, each cited to its article or annex, with status tracking, evidence to keep, notes and Excel export. Covers the Annex I service requirements, the Article 13 published information, Article 14 disproportionate burden and the Article 32 transition.`,
  keywords: [
    "EAA checklist",
    "European Accessibility Act checklist",
    "EAA readiness checklist",
    "EAA compliance checklist",
    "EAA checklist excel",
    "Directive 2019/882 requirements",
    "EAA Annex I requirements",
    "EAA Annex V",
    "EAA disproportionate burden",
    "European Accessibility Act requirements",
  ],
})

// One array powers both the visible FAQ and the FAQPage schema via FaqSection.
const faqs = [
  {
    question: "Does the European Accessibility Act apply to my website?",
    answer:
      "It applies if the website is part of a service listed in Article 2(2) and provided to consumers after 28 June 2025. The widest category is e-commerce services, defined in Article 3(30) as services provided at a distance, through websites and mobile device-based services, by electronic means and at the individual request of a consumer with a view to concluding a consumer contract. Any site where a consumer in the EU can buy something, subscribe or sign a contract online is in. A purely business-to-business site, or a brochure site with no consumer transaction, is not caught by that category. Use the sector buttons above the checklist to filter to your situation, or run the EAA scope checker first.",
  },
  {
    question: "What is the microenterprise exemption and does it cover me?",
    answer:
      "Article 4(5) exempts microenterprises providing services from the service requirements. Article 3(23) defines a microenterprise as an enterprise that employs fewer than 10 persons and has an annual turnover not exceeding EUR 2 million or an annual balance sheet total not exceeding EUR 2 million. Both parts matter: an agency with 8 staff and EUR 3 million turnover is not a microenterprise. The exemption does not cover products. A microenterprise manufacturer still has to meet Annex I; it only escapes documenting its Article 14 assessment and the Article 14(8) notification. Keep the figures that prove your status on file and re-check them each financial year.",
  },
  {
    question: "What information does the EAA require me to publish?",
    answer:
      "Article 13(2) requires every service provider to prepare the information described in Annex V, explaining how the service meets the applicable accessibility requirements, to make it available to the public in written and oral format in a manner accessible to persons with disabilities, and to keep it for as long as the service operates. Annex V says the information goes in the general terms and conditions or an equivalent document and must contain a general description of the service in accessible formats, the explanations needed to understand how the service operates, and a description of how the Annex I requirements are met. In practice this is an accessibility statement that your terms link to. Annex V, point 3 also asks for information showing that your delivery process and its monitoring keep the service compliant.",
  },
  {
    question: "Is WCAG 2.2 AA conformance the same as EAA compliance?",
    answer:
      "No, but for a website or app it is most of the technical work. Annex I, Section III, point (c) requires websites and mobile apps to be perceivable, operable, understandable and robust, which are the WCAG principles, and the technical route is EN 301 549, whose web chapter incorporates WCAG at Level AA. Article 15 gives a presumption of conformity only for harmonised standards cited in the Official Journal under this Directive, and as of 19 October 2026 no edition of EN 301 549 is cited under the EAA: v3.2.1 is cited under the Web Accessibility Directive only, and ETSI's v4.1.1 (WCAG 2.2) is expected to be cited in late November or December 2026. WCAG also says nothing about the rest of the Act: the published Annex V information, support services, electronic documents such as invoices and e-tickets, the sector requirements, the corrective action and notification duties, and the Article 14 paper trail. This checklist covers those.",
  },
  {
    question: "Does the transitional period until 2030 mean my website can wait?",
    answer:
      "No. Article 32(1) lets service providers keep using products that were lawfully in use before 28 June 2025 until 28 June 2030, and lets service contracts agreed before 28 June 2025 run unaltered until they expire, but no longer than five years from that date. Article 32(2) lets Member States allow self-service terminals in use before 28 June 2025 to continue until the end of their economically useful life, capped at 20 years from entry into use. None of that covers a website, an app or the service itself; those had to comply from 28 June 2025 under Article 31(2).",
  },
  {
    question: "What is disproportionate burden and how do I claim it?",
    answer:
      "Article 14 says the accessibility requirements apply only to the extent that compliance does not fundamentally alter the basic nature of the product or service and does not impose a disproportionate burden. It is not a declaration you make. It is an assessment you carry out against the Annex VI criteria (the ratio of net compliance cost to overall cost, the costs and benefits set against the benefit to persons with disabilities, and the ratio of net compliance cost to net turnover), document, keep for five years, renew at least every five years or when the service changes, and notify to the authority of each Member State concerned under Article 14(8). You cannot rely on it at all if you received outside funding to improve accessibility (Article 14(6)), and it never covers the requirements you can meet, only the specific ones the assessment supports.",
  },
  {
    question: "Who enforces the EAA and what are the penalties?",
    answer:
      "National authorities, not a European body. Article 23 requires each Member State to designate authorities that check services, follow up complaints and verify corrective action; Articles 19 to 22 do the same for market surveillance of products. Article 29 gives consumers the right to go to court or to an administrative body under national law, and lets organisations with a legitimate interest act on their behalf. Article 30 requires national penalties that are effective, proportionate and dissuasive, with remedial action, scaled to the seriousness of the breach and the number of people affected. The actual fines, and whether breaches are criminal offences, are set in each national transposition law, which is why the first section of the checklist asks you to list the national laws that apply to you.",
  },
  {
    question: "Can I export this checklist to Excel, and where is my progress saved?",
    answer:
      "Yes, free and with no account. The Export Excel button writes every obligation in your selected scope with its source, who it applies to, the evidence to keep, the Directive notes, your status and your notes, plus a summary sheet with the date, scope and progress. Statuses and notes save to your browser's local storage on this device; nothing is sent to our servers. Use the export to share progress with colleagues or to hand an auditor a starting point.",
  },
]

const structureCards = [
  {
    title: "Annex I, Section III",
    body: "General requirements for every in-scope service: accessible websites and apps, accessible information about the service, accessible products used to deliver it, and support services that can talk about accessibility.",
    accent: "border-blue-200 dark:border-blue-800/50",
  },
  {
    title: "Annex I, Section IV",
    body: "Additional requirements by sector: electronic communications, access to audiovisual media, passenger transport, consumer banking, e-books and e-commerce.",
    accent: "border-indigo-200 dark:border-indigo-800/50",
  },
  {
    title: "Article 13 and Annex V",
    body: "The service provider's operating duties: the published accessibility information, the procedures that keep the service compliant, corrective action, and notifying the authorities.",
    accent: "border-teal-200 dark:border-teal-800/50",
  },
  {
    title: "Article 14 and Annex VI",
    body: "Fundamental alteration and disproportionate burden: the assessment criteria, the five-year documentation and renewal cycle, and the notification duty.",
    accent: "border-amber-200 dark:border-amber-800/50",
  },
  {
    title: "Article 32",
    body: "The transition: products in use and contracts agreed before 28 June 2025 are protected to 28 June 2030, self-service terminals for up to 20 years. Websites and apps are not.",
    accent: "border-rose-200 dark:border-rose-800/50",
  },
  {
    title: "Articles 7 to 12, Annex I Sections I and II, Annex IV",
    body: "Products: what manufacturers, importers and distributors of the listed hardware, terminals and e-readers must design, document, mark and keep.",
    accent: "border-slate-200 dark:border-slate-700",
  },
]

export default function EAAChecklistPage() {
  const dateModified = getRouteDate("/checklists/eaa") ?? checklistData.verified

  return (
    <div className="min-h-screen pt-12 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-[#0a0f1a] dark:via-[#0d1321] dark:to-[#0a0f1a]">
      {/* Compact header */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/20 flex-shrink-0 mt-0.5">
                <ClipboardCheck className="w-6 h-6 text-white" aria-hidden="true" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  EAA Readiness Checklist
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
                  Every obligation in the European Accessibility Act, Directive (EU) 2019/882, as a
                  trackable row with its article or annex reference, the evidence to keep, a status, your
                  notes and Excel export.{" "}
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {ROW_COUNT} obligations in {SECTION_COUNT} sections
                  </span>
                  , filtered by sector.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 flex-shrink-0 lg:ml-4">
              <Link
                href="/compliance/eaa"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700/50 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
              >
                <Landmark className="w-4 h-4" aria-hidden="true" />
                What is the EAA?
              </Link>
              <Link
                href="/tools/eaa-scope-checker"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700/50 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
              >
                <SearchCheck className="w-4 h-4" aria-hidden="true" />
                Am I in scope?
              </Link>
              <Link
                href="/checklists/en-301-549"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700/50 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
              >
                <ScrollText className="w-4 h-4" aria-hidden="true" />
                EN 301 549 Checklist
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Source and standards note */}
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-3">
        <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-800/60 dark:bg-blue-950/25">
          <FileSpreadsheet className="mt-0.5 h-5 w-5 shrink-0 text-blue-700 dark:text-blue-300" aria-hidden="true" />
          <p className="text-sm leading-relaxed text-blue-900 dark:text-blue-100">
            <strong>Sourced to the Directive (verified {VERIFIED_LABEL}):</strong> every row cites the
            article, annex, section and point of Directive (EU) 2019/882 it comes from, checked against the{" "}
            <a
              href={checklistData.textUrl}
              className="underline hover:no-underline"
              rel="noopener noreferrer"
              target="_blank"
            >
              EUR-Lex text (CELEX 32019L0882)
            </a>
            . Obligations are plain-language paraphrases, not the normative text. Your duties sit in the
            national law transposing the Directive, which can add detail and sets the penalties.
          </p>
        </div>
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800/60 dark:bg-amber-950/25">
          <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-700 dark:text-amber-300" aria-hidden="true" />
          <p className="text-sm leading-relaxed text-amber-900 dark:text-amber-200">
            <strong>Standards note:</strong> as of {VERIFIED_LABEL} no edition of EN 301 549 is cited in the
            Official Journal under the EAA. v3.2.1 is cited under the Web Accessibility Directive only, so it
            gives no presumption of conformity under this Act. ETSI published v4.1.1, aligned to WCAG 2.2, on
            2 September 2026; its citation under the EAA is expected in late November or December 2026. Until
            then, treat WCAG 2.2 AA and{" "}
            <Link href="/compliance/en-301-549" className="underline hover:no-underline">
              EN 301 549
            </Link>{" "}
            results as evidence of meeting Annex I, not as a legal presumption.
          </p>
        </div>
      </div>

      {/* Checklist */}
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <InteractiveEAAChecklist />
      </div>

      {/* Info + FAQ */}
      <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/50">
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-5xl mx-auto space-y-12">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                How the Directive is organised
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 max-w-3xl">
                The Act states outcomes, not techniques. The requirements themselves live in Annex I; the
                operating duties, exceptions and transition live in the articles. The checklist follows that
                structure so each row can be traced back to the text.
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {structureCards.map((card) => (
                  <div
                    key={card.title}
                    className={`p-4 bg-white dark:bg-slate-800/60 rounded-xl border ${card.accent}`}
                  >
                    <p className="font-semibold text-slate-900 dark:text-white text-sm">{card.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                      {card.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                How to use it
              </h2>
              <ol className="list-decimal pl-5 space-y-2 text-sm text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
                <li>
                  Pick your sector. The common sections (scope, general service requirements, service
                  provider duties, disproportionate burden, transition, enforcement and standards) stay in
                  every service scope; the sector section is added on top. Manufacturers, importers and
                  distributors use the products scope.
                </li>
                <li>
                  Work through the scope section first. If you are an exempt microenterprise or a
                  requirement genuinely does not apply, mark it not applicable; the progress bar then
                  counts only what applies to you.
                </li>
                <li>
                  Open the evidence line on each row and record where that evidence lives in your note.
                  Article 13(5) and Article 14(3) both turn on being able to hand documents to an
                  authority on request.
                </li>
                <li>
                  Export to Excel to share with colleagues or an auditor. Statuses and notes stay in your
                  browser; nothing is uploaded.
                </li>
              </ol>
            </div>

            <FaqSection faqs={faqs} title="EAA Checklist FAQ" />

            <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <Link
                href="/checklists"
                className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                &larr; All checklists
              </Link>
              <span className="text-slate-300 dark:text-slate-700">&middot;</span>
              <Link
                href="/compliance/eaa"
                className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                EAA compliance guide
              </Link>
              <span className="text-slate-300 dark:text-slate-700">&middot;</span>
              <Link
                href="/compliance/eaa-ireland"
                className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                EAA in Ireland
              </Link>
              <span className="text-slate-300 dark:text-slate-700">&middot;</span>
              <Link
                href="/research/european-accessibility-act"
                className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                EAA tracker
              </Link>
              <span className="text-slate-300 dark:text-slate-700">&middot;</span>
              <Link
                href="/tools/eaa-scope-checker"
                className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                EAA Scope Checker
              </Link>
              <span className="text-slate-300 dark:text-slate-700">&middot;</span>
              <Link
                href="/guides/how-to-write-an-accessibility-statement"
                className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Write the Annex V statement
              </Link>
              <span className="text-slate-300 dark:text-slate-700">&middot;</span>
              <Link
                href="/services/accessibility-audits"
                className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Professional audits
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Structured data (FAQPage is emitted by FaqSection from the same array) */}
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "Checklists", url: "https://accessibility.build/checklists" },
          { name: "EAA Readiness Checklist", url: "https://accessibility.build/checklists/eaa" },
        ]}
      />
      <AccessibilityToolStructuredData
        name="EAA Readiness Checklist"
        description={`Interactive European Accessibility Act checklist: ${ROW_COUNT} obligations from Directive (EU) 2019/882 cited to their article or annex, with sector filters, status tracking, evidence to keep, notes and Excel export. Dataset verified against the Directive text on ${dateModified}.`}
        url="https://accessibility.build/checklists/eaa"
        applicationCategory="AccessibilityApplication"
        operatingSystem="Web Browser"
        offers={{ price: "0", priceCurrency: "USD" }}
        featureList={[
          "Sector filters for e-commerce, banking, e-books, transport, telecoms, audiovisual media and products",
          "Four-state status per obligation with notes",
          "Evidence to keep for each obligation",
          "Excel export with summary sheet",
          "Progress saved in the browser",
        ]}
        accessibilityFeatures={["keyboardNavigation", "screenReaderSupport"]}
      />
    </div>
  )
}
