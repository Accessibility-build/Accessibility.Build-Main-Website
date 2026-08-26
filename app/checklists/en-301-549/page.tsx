import Link from "next/link"
import { createMetadata } from "@/lib/metadata"
import InteractiveEN301549Checklist from "@/components/checklists/interactive-en301549-checklist"
import { ScrollText, FileSpreadsheet, Landmark, TriangleAlert } from "lucide-react"
import { FAQStructuredData, AccessibilityToolStructuredData } from "@/components/seo/structured-data"

export const metadata = createMetadata({
  title: "EN 301 549 Checklist - Free Interactive & Excel Export",
  path: "/checklists/en-301-549",
  description:
    "Free interactive EN 301 549 v3.2.1 checklist: all 285 requirements across web, documents, software, and hardware, with plain-language summaries, WCAG 2.1 mapping, progress tracking, notes, and Excel export for EAA and EU compliance audits.",
  keywords: [
    "EN 301 549 checklist",
    "EN 301 549 requirements",
    "EN 301 549 excel",
    "EAA checklist",
    "european accessibility act checklist",
    "EN 301 549 WCAG mapping",
    "EN 301 549 audit",
    "EN 301 549 v3.2.1",
    "ICT accessibility checklist",
  ],
})

// One array powers both the page's FAQPage schema and the visible FAQ section.
const faqs = [
  {
    question: "Which version of EN 301 549 does this checklist cover?",
    answer:
      "Version 3.2.1 (March 2021), the version cited in the Official Journal of the EU and therefore the one that carries a presumption of conformity for the European Accessibility Act and the Web Accessibility Directive today. A revised edition aligned to WCAG 2.2 (v4) is in the ETSI approval pipeline; until it is published and cited in the Official Journal, v3.2.1 remains the version to test and cite. Because WCAG 2.2 is backwards-compatible, work done against WCAG 2.2 AA already satisfies the WCAG 2.1 clauses here.",
  },
  {
    question: "How many requirements does EN 301 549 contain?",
    answer:
      "This checklist tracks 285 testable requirements across chapters 5 to 13, of which 50 in chapter 9 are the WCAG 2.1 Level A and AA success criteria applied to web pages. Chapters 10 (documents) and 11 (software) apply adapted versions of the same criteria, and chapters 5 to 8, 12, and 13 cover generic capabilities, communication, video, hardware, documentation, and relay services. The standard also contains 12 functional performance statements (chapter 4) and a number of void or not-applicable slots that keep the WCAG numbering aligned; those appear as information rows so the numbering makes sense.",
  },
  {
    question: "Do I need to check every chapter?",
    answer:
      "No. The chapters apply by product type: a website is assessed against chapter 9 plus chapter 12 (documentation and support); downloadable documents add chapter 10; native software and mobile apps use chapter 11; hardware and self-service terminals bring in chapters 5 to 8. Use the scope buttons above the checklist to filter to your product type, and the progress bar recalculates for that scope.",
  },
  {
    question: "Why do some clause numbers show as void?",
    answer:
      "EN 301 549 keeps its clause numbering aligned with WCAG so that, for example, clause 9.1.4.3 is always WCAG 1.4.3. Where a WCAG slot is Level AAA (such as 1.4.6) or a criterion does not apply in a context (such as Bypass Blocks for a single document), the standard marks the slot void rather than renumbering everything. This checklist shows void rows so auditors are not left wondering whether something is missing.",
  },
  {
    question: "Can I export this checklist to Excel?",
    answer:
      "Yes, free and with no account. The Excel export contains every clause in your selected scope with its type, applicability, WCAG mapping, advisory flag, your status and notes, and the plain-language summary, plus a summary sheet. Your checkmarks and notes also auto-save to your browser's local storage between sessions on the same device.",
  },
  {
    question: "Is completing this checklist the same as EAA compliance?",
    answer:
      "No checklist is. EN 301 549 conformance gives a presumption of conformity with the European Accessibility Act's technical requirements, but the summaries here are plain-language explanations, not the normative text, and self-assessment against any checklist is only as good as the testing behind it. Use this to structure and track an assessment, verify findings against the published standard, and consider a professional audit for anything with legal exposure.",
  },
]

export default function EN301549ChecklistPage() {
  return (
    <div className="min-h-screen pt-12 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-[#0a0f1a] dark:via-[#0d1321] dark:to-[#0a0f1a]">
      {/* Compact header */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-gradient-to-br from-blue-600 to-teal-600 rounded-xl shadow-lg shadow-blue-500/20 flex-shrink-0 mt-0.5">
                <ScrollText className="w-6 h-6 text-white" aria-hidden="true" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  Interactive EN 301 549 Checklist
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
                  Every requirement of EN 301 549 v3.2.1, the European ICT accessibility standard
                  behind the EAA and the Web Accessibility Directive, in plain language with{" "}
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    285 trackable requirements
                  </span>
                  , WCAG 2.1 cross-links, notes, and Excel export.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 lg:ml-4">
              <Link
                href="/compliance/en-301-549"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700/50 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
              >
                <Landmark className="w-4 h-4" aria-hidden="true" />
                What is EN 301 549?
              </Link>
              <Link
                href="/checklists/wcag-2-2"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700/50 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
              >
                <FileSpreadsheet className="w-4 h-4" aria-hidden="true" />
                WCAG 2.2 Checklist
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Version note */}
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800/60 dark:bg-amber-950/25">
          <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-700 dark:text-amber-300" aria-hidden="true" />
          <p className="text-sm leading-relaxed text-amber-900 dark:text-amber-200">
            <strong>Version note (reviewed 27 August 2026):</strong> this checklist follows{" "}
            <strong>v3.2.1</strong>, the version currently cited in the Official Journal and the
            one that carries legal presumption of conformity. The v4 revision aligned to WCAG 2.2
            is in the ETSI approval pipeline;{" "}
            <Link href="/compliance/en-301-549" className="underline hover:no-underline">
              see exactly what changes in v4
            </Link>
            . Auditing against WCAG 2.2 AA today satisfies the WCAG 2.1 clauses here and is
            already aligned with where v4 lands.
          </p>
        </div>
      </div>

      {/* Checklist */}
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <InteractiveEN301549Checklist />
      </div>

      {/* Info + FAQ */}
      <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/50">
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-5xl mx-auto space-y-12">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                How the chapters map to products
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-4 bg-white dark:bg-slate-800/60 rounded-xl border border-blue-200 dark:border-blue-800/50">
                  <p className="font-semibold text-slate-900 dark:text-white text-sm">Websites & web apps</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Chapter 9 (the WCAG 2.1 A/AA criteria) plus chapter 12 for documentation and support
                  </p>
                </div>
                <div className="p-4 bg-white dark:bg-slate-800/60 rounded-xl border border-teal-200 dark:border-teal-800/50">
                  <p className="font-semibold text-slate-900 dark:text-white text-sm">Documents</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Chapter 10 applies adapted WCAG criteria to PDFs, Office files, and e-books
                  </p>
                </div>
                <div className="p-4 bg-white dark:bg-slate-800/60 rounded-xl border border-indigo-200 dark:border-indigo-800/50">
                  <p className="font-semibold text-slate-900 dark:text-white text-sm">Software & apps</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Chapter 11, including assistive-technology interoperability and authoring tools
                  </p>
                </div>
                <div className="p-4 bg-white dark:bg-slate-800/60 rounded-xl border border-amber-200 dark:border-amber-800/50">
                  <p className="font-semibold text-slate-900 dark:text-white text-sm">Hardware & terminals</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Chapters 5 to 8: closed functionality, communication, video, and physical access
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                EN 301 549 Checklist FAQ
              </h2>
              <div className="space-y-3">
                {faqs.map((faq) => (
                  <div
                    key={faq.question}
                    className="p-4 bg-white dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/50"
                  >
                    <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{faq.question}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <Link
                href="/checklists"
                className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                &larr; All checklists
              </Link>
              <span className="text-slate-300 dark:text-slate-700">&middot;</span>
              <Link
                href="/compliance/en-301-549"
                className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                EN 301 549 explained
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
                href="/tools/eaa-scope-checker"
                className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                EAA Scope Checker
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

      {/* Structured data */}
      <FAQStructuredData faqs={faqs} />
      <AccessibilityToolStructuredData
        name="EN 301 549 Interactive Checklist"
        description="Interactive checklist covering every requirement of EN 301 549 v3.2.1 with plain-language summaries, WCAG 2.1 mapping, progress tracking, notes, and Excel export"
        url="https://accessibility.build/checklists/en-301-549"
        applicationCategory="AccessibilityApplication"
        operatingSystem="Web Browser"
        offers={{ price: "0", priceCurrency: "USD" }}
        accessibilityFeatures={["keyboardNavigation", "screenReaderSupport", "highContrastDisplay"]}
      />
    </div>
  )
}
