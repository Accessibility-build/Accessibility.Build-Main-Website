import Link from "next/link"
import { createMetadata } from "@/lib/metadata"
import { BreadcrumbStructuredData } from "@/components/seo/structured-data"
import WCAGSEOEnhancements from "@/components/wcag/seo-enhancements"
import { CriterionLinks } from "@/components/wcag/criterion-links"
import AudioAltDemo from "./interactive-demo"

export const metadata = createMetadata({
  title: "WCAG 1.2.1 Audio-only and Video-only (Prerecorded)",
  path: "/wcag/1-2-1",
  description:
    "Complete guide to WCAG 1.2.1 Audio-only and Video-only (Prerecorded). Live examples, transcript demos, testing methods, and implementation code.",
  keywords: ["WCAG 1.2.1", "audio-only", "video-only", "prerecorded", "transcripts", "audio description", "screen reader"],
  type: "article",
  image: "/api/og?title=WCAG%201.2.1%20Audio-only%20and%20Video-only%20(Prerecorded)&section=WCAG",
})

const faqs = [
  {
    q: "What does WCAG 1.2.1 require?",
    a: "For prerecorded audio-only content, you must provide an alternative for time-based media — in practice, a text transcript — that presents equivalent information. For prerecorded video-only content (silent video), you must provide either a text alternative or an audio track that presents the equivalent information. There is one exception: if the audio or video is itself a media alternative for text and is clearly labeled as such, the criterion does not apply, because the text it presents is already available. It is a Level A criterion under Guideline 1.2 Time-based Media.",
  },
  {
    q: "What is the difference between audio-only and video-only content?",
    a: "Audio-only content is prerecorded media that has sound but no meaningful video — podcasts, interviews, recorded lectures, audiobooks, and audio announcements. Video-only content is prerecorded media that has moving pictures but no meaningful audio — silent animations, time-lapse footage, screen recordings without narration, and visual demonstrations. They need different alternatives: audio-only needs a transcript so deaf and hard-of-hearing users can read it, while video-only needs either a text description or an audio track so blind users can hear or read what is happening on screen.",
  },
  {
    q: "What must a transcript for audio-only content contain?",
    a: "A conforming transcript reproduces all spoken words verbatim and identifies who is speaking (for example [Host], [Guest]). It also describes non-speech sounds that carry meaning — [applause], [phone rings], [background music fades in] — because those sounds are part of the content for people who can hear them. Longer recordings benefit from timestamps and clear structure with headings and paragraphs. The test is equivalence: someone reading only the transcript should come away with the same information as someone listening to the audio.",
  },
  {
    q: "Does video-only content need a transcript or an audio track?",
    a: "Either one satisfies 1.2.1. You can provide a text description (sometimes called a text alternative for time-based media) that narrates every visual element and action in sequence, or you can add an audio track that describes what is happening as the video plays. A text description tends to be cheaper and also helps deaf-blind users reading braille, while an audio description track keeps the experience in the same medium. What matters is that the alternative conveys the same information a sighted viewer would get, not a vague summary like 'video shows a process happening over time.'",
  },
  {
    q: "How is 1.2.1 different from captions (1.2.2) and audio description (1.2.5)?",
    a: "1.2.1 covers media that is only audio or only video. Once a video has both a soundtrack and moving pictures (synchronized media), the relevant criteria are 1.2.2 Captions for the dialogue, 1.2.3 or 1.2.5 Audio Description for the visuals, and 1.2.4 for live captions. A transcript satisfies 1.2.1 for an audio-only file, but a transcript alone does not satisfy captions requirements for a normal video, because captions must be synchronized with the video timeline. Classify the media first, then apply the matching criterion.",
  },
  {
    q: "When does the 'media alternative for text' exception apply?",
    a: "The exception applies when the audio or video exists specifically to present information that is already available in text on the page, and it is clearly labeled as an alternative to that text. For example, an audio recording of an article that sits next to the full written article, labeled as the spoken version, does not need its own separate transcript — the article already is the text alternative. The label matters: users must be able to tell that the media is a media alternative for the text so they know the equivalent content is close by.",
  },
]

export default function WCAG121Page() {
  return (
    <>
      <WCAGSEOEnhancements
        title="WCAG 1.2.1: Audio-only and Video-only (Prerecorded)"
        description="An alternative for time-based media or an audio track is provided for prerecorded audio-only and prerecorded video-only content."
        criteria="1.2.1"
        level="A"
        principle="Perceivable"
        guideline="1.2 Time-based Media"
        url="https://accessibility.build/wcag/1-2-1"
        category="Time-based Media"
      />
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "WCAG Success Criteria", url: "https://accessibility.build/wcag" },
          { name: "1.2.1 Audio-only and Video-only (Prerecorded)", url: "https://accessibility.build/wcag/1-2-1" },
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
                    1.2.1 Audio-only and Video-only (Prerecorded)
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
                Transcripts unlock audio &amp; silent video
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
              WCAG 1.2.1: Audio-only and Video-only (Prerecorded)
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              A deaf user cannot hear a podcast, and a blind user cannot see a silent
              animation. This criterion asks that prerecorded media which is{" "}
              <strong className="text-slate-900 dark:text-white">
                only audio or only video has a text alternative — or, for silent video,
                an audio track — that presents the equivalent information
              </strong>
              . Get this one right and podcasts, recorded talks, silent demos, and
              time-lapses reach the people who cannot use one of their two channels.
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
              For prerecorded audio-only and prerecorded video-only media, the following
              are true, except when the audio or video is a media alternative for text
              and is clearly labeled as such: <strong>Prerecorded Audio-only:</strong> An
              alternative for time-based media is provided that presents equivalent
              information for prerecorded audio-only content.{" "}
              <strong>Prerecorded Video-only:</strong> Either an alternative for
              time-based media or an audio track is provided that presents equivalent
              information for prerecorded video-only content.
            </blockquote>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4 text-sm">
              In plain terms: audio-only needs a transcript; video-only needs a text
              description or an audio track. The single exception is media that merely
              re-presents text already on the page and is clearly labeled as such — that
              text is already the alternative.
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
              A text alternative turns a single-channel recording into content everyone
              can reach — it can be read, searched, translated, and read aloud by
              assistive technology:
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  t: "Deaf and hard-of-hearing users",
                  d: "Cannot hear audio-only content at all. A transcript is the only way they can access a podcast, interview, or recorded announcement.",
                },
                {
                  t: "Blind and low-vision users",
                  d: "Cannot see video-only content. A text description or audio track is what conveys the visual information in a silent animation or demo.",
                },
                {
                  t: "People with cognitive and learning disabilities",
                  d: "May process written text more easily than fast speech or motion, and can use text-to-speech and reading tools on a transcript.",
                },
                {
                  t: "Users in sound-sensitive environments",
                  d: "In a library, an office, or on public transport without headphones, a transcript lets people read content they cannot play out loud.",
                },
                {
                  t: "Users on limited bandwidth",
                  d: "When someone disables audio or video to save data, the text alternative keeps the information available in a lightweight form.",
                },
                {
                  t: "Non-native language speakers",
                  d: "Often understand written text better than spoken audio, and can run a transcript through translation tools at their own pace.",
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
              1.2.1 applies only to <em>prerecorded</em> media that carries information in
              a single channel — sound but no meaningful picture, or picture but no
              meaningful sound. The first practical step is to classify each media file,
              because audio-only and video-only need different alternatives:
            </p>
            <ul className="space-y-3 mb-6">
              {[
                {
                  t: "Audio-only content",
                  d: "Podcasts, interviews, recorded lectures, audiobooks, and audio announcements. Provide a complete transcript with speaker labels and descriptions of important sounds.",
                },
                {
                  t: "Video-only content",
                  d: "Silent animations, time-lapse footage, screen recordings without narration, and visual demonstrations. Provide a text description of everything shown, or an audio track that narrates it.",
                },
                {
                  t: "What a transcript must contain",
                  d: "All spoken words verbatim, speaker identification, and meaningful non-speech sounds ([applause], [music fades in]). It must be findable, keyboard accessible, and equivalent to the audio.",
                },
                {
                  t: "What a video description must contain",
                  d: "Every visual element and action that conveys information, in logical sequence, specific enough that a blind user can follow the process — not a vague one-line summary.",
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
              The exception, briefly
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              The one carve-out is media that is itself a{" "}
              <em>media alternative for text</em> and is clearly labeled as such. If an
              audio recording simply reads an article that already appears in full on the
              page, the article is the text alternative and the recording needs nothing
              extra. Note that 1.2.1 stops at media that is only audio or only video —
              once a clip has both a soundtrack and moving pictures, you move on to the{" "}
              <Link href="/wcag" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                captions and audio-description criteria
              </Link>{" "}
              under the other 1.2.x guidelines.
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
                  ✓ Passes 1.2.1
                </h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <li>
                    A podcast with a full transcript that identifies each speaker and
                    notes the background music.
                  </li>
                  <li>
                    A recorded lecture accompanied by a complete, structured text
                    transcript on the same page.
                  </li>
                  <li>
                    A silent keyboard-navigation animation with a step-by-step text
                    description of every action shown.
                  </li>
                  <li>
                    A time-lapse video paired with an audio track that narrates what is
                    happening on screen.
                  </li>
                  <li>
                    An audio version of an article, clearly labeled as such, sitting
                    beside the full written article.
                  </li>
                </ul>
              </div>
              <div className="rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-5">
                <h3 className="font-semibold text-rose-800 dark:text-rose-300 mb-3">
                  ✗ Fails 1.2.1
                </h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <li>
                    An audio-only company announcement published with no transcript at
                    all.
                  </li>
                  <li>
                    A podcast whose &ldquo;transcript&rdquo; omits speaker labels or the
                    meaningful sounds in the recording.
                  </li>
                  <li>
                    A silent installation video described only as &ldquo;video shows the
                    installation process.&rdquo;
                  </li>
                  <li>
                    A visual demonstration whose text alternative is too vague to let a
                    blind user follow the steps.
                  </li>
                  <li>
                    An audio recording of text that is <em>not</em> clearly labeled as an
                    alternative and has no transcript.
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
              Audio-only: missing vs. linked transcript
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              An <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">&lt;audio&gt;</code>{" "}
              element on its own carries nothing for a deaf user. Pair it with a
              transcript that is visible or clearly linked on the page.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- ✗ Audio-only content with no alternative -->
<audio controls src="episode-5.mp3"></audio>

<!-- ✓ Audio with a visible, structured transcript -->
<audio controls src="episode-5.mp3"></audio>
<section aria-label="Transcript of Episode 5">
  <h2>Transcript</h2>
  <p><strong>[Host]:</strong> Welcome to Web Accessibility Today.
     I'm Sarah Johnson.</p>
  <p><strong>[Guest]:</strong> And I'm Mike Chen from the
     A11y Initiative.</p>
  <p><em>[Background music fades in for 3 seconds]</em></p>
  <p><strong>[Host]:</strong> Today we're discussing WCAG…</p>
</section>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Video-only: text description or audio track
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Silent video needs either a text alternative describing the visuals or an
              audio track that narrates them. A vague caption is not enough.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- ✗ Silent video with a vague, non-equivalent blurb -->
<video src="keyboard-demo.mp4" muted controls></video>
<p>Video shows keyboard navigation.</p>

<!-- ✓ Silent video with a full text description nearby -->
<video src="keyboard-demo.mp4" muted controls
       aria-describedby="kbd-desc"></video>
<section id="kbd-desc">
  <h2>Description: keyboard navigation demo</h2>
  <ol>
    <li>User presses Tab; focus moves to the search button,
        highlighted with a blue outline.</li>
    <li>Tab again moves focus to the navigation menu.</li>
    <li>Arrow keys step through Home, About, Services, Contact.</li>
    <li>Enter on "Services" opens a submenu.</li>
  </ol>
</section>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Video-only: an audio description track
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              As an alternative to text, you can supply a narrated audio track for the
              silent video so the visuals are described as it plays.
            </p>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- ✓ Silent video with a descriptive audio track -->
<video controls>
  <source src="timelapse.mp4" type="video/mp4">
  <track kind="descriptions" src="timelapse-desc.vtt"
         srclang="en" label="Audio description">
</video>

<!-- Or offer a separately narrated version of the clip -->
<a href="timelapse-described.mp4">
  Watch the audio-described version
</a>`}</code>
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
              Toggle transcripts on and off to feel the difference between accessible and
              inaccessible media, then practice writing a transcript and watch the live
              feedback catch missing speaker labels and sound descriptions.
            </p>
            <AudioAltDemo />
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
                "Publishing audio-only content — a podcast, interview, or announcement — with no transcript anywhere on the page.",
                "Providing a transcript that omits speaker identification, so readers cannot tell who is talking.",
                "Leaving out meaningful non-speech sounds (music, applause, a phone ringing) that hearing users perceive.",
                "Describing a silent video with a vague one-liner like 'video shows a process happening over time.'",
                "A video description that skips visual details a blind user needs to follow a demonstration or installation.",
                "Auto-generated captions or machine transcripts full of errors, treated as an equivalent alternative without review.",
                "Hiding the transcript behind a broken, keyboard-inaccessible, or hard-to-find control.",
                "Assuming a plain audio recording of an article counts, without clearly labeling it as a media alternative for the text.",
                "Leaving transcripts stale after the underlying audio or video has been edited or replaced.",
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
              How to test for 1.2.1
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "Inventory the prerecorded media",
                  d: "Find every <audio> element, embedded player, podcast, silent <video>, animation, and time-lapse. Automation rarely catches missing transcripts, so this is a manual sweep. Remember it applies to prerecorded content only.",
                },
                {
                  t: "Classify each file",
                  d: "Decide whether each item is audio-only or video-only, and whether it is informational or decorative. This tells you whether it needs a transcript, a text description, or an audio track.",
                },
                {
                  t: "Confirm an alternative exists and is findable",
                  d: "For each item, check that a transcript or description is present, close to the media, keyboard accessible, and clearly associated with it — not buried on another page.",
                },
                {
                  t: "Verify the alternative is equivalent",
                  d: "Read the transcript or description without the media. Does it include all spoken words, speaker labels, and meaningful sounds — or, for video, every visual action a sighted viewer would follow? Vague summaries fail.",
                },
                {
                  t: "Test with assistive technology",
                  d: "Navigate the transcript or description with a screen reader (NVDA, JAWS, VoiceOver). Confirm it reads in a logical order and that any audio-description track is announced and playable.",
                },
                {
                  t: "Check the labeled-alternative exception",
                  d: "If a recording re-presents on-page text, confirm the full text really is present and that the media is clearly labeled as an alternative to it. If either is missing, it fails.",
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
          <CriterionLinks number="1.2.1" />

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
