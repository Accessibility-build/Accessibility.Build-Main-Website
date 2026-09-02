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
        "w-full max-w-[70ch] text-[1.0625rem] leading-[1.75] text-slate-700 dark:text-slate-300",
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
    <section
      id={id}
      className="scroll-mt-24 border-t-2 border-slate-900 pt-8 dark:border-slate-100"
    >
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

/**
 * A short boundary statement placed before the narrative. Legal case studies
 * need this early because many readers arrive with a remembered headline and
 * may not reach the later qualifications.
 */
export function CaseScopeSummary({
  established,
  notEstablished,
  children,
}: {
  established: ReactNode[]
  notEstablished: ReactNode[]
  children?: ReactNode
}) {
  return (
    <aside
      aria-labelledby="case-scope-title"
      className="border-y-2 border-slate-900 bg-slate-50/70 py-7 dark:border-slate-100 dark:bg-slate-900/45 sm:py-8"
    >
      <div className="max-w-[70ch]">
        <h2
          id="case-scope-title"
          className="text-wrap-balance font-serif text-2xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-3xl"
        >
          What this case actually established
        </h2>
        <p className="mt-3 text-base leading-7 text-slate-600 dark:text-slate-300">
          The holding is important, but narrower than the headline version often repeated online.
        </p>
      </div>

      <div className="mt-6 grid gap-0 border-y border-slate-200 dark:border-slate-800 md:grid-cols-2 md:divide-x md:divide-slate-200 dark:md:divide-slate-800">
        <section aria-labelledby="case-scope-established" className="py-5 md:pr-7">
          <h3
            id="case-scope-established"
            className="text-sm font-semibold text-emerald-800 dark:text-emerald-300"
          >
            Established by the record
          </h3>
          <ul className="mt-3 space-y-3 text-[0.95rem] leading-6 text-slate-700 dark:text-slate-300">
            {established.map((item, index) => (
              <li key={index} className="grid grid-cols-[1rem_1fr] gap-2.5">
                <svg
                  viewBox="0 0 16 16"
                  className="mt-1 h-4 w-4 text-emerald-700 dark:text-emerald-400"
                  aria-hidden="true"
                >
                  <path
                    d="M3 8.5l3.25 3.25L13 4.75"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section
          aria-labelledby="case-scope-not-established"
          className="border-t border-slate-200 py-5 dark:border-slate-800 md:border-t-0 md:pl-7"
        >
          <h3
            id="case-scope-not-established"
            className="text-sm font-semibold text-slate-800 dark:text-slate-200"
          >
            Outside the ruling
          </h3>
          <ul className="mt-3 space-y-3 text-[0.95rem] leading-6 text-slate-700 dark:text-slate-300">
            {notEstablished.map((item, index) => (
              <li key={index} className="grid grid-cols-[1rem_1fr] gap-2.5">
                <svg
                  viewBox="0 0 16 16"
                  className="mt-1 h-4 w-4 text-slate-500 dark:text-slate-400"
                  aria-hidden="true"
                >
                  <path
                    d="M3.5 8h9"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {children ? <div className="max-w-[70ch]">{children}</div> : null}
    </aside>
  )
}

export interface CaseSourceLink {
  label: string
  href: string
}

/** Compact, local citations for the claims in a section. */
export function CaseSourceLinks({
  label = "Primary record",
  ariaLabel,
  sources,
  className,
}: {
  label?: string
  ariaLabel: string
  sources: CaseSourceLink[]
  className?: string
}) {
  return (
    <nav
      aria-label={ariaLabel}
      className={cn(
        "mt-6 flex max-w-[70ch] flex-col gap-2 border-t border-slate-200 pt-4 text-sm sm:flex-row sm:items-baseline sm:gap-4 dark:border-slate-800",
        className,
      )}
    >
      <p className="shrink-0 font-semibold text-slate-700 dark:text-slate-300">{label}</p>
      <ul className="flex flex-wrap gap-x-4 gap-y-2">
        {sources.map((source) => (
          <li key={source.href}>
            <a
              href={source.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-teal-700 underline decoration-teal-700/40 underline-offset-[3px] hover:decoration-teal-700 focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 dark:text-teal-300 dark:decoration-teal-300/40 dark:hover:decoration-teal-300 dark:focus-visible:ring-teal-300 dark:focus-visible:ring-offset-slate-950"
            >
              {source.label}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

/** A wide table that scrolls inside its own container rather than the page. */
export function CaseTable({ caption, children }: { caption?: string; children: ReactNode }) {
  return (
    <div className="mt-6 w-full">
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
    <ol className="mt-6 w-full space-y-0">
      {entries.map((entry) => (
        <li
          key={`${entry.date}-${entry.title}`}
          className="grid grid-cols-[1fr] gap-x-6 pb-7 sm:grid-cols-[8.5rem_1fr]"
        >
          <p className="pt-0.5 font-mono text-xs text-slate-500 dark:text-slate-400">
            {entry.date}
          </p>
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
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              {entry.title}
            </h3>
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
/**
 * The list wrapper for corrections. `role="list"` is set explicitly because
 * removing the marker strips list semantics in some browsers, and the count is
 * the useful part here: a reader should be told there are eleven of these.
 */
export function CaseCorrections({ children }: { children: ReactNode }) {
  return (
    <ol
      role="list"
      className="mt-8 w-full list-none space-y-px overflow-hidden rounded-lg border border-slate-200 bg-slate-200 p-0 dark:border-slate-800 dark:bg-slate-800"
    >
      {children}
    </ol>
  )
}

/**
 * One claim set against the record.
 *
 * The two are placed in adjacent columns rather than stacked so the correction
 * reads as a rebuttal of the line beside it. Each side is marked with an icon
 * and a word, never colour alone: the distinction between what is said and what
 * is documented is the whole point of the section, so it cannot be carried by
 * red and green.
 */
export function CaseCorrection({ claim, record }: { claim: string; record: ReactNode }) {
  return (
    <li className="grid gap-x-8 gap-y-4 bg-white p-5 dark:bg-slate-900 md:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] md:p-6">
      <div>
        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-rose-700 dark:text-rose-300">
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0" aria-hidden="true">
            <path
              d="M4 4l8 8M12 4l-8 8"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.25"
              strokeLinecap="round"
            />
          </svg>
          Often said
        </p>
        <p className="mt-2 text-[0.95rem] font-semibold leading-6 text-slate-900 dark:text-white">
          {claim}
        </p>
      </div>
      <div className="border-t border-slate-200 pt-4 dark:border-slate-800 md:border-l md:border-t-0 md:pl-8 md:pt-0">
        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-emerald-700 dark:text-emerald-300">
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0" aria-hidden="true">
            <path
              d="M3 8.5l3.5 3.5L13 4.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          The record
        </p>
        <div className="mt-2 text-[0.95rem] leading-7 text-slate-600 dark:text-slate-400">
          {record}
        </div>
      </div>
    </li>
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
      <p
        aria-hidden="true"
        className="font-serif text-2xl font-semibold text-rose-700 tabular-nums dark:text-rose-400"
      >
        {n}
      </p>
      <div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          <span className="sr-only">Exit point {n}. </span>
          {title}
        </h3>
        <div className="mt-2 text-[0.95rem] leading-7 text-slate-600 dark:text-slate-400">
          {children}
        </div>
        {cost ? <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{cost}</p> : null}
      </div>
    </div>
  )
}

/** A quotation from a judgment or a public statement, with attribution. */
export function CaseQuote({ children, source }: { children: ReactNode; source: string }) {
  return (
    <figure className="mt-6 w-full max-w-[62ch] border-l-[3px] border-teal-700 bg-teal-50/60 py-4 pl-5 pr-4 dark:border-teal-400 dark:bg-teal-950/30">
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
      className="mt-6 w-full max-w-[68ch] border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/50"
    >
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400">
        {title}
      </p>
      <div className="mt-2 text-[0.95rem] leading-7 text-slate-700 dark:text-slate-300">
        {children}
      </div>
    </aside>
  )
}
