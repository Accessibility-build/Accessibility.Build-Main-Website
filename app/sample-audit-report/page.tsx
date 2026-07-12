import Link from "next/link"
import { Download, FileCheck2, Info, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { company } from "@/lib/company"
import { createMetadata } from "@/lib/metadata"
import { sampleAuditReport } from "@/lib/sample-audit-report"

export const metadata = createMetadata({
  title: "Sample Accessibility Audit Report",
  path: "/sample-audit-report",
  description:
    "Review a fictional Accessibility.build audit report showing scope, testing environments, limitations, reproducible evidence, WCAG mapping, severity, and remediation guidance.",
  keywords: [
    "sample accessibility audit report",
    "WCAG audit report example",
    "accessibility finding example",
    "accessibility remediation report",
  ],
  authors: [{ name: company.legalOperator, url: company.founderWebsite }],
})

const severityStyles: Record<string, string> = {
  Critical: "border-red-300 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200",
  High: "border-orange-300 bg-orange-50 text-orange-900 dark:border-orange-900 dark:bg-orange-950/30 dark:text-orange-200",
  Medium: "border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200",
}

export default function SampleAuditReportPage() {
  const report = sampleAuditReport

  return (
    <div className="bg-background">
      <section className="border-b bg-slate-950 text-white">
        <div className="container-wide py-16 lg:py-20">
          <p className="text-sm font-semibold uppercase text-teal-300">Public sample deliverable</p>
          <h1 className="mt-3 max-w-5xl text-4xl font-semibold leading-tight sm:text-6xl">{report.title}</h1>
          <p className="mt-5 text-xl text-slate-300">{report.product} - fictional demonstration product</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <a href="/downloads/sample-accessibility-audit-report.pdf" download>
                <Download className="mr-2 h-4 w-4" /> Download PDF
              </a>
            </Button>
            <Button asChild variant="outline" className="border-slate-600 bg-transparent text-white hover:bg-slate-900 hover:text-white">
              <Link href="/methodology">Review methodology</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="container-wide py-12">
        <div className="flex max-w-5xl items-start gap-4 border border-blue-300 bg-blue-50 p-6 text-blue-950 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-100">
          <Info className="mt-1 h-6 w-6 shrink-0" aria-hidden="true" />
          <div>
            <h2 className="font-semibold">Demonstration disclosure</h2>
            <p className="mt-2 text-sm leading-6">{report.disclosure}</p>
            <p className="mt-2 text-sm leading-6">This HTML page is the primary accessible version. The PDF is provided as a portable visual sample.</p>
          </div>
        </div>
      </section>

      <section className="container-wide grid gap-12 pb-16 lg:grid-cols-[0.65fr_1.35fr]">
        <aside>
          <dl className="space-y-5 border-t pt-5">
            <div>
              <dt className="text-sm text-muted-foreground">Report version</dt>
              <dd className="mt-1 font-semibold">{report.version}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Issue date</dt>
              <dd className="mt-1 font-semibold">{report.issued}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Target</dt>
              <dd className="mt-1 font-semibold">{report.target}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Prepared by</dt>
              <dd className="mt-1 font-semibold">{company.legalOperator}</dd>
            </div>
          </dl>
        </aside>

        <div>
          <h2 className="text-3xl font-semibold">Executive summary</h2>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            The fictional checkout sample contains four confirmed accessibility findings across modal focus, error communication, accessible names, and responsive reflow. Findings are prioritized by user impact, not by automated rule count. This limited sample cannot establish full product conformance.
          </p>

          <div className="mt-10 grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="text-xl font-semibold">Scope</h3>
              <ul className="mt-4 space-y-2 text-muted-foreground">
                {report.scope.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold">Test environments</h3>
              <ul className="mt-4 space-y-2 text-muted-foreground">
                {report.environments.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          </div>

          <div className="mt-10 border bg-muted/30 p-6">
            <div className="flex items-center gap-3">
              <ShieldAlert className="h-5 w-5 text-primary" aria-hidden="true" />
              <h3 className="font-semibold">Limitations</h3>
            </div>
            <ul className="mt-4 space-y-2 text-sm leading-6 text-muted-foreground">
              {report.limitations.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-y bg-muted/30">
        <div className="container-wide py-16">
          <div className="flex items-center gap-3">
            <FileCheck2 className="h-7 w-7 text-primary" aria-hidden="true" />
            <h2 className="text-3xl font-semibold">Detailed findings</h2>
          </div>
          <div className="mt-10 space-y-8">
            {report.findings.map((finding) => (
              <article key={finding.id} className="border bg-background p-6 md:p-8">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-sm font-semibold">{finding.id}</span>
                  <span className={`border px-2.5 py-1 text-xs font-semibold ${severityStyles[finding.severity]}`}>
                    {finding.severity} severity
                  </span>
                  <span className="text-sm text-muted-foreground">{finding.status}</span>
                </div>
                <h3 className="mt-5 text-2xl font-semibold">{finding.title}</h3>
                <div className="mt-4 flex flex-wrap gap-2" aria-label="Mapped WCAG criteria">
                  {finding.criteria.map((criterion) => <span key={criterion} className="border bg-muted px-2.5 py-1 text-xs">{criterion}</span>)}
                </div>
                <div className="mt-8 grid gap-8 lg:grid-cols-2">
                  <div>
                    <h4 className="font-semibold">User impact</h4>
                    <p className="mt-2 leading-7 text-muted-foreground">{finding.userImpact}</p>
                    <h4 className="mt-6 font-semibold">Reproduction evidence</h4>
                    <ol className="mt-3 list-decimal space-y-2 pl-5 leading-7 text-muted-foreground">
                      {finding.evidence.map((step) => <li key={step}>{step}</li>)}
                    </ol>
                  </div>
                  <div>
                    <h4 className="font-semibold">Remediation guidance</h4>
                    <p className="mt-2 leading-7 text-muted-foreground">{finding.remediation}</p>
                    <p className="mt-6 border-t pt-4 text-sm leading-6 text-muted-foreground">
                      Verification requires retesting the corrected behavior in the agreed environment. A code change alone does not close the finding.
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container-wide flex flex-col gap-6 py-14 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Need this level of evidence for your product?</h2>
          <p className="mt-2 text-muted-foreground">Packages define the tested sample, environments, deliverables, and retest terms before kickoff.</p>
        </div>
        <Button asChild><Link href="/services/accessibility-audits">View audit packages</Link></Button>
      </section>
    </div>
  )
}
