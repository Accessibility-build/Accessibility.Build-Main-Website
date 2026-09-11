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
import { getRouteDate } from "@/lib/site-routes"

export const metadata = createMetadata({
  title: "WCAG 3.0 Guide: W3C Accessibility Guidelines 3.0",
  description:
    "Comprehensive guide to WCAG 3.0 (W3C Accessibility Guidelines). Learn about the six reporting tiers, the 12 guideline categories, what changed in the September 2026 draft, and how to prepare.",
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
  modifiedTime: "2026-09-11T00:00:00Z",
  path: "/wcag-3",
})

const faqs = [
  {
    question: "When will WCAG 3.0 be finalized?",
    answer:
      "The most recent Working Draft was published on 10 September 2026. The W3C Accessibility Guidelines Working Group states that while the draft has moved closer toward completion, it still has several years of work remaining. There is no firm date for the final Recommendation, but organizations should monitor progress and begin familiarizing themselves with the new framework now.",
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
      "WCAG 3.0 represents a fundamental redesign. It replaces the 4 POUR principles with 12 guideline categories, expands scope beyond web content to include apps, tools, and devices, and introduces new concepts like assertions and functional needs. The September 2026 draft also moves the idea of levels out of conformance entirely: conformance is a single bar (meet every core requirement), and progress toward and beyond that bar is expressed through six reporting tiers rather than A/AA/AAA.",
  },
  {
    question: "Will WCAG 3.0 affect legal compliance requirements?",
    answer:
      "Not immediately. Current laws (ADA, Section 508, EN 301 549, EAA) reference WCAG 2.x. It will take years after WCAG 3.0 is finalized for regulatory bodies to update their requirements. Organizations should continue meeting WCAG 2.2 AA for legal compliance while monitoring WCAG 3.0 development.",
  },
  {
    question: "Is WCAG 3.0 harder to meet than WCAG 2.2?",
    answer:
      "It is different rather than harder, but it is not a straight swap. The W3C states that content conforming to WCAG 2.2 Level A and Level AA is expected to meet most of the minimum conformance level of the new standard, so existing accessible content largely transfers. It also warns that WCAG 3 adds tests WCAG 2.2 does not have, so additional work will be needed to reach full conformance.",
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

const draftChanges = [
  {
    title: "Leveling moved out of conformance",
    detail:
      "A new Reporting section now carries the idea of levels. The editors write that WCAG 3 “moves the concept of leveling from conformance to reporting”, and use the term “reporting tiers” to keep it distinct from the old “conformance levels”. The previous draft’s Conformance level subsection is gone.",
  },
  {
    title: "Six reporting tiers, with Bronze, Silver, and Gold above conformance",
    detail:
      "The tiers are cumulative: 1 avoid physical harm, 2 foundational access, 3 conformance, 4 Bronze, 5 Silver, 6 Gold. Conformance is tier 3, reached when every core requirement is met. Tiers 4 to 6 add supplemental requirements and assertions, and the exact numbers are still marked TBD.",
  },
  {
    title: "Core requirements are tagged by severity",
    detail:
      "Every core requirement now carries one of four tags describing the worst-case impact of failing it: Physical Harm, Risk, Barrier, or Friction. These tags are what build the reporting tiers. Assertions are separately tagged as being about Content or about the Organization.",
  },
  {
    title: "Conformance advanced from exploratory to developing",
    detail:
      "The Conformance section changed maturity status between the two 2026 drafts. The new Reporting section is still marked exploratory.",
  },
  {
    title: "Best practices renamed Recommended Practices",
    detail:
      "They remain informative and are not needed to conform, but they are now named consistently and can take the form of either a provision or a method.",
  },
  {
    title: "Images and media split into nine guidelines",
    detail:
      "The old Media alternatives guideline was dissolved. Transcripts, Sign language, and Accessible media player are now guidelines in their own right, and Figure captions moved up to 2.1.2. Transcripts, captions, and audio descriptions each gained a full set of requirements covering speakers, sounds, visual information, style guides, and usability testing.",
  },
  {
    title: "Text appearance gained minimum and enhanced requirements",
    detail:
      "Blocks of text readable, text style readable, and text contrast sufficient each now appear in both a minimum and an enhanced form, alongside the existing adjustability requirements.",
  },
  {
    title: "Requirement type moved from headings into tags",
    detail:
      "Headings used to read “Core requirement: Images detectable”. They now read “Images detectable”, with the type carried as a tag. Some requirements were also renamed, including No flashing to No flashing over threshold, and No repetitive links to No repetitive adjacent interactive elements.",
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
  { term: "Requirements", definition: "Testable provisions in two kinds: core requirements, which must all be met to conform, and supplemental requirements, which go beyond conformance." },
  { term: "Methods", definition: "Technology-specific approaches for meeting a requirement or assertion. A method only counts toward conformance if it is accessibility supported." },
  { term: "Assertions", definition: "Documented statements about accessibility practices an organization follows — tagged as being about content or about the organization." },
  { term: "Reporting tiers", definition: "Six cumulative tiers that replace conformance levels, running from avoiding physical harm through conformance to Bronze, Silver, and Gold." },
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
        dateModified={getRouteDate("/wcag-3") ?? "2026-03-15"}
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
              Working Draft — 10 September 2026
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-teal-800 to-blue-800 dark:from-white dark:via-teal-200 dark:to-blue-300 bg-clip-text text-transparent leading-tight">
              WCAG 3.0: The Next Generation of Accessibility Standards
            </h1>

            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-3xl mx-auto leading-relaxed">
              The W3C Accessibility Guidelines (WCAG) 3.0 represents a fundamental reimagining of accessibility standards.
              With 12 guideline categories, six reporting tiers in place of A/AA/AAA, and scope beyond web content — here is everything you need to know.
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
                <span className="font-medium text-slate-700 dark:text-slate-300">Six Reporting Tiers</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What changed in the latest draft */}
      <section className="bg-slate-50 dark:bg-slate-900/30 border-y border-slate-200 dark:border-slate-800">
        <div className="container-wide py-16 md:py-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <Badge className="mb-4 bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/30 dark:text-teal-400 dark:border-teal-700">
                Latest draft
              </Badge>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3">
                What Changed in the 10 September 2026 Working Draft
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                This draft supersedes the one published on 3 March 2026. These are the substantive changes.
              </p>
            </div>

            <ol className="space-y-4">
              {draftChanges.map((change, i) => (
                <li
                  key={change.title}
                  className="flex gap-4 p-5 bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl"
                >
                  <span
                    className="flex-shrink-0 w-7 h-7 rounded-full bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-300 text-xs font-bold flex items-center justify-center"
                    aria-hidden="true"
                  >
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                      {change.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {change.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-8 p-5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl">
              <div className="flex gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <h3 className="font-semibold text-amber-900 dark:text-amber-200 mb-1">
                    The tier model is not settled
                  </h3>
                  <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
                    An editor&rsquo;s note in the Reporting section records an alternative proposal that would use
                    scoring to show progress toward conformance and then award Bronze, Silver, and Gold after it.
                    The Working Group is inviting public comment on which approach to take, so treat the six tiers
                    as the current direction rather than a decided outcome.
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-6 text-sm text-slate-500 dark:text-slate-400 text-center">
              Source:{" "}
              <a
                href="https://www.w3.org/TR/2026/WD-wcag-3.0-20260910/"
                className="underline decoration-slate-400 hover:decoration-slate-700 dark:hover:decoration-slate-200"
                rel="noopener noreferrer"
                target="_blank"
              >
                W3C Accessibility Guidelines (WCAG) 3.0, W3C Working Draft 10 September 2026
              </a>
            </p>
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
                  <CardTitle className="text-lg">Reporting Tiers, Not Levels</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    No more A/AA/AAA. Conformance is one bar: meet every core requirement. Six cumulative reporting tiers then describe where you are, from avoiding physical harm up through Bronze, Silver, and Gold.
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
