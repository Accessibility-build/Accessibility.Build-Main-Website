import type { Metadata } from "next"
import Link from "next/link"
import WCAGSEOEnhancements from "@/components/wcag/seo-enhancements"
import WCAGBreadcrumb from "@/components/wcag/breadcrumb"
import { CriterionLinks } from "@/components/wcag/criterion-links"
import { RelatedContent } from "@/components/seo/related-content"

export const metadata: Metadata = {
  title: "WCAG 2.5.5 Target Size (Enhanced) — 44px Targets",
  description:
    "WCAG 2.5.5 requires pointer targets of at least 44 by 44 CSS pixels, with four exceptions. How it compares to 2.5.8's 24px rule, CSS fixes, and testing steps.",
  keywords: [
    "WCAG 2.5.5",
    "Target Size Enhanced",
    "44 by 44 CSS pixels",
    "touch target size",
    "tap target accessibility",
    "minimum button size",
    "pointer target size",
    "2.5.5 test",
    "Level AAA",
    "WCAG 2.2",
    "input modalities",
  ],
  alternates: {
    canonical: "/wcag/2-5-5",
  },
  openGraph: {
    title: "WCAG 2.5.5 Target Size (Enhanced) — 44x44 CSS Pixels",
    description:
      "Pointer targets must be at least 44 by 44 CSS pixels unless an exception applies. The four exceptions, how 2.5.5 relates to 2.5.8, CSS sizing fixes, and testing.",
    url: "/wcag/2-5-5",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: "/api/og?title=WCAG%202.5.5%20Target%20Size%20(Enhanced)&section=WCAG",
        width: 1200,
        height: 630,
        alt: "WCAG 2.5.5 Target Size (Enhanced) guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WCAG 2.5.5 Target Size (Enhanced) — 44x44 CSS Pixels",
    description:
      "The AAA target-size rule: 44x44 CSS px for every pointer target, with Equivalent, Inline, User Agent, and Essential exceptions. CSS fixes and how to test.",
    images: [
      "/api/og?title=WCAG%202.5.5%20Target%20Size%20(Enhanced)&section=WCAG",
    ],
  },
}

const faqs = [
  {
    q: "What does WCAG 2.5.5 Target Size (Enhanced) require?",
    a: "It requires that the size of the target for pointer inputs is at least 44 by 44 CSS pixels, unless one of four exceptions applies: Equivalent (the same action is available through another target on the same page that is at least 44x44), Inline (the target is in a sentence or block of text), User Agent Control (the size is determined by the browser and not modified by the author), or Essential (a particular presentation of the target is essential to the information being conveyed). It is a Level AAA criterion under Guideline 2.5 Input Modalities, introduced in WCAG 2.1.",
  },
  {
    q: "How is 2.5.5 different from 2.5.8 Target Size (Minimum)?",
    a: "2.5.8 (Level AA, new in WCAG 2.2) is the smaller, more lenient floor: targets must be at least 24 by 24 CSS pixels, and an undersized target can also pass through a spacing offset — if targets are far enough apart, they may be smaller than 24px. 2.5.5 (Level AAA) nearly doubles the linear size to 44 by 44 CSS pixels and has no spacing escape hatch: the target itself must be 44x44 unless it is equivalent, inline, user-agent controlled, or essential. The exception lists are otherwise structured the same way.",
  },
  {
    q: "Does the 44px minimum include padding around the visible control?",
    a: "The target is the region that accepts the pointer action, not just the painted pixels. If a 24x24 icon sits inside a button whose clickable area — including padding — measures 44 by 44 CSS pixels, the target passes. This is the standard fix: keep the visual design compact while extending the hit area with padding, min-width/min-height, or a pseudo-element. What does not count is empty space that is not clickable: visual breathing room around a small link does nothing for its target size.",
  },
  {
    q: "What does the Inline exception cover?",
    a: "Links that occur within a sentence or block of text are exempt, because their size is rightly governed by the text's font size and forcing them to 44px would wreck line spacing. A 'read the full policy' link inside a paragraph does not need to be 44px tall. The exception applies only to genuinely in-flow text links: a standalone link styled as a row of navigation, or an icon dropped between paragraphs, is not 'in a sentence' and must meet the size requirement.",
  },
  {
    q: "What are CSS pixels, and how do they relate to physical size?",
    a: "A CSS pixel is the unit your stylesheets use, which the browser scales for device pixel density and zoom — it is not a hardware pixel. 44 CSS pixels corresponds roughly to 9–10mm on a typical mobile display at default zoom, which matches the physical size of a fingertip press. This is also why the value echoes platform guidance: Apple's Human Interface Guidelines recommend 44x44 pt touch targets and Android Material Design recommends 48x48 dp — WCAG 2.5.5 encodes the same ergonomics as a testable web standard.",
  },
  {
    q: "Is 2.5.5 required for compliance if I already meet 2.5.8?",
    a: "No — legal baselines reference Level AA, which includes 2.5.8's 24px minimum, not the AAA 44px rule. But 24px is a floor, not a comfort target: research on touch accuracy and every major platform's design guidance converge on the 44–48px range for reliable one-finger use. Teams building touch-heavy interfaces, products for older users, or anything used on the move (kiosks, transit apps, medical devices) frequently adopt 44px as their working standard and treat 24px as the never-go-below line.",
  },
]

export default function WCAG255Page() {
  return (
    <>
      <WCAGSEOEnhancements
        title="WCAG 2.5.5: Target Size (Enhanced)"
        description="The size of the target for pointer inputs is at least 44 by 44 CSS pixels except in specific cases."
        criteria="2.5.5"
        level="AAA"
        principle="Operable"
        guideline="2.5 Input Modalities"
        url="https://accessibility.build/wcag/2-5-5"
        category="Input Modalities"
        hasInteractiveDemo={false}
        relatedCriteria={["2.5.8", "2.5.2", "2.5.7"]}
      />

      <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <WCAGBreadcrumb items={[]} current="2.5.5 Target Size (Enhanced)" />

          {/* Header */}
          <header className="mb-12">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                Level AAA
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Principle 2: Operable
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                The 44×44 rule
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
              WCAG 2.5.5: Target Size (Enhanced)
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              Small targets punish anyone whose pointer is not
              pixel-precise — fingers on phones, hands with tremor, styluses
              on the move. This criterion sets the comfortable standard:{" "}
              <strong className="text-slate-900 dark:text-white">
                every pointer target is at least 44 by 44 CSS pixels
              </strong>
              , with four narrow exceptions. It is the AAA counterpart to
              2.5.8&rsquo;s 24px minimum — same idea, ergonomic size.
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
              The size of the target for pointer inputs is at least 44 by 44
              CSS pixels except when:
              <br />
              <br />
              <strong>Equivalent:</strong> The target is available through an
              equivalent link or control on the same page that is at least 44
              by 44 CSS pixels;
              <br />
              <strong>Inline:</strong> The target is in a sentence or block of
              text;
              <br />
              <strong>User Agent Control:</strong> The size of the target is
              determined by the user agent and is not modified by the author;
              <br />
              <strong>Essential:</strong> A particular presentation of the
              target is essential to the information being conveyed.
            </blockquote>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4 text-sm">
              Note what is <em>not</em> in this list: a spacing exception.
              Unlike{" "}
              <Link
                href="/wcag/2-5-8"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                2.5.8
              </Link>
              , generous gaps between small targets do not help here — the
              target itself must measure 44&times;44 unless one of the four
              exceptions applies.
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
                <a className="hover:underline" href="#exceptions">
                  The four exceptions
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#vs-258">
                  2.5.5 vs 2.5.8
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
              44 CSS pixels is roughly the contact patch of an adult fingertip.
              Targets smaller than that demand precision many users simply do
              not have — and every miss costs a correction, an accidental
              activation of the neighbouring control, or an abandoned task.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  t: "People with motor disabilities",
                  d: "Tremor, spasticity, limited dexterity, or fatigue make fine pointing slow and error-prone. Large targets convert near-misses into hits.",
                },
                {
                  t: "Touchscreen users generally",
                  d: "Fingers are blunt instruments and occlude what they touch. The 44px figure matches Apple's 44pt and is close to Android's 48dp guidance for exactly this reason.",
                },
                {
                  t: "Older users",
                  d: "Age-related declines in fine motor control and vision compound: small targets are both harder to see and harder to hit.",
                },
                {
                  t: "Anyone in real-world conditions",
                  d: "A phone in one hand on a moving train, a stylus with gloves, a trackpad on a bumpy flight — situational impairments make every user a low-precision user sometimes.",
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

          {/* Exceptions */}
          <section aria-labelledby="exceptions" className="mb-12">
            <h2
              id="exceptions"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              The four exceptions, in practice
            </h2>
            <div className="space-y-4">
              {[
                {
                  t: "Equivalent",
                  d: "A small target is fine if the same action is available through another target on the same page that does meet 44×44. Example: a tiny 'x' on each tag chip, plus a full-size 'Clear all filters' button. The small path is a convenience; the accessible path exists.",
                },
                {
                  t: "Inline",
                  d: "Links inside a sentence or block of text are exempt — their height is set by the line, and inflating them to 44px would destroy the typography. This covers body-copy links only; standalone links merely positioned near text do not qualify.",
                },
                {
                  t: "User Agent Control",
                  d: "Native controls rendered at the browser's default size — an unstyled checkbox, radio button, or select — are exempt as long as your CSS has not modified their size. Style them, and you own their dimensions.",
                },
                {
                  t: "Essential",
                  d: "When the specific presentation is legally or informationally required. The classic case is map pins: enlarging them to 44px would misrepresent the precise locations they mark. Density preferences and visual taste are not 'essential'.",
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

          {/* vs 2.5.8 */}
          <section aria-labelledby="vs-258" className="mb-12">
            <h2
              id="vs-258"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              2.5.5 vs 2.5.8: comfort vs floor
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  <Link
                    href="/wcag/2-5-8"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    2.5.8 Target Size (Minimum)
                  </Link>{" "}
                  — AA
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  24&times;24 CSS px minimum, added in WCAG 2.2. Includes a{" "}
                  <em>spacing</em> exception: smaller targets can pass if a
                  24px circle centred on each does not intersect another target
                  or its circle. Also excepts inline, user-agent, essential —
                  plus equivalent controls.
                </p>
              </div>
              <div className="rounded-xl border border-purple-200 dark:border-purple-900/40 bg-purple-50 dark:bg-purple-950/20 p-5">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  2.5.5 Target Size (Enhanced) — AAA
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  44&times;44 CSS px — nearly four times the area of a 24px
                  square. Same exception structure minus the spacing offset:
                  the target itself must reach 44px unless it is equivalent,
                  inline, user-agent controlled, or essential.
                </p>
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Practical framing: 2.5.8 keeps interfaces from being actively
              hostile; 2.5.5 makes them comfortable. Related pointer criteria
              round out the guideline —{" "}
              <Link
                href="/wcag/2-5-7"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                2.5.7 Dragging Movements
              </Link>{" "}
              covers gestures that need an alternative, and 2.5.2 Pointer
              Cancellation covers aborting an accidental press — which large
              targets make rarer in the first place.
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
              Give controls a 44px minimum box
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Use{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                min-width
              </code>
              /
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                min-height
              </code>{" "}
              so content can grow the control but never shrink it below the
              target size.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`/* ✗ Icon button sized to its 20px glyph */
.icon-button { width: 20px; height: 20px; }

/* ✓ Compact glyph, ergonomic target */
.icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  min-height: 44px;   /* hit area, not icon size */
}
.icon-button svg { width: 20px; height: 20px; }`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Extend the hit area without changing the design
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Where layout is tight, an invisible pseudo-element enlarges the
              clickable region while the visual footprint stays small.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`/* ✓ 24px visual chip, 44px effective target */
.tag-remove {
  position: relative;
  width: 24px;
  height: 24px;
}
.tag-remove::after {
  content: "";
  position: absolute;
  inset: -10px;        /* 24 + 10 + 10 = 44px each axis */
}`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Make the whole row the target, not just the text
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              In menus and lists, put the padding on the link itself — padding
              on the surrounding{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                li
              </code>{" "}
              looks identical but is not clickable.
            </p>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`/* ✗ 16px-tall link floating in a tall row */
.nav li { padding: 14px 16px; }
.nav a  { /* target = text height only */ }

/* ✓ The link fills the row: full 44px+ target */
.nav li { padding: 0; }
.nav a  {
  display: block;
  padding: 14px 16px;   /* 16px text + 28px padding ≥ 44px */
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
                "Icon-only buttons sized to their glyph — 16–24px close buttons, kebab menus, and toolbar icons with no padding.",
                "Tappable table-row actions (edit/delete icons) packed at 20px in dense data grids with no equivalent full-size control.",
                "Pagination and stepper controls: '‹ 1 2 3 ›' links a dozen pixels wide, adjacent to each other.",
                "Checkboxes and radios restyled to a decorative 16px box — restyling voids the user-agent exception while keeping the tiny size.",
                "Padding placed on non-interactive wrappers so the row looks large but only the text is clickable.",
                "Carousel dots, tag-remove crosses, and video player controls at mobile sizes far below 44px.",
                "Counting whitespace between targets as if it were target size — spacing helps 2.5.8's exception but does nothing for 2.5.5.",
                "Claiming the 'essential' exception for what is really a visual-density preference.",
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
              How to test for 2.5.5
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "Inventory every pointer target",
                  d: "Buttons, links, form controls, custom widgets, media controls, chips, dots, and icons — anything that responds to a click or tap is in scope, on every breakpoint you serve.",
                },
                {
                  t: "Measure the interactive box, not the artwork",
                  d: "In DevTools, hover each element and read the layout box dimensions, or select it and check the computed width/height including padding. The question is the clickable region's size — a 20px icon in a 44px button passes.",
                },
                {
                  t: "Flag anything under 44×44 CSS pixels",
                  d: "Both dimensions must reach 44. A 60×32 button fails on height. Automated tools (axe's target-size rules, Lighthouse's tap-target audit) catch many cases; verify their pixel math in DevTools for custom components.",
                },
                {
                  t: "Apply the exceptions deliberately",
                  d: "For each flagged target ask, in order: is a 44px equivalent control on the same page? Is it a link inside a sentence or text block? Is it an unmodified native control? Is the small presentation truly essential? Only a yes to one of these clears it.",
                },
                {
                  t: "Sanity-check with a real thumb",
                  d: "On an actual phone, work through the key flows using one thumb. Repeated mis-taps are the human signal that a target that 'measures fine' is still too small or too crowded in context.",
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
              Measure once, fix globally: a design-token minimum for
              interactive elements clears most failures in one change. Track
              the pointer criteria together in the{" "}
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

          <CriterionLinks number="2.5.5" />
        </article>

        {/* Related content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <RelatedContent
            content="target size enhanced 44 by 44 CSS pixels touch target tap target minimum button size pointer inputs icon button hit area target size minimum dragging movements input modalities WCAG 2.5.5 Level AAA"
            maxItems={6}
          />
        </section>
      </div>
    </>
  )
}
