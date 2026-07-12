import Link from "next/link"
import { BookCheck, Bot, FileSearch, Scale } from "lucide-react"
import { company, legalLastUpdated } from "@/lib/company"
import { createMetadata } from "@/lib/metadata"

export const metadata = createMetadata({
  title: "Editorial Policy",
  path: "/editorial-policy",
  description:
    "Accessibility.build's standards for named authorship, sourcing, technical review, AI assistance, legal content, research disclosure, updates, and conflicts of interest.",
  keywords: ["Accessibility.build editorial policy", "accessibility content standards", "AI editorial disclosure"],
  authors: [{ name: company.legalOperator, url: company.founderWebsite }],
})

const commitments = [
  { icon: FileSearch, title: "Traceable sources", text: "Material factual claims should link to primary standards, government publications, court records, research papers, or clearly identified datasets whenever practical." },
  { icon: BookCheck, title: "Named accountability", text: "Author and reviewer identities are published when known. Generic team bylines are not used as a substitute for the person responsible for the work." },
  { icon: Bot, title: "Human-reviewed AI use", text: "AI may support research organization, drafting, or editing. It does not replace source verification, technical judgment, or author accountability." },
  { icon: Scale, title: "Qualified legal coverage", text: "Legal and regulatory content is educational, identifies jurisdiction and date, cites authoritative material, and is not represented as legal advice." },
]

export default function EditorialPolicyPage() {
  return (
    <div className="container-wide py-12 lg:py-16">
      <article className="mx-auto max-w-4xl">
        <header className="border-b pb-8">
          <p className="text-sm font-semibold uppercase text-primary">Publishing standards</p>
          <h1 className="mt-3 text-4xl font-semibold">Editorial Policy</h1>
          <p className="mt-4 text-lg leading-7 text-muted-foreground">How Accessibility.build researches, writes, reviews, updates, and corrects public content.</p>
          <p className="mt-4 text-sm text-muted-foreground">Last reviewed: {legalLastUpdated}</p>
        </header>

        <section className="grid gap-6 border-b py-10 md:grid-cols-2">
          {commitments.map(({ icon: Icon, title, text }) => (
            <div key={title} className="border-t pt-5">
              <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
              <h2 className="mt-3 text-lg font-semibold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
            </div>
          ))}
        </section>

        <div className="prose prose-lg mt-10 max-w-none dark:prose-invert">
          <h2>Ownership and responsibility</h2>
          <p>
            Accessibility.build is founder-owned. {company.legalOperator} is responsible for the editorial standards on this page and for ensuring that published bylines identify the accountable author. Contributor and specialist-reviewer roles are credited separately when applicable.
          </p>

          <h2>Research and sourcing</h2>
          <ul>
            <li>Primary standards and official sources are preferred over summaries.</li>
            <li>Statistics identify the source, covered period, population, and meaningful limitations.</li>
            <li>Third-party research synthesis is not described as original Accessibility.build data collection.</li>
            <li>Anonymous sources are avoided unless the information is important, independently corroborated, and anonymity is explained.</li>
            <li>Affiliate, sponsored, or paid-placement relationships must be disclosed near the affected content. Accessibility.build does not currently publish paid rankings.</li>
          </ul>

          <h2>Technical accessibility content</h2>
          <p>
            Code and testing guidance should distinguish requirements, sufficient techniques, common patterns, and professional judgment. Examples are reviewed for semantics, keyboard use, names and relationships, status communication, focus behavior, contrast, and relevant assistive-technology considerations.
          </p>
          <p>
            Passing an automated test is not described as proof of WCAG conformance. Tool limitations and manual-testing requirements are stated where they affect interpretation.
          </p>

          <h2>AI assistance</h2>
          <p>
            AI may help summarize notes, generate candidate outlines, compare wording, or draft code examples. The named author remains responsible for checking sources, dates, code behavior, legal qualifications, citations, and the final published text. AI output is not treated as a source.
          </p>

          <h2>Updates and corrections</h2>
          <p>
            Time-sensitive pages include an updated or reviewed date. Material corrections are handled under the <Link href="/corrections-policy">Corrections Policy</Link>. Minor spelling or formatting changes may be corrected without a formal note when they do not change meaning.
          </p>

          <h2>Reader feedback</h2>
          <p>
            Report a factual, technical, accessibility, or attribution concern to <a href={`mailto:${company.email}`}>{company.email}</a>. Include the page URL, the disputed passage, supporting evidence, and the correction you believe is required.
          </p>
        </div>
      </article>
    </div>
  )
}
