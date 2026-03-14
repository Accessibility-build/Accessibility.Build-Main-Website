import Link from "next/link"
import { createMetadata } from "@/lib/metadata"
import { BreadcrumbStructuredData, ArticleStructuredData, FAQStructuredData } from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  Layers,
  GitCompareArrows,
  Lightbulb,
  Compass,
  Globe,
  BarChart3,
  Target,
  ArrowRight,
  AlertTriangle,
  BookOpen,
  RefreshCw,
  Sparkles,
} from "lucide-react"

export const metadata = {
  ...createMetadata({
    title: "WCAG 3.0 Guide: Everything About W3C Accessibility Guidelines 3.0",
    description:
      "Comprehensive guide to WCAG 3.0 (W3C Accessibility Guidelines). Learn about the new conformance model, 12 guideline categories, outcomes-based testing, and how to prepare for the next generation of accessibility standards.",
    keywords: [
      "WCAG 3.0",
      "WCAG 3",
      "W3C Accessibility Guidelines",
      "WCAG 3.0 overview",
      "what is WCAG 3.0",
      "WCAG 3.0 changes",
      "WCAG 3 guide",
      "accessibility standards",
      "WCAG 3.0 conformance",
      "outcomes-based accessibility",
    ],
    type: "article" as const,
    publishedTime: "2026-03-15T00:00:00Z",
    modifiedTime: "2026-03-15T00:00:00Z",
  }),
  alternates: {
    canonical: "https://accessibility.build/wcag-3",
  },
}

const faqs = [
  {
    question: "When will WCAG 3.0 be finalized?",
    answer:
      "WCAG 3.0 is currently a Working Draft as of March 2026. The W3C Accessibility Guidelines Working Group has stated it still has several years of work remaining. There is no firm date for the final Recommendation, but organizations should monitor progress and begin familiarizing themselves with the new framework now.",
  },
  {
    question: "Does WCAG 3.0 replace WCAG 2.2?",
    answer:
      "No, WCAG 3.0 does not deprecate WCAG 2.x. WCAG 2.2 remains the current, stable standard and will continue to be required by laws and regulations in many countries for the foreseeable future. WCAG 3.0 is being developed in parallel and will eventually provide an alternative path to conformance.",
  },
  {
    question: "Should I start following WCAG 3.0 now?",
    answer:
      "Not yet for compliance purposes — WCAG 3.0 is still a Working Draft and subject to significant changes. However, understanding its direction is valuable. The best preparation is ensuring strong WCAG 2.2 AA compliance, as content meeting WCAG 2.2 is expected to satisfy most of WCAG 3.0's minimum conformance level.",
  },
  {
    question: "What is the difference between WCAG 2 and WCAG 3?",
    answer:
      "WCAG 3.0 represents a fundamental redesign. It replaces the 4 POUR principles with 12 guideline categories, introduces outcomes-based testing instead of binary pass/fail, expands scope beyond web content to include apps, tools, and devices, and introduces new concepts like assertions and functional needs. The conformance model moves away from A/AA/AAA levels to a graduated scoring approach.",
  },
  {
    question: "Will WCAG 3.0 affect legal compliance requirements?",
    answer:
      "Not immediately. Current laws (ADA, Section 508, EN 301 549, EAA) reference WCAG 2.x. It will take years after WCAG 3.0 is finalized for regulatory bodies to update their requirements. Organizations should continue meeting WCAG 2.2 AA for legal compliance while monitoring WCAG 3.0 development.",
  },
  {
    question: "Is WCAG 3.0 harder to meet than WCAG 2.2?",
    answer:
      "It is different rather than harder. WCAG 3.0 uses outcomes-based assessment instead of binary pass/fail, which provides more nuance. Content that conforms to WCAG 2.2 Level A and AA is expected to meet most of WCAG 3.0's minimum conformance level, so existing accessible content will largely transfer.",
  },
]

const detailPages = [
  {
    title: "12 Guideline Categories",
    description:
      "Deep dive into WCAG 3.0's 12 guideline categories that replace the POUR principles. Understand each category, what it covers, and how it maps to WCAG 2.x.",
    icon: Layers,
    href: "/wcag-3/guidelines",
    gradient: "from-blue-600 to-indigo-600",
    badge: "Categories",
    badgeColor: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
  },
  {
    title: "WCAG 3.0 vs WCAG 2.2",
    description:
      "Side-by-side comparison of the two standards. See what changes, what stays the same, and understand the new conformance model in detail.",
    icon: GitCompareArrows,
    href: "/wcag-3/comparison",
    gradient: "from-teal-600 to-emerald-600",
    badge: "Comparison",
    badgeColor: "bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/30 dark:text-teal-400 dark:border-teal-800",
  },
  {
    title: "Key Concepts & Terminology",
    description:
      "Reference guide to WCAG 3.0's new vocabulary: outcomes, methods, assertions, functional needs, and how they all connect in the new framework.",
    icon: Lightbulb,
    href: "/wcag-3/concepts",
    gradient: "from-purple-600 to-violet-600",
    badge: "Reference",
    badgeColor: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800",
  },
  {
    title: "How to Prepare",
    description:
      "Actionable steps your team can take today to prepare for WCAG 3.0. Practical guidance for developers, designers, QA, product managers, and compliance teams.",
    icon: Compass,
    href: "/wcag-3/preparation",
    gradient: "from-amber-600 to-orange-600",
    badge: "Action Plan",
    badgeColor: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
  },
]

function EvolutionTimelineSVG() {
  const versions = [
    { label: "WCAG 1.0", year: "1999", x: 60 },
    { label: "WCAG 2.0", year: "2008", x: 210 },
    { label: "WCAG 2.1", year: "2018", x: 360 },
    { label: "WCAG 2.2", year: "2023", x: 510 },
    { label: "WCAG 3.0", year: "In Progress", x: 660 },
  ]

  return (
    <svg
      viewBox="0 0 760 120"
      className="w-full max-w-3xl mx-auto"
      role="img"
      aria-label="WCAG version timeline showing progression from WCAG 1.0 in 1999 to WCAG 3.0 currently in progress"
    >
      {/* Connection line */}
      <line x1="60" y1="50" x2="660" y2="50" className="stroke-slate-300 dark:stroke-slate-600" strokeWidth="3" strokeDasharray="8 4" />

      {versions.map((v, i) => {
        const isLast = i === versions.length - 1
        return (
          <g key={v.label}>
            {/* Node circle */}
            <circle
              cx={v.x}
              cy={50}
              r={isLast ? 18 : 12}
              className={isLast ? "fill-blue-600 dark:fill-blue-500" : "fill-slate-400 dark:fill-slate-500"}
            />
            {isLast && (
              <circle
                cx={v.x}
                cy={50}
                r={24}
                className="fill-none stroke-blue-400 dark:stroke-blue-600"
                strokeWidth="2"
                strokeDasharray="4 3"
                opacity="0.6"
              />
            )}
            <circle
              cx={v.x}
              cy={50}
              r={isLast ? 8 : 5}
              className="fill-white dark:fill-slate-900"
            />

            {/* Label */}
            <text
              x={v.x}
              y={90}
              textAnchor="middle"
              className={`text-xs font-semibold ${isLast ? "fill-blue-600 dark:fill-blue-400" : "fill-slate-600 dark:fill-slate-400"}`}
            >
              {v.label}
            </text>
            <text
              x={v.x}
              y={106}
              textAnchor="middle"
              className={`text-[10px] ${isLast ? "fill-blue-500 dark:fill-blue-500" : "fill-slate-400 dark:fill-slate-500"}`}
            >
              {v.year}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

function ConceptHierarchySVG() {
  return (
    <svg
      viewBox="0 0 700 260"
      className="w-full max-w-2xl mx-auto"
      role="img"
      aria-label="Diagram showing how WCAG 3.0 concepts connect: Functional Needs lead to Guidelines, which contain Requirements tested by Methods. Assertions run in parallel."
    >
      {/* Functional Needs */}
      <rect x="20" y="100" width="130" height="50" rx="10" className="fill-teal-100 dark:fill-teal-900/50 stroke-teal-500 dark:stroke-teal-600" strokeWidth="2" />
      <text x="85" y="130" textAnchor="middle" className="fill-teal-800 dark:fill-teal-300 text-xs font-semibold">Functional Needs</text>

      {/* Arrow 1 */}
      <line x1="150" y1="125" x2="190" y2="125" className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="2" markerEnd="url(#arrowhead)" />

      {/* Guidelines */}
      <rect x="190" y="100" width="120" height="50" rx="10" className="fill-blue-100 dark:fill-blue-900/50 stroke-blue-500 dark:stroke-blue-600" strokeWidth="2" />
      <text x="250" y="130" textAnchor="middle" className="fill-blue-800 dark:fill-blue-300 text-xs font-semibold">Guidelines</text>

      {/* Arrow 2 */}
      <line x1="310" y1="125" x2="350" y2="125" className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="2" markerEnd="url(#arrowhead)" />

      {/* Requirements */}
      <rect x="350" y="100" width="130" height="50" rx="10" className="fill-indigo-100 dark:fill-indigo-900/50 stroke-indigo-500 dark:stroke-indigo-600" strokeWidth="2" />
      <text x="415" y="130" textAnchor="middle" className="fill-indigo-800 dark:fill-indigo-300 text-xs font-semibold">Requirements</text>

      {/* Arrow 3 */}
      <line x1="480" y1="125" x2="520" y2="125" className="stroke-slate-400 dark:stroke-slate-500" strokeWidth="2" markerEnd="url(#arrowhead)" />

      {/* Methods */}
      <rect x="520" y="100" width="120" height="50" rx="10" className="fill-purple-100 dark:fill-purple-900/50 stroke-purple-500 dark:stroke-purple-600" strokeWidth="2" />
      <text x="580" y="130" textAnchor="middle" className="fill-purple-800 dark:fill-purple-300 text-xs font-semibold">Methods</text>

      {/* Assertions - parallel track */}
      <rect x="350" y="190" width="130" height="45" rx="10" className="fill-amber-100 dark:fill-amber-900/50 stroke-amber-500 dark:stroke-amber-600" strokeWidth="2" strokeDasharray="6 3" />
      <text x="415" y="218" textAnchor="middle" className="fill-amber-800 dark:fill-amber-300 text-xs font-semibold">Assertions</text>

      {/* Dashed connection from Requirements to Assertions */}
      <line x1="415" y1="150" x2="415" y2="190" className="stroke-amber-400 dark:stroke-amber-600" strokeWidth="1.5" strokeDasharray="4 3" />

      {/* Labels */}
      <text x="85" y="80" textAnchor="middle" className="fill-slate-400 dark:fill-slate-500 text-[9px]">User perspective</text>
      <text x="250" y="80" textAnchor="middle" className="fill-slate-400 dark:fill-slate-500 text-[9px]">Outcome statements</text>
      <text x="415" y="80" textAnchor="middle" className="fill-slate-400 dark:fill-slate-500 text-[9px]">Testable provisions</text>
      <text x="580" y="80" textAnchor="middle" className="fill-slate-400 dark:fill-slate-500 text-[9px]">Tech-specific</text>
      <text x="415" y="250" textAnchor="middle" className="fill-slate-400 dark:fill-slate-500 text-[9px]">Organizational commitments</text>

      {/* Arrowhead marker */}
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" className="fill-slate-400 dark:fill-slate-500" />
        </marker>
      </defs>
    </svg>
  )
}

const concepts = [
  { term: "Guidelines", definition: "Outcome statements that describe what accessible content should achieve, organized into 12 functional categories." },
  { term: "Requirements", definition: "Testable provisions at three levels: core (mandatory), supplemental (additional support), and assertions (organizational commitments)." },
  { term: "Methods", definition: "Technology-specific approaches for meeting requirements, replacing WCAG 2.x informative techniques with normative testing procedures." },
  { term: "Assertions", definition: "Documented organizational commitments requiring evidence — a completely new concept not present in WCAG 2.x." },
  { term: "Outcomes", definition: "Measurable results that guidelines aim to achieve, shifting focus from checkbox compliance to real user impact." },
  { term: "Functional Needs", definition: "User-need-based groupings that drive the entire framework, replacing disability-category approaches with functional descriptions." },
]

export default function WCAG3HubPage() {
  return (
    <div className="min-h-screen pt-12">
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "WCAG 3.0 Guide", url: "https://accessibility.build/wcag-3" },
        ]}
      />
      <ArticleStructuredData
        headline="WCAG 3.0 Guide: Everything About W3C Accessibility Guidelines 3.0"
        description="Comprehensive guide to WCAG 3.0. Learn about the new conformance model, 12 guideline categories, outcomes-based testing, and how to prepare."
        author={{ name: "Accessibility.build", url: "https://accessibility.build" }}
        publisher={{ name: "Accessibility.build", logo: "https://accessibility.build/logo.png" }}
        datePublished="2026-03-15T00:00:00Z"
        dateModified="2026-03-15T00:00:00Z"
        image="https://accessibility.build/og-image.png"
        url="https://accessibility.build/wcag-3"
        wordCount={4000}
        keywords={["WCAG 3.0", "W3C Accessibility Guidelines", "accessibility standards", "WCAG 3 guide"]}
      />
      <FAQStructuredData faqs={faqs} />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-teal-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-teal-950/30 border-b border-slate-200 dark:border-slate-800">
        <div className="container-wide pb-16 md:pb-24">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-700">
              Working Draft — March 2026
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-teal-800 to-blue-800 dark:from-white dark:via-teal-200 dark:to-blue-300 bg-clip-text text-transparent leading-tight">
              WCAG 3.0: The Next Generation of Accessibility Standards
            </h1>

            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-3xl mx-auto leading-relaxed">
              The W3C Accessibility Guidelines (WCAG) 3.0 represents a fundamental reimagining of accessibility standards.
              With 12 guideline categories, outcomes-based testing, and scope beyond web content — here is everything you need to know.
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
                  <RefreshCw className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="font-medium text-slate-700 dark:text-slate-300">Working Draft</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-full">
                  <Globe className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="font-medium text-slate-700 dark:text-slate-300">Broader Than Web</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-full">
                  <Target className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="font-medium text-slate-700 dark:text-slate-300">Outcomes-Based</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Evolution Timeline */}
      <section className="container-wide py-12 md:py-16">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3">
            The Evolution of Accessibility Standards
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            WCAG 3.0 builds on over two decades of web accessibility guidelines.
          </p>
        </div>
        <EvolutionTimelineSVG />
      </section>

      {/* What's Different - 3 Cards */}
      <section className="bg-slate-50 dark:bg-slate-900/30 border-y border-slate-200 dark:border-slate-800">
        <div className="container-wide py-16 md:py-20">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-10 text-center">
              What Makes WCAG 3.0 Different
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-slate-200 dark:border-slate-700">
                <CardHeader className="pb-3">
                  <div className="p-3 bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl shadow-lg w-fit mb-3">
                    <Globe className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">New Name, Broader Scope</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Renamed from &quot;Web Content Accessibility Guidelines&quot; to &quot;W3C Accessibility Guidelines&quot;, reflecting expanded scope covering web, native apps, authoring tools, user agents, IoT devices, and virtual/augmented reality.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-slate-200 dark:border-slate-700">
                <CardHeader className="pb-3">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg w-fit mb-3">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">Outcomes-Based Conformance</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Replaces binary pass/fail with graduated scoring. No more A/AA/AAA levels — instead, a nuanced outcomes-based assessment that measures real user impact rather than checkbox compliance.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-slate-200 dark:border-slate-700">
                <CardHeader className="pb-3">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl shadow-lg w-fit mb-3">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">12 Guideline Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    The 4 POUR principles (Perceivable, Operable, Understandable, Robust) evolve into 12 functional categories — from Images &amp; Media to Policy &amp; Protection — covering new areas like cognitive accessibility and algorithmic fairness.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Cards to Detail Pages */}
      <section className="container-wide py-16 md:py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 text-center">
            Explore WCAG 3.0 In Depth
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-center mb-10 max-w-2xl mx-auto">
            Dive deeper into specific aspects of WCAG 3.0 with our detailed guides.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {detailPages.map((page) => {
              const Icon = page.icon
              return (
                <Link key={page.href} href={page.href} className="group">
                  <Card className="h-full border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${page.gradient} rounded-t-lg`} />
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between mb-3">
                        <div className={`p-3 bg-gradient-to-r ${page.gradient} rounded-xl shadow-lg`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <Badge className={page.badgeColor}>{page.badge}</Badge>
                      </div>
                      <CardTitle className="text-xl group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {page.title}
                      </CardTitle>
                      <CardDescription className="text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                        {page.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <span className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:gap-2 transition-all">
                        Read guide <ArrowRight className="h-4 w-4 ml-1" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Key Concepts Quick Reference */}
      <section className="bg-slate-50 dark:bg-slate-900/30 border-y border-slate-200 dark:border-slate-800">
        <div className="container-wide py-16 md:py-20">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 text-center">
              WCAG 3.0 Conceptual Framework
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-center mb-10 max-w-2xl mx-auto">
              How the new building blocks of WCAG 3.0 connect to form a cohesive accessibility framework.
            </p>

            <ConceptHierarchySVG />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
              {concepts.map((concept) => (
                <div key={concept.term} className="p-5 bg-white dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{concept.term}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{concept.definition}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link
                href="/wcag-3/concepts"
                className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                Learn more about each concept <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Important Caveats */}
      <section className="container-wide py-12 md:py-16">
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-4 p-6 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800/50">
            <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-900 dark:text-amber-200 mb-2">Important: WCAG 3.0 Is Not Final</h3>
              <ul className="space-y-2 text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
                <li><strong>Working Draft status</strong> — the specification is subject to significant changes and is not ready for implementation requirements.</li>
                <li><strong>Does not deprecate WCAG 2.x</strong> — WCAG 2.2 remains the current, stable standard for compliance and legal purposes.</li>
                <li><strong>Legal requirements unchanged</strong> — ADA, Section 508, EN 301 549, and the European Accessibility Act continue to reference WCAG 2.x.</li>
                <li><strong>Several years remaining</strong> — the W3C Working Group has confirmed substantial work is still needed before the final Recommendation.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-slate-50 dark:bg-slate-900/30 border-y border-slate-200 dark:border-slate-800">
        <div className="container-wide py-16 md:py-20">
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
        </div>
      </section>

      {/* Related Content */}
      <section className="container-wide py-12 md:py-16">
        <RelatedContent content="WCAG 3.0 accessibility guidelines standards compliance checklist audit" maxItems={3} />
      </section>
    </div>
  )
}
