import Link from "next/link"
import {
  Accessibility,
  BadgeIndianRupee,
  Building2,
  ExternalLink,
  FileCheck2,
  LockKeyhole,
  Mail,
  Scale,
  ShieldCheck,
  UserRound,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { createMetadata } from "@/lib/metadata"
import { businessLocation, company, registeredBusinessAddress } from "@/lib/company"

export const metadata = createMetadata({
  title: "Trust Centre: Ownership, Privacy and Service Accountability",
  path: "/trust",
  description:
    "Verified business identity, founder ownership, tax status, accessibility commitment, data practices, service accountability, and procurement information for Accessibility.build.",
  keywords: [
    "Accessibility.build owner",
    "Accessibility.build trust centre",
    "Accessibility.build GST",
    "accessibility consultancy procurement",
  ],
  authors: [{ name: company.legalOperator, url: company.founderWebsite }],
})

const trustAreas = [
  {
    icon: UserRound,
    title: "Named owner",
    text: `${company.legalOperator} owns the business and remains accountable for scope, communication, delivery quality, and published claims.`,
  },
  {
    icon: BadgeIndianRupee,
    title: "GST-registered",
    text: `Regular GST registration ${company.gstin}, effective ${company.gstRegistrationDate}. Applicable tax details are included on valid invoices.`,
  },
  {
    icon: Accessibility,
    title: "Public accessibility accountability",
    text: "Our accessibility statement identifies the target, current assessment basis, known limitations, and a monitored feedback route.",
  },
  {
    icon: FileCheck2,
    title: "Defined delivery",
    text: "Professional services use written scope, deliverables, assumptions, exclusions, pricing, payment milestones, and retest terms.",
  },
  {
    icon: LockKeyhole,
    title: "Data transparency",
    text: "Privacy and cookie pages identify actual data categories, optional analytics, AI processing, and relevant service-provider functions.",
  },
  {
    icon: Scale,
    title: "Claims discipline",
    text: "A tool score is not described as certification. Legal interpretation and formal conformance decisions remain appropriately qualified.",
  },
]

const providers = [
  ["Clerk", "Authentication and account management"],
  ["Stripe and Razorpay", "Payment processing, billing, fraud prevention, and refunds"],
  ["Vercel", "Hosting, delivery, performance, and aggregate analytics"],
  ["Google Analytics", "Optional analytics after visitor consent"],
  ["OpenAI, Anthropic, and OpenRouter", "AI-assisted features when selected or configured"],
  ["Sanity", "Content management and blog delivery"],
  ["Formspree and Resend", "Contact submissions and requested or transactional email"],
]

export default function TrustPage() {
  return (
    <div className="bg-background">
      <section className="border-b bg-slate-950 text-white">
        <div className="container-wide py-16 lg:py-24">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase text-teal-300">Business transparency</p>
            <h1 className="mt-3 break-words text-4xl font-semibold leading-tight [overflow-wrap:anywhere] sm:text-6xl">Accessibility.build Trust Centre</h1>
            <p className="mt-6 max-w-3xl text-xl leading-8 text-slate-300">
              Ownership, delivery accountability, accessibility, privacy, and procurement information in one place.
            </p>
          </div>
        </div>
      </section>

      <section className="container-wide py-16 lg:py-20" aria-labelledby="identity-heading">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <Building2 className="h-8 w-8 text-primary" aria-hidden="true" />
            <h2 id="identity-heading" className="mt-4 text-3xl font-semibold">Business identity</h2>
          </div>
          <dl className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            <div className="border-t pt-4">
              <dt className="text-sm text-muted-foreground">Brand</dt>
              <dd className="mt-1 font-semibold">{company.brandName}</dd>
            </div>
            <div className="border-t pt-4">
              <dt className="text-sm text-muted-foreground">Registered legal name</dt>
              <dd className="mt-1 font-semibold">{company.legalName}</dd>
            </div>
            <div className="border-t pt-4">
              <dt className="text-sm text-muted-foreground">Business type</dt>
              <dd className="mt-1 font-semibold">{company.businessType}</dd>
            </div>
            <div className="border-t pt-4">
              <dt className="text-sm text-muted-foreground">Established</dt>
              <dd className="mt-1 font-semibold">{company.foundedYear}</dd>
            </div>
            <div className="border-t pt-4">
              <dt className="text-sm text-muted-foreground">Operating location</dt>
              <dd className="mt-1 font-semibold">{businessLocation}</dd>
            </div>
            <div className="border-t pt-4">
              <dt className="text-sm text-muted-foreground">Tax status</dt>
              <dd className="mt-1 font-semibold">{company.gstRegistrationType} GST registration</dd>
            </div>
            <div className="border-t pt-4">
              <dt className="text-sm text-muted-foreground">GSTIN</dt>
              <dd className="mt-1 font-semibold">{company.gstin}</dd>
            </div>
            <div className="border-t pt-4 sm:col-span-2">
              <dt className="text-sm text-muted-foreground">Registered principal place of business</dt>
              <dd className="mt-1 font-semibold">{registeredBusinessAddress}</dd>
            </div>
          </dl>
        </div>
        <p className="mt-8 max-w-3xl text-sm leading-6 text-muted-foreground">
          These registration particulars are taken from the Government of India GST REG-06 certificate issued on {company.gstRegistrationDate}. Registration details can also be checked through the official GST taxpayer search.
          {" "}<a className="font-medium text-foreground underline" href="https://services.gst.gov.in/services/searchtp" target="_blank" rel="noopener noreferrer">Open GST search <ExternalLink className="inline h-3.5 w-3.5" aria-hidden="true" /></a>
        </p>
      </section>

      <section className="border-y bg-muted/30" aria-labelledby="controls-heading">
        <div className="container-wide py-16 lg:py-20">
          <h2 id="controls-heading" className="text-3xl font-semibold">How trust is supported</h2>
          <div className="mt-10 grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {trustAreas.map(({ icon: Icon, title, text }) => (
              <article key={title} className="border-t pt-5">
                <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                <h3 className="mt-4 text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container-wide grid gap-12 py-16 lg:grid-cols-2 lg:py-20">
        <div>
          <ShieldCheck className="h-7 w-7 text-primary" aria-hidden="true" />
          <h2 className="mt-4 text-3xl font-semibold">Service providers</h2>
          <p className="mt-3 leading-7 text-muted-foreground">
            Providers are used according to the feature requested. This is a functional summary; the <Link href="/privacy" className="font-medium text-foreground underline">Privacy Policy</Link> explains the associated data categories and purposes.
          </p>
          <dl className="mt-8 space-y-5">
            {providers.map(([name, purpose]) => (
              <div key={name} className="border-t pt-4">
                <dt className="font-semibold">{name}</dt>
                <dd className="mt-1 text-sm leading-6 text-muted-foreground">{purpose}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div>
          <FileCheck2 className="h-7 w-7 text-primary" aria-hidden="true" />
          <h2 className="mt-4 text-3xl font-semibold">Procurement information</h2>
          <p className="mt-3 leading-7 text-muted-foreground">
            The following can be provided when relevant to a qualified engagement request:
          </p>
          <ul className="mt-6 space-y-3 leading-7 text-muted-foreground">
            <li>GST tax invoice and business particulars</li>
            <li>proposal or statement of work with named deliverables</li>
            <li>payment milestones and cancellation terms</li>
            <li>confidentiality or NDA review</li>
            <li>data-handling and provider summary</li>
            <li>testing scope, browser and assistive-technology matrix</li>
            <li>sample report structure or redacted deliverable</li>
          </ul>
          <div className="mt-8 border-t pt-6">
            <h3 className="font-semibold">Security reports</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Report a suspected security issue privately to {company.email} with the subject “Security report”. Do not access, alter, retain, or disclose data that is not yours. We will acknowledge responsible reports and coordinate remediation details when appropriate.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <a href={`mailto:${company.email}?subject=Accessibility.build%20procurement%20request`}>
                <Mail className="mr-2 h-4 w-4" /> Request information
              </a>
            </Button>
            <Button asChild variant="outline">
              <Link href="/methodology">Review methodology</Link>
            </Button>
          </div>
          <div className="mt-8 grid gap-3 border-t pt-6 sm:grid-cols-2">
            <Link href="/procurement" className="font-semibold text-primary underline">Procurement centre</Link>
            <Link href="/subprocessors" className="font-semibold text-primary underline">Subprocessor register</Link>
            <Link href="/sample-audit-report" className="font-semibold text-primary underline">Sample audit report</Link>
            <Link href="/services" className="font-semibold text-primary underline">Service delivery</Link>
          </div>
        </div>
      </section>

      <section className="border-t">
        <div className="container-wide flex flex-col gap-6 py-12 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Verify the founder’s professional background</h2>
            <p className="mt-2 text-muted-foreground">Experience and professional links are published on Khushwant Parihar’s portfolio.</p>
          </div>
          <Button asChild variant="outline">
            <a href={company.founderWebsite} target="_blank" rel="me noopener noreferrer">
              View founder portfolio <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </section>
    </div>
  )
}
