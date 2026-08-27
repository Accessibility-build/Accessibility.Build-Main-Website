import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowDownToLine,
  CalendarDays,
  ChevronRight,
  Database,
  ExternalLink,
  FileSearch,
  Microscope,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArticleStructuredData,
  BreadcrumbStructuredData,
  FAQStructuredData,
} from "@/components/seo/structured-data";
import { RelatedContent } from "@/components/seo/related-content";
import snapshotData from "@/lib/data/accessibility-snapshot.json";
import { StateOfAccessibilityClient } from "./StateOfAccessibilityClient";

const reportUrl = "https://accessibility.build/research/state-of-accessibility";
const webaimUrl = "https://webaim.org/projects/million/";

export const metadata: Metadata = {
  title: "State of Web Accessibility 2026: Report & Statistics",
  description:
    "WebAIM Million 2026 found 95.9% of one million homepages had detectable WCAG failures, up from 94.8%. That reverses six years of gradual improvement. Source-linked findings, trend data, and downloadable data.",
  keywords: [
    "state of web accessibility",
    "accessibility statistics",
    "WebAIM Million 2026",
    "web accessibility report",
    "WCAG failure statistics",
    "automated accessibility testing data",
    "web accessibility trends 2026",
  ],
  authors: [
    {
      name: "Accessibility.build",
      url: "https://accessibility.build",
    },
  ],
  creator: "Accessibility.build",
  publisher: "Accessibility.build",
  alternates: { canonical: reportUrl },
  openGraph: {
    title: "State of Web Accessibility 2026",
    description:
      "Source-linked findings from one million homepages, with clear methodology, limitations, and downloadable data.",
    url: reportUrl,
    type: "article",
    publishedTime: "2026-02-15T00:00:00Z",
    modifiedTime: "2026-08-27T00:00:00Z",
    authors: ["https://accessibility.build"],
    images: [
      {
        url: "https://accessibility.build/og-image.png",
        width: 1200,
        height: 630,
        alt: "State of Web Accessibility 2026 research report",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "State of Web Accessibility 2026",
    description:
      "Source-linked findings from one million homepages, with methodology and downloadable data.",
  },
};

const faqs = [
  {
    question:
      "What percentage of homepages have detectable accessibility failures?",
    answer:
      "WebAIM found automatically detectable WCAG 2 failures on 95.9% of the one million homepages evaluated in February 2026, up from 94.8% in 2025. This is a homepage-level automated result, not a full-site conformance assessment. Because only automatically detectable failures were counted, the rate of full WCAG 2 A/AA conformance is certainly lower than the remaining 4.1%.",
  },
  {
    question: "Did web accessibility get better or worse in 2026?",
    answer:
      "Worse, by both of WebAIM's headline measures. The share of homepages with detected WCAG failures rose from 94.8% to 95.9%, and the average number of detected errors per homepage rose 10.1%, from 51 to 56.1. WebAIM describes this as reversing a trend of small improvements in each of the previous six years, returning the web to roughly its 2024 position. WebAIM attributes the reversal primarily to rapidly increasing page complexity and ARIA usage, and suggests it reflects broader shifts in web development including heavier reliance on third-party frameworks and libraries and automated or AI-assisted coding practices.",
  },
  {
    question: "What is the most common detected accessibility failure?",
    answer:
      "Low contrast text was again the most common failure reported by WebAIM in 2026, appearing on 83.9% of the homepages evaluated, a sharp increase from 79.1% in 2025. Homepages averaged 34 distinct instances of low-contrast text, up 15% year over year. The same six failure types have topped the list for seven consecutive years and account for 96% of all detected errors.",
  },
  {
    question:
      "How many accessibility errors were found on an average homepage?",
    answer:
      "The WebAIM Million 2026 study detected 56,114,377 distinct errors across the sample, an average of 56.1 automatically detected errors per homepage, a 10.1% increase over the 51 errors per page found in 2025. The number does not include barriers that require manual review or user testing.",
  },
  {
    question: "Does an automated accessibility score prove WCAG conformance?",
    answer:
      "No. Automated tools evaluate only a subset of WCAG requirements. WebAIM is explicit that the absence of detected errors does not indicate that a page is accessible or conformant. Manual testing, assistive-technology testing, and evaluation of real user journeys remain necessary.",
  },
  {
    question: "Where does this report's data come from?",
    answer:
      "The primary measurements come from WebAIM Million 2026, published 30 March 2026 and based on a February 2026 crawl evaluated with the WAVE engine against WCAG 2.2 A/AA. The HTTP Archive Web Almanac 2025 accessibility chapter, published in January 2026 and based on Lighthouse and axe-core, provides separate supporting context; the two datasets are not merged into a single sample.",
  },
];

const reportLinks = [
  { href: "#summary", label: "Summary" },
  { href: "#key-findings", label: "At a glance" },
  { href: "#barriers", label: "Common failures" },
  { href: "#trends", label: "Trends" },
  { href: "#context", label: "Interpretation" },
  { href: "#why", label: "What changed" },
  { href: "#methodology", label: "Methodology" },
  { href: "#downloads", label: "Downloads" },
];

export default function StateOfAccessibilityPage() {
  return (
    <>
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "Research", url: "https://accessibility.build/research" },
          { name: "State of Web Accessibility", url: reportUrl },
        ]}
      />
      <ArticleStructuredData
        headline="State of Web Accessibility 2026"
        description="An independently reviewed synthesis of WebAIM Million 2026 and HTTP Archive accessibility research."
        author={{
          name: "Accessibility.build",
          url: "https://accessibility.build",
        }}
        authorType="Organization"
        publisher={{
          name: "Accessibility.build",
          logo: "https://accessibility.build/android-chrome-512x512.png",
        }}
        datePublished="2026-02-15"
        dateModified="2026-08-27"
        image="https://accessibility.build/og-image.png"
        url={reportUrl}
        wordCount={2400}
        keywords={[
          "web accessibility",
          "WCAG",
          "WebAIM Million",
          "accessibility statistics",
        ]}
      />
      <FAQStructuredData faqs={faqs} />

      <div className="min-h-screen bg-white pt-12 text-slate-950 dark:bg-slate-950 dark:text-white">
        <header className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/70">
          <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
            <nav
              className="flex min-w-0 items-center gap-1.5 overflow-hidden text-sm text-slate-500 dark:text-slate-400"
              aria-label="Breadcrumb"
            >
              <Link
                href="/"
                className="shrink-0 hover:text-slate-900 dark:hover:text-white"
              >
                Home
              </Link>
              <ChevronRight className="h-4 w-4 shrink-0" aria-hidden="true" />
              <Link
                href="/research"
                className="shrink-0 hover:text-slate-900 dark:hover:text-white"
              >
                Research
              </Link>
              <ChevronRight className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="truncate font-medium text-slate-800 dark:text-slate-200">
                State of Web Accessibility
              </span>
            </nav>

            <div className="mt-6 flex flex-wrap gap-2">
              <Badge variant="secondary">Research report</Badge>
              <Badge variant="secondary">Published 2026</Badge>
              <Badge variant="outline">Primary data: Feb 2026</Badge>
              <Badge variant="outline">Reviewed: Aug 27, 2026</Badge>
            </div>

            <div className="mt-6 max-w-4xl">
              <h1 className="text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl lg:text-6xl dark:text-white">
                State of Web Accessibility 2026
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl dark:text-slate-300">
                An independent synthesis of public accessibility research,
                centered on WebAIM&apos;s evaluation of one million homepages
                and supported by HTTP Archive context.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                asChild
                className="bg-teal-700 text-white hover:bg-teal-800"
              >
                <a href="#download-report">
                  <ArrowDownToLine aria-hidden="true" />
                  Download report
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="#methodology">
                  <Microscope aria-hidden="true" />
                  Methodology
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href={webaimUrl} target="_blank" rel="noopener noreferrer">
                  <Database aria-hidden="true" />
                  Primary dataset
                  <ExternalLink aria-hidden="true" />
                </a>
              </Button>
            </div>

            <div className="mt-9 rounded-lg border border-teal-200 bg-teal-50 p-5 dark:border-teal-900 dark:bg-teal-950/35">
              <p className="text-xs font-semibold uppercase text-teal-800 dark:text-teal-300">
                Headline finding
              </p>
              <p className="mt-2 max-w-4xl text-lg font-semibold leading-7 text-slate-950 dark:text-white">
                95.9% of the one million homepages evaluated had automatically
                detectable WCAG failures, with 56.1 detected errors per homepage
                on average. Both figures are worse than 2025, reversing six
                consecutive years of gradual improvement.
              </p>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Source:{" "}
                <a
                  href={webaimUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-teal-800 underline-offset-4 hover:underline dark:text-teal-300"
                >
                  WebAIM Million 2026
                </a>
                . Automated results do not establish full WCAG conformance.
              </p>
            </div>

            <dl className="mt-8 grid gap-px overflow-hidden rounded-lg border border-slate-200 bg-slate-200 dark:border-slate-700 dark:bg-slate-700 sm:grid-cols-3">
              <div className="bg-white px-5 py-4 dark:bg-slate-900">
                <dt className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                  <Database className="h-4 w-4" aria-hidden="true" />
                  Primary sample
                </dt>
                <dd className="mt-1.5 font-semibold">1,000,000 homepages</dd>
              </div>
              <div className="bg-white px-5 py-4 dark:bg-slate-900">
                <dt className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                  <FileSearch className="h-4 w-4" aria-hidden="true" />
                  Evaluation type
                </dt>
                <dd className="mt-1.5 font-semibold">Automated detection</dd>
              </div>
              <div className="bg-white px-5 py-4 dark:bg-slate-900">
                <dt className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                  <CalendarDays className="h-4 w-4" aria-hidden="true" />
                  Primary period
                </dt>
                <dd className="mt-1.5 font-semibold">February 2026</dd>
              </div>
            </dl>
          </div>
        </header>

        <nav
          className="sticky top-[84px] z-30 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95"
          aria-label="Report sections"
        >
          <div className="mx-auto max-w-6xl overflow-x-auto px-4 sm:px-6 lg:px-8">
            <ul className="flex min-w-max items-center gap-1 py-2">
              {reportLinks.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="inline-flex min-h-10 items-center rounded-md px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

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
                  In 2026 the web moved backwards
                </h2>
                <p className="mt-5 max-w-[68ch] leading-7 text-slate-600 dark:text-slate-400">
                  For six straight years the share of homepages with detectable
                  failures inched downward. In February 2026 it rose instead,
                  from 94.8% to 95.9%, while the average number of detected
                  errors per homepage climbed 10.1%. Two years of measured
                  progress were erased in a single cycle, putting the web back
                  at roughly its 2024 position.
                </p>
                <p className="mt-4 max-w-[68ch] text-sm leading-6 text-slate-500 dark:text-slate-400">
                  This report keeps measurements from different studies separate
                  and distinguishes automated signals from complete
                  accessibility evaluation.
                </p>
              </div>

              <div className="divide-y divide-slate-200 border-y border-slate-200 dark:divide-slate-800 dark:border-slate-800 lg:col-span-7">
                {[
                  [
                    "01",
                    "The same six failures, for a seventh year",
                    "Six categories account for 96% of the automatically detected errors in WebAIM's sample, and the list has not changed in seven years. Four of the six became more common in 2026.",
                  ],
                  [
                    "02",
                    "Complexity is outrunning remediation",
                    "The average homepage contained 1,437 elements in February 2026, a 22.5% jump in a single year and nearly double the 2019 figure. ARIA attributes grew 27% in the same period.",
                  ],
                  [
                    "03",
                    "Automated results are incomplete",
                    "These findings identify repeatable code-level failures, not full WCAG conformance or the lived usability of a website.",
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
            <StateOfAccessibilityClient initialData={snapshotData} />
          </div>

          <section
            className="mt-16 scroll-mt-40 border-t border-slate-200 pt-12 sm:mt-20 dark:border-slate-800"
            aria-labelledby="faq-heading"
          >
            <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-4">
                <p className="text-sm font-semibold text-teal-700 dark:text-teal-300">
                  Questions about the report
                </p>
                <h2
                  id="faq-heading"
                  className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white"
                >
                  Frequently asked questions
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  Definitions and limitations that are important when quoting
                  these findings.
                </p>
              </div>
              <div
                className="lg:col-span-8"
                itemScope
                itemType="https://schema.org/FAQPage"
              >
                <Accordion
                  type="single"
                  collapsible
                  className="border-t border-slate-200 dark:border-slate-800"
                >
                  {faqs.map((faq, index) => (
                    <AccordionItem
                      key={faq.question}
                      value={`faq-${index}`}
                      itemScope
                      itemProp="mainEntity"
                      itemType="https://schema.org/Question"
                    >
                      <AccordionTrigger
                        className="text-left text-base font-semibold hover:no-underline"
                        itemProp="name"
                      >
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div
                          itemScope
                          itemProp="acceptedAnswer"
                          itemType="https://schema.org/Answer"
                        >
                          <p
                            className="max-w-[72ch] leading-7 text-slate-600 dark:text-slate-400"
                            itemProp="text"
                          >
                            {faq.answer}
                          </p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </section>

          <div className="mt-16 sm:mt-20">
            <RelatedContent
              content="web accessibility WCAG automated testing WebAIM Million accessibility research contrast alternative text form labels"
              maxItems={3}
            />
          </div>
        </div>
      </div>
    </>
  );
}
