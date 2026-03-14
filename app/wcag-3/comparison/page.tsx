import Link from "next/link"
import { createMetadata } from "@/lib/metadata"
import { BreadcrumbStructuredData, ArticleStructuredData, FAQStructuredData } from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  GitCompareArrows,
  ShieldCheck,
  Brain,
  GraduationCap,
  Scale,
  Sparkles,
  Globe,
  BarChart3,
  RefreshCw,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Layers,
  Lightbulb,
  Compass,
} from "lucide-react"

export const metadata = createMetadata({
  title: "WCAG 3.0 vs WCAG 2.2: Key Differences, Conformance Changes & What Stays",
  description:
    "Side-by-side comparison of WCAG 3.0 and WCAG 2.2. Understand the key differences in conformance models, scope, testing approaches, and what stays the same between the two accessibility standards.",
  keywords: [
    "wcag 3 vs wcag 2",
    "wcag 3.0 comparison",
    "wcag 2.2 vs 3.0 differences",
    "wcag 3.0 conformance model",
    "WCAG 3.0 changes",
    "WCAG comparison",
    "accessibility standards comparison",
    "wcag 3.0 vs wcag 2.2",
  ],
})

const faqs = [
  {
    question: "Will my WCAG 2.2 compliant site need to be re-audited for WCAG 3.0?",
    answer:
      "Content meeting WCAG 2.2 Level A and AA is expected to satisfy most of WCAG 3.0's minimum conformance level. However, WCAG 3.0 introduces new areas of coverage — such as cognitive accessibility and broader platform scope — so some additional work will likely be needed. A full re-audit is not expected, but a gap analysis against WCAG 3.0's new requirements is recommended once the standard is finalized.",
  },
  {
    question: "Can I use WCAG 3.0 for legal compliance today?",
    answer:
      "No. WCAG 3.0 is currently a Working Draft and is not referenced by any law or regulation. For legal compliance, use WCAG 2.2 Level AA, which is referenced by the ADA, Section 508, EN 301 549, and the European Accessibility Act. It will take years after WCAG 3.0 is finalized for regulatory bodies to update their legal references.",
  },
  {
    question: "Is WCAG 3.0 harder to meet than WCAG 2.2?",
    answer:
      "WCAG 3.0 is different rather than harder. The graduated scoring model provides more nuance than the binary pass/fail of WCAG 2.x, meaning partial accessibility efforts receive credit rather than outright failure. Content that already conforms to WCAG 2.2 Level A and AA is expected to meet most of WCAG 3.0's minimum conformance level, so strong WCAG 2.2 compliance is the best preparation.",
  },
]

const comparisonRows = [
  {
    dimension: "Full Name",
    wcag22: "Web Content Accessibility Guidelines (WCAG) 2.2",
    wcag30: "W3C Accessibility Guidelines (WCAG) 3.0",
  },
  {
    dimension: "Status",
    wcag22: "W3C Recommendation (Stable)",
    wcag30: "Working Draft (In Progress)",
  },
  {
    dimension: "Scope",
    wcag22: "Web content",
    wcag30: "Web, apps, tools, agents, IoT, VR/AR",
  },
  {
    dimension: "Structure",
    wcag22: "4 principles, 13 guidelines, 78 success criteria",
    wcag30: "12 categories, guidelines, requirements, methods",
  },
  {
    dimension: "Conformance",
    wcag22: "A / AA / AAA levels",
    wcag30: "Outcomes-based graduated scoring",
  },
  {
    dimension: "Testing",
    wcag22: "Binary pass/fail per criterion",
    wcag30: "Outcomes-based with multiple methods",
  },
  {
    dimension: "Updates",
    wcag22: "Static versioned releases",
    wcag30: "Regular incremental updates",
  },
  {
    dimension: "Legal Status",
    wcag22: "Referenced in ADA, Section 508, EN 301 549, EAA",
    wcag30: "Not yet referenced in law",
  },
]

const staysSame = [
  {
    title: "WCAG 2.x Not Deprecated",
    description:
      "WCAG 2.2 remains a valid, stable W3C Recommendation. It continues to be the required standard for legal compliance worldwide and will not be deprecated when WCAG 3.0 is released.",
    icon: ShieldCheck,
  },
  {
    title: "Core Principles Transfer",
    description:
      "The fundamental accessibility concepts — making content perceivable, operable, understandable, and robust — still apply. WCAG 3.0 reorganizes them into 12 categories but the underlying principles carry forward.",
    icon: Brain,
  },
  {
    title: "Existing Knowledge Valuable",
    description:
      "Teams with strong WCAG 2.x expertise will find their knowledge directly applicable. Most WCAG 2.2 requirements map to WCAG 3.0 equivalents, and accessible development practices remain the same.",
    icon: GraduationCap,
  },
  {
    title: "Legal Continuity",
    description:
      "Laws and regulations — including the ADA, Section 508, EN 301 549, and the European Accessibility Act — continue referencing WCAG 2.x. This will not change until years after WCAG 3.0 is finalized.",
    icon: Scale,
  },
]

const whatChanges = [
  {
    title: "New Terminology",
    description:
      "WCAG 3.0 introduces new vocabulary: outcomes replace success criteria, methods replace techniques, and assertions represent organizational commitments. The entire framework uses updated language.",
    icon: Sparkles,
  },
  {
    title: "Broader Scope",
    description:
      "The standard expands beyond web content to cover native applications, authoring tools, user agents, IoT devices, virtual reality, and augmented reality — reflected in the renamed title.",
    icon: Globe,
  },
  {
    title: "Nuanced Conformance",
    description:
      "The A/AA/AAA level system is replaced by graduated scoring. Partial accessibility efforts receive credit, and conformance is measured on a spectrum rather than as a binary pass/fail.",
    icon: BarChart3,
  },
  {
    title: "Regular Updates",
    description:
      "WCAG 3.0 is designed as a living standard with regular incremental updates, replacing the static versioned release model that required years between WCAG 2.0, 2.1, and 2.2.",
    icon: RefreshCw,
  },
]

const crossLinks = [
  {
    title: "WCAG 3.0 Overview",
    description: "Complete guide to everything about W3C Accessibility Guidelines 3.0.",
    href: "/wcag-3",
    icon: BookOpen,
    gradient: "from-teal-600 to-emerald-600",
  },
  {
    title: "WCAG 2.2 Checklist",
    description: "Interactive checklist for current WCAG 2.2 compliance requirements.",
    href: "/checklists/wcag-2-2",
    icon: CheckCircle2,
    gradient: "from-blue-600 to-indigo-600",
  },
  {
    title: "12 Guideline Categories",
    description: "Deep dive into WCAG 3.0's new category structure replacing POUR principles.",
    href: "/wcag-3/guidelines",
    icon: Layers,
    gradient: "from-purple-600 to-violet-600",
  },
  {
    title: "Key Concepts & Terminology",
    description: "Reference guide to outcomes, methods, assertions, and functional needs.",
    href: "/wcag-3/concepts",
    icon: Lightbulb,
    gradient: "from-amber-600 to-orange-600",
  },
  {
    title: "How to Prepare",
    description: "Actionable steps to prepare your team for WCAG 3.0 today.",
    href: "/wcag-3/preparation",
    icon: Compass,
    gradient: "from-rose-600 to-pink-600",
  },
]

function ConformanceModelSVG() {
  return (
    <svg
      viewBox="0 0 800 280"
      className="w-full max-w-4xl mx-auto"
      role="img"
      aria-label="Side-by-side comparison of conformance models. WCAG 2.2 uses three stacked levels (A, AA, AAA) with binary pass or fail. WCAG 3.0 uses a graduated scoring bar from minimum to excellent, measuring outcomes on a spectrum."
    >
      {/* WCAG 2.2 Side */}
      <text x="160" y="30" textAnchor="middle" className="fill-blue-700 dark:fill-blue-400 text-sm font-bold">
        WCAG 2.2 Conformance
      </text>

      {/* Level AAA */}
      <rect x="60" y="50" width="200" height="50" rx="8" className="fill-blue-100 dark:fill-blue-900/40 stroke-blue-300 dark:stroke-blue-700" strokeWidth="2" />
      <text x="160" y="80" textAnchor="middle" className="fill-blue-800 dark:fill-blue-300 text-xs font-semibold">
        Level AAA
      </text>

      {/* Level AA */}
      <rect x="60" y="108" width="200" height="50" rx="8" className="fill-blue-200 dark:fill-blue-800/50 stroke-blue-400 dark:stroke-blue-600" strokeWidth="2" />
      <text x="160" y="138" textAnchor="middle" className="fill-blue-800 dark:fill-blue-300 text-xs font-semibold">
        Level AA
      </text>

      {/* Level A */}
      <rect x="60" y="166" width="200" height="50" rx="8" className="fill-blue-300 dark:fill-blue-700/50 stroke-blue-500 dark:stroke-blue-500" strokeWidth="2" />
      <text x="160" y="196" textAnchor="middle" className="fill-blue-900 dark:fill-blue-200 text-xs font-semibold">
        Level A
      </text>

      {/* Pass/Fail indicators */}
      <text x="160" y="240" textAnchor="middle" className="fill-slate-500 dark:fill-slate-400 text-[10px]">
        Binary: Pass or Fail
      </text>

      {/* Checkmark */}
      <circle cx="120" cy="255" r="10" className="fill-emerald-100 dark:fill-emerald-900/50 stroke-emerald-500 dark:stroke-emerald-600" strokeWidth="1.5" />
      <path d="M115 255 L118 258 L125 251" className="stroke-emerald-600 dark:stroke-emerald-400" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />

      {/* X mark */}
      <circle cx="200" cy="255" r="10" className="fill-red-100 dark:fill-red-900/50 stroke-red-400 dark:stroke-red-600" strokeWidth="1.5" />
      <path d="M196 251 L204 259 M204 251 L196 259" className="stroke-red-500 dark:stroke-red-400" strokeWidth="2" strokeLinecap="round" />

      {/* Divider */}
      <line x1="400" y1="40" x2="400" y2="270" className="stroke-slate-300 dark:stroke-slate-600" strokeWidth="1" strokeDasharray="6 4" />
      <text x="400" y="30" textAnchor="middle" className="fill-slate-400 dark:fill-slate-500 text-[10px] font-medium">
        VS
      </text>

      {/* WCAG 3.0 Side */}
      <text x="620" y="30" textAnchor="middle" className="fill-teal-700 dark:fill-teal-400 text-sm font-bold">
        WCAG 3.0 Conformance
      </text>

      {/* Graduated scoring bar background */}
      <rect x="470" y="100" width="300" height="60" rx="10" className="fill-slate-100 dark:fill-slate-800/60 stroke-slate-300 dark:stroke-slate-600" strokeWidth="1" />

      {/* Gradient bar */}
      <defs>
        <linearGradient id="scoringGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#99f6e4" />
          <stop offset="33%" stopColor="#5eead4" />
          <stop offset="66%" stopColor="#14b8a6" />
          <stop offset="100%" stopColor="#0f766e" />
        </linearGradient>
        <linearGradient id="scoringGradientDark" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#134e4a" />
          <stop offset="33%" stopColor="#115e59" />
          <stop offset="66%" stopColor="#0d9488" />
          <stop offset="100%" stopColor="#14b8a6" />
        </linearGradient>
      </defs>

      {/* Light mode gradient bar */}
      <rect x="480" y="110" width="280" height="40" rx="6" fill="url(#scoringGradient)" className="dark:hidden" />
      {/* Dark mode gradient bar */}
      <rect x="480" y="110" width="280" height="40" rx="6" fill="url(#scoringGradientDark)" className="hidden dark:block" />

      {/* Scale labels on the bar */}
      <text x="500" y="135" textAnchor="middle" className="fill-teal-900 dark:fill-teal-200 text-[9px] font-medium">
        Minimum
      </text>
      <text x="620" y="135" textAnchor="middle" className="fill-teal-900 dark:fill-teal-100 text-[9px] font-medium">
        Acceptable
      </text>
      <text x="740" y="135" textAnchor="middle" className="fill-white dark:fill-teal-100 text-[9px] font-medium">
        Excellent
      </text>

      {/* Arrow showing graduated scoring */}
      <line x1="490" y1="85" x2="750" y2="85" className="stroke-teal-500 dark:stroke-teal-400" strokeWidth="2" markerEnd="url(#tealArrow)" />
      <text x="620" y="78" textAnchor="middle" className="fill-teal-600 dark:fill-teal-400 text-[10px] font-medium">
        Graduated Scoring
      </text>

      {/* Label below */}
      <text x="620" y="195" textAnchor="middle" className="fill-slate-500 dark:fill-slate-400 text-[10px]">
        Outcomes-Based Assessment
      </text>
      <text x="620" y="210" textAnchor="middle" className="fill-slate-400 dark:fill-slate-500 text-[9px]">
        Partial credit for partial compliance
      </text>

      {/* Arrowhead marker */}
      <defs>
        <marker id="tealArrow" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" className="fill-teal-500 dark:fill-teal-400" />
        </marker>
      </defs>
    </svg>
  )
}

export default function WCAG3ComparisonPage() {
  return (
    <div className="min-h-screen pt-24">
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "WCAG 3.0 Guide", url: "https://accessibility.build/wcag-3" },
          { name: "WCAG 3.0 vs WCAG 2.2", url: "https://accessibility.build/wcag-3/comparison" },
        ]}
      />
      <ArticleStructuredData
        headline="WCAG 3.0 vs WCAG 2.2: Key Differences, Conformance Changes & What Stays"
        description="Side-by-side comparison of WCAG 3.0 and WCAG 2.2. Understand key differences in conformance, scope, testing, and what stays the same."
        author={{ name: "Accessibility.build", url: "https://accessibility.build" }}
        publisher={{ name: "Accessibility.build", logo: "https://accessibility.build/logo.png" }}
        datePublished="2026-03-15T00:00:00Z"
        dateModified="2026-03-15T00:00:00Z"
        image="https://accessibility.build/og-image.png"
        url="https://accessibility.build/wcag-3/comparison"
        wordCount={3500}
        keywords={["wcag 3 vs wcag 2", "wcag 3.0 comparison", "wcag 2.2 vs 3.0 differences", "wcag 3.0 conformance model"]}
      />
      <FAQStructuredData faqs={faqs} />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-teal-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-teal-950/30 border-b border-slate-200 dark:border-slate-800">
        <div className="container-wide pb-16 md:pb-24">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/30 dark:text-teal-400 dark:border-teal-700">
              Comparison Guide
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-teal-800 to-blue-800 dark:from-white dark:via-teal-200 dark:to-blue-300 bg-clip-text text-transparent leading-tight">
              WCAG 3.0 vs WCAG 2.2: What Changes and What Stays
            </h1>

            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-3xl mx-auto leading-relaxed">
              A detailed side-by-side comparison of the current stable standard and the next generation of accessibility guidelines.
              Understand the key differences in conformance, scope, structure, and testing — and what remains the same.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 text-sm">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                  <ShieldCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="font-medium text-slate-700 dark:text-slate-300">WCAG 2.2 Stable</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-teal-100 dark:bg-teal-900/50 rounded-full">
                  <Sparkles className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                </div>
                <span className="font-medium text-slate-700 dark:text-slate-300">WCAG 3.0 Draft</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-full">
                  <GitCompareArrows className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="font-medium text-slate-700 dark:text-slate-300">8 Dimensions Compared</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="container-wide py-16 md:py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 text-center">
            Side-by-Side Comparison
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-center mb-10 max-w-2xl mx-auto">
            How the two standards differ across eight key dimensions.
          </p>

          <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
            {/* Table Header */}
            <div className="grid grid-cols-3 bg-slate-100 dark:bg-slate-800/80">
              <div className="p-4 md:p-5 font-semibold text-slate-700 dark:text-slate-300 text-sm md:text-base border-r border-slate-200 dark:border-slate-700">
                Dimension
              </div>
              <div className="p-4 md:p-5 font-semibold text-blue-700 dark:text-blue-400 text-sm md:text-base border-r border-slate-200 dark:border-slate-700 bg-blue-50/50 dark:bg-blue-950/20">
                WCAG 2.2
              </div>
              <div className="p-4 md:p-5 font-semibold text-teal-700 dark:text-teal-400 text-sm md:text-base bg-teal-50/50 dark:bg-teal-950/20">
                WCAG 3.0
              </div>
            </div>

            {/* Table Rows */}
            {comparisonRows.map((row, index) => (
              <div
                key={row.dimension}
                className={`grid grid-cols-3 ${
                  index % 2 === 0
                    ? "bg-white dark:bg-slate-900/40"
                    : "bg-slate-50/80 dark:bg-slate-800/30"
                } ${index < comparisonRows.length - 1 ? "border-b border-slate-200 dark:border-slate-700" : ""}`}
              >
                <div className="p-4 md:p-5 font-medium text-slate-800 dark:text-slate-200 text-sm border-r border-slate-200 dark:border-slate-700">
                  {row.dimension}
                </div>
                <div className="p-4 md:p-5 text-sm text-blue-800 dark:text-blue-300 border-r border-slate-200 dark:border-slate-700 bg-blue-50/30 dark:bg-blue-950/10 leading-relaxed">
                  {row.wcag22}
                </div>
                <div className="p-4 md:p-5 text-sm text-teal-800 dark:text-teal-300 bg-teal-50/30 dark:bg-teal-950/10 leading-relaxed">
                  {row.wcag30}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Conformance Model Diagram */}
      <section className="bg-slate-50 dark:bg-slate-900/30 border-y border-slate-200 dark:border-slate-800">
        <div className="container-wide py-16 md:py-20">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 text-center">
              Conformance Models Compared
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-center mb-10 max-w-2xl mx-auto">
              The biggest structural change: from tiered pass/fail levels to graduated outcomes-based scoring.
            </p>

            <div className="bg-white dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 p-6 md:p-10">
              <ConformanceModelSVG />
            </div>
          </div>
        </div>
      </section>

      {/* What Stays the Same */}
      <section className="container-wide py-16 md:py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 text-center">
            What Stays the Same
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-center mb-10 max-w-2xl mx-auto">
            Despite the structural overhaul, much of the foundation remains unchanged.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {staysSame.map((item) => {
              const Icon = item.icon
              return (
                <Card key={item.title} className="border-emerald-200 dark:border-emerald-800/50 bg-emerald-50/50 dark:bg-emerald-950/20">
                  <CardHeader className="pb-3">
                    <div className="p-3 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl shadow-lg w-fit mb-3">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg text-slate-900 dark:text-white">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* What Changes */}
      <section className="bg-slate-50 dark:bg-slate-900/30 border-y border-slate-200 dark:border-slate-800">
        <div className="container-wide py-16 md:py-20">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 text-center">
              What Changes
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-center mb-10 max-w-2xl mx-auto">
              The key areas where WCAG 3.0 departs from the WCAG 2.x approach.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {whatChanges.map((item) => {
                const Icon = item.icon
                return (
                  <Card key={item.title} className="border-blue-200 dark:border-blue-800/50 bg-blue-50/50 dark:bg-blue-950/20">
                    <CardHeader className="pb-3">
                      <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg w-fit mb-3">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-lg text-slate-900 dark:text-white">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container-wide py-16 md:py-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-10 text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6" itemScope itemType="https://schema.org/FAQPage">
            {faqs.map((faq) => (
              <div
                key={faq.question}
                className="bg-white dark:bg-slate-800/60 rounded-xl p-6 border border-slate-200 dark:border-slate-700"
                itemScope
                itemProp="mainEntity"
                itemType="https://schema.org/Question"
              >
                <h3 className="font-semibold text-slate-900 dark:text-white mb-3" itemProp="name">
                  {faq.question}
                </h3>
                <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer">
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed" itemProp="text">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cross-Links */}
      <section className="bg-slate-50 dark:bg-slate-900/30 border-y border-slate-200 dark:border-slate-800">
        <div className="container-wide py-16 md:py-20">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 text-center">
              Continue Exploring
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-center mb-10 max-w-2xl mx-auto">
              Dive deeper into WCAG 3.0 or review the current WCAG 2.2 checklist.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {crossLinks.map((link) => {
                const Icon = link.icon
                return (
                  <Link key={link.href} href={link.href} className="group">
                    <div className="h-full p-5 bg-white dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                      <div className={`p-3 bg-gradient-to-r ${link.gradient} rounded-xl shadow-lg w-fit mb-4`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {link.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                        {link.description}
                      </p>
                      <span className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:gap-2 transition-all">
                        Read more <ArrowRight className="h-4 w-4 ml-1" />
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Related Content */}
      <section className="container-wide py-12 md:py-16">
        <RelatedContent content="WCAG 3.0 vs WCAG 2.2 comparison accessibility standards conformance compliance" maxItems={3} />
      </section>
    </div>
  )
}
