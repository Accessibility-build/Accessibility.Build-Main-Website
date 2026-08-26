import type { Metadata } from "next";
import { Brain, CalendarDays, Users } from "lucide-react";
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
import disabilityData from "@/lib/data/disability-statistics.json";
import { DisabilityStatisticsClient } from "./DisabilityStatisticsClient";

const reportUrl = "https://accessibility.build/research/disability-statistics";
const pageTitle = "US Disability Prevalence";

export const metadata: Metadata = {
  title: "Disability Statistics 2026 | How Many People Have a Disability",
  description:
    "28.7% of US adults, about 73.4 million people, report a disability. Prevalence by type (cognitive, mobility, independent living, hearing, vision, self-care) plus the 2016 to 2022 trend, from CDC BRFSS data.",
  keywords: [
    "disability statistics",
    "how many people have a disability",
    "US disability prevalence",
    "CDC disability data",
    "disability by type",
    "cognitive disability statistics",
    "vision impairment statistics",
    "hearing loss statistics",
    "percentage of adults with disabilities",
  ],
  authors: [{ name: "Accessibility.build", url: "https://accessibility.build" }],
  creator: "Accessibility.build",
  publisher: "Accessibility.build",
  alternates: { canonical: reportUrl },
  openGraph: {
    title: pageTitle,
    description:
      "Disability prevalence among US adults by type, with the 2016 to 2022 trend, from CDC BRFSS data.",
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
        alt: "US disability prevalence research report",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description:
      "28.7% of US adults report a disability. Prevalence by type and the 2016 to 2022 trend.",
  },
};

const faqs = [
  {
    question: "What percentage of adults have a disability?",
    answer:
      "28.7% of United States adults aged 18 and over reported a disability in 2022, which is roughly 1 in 4 and an estimated 73.4 million people. That is the age-adjusted prevalence from the CDC Disability and Health Data System, based on the Behavioral Risk Factor Surveillance System survey. The 95% confidence interval is 28.4% to 29.0%.",
  },
  {
    question: "What is the most common type of disability?",
    answer:
      "Cognitive disability is now the most commonly reported type among US adults at 13.9%, an estimated 33.2 million people. Mobility follows at 12.2%, then independent living at 7.7%, hearing at 6.2%, vision at 5.5%, and self-care at 3.6%. Cognitive disability overtook mobility during this period and has grown faster than any other category.",
  },
  {
    question: "Can I add the disability type percentages together?",
    answer:
      "No. The categories overlap because a person can report more than one type of disability, so the individual percentages sum to well over the 28.7% who report any disability. Adding them produces a badly inflated number. If you need a total, use the any-disability figure of 28.7%. Be sceptical of any source that presents a summed total.",
  },
  {
    question: "Why does disability prevalence dip in 2020?",
    answer:
      "The 2020 dip appears across every disability type and reverses in 2021, which is the signature of a data collection artifact rather than a real change. The Behavioral Risk Factor Surveillance System changed how it collected data during the pandemic year. Treat 2020 as a break in the series rather than as evidence that fewer people had disabilities that year.",
  },
  {
    question: "What does age-adjusted prevalence mean?",
    answer:
      "Age adjustment standardises the figures against a reference age distribution so that different years and different places can be compared without the result being driven by one population simply being older. Because disability becomes more common with age, an unadjusted figure for an older population would look higher even if nothing else differed. Age-adjusted figures will not match crude prevalence numbers from other sources, so do not mix the two in the same comparison.",
  },
  {
    question: "How should accessibility teams use this data?",
    answer:
      "Mainly as a corrective to where effort usually goes. Accessibility work tends to concentrate on screen reader support, but vision is the smallest of the major categories at 5.5%, while cognitive disability is the largest at 13.9% and growing. That argues for investing in plain language, consistent navigation, generous timeouts, forgiving forms, and reduced cognitive load alongside the ARIA work, since those serve the largest and fastest-growing group and are poorly covered by automated testing.",
  },
];

const reportLinks = [
  { href: "#summary", label: "Summary" },
  { href: "#types", label: "By type" },
  { href: "#trend", label: "Trend" },
  { href: "#interpretation", label: "Interpretation" },
  { href: "#methodology", label: "Methodology" },
  { href: "#downloads", label: "Downloads" },
];

export default function DisabilityStatisticsPage() {
  const any = disabilityData.types.find((type) => type.id === "any");
  const cognitive = disabilityData.types.find(
    (type) => type.id === "cognitive",
  );
  const first = disabilityData.trend[0];
  const last = disabilityData.trend[disabilityData.trend.length - 1];

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
        headline="US Disability Prevalence"
        description="Age-adjusted prevalence of disability among United States adults by type, with the 2016 to 2022 trend, from CDC Disability and Health Data System BRFSS data."
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
        dateModified="2026-08-27"
        image="https://accessibility.build/og-image.png"
        url={reportUrl}
        wordCount={1700}
        keywords={[
          "disability statistics",
          "disability prevalence",
          "CDC BRFSS",
          "cognitive disability",
        ]}
      />
      <FAQStructuredData faqs={faqs} />

      <div className="min-h-screen bg-white pt-12 text-slate-950 dark:bg-slate-950 dark:text-white">
        <ReportHero
          breadcrumbLabel="Disability statistics"
          title="US Disability Prevalence"
          lede="How many adults report a disability, which types are most common, and how that has shifted since 2016. The numbers most accessibility business cases are built on, with the caveats that usually get dropped."
          badges={[
            "Research report",
            `Data year ${disabilityData.dataYear}`,
            "Public domain source",
            "Reviewed: Aug 27, 2026",
          ]}
          headline={`${any?.prevalence}% of United States adults report a disability, about ${((any?.adults ?? 0) / 1_000_000).toFixed(1)} million people. Cognitive disability is now the largest category at ${cognitive?.prevalence}%, having overtaken mobility and grown faster than any other type.`}
          sourceName={disabilityData.source.name}
          sourceUrl={disabilityData.source.url}
          sourceNote="Age-adjusted prevalence from BRFSS. Disability types overlap and must not be summed."
          metrics={[
            {
              label: "Adults with a disability",
              value: `${any?.prevalence}%`,
              icon: Users,
            },
            {
              label: "Estimated people",
              value: `${((any?.adults ?? 0) / 1_000_000).toFixed(1)}M`,
              icon: Users,
            },
            {
              label: "Largest type",
              value: `Cognitive ${cognitive?.prevalence}%`,
              icon: Brain,
            },
            {
              label: "Latest data year",
              value: String(disabilityData.dataYear),
              icon: CalendarDays,
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
                  The audience is larger and different than assumed
                </h2>
                <p className="mt-5 max-w-[68ch] leading-7 text-slate-600 dark:text-slate-400">
                  More than one in four United States adults reports a
                  disability. The composition is the part that tends to surprise
                  teams: cognitive disability is the largest single category and
                  the fastest growing, while vision, where most accessibility
                  effort concentrates, is the smallest of the major types.
                </p>
                <p className="mt-4 max-w-[68ch] text-sm leading-6 text-slate-500 dark:text-slate-400">
                  This is public domain federal data, pulled directly from the
                  CDC data API rather than transcribed from a secondary source.
                </p>
              </div>

              <div className="divide-y divide-slate-200 border-y border-slate-200 dark:divide-slate-800 dark:border-slate-800 lg:col-span-7">
                {[
                  [
                    "01",
                    "More than 1 in 4 adults",
                    `${any?.prevalence}% report a disability, an estimated ${(any?.adults ?? 0).toLocaleString()} people, up from ${first.any}% in ${first.year}.`,
                  ],
                  [
                    "02",
                    "Cognitive is now the largest type",
                    `${cognitive?.prevalence}% in ${last.year}, up from ${first.cognitive}% in ${first.year}. It overtook mobility, which stayed roughly flat.`,
                  ],
                  [
                    "03",
                    "Do not add the categories up",
                    "People report multiple disability types, so the individual figures overlap. Only the any-disability number is a valid total.",
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
            <DisabilityStatisticsClient initialData={disabilityData} />
          </div>

          <section
            className="mt-16 scroll-mt-40 border-t border-slate-200 pt-12 sm:mt-20 dark:border-slate-800"
            aria-labelledby="faq-heading"
          >
            <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-4">
                <p className="text-sm font-semibold text-teal-700 dark:text-teal-300">
                  Questions about the data
                </p>
                <h2
                  id="faq-heading"
                  className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white"
                >
                  Frequently asked questions
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  How to quote these figures without misrepresenting them.
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
              content="disability statistics prevalence cognitive vision hearing mobility accessibility business case WCAG contrast reflow plain language keyboard"
              maxItems={3}
            />
          </div>
        </div>
      </div>
    </>
  );
}
