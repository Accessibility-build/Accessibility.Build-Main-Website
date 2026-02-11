"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { 
  FileText, 
  Download, 
  Copy, 
  ChevronRight, 
  ChevronLeft,
  CheckCircle,
  Sparkles,
  Database,
  Loader2,
  RefreshCw
} from "lucide-react"
import { 
  generateStatementHTML, 
  generateStatementMarkdown, 
  generateStatementPlainText,
  type StatementData,
  type StatementTemplate
} from "@/lib/accessibility-statement-templates"
import { toast } from "sonner"

interface AuditHistoryItem {
  id: string
  url: string
  title?: string | null
  status: string
  overallScore?: number | null
  totalViolations?: number | null
  criticalCount?: number | null
  seriousCount?: number | null
  moderateCount?: number | null
  minorCount?: number | null
  createdAt: string
  processingCompletedAt?: string | null
  aiSummary?: string | null
}

interface AuditHistoryResponse {
  audits?: AuditHistoryItem[]
}

const DEFAULT_TESTING_METHODS = [
  "Automated accessibility scan using Accessibility.build URL Accessibility Auditor",
  "Manual keyboard navigation testing",
  "Screen reader testing (NVDA, JAWS, VoiceOver)"
]

const formatDateInputValue = (input?: string | null): string => {
  if (!input) return ""
  const date = new Date(input)
  if (Number.isNaN(date.getTime())) return ""
  return date.toISOString().split("T")[0]
}

const formatDisplayDate = (input?: string | null): string => {
  if (!input) return new Date().toLocaleDateString()
  const date = new Date(input)
  if (Number.isNaN(date.getTime())) return new Date().toLocaleDateString()
  return date.toLocaleDateString()
}

const deriveOrganizationName = (audit: AuditHistoryItem): string => {
  if (audit.title?.trim()) {
    return audit.title.trim()
  }

  try {
    const hostname = new URL(audit.url).hostname.replace(/^www\./, "")
    const label = hostname.split(".")[0] ?? hostname
    return label
      .split(/[-_]/)
      .filter(Boolean)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  } catch {
    return ""
  }
}

const buildKnownLimitations = (audit: AuditHistoryItem): string[] => {
  const critical = audit.criticalCount ?? 0
  const serious = audit.seriousCount ?? 0
  const moderate = audit.moderateCount ?? 0
  const minor = audit.minorCount ?? 0

  const limitations: string[] = []
  if (critical > 0) {
    limitations.push(`${critical} critical issue(s) were detected in the latest scan and may block users of assistive technology on key journeys.`)
  }
  if (serious > 0) {
    limitations.push(`${serious} serious issue(s) remain and can significantly impact usability for keyboard and screen reader users.`)
  }
  if (moderate > 0) {
    limitations.push(`${moderate} moderate issue(s) were found and are scheduled for remediation in upcoming releases.`)
  }
  if (minor > 0) {
    limitations.push(`${minor} minor issue(s) were identified and are being addressed during routine maintenance.`)
  }
  return limitations
}

const buildPartialConformanceSummary = (audit: AuditHistoryItem): string => {
  const totalViolations = audit.totalViolations ?? 0
  if (totalViolations <= 0) return ""

  const issueBreakdown = [
    `${audit.criticalCount ?? 0} critical`,
    `${audit.seriousCount ?? 0} serious`,
    `${audit.moderateCount ?? 0} moderate`,
    `${audit.minorCount ?? 0} minor`
  ].join(", ")

  return `Automated testing identified ${totalViolations} issue(s) (${issueBreakdown}). Remediation is actively in progress.`
}

const buildAiSummarySnippet = (summary?: string | null): string => {
  const trimmed = summary?.trim()
  if (!trimmed) return ""
  if (trimmed.length <= 240) return trimmed
  return `${trimmed.slice(0, 237)}...`
}

export default function AccessibilityStatementGenerator() {
  const [currentStep, setCurrentStep] = useState(1)
  const [template, setTemplate] = useState<StatementTemplate>('comprehensive')
  const [previewFormat, setPreviewFormat] = useState<'html' | 'markdown' | 'text'>('html')
  const [auditHistory, setAuditHistory] = useState<AuditHistoryItem[]>([])
  const [selectedAuditId, setSelectedAuditId] = useState('')
  const [isLoadingAudits, setIsLoadingAudits] = useState(true)
  const [auditLoadMessage, setAuditLoadMessage] = useState('')
  const [statementData, setStatementData] = useState<Partial<StatementData>>({
    organizationName: '',
    websiteUrl: '',
    contactEmail: '',
    contactPhone: '',
    conformanceLevel: 'AA',
    testingMethods: [],
    knownLimitations: [],
    feedbackMechanism: 'email',
    lastUpdated: new Date().toLocaleDateString(),
    standards: ['WCAG 2.2 Level AA'],
    technologies: ['HTML', 'CSS', 'JavaScript']
  })

  const totalSteps = 4

  const selectedAudit = useMemo(
    () => auditHistory.find((audit) => audit.id === selectedAuditId),
    [auditHistory, selectedAuditId]
  )

  const loadAuditHistory = async () => {
    setIsLoadingAudits(true)
    setAuditLoadMessage('')

    try {
      const response = await fetch('/api/user/audit-history', {
        method: 'GET',
        headers: { Accept: 'application/json' }
      })

      if (response.status === 401) {
        setAuditHistory([])
        setSelectedAuditId('')
        setAuditLoadMessage('Sign in to import scan results from your audit history.')
        return
      }

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      const payload = await response.json() as AuditHistoryResponse
      const completedAudits = (payload.audits ?? []).filter(audit => audit.status === 'completed')
      setAuditHistory(completedAudits)
      setSelectedAuditId(previous =>
        previous && completedAudits.some(audit => audit.id === previous)
          ? previous
          : (completedAudits[0]?.id ?? '')
      )

      if (completedAudits.length === 0) {
        setAuditLoadMessage('No completed URL accessibility scans found yet.')
      }
    } catch (error) {
      console.error('Failed to load audit history for statement generator:', error)
      setAuditHistory([])
      setSelectedAuditId('')
      setAuditLoadMessage('Unable to load scan history right now. Try again in a moment.')
    } finally {
      setIsLoadingAudits(false)
    }
  }

  useEffect(() => {
    void loadAuditHistory()
  }, [])

  const importSelectedAudit = () => {
    if (!selectedAudit) {
      toast.error('Select a completed scan first.')
      return
    }

    const totalViolations = selectedAudit.totalViolations ?? 0
    const conformanceLevel: StatementData['conformanceLevel'] = totalViolations > 0 ? 'Partial' : 'AA'
    const referenceDate = selectedAudit.processingCompletedAt ?? selectedAudit.createdAt
    const aiSummarySnippet = buildAiSummarySnippet(selectedAudit.aiSummary)

    setStatementData((previous) => ({
      ...previous,
      organizationName: previous.organizationName || deriveOrganizationName(selectedAudit),
      websiteUrl: selectedAudit.url,
      conformanceLevel,
      partialConformance: conformanceLevel === 'Partial'
        ? `${buildPartialConformanceSummary(selectedAudit)}${aiSummarySnippet ? ` ${aiSummarySnippet}` : ''}`
        : '',
      testingMethods: DEFAULT_TESTING_METHODS,
      testingDate: formatDateInputValue(referenceDate),
      knownLimitations: buildKnownLimitations(selectedAudit),
      lastUpdated: formatDisplayDate(referenceDate),
      standards: previous.standards && previous.standards.length > 0
        ? previous.standards
        : ['WCAG 2.2 Level AA']
    }))

    setCurrentStep(1)
    toast.success('Scan data imported. Complete contact details and export your statement.')
  }

  // Load sample data for demonstration
  const loadSampleData = () => {
    setStatementData({
      organizationName: 'TechCorp Solutions',
      websiteUrl: 'https://www.techcorp-solutions.example.com',
      contactEmail: 'accessibility@techcorp-solutions.example.com',
      contactPhone: '+1 (555) 123-4567',
      conformanceLevel: 'AA',
      partialConformance: '',
      testingMethods: [
        'Automated testing (axe-core, WAVE, Lighthouse)',
        'Manual keyboard navigation testing',
        'Screen reader testing (NVDA, JAWS, VoiceOver)',
        'Color contrast analysis',
        'Expert accessibility review'
      ],
      knownLimitations: [
        'Some older PDF documents may not be fully accessible. We are working to remediate these.',
        'Third-party widgets embedded on certain pages may have limited accessibility support.',
        'Live chat feature has limited screen reader support - email is recommended for assistive technology users.'
      ],
      feedbackMechanism: 'multiple',
      feedbackUrl: 'https://www.techcorp-solutions.example.com/accessibility-feedback',
      lastUpdated: new Date().toLocaleDateString(),
      testingDate: new Date().toISOString().split('T')[0],
      standards: ['WCAG 2.2 Level AA', 'Section 508', 'ADA Compliance'],
      technologies: ['HTML', 'CSS', 'JavaScript', 'React']
    })
    setCurrentStep(4) // Jump to preview step
    toast.success('Sample data loaded! You can now preview and export the statement.')
  }

  const updateField = <K extends keyof StatementData>(field: K, value: StatementData[K]) => {
    setStatementData(prev => ({ ...prev, [field]: value }))
  }

  const toggleArrayItem = (field: 'testingMethods' | 'knownLimitations' | 'standards' | 'technologies', item: string) => {
    const current = statementData[field] || []
    const updated = current.includes(item)
      ? current.filter(i => i !== item)
      : [...current, item]
    updateField(field, updated)
  }

  const generatePreview = () => {
    const data = statementData as StatementData
    if (!data.organizationName || !data.websiteUrl || !data.contactEmail) {
      return 'Please complete all required fields to generate preview.'
    }

    switch (previewFormat) {
      case 'html':
        return generateStatementHTML(data, template)
      case 'markdown':
        return generateStatementMarkdown(data, template)
      case 'text':
        return generateStatementPlainText(data)
      default:
        return ''
    }
  }

  const exportStatement = (format: 'html' | 'markdown' | 'text' | 'pdf') => {
    const data = statementData as StatementData
    if (!data.organizationName || !data.websiteUrl || !data.contactEmail) {
      toast.error('Please complete all required fields')
      return
    }

    let content = ''
    let filename = ''
    let mimeType = ''

    switch (format) {
      case 'html':
        content = generateStatementHTML(data, template)
        filename = `accessibility-statement-${data.organizationName.toLowerCase().replace(/\s+/g, '-')}.html`
        mimeType = 'text/html'
        break
      case 'markdown':
        content = generateStatementMarkdown(data, template)
        filename = `accessibility-statement-${data.organizationName.toLowerCase().replace(/\s+/g, '-')}.md`
        mimeType = 'text/markdown'
        break
      case 'text':
        content = generateStatementPlainText(data)
        filename = `accessibility-statement-${data.organizationName.toLowerCase().replace(/\s+/g, '-')}.txt`
        mimeType = 'text/plain'
        break
      case 'pdf':
        // For PDF, we'll generate HTML and let the browser print it
        content = generateStatementHTML(data, template)
        const printWindow = window.open('', '_blank')
        if (printWindow) {
          printWindow.document.write(content)
          printWindow.document.close()
          printWindow.print()
        }
        toast.success('PDF generation opened in print dialog')
        return
    }

    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success(`${format.toUpperCase()} file downloaded successfully`)
  }

  const copyToClipboard = () => {
    const preview = generatePreview()
    navigator.clipboard.writeText(preview)
    toast.success('Copied to clipboard')
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const testingMethodOptions = [
    'Automated testing (axe-core, WAVE, Lighthouse)',
    'Manual keyboard navigation testing',
    'Screen reader testing (NVDA, JAWS, VoiceOver)',
    'Color contrast analysis',
    'User testing with people with disabilities',
    'Expert accessibility review',
    'WCAG 2.2 compliance audit'
  ]

  const standardOptions = [
    'WCAG 2.2 Level A',
    'WCAG 2.2 Level AA',
    'WCAG 2.2 Level AAA',
    'Section 508',
    'EN 301 549',
    'ADA Compliance'
  ]

  const technologyOptions = [
    'HTML',
    'CSS',
    'JavaScript',
    'React',
    'Vue',
    'Angular',
    'WordPress',
    'Drupal',
    'Other CMS'
  ]

  return (
    <div className="space-y-6">
      {/* Import from Scan Results */}
      <Card className="border border-border/60">
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1.5">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Database className="h-5 w-5 text-primary" />
                Import from Recent Scan
              </CardTitle>
              <CardDescription>
                Pull completed URL audit results directly into this statement to generate client-ready compliance copy faster.
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => void loadAuditHistory()}
              disabled={isLoadingAudits}
            >
              {isLoadingAudits ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoadingAudits ? (
            <div className="flex items-center gap-2 rounded-md border border-dashed border-border/80 bg-muted/20 p-3 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading completed scans...
            </div>
          ) : auditHistory.length === 0 ? (
            <div className="rounded-md border border-dashed border-border/80 bg-muted/20 p-3 text-sm text-muted-foreground">
              {auditLoadMessage || 'No completed scans available yet. Run a URL accessibility audit first.'}
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-[1fr_auto]">
              <Select value={selectedAuditId} onValueChange={setSelectedAuditId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a completed URL scan" />
                </SelectTrigger>
                <SelectContent>
                  {auditHistory.map((audit) => {
                    const issues = audit.totalViolations ?? 0
                    const score = audit.overallScore ?? null
                    const date = formatDisplayDate(audit.processingCompletedAt ?? audit.createdAt)

                    return (
                      <SelectItem key={audit.id} value={audit.id}>
                        {`${audit.url} • ${issues} issue${issues === 1 ? '' : 's'}${score !== null ? ` • Score ${score}` : ''} • ${date}`}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
              <Button onClick={importSelectedAudit} disabled={!selectedAuditId}>
                <Database className="mr-2 h-4 w-4" />
                Import Scan
              </Button>
            </div>
          )}
          {selectedAudit ? (
            <p className="text-xs text-muted-foreground">
              Selected scan summary: {selectedAudit.totalViolations ?? 0} issues (
              {selectedAudit.criticalCount ?? 0} critical, {selectedAudit.seriousCount ?? 0} serious,{' '}
              {selectedAudit.moderateCount ?? 0} moderate, {selectedAudit.minorCount ?? 0} minor).
            </p>
          ) : null}
        </CardContent>
      </Card>

      {/* Sample Data Banner */}
      <Card className="border border-dashed border-border/80 bg-muted/20">
        <CardContent className="py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">New to accessibility statements?</p>
                <p className="text-sm text-muted-foreground">Load sample data to see how the generator works</p>
              </div>
            </div>
            <Button onClick={loadSampleData} variant="outline" size="sm">
              <Sparkles className="mr-2 h-4 w-4" />
              Load Sample Statement
            </Button>
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
                  <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-semibold text-sm sm:text-base ${
                    step === currentStep 
                      ? 'bg-primary text-primary-foreground' 
                      : step < currentStep 
                        ? 'bg-emerald-600 text-white dark:bg-emerald-500' 
                        : 'bg-muted text-muted-foreground'
                  }`}>
                    {step < currentStep ? <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" /> : step}
                  </div>
                  {step < totalSteps && (
                    <div className={`w-6 sm:w-16 h-1 ${step < currentStep ? 'bg-emerald-600 dark:bg-emerald-500' : 'bg-muted'}`} />
                  )}
                </div>
              ))}
            </div>
            <Badge variant="outline" className="text-sm w-full sm:w-auto justify-center">
              Step {currentStep} of {totalSteps}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Step 1: Organization & Contact */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Organization & Contact Information</CardTitle>
            <CardDescription>Basic information about your organization and how users can contact you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="orgName">Organization Name *</Label>
              <Input
                id="orgName"
                value={statementData.organizationName || ''}
                onChange={(e) => updateField('organizationName', e.target.value)}
                placeholder="Your Company Name"
              />
            </div>
            <div>
              <Label htmlFor="websiteUrl">Website URL *</Label>
              <Input
                id="websiteUrl"
                type="url"
                value={statementData.websiteUrl || ''}
                onChange={(e) => updateField('websiteUrl', e.target.value)}
                placeholder="https://example.com"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="contactEmail">Contact Email *</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={statementData.contactEmail || ''}
                  onChange={(e) => updateField('contactEmail', e.target.value)}
                  placeholder="accessibility@example.com"
                />
              </div>
              <div>
                <Label htmlFor="contactPhone">Contact Phone</Label>
                <Input
                  id="contactPhone"
                  type="tel"
                  value={statementData.contactPhone || ''}
                  onChange={(e) => updateField('contactPhone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Conformance & Standards */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Conformance & Standards</CardTitle>
            <CardDescription>Specify your WCAG conformance level and applicable standards</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="conformanceLevel">WCAG Conformance Level *</Label>
              <Select
                value={statementData.conformanceLevel || 'AA'}
                onValueChange={(value) => updateField('conformanceLevel', value as StatementData['conformanceLevel'])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">Level A (Minimum)</SelectItem>
                  <SelectItem value="AA">Level AA (Standard - Recommended)</SelectItem>
                  <SelectItem value="AAA">Level AAA (Enhanced)</SelectItem>
                  <SelectItem value="Partial">Partial Conformance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {statementData.conformanceLevel === 'Partial' && (
              <div>
                <Label htmlFor="partialConformance">Partial Conformance Details</Label>
                <Textarea
                  id="partialConformance"
                  value={statementData.partialConformance || ''}
                  onChange={(e) => updateField('partialConformance', e.target.value)}
                  placeholder="Describe which parts of your website conform and which do not"
                />
              </div>
            )}
            <div>
              <Label>Applicable Standards</Label>
              <div className="grid grid-cols-1 gap-2 mt-2 sm:grid-cols-2">
                {standardOptions.map(standard => (
                  <div key={standard} className="flex items-center space-x-2">
                    <Checkbox
                      id={`standard-${standard}`}
                      checked={statementData.standards?.includes(standard) || false}
                      onCheckedChange={() => toggleArrayItem('standards', standard)}
                    />
                    <label htmlFor={`standard-${standard}`} className="text-sm cursor-pointer">
                      {standard}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="testingDate">Last Testing Date</Label>
              <Input
                id="testingDate"
                type="date"
                value={statementData.testingDate || ''}
                onChange={(e) => updateField('testingDate', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Testing & Limitations */}
      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Testing Methods & Known Limitations</CardTitle>
            <CardDescription>Describe how you tested accessibility and any known issues</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Testing Methods Used</Label>
              <div className="grid grid-cols-1 gap-2 mt-2">
                {testingMethodOptions.map(method => (
                  <div key={method} className="flex items-center space-x-2">
                    <Checkbox
                      id={`method-${method}`}
                      checked={statementData.testingMethods?.includes(method) || false}
                      onCheckedChange={() => toggleArrayItem('testingMethods', method)}
                    />
                    <label htmlFor={`method-${method}`} className="text-sm cursor-pointer">
                      {method}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="limitations">Known Limitations</Label>
              <Textarea
                id="limitations"
                value={statementData.knownLimitations?.join('\n') || ''}
                onChange={(e) => {
                  const items = e.target.value.split('\n').filter(item => item.trim())
                  updateField('knownLimitations', items)
                }}
                placeholder="Enter each limitation on a new line&#10;Example:&#10;Some PDF documents may not be fully accessible&#10;Third-party widgets may have accessibility issues"
                rows={6}
              />
              <p className="mt-1 text-xs text-muted-foreground">Enter each limitation on a new line</p>
            </div>
            <div>
              <Label>Technologies Used</Label>
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {technologyOptions.map(tech => (
                  <div key={tech} className="flex items-center space-x-2">
                    <Checkbox
                      id={`tech-${tech}`}
                      checked={statementData.technologies?.includes(tech) || false}
                      onCheckedChange={() => toggleArrayItem('technologies', tech)}
                    />
                    <label htmlFor={`tech-${tech}`} className="text-sm cursor-pointer">
                      {tech}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Feedback & Preview */}
      {currentStep === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>Feedback Mechanism & Preview</CardTitle>
            <CardDescription>Configure how users can provide feedback and preview your statement</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Feedback Method</Label>
              <Select
                value={statementData.feedbackMechanism || 'email'}
                onValueChange={(value) => updateField('feedbackMechanism', value as StatementData['feedbackMechanism'])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email Only</SelectItem>
                  <SelectItem value="form">Feedback Form</SelectItem>
                  <SelectItem value="phone">Phone Only</SelectItem>
                  <SelectItem value="multiple">Multiple Methods</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {statementData.feedbackMechanism === 'form' || statementData.feedbackMechanism === 'multiple' ? (
              <div>
                <Label htmlFor="feedbackUrl">Feedback Form URL</Label>
                <Input
                  id="feedbackUrl"
                  type="url"
                  value={statementData.feedbackUrl || ''}
                  onChange={(e) => updateField('feedbackUrl', e.target.value)}
                  placeholder="https://example.com/feedback"
                />
              </div>
            ) : null}
            <div>
              <Label>Statement Template</Label>
              <Select value={template} onValueChange={(value) => setTemplate(value as StatementTemplate)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic Statement</SelectItem>
                  <SelectItem value="comprehensive">Comprehensive (Recommended)</SelectItem>
                  <SelectItem value="legal">Legal/Compliance Focused</SelectItem>
                  <SelectItem value="developer">Developer Friendly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Preview Format</Label>
              <Tabs value={previewFormat} onValueChange={(value) => setPreviewFormat(value as 'html' | 'markdown' | 'text')}>
                <TabsList>
                  <TabsTrigger value="html">HTML</TabsTrigger>
                  <TabsTrigger value="markdown">Markdown</TabsTrigger>
                  <TabsTrigger value="text">Plain Text</TabsTrigger>
                </TabsList>
                <TabsContent value={previewFormat} className="mt-4">
                  <div className="max-h-96 overflow-auto rounded-lg border bg-muted/30 p-4">
                    {previewFormat === 'html' ? (
                      <iframe
                        srcDoc={generatePreview()}
                        className="w-full h-96 border-0"
                        title="HTML Preview"
                      />
                    ) : (
                      <pre className="text-sm whitespace-pre-wrap font-mono">
                        {generatePreview()}
                      </pre>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => exportStatement('html')}>
                <Download className="w-4 h-4 mr-2" />
                Download HTML
              </Button>
              <Button onClick={() => exportStatement('markdown')} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download Markdown
              </Button>
              <Button onClick={() => exportStatement('text')} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download Text
              </Button>
              <Button onClick={() => exportStatement('pdf')} variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Generate PDF
              </Button>
              <Button onClick={copyToClipboard} variant="outline">
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        {currentStep < totalSteps ? (
          <Button onClick={nextStep}>
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={() => setCurrentStep(1)} variant="outline">
            Start Over
          </Button>
        )}
      </div>
    </div>
  )
}
