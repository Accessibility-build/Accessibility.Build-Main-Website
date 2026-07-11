import type { Metadata } from "next"
import Link from "next/link"
import { Activity, Mail, Wrench } from "lucide-react"
import { Button } from "@/components/ui/button"
import { company } from "@/lib/company"

export const metadata: Metadata = {
  title: "Service Status",
  description:
    "How Accessibility.build communicates service incidents while a public historical uptime monitor is being prepared.",
  alternates: { canonical: "/status" },
  robots: { index: false, follow: true },
}

export default function StatusPage() {
  return (
    <div className="container-wide py-16 lg:py-24">
      <div className="mx-auto max-w-3xl">
        <header className="border-b pb-8">
          <Activity className="h-8 w-8 text-primary" aria-hidden="true" />
          <h1 className="mt-4 text-4xl font-semibold">Service status</h1>
          <p className="mt-4 text-lg leading-7 text-muted-foreground">
            We are preparing a monitor-backed public status history. Until that is available, we do not publish synthetic uptime percentages, response times, or incident records.
          </p>
        </header>

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
          </ul>
          <p className="mt-6 text-sm text-muted-foreground">
            For general business and security information, visit the <Link href="/trust" className="font-medium text-foreground underline">trust centre</Link>.
          </p>
        </section>
      </div>
    </div>
  )
}
