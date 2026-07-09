import type { Metadata } from "next"
import Link from "next/link"
import WCAGSEOEnhancements from "@/components/wcag/seo-enhancements"
import WCAGBreadcrumb from "@/components/wcag/breadcrumb"
import { CriterionLinks } from "@/components/wcag/criterion-links"
import { RelatedContent } from "@/components/seo/related-content"

export const metadata: Metadata = {
  title: "WCAG 2.4.13 Focus Appearance — Indicator Size",
  description:
    "WCAG 2.4.13 sets a minimum size and 3:1 contrast for keyboard focus indicators: at least a 2 CSS px thick perimeter. CSS examples, exceptions, and how to test.",
  keywords: [
    "WCAG 2.4.13",
    "Focus Appearance",
    "focus indicator size",
    "focus indicator contrast",
    "2 CSS pixel perimeter",
    "focus-visible outline",
    "keyboard focus ring",
    "WCAG 2.2 new criteria",
    "2.4.13 test",
    "Level AAA",
    "navigable",
  ],
  alternates: {
    canonical: "/wcag/2-4-13",
  },
  openGraph: {
    title: "WCAG 2.4.13 Focus Appearance — Indicator Size & Contrast",
    description:
      "New in WCAG 2.2: focus indicators must be at least as large as a 2 CSS px thick perimeter and change with 3:1 contrast. Copy-ready :focus-visible CSS and testing steps.",
    url: "/wcag/2-4-13",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: "/api/og?title=WCAG%202.4.13%20Focus%20Appearance&section=WCAG",
        width: 1200,
        height: 630,
        alt: "WCAG 2.4.13 Focus Appearance guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WCAG 2.4.13 Focus Appearance — Indicator Size & Contrast",
    description:
      "How big and how visible must a focus ring be? 2.4.13's 2px-perimeter area and 3:1 change-contrast rules explained, with :focus-visible CSS you can copy.",
    images: ["/api/og?title=WCAG%202.4.13%20Focus%20Appearance&section=WCAG"],
  },
}

const faqs = [
  {
    q: "What does WCAG 2.4.13 Focus Appearance require?",
    a: "When the keyboard focus indicator is visible, an area of the indicator must meet two conditions at once: it must be at least as large as the area of a 2 CSS pixel thick perimeter drawn around the unfocused component (or sub-component), and those pixels must have a contrast ratio of at least 3:1 between the focused and unfocused states. In short: the focus indicator must be big enough to see and must change the pixels enough to notice. It is a Level AAA success criterion introduced in WCAG 2.2.",
  },
  {
    q: "What does 'the area of a 2 CSS pixel thick perimeter' mean in practice?",
    a: "Imagine tracing a 2px-wide band along the border of the component in its unfocused state — the area of that band is your minimum. A solid outline that is at least 2 CSS pixels thick and encloses the whole component always meets the size test, which is why 'outline: 2px solid' (or thicker) around the element is the canonical implementation. Indicators that are smaller in total area — a 1px outline, a short underline, or a change confined to one small corner — can fail because they do not add up to that perimeter's area.",
  },
  {
    q: "What does the 3:1 contrast requirement compare?",
    a: "It compares the same pixels between the two states: the colors of the indicator's pixels when the component is focused versus the colors of those pixels when it is not focused. A dark blue ring appearing on a white background changes those pixels from white to dark blue — far more than 3:1, so it passes. A subtle change, like a light gray border becoming a slightly darker gray, may not reach 3:1 and fails even if the ring is thick enough. This is a change-of-state contrast, distinct from 1.4.11's requirement that a visible indicator contrast with adjacent colors.",
  },
  {
    q: "What are the exceptions in 2.4.13?",
    a: "There are two. First, if the focus indicator is determined by the user agent and cannot be adjusted by the author — for example, a native control whose focus ring the browser draws and your code cannot restyle. Second, if the focus indicator and the indicator's background color are not modified by the author — meaning you left the browser's default focus rendering completely alone. The moment your CSS changes focus styles or the backgrounds they draw against, you own the result and the size and contrast requirements apply.",
  },
  {
    q: "How does 2.4.13 relate to 2.4.7 Focus Visible and 1.4.11 Non-text Contrast?",
    a: "2.4.7 (Level AA) only requires that some visible focus indicator exists — it sets no minimum for size or strength, so a faint 1px ring technically passes it. 1.4.11 (Level AA) requires visual information used to identify UI states, including focus indicators, to have 3:1 contrast against adjacent colors. 2.4.13 (Level AAA) goes further than both: it dictates a minimum indicator area (the 2px perimeter) and a minimum 3:1 change between focused and unfocused states. Think of 2.4.7 as 'there is one', 1.4.11 as 'you can see it against its surroundings', and 2.4.13 as 'it is big and obvious'.",
  },
  {
    q: "Was Focus Appearance a Level AA criterion at some point?",
    a: "In draft versions of WCAG 2.2 it was proposed at Level AA, but the requirements proved hard to specify simply, so the final specification split the concern: focus obscuring became 2.4.11 (AA) and 2.4.12 (AAA), while Focus Appearance shipped as 2.4.13 at Level AAA. That history is worth knowing because the working group considers strong focus indicators genuinely important — a thick, high-contrast :focus-visible outline is cheap to implement and is widely treated as best practice even by teams that only target AA.",
  },
]

export default function WCAG2413Page() {
  return (
    <>
      <WCAGSEOEnhancements
        title="WCAG 2.4.13: Focus Appearance"
        description="When the keyboard focus indicator is visible, it is at least as large as a 2 CSS pixel thick perimeter of the unfocused component and has at least a 3:1 contrast ratio between focused and unfocused states."
        criteria="2.4.13"
        level="AAA"
        principle="Operable"
        guideline="2.4 Navigable"
        url="https://accessibility.build/wcag/2-4-13"
        category="Navigable"
        hasInteractiveDemo={false}
        relatedCriteria={["2.4.7", "1.4.11", "2.4.11"]}
      />

      <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <WCAGBreadcrumb items={[]} current="2.4.13 Focus Appearance" />

          {/* Header */}
          <header className="mb-12">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                Level AAA
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Principle 2: Operable
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                New in WCAG 2.2
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
              WCAG 2.4.13: Focus Appearance
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              2.4.7 says a focus indicator must exist. This criterion says what
              a <em>good</em> one looks like:{" "}
              <strong className="text-slate-900 dark:text-white">
                at least as large as a 2 CSS pixel thick perimeter around the
                component, changing the pixels with at least 3:1 contrast
              </strong>{" "}
              between the focused and unfocused states. A faint 1px ring
              technically satisfies AA; this AAA criterion demands an indicator
              you cannot miss.
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
            <blockquote className="text-slate-700 dark:text-slate-300 leading-relaxed border-l-4 border-purple-500 pl-4">
              When the keyboard focus indicator is visible, an area of the
              focus indicator meets all the following: it is at least as large
              as the area of a 2 CSS pixel thick perimeter of the unfocused
              component or sub-component, and it has a contrast ratio of at
              least 3:1 between the same pixels in the focused and unfocused
              states.
              <br />
              <br />
              Exceptions: the focus indicator is determined by the user agent
              and cannot be adjusted by the author, or the focus indicator and
              the indicator&rsquo;s background color are not modified by the
              author.
            </blockquote>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4 text-sm">
              Two tests, both required: a <strong>size</strong> floor (the area
              of a 2px band around the component&rsquo;s border) and a{" "}
              <strong>change-contrast</strong> floor (the indicator pixels must
              differ by 3:1 between states). The exceptions only apply while
              you leave the browser&rsquo;s default focus rendering — and its
              background — completely untouched.
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
                  Who this helps and why
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#requirements">
                  The two requirements, unpacked
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#siblings">
                  2.4.7, 1.4.11, and 2.4.13
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#code">
                  Code examples
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

          {/* Why */}
          <section aria-labelledby="why" className="mb-12">
            <h2
              id="why"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Who this helps and why
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Every sighted keyboard user depends on the focus indicator the
              way a mouse user depends on the cursor. For people with low
              vision, the difference between a hairline ring and a thick,
              high-contrast one is the difference between using the keyboard
              comfortably and hunting for their place after every keypress.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  t: "Low-vision keyboard users",
                  d: "A 1px pale ring disappears against busy backgrounds and at high zoom. A 2px+ high-contrast indicator stays findable at a glance.",
                },
                {
                  t: "People with motor disabilities",
                  d: "Keyboard, switch, and alternative-input users track focus continuously; a weak indicator forces slow, error-prone re-orientation.",
                },
                {
                  t: "Users with attention or memory difficulties",
                  d: "An unmistakable focus position reduces the cognitive cost of remembering where you were between keystrokes.",
                },
                {
                  t: "Everyone in poor conditions",
                  d: "Glare, low-quality displays, and dark rooms shrink effective contrast for all users — strong indicators survive real-world viewing.",
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

          {/* Requirements unpacked */}
          <section aria-labelledby="requirements" className="mb-12">
            <h2
              id="requirements"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              The two requirements, unpacked
            </h2>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              1. Size: the 2 CSS pixel perimeter
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Picture the component in its unfocused state and trace a band 2
              CSS pixels thick along its border. The total area of that band is
              the minimum area your focus indicator must change. The rule is
              deliberately shape-agnostic: you do not have to draw an outline —
              a thick background change, a bold border, or a combination can
              qualify — but the changed pixels must add up to at least that
              perimeter&rsquo;s area. The practical shortcut:{" "}
              <strong className="text-slate-900 dark:text-white">
                a solid outline of 2px or more around the whole component
                always passes the size test
              </strong>
              . Small partial indicators — an underline only, a corner tick, a
              1px hairline — usually do not.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              2. Contrast: 3:1 between the two states
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Compare the indicator&rsquo;s pixels in the focused state against{" "}
              <em>the same pixels</em> in the unfocused state. White page,
              focused element gains a{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                #005fcc
              </code>{" "}
              ring: those pixels went from white to dark blue — a huge change,
              pass. Light-gray border darkening to medium gray on focus: the
              before/after ratio may be under 3:1 — fail, no matter how thick
              the border is. Both tests must pass simultaneously.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              The exceptions
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Default browser focus rings are exempt — but only while genuinely
              default. If the user agent draws the indicator and you{" "}
              <em>cannot</em> adjust it, or if you have modified neither the
              focus indicator nor the background it renders on, the criterion
              does not apply. Add any{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                :focus
              </code>{" "}
              styling, or place default rings over backgrounds you styled, and
              the exemption is gone.
            </p>
          </section>

          {/* Siblings */}
          <section aria-labelledby="siblings" className="mb-12">
            <h2
              id="siblings"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              2.4.7, 1.4.11, and 2.4.13: three layers of focus visibility
            </h2>
            <div className="grid sm:grid-cols-1 gap-4 mb-4">
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  <Link
                    href="/wcag/2-4-7"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    2.4.7 Focus Visible
                  </Link>{" "}
                  — Level AA
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  A visible focus indicator must exist for every keyboard-
                  operable element. Sets no bar for how large or strong it is —
                  removing outlines with outline: none and adding nothing back
                  is the classic failure.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  <Link
                    href="/wcag/1-4-11"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    1.4.11 Non-text Contrast
                  </Link>{" "}
                  — Level AA
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  The visual information identifying states — including focus
                  indicators — needs 3:1 contrast against adjacent colors. A
                  pale yellow ring on a white page fails here.
                </p>
              </div>
              <div className="rounded-xl border border-purple-200 dark:border-purple-900/40 bg-purple-50 dark:bg-purple-950/20 p-5">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  2.4.13 Focus Appearance — Level AAA
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  Adds the size floor (area of a 2px perimeter) and the
                  state-change contrast floor (3:1 between focused and
                  unfocused pixels). The complete specification of a robust
                  indicator.
                </p>
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              And once the indicator looks right, make sure it can be{" "}
              <em>seen</em>:{" "}
              <Link
                href="/wcag/2-4-11"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                2.4.11
              </Link>{" "}
              and{" "}
              <Link
                href="/wcag/2-4-12"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                2.4.12 Focus Not Obscured
              </Link>{" "}
              keep sticky headers and overlays from covering the element the
              indicator is drawn on.
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
              A global focus style that clears the AAA bar
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              One well-chosen{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                :focus-visible
              </code>{" "}
              rule covers the whole site: 2px+ thickness satisfies the size
              test, and a dark ring on light backgrounds (or vice versa)
              satisfies the change contrast.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`/* ✗ Common failures */
:focus { outline: none; }              /* fails 2.4.7 outright   */
:focus { outline: 1px dotted #ccc; }   /* too thin, too faint    */

/* ✓ Thick, high-contrast, keyboard-only indicator */
:focus-visible {
  outline: 3px solid #005fcc;  /* ≥2px thick perimeter: size ✓  */
  outline-offset: 2px;         /* separates ring from the edge  */
}
/* On white (#fff), pixels change #fff → #005fcc ≈ 7.2:1 — contrast ✓ */`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              A two-color ring that works on any background
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Sites with mixed light and dark surfaces can pair an outline with
              a contrasting box-shadow halo, so the state change stays ≥3:1
              wherever the component sits.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`/* ✓ Dark ring + light halo: visible change on light and dark */
:focus-visible {
  outline: 2px solid #0b3d91;            /* inner, dark ring  */
  box-shadow: 0 0 0 5px #ffffff,         /* light separator   */
              0 0 0 7px #0b3d91;         /* outer, dark ring  */
}`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Why background-only changes often fail
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              A subtle background tint on focus can meet the size test (it
              changes the whole component area) but fail contrast — the pixels
              barely change. Measure the before/after ratio, or just use a
              ring.
            </p>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`/* ✗ #f8f9fa → #e9ecef is ≈1.1:1 — imperceptible state change */
.button:focus-visible { background: #e9ecef; }

/* ✓ Strong pixel change plus a ring */
.button:focus-visible {
  background: #003366;   /* light → dark: well over 3:1 */
  color: #ffffff;
  outline: 2px solid #003366;
  outline-offset: 2px;
}`}</code>
            </pre>
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
                "outline: none with no replacement — fails 2.4.7 before 2.4.13 is even in question.",
                "A 1 CSS pixel outline: half the required perimeter thickness, so the indicator area falls short of the size minimum.",
                "Low-contrast state changes — a light gray border darkening slightly, or a faint background tint — under 3:1 between the two states.",
                "Indicators on only one edge (an underline or left bar) whose total changed area is smaller than a 2px perimeter of the component.",
                "A default browser focus ring placed over author-styled dark backgrounds it was never designed for — modifying the background voids the exception.",
                "Focus styles applied on :hover styling assumptions — looks fine for mouse users but was never checked in the keyboard-focused state.",
                "Relying on the text caret alone in custom widgets — a caret is not an indicator sized to the component's perimeter.",
                "Inconsistent overrides: a design-system ring on buttons, but bare inputs and custom controls that fall back to nothing.",
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
              How to test for 2.4.13
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "Tab to every interactive element",
                  d: "Buttons, links, inputs, custom widgets — each must show its focus state. Note any element whose indicator looks thin, faint, or partial; those are your measurement candidates.",
                },
                {
                  t: "Measure the indicator's thickness and coverage",
                  d: "Zoom in with a screen magnifier or take a screenshot and inspect at pixel level. An enclosing outline of 2 CSS px or more passes the size test outright; partial or hairline indicators need their changed area compared against the 2px-perimeter area.",
                },
                {
                  t: "Sample the same pixels in both states",
                  d: "Screenshot the component unfocused and focused, use a color picker on the indicator pixels in each, and compute the contrast ratio between the two colors. It must be at least 3:1.",
                },
                {
                  t: "Repeat on every background the component sits on",
                  d: "The same ring can pass on white and fail on a dark hero section or over imagery. Test each themed surface — and dark mode — separately.",
                },
                {
                  t: "Check the exceptions honestly",
                  d: "Only skip a component if the browser draws its focus ring and neither the ring nor the background beneath it is touched by your CSS. Any author styling of either pulls the component back into scope.",
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
              A contrast checker does the ratio math for you — use the{" "}
              <Link
                href="/tools/contrast-checker"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Contrast Checker
              </Link>{" "}
              with the before/after pixel colors, and log results in the{" "}
              <Link
                href="/checklists/wcag-2-2"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                WCAG 2.2 checklist
              </Link>
              .
            </p>
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

          <CriterionLinks number="2.4.13" />
        </article>

        {/* Related content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <RelatedContent
            content="focus appearance focus indicator size contrast 2 CSS pixel perimeter focus-visible outline keyboard focus ring focus visible non-text contrast focus not obscured WCAG 2.2 new criteria navigable WCAG 2.4.13 Level AAA"
            maxItems={6}
          />
        </section>
      </div>
    </>
  )
}
