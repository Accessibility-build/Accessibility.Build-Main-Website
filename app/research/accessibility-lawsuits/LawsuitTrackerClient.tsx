"use client"

import { useMemo, useState } from "react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  CircleDollarSign,
  ExternalLink,
  Gavel,
  Info,
  MapPin,
  Minus,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { ChartSection } from "@/components/research/chart-section"
import { EmbeddableWidget } from "@/components/research/embeddable-widget"
import { MethodologySection } from "@/components/research/methodology-section"
import { cn } from "@/lib/utils"
import {
  keyRulings,
  lawsuitSummary,
  lawsuitsByIndustry,
  lawsuitsByYear,
  may2026RegulatorySnapshot,
  settlementData,
  topStates,
} from "@/lib/data/lawsuit-statistics"

type SortField = "rank" | "state" | "count" | "perCapita"
type SortDirection = "asc" | "desc"

const SEYFARTH_2025_URL =
  "https://www.adatitleiii.com/2026/03/federal-court-website-accessibility-lawsuit-filings-bounce-back-in-2025/"
const USABLENET_2025_URL =
  "https://info.usablenet.com/2025-year-end-report-on-web-accessibility-lawsuits"
const AUDIOEYE_2026_URL =
  "https://www.audioeye.com/guides/2026-web-accessibility-litigation-report/"

function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}K`
  return `$${value.toLocaleString()}`
}

function TrendIcon({ trend }: { trend: "up" | "down" | "stable" }) {
  if (trend === "up") return <ArrowUpRight aria-hidden="true" className="h-4 w-4 text-red-600 dark:text-red-400" />
  if (trend === "down") return <ArrowDownRight aria-hidden="true" className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
  return <Minus aria-hidden="true" className="h-4 w-4 text-slate-500 dark:text-slate-400" />
}

export function LawsuitTrackerClient() {
  const [sortField, setSortField] = useState<SortField>("count")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")

  const sortedStates = useMemo(() => {
    return [...topStates].sort((a, b) => {
      if (sortField === "state") {
        return sortDirection === "asc"
          ? a.state.localeCompare(b.state)
          : b.state.localeCompare(a.state)
      }

      const aValue = sortField === "rank" ? topStates.indexOf(a) : a[sortField]
      const bValue = sortField === "rank" ? topStates.indexOf(b) : b[sortField]
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue
    })
  }, [sortDirection, sortField])

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDirection((direction) => (direction === "asc" ? "desc" : "asc"))
      return
    }
    setSortField(field)
    setSortDirection(field === "state" || field === "rank" ? "asc" : "desc")
  }

  function setMobileSort(value: string) {
    const [field, direction] = value.split(":") as [SortField, SortDirection]
    setSortField(field)
    setSortDirection(direction)
  }

  function sortIndicator(field: SortField) {
    if (sortField !== field) return <ChevronDown aria-hidden="true" className="h-3.5 w-3.5 opacity-40" />
    return sortDirection === "asc" ? (
      <ChevronUp aria-hidden="true" className="h-3.5 w-3.5" />
    ) : (
      <ChevronDown aria-hidden="true" className="h-3.5 w-3.5" />
    )
  }

  function ariaSort(field: SortField): "ascending" | "descending" | "none" {
    if (sortField !== field) return "none"
    return sortDirection === "asc" ? "ascending" : "descending"
  }

  const industryChartData = [...lawsuitsByIndustry].sort((a, b) => a.percentage - b.percentage)
  const maxSettlementValue = Math.max(...settlementData.map((item) => item.range.max))

  return (
    <div className="mx-auto max-w-7xl space-y-14 px-4 py-10 sm:px-6 md:space-y-16 md:py-14 lg:px-8">
      <MethodologySection
        id="methodology"
        title="Methodology, scope, and source notes"
        summary="The primary trend is a federal-court series. Broader state-court and industry reports are identified separately so unlike datasets are not presented as one continuous count."
        dataSources={[
          {
            name: "Seyfarth Shaw 2025 federal filing review",
            url: SEYFARTH_2025_URL,
            description:
              "Primary source for the 2018-2025 federal series and the 2025 state distribution. Entries were keyword searched and manually reviewed by the source.",
          },
          {
            name: "UsableNet 2025 year-end report",
            url: USABLENET_2025_URL,
            description:
              "A separate industry dataset covering ADA-based digital accessibility litigation in federal and selected state courts.",
          },
          {
            name: "AudioEye 2026 litigation report",
            url: AUDIOEYE_2026_URL,
            description:
              "Analysis of publicly available federal and state filings from January through September 2025, plus reported cost and industry observations.",
          },
          {
            name: "PACER and published court records",
            url: "https://pacer.uscourts.gov/",
            description:
              "Public federal docket records and published settlement reporting used for case-level cross-checking.",
          },
        ]}
        sampleSize="21,550 identified federal website-accessibility filings from 2018 through 2025"
        dateRange="Federal trend: 2018-2025; legal developments reviewed through July 9, 2026"
        limitations={[
          "The federal trend excludes state-court matters and private demand letters.",
          "Different publishers use different court sources, search terms, date windows, and deduplication rules; their totals are not directly interchangeable.",
          "Demand-letter and settlement figures are estimates because many resolutions are confidential.",
          "2026 is not shown as an observed filing total because a comparable full-year federal count is not yet available.",
          "This page provides research and general information, not legal advice.",
        ]}
        lastUpdated="July 12, 2026"
      />

      <section id="trends" className="scroll-mt-28" aria-labelledby="yearly-trends-heading">
        <ChartSection
          title="Federal accessibility lawsuits by year"
          titleId="yearly-trends-heading"
          headingLevel={2}
          description="Identified ADA Title III website-accessibility cases filed in U.S. federal courts. The series uses one source and one methodology across all eight years."
          source="Seyfarth Shaw ADA Title III"
          sourceUrl={SEYFARTH_2025_URL}
          downloadData={{
            filename: "federal-accessibility-lawsuits-2018-2025",
            data: lawsuitsByYear.map((item) => ({
              year: item.year,
              federalFilings: item.federalCourt,
              yearOverYearChangePercent: item.yearOverYearChange,
            })),
          }}
        >
          <div
            className="h-[330px] md:h-[420px]"
            role="img"
            aria-label="Area chart of federal website-accessibility lawsuits from 2018 through 2025. Filings rose from 2,258 in 2018 to 3,117 in 2025, with a high of 3,255 in 2022."
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={lawsuitsByYear} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="federalFilingsFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                <XAxis
                  dataKey="year"
                  interval={0}
                  minTickGap={0}
                  tick={{ fill: "currentColor", fontSize: 11 }}
                  tickLine={{ stroke: "currentColor" }}
                />
                <YAxis
                  width={44}
                  tick={{ fill: "currentColor", fontSize: 11 }}
                  tickLine={{ stroke: "currentColor" }}
                  tickFormatter={(value) => Number(value).toLocaleString()}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card, #fff)",
                    border: "1px solid var(--color-border, #e2e8f0)",
                    borderRadius: "6px",
                  }}
                  formatter={(value: number) => [value.toLocaleString(), "Federal filings"]}
                  labelFormatter={(label) => `Year: ${label}`}
                />
                <Area
                  type="monotone"
                  dataKey="federalCourt"
                  name="Federal filings"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  fill="url(#federalFilingsFill)"
                  dot={{ fill: "#2563eb", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <dl className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-slate-200 bg-slate-200 dark:border-slate-700 dark:bg-slate-700 sm:hidden">
            {lawsuitsByYear.map((item) => (
              <div key={item.year} className="bg-white p-3 dark:bg-slate-900">
                <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">{item.year}</dt>
                <dd className="mt-1 font-semibold tabular-nums text-slate-900 dark:text-white">
                  {item.federalCourt.toLocaleString()}
                </dd>
              </div>
            ))}
          </dl>
          <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-600 dark:text-slate-300">
            <span className="rounded-full bg-blue-50 px-3 py-1.5 dark:bg-blue-950/40">2025: 3,117 filings</span>
            <span className="rounded-full bg-red-50 px-3 py-1.5 dark:bg-red-950/30">+27% from 2024</span>
            <span className="rounded-full bg-slate-100 px-3 py-1.5 dark:bg-slate-800">Federal court only</span>
          </div>
        </ChartSection>
      </section>

      <section id="developments" className="scroll-mt-28" aria-labelledby="regulatory-heading">
        <Card>
          <CardHeader>
            <div className="flex items-start gap-3">
              <Gavel aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
              <div>
                <h2 id="regulatory-heading" className="text-xl font-bold text-slate-900 dark:text-white md:text-2xl">
                  2026 legal and regulatory snapshot
                </h2>
                <CardDescription className="mt-1">
                  Status as reviewed on July 9, 2026. Deadline extensions do not erase underlying accessibility obligations.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-3 md:grid-cols-2">
              {may2026RegulatorySnapshot.items.map((item) => (
                <li key={item.label} className="rounded-md border border-slate-200 p-4 dark:border-slate-700">
                  <p className="font-semibold text-slate-900 dark:text-white">{item.label}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{item.detail}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      <section id="industries" className="scroll-mt-28" aria-labelledby="industry-heading">
        <ChartSection
          title="Lawsuits by industry"
          titleId="industry-heading"
          headingLevel={2}
          description="Industry share reported for 2025 digital accessibility litigation. This is a broader industry dataset, not the federal-only series above."
          source="UsableNet 2025 year-end report"
          sourceUrl={USABLENET_2025_URL}
          downloadData={{
            filename: "accessibility-lawsuits-by-industry-2025",
            data: lawsuitsByIndustry.map((item) => ({
              industry: item.industry,
              percentage: item.percentage,
              estimatedCount: item.count,
              trend: item.trend,
            })),
          }}
        >
          <div className="space-y-3 sm:hidden">
            {lawsuitsByIndustry.map((industry) => (
              <div key={industry.industry}>
                <div className="mb-1 flex items-center justify-between gap-3 text-sm">
                  <span className="flex min-w-0 items-center gap-2 font-medium text-slate-800 dark:text-slate-200">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ backgroundColor: industry.color }} />
                    <span>{industry.industry}</span>
                    <TrendIcon trend={industry.trend} />
                  </span>
                  <span className="shrink-0 font-semibold tabular-nums text-slate-900 dark:text-white">{industry.percentage}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div className="h-full rounded-full" style={{ width: `${industry.percentage}%`, backgroundColor: industry.color }} />
                </div>
              </div>
            ))}
          </div>
          <div
            className="hidden h-[480px] sm:block"
            role="img"
            aria-label="Horizontal bar chart showing e-commerce and retail as the largest reported industry category at 70 percent, followed by food and beverage at 21 percent."
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={industryChartData} layout="vertical" margin={{ top: 5, right: 45, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} className="stroke-slate-200 dark:stroke-slate-700" />
                <XAxis type="number" tick={{ fill: "currentColor", fontSize: 11 }} tickFormatter={(value) => `${value}%`} />
                <YAxis dataKey="industry" type="category" width={145} tick={{ fill: "currentColor", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-card, #fff)",
                    border: "1px solid var(--color-border, #e2e8f0)",
                    borderRadius: "6px",
                  }}
                  formatter={(value: number, _name: string, props: { payload?: { count?: number } }) => [
                    `${value}% (${props.payload?.count?.toLocaleString() ?? "not reported"} estimated cases)`,
                    "Share",
                  ]}
                />
                <Bar dataKey="percentage" radius={[0, 4, 4, 0]}>
                  {industryChartData.map((entry) => (
                    <Cell key={entry.industry} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartSection>
      </section>

      <section id="costs" className="scroll-mt-28" aria-labelledby="settlement-heading">
        <ChartSection
          title="Reported settlement and legal-cost benchmarks"
          titleId="settlement-heading"
          headingLevel={2}
          description="Illustrative ranges from published settlements and legal-industry reporting. These figures are not a quote, prediction, or substitute for legal advice."
          source="Published court records and litigation reports"
          downloadData={{
            filename: "accessibility-litigation-cost-benchmarks",
            data: settlementData.map((item) => ({
              category: item.category,
              averageCost: item.averageCost,
              medianCost: item.medianCost,
              rangeMinimum: item.range.min,
              rangeMaximum: item.range.max,
            })),
          }}
        >
          <div className="overflow-hidden rounded-md border border-slate-200 dark:border-slate-700">
            <div className="hidden grid-cols-[minmax(190px,1fr)_180px_minmax(260px,1.2fr)] gap-6 border-b bg-slate-50 px-5 py-3 text-xs font-semibold uppercase text-slate-600 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300 sm:grid">
              <span>Resolution type</span>
              <span>Reported benchmark</span>
              <span>Published range</span>
            </div>
            {settlementData.map((item, index) => {
              const logGlobalMin = Math.log10(1_000)
              const logSpan = Math.log10(maxSettlementValue) - logGlobalMin
              const left = ((Math.log10(Math.max(item.range.min, 1_000)) - logGlobalMin) / logSpan) * 100
              const right = ((Math.log10(item.range.max) - logGlobalMin) / logSpan) * 100
              const width = Math.max(right - left, 3)

              return (
                <div
                  key={item.category}
                  className={cn(
                    "grid gap-3 px-5 py-4 sm:grid-cols-[minmax(190px,1fr)_180px_minmax(260px,1.2fr)] sm:items-center sm:gap-6",
                    index < settlementData.length - 1 && "border-b border-slate-100 dark:border-slate-800"
                  )}
                >
                  <p className="font-semibold text-slate-900 dark:text-white">{item.category}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    <span className="font-semibold text-slate-900 dark:text-white">Avg {formatCurrency(item.averageCost)}</span>
                    <span className="mx-1.5 text-slate-400" aria-hidden="true">/</span>
                    Median {formatCurrency(item.medianCost)}
                  </p>
                  <div>
                    <div className="relative h-3 rounded-full bg-slate-100 dark:bg-slate-800" aria-hidden="true">
                      <span
                        className="absolute inset-y-0 rounded-full bg-blue-500 dark:bg-blue-400"
                        style={{ left: `${left}%`, width: `${width}%` }}
                      />
                    </div>
                    <p className="mt-1.5 flex justify-between gap-3 text-[11px] font-medium text-slate-600 dark:text-slate-300">
                      <span>{formatCurrency(item.range.min)}</span>
                      <span>{formatCurrency(item.range.max)}</span>
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-5 flex items-start gap-3 rounded-md bg-amber-50 p-4 text-sm text-amber-950 dark:bg-amber-950/30 dark:text-amber-100">
            <CircleDollarSign aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" />
            <p>Private settlements are often confidential, and remediation, monitoring, claimant payments, and defense fees may be reported separately. Treat these as directional benchmarks only.</p>
          </div>
        </ChartSection>
      </section>

      <section id="states" className="scroll-mt-28" aria-labelledby="state-heading">
        <Card>
          <CardHeader>
            <div className="flex items-start gap-3">
              <MapPin aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-violet-600 dark:text-violet-400" />
              <div>
                <h2 id="state-heading" className="text-xl font-bold text-slate-900 dark:text-white md:text-2xl">2025 federal filings by state</h2>
                <CardDescription className="mt-1">States reported in Seyfarth Shaw&apos;s federal-court review. State-court matters are not included.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4 md:hidden">
              <label htmlFor="state-sort" className="mb-1.5 block text-sm font-medium text-slate-800 dark:text-slate-200">Sort state data</label>
              <select
                id="state-sort"
                value={`${sortField}:${sortDirection}`}
                onChange={(event) => setMobileSort(event.target.value)}
                className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
              >
                <option value="count:desc">Most filings</option>
                <option value="perCapita:desc">Highest per 100K residents</option>
                <option value="state:asc">State A-Z</option>
                <option value="rank:asc">Source order</option>
              </select>
            </div>

            <div className="space-y-2 md:hidden">
              {sortedStates.map((state) => (
                <div key={state.abbreviation} className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 rounded-md border border-slate-200 p-3 dark:border-slate-700">
                  <p className="font-semibold text-slate-900 dark:text-white"><span className="mr-2 text-xs text-slate-500 dark:text-slate-400">{state.abbreviation}</span>{state.state}</p>
                  <p className="font-semibold tabular-nums text-slate-900 dark:text-white">{state.count.toLocaleString()}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Federal filings</p>
                  <p className="text-right text-xs text-slate-600 dark:text-slate-300">{state.perCapita.toFixed(2)} per 100K</p>
                </div>
              ))}
            </div>

            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-sm">
                <caption className="sr-only">Federal website-accessibility lawsuit filings by state in 2025. Use the column buttons to sort the table.</caption>
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    {([
                      ["rank", "Source rank", "text-left"],
                      ["state", "State", "text-left"],
                      ["count", "Federal filings", "text-right"],
                      ["perCapita", "Per 100K residents", "text-right"],
                    ] as const).map(([field, label, alignment]) => (
                      <th key={field} scope="col" aria-sort={ariaSort(field)} className={cn("p-0 font-semibold text-slate-700 dark:text-slate-200", alignment)}>
                        <button
                          type="button"
                          onClick={() => handleSort(field)}
                          className={cn("inline-flex w-full items-center gap-1 px-3 py-3 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:text-blue-300", alignment === "text-right" && "justify-end")}
                          aria-label={`Sort by ${label}`}
                        >
                          {label} {sortIndicator(field)}
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedStates.map((state) => {
                    const sourceRank = topStates.findIndex((item) => item.abbreviation === state.abbreviation) + 1
                    return (
                      <tr key={state.abbreviation} className="border-b border-slate-100 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50">
                        <td className="px-3 py-3 font-mono text-slate-500 dark:text-slate-400">{sourceRank}</td>
                        <td className="px-3 py-3 font-medium text-slate-900 dark:text-white"><Badge variant="outline" className="mr-2 font-mono text-xs">{state.abbreviation}</Badge>{state.state}</td>
                        <td className="px-3 py-3 text-right font-semibold tabular-nums text-slate-900 dark:text-white">{state.count.toLocaleString()}</td>
                        <td className="px-3 py-3 text-right tabular-nums text-slate-700 dark:text-slate-300">{state.perCapita.toFixed(2)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </section>

      <section aria-labelledby="rulings-heading">
        <Card>
          <CardHeader>
            <div className="flex items-start gap-3">
              <Gavel aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
              <div>
                <h2 id="rulings-heading" className="text-xl font-bold text-slate-900 dark:text-white md:text-2xl">Key legal developments</h2>
                <CardDescription className="mt-1">Court decisions, regulations, enforcement, and settlements are labeled by type rather than reduced to misleading win-or-loss badges.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {[...keyRulings].sort((a, b) => b.date.localeCompare(a.date)).map((ruling) => (
              <details key={`${ruling.date}-${ruling.caseName}`} className="group rounded-md border border-slate-200 dark:border-slate-700">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500 [&::-webkit-details-marker]:hidden">
                  <span className="min-w-0">
                    <span className="mb-2 flex flex-wrap items-center gap-2">
                      <time dateTime={ruling.date} className="text-xs font-medium text-slate-600 dark:text-slate-300">
                        {new Date(`${ruling.date}T00:00:00`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </time>
                      <Badge variant="outline" className="text-xs">{ruling.type}</Badge>
                    </span>
                    <span className="block font-semibold text-slate-900 dark:text-white">{ruling.caseName}</span>
                    <span className="mt-1 block text-sm text-slate-500 dark:text-slate-400">{ruling.court}</span>
                  </span>
                  <ChevronDown aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-slate-500 transition-transform group-open:rotate-180 dark:text-slate-400" />
                </summary>
                <div className="border-t border-slate-200 px-4 pb-4 pt-3 dark:border-slate-700">
                  <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{ruling.summary}</p>
                  <div className="mt-3 flex items-start gap-2 rounded-md bg-slate-50 p-3 dark:bg-slate-800/60">
                    <Info aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400" />
                    <p className="text-sm text-slate-600 dark:text-slate-300"><strong className="text-slate-900 dark:text-white">Why it matters:</strong> {ruling.significance}</p>
                  </div>
                  {ruling.sourceUrl && (
                    <a
                      href={ruling.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-blue-700 underline underline-offset-4 hover:text-blue-900 dark:text-blue-300 dark:hover:text-blue-100"
                    >
                      Review source <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              </details>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="scroll-mt-28 border-y border-slate-200 py-10 dark:border-slate-800" aria-labelledby="response-heading">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase text-blue-700 dark:text-blue-300">Practical response</p>
            <h2 id="response-heading" className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">What organizations should do with this data</h2>
            <p className="mt-3 text-slate-600 dark:text-slate-300">Litigation counts describe reported activity, not the accessibility of a specific website. Use them to prioritize an evidence-based program, not to make a promise that any single tool prevents legal claims.</p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {[
              "Test complete user journeys with keyboard and screen readers, not only the homepage.",
              "Combine automated checks with expert manual review and documented retesting.",
              "Publish an accessibility statement and maintain a responsive feedback channel.",
              "Ask qualified counsel to interpret legal exposure for your jurisdictions and facts.",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                <AlertTriangle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <EmbeddableWidget
        id="share"
        headingLevel={2}
        title="Accessibility Lawsuit Tracker 2026"
        description="Share this research page or embed a linked reference on your website. The canonical URL remains unchanged."
        url="https://accessibility.build/research/accessibility-lawsuits"
        stat={{ value: lawsuitSummary.latestYearTotal.toLocaleString(), label: "federal website-accessibility filings identified in 2025" }}
      />
    </div>
  )
}
