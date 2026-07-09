import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  getAdjacentCriteria,
  getRelatedCriteria,
  isWcagPageBuilt,
  wcagPath,
} from "@/lib/wcag-pages"

// Shared cross-linking block for every /wcag/<criterion> page:
// related-criteria cards plus previous/next navigation in spec order.
export function CriterionLinks({ number }: { number: string }) {
  const related = getRelatedCriteria(number).filter((c) => isWcagPageBuilt(c.number))
  const { prev, next } = getAdjacentCriteria(number)

  return (
    <section aria-label="Related WCAG success criteria" className="my-12">
      {related.length > 0 && (
        <>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            Related Success Criteria
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {related.map((c) => (
              <Link
                key={c.number}
                href={wcagPath(c.number)}
                className="group block rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 transition-colors hover:border-blue-300 dark:hover:border-blue-600"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {c.number} {c.title}
                  </span>
                  <Badge variant="outline">{c.level}</Badge>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                  {c.description}
                </p>
              </Link>
            ))}
          </div>
        </>
      )}

      <nav aria-label="Success criterion navigation" className="flex flex-col sm:flex-row gap-4 justify-between">
        {prev && isWcagPageBuilt(prev.number) ? (
          <Link
            href={wcagPath(prev.number)}
            className="group flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-3 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
            <span className="text-sm text-slate-700 dark:text-slate-300">
              <span className="block text-xs text-slate-500 dark:text-slate-400">Previous</span>
              {prev.number} {prev.title}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next && isWcagPageBuilt(next.number) ? (
          <Link
            href={wcagPath(next.number)}
            className="group flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-3 hover:border-blue-300 dark:hover:border-blue-600 transition-colors sm:text-right"
          >
            <span className="text-sm text-slate-700 dark:text-slate-300">
              <span className="block text-xs text-slate-500 dark:text-slate-400">Next</span>
              {next.number} {next.title}
            </span>
            <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </section>
  )
}
