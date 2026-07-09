import type { Metadata } from "next"
import Link from "next/link"
import WCAGSEOEnhancements from "@/components/wcag/seo-enhancements"
import WCAGBreadcrumb from "@/components/wcag/breadcrumb"
import { CriterionLinks } from "@/components/wcag/criterion-links"
import { RelatedContent } from "@/components/seo/related-content"

export const metadata: Metadata = {
  title: "WCAG 2.5.2 Pointer Cancellation — The Up-Event Rule",
  description:
    "Complete guide to WCAG 2.5.2 Pointer Cancellation. Why actions must fire on the up-event, the four ways to conform, mousedown vs click code examples, and how to test.",
  keywords: [
    "WCAG 2.5.2",
    "Pointer Cancellation",
    "up-event",
    "down-event",
    "mousedown vs click",
    "touchstart accessibility",
    "accidental activation",
    "abort or undo",
    "single pointer",
    "motor disability",
    "Level A",
    "WCAG 2.2",
    "input modalities",
  ],
  alternates: {
    canonical: "/wcag/2-5-2",
  },
  openGraph: {
    type: "website",
    title: "WCAG 2.5.2 Pointer Cancellation — The Up-Event Rule",
    description:
      "Why actions must complete on the up-event, the four ways to conform to WCAG 2.5.2, mousedown vs click code examples, common failures, and how to test.",
    url: "/wcag/2-5-2",
    images: [
      {
        url: "/api/og?title=WCAG%202.5.2%20Pointer%20Cancellation&section=WCAG",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WCAG 2.5.2 Pointer Cancellation — The Up-Event Rule",
    description:
      "Users must be able to cancel an accidental press. The four ways to conform to WCAG 2.5.2, mousedown vs click examples, and how to test.",
  },
}

const faqs = [
  {
    q: "What does WCAG 2.5.2 Pointer Cancellation require?",
    a: "For any functionality operated with a single pointer (mouse, finger, stylus), at least one of four conditions must hold: the down-event does not execute any part of the function (No Down-Event); the function completes on the up-event and can be aborted before completion or undone afterwards (Abort or Undo); the up-event reverses whatever the down-event did (Up Reversal); or completing on the down-event is essential (Essential). In practice, the simplest and most common way to conform is to trigger actions on the up-event — which is exactly what a standard click event does. It is a Level A criterion introduced in WCAG 2.1.",
  },
  {
    q: "Does using the standard click event automatically pass 2.5.2?",
    a: "For that control, yes. The browser's click event (and the default activation of <button>, <a>, and <input>) fires only when the pointer is released over the same element it was pressed on. Pressing down, sliding the pointer off the element, and releasing cancels the action — which is exactly the abort mechanism the criterion describes. You only create 2.5.2 risk when you attach behavior to mousedown, touchstart, or pointerdown, or when a library does so under the hood.",
  },
  {
    q: "Why do down-event activations hurt users?",
    a: "The down-event is instant and unforgiving. People with tremors, spasms, or limited dexterity frequently touch the wrong point on the screen; users of head pointers or styluses may land slightly off target; anyone can brush a touchscreen accidentally. When actions fire on the up-event, all of these slips are recoverable — the user slides away and releases, and nothing happens. When actions fire on the down-event, every accidental contact becomes an irreversible activation: an item deleted, a payment sent, a menu triggered.",
  },
  {
    q: "When is down-event activation 'essential'?",
    a: "When the functionality only makes sense if it responds to the press itself. The W3C's example is an on-screen piano keyboard: a note must sound the instant the key is pressed, or the instrument is unplayable. Similarly, functions that emulate a physical keypress (an on-screen keyboard) are considered essential by note in the criterion, because they must mirror how a real keyboard behaves. Drag-and-drop is also fine: pressing down picks the item up, but that down-event only starts the interaction — the user can still abort by releasing the item back where it was or pressing Escape.",
  },
  {
    q: "How does 2.5.2 interact with drag-and-drop?",
    a: "Drag interactions typically conform through the Abort or Undo path. The down-event begins the drag (it does not complete the function), and the drop — the up-event — completes it. To conform, users need a way to abort mid-drag, such as releasing the item over its original position or a non-target area, or pressing Escape to cancel. Offering undo after the drop is an equally valid mechanism. Note that dragging itself also needs a single-pointer, non-dragging alternative under 2.5.7 Dragging Movements (Level AA).",
  },
  {
    q: "Does 2.5.2 apply to keyboard interactions too?",
    a: "No — it applies specifically to functionality operated with a single pointer. Keyboard behavior is governed by other criteria such as 2.1.1 Keyboard. There is a keyboard parallel worth knowing, though: activating on keydown rather than keyup has similar accidental-activation problems, and platform conventions (like Space activating buttons on keyup) exist for the same reason. But a keydown-triggered action is not a 2.5.2 failure; only pointer down-events are in scope.",
  },
]

export default function WCAG252Page() {
  return (
    <>
      <WCAGSEOEnhancements
        title="WCAG 2.5.2 Pointer Cancellation"
        description="For functionality operated with a single pointer, the down-event is not used to execute the function, or the action can be aborted, undone, or reversed"
        criteria="2.5.2"
        level="A"
        principle="Operable"
        guideline="Input Modalities"
        url="https://accessibility.build/wcag/2-5-2"
        category="Input Modalities"
        wordCount={2800}
        timeToRead={9}
        hasInteractiveDemo={false}
        relatedCriteria={["2.5.1", "2.5.4", "2.5.7", "3.3.4"]}
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
          <WCAGBreadcrumb items={[]} current="2.5.2 Pointer Cancellation" />

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
                Introduced in WCAG 2.1
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
              WCAG 2.5.2: Pointer Cancellation
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              Everyone mis-taps. The question is whether a mis-tap is recoverable. This
              criterion requires that{" "}
              <strong className="text-slate-900 dark:text-white">
                pressing down on a control never irreversibly triggers it
              </strong>
              . Fire actions when the pointer is released — the way a native{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-lg">
                click
              </code>{" "}
              works — so a user who lands on the wrong target can slide off and let go
              without consequence.
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
              <p className="mb-3">
                For functionality that can be operated using a single pointer, at
                least one of the following is true:
              </p>
              <ul className="space-y-2 list-disc pl-5">
                <li>
                  <strong>No Down-Event:</strong> The down-event of the pointer is not
                  used to execute any part of the function;
                </li>
                <li>
                  <strong>Abort or Undo:</strong> Completion of the function is on the
                  up-event, and a mechanism is available to abort the function before
                  completion or to undo the function after completion;
                </li>
                <li>
                  <strong>Up Reversal:</strong> The up-event reverses any outcome of
                  the preceding down-event;
                </li>
                <li>
                  <strong>Essential:</strong> Completing the function on the
                  down-event is essential.
                </li>
              </ul>
            </blockquote>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4 text-sm">
              The W3C notes that functions emulating a keyboard or numeric keypad key
              press are considered essential, and that the requirement applies to web
              content that interprets pointer actions — not to actions required to
              operate the browser or assistive technology.
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
                <a className="hover:underline" href="#four-ways">
                  The four ways to conform
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
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Touching a screen or pressing a mouse button is a two-part act: contact
              down, then release. Between those two moments is the only window a user
              has to change their mind. People with motor disabilities need that
              window far more often than others — and everyone needs it sometimes.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              {[
                {
                  t: "People with tremors or spasms",
                  d: "Involuntary movement means fingers land on unintended targets regularly. Up-event activation lets them slide off and release harmlessly instead of triggering whatever they touched.",
                },
                {
                  t: "People with limited dexterity or fatigue",
                  d: "Precisely hitting a small target is hard work. When the down-event is safe, an off-target press costs nothing — the user simply repositions before releasing.",
                },
                {
                  t: "People with low vision or cognitive disabilities",
                  d: "Users may press a control, then realise from context it is the wrong one. A cancellable press gives them a moment to verify before committing.",
                },
                {
                  t: "Every touchscreen user",
                  d: "Bumped phones, palm touches, taps in a moving vehicle — accidental contact is universal. Up-event activation is why native buttons feel forgiving.",
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
              The stakes scale with the action. An accidental tooltip is a nuisance; an
              accidental &ldquo;Delete&rdquo;, &ldquo;Send&rdquo;, or &ldquo;Buy
              now&rdquo; on the down-event is data loss or money spent. For
              legal and financial transactions,{" "}
              <Link
                href="/wcag/3-3-4"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                3.3.4 Error Prevention
              </Link>{" "}
              adds further protection on top of this criterion.
            </p>
          </section>

          {/* Four ways */}
          <section aria-labelledby="four-ways" className="mb-12">
            <h2
              id="four-ways"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              The four ways to conform
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              You only need to satisfy <em>one</em> of the four conditions for each
              pointer-operated function. In order of how often they apply in real
              interfaces:
            </p>
            <ol className="space-y-4">
              {[
                {
                  t: "No Down-Event (the default — use click)",
                  d: "The down-event does not execute any part of the function. Native activation of <button>, <a>, and <input>, and the JavaScript click event, all fire on release. If you never attach behavior to mousedown, touchstart, or pointerdown, you conform automatically. This is the right answer for almost every control.",
                },
                {
                  t: "Abort or Undo",
                  d: "The function completes on the up-event, and the user can either abort before completion (slide off the target before releasing, press Escape mid-drag) or undo afterwards (an Undo button or snackbar). This is the usual path for drag-and-drop and destructive actions.",
                },
                {
                  t: "Up Reversal",
                  d: "The up-event reverses what the down-event started. Press-and-hold interactions work this way: pressing down on a thumbnail pops up a preview, releasing dismisses it. Nothing persists after release, so nothing needs cancelling.",
                },
                {
                  t: "Essential",
                  d: "Completing on the down-event is essential to the function. On-screen piano keys must sound on press; on-screen keyboards must emulate physical key-down behavior (the W3C note explicitly treats keyboard emulation as essential). This exception is narrow — convenience or perceived snappiness does not qualify.",
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
                  Pass: standard buttons activated by click
                </h3>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                  A checkout page uses native buttons with click handlers. A user who
                  presses &ldquo;Place order&rdquo; by mistake slides their finger off
                  the button and releases — nothing happens. No Down-Event: satisfied.
                </p>
              </div>
              <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/20 p-5">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  <span aria-hidden="true" className="text-emerald-600 mr-2">
                    ✓
                  </span>
                  Pass: drag-and-drop with Escape to abort
                </h3>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                  A kanban board starts a drag on pointer-down, but the card only
                  moves lists when dropped. Mid-drag, pressing Escape or dropping the
                  card outside any list returns it to its origin. Abort available:
                  satisfied.
                </p>
              </div>
              <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/20 p-5">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  <span aria-hidden="true" className="text-emerald-600 mr-2">
                    ✓
                  </span>
                  Pass (essential): on-screen piano
                </h3>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                  A music-education site plays a note the instant a key is pressed and
                  stops it on release. Sounding on down is what makes it a playable
                  instrument — the Essential exception applies.
                </p>
              </div>
              <div className="rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-5">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  <span aria-hidden="true" className="text-rose-500 mr-2">
                    ✗
                  </span>
                  Fail: delete on pointer-down
                </h3>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                  A file manager binds row deletion to <code>mousedown</code> to feel
                  &ldquo;snappy&rdquo;. The instant a user with a tremor brushes the
                  wrong row&rsquo;s delete icon, the file is gone — no abort, no undo.
                </p>
              </div>
              <div className="rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-5">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  <span aria-hidden="true" className="text-rose-500 mr-2">
                    ✗
                  </span>
                  Fail: menu items firing on touchstart
                </h3>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                  A custom dropdown navigates to a page on <code>touchstart</code> to
                  shave off perceived latency. Users scrolling past the menu or
                  landing one item off are navigated away with no chance to cancel.
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
              The core rule: click, not mousedown
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              The failing version executes on the down-event. The passing version uses{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                click
              </code>
              , which the browser only fires when press and release happen on the same
              element — cancellation built in.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`// ✗ Fails: the down-event executes the function
deleteButton.addEventListener("mousedown", () => deleteItem(id));
deleteButton.addEventListener("touchstart", () => deleteItem(id));

// ✓ Passes: click fires on release, and releasing off-target cancels
deleteButton.addEventListener("click", () => deleteItem(id));`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Custom pointer handling that preserves cancellation
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              If you must use pointer events (for a custom control), complete the
              action only on <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">pointerup</code>{" "}
              and only when the pointer is still over the target.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`let pressedElement = null;

control.addEventListener("pointerdown", (e) => {
  // ✓ Down-event only records intent — it executes nothing
  pressedElement = e.currentTarget;
});

control.addEventListener("pointerup", (e) => {
  const stillOverTarget =
    pressedElement === e.currentTarget &&
    e.currentTarget.contains(document.elementFromPoint(e.clientX, e.clientY));

  // ✓ Releasing outside the control aborts the action
  if (stillOverTarget) activate();
  pressedElement = null;
});

control.addEventListener("pointercancel", () => {
  pressedElement = null; // scrolling or system gestures abort too
});`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Drag-and-drop with abort and undo (React)
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              The down-event may begin a drag, because beginning is not completing.
              Provide an Escape abort during the drag and an undo after the drop.
            </p>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`function Board() {
  const [dragging, setDragging] = useState(null)
  const [lastMove, setLastMove] = useState(null)

  useEffect(() => {
    function onKeyDown(e) {
      // ✓ Abort: Escape cancels an in-progress drag
      if (e.key === "Escape" && dragging) setDragging(null)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [dragging])

  function handleDrop(card, toColumn) {
    setLastMove({ card, from: card.column, to: toColumn })
    moveCard(card, toColumn) // completion happens on the up-event (drop)
  }

  return (
    <>
      <Columns onDragStart={setDragging} onDrop={handleDrop} />
      {lastMove && (
        // ✓ Undo: the completed action can be reversed
        <button type="button" onClick={() => moveCard(lastMove.card, lastMove.from)}>
          Undo move
        </button>
      )}
    </>
  )
}`}</code>
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
                "Binding actions to mousedown, touchstart, or pointerdown to make the UI feel faster — every accidental press becomes an activation.",
                "Custom components (in any framework) that activate in the down handler and provide no abort or undo mechanism.",
                "Game-like or canvas interfaces where pressing anywhere immediately commits an action that cannot be reversed.",
                "Drag-and-drop implementations with no way to abort mid-drag (no Escape handling, no safe drop-back) and no undo after the drop.",
                "Press-and-hold controls where the down-event already performs a persistent action instead of a transient preview.",
                "Third-party widget libraries that fire on the down-event by default — you own the failure if you ship it.",
                "Claiming the essential exception for ordinary buttons or menus; essential covers keyboard emulators and instruments, not perceived snappiness.",
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
              How to test for 2.5.2
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "Press down and hold on every interactive element",
                  d: "With a mouse or finger, press each button, link, and custom control and do not release. If anything happens while you are still holding — navigation, deletion, submission, a toggled state — the down-event is executing the function. Note it for step 4.",
                },
                {
                  t: "Press, slide off, and release",
                  d: "Press down on the control, move the pointer off it, then release. Nothing should activate. This is the abort behavior that native click gives you for free; custom controls must replicate it.",
                },
                {
                  t: "Search the code for down-event handlers",
                  d: "Grep for mousedown, touchstart, and pointerdown (and framework equivalents like onMouseDown, onTouchStart, onPointerDown). Each hit needs review: recording intent or starting a drag is fine; executing the function is not.",
                },
                {
                  t: "Check remaining down-event activations for an escape route",
                  d: "For every function that does execute on the down-event, verify one of the other conditions: does the up-event reverse it (press-and-hold preview)? Is there an abort or undo? Is it genuinely essential (keyboard emulation, instrument)? If none apply, it fails.",
                },
                {
                  t: "Test drags for abort and undo",
                  d: "Start a drag, then try to cancel: press Escape, or drop outside any valid target. The item should return to its origin. If a drop cannot be aborted, check for an undo mechanism after completion.",
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
              Automated scanners cannot tell what your event handlers do, so 2.5.2 is
              a manual and code-review test. Fold it into the full{" "}
              <Link
                href="/checklists/wcag-2-2"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                WCAG 2.2 checklist
              </Link>{" "}
              alongside the other input-modality criteria.
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

          <CriterionLinks number="2.5.2" />
        </article>

        {/* Related content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <RelatedContent
            content="pointer cancellation up-event down-event mousedown touchstart click accidental activation abort undo drag and drop cancel motor disability input modalities WCAG 2.5.2 Level A"
            maxItems={6}
          />
        </section>
      </div>
    </>
  )
}
