import type { Metadata } from "next"
import Link from "next/link"
import WCAGSEOEnhancements from "@/components/wcag/seo-enhancements"
import WCAGBreadcrumb from "@/components/wcag/breadcrumb"
import { CriterionLinks } from "@/components/wcag/criterion-links"
import { RelatedContent } from "@/components/seo/related-content"

export const metadata: Metadata = {
  title: "WCAG 1.2.4 Captions (Live) — Real-Time Captions",
  description:
    "WCAG 1.2.4 Captions (Live) explained: live audio in synchronized media needs real-time captions. CART, ASR quality, player setup, examples, and testing.",
  keywords: [
    "WCAG 1.2.4",
    "Captions Live",
    "live captions",
    "real-time captioning",
    "CART captioning",
    "live stream accessibility",
    "webinar captions",
    "deaf accessibility video",
    "1.2.4 test",
    "Level AA",
    "WCAG 2.2",
  ],
  alternates: {
    canonical: "/wcag/1-2-4",
  },
  openGraph: {
    type: "website",
    title: "WCAG 1.2.4 Captions (Live) — Real-Time Captions",
    description:
      "All live audio content in synchronized media needs captions. Who it helps, CART vs automatic captions, player configuration examples, and how to test.",
    url: "/wcag/1-2-4",
    siteName: "Accessibility.build",
    images: [
      {
        url: "/api/og?title=WCAG%201.2.4%20Captions%20(Live)&section=WCAG",
        width: 1200,
        height: 630,
        alt: "WCAG 1.2.4 Captions (Live) guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WCAG 1.2.4 Captions (Live) — Real-Time Captions",
    description:
      "All live audio content in synchronized media needs captions. Who it helps, CART vs automatic captions, player configuration examples, and how to test.",
    images: ["/api/og?title=WCAG%201.2.4%20Captions%20(Live)&section=WCAG"],
  },
}

const faqs = [
  {
    q: "What does WCAG 1.2.4 Captions (Live) require?",
    a: "It requires that captions are provided for all live audio content in synchronized media. 'Synchronized media' means audio or video combined with another format for its presentation — in practice, a live stream that has both sound and picture, such as a webcast, webinar, live sports stream, or streamed town hall. Whenever such content is broadcast live on your site, the speech and other essential audio information must be rendered as captions in real time. It is a Level AA success criterion in WCAG 2.0, 2.1, and 2.2.",
  },
  {
    q: "Does 1.2.4 apply to audio-only live streams like web radio?",
    a: "No. The criterion is scoped to synchronized media — audio presented together with video or another time-based format. Live audio-only content (a web radio stream, an audio-only conference bridge) is addressed separately by 1.2.9 Audio-only (Live), which is a Level AAA criterion. That said, providing a live transcript or captions for audio-only broadcasts is still a major win for deaf and hard-of-hearing users even though AA conformance does not demand it.",
  },
  {
    q: "Are automatic (ASR) captions good enough to pass 1.2.4?",
    a: "Only if they are accurate enough to actually convey the content. WCAG does not name a technology, so automatic speech recognition is not banned — but captions riddled with recognition errors, missing speaker changes, or dropping technical vocabulary fail to provide an equivalent for the audio, which is the whole point. Raw, unmonitored ASR frequently falls short on names, jargon, accents, and crosstalk. The reliable route for high-stakes events is professional real-time captioning (CART) or ASR with a human correcting in the loop; if you use plain ASR, measure its accuracy on your real content before relying on it.",
  },
  {
    q: "What must live captions include besides the words spoken?",
    a: "Captions are defined as a synchronized visual (or text) equivalent for both speech and non-speech audio information needed to understand the content. That means identifying who is speaking when it isn't obvious, and noting meaningful sounds — [applause], [alarm sounding], [laughter] — not just transcribing dialogue. In a panel discussion, captions that never indicate speaker changes leave a deaf viewer unable to follow who said what.",
  },
  {
    q: "Do two-way video calls need captions under 1.2.4?",
    a: "The criterion's intent is aimed at content the website broadcasts — webcasts and live presentations — rather than private two-way calls between individuals, and the Understanding document discusses it in terms of broadcast-style media. For calls and meetings your organization hosts as events (a streamed all-hands, a public webinar with Q&A), treat them as in scope and provide live captions. Modern conferencing platforms make this straightforward, and doing so is often also required by broader equality legislation regardless of WCAG scoping.",
  },
  {
    q: "How is 1.2.4 different from 1.2.2 Captions (Prerecorded)?",
    a: "1.2.2 (Level A) covers prerecorded synchronized media: captions can be authored carefully after production, so the bar and the priority are set accordingly. 1.2.4 (Level AA) covers the live case, where captions must be produced in real time — a harder logistical problem, which is why it sits at AA rather than A. Note the hand-off: once a live event ends and you publish the recording, it becomes prerecorded media, and 1.2.2 requires (good, corrected) captions on that recording.",
  },
]

const passFailExamples = [
  {
    verdict: "pass" as const,
    t: "Webinar with CART captioning",
    d: "A public product webinar streams with a professional real-time captioner (CART) producing captions that appear in the player within a few seconds, identify speakers, and note audience reactions.",
  },
  {
    verdict: "pass" as const,
    t: "Live stream with corrected ASR",
    d: "A conference keynote uses automatic speech recognition with a human editor fixing names and jargon in real time. The resulting captions accurately convey the speech and key sounds.",
  },
  {
    verdict: "fail" as const,
    t: "Town hall stream with no captions",
    d: "A city council streams its public meeting live with audio and video but offers no captions at all. Deaf and hard-of-hearing residents cannot follow the proceedings.",
  },
  {
    verdict: "fail" as const,
    t: "Captions that don't convey the content",
    d: "A live sports webcast enables unmonitored auto-captions that garble player names and drop whole sentences during fast commentary. Captions exist, but they are not an equivalent for the audio.",
  },
  {
    verdict: "fail" as const,
    t: "Transcript posted afterwards only",
    d: "A live investor call promises a transcript 'within 48 hours'. A post-hoc transcript does not caption the live audio content — during the event, deaf viewers were excluded.",
  },
]

export default function WCAG124Page() {
  return (
    <>
      <WCAGSEOEnhancements
        title="WCAG 1.2.4: Captions (Live)"
        description="Captions are provided for all live audio content in synchronized media."
        criteria="1.2.4"
        level="AA"
        principle="Perceivable"
        guideline="1.2 Time-based Media"
        url="https://accessibility.build/wcag/1-2-4"
        category="Time-based Media"
        relatedCriteria={["1.2.2", "1.2.5", "1.2.9"]}
      />

      <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <WCAGBreadcrumb items={[]} current="1.2.4 Captions (Live)" />

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
              WCAG 1.2.4: Captions (Live)
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              A recorded video can be captioned tomorrow; a live broadcast
              cannot. This criterion closes that gap:{" "}
              <strong className="text-slate-900 dark:text-white">
                live audio content in synchronized media must be captioned in
                real time
              </strong>
              . If your webinar, webcast, or live stream has sound, deaf and
              hard-of-hearing viewers need those words on screen while the event
              is happening — not in a transcript published after everyone else
              has moved on.
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
              Captions are provided for all live audio content in synchronized
              media.
            </blockquote>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4 text-sm">
              Two defined terms carry the weight. <em>Live</em> means captured
              from a real-world event and transmitted with no more than a
              broadcast delay. <em>Synchronized media</em> means audio or video
              synchronized with another format for presenting information — in
              practice, streams with both sound and picture. Live audio-only
              content is out of scope here (it belongs to 1.2.9, Level AAA).
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
              The primary beneficiaries are{" "}
              <strong className="text-slate-900 dark:text-white">
                people who are deaf or hard of hearing
              </strong>
              . For prerecorded media they can wait for a captioned version or a
              transcript; for a live event there is no later — either the
              captions are there during the broadcast or the person is shut out
              of the Q&amp;A, the vote, the announcement, the game. Live events
              are also precisely where participation matters: you cannot ask a
              question in a webinar you could not follow.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Live captions also serve a much wider audience: people watching in
              loud environments (a commute, a factory floor) or in silence (a
              shared office, next to a sleeping child), non-native speakers who
              parse written language more easily than rapid speech, and viewers
              coping with poor audio quality on a shaky connection. Caption
              usage among hearing viewers is consistently high — the accessibility
              requirement and the mainstream feature are the same work.
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
              If your site presents live synchronized media — a webcast, a
              streamed conference session, a live product launch, a webinar, a
              streamed religious service or council meeting — captions must be
              provided for all of its audio content. Good live captions:
            </p>
            <ul className="space-y-3 mb-6">
              {[
                "Convey the speech: what is said, by whom (speaker identification when it is not visually obvious), as close to verbatim as real-time production allows.",
                "Convey essential non-speech audio: [applause], [buzzer], [phone ringing], [laughter] — any sound a hearing viewer would use to understand the event.",
                "Stay synchronized: a few seconds of delay is inherent to real-time captioning, but captions that lag far behind the video make dialogue impossible to match to speakers.",
                "Are readable in the player: viewers should be able to turn them on easily, and player caption settings (size, colors) should apply to them.",
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
              How teams produce live captions
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                  CART / professional captioners
                </h4>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  Communication Access Realtime Translation: a trained
                  stenographer or re-speaker produces captions live. The gold
                  standard for accuracy on names, jargon, accents, and
                  multi-speaker crosstalk. Book them like you book the venue.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                  ASR, ideally human-monitored
                </h4>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  Automatic speech recognition built into streaming and meeting
                  platforms. Quality varies widely with audio quality and
                  vocabulary. Feeding it a custom word list and having an editor
                  correct output live dramatically improves reliability.
                </p>
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-6">
              And remember the hand-off: the moment the recording of your live
              event is published, it is prerecorded media —{" "}
              <Link
                href="/wcag/1-2-2"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                1.2.2 Captions (Prerecorded)
              </Link>{" "}
              then requires captions on the recording, and this is your chance
              to clean up any live captioning errors.
            </p>
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
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Live captions are mostly a production and platform choice, but the
              delivery layer is code. In HLS streams, captions travel either as
              embedded CEA-608/708 tracks or as a WebVTT subtitles rendition
              declared in the multivariant playlist.
            </p>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Declare the caption track in your HLS playlist
            </h3>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`# ✗ Failing: video/audio renditions only — no caption track anywhere
#EXTM3U
#EXT-X-STREAM-INF:BANDWIDTH=2500000,RESOLUTION=1280x720
video_720p.m3u8

# ✓ Passing: live WebVTT subtitles rendition, linked to the stream
#EXTM3U
#EXT-X-MEDIA:TYPE=SUBTITLES,GROUP-ID="subs",NAME="English",\\
  LANGUAGE="en",AUTOSELECT=YES,URI="captions_en.m3u8"
#EXT-X-STREAM-INF:BANDWIDTH=2500000,RESOLUTION=1280x720,SUBTITLES="subs"
video_720p.m3u8`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Make sure your player exposes the captions
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              A caption track your player never surfaces is a fail in practice.
              Most JavaScript players pick up in-manifest tracks automatically —
              verify the CC button exists and works on the live stream, not just
              on VOD.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`// Example: hls.js — confirm subtitle tracks are found and enabled
const hls = new Hls({ enableWebVTT: true, enableCEA708Captions: true });
hls.loadSource("https://cdn.example.com/live/master.m3u8");
hls.attachMedia(videoElement);

hls.on(Hls.Events.SUBTITLE_TRACKS_UPDATED, (_evt, data) => {
  console.log("Caption tracks:", data.subtitleTracks); // must not be empty
  if (data.subtitleTracks.length > 0) hls.subtitleTrack = 0;
});`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Offer a visible caption fallback when the player cannot render them
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Some events pipe CART output to a separate caption view. If you
              render a live text stream alongside the video, keep it in reading
              order near the player and clearly labeled.
            </p>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- Live CART feed rendered next to the stream -->
<div class="stream-layout">
  <video id="live-player" controls></video>
  <section aria-label="Live captions" class="cart-panel">
    <h2>Live captions</h2>
    <div id="cart-output" class="cart-text">
      <!-- caption lines appended here by the CART provider's script -->
    </div>
  </section>
</div>`}</code>
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
                "Streaming live events — webinars, launches, meetings — with no captioning arranged at all.",
                "Promising a transcript or captioned recording after the event instead of captioning the live broadcast itself.",
                "Relying on raw, unmonitored auto-captions that mangle names and technical terms until the captions no longer convey the content.",
                "Captions without speaker identification in multi-speaker events, leaving viewers unable to follow the conversation.",
                "Omitting meaningful non-speech audio — the [alarm], the [applause], the [bell] that changes the meaning of what is happening.",
                "Publishing a caption track the player never exposes: the CC button is missing or does nothing on the live stream.",
                "Captioning the main presentation but not the Q&A, panel discussion, or breakout portions of the same live event.",
                "Testing caption delivery only on VOD content and discovering during the event that the live pipeline drops the track.",
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
              How to test for 1.2.4
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "Inventory your live media",
                  d: "List everything the site broadcasts live with both audio and video: webinars, streamed events, live shopping, town halls. Each item on the list needs a captioning plan; 'we didn't think of that stream' is the most common failure.",
                },
                {
                  t: "Watch a live event with the sound off",
                  d: "The core test. Join the stream muted and try to follow it entirely from the captions. Can you tell who is speaking? Do you learn about audience reactions and other sounds? Would you be able to participate in the Q&A?",
                },
                {
                  t: "Check caption quality, not just presence",
                  d: "Compare a few minutes of captions against the actual speech. Count errors on names, numbers, and domain terms — these are exactly what ASR gets wrong and exactly what the audience needs right.",
                },
                {
                  t: "Verify the player exposes and renders the track",
                  d: "On the live stream (not a recording), confirm the captions control is present, keyboard-operable, and actually displays captions. Test the browsers and devices your audience really uses.",
                },
                {
                  t: "Run a rehearsal with the captioning in place",
                  d: "Live captioning is a pipeline: audio feed → captioner/ASR → encoder → player. Rehearse the full chain before the event, including a fallback plan (e.g., a CART web view link) if the in-player track fails mid-broadcast.",
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
              Automated accessibility scanners cannot see inside a live stream —
              this criterion is verified by process and rehearsal. Pair it with
              the rest of the time-based media criteria in the{" "}
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

          <CriterionLinks number="1.2.4" />
        </article>

        {/* Related content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <RelatedContent
            content="live captions real-time captioning CART webinar webcast live stream deaf hard of hearing speaker identification ASR automatic captions HLS WebVTT synchronized media WCAG 1.2.4 Level AA time-based media"
            maxItems={6}
          />
        </section>
      </div>
    </>
  )
}
