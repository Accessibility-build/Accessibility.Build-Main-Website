"use client"

import { useState, useCallback } from "react"
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2,
  Copy,
  ExternalLink,
  Search,
  AlertCircle,
  ShieldAlert,
  ShieldCheck,
  Info,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface OverlayResult {
  vendor: string
  vendorWebsite: string
  scriptUrl: string | null
  widgetFound: boolean
  domPatterns: string[]
  globalVarsFound: string[]
}

interface ViolationSummary {
  id: string
  impact: string
  description: string
  help: string
  helpUrl: string
  count: number
}

interface ScanResult {
  url: string
  pageTitle: string
  overlayDetected: boolean
  overlays: OverlayResult[]
  accessibilityScore: number
  totalPasses: number
  violations: {
    critical: number
    serious: number
    moderate: number
    minor: number
    total: number
  }
  topViolations: ViolationSummary[]
  scanDuration: number
}

const impactColors: Record<string, string> = {
  critical: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  serious: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  moderate: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  minor: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
}

export default function OverlayDetector() {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ScanResult | null>(null)

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!url.trim() || isLoading) return

      setIsLoading(true)
      setError(null)
      setResult(null)

      try {
        const response = await fetch("/api/tools/overlay-detector", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: url.trim() }),
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || "Scan failed")
        }

        const data: ScanResult = await response.json()
        setResult(data)
        toast.success("Scan completed!")
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error occurred"
        setError(msg)
        toast.error(msg)
      } finally {
        setIsLoading(false)
      }
    },
    [url, isLoading]
  )

  const copyResults = useCallback(() => {
    if (!result) return
    const text = `Overlay Detection Results for ${result.url}\n\nOverlay Detected: ${result.overlayDetected ? "Yes" : "No"}\n${
      result.overlays.length > 0
        ? `Vendors: ${result.overlays.map((o) => o.vendor).join(", ")}\n`
        : ""
    }Accessibility Score: ${result.accessibilityScore}/100\nViolations: ${result.violations.total} (${result.violations.critical} critical, ${result.violations.serious} serious)\nScan Duration: ${(result.scanDuration / 1000).toFixed(1)}s\n\nScanned by Accessibility.build`
    navigator.clipboard.writeText(text)
    toast.success("Results copied to clipboard!")
  }, [result])

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 dark:text-green-400"
    if (score >= 70) return "text-yellow-600 dark:text-yellow-400"
    if (score >= 50) return "text-orange-600 dark:text-orange-400"
    return "text-red-600 dark:text-red-400"
  }

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4 sm:px-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-amber-500" />
            Accessibility Overlay Detector
          </CardTitle>
          <CardDescription>
            Enter a URL to check if the website uses an accessibility overlay widget and see real accessibility issues the overlay fails to fix.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">Website URL</Label>
              <div className="flex gap-2">
                <Input
                  id="url"
                  type="text"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={isLoading}
                  className="flex-1"
                  aria-describedby="url-help"
                />
                <Button type="submit" disabled={isLoading || !url.trim()}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Scanning...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Scan
                    </>
                  )}
                </Button>
              </div>
              <p id="url-help" className="text-sm text-muted-foreground">
                We&apos;ll scan the page for known overlay vendors (accessiBe, UserWay, AudioEye, EqualWeb, and more) and run a real WCAG accessibility audit.
              </p>
            </div>
          </form>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Loading State */}
      {isLoading && (
        <Card className="mt-6">
          <CardContent className="py-12 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-amber-500 mb-4" />
            <p className="text-lg font-medium">Scanning website...</p>
            <p className="text-sm text-muted-foreground mt-1">
              Loading page, detecting overlays, and running WCAG audit. This may take 15-30 seconds.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-6 mt-6">
          {/* Detection Result */}
          <Card className={cn(
            "border-2",
            result.overlayDetected
              ? "border-amber-500/50 dark:border-amber-500/30"
              : "border-green-500/50 dark:border-green-500/30"
          )}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                {result.overlayDetected ? (
                  <ShieldAlert className="h-10 w-10 text-amber-500 flex-shrink-0" />
                ) : (
                  <ShieldCheck className="h-10 w-10 text-green-500 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold">
                    {result.overlayDetected
                      ? `Overlay Detected: ${result.overlays.map((o) => o.vendor).join(", ")}`
                      : "No Overlay Detected"}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 truncate">
                    {result.pageTitle || result.url}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Scanned in {(result.scanDuration / 1000).toFixed(1)}s
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={copyResults}>
                  <Copy className="mr-2 h-3 w-3" />
                  Copy
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Overlay Details */}
          {result.overlayDetected && result.overlays.map((overlay, i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  {overlay.vendor}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {overlay.scriptUrl && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Script Source</p>
                      <p className="text-sm font-mono break-all mt-1">{overlay.scriptUrl}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Widget Visible</p>
                    <p className="text-sm mt-1">
                      {overlay.widgetFound ? (
                        <Badge variant="outline" className="bg-amber-50 dark:bg-amber-900/20">Yes - Widget injected into page</Badge>
                      ) : (
                        <Badge variant="outline">Script loaded, widget not visible</Badge>
                      )}
                    </p>
                  </div>
                  {overlay.domPatterns.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">DOM Signatures Found</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {overlay.domPatterns.map((p, j) => (
                          <Badge key={j} variant="secondary" className="text-xs">{p}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {overlay.globalVarsFound.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Global Variables</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {overlay.globalVarsFound.map((v, j) => (
                          <Badge key={j} variant="secondary" className="text-xs font-mono">{v}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Why This Matters</AlertTitle>
                  <AlertDescription>
                    Accessibility overlays add a widget to websites that claims to fix accessibility issues automatically. However, research and expert consensus show they cannot remediate most WCAG violations. The accessibility scan below shows real issues that persist despite the overlay being active.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          ))}

          {/* Accessibility Score */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="h-5 w-5" />
                Real Accessibility Scan Results
                {result.overlayDetected && (
                  <Badge variant="outline" className="ml-2 text-xs">
                    With overlay active
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                {result.overlayDetected
                  ? "These are real WCAG violations found while the overlay is running. The overlay does not fix these issues."
                  : "WCAG 2.2 AA compliance scan results for this page."}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Score Display */}
              <div className="text-center">
                <div className={cn("text-5xl font-bold", getScoreColor(result.accessibilityScore))}>
                  {result.accessibilityScore}
                  <span className="text-lg text-muted-foreground">/100</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">Accessibility Score</p>
                <Progress
                  value={result.accessibilityScore}
                  className="mt-3 h-2 max-w-xs mx-auto"
                />
              </div>

              {/* Violation Counts */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="text-center p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
                  <XCircle className="h-5 w-5 text-red-500 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">{result.violations.critical}</p>
                  <p className="text-xs text-muted-foreground">Critical</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20">
                  <AlertTriangle className="h-5 w-5 text-orange-500 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{result.violations.serious}</p>
                  <p className="text-xs text-muted-foreground">Serious</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
                  <AlertCircle className="h-5 w-5 text-yellow-500 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{result.violations.moderate}</p>
                  <p className="text-xs text-muted-foreground">Moderate</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                  <Info className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{result.violations.minor}</p>
                  <p className="text-xs text-muted-foreground">Minor</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground px-1">
                <span>{result.violations.total} total violations found</span>
                <span>{result.totalPasses} checks passed</span>
              </div>

              {/* Top Violations */}
              {result.topViolations.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm">Top Issues Found</h4>
                  {result.topViolations.map((v, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-3 rounded-lg border bg-card"
                    >
                      <Badge className={cn("text-xs flex-shrink-0 mt-0.5", impactColors[v.impact])}>
                        {v.impact}
                      </Badge>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{v.help}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{v.description}</p>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-xs text-muted-foreground">
                            {v.count} {v.count === 1 ? "instance" : "instances"}
                          </span>
                          <a
                            href={v.helpUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                          >
                            Learn more
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {result.violations.total === 0 && (
                <div className="text-center py-6">
                  <CheckCircle className="h-10 w-10 text-green-500 mx-auto mb-2" />
                  <p className="font-medium text-green-600 dark:text-green-400">
                    No automated WCAG violations detected
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Note: Automated testing catches about 30-40% of accessibility issues. Manual testing is still recommended.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Educational Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">What Are Accessibility Overlays?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>
                Accessibility overlays are third-party JavaScript widgets that claim to automatically detect and fix website accessibility issues. They typically add a toolbar icon that offers features like text resizing, contrast adjustment, and screen reader optimization.
              </p>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Why Experts Oppose Overlays</h4>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>They cannot fix most WCAG violations — automated tools catch only 30-40% of issues, and overlays can fix even fewer</li>
                  <li>They may introduce new accessibility barriers (focus traps, screen reader conflicts, performance issues)</li>
                  <li>They do not provide legal protection — courts have ruled that overlays do not constitute compliance</li>
                  <li>They are not a substitute for building accessibility into your design and development process</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Better Alternatives</h4>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>Conduct manual accessibility audits with assistive technology testing</li>
                  <li>Train your development team on WCAG 2.2 guidelines</li>
                  <li>Use automated testing tools (like axe-core) as part of your CI/CD pipeline</li>
                  <li>Engage users with disabilities for usability testing</li>
                  <li>Build accessibility into your design system from the ground up</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
