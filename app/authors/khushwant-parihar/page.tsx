import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ExternalLink, MapPin, ScanSearch, Wrench } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createMetadata } from "@/lib/metadata"
import { businessLocation, company } from "@/lib/company"

const portrait = "/images/authors/khushwant-parihar.jpeg"

export const metadata = createMetadata({
  title: "Khushwant Parihar, Founder and Accessibility Consultant",
  path: "/authors/khushwant-parihar",
  description:
    "Professional profile of Khushwant Parihar, founder of Accessibility.build and accessibility specialist experienced in auditing, screen-reader testing, remediation, and accessible development.",
  keywords: [
    "Khushwant Parihar accessibility",
    "Accessibility.build founder",
    "accessibility consultant Bengaluru",
    "WCAG auditor India",
  ],
  image: portrait,
  authors: [{ name: company.legalOperator, url: company.founderWebsite }],
})

const experience = [
  {
    period: "2023-present",
    role: "Founder and Accessibility Consultant",
    organization: "Accessibility.build",
    description:
      "Leads accessibility audits, remediation strategy, accessible frontend work, tools, educational resources, and client delivery.",
  },
  {
    period: "2022-2025",
    role: "Software Test Analyst",
    organization: "FIS Global",
    description:
      "Worked on accessibility evaluation, manual and automated testing, issue reporting, assistive-technology validation, and collaboration with product teams.",
  },
  {
    period: "2025-present",
    role: "Web Accessibility Specialist",
    organization: "Contract practice",
    description:
      "Supports accessibility platforms, monitoring and audit workflows, WCAG and Section 508 validation, and accessibility quality processes.",
  },
]

export default function KhushwantPariharAuthorPage() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      "@id": `${company.website}/#founder`,
      name: company.legalOperator,
      image: `${company.website}${portrait}`,
      url: `${company.website}/authors/khushwant-parihar`,
      jobTitle: "Founder and Accessibility Consultant",
      homeLocation: {
        "@type": "Place",
        name: businessLocation,
      },
      sameAs: [company.founderWebsite, company.founderLinkedin],
      worksFor: { "@id": `${company.website}/#organization` },
      knowsAbout: [
        "WCAG 2.2",
        "Section 508",
        "Accessibility auditing",
        "NVDA",
        "JAWS",
        "VoiceOver",
        "Accessible frontend development",
      ],
    },
  }

  return (
    <div className="bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />

      <section className="border-b bg-slate-950 text-white">
        <div className="container-wide grid gap-10 py-16 md:grid-cols-[220px_1fr] md:items-center lg:py-24">
          <div className="relative aspect-square w-44 overflow-hidden border border-slate-700 bg-slate-900 md:w-full">
            <Image
              src={portrait}
              alt="Khushwant Parihar outdoors beside a lake and green hills"
              fill
              priority
              sizes="(min-width: 768px) 220px, 176px"
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase text-teal-300">Founder profile</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight sm:text-6xl">Khushwant Parihar</h1>
            <p className="mt-5 max-w-3xl text-xl leading-8 text-slate-300">
              Founder of Accessibility.build, accessibility specialist, consultant, and developer focused on practical auditing, remediation, and accessible product delivery.
            </p>
            <p className="mt-4 flex items-center gap-2 text-slate-300">
              <MapPin className="h-4 w-4" aria-hidden="true" /> {businessLocation}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/contact">Discuss an engagement <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline" className="border-slate-600 bg-transparent text-white hover:bg-slate-900 hover:text-white">
                <a href={company.founderWebsite} target="_blank" rel="me noopener noreferrer">
                  Professional portfolio <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container-wide grid gap-12 py-16 lg:grid-cols-[0.7fr_1.3fr] lg:py-20">
        <div>
          <ScanSearch className="h-7 w-7 text-primary" aria-hidden="true" />
          <h2 className="mt-4 text-3xl font-semibold">Professional focus</h2>
        </div>
        <div className="prose prose-lg max-w-none dark:prose-invert">
          <p>
            Khushwant has more than four years of professional accessibility and software testing experience. His work combines WCAG evaluation with the engineering detail needed to reproduce, remediate, and verify barriers in real interfaces.
          </p>
          <p>
            Core practice areas include manual and automated audits, keyboard evaluation, screen-reader testing with NVDA, JAWS, and VoiceOver, accessible React and web implementation, design-system guidance, remediation workflow design, and team enablement.
          </p>
          <p>
            AI and automated testing are used as supporting tools. Findings represented as confirmed issues remain subject to human review, reproducible evidence, and an agreed testing scope.
          </p>
        </div>
      </section>

      <section className="border-y bg-muted/30">
        <div className="container-wide py-16 lg:py-20">
          <Wrench className="h-7 w-7 text-primary" aria-hidden="true" />
          <h2 className="mt-4 text-3xl font-semibold">Experience</h2>
          <ol className="mt-10 border-t">
            {experience.map((item) => (
              <li key={`${item.period}-${item.role}`} className="grid gap-3 border-b py-7 md:grid-cols-[10rem_1fr_2fr]">
                <p className="text-sm font-semibold text-primary">{item.period}</p>
                <div>
                  <h3 className="font-semibold">{item.role}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{item.organization}</p>
                </div>
                <p className="leading-7 text-muted-foreground">{item.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container-wide py-16 lg:py-20">
        <div className="grid gap-8 md:grid-cols-3">
          <Link href="/sample-audit-report" className="border-t pt-5 hover:text-primary">
            <h2 className="text-xl font-semibold">Sample audit report</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Inspect the reporting structure, evidence fields, limitations, and remediation guidance.</p>
          </Link>
          <Link href="/methodology" className="border-t pt-5 hover:text-primary">
            <h2 className="text-xl font-semibold">Audit methodology</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">See how scope, evidence, severity, and retesting are handled.</p>
          </Link>
          <Link href="/editorial-policy" className="border-t pt-5 hover:text-primary">
            <h2 className="text-xl font-semibold">Editorial standards</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Understand sourcing, review, AI use, and corrections.</p>
          </Link>
        </div>
      </section>
    </div>
  )
}
