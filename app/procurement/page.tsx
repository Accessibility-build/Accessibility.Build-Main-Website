import Link from "next/link"
import { ArrowRight, Download, FileSignature, Landmark, LockKeyhole, ReceiptText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { businessLocation, company, registeredBusinessAddress } from "@/lib/company"
import { createMetadata } from "@/lib/metadata"

export const metadata = createMetadata({
  title: "Accessibility Services Procurement Centre",
  path: "/procurement",
  description:
    "Business identity, tax status, engagement documents, security and data information, scope controls, sample documents, and procurement contacts for Accessibility.build services.",
  keywords: [
    "accessibility consulting procurement",
    "Accessibility.build GST",
    "accessibility audit statement of work",
    "accessibility vendor due diligence",
  ],
  authors: [{ name: company.legalOperator, url: company.founderWebsite }],
})

const documents = [
  {
    title: "Statement of work outline",
    href: "/downloads/procurement/sample-statement-of-work.md",
    description: "The sections used to define scope, environments, deliverables, dates, assumptions, fees, and acceptance.",
  },
  {
    title: "NDA review checklist",
    href: "/downloads/procurement/nda-review-checklist.md",
    description: "Operational points we check before accepting client confidentiality terms.",
  },
  {
    title: "Data processing overview",
    href: "/downloads/procurement/data-processing-overview.md",
    description: "A due-diligence outline for roles, data categories, providers, retention, incidents, and deletion.",
  },
]

export default function ProcurementPage() {
  return (
    <div className="bg-background">
      <section className="border-b bg-slate-950 text-white">
        <div className="container-wide py-16 lg:py-24">
          <p className="text-sm font-semibold uppercase text-teal-300">Buyer and vendor review</p>
          <h1 className="mt-3 max-w-5xl text-4xl font-semibold leading-tight sm:text-6xl">Procurement centre</h1>
          <p className="mt-6 max-w-3xl text-xl leading-8 text-slate-300">
            Business, scope, data, security, billing, and evidence information for evaluating Accessibility.build as an accessibility services provider.
          </p>
          <Button asChild className="mt-8">
            <a href={`mailto:${company.email}?subject=Accessibility.build%20procurement%20request`}>Request procurement information</a>
          </Button>
        </div>
      </section>

      <section className="container-wide grid gap-12 py-16 lg:grid-cols-[0.7fr_1.3fr] lg:py-20">
        <div>
          <Landmark className="h-7 w-7 text-primary" aria-hidden="true" />
          <h2 className="mt-4 text-3xl font-semibold">Business identity</h2>
        </div>
        <dl className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
          <div className="border-t pt-4"><dt className="text-sm text-muted-foreground">Business</dt><dd className="mt-1 font-semibold">{company.brandName}</dd></div>
          <div className="border-t pt-4"><dt className="text-sm text-muted-foreground">Registered legal name</dt><dd className="mt-1 font-semibold">{company.legalName}</dd></div>
          <div className="border-t pt-4"><dt className="text-sm text-muted-foreground">Structure</dt><dd className="mt-1 font-semibold">{company.businessType}</dd></div>
          <div className="border-t pt-4"><dt className="text-sm text-muted-foreground">Operating location</dt><dd className="mt-1 font-semibold">{businessLocation}</dd></div>
          <div className="border-t pt-4"><dt className="text-sm text-muted-foreground">GST registration</dt><dd className="mt-1 font-semibold">{company.gstin} ({company.gstRegistrationType})</dd></div>
          <div className="border-t pt-4"><dt className="text-sm text-muted-foreground">Business contact</dt><dd className="mt-1"><a className="font-semibold underline" href={`mailto:${company.email}`}>{company.email}</a></dd></div>
          <div className="border-t pt-4 sm:col-span-2"><dt className="text-sm text-muted-foreground">Registered principal place of business</dt><dd className="mt-1 font-semibold">{registeredBusinessAddress}</dd></div>
        </dl>
      </section>

      <section className="border-y bg-muted/30">
        <div className="container-wide grid gap-12 py-16 lg:grid-cols-3 lg:py-20">
          <div>
            <FileSignature className="h-7 w-7 text-primary" aria-hidden="true" />
            <h2 className="mt-4 text-2xl font-semibold">Contracting</h2>
            <p className="mt-3 leading-7 text-muted-foreground">A proposal or statement of work identifies the tested sample, environments, deliverables, dates, client dependencies, exclusions, fees, payment milestones, and retest terms.</p>
          </div>
          <div>
            <LockKeyhole className="h-7 w-7 text-primary" aria-hidden="true" />
            <h2 className="mt-4 text-2xl font-semibold">Confidentiality and data</h2>
            <p className="mt-3 leading-7 text-muted-foreground">Client NDAs and data terms can be reviewed for a qualified engagement. Sensitive production data is excluded unless the written scope explicitly establishes a lawful, necessary handling process.</p>
          </div>
          <div>
            <ReceiptText className="h-7 w-7 text-primary" aria-hidden="true" />
            <h2 className="mt-4 text-2xl font-semibold">Billing and tax</h2>
            <p className="mt-3 leading-7 text-muted-foreground">Published package prices establish a baseline. Valid invoices include applicable GST and the relevant tax particulars. International or enterprise payment arrangements are agreed before kickoff.</p>
          </div>
        </div>
      </section>

      <section className="container-wide py-16 lg:py-20">
        <h2 className="text-3xl font-semibold">Due-diligence links</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            ["Business trust centre", "/trust"],
            ["Audit methodology", "/methodology"],
            ["Privacy policy", "/privacy"],
            ["Subprocessor register", "/subprocessors"],
            ["Accessibility statement", "/accessibility"],
            ["Sample audit report", "/sample-audit-report"],
            ["Selected work", "/case-studies"],
            ["Service status", "/status"],
          ].map(([label, href]) => (
            <Link key={href} href={href} className="flex items-center justify-between border p-4 font-semibold hover:border-primary hover:text-primary">
              {label} <ArrowRight className="h-4 w-4" />
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y bg-muted/30">
        <div className="container-wide py-16 lg:py-20">
          <h2 className="text-3xl font-semibold">Downloadable review outlines</h2>
          <p className="mt-3 max-w-3xl leading-7 text-muted-foreground">
            These documents show the information expected during procurement. They are starting-point outlines, not signed agreements or legal advice.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {documents.map((document) => (
              <article key={document.href} className="border bg-background p-6">
                <h3 className="text-xl font-semibold">{document.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{document.description}</p>
                <a href={document.href} download className="mt-6 inline-flex items-center font-semibold text-primary">
                  <Download className="mr-2 h-4 w-4" /> Download Markdown
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container-wide py-14">
        <h2 className="text-2xl font-semibold">Evidence supplied for an engagement</h2>
        <ul className="mt-6 grid gap-3 text-muted-foreground sm:grid-cols-2">
          <li>Named scope, standard, pages, flows, states, and exclusions</li>
          <li>Browser and assistive-technology test matrix</li>
          <li>Finding evidence, severity, user impact, and criterion mapping</li>
          <li>Remediation and retest status when included</li>
          <li>Invoice and applicable GST particulars</li>
          <li>Residual risk and limitations</li>
        </ul>
      </section>
    </div>
  )
}
