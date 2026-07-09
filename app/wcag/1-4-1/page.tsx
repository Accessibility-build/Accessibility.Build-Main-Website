import Link from "next/link"
import { createMetadata } from "@/lib/metadata"
import { BreadcrumbStructuredData } from "@/components/seo/structured-data"
import WCAGSEOEnhancements from "@/components/wcag/seo-enhancements"
import { CriterionLinks } from "@/components/wcag/criterion-links"
import UseOfColorDemo from "./interactive-demo"

export const metadata = createMetadata({
  title: "WCAG 1.4.1 Use of Color - Complete Guide",
  path: "/wcag/1-4-1",
  description:
    "Complete guide to WCAG 1.4.1 Use of Color. Interactive examples of color accessibility, color blindness simulation, and alternative visual cues.",
  keywords: [
    "WCAG 1.4.1",
    "use of color",
    "color accessibility",
    "color blind",
    "color blindness",
    "visual cues",
    "contrast",
  ],
  type: "article",
  image: "/api/og?title=WCAG%201.4.1%20Use%20of%20Color&section=WCAG",
})

const faqs = [
  {
    q: "What does WCAG 1.4.1 Use of Color require?",
    a: "It requires that color is not used as the only visual means of conveying information, indicating an action, prompting a response, or distinguishing a visual element. In plain terms: you can use color freely, but any meaning carried by color must also be available through some other visual cue — text, an icon, a shape, a pattern, underlining, or position. It is a Level A success criterion under the Perceivable principle (guideline 1.4 Distinguishable) and has been part of WCAG since version 2.0.",
  },
  {
    q: "Is 1.4.1 about color contrast?",
    a: "No — this is the most common misunderstanding. 1.4.1 is about color as the sole differentiator of meaning, not about how light or dark two colors are. Contrast ratios are governed by a separate criterion, 1.4.3 Contrast (Minimum) at Level AA. You can pass 1.4.1 with low-contrast colors and fail 1.4.3, or vice versa. A quick mental test for 1.4.1: if the whole page were printed in black and white, would every piece of information, every state, and every control still be understandable? If yes, you pass 1.4.1.",
  },
  {
    q: "Why do links in body text often fail 1.4.1?",
    a: "A link that sits inside a paragraph and is distinguished from the surrounding text only by its color relies on color alone to signal that it is clickable — a color-blind or low-vision reader may not notice it at all. The most robust fix is to underline in-text links. If you must remove the underline, WCAG's guidance is that the link text needs at least a 3:1 contrast ratio against the surrounding body text AND an additional non-color cue (such as an underline) that appears on both hover and keyboard focus. Underlining by default is far simpler and more reliable.",
  },
  {
    q: "How do I make form validation pass 1.4.1?",
    a: "Do not signal errors or success with color alone. A red border or red text is fine as one cue, but pair it with an icon (an X or warning triangle for errors, a check for success) and, most importantly, a clear text message such as 'Error: Please enter a valid email address'. The text is what carries the meaning for screen reader users and for anyone who cannot distinguish the color. Mark required fields with an asterisk plus the word 'required' or a visible note, not just red coloring.",
  },
  {
    q: "How do I make charts and graphs accessible under 1.4.1?",
    a: "Charts frequently rely on a color-coded legend, which fails for color-blind users when several series share similar hues (red and green are a classic collision). Add a second channel: distinct patterns or textures for each series, direct labels placed on or next to the data, different marker shapes for line charts, or a data table that states the underlying values in text. The goal is that a reader who cannot tell the colors apart can still map each data point to its series.",
  },
  {
    q: "Who benefits from meeting 1.4.1?",
    a: "Roughly 1 in 12 men and 1 in 200 women have some form of color vision deficiency, so color-only cues exclude millions of people. But the benefit is broader: users with low vision, people using monochrome or e-ink displays, anyone viewing a screen in bright sunlight or through a failing projector, and users of print-to-grayscale all rely on non-color cues. Providing a second visual channel makes interfaces clearer and more robust for everyone, not only people with a diagnosed deficiency.",
  },
]

export default function WCAG141Page() {
  return (
    <>
      <WCAGSEOEnhancements
        title="WCAG 1.4.1: Use of Color"
        description="Color is not used as the only visual means of conveying information, indicating an action, prompting a response, or distinguishing a visual element."
        criteria="1.4.1"
        level="A"
        principle="Perceivable"
        guideline="1.4 Distinguishable"
        url="https://accessibility.build/wcag/1-4-1"
        category="Distinguishable"
      />
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "WCAG Success Criteria", url: "https://accessibility.build/wcag" },
          { name: "1.4.1 Use of Color", url: "https://accessibility.build/wcag/1-4-1" },
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
                    1.4.1 Use of Color
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
                Never let color carry meaning alone
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
              WCAG 1.4.1: Use of Color
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              A red border says &ldquo;error&rdquo;, a green dot says
              &ldquo;online&rdquo;, a blue word says &ldquo;link&rdquo; — until you
              cannot tell red from green, or the page is printed in grayscale. This
              criterion asks that{" "}
              <strong className="text-slate-900 dark:text-white">
                color is never the only way information, state, or interactivity is
                signalled
              </strong>
              . Keep the color, but always add a second cue: text, an icon, a shape, or
              a pattern.
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
              Color is not used as the only visual means of conveying information,
              indicating an action, prompting a response, or distinguishing a visual
              element.
            </blockquote>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4 text-sm">
              Note the single word that does all the work:{" "}
              <em>only</em>. The criterion does not forbid color — color is one of the
              most useful tools in an interface. It forbids color being the{" "}
              <em>sole</em> visual channel for meaning. And note what it is{" "}
              <em>not</em> about: this is not a contrast requirement (that is{" "}
              <Link
                href="/wcag/1-4-3"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                1.4.3 Contrast (Minimum)
              </Link>
              ), it is about color as the only differentiator.
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
              Color perception varies enormously across the population and across
              viewing conditions. A second, non-color cue reaches everyone that color
              alone leaves out:
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  t: "People with color vision deficiency",
                  d: "Around 1 in 12 men and 1 in 200 women cannot reliably distinguish certain colors — red/green being the most common collision. Color-coded states and legends simply merge together for them.",
                },
                {
                  t: "Low vision users",
                  d: "Reduced sensitivity to color and contrast means subtle hue differences that designers rely on may be invisible. A shape or label difference is far easier to perceive.",
                },
                {
                  t: "Users in bright or poor lighting",
                  d: "Sunlight on a phone screen, a washed-out projector, or a failing monitor can flatten colors for anyone. Non-color cues stay legible when hues wash out.",
                },
                {
                  t: "People on monochrome or e-ink displays",
                  d: "E-readers, some kiosks, and grayscale print reproduce everything in shades of gray, erasing any information that lived only in color.",
                },
                {
                  t: "Screen reader users",
                  d: "Color is not announced at all. If 'required' is only communicated by a red label, or an error only by red text, that meaning is completely absent from the audio output.",
                },
                {
                  t: "Situational cases",
                  d: "Night-mode filters, blue-light reducers, and 'reader' views alter or remove color. A cue that also uses text or an icon survives all of these transformations.",
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
              The criterion names four distinct situations where color must not stand
              alone. It helps to check each one deliberately, because a page can handle
              one well and fail another:
            </p>
            <ul className="space-y-3 mb-6">
              {[
                {
                  t: "Conveying information",
                  d: "Any status, category, or value signalled by color — 'sold out' items greyed only by hue, a color-coded calendar, a red/green profit-and-loss column. Add text, an icon, or a label.",
                },
                {
                  t: "Indicating an action",
                  d: "Signalling that something is clickable or actionable purely by color, most commonly links inside body text distinguished only by being blue. Underline them, or add another cue.",
                },
                {
                  t: "Prompting a response",
                  d: "Asking the user to act using color alone — 'fields in red are required', 'press the green button to continue'. Name the field as required; label the button by what it does.",
                },
                {
                  t: "Distinguishing a visual element",
                  d: "Telling elements apart by color only — series in a chart, segments of a diagram, the selected tab shown by a colored highlight with no other marker. Add patterns, shapes, borders, or labels.",
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
              What 1.4.1 does not require
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              It does not tell you to stop using color, and it does not set a contrast
              ratio — that is the job of{" "}
              <Link
                href="/wcag/1-4-3"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                1.4.3 Contrast (Minimum)
              </Link>
              . A useful shortcut is the grayscale test: imagine the interface with all
              color removed. Every state, every link, every data series, and every
              required field should still be identifiable from what remains. If
              something disappears, that is exactly where 1.4.1 is failing.
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
                  ✓ Passes 1.4.1
                </h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <li>In-text links that are underlined as well as colored.</li>
                  <li>
                    Form errors shown with a red border{" "}
                    <em>plus</em> an icon and a text message.
                  </li>
                  <li>
                    Required fields marked with an asterisk and the word
                    &ldquo;required&rdquo;, not just red.
                  </li>
                  <li>
                    A chart whose series use distinct patterns or direct labels as well
                    as color.
                  </li>
                  <li>
                    A status pill that reads &ldquo;Active&rdquo; with a check icon, not
                    just a green dot.
                  </li>
                </ul>
              </div>
              <div className="rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-5">
                <h3 className="font-semibold text-rose-800 dark:text-rose-300 mb-3">
                  ✗ Fails 1.4.1
                </h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <li>
                    Links in a paragraph distinguished from body text by color only, no
                    underline.
                  </li>
                  <li>
                    A form field turning red on error with no icon or message.
                  </li>
                  <li>
                    &ldquo;Required fields are shown in red&rdquo; as the only marker of
                    required state.
                  </li>
                  <li>
                    A pie chart with a red/green legend and no patterns or labels.
                  </li>
                  <li>
                    A green dot vs. a red dot as the only indicator of online/offline
                    status.
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
              Links in body text
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              The safest fix is simply to keep in-text links underlined. If you remove
              the underline, the link needs a 3:1 contrast against the surrounding text
              and a non-color cue on hover <em>and</em> focus.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- ✗ Distinguished from body text by color alone -->
<p>Read our <a href="/refunds" style="color:#2563eb;
   text-decoration:none">refund policy</a> before buying.</p>

<!-- ✓ Underlined: obvious without relying on color -->
<p>Read our <a href="/refunds">refund policy</a> before buying.</p>

/* ✓ Or keep it underline-free but add a non-color cue on
   both hover and focus (and ensure 3:1 vs body text) */
a.inline { color: #1d4ed8; text-decoration: none; }
a.inline:hover,
a.inline:focus { text-decoration: underline; }`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Form errors and required fields
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Pair the red styling with an icon and a real text message, and mark
              required fields with more than color.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- ✗ Error and required state signalled by color only -->
<label style="color:#dc2626">Email</label>
<input class="border-red" value="invalid-email">

<!-- ✓ Color + icon + text message + explicit required marker -->
<label for="email">
  Email <span aria-hidden="true">*</span>
  <span class="sr-only">(required)</span>
</label>
<input id="email" type="email" required aria-invalid="true"
       aria-describedby="email-error" class="border-red">
<p id="email-error" role="alert">
  <svg aria-hidden="true" focusable="false"><!-- ✗ icon --></svg>
  Error: Please enter a valid email address
</p>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Charts, legends, and status
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Give each series a second channel — a pattern, a shape, or a direct label
              — and describe status in text, not just a colored dot.
            </p>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- ✗ Status conveyed only by the color of a dot -->
<span class="dot" style="background:#16a34a"></span>

<!-- ✓ Color + icon + text: understandable in grayscale -->
<span class="status">
  <svg aria-hidden="true" focusable="false"><!-- ✓ check --></svg>
  Active
</span>

<!-- ✓ Legend entries carry a pattern name + label, not hue alone -->
<ul class="legend">
  <li><span class="swatch striped"></span> Product A (striped)</li>
  <li><span class="swatch solid"></span> Product B (solid)</li>
  <li><span class="swatch dotted"></span> Product C (dotted)</li>
</ul>`}</code>
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
              Each pair below shows the same information twice — once relying on color
              alone, once with an added non-color cue. Toggle the grayscale simulation
              to strip out color the way a color-blind or monochrome viewer experiences
              it, and watch the left-hand examples become ambiguous while the right-hand
              ones stay clear.
            </p>
            <UseOfColorDemo />
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
                "In-text links distinguished from surrounding text by color alone, with the underline removed and no other cue on hover or focus.",
                "Form validation that turns a field red (or green) with no icon and no text message explaining the error or success.",
                "Marking required fields only by coloring their label red, with no asterisk, 'required' text, or other indicator.",
                "Charts, graphs, and pie segments identified only by a color-coded legend — especially red/green combinations that collide for color-blind users.",
                "Status and state shown by color alone: a green vs. red dot, a highlighted-only selected tab, a colored calendar with no labels.",
                "'Click the green button' or 'entries in red are overdue' style instructions that reference color as the only identifier.",
                "Confusing 1.4.1 with contrast: adding a second cue but assuming it also satisfies 1.4.3, or fixing contrast and thinking color-only meaning is now acceptable.",
                "Selected or active states in a UI (toggles, segmented controls, map pins) shown only by a color change with no icon, border, or label difference.",
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
              How to test for 1.4.1
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "Run the grayscale test",
                  d: "View the page in grayscale — via your OS color filters, a browser extension, or a print-to-grayscale preview. Anything whose meaning vanishes when color is removed (links, states, chart series, required markers) is a 1.4.1 failure you can see instantly.",
                },
                {
                  t: "Simulate color vision deficiency",
                  d: "Use a color-blindness simulator (Chrome DevTools Rendering panel, the Stark or Colorblindly extensions, or Firefox's accessibility tools) to view the page as deuteranopia, protanopia, and tritanopia. Watch specifically for red/green pairs in charts, status, and validation collapsing into one shade.",
                },
                {
                  t: "Inspect every link, control, and state",
                  d: "For each in-text link, form field, status indicator, tab, and chart series, ask: is there any cue besides color? An underline, icon, shape, pattern, border, or text label. If color is the only differentiator, it fails.",
                },
                {
                  t: "Check instructions and legends for color words",
                  d: "Search the content for phrases like 'in red', 'the green button', 'shown in blue'. Each is a sign that color is being used as the sole reference; confirm the same item is also identifiable another way.",
                },
                {
                  t: "Verify hover and focus cues on underline-free links",
                  d: "If you have chosen to remove link underlines, confirm the non-color cue appears on BOTH mouse hover and keyboard focus, and that the link contrasts at least 3:1 with the surrounding body text.",
                },
                {
                  t: "Remember automated tools only go so far",
                  d: "Scanners like axe and WAVE flag some color-only risks but cannot judge whether a second cue actually conveys the meaning — this criterion needs human review of each color-coded element in context.",
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
          <CriterionLinks number="1.4.1" />

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
