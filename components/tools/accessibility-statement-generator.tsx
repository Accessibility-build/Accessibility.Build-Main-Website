"use client"

import { useState } from "react"
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
  Eye, 
  ChevronRight, 
  ChevronLeft,
  CheckCircle,
  Settings,
  Mail,
  Phone,
  Globe,
  AlertCircle,
  Sparkles
} from "lucide-react"
import { 
  generateStatementHTML, 
  generateStatementMarkdown, 
  generateStatementPlainText,
  type StatementData,
  type StatementTemplate
} from "@/lib/accessibility-statement-templates"
import { toast } from "sonner"

export default function AccessibilityStatementGenerator() {
  const [currentStep, setCurrentStep] = useState(1)
  const [template, setTemplate] = useState<StatementTemplate>('comprehensive')
  const [previewFormat, setPreviewFormat] = useState<'html' | 'markdown' | 'text'>('html')
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

  const updateField = (field: keyof StatementData, value: any) => {
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
      {/* Sample Data Banner */}
      <Card className="border-dashed border-2 border-violet-500/30 bg-gradient-to-r from-violet-500/5 to-purple-500/10">
        <CardContent className="py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-violet-500/10 rounded-lg">
                <Sparkles className="w-5 h-5 text-violet-600" />
              </div>
              <div>
                <p className="font-medium">New to accessibility statements?</p>
                <p className="text-sm text-muted-foreground">Load sample data to see how the generator works</p>
              </div>
            </div>
            <Button onClick={loadSampleData} variant="outline" size="sm" className="border-violet-500/50 hover:bg-violet-500/10">
              <Sparkles className="w-4 h-4 mr-2" />
              Load Sample Statement
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Progress Indicator */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step === currentStep 
                      ? 'bg-blue-600 text-white' 
                      : step < currentStep 
                        ? 'bg-green-600 text-white' 
                        : 'bg-slate-200 text-slate-600'
                  }`}>
                    {step < currentStep ? <CheckCircle className="w-5 h-5" /> : step}
                  </div>
                  {step < totalSteps && (
                    <div className={`w-16 h-1 ${step < currentStep ? 'bg-green-600' : 'bg-slate-200'}`} />
                  )}
                </div>
              ))}
            </div>
            <Badge variant="outline" className="text-sm">
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
            <div className="grid grid-cols-2 gap-4">
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
                onValueChange={(value) => updateField('conformanceLevel', value)}
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
              <div className="grid grid-cols-2 gap-2 mt-2">
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
              <p className="text-xs text-slate-500 mt-1">Enter each limitation on a new line</p>
            </div>
            <div>
              <Label>Technologies Used</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
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
                onValueChange={(value) => updateField('feedbackMechanism', value)}
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
              <Tabs value={previewFormat} onValueChange={(value) => setPreviewFormat(value as any)}>
                <TabsList>
                  <TabsTrigger value="html">HTML</TabsTrigger>
                  <TabsTrigger value="markdown">Markdown</TabsTrigger>
                  <TabsTrigger value="text">Plain Text</TabsTrigger>
                </TabsList>
                <TabsContent value={previewFormat} className="mt-4">
                  <div className="border rounded-lg p-4 bg-slate-50 dark:bg-slate-900 max-h-96 overflow-auto">
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

