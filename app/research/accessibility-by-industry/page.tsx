import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowDownToLine,
  ChevronRight,
  Database,
  ExternalLink,
  Gauge,
  Landmark,
  Microscope,
  ShoppingBag,
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
import industryData from "@/lib/data/accessibility-by-industry.json";
import { AccessibilityByIndustryClient } from "./AccessibilityByIndustryClient";
import { getRouteDate } from "@/lib/site-routes"
import { clampDescription } from "@/lib/metadata"
import { DatasetDownloads } from "@/components/research/dataset-downloads"

const reportUrl =
  "https://accessibility.build/research/accessibility-by-industry";
const webaimUrl = "https://webaim.org/projects/million/";

const pageTitle = "Web Accessibility by Industry";

export const metadata: Metadata = {
  title: "Accessibility by Industry 2026 | Sector Benchmark Report",
  description:
    clampDescription("Which industries build the most accessible websites? Government, education, and non-profit lead; shopping and sports trail. Average WCAG errors per home page across 29 sectors, measured on one million sites in February 2026."),
  keywords: [
    "accessibility by industry",
    "web accessibility statistics by sector",
    "government website accessibility",
    "ecommerce accessibility statistics",
    "healthcare website accessibility",
    "education website accessibility",
    "industry accessibility benchmark",
    "WCAG compliance by industry",
  ],
  authors: [{ name: "Accessibility.build", url: "https://accessibility.build" }],
  creator: "Accessibility.build",
  publisher: "Accessibility.build",
  alternates: { canonical: reportUrl },
  openGraph: {
    title: pageTitle,
    description:
      "Average accessibility errors per home page across 29 industry sectors, measured on one million sites.",
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
        alt: "Web accessibility by industry research report",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description:
      "Average accessibility errors per home page across 29 industry sectors.",
  },
};

const faqs = [
  {
    question: "Which industry has the most accessible websites?",
    answer:
      "In the February 2026 WebAIM Million sample, Government home pages had the fewest automatically detected errors at 42.4 per page, 24.4% below the million-page average of 56.1. Non-Profit and Charity followed at 43.0, then Science at 45.0, Personal Finance at 45.4, and Careers at 46.2. The pattern across the top of the table is regulation: these are largely the sectors covered by Section 508, ADA Title II, and the EU Web Accessibility Directive.",
  },
  {
    question: "Which industry has the least accessible websites?",
    answer:
      "Sports home pages averaged the most detected errors at 71.4 per page, 27.3% above the million-page average, followed closely by Shopping at 71.0. Style and Fashion, Home and Garden, and Hobbies and Interests also sat well above average. Consumer retail and media sectors dominate the bottom of the table, which is consistent with heavier use of carousels, image galleries, and third-party marketing scripts.",
  },
  {
    question: "Why do government websites score better on accessibility?",
    answer:
      "The most likely explanation is sustained legal obligation. Public sector sites in the United States have been covered by Section 508 since 1998 and by ADA Title II rulemaking more recently, while EU public sector bodies fall under the Web Accessibility Directive with mandatory accessibility statements and monitoring. That produces procurement requirements, audits, and staff whose job includes accessibility. It is worth noting the ceiling is still low: 42.4 detected errors per page is better than average, not good.",
  },
  {
    question: "How accessible are ecommerce websites?",
    answer:
      "Shopping was the second worst of the 29 categories at 71.0 detected errors per home page, 26.6% above average. That is corroborated by platform-level data in the same study, where Shopify averaged 75.1, Magento 75.8, and PrestaShop 143.2, all above the million-page average. Retail is also the sector that attracts the largest share of digital accessibility lawsuits, so the measured barrier count and the legal exposure point the same direction.",
  },
  {
    question: "How should I use these sector benchmarks?",
    answer:
      "Use them as a comparison point in an audit or a business case, not as a target. If your own automated scan returns fewer errors than your sector average you are ahead of your peers, which is a useful argument for a budget conversation, but it says nothing about whether disabled users can complete a task on your site. The benchmarks cover home pages only, so your checkout, portal, or application flow is not represented at all.",
  },
  {
    question: "Does a good sector average mean my site is compliant?",
    answer:
      "No. Automated testing detects only a subset of WCAG success criteria, and WebAIM is explicit that the absence of detected errors does not mean a page is accessible or conformant. A sector average is an aggregate of home pages built by organisations with very different budgets and obligations. Compliance is determined by evaluating your own site, including manual keyboard testing, assistive technology testing, and the user journeys that matter to your users.",
  },
];

const reportLinks = [
  { href: "#summary", label: "Summary" },
  { href: "#how-to-read", label: "How to read it" },
  { href: "#categories", label: "Sectors" },
  { href: "#sectors", label: "Interpretation" },
  { href: "#languages", label: "Languages" },
  { href: "#methodology", label: "Methodology" },
  { href: "#downloads", label: "Downloads" },
];

export default function AccessibilityByIndustryPage() {
  const sorted = [...industryData.categories].sort(
    (a, b) => a.avgErrors - b.avgErrors,
  );
  const best = sorted[0];
  const worst = sorted[sorted.length - 1];

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
        headline="Web Accessibility by Industry 2026"
        description="Average detected accessibility errors per home page across 29 industry sectors and 17 languages, from the WebAIM Million 2026 dataset."
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
        dateModified={getRouteDate("/research/accessibility-by-industry") ?? "2026-08-27"}
        image="https://accessibility.build/og-image.png"
        url={reportUrl}
        wordCount={1900}
        keywords={[
          "web accessibility",
          "accessibility by industry",
          "sector benchmark",
          "WebAIM Million",
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
                By industry
              </span>
            </nav>

            <div className="mt-6 flex flex-wrap gap-2">
              <Badge variant="secondary">Research report</Badge>
              <Badge variant="outline">Primary data: Feb 2026</Badge>
              <Badge variant="outline">
                {industryData.categories.length} sectors
              </Badge>
              <Badge variant="outline">Reviewed: Aug 27, 2026</Badge>
            </div>

            <div className="mt-6 max-w-4xl">
              <h1 className="text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl lg:text-6xl dark:text-white">
                Web Accessibility by Industry
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl dark:text-slate-300">
                Average detected accessibility errors per home page across{" "}
                {industryData.categories.length} sectors, from government and
                education to retail and sport, measured on one million sites.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                asChild
                className="bg-teal-700 text-white hover:bg-teal-800"
              >
                <a href="#download-report">
                  <ArrowDownToLine aria-hidden="true" />
                  Download data
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
                The sectors with the fewest detected barriers are the ones that
                have been legally required to care the longest. Government,
                non-profit, and education lead; shopping and sport trail by
                roughly 29 errors per page.
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
                . Automated results do not establish WCAG conformance.
              </p>
            </div>

            <dl className="mt-8 grid gap-px overflow-hidden rounded-lg border border-slate-200 bg-slate-200 dark:border-slate-700 dark:bg-slate-700 sm:grid-cols-3">
              <div className="bg-white px-5 py-4 dark:bg-slate-900">
                <dt className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                  <Gauge className="h-4 w-4" aria-hidden="true" />
                  Million-page average
                </dt>
                <dd className="mt-1.5 font-semibold">
                  {industryData.baselineErrors} errors
                </dd>
              </div>
              <div className="bg-white px-5 py-4 dark:bg-slate-900">
                <dt className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                  <Landmark className="h-4 w-4" aria-hidden="true" />
                  Best sector
                </dt>
                <dd className="mt-1.5 font-semibold">
                  {best.name} ({best.avgErrors})
                </dd>
              </div>
              <div className="bg-white px-5 py-4 dark:bg-slate-900">
                <dt className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                  <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                  Worst sector
                </dt>
                <dd className="mt-1.5 font-semibold">
                  {worst.name} ({worst.avgErrors})
                </dd>
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
                  Obligation predicts accessibility better than budget
                </h2>
                <p className="mt-5 max-w-[68ch] leading-7 text-slate-600 dark:text-slate-400">
                  Government, non-profit, and education sites are not the
                  best-funded on the web, but they sit at the top of this table.
                  Retail, travel, and entertainment sites have far larger
                  budgets and sit at the bottom. The difference between them is
                  that one group has had a legal duty for decades.
                </p>
                <p className="mt-4 max-w-[68ch] text-sm leading-6 text-slate-500 dark:text-slate-400">
                  Even the leaders are not doing well in absolute terms. The
                  best sector still averaged {best.avgErrors} automatically
                  detected errors on its home page.
                </p>
              </div>

              <div className="divide-y divide-slate-200 border-y border-slate-200 dark:divide-slate-800 dark:border-slate-800 lg:col-span-7">
                {[
                  [
                    "01",
                    "Regulated sectors lead",
                    `${best.name} at ${best.avgErrors} errors, then Non-Profit at 43.0 and Science at 45.0. Education came in at 48.9, all below the ${industryData.baselineErrors} average.`,
                  ],
                  [
                    "02",
                    "Commerce and media trail",
                    `${worst.name} was worst at ${worst.avgErrors}, with Shopping at 71.0 and Style and Fashion at 66.7. These are the sectors built around imagery, carousels, and marketing scripts.`,
                  ],
                  [
                    "03",
                    "No sector is close to conformant",
                    "The spread from best to worst is about 29 errors per home page. Every sector average is far above zero, so this is a comparison of degrees of failure.",
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
            <AccessibilityByIndustryClient initialData={industryData} />
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
                  What these sector averages support, and what they do not.
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
            <DatasetDownloads
              dataset="by-industry"
              name="Accessibility errors by industry"
              description="Average detectable WCAG errors per home page by site category and by language, from the WebAIM Million 2026."
              pageUrl="https://accessibility.build/research/accessibility-by-industry"
              datePublished="2026-08-27"
              dateModified="2026-08-27"
              temporalCoverage="2026"
              attribution="WebAIM Million 2026"
              withSchema={true}
              tables={[
                  { key: "categories", label: "Errors by category" },
                  { key: "languages", label: "Errors by language" },
              ]}
            />
            <RelatedContent
              content="web accessibility by industry sector government education healthcare ecommerce retail accessibility statistics benchmark WebAIM Million compliance"
              maxItems={3}
            />
          </div>
        </div>
      </div>
    </>
  );
}
