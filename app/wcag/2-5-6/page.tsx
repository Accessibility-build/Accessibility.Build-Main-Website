import type { Metadata } from "next"
import Link from "next/link"
import WCAGSEOEnhancements from "@/components/wcag/seo-enhancements"
import WCAGBreadcrumb from "@/components/wcag/breadcrumb"
import { CriterionLinks } from "@/components/wcag/criterion-links"
import { RelatedContent } from "@/components/seo/related-content"

export const metadata: Metadata = {
  title: "WCAG 2.5.6 Concurrent Input Mechanisms Guide",
  description:
    "WCAG 2.5.6 says content must not restrict which input methods users can use — touch, keyboard, mouse, or stylus, in any combination. Failures, fixes, and testing.",
  keywords: [
    "WCAG 2.5.6",
    "Concurrent Input Mechanisms",
    "input modalities",
    "touch and keyboard together",
    "pointer events",
    "touchstart only handlers",
    "user agent sniffing accessibility",
    "2.5.6 test",
    "Level AAA",
    "WCAG 2.2",
  ],
  alternates: {
    canonical: "/wcag/2-5-6",
  },
  openGraph: {
    title: "WCAG 2.5.6 Concurrent Input Mechanisms Guide",
    description:
      "Users switch between touch, keyboard, mouse, and stylus mid-task. 2.5.6 forbids restricting input modalities — with code patterns that support them all concurrently.",
    url: "/wcag/2-5-6",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: "/api/og?title=WCAG%202.5.6%20Concurrent%20Input%20Mechanisms&section=WCAG",
        width: 1200,
        height: 630,
        alt: "WCAG 2.5.6 Concurrent Input Mechanisms guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WCAG 2.5.6 Concurrent Input Mechanisms Guide",
    description:
      "Don't lock users into one input method. Why touchstart-only handlers and device sniffing fail WCAG 2.5.6, and how pointer events support every modality at once.",
    images: [
      "/api/og?title=WCAG%202.5.6%20Concurrent%20Input%20Mechanisms&section=WCAG",
    ],
  },
}

const faqs = [
  {
    q: "What does WCAG 2.5.6 Concurrent Input Mechanisms require?",
    a: "It requires that web content does not restrict use of the input modalities available on a platform, except where the restriction is essential, required to ensure the security of the content, or required to respect user settings. If the user's device offers touch, keyboard, mouse, stylus, or voice input, your page must let them use any of those — and switch between them at any moment — rather than locking interaction to the one modality you assumed. It is a Level AAA criterion under Guideline 2.5 Input Modalities, introduced in WCAG 2.1.",
  },
  {
    q: "Who actually switches input methods mid-task?",
    a: "More people than most teams assume. A user with tremor may navigate a tablet mainly by touch but plug in a keyboard for text entry. A wheelchair user may pair a phone with a switch device. A laptop user with a touchscreen alternates between trackpad, screen, and keyboard constantly. Someone using voice control dictates into the same form they scroll by touch. The point of 2.5.6 is that the availability of one modality never justifies disabling another — users combine them in whatever way their bodies and situations require.",
  },
  {
    q: "What are the allowed exceptions in 2.5.6?",
    a: "Three: essential (the restriction is fundamental to the activity — a drawing app that interprets stylus pressure can legitimately be stylus-centric for the canvas itself), security (for example, restricting input in ways genuinely needed to protect content), and user settings (respecting a preference the user themselves chose, such as an on-screen keyboard being suppressed because the user configured a hardware keyboard). Convenience, design simplicity, and 'we only tested touch' are not exceptions.",
  },
  {
    q: "Does detecting 'mobile' and hiding features violate 2.5.6?",
    a: "Serving a responsive layout is fine — the criterion is about input, not screen size. The failure pattern is inferring input capability from device sniffing: assuming a small screen means touch-only and therefore removing keyboard interactivity, disabling hover-dependent features without alternatives, or blocking mouse events. A phone with a paired Bluetooth keyboard and mouse is a normal setup for many disabled users, and a 'mobile' page that ignores keyboard events restricts a modality the platform provides — exactly what 2.5.6 forbids.",
  },
  {
    q: "How do pointer events help meet 2.5.6?",
    a: "The Pointer Events API (pointerdown, pointerup, pointermove) fires uniformly for mouse, touch, and stylus, so one code path serves every pointing modality without sniffing. Combine pointer events for pointing input, standard click handlers (which fire for taps, clicks, and keyboard activation of buttons and links), and keydown handlers for widget-specific keys, and your interface naturally supports concurrent modalities. Problems arise when code listens only to touchstart or only to mousedown — each of those silently excludes the other family of devices.",
  },
  {
    q: "How is 2.5.6 different from 2.1.1 Keyboard?",
    a: "2.1.1 (Level A) guarantees one specific modality: all functionality must be operable through a keyboard interface. 2.5.6 (Level AAA) generalizes the principle to every modality the platform offers: don't restrict any of them, and don't force the user to stay in one. A page could pass 2.1.1 (keyboard works) yet fail 2.5.6 by suppressing touch interaction when a keyboard is detected, or by disabling keyboard handlers on touch devices. Related criteria in the same guideline include 2.5.1 Pointer Gestures and 2.5.2 Pointer Cancellation, which govern how pointer input itself must behave.",
  },
]

export default function WCAG256Page() {
  return (
    <>
      <WCAGSEOEnhancements
        title="WCAG 2.5.6: Concurrent Input Mechanisms"
        description="Web content does not restrict use of input modalities available on a platform except where the restriction is essential, required for security, or required to respect user settings."
        criteria="2.5.6"
        level="AAA"
        principle="Operable"
        guideline="2.5 Input Modalities"
        url="https://accessibility.build/wcag/2-5-6"
        category="Input Modalities"
        hasInteractiveDemo={false}
        relatedCriteria={["2.1.1", "2.5.1", "2.5.2"]}
      />

      <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <WCAGBreadcrumb
            items={[]}
            current="2.5.6 Concurrent Input Mechanisms"
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
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                Never assume one input
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
              WCAG 2.5.6: Concurrent Input Mechanisms
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              People do not use one input method — they use whichever works
              for them, moment to moment: touch, then keyboard, then stylus,
              then voice. This criterion requires that{" "}
              <strong className="text-slate-900 dark:text-white">
                your content never restricts the input modalities the platform
                makes available
              </strong>
              . Detecting a touchscreen is not permission to ignore the
              keyboard; detecting a mouse is not permission to block touch.
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
              Web content does not restrict use of input modalities available
              on a platform except where the restriction is essential, required
              to ensure the security of the content, or required to respect
              user settings.
            </blockquote>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4 text-sm">
              &ldquo;Input modalities&rdquo; means the ways a user can provide
              input — keyboard, mouse, touch, stylus, voice, switch devices.
              The three exceptions are narrow: a restriction must be{" "}
              <em>essential</em> to the activity, genuinely required for{" "}
              <em>security</em>, or made to <em>respect a setting the user
              chose</em>. &ldquo;We designed for touch&rdquo; is none of these.
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
                <a className="hover:underline" href="#restrictions">
                  What counts as a restriction
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
                <a className="hover:underline" href="#related">
                  Relationship to 2.1.1 and 2.5.x
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
              The assumption this criterion attacks is &ldquo;one device, one
              input.&rdquo; Real setups are hybrid: touch laptops, tablets with
              keyboards, phones driven by switch access, desktops with voice
              control. For many disabled users, the <em>combination</em> is the
              accommodation — and content that hard-binds itself to a single
              modality breaks exactly that.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  t: "People using adaptive hardware",
                  d: "External keyboards, switch devices, head pointers, and eye-gaze systems are routinely paired with phones and tablets. A 'touch-only' page shuts them all out.",
                },
                {
                  t: "People with tremor or fatigue",
                  d: "May tap large targets by touch but type via keyboard, or start with a mouse and switch to keyboard as fatigue builds during a long session.",
                },
                {
                  t: "Voice control users",
                  d: "Dragon and built-in voice access simulate clicks and keystrokes. Handlers wired to touch coordinates or hover states alone leave nothing for voice to trigger.",
                },
                {
                  t: "Everyone with hybrid devices",
                  d: "Touchscreen laptops and convertibles are mainstream. Users flow between trackpad, screen, and keys without thinking — until a page stops responding to one of them.",
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

          {/* Restrictions */}
          <section aria-labelledby="restrictions" className="mb-12">
            <h2
              id="restrictions"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              What counts as a restriction
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              A restriction is anything that makes functionality unavailable to
              an input mechanism the platform supports. It is usually
              accidental — a byproduct of event-handler choices or device
              detection rather than a deliberate lockout:
            </p>
            <ul className="space-y-3 mb-4">
              {[
                "Listening only for touch events (touchstart/touchend), so mouse clicks and keyboard activation do nothing.",
                "Listening only for mouse events (mousedown/mouseover), so touch and keyboard users cannot operate the control.",
                "User-agent or screen-size sniffing that disables keyboard handlers, hover menus, or shortcuts on 'mobile' — even when a keyboard is attached.",
                "Removing focusability (tabindex=\"-1\", deleted outlines, keydown handlers stripped) on touch devices as a 'cleanup'.",
                "Requiring a modality the user may not have: hover-only reveals with no focus/click equivalent, or keyboard shortcuts as the sole path to a feature.",
                "Interaction that stops working when the user switches mid-task — e.g., a drag begun with touch that cannot be completed or cancelled with the keyboard-accessible alternative.",
              ].map((s) => (
                <li
                  key={s}
                  className="flex gap-3 rounded-lg border border-slate-200 dark:border-slate-800 p-4"
                >
                  <span aria-hidden="true" className="text-blue-500 font-bold">
                    →
                  </span>
                  <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {s}
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              What is <em>not</em> a restriction: adapting presentation to the
              likely input (bigger targets when touch is in use, hover niceties
              when a fine pointer is present) — as long as every modality can
              still operate everything. Enhancement per modality is good
              design; exclusivity per modality is the failure.
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
              Prefer input-neutral events
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                click
              </code>{" "}
              on a real button fires for mouse, touch, stylus, keyboard, and
              voice control alike. Pointer events unify all pointing devices
              when you need lower-level control.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`// ✗ Touch-only: mouse, keyboard, and voice get nothing
el.addEventListener("touchstart", activate);

// ✓ One neutral handler serves every modality
button.addEventListener("click", activate);

// ✓ Need pointer-level detail? pointer events cover
//   mouse + touch + stylus in a single code path
canvas.addEventListener("pointerdown", startStroke);
canvas.addEventListener("pointermove", continueStroke);
canvas.addEventListener("pointerup", endStroke);`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Detect capabilities, never devices — and keep both paths alive
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Media queries like{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                pointer
              </code>{" "}
              and{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                hover
              </code>{" "}
              may be used to <em>enhance</em> for the current input — but the
              interaction must keep working when the user switches.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`/* ✗ Assumes coarse pointer means 'no keyboard exists' */
// if (isMobileUA) removeKeyboardHandlers();  // never do this

/* ✓ Enhance sizing for coarse pointers; restrict nothing */
@media (pointer: coarse) {
  .toolbar button { min-width: 44px; min-height: 44px; }
}

/* ✓ Hover is an enhancement; focus/click path always exists */
.menu-panel { display: none; }
.menu:hover .menu-panel,
.menu:focus-within .menu-panel,
.menu[data-open="true"] .menu-panel { display: block; }`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Custom widgets: wire pointer and keyboard together
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Anything draggable or gesture-driven needs a concurrent keyboard
              path — the same requirement 2.1.1 and 2.5.7 impose, kept
              switchable at any moment.
            </p>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- ✓ Slider operable by any modality, at any moment -->
<div role="slider" tabindex="0"
     aria-valuemin="0" aria-valuemax="100" aria-valuenow="50"
     aria-label="Volume">
</div>
<script>
  slider.addEventListener("pointerdown", beginDrag); // mouse/touch/pen
  slider.addEventListener("keydown", (e) => {        // keyboard, always on
    if (e.key === "ArrowRight") step(+1);
    if (e.key === "ArrowLeft")  step(-1);
  });
</script>`}</code>
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
                "touchstart/touchend as the only activation events, leaving buttons dead to mouse clicks and keyboard Enter/Space.",
                "User-agent sniffing that serves a 'mobile' experience with keyboard support stripped out — breaking phones paired with keyboards or switch devices.",
                "Disabling touch handling when a mouse is detected (or vice versa) instead of leaving both registered.",
                "Hover-only menus and tooltips with no focus or tap equivalent, making content unreachable for touch and keyboard alike.",
                "Canvas or game UIs that read only mouse coordinates, ignoring touch, stylus, and keyboard entirely.",
                "Virtual keyboards or PIN pads that block hardware keyboard input without a genuine security requirement.",
                "Tearing down event listeners on resize/orientation change on the assumption that the input modality changed with the viewport.",
                "Onboarding flows that force a gesture ('swipe to continue') with no button or key alternative.",
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
              How to test for 2.5.6
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "Test each modality end-to-end",
                  d: "Complete the page's key tasks three times: keyboard only, mouse/trackpad only, and touch only (real device or DevTools touch emulation). Every task must be completable in each mode.",
                },
                {
                  t: "Switch modalities mid-task",
                  d: "Start a form by touch, finish with a keyboard; open a menu with the mouse, choose an item with arrow keys. Nothing should break, reset, or refuse the second input method.",
                },
                {
                  t: "Attach a keyboard and mouse to a touch device",
                  d: "Pair a Bluetooth keyboard (and mouse, where supported) with a phone or tablet and use the page. This is the single most revealing 2.5.6 test — it exposes 'mobile means touch-only' assumptions immediately.",
                },
                {
                  t: "Audit the event-handler code",
                  d: "Search for touchstart/touchend, mousedown/mouseup, and user-agent checks. Each occurrence should either be paired with equivalents for the other modalities or replaced with click/pointer events.",
                },
                {
                  t: "Scrutinize any claimed exception",
                  d: "For each deliberate restriction, verify it is essential to the activity, genuinely required for security, or honoring a setting the user chose. Document the justification — 'the design assumed touch' does not qualify.",
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

          {/* Related */}
          <section aria-labelledby="related" className="mb-12">
            <h2
              id="related"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Relationship to 2.1.1 and the 2.5.x family
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              <Link
                href="/wcag/2-1-1"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                2.1.1 Keyboard
              </Link>{" "}
              (Level A) guarantees the keyboard specifically: all functionality
              must be keyboard-operable. 2.5.6 generalizes it: no modality the
              platform offers may be restricted, and users must be free to
              combine them. Meeting 2.1.1 gets you the keyboard path; 2.5.6
              asks you not to take the others away.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Within Guideline 2.5, this criterion complements 2.5.1 Pointer
              Gestures (complex gestures need single-pointer alternatives),
              2.5.2 Pointer Cancellation (accidental presses must be
              abortable), and{" "}
              <Link
                href="/wcag/2-5-7"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                2.5.7 Dragging Movements
              </Link>{" "}
              (dragging needs a non-drag alternative). Together they describe
              one philosophy: accept input however the user can give it.
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

          <CriterionLinks number="2.5.6" />
        </article>

        {/* Related content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <RelatedContent
            content="concurrent input mechanisms input modalities touch keyboard mouse stylus pointer events touchstart user agent sniffing keyboard accessible pointer gestures dragging movements WCAG 2.5.6 Level AAA"
            maxItems={6}
          />
        </section>
      </div>
    </>
  )
}
