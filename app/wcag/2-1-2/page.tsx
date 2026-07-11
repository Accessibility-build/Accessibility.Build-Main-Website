import { Metadata } from 'next'
import Link from "next/link"
import { BreadcrumbStructuredData } from '@/components/seo/structured-data'
import WCAGSEOEnhancements from '@/components/wcag/seo-enhancements'
import { CriterionLinks } from "@/components/wcag/criterion-links"
import KeyboardTrapDemo from "./interactive-demo"

export const metadata: Metadata = {
  title: 'WCAG 2.1.2 No Keyboard Trap - Interactive Demo',
  description: 'Master WCAG 2.1.2 No Keyboard Trap requirements with interactive demos, keyboard trap detection, and comprehensive implementation examples.',
  keywords: [
    'WCAG 2.1.2',
    'No Keyboard Trap',
    'Level A',
    'keyboard trap',
    'focus management',
    'accessibility compliance',
    'web accessibility',
    'WCAG 2.2',
    'escape key',
    'keyboard navigation'
  ],
  authors: [{ name: 'Khushwant Parihar' }],
  creator: 'Accessibility.build',
  publisher: 'Accessibility.build',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: 'https://accessibility.build/wcag/2-1-2',
  },
  openGraph: {
    title: 'WCAG 2.1.2 No Keyboard Trap (Level A) - Interactive Demo',
    description: 'Master WCAG 2.1.2 No Keyboard Trap with interactive demos and implementation guidance.',
    url: '/wcag/2-1-2',
    siteName: 'Accessibility.build',
    locale: 'en_US',
    type: 'article',
    images: [
      {
        url: '/api/og?title=WCAG%202.1.2%20No%20Keyboard%20Trap&section=WCAG',
        width: 1200,
        height: 630,
        alt: 'WCAG 2.1.2 No Keyboard Trap (Level A) - Interactive Demo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WCAG 2.1.2 No Keyboard Trap (Level A) - Interactive Demo',
    description: 'Master WCAG 2.1.2 No Keyboard Trap with interactive demos and implementation guidance.',
    images: ['/api/og?title=WCAG%202.1.2%20No%20Keyboard%20Trap&section=WCAG'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

const faqs = [
  {
    q: "What does WCAG 2.1.2 No Keyboard Trap require?",
    a: "It requires that if keyboard focus can be moved to a component using a keyboard interface, then focus can also be moved away from that component using only the keyboard. Standard exit methods are the Tab and Shift+Tab keys (and frequently Escape). If leaving a component needs something other than unmodified arrow keys, Tab, or another standard exit method, the user must be advised how to move focus away. It is a Level A criterion introduced in WCAG 2.0 under Guideline 2.1 Keyboard Accessible.",
  },
  {
    q: "Is trapping focus inside a modal dialog a violation of 2.1.2?",
    a: "Not by itself. Deliberately containing focus within an open modal — so that Tab cycles among the dialog's controls rather than reaching the page behind it — is an accepted, recommended pattern. It only becomes a keyboard trap if the user cannot leave the dialog with the keyboard alone. A compliant modal lets the user press Escape or Tab to a reachable Close button to dismiss it and return focus to the page. A modal that swallows Escape and offers no keyboard-reachable way out is the failure.",
  },
  {
    q: "What is the 'advisory' part of the requirement?",
    a: "The criterion allows a component to require a non-standard key to exit — but only if the user is told how. If pressing Escape or Tab does not move focus away and the user must instead press, say, F6 or Ctrl+Alt+Right, that instruction must be provided to the user (for example, as visible text or an accessible description inside the component). If a non-standard exit is required and no advisory is given, the criterion fails. In practice, the simplest way to pass is to support the standard Tab/Shift+Tab (and Escape) exits so no advisory is needed at all.",
  },
  {
    q: "How is 2.1.2 different from 2.1.1 Keyboard?",
    a: "2.1.1 Keyboard is about whether functionality can be operated with the keyboard at all — can you reach and activate a control without a mouse. 2.1.2 No Keyboard Trap is specifically about being able to leave: once your focus is on a component, you must be able to move it away again using the keyboard. A widget can satisfy 2.1.1 (you can operate it) yet fail 2.1.2 (once inside, Tab never gets you out). They are related but distinct, and both are Level A.",
  },
  {
    q: "What historically caused keyboard traps?",
    a: "Embedded third-party content is the classic culprit: legacy Flash objects, some PDF and plugin embeds, and iframes for widgets that captured the keyboard and never released it. Modern equivalents are custom JavaScript widgets — date pickers, rich text editors, menus, and JS modals — that intercept the Tab key with preventDefault and loop focus internally without offering Escape or any advertised exit. Any control that calls element.focus() on blur to force focus back to itself will also create a trap.",
  },
  {
    q: "Does 2.1.2 apply to embedded iframes and media players?",
    a: "Yes. If keyboard focus can enter embedded content — an iframe, a video player, a third-party widget — the user must be able to move focus back out with the keyboard. This is one of the hardest cases to guarantee because the embedded content may be outside your direct control. You must test that Tab enters and, crucially, exits the embed. If an embedded object is known to trap focus and cannot be fixed, it should not be included, because there is no keyboard-only way to escape it.",
  },
]

export default function WCAG212Page() {
  return (
    <>
      <WCAGSEOEnhancements
        title="WCAG 2.1.2: No Keyboard Trap"
        description="If keyboard focus can be moved to a component of the page using a keyboard interface, then focus can be moved away from that component using only a keyboard interface."
        criteria="2.1.2"
        level="A"
        principle="Operable"
        guideline="2.1 Keyboard Accessible"
        url="https://accessibility.build/wcag/2-1-2"
        category="Keyboard Accessible"
      />
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: 'Home', url: 'https://accessibility.build' },
          { name: 'WCAG Success Criteria', url: 'https://accessibility.build/wcag' },
          { name: '2.1.2 No Keyboard Trap', url: 'https://accessibility.build/wcag/2-1-2' },
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
                    2.1.2 No Keyboard Trap
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
                Principle 2: Operable
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                Never strand a keyboard user
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
              WCAG 2.1.2: No Keyboard Trap
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              A keyboard user should be able to move <em>into</em> any component and,
              just as importantly,{" "}
              <strong className="text-slate-900 dark:text-white">
                move back <em>out</em> of it using the keyboard alone
              </strong>
              . When focus gets stuck in a widget, a modal, or an embedded object with
              no keyboard way out, the entire page freezes for that user — often the
              only escape is to reload and lose their work. This criterion exists to
              make sure that never happens.
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
              If keyboard focus can be moved to a component of the page using a keyboard
              interface, then focus can be moved away from that component using only a
              keyboard interface, and, if it requires more than unmodified arrow or tab
              keys or other standard exit methods, the user is advised of the method for
              moving focus away.
            </blockquote>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4 text-sm">
              The rule has two halves. First, focus that can go <em>in</em> must be able
              to come <em>out</em> using only the keyboard. Second, if the exit needs
              anything beyond the standard Tab, Shift+Tab, arrow keys, or Escape, the
              user must be told how — the &ldquo;advisory&rdquo; clause. The easiest way
              to comply is to support the standard exits so no special instruction is
              ever needed.
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
              A keyboard trap does not just inconvenience one group — it can lock the
              entire page for anyone who does not, or cannot, use a mouse. When focus
              cannot escape, there is often no recovery short of reloading the page.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  t: "Keyboard-only users",
                  d: "People who navigate entirely with Tab, Shift+Tab, and arrow keys have no pointer to click their way out. A trap means the rest of the page is unreachable until they reload.",
                },
                {
                  t: "Users with motor disabilities",
                  d: "Those using switch devices, sip-and-puff controls, or head pointers rely on sequential keyboard-style navigation. A single trapped widget can halt an entire session.",
                },
                {
                  t: "Screen reader users",
                  d: "Screen readers drive the page through the keyboard. If focus is trapped, the reader's virtual cursor is stuck too, cutting the user off from everything past the trap.",
                },
                {
                  t: "Voice control users",
                  d: "Speech-driven navigation issues keyboard-equivalent commands. When those commands cannot move focus out of a component, the user is stranded just the same.",
                },
                {
                  t: "Power users and everyone in a hurry",
                  d: "Keyboard shortcuts are faster for many sighted users too. A trap that forces them back to the mouse — or to reload — breaks their flow and their trust in the interface.",
                },
                {
                  t: "Anyone whose mouse fails",
                  d: "A dead trackpad or an unresponsive mouse turns every user into a keyboard-only user. Escapable components keep the page usable when the pointer is unavailable.",
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
              The criterion is best remembered as one sentence:{" "}
              <strong className="text-slate-900 dark:text-white">
                you may move focus in, but you must always be able to move focus out
                using the keyboard alone.
              </strong>{" "}
              &ldquo;Standard exit methods&rdquo; are the keys users already expect —
              Tab and Shift+Tab to leave in either direction, and very often Escape to
              dismiss a layer. If those work everywhere, you pass with nothing more to
              do.
            </p>
            <ul className="space-y-3 mb-6">
              {[
                {
                  t: "Focus can move in",
                  d: "It is fine — and normal — for keyboard focus to enter a component: a menu, a dialog, a date picker, an editor, an embedded player.",
                },
                {
                  t: "Focus must move out",
                  d: "From wherever focus lands inside that component, the user must be able to move it away again using only the keyboard, without resorting to a mouse.",
                },
                {
                  t: "Standard exits should just work",
                  d: "Tab and Shift+Tab should carry focus out of the component in the natural reading order; for overlays, Escape should dismiss them and return focus to a sensible place.",
                },
                {
                  t: "Non-standard exits must be advertised",
                  d: "If — and only if — leaving requires something other than Tab, Shift+Tab, arrow keys, or Escape, the component must tell the user which key to press to get out.",
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
              Focus containment vs. a keyboard trap
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              There is an important distinction that trips people up. Deliberately{" "}
              <em>containing</em> focus inside an open modal dialog — so Tab cycles
              through the dialog's own controls instead of reaching the page behind it —
              is the recommended pattern for modals, and it is perfectly compliant{" "}
              <strong>as long as the user can leave the dialog with the keyboard</strong>.
              Provide Escape and a keyboard-reachable Close button, and the containment
              is a feature, not a trap. Remove every keyboard exit and the same code
              becomes a violation. The test is always the same: can the user get out
              with the keyboard alone?
            </p>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              How it relates to nearby criteria
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              2.1.2 sits alongside{" "}
              <Link href="/wcag/2-1-1" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                2.1.1 Keyboard
              </Link>
              , which is about being able to operate functionality with the keyboard at
              all, and{" "}
              <Link href="/wcag/2-4-3" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                2.4.3 Focus Order
              </Link>
              , which is about focus moving in a sensible sequence. 2.1.2 is narrower and
              specific: it is only about being able to <em>leave</em> a component you have
              entered.
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
                  ✓ Passes 2.1.2
                </h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <li>
                    A modal dialog that contains focus but closes on Escape and has a
                    reachable Close button.
                  </li>
                  <li>
                    A dropdown menu that closes and returns focus to its trigger when
                    the user presses Escape.
                  </li>
                  <li>
                    A date picker you can Tab into and Tab (or Shift+Tab) straight back
                    out of.
                  </li>
                  <li>
                    A rich text editor that requires a documented key to exit — and
                    shows that instruction to the user.
                  </li>
                  <li>
                    An embedded video player whose controls you can Tab through and then
                    Tab past to the rest of the page.
                  </li>
                </ul>
              </div>
              <div className="rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-5">
                <h3 className="font-semibold text-rose-800 dark:text-rose-300 mb-3">
                  ✗ Fails 2.1.2
                </h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <li>
                    A modal that loops Tab internally with no Escape handler and no
                    keyboard-reachable close.
                  </li>
                  <li>
                    A custom widget whose keydown handler calls preventDefault on Tab
                    without offering any exit.
                  </li>
                  <li>
                    An embedded third-party widget or iframe that captures focus and
                    never releases it.
                  </li>
                  <li>
                    A field that calls focus() on its own blur to force focus back on a
                    validation error.
                  </li>
                  <li>
                    A component that needs a non-standard key to leave but never tells
                    the user which key.
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
              The trap vs. the escapable modal
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              The failure is almost always a keydown handler that blocks the exit keys.
              The fix is to let Escape close the layer and let Tab wrap{" "}
              <em>within</em> the dialog while a Close button provides an obvious way
              out.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- ✗ Trap: Escape is blocked, Tab is preventDefaulted, no way out -->
<div class="modal" role="dialog">
  <input type="text" placeholder="You're stuck here" />
  <button>Can't escape</button>
</div>
<script>
  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') e.preventDefault()  // blocks the exit
    if (e.key === 'Tab') e.preventDefault()     // no way forward or back
  })
</script>

<!-- ✓ Compliant: focus is contained but Escape and Close both leave -->
<div class="modal" role="dialog" aria-modal="true" aria-labelledby="t">
  <h2 id="t">Settings</h2>
  <button class="close" aria-label="Close dialog">×</button>
  <input type="text" />
  <button type="submit">Save</button>
</div>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              A reusable focus-trap that still lets users out
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              A good focus trap only wraps Tab at the boundaries of the dialog; it never
              intercepts Escape, and it restores focus to the element that opened the
              dialog when it closes.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`function trapFocus(container, onClose) {
  const previouslyFocused = document.activeElement
  const focusables = container.querySelectorAll(
    'a[href], button:not([disabled]), input:not([disabled]),' +
    'select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  const first = focusables[0]
  const last = focusables[focusables.length - 1]
  first?.focus()

  container.addEventListener('keydown', (e) => {
    // Escape ALWAYS leaves — never block it
    if (e.key === 'Escape') { onClose(); return }

    if (e.key === 'Tab') {
      // Only wrap AT the edges; normal Tab moves freely inside
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus()
      }
    }
  })

  return () => previouslyFocused?.focus() // restore focus on close
}`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Advising the user of a non-standard exit
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              If a component genuinely needs a special key to leave — some embedded
              editors capture Tab to insert indentation — the criterion still passes as
              long as you tell the user how to get out, both visibly and to assistive
              technology.
            </p>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<div role="group" aria-labelledby="editor-label"
     aria-describedby="editor-exit">
  <span id="editor-label">Code editor</span>
  <textarea aria-describedby="editor-exit"></textarea>
  <!-- The advisory the criterion requires -->
  <p id="editor-exit">
    Tab inserts a tab character. Press Escape, then Tab,
    to move focus out of the editor.
  </p>
</div>`}</code>
            </pre>
          </section>

          {/* Interactive demo */}
          <section aria-labelledby="demo" className="mb-12">
            <h2
              id="demo"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Interactive demo
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              Try both widgets below with your keyboard. The trapped one blocks Tab and
              Escape so focus cannot leave — a genuine 2.1.2 failure — while the
              accessible one contains focus for usability but lets you press{" "}
              <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-xs">
                Esc
              </kbd>{" "}
              or use the Close button to get out. A Release control outside the trap is
              always available so the real page never actually locks up.
            </p>
            <KeyboardTrapDemo />
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
                "A modal or overlay that loops focus internally with no Escape handler and no keyboard-reachable Close button.",
                "A custom widget whose keydown listener calls preventDefault on Tab without providing any alternative exit.",
                "Calling element.focus() on blur to force focus back — for example on a validation error — so the user can never leave the field.",
                "Embedded third-party content (legacy Flash, some PDF/plugin embeds, or an iframe widget) that captures the keyboard and never releases it.",
                "Dropdown menus, date pickers, and rich text editors that swallow Tab and Escape, stranding focus inside them.",
                "Requiring a non-standard key to exit a component without ever advising the user which key to press.",
                "A media player whose controls trap focus so Tab never reaches the content after the player.",
                "Blocking the Escape key globally 'to prevent accidental closes', which removes the standard exit from every layer at once.",
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
              How to test for 2.1.2
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "Put the mouse away entirely",
                  d: "Unplug or ignore the pointer and drive the whole page with Tab, Shift+Tab, arrow keys, and Escape. Testing keyboard traps only works if you truly cannot fall back to clicking.",
                },
                {
                  t: "Tab into and out of every component",
                  d: "Reach each menu, dialog, widget, embed, and media player with Tab, then confirm Tab and Shift+Tab carry focus back out again. If focus never leaves, you have found a trap.",
                },
                {
                  t: "Open every modal and try Escape and Close",
                  d: "For each overlay, confirm that Escape dismisses it and that a Close button is reachable by keyboard and returns focus somewhere sensible on the page.",
                },
                {
                  t: "Exercise embedded and third-party content",
                  d: "Tab into iframes, video players, date pickers, and any plugin or widget you did not build. These are the most common traps because their exit behaviour is outside your code.",
                },
                {
                  t: "Watch for forced focus and blocked keys",
                  d: "Look for fields that snap focus back on blur (e.g. on validation) and for handlers that preventDefault on Tab or Escape. Both silently remove the standard exit.",
                },
                {
                  t: "Verify any non-standard exit is advertised",
                  d: "If a component legitimately needs a special key to leave, confirm the instruction is actually presented to the user — visibly and via an accessible description — not just buried in documentation.",
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
              Automated tools such as axe DevTools, Pa11y, and Lighthouse can flag some
              suspicious focus patterns, but keyboard traps are fundamentally a manual
              test — a human pressing Tab is the only reliable check. For a structured
              audit, work through the full{" "}
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
          <CriterionLinks number="2.1.2" />

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
