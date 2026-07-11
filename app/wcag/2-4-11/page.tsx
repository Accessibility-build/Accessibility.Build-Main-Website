import type { Metadata } from "next"
import Link from "next/link"
import {
  ArticleStructuredData,
  BreadcrumbStructuredData,
} from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"
import { CriterionLinks } from "@/components/wcag/criterion-links"

export const metadata: Metadata = {
  title: "WCAG 2.4.11 Focus Not Obscured (Minimum) Guide",
  description:
    "Complete guide to WCAG 2.4.11 Focus Not Obscured (Minimum), new in WCAG 2.2. Learn why sticky headers, cookie banners, and floating buttons hide the focused element, and how to fix it with scroll-margin, scroll-padding, and CSS — with copy-ready code, testing methods, and common mistakes.",
  keywords: [
    "WCAG 2.4.11",
    "Focus Not Obscured",
    "Focus Not Obscured Minimum",
    "sticky header accessibility",
    "scroll-margin",
    "scroll-padding",
    "scroll-padding-top",
    "keyboard focus hidden",
    "focus obscured",
    "WCAG 2.2",
    "Level AA",
    "focus management",
    "sticky footer accessibility",
    "cookie banner accessibility",
    "focus indicator hidden",
  ],
  alternates: {
    canonical: "https://accessibility.build/wcag/2-4-11",
  },
  openGraph: {
    title:
      "WCAG 2.4.11 Focus Not Obscured (Minimum) — Sticky Header Guide (Level AA)",
    description:
      "The definitive guide to WCAG 2.4.11 Focus Not Obscured (Minimum): why sticky headers and floating overlays hide the keyboard-focused element, and how to fix it with scroll-padding, scroll-margin, and layout changes. New in WCAG 2.2, with copy-ready code and testing steps.",
    url: "https://accessibility.build/wcag/2-4-11",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: "https://accessibility.build/api/og?title=WCAG%202.4.11%20Focus%20Not%20Obscured%20%28Minimum%29&section=WCAG",
        width: 1200,
        height: 630,
        alt: "WCAG 2.4.11 Focus Not Obscured (Minimum) guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WCAG 2.4.11 Focus Not Obscured (Minimum)",
    description:
      "When a keyboard user tabs to an element, a sticky header or floating overlay must not completely hide it. How to meet WCAG 2.4.11 (new in 2.2) with scroll-padding, scroll-margin, and CSS.",
  },
}

const requirements = [
  {
    name: "When an element receives focus, it must not be entirely hidden",
    summary:
      "At least part of the focused component has to remain visible — a sticky header or overlay covering it completely is a failure.",
    detail:
      "2.4.11 is the 'Minimum' level: the focused element is allowed to be partially covered, but it cannot be 100% obscured by other content the author placed on top. If a keyboard user presses Tab and the element they just moved to is hidden behind a sticky header, a cookie banner, or a floating chat widget, they have no idea where they are. The criterion guarantees that something of the focused item stays on screen.",
  },
  {
    name: "It applies to author-created overlapping content",
    summary:
      "The obstruction must come from content you control — sticky toolbars, banners, sticky footers — not from the user's own browser tools.",
    detail:
      "The element being hidden by a sticky header you built is in scope. The element being hidden because the user opened the browser's find-on-page bar, or a non-modal author-opened layer the user can dismiss, is treated differently. In practice, the realistic, common failures are author UI: position: sticky / fixed headers and footers, persistent cookie consent bars, 'back to top' buttons, and live-chat bubbles that float over scrolled content.",
  },
  {
    name: "Both keyboard focus and the new pointer interaction count",
    summary:
      "The criterion is about the component that receives keyboard focus; the fix is usually a CSS scroll change, not JavaScript.",
    detail:
      "When focus moves via the keyboard, the browser scrolls the element into view. The bug is that the browser scrolls it flush against the top or bottom edge, directly underneath a sticky bar. The reliable fix is to reserve space for that bar with scroll-padding on the scroll container (or scroll-margin on the targets) so the browser stops short of the sticky region, leaving the focused element fully visible.",
  },
]

const exceptions = [
  "If the obstructing content can be revealed and dismissed by the user without moving focus (for example, the user collapsed a sticky banner), and it is the user — not the author — keeping it open, the criterion is satisfied even when it would otherwise cover the focus.",
  "Where the user agent (the browser) itself causes the obstruction — such as the browser's own find bar or autofill dropdown — the author is not responsible under 2.4.11.",
  "2.4.11 is the Level AA 'Minimum': partial obstruction is permitted. The stricter 2.4.12 Focus Not Obscured (Enhanced), Level AAA, requires that no part of the focused element is hidden at all.",
]

const faqs = [
  {
    q: "What does WCAG 2.4.11 Focus Not Obscured (Minimum) require?",
    a: "WCAG 2.4.11 (Level AA, new in WCAG 2.2) requires that when a user interface component receives keyboard focus, it is not entirely hidden by author-created content such as a sticky header, sticky footer, cookie banner, or floating widget. At least part of the focused element must remain visible. It is the 'Minimum' version — partial covering is allowed; the AAA version, 2.4.12, requires the focused element be fully visible.",
  },
  {
    q: "How do I fix a sticky header that hides the focused element?",
    a: "Add scroll-padding-top to the scrolling container (usually the :root / html element) equal to the height of your sticky header, or set scroll-margin-top on the focusable targets. This tells the browser to stop scrolling short of the sticky region when it brings a focused element into view, so the element lands below the header instead of underneath it. For example, html { scroll-padding-top: 5rem; } if your sticky header is 5rem tall. The same approach with scroll-padding-bottom handles sticky footers.",
  },
  {
    q: "What is the difference between 2.4.11 and 2.4.12?",
    a: "Both are 'Focus Not Obscured', new in WCAG 2.2. 2.4.11 Focus Not Obscured (Minimum) is Level AA and allows the focused element to be partially covered — only complete obstruction fails. 2.4.12 Focus Not Obscured (Enhanced) is Level AAA and is stricter: no part of the component that receives focus may be hidden by author content. Meet 2.4.11 first for AA conformance; aim for 2.4.12 when you want a stronger guarantee.",
  },
  {
    q: "Does scroll-padding actually satisfy 2.4.11?",
    a: "Yes, in the most common case. The typical failure is that the browser scrolls a newly focused element flush to the viewport edge, directly under a sticky bar. scroll-padding on the scroll container (or scroll-margin on the focusable elements) reserves space for the sticky bar so the focused element is brought to rest in the visible area instead. It is a CSS-only fix that works for keyboard Tab navigation and in-page anchor jumps alike. Always verify by tabbing through the page with the sticky element in place.",
  },
  {
    q: "Is 2.4.11 only about sticky headers?",
    a: "No. Sticky and fixed headers are the most common cause, but any author content layered over the page can obscure focus: persistent cookie-consent banners, sticky footers and toolbars, 'back to top' buttons, live-chat bubbles, slide-in promos, and notification trays. Any of these can sit on top of a focused control after the user tabs to it. Test every one of them with keyboard navigation, because each can independently cause a 2.4.11 failure.",
  },
  {
    q: "How is 2.4.11 related to 2.4.7 Focus Visible?",
    a: "They are complementary. 2.4.7 Focus Visible (Level AA) requires that a visible focus indicator exists. 2.4.11 Focus Not Obscured ensures that the focused element — and therefore its indicator — is not hidden behind other content. A page can pass 2.4.7 by drawing a strong focus ring yet still fail 2.4.11 if a sticky header covers the focused element so the user never sees that ring. You need both: a visible indicator, and nothing covering it.",
  },
]

export default function WCAG2411Page() {
  return (
    <>
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "WCAG Success Criteria", url: "https://accessibility.build/wcag" },
          {
            name: "2.4.11 Focus Not Obscured (Minimum)",
            url: "https://accessibility.build/wcag/2-4-11",
          },
        ]}
      />

      <ArticleStructuredData
        headline="WCAG 2.4.11 Focus Not Obscured (Minimum): The Complete Sticky Header Guide"
        description="The definitive guide to WCAG 2.4.11 Focus Not Obscured (Minimum): why sticky headers and floating overlays hide the keyboard-focused element, and how to fix it with scroll-padding, scroll-margin, and layout changes, with code examples, testing methods, and common mistakes."
        author={{
          name: "Khushwant Parihar",
          url: "https://accessibility.build/about",
        }}
        publisher={{
          name: "Accessibility.build",
          logo: "https://accessibility.build/android-chrome-512x512.png",
        }}
        datePublished="2026-06-29"
        dateModified="2026-06-29"
        image="https://accessibility.build/api/og?title=WCAG%202.4.11%20Focus%20Not%20Obscured%20%28Minimum%29&section=WCAG"
        url="https://accessibility.build/wcag/2-4-11"
        wordCount={3000}
        keywords={[
          "WCAG 2.4.11",
          "Focus Not Obscured",
          "sticky header accessibility",
          "scroll-padding",
          "scroll-margin",
          "Level AA",
          "WCAG 2.2",
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
                    2.4.11 Focus Not Obscured (Minimum)
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
                Principle 2: Operable
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                New in WCAG 2.2
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                The &quot;sticky header&quot; criterion
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
              WCAG 2.4.11: Focus Not Obscured (Minimum)
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              A keyboard user presses <kbd>Tab</kbd>, the browser scrolls the
              next control into view &mdash; and it lands{" "}
              <strong className="text-slate-900 dark:text-white">
                directly behind your sticky header
              </strong>
              , completely hidden. They cannot see what is focused or where they
              are. New in WCAG 2.2, criterion 2.4.11 closes that gap, and the
              fix is usually a single line of{" "}
              <strong className="text-slate-900 dark:text-white">CSS</strong>:{" "}
              <code>scroll-padding</code>.
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
              When a user interface component receives keyboard focus, the
              component is not entirely hidden due to author-created content.
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
                  Why this criterion exists
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#what">
                  What 2.4.11 actually requires
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#causes">
                  What obscures focus
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#minimum-vs-enhanced">
                  Minimum vs. Enhanced (2.4.12)
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#exceptions">
                  Scope &amp; edge cases
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
              Why this criterion exists
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Sticky headers are everywhere. So are cookie banners pinned to the
              bottom of the screen, &quot;back to top&quot; buttons, and live-chat
              bubbles floating in a corner. For someone using a mouse, these
              never get in the way &mdash; you click exactly where you want and
              the page does not move. For someone navigating by keyboard, the
              browser does the scrolling for you, and it has no idea your header
              is sticky.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              So when a keyboard user tabs onto a link near the top of the
              viewport, the browser dutifully scrolls it into view &mdash; flush
              against the top edge, right where your <code>position: sticky</code>{" "}
              header is sitting. The focused element disappears underneath it.
              The user cannot see the focus indicator, cannot read the control,
              and has no way to know what activating it will do. WCAG 2.2 added
              2.4.11 precisely because this pattern is so common and so easy to
              ship without noticing. The good news: once you know to look for it,
              the fix is almost always trivial.
            </p>
          </section>

          {/* What */}
          <section aria-labelledby="what" className="mb-12">
            <h2
              id="what"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              What 2.4.11 actually requires
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              There are three testable ideas behind the criterion. Get these
              right and keyboard users can always see what they have focused.
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
                <strong>The rule of thumb:</strong> if you have anything pinned
                over the page with <code>position: sticky</code> or{" "}
                <code>position: fixed</code>, you almost certainly need{" "}
                <code>scroll-padding</code> on the scroll container equal to its
                size &mdash; <code>scroll-padding-top</code> for a sticky header,{" "}
                <code>scroll-padding-bottom</code> for a sticky footer.
              </p>
            </div>
          </section>

          {/* Causes */}
          <section aria-labelledby="causes" className="mb-12">
            <h2
              id="causes"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              What obscures focus in the real world
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              Almost every 2.4.11 failure comes from one of these patterns. If
              your site uses any of them, test it with the keyboard:
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  t: "Sticky / fixed headers",
                  d: "The single most common cause. A nav bar pinned to the top covers links and buttons as the user tabs to them near the top of the viewport.",
                },
                {
                  t: "Sticky footers & toolbars",
                  d: "Pinned bottom bars (formatting toolbars, action bars) hide elements the user tabs to near the bottom of the scroll area.",
                },
                {
                  t: "Cookie & consent banners",
                  d: "Persistent banners that stay on screen while the user navigates can cover focused controls until they are dismissed.",
                },
                {
                  t: "Floating widgets",
                  d: "\"Back to top\" buttons, live-chat bubbles, and slide-in promos float over scrolled content and can land on top of the focused element.",
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
                <strong>Watch the partial case too:</strong> 2.4.11 only fails
                when the element is <em>entirely</em> hidden, but an element that
                is mostly covered &mdash; with just a sliver showing &mdash; is a
                poor experience and may fail the AAA criterion 2.4.12. Aim to
                keep the whole focused element, not just a corner of it, visible.
              </p>
            </div>
          </section>

          {/* Minimum vs Enhanced */}
          <section aria-labelledby="minimum-vs-enhanced" className="mb-12">
            <h2
              id="minimum-vs-enhanced"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Minimum (2.4.11) vs. Enhanced (2.4.12)
            </h2>
            <ul className="space-y-3 mb-2">
              {[
                "2.4.11 Focus Not Obscured (Minimum) — Level AA: the focused component must not be ENTIRELY hidden. Partial obstruction passes. This is the conformance bar most teams target.",
                "2.4.12 Focus Not Obscured (Enhanced) — Level AAA: NO part of the focused component may be hidden by author content. Stricter, and the right goal where you can manage your sticky regions tightly.",
                "Both are new in WCAG 2.2 and both are fixed the same way — with scroll-padding / scroll-margin sized to your sticky regions. Meeting the Enhanced version automatically meets the Minimum.",
              ].map((point) => (
                <li
                  key={point}
                  className="flex gap-3 rounded-lg border border-slate-200 dark:border-slate-800 p-4"
                >
                  <span aria-hidden="true" className="text-blue-500 font-bold">
                    &rarr;
                  </span>
                  <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4">
              Because the fix is the same, it usually costs nothing extra to
              clear the focused element fully and satisfy the Enhanced
              criterion. Pair this with a strong focus ring per{" "}
              <Link
                href="/wcag/2-4-7"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                2.4.7 Focus Visible
              </Link>{" "}
              so the indicator is both present and unobstructed.
            </p>
          </section>

          {/* Scope / edge cases */}
          <section aria-labelledby="exceptions" className="mb-12">
            <h2
              id="exceptions"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Scope and edge cases
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              The criterion is scoped to author-created obstructions. These
              clarifications keep you from misapplying it.
            </p>
            <ul className="space-y-3">
              {exceptions.map((e) => (
                <li
                  key={e}
                  className="flex gap-3 rounded-lg border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/20 p-4"
                >
                  <span aria-hidden="true" className="text-emerald-600 font-bold">
                    &#10003;
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
              The one-line fix: scroll-padding for a sticky header
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Set <code>scroll-padding-top</code> on the scroll container
              (usually the root) to the height of your sticky header. The browser
              will stop scrolling short of that region, so a focused element
              never lands underneath it.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`/* Sticky header is 5rem tall */
header.site-nav {
  position: sticky;
  top: 0;
  height: 5rem;
}

/* Reserve that space when the browser scrolls
   a focused element (or anchor target) into view */
:root {
  scroll-padding-top: 5rem;
}`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Sticky footer: reserve space at the bottom
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              A pinned bottom bar hides elements the user tabs to near the bottom
              of the page. <code>scroll-padding-bottom</code> handles it the same
              way.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`:root {
  /* Header 5rem + footer toolbar 4rem */
  scroll-padding-top: 5rem;
  scroll-padding-bottom: 4rem;
}`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Per-element control with scroll-margin
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              When you cannot set padding on the scroll container, put{" "}
              <code>scroll-margin-top</code> on the focusable targets instead.
              This is also handy for individual anchor targets like section
              headings.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`/* Keep focusable controls clear of the sticky header */
a, button, input, select, textarea, [tabindex] {
  scroll-margin-top: 5rem;
}`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Dynamic header height with a CSS variable
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              If your header height changes (it shrinks on scroll, or differs by
              breakpoint), drive <code>scroll-padding-top</code> from a custom
              property you update in one place.
            </p>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`:root {
  --sticky-header-height: 5rem;
  scroll-padding-top: var(--sticky-header-height);
}

@media (min-width: 1024px) {
  :root { --sticky-header-height: 6.5rem; }
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
                "Shipping a sticky or fixed header with no scroll-padding, so every element tabbed to near the top of the viewport lands hidden underneath it — the classic failure.",
                "Setting scroll-padding-top smaller than the actual header height, leaving the focused element partially under the bar; size it to the full rendered height.",
                "Forgetting sticky footers, cookie banners, and floating chat widgets — only fixing the header and missing the other overlays that obscure focus.",
                "Hard-coding a pixel value that drifts out of sync when the header height changes responsively; drive it from a single CSS variable or matched value.",
                "Assuming a strong focus ring (2.4.7) is enough — a visible indicator drawn under a sticky header is still invisible to the user.",
                "Only testing with a mouse. Mouse users never trigger the browser scroll-into-view that exposes this bug; you must test with Tab.",
                "Relying on JavaScript scroll hacks (window.scrollBy after focus) that fight the browser and behave inconsistently, when scroll-padding is the native, reliable fix.",
                "Overlapping content with a high z-index that covers focus on small screens only — always retest at mobile widths where sticky bars take up more of the viewport.",
              ].map((m) => (
                <li
                  key={m}
                  className="flex gap-3 rounded-lg border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-4"
                >
                  <span aria-hidden="true" className="text-rose-500 font-bold">
                    &#10007;
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
              How to test for 2.4.11
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "Tab through the entire page",
                  d: "Press Tab from the top and watch where each focused element lands. The bug appears the moment a control scrolls into view directly beneath a sticky header or footer.",
                },
                {
                  t: "Scroll, then tab back up",
                  d: "Scroll partway down the page, then Shift+Tab toward the top. Elements near the sticky header are the ones most likely to be covered.",
                },
                {
                  t: "Check every sticky and floating layer",
                  d: "Test with the cookie banner showing, the chat widget open, and any sticky footer present. Each overlay can obscure focus independently.",
                },
                {
                  t: "Test at mobile widths",
                  d: "Sticky bars occupy a larger share of a small viewport, so an element that is clear on desktop can be fully covered on a phone. Resize and re-tab.",
                },
                {
                  t: "Confirm the focus indicator is fully visible",
                  d: "It is not enough that part of the element shows — the focus ring should be visible so the user can see exactly what is focused. This ties 2.4.11 to 2.4.7 Focus Visible.",
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
              This is a manual, keyboard-driven check &mdash; automated scanners
              rarely catch it because they do not simulate tabbing with sticky
              regions rendered. Build the habit into your{" "}
              <Link
                href="/guides/keyboard-accessibility"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                keyboard accessibility testing
              </Link>{" "}
              routine, and scan a live page with the{" "}
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
            <CriterionLinks number="2.4.11" />
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
                      &#9662;
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
            content="focus not obscured 2.4.11 sticky header fixed header scroll-padding scroll-margin scroll-padding-top keyboard focus hidden obscured focus indicator cookie banner sticky footer floating widget back to top button focus management focus visible focus order keyboard accessibility WCAG 2.2 Level AA new criterion"
            maxItems={6}
          />
        </section>
      </div>
    </>
  )
}
