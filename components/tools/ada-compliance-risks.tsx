"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  AlertTriangle,
  CheckCircle,
  Download,
  FileText,
  TrendingUp,
  Shield,
  DollarSign,
  Target,
  Calendar,
  FileSpreadsheet,
  Sparkles,
  Info,
  Scale,
  Building2,
  Globe,
  Users,
  BarChart3,
  AlertCircle,
  ChevronRight,
  ExternalLink,
  Gavel,
  BookOpen
} from "lucide-react"
import { 
  calculateADARisk,
  type RiskAssessmentData,
  type RiskAssessmentResult
} from "@/lib/ada-risk-calculator"
import { toast } from "sonner"
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

// Research-based statistics for display (Updated 2024/2025)
// Sources: UsableNet 2025 Mid-Year Report, ADA Title III, Accessibility.works
const LAWSUIT_STATISTICS = {
  // 2024 Full Year Data
  totalLawsuits2024: 4890,
  yearOverYearGrowth2024: 6,
  // 2025 Mid-Year Data (Jan-Jun 2025)
  midYear2025Lawsuits: 2847,
  midYear2025Growth: 37, // 37% surge compared to same period 2024
  // State Distribution (2024)
  topStates: [
    { name: 'New York', percentage: 72, count: 3521 },
    { name: 'California', percentage: 18, count: 880 },
    { name: 'Florida', percentage: 5, count: 245 },
    { name: 'Other States', percentage: 5, count: 244 }
  ],
  // Industry Distribution (2024-2025)
  topIndustries: [
    { name: 'Restaurants / Food & Beverage', percentage: 22 },
    { name: 'Lifestyle, Fashion & Apparel', percentage: 19 },
    { name: 'Beauty, Skin & Body Care', percentage: 15 },
    { name: 'Medical & Health Services', percentage: 12 },
    { name: 'Furniture & Home Décor', percentage: 11 },
    { name: 'E-commerce (General)', percentage: 21 }
  ],
  // Financial Data
  averageSettlement: { low: 5000, high: 150000 },
  typicalSettlement: 20000,
  defenseCosets: { low: 10000, high: 350000 },
  // Key Insights
  overlayWidgetLawsuits: 22.65, // % of lawsuits targeting sites with overlays
  smallBusinessTarget: 77, // % targeting companies under $25M revenue
  repeatDefendants: 15 // % of defendants sued multiple times
}

// Data Sources for transparency
const DATA_SOURCES = [
  {
    name: 'UsableNet 2025 Mid-Year Report',
    url: 'https://blog.usablenet.com',
    description: 'Digital accessibility lawsuit tracking and analysis'
  },
  {
    name: 'ADA Title III News & Insights',
    url: 'https://www.adatitleiii.com',
    description: 'Legal analysis of ADA Title III litigation'
  },
  {
    name: 'Web Content Accessibility Guidelines (WCAG) 2.2',
    url: 'https://www.w3.org/WAI/WCAG22/quickref/',
    description: 'W3C international accessibility standard'
  },
  {
    name: 'DOJ ADA.gov',
    url: 'https://www.ada.gov',
    description: 'Official Department of Justice ADA guidance'
  },
  {
    name: 'Section 508 Standards',
    url: 'https://www.section508.gov',
    description: 'Federal electronic accessibility requirements'
  }
]

const RISK_FACTOR_WEIGHTS = {
  industryRisk: 25,
  violationSeverity: 30,
  complianceStatus: 20,
  trafficExposure: 15,
  legalJurisdiction: 10
}

export default function ADAComplianceRisks() {
  const [currentStep, setCurrentStep] = useState(1)
  const [assessmentData, setAssessmentData] = useState<Partial<RiskAssessmentData> & {
    companySize?: string
    annualRevenue?: string
    previousLawsuits?: boolean
    hasLegalCounsel?: boolean
    providesServices?: boolean
    hasPhysicalLocation?: boolean
    acceptsOnlinePayments?: boolean
    hasUserAccounts?: boolean
    hasThirdPartyContent?: boolean
    hasVideoContent?: boolean
    hasMobileApp?: boolean
  }>({
    industryType: 'other',
    websiteType: 'other',
    currentWCAGLevel: 'none',
    knownViolations: {
      critical: 0,
      serious: 0,
      moderate: 0,
      minor: 0
    },
    trafficVolume: 'medium',
    geographicLocation: 'us',
    hasAccessibilityStatement: false,
    hasComplianceProgram: false,
    companySize: 'small',
    annualRevenue: 'under-1m',
    previousLawsuits: false,
    hasLegalCounsel: false,
    providesServices: false,
    hasPhysicalLocation: false,
    acceptsOnlinePayments: false,
    hasUserAccounts: false,
    hasThirdPartyContent: false,
    hasVideoContent: false,
    hasMobileApp: false
  })

  const [result, setResult] = useState<RiskAssessmentResult | null>(null)
  const [showResults, setShowResults] = useState(false)

  const totalSteps = 4

  // Load sample data for demonstration
  const loadSampleData = () => {
    setAssessmentData({
      industryType: 'ecommerce',
      websiteType: 'ecommerce',
      currentWCAGLevel: 'none',
      knownViolations: {
        critical: 3,
        serious: 8,
        moderate: 12,
        minor: 5
      },
      trafficVolume: 'high',
      geographicLocation: 'us',
      hasAccessibilityStatement: false,
      hasComplianceProgram: false,
      companySize: 'medium',
      annualRevenue: '1m-10m',
      previousLawsuits: false,
      hasLegalCounsel: false,
      providesServices: true,
      hasPhysicalLocation: true,
      acceptsOnlinePayments: true,
      hasUserAccounts: true,
      hasThirdPartyContent: true,
      hasVideoContent: true,
      hasMobileApp: false
    })
    setCurrentStep(4)
    toast.success('Sample data loaded! Review and click "Calculate Risk" to see results.')
  }

  const updateField = (field: string, value: any) => {
    setAssessmentData(prev => ({ ...prev, [field]: value }))
  }

  const updateViolations = (type: keyof RiskAssessmentData['knownViolations'], value: number) => {
    setAssessmentData(prev => ({
      ...prev,
      knownViolations: {
        ...prev.knownViolations!,
        [type]: Math.max(0, value)
      }
    }))
  }

  const calculateRisk = () => {
    if (!assessmentData.industryType || !assessmentData.websiteType) {
      toast.error('Please complete all required fields')
      return
    }

    const assessment = calculateADARisk(assessmentData as RiskAssessmentData)
    setResult(assessment)
    setShowResults(true)
    toast.success('Risk assessment completed')
  }

  const nextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const exportReport = (format: 'pdf' | 'excel') => {
    if (!result) return

    if (format === 'pdf') {
      const doc = new jsPDF('p', 'mm', 'a4')
      
      // Header
      doc.setFillColor(30, 58, 138)
      doc.rect(0, 0, 210, 40, 'F')
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(24)
      doc.text('ADA Compliance Risk Assessment', 20, 25)
      doc.setFontSize(10)
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 35)
      
      doc.setTextColor(0, 0, 0)
      let yPos = 55

      // Risk Summary Box
      doc.setFillColor(result.riskLevel === 'critical' ? 254 : result.riskLevel === 'high' ? 255 : result.riskLevel === 'medium' ? 254 : 236, 
                       result.riskLevel === 'critical' ? 226 : result.riskLevel === 'high' ? 237 : result.riskLevel === 'medium' ? 249 : 253, 
                       result.riskLevel === 'critical' ? 226 : result.riskLevel === 'high' ? 213 : result.riskLevel === 'medium' ? 231 : 234)
      doc.rect(15, yPos - 5, 180, 25, 'F')
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text(`Overall Risk Level: ${result.riskLevel.toUpperCase()}`, 20, yPos + 5)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(11)
      doc.text(`Legal Exposure Score: ${result.legalExposureScore}/100`, 20, yPos + 15)
      doc.text(`Est. Financial Risk: $${result.financialRiskEstimate.low.toLocaleString()} - $${result.financialRiskEstimate.high.toLocaleString()}`, 100, yPos + 15)
      
      yPos += 35

      // Methodology Note
      doc.setFontSize(9)
      doc.setTextColor(100, 100, 100)
      doc.text('This assessment is based on WCAG 2.2 guidelines, ADA Title III requirements, DOJ technical standards,', 20, yPos)
      yPos += 5
      doc.text('and analysis of 4,600+ federal website accessibility lawsuits filed in 2023.', 20, yPos)
      doc.setTextColor(0, 0, 0)
      
      yPos += 15
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text('Immediate Actions Required', 20, yPos)
      yPos += 8
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      result.immediateActions.forEach((action, i) => {
        doc.text(`${i + 1}. ${action}`, 25, yPos)
        yPos += 7
      })

      yPos += 8
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text('Compliance Roadmap', 20, yPos)
      yPos += 10

      result.complianceRoadmap.forEach((phase, i) => {
        doc.setFontSize(11)
        doc.setFont('helvetica', 'bold')
        doc.text(`Phase ${i + 1}: ${phase.phase} (${phase.duration})`, 25, yPos)
        yPos += 6
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(10)
        phase.actions.forEach(action => {
          doc.text(`• ${action}`, 30, yPos)
          yPos += 5
        })
        yPos += 4
      })

      // Industry-specific risks
      if (result.industrySpecificRisks && result.industrySpecificRisks.length > 0) {
        if (yPos > 250) {
          doc.addPage()
          yPos = 20
        }
        yPos += 5
        doc.setFontSize(14)
        doc.setFont('helvetica', 'bold')
        doc.text('Industry-Specific Risk Factors', 20, yPos)
        yPos += 8
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(10)
        result.industrySpecificRisks.forEach((risk) => {
          doc.text(`• ${risk}`, 25, yPos)
          yPos += 6
        })
      }

      // Footer
      doc.setFontSize(8)
      doc.setTextColor(100, 100, 100)
      doc.text('Generated by Accessibility.Build - This report is for informational purposes only and does not constitute legal advice.', 20, 285)

      doc.save('ada-compliance-risk-assessment.pdf')
      toast.success('PDF report downloaded')
    } else {
      const workbook = XLSX.utils.book_new()
      
      const summaryData = [
        ['ADA Compliance Risk Assessment Report'],
        ['Generated:', new Date().toLocaleDateString()],
        [''],
        ['RISK SUMMARY'],
        ['Risk Level', result.riskLevel.toUpperCase()],
        ['Legal Exposure Score', `${result.legalExposureScore}/100`],
        ['Financial Risk (Low)', `$${result.financialRiskEstimate.low.toLocaleString()}`],
        ['Financial Risk (High)', `$${result.financialRiskEstimate.high.toLocaleString()}`],
        [''],
        ['ASSESSMENT METHODOLOGY'],
        ['This assessment is based on:'],
        ['• WCAG 2.2 Web Content Accessibility Guidelines'],
        ['• ADA Title III requirements for places of public accommodation'],
        ['• DOJ technical standards for web accessibility'],
        ['• Analysis of 4,600+ federal website accessibility lawsuits (2023)'],
        ['• Industry-specific risk factors and legal precedents'],
        [''],
        ['IMMEDIATE ACTIONS'],
        ...result.immediateActions.map(a => ['• ' + a]),
        [''],
        ['SHORT-TERM FIXES (90 days)'],
        ...result.shortTermFixes.map(f => ['• ' + f]),
        [''],
        ['LONG-TERM IMPROVEMENTS'],
        ...result.longTermImprovements.map(i => ['• ' + i]),
        [''],
        ['INDUSTRY-SPECIFIC RISKS'],
        ...result.industrySpecificRisks.map(r => ['• ' + r])
      ]

      const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
      summarySheet['!cols'] = [{ wch: 60 }, { wch: 30 }]
      XLSX.utils.book_append_sheet(workbook, summarySheet, 'Risk Assessment')

      const roadmapData = [
        ['COMPLIANCE ROADMAP'],
        [''],
        ['Phase', 'Duration', 'Priority', 'Actions'],
        ...result.complianceRoadmap.map(phase => [
          phase.phase,
          phase.duration,
          phase.priority.toUpperCase(),
          phase.actions.join('\n• ')
        ])
      ]

      const roadmapSheet = XLSX.utils.aoa_to_sheet(roadmapData)
      roadmapSheet['!cols'] = [{ wch: 25 }, { wch: 15 }, { wch: 10 }, { wch: 60 }]
      XLSX.utils.book_append_sheet(workbook, roadmapSheet, 'Compliance Roadmap')

      const inputData = [
        ['ASSESSMENT INPUT DATA'],
        [''],
        ['Organization Profile'],
        ['Industry Type', assessmentData.industryType],
        ['Website Type', assessmentData.websiteType],
        ['Company Size', assessmentData.companySize],
        ['Annual Revenue', assessmentData.annualRevenue],
        ['Geographic Location', assessmentData.geographicLocation],
        ['Traffic Volume', assessmentData.trafficVolume],
        [''],
        ['Compliance Status'],
        ['Current WCAG Level', assessmentData.currentWCAGLevel || 'None'],
        ['Has Accessibility Statement', assessmentData.hasAccessibilityStatement ? 'Yes' : 'No'],
        ['Has Compliance Program', assessmentData.hasComplianceProgram ? 'Yes' : 'No'],
        ['Last Audit Date', assessmentData.lastAuditDate || 'Never'],
        [''],
        ['Known Violations'],
        ['Critical', assessmentData.knownViolations?.critical || 0],
        ['Serious', assessmentData.knownViolations?.serious || 0],
        ['Moderate', assessmentData.knownViolations?.moderate || 0],
        ['Minor', assessmentData.knownViolations?.minor || 0]
      ]

      const inputSheet = XLSX.utils.aoa_to_sheet(inputData)
      inputSheet['!cols'] = [{ wch: 25 }, { wch: 30 }]
      XLSX.utils.book_append_sheet(workbook, inputSheet, 'Input Data')

      XLSX.writeFile(workbook, 'ada-compliance-risk-assessment.xlsx')
      toast.success('Excel report downloaded')
    }
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-600 bg-red-50 dark:bg-red-900/20 border-red-200'
      case 'high': return 'text-orange-600 bg-orange-50 dark:bg-orange-900/20 border-orange-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200'
      case 'low': return 'text-green-600 bg-green-50 dark:bg-green-900/20 border-green-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getRiskBadgeColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-600 hover:bg-red-700'
      case 'high': return 'bg-orange-600 hover:bg-orange-700'
      case 'medium': return 'bg-yellow-600 hover:bg-yellow-700'
      case 'low': return 'bg-green-600 hover:bg-green-700'
      default: return 'bg-gray-600'
    }
  }

  if (showResults && result) {
    return (
      <div className="space-y-6">
        {/* Results Header */}
        <div className="text-center py-6">
          <Badge className={`${getRiskBadgeColor(result.riskLevel)} text-white text-xl px-6 py-3 mb-4`}>
            {result.riskLevel.toUpperCase()} RISK
          </Badge>
          <h2 className="text-2xl font-bold mb-2">Risk Assessment Complete</h2>
          <p className="text-muted-foreground">
            Based on your inputs, here&apos;s your comprehensive ADA compliance risk analysis
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className={`border-2 ${getRiskColor(result.riskLevel)}`}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <Scale className="w-8 h-8 opacity-50" />
                <span className="text-4xl font-bold">{result.legalExposureScore}</span>
              </div>
              <div className="text-sm font-medium mb-2">Legal Exposure Score</div>
              <Progress value={result.legalExposureScore} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                Out of 100 - Higher scores indicate greater legal vulnerability
              </p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <DollarSign className="w-8 h-8 text-green-600 opacity-50" />
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">
                    ${(result.financialRiskEstimate.low / 1000).toFixed(0)}K
                  </div>
                  <div className="text-lg text-muted-foreground">
                    to ${(result.financialRiskEstimate.high / 1000).toFixed(0)}K
                  </div>
                </div>
              </div>
              <div className="text-sm font-medium">Estimated Financial Exposure</div>
              <p className="text-xs text-muted-foreground mt-2">
                Includes potential settlements, legal fees, and remediation costs
              </p>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <AlertTriangle className="w-8 h-8 text-orange-600 opacity-50" />
                <span className="text-4xl font-bold text-orange-600">{result.immediateActions.length}</span>
              </div>
              <div className="text-sm font-medium">Immediate Actions Required</div>
              <p className="text-xs text-muted-foreground mt-2">
                Priority items to address within the next 30 days
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Methodology Note */}
        <Card className="bg-slate-50 dark:bg-slate-900 border-slate-200">
          <CardContent className="py-4">
            <div className="flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-slate-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-slate-600 dark:text-slate-400">
                <strong>Assessment Methodology:</strong> This risk calculation is based on WCAG 2.2 guidelines, 
                ADA Title III requirements, DOJ 2024 final rule, and analysis of {LAWSUIT_STATISTICS.totalLawsuits2024.toLocaleString()}+ 
                federal website accessibility lawsuits in 2024 (with 2025 mid-year data showing a {LAWSUIT_STATISTICS.midYear2025Growth}% surge). 
                Risk factors are weighted according to industry-specific litigation patterns and settlement data.
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Results */}
        <Tabs defaultValue="actions" className="space-y-4">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full h-auto">
            <TabsTrigger value="actions">Immediate Actions</TabsTrigger>
            <TabsTrigger value="roadmap">Compliance Roadmap</TabsTrigger>
            <TabsTrigger value="industry">Industry Risks</TabsTrigger>
            <TabsTrigger value="statistics">Lawsuit Data</TabsTrigger>
          </TabsList>

          <TabsContent value="actions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  Immediate Actions Required
                </CardTitle>
                <CardDescription>
                  These items should be addressed within the next 30 days to reduce immediate legal exposure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {result.immediateActions.map((action, i) => (
                    <li key={i} className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-900/10 rounded-lg">
                      <div className="w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {i + 1}
                      </div>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-600" />
                  Short-term Fixes (90 Days)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.shortTermFixes.map((fix, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>{fix}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Long-term Improvements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.longTermImprovements.map((improvement, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{improvement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roadmap" className="space-y-4">
            {result.complianceRoadmap.map((phase, i) => (
              <Card key={i} className={phase.priority === 'high' ? 'border-red-200 dark:border-red-800' : ''}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                        phase.priority === 'high' ? 'bg-red-600' : 
                        phase.priority === 'medium' ? 'bg-yellow-600' : 'bg-green-600'
                      }`}>
                        {i + 1}
                      </div>
                      {phase.phase}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={phase.priority === 'high' ? 'destructive' : 'secondary'}>
                        {phase.priority.toUpperCase()} PRIORITY
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {phase.duration}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {phase.actions.map((action, j) => (
                      <li key={j} className="flex items-center gap-2">
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="industry" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-purple-600" />
                  Industry-Specific Risk Factors
                </CardTitle>
                <CardDescription>
                  Based on your industry ({assessmentData.industryType}), these are the specific risk factors you should be aware of
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {result.industrySpecificRisks.map((risk, i) => (
                    <li key={i} className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
                      <AlertCircle className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Priority Violations to Address</CardTitle>
                <CardDescription>
                  Based on your violation profile, these are the most critical issues to fix
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.priorityViolations.map((violation, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Badge variant={violation.includes('Critical') ? 'destructive' : 'secondary'} className="mt-0.5">
                        {violation.split(':')[0]}
                      </Badge>
                      <span className="text-sm">{violation.split(':')[1] || violation}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="statistics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                  2024-2025 ADA Website Lawsuit Statistics
                </CardTitle>
                <CardDescription>
                  Latest data from UsableNet, ADA Title III, and federal court filings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Key Stats Grid */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200">
                    <div className="text-3xl font-bold text-blue-600">
                      {LAWSUIT_STATISTICS.totalLawsuits2024.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Total lawsuits in 2024</div>
                    <div className="text-xs text-blue-600 mt-1">
                      ↑ {LAWSUIT_STATISTICS.yearOverYearGrowth2024}% from 2023
                    </div>
                  </div>
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200">
                    <div className="text-3xl font-bold text-red-600">
                      {LAWSUIT_STATISTICS.midYear2025Lawsuits.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Lawsuits (Jan-Jun 2025)</div>
                    <div className="text-xs text-red-600 mt-1">
                      ↑ {LAWSUIT_STATISTICS.midYear2025Growth}% surge vs 2024
                    </div>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200">
                    <div className="text-2xl font-bold text-green-600">
                      ~${LAWSUIT_STATISTICS.typicalSettlement.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Typical settlement</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Range: ${LAWSUIT_STATISTICS.averageSettlement.low.toLocaleString()} - ${LAWSUIT_STATISTICS.averageSettlement.high.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* State Distribution */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Lawsuits by State (2024)
                  </h4>
                  <div className="space-y-2">
                    {LAWSUIT_STATISTICS.topStates.map((state, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-28 text-sm font-medium">{state.name}</div>
                        <div className="flex-1">
                          <Progress value={state.percentage} className="h-3" />
                        </div>
                        <div className="w-20 text-sm text-right text-muted-foreground">
                          {state.count.toLocaleString()} ({state.percentage}%)
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Industry Distribution */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Most Targeted Industries (2024-2025)
                  </h4>
                  <div className="grid md:grid-cols-2 gap-2">
                    {LAWSUIT_STATISTICS.topIndustries.map((industry, i) => (
                      <div key={i} className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-800 rounded">
                        <div className="flex-1 text-sm">{industry.name}</div>
                        <Badge variant="secondary">{industry.percentage}%</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Insights */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-center">
                    <div className="text-2xl font-bold text-amber-600">{LAWSUIT_STATISTICS.overlayWidgetLawsuits}%</div>
                    <div className="text-xs text-muted-foreground">of lawsuits target sites using accessibility overlays/widgets</div>
                  </div>
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-600">{LAWSUIT_STATISTICS.smallBusinessTarget}%</div>
                    <div className="text-xs text-muted-foreground">target companies with &lt;$25M annual revenue</div>
                  </div>
                  <div className="p-3 bg-rose-50 dark:bg-rose-900/20 rounded-lg text-center">
                    <div className="text-2xl font-bold text-rose-600">{LAWSUIT_STATISTICS.repeatDefendants}%</div>
                    <div className="text-xs text-muted-foreground">of defendants have been sued multiple times</div>
                  </div>
                </div>

                {/* Legal Note */}
                <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Gavel className="w-5 h-5 text-slate-500 mt-0.5" />
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      <strong>2024 DOJ Final Rule:</strong> In April 2024, the DOJ issued its final rule under 
                      ADA Title II requiring state and local government web content and mobile apps to conform 
                      to WCAG 2.1 Level AA. Compliance deadlines: 2 years for entities with 50,000+ population, 
                      3 years for smaller entities. This signals increased enforcement expectations for private sector as well.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Sources Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-green-600" />
                  Data Sources & Methodology
                </CardTitle>
                <CardDescription>
                  This assessment is based on authoritative sources and established standards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {DATA_SOURCES.map((source, i) => (
                    <a
                      key={i}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-3 p-3 border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                    >
                      <ExternalLink className="w-4 h-4 text-muted-foreground mt-0.5 group-hover:text-primary" />
                      <div>
                        <div className="font-medium text-sm group-hover:text-primary">{source.name}</div>
                        <div className="text-xs text-muted-foreground">{source.description}</div>
                      </div>
                    </a>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-xs text-blue-700 dark:text-blue-300">
                    <strong>Methodology:</strong> Risk scores are calculated using weighted factors including 
                    industry litigation rates, violation severity (based on WCAG impact levels), compliance 
                    status, traffic exposure, and jurisdictional legal climate. Financial estimates are derived 
                    from settlement data analysis and defense cost averages from published case outcomes.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Export & Actions */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => exportReport('pdf')} className="flex-1 sm:flex-none">
                <FileText className="w-4 h-4 mr-2" />
                Download PDF Report
              </Button>
              <Button onClick={() => exportReport('excel')} variant="outline" className="flex-1 sm:flex-none">
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Download Excel Report
              </Button>
              <Button onClick={() => setShowResults(false)} variant="outline" className="flex-1 sm:flex-none">
                <ChevronRight className="w-4 h-4 mr-2 rotate-180" />
                Start New Assessment
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <p className="text-xs text-center text-muted-foreground">
          This assessment is for informational purposes only and does not constitute legal advice. 
          Consult with a qualified attorney for specific legal guidance regarding ADA compliance.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Sample Data Banner */}
      <Card className="border-dashed border-2 border-amber-500/30 bg-gradient-to-r from-amber-500/5 to-orange-500/10">
        <CardContent className="py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <Sparkles className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="font-medium">New to this tool?</p>
                <p className="text-sm text-muted-foreground">Load sample data to see how the risk assessment works</p>
              </div>
            </div>
            <Button onClick={loadSampleData} variant="outline" size="sm" className="border-amber-500/50 hover:bg-amber-500/10">
              <Sparkles className="w-4 h-4 mr-2" />
              Load Sample Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Methodology Introduction */}
      <Card className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 border-blue-200">
        <CardContent className="py-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-600 rounded-xl">
              <Scale className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">Assessment Methodology</h3>
              <p className="text-sm text-muted-foreground mb-3">
                This tool calculates your ADA compliance risk based on the following weighted factors:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {Object.entries(RISK_FACTOR_WEIGHTS).map(([factor, weight]) => (
                  <div key={factor} className="text-center p-2 bg-white dark:bg-slate-800 rounded-lg">
                    <div className="text-lg font-bold text-blue-600">{weight}%</div>
                    <div className="text-xs text-muted-foreground capitalize">
                      {factor.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Based on DOJ 2024 guidance, WCAG 2.2 standards, and analysis of {LAWSUIT_STATISTICS.totalLawsuits2024.toLocaleString()}+ lawsuits in 2024
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress Indicator */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:!flex-row items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-1 sm:gap-2">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <button
                    onClick={() => setCurrentStep(step)}
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold transition-all text-sm sm:text-base ${
                      step === currentStep 
                        ? 'bg-blue-600 text-white scale-110' 
                        : step < currentStep 
                          ? 'bg-green-600 text-white' 
                          : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                    }`}
                  >
                    {step < currentStep ? <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" /> : step}
                  </button>
                  {step < totalSteps && (
                    <div className={`w-6 sm:w-12 h-1 ${step < currentStep ? 'bg-green-600' : 'bg-slate-200'}`} />
                  )}
                </div>
              ))}
            </div>
            <Badge variant="outline" className="text-sm w-full sm:w-auto justify-center">
              Step {currentStep} of {totalSteps}
            </Badge>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            {currentStep === 1 && "Organization Profile"}
            {currentStep === 2 && "Website & Digital Presence"}
            {currentStep === 3 && "Accessibility Status"}
            {currentStep === 4 && "Review & Calculate"}
          </div>
        </CardContent>
      </Card>

      {/* Step 1: Organization Profile */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              Organization Profile
            </CardTitle>
            <CardDescription>
              Your industry and business characteristics significantly impact your legal risk exposure
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="industryType">Industry Type *</Label>
                <Select
                  value={assessmentData.industryType || 'other'}
                  onValueChange={(value) => updateField('industryType', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="government">Government / Public Sector</SelectItem>
                    <SelectItem value="healthcare">Healthcare / Medical</SelectItem>
                    <SelectItem value="finance">Finance / Banking / Insurance</SelectItem>
                    <SelectItem value="education">Education (K-12, Higher Ed)</SelectItem>
                    <SelectItem value="ecommerce">Retail / E-commerce</SelectItem>
                    <SelectItem value="saas">SaaS / Technology</SelectItem>
                    <SelectItem value="content">Media / Entertainment / Content</SelectItem>
                    <SelectItem value="nonprofit">Non-profit / NGO</SelectItem>
                    <SelectItem value="other">Other Industry</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  E-commerce accounts for 77% of ADA website lawsuits
                </p>
              </div>
              <div>
                <Label htmlFor="companySize">Company Size</Label>
                <Select
                  value={assessmentData.companySize || 'small'}
                  onValueChange={(value) => updateField('companySize', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="startup">Startup (1-10 employees)</SelectItem>
                    <SelectItem value="small">Small (11-50 employees)</SelectItem>
                    <SelectItem value="medium">Medium (51-500 employees)</SelectItem>
                    <SelectItem value="large">Large (500+ employees)</SelectItem>
                    <SelectItem value="enterprise">Enterprise (5000+ employees)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="annualRevenue">Annual Revenue</Label>
                <Select
                  value={assessmentData.annualRevenue || 'under-1m'}
                  onValueChange={(value) => updateField('annualRevenue', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under-1m">Under $1 Million</SelectItem>
                    <SelectItem value="1m-10m">$1M - $10 Million</SelectItem>
                    <SelectItem value="10m-50m">$10M - $50 Million</SelectItem>
                    <SelectItem value="50m-100m">$50M - $100 Million</SelectItem>
                    <SelectItem value="over-100m">Over $100 Million</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  Higher revenue increases potential damages in lawsuits
                </p>
              </div>
              <div>
                <Label htmlFor="geographicLocation">Primary Operating Region</Label>
                <Select
                  value={assessmentData.geographicLocation || 'us'}
                  onValueChange={(value) => updateField('geographicLocation', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us">United States (ADA applies)</SelectItem>
                    <SelectItem value="california">California (Unruh Act - higher damages)</SelectItem>
                    <SelectItem value="newyork">New York (NYSHRL - stricter)</SelectItem>
                    <SelectItem value="eu">European Union (EAA applies)</SelectItem>
                    <SelectItem value="canada">Canada (AODA, ACA)</SelectItem>
                    <SelectItem value="australia">Australia (DDA)</SelectItem>
                    <SelectItem value="global">Global Operations</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t">
              <Label>Business Characteristics</Label>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasPhysicalLocation"
                    checked={assessmentData.hasPhysicalLocation || false}
                    onCheckedChange={(checked) => updateField('hasPhysicalLocation', checked)}
                  />
                  <label htmlFor="hasPhysicalLocation" className="text-sm cursor-pointer">
                    Has physical location(s) open to public
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="providesServices"
                    checked={assessmentData.providesServices || false}
                    onCheckedChange={(checked) => updateField('providesServices', checked)}
                  />
                  <label htmlFor="providesServices" className="text-sm cursor-pointer">
                    Provides services to the public
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="previousLawsuits"
                    checked={assessmentData.previousLawsuits || false}
                    onCheckedChange={(checked) => updateField('previousLawsuits', checked)}
                  />
                  <label htmlFor="previousLawsuits" className="text-sm cursor-pointer">
                    Has received accessibility complaints/lawsuits
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasLegalCounsel"
                    checked={assessmentData.hasLegalCounsel || false}
                    onCheckedChange={(checked) => updateField('hasLegalCounsel', checked)}
                  />
                  <label htmlFor="hasLegalCounsel" className="text-sm cursor-pointer">
                    Has legal counsel familiar with ADA
                  </label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Website & Digital Presence */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-600" />
              Website & Digital Presence
            </CardTitle>
            <CardDescription>
              Your digital footprint affects your exposure to accessibility lawsuits
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="websiteType">Primary Website Type *</Label>
                <Select
                  value={assessmentData.websiteType || 'other'}
                  onValueChange={(value) => updateField('websiteType', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ecommerce">E-commerce / Online Store</SelectItem>
                    <SelectItem value="saas">SaaS / Web Application</SelectItem>
                    <SelectItem value="content">Content / Blog / News</SelectItem>
                    <SelectItem value="corporate">Corporate / Business</SelectItem>
                    <SelectItem value="government">Government Portal</SelectItem>
                    <SelectItem value="healthcare">Healthcare / Patient Portal</SelectItem>
                    <SelectItem value="education">Educational / LMS</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="trafficVolume">Monthly Traffic Volume</Label>
                <Select
                  value={assessmentData.trafficVolume || 'medium'}
                  onValueChange={(value) => updateField('trafficVolume', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low (&lt; 1,000/month)</SelectItem>
                    <SelectItem value="medium">Medium (1K - 100K/month)</SelectItem>
                    <SelectItem value="high">High (100K - 1M/month)</SelectItem>
                    <SelectItem value="very-high">Very High (&gt; 1M/month)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  Higher traffic = more potential plaintiffs
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t">
              <Label>Digital Features (check all that apply)</Label>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="acceptsOnlinePayments"
                    checked={assessmentData.acceptsOnlinePayments || false}
                    onCheckedChange={(checked) => updateField('acceptsOnlinePayments', checked)}
                  />
                  <label htmlFor="acceptsOnlinePayments" className="text-sm cursor-pointer">
                    Accepts online payments / transactions
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasUserAccounts"
                    checked={assessmentData.hasUserAccounts || false}
                    onCheckedChange={(checked) => updateField('hasUserAccounts', checked)}
                  />
                  <label htmlFor="hasUserAccounts" className="text-sm cursor-pointer">
                    Has user accounts / login functionality
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasThirdPartyContent"
                    checked={assessmentData.hasThirdPartyContent || false}
                    onCheckedChange={(checked) => updateField('hasThirdPartyContent', checked)}
                  />
                  <label htmlFor="hasThirdPartyContent" className="text-sm cursor-pointer">
                    Includes third-party widgets/content
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasVideoContent"
                    checked={assessmentData.hasVideoContent || false}
                    onCheckedChange={(checked) => updateField('hasVideoContent', checked)}
                  />
                  <label htmlFor="hasVideoContent" className="text-sm cursor-pointer">
                    Contains video/multimedia content
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasMobileApp"
                    checked={assessmentData.hasMobileApp || false}
                    onCheckedChange={(checked) => updateField('hasMobileApp', checked)}
                  />
                  <label htmlFor="hasMobileApp" className="text-sm cursor-pointer">
                    Has mobile application(s)
                  </label>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm">
                  <strong>Why this matters:</strong> Features like payment processing, user accounts, and 
                  video content have specific accessibility requirements. Third-party content can introduce 
                  accessibility issues outside your direct control.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Accessibility Status */}
      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              Current Accessibility Status
            </CardTitle>
            <CardDescription>
              Your current compliance level and known issues directly impact your risk score
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="currentWCAG">Current WCAG Conformance Level</Label>
                <Select
                  value={assessmentData.currentWCAGLevel || 'none'}
                  onValueChange={(value) => updateField('currentWCAGLevel', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None / Unknown / Never Tested</SelectItem>
                    <SelectItem value="A">Level A (Minimum - 30 criteria)</SelectItem>
                    <SelectItem value="AA">Level AA (Standard - 50 criteria)</SelectItem>
                    <SelectItem value="AAA">Level AAA (Enhanced - 78 criteria)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  DOJ and courts typically require WCAG 2.1 Level AA compliance
                </p>
              </div>
              <div>
                <Label htmlFor="lastAudit">Last Professional Accessibility Audit</Label>
                <Input
                  id="lastAudit"
                  type="date"
                  value={assessmentData.lastAuditDate || ''}
                  onChange={(e) => updateField('lastAuditDate', e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Recent audits demonstrate good faith effort
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t">
              <Label>Compliance Measures in Place</Label>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasStatement"
                    checked={assessmentData.hasAccessibilityStatement || false}
                    onCheckedChange={(checked) => updateField('hasAccessibilityStatement', checked)}
                  />
                  <label htmlFor="hasStatement" className="text-sm cursor-pointer">
                    Published accessibility statement
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasProgram"
                    checked={assessmentData.hasComplianceProgram || false}
                    onCheckedChange={(checked) => updateField('hasComplianceProgram', checked)}
                  />
                  <label htmlFor="hasProgram" className="text-sm cursor-pointer">
                    Documented accessibility compliance program
                  </label>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <Label className="mb-3 block">Known Accessibility Violations</Label>
              <p className="text-sm text-muted-foreground mb-4">
                Enter the count of known violations from your latest audit (if available). 
                If unknown, leave at 0 - but note this may underestimate your risk.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="critical" className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-600"></div>
                    Critical
                  </Label>
                  <Input
                    id="critical"
                    type="number"
                    min="0"
                    value={assessmentData.knownViolations?.critical || 0}
                    onChange={(e) => updateViolations('critical', parseInt(e.target.value) || 0)}
                    className="text-center"
                  />
                  <p className="text-xs text-muted-foreground text-center">Blocks access</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="serious" className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-600"></div>
                    Serious
                  </Label>
                  <Input
                    id="serious"
                    type="number"
                    min="0"
                    value={assessmentData.knownViolations?.serious || 0}
                    onChange={(e) => updateViolations('serious', parseInt(e.target.value) || 0)}
                    className="text-center"
                  />
                  <p className="text-xs text-muted-foreground text-center">Major barriers</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="moderate" className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-600"></div>
                    Moderate
                  </Label>
                  <Input
                    id="moderate"
                    type="number"
                    min="0"
                    value={assessmentData.knownViolations?.moderate || 0}
                    onChange={(e) => updateViolations('moderate', parseInt(e.target.value) || 0)}
                    className="text-center"
                  />
                  <p className="text-xs text-muted-foreground text-center">Some difficulty</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minor" className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                    Minor
                  </Label>
                  <Input
                    id="minor"
                    type="number"
                    min="0"
                    value={assessmentData.knownViolations?.minor || 0}
                    onChange={(e) => updateViolations('minor', parseInt(e.target.value) || 0)}
                    className="text-center"
                  />
                  <p className="text-xs text-muted-foreground text-center">Nuisance issues</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Review */}
      {currentStep === 4 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Review Your Information
            </CardTitle>
            <CardDescription>
              Please review your inputs before calculating your risk assessment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <Building2 className="w-4 h-4" /> Organization
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Industry:</span>
                    <span className="font-medium capitalize">{assessmentData.industryType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Company Size:</span>
                    <span className="font-medium capitalize">{assessmentData.companySize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Revenue:</span>
                    <span className="font-medium">{assessmentData.annualRevenue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location:</span>
                    <span className="font-medium uppercase">{assessmentData.geographicLocation}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <Globe className="w-4 h-4" /> Digital Presence
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Website Type:</span>
                    <span className="font-medium capitalize">{assessmentData.websiteType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Traffic:</span>
                    <span className="font-medium capitalize">{assessmentData.trafficVolume}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Online Payments:</span>
                    <span className="font-medium">{assessmentData.acceptsOnlinePayments ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">User Accounts:</span>
                    <span className="font-medium">{assessmentData.hasUserAccounts ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <Shield className="w-4 h-4" /> Compliance Status
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">WCAG Level:</span>
                    <span className="font-medium">{assessmentData.currentWCAGLevel === 'none' ? 'None' : `Level ${assessmentData.currentWCAGLevel}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Statement:</span>
                    <span className="font-medium">{assessmentData.hasAccessibilityStatement ? 'Published' : 'None'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Compliance Program:</span>
                    <span className="font-medium">{assessmentData.hasComplianceProgram ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> Known Violations
                </h4>
                <div className="grid grid-cols-4 gap-2">
                  <div className="text-center p-2 bg-red-50 dark:bg-red-900/20 rounded">
                    <div className="text-lg font-bold text-red-600">{assessmentData.knownViolations?.critical || 0}</div>
                    <div className="text-xs text-muted-foreground">Critical</div>
                  </div>
                  <div className="text-center p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
                    <div className="text-lg font-bold text-orange-600">{assessmentData.knownViolations?.serious || 0}</div>
                    <div className="text-xs text-muted-foreground">Serious</div>
                  </div>
                  <div className="text-center p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                    <div className="text-lg font-bold text-yellow-600">{assessmentData.knownViolations?.moderate || 0}</div>
                    <div className="text-xs text-muted-foreground">Moderate</div>
                  </div>
                  <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    <div className="text-lg font-bold text-blue-600">{assessmentData.knownViolations?.minor || 0}</div>
                    <div className="text-xs text-muted-foreground">Minor</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                <div className="text-sm">
                  <strong>Important:</strong> This assessment provides an estimate based on the information 
                  provided and general industry patterns. Actual legal risk depends on many factors. 
                  Consult with a qualified attorney for specific legal advice.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex flex-col-reverse gap-3 sm:!flex-row sm:justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
          className="w-full sm:w-auto"
        >
          ← Previous
        </Button>
        {currentStep < totalSteps ? (
          <Button onClick={nextStep} className="w-full sm:w-auto">
            Next →
          </Button>
        ) : (
          <Button onClick={calculateRisk} size="lg" className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
            <Shield className="w-5 h-5 mr-2" />
            Calculate Risk Assessment
          </Button>
        )}
      </div>
    </div>
  )
}
