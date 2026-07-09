import type { Metadata } from "next"
import Link from "next/link"
import WCAGSEOEnhancements from "@/components/wcag/seo-enhancements"
import WCAGBreadcrumb from "@/components/wcag/breadcrumb"
import { CriterionLinks } from "@/components/wcag/criterion-links"

export const metadata: Metadata = {
  title: "WCAG 1.4.8 Visual Presentation — AAA Text Guide",
  description:
    "WCAG 1.4.8's five requirements for blocks of text: selectable colors, 80-character lines, no justification, 1.5 line spacing, and 200% resize without scrolling.",
  keywords: [
    "WCAG 1.4.8",
    "Visual Presentation",
    "80 character line length",
    "justified text accessibility",
    "line spacing 1.5",
    "user selectable colors",
    "200% text resize",
    "readability low vision",
    "Level AAA",
    "WCAG 2.2",
  ],
  alternates: {
    canonical: "/wcag/1-4-8",
  },
  openGraph: {
    title: "WCAG 1.4.8 Visual Presentation — The Five Text Requirements (AAA)",
    description:
      "Blocks of text must support selectable colors, ≤80-character lines, unjustified text, 1.5 line spacing with larger paragraph spacing, and 200% resize without horizontal scrolling.",
    url: "/wcag/1-4-8",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: "/api/og?title=WCAG%201.4.8%20Visual%20Presentation&section=WCAG",
        width: 1200,
        height: 630,
        alt: "WCAG 1.4.8 Visual Presentation guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WCAG 1.4.8 Visual Presentation — The Five Text Requirements",
    description:
      "Selectable colors, ≤80-character lines, no justified text, 1.5 line spacing, and 200% resize without horizontal scrolling. The full AAA guide to 1.4.8.",
    images: ["/api/og?title=WCAG%201.4.8%20Visual%20Presentation&section=WCAG"],
  },
}

const requirements = [
  {
    name: "1. Colors selectable by the user",
    rule: "Foreground and background colors can be selected by the user.",
    detail:
      "Readers with low vision, dyslexia, or light sensitivity often need specific combinations — light-on-dark, sepia, yellow-on-black. Conformance usually means not fighting the platform: browser and OS color overrides must work on your text, which they do as long as text is real text and you have not hard-blocked user styles. Providing your own theme picker also satisfies this.",
  },
  {
    name: "2. Line length ≤ 80 characters",
    rule: "Width is no more than 80 characters or glyphs (40 if CJK).",
    detail:
      "Long lines make it hard to track from the end of one line to the start of the next. Blocks of text must be able to render at 80 characters or fewer per line (40 for Chinese, Japanese, and Korean glyphs). A max-width in ch units, or a fluid layout the user can narrow, both work.",
  },
  {
    name: "3. Text not justified",
    rule: "Text is not justified (aligned to both the left and the right margins).",
    detail:
      "Full justification creates uneven word spacing and 'rivers' of white space that many readers with dyslexia find severely disruptive. Blocks of text must be left-aligned (in LTR languages) or right-aligned (RTL) — or a mechanism must exist to remove justification.",
  },
  {
    name: "4. Line and paragraph spacing",
    rule: "Line spacing is at least space-and-a-half within paragraphs, and paragraph spacing is at least 1.5 times larger than the line spacing.",
    detail:
      "Cramped leading makes lines blur together. Within paragraphs, line spacing must be at least 1.5; between paragraphs, the space must be at least 1.5 times the line spacing — e.g. with line-height: 1.5 on 16px text (24px), paragraph spacing of at least 36px (2.25em). A default this generous, or a mechanism to achieve it, conforms.",
  },
  {
    name: "5. 200% resize without horizontal scrolling",
    rule: "Text resizes up to 200 percent without requiring horizontal scrolling to read a line of text on a full-screen window.",
    detail:
      "When the user zooms text to twice its size, lines must wrap within the viewport — no sideways scrolling back and forth to read each line. Responsive, reflowing layouts pass; fixed-width columns that overflow fail. This is stricter than 1.4.4 (AA), which allows some loss of layout fidelity but not of content.",
  },
]

const faqs = [
  {
    q: "What does WCAG 1.4.8 Visual Presentation require?",
    a: "For blocks of text, a mechanism must be available to achieve five things: (1) foreground and background colors can be selected by the user; (2) width is no more than 80 characters or glyphs (40 if CJK); (3) text is not justified to both margins; (4) line spacing is at least space-and-a-half within paragraphs and paragraph spacing is at least 1.5 times larger than the line spacing; and (5) text can be resized up to 200% without assistive technology in a way that does not require horizontal scrolling to read a line on a full-screen window. It is a Level AAA criterion from WCAG 2.0.",
  },
  {
    q: "What counts as a 'block of text'?",
    a: "More than one sentence of text — running prose like articles, documentation, and long descriptions. Headings, labels, menus, captions, and single-sentence UI strings are not blocks of text, so 1.4.8 does not constrain them. That scoping matters: an 80ch limit on your article column is required; an 80ch limit on your navigation bar is not.",
  },
  {
    q: "Does 'a mechanism is available' mean my defaults don't have to comply?",
    a: "Correct — with care. The criterion is satisfied if the user can achieve each condition, whether because your defaults already meet it, because you provide controls (theme picker, width toggle, spacing switch), or because you simply do not defeat the browser and OS features that do it (user stylesheets, reader mode, forced colors, zoom). The trap is actively breaking those mechanisms: text rendered as images, !important color declarations that fight forced-colors mode, fixed-width layouts that cannot narrow, or zoom-hostile viewport settings.",
  },
  {
    q: "Is the 80-character limit about my default design or a hard maximum?",
    a: "The user must be able to get lines of 80 characters or fewer. If your text column is fluid and narrows when the user resizes the window or zooms, that mechanism alone can satisfy the requirement even if a very wide window shows longer lines. In practice, setting max-width: 80ch (or less — typography guidance usually favors 45–75 characters) on prose containers is the simplest, most robust answer, and it reads better for everyone.",
  },
  {
    q: "How do the spacing numbers in 1.4.8 relate to 1.4.12 Text Spacing?",
    a: "They approach the same readability problem from opposite directions. 1.4.12 (AA) says: if the user overrides spacing to line-height 1.5 and paragraph spacing 2× the font size, nothing may break. 1.4.8 (AAA) says: the user must be able to achieve line spacing of at least 1.5 within paragraphs, with paragraph spacing at least 1.5 times the line spacing. Note the units differ — 1.4.12's paragraph spacing is measured against font size, 1.4.8's against line spacing. Ship line-height: 1.5+ and generous paragraph margins and you satisfy both comfortably.",
  },
  {
    q: "How is the 200% requirement here different from 1.4.4 and 1.4.10?",
    a: "1.4.4 Resize Text (AA) requires 200% resize without loss of content or functionality, but tolerates horizontal scrolling. 1.4.10 Reflow (AA) requires no two-dimensional scrolling at 320 CSS pixels width (400% zoom), with exceptions for tables, images, and similar. 1.4.8's fifth condition targets reading specifically: at up to 200%, a line of text must be readable on a full-screen window without horizontal scrolling. A properly responsive, reflowing text layout satisfies all three at once.",
  },
]

export default function WCAG148Page() {
  return (
    <>
      <WCAGSEOEnhancements
        title="WCAG 1.4.8: Visual Presentation"
        description="For the visual presentation of blocks of text, a mechanism is available to achieve user-selected colors, 80-character lines, unjustified text, generous line and paragraph spacing, and 200% resize without horizontal scrolling."
        criteria="1.4.8"
        level="AAA"
        principle="Perceivable"
        guideline="1.4 Distinguishable"
        url="https://accessibility.build/wcag/1-4-8"
        category="Distinguishable"
        relatedCriteria={["1.4.4", "1.4.10", "1.4.12"]}
      />

      <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <WCAGBreadcrumb items={[]} current="1.4.8 Visual Presentation" />

          {/* Header */}
          <header className="mb-12">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                Level AAA
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Principle 1: Perceivable
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                Guideline 1.4 Distinguishable
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
              WCAG 1.4.8: Visual Presentation
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              Reading is where low vision, dyslexia, and cognitive load all collide with
              typography. This AAA criterion bundles{" "}
              <strong className="text-slate-900 dark:text-white">
                five requirements for blocks of text
              </strong>
              : user-selectable colors, lines of at most 80 characters, no full
              justification, space-and-a-half line spacing, and 200% resize without
              horizontal scrolling.
            </p>
          </header>

          {/* Official text */}
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
            <blockquote className="text-slate-700 dark:text-slate-300 leading-relaxed border-l-4 border-purple-500 pl-4">
              For the visual presentation of blocks of text, a mechanism is available to
              achieve the following: (1) foreground and background colors can be selected
              by the user; (2) width is no more than 80 characters or glyphs (40 if
              CJK); (3) text is not justified (aligned to both the left and the right
              margins); (4) line spacing (leading) is at least space-and-a-half within
              paragraphs, and paragraph spacing is at least 1.5 times larger than the
              line spacing; (5) text can be resized without assistive technology up to
              200 percent in a way that does not require the user to scroll horizontally
              to read a line of text on a full-screen window.
            </blockquote>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4 text-sm">
              The key phrase is <em>a mechanism is available</em>: your defaults can meet
              each condition, or you can give users a way to reach it — including simply
              not defeating the browser and OS features that already provide it.
            </p>
          </section>

          {/* Five requirements */}
          <section aria-labelledby="five" className="mb-12">
            <h2
              id="five"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              The five requirements, unpacked
            </h2>
            <div className="space-y-4">
              {requirements.map((r) => (
                <div
                  key={r.name}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 p-5"
                >
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                    {r.name}
                  </h3>
                  <p className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-2">
                    {r.rule}
                  </p>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                    {r.detail}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-6">
              1.4.8 applies to <em>blocks of text</em> — running prose of more than a
              sentence. Headings, navigation labels, and short UI strings are out of
              scope. The criterion sits alongside its AA cousins:{" "}
              <Link href="/wcag/1-4-12" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                1.4.12 Text Spacing
              </Link>{" "}
              (user overrides must not break the layout) and{" "}
              <Link href="/wcag/1-4-10" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                1.4.10 Reflow
              </Link>{" "}
              (no 2-D scrolling at 400% zoom).
            </p>
          </section>

          {/* Who it helps */}
          <section aria-labelledby="who" className="mb-12">
            <h2
              id="who"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Who this helps
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  t: "People with dyslexia and reading disabilities",
                  d: "Unjustified text, short lines, and generous spacing remove the rivers, crowding, and line-tracking failures that make reading exhausting.",
                },
                {
                  t: "People with low vision",
                  d: "Custom color pairs, larger text that reflows, and clear paragraph separation together keep long-form reading possible without a screen magnifier.",
                },
                {
                  t: "People with light sensitivity",
                  d: "Selecting their own foreground and background — dark themes, low-glare palettes — is often the difference between reading and not reading at all.",
                },
                {
                  t: "People with cognitive and attention differences",
                  d: "Shorter lines and visible paragraph boundaries reduce place-losing and re-reading; consistent spacing lowers the effort of every page.",
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

          {/* Code examples */}
          <section aria-labelledby="code" className="mb-12">
            <h2
              id="code"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              CSS patterns
            </h2>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              1. A prose container that satisfies width, alignment, and spacing
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Four declarations cover conditions 2, 3, and 4 — and the{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">ch</code>{" "}
              unit measures width in characters directly.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`.prose {
  max-width: 70ch;        /* ≤ 80 characters per line (40 for CJK) */
  text-align: left;       /* never justify blocks of text */
  line-height: 1.5;       /* space-and-a-half within paragraphs */
}

.prose p {
  /* Paragraph spacing ≥ 1.5 × line spacing:
     line spacing = 1.5em → need ≥ 2.25em between paragraphs */
  margin-block-end: 2.25em;
}

/* ✗ Anti-pattern: justified text creates rivers of white space */
.prose--bad {
  text-align: justify;
}`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              2. Reflow at 200%: relative units and no fixed columns
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Condition 5 fails when layouts fix their widths in pixels. Size in relative
              units and let text wrap.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`/* ✓ Fluid column: zooming to 200% reflows, never side-scrolls */
main {
  width: min(70ch, 100% - 2rem);
  margin-inline: auto;
}

html {
  font-size: 100%;        /* respect the user's base size */
}

/* ✗ Anti-patterns that force horizontal scrolling at 200% */
.layout--bad {
  width: 960px;           /* fixed pixel column */
  white-space: nowrap;    /* unwrappable lines */
}`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              3. User-selectable colors: cooperate, and optionally provide
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Real text plus theme tokens means browser overrides, forced-colors mode,
              and your own theme picker all work.
            </p>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`:root { --fg: #1f2937; --bg: #ffffff; }
[data-theme="dark"]  { --fg: #e2e8f0; --bg: #0f172a; }
[data-theme="sepia"] { --fg: #433422; --bg: #f4ecd8; }

body {
  color: var(--fg);
  background: var(--bg);
}

/* Cooperate with Windows High Contrast / forced colors */
@media (forced-colors: active) {
  body { color: CanvasText; background: Canvas; }
}`}</code>
            </pre>
          </section>

          {/* Testing */}
          <section aria-labelledby="testing" className="mb-12">
            <h2
              id="testing"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              How to test for 1.4.8
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "Measure line length",
                  d: "In DevTools, count characters per line in the widest block of prose (or divide column width by average character width). Confirm lines are at most 80 characters — or that narrowing the window achieves it without breaking the layout.",
                },
                {
                  t: "Scan for justified text",
                  d: "Search stylesheets for text-align: justify and inspect rendered paragraphs for flush right edges. Any justified block of prose is a failure unless a mechanism removes it.",
                },
                {
                  t: "Verify line and paragraph spacing",
                  d: "Check computed line-height is at least 1.5 within paragraphs, and that the gap between paragraphs is at least 1.5 times the line spacing (e.g. ≥ 2.25em when line-height is 1.5).",
                },
                {
                  t: "Zoom to 200% full-screen",
                  d: "Maximize the window and zoom to 200%. Read several paragraphs: if you must scroll horizontally to finish a line, condition 5 fails. Check both browser zoom and text-only zoom.",
                },
                {
                  t: "Override the colors",
                  d: "Apply a user stylesheet, reader mode, or forced-colors mode and set your own foreground/background. Text should adopt the chosen colors; text baked into images or locked by aggressive CSS is a failure.",
                },
              ].map((step, i) => (
                <li
                  key={step.t}
                  className="flex gap-4 rounded-xl border border-slate-200 dark:border-slate-800 p-5"
                >
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center">
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
          </section>

          {/* Common failures */}
          <section aria-labelledby="failures" className="mb-12">
            <h2
              id="failures"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Common failures
            </h2>
            <ul className="space-y-3">
              {[
                "text-align: justify on article bodies — the single most common 1.4.8 failure, and one with no visual upside.",
                "Full-width prose on large monitors producing 120–160-character lines with no max-width and no way to narrow them.",
                "line-height of 1.2 or 'normal' on body copy, with paragraphs separated by less than the line spacing.",
                "Fixed-pixel layouts that force horizontal scrolling as soon as text is zoomed to 200%.",
                "Long-form content rendered as images of text, which no color, spacing, or zoom mechanism can touch.",
                "CSS that fights user overrides — !important colors everywhere and forced-colors mode explicitly disabled.",
              ].map((m) => (
                <li
                  key={m}
                  className="flex gap-3 rounded-lg border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-4"
                >
                  <span aria-hidden="true" className="text-rose-500 font-bold">
                    ✗
                  </span>
                  <span className="text-slate-700 dark:text-slate-300 leading-relaxed">{m}</span>
                </li>
              ))}
            </ul>
          </section>

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

          <CriterionLinks number="1.4.8" />
        </article>
      </div>
    </>
  )
}
