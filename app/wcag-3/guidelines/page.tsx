import Link from "next/link"
import { createMetadata } from "@/lib/metadata"
import { BreadcrumbStructuredData, ArticleStructuredData } from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Image,
  Type,
  MousePointerClick,
  Keyboard,
  AlertCircle,
  Play,
  LayoutGrid,
  Repeat,
  ListChecks,
  ShieldCheck,
  HelpCircle,
  Settings2,
  ArrowRight,
  Sparkles,
  Layers,
  ArrowLeftRight,
} from "lucide-react"

export const metadata = {
  ...createMetadata({
    title: "WCAG 3.0 Guidelines: All 12 Categories Explained | Complete Breakdown",
    description:
      "Complete breakdown of the 12 WCAG 3.0 guideline categories that replace the 4 POUR principles. Learn what each category covers, how it maps to WCAG 2.x, and what is entirely new in WCAG 3.",
    keywords: [
      "wcag 3.0 guidelines",
      "wcag 3 categories",
      "wcag 3.0 12 categories",
      "wcag 3 requirements",
      "WCAG 3 guideline categories",
      "POUR principles replacement",
      "WCAG 3.0 functional categories",
    ],
    type: "article" as const,
    publishedTime: "2026-03-15T00:00:00Z",
    modifiedTime: "2026-03-15T00:00:00Z",
  }),
  alternates: {
    canonical: "https://accessibility.build/wcag-3/guidelines",
  },
}

const categories = [
  {
    number: 1,
    name: "Images and Media",
    icon: Image,
    description:
      "Covers alternatives for visual and audio content, including text alternatives for images, captions for video, audio descriptions, and accessible media players. This category ensures all non-text content has an equivalent accessible form.",
    mapsTo: "WCAG 2.x Guideline 1.1, 1.2",
    isNew: false,
    gradient: "from-blue-500 to-blue-600",
    badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  },
  {
    number: 2,
    name: "Text and Wording",
    icon: Type,
    description:
      "Addresses readable, clear language support including reading level, language identification, abbreviations, and plain language requirements. Ensures textual content is understandable by the widest possible audience.",
    mapsTo: "WCAG 2.x Guideline 3.1",
    isNew: false,
    gradient: "from-emerald-500 to-emerald-600",
    badgeColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  {
    number: 3,
    name: "Interactive Components",
    icon: MousePointerClick,
    description:
      "Focuses on keyboard and pointer focus management, interactive controls, focus order, and visible focus indicators. Ensures all interactive elements are discoverable, operable, and communicate their state clearly.",
    mapsTo: "WCAG 2.x Guideline 2.1, 2.4",
    isNew: false,
    gradient: "from-violet-500 to-violet-600",
    badgeColor: "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-400",
  },
  {
    number: 4,
    name: "Input/Operation",
    icon: Keyboard,
    description:
      "Covers keyboard, pointer, speech, and gesture input methods. Ensures users can operate content through any input modality without being locked into a single mechanism, and that complex gestures have simple alternatives.",
    mapsTo: "WCAG 2.x Guideline 2.1, 2.5",
    isNew: false,
    gradient: "from-cyan-500 to-cyan-600",
    badgeColor: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400",
  },
  {
    number: 5,
    name: "Error Handling",
    icon: AlertCircle,
    description:
      "Addresses error detection, prevention, and correction. Users must be informed of errors in an accessible way, given suggestions for correction, and provided the ability to review and undo submissions.",
    mapsTo: "WCAG 2.x Guideline 3.3",
    isNew: false,
    gradient: "from-red-500 to-red-600",
    badgeColor: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  },
  {
    number: 6,
    name: "Animation and Movement",
    icon: Play,
    description:
      "Protects physical safety by addressing seizure risks, motion sickness, and distracting animations. Requires that animations can be paused, stopped, or hidden, and that flashing content stays within safe thresholds.",
    mapsTo: "WCAG 2.x Guideline 2.3",
    isNew: false,
    gradient: "from-orange-500 to-orange-600",
    badgeColor: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  },
  {
    number: 7,
    name: "Layout",
    icon: LayoutGrid,
    description:
      "Ensures recognizable, navigable page structures with proper visual hierarchy, contrast, spacing, and responsive design. Covers both visual presentation and the underlying semantic structure that assistive technologies rely on.",
    mapsTo: "WCAG 2.x Guideline 1.3, 1.4",
    isNew: false,
    gradient: "from-indigo-500 to-indigo-600",
    badgeColor: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
  },
  {
    number: 8,
    name: "Consistency Across Views",
    icon: Repeat,
    description:
      "Ensures predictable navigation and consistent behavior across different views, pages, and states. Significantly expanded from WCAG 2.x to cover multi-step processes, cross-platform consistency, and pattern predictability.",
    mapsTo: "WCAG 2.x Guideline 3.2 (expanded significantly)",
    isNew: false,
    isExpanded: true,
    gradient: "from-teal-500 to-teal-600",
    badgeColor: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400",
  },
  {
    number: 9,
    name: "Process and Task Completion",
    icon: ListChecks,
    description:
      "Addresses cognitive accessibility by ensuring multi-step processes are manageable, progress is saved, and users can complete tasks without excessive cognitive load. This category is largely new territory not covered by WCAG 2.x.",
    mapsTo: "Largely NEW in WCAG 3.0",
    isNew: true,
    gradient: "from-amber-500 to-amber-600",
    badgeColor: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  },
  {
    number: 10,
    name: "Policy and Protection",
    icon: ShieldCheck,
    description:
      "Covers risk mitigation, algorithmic fairness, and organizational policies that protect users from harm. This entirely new category addresses dark patterns, bias in automated decisions, and privacy considerations for people with disabilities.",
    mapsTo: "Entirely NEW in WCAG 3.0",
    isNew: true,
    gradient: "from-rose-500 to-rose-600",
    badgeColor: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400",
  },
  {
    number: 11,
    name: "Help and Feedback",
    icon: HelpCircle,
    description:
      "Ensures support mechanisms are available, discoverable, and accessible. Significantly expanded beyond WCAG 2.x to include contextual help, feedback channels, documentation accessibility, and human support options.",
    mapsTo: "WCAG 2.x Guideline 3.3 (expanded)",
    isNew: false,
    isExpanded: true,
    gradient: "from-sky-500 to-sky-600",
    badgeColor: "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-400",
  },
  {
    number: 12,
    name: "User Control",
    icon: Settings2,
    description:
      "Addresses assistive technology compatibility, user customization, and personalization options. Significantly expanded from WCAG 2.x Robust principle to include user preferences, settings persistence, and adaptive interfaces.",
    mapsTo: "WCAG 2.x Guideline 4.1 (expanded)",
    isNew: false,
    isExpanded: true,
    gradient: "from-fuchsia-500 to-fuchsia-600",
    badgeColor: "bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/30 dark:text-fuchsia-400",
  },
]

function POURvsCategoriesSVG() {
  const pourColors = [
    { label: "Perceivable", fill: "fill-blue-500 dark:fill-blue-400" },
    { label: "Operable", fill: "fill-emerald-500 dark:fill-emerald-400" },
    { label: "Understandable", fill: "fill-purple-500 dark:fill-purple-400" },
    { label: "Robust", fill: "fill-orange-500 dark:fill-orange-400" },
  ]

  const categoryColors = [
    "fill-blue-500 dark:fill-blue-400",
    "fill-emerald-500 dark:fill-emerald-400",
    "fill-violet-500 dark:fill-violet-400",
    "fill-cyan-500 dark:fill-cyan-400",
    "fill-red-500 dark:fill-red-400",
    "fill-orange-500 dark:fill-orange-400",
    "fill-indigo-500 dark:fill-indigo-400",
    "fill-teal-500 dark:fill-teal-400",
    "fill-amber-500 dark:fill-amber-400",
    "fill-rose-500 dark:fill-rose-400",
    "fill-sky-500 dark:fill-sky-400",
    "fill-fuchsia-500 dark:fill-fuchsia-400",
  ]

  const categoryLabels = [
    "Images", "Text", "Interactive", "Input",
    "Errors", "Animation", "Layout", "Consistency",
    "Process", "Policy", "Help", "Control",
  ]

  return (
    <svg
      viewBox="0 0 760 280"
      className="w-full max-w-3xl mx-auto"
      role="img"
      aria-label="Diagram comparing WCAG 2.x's 4 POUR principles (Perceivable, Operable, Understandable, Robust) to WCAG 3.0's 12 functional categories arranged in a 4 by 3 grid"
    >
      {/* Left side label */}
      <text x="130" y="30" textAnchor="middle" className="fill-slate-700 dark:fill-slate-300 text-sm font-bold">
        WCAG 2.x
      </text>
      <text x="130" y="48" textAnchor="middle" className="fill-slate-400 dark:fill-slate-500 text-[10px]">
        4 POUR Principles
      </text>

      {/* POUR rectangles */}
      {pourColors.map((item, i) => (
        <g key={item.label}>
          <rect
            x="40"
            y={70 + i * 50}
            width="180"
            height="38"
            rx="8"
            className={item.fill}
            opacity="0.85"
          />
          <text
            x="130"
            y={94 + i * 50}
            textAnchor="middle"
            className="fill-white text-xs font-semibold"
          >
            {item.label}
          </text>
        </g>
      ))}

      {/* Arrow */}
      <line
        x1="250"
        y1="160"
        x2="340"
        y2="160"
        className="stroke-slate-400 dark:stroke-slate-500"
        strokeWidth="3"
        markerEnd="url(#pour-arrow)"
      />
      <text x="295" y="148" textAnchor="middle" className="fill-slate-400 dark:fill-slate-500 text-[10px]">
        evolves to
      </text>

      {/* Right side label */}
      <text x="530" y="30" textAnchor="middle" className="fill-slate-700 dark:fill-slate-300 text-sm font-bold">
        WCAG 3.0
      </text>
      <text x="530" y="48" textAnchor="middle" className="fill-slate-400 dark:fill-slate-500 text-[10px]">
        12 Functional Categories
      </text>

      {/* 4x3 grid of category rectangles */}
      {categoryLabels.map((label, i) => {
        const col = i % 4
        const row = Math.floor(i / 4)
        const x = 360 + col * 90
        const y = 70 + row * 70
        return (
          <g key={label}>
            <rect
              x={x}
              y={y}
              width="78"
              height="52"
              rx="6"
              className={categoryColors[i]}
              opacity="0.85"
            />
            <text
              x={x + 39}
              y={y + 30}
              textAnchor="middle"
              className="fill-white text-[9px] font-semibold"
            >
              {label}
            </text>
          </g>
        )
      })}

      {/* Arrowhead marker */}
      <defs>
        <marker id="pour-arrow" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" className="fill-slate-400 dark:fill-slate-500" />
        </marker>
      </defs>
    </svg>
  )
}

export default function WCAG3GuidelinesPage() {
  return (
    <div className="min-h-screen pt-12">
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "WCAG 3.0 Guide", url: "https://accessibility.build/wcag-3" },
          { name: "12 Guideline Categories", url: "https://accessibility.build/wcag-3/guidelines" },
        ]}
      />
      <ArticleStructuredData
        headline="WCAG 3.0 Guidelines: All 12 Categories Explained"
        description="Complete breakdown of the 12 WCAG 3.0 guideline categories that replace the 4 POUR principles."
        author={{ name: "Accessibility.build Team" }}
        publisher={{
          name: "Accessibility.build",
          logo: "https://accessibility.build/android-chrome-512x512.png",
        }}
        datePublished="2026-03-01"
        dateModified="2026-03-15"
        image="https://accessibility.build/og-image.png"
        url="https://accessibility.build/wcag-3/guidelines"
        wordCount={3500}
        keywords={["WCAG 3.0 guidelines", "WCAG 3 categories", "POUR principles", "accessibility standards"]}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-teal-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-teal-950/30 border-b border-slate-200 dark:border-slate-800">
        <div className="container-wide pb-16 md:pb-24">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700">
              WCAG 3.0 Deep Dive
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-teal-800 to-blue-800 dark:from-white dark:via-teal-200 dark:to-blue-300 bg-clip-text text-transparent leading-tight">
              WCAG 3.0 Guideline Categories
            </h1>

            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-3xl mx-auto leading-relaxed">
              WCAG 3.0 replaces the 4 POUR principles (Perceivable, Operable, Understandable, Robust)
              with 12 functional categories. This shift moves from abstract principles to concrete,
              outcome-focused groupings that better reflect how people actually use digital products.
            </p>

            {/* Stats Bar */}
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 text-sm">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-teal-100 dark:bg-teal-900/50 rounded-full">
                  <Layers className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                </div>
                <span className="font-medium text-slate-700 dark:text-slate-300">12 Categories</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                  <ArrowLeftRight className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="font-medium text-slate-700 dark:text-slate-300">Replaces POUR</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-full">
                  <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="font-medium text-slate-700 dark:text-slate-300">Outcome-Focused</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* POUR vs 12 Categories SVG */}
      <section className="container-wide py-16 md:py-20">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3">
            From 4 Principles to 12 Categories
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            The familiar POUR framework served accessibility well for over 15 years. WCAG 3.0 evolves
            this into 12 granular categories that better capture the full spectrum of user needs.
          </p>
        </div>
        <POURvsCategoriesSVG />
      </section>

      {/* 12 Category Cards */}
      <section className="bg-slate-50 dark:bg-slate-900/30 border-y border-slate-200 dark:border-slate-800">
        <div className="container-wide py-16 md:py-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 text-center">
              All 12 Guideline Categories
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-center mb-12 max-w-2xl mx-auto">
              Each category groups related accessibility outcomes together. Categories marked as
              &quot;New&quot; or &quot;Expanded&quot; represent areas where WCAG 3.0 goes significantly
              beyond what WCAG 2.x covered.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => {
                const Icon = category.icon
                return (
                  <Card
                    key={category.number}
                    className="relative border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                  >
                    <div
                      className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${category.gradient} rounded-t-lg`}
                    />
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Badge
                            variant="outline"
                            className="h-8 w-8 rounded-full p-0 flex items-center justify-center text-xs font-bold border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300"
                          >
                            {category.number}
                          </Badge>
                          <div className={`p-2.5 bg-gradient-to-r ${category.gradient} rounded-xl shadow-lg`}>
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                        </div>
                        {category.isNew && (
                          <Badge className="bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-700">
                            New
                          </Badge>
                        )}
                        {category.isExpanded && (
                          <Badge className="bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-700">
                            Expanded
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg text-slate-900 dark:text-white">
                        {category.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                        {category.description}
                      </p>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-500 border-t border-slate-100 dark:border-slate-700 pt-3">
                        <span className="text-slate-400 dark:text-slate-600">Maps to: </span>
                        {category.mapsTo}
                      </p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* What's New Highlight Section */}
      <section className="container-wide py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl border border-amber-200 dark:border-amber-800/50 bg-gradient-to-br from-amber-50 via-white to-orange-50/30 dark:from-amber-950/30 dark:via-slate-900 dark:to-orange-950/20 p-8 md:p-10">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-amber-100 dark:bg-amber-900/50 rounded-xl flex-shrink-0">
                <Sparkles className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-2">
                  What&apos;s New in WCAG 3.0 Categories
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  While many WCAG 3.0 categories map directly to existing WCAG 2.x guidelines,
                  several represent entirely new territory or significant expansions.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Entirely New */}
              <div className="bg-white dark:bg-slate-800/60 rounded-xl p-6 border border-amber-200/60 dark:border-amber-800/30">
                <h3 className="font-semibold text-amber-900 dark:text-amber-200 mb-3 flex items-center gap-2">
                  <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                    New
                  </Badge>
                  Entirely New Categories
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white text-sm">
                      Category 9: Process and Task Completion
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Cognitive accessibility for multi-step tasks, progress saving, and reducing mental load.
                      WCAG 2.x had no direct equivalent for this critical area.
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white text-sm">
                      Category 10: Policy and Protection
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Algorithmic fairness, dark pattern prevention, and organizational responsibility.
                      Reflects the modern digital landscape where automated systems can create accessibility barriers.
                    </p>
                  </div>
                </div>
              </div>

              {/* Significantly Expanded */}
              <div className="bg-white dark:bg-slate-800/60 rounded-xl p-6 border border-purple-200/60 dark:border-purple-800/30">
                <h3 className="font-semibold text-purple-900 dark:text-purple-200 mb-3 flex items-center gap-2">
                  <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                    Expanded
                  </Badge>
                  Significantly Expanded Categories
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white text-sm">
                      Category 8: Consistency Across Views
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Goes well beyond WCAG 2.x Guideline 3.2 to cover cross-platform consistency,
                      multi-step process predictability, and pattern coherence.
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white text-sm">
                      Category 11: Help and Feedback
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Expands beyond error assistance to include contextual help, accessible documentation,
                      feedback channels, and human support options.
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white text-sm">
                      Category 12: User Control
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Evolves the Robust principle into comprehensive user agency, covering personalization,
                      settings persistence, and adaptive interface support.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cross-links */}
      <section className="bg-slate-50 dark:bg-slate-900/30 border-y border-slate-200 dark:border-slate-800">
        <div className="container-wide py-16 md:py-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 text-center">
              Continue Exploring WCAG 3.0
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-center mb-10 max-w-2xl mx-auto">
              The 12 categories are just one piece of the WCAG 3.0 framework. Explore how the full
              specification comes together.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href="/wcag-3"
                className="group flex items-center gap-4 p-5 bg-white dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-600 transition-all duration-300 hover:shadow-lg"
              >
                <div className="p-3 bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl shadow-lg flex-shrink-0">
                  <Layers className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    WCAG 3.0 Overview
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Return to the main hub
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-teal-500 transition-colors flex-shrink-0" />
              </Link>

              <Link
                href="/wcag-3/comparison"
                className="group flex items-center gap-4 p-5 bg-white dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-300 hover:shadow-lg"
              >
                <div className="p-3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl shadow-lg flex-shrink-0">
                  <ArrowLeftRight className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    WCAG 3.0 vs 2.2
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Side-by-side comparison
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-emerald-500 transition-colors flex-shrink-0" />
              </Link>

              <Link
                href="/wcag-3/concepts"
                className="group flex items-center gap-4 p-5 bg-white dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300 hover:shadow-lg"
              >
                <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg flex-shrink-0">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    Key Concepts
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Terminology and framework
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-purple-500 transition-colors flex-shrink-0" />
              </Link>

              <Link
                href="/wcag-3/preparation"
                className="group flex items-center gap-4 p-5 bg-white dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-600 transition-all duration-300 hover:shadow-lg"
              >
                <div className="p-3 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl shadow-lg flex-shrink-0">
                  <ListChecks className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    How to Prepare
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Actionable steps for your team
                  </p>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-amber-500 transition-colors flex-shrink-0" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Related Content */}
      <section className="container-wide py-12 md:py-16">
        <RelatedContent content="WCAG 3.0 guidelines categories accessibility standards compliance checklist" maxItems={3} />
      </section>
    </div>
  )
}
