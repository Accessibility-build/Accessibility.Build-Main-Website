import Link from "next/link"
import { Mail, ShieldCheck, Clock, UserRound, Accessibility } from "lucide-react"
import { ContactForm } from "@/components/contact/contact-form"
import { ContactPageStructuredData } from "@/components/seo/structured-data"
import { company } from "@/lib/company"
import { createMetadata } from "@/lib/metadata"

export const metadata = createMetadata({
  title: "Contact Accessibility.build",
  path: "/contact",
  description:
    "Get in touch about an accessibility audit, remediation, training, or a question about a tool. Messages go straight to Khushwant Parihar and get a reply within two business days.",
  keywords: [
    "contact Accessibility.build",
    "accessibility audit enquiry",
    "accessibility support",
    "accessibility services contact",
    "hire accessibility consultant",
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

      <div className="container-wide py-14 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-16">
          {/* Left: the human side. Everything here is verifiable from the
              about page and lib/company.ts, so nothing overpromises. */}
          <div className="lg:pt-4">
            <p className="text-sm font-semibold uppercase tracking-wide text-teal-700 dark:text-teal-300">
              Contact
            </p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight text-slate-950 dark:text-white sm:text-5xl">
              Tell me what you are trying to make accessible.
            </h1>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">
              Whether you need a full audit, a second opinion on one stubborn
              component, or you just hit a bug in one of the tools, write a couple
              of sentences and send it. There is no form maze and no qualification
              call before a human reads it.
            </p>

            <ul className="mt-9 space-y-5">
              <li className="flex items-start gap-3.5">
                <UserRound className="mt-0.5 h-5 w-5 shrink-0 text-teal-700 dark:text-teal-300" aria-hidden="true" />
                <div>
                  <p className="font-medium text-slate-950 dark:text-white">
                    You are writing to a person, not a queue
                  </p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {company.brandName} is deliberately founder-led.{" "}
                    <Link href="/about" className="underline hover:no-underline">
                      {company.legalOperator}
                    </Link>{" "}
                    reads and answers these himself.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3.5">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-teal-700 dark:text-teal-300" aria-hidden="true" />
                <div>
                  <p className="font-medium text-slate-950 dark:text-white">
                    Certified, and specific about it
                  </p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    IAAP CPACC and DHS Trusted Tester, with hands-on NVDA, JAWS,
                    and VoiceOver testing experience.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3.5">
                <Clock className="mt-0.5 h-5 w-5 shrink-0 text-teal-700 dark:text-teal-300" aria-hidden="true" />
                <div>
                  <p className="font-medium text-slate-950 dark:text-white">
                    {company.responseTime}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    A real answer to what you asked. You will not be added to a
                    newsletter or a drip sequence.
                  </p>
                </div>
              </li>
            </ul>

            <div className="mt-10 space-y-4 border-t border-slate-200 pt-8 dark:border-slate-800">
              <p className="text-sm leading-6 text-muted-foreground">
                <span className="font-medium text-slate-950 dark:text-white">
                  Rather just email?
                </span>{" "}
                <a
                  href={`mailto:${company.email}`}
                  className="inline-flex items-center gap-1.5 font-medium text-foreground underline hover:no-underline"
                >
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  {company.email}
                </a>
              </p>
              <p className="flex items-start gap-2 text-sm leading-6 text-muted-foreground">
                <Accessibility className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <span>
                  Hit a barrier on this site? That is a bug and I want it. Tell me
                  the page and what blocked you, and it goes to the top of the
                  list.
                </span>
              </p>
            </div>
          </div>

          {/* Right: the form, with as little between the visitor and Send as
              possible. */}
          <div>
            <div className="rounded-2xl border border-slate-200 bg-card p-6 shadow-sm dark:border-slate-800 sm:p-8">
              <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
                Send a message
              </h2>
              <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                Three fields. That is genuinely all I need to reply.
              </p>
              <div className="mt-7">
                <ContactForm
                  requestedService={requestedService}
                  requestedPackage={requestedPackage}
                  requestedTopic={requestedTopic}
                />
              </div>
            </div>
            <p className="mt-4 px-1 text-xs leading-6 text-muted-foreground">
              Submissions are processed through Formspree so I can reply to you,
              and are not used for anything else. See the{" "}
              <Link href="/privacy" className="font-medium text-foreground underline">
                privacy policy
              </Link>
              . Please do not include passwords or payment card details in a
              message.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
