"use client"

import { useId, useMemo, useState } from "react"
import Link from "next/link"
import { Check, ChevronDown, Copy, ExternalLink, Search, X } from "lucide-react"
import { cn } from "@/lib/utils"
import type { AuditFinding, FindingCategory, Impact, Outcome } from "@/lib/url-audit/types"
import { CATEGORY_LABEL, IMPACTS, IMPACT_META, plural, sourceLabel } from "./meta"

interface FindingsExplorerProps {
  findings: AuditFinding[]
  /** Success criterion picked in the coverage map, for example "1.4.3". */
  scFilter: string | null
  onClearSc: () => void
  /** Totals over every finding. They differ from the list when a free scan holds findings back. */
  totals?: Record<Outcome, number>
  /** Shown under the list when the free scan holds findings back. */
  lockedNotice?: React.ReactNode
}

export function FindingsExplorer({ findings, scFilter, onClearSc, totals, lockedNotice }: FindingsExplorerProps) {
  const searchId = useId()
  const categoryId = useId()
  const impactId = useId()
  const [outcome, setOutcome] = useState<Outcome>("violation")
  const [category, setCategory] = useState<FindingCategory | "all">("all")
  const [impact, setImpact] = useState<Impact | "all">("all")
  const [query, setQuery] = useState("")

  const byOutcome = useMemo(
    () => ({
      violation: findings.filter((finding) => finding.outcome === "violation"),
      review: findings.filter((finding) => finding.outcome === "review"),
    }),
    [findings],
  )

  // A criterion picked in the coverage map can point at review items only; show the tab that has them.
  const effectiveOutcome: Outcome =
    scFilter && !byOutcome[outcome].some((f) => f.wcag.includes(scFilter)) && byOutcome[outcome === "violation" ? "review" : "violation"].some((f) => f.wcag.includes(scFilter))
      ? outcome === "violation"
        ? "review"
        : "violation"
      : outcome

  const categories = useMemo(() => Array.from(new Set(byOutcome[effectiveOutcome].map((f) => f.category))).sort(), [byOutcome, effectiveOutcome])

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return byOutcome[effectiveOutcome].filter(
      (finding) =>
        (category === "all" || finding.category === category) &&
        (impact === "all" || finding.impact === impact) &&
        (!scFilter || finding.wcag.includes(scFilter)) &&
        (!needle ||
          `${finding.title} ${finding.description} ${finding.ruleId} ${finding.wcag.join(" ")} ${finding.nodes.map((n) => `${n.selector} ${n.note ?? ""}`).join(" ")}`
            .toLowerCase()
            .includes(needle)),
    )
  }, [byOutcome, effectiveOutcome, category, impact, scFilter, query])

  const filtered = category !== "all" || impact !== "all" || !!scFilter || !!query.trim()
  const clearAll = () => {
    setCategory("all")
    setImpact("all")
    setQuery("")
    onClearSc()
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div role="group" aria-label="Which findings to show" className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-1 dark:border-slate-700 dark:bg-slate-800">
          {(["violation", "review"] as Outcome[]).map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={effectiveOutcome === value}
              onClick={() => {
                setOutcome(value)
                setCategory("all")
              }}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600",
                effectiveOutcome === value
                  ? "bg-white text-slate-900 shadow-sm dark:bg-slate-950 dark:text-white"
                  : "text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white",
              )}
            >
              {value === "violation" ? "Violations" : "Needs review"}
              <span className="ml-2 rounded-full bg-slate-200 px-2 py-0.5 text-xs tabular-nums text-slate-800 dark:bg-slate-700 dark:text-slate-100">{Math.max(byOutcome[value].length, totals?.[value] ?? 0)}</span>
            </button>
          ))}
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:flex lg:items-end">
          <div className="lg:w-56">
            <label htmlFor={searchId} className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-300">
              Search findings
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden="true" />
              <input
                id={searchId}
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Rule, selector, 1.4.3"
                className="h-10 w-full rounded-md border border-slate-300 bg-white pl-8 pr-3 text-sm text-slate-900 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 dark:border-slate-600 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-400"
              />
            </div>
          </div>
          <div>
            <label htmlFor={categoryId} className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-300">
              Category
            </label>
            <select
              id={categoryId}
              value={category}
              onChange={(event) => setCategory(event.target.value as FindingCategory | "all")}
              className="h-10 w-full rounded-md border border-slate-300 bg-white px-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 dark:border-slate-600 dark:bg-slate-950 dark:text-white"
            >
              <option value="all">All categories</option>
              {categories.map((value) => (
                <option key={value} value={value}>
                  {CATEGORY_LABEL[value]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor={impactId} className="mb-1 block text-xs font-medium text-slate-700 dark:text-slate-300">
              Severity
            </label>
            <select
              id={impactId}
              value={impact}
              onChange={(event) => setImpact(event.target.value as Impact | "all")}
              className="h-10 w-full rounded-md border border-slate-300 bg-white px-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 dark:border-slate-600 dark:bg-slate-950 dark:text-white"
            >
              <option value="all">All severities</option>
              {IMPACTS.map((value) => (
                <option key={value} value={value}>
                  {IMPACT_META[value].label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex min-h-6 flex-wrap items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
        <p role="status" aria-live="polite">
          Showing {visible.length} of {plural(Math.max(byOutcome[effectiveOutcome].length, totals?.[effectiveOutcome] ?? 0), effectiveOutcome === "violation" ? "violation" : "item to review", effectiveOutcome === "violation" ? "violations" : "items to review")}
          {scFilter ? ` for WCAG ${scFilter}` : ""}.
          {lockedNotice && (totals?.[effectiveOutcome] ?? 0) > byOutcome[effectiveOutcome].length ? " The rest are held back in the free scan." : ""}
        </p>
        {filtered && (
          <button type="button" onClick={clearAll} className="inline-flex items-center gap-1 rounded-md px-2 py-1 font-medium text-teal-800 underline underline-offset-2 hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 dark:text-teal-300 dark:hover:bg-teal-950">
            <X className="h-3.5 w-3.5" aria-hidden="true" />
            Clear filters
          </button>
        )}
      </div>

      {effectiveOutcome === "review" && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-100">
          These are leads, not failures: things a machine noticed but cannot judge, such as contrast over images or link text that may get context from its paragraph. They are not counted in the score.
        </p>
      )}

      {visible.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-300 px-4 py-10 text-center text-sm text-slate-700 dark:border-slate-700 dark:text-slate-300">
          {byOutcome[effectiveOutcome].length === 0
            ? lockedNotice && (totals?.[effectiveOutcome] ?? 0) > 0
              ? "These findings are held back in the free scan. Unlock them below."
              : effectiveOutcome === "violation"
              ? "No confirmed violations. Check the needs-review tab and the manual testing plan below."
              : "Nothing flagged for review."
            : "No findings match these filters."}
        </p>
      ) : (
        <ul className="space-y-3">
          {visible.map((finding) => (
            <li key={finding.id}>
              <FindingRow finding={finding} />
            </li>
          ))}
        </ul>
      )}

      {lockedNotice}
    </div>
  )
}

function FindingRow({ finding }: { finding: AuditFinding }) {
  const [open, setOpen] = useState(false)
  const [showAll, setShowAll] = useState(false)
  const panelId = useId()
  const impact = IMPACT_META[finding.impact]
  const nodes = showAll ? finding.nodes : finding.nodes.slice(0, 4)

  return (
    <article className={cn("overflow-hidden rounded-xl border bg-white transition-shadow dark:bg-slate-900", open ? "border-slate-300 shadow-md dark:border-slate-600" : "border-slate-200 shadow-sm dark:border-slate-800")}>
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
          className="flex w-full items-start gap-3 px-4 py-4 text-left hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-600 dark:hover:bg-slate-800/60 sm:px-5"
        >
          <span className={cn("mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full", impact.dot)} aria-hidden="true" />
          <span className="min-w-0 flex-1">
            <span className="block text-base font-semibold leading-snug text-slate-900 dark:text-white">{finding.title}</span>
            <span className="mt-2 flex flex-wrap items-center gap-1.5 text-xs">
              <span className={cn("rounded-full border px-2 py-0.5 font-semibold", impact.chip)}>{impact.label}</span>
              {finding.wcag.length > 0 ? (
                finding.wcag.map((sc) => (
                  <span key={sc} className="rounded-full border border-slate-300 bg-slate-50 px-2 py-0.5 font-medium text-slate-800 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100">
                    WCAG {sc}
                  </span>
                ))
              ) : (
                <span className="rounded-full border border-slate-300 bg-slate-50 px-2 py-0.5 font-medium text-slate-800 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100">Best practice</span>
              )}
              {finding.wcagLevel !== "Best practice" && <span className="font-medium text-slate-700 dark:text-slate-300">Level {finding.wcagLevel}</span>}
              <span className="text-slate-600 dark:text-slate-400" aria-hidden="true">
                ·
              </span>
              <span className="text-slate-700 dark:text-slate-300">{plural(finding.nodeCount, "element")}</span>
              <span className="text-slate-600 dark:text-slate-400" aria-hidden="true">
                ·
              </span>
              <span className={cn("font-medium", finding.source === "axe-core" ? "text-slate-700 dark:text-slate-300" : "text-teal-800 dark:text-teal-300")}>{sourceLabel(finding)}</span>
            </span>
          </span>
          <ChevronDown className={cn("mt-1 h-5 w-5 shrink-0 text-slate-500 transition-transform motion-reduce:transition-none", open && "rotate-180")} aria-hidden="true" />
        </button>
      </h3>

      <div id={panelId} hidden={!open} className="border-t border-slate-200 px-4 pb-5 pt-4 dark:border-slate-800 sm:px-5">
        <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">{finding.description}</p>

        {finding.fix && finding.fix !== finding.title && (
          <div className="mt-4 rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 dark:border-teal-900 dark:bg-teal-950/40">
            <p className="text-xs font-semibold uppercase tracking-wide text-teal-900 dark:text-teal-200">How to fix</p>
            <p className="mt-1 text-sm leading-6 text-teal-950 dark:text-teal-50">{finding.fix}</p>
          </div>
        )}

        {finding.nodes.length > 0 && (
          <div className="mt-5">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
              Affected elements
              {finding.nodeCount > finding.nodes.length && (
                <span className="ml-2 font-normal text-slate-600 dark:text-slate-400">
                  (first {finding.nodes.length} of {finding.nodeCount.toLocaleString("en")})
                </span>
              )}
            </h4>
            <ol className="mt-2 space-y-2">
              {nodes.map((node, index) => (
                <li key={`${node.selector}-${index}`} className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
                  {node.selector && (
                    <div className="flex items-start gap-2">
                      <code className="min-w-0 flex-1 break-all font-mono text-xs text-slate-900 dark:text-slate-100">{node.selector}</code>
                      <CopyButton text={node.selector} label={`Copy selector ${index + 1}`} />
                    </div>
                  )}
                  {node.note && <p className={cn("text-sm text-slate-700 dark:text-slate-300", node.selector && "mt-1.5")}>{node.note}</p>}
                  {node.html && (
                    <pre tabIndex={0} aria-label={`HTML of element ${index + 1}`} className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap break-all rounded-md bg-slate-900 p-2.5 font-mono text-xs leading-5 text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:bg-black">
                      {node.html}
                    </pre>
                  )}
                </li>
              ))}
            </ol>
            {finding.nodes.length > 4 && (
              <button type="button" onClick={() => setShowAll((value) => !value)} className="mt-2 text-sm font-medium text-teal-800 underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 dark:text-teal-300">
                {showAll ? "Show fewer" : `Show all ${finding.nodes.length} listed elements`}
              </button>
            )}
          </div>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-slate-200 pt-4 text-sm dark:border-slate-800">
          <span className="text-slate-600 dark:text-slate-400">
            Rule <code className="font-mono text-xs text-slate-800 dark:text-slate-200">{finding.ruleId}</code>
          </span>
          {finding.wcag.map((sc) => (
            <Link key={sc} href={`/wcag/${sc.replace(/\./g, "-")}`} className="font-medium text-teal-800 underline underline-offset-2 hover:decoration-2 dark:text-teal-300">
              Understand WCAG {sc}
            </Link>
          ))}
          {finding.helpUrl && !finding.helpUrl.includes("accessibility.build/wcag/") && (
            <a href={finding.helpUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium text-teal-800 underline underline-offset-2 hover:decoration-2 dark:text-teal-300">
              Rule documentation
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard
          ?.writeText(text)
          .then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 1500)
          })
          .catch(() => {})
      }}
      aria-label={copied ? "Copied" : label}
      className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-slate-600 hover:bg-slate-200 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
    >
      {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
    </button>
  )
}
