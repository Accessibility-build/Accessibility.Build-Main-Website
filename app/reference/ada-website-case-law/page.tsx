import type { Metadata } from "next"
import Link from "next/link"
import { BreadcrumbStructuredData } from "@/components/seo/structured-data"
import { GuideArticleSchema } from "@/components/seo/guide-article-schema"
import { PageByline } from "@/components/seo/page-byline"
import { RelatedContent } from "@/components/seo/related-content"
import { KeyFacts } from "@/components/research/key-facts"
import { CircuitPositions } from "@/components/cases/case-graphics"
import { clampDescription } from "@/lib/metadata"

// A reference, not an essay: which federal court has said what about whether
// the ADA reaches a website, with the status of each decision. It exists
// because the three case studies kept needing to say "see the circuit map"
// and because vendors keep citing a vacated opinion as law. Update the table
// when a circuit rules; the case studies link here rather than restating it.

const ROUTE = "/reference/ada-website-case-law"
const pageTitle = "ADA Website Case Law by Circuit"
const pageDescription =
  "Which federal appeals courts have decided whether the ADA covers websites, what each held, and which decisions still bind. Includes the vacated Winn-Dixie opinion and the cases that never reached a holding."

export const metadata: Metadata = {
  title: pageTitle,
  description: clampDescription(pageDescription),
  keywords: [
    "ADA website case law",
    "ADA circuit split websites",
    "is a website a place of public accommodation",
    "nexus test ADA",
    "Robles v Domino's",
    "Gil v Winn-Dixie vacated",
    "NFB v Target",
    "Carparts",
    "Rendon v Valleycrest",
    "Title III website coverage by circuit",
  ],
  alternates: { canonical: ROUTE },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: ROUTE,
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: `/api/og?title=${encodeURIComponent("ADA Website Case Law by Circuit")}&section=Reference`,
        width: 1200,
        height: 630,
        alt: "ADA website case law by circuit",
      },
    ],
  },
}

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Reference", url: "https://accessibility.build/reference" },
  { name: "ADA website case law", url: `https://accessibility.build${ROUTE}` },
]

interface Decision {
  court: string
  case: string
  citation: string
  date: string
  held: string
  status: "Binding in circuit" | "Vacated, binds nobody" | "District court only" | "Denial of review, no holding" | "Settled, no holding"
  href?: string
  study?: string
}

const DECISIONS: Decision[] = [
  {
    court: "1st Cir.",
    case: "Carparts Distribution Center v. Automotive Wholesaler's Association",
    citation: "37 F.3d 12",
    date: "1994-10-04",
    held: "Public accommodations are not limited to physical structures. Decided about an insurance plan, before commercial websites existed; applied to websites by district courts in the circuit, including the Netflix captioning case in 2012.",
    status: "Binding in circuit",
    href: "https://law.justia.com/cases/federal/appellate-courts/F3/37/12/470591/",
  },
  {
    court: "7th Cir.",
    case: "Doe v. Mutual of Omaha Insurance",
    citation: "179 F.3d 557",
    date: "1999-06-02",
    held: "In dicta, a place of public accommodation includes facilities open to the public in both physical and electronic space, including websites. The holding itself concerned insurance terms.",
    status: "Binding in circuit",
    href: "https://law.justia.com/cases/federal/appellate-courts/F3/179/557/509024/",
  },
  {
    court: "3rd Cir.",
    case: "Ford v. Schering-Plough",
    citation: "145 F.3d 601",
    date: "1998-06-04",
    held: "A public accommodation is a physical place; a benefit without a nexus to a physical place is outside Title III. The origin of the nexus reading later applied to websites.",
    status: "Binding in circuit",
    href: "https://law.justia.com/cases/federal/appellate-courts/F3/145/601/566880/",
  },
  {
    court: "6th Cir.",
    case: "Parker v. Metropolitan Life Insurance",
    citation: "121 F.3d 1006",
    date: "1997-08-01",
    held: "Title III covers physical places; a nexus between the challenged service and a physical place is required.",
    status: "Binding in circuit",
    href: "https://law.justia.com/cases/federal/appellate-courts/F3/121/1006/586275/",
  },
  {
    court: "9th Cir.",
    case: "Weyer v. Twentieth Century Fox Film",
    citation: "198 F.3d 1104",
    date: "2000-01-11",
    held: "Places of public accommodation are actual, physical places; services must have a nexus to one. The rule the Target and Domino's courts applied.",
    status: "Binding in circuit",
    href: "https://law.justia.com/cases/federal/appellate-courts/F3/198/1104/504184/",
  },
  {
    court: "N.D. Cal.",
    case: "National Federation of the Blind v. Target",
    citation: "452 F. Supp. 2d 946",
    date: "2006-09-06",
    held: "The ADA reaches a retailer's website to the extent its inaccessibility impedes enjoyment of the goods and services of the stores, and not otherwise. The first ruling against a retailer and the origin of the website nexus test.",
    status: "District court only",
    study: "/cases/nfb-v-target",
  },
  {
    court: "11th Cir.",
    case: "Rendon v. Valleycrest Productions",
    citation: "294 F.3d 1279",
    date: "2002-06-18",
    held: "Title III reaches intangible barriers, here a telephone screening line, that block access to the privileges of a physical place. Both sides of the Winn-Dixie appeal relied on it.",
    status: "Binding in circuit",
    href: "https://law.justia.com/cases/federal/appellate-courts/F3/294/1279/482405/",
  },
  {
    court: "S.D. Fla.",
    case: "Gil v. Winn-Dixie Stores (trial)",
    citation: "257 F. Supp. 3d 1340",
    date: "2017-06-12",
    held: "After the only trial in the field, the website was a service of the stores and its inaccessibility violated Title III; injunction to WCAG 2.0 with no level named.",
    status: "Vacated, binds nobody",
    study: "/cases/gil-v-winn-dixie",
  },
  {
    court: "9th Cir.",
    case: "Robles v. Domino's Pizza",
    citation: "913 F.3d 898",
    date: "2019-01-15",
    held: "Title III applies to a website and app that connect customers to a physical restaurant's goods and services; the absence of a federal technical standard does not deny fair notice. Expressly did not decide the no-nexus case.",
    status: "Binding in circuit",
    study: "/cases/robles-v-dominos",
  },
  {
    court: "U.S. Supreme Court",
    case: "Domino's Pizza v. Robles",
    citation: "No. 18-1539, cert. denied",
    date: "2019-10-07",
    held: "Review declined without comment. A denial of certiorari decides nothing and creates no precedent.",
    status: "Denial of review, no holding",
    study: "/cases/robles-v-dominos",
  },
  {
    court: "11th Cir.",
    case: "Gil v. Winn-Dixie Stores (panel)",
    citation: "993 F.3d 1266",
    date: "2021-04-07",
    held: "Two to one: websites are not places of public accommodation, and a site that sells nothing is not an intangible barrier to the stores. Vacated eight months later because the injunction had expired.",
    status: "Vacated, binds nobody",
    study: "/cases/gil-v-winn-dixie",
  },
  {
    court: "11th Cir.",
    case: "Gil v. Winn-Dixie Stores (rehearing)",
    citation: "21 F.4th 775",
    date: "2021-12-28",
    held: "The appeal was moot; the panel opinion and the trial judgment are vacated and the case dismissed. The Eleventh Circuit has no controlling decision on websites.",
    status: "Vacated, binds nobody",
    study: "/cases/gil-v-winn-dixie",
  },
  {
    court: "C.D. Cal.",
    case: "Robles v. Domino's Pizza (summary judgment)",
    citation: "No. 2:16-cv-06599",
    date: "2021-06-23",
    held: "Domino's website violated Title III; ordered to conform to WCAG 2.0, no level and no deadline; $4,000 under California's Unruh Act. App claims never decided; settled June 2022.",
    status: "District court only",
    study: "/cases/robles-v-dominos",
  },
]

const STATUS_STYLE: Record<Decision["status"], string> = {
  "Binding in circuit": "bg-emerald-50 text-emerald-900 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-200 dark:ring-emerald-900",
  "Vacated, binds nobody": "bg-rose-50 text-rose-900 ring-rose-200 dark:bg-rose-950/40 dark:text-rose-200 dark:ring-rose-900",
  "District court only": "bg-slate-100 text-slate-800 ring-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700",
  "Denial of review, no holding": "bg-amber-50 text-amber-900 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-200 dark:ring-amber-900",
  "Settled, no holding": "bg-slate-100 text-slate-800 ring-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:ring-slate-700",
}

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
}

export default function AdaWebsiteCaseLawPage() {
  const sorted = [...DECISIONS].sort((a, b) => a.date.localeCompare(b.date))
  return (
    <>
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />
      <GuideArticleSchema
        route={ROUTE}
        title={pageTitle}
        description={pageDescription}
        datePublished="2026-09-03"
        section="Reference"
        author={{ name: "The Accessibility.build team", url: "https://accessibility.build/about", type: "Organization" }}
      />

      <article className="bg-white pb-20 dark:bg-slate-950">
        <header className="border-b border-slate-200 bg-slate-50 pt-12 dark:border-slate-800 dark:bg-slate-900/40">
          <div className="container-wide py-10 lg:py-14">
            <nav aria-label="Breadcrumb" className="mb-6">
              <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <li>
                  <Link href="/" className="hover:text-teal-700 dark:hover:text-teal-300">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link href="/reference/aria" className="hover:text-teal-700 dark:hover:text-teal-300">
                    Reference
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-slate-900 dark:text-white">ADA website case law</li>
              </ol>
            </nav>
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">
              Reference &middot; United States
            </p>
            <h1 className="mt-3 max-w-4xl font-serif text-4xl font-semibold leading-[1.1] tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              ADA website case law, by circuit
            </h1>
            <p className="mt-6 max-w-[62ch] text-lg leading-8 text-slate-700 dark:text-slate-300">
              Whether Title III of the Americans with Disabilities Act reaches a website depends on
              which federal circuit you are in, and on distinguishing the decisions that bind from
              the ones that were vacated, denied review, or never reached the question. This page
              keeps that list current. Every entry links to the opinion or to our case study of it.
            </p>
            <div className="mt-6">
              <PageByline
                route={ROUTE}
                reviewer={{ name: "The Accessibility.build team", href: "/about", credential: "" }}
              />
            </div>
          </div>
        </header>

        <div className="container-wide">
          <div className="mx-auto max-w-5xl py-12">
            <KeyFacts
              facts={[
                { value: "5", label: "Circuits requiring a nexus to a physical place before a site is covered", source: "Third, Sixth and Ninth Circuit decisions", asOf: "2026-09" },
                { value: "2", label: "Circuits where a website can be a public accommodation on its own", source: "Carparts (1st Cir.) and Doe v. Mutual of Omaha (7th Cir.)", asOf: "2026-09" },
                { value: "0", label: "Appellate decisions in force holding websites are outside Title III", source: "The Eleventh Circuit vacated its own in December 2021", sourceHref: "/cases/gil-v-winn-dixie", asOf: "2021-12-28" },
                { value: "6", label: "Circuits with no controlling website decision either way", source: "4th, 5th, 8th, 10th, D.C. and Federal Circuits", asOf: "2026-09" },
                { value: "$0", label: "Damages available to a private plaintiff under Title III", source: "42 U.S.C. 12188; every dollar in these cases came from state law", asOf: "2026-09" },
                { value: "1", label: "Web accessibility case ever tried to judgment", source: "Gil v. Winn-Dixie, June 2017", sourceHref: "/cases/gil-v-winn-dixie", asOf: "2017-06-12" },
              ]}
            />

            <CircuitPositions />

            <section aria-labelledby="decisions-heading" className="mt-12">
              <h2 id="decisions-heading" className="font-serif text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">
                The decisions, in order
              </h2>
              <p className="mt-3 max-w-[62ch] leading-7 text-slate-600 dark:text-slate-400">
                Status matters more than the headline. A vacated opinion has no precedential effect,
                a denial of certiorari decides nothing, and a district court binds no other court.
                Only five of these thirteen entries are binding appellate authority, and none of the
                five was about a website when it was decided.
              </p>
              <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800">
                <table className="w-full border-collapse text-sm">
                  <caption className="sr-only">
                    Federal decisions on whether the ADA reaches websites, with court, date, holding and current status
                  </caption>
                  <thead>
                    <tr>
                      {["Date", "Court", "Case", "What it held", "Status"].map((h) => (
                        <th
                          key={h}
                          scope="col"
                          className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.map((d) => (
                      <tr key={`${d.case}-${d.date}`} className="align-top">
                        <td className="whitespace-nowrap border-b border-slate-200 px-4 py-3 font-mono text-xs text-slate-600 dark:border-slate-800 dark:text-slate-400">
                          <time dateTime={d.date}>{fmt(d.date)}</time>
                        </td>
                        <td className="whitespace-nowrap border-b border-slate-200 px-4 py-3 text-slate-800 dark:border-slate-800 dark:text-slate-200">
                          {d.court}
                        </td>
                        <th
                          scope="row"
                          className="min-w-[14rem] border-b border-slate-200 px-4 py-3 text-left font-medium text-slate-900 dark:border-slate-800 dark:text-white"
                        >
                          {d.study ? (
                            <Link href={d.study} className="underline decoration-teal-700/40 underline-offset-2 hover:decoration-teal-700 dark:decoration-teal-300/40">
                              {d.case}
                            </Link>
                          ) : d.href ? (
                            <a href={d.href} target="_blank" rel="noopener noreferrer" className="underline decoration-slate-300 underline-offset-2 hover:decoration-slate-600 dark:decoration-slate-600">
                              {d.case}
                            </a>
                          ) : (
                            d.case
                          )}
                          <span className="mt-0.5 block font-mono text-xs font-normal text-slate-500 dark:text-slate-400">
                            {d.citation}
                          </span>
                        </th>
                        <td className="min-w-[22rem] border-b border-slate-200 px-4 py-3 leading-6 text-slate-700 dark:border-slate-800 dark:text-slate-300">
                          {d.held}
                        </td>
                        <td className="border-b border-slate-200 px-4 py-3 dark:border-slate-800">
                          <span className={`inline-block whitespace-nowrap rounded-sm px-2 py-0.5 text-xs font-semibold ring-1 ${STATUS_STYLE[d.status]}`}>
                            {d.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section aria-labelledby="reading-heading" className="mt-12 max-w-[68ch]">
              <h2 id="reading-heading" className="font-serif text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">
                How to read this
              </h2>
              <div className="mt-4 space-y-4 leading-7 text-slate-700 dark:text-slate-300">
                <p>
                  <strong className="font-semibold text-slate-900 dark:text-white">The nexus test is a limit, not a grant.</strong>{" "}
                  It was written in 2006 by a court ruling for the plaintiffs, and it dismissed the
                  claim for everything on Target.com unconnected to the stores. In the Third, Sixth
                  and Ninth Circuits a website is covered when it connects customers to a physical
                  place, and the question of a purely online business is expressly open.
                </p>
                <p>
                  <strong className="font-semibold text-slate-900 dark:text-white">The First and Seventh Circuit rules predate the web.</strong>{" "}
                  Carparts and Mutual of Omaha were about insurance. District courts in those
                  circuits have applied them to websites, most prominently to Netflix in 2012, but
                  neither appeals court has decided a website case.
                </p>
                <p>
                  <strong className="font-semibold text-slate-900 dark:text-white">Winn-Dixie is the entry most often cited wrongly.</strong>{" "}
                  The April 2021 panel opinion is still quoted, in briefs and in sales material, as
                  the Eleventh Circuit&apos;s position. The court withdrew it in December 2021
                  because the injunction under appeal had expired. Florida, Georgia and Alabama have
                  no appellate rule.
                </p>
                <p>
                  <strong className="font-semibold text-slate-900 dark:text-white">Money comes from state law.</strong>{" "}
                  Title III allows an injunction and fees, nothing more. The $4,000 in Domino&apos;s
                  and the $6 million fund in Target were both California statutory damages, which is
                  why California and New York dominate the{" "}
                  <Link href="/research/accessibility-lawsuits" className="font-medium text-teal-700 underline underline-offset-2 dark:text-teal-300">
                    filing statistics
                  </Link>
                  .
                </p>
                <p>
                  <strong className="font-semibold text-slate-900 dark:text-white">The regulator&apos;s position is on the record.</strong>{" "}
                  The Justice Department told the Winn-Dixie trial court in December 2016 that a
                  grocery chain&apos;s website must be accessible unless doing so is an undue
                  burden, and its 2024 rule requires WCAG 2.1 AA of state and local government under
                  Title II. There is still no technical regulation for private business under Title
                  III.
                </p>
              </div>
              <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
                Analysis, not legal advice. Last reviewed 3 September 2026; the table is updated when
                a circuit rules. The three case studies carry the full sourcing for their entries.
              </p>
            </section>

            <div className="mt-14">
              <RelatedContent
                content="ADA Title III website lawsuit circuit nexus public accommodation case law"
                title="Related reading"
                maxItems={4}
                showDescriptions
              />
            </div>
          </div>
        </div>
      </article>
    </>
  )
}
