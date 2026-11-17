import type { CourseSource } from "@/lib/courses/types"
import { company } from "@/lib/company"

const context = { exam: "Exam source", practice: "Professional practice", unconfirmed: "Unconfirmed — check the original source" }

export function CourseSources({ sources = [], slug, item }: { sources?: CourseSource[]; slug: string; item: string }) {
  const safe = sources.filter((source) => source.url.startsWith("https://"))
  return <details className="my-6 rounded-lg border border-slate-300 p-4 dark:border-slate-700">
    <summary className="cursor-pointer rounded font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600">Sources and corrections</summary>
    <p className="mt-3 text-sm text-slate-600 dark:text-slate-400">Check the source version and context. A course reference is not a prediction of what the real exam will ask.</p>
    <ul className="mt-3 space-y-3 text-sm">
      {safe.map((source, i) => <li key={`${source.url}:${i}`}>
        <a href={source.url} target="_blank" rel="noopener noreferrer" className="rounded font-medium text-blue-800 underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-300">{source.title}<span className="sr-only"> (opens in a new tab)</span></a>
        <p className="text-slate-600 dark:text-slate-400">{source.context ? context[source.context] : "Reference"}{source.version ? ` · ${source.version}` : ""}{source.reviewedAt ? ` · Reviewed ${source.reviewedAt}` : ""}</p>
      </li>)}
    </ul>
    {!safe.length ? <p className="mt-2 text-sm">Use the Body of Knowledge reference shown with this lesson.</p> : null}
    <a href={`mailto:${company.email}?subject=${encodeURIComponent(`Course correction: ${slug} / ${item}`)}`} className="mt-4 inline-block min-h-[44px] rounded py-2 font-medium text-blue-800 underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:text-blue-300">Report an issue with this item</a>
  </details>
}
