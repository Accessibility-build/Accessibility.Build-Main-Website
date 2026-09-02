import type { Metadata } from "next"
import Link from "next/link"
import { BreadcrumbStructuredData } from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BarChart3, Scale, ArrowRight, TrendingUp, CalendarDays, BookOpen, Globe, Boxes, Building2, Landmark, Users, Banknote, FileCheck2 } from "lucide-react"
import { createMetadata } from "@/lib/metadata"
import agentReadiness from "@/lib/data/agent-readiness-2026.json"
import statementsStudy from "@/lib/data/accessibility-statements-2026.json"

export const metadata: Metadata = {
  ...createMetadata({
    title: "Accessibility Research & Data Reports",
    path: "/research",
    description:
      "Accessibility research synthesis, source-linked data reports, lawsuit tracking, and jurisdiction analysis with interactive charts and documented references.",
    keywords: [
      "accessibility research",
      "web accessibility data",
      "accessibility statistics",
      "accessibility reports",
      "digital accessibility research",
      "wcag compliance data",
    ],
    type: "website",
  }),
}

const researchReports = [
  {
    title: "Can an AI Agent Use Your Website?",
    description:
      "We took the accessibility-tree view a browser-use agent receives of FTSE 100 and UK council home pages and counted the controls it cannot name, the images without alt text and the unlabelled fields. Per-site results and method published.",
    icon: BarChart3,
    badge: "Original measurement",
    badgeColor:
      "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800",
    href: "/research/ai-agent-readiness",
    stat: { label: "Home pages measured", value: String(agentReadiness.groups.ftse100.measured + agentReadiness.groups.councils.measured) },
    gradient: "from-rose-600 to-pink-600",
  },
  {
    title: "State of Accessibility Statements 2026",
    description:
      "Our statement checker run over every UK local authority and the FTSE 100: who publishes a statement, how many carry every mandatory element, and which elements are most often missing.",
    icon: BarChart3,
    badge: "Original measurement",
    badgeColor:
      "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800",
    href: "/research/accessibility-statements-2026",
    stat: { label: "Organisations checked", value: String(statementsStudy.groups.councils.checked + statementsStudy.groups.ftse100.checked) },
    gradient: "from-fuchsia-600 to-rose-600",
  },
  {
    title: "Web Accessibility Statistics 2026",
    description:
      "Every figure that gets asked for, on one page: disability prevalence, WebAIM Million failure rates, screen reader use, lawsuit counts, public sector monitoring, audit prices and salaries. Each number dated, sourced and written to stand on its own.",
    icon: BarChart3,
    badge: "Updated monthly",
    badgeColor:
      "bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/20 dark:text-teal-400 dark:border-teal-800",
    href: "/research/web-accessibility-statistics",
    stat: { label: "Sourced figures", value: "50+" },
    gradient: "from-teal-600 to-emerald-600",
  },
  {
    title: "Accessibility Testing Tools Benchmark",
    description:
      "axe-core, Lighthouse, HTML_CodeSniffer and IBM Equal Access run against one page seeded with thirty known WCAG defects. Which tool finds what, which defects nobody finds, and what a Lighthouse score of 49 means.",
    icon: BarChart3,
    badge: "Original test",
    badgeColor:
      "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
    href: "/research/accessibility-testing-tools-benchmark",
    stat: { label: "Seeded defects found by all four", value: "12 of 30" },
    gradient: "from-amber-600 to-orange-600",
  },
  {
    title: "State of Web Accessibility",
    description:
      "A source-linked synthesis of large-scale third-party web accessibility datasets. Explore reported failure rates, recurring barriers, and year-over-year trends with clear attribution.",
    icon: BarChart3,
    badge: "Annual Report",
    badgeColor:
      "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
    href: "/research/state-of-accessibility",
    stat: { label: "Dataset coverage", value: "Up to 1M" },
    gradient: "from-blue-600 to-indigo-600",
  },
  {
    title: "US Disability Prevalence",
    description:
      "28.7% of US adults report a disability, about 73.4 million people. Prevalence by type plus the 2016 to 2022 trend, straight from the CDC data API. Cognitive disability is now the largest category and the fastest growing, which is not where most accessibility effort goes.",
    icon: Users,
    badge: "New 2026",
    badgeColor:
      "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800",
    href: "/research/disability-statistics",
    stat: { label: "Of US adults", value: "28.7%" },
    gradient: "from-rose-600 to-pink-600",
  },
  {
    title: "Section 508 Federal Scorecard",
    description:
      "58% of US federal agencies scored Low or Very Low on whether their technology is actually accessible, and 62% scored that low on testing. Every one of the 60 agencies ranked, computed from the government's own published response data.",
    icon: Landmark,
    badge: "FY2025 data",
    badgeColor:
      "bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-900/20 dark:text-sky-400 dark:border-sky-800",
    href: "/research/section-508-assessment",
    stat: { label: "Agencies scored", value: "60" },
    gradient: "from-sky-600 to-blue-700",
  },
  {
    title: "Digital Accessibility Salary Report",
    description:
      "What accessibility professionals earn by country, experience, work location, and organisation size. The dividing line is ten years of experience, worth a 36% premium. 60.7% of respondents report having a disability themselves.",
    icon: Banknote,
    badge: "New 2026",
    badgeColor:
      "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
    href: "/research/accessibility-salary",
    stat: { label: "Average full-time", value: "$101,688" },
    gradient: "from-emerald-600 to-teal-600",
  },
  {
    title: "European Accessibility Act Tracker",
    description:
      "Every EAA date quoted from Directive (EU) 2019/882 itself, plus transposition measures for all 27 Member States. Includes the answer nobody else gives straight: there is no EU-wide enforcement data, and the first Commission report is not due until 2030.",
    icon: FileCheck2,
    badge: "New 2026",
    badgeColor:
      "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800",
    href: "/research/european-accessibility-act",
    stat: { label: "Member States", value: "27 of 27" },
    gradient: "from-indigo-600 to-violet-600",
  },
  {
    title: "Accessibility by Technology Stack",
    description:
      "Which CMS, JavaScript framework, and platform ships the fewest accessibility errors? WordPress, Drupal, React, Vue, Shopify, Bootstrap and 40 more, ranked against the million-page average. The finding that matters: almost every popular widget library correlates with more errors, not fewer.",
    icon: Boxes,
    badge: "New 2026",
    badgeColor:
      "bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/20 dark:text-teal-400 dark:border-teal-800",
    href: "/research/accessibility-by-technology",
    stat: { label: "Technologies compared", value: "46" },
    gradient: "from-teal-600 to-cyan-600",
  },
  {
    title: "Accessibility by Industry",
    description:
      "Government, non-profit and education lead; shopping and sport trail by roughly 29 errors per page. Average detected errors across 29 sectors and 17 languages, with the sectors that have been legally obliged the longest sitting at the top of the table.",
    icon: Building2,
    badge: "New 2026",
    badgeColor:
      "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800",
    href: "/research/accessibility-by-industry",
    stat: { label: "Sectors ranked", value: "29" },
    gradient: "from-purple-600 to-fuchsia-600",
  },
  {
    title: "Accessibility Lawsuit Tracker",
    description:
      "Tracking ADA digital accessibility litigation across federal and state courts. 2025 closed at 3,117 federal filings, and industry projections put combined 2026 filings above 6,000. Explore filing trends, the proposed $5.15M Fashion Nova settlement, target industries, and settlement costs.",
    icon: Scale,
    badge: "Updated Aug 2026",
    badgeColor:
      "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
    href: "/research/accessibility-lawsuits",
    stat: { label: "Cases Tracked", value: "25,500+" },
    gradient: "from-amber-600 to-orange-600",
  },
  {
    title: "Accessibility Laws by Jurisdiction",
    description:
      "Global tracker of web accessibility laws, regulations, and standards. Compare WCAG requirements, penalties, enforcement mechanisms, and upcoming compliance deadlines across 35+ jurisdictions worldwide.",
    icon: Globe,
    badge: "New 2026",
    badgeColor:
      "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
    href: "/research/accessibility-laws",
    stat: { label: "Laws Tracked", value: "50+" },
    gradient: "from-green-600 to-emerald-600",
  },
]

export default function ResearchPage() {
  return (
    <div className="min-h-screen">
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "Research", url: "https://accessibility.build/research" },
        ]}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950 border-b border-slate-200 dark:border-slate-800">
        <div className="container-wide pt-12 pb-16 md:pb-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-blue-900 to-blue-700 dark:from-white dark:via-blue-200 dark:to-blue-400 bg-clip-text text-transparent leading-tight">
              Accessibility Research & Reports
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-3xl mx-auto leading-relaxed">
              Original, data-driven research on the state of web accessibility.
              Our reports combine large-scale automated analysis with expert
              review to surface actionable insights for teams building inclusive
              products.
            </p>

            {/* Stats Bar */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                  <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  Data-Driven Insights
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-full">
                  <CalendarDays className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  Updated Annually
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-full">
                  <BookOpen className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  Free & Open
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Research Cards */}
      <section className="container-wide py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {researchReports.map((report) => {
            const Icon = report.icon
            return (
              <Card
                key={report.title}
                className="group relative overflow-hidden border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                {/* Top accent line */}
                <div
                  className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${report.gradient}`}
                />

                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`p-3 bg-gradient-to-r ${report.gradient} rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <Badge className={report.badgeColor}>{report.badge}</Badge>
                  </div>

                  <CardTitle className="text-xl text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {report.title}
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                    {report.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0 space-y-4">
                  {/* Key stat preview */}
                  <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {report.stat.value}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      {report.stat.label}
                    </div>
                  </div>

                  <Button
                    asChild
                    variant="outline"
                    className="w-full group/btn border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/50"
                  >
                    <Link href={report.href}>
                      Read Report
                      <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Citation CTA */}
      <section className="container-wide pb-16 md:pb-20">
        <Card className="max-w-3xl mx-auto bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-blue-200 dark:border-blue-800">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
              Cite Our Research
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4 max-w-2xl mx-auto leading-relaxed">
              Our research is free and open. If you reference our data in your
              own work, please cite{" "}
              <strong className="text-slate-900 dark:text-white">
                Accessibility.build
              </strong>{" "}
              as the source and link back to the original report. Proper
              attribution helps us continue producing independent research for
              the community.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Related Content */}
      <section className="container-wide pb-16 md:pb-20">
        <RelatedContent
          links={[
            {
              url: "/tools",
              title: "Accessibility Testing Tools",
              description:
                "Test your site with our free accessibility scanning tools.",
              type: "tool",
            },
            {
              url: "/checklists",
              title: "WCAG Checklists",
              description:
                "Step-by-step checklists for WCAG 2.2 compliance.",
              type: "checklist",
            },
            {
              url: "/guides",
              title: "Accessibility Guides",
              description:
                "In-depth interactive guides for keyboard and screen reader accessibility.",
              type: "guide",
            },
          ]}
        />
      </section>
    </div>
  )
}
