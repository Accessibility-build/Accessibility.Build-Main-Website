import Link from "next/link"
import { ArrowRight, BriefcaseBusiness, FileCheck2, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { caseStudies } from "@/lib/authority-content"
import { company } from "@/lib/company"
import { createMetadata } from "@/lib/metadata"

export const metadata = createMetadata({
  title: "Accessibility Case Studies and Selected Work",
  path: "/case-studies",
  description:
    "Selected accessibility platform, audit workflow, and CMS remediation work led by Khushwant Parihar, presented with clear confidentiality and evidence disclosures.",
  keywords: [
    "accessibility case studies",
    "WCAG remediation case study",
    "accessibility audit platform",
    "accessible product development",
  ],
  authors: [{ name: company.legalOperator, url: company.founderWebsite }],
})

export default function CaseStudiesPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Accessibility.build Case Studies",
    url: `${company.website}/case-studies`,
    author: { "@id": `${company.website}/#founder` },
    hasPart: caseStudies.map((study) => ({
      "@type": "CreativeWork",
      name: study.title,
      url: `${company.website}/case-studies/${study.slug}`,
      description: study.summary,
    })),
  }

  return (
    <div className="bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section className="border-b bg-slate-950 text-white">
        <div className="container-wide py-16 lg:py-24">
          <p className="text-sm font-semibold uppercase text-teal-300">Selected work</p>
          <h1 className="mt-3 max-w-5xl text-4xl font-semibold leading-tight sm:text-6xl">Accessibility case studies</h1>
          <p className="mt-6 max-w-3xl text-xl leading-8 text-slate-300">
            Detailed project records showing how accessibility requirements were translated into workflows, interfaces, remediation, and accountable delivery.
          </p>
        </div>
      </section>

      <section className="container-wide py-16 lg:py-20">
        <div className="flex max-w-4xl items-start gap-4 border bg-muted/30 p-6">
          <ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-primary" aria-hidden="true" />
          <div>
            <h2 className="font-semibold">Evidence and confidentiality</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              These records describe work led by Khushwant Parihar. Client identities and confidential implementation details are withheld. They are not client testimonials, and no public endorsement is implied. Quantitative claims are excluded unless client-approved evidence is available.
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {caseStudies.map((study, index) => (
            <article key={study.slug} className="flex flex-col border bg-card p-6">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <BriefcaseBusiness className="h-5 w-5" aria-hidden="true" />
              </div>
              <p className="mt-8 text-xs font-semibold uppercase text-primary">{study.category}</p>
              <h2 className="mt-3 text-2xl font-semibold">{study.title}</h2>
              <p className="mt-4 flex-1 leading-7 text-muted-foreground">{study.summary}</p>
              <Link href={`/case-studies/${study.slug}`} className="mt-8 inline-flex items-center font-semibold text-primary">
                Read project record <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y bg-muted/30">
        <div className="container-wide flex flex-col gap-6 py-12 md:flex-row md:items-center md:justify-between">
          <div>
            <FileCheck2 className="h-6 w-6 text-primary" aria-hidden="true" />
            <h2 className="mt-3 text-2xl font-semibold">Inspect the reporting standard</h2>
            <p className="mt-2 text-muted-foreground">Review the fictional, clearly labelled sample audit report in HTML or PDF.</p>
          </div>
          <Button asChild>
            <Link href="/sample-audit-report">View sample report <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
