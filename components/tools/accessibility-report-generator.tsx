"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { 
  FileText, 
  Download, 
  Upload,
  Plus,
  Trash2,
  Eye,
  Settings,
  FileSpreadsheet,
  FileCode,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  Sparkles
} from "lucide-react"
import { 
  generateReportHTML, 
  generateReportMarkdown,
  type ReportData
} from "@/lib/report-generator-templates"
import { toast } from "sonner"
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

interface Violation {
  id: string
  description: string
  impact: 'critical' | 'serious' | 'moderate' | 'minor'
  wcagCriteria: string[]
  elementCount?: number
  fixSuggestion?: string
}

export default function AccessibilityReportGenerator() {
  const [reportData, setReportData] = useState<Partial<ReportData>>({
    organizationName: '',
    websiteUrl: '',
    reportDate: new Date().toLocaleDateString(),
    reportType: 'executive',
    overallScore: undefined,
    totalViolations: 0,
    violations: [],
    summary: {
      critical: 0,
      serious: 0,
      moderate: 0,
      minor: 0
    },
    recommendations: [],
    nextSteps: []
  })

  const [newViolation, setNewViolation] = useState<Partial<Violation>>({
    id: '',
    description: '',
    impact: 'moderate',
    wcagCriteria: [],
    elementCount: 1
  })

  const [inputMethod, setInputMethod] = useState<'manual' | 'import'>('manual')
  const [previewFormat, setPreviewFormat] = useState<'html' | 'markdown'>('html')

  // Sample data for demonstration
  const loadSampleData = () => {
    const sampleViolations: Violation[] = [
      {
        id: 'color-contrast',
        description: 'Elements must have sufficient color contrast. Text color #777777 on background #ffffff has insufficient contrast ratio of 4.48:1 (needs 4.5:1 for normal text).',
        impact: 'serious',
        wcagCriteria: ['1.4.3', '1.4.6'],
        elementCount: 12,
        fixSuggestion: 'Use darker text color such as #595959 to achieve 7:1 contrast ratio'
      },
      {
        id: 'image-alt',
        description: 'Images must have alternate text. Several decorative and informative images are missing alt attributes.',
        impact: 'critical',
        wcagCriteria: ['1.1.1'],
        elementCount: 8,
        fixSuggestion: 'Add descriptive alt text to informative images, use alt="" for decorative images'
      },
      {
        id: 'link-name',
        description: 'Links must have discernible text. Multiple links with text "click here" or "read more" lack context.',
        impact: 'serious',
        wcagCriteria: ['2.4.4', '4.1.2'],
        elementCount: 5,
        fixSuggestion: 'Use descriptive link text that indicates the destination, e.g., "Read our privacy policy"'
      },
      {
        id: 'heading-order',
        description: 'Heading levels should only increase by one. Page jumps from H1 to H3, skipping H2.',
        impact: 'moderate',
        wcagCriteria: ['1.3.1', '2.4.6'],
        elementCount: 3,
        fixSuggestion: 'Ensure heading levels follow a logical hierarchical order without skipping levels'
      },
      {
        id: 'form-label',
        description: 'Form elements must have labels. Email and phone input fields are missing associated labels.',
        impact: 'critical',
        wcagCriteria: ['1.3.1', '3.3.2', '4.1.2'],
        elementCount: 2,
        fixSuggestion: 'Add <label> elements with for attribute matching the input id'
      },
      {
        id: 'focus-visible',
        description: 'Focus indicator is not clearly visible on interactive elements. Custom styling removes default focus outline.',
        impact: 'serious',
        wcagCriteria: ['2.4.7', '2.4.11'],
        elementCount: 15,
        fixSuggestion: 'Add visible focus styles using CSS :focus-visible pseudo-class'
      },
      {
        id: 'button-name',
        description: 'Buttons must have discernible text. Icon-only buttons lack accessible names.',
        impact: 'serious',
        wcagCriteria: ['4.1.2'],
        elementCount: 4,
        fixSuggestion: 'Add aria-label or visually hidden text to icon-only buttons'
      },
      {
        id: 'target-size',
        description: 'Touch targets are smaller than 24x24 CSS pixels. Some buttons and links are too small.',
        impact: 'minor',
        wcagCriteria: ['2.5.8'],
        elementCount: 6,
        fixSuggestion: 'Increase touch target size to at least 44x44 CSS pixels for better accessibility'
      }
    ]

    const summary = {
      critical: sampleViolations.filter(v => v.impact === 'critical').length,
      serious: sampleViolations.filter(v => v.impact === 'serious').length,
      moderate: sampleViolations.filter(v => v.impact === 'moderate').length,
      minor: sampleViolations.filter(v => v.impact === 'minor').length
    }

    setReportData({
      organizationName: 'Acme Corporation',
      websiteUrl: 'https://www.acme-corp.example.com',
      reportDate: new Date().toLocaleDateString(),
      reportType: 'executive',
      overallScore: 68,
      totalViolations: sampleViolations.length,
      violations: sampleViolations,
      summary,
      recommendations: [
        'Prioritize fixing critical image alt text issues immediately',
        'Address color contrast issues across the site',
        'Implement proper form labeling for all input fields',
        'Add visible focus indicators for keyboard navigation'
      ],
      nextSteps: [
        'Schedule remediation sprint for critical issues',
        'Conduct user testing with assistive technology users',
        'Set up automated accessibility testing in CI/CD pipeline'
      ]
    })

    toast.success('Sample report data loaded! Scroll down to see the preview.')
  }

  const updateField = (field: keyof ReportData, value: any) => {
    setReportData(prev => ({ ...prev, [field]: value }))
  }

  const addViolation = () => {
    if (!newViolation.id || !newViolation.description) {
      toast.error('Please fill in ID and description')
      return
    }

    const violation: Violation = {
      id: newViolation.id,
      description: newViolation.description,
      impact: newViolation.impact || 'moderate',
      wcagCriteria: newViolation.wcagCriteria || [],
      elementCount: newViolation.elementCount || 1,
      fixSuggestion: newViolation.fixSuggestion
    }

    const violations = [...(reportData.violations || []), violation]
    const summary = {
      critical: violations.filter(v => v.impact === 'critical').length,
      serious: violations.filter(v => v.impact === 'serious').length,
      moderate: violations.filter(v => v.impact === 'moderate').length,
      minor: violations.filter(v => v.impact === 'minor').length
    }

    setReportData(prev => ({
      ...prev,
      violations,
      totalViolations: violations.length,
      summary
    }))

    setNewViolation({
      id: '',
      description: '',
      impact: 'moderate',
      wcagCriteria: [],
      elementCount: 1
    })
    toast.success('Violation added')
  }

  const removeViolation = (index: number) => {
    const violations = reportData.violations?.filter((_, i) => i !== index) || []
    const summary = {
      critical: violations.filter(v => v.impact === 'critical').length,
      serious: violations.filter(v => v.impact === 'serious').length,
      moderate: violations.filter(v => v.impact === 'moderate').length,
      minor: violations.filter(v => v.impact === 'minor').length
    }

    setReportData(prev => ({
      ...prev,
      violations,
      totalViolations: violations.length,
      summary
    }))
    toast.success('Violation removed')
  }

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string
        const data = JSON.parse(text)
        
        if (data.violations && Array.isArray(data.violations)) {
          const violations = data.violations.map((v: any) => ({
            id: v.id || v.violationId || `V${Date.now()}`,
            description: v.description || v.help || '',
            impact: v.impact || 'moderate',
            wcagCriteria: v.wcagCriteria || v.tags || [],
            elementCount: v.elementCount || v.nodes?.length || 1,
            fixSuggestion: v.fixSuggestion || v.helpUrl
          }))

          const summary = {
            critical: violations.filter((v: Violation) => v.impact === 'critical').length,
            serious: violations.filter((v: Violation) => v.impact === 'serious').length,
            moderate: violations.filter((v: Violation) => v.impact === 'moderate').length,
            minor: violations.filter((v: Violation) => v.impact === 'minor').length
          }

          setReportData(prev => ({
            ...prev,
            violations,
            totalViolations: violations.length,
            summary,
            organizationName: data.organizationName || prev.organizationName,
            websiteUrl: data.websiteUrl || prev.websiteUrl,
            overallScore: data.overallScore || prev.overallScore
          }))
          toast.success(`Imported ${violations.length} violations`)
        } else {
          toast.error('Invalid file format')
        }
      } catch (error) {
        toast.error('Failed to parse file')
        console.error(error)
      }
    }
    reader.readAsText(file)
  }

  const generatePreview = () => {
    const data = reportData as ReportData
    if (!data.organizationName || !data.websiteUrl) {
      return 'Please complete organization name and website URL to generate preview.'
    }

    switch (previewFormat) {
      case 'html':
        return generateReportHTML(data)
      case 'markdown':
        return generateReportMarkdown(data)
      default:
        return ''
    }
  }

  const exportReport = (format: 'html' | 'markdown' | 'pdf' | 'excel') => {
    const data = reportData as ReportData
    if (!data.organizationName || !data.websiteUrl) {
      toast.error('Please complete organization name and website URL')
      return
    }

    switch (format) {
      case 'html':
        const html = generateReportHTML(data)
        const blob = new Blob([html], { type: 'text/html' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `accessibility-report-${data.organizationName.toLowerCase().replace(/\s+/g, '-')}.html`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        toast.success('HTML report downloaded')
        break

      case 'markdown':
        const markdown = generateReportMarkdown(data)
        const blob2 = new Blob([markdown], { type: 'text/markdown' })
        const url2 = URL.createObjectURL(blob2)
        const a2 = document.createElement('a')
        a2.href = url2
        a2.download = `accessibility-report-${data.organizationName.toLowerCase().replace(/\s+/g, '-')}.md`
        document.body.appendChild(a2)
        a2.click()
        document.body.removeChild(a2)
        URL.revokeObjectURL(url2)
        toast.success('Markdown report downloaded')
        break

      case 'pdf':
        const doc = new jsPDF('p', 'mm', 'a4')
        doc.setFontSize(20)
        doc.text('Accessibility Audit Report', 20, 20)
        
        doc.setFontSize(12)
        doc.text(`Organization: ${data.organizationName}`, 20, 35)
        doc.text(`Website: ${data.websiteUrl}`, 20, 42)
        doc.text(`Report Date: ${data.reportDate}`, 20, 49)

        const tableData = data.violations.map(v => [
          v.id,
          v.description.substring(0, 50) + (v.description.length > 50 ? '...' : ''),
          v.impact.toUpperCase(),
          v.wcagCriteria.join(', '),
          (v.elementCount || 1).toString()
        ])

        autoTable(doc, {
          head: [['ID', 'Description', 'Impact', 'WCAG Criteria', 'Count']],
          body: tableData,
          startY: 60,
          styles: { fontSize: 8 }
        })

        doc.save(`accessibility-report-${data.organizationName.toLowerCase().replace(/\s+/g, '-')}.pdf`)
        toast.success('PDF report downloaded')
        break

      case 'excel':
        const workbook = XLSX.utils.book_new()
        
        // Summary sheet
        const summaryData = [
          ['Accessibility Audit Report'],
          [''],
          ['Organization', data.organizationName],
          ['Website', data.websiteUrl],
          ['Report Date', data.reportDate],
          [''],
          ['Summary'],
          ['Total Violations', data.totalViolations],
          ['Critical', data.summary.critical],
          ['Serious', data.summary.serious],
          ['Moderate', data.summary.moderate],
          ['Minor', data.summary.minor]
        ]
        const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
        XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary')

        // Violations sheet
        const violationsData = data.violations.map(v => ({
          'ID': v.id,
          'Description': v.description,
          'Impact': v.impact.toUpperCase(),
          'WCAG Criteria': v.wcagCriteria.join(', '),
          'Element Count': v.elementCount || 1,
          'Fix Suggestion': v.fixSuggestion || ''
        }))
        const violationsSheet = XLSX.utils.json_to_sheet(violationsData)
        XLSX.utils.book_append_sheet(workbook, violationsSheet, 'Violations')

        XLSX.writeFile(workbook, `accessibility-report-${data.organizationName.toLowerCase().replace(/\s+/g, '-')}.xlsx`)
        toast.success('Excel report downloaded')
        break
    }
  }

  return (
    <div className="space-y-6">
      {/* Sample Data Banner */}
      <Card className="border-dashed border-2 border-primary/30 bg-gradient-to-r from-primary/5 to-primary/10">
        <CardContent className="py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">New to this tool?</p>
                <p className="text-sm text-muted-foreground">Load sample data to see how the report generator works</p>
              </div>
            </div>
            <Button onClick={loadSampleData} variant="default" size="sm">
              <Sparkles className="w-4 h-4 mr-2" />
              Load Sample Report
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs value={inputMethod} onValueChange={(value) => setInputMethod(value as any)}>
        <TabsList>
          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          <TabsTrigger value="import">Import Data</TabsTrigger>
        </TabsList>

        <TabsContent value="manual" className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Report Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="orgName">Organization Name *</Label>
                  <Input
                    id="orgName"
                    value={reportData.organizationName || ''}
                    onChange={(e) => updateField('organizationName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="websiteUrl">Website URL *</Label>
                  <Input
                    id="websiteUrl"
                    type="url"
                    value={reportData.websiteUrl || ''}
                    onChange={(e) => updateField('websiteUrl', e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="reportDate">Report Date</Label>
                  <Input
                    id="reportDate"
                    type="date"
                    value={reportData.reportDate || ''}
                    onChange={(e) => updateField('reportDate', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="reportType">Report Type</Label>
                  <Select
                    value={reportData.reportType || 'executive'}
                    onValueChange={(value) => updateField('reportType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="executive">Executive Summary</SelectItem>
                      <SelectItem value="technical">Technical Report</SelectItem>
                      <SelectItem value="compliance">Compliance Report</SelectItem>
                      <SelectItem value="progress">Progress Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="overallScore">Overall Score (0-100)</Label>
                <Input
                  id="overallScore"
                  type="number"
                  min="0"
                  max="100"
                  value={reportData.overallScore || ''}
                  onChange={(e) => updateField('overallScore', e.target.value ? parseInt(e.target.value) : undefined)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Add Violation */}
          <Card>
            <CardHeader>
              <CardTitle>Add Violation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="violationId">Violation ID *</Label>
                  <Input
                    id="violationId"
                    value={newViolation.id || ''}
                    onChange={(e) => setNewViolation(prev => ({ ...prev, id: e.target.value }))}
                    placeholder="e.g., V001"
                  />
                </div>
                <div>
                  <Label htmlFor="violationImpact">Impact Level</Label>
                  <Select
                    value={newViolation.impact || 'moderate'}
                    onValueChange={(value) => setNewViolation(prev => ({ ...prev, impact: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="serious">Serious</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="minor">Minor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="violationDesc">Description *</Label>
                <Textarea
                  id="violationDesc"
                  value={newViolation.description || ''}
                  onChange={(e) => setNewViolation(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="wcagCriteria">WCAG Criteria (comma-separated)</Label>
                <Input
                  id="wcagCriteria"
                  value={newViolation.wcagCriteria?.join(', ') || ''}
                  onChange={(e) => {
                    const criteria = e.target.value.split(',').map(c => c.trim()).filter(c => c)
                    setNewViolation(prev => ({ ...prev, wcagCriteria: criteria }))
                  }}
                  placeholder="e.g., 1.4.3, 2.4.4"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="elementCount">Element Count</Label>
                  <Input
                    id="elementCount"
                    type="number"
                    min="1"
                    value={newViolation.elementCount || 1}
                    onChange={(e) => setNewViolation(prev => ({ ...prev, elementCount: parseInt(e.target.value) || 1 }))}
                  />
                </div>
                <div>
                  <Label htmlFor="fixSuggestion">Fix Suggestion (optional)</Label>
                  <Input
                    id="fixSuggestion"
                    value={newViolation.fixSuggestion || ''}
                    onChange={(e) => setNewViolation(prev => ({ ...prev, fixSuggestion: e.target.value }))}
                  />
                </div>
              </div>
              <Button onClick={addViolation} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Violation
              </Button>
            </CardContent>
          </Card>

          {/* Violations List */}
          {reportData.violations && reportData.violations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Violations ({reportData.violations.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportData.violations.map((violation, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{violation.id}</span>
                            <Badge variant={
                              violation.impact === 'critical' ? 'destructive' :
                              violation.impact === 'serious' ? 'default' :
                              'secondary'
                            }>
                              {violation.impact}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{violation.description}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeViolation(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        WCAG: {violation.wcagCriteria.join(', ')} | Count: {violation.elementCount || 1}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Summary Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Summary Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{reportData.summary?.critical || 0}</div>
                  <div className="text-sm text-muted-foreground">Critical</div>
                </div>
                <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{reportData.summary?.serious || 0}</div>
                  <div className="text-sm text-muted-foreground">Serious</div>
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{reportData.summary?.moderate || 0}</div>
                  <div className="text-sm text-muted-foreground">Moderate</div>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-gray-600">{reportData.summary?.minor || 0}</div>
                  <div className="text-sm text-muted-foreground">Minor</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="import" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Import Violations</CardTitle>
              <CardDescription>Upload a JSON file with violation data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <Button variant="outline" asChild>
                    <span>Choose File</span>
                  </Button>
                </Label>
                <Input
                  id="file-upload"
                  type="file"
                  accept=".json"
                  onChange={handleFileImport}
                  className="hidden"
                />
                <p className="text-sm text-muted-foreground mt-4">
                  Upload a JSON file containing violations array
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Preview & Export */}
      <Card>
        <CardHeader>
          <CardTitle>Preview & Export</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs value={previewFormat} onValueChange={(value) => setPreviewFormat(value as any)}>
            <TabsList className="xs:flex flex-col h-auto xs:w-full xs2:block xs2:w-auto">
              <TabsTrigger value="html" className="xs:w-full xs2:w-auto">HTML Preview</TabsTrigger>
              <TabsTrigger value="markdown" className="xs:w-full xs2:w-auto">Markdown Preview</TabsTrigger>
            </TabsList>
            <TabsContent value={previewFormat} className="mt-4">
              <div className="border rounded-lg p-4 bg-slate-50 dark:bg-slate-900 max-h-96 overflow-auto">
                {previewFormat === 'html' ? (
                  <iframe
                    srcDoc={generatePreview()}
                    className="w-full h-96 border-0"
                    title="Report Preview"
                  />
                ) : (
                  <pre className="text-sm whitespace-pre-wrap font-mono">
                    {generatePreview()}
                  </pre>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex flex-wrap gap-2">
            <Button onClick={() => exportReport('html')}>
              <FileCode className="w-4 h-4 mr-2" />
              Export HTML
            </Button>
            <Button onClick={() => exportReport('markdown')} variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Export Markdown
            </Button>
            <Button onClick={() => exportReport('pdf')} variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button onClick={() => exportReport('excel')} variant="outline">
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Export Excel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

