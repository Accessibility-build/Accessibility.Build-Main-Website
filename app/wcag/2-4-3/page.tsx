import Link from "next/link"
import { createMetadata } from "@/lib/metadata"
import { BreadcrumbStructuredData } from "@/components/seo/structured-data"
import WCAGSEOEnhancements from "@/components/wcag/seo-enhancements"
import { CriterionLinks } from "@/components/wcag/criterion-links"
import FocusOrderDemo from "./interactive-demo"

export const metadata = createMetadata({
  title: "WCAG 2.4.3 Focus Order — Logical Tab Order",
  path: "/wcag/2-4-3",
  description:
    "Master WCAG 2.4.3 Focus Order with interactive focus sequence demonstrations, logical order validation, and keyboard navigation testing tools. Complete guide with live examples, focus tracking, and implementation code for accessible keyboard navigation.",
  keywords: [
    "WCAG 2.4.3",
    "Focus Order",
    "keyboard navigation",
    "tabindex",
    "focus sequence",
    "accessibility",
    "Level A",
    "web accessibility",
    "WCAG 2.2",
    "focus management",
    "logical navigation",
    "keyboard accessibility",
    "assistive technology",
  ],
  type: "article",
  image: "/api/og?title=WCAG%202.4.3%20Focus%20Order&section=WCAG",
})

const faqs = [
  {
    q: "What does WCAG 2.4.3 Focus Order require?",
    a: "It requires that when a page can be navigated sequentially — for example with the Tab key — and the order in which components receive focus affects meaning or operation, focus moves through those components in an order that preserves meaning and operability. In plain terms, tabbing through the page should follow a sensible sequence, usually matching the visual reading order, so a keyboard or screen reader user can understand and operate the page just as a sighted mouse user would. It is a Level A success criterion, part of WCAG since 2.0.",
  },
  {
    q: "What is the difference between focus order and DOM order?",
    a: "DOM order is the order elements appear in the HTML source; focus order (tab order) is the sequence in which they receive keyboard focus. By default the two are the same: the browser follows source order. Problems arise when the two diverge — for example when CSS (flexbox order, grid placement, absolute positioning) moves elements visually so they no longer match the source, or when positive tabindex values override the natural order. The safest strategy is to keep the DOM order matching the visual order and avoid anything that decouples them, so focus order simply follows the source.",
  },
  {
    q: "Why are positive tabindex values a problem?",
    a: "A positive tabindex (1 or higher) pulls an element to the front of the tab sequence, ahead of every element that relies on natural DOM order. As soon as you use one positive value you effectively have to manage the tab order of the entire page by hand, and a single stray tabindex=1 can send focus jumping to an unexpected control first. This almost always produces a confusing, illogical order. The correct values are tabindex=0 (include an element in the natural order) and tabindex=-1 (focusable only via script, not in the tab order). Reserve positive values for essentially never.",
  },
  {
    q: "How does focus order relate to modals, menus, and other widgets?",
    a: "Interactive widgets are where focus order matters most. When a modal dialog opens, focus should move into the dialog, stay trapped within it while it is open, and return to the triggering control when it closes — otherwise focus is left behind the overlay in an order that makes no sense. Similarly, custom menus, accordions, and comboboxes must manage focus so that revealing or hiding content keeps the sequence coherent. Content that is inserted into the DOM later (below the trigger) but appears visually near it is a classic source of illogical focus order.",
  },
  {
    q: "Does 2.4.3 require a specific order, like strictly left-to-right?",
    a: "No. The criterion does not mandate one particular order; it requires an order that preserves meaning and operability. There can be more than one order that does this. For most layouts that means following the visual reading order for the content's language (top-to-bottom, and left-to-right for languages written that way), because that is what users expect. The failure condition is an order that changes the meaning or breaks operation — for instance focusing a Submit button before the fields it submits, or reaching a confirmation before the choice it confirms.",
  },
  {
    q: "How is 2.4.3 Focus Order different from 2.4.7 Focus Visible and 2.1.1 Keyboard?",
    a: "They cover three distinct parts of keyboard access. 2.1.1 Keyboard (A) requires that all functionality can be operated with a keyboard at all. 2.4.3 Focus Order (A) requires that when you tab, the sequence of focus makes sense. 2.4.7 Focus Visible (AA) requires that the currently focused element has a visible focus indicator so users can see where they are. A page can be fully keyboard-operable (2.1.1) yet still fail 2.4.3 because the order is scrambled, or fail 2.4.7 because the focus ring is hidden. Aim to satisfy all three together.",
  },
]

const domOrderHtml = `<!-- ✗ Visual order and DOM order disagree.
     CSS moves the fields around, so tab order is scrambled. -->
<form style="display:flex; flex-direction:column">
  <button type="submit" style="order: 3">Submit</button>
  <input name="email"  style="order: 1" aria-label="Email">
  <input name="name"   style="order: 2" aria-label="Name">
</form>

<!-- ✓ DOM order matches the visual reading order,
     so tab order follows naturally. -->
<form>
  <label>Name  <input name="name"></label>
  <label>Email <input name="email"></label>
  <button type="submit">Submit</button>
</form>`

const tabindexHtml = `<!-- ✗ Positive tabindex hijacks the whole page order.
     Submit is focused first, then the rest jump around. -->
<form>
  <input aria-label="First name" tabindex="2">
  <button type="submit" tabindex="1">Submit</button>
  <input aria-label="Last name" tabindex="5">
  <input aria-label="Email" tabindex="4">
</form>

<!-- ✓ Only tabindex 0 and -1. Natural order is preserved. -->
<form>
  <input aria-label="First name">      <!-- natural order -->
  <input aria-label="Last name">
  <input aria-label="Email">
  <div tabindex="-1" id="status"></div> <!-- script-focusable only -->
  <button type="submit">Submit</button>
</form>`

const modalJs = `// A modal must move focus in, trap it, and restore it out —
// otherwise focus is left behind the overlay in a broken order.
function openModal(dialog, trigger) {
  const previouslyFocused = trigger;         // remember where we were
  dialog.hidden = false;

  const focusables = dialog.querySelectorAll(
    'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  first?.focus();                            // move focus into the dialog

  dialog.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    // Trap focus within the dialog
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  dialog.addEventListener('close', () => {
    previouslyFocused?.focus();              // restore focus on close
  });
}`

export default function WCAG243Page() {
  return (
    <>
      <WCAGSEOEnhancements
        title="WCAG 2.4.3: Focus Order"
        description="If a Web page can be navigated sequentially and the navigation sequences affect meaning or operation, focusable components receive focus in an order that preserves meaning and operability."
        criteria="2.4.3"
        level="A"
        principle="Operable"
        guideline="2.4 Navigable"
        url="https://accessibility.build/wcag/2-4-3"
        category="Navigation"
      />
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "WCAG Success Criteria", url: "https://accessibility.build/wcag" },
          { name: "2.4.3 Focus Order", url: "https://accessibility.build/wcag/2-4-3" },
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
                    2.4.3 Focus Order
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
                Tab should follow the reading order
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
              WCAG 2.4.3: Focus Order
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              A mouse user can click anything in any order. A keyboard user moves through
              the page one <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-base">Tab</kbd>{" "}
              at a time, and they depend on that sequence making sense. This criterion
              asks that{" "}
              <strong className="text-slate-900 dark:text-white">
                focus moves through the page in an order that preserves meaning and
                operability
              </strong>{" "}
              — usually the same order you would read it.
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
              If a Web page can be navigated sequentially and the navigation sequences
              affect meaning or operation, focusable components receive focus in an order
              that preserves meaning and operability.
            </blockquote>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4 text-sm">
              The criterion does not demand one specific order — there may be several that
              work. It fails only when the order <em>changes meaning</em> or{" "}
              <em>breaks operation</em>, such as reaching a Submit button before the
              fields it submits.
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
                  What breaks focus order
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
              Anyone who does not point-and-click their way around a page relies on a
              coherent focus sequence:
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  t: "Keyboard-only users",
                  d: "People who cannot use a mouse move through the page with Tab. A scrambled order makes them hunt for the next control and easy to lose their place mid-task.",
                },
                {
                  t: "Screen reader users",
                  d: "Focus order and reading order together determine how the page is experienced. An illogical order can present information in a sequence that changes its meaning.",
                },
                {
                  t: "Switch and voice-control users",
                  d: "These users step through focusable elements one action at a time. An unexpected jump wastes actions and can trigger the wrong control entirely.",
                },
                {
                  t: "People with cognitive disabilities",
                  d: "A predictable, reading-order sequence reduces the effort of tracking where focus is and what comes next, especially in long forms and multi-step flows.",
                },
                {
                  t: "Screen magnifier users",
                  d: "At high zoom only a slice of the page is visible. If focus jumps to an off-screen element, the viewport lurches unexpectedly and orientation is lost.",
                },
                {
                  t: "Everyone filling in forms",
                  d: "A natural tab order between fields is simply faster and less error-prone for all users, not just those relying on assistive technology.",
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
              What breaks focus order
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              By default the browser follows source order, and source order that matches
              the visual layout is usually all you need. Focus order breaks when something
              decouples the tab sequence from what the user sees:
            </p>
            <ul className="space-y-3 mb-6">
              {[
                {
                  t: "Positive tabindex values",
                  d: "Any tabindex of 1 or more yanks an element to the front of the sequence, ahead of everything in natural order. One stray value forces you to hand-manage the whole page. Use only 0 and -1.",
                },
                {
                  t: "CSS that reorders visually",
                  d: "flexbox order, grid placement, and absolute positioning move elements on screen without changing the DOM. Focus still follows the source, so the visual and focus order diverge.",
                },
                {
                  t: "DOM-inserted content",
                  d: "Content added later in the source but shown near its trigger — dropdowns, tooltips, expandable panels — can place the next tab stop far from where the eye expects it.",
                },
                {
                  t: "Unmanaged widgets and modals",
                  d: "Dialogs, menus, and custom components that don't move focus in on open, trap it while open, and restore it on close leave focus stranded in a nonsensical position.",
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
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              The reliable fix for all four is the same principle: keep the DOM order
              matching the visual reading order and let focus follow the source. That also
              supports{" "}
              <Link
                href="/wcag/1-3-2"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                1.3.2 Meaningful Sequence
              </Link>
              , and pairs with{" "}
              <Link
                href="/wcag/2-4-7"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                2.4.7 Focus Visible
              </Link>{" "}
              so users can also <em>see</em> where focus lands.
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
                  ✓ Passes 2.4.3
                </h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <li>A form whose fields receive focus top-to-bottom, Submit last.</li>
                  <li>
                    DOM order matching the visual layout, with no positive{" "}
                    <code className="px-1 py-0.5 rounded bg-white/60 dark:bg-slate-800 font-mono text-xs">tabindex</code>.
                  </li>
                  <li>
                    A modal that moves focus in on open, traps it, and returns it to the
                    trigger on close.
                  </li>
                  <li>
                    A dropdown whose revealed options are reached immediately after its
                    trigger.
                  </li>
                </ul>
              </div>
              <div className="rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-5">
                <h3 className="font-semibold text-rose-800 dark:text-rose-300 mb-3">
                  ✗ Fails 2.4.3
                </h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <li>
                    A Submit button with{" "}
                    <code className="px-1 py-0.5 rounded bg-white/60 dark:bg-slate-800 font-mono text-xs">tabindex=&quot;1&quot;</code>{" "}
                    focused before any field.
                  </li>
                  <li>
                    CSS <code className="px-1 py-0.5 rounded bg-white/60 dark:bg-slate-800 font-mono text-xs">order</code>{" "}
                    that visually reorders fields so tab jumps around.
                  </li>
                  <li>
                    A modal that opens but leaves focus behind it on the page underneath.
                  </li>
                  <li>
                    An expandable menu whose options come last in the DOM, so focus skips
                    the rest of the page first.
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
              Keep DOM order and visual order aligned
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              When CSS reorders elements visually, focus still follows the source and the
              two diverge. Order the DOM the way the page reads.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{domOrderHtml}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Use only tabindex 0 and -1
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Positive <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">tabindex</code>{" "}
              values override natural order and scramble the sequence. Let the DOM drive
              the order instead.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{tabindexHtml}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Manage focus in a modal dialog
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Widgets that show and hide content must move focus deliberately: into the
              dialog on open, trapped while open, and back to the trigger on close.
            </p>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{modalJs}</code>
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
              Tab through the two live forms below to feel the difference between a natural
              order and one scrambled by positive{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">tabindex</code>{" "}
              values, then use the buttons to step through each focus stop and see which
              ones break the expected sequence.
            </p>
            <FocusOrderDemo />
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
                "Positive tabindex values (tabindex=\"1\" and higher) that pull elements to the front and scramble the whole page order.",
                "Using CSS flexbox order, grid placement, or absolute positioning to reorder content visually while leaving the DOM in a different sequence.",
                "Modal dialogs that open without moving focus in, so focus stays on the page behind the overlay.",
                "Modals that fail to trap focus, letting Tab escape into the obscured page underneath.",
                "Not returning focus to the triggering control when a dialog, menu, or popover closes.",
                "Dropdown and accordion content placed at the end of the DOM, so its options are reached long after the visible trigger.",
                "Off-screen or 'hidden' content that is still focusable, sending focus to elements the user cannot see.",
                "Reordering list or grid items with JavaScript for visual effect without keeping the DOM order in sync.",
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
              How to test for 2.4.3
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "Tab through the whole page",
                  d: "Starting at the top, press Tab repeatedly and watch where focus goes. It should move in the order you would read the page. Note any point where focus jumps somewhere unexpected or off-screen.",
                },
                {
                  t: "Shift+Tab back through it",
                  d: "Reverse the journey with Shift+Tab. The sequence should be the exact reverse of forward tabbing. A backward order that differs from the forward one is a red flag.",
                },
                {
                  t: "Search the code for positive tabindex",
                  d: "Grep the markup for tabindex values of 1 or higher. Almost every one is a bug. Confirm only tabindex=\"0\" (add to natural order) and tabindex=\"-1\" (script focus only) remain.",
                },
                {
                  t: "Open and close every widget",
                  d: "Trigger each modal, menu, popover, and accordion by keyboard. Check that focus moves into it, stays within it while open, and returns to the trigger when it closes.",
                },
                {
                  t: "Compare DOM order to visual order",
                  d: "Where CSS positions content (flex order, grid, absolute), verify the DOM sequence still matches what is shown. Run an automated scan too, but remember tools cannot judge whether an order 'makes sense' — that is a manual check.",
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
          <CriterionLinks number="2.4.3" />

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
