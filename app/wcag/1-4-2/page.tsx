import Link from "next/link"
import { createMetadata } from "@/lib/metadata"
import { BreadcrumbStructuredData } from "@/components/seo/structured-data"
import WCAGSEOEnhancements from "@/components/wcag/seo-enhancements"
import { CriterionLinks } from "@/components/wcag/criterion-links"
import AudioControlDemo from "./interactive-demo"

export const metadata = createMetadata({
  title: "WCAG 1.4.2 Audio Control - Complete Guide",
  path: "/wcag/1-4-2",
  description:
    "Complete guide to WCAG 1.4.2 Audio Control. Learn the rule for auto-playing audio over 3 seconds, how to add pause/stop and independent volume controls, code examples, and testing methods.",
  keywords: [
    "WCAG 1.4.2",
    "Audio Control",
    "auto-play audio",
    "audio controls",
    "pause audio",
    "volume control",
    "Level A",
    "web accessibility",
  ],
  type: "article",
  image: "/api/og?title=WCAG%201.4.2%20Audio%20Control&section=WCAG",
})

const faqs = [
  {
    q: "What does WCAG 1.4.2 Audio Control require?",
    a: "It requires that if any audio on a web page plays automatically for more than 3 seconds, you provide either a mechanism to pause or stop the audio, or a mechanism to control the audio volume independently of the overall system volume. You only need to satisfy one of those two options, but the control must be part of the page itself. It is a Level A success criterion under the Perceivable principle, which means it is a baseline requirement — auto-playing sound with no in-page control is one of the most disruptive accessibility barriers there is.",
  },
  {
    q: "Does the 3-second rule mean short auto-playing audio is always fine?",
    a: "Audio that plays automatically and stops on its own within 3 seconds is not covered by 1.4.2, so a brief notification chime or a two-second intro sting does not trigger the requirement. Anything longer than 3 seconds does, and the safest practice is simply not to auto-play audio at all. If you must, either keep it to 3 seconds or less, or add an obvious pause/stop or independent volume control that a keyboard and screen-reader user can reach immediately.",
  },
  {
    q: "Why doesn't the operating-system volume control count?",
    a: "The system or hardware volume affects everything at once — including a blind user's screen reader speech. If the only way to quiet your auto-playing audio is to turn down the whole system, the user has to silence their screen reader too, which makes the page unusable. WCAG 1.4.2 is explicit that the volume control must be independent of the overall system volume, meaning it lives in the page and adjusts only your audio, leaving assistive-technology output untouched.",
  },
  {
    q: "Where should the pause or stop control be placed on the page?",
    a: "As early as possible. Because auto-playing audio starts competing with a screen reader immediately, the control that stops it should be easy to find and reach right away — ideally the first focusable element on the page, or at the very top of the DOM order. If a screen-reader user has to tab through a whole navigation bar while audio drowns out their speech, the control technically exists but does not really help. Put it first, make it a real button, and give it a clear accessible name.",
  },
  {
    q: "Does 1.4.2 apply to audio inside auto-playing video?",
    a: "Yes. The criterion is about sound, not about the element that produces it. Background music, ambient loops, audio in an auto-playing video, and any other automatically-started sound over 3 seconds all fall under 1.4.2. If a video auto-plays with an audio track, you must provide a way to pause or stop it, or an independent volume control — muting the video, pausing it, or stopping playback all satisfy the requirement as long as the control is available in the page.",
  },
  {
    q: "Is auto-playing audio ever acceptable if it's essential to the content?",
    a: "1.4.2 applies regardless of whether the audio is essential — there is no 'essential' exception here. Even if the sound is central to the experience, you still have to give users a way to pause, stop, or independently lower it. The reason is simple: no matter how important the audio is to some users, for a screen-reader user it can make the rest of the page completely inaccessible, so control must always be available.",
  },
]

export default function WCAG142Page() {
  return (
    <>
      <WCAGSEOEnhancements
        title="WCAG 1.4.2: Audio Control"
        description="If any audio on a web page plays automatically for more than 3 seconds, either a mechanism is available to pause or stop the audio, or a mechanism is available to control audio volume independently from the overall system volume level."
        criteria="1.4.2"
        level="A"
        principle="Perceivable"
        guideline="1.4 Distinguishable"
        url="https://accessibility.build/wcag/1-4-2"
        category="Distinguishable"
      />
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "WCAG Success Criteria", url: "https://accessibility.build/wcag" },
          { name: "1.4.2 Audio Control", url: "https://accessibility.build/wcag/1-4-2" },
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
                    1.4.2 Audio Control
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
                Silence the sound users didn&apos;t ask for
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
              WCAG 1.4.2: Audio Control
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              Sound that starts on its own is not just annoying — for someone using
              a screen reader it can drown out the speech they depend on to use the
              page at all. This criterion asks that whenever audio auto-plays for{" "}
              <strong className="text-slate-900 dark:text-white">
                more than three seconds, users can pause or stop it, or turn it down
                independently of their system volume
              </strong>
              . The best answer is usually the simplest: don&apos;t auto-play audio
              in the first place.
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
              If any audio on a web page plays automatically for more than 3
              seconds, either a mechanism is available to pause or stop the audio,
              or a mechanism is available to control audio volume independently from
              the overall system volume level.
            </blockquote>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4 text-sm">
              Two things make this criterion easy to misjudge. First, it is triggered
              by any auto-playing sound over three seconds — background music, an
              ambient loop, or the audio track of an auto-playing video all count.
              Second, the volume control must be <em>independent</em>: relying on the
              operating-system volume does not satisfy it, because that would force a
              blind user to silence their screen reader along with your audio.
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
              Uncontrolled audio is a barrier for far more people than you might
              expect. Giving users a way to stop or lower it keeps the page usable
              for everyone within earshot:
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  t: "Screen reader users",
                  d: "Auto-playing audio plays over the synthesized speech a blind user relies on. If they cannot silence your sound without silencing their screen reader too, the entire page becomes unusable.",
                },
                {
                  t: "People with cognitive and attention disabilities",
                  d: "Unexpected background sound competes for attention and makes it hard to focus on reading, following instructions, or completing a task.",
                },
                {
                  t: "People with hearing aids and cochlear implants",
                  d: "Sudden or layered audio can be disorienting or physically uncomfortable when amplified directly into the ear.",
                },
                {
                  t: "Users with anxiety or sensory sensitivities",
                  d: "Sound that starts without warning can be startling or distressing; an immediate way to stop it prevents a stressful experience.",
                },
                {
                  t: "Anyone in a shared or quiet space",
                  d: "Offices, libraries, classrooms, public transit — a page that blares audio on load embarrasses users and makes them close it rather than use it.",
                },
                {
                  t: "Voice-interface and speech-input users",
                  d: "Background audio interferes with speech recognition, making voice control unreliable while the sound is playing.",
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
              The trigger is narrow but the coverage is broad. 1.4.2 only applies
              when audio plays <em>automatically</em> — without the user starting it
              — and continues for <em>more than three seconds</em>. When both are
              true, the audio must come with one of two mechanisms:
            </p>
            <ul className="space-y-3 mb-6">
              {[
                {
                  t: "A pause or stop mechanism",
                  d: "An in-page control that silences the audio — a stop button, a pause toggle, a mute that fully cuts the sound. It must be operable by keyboard and have a clear accessible name.",
                },
                {
                  t: "Independent volume control",
                  d: "A control that adjusts your audio's level separately from the system volume, so a user can turn your sound to zero without touching their screen reader or the rest of the device.",
                },
                {
                  t: "Reachable early",
                  d: "Because the audio competes with assistive technology from the moment it starts, the control should be one of the first things a keyboard or screen-reader user encounters — ideally the first focusable element, at the top of the DOM.",
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
              What counts as &ldquo;audio&rdquo;, and what&apos;s exempt
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              &ldquo;Audio&rdquo; here means any sound: background music, ambient
              loops, sound effects, and the audio track of an auto-playing video.
              The one thing that removes the obligation is duration — audio that
              auto-plays and stops on its own within three seconds is not covered.
              There is no exception for &ldquo;essential&rdquo; audio: the criterion
              applies whether or not the sound is central to the content, because for
              a screen-reader user any uncontrolled audio can make the page
              unusable. The genuinely safe pattern is to never auto-play sound and
              let the user press play. See also{" "}
              <Link
                href="/wcag/1-4-1"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                1.4.1 Use of Color
              </Link>{" "}
              and the time-based media criteria for related requirements.
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
                  ✓ Passes 1.4.2
                </h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <li>Audio that does not play until the user presses a play button.</li>
                  <li>
                    Background music that auto-plays but offers a prominent
                    pause/stop button at the top of the page.
                  </li>
                  <li>
                    An auto-playing video whose sound can be muted or paused with an
                    in-page control.
                  </li>
                  <li>
                    A short notification chime that stops on its own within three
                    seconds.
                  </li>
                  <li>
                    Auto-playing audio with an in-page volume slider that can be
                    lowered to silent, independently of the system volume.
                  </li>
                </ul>
              </div>
              <div className="rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-5">
                <h3 className="font-semibold text-rose-800 dark:text-rose-300 mb-3">
                  ✗ Fails 1.4.2
                </h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <li>
                    Background music that starts on page load and runs for a minute
                    with no way to stop it.
                  </li>
                  <li>
                    An auto-playing promo video with sound and no accessible mute or
                    pause control.
                  </li>
                  <li>
                    Audio whose only &ldquo;control&rdquo; is to turn down the
                    device or system volume.
                  </li>
                  <li>
                    A stop button that exists but is buried at the bottom of the page
                    after all the content.
                  </li>
                  <li>
                    An ambient sound loop that keeps playing while a screen reader
                    tries to announce the page.
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
              Don&apos;t auto-play; let the user start it
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              The simplest way to pass is to never auto-play. A native{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                &lt;audio controls&gt;
              </code>{" "}
              element gives the user play, pause, and volume out of the box.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- ✗ Auto-plays with no way to stop it -->
<audio src="background-music.mp3" autoplay loop></audio>

<!-- ✓ User starts it; native controls include pause + volume -->
<audio src="podcast.mp3" controls preload="none">
  Your browser doesn't support audio.
  <a href="podcast.mp3">Download the audio file</a>.
</audio>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              If audio must auto-play, provide a control first
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              When auto-play is unavoidable, put a real, keyboard-operable stop
              control at the very top of the page so it is the first thing an
              assistive-technology user reaches.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- ✗ Auto-plays; the only "fix" is the OS volume -->
<audio id="bg" src="ambient.mp3" autoplay loop></audio>

<!-- ✓ Stop control is the first focusable element on the page -->
<button type="button" onclick="document.getElementById('bg').pause()">
  Stop background audio
</button>
<audio id="bg" src="ambient.mp3" autoplay loop></audio>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              An independent volume control
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              The second way to conform is a volume control that changes only your
              audio, leaving the system volume — and the user&apos;s screen reader —
              untouched.
            </p>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<audio id="track" src="ambient.mp3" autoplay loop></audio>

<label for="vol">Background audio volume</label>
<input
  id="vol"
  type="range"
  min="0" max="1" step="0.01" value="0.5"
  oninput="document.getElementById('track').volume = this.value">

<!-- Lowering this slider to 0 silences the page audio only,
     independently of the operating-system volume level. -->`}</code>
            </pre>
          </section>

          {/* Interactive demo */}
          <section aria-labelledby="demo" className="mb-12">
            <h2
              id="demo"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Interactive Demo
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              Compare a compliant audio player — nothing plays until you press Play,
              with pause, stop, mute, and an independent volume slider — against a
              non-compliant scenario where sound just starts and keeps going past
              the three-second limit with no way to control it.
            </p>
            <AudioControlDemo />
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
                "Auto-playing background music or ambient loops on page load with no in-page pause, stop, or mute.",
                "Auto-playing video that includes an audio track with no accessible way to mute or pause it.",
                "Treating the operating-system or hardware volume as the 'control' — it also silences the screen reader.",
                "Providing a stop button but placing it late in the DOM, after navigation and content, where it is hard to reach in time.",
                "A pause control that is only operable with a mouse and cannot be reached or activated by keyboard.",
                "Audio controls with no accessible name, announced by screen readers as an unlabeled button.",
                "Assuming audio under 3 seconds that actually loops — a looping short clip runs indefinitely and is covered.",
                "Believing 'essential' audio is exempt; 1.4.2 applies regardless of how important the sound is.",
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
              How to test for 1.4.2
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "Load the page and listen",
                  d: "Open the page fresh, with sound on, and note whether any audio starts on its own. If nothing auto-plays, 1.4.2 does not apply — but confirm across the states and pages that might trigger sound (modals, hero videos, ad slots).",
                },
                {
                  t: "Time any auto-playing audio",
                  d: "If audio does auto-play, measure how long it runs. Audio that stops by itself within 3 seconds passes without a control. Anything longer than 3 seconds — including short clips that loop — needs a mechanism.",
                },
                {
                  t: "Find the control and check it works",
                  d: "Locate the in-page pause/stop or independent volume control. Confirm it actually silences or lowers the audio, and that a volume control affects only the page audio, not the system volume.",
                },
                {
                  t: "Check how early the control is reachable",
                  d: "Tab from the top of the page. The stop control should be one of the first focusable elements, so a screen-reader user reaches it before wading through content while audio plays over their speech.",
                },
                {
                  t: "Test with a keyboard only",
                  d: "Unplug the mouse. Confirm you can move focus to the audio control and activate it with Enter or Space, and that it has a visible focus indicator.",
                },
                {
                  t: "Test with a screen reader",
                  d: "With NVDA, JAWS, or VoiceOver running, load the page. Verify you can still hear and operate the screen reader, that the control is announced with a clear name, and that stopping the audio restores clear speech output.",
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
          <CriterionLinks number="1.4.2" />

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
