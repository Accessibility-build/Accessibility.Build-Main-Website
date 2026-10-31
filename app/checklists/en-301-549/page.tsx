import Link from "next/link"
import { createMetadata } from "@/lib/metadata"
import InteractiveEN301549Checklist from "@/components/checklists/interactive-en301549-checklist"
import v3Data from "@/lib/data/en-301-549-checklist.json"
import v4Data from "@/lib/data/en-301-549-v4-checklist.json"
import { ScrollText, FileSpreadsheet, Landmark, TriangleAlert, GitCompareArrows } from "lucide-react"
import { FAQStructuredData, AccessibilityToolStructuredData } from "@/components/seo/structured-data"

const v3Requirements = v3Data.rows.filter((r) => r.kind === "requirement").length
const v3WcagRows = v3Data.rows.filter((r) => r.chapter === "9" && r.wcag).length
const v4Requirements = v4Data.counts.requirements
const v4WcagRows = v4Data.rows.filter((r) => r.chapter === "9" && r.wcag).length
const v4New = v4Data.counts.new
const v4Changed = v4Data.counts.changed
const v4Removed = v4Data.counts.removedFromV3

export const metadata = createMetadata({
  title: "EN 301 549 Checklist - Free Interactive & Excel Export",
  path: "/checklists/en-301-549",
  description: `Free interactive EN 301 549 checklist for v3.2.1 (cited today) and v4.1.1 (WCAG 2.2, published September 2026): ${v3Requirements} and ${v4Requirements} requirements with plain-language summaries, WCAG mapping, change tracking against v3.2.1, EAA conformance-table scopes, notes, and Excel export.`,
  keywords: [
    "EN 301 549 checklist",
    "EN 301 549 requirements",
    "EN 301 549 excel",
    "EN 301 549 v4 checklist",
    "EN 301 549 v4.1.1",
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
    question: "Which versions of EN 301 549 does this checklist cover?",
    answer: `Both current editions, with a switch at the top. Version 3.2.1 (March 2021) is the edition cited in the Official Journal of the EU, and only for the Web Accessibility Directive (Commission Implementing Decision (EU) 2018/2048 as amended by Decision (EU) 2021/1339). Version 4.1.1 was published by ETSI, CEN and CENELEC on 2 September 2026: it aligns clauses 9 to 11 with WCAG 2.2, rewrites the real-time text and total conversation requirements, and adds Annex ZB and the clause A.2 conformance tables for the European Accessibility Act. V4.1.1 is not yet cited in the Official Journal; the citation is expected between late November and mid-December 2026. Each edition keeps its own progress, notes, and Excel export.`,
  },
  {
    question: "How many requirements does EN 301 549 contain?",
    answer: `V3.2.1 has ${v3Requirements} testable requirements across chapters 5 to 13, of which ${v3WcagRows} in chapter 9 are the WCAG 2.1 Level A and AA success criteria, plus 12 functional performance statements in chapter 4 that are descriptive rather than testable. V4.1.1 has ${v4Requirements} testable requirements, of which ${v4WcagRows} in chapter 9 are the WCAG 2.2 Level A and AA criteria; its chapter 4 criteria are now written with "shall" and have their own Annex C tests, so they count as requirements. Both editions keep void slots so the clause numbering stays aligned with WCAG; those appear as information rows.`,
  },
  {
    question: "What changed between v3.2.1 and v4.1.1?",
    answer: `Against the v3.2.1 dataset, v4.1.1 has ${v4New} new rows, ${v4Changed} changed rows, and ${v4Removed} v3.2.1 clauses with no v4.1.1 row (merged, moved, dropped, or made informative). The headline changes are WCAG 2.2 in clauses 9 to 11 (six new criteria, Parsing removed), new user-preference clauses 9.7, 10.7 and 11.7, a rewritten clause 6 built around total conversation and real-time text, functional performance criteria written with "shall", a rewritten stationary-ICT clause 8.3, and the EAA mapping in Annex ZB. Switch to v4.1.1 and tick "Only rows that are new or changed" to see them, or read the clause-by-clause guide linked above the checklist.`,
  },
  {
    question: "Which version should I audit against today?",
    answer:
      "Test against WCAG 2.2 AA now, whichever edition you cite. WCAG 2.2 is backwards-compatible with 2.1, so work done against 2.2 satisfies the WCAG 2.1 clauses of v3.2.1 and is already aligned with v4.1.1. For a Web Accessibility Directive statement, cite v3.2.1 until the Official Journal lists v4.1.1. For the European Accessibility Act there is no cited edition yet, so a conformance claim today is a statement of what you tested against, not a presumption of conformity; v4.1.1 is the edition built for the Act and the one to prepare for. Always name the exact edition in your conformance report.",
  },
  {
    question: "Do I need to check every chapter?",
    answer:
      "No. The chapters apply by product type: a website is assessed against chapter 9 plus chapter 12 (information about products and services); downloadable documents add chapter 10; native software and mobile apps use chapter 11 (and, in v4.1.1, the authoring-tool clauses now in 5.10); hardware and self-service terminals bring in chapters 5 to 8. Use the scope buttons above the checklist, or, in v4.1.1, pick one of the five EAA conformance tables from clause A.2 (web page, non-web document, software, hardware, all ICT), which are the sets the standard itself says to assess for the European Accessibility Act.",
  },
  {
    question: "Why do some clause numbers show as void?",
    answer:
      "EN 301 549 keeps its clause numbering aligned with WCAG so that, for example, clause 9.1.4.3 is always WCAG 1.4.3. Where a WCAG slot is Level AAA (such as 1.4.6), or a criterion does not apply in a context (such as Bypass Blocks for a single document), the standard marks the slot void rather than renumbering everything. V4.1.1 adds a void at 9.4.1.1 because WCAG 2.2 removed Parsing. This checklist shows void rows so auditors are not left wondering whether something is missing.",
  },
  {
    question: "Can I export this checklist to Excel?",
    answer:
      "Yes, free and with no account, for either edition. The export contains every clause in your selected scope with its type, applicability, WCAG mapping, advisory flag, your status and notes, and the plain-language summary, plus a summary sheet stating the edition and its legal status. The v4.1.1 export adds the change against v3.2.1, the previous clause number, and a third sheet listing the v3.2.1 clauses with no v4.1.1 row. Your checkmarks and notes also auto-save to your browser's local storage, separately for each edition.",
  },
  {
    question: "Is completing this checklist the same as EAA compliance?",
    answer:
      "No checklist is. Once v4.1.1 is cited in the Official Journal under the European Accessibility Act, conformance with the clauses in its Tables A.1 to A.5 gives a presumption of conformity with the Act's accessibility requirements; before that, no edition does. Even then, the summaries here are plain-language explanations, not the normative text, and self-assessment against any checklist is only as good as the testing behind it. Use this to structure and track an assessment, verify findings against the published standard, and consider a professional audit for anything with legal exposure.",
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
                  Every requirement of EN 301 549, the European ICT accessibility standard behind the
                  EAA and the Web Accessibility Directive, in plain language and in both current editions:{" "}
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {v3Requirements} requirements in v3.2.1
                  </span>{" "}
                  (cited today) and{" "}
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {v4Requirements} in v4.1.1
                  </span>{" "}
                  (WCAG 2.2, published September 2026), with WCAG cross-links, change tracking, notes,
                  and Excel export.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 flex-shrink-0 lg:ml-4">
              <Link
                href="/compliance/en-301-549-v4"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-700/50 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
              >
                <GitCompareArrows className="w-4 h-4" aria-hidden="true" />
                What changed in v4.1.1
              </Link>
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
          <div className="text-sm leading-relaxed text-amber-900 dark:text-amber-200 space-y-2">
            <p>
              <strong>Legal status (reviewed 19 October 2026):</strong> <strong>v3.2.1</strong> is the only
              edition cited in the Official Journal of the EU, and only under the{" "}
              <strong>Web Accessibility Directive</strong> (Commission Implementing Decision (EU) 2018/2048,
              as amended by Decision (EU) 2021/1339). <strong>No edition of EN 301 549 is cited under the
              European Accessibility Act</strong>, so there is no EAA presumption of conformity through any
              version until V4.1.1 is cited.
            </p>
            <p>
              <strong>v4.1.1</strong> was adopted by ETSI, CEN and CENELEC on 24 August 2026 and published on
              2 September 2026. Its Official Journal citation is expected between{" "}
              <strong>late November and mid-December 2026</strong>: Deque reports 30 November (also ETSI&apos;s
              national-announcement date), Ireland&apos;s National Disability Authority expects 16 December.
              Until then, cite v3.2.1 for Web Accessibility Directive statements, audit against WCAG 2.2 AA,
              and use the v4.1.1 switch to see what you will be tested against next;{" "}
              <Link href="/compliance/en-301-549-v4" className="underline hover:no-underline">
                read exactly what changes in v4.1.1
              </Link>
              .
            </p>
            <p>
              In India, IS 17802 (Part 1): 2021 is the technical adoption of the v3.2.1 text, so the
              v3.2.1 edition doubles as an interim IS 17802 checklist;{" "}
              <Link href="/compliance/india" className="underline hover:no-underline">
                see the India compliance guide
              </Link>
              .
            </p>
          </div>
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
                    Chapter 9 (WCAG 2.1 A/AA in v3.2.1; WCAG 2.2 A/AA plus user preferences in v4.1.1) and chapter 12. In v4.1.1 this is EAA Table A.1.
                  </p>
                </div>
                <div className="p-4 bg-white dark:bg-slate-800/60 rounded-xl border border-teal-200 dark:border-teal-800/50">
                  <p className="font-semibold text-slate-900 dark:text-white text-sm">Documents</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Chapter 10 applies adapted WCAG criteria to PDFs, Office files, and e-books. In v4.1.1 this is EAA Table A.2.
                  </p>
                </div>
                <div className="p-4 bg-white dark:bg-slate-800/60 rounded-xl border border-indigo-200 dark:border-indigo-800/50">
                  <p className="font-semibold text-slate-900 dark:text-white text-sm">Software & apps</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Chapter 11, including assistive-technology interoperability; authoring tools are 11.8 in v3.2.1 and 5.10 in v4.1.1. EAA Table A.3.
                  </p>
                </div>
                <div className="p-4 bg-white dark:bg-slate-800/60 rounded-xl border border-amber-200 dark:border-amber-800/50">
                  <p className="font-semibold text-slate-900 dark:text-white text-sm">Hardware & terminals</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Chapters 5 to 8: closed functionality, communication, video, and physical access. EAA Table A.4, with the generic clauses in Table A.5.
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
                href="/compliance/en-301-549-v4"
                className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                V4.1.1 clause by clause
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
                href="/compliance/india"
                className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                IS 17802 (India)
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
        description={`Interactive checklist covering every requirement of EN 301 549 v3.2.1 (${v3Requirements} requirements) and v4.1.1 (${v4Requirements} requirements, WCAG 2.2) with plain-language summaries, WCAG mapping, change tracking, progress tracking, notes, and Excel export`}
        url="https://accessibility.build/checklists/en-301-549"
        applicationCategory="DeveloperApplication"
        operatingSystem="Web Browser"
        offers={{ price: "0", priceCurrency: "USD" }}
        accessibilityFeatures={["keyboardNavigation", "screenReaderSupport", "highContrastDisplay"]}
      />
    </div>
  )
}
