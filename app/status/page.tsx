import type { Metadata } from "next"
import Link from "next/link"
import { Activity, CheckCircle2, ExternalLink, Mail, Wrench } from "lucide-react"
import { Button } from "@/components/ui/button"
import { company } from "@/lib/company"

export const metadata: Metadata = {
  title: "Service Status",
  description:
    "How Accessibility.build communicates service incidents while a public historical uptime monitor is being prepared.",
  alternates: { canonical: "/status" },
  robots: { index: false, follow: true },
}

export const dynamic = "force-dynamic"

export default function StatusPage() {
  const checkedAt = new Date()
  const checkedAtIso = checkedAt.toISOString()
  const checkedAtLabel = new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "long",
    timeZone: "UTC",
  }).format(checkedAt)

  return (
    <div className="container-wide py-16 lg:py-24">
      <div className="mx-auto max-w-3xl">
        <header className="border-b pb-8">
          <Activity className="h-8 w-8 text-primary" aria-hidden="true" />
          <h1 className="mt-4 text-4xl font-semibold">Service status</h1>
          <p className="mt-4 text-lg leading-7 text-muted-foreground">
            Current availability is reported from this live server response. Historical uptime remains unpublished until retained external monitoring evidence is available.
          </p>
        </header>

        <section className="border-b py-10" aria-labelledby="current-status-heading">
          <div className="flex items-start gap-4 border border-emerald-300 bg-emerald-50 p-6 text-emerald-950 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-100">
            <CheckCircle2 className="mt-1 h-6 w-6 shrink-0" aria-hidden="true" />
            <div>
              <h2 id="current-status-heading" className="text-xl font-semibold">Website responding</h2>
              <p className="mt-2 text-sm leading-6">
                This status page was rendered successfully at <time dateTime={checkedAtIso}>{checkedAtLabel}</time>.
              </p>
              <a href="/api/health" className="mt-3 inline-flex items-center text-sm font-semibold underline">
                View machine-readable health response <ExternalLink className="ml-1 h-3.5 w-3.5" />
              </a>
            </div>
          </div>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            This confirms the website route is currently responding. It does not prove that every third-party provider, authenticated workflow, AI model, or payment path is healthy.
          </p>
        </section>

        <section className="py-10" aria-labelledby="report-heading">
          <Wrench className="h-6 w-6 text-primary" aria-hidden="true" />
          <h2 id="report-heading" className="mt-3 text-2xl font-semibold">Report a service problem</h2>
          <p className="mt-3 leading-7 text-muted-foreground">
            If a public tool, account feature, checkout, report, or API request is unavailable, send the affected URL, approximate time, browser, and any non-sensitive error message. Do not email passwords, payment-card details, API keys, or private customer data.
          </p>
          <Button asChild className="mt-6">
            <a href={`mailto:${company.email}?subject=Accessibility.build%20service%20issue`}>
              <Mail className="mr-2 h-4 w-4" /> Report an issue
            </a>
          </Button>
        </section>

        <section className="border-t pt-10" aria-labelledby="commitment-heading">
          <h2 id="commitment-heading" className="text-2xl font-semibold">Incident communication commitment</h2>
          <ul className="mt-5 space-y-3 leading-7 text-muted-foreground">
            <li>Material incidents affecting paid customers will be acknowledged through available support or account channels.</li>
            <li>Confirmed incidents will be described without invented precision or retroactive performance claims.</li>
            <li>A public uptime percentage will be added only when it comes from retained monitoring history.</li>
            <li>Machine-readable current health is available at <Link href="/api/health" className="font-medium text-foreground underline">/api/health</Link>.</li>
          </ul>
          <p className="mt-6 text-sm text-muted-foreground">
            For general business and security information, visit the <Link href="/trust" className="font-medium text-foreground underline">trust centre</Link>.
          </p>
        </section>
      </div>
    </div>
  )
}
