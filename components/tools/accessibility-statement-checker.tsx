"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { AlertTriangle, CheckCircle2, Copy, ExternalLink, Loader2, Search, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { StatementCheck, StatementRegime, StatementScore } from "@/lib/accessibility-statement-rules"

interface Result {
  input: string
  regime: StatementRegime
  regimeLabel: string
  statementUrl: string | null
  discoveredVia: "provided" | "footer-link" | "common-path" | null
  confidence: "high" | "medium" | "low" | null
  checkedPages: { url: string; status: number; score: number }[]
  wordCount: number
  checks: StatementCheck[]
  score: StatementScore | null
  message: string
}

const REGIME_OPTIONS: { value: StatementRegime; label: string; hint: string }[] = [
  { value: "uk-psbar", label: "UK public sector", hint: "PSBAR 2018, GDS model statement" },
  { value: "eu-wad", label: "EU public sector", hint: "Web Accessibility Directive, Decision 2018/1523" },
  { value: "eaa", label: "EU private sector", hint: "European Accessibility Act, Annex V" },
]

const DISCOVERY_LABEL: Record<string, string> = {
  provided: "the URL you entered",
  "footer-link": "a link on the page, matched by its link text",
  "common-path": "a conventional path",
}

export default function AccessibilityStatementChecker() {
  const [url, setUrl] = useState("")
  const [regime, setRegime] = useState<StatementRegime>("uk-psbar")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<Result | null>(null)
  const [copied, setCopied] = useState(false)
  const resultsHeading = useRef<HTMLHeadingElement>(null)

  async function check(event: React.FormEvent) {
    event.preventDefault()
    if (!url.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch("/api/tools/accessibility-statement-checker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, regime }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Something went wrong checking that URL.")
      } else {
        setResult(data as Result)
        // Move focus to the results so keyboard and screen reader users are not
        // left at the button wondering whether anything happened.
        requestAnimationFrame(() => resultsHeading.current?.focus())
      }
    } catch {
      setError("Could not reach the checker. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  function copyReport() {
    if (!result) return
    const lines = [
      `Accessibility statement check: ${result.input}`,
      `Regime: ${result.regimeLabel}`,
      result.statementUrl ? `Statement found: ${result.statementUrl}` : "Statement found: none",
      result.score
        ? `Mandatory elements present: ${result.score.mandatoryPassed} of ${result.score.mandatoryTotal} (${result.score.percent}%)`
        : "",
      "",
      ...result.checks.map(
        (c) => `[${c.status.toUpperCase()}] ${c.label} (${c.severity})\n  Requirement: ${c.requirement}\n  ${c.status === "pass" ? "Evidence" : "Fix"}: ${c.status === "pass" ? c.evidence ?? "found" : c.fix}\n  Reference: ${c.legalRef}`
      ),
    ].filter(Boolean)
    navigator.clipboard.writeText(lines.join("\n"))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const failed = result?.checks.filter((c) => c.status === "fail") ?? []
  const warned = result?.checks.filter((c) => c.status === "warning") ?? []
  const passed = result?.checks.filter((c) => c.status === "pass") ?? []

  return (
    <div className="space-y-8">
      <h2 className="sr-only">Accessibility statement checker</h2>

      <Card>
        <CardHeader>
          <CardTitle>Check a statement</CardTitle>
          <CardDescription>
            Enter a site and the checker will find its accessibility statement, then grade what the
            statement contains against the rules for the regime you pick.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={check} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="statement-url">Website or statement URL</Label>
              <Input
                id="statement-url"
                type="url"
                inputMode="url"
                placeholder="example.gov.uk"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                aria-describedby="statement-url-hint"
                required
              />
              <p id="statement-url-hint" className="text-sm text-muted-foreground">
                Give the homepage and the statement will be found for you, or link the statement directly.
              </p>
            </div>

            <fieldset className="space-y-3">
              <legend className="text-sm font-medium">Which rules apply?</legend>
              <div className="grid gap-3 sm:grid-cols-3">
                {REGIME_OPTIONS.map((option) => (
                  <label
                    key={option.value}
                    className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 p-3 hover:bg-slate-50 has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50 dark:border-slate-800 dark:hover:bg-slate-900 dark:has-[:checked]:bg-blue-950/30"
                  >
                    <input
                      type="radio"
                      name="regime"
                      value={option.value}
                      checked={regime === option.value}
                      onChange={() => setRegime(option.value)}
                      className="mt-1"
                    />
                    <span>
                      <span className="block text-sm font-medium">{option.label}</span>
                      <span className="block text-xs text-muted-foreground">{option.hint}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <Button type="submit" disabled={loading || !url.trim()}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  Checking
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" aria-hidden="true" />
                  Check statement
                </>
              )}
            </Button>
          </form>

          <div role="status" aria-live="polite" className="mt-4">
            {loading && <p className="text-sm text-muted-foreground">Finding and reading the accessibility statement.</p>}
            {error && (
              <p className="flex items-start gap-2 text-sm text-red-700 dark:text-red-400">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                {error}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {result && (
        <section aria-labelledby="results-heading" className="space-y-6">
          <h3 id="results-heading" ref={resultsHeading} tabIndex={-1} className="text-2xl font-semibold">
            Results for {result.input}
          </h3>

          <Card>
            <CardContent className="pt-6">
              <p className="text-base">{result.message}</p>

              {result.statementUrl ? (
                <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm text-muted-foreground">Statement found at</dt>
                    <dd className="break-words">
                      <a
                        href={result.statementUrl}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="inline-flex items-center gap-1 text-blue-600 underline dark:text-blue-400"
                      >
                        {result.statementUrl}
                        <ExternalLink className="h-3 w-3" aria-hidden="true" />
                        <span className="sr-only">(opens in a new tab)</span>
                      </a>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Discovered via</dt>
                    <dd>
                      {DISCOVERY_LABEL[result.discoveredVia ?? "provided"]}
                      {result.confidence && result.confidence !== "high" && (
                        <span className="ml-2 text-sm text-amber-700 dark:text-amber-400">
                          ({result.confidence} confidence this is the statement)
                        </span>
                      )}
                    </dd>
                  </div>
                  {result.score && (
                    <div>
                      <dt className="text-sm text-muted-foreground">Mandatory elements present</dt>
                      <dd className="text-lg font-semibold">
                        {result.score.mandatoryPassed} of {result.score.mandatoryTotal} ({result.score.percent}%)
                      </dd>
                    </div>
                  )}
                  <div>
                    <dt className="text-sm text-muted-foreground">Checked against</dt>
                    <dd>{result.regimeLabel}</dd>
                  </div>
                </dl>
              ) : (
                <p className="mt-4 text-sm text-muted-foreground">
                  Pages checked: {result.checkedPages.length}. Publishing a statement is itself a legal
                  requirement, so a missing statement is a finding in its own right.
                </p>
              )}

              {result.checks.length > 0 && (
                <Button variant="outline" className="mt-6" onClick={copyReport}>
                  <Copy className="mr-2 h-4 w-4" aria-hidden="true" />
                  {copied ? "Copied" : "Copy report"}
                </Button>
              )}
            </CardContent>
          </Card>

          {[
            { items: failed, title: "Missing mandatory information", tone: "fail" as const },
            { items: warned, title: "Worth fixing", tone: "warning" as const },
            { items: passed, title: "Present", tone: "pass" as const },
          ]
            .filter((group) => group.items.length > 0)
            .map((group) => (
              <div key={group.title}>
                <h4 className="mb-3 text-lg font-semibold">
                  {group.title} ({group.items.length})
                </h4>
                <ul className="space-y-3">
                  {group.items.map((c) => (
                    <li
                      key={c.id}
                      className="rounded-lg border border-slate-200 p-4 dark:border-slate-800"
                    >
                      <div className="flex items-start gap-3">
                        {group.tone === "pass" ? (
                          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" aria-hidden="true" />
                        ) : group.tone === "fail" ? (
                          <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" aria-hidden="true" />
                        ) : (
                          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" aria-hidden="true" />
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-medium">{c.label}</p>
                            <Badge variant={c.severity === "mandatory" ? "destructive" : "secondary"}>
                              {c.severity === "mandatory" ? "Mandatory" : "Recommended"}
                            </Badge>
                            {/* Status is spelled out so it never depends on the icon colour alone. */}
                            <span className="sr-only">
                              Status: {c.status === "pass" ? "present" : c.status === "fail" ? "missing" : "warning"}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">{c.requirement}</p>
                          {c.evidence && (
                            <p className="mt-2 border-l-2 border-slate-300 pl-3 text-sm italic dark:border-slate-700">
                              {c.evidence}
                            </p>
                          )}
                          {c.status !== "pass" && <p className="mt-2 text-sm">{c.fix}</p>}
                          <p className="mt-2 text-xs text-muted-foreground">{c.legalRef}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

          <Card>
            <CardContent className="pt-6">
              <p className="text-sm">
                This checks what the statement <strong>says</strong>, not whether the site is accessible.
                A statement can pass every check here and still describe an inaccessible site. Pair it with{" "}
                <Link href="/tools/url-accessibility-auditor" className="text-blue-600 underline dark:text-blue-400">
                  a WCAG audit of the pages themselves
                </Link>
                , and use{" "}
                <Link href="/tools/accessibility-statement-generator" className="text-blue-600 underline dark:text-blue-400">
                  the statement generator
                </Link>{" "}
                or{" "}
                <Link href="/guides/how-to-write-an-accessibility-statement" className="text-blue-600 underline dark:text-blue-400">
                  the writing guide
                </Link>{" "}
                to fix what is missing.
              </p>
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  )
}
