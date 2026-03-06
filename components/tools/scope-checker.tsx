"use client"

import { useMemo, useState } from "react"
import { toast } from "sonner"
import {
  AlertTriangle,
  Clock,
  Copy,
  Download,
  ExternalLink,
  FileText,
  Globe,
  Layers,
  Link2,
  Loader2,
  Search,
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { ScopeCheckerResult } from "@/lib/scope-checker-types"

interface UrlRow {
  type: "page" | "document" | "external"
  url: string
  title: string
  detail: string
  discoveredFrom?: string
}

function normalizeInputUrl(rawUrl: string): string | null {
  const trimmed = rawUrl.trim()
  if (!trimmed) {
    return null
  }

  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`

  try {
    const parsed = new URL(candidate)
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return null
    }
    return parsed.toString()
  } catch {
    return null
  }
}

function formatDuration(ms: number): string {
  if (ms < 1_000) {
    return `${ms}ms`
  }
  const seconds = Math.round(ms / 1_000)
  const mins = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  if (mins === 0) {
    return `${seconds}s`
  }
  return `${mins}m ${remainingSeconds}s`
}

function csvEscape(value: string): string {
  return `"${value.replace(/"/g, "\"\"")}"`
}

export default function ScopeChecker() {
  const [url, setUrl] = useState("")
  const [maxPages, setMaxPages] = useState(200)
  const [maxDepth, setMaxDepth] = useState(3)
  const [includeSubdomains, setIncludeSubdomains] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ScopeCheckerResult | null>(null)

  const allUrls = useMemo<UrlRow[]>(() => {
    if (!result) {
      return []
    }

    const pageRows: UrlRow[] = result.pages.map((page) => ({
      type: "page",
      url: page.url,
      title: page.title,
      detail: `Status ${page.statusCode} • Depth ${page.depth}`,
      discoveredFrom: page.discoveredFrom,
    }))

    const documentRows: UrlRow[] = result.documents.map((document) => ({
      type: "document",
      url: document.url,
      title: document.url.split("/").pop() || document.url,
      detail: `Document • ${document.fileType}`,
      discoveredFrom: document.discoveredFrom,
    }))

    const externalRows: UrlRow[] = result.externalLinks.map((external) => ({
      type: "external",
      url: external.url,
      title: external.url,
      detail: "External Link",
      discoveredFrom: external.discoveredFrom,
    }))

    return [...pageRows, ...documentRows, ...externalRows]
  }, [result])

  const runScopeCheck = async () => {
    const normalizedUrl = normalizeInputUrl(url)
    if (!normalizedUrl) {
      setError("Please provide a valid URL (e.g. https://example.com).")
      return
    }

    setIsRunning(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch("/api/tools/scope-checker", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: normalizedUrl,
          maxPages,
          maxDepth,
          includeSubdomains,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to run scope checker")
      }

      const nextResult = data as ScopeCheckerResult
      setResult(nextResult)
      toast.success(`Scope check completed: ${nextResult.discoveredUrls} URLs discovered`)
    } catch (runError) {
      const message = runError instanceof Error ? runError.message : "Failed to run scope checker"
      setError(message)
      toast.error(message)
    } finally {
      setIsRunning(false)
    }
  }

  const copyJson = async () => {
    if (!result) {
      return
    }

    await navigator.clipboard.writeText(JSON.stringify(result, null, 2))
    toast.success("Result JSON copied")
  }

  const downloadCsv = () => {
    if (!result) {
      return
    }

    const rows = [
      ["type", "url", "title", "detail", "discoveredFrom"],
      ...allUrls.map((entry) => [
        entry.type,
        entry.url,
        entry.title,
        entry.detail,
        entry.discoveredFrom ?? "",
      ]),
    ]

    const csv = rows.map((row) => row.map((value) => csvEscape(value)).join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const objectUrl = URL.createObjectURL(blob)
    const anchor = document.createElement("a")
    anchor.href = objectUrl
    anchor.download = "scope-checker-results.csv"
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
    URL.revokeObjectURL(objectUrl)
    toast.success("CSV exported")
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Scope Checker for Accessibility
          </CardTitle>
          <CardDescription>
            Crawl a website in scoped mode (max 2 minutes) and capture internal URLs, document links, extra external links, and page titles for accessibility audits.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-3 space-y-2">
              <Label htmlFor="scope-url">Website URL</Label>
              <Input
                id="scope-url"
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(event) => setUrl(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="scope-max-pages">Max Pages</Label>
              <Input
                id="scope-max-pages"
                type="number"
                min={10}
                max={1000}
                value={maxPages}
                onChange={(event) => setMaxPages(Math.min(1000, Math.max(10, Number.parseInt(event.target.value || "200", 10))))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="scope-max-depth">Max Depth</Label>
              <Input
                id="scope-max-depth"
                type="number"
                min={1}
                max={6}
                value={maxDepth}
                onChange={(event) => setMaxDepth(Math.min(6, Math.max(1, Number.parseInt(event.target.value || "3", 10))))}
              />
            </div>

            <div className="flex items-end">
              <div className="flex items-center justify-between w-full rounded-md border px-3 h-10">
                <Label htmlFor="scope-subdomains" className="text-sm">
                  Include Subdomains
                </Label>
                <Switch
                  id="scope-subdomains"
                  checked={includeSubdomains}
                  onCheckedChange={setIncludeSubdomains}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button onClick={runScopeCheck} disabled={isRunning || !url.trim()}>
              {isRunning ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Running Scope Check...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Run Scope Check
                </>
              )}
            </Button>
            <Badge variant="secondary" className="h-10 px-3">
              2-minute hard limit
            </Badge>
          </div>
        </CardContent>
      </Card>

      {isRunning && (
        <Alert>
          <Clock className="h-4 w-4" />
          <AlertTitle>Processing</AlertTitle>
          <AlertDescription>
            Running chunked crawl and sitemap discovery. This run will stop automatically within 2 minutes.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Scope Check Failed</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Discovered URLs</p>
                <p className="text-2xl font-bold">{result.discoveredUrls}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Pages</p>
                <p className="text-2xl font-bold">{result.pages.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">Documents</p>
                <p className="text-2xl font-bold">{result.documents.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">External Extras</p>
                <p className="text-2xl font-bold">{result.externalLinks.length}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="outline">
                  <Clock className="h-3 w-3 mr-1" />
                  Duration: {formatDuration(result.elapsedMs)}
                </Badge>
                <Badge variant="outline">
                  Scanned: {result.scannedPages} pages
                </Badge>
                <Badge variant={result.timedOut ? "destructive" : "secondary"}>
                  {result.timedOut ? "Timed out at 2 minutes" : "Completed within time budget"}
                </Badge>
                <Button variant="outline" size="sm" onClick={copyJson}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy JSON
                </Button>
                <Button variant="outline" size="sm" onClick={downloadCsv}>
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-6">
              <TabsTrigger value="all">All URLs</TabsTrigger>
              <TabsTrigger value="pages">Pages</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="external">Extras</TabsTrigger>
              <TabsTrigger value="chunks">Chunks</TabsTrigger>
              <TabsTrigger value="issues">Issues</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <Card>
                <CardHeader>
                  <CardTitle>All Discovered URLs</CardTitle>
                  <CardDescription>
                    Combined list of pages, documents, and extra links.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[520px] pr-4">
                    <div className="space-y-3">
                      {allUrls.map((entry) => (
                        <div key={`${entry.type}-${entry.url}`} className="p-3 border rounded-md">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="uppercase">
                              {entry.type}
                            </Badge>
                            <span className="text-sm text-muted-foreground">{entry.detail}</span>
                          </div>
                          <p className="font-medium break-all">{entry.title}</p>
                          <a
                            href={entry.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline break-all inline-flex items-center gap-1"
                          >
                            {entry.url}
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                          {entry.discoveredFrom && (
                            <p className="text-xs text-muted-foreground mt-1 break-all">
                              From: {entry.discoveredFrom}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pages">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Pages with Titles
                  </CardTitle>
                  <CardDescription>
                    Title extraction is done for each HTML page.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[520px] pr-4">
                    <div className="space-y-3">
                      {result.pages.map((page) => (
                        <div key={page.url} className="p-3 border rounded-md">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">Status {page.statusCode}</Badge>
                            <Badge variant="secondary">Depth {page.depth}</Badge>
                            <span className="text-xs text-muted-foreground">{page.contentType}</span>
                          </div>
                          <p className="font-medium">{page.title}</p>
                          <a
                            href={page.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline break-all inline-flex items-center gap-1"
                          >
                            {page.url}
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Documents
                  </CardTitle>
                  <CardDescription>
                    PDF, Office files, and other document URLs found in scope.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[520px] pr-4">
                    <div className="space-y-3">
                      {result.documents.map((document) => (
                        <div key={document.url} className="p-3 border rounded-md">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">{document.fileType}</Badge>
                          </div>
                          <a
                            href={document.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline break-all inline-flex items-center gap-1"
                          >
                            {document.url}
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                          {document.discoveredFrom && (
                            <p className="text-xs text-muted-foreground mt-1 break-all">
                              From: {document.discoveredFrom}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="external">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Link2 className="h-4 w-4" />
                    Extra External Links
                  </CardTitle>
                  <CardDescription>
                    Out-of-scope links discovered while scanning your site.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[520px] pr-4">
                    <div className="space-y-3">
                      {result.externalLinks.map((external) => (
                        <div key={external.url} className="p-3 border rounded-md">
                          <a
                            href={external.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline break-all inline-flex items-center gap-1"
                          >
                            {external.url}
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                          {external.discoveredFrom && (
                            <p className="text-xs text-muted-foreground mt-1 break-all">
                              From: {external.discoveredFrom}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="chunks">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="h-4 w-4" />
                    Chunk-by-Chunk Output
                  </CardTitle>
                  <CardDescription>
                    URLs grouped in chunks of {result.chunks[0]?.pages.length || 0} for review and export workflows.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[520px] pr-4">
                    <div className="space-y-4">
                      {result.chunks.map((chunk) => (
                        <div key={chunk.chunk} className="p-3 border rounded-md">
                          <div className="flex items-center gap-2 mb-3">
                            <Badge variant="outline">Chunk {chunk.chunk}</Badge>
                            <span className="text-sm text-muted-foreground">
                              URLs {chunk.fromIndex} to {chunk.toIndex}
                            </span>
                          </div>
                          <div className="space-y-2">
                            {chunk.pages.map((page) => (
                              <div key={page.url} className="text-sm">
                                <p className="font-medium">{page.title}</p>
                                <p className="text-muted-foreground break-all">{page.url}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="issues">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Crawl Issues
                  </CardTitle>
                  <CardDescription>
                    Fetch and parsing issues captured during the run.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {result.issues.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No crawl issues recorded.</p>
                  ) : (
                    <ScrollArea className="h-[520px] pr-4">
                      <div className="space-y-3">
                        {result.issues.map((issue, index) => (
                          <div key={`${issue.url}-${index}`} className="p-3 border rounded-md">
                            <p className="text-sm font-medium">{issue.message}</p>
                            <p className="text-xs text-muted-foreground break-all mt-1">{issue.url}</p>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}
