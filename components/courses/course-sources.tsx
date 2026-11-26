import type { CourseSource } from "@/lib/courses/types"
import { company } from "@/lib/company"
import { BookOpen, ChevronRight, ExternalLink, MessageSquare } from "lucide-react"

const context = { exam: "Exam source", practice: "Professional practice", unconfirmed: "Unconfirmed — check the original source" }

export function CourseSources({ sources = [], slug, item }: { sources?: CourseSource[]; slug: string; item: string }) {
  const safe = sources.filter((source) => source.url.startsWith("https://"))
  return <details className="group/sources my-6 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 dark:border-slate-800 dark:bg-slate-900/50">
    <summary className="flex min-h-[44px] cursor-pointer list-none items-center gap-2 rounded-lg font-semibold text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-300 [&::-webkit-details-marker]:hidden dark:text-white"><BookOpen aria-hidden="true" focusable="false" strokeWidth={1.75} className="h-4 w-4 shrink-0 text-slate-500 dark:text-slate-400" /><span className="flex-1">Sources and corrections</span><ChevronRight aria-hidden="true" focusable="false" strokeWidth={1.75} className="h-4 w-4 shrink-0 text-slate-500 group-open/sources:rotate-90 dark:text-slate-400" /></summary>
    <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">Check the source version and context. A course reference is not a prediction of what the real exam will ask.</p>
    <ul className="mt-4 space-y-4 text-sm">
      {safe.map((source, i) => <li key={`${source.url}:${i}`}>
        <a href={source.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-start gap-1.5 rounded font-medium text-blue-700 underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-300 dark:text-blue-300"><span>{source.title}<span className="sr-only"> (opens in a new tab)</span></span><ExternalLink aria-hidden="true" focusable="false" strokeWidth={1.75} className="mt-0.5 h-4 w-4 shrink-0" /></a>
        <p className="mt-1 text-slate-600 dark:text-slate-400">{source.context ? context[source.context] : "Reference"}{source.version ? ` · ${source.version}` : ""}{source.reviewedAt ? ` · Reviewed ${source.reviewedAt}` : ""}</p>
      </li>)}
    </ul>
    {!safe.length ? <p className="mt-2 text-sm">Use the reference shown with this lesson.</p> : null}
    <a href={`mailto:${company.email}?subject=${encodeURIComponent(`Course correction: ${slug} / ${item}`)}`} className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded py-2 text-sm font-medium text-blue-700 underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-300 dark:text-blue-300"><MessageSquare aria-hidden="true" focusable="false" strokeWidth={1.75} className="h-4 w-4 shrink-0" />Report an issue with this item</a>
  </details>
}
