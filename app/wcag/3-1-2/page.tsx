import type { Metadata } from "next"
import Link from "next/link"
import {
  ArticleStructuredData,
  BreadcrumbStructuredData,
} from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"
import { CriterionLinks } from "@/components/wcag/criterion-links"

export const metadata: Metadata = {
  title: "WCAG 3.1.2 Language of Parts — Inline lang Attributes",
  description:
    "Complete guide to WCAG 3.1.2 Language of Parts. When foreign-language passages need a lang attribute, the four exceptions, inline code samples, and how to test Level AA.",
  keywords: [
    "WCAG 3.1.2",
    "Language of Parts",
    "inline lang attribute",
    "foreign language accessibility",
    "screen reader pronunciation",
    "BCP 47 language tags",
    "multilingual content accessibility",
    "3.1.2 test",
    "lang attribute span",
    "proper names exception",
    "Level AA",
    "WCAG 2.2",
    "readable",
  ],
  alternates: {
    canonical: "/wcag/3-1-2",
  },
  openGraph: {
    title: "WCAG 3.1.2 Language of Parts — Inline lang Attributes",
    description:
      "The definitive guide to WCAG 3.1.2: when a passage in another language needs its own lang attribute, the exceptions for proper names and loanwords, code samples, and how to test Level AA.",
    url: "/wcag/3-1-2",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: "/api/og?title=WCAG%203.1.2%20Language%20of%20Parts&section=WCAG",
        width: 1200,
        height: 630,
        alt: "WCAG 3.1.2 Language of Parts guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WCAG 3.1.2 Language of Parts — The Complete Guide",
    description:
      "Every passage in a different language needs a programmatically determinable language. When to add inline lang attributes, the four exceptions, and how to test 3.1.2 Level AA.",
    images: [
      {
        url: "/api/og?title=WCAG%203.1.2%20Language%20of%20Parts&section=WCAG",
        width: 1200,
        height: 630,
      },
    ],
  },
}

const faqs = [
  {
    q: "What does WCAG 3.1.2 Language of Parts require?",
    a: "It requires that the human language of each passage or phrase in the content can be programmatically determined. In HTML that means adding a lang attribute to the element that wraps any text written in a language different from the page's default — for example <span lang=\"fr\"> around a French quotation inside an English article. Four things are excepted: proper names, technical terms, words of indeterminate language, and words or phrases that have become part of the vernacular of the surrounding text. It is a Level AA criterion introduced in WCAG 2.0 and unchanged in 2.1 and 2.2.",
  },
  {
    q: "How is 3.1.2 different from 3.1.1 Language of Page?",
    a: "3.1.1 (Level A) sets the one default language for the whole document, via lang on the <html> element. 3.1.2 (Level AA) covers the exceptions inside the page: any passage or phrase written in a different language from that default must carry its own lang attribute. Think of 3.1.1 as the page-wide rule and 3.1.2 as the per-passage overrides. You need both: a correctly declared page language, and correctly marked switches wherever the language changes.",
  },
  {
    q: "Why do inline language changes matter for screen readers?",
    a: "Screen readers pick a speech synthesizer and pronunciation rules based on the declared language. If a German sentence sits inside an English page with no lang=\"de\" marker, the screen reader reads the German words using English phonetics, which typically renders them unintelligible. With the marker, the screen reader switches voices mid-sentence and pronounces the passage correctly. The declaration also helps braille translation software select the right contraction tables and helps browsers choose appropriate fonts and dictionaries.",
  },
  {
    q: "What are the exceptions — which words do NOT need a lang attribute?",
    a: "Four categories are excepted by the normative text. Proper names: 'München' or 'François Truffaut' in an English sentence need no markup. Technical terms: terms of art like 'Homo sapiens' or 'habeas corpus' that are conventionally used unchanged. Words of indeterminate language: made-up or ambiguous words that belong to no identifiable language. And loanwords or phrases that have become part of the vernacular of the surrounding language: 'rendezvous', 'et cetera', 'ad hoc' in English are simply English now. If a word appears in a dictionary of the surrounding language, it does not need its own lang.",
  },
  {
    q: "Does 3.1.2 apply to attributes and hidden text too, or only visible passages?",
    a: "It applies to content that is read by assistive technology, which includes more than what is visible: alt text, aria-label values, visually hidden text, and title attributes are all announced by screen readers. The lang attribute applies to an element and everything in it, including its own attribute values — so a French aria-label on an element inside otherwise-English content needs that element (or a wrapper) to carry lang=\"fr\". In practice, keep accessible names in the language of the surrounding content wherever possible; it avoids the problem entirely.",
  },
  {
    q: "Can automated tools test 3.1.2?",
    a: "Only partially. Automated checkers can flag syntactically invalid lang values (like lang=\"english\") and some can run language detection to guess where a passage differs from the declared page language — but detection is unreliable for short phrases, names, and technical vocabulary. What no tool can fully judge is whether an unmarked phrase is a genuine language change or falls under the proper-name/vernacular exceptions. Reliable testing means reading the content, spotting language switches, and listening to them with a screen reader.",
  },
]

export default function WCAG312Page() {
  return (
    <>
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "WCAG Success Criteria", url: "https://accessibility.build/wcag" },
          {
            name: "3.1.2 Language of Parts",
            url: "https://accessibility.build/wcag/3-1-2",
          },
        ]}
      />

      <ArticleStructuredData
        headline="WCAG 3.1.2 Language of Parts: The Complete Guide to Inline lang Attributes"
        description="The definitive guide to WCAG 3.1.2 Language of Parts: when a passage in another language needs its own lang attribute, the exceptions for proper names and loanwords, code samples, and testing methods."
        author={{
          name: "Accessibility.build Team",
          url: "https://accessibility.build/about",
        }}
        publisher={{
          name: "Accessibility.build",
          logo: "https://accessibility.build/android-chrome-512x512.png",
        }}
        datePublished="2026-07-09"
        dateModified="2026-07-09"
        image="https://accessibility.build/api/og?title=WCAG%203.1.2%20Language%20of%20Parts&section=WCAG"
        url="https://accessibility.build/wcag/3-1-2"
        wordCount={2800}
        keywords={[
          "WCAG 3.1.2",
          "Language of Parts",
          "inline lang attribute",
          "foreign language accessibility",
          "screen reader pronunciation",
          "Level AA",
        ]}
      />

      {/* FAQ structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
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
                    3.1.2 Language of Parts
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
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                Level AA
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Principle 3: Understandable
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                Guideline 3.1 Readable
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
              WCAG 3.1.2: Language of Parts
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              A French quotation read aloud with English pronunciation rules is
              noise, not language. When a passage or phrase switches to a
              different language from the rest of the page,{" "}
              <strong className="text-slate-900 dark:text-white">
                that passage must declare its own language in code
              </strong>{" "}
              — in HTML, a <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-lg">lang</code>{" "}
              attribute on the element that wraps it — so screen readers can
              switch voices and pronounce it correctly.
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
              The human language of each passage or phrase in the content can be
              programmatically determined except for proper names, technical
              terms, words of indeterminate language, and words or phrases that
              have become part of the vernacular of the immediately surrounding
              text.
            </blockquote>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4 text-sm">
              The rule is broad — <em>each passage or phrase</em> — but the four
              built-in exceptions do a lot of work: proper names, technical
              terms, words of indeterminate language, and loanwords absorbed
              into the surrounding language never need their own markup.
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
                <a className="hover:underline" href="#why">
                  Why language markers matter
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#exceptions">
                  The four exceptions
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#examples">
                  Pass and fail examples
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#code">
                  Code examples
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

          {/* Why */}
          <section aria-labelledby="why" className="mb-12">
            <h2
              id="why"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Why language markers matter
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Screen readers do not detect language by reading the words — they
              trust the markup. The page-level{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">lang</code>{" "}
              attribute (covered by{" "}
              <Link
                href="/wcag/3-1-1"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                3.1.1 Language of Page
              </Link>
              ) selects the default voice and pronunciation rules. When the text
              switches language and the markup says nothing, the screen reader
              keeps applying the default rules — so{" "}
              <em>&ldquo;Guten Morgen, wie geht es Ihnen?&rdquo;</em> comes out
              as a garbled string of English-sounding syllables that even a
              fluent German speaker cannot recognize.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              With a correct inline marker, the experience is seamless: the
              synthesizer switches to a German voice for the quoted sentence and
              back again afterwards. The same declaration helps braille devices
              select the right contraction tables for each passage, lets
              browsers and translation tools segment the content correctly, and
              helps user agents choose fonts appropriate to the script.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              The people who benefit most are screen reader users who read
              multilingual content — quotations, glossaries, language-learning
              materials, bilingual legal notices, navigation to translated
              versions of a site — and users of braille displays and
              text-to-speech tools in any of those contexts.
            </p>
          </section>

          {/* Exceptions */}
          <section aria-labelledby="exceptions" className="mb-12">
            <h2
              id="exceptions"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              The four exceptions
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              Not every foreign-looking word needs markup. The criterion itself
              excludes four categories — mark up genuine passages and phrases in
              another language, and leave these alone:
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  t: "Proper names",
                  d: "People and place names keep their native form everywhere: 'François Truffaut', 'München', 'São Paulo' in an English sentence need no lang attribute.",
                },
                {
                  t: "Technical terms",
                  d: "Terms of art used unchanged across languages: 'Homo sapiens', 'habeas corpus', 'in vitro'. They are read as part of the surrounding text.",
                },
                {
                  t: "Words of indeterminate language",
                  d: "Coined product names, nonsense words, or strings that belong to no identifiable human language have no language to declare.",
                },
                {
                  t: "Vernacular loanwords",
                  d: "Words absorbed into the surrounding language — 'rendezvous', 'ad hoc', 'et cetera', 'kindergarten' in English. If it is in the dictionary of the surrounding language, it needs no markup.",
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
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-6">
              The practical test: has the word or phrase become part of the
              surrounding language, or is the author deliberately switching
              languages? &ldquo;She said <em>c&rsquo;est la vie</em> and moved
              on&rdquo; is borderline vernacular; a full French sentence quoted
              in an article is unambiguously a language change and must be
              marked.
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
            <div className="space-y-4">
              {[
                {
                  pass: true,
                  t: "French quotation wrapped with lang=\"fr\"",
                  d: "An English article quotes Voltaire in French inside <blockquote lang=\"fr\">. Screen readers switch to a French voice for the quote. Passes.",
                },
                {
                  pass: true,
                  t: "Language switcher with per-link lang",
                  d: "A navigation offering 'Deutsch', 'Français', and 'Español' marks each link with its own lang attribute, so each language name is pronounced in that language. Passes.",
                },
                {
                  pass: true,
                  t: "Proper names left unmarked",
                  d: "An English biography mentions 'Ludwig van Beethoven' and 'Wien' without markup. Proper names are excepted. Passes.",
                },
                {
                  pass: false,
                  t: "German paragraph with no lang attribute",
                  d: "A bilingual product page alternates English and German paragraphs but declares only lang=\"en\" on <html>. The German paragraphs are read with English pronunciation. Fails.",
                },
                {
                  pass: false,
                  t: "lang on the wrong element",
                  d: "A Spanish testimonial is wrapped in a div, but lang=\"es\" was placed on a sibling element rather than the one containing the text. The passage's language cannot be programmatically determined. Fails.",
                },
              ].map((ex) => (
                <div
                  key={ex.t}
                  className={`rounded-xl border p-5 ${
                    ex.pass
                      ? "border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/20"
                      : "border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20"
                  }`}
                >
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1 flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className={ex.pass ? "text-emerald-600" : "text-rose-500"}
                    >
                      {ex.pass ? "✓" : "✗"}
                    </span>
                    {ex.t}
                    <span className="sr-only">
                      {ex.pass ? "(passes)" : "(fails)"}
                    </span>
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                    {ex.d}
                  </p>
                </div>
              ))}
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
              Inline phrases and block quotations
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Put the <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">lang</code>{" "}
              attribute on the element that wraps exactly the foreign-language
              text — a <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">&lt;span&gt;</code>{" "}
              for an inline phrase, a{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">&lt;blockquote&gt;</code>{" "}
              or <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">&lt;p&gt;</code>{" "}
              for a block. Use valid BCP 47 codes.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- ✗ Language changes with no markup: read with English rules -->
<p>As the proverb goes, Übung macht den Meister.</p>
<blockquote>
  <p>Rien ne sert de courir; il faut partir à point.</p>
</blockquote>

<!-- ✓ Each passage declares its own language -->
<p>
  As the proverb goes,
  <span lang="de">Übung macht den Meister</span>.
</p>
<blockquote lang="fr">
  <p>Rien ne sert de courir; il faut partir à point.</p>
  <footer>— Jean de La Fontaine</footer>
</blockquote>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              A language switcher, done right
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Each language name is written in its own language, so each link
              gets its own{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">lang</code>
              . Adding{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">hreflang</code>{" "}
              describes the destination document, but only{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">lang</code>{" "}
              affects how the link text itself is pronounced.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- ✗ 'Deutsch' and 'Français' read with English phonetics -->
<nav aria-label="Language">
  <a href="/de/">Deutsch</a>
  <a href="/fr/">Français</a>
  <a href="/es/">Español</a>
</nav>

<!-- ✓ Each language name pronounced in its own language -->
<nav aria-label="Language">
  <a href="/de/" lang="de" hreflang="de">Deutsch</a>
  <a href="/fr/" lang="fr" hreflang="fr">Français</a>
  <a href="/es/" lang="es" hreflang="es">Español</a>
</nav>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Nested languages inherit — and override
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">lang</code>{" "}
              cascades: everything inside an element inherits its language until
              a descendant overrides it. That makes mixed-language structures
              straightforward.
            </p>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<html lang="en">
  <body>
    <p>The review of the German edition was glowing:</p>
    <blockquote lang="de">
      <p>
        Ein Meisterwerk — obwohl der Titel
        <span lang="en">"The Silent Patient"</span>
        unübersetzt blieb.
      </p>
    </blockquote>
    <!-- English page → German quote → English title inside it.
         Each level is announced with the correct voice. -->
  </body>
</html>`}</code>
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
                "Quoting a full sentence or paragraph in another language with no lang attribute on any wrapping element — the single most common failure.",
                "Language-switcher links ('Deutsch', 'Français', '日本語') without per-link lang attributes, so every language name is mangled by the default voice.",
                "Invalid or made-up language codes: lang=\"gr\" for German (it should be de; gr is not Greek either — that is el), lang=\"english\", or an empty lang=\"\" on a passage.",
                "Putting the lang attribute on the wrong element — a parent that also contains default-language text, or a sibling — instead of the element wrapping exactly the foreign passage.",
                "Foreign-language accessible names: an aria-label or alt text in another language on an element that does not carry a matching lang attribute.",
                "Over-marking: wrapping proper names, established loanwords, or technical terms in lang spans. This is not a conformance failure but causes needless voice-switching that makes listening worse.",
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
              How to test for 3.1.2
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "Read the page and list every language switch",
                  d: "Scan the content for passages, quotations, phrases, testimonials, or UI strings that are not in the page's default language. Include text exposed to assistive technology: alt text, aria-labels, and visually hidden text.",
                },
                {
                  t: "Inspect the markup for each switch",
                  d: "For every passage on the list, use the browser DevTools to confirm a valid BCP 47 lang attribute sits on the element wrapping that passage (or on an ancestor whose content is entirely in that language).",
                },
                {
                  t: "Apply the four exceptions",
                  d: "Strike proper names, technical terms, indeterminate words, and vernacular loanwords from your list — those need no markup. What remains must all be marked.",
                },
                {
                  t: "Listen with a screen reader",
                  d: "Read the page with NVDA, JAWS, or VoiceOver with automatic language switching enabled. A correctly marked passage is announced in the right voice; a garbled foreign passage in the default voice means a missing or wrong lang attribute.",
                },
                {
                  t: "Validate the codes",
                  d: "Check that every lang value is a well-formed BCP 47 tag — 'de', 'fr-CA', 'zh-Hans' — not a country code or a language name. An HTML validator or axe will catch malformed values, but not a valid code on the wrong passage.",
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
              Because the judgment calls — is this vernacular? is this a proper
              name? — are human ones, treat automated results as a starting
              point and verify by listening. Then work through the full{" "}
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

          <CriterionLinks number="3.1.2" />
        </article>

        {/* Related content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <RelatedContent
            content="language of parts inline lang attribute foreign language passage screen reader pronunciation BCP 47 language tags multilingual content language switcher proper names loanwords readable WCAG 3.1.2 Level AA"
            maxItems={6}
          />
        </section>
      </div>
    </>
  )
}
