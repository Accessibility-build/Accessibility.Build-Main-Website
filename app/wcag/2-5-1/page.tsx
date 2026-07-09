import type { Metadata } from "next"
import Link from "next/link"
import WCAGSEOEnhancements from "@/components/wcag/seo-enhancements"
import WCAGBreadcrumb from "@/components/wcag/breadcrumb"
import { CriterionLinks } from "@/components/wcag/criterion-links"
import { RelatedContent } from "@/components/seo/related-content"

export const metadata: Metadata = {
  title: "WCAG 2.5.1 Pointer Gestures — Gesture Alternatives",
  description:
    "Complete guide to WCAG 2.5.1 Pointer Gestures. What counts as a multipoint or path-based gesture, the single-pointer alternatives you must provide, code examples, and how to test.",
  keywords: [
    "WCAG 2.5.1",
    "Pointer Gestures",
    "multipoint gestures",
    "path-based gestures",
    "pinch to zoom accessibility",
    "swipe gesture accessibility",
    "single pointer alternative",
    "carousel swipe accessibility",
    "touch gesture accessibility",
    "motor disability",
    "Level A",
    "WCAG 2.2",
    "input modalities",
  ],
  alternates: {
    canonical: "/wcag/2-5-1",
  },
  openGraph: {
    type: "website",
    title: "WCAG 2.5.1 Pointer Gestures — Gesture Alternatives",
    description:
      "What counts as a multipoint or path-based gesture, the single-pointer alternatives WCAG 2.5.1 requires, the essential exception, code examples, and how to test.",
    url: "/wcag/2-5-1",
    images: [
      {
        url: "/api/og?title=WCAG%202.5.1%20Pointer%20Gestures&section=WCAG",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WCAG 2.5.1 Pointer Gestures — Gesture Alternatives",
    description:
      "Pinch, swipe, and multi-finger gestures need single-pointer alternatives. What WCAG 2.5.1 requires, the essential exception, code examples, and how to test.",
  },
}

const faqs = [
  {
    q: "What does WCAG 2.5.1 Pointer Gestures require?",
    a: "It requires that all functionality operated with multipoint gestures (two or more fingers, like pinch-to-zoom) or path-based gestures (where the movement path matters, like swiping a carousel) can also be operated with a single pointer without a path-based gesture — unless the gesture is essential. In practice that means simple taps or clicks on visible controls must be able to do everything the fancy gestures do. It is a Level A criterion introduced in WCAG 2.1 and unchanged in WCAG 2.2.",
  },
  {
    q: "What is the difference between a path-based gesture and a simple drag?",
    a: "A path-based gesture depends on the direction or path of the pointer movement, not just its start and end points — swiping left to advance a carousel, or drawing a shape to trigger a command. A drag-and-drop operation where only the start and end points matter is not path-based, so it is not covered by 2.5.1. Dragging is instead covered by WCAG 2.5.7 Dragging Movements (Level AA, new in WCAG 2.2), which requires a single-pointer alternative for drags. The two criteria are complementary: 2.5.1 covers direction-dependent gestures, 2.5.7 covers point-to-point dragging.",
  },
  {
    q: "Does 2.5.1 apply to browser or operating-system gestures like scrolling?",
    a: "No. The criterion applies only to gestures that your web content itself interprets — the W3C note states it does not apply to actions required to operate the user agent or assistive technology. Two-finger scrolling handled by the browser, OS-level back-swipes, and screen reader gestures are out of scope. But the moment your JavaScript listens for touch or pointer events and implements its own gesture — a custom pinch-zoom on an image, a swipeable card stack — 2.5.1 applies to that functionality.",
  },
  {
    q: "When is a gesture 'essential' under 2.5.1?",
    a: "A gesture is essential when removing it would fundamentally change the functionality. The classic example is a signature field: the whole point is to capture the user's freehand path, so a path-based gesture is essential and no alternative is required (though 2.5.2 Pointer Cancellation and other criteria still apply). A drawing canvas in an art application is similar. By contrast, pinch-zooming a map is not essential — zoom buttons can achieve the same result — so an alternative is required.",
  },
  {
    q: "Do I need to remove gestures like swipe and pinch to pass 2.5.1?",
    a: "No — keep them. Gestures are fast and convenient for the users who can perform them. The criterion only asks that they are not the only way to operate the functionality. A carousel can keep its swipe as long as visible previous/next buttons exist; a map can keep pinch-zoom as long as it has zoom in/out buttons. Progressive enhancement is the right mental model: single-pointer controls are the baseline, gestures are the enhancement.",
  },
  {
    q: "How is 2.5.1 different from 2.1.1 Keyboard?",
    a: "2.1.1 Keyboard requires functionality to be operable from a keyboard interface; 2.5.1 requires gesture-driven functionality to be operable with a single pointer such as one finger or a mouse click. They protect overlapping but distinct groups: someone using a head pointer or single finger may not use a keyboard at all, and a keyboard-only user cannot perform any pointer gesture. A well-built control — say a carousel with focusable next/previous buttons — typically satisfies both at once, because a real button is both clickable and keyboard-operable.",
  },
]

export default function WCAG251Page() {
  return (
    <>
      <WCAGSEOEnhancements
        title="WCAG 2.5.1 Pointer Gestures"
        description="All functionality that uses multipoint or path-based gestures can be operated with a single pointer without a path-based gesture, unless the gesture is essential"
        criteria="2.5.1"
        level="A"
        principle="Operable"
        guideline="Input Modalities"
        url="https://accessibility.build/wcag/2-5-1"
        category="Input Modalities"
        wordCount={2800}
        timeToRead={9}
        hasInteractiveDemo={false}
        relatedCriteria={["2.5.2", "2.5.4", "2.5.7", "2.1.1"]}
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
          <WCAGBreadcrumb items={[]} current="2.5.1 Pointer Gestures" />

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
              WCAG 2.5.1: Pointer Gestures
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              Pinching to zoom, swiping through a carousel, drawing a shape to trigger a
              command — these gestures are impossible for many people. This criterion
              requires that{" "}
              <strong className="text-slate-900 dark:text-white">
                anything operated by a multipoint or path-based gesture can also be
                operated with a single pointer
              </strong>
              , such as one tap or one click on a visible control. Keep the gestures;
              just never make them the only way.
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
              All functionality that uses multipoint or path-based gestures for
              operation can be operated with a single pointer without a path-based
              gesture, unless a multipoint or path-based gesture is essential.
            </blockquote>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4 text-sm">
              The W3C adds a normative note: this requirement applies to web content
              that interprets pointer actions — it does <em>not</em> apply to gestures
              required to operate the browser or assistive technology (such as
              browser-level scrolling or screen reader gestures).
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
                <a className="hover:underline" href="#gestures">
                  Multipoint vs. path-based gestures
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
              Complex gestures assume two things: fine motor control and multiple
              contact points. Plenty of people have neither. Someone with a tremor
              caused by Parkinson&rsquo;s disease or cerebral palsy may be unable to
              trace a steady path across a screen. Someone with the use of one finger,
              a partial hand, or a prosthesis cannot perform a two-finger pinch at all.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              {[
                {
                  t: "People using head pointers, mouth sticks, or eye-gaze",
                  d: "These devices produce exactly one pointer. Multipoint gestures are physically impossible, and steady path-based movements are extremely difficult.",
                },
                {
                  t: "People with tremors or limited fine motor control",
                  d: "A swipe or drawn gesture requires a controlled, continuous path. Hand tremors, spasms, or fatigue make the path erratic, so the gesture never registers.",
                },
                {
                  t: "People with limited use of one hand or fingers",
                  d: "Pinch, rotate, and multi-finger taps require several simultaneous contact points that a single available finger cannot provide.",
                },
                {
                  t: "Anyone in a constrained situation",
                  d: "One hand holding a rail on a moving train, a phone operated through a glove, a stylus user — single-pointer alternatives make the interface work for everyone.",
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
              The fix is always the same shape: expose the functionality through
              ordinary, visible controls that need only a tap or click. Those controls
              also tend to satisfy{" "}
              <Link
                href="/wcag/2-1-1"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                2.1.1 Keyboard
              </Link>{" "}
              for free, because a real button is keyboard-operable too.
            </p>
          </section>

          {/* Gesture types */}
          <section aria-labelledby="gestures" className="mb-12">
            <h2
              id="gestures"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Multipoint vs. path-based gestures
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              The criterion covers two specific families of gesture, and the
              distinction matters when you audit a page:
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex gap-3 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
                <span aria-hidden="true" className="text-blue-500 font-bold">
                  →
                </span>
                <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong className="text-slate-900 dark:text-white">
                    Multipoint gestures
                  </strong>{" "}
                  use two or more contact points at once: pinch-to-zoom, two-finger
                  rotation, a three-finger tap, a split-tap. If the gesture cannot be
                  performed with one finger, it is multipoint.
                </span>
              </li>
              <li className="flex gap-3 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
                <span aria-hidden="true" className="text-blue-500 font-bold">
                  →
                </span>
                <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong className="text-slate-900 dark:text-white">
                    Path-based gestures
                  </strong>{" "}
                  depend on the direction or path of movement, not just where the
                  pointer starts and ends: swiping left to reveal a delete action,
                  flicking through carousel slides, drawing a &ldquo;Z&rdquo; to trigger
                  a shortcut, or sliding along a rating widget where the traced path is
                  what the code evaluates.
                </span>
              </li>
            </ul>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              What is <em>not</em> covered: plain drag-and-drop where only the start
              and end points matter (that is{" "}
              <Link
                href="/wcag/2-5-7"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                2.5.7 Dragging Movements
              </Link>
              , Level AA), single taps and double taps, long presses, and gestures the
              browser or operating system handles for you, such as two-finger scrolling
              of the whole page.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              The only escape hatch is the{" "}
              <strong className="text-slate-900 dark:text-white">
                essential exception
              </strong>
              : when the path itself is the point of the feature. A signature capture
              field exists precisely to record your freehand path, so no tap-based
              alternative could be equivalent. Very few features genuinely qualify —
              if buttons could achieve the same outcome, the gesture is not essential.
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
                  Pass: map with pinch-zoom and zoom buttons
                </h3>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                  An embedded map supports two-finger pinch-to-zoom, and also shows
                  visible <strong>+</strong> and <strong>−</strong> buttons that zoom
                  by one step per tap. The multipoint gesture has a single-pointer
                  alternative.
                </p>
              </div>
              <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/20 p-5">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  <span aria-hidden="true" className="text-emerald-600 mr-2">
                    ✓
                  </span>
                  Pass: carousel with swipe and next/previous buttons
                </h3>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                  Users can swipe between slides, and visible &ldquo;Previous&rdquo;
                  and &ldquo;Next&rdquo; buttons advance the carousel with a single
                  tap. The path-based swipe is an enhancement, not the only path.
                </p>
              </div>
              <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/20 p-5">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  <span aria-hidden="true" className="text-emerald-600 mr-2">
                    ✓
                  </span>
                  Pass (essential exception): signature capture
                </h3>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                  A delivery app asks the user to sign with their finger. The freehand
                  path <em>is</em> the functionality, so the path-based gesture is
                  essential and no alternative gesture is required.
                </p>
              </div>
              <div className="rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-5">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  <span aria-hidden="true" className="text-rose-500 mr-2">
                    ✗
                  </span>
                  Fail: swipe-only email actions
                </h3>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                  A webmail list lets users swipe left on a message to archive it and
                  swipe right to delete — and provides no other way to reach those
                  actions. Users who cannot swipe cannot archive or delete at all.
                </p>
              </div>
              <div className="rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-5">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  <span aria-hidden="true" className="text-rose-500 mr-2">
                    ✗
                  </span>
                  Fail: pinch-only image zoom
                </h3>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                  A product gallery implements its own pinch-to-zoom in JavaScript but
                  offers no zoom buttons, no double-tap zoom, and no other
                  single-pointer way to magnify the image. The multipoint gesture is
                  the only route, so it fails.
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
              Carousel: swipe as enhancement, buttons as baseline
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              The failing version wires up touch events and nothing else. The passing
              version keeps the swipe but drives the same function from real buttons.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- ✗ Fails: swiping is the only way to change slides -->
<div id="carousel">
  <ul class="slides">…</ul>
</div>
<script>
  const el = document.getElementById("carousel");
  let startX = 0;
  el.addEventListener("touchstart", (e) => (startX = e.touches[0].clientX));
  el.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - startX;
    if (dx < -50) nextSlide();
    if (dx > 50) prevSlide();
  });
</script>

<!-- ✓ Passes: visible buttons operate the same function with one tap -->
<div id="carousel">
  <button type="button" onclick="prevSlide()">Previous slide</button>
  <ul class="slides">…</ul>
  <button type="button" onclick="nextSlide()">Next slide</button>
  <!-- swipe listeners can stay as a convenience -->
</div>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Custom pinch-zoom with single-pointer controls (React)
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              If your component interprets multi-touch to zoom, add zoom buttons that
              change the same state. One state, two input methods.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`function ZoomableImage({ src, alt }) {
  const [scale, setScale] = useState(1)

  const zoomIn = () => setScale((s) => Math.min(s + 0.25, 4))
  const zoomOut = () => setScale((s) => Math.max(s - 0.25, 1))

  return (
    <div>
      {/* ✓ Single-pointer alternative to the pinch gesture */}
      <div role="group" aria-label="Zoom controls">
        <button type="button" onClick={zoomOut}>Zoom out</button>
        <button type="button" onClick={zoomIn}>Zoom in</button>
      </div>

      {/* Pinch handling updates the same scale state */}
      <div onTouchMove={handlePinch /* optional enhancement */}>
        <img src={src} alt={alt} style={{ transform: "scale(" + scale + ")" }} />
      </div>
    </div>
  )
}`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Swipe-to-reveal actions with an always-available menu
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              List items that reveal actions on swipe should expose the same actions
              through a tappable control on each row.
            </p>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- ✓ Every swipe action is also a plain button -->
<li class="message-row">
  <span class="subject">Quarterly report</span>
  <button type="button" aria-haspopup="menu" aria-expanded="false"
          onclick="toggleRowMenu(this)">
    Actions for “Quarterly report”
  </button>
  <div role="menu" hidden>
    <button role="menuitem" type="button" onclick="archiveMessage()">Archive</button>
    <button role="menuitem" type="button" onclick="deleteMessage()">Delete</button>
  </div>
</li>`}</code>
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
                "Carousels, image galleries, or story viewers that advance only on swipe, with no previous/next buttons.",
                "Custom pinch-to-zoom on images, charts, or maps with no zoom in/out buttons or equivalent single-tap control.",
                "Swipe-to-delete or swipe-to-archive list rows with no visible button or menu offering the same actions.",
                "Gesture shortcuts — drawing a letter or shape to trigger a command — with no discoverable button or menu equivalent.",
                "Pull-to-refresh as the only way to reload content in a web app, with no refresh button.",
                "Custom sliders or scrubbers whose value can only be set by tracing along the track, with no tap-to-set, stepper buttons, or text input.",
                "Providing an alternative that itself requires a path-based gesture — e.g. replacing a two-finger rotate with a one-finger circular drag still fails; the alternative must be tap/click based.",
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
              How to test for 2.5.1
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "Inventory every gesture the page implements",
                  d: "On a touch device (or emulator), work through the page and note every interaction that responds to swiping, pinching, rotating, multi-finger taps, or drawn shapes. Check JavaScript for touchstart/touchmove, pointermove, and gesture libraries (Hammer.js, use-gesture) to catch handlers you might miss by hand.",
                },
                {
                  t: "Attempt each function with a single tap or click",
                  d: "For every gesture found, try to achieve the same outcome using only single taps or clicks on visible controls. Advance the carousel, zoom the map, reveal the row actions. If any function has no tap/click route, it fails.",
                },
                {
                  t: "Verify the alternative is not itself path-based",
                  d: "The alternative must work without tracing a path. A control you must drag along a track is not a valid alternative — look for tap-to-activate buttons, steppers, or inputs.",
                },
                {
                  t: "Test with a mouse on desktop",
                  d: "A quick proxy: if the feature cannot be operated with ordinary mouse clicks (no click-drag paths, no wheel-only interactions), single-pointer users on touch devices are probably locked out too.",
                },
                {
                  t: "Evaluate any claimed 'essential' exceptions",
                  d: "For each gesture with no alternative, ask whether the path itself is the purpose (signature, freehand drawing). If buttons could achieve the same end result, the exception does not apply. Automated scanners cannot detect 2.5.1 failures — this is a manual test.",
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
              Work through the full{" "}
              <Link
                href="/checklists/wcag-2-2"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                WCAG 2.2 checklist
              </Link>{" "}
              to cover the neighbouring input-modality criteria at the same time —
              gestures, cancellation, and motion usually travel together.
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

          <CriterionLinks number="2.5.1" />
        </article>

        {/* Related content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <RelatedContent
            content="pointer gestures multipoint gestures path-based gestures pinch to zoom swipe carousel single pointer alternative touch accessibility motor disability input modalities dragging movements pointer cancellation WCAG 2.5.1 Level A"
            maxItems={6}
          />
        </section>
      </div>
    </>
  )
}
