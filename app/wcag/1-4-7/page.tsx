import type { Metadata } from "next"
import Link from "next/link"
import WCAGSEOEnhancements from "@/components/wcag/seo-enhancements"
import WCAGBreadcrumb from "@/components/wcag/breadcrumb"
import { CriterionLinks } from "@/components/wcag/criterion-links"

export const metadata: Metadata = {
  title: "WCAG 1.4.7 Low or No Background Audio — AAA Guide",
  description:
    "WCAG 1.4.7 requires speech audio with no background sound, a turn-off option, or background at least 20 dB quieter. Scope, exceptions, examples, and testing.",
  keywords: [
    "WCAG 1.4.7",
    "Low or No Background Audio",
    "20 dB background audio",
    "speech audio accessibility",
    "background music podcast accessibility",
    "hard of hearing audio",
    "Level AAA",
    "WCAG 2.2",
    "distinguishable",
  ],
  alternates: {
    canonical: "/wcag/1-4-7",
  },
  openGraph: {
    title: "WCAG 1.4.7 Low or No Background Audio — AAA Guide",
    description:
      "Prerecorded speech audio must have no background sounds, let users turn them off, or keep them at least 20 dB below the speech. Scope, exceptions, and testing.",
    url: "/wcag/1-4-7",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: "/api/og?title=WCAG%201.4.7%20Low%20or%20No%20Background%20Audio&section=WCAG",
        width: 1200,
        height: 630,
        alt: "WCAG 1.4.7 Low or No Background Audio guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WCAG 1.4.7 Low or No Background Audio — AAA Guide",
    description:
      "Prerecorded speech audio must have no background sounds, let users turn them off, or keep them at least 20 dB below the speech. Scope, exceptions, testing.",
    images: ["/api/og?title=WCAG%201.4.7%20Low%20or%20No%20Background%20Audio&section=WCAG"],
  },
}

const faqs = [
  {
    q: "What does WCAG 1.4.7 Low or No Background Audio require?",
    a: "For prerecorded audio-only content that primarily contains speech in the foreground, at least one of the following must be true: the audio contains no background sounds; the background sounds can be turned off; or the background sounds are at least 20 decibels lower than the foreground speech, except for occasional sounds lasting only one or two seconds. Content that is an audio CAPTCHA, an audio logo, or vocalization intended primarily as musical expression (singing, rapping) is out of scope. It is a Level AAA criterion from WCAG 2.0.",
  },
  {
    q: "How loud is a 20 dB difference in practice?",
    a: "Decibels are logarithmic, so 20 dB is a large gap: the background is about one-quarter as loud as the speech perceptually (and one-tenth the sound pressure). The W3C's own note puts it plainly — background sound that meets this requirement will be approximately four times quieter than the foreground speech. If you can comfortably follow every word without straining to separate it from the music bed, you are probably in the right territory; verify with metering rather than ears alone.",
  },
  {
    q: "What content does 1.4.7 apply to — and what is excluded?",
    a: "It applies to prerecorded audio-only content whose primary content is speech: podcasts, narrated audio articles, recorded lectures and briefings, audio guides. It does not apply to video soundtracks (audio that is part of synchronized media is out of this criterion's scope), to live audio, to audio CAPTCHAs and audio logos, or to performances where the vocals are the music — a song is allowed to have instruments behind the singer.",
  },
  {
    q: "Why do background sounds matter so much for hard-of-hearing listeners?",
    a: "People who are hard of hearing have a substantially reduced ability to separate speech from competing sound — a skill hearing people exercise unconsciously. Around 1 in 12 people have some hearing loss, and for many of them a music bed at 'tasteful' production levels turns speech into mush, especially with high-frequency loss where consonants live. Cognitive processing differences and auditory processing disorder create similar difficulty. A 20 dB margin restores the separation that typical mixing assumes.",
  },
  {
    q: "How do I measure whether my mix meets the 20 dB rule?",
    a: "In your audio editor (Audacity, Adobe Audition, Reaper), compare the level of a speech-only section against a background-only section — or better, export the stems. Measure with RMS or LUFS rather than instantaneous peaks, since perceived loudness is what matters. If speech averages, say, -16 LUFS, the background bed should sit at or below -36 LUFS. Occasional one-to-two-second sounds (a transition sting, a door closing) may exceed the limit without failing.",
  },
  {
    q: "What is the easiest way to conform?",
    a: "Record and publish clean narration — no background sounds means automatic conformance, and it is what most listeners prefer for spoken content anyway. If the production style calls for music, publish an alternate 'voice-only' version or deliver background as a separately toggleable track, which satisfies the 'can be turned off' branch. Mixing to the 20 dB spec is the third route, and the one requiring actual metering discipline.",
  },
]

export default function WCAG147Page() {
  return (
    <>
      <WCAGSEOEnhancements
        title="WCAG 1.4.7: Low or No Background Audio"
        description="For prerecorded audio-only content that primarily contains speech, background sounds are absent, can be turned off, or are at least 20 dB lower than the speech."
        criteria="1.4.7"
        level="AAA"
        principle="Perceivable"
        guideline="1.4 Distinguishable"
        url="https://accessibility.build/wcag/1-4-7"
        category="Distinguishable"
        relatedCriteria={["1.4.2", "1.2.1", "1.4.6"]}
      />

      <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <WCAGBreadcrumb items={[]} current="1.4.7 Low or No Background Audio" />

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
                Guideline 1.4 Distinguishable
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
              WCAG 1.4.7: Low or No Background Audio
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              A music bed that sounds &ldquo;subtle&rdquo; to a hearing producer can bury
              every consonant for a hard-of-hearing listener. For prerecorded speech
              audio, this AAA criterion requires{" "}
              <strong className="text-slate-900 dark:text-white">
                no background sound, a way to turn it off, or a background at least 20 dB
                below the speech
              </strong>{" "}
              — roughly four times quieter.
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
              For prerecorded audio-only content that (1) contains primarily speech in
              the foreground, (2) is not an audio CAPTCHA or audio logo, and (3) is not
              vocalization intended to be primarily musical expression such as singing or
              rapping, at least one of the following is true:{" "}
              <strong>No Background</strong> — the audio does not contain background
              sounds; <strong>Turn Off</strong> — the background sounds can be turned
              off; <strong>20 dB</strong> — the background sounds are at least 20
              decibels lower than the foreground speech content, with the exception of
              occasional sounds that last for only one or two seconds.
            </blockquote>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4 text-sm">
              Per the accompanying note, a 20 dB difference means the background is
              approximately four times quieter than the foreground speech.
            </p>
          </section>

          {/* Scope */}
          <section aria-labelledby="scope" className="mb-12">
            <h2
              id="scope"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              What is in scope — and what is not
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  In scope
                </h3>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed list-disc pl-4">
                  <li>Podcasts and narrated audio articles</li>
                  <li>Recorded lectures, briefings, and interviews published as audio</li>
                  <li>Audio tours and guides</li>
                  <li>Any prerecorded, audio-only file whose point is the speech</li>
                </ul>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  Out of scope
                </h3>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300 leading-relaxed list-disc pl-4">
                  <li>Video soundtracks (synchronized media)</li>
                  <li>Live audio streams</li>
                  <li>Audio CAPTCHAs and audio logos</li>
                  <li>Singing and rapping — vocals as musical expression</li>
                </ul>
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              This is the AAA companion to{" "}
              <Link href="/wcag/1-4-2" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                1.4.2 Audio Control
              </Link>{" "}
              (Level A), which handles auto-playing audio, and to{" "}
              <Link href="/wcag/1-2-1" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                1.2.1
              </Link>
              , which requires a transcript for the same content. The transcript is the
              fallback; 1.4.7 is about making the audio itself usable for people who
              want to listen.
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
                  t: "People who are hard of hearing",
                  d: "Hearing loss sharply reduces the ability to separate speech from competing sound. High-frequency loss in particular erases consonants first — exactly what background music masks.",
                },
                {
                  t: "Hearing aid and CI users",
                  d: "Hearing aids and cochlear implants compress the dynamic range, which pushes background sound closer to speech. A generous margin in the source mix survives that processing.",
                },
                {
                  t: "People with auditory processing differences",
                  d: "Some listeners hear at normal thresholds but cannot filter overlapping streams of sound. Clean speech dramatically reduces the effort of listening.",
                },
                {
                  t: "Non-native listeners and noisy environments",
                  d: "Understanding a second language, or listening on transit through cheap earbuds, both consume the same headroom the background music is eating.",
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

          {/* Pass / fail */}
          <section aria-labelledby="examples" className="mb-12">
            <h2
              id="examples"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Pass and fail examples
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/20 p-5">
                <h3 className="font-semibold text-emerald-800 dark:text-emerald-300 mb-2">
                  ✓ Passes
                </h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed list-disc pl-4">
                  <li>A narrated article recorded as clean voice with no bed at all.</li>
                  <li>A podcast whose intro sting plays, ends, and then leaves the conversation dry.</li>
                  <li>A documentary-style piece mixed with the ambience bed 24 dB under the narration (RMS).</li>
                  <li>A player offering &ldquo;voice only&rdquo; and &ldquo;full mix&rdquo; versions of the same episode.</li>
                </ul>
              </div>
              <div className="rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-5">
                <h3 className="font-semibold text-rose-800 dark:text-rose-300 mb-2">
                  ✗ Fails
                </h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed list-disc pl-4">
                  <li>A guided meditation with continuous music only ~8 dB under the voice.</li>
                  <li>An interview recorded in a café, espresso machine competing with the answers.</li>
                  <li>A produced piece where music swells over the narrator at every section break for 10+ seconds.</li>
                  <li>&ldquo;Turn off music&rdquo; exists — but only as a setting that re-renders future episodes, not this one.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Implementation */}
          <section aria-labelledby="code" className="mb-12">
            <h2
              id="code"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Implementation patterns
            </h2>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              1. Offer a voice-only alternative (&ldquo;Turn Off&rdquo; branch)
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Export two masters from the same session — full mix and narration only —
              and let the listener choose.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<h2>Episode 42: Designing for everyone</h2>

<audio controls src="/audio/ep42-full-mix.mp3"></audio>

<p>
  <a href="/audio/ep42-voice-only.mp3">
    Listen to the voice-only version (no background music)
  </a>
  · <a href="/transcripts/ep42">Read the transcript</a>
</p>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              2. A real-time background toggle with the Web Audio API
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              If you ship speech and background as separate tracks, the
              &ldquo;off&rdquo; switch can live in the player itself.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<audio id="speech" src="/audio/ep42-voice.mp3" controls></audio>
<audio id="bed" src="/audio/ep42-music.mp3" muted></audio>
<label>
  <input type="checkbox" id="bed-toggle" />
  Play background music (at reduced volume)
</label>

<script>
  const speech = document.getElementById("speech");
  const bed = document.getElementById("bed");
  const toggle = document.getElementById("bed-toggle");

  bed.volume = 0.1;           // ≈ -20 dB relative to full scale
  toggle.addEventListener("change", () => {
    bed.muted = !toggle.checked;
  });

  // Keep the two elements locked together
  speech.addEventListener("play", () => { bed.currentTime = speech.currentTime; bed.play(); });
  speech.addEventListener("pause", () => bed.pause());
  speech.addEventListener("seeked", () => { bed.currentTime = speech.currentTime; });
</script>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              3. Production checklist for the 20 dB branch
            </h3>
            <ul className="space-y-3">
              {[
                "Meter speech and background separately using RMS or LUFS, not peak: if narration averages -16 LUFS, keep the bed at or below -36 LUFS.",
                "Duck the bed during speech rather than relying on a fixed level; automation should hold the 20 dB margin whenever anyone talks.",
                "Reserve louder moments for gaps in speech or keep them under about two seconds — the criterion's 'occasional sounds' allowance.",
                "Check the final encode on laptop speakers and earbuds; heavy MP3 compression and small drivers can smear a marginal mix.",
              ].map((r) => (
                <li
                  key={r}
                  className="flex gap-3 rounded-lg border border-slate-200 dark:border-slate-800 p-4"
                >
                  <span aria-hidden="true" className="text-purple-500 font-bold">
                    →
                  </span>
                  <span className="text-slate-700 dark:text-slate-300 leading-relaxed">{r}</span>
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
              How to test for 1.4.7
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "Identify in-scope audio",
                  d: "List prerecorded, audio-only content where speech is the primary content. Set aside video soundtracks, live streams, CAPTCHAs, audio logos, and musical vocals.",
                },
                {
                  t: "Listen for background sound",
                  d: "Play each file with decent headphones. If there is genuinely no background sound, the file passes on the 'No Background' branch and you are done.",
                },
                {
                  t: "Look for a turn-off mechanism",
                  d: "If background exists, check for a voice-only version, a stem toggle in the player, or an equivalent published alternative — and confirm it actually removes the background.",
                },
                {
                  t: "Measure the level difference",
                  d: "Otherwise, load the audio into an editor. Compare speech-heavy passages against background-only passages (or stems) using RMS/LUFS. The background must sit at least 20 dB below the speech.",
                },
                {
                  t: "Apply the occasional-sounds allowance correctly",
                  d: "Brief sounds of one or two seconds may exceed the limit. Sustained beds, long swells, and recurring loud effects may not — flag anything that competes with speech for longer than a moment.",
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
                "A continuous music bed mixed at 'production-tasteful' levels — typically 8–12 dB under speech, half the required margin.",
                "Recording interviews in noisy rooms, baking irreducible background into the only master that exists.",
                "Music swells over narration at transitions that run far past the one-to-two-second allowance.",
                "Judging by ear on studio monitors only — a mix that seems fine to a hearing engineer at high volume fails listeners with hearing loss on earbuds.",
                "Offering a 'voice only' link that points to the same full-mix file (broken alternates are surprisingly common).",
                "Assuming the transcript excuses the audio — 1.2.1's transcript is a separate requirement, not a substitute for a usable mix.",
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

          <CriterionLinks number="1.4.7" />
        </article>
      </div>
    </>
  )
}
