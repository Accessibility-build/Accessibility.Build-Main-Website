import { Metadata } from "next";
import Link from "next/link";
import WCAGSEOEnhancements from "@/components/wcag/seo-enhancements";
import WCAGBreadcrumb from "@/components/wcag/breadcrumb";
import { CriterionLinks } from "@/components/wcag/criterion-links";
import { RelatedContent } from "@/components/seo/related-content";

export const metadata: Metadata = {
  title: "WCAG 2.3.1 Three Flashes or Below Threshold (Level A)",
  description:
    "Master WCAG 2.3.1 Three Flashes or Below Threshold: seizure prevention techniques, the general and red flash thresholds explained, safe animation patterns, code examples, and a complete testing guide for photosensitive epilepsy protection.",
  keywords: [
    "WCAG 2.3.1",
    "Three Flashes",
    "seizure prevention",
    "photosensitive epilepsy",
    "flash detection",
    "accessibility",
    "Level A",
    "web accessibility",
    "WCAG 2.2",
    "seizures",
    "flashing content",
    "epilepsy safety",
    "compliance testing",
    "accessibility audit",
  ],
  authors: [{ name: "Accessibility.build Team" }],
  creator: "Accessibility.build",
  publisher: "Accessibility.build",
  openGraph: {
    title:
      "WCAG 2.3.1 Three Flashes or Below Threshold - Seizure-Safe Content Guide",
    description:
      "Comprehensive guide to implementing seizure-safe web content. Flash threshold explanations, safety guidelines, and compliance testing for photosensitive epilepsy protection.",
    type: "article",
    url: "https://accessibility.build/wcag/2-3-1",
    siteName: "Accessibility.build",
    locale: "en_US",
    images: [
      {
        url: "https://accessibility.build/api/og?title=WCAG%202.3.1%20Three%20Flashes%20or%20Below%20Threshold&section=WCAG",
        width: 1200,
        height: 630,
        alt: "WCAG 2.3.1 Three Flashes or Below Threshold - Seizure Prevention Guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WCAG 2.3.1 Three Flashes or Below Threshold",
    description:
      "Learn seizure prevention with flash threshold explanations and safety guidelines for web accessibility compliance.",
    images: ["https://accessibility.build/api/og?title=WCAG%202.3.1%20Three%20Flashes%20or%20Below%20Threshold&section=WCAG"],
  },
  alternates: {
    canonical: "https://accessibility.build/wcag/2-3-1",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "Web Accessibility",
};

const faqs = [
  {
    q: "What does WCAG 2.3.1 Three Flashes or Below Threshold require?",
    a: "It requires that web pages do not contain anything that flashes more than three times in any one-second period, unless the flash is below the general flash and red flash thresholds. It is a Level A criterion under Guideline 2.3 Seizures and Physical Reactions, and it applies to the whole page: because flashing content can prevent a user from using the entire page at all, every piece of content on the page must satisfy it — including ads, embedded videos, animated GIFs, and third-party widgets.",
  },
  {
    q: "What are the general flash and red flash thresholds?",
    a: "A 'general flash' is a pair of opposing changes in relative luminance of 10% or more of the maximum relative luminance, where the darker state is below 0.80 relative luminance. A 'red flash' is any pair of opposing transitions involving a saturated red. Flashing that stays above three flashes per second is still permitted if it is below both thresholds — in practice, if the flashing area is small enough (the combined flashing area occupies no more than about 25% of any 10-degree visual field, roughly a 341 x 256 pixel block at typical viewing distance) or the luminance/color change is too subtle to be dangerous.",
  },
  {
    q: "Who is at risk from flashing content?",
    a: "People with photosensitive epilepsy, which affects roughly 1 in 4,000 people, can experience seizures triggered by flashing between about 3 Hz and 60 Hz, with peak sensitivity between 15 and 20 flashes per second. Saturated red flashing is especially provocative. Beyond epilepsy, rapid flashing can also trigger migraines, dizziness, and nausea in people with vestibular disorders or photosensitivity that never rises to the level of a seizure. A single exposure can cause a seizure — this is one of the few WCAG criteria where a failure can cause direct physical harm.",
  },
  {
    q: "Is three flashes per second always safe?",
    a: "Three or fewer flashes per second keeps you within the letter of 2.3.1, but the guidance is deliberately conservative rather than a target to design toward. The Understanding document notes the threshold was set based on broadcast standards adapted for computer screens viewed at close range. Best practice is to avoid flashing entirely, keep any unavoidable flashing well under the limits, avoid saturated red, keep the flashing area small, and give users a way to stop or pause the effect (which also supports 2.2.2 Pause, Stop, Hide).",
  },
  {
    q: "How is 2.3.1 different from 2.3.2 Three Flashes?",
    a: "2.3.1 (Level A) permits flashing above three per second only when it stays below the general flash and red flash thresholds — small or low-contrast flashing can pass. 2.3.2 Three Flashes (Level AAA) removes that allowance entirely: nothing on the page may flash more than three times in any one-second period, regardless of size, luminance, or color. If you simply avoid all fast flashing you satisfy both at once. 2.3.3 Animation from Interactions (AAA) is related but covers motion animation, not flashing.",
  },
  {
    q: "How do I test content against WCAG 2.3.1?",
    a: "Use PEAT (the Photosensitive Epilepsy Analysis Tool, from the Trace Research Center) to analyze video and screen-capture recordings of animated content — it implements the general and red flash threshold math for you. For code, audit CSS animations and JavaScript timers: any interval faster than about 333ms driving a large luminance change is suspect. Review video, GIF, ad, and third-party content before publishing, since 2.3.1 applies to everything on the page. Never test by staring at suspect content yourself — analyze recordings with tooling instead.",
  },
];

export default function WCAG231Page() {
  return (
    <>
      <WCAGSEOEnhancements
        title="WCAG 2.3.1: Three Flashes or Below Threshold"
        description="Web pages must not contain anything that flashes more than three times in any one second period, or the flash is below the general flash and red flash thresholds."
        criteria="2.3.1"
        level="A"
        principle="Operable"
        guideline="2.3 Seizures and Physical Reactions"
        url="https://accessibility.build/wcag/2-3-1"
        category="Seizures and Physical Reactions"
        hasInteractiveDemo={false}
        relatedCriteria={["2.3.2", "2.3.3", "2.2.2"]}
      />

      <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <WCAGBreadcrumb
            items={[]}
            current="2.3.1 Three Flashes or Below Threshold"
          />

          {/* Header */}
          <header className="mb-12">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                Level A
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Principle 2: Operable
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300">
                Safety-critical
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
              WCAG 2.3.1: Three Flashes or Below Threshold
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              Most accessibility failures make a page harder to use. This one
              can put someone in the hospital. Flashing content can trigger
              seizures in people with photosensitive epilepsy, so WCAG draws a
              hard line:{" "}
              <strong className="text-slate-900 dark:text-white">
                nothing on the page may flash more than three times in any one
                second
              </strong>{" "}
              — unless the flash is small and dim enough to fall below the
              general flash and red flash thresholds.
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
            <blockquote className="text-slate-700 dark:text-slate-300 leading-relaxed border-l-4 border-rose-500 pl-4">
              Web pages do not contain anything that flashes more than three
              times in any one second period, or the flash is below the general
              flash and red flash thresholds.
            </blockquote>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4 text-sm">
              Note the scope: <em>anything</em> on the page. Unlike most
              criteria, 2.3.1 explicitly applies to all content on the page —
              your own animations, embedded videos, animated GIFs, ads, and
              third-party widgets — because dangerous flashing anywhere can
              prevent a user from using the page at all.
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
                  Who this protects and why
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#thresholds">
                  The two thresholds, explained
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#no-demo">
                  Why there is no flashing demo here
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

          {/* Why */}
          <section aria-labelledby="why" className="mb-12">
            <h2
              id="why"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Who this protects and why
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Photosensitive epilepsy affects roughly{" "}
              <strong className="text-slate-900 dark:text-white">
                1 in 4,000 people
              </strong>
              . For them, flashing light in the range of about 3 to 60 flashes
              per second can trigger a seizure — with peak sensitivity between
              15 and 20 flashes per second. The trigger is not gradual: a single
              exposure of less than a second can be enough. The most infamous
              real-world case, a 1997 Pok&eacute;mon broadcast with rapid
              red-blue flashing, sent hundreds of viewers to hospital.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              The risk is not limited to epilepsy. Rapid flashing and strobing
              can trigger migraines, dizziness, disorientation, and nausea in
              people with vestibular disorders and general photosensitivity.
              And unlike a missing alt attribute, a user cannot &ldquo;work
              around&rdquo; dangerous flashing — by the time they perceive it,
              the exposure has already happened.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  t: "People with photosensitive epilepsy",
                  d: "Flashing between 3–60 Hz, especially saturated red, can trigger seizures on first exposure with no warning.",
                },
                {
                  t: "People with vestibular disorders",
                  d: "Strobing and rapid luminance changes cause dizziness, nausea, and disorientation even without a seizure.",
                },
                {
                  t: "People with migraine",
                  d: "Flicker is a well-documented migraine trigger; a flashing banner can end someone's workday.",
                },
                {
                  t: "Everyone else",
                  d: "Fast flashing is distracting and unpleasant for all users — removing it is a pure usability win.",
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

          {/* Thresholds */}
          <section aria-labelledby="thresholds" className="mb-12">
            <h2
              id="thresholds"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              The two thresholds, explained
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              The criterion has two branches. The simple branch:{" "}
              <strong className="text-slate-900 dark:text-white">
                three flashes or fewer in any one-second period is always
                acceptable
              </strong>
              . The nuanced branch: flashing faster than that is still
              permitted <em>only</em> if it stays below both the general flash
              threshold and the red flash threshold — definitions borrowed from
              broadcast safety standards and adapted for screens viewed at
              close range.
            </p>
            <div className="space-y-4 mb-4">
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  General flash threshold
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                  A <em>general flash</em> is a pair of opposing changes in
                  relative luminance of{" "}
                  <strong className="text-slate-900 dark:text-white">
                    10% or more of the maximum relative luminance
                  </strong>
                  , where the relative luminance of the darker image is below
                  0.80. In plain terms: a strong bright-dark-bright (or
                  dark-bright-dark) pulse. Fast flashing stays <em>below</em>{" "}
                  the threshold — and passes — when the combined flashing area
                  is small enough: no more than about{" "}
                  <strong className="text-slate-900 dark:text-white">
                    25% of any 10-degree visual field
                  </strong>{" "}
                  (0.006 steradians). At a typical viewing distance that works
                  out to roughly a 341 &times; 256 CSS-pixel region — anything
                  larger flashing quickly is a failure.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                  Red flash threshold
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  A <em>red flash</em> is any pair of opposing transitions
                  involving a{" "}
                  <strong className="text-slate-900 dark:text-white">
                    saturated red
                  </strong>
                  . Saturated red is disproportionately provocative for
                  photosensitive seizures — transitions to and from strong red
                  are dangerous even when the overall luminance change would
                  pass the general threshold. If your flashing involves
                  saturated red, treat any rate above three per second as a
                  failure regardless of size or brightness.
                </p>
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              The practical takeaway: you do not need to memorize the
              steradian math. If nothing on your page flashes more than three
              times per second, you pass automatically. Reserve the threshold
              analysis for edge cases like small status indicators, and use a
              tool — not your eyes — for that analysis.
            </p>
          </section>

          {/* No demo */}
          <section aria-labelledby="no-demo" className="mb-12">
            <h2
              id="no-demo"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Why there is no flashing demo here
            </h2>
            <div className="rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-6 mb-4">
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                <strong className="text-slate-900 dark:text-white">
                  We deliberately do not reproduce dangerous flashing on this
                  page.
                </strong>{" "}
                A live demonstration of seizure-inducing content would put the
                very people this criterion protects at risk — even a
                &ldquo;brief, educational&rdquo; strobe can trigger a seizure
                on first exposure, and a warning dialog is no protection for a
                user who arrives via an in-page anchor or has the page read
                aloud. Describing the failure is enough; experiencing it should
                never be required.
              </p>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Here is what the dangerous pattern looks like, in words. Imagine
              a large panel — most of the content area — alternating between
              pure white and saturated red five times every second. Each
              white-to-red-to-white cycle is a pair of opposing transitions
              involving saturated red (a red flash) and a luminance swing far
              beyond 10% (a general flash). At five flashes per second, over an
              area far larger than 25% of a 10-degree visual field, it fails
              both branches of 2.3.1 simultaneously — and sits close to the
              most seizure-provocative frequency band.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              A safe version of the same attention-getting effect: a gentle
              pulse between white and a pale tint at two cycles per second, in
              a small region, with a visible control to stop it. Better still,
              use a non-flashing affordance — a border highlight, a badge, or a
              single fade-in — which draws the eye without any flash at all.
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
            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/20 p-6">
                <h3 className="font-semibold text-emerald-900 dark:text-emerald-300 mb-3">
                  Passes 2.3.1
                </h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <li>
                    A notification badge that pulses gently twice per second
                    with a subtle color change.
                  </li>
                  <li>
                    A recording indicator blinking once per second (1 Hz).
                  </li>
                  <li>
                    A cursor caret or loading spinner — continuous motion, not
                    opposing luminance flashes.
                  </li>
                  <li>
                    A tiny status LED-style dot flashing at 4 Hz whose area is
                    far below the general flash threshold and involves no
                    saturated red.
                  </li>
                  <li>
                    Video content screened with PEAT and confirmed below both
                    thresholds.
                  </li>
                </ul>
              </div>
              <div className="rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-6">
                <h3 className="font-semibold text-rose-900 dark:text-rose-300 mb-3">
                  Fails 2.3.1
                </h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <li>
                    A full-width &ldquo;SALE!&rdquo; banner strobing between
                    white and red five times per second.
                  </li>
                  <li>
                    An animated GIF of lightning or camera flashes cycling
                    faster than 3 Hz over a large area.
                  </li>
                  <li>
                    An embedded video containing strobe effects, rapid scene
                    cuts, or gunfire flashes above the thresholds.
                  </li>
                  <li>
                    A third-party ad that flashes rapidly — you are responsible
                    for everything rendered on your page.
                  </li>
                  <li>
                    A CSS animation toggling a large element&rsquo;s background
                    between dark and light every 100&ndash;200ms.
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
              CSS animation: strobe vs. gentle pulse
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              The failing version flashes a large area between high-contrast
              colors ten times per second. The passing version pulses a subtle
              tint at 2 Hz and respects the user&rsquo;s reduced-motion
              preference.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`/* ✗ Fails: 10 flashes/second, large area, high contrast */
.alert-banner {
  animation: strobe 0.1s infinite alternate;
}
@keyframes strobe {
  from { background: #ffffff; }
  to   { background: #ff0000; } /* saturated red — red flash */
}

/* ✓ Passes: 2 cycles/second, subtle luminance change */
.alert-banner {
  animation: gentle-pulse 0.5s infinite alternate;
}
@keyframes gentle-pulse {
  from { background: #ffffff; }
  to   { background: #e3f2fd; } /* well under 10% luminance swing */
}

/* ✓ Better: honor the user's motion preference */
@media (prefers-reduced-motion: reduce) {
  .alert-banner { animation: none; }
}`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              JavaScript: guard the flash rate and give users a stop control
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              If an effect must blink, clamp the rate in code so no future
              change can accidentally exceed three flashes per second, cap the
              duration, and always render a stop control (which also helps you
              meet 2.2.2 Pause, Stop, Hide).
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`// ✗ Fails: 5 flashes per second, no way to stop it
setInterval(() => el.classList.toggle("flash"), 200);

// ✓ Passes: rate clamped to ≤ 3 Hz, auto-stops, user-stoppable
const MAX_FLASHES_PER_SECOND = 3;
const SAFE_INTERVAL_MS = Math.ceil(1000 / MAX_FLASHES_PER_SECOND); // 334ms

function startBlink(el, { durationMs = 3000 } = {}) {
  const timer = setInterval(() => el.classList.toggle("blink"), SAFE_INTERVAL_MS);
  const stop = () => {
    clearInterval(timer);
    el.classList.remove("blink");
  };
  setTimeout(stop, durationMs);       // never blink indefinitely
  return stop;                        // wire this to a visible Stop button
}

const stopBlink = startBlink(document.getElementById("status"));
document.getElementById("stop-btn").addEventListener("click", stopBlink);`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Video and GIF content: screen it, warn, and never autoplay
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Flashing most often ships inside media, not CSS. Screen every
              video with PEAT before publishing. If flashing content is
              unavoidable and below the thresholds, still warn users and keep
              it behind an explicit play action.
            </p>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- ✗ Fails: autoplaying video with unscreened strobe effects -->
<video src="/promo-strobe.mp4" autoplay loop muted></video>

<!-- ✓ Passes: screened with PEAT, no autoplay, content warning -->
<p id="flash-warning">
  <strong>Content note:</strong> this video contains brief flashing
  imagery (verified below WCAG 2.3.1 thresholds with PEAT).
</p>
<video
  src="/promo-screened.mp4"
  controls
  preload="metadata"
  aria-describedby="flash-warning">
</video>`}</code>
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
                "Attention-grabbing banners or CTAs that strobe between high-contrast colors faster than three times per second.",
                "Animated GIFs — lightning, sparkles, glitch effects, camera flashes — embedded without checking their frame rate and luminance swings.",
                "Embedded or user-uploaded video containing strobe lighting, rapid cuts, or muzzle flashes that was never screened with PEAT.",
                "Third-party ads and widgets that flash: 2.3.1 applies to the whole page, so their failure is your failure.",
                "Saturated red used in any fast blink — red flashes fail at rates and sizes where other colors might squeak under the general threshold.",
                "JavaScript 'blink' effects driven by setInterval with periods under ~334ms and no rate guard, so a later tweak silently makes them dangerous.",
                "Relying on a warning dialog instead of removing the flashing — a warning does not make above-threshold flashing conform, and users can land past it.",
                "Assuming small-area safety without measuring: the exception is a precise area/luminance calculation, not a feeling that the element 'looks small'.",
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
              How to test for 2.3.1
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-5">
              Important: never test by deliberately watching suspect content.
              Analyze recordings and code instead — that is exactly what the
              tooling is for.
            </p>
            <ol className="space-y-4">
              {[
                {
                  t: "Inventory everything that moves or blinks",
                  d: "List every animation, video, GIF, ad slot, and embedded widget on the page. 2.3.1 applies to all content on the page, so third-party material is in scope too.",
                },
                {
                  t: "Run PEAT on video and screen recordings",
                  d: "The free Photosensitive Epilepsy Analysis Tool (PEAT) from the Trace Research & Development Center implements the general flash and red flash threshold calculations. Record the page or export the video, run it through PEAT, and treat any warning as a blocker.",
                },
                {
                  t: "Audit animation code for rate",
                  d: "Search CSS for animation durations under ~334ms with 'infinite' iteration, and JavaScript for setInterval/setTimeout loops with periods under 334ms that toggle visual state. Any large luminance change driven at that rate is a likely failure.",
                },
                {
                  t: "Check for saturated red transitions",
                  d: "Wherever flashing exists at any rate above 3 Hz, check whether either state is a saturated red. If so, it must be removed or slowed — the red flash threshold is much stricter than the general one.",
                },
                {
                  t: "Verify area against the small-safe-area exception",
                  d: "If fast flashing must remain, confirm the combined flashing area is under roughly 25% of a 10-degree visual field (about 341 x 256 CSS pixels at typical viewing distance) and the luminance swing is under 10%. Document the measurement.",
                },
                {
                  t: "Confirm users can stop residual blinking",
                  d: "Any blinking that remains should stop automatically within a bounded time or offer a visible pause/stop control — this overlaps with 2.2.2 Pause, Stop, Hide and is good defense in depth.",
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
              Track this criterion alongside the rest of your audit in the{" "}
              <Link
                href="/checklists/wcag-2-2"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                WCAG 2.2 checklist
              </Link>
              .
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

          <CriterionLinks number="2.3.1" />
        </article>

        {/* Related content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <RelatedContent
            content="three flashes or below threshold seizure prevention photosensitive epilepsy flash detection general flash threshold red flash threshold saturated red PEAT flashing content strobe animation safety pause stop hide WCAG 2.3.1 Level A seizures and physical reactions"
            maxItems={6}
          />
        </section>
      </div>
    </>
  );
}
