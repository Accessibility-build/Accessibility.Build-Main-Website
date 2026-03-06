import type { Metadata } from "next"
import Link from "next/link"
import { BreadcrumbStructuredData } from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BarChart3, Scale, ArrowRight, TrendingUp, CalendarDays, BookOpen } from "lucide-react"
import { createMetadata } from "@/lib/metadata"

export const metadata: Metadata = {
  ...createMetadata({
    title: "Accessibility Research & Data Reports | Original Studies & Statistics",
    description:
      "Original research and data-driven reports on web accessibility. Explore our State of Web Accessibility report, lawsuit tracker, and industry analysis with interactive charts.",
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
  alternates: {
    canonical: "https://accessibility.build/research",
  },
}

const researchReports = [
  {
    title: "State of Web Accessibility",
    description:
      "A comprehensive analysis of the top 1,000,000 websites for WCAG 2.2 compliance. Discover failure rates by criterion, industry benchmarks, and year-over-year trends with interactive data visualizations.",
    icon: BarChart3,
    badge: "Annual Report",
    badgeColor:
      "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
    href: "/research/state-of-accessibility",
    stat: { label: "Websites Analyzed", value: "1M+" },
    gradient: "from-blue-600 to-indigo-600",
  },
  {
    title: "Accessibility Lawsuit Tracker",
    description:
      "Tracking ADA digital accessibility litigation data across federal and state courts. Explore filing trends, settlement amounts, target industries, and plaintiff activity with quarterly updates.",
    icon: Scale,
    badge: "Updated 2026",
    badgeColor:
      "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
    href: "/research/accessibility-lawsuits",
    stat: { label: "Cases Tracked", value: "25,500+" },
    gradient: "from-amber-600 to-orange-600",
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
        <div className="container-wide py-16 md:py-24">
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
