import Link from "next/link"
import { createMetadata } from "@/lib/metadata"
import { BreadcrumbStructuredData } from "@/components/seo/structured-data"
import WCAGSEOEnhancements from "@/components/wcag/seo-enhancements"
import { CriterionLinks } from "@/components/wcag/criterion-links"
import MeaningfulSequenceDemo from "./interactive-demo"

export const metadata = createMetadata({
  title: "WCAG 1.3.2 Meaningful Sequence - Complete Guide",
  path: "/wcag/1-3-2",
  description:
    "Complete guide to WCAG 1.3.2 Meaningful Sequence. Interactive examples of logical reading order, CSS layout impacts, and screen reader navigation.",
  keywords: [
    "WCAG 1.3.2",
    "meaningful sequence",
    "reading order",
    "logical sequence",
    "screen reader",
    "CSS layout",
    "accessibility",
  ],
  type: "article",
  image: "/api/og?title=WCAG%201.3.2%20Meaningful%20Sequence&section=WCAG",
})

const faqs = [
  {
    q: "What does WCAG 1.3.2 Meaningful Sequence require?",
    a: "It requires that when the sequence in which content is presented affects its meaning, a correct reading sequence can be programmatically determined. In practice, the order of content in the DOM (the HTML source) must match the meaningful reading order a sighted user perceives. Assistive technologies such as screen readers and braille displays — and keyboard focus order — follow the source order, not the visual arrangement produced by CSS. So if CSS visually rearranges content but leaves the source in a nonsensical order, the criterion fails. It is a Level A criterion, part of WCAG since 2.0.",
  },
  {
    q: "Does every piece of content need a meaningful sequence?",
    a: "No. The criterion only applies when the sequence affects meaning. Many collections of content — a set of unrelated navigation links, a grid of product tiles, a group of sidebar widgets — can be read in any order without losing meaning, and reordering them does not break comprehension. The requirement kicks in for content whose order carries information: the steps of a procedure, the paragraphs of an article, a heading followed by the section it introduces, or a form label followed by its field. For those, the source order must preserve the intended reading sequence.",
  },
  {
    q: "How is 1.3.2 different from 1.3.1 Info and Relationships?",
    a: "They are siblings under Guideline 1.3 Adaptable and often tested together, but they cover different things. 1.3.1 Info and Relationships is about structure and relationships being programmatically determinable — headings, lists, table associations, form labels. 1.3.2 Meaningful Sequence is specifically about order: given that content has a meaningful sequence, that sequence must be preserved in the source so it can be programmatically determined. You can have correct semantics (1.3.1) but still present them in the wrong order (failing 1.3.2), and vice versa.",
  },
  {
    q: "Can I use CSS Flexbox or Grid to reorder content?",
    a: "You can use them for visual layout, but you must be careful with properties that change the perceived order without changing the source order. Flexbox 'order', 'flex-direction: row-reverse/column-reverse', CSS Grid explicit placement, floats, absolute positioning, and 'direction' can all make the visual order diverge from the DOM order. Because screen readers and keyboard focus follow the DOM, that divergence can break meaning and keyboard operability. The safe pattern is to author the HTML in the correct reading order first, then use CSS only to arrange it visually — never to convey the sequence itself.",
  },
  {
    q: "How do I test whether content has a meaningful sequence?",
    a: "The classic test is to remove the CSS (or use a linearization / reading-order tool) and read the raw source order top to bottom: it should still make sense. You can also tab through the page and confirm focus moves in a logical order, and navigate with a screen reader to hear the announced sequence. Browser DevTools can reveal the DOM order, and axe DevTools and WAVE flag some reading-order concerns. When visual order and DOM order disagree in a way that changes meaning, that is a 1.3.2 failure.",
  },
  {
    q: "Are layout tables a 1.3.2 problem?",
    a: "They can be. When a table is used purely for visual layout rather than tabular data, screen readers still read its cells in source order — row by row, left to right. If the layout table's source order does not match the intended reading order, the content is announced in a confusing sequence. White-space characters (spaces, tabs, line breaks) used to fake columns or alignment cause the same issue. The fix is to avoid layout tables and spacing hacks, use CSS for visual arrangement, and keep the source in meaningful reading order.",
  },
]

export default function WCAG132Page() {
  return (
    <>
      <WCAGSEOEnhancements
        title="WCAG 1.3.2: Meaningful Sequence"
        description="When the sequence in which content is presented affects its meaning, a correct reading sequence can be programmatically determined."
        criteria="1.3.2"
        level="A"
        principle="Perceivable"
        guideline="1.3 Adaptable"
        url="https://accessibility.build/wcag/1-3-2"
        category="Adaptable"
      />
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "WCAG Success Criteria", url: "https://accessibility.build/wcag" },
          { name: "1.3.2 Meaningful Sequence", url: "https://accessibility.build/wcag/1-3-2" },
        ]}
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
                    1.3.2 Meaningful Sequence
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
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                Level A
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Principle 1: Perceivable
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                Source order is reading order
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
              WCAG 1.3.2: Meaningful Sequence
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              CSS can move content anywhere on screen, but screen readers, braille
              displays, and keyboard focus quietly follow the{" "}
              <strong className="text-slate-900 dark:text-white">
                order of your HTML source
              </strong>
              . When that source order stops matching the meaning a sighted reader
              sees, the page still looks fine — and reads as nonsense. This criterion
              asks that whenever sequence affects meaning, the correct reading
              sequence can be programmatically determined.
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
              When the sequence in which content is presented affects its meaning, a
              correct reading sequence can be programmatically determined.
            </blockquote>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4 text-sm">
              Two conditions matter here. First, the criterion only applies{" "}
              <em>when the sequence affects meaning</em> — content with no inherent
              order is out of scope. Second, when order does matter, a{" "}
              <em>correct</em> reading sequence has to be recoverable from the source,
              because that is what assistive technology and keyboard focus follow. It
              pairs closely with{" "}
              <Link
                href="/wcag/1-3-1"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                1.3.1 Info and Relationships
              </Link>
              , which covers structure and relationships rather than order.
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
                <a className="hover:underline" href="#who-it-helps">
                  Who this helps
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#requirement">
                  What the requirement covers
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#pass-fail">
                  Pass and fail examples
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#code">
                  Code examples
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#demo">
                  Interactive demo
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#mistakes">
                  Common failures
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#testing">
                  How to test
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#faq">
                  FAQ
                </a>
              </li>
            </ul>
          </nav>

          {/* Who it helps */}
          <section aria-labelledby="who-it-helps" className="mb-12">
            <h2
              id="who-it-helps"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Who this helps
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              A meaningful source order is invisible to most sighted users, but for
              anyone who experiences the page linearly — one item after another — it is
              the difference between a coherent page and a jumble:
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  t: "Screen reader users",
                  d: "Screen readers announce content in DOM order. If the source is scrambled, a user hears the footer before the headline, or an answer before its question — with no way to know the visual layout told a different story.",
                },
                {
                  t: "Braille display users",
                  d: "Refreshable braille renders the linearized source order. There is no visual cue to compensate, so a broken sequence is simply the only sequence the user gets.",
                },
                {
                  t: "Keyboard-only users",
                  d: "Tab focus moves through interactive elements in DOM order. When CSS reorders content visually, focus can jump around the screen unpredictably, making the page hard to follow and operate.",
                },
                {
                  t: "Switch and sequential-navigation users",
                  d: "People who move through a page one element at a time depend on that sequence being logical; a mismatched order multiplies the effort to reach the content they want.",
                },
                {
                  t: "People with cognitive disabilities",
                  d: "A predictable, logical order reduces the memory and attention load of understanding a page. Content that arrives out of sequence is far harder to piece together.",
                },
                {
                  t: "Users of reader modes and reflow",
                  d: "Reading modes, translation tools, and small-screen reflow often collapse a page to its source order. A meaningful sequence keeps the page usable once the visual layout is stripped away.",
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
          </section>

          {/* Requirement */}
          <section aria-labelledby="requirement" className="mb-12">
            <h2
              id="requirement"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              What the requirement covers
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              The core idea is a single sentence: author your content in the order it
              is meant to be read, and use CSS only to arrange it visually. Assistive
              technology and keyboard focus derive the &ldquo;reading
              sequence&rdquo; from the DOM, so any CSS technique that decouples the
              visual order from the source order is where meaning can break:
            </p>
            <ul className="space-y-3 mb-6">
              {[
                {
                  t: "Flexbox and Grid reordering",
                  d: "The order property, row-reverse / column-reverse, and explicit grid placement move boxes visually without touching the source. Reserve them for content whose order does not carry meaning, or reorder the source instead.",
                },
                {
                  t: "Absolute and fixed positioning",
                  d: "Pulling an element out of flow to place it elsewhere on screen is a classic way to make the visual position and the DOM position disagree — a headline sitting on top of content it comes after in the source.",
                },
                {
                  t: "Floats and multi-column layouts",
                  d: "Floated sidebars and CSS multi-column text can be read in an unexpected order if the source is not authored to linearize sensibly. Multi-column newspaper layouts are read column-by-column in source order.",
                },
                {
                  t: "Layout tables and white-space hacks",
                  d: "Tables used only for visual layout — and spaces, tabs, or line breaks used to fake columns — are read cell-by-cell or character-by-character in source order, which rarely matches the intended reading order.",
                },
                {
                  t: "Bidirectional text (direction)",
                  d: "Overriding the direction property to reverse text flow can reorder how content is perceived while the source stays put. Use proper markup and the dir attribute so order and language are correct.",
                },
              ].map((item) => (
                <li
                  key={item.t}
                  className="flex gap-3 rounded-lg border border-slate-200 dark:border-slate-800 p-4"
                >
                  <span aria-hidden="true" className="text-blue-500 font-bold">
                    →
                  </span>
                  <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    <strong className="text-slate-900 dark:text-white">{item.t}.</strong>{" "}
                    {item.d}
                  </span>
                </li>
              ))}
            </ul>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              When the criterion does not apply
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Not all content has a meaningful sequence. A set of teaser cards, a group
              of unrelated sidebar widgets, or a bank of navigation links can be
              reordered without changing what they mean, so freely rearranging them with
              CSS is fine. The requirement targets content whose{" "}
              <em>order is part of the message</em>: the steps of a recipe or wizard, the
              paragraphs of an article, a heading and the section it introduces, a label
              and its field, or a question and its answer. When in doubt, strip the CSS
              and read the source top to bottom — if the meaning survives, you are fine.
            </p>
          </section>

          {/* Pass / fail */}
          <section aria-labelledby="pass-fail" className="mb-12">
            <h2
              id="pass-fail"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Pass and fail examples
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-green-200 dark:border-green-900/40 bg-green-50 dark:bg-green-950/20 p-5">
                <h3 className="font-semibold text-green-800 dark:text-green-300 mb-3">
                  ✓ Passes 1.3.2
                </h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <li>
                    An article whose source runs headline → intro → body → footer, then
                    uses CSS Grid only to position a sidebar.
                  </li>
                  <li>
                    A two-column layout built with CSS from a single, logically ordered
                    source that still reads correctly with styles off.
                  </li>
                  <li>
                    A form where each label immediately precedes its field in the DOM,
                    regardless of visual alignment.
                  </li>
                  <li>
                    Product cards reordered with Flexbox <code className="px-1 py-0.5 rounded bg-white/60 dark:bg-slate-800 font-mono text-xs">order</code>{" "}
                    where the cards carry no required sequence.
                  </li>
                  <li>
                    Tab focus that moves through the page in the same logical order the
                    content reads.
                  </li>
                </ul>
              </div>
              <div className="rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-5">
                <h3 className="font-semibold text-rose-800 dark:text-rose-300 mb-3">
                  ✗ Fails 1.3.2
                </h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <li>
                    A headline placed visually first with absolute positioning but left
                    last in the source, so it is announced after the story.
                  </li>
                  <li>
                    A multi-column layout table whose source cell order reads across
                    unrelated columns instead of down each one.
                  </li>
                  <li>
                    Flexbox <code className="px-1 py-0.5 rounded bg-white/60 dark:bg-slate-800 font-mono text-xs">order</code>{" "}
                    used to reorder wizard steps visually while the DOM keeps them out of
                    sequence.
                  </li>
                  <li>
                    Columns faked with spaces and tabs, so a screen reader reads across
                    the &ldquo;columns&rdquo; instead of down them.
                  </li>
                  <li>
                    Tab order that jumps around the screen because CSS moved fields away
                    from their source position.
                  </li>
                </ul>
              </div>
            </div>
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
              Author the source in reading order
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              The reliable pattern is a single, logically ordered source. Let CSS Grid
              (or Flexbox) place regions visually with named areas — the DOM order stays
              correct no matter where the boxes land on screen.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- ✗ Source order scrambled to match a visual mock-up -->
<div class="page">
  <div class="footer">Read more &raquo;</div>
  <div class="body">The main story text...</div>
  <div class="intro">A short introduction...</div>
  <div class="headline">Breaking News</div>  <!-- read LAST -->
</div>

<!-- ✓ Source in meaningful order; CSS handles placement -->
<div class="page">
  <header class="headline">Breaking News</header>
  <p class="intro">A short introduction...</p>
  <main class="body">The main story text...</main>
  <footer class="footer">Read more &raquo;</footer>
</div>

<style>
  /* Visual arrangement only — never conveys the reading order */
  .page {
    display: grid;
    grid-template-areas:
      "headline headline"
      "body     sidebar"
      "footer   footer";
  }
  .headline { grid-area: headline; }
  .body     { grid-area: body; }
  .footer   { grid-area: footer; }
</style>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Flexbox <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">order</code> vs. source order
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              The <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">order</code>{" "}
              property changes the visual sequence but not the DOM sequence, so screen
              readers and Tab focus ignore it. Never use it to fix the reading order —
              fix the source.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- ✗ Visual order says 1,2,3 but the DOM (and screen reader) says 3,1,2 -->
<ol class="steps">
  <li style="order: 2">Step 2: Enter payment details</li>
  <li style="order: 3">Step 3: Confirm your order</li>
  <li style="order: 1">Step 1: Add items to cart</li>
</ol>

<!-- ✓ Source already in the correct sequence; no reordering needed -->
<ol class="steps">
  <li>Step 1: Add items to cart</li>
  <li>Step 2: Enter payment details</li>
  <li>Step 3: Confirm your order</li>
</ol>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Drop layout tables and white-space hacks
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Layout tables are read cell-by-cell in source order, and spacing faked with
              whitespace is read straight through. Both mangle the sequence — use CSS
              columns from a linear source instead.
            </p>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- ✗ Layout table: read "Intro ... Sidebar ..." across the row,
     even though the intended reading is the whole article first -->
<table role="presentation">
  <tr>
    <td>Intro paragraph of the article...</td>
    <td>Unrelated sidebar promo...</td>
  </tr>
</table>

<!-- ✗ Columns faked with spaces: read across, not down -->
<pre>
Item A      Item C
Item B      Item D
</pre>

<!-- ✓ Linear source; CSS creates the visual columns -->
<article class="two-col">
  <p>Intro paragraph of the article...</p>
  <p>The rest of the article continues in reading order...</p>
</article>
<style>
  .two-col { column-count: 2; column-gap: 2rem; }
</style>`}</code>
            </pre>
          </section>

          {/* Interactive demo */}
          <section aria-labelledby="demo" className="mb-12">
            <h2
              id="demo"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Interactive Demo
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              Switch between a good and a poor layout of the same news article, reveal
              the underlying DOM order, and hear the sequence a screen reader would
              actually follow. Notice how the poor layout looks nearly identical on
              screen yet reads the headline last.
            </p>
            <MeaningfulSequenceDemo />
          </section>

          {/* Common failures */}
          <section aria-labelledby="mistakes" className="mb-12">
            <h2
              id="mistakes"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Common failures
            </h2>
            <ul className="space-y-3">
              {[
                "Positioning content with absolute/fixed CSS so the visual order and the DOM order tell different stories.",
                "Using Flexbox or Grid order (or row-reverse/column-reverse) to reorder content whose sequence carries meaning.",
                "Building page layout with tables, so screen readers read cells across rows in an order that breaks meaning.",
                "Faking columns or alignment with spaces, tabs, and line breaks, which are read straight through in source order.",
                "Placing a heading after the content it introduces in the source, so it is announced out of context.",
                "Separating a form label from its field in the DOM to satisfy a visual grid, scrambling the label/field sequence.",
                "Injecting content (modals, banners, 'skip' targets) at the end of the source but showing it first visually.",
                "Relying on the CSS order property to correct a reading sequence that is wrong in the HTML.",
                "Multi-column newspaper layouts whose source runs across columns instead of down each column in turn.",
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
              How to test for 1.3.2
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "Read the source with CSS turned off",
                  d: "Disable styles (browser reader view, a 'disable CSS' extension, or DevTools) and read the page top to bottom. The linearized content should still make sense; anything that now reads out of order is a candidate failure.",
                },
                {
                  t: "Tab through the page",
                  d: "Using only the keyboard, Tab through every interactive element. Focus should move in a logical sequence that matches the reading order. Focus that jumps unpredictably around the screen signals that CSS has reordered content away from the DOM.",
                },
                {
                  t: "Listen with a screen reader",
                  d: "Navigate the page with NVDA, JAWS, or VoiceOver and confirm the announced order matches the meaning. Pay special attention to headings that should precede their sections and labels that should precede their fields.",
                },
                {
                  t: "Inspect the DOM order directly",
                  d: "Use browser DevTools to compare the source order with the rendered layout. Where you find order, row-reverse, absolute positioning, or grid placement, verify the affected content has no required sequence.",
                },
                {
                  t: "Check responsive and reflow states",
                  d: "Resize to small viewports and zoom to 400%. Reflow often collapses multi-column layouts to source order — confirm the single-column result still reads logically at every breakpoint.",
                },
                {
                  t: "Run an automated scan as a backstop",
                  d: "axe DevTools, WAVE, and Lighthouse catch some reading-order and layout-table issues. Treat them as a floor: they cannot judge whether a sequence is meaningful, so manual review remains essential.",
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
              For a structured audit, work through the full{" "}
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
          <CriterionLinks number="1.3.2" />

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
      </div>
    </>
  )
}
