import Link from "next/link"
import { Clock, ExternalLink, Mail, MapPin, UserRound } from "lucide-react"
import { ContactForm } from "@/components/contact/contact-form"
import { ContactPageStructuredData } from "@/components/seo/structured-data"
import { businessLocation, company, registeredBusinessLocation } from "@/lib/company"
import { createMetadata } from "@/lib/metadata"

export const metadata = createMetadata({
  title: "Contact Khushwant Parihar at Accessibility.build",
  path: "/contact",
  description:
    "Contact Accessibility.build founder Khushwant Parihar about accessibility audits, remediation, training, design review, documentation, or platform support.",
  keywords: [
    "contact Accessibility.build",
    "Khushwant Parihar contact",
    "accessibility consultant Bengaluru",
    "accessibility audit enquiry",
  ],
  authors: [{ name: company.legalOperator, url: company.founderWebsite }],
})

export default function ContactPage() {
  return (
    <div className="bg-background">
      <ContactPageStructuredData
        name="Contact Accessibility.build"
        description="Contact Khushwant Parihar about accessibility services, procurement, or platform support."
        url={`${company.website}/contact`}
        email={company.email}
      />

      <section className="border-b bg-slate-950 text-white">
        <div className="container-wide py-16 lg:py-20">
          <p className="text-sm font-semibold uppercase text-teal-300">Founder-led contact</p>
          <h1 className="mt-3 max-w-4xl break-words text-4xl font-semibold leading-tight [overflow-wrap:anywhere] sm:text-6xl">Talk directly with Accessibility.build</h1>
          <p className="mt-6 max-w-3xl text-xl leading-8 text-slate-300">
            Project, procurement, support, privacy, and accessibility enquiries are handled by Khushwant Parihar, owner and operator of Accessibility.build.
          </p>
        </div>
      </section>

      <section className="container-wide grid gap-12 py-16 lg:grid-cols-[1.35fr_0.65fr] lg:py-20">
        <div>
          <h2 className="text-3xl font-semibold">Send an enquiry</h2>
          <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
            Include the product type, important workflows, target standard, desired timeline, and whether you need audit, remediation, training, or documentation support. Do not submit credentials or sensitive customer data.
          </p>
          <div className="mt-8 border p-6 sm:p-8">
            <ContactForm />
          </div>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            Form submissions are processed through Formspree for the purpose of responding to your enquiry. See our <Link href="/privacy" className="font-medium text-foreground underline">Privacy Policy</Link>.
          </p>
        </div>

        <aside aria-labelledby="contact-details-heading">
          <h2 id="contact-details-heading" className="text-2xl font-semibold">Business contact</h2>
          <dl className="mt-6 space-y-6">
            <div className="border-t pt-5">
              <dt className="flex items-center gap-2 text-sm text-muted-foreground"><UserRound className="h-4 w-4" aria-hidden="true" /> Owner and operator</dt>
              <dd className="mt-2 font-semibold">{company.legalOperator}</dd>
            </div>
            <div className="border-t pt-5">
              <dt className="flex items-center gap-2 text-sm text-muted-foreground"><Mail className="h-4 w-4" aria-hidden="true" /> Email</dt>
              <dd className="mt-2"><a className="font-semibold underline" href={`mailto:${company.email}`}>{company.email}</a></dd>
            </div>
            <div className="border-t pt-5">
              <dt className="flex items-center gap-2 text-sm text-muted-foreground"><Clock className="h-4 w-4" aria-hidden="true" /> Response target</dt>
              <dd className="mt-2 font-semibold">{company.responseTime}</dd>
            </div>
            <div className="border-t pt-5">
              <dt className="flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="h-4 w-4" aria-hidden="true" /> Operating location</dt>
              <dd className="mt-2 font-semibold">{businessLocation}</dd>
            </div>
          </dl>

          <div className="mt-8 border bg-muted/30 p-5">
            <p className="font-semibold">Business verification</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Accessibility.build is operated by {company.legalName} as a sole proprietorship, with regular GST registration {company.gstin} and its registered principal place of business in {registeredBusinessLocation}.
            </p>
            <div className="mt-4 flex flex-col items-start gap-3">
              <Link href="/trust" className="text-sm font-medium underline">Trust centre</Link>
              <a href={company.founderWebsite} target="_blank" rel="me noopener noreferrer" className="inline-flex items-center text-sm font-medium underline">
                Founder portfolio <ExternalLink className="ml-1 h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </aside>
      </section>
    </div>
  )
}
