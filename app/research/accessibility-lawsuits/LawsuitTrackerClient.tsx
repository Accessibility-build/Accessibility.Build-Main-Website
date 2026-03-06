"use client"

import { useState, useMemo } from "react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
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
  Scale,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Building2,
  MapPin,
  Gavel,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  ChevronUp,
  ChevronDown,
  Info,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { StatCard } from "@/components/research/stat-card"
import { ChartSection } from "@/components/research/chart-section"
import { MethodologySection } from "@/components/research/methodology-section"
import { EmbeddableWidget } from "@/components/research/embeddable-widget"
import {
  lawsuitsByYear,
  lawsuitsByIndustry,
  settlementData,
  keyRulings,
  topStates,
  lawsuitSummary,
} from "@/lib/data/lawsuit-statistics"

type SortField = "rank" | "state" | "count" | "perCapita"
type SortDirection = "asc" | "desc"

function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`
  }
  return `$${value.toLocaleString()}`
}

function TrendIcon({ trend }: { trend: "up" | "down" | "stable" }) {
  if (trend === "up") return <ArrowUpRight className="h-4 w-4 text-red-500" />
  if (trend === "down") return <ArrowDownRight className="h-4 w-4 text-green-500" />
  return <Minus className="h-4 w-4 text-slate-400" />
}

export function LawsuitTrackerClient() {
  const [sortField, setSortField] = useState<SortField>("count")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")

  const sortedStates = useMemo(() => {
    const sorted = [...topStates].sort((a, b) => {
      let aVal: number | string
      let bVal: number | string

      switch (sortField) {
        case "rank":
          aVal = topStates.indexOf(a)
          bVal = topStates.indexOf(b)
          break
        case "state":
          aVal = a.state
          bVal = b.state
          return sortDirection === "asc"
            ? (aVal as string).localeCompare(bVal as string)
            : (bVal as string).localeCompare(aVal as string)
        case "count":
          aVal = a.count
          bVal = b.count
          break
        case "perCapita":
          aVal = a.perCapita
          bVal = b.perCapita
          break
        default:
          aVal = a.count
          bVal = b.count
      }

      return sortDirection === "asc"
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number)
    })
    return sorted
  }, [sortField, sortDirection])

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  function SortIndicator({ field }: { field: SortField }) {
    if (sortField !== field) {
      return <ChevronDown className="h-3 w-3 opacity-30" />
    }
    return sortDirection === "asc" ? (
      <ChevronUp className="h-3 w-3" />
    ) : (
      <ChevronDown className="h-3 w-3" />
    )
  }

  // Prepare chart data for industry horizontal bar chart (sorted ascending for bottom-to-top display)
  const industryChartData = [...lawsuitsByIndustry].sort((a, b) => a.percentage - b.percentage)

  // Calculate max settlement range for normalization
  const maxSettlementValue = Math.max(...settlementData.map((d) => d.range.max))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-16">
      {/* Section 1: Key Stats Banner */}
      <section aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="sr-only">
          Key Statistics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <StatCard
            value={`${lawsuitSummary.totalLawsuitsFiled.toLocaleString()}+`}
            label="Total Lawsuits Filed (2018-2025)"
            icon={Scale}
            source="Federal court filings"
          />
          <StatCard
            value={lawsuitSummary.latestYearTotal.toLocaleString()}
            label="2025 Lawsuits"
            icon={Scale}
            trend={{
              direction: lawsuitSummary.yearOverYearChange < 0 ? "down" : "up",
              percentage: Math.abs(lawsuitSummary.yearOverYearChange),
              label: "vs 2024",
            }}
          />
          <StatCard
            value={`$${lawsuitSummary.averageSettlement.toLocaleString()}`}
            label="Average Settlement"
            icon={DollarSign}
            source="Out-of-court resolution"
          />
          <StatCard
            value={lawsuitSummary.mostTargetedIndustry}
            label="Most Targeted Industry"
            icon={Building2}
            source="34% of all lawsuits"
          />
        </div>
      </section>

      {/* Section 2: Lawsuits by Year (Area Chart) */}
      <section aria-labelledby="yearly-trends-heading">
        <ChartSection
          title="Federal Accessibility Lawsuits by Year"
          description="ADA Title III digital accessibility lawsuits filed in U.S. federal courts (2018-2025)"
          source="UsableNet, Seyfarth Shaw, PACER"
          downloadData={{
            filename: "accessibility-lawsuits-by-year",
            data: lawsuitsByYear.map((d) => ({
              year: d.year,
              totalFiled: d.totalFiled,
              federalCourt: d.federalCourt,
              demandLetters: d.demandLetters,
              yearOverYearChange: d.yearOverYearChange,
            })),
          }}
        >
          <div
            className="h-[350px] md:h-[420px]"
            role="img"
            aria-label="Area chart showing federal accessibility lawsuits by year from 2018 to 2024. Peak was 5,000 lawsuits in 2025."
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={lawsuitsByYear} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorFiled" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
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
                    if (name === "totalFiled") return [value.toLocaleString(), "Total Filed"]
                    if (name === "demandLetters")
                      return [value.toLocaleString(), "Demand Letters (Est.)"]
                    return [value.toLocaleString(), name]
                  }}
                  labelFormatter={(label) => {
                    const yearData = lawsuitsByYear.find((d) => d.year === label)
                    const yoyText = yearData
                      ? ` | YoY: ${yearData.yearOverYearChange > 0 ? "+" : ""}${yearData.yearOverYearChange}%`
                      : ""
                    return `Year: ${label}${yoyText}`
                  }}
                />
                <Legend
                  formatter={(value) => {
                    if (value === "totalFiled") return "Federal Lawsuits"
                    if (value === "demandLetters") return "Demand Letters (Est.)"
                    return value
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="totalFiled"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  fill="url(#colorFiled)"
                  dot={{ fill: "#3b82f6", strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7, strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="demandLetters"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: "#f59e0b", strokeWidth: 2, r: 4 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 rounded-full px-3 py-1.5">
              <AlertTriangle className="h-3 w-3 text-amber-500" />
              <span>2020: COVID-19 accelerated digital shift and litigation</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 rounded-full px-3 py-1.5">
              <AlertTriangle className="h-3 w-3 text-blue-500" />
              <span>2025: Record year with 5,000+ federal filings</span>
            </div>
          </div>
        </ChartSection>
      </section>

      {/* Section 3: Lawsuits by Industry (Horizontal Bar Chart) */}
      <section aria-labelledby="industry-heading">
        <ChartSection
          title="Lawsuits by Industry"
          description="Percentage breakdown of digital accessibility lawsuits by industry sector (2025)"
          source="UsableNet Annual Reports"
          downloadData={{
            filename: "accessibility-lawsuits-by-industry",
            data: lawsuitsByIndustry.map((d) => ({
              industry: d.industry,
              percentage: d.percentage,
              count: d.count,
              trend: d.trend,
            })),
          }}
        >
          <div
            className="h-[400px] md:h-[480px]"
            role="img"
            aria-label="Horizontal bar chart showing accessibility lawsuits by industry. E-Commerce and Retail leads with 34%."
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={industryChartData}
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
                />
                <YAxis
                  dataKey="industry"
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
                    return [`${value}% (${entry.count.toLocaleString()} cases)`, "Share"]
                  }}
                />
                <Bar
                  dataKey="percentage"
                  radius={[0, 4, 4, 0]}
                  label={{
                    position: "right",
                    formatter: (value: number) => `${value}%`,
                    fill: "currentColor",
                    fontSize: 12,
                  }}
                >
                  {industryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* Trend indicators below chart */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {lawsuitsByIndustry.slice(0, 8).map((industry) => (
              <div
                key={industry.industry}
                className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400"
              >
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: industry.color }}
                />
                <span className="truncate">{industry.industry}</span>
                <TrendIcon trend={industry.trend} />
              </div>
            ))}
          </div>
        </ChartSection>
      </section>

      {/* Section 4: Settlement Costs */}
      <section aria-labelledby="settlement-heading">
        <ChartSection
          title="Settlement & Legal Costs"
          description="Cost ranges by resolution type, from demand letters to class actions"
          source="Public court records, legal industry reports"
          downloadData={{
            filename: "accessibility-settlement-costs",
            data: settlementData.map((d) => ({
              category: d.category,
              averageCost: d.averageCost,
              medianCost: d.medianCost,
              rangeMin: d.range.min,
              rangeMax: d.range.max,
            })),
          }}
        >
          {/* Color-coded severity scale */}
          <div className="hidden sm:flex items-center justify-end gap-1.5 mb-4 text-xs text-slate-500 dark:text-slate-400">
            <span>Severity:</span>
            <span className="inline-flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> Low</span>
            <span className="inline-flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-blue-500" /> Moderate</span>
            <span className="inline-flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-amber-500" /> High</span>
            <span className="inline-flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-red-500" /> Critical</span>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
            {/* Table header - desktop */}
            <div className="hidden sm:grid sm:grid-cols-[1fr,100px,100px,1fr] gap-0 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 px-5 py-3">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Resolution Type</span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Average</span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Median</span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">Range</span>
            </div>

            {/* Rows */}
            {settlementData.map((item, index) => {
              const logMin = Math.log10(Math.max(item.range.min, 1))
              const logMax = Math.log10(Math.max(item.range.max, 1))
              const logGlobalMax = Math.log10(maxSettlementValue)
              const logGlobalMin = Math.log10(1000)
              const logSpan = logGlobalMax - logGlobalMin

              const barLeft = ((logMin - logGlobalMin) / logSpan) * 100
              const barRight = ((logMax - logGlobalMin) / logSpan) * 100
              const barWidth = Math.max(barRight - barLeft, 4)
              const avgPos = ((Math.log10(item.averageCost) - logGlobalMin) / logSpan) * 100
              const medPos = ((Math.log10(item.medianCost) - logGlobalMin) / logSpan) * 100

              // Color based on average cost severity
              const severityColor =
                item.averageCost >= 200000
                  ? "from-red-400 to-red-500 dark:from-red-500 dark:to-red-600"
                  : item.averageCost >= 50000
                    ? "from-amber-400 to-amber-500 dark:from-amber-500 dark:to-amber-600"
                    : item.averageCost >= 20000
                      ? "from-blue-400 to-blue-500 dark:from-blue-500 dark:to-blue-600"
                      : "from-emerald-400 to-emerald-500 dark:from-emerald-500 dark:to-emerald-600"

              const accentTextColor =
                item.averageCost >= 200000
                  ? "text-red-600 dark:text-red-400"
                  : item.averageCost >= 50000
                    ? "text-amber-600 dark:text-amber-400"
                    : item.averageCost >= 20000
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-emerald-600 dark:text-emerald-400"

              return (
                <div
                  key={item.category}
                  className={cn(
                    "group sm:grid sm:grid-cols-[1fr,100px,100px,1fr] gap-0 items-center px-5 py-4 transition-colors hover:bg-slate-50/80 dark:hover:bg-slate-800/40",
                    index < settlementData.length - 1 && "border-b border-slate-100 dark:border-slate-800"
                  )}
                >
                  {/* Category name */}
                  <div className="mb-2 sm:mb-0">
                    <h3 className="font-semibold text-slate-900 dark:text-white text-sm md:text-[15px] leading-tight">
                      {item.category}
                    </h3>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 sm:hidden">
                      Range: {formatCurrency(item.range.min)} – {formatCurrency(item.range.max)}
                    </p>
                  </div>

                  {/* Average */}
                  <div className="hidden sm:block text-right">
                    <p className={cn("text-base font-bold tabular-nums", accentTextColor)}>
                      {formatCurrency(item.averageCost)}
                    </p>
                  </div>

                  {/* Median */}
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300 tabular-nums">
                      {formatCurrency(item.medianCost)}
                    </p>
                  </div>

                  {/* Mobile: inline avg/median + range bar */}
                  <div className="flex items-center gap-4 sm:hidden mb-2">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wide">Avg </span>
                      <span className={cn("text-sm font-bold tabular-nums", accentTextColor)}>{formatCurrency(item.averageCost)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wide">Med </span>
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-300 tabular-nums">{formatCurrency(item.medianCost)}</span>
                    </div>
                  </div>

                  {/* Range visualization */}
                  <div className="relative h-8 sm:px-4">
                    {/* Track background */}
                    <div className="absolute inset-x-0 sm:inset-x-4 top-1/2 -translate-y-1/2 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full" />

                    {/* Filled range bar */}
                    <div
                      className={cn("absolute top-1/2 -translate-y-1/2 h-2.5 rounded-full bg-gradient-to-r shadow-sm", severityColor)}
                      style={{
                        left: `${Math.max(barLeft, 0)}%`,
                        width: `${barWidth}%`,
                      }}
                    />

                    {/* Median diamond marker */}
                    <div
                      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 rotate-45 bg-white dark:bg-slate-200 border-2 border-slate-500 dark:border-slate-400 z-10 shadow-sm"
                      style={{ left: `${medPos}%` }}
                      title={`Median: ${formatCurrency(item.medianCost)}`}
                    />

                    {/* Average circle marker */}
                    <div
                      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-slate-900 dark:bg-white border-2 border-white dark:border-slate-900 z-20 shadow-sm"
                      style={{ left: `${avgPos}%` }}
                      title={`Average: ${formatCurrency(item.averageCost)}`}
                    />

                    {/* Min label */}
                    <span
                      className="absolute -bottom-0.5 text-[9px] text-slate-400 dark:text-slate-500 tabular-nums"
                      style={{ left: `${Math.max(barLeft, 0)}%` }}
                    >
                      {formatCurrency(item.range.min)}
                    </span>

                    {/* Max label */}
                    <span
                      className="absolute -bottom-0.5 text-[9px] text-slate-400 dark:text-slate-500 tabular-nums translate-x-[-100%]"
                      style={{ left: `${barLeft + barWidth}%` }}
                    >
                      {formatCurrency(item.range.max)}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mt-4 px-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <div className="w-3 h-3 rounded-full bg-slate-900 dark:bg-white border-2 border-white dark:border-slate-900 shadow-sm" />
              Average
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <div className="w-2.5 h-2.5 rotate-45 bg-white dark:bg-slate-200 border-2 border-slate-500 dark:border-slate-400 shadow-sm" />
              Median
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <div className="w-6 h-2.5 rounded-full bg-gradient-to-r from-blue-400 to-blue-500" />
              Cost Range
            </div>
          </div>
        </ChartSection>
      </section>

      {/* Section 5: State-by-State Table */}
      <section aria-labelledby="state-heading">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 bg-violet-100 dark:bg-violet-900/50 rounded-lg">
                <MapPin className="h-5 w-5 text-violet-600 dark:text-violet-400" />
              </div>
              <div>
                <CardTitle id="state-heading" className="text-xl md:text-2xl">
                  Lawsuits by State
                </CardTitle>
                <CardDescription className="mt-1">
                  Top 10 states by federal accessibility lawsuit filings. Click column headers to
                  sort.
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
                      onClick={() => handleSort("rank")}
                      scope="col"
                      aria-sort={
                        sortField === "rank"
                          ? sortDirection === "asc"
                            ? "ascending"
                            : "descending"
                          : "none"
                      }
                    >
                      <span className="flex items-center gap-1">
                        # <SortIndicator field="rank" />
                      </span>
                    </th>
                    <th
                      className="text-left py-3 px-3 font-semibold text-slate-600 dark:text-slate-300 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors select-none"
                      onClick={() => handleSort("state")}
                      scope="col"
                      aria-sort={
                        sortField === "state"
                          ? sortDirection === "asc"
                            ? "ascending"
                            : "descending"
                          : "none"
                      }
                    >
                      <span className="flex items-center gap-1">
                        State <SortIndicator field="state" />
                      </span>
                    </th>
                    <th
                      className="text-right py-3 px-3 font-semibold text-slate-600 dark:text-slate-300 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors select-none"
                      onClick={() => handleSort("count")}
                      scope="col"
                      aria-sort={
                        sortField === "count"
                          ? sortDirection === "asc"
                            ? "ascending"
                            : "descending"
                          : "none"
                      }
                    >
                      <span className="flex items-center justify-end gap-1">
                        Total Lawsuits <SortIndicator field="count" />
                      </span>
                    </th>
                    <th
                      className="text-right py-3 px-3 font-semibold text-slate-600 dark:text-slate-300 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors select-none"
                      onClick={() => handleSort("perCapita")}
                      scope="col"
                      aria-sort={
                        sortField === "perCapita"
                          ? sortDirection === "asc"
                            ? "ascending"
                            : "descending"
                          : "none"
                      }
                    >
                      <span className="flex items-center justify-end gap-1">
                        Per 100K Residents <SortIndicator field="perCapita" />
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedStates.map((state, index) => {
                    const originalIndex = topStates.findIndex(
                      (s) => s.abbreviation === state.abbreviation
                    )
                    const barWidth = (state.count / topStates[0].count) * 100

                    return (
                      <tr
                        key={state.abbreviation}
                        className={cn(
                          "border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors",
                          index === 0 && "bg-blue-50/50 dark:bg-blue-950/10"
                        )}
                      >
                        <td className="py-3 px-3 text-slate-500 dark:text-slate-400 font-mono">
                          {originalIndex + 1}
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className="font-mono text-xs w-8 justify-center"
                            >
                              {state.abbreviation}
                            </Badge>
                            <span className="font-medium text-slate-900 dark:text-white">
                              {state.state}
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
                              {state.count.toLocaleString()}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <span
                            className={cn(
                              "font-medium tabular-nums",
                              state.perCapita >= 5
                                ? "text-red-600 dark:text-red-400"
                                : state.perCapita >= 2
                                  ? "text-amber-600 dark:text-amber-400"
                                  : "text-slate-700 dark:text-slate-300"
                            )}
                          >
                            {state.perCapita.toFixed(1)}
                          </span>
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

      {/* Section 6: Key Court Rulings Timeline */}
      <section aria-labelledby="rulings-heading">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
                <Gavel className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <CardTitle id="rulings-heading" className="text-xl md:text-2xl">
                  Key Court Rulings
                </CardTitle>
                <CardDescription className="mt-1">
                  Landmark cases that have shaped digital accessibility law in the United States
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {/* Vertical timeline line */}
              <div className="absolute left-[7px] md:left-[120px] top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700" />

              <div className="space-y-8">
                {keyRulings.map((ruling, index) => {
                  const outcomeConfig = {
                    plaintiff: {
                      color: "bg-green-500",
                      borderColor: "border-l-4 border-l-green-500 border-green-200 dark:border-green-800",
                      bgColor: "bg-green-50 dark:bg-green-950/20",
                      badgeClass:
                        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800",
                      label: "Plaintiff Won",
                    },
                    defendant: {
                      color: "bg-red-500",
                      borderColor: "border-l-4 border-l-red-500 border-red-200 dark:border-red-800",
                      bgColor: "bg-red-50 dark:bg-red-950/20",
                      badgeClass:
                        "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800",
                      label: "Defendant Won",
                    },
                    settled: {
                      color: "bg-yellow-500",
                      borderColor: "border-l-4 border-l-yellow-500 border-yellow-200 dark:border-yellow-800",
                      bgColor: "bg-yellow-50 dark:bg-yellow-950/20",
                      badgeClass:
                        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800",
                      label: "Settled",
                    },
                  }
                  const config = outcomeConfig[ruling.outcome]

                  return (
                    <div key={index} className="relative flex gap-4 md:gap-6">
                      {/* Date on left (hidden on small screens) */}
                      <div className="hidden md:block w-[100px] shrink-0 text-right pt-1">
                        <time
                          dateTime={ruling.date}
                          className="text-sm font-medium text-slate-500 dark:text-slate-400"
                        >
                          {new Date(ruling.date).toLocaleDateString("en-US", {
                            month: "short",
                            year: "numeric",
                          })}
                        </time>
                      </div>

                      {/* Timeline dot */}
                      <div className="relative shrink-0">
                        <div
                          className={cn(
                            "w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 z-10 relative",
                            config.color
                          )}
                        />
                      </div>

                      {/* Content */}
                      <div
                        className={cn(
                          "flex-1 rounded-lg p-4 md:p-5 -mt-1",
                          config.borderColor,
                          config.bgColor
                        )}
                      >
                        {/* Date on small screens */}
                        <time
                          dateTime={ruling.date}
                          className="md:hidden text-xs font-medium text-slate-500 dark:text-slate-400 mb-2 block"
                        >
                          {new Date(ruling.date).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </time>

                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                          <div>
                            <h3 className="font-bold text-slate-900 dark:text-white text-base">
                              {ruling.caseName}
                            </h3>
                            <Badge variant="secondary" className="mt-1 text-xs">
                              {ruling.court}
                            </Badge>
                          </div>
                          <Badge
                            variant="outline"
                            className={cn("shrink-0 w-fit", config.badgeClass)}
                          >
                            {config.label}
                          </Badge>
                        </div>

                        <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">
                          {ruling.summary}
                        </p>

                        <div className="flex items-start gap-2 bg-white/60 dark:bg-slate-900/40 rounded-md p-2.5">
                          <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            <span className="font-semibold text-blue-700 dark:text-blue-300">
                              Significance:
                            </span>{" "}
                            {ruling.significance}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Section 7: Methodology */}
      <section aria-labelledby="methodology-heading">
        <MethodologySection
          title="Methodology & Data Sources"
          dataSources={[
            {
              name: "UsableNet ADA Digital Accessibility Reports",
              description:
                "Annual reports tracking ADA Title III digital accessibility lawsuits filed in federal courts across the United States.",
            },
            {
              name: "Seyfarth Shaw ADA Title III Blog",
              description:
                "Legal analysis and tracking of ADA Title III lawsuit trends from one of the leading employment and labor law firms.",
            },
            {
              name: "Public Court Records (PACER)",
              description:
                "Federal court electronic records system used to verify and cross-reference lawsuit filing data.",
            },
          ]}
          sampleSize="Federal court filings, 2018-2025"
          dateRange="2018 - 2025"
          limitations={[
            "Only tracks federal court filings",
            "Demand letter estimates are approximate",
            "Settlement amounts are based on publicly available data",
            "Some cases may be counted multiple times across sources",
          ]}
          lastUpdated="March 2026"
        />
      </section>

      {/* Section 8: Share & Embed */}
      <section aria-labelledby="share-heading">
        <h2 id="share-heading" className="sr-only">
          Share and Embed
        </h2>
        <EmbeddableWidget
          title="Accessibility Lawsuit Tracker 2026"
          description="Share this research data or embed it on your website."
          url="https://accessibility.build/research/accessibility-lawsuits"
          stat={{
            value: `${lawsuitSummary.totalLawsuitsFiled.toLocaleString()}+`,
            label: "accessibility lawsuits filed (2018-2025)",
          }}
        />
      </section>
    </div>
  )
}
