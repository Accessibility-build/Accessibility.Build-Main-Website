import type { Metadata } from "next"
import Link from "next/link"
import WCAGSEOEnhancements from "@/components/wcag/seo-enhancements"
import WCAGBreadcrumb from "@/components/wcag/breadcrumb"
import { CriterionLinks } from "@/components/wcag/criterion-links"
import { RelatedContent } from "@/components/seo/related-content"

export const metadata: Metadata = {
  title: "WCAG 2.4.12 Focus Not Obscured (Enhanced) Guide",
  description:
    "WCAG 2.4.12 requires that no part of a focused element is hidden by author content. How it strengthens 2.4.11, sticky header fixes with scroll-padding, and testing.",
  keywords: [
    "WCAG 2.4.12",
    "Focus Not Obscured Enhanced",
    "focus hidden sticky header",
    "scroll-padding",
    "scroll-margin",
    "keyboard focus visibility",
    "focus obscured",
    "WCAG 2.2 new criteria",
    "2.4.12 test",
    "Level AAA",
    "navigable",
  ],
  alternates: {
    canonical: "/wcag/2-4-12",
  },
  openGraph: {
    title: "WCAG 2.4.12 Focus Not Obscured (Enhanced) Guide",
    description:
      "New in WCAG 2.2: when an element receives keyboard focus, no part of it may be hidden by author-created content. Fixes with scroll-padding and layout, plus testing steps.",
    url: "/wcag/2-4-12",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: "/api/og?title=WCAG%202.4.12%20Focus%20Not%20Obscured%20(Enhanced)&section=WCAG",
        width: 1200,
        height: 630,
        alt: "WCAG 2.4.12 Focus Not Obscured (Enhanced) guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WCAG 2.4.12 Focus Not Obscured (Enhanced) Guide",
    description:
      "2.4.11 says 'not entirely hidden'; 2.4.12 says 'no part hidden'. How to keep the focused element fully visible under sticky headers and overlays at Level AAA.",
    images: [
      "/api/og?title=WCAG%202.4.12%20Focus%20Not%20Obscured%20(Enhanced)&section=WCAG",
    ],
  },
}

const faqs = [
  {
    q: "What does WCAG 2.4.12 Focus Not Obscured (Enhanced) require?",
    a: "It requires that when a user interface component receives keyboard focus, no part of the component is hidden by author-created content. Where the Level AA version (2.4.11) tolerates partial covering as long as some of the element remains visible, the AAA version demands the entire focused element stay visible — nothing clipped behind a sticky header, floating footer, cookie banner, or chat widget. It is one of the success criteria introduced in WCAG 2.2.",
  },
  {
    q: "What is the exact difference between 2.4.11 and 2.4.12?",
    a: "One word of scope. 2.4.11 Focus Not Obscured (Minimum), Level AA, says the focused component must not be entirely hidden — if even a sliver remains visible, it passes. 2.4.12 Focus Not Obscured (Enhanced), Level AAA, says no part of the focused component may be hidden — the whole element, including its focus indicator area, must be on screen and uncovered. A button whose bottom half slides under a sticky footer passes 2.4.11 and fails 2.4.12.",
  },
  {
    q: "Does 2.4.12 apply to content the user opened themselves?",
    a: "The criterion targets author-created content that overlaps the focused element — sticky bars, banners, and widgets you placed in the layout. Content the user can reposition or dismiss is treated pragmatically: if the user opened a movable panel that happens to cover a focused control, the understanding documents for the focus-obscured criteria treat user-movable and user-dismissible content more leniently. The realistic failures you must engineer away are your own persistent overlays.",
  },
  {
    q: "Is a semi-transparent overlay over the focused element a pass?",
    a: "For 2.4.11 the understanding document notes that content is not considered 'hidden' by an overlay that is sufficiently transparent for the component to still be perceived. For 2.4.12's stricter 'no part hidden' bar, the safe engineering interpretation is: do not let anything you author sit on top of a focused element at all. If a translucent scrim leaves the element clearly perceivable it may be arguable, but designing so the question never arises is both easier to verify and better for users.",
  },
  {
    q: "How do I fix sticky-header focus obscuring with CSS?",
    a: "Reserve space for the sticky regions in the scroll calculation. Set scroll-padding-top (and scroll-padding-bottom for sticky footers) on the scroll container — usually html — equal to the height of the fixed bars, or set scroll-margin on focusable targets. When the browser scrolls a newly focused element into view, it will stop short of the sticky region instead of tucking the element underneath it. This one- or two-line CSS fix resolves the vast majority of 2.4.11 and 2.4.12 failures simultaneously.",
  },
  {
    q: "Do I need to meet 2.4.12 for legal compliance?",
    a: "Generally no — laws and procurement standards reference WCAG Level AA, which includes 2.4.11 but not 2.4.12. However, the fix for both is usually identical (scroll-padding, or not overlapping content in the first place), so once you address the AA criterion properly you often meet the AAA one for free. Fully visible focus also compounds with 2.4.7 Focus Visible and 2.4.13 Focus Appearance to make keyboard operation genuinely comfortable rather than merely possible.",
  },
]

export default function WCAG2412Page() {
  return (
    <>
      <WCAGSEOEnhancements
        title="WCAG 2.4.12: Focus Not Obscured (Enhanced)"
        description="When a user interface component receives keyboard focus, no part of the component is hidden by author-created content."
        criteria="2.4.12"
        level="AAA"
        principle="Operable"
        guideline="2.4 Navigable"
        url="https://accessibility.build/wcag/2-4-12"
        category="Navigable"
        hasInteractiveDemo={false}
        relatedCriteria={["2.4.11", "2.4.7", "2.4.13"]}
      />

      <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <WCAGBreadcrumb
            items={[]}
            current="2.4.12 Focus Not Obscured (Enhanced)"
          />

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
              WCAG 2.4.12: Focus Not Obscured (Enhanced)
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              A keyboard user&rsquo;s only sense of &ldquo;where am I?&rdquo;
              is the focused element. This criterion — the strict AAA sibling
              of 2.4.11 — requires that{" "}
              <strong className="text-slate-900 dark:text-white">
                no part of the focused component is hidden
              </strong>{" "}
              by content you placed on the page. Not half-covered by a sticky
              footer, not clipped under a fixed header:{" "}
              <em>fully visible, always</em>.
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
              When a user interface component receives keyboard focus, no part
              of the component is hidden by author-created content.
            </blockquote>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4 text-sm">
              Compare the Level AA wording in{" "}
              <Link
                href="/wcag/2-4-11"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                2.4.11
              </Link>
              : &ldquo;…the component is not <em>entirely</em> hidden.&rdquo;
              The Enhanced criterion deletes the tolerance for partial
              covering. &ldquo;Author-created content&rdquo; scopes it to
              things you put in the page — sticky bars, banners, widgets — not
              the user&rsquo;s own browser UI.
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
                <a className="hover:underline" href="#vs-2411">
                  2.4.11 vs 2.4.12
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#culprits">
                  The usual culprits
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
              Sighted keyboard users — people with motor disabilities who
              cannot use a mouse, power users, switch-device users — operate a
              page by watching the focus indicator move as they press{" "}
              <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-xs">
                Tab
              </kbd>
              . When the browser scrolls the next focused element flush against
              the viewport edge and a sticky bar sits on top of it, the user
              loses the thread: they cannot see what is focused, read its
              label, or judge what pressing{" "}
              <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-xs">
                Enter
              </kbd>{" "}
              will do.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              The Enhanced criterion matters because <em>partial</em> visibility
              is often not enough in practice. If a form field&rsquo;s label
              and error message are under the sticky footer and only its top
              border peeks out, a user with low vision or a cognitive
              disability still cannot use it. Full visibility removes the
              guesswork entirely.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              It also protects magnification users, for whom sticky regions
              consume a huge share of the zoomed viewport, and it compounds
              with{" "}
              <Link
                href="/wcag/2-4-7"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                2.4.7 Focus Visible
              </Link>{" "}
              — an excellent focus indicator is worthless while it is parked
              underneath a cookie banner.
            </p>
          </section>

          {/* vs 2.4.11 */}
          <section aria-labelledby="vs-2411" className="mb-12">
            <h2
              id="vs-2411"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              2.4.11 vs 2.4.12: one word of difference
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  <Link
                    href="/wcag/2-4-11"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    2.4.11 Focus Not Obscured (Minimum)
                  </Link>{" "}
                  — AA
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  The focused component must not be{" "}
                  <strong className="text-slate-900 dark:text-white">
                    entirely
                  </strong>{" "}
                  hidden. Partial covering passes: if any visible fragment of
                  the element remains, the AA bar is met.
                </p>
              </div>
              <div className="rounded-xl border border-purple-200 dark:border-purple-900/40 bg-purple-50 dark:bg-purple-950/20 p-5">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  2.4.12 Focus Not Obscured (Enhanced) — AAA
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  <strong className="text-slate-900 dark:text-white">
                    No part
                  </strong>{" "}
                  of the focused component may be hidden. The entire element
                  must remain visible and uncovered whenever it holds keyboard
                  focus.
                </p>
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Concrete example: a 48px-tall &ldquo;Subscribe&rdquo; button
              scrolls into view beneath a 40px sticky header, leaving an 8px
              strip visible. 2.4.11: pass (not entirely hidden). 2.4.12: fail
              (part of it is hidden). Same page, same CSS — the AAA criterion
              simply refuses the compromise.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              The good news: the engineering fix is identical for both, and
              once you reserve scroll space for your sticky regions correctly,
              you meet the Enhanced criterion at no extra cost. That is why
              teams that fix 2.4.11 with{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                scroll-padding
              </code>{" "}
              rather than with &ldquo;a sliver still shows&rdquo; arguments get
              AAA behaviour for free.
            </p>
          </section>

          {/* Culprits */}
          <section aria-labelledby="culprits" className="mb-12">
            <h2
              id="culprits"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              The usual culprits
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  t: "Sticky headers and nav bars",
                  d: "The browser scrolls the focused element flush to the top of the viewport — directly underneath the fixed header.",
                },
                {
                  t: "Sticky footers and action bars",
                  d: "Bottom-anchored toolbars and 'Accept / Continue' bars cover elements the browser scrolls flush to the bottom edge.",
                },
                {
                  t: "Cookie and consent banners",
                  d: "Large persistent banners — especially bottom sheets — sit over whole rows of focusable content until dismissed.",
                },
                {
                  t: "Chat bubbles and floating buttons",
                  d: "Fixed-position chat launchers, 'back to top' buttons, and promo toasts hover over content in the corner they occupy.",
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
              Code examples
            </h2>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Reserve scroll space with scroll-padding
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Tell the browser how much of the viewport your sticky regions
              consume. Focus-driven scrolling then stops short of them, keeping
              the focused element fully clear.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`/* ✗ Nothing reserved: focused elements scroll under the bars */
.site-header { position: sticky; top: 0; height: 64px; }
.action-bar  { position: fixed; bottom: 0; height: 72px; }

/* ✓ Focus scrolling stops clear of both sticky regions */
html {
  scroll-padding-top: 64px;    /* height of sticky header */
  scroll-padding-bottom: 72px; /* height of fixed footer  */
}`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Or set scroll-margin on focusable targets
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              When you cannot style the scroll container — embedded contexts,
              third-party shells —{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                scroll-margin
              </code>{" "}
              on the elements themselves achieves the same clearance.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`/* ✓ Every focusable element keeps clear of the sticky bars */
a, button, input, select, textarea, [tabindex] {
  scroll-margin-top: 64px;
  scroll-margin-bottom: 72px;
}`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Design overlays out of the collision path
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              CSS clearance handles scroll-driven overlap. For persistent
              floating widgets, the sturdier answer is layout: let them occupy
              reserved space instead of hovering over content.
            </p>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- ✗ Banner floats over the page, covering focusable rows -->
<div class="cookie-banner" style="position: fixed; bottom: 0">…</div>

<!-- ✓ Banner participates in layout; nothing renders beneath it -->
<body style="display: flex; flex-direction: column; min-height: 100dvh">
  <main style="flex: 1">…</main>
  <div class="cookie-banner">…</div> <!-- in flow, not floating -->
</body>`}</code>
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
                "Sticky headers with no scroll-padding, so tabbing backwards scrolls each newly focused element under the header.",
                "Fixed bottom action bars ('Save', 'Accept cookies') that cover the lower portion of focused form fields and their error messages.",
                "Chat launchers and 'back to top' buttons overlapping the last focusable items in a column — passes 2.4.11 by a sliver, fails 2.4.12.",
                "Non-modal toast notifications that appear over the element the user is currently focused on.",
                "Autocomplete or mega-menu panels that stay open and cover elements as focus moves beyond them.",
                "Only testing forward tabbing from the top of the page — top-edge obscuring typically appears when tabbing in reverse (Shift+Tab).",
                "Reserving scroll space for the header but forgetting the sticky footer, or vice versa.",
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
              How to test for 2.4.12
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "Inventory the floating layers",
                  d: "List everything with position: sticky or fixed — headers, footers, banners, chat widgets, toasts. These are the only things that can cause a failure, so know where they are before you start tabbing.",
                },
                {
                  t: "Tab through the entire page",
                  d: "Press Tab from the top of the document to the end, watching each focused element. Every time focus lands near a sticky region, check: is any pixel of the element (not just its indicator) covered?",
                },
                {
                  t: "Tab backwards too",
                  d: "Shift+Tab from the bottom of the page upward. Reverse tabbing scrolls elements against the top edge, which is exactly where sticky headers live — most failures only appear in this direction.",
                },
                {
                  t: "Repeat with overlays active",
                  d: "Re-run the pass with the cookie banner undismissed, the chat widget loaded, and any promotional toasts visible. Test at several viewport sizes and at 200%+ zoom, where sticky regions eat proportionally more of the screen.",
                },
                {
                  t: "Apply the stricter AAA judgment",
                  d: "For 2.4.11 you asked 'is anything still visible?' For 2.4.12 ask 'is everything visible?' Any partial covering of the focused component by author content — even a few pixels — is a failure at this level.",
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
              This is a purely manual, visual test — automated scanners cannot
              yet reliably detect focus obscuring. Fold it into your keyboard
              pass alongside{" "}
              <Link
                href="/wcag/2-4-7"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                2.4.7 Focus Visible
              </Link>{" "}
              checks, and track it in the{" "}
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

          <CriterionLinks number="2.4.12" />
        </article>

        {/* Related content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <RelatedContent
            content="focus not obscured enhanced keyboard focus hidden sticky header sticky footer cookie banner scroll-padding scroll-margin focus visible focus appearance WCAG 2.2 new criteria navigable WCAG 2.4.12 Level AAA"
            maxItems={6}
          />
        </section>
      </div>
    </>
  )
}
