"use client"

import { useState, useCallback, useRef } from "react"
import { useUser } from "@clerk/nextjs"
import { useCredits } from "@/hooks/use-credits"
import {
  FileText,
  Upload,
  Loader2,
  Copy,
  CheckCircle,
  XCircle,
  AlertTriangle,
  AlertCircle,
  Info,
  Sparkles,
  BarChart3,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface PDFCheck {
  id: string
  category: "structure" | "text" | "navigation" | "metadata" | "images"
  name: string
  description: string
  wcagCriteria: string
  severity: "critical" | "serious" | "moderate" | "minor"
  passed: boolean
  details: string
}

interface PDFResult {
  fileName: string
  fileSize: number
  pageCount: number
  checks: PDFCheck[]
  score: number
  summary: {
    total: number
    passed: number
    failed: number
    critical: number
    serious: number
    moderate: number
    minor: number
  }
  aiAnalysis?: {
    overview: string
    topIssues: Array<{ issue: string; fix: string; priority: string }>
    recommendation: string
  }
}

const severityColors: Record<string, string> = {
  critical: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  serious: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  moderate: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  minor: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
}

const categoryLabels: Record<string, { label: string; icon: typeof FileText }> = {
  structure: { label: "Document Structure", icon: BarChart3 },
  text: { label: "Text & Fonts", icon: FileText },
  navigation: { label: "Navigation", icon: FileText },
  metadata: { label: "Metadata", icon: Info },
  images: { label: "Images", icon: FileText },
}

export default function PDFAccessibilityChecker() {
  const { isSignedIn } = useUser()
  const { refreshCredits } = useCredits()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<PDFResult | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: number } | null>(null)

  const handleFile = useCallback(
    (file: File) => {
      if (file.type !== "application/pdf") {
        setError("Please upload a PDF file")
        return
      }
      if (file.size > 10 * 1024 * 1024) {
        setError("PDF file size must be under 10MB")
        return
      }
      setSelectedFile({ name: file.name, size: file.size })
      setError(null)
      setResult(null)

      // Read and upload
      const reader = new FileReader()
      reader.onload = async (event) => {
        const fileData = event.target?.result as string
        await analyzeFile(fileData, file.name, file.size)
      }
      reader.readAsDataURL(file)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isSignedIn]
  )

  const analyzeFile = async (fileData: string, fileName: string, fileSize: number) => {
    if (!isSignedIn) {
      setError("Please sign in to use the PDF Accessibility Checker (2 credits per scan)")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/tools/pdf-accessibility-checker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileData, fileName, fileSize }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Analysis failed")
      }

      const data: PDFResult = await response.json()
      setResult(data)
      refreshCredits()
      toast.success("PDF analysis completed!")
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error"
      setError(msg)
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)
      if (e.dataTransfer.files?.[0]) {
        handleFile(e.dataTransfer.files[0])
      }
    },
    [handleFile]
  )

  const copyResults = useCallback(() => {
    if (!result) return
    const text = `PDF Accessibility Report: ${result.fileName}\n\nScore: ${result.score}/100\nPages: ${result.pageCount}\nChecks: ${result.summary.passed}/${result.summary.total} passed\nFailed: ${result.summary.critical} critical, ${result.summary.serious} serious, ${result.summary.moderate} moderate, ${result.summary.minor} minor\n\n${result.checks
      .filter((c) => !c.passed)
      .map((c) => `[${c.severity.toUpperCase()}] ${c.name}: ${c.details}`)
      .join("\n")}\n\nScanned by Accessibility.build`
    navigator.clipboard.writeText(text)
    toast.success("Results copied to clipboard!")
  }, [result])

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 dark:text-green-400"
    if (score >= 70) return "text-yellow-600 dark:text-yellow-400"
    if (score >= 50) return "text-orange-600 dark:text-orange-400"
    return "text-red-600 dark:text-red-400"
  }

  // Group checks by category
  const groupedChecks = result
    ? result.checks.reduce(
        (acc, check) => {
          if (!acc[check.category]) acc[check.category] = []
          acc[check.category].push(check)
          return acc
        },
        {} as Record<string, PDFCheck[]>
      )
    : {}

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4 sm:px-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-red-500" />
            PDF Accessibility Checker
          </CardTitle>
          <CardDescription>
            Upload a PDF to check for accessibility issues. We analyze document structure, metadata, text content, images, and navigation against WCAG and PDF/UA standards.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Drag & Drop Zone */}
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
              dragActive
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-primary/50",
              isLoading && "pointer-events-none opacity-60"
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            aria-label="Upload PDF file"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                fileInputRef.current?.click()
              }
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) handleFile(e.target.files[0])
              }}
              disabled={isLoading}
            />
            {isLoading ? (
              <>
                <Loader2 className="mx-auto h-10 w-10 animate-spin text-red-500 mb-3" />
                <p className="text-lg font-medium">Analyzing PDF...</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Checking structure, metadata, text, and images. AI analysis in progress.
                </p>
              </>
            ) : (
              <>
                <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                <p className="text-lg font-medium">
                  {selectedFile ? selectedFile.name : "Drop a PDF here or click to upload"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  PDF files up to 10MB. Analysis costs 2 credits.
                </p>
              </>
            )}
          </div>

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!isSignedIn && (
            <Alert className="mt-4">
              <Info className="h-4 w-4" />
              <AlertTitle>Sign In Required</AlertTitle>
              <AlertDescription>
                Please sign in to use the PDF Accessibility Checker. Each scan costs 2 credits.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <div className="space-y-6 mt-6">
          {/* Score Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold">{result.fileName}</h3>
                  <p className="text-sm text-muted-foreground">
                    {result.pageCount} pages &middot; {(result.fileSize / 1024).toFixed(0)} KB
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={copyResults}>
                  <Copy className="mr-2 h-3 w-3" />
                  Copy
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Score */}
                <div className="text-center p-4 rounded-lg border">
                  <div className={cn("text-4xl font-bold", getScoreColor(result.score))}>
                    {result.score}
                    <span className="text-lg text-muted-foreground">/100</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Accessibility Score</p>
                  <Progress value={result.score} className="mt-2 h-2" />
                </div>

                {/* Passed/Failed */}
                <div className="text-center p-4 rounded-lg border">
                  <div className="flex items-center justify-center gap-4">
                    <div>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">{result.summary.passed}</p>
                      <p className="text-xs text-muted-foreground">Passed</p>
                    </div>
                    <div className="h-8 w-px bg-border" />
                    <div>
                      <p className="text-2xl font-bold text-red-600 dark:text-red-400">{result.summary.failed}</p>
                      <p className="text-xs text-muted-foreground">Failed</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{result.summary.total} total checks</p>
                </div>

                {/* Severity Breakdown */}
                <div className="p-4 rounded-lg border space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-red-600 dark:text-red-400">Critical</span>
                    <span className="font-bold">{result.summary.critical}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-orange-600 dark:text-orange-400">Serious</span>
                    <span className="font-bold">{result.summary.serious}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-yellow-600 dark:text-yellow-400">Moderate</span>
                    <span className="font-bold">{result.summary.moderate}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-600 dark:text-blue-400">Minor</span>
                    <span className="font-bold">{result.summary.minor}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Analysis */}
          {result.aiAnalysis && (
            <Card className="border-purple-200 dark:border-purple-800/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sparkles className="h-5 w-5 text-purple-500" />
                  AI Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm">{result.aiAnalysis.overview}</p>

                {result.aiAnalysis.topIssues.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Priority Fixes</h4>
                    {result.aiAnalysis.topIssues.map((issue, i) => (
                      <div key={i} className="p-3 rounded-lg border bg-card">
                        <div className="flex items-start gap-2">
                          <Badge variant="outline" className="text-xs flex-shrink-0 mt-0.5">
                            {issue.priority || `#${i + 1}`}
                          </Badge>
                          <div>
                            <p className="text-sm font-medium">{issue.issue}</p>
                            <p className="text-xs text-muted-foreground mt-1">{issue.fix}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {result.aiAnalysis.recommendation && (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      {result.aiAnalysis.recommendation}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}

          {/* Detailed Checks by Category */}
          {Object.entries(groupedChecks).map(([category, checks]) => (
            <Card key={category}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">
                  {categoryLabels[category]?.label || category}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {checks.map((check) => (
                  <div
                    key={check.id}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-lg border",
                      check.passed
                        ? "bg-green-50/50 dark:bg-green-900/10 border-green-200 dark:border-green-800/30"
                        : "bg-card"
                    )}
                  >
                    {check.passed ? (
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium">{check.name}</span>
                        {!check.passed && (
                          <Badge className={cn("text-xs", severityColors[check.severity])}>
                            {check.severity}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{check.details}</p>
                      <p className="text-xs text-muted-foreground/70 mt-1">{check.wcagCriteria}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
