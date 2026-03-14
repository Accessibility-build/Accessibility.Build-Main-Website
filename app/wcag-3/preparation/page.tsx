"use client"

import Link from "next/link"
import { BreadcrumbStructuredData, ArticleStructuredData, FAQStructuredData } from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  CheckCircle,
  Target,
  Globe,
  BookOpen,
  Rss,
  ArrowRight,
  CheckSquare,
  Code,
  Palette,
  TestTube,
  Briefcase,
  Scale,
} from "lucide-react"

const faqs = [
  {
    question: "Should my organization switch to WCAG 3.0 now?",
    answer:
      "No. WCAG 3.0 is a Working Draft and is not ready for compliance purposes. Focus on achieving and maintaining WCAG 2.2 AA compliance. However, understanding the direction WCAG 3.0 is heading is valuable for long-term strategic planning and ensures your team is not caught off guard when the final recommendation is published.",
  },
  {
    question: "What is the best way to stay updated on WCAG 3.0 progress?",
    answer:
      "Follow the W3C WAI (Web Accessibility Initiative) website for official announcements. Subscribe to the Accessibility Guidelines (AG) Working Group mailing list for detailed discussions. Monitor the WCAG 3.0 Working Draft page at w3.org/TR/wcag-3.0/ for specification updates. You can also join W3C Community Groups focused on accessibility.",
  },
  {
    question: "Will WCAG 3.0 require us to redo our accessibility work?",
    answer:
      "Mostly no. Content that meets WCAG 2.2 Level A and AA is expected to largely satisfy WCAG 3.0's minimum conformance level. The core principles of accessibility remain the same. However, some additional work may be needed around organizational assertions (documented accessibility commitments) and broadened scope covering native apps, documents, and other digital content beyond traditional web pages.",
  },
]

const actionAreas = [
  {
    number: 1,
    title: "Master WCAG 2.2 First",
    icon: CheckCircle,
    color: "emerald",
    gradient: "from-emerald-500 to-emerald-600",
    badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
    description: "The single best preparation for WCAG 3.0",
    points: [
      "Content meeting WCAG 2.2 Level A and AA is expected to meet most of WCAG 3.0's minimum conformance level.",
      "A strong WCAG 2.2 foundation means the transition to WCAG 3.0 will require minimal additional effort.",
      "Use our interactive WCAG 2.2 checklist to audit your current compliance and identify gaps.",
      "Document your existing conformance as a baseline for future WCAG 3.0 assertions.",
    ],
    link: { href: "/checklists/wcag-2-2", label: "Use WCAG 2.2 Interactive Checklist" },
  },
  {
    number: 2,
    title: "Adopt Outcomes-Based Thinking",
    icon: Target,
    color: "blue",
    gradient: "from-blue-500 to-blue-600",
    badgeColor: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
    description: "Shift from technical compliance to real user impact",
    points: [
      "Move from asking \"does this pass the criterion?\" to \"can users actually accomplish their goals?\"",
      "Conduct user testing with people with disabilities to measure real-world accessibility outcomes.",
      "Measure the effectiveness of your accessibility measures, not just whether they technically exist.",
      "Document how users with different functional needs interact with your products and services.",
    ],
  },
  {
    number: 3,
    title: "Broaden Your Scope",
    icon: Globe,
    color: "purple",
    gradient: "from-purple-500 to-purple-600",
    badgeColor: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800",
    description: "WCAG 3.0 goes beyond websites",
    points: [
      "WCAG 3.0 covers native apps, authoring tools, documents, IoT devices, and more — not just websites.",
      "Start auditing your native mobile applications for accessibility alongside your web properties.",
      "Include PDFs, emails, embedded content, and multimedia in your accessibility program.",
      "Consider emerging technologies like VR, AR, and voice interfaces in your accessibility strategy.",
    ],
  },
  {
    number: 4,
    title: "Learn the New Terminology",
    icon: BookOpen,
    color: "indigo",
    gradient: "from-indigo-500 to-indigo-600",
    badgeColor: "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800",
    description: "Get familiar with WCAG 3.0 vocabulary",
    points: [
      "Key new terms include: guidelines, requirements, methods, assertions, functional needs, and outcomes.",
      "Understanding these concepts now will help your team adapt faster when WCAG 3.0 is finalized.",
      "Follow the W3C Working Draft to see how these concepts evolve over time.",
      "Read our detailed concepts guide for clear explanations of each term and how they connect.",
    ],
    link: { href: "/wcag-3/concepts", label: "Explore Key Concepts & Terminology" },
  },
  {
    number: 5,
    title: "Follow the W3C Process",
    icon: Rss,
    color: "teal",
    gradient: "from-teal-500 to-teal-600",
    badgeColor: "bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/30 dark:text-teal-400 dark:border-teal-800",
    description: "Stay informed and contribute to the standard",
    points: [
      "Monitor the Working Draft at w3.org/TR/wcag-3.0/ for updates and changes.",
      "Consider providing public feedback to the Accessibility Guidelines Working Group.",
      "Join accessibility community groups and mailing lists to stay connected with the community.",
      "Attend W3C accessibility events and webinars to hear directly from the people writing the standard.",
    ],
  },
]

const todayChecklist = [
  "Ensure WCAG 2.2 AA compliance on all web properties",
  "Conduct user testing with people with disabilities",
  "Document your accessibility processes and training (preparing for assertions)",
  "Audit content beyond just web pages (apps, PDFs, multimedia)",
  "Subscribe to W3C Accessibility Guidelines Working Group updates",
  "Train your team on accessibility fundamentals",
  "Build accessibility into your design system and CI/CD pipeline",
]

function RoadmapTimelineSVG() {
  return (
    <svg
      viewBox="0 0 700 120"
      className="w-full max-w-3xl mx-auto"
      role="img"
      aria-label="WCAG 3.0 roadmap timeline showing four stages: Now (WCAG 2.2 is current), 2026 (Working Draft published), Future (Candidate Recommendation), and Later (Final Recommendation). The Now stage is highlighted."
    >
      {/* Connection line */}
      <line
        x1="90"
        y1="50"
        x2="620"
        y2="50"
        className="stroke-slate-300 dark:stroke-slate-600"
        strokeWidth="2"
        strokeDasharray="8 4"
      />

      {/* Node 1 — Now (highlighted) */}
      <circle cx="90" cy="50" r="22" className="fill-emerald-500 dark:fill-emerald-600" />
      <circle cx="90" cy="50" r="28" className="fill-none stroke-emerald-400 dark:stroke-emerald-700" strokeWidth="2" strokeDasharray="4 3" opacity="0.6" />
      <circle cx="90" cy="50" r="9" className="fill-white dark:fill-slate-900" />
      <text x="90" y="92" textAnchor="middle" className="fill-emerald-700 dark:fill-emerald-400 text-xs font-bold">Now</text>
      <text x="90" y="108" textAnchor="middle" className="fill-emerald-600 dark:fill-emerald-500 text-[9px]">WCAG 2.2 is Current</text>

      {/* Node 2 — 2026 */}
      <circle cx="270" cy="50" r="14" className="fill-amber-500 dark:fill-amber-600" />
      <circle cx="270" cy="50" r="6" className="fill-white dark:fill-slate-900" />
      <text x="270" y="92" textAnchor="middle" className="fill-slate-600 dark:fill-slate-400 text-xs font-semibold">2026</text>
      <text x="270" y="108" textAnchor="middle" className="fill-slate-400 dark:fill-slate-500 text-[9px]">Working Draft Published</text>

      {/* Node 3 — Future */}
      <circle cx="440" cy="50" r="14" className="fill-slate-400 dark:fill-slate-500" />
      <circle cx="440" cy="50" r="6" className="fill-white dark:fill-slate-900" />
      <text x="440" y="92" textAnchor="middle" className="fill-slate-600 dark:fill-slate-400 text-xs font-semibold">Future</text>
      <text x="440" y="108" textAnchor="middle" className="fill-slate-400 dark:fill-slate-500 text-[9px]">Candidate Recommendation</text>

      {/* Node 4 — Later */}
      <circle cx="620" cy="50" r="14" className="fill-slate-400 dark:fill-slate-500" />
      <circle cx="620" cy="50" r="6" className="fill-white dark:fill-slate-900" />
      <text x="620" y="92" textAnchor="middle" className="fill-slate-600 dark:fill-slate-400 text-xs font-semibold">Later</text>
      <text x="620" y="108" textAnchor="middle" className="fill-slate-400 dark:fill-slate-500 text-[9px]">Final Recommendation</text>
    </svg>
  )
}

export default function WCAG3PreparationPage() {
  return (
    <div className="min-h-screen pt-12">
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "WCAG 3.0 Guide", url: "https://accessibility.build/wcag-3" },
          { name: "How to Prepare", url: "https://accessibility.build/wcag-3/preparation" },
        ]}
      />
      <ArticleStructuredData
        headline="How to Prepare for WCAG 3.0: Practical Steps for Teams and Organizations"
        description="Actionable steps teams can take today to prepare for WCAG 3.0. Covers 5 action areas, team role guidance, and a practical checklist for developers, designers, QA, product managers, and compliance teams."
        author={{ name: "Accessibility.build", url: "https://accessibility.build" }}
        publisher={{ name: "Accessibility.build", logo: "https://accessibility.build/logo.png" }}
        datePublished="2026-03-15T00:00:00Z"
        dateModified="2026-03-15T00:00:00Z"
        image="https://accessibility.build/og-image.png"
        url="https://accessibility.build/wcag-3/preparation"
        wordCount={3500}
        keywords={["prepare for wcag 3.0", "wcag 3.0 preparation", "wcag 3 transition plan", "wcag 3.0 action plan", "how to prepare wcag 3"]}
      />
      <FAQStructuredData faqs={faqs} />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-orange-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-amber-950/20 border-b border-slate-200 dark:border-slate-800">
        <div className="container-wide pb-16 md:pb-24">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-700">
              Preparation Guide
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-amber-800 via-orange-700 to-amber-900 dark:from-amber-200 dark:via-orange-300 dark:to-amber-300 bg-clip-text text-transparent leading-tight">
              How to Prepare for WCAG 3.0
            </h1>

            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-3xl mx-auto leading-relaxed">
              WCAG 3.0 is coming, but it is not here yet. Here are the actionable steps your team can take right now
              to be ready when it arrives — without wasting effort on a moving target.
            </p>

            {/* Stats Bar */}
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 text-sm">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-full">
                  <CheckCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                </div>
                <span className="font-medium text-slate-700 dark:text-slate-300">5 Action Areas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-full">
                  <Briefcase className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                </div>
                <span className="font-medium text-slate-700 dark:text-slate-300">For Teams &amp; Orgs</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-full">
                  <ArrowRight className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="font-medium text-slate-700 dark:text-slate-300">Start Today</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap Timeline */}
      <section className="container-wide py-12 md:py-16">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-3">
            Where We Are in the WCAG 3.0 Journey
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            WCAG 3.0 is still years away from becoming a final standard. Here is the roadmap.
          </p>
        </div>
        <RoadmapTimelineSVG />
      </section>

      {/* 5 Action Areas */}
      <section className="bg-slate-50 dark:bg-slate-900/30 border-y border-slate-200 dark:border-slate-800">
        <div className="container-wide py-16 md:py-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 text-center">
              5 Action Areas to Prepare for WCAG 3.0
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-center mb-12 max-w-2xl mx-auto">
              You do not need to wait for WCAG 3.0 to be finalized. These five areas will prepare your organization
              regardless of how the final standard evolves.
            </p>

            <div className="space-y-8">
              {actionAreas.map((area) => {
                const Icon = area.icon
                return (
                  <Card key={area.number} className="border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${area.gradient}`} />
                    <CardHeader className="pb-3">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 bg-gradient-to-r ${area.gradient} rounded-xl shadow-lg flex-shrink-0`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <Badge className={area.badgeColor}>Step {area.number}</Badge>
                          </div>
                          <CardTitle className="text-xl text-slate-900 dark:text-white">{area.title}</CardTitle>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{area.description}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3 mb-4">
                        {area.points.map((point, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <CheckCircle className="h-5 w-5 text-emerald-500 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{point}</span>
                          </li>
                        ))}
                      </ul>
                      {area.link && (
                        <Link
                          href={area.link.href}
                          className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          {area.link.label} <ArrowRight className="h-4 w-4" />
                        </Link>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* What You Can Do Today */}
      <section className="container-wide py-16 md:py-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 text-center">
            What You Can Do Today
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-center mb-10">
            A practical checklist of actions you can start on immediately — no waiting required.
          </p>

          <Card className="border-slate-200 dark:border-slate-700">
            <CardContent className="pt-6">
              <ul className="space-y-4">
                {todayChecklist.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="p-1 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex-shrink-0 mt-0.5">
                      <CheckSquare className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <span className="text-slate-700 dark:text-slate-300 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Team Roles Section */}
      <section className="bg-slate-50 dark:bg-slate-900/30 border-y border-slate-200 dark:border-slate-800">
        <div className="container-wide py-16 md:py-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 text-center">
              Preparation by Team Role
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-center mb-10 max-w-2xl mx-auto">
              Every role in your organization has a part to play. Here is what each team should focus on.
            </p>

            <Tabs defaultValue="developers" className="w-full">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 h-auto gap-1 bg-slate-100 dark:bg-slate-800/60 p-1 rounded-xl">
                <TabsTrigger value="developers" className="flex items-center gap-1.5 text-xs sm:text-sm data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
                  <Code className="h-4 w-4" />
                  <span className="hidden sm:inline">Developers</span>
                  <span className="sm:hidden">Dev</span>
                </TabsTrigger>
                <TabsTrigger value="designers" className="flex items-center gap-1.5 text-xs sm:text-sm data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
                  <Palette className="h-4 w-4" />
                  <span className="hidden sm:inline">Designers</span>
                  <span className="sm:hidden">Design</span>
                </TabsTrigger>
                <TabsTrigger value="qa" className="flex items-center gap-1.5 text-xs sm:text-sm data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
                  <TestTube className="h-4 w-4" />
                  <span className="hidden sm:inline">QA/Testers</span>
                  <span className="sm:hidden">QA</span>
                </TabsTrigger>
                <TabsTrigger value="product" className="flex items-center gap-1.5 text-xs sm:text-sm data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
                  <Briefcase className="h-4 w-4" />
                  <span className="hidden sm:inline">Product</span>
                  <span className="sm:hidden">PM</span>
                </TabsTrigger>
                <TabsTrigger value="legal" className="flex items-center gap-1.5 text-xs sm:text-sm data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
                  <Scale className="h-4 w-4" />
                  <span className="hidden sm:inline">Legal</span>
                  <span className="sm:hidden">Legal</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="developers" className="mt-6">
                <Card className="border-slate-200 dark:border-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-lg text-slate-900 dark:text-white">
                      <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                        <Code className="h-5 w-5 text-white" />
                      </div>
                      Developers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-blue-500 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                          Focus on semantic HTML, correct ARIA patterns, keyboard navigation, and automated testing in CI/CD pipelines.
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-blue-500 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                          Start writing more descriptive test assertions that measure user outcomes, not just DOM state.
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-blue-500 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                          Build accessibility checks into pull request workflows and component libraries.
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-blue-500 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                          Learn screen reader testing basics — automated tools catch only about 30% of accessibility issues.
                        </span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="designers" className="mt-6">
                <Card className="border-slate-200 dark:border-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-lg text-slate-900 dark:text-white">
                      <div className="p-2 bg-gradient-to-r from-pink-500 to-rose-600 rounded-lg">
                        <Palette className="h-5 w-5 text-white" />
                      </div>
                      Designers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-pink-500 dark:text-pink-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                          Design for functional needs, not just visual aesthetics. Consider how users with different abilities interact with your designs.
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-pink-500 dark:text-pink-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                          Create inclusive design patterns that work across input methods (mouse, keyboard, touch, voice).
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-pink-500 dark:text-pink-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                          Consider motion sensitivity, cognitive load, and reading levels in all design decisions.
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-pink-500 dark:text-pink-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                          Annotate designs with accessibility specifications — focus states, reading order, alt text, and heading hierarchy.
                        </span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="qa" className="mt-6">
                <Card className="border-slate-200 dark:border-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-lg text-slate-900 dark:text-white">
                      <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg">
                        <TestTube className="h-5 w-5 text-white" />
                      </div>
                      QA / Testers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-emerald-500 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                          Move beyond automated-only testing. Automated tools are essential but catch only a fraction of real accessibility barriers.
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-emerald-500 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                          Learn screen reader testing with NVDA, JAWS, and VoiceOver. Test keyboard navigation end-to-end.
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-emerald-500 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                          Document test outcomes that measure user success — not just binary pass/fail results.
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-emerald-500 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                          Build accessibility test plans that cover user journeys, not just individual components.
                        </span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="product" className="mt-6">
                <Card className="border-slate-200 dark:border-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-lg text-slate-900 dark:text-white">
                      <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg">
                        <Briefcase className="h-5 w-5 text-white" />
                      </div>
                      Product Managers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-amber-500 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                          Budget for accessibility from project inception, not as a remediation afterthought.
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-amber-500 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                          Include people with disabilities in user research, usability testing, and beta programs.
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-amber-500 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                          Track accessibility outcomes as product metrics alongside performance and user satisfaction.
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-amber-500 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                          Define accessibility acceptance criteria for every user story and feature request.
                        </span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="legal" className="mt-6">
                <Card className="border-slate-200 dark:border-slate-700">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-lg text-slate-900 dark:text-white">
                      <div className="p-2 bg-gradient-to-r from-violet-500 to-purple-600 rounded-lg">
                        <Scale className="h-5 w-5 text-white" />
                      </div>
                      Legal / Compliance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-violet-500 dark:text-violet-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                          Monitor W3C progress and regulatory updates. No immediate legal changes are expected, but staying informed is essential.
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-violet-500 dark:text-violet-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                          Document current WCAG 2.2 compliance status across all digital properties.
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-violet-500 dark:text-violet-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                          Prepare organizational assertion documentation — WCAG 3.0 will require evidence of accessibility commitments and processes.
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-violet-500 dark:text-violet-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                          Review vendor contracts and procurement policies for accessibility requirements.
                        </span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
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

      {/* CTA Section */}
      <section className="bg-slate-50 dark:bg-slate-900/30 border-y border-slate-200 dark:border-slate-800">
        <div className="container-wide py-16 md:py-20">
          <div className="max-w-3xl mx-auto">
            <Card className="border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-500" />
              <CardContent className="pt-8 pb-8 text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">
                  Start with WCAG 2.2 — the Best Preparation for WCAG 3.0
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-xl mx-auto leading-relaxed">
                  The most effective thing you can do today is ensure your content meets WCAG 2.2 AA.
                  Everything you build toward WCAG 2.2 compliance directly prepares you for WCAG 3.0.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href="/checklists/wcag-2-2"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-medium rounded-lg hover:from-amber-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    WCAG 2.2 Interactive Checklist <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/wcag-3"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium rounded-lg border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all"
                  >
                    Back to WCAG 3.0 Hub <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Related Content */}
      <section className="container-wide py-12 md:py-16">
        <RelatedContent content="WCAG 3.0 preparation accessibility guidelines compliance checklist audit team training" maxItems={3} />
      </section>
    </div>
  )
}
