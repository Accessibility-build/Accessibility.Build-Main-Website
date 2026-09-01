import type { ReactNode } from "react"
import Link from "next/link"
import { getCriterion, wcagPath } from "@/lib/wcag-pages"

// Server-rendered explainer blocks shared by the /learn pattern pages. The
// pattern pages themselves are client components (live demos), so the
// explanatory copy lives in each route's layout and renders through these
// pieces to keep it in the served HTML with a consistent heading outline:
// page h1 -> explainer h2 -> block h3.

interface PatternExplainerProps {
  id: string
  title: string
  children: ReactNode
}

export function PatternExplainer({ id, title, children }: PatternExplainerProps) {
  return (
    <section
      aria-labelledby={id}
      className="learn-theme bg-background border-t border-border"
    >
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-10">
        <h2 id={id} className="text-3xl font-bold text-foreground">
          {title}
        </h2>
        {children}
      </div>
    </section>
  )
}

export function ExplainerBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-foreground">{title}</h3>
      {children}
    </div>
  )
}

export function ExplainerProse({ children }: { children: ReactNode }) {
  return <div className="space-y-4 text-muted-foreground leading-relaxed max-w-4xl">{children}</div>
}

interface CriterionRow {
  number: string
  note: string
}

/**
 * Table of WCAG 2.2 success criteria. Titles and levels are looked up from
 * lib/wcag-data so the numbers here can never drift from the canonical list.
 */
export function CriteriaTable({ items }: { items: CriterionRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border border-border rounded-xl overflow-hidden">
        <thead className="bg-muted">
          <tr>
            <th scope="col" className="p-3 text-left font-semibold">Success criterion</th>
            <th scope="col" className="p-3 text-left font-semibold">Level</th>
            <th scope="col" className="p-3 text-left font-semibold">What it requires here</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const criterion = getCriterion(item.number)
            return (
              <tr key={item.number} className="border-t border-border align-top">
                <td className="p-3 whitespace-nowrap">
                  <Link href={wcagPath(item.number)} className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                    {item.number} {criterion?.title ?? ""}
                  </Link>
                </td>
                <td className="p-3">{criterion?.level ?? ""}</td>
                <td className="p-3 text-muted-foreground">{item.note}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

interface KeyboardRow {
  keys: string
  action: string
}

export function KeyboardTable({ rows, caption }: { rows: KeyboardRow[]; caption: string }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border border-border rounded-xl overflow-hidden">
        <caption className="sr-only">{caption}</caption>
        <thead className="bg-muted">
          <tr>
            <th scope="col" className="p-3 text-left font-semibold">Key</th>
            <th scope="col" className="p-3 text-left font-semibold">Expected result</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.keys} className="border-t border-border align-top">
              <td className="p-3 font-mono whitespace-nowrap bg-muted/40">{row.keys}</td>
              <td className="p-3 text-muted-foreground">{row.action}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

interface FailureItem {
  title: string
  detail: string
}

export function FailureList({ items }: { items: FailureItem[] }) {
  return (
    <ol className="list-decimal pl-6 space-y-3 text-muted-foreground leading-relaxed max-w-4xl">
      {items.map((item) => (
        <li key={item.title}>
          <strong className="text-foreground">{item.title}</strong> {item.detail}
        </li>
      ))}
    </ol>
  )
}
