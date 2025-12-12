"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { generateErrorReport, generateHumanReadableReport } from "@/lib/error-report"
import { Download, RefreshCw, AlertTriangle, AlertCircle, Info } from "lucide-react"

export function ErrorReportClient() {
  const [reportType, setReportType] = useState<"summary" | "detailed">("summary")
  const [includeAccessibility, setIncludeAccessibility] = useState(true)
  const [includeMinor, setIncludeMinor] = useState(true)
  const [report, setReport] = useState(
    generateErrorReport({
      includeAccessibilityIssues: includeAccessibility,
      includeMinorIssues: includeMinor,
    }),
  )

  const refreshReport = () => {
    setReport(
      generateErrorReport({
        includeAccessibilityIssues: includeAccessibility,
        includeMinorIssues: includeMinor,
      }),
    )
  }

  const downloadReport = () => {
    const reportText = generateHumanReadableReport({
      includeAccessibilityIssues: includeAccessibility,
      includeMinorIssues: includeMinor,
    })

    const blob = new Blob([reportText], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `error-report-${new Date().toISOString().split("T")[0]}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:!flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Error Report</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Comprehensive analysis of application errors and issues
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={refreshReport}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={downloadReport}>
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{report.summary.total}</CardTitle>
            <CardDescription>Total Issues</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between text-sm">
              <span>Last 24 hours</span>
              <span className="font-medium">{report.summary.total}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-destructive">{report.summary.critical}</CardTitle>
            <CardDescription>Critical Errors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between text-sm">
              <span>Last 24 hours</span>
              <span className="font-medium">{report.summary.critical}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl text-amber-500">{report.summary.accessibility}</CardTitle>
            <CardDescription>Accessibility Issues</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between text-sm">
              <span>Last 24 hours</span>
              <span className="font-medium">{report.summary.accessibility}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Error Analysis */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:!flex-row justify-between md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-semibold leading-none tracking-tight">
                Error Analysis
              </h2>
              <CardDescription>
                Detailed breakdown of application errors
              </CardDescription>
            </div>

            <Tabs defaultValue="summary" onValueChange={(value) => setReportType(value as "summary" | "detailed")}>
              <TabsList>
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="detailed">Detailed</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {reportType === "summary" ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Most Frequent Components</h3>
                <div className="space-y-2">
                  {report.mostFrequentComponents.length > 0 ? (
                    report.mostFrequentComponents.map(({ component, count }) => (
                      <div key={component} className="flex justify-between items-center">
                        <span className="font-mono text-sm">{component}</span>
                        <span className="text-sm font-medium">{count} issues</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-sm">No component issues found</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Most Frequent Paths</h3>
                <div className="space-y-2">
                  {report.mostFrequentPaths.length > 0 ? (
                    report.mostFrequentPaths.map(({ path, count }) => (
                      <div key={path} className="flex justify-between items-center">
                        <span className="font-mono text-sm">{path}</span>
                        <span className="text-sm font-medium">{count} issues</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-sm">No path issues found</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {report.criticalErrors.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-4 flex items-center">
                    <AlertTriangle className="h-5 w-5 text-destructive mr-2" />
                    Critical Errors
                  </h3>
                  <div className="space-y-4">
                    {report.criticalErrors.map((error) => (
                      <div key={error.id} className="p-4 border rounded-md">
                        <div className="font-medium mb-2">{error.message}</div>
                        <div className="text-sm text-muted-foreground">
                          <div>ID: {error.id}</div>
                          <div>Time: {new Date(error.timestamp).toLocaleString()}</div>
                          {error.component && <div>Component: {error.component}</div>}
                          {error.path && <div>Path: {error.path}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {report.majorErrors.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-4 flex items-center">
                    <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
                    Major Errors
                  </h3>
                  <div className="space-y-4">
                    {report.majorErrors.map((error) => (
                      <div key={error.id} className="p-4 border rounded-md">
                        <div className="font-medium mb-2">{error.message}</div>
                        <div className="text-sm text-muted-foreground">
                          <div>ID: {error.id}</div>
                          <div>Time: {new Date(error.timestamp).toLocaleString()}</div>
                          {error.component && <div>Component: {error.component}</div>}
                          {error.path && <div>Path: {error.path}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {includeAccessibility && report.accessibilityIssues.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-4 flex items-center">
                    <Info className="h-5 w-5 text-blue-500 mr-2" />
                    Accessibility Issues
                  </h3>
                  <div className="space-y-4">
                    {report.accessibilityIssues.map((error) => (
                      <div key={error.id} className="p-4 border rounded-md">
                        <div className="font-medium mb-2">{error.message}</div>
                        <div className="text-sm text-muted-foreground">
                          <div>ID: {error.id}</div>
                          <div>Time: {new Date(error.timestamp).toLocaleString()}</div>
                          {error.component && <div>Component: {error.component}</div>}
                          {error.path && <div>Path: {error.path}</div>}
                          {error.accessibilityViolation && (
                            <>
                              <div>WCAG: {error.accessibilityViolation.wcagCriterion}</div>
                              <div>Impact: {error.accessibilityViolation.impact}</div>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {includeMinor && report.minorErrors.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-4 flex items-center">
                    <Info className="h-5 w-5 text-muted-foreground mr-2" />
                    Minor Issues
                  </h3>
                  <div className="space-y-4">
                    {report.minorErrors.map((error) => (
                      <div key={error.id} className="p-4 border rounded-md">
                        <div className="font-medium mb-2">{error.message}</div>
                        <div className="text-sm text-muted-foreground">
                          <div>ID: {error.id}</div>
                          <div>Time: {new Date(error.timestamp).toLocaleString()}</div>
                          {error.component && <div>Component: {error.component}</div>}
                          {error.path && <div>Path: {error.path}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {report.criticalErrors.length === 0 &&
                report.majorErrors.length === 0 &&
                (includeAccessibility ? report.accessibilityIssues.length === 0 : true) &&
                (includeMinor ? report.minorErrors.length === 0 : true) && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No errors found in the selected categories</p>
                  </div>
                )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-t pt-6">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="include-accessibility"
              checked={includeAccessibility}
              onChange={(e) => setIncludeAccessibility(e.target.checked)}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="include-accessibility" className="text-sm">
              Include Accessibility Issues
            </label>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="include-minor"
              checked={includeMinor}
              onChange={(e) => setIncludeMinor(e.target.checked)}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <label htmlFor="include-minor" className="text-sm">
              Include Minor Issues
            </label>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
} 