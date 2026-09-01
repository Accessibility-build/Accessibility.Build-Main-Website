import type { Metadata } from "next";
import { CalendarClock, FileCheck2, Landmark, Scale } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArticleStructuredData,
  BreadcrumbStructuredData,
  FAQStructuredData,
} from "@/components/seo/structured-data";
import { RelatedContent } from "@/components/seo/related-content";
import {
  ReportHero,
  ReportSectionNav,
} from "@/components/research/report-hero";
import eaaData from "@/lib/data/european-accessibility-act.json";
import { EuropeanAccessibilityActClient } from "./EuropeanAccessibilityActClient";
import { getRouteDate } from "@/lib/site-routes"
import { clampDescription } from "@/lib/metadata"

const reportUrl =
  "https://accessibility.build/research/european-accessibility-act";
const pageTitle = "European Accessibility Act Tracker";

export const metadata: Metadata = {
  title: "European Accessibility Act Tracker 2026: Transposition",
  description:
    clampDescription("Every EAA date quoted from Directive (EU) 2019/882, plus national transposition measures for all 27 Member States. Includes the honest answer on enforcement data: the first Commission report is not due until 2030."),
  keywords: [
    "European Accessibility Act",
    "EAA deadline",
    "EAA transposition",
    "Directive 2019/882",
    "EAA enforcement",
    "EAA member states",
    "28 June 2025 accessibility",
    "EU accessibility law",
  ],
  authors: [{ name: "Accessibility.build", url: "https://accessibility.build" }],
  creator: "Accessibility.build",
  publisher: "Accessibility.build",
  alternates: { canonical: reportUrl },
  openGraph: {
    title: pageTitle,
    description:
      "EAA statutory dates quoted from the Directive, plus transposition measures for all 27 Member States.",
    url: reportUrl,
    type: "article",
    publishedTime: "2026-08-03T00:00:00Z",
    modifiedTime: "2026-08-27T00:00:00Z",
    authors: ["https://accessibility.build"],
    images: [
      {
        url: `/api/og?title=${encodeURIComponent(pageTitle)}&section=Research`,
        width: 1200,
        height: 630,
        alt: "European Accessibility Act tracker research report",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description:
      "EAA dates from the Directive itself, transposition by Member State, and why no enforcement data exists yet.",
  },
};

const faqs = [
  {
    question: "When did the European Accessibility Act come into force?",
    answer:
      "Article 31(2) of Directive (EU) 2019/882 states that Member States shall apply their implementing measures from 28 June 2025. That is the date the obligations began to apply to in-scope products and services. The separate transposition deadline, by which Member States had to adopt and publish their national laws, was 28 June 2022 under Article 31(1). The Directive itself was adopted on 17 April 2019 and published in OJ L 151 on 7 June 2019.",
  },
  {
    question: "Have all EU Member States transposed the EAA?",
    answer:
      "All 27 Member States have communicated national transposition measures to the European Commission, 378 instruments in total as recorded by EUR-Lex. That confirms each country has notified something, but it is not evidence that transposition is complete or correct. EUR-Lex states explicitly that Member States bear sole responsibility for this information and that it does not prejudge the Commission's verification of completeness and correctness.",
  },
  {
    question: "Which country has done the most to implement the EAA?",
    answer:
      "You cannot tell that from measure counts, and it would be a mistake to try. Germany has communicated 59 instruments while Ireland, Cyprus, and Malta have each communicated one. That difference reflects legislative drafting style rather than effort: a country that transposes through a single consolidated act shows one measure, while a country that amends dozens of existing sectoral laws shows dozens. Treat the counts as a record of notification, not a league table.",
  },
  {
    question: "How many companies are complying with the EAA?",
    answer:
      "Nobody knows, and no official source can tell you. There is no EU-wide compliance or enforcement dataset for the European Accessibility Act. Article 33(1) requires the Commission to report on the application of the Directive by 28 June 2030 and every five years after that, so the first authoritative picture is four years away. Most claims about enforcement activity circulate from companies selling remediation services, but two developments do trace to primary sources as of our 27 August 2026 review: a June 2026 ruling of the Tribunal judiciaire de Caen ordering Carrefour to make its site and app fully accessible, and a March 2026 report by the Dutch regulator ACM finding 61% of the largest Dutch webshops inaccessible. Neither is a fine, and no monetary penalty under an EAA transposition law has been confirmed.",
  },
  {
    question: "What are the remaining EAA deadlines?",
    answer:
      "Three dates are still ahead. Under Article 31(3), Member States may defer the obligations in Article 4(8) until 28 June 2027 at the latest. Under Article 32(1), a transitional period runs until 28 June 2030 during which service providers may continue using products they lawfully used before the application date, and service contracts agreed before 28 June 2025 may run unaltered until they expire but no longer than five years. Under Article 32(2), self-service terminals lawfully in use before 28 June 2025 may continue until the end of their economically useful life, capped at 20 years from entry into use.",
  },
  {
    question: "Does the EAA apply to companies outside the EU?",
    answer:
      "The Directive applies to products placed on the EU market and services provided to consumers in the EU, regardless of where the provider is established. A United States or United Kingdom company selling to EU consumers can therefore be in scope. For the detail on scope, the microenterprise exemption, and the technical route to compliance through EN 301 549, see our European Accessibility Act compliance guide, which covers requirements rather than the legislative tracking on this page.",
  },
];

const reportLinks = [
  { href: "#summary", label: "Summary" },
  { href: "#timeline", label: "Timeline" },
  { href: "#enforcement", label: "Enforcement data" },
  { href: "#transposition", label: "Transposition" },
  { href: "#methodology", label: "Methodology" },
  { href: "#downloads", label: "Downloads" },
];

export default function EuropeanAccessibilityActPage() {
  const { transposition, directive } = eaaData;
  const upcoming = eaaData.keyDates.filter((item) => item.status === "future");

  return (
    <>
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "Research", url: "https://accessibility.build/research" },
          { name: pageTitle, url: reportUrl },
        ]}
      />
      <ArticleStructuredData
        headline="European Accessibility Act Tracker 2026"
        description="Statutory dates quoted from Directive (EU) 2019/882, national transposition measures for all 27 EU Member States, and the status of EAA enforcement data."
        author={{
          name: "Accessibility.build",
          url: "https://accessibility.build",
        }}
        authorType="Organization"
        publisher={{
          name: "Accessibility.build",
          logo: "https://accessibility.build/android-chrome-512x512.png",
        }}
        datePublished="2026-08-03"
        dateModified={getRouteDate("/research/european-accessibility-act") ?? "2026-08-27"}
        image="https://accessibility.build/og-image.png"
        url={reportUrl}
        wordCount={1800}
        keywords={[
          "European Accessibility Act",
          "Directive 2019/882",
          "EAA transposition",
          "EU accessibility law",
        ]}
      />
      <FAQStructuredData faqs={faqs} />

      <div className="min-h-screen bg-white pt-12 text-slate-950 dark:bg-slate-950 dark:text-white">
        <ReportHero
          breadcrumbLabel="European Accessibility Act"
          title="European Accessibility Act Tracker"
          lede="Every statutory date quoted from the Directive itself, national transposition measures for all 27 Member States, and a straight answer about what enforcement data does and does not exist."
          badges={[
            "Research report",
            "Directive (EU) 2019/882",
            `${transposition.memberStatesReporting} Member States`,
            "Reviewed: Aug 27, 2026",
          ]}
          headline={`All ${transposition.memberStatesReporting} Member States have communicated transposition measures, ${transposition.totalMeasures} instruments in total. But there is no EU-wide compliance or enforcement dataset, and under Article 33 the first Commission report is not due until 28 June 2030.`}
          sourceName="EUR-Lex, Directive (EU) 2019/882"
          sourceUrl={directive.textUrl}
          sourceNote="Dates quoted from the Directive text. Measure counts are notifications, not a compliance score."
          metrics={[
            {
              label: "Application date",
              value: "28 Jun 2025",
              icon: CalendarClock,
            },
            {
              label: "Member States reporting",
              value: `${transposition.memberStatesReporting} of 27`,
              icon: Landmark,
            },
            {
              label: "Measures communicated",
              value: String(transposition.totalMeasures),
              icon: FileCheck2,
            },
            {
              label: "First EU report due",
              value: "28 Jun 2030",
              icon: Scale,
            },
          ]}
        />

        <ReportSectionNav links={reportLinks} />

        <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <section
            id="summary"
            aria-labelledby="summary-heading"
            className="scroll-mt-40"
          >
            <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-5">
                <p className="text-sm font-semibold text-teal-700 dark:text-teal-300">
                  Executive summary
                </p>
                <h2
                  id="summary-heading"
                  className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white"
                >
                  The law landed. The evidence has not.
                </h2>
                <p className="mt-5 max-w-[68ch] leading-7 text-slate-600 dark:text-slate-400">
                  The European Accessibility Act has applied since June 2025 and
                  every Member State has notified national measures. What does
                  not exist, and will not for years, is any official picture of
                  whether it is working. That gap is being filled by vendor
                  marketing, so this page states plainly what is documented and
                  what is not.
                </p>
                <p className="mt-4 max-w-[68ch] text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Every date below is quoted from the Directive on EUR-Lex,
                  article by article.
                </p>
              </div>

              <div className="divide-y divide-slate-200 border-y border-slate-200 dark:divide-slate-800 dark:border-slate-800 lg:col-span-7">
                {[
                  [
                    "01",
                    "Applying since 28 June 2025",
                    "Article 31(2). The transposition deadline three years earlier, 28 June 2022, is a different date and is often confused with it.",
                  ],
                  [
                    "02",
                    "All 27 have notified measures",
                    `${transposition.totalMeasures} instruments in total, from 59 in Germany to one each in Ireland, Cyprus and Malta. The spread reflects drafting style, not diligence.`,
                  ],
                  [
                    "03",
                    `${upcoming.length} obligations still ahead`,
                    "Article 4(8) may be deferred to 2027, and transitional cover for existing products, contracts and self-service terminals runs to 2030 and beyond.",
                  ],
                ].map(([number, title, text]) => (
                  <div
                    key={number}
                    className="grid grid-cols-[36px_1fr] gap-4 py-5"
                  >
                    <span className="font-mono text-sm font-semibold text-teal-700 dark:text-teal-300">
                      {number}
                    </span>
                    <div>
                      <h3 className="font-semibold text-slate-950 dark:text-white">
                        {title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-6 text-slate-600 dark:text-slate-400">
                        {text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <div className="mt-16 sm:mt-20">
            <EuropeanAccessibilityActClient initialData={eaaData} />
          </div>

          <section
            className="mt-16 scroll-mt-40 border-t border-slate-200 pt-12 sm:mt-20 dark:border-slate-800"
            aria-labelledby="faq-heading"
          >
            <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-4">
                <p className="text-sm font-semibold text-teal-700 dark:text-teal-300">
                  Questions about the Act
                </p>
                <h2
                  id="faq-heading"
                  className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white"
                >
                  Frequently asked questions
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  Answered from the Directive text and the EUR-Lex record.
                </p>
              </div>
              <div className="lg:col-span-8">
                <Accordion
                  type="single"
                  collapsible
                  className="border-t border-slate-200 dark:border-slate-800"
                >
                  {faqs.map((faq, index) => (
                    <AccordionItem key={faq.question} value={`faq-${index}`}>
                      <AccordionTrigger className="text-left text-base font-semibold hover:no-underline">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="max-w-[72ch] leading-7 text-slate-600 dark:text-slate-400">
                          {faq.answer}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </section>

          <div className="mt-16 sm:mt-20">
            <RelatedContent
              content="European Accessibility Act EAA EN 301 549 EU accessibility law compliance directive transposition member states deadline enforcement"
              maxItems={3}
            />
          </div>
        </div>
      </div>
    </>
  );
}
