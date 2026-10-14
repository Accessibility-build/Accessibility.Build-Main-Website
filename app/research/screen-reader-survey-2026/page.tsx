import type { Metadata } from "next";
import { Bot, Headphones, ListTree } from "lucide-react";
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
import { DatasetDownloads } from "@/components/research/dataset-downloads";
import surveyData from "@/lib/data/screen-reader-survey-2026.json";
import { getRouteDate } from "@/lib/site-routes";
import { clampDescription } from "@/lib/metadata";
import {
  ScreenReaderSurveyClient,
  type SurveyData,
} from "./ScreenReaderSurveyClient";

const reportUrl = "https://accessibility.build/research/screen-reader-survey-2026";
const pageTitle = "Screen Reader Survey 2026: JAWS, NVDA and AI Use";
const ogTitle = "Screen Reader Survey 2026 vs 2024";

const data = surveyData as unknown as SurveyData;
const s11 = data.surveys.survey11;
const s10 = data.surveys.survey10;

/** A WebAIM-published percentage for one response, looked up from the stored tables. */
function pct(questionId: string, response: string, survey: "survey10" | "survey11"): number {
  const question = data.questions.find((q) => q.id === questionId);
  const row = question?.[survey]?.find((r) => r.response === response);
  if (row?.percent == null) {
    throw new Error(`Missing ${survey} figure: ${questionId} / ${response}`);
  }
  return row.percent;
}
const f = (n: number) => `${n.toFixed(1)}%`;
const region = (name: string) => {
  const row = data.primaryByRegion.rows.find((r) => r.region === name);
  if (!row) throw new Error(`Missing region ${name}`);
  return row;
};

const jaws26 = pct("primaryScreenReader", "JAWS", "survey11");
const jaws24 = pct("primaryScreenReader", "JAWS", "survey10");
const nvda26 = pct("primaryScreenReader", "NVDA", "survey11");
const nvda24 = pct("primaryScreenReader", "NVDA", "survey10");
const vo26 = pct("primaryScreenReader", "VoiceOver", "survey11");
const vo24 = pct("primaryScreenReader", "VoiceOver", "survey10");
const jawsUsed26 = pct("commonlyUsed", "JAWS", "survey11");
const nvdaUsed26 = pct("commonlyUsed", "NVDA", "survey11");
const jawsUsed24 = pct("commonlyUsed", "JAWS", "survey10");
const nvdaUsed24 = pct("commonlyUsed", "NVDA", "survey10");
const headings26 = pct("findingInformation", "Navigate through the headings on the page", "survey11");
const headings24 = pct("findingInformation", "Navigate through the headings on the page", "survey10");
const landmarksFirst26 = pct("findingInformation", "Navigate through the landmarks/regions of the page", "survey11");
const lessAccessible26 = pct("webAccessibilityProgress", "Web content has become less accessible", "survey11");
const lessAccessible24 = pct("webAccessibilityProgress", "Web content has become less accessible", "survey10");
const moreAccessible26 = pct("webAccessibilityProgress", "Web content has become more accessible", "survey11");
const moreAccessible24 = pct("webAccessibilityProgress", "Web content has become more accessible", "survey10");
const unchanged26 = pct("webAccessibilityProgress", "Web content accessibility has not changed", "survey11");
const unchanged24 = pct("webAccessibilityProgress", "Web content accessibility has not changed", "survey10");
const aiAlt26 = pct("aiUsage", "To generate image descriptions / alternative text", "survey11");
const aiComplex26 = pct("aiUsage", "To provide in-depth analysis or description of complex images", "survey11");
const aiGuidance26 = pct("aiUsage", "To provide guidance in performing an online task", "survey11");
const aiSummaries26 = pct("aiUsage", "To provide summaries of webpages or documents", "survey11");
const na26 = pct("region", "North America", "survey11");
const na24 = pct("region", "North America", "survey10");
const europe26 = pct("region", "Europe", "survey11");
const europe24 = pct("region", "Europe", "survey10");
const noAi = data.publishedProseFigures.find((p) => p.topic === "AI usage")?.value;
const pdf = data.publishedProseFigures.find((p) => p.topic === "PDF documents");
const multiple26 = data.publishedProseFigures.find(
  (p) => p.topic === "Multiple screen readers" && p.survey === "survey11",
)?.value;
const headingLevels = data.publishedProseFigures.find((p) => p.topic === "Heading levels");
const northAmerica = region("North America");
const europe = region("Europe");
const asia = region("Asia");
const africa = region("Africa/Middle East");
const southAmerica = region("South America");

const description = clampDescription(
  `WebAIM Screen Reader Survey #11 (2026) vs #10 (2024): JAWS primary use rose to ${f(jaws26)} from ${f(jaws24)}, NVDA fell to ${f(nvda26)}, and ${f(aiAlt26)} use AI for alt text.`,
);

export const metadata: Metadata = {
  title: pageTitle,
  description,
  keywords: [
    "screen reader statistics",
    "screen reader usage 2026",
    "JAWS vs NVDA",
    "WebAIM screen reader survey",
    "screen reader survey 2026",
    "most popular screen reader",
    "JAWS usage statistics",
    "NVDA usage statistics",
    "screen reader users AI",
    "screen reader user survey 11",
  ],
  authors: [{ name: "Accessibility.build", url: "https://accessibility.build" }],
  creator: "Accessibility.build",
  publisher: "Accessibility.build",
  alternates: { canonical: reportUrl },
  openGraph: {
    title: ogTitle,
    description:
      "What changed between WebAIM's 2024 and 2026 screen reader user surveys: JAWS vs NVDA, regional splits, headings navigation, AI use and PDF barriers.",
    url: reportUrl,
    type: "article",
    publishedTime: "2026-10-14T00:00:00Z",
    modifiedTime: "2026-10-14T00:00:00Z",
    authors: ["https://accessibility.build"],
    images: [
      {
        url: `/api/og?title=${encodeURIComponent(ogTitle)}&section=Research`,
        width: 1200,
        height: 630,
        alt: "Screen reader survey 2026 research report",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: ogTitle,
    description: `JAWS primary use rose to ${f(jaws26)} from ${f(jaws24)} in WebAIM's 2026 screen reader survey; NVDA fell to ${f(nvda26)}.`,
  },
};

// One array feeds both the visible FAQ list and the FAQPage schema, so the two
// cannot drift. Every figure is interpolated from the stored WebAIM tables.
const faqs = [
  {
    question: "What is the most popular screen reader in 2026?",
    answer: `JAWS. In WebAIM's Screen Reader User Survey #11 (${s11.surveyPeriod}, ${s11.validResponses.toLocaleString()} valid responses), JAWS was the primary desktop or laptop screen reader for ${f(jaws26)} of respondents, NVDA for ${f(nvda26)} and VoiceOver for ${f(vo26)}. JAWS also led on screen readers commonly used, at ${f(jawsUsed26)} against ${f(nvdaUsed26)} for NVDA. These are shares of a self-selected survey sample, not sales or installation figures, so treat them as a picture of engaged screen reader users rather than a market share.`,
  },
  {
    question: "Did JAWS gain users between 2024 and 2026?",
    answer: `Among survey respondents, yes: JAWS primary use rose from ${f(jaws24)} in Survey #10 to ${f(jaws26)} in Survey #11, while NVDA fell from ${f(nvda24)} to ${f(nvda26)} and VoiceOver from ${f(vo24)} to ${f(vo26)}. Part of this is who answered. North American respondents rose from ${f(na24)} to ${f(na26)} of the sample, and JAWS is far more common there. WebAIM says the larger North American sample alone does not account for the increase, and JAWS also gained inside North America, from ${f(northAmerica.jaws2024 ?? 0)} to ${f(northAmerica.jaws2026)}.`,
  },
  {
    question: "Should I test with JAWS or NVDA?",
    answer: `Both, if you can. Which one dominates depends on where your users are. In 2026 JAWS led NVDA in North America (${f(northAmerica.jaws2026)} against ${f(northAmerica.nvda2026)}), the two were level in Europe (${f(europe.jaws2026)} against ${f(europe.nvda2026)}), and NVDA led in Asia (${f(asia.nvda2026)}), Africa and the Middle East (${f(africa.nvda2026)}) and South America (${f(southAmerica.nvda2026)}). ${f(multiple26 ?? 0)} of respondents use more than one desktop screen reader, so a site that only works in one will fail real users.`,
  },
  {
    question: "How do screen reader users use AI?",
    answer: `Survey #11 asked this for the first time. ${f(aiAlt26)} of respondents commonly use AI to generate image descriptions or alternative text, ${f(aiComplex26)} for in-depth descriptions of complex images, ${f(aiGuidance26)} for guidance through an online task and ${f(aiSummaries26)} for summaries of pages or documents. Only ${f(noAi ?? 0)} reported none of the listed uses. Users working around missing alt text with AI is not a reason to skip writing it: the description they get is a guess, not the author's intent.`,
  },
  {
    question: "Do screen reader users still navigate by headings?",
    answer: `Yes, by a wide margin, though slightly less than before. ${f(headings26)} said headings are the first thing they use to find information on a lengthy page, down from ${f(headings24)} in 2024. Landmarks were the first choice of only ${f(landmarksFirst26)}. ${headingLevels?.value ?? ""}% find heading levels very or somewhat useful. A correct heading outline remains the single most useful structural fix for screen reader users.`,
  },
  {
    question: "Do screen reader users think the web is getting more accessible?",
    answer: `Fewer than in 2024. In Survey #11, ${f(moreAccessible26)} said web content had become more accessible over the previous year, ${f(unchanged26)} said it had not changed and ${f(lessAccessible26)} said it had become less accessible. In Survey #10 the figures were ${f(moreAccessible24)}, ${f(unchanged24)} and ${f(lessAccessible24)}. WebAIM describes perception as decreasing slightly from 2021 to 2024 and again from 2024 to 2026.`,
  },
  {
    question: "Is CAPTCHA still the biggest problem for screen reader users?",
    answer: `Survey #11 did not ask the problematic items question, so there is no 2026 ranking. The most recent answer is Survey #10 (${s10.surveyPeriod}), where CAPTCHA was the most problematic item by a notable margin, ahead of interactive elements that do not behave as expected, links or buttons that do not make sense, and screens that change unexpectedly. Survey #11 did ask about documents: ${pdf?.value ?? ""}% said PDFs are very or somewhat likely to pose accessibility issues, up from ${pdf?.previous2019 ?? ""}% in 2019.`,
  },
  {
    question: "How reliable is the WebAIM screen reader survey?",
    answer: `It is the largest recurring public survey of screen reader users, but WebAIM states that the sample was not controlled and may not represent all screen reader users. Respondents choose to take part, so it over-represents people engaged with the accessibility community. The regional mix also moved between surveys: North America went from ${f(na24)} to ${f(na26)} of respondents and Europe from ${f(europe24)} to ${f(europe26)}. Compare the two surveys as two snapshots of similar communities, not as a measured trend in the whole population.`,
  },
];

const reportLinks = [
  { href: "#summary", label: "Summary" },
  { href: "#how-to-read", label: "How to read it" },
  { href: "#primary", label: "Primary screen reader" },
  { href: "#regions", label: "By region" },
  { href: "#navigation", label: "Navigation" },
  { href: "#progress", label: "Progress" },
  { href: "#ai", label: "AI and documents" },
  { href: "#all-questions", label: "All questions" },
  { href: "#methodology", label: "Methodology" },
  { href: "#faq", label: "FAQ" },
];

export default function ScreenReaderSurvey2026Page() {
  const jawsChange = (jaws26 - jaws24).toFixed(1);

  return (
    <>
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "Research", url: "https://accessibility.build/research" },
          { name: "Screen Reader Survey 2026", url: reportUrl },
        ]}
      />
      <ArticleStructuredData
        headline="Screen Reader Survey 2026: WebAIM Survey #11 Compared with #10"
        description="Every question asked in both WebAIM Screen Reader User Survey #11 (2026) and #10 (2024), side by side: primary screen reader, JAWS vs NVDA by region, navigation, perceived progress, plus the new AI and document questions."
        author={{
          name: "Accessibility.build",
          url: "https://accessibility.build",
        }}
        authorType="Organization"
        publisher={{
          name: "Accessibility.build",
          logo: "https://accessibility.build/android-chrome-512x512.png",
        }}
        datePublished="2026-10-14"
        dateModified={getRouteDate("/research/screen-reader-survey-2026") ?? "2026-10-14"}
        image="https://accessibility.build/og-image.png"
        url={reportUrl}
        keywords={[
          "screen reader statistics",
          "JAWS vs NVDA",
          "WebAIM screen reader survey",
          "screen reader usage 2026",
        ]}
      />
      <FAQStructuredData faqs={faqs} />

      <div className="min-h-screen bg-white pt-12 text-slate-950 dark:bg-slate-950 dark:text-white">
        <ReportHero
          breadcrumbLabel="Screen reader survey 2026"
          title="Screen Reader Survey 2026: What Changed Since 2024"
          lede={`WebAIM's eleventh Screen Reader User Survey (${s11.validResponses.toLocaleString()} valid responses, ${s11.surveyPeriod}) set against the tenth (${s10.validResponses.toLocaleString()} responses, ${s10.surveyPeriod}). Both values for every question asked twice, the percentage-point change, and the new questions on AI and documents.`}
          badges={[
            "Research report",
            `Survey #11: ${s11.surveyPeriod}`,
            `${s11.validResponses.toLocaleString()} responses`,
            "Reviewed: Oct 14, 2026",
          ]}
          headline={`JAWS is back on top: ${f(jaws26)} of respondents now use it as their primary desktop screen reader, up ${jawsChange} points from ${f(jaws24)} in 2024, while NVDA fell to ${f(nvda26)} and VoiceOver to ${f(vo26)}.`}
          sourceName="WebAIM Screen Reader User Survey #11"
          sourceUrl={s11.url}
          sourceNote="Self-selected sample, not a market share. © WebAIM, reproduced with attribution."
          metrics={[
            { label: "JAWS primary (2024)", value: `${f(jaws26)} (${f(jaws24)})`, icon: Headphones },
            { label: "NVDA primary (2024)", value: `${f(nvda26)} (${f(nvda24)})`, icon: Headphones },
            { label: "Headings first (2024)", value: `${f(headings26)} (${f(headings24)})`, icon: ListTree },
            { label: "Use AI for alt text", value: f(aiAlt26), icon: Bot },
          ]}
        />

        <ReportSectionNav links={reportLinks} />

        <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <section id="summary" aria-labelledby="summary-heading" className="scroll-mt-40">
            <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-5">
                <p className="text-sm font-semibold text-teal-700 dark:text-teal-300">
                  Executive summary
                </p>
                <h2
                  id="summary-heading"
                  className="mt-2 text-3xl font-semibold text-slate-950 dark:text-white"
                >
                  Two years, one big swing, and a new question about AI
                </h2>
                <p className="mt-5 max-w-[68ch] leading-7 text-slate-600 dark:text-slate-400">
                  In 2024 JAWS and NVDA were nearly level as primary screen
                  readers, and more respondents used NVDA than JAWS overall. In
                  2026 JAWS leads on both measures. Headings are still how most
                  people find their way around a page, but slightly fewer start
                  there, and more respondents feel the web got worse over the
                  past year.
                </p>
                <p className="mt-4 max-w-[68ch] text-sm leading-6 text-slate-500 dark:text-slate-400">
                  All survey figures are © WebAIM and come from{" "}
                  <a
                    href={s11.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-teal-700 underline-offset-4 hover:underline dark:text-teal-300"
                  >
                    Survey #11
                  </a>{" "}
                  and{" "}
                  <a
                    href={s10.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-teal-700 underline-offset-4 hover:underline dark:text-teal-300"
                  >
                    Survey #10
                  </a>
                  . The only number we add is the percentage-point difference
                  between them.
                </p>
              </div>

              <div className="divide-y divide-slate-200 border-y border-slate-200 dark:divide-slate-800 dark:border-slate-800 lg:col-span-7">
                {[
                  [
                    "01",
                    "JAWS overtook NVDA on every measure",
                    `Primary use ${f(jaws24)} to ${f(jaws26)} for JAWS, ${f(nvda24)} to ${f(nvda26)} for NVDA. Commonly used: JAWS ${f(jawsUsed24)} to ${f(jawsUsed26)}, NVDA ${f(nvdaUsed24)} to ${f(nvdaUsed26)}.`,
                  ],
                  [
                    "02",
                    "Geography still decides the answer",
                    `JAWS is primary for ${f(northAmerica.jaws2026)} in North America, NVDA for ${f(asia.nvda2026)} in Asia and ${f(africa.nvda2026)} in Africa and the Middle East. More North American respondents answered this time, which WebAIM says does not alone explain the shift.`,
                  ],
                  [
                    "03",
                    "AI is now part of how people read the web",
                    `${f(aiAlt26)} use AI for image descriptions or alt text, and only ${f(noAi ?? 0)} use none of the listed AI tools. ${pdf?.value ?? ""}% expect PDFs to cause accessibility problems.`,
                  ],
                ].map(([number, title, text]) => (
                  <div key={number} className="grid grid-cols-[36px_1fr] gap-4 py-5">
                    <span className="font-mono text-sm font-semibold text-teal-700 dark:text-teal-300">
                      {number}
                    </span>
                    <div>
                      <h3 className="font-semibold text-slate-950 dark:text-white">{title}</h3>
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
            <ScreenReaderSurveyClient initialData={data} />
          </div>

          <section
            id="faq"
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
                  What the two surveys support, and what they do not.
                </p>
              </div>
              <div className="lg:col-span-8">
                <div className="divide-y divide-slate-200 border-y border-slate-200 dark:divide-slate-800 dark:border-slate-800">
                  {faqs.map((faq) => (
                    <details key={faq.question} className="group py-1">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-md py-4 text-left text-base font-semibold text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 dark:text-white [&::-webkit-details-marker]:hidden">
                        {faq.question}
                        <span
                          aria-hidden="true"
                          className="shrink-0 text-slate-500 transition-transform group-open:rotate-180 dark:text-slate-400"
                        >
                          &#9662;
                        </span>
                      </summary>
                      <p className="max-w-[72ch] pb-4 text-sm leading-7 text-slate-600 dark:text-slate-400">
                        {faq.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <div className="mt-16 sm:mt-20">
            <DatasetDownloads
              dataset="screen-reader-survey"
              name="WebAIM Screen Reader User Survey #11 compared with #10"
              description="Every question asked in both WebAIM Screen Reader User Surveys #10 (2024) and #11 (2026) with both percentages and the percentage-point change, the regional JAWS and NVDA split, and the single-survey questions on AI use, documents and problematic items."
              pageUrl={reportUrl}
              datePublished="2026-10-14"
              dateModified={data.lastUpdated}
              temporalCoverage="2023-12/2026-08"
              keywords={["screen reader statistics", "JAWS", "NVDA", "VoiceOver", "WebAIM"]}
              attribution="WebAIM Screen Reader User Surveys #10 and #11"
              licence={{
                url: data.licenceUrl,
                text: "The survey figures are © WebAIM and are reproduced under WebAIM's terms: free reuse with full credit to WebAIM, a link to webaim.org, and the © WebAIM notice intact. Cite Accessibility.build for the comparison.",
              }}
              tables={[
                { key: "primaryScreenReader", label: "Primary desktop screen reader" },
                { key: "commonlyUsed", label: "Screen readers commonly used" },
                { key: "primaryByRegion", label: "JAWS and NVDA by region" },
                { key: "findingInformation", label: "Finding information" },
                { key: "webAccessibilityProgress", label: "Perceived progress" },
                { key: "browserCombinations", label: "Screen reader and browser" },
              ]}
            />
            <RelatedContent
              content="screen reader statistics JAWS NVDA VoiceOver screen reader testing WebAIM survey headings alt text PDF accessibility"
              maxItems={3}
            />
          </div>
        </div>
      </div>
    </>
  );
}
