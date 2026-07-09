import type { Metadata } from "next"
import Link from "next/link"
import WCAGSEOEnhancements from "@/components/wcag/seo-enhancements"
import WCAGBreadcrumb from "@/components/wcag/breadcrumb"
import { FAQStructuredData } from "@/components/seo/structured-data"
import { CriterionLinks } from "@/components/wcag/criterion-links"

export const metadata: Metadata = {
  title: "WCAG 2.3.2 Three Flashes — The Zero-Threshold Rule",
  description:
    "WCAG 2.3.2 Three Flashes explained: nothing may flash more than three times in any one second — no size, brightness, or contrast exemptions. Testing with PEAT.",
  keywords: [
    "WCAG 2.3.2",
    "Three Flashes",
    "photosensitive epilepsy",
    "flashing content accessibility",
    "seizure safe web design",
    "flash threshold",
    "PEAT tool",
    "Level AAA",
    "WCAG 2.2",
  ],
  alternates: {
    canonical: "/wcag/2-3-2",
  },
  openGraph: {
    title: "WCAG 2.3.2 Three Flashes — The Zero-Threshold Rule",
    description:
      "At Level AAA, nothing on the page may flash more than three times in any one-second period — no threshold exemptions for size, brightness, or red flashes.",
    url: "/wcag/2-3-2",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: "/api/og?title=WCAG%202.3.2%20Three%20Flashes&section=WCAG",
        width: 1200,
        height: 630,
        alt: "WCAG 2.3.2 Three Flashes guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WCAG 2.3.2 Three Flashes — The Zero-Threshold Rule",
    description:
      "Nothing may flash more than three times per second, period. How 2.3.2 differs from 2.3.1, why it exists, and how to test with PEAT.",
    images: [
      {
        url: "/api/og?title=WCAG%202.3.2%20Three%20Flashes&section=WCAG",
        width: 1200,
        height: 630,
      },
    ],
  },
}

const faqs = [
  {
    question: "What does WCAG 2.3.2 Three Flashes require?",
    answer:
      "It requires that web pages do not contain anything that flashes more than three times in any one-second period — full stop. Unlike the Level A criterion 2.3.1, there are no exemptions: it does not matter how small the flashing area is, how dim the flash is, how low its contrast is, or whether it avoids saturated red. If any content flashes more than three times in a second, the page fails 2.3.2.",
  },
  {
    question: "How is 2.3.2 different from 2.3.1 Three Flashes or Below Threshold?",
    answer:
      "2.3.1 (Level A) forbids flashing above three per second unless the flash is below the 'general flash and red flash thresholds' — a technical exemption that covers flashes that are small enough (roughly under 25% of a 10-degree visual field, about 341×256 pixels at typical viewing distance in the original formulation), dim enough, or low-contrast enough to be considered safe. 2.3.2 (Level AAA) deletes the exemption entirely: three flashes per second is the ceiling for anything, of any size or intensity. It exists because some people are more sensitive than the thresholds assume, and because content viewed closer or larger than expected (zoom, projection, mobile held near the face) can exceed the assumed visual angle.",
  },
  {
    question: "What exactly counts as a 'flash'?",
    answer:
      "A flash is a pair of opposing changes in relative luminance — content going markedly brighter then darker (or vice versa) counts as one flash. Three flashes means three such pairs. Rapid alternation between contrasting colors, strobe-style effects, fast white-black cycling, lightning effects in video, and rapidly blinking elements are the classic cases. Slow blinking (like a cursor at ~1 Hz) is not flashing in this sense — though blinking content has its own requirements under 2.2.2 Pause, Stop, Hide.",
  },
  {
    question: "Who is harmed by flashing content?",
    answer:
      "People with photosensitive epilepsy can experience seizures triggered by flashing at roughly 3 to 60 flashes per second (with peak sensitivity around 15–20 Hz). Seizures can begin before a person can look away — the trigger acts faster than a voluntary response — which is why prevention must happen in the content, not the user's reflexes. Beyond epilepsy, flashing content can trigger migraines, dizziness, and nausea in people with vestibular disorders and photosensitivity that does not reach seizure threshold.",
  },
  {
    question: "Does 2.3.2 apply to video content and ads on my page?",
    answer:
      "Yes. The criterion applies to anything on the web page: embedded video, animated GIFs, canvas animations, CSS animations, ad creatives served by third parties, and autoplay media. Third-party content you embed is part of your page's conformance claim. Video is the most common risk surface — news footage with camera flashes, concert scenes, explosion effects — and should be screened with a tool like PEAT (Photosensitive Epilepsy Analysis Tool) before publishing.",
  },
  {
    question: "How do I test content for flashing?",
    answer:
      "For designed UI effects, inspect the code and count: does anything change luminance in opposing directions more than three times within any one-second window? For video and complex animation, use the free PEAT tool from the Trace Center, which analyzes captured video against flash and red-flash risk. Test at realistic playback and with the content at full size — and remember that for 2.3.2, any flashing above three per second is a failure regardless of what a threshold-based analyzer would exempt at Level A.",
  },
]

export default function WCAG232Page() {
  return (
    <>
      <WCAGSEOEnhancements
        title="WCAG 2.3.2: Three Flashes"
        description="Web pages do not contain anything that flashes more than three times in any one second period."
        criteria="2.3.2"
        level="AAA"
        principle="Operable"
        guideline="2.3 Seizures and Physical Reactions"
        url="https://accessibility.build/wcag/2-3-2"
        category="Seizures and Physical Reactions"
        relatedCriteria={["2.3.1", "2.3.3", "2.2.2"]}
      />
      <FAQStructuredData faqs={faqs} />

      <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <WCAGBreadcrumb items={[]} current="2.3.2 Three Flashes" />

          {/* Header */}
          <header className="mb-12">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                Level AAA
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Principle 2: Operable
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300">
                Safety-critical
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
              WCAG 2.3.2: Three Flashes
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              The Level A flashing rule comes with an engineering exemption: flashes
              that are small, dim, or low-contrast enough are permitted. This
              criterion removes it.{" "}
              <strong className="text-slate-900 dark:text-white">
                At Level AAA, nothing on the page may flash more than three times in
                any one-second period
              </strong>{" "}
              — no size carve-out, no brightness math, no red-flash calculus. It is
              the simplest criterion in WCAG to state, and one of the most important
              to honor: this one is about seizures.
            </p>
          </header>

          {/* Official text */}
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
              Web pages do not contain anything that flashes more than three times in
              any one second period.
            </blockquote>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4 text-sm">
              Compare{" "}
              <Link href="/wcag/2-3-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                2.3.1 Three Flashes or Below Threshold
              </Link>{" "}
              (Level A), which adds &ldquo;…or the flash is below the general flash
              and red flash thresholds.&rdquo; 2.3.2 is that sentence with the
              exemption amputated. &ldquo;Anything&rdquo; means anything: a
              12-pixel icon, a subtle shimmer, a video thumbnail.
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
              <li><a className="hover:underline" href="#why">Why flashing is dangerous</a></li>
              <li><a className="hover:underline" href="#versus">2.3.2 vs. 2.3.1: no thresholds</a></li>
              <li><a className="hover:underline" href="#what-flash">What counts as a flash</a></li>
              <li><a className="hover:underline" href="#examples">Pass and fail examples</a></li>
              <li><a className="hover:underline" href="#mistakes">Common failures</a></li>
              <li><a className="hover:underline" href="#testing">How to test</a></li>
              <li><a className="hover:underline" href="#faq">FAQ</a></li>
            </ul>
          </nav>

          {/* Why */}
          <section aria-labelledby="why" className="mb-12">
            <h2 id="why" className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Why flashing is dangerous
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              For people with photosensitive epilepsy, flashing light in roughly the
              3–60 flashes-per-second range can trigger a seizure — with peak
              sensitivity around 15 to 20 flashes per second. Two facts make this
              unlike almost every other accessibility barrier:
            </p>
            <ul className="space-y-3 mb-4">
              {[
                "The harm is physical and immediate. A seizure can cause injury, and the reaction can begin faster than the person can look away or close the tab. 'The user can avoid it' is not a mitigation.",
                "Users often don't know they are at risk. Many people experience their first photosensitive seizure from screen content, with no prior diagnosis. The famous 1997 Pokémon broadcast incident sent hundreds of viewers in Japan to hospital.",
              ].map((m) => (
                <li key={m} className="flex gap-3 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
                  <span aria-hidden="true" className="text-rose-500 font-bold">!</span>
                  <span className="text-slate-700 dark:text-slate-300 leading-relaxed">{m}</span>
                </li>
              ))}
            </ul>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Flashing also harms far more people than those with epilepsy: it can
              trigger migraines, dizziness, and nausea in people with vestibular
              disorders or general photosensitivity. Keeping every flash at three per
              second or slower protects all of them at once.
            </p>
          </section>

          {/* Versus */}
          <section aria-labelledby="versus" className="mb-12">
            <h2 id="versus" className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              2.3.2 vs. 2.3.1: what the missing threshold means
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              2.3.1 permits fast flashing when it stays below the{" "}
              <em>general flash and red flash thresholds</em> — a formula involving
              the flashing area (relative to a 10-degree field of vision), the
              luminance change, and whether the flash involves saturated red. That
              exemption is grounded in broadcast-safety research, but it bakes in
              assumptions: a typical screen size, a typical viewing distance, a
              typical user.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              2.3.2 exists because those assumptions fail at the margins:
            </p>
            <ul className="space-y-3 mb-4">
              {[
                "Some people are simply more sensitive than the thresholds model — the thresholds protect most photosensitive users, not all of them.",
                "Zoom, screen magnification, projection, and phones held close all enlarge the flashing area's share of the visual field beyond what the exemption assumed.",
                "Multiple 'safely small' flashing elements near each other can combine into an unsafe stimulus.",
              ].map((m) => (
                <li key={m} className="flex gap-3 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
                  <span aria-hidden="true" className="text-purple-500 font-bold">→</span>
                  <span className="text-slate-700 dark:text-slate-300 leading-relaxed">{m}</span>
                </li>
              ))}
            </ul>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              The practical consequence for teams: at AAA there is nothing to
              calculate. If it flashes more than three times in any one second, it
              fails — so design it out entirely. Related but distinct:{" "}
              <Link href="/wcag/2-2-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                2.2.2 Pause, Stop, Hide
              </Link>{" "}
              (A) covers slower blinking and moving content, and{" "}
              <Link href="/wcag/2-3-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                2.3.3 Animation from Interactions
              </Link>{" "}
              (AAA) covers non-flashing motion effects.
            </p>
          </section>

          {/* What counts */}
          <section aria-labelledby="what-flash" className="mb-12">
            <h2 id="what-flash" className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              What counts as a flash
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              A flash is a pair of opposing changes in relative luminance: bright,
              then dark (or dark, then bright) counts as one flash. Three flashes in
              a second means three of those round trips — i.e. luminance alternating
              faster than 3 Hz. Typical sources on the web:
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              {[
                {
                  t: "Video footage",
                  d: "Paparazzi camera bursts, lightning, strobe lighting at concerts, gunfire and explosion effects, fast scene cuts between bright and dark shots.",
                },
                {
                  t: "Animated GIFs and memes",
                  d: "Strobing text, rapid color-cycling backgrounds, 'glitch' effects. User-generated content is a major vector.",
                },
                {
                  t: "CSS/JS animations",
                  d: "Attention-grabbing blink effects, rapidly pulsing badges or alerts, hover effects that oscillate quickly, loading indicators that alternate high-contrast frames.",
                },
                {
                  t: "Ads and embeds",
                  d: "Third-party creatives with strobe effects — your page's conformance includes them, so ad policies matter.",
                },
              ].map((item) => (
                <div key={item.t} className="rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{item.t}</h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{item.d}</p>
                </div>
              ))}
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Not flashing in this sense: a text cursor blinking about once a second,
              a gentle opacity pulse at 1 Hz, or a smooth continuous animation with
              no abrupt luminance alternation. Those may still need pause controls
              under 2.2.2, but they are not seizure triggers.
            </p>
          </section>

          {/* Examples */}
          <section aria-labelledby="examples" className="mb-12">
            <h2 id="examples" className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Pass and fail examples
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/20 p-5">
                <h3 className="font-semibold text-emerald-800 dark:text-emerald-300 mb-2">✓ Passes 2.3.2</h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed list-disc pl-4">
                  <li>An alert badge that pulses gently twice per second or slower, with a pause control per 2.2.2.</li>
                  <li>News footage screened with PEAT; a sequence with camera flashes was re-edited to slow the effective flash rate below 3 Hz.</li>
                  <li>A game whose &ldquo;damage flash&rdquo; is a single luminance dip, not a strobe.</li>
                  <li>A recording of a concert where strobe segments were replaced with a still frame and a caption noting the omission.</li>
                </ul>
              </div>
              <div className="rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-5">
                <h3 className="font-semibold text-rose-800 dark:text-rose-300 mb-2">✗ Fails 2.3.2</h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed list-disc pl-4">
                  <li>A &ldquo;SALE!&rdquo; banner alternating white and red five times per second — fails 2.3.1 too if large enough.</li>
                  <li>A tiny 16-pixel &ldquo;recording&rdquo; dot strobing at 8 Hz: small enough to pass 2.3.1&rsquo;s threshold exemption, but a 2.3.2 failure.</li>
                  <li>An embedded GIF of a glitch-art meme cycling black/white at 10 Hz.</li>
                  <li>An autoplay trailer with an un-reviewed strobe sequence, even though it is &ldquo;only&rdquo; a few seconds long.</li>
                </ul>
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4">
              If an effect must communicate urgency, do it without a strobe: a single
              transition, a color change with an icon, a slow pulse, or a static
              high-visibility style all convey alarm without a flash frequency.
            </p>
          </section>

          {/* Common failures */}
          <section aria-labelledby="mistakes" className="mb-12">
            <h2 id="mistakes" className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Common failures
            </h2>
            <ul className="space-y-3">
              {[
                "Fast blink/strobe attention effects on badges, banners, or CTAs — usually implemented with a steps() or fast alternate CSS animation.",
                "Publishing video without any flash screening: news, sports, music, and gaming footage are the highest-risk categories.",
                "Relying on 2.3.1's small-area exemption at AAA — under 2.3.2 the size of the flashing region is irrelevant.",
                "User-generated GIFs and videos rendered with autoplay, so a strobing upload flashes at every visitor by default.",
                "Third-party ad creatives with strobe effects, embedded without a policy or review that covers flashing.",
                "Loading spinners or 'live' indicators that alternate two high-contrast frames faster than 3 Hz.",
                "Assuming a short duration is safe — 'it only strobes for two seconds' is still more than three flashes in one second.",
              ].map((m) => (
                <li key={m} className="flex gap-3 rounded-lg border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-4">
                  <span aria-hidden="true" className="text-rose-500 font-bold">✗</span>
                  <span className="text-slate-700 dark:text-slate-300 leading-relaxed">{m}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Testing */}
          <section aria-labelledby="testing" className="mb-12">
            <h2 id="testing" className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              How to test for 2.3.2
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "Inventory everything that changes appearance rapidly",
                  d: "CSS animations and transitions, JS-driven effects, animated GIFs/WebPs, <video> elements, canvas/WebGL scenes, embedded players, and ads. Autoplaying content is the priority; user-triggered content still counts.",
                },
                {
                  t: "Audit coded animations by their numbers",
                  d: "For CSS/JS effects you can read the frequency straight from the code: an animation alternating luminance with a duration under ~330ms per cycle (or steps() flicker) exceeds three flashes per second. No visual judgment needed.",
                },
                {
                  t: "Run video through PEAT",
                  d: "The free Photosensitive Epilepsy Analysis Tool (Trace Center) analyzes captured screen video for flash risk. For 2.3.2 remember the stricter reading: any flashing over 3 Hz fails, even where PEAT's threshold-based verdict would allow it at Level A.",
                },
                {
                  t: "Test at realistic and worst-case sizes",
                  d: "Play content full-screen and zoomed. 2.3.2 has no size exemption, but this step also protects your 2.3.1 conformance where viewers enlarge content beyond the threshold assumptions.",
                },
                {
                  t: "Check upstream policies",
                  d: "Verify ad network settings, UGC moderation rules, and editorial workflows include a no-strobe requirement, so conformance survives the next upload — and never rely on users' ability to look away.",
                },
              ].map((step, i) => (
                <li key={step.t} className="flex gap-4 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{step.t}</h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{step.d}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-5">
              Never test suspected strobe content by staring at it — capture it and
              analyze the recording. Continue with the full{" "}
              <Link href="/checklists/wcag-2-2" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                WCAG 2.2 checklist
              </Link>
              .
            </p>
          </section>

          {/* FAQ */}
          <section aria-labelledby="faq" className="mb-4">
            <h2 id="faq" className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              Frequently asked questions
            </h2>
            <div className="space-y-4">
              {faqs.map((f) => (
                <details
                  key={f.question}
                  className="group rounded-xl border border-slate-200 dark:border-slate-800 p-5 [&_summary]:cursor-pointer"
                >
                  <summary className="font-semibold text-slate-900 dark:text-white list-none flex items-center justify-between gap-4">
                    {f.question}
                    <span aria-hidden="true" className="text-slate-400 group-open:rotate-180 transition-transform">
                      ▾
                    </span>
                  </summary>
                  <p className="mt-3 text-slate-600 dark:text-slate-300 leading-relaxed">{f.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <CriterionLinks number="2.3.2" />
        </article>
      </div>
    </>
  )
}
