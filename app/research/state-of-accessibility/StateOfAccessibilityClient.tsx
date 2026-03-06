"use client"

import { useMemo } from "react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Globe,
  AlertTriangle,
  BarChart3,
  CheckCircle,
  Download,
  Share2,
  TrendingDown,
  ExternalLink,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { StatCard } from "@/components/research/stat-card"
import { ChartSection } from "@/components/research/chart-section"
import { MethodologySection } from "@/components/research/methodology-section"
import { EmbeddableWidget } from "@/components/research/embeddable-widget"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AccessibilityData {
  lastUpdated: string
  sources: { name: string; url: string; year: number }[]
  keyFindings: {
    totalSitesAnalyzed: number
    percentWithErrors: number
    averageErrorsPerPage: number
    averageAccessibilityScore: number
  }
  topViolations: {
    id: string
    name: string
    percentage: number
    wcagCriteria: string
    severity: string
    description: string
  }[]
  scoreDistribution: { range: string; percentage: number; label: string }[]
  violationsBySeverity: { severity: string; percentage: number; color: string }[]
  yearOverYearTrends: {
    year: number
    percentWithErrors: number
    avgErrorsPerPage: number
  }[]
  industryBreakdown: {
    industry: string
    avgScore: number
    percentWithErrors: number
  }[]
}

interface StateOfAccessibilityClientProps {
  initialData: AccessibilityData
}

// ---------------------------------------------------------------------------
// Constants & Helpers
// ---------------------------------------------------------------------------

const SCORE_COLORS: Record<string, string> = {
  "0-20": "#ef4444",
  "21-40": "#f97316",
  "41-60": "#eab308",
  "61-80": "#3b82f6",
  "81-100": "#22c55e",
}

function severityBadgeClass(severity: string): string {
  const s = severity.toLowerCase()
  if (s === "critical")
    return "bg-red-100 text-red-800 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800"
  if (s === "serious")
    return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950/40 dark:text-orange-300 dark:border-orange-800"
  if (s === "moderate")
    return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950/40 dark:text-yellow-300 dark:border-yellow-800"
  return "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
}

function industryScoreColor(score: number): string {
  if (score >= 60) return "#22c55e"
  if (score >= 50) return "#3b82f6"
  if (score >= 40) return "#eab308"
  if (score >= 30) return "#f97316"
  return "#ef4444"
}

function downloadBlobAs(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// ---------------------------------------------------------------------------
// Pie chart custom label
// ---------------------------------------------------------------------------

const RADIAN = Math.PI / 180

function renderPieLabel({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: {
  cx: number
  cy: number
  midAngle: number
  innerRadius: number
  outerRadius: number
  percent: number
}) {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)
  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={12}
      fontWeight={600}
    >
      {`${(percent * 100).toFixed(1)}%`}
    </text>
  )
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function StateOfAccessibilityClient({
  initialData,
}: StateOfAccessibilityClientProps) {
  const data = initialData

  // Good Score (80+) percentage
  const goodScorePercentage = useMemo(() => {
    const entry = data.scoreDistribution.find((d) => d.range === "81-100")
    return entry ? entry.percentage : 0
  }, [data.scoreDistribution])

  // Sort violations descending by percentage for chart display
  const sortedViolations = useMemo(
    () => [...data.topViolations].sort((a, b) => b.percentage - a.percentage),
    [data.topViolations]
  )

  // Sort industries ascending by avgScore for chart display
  const sortedIndustries = useMemo(
    () => [...data.industryBreakdown].sort((a, b) => a.avgScore - b.avgScore),
    [data.industryBreakdown]
  )

  // Methodology data sources with descriptions
  const methodologyDataSources = useMemo(
    () =>
      data.sources.map((s) => ({
        name: `${s.name} (${s.year})`,
        url: s.url,
        description: `Data from ${s.name} ${s.year} analysis`,
      })),
    [data.sources]
  )

  // APA citation
  const apaCitation = `Accessibility.build Research Team. (${new Date().getFullYear()}). State of Web Accessibility 2026. Accessibility.build. https://accessibility.build/research/state-of-accessibility`

  // -----------------------------------------------------------------------
  // Download CSV
  // -----------------------------------------------------------------------

  const handleDownloadCSV = () => {
    const sections: string[] = []

    sections.push("KEY FINDINGS")
    sections.push("Metric,Value")
    sections.push(`Total Sites Analyzed,${data.keyFindings.totalSitesAnalyzed}`)
    sections.push(`Percent With Errors,${data.keyFindings.percentWithErrors}%`)
    sections.push(`Average Errors Per Page,${data.keyFindings.averageErrorsPerPage}`)
    sections.push(`Average Accessibility Score,${data.keyFindings.averageAccessibilityScore}`)
    sections.push("")

    sections.push("TOP VIOLATIONS")
    sections.push("Rank,Violation,WCAG Criteria,Severity,Percentage")
    sortedViolations.forEach((v, i) => {
      sections.push(`${i + 1},"${v.name}",${v.wcagCriteria},${v.severity},${v.percentage}%`)
    })
    sections.push("")

    sections.push("SCORE DISTRIBUTION")
    sections.push("Range,Label,Percentage")
    data.scoreDistribution.forEach((s) => {
      sections.push(`${s.range},${s.label},${s.percentage}%`)
    })
    sections.push("")

    sections.push("VIOLATIONS BY SEVERITY")
    sections.push("Severity,Percentage")
    data.violationsBySeverity.forEach((v) => {
      sections.push(`${v.severity},${v.percentage}%`)
    })
    sections.push("")

    sections.push("YEAR-OVER-YEAR TRENDS")
    sections.push("Year,Percent With Errors,Avg Errors Per Page")
    data.yearOverYearTrends.forEach((t) => {
      sections.push(`${t.year},${t.percentWithErrors}%,${t.avgErrorsPerPage}`)
    })
    sections.push("")

    sections.push("INDUSTRY BREAKDOWN")
    sections.push("Industry,Avg Score,Percent With Errors")
    data.industryBreakdown.forEach((ind) => {
      sections.push(`${ind.industry},${ind.avgScore},${ind.percentWithErrors}%`)
    })

    const blob = new Blob([sections.join("\n")], { type: "text/csv;charset=utf-8;" })
    downloadBlobAs(blob, "state-of-web-accessibility-2026.csv")
  }

  // -----------------------------------------------------------------------
  // Download PDF
  // -----------------------------------------------------------------------

  const handleDownloadPDF = () => {
    const doc = new jsPDF()

    // Title
    doc.setFontSize(20)
    doc.text("State of Web Accessibility 2026", 14, 22)
    doc.setFontSize(10)
    doc.setTextColor(100)
    doc.text("Data-driven analysis of web accessibility | accessibility.build", 14, 30)
    doc.text(`Last Updated: ${data.lastUpdated}`, 14, 36)

    // Key Findings
    doc.setTextColor(0)
    doc.setFontSize(14)
    doc.text("Key Findings", 14, 48)

    autoTable(doc, {
      startY: 52,
      head: [["Metric", "Value"]],
      body: [
        ["Total Sites Analyzed", data.keyFindings.totalSitesAnalyzed.toLocaleString()],
        ["Sites With Errors", `${data.keyFindings.percentWithErrors}%`],
        ["Average Errors Per Page", `${data.keyFindings.averageErrorsPerPage}`],
        ["Average Accessibility Score", `${data.keyFindings.averageAccessibilityScore}/100`],
      ],
      theme: "grid",
      headStyles: { fillColor: [59, 130, 246] },
    })

    // Top Violations
    const afterKeyFindings = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable?.finalY ?? 90
    doc.setFontSize(14)
    doc.setTextColor(0)
    doc.text("Top 10 Violations", 14, afterKeyFindings + 12)

    autoTable(doc, {
      startY: afterKeyFindings + 16,
      head: [["#", "Violation", "WCAG", "Severity", "% of Sites"]],
      body: sortedViolations.map((v, i) => [
        `${i + 1}`,
        v.name,
        v.wcagCriteria,
        v.severity,
        `${v.percentage}%`,
      ]),
      theme: "grid",
      headStyles: { fillColor: [59, 130, 246] },
    })

    // Industry Breakdown on next page
    const afterViolations = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable?.finalY ?? 180
    if (afterViolations > 240) doc.addPage()
    const industryY = afterViolations > 240 ? 20 : afterViolations + 12

    doc.setFontSize(14)
    doc.setTextColor(0)
    doc.text("Industry Breakdown", 14, industryY)

    autoTable(doc, {
      startY: industryY + 4,
      head: [["Industry", "Avg Score", "% With Errors"]],
      body: sortedIndustries.map((ind) => [
        ind.industry,
        `${ind.avgScore}`,
        `${ind.percentWithErrors}%`,
      ]),
      theme: "grid",
      headStyles: { fillColor: [59, 130, 246] },
    })

    // Year-over-Year Trends
    const afterIndustry = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable?.finalY ?? 220
    if (afterIndustry > 240) doc.addPage()
    const trendsY = afterIndustry > 240 ? 20 : afterIndustry + 12

    doc.setFontSize(14)
    doc.setTextColor(0)
    doc.text("Year-over-Year Trends", 14, trendsY)

    autoTable(doc, {
      startY: trendsY + 4,
      head: [["Year", "% With Errors", "Avg Errors/Page"]],
      body: data.yearOverYearTrends.map((t) => [
        `${t.year}`,
        `${t.percentWithErrors}%`,
        `${t.avgErrorsPerPage}`,
      ]),
      theme: "grid",
      headStyles: { fillColor: [59, 130, 246] },
    })

    // Footer on all pages
    const pageCount = doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.setTextColor(150)
      doc.text(
        `State of Web Accessibility 2026 - accessibility.build | Page ${i} of ${pageCount}`,
        14,
        doc.internal.pageSize.height - 10
      )
    }

    doc.save("state-of-web-accessibility-2026.pdf")
  }

  // -----------------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------------

  return (
    <div className="space-y-12">
      {/* ================================================================= */}
      {/* Section 1: Key Findings */}
      {/* ================================================================= */}
      <section aria-labelledby="key-findings-heading">
        <h2
          id="key-findings-heading"
          className="text-2xl font-bold text-slate-900 dark:text-white mb-6"
        >
          Key Findings
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <StatCard
            value={data.keyFindings.totalSitesAnalyzed.toLocaleString()}
            label="Sites Analyzed"
            icon={Globe}
            source="WebAIM Million 2025"
          />
          <StatCard
            value={`${data.keyFindings.percentWithErrors}%`}
            label="With Detectable Errors"
            icon={AlertTriangle}
            trend={{
              direction: "down",
              percentage: 0.4,
              label: "year-over-year",
            }}
            source="WebAIM Million 2025"
          />
          <StatCard
            value={`${data.keyFindings.averageErrorsPerPage}`}
            label="Avg Errors Per Page"
            icon={BarChart3}
            source="WebAIM Million 2025"
          />
          <StatCard
            value={`${goodScorePercentage}%`}
            label="Good Score (80+)"
            icon={CheckCircle}
            source="HTTP Archive / WebAIM 2025"
          />
        </div>
      </section>

      {/* ================================================================= */}
      {/* Section 2: Top 10 Violations */}
      {/* ================================================================= */}
      <section aria-labelledby="violations-heading">
        <ChartSection
          title="Top 10 WCAG Violations"
          description="Most common accessibility errors found across the top 1 million websites"
          source="WebAIM Million"
          sourceUrl="https://webaim.org/projects/million/"
          downloadData={{
            filename: "top-violations",
            data: sortedViolations.map((v, i) => ({
              Rank: i + 1,
              Violation: v.name,
              WCAG: v.wcagCriteria,
              Severity: v.severity,
              "Percentage of Sites": v.percentage,
            })),
          }}
        >
          {/* Horizontal Bar Chart */}
          <div
            className="h-[400px] md:h-[480px]"
            role="img"
            aria-label="Horizontal bar chart showing top 10 WCAG violations by percentage of affected sites"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sortedViolations}
                layout="vertical"
                margin={{ top: 5, right: 40, left: 0, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  className="stroke-slate-200 dark:stroke-slate-700"
                />
                <XAxis
                  type="number"
                  className="text-xs"
                  tick={{ fill: "currentColor" }}
                  tickFormatter={(value) => `${value}%`}
                  domain={[0, 100]}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={170}
                  className="text-xs"
                  tick={{ fill: "currentColor" }}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload || payload.length === 0) return null
                    return (
                      <div className="rounded-lg border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 px-3 py-2 shadow-lg text-sm">
                        <p className="font-medium text-slate-900 dark:text-white mb-1">
                          {label}
                        </p>
                        <p className="text-slate-600 dark:text-slate-300">
                          Affected Sites: {payload[0].value}%
                        </p>
                      </div>
                    )
                  }}
                />
                <Bar dataKey="percentage" radius={[0, 4, 4, 0]} fill="#3b82f6">
                  {sortedViolations.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill="#3b82f6" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Violations Table */}
          <div className="mt-8 overflow-x-auto">
            <table className="w-full text-sm" role="table">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th
                    scope="col"
                    className="text-left py-3 px-3 font-semibold text-slate-600 dark:text-slate-300"
                  >
                    Rank
                  </th>
                  <th
                    scope="col"
                    className="text-left py-3 px-3 font-semibold text-slate-600 dark:text-slate-300"
                  >
                    Violation
                  </th>
                  <th
                    scope="col"
                    className="text-left py-3 px-3 font-semibold text-slate-600 dark:text-slate-300"
                  >
                    WCAG
                  </th>
                  <th
                    scope="col"
                    className="text-left py-3 px-3 font-semibold text-slate-600 dark:text-slate-300"
                  >
                    Severity
                  </th>
                  <th
                    scope="col"
                    className="text-right py-3 px-3 font-semibold text-slate-600 dark:text-slate-300"
                  >
                    % of Sites
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedViolations.map((v, i) => (
                  <tr
                    key={v.id}
                    className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="py-3 px-3 text-slate-500 dark:text-slate-400 font-mono">
                      {i + 1}
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-900 dark:text-white">
                      {v.name}
                    </td>
                    <td className="py-3 px-3">
                      <Badge variant="outline" className="font-mono text-xs">
                        {v.wcagCriteria}
                      </Badge>
                    </td>
                    <td className="py-3 px-3">
                      <Badge
                        variant="outline"
                        className={cn("capitalize", severityBadgeClass(v.severity))}
                      >
                        {v.severity}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <div className="hidden sm:block w-20 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 dark:bg-blue-400 rounded-full"
                            style={{ width: `${v.percentage}%` }}
                          />
                        </div>
                        <span className="font-semibold text-slate-900 dark:text-white tabular-nums">
                          {v.percentage}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartSection>
      </section>

      {/* ================================================================= */}
      {/* Section 3: Score Distribution */}
      {/* ================================================================= */}
      <section aria-labelledby="score-distribution-heading">
        <ChartSection
          title="Accessibility Score Distribution"
          description="Distribution of Lighthouse accessibility scores across analyzed websites"
          source="HTTP Archive"
          sourceUrl="https://almanac.httparchive.org/en/2024/accessibility"
          downloadData={{
            filename: "score-distribution",
            data: data.scoreDistribution.map((s) => ({
              Range: s.range,
              Label: s.label,
              Percentage: s.percentage,
            })),
          }}
        >
          <div
            className="h-[350px] md:h-[400px]"
            role="img"
            aria-label="Bar chart histogram showing accessibility score distribution from 0 to 100"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.scoreDistribution}
                margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-slate-200 dark:stroke-slate-700"
                />
                <XAxis
                  dataKey="range"
                  className="text-xs"
                  tick={{ fill: "currentColor" }}
                />
                <YAxis
                  className="text-xs"
                  tick={{ fill: "currentColor" }}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload || payload.length === 0) return null
                    return (
                      <div className="rounded-lg border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 px-3 py-2 shadow-lg text-sm">
                        <p className="font-medium text-slate-900 dark:text-white mb-1">
                          Score: {label}
                        </p>
                        <p className="text-slate-600 dark:text-slate-300">
                          Sites: {payload[0].value}%
                        </p>
                      </div>
                    )
                  }}
                />
                <Bar
                  dataKey="percentage"
                  radius={[4, 4, 0, 0]}
                  label={{
                    position: "top",
                    formatter: (value: number) => `${value}%`,
                    fill: "currentColor",
                    fontSize: 12,
                  }}
                >
                  {data.scoreDistribution.map((entry) => (
                    <Cell
                      key={entry.range}
                      fill={SCORE_COLORS[entry.range] || "#3b82f6"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Color legend */}
          <div className="mt-4 flex flex-wrap gap-3 justify-center">
            {data.scoreDistribution.map((s) => (
              <div key={s.range} className="flex items-center gap-2 text-sm">
                <div
                  className="h-3 w-3 rounded-sm"
                  style={{ backgroundColor: SCORE_COLORS[s.range] }}
                />
                <span className="text-slate-600 dark:text-slate-400">
                  {s.range}: {s.label}
                </span>
              </div>
            ))}
          </div>
        </ChartSection>
      </section>

      {/* ================================================================= */}
      {/* Section 4: Violations by Severity */}
      {/* ================================================================= */}
      <section aria-labelledby="severity-heading">
        <ChartSection
          title="Violations by Severity"
          description="Breakdown of all detected violations by their severity level"
          source="WebAIM Million / HTTP Archive"
          downloadData={{
            filename: "violations-by-severity",
            data: data.violationsBySeverity.map((v) => ({
              Severity: v.severity,
              Percentage: v.percentage,
            })),
          }}
        >
          <div
            className="h-[350px] md:h-[400px]"
            role="img"
            aria-label="Pie chart showing violation breakdown by severity: Critical, Serious, Moderate, and Minor"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.violationsBySeverity}
                  dataKey="percentage"
                  nameKey="severity"
                  cx="50%"
                  cy="50%"
                  outerRadius={140}
                  labelLine={false}
                  label={renderPieLabel}
                  strokeWidth={2}
                  stroke="white"
                >
                  {data.violationsBySeverity.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload || payload.length === 0) return null
                    const item = payload[0].payload as {
                      severity: string
                      percentage: number
                      color: string
                    }
                    return (
                      <div className="rounded-lg border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 px-3 py-2 shadow-lg text-sm">
                        <p className="font-medium text-slate-900 dark:text-white">
                          {item.severity}
                        </p>
                        <p className="text-slate-600 dark:text-slate-300">
                          {item.percentage}% of all violations
                        </p>
                      </div>
                    )
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  formatter={(value) => (
                    <span className="text-sm text-slate-700 dark:text-slate-300">
                      {value}
                    </span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartSection>
      </section>

      {/* ================================================================= */}
      {/* Section 5: Year-over-Year Trends */}
      {/* ================================================================= */}
      <section aria-labelledby="trends-heading">
        <ChartSection
          title="Year-over-Year Trends"
          description="How web accessibility metrics have changed from 2019 to 2025"
          source="WebAIM Million"
          sourceUrl="https://webaim.org/projects/million/"
          downloadData={{
            filename: "year-over-year-trends",
            data: data.yearOverYearTrends.map((t) => ({
              Year: t.year,
              "Percent With Errors": t.percentWithErrors,
              "Avg Errors Per Page": t.avgErrorsPerPage,
            })),
          }}
        >
          <div
            className="h-[350px] md:h-[420px]"
            role="img"
            aria-label="Line chart showing year-over-year trends for percentage of sites with errors and average errors per page"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data.yearOverYearTrends}
                margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-slate-200 dark:stroke-slate-700"
                />
                <XAxis
                  dataKey="year"
                  className="text-xs"
                  tick={{ fill: "currentColor" }}
                />
                <YAxis
                  yAxisId="left"
                  className="text-xs"
                  tick={{ fill: "currentColor" }}
                  tickFormatter={(value) => `${value}%`}
                  domain={[92, 100]}
                  label={{
                    value: "% With Errors",
                    angle: -90,
                    position: "insideLeft",
                    style: { fill: "currentColor", fontSize: 11 },
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  className="text-xs"
                  tick={{ fill: "currentColor" }}
                  domain={[40, 70]}
                  label={{
                    value: "Avg Errors/Page",
                    angle: 90,
                    position: "insideRight",
                    style: { fill: "currentColor", fontSize: 11 },
                  }}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload || payload.length === 0) return null
                    return (
                      <div className="rounded-lg border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 px-3 py-2 shadow-lg text-sm">
                        <p className="font-medium text-slate-900 dark:text-white mb-1">
                          {label}
                        </p>
                        {payload.map((entry, i) => (
                          <p
                            key={i}
                            className="text-slate-600 dark:text-slate-300 flex items-center gap-2"
                          >
                            <span
                              className="inline-block h-2.5 w-2.5 rounded-full"
                              style={{ backgroundColor: entry.color as string }}
                            />
                            <span>
                              {entry.name === "percentWithErrors"
                                ? "Sites With Errors"
                                : "Avg Errors/Page"}
                              :{" "}
                              {entry.name === "percentWithErrors"
                                ? `${entry.value}%`
                                : entry.value}
                            </span>
                          </p>
                        ))}
                      </div>
                    )
                  }}
                />
                <Legend
                  formatter={(value) => {
                    if (value === "percentWithErrors") return "Sites With Errors (%)"
                    if (value === "avgErrorsPerPage") return "Avg Errors Per Page"
                    return value
                  }}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="percentWithErrors"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  dot={{ fill: "#3b82f6", strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7, strokeWidth: 2 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="avgErrorsPerPage"
                  stroke="#f97316"
                  strokeWidth={2.5}
                  dot={{ fill: "#f97316", strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7, strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartSection>
      </section>

      {/* ================================================================= */}
      {/* Section 6: Industry Breakdown */}
      {/* ================================================================= */}
      <section aria-labelledby="industry-heading">
        <ChartSection
          title="Accessibility by Industry"
          description="Average accessibility scores across different industry sectors, sorted from lowest to highest"
          source="HTTP Archive / WebAIM"
          downloadData={{
            filename: "industry-breakdown",
            data: sortedIndustries.map((ind) => ({
              Industry: ind.industry,
              "Avg Score": ind.avgScore,
              "Percent With Errors": ind.percentWithErrors,
            })),
          }}
        >
          <div
            className="h-[380px] md:h-[440px]"
            role="img"
            aria-label="Horizontal bar chart showing average accessibility score by industry"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sortedIndustries}
                layout="vertical"
                margin={{ top: 5, right: 40, left: 0, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  className="stroke-slate-200 dark:stroke-slate-700"
                />
                <XAxis
                  type="number"
                  className="text-xs"
                  tick={{ fill: "currentColor" }}
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}`}
                />
                <YAxis
                  dataKey="industry"
                  type="category"
                  width={110}
                  className="text-xs"
                  tick={{ fill: "currentColor" }}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (!active || !payload || payload.length === 0) return null
                    const entry = payload[0]?.payload as {
                      industry: string
                      avgScore: number
                      percentWithErrors: number
                    }
                    return (
                      <div className="rounded-lg border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 px-3 py-2 shadow-lg text-sm">
                        <p className="font-medium text-slate-900 dark:text-white mb-1">
                          {label}
                        </p>
                        <p className="text-slate-600 dark:text-slate-300">
                          Avg Score: {entry.avgScore}/100
                        </p>
                        <p className="text-slate-600 dark:text-slate-300">
                          With Errors: {entry.percentWithErrors}%
                        </p>
                      </div>
                    )
                  }}
                />
                <Bar
                  dataKey="avgScore"
                  radius={[0, 4, 4, 0]}
                  label={{
                    position: "right",
                    formatter: (value: number) => `${value}`,
                    fill: "currentColor",
                    fontSize: 12,
                  }}
                >
                  {sortedIndustries.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={industryScoreColor(entry.avgScore)}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartSection>
      </section>

      {/* ================================================================= */}
      {/* Section 7: Methodology */}
      {/* ================================================================= */}
      <section aria-labelledby="methodology-section-heading">
        <h2 id="methodology-section-heading" className="sr-only">
          Methodology
        </h2>
        <MethodologySection
          dataSources={methodologyDataSources}
          sampleSize="1,000,000 websites"
          dateRange="February 2025 (WebAIM Million 2025 analysis period)"
          limitations={[
            "Automated testing only catches approximately 30-50% of WCAG issues",
            "Results reflect homepage testing only, not full site audits",
            "Data is aggregated from multiple public sources with varying methodologies",
            "Scores are approximate and for comparative purposes",
          ]}
          lastUpdated={data.lastUpdated}
        />
      </section>

      {/* ================================================================= */}
      {/* Section 8: Download, Share & Cite */}
      {/* ================================================================= */}
      <section aria-labelledby="download-share-heading">
        <h2
          id="download-share-heading"
          className="text-2xl font-bold text-slate-900 dark:text-white mb-6"
        >
          Download & Share
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Download Buttons */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Download className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Download Report Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                Download the full dataset in your preferred format for offline
                analysis or presentations.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  onClick={handleDownloadCSV}
                  className="hover:bg-blue-50 dark:hover:bg-blue-950/30"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download CSV
                </Button>
                <Button
                  variant="outline"
                  onClick={handleDownloadPDF}
                  className="hover:bg-blue-50 dark:hover:bg-blue-950/30"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Cite This Report */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <ExternalLink className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Cite This Report
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                APA format citation for academic and professional use:
              </p>
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <p className="text-sm text-slate-700 dark:text-slate-300 font-mono leading-relaxed break-all">
                  {apaCitation}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => {
                  navigator.clipboard.writeText(apaCitation).catch(() => {
                    const textarea = document.createElement("textarea")
                    textarea.value = apaCitation
                    document.body.appendChild(textarea)
                    textarea.select()
                    document.execCommand("copy")
                    document.body.removeChild(textarea)
                  })
                }}
              >
                Copy Citation
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Embeddable Widget */}
        <div className="mt-6">
          <EmbeddableWidget
            title="State of Web Accessibility 2026"
            description="Embed this report's key statistics on your website or blog"
            url="https://accessibility.build/research/state-of-accessibility"
            stat={{
              value: `${data.keyFindings.percentWithErrors}%`,
              label: "of sites have accessibility errors",
            }}
          />
        </div>
      </section>
    </div>
  )
}
