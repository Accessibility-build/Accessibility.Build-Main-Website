import type { Metadata } from "next"
import { CalendarClock, FileCheck2, Landmark, Scale } from "lucide-react"
import {
  ArticleStructuredData,
  BreadcrumbStructuredData,
} from "@/components/seo/structured-data"
import { FaqSection } from "@/components/seo/faq-section"
import { RelatedContent } from "@/components/seo/related-content"
import { ReportHero, ReportSectionNav } from "@/components/research/report-hero"
import { DatasetDownloads } from "@/components/research/dataset-downloads"
import { getRouteDate } from "@/lib/site-routes"
import { clampDescription } from "@/lib/metadata"
import { cn } from "@/lib/utils"
import penalties from "@/lib/data/eaa-penalties.json"

const pageUrl = "https://accessibility.build/research/eaa-penalties"
const pageTitle = "EAA Fines and Penalties by Country"
const checkedLabel = "31 October 2026"

type Status = "verified" | "partial" | "not_verified"

const statusLabels: Record<Status, string> = {
  verified: "Verified",
  partial: "Partly verified",
  not_verified: "Not verified",
}

const statusClasses: Record<Status, string> = {
  verified: "border-teal-700 text-teal-800 dark:border-teal-400 dark:text-teal-300",
  partial: "border-amber-700 text-amber-900 dark:border-amber-400 dark:text-amber-300",
  not_verified: "border-slate-500 text-slate-700 dark:border-slate-400 dark:text-slate-300",
}

// The language of each quoted provision, so screen readers pronounce it correctly.
const quoteLang: Record<string, string> = {
  AT: "de", BE: "fr", BG: "bg", HR: "hr", CY: "el", CZ: "cs", DK: "da", EE: "et", FI: "fi",
  FR: "fr", DE: "de", GR: "el", HU: "hu", IE: "en", IT: "it", LV: "lv", LT: "lt", LU: "fr",
  MT: "en", NL: "nl", PL: "pl", PT: "pt", RO: "ro", SK: "sk", SI: "sl", ES: "es", SE: "sv",
}

interface PenaltyRoute {
  scope: string | null
  penaltyType: string | null
  maximum: string | null
  provision: string | null
  quote: string | null
  translation: string | null
  sourceUrl: string | null
  crossReference: string | null
  status: string
  note: string | null
}

interface PenaltyState {
  code: string
  name: string
  law: string | null
  lawUrl: string | null
  authorities: string | null
  routes: PenaltyRoute[]
}

const states = penalties.states as unknown as PenaltyState[]
const routes = states.flatMap((state) => state.routes)
const verifiedRoutes = routes.filter((route) => route.status === "verified").length
const fullyVerified = states.filter((state) =>
  state.routes.every((route) => route.status === "verified"),
)
const notRead = states.filter((state) =>
  state.routes.every((route) => route.status === "not_verified"),
)

function stateStatus(state: PenaltyState): Status {
  if (state.routes.every((route) => route.status === "verified")) return "verified"
  if (state.routes.every((route) => route.status === "not_verified")) return "not_verified"
  return "partial"
}

export const metadata: Metadata = {
  title: pageTitle,
  description: clampDescription(
    "Maximum EAA penalties for all 27 EU states, split by enforcement route and checked against national law. Each row shows the provision and how far we verified it.",
  ),
  keywords: [
    "EAA fines by country",
    "European Accessibility Act penalties",
    "EAA fines",
    "EAA enforcement",
    "BFSG Bussgeld",
    "Directive 2019/882 penalties",
  ],
  alternates: { canonical: pageUrl },
  openGraph: {
    title: pageTitle,
    description:
      "Maximum penalties under each EU state's EAA law, by enforcement route, with the provision quoted.",
    url: pageUrl,
    type: "article",
    publishedTime: "2026-11-01T00:00:00Z",
    modifiedTime: "2026-11-01T00:00:00Z",
    images: [
      {
        url: `/api/og?title=${encodeURIComponent(pageTitle)}&section=Research`,
        width: 1200,
        height: 630,
        alt: "EAA fines and penalties by country",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description:
      "Maximum penalties under each EU state's EAA law, by enforcement route, with the provision quoted.",
  },
}

const faqs = [
  {
    question: "What is the maximum fine under the European Accessibility Act?",
    answer:
      "The Directive sets no fine. Article 30 leaves penalties to each Member State, so the maximum depends on the country and often on the sector and enforcement route. In the texts we read, Germany's BFSG goes up to EUR 100,000 for the listed breaches, Sweden's act up to SEK 10,000,000 and Spain's fallback regime up to EUR 1,000,000.",
  },
  {
    question: "Has anyone been fined under the EAA?",
    answer:
      "As of 31 October 2026 we found no fine issued by a national regulator under an EAA transposition law. That means none was found, not that none exists. A French court did order Carrefour France to pay two associations EUR 10,000 in provisional damages and EUR 3,000 in costs, but those are not regulatory fines.",
  },
  {
    question: "Why do sites give different fine amounts for the same country?",
    answer:
      "Often because one country has several routes. In the Netherlands, some routes use the fifth fine category, which rose from EUR 103,000 to EUR 110,000 on 1 January 2026, while others appear to reach EUR 900,000 or 1% of turnover. A single figure can only ever describe one route, and it can go out of date.",
  },
  {
    question: "Is this legal advice?",
    answer:
      "No. This page records published legal texts for information. It may be incomplete, translations are ours and unofficial, and no lawyer has reviewed it. Check the linked text and take advice for your own situation.",
  },
]

const ledger = [
  {
    date: "4 June 2026",
    place: "France",
    body: "Tribunal judiciaire de Caen, RG 25/00691",
    kind: "Court order, interim, first instance",
    text: "Carrefour France ordered to comply, under EUR 500 per day starting six months after the order (about 4 December 2026). It must also pay the two associations EUR 10,000 in provisional damages and EUR 3,000 in costs. The court refused to suspend the site. We found no record of an appeal.",
    href: "https://www.interetaagir.org/wp-content/uploads/2026/06/TJ-de-Caen-ord.-4-juin-2026_API-DV-et-DROIT-PLURIEL-c.-CARREFOUR.pdf",
    source: "Text of the order",
  },
  {
    date: "5 May 2026",
    place: "France",
    body: "Tribunal judiciaire de Lille, RG 25/01796",
    kind: "Court order, interim, first instance",
    text: "Interim relief refused in a similar claim against Auchan E-Commerce France. This was not a ruling on the merits. The associations say they will appeal.",
    href: "https://www.courdecassation.fr/decision/69fb8571cdc6046d47d58979",
    source: "Text of the order",
  },
  {
    date: "24 March 2026",
    place: "Netherlands",
    body: "ACM, the consumer and market regulator",
    kind: "Regulator findings, no fine",
    text: "ACM reported that 61% of the largest Dutch online stores are not digitally accessible, and that companies that do not improve risk enforcement action. Dutch broadcaster NOS later reported that ACM visited ten large webshops and planned a new test after three months.",
    href: "https://www.acm.nl/en/publications/acm-majority-large-online-stores-are-not-accessible-customers-disabilities",
    source: "ACM publication",
  },
  {
    date: "11 March 2026",
    place: "Germany and Croatia",
    body: "European Commission",
    kind: "Infringement step against states",
    text: "Additional reasoned opinions sent to both countries because transposition gaps remain. This concerns the states, not companies.",
    href: "https://ec.europa.eu/commission/presscorner/api/files/document/print/en/inf_26_431/INF_26_431_EN.pdf",
    source: "Commission infringement package",
  },
  {
    date: "4 August 2026",
    place: "Poland",
    body: "Finance Ministry reply to the Sejm",
    kind: "Official statement, one sector",
    text: "The Financial Ombudsman, which supervises retail banking under the act, had imposed no fines and had received 45 notifications.",
    href: "https://api.sejm.gov.pl/sejm/term10/interpellations/attachment/ATTDWNFCE/i18679-o1.pdf",
    source: "Ministry reply",
  },
  {
    date: "1 June 2026",
    place: "Germany",
    body: "Saxony-Anhalt ministry, on the new market surveillance authority",
    kind: "Official statement, no outcome reported",
    text: "The ministry said the authority's work includes handling almost 700 notifications. The release reports no fine.",
    href: "https://presse.sachsen-anhalt.de/ministerium-fur-arbeit-soziales-gesundheit-und-gleichstellung/2026/06/01/zugang-zu-modernen-produkten-und-dienstleistungen-fuer-alle-neue-marktueberwachungsbehoerde-in-magdeburg-formiert-sich",
    source: "Ministry release",
  },
]

const reportLinks = [
  { href: "#register", label: "Register" },
  { href: "#actions", label: "Traced actions" },
  { href: "#method", label: "Method" },
  { href: "#faq", label: "Questions" },
  { href: "#download-report", label: "Downloads" },
]

const linkClass =
  "font-medium text-teal-800 underline underline-offset-2 hover:no-underline dark:text-teal-300"

export default function EaaPenaltiesPage() {
  const dateModified = getRouteDate("/research/eaa-penalties") ?? "2026-11-01"

  return (
    <>
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "Research", url: "https://accessibility.build/research" },
          { name: pageTitle, url: pageUrl },
        ]}
      />
      <ArticleStructuredData
        headline={pageTitle}
        description="Maximum penalties under each EU Member State's European Accessibility Act law, split by enforcement route, with the provision quoted and the verification status shown."
        author={{
          name: "Khushwant Parihar",
          url: "https://accessibility.build/authors/khushwant-parihar",
        }}
        authorType="Person"
        publisher={{
          name: "Accessibility.build",
          logo: "https://accessibility.build/android-chrome-512x512.png",
        }}
        datePublished="2026-11-01"
        dateModified={dateModified}
        image={`https://accessibility.build/api/og?title=${encodeURIComponent(pageTitle)}&section=Research`}
        url={pageUrl}
        keywords={["EAA fines by country", "European Accessibility Act penalties"]}
      />

      <div className="min-h-screen bg-white pt-12 text-slate-950 dark:bg-slate-950 dark:text-white">
        <ReportHero
          breadcrumbLabel="EAA penalties"
          title={pageTitle}
          lede="What each EU state's law says about penalties under the European Accessibility Act. Each country is split by enforcement route, with the provision quoted and a plain label showing how far we verified it."
          badges={["Research register", "Directive (EU) 2019/882", "27 Member States", "Checked: Oct 31, 2026"]}
          headline={`We read the penalty provisions for ${fullyVerified.length} of 27 states in full. The rest are partly verified or marked as not verified. We found no fine issued by a national regulator under an EAA law as of ${checkedLabel}.`}
          sourceName="National legislation, linked per country"
          sourceUrl="https://eur-lex.europa.eu/legal-content/EN/NIM/?uri=CELEX:32019L0882"
          sourceNote="Not legal advice. Translations are ours and unofficial."
          metrics={[
            { label: "States fully verified", value: `${fullyVerified.length} of 27`, icon: Landmark },
            { label: "Routes verified", value: `${verifiedRoutes} of ${routes.length}`, icon: FileCheck2 },
            { label: "States with no text read", value: String(notRead.length), icon: Scale },
            { label: "Last checked", value: "31 Oct 2026", icon: CalendarClock },
          ]}
        />

        <ReportSectionNav links={reportLinks} />

        <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <section aria-labelledby="read-heading" className="max-w-3xl">
            <h2 id="read-heading" className="text-2xl font-semibold">
              How to read this register
            </h2>
            <p className="mt-4 leading-7 text-slate-700 dark:text-slate-300">
              A maximum penalty belongs to a route, not to a country. The same state can use different
              regulators, different acts and very different amounts for products, e-commerce, banking
              and telecoms. A maximum in the law also says nothing about what anyone has actually been
              fined.
            </p>
            <ul className="mt-4 space-y-2 leading-7 text-slate-700 dark:text-slate-300">
              <li>
                <strong>Verified:</strong> we read the provision and any act it relies on, at a source
                named in the row.
              </li>
              <li>
                <strong>Partly verified:</strong> we read part of it. The note says what is missing, or
                that the figure rests on a legal reading.
              </li>
              <li>
                <strong>Not verified:</strong> we could not read it, so we give no figure.
              </li>
            </ul>
          </section>

          <section id="register" aria-labelledby="register-heading" className="mt-14 scroll-mt-40">
            <h2 id="register-heading" className="text-2xl font-semibold">
              Penalties by Member State
            </h2>
            <nav aria-label="Jump to a country" className="mt-5">
              <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                {states.map((state) => (
                  <li key={state.code}>
                    <a href={`#${state.code.toLowerCase()}`} className={linkClass}>
                      {state.name}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="mt-8 space-y-10">
              {states.map((state) => {
                const status = stateStatus(state)
                return (
                  <article
                    key={state.code}
                    id={state.code.toLowerCase()}
                    aria-labelledby={`${state.code}-heading`}
                    className="scroll-mt-40 border-t border-slate-200 pt-6 dark:border-slate-800"
                  >
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 id={`${state.code}-heading`} className="text-xl font-semibold">
                        {state.name}
                      </h3>
                      <StatusLabel status={status} />
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
                      <strong>Law:</strong>{" "}
                      {state.lawUrl ? (
                        <a href={state.lawUrl} className={linkClass}>
                          {state.law}
                        </a>
                      ) : (
                        state.law
                      )}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-slate-700 dark:text-slate-300">
                      <strong>Authority:</strong> {state.authorities}
                    </p>

                    <ul className="mt-4 space-y-4">
                      {state.routes.map((route, index) => (
                        <li
                          key={`${state.code}-${index}`}
                          className="rounded-lg border border-slate-200 p-4 dark:border-slate-800"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <p className="min-w-0 max-w-3xl font-medium [overflow-wrap:anywhere]">
                              {route.scope}
                            </p>
                            <StatusLabel status={route.status as Status} />
                          </div>
                          <dl className="mt-3 grid gap-x-6 gap-y-2 text-sm leading-6 sm:grid-cols-[9rem_1fr]">
                            <dt className="font-semibold">Maximum</dt>
                            <dd className="min-w-0 [overflow-wrap:anywhere]">
                              {route.maximum ?? "No figure given"}
                            </dd>
                            {route.penaltyType && route.penaltyType !== "other" ? (
                              <>
                                <dt className="font-semibold">Type</dt>
                                <dd className="min-w-0">{route.penaltyType}</dd>
                              </>
                            ) : null}
                            {route.provision ? (
                              <>
                                <dt className="font-semibold">Provision</dt>
                                <dd className="min-w-0 [overflow-wrap:anywhere]">
                                  {route.sourceUrl ? (
                                    <a href={route.sourceUrl} className={linkClass}>
                                      {route.provision}
                                    </a>
                                  ) : (
                                    route.provision
                                  )}
                                </dd>
                              </>
                            ) : null}
                            {route.quote ? (
                              <>
                                <dt className="font-semibold">Text</dt>
                                <dd className="min-w-0 [overflow-wrap:anywhere]">
                                  <q lang={quoteLang[state.code]}>{route.quote}</q>
                                  {route.translation && quoteLang[state.code] !== "en" ? (
                                    <span className="mt-1 block text-slate-600 dark:text-slate-400">
                                      Our translation: {route.translation}
                                    </span>
                                  ) : null}
                                </dd>
                              </>
                            ) : null}
                            {route.note ? (
                              <>
                                <dt className="font-semibold">Note</dt>
                                <dd className="min-w-0 text-slate-600 [overflow-wrap:anywhere] dark:text-slate-400">
                                  {route.note}
                                </dd>
                              </>
                            ) : null}
                          </dl>
                        </li>
                      ))}
                    </ul>
                  </article>
                )
              })}
            </div>
          </section>

          <section id="actions" aria-labelledby="actions-heading" className="mt-16 scroll-mt-40">
            <h2 id="actions-heading" className="text-2xl font-semibold">
              Actions we traced to a source
            </h2>
            <p className="mt-4 max-w-3xl leading-7 text-slate-700 dark:text-slate-300">
              This is a short list of what we read ourselves, not a complete record. For a fuller,
              community-maintained list, see the{" "}
              <a
                href="https://github.com/Nordic-Accessibility-Community-Group/working-with-EN-301-549/blob/main/EAA%20enforcement%20tracking.md"
                className={linkClass}
              >
                Nordic Accessibility Community Group&apos;s EAA enforcement tracking
              </a>
              . A named company appears here only because a published decision names it. Each order
              describes that site on that date, not today.
            </p>
            <ul className="mt-6 divide-y divide-slate-200 border-y border-slate-200 dark:divide-slate-800 dark:border-slate-800">
              {ledger.map((item) => (
                <li key={item.body} className="py-5">
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                    {item.date} · {item.place} · {item.kind}
                  </p>
                  <h3 className="mt-1 font-semibold">{item.body}</h3>
                  <p className="mt-1.5 max-w-3xl text-sm leading-6 text-slate-700 dark:text-slate-300">
                    {item.text}{" "}
                    <a href={item.href} className={linkClass}>
                      {item.source}
                    </a>
                  </p>
                </li>
              ))}
            </ul>
            <p className="mt-6 max-w-3xl text-sm leading-6 text-slate-700 dark:text-slate-300">
              <strong>Outside the EAA:</strong> in December 2025 Norway&apos;s regulator Uu-tilsynet
              set a{" "}
              <a
                href="https://www.uutilsynet.no/tilsyn/pressemelding-helseplattformen-risikerer-dagboter/3102"
                className={linkClass}
              >
                NOK 50,000 daily fine risk against Helseplattformen
              </a>{" "}
              under Norwegian equality law. Its release does not mention the EAA, so this is not an EAA
              case.
            </p>
          </section>

          <section id="method" aria-labelledby="method-heading" className="mt-16 max-w-3xl scroll-mt-40">
            <h2 id="method-heading" className="text-2xl font-semibold">
              Method and limits
            </h2>
            <ul className="mt-4 list-disc space-y-2 pl-5 leading-7 text-slate-700 dark:text-slate-300">
              <li>
                Figures come from legal texts we downloaded or opened on or around {checkedLabel}. Each
                quotation was checked word for word against the downloaded text. Vendor pages were
                never used as evidence.
              </li>
              <li>
                Amounts stay in the original currency. France&apos;s EUR 7,500 and EUR 15,000 are our
                arithmetic from the articles, as the row says.
              </li>
              <li>
                Later amendments were not checked for every act. The notes say where this matters.
              </li>
              <li>
                {notRead.map((state) => state.name).join(", ")}: the official sites blocked automated
                access or did not connect, so we give no figure.
              </li>
              <li>
                Competent authorities are listed only as far as we read them. Check the national law
                for your sector.
              </li>
              <li>
                A{" "}
                <a
                  href="https://github.com/Nordic-Accessibility-Community-Group/working-with-EN-301-549/blob/main/EAA%20sanctions.md"
                  className={linkClass}
                >
                  community sanctions table
                </a>{" "}
                helped us find some laws, and{" "}
                <a href="https://www.complyloft.com/accessibility/eaa/enforcement" className={linkClass}>
                  ComplyLoft
                </a>{" "}
                keeps a separate tracker. Neither was used to verify a figure here.
              </li>
              <li>
                Found an error? Tell us through the{" "}
                <a href="/contact" className={linkClass}>
                  contact page
                </a>
                . See also our{" "}
                <a href="/corrections-policy" className={linkClass}>
                  corrections policy
                </a>
                .
              </li>
            </ul>
          </section>

          <div id="faq" className="mt-16 scroll-mt-40">
            <FaqSection faqs={faqs} />
          </div>

          <div id="download-report" className="mt-16 scroll-mt-40">
            <DatasetDownloads
              dataset="eaa-penalties"
              name="EAA penalties by Member State"
              description="Maximum penalties under national European Accessibility Act laws, by enforcement route, with provision, quotation and verification status."
              pageUrl={pageUrl}
              datePublished="2026-11-01"
              dateModified={dateModified}
              temporalCoverage="2026"
              attribution="National legislation of the EU Member States, compiled by Accessibility.build"
              tables={[{ key: "routes", label: "Penalty routes" }]}
            />
          </div>

          <div className="mt-12">
            <RelatedContent
              content="European Accessibility Act EAA fines penalties enforcement member states transposition compliance"
              maxItems={3}
            />
          </div>
        </div>
      </div>
    </>
  )
}

function StatusLabel({ status }: { status: Status }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded border px-2 py-0.5 text-xs font-semibold",
        statusClasses[status],
      )}
    >
      {statusLabels[status]}
    </span>
  )
}
