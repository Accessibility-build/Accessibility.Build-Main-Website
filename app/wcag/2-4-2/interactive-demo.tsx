"use client"

import { useState } from "react"
import { AlertCircle, CheckCircle, Lightbulb } from "lucide-react"

interface TitleAnalysis {
  length: number
  isDescriptive: boolean
  issues: string[]
  suggestions: string[]
}

function analyzeTitle(title: string): TitleAnalysis {
  const length = title.length
  const words = title.trim().split(/\s+/).filter(Boolean)
  const isDescriptive = length > 10 && words.length > 2

  const issues: string[] = []
  const suggestions: string[] = []

  if (length < 10) {
    issues.push("Title is very short")
    suggestions.push("Add words that name the page's specific topic or purpose.")
  }
  if (length > 60) {
    issues.push("Title may be truncated in browser tabs and search results")
    suggestions.push("Aim for roughly 60 characters or fewer, front-loading the unique part.")
  }
  if (words.length < 2) {
    issues.push("A single word rarely describes a page")
    suggestions.push("Use a few words plus the site name, e.g. 'Contact us — Acme Support'.")
  }
  const lower = title.toLowerCase()
  if (["untitled", "page", "document", "home", "welcome"].some((g) => lower.split(/\s+/).includes(g)) && !isDescriptive) {
    issues.push("Generic wording detected")
    suggestions.push("Replace generic terms with what the page is actually about.")
  }
  if (!isDescriptive && issues.length === 0) {
    issues.push("Not descriptive enough")
    suggestions.push("Make sure the title identifies this page and distinguishes it from others.")
  }

  return { length, isDescriptive, issues, suggestions }
}

const presets = [
  "Page",
  "Untitled Document",
  "Home",
  "Contact us — Acme Support",
  "Shopping cart (3 items) — Acme Store",
]

export default function PageTitleDemo() {
  const [title, setTitle] = useState("")
  const analysis = title.trim() ? analyzeTitle(title) : null

  const lengthColor =
    analysis && analysis.length >= 10 && analysis.length <= 60
      ? "text-green-600 dark:text-green-400"
      : "text-amber-600 dark:text-amber-400"

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-5">
      <div>
        <label
          htmlFor="title-input"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
        >
          Type a page title to check whether it describes the page
        </label>
        <input
          id="title-input"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Contact us — Acme Support"
          className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {presets.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setTitle(p)}
              className="rounded-full border border-slate-200 dark:border-slate-700 px-3 py-1 text-xs text-slate-600 dark:text-slate-300 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {analysis && (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-4">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-3 text-sm">
              What the browser tab would show
            </h3>
            <div className="rounded-md bg-slate-100 dark:bg-slate-800 px-3 py-2 text-sm text-slate-800 dark:text-slate-200 truncate">
              {title}
            </div>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-600 dark:text-slate-400">Length</dt>
                <dd className={`font-medium ${lengthColor}`}>{analysis.length} characters</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-600 dark:text-slate-400">Descriptive</dt>
                <dd
                  className={`font-medium ${
                    analysis.isDescriptive
                      ? "text-green-600 dark:text-green-400"
                      : "text-rose-600 dark:text-rose-400"
                  }`}
                >
                  {analysis.isDescriptive ? "Yes" : "Not yet"}
                </dd>
              </div>
            </dl>
          </div>

          <div className="space-y-3">
            {analysis.issues.length > 0 ? (
              <div className="rounded-lg border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-4">
                <h3 className="font-semibold text-rose-800 dark:text-rose-300 mb-2 flex items-center gap-2 text-sm">
                  <AlertCircle className="h-4 w-4" /> Issues
                </h3>
                <ul className="space-y-1 text-sm text-rose-700 dark:text-rose-300">
                  {analysis.issues.map((issue) => (
                    <li key={issue}>• {issue}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="rounded-lg border border-green-200 dark:border-green-900/40 bg-green-50 dark:bg-green-950/20 p-4">
                <h3 className="font-semibold text-green-800 dark:text-green-300 flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4" /> This reads as a descriptive title
                </h3>
              </div>
            )}
            {analysis.suggestions.length > 0 && (
              <div className="rounded-lg border border-blue-200 dark:border-blue-900/40 bg-blue-50 dark:bg-blue-950/20 p-4">
                <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2 text-sm">
                  <Lightbulb className="h-4 w-4" /> Suggestions
                </h3>
                <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
                  {analysis.suggestions.map((s) => (
                    <li key={s}>• {s}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      <p className="text-xs text-slate-500 dark:text-slate-400">
        This is a rough heuristic to build intuition — WCAG 2.4.2 is a human judgment call
        about whether the title describes the page, not a character count.
      </p>
    </div>
  )
}
