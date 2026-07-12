import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight, CheckCircle2, LockKeyhole } from "lucide-react"
import { Button } from "@/components/ui/button"
import { caseStudies } from "@/lib/authority-content"
import { company } from "@/lib/company"
import { createMetadata } from "@/lib/metadata"

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const study = caseStudies.find((item) => item.slug === slug)
  if (!study) return {}

  return createMetadata({
    title: `${study.title} Case Study`,
    path: `/case-studies/${study.slug}`,
    description: study.summary,
    keywords: ["accessibility case study", study.category, ...study.technologies],
    authors: [{ name: company.legalOperator, url: company.founderWebsite }],
  })
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const study = caseStudies.find((item) => item.slug === slug)
  if (!study) notFound()

  const schema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: study.title,
    description: study.summary,
    url: `${company.website}/case-studies/${study.slug}`,
    creator: { "@id": `${company.website}/#founder` },
    about: ["Web accessibility", "Accessible product development", ...study.technologies],
  }

  return (
    <div className="bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <section className="border-b bg-slate-950 text-white">
        <div className="container-wide py-16 lg:py-24">
          <Link href="/case-studies" className="inline-flex items-center text-sm text-slate-300 hover:text-white">
            <ArrowLeft className="mr-2 h-4 w-4" /> All selected work
          </Link>
          <p className="mt-10 text-sm font-semibold uppercase text-teal-300">{study.category}</p>
          <h1 className="mt-3 max-w-5xl text-4xl font-semibold leading-tight sm:text-6xl">{study.title}</h1>
          <p className="mt-6 max-w-3xl text-xl leading-8 text-slate-300">{study.summary}</p>
        </div>
      </section>

      <section className="container-wide grid gap-12 py-16 lg:grid-cols-[0.7fr_1.3fr] lg:py-20">
        <aside>
          <p className="text-sm font-semibold uppercase text-primary">Engagement</p>
          <p className="mt-3 leading-7">{study.engagement}</p>
          <p className="mt-8 text-sm font-semibold uppercase text-primary">Evidence level</p>
          <p className="mt-3 leading-7">{study.evidenceLevel}</p>
          <div className="mt-8 border bg-muted/30 p-5">
            <LockKeyhole className="h-5 w-5 text-primary" aria-hidden="true" />
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{study.disclosure}</p>
          </div>
        </aside>
        <div>
          <h2 className="text-3xl font-semibold">The challenge</h2>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">{study.challenge}</p>

          <h2 className="mt-12 text-3xl font-semibold">Approach</h2>
          <ol className="mt-6 space-y-5">
            {study.approach.map((item, index) => (
              <li key={item} className="grid grid-cols-[2rem_1fr] gap-3 leading-7 text-muted-foreground">
                <span className="font-semibold text-primary">{index + 1}</span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-y bg-muted/30">
        <div className="container-wide grid gap-12 py-16 lg:grid-cols-2 lg:py-20">
          <div>
            <h2 className="text-3xl font-semibold">Deliverables</h2>
            <ul className="mt-6 space-y-4">
              {study.deliverables.map((item) => (
                <li key={item} className="flex gap-3 leading-7 text-muted-foreground">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden="true" /> {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-3xl font-semibold">Documented outcomes</h2>
            <ul className="mt-6 space-y-4">
              {study.outcomes.map((item) => (
                <li key={item} className="flex gap-3 leading-7 text-muted-foreground">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden="true" /> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="container-wide py-16 lg:py-20">
        <div className="flex flex-wrap gap-2" aria-label="Technologies and standards">
          {study.technologies.map((item) => (
            <span key={item} className="border bg-muted/30 px-3 py-1.5 text-sm">{item}</span>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/contact">Discuss a similar engagement <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
          <Button asChild variant="outline"><Link href="/methodology">Review methodology</Link></Button>
        </div>
      </section>
    </div>
  )
}
