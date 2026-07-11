import type { Metadata } from "next"
import Link from "next/link"
import {
  ArticleStructuredData,
  BreadcrumbStructuredData,
} from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"
import { CriterionLinks } from "@/components/wcag/criterion-links"

export const metadata: Metadata = {
  title: "WCAG 2.5.8 Target Size (Minimum) — 24×24 px Tap Targets",
  description:
    "Complete guide to WCAG 2.5.8 Target Size (Minimum), new in WCAG 2.2. Learn the 24×24 CSS pixel rule, all five exceptions, the spacing offset technique, code examples, testing methods, and common mistakes.",
  keywords: [
    "WCAG 2.5.8",
    "Target Size Minimum",
    "target size",
    "24x24 pixels",
    "tap target size",
    "touch target size",
    "minimum target size accessibility",
    "WCAG 2.2",
    "Level AA",
    "clickable area accessibility",
    "button size accessibility",
    "spacing exception target size",
    "mobile accessibility",
    "pointer target size",
  ],
  alternates: {
    canonical: "https://accessibility.build/wcag/2-5-8",
  },
  openGraph: {
    title:
      "WCAG 2.5.8 Target Size (Minimum) — 24×24 px Tap Targets Guide (Level AA)",
    description:
      "The definitive guide to WCAG 2.5.8 Target Size (Minimum): the 24×24 CSS pixel rule, all five exceptions, the spacing offset technique, copy-ready code, and testing methods.",
    url: "https://accessibility.build/wcag/2-5-8",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: "https://accessibility.build/api/og?title=WCAG%202.5.8%20Target%20Size%20%28Minimum%29&section=WCAG",
        width: 1200,
        height: 630,
        alt: "WCAG 2.5.8 Target Size (Minimum) guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WCAG 2.5.8 Target Size (Minimum) — 24×24 px Tap Targets",
    description:
      "Learn the 24×24 CSS pixel rule, all five exceptions, the spacing offset technique, and how to test target size for WCAG 2.2 Level AA.",
  },
}

const exceptions = [
  {
    name: "Spacing",
    summary:
      "Undersized targets pass if they have enough spacing around them.",
    detail:
      "A target under 24×24 px is allowed when a 24 px diameter circle, centered on the bounding box of each target, does not intersect the circle of any adjacent target (or the bounding box of any other target). In practice this means a small icon can stay small as long as nothing tappable sits within roughly 24 px of its center.",
  },
  {
    name: "Equivalent",
    summary:
      "Another control on the same page does the same thing at full size.",
    detail:
      "If a 24×24 px (or larger) control on the same page performs the identical function, the smaller target is exempt. For example, a tiny inline 'edit' pencil can be undersized if a full-size 'Edit' button elsewhere on the page does the same job.",
  },
  {
    name: "Inline",
    summary: "Links inside a sentence or block of text are exempt.",
    detail:
      "Targets whose position is determined by the flow of surrounding text — such as a link in the middle of a paragraph — are excluded. Their size is constrained by line-height and the reading layout, so forcing them larger would break the text.",
  },
  {
    name: "User agent control",
    summary: "The browser sets the size and you have not changed it.",
    detail:
      "If the size of the target is determined by the user agent (the browser) and is not modified by the author, it passes. A default, unstyled checkbox or radio button rendered by the browser is the classic example. Once you restyle its dimensions with CSS, the exception no longer applies.",
  },
  {
    name: "Essential",
    summary: "A specific small presentation is essential or legally required.",
    detail:
      "If a particular small presentation of the target is essential to the information being conveyed — or is legally required — it is exempt. Pins on an interactive map that mark exact geographic coordinates are the canonical example, because moving or enlarging them would misrepresent the locations.",
  },
]

const faqs = [
  {
    q: "What is the minimum target size under WCAG 2.5.8?",
    a: "WCAG 2.5.8 Target Size (Minimum) requires that the target for any pointer input is at least 24 by 24 CSS pixels, unless one of five exceptions applies (Spacing, Equivalent, Inline, User-agent control, or Essential). It is a Level AA success criterion that was added in WCAG 2.2. Note that CSS pixels are a reference unit and are not the same as physical device pixels — a target measured in the browser at 24 CSS pixels meets the requirement regardless of the device's pixel density.",
  },
  {
    q: "Is WCAG 2.5.8 the same as 24px or 44px?",
    a: "They are two different success criteria. WCAG 2.5.8 Target Size (Minimum) is Level AA and requires 24×24 CSS pixels — it is new in WCAG 2.2. WCAG 2.5.5 Target Size (Enhanced) is Level AAA and requires 44×44 CSS pixels — it has existed since WCAG 2.1. If you are aiming for the common Level AA conformance target, 24×24 is your floor, but 44×44 is widely recommended as a usability best practice, and it matches the platform guidance from Apple (44pt) and Google Material (48dp).",
  },
  {
    q: "Does the target size include padding, or only the visible icon?",
    a: "The target is the full clickable or tappable region — its bounding box — not just the visible glyph or text. A 16×16 px icon inside a button with 8 px of padding on every side has a 32×32 px target and passes. This is the most common and most useful way to satisfy 2.5.8: keep the icon visually small but expand the hit area with padding, a larger height, or a pseudo-element overlay.",
  },
  {
    q: "How does the spacing exception work?",
    a: "Draw an imaginary 24 px diameter circle centered on each undersized target. If no target's circle overlaps the circle (or bounding box) of any neighboring target, the targets pass under the Spacing exception even though each is smaller than 24×24 px. Concretely, two 16 px icons pass if their centers are at least 24 px apart, because their 24 px circles will not intersect. This exception is why a row of small, well-spaced toolbar icons can conform without being enlarged.",
  },
  {
    q: "Do inline text links need to be 24×24 pixels?",
    a: "No. Links embedded in a sentence or paragraph are covered by the Inline exception because their size is dictated by the line-height of the surrounding text. You do not need to enlarge a link in the middle of running prose. However, stand-alone links presented as navigation items, buttons, or list rows are not inline and must meet the 24×24 requirement (or qualify under another exception such as Spacing).",
  },
  {
    q: "How do I test for WCAG 2.5.8 compliance?",
    a: "Use your browser developer tools to inspect each interactive element and read its rendered width and height in CSS pixels — include padding in the measurement, since the hit area is the bounding box. For undersized targets, measure center-to-center spacing to check the Spacing exception. Automated tools such as axe DevTools and Lighthouse flag many target-size issues, but spacing-exception and equivalent-control cases need manual judgment. Always finish with a real touch test on a phone.",
  },
]

export default function WCAG258Page() {
  return (
    <>
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "WCAG Success Criteria", url: "https://accessibility.build/wcag" },
          {
            name: "2.5.8 Target Size (Minimum)",
            url: "https://accessibility.build/wcag/2-5-8",
          },
        ]}
      />

      <ArticleStructuredData
        headline="WCAG 2.5.8 Target Size (Minimum): The Complete 24×24 px Tap Target Guide"
        description="The definitive guide to WCAG 2.5.8 Target Size (Minimum), new in WCAG 2.2: the 24×24 CSS pixel rule, all five exceptions, the spacing offset technique, code examples, testing methods, and common mistakes."
        author={{
          name: "Khushwant Parihar",
          url: "https://accessibility.build/about",
        }}
        publisher={{
          name: "Accessibility.build",
          logo: "https://accessibility.build/android-chrome-512x512.png",
        }}
        datePublished="2026-06-24"
        dateModified="2026-06-24"
        image="https://accessibility.build/api/og?title=WCAG%202.5.8%20Target%20Size%20%28Minimum%29&section=WCAG"
        url="https://accessibility.build/wcag/2-5-8"
        wordCount={2600}
        keywords={[
          "WCAG 2.5.8",
          "Target Size Minimum",
          "24x24 pixels",
          "tap target size",
          "WCAG 2.2",
          "Level AA",
          "touch target size",
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
                    2.5.8 Target Size (Minimum)
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
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                New in WCAG 2.2
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Principle 2: Operable
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
              WCAG 2.5.8: Target Size (Minimum)
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              The size of the target for pointer inputs is at least{" "}
              <strong className="text-slate-900 dark:text-white">
                24 by 24 CSS pixels
              </strong>
              , except where Spacing, Equivalent, Inline, User-agent control, or
              Essential applies. Meeting this Level AA criterion makes buttons,
              links, and controls easier to tap and click accurately — for
              everyone, but especially for people with motor impairments, tremor,
              or limited dexterity, and anyone using a touchscreen on the move.
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
              The size of the target for pointer inputs is at least 24 by 24 CSS
              pixels, except where: <strong>Spacing</strong>, <strong>Equivalent</strong>
              , <strong>Inline</strong>, <strong>User-agent control</strong>, or{" "}
              <strong>Essential</strong>.
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
                  Why target size matters
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#what">
                  What the 24×24 rule actually measures
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#exceptions">
                  The five exceptions
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
              Why target size matters
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Small targets are hard to hit. A user has to position the pointer
              precisely and hold it steady to activate a control, and that demand
              excludes a large group of people: those with hand tremors,
              arthritis, Parkinson&apos;s disease, or reduced fine-motor control;
              people using a touchscreen one-handed on a bus or while walking; and
              anyone using a head pointer, switch, or other alternative input. When
              targets are crowded and tiny, missed taps trigger the wrong action,
              cause accidental purchases, or force frustrating re-attempts.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Larger targets reduce error rates for <em>everyone</em> — a classic
              illustration of Fitts&apos;s Law, which predicts that the time to
              acquire a target shrinks as the target grows and as the distance to
              it falls. WCAG 2.5.8 sets a pragmatic floor of 24×24 CSS pixels for
              Level AA, while the stricter{" "}
              <a
                href="#related-criteria"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                2.5.5 Target Size (Enhanced)
              </a>{" "}
              asks for 44×44 at Level AAA.
            </p>
          </section>

          {/* What */}
          <section aria-labelledby="what" className="mb-12">
            <h2
              id="what"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              What the 24×24 rule actually measures
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Three details trip people up most often:
            </p>
            <ul className="space-y-4 mb-6">
              <li className="flex gap-3">
                <span className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-sm font-bold flex items-center justify-center">
                  1
                </span>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  <strong className="text-slate-900 dark:text-white">
                    The target is the whole hit area, not the visible icon.
                  </strong>{" "}
                  Padding counts. A 14 px icon wrapped in a button with 6 px of
                  padding on each side has a 26×26 px target and passes. You
                  almost never need to enlarge the artwork — you enlarge the
                  clickable region around it.
                </p>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-sm font-bold flex items-center justify-center">
                  2
                </span>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  <strong className="text-slate-900 dark:text-white">
                    CSS pixels, not device pixels.
                  </strong>{" "}
                  The 24 px is measured in CSS reference pixels, the same unit you
                  set widths in. A high-density &ldquo;Retina&rdquo; display does
                  not change the requirement — a control that is 24 CSS pixels wide
                  conforms regardless of how many physical pixels render it.
                </p>
              </li>
              <li className="flex gap-3">
                <span className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-sm font-bold flex items-center justify-center">
                  3
                </span>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  <strong className="text-slate-900 dark:text-white">
                    Both dimensions must reach 24 px.
                  </strong>{" "}
                  A long, 16 px-tall button might be plenty wide but still fails on
                  height. Check width <em>and</em> height — undersized height is
                  the single most common real-world failure, especially for
                  dense menu rows and compact icon buttons.
                </p>
              </li>
            </ul>
            <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/20 p-5">
              <p className="text-emerald-900 dark:text-emerald-200 leading-relaxed">
                <strong>Rule of thumb:</strong> if you give every stand-alone
                interactive control a minimum height and width of{" "}
                <code className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/40 font-mono text-sm">
                  24px
                </code>{" "}
                (44px is even better) and keep small targets spaced apart, you will
                satisfy 2.5.8 in the vast majority of cases.
              </p>
            </div>
          </section>

          {/* Exceptions */}
          <section aria-labelledby="exceptions" className="mb-12">
            <h2
              id="exceptions"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              The five exceptions
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              A target may be smaller than 24×24 px and still conform if any one of
              these five exceptions applies. Knowing them prevents both
              over-engineering and false failures.
            </p>
            <div className="space-y-4">
              {exceptions.map((ex, i) => (
                <div
                  key={ex.name}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 p-6"
                >
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">
                    {i + 1}. {ex.name}
                  </h3>
                  <p className="text-blue-700 dark:text-blue-300 font-medium mb-2">
                    {ex.summary}
                  </p>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {ex.detail}
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
              Code examples
            </h2>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Enlarge the hit area without enlarging the icon (CSS)
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              The most reliable fix is to set a minimum size on the control and let
              padding center a small icon inside it.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`/* Any clickable control: never smaller than 24x24 CSS px */
.icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  min-height: 24px;
  /* 44x44 is the recommended, more comfortable target */
  padding: 10px;
}

/* The visible glyph can stay small */
.icon-button svg {
  width: 16px;
  height: 16px;
}`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Extend a small target with a pseudo-element
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              When you cannot change layout dimensions, an invisible
              <code className="px-1.5 py-0.5 mx-1 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                ::before
              </code>
              overlay expands the clickable region without affecting the visual
              size.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`.compact-link {
  position: relative;
}

/* Expand the hit area to at least 24x24 without moving anything */
.compact-link::before {
  content: "";
  position: absolute;
  inset: 50% auto auto 50%;
  width: max(24px, 100%);
  height: max(24px, 100%);
  transform: translate(-50%, -50%);
}`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Accessible React icon button
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              A real button element, an accessible name for screen readers, a
              guaranteed minimum size, and a visible focus indicator — all in one.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Close dialog"
      className="
        inline-flex items-center justify-center
        min-w-[44px] min-h-[44px] p-2
        rounded-md
        focus-visible:outline focus-visible:outline-2
        focus-visible:outline-offset-2 focus-visible:outline-blue-600
      "
    >
      <XIcon aria-hidden="true" className="w-4 h-4" />
    </button>
  )
}`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Using the Spacing exception for a toolbar of small icons
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              If you genuinely need 16 px icons, give them enough gap that a 24 px
              circle around each center never overlaps its neighbor.
            </p>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`/* 16px targets pass under the Spacing exception when
   centers are >= 24px apart. With 16px icons, an 8px gap
   puts centers 24px apart (16 + 8). */
.toolbar {
  display: flex;
  gap: 8px;
}
.toolbar button {
  width: 16px;
  height: 16px;
}`}</code>
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
                "Measuring only the icon or text glyph instead of the full padded hit area — the target is the bounding box, padding included.",
                "Passing on width but failing on height. Dense menu rows, breadcrumb links, and compact icon buttons frequently clear 24px wide but fall short of 24px tall.",
                "Restyling a native checkbox or radio smaller than 24px. Once you set its dimensions, the User-agent control exception no longer protects it.",
                "Assuming all links are exempt under Inline. Only links inside a run of text qualify; navigation links, button-styled links, and list-row links must meet 24×24.",
                "Placing small targets too close together. Undersized icons need ~24px center-to-center spacing to qualify under the Spacing exception.",
                "Confusing 2.5.8 (24px, AA) with 2.5.5 (44px, AAA) and either over-building or under-building. Know which target you are conforming to.",
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
              How to test for 2.5.8
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "Inspect rendered dimensions",
                  d: "Open browser DevTools, select each interactive element, and read the box-model width and height in CSS pixels. Include padding — the hit area is the full bounding box.",
                },
                {
                  t: "Flag anything under 24px",
                  d: "List every control whose width or height is below 24px. These need a fix, or must qualify under one of the five exceptions.",
                },
                {
                  t: "Check spacing on undersized targets",
                  d: "For small targets, measure center-to-center distance to neighbors. If a 24px circle around each center does not overlap, they pass under Spacing.",
                },
                {
                  t: "Run automated checks",
                  d: "axe DevTools, Lighthouse, and similar scanners catch many obvious target-size failures and undersized tap targets quickly across a page.",
                },
                {
                  t: "Finish with a real touch test",
                  d: "Automation cannot feel a missed tap. Try the interface on an actual phone, ideally one-handed, and confirm controls are comfortable to hit.",
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
              Run a full sweep with our{" "}
              <Link
                href="/tools/mobile-accessibility-checker"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Mobile Accessibility Checker
              </Link>{" "}
              and audit a live URL with the{" "}
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
            <CriterionLinks number="2.5.8" />
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
            content="target size minimum 24 pixels tap target touch target pointer input mobile accessibility button size WCAG 2.2 2.5.8 spacing exception keyboard accessibility focus"
            maxItems={6}
          />
        </section>
      </div>
    </>
  )
}
