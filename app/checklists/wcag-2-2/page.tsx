import Link from "next/link"
import { createMetadata } from "@/lib/metadata"
import { getWCAGStats } from "@/lib/wcag-data"
import InteractiveWCAGChecklist from "@/components/checklists/interactive-wcag-checklist"
import { Shield, TrendingUp, CheckCircle, FileText, Sparkles, Award, FileSpreadsheet, Download, Zap, Clock, Users, Star } from "lucide-react"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-[#0a0f1a] dark:via-[#0d1321] dark:to-[#0a0f1a]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-emerald-600/5 via-transparent to-transparent"></div>
        
        <div className="relative container-wide py-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              {/* Icon */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl blur-2xl opacity-30 animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-emerald-600 p-5 rounded-2xl shadow-2xl shadow-blue-500/20">
                    <Shield className="w-14 h-14 text-white" />
                  </div>
                </div>
              </div>
              
              {/* Title */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
                <span className="bg-gradient-to-r from-slate-900 via-blue-800 to-slate-900 dark:from-white dark:via-blue-300 dark:to-white bg-clip-text text-transparent">
                  Interactive WCAG 2.2
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                  Checklist
                </span>
              </h1>
              
              {/* Description */}
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed">
                A comprehensive, interactive checklist of all{" "}
                <span className="font-bold text-blue-600 dark:text-blue-400">{stats.total}</span>{" "}
                WCAG 2.2 success criteria. Track your progress, add detailed notes, filter by levels and principles, 
                and export professional audit reports.
              </p>
              
              {/* Feature Badges */}
              <div className="flex flex-wrap justify-center gap-3 mb-12">
                <div className="flex items-center px-5 py-2.5 bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-full border border-emerald-200 dark:border-emerald-700/50 shadow-sm">
                  <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mr-2" />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Free & Open Source</span>
                </div>
                <div className="flex items-center px-5 py-2.5 bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-full border border-blue-200 dark:border-blue-700/50 shadow-sm">
                  <FileSpreadsheet className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Excel & PDF Export</span>
                </div>
                <div className="flex items-center px-5 py-2.5 bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-full border border-purple-200 dark:border-purple-700/50 shadow-sm">
                  <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400 mr-2" />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Real-time Progress</span>
                </div>
                <div className="flex items-center px-5 py-2.5 bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-full border border-amber-200 dark:border-amber-700/50 shadow-sm">
                  <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 mr-2" />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Auto-Save</span>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
              {/* Total Criteria */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-500 to-slate-700 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative bg-white dark:bg-slate-800/90 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 dark:border-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl shadow-lg">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex items-center text-slate-500 dark:text-slate-400">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-4xl font-bold text-slate-800 dark:text-white mb-1">{stats.total}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-300 font-medium">Total Criteria</div>
                  <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">Complete WCAG 2.2 coverage</div>
                </div>
              </div>

              {/* Level A */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative bg-white dark:bg-slate-800/90 backdrop-blur-sm p-6 rounded-2xl border border-emerald-200 dark:border-emerald-700/50 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-emerald-100/50 dark:shadow-slate-900/50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl shadow-lg">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-bold">
                      Essential
                    </span>
                  </div>
                  <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">{stats.byLevel.A}</div>
                  <div className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">Level A Criteria</div>
                  <div className="mt-2 text-xs text-emerald-600/80 dark:text-emerald-400/80">Minimum accessibility</div>
                </div>
              </div>

              {/* Level AA */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative bg-white dark:bg-slate-800/90 backdrop-blur-sm p-6 rounded-2xl border border-blue-200 dark:border-blue-700/50 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-blue-100/50 dark:shadow-slate-900/50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <span className="px-2.5 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-full text-xs font-bold">
                      Required
                    </span>
                  </div>
                  <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-1">{stats.byLevel.AA}</div>
                  <div className="text-sm text-blue-700 dark:text-blue-300 font-medium">Level AA Criteria</div>
                  <div className="mt-2 text-xs text-blue-600/80 dark:text-blue-400/80">Legal compliance standard</div>
                </div>
              </div>

              {/* Level AAA */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative bg-white dark:bg-slate-800/90 backdrop-blur-sm p-6 rounded-2xl border border-purple-200 dark:border-purple-700/50 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300 hover:-translate-y-1 shadow-lg shadow-purple-100/50 dark:shadow-slate-900/50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl shadow-lg">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                    <span className="px-2.5 py-1 bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-full text-xs font-bold">
                      Gold
                    </span>
                  </div>
                  <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-1">{stats.byLevel.AAA}</div>
                  <div className="text-sm text-purple-700 dark:text-purple-300 font-medium">Level AAA Criteria</div>
                  <div className="mt-2 text-xs text-purple-600/80 dark:text-purple-400/80">Enhanced accessibility</div>
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div className="relative mb-16">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-emerald-500/5 rounded-3xl"></div>
              <div className="relative bg-white/80 dark:bg-slate-800/60 backdrop-blur-xl p-10 rounded-3xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl">
                <div className="text-center mb-10">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
                      Professional Features
                    </span>
                  </h2>
                  <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto text-lg">
                    Everything you need for comprehensive accessibility auditing and compliance tracking
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Smart Tracking */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                      Smart Tracking
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/50">
                        <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0" />
                        <span className="text-slate-700 dark:text-slate-200">Check off completed criteria with progress tracking</span>
                      </div>
                      <div className="flex items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
                        <FileText className="w-5 h-5 text-slate-600 dark:text-slate-400 mr-3 flex-shrink-0" />
                        <span className="text-slate-700 dark:text-slate-200">Add detailed notes and findings for each criterion</span>
                      </div>
                      <div className="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800/50">
                        <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3 flex-shrink-0" />
                        <span className="text-slate-700 dark:text-slate-200">Search and filter by level, principle, or keyword</span>
                      </div>
                      <div className="flex items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
                        <Sparkles className="w-5 h-5 text-slate-600 dark:text-slate-400 mr-3 flex-shrink-0" />
                        <span className="text-slate-700 dark:text-slate-200">Real-time progress statistics and completion rates</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Professional Export */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg">
                        <Download className="w-5 h-5 text-white" />
                      </div>
                      Professional Export
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800/50">
                        <FileSpreadsheet className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mr-3 flex-shrink-0" />
                        <span className="text-slate-700 dark:text-slate-200">Export professional Excel reports with summary</span>
                      </div>
                      <div className="flex items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
                        <FileText className="w-5 h-5 text-slate-600 dark:text-slate-400 mr-3 flex-shrink-0" />
                        <span className="text-slate-700 dark:text-slate-200">Generate clean PDF audit documentation</span>
                      </div>
                      <div className="flex items-center p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800/50">
                        <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mr-3 flex-shrink-0" />
                        <span className="text-slate-700 dark:text-slate-200">Auto-save progress to browser local storage</span>
                      </div>
                      <div className="flex items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
                        <Users className="w-5 h-5 text-slate-600 dark:text-slate-400 mr-3 flex-shrink-0" />
                        <span className="text-slate-700 dark:text-slate-200">Bulk actions: check all, uncheck all, reset</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Checklist Section */}
      <div className="relative">
        <div className="container-wide py-8">
          <div className="max-w-7xl mx-auto">
            <InteractiveWCAGChecklist />
          </div>
        </div>
      </div>

      {/* Professional Guidelines Section */}
      <div className="relative py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-100/50 to-transparent dark:via-slate-900/50"></div>
        <div className="relative container-wide">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white dark:bg-slate-800/80 backdrop-blur-xl p-10 rounded-3xl border border-slate-200 dark:border-slate-700/50 shadow-xl">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
                <span className="bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  Professional Accessibility Auditing
                </span>
              </h2>
              
              <div className="grid md:grid-cols-2 gap-10">
                {/* Conformance Levels */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    Conformance Levels
                  </h3>
                  <div className="space-y-4">
                    <div className="p-5 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl border border-emerald-200 dark:border-emerald-700/50">
                      <div className="flex items-center mb-2">
                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-sm font-bold bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg mr-3">A</span>
                        <span className="font-bold text-emerald-800 dark:text-emerald-300 text-lg">Minimum Level</span>
                      </div>
                      <p className="text-emerald-700 dark:text-emerald-300/90 ml-[52px]">Essential for basic accessibility - foundation requirements</p>
                    </div>
                    
                    <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-700/50">
                      <div className="flex items-center mb-2">
                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-sm font-bold bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg mr-3">AA</span>
                        <span className="font-bold text-blue-800 dark:text-blue-300 text-lg">Standard Level</span>
                      </div>
                      <p className="text-blue-700 dark:text-blue-300/90 ml-[52px]">Required for legal compliance (ADA, Section 508, EN 301 549)</p>
                    </div>
                    
                    <div className="p-5 bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-xl border border-purple-200 dark:border-purple-700/50">
                      <div className="flex items-center mb-2">
                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-sm font-bold bg-gradient-to-br from-purple-500 to-violet-600 text-white shadow-lg mr-3">AAA</span>
                        <span className="font-bold text-purple-800 dark:text-purple-300 text-lg">Enhanced Level</span>
                      </div>
                      <p className="text-purple-700 dark:text-purple-300/90 ml-[52px]">Highest accessibility standards - gold standard implementation</p>
                    </div>
                  </div>
                </div>
                
                {/* Best Practices */}
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    Best Practices
                  </h3>
                  <div className="space-y-3">
                    {[
                      "Focus on Level AA criteria for legal compliance and industry standards",
                      "Document findings and remediation steps in notes for each criterion",
                      "Test with screen readers and assistive technologies regularly",
                      "Include real users with disabilities in your testing process",
                      "Export professional reports for stakeholder communication",
                      "Conduct regular audits to ensure ongoing compliance"
                    ].map((practice, index) => (
                      <div key={index} className="flex items-start p-4 bg-slate-50 dark:bg-slate-700/40 rounded-xl border border-slate-100 dark:border-slate-600/50 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors">
                        <div className={`w-2.5 h-2.5 ${index % 2 === 0 ? 'bg-blue-500' : 'bg-emerald-500'} rounded-full mt-1.5 mr-4 flex-shrink-0`}></div>
                        <span className="text-slate-700 dark:text-slate-200">{practice}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="relative py-20">
        <div className="container-wide">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-slate-800/80 backdrop-blur-xl p-10 rounded-3xl border border-slate-200 dark:border-slate-700/50 shadow-xl">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
                <span className="bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  Frequently Asked Questions
                </span>
              </h2>
              <div className="space-y-5">
                {[
                  {
                    question: "Can I export the WCAG 2.2 checklist to Excel?",
                    answer: "Yes! Click the \"Excel\" button above to export your complete WCAG 2.2 checklist with all your progress, notes, and completion status. The Excel file includes multiple sheets: the main checklist, an audit summary, and a progress tracking template."
                  },
                  {
                    question: "What's included in the Excel export?",
                    answer: "The Excel export includes: (1) Complete checklist with all 78 success criteria, (2) Your completion status and notes for each criterion, (3) Audit summary with progress statistics, (4) Progress tracking template for ongoing monitoring, (5) Formatted headers and conditional formatting for easy reading."
                  },
                  {
                    question: "Is the WCAG 2.2 checklist free to use?",
                    answer: "Yes, the interactive WCAG 2.2 checklist is completely free. You can track your progress, add notes, filter criteria, and export to Excel or PDF without any cost or registration required."
                  },
                  {
                    question: "How do I use the Excel checklist for compliance tracking?",
                    answer: "After exporting to Excel, you can: filter by level (A, AA, AAA) to focus on compliance requirements, sort by priority or status, add your own columns for remediation dates or assignees, use the progress tracking sheet to monitor improvements over time, and share with stakeholders for reporting."
                  },
                  {
                    question: "Does the checklist cover all WCAG 2.2 success criteria?",
                    answer: "Yes, our checklist includes all 78 WCAG 2.2 success criteria across Level A (30 criteria), Level AA (24 criteria), and Level AAA (24 criteria). Each criterion includes its description, guideline, and principle for easy reference."
                  }
                ].map((faq, index) => (
                  <div key={index} className="p-6 bg-slate-50 dark:bg-slate-700/40 rounded-xl border border-slate-100 dark:border-slate-600/50 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-3">
                      {faq.question}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="relative py-12 border-t border-slate-200 dark:border-slate-800">
        <div className="container-wide">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center flex-wrap">
              <Link 
                href="/checklists" 
                className="group inline-flex items-center gap-3 px-6 py-3.5 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:-translate-y-0.5 shadow-sm hover:shadow-md"
              >
                <div className="w-2 h-2 bg-blue-500 rounded-full group-hover:scale-150 transition-transform"></div>
                Back to all checklists
              </Link>
              <Link 
                href="/checklists/wcag-2-2/excel"
                className="group inline-flex items-center gap-3 px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold rounded-xl transition-all duration-300 hover:-translate-y-0.5 shadow-lg hover:shadow-xl shadow-emerald-500/25"
              >
                <FileSpreadsheet className="w-5 h-5" />
                Download Excel Template
              </Link>
              <Link 
                href="/checklists/wcag-2-2/aaa"
                className="group inline-flex items-center gap-3 px-6 py-3.5 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-semibold rounded-xl transition-all duration-300 hover:-translate-y-0.5 shadow-lg hover:shadow-xl shadow-purple-500/25"
              >
                <Award className="w-5 h-5" />
                View AAA Checklist
              </Link>
              <Link 
                href="/tools/accessibility-audit-helper" 
                className="group inline-flex items-center gap-3 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-300 hover:-translate-y-0.5 shadow-lg hover:shadow-xl shadow-blue-500/25"
              >
                Use AI Audit Helper
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
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
