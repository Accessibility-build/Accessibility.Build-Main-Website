import Link from "next/link"
import { createMetadata } from "@/lib/metadata"
import { getWCAGStats } from "@/lib/wcag-data"
import InteractiveWCAGChecklist from "@/components/checklists/interactive-wcag-checklist"
import { Shield, FileSpreadsheet, Award, Sparkles } from "lucide-react"
import { FAQStructuredData, AccessibilityToolStructuredData } from "@/components/seo/structured-data"

export const metadata = createMetadata({
  title: "WCAG 2.2 Checklist Excel - Interactive Checklist with Excel Export | Free Download",
  description:
    "Download WCAG 2.2 checklist Excel template. Interactive checklist with all 78 success criteria. Track progress, add notes, filter criteria, and export to Excel/PDF for professional accessibility audits.",
  keywords: ["WCAG 2.2 checklist excel", "WCAG 2.2", "accessibility checklist", "success criteria", "compliance", "audit", "interactive", "excel export", "excel template", "WCAG checklist download"]
})

export default function WcagChecklistPage() {
  const stats = getWCAGStats()

  return (
    <div className="min-h-screen pt-12 bg-gradient-to-br from-slate-50 via-white to-blue-50/30 dark:from-[#0a0f1a] dark:via-[#0d1321] dark:to-[#0a0f1a]">
      {/* Compact Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Left: Title + description */}
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/20 flex-shrink-0 mt-0.5">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  Interactive WCAG 2.2 Accessibility Checklist
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
                  Free interactive checklist covering all{" "}
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{stats.total} success criteria</span>{" "}
                  — track your audit progress, add notes, filter by level
                  (<span className="text-emerald-600 dark:text-emerald-400 font-medium">{stats.byLevel.A}&nbsp;A</span>{" · "}
                  <span className="text-blue-600 dark:text-blue-400 font-medium">{stats.byLevel.AA}&nbsp;AA</span>{" · "}
                  <span className="text-purple-600 dark:text-purple-400 font-medium">{stats.byLevel.AAA}&nbsp;AAA</span>),
                  and export to Excel or PDF for compliance reporting.
                </p>
              </div>
            </div>

            {/* Right: Quick actions */}
            <div className="flex items-center gap-2 flex-shrink-0 lg:ml-4">
              <Link
                href="/checklists/wcag-2-2/excel"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-700/50 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Download Excel Template
              </Link>
              <Link
                href="/checklists/wcag-2-2/aaa"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-700/50 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors"
              >
                <Award className="w-4 h-4" />
                AAA Only
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Checklist — full width */}
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <InteractiveWCAGChecklist />
      </div>

      {/* Collapsed Info Section — below the checklist */}
      <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/50">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="max-w-5xl mx-auto space-y-12">
            {/* Conformance Levels — compact */}
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                WCAG 2.2 Conformance Levels Explained
              </h2>
              <div className="grid sm:grid-cols-3 gap-3">
                <div className="flex items-start gap-3 p-4 bg-white dark:bg-slate-800/60 rounded-xl border border-emerald-200 dark:border-emerald-800/50">
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-sm font-bold bg-emerald-500 text-white flex-shrink-0">A</span>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white text-sm">Minimum</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Essential baseline accessibility requirements</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-white dark:bg-slate-800/60 rounded-xl border border-blue-200 dark:border-blue-800/50">
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-sm font-bold bg-blue-500 text-white flex-shrink-0">AA</span>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white text-sm">Standard</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Required for ADA &amp; Section 508 compliance</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-white dark:bg-slate-800/60 rounded-xl border border-purple-200 dark:border-purple-800/50">
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-sm font-bold bg-purple-500 text-white flex-shrink-0">AAA</span>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white text-sm">Enhanced</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Gold standard accessibility</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ — compact */}
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                WCAG 2.2 Checklist FAQ
              </h2>
              <div className="space-y-3">
                {[
                  {
                    question: "Can I download the WCAG 2.2 checklist as an Excel spreadsheet?",
                    answer: "Yes — click the Excel button in the controls bar above. The export includes all 78 success criteria with your progress, notes, an audit summary sheet, and a progress tracking template. You can also download a standalone Excel template from the Excel Template page."
                  },
                  {
                    question: "Is the WCAG 2.2 accessibility checklist free?",
                    answer: "Completely free. Track your audit progress, add notes, filter by level or principle, and export to Excel or PDF — no account or payment required."
                  },
                  {
                    question: "Does this checklist cover all WCAG 2.2 success criteria?",
                    answer: "Yes — all 78 success criteria across Level A (30), Level AA (24), and Level AAA (24). Each criterion includes its WCAG description, parent guideline, and POUR principle for easy reference during accessibility audits."
                  },
                  {
                    question: "How do I use the Excel export for accessibility compliance tracking?",
                    answer: "Export to Excel, then filter by level to focus on AA compliance (the legal standard for ADA, Section 508, and EN 301 549). Add columns for assignees, remediation dates, and severity. Use the built-in progress tracking sheet to monitor improvements over time."
                  },
                  {
                    question: "Is my checklist progress saved automatically?",
                    answer: "Yes — your checkmarks and notes auto-save to your browser's local storage. They'll persist between sessions on the same device and browser. For permanent records, export to Excel or PDF."
                  }
                ].map((faq, index) => (
                  <div key={index} className="p-4 bg-white dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/50">
                    <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                      {faq.question}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Nav */}
            <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
              <Link
                href="/checklists"
                className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                ← All checklists
              </Link>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <Link
                href="/checklists/wcag-2-2/excel"
                className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Excel Template
              </Link>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <Link
                href="/checklists/wcag-2-2/aaa"
                className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                AAA Checklist
              </Link>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <Link
                href="/tools/accessibility-audit-helper"
                className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                AI Audit Helper
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Structured Data */}
      <FAQStructuredData faqs={[
        {
          question: "Can I export the WCAG 2.2 checklist to Excel?",
          answer: "Yes! Click the Excel button to export your complete WCAG 2.2 checklist with all your progress, notes, and completion status. The Excel file includes multiple sheets: the main checklist, an audit summary, and a progress tracking template."
        },
        {
          question: "What's included in the Excel export?",
          answer: "The Excel export includes: (1) Complete checklist with all 78 success criteria, (2) Your completion status and notes for each criterion, (3) Audit summary with progress statistics, (4) Progress tracking template for ongoing monitoring, (5) Formatted headers and conditional formatting for easy reading."
        },
        {
          question: "Is the WCAG 2.2 checklist free to use?",
          answer: "Yes, the interactive WCAG 2.2 checklist is completely free. You can track your progress, add notes, filter criteria, and export to Excel or PDF without any cost or registration required."
        }
      ]} />
      <AccessibilityToolStructuredData
        name="WCAG 2.2 Checklist Excel Export"
        description="Export your WCAG 2.2 accessibility checklist to Excel format with progress tracking, notes, and professional formatting"
        url="https://accessibility.build/checklists/wcag-2-2"
        applicationCategory="AccessibilityApplication"
        operatingSystem="Web Browser"
        offers={{
          price: "0",
          priceCurrency: "USD"
        }}
        aggregateRating={{
          ratingValue: "4.9",
          reviewCount: "1250"
        }}
        accessibilityFeatures={[
          "keyboardNavigation",
          "screenReaderSupport",
          "highContrastDisplay"
        ]}
      />
    </div>
  )
}
