import Link from "next/link"
import { createMetadata } from "@/lib/metadata"
import { BreadcrumbStructuredData } from "@/components/seo/structured-data"
import WCAGSEOEnhancements from "@/components/wcag/seo-enhancements"
import { CriterionLinks } from "@/components/wcag/criterion-links"
import ContrastChecker from "./interactive-demo"

export const metadata = createMetadata({
  title: "WCAG 1.4.3 Contrast (Minimum) - Complete Guide",
  path: "/wcag/1-4-3",
  description:
    "Complete guide to WCAG 1.4.3 Contrast (Minimum). Interactive contrast checker, the 4.5:1 and 3:1 ratios, exceptions, code examples, and how to test.",
  keywords: [
    "WCAG 1.4.3",
    "Contrast Minimum",
    "color contrast",
    "contrast ratio",
    "4.5:1",
    "large text",
    "Level AA",
    "web accessibility",
  ],
  type: "article",
  image: "/api/og?title=WCAG%201.4.3%20Contrast%20(Minimum)&section=WCAG",
})

const faqs = [
  {
    q: "What does WCAG 1.4.3 Contrast (Minimum) require?",
    a: "It requires that the visual presentation of text and images of text has a contrast ratio of at least 4.5:1 against its background. There are three exceptions. Large-scale text — at least 18pt (roughly 24px) for regular weight, or 14pt (about 18.66px) for bold — needs only a 3:1 ratio. Incidental text that is inactive or disabled, pure decoration, not visible to anyone, or part of a picture that contains other significant visual content has no contrast requirement. And text that is part of a logotype or brand name has no minimum contrast requirement. It is a Level AA success criterion.",
  },
  {
    q: "How is the contrast ratio actually calculated?",
    a: "The ratio is computed from the relative luminance of the two colors, not their hue. Each color's red, green, and blue channels are linearized (a gamma correction) and combined with the weights 0.2126 for red, 0.7152 for green, and 0.0722 for blue to give a luminance between 0 and 1. The ratio is then (L1 + 0.05) / (L2 + 0.05), where L1 is the lighter color's luminance and L2 the darker. Values range from 1:1 (identical colors) to 21:1 (pure black on pure white). Because green is weighted most heavily, two colors can look different yet still fail — you have to measure, not eyeball.",
  },
  {
    q: "What counts as 'large text' for the 3:1 exception?",
    a: "Large-scale text is at least 18 point for regular weight, or at least 14 point when the text is bold. In CSS pixels that is roughly 24px regular and 18.66px bold, assuming the common 96 DPI mapping where 1pt ≈ 1.333px. Only text that meets this bar qualifies for the relaxed 3:1 minimum; everything smaller must reach 4.5:1. Note that bold lowers the size threshold but does not remove the requirement — bold 12px text is still 'normal' text for this criterion and needs 4.5:1.",
  },
  {
    q: "Does 1.4.3 apply to placeholder text, disabled controls, and text over images?",
    a: "Placeholder text is real, visible text that users read, so it must meet 4.5:1 (or 3:1 if large) — low-contrast placeholders are one of the most common failures. Disabled controls are explicitly exempt as 'incidental' text, so a grayed-out button label has no contrast requirement, though good design still keeps it legible. Text placed over a photograph or gradient must meet the ratio against the actual pixels behind each character; because a background image varies, you typically add a solid or semi-opaque scrim, a text shadow, or a solid plate behind the text to guarantee the ratio everywhere.",
  },
  {
    q: "How is 1.4.3 different from 1.4.6 Contrast (Enhanced) and 1.4.11 Non-text Contrast?",
    a: "1.4.3 is the Level AA baseline for text: 4.5:1 normal, 3:1 large. 1.4.6 Contrast (Enhanced) is the stricter Level AAA version of the same idea, raising the bars to 7:1 normal and 4.5:1 large. 1.4.11 Non-text Contrast (AA) is a separate criterion that covers user-interface components and meaningful graphics — icons, input borders, focus indicators, chart segments — at a 3:1 minimum; it does not cover text. Meeting 1.4.6 automatically satisfies 1.4.3, but 1.4.11 must be checked independently.",
  },
  {
    q: "Do logos and decorative text need to pass 1.4.3?",
    a: "No. Text that is part of a logo or brand name has no minimum contrast requirement under 1.4.3, so a stylized wordmark is exempt. Purely decorative text — text that conveys no information and could be removed with no loss of meaning — is also exempt, as is text that is not visible to anyone or is incidental within a larger image. These exceptions are narrow, though: body copy, headings, labels, links, and any text the user is expected to read all fall squarely within the requirement.",
  },
]

export default function WCAG143Page() {
  return (
    <>
      <WCAGSEOEnhancements
        title="WCAG 1.4.3: Contrast (Minimum)"
        description="The visual presentation of text and images of text has a contrast ratio of at least 4.5:1, with a 3:1 ratio for large-scale text."
        criteria="1.4.3"
        level="AA"
        principle="Perceivable"
        guideline="1.4 Distinguishable"
        url="https://accessibility.build/wcag/1-4-3"
        category="Distinguishable"
      />
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "WCAG Success Criteria", url: "https://accessibility.build/wcag" },
          {
            name: "1.4.3 Contrast (Minimum)",
            url: "https://accessibility.build/wcag/1-4-3",
          },
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
                    1.4.3 Contrast (Minimum)
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
                The most-cited accessibility failure
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
              WCAG 1.4.3: Contrast (Minimum)
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              Low-contrast text is the single most common accessibility problem on the
              web. This criterion sets a measurable floor:{" "}
              <strong className="text-slate-900 dark:text-white">
                normal text needs a contrast ratio of at least 4.5:1, and large text at
                least 3:1
              </strong>
              , measured from the relative luminance of the text and its background. Get
              it right and your content stays readable for low-vision users, aging eyes,
              color-blind readers, and anyone squinting at a phone in bright sun.
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
              The visual presentation of text and images of text has a contrast ratio of
              at least 4.5:1, except for the following:{" "}
              <strong>Large Text:</strong> Large-scale text and images of large-scale
              text have a contrast ratio of at least 3:1.{" "}
              <strong>Incidental:</strong> Text or images of text that are part of an
              inactive user interface component, that are pure decoration, that are not
              visible to anyone, or that are part of a picture that contains significant
              other visual content, have no contrast requirement.{" "}
              <strong>Logotypes:</strong> Text that is part of a logo or brand name has
              no contrast requirement.
            </blockquote>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4 text-sm">
              The single 4.5:1 rule carries the criterion; the three exceptions relax it
              for large text (3:1), for incidental and disabled text, and for
              logotypes. &ldquo;Large-scale&rdquo; means at least 18pt (about 24px)
              regular, or 14pt (about 18.66px) bold.
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
                  The ratios and exceptions
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
              Sufficient contrast is one of the few accessibility requirements that
              visibly improves the experience for practically everyone, not just people
              who identify as having a disability:
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  t: "People with low vision",
                  d: "Roughly one in thirty people has low vision that is not fully corrected by glasses. Adequate contrast is often the difference between reading a paragraph and giving up on it.",
                },
                {
                  t: "Color-blind users",
                  d: "About 8% of men and 0.5% of women have some color vision deficiency. Because the ratio is based on luminance rather than hue, meeting it keeps text legible regardless of which colors a user cannot distinguish.",
                },
                {
                  t: "Older readers",
                  d: "The lens of the eye yellows and the pupil shrinks with age, cutting the light that reaches the retina. Text that a 20-year-old reads easily can be invisible to a 70-year-old.",
                },
                {
                  t: "Anyone in bright light",
                  d: "Sunlight on a phone screen, glare on a laptop, or a dimmed low-power display all wash out low-contrast text — a situational version of low vision that affects every user.",
                },
                {
                  t: "People with cognitive disabilities",
                  d: "Higher contrast reduces the effort of decoding letters, which lowers reading fatigue and helps people who process text more slowly.",
                },
                {
                  t: "Users on cheap or old screens",
                  d: "Budget monitors and phones render subtle color differences poorly. Contrast that passes on a designer's calibrated display can vanish on a $99 device.",
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
              The ratios and exceptions
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Contrast ratio is a single number from 1:1 to 21:1, derived from the{" "}
              <em>relative luminance</em> of the foreground and background colors. Pure
              black on pure white is the maximum, 21:1; two identical colors are 1:1.
              The formula linearizes each color channel and weights green most heavily,
              which is why two colors that look equally &ldquo;dark&rdquo; can measure
              very differently. The thresholds you need to hit:
            </p>
            <ul className="space-y-3 mb-6">
              {[
                {
                  t: "Normal text — 4.5:1",
                  d: "The default. Any text below the large-text thresholds must reach a 4.5:1 ratio against its background, including body copy, links, labels, captions, and placeholder text.",
                },
                {
                  t: "Large text — 3:1",
                  d: "Text that is at least 18pt (≈24px) regular, or at least 14pt (≈18.66px) bold, only needs 3:1. Larger letterforms have thicker strokes, so they stay legible at lower contrast.",
                },
                {
                  t: "Images of text — same thresholds",
                  d: "Text baked into an image (a banner, a button graphic, a quote card) is held to exactly the same 4.5:1 / 3:1 requirement as live text.",
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
              The three exceptions
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Three narrow categories of text carry no contrast requirement at all.
              Treat them as genuine exceptions, not loopholes — most text on a page is
              content the user must read, and none of these apply to it.
            </p>
            <ul className="space-y-3">
              {[
                {
                  t: "Incidental & disabled",
                  d: "Text in an inactive (disabled) UI component, pure decoration, text not visible to anyone, or text that is part of a picture with other significant visual content.",
                },
                {
                  t: "Logotypes",
                  d: "Text that is part of a logo or brand name is exempt — a stylized wordmark does not have to meet the ratio.",
                },
                {
                  t: "Not a general escape hatch",
                  d: "Body copy, headings, links, form labels, and error messages are never covered by these exceptions. If a user is meant to read it, it must pass.",
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
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-6">
              For a stricter target, the Level AAA equivalent is{" "}
              <Link
                href="/wcag/1-4-6"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                1.4.6 Contrast (Enhanced)
              </Link>
              , which raises the bars to 7:1 and 4.5:1. Non-text elements like icons and
              input borders are handled separately by{" "}
              <Link
                href="/wcag/1-4-11"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                1.4.11 Non-text Contrast
              </Link>
              .
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
                  ✓ Passes 1.4.3
                </h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <li>Black (#000) body text on white — 21:1, far above 4.5:1.</li>
                  <li>
                    A #767676 gray on white — exactly 4.58:1, the lightest gray that
                    still passes for normal text.
                  </li>
                  <li>
                    A 24px heading in #949494 on white — 3.1:1, which passes the 3:1
                    large-text bar.
                  </li>
                  <li>
                    White text over a photo with a dark semi-opaque scrim guaranteeing
                    at least 4.5:1 everywhere.
                  </li>
                  <li>A disabled button label at low contrast — exempt as incidental.</li>
                </ul>
              </div>
              <div className="rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-5">
                <h3 className="font-semibold text-rose-800 dark:text-rose-300 mb-3">
                  ✗ Fails 1.4.3
                </h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <li>
                    Light gray (#aaa) body text on white — about 2.3:1, a very common
                    failure.
                  </li>
                  <li>
                    Placeholder text in a faint gray that users are expected to read.
                  </li>
                  <li>
                    A 16px link in a brand color that measures 3.8:1 — fine for large
                    text, but this is normal text.
                  </li>
                  <li>
                    White text over a light or busy background image with no scrim, so
                    the ratio drops below 4.5:1 in places.
                  </li>
                  <li>Bold 12px text at 3:1 — bold, but still &ldquo;normal&rdquo; size.</li>
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
              Normal body text
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              The pale grays that look elegant in a mockup are usually the first thing to
              fail. Darken text until it reaches 4.5:1 against its actual background.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`/* ✗ Fails: light gray on white is about 2.3:1 */
.body-text {
  color: #aaaaaa;
  background: #ffffff;
}

/* ✓ Passes: #767676 on white is 4.58:1 (normal text) */
.body-text {
  color: #767676;
  background: #ffffff;
}

/* ✓ Even safer: near-black on white is 21:1 */
.body-text {
  color: #1a1a1a;
  background: #ffffff;
}`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Large text can use the 3:1 bar
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Only text at 24px regular or 18.66px bold qualifies. A color that fails for
              body copy can pass for a large heading.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`/* ✓ Large heading: #949494 on white is 3.1:1 — passes 3:1 */
.hero-heading {
  font-size: 24px;        /* ≈ 18pt regular = large text */
  font-weight: 400;
  color: #949494;
  background: #ffffff;
}

/* ✗ Same color on 16px body text — 3.1:1 fails 4.5:1 */
.caption {
  font-size: 16px;
  color: #949494;         /* needs to be at least #767676 */
  background: #ffffff;
}`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Text over a background image
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              A photo's brightness varies pixel to pixel, so a fixed text color can pass
              in one spot and fail in another. Add a scrim so the ratio holds everywhere.
            </p>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- ✗ White text straight over a photo: ratio varies, often fails -->
<section class="hero" style="background-image: url(beach.jpg)">
  <h2 style="color:#fff">Summer sale</h2>
</section>

<!-- ✓ Dark scrim guarantees ≥ 4.5:1 across the whole image -->
<section class="hero">
  <div class="scrim"><h2>Summer sale</h2></div>
</section>

<style>
.hero { background-image: url(beach.jpg); background-size: cover; }
.hero .scrim {
  background: rgba(0, 0, 0, 0.55);  /* darkens the photo behind text */
  color: #ffffff;                    /* now comfortably above 4.5:1 */
  padding: 2rem;
}
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
              Choose a text and background color below. The checker computes the real
              WCAG contrast ratio from each color's relative luminance, previews the
              result on live sample text, and tells you at a glance whether the pair
              passes AA (normal 4.5:1, large 3:1) and AAA (7:1). Toggle large-scale text
              to see the threshold change.
            </p>
            <ContrastChecker />
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
                "Light gray body text on white (#999 or lighter) — the most frequent single contrast failure on the web.",
                "Low-contrast placeholder text used as if it were a label; it is real text and must meet 4.5:1.",
                "Brand-colored links and buttons whose color was chosen for looks, then never measured against their background.",
                "White or light text over photographs or gradients with no scrim, so the ratio fails wherever the background is bright.",
                "Assuming bold text always gets the 3:1 bar — bold only lowers the size threshold to 14pt, not the requirement.",
                "Hover, focus, visited, and active states that drop below 4.5:1 even though the default state passes.",
                "Light-on-light or dark-on-dark 'subtle' secondary text, timestamps, and helper copy.",
                "Semi-transparent text (reduced opacity) that blends toward the background and quietly fails the ratio.",
                "Passing on a calibrated designer monitor while failing on typical phone and budget screens.",
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
              How to test for 1.4.3
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "Run an automated scan first",
                  d: "axe DevTools, WAVE, and Lighthouse all measure text contrast automatically and catch the clear failures. Treat this as the floor — automation can miss text over images and states it cannot trigger.",
                },
                {
                  t: "Sample real colors with an eyedropper",
                  d: "Use browser DevTools (the color swatch in the Styles panel shows a live contrast ratio) or a tool like the WebAIM Contrast Checker or Colour Contrast Analyser. Read the computed foreground and background, not the values you think you set.",
                },
                {
                  t: "Classify each text as normal or large",
                  d: "Confirm which threshold applies: 24px regular or 18.66px bold qualifies for 3:1, everything else needs 4.5:1. Don't assume a bold or big-looking label clears the large-text bar without checking the actual size.",
                },
                {
                  t: "Check every interactive state",
                  d: "Test default, hover, focus, active, visited, and disabled separately. A link that passes at rest can fail on hover. (Disabled controls are exempt, but verify they are genuinely disabled.)",
                },
                {
                  t: "Test text over images and gradients",
                  d: "Sample the ratio at the lightest and darkest points behind the text. If any character falls below the threshold, add a scrim, solid plate, or text shadow until the whole run passes.",
                },
                {
                  t: "Verify in real conditions",
                  d: "Check the page on an ordinary phone in daylight and on a cheap monitor, not just a calibrated studio display. If it is readable there, it is readable everywhere.",
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
          <CriterionLinks number="1.4.3" />

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
