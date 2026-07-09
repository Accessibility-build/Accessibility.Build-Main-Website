import Link from "next/link"
import { createMetadata } from "@/lib/metadata"
import { BreadcrumbStructuredData } from "@/components/seo/structured-data"
import WCAGSEOEnhancements from "@/components/wcag/seo-enhancements"
import { CriterionLinks } from "@/components/wcag/criterion-links"
import MediaAltDemo from "./interactive-demo"

export const metadata = createMetadata({
  title: "WCAG 1.2.3 Audio Description or Media Alternative",
  path: "/wcag/1-2-3",
  description:
    "Complete guide to WCAG 1.2.3 Audio Description or Media Alternative. Interactive examples of audio descriptions, testing methods, and implementation code.",
  keywords: ["WCAG 1.2.3", "audio description", "media alternative", "video accessibility", "visual content", "blind users"],
  type: "article",
  image: "/api/og?title=WCAG%201.2.3%20Audio%20Description%20or%20Media%20Alternative%20(Prerecorded)&section=WCAG",
})

const faqs = [
  {
    q: "What is an audio description in WCAG 1.2.3?",
    a: "An audio description is a separate narration track that describes the important visual information in a video — actions, characters, scene changes, on-screen text, and other things that carry meaning but are not spoken in the dialogue. The narration is inserted into the natural pauses between dialogue and sound effects so a person who cannot see the screen still follows what is happening. For prerecorded synchronized media (video with audio), 1.2.3 asks that this visual information be conveyed either through an audio description or through a full text media alternative. It is a Level A criterion under Guideline 1.2 Time-based Media.",
  },
  {
    q: "When can I provide a full text media alternative instead of audio description?",
    a: "1.2.3 gives you a choice: you can satisfy it with an audio description of the video, OR with a complete text alternative for the time-based media. A media alternative is a standalone document that describes everything a viewer would see and hear — all dialogue and narration plus all meaningful visual content, in the correct order. Providing this instead of an audio track is perfectly valid at Level A. Note, however, that Level AA's 1.2.5 Audio Description (Prerecorded) removes this option and requires an actual audio description, so if you are targeting AA the text-alternative route no longer satisfies you on its own.",
  },
  {
    q: "What is the difference between 1.2.3 (Level A) and 1.2.5 (Level AA)?",
    a: "Both are about audio description for prerecorded video, but they differ in strictness. 1.2.3 (Level A) lets you meet the requirement with either an audio description or a full text media alternative — you pick. 1.2.5 Audio Description (Prerecorded) (Level AA) is narrower: it requires an actual audio description track and does not accept a text-only alternative as a substitute. In practice, if you provide a proper audio description you satisfy both. If you only provide a text media alternative, you meet 1.2.3 but not 1.2.5.",
  },
  {
    q: "What if there are no natural pauses in the dialogue for descriptions?",
    a: "Standard audio description relies on the gaps between dialogue. When a video is so dense that there is no room to insert descriptions without talking over important audio, standard description cannot fit. The answer at Level A is to provide a full text media alternative instead, which is always allowed under 1.2.3. Separately, WCAG offers 1.2.7 Extended Audio Description (Prerecorded) (Level AAA), where the video is paused to make time for longer descriptions — but that is an AAA enhancement, not a requirement of 1.2.3.",
  },
  {
    q: "What is the 'media alternative for text' exception?",
    a: "1.2.3 does not apply when the media itself is an alternative to existing text and is clearly labeled as such. For example, if you have an article and you also publish a video that simply presents the same information for people who prefer to watch, that video is a media alternative for text. Because the equivalent information is already fully available in the text, you do not also need to audio-describe the video — provided it is clearly labeled as an alternative to that text.",
  },
  {
    q: "Do audio descriptions need to cover every visual detail?",
    a: "No. The goal is to convey the information that matters, not to narrate the screen exhaustively. Describe the visual content that is important for understanding — key actions, who is present, scene and setting changes, meaningful gestures and expressions, and any on-screen text or graphics that carry information. Skip decorative or redundant details, and never describe something the dialogue already makes clear. Descriptions should be objective and concise so they fit in the available pauses without competing with the original soundtrack.",
  },
]

export default function WCAG123Page() {
  return (
    <>
      <WCAGSEOEnhancements
        title="WCAG 1.2.3: Audio Description or Media Alternative (Prerecorded)"
        description="An alternative for time-based media or audio description of the prerecorded video content is provided for synchronized media."
        criteria="1.2.3"
        level="A"
        principle="Perceivable"
        guideline="1.2 Time-based Media"
        url="https://accessibility.build/wcag/1-2-3"
        category="Time-based Media"
      />
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "WCAG Success Criteria", url: "https://accessibility.build/wcag" },
          { name: "1.2.3 Audio Description or Media Alternative (Prerecorded)", url: "https://accessibility.build/wcag/1-2-3" },
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
                    1.2.3 Audio Description or Media Alternative (Prerecorded)
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
                Describe what only the eyes can see
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
              WCAG 1.2.3: Audio Description or Media Alternative (Prerecorded)
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              A video&rsquo;s soundtrack rarely tells the whole story. Actions, gestures,
              scene changes, and on-screen text all carry meaning that a blind viewer
              never receives. This criterion asks that,{" "}
              <strong className="text-slate-900 dark:text-white">
                for prerecorded video with audio, the important visual information is
                conveyed either through an audio description or through a full text
                alternative
              </strong>
              . Get it right and the story that plays out on screen becomes available to
              people who can only listen or read.
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
              An alternative for time-based media or audio description of the prerecorded
              video content is provided for synchronized media, except when the media is
              a media alternative for text and is clearly labeled as such.
            </blockquote>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4 text-sm">
              &ldquo;Synchronized media&rdquo; means video with a soundtrack — the audio
              and moving pictures play together. The criterion covers only the{" "}
              <em>visual</em> information (captions handle the audio for deaf users under
              1.2.2). You may satisfy it two ways: describe the visuals in an audio track,
              or provide a complete text alternative for the whole video. The one carve-out
              is when the video merely re-presents information already available in text
              and says so clearly.
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
              The primary audience is people who cannot see the screen, but describing
              visual content clearly benefits far more people than that:
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  t: "Blind users",
                  d: "The core audience. Without description, everything that is shown but not spoken — actions, settings, gestures, on-screen text — is simply missing from the experience.",
                },
                {
                  t: "Low vision users",
                  d: "People using magnification or high contrast may not make out facial expressions, small on-screen text, or fine detail; a description fills those gaps.",
                },
                {
                  t: "People who look away or multitask",
                  d: "Anyone watching while cooking, driving, or working can keep up through the audio alone when the visuals are described.",
                },
                {
                  t: "People with cognitive and learning disabilities",
                  d: "Explicit, spoken descriptions of what is happening reduce the effort of interpreting busy or fast-moving visuals and reinforce understanding.",
                },
                {
                  t: "Learners and second-language users",
                  d: "A clear verbal account of the visual content, or a readable text alternative, supports comprehension and lets people study at their own pace.",
                },
                {
                  t: "Users on limited bandwidth",
                  d: "When streaming is difficult, a text media alternative offers a lightweight way to get the full content without loading the video at all.",
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
              1.2.3 applies to <strong>prerecorded synchronized media</strong> — video
              that has a soundtrack. It is concerned only with the information carried by
              the picture, because the audio track is already handled by captions under{" "}
              <Link href="/wcag/1-2-2" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                1.2.2 Captions
              </Link>
              . You can meet it in one of two ways:
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  (a) Audio description
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  A narration track that describes the important visual information during
                  the natural pauses in dialogue and sound. It rides alongside the
                  original audio and can typically be switched on or off. This is the
                  route required at Level AA by 1.2.5.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  (b) Full text media alternative
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  A standalone document that describes both the visual <em>and</em> the
                  auditory content of the video in the correct order — all dialogue and
                  narration plus every meaningful action, scene, and on-screen text. A
                  reader gets the complete experience without watching.
                </p>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              What counts as important visual information
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              The test for what to describe is whether the information is needed to
              understand the content and is not already conveyed by the existing audio.
              In practice that means:
            </p>
            <ul className="space-y-3 mb-6">
              {[
                {
                  t: "Actions and events",
                  d: "What people and objects do on screen — someone signs a document, a chart animates, a product is assembled.",
                },
                {
                  t: "Characters and who is present",
                  d: "Who appears, how they look when it matters, and meaningful expressions or gestures that are not spoken aloud.",
                },
                {
                  t: "Scene and setting changes",
                  d: "Where the action takes place and when it moves — a cut to a new location, a jump in time, a change of context.",
                },
                {
                  t: "On-screen text and graphics",
                  d: "Titles, captions burned into the picture, slides, diagrams, and any text or data shown visually but never read out.",
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
              If the video exists only as an alternative to text that is already on the
              page — and it is clearly labeled as such — 1.2.3 does not apply, because the
              equivalent information is already fully available in that text. Everywhere
              else, if there are no natural pauses long enough for description, provide the
              full text media alternative; pausing the video for longer descriptions is
              the AAA-level{" "}
              <Link href="/wcag/1-2-7" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                1.2.7 Extended Audio Description
              </Link>
              , not a requirement here.
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
                  ✓ Passes 1.2.3
                </h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <li>
                    A tutorial video offering a selectable audio description track that
                    narrates on-screen steps during the pauses.
                  </li>
                  <li>
                    A product demo linked to a full text alternative describing every
                    action, scene, and spoken line.
                  </li>
                  <li>
                    A drama with descriptions of who enters a room and what they do,
                    inserted between lines of dialogue.
                  </li>
                  <li>
                    A video that simply re-presents an article, clearly labeled as an
                    alternative to that text (exception applies).
                  </li>
                </ul>
              </div>
              <div className="rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-5">
                <h3 className="font-semibold text-rose-800 dark:text-rose-300 mb-3">
                  ✗ Fails 1.2.3
                </h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <li>
                    A video where key actions happen silently on screen, with no
                    description and no text alternative.
                  </li>
                  <li>
                    On-screen text or data (prices, results, code) that is never spoken
                    and never described.
                  </li>
                  <li>
                    Captions provided but no audio description — captions serve deaf
                    users, not blind users.
                  </li>
                  <li>
                    A transcript that lists only the dialogue and omits all the visual
                    content of the video.
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
              Dialogue only, nothing described (fail)
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              A plain video with no description track and no linked alternative leaves all
              of its visual meaning inaccessible.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- ✗ Visual content is never described or offered as text -->
<video controls width="600">
  <source src="tutorial.mp4" type="video/mp4">
  <track kind="captions" src="captions.vtt" srclang="en" label="English">
</video>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              An audio-described track (pass)
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Add a <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">&lt;track kind=&quot;descriptions&quot;&gt;</code>{" "}
              pointing at a WebVTT file whose cues describe the visuals in the pauses. (Player
              support varies, so many teams also offer a separately described video source.)
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- ✓ Description track added alongside captions -->
<video controls width="600">
  <source src="tutorial.mp4" type="video/mp4">
  <track kind="captions"     src="captions.vtt"     srclang="en" label="English">
  <track kind="descriptions" src="descriptions.vtt" srclang="en" label="Descriptions" default>
</video>

<!-- descriptions.vtt -->
WEBVTT

00:00:00.000 --> 00:00:04.000
A woman in a blue suit stands at a whiteboard of accessibility diagrams.

00:00:08.000 --> 00:00:12.000
Close-up of her hands typing; the screen shows code with ARIA labels.`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              A linked full text alternative (pass)
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Alternatively, link a complete text document that covers both what is seen
              and what is heard — a valid way to meet 1.2.3 at Level A.
            </p>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- ✓ Full media alternative describing visuals + audio -->
<video controls width="600">
  <source src="tutorial.mp4" type="video/mp4">
  <track kind="captions" src="captions.vtt" srclang="en" label="English">
</video>

<a href="/tutorial-transcript">
  Full text alternative: everything shown and said in this video
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
              Play the mock video and toggle the audio description off to feel what a
              blind viewer loses. Then open the full text media alternative to see the
              other way of satisfying 1.2.3.
            </p>
            <MediaAltDemo />
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
                "Publishing prerecorded video with meaningful visual content but neither an audio description nor a text alternative.",
                "Assuming captions are enough — captions convey the audio for deaf users but give blind users nothing about the visuals.",
                "Providing a 'transcript' that contains only the spoken dialogue and omits all the on-screen action and text.",
                "On-screen text, prices, results, or code shown visually but never spoken and never described.",
                "Relying on a description track the video player does not actually surface to users, with no fallback offered.",
                "Descriptions that talk over important dialogue or sound instead of sitting in the natural pauses.",
                "A media-alternative video used to justify skipping description, but never clearly labeled as an alternative to the text.",
                "Subjective or interpretive narration ('a beautiful, moving moment') instead of an objective account of what happens.",
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
              How to test for 1.2.3
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "Watch with the screen turned off",
                  d: "Listen to the video without looking. Note every moment where something important happens visually but is not conveyed by the soundtrack — an action, a change of scene, on-screen text. Each of those is content a blind user would miss unless it is described or provided in text.",
                },
                {
                  t: "Confirm one of the two mechanisms exists",
                  d: "Check that the video either offers an audio description (a selectable descriptions track or a described version) or links a full text media alternative. If neither is present and there is meaningful visual content, it fails.",
                },
                {
                  t: "Check the audio description covers the gaps",
                  d: "If a description track is provided, verify it actually describes the important visuals, sits in the natural pauses without covering key dialogue, and can be switched on. A track that exists but says too little still fails.",
                },
                {
                  t: "Check the text alternative is complete",
                  d: "If a media alternative is provided instead, read it on its own and confirm it conveys both the visual and the auditory content in order — not just a dialogue transcript. A reader should get the whole experience.",
                },
                {
                  t: "Apply the media-alternative-for-text exception carefully",
                  d: "If you are relying on the exception, confirm the video really does duplicate on-page text and is clearly labeled as an alternative to it. If the video adds anything the text does not cover, the exception does not apply.",
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
              Automated tools can flag a video that has no description track, but only a
              human can judge whether the visuals are actually covered. For a structured
              audit, work through the full{" "}
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
          <CriterionLinks number="1.2.3" />

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
