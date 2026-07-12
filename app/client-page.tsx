import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  BadgeCheck,
  BookOpenCheck,
  Code2,
  ExternalLink,
  FileCheck2,
  Keyboard,
  ScanSearch,
  ShieldCheck,
  Wrench,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { caseStudies } from "@/lib/authority-content"
import { company } from "@/lib/company"
import { serviceStartingPrices } from "@/lib/service-pricing"

const portrait = "/images/authors/khushwant-parihar.jpeg"

const services = [
  {
    icon: ScanSearch,
    title: "Accessibility audits",
    description: "Manual and automated evaluation with reproducible evidence, user impact, WCAG mapping, and retest options.",
    price: serviceStartingPrices.audits,
    href: "/services/accessibility-audits",
  },
  {
    icon: Wrench,
    title: "Remediation support",
    description: "Code-level implementation support for agreed findings, shared components, focus, semantics, forms, and interaction patterns.",
    price: serviceStartingPrices.remediation,
    href: "/services/remediation-support",
  },
  {
    icon: BookOpenCheck,
    title: "Training and enablement",
    description: "Role-specific workshops and practical guidance for design, engineering, QA, content, and product teams.",
    price: serviceStartingPrices.training,
    href: "/services/accessibility-training",
  },
]

const practiceSignals = [
  "Founder-owned and GST-registered in India",
  "Named practitioner responsible for delivery",
  "Manual, keyboard, and screen-reader testing",
  "Fixed-scope packages with published starting prices",
]

export default function HomeClientPage() {
  return (
    <div className="bg-background">
      <section className="border-b bg-slate-950 text-white">
        <div className="container-wide grid gap-12 py-16 lg:grid-cols-[1.25fr_0.75fr] lg:items-end lg:py-24">
          <div>
            <p className="text-sm font-semibold uppercase text-teal-300">Founder-led accessibility consultancy and platform</p>
            <h1 className="mt-4 max-w-5xl break-words text-5xl font-semibold leading-tight [overflow-wrap:anywhere] sm:text-6xl lg:text-7xl">
              Accessibility.build
            </h1>
            <p className="mt-6 max-w-3xl text-xl leading-8 text-slate-300">
              Accessibility audits, remediation, training, and practical WCAG tools led by Khushwant Parihar. Clear scope, named accountability, and evidence your team can act on.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/services">View professional services <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full border-slate-600 bg-transparent text-white hover:bg-slate-900 hover:text-white sm:w-auto">
                <Link href="/sample-audit-report">Inspect sample report</Link>
              </Button>
            </div>
          </div>

          <aside className="border-l border-slate-700 pl-6" aria-label="Founder information">
            <div className="flex items-center gap-4">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden border border-slate-600">
                <Image src={portrait} alt="Khushwant Parihar outdoors beside a lake and green hills" fill priority sizes="80px" className="object-cover" />
              </div>
              <div>
                <p className="font-semibold">Khushwant Parihar</p>
                <p className="mt-1 text-sm text-slate-300">Founder and Accessibility Consultant</p>
                <Link href="/authors/khushwant-parihar" className="mt-2 inline-flex items-center text-sm font-semibold text-teal-300">
                  View professional profile <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
            <p className="mt-6 text-sm leading-6 text-slate-300">
              More than four years of professional accessibility and software testing experience across audits, screen-reader evaluation, accessible development, and remediation workflows.
            </p>
          </aside>
        </div>
      </section>

      <section className="border-b" aria-label="Practice credentials">
        <div className="container-wide grid sm:grid-cols-2 lg:grid-cols-4">
          {practiceSignals.map((signal) => (
            <div key={signal} className="flex gap-3 border-b py-5 sm:border-r lg:border-b-0 lg:last:border-r-0">
              <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
              <p className="text-sm leading-6">{signal}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-wide py-16 lg:py-24" aria-labelledby="services-heading">
        <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="text-sm font-semibold uppercase text-primary">Professional services</p>
            <h2 id="services-heading" className="mt-3 text-4xl font-semibold">Defined work, not vague consulting time</h2>
            <p className="mt-5 leading-7 text-muted-foreground">
              Each package publishes its included sample, deliverables, delivery window, assumptions, add-ons, and starting price. Hourly work is used only when a clearly bounded support model is more appropriate.
            </p>
            <Button asChild variant="outline" className="mt-7">
              <Link href="/services">Compare every package</Link>
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {services.map(({ icon: Icon, title, description, price, href }) => (
              <article key={title} className="flex flex-col border p-6">
                <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                <h3 className="mt-5 text-xl font-semibold">{title}</h3>
                <p className="mt-3 flex-1 text-sm leading-6 text-muted-foreground">{description}</p>
                <p className="mt-6 border-t pt-4 text-sm text-muted-foreground">Packages from</p>
                <p className="mt-1 text-2xl font-semibold">${price.toLocaleString("en-US")}</p>
                <Link href={href} className="mt-5 inline-flex items-center font-semibold text-primary">
                  View scope <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y bg-muted/30" aria-labelledby="paths-heading">
        <div className="container-wide py-16 lg:py-20">
          <h2 id="paths-heading" className="text-4xl font-semibold">Choose the right path</h2>
          <div className="mt-10 grid gap-12 lg:grid-cols-2">
            <div className="border-t pt-6">
              <FileCheck2 className="h-7 w-7 text-primary" aria-hidden="true" />
              <h3 className="mt-4 text-2xl font-semibold">For organizations</h3>
              <p className="mt-3 leading-7 text-muted-foreground">
                Commission a scoped audit, remediation sprint, design review, training program, disabled-user study, or conformance documentation engagement.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                <li>Named practitioner and written statement of work</li>
                <li>Reproducible findings and human review</li>
                <li>Procurement, privacy, and subprocessor information</li>
              </ul>
              <Button asChild className="mt-7"><Link href="/contact">Discuss organizational work</Link></Button>
            </div>
            <div className="border-t pt-6">
              <Code2 className="h-7 w-7 text-primary" aria-hidden="true" />
              <h3 className="mt-4 text-2xl font-semibold">For practitioners and teams</h3>
              <p className="mt-3 leading-7 text-muted-foreground">
                Use free testing tools, WCAG references, implementation guides, checklists, and research synthesis while keeping human review in the loop.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
                <li>Contrast, heading, scope, and audit helpers</li>
                <li>WCAG 2.2 criterion-level implementation guidance</li>
                <li>Named authorship and editorial standards</li>
              </ul>
              <Button asChild variant="outline" className="mt-7"><Link href="/tools">Explore free tools</Link></Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container-wide py-16 lg:py-24" aria-labelledby="work-heading">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-primary">Selected work</p>
            <h2 id="work-heading" className="mt-3 text-4xl font-semibold">How accessibility work is delivered</h2>
          </div>
          <Link href="/case-studies" className="inline-flex items-center font-semibold text-primary">All selected work <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {caseStudies.map((study) => (
            <article key={study.slug} className="border p-6">
              <p className="text-xs font-semibold uppercase text-primary">{study.category}</p>
              <h3 className="mt-3 text-2xl font-semibold">{study.title}</h3>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">{study.summary}</p>
              <p className="mt-6 border-t pt-4 text-xs leading-5 text-muted-foreground">Client identity withheld. Founder project record; no endorsement implied.</p>
              <Link href={`/case-studies/${study.slug}`} className="mt-5 inline-flex items-center font-semibold text-primary">
                Read record <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y bg-slate-950 text-white">
        <div className="container-wide grid gap-12 py-16 lg:grid-cols-[0.75fr_1.25fr] lg:items-center lg:py-20">
          <div className="flex items-center gap-5">
            <div className="relative h-28 w-28 shrink-0 overflow-hidden border border-slate-700">
              <Image src={portrait} alt="Khushwant Parihar outdoors beside a lake and green hills" fill sizes="112px" className="object-cover" />
            </div>
            <div>
              <p className="text-sm text-teal-300">Owner and accountable practitioner</p>
              <h2 className="mt-2 text-2xl font-semibold">Khushwant Parihar</h2>
            </div>
          </div>
          <div>
            <p className="text-xl leading-8 text-slate-300">
              Accessibility.build is intentionally founder-led. Scoping, delivery quality, client communication, and published claims remain attached to a named professional rather than an anonymous “expert team”.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild variant="outline" className="border-slate-600 bg-transparent text-white hover:bg-slate-900 hover:text-white">
                <Link href="/authors/khushwant-parihar">Professional profile</Link>
              </Button>
              <Button asChild variant="ghost" className="text-white hover:bg-slate-900 hover:text-white">
                <a href={company.founderWebsite} target="_blank" rel="me noopener noreferrer">External portfolio <ExternalLink className="ml-2 h-4 w-4" /></a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="container-wide py-16 lg:py-20" aria-labelledby="evidence-heading">
        <h2 id="evidence-heading" className="text-4xl font-semibold">Inspect the evidence before engaging</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: FileCheck2, title: "Sample audit report", text: "Scope, evidence, severity, limitations, and remediation examples.", href: "/sample-audit-report" },
            { icon: Keyboard, title: "Audit methodology", text: "Manual, automated, keyboard, screen-reader, and retest process.", href: "/methodology" },
            { icon: ShieldCheck, title: "Trust and procurement", text: "Ownership, GST status, providers, policies, and buyer documents.", href: "/procurement" },
            { icon: BookOpenCheck, title: "Editorial standards", text: "Named authorship, sourcing, AI disclosure, updates, and corrections.", href: "/editorial-policy" },
          ].map(({ icon: Icon, title, text, href }) => (
            <Link key={href} href={href} className="border-t pt-5 hover:text-primary">
              <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
              <h3 className="mt-4 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t bg-muted/30">
        <div className="container-wide flex flex-col gap-6 py-14 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-semibold">Start with a defined accessibility problem</h2>
            <p className="mt-2 max-w-2xl text-muted-foreground">Share the product, workflows, deadline, and evidence you need. You will receive a scoped recommendation, not an open-ended hourly estimate.</p>
          </div>
          <Button asChild size="lg"><Link href="/contact">Contact Khushwant <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
        </div>
      </section>
    </div>
  )
}
