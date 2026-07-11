import Link from "next/link"
import { CheckCircle2, Mail, Target } from "lucide-react"
import { createMetadata } from "@/lib/metadata"
import { businessLocation, company, legalLastUpdated } from "@/lib/company"

export const metadata = createMetadata({
  title: "Accessibility Statement",
  path: "/accessibility",
  description:
    "Accessibility.build's current accessibility target, assessment approach, known limitations, feedback process, and owner accountability.",
  keywords: ["Accessibility.build accessibility statement", "WCAG 2.2 AA statement"],
})

export default function AccessibilityPage() {
  return (
    <div className="container-wide py-12 lg:py-16">
      <article className="mx-auto max-w-3xl">
        <header className="border-b pb-8">
          <p className="text-sm font-semibold uppercase text-primary">Our own accessibility</p>
          <h1 className="mt-2 text-4xl font-semibold">Accessibility Statement</h1>
          <p className="mt-4 text-lg leading-7 text-muted-foreground">
            Accessibility.build is committed to making its public content, tools, account experiences, and support channels usable by people with disabilities.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">Last reviewed: {legalLastUpdated}</p>
        </header>

        <div className="my-8 grid gap-6 border bg-muted/30 p-6 sm:grid-cols-2">
          <div>
            <Target className="h-6 w-6 text-primary" aria-hidden="true" />
            <h2 className="mt-3 font-semibold">Target</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">WCAG 2.2 Level AA for public website and product interfaces.</p>
          </div>
          <div>
            <CheckCircle2 className="h-6 w-6 text-primary" aria-hidden="true" />
            <h2 className="mt-3 font-semibold">Current status</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">Conformance has not yet been independently certified. Evaluation and remediation are ongoing.</p>
          </div>
        </div>

        <div className="prose prose-lg max-w-none dark:prose-invert">
          <h2>Scope</h2>
          <p>
            This statement covers the public website at <a href={company.website}>{company.website}</a>, including public content and tools. Third-party authentication, checkout, embedded services, linked websites, and user-submitted content may have separate accessibility characteristics and policies.
          </p>

          <h2>Standards and approach</h2>
          <p>
            We use WCAG 2.2 Level AA as the working target. Accessibility is considered during design, implementation, review, and maintenance. Our current process includes:
          </p>
          <ul>
            <li>semantic HTML and native controls where possible;</li>
            <li>keyboard navigation and visible focus review;</li>
            <li>screen-reader checks for important pages and workflows;</li>
            <li>contrast, zoom, reflow, form-label, error, and heading review;</li>
            <li>automated checks using axe-based and project smoke-test tooling;</li>
            <li>issue remediation as pages and product features are updated.</li>
          </ul>
          <p>
            Automated tools cannot determine full WCAG conformance. A passing automated score is not presented as certification.
          </p>

          <h2>Current limitations</h2>
          <p>We are reviewing and improving the following areas:</p>
          <ul>
            <li>complex interactive tools may have behavior that varies by browser and assistive-technology combination;</li>
            <li>AI-generated descriptions and recommendations may require human correction;</li>
            <li>third-party authentication, payment, analytics, and form services are partly outside our direct control;</li>
            <li>older pages and long-form resources are being brought into the same review process as newly updated pages;</li>
            <li>some generated reports or uploaded third-party documents may inherit accessibility problems from their source content.</li>
          </ul>
          <p>
            We do not currently claim that every page and state fully conforms. Material barriers reported by users are prioritized according to impact and the availability of a practical fix.
          </p>

          <h2>Compatibility</h2>
          <p>
            The site is designed for recent versions of Chrome, Edge, Firefox, and Safari and for common keyboard, screen-reader, zoom, and voice-input use. Compatibility can vary with older browsers, unsupported assistive technology, browser extensions, and third-party content.
          </p>

          <h2>Feedback and assistance</h2>
          <p>
            If a page, tool, form, report, or support process creates a barrier, tell us what you were trying to do, the page URL, browser, assistive technology, and the problem encountered. Do not include sensitive personal information unless it is necessary to resolve the issue.
          </p>
          <div className="not-prose border p-6">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-primary" aria-hidden="true" />
              <h3 className="font-semibold">Accessible support</h3>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Email <a className="font-medium text-foreground underline" href={`mailto:${company.accessibilityEmail}`}>{company.accessibilityEmail}</a>. We aim to acknowledge accessibility feedback within two business days and will provide a reasonable alternative when an immediate fix is not available.
            </p>
          </div>

          <h2>Assessment and accountability</h2>
          <p>
            The current statement is based on internal review and development testing led by {company.legalOperator}. No independent certification is claimed. Future independent assessments, material known issues, and major revisions will be reflected here.
          </p>
          <p>
            Accessibility.build is owned and operated by {company.legalOperator} in {businessLocation}. Read more about our <Link href="/methodology">testing methodology</Link> and <Link href="/trust">business transparency</Link>.
          </p>
        </div>
      </article>
    </div>
  )
}
