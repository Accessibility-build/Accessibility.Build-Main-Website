import type { Metadata } from "next"
import Link from "next/link"
import { getWCAGStats } from "@/lib/wcag-data"
import InteractiveWCAGChecklist from "@/components/checklists/interactive-wcag-checklist"
import { Shield, Sparkles, Award, ArrowLeft } from "lucide-react"
import { BreadcrumbStructuredData, AccessibilityToolStructuredData } from "@/components/seo/structured-data"
import { FaqSection } from "@/components/seo/faq-section"

export const metadata: Metadata = {
  title: "WCAG AAA Checklist | Level AAA Success Criteria | WCAG 2.2 Gold Standard",
  description:
    "Complete WCAG 2.2 Level AAA checklist with all 31 enhanced accessibility criteria. Track progress, add notes, and export to Excel/PDF. The gold standard for web accessibility.",
  keywords: [
    "wcag aaa checklist",
    "WCAG AAA",
    "WCAG 2.2 AAA",
    "Level AAA checklist",
    "enhanced accessibility",
    "WCAG AAA criteria",
    "accessibility checklist AAA",
    "wcag level aaa requirements",
    "wcag triple a",
    "highest accessibility standard"
  ],
  openGraph: {
    title: "WCAG AAA Checklist - Level AAA Success Criteria | Gold Standard",
    description: "Complete WCAG 2.2 Level AAA checklist with all 31 enhanced accessibility criteria. The gold standard for web accessibility.",
    type: "website",
    url: "https://accessibility.build/checklists/wcag-2-2/aaa",
    images: [
      {
        url: "https://accessibility.build/images/checklists/wcag-aaa-og.png",
        width: 1200,
        height: 630,
        alt: "WCAG 2.2 Level AAA Checklist - Gold Standard"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "WCAG AAA Checklist - Level AAA Gold Standard",
    description: "Complete WCAG 2.2 Level AAA checklist with all 31 enhanced accessibility criteria.",
    images: ["https://accessibility.build/images/checklists/wcag-aaa-og.png"]
  },
  alternates: {
    canonical: "https://accessibility.build/checklists/wcag-2-2/aaa"
  },
  robots: {
    index: true,
    follow: true
  }
}

export default function WCAGAAAChecklistPage() {
  const stats = getWCAGStats()
  const aa = stats.byLevel.A + stats.byLevel.AA

  // Rendered on the page AND emitted as FAQPage schema by <FaqSection>, from this
  // one array. Counts are derived from the criteria data rather than hardcoded,
  // so they cannot drift out of step with the checklist itself.
  const faqs = [
    {
      question: "What is WCAG Level AAA?",
      answer: `WCAG Level AAA is the highest level of accessibility conformance in the Web Content Accessibility Guidelines. It includes all Level A and AA criteria plus ${stats.byLevel.AAA} additional enhanced criteria that provide the highest level of accessibility for users with disabilities.`,
    },
    {
      question: "Is WCAG AAA compliance required?",
      answer:
        "WCAG AAA is not typically required for entire websites, and the guidelines themselves note that it is not possible to satisfy all AAA criteria for some content. It is worth targeting for specialized content such as educational materials, healthcare information, and government services where maximum accessibility matters, and most laws and procurement rules reference Level AA as the bar instead.",
    },
    {
      question: "What are the main differences between Level AA and AAA?",
      answer:
        "Level AAA adds stricter requirements, including a 7:1 contrast ratio for normal text rather than 4.5:1, sign language interpretation for prerecorded audio, extended audio descriptions, no timing limits on interactions, reading level and pronunciation requirements, and context-sensitive help. Several of these depend on producing extra media or editorial work rather than on code changes, which is why AAA is usually scoped to specific content instead of an entire site.",
    },
    {
      question: "How many success criteria are in WCAG 2.2 Level AAA?",
      answer: `WCAG 2.2 Level AAA includes ${stats.byLevel.AAA} success criteria beyond the ${aa} criteria in Levels A and AA, bringing the total to ${stats.total} success criteria across all three levels (Level A has ${stats.byLevel.A} and Level AA has ${stats.byLevel.AA}).`,
    },
  ]

  return (
    <>
      <BreadcrumbStructuredData breadcrumbs={[
        { name: "Home", url: "https://accessibility.build" },
        { name: "Checklists", url: "https://accessibility.build/checklists" },
        { name: "WCAG 2.2 Checklist", url: "https://accessibility.build/checklists/wcag-2-2" },
        { name: "WCAG AAA Checklist", url: "https://accessibility.build/checklists/wcag-2-2/aaa" }
      ]} />
      <AccessibilityToolStructuredData
        name="WCAG 2.2 Level AAA Checklist"
        description="Complete WCAG 2.2 Level AAA checklist with all enhanced accessibility criteria. Track progress and export to Excel or PDF."
        url="https://accessibility.build/checklists/wcag-2-2/aaa"
        applicationCategory="AccessibilityApplication"
        operatingSystem="Web Browser"
        offers={{
          price: "0",
          priceCurrency: "USD"
        }}
        accessibilityFeatures={[
          "keyboardNavigation",
          "screenReaderSupport",
          "highContrastDisplay"
        ]}
      />

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-slate-600/5 to-purple-600/10"></div>
          <div className="relative container-wide py-16">
            <div className="max-w-7xl mx-auto">
              <div className="mb-8">
                <Link 
                  href="/checklists/wcag-2-2"
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 mb-6"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Full Checklist
                </Link>
              </div>

              <div className="text-center mb-12">
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-purple-800 rounded-full blur-lg opacity-25 animate-pulse"></div>
                    <div className="relative bg-gradient-to-r from-purple-600 to-purple-800 p-4 rounded-full">
                      <Award className="w-12 h-12 text-white" />
                    </div>
                  </div>
                </div>
                
                <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-slate-900 via-purple-600 to-slate-900 bg-clip-text text-transparent mb-6">
                  WCAG 2.2 Level AAA Checklist
                </h1>
                
                <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-4xl mx-auto leading-relaxed">
                  The highest level of accessibility conformance. Level AAA represents the gold standard 
                  for web accessibility with <span className="font-bold text-purple-600">{stats.byLevel.AAA}</span> enhanced success criteria.
                </p>
                
                <div className="flex flex-wrap justify-center gap-3 mb-8">
                  <div className="flex items-center px-4 py-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full border border-purple-200 dark:border-purple-700">
                    <Award className="w-4 h-4 text-purple-600 mr-2" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Gold Standard</span>
                  </div>
                  <div className="flex items-center px-4 py-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full border border-slate-200 dark:border-slate-700">
                    <Sparkles className="w-4 h-4 text-slate-600 mr-2" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Enhanced Accessibility</span>
                  </div>
                  <div className="flex items-center px-4 py-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full border border-purple-200 dark:border-purple-700">
                    <Shield className="w-4 h-4 text-purple-600 mr-2" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{stats.byLevel.AAA} Criteria</span>
                  </div>
                </div>
              </div>

              {/* Stats Card */}
              <div className="max-w-md mx-auto mb-12">
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/30 p-6 rounded-2xl border border-purple-200 dark:border-purple-700 text-center">
                  <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">{stats.byLevel.AAA}</div>
                  <div className="text-lg text-purple-700 dark:text-purple-300 font-medium">Level AAA Criteria</div>
                  <div className="text-sm text-purple-600 dark:text-purple-400 mt-2">Enhanced accessibility standards</div>
                </div>
              </div>

              {/* Info Card */}
              <div className="max-w-3xl mx-auto mb-12">
                <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm p-6 rounded-xl border border-purple-200 dark:border-purple-700">
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center">
                    <Sparkles className="w-5 h-5 text-purple-600 mr-2" />
                    About Level AAA
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-4">
                    Level AAA is the highest level of WCAG conformance. While not required for entire websites, 
                    achieving AAA for specific content demonstrates exceptional commitment to accessibility.
                  </p>
                  <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      <span>Recommended for specialized content (educational, healthcare, government)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      <span>Often required for specific use cases or high-traffic pages</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      <span>Demonstrates commitment to the highest accessibility standards</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Checklist Section - Pre-filtered to AAA */}
        <div className="relative">
          <div className="container-wide py-8">
            <div className="max-w-7xl mx-auto">
              <InteractiveWCAGChecklist initialLevelFilter="AAA" />
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="container-wide pb-16">
          <div className="max-w-3xl mx-auto">
            <FaqSection faqs={faqs} title="WCAG Level AAA FAQ" />
          </div>
        </div>
      </div>
    </>
  )
}

