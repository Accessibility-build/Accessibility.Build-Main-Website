import Link from "next/link"
import { Metadata } from "next"
import { BreadcrumbStructuredData } from "@/components/seo/structured-data"
import WCAGSEOEnhancements from "@/components/wcag/seo-enhancements"
import { CriterionLinks } from "@/components/wcag/criterion-links"
import MotionDemo from "./interactive-demo"

export const metadata: Metadata = {
  title: 'WCAG 2.2.2 Pause, Stop, Hide - Interactive Demo',
  description: 'Master WCAG 2.2.2 Pause, Stop, Hide with interactive auto-playing content controls and comprehensive implementation examples.',
  keywords: [
    'WCAG 2.2.2',
    'Pause Stop Hide',
    'Level A',
    'auto-playing content',
    'moving content',
    'accessibility compliance',
    'web accessibility',
    'WCAG 2.2',
    'content control',
    'animation control'
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
    canonical: 'https://accessibility.build/wcag/2-2-2',
  },
  openGraph: {
    title: 'WCAG 2.2.2 Pause, Stop, Hide (Level A) - Interactive Demo',
    description: 'Master WCAG 2.2.2 Pause, Stop, Hide with interactive content controls and implementation guidance.',
    url: '/wcag/2-2-2',
    siteName: 'Accessibility.build',
    locale: 'en_US',
    type: 'article',
    images: [
      {
        url: '/api/og?title=WCAG%202.2.2%20Pause%2C%20Stop%2C%20Hide&section=WCAG',
        width: 1200,
        height: 630,
        alt: 'WCAG 2.2.2 Pause, Stop, Hide (Level A) - Interactive Demo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'WCAG 2.2.2 Pause, Stop, Hide (Level A) - Interactive Demo',
    description: 'Master WCAG 2.2.2 Pause, Stop, Hide with interactive content controls and implementation guidance.',
    images: ['/api/og?title=WCAG%202.2.2%20Pause%2C%20Stop%2C%20Hide&section=WCAG'],
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
    q: "What does WCAG 2.2.2 Pause, Stop, Hide require?",
    a: "It requires that users can control content that moves, blinks, scrolls, or auto-updates on its own. There are two branches. For moving, blinking, or scrolling content that starts automatically, lasts more than five seconds, and is shown alongside other content, you must provide a mechanism to pause, stop, or hide it. For content that auto-updates automatically and is shown alongside other content, you must provide a mechanism to pause, stop, or hide it — or to control how often it updates. The only exception is when the movement or updating is essential to an activity (a progress indicator, a live game that would break if paused). It is a Level A criterion under Guideline 2.2 Enough Time, part of WCAG since 2.0.",
  },
  {
    q: "Where does the five-second threshold apply, and where does it not?",
    a: "The five-second window only applies to the moving, blinking, or scrolling branch. If a piece of motion starts automatically but stops on its own within five seconds — a brief entrance animation, for example — no control is required. But the auto-updating branch has no such grace period: a feed, ticker, stock quote, or live score that keeps refreshing needs a pause/stop/hide mechanism (or a frequency control) regardless of how long each update takes, because the updating never really ends.",
  },
  {
    q: "How is 2.2.2 different from 2.3.1 Three Flashes?",
    a: "They cover different risks. 2.2.2 is about distraction and reading interference caused by slower motion — an auto-advancing carousel, a marquee, a blinking cursor-style element under the flash threshold. Its remedy is user control. 2.3.1 Three Flashes or Below Threshold is a safety criterion about rapid flashing that can trigger photosensitive seizures; its remedy is to not flash more than three times per second (or to stay under the general flash and red flash thresholds). Blinking in the 2.2.2 sense is slow on-and-off; flashing in the 2.3.1 sense is fast and potentially dangerous.",
  },
  {
    q: "Is pausing on hover or focus enough to pass 2.2.2?",
    a: "No. Pausing on hover or focus is a nice enhancement, but on its own it does not satisfy the criterion. A keyboard-only user may never hover, a switch or voice user may struggle to keep an element focused, and a reader who simply wants the motion gone should not have to hold the mouse over it. 2.2.2 asks for a discoverable, persistent mechanism — a real Pause, Stop, or Hide control (or a frequency setting for updates) that keeps the content still until the user chooses otherwise.",
  },
  {
    q: "What counts as 'essential' so that no control is needed?",
    a: "Essential means the information would be lost, or the activity would be fundamentally changed, if the movement or updating stopped. A progress bar has to move to be a progress bar. A live auction or multiplayer game that everyone experiences in real time cannot be paused for one user without breaking the shared activity. Animation used in a demonstration of animation is essential to that demonstration. The bar is high: convenience, branding, or 'it looks lively' are never essential. If you could freeze the content and the user would lose nothing important, you need a control.",
  },
  {
    q: "Does prefers-reduced-motion satisfy 2.2.2 by itself?",
    a: "Respecting the prefers-reduced-motion media query is strongly recommended and helps many users, but it is not a complete substitute for a visible mechanism. Not every user who is distracted by motion has set that system preference, and the criterion asks for a mechanism available in the content. The best approach is both: honor prefers-reduced-motion to reduce or pause motion automatically, and still provide an on-page pause/stop/hide control for everyone else.",
  },
]

export default function WCAG222Page() {
  return (
    <>
      <WCAGSEOEnhancements
        title="WCAG 2.2.2: Pause, Stop, Hide"
        description="For moving, blinking, scrolling, or auto-updating information that starts automatically and lasts more than five seconds, a mechanism is available for the user to pause, stop, or hide it."
        criteria="2.2.2"
        level="A"
        principle="Operable"
        guideline="2.2 Enough Time"
        url="https://accessibility.build/wcag/2-2-2"
        category="Enough Time"
      />
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: 'Home', url: 'https://accessibility.build' },
          { name: 'WCAG Success Criteria', url: 'https://accessibility.build/wcag' },
          { name: '2.2.2 Pause, Stop, Hide', url: 'https://accessibility.build/wcag/2-2-2' },
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
                    2.2.2 Pause, Stop, Hide
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
                Give users a way to stop motion
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
              WCAG 2.2.2: Pause, Stop, Hide
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              An auto-advancing carousel, a scrolling news ticker, a looping background
              video, a feed that refreshes on its own — for many people these are not
              lively, they are impossible to read past. This criterion asks that{" "}
              <strong className="text-slate-900 dark:text-white">
                whenever content moves, blinks, scrolls, or auto-updates on its own,
                the user has a way to pause, stop, or hide it
              </strong>
              . Motion should be something people can switch off, not something imposed
              on them.
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
              For moving, blinking, scrolling, or auto-updating information, all of the
              following are true: <strong>Moving, blinking, scrolling:</strong> For any
              moving, blinking, or scrolling information that (1) starts automatically,
              (2) lasts more than five seconds, and (3) is presented in parallel with
              other content, there is a mechanism for the user to pause, stop, or hide
              it unless the movement, blinking, or scrolling is part of an activity
              where it is essential; and <strong>Auto-updating:</strong> For any
              auto-updating information that (1) starts automatically and (2) is
              presented in parallel with other content, there is a mechanism for the
              user to pause, stop, or hide it or to control the frequency of the update
              unless the auto-updating is part of an activity where it is essential.
            </blockquote>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4 text-sm">
              Two branches, one idea: the user must be able to take control. The
              five-second window and the &ldquo;in parallel with other content&rdquo;
              condition apply to the moving/blinking/scrolling branch. The auto-updating
              branch has no five-second threshold — but it lets you offer a frequency
              control as an alternative to pause/stop/hide. &ldquo;Essential&rdquo; is
              the only exception, and it is meant to be narrow.
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
              Unwanted motion is not a minor annoyance for everyone. For some people it
              makes a page unreadable, unusable, or physically uncomfortable. A single
              pause control removes the barrier:
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  t: "People with attention and cognitive disabilities",
                  d: "Movement in the corner of the eye is one of the strongest distractions there is. For people with ADHD or attention-related disabilities, a moving element next to the text can make it impossible to hold focus and read.",
                },
                {
                  t: "Low vision users",
                  d: "Someone reading at high magnification sees only a small slice of the page at a time. Motion in that slice — or content that shifts as it auto-updates — disrupts reading and makes it hard to keep their place.",
                },
                {
                  t: "Screen reader users",
                  d: "Content that auto-updates changes the DOM underneath the reader. A live region that refreshes on its own can interrupt announcements and throw away the user's reading position.",
                },
                {
                  t: "People with vestibular disorders",
                  d: "Large or looping motion can trigger dizziness and nausea. Being able to stop it — and having motion respect reduced-motion preferences — keeps the page from causing physical symptoms.",
                },
                {
                  t: "People who read slowly",
                  d: "An auto-advancing carousel that flips before the reader finishes the slide is a classic barrier. A pause control lets people read at their own pace instead of racing a timer.",
                },
                {
                  t: "Everyone trying to concentrate",
                  d: "Animated ads, blinking banners, and restless tickers are broadly disliked. A way to quiet them benefits every user, not only those with disabilities.",
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
              The criterion splits automatic content into two branches. Work out which
              branch a piece of content falls into, then check the conditions — if they
              all hold and the content is not essential, a mechanism is required.
            </p>
            <ul className="space-y-3 mb-6">
              {[
                {
                  t: "Moving, blinking, scrolling — starts automatically",
                  d: "The motion begins without the user doing anything: a carousel that rotates on load, a marquee that scrolls by itself, an animation that loops. User-initiated motion is out of scope.",
                },
                {
                  t: "Moving, blinking, scrolling — lasts more than five seconds",
                  d: "If the motion stops on its own within five seconds, no control is needed. Beyond five seconds, a pause/stop/hide mechanism is required.",
                },
                {
                  t: "Moving, blinking, scrolling — in parallel with other content",
                  d: "The condition applies when the motion sits alongside other content the user is trying to use. A full-screen loading animation that is the only thing on the page is different from a ticker running next to an article.",
                },
                {
                  t: "Auto-updating — starts automatically, in parallel",
                  d: "Feeds, tickers, live scores, and chat that refresh on their own. There is no five-second grace period here; because the updating is ongoing, a mechanism is required whenever it runs alongside other content.",
                },
                {
                  t: "The mechanism: pause, stop, hide — or control frequency",
                  d: "For motion you must let users pause, stop, or hide. For auto-updating content you may instead let users control how often it updates (including turning updates off). The control must be keyboard operable and discoverable.",
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
              The &ldquo;essential&rdquo; exception
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              A control is not required when the movement or updating is genuinely
              essential to the activity — a{" "}
              <em>progress indicator that has to move to convey progress</em>, a live
              auction or multiplayer game that would break for everyone if one user
              paused it, or an animation whose whole point is to demonstrate motion. The
              bar is deliberately high: looking lively, matching a brand, or holding
              attention are never essential. This is distinct from{" "}
              <Link href="/wcag/2-3-1" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                2.3.1 Three Flashes
              </Link>
              , which handles the seizure risk from rapid flashing, and from{" "}
              <Link href="/wcag/1-4-2" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                1.4.2 Audio Control
              </Link>
              , the audio analogue of this criterion.
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
                  ✓ Passes 2.2.2
                </h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <li>
                    An auto-advancing carousel with a visible, keyboard-operable pause
                    button.
                  </li>
                  <li>
                    A news ticker with Pause and Hide controls next to it.
                  </li>
                  <li>
                    A live feed that lets users set the refresh interval, including
                    &ldquo;off&rdquo;.
                  </li>
                  <li>
                    A background video that either does not autoplay or offers a stop
                    control.
                  </li>
                  <li>
                    A brief entrance animation that finishes in under five seconds on
                    its own.
                  </li>
                </ul>
              </div>
              <div className="rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-5">
                <h3 className="font-semibold text-rose-800 dark:text-rose-300 mb-3">
                  ✗ Fails 2.2.2
                </h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <li>
                    A carousel that rotates forever with no way to pause or stop it.
                  </li>
                  <li>
                    A scrolling marquee or stock ticker running next to content with no
                    control.
                  </li>
                  <li>
                    A feed or live score that keeps refreshing with no pause, hide, or
                    frequency setting.
                  </li>
                  <li>
                    A carousel that only pauses on hover — leaving keyboard users no
                    option.
                  </li>
                  <li>
                    A looping animated GIF longer than five seconds sitting beside the
                    article.
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
              A carousel with a real pause control
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              The control must be a genuine, focusable button — not a hover-only
              behaviour — and its label should reflect its current state.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- ✗ Auto-rotates with no way to stop it -->
<div class="carousel" data-autoplay>
  <div class="slide">…</div>
  <div class="slide">…</div>
</div>

<!-- ✓ A discoverable, keyboard-operable pause control -->
<section class="carousel" aria-roledescription="carousel"
         aria-label="Latest news">
  <button type="button" class="carousel-toggle"
          aria-pressed="false"
          onclick="toggleCarousel(this)">
    Pause
  </button>
  <div class="slides" aria-live="off">
    <div class="slide">…</div>
    <div class="slide">…</div>
  </div>
</section>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              An auto-updating ticker: pause, hide, or set frequency
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              For auto-updating content you can satisfy the criterion with pause/hide{" "}
              <em>or</em> by letting the user control how often it refreshes — including
              turning it off entirely.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<div class="ticker">
  <div class="ticker-controls">
    <button type="button" onclick="pauseTicker()">Pause updates</button>
    <button type="button" onclick="hideTicker()">Hide ticker</button>
    <label>
      Update every
      <select onchange="setTickerFrequency(this.value)">
        <option value="5">5 seconds</option>
        <option value="30">30 seconds</option>
        <option value="0">Off</option>
      </select>
    </label>
  </div>
  <div class="ticker-content" aria-live="off">
    AAPL 150.25 ▲ 2.5%
  </div>
</div>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Respecting reduced-motion in React
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Honour <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">prefers-reduced-motion</code>{" "}
              so motion starts paused for users who asked for less of it — then still
              expose a visible control for everyone else.
            </p>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`function AutoCarousel({ slides }) {
  const [playing, setPlaying] = useState(true)
  const [index, setIndex] = useState(0)

  // Start paused if the user prefers reduced motion.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (mq.matches) setPlaying(false)
  }, [])

  useEffect(() => {
    if (!playing) return
    const id = setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      5000
    )
    return () => clearInterval(id) // always clean up
  }, [playing, slides.length])

  return (
    <section aria-roledescription="carousel" aria-label="News">
      <button aria-pressed={!playing}
              onClick={() => setPlaying((p) => !p)}>
        {playing ? "Pause" : "Play"}
      </button>
      <Slide {...slides[index]} />
    </section>
  )
}`}</code>
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
              Both regions below start moving automatically, just like a real carousel
              and ticker. Use the Pause, Resume, and Hide controls to feel the
              difference between content that is imposed on you and content you can put
              a stop to.
            </p>
            <MotionDemo />
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
                "Auto-advancing carousels and sliders that rotate on their own with no pause or stop control.",
                "Scrolling marquees and news tickers that move continuously beside other content with no way to halt them.",
                "Background animations or looping video that play automatically past five seconds with no stop mechanism.",
                "Auto-refreshing feeds, stock tickers, live scores, and chat that update in parallel with no pause, hide, or frequency control.",
                "Animated advertisements that move or blink indefinitely with no user control.",
                "Auto-playing GIFs longer than five seconds placed next to the content people are trying to read.",
                "Carousels that pause only on hover or focus, leaving keyboard and switch users with no way to stop the motion.",
                "Treating a decorative or brand animation as 'essential' to avoid providing a control when it carries no critical information.",
                "A pause control that is not keyboard operable, or that is hidden until the user hovers the moving element.",
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
              How to test for 2.2.2
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "Inventory every piece of automatic motion and updating",
                  d: "Load each page and note everything that moves, blinks, scrolls, or refreshes on its own: carousels, tickers, marquees, background video, animations, live feeds, counters. These are the elements the criterion applies to.",
                },
                {
                  t: "Apply the branch conditions",
                  d: "For moving/blinking/scrolling content, check whether it starts automatically, runs more than five seconds, and sits in parallel with other content. For auto-updating content, check whether it starts automatically and runs in parallel — there is no five-second exemption here.",
                },
                {
                  t: "Find the mechanism",
                  d: "For each in-scope element, confirm there is a pause, stop, or hide control (or, for auto-updating content, a frequency control). It must be visible and discoverable, not hidden behind a hover.",
                },
                {
                  t: "Operate the control with the keyboard only",
                  d: "Tab to the pause/stop/hide control and activate it with Enter or Space. The motion or updating must actually stop and stay stopped. A control that only responds to a mouse fails.",
                },
                {
                  t: "Test reduced-motion and check it is not the only remedy",
                  d: "Enable prefers-reduced-motion in your OS or DevTools and confirm motion is reduced or paused. Then confirm a visible on-page control still exists for users who have not set that preference.",
                },
                {
                  t: "Scrutinise every 'essential' claim",
                  d: "For anything shipped without a control on the grounds that it is essential, ask whether freezing it would truly lose information or break a shared real-time activity. If not, it needs a control.",
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
          <CriterionLinks number="2.2.2" />

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
