import type { Metadata } from "next"
import Link from "next/link"
import {
  ArticleStructuredData,
  BreadcrumbStructuredData,
} from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"
import { CriterionLinks } from "@/components/wcag/criterion-links"

export const metadata: Metadata = {
  title: "WCAG 1.4.11 Non-text Contrast — UI & Graphics Contrast",
  description:
    "Complete guide to WCAG 1.4.11 Non-text Contrast. Learn the 3:1 rule for user interface components and graphical objects: button borders, input outlines, focus indicators, toggle states, icons, and chart elements — with exceptions, code examples, testing methods, and common mistakes.",
  keywords: [
    "WCAG 1.4.11",
    "Non-text Contrast",
    "3:1 contrast",
    "UI component contrast",
    "graphical object contrast",
    "icon contrast",
    "button border contrast",
    "input border contrast",
    "focus indicator contrast",
    "color contrast accessibility",
    "Level AA",
    "WCAG 2.2",
    "form field contrast",
    "chart accessibility contrast",
  ],
  alternates: {
    canonical: "https://accessibility.build/wcag/1-4-11",
  },
  openGraph: {
    title:
      "WCAG 1.4.11 Non-text Contrast — UI & Graphics Contrast Guide (Level AA)",
    description:
      "The definitive guide to WCAG 1.4.11 Non-text Contrast: the 3:1 rule for interface components and meaningful graphics, the exceptions that apply, copy-ready code, and how to test.",
    url: "https://accessibility.build/wcag/1-4-11",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: "https://accessibility.build/og-image.png",
        width: 1200,
        height: 630,
        alt: "WCAG 1.4.11 Non-text Contrast guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WCAG 1.4.11 Non-text Contrast — UI & Graphics Contrast",
    description:
      "Interface components and meaningful graphics need at least 3:1 contrast against adjacent colors: borders, focus rings, icons, chart bars. How to meet and test WCAG 1.4.11 Level AA.",
  },
}

const requirements = [
  {
    name: "User interface components need 3:1 contrast",
    summary: "The visual cues that identify a control and its state must stand out.",
    detail:
      "Any visual information required to identify a user interface component, and the different states of that component, must have a contrast ratio of at least 3:1 against adjacent colors. That includes the border of a text input, the outline of a button, the checked vs unchecked state of a checkbox, the on/off position of a toggle, and the focus indicator. If the only thing telling the user 'this is a field' is a 1.5:1 grey hairline, it fails.",
  },
  {
    name: "Graphical objects need 3:1 contrast",
    summary: "The parts of a graphic you actually need to understand it must be perceivable.",
    detail:
      "Parts of graphics required to understand the content must also reach 3:1 against adjacent colors. Think of the line in a line chart, the slices of a pie chart, a meaningful icon (a magnifying glass that is the only label on a search button), or a required arrow in a diagram. Purely decorative graphics that carry no information are exempt.",
  },
  {
    name: "Contrast is measured against what sits next to it",
    summary: "Adjacent colors, not just the page background.",
    detail:
      "The 3:1 ratio is calculated between the non-text element and the colors immediately adjacent to it. A button border is measured against both the button fill on one side and the page background on the other; it must hit 3:1 on at least one of those edges so the boundary is perceivable. A white icon on a mid-blue button is measured against that blue, not against the white page behind the button.",
  },
]

const exceptions = [
  "Inactive (disabled) components — a greyed-out button or field that cannot be used is exempt, because its low contrast also signals that it is unavailable.",
  "Appearance determined by the browser — if you have not styled a control and it relies on the user agent's default rendering, the author is not responsible for its contrast.",
  "Logos and brand names — a logo's contrast is whatever the brand uses; it is not held to 3:1.",
  "Essential presentation — when a specific color or low-contrast presentation is essential to the information (for example, a screenshot showing exactly what a low-contrast UI looks like, or a heatmap where the gradient is the data).",
  "Decorative graphics — images and graphic parts that convey no information and are not needed to understand the content.",
]

const faqs = [
  {
    q: "What does WCAG 1.4.11 Non-text Contrast require?",
    a: "WCAG 1.4.11 requires a contrast ratio of at least 3:1 against adjacent colors for two things: (1) the visual information needed to identify user interface components and their states — button and input borders, focus indicators, the checked state of a checkbox, the position of a toggle — and (2) the parts of graphical objects that are required to understand the content, such as the bars in a chart or a meaningful icon. It is a Level AA criterion introduced in WCAG 2.1 and carried into WCAG 2.2, so it applies to most legal and contractual accessibility requirements including the ADA and Section 508.",
  },
  {
    q: "How is 1.4.11 different from 1.4.3 Contrast (Minimum)?",
    a: "1.4.3 covers the contrast of text and images of text, requiring 4.5:1 for normal text and 3:1 for large text. 1.4.11 covers everything that is not text: the visual boundaries of controls, their states, focus indicators, and meaningful graphics — all at 3:1. Together they make sure both the words and the interface chrome that surrounds them are perceivable. A page can pass 1.4.3 with perfectly readable text and still fail 1.4.11 because its input fields are outlined with a near-invisible grey border.",
  },
  {
    q: "Do placeholder-only text fields fail 1.4.11?",
    a: "They often do — but for two different reasons. If a field has no visible border or background change and is identified only by faint placeholder text, the boundary of the field is not perceivable, which fails 1.4.11 (and the placeholder text itself usually fails 1.4.3). The fix is to give the field a visible boundary at 3:1 against the background, plus a persistent visible label. Never rely on placeholder text alone to identify or label a field.",
  },
  {
    q: "Does the focus indicator have to meet 3:1 under 1.4.11?",
    a: "Yes. A focus indicator is visual information required to identify the state of a component (which element currently has keyboard focus), so it falls under 1.4.11 and should reach 3:1 against adjacent colors. This works alongside 2.4.7 Focus Visible (the indicator must exist) and WCAG 2.2's 2.4.11 Focus Not Obscured and 2.4.13 Focus Appearance. Designing a focus ring that is roughly 2px thick at 3:1 contrast satisfies all of them.",
  },
  {
    q: "Do disabled buttons need to meet 1.4.11?",
    a: "No. Inactive (disabled) components are explicitly exempt. A greyed-out button that cannot be activated does not have to reach 3:1, and its low contrast actually helps communicate that it is unavailable. Be careful, though: a control that looks disabled but is still operable is a usability and accessibility problem regardless of the exemption.",
  },
  {
    q: "How do I check non-text contrast?",
    a: "Use an eyedropper-based contrast checker. Sample the color of the non-text element (a border, an icon, a chart bar) and the color immediately adjacent to it, then confirm the ratio is at least 3:1. Browser DevTools, the WebAIM/TPGi color contrast analyzers, and design-tool plugins all do this. Automated scanners can catch some text contrast issues but rarely judge UI-component and graphic contrast reliably, so non-text contrast is largely a manual, eyedropper-driven check.",
  },
]

export default function WCAG1411Page() {
  return (
    <>
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "WCAG Success Criteria", url: "https://accessibility.build/wcag" },
          {
            name: "1.4.11 Non-text Contrast",
            url: "https://accessibility.build/wcag/1-4-11",
          },
        ]}
      />

      <ArticleStructuredData
        headline="WCAG 1.4.11 Non-text Contrast: The Complete UI & Graphics Contrast Guide"
        description="The definitive guide to WCAG 1.4.11 Non-text Contrast: why user interface components and meaningful graphics need at least 3:1 contrast against adjacent colors, the exceptions that apply, code examples, testing methods, and common mistakes."
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
        image="https://accessibility.build/og-image.png"
        url="https://accessibility.build/wcag/1-4-11"
        wordCount={3000}
        keywords={[
          "WCAG 1.4.11",
          "Non-text Contrast",
          "3:1 contrast",
          "UI component contrast",
          "graphical object contrast",
          "icon contrast",
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
                    1.4.11 Non-text Contrast
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
                One of the most failed AA criteria
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
              WCAG 1.4.11: Non-text Contrast
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              Text is not the only thing on a page that has to be visible. The{" "}
              <strong className="text-slate-900 dark:text-white">
                borders, states, focus rings, and meaningful graphics
              </strong>{" "}
              that make an interface usable must reach at least{" "}
              <strong className="text-slate-900 dark:text-white">
                3:1 contrast
              </strong>{" "}
              against their surroundings. A field nobody can see the edge of, a
              toggle whose on and off states look identical, or a chart whose
              bars blur together all fail this Level AA criterion.
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
              The visual presentation of the following have a contrast ratio of
              at least 3:1 against adjacent color(s): <strong>User Interface
              Components</strong> — visual information required to identify user
              interface components and states, except for inactive components or
              where the appearance of the component is determined by the user
              agent and not modified by the author;{" "}
              <strong>Graphical Objects</strong> — parts of graphics required to
              understand the content, except when a particular presentation of
              graphics is essential to the information being conveyed.
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
                  Why non-text contrast matters
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#what">
                  What 1.4.11 actually requires
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#components">
                  UI components and states
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#graphics">
                  Graphical objects
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#exceptions">
                  The exceptions
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
              Why non-text contrast matters
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              People with low vision, age-related sight loss, or color vision
              deficiencies rely on contrast to perceive structure. When the
              boundary of a control fades into the background, a user cannot tell
              where a button ends, whether a field is empty or filled, or which
              option in a group is selected. The information is on the screen,
              but it is invisible to a large share of users — and to anyone on a
              dim laptop screen in bright sunlight.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              The trend toward minimal, &quot;flat&quot; interfaces made this
              worse: hairline borders, ghost buttons with no fill, light-grey
              placeholder-only fields, and pastel chart palettes all look clean
              in a designer&apos;s high-end monitor and disappear everywhere
              else. 1.4.11 is the floor that keeps an interface perceivable, and
              it is consistently one of the most commonly failed Level AA
              criteria in real audits.
            </p>
          </section>

          {/* What */}
          <section aria-labelledby="what" className="mb-12">
            <h2
              id="what"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              What 1.4.11 actually requires
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              The criterion has three testable ideas. Meet them and your
              interface chrome stays perceivable.
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
                <strong>The number to remember:</strong> 3:1. Unlike text, which
                needs 4.5:1 for normal sizes under{" "}
                <Link
                  href="/wcag/1-4-3"
                  className="underline font-medium"
                >
                  1.4.3 Contrast (Minimum)
                </Link>
                , every non-text element this criterion covers shares the same
                single threshold of 3:1 against adjacent colors.
              </p>
            </div>
          </section>

          {/* UI components */}
          <section aria-labelledby="components" className="mb-12">
            <h2
              id="components"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              User interface components and states
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              This is the half of 1.4.11 that catches most teams out. You do not
              have to outline everything — but where a visual cue is the{" "}
              <em>only</em> thing identifying a control or its state, that cue
              must reach 3:1.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  t: "Field & button boundaries",
                  d: "If the only thing telling the user 'this is an input' is its border, that border needs 3:1 against the page. A button identified only by its fill needs that fill to reach 3:1 against the background.",
                },
                {
                  t: "Selected vs unselected states",
                  d: "The checked state of a checkbox, the on position of a toggle, the active tab, or the selected radio button must differ from the unselected state by at least 3:1 — color alone at low contrast is not enough.",
                },
                {
                  t: "Focus indicators",
                  d: "A focus ring is visual information identifying which element has focus, so it falls under 1.4.11 at 3:1. This dovetails with 2.4.7 Focus Visible and the WCAG 2.2 focus criteria.",
                },
                {
                  t: "Required graphical controls",
                  d: "An icon-only button (a hamburger menu, a search magnifier, a close ✕) relies on its glyph to be identified. That glyph must reach 3:1 against its background.",
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
                <strong>Important nuance:</strong> if a control has more than one
                cue, only the cue you depend on has to pass. A button with a
                clear 4.5:1 text label and a faint border can still pass, because
                the text already identifies it. But a ghost button whose{" "}
                <em>only</em> boundary is a 1.5:1 outline fails — there is no
                other cue to fall back on.
              </p>
            </div>
          </section>

          {/* Graphics */}
          <section aria-labelledby="graphics" className="mb-12">
            <h2
              id="graphics"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Graphical objects
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              The second half covers the parts of a graphic you genuinely need in
              order to understand it. The test question is always:{" "}
              <em>
                if this part were not perceivable, would the user miss
                information?
              </em>{" "}
              If yes, it needs 3:1.
            </p>
            <ul className="space-y-3 mb-2">
              {[
                "Data visualisation: the line in a line chart, the bars in a bar chart, and the slices of a pie chart must each reach 3:1 against the background and, where they meet, against each other.",
                "Meaningful icons: an icon that conveys information (a warning triangle, a status dot, a required-field asterisk) needs 3:1; a purely decorative flourish does not.",
                "Diagram parts: arrows, connectors, and labelled regions that carry meaning in a flow chart or wiring diagram must be perceivable at 3:1.",
                "Map and infographic keys: any colored element a legend refers to has to be distinguishable, which in practice means 3:1 plus a non-color cue for color-blind users.",
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
              Contrast alone is not the whole story for charts: because some
              users cannot distinguish hues, combine 3:1 contrast with a second
              channel — patterns, direct labels, or distinct shapes — to also
              satisfy{" "}
              <Link
                href="/wcag/1-4-1"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                1.4.1 Use of Color
              </Link>
              .
            </p>
          </section>

          {/* Exceptions */}
          <section aria-labelledby="exceptions" className="mb-12">
            <h2
              id="exceptions"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              The exceptions
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              1.4.11 has a clear set of carve-outs. Knowing them stops you from
              over-engineering — and from wrongly flagging conformant designs.
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
              A text input with a perceivable boundary
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              The most common 1.4.11 failure is an input whose border is too
              faint. Pick a border color that reaches 3:1 against the field
              background — and never identify a field by placeholder text alone.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`/* #767676 on white is ~4.5:1 — comfortably past the
   3:1 floor for a UI boundary. #d1d5db (~1.5:1) would fail. */
.field {
  border: 1px solid #767676;   /* perceivable edge */
  border-radius: 6px;
  padding: 0.5rem 0.75rem;
}

/* State change must also clear 3:1 against the resting state */
.field:focus-visible {
  outline: 2px solid #1d4ed8;  /* >= 3:1 against the page */
  outline-offset: 2px;
}`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              A toggle whose states are distinguishable
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Off and on must differ by at least 3:1, and the difference should
              not be carried by color alone — here the knob also moves position.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`/* Off: light track. On: a track color that is >= 3:1
   different from the off state AND >= 3:1 vs the page. */
.toggle            { background: #6b7280; }  /* off  */
.toggle[aria-checked="true"] { background: #1d4ed8; }  /* on */

/* Position is a second, non-color cue (helps 1.4.1 too) */
.toggle .knob                        { transform: translateX(0); }
.toggle[aria-checked="true"] .knob   { transform: translateX(100%); }`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              An icon-only button
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              The glyph must reach 3:1 against the button background, and the
              button still needs an accessible name for screen readers (
              <Link
                href="/wcag/4-1-2"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                4.1.2 Name, Role, Value
              </Link>
              ).
            </p>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<button type="button" aria-label="Search" class="icon-btn">
  <svg aria-hidden="true" focusable="false" width="20" height="20">
    <!-- stroke/fill must be >= 3:1 against the button bg -->
    <use href="#icon-search" />
  </svg>
</button>

/* white glyph on #1d4ed8 = ~8.6:1 — passes easily */
.icon-btn { background: #1d4ed8; color: #ffffff; }`}</code>
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
                "Hairline form fields outlined with a 1px light-grey (#e5e7eb / #d1d5db) border that sits well below 3:1 against white.",
                "Placeholder-only inputs with no visible boundary, so the user cannot tell a field is even there.",
                "Ghost / outline buttons whose only identifying cue is a faint border that fails 3:1.",
                "Toggles and checkboxes where the on and off states differ by a subtle pastel that does not reach 3:1.",
                "Focus indicators that are present but too low-contrast — visible to 2.4.7 in theory, failing 1.4.11 in practice.",
                "Chart palettes of soft pastels where neighbouring bars or lines blur into each other and into the background.",
                "Disabled-looking but actually-active controls — relying on the disabled exemption while the control is still operable.",
                "Measuring contrast against the page background when the element actually sits on a colored card or button, giving a misleading pass or fail.",
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
              How to test for 1.4.11
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "Inventory the non-text elements",
                  d: "List every control boundary, state cue, focus indicator, icon, and meaningful graphic on the screen. These are the things 1.4.11 applies to — text is handled separately by 1.4.3.",
                },
                {
                  t: "Eyedropper each element and its neighbour",
                  d: "Sample the element color and the color immediately adjacent to it (the fill on one side, the background on the other). A border on a card is measured against the card, not the page behind it.",
                },
                {
                  t: "Confirm 3:1 with a contrast checker",
                  d: "Drop both colors into a contrast checker and verify the ratio is at least 3:1. Borders need to clear it on at least one adjacent edge so the boundary is perceivable.",
                },
                {
                  t: "Check every state, not just the default",
                  d: "Toggle checkboxes, switches, tabs, and radios. The selected state must differ from the unselected state by 3:1, and each must be perceivable against the background.",
                },
                {
                  t: "Apply the exceptions deliberately",
                  d: "Skip disabled controls, unmodified browser-default rendering, logos, and decorative graphics. Everything else has to pass.",
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
              Non-text contrast is mostly a manual, eyedropper-driven check —
              automated scanners rarely judge UI-component and graphic contrast
              reliably. Build accessible color pairs up front with the{" "}
              <Link
                href="/tools/accessible-palette-studio"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Accessible Palette Studio
              </Link>
              , verify text and UI pairs in the{" "}
              <Link
                href="/tools/contrast-checker"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Color Contrast Checker
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
            <CriterionLinks number="1.4.11" />
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
            content="non-text contrast 1.4.11 UI component contrast graphical object contrast 3:1 contrast ratio button border input border focus indicator contrast icon contrast chart accessibility color contrast WCAG Level AA use of color contrast minimum"
            maxItems={6}
          />
        </section>
      </div>
    </>
  )
}
