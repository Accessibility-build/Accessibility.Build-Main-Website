import type { Metadata } from "next"
import Link from "next/link"
import WCAGSEOEnhancements from "@/components/wcag/seo-enhancements"
import WCAGBreadcrumb from "@/components/wcag/breadcrumb"
import { CriterionLinks } from "@/components/wcag/criterion-links"

export const metadata: Metadata = {
  title: "WCAG 1.2.8 Media Alternative (Prerecorded) Guide",
  description:
    "WCAG 1.2.8 requires a full text alternative — a descriptive transcript — for prerecorded synchronized media and video-only media. What it must contain and how to test.",
  keywords: [
    "WCAG 1.2.8",
    "Media Alternative Prerecorded",
    "descriptive transcript",
    "full text alternative video",
    "alternative for time-based media",
    "deafblind accessibility",
    "Level AAA",
    "WCAG 2.2",
    "time-based media",
  ],
  alternates: {
    canonical: "/wcag/1-2-8",
  },
  openGraph: {
    title: "WCAG 1.2.8 Media Alternative (Prerecorded) — AAA Guide",
    description:
      "A full descriptive transcript for prerecorded video: dialogue, sounds, visual information, and interactions in sequence. Requirements, examples, and testing for 1.2.8.",
    url: "/wcag/1-2-8",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: "/api/og?title=WCAG%201.2.8%20Media%20Alternative%20(Prerecorded)&section=WCAG",
        width: 1200,
        height: 630,
        alt: "WCAG 1.2.8 Media Alternative (Prerecorded) guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WCAG 1.2.8 Media Alternative (Prerecorded) — AAA Guide",
    description:
      "A full descriptive transcript for prerecorded video: dialogue, sounds, visual information, and interactions in sequence. Requirements and testing for 1.2.8.",
    images: ["/api/og?title=WCAG%201.2.8%20Media%20Alternative%20(Prerecorded)&section=WCAG"],
  },
}

const faqs = [
  {
    q: "What does WCAG 1.2.8 Media Alternative (Prerecorded) require?",
    a: "It requires that an alternative for time-based media — a full descriptive text transcript — is provided for all prerecorded synchronized media (video with audio) and for all prerecorded video-only media. The transcript must tell the whole story: dialogue attributed to speakers, meaningful sounds, descriptions of important visual information, and the outcomes of any interactions, all in the correct sequence, so that reading it is a genuine equivalent to watching the video. It is a Level AAA criterion from WCAG 2.0, unchanged in 2.2.",
  },
  {
    q: "How is a media alternative different from a normal transcript or captions?",
    a: "Captions are timed text for the audio only, viewed alongside the video. A basic dialogue transcript covers only what was said. An 'alternative for time-based media' goes further: it interleaves the dialogue with descriptions of what happens visually — actions, scene changes, on-screen text, charts — in reading order, and describes the result of any user interaction the media involves. The W3C often calls this a descriptive transcript. Someone who cannot see or hear the video at all should lose nothing by reading it instead.",
  },
  {
    q: "Who primarily benefits from 1.2.8?",
    a: "People who are deafblind are the core audience: captions are invisible to them and audio description inaudible, so a text document readable by a refreshable braille display is the only way to access the content. The transcript also serves people with limited bandwidth or no media player, people who process text better than time-based media, and anyone who wants to search, skim, translate, or quote the content — plus it makes the material indexable by search engines.",
  },
  {
    q: "How does 1.2.8 relate to 1.2.3 Audio Description or Media Alternative?",
    a: "1.2.3 (Level A) gives a choice for prerecorded video with audio: provide either an audio description or a media alternative. At Level AA, 1.2.5 mandates the audio description branch. 1.2.8 (Level AAA) mandates the media-alternative branch as well — so at AAA, dense video content ends up with captions, audio description, and a full descriptive transcript. If you already wrote a media alternative to satisfy 1.2.3, the same document satisfies 1.2.8.",
  },
  {
    q: "Does 1.2.8 apply to audio-only content like podcasts?",
    a: "No. Prerecorded audio-only content is covered by 1.2.1 (Level A), which already requires a transcript-style alternative. 1.2.8 scopes to prerecorded synchronized media (video with an audio track) and prerecorded video-only media (video with no audio, such as a silent screen demo). As with all of Guideline 1.2, media that is itself a labelled alternative for text is exempt.",
  },
  {
    q: "Where should the transcript live and how should it be linked?",
    a: "Either on the same page as the media, immediately adjacent to it, or on a separate page linked directly from beside the player. The link or heading should name it clearly — for example 'Descriptive transcript' — and the transcript should be plain, structured HTML: headings for scenes, paragraphs for narration and description, and speaker names before dialogue. Avoid burying it inside a PDF or behind multiple navigation steps; discoverability is part of usability here.",
  },
]

export default function WCAG128Page() {
  return (
    <>
      <WCAGSEOEnhancements
        title="WCAG 1.2.8: Media Alternative (Prerecorded)"
        description="An alternative for time-based media is provided for all prerecorded synchronized media and for all prerecorded video-only media."
        criteria="1.2.8"
        level="AAA"
        principle="Perceivable"
        guideline="1.2 Time-based Media"
        url="https://accessibility.build/wcag/1-2-8"
        category="Time-based Media"
        relatedCriteria={["1.2.1", "1.2.3", "1.2.6", "1.2.7"]}
      />

      <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <WCAGBreadcrumb items={[]} current="1.2.8 Media Alternative (Prerecorded)" />

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
              WCAG 1.2.8: Media Alternative (Prerecorded)
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              Captions serve people who cannot hear; audio description serves people who
              cannot see. For someone who is deafblind, neither works. This AAA criterion
              requires{" "}
              <strong className="text-slate-900 dark:text-white">
                a full descriptive transcript — dialogue, sounds, and visual information
                in sequence
              </strong>{" "}
              — so the entire video can be read as text, including on a braille display.
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
              An alternative for time-based media is provided for all prerecorded
              synchronized media and for all prerecorded video-only media.
            </blockquote>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4 text-sm">
              An &ldquo;alternative for time-based media&rdquo; is a WCAG-defined term: a
              document including correctly sequenced text descriptions of time-based
              visual and auditory information, which also provides a means of achieving
              the outcomes of any time-based interaction. Media that is a labelled
              alternative for text is exempt.
            </p>
          </section>

          {/* AAA context */}
          <section aria-labelledby="aaa-context" className="mb-12">
            <h2
              id="aaa-context"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              AAA context: completing Guideline 1.2
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              At Level A,{" "}
              <Link href="/wcag/1-2-3" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                1.2.3
              </Link>{" "}
              lets you provide <em>either</em> an audio description <em>or</em> a media
              alternative for prerecorded video. Level AA (1.2.5) makes audio description
              mandatory. 1.2.8 completes the picture at AAA by making the text
              alternative mandatory too — and by extending coverage to video-only media,
              such as silent screen recordings and animations.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              The result at AAA is belt and braces: a Deaf user has captions and sign
              language (
              <Link href="/wcag/1-2-6" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                1.2.6
              </Link>
              ), a blind user has audio description (1.2.5,{" "}
              <Link href="/wcag/1-2-7" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                1.2.7
              </Link>
              ), and a deafblind user — or anyone who simply prefers text — has the full
              descriptive transcript this criterion requires.
            </p>
          </section>

          {/* What the transcript must contain */}
          <section aria-labelledby="requirement" className="mb-12">
            <h2
              id="requirement"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              What the media alternative must contain
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              {[
                {
                  t: "All dialogue, attributed",
                  d: "Every spoken word, with speaker names or roles, in the order it occurs — exactly what a caption file contains, but as flowing readable text.",
                },
                {
                  t: "Meaningful sounds",
                  d: "Non-speech audio that carries information: alarms, applause, a phone ringing, music that sets a scene. The same content captions convey in brackets.",
                },
                {
                  t: "Important visual information",
                  d: "Actions, scene changes, on-screen text, charts, facial expressions, and anything else a sighted viewer relies on — the content audio description conveys.",
                },
                {
                  t: "Correct sequence and interactions",
                  d: "Descriptions interleaved with dialogue in story order. If the media is interactive (for example, branching video), the transcript must provide a way to achieve the same outcomes.",
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
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/20 p-5">
                <h3 className="font-semibold text-emerald-800 dark:text-emerald-300 mb-2">
                  ✓ Passes
                </h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed list-disc pl-4">
                  <li>A &ldquo;Descriptive transcript&rdquo; link under the video leading to structured HTML with scene descriptions and attributed dialogue.</li>
                  <li>A silent product animation accompanied by a text walkthrough of everything it shows.</li>
                  <li>A transcript on the same page, in a disclosure region directly below the player.</li>
                </ul>
              </div>
              <div className="rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-5">
                <h3 className="font-semibold text-rose-800 dark:text-rose-300 mb-2">
                  ✗ Fails
                </h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed list-disc pl-4">
                  <li>A dialogue-only transcript (a raw caption dump) with no description of the visuals.</li>
                  <li>A summary — &ldquo;this video demonstrates our dashboard&rdquo; — instead of an equivalent account.</li>
                  <li>A transcript that exists but is unlinked and unfindable from the video itself.</li>
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
              Markup patterns
            </h2>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              1. Video with an adjacent descriptive transcript
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Keep the transcript in the DOM near the player, behind a native disclosure
              so it does not overwhelm the page.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<figure>
  <video controls src="/media/release-tour.mp4">
    <track kind="captions" src="/media/release-tour.vtt"
           srclang="en" label="English" default />
  </video>
  <figcaption>Product release tour, 4 min 20 s.</figcaption>
</figure>

<details>
  <summary>Descriptive transcript</summary>
  <section aria-label="Descriptive transcript of the release tour">
    <h2>Descriptive transcript</h2>

    <p><em>[The presenter stands beside a large dashboard screen
    showing a line chart trending upward.]</em></p>

    <p><strong>Maya (presenter):</strong> This quarter we shipped
    three features our customers asked for most.</p>

    <p><em>[She clicks &ldquo;Reports&rdquo;. A panel slides in
    listing: Exports, Scheduling, Alerts.]</em></p>

    <p><strong>Maya:</strong> Let&rsquo;s start with exports…</p>
  </section>
</details>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              2. Video-only media (silent demo) with a text walkthrough
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              1.2.8 explicitly covers video with no audio track at all. A numbered
              walkthrough of the on-screen actions is the natural alternative.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<video controls muted src="/media/setup-silent.mp4"
       aria-describedby="setup-alt"></video>

<section id="setup-alt">
  <h2>What the video shows</h2>
  <ol>
    <li>The user opens Settings and selects the API tab.</li>
    <li>They select &ldquo;New key&rdquo;; a dialog shows the
        generated key with a Copy button.</li>
    <li>They paste the key into the CLI prompt; the terminal
        prints &ldquo;Authenticated&rdquo;.</li>
  </ol>
</section>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              3. Link to a transcript on its own page
            </h3>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<p class="media-alternatives">
  <a href="/media/release-tour-transcript">
    Read the descriptive transcript of this video
  </a>
</p>`}</code>
            </pre>
          </section>

          {/* Testing */}
          <section aria-labelledby="testing" className="mb-12">
            <h2
              id="testing"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              How to test for 1.2.8
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "Inventory prerecorded video",
                  d: "List all prerecorded synchronized media and all prerecorded video-only media. Exclude only media that is itself a labelled alternative for text.",
                },
                {
                  t: "Locate the alternative from the media",
                  d: "Starting at each video, confirm you can reach the transcript in one obvious step — on the page, in a disclosure, or via a clearly named adjacent link.",
                },
                {
                  t: "Read the transcript without playing the video",
                  d: "The acid test: does the text alone give you the full story? Note any moment where you would need to watch or listen to understand — each one is a gap.",
                },
                {
                  t: "Compare against the video for completeness and order",
                  d: "Play the video alongside the transcript. Check that all dialogue, meaningful sounds, and essential visuals appear, correctly attributed and in the same sequence.",
                },
                {
                  t: "Check interaction outcomes and readability",
                  d: "If the media involves interaction, the alternative must offer a way to achieve the same outcomes. Confirm the transcript is real, structured text — readable by screen readers and braille displays, not an image or inaccessible PDF.",
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
                "Publishing the caption file's text as the 'transcript' — dialogue only, with none of the visual information described.",
                "Summarizing instead of transcribing: a paragraph about the video is not an equivalent for the video.",
                "Omitting on-screen text, chart data, or demonstrated steps that a sighted viewer would rely on.",
                "Losing the sequence — grouping all description at the top and all dialogue below, so the story cannot be followed.",
                "Forgetting video-only media: silent screen recordings and animated walkthroughs need a media alternative too.",
                "Serving the transcript as a scanned or untagged PDF that a screen reader or braille display cannot read.",
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

          <CriterionLinks number="1.2.8" />
        </article>
      </div>
    </>
  )
}
