import Link from "next/link"
import { createMetadata } from "@/lib/metadata"
import { getWCAGStats } from "@/lib/wcag-data"
import InteractiveWCAGChecklist from "@/components/checklists/interactive-wcag-checklist"
import { Shield, TrendingUp, CheckCircle, FileText, Sparkles, Award } from "lucide-react"

export const metadata = createMetadata({
  title: "Interactive WCAG 2.2 Checklist - All 78 Success Criteria",
  description:
    "Interactive WCAG 2.2 checklist with all 78 success criteria. Track progress, add notes, filter criteria, and export to Excel/PDF for professional accessibility audits.",
  keywords: ["WCAG 2.2", "accessibility checklist", "success criteria", "compliance", "audit", "interactive", "export"]
})

export default function WcagChecklistPage() {
  const stats = getWCAGStats()
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-slate-600/5 to-blue-600/10"></div>
        <div className="relative container-wide py-16">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full blur-lg opacity-25 animate-pulse"></div>
                  <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 p-4 rounded-full">
                    <Shield className="w-12 h-12 text-white" />
                  </div>
                </div>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-slate-900 via-blue-600 to-slate-900 bg-clip-text text-transparent mb-6">
                Interactive WCAG 2.2 Checklist
              </h1>
              
              <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-4xl mx-auto leading-relaxed">
                A comprehensive, interactive checklist of all <span className="font-bold text-blue-600">{stats.total}</span> WCAG 2.2 success criteria. 
                Track your progress, add detailed notes, filter by levels and principles, and export 
                professional audit reports in Excel or PDF format.
              </p>
              
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                <div className="flex items-center px-4 py-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full border border-blue-200 dark:border-blue-700">
                  <CheckCircle className="w-4 h-4 text-blue-600 mr-2" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Free & Open Source</span>
                </div>
                <div className="flex items-center px-4 py-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full border border-slate-200 dark:border-slate-700">
                  <FileText className="w-4 h-4 text-slate-600 mr-2" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Professional Exports</span>
                </div>
                <div className="flex items-center px-4 py-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full border border-blue-200 dark:border-blue-700">
                  <Sparkles className="w-4 h-4 text-blue-600 mr-2" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Real-time Progress</span>
                </div>
              </div>
            </div>

            {/* Enhanced Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-slate-600 to-slate-700 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 dark:border-slate-700 hover:scale-105 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-to-r from-slate-600 to-slate-700 rounded-xl">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <TrendingUp className="w-5 h-5 text-slate-400" />
                  </div>
                  <div className="text-3xl font-bold text-slate-700 dark:text-slate-300 mb-1">{stats.total}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total Criteria</div>
                  <div className="mt-2 text-xs text-slate-400">Complete WCAG 2.2 coverage</div>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm p-6 rounded-2xl border border-blue-200 dark:border-blue-700 hover:scale-105 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                      Basic
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">{stats.byLevel.A}</div>
                  <div className="text-sm text-blue-700 dark:text-blue-300 font-medium">Level A Criteria</div>
                  <div className="mt-2 text-xs text-blue-500">Minimum accessibility</div>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm p-6 rounded-2xl border border-blue-200 dark:border-blue-700 hover:scale-105 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full text-xs font-medium">
                      Legal
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-slate-700 dark:text-slate-300 mb-1">{stats.byLevel.AA}</div>
                  <div className="text-sm text-slate-700 dark:text-slate-300 font-medium">Level AA Criteria</div>
                  <div className="mt-2 text-xs text-slate-500">Required for compliance</div>
                </div>
              </div>

              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm p-6 rounded-2xl border border-blue-200 dark:border-blue-700 hover:scale-105 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
                      Enhanced
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">{stats.byLevel.AAA}</div>
                  <div className="text-sm text-blue-700 dark:text-blue-300 font-medium">Level AAA Criteria</div>
                  <div className="mt-2 text-xs text-blue-500">Gold standard</div>
                </div>
              </div>
            </div>

            {/* Enhanced Features Showcase */}
            <div className="relative mb-12">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-slate-600/5 to-blue-600/5 rounded-3xl"></div>
              <div className="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-8 rounded-3xl border border-white/20 dark:border-slate-700/20">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-slate-800 bg-clip-text text-transparent mb-4">
                    ✨ Professional Features
                  </h2>
                  <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                    Everything you need for comprehensive accessibility auditing and compliance tracking
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">🎯 Smart Tracking</h3>
                    <div className="space-y-3">
                      <div className="flex items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                        <CheckCircle className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />
                        <span className="text-blue-700 dark:text-blue-300 text-sm">Check off completed criteria with progress tracking</span>
                      </div>
                      <div className="flex items-center p-3 bg-slate-50 dark:bg-slate-800/20 rounded-xl">
                        <FileText className="w-5 h-5 text-slate-600 mr-3 flex-shrink-0" />
                        <span className="text-slate-700 dark:text-slate-300 text-sm">Add detailed notes and findings for each criterion</span>
                      </div>
                      <div className="flex items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                        <Shield className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />
                        <span className="text-blue-700 dark:text-blue-300 text-sm">Search and filter by level, principle, or keyword</span>
                      </div>
                      <div className="flex items-center p-3 bg-slate-50 dark:bg-slate-800/20 rounded-xl">
                        <TrendingUp className="w-5 h-5 text-slate-600 mr-3 flex-shrink-0" />
                        <span className="text-slate-700 dark:text-slate-300 text-sm">Real-time progress statistics and completion rates</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-4">📊 Professional Export</h3>
                    <div className="space-y-3">
                      <div className="flex items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                        <FileText className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />
                        <span className="text-blue-700 dark:text-blue-300 text-sm">Export professional Excel reports with summary</span>
                      </div>
                      <div className="flex items-center p-3 bg-slate-50 dark:bg-slate-800/20 rounded-xl">
                        <Shield className="w-5 h-5 text-slate-600 mr-3 flex-shrink-0" />
                        <span className="text-slate-700 dark:text-slate-300 text-sm">Generate clean PDF audit documentation</span>
                      </div>
                      <div className="flex items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                        <Award className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />
                        <span className="text-blue-700 dark:text-blue-300 text-sm">Auto-save progress to browser local storage</span>
                      </div>
                      <div className="flex items-center p-3 bg-slate-50 dark:bg-slate-800/20 rounded-xl">
                        <Sparkles className="w-5 h-5 text-slate-600 mr-3 flex-shrink-0" />
                        <span className="text-slate-700 dark:text-slate-300 text-sm">Bulk actions: check all, uncheck all, reset</span>
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
      <div className="relative py-16">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/5 via-slate-800/5 to-slate-900/5"></div>
        <div className="relative container-wide">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm p-8 rounded-3xl border border-white/20 dark:border-slate-700/20">
              <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-slate-800 to-slate-900 dark:from-slate-200 dark:to-slate-100 bg-clip-text text-transparent">
                Professional Accessibility Auditing
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 flex items-center">
                    <Shield className="w-6 h-6 text-blue-600 mr-3" />
                    Conformance Levels
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/30 rounded-xl border border-blue-200 dark:border-blue-700">
                      <div className="flex items-center mb-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-blue-600 text-white mr-3">A</span>
                        <span className="font-semibold text-blue-800 dark:text-blue-300">Minimum Level</span>
                      </div>
                      <p className="text-blue-700 dark:text-blue-300 text-sm">Essential for basic accessibility - foundation requirements</p>
                    </div>
                    
                    <div className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/20 dark:to-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center mb-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-slate-600 text-white mr-3">AA</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-300">Standard Level</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 text-sm">Required for legal compliance (ADA, Section 508, EN 301 549)</p>
                    </div>
                    
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/30 rounded-xl border border-blue-200 dark:border-blue-700">
                      <div className="flex items-center mb-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-blue-600 text-white mr-3">AAA</span>
                        <span className="font-semibold text-blue-800 dark:text-blue-300">Enhanced Level</span>
                      </div>
                      <p className="text-blue-700 dark:text-blue-300 text-sm">Highest accessibility standards - gold standard implementation</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 flex items-center">
                    <Award className="w-6 h-6 text-slate-600 mr-3" />
                    Best Practices
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-slate-700 dark:text-slate-300 text-sm">Focus on Level AA criteria for legal compliance and industry standards</span>
                    </div>
                    <div className="flex items-start p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-slate-700 dark:text-slate-300 text-sm">Document findings and remediation steps in notes for each criterion</span>
                    </div>
                    <div className="flex items-start p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                      <div className="w-2 h-2 bg-slate-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-slate-700 dark:text-slate-300 text-sm">Test with screen readers and assistive technologies regularly</span>
                    </div>
                    <div className="flex items-start p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-slate-700 dark:text-slate-300 text-sm">Include real users with disabilities in your testing process</span>
                    </div>
                    <div className="flex items-start p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                      <div className="w-2 h-2 bg-slate-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-slate-700 dark:text-slate-300 text-sm">Export professional reports for stakeholder communication</span>
                    </div>
                    <div className="flex items-start p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-slate-700 dark:text-slate-300 text-sm">Conduct regular audits to ensure ongoing compliance</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="relative py-8">
        <div className="container-wide">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link 
                href="/checklists" 
                className="group inline-flex items-center gap-3 px-6 py-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:scale-105"
              >
                <div className="w-2 h-2 bg-blue-500 rounded-full group-hover:scale-150 transition-transform"></div>
                Back to all checklists
              </Link>
              <Link 
                href="/tools/accessibility-audit-helper" 
                className="group inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-slate-800 text-white rounded-xl hover:from-blue-700 hover:to-slate-900 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Use AI Audit Helper
                <div className="w-2 h-2 bg-white rounded-full group-hover:scale-150 transition-transform"></div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
