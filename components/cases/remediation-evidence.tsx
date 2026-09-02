import { Info } from "lucide-react"

/**
 * Explains the limit of the available remediation evidence without presenting
 * unrepeatable attribute counts as proof of WCAG conformance or checkout use.
 */
export function RemediationEvidence() {
  return (
    <section
      aria-labelledby="remediation-heading"
      className="not-prose my-10 overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/40"
    >
      <div className="border-b border-slate-200 p-5 dark:border-slate-800 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">
          Evidence limit
        </p>
        <h3
          id="remediation-heading"
          className="mt-2 text-xl font-semibold text-slate-900 dark:text-white"
        >
          Did the website actually get fixed?
        </h3>
        <p className="mt-3 max-w-[62ch] text-sm leading-6 text-slate-600 dark:text-slate-400">
          The public record reviewed for this case study cannot answer that question conclusively.
          The 2021 order found that the website was not fully accessible at that time. Domino&apos;s
          policy, checked 2 September 2026, describes an accessibility program, but a policy is not
          proof of conformance.
        </p>
      </div>

      <dl className="grid gap-px bg-slate-200 sm:grid-cols-3 dark:bg-slate-800">
        <div className="bg-white p-5 dark:bg-slate-900/40">
          <dt className="text-sm font-semibold text-slate-900 dark:text-white">Court finding</dt>
          <dd className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
            In June 2021, no expert had found the website fully accessible. The court ordered
            compliance with WCAG 2.0 without specifying a conformance level or deadline.
          </dd>
        </div>
        <div className="bg-white p-5 dark:bg-slate-900/40">
          <dt className="text-sm font-semibold text-slate-900 dark:text-white">
            Policy checked 2 September 2026
          </dt>
          <dd className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
            Domino&apos;s says it strives to comply with WCAG 2.0 Levels A and AA and describes
            monitoring, training, consultants and feedback channels.
          </dd>
        </div>
        <div className="bg-white p-5 dark:bg-slate-900/40">
          <dt className="text-sm font-semibold text-slate-900 dark:text-white">What remains unknown</dt>
          <dd className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
            This repository contains no reproducible, end-to-end test of the current ordering flow
            or app, so it cannot support a present-day conformance or usability conclusion.
          </dd>
        </div>
      </dl>

      <div className="flex items-start gap-3 border-t border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900 sm:p-6">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-slate-500 dark:text-slate-400" aria-hidden="true" />
        <p className="max-w-[68ch] text-sm leading-6 text-slate-600 dark:text-slate-400">
          Home-page markup counts cannot demonstrate that a customer can configure, purchase and
          schedule an order. A supportable current conclusion would require documented keyboard and
          screen-reader tests of the complete journey, with URLs, builds, devices, browsers,
          assistive technologies, dates and results preserved.
        </p>
      </div>
    </section>
  )
}
