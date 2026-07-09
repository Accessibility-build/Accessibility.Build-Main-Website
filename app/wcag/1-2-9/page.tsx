import type { Metadata } from "next"
import Link from "next/link"
import WCAGSEOEnhancements from "@/components/wcag/seo-enhancements"
import WCAGBreadcrumb from "@/components/wcag/breadcrumb"
import { CriterionLinks } from "@/components/wcag/criterion-links"

export const metadata: Metadata = {
  title: "WCAG 1.2.9 Audio-only (Live) — AAA Guide",
  description:
    "WCAG 1.2.9 requires a text alternative for live audio-only content — live captions via CART or a script for scripted broadcasts. Requirements, examples, testing.",
  keywords: [
    "WCAG 1.2.9",
    "Audio-only Live",
    "live audio transcript",
    "CART captioning",
    "live captions audio stream",
    "webcast accessibility",
    "Level AAA",
    "WCAG 2.2",
    "time-based media",
  ],
  alternates: {
    canonical: "/wcag/1-2-9",
  },
  openGraph: {
    title: "WCAG 1.2.9 Audio-only (Live) — AAA Guide",
    description:
      "Live audio-only content needs an equivalent text alternative: real-time captions via CART, or the script for scripted broadcasts. What 1.2.9 requires and how to test.",
    url: "/wcag/1-2-9",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: "/api/og?title=WCAG%201.2.9%20Audio-only%20(Live)&section=WCAG",
        width: 1200,
        height: 630,
        alt: "WCAG 1.2.9 Audio-only (Live) guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WCAG 1.2.9 Audio-only (Live) — AAA Guide",
    description:
      "Live audio-only content needs an equivalent text alternative: real-time captions via CART, or the script for scripted broadcasts. Requirements and testing.",
    images: ["/api/og?title=WCAG%201.2.9%20Audio-only%20(Live)&section=WCAG"],
  },
}

const faqs = [
  {
    q: "What does WCAG 1.2.9 Audio-only (Live) require?",
    a: "It requires an alternative for time-based media that presents equivalent information for live audio-only content. In practice that means live text: real-time captions produced by a trained human captioner (often called CART — Communication Access Real-time Translation), or, when the broadcast follows a prepared script, the script itself made available to users. It is a Level AAA success criterion introduced in WCAG 2.0 and unchanged in WCAG 2.2.",
  },
  {
    q: "What counts as live audio-only content?",
    a: "Any real-time content that is sound with no video: live radio-style web streams, audio-only webinars or conference calls, live podcast recordings streamed to listeners, audio press briefings, and similar broadcasts. If the live content includes video (a webcast with a camera feed), it is synchronized media and falls under 1.2.4 Captions (Live) at Level AA instead.",
  },
  {
    q: "Are automatic speech-to-text captions good enough for 1.2.9?",
    a: "Usually not on their own. The Understanding document notes that automatic speech recognition can degrade badly with crosstalk, accents, background noise, and specialist vocabulary, so WCAG points to a human captioner using CART for reliable results. Automatic captions may be acceptable when they are demonstrably accurate for the material — for example, a single clear speaker with a good microphone — but for AAA conformance you should not assume they are; verify accuracy or use a professional service.",
  },
  {
    q: "Can I just publish a transcript after the broadcast ends?",
    a: "A post-hoc transcript is valuable — once the stream is archived it becomes prerecorded content and 1.2.1 applies — but it does not satisfy 1.2.9 for the live experience. The point of this criterion is equivalent access while the broadcast is happening, so Deaf and hard-of-hearing users can participate in real time. The exception is scripted content: if the broadcast reads from a prepared script, providing that script during the broadcast conforms.",
  },
  {
    q: "How much delay is acceptable for the live text?",
    a: "WCAG does not fix a number, but the alternative must be usable as the event unfolds. Professional CART typically runs only a few seconds behind speech, which preserves the ability to follow along and to participate in any live interaction such as Q&A. The longer the lag, the less 'equivalent' the alternative becomes — if questions close before the text of the discussion has arrived, the user did not have equivalent access.",
  },
  {
    q: "Is 1.2.9 required by accessibility laws?",
    a: "Rarely, because most regulations reference WCAG Level AA and this criterion is AAA. However, live captioning obligations for events do exist in other legal contexts (for example effective-communication requirements under the ADA for public events), and many organizations provide CART for all-hands meetings and public webinars as standard practice. For pure legal WCAG conformance at AA, live audio-only content is not covered; 1.2.9 is the AAA enhancement that covers it.",
  },
]

export default function WCAG129Page() {
  return (
    <>
      <WCAGSEOEnhancements
        title="WCAG 1.2.9: Audio-only (Live)"
        description="An alternative for time-based media that presents equivalent information for live audio-only content is provided."
        criteria="1.2.9"
        level="AAA"
        principle="Perceivable"
        guideline="1.2 Time-based Media"
        url="https://accessibility.build/wcag/1-2-9"
        category="Time-based Media"
        relatedCriteria={["1.2.1", "1.2.4", "1.2.8"]}
      />

      <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <WCAGBreadcrumb items={[]} current="1.2.9 Audio-only (Live)" />

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
              WCAG 1.2.9: Audio-only (Live)
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              A live audio stream with no text alternative is simply silence for someone
              who is Deaf or hard of hearing. This AAA criterion requires that{" "}
              <strong className="text-slate-900 dark:text-white">
                live audio-only content comes with equivalent live text
              </strong>{" "}
              — real-time captions from a trained captioner, or the script when the
              broadcast is scripted.
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
              An alternative for time-based media that presents equivalent information
              for live audio-only content is provided.
            </blockquote>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4 text-sm">
              &ldquo;Equivalent&rdquo; is the operative word: the text must carry the
              information in the audio — the speech, who is speaking, and meaningful
              sounds — closely enough in time that a reader can follow, and take part in,
              the live event.
            </p>
          </section>

          {/* AAA context */}
          <section aria-labelledby="aaa-context" className="mb-12">
            <h2
              id="aaa-context"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              AAA context: the live corner of Guideline 1.2
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Guideline 1.2 divides media by two axes: prerecorded vs. live, and
              audio/video composition. Prerecorded audio-only is handled at Level A by{" "}
              <Link href="/wcag/1-2-1" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                1.2.1
              </Link>{" "}
              (transcript). Live <em>synchronized</em> media — video with audio — gets
              captions at Level AA under 1.2.4. That leaves live audio-only content,
              which only this AAA criterion covers. At Level AA, a live radio-style
              stream technically has no WCAG requirement at all; 1.2.9 closes that gap.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Note the boundary: once your live audio event has any video component, it
              is no longer &ldquo;audio-only&rdquo; and 1.2.4 (AA) applies instead. And
              once the recording is published afterwards, it becomes prerecorded
              audio-only content and 1.2.1 requires a transcript.
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
                  t: "People who are Deaf",
                  d: "Live text is the only way to participate in an audio-only event in real time — to follow the discussion and contribute to Q&A while it is still open.",
                },
                {
                  t: "People who are hard of hearing",
                  d: "Even with amplification, live speech over a compressed web stream can be hard to make out. Captions provide a reliable parallel channel.",
                },
                {
                  t: "People in sound-hostile environments",
                  d: "Listeners in loud spaces, quiet offices, or on failing connections can follow the text stream when the audio is unusable.",
                },
                {
                  t: "Non-native speakers",
                  d: "Reading along with live speech significantly improves comprehension of fast or accented speech for many second-language users.",
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

          {/* Ways to conform */}
          <section aria-labelledby="requirement" className="mb-12">
            <h2
              id="requirement"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Ways to conform
            </h2>
            <ul className="space-y-3 mb-6">
              {[
                "CART / real-time captioning: a trained human captioner listens to the stream and produces live text, delivered in a caption viewer or embedded text stream alongside the audio. This is the reference technique.",
                "Scripted broadcasts: when the audio follows a prepared script (a recorded-style announcement read live, an audio drama, a formal statement), providing that script to users during the broadcast conforms.",
                "Verified speech-to-text: automatic recognition only where its accuracy for this speaker and material has been verified — accuracy, speaker identification, and meaningful sounds still need to reach the reader.",
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
                  <li>An audio-only all-hands stream with a CART captioner and a live caption pane next to the player.</li>
                  <li>A live reading of a prepared statement with the full script linked from the stream page.</li>
                  <li>An audio webinar embedding a StreamText-style live text feed synchronized within seconds.</li>
                </ul>
              </div>
              <div className="rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-5">
                <h3 className="font-semibold text-rose-800 dark:text-rose-300 mb-2">
                  ✗ Fails
                </h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed list-disc pl-4">
                  <li>A live audio stream with no text channel of any kind.</li>
                  <li>&ldquo;Transcript available next week&rdquo; as the only alternative for the live event.</li>
                  <li>Unchecked auto-captions that garble names, numbers, and technical terms into noise.</li>
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
              1. Audio stream with an adjacent live caption region
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Render the captioner&rsquo;s output into a live region next to the player.
              Keep the region polite so it does not interrupt screen reader users
              mid-sentence, and let users pause the visual scroll.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<h2>Quarterly briefing — live</h2>

<audio controls src="https://stream.example.com/briefing"></audio>

<section aria-label="Live captions">
  <h3>Live captions</h3>
  <div id="captions" role="log" aria-live="polite"
       class="caption-pane" tabindex="0"></div>
</section>

<script>
  // Captions arrive from the CART provider over a WebSocket
  const pane = document.getElementById("captions");
  const ws = new WebSocket("wss://cart.example.com/session/1234");

  ws.addEventListener("message", (event) => {
    const line = document.createElement("p");
    line.textContent = event.data; // e.g. "MAYA: Welcome, everyone."
    pane.append(line);
    pane.scrollTop = pane.scrollHeight;
  });
</script>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              2. Scripted broadcast: publish the script with the stream
            </h3>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<audio controls src="https://stream.example.com/statement"></audio>

<p>
  This broadcast is read from a prepared statement.
  <a href="/statements/2026-07-09-remarks">
    Read the full script of these remarks
  </a>
</p>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              3. Caption-pane CSS that stays readable
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Live text is read under time pressure — give it generous size, spacing, and
              contrast (see{" "}
              <Link href="/wcag/1-4-6" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                1.4.6 Contrast (Enhanced)
              </Link>
              ).
            </p>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`.caption-pane {
  max-height: 14rem;
  overflow-y: auto;
  font-size: 1.125rem;
  line-height: 1.6;
  color: #f8fafc;             /* ~17:1 on the dark background */
  background: #0f172a;
  padding: 1rem;
  border-radius: 0.5rem;
}`}</code>
            </pre>
          </section>

          {/* Testing */}
          <section aria-labelledby="testing" className="mb-12">
            <h2
              id="testing"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              How to test for 1.2.9
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "Identify live audio-only content",
                  d: "List every real-time, sound-only experience: audio streams, audio webinars, audio conference bridges surfaced on the web. Live video events belong to 1.2.4 instead.",
                },
                {
                  t: "Confirm a live text alternative is announced and reachable",
                  d: "From the stream page, a user should find the caption pane, caption viewer link, or script link before or at the start of the event — not by asking support.",
                },
                {
                  t: "Join the event and compare audio to text",
                  d: "Listen while reading. Speech should be captured accurately, speakers identified, and meaningful sounds noted. Sample sections with names, numbers, and jargon — that is where quality collapses.",
                },
                {
                  t: "Measure the lag",
                  d: "The text should trail speech by seconds, not minutes. Check that a caption reader could still act on time-sensitive moments, such as a Q&A window or instructions.",
                },
                {
                  t: "For scripted broadcasts, diff the script against reality",
                  d: "If the script is the alternative, verify the broadcast actually follows it. Ad-libbed content that departs from the script is uncaptioned content.",
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
                "Streaming live audio with no text alternative at all — the default state of most audio streams.",
                "Offering only a post-event transcript as the answer for the live experience.",
                "Relying on unverified automatic captions for content full of names, figures, or technical vocabulary.",
                "Captions delivered so late that Q&A or other time-sensitive participation has closed by the time users read them.",
                "No speaker identification in a multi-speaker discussion, leaving the text an unattributed wall of words.",
                "A caption viewer that itself is inaccessible — unreachable by keyboard, tiny low-contrast text, or a separate window nobody is told about.",
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

          <CriterionLinks number="1.2.9" />
        </article>
      </div>
    </>
  )
}
