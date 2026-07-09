import type { Metadata } from "next"
import Link from "next/link"
import WCAGSEOEnhancements from "@/components/wcag/seo-enhancements"
import WCAGBreadcrumb from "@/components/wcag/breadcrumb"
import { CriterionLinks } from "@/components/wcag/criterion-links"

export const metadata: Metadata = {
  title: "WCAG 1.2.7 Extended Audio Description — AAA Guide",
  description:
    "WCAG 1.2.7 requires extended audio description — pausing video for longer narration — when normal pauses can't convey the visuals. How it works and how to test.",
  keywords: [
    "WCAG 1.2.7",
    "Extended Audio Description",
    "extended audio description prerecorded",
    "audio description video pauses",
    "described video AAA",
    "blind users video accessibility",
    "Level AAA",
    "WCAG 2.2",
    "time-based media",
  ],
  alternates: {
    canonical: "/wcag/1-2-7",
  },
  openGraph: {
    title: "WCAG 1.2.7 Extended Audio Description (Prerecorded) — AAA Guide",
    description:
      "When pauses in dialogue are too short for audio description, the video must pause for extended narration. What 1.2.7 requires, implementation options, and testing.",
    url: "/wcag/1-2-7",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: "/api/og?title=WCAG%201.2.7%20Extended%20Audio%20Description%20(Prerecorded)&section=WCAG",
        width: 1200,
        height: 630,
        alt: "WCAG 1.2.7 Extended Audio Description guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WCAG 1.2.7 Extended Audio Description — AAA Guide",
    description:
      "When dialogue pauses are too short for audio description, pause the video for extended narration. Requirements, implementation, and testing for 1.2.7.",
    images: [
      "/api/og?title=WCAG%201.2.7%20Extended%20Audio%20Description%20(Prerecorded)&section=WCAG",
    ],
  },
}

const faqs = [
  {
    q: "What does WCAG 1.2.7 Extended Audio Description require?",
    a: "It requires that where pauses in the foreground audio are insufficient to allow audio descriptions to convey the sense of the video, extended audio description is provided for all prerecorded video content in synchronized media. Extended audio description works by periodically freezing the video image while a longer narration describes what is happening, then resuming playback. It is a Level AAA success criterion introduced in WCAG 2.0 and unchanged in WCAG 2.2.",
  },
  {
    q: "How is extended audio description different from standard audio description?",
    a: "Standard audio description (1.2.5, Level AA) squeezes narration into the natural pauses between dialogue — the description can never be longer than the gaps allow. Extended audio description removes that limit: the video and its audio are paused, the narrator describes the visuals at whatever length is needed, and then the video resumes. The total running time of the described version becomes longer than the original.",
  },
  {
    q: "When is extended audio description actually needed?",
    a: "Only when the standard approach cannot work — that is, when the video is so dense with dialogue or continuous narration that the pauses are too short to describe essential visual information. A talking-head lecture where the speaker says everything that appears on screen needs no description at all. A fast-cut demo where actions on screen are never verbalized, and the presenter never stops talking, is exactly the case 1.2.7 targets.",
  },
  {
    q: "Does 1.2.7 replace 1.2.5 Audio Description?",
    a: "No, it builds on it. 1.2.5 (Level AA) requires audio description for all prerecorded video in synchronized media. 1.2.7 (Level AAA) adds that when ordinary pauses are insufficient, the description must be extended by pausing the video. If natural pauses are sufficient to convey the sense of the video, standard audio description also satisfies 1.2.7 — the extension is only required where it is needed.",
  },
  {
    q: "How do I deliver an extended described version technically?",
    a: "The most common approach is a separately produced alternate version of the video with the freezes and extended narration edited in, offered via a link or player menu next to the original. More dynamic approaches script the pauses in the player: JavaScript pauses the video at cue points, plays a description audio clip (or has a screen reader announce text), then resumes. The SMIL standard also supports this, though player support is limited; a produced alternate file is the most robust route.",
  },
  {
    q: "Is 1.2.7 required for ADA, Section 508, or EN 301 549 compliance?",
    a: "Generally no — those standards reference WCAG Level AA, and 1.2.7 is Level AAA. Standard audio description (1.2.5) is the AA requirement. Extended description is an enhancement most valuable for instructional and training video, where missing the visual steps means missing the content, and for organizations that have committed to AAA media accessibility.",
  },
]

export default function WCAG127Page() {
  return (
    <>
      <WCAGSEOEnhancements
        title="WCAG 1.2.7: Extended Audio Description (Prerecorded)"
        description="Where pauses in foreground audio are insufficient to allow audio descriptions to convey the sense of the video, extended audio description is provided for all prerecorded video content in synchronized media."
        criteria="1.2.7"
        level="AAA"
        principle="Perceivable"
        guideline="1.2 Time-based Media"
        url="https://accessibility.build/wcag/1-2-7"
        category="Time-based Media"
        relatedCriteria={["1.2.3", "1.2.5", "1.2.8"]}
      />

      <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <WCAGBreadcrumb
            items={[]}
            current="1.2.7 Extended Audio Description (Prerecorded)"
          />

          {/* Header */}
          <header className="mb-12">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                Level AAA
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Principle 1: Perceivable
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                Guideline 1.2 Time-based Media
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
              WCAG 1.2.7: Extended Audio Description (Prerecorded)
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              Standard audio description has a hard constraint: the narration must fit
              into the pauses between dialogue. When a video never stops talking, those
              pauses do not exist. This AAA criterion says that in that case,{" "}
              <strong className="text-slate-900 dark:text-white">
                the video itself must pause so an extended description can convey what is
                on screen
              </strong>
              , then resume.
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
              Where pauses in foreground audio are insufficient to allow audio
              descriptions to convey the sense of the video, extended audio description
              is provided for all prerecorded video content in synchronized media.
            </blockquote>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4 text-sm">
              The conditional matters: extended description is only required{" "}
              <em>where pauses are insufficient</em>. If ordinary gaps in the soundtrack
              are long enough for standard description to convey the sense of the video,
              that standard description satisfies this criterion too.
            </p>
          </section>

          {/* AAA context */}
          <section aria-labelledby="aaa-context" className="mb-12">
            <h2
              id="aaa-context"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              AAA context: the audio description ladder
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Three criteria form a progression.{" "}
              <Link href="/wcag/1-2-3" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                1.2.3
              </Link>{" "}
              (Level A) lets you choose between an audio description <em>or</em> a full
              text alternative. 1.2.5 (Level AA) requires the audio description itself.
              1.2.7 (Level AAA) closes the last gap: content where even a well-written
              standard description cannot fit, because the foreground audio leaves no
              room.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Think of a software walkthrough where the presenter talks continuously
              while clicking through menus, never naming what they click. A blind viewer
              hears an unbroken monologue and misses every action. Freezing the frame —
              &ldquo;The presenter opens the Settings menu and selects Privacy, third
              item in the list&rdquo; — and then resuming is the only way to make that
              video genuinely equivalent.
            </p>
          </section>

          {/* Who it helps */}
          <section aria-labelledby="who" className="mb-12">
            <h2
              id="who"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Who this helps
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  t: "People who are blind",
                  d: "All essential visual information — actions, on-screen text, scene changes, charts — is narrated at sufficient length instead of being compressed into gaps or dropped.",
                },
                {
                  t: "People with low vision",
                  d: "Viewers who can see the video but not read on-screen details (menu labels, code, small diagrams) get those details spoken in full.",
                },
                {
                  t: "Learners using audio only",
                  d: "Anyone consuming instructional content without watching the screen — a common situation for training material — can follow every demonstrated step.",
                },
                {
                  t: "People with some cognitive disabilities",
                  d: "Pausing the action while the visuals are explained gives extra processing time, which the Understanding document explicitly calls out as a secondary benefit.",
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

          {/* How it works + pass/fail */}
          <section aria-labelledby="requirement" className="mb-12">
            <h2
              id="requirement"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              How extended audio description works
            </h2>
            <ol className="space-y-3 mb-6 list-none">
              {[
                "Identify the points where essential visual information appears but the foreground audio leaves no usable pause.",
                "At each point, freeze the video (and hold or duck the programme audio).",
                "Play the extended narration describing the visual content — as long as it needs to be.",
                "Resume normal playback. Repeat wherever needed; the described version ends up longer than the original.",
              ].map((s, i) => (
                <li
                  key={s}
                  className="flex gap-4 rounded-xl border border-slate-200 dark:border-slate-800 p-4"
                >
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="text-slate-700 dark:text-slate-300 leading-relaxed self-center">
                    {s}
                  </span>
                </li>
              ))}
            </ol>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/20 p-5">
                <h3 className="font-semibold text-emerald-800 dark:text-emerald-300 mb-2">
                  ✓ Passes
                </h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed list-disc pl-4">
                  <li>A second, clearly linked &ldquo;extended described&rdquo; version of a dense tutorial, with pauses edited in for full narration.</li>
                  <li>A player that pauses at scripted cue points, speaks a description, then resumes automatically.</li>
                  <li>A dialogue-heavy video whose natural pauses happen to be long enough — standard description conveys the sense, so no extension is needed.</li>
                </ul>
              </div>
              <div className="rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-5">
                <h3 className="font-semibold text-rose-800 dark:text-rose-300 mb-2">
                  ✗ Fails
                </h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed list-disc pl-4">
                  <li>Standard description that skips essential visuals because &ldquo;there was no room&rdquo; in the soundtrack.</li>
                  <li>Description narration that talks over the programme dialogue, making both unintelligible.</li>
                  <li>An extended version that exists but describes only some scenes, leaving key demonstrations unnarrated.</li>
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
              Implementation patterns
            </h2>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              1. Link an extended-described version
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Produce the extended version in your editing tool (freeze-frames plus
              narration) and offer it alongside the original. This is the most robust
              approach because it works in every player.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<video controls src="/media/dashboard-tour.mp4">
  <track kind="captions" src="/media/dashboard-tour.vtt"
         srclang="en" label="English" default />
</video>

<ul class="media-alternatives">
  <li>
    <a href="/media/dashboard-tour-extended-ad.mp4">
      Extended audio described version (runs 9:40 instead of 6:15)
    </a>
  </li>
</ul>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              2. Script the pauses in the player
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              For a single-source workflow, define cue points where the player pauses,
              plays a description clip, and resumes. The same cue data can generate a
              text transcript for{" "}
              <Link href="/wcag/1-2-8" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                1.2.8
              </Link>
              .
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`const cues = [
  { at: 42.0,  clip: "/media/desc/settings-menu.mp3" },
  { at: 95.5,  clip: "/media/desc/import-dialog.mp3" },
  { at: 180.2, clip: "/media/desc/final-chart.mp3" },
];

const video = document.getElementById("tour");
let next = 0;

video.addEventListener("timeupdate", () => {
  if (next >= cues.length) return;
  if (video.currentTime >= cues[next].at) {
    video.pause();
    const desc = new Audio(cues[next].clip);
    desc.addEventListener("ended", () => video.play());
    desc.play();
    next += 1;
  }
});

// Reset the cue pointer when the user seeks backwards
video.addEventListener("seeked", () => {
  next = cues.findIndex((c) => c.at > video.currentTime);
  if (next === -1) next = cues.length;
});`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              3. Make the option discoverable
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              However it is delivered, users must be able to find and enable it — a
              labelled control near the player, not a buried settings page.
            </p>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<button type="button" id="ext-ad-toggle" aria-pressed="false">
  Enable extended audio description
  <span class="hint">(video pauses for longer descriptions)</span>
</button>`}</code>
            </pre>
          </section>

          {/* Testing */}
          <section aria-labelledby="testing" className="mb-12">
            <h2
              id="testing"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              How to test for 1.2.7
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "Watch the video with the screen off (or eyes closed)",
                  d: "Note every point where something essential happens visually that the soundtrack does not convey — actions, on-screen text, charts, scene changes. This is the information description must carry.",
                },
                {
                  t: "Assess whether natural pauses are sufficient",
                  d: "Compare the amount of essential visual information against the available gaps in the foreground audio. If the standard description track already conveys the sense of the video, 1.2.7 is satisfied without extension.",
                },
                {
                  t: "If pauses are insufficient, confirm an extended version exists",
                  d: "Look for a linked extended-described version, a player mode, or scripted pauses. Its narration must cover all the essential visual information you catalogued.",
                },
                {
                  t: "Play the extended version end to end",
                  d: "Verify the video actually pauses for the added narration, the descriptions are accurate and complete, and playback resumes correctly — including after the user seeks.",
                },
                {
                  t: "Check discoverability",
                  d: "A user who needs extended description must be able to find it from the original video without guesswork: an adjacent link or a clearly labelled player control.",
                },
              ].map((step, i) => (
                <li
                  key={step.t}
                  className="flex gap-4 rounded-xl border border-slate-200 dark:border-slate-800 p-5"
                >
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center">
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

          {/* Common failures */}
          <section aria-labelledby="failures" className="mb-12">
            <h2
              id="failures"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Common failures
            </h2>
            <ul className="space-y-3">
              {[
                "Dropping essential visual information from the description because the soundtrack had no pauses — the exact situation extended description exists for.",
                "Cramming rushed, truncated descriptions into gaps that are too short, producing narration nobody can follow.",
                "Describing over the top of dialogue instead of pausing, so users lose both the description and the speech.",
                "Publishing an extended version but never linking it from the original video page.",
                "Scripted player pauses that break when the user seeks or replays, so descriptions fire at the wrong times or twice.",
                "Treating a text transcript as a substitute — a transcript can satisfy 1.2.8, but it does not satisfy 1.2.7, which requires description within the synchronized media experience.",
              ].map((m) => (
                <li
                  key={m}
                  className="flex gap-3 rounded-lg border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-4"
                >
                  <span aria-hidden="true" className="text-rose-500 font-bold">
                    ✗
                  </span>
                  <span className="text-slate-700 dark:text-slate-300 leading-relaxed">{m}</span>
                </li>
              ))}
            </ul>
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

          <CriterionLinks number="1.2.7" />
        </article>
      </div>
    </>
  )
}
