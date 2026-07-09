import type { Metadata } from "next"
import Link from "next/link"
import WCAGSEOEnhancements from "@/components/wcag/seo-enhancements"
import WCAGBreadcrumb from "@/components/wcag/breadcrumb"
import { CriterionLinks } from "@/components/wcag/criterion-links"
import { RelatedContent } from "@/components/seo/related-content"

export const metadata: Metadata = {
  title: "WCAG 1.2.5 Audio Description (Prerecorded) Guide",
  description:
    "WCAG 1.2.5 Audio Description explained: prerecorded video needs narration of key visual information. Requirements, described versions, code, and testing.",
  keywords: [
    "WCAG 1.2.5",
    "Audio Description",
    "audio described video",
    "prerecorded video accessibility",
    "described version",
    "blind video accessibility",
    "descriptions track",
    "1.2.5 test",
    "Level AA",
    "WCAG 2.2",
  ],
  alternates: {
    canonical: "/wcag/1-2-5",
  },
  openGraph: {
    type: "website",
    title: "WCAG 1.2.5 Audio Description (Prerecorded) Guide",
    description:
      "All prerecorded video in synchronized media needs audio description of important visual details. Who it helps, when it's needed, implementation, and testing.",
    url: "/wcag/1-2-5",
    siteName: "Accessibility.build",
    images: [
      {
        url: "/api/og?title=WCAG%201.2.5%20Audio%20Description%20(Prerecorded)&section=WCAG",
        width: 1200,
        height: 630,
        alt: "WCAG 1.2.5 Audio Description (Prerecorded) guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WCAG 1.2.5 Audio Description (Prerecorded) Guide",
    description:
      "All prerecorded video in synchronized media needs audio description of important visual details. Who it helps, when it's needed, implementation, and testing.",
    images: [
      "/api/og?title=WCAG%201.2.5%20Audio%20Description%20(Prerecorded)&section=WCAG",
    ],
  },
}

const faqs = [
  {
    q: "What does WCAG 1.2.5 Audio Description (Prerecorded) require?",
    a: "It requires that audio description is provided for all prerecorded video content in synchronized media. Audio description is narration added to (or interleaved with) the soundtrack that describes important visual details which cannot be understood from the main soundtrack alone — actions, characters, scene changes, on-screen text, charts being pointed at. It is a Level AA success criterion in WCAG 2.0, 2.1, and 2.2, and it applies to video that has an accompanying audio track (synchronized media).",
  },
  {
    q: "If my video's narration already says everything on screen, do I still need a separate audio description?",
    a: "No. The Understanding document is explicit: if all of the information in the video track is already provided in the audio track, no audio description is necessary. A screencast whose presenter reads out every step and every piece of on-screen text as they go, or a talking-head interview with no meaningful visuals beyond the speaker, effectively self-describes. The test is whether someone listening with their eyes closed misses any information a sighted viewer gets.",
  },
  {
    q: "How is 1.2.5 different from 1.2.3 Audio Description or Media Alternative?",
    a: "1.2.3 (Level A) gives you a choice for prerecorded synchronized media: provide either an audio description or a full media alternative (a descriptive transcript covering all audio and visual information). 1.2.5 (Level AA) removes that choice: audio description itself is required — a transcript alone no longer suffices at AA. If you conform to 1.2.5, you automatically satisfy 1.2.3 as well. At AAA, 1.2.7 Extended Audio Description goes further for videos whose soundtrack leaves no pauses long enough for adequate description.",
  },
  {
    q: "What should good audio description actually include?",
    a: "Whatever a listener needs that the existing soundtrack doesn't give them: who is on screen and what they are doing, scene and location changes, facial expressions and gestures that carry meaning, on-screen text such as titles, captions, speaker names, and data callouts, and visual demonstrations ('she removes the battery cover'). Descriptions are traditionally timed to fit the natural pauses in dialogue, which is why concise, prioritized wording is a professional skill — describe what matters for understanding, not every visual detail.",
  },
  {
    q: "Can I satisfy 1.2.5 with a separate 'described version' of the video?",
    a: "Yes. Common approaches all conform: (1) a second version of the video with description mixed into the soundtrack, offered alongside the original ('Watch with audio description'); (2) a selectable alternate audio track in the player that includes description; or (3) where pauses allow, a single soundtrack authored so the narration itself covers all visual information. A text-based descriptions track (<track kind=\"descriptions\">) that assistive technology reads aloud is a helpful supplement, but browser and screen reader support is too inconsistent to be your only mechanism.",
  },
  {
    q: "Does 1.2.5 apply to decorative or ambient background video?",
    a: "The criterion targets video content in synchronized media that conveys information. A purely decorative looping background — abstract shapes, ambient office footage behind a hero heading, with no audio track and no information content — is not synchronized media conveying content, and there is nothing to describe. Be honest in the assessment, though: if the 'ambient' video actually shows your product in use or communicates anything users are meant to take away, that information needs an accessible equivalent.",
  },
]

const passFailExamples = [
  {
    verdict: "pass" as const,
    t: "Described version offered next to the original",
    d: "A product launch video is published in two versions: the original, and one with professional audio description mixed in, linked directly beside it as 'Watch with audio description'.",
  },
  {
    verdict: "pass" as const,
    t: "Selectable description audio track",
    d: "A training video's player offers an alternate audio track — 'English (Audio Description)' — that adds narration of the on-screen demonstrations during pauses in the instructor's speech.",
  },
  {
    verdict: "pass" as const,
    t: "Self-describing screencast",
    d: "A tutorial presenter narrates every action and reads all on-screen text aloud as they perform it. The audio track already conveys all the visual information, so no separate description is needed.",
  },
  {
    verdict: "fail" as const,
    t: "Demo video with silent visual steps",
    d: "A how-to video shows a settings panel while the presenter says 'just click here, then here, and you're done'. A blind viewer has no idea what 'here' is — the key visual information is never spoken.",
  },
  {
    verdict: "fail" as const,
    t: "Transcript instead of description at AA",
    d: "A marketing film full of visual storytelling ships with captions and a descriptive transcript but no audio description. That satisfies Level A (1.2.3) — it does not satisfy 1.2.5 at Level AA.",
  },
]

export default function WCAG125Page() {
  return (
    <>
      <WCAGSEOEnhancements
        title="WCAG 1.2.5: Audio Description (Prerecorded)"
        description="Audio description is provided for all prerecorded video content."
        criteria="1.2.5"
        level="AA"
        principle="Perceivable"
        guideline="1.2 Time-based Media"
        url="https://accessibility.build/wcag/1-2-5"
        category="Time-based Media"
        relatedCriteria={["1.2.3", "1.2.4", "1.2.7"]}
      />

      <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <WCAGBreadcrumb
            items={[]}
            current="1.2.5 Audio Description (Prerecorded)"
          />

          {/* Header */}
          <header className="mb-12">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                Level AA
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Principle 1: Perceivable
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                Guideline 1.2 Time-based Media
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
              WCAG 1.2.5: Audio Description (Prerecorded)
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              Captions make video work without sound; audio description makes it
              work without sight. This criterion requires that{" "}
              <strong className="text-slate-900 dark:text-white">
                prerecorded video content carries audio description of the
                important visual information
              </strong>{" "}
              — the actions, on-screen text, and scene changes that a blind
              viewer would otherwise miss. If your video&rsquo;s meaning lives
              in the pictures, someone has to say it out loud.
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
              Audio description is provided for all prerecorded video content in
              synchronized media.
            </blockquote>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4 text-sm">
              <em>Synchronized media</em> is video presented together with
              audio. <em>Audio description</em> is narration added to the
              soundtrack that describes important visual details that cannot be
              understood from the main soundtrack alone. One crucial relief
              valve from the Understanding document: if the existing audio
              already conveys everything the video shows, no additional
              description is needed.
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
                <a className="hover:underline" href="#requirement">
                  What the requirement covers
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#examples">
                  Pass and fail examples
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#code">
                  Implementation examples
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
              The primary audience is{" "}
              <strong className="text-slate-900 dark:text-white">
                people who are blind or have low vision
              </strong>
              . They hear the dialogue and the music, but everything the camera
              is doing is invisible: the wordless product demo, the chart the
              presenter gestures at, the name and title that appear under a
              speaker, the plot beat delivered by a glance. Audio description
              restores that channel by narrating it — traditionally during the
              natural pauses in dialogue.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Description helps other groups too: people with cognitive
              disabilities who benefit from key visual events being named and
              reinforced verbally, people listening to a video like a podcast
              while driving or walking, and anyone whose attention is on
              another task. Like captions, audio description is an
              accessibility feature with a large mainstream dividend.
            </p>
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
              For each prerecorded video with a soundtrack that your site
              publishes, ask: does a listener who cannot see the screen receive
              all the information a viewer does? If not, audio description must
              fill the gap. Conforming approaches include:
            </p>
            <ul className="space-y-3 mb-6">
              {[
                "A described version of the video — the description narration is mixed into the soundtrack, and the version is offered alongside (or instead of) the original.",
                "A selectable alternate audio track in the player that carries the program audio plus description, so users flip to it like a language track.",
                "Authoring the primary soundtrack to be self-describing — the presenter narrates all meaningful visual content as it happens (integrated description), which for screencasts and tutorials is often the cheapest and best option.",
              ].map((r) => (
                <li
                  key={r}
                  className="flex gap-3 rounded-lg border border-slate-200 dark:border-slate-800 p-4"
                >
                  <span aria-hidden="true" className="text-blue-500 font-bold">
                    →
                  </span>
                  <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {r}
                  </span>
                </li>
              ))}
            </ul>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Where 1.2.5 sits among its neighbors
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                  <Link
                    href="/wcag/1-2-3"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    1.2.3 Audio Description or Media Alternative
                  </Link>{" "}
                  — A
                </h4>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  At Level A you may choose: audio description <em>or</em> a
                  full descriptive transcript. At AA, 1.2.5 requires the audio
                  description itself — meeting 1.2.5 automatically meets 1.2.3.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                  1.2.7 Extended Audio Description — AAA
                </h4>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  When dialogue leaves no pauses long enough to describe the
                  visuals, extended description pauses the video to make room.
                  That is a AAA enhancement — 1.2.5 itself expects description
                  fitted into the existing soundtrack.
                </p>
              </div>
            </div>
          </section>

          {/* Pass / fail examples */}
          <section aria-labelledby="examples" className="mb-12">
            <h2
              id="examples"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Pass and fail examples
            </h2>
            <ul className="space-y-3">
              {passFailExamples.map((ex) => (
                <li
                  key={ex.t}
                  className={
                    ex.verdict === "pass"
                      ? "flex gap-3 rounded-lg border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/20 p-4"
                      : "flex gap-3 rounded-lg border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-4"
                  }
                >
                  <span
                    aria-hidden="true"
                    className={
                      ex.verdict === "pass"
                        ? "text-emerald-600 font-bold"
                        : "text-rose-500 font-bold"
                    }
                  >
                    {ex.verdict === "pass" ? "✓" : "✗"}
                  </span>
                  <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    <strong className="text-slate-900 dark:text-white">
                      {ex.verdict === "pass" ? "Pass — " : "Fail — "}
                      {ex.t}.
                    </strong>{" "}
                    {ex.d}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Code examples */}
          <section aria-labelledby="code" className="mb-12">
            <h2
              id="code"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Implementation examples
            </h2>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Offer the described version alongside the original
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              The simplest robust pattern: publish two renditions and let the
              user pick. Make the described option a first-class, clearly
              labeled link — not a footnote.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- ✗ Failing: one version, visual steps never spoken aloud -->
<video controls src="/media/product-demo.mp4"></video>

<!-- ✓ Passing: described rendition offered as an equal choice -->
<video controls src="/media/product-demo.mp4"></video>
<p>
  <a href="/media/product-demo-described.mp4">
    Watch this demo with audio description
  </a>
</p>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Or switch audio tracks in the player
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Streaming setups can carry description as an alternate audio
              rendition, exactly like a dubbed language, so one video element
              serves both audiences.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`# HLS multivariant playlist with a described audio rendition
#EXTM3U
#EXT-X-MEDIA:TYPE=AUDIO,GROUP-ID="aud",NAME="English",\\
  LANGUAGE="en",DEFAULT=YES,URI="audio_en.m3u8"
#EXT-X-MEDIA:TYPE=AUDIO,GROUP-ID="aud",NAME="English (Audio Description)",\\
  LANGUAGE="en",CHARACTERISTICS="public.accessibility.describes-video",\\
  AUTOSELECT=YES,URI="audio_en_ad.m3u8"
#EXT-X-STREAM-INF:BANDWIDTH=2500000,RESOLUTION=1280x720,AUDIO="aud"
video_720p.m3u8`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              A descriptions text track is a supplement, not the solution
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              HTML defines{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                kind=&quot;descriptions&quot;
              </code>{" "}
              for timed text meant to be spoken by assistive technology, but
              browser support is inconsistent — ship it as an extra, never as
              your only mechanism.
            </p>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<video controls>
  <source src="/media/product-demo-described.mp4" type="video/mp4" />
  <track kind="captions" src="/media/demo.en.vtt" srclang="en"
         label="English captions" default />
  <!-- Supplemental text descriptions; support varies across browsers -->
  <track kind="descriptions" src="/media/demo.desc.en.vtt" srclang="en"
         label="English descriptions" />
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
                "Publishing demo and how-to videos where crucial steps happen silently on screen — 'click here, then here' with nothing named aloud.",
                "Relying on a transcript alone: sufficient for 1.2.3 at Level A, not for 1.2.5 at Level AA.",
                "Assuming captions cover it — captions serve people who cannot hear; they do nothing for people who cannot see the video.",
                "On-screen text (speaker names, statistics, URLs, title cards) that is never read out in any audio.",
                "Buying professional description for the flagship brand film but ignoring the hundreds of tutorial and support videos where users actually need it.",
                "Hiding the described version behind an unlabeled icon or a help-center article instead of offering it next to the original.",
                "Shipping only a <track kind='descriptions'> file and assuming browsers will speak it — support is too unreliable to carry conformance alone.",
                "Scripting videos with wall-to-wall dialogue that leaves no pauses for description, when a small script change would have made room (or made the narration self-describing).",
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
              How to test for 1.2.5
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "Listen with your eyes closed",
                  d: "The definitive manual test. Play the video without looking at the screen and note every moment you lose information — an unexplained action, an unread name or number, a silent demonstration. Each note is a gap audio description must cover.",
                },
                {
                  t: "Inventory prerecorded video across the site",
                  d: "Marketing pages, help centers, onboarding flows, course content, embedded YouTube/Vimeo players. For each video with a soundtrack, record whether description exists, in what form, and where the user finds it.",
                },
                {
                  t: "Judge whether the existing audio self-describes",
                  d: "For each gap-free video from step 1, you're done — the audio track already conveys the visual information and no separate description is needed. Document that judgment; it is your conformance evidence.",
                },
                {
                  t: "Verify the description mechanism actually works",
                  d: "Play the described version or switch to the description audio track in each supported browser. Confirm the control is labeled, keyboard-accessible, and that the described audio really contains the narration.",
                },
                {
                  t: "Review description quality",
                  d: "Does the narration identify speakers and on-screen text, describe key actions, and fit the pauses without talking over dialogue? Compare against the eyes-closed notes from step 1 — every noted gap should now be filled.",
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
              No automated tool can tell whether a soundtrack conveys the
              visuals — this criterion is human judgment plus production
              process. Track it alongside the other media criteria in the{" "}
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

          <CriterionLinks number="1.2.5" />
        </article>

        {/* Related content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <RelatedContent
            content="audio description prerecorded video described version blind low vision narration visual information alternate audio track descriptions track media alternative transcript synchronized media WCAG 1.2.5 Level AA time-based media"
            maxItems={6}
          />
        </section>
      </div>
    </>
  )
}
