import Link from "next/link"
import { ContactForm } from "@/components/contact/contact-form"
import { ContactPageStructuredData } from "@/components/seo/structured-data"
import { company } from "@/lib/company"
import { createMetadata } from "@/lib/metadata"

export const metadata = createMetadata({
  title: "Contact Accessibility.build",
  path: "/contact",
  description:
    "Contact Accessibility.build about accessibility audits, remediation, training, design review, documentation, billing, privacy, or tool support.",
  keywords: [
    "contact Accessibility.build",
    "accessibility audit enquiry",
    "accessibility support",
    "accessibility services contact",
  ],
})

type ContactPageProps = {
  searchParams: Promise<{ service?: string | string[]; package?: string | string[]; topic?: string | string[] }>
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const params = await searchParams
  const requestedService = Array.isArray(params.service) ? params.service[0] : params.service
  const requestedPackage = Array.isArray(params.package) ? params.package[0] : params.package
  const requestedTopic = Array.isArray(params.topic) ? params.topic[0] : params.topic

  return (
    <div className="bg-background">
      <ContactPageStructuredData
        name="Contact Accessibility.build"
        description="Contact Accessibility.build about accessibility services, procurement, privacy, billing, or tool support."
        url={`${company.website}/contact`}
        email={company.email}
      />

      <section className="border-b bg-slate-950 text-white">
        <div className="container-wide py-16 lg:py-20">
          <p className="text-sm font-semibold uppercase text-teal-300">Contact and support</p>
          <h1 className="mt-3 max-w-4xl break-words text-4xl font-semibold leading-tight [overflow-wrap:anywhere] sm:text-6xl">Contact Accessibility.build</h1>
          <p className="mt-6 max-w-3xl text-xl leading-8 text-slate-300">
            Send a project enquiry, request support, report an accessibility barrier, or contact us about billing, privacy, corrections, and partnerships.
          </p>
        </div>
      </section>

      <section className="container-wide py-16 lg:py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-3xl font-semibold">Choose the right contact path</h2>
          <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
            Send a short message for support, billing, privacy, accessibility feedback, corrections, or partnerships. Use the detailed brief when you are planning a professional accessibility project.
          </p>
          <div className="mt-8 border p-6 sm:p-8">
            <ContactForm requestedService={requestedService} requestedPackage={requestedPackage} requestedTopic={requestedTopic} />
          </div>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            Form submissions are processed through Formspree for the purpose of responding to your enquiry. See our <Link href="/privacy" className="font-medium text-foreground underline">Privacy Policy</Link>.
          </p>
        </div>
      </section>
    </div>
  )
}
