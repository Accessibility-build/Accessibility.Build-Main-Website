import Link from "next/link"
import { createMetadata } from "@/lib/metadata"
import { BreadcrumbStructuredData } from "@/components/seo/structured-data"
import WCAGSEOEnhancements from "@/components/wcag/seo-enhancements"
import { CriterionLinks } from "@/components/wcag/criterion-links"
import SemanticsDemo from "./interactive-demo"

export const metadata = createMetadata({
  title: "WCAG 1.3.1 Info and Relationships - Complete Guide",
  path: "/wcag/1-3-1",
  description:
    "Complete guide to WCAG 1.3.1 Info and Relationships. Interactive examples of semantic HTML, proper heading structure, and accessible markup.",
  keywords: ["WCAG 1.3.1", "info and relationships", "semantic HTML", "heading structure", "accessibility", "ARIA", "screen readers"],
  type: "article",
  image: "/api/og?title=WCAG%201.3.1%20Info%20and%20Relationships&section=WCAG",
})

const faqs = [
  {
    q: "What does “programmatically determined” mean in WCAG 1.3.1?",
    a: "It means the information is exposed in the code in a way that browsers and assistive technologies can read and act on — not just painted on the screen for sighted users. A real <h2> is programmatically a heading; a <div> styled to look like a heading is not, even though both look identical. When structure and relationships (this text is a heading, these items form a list, this cell belongs to that column header, this label names that field) are carried by semantic HTML or correct ARIA, a screen reader can announce them and let users navigate by them. If the meaning lives only in visual styling, it is not programmatically determinable and the criterion fails. The escape hatch “or are available in text” means you can instead state the relationship in visible words (for example, a sentence that spells out what a chart shows), but native semantics are almost always the better route.",
  },
  {
    q: "Should I use semantic HTML or ARIA to satisfy 1.3.1?",
    a: "Native semantic HTML first, ARIA only to fill genuine gaps. Elements like <h1>–<h6>, <ul>/<ol>/<li>, <table>/<th>/<td>, <label>, <fieldset>/<legend>, <nav>, <main>, and <button> come with built-in roles and relationships that are reliable across browsers and assistive tech, and they cannot fall out of sync with the visuals. ARIA (roles like role=\"list\", properties like aria-labelledby or scope on a header) is a supplement for the cases HTML cannot express, or for custom widgets. The first rule of ARIA is not to use ARIA when a native element will do — a real <button> is safer than <div role=\"button\">. Reaching for ARIA to bolt semantics onto div soup is a common and fragile anti-pattern.",
  },
  {
    q: "How is 1.3.1 different from 1.3.2 Meaningful Sequence?",
    a: "1.3.1 is about which relationships exist — that a heading is a heading, a list is a list, a header cell governs its column. 1.3.2 Meaningful Sequence is about the order those pieces are read in: when the reading order matters for comprehension, the DOM order (what a screen reader follows) must match the intended logical order, regardless of how CSS positions things visually. You can pass 1.3.1 by marking everything up correctly and still fail 1.3.2 if, say, CSS flexbox or absolute positioning makes the visual order differ from the source order. Think of 1.3.1 as “the right labels on the parts” and 1.3.2 as “the parts in the right order.”",
  },
  {
    q: "How is 1.3.1 different from 2.4.6 Headings and Labels?",
    a: "1.3.1 (Level A) requires that headings and labels exist as real, programmatically determinable structure — an <h2> element, a <label> associated with its input. 2.4.6 Headings and Labels (Level AA) goes a step further and requires that those headings and labels, where present, are descriptive — that they actually describe the topic or purpose. So a page can pass 1.3.1 with a correctly coded but vague heading like “More” and still fail 2.4.6 because the text is not descriptive. 1.3.1 is about the existence and correctness of the structure; 2.4.6 is about the quality of its wording.",
  },
  {
    q: "How do I make a data table pass 1.3.1?",
    a: "Use real table markup and connect the data cells to their headers. Wrap the data in <table>, put column and row headings in <th> elements, and give each <th> a scope attribute (scope=\"col\" or scope=\"row\") so assistive technology knows which cells it governs. For complex tables with multiple header levels, use id on the headers and headers=\"…\" on the data cells. Add a <caption> to name the table. Critically, this applies only to tables of data — do not use tables purely for visual layout; if you must, that is a separate concern, but data relationships expressed as a grid of <div>s will fail because there is no header-to-cell relationship for a screen reader to announce.",
  },
  {
    q: "Why do bold-as-heading and color-as-meaning fail 1.3.1?",
    a: "Because they encode the relationship purely in presentation, which assistive technology cannot perceive. Bold, larger text looks like a heading to a sighted user, but a screen reader announces it as ordinary body text — the “this is a section heading” relationship exists only in the CSS. Likewise, marking required fields with red text, or indicating status with color alone, communicates nothing to someone who cannot see the color (this also implicates 1.4.1 Use of Color). The fix is to convey the same information in structure or text: a real heading element, an actual list, a visible “(required)” label or aria-required, a status word alongside the color. If sighted users get information from the way something looks, that same information must be available in the markup or in words.",
  },
]

export default function WCAG131Page() {
  return (
    <>
      <WCAGSEOEnhancements
        title="WCAG 1.3.1: Info and Relationships"
        description="Information, structure, and relationships conveyed through presentation can be programmatically determined or are available in text."
        criteria="1.3.1"
        level="A"
        principle="Perceivable"
        guideline="1.3 Adaptable"
        url="https://accessibility.build/wcag/1-3-1"
        category="Adaptable"
      />
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "WCAG Success Criteria", url: "https://accessibility.build/wcag" },
          { name: "1.3.1 Info and Relationships", url: "https://accessibility.build/wcag/1-3-1" },
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
                    1.3.1 Info and Relationships
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
                The backbone of semantic HTML
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
              WCAG 1.3.1: Info and Relationships
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              Sighted users read structure at a glance: a heading is bigger, a list has
              bullets, a table lines data up in a grid. This criterion asks that the same{" "}
              <strong className="text-slate-900 dark:text-white">
                structure and relationships be carried in the code, not just the pixels
              </strong>
              , so a screen reader can announce them and let people navigate by them. It
              is the foundation almost every other accessibility feature is built on.
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
              Information, structure, and relationships conveyed through presentation can
              be programmatically determined or are available in text.
            </blockquote>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4 text-sm">
              &ldquo;Structure&rdquo; is how content is grouped and organised — headings,
              lists, paragraphs, sections. &ldquo;Relationships&rdquo; are the meaningful
              connections between pieces — a label belongs to a field, a header cell governs
              a column, an item belongs to a list. The rule: wherever those are shown
              visually, they must also exist in the markup (programmatically determined) or
              be stated in words (available in text). This is a Level A criterion, part of
              WCAG since 2.0.
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
              Structure carried in the code is what lets assistive technology present a
              page as something more than an undifferentiated wall of text. When the
              relationships are programmatic, everyone who cannot rely on visual layout
              benefits:
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  t: "Screen reader users",
                  d: "They navigate by structure — pulling up a list of headings, jumping to the next list or table, moving cell by cell. Without real semantics none of those shortcuts work and the page reads as one flat stream.",
                },
                {
                  t: "Braille display users",
                  d: "Refreshable braille conveys role and level information (heading, list item, table cell) alongside the text, so correct markup is the only thing that tells a deafblind reader how the content is organised.",
                },
                {
                  t: "Low-vision and reflow users",
                  d: "People who zoom to 400% or reflow content to a single column rely on real headings and landmarks to keep their place; visual-only structure collapses when the layout is restyled.",
                },
                {
                  t: "People with cognitive and learning disabilities",
                  d: "Clear, programmatic structure lets reading tools, outliners, and reader modes break long pages into navigable chunks and summarise them reliably.",
                },
                {
                  t: "Voice-control users",
                  d: "Commands like “click the Email field” or “show headings” depend on fields having real labels and sections having real headings the software can target by name.",
                },
                {
                  t: "Search engines and automation",
                  d: "Crawlers, reader modes, and AI assistants infer meaning from semantic markup — proper headings, lists, and tables also improve how your content is indexed and summarised.",
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
              1.3.1 spans every kind of structure and relationship a page conveys
              visually. The consistent test is: <em>if a sighted user learns something
              from the way content looks or is arranged, that same information must be
              available in the markup or in text.</em> The main relationships it covers:
            </p>
            <ul className="space-y-3 mb-8">
              {[
                {
                  t: "Headings and sections",
                  d: "Section titles must be real heading elements (h1–h6) in a logical, non-skipping order, so the document outline is programmatic. Large bold text is not a heading.",
                },
                {
                  t: "Lists and groups",
                  d: "Sequences of related items belong in ul, ol, or dl with li — this exposes the item count and lets users skip the group. Lines separated by <br> or divs are not a list.",
                },
                {
                  t: "Data tables",
                  d: "Tabular data needs <table> with <th> header cells, scope (or headers/id for complex tables), and ideally a <caption>. This binds every value to its row and column header. Reserve tables for data, not layout.",
                },
                {
                  t: "Form labels and grouping",
                  d: "Every control needs a programmatically associated name — a <label for> tied to the input’s id (or aria-label/aria-labelledby). Related controls, such as a set of radio buttons, are grouped with <fieldset> and named with <legend>.",
                },
                {
                  t: "Landmarks and regions",
                  d: "Page regions should use landmark elements — <header>, <nav>, <main>, <aside>, <footer> — so assistive tech can list and jump between the major areas of the page.",
                },
                {
                  t: "Emphasis and meaning",
                  d: "Where emphasis carries meaning, use <em> and <strong> rather than presentational <i>/<b> or CSS alone. Required or errored fields must convey that state in text or ARIA, not colour or position only.",
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
              Semantics first, ARIA to fill the gaps
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              Native HTML elements carry their roles and relationships for free and stay
              in sync with the visuals — a real <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">&lt;button&gt;</code>{" "}
              is announced as a button, focusable, and operable by keyboard without any
              extra code. Reach for ARIA (<code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">role</code>,{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">aria-labelledby</code>,{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">scope</code>) only when HTML
              cannot express the relationship or you are building a custom widget. Using
              ARIA to retrofit meaning onto a pile of <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">&lt;div&gt;</code>s
              is fragile and easy to get wrong.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              &ldquo;Or available in text&rdquo;
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              The criterion offers an alternative to markup: state the relationship in
              words. If a complex visual relationship cannot be fully captured in
              semantics, a plain-text description that conveys the same information also
              satisfies 1.3.1 — for instance, a sentence that explains what a diagram shows.
              In practice, native semantics are more robust and reusable, so prefer them
              and use the text route only where structure genuinely cannot express the
              relationship.
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
                  ✓ Passes 1.3.1
                </h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <li>Section titles marked up as h2/h3 in a logical, non-skipping order.</li>
                  <li>A navigation menu built from <code className="px-1 py-0.5 rounded bg-white/60 dark:bg-slate-800 font-mono text-xs">&lt;ul&gt;</code> and <code className="px-1 py-0.5 rounded bg-white/60 dark:bg-slate-800 font-mono text-xs">&lt;li&gt;</code> inside <code className="px-1 py-0.5 rounded bg-white/60 dark:bg-slate-800 font-mono text-xs">&lt;nav&gt;</code>.</li>
                  <li>
                    A data table with <code className="px-1 py-0.5 rounded bg-white/60 dark:bg-slate-800 font-mono text-xs">&lt;th scope&gt;</code>, a caption, and cells bound to headers.
                  </li>
                  <li>
                    Each input given a <code className="px-1 py-0.5 rounded bg-white/60 dark:bg-slate-800 font-mono text-xs">&lt;label for&gt;</code> tied to its id.
                  </li>
                  <li>
                    Required fields marked with a visible &ldquo;(required)&rdquo; and <code className="px-1 py-0.5 rounded bg-white/60 dark:bg-slate-800 font-mono text-xs">aria-required</code>, not colour alone.
                  </li>
                </ul>
              </div>
              <div className="rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-5">
                <h3 className="font-semibold text-rose-800 dark:text-rose-300 mb-3">
                  ✗ Fails 1.3.1
                </h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <li>
                    A &ldquo;heading&rdquo; that is really a bold, large <code className="px-1 py-0.5 rounded bg-white/60 dark:bg-slate-800 font-mono text-xs">&lt;div&gt;</code>.
                  </li>
                  <li>
                    A list built from <code className="px-1 py-0.5 rounded bg-white/60 dark:bg-slate-800 font-mono text-xs">&lt;br&gt;</code> or divs with typed bullets.
                  </li>
                  <li>
                    Data laid out as a CSS grid of divs with no <code className="px-1 py-0.5 rounded bg-white/60 dark:bg-slate-800 font-mono text-xs">&lt;th&gt;</code> or header relationship.
                  </li>
                  <li>
                    An input whose only &ldquo;label&rdquo; is placeholder text or nearby loose text.
                  </li>
                  <li>
                    Status or required-state shown by colour or position alone, with no text or ARIA equivalent.
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
              A fake heading vs. a real one
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Styling a <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">&lt;div&gt;</code>{" "}
              to look like a heading fools the eye but not the accessibility tree. Use a
              real heading element so the outline is programmatic.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- ✗ Looks like a heading, announced as plain text -->
<div class="text-2xl font-bold">Billing history</div>
<p>…</p>

<!-- ✓ Real heading: appears in the heading list, navigable by H -->
<h2>Billing history</h2>
<p>…</p>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Associating a label with its field
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Text sitting next to an input is not connected to it. Tie the{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">&lt;label&gt;</code>{" "}
              to the input with matching <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">for</code> and{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">id</code>.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- ✗ Loose text + placeholder: field announces only "edit text" -->
<div>Email address</div>
<input type="email" placeholder="Email address">

<!-- ✓ Programmatic association: field is named "Email address" -->
<label for="email">Email address</label>
<input type="email" id="email">

<!-- ✓ Related controls grouped and named -->
<fieldset>
  <legend>Preferred contact method</legend>
  <label><input type="radio" name="contact" value="email"> Email</label>
  <label><input type="radio" name="contact" value="phone"> Phone</label>
</fieldset>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              A grid of divs vs. a real data table
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Laying data out with CSS loses every header-to-cell relationship. A real
              table with <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">&lt;th scope&gt;</code>{" "}
              lets a screen reader announce &ldquo;Revenue, February: $18,000.&rdquo;
            </p>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- ✗ Visual-only table: no header relationships -->
<div class="grid">
  <div class="cell head">Month</div>
  <div class="cell head">Revenue</div>
  <div class="cell">February</div>
  <div class="cell">$18,000</div>
</div>

<!-- ✓ Real data table with headers and scope -->
<table>
  <caption>Monthly sales</caption>
  <thead>
    <tr>
      <th scope="col">Month</th>
      <th scope="col">Revenue</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">February</th>
      <td>$18,000</td>
    </tr>
  </tbody>
</table>`}</code>
            </pre>
          </section>

          {/* Interactive demo */}
          <section aria-labelledby="demo" className="mb-12">
            <h2
              id="demo"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Interactive demo
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              Switch between headings, lists, tables, and forms to compare semantic markup
              with a visual-only version that renders identically. Reveal the screen
              reader output to see what each one actually conveys to assistive technology.
            </p>
            <SemanticsDemo />
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
                "Using bold or larger text (a styled div or span) as a heading instead of a real h1–h6 element.",
                "Skipping heading levels — jumping from h2 to h4 — so the programmatic outline no longer matches the content.",
                "Building lists from <br> tags or divs with typed bullets, so no list, item count, or grouping is exposed.",
                "Laying out tabular data with CSS grids or divs, leaving no header-to-cell relationship for screen readers.",
                "Data tables with no <th>, no scope, or missing captions, so values have no header context.",
                "Using a placeholder as the only label, which disappears on input and is not a reliable accessible name.",
                "Labels placed near a field but not associated with it via <label for>/id or aria-labelledby.",
                "Conveying meaning with colour or position alone (required = red, status by column) with no text or ARIA equivalent.",
                "“Div soup” — building the whole page from generic divs and spans instead of landmarks, headings, and lists.",
                "Bolting on ARIA roles to fake semantics when a native element would do, often introducing contradictory or broken roles.",
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
              How to test for 1.3.1
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "Run an automated scan first",
                  d: "Tools like axe DevTools, WAVE, and Lighthouse catch missing table headers, unlabelled form fields, empty headings, and skipped heading levels. Treat this as the floor — automation finds absent structure, not structure that is present but wrong.",
                },
                {
                  t: "Inspect the heading outline",
                  d: "Use a headings-map tool or your screen reader’s heading list. Confirm every visual heading is a real h1–h6, the order is logical, and no levels are skipped. Anything that looks like a heading but is missing from the map fails.",
                },
                {
                  t: "Tab through every form",
                  d: "Move keyboard focus into each control and confirm it announces a meaningful name. Click each visible label and check that focus lands in the matching field — if it does not, the label is not associated.",
                },
                {
                  t: "Inspect tables in a screen reader",
                  d: "Navigate data tables cell by cell (for example Ctrl+Alt+arrows in NVDA/JAWS) and confirm the correct row and column headers are announced with each value. A flat read-out with no header context is a failure.",
                },
                {
                  t: "Listen to the whole page",
                  d: "With a screen reader, navigate by headings (H), lists (L), regions/landmarks, and tables (T). The structure you hear should match the structure you see — lists announced as lists, sections reachable as landmarks.",
                },
                {
                  t: "Check colour- and position-only meaning",
                  d: "For anything conveyed by colour, position, or styling alone (required fields, status, emphasis), confirm the same information is present in text or ARIA so it survives when the visuals are stripped away.",
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
          <CriterionLinks number="1.3.1" />

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
