import Link from "next/link"
import { Metadata } from "next"
import { BreadcrumbStructuredData } from "@/components/seo/structured-data"
import WCAGSEOEnhancements from "@/components/wcag/seo-enhancements"
import { CriterionLinks } from "@/components/wcag/criterion-links"
import TimingDemo from "./interactive-demo"

export const metadata: Metadata = {
  title: 'WCAG 2.2.1 Timing Adjustable - Interactive Demo',
  description: 'Master WCAG 2.2.1 Timing Adjustable with interactive timing controls, session extensions, and comprehensive implementation examples.',
  keywords: [
    'WCAG 2.2.1',
    'Timing Adjustable',
    'Level A',
    'time limits',
    'session timeout',
    'accessibility compliance',
    'web accessibility',
    'WCAG 2.2',
    'user control',
    'timing control'
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
    canonical: 'https://accessibility.build/wcag/2-2-1',
  },
  openGraph: {
    title: 'WCAG 2.2.1 Timing Adjustable (Level A) - Interactive Demo',
    description: 'Master WCAG 2.2.1 Timing Adjustable with interactive timing controls and implementation guidance.',
    url: '/wcag/2-2-1',
    siteName: 'Accessibility.build',
    locale: 'en_US',
    type: 'article',
    images: [
      {
        url: '/api/og?title=WCAG%202.2.1%20Timing%20Adjustable&section=WCAG',
        width: 1200,
        height: 630,
        alt: 'WCAG 2.2.1 Timing Adjustable (Level A) - Interactive Demo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WCAG 2.2.1 Timing Adjustable (Level A) - Interactive Demo',
    description: 'Master WCAG 2.2.1 Timing Adjustable with interactive timing controls and implementation guidance.',
    images: ['/api/og?title=WCAG%202.2.1%20Timing%20Adjustable&section=WCAG'],
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
    q: "What does WCAG 2.2.1 Timing Adjustable require?",
    a: "For every time limit that the content sets, at least one of three things must be true before the user encounters the limit: they can turn the time limit off; they can adjust it over a wide range that is at least ten times the default length; or they are warned before it expires, given at least 20 seconds to extend it with a simple action such as pressing the space bar, and allowed to extend it at least ten times. The criterion does not ban time limits — it insists that users who need more time can get it. It is a Level A criterion under Guideline 2.2 Enough Time.",
  },
  {
    q: "Are there any exceptions to WCAG 2.2.1?",
    a: "Yes, three. The Real-time Exception applies when the time limit is a required part of a real-time event, such as an auction, and no alternative to it is possible. The Essential Exception applies when the time limit is essential and extending it would invalidate the activity — a genuinely timed skills test is the classic example. The 20 Hour Exception applies when the limit is longer than 20 hours, on the reasoning that such a long window is not a practical barrier. If a time limit meets any one of these, it is exempt. 'Security requires it' is not one of the exceptions, and a blanket security claim does not satisfy the criterion on its own.",
  },
  {
    q: "Does a session timeout automatically fail 2.2.1?",
    a: "Not automatically — it depends on how the timeout behaves. A session that logs the user out silently, with no warning and no way to extend, fails. A session that warns the user before it expires, offers a simple 'Extend session' action giving at least 20 seconds to respond, lets them extend at least ten times, or lets them turn the limit off, passes. Preserving the user's data server-side so that re-authenticating does not lose their work is also a recognised technique (and is specifically what the related AAA criterion 2.2.6 Timeouts addresses).",
  },
  {
    q: "How does 2.2.1 relate to 2.2.3, 2.2.4, and 2.2.6?",
    a: "They all live under Guideline 2.2 Enough Time but set different bars. 2.2.1 Timing Adjustable (Level A) is the baseline: give users control over content-set time limits. 2.2.3 No Timing (AAA) goes further and removes timing as a requirement entirely except for non-interactive synchronized media and real-time events. 2.2.4 Interruptions (AAA) lets users postpone or suppress interruptions such as auto-updates. 2.2.6 Timeouts (AAA) requires warning users about the duration of any inactivity that could cause data loss. Meeting 2.2.1 is the required minimum; the AAA criteria are enhancements.",
  },
  {
    q: "What counts as a 'time limit set by the content'?",
    a: "Any time constraint the page or application imposes on the user: authentication and session timeouts, shopping-cart or seat/ticket holds that release after a period, forms and checkout flows that expire, timed quizzes and tests, auto-advancing carousels and slideshows, content that redirects after a countdown, and inactivity auto-logout. It does not include limits outside the content's control, such as the user's own operating-system screen-lock. If your code starts a clock that changes what the user can do when it runs out, 2.2.1 applies to it.",
  },
  {
    q: "How much time does the 'extend' option need to give?",
    a: "When you rely on the warn-and-extend path, the warning must appear before the limit expires, the user must have at least 20 seconds to respond with a simple action (a single keystroke or click — 'press the space bar' is the specification's own example), and they must be able to extend the limit at least ten times. Twenty seconds is a floor, not a target; give people comfortably more where you can, because motor-impaired users, screen reader users, and people using AAC devices may need time just to locate and activate the control.",
  },
]

export default function WCAG221Page() {
  return (
    <>
      <WCAGSEOEnhancements
        title="WCAG 2.2.1: Timing Adjustable"
        description="For each time limit that is set by the content, the user can turn off, adjust, or extend the time limit."
        criteria="2.2.1"
        level="A"
        principle="Operable"
        guideline="2.2 Enough Time"
        url="https://accessibility.build/wcag/2-2-1"
        category="Enough Time"
      />
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: 'Home', url: 'https://accessibility.build' },
          { name: 'WCAG Success Criteria', url: 'https://accessibility.build/wcag' },
          { name: '2.2.1 Timing Adjustable', url: 'https://accessibility.build/wcag/2-2-1' },
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
                    2.2.1 Timing Adjustable
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
                Enough time for everyone
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
              WCAG 2.2.1: Timing Adjustable
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              A countdown that suits an average user is a locked door for someone who
              reads slowly, types with a switch, or navigates a screen at 400% zoom. This
              criterion asks that{" "}
              <strong className="text-slate-900 dark:text-white">
                for every time limit the content sets, the user can turn it off, adjust
                it, or extend it
              </strong>{" "}
              before it runs out. Time limits are still allowed — they just must not
              silently push people off the page.
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
              For each time limit that is set by the content, at least one of the following
              is true: <strong>Turn off:</strong> The user is allowed to turn off the time
              limit before encountering it; or <strong>Adjust:</strong> The user is allowed
              to adjust the time limit before encountering it over a wide range that is at
              least ten times the length of the default setting; or{" "}
              <strong>Extend:</strong> The user is warned before time expires and given at
              least 20 seconds to extend the time limit with a simple action (for example,
              &ldquo;press the space bar&rdquo;), and the user is allowed to extend the time
              limit at least ten times; or <strong>Real-time Exception:</strong> The time
              limit is a required part of a real-time event (for example, an auction), and
              no alternative to the time limit is possible; or{" "}
              <strong>Essential Exception:</strong> The time limit is essential and
              extending it would invalidate the activity; or{" "}
              <strong>20 Hour Exception:</strong> The time limit is longer than 20 hours.
            </blockquote>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4 text-sm">
              The first three options are the remedies you build; the last three are
              exceptions that exempt a limit entirely. You only need to satisfy{" "}
              <em>one</em> of the six for any given time limit.
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
              Everyone occasionally needs a moment longer than a designer assumed — to
              re-read, to find a card number, to answer the door. For many disabled users
              that extra time is not a convenience but the difference between finishing a
              task and being locked out:
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  t: "People who read or type slowly",
                  d: "Users with cognitive, learning, or language differences may need several times longer to read instructions and enter information. A fixed timer punishes them for taking the time they need.",
                },
                {
                  t: "Low-vision users",
                  d: "Navigating at high magnification means only a fraction of the screen is visible at once, so locating fields, warnings, and buttons takes longer — often longer than a short countdown allows.",
                },
                {
                  t: "Screen reader users",
                  d: "Content is heard linearly, one item at a time. Reaching and understanding a form, then a timeout warning, then the extend control takes real time that a silent expiry does not grant.",
                },
                {
                  t: "People with motor impairments",
                  d: "Switch access, eye-gaze, and one-handed or tremor-affected typing all slow input. Completing a checkout or re-locating an 'extend' button can easily exceed a tight limit.",
                },
                {
                  t: "People using AAC devices",
                  d: "Users who compose responses on augmentative and alternative communication devices build messages slowly and deliberately; abrupt timeouts discard that effort.",
                },
                {
                  t: "Anyone who gets interrupted",
                  d: "A phone call, a child, a dropped connection — real life interrupts everyone. Adjustable timing means a two-minute distraction does not cost someone their work.",
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
              Whenever your content imposes a time limit — a session that expires, a cart
              hold that releases, a quiz that ends, a carousel that advances — you must
              provide at least one of three user controls <em>before</em> the user runs
              into the limit:
            </p>
            <ul className="space-y-3 mb-6">
              {[
                {
                  t: "Turn off",
                  d: "Let the user switch the time limit off before they encounter it. This is the simplest, most robust option: no clock, no barrier.",
                },
                {
                  t: "Adjust",
                  d: "Let the user lengthen the limit before it applies, over a wide range that is at least ten times the default — so a 20-minute default should be adjustable up to at least about 200 minutes.",
                },
                {
                  t: "Extend",
                  d: "Warn the user before time runs out, give them at least 20 seconds to respond with a simple action (a single keystroke or click), and allow at least ten extensions.",
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
              The exceptions, briefly
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              A time limit is exempt if it meets any one of three narrow exceptions.
              Reach for these carefully — they are specific, and a vague appeal to
              &ldquo;security&rdquo; is not among them.
            </p>
            <ul className="space-y-3">
              {[
                {
                  t: "Real-time Exception",
                  d: "The limit is a required part of a real-time event — a live auction, a synchronized multiplayer round — and no alternative to it is possible.",
                },
                {
                  t: "Essential Exception",
                  d: "The limit is essential and extending it would invalidate the activity. A genuinely timed test of speed is the textbook case; a session timeout rarely is.",
                },
                {
                  t: "20 Hour Exception",
                  d: "The limit is longer than 20 hours. A window that long is not a practical barrier, so no additional control is required.",
                },
              ].map((item) => (
                <li
                  key={item.t}
                  className="flex gap-3 rounded-lg border border-slate-200 dark:border-slate-800 p-4"
                >
                  <span aria-hidden="true" className="text-amber-500 font-bold">
                    ⚠
                  </span>
                  <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    <strong className="text-slate-900 dark:text-white">{item.t}.</strong>{" "}
                    {item.d}
                  </span>
                </li>
              ))}
            </ul>
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
                  ✓ Passes 2.2.1
                </h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <li>
                    A session that shows &ldquo;You will be logged out in 2 minutes&rdquo;
                    with an <strong>Extend session</strong> button, extendable at least ten
                    times.
                  </li>
                  <li>
                    A settings option to turn the inactivity timeout off, or lengthen it,
                    before it applies.
                  </li>
                  <li>
                    A checkout that keeps the cart server-side, so re-authenticating after a
                    timeout loses no work.
                  </li>
                  <li>
                    A carousel that pauses (or has no auto-advance) so it sets no time limit
                    at all.
                  </li>
                  <li>
                    A live auction countdown — exempt under the Real-time Exception.
                  </li>
                </ul>
              </div>
              <div className="rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-5">
                <h3 className="font-semibold text-rose-800 dark:text-rose-300 mb-3">
                  ✗ Fails 2.2.1
                </h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <li>
                    A session that logs the user out silently, with no warning and no way
                    to extend.
                  </li>
                  <li>
                    A checkout form that expires and clears entered data with no chance to
                    continue.
                  </li>
                  <li>
                    A page that redirects after a fixed countdown the user cannot pause or
                    stop.
                  </li>
                  <li>
                    A ticket or seat hold that releases too fast with no adjust or extend
                    option.
                  </li>
                  <li>
                    A short timeout justified only by a blanket &ldquo;security requires
                    it&rdquo; claim.
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
              A timeout warning with a simple extend action
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Warn before the limit expires and expose a single, keyboard-operable control
              to extend. The dialog is announced through a live region so screen reader
              users hear it in time to act.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- ✗ Silent, fixed timeout — no warning, no control -->
<div class="notice">Your session will expire in 5 minutes.</div>

<!-- ✓ Warned, and extendable with a simple action -->
<div id="timeout-warning" role="alertdialog" aria-live="assertive"
     aria-labelledby="to-title" aria-describedby="to-desc" hidden>
  <h2 id="to-title">Session expiring soon</h2>
  <p id="to-desc">
    Your session expires in <span id="secs">30</span> seconds.
  </p>
  <button id="extend" type="button">Extend session (Space)</button>
</div>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Warn, then allow at least ten extensions
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Show the warning before expiry, give the user at least 20 seconds to respond,
              and permit the extension at least ten times.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`const LIMIT = 15 * 60;   // 15-minute session, in seconds
const WARN_AT = 60;      // warn 60s before expiry (> 20s minimum)
const EXTEND_BY = 15 * 60;
const MAX_EXTENSIONS = 10; // at least ten times

let remaining = LIMIT;
let extensionsUsed = 0;

const tick = setInterval(() => {
  remaining -= 1;
  if (remaining === WARN_AT) showWarning();   // warn BEFORE expiry
  if (remaining <= 0) { clearInterval(tick); expireSession(); }
}, 1000);

function extend() {
  if (extensionsUsed >= MAX_EXTENSIONS) return;
  remaining += EXTEND_BY;
  extensionsUsed += 1;
  hideWarning();
  announce(\`Session extended. \${MAX_EXTENSIONS - extensionsUsed} extensions left.\`);
}

// A single keystroke satisfies the "simple action" requirement.
document.getElementById('extend').addEventListener('click', extend);
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && isWarningVisible()) { e.preventDefault(); extend(); }
});`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Turn off or adjust the limit before it applies
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Offering a preference to disable or lengthen the timeout satisfies the
              &ldquo;Turn off&rdquo; and &ldquo;Adjust&rdquo; options — the adjustable range
              must reach at least ten times the default.
            </p>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<fieldset>
  <legend>Session timeout</legend>
  <label>
    <input type="radio" name="timeout" value="900" checked>
    15 minutes (default)
  </label>
  <label>
    <input type="radio" name="timeout" value="9000">
    150 minutes (10× the default)
  </label>
  <label>
    <input type="radio" name="timeout" value="0">
    No time limit
  </label>
</fieldset>`}</code>
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
              Watch a 30-second session count down. The adjustable version warns you before
              it expires and lets you extend with one click; the silent version simply logs
              you out. Toggle between them to feel the difference 2.2.1 is asking for.
            </p>
            <TimingDemo />
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
                "Session or authentication timeouts that log the user out with no warning and no way to extend.",
                "Forms and checkout flows that expire and discard entered data before the user can finish.",
                "Timed quizzes or tests with a fixed limit that cannot be adjusted (unless the timing is genuinely essential).",
                "Auto-advancing carousels, slideshows, or news tickers that move on before slow readers can keep up.",
                "Pages that redirect on a countdown the user cannot pause, stop, or turn off.",
                "A 'your session will expire' message with no control to actually extend or postpone it.",
                "Ticket, seat, or inventory holds that release too quickly with no adjust or extend option.",
                "Justifying a short, fixed timeout with a blanket 'security requires it' claim that is not one of the real exceptions.",
                "An extend control that appears only at (or after) expiry, giving the user less than 20 seconds — or no time — to respond.",
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
              How to test for 2.2.1
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "Enumerate every time limit",
                  d: "List all limits the content sets: session and inactivity timeouts, form and checkout expiries, cart and seat holds, quizzes, auto-advancing carousels, and countdown redirects. Automated tools rarely find these, so this step is manual.",
                },
                {
                  t: "For each limit, check for a control",
                  d: "Confirm the user can do at least one of: turn the limit off, adjust it over a range that is at least ten times the default, or be warned and extend it. If none is present, the limit fails unless an exception applies.",
                },
                {
                  t: "Verify the warning comes before expiry",
                  d: "Where you rely on the extend path, let a limit run down and confirm the warning appears while there is still time to act — not at the moment of, or after, expiry.",
                },
                {
                  t: "Confirm the extend action is simple and generous",
                  d: "The user should be able to extend with a single keystroke or click, have at least 20 seconds to respond, and be able to extend at least ten times. Test it with the keyboard alone.",
                },
                {
                  t: "Test with assistive technology",
                  d: "With a screen reader running, verify the warning is announced (an aria-live or role='alertdialog' region) and that the extend control is reachable and operable. A visual-only warning fails non-visual users.",
                },
                {
                  t: "Validate any claimed exception",
                  d: "If a limit is exempted, confirm it genuinely meets the Real-time, Essential, or 20 Hour exception. 'Security' alone is not an exception; a real-time auction or a truly timed test is.",
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
          <CriterionLinks number="2.2.1" />

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
