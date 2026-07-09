import type { Metadata } from "next"
import Link from "next/link"
import {
  ArticleStructuredData,
  BreadcrumbStructuredData,
} from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"
import { CriterionLinks } from "@/components/wcag/criterion-links"

export const metadata: Metadata = {
  title: "WCAG 2.4.6 Headings and Labels — Descriptive Headings",
  description:
    "Complete guide to WCAG 2.4.6 Headings and Labels. Learn what counts as a 'label', why descriptive headings and labels matter for screen reader navigation, copy-ready HTML examples, common mistakes like generic 'More' links and placeholder-only labels, and exactly how to test it.",
  keywords: [
    "WCAG 2.4.6",
    "Headings and Labels",
    "descriptive headings",
    "descriptive labels",
    "accessible headings",
    "form label accessibility",
    "heading structure accessibility",
    "screen reader headings",
    "2.4.6 test",
    "generic link text",
    "placeholder label",
    "Level AA",
    "WCAG 2.2",
    "navigable",
  ],
  alternates: {
    canonical: "https://accessibility.build/wcag/2-4-6",
  },
  openGraph: {
    title:
      "WCAG 2.4.6 Headings and Labels — Write Descriptive Headings & Form Labels (Level AA)",
    description:
      "The definitive guide to WCAG 2.4.6: what a 'label' really means, why descriptive headings power screen reader navigation, HTML examples, common mistakes, and how to test for 2.4.6 Level AA.",
    url: "https://accessibility.build/wcag/2-4-6",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: "https://accessibility.build/api/og?title=WCAG%202.4.6%20Headings%20and%20Labels&section=WCAG",
        width: 1200,
        height: 630,
        alt: "WCAG 2.4.6 Headings and Labels guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WCAG 2.4.6 Headings and Labels — The Complete Guide",
    description:
      "Headings and labels must describe topic or purpose. What counts as a label, why it matters for screen reader navigation, examples, mistakes, and how to test 2.4.6 Level AA.",
  },
}

const faqs = [
  {
    q: "What does WCAG 2.4.6 Headings and Labels require?",
    a: "It requires that any headings and labels present on a page describe their topic or purpose. The full normative text is just one sentence: 'Headings and labels describe topic or purpose.' It does not force you to add headings or labels where none exist — that is covered by other criteria — but wherever you do use a heading or a label, it must be meaningful and specific enough that a user can understand what the section contains or what a control does. It is a Level AA success criterion introduced in WCAG 2.0 and carried into WCAG 2.1 and 2.2.",
  },
  {
    q: "Does 2.4.6 require every page and form field to have a heading or label?",
    a: "No — that is the most common misreading. 2.4.6 is a quality bar, not a presence requirement. It only applies to the headings and labels you already have, and asks that they be descriptive. The requirement to actually provide a label for a form control comes from 3.3.2 Labels or Instructions (Level A) and 1.3.1 Info and Relationships. So the two work together: 3.3.2 and 1.3.1 say a label must exist and be programmatically associated, and 2.4.6 says that label must clearly describe the field's purpose.",
  },
  {
    q: "What counts as a 'label' in WCAG 2.4.6?",
    a: "WCAG uses 'label' more broadly than the HTML <label> element. A label is any text or component presented to users to identify a component within the web content — form field labels, but also button text, link text used as a control name, tab labels, and the accessible names of interactive widgets. So 2.4.6 covers the visible text of a 'Submit order' button and the label on an email field alike. It does not, however, cover every piece of body text — only text that acts as a heading or as a label for a control.",
  },
  {
    q: "Do headings and labels have to be unique to pass 2.4.6?",
    a: "Uniqueness is not strictly required, but it helps. The criterion only asks that headings and labels be descriptive, not that no two are ever the same. That said, when several headings or labels sit near each other and read identically — three 'Read more' links, or two 'Name' fields with no further distinction — they stop describing their individual purpose. The practical fix is to make each one specific: 'Read more about pricing', 'First name', 'Company name'. Descriptive usually ends up being unique where it needs to be.",
  },
  {
    q: "How is 2.4.6 different from 1.3.1, 2.4.10, and 2.4.4?",
    a: "They form a cluster around structure and naming. 1.3.1 Info and Relationships (A) is about marking headings up as real headings and associating labels programmatically — the structure must exist in code. 2.4.10 Section Headings (AAA) goes further and expects headings to actually organize the content into sections. 2.4.4 Link Purpose (In Context) (A) is specifically about links being understandable from their text plus context. 2.4.6 sits across all of them at AA: whatever headings and labels you have, in code and on screen, must clearly describe topic or purpose.",
  },
  {
    q: "Is placeholder text a valid label under 2.4.6?",
    a: "No. Placeholder text disappears as soon as the user starts typing, is often too low-contrast to read, and is not reliably exposed as the field's accessible name — so it fails both 3.3.2 (a persistent label must exist) and, in spirit, 2.4.6 (the label the user relies on is gone when they need it). Always provide a real, persistent <label> that describes the field's purpose, and treat placeholder text only as an optional formatting hint, never as the label itself.",
  },
]

export default function WCAG246Page() {
  return (
    <>
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "WCAG Success Criteria", url: "https://accessibility.build/wcag" },
          {
            name: "2.4.6 Headings and Labels",
            url: "https://accessibility.build/wcag/2-4-6",
          },
        ]}
      />

      <ArticleStructuredData
        headline="WCAG 2.4.6 Headings and Labels: The Complete Guide to Descriptive Headings and Form Labels"
        description="The definitive guide to WCAG 2.4.6 Headings and Labels: what counts as a label, why descriptive headings power screen reader navigation, HTML examples, common mistakes, and testing methods."
        author={{
          name: "Accessibility.build Team",
          url: "https://accessibility.build/about",
        }}
        publisher={{
          name: "Accessibility.build",
          logo: "https://accessibility.build/android-chrome-512x512.png",
        }}
        datePublished="2026-07-08"
        dateModified="2026-07-08"
        image="https://accessibility.build/api/og?title=WCAG%202.4.6%20Headings%20and%20Labels&section=WCAG"
        url="https://accessibility.build/wcag/2-4-6"
        wordCount={2800}
        keywords={[
          "WCAG 2.4.6",
          "Headings and Labels",
          "descriptive headings",
          "descriptive labels",
          "screen reader headings",
          "form label accessibility",
          "Level AA",
        ]}
      />

      {/* FAQ structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />

      <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
        {/* Breadcrumb Navigation */}
        <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <li>
                  <Link
                    href="/"
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li aria-hidden="true" className="text-slate-400">
                  /
                </li>
                <li>
                  <Link
                    href="/wcag"
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    WCAG Success Criteria
                  </Link>
                </li>
                <li aria-hidden="true" className="text-slate-400">
                  /
                </li>
                <li>
                  <span className="text-slate-900 dark:text-white font-medium">
                    2.4.6 Headings and Labels
                  </span>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <header className="mb-12">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                Level AA
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Principle 2: Operable
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                Powers screen reader navigation
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
              WCAG 2.4.6: Headings and Labels
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              Screen reader users skim a page the way sighted users do — by jumping
              between headings and reading the labels on controls. This criterion asks
              one simple thing:{" "}
              <strong className="text-slate-900 dark:text-white">
                the headings and labels you use must describe their topic or purpose
              </strong>
              . A heading called &ldquo;More&rdquo; or a field labelled
              &ldquo;Input&rdquo; tells nobody anything. Specific, meaningful text is
              what makes a page navigable.
            </p>
          </header>

          {/* Official text callout */}
          <section
            aria-labelledby="official-text"
            className="mb-12 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 p-6"
          >
            <h2
              id="official-text"
              className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-3"
            >
              The success criterion, in full
            </h2>
            <blockquote className="text-slate-700 dark:text-slate-300 leading-relaxed border-l-4 border-blue-500 pl-4">
              Headings and labels describe topic or purpose.
            </blockquote>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4 text-sm">
              That single sentence is the entire normative requirement. Note what it
              does <em>not</em> say: it does not require you to add headings or labels
              where none exist. It governs only the headings and labels that are
              present — those must be descriptive.
            </p>
          </section>

          {/* On this page */}
          <nav
            aria-label="On this page"
            className="mb-12 rounded-xl border border-slate-200 dark:border-slate-800 p-6"
          >
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
              On this page
            </h2>
            <ul className="grid sm:grid-cols-2 gap-2 text-blue-600 dark:text-blue-400">
              <li>
                <a className="hover:underline" href="#why">
                  Why headings and labels matter
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#what-is-a-label">
                  What counts as a &ldquo;label&rdquo;
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#not-presence">
                  Descriptive, not present
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#code">
                  Code examples
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#mistakes">
                  Common mistakes
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#testing">
                  How to test
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#related-criteria">
                  Related success criteria
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#faq">
                  FAQ
                </a>
              </li>
            </ul>
          </nav>

          {/* Why */}
          <section aria-labelledby="why" className="mb-12">
            <h2
              id="why"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Why headings and labels matter
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              A sighted user scanning a long page never reads it top to bottom. Their
              eye jumps to the bold section titles, finds the part they need, and dives
              in. Screen reader users do exactly the same thing — but they do it with a
              keyboard shortcut. Pressing <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-xs">H</kbd>{" "}
              in most screen readers jumps to the next heading; opening the rotor or
              elements list shows every heading on the page at once. This only works if
              the headings actually say what each section is about.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              The same is true of labels. When a user tabs into a form field, the
              screen reader announces its label. &ldquo;Email address, edit text&rdquo;
              tells them exactly what to type. &ldquo;Edit text&rdquo; with no useful
              label — or a label like &ldquo;Field 3&rdquo; — leaves them guessing, and
              the cost of guessing wrong on a checkout or a job application is high.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              This benefits everyone, not just screen reader users. Clear headings help
              people with cognitive disabilities build a mental model of the page,
              help people with low vision who zoom in and lose the surrounding context,
              and — as a bonus — give search engines the structural signals they use to
              understand and rank your content. Descriptive headings and labels are
              simply good writing.
            </p>
          </section>

          {/* What is a label */}
          <section aria-labelledby="what-is-a-label" className="mb-12">
            <h2
              id="what-is-a-label"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              What counts as a &ldquo;label&rdquo;
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              This trips people up, because WCAG uses <em>label</em> more broadly than
              the HTML <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">&lt;label&gt;</code>{" "}
              element. In WCAG, a label is any text or component that identifies a
              control for the user. So 2.4.6 reaches further than just form fields:
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  t: "Section headings",
                  d: "Every h1–h6 on the page. The title of a section must describe what that section contains.",
                },
                {
                  t: "Form field labels",
                  d: "The visible label associated with an input, select, textarea, checkbox, or radio group.",
                },
                {
                  t: "Button and link text",
                  d: "The accessible name of a button or a link that acts as a control — 'Download report', not 'Click here'.",
                },
                {
                  t: "Widget names",
                  d: "The names of tabs, accordions, dialogs, and other ARIA widgets that identify their purpose to the user.",
                },
              ].map((item) => (
                <div
                  key={item.t}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 p-5"
                >
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                    {item.t}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                    {item.d}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-6">
              What 2.4.6 does <em>not</em> cover is ordinary body text. A paragraph in
              the middle of an article is neither a heading nor a label, so this
              criterion says nothing about it. The scope is specifically text that acts
              as a heading or that names a control.
            </p>
          </section>

          {/* Descriptive not present */}
          <section aria-labelledby="not-presence" className="mb-12">
            <h2
              id="not-presence"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Descriptive, not present
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              The single most important thing to understand about 2.4.6 is that it is a{" "}
              <strong className="text-slate-900 dark:text-white">
                quality requirement, not a presence requirement
              </strong>
              . It does not say &ldquo;you must have headings&rdquo; or &ldquo;every
              field needs a label.&rdquo; It says that <em>if</em> you have headings and
              labels, they must be descriptive.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              The requirement that a label must actually <em>exist</em> and be wired up
              in code comes from two other criteria you should satisfy together with
              this one:
            </p>
            <ul className="space-y-3 mb-4">
              <li className="flex gap-3 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
                <span aria-hidden="true" className="text-blue-500 font-bold">
                  →
                </span>
                <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  <Link href="/wcag/1-3-1" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">1.3.1 Info and Relationships</Link>{" "}
                  (A) — headings must be marked up as real headings, and labels must be
                  programmatically associated with their controls.
                </span>
              </li>
              <li className="flex gap-3 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
                <span aria-hidden="true" className="text-blue-500 font-bold">
                  →
                </span>
                <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  <Link href="/wcag/3-3-2" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">3.3.2 Labels or Instructions</Link>{" "}
                  (A) — form controls that need a label to be understood must have one.
                </span>
              </li>
            </ul>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Think of it as a pipeline: 1.3.1 and 3.3.2 make sure the heading or label
              exists and is exposed correctly; 2.4.6 makes sure the words themselves are
              worth reading. Passing 2.4.6 while failing 1.3.1 (for example, a
              &ldquo;heading&rdquo; that is only bold text, not an actual{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">&lt;h2&gt;</code>
              ) still leaves the page inaccessible — so aim to satisfy all three.
            </p>
          </section>

          {/* Code examples */}
          <section aria-labelledby="code" className="mb-12">
            <h2
              id="code"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Code examples
            </h2>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Vague vs. descriptive headings
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              A heading pulled out of context, in a screen reader&rsquo;s headings list,
              has to stand on its own. &ldquo;Overview&rdquo; and &ldquo;Details&rdquo;
              repeated three times down a page describe nothing.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- ✗ Vague: identical, non-descriptive headings -->
<h2>Overview</h2>
<h2>Overview</h2>
<h2>More</h2>

<!-- ✓ Descriptive: each heading names its section -->
<h2>Pricing overview</h2>
<h2>Team plan features</h2>
<h2>Frequently asked questions</h2>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Real, descriptive form labels
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Associate a persistent <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">&lt;label&gt;</code>{" "}
              with each control using{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">for</code>
              /
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">id</code>
              , and make the text say exactly what belongs in the field.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- ✗ Non-descriptive, and placeholder used as the label -->
<input type="text" placeholder="Enter value" />
<label for="f2">Field</label>
<input id="f2" type="text" />

<!-- ✓ Descriptive labels, persistent and associated -->
<label for="work-email">Work email address</label>
<input id="work-email" type="email" autocomplete="email" />

<label for="card-number">Card number</label>
<input id="card-number" inputmode="numeric" autocomplete="cc-number" />`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Distinguish repeated link and button labels
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Several &ldquo;Read more&rdquo; links in a row all read the same in a
              links list. Extend the accessible name so each describes its own
              destination — a visible extension is best, but a visually-hidden span or
              a matching{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">aria-label</code>{" "}
              works too.
            </p>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- ✗ Ambiguous: three identical link names -->
<a href="/pricing">Read more</a>
<a href="/security">Read more</a>

<!-- ✓ Each label describes its own purpose -->
<a href="/pricing">Read more<span class="sr-only"> about pricing</span></a>
<a href="/security">Read more<span class="sr-only"> about security</span></a>

<!-- ✓ Or an explicit, descriptive button label -->
<button type="submit">Place order &amp; pay $49</button>`}</code>
            </pre>
          </section>

          {/* Common mistakes */}
          <section aria-labelledby="mistakes" className="mb-12">
            <h2
              id="mistakes"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Common mistakes
            </h2>
            <ul className="space-y-3">
              {[
                "Generic headings like 'Overview', 'Introduction', 'Section 1', or 'More' that do not say what the section is actually about.",
                "Placeholder text used in place of a real label — it vanishes on typing, is low contrast, and is not a reliable accessible name.",
                "Form labels that describe the format instead of the purpose, e.g. 'MM/DD/YYYY' as the only label instead of 'Date of birth'.",
                "Repeated 'Read more', 'Click here', 'Learn more', or 'Details' links whose labels are indistinguishable out of context.",
                "Vague button names such as 'Submit', 'OK', or 'Go' where a specific action — 'Create account', 'Apply filters' — would be clearer.",
                "Icon-only buttons with no accessible name at all (e.g. a bare magnifying-glass button with no 'Search' label).",
                "Headings written for style, not meaning — a marketing tagline as an h2 that reads well visually but describes nothing when isolated.",
                "Using bold or large text that looks like a heading but is not marked up as one, so it fails 1.3.1 and provides no navigable heading.",
              ].map((m) => (
                <li
                  key={m}
                  className="flex gap-3 rounded-lg border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-4"
                >
                  <span aria-hidden="true" className="text-rose-500 font-bold">
                    ✗
                  </span>
                  <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {m}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Testing */}
          <section aria-labelledby="testing" className="mb-12">
            <h2
              id="testing"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              How to test for 2.4.6
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "List every heading and read it in isolation",
                  d: "Use a screen reader's headings list (VoiceOver rotor, NVDA/JAWS elements list) or a browser extension that outlines the heading structure. Read each heading on its own — with no surrounding content — and ask whether it describes the section that follows. If it could belong to any section, it is not descriptive enough.",
                },
                {
                  t: "Tab through every form control",
                  d: "Move through each field with the Tab key and listen to what the screen reader announces. The announced name should tell you exactly what to enter. 'Edit text' with no useful label, or a name like 'Field', is a failure.",
                },
                {
                  t: "Pull up the links and buttons list",
                  d: "Open the screen reader's list of links (and of form controls). Scan for duplicates like several 'Read more' entries, and for generic names like 'Click here' or 'Submit' that don't say what happens. Each should describe its own purpose.",
                },
                {
                  t: "Check for descriptive intent, not just presence",
                  d: "Automated tools can flag a missing label or an empty heading, but they cannot judge whether the words are meaningful — a heading called 'Stuff' passes an automated check and fails 2.4.6. This is fundamentally a manual, human-judgment review.",
                },
                {
                  t: "Verify against the page title and purpose",
                  d: "Confirm the top-level heading and section headings match what the page and its sections are really about. Cross-check with 2.4.2 Page Titled so the page title, h1, and section headings tell one consistent story.",
                },
              ].map((step, i) => (
                <li
                  key={step.t}
                  className="flex gap-4 rounded-xl border border-slate-200 dark:border-slate-800 p-5"
                >
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                      {step.t}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      {step.d}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-5">
              Because 2.4.6 is a judgment call about wording, it is one of the criteria
              automated scanners consistently miss. Use the{" "}
              <Link
                href="/tools/heading-analyzer"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Heading Analyzer
              </Link>{" "}
              to surface every heading at once for review, then work through the full{" "}
              <Link
                href="/checklists/wcag-2-2"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                WCAG 2.2 checklist
              </Link>
              .
            </p>
          </section>

          {/* Related criteria */}
          <div id="related-criteria">
            <CriterionLinks number="2.4.6" />
          </div>

          {/* FAQ */}
          <section aria-labelledby="faq" className="mb-4">
            <h2
              id="faq"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-6"
            >
              Frequently asked questions
            </h2>
            <div className="space-y-4">
              {faqs.map((f) => (
                <details
                  key={f.q}
                  className="group rounded-xl border border-slate-200 dark:border-slate-800 p-5 [&_summary]:cursor-pointer"
                >
                  <summary className="font-semibold text-slate-900 dark:text-white list-none flex items-center justify-between gap-4">
                    {f.q}
                    <span
                      aria-hidden="true"
                      className="text-slate-400 group-open:rotate-180 transition-transform"
                    >
                      ▾
                    </span>
                  </summary>
                  <p className="mt-3 text-slate-600 dark:text-slate-300 leading-relaxed">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </section>
        </article>

        {/* Related content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <RelatedContent
            content="headings and labels descriptive headings descriptive labels form label accessibility screen reader heading navigation heading structure link purpose read more generic link text placeholder label info and relationships labels or instructions name role value navigable WCAG 2.4.6 Level AA"
            maxItems={6}
          />
        </section>
      </div>
    </>
  )
}
