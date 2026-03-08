"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Smartphone, 
  Tablet,
  Monitor,
  Hand,
  Eye,
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Copy,
  Download,
  Zap,
  Gauge,
  Target,
  Navigation,
  ExternalLink
} from "lucide-react"
import {
  type AccessibilityImpact,
  MOBILE_ACCESSIBILITY_AUDIT_DEVICES,
  type MobileAccessibilityAuditResult,
  type MobileIssueSeverity,
} from "@/lib/mobile-accessibility-checker-types"
import {
  hasUnlimitedAccess,
  getUnlimitedAccessRemainingTime,
  formatRemainingTime,
} from "@/lib/unlimited-access";

const devices = Object.entries(MOBILE_ACCESSIBILITY_AUDIT_DEVICES).map(([name, config]) => {
  let type = 'desktop'
  if (name.includes('iPad')) type = 'tablet'
  else if (config.isMobile) type = 'mobile'
  
  return {
    name,
    ...config,
    type
  }
})


/**
 * Render the mobile accessibility checker UI and manage the analysis workflow for device-aware accessibility audits.
 *
 * The component provides inputs for a target URL and test device, handles unlimited-access state and periodic checks,
 * executes audits (including multi-device comparison when appropriate), displays progress and detailed results,
 * and allows exporting a textual report to the clipboard.
 *
 * @returns A React element that renders the Mobile Accessibility Checker interface, including controls to start analyses, status indicators, detailed results per device, and export actions.
 */
export default function MobileAccessibilityChecker() {
  const [url, setUrl] = useState("")
  const [selectedDevice, setSelectedDevice] = useState(devices[0].name)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<MobileAccessibilityAuditResult[]>([])
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [unlimitedAccess, setUnlimitedAccess] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);

  // Check for unlimited access
  useEffect(() => {
    const checkUnlimitedAccess = () => {
      const hasAccess = hasUnlimitedAccess();
      setUnlimitedAccess(hasAccess);
      if (hasAccess) {
        setRemainingTime(getUnlimitedAccessRemainingTime());
      }
    };

    checkUnlimitedAccess();
    // Check every minute for expiration
    const interval = setInterval(checkUnlimitedAccess, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleAnalyze = async () => {
    if (!url) {
      setError("Please enter a URL to analyze")
      return
    }

    // Basic URL validation
    try {
      new URL(url)
    } catch {
      setError("Please enter a valid URL")
      return
    }

    setIsAnalyzing(true)
    setError(null)
    setResults([])

    try {
      const { runMobileAccessibilityChecker } = await import("@/app/actions/mobile-accessibility-checker-action")
      
      const deviceToTest = devices.find(d => d.name === selectedDevice) || devices[0]
      const testDevices = [deviceToTest]

      // Only run comparison audits for unlimited-access sessions so a standard run
      // matches the advertised single-device, 2-credit workflow.
      if (unlimitedAccess && deviceToTest.type === 'mobile') {
        const tabletDevice = devices.find(d => d.type === 'tablet')
        if (tabletDevice && tabletDevice.name !== deviceToTest.name) {
          testDevices.push(tabletDevice)
        }
      }

      const auditResults: MobileAccessibilityAuditResult[] = []

      for (const device of testDevices) {
        const result = await runMobileAccessibilityChecker(url, device.name, unlimitedAccess)
        auditResults.push(result)
      }

      setResults(auditResults)
    } catch (err) {
      console.error(err)
      setError("Failed to analyze URL. Please check the URL and try again. " + (err instanceof Error ? err.message : ""))
    } finally {
      setIsAnalyzing(false)
    }
  }

  const copyResults = () => {
    if (results.length === 0) return
    
    const reportText = `
Mobile Accessibility Analysis Report
===================================

URL: ${url}
Analysis Date: ${new Date().toLocaleDateString()}

${results.map(result => `
Device: ${result.device} (${result.viewport.width}x${result.viewport.height})
Accessibility Score: ${result.accessibility.score}/100
Total Findings: ${getTotalFindings(result)}

Touch Targets:
- Total interactive elements: ${result.touchTargets.total}
- Passing WCAG requirements: ${result.touchTargets.passing}
- Failing requirements: ${result.touchTargets.failing}
- Errors: ${result.touchTargets.errorCount}
- Warnings: ${result.touchTargets.warningCount}

Performance Metrics:
- Load Time: ${result.performance.loadTime.toFixed(0)}ms
- First Contentful Paint: ${result.performance.firstContentfulPaint.toFixed(0)}ms
- Cumulative Layout Shift: ${result.performance.cumulativeLayoutShift.toFixed(3)}

Mobile-Friendly Check:
- Viewport Meta Tag: ${result.mobileFriendly.hasViewportMeta ? 'Yes' : 'No'}
- Text Readable: ${result.mobileFriendly.textReadable ? 'Yes' : 'No'}
- Links Clickable: ${result.mobileFriendly.linksClickable ? 'Yes' : 'No'}
- Content Fits Viewport: ${result.mobileFriendly.contentFitsViewport ? 'Yes' : 'No'}
- Viewport Content: ${result.mobileFriendly.viewportContent || 'Missing'}
- Minimum Text Size Found: ${result.mobileFriendly.minFontSize ? `${result.mobileFriendly.minFontSize.toFixed(1)}px` : 'Unknown'}

Touch Target Issues:
${result.touchTargets.issues.map(issue => `
- ${issue.element}
  Selector: ${issue.selector}
  Size: ${issue.size.width}x${issue.size.height}px
  Reason: ${issue.reason}
  Recommendation: ${issue.recommendation}
`).join('')}

Accessibility Issues:
${result.accessibility.issues.map(issue => `
- [${issue.impact.toUpperCase()}] ${issue.title}
  Affected Nodes: ${issue.affectedNodes}
  WCAG: ${issue.wcagCriteria.join(', ') || 'Not specified'}
  Recommendation: ${issue.recommendation}
`).join('')}

Mobile-Specific Issues:
${result.mobileFriendly.issues.map(issue => `
- [${issue.severity.toUpperCase()}] ${issue.title}
  Details: ${issue.details}
  Recommendation: ${issue.recommendation}
`).join('')}
`).join('\n')}

Report generated by Accessibility.build Mobile Checker
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

  const getSeverityBadgeColor = (severity: MobileIssueSeverity) => {
    switch (severity) {
      case 'error':
        return "bg-red-100 text-red-800 border-red-200"
      case 'warning':
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-blue-100 text-blue-800 border-blue-200"
    }
  }

  const getImpactBadgeColor = (impact: AccessibilityImpact) => {
    switch (impact) {
      case 'critical':
        return "bg-red-100 text-red-800 border-red-200"
      case 'serious':
        return "bg-orange-100 text-orange-800 border-orange-200"
      case 'moderate':
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-blue-100 text-blue-800 border-blue-200"
    }
  }

  const getTotalFindings = (result: MobileAccessibilityAuditResult) => {
    return result.touchTargets.failing + result.accessibility.summary.total + result.mobileFriendly.issues.length
  }

  const getBlockerFindings = (result: MobileAccessibilityAuditResult) => {
    return (
      result.touchTargets.errorCount +
      result.accessibility.summary.critical +
      result.accessibility.summary.serious +
      result.mobileFriendly.issues.filter((issue) => issue.severity === 'error').length
    )
  }

  const getWarningFindings = (result: MobileAccessibilityAuditResult) => {
    return (
      result.touchTargets.warningCount +
      result.accessibility.summary.moderate +
      result.accessibility.summary.minor +
      result.mobileFriendly.issues.filter((issue) => issue.severity === 'warning').length
    )
  }

  const getDeviceIcon = (deviceName: string) => {
    const device = devices.find(d => d.name === deviceName)
    if (!device) return <Monitor className="h-4 w-4" />
    
    switch (device.type) {
      case 'mobile':
        return <Smartphone className="h-4 w-4" />
      case 'tablet':
        return <Tablet className="h-4 w-4" />
      default:
        return <Monitor className="h-4 w-4" />
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Unlimited Access Banner */}
      {unlimitedAccess && (
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 shadow-lg mb-8 rounded-lg overflow-hidden">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 animate-pulse" />
                <span className="font-bold">UNLIMITED ACCESS ACTIVE</span>
              </div>
              <Badge
                variant="secondary"
                className="bg-white/20 text-white border-white/30"
              >
                Premium
              </Badge>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <span className="hidden sm:inline">
                Expires in: {formatRemainingTime(remainingTime)}
              </span>
              <Link href="/unlimitedaccess">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:text-green-600 hover:bg-white/20"
                >
                  Manage Access
                </Button>
              </Link>
            </div>
          </div>
          <div className="mt-1 text-green-100 text-sm text-center sm:text-left">
            🚀 Unlimited AI analyses • No usage limits • Priority processing
          </div>
        </div>
      )}

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Mobile Accessibility Analysis
          </CardTitle>
          <CardDescription>
            Test your website for mobile-specific accessibility requirements including touch targets and mobile WCAG compliance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

            <div className="space-y-2">
              <Label htmlFor="device">Test Device</Label>
              <Select value={selectedDevice} onValueChange={setSelectedDevice}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select device" />
                </SelectTrigger>
                <SelectContent className="bg-background border">
                  {devices.map((device) => (
                    <SelectItem key={device.name} value={device.name}>
                      <div className="flex items-center gap-2">
                        {getDeviceIcon(device.name)}
                        {device.name} ({device.width}×{device.height})
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {unlimitedAccess && (
                <p className="text-xs text-muted-foreground">
                  Unlimited access also runs a tablet comparison when you test a mobile device.
                </p>
              )}
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="mt-4 border-red-200 bg-red-50 text-red-900">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <div className="ml-2">
                <p className="font-semibold">Analysis Failed</p>
                <AlertDescription className="text-red-800 mt-1">
                  {error}
                </AlertDescription>
              </div>
            </Alert>
          )}

          {!unlimitedAccess && (
            <Alert className="mt-4">
              <Hand className="h-4 w-4" />
              <AlertDescription>
                <strong>Credits Required:</strong> This analysis uses 2 credits for the selected device audit and includes comprehensive mobile accessibility testing with touch target analysis.
              </AlertDescription>
            </Alert>
          )}

          <Button 
            onClick={handleAnalyze}
            disabled={isAnalyzing || !url}
            className="w-full mt-6 h-auto whitespace-normal py-3 xs2:h-10 xs2:whitespace-nowrap xs2:py-2"
          >
            {isAnalyzing ? (
              <>
                <Zap className="mr-2 h-4 w-4 animate-spin flex-shrink-0" />
                Analyzing Mobile Accessibility...
              </>
            ) : (
              <>
                <Target className="mr-2 h-4 w-4 flex-shrink-0" />
                {unlimitedAccess ? (
                  "Start Mobile Analysis (Unlimited)"
                ) : (
                  "Start Mobile Analysis (2 Credits)"
                )}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {isAnalyzing && (
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Gauge className="h-5 w-5 animate-pulse" />
                <span className="font-medium">Running Mobile Accessibility Tests...</span>
              </div>
              <Progress value={65} className="w-full" />
              <div className="text-sm text-muted-foreground">
                Testing touch targets, viewport settings, and mobile-specific WCAG requirements...
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {results.length > 0 && (
        <div className="space-y-8">
          {results.map((result, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex flex-wrap items-center justify-center xs3:justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {getDeviceIcon(result.device)}
                    <div>
                      <CardTitle className="text-xl">{result.device}</CardTitle>
                      <CardDescription>
                        Viewport: {result.viewport.width}×{result.viewport.height}px
                      </CardDescription>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${getScoreColor(result.accessibility.score)}`}>
                      {result.accessibility.score}
                    </div>
                    <div className="text-sm text-muted-foreground">Accessibility Score</div>
                    <Badge className={`mt-1 ${getScoreBadgeColor(result.accessibility.score)}`}>
                      {result.accessibility.score >= 90 ? 'Excellent' : result.accessibility.score >= 70 ? 'Good' : 'Needs Work'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="rounded-lg border p-4">
                    <div className="text-sm text-muted-foreground">Total Findings</div>
                    <div className="text-2xl font-bold">{getTotalFindings(result)}</div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="text-sm text-muted-foreground">Blockers</div>
                    <div className="text-2xl font-bold text-red-600">{getBlockerFindings(result)}</div>
                  </div>
                  <div className="rounded-lg border p-4">
                    <div className="text-sm text-muted-foreground">Warnings</div>
                    <div className="text-2xl font-bold text-yellow-600">{getWarningFindings(result)}</div>
                  </div>
                </div>

                <Tabs defaultValue="touch-targets" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
                    <TabsTrigger value="touch-targets">Touch Targets</TabsTrigger>
                    <TabsTrigger value="performance">Performance</TabsTrigger>
                    <TabsTrigger value="mobile-friendly">Mobile-Friendly</TabsTrigger>
                    <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="touch-targets" className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{result.touchTargets.total}</div>
                        <div className="text-sm text-muted-foreground">Total Targets</div>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{result.touchTargets.passing}</div>
                        <div className="text-sm text-muted-foreground">Passing</div>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-red-600">{result.touchTargets.failing}</div>
                        <div className="text-sm text-muted-foreground">Failing</div>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">{result.touchTargets.warningCount}</div>
                        <div className="text-sm text-muted-foreground">Warnings</div>
                      </div>
                    </div>

                    {result.touchTargets.issues.length === 0 && (
                      <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-900">
                        No touch target issues were found for this device viewport.
                      </div>
                    )}

                    {result.touchTargets.issues.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-semibold">Touch Target Issues</h4>
                        {result.touchTargets.issues.map((issue, i) => (
                          <div 
                            key={i}
                            className="p-3 rounded-lg border bg-muted/30"
                          >
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap gap-2 items-center">
                                <p className="font-medium truncate" title={issue.element}>{issue.element}</p>
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs capitalize ${getSeverityBadgeColor(issue.severity)}`}
                                >
                                  {issue.severity}
                                </Badge>
                              </div>
                              
                              <div className="text-xs text-muted-foreground mt-1">
                                Selector: <code>{issue.selector}</code>
                              </div>
                              {issue.label && (
                                <div className="text-xs text-muted-foreground mt-1">
                                  Label: {issue.label}
                                </div>
                              )}
                              <div className="text-xs text-muted-foreground mt-1">
                                Current size: {issue.size.width}×{issue.size.height}px at {issue.position.x},{issue.position.y}
                              </div>
                              <p className="text-xs mt-1">{issue.reason}</p>
                              <p className="text-xs font-medium mt-1 text-muted-foreground">
                                Recommendation: <span className={issue.severity === 'error' ? "text-red-600" : "text-yellow-600"}>{issue.recommendation}</span>
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="performance" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Zap className="h-4 w-4 text-yellow-600" />
                          <span className="font-medium">Load Time</span>
                        </div>
                        <div className="text-2xl font-bold">{result.performance.loadTime.toFixed(0)}ms</div>
                        <div className="text-sm text-muted-foreground">
                          {result.performance.loadTime < 1500 ? 'Good' : result.performance.loadTime < 3000 ? 'Fair' : 'Needs Improvement'}
                        </div>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Eye className="h-4 w-4 text-blue-600" />
                          <span className="font-medium">First Contentful Paint</span>
                        </div>
                        <div className="text-2xl font-bold">{result.performance.firstContentfulPaint.toFixed(0)}ms</div>
                        <div className="text-sm text-muted-foreground">
                          {result.performance.firstContentfulPaint < 1200 ? 'Good' : result.performance.firstContentfulPaint < 2400 ? 'Fair' : 'Needs Improvement'}
                        </div>
                      </div>

                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Navigation className="h-4 w-4 text-green-600" />
                          <span className="font-medium">Layout Stability</span>
                        </div>
                        <div className="text-2xl font-bold">{result.performance.cumulativeLayoutShift.toFixed(3)}</div>
                        <div className="text-sm text-muted-foreground">
                          {result.performance.cumulativeLayoutShift < 0.1 ? 'Good' : result.performance.cumulativeLayoutShift < 0.25 ? 'Fair' : 'Poor'}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="mobile-friendly" className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(result.mobileFriendly).map(([key, value]) => (
                        key === 'issues' ||
                        key === 'viewportContent' ||
                        key === 'minFontSize' ||
                        key === 'smallTextExamples' ||
                        key === 'smallFormControlExamples'
                          ? null
                          :
                        <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                          <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                          <div className="flex items-center gap-2">
                            {value ? (
                              <>
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <span className="text-green-600 font-medium">Pass</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="h-4 w-4 text-red-600" />
                                <span className="text-red-600 font-medium">Fail</span>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg">
                        <div className="text-sm text-muted-foreground">Viewport Declaration</div>
                        <div className="font-medium break-words mt-1">
                          {result.mobileFriendly.viewportContent || 'Missing'}
                        </div>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <div className="text-sm text-muted-foreground">Smallest Text Found</div>
                        <div className="font-medium mt-1">
                          {result.mobileFriendly.minFontSize ? `${result.mobileFriendly.minFontSize.toFixed(1)}px` : 'Not detected'}
                        </div>
                      </div>
                    </div>

                    {result.mobileFriendly.issues.length === 0 && (
                      <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-900">
                        No additional mobile-specific heuristics failed for this device viewport.
                      </div>
                    )}

                    {result.mobileFriendly.issues.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-semibold">Mobile-Specific Issues</h4>
                        {result.mobileFriendly.issues.map((issue) => (
                          <div key={issue.id} className="rounded-lg border p-4 bg-muted/30">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-medium">{issue.title}</p>
                              <Badge variant="outline" className={getSeverityBadgeColor(issue.severity)}>
                                {issue.severity}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">{issue.details}</p>
                            <p className="text-sm mt-2">
                              Recommendation: <span className="font-medium">{issue.recommendation}</span>
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="accessibility" className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <span className="font-medium">Screen Reader Compatibility</span>
                        <div className="flex items-center gap-2">
                          {result.accessibility.screenReaderCompatibility ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-green-600 font-medium">Compatible</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4 w-4 text-red-600" />
                              <span className="text-red-600 font-medium">Issues Found</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="rounded-lg border p-4">
                          <div className="text-sm text-muted-foreground">Critical</div>
                          <div className="text-2xl font-bold text-red-600">{result.accessibility.summary.critical}</div>
                        </div>
                        <div className="rounded-lg border p-4">
                          <div className="text-sm text-muted-foreground">Serious</div>
                          <div className="text-2xl font-bold text-orange-600">{result.accessibility.summary.serious}</div>
                        </div>
                        <div className="rounded-lg border p-4">
                          <div className="text-sm text-muted-foreground">Moderate</div>
                          <div className="text-2xl font-bold text-yellow-600">{result.accessibility.summary.moderate}</div>
                        </div>
                        <div className="rounded-lg border p-4">
                          <div className="text-sm text-muted-foreground">Minor</div>
                          <div className="text-2xl font-bold text-blue-600">{result.accessibility.summary.minor}</div>
                        </div>
                      </div>

                      {result.accessibility.issues.length === 0 && (
                        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-900">
                          Axe did not report any accessibility violations for this run.
                        </div>
                      )}

                      {result.accessibility.issues.length > 0 && (
                        <div className="space-y-3">
                          <h4 className="font-semibold">Accessibility Issues</h4>
                          {result.accessibility.issues.map((issue, i) => (
                            <div key={`${issue.id}-${i}`} className="p-4 rounded-lg border bg-muted/30">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="font-medium">{issue.title}</p>
                                <Badge variant="outline" className={getImpactBadgeColor(issue.impact)}>
                                  {issue.impact}
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                  {issue.affectedNodes} affected node{issue.affectedNodes === 1 ? '' : 's'}
                                </span>
                              </div>

                              <p className="text-sm text-muted-foreground mt-2">{issue.description}</p>

                              <div className="text-xs text-muted-foreground mt-2">
                                WCAG: {issue.wcagCriteria.join(', ') || 'Not specified'}
                              </div>

                              <p className="text-sm mt-2">
                                Recommendation: <span className="font-medium">{issue.recommendation}</span>
                              </p>

                              {issue.helpUrl && (
                                <a
                                  href={issue.helpUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 text-sm text-blue-600 mt-2 hover:underline"
                                >
                                  Learn more
                                  <ExternalLink className="h-3.5 w-3.5" />
                                </a>
                              )}

                              {issue.sampleNodes.length > 0 && (
                                <div className="mt-3 space-y-2">
                                  {issue.sampleNodes.map((node, nodeIndex) => (
                                    <div key={`${issue.id}-node-${nodeIndex}`} className="rounded border bg-background p-3">
                                      <div className="text-xs font-medium break-all">{node.selector}</div>
                                      {node.htmlSnippet && (
                                        <pre className="mt-2 whitespace-pre-wrap break-words text-xs text-muted-foreground">
                                          {node.htmlSnippet}
                                        </pre>
                                      )}
                                      <p className="text-xs mt-2">{node.failureSummary}</p>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ))}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Export Results
              </CardTitle>
              <CardDescription>
                Save your mobile accessibility analysis for future reference
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={copyResults} className="w-full">
                {copied ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                    Report Copied!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Detailed Report
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
} 
