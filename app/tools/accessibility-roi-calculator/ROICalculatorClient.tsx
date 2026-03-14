"use client"

import { useState, useEffect, useMemo, useCallback, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
  Cell,
} from "recharts"
import {
  Calculator,
  TrendingUp,
  Shield,
  DollarSign,
  Copy,
  Check,
  Download,
  ChevronDown,
  ChevronUp,
  Info,
  Building2,
  Users,
  Globe,
  AlertTriangle,
} from "lucide-react"
import { cn } from "@/lib/utils"

// ── Constants ──────────────────────────────────────────────────────────────────

const INDUSTRY_RISK: Record<string, number> = {
  "E-Commerce & Retail": 0.12,
  "Financial Services": 0.08,
  "Healthcare": 0.07,
  "Education": 0.05,
  "Government": 0.04,
  "Media & Entertainment": 0.06,
  "Technology": 0.05,
  "Other": 0.04,
}

const COMPLIANCE_DISCOUNT: Record<string, number> = {
  "None": 1.0,
  "Minimal": 0.8,
  "Partial": 0.5,
  "Mostly Compliant": 0.2,
  "Fully Compliant": 0.05,
}

const REMEDIATION_COST_PER_EMPLOYEE: Record<string, number> = {
  "1-10": 5000,
  "11-50": 15000,
  "51-200": 40000,
  "201-1000": 100000,
  "1000+": 250000,
}

const AVG_LAWSUIT_COST = 50000
const LEGAL_DEFENSE_COST = 25000
const DISABILITY_RATE = 0.15
const AVG_CONVERSION_RATE = 0.02
const MAINTENANCE_RATE = 0.2

const COMPANY_SIZES = ["1-10 employees", "11-50 employees", "51-200 employees", "201-1000 employees", "1000+ employees"]
const INDUSTRIES = [
  "E-Commerce & Retail",
  "Financial Services",
  "Healthcare",
  "Education",
  "Government",
  "Media & Entertainment",
  "Technology",
  "Other",
]
const COMPLIANCE_LEVELS = [
  "None - No accessibility efforts",
  "Minimal - Some basic fixes",
  "Partial - Working toward compliance",
  "Mostly Compliant - Minor gaps",
  "Fully Compliant - WCAG 2.2 AA",
]

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatCurrency(value: number): string {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(1)}K`
  }
  return `$${Math.round(value).toLocaleString()}`
}

function formatCurrencyFull(value: number): string {
  return `$${Math.round(value).toLocaleString()}`
}

function parseNumericInput(value: string): number {
  return Number(value.replace(/[^0-9]/g, "")) || 0
}

function formatNumberInput(value: number): string {
  if (value === 0) return ""
  return value.toLocaleString()
}

function getSizeKey(companySize: string): string {
  if (companySize.startsWith("1-10")) return "1-10"
  if (companySize.startsWith("11-50")) return "11-50"
  if (companySize.startsWith("51-200")) return "51-200"
  if (companySize.startsWith("201-1000")) return "201-1000"
  return "1000+"
}

function getComplianceKey(compliance: string): string {
  if (compliance.startsWith("None")) return "None"
  if (compliance.startsWith("Minimal")) return "Minimal"
  if (compliance.startsWith("Partial")) return "Partial"
  if (compliance.startsWith("Mostly")) return "Mostly Compliant"
  return "Fully Compliant"
}

function calcAvgOrderValue(revenue: number, visitors: number): number {
  const value = revenue / (visitors * 12 * AVG_CONVERSION_RATE)
  return value > 0 && isFinite(value) ? value : 50
}

// ── Inner component that uses useSearchParams ──────────────────────────────────

function ROICalculatorInner() {
  const searchParams = useSearchParams()

  // Form state
  const [companySize, setCompanySize] = useState("")
  const [industry, setIndustry] = useState("")
  const [revenueInput, setRevenueInput] = useState("")
  const [visitorsInput, setVisitorsInput] = useState("")
  const [compliance, setCompliance] = useState("")

  // UI state
  const [copied, setCopied] = useState(false)
  const [showMethodology, setShowMethodology] = useState(false)
  const [showDetailedBreakdown, setShowDetailedBreakdown] = useState(false)

  // Read URL params on mount
  useEffect(() => {
    const size = searchParams.get("size")
    const ind = searchParams.get("industry")
    const rev = searchParams.get("revenue")
    const vis = searchParams.get("visitors")
    const comp = searchParams.get("compliance")

    if (size) {
      const match = COMPANY_SIZES.find((s) => s.startsWith(size))
      if (match) setCompanySize(match)
    }
    if (ind) {
      const match = INDUSTRIES.find((i) => i.startsWith(ind) || i === ind)
      if (match) setIndustry(match)
    }
    if (rev) {
      const num = parseNumericInput(rev)
      if (num > 0) setRevenueInput(formatNumberInput(num))
    }
    if (vis) {
      const num = parseNumericInput(vis)
      if (num > 0) setVisitorsInput(formatNumberInput(num))
    }
    if (comp) {
      const match = COMPLIANCE_LEVELS.find((c) => c.startsWith(comp))
      if (match) setCompliance(match)
    }
  }, [searchParams])

  // Derived values
  const revenue = parseNumericInput(revenueInput)
  const visitors = parseNumericInput(visitorsInput)
  const isComplete = companySize !== "" && industry !== "" && revenue > 0 && visitors > 0 && compliance !== ""

  // ── Calculation engine ───────────────────────────────────────────────────────
  const results = useMemo(() => {
    if (!isComplete) return null

    const industryRisk = INDUSTRY_RISK[industry] || 0.04
    const complianceKey = getComplianceKey(compliance)
    const complianceFactor = COMPLIANCE_DISCOUNT[complianceKey] ?? 1.0
    const sizeKey = getSizeKey(companySize)

    // 1. Lawsuit Risk Cost
    const lawsuitRiskCost = industryRisk * complianceFactor * (AVG_LAWSUIT_COST + LEGAL_DEFENSE_COST)

    // 2. Lost Revenue
    const avgOrderValue = calcAvgOrderValue(revenue, visitors)
    const lostRevenue = visitors * DISABILITY_RATE * AVG_CONVERSION_RATE * avgOrderValue * 12 * complianceFactor

    // 3. Remediation Cost
    const baseRemediationCost = REMEDIATION_COST_PER_EMPLOYEE[sizeKey] || 40000
    const complianceGapFactor = complianceFactor
    const remediationCost = baseRemediationCost * complianceGapFactor

    // 4. Total Annual Benefit
    const totalAnnualBenefit = lawsuitRiskCost + lostRevenue

    // 5. ROI
    const roi = remediationCost > 0 ? ((totalAnnualBenefit - remediationCost) / remediationCost) * 100 : 0

    // 6. Payback Period
    const monthlyBenefit = totalAnnualBenefit / 12
    const paybackMonths = monthlyBenefit > 0 ? remediationCost / monthlyBenefit : Infinity

    // 7. Annual Maintenance
    const annualMaintenance = remediationCost * MAINTENANCE_RATE

    // 8. 3-Year Projection
    const year1Savings = totalAnnualBenefit - remediationCost
    const year2Savings = totalAnnualBenefit - annualMaintenance
    const year3Savings = totalAnnualBenefit - annualMaintenance

    const cumulativeSavingsY1 = year1Savings
    const cumulativeSavingsY2 = cumulativeSavingsY1 + year2Savings
    const cumulativeSavingsY3 = cumulativeSavingsY2 + year3Savings

    const cumulativeCostY1 = remediationCost
    const cumulativeCostY2 = remediationCost + annualMaintenance
    const cumulativeCostY3 = remediationCost + annualMaintenance * 2

    const threeYearSavings = totalAnnualBenefit * 3 - remediationCost - annualMaintenance * 2

    return {
      lawsuitRiskCost,
      lostRevenue,
      remediationCost,
      totalAnnualBenefit,
      roi,
      paybackMonths,
      annualMaintenance,
      threeYearSavings,
      netAnnualBenefit: totalAnnualBenefit - annualMaintenance,
      barChartData: [
        {
          name: "Lawsuit Risk\nAvoided",
          value: lawsuitRiskCost,
          fill: "#3b82f6",
        },
        {
          name: "Revenue\nRecovered",
          value: lostRevenue,
          fill: "#22c55e",
        },
        {
          name: "Remediation\nCost",
          value: remediationCost,
          fill: "#ef4444",
        },
      ],
      projectionData: [
        {
          name: "Year 0",
          savings: 0,
          cost: 0,
        },
        {
          name: "Year 1",
          savings: totalAnnualBenefit,
          cost: cumulativeCostY1,
        },
        {
          name: "Year 2",
          savings: totalAnnualBenefit * 2,
          cost: cumulativeCostY2,
        },
        {
          name: "Year 3",
          savings: totalAnnualBenefit * 3,
          cost: cumulativeCostY3,
        },
      ],
    }
  }, [isComplete, companySize, industry, revenue, visitors, compliance])

  // ── Share / PDF ──────────────────────────────────────────────────────────────
  const handleCopyLink = useCallback(() => {
    const params = new URLSearchParams()
    if (companySize) params.set("size", getSizeKey(companySize))
    if (industry) params.set("industry", industry)
    if (revenue) params.set("revenue", String(revenue))
    if (visitors) params.set("visitors", String(visitors))
    if (compliance) params.set("compliance", getComplianceKey(compliance))

    const url = `${window.location.origin}/tools/accessibility-roi-calculator?${params.toString()}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [companySize, industry, revenue, visitors, compliance])

  const handleDownloadPDF = useCallback(async () => {
    if (!results) return

    const { default: jsPDF } = await import("jspdf")
    const doc = new jsPDF()

    doc.setFontSize(20)
    doc.setTextColor(30, 64, 175)
    doc.text("Accessibility ROI Report", 20, 25)

    doc.setFontSize(10)
    doc.setTextColor(100, 116, 139)
    doc.text("Generated by Accessibility.build", 20, 33)
    doc.text(new Date().toLocaleDateString(), 20, 39)

    doc.setDrawColor(226, 232, 240)
    doc.line(20, 44, 190, 44)

    doc.setFontSize(14)
    doc.setTextColor(15, 23, 42)
    doc.text("Company Profile", 20, 55)

    doc.setFontSize(11)
    doc.setTextColor(71, 85, 105)
    doc.text(`Company Size: ${companySize}`, 25, 64)
    doc.text(`Industry: ${industry}`, 25, 71)
    doc.text(`Annual Revenue: ${formatCurrencyFull(revenue)}`, 25, 78)
    doc.text(`Monthly Visitors: ${visitors.toLocaleString()}`, 25, 85)
    doc.text(`Current Compliance: ${compliance}`, 25, 92)

    doc.setDrawColor(226, 232, 240)
    doc.line(20, 98, 190, 98)

    doc.setFontSize(14)
    doc.setTextColor(15, 23, 42)
    doc.text("ROI Summary", 20, 109)

    doc.setFontSize(11)
    doc.setTextColor(71, 85, 105)
    doc.text(`ROI: ${results.roi.toFixed(0)}%`, 25, 118)
    doc.text(`Payback Period: ${results.paybackMonths < 1 ? "< 1" : results.paybackMonths.toFixed(1)} months`, 25, 125)
    doc.text(`Annual Savings: ${formatCurrencyFull(results.totalAnnualBenefit)}`, 25, 132)
    doc.text(`3-Year Projected Savings: ${formatCurrencyFull(results.threeYearSavings)}`, 25, 139)

    doc.setDrawColor(226, 232, 240)
    doc.line(20, 145, 190, 145)

    doc.setFontSize(14)
    doc.setTextColor(15, 23, 42)
    doc.text("Detailed Breakdown", 20, 156)

    doc.setFontSize(11)
    doc.setTextColor(71, 85, 105)
    doc.text(`Lawsuit Risk Reduction: ${formatCurrencyFull(results.lawsuitRiskCost)}/year`, 25, 165)
    doc.text(`Revenue from Underserved Users: ${formatCurrencyFull(results.lostRevenue)}/year`, 25, 172)
    doc.text(`One-time Remediation Cost: ${formatCurrencyFull(results.remediationCost)}`, 25, 179)
    doc.text(`Annual Maintenance: ${formatCurrencyFull(results.annualMaintenance)}`, 25, 186)
    doc.text(`Net Annual Benefit: ${formatCurrencyFull(results.netAnnualBenefit)}`, 25, 193)

    doc.setDrawColor(226, 232, 240)
    doc.line(20, 200, 190, 200)

    doc.setFontSize(8)
    doc.setTextColor(148, 163, 184)
    doc.text(
      "Disclaimer: These estimates are for illustrative purposes only. Actual results will vary based on",
      20,
      212
    )
    doc.text(
      "your specific situation. Data sources: WHO disability statistics, UsableNet lawsuit data, industry averages.",
      20,
      218
    )
    doc.text("Generated at accessibility.build/tools/accessibility-roi-calculator", 20, 224)

    doc.save("accessibility-roi-report.pdf")
  }, [results, companySize, industry, revenue, visitors, compliance])

  // ── Revenue / visitors handlers ──────────────────────────────────────────────
  const handleRevenueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, "")
    const num = Number(raw) || 0
    setRevenueInput(num > 0 ? num.toLocaleString() : raw)
  }

  const handleVisitorsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, "")
    const num = Number(raw) || 0
    setVisitorsInput(num > 0 ? num.toLocaleString() : raw)
  }

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="container-wide pt-12 pb-12">
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <div className="flex gap-3 mb-4 justify-center items-center">
          <Calculator className="h-10 w-10 md:h-12 md:w-12 text-primary" aria-hidden="true" />
          <h1 className="text-3xl md:text-5xl font-bold leading-tight">
            Accessibility ROI Calculator
          </h1>
        </div>
        <p className="text-muted-foreground text-base md:text-xl max-w-3xl mx-auto leading-relaxed">
          Calculate the return on investment for web accessibility improvements. Build a compelling business case
          with data-driven estimates for lawsuit risk, revenue impact, and remediation costs.
        </p>
        <div className="flex flex-wrap gap-2 justify-center mt-4">
          <Badge variant="secondary">Free Tool</Badge>
          <Badge variant="secondary">No Sign-up Required</Badge>
          <Badge variant="secondary">Client-side Only</Badge>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
        {/* ── Left: Input Section ─────────────────────────────────────────── */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Company Profile
              </CardTitle>
              <CardDescription>
                Enter your company details to get a personalized ROI estimate.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Company Size */}
              <div className="space-y-2">
                <Label htmlFor="company-size">Company Size</Label>
                <Select value={companySize} onValueChange={setCompanySize}>
                  <SelectTrigger id="company-size">
                    <SelectValue placeholder="Select company size" />
                  </SelectTrigger>
                  <SelectContent>
                    {COMPANY_SIZES.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Industry */}
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Select value={industry} onValueChange={setIndustry}>
                  <SelectTrigger id="industry">
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDUSTRIES.map((ind) => (
                      <SelectItem key={ind} value={ind}>
                        {ind}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Annual Revenue */}
              <div className="space-y-2">
                <Label htmlFor="revenue">Annual Revenue</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="revenue"
                    type="text"
                    inputMode="numeric"
                    value={revenueInput}
                    onChange={handleRevenueChange}
                    placeholder="1,000,000"
                    className="pl-9"
                  />
                </div>
              </div>

              {/* Monthly Website Visitors */}
              <div className="space-y-2">
                <Label htmlFor="visitors">Monthly Website Visitors</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="visitors"
                    type="text"
                    inputMode="numeric"
                    value={visitorsInput}
                    onChange={handleVisitorsChange}
                    placeholder="100,000"
                    className="pl-9"
                  />
                </div>
              </div>

              {/* Current Compliance */}
              <div className="space-y-2">
                <Label htmlFor="compliance">Current Accessibility Compliance</Label>
                <Select value={compliance} onValueChange={setCompliance}>
                  <SelectTrigger id="compliance">
                    <SelectValue placeholder="Select compliance level" />
                  </SelectTrigger>
                  <SelectContent>
                    {COMPLIANCE_LEVELS.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Info className="h-4 w-4 flex-shrink-0" />
                <span>All calculations happen in your browser. Your data never leaves your device.</span>
              </div>
            </CardFooter>
          </Card>

          {/* Industry Risk Info */}
          {industry && (
            <Card className="border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-900/10">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  Industry Risk Profile: {industry}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-slate-600 dark:text-slate-300 space-y-2">
                  <p>
                    Annual lawsuit probability:{" "}
                    <span className="font-semibold text-amber-700 dark:text-amber-400">
                      {((INDUSTRY_RISK[industry] || 0.04) * 100).toFixed(0)}%
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Based on historical data from UsableNet and Seyfarth Shaw accessibility lawsuit tracking reports.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* ── Right: Output Section ───────────────────────────────────────── */}
        <div className="space-y-6">
          {!isComplete ? (
            <Card className="border-dashed border-2">
              <CardContent className="py-16 text-center">
                <Globe className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                  Complete the form to see your results
                </h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Fill in all fields on the left to calculate your accessibility ROI. Your personalized
                  report will appear here with charts, projections, and a detailed breakdown.
                </p>
              </CardContent>
            </Card>
          ) : results ? (
            <>
              {/* ROI Summary Cards */}
              <div className="grid grid-cols-2 gap-4">
                <Card className={cn(
                  "text-center",
                  results.roi > 0
                    ? "border-green-200 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10"
                    : "border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-900/10"
                )}>
                  <CardContent className="pt-6 pb-4">
                    <TrendingUp className={cn("h-6 w-6 mx-auto mb-2", results.roi > 0 ? "text-green-600" : "text-red-600")} />
                    <div className={cn("text-3xl md:text-4xl font-bold", results.roi > 0 ? "text-green-600" : "text-red-600")}>
                      {results.roi > 0 ? "+" : ""}{results.roi.toFixed(0)}%
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">ROI</div>
                  </CardContent>
                </Card>

                <Card className="text-center border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10">
                  <CardContent className="pt-6 pb-4">
                    <Shield className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                    <div className="text-3xl md:text-4xl font-bold text-blue-600">
                      {results.paybackMonths < 1
                        ? "<1"
                        : results.paybackMonths > 99
                          ? "99+"
                          : results.paybackMonths.toFixed(1)}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">Months to Payback</div>
                  </CardContent>
                </Card>

                <Card className="text-center border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-900/10">
                  <CardContent className="pt-6 pb-4">
                    <DollarSign className="h-6 w-6 mx-auto mb-2 text-emerald-600" />
                    <div className="text-2xl md:text-3xl font-bold text-emerald-600">
                      {formatCurrency(results.totalAnnualBenefit)}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">Annual Savings</div>
                  </CardContent>
                </Card>

                <Card className="text-center border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-900/10">
                  <CardContent className="pt-6 pb-4">
                    <TrendingUp className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                    <div className="text-2xl md:text-3xl font-bold text-purple-600">
                      {formatCurrency(results.threeYearSavings)}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">3-Year Savings</div>
                  </CardContent>
                </Card>
              </div>

              {/* Cost Breakdown Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Cost vs. Benefit Breakdown</CardTitle>
                  <CardDescription>Annual benefits compared to remediation investment</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 md:h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={results.barChartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                        <XAxis
                          dataKey="name"
                          tick={{ fontSize: 11 }}
                          className="fill-slate-600 dark:fill-slate-400"
                        />
                        <YAxis
                          tickFormatter={(v) => formatCurrency(v)}
                          tick={{ fontSize: 11 }}
                          className="fill-slate-600 dark:fill-slate-400"
                        />
                        <Tooltip
                          formatter={(value: number) => [formatCurrencyFull(value), ""]}
                          contentStyle={{
                            backgroundColor: "var(--background, #fff)",
                            border: "1px solid var(--border, #e2e8f0)",
                            borderRadius: "8px",
                          }}
                        />
                        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                          {results.barChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* 3-Year Projection Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">3-Year Projection</CardTitle>
                  <CardDescription>Cumulative savings vs. cumulative costs over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 md:h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={results.projectionData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                        <XAxis
                          dataKey="name"
                          tick={{ fontSize: 11 }}
                          className="fill-slate-600 dark:fill-slate-400"
                        />
                        <YAxis
                          tickFormatter={(v) => formatCurrency(v)}
                          tick={{ fontSize: 11 }}
                          className="fill-slate-600 dark:fill-slate-400"
                        />
                        <Tooltip
                          formatter={(value: number, name: string) => [
                            formatCurrencyFull(value),
                            name === "savings" ? "Cumulative Savings" : "Cumulative Cost",
                          ]}
                          contentStyle={{
                            backgroundColor: "var(--background, #fff)",
                            border: "1px solid var(--border, #e2e8f0)",
                            borderRadius: "8px",
                          }}
                        />
                        <Legend
                          formatter={(value) => (value === "savings" ? "Cumulative Savings" : "Cumulative Cost")}
                        />
                        <Line
                          type="monotone"
                          dataKey="savings"
                          stroke="#22c55e"
                          strokeWidth={3}
                          dot={{ r: 5, fill: "#22c55e" }}
                          name="savings"
                        />
                        <Line
                          type="monotone"
                          dataKey="cost"
                          stroke="#ef4444"
                          strokeWidth={3}
                          dot={{ r: 5, fill: "#ef4444" }}
                          name="cost"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Breakdown */}
              <Card>
                <CardHeader
                  className="cursor-pointer select-none"
                  onClick={() => setShowDetailedBreakdown(!showDetailedBreakdown)}
                >
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>Detailed Breakdown</span>
                    {showDetailedBreakdown ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </CardTitle>
                </CardHeader>
                {showDetailedBreakdown && (
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-blue-500" />
                          <span className="text-sm font-medium">Lawsuit Risk Reduction</span>
                        </div>
                        <span className="text-sm font-semibold text-blue-600">
                          {formatCurrencyFull(results.lawsuitRiskCost)}/year
                        </span>
                      </div>

                      <div className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-green-500" />
                          <span className="text-sm font-medium">Revenue from Underserved Users</span>
                        </div>
                        <span className="text-sm font-semibold text-green-600">
                          {formatCurrencyFull(results.lostRevenue)}/year
                        </span>
                      </div>

                      <div className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-red-500" />
                          <span className="text-sm font-medium">One-time Remediation Cost</span>
                        </div>
                        <span className="text-sm font-semibold text-red-600">
                          {formatCurrencyFull(results.remediationCost)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-orange-500" />
                          <span className="text-sm font-medium">Annual Maintenance (20%)</span>
                        </div>
                        <span className="text-sm font-semibold text-orange-600">
                          {formatCurrencyFull(results.annualMaintenance)}/year
                        </span>
                      </div>

                      <div className="flex items-center justify-between py-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg px-3">
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 rounded-full bg-emerald-500" />
                          <span className="text-sm font-bold">Net Annual Benefit</span>
                        </div>
                        <span className="text-sm font-bold text-emerald-600">
                          {formatCurrencyFull(results.netAnnualBenefit)}/year
                        </span>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Share Results */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Share Results</CardTitle>
                  <CardDescription>Share your ROI analysis with stakeholders</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={handleCopyLink}
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Link
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={handleDownloadPDF}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Methodology */}
              <Card>
                <CardHeader
                  className="cursor-pointer select-none"
                  onClick={() => setShowMethodology(!showMethodology)}
                >
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      Methodology &amp; Assumptions
                    </span>
                    {showMethodology ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </CardTitle>
                </CardHeader>
                {showMethodology && (
                  <CardContent>
                    <div className="text-sm text-slate-600 dark:text-slate-300 space-y-4">
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-1">Data Sources</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>
                            <strong>WHO:</strong> 15% of the global population lives with some form of disability
                            (1.3 billion people).
                          </li>
                          <li>
                            <strong>UsableNet:</strong> Annual digital accessibility lawsuit tracking data used
                            for industry risk factors.
                          </li>
                          <li>
                            <strong>Seyfarth Shaw:</strong> ADA Title III lawsuit settlement cost analysis for
                            average lawsuit and defense costs.
                          </li>
                          <li>
                            <strong>Industry averages:</strong> Remediation costs based on WebAIM, Deque, and
                            Level Access published estimates.
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white mb-1">Key Assumptions</h4>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Average lawsuit cost: $50,000 settlement + $25,000 legal defense</li>
                          <li>Disability rate among website visitors: 15%</li>
                          <li>Average conversion rate: 2%</li>
                          <li>Annual maintenance: 20% of initial remediation cost</li>
                          <li>Compliance discount reduces both lawsuit risk and lost revenue proportionally</li>
                        </ul>
                      </div>

                      <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                        <p className="text-amber-800 dark:text-amber-200 text-xs">
                          <strong>Disclaimer:</strong> These estimates are for illustrative purposes only and should
                          not be considered financial or legal advice. Actual costs and benefits will vary significantly
                          based on your specific situation, jurisdiction, website complexity, and other factors. Consult
                          with accessibility and legal professionals for accurate assessments.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            </>
          ) : null}
        </div>
      </div>
    </div>
  )
}

// ── Wrapper with Suspense for useSearchParams ──────────────────────────────────

export default function ROICalculatorClient() {
  return (
    <Suspense
      fallback={
        <div className="container-wide py-12">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <div className="flex gap-3 mb-4 justify-center items-center">
              <Calculator className="h-10 w-10 md:h-12 md:w-12 text-primary" aria-hidden="true" />
              <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                Accessibility ROI Calculator
              </h1>
            </div>
            <p className="text-muted-foreground text-base md:text-xl max-w-3xl mx-auto leading-relaxed">
              Loading calculator...
            </p>
          </div>
        </div>
      }
    >
      <ROICalculatorInner />
    </Suspense>
  )
}
