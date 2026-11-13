import { Fragment, type ReactNode } from "react"
import { AlertTriangle, CalendarClock, Lightbulb, Target, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import type { CourseBlock } from "@/lib/courses/types"

const URL_RE = /(https?:\/\/[^\s<>()]+[^\s<>().,;:!?'"])/g

/** Inline markup used in course text: **bold** and bare URLs. Everything else is plain text. */
export function Inline({ text }: { text: string }) {
  const out: ReactNode[] = []
  text.split(/(\*\*[^*]+\*\*)/g).forEach((part, i) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      out.push(<strong key={i} className="font-semibold text-slate-900 dark:text-white">{part.slice(2, -2)}</strong>)
      return
    }
    part.split(URL_RE).forEach((seg, j) => {
      if (/^https?:\/\//.test(seg)) {
        out.push(
          <a key={`${i}-${j}`} href={seg} className="underline underline-offset-2 break-words text-blue-700 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300" rel="noopener noreferrer">
            {seg.replace(/^https?:\/\//, "").replace(/\/$/, "")}
          </a>
        )
      } else if (seg) out.push(<Fragment key={`${i}-${j}`}>{seg}</Fragment>)
    })
  })
  return <>{out}</>
}

const CALLOUT: Record<string, { label: string; cls: string; icon: LucideIcon; iconCls: string }> = {
  "exam-focus": { label: "Study focus", icon: Target, cls: "border-blue-300 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/60", iconCls: "text-blue-700 dark:text-blue-300" },
  "memory-aid": { label: "Memory aid", icon: Lightbulb, cls: "border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/60", iconCls: "text-emerald-700 dark:text-emerald-300" },
  "watch-out": { label: "Watch out", icon: AlertTriangle, cls: "border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/60", iconCls: "text-amber-800 dark:text-amber-300" },
  today: { label: "Since the Body of Knowledge was written", icon: CalendarClock, cls: "border-purple-300 bg-purple-50 dark:border-purple-800 dark:bg-purple-950/60", iconCls: "text-purple-700 dark:text-purple-300" },
}

export function ChapterBlocks({ blocks, idPrefix }: { blocks: CourseBlock[]; idPrefix: string }) {
  return (
    <div className="space-y-5 text-[1.0625rem] leading-[1.75] text-slate-800 dark:text-slate-200">
      {blocks.map((b, i) => {
        const id = `${idPrefix}-${i}`
        switch (b.type) {
          case "p":
            return <p key={i}><Inline text={b.text} /></p>
          case "h2":
            return <h2 key={i} id={id} className="scroll-mt-28 border-t border-slate-200 pt-8 text-2xl font-bold tracking-tight text-slate-900 first:border-t-0 first:pt-0 dark:border-slate-800 dark:text-white"><Inline text={b.text} /></h2>
          case "h3":
            return <h3 key={i} id={id} className="scroll-mt-28 pt-2 text-xl font-semibold text-slate-900 dark:text-white"><Inline text={b.text} /></h3>
          case "bullets":
            return <ul key={i} className="list-disc space-y-2 pl-6 marker:text-slate-500 dark:marker:text-slate-400">{b.items.map((t, j) => <li key={j}><Inline text={t} /></li>)}</ul>
          case "numbered":
            return <ol key={i} className="list-decimal space-y-2 pl-6 marker:font-semibold marker:text-slate-600 dark:marker:text-slate-400">{b.items.map((t, j) => <li key={j}><Inline text={t} /></li>)}</ol>
          case "table":
            return (
              <div key={i} role="region" aria-labelledby={`${id}-cap`} tabIndex={0} className="overflow-x-auto rounded-lg border border-slate-300 dark:border-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600">
                <table className="w-full text-left text-sm">
                  <caption id={`${id}-cap`} className="px-3 py-2 text-left font-semibold text-slate-900 dark:text-white"><Inline text={b.caption} /></caption>
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white">
                    <tr>{b.headers.map((h, j) => <th key={j} scope="col" className="border-t border-slate-300 dark:border-slate-700 p-3 align-bottom"><Inline text={h} /></th>)}</tr>
                  </thead>
                  <tbody>
                    {b.rows.map((r, j) => (
                      <tr key={j} className="border-t border-slate-200 dark:border-slate-800 align-top">
                        {r.map((c, k) => k === 0
                          ? <th key={k} scope="row" className="p-3 font-semibold text-slate-900 dark:text-white min-w-[8rem]"><Inline text={c} /></th>
                          : <td key={k} className="p-3 min-w-[10rem]"><Inline text={c} /></td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          case "keyterms":
            return (
              <section key={i} aria-labelledby={id} className="border-t border-slate-200 pt-8 dark:border-slate-800">
                <h2 id={id} className="scroll-mt-28 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Key terms</h2>
                <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                  {b.items.map((t, j) => (
                    <div key={j} className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                      <dt className="font-semibold text-slate-900 dark:text-white"><Inline text={t.term} /></dt>
                      <dd className="mt-1 text-base leading-relaxed text-slate-700 dark:text-slate-300"><Inline text={t.def} /></dd>
                    </div>
                  ))}
                </dl>
              </section>
            )
          case "callout": {
            const c = CALLOUT[b.kind] ?? CALLOUT["watch-out"]
            const Icon = c.icon
            return (
              <div key={i} role="note" aria-labelledby={id} className={cn("rounded-xl border p-5", c.cls)}>
                <p aria-hidden="true" className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  <Icon aria-hidden="true" className={cn("h-4 w-4", c.iconCls)} />
                  {c.label}
                </p>
                <p id={id} className="mt-1.5 font-semibold text-slate-900 dark:text-white">
                  <span className="sr-only">{c.label}: </span><Inline text={b.title} />
                </p>
                {b.text.split("\n").filter(Boolean).map((t, j) => <p key={j} className="mt-2 text-base leading-relaxed"><Inline text={t} /></p>)}
              </div>
            )
          }
          case "code":
            return (
              <figure key={i} className="space-y-2">
                <figcaption id={`${id}-cap`} className="text-sm font-semibold text-slate-900 dark:text-white"><Inline text={b.caption} /></figcaption>
                <pre
                  tabIndex={0}
                  role="region"
                  aria-labelledby={`${id}-cap`}
                  className="overflow-x-auto rounded-lg border border-slate-300 bg-slate-50 p-4 text-sm leading-relaxed text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                ><code>{b.text}</code></pre>
              </figure>
            )
          default:
            return null
        }
      })}
    </div>
  )
}
