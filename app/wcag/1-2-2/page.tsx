import Link from "next/link"
import { createMetadata } from "@/lib/metadata"
import { BreadcrumbStructuredData } from "@/components/seo/structured-data"
import WCAGSEOEnhancements from "@/components/wcag/seo-enhancements"
import { CriterionLinks } from "@/components/wcag/criterion-links"
import CaptionsDemo from "./interactive-demo"

export const metadata = createMetadata({
  title: "WCAG 1.2.2 Captions (Prerecorded) - Complete Guide",
  path: "/wcag/1-2-2",
  description:
    "Complete guide to WCAG 1.2.2 Captions (Prerecorded). Interactive caption examples, testing methods, and implementation code for video accessibility.",
  keywords: ["WCAG 1.2.2", "captions", "prerecorded", "video accessibility", "subtitles", "deaf", "hard of hearing"],
  type: "article",
  image: "/api/og?title=WCAG%201.2.2%20Captions%20(Prerecorded)&section=WCAG",
})

const faqs = [
  {
    q: "What is the difference between captions and subtitles?",
    a: "Captions and subtitles look similar but serve different audiences. Captions are written for people who cannot hear the audio: they include all spoken dialogue plus speaker identification and meaningful non-speech sounds — [applause], [phone rings], [ominous music]. Subtitles assume the viewer can hear but may not understand the language, so they translate dialogue only and leave out sound effects and music cues. WCAG 1.2.2 requires captions, not merely subtitles: a translated-dialogue-only subtitle track does not satisfy the criterion because a deaf viewer would miss the non-speech audio that carries meaning.",
  },
  {
    q: "What is the difference between open and closed captions?",
    a: "Closed captions are delivered as a separate track (for example a WebVTT file referenced by a <track> element) that the viewer can turn on or off, restyle, or switch between languages. Open captions are burned permanently into the video pixels and are always visible. Both can satisfy WCAG 1.2.2 as long as the captions are accurate, synchronized, and complete. Closed captions are usually preferred because they are searchable, resizable, and optional; open captions guarantee display on every player but cannot be turned off or restyled and degrade if the video is compressed.",
  },
  {
    q: "Do auto-generated captions from YouTube or an AI tool meet 1.2.2?",
    a: "Not on their own. Automatic speech recognition still misspells names and technical terms, drops or mis-punctuates sentences, guesses at homophones, rarely identifies who is speaking, and almost never labels non-speech sounds like music or applause. WCAG requires captions that are accurate and equivalent to the audio, so uncorrected auto-captions — sometimes called 'craptions' — generally fail. Auto-captions are a reasonable starting draft, but a human must review and correct the transcript, add speaker labels and non-speech descriptions, and fix the timing before the track is published.",
  },
  {
    q: "What exactly must captions include to pass 1.2.2?",
    a: "Captions must convey all of the audio information a hearing viewer receives. That means every word of dialogue and narration; identification of who is speaking whenever it is not obvious (for example [Narrator]: or [Dr. Lee]:); and meaningful non-speech audio such as sound effects, laughter, and music that carries information or mood — written as descriptions like [door slams], [audience laughs], or [tense music builds]. Captions must also be synchronized so text appears as the corresponding audio plays. Purely incidental sounds that carry no meaning can be omitted.",
  },
  {
    q: "When does the media-alternative-for-text exception apply?",
    a: "1.2.2 has a single exception: captions are not required when the synchronized media is itself a media alternative for text and is clearly labeled as such. In other words, if the video merely presents information that already exists as readable text on the same page — the video is an optional visual rendering of that text — captions are not required because a deaf user already has full access through the text. This exception is narrow and rarely applies; it does not cover ordinary videos whose content is not already available in text elsewhere on the page.",
  },
  {
    q: "How is 1.2.2 different from 1.2.4 Captions (Live)?",
    a: "1.2.2 covers prerecorded synchronized media — video that was produced and stored ahead of time, giving you the opportunity to write and time accurate captions before publishing. It is a Level A requirement. 1.2.4 Captions (Live) covers real-time content such as live webinars and broadcasts, where captions must be produced on the fly, and it is a Level AA requirement. If your video is recorded and then uploaded, 1.2.2 applies; if it streams live as it happens, 1.2.4 applies.",
  },
]

export default function WCAG122Page() {
  return (
    <>
      <WCAGSEOEnhancements
        title="WCAG 1.2.2: Captions (Prerecorded)"
        description="Captions are provided for all prerecorded audio content in synchronized media, except when the media is a media alternative for text and is clearly labeled as such."
        criteria="1.2.2"
        level="A"
        principle="Perceivable"
        guideline="1.2 Time-based Media"
        url="https://accessibility.build/wcag/1-2-2"
        category="Time-based Media"
      />
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "WCAG Success Criteria", url: "https://accessibility.build/wcag" },
          { name: "1.2.2 Captions (Prerecorded)", url: "https://accessibility.build/wcag/1-2-2" },
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
                    1.2.2 Captions (Prerecorded)
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
                Principle 1: Perceivable
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                Captions make video usable without sound
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
              WCAG 1.2.2: Captions (Prerecorded)
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              A deaf viewer cannot hear your narrator, a commuter with the sound off
              cannot follow your product demo, and a search engine cannot index spoken
              words. This criterion asks that{" "}
              <strong className="text-slate-900 dark:text-white">
                every prerecorded video with audio carries synchronized captions
              </strong>{" "}
              that convey the dialogue, who is speaking, and the meaningful sounds — so
              the whole video works with the audio muted.
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
              Captions are provided for all prerecorded audio content in synchronized
              media, except when the media is a media alternative for text and is
              clearly labeled as such.
            </blockquote>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4 text-sm">
              &ldquo;Synchronized media&rdquo; means audio or video synchronized with
              another format (usually a soundtrack synchronized with moving pictures).
              The rule is short but exact: <em>all</em> prerecorded audio in that media
              needs captions, and the only way out is the narrow media-alternative
              exception — when the video simply re-presents text that is already fully
              available on the page and is clearly labeled that way.
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
              Captions were designed for deaf and hard-of-hearing viewers, but a text
              layer over spoken audio turns out to help far more people than that —
              anyone who cannot, or would rather not, rely on sound:
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  t: "Deaf and hard-of-hearing viewers",
                  d: "The primary audience. Without captions, all spoken dialogue, narration, and meaningful sound is simply inaccessible — the video is silent to them.",
                },
                {
                  t: "People in sound-off environments",
                  d: "Viewers in open offices, libraries, quiet trains, or late-night rooms — and the large share of social-media users who watch video muted by default — read the captions instead of playing audio.",
                },
                {
                  t: "Non-native speakers",
                  d: "Seeing the words written out alongside the audio makes fast or accented speech far easier to follow, and helps learners connect spoken and written language.",
                },
                {
                  t: "People with auditory processing or attention differences",
                  d: "Reading along with the audio reinforces comprehension and helps maintain focus for viewers with auditory processing disorders, ADHD, or similar conditions.",
                },
                {
                  t: "Viewers with lower literacy or in noisy audio",
                  d: "Captions reinforce unfamiliar vocabulary and rescue moments where the audio mix is muddy, an accent is unfamiliar, or a term is easily misheard.",
                },
                {
                  t: "Search engines and everyone",
                  d: "Caption text is indexed by search engines and makes video content searchable and quotable — good captions are also good SEO, benefiting every visitor.",
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
              1.2.2 applies to <strong>prerecorded synchronized media</strong> — any
              stored video whose soundtrack is synchronized with the moving picture:
              tutorials, webinars-on-demand, product demos, testimonials, marketing
              clips, and training videos. If it has meaningful audio and it was recorded
              before it was published, it needs captions. The important thing to
              understand is that captions are not the same as subtitles — they must
              carry <em>all</em> of the audio information, not just the words:
            </p>
            <ul className="space-y-3 mb-6">
              {[
                {
                  t: "All spoken dialogue and narration",
                  d: "Every word said by every speaker, transcribed accurately — not paraphrased or summarized.",
                },
                {
                  t: "Speaker identification",
                  d: "When it is not obvious who is talking, label the speaker: [Narrator]:, [Dr. Lee]:, or a name/colour convention. This keeps multi-person dialogue followable.",
                },
                {
                  t: "Meaningful non-speech audio",
                  d: "Sound effects and music that carry information or mood, written as descriptions: [applause], [door slams], [phone rings], [tense music builds]. Incidental sounds with no meaning can be left out.",
                },
                {
                  t: "Synchronized timing",
                  d: "Captions must appear as the corresponding audio plays, roughly in step with the speech, so text and picture stay together.",
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
              Open vs. closed captions
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              <strong>Closed captions</strong> live in a separate track (such as a
              WebVTT file loaded through a <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">&lt;track&gt;</code>{" "}
              element) that viewers can toggle on or off, restyle, and switch between
              languages. <strong>Open captions</strong> are burned permanently into the
              video image and are always on. Either can satisfy 1.2.2, but closed
              captions are usually the better choice: they are searchable, resizable,
              optional, and can carry multiple languages, whereas open captions cannot be
              turned off and degrade when the video is recompressed.
            </p>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Why auto-generated captions usually fail
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Automatic speech recognition is a useful first draft, not a finished
              caption track. It misspells names and jargon, guesses wrong on homophones,
              drops punctuation, rarely marks who is speaking, and almost never describes
              non-speech sounds. Because WCAG requires captions that accurately and
              completely represent the audio, uncorrected auto-captions generally do not
              conform. Always have a human review the transcript, fix errors, add speaker
              labels and non-speech descriptions, and correct the timing before
              publishing.
            </p>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              The one exception
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Captions are not required when the media is a{" "}
              <em>media alternative for text</em> and is clearly labeled as such — that
              is, when the video only re-presents information already available as
              readable text on the same page. This exception is narrow and rarely
              applies. Note that 1.2.2 is only the caption requirement; the same video
              may also need audio description or a full text alternative under the other{" "}
              <Link href="/wcag/1-2-1" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                1.2.x Time-based Media criteria
              </Link>
              , and live video is covered separately by 1.2.4.
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
                  ✓ Passes 1.2.2
                </h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <li>
                    A tutorial video with a synchronized caption track that transcribes
                    all dialogue and labels the speaker.
                  </li>
                  <li>
                    Captions that describe meaningful non-speech audio, e.g.
                    &ldquo;[upbeat music starts]&rdquo; and &ldquo;[applause]&rdquo;.
                  </li>
                  <li>
                    Open captions burned into a promo clip so the words are always
                    visible.
                  </li>
                  <li>
                    Human-reviewed captions corrected from an auto-generated draft, with
                    names and terms fixed.
                  </li>
                  <li>
                    A short video with no captions that only re-presents text printed in
                    full on the same page, clearly labeled as an alternative.
                  </li>
                </ul>
              </div>
              <div className="rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-5">
                <h3 className="font-semibold text-rose-800 dark:text-rose-300 mb-3">
                  ✗ Fails 1.2.2
                </h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <li>
                    A product demo with a soundtrack and no caption track at all.
                  </li>
                  <li>
                    Raw YouTube auto-captions full of misheard words, no speaker labels,
                    and no sound descriptions.
                  </li>
                  <li>
                    Subtitles that translate the dialogue but omit music and sound
                    effects that carry meaning.
                  </li>
                  <li>
                    Captions so far out of sync that they lag several seconds behind the
                    speech.
                  </li>
                  <li>
                    Captions that summarize or skip dialogue instead of transcribing what
                    is actually said.
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
              A video with no captions vs. one with a caption track
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              The fix is usually a single{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">&lt;track&gt;</code>{" "}
              element pointing at a caption file. Use{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">kind=&quot;captions&quot;</code>{" "}
              (captions for the deaf), not{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">kind=&quot;subtitles&quot;</code>.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- ✗ Prerecorded video with audio and no captions -->
<video src="workshop.mp4" controls></video>

<!-- ✓ Same video with a synchronized caption track -->
<video src="workshop.mp4" controls>
  <track
    kind="captions"
    srclang="en"
    label="English"
    src="workshop.en.vtt"
    default>
</video>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              What the WebVTT caption file looks like
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              A WebVTT file pairs each cue with a start and end time. Notice the speaker
              label and the bracketed non-speech sounds — these are what make it a{" "}
              <em>caption</em> track rather than a subtitle track.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`WEBVTT

00:00:00.000 --> 00:00:03.000
Welcome to our accessibility workshop.

00:00:03.000 --> 00:00:06.000
[Dr. Lee]: Today we'll learn about video captions.

00:00:06.000 --> 00:00:09.000
[upbeat music starts]
Captions help deaf and hard-of-hearing viewers.

00:00:12.000 --> 00:00:15.000
[applause] Let's see how to implement them.`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Multiple caption languages
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              You can offer several caption tracks; mark one{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">default</code>{" "}
              and let the player expose the rest through its captions menu.
            </p>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<video src="workshop.mp4" controls>
  <track kind="captions" srclang="en" label="English"
         src="workshop.en.vtt" default>
  <track kind="captions" srclang="es" label="Español"
         src="workshop.es.vtt">
  <track kind="captions" srclang="fr" label="Français"
         src="workshop.fr.vtt">
</video>`}</code>
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
              Play the simulated video and toggle its captions to feel the difference
              between having and lacking them, then practice writing your own caption
              track and watch the live feedback on timing, speaker labels, and non-speech
              sounds.
            </p>
            <CaptionsDemo />
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
                "Publishing a prerecorded video with audio and no caption track at all — the most common failure.",
                "Leaving raw auto-generated captions uncorrected, so names, jargon, and homophones are wrong.",
                "Providing subtitles (dialogue only) and treating them as captions, omitting music and sound effects.",
                "Omitting speaker identification, so viewers cannot tell who is talking in a multi-person video.",
                "Dropping meaningful non-speech audio — [applause], [alarm], [ominous music] — that carries information or mood.",
                "Captions that drift out of sync and lag behind the spoken audio.",
                "Summarizing or paraphrasing dialogue instead of transcribing what is actually said.",
                "Relying on a text transcript elsewhere as a substitute — a transcript is not synchronized captions.",
                "Using the media-alternative exception for a video whose content is not already fully available as text on the page.",
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
              How to test for 1.2.2
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "Inventory every prerecorded video",
                  d: "Find all stored videos with meaningful audio — <video> elements, embedded YouTube/Vimeo players, background clips with narration. Exclude live streams (those fall under 1.2.4) and silent or purely decorative video.",
                },
                {
                  t: "Confirm a caption track exists and is on",
                  d: "For each video, check that captions can be enabled (a CC control, a <track kind=\"captions\"> element, or burned-in open captions) and that the track actually loads and displays.",
                },
                {
                  t: "Watch with the sound completely off",
                  d: "Mute the audio and watch the whole video using captions only. Ask whether you understood everything a hearing viewer would — this is the core test of 1.2.2.",
                },
                {
                  t: "Check completeness, not just presence",
                  d: "Verify captions include all dialogue, identify speakers where needed, and describe meaningful non-speech audio like music and sound effects. A track that exists but omits these still fails.",
                },
                {
                  t: "Check accuracy and synchronization",
                  d: "Read along with the audio: names, technical terms, and punctuation should be correct, and captions should appear roughly in step with the speech rather than lagging behind.",
                },
                {
                  t: "Verify the caption controls are accessible",
                  d: "Make sure the caption toggle can be reached and operated by keyboard and is announced by a screen reader, so users can turn captions on without a mouse.",
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
          <CriterionLinks number="1.2.2" />

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
