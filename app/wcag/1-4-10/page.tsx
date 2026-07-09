import type { Metadata } from "next"
import Link from "next/link"
import {
  ArticleStructuredData,
  BreadcrumbStructuredData,
} from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"
import { CriterionLinks } from "@/components/wcag/criterion-links"

export const metadata: Metadata = {
  title: "WCAG 1.4.10 Reflow — No Horizontal Scrolling at 320px",
  description:
    "Complete guide to WCAG 1.4.10 Reflow. Learn why content must reflow to 320 CSS pixels wide without two-dimensional scrolling or loss of information, how to test at 400% zoom, the exceptions for tables and maps, copy-ready responsive CSS, and common mistakes.",
  keywords: [
    "WCAG 1.4.10",
    "Reflow",
    "responsive design accessibility",
    "320 CSS pixels",
    "400% zoom",
    "horizontal scrolling accessibility",
    "reflow WCAG",
    "low vision accessibility",
    "mobile accessibility",
    "zoom accessibility",
    "Level AA",
    "WCAG 2.2",
  ],
  alternates: {
    canonical: "https://accessibility.build/wcag/1-4-10",
  },
  openGraph: {
    title:
      "WCAG 1.4.10 Reflow — No Horizontal Scrolling at 320px (Level AA)",
    description:
      "The definitive guide to WCAG 1.4.10 Reflow: content must reflow to a 320 CSS pixel viewport without two-dimensional scrolling. The 400% zoom test, exceptions, responsive CSS, and how to test.",
    url: "https://accessibility.build/wcag/1-4-10",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: "https://accessibility.build/api/og?title=WCAG%201.4.10%20Reflow&section=WCAG",
        width: 1200,
        height: 630,
        alt: "WCAG 1.4.10 Reflow guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WCAG 1.4.10 Reflow — No Horizontal Scrolling at 320px",
    description:
      "Content must reflow to a 320px-wide viewport (400% zoom) without two-dimensional scrolling or loss of information. The rule, the exceptions, and the CSS.",
  },
}

const faqs = [
  {
    q: "What does WCAG 1.4.10 Reflow require?",
    a: "WCAG 1.4.10 Reflow (Level AA) requires that content can be presented without loss of information or functionality, and without requiring scrolling in two dimensions, at a viewport width equivalent to 320 CSS pixels for vertically-scrolling content, or a height of 256 CSS pixels for horizontally-scrolling content. In practice this means a user can zoom a page to 400% on a 1280px-wide screen and still read and use everything with only vertical scrolling — no need to scroll left and right on every line. Exceptions are allowed for parts of content that require a two-dimensional layout for usage or meaning, such as data tables, complex images, maps, and toolbars.",
  },
  {
    q: "Why is the magic number 320 CSS pixels?",
    a: "320 CSS pixels corresponds to 1280px displayed at 400% zoom (1280 ÷ 4 = 320). It also approximates the width of a small mobile device in portrait, so meeting 1.4.10 tends to make your content work on small phones too. The success criterion is written in terms of CSS pixels and zoom rather than a specific device, but the practical target most teams use is: does the page work in a 320px-wide window, or at 400% browser zoom on a 1280px viewport?",
  },
  {
    q: "How is Reflow different from Resize Text (1.4.4)?",
    a: "1.4.4 Resize Text requires that text can be resized up to 200% without loss of content or functionality, and is typically satisfied by scaling text. 1.4.10 Reflow goes further: at 400% zoom the entire page — not just text — must reflow into a single column so there is no two-dimensional scrolling. A layout can pass 1.4.4 (text scales) yet fail 1.4.10 (fixed-width columns force horizontal scrolling). Reflow is the stronger, more modern requirement and is what responsive design naturally supports.",
  },
  {
    q: "Does Reflow ban all horizontal scrolling?",
    a: "No. It bans scrolling in two dimensions to read a block of content. Horizontal scrolling is still allowed for the parts of content that genuinely need a two-dimensional layout — a wide data table, a large diagram or map, a code sample, or a horizontal toolbar. The rule is that the user should not have to scroll horizontally to read normal lines of text; a table that scrolls horizontally inside its own container is acceptable because tables are an explicit exception.",
  },
  {
    q: "What content is exempt from Reflow?",
    a: "The criterion exempts 'parts of the content which require two-dimensional layout for usage or meaning.' That includes data tables, images such as maps and diagrams, interfaces where moving controls while operating them is essential (like a drawing canvas), video with controls, and toolbars grouped with the content they act on. The exception is scoped to the specific part that needs the layout — the rest of the page must still reflow. So a data table may scroll horizontally, but the page around it must not.",
  },
  {
    q: "How do I test for Reflow?",
    a: "The quickest test: set your browser window to 1280px wide, then zoom to 400% (Ctrl/Cmd and + repeatedly, or set zoom to 400% in browser settings). Scroll down the page. If you can read and use everything with only vertical scrolling — no horizontal scrollbar on the whole page, no clipped content, no overlapping elements — it passes. Alternatively, resize the browser window to 320px wide. Repeat for key templates: home, article, form, checkout, and dashboard.",
  },
  {
    q: "Does responsive design automatically satisfy 1.4.10?",
    a: "Usually, but not always. A well-built responsive site with a mobile breakpoint that collapses to a single column typically passes. But Reflow is tested by zoom on a desktop viewport, not by device width — and zoom does not always trigger the same media queries a narrow device does. Fixed widths in px, min-width containers, off-screen sidebars that don't collapse, and content pinned with absolute positioning can all fail at 400% zoom even on a 'responsive' site. Always test with actual zoom, not just by narrowing the window.",
  },
]

const exemptExamples = [
  {
    name: "Data tables",
    detail:
      "Tables with many columns need their two-dimensional grid to preserve the relationships between headers and cells. Let the table scroll horizontally inside its own container — the page around it must still reflow.",
  },
  {
    name: "Maps and complex diagrams",
    detail:
      "An interactive map, a large architectural diagram, or a detailed chart relies on spatial layout. These may retain a two-dimensional scroll; the surrounding page content must not.",
  },
  {
    name: "Code samples and pre-formatted text",
    detail:
      "Source code and ASCII art depend on preserved line breaks and spacing. A <pre> block that scrolls horizontally inside its own container is acceptable, while body text is not.",
  },
  {
    name: "Toolbars and editing surfaces",
    detail:
      "A drawing canvas, a spreadsheet grid, or a toolbar that must stay adjacent to the content it operates on can require two-dimensional layout to remain usable.",
  },
]

export default function WCAG1410Page() {
  return (
    <>
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          {
            name: "WCAG Success Criteria",
            url: "https://accessibility.build/wcag",
          },
          {
            name: "1.4.10 Reflow",
            url: "https://accessibility.build/wcag/1-4-10",
          },
        ]}
      />

      <ArticleStructuredData
        headline="WCAG 1.4.10 Reflow: The Complete Guide to Content That Works at 320px and 400% Zoom"
        description="The definitive guide to WCAG 1.4.10 Reflow: why content must reflow to a 320 CSS pixel viewport without two-dimensional scrolling, the 400% zoom test, exceptions for tables and maps, responsive CSS, and common mistakes."
        author={{
          name: "Accessibility.build Team",
          url: "https://accessibility.build/about",
        }}
        publisher={{
          name: "Accessibility.build",
          logo: "https://accessibility.build/android-chrome-512x512.png",
        }}
        datePublished="2026-07-05"
        dateModified="2026-07-05"
        image="https://accessibility.build/api/og?title=WCAG%201.4.10%20Reflow&section=WCAG"
        url="https://accessibility.build/wcag/1-4-10"
        wordCount={2800}
        keywords={[
          "WCAG 1.4.10",
          "Reflow",
          "responsive design accessibility",
          "320 CSS pixels",
          "400% zoom",
          "horizontal scrolling accessibility",
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
                    1.4.10 Reflow
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
                Principle 1: Perceivable
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                1.4 Distinguishable
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
              WCAG 1.4.10: Reflow
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              A person with low vision may zoom a page to 400% just to read it. At
              that magnification, a fixed-width layout forces them to scroll left
              and right on <em>every single line</em> — a maddening, error-prone
              way to read. This Level AA criterion requires that content{" "}
              <strong className="text-slate-900 dark:text-white">
                reflow into a single column at a 320 CSS pixel width
              </strong>{" "}
              (the equivalent of 400% zoom on a 1280px screen) without two-dimensional
              scrolling or any loss of information.
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
              Content can be presented without loss of information or functionality,
              and without requiring scrolling in two dimensions for:
              vertical scrolling content at a width equivalent to{" "}
              <strong>320 CSS pixels</strong>; horizontal scrolling content at a
              height equivalent to <strong>256 CSS pixels</strong>. Except for parts
              of the content which require two-dimensional layout for usage or
              meaning.
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
                  Why reflow matters
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#numbers">
                  What 320px and 256px mean
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#exceptions">
                  What is exempt
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
              Why reflow matters
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              People with low vision routinely enlarge web content — through browser
              zoom, operating-system magnification, or larger default font sizes — so
              they can read it at all. Someone might run a page at 200%, 300%, or a
              full 400% zoom. At high magnification, the viewport becomes, in effect,
              a small window onto the page.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              If the layout does not adapt, that small window shows only a slice of
              each line. To read one sentence, the user must scroll right to the end
              of the line, then all the way back left to start the next line, then
              right again — line after line, paragraph after paragraph. Reading
              becomes a two-dimensional slog that is exhausting and easy to lose your
              place in. Reflow removes that second dimension: content collapses into
              a single readable column so the user scrolls in one direction only.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              The same discipline that satisfies Reflow — flexible, content-first
              layouts that adapt to the available space — is exactly what makes a
              site work well on small phones and in split-screen multitasking. Meet
              1.4.10 and you have largely solved{" "}
              <Link
                href="/guides/keyboard-accessibility"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                small-viewport usability
              </Link>{" "}
              at the same time. Because WCAG 2.2 AA is the reference standard for the{" "}
              <Link
                href="/guides/section-504-web-accessibility-deadline"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                DOJ Title II rule
              </Link>{" "}
              and the European Accessibility Act, Reflow is also a compliance target.
            </p>
          </section>

          {/* Numbers */}
          <section aria-labelledby="numbers" className="mb-12">
            <h2
              id="numbers"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              What 320px and 256px actually mean
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              The criterion names two thresholds. Which one applies depends on the
              direction your content scrolls.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  320 CSS pixels wide
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Applies to normal, vertically-scrolling pages (the vast majority of
                  the web). It equals a <strong>1280px viewport at 400% zoom</strong>{" "}
                  (1280 ÷ 4 = 320) and is close to the width of a small phone in
                  portrait. Your content must fit this width without horizontal
                  scrolling.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  256 CSS pixels tall
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Applies to content designed to scroll <em>horizontally</em> — a
                  rarer case, such as a slide deck or a horizontal timeline. It equals
                  a <strong>1024px-tall viewport at 400% zoom</strong> (1024 ÷ 4 =
                  256). Here the content must fit vertically without a second scroll
                  direction.
                </p>
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              For almost every project the number that matters is{" "}
              <strong>320 CSS pixels wide</strong>. The practical test is: at 400%
              browser zoom on a 1280px window (or in a 320px-wide window), can the
              user read and operate everything by scrolling only up and down? Note
              the criterion is written in CSS pixels and zoom, not device pixels — a
              high-DPI phone still reasons in CSS pixels.
            </p>
          </section>

          {/* Exceptions */}
          <section aria-labelledby="exceptions" className="mb-12">
            <h2
              id="exceptions"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              What is exempt from Reflow
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              The criterion allows an exception for &quot;parts of the content which
              require two-dimensional layout for usage or meaning.&quot; The exception
              is <strong>scoped to that specific part</strong> — everything around it
              must still reflow. A wide data table may scroll sideways inside its own
              container, but the article that contains it may not.
            </p>
            <div className="space-y-4">
              {exemptExamples.map((c) => (
                <div
                  key={c.name}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 p-6"
                >
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                    {c.name}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {c.detail}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-6">
              Treat the exception as a last resort, not a loophole. Before allowing a
              part to scroll two-dimensionally, ask whether it could be redesigned to
              reflow — a data table can often become stacked cards on narrow screens,
              and a complex dashboard can reorganize into sections.
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
              Fluid layout with a responsive grid
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              The foundation of reflow is a layout defined in flexible units that
              collapse to one column when space runs out. A CSS grid with{" "}
              <code>auto-fit</code> and <code>minmax()</code> reflows to a single
              column automatically — no media query needed.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`.cards {
  display: grid;
  /* Columns are at least 16rem; when the viewport is too
     narrow for even one, the grid drops to a single column. */
  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
  gap: 1rem;
}

/* Never lock a container to a pixel width wider than 320px. */
.container {
  max-width: 70rem;   /* a cap, not a fixed width */
  width: 100%;
  margin-inline: auto;
  padding-inline: 1rem;
}`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Prevent the viewport-lock anti-pattern
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              A common cause of reflow failure is a viewport meta tag that disables
              zoom. Never set <code>maximum-scale</code> or{" "}
              <code>user-scalable=no</code> — they block the very magnification
              Reflow exists to support (and also fail 1.4.4 Resize Text).
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- Correct: allows the user to zoom -->
<meta name="viewport" content="width=device-width, initial-scale=1" />

<!-- WRONG: blocks zoom, fails Reflow and Resize Text -->
<meta name="viewport"
  content="width=device-width, maximum-scale=1, user-scalable=no" />`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Let an exempt table scroll inside its own container
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              When a data table genuinely needs its columns, wrap it so only the
              table scrolls horizontally — the page around it still reflows. Make the
              wrapper keyboard-focusable and label it so scroll users can reach it.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<div
  class="table-scroll"
  role="region"
  aria-label="Pricing comparison"
  tabindex="0"
>
  <table> ... many columns ... </table>
</div>

<style>
.table-scroll { overflow-x: auto; }
</style>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Use logical units so text and spacing scale with zoom
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Sizing text, padding, and breakpoints in <code>rem</code>/<code>em</code>{" "}
              rather than <code>px</code> means a user&apos;s zoom or larger default
              font reflows the layout instead of clipping it.
            </p>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`/* Breakpoints in em respond to zoom and font-size, not just
   device width — helping the layout reflow under zoom. */
@media (max-width: 40em) {
  .sidebar { display: none; }
  .layout { grid-template-columns: 1fr; }
}

body { font-size: 100%; }      /* respect the user's default */
.prose { max-width: 65ch; }    /* character-based, reflows cleanly */`}</code>
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
                "Setting user-scalable=no or maximum-scale=1 in the viewport meta tag, which blocks the zoom that Reflow depends on.",
                "Fixed pixel widths on containers, cards, or grids that are wider than 320px and never collapse to a single column.",
                "Testing only by narrowing the browser window, not by zooming — zoom does not always fire the same media queries a small device does.",
                "Off-canvas sidebars or navigation that overlap the main content at high zoom instead of collapsing or stacking.",
                "Multi-column layouts (CSS columns, floated columns) that keep two or more columns side by side at 320px.",
                "Absolutely-positioned or negatively-margined elements that overflow the viewport and get clipped when space shrinks.",
                "Whitespace: nowrap or large min-width values on text blocks that force horizontal scrolling of ordinary content.",
                "Treating the two-dimensional-layout exception as a blanket excuse, letting whole pages scroll sideways instead of scoping it to a real table or diagram.",
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
              How to test for 1.4.10
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "Set the window to 1280px, then zoom to 400%",
                  d: "On a desktop browser, size the window to 1280 CSS pixels wide, then zoom to 400% (press Ctrl/Cmd and + repeatedly, or set the zoom level explicitly). This produces the 320px effective width the criterion targets. Chrome, Firefox, Safari, and Edge all support 400% zoom.",
                },
                {
                  t: "Scroll the whole page and look for a horizontal scrollbar",
                  d: "Scroll from top to bottom. If a horizontal scrollbar appears on the page as a whole, or you must scroll right to read normal lines of text, it fails. A horizontal scrollbar that belongs only to an exempt table or diagram inside its own container is acceptable.",
                },
                {
                  t: "Check nothing is clipped, hidden, or overlapping",
                  d: "Confirm no text is cut off at the edge, no controls disappear off-screen, and elements do not overlap. Every piece of information and functionality available at 100% must still be present and usable at 400%.",
                },
                {
                  t: "Test the key templates, not just the home page",
                  d: "Repeat on your highest-traffic and highest-stakes templates: article, product, form, checkout, dashboard, and any page with a data table or map. Reflow failures often hide in complex templates, not the marketing home page.",
                },
                {
                  t: "Verify zoom itself is not blocked",
                  d: "Inspect the viewport meta tag. If it contains user-scalable=no or maximum-scale below 2, the page fails before you even test layout — remove those so users can zoom.",
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
              Reflow is primarily a manual, visual check — automated tools can flag a
              disabled viewport or obvious overflow but cannot judge whether reading
              still works. Pair the manual zoom test with a scan from the{" "}
              <Link
                href="/tools/url-accessibility-auditor"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                URL Accessibility Auditor
              </Link>{" "}
              and confirm small-viewport behavior with the{" "}
              <Link
                href="/tools/mobile-accessibility-checker"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Mobile Accessibility Checker
              </Link>
              .
            </p>
          </section>

          {/* Related criteria */}
          <div id="related-criteria">
            <CriterionLinks number="1.4.10" />
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
            content="reflow responsive design 320 CSS pixels 400% zoom horizontal scrolling low vision magnification resize text zoom accessibility mobile accessibility single column layout viewport meta WCAG 1.4.10 Level AA WCAG 2.2 perceivable distinguishable"
            maxItems={6}
          />
        </section>
      </div>
    </>
  )
}
