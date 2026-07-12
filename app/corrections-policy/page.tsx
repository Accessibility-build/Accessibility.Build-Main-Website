import Link from "next/link"
import { CheckCircle2, Clock3, Mail, SearchCheck } from "lucide-react"
import { company, legalLastUpdated } from "@/lib/company"
import { createMetadata } from "@/lib/metadata"

export const metadata = createMetadata({
  title: "Corrections Policy",
  path: "/corrections-policy",
  description:
    "How Accessibility.build receives, investigates, corrects, documents, and communicates substantive errors in technical, research, legal, and editorial content.",
  keywords: ["Accessibility.build corrections", "content correction policy", "accessibility research corrections"],
  authors: [{ name: company.legalOperator, url: company.founderWebsite }],
})

const steps = [
  { icon: Mail, title: "Receive", text: "A report identifies the page, disputed statement, supporting evidence, and requested correction." },
  { icon: SearchCheck, title: "Investigate", text: "The source, date, context, code behavior, and effect on the article's conclusion are reviewed." },
  { icon: CheckCircle2, title: "Correct", text: "Confirmed errors are fixed in the page, structured data, downloadable files, and related summaries where applicable." },
  { icon: Clock3, title: "Disclose", text: "Substantive changes receive an updated date and a correction note describing what changed." },
]

export default function CorrectionsPolicyPage() {
  return (
    <div className="container-wide py-12 lg:py-16">
      <article className="mx-auto max-w-4xl">
        <header className="border-b pb-8">
          <p className="text-sm font-semibold uppercase text-primary">Editorial accountability</p>
          <h1 className="mt-3 text-4xl font-semibold">Corrections Policy</h1>
          <p className="mt-4 text-lg leading-7 text-muted-foreground">A documented process for fixing errors without quietly rewriting the record.</p>
          <p className="mt-4 text-sm text-muted-foreground">Last reviewed: {legalLastUpdated}</p>
        </header>

        <ol className="grid gap-6 border-b py-10 md:grid-cols-2">
          {steps.map(({ icon: Icon, title, text }, index) => (
            <li key={title} className="border-t pt-5">
              <div className="flex items-center justify-between">
                <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                <span className="text-sm font-semibold text-muted-foreground">0{index + 1}</span>
              </div>
              <h2 className="mt-3 text-lg font-semibold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
            </li>
          ))}
        </ol>

        <div className="prose prose-lg mt-10 max-w-none dark:prose-invert">
          <h2>What receives a correction note</h2>
          <ul>
            <li>incorrect legal, regulatory, standards, deadline, or enforcement information;</li>
            <li>incorrect technical instructions that could create an accessibility barrier;</li>
            <li>materially wrong statistics, calculations, attribution, or dataset interpretation;</li>
            <li>changes that alter the conclusion, recommendation, or risk described;</li>
            <li>incorrect authorship, quotation, or conflict-of-interest disclosure.</li>
          </ul>

          <h2>Minor changes</h2>
          <p>
            Spelling, punctuation, formatting, broken-link replacement, and wording changes that do not alter meaning may be fixed without a correction note. The reviewed date may still be updated when a page receives a substantive editorial review.
          </p>

          <h2>How corrections are displayed</h2>
          <p>
            A substantive correction should appear close to the affected content or in a clearly labelled note that identifies the original error, the corrected information, and the correction date. Downloadable reports are versioned when their substantive content changes.
          </p>

          <h2>Response target</h2>
          <p>
            We aim to acknowledge a well-supported correction request within two business days. Complex legal or technical matters may require additional review. Urgent safety, accessibility, or active-deadline errors are prioritized.
          </p>

          <h2>Submit a correction</h2>
          <p>
            Email <a href={`mailto:${company.email}?subject=Correction%20request`}>{company.email}</a> with the subject “Correction request”. Our broader sourcing and AI-use standards are described in the <Link href="/editorial-policy">Editorial Policy</Link>.
          </p>
        </div>
      </article>
    </div>
  )
}
