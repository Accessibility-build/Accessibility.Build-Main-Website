import type { Metadata } from "next"
import Link from "next/link"
import {
  ArticleStructuredData,
  BreadcrumbStructuredData,
} from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"
import { CriterionLinks } from "@/components/wcag/criterion-links"

export const metadata: Metadata = {
  title: "WCAG 1.4.12 Text Spacing — The Four Metrics & Fixes",
  description:
    "Complete guide to WCAG 1.4.12 Text Spacing. Learn the four values users must be able to set — line height 1.5, paragraph spacing 2×, letter spacing 0.12, word spacing 0.16 — the test bookmarklet, why fixed-height containers clip text, copy-ready CSS fixes, and common mistakes.",
  keywords: [
    "WCAG 1.4.12",
    "Text Spacing",
    "text spacing accessibility",
    "line height accessibility",
    "letter spacing WCAG",
    "word spacing WCAG",
    "paragraph spacing",
    "text spacing bookmarklet",
    "1.4.12 test",
    "fixed height container clipping text",
    "line-height 1.5",
    "Level AA",
    "WCAG 2.1",
    "low vision accessibility",
  ],
  alternates: {
    canonical: "https://accessibility.build/wcag/1-4-12",
  },
  openGraph: {
    title:
      "WCAG 1.4.12 Text Spacing — The Four Metrics, the Test Bookmarklet & How to Fix It (Level AA)",
    description:
      "The definitive guide to WCAG 1.4.12: the four text-spacing values users must be able to override, the test bookmarklet, why fixed-height containers fail, and copy-ready CSS fixes.",
    url: "https://accessibility.build/wcag/1-4-12",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: "https://accessibility.build/api/og?title=WCAG%201.4.12%20Text%20Spacing&section=WCAG",
        width: 1200,
        height: 630,
        alt: "WCAG 1.4.12 Text Spacing guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WCAG 1.4.12 Text Spacing — The Four Metrics & How to Fix It",
    description:
      "Users must be able to set line height 1.5, paragraph spacing 2×, letter spacing 0.12, and word spacing 0.16 without losing content. The test bookmarklet, the fixes, and how to test for 1.4.12 Level AA.",
  },
}

const requirements = [
  {
    name: "Line height (line spacing)",
    value: "at least 1.5 × the font size",
    detail:
      "When the user sets the space between lines within a paragraph to 1.5 times the font size, every line of running text must stay visible and readable. Cramped 1.0 or 1.2 line height is hard for many people with dyslexia or low vision to track, so they increase it — and your layout has to absorb the extra height without clipping, overlapping, or hiding text.",
  },
  {
    name: "Spacing after paragraphs",
    value: "at least 2 × the font size",
    detail:
      "The gap following each paragraph must be able to grow to twice the font size. Clear separation between blocks of text helps people who lose their place easily find where one idea ends and the next begins. Your containers must let paragraphs push apart by this much without content being cut off at the bottom of a fixed box.",
  },
  {
    name: "Letter spacing (tracking)",
    value: "at least 0.12 × the font size",
    detail:
      "Users must be able to widen the space between individual characters to 0.12 times the font size. Extra letter spacing reduces the visual crowding that makes letters run together for some readers with dyslexia or low vision. Buttons, labels, and headings all have to accommodate the wider text rather than truncating it with an ellipsis.",
  },
  {
    name: "Word spacing",
    value: "at least 0.16 × the font size",
    detail:
      "The space between words must be able to increase to 0.16 times the font size. Wider word spacing makes it easier to distinguish where one word stops and the next starts. As with the other three metrics, the requirement is not that you set this value — it is that nothing breaks when the user does.",
  },
]

const faqs = [
  {
    q: "What does WCAG 1.4.12 Text Spacing require?",
    a: "It requires that no content or functionality is lost when a user overrides four text-spacing properties: line height set to at least 1.5 times the font size, spacing after paragraphs set to at least 2 times the font size, letter spacing set to at least 0.12 times the font size, and word spacing set to at least 0.16 times the font size. Crucially, it does not require you to design your text at these values — it requires your layout to survive when a reader applies them, typically through a browser extension or bookmarklet. It is a Level AA success criterion introduced in WCAG 2.1 and carried into WCAG 2.2.",
  },
  {
    q: "Do I have to set line-height: 1.5 and the other values on my site?",
    a: "No. This is the single most common misunderstanding of 1.4.12. The criterion does not force you to use those specific values in your design — you can style your text however you like. What it requires is that if a user increases spacing to those values, your page still works: no text is clipped, cut off, overlapping, or hidden, and no functionality is lost. That said, generous line height (around 1.5) and paragraph spacing are good defaults for readability, so many teams adopt them anyway.",
  },
  {
    q: "What is the text spacing bookmarklet and how does it test 1.4.12?",
    a: "The text spacing bookmarklet (originally published by Steve Faulkner) injects a stylesheet that applies all four required values at once using !important, so it overrides your own CSS. After running it you scan the page for any text that is now clipped, truncated, overlapping, or scrolled out of a fixed box. If everything remains readable and every control still works, the page passes. It is the fastest manual way to test 1.4.12, and it mirrors exactly what real reading extensions do for users.",
  },
  {
    q: "Why do fixed-height containers fail Text Spacing?",
    a: "A box with a fixed height (for example height: 40px) plus overflow: hidden cannot grow when line height or letter spacing increases, so the extra text is simply clipped. This is the number-one cause of 1.4.12 failures — most often in buttons, badges, navigation items, cards, and single-line truncated headings. The fix is to use min-height instead of a fixed height, and to avoid overflow: hidden on containers that hold real text, so the box expands with its content.",
  },
  {
    q: "Does 1.4.12 apply to text in images or in form fields I do not control?",
    a: "1.4.12 applies to text that can be styled with CSS. Text baked into an image is out of scope for this criterion (though it likely fails 1.4.5 Images of Text). Native form control text, placeholder text, and CAPTCHA are edge cases the criterion's understanding document treats leniently. The exception in the normative text also covers human languages and scripts that do not use one or more of these properties — for example, some scripts do not use spaces between words, so word spacing simply does not apply.",
  },
  {
    q: "How is 1.4.12 different from 1.4.4 Resize Text and 1.4.10 Reflow?",
    a: "They are related low-vision criteria that test different user adjustments. 1.4.4 Resize Text is about scaling the whole text up to 200% without loss. 1.4.10 Reflow is about content adapting to a 320 CSS pixel width (400% zoom) without two-dimensional scrolling. 1.4.12 Text Spacing is specifically about the reader overriding line, paragraph, letter, and word spacing. A robust layout that uses relative units, min-height instead of fixed height, and avoids clipping tends to pass all three together.",
  },
]

export default function WCAG1412Page() {
  return (
    <>
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "WCAG Success Criteria", url: "https://accessibility.build/wcag" },
          {
            name: "1.4.12 Text Spacing",
            url: "https://accessibility.build/wcag/1-4-12",
          },
        ]}
      />

      <ArticleStructuredData
        headline="WCAG 1.4.12 Text Spacing: The Complete Guide to the Four Metrics and How to Test"
        description="The definitive guide to WCAG 1.4.12 Text Spacing: the four user-adjustable values, the test bookmarklet, why fixed-height containers clip text, copy-ready CSS fixes, common mistakes, and testing methods."
        author={{
          name: "Khushwant Parihar",
          url: "https://accessibility.build/about",
        }}
        publisher={{
          name: "Accessibility.build",
          logo: "https://accessibility.build/android-chrome-512x512.png",
        }}
        datePublished="2026-07-07"
        dateModified="2026-07-07"
        image="https://accessibility.build/api/og?title=WCAG%201.4.12%20Text%20Spacing&section=WCAG"
        url="https://accessibility.build/wcag/1-4-12"
        wordCount={2900}
        keywords={[
          "WCAG 1.4.12",
          "Text Spacing",
          "line height accessibility",
          "letter spacing",
          "word spacing",
          "text spacing bookmarklet",
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
                    1.4.12 Text Spacing
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
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                Critical for dyslexia &amp; low vision
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
              WCAG 1.4.12: Text Spacing
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              Some readers need{" "}
              <strong className="text-slate-900 dark:text-white">
                more air between lines, words, and letters
              </strong>{" "}
              to read comfortably. Text Spacing does not ask you to design at those
              values — it asks that when a user overrides line height, paragraph
              spacing, letter spacing, and word spacing, your page keeps working:
              nothing gets clipped, cut off, or hidden. The most common failure is a
              fixed-height box that clips the taller text, so the whole rule really
              comes down to building containers that can grow.
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
              In content implemented using markup languages that support the
              following text style properties, no loss of content or functionality
              occurs by setting all of the following and by changing no other style
              property: line height (line spacing) to at least 1.5 times the font
              size; spacing following paragraphs to at least 2 times the font size;
              letter spacing (tracking) to at least 0.12 times the font size; and
              word spacing to at least 0.16 times the font size. Exception: human
              languages and scripts that do not make use of one or more of these
              text style properties in written text can conform using only the
              properties that exist for that combination of language and script.
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
                  Why text spacing matters
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#what">
                  The four metrics
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#misconception">
                  You do not have to set these values
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
              Why text spacing matters
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Tightly packed text is a genuine barrier. People with dyslexia often
              find that letters and words visually crowd together and swap places;
              adding space between characters and lines settles the text and makes
              it far easier to read. People with low vision lose their place on a
              densely set page and rely on extra line and paragraph spacing to track
              from one line to the next. For these readers, the ability to open up
              the text is not a preference — it is what makes reading possible at
              all.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Browser extensions and reading tools let people apply exactly these
              adjustments across every site they visit. WCAG 1.4.12 makes sure that
              when they do, your content does not fall apart. The failure is almost
              always silent: a button label gets clipped, a card cuts off its last
              line, a navigation item hides half its text — and the user has no idea
              information is missing.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              The good news is that a layout built with flexible, content-sized
              containers passes 1.4.12 without any special effort. The rule mostly
              exposes rigid designs that assume text will always be exactly the size
              and spacing the designer chose.
            </p>
          </section>

          {/* What */}
          <section aria-labelledby="what" className="mb-12">
            <h2
              id="what"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              The four metrics
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              To pass, your content must survive a user setting <em>all four</em> of
              these values at once, while changing nothing else. Each value is
              expressed relative to the font size, so it scales with whatever text is
              on the page.
            </p>
            <div className="space-y-4">
              {requirements.map((r, i) => (
                <div
                  key={r.name}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 p-6"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                      {i + 1}. {r.name}
                    </h3>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 font-mono">
                      {r.value}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {r.detail}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/20 p-5">
              <p className="text-emerald-900 dark:text-emerald-200 leading-relaxed">
                <strong>Remember the four numbers:</strong> line height{" "}
                <code className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/40 font-mono text-sm">
                  1.5
                </code>
                , paragraph spacing{" "}
                <code className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/40 font-mono text-sm">
                  2em
                </code>
                , letter spacing{" "}
                <code className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/40 font-mono text-sm">
                  0.12em
                </code>
                , word spacing{" "}
                <code className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/40 font-mono text-sm">
                  0.16em
                </code>
                . The user applies all four together — your job is to make sure
                nothing breaks.
              </p>
            </div>
          </section>

          {/* Misconception */}
          <section aria-labelledby="misconception" className="mb-12">
            <h2
              id="misconception"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              You do not have to set these values
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              The biggest misconception about 1.4.12 is that it forces every site to
              use{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                line-height: 1.5
              </code>{" "}
              and the other values. It does not. You are free to design your
              typography however you like. The criterion is a{" "}
              <strong className="text-slate-900 dark:text-white">
                resilience test
              </strong>
              : it checks that <em>if</em> a reader overrides these four properties,
              your layout adapts instead of clipping or hiding text.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              In practice that shifts the work away from typography and onto your
              container CSS. The single most reliable way to pass is to let boxes
              that contain text grow with their content — use{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                min-height
              </code>{" "}
              rather than a fixed{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                height
              </code>
              , and avoid clipping with{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                overflow: hidden
              </code>{" "}
              on anything holding real words. Do that, and Text Spacing tends to take
              care of itself.
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
              The exact styles a user applies
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              This is the stylesheet the test bookmarklet injects — the four required
              values expressed relative to the font size. Your page must remain fully
              readable and operable with these applied.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`/* What a text-spacing reader tool applies to your page */
* {
  line-height: 1.5 !important;
  letter-spacing: 0.12em !important;
  word-spacing: 0.16em !important;
}

p {
  margin-bottom: 2em !important;   /* spacing after paragraphs */
}`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Fragile: a fixed-height box that clips
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              This button looks fine at your chosen spacing, but the fixed height and
              hidden overflow mean taller text is simply cut off. This is the classic
              1.4.12 failure.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`/* ✗ Fails Text Spacing */
.button {
  height: 40px;            /* cannot grow when line height increases */
  overflow: hidden;        /* extra text is clipped, not shown */
  white-space: nowrap;     /* wider letter/word spacing overflows */
}

.card {
  height: 220px;           /* last line disappears below the fold */
  overflow: hidden;
}`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Resilient: containers that grow with their text
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Swap fixed heights for{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                min-height
              </code>
              , let text wrap, and remove clipping. The box now expands when spacing
              increases, so no content is lost.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`/* ✓ Passes Text Spacing */
.button {
  min-height: 40px;        /* grows to fit taller text */
  padding: 0.5rem 1rem;    /* space defined in relative units */
  display: inline-flex;
  align-items: center;
  white-space: normal;     /* allow wrapping instead of overflow */
}

.card {
  min-height: 220px;       /* a floor, not a ceiling */
  /* no overflow: hidden on the text container */
}`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Do not block the user with <code className="text-lg">!important</code>
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              A reader tool overrides your spacing with{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                !important
              </code>
              . If you hard-lock line height the same way, you can defeat their
              adjustment entirely — set spacing normally so it can be overridden.
            </p>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`/* ✗ Fights the user's stylesheet */
body { line-height: 1.2 !important; }

/* ✓ Overridable — the reader tool can win */
body { line-height: 1.5; }`}</code>
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
                "Fixed-height containers with overflow: hidden — buttons, badges, chips, and cards that clip the taller text (the single most common failure).",
                "Single-line headings or titles truncated with text-overflow: ellipsis inside a box that cannot grow, so wider letter spacing hides the end of the text.",
                "Hard-locking line-height, letter-spacing, or word-spacing with !important, which prevents the user's reading tool from applying its own values.",
                "Vertical space set in fixed px (for example a 40px tall nav bar) rather than allowing the bar to expand when its text grows.",
                "Text overlapping adjacent elements when line height increases because rows are absolutely positioned at fixed offsets.",
                "Assuming 1.4.12 means you must set line-height: 1.5 everywhere — it does not; it means your layout must survive the user setting it.",
                "Content that scrolls out of a fixed-height modal or panel and cannot be reached once spacing pushes it beyond the box.",
                "Testing only the happy path and missing dense components — data tables, tab labels, breadcrumb trails, and tooltips are frequent offenders.",
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
              How to test for 1.4.12
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "Apply all four values at once",
                  d: "Use the text spacing bookmarklet or a browser extension to set line height 1.5, paragraph spacing 2×, letter spacing 0.12, and word spacing 0.16 together. Testing them one at a time misses interactions — the criterion requires all four applied simultaneously.",
                },
                {
                  t: "Scan for clipped or cut-off text",
                  d: "Walk the whole page looking for any text that is now truncated, cut off at the bottom of a box, hidden behind another element, or replaced with an ellipsis that was not there before. Every such spot is a failure.",
                },
                {
                  t: "Check the dense components",
                  d: "Pay special attention to buttons, badges, navigation, tabs, cards, tables, breadcrumbs, and tooltips — small fixed-size components are where clipping hides. Open menus and modals too, since their content often sits in fixed-height boxes.",
                },
                {
                  t: "Confirm nothing lost its function",
                  d: "Make sure every control is still fully visible and operable. A button whose label is clipped, or a link pushed out of a scrollable area, is a loss of functionality even if the page still looks mostly intact.",
                },
                {
                  t: "Re-test at mobile and zoom",
                  d: "Resize to a narrow viewport and combine with 200% zoom. Spacing overrides plus a small screen expose the most fragile layouts — this is exactly the situation real low-vision users are in.",
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
              Text Spacing is a manual check — automated tools cannot see whether
              overridden text is clipped or overlapping. Pair the bookmarklet
              walkthrough with the{" "}
              <Link
                href="/tools/url-accessibility-auditor"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                URL Accessibility Auditor
              </Link>{" "}
              for the automated checks, and work through the full{" "}
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
            <CriterionLinks number="1.4.12" />
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
            content="text spacing line height letter spacing word spacing paragraph spacing text spacing bookmarklet fixed height container clipping low vision dyslexia readability reflow resize text distinguishable min-height overflow hidden WCAG 1.4.12 Level AA"
            maxItems={6}
          />
        </section>
      </div>
    </>
  )
}
