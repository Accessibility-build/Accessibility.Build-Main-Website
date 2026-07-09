import type { Metadata } from "next"
import Link from "next/link"
import WCAGSEOEnhancements from "@/components/wcag/seo-enhancements"
import WCAGBreadcrumb from "@/components/wcag/breadcrumb"
import { CriterionLinks } from "@/components/wcag/criterion-links"
import { RelatedContent } from "@/components/seo/related-content"

export const metadata: Metadata = {
  title: "WCAG 2.5.4 Motion Actuation — Shake & Tilt Controls",
  description:
    "Complete guide to WCAG 2.5.4 Motion Actuation. Why shake, tilt, and camera-motion features need UI alternatives and a disable option, the two exceptions, code, and testing.",
  keywords: [
    "WCAG 2.5.4",
    "Motion Actuation",
    "shake to undo",
    "tilt to scroll",
    "device motion accessibility",
    "accelerometer accessibility",
    "devicemotion API",
    "motion controls accessibility",
    "disable motion",
    "motor disability",
    "Level A",
    "WCAG 2.2",
    "input modalities",
  ],
  alternates: {
    canonical: "/wcag/2-5-4",
  },
  openGraph: {
    type: "website",
    title: "WCAG 2.5.4 Motion Actuation — Shake & Tilt Controls",
    description:
      "Shake, tilt, and camera-motion features need conventional UI alternatives and a way to disable motion response. WCAG 2.5.4 requirements, exceptions, code, and testing.",
    url: "/wcag/2-5-4",
    images: [
      {
        url: "/api/og?title=WCAG%202.5.4%20Motion%20Actuation&section=WCAG",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WCAG 2.5.4 Motion Actuation — Shake & Tilt Controls",
    description:
      "Not everyone can shake a phone — and some people shake it accidentally. WCAG 2.5.4 requires UI alternatives and a disable option for motion-operated features.",
  },
}

const faqs = [
  {
    q: "What does WCAG 2.5.4 Motion Actuation require?",
    a: "Any functionality that can be operated by moving the device (shake, tilt, rotate — via accelerometer or gyroscope) or by user movement detected by sensors such as a camera (waving a hand) must meet two requirements: it must also be operable through conventional user interface components like buttons, and the motion response must be able to be disabled to prevent accidental actuation. Two exceptions exist: when motion is used through an accessibility-supported interface, and when motion is essential to the function. It is a Level A criterion introduced in WCAG 2.1.",
  },
  {
    q: "Why must motion response be disableable, not just have an alternative?",
    a: "Because the harm runs both ways. Some users cannot produce the motion — a phone mounted to a wheelchair cannot be shaken. Other users produce motion they do not intend: someone with a tremor or spasticity may trigger 'shake to undo' constantly, losing work each time. A button alternative solves the first problem but not the second; only the ability to turn motion detection off protects people from accidental actuation. That is why the criterion requires both.",
  },
  {
    q: "What kinds of motion does 2.5.4 cover?",
    a: "Two categories: device motion — shaking, tilting, or rotating the device, as sensed by accelerometer and gyroscope and exposed to web content through APIs like devicemotion and deviceorientation — and user motion detected by sensors, such as waving at a camera to advance a slide. It does not cover movement of the pointer (gestures are 2.5.1, dragging is 2.5.7), keyboard input, or motion the operating system itself interprets as part of an accessibility feature.",
  },
  {
    q: "What is the 'supported interface' exception?",
    a: "Motion may be used to operate functionality when it happens through an accessibility-supported interface — for example, a user who cannot press keys may deliberately configure an assistive technology that converts their head movements into simulated keystrokes or clicks. In that case the motion is the user's chosen input method, handled by their AT, and the web content is simply receiving standard input events. The exception does not cover your own custom motion features; those still need alternatives and a disable option.",
  },
  {
    q: "When is motion 'essential' under 2.5.4?",
    a: "When the function cannot exist without it. The standard example is a pedometer or step-counting app: counting steps is measuring motion, so requiring motion is intrinsic and providing a button that 'fakes' steps would invalidate the activity. Similarly, an app that measures leveling by tilt needs the tilt data. Games that merely use tilt for steering usually do not qualify — steering can be done with buttons — so they need alternatives.",
  },
  {
    q: "Does the operating system's own motion setting satisfy the 'can be disabled' requirement?",
    a: "It can help. If users can turn off motion actuation at the system or user-agent level and your content respects that, the goal of preventing accidental actuation is met. In practice, web content cannot always rely on such a setting existing on every platform, so the robust approach is to provide your own toggle — a simple 'Use motion controls' setting — and to treat motion as an opt-in enhancement layered on top of fully functional buttons.",
  },
]

export default function WCAG254Page() {
  return (
    <>
      <WCAGSEOEnhancements
        title="WCAG 2.5.4 Motion Actuation"
        description="Functionality operated by device motion or user motion can also be operated by user interface components, and motion response can be disabled"
        criteria="2.5.4"
        level="A"
        principle="Operable"
        guideline="Input Modalities"
        url="https://accessibility.build/wcag/2-5-4"
        category="Input Modalities"
        wordCount={2700}
        timeToRead={9}
        hasInteractiveDemo={false}
        relatedCriteria={["2.5.1", "2.5.2", "2.5.7", "2.1.1"]}
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
          <WCAGBreadcrumb items={[]} current="2.5.4 Motion Actuation" />

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
              WCAG 2.5.4: Motion Actuation
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              &ldquo;Shake to undo&rdquo; assumes you can shake a phone — and that you
              never shake it by accident. Both assumptions fail for many people. This
              criterion requires that{" "}
              <strong className="text-slate-900 dark:text-white">
                anything operated by device or user motion also works through ordinary
                UI controls, and that motion response can be switched off
              </strong>
              . Motion is a fine shortcut; it can never be the only way, and it must
              never be inescapable.
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
                Functionality that can be operated by device motion or user motion can
                also be operated by user interface components and responding to the
                motion can be disabled to prevent accidental actuation, except when:
              </p>
              <ul className="space-y-2 list-disc pl-5">
                <li>
                  <strong>Supported Interface:</strong> The motion is used to operate
                  functionality through an accessibility supported interface;
                </li>
                <li>
                  <strong>Essential:</strong> The motion is essential for the function
                  and doing so would invalidate the activity.
                </li>
              </ul>
            </blockquote>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4 text-sm">
              Note the two-part obligation outside the exceptions: a conventional UI
              alternative <em>and</em> the ability to disable motion response. Meeting
              only one of the two is still a failure.
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
                <a className="hover:underline" href="#scope">
                  What counts as motion actuation
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
              Motion controls create two mirror-image barriers: people who{" "}
              <em>cannot produce</em> the required motion, and people who{" "}
              <em>cannot avoid producing</em> it.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              {[
                {
                  t: "People whose devices are mounted",
                  d: "A phone or tablet fixed to a wheelchair, bed frame, or desk mount physically cannot be shaken or tilted. Any motion-only feature is simply unavailable to them.",
                },
                {
                  t: "People with limited strength or range of motion",
                  d: "Muscular dystrophy, arthritis, paralysis, or fatigue can make a deliberate shake or a controlled tilt impossible, even when the device is hand-held.",
                },
                {
                  t: "People with tremors or spasms",
                  d: "The opposite problem: involuntary movement constantly triggers motion features. 'Shake to undo' firing during typing can repeatedly destroy someone's work — which is why disabling motion response is a hard requirement.",
                },
                {
                  t: "Everyone in motion-hostile situations",
                  d: "A bumpy bus ride triggers shake gestures; a device lying flat on a table cannot be tilted. Conventional controls keep the feature usable everywhere.",
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
              The design pattern that satisfies everyone is the same one that works for{" "}
              <Link
                href="/wcag/2-5-1"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                2.5.1 Pointer Gestures
              </Link>
              : build the feature on ordinary buttons first, then layer motion on top
              as an optional, user-controllable enhancement.
            </p>
          </section>

          {/* Scope */}
          <section aria-labelledby="scope" className="mb-12">
            <h2
              id="scope"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              What counts as motion actuation
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              The criterion covers functionality your content operates in response to:
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex gap-3 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
                <span aria-hidden="true" className="text-blue-500 font-bold">
                  →
                </span>
                <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong className="text-slate-900 dark:text-white">
                    Device motion
                  </strong>{" "}
                  — shaking, tilting, or rotating the device, read from the
                  accelerometer or gyroscope. On the web this arrives through the{" "}
                  <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                    devicemotion
                  </code>{" "}
                  and{" "}
                  <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                    deviceorientation
                  </code>{" "}
                  events and the Generic Sensor API.
                </span>
              </li>
              <li className="flex gap-3 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
                <span aria-hidden="true" className="text-blue-500 font-bold">
                  →
                </span>
                <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong className="text-slate-900 dark:text-white">
                    User motion sensed by the device
                  </strong>{" "}
                  — gestures detected by a camera or other sensor, such as waving a
                  hand to advance slides or nodding to confirm.
                </span>
              </li>
            </ul>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Out of scope: pointer movement across the screen (covered by{" "}
              <Link
                href="/wcag/2-5-1"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                2.5.1
              </Link>{" "}
              and{" "}
              <Link
                href="/wcag/2-5-7"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                2.5.7
              </Link>
              ), keyboard and switch input, and motion your content merely{" "}
              <em>reacts to visually</em> without operating functionality — although
              gratuitous motion-driven animation raises its own issues under 2.3.3
              Animation from Interactions (Level AAA).
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              The two exceptions are narrow.{" "}
              <strong className="text-slate-900 dark:text-white">
                Supported Interface
              </strong>{" "}
              covers motion used <em>as</em> an assistive input method — a user whose
              AT converts head movement into clicks. That is their input device, not
              your feature.{" "}
              <strong className="text-slate-900 dark:text-white">Essential</strong>{" "}
              covers functions that are motion by definition — a pedometer counting
              steps — where a button alternative would falsify the activity itself.
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
                  Pass: shake-to-undo with an Undo button and a setting
                </h3>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                  A note-taking web app supports shaking to undo, shows an Undo button
                  in the toolbar, and offers a &ldquo;Use motion controls&rdquo;
                  toggle in settings. Alternative present, motion disableable — both
                  conditions met.
                </p>
              </div>
              <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/20 p-5">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  <span aria-hidden="true" className="text-emerald-600 mr-2">
                    ✓
                  </span>
                  Pass (essential): step counter
                </h3>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                  A fitness web app counts steps from accelerometer data. Motion is
                  the very thing being measured — a button that adds fake steps would
                  invalidate the activity. The Essential exception applies.
                </p>
              </div>
              <div className="rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-5">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  <span aria-hidden="true" className="text-rose-500 mr-2">
                    ✗
                  </span>
                  Fail: shake as the only way to shuffle
                </h3>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                  A playlist app shuffles songs when the phone is shaken and provides
                  no shuffle button. Users with mounted devices or limited mobility
                  cannot shuffle at all.
                </p>
              </div>
              <div className="rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-5">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  <span aria-hidden="true" className="text-rose-500 mr-2">
                    ✗
                  </span>
                  Fail: tilt-to-scroll that cannot be turned off
                </h3>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                  A reading app scrolls the page as the device tilts. Scroll buttons
                  exist, but there is no way to disable the tilt response — so a user
                  with a tremor watches the page lurch with every involuntary
                  movement. The alternative alone is not enough.
                </p>
              </div>
              <div className="rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-5">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  <span aria-hidden="true" className="text-rose-500 mr-2">
                    ✗
                  </span>
                  Fail: wave-at-camera slide control with no buttons
                </h3>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                  A presentation viewer advances slides when the camera detects a hand
                  wave, with no next/previous buttons and no way to switch the camera
                  gesture off. Both requirements missed.
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
              Shake-to-undo done right
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              The motion listener drives the same function as a visible button, and a
              user preference gates the listener entirely.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- ✓ The function is always available as a plain control -->
<button type="button" id="undo">Undo</button>

<label>
  <input type="checkbox" id="motion-toggle" />
  Enable shake to undo
</label>

<script>
  document.getElementById("undo").addEventListener("click", undoLastAction);

  const motionToggle = document.getElementById("motion-toggle");

  function onShake(event) {
    // ✓ Motion response is gated behind the user's opt-in setting
    if (!motionToggle.checked) return;
    const a = event.accelerationIncludingGravity;
    if (Math.abs(a.x) > 25 || Math.abs(a.y) > 25) undoLastAction();
  }

  window.addEventListener("devicemotion", onShake);
</script>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              A motion-controls preference in React
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Attach the sensor listener only while the preference is on. Removing the
              listener is the cleanest form of &ldquo;disabled&rdquo; — accidental
              motion can no longer actuate anything.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`function useShake(onShake, enabled) {
  useEffect(() => {
    if (!enabled) return // ✓ motion fully off when disabled

    function handle(e) {
      const a = e.accelerationIncludingGravity
      if (a && (Math.abs(a.x) > 25 || Math.abs(a.y) > 25)) onShake()
    }
    window.addEventListener("devicemotion", handle)
    return () => window.removeEventListener("devicemotion", handle)
  }, [enabled, onShake])
}

function Editor() {
  const [motionEnabled, setMotionEnabled] = useState(false) // opt-in
  useShake(undoLastAction, motionEnabled)

  return (
    <>
      <button type="button" onClick={undoLastAction}>Undo</button>
      <label>
        <input
          type="checkbox"
          checked={motionEnabled}
          onChange={(e) => setMotionEnabled(e.target.checked)}
        />
        Enable shake to undo
      </label>
    </>
  )
}`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Tilt-driven 360° viewer with button fallback
            </h3>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- ✓ Rotation works by buttons; tilt is an optional extra -->
<div role="group" aria-label="Rotate product view">
  <button type="button" onclick="rotateView(-15)">Rotate left</button>
  <button type="button" onclick="rotateView(15)">Rotate right</button>
  <button type="button" id="tilt-toggle" aria-pressed="false"
          onclick="toggleTilt(this)">
    Tilt to rotate: off
  </button>
</div>

<script>
  function toggleTilt(btn) {
    const on = btn.getAttribute("aria-pressed") !== "true";
    btn.setAttribute("aria-pressed", String(on));
    btn.textContent = on ? "Tilt to rotate: on" : "Tilt to rotate: off";
    if (on) {
      window.addEventListener("deviceorientation", tiltHandler);
    } else {
      window.removeEventListener("deviceorientation", tiltHandler);
    }
  }
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
                "Shake, tilt, or rotate as the only way to trigger a function — undo, shuffle, refresh, easter eggs that reveal real functionality.",
                "Providing a button alternative but no way to disable the motion response, leaving tremor-prone users exposed to constant accidental triggers.",
                "Providing a disable toggle but no UI alternative — turning motion off then removes the feature entirely for that user.",
                "Camera-gesture controls (wave to advance, nod to confirm) with no on-screen equivalent controls.",
                "Tilt-based panning of maps, panoramas, or 360° images with no drag or button-based panning.",
                "Burying the motion toggle where users who need it cannot find it, or resetting it on every visit.",
                "Claiming the essential exception for features where motion is a stylistic choice (tilt steering in a game, shake to submit feedback) rather than the thing being measured.",
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
              How to test for 2.5.4
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "Find every motion listener in the code",
                  d: "Search for devicemotion, deviceorientation, deviceorientationabsolute, the Generic Sensor API (Accelerometer, Gyroscope), and camera/gesture-recognition libraries. Each hit marks functionality that responds to motion.",
                },
                {
                  t: "Trigger each motion feature on a real device",
                  d: "Shake, tilt, and wave as the feature intends, and note exactly what each motion does. Browser DevTools sensor emulation (Chrome DevTools > Sensors) can simulate orientation if hardware is inconvenient.",
                },
                {
                  t: "Achieve every motion outcome without moving the device",
                  d: "For each function found, perform it using only on-screen controls: an Undo button, rotate buttons, next-slide buttons. If any outcome is reachable only by motion, it fails (unless a documented exception applies).",
                },
                {
                  t: "Disable motion and confirm silence",
                  d: "Find the setting that turns motion response off (yours or a respected system setting). Enable it, then shake and tilt vigorously: nothing should actuate. If no such setting exists, the criterion fails even with perfect button alternatives.",
                },
                {
                  t: "Review claimed exceptions",
                  d: "For anything left, verify the motion is genuinely essential (the motion is what is being measured) or arrives via the user's own accessibility-supported input method. Convenience, delight, and branding do not qualify.",
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
              Motion features are rare enough that this test is quick — but invisible
              to automated scanners, so it must be on your manual pass. The full{" "}
              <Link
                href="/checklists/wcag-2-2"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                WCAG 2.2 checklist
              </Link>{" "}
              keeps it alongside the other input-modality checks.
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

          <CriterionLinks number="2.5.4" />
        </article>

        {/* Related content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <RelatedContent
            content="motion actuation shake to undo tilt to scroll device motion accelerometer gyroscope devicemotion deviceorientation camera gesture disable motion accidental actuation motor disability WCAG 2.5.4 Level A input modalities"
            maxItems={6}
          />
        </section>
      </div>
    </>
  )
}
