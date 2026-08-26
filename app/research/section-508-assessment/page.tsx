import type { Metadata } from "next";
import { Building2, ClipboardCheck, Gauge, ShoppingCart } from "lucide-react";
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
import assessmentData from "@/lib/data/section-508-assessment.json";
import { Section508Client } from "./Section508Client";

const reportUrl =
  "https://accessibility.build/research/section-508-assessment";
const pageTitle = "Section 508 Assessment: How Federal Agencies Scored";

export const metadata: Metadata = {
  title: "Section 508 Assessment FY2025 | Federal Agency Scorecard",
  description:
    "58% of US federal agencies scored Low or Very Low on accessibility conformance, and 62% scored that low on testing and remediation. Full FY2025 governmentwide Section 508 assessment data for all 60 agencies.",
  keywords: [
    "Section 508 assessment",
    "federal agency accessibility",
    "governmentwide Section 508 assessment",
    "Section 508 compliance statistics",
    "federal accessibility scorecard",
    "accessibility conformance index",
    "GSA Section 508 report",
    "government accessibility data",
  ],
  authors: [{ name: "Accessibility.build", url: "https://accessibility.build" }],
  creator: "Accessibility.build",
  publisher: "Accessibility.build",
  alternates: { canonical: reportUrl },
  openGraph: {
    title: pageTitle,
    description:
      "Federal agency accessibility maturity from the FY2025 governmentwide Section 508 assessment, with all 60 agencies scored.",
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
        alt: "Section 508 federal agency assessment research report",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description:
      "58% of US federal agencies scored Low or Very Low on accessibility conformance.",
  },
};

const faqs = [
  {
    question: "What is the governmentwide Section 508 assessment?",
    answer:
      "It is an annual assessment of how well United States federal agencies are meeting their Section 508 obligations, mandated by the Consolidated Appropriations Act, 2023 and run by the General Services Administration. Agencies answer a structured questionnaire covering policy, acquisition, testing, and remediation, and their responses are scored into two indexes: the Accessibility Implementation Index, which measures whether the programme exists, and the Accessibility Conformance Index, which measures whether the technology is actually accessible. GSA publishes the agency response data as open government data.",
  },
  {
    question: "How many federal agencies are failing on accessibility?",
    answer:
      "In the FY2025 assessment, 35 of 60 agencies, or 58.3%, rated Low or Very Low on the Accessibility Conformance Index. Only 14 agencies, 23.3%, rated High or Very High. Those percentages are our own computation from the published agency response data file rather than figures quoted from the GSA narrative, so they can be reproduced directly from the source CSV.",
  },
  {
    question: "What are federal agencies worst at?",
    answer:
      "Testing and remediation. 37 of 60 agencies, or 61.7%, rated Low or Very Low on that factor, making it the weakest area in the entire assessment. By contrast, Acquisition was the strongest factor, with 46.7% of agencies rating Very High. The pattern is that agencies are comparatively good at writing accessibility requirements into policy and contracts, and comparatively bad at verifying that what they bought and built actually works for disabled users.",
  },
  {
    question:
      "Does a high Implementation Index score mean an agency is accessible?",
    answer:
      "No, and the gap between the two indexes is the most revealing thing in the data. Only 26.7% of agencies rated Low or Very Low on Implementation, which measures whether the programme, policies, and staffing exist, while 58.3% rated that low on Conformance, which measures whether the technology is accessible. Having a governance structure is not the same as having accessible websites, documents, and software.",
  },
  {
    question: "Is this data independently verified?",
    answer:
      "No. Agencies self-report their answers, and no independent audit of agency websites, documents, or internal systems produces these ratings. That matters for how you read the results: self-assessment generally flatters, so the real state of federal ICT accessibility is unlikely to be better than what agencies reported about themselves and may well be worse.",
  },
  {
    question: "Does Section 508 apply to state and local government?",
    answer:
      "No. Section 508 of the Rehabilitation Act applies to United States federal agencies and to the ICT they develop, procure, maintain, or use. State and local government are covered instead by Title II of the Americans with Disabilities Act, which has its own rulemaking and deadlines. This assessment therefore says nothing about the accessibility of a state DMV site or a city services portal.",
  },
];

const reportLinks = [
  { href: "#summary", label: "Summary" },
  { href: "#how-to-read", label: "How to read it" },
  { href: "#factors", label: "Factor scores" },
  { href: "#interpretation", label: "Interpretation" },
  { href: "#agencies", label: "Agencies" },
  { href: "#methodology", label: "Methodology" },
  { href: "#downloads", label: "Downloads" },
];

export default function Section508AssessmentPage() {
  const conformance = assessmentData.factors.find(
    (factor) => factor.id === "conformance",
  );
  const testing = assessmentData.factors.find(
    (factor) => factor.id === "testing",
  );
  const acquisition = assessmentData.factors.find(
    (factor) => factor.id === "acquisition",
  );
  const implementation = assessmentData.factors.find(
    (factor) => factor.id === "implementation",
  );

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
        headline="Section 508 Assessment FY2025: How Federal Agencies Scored"
        description="Analysis of the FY2025 governmentwide Section 508 assessment covering 60 United States federal agencies, with factor-level maturity scores computed from the published agency response data."
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
        wordCount={1800}
        keywords={[
          "Section 508",
          "federal accessibility",
          "government accessibility data",
          "accessibility conformance",
        ]}
      />
      <FAQStructuredData faqs={faqs} />

      <div className="min-h-screen bg-white pt-12 text-slate-950 dark:bg-slate-950 dark:text-white">
        <ReportHero
          breadcrumbLabel="Section 508 assessment"
          title="Section 508: How Federal Agencies Scored"
          lede={`Accessibility maturity across all ${assessmentData.totalAgencies} United States federal agencies, from the ${assessmentData.fiscalYear} governmentwide Section 508 assessment.`}
          badges={[
            "Research report",
            `${assessmentData.fiscalYear} data`,
            `${assessmentData.totalAgencies} agencies`,
            "Reviewed: Aug 27, 2026",
          ]}
          headline={`${conformance?.percentLowOrVeryLow}% of federal agencies rated Low or Very Low on whether their technology is actually accessible. On testing and remediation, the weakest factor in the assessment, ${testing?.percentLowOrVeryLow}% rated that low.`}
          sourceName={assessmentData.source.name}
          sourceUrl={assessmentData.source.url}
          sourceNote="Agencies self-report. Percentages computed from the published response data."
          metrics={[
            {
              label: "Agencies assessed",
              value: String(assessmentData.totalAgencies),
              icon: Building2,
            },
            {
              label: "Low conformance",
              value: `${conformance?.percentLowOrVeryLow}%`,
              icon: Gauge,
            },
            {
              label: "Low on testing",
              value: `${testing?.percentLowOrVeryLow}%`,
              icon: ClipboardCheck,
            },
            {
              label: "High on acquisition",
              value: `${acquisition?.percentHighOrVeryHigh}%`,
              icon: ShoppingCart,
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
                  A programme on paper, not in practice
                </h2>
                <p className="mt-5 max-w-[68ch] leading-7 text-slate-600 dark:text-slate-400">
                  Section 508 has been law since 1998. Nearly three decades
                  later, most federal agencies report having the policies,
                  governance, and contract language in place, and most also
                  report that their technology still is not accessible. The
                  assessment measures both, and the distance between them is the
                  story.
                </p>
                <p className="mt-4 max-w-[68ch] text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Every percentage on this page is computed from the
                  government&apos;s own published response file, so you can
                  reproduce it from the source CSV.
                </p>
              </div>

              <div className="divide-y divide-slate-200 border-y border-slate-200 dark:divide-slate-800 dark:border-slate-800 lg:col-span-7">
                {[
                  [
                    "01",
                    "Conformance lags implementation badly",
                    `${implementation?.percentLowOrVeryLow}% of agencies rated Low or Very Low on having a programme, but ${conformance?.percentLowOrVeryLow}% rated that low on whether the technology is accessible.`,
                  ],
                  [
                    "02",
                    "Testing is where it breaks",
                    `${testing?.percentLowOrVeryLow}% of agencies rated Low or Very Low on testing and remediation, the weakest factor measured.`,
                  ],
                  [
                    "03",
                    "Buying is the easy part",
                    `${acquisition?.percentHighOrVeryHigh}% rated High or Very High on acquisition. Writing the requirement into a contract is fully within an agency's control; verifying the result is not.`,
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
            <Section508Client initialData={assessmentData} />
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
                  What the assessment measures, and what it does not.
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
              content="Section 508 federal agency accessibility government compliance procurement VPAT accessibility conformance report audit testing remediation ADA Title II"
              maxItems={3}
            />
          </div>
        </div>
      </div>
    </>
  );
}
