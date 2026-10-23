import type { Metadata } from "next"
import { EmbedFooter, EmbedFrame } from "@/components/embed/embed-frame"
import { upcomingDeadlines, type UpcomingDeadline } from "@/lib/data/accessibility-laws"
import { cn } from "@/lib/utils"

// Chromeless widget of the deadlines list from /research/accessibility-laws, for
// other sites to iframe; the embed code is offered on that page. It reads the same
// data module, and regenerates daily so a deadline drops off the day after it passes.
// noindex and absent from lib/site-routes.ts, like every /embed/ page.
export const revalidate = 86400

export const metadata: Metadata = {
  title: "Accessibility Compliance Deadlines Widget",
  description: "Embeddable list of upcoming digital accessibility compliance deadlines, from the Accessibility.build legal tracker.",
  robots: {
    index: false,
    follow: true,
  },
}

const IMPACT: Record<UpcomingDeadline["impact"], { label: string; className: string }> = {
  critical: { label: "Critical", className: "border-red-700 text-red-700 dark:border-red-400 dark:text-red-400" },
  high: { label: "High", className: "border-amber-800 text-amber-800 dark:border-amber-300 dark:text-amber-300" },
  medium: { label: "Medium", className: "border-slate-600 text-slate-700 dark:border-slate-400 dark:text-slate-300" },
}

function formatDate(isoDate: string) {
  return new Date(`${isoDate}T00:00:00Z`).toLocaleDateString("en-US", {
    timeZone: "UTC",
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export default function ComplianceDeadlinesEmbedPage() {
  const today = new Date().toISOString().slice(0, 10)
  const deadlines = upcomingDeadlines
    .filter((deadline) => deadline.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))

  return (
    <EmbedFrame>
      <div>
        <h1 className="text-base font-semibold">Upcoming accessibility compliance deadlines</h1>
        <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">
          From the Accessibility.build legal tracker. Past dates drop off automatically.
        </p>
      </div>

      {deadlines.length === 0 ? (
        <p className="text-sm">No upcoming deadlines are listed right now.</p>
      ) : (
        <ol className="divide-y divide-slate-200 border-y border-slate-200 dark:divide-slate-800 dark:border-slate-800">
          {deadlines.map((deadline) => {
            const date = formatDate(deadline.date)
            const impact = IMPACT[deadline.impact]
            return (
              <li key={`${deadline.date}-${deadline.jurisdiction}`} className="py-2.5">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <time dateTime={deadline.date} className="text-sm font-semibold tabular-nums">
                    {date}
                  </time>
                  <span className="text-sm">{deadline.jurisdiction}</span>
                  <span className={cn("rounded border px-1.5 text-xs font-medium", impact.className)}>
                    {impact.label}
                    <span className="sr-only"> impact</span>
                  </span>
                </div>
                <details className="mt-1">
                  {/* Default display keeps the disclosure triangle; py-1 makes the target 24px tall. */}
                  <summary className="cursor-pointer py-1 text-xs font-medium text-blue-700 dark:text-blue-400">
                    What applies<span className="sr-only">: {deadline.jurisdiction}, {date}</span>
                  </summary>
                  <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{deadline.description}</p>
                </details>
              </li>
            )
          })}
        </ol>
      )}

      <EmbedFooter
        note="General information, not legal advice."
        href="/research/accessibility-laws"
        linkText="Full legal tracker"
      />
    </EmbedFrame>
  )
}
