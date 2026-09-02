import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Scale } from "lucide-react"
import { BreadcrumbStructuredData } from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"
import { PageByline } from "@/components/seo/page-byline"
import { clampDescription } from "@/lib/metadata"
import { caseStudies } from "@/lib/case-studies"

const pageTitle = "Accessibility Case Studies | Accessibility.build"
const pageDescription =
  "Long-form, sourced studies of accessibility cases that shaped the law: what users alleged, what courts found, how defendants responded, and what the public record leaves unknown."

export const metadata: Metadata = {
  title: pageTitle,
  description: clampDescription(pageDescription),
  authors: [{ name: "The Accessibility.build team", url: "https://accessibility.build/about" }],
  creator: "The Accessibility.build team",
  publisher: "Accessibility.build",
  keywords: [
    "accessibility case studies",
    "web accessibility lawsuits",
    "ADA lawsuit case study",
    "accessibility litigation analysis",
    "Robles v Domino's",
    "digital accessibility legal cases",
  ],
  alternates: { canonical: "/cases" },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: "/cases",
    type: "website",
    siteName: "Accessibility.build",
    images: [
      {
        url: `/api/og?title=${encodeURIComponent("Accessibility Case Studies")}&section=Case studies`,
        width: 1200,
        height: 630,
        alt: "Accessibility case studies",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: clampDescription(pageDescription),
    images: [`/api/og?title=${encodeURIComponent("Accessibility Case Studies")}&section=Case studies`],
  },
}

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Case Studies", url: "https://accessibility.build/cases" },
]

export default function CaseStudiesIndexPage() {
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Accessibility Case Studies",
    description: pageDescription,
    url: "https://accessibility.build/cases",
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: caseStudies.length,
      itemListElement: caseStudies.map((study, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `https://accessibility.build/cases/${study.slug}`,
        name: study.title,
      })),
    },
  }

  return (
    <>
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema).replace(/</g, "\\u003c") }}
      />

      <div className="bg-white pb-20 dark:bg-slate-950">
        <header className="border-b border-slate-200 bg-slate-50 pt-12 dark:border-slate-800 dark:bg-slate-900/40">
          <div className="container-wide py-12 lg:py-16">
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <li>
                  <Link href="/" className="hover:text-teal-700 dark:hover:text-teal-300">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-slate-900 dark:text-white">Case studies</li>
              </ol>
            </nav>

            <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">
              <Scale className="h-4 w-4" aria-hidden="true" />
              Case studies
            </p>
            <h1 className="mt-3 max-w-3xl font-serif text-4xl font-semibold leading-[1.1] tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              What accessibility cases actually decided
            </h1>
            <p className="mt-6 max-w-[65ch] text-lg leading-8 text-slate-600 dark:text-slate-300">
              Most write-ups of accessibility litigation repeat each other, and a surprising number
              of the details they repeat are wrong. These studies are built from the filings and the
              judgments: what users alleged, what courts found, how the claim was defended, what the
              record does and does not say, and the points where each dispute could have ended sooner.
            </p>
            <div className="mt-6">
              <PageByline
                route="/cases"
                reviewer={{ name: "The Accessibility.build team", href: "/about", credential: "" }}
              />
            </div>
          </div>
        </header>

        <div className="container-wide py-14">
          <ul className="mx-auto grid max-w-4xl gap-8">
            {caseStudies.map((study) => (
              <li key={study.slug}>
                <article className="group border border-slate-200 bg-white transition-colors hover:border-slate-400 dark:border-slate-800 dark:bg-slate-950 dark:hover:border-slate-600">
                  <div className="p-6 sm:p-8">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                      <span className="rounded-sm bg-slate-100 px-2 py-0.5 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {study.jurisdiction}
                      </span>
                      <span className="rounded-sm bg-slate-100 px-2 py-0.5 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {study.regime}
                      </span>
                      <span>{study.period}</span>
                      <span aria-hidden="true">&middot;</span>
                      <span>{study.readingMinutes} min read</span>
                    </div>

                    <h2 className="mt-4 font-serif text-2xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                      <Link
                        href={`/cases/${study.slug}`}
                        className="after:absolute after:inset-0 hover:text-teal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 dark:hover:text-teal-300 dark:focus-visible:ring-offset-slate-950"
                      >
                        {study.title}
                      </Link>
                    </h2>

                    <p className="mt-3 max-w-[62ch] leading-7 text-slate-600 dark:text-slate-400">
                      {study.summary}
                    </p>

                    <dl className="mt-6 flex flex-wrap gap-x-8 gap-y-3 border-t border-slate-200 pt-4 dark:border-slate-800">
                      <div>
                        <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400">
                          Outcome
                        </dt>
                        <dd className="mt-0.5 text-sm text-slate-900 dark:text-white">
                          {study.outcome}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400">
                          Topics
                        </dt>
                        <dd className="mt-0.5 text-sm text-slate-900 dark:text-white">
                          {study.tags.join(", ")}
                        </dd>
                      </div>
                    </dl>

                    <p className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-800 dark:text-teal-300">
                      Read the case study
                      <ArrowRight
                        className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
                        aria-hidden="true"
                      />
                    </p>
                  </div>
                </article>
              </li>
            ))}
          </ul>

          <div className="mx-auto mt-14 max-w-4xl border-t border-slate-200 pt-10 dark:border-slate-800">
            <h2 className="font-serif text-2xl font-semibold text-slate-900 dark:text-white">
              How these are written
            </h2>
            <div className="mt-4 max-w-[65ch] space-y-4 leading-7 text-slate-600 dark:text-slate-400">
              <p>
                Every claim comes from a filing, a judgment, a docket or a named public statement,
                and each study links its sources. Where a figure is widely repeated but cannot be
                traced to the record, the study says so instead of passing it on. Where a case is
                commonly misdescribed, there is a section setting the claim against what the record
                actually holds.
              </p>
              <p>
                These pages are analysis, not legal advice. For the current filing numbers see the{" "}
                <Link
                  href="/research/accessibility-lawsuits"
                  className="font-medium text-teal-700 underline underline-offset-2 dark:text-teal-300"
                >
                  accessibility lawsuit tracker
                </Link>
                , and for the law by jurisdiction see the{" "}
                <Link
                  href="/compliance"
                  className="font-medium text-teal-700 underline underline-offset-2 dark:text-teal-300"
                >
                  compliance guides
                </Link>
                .
              </p>
            </div>
          </div>

          <div className="mx-auto mt-14 max-w-4xl">
            <RelatedContent
              content="accessibility lawsuit litigation ADA compliance legal risk audit"
              title="Related reading"
              maxItems={4}
              showDescriptions
            />
          </div>
        </div>
      </div>
    </>
  )
}
