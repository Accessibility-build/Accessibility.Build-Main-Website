import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  BadgeCheck,
  BookOpenCheck,
  Code2,
  FileCheck2,
  Keyboard,
  ScanSearch,
  ShieldCheck,
  Wrench,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { caseStudies } from "@/lib/authority-content"
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
        <div className="container-wide py-16 lg:py-24">
          <p className="text-sm font-semibold uppercase text-teal-300">Accessibility services, tools, and WCAG guidance</p>
          <h1 className="mt-4 max-w-5xl text-5xl font-semibold leading-tight sm:text-6xl lg:text-7xl">
            <span className="block sm:inline">Accessibility</span><span className="block sm:inline">.build</span>
          </h1>
          <p className="mt-6 max-w-3xl text-xl leading-8 text-slate-300">
            Practical accessibility work for digital products: defined audits, implementation support, team training, and evidence your organization can use.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/services">View professional services <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-slate-600 bg-transparent text-white hover:bg-slate-900 hover:text-white">
              <Link href="/sample-audit-report">Inspect sample report</Link>
            </Button>
          </div>
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

      <section className="border-y bg-muted/30" aria-labelledby="founder-heading">
        <div className="container-wide grid gap-6 py-10 sm:grid-cols-[96px_minmax(0,1fr)_auto] sm:items-center">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden border bg-background">
            <Image src={portrait} alt="Khushwant Parihar outdoors beside a lake and green hills" fill sizes="96px" className="object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold uppercase text-primary">About the founder</p>
            <h2 id="founder-heading" className="mt-1 text-2xl font-semibold">Khushwant Parihar</h2>
            <p className="mt-2 max-w-3xl leading-7 text-muted-foreground">
              Founder and accessibility consultant with more than four years of experience across auditing, remediation, accessible development, and software testing.
            </p>
          </div>
          <Button asChild variant="outline" className="w-fit shrink-0">
            <Link href="/authors/khushwant-parihar">View profile <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
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
