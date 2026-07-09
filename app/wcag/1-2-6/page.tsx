import type { Metadata } from "next"
import Link from "next/link"
import WCAGSEOEnhancements from "@/components/wcag/seo-enhancements"
import WCAGBreadcrumb from "@/components/wcag/breadcrumb"
import { CriterionLinks } from "@/components/wcag/criterion-links"

export const metadata: Metadata = {
  title: "WCAG 1.2.6 Sign Language (Prerecorded) — AAA Guide",
  description:
    "WCAG 1.2.6 requires sign language interpretation for all prerecorded audio in synchronized media. Who it helps, how to implement and test it, plus code examples.",
  keywords: [
    "WCAG 1.2.6",
    "Sign Language Prerecorded",
    "sign language interpretation video",
    "ASL video accessibility",
    "deaf accessibility video",
    "sign language interpreter overlay",
    "Level AAA",
    "WCAG 2.2",
    "time-based media",
  ],
  alternates: {
    canonical: "/wcag/1-2-6",
  },
  openGraph: {
    title: "WCAG 1.2.6 Sign Language (Prerecorded) — AAA Guide",
    description:
      "Sign language interpretation for all prerecorded audio in synchronized media: who it helps, implementation options, code examples, and how to test.",
    url: "/wcag/1-2-6",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: "/api/og?title=WCAG%201.2.6%20Sign%20Language%20(Prerecorded)&section=WCAG",
        width: 1200,
        height: 630,
        alt: "WCAG 1.2.6 Sign Language (Prerecorded) guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WCAG 1.2.6 Sign Language (Prerecorded) — AAA Guide",
    description:
      "Sign language interpretation for all prerecorded audio in synchronized media: implementation options, code examples, and how to test.",
    images: ["/api/og?title=WCAG%201.2.6%20Sign%20Language%20(Prerecorded)&section=WCAG"],
  },
}

const faqs = [
  {
    q: "What does WCAG 1.2.6 Sign Language (Prerecorded) require?",
    a: "It requires that sign language interpretation is provided for all prerecorded audio content in synchronized media — in practice, any prerecorded video that has an audio track needs a sign language interpretation of that audio. The interpretation must convey the dialogue plus the meaningful non-speech audio, such as who is speaking and important sounds. It is a Level AAA success criterion introduced in WCAG 2.0 and unchanged in WCAG 2.1 and 2.2.",
  },
  {
    q: "Why is sign language needed if the video already has captions?",
    a: "For many people who are Deaf, a sign language such as ASL or BSL is their first language and written English is a second language. Captions move at the speed of speech and demand fast reading in that second language, while sign language interpretation delivers the content in the user's native language, including intonation, emphasis, and emotion that plain caption text loses. Captions (1.2.2, Level A) remain required; sign language is the AAA enhancement on top of them.",
  },
  {
    q: "Which sign language should the interpretation use?",
    a: "The sign language of your primary audience. Sign languages are distinct natural languages, not signed versions of spoken languages — American Sign Language (ASL) and British Sign Language (BSL) are mutually unintelligible even though both audiences read English. A site aimed at a US audience would normally provide ASL; a UK site BSL; content for multiple regions may need multiple interpretations, just as spoken translations would.",
  },
  {
    q: "Does the interpreter have to be burned into the video?",
    a: "No. WCAG accepts either an 'open' interpretation that is part of the video image (typically an interpreter in a corner inset) or a 'closed' mechanism, such as a separate synchronized video stream the user can enable, a picture-in-picture overlay, or a clearly linked alternate version of the video with the interpreter included. What matters is that the interpretation exists for all the prerecorded audio and is easy to find and use.",
  },
  {
    q: "Is 1.2.6 required for legal compliance?",
    a: "Usually not. Most legislation and procurement standards — including the ADA as commonly applied, Section 508, and the European EN 301 549 — reference WCAG Level AA, and 1.2.6 is Level AAA. It is an enhancement you adopt for maximum accessibility, and it is common for government announcements, emergency information, and content specifically aimed at Deaf audiences, where some jurisdictions do require it.",
  },
  {
    q: "Does 1.2.6 apply to audio-only podcasts or live streams?",
    a: "No. The criterion scopes itself to prerecorded audio content in synchronized media — video with an audio track. Prerecorded audio-only content (a podcast) is covered by 1.2.1, which requires a transcript, and live content is covered by 1.2.4 (captions, AA) and 1.2.9 (live audio-only alternative, AAA). If a media file is explicitly labelled as a media alternative for text, it is also exempt.",
  },
]

export default function WCAG126Page() {
  return (
    <>
      <WCAGSEOEnhancements
        title="WCAG 1.2.6: Sign Language (Prerecorded)"
        description="Sign language interpretation is provided for all prerecorded audio content in synchronized media."
        criteria="1.2.6"
        level="AAA"
        principle="Perceivable"
        guideline="1.2 Time-based Media"
        url="https://accessibility.build/wcag/1-2-6"
        category="Time-based Media"
        relatedCriteria={["1.2.2", "1.2.5", "1.2.8"]}
      />

      <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <WCAGBreadcrumb items={[]} current="1.2.6 Sign Language (Prerecorded)" />

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
              WCAG 1.2.6: Sign Language (Prerecorded)
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              For many Deaf people, sign language is a first language and written text a
              second. Captions help, but they force fast reading in that second language.
              This AAA criterion asks that{" "}
              <strong className="text-slate-900 dark:text-white">
                prerecorded video with audio also provides a sign language interpretation
              </strong>{" "}
              — delivering dialogue, tone, and important sounds in the viewer&rsquo;s
              native language.
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
              Sign language interpretation is provided for all prerecorded audio content
              in synchronized media.
            </blockquote>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4 text-sm">
              &ldquo;Synchronized media&rdquo; means audio or video combined with another
              format to present time-based information — most commonly a video with a
              soundtrack. Media that is explicitly labelled as an alternative for text is
              exempt, as it is throughout Guideline 1.2.
            </p>
          </section>

          {/* AAA context */}
          <section aria-labelledby="aaa-context" className="mb-12">
            <h2
              id="aaa-context"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Where 1.2.6 sits: the AAA layer of media accessibility
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Guideline 1.2 is a ladder. At Level A,{" "}
              <Link href="/wcag/1-2-2" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                1.2.2 Captions (Prerecorded)
              </Link>{" "}
              requires captions for prerecorded video. At Level AA, 1.2.5 requires audio
              description for blind viewers. Level AAA then adds three enhancements: sign
              language interpretation (this criterion), extended audio description
              (
              <Link href="/wcag/1-2-7" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                1.2.7
              </Link>
              ), and a full text media alternative (
              <Link href="/wcag/1-2-8" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                1.2.8
              </Link>
              ).
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Because it is AAA, 1.2.6 is not part of the Level AA conformance most laws
              reference. W3C itself notes that AAA conformance is not recommended as a
              blanket policy for entire sites, because some content cannot satisfy every
              AAA criterion. Instead, teams typically apply 1.2.6 to high-value content:
              public announcements, emergency information, onboarding and training video,
              and anything aimed specifically at Deaf audiences.
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
                  t: "Deaf sign language users",
                  d: "People whose first language is a sign language receive the content in their native language rather than reading captions in a second language at the speed of speech.",
                },
                {
                  t: "People with limited reading fluency",
                  d: "Some Deaf users, particularly those deaf from birth or early childhood, read written language less fluently than they understand sign. Interpretation removes the reading burden entirely.",
                },
                {
                  t: "Viewers who need tone and emotion",
                  d: "A skilled interpreter conveys intonation, emphasis, sarcasm, and emotion through facial expression and signing style — nuance that flat caption text cannot carry.",
                },
                {
                  t: "Fast or dense content",
                  d: "Rapid dialogue, overlapping speakers, and jargon-heavy speech produce captions that are hard to follow in real time. Interpretation keeps pace naturally.",
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

          {/* Requirement in practice */}
          <section aria-labelledby="requirement" className="mb-12">
            <h2
              id="requirement"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              What a conforming interpretation looks like
            </h2>
            <ul className="space-y-3 mb-6">
              {[
                "It covers all prerecorded audio in the synchronized media — dialogue from every speaker plus meaningful non-speech information such as who is speaking and important sounds.",
                "It uses a sign language appropriate to the audience. ASL, BSL, Auslan, DGS, and others are distinct languages — an ASL interpretation does not serve a British audience.",
                "It is performed by a qualified interpreter (or fluent signer) large and clear enough on screen to be read: hands, face, and upper body visible against a plain contrasting background.",
                "It stays synchronized with the source audio, the same way captions must.",
                "It can be 'open' (part of the video image, e.g. a corner inset) or 'closed' (a user-enabled synchronized stream or an alternate signed version of the video).",
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
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/20 p-5">
                <h3 className="font-semibold text-emerald-800 dark:text-emerald-300 mb-2">
                  ✓ Passes
                </h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed list-disc pl-4">
                  <li>A training video with an ASL interpreter inset in the corner for its full duration.</li>
                  <li>A player button that toggles a synchronized sign language video overlay on and off.</li>
                  <li>A clearly linked alternate version of the video that includes the interpreter.</li>
                </ul>
              </div>
              <div className="rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-5">
                <h3 className="font-semibold text-rose-800 dark:text-rose-300 mb-2">
                  ✗ Fails
                </h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed list-disc pl-4">
                  <li>Captions only — captions satisfy 1.2.2 but not this criterion.</li>
                  <li>An interpreter inset so small or low-resolution that handshapes and facial expression cannot be read.</li>
                  <li>Interpretation that covers the narration but skips a second speaker or key sound effects.</li>
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
              1. Offer a signed version of the video
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              The simplest conforming approach: produce a second render of the video with
              the interpreter composited into the image, and link it next to the
              original.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<video controls poster="/media/orientation-poster.jpg">
  <source src="/media/orientation.mp4" type="video/mp4" />
  <track kind="captions" src="/media/orientation.vtt"
         srclang="en" label="English" default />
</video>

<p>
  <a href="/media/orientation-asl.mp4">
    Watch this video with ASL interpretation
  </a>
</p>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              2. A user-toggled, synchronized interpreter overlay
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              A &ldquo;closed&rdquo; interpretation keeps the main video clean for
              everyone else. Play a second, muted interpreter video in sync with the
              main one and let the user show or hide it.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<div class="player">
  <video id="main" controls src="/media/keynote.mp4"></video>
  <video id="signer" muted hidden
         src="/media/keynote-asl.mp4"
         aria-label="ASL interpretation"></video>
  <button id="toggle-sign" type="button" aria-pressed="false">
    Show sign language interpreter
  </button>
</div>

<script>
  const main = document.getElementById("main");
  const signer = document.getElementById("signer");
  const toggle = document.getElementById("toggle-sign");

  toggle.addEventListener("click", () => {
    const show = signer.hidden;
    signer.hidden = !show;
    toggle.setAttribute("aria-pressed", String(show));
    signer.currentTime = main.currentTime; // stay in sync
    if (show && !main.paused) signer.play();
  });

  // Mirror play, pause, and seeking
  main.addEventListener("play", () => !signer.hidden && signer.play());
  main.addEventListener("pause", () => signer.pause());
  main.addEventListener("seeked", () => {
    signer.currentTime = main.currentTime;
  });
</script>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              3. Production notes for the interpreter video
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              The interpretation only works if it can be read. When compositing an inset,
              keep it large — W3C techniques suggest the signer occupy a meaningful share
              of the frame, not a thumbnail.
            </p>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`/* Corner inset that stays legible at typical sizes */
.signer-inset {
  position: absolute;
  right: 1rem;
  bottom: 3.5rem;            /* clear of the control bar */
  width: clamp(160px, 25%, 320px);
  aspect-ratio: 3 / 4;       /* head-and-torso framing */
  border: 2px solid #fff;
  border-radius: 0.5rem;
  background: #1e293b;       /* plain, contrasting backdrop */
}`}</code>
            </pre>
          </section>

          {/* Testing */}
          <section aria-labelledby="testing" className="mb-12">
            <h2
              id="testing"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              How to test for 1.2.6
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "Inventory the synchronized media",
                  d: "List every prerecorded video that has an audio track. Media that is a labelled alternative for text is exempt; everything else is in scope for AAA conformance.",
                },
                {
                  t: "Confirm an interpretation exists and is discoverable",
                  d: "For each video, verify there is either an interpreter in the picture, a control that enables a synchronized interpretation, or an obvious link to a signed version adjacent to the video.",
                },
                {
                  t: "Check completeness",
                  d: "Play the full video. The interpretation must run for all audio content — every speaker and meaningful sound — not just the intro or the main narrator.",
                },
                {
                  t: "Check legibility and synchronization",
                  d: "At the sizes users actually watch (including mobile), the signer's hands and face must be clearly readable, and the interpretation must track the audio without drifting.",
                },
                {
                  t: "Verify the language matches the audience",
                  d: "Confirm the sign language provided is the one used by the content's primary audience, and ideally have a fluent signer review quality — this is a human-judgment check no automated tool can make.",
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
                "Relying on captions alone and assuming they make sign language unnecessary — the two serve different needs and different criteria.",
                "An interpreter inset rendered so small (or compressed so heavily) that handshapes, fingerspelling, and facial grammar are unreadable.",
                "Interpretation that covers only part of the audio — for example, the host but not interview guests, or speech but not plot-critical sounds.",
                "Providing the wrong sign language for the audience, such as ASL on content aimed at BSL users.",
                "A signed version that exists but is buried — no link or control anywhere near the original video.",
                "An interpreter overlay that drifts out of sync after seeking or pausing, so signs no longer match the audio.",
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

          <CriterionLinks number="1.2.6" />
        </article>
      </div>
    </>
  )
}
