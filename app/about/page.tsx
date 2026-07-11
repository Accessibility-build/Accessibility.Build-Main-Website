import Link from "next/link"
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Code2,
  ExternalLink,
  Eye,
  Keyboard,
  MapPin,
  ScanSearch,
  UserRound,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { createMetadata } from "@/lib/metadata"
import { businessLocation, company } from "@/lib/company"

export const metadata = createMetadata({
  title: "About Accessibility.build and Founder Khushwant Parihar",
  path: "/about",
  description:
    "Meet Khushwant Parihar, founder of Accessibility.build, and learn how this independent accessibility practice approaches auditing, remediation, training, and accessible product development.",
  keywords: [
    "Khushwant Parihar",
    "Accessibility.build founder",
    "accessibility consultant India",
    "web accessibility specialist Bengaluru",
  ],
  authors: [{ name: company.legalOperator, url: company.founderWebsite }],
})

const capabilities = [
  {
    icon: ScanSearch,
    title: "Accessibility audits",
    description:
      "Manual and automated evaluation mapped to WCAG, with reproducible evidence, severity, user impact, and remediation guidance.",
  },
  {
    icon: Keyboard,
    title: "Assistive technology testing",
    description:
      "Keyboard and screen-reader testing across practical browser and assistive-technology combinations selected for the engagement.",
  },
  {
    icon: Code2,
    title: "Remediation engineering",
    description:
      "Implementation support for semantics, focus management, forms, ARIA patterns, components, and accessibility regression prevention.",
  },
  {
    icon: Eye,
    title: "Design and delivery support",
    description:
      "Design reviews, acceptance criteria, team training, documentation, and release checks that move accessibility earlier in delivery.",
  },
]

const principles = [
  "Human judgment remains accountable; automation and AI support the work but do not replace manual evaluation.",
  "Findings must be reproducible, mapped to a standard, and explained in terms of real user impact.",
  "Conformance is never guaranteed by a tool score, overlay, or one-time scan.",
  "Scope, limitations, pricing, deliverables, and retesting expectations are agreed before work begins.",
]

export default function AboutPage() {
  const profileSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      "@id": "https://accessibility.build/#founder",
      name: company.legalOperator,
      url: company.founderWebsite,
      jobTitle: "Founder and Accessibility Consultant",
      sameAs: [company.founderWebsite, company.founderLinkedin],
      worksFor: { "@id": "https://accessibility.build/#organization" },
      knowsAbout: [
        "WCAG 2.2",
        "Section 508",
        "Accessibility auditing",
        "Screen reader testing",
        "Accessible frontend development",
      ],
    },
  }

  return (
    <div className="bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profileSchema) }}
      />

      <section className="border-b bg-slate-950 text-white">
        <div className="container-wide grid gap-12 py-16 lg:grid-cols-[1.25fr_0.75fr] lg:items-end lg:py-24">
          <div>
            <p className="mb-5 text-sm font-semibold uppercase text-teal-300">
              Founder-owned accessibility practice
            </p>
            <h1 className="max-w-4xl break-words text-4xl font-semibold leading-tight [overflow-wrap:anywhere] sm:text-6xl lg:text-7xl">
              Accessibility.build
            </h1>
            <p className="mt-6 max-w-3xl text-xl leading-8 text-slate-300">
              An independent accessibility consultancy and technology platform owned and operated by Khushwant Parihar in Bengaluru, India.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/services">
                  Explore services <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full border-slate-600 bg-transparent text-white hover:bg-slate-900 hover:text-white sm:w-auto">
                <Link href="/contact">Discuss a project</Link>
              </Button>
            </div>
          </div>

          <dl className="grid gap-5 border-l border-slate-700 pl-6 text-sm">
            <div>
              <dt className="text-slate-400">Owner and operator</dt>
              <dd className="mt-1 text-lg font-medium">{company.legalOperator}</dd>
            </div>
            <div>
              <dt className="text-slate-400">Established</dt>
              <dd className="mt-1 text-lg font-medium">{company.foundedYear}</dd>
            </div>
            <div>
              <dt className="text-slate-400">Business location</dt>
              <dd className="mt-1 flex items-center gap-2 text-lg font-medium">
                <MapPin className="h-4 w-4" aria-hidden="true" /> {businessLocation}
              </dd>
            </div>
            <div>
              <dt className="text-slate-400">Tax status</dt>
              <dd className="mt-1 text-lg font-medium">GST-registered in India</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="container-wide py-16 lg:py-24" aria-labelledby="founder-heading">
        <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <div className="flex h-20 w-20 items-center justify-center border bg-slate-100 dark:bg-slate-900" aria-hidden="true">
              <UserRound className="h-9 w-9" />
            </div>
            <p className="mt-6 text-sm font-semibold uppercase text-primary">Founder</p>
            <h2 id="founder-heading" className="mt-2 text-4xl font-semibold">
              Khushwant Parihar
            </h2>
            <p className="mt-3 text-lg text-muted-foreground">Accessibility specialist, consultant, and developer</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild variant="outline">
                <a href={company.founderWebsite} target="_blank" rel="me noopener noreferrer">
                  Professional portfolio <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button asChild variant="ghost">
                <a href={company.founderLinkedin} target="_blank" rel="me noopener noreferrer">
                  LinkedIn <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          <div className="prose prose-lg max-w-none dark:prose-invert">
            <p className="lead">
              Khushwant founded Accessibility.build in 2023 to combine practical accessibility testing, remediation engineering, and useful public tools in one accountable practice.
            </p>
            <p>
              He has more than four years of professional accessibility and software testing experience, including accessibility work at FIS Global and current specialist work with product teams. His experience covers manual and automated auditing, keyboard evaluation, screen-reader testing with NVDA, JAWS, and VoiceOver, accessible frontend implementation, and accessibility quality processes.
            </p>
            <p>
              Accessibility.build is intentionally founder-led. Khushwant remains responsible for scoping, delivery quality, client communication, and the accuracy of published business information. Specialist collaborators may support an engagement when agreed with the client; responsibility is not passed to an anonymous delivery team.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y bg-muted/30" aria-labelledby="capabilities-heading">
        <div className="container-wide py-16 lg:py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase text-primary">What the practice does</p>
            <h2 id="capabilities-heading" className="mt-2 text-4xl font-semibold">
              Accessibility work that can be explained and verified
            </h2>
          </div>
          <div className="mt-10 grid gap-x-10 gap-y-12 md:grid-cols-2">
            {capabilities.map(({ icon: Icon, title, description }) => (
              <article key={title} className="border-t pt-6">
                <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                <h3 className="mt-4 text-xl font-semibold">{title}</h3>
                <p className="mt-2 leading-7 text-muted-foreground">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container-wide grid gap-12 py-16 lg:grid-cols-2 lg:py-24">
        <div>
          <p className="text-sm font-semibold uppercase text-primary">Operating principles</p>
          <h2 className="mt-2 text-4xl font-semibold">Professional claims need evidence</h2>
          <ul className="mt-8 space-y-5">
            {principles.map((principle) => (
              <li key={principle} className="flex gap-3 leading-7 text-muted-foreground">
                <BadgeCheck className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                <span>{principle}</span>
              </li>
            ))}
          </ul>
        </div>
        <aside className="border bg-slate-50 p-8 dark:bg-slate-950" aria-labelledby="business-heading">
          <Building2 className="h-7 w-7 text-primary" aria-hidden="true" />
          <h2 id="business-heading" className="mt-4 text-2xl font-semibold">Business transparency</h2>
          <p className="mt-4 leading-7 text-muted-foreground">{company.ownershipStatement}</p>
          <p className="mt-4 leading-7 text-muted-foreground">{company.taxStatus}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link href="/trust">View trust centre</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/methodology">Read our methodology</Link>
            </Button>
          </div>
        </aside>
      </section>
    </div>
  )
}
