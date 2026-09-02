// A short block of dated, sourced numbers placed near the top of a page.
//
// Answer engines retrieve passage by passage and weight what sits early in the
// retrieved context, so the figures a page is most likely to be cited for
// belong at the top, each one self-contained: number, meaning, source, date.
// Nothing here is a claim the page does not substantiate further down.

export interface KeyFact {
  /** The figure itself, e.g. "3,117" or "95.9%". */
  value: string
  /** What the figure means, one clause. */
  label: string
  /** Where it comes from, shown as the citation. */
  source: string
  sourceHref?: string
  /** ISO date the figure was published or last checked. */
  asOf: string
}

export function KeyFacts({ title = "Key facts", facts }: { title?: string; facts: KeyFact[] }) {
  return (
    <section
      aria-label={title}
      className="not-prose my-8 rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/40"
    >
      <p className="border-b border-slate-200 px-5 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-slate-500 dark:border-slate-800 dark:text-slate-400">
        {title}
      </p>
      <dl className="grid gap-px bg-slate-200 dark:bg-slate-800 sm:grid-cols-2 lg:grid-cols-3">
        {facts.map((f) => (
          <div key={`${f.value}-${f.label}`} className="bg-white p-5 dark:bg-slate-900/40">
            <dt className="text-sm leading-6 text-slate-600 dark:text-slate-400">{f.label}</dt>
            <dd className="mt-1">
              <span className="font-mono text-2xl font-semibold tabular-nums text-slate-900 dark:text-white">
                {f.value}
              </span>
              <span className="mt-1 block text-xs leading-5 text-slate-500 dark:text-slate-400">
                {f.sourceHref ? (
                  <a
                    href={f.sourceHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-slate-300 underline-offset-2 hover:decoration-slate-600 dark:decoration-slate-600"
                  >
                    {f.source}
                  </a>
                ) : (
                  f.source
                )}
                , <time dateTime={f.asOf}>{f.asOf.length === 4 ? f.asOf : shortDate(f.asOf)}</time>
              </span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

function shortDate(iso: string) {
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString("en-GB", { month: "short", year: "numeric" })
}
