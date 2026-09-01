import Link from "next/link"
import { ArrowRight, FileCheck2, Info, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { company } from "@/lib/company"
import { createMetadata } from "@/lib/metadata"
import { sampleAuditReport } from "@/lib/sample-audit-report"
import { ReportDashboard } from "./report-dashboard"

export const metadata = createMetadata({
  title: "Sample Accessibility Audit Report",
  path: "/sample-audit-report",
  description:
    "An interactive sample WCAG 2.2 audit report. Every finding carries reproduction steps, actual and expected results, WCAG mapping, severity, conformance level, user impact, and a suggested resolution. Switch between table and card views and export to Excel.",
  keywords: [
    "sample accessibility audit report",
    "WCAG audit report example",
    "accessibility finding example",
    "accessibility remediation report",
    "accessibility audit report template",
    "WCAG 2.2 audit example",
    "accessibility report excel export",
  ],
  authors: [{ name: company.legalOperator, url: company.founderWebsite }],
})

const report = sampleAuditReport

export default function SampleAuditReportPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-12 dark:bg-slate-950">
      <div className="mx-auto max-w-[1800px] px-4 pb-20 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="py-4">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <li>
              <Link href="/" className="hover:text-blue-600 hover:underline dark:hover:text-blue-400">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                href="/services/accessibility-audits"
                className="hover:text-blue-600 hover:underline dark:hover:text-blue-400"
              >
                Accessibility Audits
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <span aria-current="page" className="font-medium text-slate-900 dark:text-white">
                Sample Report
              </span>
            </li>
          </ol>
        </nav>

        {/* ---------- Report header ---------- */}
        <header className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="max-w-3xl">
              <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-400">
                <FileCheck2 className="h-4 w-4" aria-hidden="true" />
                Sample deliverable
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                {report.product} Accessibility Audit
              </h1>
              <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                This is the structure every audit follows; the delivery format
                is agreed before work begins. {report.product} is a fictional
                product, so the findings are illustrative. Each finding is
                written so a developer can reproduce it without asking a
                follow-up question: what the defect is, exactly how to trigger
                it, what happens, what should happen instead, who it affects,
                and what to change.
              </p>
            </div>

            <dl className="grid shrink-0 grid-cols-2 gap-x-8 gap-y-3 text-sm">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Version
                </dt>
                <dd className="mt-0.5 font-medium text-slate-900 dark:text-white">
                  {report.version}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Issued
                </dt>
                <dd className="mt-0.5 font-medium text-slate-900 dark:text-white">
                  {report.issued}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Target
                </dt>
                <dd className="mt-0.5 font-medium text-slate-900 dark:text-white">
                  {report.target}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Auditor
                </dt>
                <dd className="mt-0.5 font-medium text-slate-900 dark:text-white">
                  {report.auditor}
                </dd>
              </div>
            </dl>
          </div>

          {/* Disclosure. This has to stay prominent: the findings describe a
              product that does not exist, and nothing here is a conformance
              claim about a real company. */}
          <div className="mt-6 flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 p-4 dark:border-amber-900/60 dark:bg-amber-950/20">
            <Info
              className="mt-0.5 h-5 w-5 shrink-0 text-amber-700 dark:text-amber-400"
              aria-hidden="true"
            />
            <div>
              <h2 className="text-sm font-semibold text-amber-900 dark:text-amber-200">
                Demonstration disclosure
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-amber-900/90 dark:text-amber-200/90">
                {report.disclosure}
              </p>
            </div>
          </div>
        </header>

        {/* ---------- Scope, environments, limitations ---------- */}
        <section aria-labelledby="scope-heading" className="mt-8">
          <h2 id="scope-heading" className="sr-only">
            Scope, test environments, and limitations
          </h2>
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Scope
              </h3>
              <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                {report.scope.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <ShieldCheck
                      className="mt-0.5 h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400"
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Test environments
              </h3>
              <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                {report.environments.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Limitations
              </h3>
              <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                {report.limitations.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <p className="mt-4 rounded-xl border border-slate-200 bg-white p-5 text-sm leading-relaxed text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
            <span className="font-semibold text-slate-900 dark:text-white">
              Methodology.{" "}
            </span>
            {report.methodology}
          </p>
        </section>

        {/* ---------- Interactive findings dashboard ---------- */}
        <div className="mt-10">
          <ReportDashboard />
        </div>

        {/* ---------- CTA ---------- */}
        <section className="mt-12 rounded-2xl border-2 border-blue-200 bg-blue-50 p-8 text-center dark:border-blue-900 dark:bg-blue-950/30">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Want this level of evidence for your product?
          </h2>
          <p className="mx-auto mt-3 max-w-2xl leading-relaxed text-slate-600 dark:text-slate-300">
            A real audit follows the same structure against your actual
            product, tested by hand with screen readers and a keyboard rather
            than scanned. You get the findings, the reproduction steps, and a
            prioritised remediation plan your developers can work straight from.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="gap-2">
              <Link href="/contact">
                Request an audit
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/services/accessibility-audits">
                How audits work
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/checklists/wcag-2-2">WCAG 2.2 checklist</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  )
}
