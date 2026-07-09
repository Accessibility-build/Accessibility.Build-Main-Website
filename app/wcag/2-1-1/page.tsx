import Link from "next/link"
import { Metadata } from 'next'
import { BreadcrumbStructuredData } from "@/components/seo/structured-data"
import WCAGSEOEnhancements from "@/components/wcag/seo-enhancements"
import { CriterionLinks } from "@/components/wcag/criterion-links"
import KeyboardDemo from "./interactive-demo"

export const metadata: Metadata = {
  title: 'WCAG 2.1.1 Keyboard (Level A) - Interactive Demo',
  description: 'Master WCAG 2.1.1 Keyboard requirements with interactive navigation demos, focus indicators, and comprehensive implementation examples.',
  keywords: [
    'WCAG 2.1.1',
    'Keyboard',
    'Level A',
    'keyboard navigation',
    'focus indicators',
    'accessibility compliance',
    'web accessibility',
    'WCAG 2.2',
    'tab order',
    'keyboard accessibility'
  ],
  authors: [{ name: 'Accessibility.build Team' }],
  creator: 'Accessibility.build',
  publisher: 'Accessibility.build',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: 'https://accessibility.build/wcag/2-1-1',
  },
  openGraph: {
    title: 'WCAG 2.1.1 Keyboard (Level A) - Interactive Demo',
    description: 'Master WCAG 2.1.1 Keyboard with interactive navigation demos and implementation guidance.',
    url: '/wcag/2-1-1',
    siteName: 'Accessibility.build',
    locale: 'en_US',
    type: 'article',
    images: [
      {
        url: '/api/og?title=WCAG%202.1.1%20Keyboard&section=WCAG',
        width: 1200,
        height: 630,
        alt: 'WCAG 2.1.1 Keyboard (Level A) - Interactive Demo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WCAG 2.1.1 Keyboard (Level A) - Interactive Demo',
    description: 'Master WCAG 2.1.1 Keyboard with interactive navigation demos and implementation guidance.',
    images: ['/api/og?title=WCAG%202.1.1%20Keyboard&section=WCAG'],
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
    q: "What does WCAG 2.1.1 Keyboard require?",
    a: "It requires that all functionality of the content is operable through a keyboard interface, without requiring specific timings for individual keystrokes. In plain terms: anything a user can do with a mouse, tap, or other pointer must also be achievable using only a keyboard — reaching every interactive element, activating it, and moving through composite widgets. The one exception is functionality that inherently depends on the path of the user's movement rather than just its start and end points, such as freehand drawing. It is a Level A criterion and part of WCAG since 2.0.",
  },
  {
    q: "Does 2.1.1 mean I have to remove mouse support?",
    a: "No. The criterion is additive, not exclusive. You can — and should — keep mouse, touch, and pointer support; the requirement is simply that keyboard operation also works. A control that responds to a click must equally respond to keyboard focus and activation. Mouse-only interactions (a div with just an onclick, a hover-only menu, a drag that has no keyboard alternative) are what fail, not the presence of mouse support itself.",
  },
  {
    q: "What is the 'path-dependent' exception?",
    a: "The exception covers functionality that requires input based on the path of the user's movement and not just the endpoints — the classic example is freehand drawing in a paint program, where the exact route of the pointer is the content. A keyboard cannot reproduce an arbitrary continuous stroke, so that specific input is exempt. Note the exception is narrow: the surrounding tools (color pickers, brush selectors, save, undo) are not path-dependent and must still be keyboard operable. Related guidance appears in 2.5.7 Dragging Movements, which requires single-pointer alternatives to drag gestures.",
  },
  {
    q: "How is 2.1.1 different from 2.1.3 Keyboard (No Exception)?",
    a: "2.1.1 (Level A) allows the narrow path-dependent exception described above. 2.1.3 Keyboard (No Exception) is the Level AAA version of the same idea, but it removes that exception entirely — every function, including path-dependent ones, must be keyboard operable. Most teams target 2.1.1; 2.1.3 is relevant only when aiming for AAA conformance.",
  },
  {
    q: "Does 2.1.1 require visible focus indicators or a logical tab order?",
    a: "Not directly — those are handled by companion criteria. 2.1.1 is about operability: can you reach and use everything with a keyboard at all? 2.4.7 Focus Visible (Level AA) requires that the focused element is visually indicated, and 2.4.3 Focus Order (Level A) requires that the navigation order is meaningful. In practice you address all three together, because a control that is technically reachable but invisible when focused, or reached in a nonsensical order, is a poor experience even if it passes 2.1.1 on its own.",
  },
  {
    q: "What about keyboard traps?",
    a: "A keyboard trap — where focus enters a component and cannot leave using the keyboard — is a separate criterion, 2.1.2 No Keyboard Trap (Level A). It sits alongside 2.1.1 under Guideline 2.1 Keyboard Accessible. You need both: 2.1.1 ensures functionality is reachable and operable by keyboard, and 2.1.2 ensures the user can always move focus back out again.",
  },
  {
    q: "Does the 'without specific timings' clause ban keyboard shortcuts?",
    a: "No. It means a function must not require a keystroke to be held for a precise duration, or two keystrokes to be pressed within a strict time window, in a way a user cannot control. Ordinary shortcuts and key sequences are fine; what fails is functionality that only works if the user has particular motor timing — for example a 'double-press within 300ms' gesture with no untimed alternative. This protects users of switch devices, sip-and-puff systems, and on-screen keyboards who cannot guarantee fast, precise timing.",
  },
]

export default function WCAG211Page() {
  return (
    <>
      <WCAGSEOEnhancements
        title="WCAG 2.1.1: Keyboard"
        description="All functionality of the content is operable through a keyboard interface without requiring specific timings for individual keystrokes."
        criteria="2.1.1"
        level="A"
        principle="Operable"
        guideline="2.1 Keyboard Accessible"
        url="https://accessibility.build/wcag/2-1-1"
        category="Keyboard Accessible"
      />
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: 'Home', url: 'https://accessibility.build' },
          { name: 'WCAG Success Criteria', url: 'https://accessibility.build/wcag' },
          { name: '2.1.1 Keyboard', url: 'https://accessibility.build/wcag/2-1-1' },
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
                    2.1.1 Keyboard
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
                The bedrock of keyboard access
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
              WCAG 2.1.1: Keyboard
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              Millions of people never touch a mouse — they drive the web with a
              keyboard, a switch, a sip-and-puff device, or their voice. This
              criterion asks for one thing:{" "}
              <strong className="text-slate-900 dark:text-white">
                every function must be operable through a keyboard interface
              </strong>
              . It does not ask you to remove the mouse; it asks you to make sure
              the keyboard works too. Get this right and your whole interface opens
              up to the assistive technologies that speak the language of
              keystrokes.
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
              All functionality of the content is operable through a keyboard
              interface without requiring specific timings for individual
              keystrokes, except where the underlying function requires input that
              depends on the path of the user&rsquo;s movement and not just the
              endpoints.
              <br />
              <br />
              <strong>Note 1:</strong> This exception relates to the underlying
              function, not the input technique. For example, if using handwriting
              to enter text, the input technique (handwriting) requires
              path-dependent input but the underlying function (text input) does
              not.
              <br />
              <strong>Note 2:</strong> This does not forbid and should not
              discourage providing mouse input or other input methods in addition
              to keyboard operation.
            </blockquote>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4 text-sm">
              The &ldquo;keyboard interface&rdquo; is deliberately broad: it
              includes physical keyboards, on-screen keyboards, and any assistive
              technology that generates keystroke input — so meeting this criterion
              also serves speech-input and switch users who ultimately drive the
              page through keyboard events.
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
              The keyboard is the universal input. Countless assistive technologies
              present themselves to the page as a keyboard, so &ldquo;works with a
              keyboard&rdquo; quietly means &ldquo;works with all of these&rdquo;:
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  t: "Keyboard-only users",
                  d: "People who cannot or choose not to use a mouse — because of a tremor, repetitive strain injury, or simple preference — navigate entirely by Tab, arrow keys, Enter, and Space.",
                },
                {
                  t: "People with motor and mobility disabilities",
                  d: "Fine pointer control can be difficult or impossible. A keyboard interface offers discrete, forgiving key presses instead of precise mouse targeting.",
                },
                {
                  t: "Screen reader users",
                  d: "Blind and low-vision users drive their screen reader — and therefore the whole page — through keyboard commands. If a control isn't keyboard operable, it effectively doesn't exist for them.",
                },
                {
                  t: "Switch and sip-and-puff users",
                  d: "People with severe motor impairments operate the computer through one or two switches that emulate keystrokes. Everything they do arrives as keyboard input.",
                },
                {
                  t: "Voice-control users",
                  d: "Speech-recognition software often works by moving focus and issuing keyboard-equivalent commands, so keyboard operability is what makes 'click Save' actually work.",
                },
                {
                  t: "Keyboard power users",
                  d: "Developers, data-entry staff, and anyone working at speed keep their hands on the keyboard. Full keyboard support makes your product faster for everyone, not only people with disabilities.",
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
              &ldquo;All functionality&rdquo; is expansive: every link, button,
              form field, menu, tab set, slider, accordion, modal, drag-and-drop
              interaction, and custom widget on the page. If a sighted mouse user
              can do it, a keyboard user must be able to do it too. In practice
              this breaks down into three obligations for each interactive element:
            </p>
            <ul className="space-y-3 mb-6">
              {[
                {
                  t: "Reachable",
                  d: "The element must be in the keyboard tab order (or reachable via a documented key, such as an arrow key inside a menu). Native interactive elements are focusable automatically; custom widgets need tabindex=\"0\".",
                },
                {
                  t: "Operable",
                  d: "Once focused, the element must respond to the expected keys — Enter or Space to activate a button, Enter to follow a link, arrow keys to move within composite widgets like radio groups, tabs, and menus.",
                },
                {
                  t: "Free of timing requirements",
                  d: "Activation must not depend on holding a key for a precise duration or pressing keys within a strict window. Users of switches and on-screen keyboards cannot guarantee that timing.",
                },
                {
                  t: "Semantically announced",
                  d: "Custom controls must expose the right role (role=\"button\", role=\"tab\", etc.) so assistive technology tells the user what the focused element is and how to operate it.",
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
              The one exception: path-dependent input
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              The criterion carves out functionality whose input depends on the{" "}
              <em>path</em> of the user&rsquo;s movement rather than just its start
              and end points — freehand drawing, watercolor-style painting, and
              some continuous drag gestures where the exact route is the content. A
              keyboard cannot reproduce an arbitrary continuous stroke, so that
              specific input is exempt. The exception is narrow: the tools around
              the canvas (colour pickers, brush size, undo, save) are{" "}
              <em>not</em> path-dependent and must still be keyboard operable.
              Where a drag has a meaningful start and end but not a meaningful
              path, a keyboard alternative is expected — see{" "}
              <Link
                href="/wcag/2-5-7"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                2.5.7 Dragging Movements
              </Link>
              . The stricter Level AAA sibling,{" "}
              <Link
                href="/wcag/2-1-3"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                2.1.3 Keyboard (No Exception)
              </Link>
              , removes even this allowance.
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
                  ✓ Passes 2.1.1
                </h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <li>
                    Native <code className="px-1 py-0.5 rounded bg-white/60 dark:bg-slate-800 font-mono text-xs">&lt;button&gt;</code>,{" "}
                    <code className="px-1 py-0.5 rounded bg-white/60 dark:bg-slate-800 font-mono text-xs">&lt;a href&gt;</code>, and form
                    controls, reachable by Tab and activated by Enter/Space.
                  </li>
                  <li>
                    A custom dropdown with <code className="px-1 py-0.5 rounded bg-white/60 dark:bg-slate-800 font-mono text-xs">role=&quot;menu&quot;</code>,{" "}
                    <code className="px-1 py-0.5 rounded bg-white/60 dark:bg-slate-800 font-mono text-xs">tabindex</code>, and
                    arrow-key navigation.
                  </li>
                  <li>
                    Drag-and-drop that also offers a keyboard path (move buttons,
                    or cut/paste with Enter and arrow keys).
                  </li>
                  <li>
                    A canvas paint app whose <em>tools and menus</em> are keyboard
                    operable, even though the freehand stroke itself is exempt.
                  </li>
                  <li>
                    A modal you can open, operate, and close entirely from the
                    keyboard.
                  </li>
                </ul>
              </div>
              <div className="rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-5">
                <h3 className="font-semibold text-rose-800 dark:text-rose-300 mb-3">
                  ✗ Fails 2.1.1
                </h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <li>
                    A <code className="px-1 py-0.5 rounded bg-white/60 dark:bg-slate-800 font-mono text-xs">&lt;div onclick&gt;</code> with no{" "}
                    <code className="px-1 py-0.5 rounded bg-white/60 dark:bg-slate-800 font-mono text-xs">tabindex</code> or key handler —
                    Tab skips it entirely.
                  </li>
                  <li>
                    A menu that only opens on <code className="px-1 py-0.5 rounded bg-white/60 dark:bg-slate-800 font-mono text-xs">mouseover</code> with
                    no focus or keyboard equivalent.
                  </li>
                  <li>
                    Drag-and-drop reordering that has no keyboard alternative at
                    all.
                  </li>
                  <li>
                    A control that only fires after a double-press within a fixed
                    time window.
                  </li>
                  <li>
                    A custom slider you can focus but not adjust, because it
                    ignores the arrow keys.
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
              Prefer native elements
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              The simplest way to be keyboard operable is to use the elements the
              browser already makes focusable and activatable. A clickable{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">&lt;div&gt;</code>{" "}
              is invisible to the keyboard; a{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">&lt;button&gt;</code>{" "}
              is not.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- ✗ Mouse-only: not in the tab order, ignores Enter/Space -->
<div class="btn" onclick="save()">Save</div>

<!-- ✓ Native button: focusable and operable for free -->
<button type="button" onclick="save()">Save</button>

<!-- ✗ A link faked from a span -->
<span class="link" onclick="location='/docs'">Docs</span>

<!-- ✓ A real link: Tab reaches it, Enter follows it -->
<a href="/docs">Docs</a>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              When you must build a custom control
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              If a native element genuinely will not do, you have to recreate three
              things the browser gave you for free: focusability, a role, and
              keyboard activation.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- ✓ Custom button, made keyboard operable -->
<div
  role="button"
  tabindex="0"
  onclick="toggleSidebar()"
  onkeydown="if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    toggleSidebar();
  }"
>
  Toggle sidebar
</div>`}</code>
            </pre>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              The same pattern in React — note that both the pointer and keyboard
              paths call the same handler:
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`function ToggleButton({ onToggle, children }) {
  const activate = () => onToggle()

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={activate}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()   // stop Space from scrolling
          activate()
        }
      }}
    >
      {children}
    </div>
  )
}`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              A keyboard alternative to dragging
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Drag-and-drop is not path-dependent — the drop target is an endpoint,
              not a route — so it needs a keyboard route. A common pattern is
              arrow-key reordering on a focused list item.
            </p>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<li
  tabindex="0"
  role="option"
  aria-label="Task: Draft report. Use arrow keys to reorder."
  onkeydown="handleReorder(event)"
>
  Draft report
</li>

<script>
function handleReorder(e) {
  if (e.key === 'ArrowUp')   { e.preventDefault(); moveUp(e.target) }
  if (e.key === 'ArrowDown') { e.preventDefault(); moveDown(e.target) }
}
</script>`}</code>
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
              Tab through the controls below. Four of them take focus in turn and
              show a visible focus ring; the mouse-only{" "}
              <strong className="text-slate-900 dark:text-white">
                &ldquo;Delete&rdquo;
              </strong>{" "}
              div is skipped completely — a hands-on illustration of exactly what
              2.1.1 prevents.
            </p>
            <KeyboardDemo />
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
                "Custom controls built from <div> or <span> with an onClick but no tabindex and no keyboard handler — Tab never reaches them.",
                "Mouse-only event handlers (onmouseover, onmousedown) with no onfocus/onkeydown equivalent, so hover menus and drag handles are unusable by keyboard.",
                "Widgets that are focusable but not operable — a custom slider or listbox you can Tab to but cannot change with the arrow keys.",
                "Drag-and-drop reordering, sorting, or file handling with no keyboard alternative provided.",
                "Functionality that requires specific keystroke timing, such as a double-press within a fixed window, with no untimed alternative.",
                "Scripts wired only to click or pointer events, so Enter and Space do nothing on interactive elements.",
                "Removing an element from the tab order with tabindex=\"-1\" (or a positive tabindex that scrambles the order) on something the user needs to reach.",
                "Click targets that are images or icons with an onClick but no role, name, or keyboard behaviour.",
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
              How to test for 2.1.1
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "Put the mouse away",
                  d: "Physically move your mouse aside or commit to not touching it. Everything from here on must be done with the keyboard alone — that is the whole test.",
                },
                {
                  t: "Tab through the entire page",
                  d: "Press Tab (and Shift+Tab) from the top. Confirm you can reach every interactive element — links, buttons, form fields, custom widgets — and that nothing you need is skipped.",
                },
                {
                  t: "Activate every control",
                  d: "On each focused element, use the expected keys: Enter to follow a link, Enter or Space to press a button, and arrow keys to move within composite widgets like menus, tabs, radio groups, and sliders.",
                },
                {
                  t: "Check custom components in particular",
                  d: "Anything not built from a native element is where failures hide. Verify each custom control is focusable, exposes a role, and responds to keyboard activation — not just clicks.",
                },
                {
                  t: "Hunt for mouse-only functionality",
                  d: "Look specifically for hover-only menus, drag-and-drop, and click-only handlers. If a feature can only be triggered with the pointer, it fails — provide a keyboard route.",
                },
                {
                  t: "Watch for timing traps",
                  d: "Confirm no action depends on holding a key for a precise time or pressing keys within a strict window. Then run an automated scan (axe, WAVE, Lighthouse) as a floor — it catches unnamed and non-focusable controls, but only manual testing proves true operability.",
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
              While you are keyboard testing, keep an eye on the companion criteria:{" "}
              <Link
                href="/wcag/2-1-2"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                2.1.2 No Keyboard Trap
              </Link>
              ,{" "}
              <Link
                href="/wcag/2-4-3"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                2.4.3 Focus Order
              </Link>
              , and{" "}
              <Link
                href="/wcag/2-4-7"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                2.4.7 Focus Visible
              </Link>
              . For a full pass, work through the{" "}
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
          <CriterionLinks number="2.1.1" />

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
