import Link from "next/link"
import { createMetadata } from "@/lib/metadata"
import { BreadcrumbStructuredData, ArticleStructuredData } from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  ClipboardCheck,
  Wrench,
  FileCheck,
  Users,
  Target,
  ArrowRight,
  Lightbulb,
  ArrowRightLeft,
} from "lucide-react"

export const metadata = {
  ...createMetadata({
    title: "WCAG 3.0 Key Concepts: Outcomes, Methods, Assertions & Functional Needs Explained",
    description:
      "A reference guide to the new vocabulary and conceptual framework in WCAG 3.0. Understand guidelines, requirements, methods, assertions, functional needs, and outcomes.",
    keywords: [
      "wcag 3.0 concepts",
      "wcag 3 terminology",
      "wcag 3.0 outcomes",
      "wcag 3 assertions",
      "wcag 3 methods",
      "wcag 3.0 functional needs",
    ],
    type: "article" as const,
    publishedTime: "2026-03-15T00:00:00Z",
    modifiedTime: "2026-03-15T00:00:00Z",
  }),
  alternates: {
    canonical: "https://accessibility.build/wcag-3/concepts",
  },
}

const conceptCards = [
  {
    title: "Guidelines",
    icon: BookOpen,
    gradient: "from-blue-500 to-blue-600",
    badgeText: "Evolved",
    badgeColor:
      "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
    definition:
      "Outcome statements that describe what accessible content should achieve. Rather than abstract organizational groupings, WCAG 3.0 guidelines are actionable outcome descriptions.",
    wcag2Equivalent:
      "\"Guidelines\" existed in WCAG 2.x but were more abstract organizational groupings under the four POUR principles (Perceivable, Operable, Understandable, Robust).",
    example:
      "\"Users can perceive all non-decorative images through text alternatives\" is a WCAG 3.0 guideline outcome \u2014 specific, measurable, and user-centered.",
    keyInsight:
      "Guidelines in WCAG 3.0 are organized into 12 functional categories rather than 4 principles, providing more granular and practical groupings.",
  },
  {
    title: "Requirements",
    icon: ClipboardCheck,
    gradient: "from-indigo-500 to-indigo-600",
    badgeText: "Redesigned",
    badgeColor:
      "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800",
    definition:
      "Testable provisions that come in three types: core requirements (mandatory for conformance), supplemental requirements (additional support beyond core), and assertions (organizational commitments requiring documentation).",
    wcag2Equivalent:
      "\"Success Criteria\" in WCAG 2.x served a similar role, but WCAG 3.0 requirements are more granular and introduce assertions as an entirely new type.",
    example:
      "A core requirement might be: \"All non-decorative images have a text alternative that describes the image\u2019s purpose.\"",
    keyInsight:
      "The three-tier structure (core / supplemental / assertions) allows more nuanced conformance than WCAG 2.x\u2019s binary pass/fail model.",
  },
  {
    title: "Methods",
    icon: Wrench,
    gradient: "from-purple-500 to-purple-600",
    badgeText: "Upgraded",
    badgeColor:
      "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800",
    definition:
      "Technology-specific approaches for meeting requirements, with detailed test procedures and expected results. Methods tell you exactly how to test a given requirement for a specific technology.",
    wcag2Equivalent:
      "\"Techniques\" in WCAG 2.x were informative and advisory. WCAG 3.0 methods are normative, with specific test procedures that must be followed.",
    example:
      "An HTML method for image alternatives might include: check for the alt attribute, verify it describes the image purpose, and ensure decorative images use an empty alt.",
    keyInsight:
      "Methods are normative (not just informative) and include specific test procedures, making testing more consistent across auditors and organizations.",
  },
  {
    title: "Assertions",
    icon: FileCheck,
    gradient: "from-amber-500 to-amber-600",
    badgeText: "Entirely New",
    badgeColor:
      "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
    definition:
      "Documented organizational commitments requiring evidence. Organizations publicly state what they provide for accessibility and back it up with documentation, training records, and process descriptions.",
    wcag2Equivalent:
      "No equivalent exists in WCAG 2.x \u2014 this is an entirely new concept introduced in WCAG 3.0.",
    example:
      "\"We provide accessibility training to all developers\" with evidence: training records, certificates, and curriculum documentation.",
    keyInsight:
      "Assertions acknowledge that real accessibility requires organizational commitment \u2014 not just technical fixes. Culture, process, and policy matter.",
  },
  {
    title: "Functional Needs",
    icon: Users,
    gradient: "from-teal-500 to-teal-600",
    badgeText: "New Foundation",
    badgeColor:
      "bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/30 dark:text-teal-400 dark:border-teal-800",
    definition:
      "User-need-based groupings that drive the entire framework. They describe what users need to successfully use content, regardless of specific disability categories or medical diagnoses.",
    wcag2Equivalent:
      "Partially relates to \"Understanding\" documents, but WCAG 2.x was organized by technical principles (POUR), not user needs.",
    example:
      "\"Users who cannot see need text alternatives for visual content\" describes a functional need that drives multiple guidelines and requirements.",
    keyInsight:
      "Centering on functional needs rather than disability categories is more inclusive and technology-resilient \u2014 it future-proofs the standard.",
  },
  {
    title: "Outcomes",
    icon: Target,
    gradient: "from-emerald-500 to-emerald-600",
    badgeText: "Core Shift",
    badgeColor:
      "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
    definition:
      "Measurable results that guidelines aim to achieve, representing the conceptual shift from \"conformance\" to demonstrating real user impact. Outcomes measure degree of achievement rather than binary pass/fail.",
    wcag2Equivalent:
      "The overall concept of \"conformance\" but measured differently \u2014 WCAG 2.x was binary (pass or fail), while WCAG 3.0 measures the degree of achievement on a graduated scale.",
    example:
      "Rather than \"alt text exists\" (pass/fail), an outcome measures \"users can understand the purpose of images\" with graduated scoring.",
    keyInsight:
      "Outcomes-based assessment provides more meaningful measurement of real-world accessibility impact than checkbox compliance.",
  },
]

const terminologyMapping = [
  { wcag2: "Success Criteria", wcag3: "Requirements (core / supplemental)" },
  { wcag2: "Techniques (informative)", wcag3: "Methods (normative)" },
  { wcag2: "N/A (new concept)", wcag3: "Assertions" },
  { wcag2: "Conformance Levels (A / AA / AAA)", wcag3: "Graduated scoring" },
  { wcag2: "4 Principles (POUR)", wcag3: "12 Guideline Categories" },
  { wcag2: "Understanding documents", wcag3: "Functional Needs documentation" },
  { wcag2: "Sufficient / Advisory techniques", wcag3: "Core / Supplemental requirements" },
]

const workedExampleSteps = [
  {
    step: 1,
    concept: "Functional Need",
    color: "teal",
    description: "Users who cannot see need text alternatives for visual content.",
  },
  {
    step: 2,
    concept: "Guideline",
    color: "blue",
    description: "Non-decorative images have meaningful text alternatives.",
  },
  {
    step: 3,
    concept: "Requirement",
    color: "indigo",
    description: "All informative images have an accessible name describing their purpose.",
  },
  {
    step: 4,
    concept: "Method",
    color: "purple",
    description: "HTML: Check img elements have alt attributes with descriptive text.",
  },
  {
    step: 5,
    concept: "Assertion",
    color: "amber",
    description: "Organization documents its alt text authoring process and QA review.",
  },
]

function ConceptualFrameworkSVG() {
  return (
    <svg
      viewBox="0 0 700 300"
      className="w-full max-w-3xl mx-auto"
      role="img"
      aria-label="Conceptual framework diagram showing how WCAG 3.0 concepts connect: Functional Needs flow to Guidelines, which flow to Requirements, which flow to Methods. Assertions branch down from Requirements as organizational commitments."
    >
      <defs>
        <marker id="concept-arrow" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" className="fill-slate-400 dark:fill-slate-500" />
        </marker>
        <marker id="concept-arrow-dashed" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" className="fill-amber-400 dark:fill-amber-500" />
        </marker>
      </defs>

      {/* Functional Needs box */}
      <rect x="20" y="100" width="140" height="60" rx="10" className="fill-teal-100 dark:fill-teal-900/50 stroke-teal-500 dark:stroke-teal-600" strokeWidth="2" />
      <text x="90" y="126" textAnchor="middle" className="fill-teal-800 dark:fill-teal-300 text-xs font-bold">Functional Needs</text>
      <text x="90" y="146" textAnchor="middle" className="fill-teal-600 dark:fill-teal-400 text-[9px]">User perspective</text>

      {/* Arrow 1 */}
      <line x1="160" y1="130" x2="195" y2="130" className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="2" markerEnd="url(#concept-arrow)" />

      {/* Guidelines box */}
      <rect x="195" y="100" width="130" height="60" rx="10" className="fill-blue-100 dark:fill-blue-900/50 stroke-blue-500 dark:stroke-blue-600" strokeWidth="2" />
      <text x="260" y="126" textAnchor="middle" className="fill-blue-800 dark:fill-blue-300 text-xs font-bold">Guidelines</text>
      <text x="260" y="146" textAnchor="middle" className="fill-blue-600 dark:fill-blue-400 text-[9px]">Outcome statements</text>

      {/* Arrow 2 */}
      <line x1="325" y1="130" x2="360" y2="130" className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="2" markerEnd="url(#concept-arrow)" />

      {/* Requirements box */}
      <rect x="360" y="100" width="140" height="60" rx="10" className="fill-indigo-100 dark:fill-indigo-900/50 stroke-indigo-500 dark:stroke-indigo-600" strokeWidth="2" />
      <text x="430" y="122" textAnchor="middle" className="fill-indigo-800 dark:fill-indigo-300 text-xs font-bold">Requirements</text>
      <text x="430" y="140" textAnchor="middle" className="fill-indigo-600 dark:fill-indigo-400 text-[9px]">Testable provisions</text>
      {/* Sub-labels */}
      <text x="385" y="155" textAnchor="middle" className="fill-indigo-500 dark:fill-indigo-400 text-[8px]">Core</text>
      <text x="430" y="155" textAnchor="middle" className="fill-indigo-500 dark:fill-indigo-400 text-[8px]">Suppl.</text>
      <text x="475" y="155" textAnchor="middle" className="fill-indigo-500 dark:fill-indigo-400 text-[8px]">Assert.</text>

      {/* Arrow 3 */}
      <line x1="500" y1="130" x2="535" y2="130" className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="2" markerEnd="url(#concept-arrow)" />

      {/* Methods box */}
      <rect x="535" y="100" width="130" height="60" rx="10" className="fill-purple-100 dark:fill-purple-900/50 stroke-purple-500 dark:stroke-purple-600" strokeWidth="2" />
      <text x="600" y="126" textAnchor="middle" className="fill-purple-800 dark:fill-purple-300 text-xs font-bold">Methods</text>
      <text x="600" y="146" textAnchor="middle" className="fill-purple-600 dark:fill-purple-400 text-[9px]">Tech-specific</text>

      {/* Dashed line from Requirements down to Assertions */}
      <line x1="430" y1="160" x2="430" y2="210" className="stroke-amber-400 dark:stroke-amber-600" strokeWidth="1.5" strokeDasharray="5 3" markerEnd="url(#concept-arrow-dashed)" />

      {/* Assertions box (dashed border) */}
      <rect x="360" y="210" width="140" height="55" rx="10" className="fill-amber-50 dark:fill-amber-900/30 stroke-amber-500 dark:stroke-amber-600" strokeWidth="2" strokeDasharray="6 3" />
      <text x="430" y="234" textAnchor="middle" className="fill-amber-800 dark:fill-amber-300 text-xs font-bold">Assertions</text>
      <text x="430" y="254" textAnchor="middle" className="fill-amber-600 dark:fill-amber-400 text-[9px]">Organizational commitments</text>

      {/* Top labels */}
      <text x="90" y="82" textAnchor="middle" className="fill-slate-400 dark:fill-slate-500 text-[9px] italic">Drives the framework</text>
      <text x="260" y="82" textAnchor="middle" className="fill-slate-400 dark:fill-slate-500 text-[9px] italic">12 categories</text>
      <text x="430" y="82" textAnchor="middle" className="fill-slate-400 dark:fill-slate-500 text-[9px] italic">3 types</text>
      <text x="600" y="82" textAnchor="middle" className="fill-slate-400 dark:fill-slate-500 text-[9px] italic">Normative tests</text>
    </svg>
  )
}

function StepColorClasses(color: string) {
  const map: Record<string, { bg: string; border: string; text: string; badge: string; dot: string }> = {
    teal: {
      bg: "bg-teal-50 dark:bg-teal-950/30",
      border: "border-teal-200 dark:border-teal-800",
      text: "text-teal-800 dark:text-teal-300",
      badge: "bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/30 dark:text-teal-400 dark:border-teal-800",
      dot: "bg-teal-500 dark:bg-teal-400",
    },
    blue: {
      bg: "bg-blue-50 dark:bg-blue-950/30",
      border: "border-blue-200 dark:border-blue-800",
      text: "text-blue-800 dark:text-blue-300",
      badge: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
      dot: "bg-blue-500 dark:bg-blue-400",
    },
    indigo: {
      bg: "bg-indigo-50 dark:bg-indigo-950/30",
      border: "border-indigo-200 dark:border-indigo-800",
      text: "text-indigo-800 dark:text-indigo-300",
      badge: "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800",
      dot: "bg-indigo-500 dark:bg-indigo-400",
    },
    purple: {
      bg: "bg-purple-50 dark:bg-purple-950/30",
      border: "border-purple-200 dark:border-purple-800",
      text: "text-purple-800 dark:text-purple-300",
      badge: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800",
      dot: "bg-purple-500 dark:bg-purple-400",
    },
    amber: {
      bg: "bg-amber-50 dark:bg-amber-950/30",
      border: "border-amber-200 dark:border-amber-800",
      text: "text-amber-800 dark:text-amber-300",
      badge: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
      dot: "bg-amber-500 dark:bg-amber-400",
    },
  }
  return map[color] || map.blue
}

export default function WCAG3ConceptsPage() {
  return (
    <div className="min-h-screen pt-24">
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "WCAG 3.0 Guide", url: "https://accessibility.build/wcag-3" },
          { name: "Key Concepts & Terminology", url: "https://accessibility.build/wcag-3/concepts" },
        ]}
      />
      <ArticleStructuredData
        headline="WCAG 3.0 Key Concepts: Outcomes, Methods, Assertions & Functional Needs Explained"
        description="A reference guide to the new vocabulary and conceptual framework in WCAG 3.0. Understand guidelines, requirements, methods, assertions, functional needs, and outcomes."
        author={{ name: "Accessibility.build Team", url: "https://accessibility.build/about" }}
        publisher={{ name: "Accessibility.build", logo: "https://accessibility.build/android-chrome-512x512.png" }}
        datePublished="2025-03-01"
        dateModified="2026-03-15"
        image="https://accessibility.build/og-image.png"
        url="https://accessibility.build/wcag-3/concepts"
        wordCount={3500}
        keywords={["WCAG 3.0", "accessibility concepts", "assertions", "functional needs", "outcomes", "methods"]}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-violet-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950/30 border-b border-slate-200 dark:border-slate-800">
        <div className="container-wide pb-16 md:pb-24">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-700">
              Reference Guide
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-900 via-violet-800 to-indigo-800 dark:from-white dark:via-purple-200 dark:to-violet-300 bg-clip-text text-transparent leading-tight">
              WCAG 3.0 Key Concepts and Terminology
            </h1>

            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-3xl mx-auto leading-relaxed">
              A reference guide to the new vocabulary and conceptual framework that underpins WCAG 3.0.
              Understand guidelines, requirements, methods, assertions, functional needs, and outcomes.
            </p>

            {/* Stats Bar */}
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 text-sm">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-full">
                  <Lightbulb className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="font-medium text-slate-700 dark:text-slate-300">6 Core Concepts</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-violet-100 dark:bg-violet-900/50 rounded-full">
                  <ArrowRightLeft className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                </div>
                <span className="font-medium text-slate-700 dark:text-slate-300">New Framework</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-full">
                  <BookOpen className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <span className="font-medium text-slate-700 dark:text-slate-300">Reference Guide</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conceptual Framework Flowchart */}
      <section className="container-wide py-12 md:py-16">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3">
            How WCAG 3.0 Concepts Connect
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            The relationship between the core building blocks of the WCAG 3.0 framework.
          </p>
        </div>
        <ConceptualFrameworkSVG />
      </section>

      {/* 6 Concept Deep-Dive Cards */}
      <section className="bg-slate-50 dark:bg-slate-900/30 border-y border-slate-200 dark:border-slate-800">
        <div className="container-wide py-16 md:py-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 text-center">
              Concept Deep Dive
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-center mb-12 max-w-2xl mx-auto">
              Each of the six core concepts explained in detail, with WCAG 2.x comparisons and practical examples.
            </p>

            <div className="space-y-8">
              {conceptCards.map((concept) => {
                const Icon = concept.icon
                return (
                  <Card key={concept.title} className="border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className={`h-1.5 bg-gradient-to-r ${concept.gradient}`} />
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 bg-gradient-to-r ${concept.gradient} rounded-xl shadow-lg`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <Badge className={concept.badgeColor}>{concept.badgeText}</Badge>
                      </div>
                      <CardTitle className="text-xl md:text-2xl text-slate-900 dark:text-white">
                        {concept.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5">
                      <div>
                        <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                          Definition
                        </h4>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                          {concept.definition}
                        </p>
                      </div>

                      <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                        <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                          WCAG 2.x Equivalent
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                          {concept.wcag2Equivalent}
                        </p>
                      </div>

                      <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-100 dark:border-blue-900/50">
                        <h4 className="text-sm font-semibold text-blue-700 dark:text-blue-400 uppercase tracking-wide mb-2">
                          Example
                        </h4>
                        <p className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
                          {concept.example}
                        </p>
                      </div>

                      <div className="flex gap-3 p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-lg border border-emerald-100 dark:border-emerald-900/50">
                        <Lightbulb className="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide mb-1">
                            Key Insight
                          </h4>
                          <p className="text-sm text-emerald-800 dark:text-emerald-300 leading-relaxed">
                            {concept.keyInsight}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Terminology Mapping Table */}
      <section className="container-wide py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 text-center">
            Terminology Mapping: WCAG 2.x to 3.0
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-center mb-10 max-w-2xl mx-auto">
            A quick reference for how familiar WCAG 2.x terms translate to the new WCAG 3.0 vocabulary.
          </p>

          <div className="bg-white dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
              <div className="font-semibold text-sm text-slate-700 dark:text-slate-300">WCAG 2.x Term</div>
              <div className="font-semibold text-sm text-slate-700 dark:text-slate-300">WCAG 3.0 Term</div>
            </div>
            {/* Table rows */}
            {terminologyMapping.map((row, index) => (
              <div
                key={index}
                className={`grid grid-cols-2 gap-4 p-4 items-center ${
                  index < terminologyMapping.length - 1
                    ? "border-b border-slate-100 dark:border-slate-700/50"
                    : ""
                } ${index % 2 === 1 ? "bg-slate-50/50 dark:bg-slate-800/30" : ""}`}
              >
                <div className="text-sm text-slate-600 dark:text-slate-400">{row.wcag2}</div>
                <div className="flex items-center gap-2">
                  <ArrowRight className="h-3 w-3 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                  <span className="text-sm font-medium text-slate-900 dark:text-white">{row.wcag3}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It All Fits Together */}
      <section className="bg-slate-50 dark:bg-slate-900/30 border-y border-slate-200 dark:border-slate-800">
        <div className="container-wide py-16 md:py-20">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 text-center">
              How It All Fits Together
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-center mb-12 max-w-2xl mx-auto">
              A worked example tracing image alt text through the entire WCAG 3.0 framework, from user need to organizational commitment.
            </p>

            <div className="relative">
              {/* Connecting vertical line */}
              <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-slate-200 dark:bg-slate-700 hidden md:block" />

              <div className="space-y-6">
                {workedExampleSteps.map((step) => {
                  const colors = StepColorClasses(step.color)
                  return (
                    <div key={step.step} className="relative flex items-start gap-4 md:gap-6">
                      {/* Step dot */}
                      <div className="relative z-10 flex-shrink-0">
                        <div className={`w-12 h-12 rounded-full ${colors.dot} flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                          {step.step}
                        </div>
                      </div>

                      {/* Step content */}
                      <div className={`flex-1 p-5 rounded-xl border ${colors.border} ${colors.bg}`}>
                        <Badge className={`mb-2 ${colors.badge}`}>
                          {step.concept}
                        </Badge>
                        <p className={`text-sm leading-relaxed ${colors.text}`}>
                          {step.description}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cross-links to other WCAG 3 pages */}
      <section className="container-wide py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 text-center">
            Explore More WCAG 3.0 Guides
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-center mb-10 max-w-2xl mx-auto">
            Continue learning about WCAG 3.0 with our detailed companion guides.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Link href="/wcag-3" className="group">
              <div className="p-6 bg-white dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-lg">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  WCAG 3.0 Overview
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                  The complete overview of WCAG 3.0 and its significance for web accessibility.
                </p>
                <span className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:gap-2 transition-all">
                  Read overview <ArrowRight className="h-4 w-4 ml-1" />
                </span>
              </div>
            </Link>

            <Link href="/wcag-3/guidelines" className="group">
              <div className="p-6 bg-white dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-lg">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  12 Guideline Categories
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                  Deep dive into the 12 functional categories that replace the POUR principles.
                </p>
                <span className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:gap-2 transition-all">
                  Read guide <ArrowRight className="h-4 w-4 ml-1" />
                </span>
              </div>
            </Link>

            <Link href="/wcag-3/comparison" className="group">
              <div className="p-6 bg-white dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-lg">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  WCAG 3.0 vs WCAG 2.2
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                  Side-by-side comparison of the two standards and the new conformance model.
                </p>
                <span className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:gap-2 transition-all">
                  Read comparison <ArrowRight className="h-4 w-4 ml-1" />
                </span>
              </div>
            </Link>

            <Link href="/wcag-3/preparation" className="group">
              <div className="p-6 bg-white dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-lg">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  How to Prepare
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
                  Actionable steps your team can take today to get ready for WCAG 3.0.
                </p>
                <span className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:gap-2 transition-all">
                  Read preparation guide <ArrowRight className="h-4 w-4 ml-1" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Related Content */}
      <section className="container-wide py-12 md:py-16">
        <RelatedContent content="WCAG 3.0 concepts terminology outcomes methods assertions functional needs accessibility guidelines" maxItems={3} />
      </section>
    </div>
  )
}
