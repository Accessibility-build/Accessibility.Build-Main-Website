"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Hash, 
  Search, 
  Eye, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Copy,
  ArrowRight,
  Zap,
  TrendingUp,
  Users,
  Target
} from "lucide-react"

interface HeadingData {
  level: number
  text: string
  position: number
  element: string
}

interface AnalysisResult {
  headings: HeadingData[]
  issues: {
    type: 'error' | 'warning' | 'info'
    message: string
    heading?: HeadingData
    recommendation: string
  }[]
  seoScore: number
  accessibilityScore: number
  totalScore: number
}

export default function HeadingAnalyzer() {
  const [url, setUrl] = useState("")
  const [htmlContent, setHtmlContent] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const analyzeHeadings = (html: string): AnalysisResult => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    
    // Extract all headings
    const headingElements = doc.querySelectorAll('h1, h2, h3, h4, h5, h6')
    const headings: HeadingData[] = []
    
    headingElements.forEach((element, index) => {
      const level = parseInt(element.tagName[1])
      const text = element.textContent?.trim() || ''
      
      headings.push({
        level,
        text,
        position: index + 1,
        element: element.outerHTML
      })
    })

    // Analyze issues
    const issues: AnalysisResult['issues'] = []
    
    // Check for H1 issues
    const h1Count = headings.filter(h => h.level === 1).length
    if (h1Count === 0) {
      issues.push({
        type: 'error',
        message: 'No H1 tag found',
        recommendation: 'Add a single H1 tag as your main page title. This is crucial for SEO and accessibility.'
      })
    } else if (h1Count > 1) {
      issues.push({
        type: 'error',
        message: `Multiple H1 tags found (${h1Count})`,
        recommendation: 'Use only one H1 tag per page. Convert additional H1s to H2 or appropriate heading levels.'
      })
    }

    // Check for empty headings
    const emptyHeadings = headings.filter(h => !h.text)
    emptyHeadings.forEach(heading => {
      issues.push({
        type: 'error',
        message: `Empty ${heading.element.split(' ')[0].replace('<', '').toUpperCase()} tag`,
        heading,
        recommendation: 'Add descriptive text to the heading or remove it entirely.'
      })
    })

    // Check for hierarchy issues
    for (let i = 1; i < headings.length; i++) {
      const current = headings[i]
      const previous = headings[i - 1]
      
      if (current.level > previous.level + 1) {
        issues.push({
          type: 'warning',
          message: `Heading level skipped: H${previous.level} to H${current.level}`,
          heading: current,
          recommendation: `Use H${previous.level + 1} instead of H${current.level} to maintain proper hierarchy.`
        })
      }
    }

    // Check for very long headings (SEO issue)
    const longHeadings = headings.filter(h => h.text.length > 70)
    longHeadings.forEach(heading => {
      issues.push({
        type: 'warning',
        message: `Long heading (${heading.text.length} characters)`,
        heading,
        recommendation: 'Keep headings under 70 characters for better SEO and readability.'
      })
    })

    // Check for duplicate headings
    const textCounts = headings.reduce((acc, h) => {
      acc[h.text] = (acc[h.text] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    Object.entries(textCounts).forEach(([text, count]) => {
      if (count > 1 && text.length > 0) {
        issues.push({
          type: 'info',
          message: `Duplicate heading text: "${text}" (${count} times)`,
          recommendation: 'Make headings unique and descriptive to improve SEO and user experience.'
        })
      }
    })

    // Check for proper H2 usage after H1
    const h1Index = headings.findIndex(h => h.level === 1)
    if (h1Index !== -1 && h1Index < headings.length - 1) {
      const nextHeading = headings[h1Index + 1]
      if (nextHeading.level > 2) {
        issues.push({
          type: 'warning',
          message: `H1 followed by H${nextHeading.level} instead of H2`,
          heading: nextHeading,
          recommendation: 'Use H2 for main content sections immediately after H1.'
        })
      }
    }

    // Calculate scores
    const totalHeadings = headings.length
    const errorCount = issues.filter(i => i.type === 'error').length
    const warningCount = issues.filter(i => i.type === 'warning').length
    
    const seoScore = Math.max(0, 100 - (errorCount * 20) - (warningCount * 10))
    const accessibilityScore = Math.max(0, 100 - (errorCount * 25) - (warningCount * 5))
    const totalScore = Math.round((seoScore + accessibilityScore) / 2)

    return {
      headings,
      issues,
      seoScore,
      accessibilityScore,
      totalScore
    }
  }

  const handleAnalyze = async () => {
    if (!url && !htmlContent) {
      setError("Please enter a URL or HTML content to analyze")
      return
    }

    setIsAnalyzing(true)
    setError(null)
    setResults(null)

    try {
      let htmlToAnalyze = htmlContent

      if (url) {
        // For URL analysis, we'll use a simple fetch approach
        // In production, you might want to use a server-side solution for CORS
        try {
          const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`)
          const data = await response.json()
          htmlToAnalyze = data.contents
        } catch (fetchError) {
          setError("Unable to fetch URL. Please try entering the HTML content directly.")
          setIsAnalyzing(false)
          return
        }
      }

      const analysis = analyzeHeadings(htmlToAnalyze)
      setResults(analysis)
    } catch (err) {
      setError("Failed to analyze content. Please check your input and try again.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const copyResults = () => {
    if (!results) return
    
    const reportText = `
Heading Structure Analysis Report
================================

Total Headings: ${results.headings.length}
SEO Score: ${results.seoScore}/100
Accessibility Score: ${results.accessibilityScore}/100
Overall Score: ${results.totalScore}/100

Heading Structure:
${results.headings.map(h => `${'  '.repeat(h.level - 1)}H${h.level}: ${h.text}`).join('\n')}

Issues Found:
${results.issues.map(issue => `
${issue.type.toUpperCase()}: ${issue.message}
Recommendation: ${issue.recommendation}
`).join('\n')}

Report generated by Accessibility.build
    `.trim()

    navigator.clipboard.writeText(reportText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBadgeColor = (score: number) => {
    if (score >= 90) return "bg-green-100 text-green-800 border-green-200"
    if (score >= 70) return "bg-yellow-100 text-yellow-800 border-yellow-200"
    return "bg-red-100 text-red-800 border-red-200"
  }

  return (
    <div className="max-w-6xl mx-auto">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="h-5 w-5" />
            Analyze Heading Structure
          </CardTitle>
          <CardDescription>
            Enter a URL or paste HTML content to analyze heading hierarchy for SEO and accessibility
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="url" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="url">Analyze URL</TabsTrigger>
              <TabsTrigger value="html">Analyze HTML</TabsTrigger>
            </TabsList>
            
            <TabsContent value="url" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="url">Website URL</Label>
                <Input
                  id="url"
                  type="url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="html" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="html">HTML Content</Label>
                <Textarea
                  id="html"
                  placeholder="Paste your HTML content here..."
                  value={htmlContent}
                  onChange={(e) => setHtmlContent(e.target.value)}
                  rows={10}
                />
              </div>
            </TabsContent>
          </Tabs>

          {error && (
            <Alert className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button 
            onClick={handleAnalyze}
            disabled={isAnalyzing || (!url && !htmlContent)}
            className="w-full mt-6"
          >
            {isAnalyzing ? (
              <>
                <Zap className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Analyze Heading Structure
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {results && (
        <div className="space-y-8">
          {/* Score Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  SEO Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className={`text-4xl font-bold ${getScoreColor(results.seoScore)}`}>
                    {results.seoScore}
                  </div>
                  <div className="text-sm text-muted-foreground">out of 100</div>
                  <Badge className={`mt-2 ${getScoreBadgeColor(results.seoScore)}`}>
                    {results.seoScore >= 90 ? 'Excellent' : results.seoScore >= 70 ? 'Good' : 'Needs Work'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Accessibility Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className={`text-4xl font-bold ${getScoreColor(results.accessibilityScore)}`}>
                    {results.accessibilityScore}
                  </div>
                  <div className="text-sm text-muted-foreground">out of 100</div>
                  <Badge className={`mt-2 ${getScoreBadgeColor(results.accessibilityScore)}`}>
                    {results.accessibilityScore >= 90 ? 'Excellent' : results.accessibilityScore >= 70 ? 'Good' : 'Needs Work'}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-600" />
                  Overall Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className={`text-4xl font-bold ${getScoreColor(results.totalScore)}`}>
                    {results.totalScore}
                  </div>
                  <div className="text-sm text-muted-foreground">out of 100</div>
                  <Badge className={`mt-2 ${getScoreBadgeColor(results.totalScore)}`}>
                    {results.totalScore >= 90 ? 'Excellent' : results.totalScore >= 70 ? 'Good' : 'Needs Work'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Heading Structure */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Hash className="h-5 w-5" />
                    Heading Structure ({results.headings.length} headings)
                  </CardTitle>
                  <CardDescription>
                    Visual representation of your heading hierarchy
                  </CardDescription>
                </div>
                <Button variant="outline" onClick={copyResults}>
                  {copied ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Report
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {results.headings.length > 0 ? (
                <div className="space-y-3">
                  {results.headings.map((heading, index) => (
                    <div 
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-lg border bg-muted/30"
                      style={{ marginLeft: `${(heading.level - 1) * 20}px` }}
                    >
                      <Badge variant="outline" className="text-xs">
                        H{heading.level}
                      </Badge>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{heading.text || 'Empty heading'}</p>
                        {heading.text.length > 70 && (
                          <p className="text-xs text-orange-600 mt-1">
                            Long heading ({heading.text.length} chars)
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Hash className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>No headings found in the content</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Issues */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Issues & Recommendations ({results.issues.length})
              </CardTitle>
              <CardDescription>
                Identified problems and actionable solutions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {results.issues.length > 0 ? (
                <div className="space-y-4">
                  {results.issues.map((issue, index) => (
                    <Alert key={index} className={
                      issue.type === 'error' ? 'border-red-200 bg-red-50' :
                      issue.type === 'warning' ? 'border-yellow-200 bg-yellow-50' :
                      'border-blue-200 bg-blue-50'
                    }>
                      <div className="flex items-start gap-3">
                        {issue.type === 'error' && <XCircle className="h-5 w-5 text-red-600 mt-0.5" />}
                        {issue.type === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />}
                        {issue.type === 'info' && <Eye className="h-5 w-5 text-blue-600 mt-0.5" />}
                        <div className="flex-1">
                          <div className="font-medium">{issue.message}</div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {issue.recommendation}
                          </div>
                          {issue.heading && (
                            <div className="mt-2 text-xs text-muted-foreground">
                              Affected heading: "{issue.heading.text}"
                            </div>
                          )}
                        </div>
                      </div>
                    </Alert>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-600" />
                  <p className="font-medium text-green-600">Perfect! No issues found.</p>
                  <p>Your heading structure follows SEO and accessibility best practices.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
} 