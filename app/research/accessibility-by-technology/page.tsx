import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowDownToLine,
  CalendarDays,
  ChevronRight,
  Database,
  ExternalLink,
  Gauge,
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
import technologyData from "@/lib/data/accessibility-by-technology.json";
import { AccessibilityByTechnologyClient } from "./AccessibilityByTechnologyClient";

const reportUrl =
  "https://accessibility.build/research/accessibility-by-technology";
const webaimUrl = "https://webaim.org/projects/million/";

const pageTitle = "Web Accessibility by Technology Stack";

export const metadata: Metadata = {
  title: "Accessibility by CMS & Framework 2026 | Research Report",
  description:
    "Which CMS, JavaScript framework, and platform ships the fewest accessibility errors? Measured across one million home pages in February 2026, with WordPress, Drupal, React, Vue, Shopify, Bootstrap, and 40 more compared against the average.",
  keywords: [
    "most accessible CMS",
    "WordPress accessibility",
    "Drupal accessibility",
    "Shopify accessibility",
    "accessible javascript framework",
    "React accessibility statistics",
    "CMS accessibility comparison",
    "jQuery accessibility",
    "Bootstrap accessibility",
    "web accessibility by platform",
  ],
  authors: [{ name: "Accessibility.build", url: "https://accessibility.build" }],
  creator: "Accessibility.build",
  publisher: "Accessibility.build",
  alternates: { canonical: reportUrl },
  openGraph: {
    title: pageTitle,
    description:
      "Average accessibility errors per home page by CMS, JavaScript framework, library, and ecommerce platform, measured across one million sites.",
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
        alt: "Web accessibility by technology stack research report",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description:
      "Average accessibility errors per home page by CMS, framework, library, and ecommerce platform.",
  },
};

const faqs = [
  {
    question: "Which CMS produces the most accessible websites?",
    answer:
      "In the February 2026 WebAIM Million sample, home pages built with Adobe Experience Manager averaged the fewest detected errors at 29.9, followed by Squarespace at 33.0 and Wix at 33.3. Drupal averaged 41.2 and WordPress 52.8, against a million-page average of 56.1. Every mainstream CMS measured came in at or below that average. The important caveat is that these are averages of the sites built on each platform, not a measure of what the platform forces you to produce, and WebAIM states that errors correlated with a technology cannot always be attributed to that technology.",
  },
  {
    question: "Is WordPress accessible?",
    answer:
      "WordPress home pages averaged 52.8 detected errors in February 2026, which is 5.8% better than the million-page average of 56.1. It was the largest sample in the study by a wide margin at 252,302 home pages, so that figure is stable, but it also means the average blends everything from carefully built agency sites to abandoned theme installs. WordPress itself can be used to build a fully conformant site. What drives the error count in practice is the theme, the page builder, and the plugins, not the core CMS.",
  },
  {
    question: "Which JavaScript framework has the best accessibility record?",
    answer:
      "Astro home pages averaged 9.0 detected errors, 84% below the million-page average and the lowest figure of any technology in the study. Next.js followed at 40.9 and React at 43.5. Vue.js averaged 64.6 and AngularJS 76.6, both above average. Astro's result is consistent with what the framework does, which is ship mostly static HTML with little client-side JavaScript, but its sample of 5,472 home pages is small compared with React or Vue and its users skew toward developer-focused sites.",
  },
  {
    question: "Do JavaScript libraries make a website less accessible?",
    answer:
      "In this sample, nearly every popular library was associated with a higher error count than average. SweetAlert2 home pages averaged 101.6 errors, FancyBox 90.0, Select2 82.0, jQuery UI 79.9, and Swiper 74.0, against an average of 56.1. The pattern is that the worst performers are carousels, lightboxes, custom select replacements, and alert replacements, which are precisely the components teams install to avoid building them. This is an association rather than proof of cause: pages carrying many libraries are also more complex overall.",
  },
  {
    question: "Are Shopify stores accessible?",
    answer:
      "Shopify home pages averaged 75.1 detected errors in February 2026, 33.9% above the million-page average. Magento averaged 75.8 and PrestaShop 143.2. Every ecommerce platform measured sat above the average, which matches the finding that Shopping was one of the worst-performing site categories overall. Online retail also attracts the largest share of digital accessibility litigation, so the gap between a storefront's measured errors and its legal exposure is worth taking seriously.",
  },
  {
    question:
      "Does choosing a platform with a good score make my site compliant?",
    answer:
      "No. Automated testing detects only a subset of WCAG requirements, so a low average error count cannot establish conformance for any technology or for any individual site built with it. The averages also describe home pages only, which means checkout flows, dashboards, forms, and authenticated pages were never evaluated. Treat platform choice as one input among many, and verify your own build with manual keyboard testing, screen reader testing, and a full WCAG 2.2 audit.",
  },
];

const reportLinks = [
  { href: "#summary", label: "Summary" },
  { href: "#how-to-read", label: "How to read it" },
  { href: "#cms", label: "CMS" },
  { href: "#js-frameworks", label: "Frameworks" },
  { href: "#js-libraries", label: "Libraries" },
  { href: "#ecommerce", label: "Ecommerce" },
  { href: "#what-to-do", label: "Interpretation" },
  { href: "#methodology", label: "Methodology" },
  { href: "#downloads", label: "Downloads" },
];

export default function AccessibilityByTechnologyPage() {
  const cms = technologyData.groups.find((group) => group.id === "cms");
  const frameworks = technologyData.groups.find(
    (group) => group.id === "js-frameworks",
  );
  const libraries = technologyData.groups.find(
    (group) => group.id === "js-libraries",
  );
  const bestCms = [...(cms?.rows ?? [])].sort(
    (a, b) => a.avgErrors - b.avgErrors,
  )[0];
  const bestFramework = [...(frameworks?.rows ?? [])].sort(
    (a, b) => a.avgErrors - b.avgErrors,
  )[0];
  const worstLibrary = [...(libraries?.rows ?? [])].sort(
    (a, b) => b.avgErrors - a.avgErrors,
  )[0];

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
        headline="Web Accessibility by Technology Stack 2026"
        description="Average detected accessibility errors per home page by CMS, JavaScript framework, library, web framework, and ecommerce platform, from the WebAIM Million 2026 dataset."
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
        wordCount={2100}
        keywords={[
          "web accessibility",
          "CMS accessibility",
          "JavaScript framework accessibility",
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
                By technology stack
              </span>
            </nav>

            <div className="mt-6 flex flex-wrap gap-2">
              <Badge variant="secondary">Research report</Badge>
              <Badge variant="outline">Primary data: Feb 2026</Badge>
              <Badge variant="outline">46 technologies</Badge>
              <Badge variant="outline">Reviewed: Aug 27, 2026</Badge>
            </div>

            <div className="mt-6 max-w-4xl">
              <h1 className="text-4xl font-semibold leading-tight text-slate-950 sm:text-5xl lg:text-6xl dark:text-white">
                Web Accessibility by Technology Stack
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl dark:text-slate-300">
                Average detected accessibility errors per home page, broken down
                by content management system, JavaScript framework, library, and
                ecommerce platform, across one million sites.
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
                Nearly every popular JavaScript widget library was associated
                with more accessibility errors than average, not fewer. The
                worst are carousels, lightboxes, custom selects, and alert
                replacements: the components teams install so they do not have
                to build them.
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
                . Correlation only. Automated results do not establish WCAG
                conformance.
              </p>
            </div>

            <dl className="mt-8 grid gap-px overflow-hidden rounded-lg border border-slate-200 bg-slate-200 dark:border-slate-700 dark:bg-slate-700 sm:grid-cols-4">
              <div className="bg-white px-5 py-4 dark:bg-slate-900">
                <dt className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                  <Gauge className="h-4 w-4" aria-hidden="true" />
                  Million-page average
                </dt>
                <dd className="mt-1.5 font-semibold">
                  {technologyData.baselineErrors} errors
                </dd>
              </div>
              <div className="bg-white px-5 py-4 dark:bg-slate-900">
                <dt className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                  <Database className="h-4 w-4" aria-hidden="true" />
                  Lowest CMS
                </dt>
                <dd className="mt-1.5 font-semibold">
                  {bestCms?.name} ({bestCms?.avgErrors})
                </dd>
              </div>
              <div className="bg-white px-5 py-4 dark:bg-slate-900">
                <dt className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                  <Database className="h-4 w-4" aria-hidden="true" />
                  Lowest framework
                </dt>
                <dd className="mt-1.5 font-semibold">
                  {bestFramework?.name} ({bestFramework?.avgErrors})
                </dd>
              </div>
              <div className="bg-white px-5 py-4 dark:bg-slate-900">
                <dt className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                  <CalendarDays className="h-4 w-4" aria-hidden="true" />
                  Highest library
                </dt>
                <dd className="mt-1.5 font-semibold">
                  {worstLibrary?.name} ({worstLibrary?.avgErrors})
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
                  The platform matters less than what you bolt onto it
                </h2>
                <p className="mt-5 max-w-[68ch] leading-7 text-slate-600 dark:text-slate-400">
                  Every mainstream content management system in the sample came
                  in at or below the million-page average of{" "}
                  {technologyData.baselineErrors} detected errors per home page.
                  The libraries layered on top did not. That is the finding worth
                  acting on, because it points at a decision teams make every
                  sprint rather than once at the start of a project.
                </p>
                <p className="mt-4 max-w-[68ch] text-sm leading-6 text-slate-500 dark:text-slate-400">
                  All figures are averages of the sites measured, not properties
                  of the technologies themselves. The interpretation section
                  explains what that distinction rules out.
                </p>
              </div>

              <div className="divide-y divide-slate-200 border-y border-slate-200 dark:divide-slate-800 dark:border-slate-800 lg:col-span-7">
                {[
                  [
                    "01",
                    "The CMS spread is narrow",
                    `From ${bestCms?.avgErrors} to 52.8 errors across every mainstream platform. Choosing a different CMS moves you less than fixing one bad theme.`,
                  ],
                  [
                    "02",
                    "The library spread is not",
                    `Popular widget libraries ran from 55.3 to ${worstLibrary?.avgErrors} errors, and almost all of them sat above the average.`,
                  ],
                  [
                    "03",
                    "Less JavaScript, fewer errors",
                    `The lowest figure in the entire study was ${bestFramework?.name} at ${bestFramework?.avgErrors} errors, a framework whose entire premise is shipping less client-side JavaScript.`,
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
            <AccessibilityByTechnologyClient initialData={technologyData} />
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
                  What these averages support, and what they do not.
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
              content="web accessibility CMS WordPress Drupal Shopify javascript framework React Vue Angular library jQuery carousel accessibility statistics WebAIM Million platform comparison"
              maxItems={3}
            />
          </div>
        </div>
      </div>
    </>
  );
}
