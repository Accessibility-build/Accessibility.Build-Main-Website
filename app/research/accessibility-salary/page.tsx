import type { Metadata } from "next";
import { Banknote, Globe2, TrendingUp, Users } from "lucide-react";
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
import salaryData from "@/lib/data/accessibility-salary.json";
import { AccessibilitySalaryClient } from "./AccessibilitySalaryClient";

const reportUrl = "https://accessibility.build/research/accessibility-salary";
const pageTitle = "Digital Accessibility Salary Report";

export const metadata: Metadata = {
  title: "Accessibility Salary Report 2026 | What A11y Professionals Earn",
  description:
    "Digital accessibility professionals averaged $101,688 in 2026, with a 36% premium past ten years of experience. Pay by country, experience, work location, organisation size, and role.",
  keywords: [
    "accessibility salary",
    "digital accessibility salary",
    "a11y salary",
    "accessibility specialist salary",
    "accessibility consultant rates",
    "web accessibility jobs pay",
    "accessibility career",
    "WebAIM salary survey",
  ],
  authors: [{ name: "Accessibility.build", url: "https://accessibility.build" }],
  creator: "Accessibility.build",
  publisher: "Accessibility.build",
  alternates: { canonical: reportUrl },
  openGraph: {
    title: pageTitle,
    description:
      "What digital accessibility professionals earn by country, experience, work location, and organisation size.",
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
        alt: "Digital accessibility salary research report",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description:
      "Digital accessibility professionals averaged $101,688 in 2026, with a 36% premium past ten years of experience.",
  },
};

const faqs = [
  {
    question: "How much do digital accessibility professionals earn?",
    answer:
      "Full-time digital accessibility professionals reported an average salary of $101,688 US dollars, with a median of $94,394, in a survey conducted in December 2025 and January 2026. Pay varies widely by country: United States respondents averaged $121,083, Australia $96,097, Canada $86,597, the United Kingdom $82,917, and the European Union $82,181, all converted to US dollars at January 2026 rates.",
  },
  {
    question: "Did accessibility salaries fall in 2026?",
    answer:
      "The reported average fell from $109,542 to $101,688, but that is very unlikely to be a real pay cut. WebAIM attributes most of the shift to the 2026 survey having fewer respondents with 25 or more years of experience and tenure, both of which correlate with higher salaries. With 300 uncontrolled, self-selected responses, who happens to answer moves the average more than the market does. Treat it as a change in sample composition, not evidence of falling rates.",
  },
  {
    question: "What increases an accessibility salary the most?",
    answer:
      "Experience, by a clear margin. Respondents with more than ten years in digital accessibility averaged $123,078 against $90,544 for those with ten years or fewer, a gap of about 36%. Organisation size matters too: $113,421 at organisations with 10,000 or more employees against $85,147 at those with fewer than 100. Fully remote respondents averaged $109,852 against $76,008 for in-office, though that gap likely reflects remote roles skewing senior and US-based rather than a premium for working from home.",
  },
  {
    question: "Is digital accessibility a good career?",
    answer:
      "The pay data is solid for a specialism that most people enter sideways from development, design, QA, or content roles, and the experience premium suggests seniority is genuinely rewarded rather than capped. Two thirds of respondents had ten years or fewer in the field, which indicates it is still growing and absorbing people. Bear in mind that this survey reflects people already established enough to be surveyed by WebAIM, so it says little about how hard the first role is to get.",
  },
  {
    question: "How many accessibility professionals have disabilities?",
    answer:
      "60.7% of respondents reported having a disability, far above the roughly 28.7% prevalence among United States adults generally. Neurodivergent respondents were the largest single group at 31.7%, followed by medical or chronic health conditions at 14.0% and psychological or psychiatric at 11.0%. This is a field substantially staffed by the people it serves, which is worth remembering when designing hiring processes and workplace accommodations for accessibility teams.",
  },
  {
    question: "How reliable is this salary data?",
    answer:
      "Treat it as directional rather than precise. WebAIM states plainly that the sample was not controlled and may not represent everyone in the field. There were 300 responses across 23 countries, so once you slice by country the cells get thin quickly, and only locations with more than ten respondents are reported at all. Salaries were converted at January 2026 exchange rates, so cross-country comparisons move with currency as well as with pay. It is the best public data available on this question, which is not the same as being authoritative.",
  },
];

const reportLinks = [
  { href: "#summary", label: "Summary" },
  { href: "#how-to-read", label: "How to read it" },
  { href: "#location", label: "By country" },
  { href: "#drivers", label: "Interpretation" },
  { href: "#segments", label: "By segment" },
  { href: "#methodology", label: "Methodology" },
  { href: "#downloads", label: "Downloads" },
];

export default function AccessibilitySalaryPage() {
  const { overall, byLocation, byExperience } = salaryData;

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
        headline="Digital Accessibility Salary Report 2026"
        description="What digital accessibility professionals earn by country, experience, work location, organisation size, and role, from the WebAIM Global Digital Accessibility Salary Survey."
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
          "accessibility salary",
          "digital accessibility career",
          "a11y jobs",
          "WebAIM salary survey",
        ]}
      />
      <FAQStructuredData faqs={faqs} />

      <div className="min-h-screen bg-white pt-12 text-slate-950 dark:bg-slate-950 dark:text-white">
        <ReportHero
          breadcrumbLabel="Salary report"
          title="Digital Accessibility Salary Report"
          lede={`What people working in digital accessibility earn, by country, experience, work location, and organisation size. Based on ${salaryData.responses} responses across ${salaryData.countriesRepresented} countries.`}
          badges={[
            "Research report",
            `Survey ${salaryData.surveyPeriod}`,
            `${salaryData.responses} responses`,
            "Reviewed: Aug 27, 2026",
          ]}
          headline={`Full-time digital accessibility professionals averaged $${overall.averageSalaryUsd.toLocaleString()}, but experience is what separates the field: past ten years the average jumps to $${(byExperience[1].averageUsd ?? 0).toLocaleString()}, a ${salaryData.experienceGapPercent}% premium.`}
          sourceName={salaryData.source.name}
          sourceUrl={salaryData.source.url}
          sourceNote="Self-selected sample of 300, not controlled. Directional rather than precise."
          metrics={[
            {
              label: "Average full-time",
              value: `$${overall.averageSalaryUsd.toLocaleString()}`,
              icon: Banknote,
            },
            {
              label: "Median full-time",
              value: `$${overall.medianSalaryUsd.toLocaleString()}`,
              icon: Banknote,
            },
            {
              label: "Experience premium",
              value: `${salaryData.experienceGapPercent}%`,
              icon: TrendingUp,
            },
            {
              label: "Report a disability",
              value: `${overall.percentReportingDisability}%`,
              icon: Users,
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
                  A specialism that pays for staying in it
                </h2>
                <p className="mt-5 max-w-[68ch] leading-7 text-slate-600 dark:text-slate-400">
                  Digital accessibility is still a young field. Two thirds of
                  respondents have ten years or fewer in it, and the average
                  practitioner is nine and a half years in. The pay structure
                  reflects that: the single biggest jump comes from crossing ten
                  years, not from a job title or a certification.
                </p>
                <p className="mt-4 max-w-[68ch] text-sm leading-6 text-slate-500 dark:text-slate-400">
                  {overall.percentReportingDisability}% of respondents reported
                  having a disability, more than double the prevalence among US
                  adults generally.
                </p>
              </div>

              <div className="divide-y divide-slate-200 border-y border-slate-200 dark:divide-slate-800 dark:border-slate-800 lg:col-span-7">
                {[
                  [
                    "01",
                    "Experience is the dividing line",
                    `$${(byExperience[1].averageUsd ?? 0).toLocaleString()} past ten years against $${(byExperience[0].averageUsd ?? 0).toLocaleString()} below it, a ${salaryData.experienceGapPercent}% gap.`,
                  ],
                  [
                    "02",
                    "Geography sets the base",
                    `United States respondents averaged $${byLocation[0].averageUsd.toLocaleString()}, roughly 46% above the United Kingdom and European Union figures once converted to dollars.`,
                  ],
                  [
                    "03",
                    "The headline average is noisy",
                    `It fell from $${overall.previousAverageUsd.toLocaleString()} year over year, which WebAIM attributes to sample composition rather than falling pay.`,
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
            <AccessibilitySalaryClient initialData={salaryData} />
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
                  What the survey supports, and where it is thin.
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
              content="accessibility salary career jobs digital accessibility professional experience remote work certification audit screen reader testing"
              maxItems={3}
            />
          </div>
        </div>
      </div>
    </>
  );
}
