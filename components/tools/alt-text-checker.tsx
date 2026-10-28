"use client"

import { useEffect, useId, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { AlertTriangle, Download, Info, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { UrlCheckForm } from "@/components/tools/url-check-form"
import { SiteScanHandoff } from "@/components/tools/site-scan-handoff"
import { ImageCard, OutcomeBadge } from "@/components/tools/alt-text-checker/image-card"
import { postTool } from "@/lib/render/client"
import { VERDICT_LABEL, toCsv } from "@/lib/alt-text-audit/csv"
import { filterGroupOf, type FilterGroup } from "@/lib/alt-text-audit/rules"
import type { AiVerdictKind, AltTextCheckResponse } from "@/lib/alt-text-audit/types"
import { cn } from "@/lib/utils"

// Alt Text Checker: loads a page in a real browser on the server, checks every image's text
// alternative against rules that need no judgement (missing alt, an image link with no name, file
// names, placeholders and so on), and optionally asks a vision model to judge up to eight images in
// context. The rules run free on every check; the AI review is opt-in because it costs money and
// sends screenshots to a third party.

type Filter = "all" | FilterGroup

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "failures", label: "Failures" },
  { value: "review", label: "Needs review" },
  { value: "fine", label: "Fine" },
]

function pageLabel(url: string): string {
  try {
    const parsed = new URL(url)
    return `${parsed.hostname.replace(/^www\./, "")}${parsed.pathname === "/" ? "" : parsed.pathname}`
  } catch {
    return url
  }
}

export default function AltTextChecker() {
  const [url, setUrl] = useState("")
  const [aiReview, setAiReview] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<AltTextCheckResponse | null>(null)
  const [filter, setFilter] = useState<Filter>("all")
  const [status, setStatus] = useState("")
  const controller = useRef<AbortController | null>(null)
  const resultsHeading = useRef<HTMLHeadingElement>(null)
  const aiId = useId()

  useEffect(() => () => controller.current?.abort(), [])

  const check = async () => {
    if (!url.trim()) {
      setError("Enter a page address, for example https://example.com")
      return
    }
    controller.current?.abort()
    const current = new AbortController()
    controller.current = current
    setLoading(true)
    setError(null)
    setResult(null)
    setFilter("all")
    setStatus(
      aiReview
        ? "Loading the page, checking its images and running the AI review. This usually takes 20 to 50 seconds."
        : "Loading the page and checking its images. This usually takes 15 to 40 seconds.",
    )
    try {
      const data = await postTool<AltTextCheckResponse>("/api/tools/alt-text-checker", { url, ai: aiReview }, current.signal)
      setResult(data)
      const { summary } = data
      setStatus(
        summary.total === 0
          ? "Check finished. No images that need alt text were found on that page."
          : `Check finished. ${summary.total} image${summary.total === 1 ? "" : "s"} checked: ${summary.fail} with failures, ${summary.review} to review, ${summary.decorative + summary.pass} fine by the rules.${
              data.ai.status === "done" ? ` The AI reviewed ${data.ai.reviewed}.` : ""
            }`,
      )
      // Keyboard and screen reader users would otherwise be left at the button.
      requestAnimationFrame(() => resultsHeading.current?.focus())
    } catch (caught) {
      if ((caught as Error)?.name === "AbortError") return
      const message = caught instanceof Error ? caught.message : "The check failed. Please try again."
      setError(message)
      setStatus("")
    } finally {
      if (controller.current === current) setLoading(false)
    }
  }

  const groups = useMemo(() => {
    const counts: Record<Filter, number> = { all: 0, failures: 0, review: 0, fine: 0 }
    for (const image of result?.images ?? []) {
      counts.all++
      counts[filterGroupOf(image)]++
    }
    return counts
  }, [result])

  const shown = useMemo(
    () => (result?.images ?? []).filter((image) => filter === "all" || filterGroupOf(image) === filter),
    [result, filter],
  )

  const download = () => {
    if (!result) return
    // The byte order mark makes Excel read the file as UTF-8, so accented alt text survives.
    const blob = new Blob([`﻿${toCsv(result.images)}`], { type: "text/csv;charset=utf-8" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `alt-text-check-${pageLabel(result.url).replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").slice(0, 60) || "page"}.csv`
    document.body.appendChild(link)
    link.click()
    link.remove()
    setTimeout(() => URL.revokeObjectURL(link.href), 1000)
    setStatus("CSV downloaded.")
  }

  const summary = result?.summary

  const verdictTally = useMemo(() => {
    const counts = new Map<AiVerdictKind, number>()
    for (const image of result?.images ?? []) if (image.ai) counts.set(image.ai.verdict, (counts.get(image.ai.verdict) ?? 0) + 1)
    return Array.from(counts, ([verdict, count]) => `${count} ${VERDICT_LABEL[verdict].toLowerCase()}`).join(", ")
  }, [result])

  return (
    <div className="space-y-8">
      <UrlCheckForm
        value={url}
        onChange={setUrl}
        onSubmit={check}
        loading={loading}
        submitLabel="Check the images"
        loadingLabel="Checking"
        help="A public page address. We load it in a real browser, scroll it so lazy images load, and check every image it shows."
        error={error}
      >
        <div className="flex items-start gap-3 rounded-lg border border-slate-200 p-3 dark:border-slate-700">
          <Checkbox
            id={aiId}
            checked={aiReview}
            onCheckedChange={(value) => setAiReview(value === true)}
            aria-describedby={`${aiId}-help`}
            className="mt-0.5 h-5 w-5 border-slate-500 data-[state=checked]:border-teal-700 data-[state=checked]:bg-teal-700 dark:border-slate-400"
          />
          <div>
            <label htmlFor={aiId} className="cursor-pointer text-sm font-semibold text-slate-900 dark:text-white">
              Also run the AI review on up to 8 images
            </label>
            <p id={`${aiId}-help`} className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
              A vision model judges whether each image&apos;s alt text fits its purpose and suggests better text.
              Screenshots of the selected images, their alt text and nearby page text are sent to a third-party
              AI model. Two free reviews a day without an account; signed in, each review costs 2 credits. The rule
              checks are always free.
            </p>
          </div>
        </div>
      </UrlCheckForm>

      <div role="status" aria-live="polite" className={cn("text-sm text-slate-700 dark:text-slate-300", !status && "sr-only")}>
        {status}
      </div>

      {result && summary && (
        <section aria-labelledby="alt-results-heading" className="space-y-6">
          <div>
            <h2
              id="alt-results-heading"
              ref={resultsHeading}
              tabIndex={-1}
              className="font-serif text-2xl font-semibold text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 dark:text-white sm:text-3xl"
            >
              Results for {pageLabel(result.url)}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600 [overflow-wrap:anywhere] dark:text-slate-400">
              {result.title ? <>&ldquo;{result.title}&rdquo;, checked </> : "Checked "}
              {new Date(result.checkedAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}.
            </p>
          </div>

          <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {(
              [
                ["fail", "Fail a rule", summary.fail],
                ["review", "Need review", summary.review],
                ["decorative", "Decorative and fine", summary.decorative],
                ["pass", "No rule problems", summary.pass],
              ] as const
            ).map(([outcome, label, count]) => (
              <div key={outcome} className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                <dt>
                  <OutcomeBadge outcome={outcome} label={label} />
                </dt>
                <dd className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{count}</dd>
              </div>
            ))}
          </dl>

          <div className="space-y-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
            <p>
              {summary.total} image{summary.total === 1 ? "" : "s"} checked
              {summary.truncated ? ` (the first ${summary.total} of ${summary.totalFound}, in page order)` : ""}.{" "}
              {summary.hidden + summary.tracking > 0 &&
                `Skipped ${summary.hidden} hidden from everyone or from assistive technology, and ${summary.tracking} tracking pixel${summary.tracking === 1 ? "" : "s"}. `}
            </p>
            {summary.backgroundImages > 0 && (
              <p>
                {summary.backgroundImages} element{summary.backgroundImages === 1 ? " uses" : "s use"} a CSS background image. Those
                have no alt attribute and are not checked here: if one carries information, that information needs to be in
                text as well.
              </p>
            )}
          </div>

          {result.ai.status !== "off" && (
            <div
              className={cn(
                "flex items-start gap-3 rounded-lg border p-4 text-sm leading-6",
                result.ai.status === "done"
                  ? "border-teal-200 bg-teal-50 text-teal-900 dark:border-teal-900 dark:bg-teal-950/40 dark:text-teal-100"
                  : "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100",
              )}
            >
              {result.ai.status === "done" ? (
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              ) : (
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              )}
              <div>
                {result.ai.status === "done" && (
                  <p>
                    The AI reviewed {result.ai.reviewed} image{result.ai.reviewed === 1 ? "" : "s"}
                    {result.ai.creditsUsed ? ` and used ${result.ai.creditsUsed} credits` : ""}
                    {verdictTally ? `: ${verdictTally}` : ""}. Its verdicts are a second opinion: it can misread an image or
                    its purpose, so check each one before you change anything.
                  </p>
                )}
                {result.ai.status === "failed" && <p>{result.ai.message}</p>}
                {result.ai.status === "refused" && (
                  <p>
                    {result.ai.message}{" "}
                    {result.ai.reason === "trial" && (
                      <Link href="/sign-up" className="font-semibold underline underline-offset-2">
                        Create a free account
                      </Link>
                    )}
                    {result.ai.reason === "credits" && (
                      <Link href="/billing" className="font-semibold underline underline-offset-2">
                        Buy credits
                      </Link>
                    )}
                  </p>
                )}
              </div>
            </div>
          )}

          {summary.total > 0 ? (
            <>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <fieldset>
                  <legend className="text-sm font-semibold text-slate-900 dark:text-white">Show</legend>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {FILTERS.map((option) => (
                      <label
                        key={option.value}
                        className={cn(
                          "inline-flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-teal-600 has-[:focus-visible]:ring-offset-2 dark:has-[:focus-visible]:ring-offset-slate-950",
                          filter === option.value
                            ? "border-teal-700 bg-teal-700 text-white dark:border-teal-400 dark:bg-teal-400 dark:text-slate-950"
                            : "border-slate-300 bg-white text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800",
                        )}
                      >
                        <input
                          type="radio"
                          name="alt-filter"
                          value={option.value}
                          checked={filter === option.value}
                          onChange={() => {
                            setFilter(option.value)
                            setStatus(`Showing ${groups[option.value]} image${groups[option.value] === 1 ? "" : "s"}.`)
                          }}
                          className="sr-only"
                        />
                        {option.label} ({groups[option.value]})
                      </label>
                    ))}
                  </div>
                </fieldset>
                <Button type="button" variant="outline" onClick={download} className="self-start focus-visible:ring-2 focus-visible:ring-teal-600 sm:self-auto">
                  <Download className="mr-2 h-4 w-4" aria-hidden="true" />
                  Download CSV
                </Button>
              </div>

              {shown.length > 0 ? (
                <ol className="space-y-4" aria-label="Images on the page">
                  {shown.map((image) => (
                    <li key={image.id}>
                      <ImageCard image={image} onCopied={setStatus} />
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-600 dark:border-slate-700 dark:text-slate-400">
                  No images in this group.
                </p>
              )}
            </>
          ) : (
            <p className="flex items-start gap-2 rounded-lg border border-slate-200 p-4 text-sm text-slate-700 dark:border-slate-800 dark:text-slate-300">
              <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              No images that need alt text were found. If the page shows pictures, they may be CSS backgrounds, inside a
              frame, or loaded only after an interaction this check does not perform.
            </p>
          )}

          <SiteScanHandoff
            key={result.url}
            source="alt_text_checker"
            heading="Check the rest of this page"
            body="Alt text is one of many WCAG checks. Run the free scan for contrast, labels, headings and the other automated checks on the same page."
            defaultValue={result.url}
          />
        </section>
      )}
    </div>
  )
}
