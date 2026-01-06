"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { useCredits } from "@/hooks/use-credits"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AiAnalysisDashboard } from "@/components/tools/ai-analysis-dashboard"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import Link from "next/link"
import AccessibilityAuditTable from "./accessibility-audit-table"
import { 
  Search, 
  Loader2, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  Info, 
  ExternalLink,
  Code,
  Eye,
  Clock,
  Zap,
  TrendingUp,
  AlertTriangle,
  Copy,
  Trash2,
  RefreshCw,
  Globe,
  Coins,
  Shield,
  History,
  Download,
  Calendar
} from "lucide-react"

import { UrlAuditResult, AuditHistory } from '@/lib/url-accessibility-auditor-types'
import {
  hasUnlimitedAccess,
  getUnlimitedAccessRemainingTime,
} from "@/lib/unlimited-access"

const SEVERITY_CONFIG = {
  critical: { color: 'bg-red-100 text-red-800 border-red-200', icon: XCircle, label: 'Critical' },
  serious: { color: 'bg-orange-100 text-orange-800 border-orange-200', icon: AlertCircle, label: 'Serious' },
  moderate: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: AlertCircle, label: 'Moderate' },
  minor: { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: Info, label: 'Minor' }
}

/**
 * Render the URL Accessibility Auditor UI used to start audits, view live audit status and results, and browse audit history.
 *
 * The component manages form state, audit lifecycle (start, load, delete), unlimited-access checks, history loading, clipboard actions,
 * and presents analysis results (score, violations, AI summary, recommendations) with export and copy controls.
 *
 * @returns A React element containing the auditor interface (new-audit form, enhanced status/result panels, AI analysis dashboard, and history list).
 */
export default function UrlAccessibilityAuditor() {
  const { isSignedIn, user } = useUser()
  const { refreshCredits } = useCredits()
  
  // Form state
  const [url, setUrl] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  
  // Audit state
  const [currentAudit, setCurrentAudit] = useState<UrlAuditResult | null>(null)
  
  // Unlimited Access State
  const [unlimitedAccess, setUnlimitedAccess] = useState(false)

  // Check for unlimited access
  useEffect(() => {
    const checkUnlimitedAccess = () => {
      const hasAccess = hasUnlimitedAccess()
      setUnlimitedAccess(hasAccess)
    }

    checkUnlimitedAccess()
    // Check every minute for expiration
    const interval = setInterval(checkUnlimitedAccess, 60000)

    return () => clearInterval(interval)
  }, [])
  
  // History state
  const [auditHistory, setAuditHistory] = useState<AuditHistory | null>(null)
  const [selectedHistoryAudit, setSelectedHistoryAudit] = useState<string | null>(null)
  
  // Load audit history when component mounts
  useEffect(() => {
    if (isSignedIn) {
      loadAuditHistory()
    }
  }, [isSignedIn])

  const loadAuditHistory = async () => {
    try {
      const { getAuditHistory } = await import('@/app/actions/url-accessibility-auditor-actions')
      const history = await getAuditHistory()
      setAuditHistory(history)
    } catch (error) {
      console.error('Failed to load audit history:', error)
    }
  }

  const loadHistoryAudit = async (auditId: string) => {
    try {
      const { getAudit } = await import('@/app/actions/url-accessibility-auditor-actions')
      const audit = await getAudit(auditId)
      if (audit) {
        setCurrentAudit(audit)
        setSelectedHistoryAudit(auditId)
        const auditTabTrigger = document.querySelector('[value="audit"]') as HTMLButtonElement
        if (auditTabTrigger) auditTabTrigger.click()
      } else {
        toast.error("Audit not found")
      }
    } catch (error) {
      console.error('Failed to load audit:', error)
      toast.error("Failed to load audit")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return

    setIsSubmitting(true)
    setError(null)
    setCurrentAudit(null)
    setSelectedHistoryAudit(null)

    try {
      // Import action dynamically
      const { runUrlAccessibilityAudit } = await import('@/app/actions/url-accessibility-auditor-actions')
      
      // Init fake pending state for UI immediate feedback
      setCurrentAudit({
        auditId: "pending",
        status: 'processing',
        url: url.trim(),
        createdAt: new Date().toISOString(),
      })

      const result = await runUrlAccessibilityAudit(url.trim(), unlimitedAccess)

      if (result.status === 'failed') {
        throw new Error(result.errorMessage || "Audit failed")
      }

      setCurrentAudit(result)
      toast.success("Audit completed successfully!")
      refreshCredits()
      loadAuditHistory()

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(type)
      toast.success(`${type} copied to clipboard`)
      setTimeout(() => setCopied(null), 2000)
    })
  }

  const deleteAudit = async () => {
    if (!currentAudit) return

    try {
      const { deleteAudit } = await import('@/app/actions/url-accessibility-auditor-actions')
      await deleteAudit(currentAudit.auditId)
      setCurrentAudit(null)
      setSelectedHistoryAudit(null)
      loadAuditHistory()
      toast.success("Audit deleted")
    } catch (error) {
      toast.error("Failed to delete audit")
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent'
    if (score >= 70) return 'Good'
    if (score >= 50) return 'Needs Improvement'
    return 'Poor'
  }

  return (
    <div className="container-wide py-12">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-primary/10">
            <Globe className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            URL Accessibility Auditor
          </h1>
        </div>
        <p className="text-xl text-muted-foreground mb-8">
          Comprehensive accessibility testing powered by axe-core and AI analysis. 
          Get detailed WCAG compliance reports with actionable recommendations.
        </p>
        
        {/* Key Features */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="flex items-center gap-2 p-4 rounded-lg bg-primary/5">
            <Zap className="h-5 w-5 text-primary" />
            <span className="font-medium">axe-core Testing</span>
          </div>
          <div className="flex items-center gap-2 p-4 rounded-lg bg-primary/5">
            <Eye className="h-5 w-5 text-primary" />
            <span className="font-medium">AI Analysis</span>
          </div>
          <div className="flex items-center gap-2 p-4 rounded-lg bg-primary/5">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-medium">WCAG Compliance</span>
          </div>
          <div className="flex items-center gap-2 p-4 rounded-lg bg-primary/5">
            <Download className="h-5 w-5 text-primary" />
            <span className="font-medium">Export Reports</span>
          </div>
        </div>
      </div>

      {/* Main Content with Tabs */}
      <div className="max-w-7xl mx-auto">
        <Tabs defaultValue="audit" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="audit" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              New Audit
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Audit History
            </TabsTrigger>
          </TabsList>

          {/* New Audit Tab */}
          <TabsContent value="audit" className="space-y-8">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Input Form */}
              <Card className="border-2">
                <div className="bg-primary/5 border-b">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Search className="h-5 w-5" />
                      Website URL
                    </CardTitle>
                    <CardDescription>
                      Enter the URL you want to audit for accessibility compliance
                    </CardDescription>
                    
                    {!isSignedIn ? (
                      <Alert className="border-blue-200 bg-blue-50">
                        <Info className="h-4 w-4 text-blue-600" />
                        <AlertTitle className="text-blue-800">Authentication Required</AlertTitle>
                        <AlertDescription className="text-blue-700">
                          <Link href="/sign-in" className="underline font-medium">Sign in</Link> or{" "}
                          <Link href="/sign-up" className="underline font-medium">create an account</Link> to use this tool.
                          <Badge variant="secondary" className="ml-2">100 free credits for new users!</Badge>
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <div className="flex items-center gap-2 p-3 bg-background rounded-lg border">
                        <Coins className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium">Cost: 5 credits per audit</span>
                        <Badge variant="outline" className="ml-auto">2-5 minutes processing</Badge>
                      </div>
                    )}
                  </CardHeader>
                </div>

                <CardContent className="space-y-6 pt-6">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="url-input" className="text-sm font-medium">
                        Website URL
                      </label>
                      <Input
                        id="url-input"
                        type="url"
                        placeholder="https://example.com"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        disabled={isSubmitting || !isSignedIn}
                        className="h-12 text-base"
                      />
                    </div>

                    {error && (
                      <Alert className="border-red-200 bg-red-50">
                        <XCircle className="h-4 w-4 text-red-600" />
                        <AlertTitle className="text-red-800">Error</AlertTitle>
                        <AlertDescription className="text-red-700">
                          {error}
                        </AlertDescription>
                      </Alert>
                    )}

                    <Button 
                      type="submit" 
                      disabled={!url.trim() || isSubmitting || !isSignedIn}
                      className="w-full h-12 text-base"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Starting Audit...
                        </>
                      ) : (
                        <>
                          <Search className="mr-2 h-4 w-4" />
                          Start Accessibility Audit
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Enhanced Status Card */}
              {currentAudit && (
                <Card className="border-2 bg-gradient-to-br from-background to-muted/20">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {currentAudit.status === 'pending' && (
                          <div className="p-2 rounded-full bg-yellow-100">
                            <Clock className="h-5 w-5 text-yellow-600" />
                          </div>
                        )}
                        {currentAudit.status === 'processing' && (
                          <div className="p-2 rounded-full bg-blue-100">
                            <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                          </div>
                        )}
                        {currentAudit.status === 'completed' && (
                          <div className="p-2 rounded-full bg-green-100">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          </div>
                        )}
                        {currentAudit.status === 'failed' && (
                          <div className="p-2 rounded-full bg-red-100">
                            <XCircle className="h-5 w-5 text-red-600" />
                          </div>
                        )}
                        
                        <div>
                          <CardTitle className="text-xl">
                            {currentAudit.status === 'pending' && '⏳ Audit Queued'}
                            {currentAudit.status === 'processing' && '🔍 AI Analysis in Progress'}
                            {currentAudit.status === 'completed' && '✅ Analysis Complete'}
                            {currentAudit.status === 'failed' && '❌ Analysis Failed'}
                          </CardTitle>
                          <CardDescription className="text-base">
                            {currentAudit.title || currentAudit.url}
                          </CardDescription>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {currentAudit.status === 'completed' && (
                          <Button variant="outline" size="sm" onClick={() => copyToClipboard(currentAudit.url, "URL")}>
                            {copied === "URL" ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </Button>
                        )}
                        <Button variant="outline" size="sm" onClick={deleteAudit}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  {(currentAudit.status === 'processing' || currentAudit.status === 'pending') && (
                    <CardContent>
                      <div className="space-y-4">
                        {/* Enhanced Progress Display */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">Multi-Tool Analysis Progress</span>
                            <span className="text-muted-foreground">
                              {currentAudit.status === 'processing' ? 'AI Processing...' : 'Initializing...'}
                            </span>
                          </div>
                          <Progress 
                            value={currentAudit.status === 'processing' ? 75 : 25} 
                            className="h-3"
                          />
                        </div>

                        {/* Analysis Stages */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className={`p-3 rounded-lg border transition-all ${
                            currentAudit.status === 'processing' ? 'bg-green-50 border-green-200' : 'bg-muted/30'
                          }`}>
                            <div className="flex items-center gap-2">
                              {currentAudit.status === 'processing' ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                              )}
                              <span className="text-sm font-medium">axe-core Scan</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              WCAG compliance testing
                            </p>
                          </div>

                          <div className={`p-3 rounded-lg border transition-all ${
                            currentAudit.status === 'processing' ? 'bg-blue-50 border-blue-200' : 'bg-muted/30'
                          }`}>
                            <div className="flex items-center gap-2">
                              {currentAudit.status === 'processing' ? (
                                <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                              ) : (
                                <Clock className="h-4 w-4 text-muted-foreground" />
                              )}
                              <span className="text-sm font-medium">AI Analysis</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              Business context & insights
                            </p>
                          </div>

                          <div className="p-3 rounded-lg border bg-muted/30">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm font-medium">Report Generation</span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              Recommendations & export
                            </p>
                          </div>
                        </div>

                        {/* Estimated Time */}
                        <div className="flex items-center justify-center gap-2 p-3 bg-primary/5 rounded-lg">
                          <Clock className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">Estimated completion: 2-5 minutes</span>
                        </div>
                      </div>
                    </CardContent>
                  )}

                  {currentAudit.status === 'failed' && (
                    <CardContent>
                      <Alert className="border-red-200 bg-red-50">
                        <XCircle className="h-4 w-4 text-red-600" />
                        <AlertTitle className="text-red-800">Analysis Failed</AlertTitle>
                        <AlertDescription className="text-red-700">
                          {currentAudit.errorMessage}
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                  )}

                  {/* Enhanced Score Overview */}
                  {currentAudit.status === 'completed' && currentAudit.overallScore !== undefined && (
                    <CardContent>
                      <div className="text-center space-y-6">
                        {/* Main Score Display */}
                        <div className="relative">
                          <div className={`text-6xl font-bold ${getScoreColor(currentAudit.overallScore!)}`}>
                            {currentAudit.overallScore}
                          </div>
                          <div className="text-lg font-semibold text-muted-foreground mt-2">
                            {getScoreLabel(currentAudit.overallScore!)} Accessibility
                          </div>
                          <Progress 
                            value={currentAudit.overallScore} 
                            className="h-2 mt-4"
                          />
                        </div>
                        
                        {/* Enhanced Violation Breakdown */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div className="p-4 rounded-lg bg-red-50 border border-red-200 hover:bg-red-100 transition-colors">
                            <div className="text-2xl font-bold text-red-600">{currentAudit.criticalCount}</div>
                            <div className="text-sm font-medium text-red-700">Critical</div>
                            <div className="text-xs text-red-600 mt-1">Immediate attention</div>
                          </div>
                          <div className="p-4 rounded-lg bg-orange-50 border border-orange-200 hover:bg-orange-100 transition-colors">
                            <div className="text-2xl font-bold text-orange-600">{currentAudit.seriousCount}</div>
                            <div className="text-sm font-medium text-orange-700">Serious</div>
                            <div className="text-xs text-orange-600 mt-1">High priority</div>
                          </div>
                          <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200 hover:bg-yellow-100 transition-colors">
                            <div className="text-2xl font-bold text-yellow-600">{currentAudit.moderateCount}</div>
                            <div className="text-sm font-medium text-yellow-700">Moderate</div>
                            <div className="text-xs text-yellow-600 mt-1">Medium priority</div>
                          </div>
                          <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors">
                            <div className="text-2xl font-bold text-blue-600">{currentAudit.minorCount}</div>
                            <div className="text-sm font-medium text-blue-700">Minor</div>
                            <div className="text-xs text-blue-600 mt-1">Low priority</div>
                          </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            <span>Multi-tool analysis</span>
                          </div>
                          <Separator orientation="vertical" className="h-4" />
                          <div className="flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            <span>AI-enhanced insights</span>
                          </div>
                          <Separator orientation="vertical" className="h-4" />
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            <span>WCAG 2.1 AA</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              )}
            </div>

            {/* Results Display */}
            {currentAudit?.status === 'completed' && (
              <div className="space-y-8">
                {/* Enhanced AI Analysis Dashboard */}
                {currentAudit.aiSummary && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main AI Summary Card */}
                    <div className="lg:col-span-2">
                      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
                        <CardHeader className="pb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                              <Eye className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <CardTitle className="text-xl">🧠 AI Intelligence Analysis</CardTitle>
                              <CardDescription>Enhanced business context and industry insights</CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <AiAnalysisDashboard summaryString={currentAudit.aiSummary} />
                        </CardContent>
                      </Card>
                    </div>

                    {/* Score & Metrics Sidebar */}
                    <div className="space-y-6">
                      {/* Overall Score Card */}
                      <Card className="border-2">
                        <CardHeader className="text-center pb-4">
                          <CardTitle className="text-lg">Accessibility Score</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center space-y-4">
                          <div className="relative">
                            <div className={`text-5xl font-bold ${getScoreColor(currentAudit.overallScore!)}`}>
                              {currentAudit.overallScore}
                            </div>
                            <div className="text-sm font-medium text-muted-foreground mt-1">
                              {getScoreLabel(currentAudit.overallScore!)}
                            </div>
                          </div>
                          
                          <Progress 
                            value={currentAudit.overallScore} 
                            className="h-3"
                          />
                          
                          <div className="grid grid-cols-2 gap-3 mt-6">
                            <div className="text-center p-3 rounded-lg bg-red-50 border border-red-200">
                              <div className="text-xl font-bold text-red-600">{currentAudit.criticalCount}</div>
                              <div className="text-xs text-red-700 font-medium">Critical</div>
                            </div>
                            <div className="text-center p-3 rounded-lg bg-orange-50 border border-orange-200">
                              <div className="text-xl font-bold text-orange-600">{currentAudit.seriousCount}</div>
                              <div className="text-xs text-orange-700 font-medium">Serious</div>
                            </div>
                            <div className="text-center p-3 rounded-lg bg-yellow-50 border border-yellow-200">
                              <div className="text-xl font-bold text-yellow-600">{currentAudit.moderateCount}</div>
                              <div className="text-xs text-yellow-700 font-medium">Moderate</div>
                            </div>
                            <div className="text-center p-3 rounded-lg bg-blue-50 border border-blue-200">
                              <div className="text-xl font-bold text-blue-600">{currentAudit.minorCount}</div>
                              <div className="text-xs text-blue-700 font-medium">Minor</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Key Metrics Card */}
                      <Card className="border-2">
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            Key Metrics
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between py-2">
                            <span className="text-sm text-muted-foreground">Total Issues</span>
                            <span className="font-semibold">{currentAudit.totalViolations}</span>
                          </div>
                          <Separator />
                          <div className="flex items-center justify-between py-2">
                            <span className="text-sm text-muted-foreground">WCAG Level</span>
                            <Badge variant="outline">AA</Badge>
                          </div>
                          <Separator />
                          <div className="flex items-center justify-between py-2">
                            <span className="text-sm text-muted-foreground">Tools Used</span>
                            <div className="flex gap-1">
                              <Badge variant="secondary" className="text-xs">axe-core</Badge>
                              <Badge variant="secondary" className="text-xs">AI</Badge>
                            </div>
                          </div>
                          <Separator />
                          <div className="flex items-center justify-between py-2">
                            <span className="text-sm text-muted-foreground">Scan Date</span>
                            <span className="text-sm font-medium">
                              {new Date(currentAudit.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Export Actions Card */}
                      <Card className="border-2">
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Download className="h-5 w-5" />
                            Export Report
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <Button variant="outline" className="w-full justify-start" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            Download PDF Report
                          </Button>
                          <Button variant="outline" className="w-full justify-start" size="sm">
                            <Code className="mr-2 h-4 w-4" />
                            Export as JSON
                          </Button>
                          <Button variant="outline" className="w-full justify-start" size="sm">
                            <Copy className="mr-2 h-4 w-4" />
                            Copy Summary
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}

                {/* Priority Recommendations */}
                {currentAudit.priorityRecommendations && currentAudit.priorityRecommendations.length > 0 && (
                  <Card className="border-2">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        Priority Action Items
                      </CardTitle>
                      <CardDescription>
                        AI-recommended fixes prioritized by business impact and implementation effort
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4">
                        {currentAudit.priorityRecommendations.map((rec, index) => (
                          <div key={index} className="p-4 rounded-lg border bg-gradient-to-r from-muted/30 to-muted/10 hover:from-muted/40 hover:to-muted/20 transition-colors">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                                  {index + 1}
                                </div>
                                <h4 className="font-semibold text-lg">{rec.title}</h4>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className={SEVERITY_CONFIG[rec.impact as keyof typeof SEVERITY_CONFIG]?.color || 'bg-gray-100 text-gray-800'}>
                                  {rec.impact}
                                </Badge>
                                <Badge variant="outline" className="capitalize">
                                  {rec.effort} effort
                                </Badge>
                              </div>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">
                              {rec.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Comprehensive Data Table */}
                {currentAudit.violations && currentAudit.violations.length > 0 && (
                  <AccessibilityAuditTable
                    violations={currentAudit.violations.map(v => ({
                      ...v,
                      createdAt: currentAudit.createdAt
                    }))}
                    auditInfo={{
                      url: currentAudit.url,
                      title: currentAudit.title,
                      overallScore: currentAudit.overallScore,
                      totalViolations: currentAudit.totalViolations || 0,
                      criticalCount: currentAudit.criticalCount || 0,
                      seriousCount: currentAudit.seriousCount || 0,
                      moderateCount: currentAudit.moderateCount || 0,
                      minorCount: currentAudit.minorCount || 0,
                      createdAt: currentAudit.createdAt
                    }}
                  />
                )}
              </div>
            )}

            {/* Empty State */}
            {!currentAudit && (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <Globe className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Ready to Audit</h3>
                  <p className="text-muted-foreground mb-4">
                    Enter a website URL to start a comprehensive accessibility audit with AI-powered analysis.
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Coins className="h-4 w-4" />
                      <span>5 credits per audit</span>
                    </div>
                    <Separator orientation="vertical" className="h-4" />
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>2-5 minutes processing</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Audit History Tab */}
          <TabsContent value="history" className="space-y-6">
            {auditHistory && auditHistory.audits.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Your Audit History ({auditHistory.audits.length})
                  </CardTitle>
                  <CardDescription>
                    View and access your previous accessibility audits
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {auditHistory.audits.map((audit) => (
                      <div
                        key={audit.id}
                        className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                          selectedHistoryAudit === audit.id 
                            ? 'border-primary bg-primary/5' 
                            : 'border-muted hover:border-primary/50'
                        }`}
                        onClick={() => loadHistoryAudit(audit.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-sm">{audit.title || audit.url}</h4>
                              <Badge variant={audit.status === 'completed' ? 'default' : 'secondary'}>
                                {audit.status}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground truncate">{audit.url}</p>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            {audit.overallScore !== undefined && (
                              <div className={`font-medium ${getScoreColor(audit.overallScore)}`}>
                                {audit.overallScore}/100
                              </div>
                            )}
                            <div className="text-muted-foreground">
                              {audit.totalViolations} issues
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {new Date(audit.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <History className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Audits Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start your first accessibility audit to see your history here.
                  </p>
                  <Button onClick={() => (document.querySelector('[value="audit"]') as HTMLButtonElement)?.click()}>
                    <Search className="mr-2 h-4 w-4" />
                    Start Your First Audit
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 