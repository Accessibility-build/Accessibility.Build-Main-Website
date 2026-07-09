import type { Metadata } from "next"
import Link from "next/link"
import WCAGSEOEnhancements from "@/components/wcag/seo-enhancements"
import WCAGBreadcrumb from "@/components/wcag/breadcrumb"
import { CriterionLinks } from "@/components/wcag/criterion-links"
import { RelatedContent } from "@/components/seo/related-content"

export const metadata: Metadata = {
  title: "WCAG 3.2.1 On Focus — No Surprise Context Changes",
  description:
    "Complete guide to WCAG 3.2.1 On Focus. What a change of context is, why focusing a control must never trigger one, code examples of focus traps and popups, and how to test.",
  keywords: [
    "WCAG 3.2.1",
    "On Focus",
    "change of context",
    "focus accessibility",
    "onfocus popup",
    "keyboard navigation",
    "predictable",
    "focus opens window",
    "screen reader focus",
    "unexpected navigation",
    "Level A",
    "WCAG 2.2",
    "understandable",
  ],
  alternates: {
    canonical: "/wcag/3-2-1",
  },
  openGraph: {
    type: "website",
    title: "WCAG 3.2.1 On Focus — No Surprise Context Changes",
    description:
      "Receiving focus must never launch windows, move focus, or navigate. What counts as a change of context under WCAG 3.2.1, code examples, and how to test.",
    url: "/wcag/3-2-1",
    images: [
      {
        url: "/api/og?title=WCAG%203.2.1%20On%20Focus&section=WCAG",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WCAG 3.2.1 On Focus — No Surprise Context Changes",
    description:
      "Tabbing through a page must be safe. WCAG 3.2.1 forbids focus alone from opening windows, moving focus, or navigating — examples, failures, and testing.",
  },
}

const faqs = [
  {
    q: "What does WCAG 3.2.1 On Focus require?",
    a: "When any user interface component receives focus, it must not initiate a change of context. Simply tabbing to (or programmatically focusing) a link, button, field, or widget must never open a new window, move focus somewhere else, navigate to another page, submit a form, or substantially rearrange the page. Focus must be a safe, read-only operation: users explore with it, then act deliberately with Enter, Space, or a click. It is a Level A criterion, part of Guideline 3.2 Predictable, present since WCAG 2.0.",
  },
  {
    q: "What exactly is a 'change of context'?",
    a: "WCAG defines it as a major change in the content of the page that, if made without user awareness, can disorient users who cannot view the whole page at once. Four kinds count: a change of user agent (e.g. another application takes over), a change of viewport (new window or tab, focus jumping elsewhere), a change of focus itself, and a change of content that alters the meaning of the page (loading a new page, radically rearranging content). Smaller updates — an outline appearing, a tooltip showing, text being revealed nearby — are changes of content but not changes of context.",
  },
  {
    q: "Is showing a tooltip or hint on focus a failure?",
    a: "No. Content appearing on focus is fine as long as the user's context is preserved: focus stays where it is, no window opens, the page's meaning does not change. Tooltips, inline hints, and expanding descriptions are legitimate focus behaviors — they are governed by 1.4.13 Content on Hover or Focus, which regulates how such content must be dismissible and persistent, not whether it may appear. A modal dialog opening on focus, by contrast, moves focus and changes context, so it fails 3.2.1.",
  },
  {
    q: "Why does On Focus matter so much for keyboard and screen reader users?",
    a: "Because for them, focus is how they read the page. A sighted mouse user only points at things they intend to use; a keyboard user must move focus through elements just to discover what exists, and a screen reader user's focus movement is their reading position. If merely landing on a control fires an action, these users cannot explore safely — every Tab press becomes a gamble. Users with cognitive disabilities and low vision (who may not see the popup or the new tab appear) are similarly disoriented by context changes they never requested.",
  },
  {
    q: "Does 3.2.1 forbid moving focus into a dialog I open on a click?",
    a: "No. The criterion restricts what happens when a component receives focus, not what happens on activation. Clicking a button (or pressing Enter on it) is an explicit user action, and opening a dialog then moving focus into it is expected, appropriate behavior. The failure pattern is context change triggered by focus alone — tabbing onto the button and having the dialog leap open before the user pressed anything.",
  },
  {
    q: "How is 3.2.1 different from 3.2.2 On Input?",
    a: "They are siblings in Guideline 3.2 Predictable, covering successive moments of interaction. 3.2.1 covers receiving focus: tabbing onto a component must change nothing. 3.2.2 covers changing a setting: typing in a field, picking a select option, or toggling a checkbox must not automatically cause a change of context unless users were warned beforehand. Together they guarantee that both exploring the page and operating its controls are predictable, with actions only committed by explicit activation.",
  },
]

export default function WCAG321Page() {
  return (
    <>
      <WCAGSEOEnhancements
        title="WCAG 3.2.1 On Focus"
        description="When any user interface component receives focus, it does not initiate a change of context"
        criteria="3.2.1"
        level="A"
        principle="Understandable"
        guideline="Predictable"
        url="https://accessibility.build/wcag/3-2-1"
        category="Predictable"
        wordCount={2700}
        timeToRead={9}
        hasInteractiveDemo={false}
        relatedCriteria={["3.2.2", "2.4.3", "2.4.7", "1.4.13"]}
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
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <WCAGBreadcrumb items={[]} current="3.2.1 On Focus" />

          {/* Header */}
          <header className="mb-12">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                Level A
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Principle 3: Understandable
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                Guideline 3.2 Predictable
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
              WCAG 3.2.1: On Focus
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              Keyboard users move focus through a page just to see what is there. That
              exploration has to be safe. This criterion requires that{" "}
              <strong className="text-slate-900 dark:text-white">
                merely focusing a component never initiates a change of context
              </strong>{" "}
              — no new windows, no stolen focus, no navigation, no form submission.
              Looking is not the same as acting; focus is looking.
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
              When any user interface component receives focus, it does not initiate a
              change of context.
            </blockquote>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4 text-sm">
              One sentence, no exceptions. &ldquo;Change of context&rdquo; is a defined
              term covering four kinds of major change: user agent, viewport, focus,
              and content that changes the meaning of the page. Content changes that
              do <em>not</em> alter the page&rsquo;s meaning — a tooltip, an outline,
              revealed hint text — are allowed on focus.
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
                <a className="hover:underline" href="#who">
                  Who this helps
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#context">
                  What is a change of context?
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#examples">
                  Pass and fail examples
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

          {/* Who this helps */}
          <section aria-labelledby="who" className="mb-12">
            <h2
              id="who"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Who this helps
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              {[
                {
                  t: "Keyboard-only users",
                  d: "Tab and Shift+Tab are how they survey a page. If focusing a control fires an action, every keystroke risks launching something they never chose — navigation becomes a minefield.",
                },
                {
                  t: "Screen reader users",
                  d: "Focus position is reading position. A context change on focus yanks them to a different window or page mid-sentence, with no visual cues to reconstruct where they went.",
                },
                {
                  t: "People with low vision",
                  d: "Magnification shows a small slice of the page. A new window or focus jump happening off-screen is invisible — the user simply finds themselves lost.",
                },
                {
                  t: "People with cognitive or attention disabilities",
                  d: "Predictability is load-bearing. Interfaces that mutate on mere focus break the mental model that exploring is safe and acting is deliberate.",
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
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Remember that focus arrives in more ways than a deliberate Tab press:
              scripts call{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                element.focus()
              </code>
              , screen readers move focus while reading, and browsers restore focus
              after dialogs close. A focus handler with side effects fires in all of
              those situations — which is exactly why it must stay side-effect free.
            </p>
          </section>

          {/* Change of context */}
          <section aria-labelledby="context" className="mb-12">
            <h2
              id="context"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              What is a &ldquo;change of context&rdquo;?
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              WCAG defines a change of context as a major change that, if made without
              user awareness, can disorient users who cannot view the whole page at
              once. Four categories qualify:
            </p>
            <ul className="space-y-3 mb-6">
              {[
                {
                  t: "Change of user agent",
                  d: "Another application or browser takes over the interaction.",
                },
                {
                  t: "Change of viewport",
                  d: "A new window or tab opens, or the view jumps so different content fills the screen.",
                },
                {
                  t: "Change of focus",
                  d: "Focus moves to a different element than the one the user reached — including into a spawned dialog.",
                },
                {
                  t: "Content change that changes the meaning of the page",
                  d: "Navigation to a new page, form submission, or a substantial rearrangement of content.",
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
                    <strong className="text-slate-900 dark:text-white">
                      {item.t}:
                    </strong>{" "}
                    {item.d}
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Equally important is what does <em>not</em> qualify: focus outlines and
              style changes, tooltips and hint text appearing beside the field, an
              accordion label highlighting, live-region announcements. These are
              changes of <em>content</em>, not context. Show all the help you like on
              focus — just do not move the user anywhere. (How hover/focus-triggered
              content must behave is covered by{" "}
              <Link
                href="/wcag/1-4-13"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                1.4.13 Content on Hover or Focus
              </Link>
              .)
            </p>
          </section>

          {/* Pass / fail examples */}
          <section aria-labelledby="examples" className="mb-12">
            <h2
              id="examples"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Pass and fail examples
            </h2>
            <div className="space-y-4">
              <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/20 p-5">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  <span aria-hidden="true" className="text-emerald-600 mr-2">
                    ✓
                  </span>
                  Pass: hint text appears on focus
                </h3>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                  Focusing the password field reveals the password requirements below
                  it. Focus stays in the field, nothing else moves — a content change
                  that helps rather than disorients.
                </p>
              </div>
              <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/20 p-5">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  <span aria-hidden="true" className="text-emerald-600 mr-2">
                    ✓
                  </span>
                  Pass: dialog opens on activation, not focus
                </h3>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                  Tabbing onto &ldquo;Delete account&rdquo; does nothing but show a
                  focus ring. Only pressing Enter or clicking opens the confirmation
                  dialog and moves focus into it. Exploration and action stay
                  separate.
                </p>
              </div>
              <div className="rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-5">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  <span aria-hidden="true" className="text-rose-500 mr-2">
                    ✗
                  </span>
                  Fail: popup window on focus
                </h3>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                  Tabbing onto a promotional link spawns a new window with an offer.
                  The keyboard user was passing through on the way to the navigation —
                  now they are in another window they never asked for.
                </p>
              </div>
              <div className="rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-5">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  <span aria-hidden="true" className="text-rose-500 mr-2">
                    ✗
                  </span>
                  Fail: focus jumps as soon as it lands
                </h3>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                  A form&rsquo;s onfocus handler redirects focus from a
                  &ldquo;disabled-looking&rdquo; field to another element the developer
                  prefers. Screen reader users can now never inspect that field — focus
                  refuses to stay where they put it.
                </p>
              </div>
              <div className="rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-5">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  <span aria-hidden="true" className="text-rose-500 mr-2">
                    ✗
                  </span>
                  Fail: form submits when the last field is focused
                </h3>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                  To &ldquo;streamline&rdquo; checkout, focusing the final input
                  triggers submission of the form. Keyboard users tabbing through to
                  review their entries submit a half-checked order.
                </p>
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
              Never open windows or navigate from a focus handler
            </h3>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- ✗ Fails: receiving focus opens a new window -->
<a href="/offer" onfocus="window.open('/promo', '_blank')">Special offer</a>

<!-- ✗ Fails: receiving focus navigates -->
<input type="text" onfocus="location.href='/signup'" />

<!-- ✓ Passes: focus is inert; action happens only on activation -->
<a href="/offer">Special offer</a>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Reveal help on focus without changing context (React)
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Showing adjacent content on focus is allowed and useful. Focus stays in
              the input; the hint is tied to it with{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                aria-describedby
              </code>
              .
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`function PasswordField() {
  const [showHint, setShowHint] = useState(false)

  return (
    <div>
      <label htmlFor="pw">New password</label>
      <input
        id="pw"
        type="password"
        aria-describedby="pw-hint"
        onFocus={() => setShowHint(true)}   // ✓ content change only
        onBlur={() => setShowHint(false)}
      />
      {showHint && (
        <p id="pw-hint">
          Use at least 12 characters with one number and one symbol.
        </p>
      )}
    </div>
  )
}`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Open dialogs from activation events, not focus events
            </h3>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`// ✗ Fails: tabbing onto the button opens the dialog and moves focus
helpButton.addEventListener("focus", () => {
  helpDialog.showModal() // focus jumps into the dialog uninvited
});

// ✓ Passes: the dialog opens only when the user activates the button
helpButton.addEventListener("click", () => {
  helpDialog.showModal() // moving focus into a user-requested dialog is fine
});
// (click fires for Enter and Space on a native <button> too)`}</code>
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
                "Opening a new window, tab, or modal dialog the moment an element receives focus.",
                "onfocus handlers that call element.focus() on something else, bouncing users away from fields they are trying to inspect.",
                "Submitting a form when a particular field (often the last one) receives focus.",
                "Navigating to another page when a link or menu item is merely focused, before any activation.",
                "Custom dropdowns or comboboxes that expand and move focus into their list as soon as the trigger is tabbed onto.",
                "Focus-triggered content that obscures or replaces the main content so thoroughly the page's meaning changes.",
                "Third-party chat, survey, or ad widgets that grab focus when their container is focused during normal tabbing.",
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
              How to test for 3.2.1
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "Tab through the entire page — and only tab",
                  d: "Starting at the top, press Tab through every focusable element without pressing Enter, Space, or clicking. Watch for anything beyond styling: no new windows, no navigation, no focus jumping, no submissions, no substantial content rearrangement.",
                },
                {
                  t: "Shift+Tab back through",
                  d: "Reverse direction. Focus handlers sometimes behave differently when elements are entered from the other side (e.g. redirect-on-focus loops become obvious).",
                },
                {
                  t: "Watch the focus indicator like a hawk",
                  d: "After each Tab press, confirm focus is on the very next focusable element. If it ever lands somewhere unexpected, an onfocus handler moved it — a change of context.",
                },
                {
                  t: "Grep the code for focus handlers",
                  d: "Search for onfocus, addEventListener('focus'/'focusin'), and framework equivalents (onFocus). Review each: revealing adjacent content is fine; window.open, location changes, form.submit(), or .focus() calls on other elements are failures.",
                },
                {
                  t: "Repeat with a screen reader running",
                  d: "NVDA and VoiceOver move focus differently (virtual cursor, forms mode). Walk the page and confirm no component hijacks the experience when the screen reader focuses it.",
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
              Pair this test with{" "}
              <Link
                href="/wcag/2-4-3"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                2.4.3 Focus Order
              </Link>{" "}
              and{" "}
              <Link
                href="/wcag/2-4-7"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                2.4.7 Focus Visible
              </Link>{" "}
              — one keyboard pass through the page can verify all three. The complete{" "}
              <Link
                href="/checklists/wcag-2-2"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                WCAG 2.2 checklist
              </Link>{" "}
              sequences them for you.
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

          <CriterionLinks number="3.2.1" />
        </article>

        {/* Related content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <RelatedContent
            content="on focus change of context focus accessibility onfocus popup new window keyboard navigation predictable focus order focus visible screen reader focus unexpected navigation WCAG 3.2.1 Level A understandable"
            maxItems={6}
          />
        </section>
      </div>
    </>
  )
}
