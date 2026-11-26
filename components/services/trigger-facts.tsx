import { CalendarClock, Check, ExternalLink } from "lucide-react"

export interface TriggerFact {
  title: string
  body: string
}

export interface TriggerSource {
  label: string
  href: string
}

interface TriggerFactsProps {
  heading: string
  intro: string
  deadlineLabel: string
  deadline: string
  deadlineNote: string
  facts: TriggerFact[]
}

/**
 * The "why now" block on a market landing page: the date that forces the
 * decision, then the handful of rules a buyer needs to understand before they
 * pick a package. Facts are short and every one is backed by an entry in
 * TriggerSources further down the page.
 */
export function TriggerFacts({ heading, intro, deadlineLabel, deadline, deadlineNote, facts }: TriggerFactsProps) {
  return (
    <section className="py-16" aria-labelledby="trigger-heading">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <h2 id="trigger-heading" className="text-3xl font-bold mb-4">
            {heading}
          </h2>
          <p className="text-lg text-muted-foreground mb-8">{intro}</p>
          <div className="rounded-lg border border-primary/30 bg-primary/5 p-6">
            <p className="flex items-center gap-2 text-sm font-semibold text-primary">
              <CalendarClock className="h-5 w-5" aria-hidden="true" />
              {deadlineLabel}
            </p>
            <p className="mt-2 text-3xl font-bold">{deadline}</p>
            <p className="mt-2 text-sm text-muted-foreground">{deadlineNote}</p>
          </div>
        </div>
        <ul className="space-y-5">
          {facts.map((fact) => (
            <li key={fact.title} className="flex items-start gap-3">
              <Check className="mt-1 h-5 w-5 flex-none text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
              <div>
                <h3 className="font-semibold">{fact.title}</h3>
                <p className="mt-1 text-muted-foreground">{fact.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function TriggerSources({ sources, note }: { sources: TriggerSource[]; note?: string }) {
  return (
    <section className="py-12 border-t" aria-labelledby="sources-heading">
      <h2 id="sources-heading" className="text-xl font-bold mb-4">
        Sources
      </h2>
      <ul className="space-y-2 text-sm">
        {sources.map((source) => (
          <li key={source.href}>
            <a
              href={source.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-start gap-1.5 text-primary underline underline-offset-2 hover:decoration-2"
            >
              {source.label}
              <ExternalLink className="mt-0.5 h-3.5 w-3.5 flex-none" aria-hidden="true" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </li>
        ))}
      </ul>
      {note ? <p className="mt-4 text-sm text-muted-foreground">{note}</p> : null}
    </section>
  )
}
