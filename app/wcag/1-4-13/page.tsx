import type { Metadata } from "next"
import Link from "next/link"
import {
  ArticleStructuredData,
  BreadcrumbStructuredData,
} from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"

export const metadata: Metadata = {
  title:
    "WCAG 1.4.13 Content on Hover or Focus — Accessible Tooltips & Popovers (Level AA)",
  description:
    "Complete guide to WCAG 1.4.13 Content on Hover or Focus. Learn the three conditions — Dismissible, Hoverable, Persistent — how to build accessible tooltips and hover menus, why the title attribute fails, copy-ready code, testing methods, and common mistakes.",
  keywords: [
    "WCAG 1.4.13",
    "Content on Hover or Focus",
    "accessible tooltip",
    "tooltip accessibility",
    "dismissible hoverable persistent",
    "hover content accessibility",
    "popover accessibility",
    "hover menu accessibility",
    "title attribute accessibility",
    "aria-describedby tooltip",
    "Escape to dismiss",
    "Level AA",
    "WCAG 2.2",
    "focus content",
  ],
  alternates: {
    canonical: "https://accessibility.build/wcag/1-4-13",
  },
  openGraph: {
    title:
      "WCAG 1.4.13 Content on Hover or Focus — Accessible Tooltips & Popovers (Level AA)",
    description:
      "The definitive guide to WCAG 1.4.13: the Dismissible, Hoverable, and Persistent rules for tooltips and hover menus, why the title attribute fails, copy-ready accessible tooltip code, and testing.",
    url: "https://accessibility.build/wcag/1-4-13",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: "https://accessibility.build/og-image.png",
        width: 1200,
        height: 630,
        alt: "WCAG 1.4.13 Content on Hover or Focus guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WCAG 1.4.13 Content on Hover or Focus — Accessible Tooltips",
    description:
      "Make tooltips and hover menus Dismissible, Hoverable, and Persistent. Why the title attribute fails, copy-ready code, and how to test for WCAG 1.4.13 Level AA.",
  },
}

const requirements = [
  {
    name: "Dismissible",
    summary: "The user can make the extra content go away without moving the pointer or focus.",
    detail:
      "If pointing to or focusing an element reveals additional content, a mechanism must let the user dismiss it without moving hover or focus — pressing Escape is the standard. This matters most when the popup overlaps content the user was reading: a magnifier user zoomed into a paragraph should be able to clear a tooltip that landed on top of it without losing their place. The exception: the additional content does not need a dismiss mechanism if it communicates an input error, or if it does not obscure or replace any other content.",
  },
  {
    name: "Hoverable",
    summary: "The pointer can move onto the popup without it vanishing.",
    detail:
      "If hover triggers the extra content, the user must be able to move the mouse pointer over that content without it disappearing. People who magnify the screen, or who have tremors and cannot hold the pointer perfectly still, need to travel across a gap to reach the popup — to read all of it, scroll it, or click a link inside. A tooltip that hides the instant the pointer leaves the trigger fails, because the user can never reach it.",
  },
  {
    name: "Persistent",
    summary: "The content stays visible until the user is done with it.",
    detail:
      "The additional content remains visible until the hover or focus trigger is removed, the user dismisses it, or its information is no longer valid. In other words: do not auto-hide a tooltip on a timer. People who read slowly, use magnification, or are distracted mid-read need the content to stay put for as long as they keep hovering or keep focus on the trigger.",
  },
]

const faqs = [
  {
    q: "What does WCAG 1.4.13 Content on Hover or Focus require?",
    a: "It governs additional content that appears when the user hovers over or keyboard-focuses an element — tooltips, hover-triggered menus, custom popovers, and definition popups. When that content appears and is not controlled by the browser itself, it must meet three conditions: it must be Dismissible (removable without moving the pointer or focus, usually with the Escape key), Hoverable (the pointer can move onto the popup without it disappearing), and Persistent (it stays visible until the trigger is removed, the user dismisses it, or the information is no longer valid). It is a Level AA success criterion introduced in WCAG 2.1 and carried into WCAG 2.2.",
  },
  {
    q: "Does the HTML title attribute satisfy 1.4.13?",
    a: "No. The native title attribute tooltip is one of the worst options for accessibility. It is not Dismissible (you cannot press Escape to remove it), it is not Hoverable (moving the pointer toward it makes it vanish), it appears only on mouse hover so it never shows for keyboard users, it is invisible to most touch users, and its styling and timing are entirely uncontrollable. Use a custom tooltip that you can make Dismissible, Hoverable, and Persistent instead, and reference it with aria-describedby.",
  },
  {
    q: "What is the difference between hover content and a tooltip role?",
    a: "1.4.13 is about the behaviour of any content that appears on hover or focus, regardless of what ARIA role it uses. A true ARIA tooltip (role=\"tooltip\", referenced by aria-describedby) is one common case, but hover-triggered navigation menus, rich popovers with links, and definition cards are all covered too. The role tells assistive technology what the popup is; 1.4.13 makes sure that, once it appears, sighted users — especially those who magnify the screen — can actually reach, read, and dismiss it.",
  },
  {
    q: "Do I need a dismiss mechanism for every tooltip?",
    a: "Not always. The Dismissible condition has an exception: content that does not obscure or replace other content does not need a separate dismiss mechanism, and neither does content that communicates an input error. If your tooltip is small and floats in whitespace where it covers nothing the user needs, you can skip the Escape handler — though adding one is still good practice and costs almost nothing. Hoverable and Persistent, however, still apply.",
  },
  {
    q: "Does 1.4.13 apply to content triggered by a click instead of hover?",
    a: "No. 1.4.13 only covers content triggered by pointer hover or keyboard focus. Content that appears on click, tap, or Enter/Space activation is out of scope for this criterion — though it still has to meet other requirements such as 2.1.1 Keyboard and 4.1.2 Name, Role, Value. The trap to avoid is a control that shows content on hover only, with no click or focus equivalent, which also risks failing keyboard operability.",
  },
  {
    q: "How is 1.4.13 different from 1.4.10 Reflow and 2.4.11 Focus Not Obscured?",
    a: "They are related low-vision and focus criteria but test different things. 1.4.10 Reflow is about content adapting to a 320px viewport without two-dimensional scrolling. 2.4.11 Focus Not Obscured is about the focused element not being hidden behind sticky content. 1.4.13 is specifically about the behaviour of content that pops up on hover or focus — that a magnifier user can reach it, keep it open, and clear it away. A robust design considers all three together.",
  },
]

export default function WCAG1413Page() {
  return (
    <>
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "WCAG Success Criteria", url: "https://accessibility.build/wcag" },
          {
            name: "1.4.13 Content on Hover or Focus",
            url: "https://accessibility.build/wcag/1-4-13",
          },
        ]}
      />

      <ArticleStructuredData
        headline="WCAG 1.4.13 Content on Hover or Focus: The Complete Accessible Tooltip Guide"
        description="The definitive guide to WCAG 1.4.13 Content on Hover or Focus: the Dismissible, Hoverable, and Persistent conditions for tooltips and hover menus, why the title attribute fails, code examples, testing methods, and common mistakes."
        author={{
          name: "Accessibility.build Team",
          url: "https://accessibility.build/about",
        }}
        publisher={{
          name: "Accessibility.build",
          logo: "https://accessibility.build/android-chrome-512x512.png",
        }}
        datePublished="2026-07-06"
        dateModified="2026-07-06"
        image="https://accessibility.build/og-image.png"
        url="https://accessibility.build/wcag/1-4-13"
        wordCount={2900}
        keywords={[
          "WCAG 1.4.13",
          "Content on Hover or Focus",
          "accessible tooltip",
          "dismissible hoverable persistent",
          "title attribute",
          "aria-describedby",
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
                    1.4.13 Content on Hover or Focus
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
                Critical for magnifier users
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
              WCAG 1.4.13: Content on Hover or Focus
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              When extra content appears because a user{" "}
              <strong className="text-slate-900 dark:text-white">
                hovers over or keyboard-focuses an element
              </strong>{" "}
              — a tooltip, a hover menu, a popover — that content must be
              Dismissible, Hoverable, and Persistent. In plain terms: the user
              can clear it away, move the pointer onto it, and keep it open long
              enough to read. Get these three rules wrong and tooltips become a
              trap for anyone who magnifies the screen or cannot hold a pointer
              perfectly still.
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
              Where receiving and then removing pointer hover or keyboard focus
              triggers additional content to become visible and then hidden, the
              following are true: the content is Dismissible, Hoverable, and
              Persistent — except where the visual presentation of the
              additional content is controlled by the user agent and is not
              modified by the author.
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
                  Why hover and focus content matters
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#what">
                  The three conditions
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#title">
                  The title attribute trap
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
              Why hover and focus content matters
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Tooltips and hover popups look harmless, but they are one of the
              most common ways to accidentally lock people out of information.
              Picture someone using screen magnification at 400%. Only a small
              slice of the page is visible at once, and moving the mouse toward a
              tooltip means moving across the screen. If the tooltip disappears
              the moment the pointer leaves the trigger, the user can never reach
              it — the content is visible in theory and unreachable in practice.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              The same problem hits people with tremors or limited fine motor
              control, who cannot hold the pointer perfectly still on a tiny
              trigger, and people who read slowly and need the content to stay on
              screen. A tooltip that vanishes on a timer, jumps away as the
              pointer moves, or covers the paragraph the user was reading with no
              way to clear it turns a small convenience into a real barrier.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              1.4.13 fixes this with three narrow, testable rules. Meet them and
              your tooltips, hover menus, and popovers stay usable for everyone —
              not just people using a precise mouse on a full-size screen.
            </p>
          </section>

          {/* What */}
          <section aria-labelledby="what" className="mb-12">
            <h2
              id="what"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              The three conditions
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              Whenever hover or focus reveals author-styled content, that content
              must satisfy all three of the following. (Content whose entire
              appearance is controlled by the browser — like the native focus
              ring — is exempt.)
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
                <strong>Rule of thumb:</strong> reveal the popup on both hover{" "}
                <em>and</em> focus, let{" "}
                <code className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/40 font-mono text-sm">
                  Escape
                </code>{" "}
                close it, keep it open while the pointer is over either the
                trigger or the popup, and never hide it on a timer. That single
                pattern satisfies Dismissible, Hoverable, and Persistent at once.
              </p>
            </div>
          </section>

          {/* The title attribute trap */}
          <section aria-labelledby="title" className="mb-12">
            <h2
              id="title"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              The <code className="text-2xl">title</code> attribute trap
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              The quickest way to add a &quot;tooltip&quot; in HTML is the native{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                title
              </code>{" "}
              attribute — and it is almost always the wrong choice. The
              browser-drawn title tooltip fails users in several ways at once:
            </p>
            <ul className="space-y-3 mb-2">
              {[
                "It is not Dismissible — there is no way to press Escape and clear it while keeping the pointer where it is.",
                "It is not Hoverable — try to move the pointer toward the title tooltip and it disappears.",
                "It appears only on mouse hover, so keyboard users and many screen reader users never see it at all.",
                "It is invisible to touch users — there is no hover on a touchscreen.",
                "Its timing and appearance are uncontrollable — it often auto-hides after a few seconds and cannot be styled for contrast or size.",
              ].map((point) => (
                <li
                  key={point}
                  className="flex gap-3 rounded-lg border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-4"
                >
                  <span aria-hidden="true" className="text-rose-500 font-bold">
                    ✗
                  </span>
                  <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4">
              If a control only needs an accessible name, use{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                aria-label
              </code>{" "}
              or visible text, not{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                title
              </code>
              . If you genuinely need a tooltip that appears on hover and focus,
              build a custom one you can make Dismissible, Hoverable, and
              Persistent, and connect it to its trigger with{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                aria-describedby
              </code>
              .
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
              An accessible tooltip: markup
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Give the trigger and the tooltip a shared relationship with{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                aria-describedby
              </code>
              , mark the popup with{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                role=&quot;tooltip&quot;
              </code>
              , and wrap both in a container so the pointer can travel from one to
              the other without leaving the hover zone.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<span class="tooltip-wrapper">
  <button
    type="button"
    class="tooltip-trigger"
    aria-describedby="pw-tip"
  >
    Password requirements
  </button>

  <!-- Persistent + Hoverable: lives next to the trigger,
       inside the same hover container -->
  <span role="tooltip" id="pw-tip" class="tooltip" hidden>
    At least 12 characters, including a number and a symbol.
  </span>
</span>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Hoverable and Persistent with CSS
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Show the tooltip when either the trigger or the tooltip itself is
              hovered or focused. Because the wrapper covers both, the pointer can
              move onto the tooltip without it closing, and it stays visible for
              as long as the user keeps hovering.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`.tooltip {
  position: absolute;
  /* small overlap so there is no dead gap to cross */
  margin-top: 4px;
}

/* Hoverable: staying within the wrapper keeps it open.
   Persistent: no timer hides it — only leaving does. */
.tooltip-wrapper:hover .tooltip,
.tooltip-wrapper:focus-within .tooltip {
  display: block;
}

/* Focus support: the tooltip must also appear for
   keyboard users, not just on mouse hover. */
.tooltip-trigger:focus-visible + .tooltip {
  display: block;
}`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Dismissible with the Escape key
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              When the tooltip could overlap other content, let the user clear it
              with{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                Escape
              </code>{" "}
              without moving hover or focus. A tiny script toggles a{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                data-dismissed
              </code>{" "}
              flag that your CSS respects.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`const wrapper = document.querySelector(".tooltip-wrapper");

// Dismissible: Escape hides the popup without moving
// the pointer or focus off the trigger.
wrapper.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    wrapper.setAttribute("data-dismissed", "true");
  }
});

// Re-enable next time hover/focus leaves and returns.
wrapper.addEventListener("mouseleave", () =>
  wrapper.removeAttribute("data-dismissed"),
);
wrapper.addEventListener("focusout", () =>
  wrapper.removeAttribute("data-dismissed"),
);`}</code>
            </pre>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`/* Respect the dismissed state */
.tooltip-wrapper[data-dismissed="true"] .tooltip {
  display: none;
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
                "Using the native title attribute as a tooltip — it fails Dismissible and Hoverable, and never appears for keyboard or touch users.",
                "A tooltip that hides the instant the pointer leaves the trigger, so a magnifier user can never move onto it (fails Hoverable).",
                "Auto-hiding the popup on a timer after a few seconds, before a slow reader has finished (fails Persistent).",
                "Revealing content on hover only, with no keyboard-focus equivalent, so keyboard users never get it at all.",
                "A large hover popup that covers the text the user was reading, with no Escape or dismiss mechanism (fails Dismissible).",
                "A gap between the trigger and the popup that closes the tooltip mid-travel — leave a small overlap so the hover zone is continuous.",
                "Putting interactive content (links, buttons) in a tooltip the user can never reach because it disappears on the way there.",
                "Trapping keyboard focus inside a hover menu, or opening it with no way to close it via the keyboard.",
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
              How to test for 1.4.13
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "Find every hover or focus popup",
                  d: "Move the mouse across the page and Tab through it, watching for anything that appears — tooltips, hover menus, definition popups, icon labels. Each one you find needs to pass all three conditions.",
                },
                {
                  t: "Test Hoverable: move onto the popup",
                  d: "Hover the trigger, then move the pointer slowly onto the popup content. It must stay open the whole way. If it disappears as soon as the pointer leaves the trigger, it fails Hoverable.",
                },
                {
                  t: "Test Persistent: wait and read",
                  d: "Hover a trigger and leave the pointer there. The content must remain visible — it should not vanish on a timer. It should only close when you move hover or focus away, or dismiss it.",
                },
                {
                  t: "Test Dismissible: press Escape",
                  d: "With a popup showing (especially one that overlaps other content), press Escape without moving the mouse or focus. The popup should hide. If it cannot be dismissed and it obscures content, it fails Dismissible.",
                },
                {
                  t: "Test with the keyboard and magnification",
                  d: "Tab to the trigger and confirm the same content appears on focus, not just hover. Then zoom the browser to 400% and repeat — magnifier users are exactly who this criterion protects.",
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
              Content on Hover or Focus is a manual check — automated tools cannot
              tell whether a popup is reachable or dismissible. Pair a keyboard
              and magnification walkthrough with the{" "}
              <Link
                href="/guides/keyboard-accessibility"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Keyboard Accessibility Guide
              </Link>{" "}
              and scan a live page with the{" "}
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
          <section aria-labelledby="related-criteria" className="mb-12">
            <h2
              id="related-criteria"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Related success criteria
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  <Link
                    href="/wcag/2-4-7"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    2.4.7 Focus Visible
                  </Link>{" "}
                  — AA
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  Because 1.4.13 content must appear on focus too, the trigger
                  needs a visible focus indicator so keyboard users know where the
                  popup will come from.
                </p>
              </div>
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
                  A partner low-vision criterion: 2.4.11 keeps the focused element
                  from being hidden by other content, while 1.4.13 keeps hover and
                  focus popups reachable and dismissible.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  <Link
                    href="/wcag/1-4-10"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    1.4.10 Reflow
                  </Link>{" "}
                  — AA
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  Reflow protects the same magnifier users. A popup that reflows
                  poorly or scrolls off-screen at 400% zoom undermines both this
                  and 1.4.13.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  <Link
                    href="/wcag/4-1-2"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    4.1.2 Name, Role, Value
                  </Link>{" "}
                  — A
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  A custom tooltip or popover needs the right role and an
                  association (such as aria-describedby) so assistive technology
                  announces it — the semantic side of the same widget.
                </p>
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-5">
              Browse every criterion in the{" "}
              <Link
                href="/wcag"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                WCAG Success Criteria hub
              </Link>{" "}
              or work through the full{" "}
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
        </article>

        {/* Related content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <RelatedContent
            content="content on hover or focus accessible tooltip tooltip accessibility dismissible hoverable persistent hover menu popover title attribute aria-describedby escape to dismiss keyboard accessibility focus visible magnification low vision WCAG 1.4.13 Level AA"
            maxItems={6}
          />
        </section>
      </div>
    </>
  )
}
