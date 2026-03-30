import type { Metadata } from "next"
import Link from "next/link"
import { BreadcrumbStructuredData, ArticleStructuredData } from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"
import { AriaReferenceClient } from "./client-page"

export const metadata: Metadata = {
  title: "ARIA Roles & Attributes Reference | Interactive Cheat Sheet & Playground | Accessibility.build",
  description:
    "The complete interactive WAI-ARIA reference with searchable roles, attributes, live playground, screen reader behavior, ARIA vs native HTML comparisons, and copy-paste code patterns.",
  keywords: [
    "aria roles",
    "aria attributes",
    "aria-label",
    "aria-labelledby",
    "wai-aria reference",
    "aria cheat sheet",
    "aria playground",
    "aria roles list",
    "aria validator",
    "aria-describedby",
    "aria-hidden",
    "aria-expanded",
    "aria accessibility",
    "screen reader aria",
    "aria best practices",
    "aria vs html",
  ],
  openGraph: {
    title: "ARIA Roles & Attributes Reference | Interactive Cheat Sheet & Playground",
    description:
      "The complete interactive WAI-ARIA reference with searchable roles, attributes, live playground, screen reader behavior, and copy-paste code patterns.",
    url: "https://accessibility.build/reference/aria",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "ARIA Roles & Attributes Reference | Accessibility.build",
    description:
      "The complete interactive WAI-ARIA reference with searchable roles, attributes, live playground, and screen reader behavior.",
  },
  alternates: {
    canonical: "https://accessibility.build/reference/aria",
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
  },
}

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Reference", url: "https://accessibility.build/reference" },
  { name: "ARIA Roles & Attributes", url: "https://accessibility.build/reference/aria" },
]

const faqItems = [
  {
    question: "What is WAI-ARIA?",
    answer:
      "WAI-ARIA (Web Accessibility Initiative - Accessible Rich Internet Applications) is a W3C specification that defines how to make dynamic web content and custom UI components accessible to people with disabilities. It provides a set of roles, states, and properties that supplement HTML to convey meaning and behavior to assistive technologies like screen readers.",
  },
  {
    question: "When should I use ARIA instead of native HTML?",
    answer:
      "You should only use ARIA when there is no native HTML element that provides the semantics you need. Native HTML elements like <button>, <nav>, and <input> already have built-in accessibility semantics and keyboard behavior. ARIA should be used to enhance custom widgets, dynamic content regions, and complex UI patterns that cannot be built with native HTML alone.",
  },
  {
    question: "What is the difference between aria-label and aria-labelledby?",
    answer:
      "aria-label provides an accessible name as a plain text string directly on the element, while aria-labelledby references the ID of another visible element whose text content serves as the label. Use aria-labelledby when a visible label already exists on the page, and aria-label when no visible label is present.",
  },
  {
    question: "What are ARIA landmark roles?",
    answer:
      "ARIA landmark roles identify major sections of a page so assistive technology users can navigate quickly between them. The landmark roles include banner, navigation, main, complementary, contentinfo, search, form, and region. Most of these have equivalent HTML5 elements such as <header>, <nav>, <main>, <aside>, and <footer>.",
  },
  {
    question: "How do screen readers handle ARIA?",
    answer:
      "Screen readers use ARIA roles, states, and properties to build an accessibility tree that represents the page structure. When a user encounters an element with ARIA attributes, the screen reader announces its role, name, and current state. For example, a button with aria-expanded=\"false\" would be announced as a collapsed button.",
  },
  {
    question: "What is the first rule of ARIA?",
    answer:
      "The first rule of ARIA is: do not use ARIA if you can use a native HTML element or attribute with the semantics and behavior you require already built in. Native elements have built-in keyboard interactions and accessibility support that ARIA cannot replicate without additional JavaScript.",
  },
  {
    question: "What version of ARIA is current?",
    answer:
      "WAI-ARIA 1.2 is the current W3C Recommendation, published in June 2023. WAI-ARIA 1.3 is in development as a Working Draft. Each new version introduces additional roles, states, and properties while deprecating patterns that are no longer recommended.",
  },
  {
    question: "What are common ARIA mistakes to avoid?",
    answer:
      "Common ARIA mistakes include using redundant roles on native elements (e.g., role=\"button\" on a <button>), using aria-hidden=\"true\" on focusable elements, applying incorrect roles to interactive widgets, and forgetting to manage focus and keyboard behavior for custom components. ARIA only changes what assistive technology perceives, not how an element actually behaves.",
  },
]

export default function AriaReferencePage() {
  return (
    <>
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />

      <ArticleStructuredData
        headline="ARIA Roles & Attributes Reference | Interactive Cheat Sheet & Playground"
        description="The complete interactive WAI-ARIA reference with searchable roles, attributes, live playground, screen reader behavior, ARIA vs native HTML comparisons, and copy-paste code patterns."
        author={{ name: "Accessibility.build", url: "https://accessibility.build" }}
        publisher={{
          name: "Accessibility.build",
          logo: "https://accessibility.build/android-chrome-512x512.png",
        }}
        datePublished="2026-03-30"
        dateModified="2026-03-30"
        image="https://accessibility.build/og-image.png"
        url="https://accessibility.build/reference/aria"
        wordCount={5000}
        keywords={[
          "aria roles",
          "aria attributes",
          "wai-aria reference",
          "aria cheat sheet",
          "aria playground",
          "screen reader aria",
          "aria best practices",
        ]}
      />

      {/* FAQ Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqItems.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.answer,
              },
            })),
          }),
        }}
      />

      {/* HowTo Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "How to Test ARIA Markup in the Live Playground",
            step: [
              {
                "@type": "HowToStep",
                name: "Write HTML with ARIA",
                text: "Type or paste HTML with ARIA roles and attributes into the editor.",
                position: 1,
              },
              {
                "@type": "HowToStep",
                name: "Preview Accessibility Tree",
                text: "See the computed roles, names, and states as they appear to assistive technology.",
                position: 2,
              },
              {
                "@type": "HowToStep",
                name: "Check Screen Reader Output",
                text: "Review what screen readers would announce for your markup.",
                position: 3,
              },
            ],
          }),
        }}
      />

      <div className="min-h-screen pt-12 bg-gradient-to-br from-violet-50/50 via-background to-indigo-50/50 dark:from-violet-950/10 dark:via-background dark:to-indigo-950/10">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <ol className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <span className="text-slate-500 dark:text-slate-500">Reference</span>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <span className="font-medium text-slate-900 dark:text-white" aria-current="page">
                  ARIA Roles & Attributes
                </span>
              </li>
            </ol>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="pt-12 pb-6 px-4 sm:px-6">
          <div className="container mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-violet-500/10 to-indigo-500/10 border border-violet-200/50 dark:border-violet-800/50 mb-6">
              <span className="text-sm font-medium text-violet-700 dark:text-violet-300">
                Interactive Reference &bull; WAI-ARIA 1.2 &bull; Free
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              ARIA Roles & Attributes{" "}
              <span className="text-violet-600 dark:text-violet-400">Reference</span>
            </h1>
            <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
              The complete interactive WAI-ARIA reference. Search roles and attributes, explore screen reader
              behavior, compare ARIA with native HTML, and test markup in a live playground.
            </p>

            {/* Stats Bar */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground mt-6 mb-4">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-violet-600 dark:text-violet-400">25</span>
                <span>Roles</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">20</span>
                <span>Attributes</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-purple-600 dark:text-purple-400">Live</span>
                <span>Playground</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-fuchsia-600 dark:text-fuchsia-400">Screen Reader</span>
                <span>Behavior</span>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Client Component */}
        <main>
          <AriaReferenceClient />
        </main>

        {/* Related Content */}
        <section className="pb-12 px-4 sm:px-6">
          <div className="container mx-auto max-w-4xl">
            <RelatedContent
              content="aria roles attributes wai-aria accessibility screen reader semantic html"
              title="Related Resources"
              maxItems={3}
              showDescriptions={true}
            />
          </div>
        </section>
      </div>
    </>
  )
}
