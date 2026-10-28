import type { Metadata } from "next"
import Link from "next/link"
import AccessibilityMaturityAssessment from "@/components/tools/accessibility-maturity-assessment"
import { BreadcrumbStructuredData, HowToStructuredData, ToolStructuredData } from "@/components/seo/structured-data"
import { FaqSection } from "@/components/seo/faq-section"
import { RelatedContent } from "@/components/seo/related-content"
import { clampDescription } from "@/lib/metadata"
import { ALL_PROOF_POINTS, DIMENSIONS, MATURITY_MODEL_SOURCE } from "@/lib/maturity/model"

const ROUTE = "/tools/accessibility-maturity-assessment"
const pageTitle = "Accessibility Maturity Assessment: W3C Model Self-Check"
const pageDescription =
  "Assess your organisation against the W3C Accessibility Maturity Model: seven dimensions, four levels from Inactive to Optimize, and every proof point. Free, saved in your browser, with Excel and PDF export and next steps for your weakest areas."

const LINK = "font-medium text-teal-700 underline underline-offset-2 dark:text-teal-300"

export const metadata: Metadata = {
  title: pageTitle,
  description: clampDescription(pageDescription),
  keywords: [
    "accessibility maturity model",
    "accessibility maturity assessment",
    "W3C accessibility maturity model",
    "digital accessibility maturity",
    "accessibility programme assessment",
    "accessibility program maturity",
    "accessibility self-assessment",
    "accessibility governance",
    "accessibility proof points",
    "Inactive Launch Integrate Optimize",
  ],
  alternates: { canonical: ROUTE },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: ROUTE,
    type: "website",
    siteName: "Accessibility.build",
    images: [
      {
        url: `/api/og?title=${encodeURIComponent("Accessibility Maturity Assessment")}&section=Free tool`,
        width: 1200,
        height: 630,
        alt: "Accessibility maturity assessment",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: clampDescription(pageDescription),
    images: [`/api/og?title=${encodeURIComponent("Accessibility Maturity Assessment")}&section=Free tool`],
  },
}

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Tools", url: "https://accessibility.build/tools" },
  { name: "Accessibility Maturity Assessment", url: `https://accessibility.build${ROUTE}` },
]

const FAQS = [
  {
    question: "What is the W3C Accessibility Maturity Model?",
    answer: `A W3C Group Note, published on ${MATURITY_MODEL_SOURCE.publishedLabel}, for judging how well an organisation builds accessibility into the way it works, rather than whether one website passes WCAG. It covers seven dimensions, from communications and procurement to personnel and support, and describes four levels of maturity: Inactive, Launch, Integrate and Optimize. Each dimension lists proof points, the evidence an organisation can show for its level.`,
  },
  {
    question: "Who should fill in the assessment?",
    answer:
      "The Note is written for executives, the managers responsible for accessibility, and the people who own policy and process. It recommends a cross-functional team, because no one person sees procurement, development, HR and customer support at once. A practical approach is for one person to work through it with the owners of each dimension, using the notes field to record the evidence behind each rating.",
  },
  {
    question: "How is my level for each dimension worked out?",
    answer:
      "The Note has no numeric score: an evaluator judges which level the evidence supports. To give a summary, we use our own rule. A dimension sits at the level that at least half of its rated proof points have reached, and reaches Optimize only when every rated proof point is at Optimize, because the Note says proof points must be fully complete at that level. Not sure and Does not apply answers are left out, and a summary based on fewer than half of a dimension's proof points is marked provisional.",
  },
  {
    question: "Is this an official W3C tool?",
    answer:
      "No. It is our independent self-assessment based on the W3C Note. The dimension and level names are the W3C's, and every proof point is paraphrased in our own words with the same meaning. The Note links to its own assessment spreadsheet, which it describes as experimental and a work in progress.",
  },
  {
    question: "Where are my answers stored?",
    answer:
      "In your browser's local storage on this device, and nowhere else. Nothing is sent to us. Clearing your browser data, or using a private window, removes them, so download the Excel file to keep a copy or to share it with colleagues. Start over clears the saved answers after asking you to confirm.",
  },
  {
    question: "How often should we reassess?",
    answer:
      "The Note advises reassessing regularly, to track progress and to catch areas that slip back, without setting a frequency. Pick a rhythm that matches your planning cycle, such as once a year, and keep each export so you can compare.",
  },
]

export default function AccessibilityMaturityAssessmentPage() {
  return (
    <>
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />
      <ToolStructuredData
        name="Accessibility Maturity Assessment"
        description={pageDescription}
        url={`https://accessibility.build${ROUTE}`}
        applicationCategory="BusinessApplication"
        operatingSystem="Any"
        featureList={[
          "All seven dimensions of the W3C Accessibility Maturity Model",
          `${ALL_PROOF_POINTS.length} proof points rated Inactive, Launch, Integrate or Optimize`,
          "Per-dimension summary, chart and table, with next steps for the weakest dimensions",
          "Saved in the browser, with Excel and PDF export",
        ]}
      />
      <HowToStructuredData
        name="How to assess your organisation's accessibility maturity"
        description="Rate each proof point of the W3C Accessibility Maturity Model, read the summary per dimension, and plan the next steps."
        steps={[
          { name: "Read the levels", text: "Start with the overview, which explains the four levels and the seven dimensions." },
          { name: "Rate each dimension", text: "Work through one dimension at a time, rating every proof point as Inactive, Launch, Integrate, Optimize, Not sure or Does not apply, with notes on the evidence." },
          { name: "Read your results", text: "See the summary level for each dimension as a chart and a table, and the next steps for the weakest dimensions." },
          { name: "Export and share", text: "Download the assessment as Excel or PDF to share with colleagues and compare next time." },
        ]}
      />

      <div className="bg-white pb-20 dark:bg-slate-950">
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
                  <Link href="/tools" className="hover:text-teal-700 dark:hover:text-teal-300">
                    Tools
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-slate-900 dark:text-white">Accessibility Maturity Assessment</li>
              </ol>
            </nav>
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">
              Free tool &middot; Runs in your browser
            </p>
            <h1 className="mt-3 max-w-4xl font-serif text-4xl font-semibold leading-[1.1] tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              How mature is your accessibility programme?
            </h1>
            <p className="mt-6 max-w-[62ch] text-lg leading-8 text-slate-700 dark:text-slate-300">
              Rate your organisation against the W3C Accessibility Maturity Model, one dimension at a time. You get
              a level for each of the seven dimensions, a chart and table of where you stand, and next steps for the
              weakest areas. Answers stay in your browser, and you can download them as Excel or PDF.
            </p>
          </div>
        </header>

        <div className="container-wide">
          <div className="mx-auto max-w-6xl py-12">
            <AccessibilityMaturityAssessment />

            <section aria-labelledby="model-heading" className="mt-14 max-w-[68ch]">
              <h2 id="model-heading" className="font-serif text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">
                What the W3C model measures
              </h2>
              <div className="mt-4 space-y-4 leading-7 text-slate-700 dark:text-slate-300">
                <p>
                  WCAG tells you whether a page is accessible. The{" "}
                  <a href={MATURITY_MODEL_SOURCE.url} className={LINK}>
                    {MATURITY_MODEL_SOURCE.title}
                  </a>{" "}
                  asks a different question: does the organisation have what it takes to keep producing accessible
                  products and services? It is a {MATURITY_MODEL_SOURCE.status} published on{" "}
                  {MATURITY_MODEL_SOURCE.publishedLabel}, and this tool follows that version, checked on 28 October
                  2026. It looks at seven dimensions:
                </p>
              </div>
              <dl className="mt-4 space-y-3">
                {DIMENSIONS.map((dimension) => (
                  <div key={dimension.id}>
                    <dt className="font-semibold text-slate-900 dark:text-white">{dimension.name}</dt>
                    <dd className="leading-7 text-slate-700 dark:text-slate-300">{dimension.summary}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 leading-7 text-slate-700 dark:text-slate-300">
                Each dimension is judged on four levels. Inactive means little or no awareness. Launch means the need
                is recognised and planning has started. Integrate means there is a roadmap and a defined approach.
                Optimize means accessibility is part of how the whole organisation works and is checked and improved
                continually. The levels build on each other, so a dimension reaches one only by meeting the ones below
                it first. Our{" "}
                <Link href="/guides/accessibility-maturity-model" className={LINK}>
                  W3C Accessibility Maturity Model guide
                </Link>{" "}
                explains the model in full, with example proof points and how to turn results into a roadmap.
              </p>
            </section>

            <section aria-labelledby="summary-heading" className="mt-12 max-w-[68ch]">
              <h2 id="summary-heading" className="font-serif text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">
                How we summarise your answers
              </h2>
              <div className="mt-4 space-y-4 leading-7 text-slate-700 dark:text-slate-300">
                <p>
                  The Note has no numeric score. Its proof points are evidence, and the evaluator decides which
                  level that evidence supports. To give you something to act on, this tool adds a summary for each
                  dimension, and that summary is ours, not the W3C&apos;s.
                </p>
                <p>
                  A dimension sits at the level that at least half of its rated proof points have reached. It reaches
                  Optimize only when every rated proof point is at Optimize, because the Note says proof points must be
                  fully complete at that level. Not sure and Does not apply answers are left out, and a summary resting
                  on fewer than half of a dimension&apos;s proof points is marked provisional. The table under the chart
                  shows how many answers sit at each level, so you can see the spread behind the summary.
                </p>
              </div>
            </section>

            <section aria-labelledby="limits-heading" className="mt-12 max-w-[68ch]">
              <h2 id="limits-heading" className="font-serif text-2xl font-semibold text-slate-900 dark:text-white sm:text-3xl">
                What a self-assessment can&apos;t tell you
              </h2>
              <ul className="mt-4 list-disc space-y-3 pl-6 leading-7 text-slate-700 dark:text-slate-300">
                <li>
                  The result is only as good as the evidence behind each rating. Use the notes to record what you
                  looked at, and ask the owner of each area rather than guessing.
                </li>
                <li>
                  It is not a conformance check. A mature programme can still ship an inaccessible page, so test your
                  products against WCAG as well, for example with an{" "}
                  <Link href="/services/accessibility-audits" className={LINK}>
                    accessibility audit
                  </Link>{" "}
                  or the{" "}
                  <Link href="/checklists/wcag-2-2" className={LINK}>
                    WCAG 2.2 checklist
                  </Link>
                  .
                </li>
                <li>
                  The proof points are our paraphrase of the Note. Where the wording matters, for a contract or a
                  policy, quote the Note itself.
                </li>
                <li>
                  The Note says its proof point lists are not exhaustive and can be adapted. If a proof point does not
                  fit your organisation, mark it Does not apply rather than forcing a rating.
                </li>
              </ul>
            </section>

            <div className="mt-14 max-w-[68ch]">
              <FaqSection faqs={FAQS} />
            </div>

            <div className="mt-14">
              <RelatedContent
                content="accessibility programme governance policy procurement training audit statement maturity organisation"
                title="Related reading"
                maxItems={4}
                showDescriptions
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
