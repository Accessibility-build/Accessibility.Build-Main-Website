import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

// Presentational building blocks for case studies. These exist because a case
// study reads differently from a how-to guide: it is a narrative with evidence,
// so it needs a measured column, a factual header, a chronology, and a way to
// set a claim against the record. Guides use cards and code samples; these do
// not, deliberately.

/**
 * The reading column. Long-form legal narrative is set narrower than the guides
 * (about 68 characters) because it is read start to finish rather than scanned.
 */
export function CaseProse({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[68ch] text-[1.0625rem] leading-[1.75] text-slate-700 dark:text-slate-300",
        "[&>p]:mt-5 [&>ul]:mt-5 [&>ol]:mt-5",
        "[&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5",
        "[&_li]:mt-2 [&_li]:marker:text-slate-400 dark:[&_li]:marker:text-slate-500",
        "[&_strong]:font-semibold [&_strong]:text-slate-900 dark:[&_strong]:text-white",
        "[&_a]:font-medium [&_a]:text-teal-700 [&_a]:underline [&_a]:decoration-teal-700/40 [&_a]:underline-offset-2 hover:[&_a]:decoration-teal-700 dark:[&_a]:text-teal-300 dark:[&_a]:decoration-teal-300/40 dark:hover:[&_a]:decoration-teal-300",
        className,
      )}
    >
      {children}
    </div>
  )
}

/** Section heading with a rule above it, used for the major parts of a case. */
export function CaseSection({
  id,
  title,
  eyebrow,
  children,
}: {
  id: string
  title: string
  eyebrow?: string
  children: ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-24 border-t-2 border-slate-900 pt-8 dark:border-slate-100">
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  )
}

/** Key/value strip of hard facts, shown under the case title. */
export function CaseFacts({ facts }: { facts: { label: string; value: string }[] }) {
  return (
    <dl className="mt-8 grid grid-cols-2 gap-px border border-slate-200 bg-slate-200 sm:grid-cols-3 lg:grid-cols-6 dark:border-slate-800 dark:bg-slate-800">
      {facts.map((fact) => (
        <div key={fact.label} className="bg-white p-4 dark:bg-slate-950">
          <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400">
            {fact.label}
          </dt>
          <dd className="mt-1 text-sm font-medium text-slate-900 dark:text-white">{fact.value}</dd>
        </div>
      ))}
    </dl>
  )
}

/** A wide table that scrolls inside its own container rather than the page. */
export function CaseTable({ caption, children }: { caption?: string; children: ReactNode }) {
  return (
    <div className="mx-auto mt-6 w-full max-w-3xl">
      {caption ? (
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400">
          {caption}
        </p>
      ) : null}
      <div className="overflow-x-auto border border-slate-200 dark:border-slate-800">
        <table className="w-full border-collapse text-sm">{children}</table>
      </div>
    </div>
  )
}

export function CaseTh({ children, numeric }: { children: ReactNode; numeric?: boolean }) {
  return (
    <th
      scope="col"
      className={cn(
        "border-b border-slate-300 bg-slate-50 px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-[0.07em] text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400",
        numeric && "text-right",
      )}
    >
      {children}
    </th>
  )
}

export function CaseTd({ children, numeric }: { children: ReactNode; numeric?: boolean }) {
  return (
    <td
      className={cn(
        "border-b border-slate-200 px-3 py-2.5 align-top text-slate-700 dark:border-slate-800 dark:text-slate-300",
        numeric && "text-right font-mono tabular-nums",
      )}
    >
      {children}
    </td>
  )
}

/**
 * A dated chronology. `emphasis` marks the moments that mattered: "pivot" for a
 * turning point that went against the defendant, "resolution" for the end.
 */
export interface CaseTimelineEntry {
  date: string
  title: string
  body: ReactNode
  emphasis?: "pivot" | "resolution"
}

export function CaseTimeline({ entries }: { entries: CaseTimelineEntry[] }) {
  return (
    <ol className="mx-auto mt-6 w-full max-w-3xl space-y-0">
      {entries.map((entry) => (
        <li
          key={`${entry.date}-${entry.title}`}
          className="grid grid-cols-[1fr] gap-x-6 pb-7 sm:grid-cols-[8.5rem_1fr]"
        >
          <p className="pt-0.5 font-mono text-xs text-slate-500 dark:text-slate-400">{entry.date}</p>
          <div className="relative border-l-2 border-slate-200 pl-5 dark:border-slate-800 sm:pl-6">
            <span
              aria-hidden="true"
              className={cn(
                "absolute left-0 top-2 -translate-x-1/2 rounded-full",
                entry.emphasis === "pivot"
                  ? "h-3 w-3 bg-rose-700 dark:bg-rose-400"
                  : entry.emphasis === "resolution"
                    ? "h-3 w-3 bg-emerald-700 dark:bg-emerald-400"
                    : "h-2 w-2 bg-slate-400 dark:bg-slate-600",
              )}
            />
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">{entry.title}</h3>
            <div className="mt-1.5 text-[0.95rem] leading-7 text-slate-600 dark:text-slate-400">
              {entry.body}
            </div>
          </div>
        </li>
      ))}
    </ol>
  )
}

/**
 * Sets a widely repeated claim against what the record actually says. The
 * labels are real text, not pseudo-content, so they reach assistive technology.
 */
export function CaseCorrection({ claim, record }: { claim: string; record: ReactNode }) {
  return (
    <div className="border-t border-slate-200 py-5 first:border-t-0 dark:border-slate-800">
      <p className="text-[0.95rem] text-slate-900 dark:text-white">
        <span className="text-xs font-semibold uppercase tracking-[0.06em] text-slate-500 dark:text-slate-400">
          Often said:{" "}
        </span>
        <span className="font-semibold">{claim}</span>
      </p>
      <div className="mt-1.5 text-[0.95rem] leading-7 text-slate-600 dark:text-slate-400">
        <span className="text-xs font-semibold uppercase tracking-[0.06em] text-emerald-700 dark:text-emerald-400">
          Record:{" "}
        </span>
        {record}
      </div>
    </div>
  )
}

/** A numbered moment where the outcome was still avoidable, and its price. */
export function CaseExitRamp({
  n,
  title,
  children,
  cost,
}: {
  n: number
  title: string
  children: ReactNode
  cost?: ReactNode
}) {
  return (
    <div className="grid grid-cols-[2.5rem_1fr] gap-x-4 border-t border-slate-200 py-6 first:border-t-0 dark:border-slate-800">
      <p aria-hidden="true" className="font-serif text-2xl font-semibold text-rose-700 tabular-nums dark:text-rose-400">
        {n}
      </p>
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          <span className="sr-only">Exit point {n}. </span>
          {title}
        </h3>
        <div className="mt-2 text-[0.95rem] leading-7 text-slate-600 dark:text-slate-400">{children}</div>
        {cost ? (
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{cost}</p>
        ) : null}
      </div>
    </div>
  )
}

/** A quotation from a judgment or a public statement, with attribution. */
export function CaseQuote({ children, source }: { children: ReactNode; source: string }) {
  return (
    <figure className="mx-auto mt-6 w-full max-w-2xl border-l-[3px] border-teal-700 bg-teal-50/60 py-4 pl-5 pr-4 dark:border-teal-400 dark:bg-teal-950/30">
      <blockquote className="font-serif text-lg leading-8 text-slate-900 dark:text-white">
        {children}
      </blockquote>
      <figcaption className="mt-3 text-sm text-slate-600 dark:text-slate-400">{source}</figcaption>
    </figure>
  )
}

/** An aside that qualifies the surrounding argument. */
export function CaseNote({ title, children }: { title: string; children: ReactNode }) {
  return (
    <aside
      aria-label={title}
      className="mx-auto mt-6 w-full max-w-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/50"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400">
        {title}
      </p>
      <div className="mt-2 text-[0.95rem] leading-7 text-slate-700 dark:text-slate-300">{children}</div>
    </aside>
  )
}
