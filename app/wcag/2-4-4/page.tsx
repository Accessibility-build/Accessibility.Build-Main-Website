import type { Metadata } from "next"
import Link from "next/link"
import {
  ArticleStructuredData,
  BreadcrumbStructuredData,
} from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"
import { CriterionLinks } from "@/components/wcag/criterion-links"

export const metadata: Metadata = {
  title: "WCAG 2.4.4 Link Purpose (In Context) — Link Text Guide",
  description:
    "Complete guide to WCAG 2.4.4 Link Purpose (In Context). Learn how to write descriptive link text, fix 'click here' and 'read more' links, use aria-label and aria-labelledby correctly, and handle icon, image, and ambiguous links — with code examples, testing methods, and common mistakes.",
  keywords: [
    "WCAG 2.4.4",
    "Link Purpose",
    "Link Purpose In Context",
    "descriptive link text",
    "click here link",
    "read more accessibility",
    "ambiguous links",
    "aria-label link",
    "aria-labelledby link",
    "screen reader links",
    "Level A",
    "WCAG 2.2",
    "accessible links",
    "link context",
  ],
  alternates: {
    canonical: "https://accessibility.build/wcag/2-4-4",
  },
  openGraph: {
    title:
      "WCAG 2.4.4 Link Purpose (In Context) — Descriptive Link Text Guide (Level A)",
    description:
      "The definitive guide to WCAG 2.4.4 Link Purpose (In Context): why every link must make sense from its text or surrounding context, how to fix 'click here' links, copy-ready code, and how to test.",
    url: "https://accessibility.build/wcag/2-4-4",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: "https://accessibility.build/api/og?title=WCAG%202.4.4%20Link%20Purpose%20%28In%20Context%29&section=WCAG",
        width: 1200,
        height: 630,
        alt: "WCAG 2.4.4 Link Purpose (In Context) guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WCAG 2.4.4 Link Purpose (In Context) — Descriptive Link Text",
    description:
      "Every link must make sense from its text or its programmatically-determined context. How to write descriptive links, fix 'click here', and meet WCAG 2.4.4 Level A.",
  },
}

const requirements = [
  {
    name: "The link text alone can name the destination",
    summary: "Read with no surrounding words, the link still tells you where it goes.",
    detail:
      "The simplest way to pass 2.4.4 is to make the visible link text describe its own purpose: \"Download the 2026 accessibility report (PDF)\" instead of \"Download\". Screen reader users frequently pull up a list of every link on a page and tab through them out of context, so text that reads clearly on its own is the most robust solution and helps every user scan faster.",
  },
  {
    name: "...or the purpose is clear from programmatically-determined context",
    summary: "The sentence, list item, paragraph, table cell, or heading the link sits in supplies the meaning.",
    detail:
      "2.4.4 also passes when the purpose can be determined from the link text combined with its programmatically-determined context — the enclosing sentence, paragraph, list item, table cell with its header, or the heading the link follows. The key word is programmatically-determined: the relationship must be exposable to assistive technology, not just visually implied by nearby layout. \"Read more\" at the end of a paragraph about the EAA can pass if that paragraph is genuinely the link's context.",
  },
  {
    name: "Identical link text should go to the same place",
    summary: "Don't make two links read the same but point to different destinations.",
    detail:
      "Where two or more links have the same accessible name, users reasonably expect them to do the same thing. If \"Learn more\" appears five times pointing to five different pages, a screen reader user scanning the links list cannot tell them apart. Either make each name unique, or give them distinguishing context that assistive technology can reach.",
  },
]

const exceptions = [
  "When the purpose of a link cannot be determined from the link together with all of its programmatically-determined context, and the link would be ambiguous to users in general — not only to people with disabilities. In that narrow case the criterion does not require it to be resolved, because sighted users are equally in the dark. This is rare in practice; treat it as an edge case, not a loophole.",
]

const faqs = [
  {
    q: "What does WCAG 2.4.4 Link Purpose (In Context) require?",
    a: "WCAG 2.4.4 requires that the purpose of each link can be determined from the link text alone, or from the link text together with its programmatically-determined context — the sentence, paragraph, list item, table cell, or heading it belongs to. The goal is that users, especially screen reader users navigating by a links list, can decide whether to follow a link without having to activate it first. It is a Level A criterion in WCAG 2.0, 2.1, and 2.2, so it applies to virtually every legal and contractual accessibility requirement, including the ADA and Section 508.",
  },
  {
    q: "Are 'click here' and 'read more' links a WCAG 2.4.4 failure?",
    a: "Not automatically — but they usually are in practice. \"Click here\" and \"read more\" pass 2.4.4 only if the surrounding programmatically-determined context makes the destination clear, for example a 'Read more' link sitting at the end of a paragraph that is genuinely its context. The problem is that screen reader users often navigate by pulling up a list of links stripped of surrounding text, where ten identical 'Read more' entries are meaningless. The most robust fix is descriptive visible text ('Read more about the European Accessibility Act'); the next best is a visually-hidden span or aria-label that extends the name.",
  },
  {
    q: "How is 2.4.4 different from 2.4.9 Link Purpose (Link Only)?",
    a: "2.4.4 (Level A) lets you rely on context: the link can be understood from its text plus the sentence, paragraph, or list it sits in. 2.4.9 Link Purpose (Link Only) is a stricter Level AAA criterion that requires the purpose to be clear from the link text by itself, with no context allowed. If you design every link so its text alone is descriptive, you satisfy both at once — which is why writing self-describing links is the recommended approach.",
  },
  {
    q: "How do I make an icon-only or image link accessible for 2.4.4?",
    a: "An icon or image link must have an accessible name that conveys its purpose. For an image link, give the <img> meaningful alt text describing the destination (alt=\"Home\"), not the image (alt=\"logo\"). For an icon link built from an SVG or icon font, add aria-label to the link or a visually-hidden text span, and hide the decorative glyph with aria-hidden=\"true\". An icon link with no accessible name fails both 2.4.4 and 4.1.2 Name, Role, Value.",
  },
  {
    q: "Does aria-label override the visible link text?",
    a: "Yes — aria-label (and aria-labelledby) completely replaces the visible text as the accessible name, so use it carefully. If you add aria-label, make sure it includes the visible words, otherwise you can break 2.5.3 Label in Name for speech-input users who say the visible label. The safest pattern is to keep descriptive visible text and avoid aria-label entirely, or use a visually-hidden span that extends rather than replaces the visible words.",
  },
  {
    q: "Do links that open the same URL but have different text need fixing?",
    a: "No. 2.4.4 is concerned with links whose accessible names are the same but whose destinations differ — those are confusing. Multiple links with different text going to the same place is fine. You can also intentionally give same-destination links the same name; the success criterion specifically warns against the same name pointing to different destinations.",
  },
]

export default function WCAG244Page() {
  return (
    <>
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "WCAG Success Criteria", url: "https://accessibility.build/wcag" },
          {
            name: "2.4.4 Link Purpose (In Context)",
            url: "https://accessibility.build/wcag/2-4-4",
          },
        ]}
      />

      <ArticleStructuredData
        headline="WCAG 2.4.4 Link Purpose (In Context): The Complete Descriptive Link Text Guide"
        description="The definitive guide to WCAG 2.4.4 Link Purpose (In Context): why every link must make sense from its text or context, how to fix 'click here' and 'read more' links, code examples, testing methods, and common mistakes."
        author={{
          name: "Accessibility.build Team",
          url: "https://accessibility.build/about",
        }}
        publisher={{
          name: "Accessibility.build",
          logo: "https://accessibility.build/android-chrome-512x512.png",
        }}
        datePublished="2026-06-28"
        dateModified="2026-06-28"
        image="https://accessibility.build/api/og?title=WCAG%202.4.4%20Link%20Purpose%20%28In%20Context%29&section=WCAG"
        url="https://accessibility.build/wcag/2-4-4"
        wordCount={3000}
        keywords={[
          "WCAG 2.4.4",
          "Link Purpose",
          "descriptive link text",
          "click here link",
          "read more accessibility",
          "aria-label link",
          "Level A",
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
                    2.4.4 Link Purpose (In Context)
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
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                Level A
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Principle 2: Operable
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                The &quot;click here&quot; criterion
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
              WCAG 2.4.4: Link Purpose (In Context)
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              A link should tell you where it goes{" "}
              <strong className="text-slate-900 dark:text-white">
                before you follow it
              </strong>
              . Under 2.4.4, the purpose of every link must be clear from its
              text alone, or from the text together with its{" "}
              <strong className="text-slate-900 dark:text-white">
                programmatically-determined context
              </strong>
              . A page full of &quot;click here&quot; and &quot;read more&quot;
              links — meaningless when a screen reader reads them as a list —
              is the classic failure of this Level A criterion.
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
              The purpose of each link can be determined from the link text alone
              or from the link text together with its programmatically-determined
              link context, except where the purpose of the link would be
              ambiguous to users in general.
            </blockquote>
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
                  Why link purpose matters
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#what">
                  What 2.4.4 actually requires
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#context">
                  What counts as &quot;context&quot;
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#icons">
                  Icon, image &amp; ambiguous links
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#exceptions">
                  The exception
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
              Why link purpose matters
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Screen reader users rarely read a page top to bottom. One of the
              fastest ways to navigate is to open a list of every link on the
              page — in NVDA and JAWS you press a single key to do this — and
              skim it to find the one you want. In that list, each link is read
              by its accessible name with no surrounding text. Ten links that all
              say &quot;Read more&quot; collapse into ten indistinguishable rows,
              and the user has no way to choose between them without visiting each
              one.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              The benefit is far wider than screen readers. Descriptive links
              help people with cognitive disabilities understand what will
              happen, help speech-input users who say the link&apos;s name to
              activate it, help sighted users scanning a page, and improve SEO
              because search engines weight link text as a signal of the
              destination&apos;s topic. Writing a clear link is one of the
              highest-leverage accessibility habits a content team can build.
            </p>
          </section>

          {/* What */}
          <section aria-labelledby="what" className="mb-12">
            <h2
              id="what"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              What 2.4.4 actually requires
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              There are three testable ideas behind the criterion. Get these
              right and your links communicate their destination to everyone.
            </p>
            <div className="space-y-4">
              {requirements.map((r, i) => (
                <div
                  key={r.name}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 p-6"
                >
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">
                    {i + 1}. {r.name}
                  </h3>
                  <p className="text-blue-700 dark:text-blue-300 font-medium mb-2">
                    {r.summary}
                  </p>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {r.detail}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/20 p-5">
              <p className="text-emerald-900 dark:text-emerald-200 leading-relaxed">
                <strong>The rule of thumb:</strong> if you read the link text
                with your eyes closed to everything around it and still know
                where it goes, it passes — and it also satisfies the stricter
                Level AAA{" "}
                <span className="font-medium">2.4.9 Link Purpose (Link Only)</span>{" "}
                for free. Self-describing visible text is always the strongest
                solution.
              </p>
            </div>
          </section>

          {/* Context */}
          <section aria-labelledby="context" className="mb-12">
            <h2
              id="context"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              What counts as &quot;programmatically-determined context&quot;
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              The criterion lets a link borrow meaning from its surroundings —
              but only context that assistive technology can actually reach by
              code, not context a sighted user infers from visual layout. These
              are the contexts WCAG accepts:
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  t: "The enclosing sentence",
                  d: "Text in the same sentence as the link. \"For pricing, see our plans.\" — the word 'plans' borrows the sentence as context.",
                },
                {
                  t: "The enclosing paragraph",
                  d: "The paragraph the link sits in. A 'Read more' link at the very end of a paragraph can take that paragraph as its context.",
                },
                {
                  t: "The enclosing list item",
                  d: "The <li> a link belongs to, including text before it in the same item.",
                },
                {
                  t: "The enclosing table cell + headers",
                  d: "A link in a data cell can be understood together with its row and column headers, which screen readers announce.",
                },
              ].map((c) => (
                <div
                  key={c.t}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 p-5"
                >
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                    {c.t}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                    {c.d}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/20 p-5">
              <p className="text-amber-900 dark:text-amber-200 leading-relaxed">
                <strong>What does NOT count:</strong> a heading two paragraphs up,
                a nearby image, or text in an adjacent column that is only
                visually associated. Those relationships are not
                programmatically-determined, so a screen reader navigating by the
                links list cannot use them. An explicit association (for example
                via{" "}
                <code className="text-amber-900 dark:text-amber-200">
                  aria-describedby
                </code>
                ) does count — but &quot;it&apos;s under the right heading
                visually&quot; alone does not.
              </p>
            </div>
          </section>

          {/* Icons / images / ambiguous */}
          <section aria-labelledby="icons" className="mb-12">
            <h2
              id="icons"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Icon links, image links, and ambiguous links
            </h2>
            <ul className="space-y-3 mb-2">
              {[
                "Image links: the link's accessible name comes from the image's alt text. Describe the destination, not the picture — a logo that links home should be alt=\"Home\" (or the site name), never alt=\"logo\" or empty.",
                "Icon-only links: a link containing only an SVG or icon-font glyph has no text. Add an aria-label to the link (or a visually-hidden text span) and mark the glyph aria-hidden=\"true\" so it is not announced twice.",
                "Repeated 'Edit' / 'Delete' links: in a table or card list, ten 'Edit' links are ambiguous on their own. Extend each name with the item it edits — \"Edit invoice #1043\" — using a visually-hidden span, or rely on the row's header cell as context.",
                "Links that open new windows or files: tell users in the name. \"Annual report (PDF, 2 MB)\" or \"Opens in a new tab\" prevents disorientation and supports related guidance like technique G201.",
              ].map((point) => (
                <li
                  key={point}
                  className="flex gap-3 rounded-lg border border-slate-200 dark:border-slate-800 p-4"
                >
                  <span aria-hidden="true" className="text-blue-500 font-bold">
                    →
                  </span>
                  <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4">
              Whenever you give a link its name through ARIA, keep the visible
              words inside that name so you do not break speech-input
              expectations — see{" "}
              <Link
                href="/wcag/4-1-2"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                4.1.2 Name, Role, Value
              </Link>{" "}
              for how accessible names are computed.
            </p>
          </section>

          {/* Exceptions */}
          <section aria-labelledby="exceptions" className="mb-12">
            <h2
              id="exceptions"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              The exception
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              2.4.4 has a single, narrow carve-out. Understanding it keeps you
              from over-flagging genuinely conformant designs.
            </p>
            <ul className="space-y-3">
              {exceptions.map((e) => (
                <li
                  key={e}
                  className="flex gap-3 rounded-lg border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/20 p-4"
                >
                  <span aria-hidden="true" className="text-emerald-600 font-bold">
                    ✓
                  </span>
                  <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {e}
                  </span>
                </li>
              ))}
            </ul>
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
              Fixing a &quot;read more&quot; link with a visually-hidden span
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Keep the short visible label for design, but extend the accessible
              name with text only assistive technology reads. This is the most
              robust fix because the full name works even in a links list.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- BAD: meaningless in a links list -->
<a href="/guides/eaa">Read more</a>

<!-- GOOD: visible "Read more", full name for AT -->
<a href="/guides/eaa">
  Read more<span class="sr-only"> about the European Accessibility Act</span>
</a>`}</code>
            </pre>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`/* The standard visually-hidden / "sr-only" utility:
   removed from view but kept in the accessibility tree. */
.sr-only {
  position: absolute;
  width: 1px; height: 1px;
  padding: 0; margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              An icon-only link
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              The link needs an accessible name; the decorative glyph is hidden
              so it is not announced as part of the name.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<a href="/settings" aria-label="Settings">
  <svg aria-hidden="true" focusable="false" width="20" height="20">
    <use href="#icon-cog" />
  </svg>
</a>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Disambiguating repeated action links in a table
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Each &quot;Edit&quot; link gets a unique accessible name by naming
              the row it acts on, so the links list stays meaningful.
            </p>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<td>
  <a href="/invoices/1043/edit">
    Edit<span class="sr-only"> invoice #1043</span>
  </a>
</td>`}</code>
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
                "Generic link text — \"click here\", \"read more\", \"learn more\", \"here\", \"this\", \"more\" — repeated across the page with no distinguishing context.",
                "Using the raw URL as link text (\"https://example.com/2026/q1/report-final-v3.pdf\"), which screen readers read out character by character.",
                "Image links with alt text describing the image (\"logo\", \"banner\") instead of the destination, or with empty alt that leaves the link with no name at all.",
                "Icon-only links (search, menu, edit, delete, social icons) with no aria-label or visually-hidden text — a 2.4.4 and 4.1.2 failure.",
                "Two identical link names pointing to different destinations, so users cannot tell them apart in a links list.",
                "Relying on visual proximity — \"the link is obviously about the heading above it\" — when that relationship is not programmatically-determined.",
                "Overwriting good visible text with an aria-label that omits the visible words, which can break 2.5.3 Label in Name for speech-input users.",
                "Title attributes used as the only source of link purpose; title text is unreliable across browsers and not exposed to all assistive technology.",
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
              How to test for 2.4.4
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "Pull up the links list",
                  d: "In NVDA press Insert+F7, in JAWS press Insert+F7, in VoiceOver use the rotor (VO+U → Links). Read each link out of context — if you cannot tell where one goes, it likely fails.",
                },
                {
                  t: "Scan visually for generic text",
                  d: "Search the page for \"click here\", \"read more\", \"learn more\", \"here\", and \"more\". Each one is a candidate failure unless its programmatically-determined context resolves it.",
                },
                {
                  t: "Check icon and image links",
                  d: "Tab to every icon-only and image link and confirm the screen reader announces a meaningful name — not \"link\", a filename, or nothing.",
                },
                {
                  t: "Look for duplicate names",
                  d: "Find links that share an accessible name and verify they go to the same destination. If they differ, give each a unique name or context.",
                },
                {
                  t: "Verify the accessible name in DevTools",
                  d: "Use the browser's Accessibility panel to read the computed name for each link, confirming aria-label, alt, and visually-hidden text resolve as intended.",
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
              Automated scanners flag the obvious cases — empty links, raw-URL
              text, and known generic phrases — but the judgement call about
              whether context resolves a link is manual. Practise the screen
              reader links-list workflow in the{" "}
              <Link
                href="/guides/screen-reader-testing"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Screen Reader Testing guide
              </Link>
              , and scan a live page with the{" "}
              <Link
                href="/tools/url-accessibility-auditor"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                URL Accessibility Auditor
              </Link>
              .
            </p>
          </section>

          {/* Related criteria */}
          <div id="related-criteria">
            <CriterionLinks number="2.4.4" />
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
            content="link purpose 2.4.4 descriptive link text click here read more ambiguous links accessible link name aria-label aria-labelledby icon link image link alt text screen reader links list WCAG Level A name role value focus order"
            maxItems={6}
          />
        </section>
      </div>
    </>
  )
}
