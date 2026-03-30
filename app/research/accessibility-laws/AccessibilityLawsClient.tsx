"use client"

import { useState, useMemo } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
  Cell,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Globe,
  MapPin,
  Shield,
  Calendar,
  Download,
  FileText,
  Scale,
  ChevronUp,
  ChevronDown,
  Clock,
  ExternalLink,
  TrendingUp,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { StatCard } from "@/components/research/stat-card"
import { ChartSection } from "@/components/research/chart-section"
import { MethodologySection } from "@/components/research/methodology-section"
import { EmbeddableWidget } from "@/components/research/embeddable-widget"
import {
  accessibilityLaws,
  enforcementTrends,
  upcomingDeadlines,
  lawsSummary,
  stateFilingData,
  penaltyComparisonData,
  wcagVersionGroups,
} from "@/lib/data/accessibility-laws"
import type { AccessibilityLaw } from "@/lib/data/accessibility-laws"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

// ---- Jurisdiction table sort types ----
type LawSortField = "lawName" | "wcagVersion" | "penalties" | "yearEnacted" | "status"
type LawSortDirection = "asc" | "desc"

// ---- State filing table sort types ----
type StateSortField = "rank" | "state" | "filings2025" | "primaryLaw"
type StateSortDirection = "asc" | "desc"

const REGION_TABS = [
  { value: "us-federal", label: "US Federal" },
  { value: "us-state", label: "US States" },
  { value: "eu-uk", label: "EU & UK" },
  { value: "canada", label: "Canada" },
  { value: "asia-pacific", label: "Asia-Pacific" },
] as const

function getRegionLaws(tabValue: string): AccessibilityLaw[] {
  if (tabValue === "eu-uk") {
    return accessibilityLaws.filter((l) => l.region === "eu" || l.region === "uk")
  }
  if (tabValue === "asia-pacific") {
    return accessibilityLaws.filter((l) => l.region === "asia-pacific" || l.region === "other")
  }
  return accessibilityLaws.filter((l) => l.region === tabValue)
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
}

const statusColors: Record<string, string> = {
  active:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800",
  pending:
    "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  proposed:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800",
}

const impactColors: Record<string, string> = {
  critical: "bg-red-500",
  high: "bg-amber-500",
  medium: "bg-blue-500",
}

export function AccessibilityLawsClient() {
  // Jurisdiction table sort state
  const [lawSortField, setLawSortField] = useState<LawSortField>("yearEnacted")
  const [lawSortDirection, setLawSortDirection] = useState<LawSortDirection>("desc")

  // State filing table sort state
  const [stateSortField, setStateSortField] = useState<StateSortField>("rank")
  const [stateSortDirection, setStateSortDirection] = useState<StateSortDirection>("asc")

  // ---- Jurisdiction table sorting ----
  function sortLaws(laws: AccessibilityLaw[]): AccessibilityLaw[] {
    return [...laws].sort((a, b) => {
      let aVal: number | string
      let bVal: number | string

      switch (lawSortField) {
        case "lawName":
          aVal = a.lawName
          bVal = b.lawName
          return lawSortDirection === "asc"
            ? (aVal as string).localeCompare(bVal as string)
            : (bVal as string).localeCompare(aVal as string)
        case "wcagVersion":
          aVal = a.wcagVersion
          bVal = b.wcagVersion
          return lawSortDirection === "asc"
            ? (aVal as string).localeCompare(bVal as string)
            : (bVal as string).localeCompare(aVal as string)
        case "penalties":
          aVal = a.penalties.maxFineNumeric
          bVal = b.penalties.maxFineNumeric
          break
        case "yearEnacted":
          aVal = a.yearEnacted
          bVal = b.yearEnacted
          break
        case "status":
          aVal = a.status
          bVal = b.status
          return lawSortDirection === "asc"
            ? (aVal as string).localeCompare(bVal as string)
            : (bVal as string).localeCompare(aVal as string)
        default:
          aVal = a.yearEnacted
          bVal = b.yearEnacted
      }

      return lawSortDirection === "asc"
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number)
    })
  }

  function handleLawSort(field: LawSortField) {
    if (lawSortField === field) {
      setLawSortDirection(lawSortDirection === "asc" ? "desc" : "asc")
    } else {
      setLawSortField(field)
      setLawSortDirection("desc")
    }
  }

  function LawSortIndicator({ field }: { field: LawSortField }) {
    if (lawSortField !== field) {
      return <ChevronDown className="h-3 w-3 opacity-30" />
    }
    return lawSortDirection === "asc" ? (
      <ChevronUp className="h-3 w-3" />
    ) : (
      <ChevronDown className="h-3 w-3" />
    )
  }

  // ---- State filing table sorting ----
  const sortedStateFilings = useMemo(() => {
    return [...stateFilingData].sort((a, b) => {
      let aVal: number | string
      let bVal: number | string

      switch (stateSortField) {
        case "rank":
          aVal = a.rank
          bVal = b.rank
          break
        case "state":
          aVal = a.state
          bVal = b.state
          return stateSortDirection === "asc"
            ? (aVal as string).localeCompare(bVal as string)
            : (bVal as string).localeCompare(aVal as string)
        case "filings2025":
          aVal = a.filings2025
          bVal = b.filings2025
          break
        case "primaryLaw":
          aVal = a.primaryLaw
          bVal = b.primaryLaw
          return stateSortDirection === "asc"
            ? (aVal as string).localeCompare(bVal as string)
            : (bVal as string).localeCompare(aVal as string)
        default:
          aVal = a.rank
          bVal = b.rank
      }

      return stateSortDirection === "asc"
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number)
    })
  }, [stateSortField, stateSortDirection])

  function handleStateSort(field: StateSortField) {
    if (stateSortField === field) {
      setStateSortDirection(stateSortDirection === "asc" ? "desc" : "asc")
    } else {
      setStateSortField(field)
      setStateSortDirection("desc")
    }
  }

  function StateSortIndicator({ field }: { field: StateSortField }) {
    if (stateSortField !== field) {
      return <ChevronDown className="h-3 w-3 opacity-30" />
    }
    return stateSortDirection === "asc" ? (
      <ChevronUp className="h-3 w-3" />
    ) : (
      <ChevronDown className="h-3 w-3" />
    )
  }

  // ---- Sorted deadlines ----
  const sortedDeadlines = useMemo(() => {
    return [...upcomingDeadlines].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    )
  }, [])

  // ---- Sorted penalty comparison data ----
  const sortedPenaltyData = useMemo(() => {
    return [...penaltyComparisonData].sort((a, b) => a.maxPenaltyUSD - b.maxPenaltyUSD)
  }, [])

  // ---- PDF Export ----
  const handleDownloadPDF = () => {
    const doc = new jsPDF()

    // Title page
    doc.setFontSize(20)
    doc.text("Global Accessibility Legal Tracker 2026", 14, 22)
    doc.setFontSize(10)
    doc.setTextColor(100)
    doc.text("Comprehensive legal landscape analysis | accessibility.build", 14, 30)
    doc.text("Last Updated: March 2026", 14, 36)

    // Table 1: Federal Laws
    doc.setTextColor(0)
    doc.setFontSize(14)
    doc.text("US Federal Laws", 14, 48)

    const federalLaws = accessibilityLaws.filter((l) => l.region === "us-federal")
    autoTable(doc, {
      startY: 52,
      head: [["Law Name", "WCAG Version", "Max Penalty", "Status"]],
      body: federalLaws.map((l) => [
        l.lawName,
        l.wcagVersion,
        l.penalties.maxFine,
        l.status.charAt(0).toUpperCase() + l.status.slice(1),
      ]),
      theme: "grid",
      headStyles: { fillColor: [59, 130, 246] },
    })

    // Table 2: State Laws
    const afterFederal =
      (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable?.finalY ?? 120
    if (afterFederal > 240) doc.addPage()
    const stateY = afterFederal > 240 ? 20 : afterFederal + 12

    doc.setFontSize(14)
    doc.setTextColor(0)
    doc.text("US State Laws", 14, stateY)

    const stateLaws = accessibilityLaws.filter((l) => l.region === "us-state")
    autoTable(doc, {
      startY: stateY + 4,
      head: [["State", "Law Name", "WCAG Version", "Max Penalty"]],
      body: stateLaws.map((l) => [l.jurisdiction, l.lawName, l.wcagVersion, l.penalties.maxFine]),
      theme: "grid",
      headStyles: { fillColor: [59, 130, 246] },
    })

    // Table 3: International Laws
    const afterState =
      (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable?.finalY ?? 200
    if (afterState > 240) doc.addPage()
    const intlY = afterState > 240 ? 20 : afterState + 12

    doc.setFontSize(14)
    doc.setTextColor(0)
    doc.text("International Laws", 14, intlY)

    const intlLaws = accessibilityLaws.filter(
      (l) => !["us-federal", "us-state"].includes(l.region)
    )
    autoTable(doc, {
      startY: intlY + 4,
      head: [["Jurisdiction", "Law Name", "WCAG Version", "Max Penalty"]],
      body: intlLaws.map((l) => [l.jurisdiction, l.lawName, l.wcagVersion, l.penalties.maxFine]),
      theme: "grid",
      headStyles: { fillColor: [59, 130, 246] },
    })

    // Table 4: Upcoming Deadlines
    const afterIntl =
      (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable?.finalY ?? 240
    if (afterIntl > 240) doc.addPage()
    const deadlineY = afterIntl > 240 ? 20 : afterIntl + 12

    doc.setFontSize(14)
    doc.setTextColor(0)
    doc.text("Upcoming Deadlines", 14, deadlineY)

    autoTable(doc, {
      startY: deadlineY + 4,
      head: [["Date", "Jurisdiction", "Description", "Impact"]],
      body: sortedDeadlines.map((d) => [
        formatDate(d.date),
        d.jurisdiction,
        d.description.substring(0, 80) + (d.description.length > 80 ? "..." : ""),
        d.impact.charAt(0).toUpperCase() + d.impact.slice(1),
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
        `Global Accessibility Legal Tracker 2026 - accessibility.build | Page ${i} of ${pageCount}`,
        14,
        doc.internal.pageSize.height - 10
      )
    }

    doc.save("accessibility-laws-tracker-2026.pdf")
  }

  // ---- Render ----
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-16">
      {/* Section 1: Key Stats Banner */}
      <section aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="sr-only">
          Key Statistics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            value="50+ Laws Tracked"
            label="Across federal, state, and international jurisdictions"
            icon={Globe}
            source="Compiled from government sources"
          />
          <StatCard
            value="35+ Jurisdictions"
            label="Countries, states, and regions with accessibility laws"
            icon={MapPin}
            source="Global coverage"
          />
          <StatCard
            value="April 2026"
            label="ADA Title II Deadline"
            icon={Calendar}
            source="DOJ final rule (2024)"
          />
          <StatCard
            value="$150K"
            label="Max Federal Penalty"
            icon={Scale}
            source="ADA Title II civil penalties"
          />
        </div>
      </section>

      {/* Section 2: Jurisdiction Tabs */}
      <section aria-labelledby="jurisdiction-heading">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle id="jurisdiction-heading" className="text-xl md:text-2xl">
                  Accessibility Laws by Jurisdiction
                </CardTitle>
                <CardDescription className="mt-1">
                  Browse laws by region. Click column headers to sort.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="us-federal">
              <TabsList className="mb-6 flex-wrap h-auto gap-1">
                {REGION_TABS.map((tab) => (
                  <TabsTrigger key={tab.value} value={tab.value} className="text-xs sm:text-sm">
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              {REGION_TABS.map((tab) => {
                const regionLaws = sortLaws(getRegionLaws(tab.value))
                return (
                  <TabsContent key={tab.value} value={tab.value}>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm" role="table">
                        <thead>
                          <tr className="border-b border-slate-200 dark:border-slate-700">
                            <th
                              className="text-left py-3 px-3 font-semibold text-slate-600 dark:text-slate-300 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors select-none"
                              onClick={() => handleLawSort("lawName")}
                              scope="col"
                              aria-sort={
                                lawSortField === "lawName"
                                  ? lawSortDirection === "asc"
                                    ? "ascending"
                                    : "descending"
                                  : "none"
                              }
                            >
                              <span className="flex items-center gap-1">
                                Law Name <LawSortIndicator field="lawName" />
                              </span>
                            </th>
                            <th
                              className="text-left py-3 px-3 font-semibold text-slate-600 dark:text-slate-300 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors select-none"
                              onClick={() => handleLawSort("wcagVersion")}
                              scope="col"
                              aria-sort={
                                lawSortField === "wcagVersion"
                                  ? lawSortDirection === "asc"
                                    ? "ascending"
                                    : "descending"
                                  : "none"
                              }
                            >
                              <span className="flex items-center gap-1">
                                WCAG Version <LawSortIndicator field="wcagVersion" />
                              </span>
                            </th>
                            <th
                              className="text-left py-3 px-3 font-semibold text-slate-600 dark:text-slate-300"
                              scope="col"
                            >
                              Applies To
                            </th>
                            <th
                              className="text-right py-3 px-3 font-semibold text-slate-600 dark:text-slate-300 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors select-none"
                              onClick={() => handleLawSort("penalties")}
                              scope="col"
                              aria-sort={
                                lawSortField === "penalties"
                                  ? lawSortDirection === "asc"
                                    ? "ascending"
                                    : "descending"
                                  : "none"
                              }
                            >
                              <span className="flex items-center justify-end gap-1">
                                Max Penalty <LawSortIndicator field="penalties" />
                              </span>
                            </th>
                            <th
                              className="text-left py-3 px-3 font-semibold text-slate-600 dark:text-slate-300"
                              scope="col"
                            >
                              Enforcement
                            </th>
                            <th
                              className="text-left py-3 px-3 font-semibold text-slate-600 dark:text-slate-300 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors select-none"
                              onClick={() => handleLawSort("status")}
                              scope="col"
                              aria-sort={
                                lawSortField === "status"
                                  ? lawSortDirection === "asc"
                                    ? "ascending"
                                    : "descending"
                                  : "none"
                              }
                            >
                              <span className="flex items-center gap-1">
                                Status <LawSortIndicator field="status" />
                              </span>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {regionLaws.map((law) => (
                            <tr
                              key={law.id}
                              className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                            >
                              <td className="py-3 px-3">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-slate-900 dark:text-white">
                                    {law.lawName}
                                  </span>
                                  {law.sourceUrl && (
                                    <a
                                      href={law.sourceUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-500 hover:text-blue-600"
                                    >
                                      <ExternalLink className="h-3 w-3" />
                                    </a>
                                  )}
                                </div>
                              </td>
                              <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                                {law.wcagVersion}
                              </td>
                              <td className="py-3 px-3">
                                <div className="flex flex-wrap gap-1">
                                  {law.appliesTo.map((sector) => (
                                    <Badge
                                      key={sector}
                                      variant="secondary"
                                      className="text-[10px] px-1.5 py-0"
                                    >
                                      {sector}
                                    </Badge>
                                  ))}
                                </div>
                              </td>
                              <td className="py-3 px-3 text-right text-slate-600 dark:text-slate-400 font-medium tabular-nums">
                                {law.penalties.maxFine}
                              </td>
                              <td className="py-3 px-3 text-slate-600 dark:text-slate-400 text-xs">
                                {law.enforcement.join(", ")}
                              </td>
                              <td className="py-3 px-3">
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "text-xs capitalize",
                                    statusColors[law.status] ?? ""
                                  )}
                                >
                                  {law.status}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </TabsContent>
                )
              })}
            </Tabs>
          </CardContent>
        </Card>
      </section>

      {/* Section 3: Upcoming Deadlines Timeline */}
      <section aria-labelledby="deadlines-heading">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-lg">
                <Clock className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <CardTitle id="deadlines-heading" className="text-xl md:text-2xl">
                  Upcoming Compliance Deadlines
                </CardTitle>
                <CardDescription className="mt-1">
                  Key dates that organizations need to prepare for
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {/* Vertical timeline line */}
              <div className="absolute left-[7px] top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700" />

              <div className="space-y-8">
                {sortedDeadlines.map((deadline, index) => {
                  const isCritical = deadline.impact === "critical"

                  const content = (
                    <div className="relative flex gap-4" key={index}>
                      {/* Timeline dot */}
                      <div className="relative shrink-0 z-10">
                        <div
                          className={cn(
                            "w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900",
                            impactColors[deadline.impact]
                          )}
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 -mt-1">
                        <time
                          dateTime={deadline.date}
                          className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1 block"
                        >
                          {formatDate(deadline.date)}
                        </time>
                        <h3 className="font-bold text-slate-900 dark:text-white text-base">
                          {deadline.jurisdiction}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">{deadline.description}</p>
                        <Badge
                          variant="outline"
                          className={cn(
                            "mt-2 text-xs capitalize",
                            deadline.impact === "critical" &&
                              "text-red-700 border-red-200 bg-red-50 dark:text-red-400 dark:border-red-800 dark:bg-red-950/30",
                            deadline.impact === "high" &&
                              "text-amber-700 border-amber-200 bg-amber-50 dark:text-amber-400 dark:border-amber-800 dark:bg-amber-950/30",
                            deadline.impact === "medium" &&
                              "text-blue-700 border-blue-200 bg-blue-50 dark:text-blue-400 dark:border-blue-800 dark:bg-blue-950/30"
                          )}
                        >
                          {deadline.impact} impact
                        </Badge>
                      </div>
                    </div>
                  )

                  if (isCritical) {
                    return (
                      <Card
                        key={index}
                        className="border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/10 ml-0"
                      >
                        <CardContent className="p-4">{content}</CardContent>
                      </Card>
                    )
                  }

                  return content
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Section 4: Enforcement Trends Chart */}
      <section aria-labelledby="enforcement-heading">
        <ChartSection
          title="Enforcement Trends (2018-2025)"
          description="US accessibility lawsuits and EU enforcement actions by year"
          source="UsableNet, European Commission"
          downloadData={{
            filename: "accessibility-enforcement-trends",
            data: enforcementTrends.map((d) => ({
              year: d.year,
              usLawsuits: d.usLawsuits,
              euEnforcement: d.euEnforcement,
              total: d.total,
            })),
          }}
        >
          <div
            className="h-[350px] md:h-[420px]"
            role="img"
            aria-label="Bar chart showing US accessibility lawsuits and EU enforcement actions from 2018 to 2025."
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={enforcementTrends}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-slate-200 dark:stroke-slate-700"
                />
                <XAxis
                  dataKey="year"
                  className="text-xs"
                  tick={{ fill: "currentColor" }}
                  tickLine={{ stroke: "currentColor" }}
                />
                <YAxis
                  className="text-xs"
                  tick={{ fill: "currentColor" }}
                  tickLine={{ stroke: "currentColor" }}
                  tickFormatter={(value) => value.toLocaleString()}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card, #fff)",
                    border: "1px solid var(--color-border, #e2e8f0)",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  formatter={(value: number, name: string) => {
                    if (name === "usLawsuits") return [value.toLocaleString(), "US Lawsuits"]
                    if (name === "euEnforcement")
                      return [value.toLocaleString(), "EU Enforcement"]
                    return [value.toLocaleString(), name]
                  }}
                  labelFormatter={(label) => `Year: ${label}`}
                />
                <Legend
                  formatter={(value) => {
                    if (value === "usLawsuits") return "US Lawsuits"
                    if (value === "euEnforcement") return "EU Enforcement"
                    return value
                  }}
                />
                <Bar dataKey="usLawsuits" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="euEnforcement" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartSection>
      </section>

      {/* Section 5: Penalty Comparison Chart */}
      <section aria-labelledby="penalty-heading">
        <ChartSection
          title="Maximum Penalty Comparison (USD)"
          description="Statutory maximum penalties by jurisdiction, converted to USD for comparison"
          source="Government legal records"
          downloadData={{
            filename: "accessibility-penalty-comparison",
            data: penaltyComparisonData.map((d) => ({
              jurisdiction: d.jurisdiction,
              maxPenaltyUSD: d.maxPenaltyUSD,
              originalAmount: d.label,
            })),
          }}
        >
          <div
            className="h-[400px] md:h-[480px]"
            role="img"
            aria-label="Horizontal bar chart comparing maximum accessibility penalties across jurisdictions."
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sortedPenaltyData}
                layout="vertical"
                margin={{ top: 5, right: 60, left: 0, bottom: 5 }}
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
                  tickFormatter={(value) =>
                    value >= 1000000
                      ? `$${(value / 1000000).toFixed(1)}M`
                      : `$${(value / 1000).toFixed(0)}K`
                  }
                />
                <YAxis
                  dataKey="jurisdiction"
                  type="category"
                  width={140}
                  className="text-xs"
                  tick={{ fill: "currentColor" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card, #fff)",
                    border: "1px solid var(--color-border, #e2e8f0)",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  formatter={(value: number, _name: string, props: any) => {
                    const entry = props.payload
                    return [`$${value.toLocaleString()} USD (${entry.label})`, "Max Penalty"]
                  }}
                />
                <Bar
                  dataKey="maxPenaltyUSD"
                  radius={[0, 4, 4, 0]}
                  label={{
                    position: "right",
                    formatter: (_value: number, entry: any) => {
                      // The entry from recharts label prop is the index
                      return undefined
                    },
                    fill: "currentColor",
                    fontSize: 11,
                  }}
                >
                  {sortedPenaltyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartSection>
      </section>

      {/* Section 6: State Filings Table */}
      <section aria-labelledby="state-filings-heading">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 bg-violet-100 dark:bg-violet-900/50 rounded-lg">
                <MapPin className="h-5 w-5 text-violet-600 dark:text-violet-400" />
              </div>
              <div>
                <CardTitle id="state-filings-heading" className="text-xl md:text-2xl">
                  State Accessibility Filings (2025)
                </CardTitle>
                <CardDescription className="mt-1">
                  Top 10 US states by accessibility lawsuit filings. Click column headers to sort.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" role="table">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th
                      className="text-left py-3 px-3 font-semibold text-slate-600 dark:text-slate-300 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors select-none"
                      onClick={() => handleStateSort("rank")}
                      scope="col"
                      aria-sort={
                        stateSortField === "rank"
                          ? stateSortDirection === "asc"
                            ? "ascending"
                            : "descending"
                          : "none"
                      }
                    >
                      <span className="flex items-center gap-1">
                        Rank <StateSortIndicator field="rank" />
                      </span>
                    </th>
                    <th
                      className="text-left py-3 px-3 font-semibold text-slate-600 dark:text-slate-300 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors select-none"
                      onClick={() => handleStateSort("state")}
                      scope="col"
                      aria-sort={
                        stateSortField === "state"
                          ? stateSortDirection === "asc"
                            ? "ascending"
                            : "descending"
                          : "none"
                      }
                    >
                      <span className="flex items-center gap-1">
                        State <StateSortIndicator field="state" />
                      </span>
                    </th>
                    <th
                      className="text-right py-3 px-3 font-semibold text-slate-600 dark:text-slate-300 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors select-none"
                      onClick={() => handleStateSort("filings2025")}
                      scope="col"
                      aria-sort={
                        stateSortField === "filings2025"
                          ? stateSortDirection === "asc"
                            ? "ascending"
                            : "descending"
                          : "none"
                      }
                    >
                      <span className="flex items-center justify-end gap-1">
                        2025 Filings <StateSortIndicator field="filings2025" />
                      </span>
                    </th>
                    <th
                      className="text-left py-3 px-3 font-semibold text-slate-600 dark:text-slate-300 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors select-none"
                      onClick={() => handleStateSort("primaryLaw")}
                      scope="col"
                      aria-sort={
                        stateSortField === "primaryLaw"
                          ? stateSortDirection === "asc"
                            ? "ascending"
                            : "descending"
                          : "none"
                      }
                    >
                      <span className="flex items-center gap-1">
                        Primary Law <StateSortIndicator field="primaryLaw" />
                      </span>
                    </th>
                    <th
                      className="text-center py-3 px-3 font-semibold text-slate-600 dark:text-slate-300"
                      scope="col"
                    >
                      Trend
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedStateFilings.map((entry, index) => {
                    const barWidth = (entry.filings2025 / stateFilingData[0].filings2025) * 100

                    return (
                      <tr
                        key={entry.abbreviation}
                        className={cn(
                          "border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors",
                          index === 0 && "bg-blue-50/50 dark:bg-blue-950/10"
                        )}
                      >
                        <td className="py-3 px-3 text-slate-500 dark:text-slate-400 font-mono">
                          {entry.rank}
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className="font-mono text-xs w-8 justify-center"
                            >
                              {entry.abbreviation}
                            </Badge>
                            <span className="font-medium text-slate-900 dark:text-white">
                              {entry.state}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <div className="hidden sm:block w-24 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-500 dark:bg-blue-400 rounded-full transition-all duration-500"
                                style={{ width: `${barWidth}%` }}
                              />
                            </div>
                            <span className="font-semibold text-slate-900 dark:text-white tabular-nums">
                              {entry.filings2025.toLocaleString()}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-slate-600 dark:text-slate-400 text-xs">
                          {entry.primaryLaw}
                        </td>
                        <td className="py-3 px-3 text-center">
                          {entry.trend === "up" && (
                            <TrendingUp className="h-4 w-4 text-red-500 mx-auto" />
                          )}
                          {entry.trend === "down" && (
                            <ChevronDown className="h-4 w-4 text-green-500 mx-auto" />
                          )}
                          {entry.trend === "stable" && (
                            <span className="text-slate-400 text-xs">--</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Section 7: WCAG Version Comparison */}
      <section aria-labelledby="wcag-heading">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg">
                <Shield className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <CardTitle id="wcag-heading" className="text-xl md:text-2xl">
                  WCAG Version Requirements
                </CardTitle>
                <CardDescription className="mt-1">
                  Which WCAG version each law requires
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {wcagVersionGroups.map((group) => (
                <Card key={group.version} className="overflow-hidden">
                  <CardHeader className="pb-3">
                    <Badge className={cn("w-fit text-xs font-semibold", group.color)}>
                      {group.version}
                    </Badge>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <ul className="space-y-1.5">
                      {group.laws.map((law) => (
                        <li
                          key={law}
                          className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2"
                        >
                          <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-600 flex-shrink-0" />
                          {law}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Section 8: PDF Export */}
      <section aria-labelledby="export-heading">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-lg">
                <FileText className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <CardTitle id="export-heading" className="text-xl md:text-2xl">
                  Export Report
                </CardTitle>
                <CardDescription className="mt-1">
                  Download a comprehensive PDF report of all accessibility laws and deadlines
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={handleDownloadPDF}
                className="hover:bg-blue-50 dark:hover:bg-blue-950/30"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Full Report (PDF)
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Section 9: Methodology */}
      <section aria-labelledby="methodology-heading">
        <MethodologySection
          title="Methodology & Data Sources"
          dataSources={[
            {
              name: "U.S. DOJ",
              url: "https://www.ada.gov",
              description:
                "Official ADA regulations, enforcement actions, and compliance guidance from the Department of Justice.",
            },
            {
              name: "W3C WAI",
              url: "https://www.w3.org/WAI/policies/",
              description:
                "Web Accessibility Initiative policies database tracking accessibility laws and policies worldwide.",
            },
            {
              name: "European Commission",
              url: "https://ec.europa.eu/",
              description:
                "European Accessibility Act directives, enforcement reports, and member state transposition data.",
            },
            {
              name: "UsableNet",
              url: "https://usablenet.com/",
              description:
                "Annual digital accessibility lawsuit tracking and industry analysis reports.",
            },
            {
              name: "State Legislature Records",
              description:
                "Official state legislature databases for tracking state-level accessibility legislation and amendments.",
            },
          ]}
          sampleSize="50+ laws across 35+ jurisdictions"
          dateRange="1959 - March 2026"
          limitations={[
            "Laws change frequently \u2014 verify current requirements with legal counsel",
            "Penalties shown are statutory maximums; actual fines may differ",
            "Pending legislation may not pass as proposed",
            "International penalty amounts are converted to USD at approximate rates",
          ]}
          lastUpdated="March 2026"
        />
      </section>

      {/* Section 10: Share & Embed */}
      <section aria-labelledby="share-heading">
        <h2 id="share-heading" className="sr-only">
          Share and Embed
        </h2>
        <EmbeddableWidget
          title="Global Accessibility Legal Tracker 2026"
          description="Share this research data or embed it on your website."
          url="https://accessibility.build/research/accessibility-laws"
          stat={{
            value: "50+",
            label: "Laws Tracked Across 35+ Jurisdictions",
          }}
        />
      </section>
    </div>
  )
}
