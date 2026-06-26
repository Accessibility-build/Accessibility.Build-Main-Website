import type { Metadata } from "next"
import Link from "next/link"
import {
  ArticleStructuredData,
  BreadcrumbStructuredData,
} from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"

export const metadata: Metadata = {
  title:
    "WCAG 2.4.7 Focus Visible — Keyboard Focus Indicators Guide (Level AA)",
  description:
    "Complete guide to WCAG 2.4.7 Focus Visible. Learn why a visible keyboard focus indicator is required, how to style :focus-visible without breaking accessibility, never use outline:none, contrast and thickness expectations, code examples, testing methods, and common mistakes.",
  keywords: [
    "WCAG 2.4.7",
    "Focus Visible",
    "keyboard focus indicator",
    "focus-visible",
    "focus ring",
    "outline none accessibility",
    "visible focus",
    "focus styles CSS",
    "keyboard accessibility",
    "focus management",
    "Level AA",
    "WCAG 2.2",
    "focus indicator contrast",
    "tab key focus",
  ],
  alternates: {
    canonical: "https://accessibility.build/wcag/2-4-7",
  },
  openGraph: {
    title:
      "WCAG 2.4.7 Focus Visible — Keyboard Focus Indicators Guide (Level AA)",
    description:
      "The definitive guide to WCAG 2.4.7 Focus Visible: why every interactive element needs a visible focus indicator, how to use :focus-visible, never remove the outline, contrast expectations, copy-ready CSS, and testing.",
    url: "https://accessibility.build/wcag/2-4-7",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: "https://accessibility.build/og-image.png",
        width: 1200,
        height: 630,
        alt: "WCAG 2.4.7 Focus Visible guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WCAG 2.4.7 Focus Visible — Keyboard Focus Indicators",
    description:
      "Keep a visible keyboard focus indicator on every interactive element: :focus-visible, never outline:none, contrast and thickness, and how to test for WCAG 2.4.7 Level AA.",
  },
}

const requirements = [
  {
    name: "A visible indicator when an element has keyboard focus",
    summary: "Focus must be shown, not hidden.",
    detail:
      "Any keyboard-operable user interface has a mode of operation where the keyboard focus indicator is visible. When a user tabs to a link, button, input, or any focusable control, something on screen must change to show exactly where focus now sits — the default browser focus ring, a custom outline, a background change, or another clearly perceivable cue.",
  },
  {
    name: "It applies to every focusable component",
    summary: "Not just links — buttons, inputs, custom widgets, all of them.",
    detail:
      "The indicator must appear on every component that can receive keyboard focus, including custom controls you have built with tabindex, ARIA widgets like menus and tabs, and form fields. A site that styles focus on links but strips it from buttons or custom components still fails 2.4.7.",
  },
  {
    name: "Visible is the baseline — distinct and strong is the goal",
    summary: "2.4.7 asks for visible; 2.4.11 and 2.4.13 raise the bar.",
    detail:
      "2.4.7 at Level AA only requires that the indicator is visible. WCAG 2.2 adds 2.4.11 Focus Not Obscured (the focused element must not be hidden behind sticky headers or other content) and 2.4.13 Focus Appearance (AAA, defining minimum size and contrast). Designing a strong indicator now satisfies all three at once.",
  },
]

const faqs = [
  {
    q: "What does WCAG 2.4.7 Focus Visible require?",
    a: "WCAG 2.4.7 requires that any keyboard-operable interface has a mode where the keyboard focus indicator is visible. In plain terms: when someone moves through your page with the Tab key, they must always be able to see which element currently has focus. It is a Level AA success criterion, so it applies to the vast majority of legal and contractual accessibility requirements, including the ADA and Section 508.",
  },
  {
    q: "Is it ever acceptable to use outline: none in CSS?",
    a: "Only if you replace the outline with another clearly visible focus indicator. Writing outline: none (or outline: 0) on a focusable element with no replacement removes the one cue keyboard users rely on and fails 2.4.7. If you want a custom look, suppress the default ring and add your own — for example a box-shadow ring, a thicker border, or a background change — scoped to :focus-visible so it shows for keyboard users.",
  },
  {
    q: "What is the difference between :focus and :focus-visible?",
    a: ":focus matches any time an element is focused, including after a mouse click, which is why custom :focus styles sometimes leave a ring lingering after a click and tempt developers to remove it. :focus-visible matches only when the browser's heuristics say a visible indicator is appropriate — typically keyboard navigation — so you can show a strong ring for keyboard users without it appearing on every mouse click. Style :focus-visible for the keyboard indicator and you get the best of both.",
  },
  {
    q: "How much contrast and thickness does the focus indicator need?",
    a: "2.4.7 itself only requires that the indicator is visible; it does not set a numeric contrast or size threshold. The stronger guidance comes from WCAG 2.2: 2.4.11 Focus Not Obscured (AA) requires the focused element is not entirely hidden by other content, and 2.4.13 Focus Appearance (AAA) recommends an area at least as large as a 2px-thick perimeter of the component and a contrast ratio of at least 3:1 against adjacent colours. Aiming for a ring around 2px thick with 3:1 contrast is a good, future-proof default.",
  },
  {
    q: "Does the default browser focus outline satisfy 2.4.7?",
    a: "Yes. The default focus outline that browsers draw is a valid, conformant focus indicator, so the simplest way to pass 2.4.7 is to leave it alone. Problems start when a CSS reset or component library removes it without a replacement. If the default ring clashes with your design, restyle it rather than deleting it — keep an equally or more visible indicator.",
  },
  {
    q: "How is 2.4.7 different from 2.4.3 Focus Order and 2.1.1 Keyboard?",
    a: "They are the keyboard-access family. 2.1.1 Keyboard requires that everything is operable by keyboard at all. 2.4.3 Focus Order requires that focus moves through the page in a logical, meaningful sequence. 2.4.7 Focus Visible requires that, as focus moves, the user can always see where it is. You need all three: reachable by keyboard, in a sensible order, and visibly indicated at every step.",
  },
]

export default function WCAG247Page() {
  return (
    <>
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "WCAG Success Criteria", url: "https://accessibility.build/wcag" },
          {
            name: "2.4.7 Focus Visible",
            url: "https://accessibility.build/wcag/2-4-7",
          },
        ]}
      />

      <ArticleStructuredData
        headline="WCAG 2.4.7 Focus Visible: The Complete Keyboard Focus Indicator Guide"
        description="The definitive guide to WCAG 2.4.7 Focus Visible: why a visible keyboard focus indicator is required on every focusable element, how to use :focus-visible, why you should never remove the outline, contrast and thickness expectations, code examples, testing methods, and common mistakes."
        author={{
          name: "Accessibility.build Team",
          url: "https://accessibility.build/about",
        }}
        publisher={{
          name: "Accessibility.build",
          logo: "https://accessibility.build/android-chrome-512x512.png",
        }}
        datePublished="2026-06-26"
        dateModified="2026-06-26"
        image="https://accessibility.build/og-image.png"
        url="https://accessibility.build/wcag/2-4-7"
        wordCount={2900}
        keywords={[
          "WCAG 2.4.7",
          "Focus Visible",
          "keyboard focus indicator",
          "focus-visible",
          "outline none",
          "focus ring",
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
                    2.4.7 Focus Visible
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
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                Essential for keyboard users
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
              WCAG 2.4.7: Focus Visible
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              When someone navigates your page with the keyboard, they must
              always be able to{" "}
              <strong className="text-slate-900 dark:text-white">
                see which element has focus
              </strong>
              . This Level AA criterion is what stops keyboard navigation from
              becoming a blind guess — strip the focus ring and a sighted
              keyboard user, a switch-device user, and anyone who cannot use a
              mouse loses all sense of where they are on the page.
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
              Any keyboard operable user interface has a mode of operation where
              the keyboard focus indicator is visible.
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
                  Why a visible focus indicator matters
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#what">
                  What 2.4.7 actually requires
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#outline">
                  The outline: none trap
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#focus-visible">
                  :focus vs :focus-visible
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
              Why a visible focus indicator matters
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              For anyone who navigates without a mouse — keyboard-only users,
              people using switch devices or sip-and-puff controls, many people
              with motor or visual disabilities, and plenty of power users — the
              focus indicator is the cursor. It is the single piece of feedback
              that answers &quot;where am I, and what will Enter or Space do
              right now?&quot; Remove it and the page becomes unusable: pressing
              Tab moves focus invisibly, and the only way to find a button is to
              tab blindly and hope.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              This is one of the most common and most damaging accessibility
              failures on the web, and it is almost always self-inflicted: a CSS
              reset or a designer&apos;s dislike of the &quot;ugly&quot; default
              ring leads someone to write{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                outline: none
              </code>{" "}
              with nothing to replace it. The fix costs a few lines of CSS, and a
              strong, on-brand focus style is a usability win for everyone, not
              just an act of compliance.
            </p>
          </section>

          {/* What */}
          <section aria-labelledby="what" className="mb-12">
            <h2
              id="what"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              What 2.4.7 actually requires
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              The criterion has a narrow, testable core. Meet these and keyboard
              navigation stays usable.
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
                <strong>Note:</strong> The phrase &quot;a mode of operation&quot;
                means the indicator does not have to be visible during a mouse
                click — it must be visible when the user is operating the
                interface by keyboard. That is exactly what{" "}
                <code className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/40 font-mono text-sm">
                  :focus-visible
                </code>{" "}
                gives you, which is why it is the modern way to satisfy 2.4.7.
              </p>
            </div>
          </section>

          {/* The outline: none trap */}
          <section aria-labelledby="outline" className="mb-12">
            <h2
              id="outline"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              The <code className="text-2xl">outline: none</code> trap
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              By far the most common way to fail 2.4.7 is to remove the default
              focus outline without putting anything back. It breaks in several
              ways:
            </p>
            <ul className="space-y-3 mb-2">
              {[
                "outline: none (or outline: 0) on a focusable element with no replacement deletes the only cue keyboard users have for where they are — an instant, total failure of 2.4.7.",
                "A blanket reset like *:focus { outline: none } or :focus { outline: 0 } strips focus from every control on the site at once, including ones you never styled.",
                "Component libraries and CSS resets (older Normalize/reset stylesheets, some UI kits) sometimes ship outline removal by default — check what your dependencies do, not just your own CSS.",
                "Setting only a faint colour change (for example a 1px border that barely differs from the resting state) is technically present but practically invisible, and reviewers will treat it as a failure.",
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
              If you must remove the default ring for design reasons, the rule is
              simple:{" "}
              <strong className="text-slate-900 dark:text-white">
                always replace it with an equally or more visible indicator
              </strong>{" "}
              — a custom{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                outline
              </code>
              , a{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                box-shadow
              </code>{" "}
              ring, a thicker border, or a clear background change — and scope it
              to{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                :focus-visible
              </code>
              .
            </p>
          </section>

          {/* :focus vs :focus-visible */}
          <section aria-labelledby="focus-visible" className="mb-12">
            <h2
              id="focus-visible"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              <code className="text-2xl">:focus</code> vs{" "}
              <code className="text-2xl">:focus-visible</code>
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              The reason developers reach for{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                outline: none
              </code>{" "}
              is usually that they dislike seeing a focus ring after a mouse
              click. The modern fix is the{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                :focus-visible
              </code>{" "}
              pseudo-class, which lets you keep a strong indicator for keyboard
              users without it appearing on every click.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  <code>:focus</code>
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Matches whenever an element is focused — including immediately
                  after a mouse click. Styling{" "}
                  <code className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-xs">
                    :focus
                  </code>{" "}
                  alone can leave a ring lingering after a click, which is what
                  tempts people to remove it entirely.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  <code>:focus-visible</code>
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Matches only when the browser decides a visible indicator is
                  appropriate — in practice, keyboard navigation. This is exactly
                  the &quot;mode of operation&quot; 2.4.7 talks about, and it is
                  now supported in every modern browser.
                </p>
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-5">
              The practical pattern: keep a sensible{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                :focus
              </code>{" "}
              fallback for older engines, then layer a strong, on-brand ring on{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                :focus-visible
              </code>
              . Never remove the indicator without adding one back.
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
              A strong, modern focus style with :focus-visible
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              The core pattern: a clearly visible ring for keyboard users, kept
              off the screen during mouse clicks. The{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                outline-offset
              </code>{" "}
              gives the ring breathing room so it stays visible against the
              control.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`/* A visible, on-brand indicator for keyboard users */
:focus-visible {
  outline: 3px solid #1d4ed8;   /* >= 3:1 against the background */
  outline-offset: 2px;          /* lift it off the control */
  border-radius: 2px;
}

/* Optional: hide the ring for mouse users only,
   while keeping a fallback for browsers without
   :focus-visible support. */
:focus:not(:focus-visible) {
  outline: none;
}`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              A box-shadow ring that hugs rounded corners
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              When a control has a border radius, a{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                box-shadow
              </code>{" "}
              ring follows the curve neatly. Combine it with a transparent
              outline so the indicator still shows in Windows High Contrast Mode,
              where box-shadows are dropped.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`.button:focus-visible {
  /* Visible ring that follows rounded corners */
  box-shadow: 0 0 0 3px #fff, 0 0 0 6px #1d4ed8;
  /* Transparent outline = a visible ring in forced-colors mode */
  outline: 3px solid transparent;
  outline-offset: 2px;
}`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              A global, accessible default with Tailwind CSS
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              If you use a utility framework, set one consistent keyboard focus
              ring across the whole app rather than removing focus per component.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- Per element: a visible ring only for keyboard focus -->
<button
  class="rounded-md bg-blue-700 px-4 py-2 text-white
         focus-visible:outline focus-visible:outline-2
         focus-visible:outline-offset-2
         focus-visible:outline-blue-900"
>
  Save changes
</button>

/* Or set a sensible default once, in your base layer */
@layer base {
  :focus-visible {
    outline: 3px solid theme(colors.blue.700);
    outline-offset: 2px;
  }
}`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Respecting Windows High Contrast / forced colors
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              In forced-colors mode the operating system overrides your colours.
              Use the system{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                Highlight
              </code>{" "}
              colour so the focus ring honours the user&apos;s theme.
            </p>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`@media (forced-colors: active) {
  :focus-visible {
    outline: 3px solid Highlight;
    outline-offset: 2px;
  }
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
                "Writing outline: none (or a global *:focus { outline: 0 }) with nothing to replace it — the single most common cause of a 2.4.7 failure.",
                "Styling focus only on links while leaving buttons, inputs, or custom widgets with no visible indicator.",
                "Removing focus from custom controls (divs with tabindex, ARIA menus, tabs) that the browser would never style by default.",
                "A focus indicator so faint it is effectively invisible — a 1px colour shift that does not clearly stand out from the resting state.",
                "A focus ring that is hidden behind a sticky header, toolbar, or cookie banner when the element receives focus (also a 2.4.11 failure).",
                "Relying on a box-shadow ring only, which disappears in Windows High Contrast Mode because forced colors removes shadows.",
                "Inheriting outline removal from a CSS reset or component library and never checking what the dependency actually does.",
                "Showing the keyboard ring on mouse clicks too, then deleting it to 'clean it up' instead of scoping the style to :focus-visible.",
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
              How to test for 2.4.7
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "Tab through the whole page",
                  d: "Put the mouse away and press Tab from the top of the page to the bottom. At every stop — links, buttons, inputs, custom widgets — you must be able to see clearly which element now has focus. If focus ever vanishes, you have a failure.",
                },
                {
                  t: "Watch for elements that lose the ring",
                  d: "Pay special attention to custom buttons, icon-only controls, dropdowns, tabs, and anything built with divs and tabindex. These are where developers most often strip or forget the indicator.",
                },
                {
                  t: "Check the indicator against its background",
                  d: "Make sure the focus style stands out from the resting state and the surrounding colours. Aim for a ring around 2px thick with at least 3:1 contrast against adjacent colours to also satisfy the stronger WCAG 2.2 guidance.",
                },
                {
                  t: "Test sticky and overlay content",
                  d: "Tab to elements near sticky headers, footers, and dialogs. Confirm the focused element is not hidden behind them — that is the related 2.4.11 Focus Not Obscured criterion.",
                },
                {
                  t: "Verify forced-colors / high contrast",
                  d: "Turn on Windows High Contrast Mode (or emulate forced-colors in DevTools) and tab through again. The focus indicator must still be visible — outline-based rings survive, box-shadow-only rings do not.",
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
              Focus Visible is a manual check — automated tools cannot reliably
              judge whether a ring is &quot;visible enough.&quot; Pair a keyboard
              walkthrough with the{" "}
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
                    href="/wcag/2-1-1"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    2.1.1 Keyboard
                  </Link>{" "}
                  — A
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  Requires that all functionality is operable by keyboard in the
                  first place. 2.4.7 then makes sure the user can see where that
                  keyboard focus has landed.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  <Link
                    href="/wcag/2-4-3"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    2.4.3 Focus Order
                  </Link>{" "}
                  — A
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  Requires focus to move through the page in a logical, meaningful
                  sequence. Order and visibility work together: a sensible path
                  the user can actually see.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  2.4.11 Focus Not Obscured (Minimum) — AA
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  New in WCAG 2.2: the focused element must not be entirely hidden
                  by other content such as sticky headers or cookie banners. The
                  natural next step after making focus visible.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  <Link
                    href="/wcag/1-4-3"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    1.4.3 Contrast (Minimum)
                  </Link>{" "}
                  — AA
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  Governs text and UI contrast generally. The same thinking
                  applies to a focus ring — it has to stand out clearly from its
                  surroundings to be useful.
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
            content="focus visible keyboard focus indicator focus ring focus-visible outline none visible focus keyboard accessibility focus management tab key WCAG 2.4.7 Level AA focus styles CSS focus order screen reader"
            maxItems={6}
          />
        </section>
      </div>
    </>
  )
}
