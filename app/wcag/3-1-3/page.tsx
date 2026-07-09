import type { Metadata } from "next"
import Link from "next/link"
import WCAGSEOEnhancements from "@/components/wcag/seo-enhancements"
import WCAGBreadcrumb from "@/components/wcag/breadcrumb"
import { CriterionLinks } from "@/components/wcag/criterion-links"
import { RelatedContent } from "@/components/seo/related-content"

export const metadata: Metadata = {
  title: "WCAG 3.1.3 Unusual Words — Jargon & Idioms Guide",
  description:
    "WCAG 3.1.3 requires a mechanism for finding definitions of jargon, idioms, and words used in a restricted way. Glossaries, inline definitions, and how to test.",
  keywords: [
    "WCAG 3.1.3",
    "Unusual Words",
    "jargon accessibility",
    "idioms accessibility",
    "glossary accessibility",
    "definition list dfn",
    "plain language",
    "3.1.3 test",
    "Level AAA",
    "WCAG 2.2",
    "readable",
  ],
  alternates: {
    canonical: "/wcag/3-1-3",
  },
  openGraph: {
    title: "WCAG 3.1.3 Unusual Words — Jargon & Idioms Guide",
    description:
      "Readers need a way to find what your jargon, idioms, and technical terms mean. Mechanisms that satisfy 3.1.3 — inline definitions, glossaries, dfn — with examples.",
    url: "/wcag/3-1-3",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: "/api/og?title=WCAG%203.1.3%20Unusual%20Words&section=WCAG",
        width: 1200,
        height: 630,
        alt: "WCAG 3.1.3 Unusual Words guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WCAG 3.1.3 Unusual Words — Jargon & Idioms Guide",
    description:
      "A mechanism must be available to identify definitions of words used in an unusual or restricted way. Glossaries, inline definitions, dfn markup, and testing.",
    images: ["/api/og?title=WCAG%203.1.3%20Unusual%20Words&section=WCAG"],
  },
}

const faqs = [
  {
    q: "What does WCAG 3.1.3 Unusual Words require?",
    a: "It requires that a mechanism is available for identifying specific definitions of words or phrases used in an unusual or restricted way, including idioms and jargon. If your content uses a term most readers will not know — or uses a familiar word in a specialized sense — there must be a way for the reader to find out what it means: an inline definition, a link to a glossary entry, a definition list, or similar. It is a Level AAA criterion under Guideline 3.1 Readable, introduced in WCAG 2.0.",
  },
  {
    q: "What counts as a word 'used in an unusual or restricted way'?",
    a: "Three overlapping categories. Jargon: technical vocabulary specific to a field — 'hydraulic fracturing', 'success criterion', 'stochastic gradient descent'. Idioms: phrases whose meaning cannot be derived from the individual words — 'spilling the beans' has nothing to do with beans, which is brutal for literal readers and machine translation. Restricted senses: ordinary words carrying a precise, non-obvious meaning in context — 'gull' meaning a wing panel in aircraft documentation, or 'normative' in WCAG itself. If a general reader would misread or draw a blank, it needs a definition mechanism.",
  },
  {
    q: "What mechanisms satisfy 3.1.3?",
    a: "Any that lets the reader reliably get the specific definition. Common conforming approaches: defining the term inline the first time it is used ('anchoring bias — the tendency to over-rely on the first number seen — affects…'); linking the term to a glossary entry on the same or another page; a description list (dl/dt/dd) glossary at the end of the document; the dfn element marking the defining instance; or a footnote-style definition the term links to. The mechanism must give the meaning as used in your content — pointing readers at a general web search does not qualify.",
  },
  {
    q: "Is the title attribute or an abbr tooltip enough for 3.1.3?",
    a: "On its own, no. The title attribute only reveals its content on mouse hover — keyboard users, touch users, and many screen reader configurations never see it. Definitions should be available to every user: visible inline text, a real link to a glossary, or a disclosure the user can activate by any input method. Tooltips can supplement a robust mechanism, but should never be the only path to the definition.",
  },
  {
    q: "How is 3.1.3 different from 3.1.4 Abbreviations and 3.1.5 Reading Level?",
    a: "All three live under Guideline 3.1 Readable and target different obstacles. 3.1.3 covers the meaning of unusual words, idioms, and jargon. 3.1.4 covers the expanded form of abbreviations and acronyms — 'WCAG' needs expanding; 'accessibility conformance' needs defining. 3.1.5 Reading Level takes the widest view: when text demands more than lower-secondary reading ability, supplemental content or a simpler version should exist. A well-run content practice addresses them together: write plainly (3.1.5), expand abbreviations (3.1.4), and define what must stay technical (3.1.3).",
  },
  {
    q: "Do I have to define every technical term on every page?",
    a: "The obligation is that a mechanism is available for terms used in an unusual or restricted way — not that every page reinvents a dictionary. A sitewide glossary that unusual terms link to satisfies the criterion across the whole site, and defining a term on first use within a document is a long-standing editorial convention that conforms. Judgment applies: terms your specific audience certainly knows ('HTML' on a developer blog) sit differently from the same terms on a general-audience page. When in doubt, link it — the cost is trivial and the benefit is universal.",
  },
]

export default function WCAG313Page() {
  return (
    <>
      <WCAGSEOEnhancements
        title="WCAG 3.1.3: Unusual Words"
        description="A mechanism is available for identifying specific definitions of words or phrases used in an unusual or restricted way, including idioms and jargon."
        criteria="3.1.3"
        level="AAA"
        principle="Understandable"
        guideline="3.1 Readable"
        url="https://accessibility.build/wcag/3-1-3"
        category="Readable"
        hasInteractiveDemo={false}
        relatedCriteria={["3.1.4", "3.1.5", "3.1.1"]}
      />

      <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <WCAGBreadcrumb items={[]} current="3.1.3 Unusual Words" />

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
                Define your jargon
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
              WCAG 3.1.3: Unusual Words
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              Every field has words outsiders cannot parse — and every language
              has idioms that mean nothing when read literally. This criterion
              asks that{" "}
              <strong className="text-slate-900 dark:text-white">
                a mechanism exists for readers to find the specific definition
              </strong>{" "}
              of any word or phrase you use in an unusual or restricted way.
              Inline definitions, glossary links, description lists — pick one,
              and your jargon stops being a locked door.
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
              A mechanism is available for identifying specific definitions of
              words or phrases used in an unusual or restricted way, including
              idioms and jargon.
            </blockquote>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4 text-sm">
              &ldquo;Specific definitions&rdquo; means the meaning{" "}
              <em>as used in your content</em> — a word with several dictionary
              senses needs the applicable one identified. The mechanism can
              live in the page (inline definitions, a glossary section) or be
              reached from it (a linked glossary), but it must actually resolve
              the term for the reader.
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
                  Who this helps and why
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#scope">
                  What needs a definition
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
                <a className="hover:underline" href="#related">
                  The Readable guideline family
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
              Who this helps and why
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Undefined jargon is a comprehension cliff: the reader either
              already knows the term or falls out of the text entirely. For
              several groups, that cliff appears far more often than authors
              realize.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  t: "People with cognitive disabilities",
                  d: "Unfamiliar terms and figurative language impose heavy decoding load. An immediate definition keeps the reader in the text instead of sending them away to search.",
                },
                {
                  t: "Autistic readers and literal processors",
                  d: "Idioms — 'raining cats and dogs', 'break a leg' — read as false or bizarre statements when interpreted literally. A definition mechanism disambiguates them.",
                },
                {
                  t: "Non-native speakers",
                  d: "Jargon and idioms rarely survive translation or dictionary lookup. 'Piece of cake' translated word-for-word means dessert, not ease.",
                },
                {
                  t: "Everyone outside your field",
                  d: "Legal, medical, financial, and technical content is routinely read by people who must act on it without sharing its vocabulary — patients, defendants, customers.",
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

          {/* Scope */}
          <section aria-labelledby="scope" className="mb-12">
            <h2
              id="scope"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              What needs a definition
            </h2>
            <div className="space-y-4 mb-4">
              {[
                {
                  t: "Jargon",
                  d: "Field-specific vocabulary: 'success criterion', 'amortization', 'contraindication', 'idempotent'. Fine to use — with a mechanism to resolve it for readers outside the field.",
                },
                {
                  t: "Idioms",
                  d: "Fixed phrases whose meaning is not the sum of their words: 'spill the beans', 'under the weather', 'kick the bucket'. Unlike jargon, they cannot be worked out from context by literal readers.",
                },
                {
                  t: "Restricted senses of common words",
                  d: "Ordinary words carrying a precise technical meaning in your text: 'normative' in standards, 'stroke' in swimming instruction vs. medicine, 'set' in mathematics. The reader knows the word — just not your meaning of it.",
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
              The first question is always editorial: can the unusual word be
              replaced with a plain one? If yes, replace it and the criterion
              is moot. When precision demands the technical term — often the
              case in legal, medical, and standards content — keep it and add
              the mechanism.
            </p>
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
              Define on first use with the dfn element
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              The simplest conforming mechanism is prose: define the term the
              first time it appears, and mark the defining instance with{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                &lt;dfn&gt;
              </code>
              .
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- ✗ Jargon dropped on the reader with no way out -->
<p>Our API endpoints are idempotent, so retries are safe.</p>

<!-- ✓ Defined inline at first use, marked with <dfn> -->
<p>
  Our API endpoints are <dfn id="def-idempotent">idempotent</dfn>
  — calling them multiple times has the same effect as calling
  them once — so retries are safe.
</p>

<!-- Later mentions can link back to the definition -->
<p>Because deletes are <a href="#def-idempotent">idempotent</a>, …</p>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Link terms to a glossary
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              For sites that reuse a technical vocabulary, one glossary page
              serves every document. Link each unusual term to its entry —
              exactly how the WCAG specification itself handles its defined
              terms.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- ✓ In the document -->
<p>
  Levels are cumulative: claiming
  <a href="/glossary#conformance">conformance</a> at AA requires
  meeting every Level A and AA
  <a href="/glossary#success-criterion">success criterion</a>.
</p>

<!-- ✓ On /glossary — a description list of definitions -->
<dl>
  <dt id="conformance">Conformance</dt>
  <dd>Satisfying all requirements of a standard at a claimed level.</dd>

  <dt id="success-criterion">Success criterion</dt>
  <dd>A single testable statement in WCAG that content passes or fails.</dd>
</dl>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Accessible disclosure, not a hover-only tooltip
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              If you want the definition available in place without cluttering
              the prose, use a control every input method can operate — not
              the{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                title
              </code>{" "}
              attribute.
            </p>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- ✗ Hover-only: invisible to keyboard and touch -->
<span title="Money paid regularly at a rate">annuity</span>

<!-- ✓ A disclosure any user can activate -->
<p>
  Your payout is structured as an annuity.
  <details class="inline-def">
    <summary>What is an annuity?</summary>
    A fixed sum paid to you at regular intervals,
    typically yearly, for a set period.
  </details>
</p>`}</code>
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
                "Technical, legal, or medical terms used with no definition, glossary, or link anywhere on the site.",
                "Idioms and figurative phrases in instructional or transactional content, with no literal explanation available.",
                "Definitions delivered only via the title attribute or hover tooltips, unreachable by keyboard and touch users.",
                "A glossary that exists but is not linked from the content that uses the terms, leaving readers unaware of it.",
                "Glossary entries that define a different sense of the word than the one the content actually uses.",
                "Ambiguous common words used in a restricted sense with nothing marking that a special meaning is intended.",
                "Internal project names and team shorthand ('the V2 flow', 'the hub') leaking into public-facing content undefined.",
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
              How to test for 3.1.3
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "Harvest the unusual terms",
                  d: "Read the page as a general reader — or hand it to one. Highlight every piece of jargon, every idiom, and every ordinary word that carries a special meaning in this context. Subject-matter experts are the worst judges of this; fresh eyes find the terms instantly.",
                },
                {
                  t: "Check a mechanism exists for each",
                  d: "For every highlighted term, verify one of: an inline definition at or near first use, a link to a glossary entry, a description-list glossary in the document, or an operable disclosure. 'The reader can search the web' is not a mechanism.",
                },
                {
                  t: "Verify the definition matches the usage",
                  d: "Open each definition and confirm it explains the sense actually used in the content. A glossary defining 'stroke' medically does not help a swimming tutorial.",
                },
                {
                  t: "Test the mechanism with keyboard and touch",
                  d: "Activate every definition affordance without a mouse: tab to glossary links, open disclosures with Enter/Space, confirm nothing depends on hover alone. Then repeat with a screen reader to confirm the definition text is announced.",
                },
                {
                  t: "Confirm discoverability",
                  d: "A reader who hits an unknown term must be able to find the mechanism: the term itself is linked or marked, or the page clearly points to its glossary. A definition no one can find fails in practice regardless of markup.",
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
          </section>

          {/* Related */}
          <section aria-labelledby="related" className="mb-12">
            <h2
              id="related"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              The Readable guideline family
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Guideline 3.1 Readable attacks comprehension barriers in layers.{" "}
              <Link
                href="/wcag/3-1-1"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                3.1.1 Language of Page
              </Link>{" "}
              (A) and 3.1.2 Language of Parts (AA) make the language itself
              machine-readable so text is pronounced correctly. Then the AAA
              trio deepens understanding: 3.1.3 defines unusual words,{" "}
              <Link
                href="/wcag/3-1-4"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                3.1.4 Abbreviations
              </Link>{" "}
              expands shortened forms, and 3.1.5 Reading Level asks for
              supplemental content when text is unavoidably complex.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              The division of labor between the two closest siblings:
              &ldquo;WCAG&rdquo; is an abbreviation — expanding it to
              &ldquo;Web Content Accessibility Guidelines&rdquo; is a 3.1.4
              concern. &ldquo;Success criterion&rdquo; is jargon — defining
              what it means is a 3.1.3 concern. Most glossaries serve both
              criteria at once, which is why building one is the
              highest-leverage single fix for this guideline.
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

          <CriterionLinks number="3.1.3" />
        </article>

        {/* Related content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <RelatedContent
            content="unusual words jargon idioms definitions glossary dfn element description list plain language reading level abbreviations readable understandable WCAG 3.1.3 Level AAA"
            maxItems={6}
          />
        </section>
      </div>
    </>
  )
}
