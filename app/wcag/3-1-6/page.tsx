import type { Metadata } from "next"
import Link from "next/link"
import WCAGSEOEnhancements from "@/components/wcag/seo-enhancements"
import WCAGBreadcrumb from "@/components/wcag/breadcrumb"
import { CriterionLinks } from "@/components/wcag/criterion-links"

export const metadata: Metadata = {
  title: "WCAG 3.1.6 Pronunciation — Complete Guide",
  description:
    "Guide to WCAG 3.1.6 Pronunciation: when ambiguous words need a pronunciation mechanism, ruby annotations, glossaries, audio clips, code examples, and testing.",
  keywords: [
    "WCAG 3.1.6",
    "Pronunciation",
    "ruby annotation",
    "heteronyms accessibility",
    "pronunciation mechanism",
    "kanji ruby rt",
    "phonetic notation web",
    "screen reader pronunciation",
    "Level AAA",
    "WCAG 2.2",
    "readable",
  ],
  alternates: {
    canonical: "/wcag/3-1-6",
  },
  openGraph: {
    title: "WCAG 3.1.6 Pronunciation — Disambiguate Words That Sound Different (Level AAA)",
    description:
      "The definitive guide to WCAG 3.1.6: when a word's meaning is ambiguous without its pronunciation, provide a mechanism — ruby annotation, glossary, phonetics, or audio. Code and testing included.",
    url: "/wcag/3-1-6",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: "/api/og?title=WCAG%203.1.6%20Pronunciation&section=WCAG",
        width: 1200,
        height: 630,
        alt: "WCAG 3.1.6 Pronunciation guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WCAG 3.1.6 Pronunciation — Level AAA Guide",
    description:
      "Words whose meaning depends on pronunciation need a mechanism that reveals it: ruby annotations, glossaries, phonetic spellings, or audio. How to implement and test 3.1.6.",
    images: [
      {
        url: "/api/og?title=WCAG%203.1.6%20Pronunciation&section=WCAG",
        width: 1200,
        height: 630,
      },
    ],
  },
}

const faqs = [
  {
    q: "What does WCAG 3.1.6 Pronunciation require?",
    a: "It requires that a mechanism is available for identifying the specific pronunciation of words where the meaning of those words, in context, is ambiguous without knowing the pronunciation. It is a Level AAA success criterion under Guideline 3.1 Readable. The trigger is narrow: it applies only when context does not resolve the ambiguity — when even a full sentence read around the word still leaves two possible meanings that differ by pronunciation alone.",
  },
  {
    q: "Which words does 3.1.6 actually apply to?",
    a: "Heteronyms — words spelled identically but pronounced differently with different meanings — when context leaves them ambiguous. English examples: 'desert' (abandon vs. arid land), 'bass' (fish vs. low frequency), 'bow' (of a ship vs. ribbon), 'tear', 'lead', 'wind'. The criterion matters even more in languages like Japanese, where the same Han (kanji) characters can have multiple readings, which is why ruby annotation exists. If the sentence makes the meaning obvious, no mechanism is needed for that occurrence.",
  },
  {
    q: "What counts as a 'mechanism' for identifying pronunciation?",
    a: "Any of: pronunciation given inline right after the word (e.g. 'bass (pronounced \"base\")'), ruby annotations over the characters, a link from the word to a glossary entry that includes pronunciation, a pronunciation guide for the page or site that covers the word, or a sound file the user can play to hear the word spoken. The Understanding document lists all of these as sufficient techniques — you only need one per ambiguous word.",
  },
  {
    q: "Why does pronunciation matter for accessibility rather than just style?",
    a: "Because some users receive the text as sound or must reconstruct sound to decode it. Screen reader and text-to-speech users hear one pronunciation chosen by the synthesizer — if it picks the wrong reading of an ambiguous word, the meaning silently changes. People with reading disabilities may sound words out and stall on ambiguity. Deaf and hard-of-hearing readers, and people reading in a second language, can misassign meaning without a pronunciation cue. The mechanism restores the information the spelling alone fails to carry.",
  },
  {
    q: "How does ruby markup work, and do screen readers support it?",
    a: "The HTML <ruby> element wraps base text, and <rt> carries the annotation rendered above it: <ruby>漢字<rt>かんじ</rt></ruby>. <rp> provides fallback parentheses for browsers without ruby rendering. Browser visual support is excellent. Screen reader behavior varies — some read the base text, some the annotation — so for critical content pair ruby with another mechanism such as a glossary entry or audio clip. Ruby is standard practice for Japanese furigana and useful for phonetic guides generally.",
  },
  {
    q: "How is 3.1.6 different from 3.1.3 Unusual Words and 3.1.4 Abbreviations?",
    a: "All three are AAA criteria in the Readable guideline that require mechanisms for understanding words, but they cover different problems. 3.1.3 covers words used in an unusual or restricted way (jargon, idioms) — the reader needs a definition. 3.1.4 covers abbreviations — the reader needs the expanded form. 3.1.6 covers pronunciation-dependent meaning — the reader needs to know how the word sounds. A single well-built glossary can satisfy all three at once if entries include definitions, expansions, and pronunciations.",
  },
]

export default function WCAG316Page() {
  return (
    <>
      <WCAGSEOEnhancements
        title="WCAG 3.1.6: Pronunciation"
        description="A mechanism is available for identifying specific pronunciation of words where meaning is ambiguous without knowing the pronunciation"
        criteria="3.1.6"
        level="AAA"
        principle="Understandable"
        guideline="3.1 Readable"
        url="https://accessibility.build/wcag/3-1-6"
        category="Readable"
        relatedCriteria={["3.1.1", "3.1.5", "1.1.1"]}
      />

      <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <WCAGBreadcrumb items={[]} current="3.1.6 Pronunciation" />

          {/* Header */}
          <header className="mb-12">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                Level AAA
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Principle 3: Understandable
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                Ruby, glossaries &amp; audio
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
              WCAG 3.1.6: Pronunciation
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              Read this aloud: &ldquo;The soldier decided to desert in the
              desert.&rdquo; Same letters, two words, two pronunciations — and if you
              hear the wrong one, you get the wrong meaning. This criterion says:{" "}
              <strong className="text-slate-900 dark:text-white">
                when a word&rsquo;s meaning is ambiguous without knowing its
                pronunciation, provide a mechanism that reveals the pronunciation
              </strong>{" "}
              — ruby annotations, glossary links, phonetic spellings, or audio.
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
            <blockquote className="text-slate-700 dark:text-slate-300 leading-relaxed border-l-4 border-purple-500 pl-4">
              A mechanism is available for identifying specific pronunciation of words
              where meaning of the words, in context, is ambiguous without knowing the
              pronunciation.
            </blockquote>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4 text-sm">
              The load-bearing phrase is <em>in context</em>. Most heteronyms are
              disambiguated by their sentence — &ldquo;she plays bass guitar&rdquo;
              needs no help. The criterion fires only when the surrounding words still
              leave the meaning genuinely uncertain.
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
                  What triggers the requirement
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#pass-fail">
                  Pass and fail examples
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#code">
                  Code: ruby, glossaries, and audio
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#failures">
                  Common failures
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#testing">
                  How to test
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#siblings">
                  Relationship to other criteria
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
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              {[
                {
                  t: "Text-to-speech and screen reader users",
                  d: "A synthesizer must pick one reading of an ambiguous word, and it guesses from statistics, not understanding. When it guesses wrong, the listener receives the wrong meaning with no visual spelling to fall back on.",
                },
                {
                  t: "People with reading disabilities",
                  d: "Many readers decode by sounding words out. A word with two plausible sounds and two meanings can halt comprehension entirely; a pronunciation cue resolves it instantly.",
                },
                {
                  t: "Deaf and hard-of-hearing readers",
                  d: "Readers who have never heard a word pronounced can't use sound memory to disambiguate. Explicit pronunciation information supplies what incidental listening supplies for hearing readers.",
                },
                {
                  t: "Language learners and cross-script readers",
                  d: "In Japanese, one kanji compound can have several readings with different meanings — furigana (ruby) is the centuries-old fix. Learners of any language face the same trap with heteronyms and names.",
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
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              This is one of the most language-dependent criteria in WCAG. In English
              it fires occasionally; in Japanese, Chinese, Hebrew, and Arabic —
              languages where the written form routinely underspecifies the sound — it
              is a daily concern, and native conventions (furigana, pinyin, niqqud,
              harakat) are the established mechanisms.
            </p>
          </section>

          {/* Requirement */}
          <section aria-labelledby="requirement" className="mb-12">
            <h2
              id="requirement"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              What triggers the requirement
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Work through three questions for any suspicious word:
            </p>
            <ul className="space-y-3 mb-4">
              <li className="flex gap-3 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
                <span aria-hidden="true" className="text-purple-500 font-bold">
                  1
                </span>
                <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong className="text-slate-900 dark:text-white">
                    Does the word have multiple pronunciations with different
                    meanings?
                  </strong>{" "}
                  If not — even a strangely spelled word with one reading — 3.1.6 does
                  not apply (3.1.3 Unusual Words may).
                </span>
              </li>
              <li className="flex gap-3 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
                <span aria-hidden="true" className="text-purple-500 font-bold">
                  2
                </span>
                <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong className="text-slate-900 dark:text-white">
                    Does the context fail to resolve which one is meant?
                  </strong>{" "}
                  &ldquo;He caught a bass&rdquo; is resolved by &ldquo;caught.&rdquo;
                  &ldquo;Turn up the bass&rdquo; is resolved by &ldquo;turn up.&rdquo;
                  But a heading that just says &ldquo;Bass&rdquo; on a sporting-goods
                  page that also sells speakers is genuinely ambiguous.
                </span>
              </li>
              <li className="flex gap-3 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
                <span aria-hidden="true" className="text-purple-500 font-bold">
                  3
                </span>
                <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong className="text-slate-900 dark:text-white">
                    Is a mechanism available for that word?
                  </strong>{" "}
                  Inline pronunciation, ruby annotation, a glossary link with
                  pronunciation, a page-level pronunciation guide, or a playable audio
                  clip. Any one of them satisfies the criterion; there are no other
                  exceptions to fall back on.
                </span>
              </li>
            </ul>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              The cheapest conformance strategy is editorial: rewrite to remove the
              ambiguity (&ldquo;the sea bass&rdquo;, &ldquo;the bass line&rdquo;).
              When the ambiguous form must stay — proper names, quoted text, poetry,
              kanji — reach for a mechanism.
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
              <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/20 p-5">
                <h3 className="font-semibold text-emerald-800 dark:text-emerald-300 mb-3">
                  ✓ Passes 3.1.6
                </h3>
                <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <li>
                    A Japanese news site rendering unusual kanji readings with
                    furigana via <code className="font-mono">&lt;ruby&gt;</code>.
                  </li>
                  <li>
                    A poetry archive that links ambiguous words to a glossary showing
                    IPA and a play-audio button.
                  </li>
                  <li>
                    A surname guide writing &ldquo;Nguyen (pronounced
                    &lsquo;win&rsquo;)&rdquo; inline on first use.
                  </li>
                  <li>
                    A page whose only heteronyms are fully resolved by their sentences
                    — no mechanism needed, criterion satisfied by context.
                  </li>
                </ul>
              </div>
              <div className="rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-5">
                <h3 className="font-semibold text-rose-800 dark:text-rose-300 mb-3">
                  ✗ Fails 3.1.6
                </h3>
                <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <li>
                    A dictionary-style entry titled just &ldquo;Bow&rdquo; covering
                    both the knot and the ship part, with no pronunciation for either
                    sense.
                  </li>
                  <li>
                    Japanese text using rare kanji readings with no furigana, glossary,
                    or audio anywhere.
                  </li>
                  <li>
                    A quiz question — &ldquo;What does &lsquo;wind&rsquo;
                    mean?&rdquo; — where the answer depends on the reading and no
                    mechanism identifies it.
                  </li>
                  <li>
                    A pronunciation guide that exists but omits the actual ambiguous
                    words used on the page.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Code */}
          <section aria-labelledby="code" className="mb-12">
            <h2
              id="code"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Code: ruby, glossaries, and audio
            </h2>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Ruby annotation for per-character readings
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">&lt;ruby&gt;</code>{" "}
              renders small annotation text above the base characters —
              the standard technique for Japanese furigana, and usable for phonetic
              hints in any script.{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">&lt;rp&gt;</code>{" "}
              supplies parentheses for browsers that cannot render ruby.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- Japanese furigana: 東京 read as とうきょう -->
<p>
  <ruby>東京<rp>（</rp><rt>とうきょう</rt><rp>）</rp></ruby>
  は日本の首都です。
</p>

<!-- The same element carrying a phonetic hint in English -->
<p>
  The <ruby>ye<rp>（</rp><rt>the</rt><rp>）</rp></ruby> in
  "Ye Olde Shoppe" was always pronounced "the".
</p>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Inline pronunciation on first use
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              The simplest sufficient technique: state the pronunciation in plain text
              immediately after the ambiguous word. It works everywhere, needs no
              special support, and benefits every reader.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<p>
  The fishing report covers striped bass
  <span class="pronunciation">(pronounced "bass" as in "class")</span>,
  not the bass <span class="pronunciation">(rhymes with "base")</span>
  you hear in music.
</p>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Glossary link with audio pronunciation
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              For recurring terms, link each ambiguous word to a glossary entry that
              shows the phonetic form and offers a sound file. Remember a text
              alternative for the audio itself.
            </p>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<p>
  Sailors salute from the
  <a href="/glossary#bow-ship">bow</a> of the ship.
</p>

<!-- /glossary#bow-ship -->
<dt id="bow-ship">bow <span aria-hidden="true">/baʊ/</span>
  <span class="sr-only">pronounced "bau", rhyming with "cow"</span>
</dt>
<dd>
  The front end of a ship.
  <button type="button" data-audio="/audio/bow-ship.mp3">
    Play pronunciation
  </button>
</dd>`}</code>
            </pre>
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
                "Leaving genuinely ambiguous heteronyms bare where context cannot resolve them — headings and single-word labels are the classic spot.",
                "Publishing Japanese or Chinese content with unusual readings and no furigana, pinyin, glossary, or audio mechanism at all.",
                "Providing IPA notation only, with no plain-language respelling or audio — IPA is itself unreadable to most of the audience that needs help.",
                "A site pronunciation guide that does not include the specific ambiguous words actually used in the content.",
                "Relying on aria-label to force a screen reader pronunciation — this changes what is announced for AT users but gives visual readers no mechanism, and often corrupts braille output.",
                "Audio pronunciation buttons with no text alternative or transcript, trading one accessibility gap for another (see 1.1.1).",
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
              How to test for 3.1.6
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "Inventory candidate words",
                  d: "Scan the content for heteronyms and, in relevant languages, characters with multiple readings. For English, a checklist of common heteronyms (bass, bow, desert, lead, tear, wind, wound, minute, dove, row…) catches most cases; content in Japanese or similar scripts needs a native-speaker pass.",
                },
                {
                  t: "Judge each occurrence in context",
                  d: "For every candidate, read the full sentence and surrounding content. If a reasonable reader (or a text-to-speech engine) could still pick the wrong pronunciation and therefore the wrong meaning, the occurrence is in scope.",
                },
                {
                  t: "Listen with text-to-speech",
                  d: "Run the page through a screen reader or TTS engine and listen for the in-scope words. A synthesizer choosing the wrong reading is direct evidence the ambiguity is real — and shows exactly what an audio-first user experiences.",
                },
                {
                  t: "Verify a mechanism exists for each in-scope word",
                  d: "Check for inline pronunciation, ruby annotation, a glossary link that includes pronunciation, a page/site pronunciation guide covering the word, or a playable audio clip. One mechanism per word is enough.",
                },
                {
                  t: "Verify the mechanism itself is accessible",
                  d: "Ruby should degrade gracefully (<rp> fallbacks), audio needs a text equivalent, glossary links need descriptive text, and any popover mechanism must be keyboard-operable and meet 1.4.13.",
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
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-5">
              No automated tool can detect meaning ambiguity — this is a human,
              editorial review. Track it alongside the rest of your{" "}
              <Link
                href="/checklists/wcag-2-2"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                WCAG 2.2 checklist
              </Link>
              .
            </p>
          </section>

          {/* Relationship */}
          <section aria-labelledby="siblings" className="mb-12">
            <h2
              id="siblings"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Relationship to other criteria
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              The Readable guideline works as a pipeline from sound to sense.{" "}
              <Link href="/wcag/3-1-1" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                3.1.1 Language of Page
              </Link>{" "}
              (A) and 3.1.2 Language of Parts (AA) tell the speech synthesizer which
              language rules to apply — the single biggest pronunciation win available,
              and a prerequisite: no per-word mechanism can rescue a page whose whole
              language is declared wrong. 3.1.3 Unusual Words and 3.1.4 Abbreviations
              (both AAA) handle meaning; 3.1.6 handles the cases where the <em>sound</em>{" "}
              is the missing key.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              It also pairs naturally with{" "}
              <Link href="/wcag/3-1-5" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                3.1.5 Reading Level
              </Link>{" "}
              (AAA) — the same glossary infrastructure serves both — and any audio
              pronunciations you add must themselves meet{" "}
              <Link href="/wcag/1-1-1" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                1.1.1 Non-text Content
              </Link>{" "}
              (A) with text equivalents.
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

          <CriterionLinks number="3.1.6" />
        </article>
      </div>
    </>
  )
}
