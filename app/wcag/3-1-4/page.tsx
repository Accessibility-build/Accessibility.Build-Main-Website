import type { Metadata } from "next"
import Link from "next/link"
import WCAGSEOEnhancements from "@/components/wcag/seo-enhancements"
import WCAGBreadcrumb from "@/components/wcag/breadcrumb"
import { CriterionLinks } from "@/components/wcag/criterion-links"
import { RelatedContent } from "@/components/seo/related-content"

export const metadata: Metadata = {
  title: "WCAG 3.1.4 Abbreviations — The abbr Element Guide",
  description:
    "WCAG 3.1.4 requires a mechanism for the expanded form of abbreviations. First-use expansion, the abbr element, glossaries — with code examples and testing steps.",
  keywords: [
    "WCAG 3.1.4",
    "Abbreviations",
    "abbr element",
    "acronym accessibility",
    "expanded form abbreviation",
    "first use expansion",
    "initialism accessibility",
    "3.1.4 test",
    "Level AAA",
    "WCAG 2.2",
    "readable",
  ],
  alternates: {
    canonical: "/wcag/3-1-4",
  },
  openGraph: {
    title: "WCAG 3.1.4 Abbreviations — The abbr Element Guide",
    description:
      "Every abbreviation needs a way to find its expanded form or meaning. First-use expansion, <abbr>, and glossaries — what conforms, what doesn't, and how to test.",
    url: "/wcag/3-1-4",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: "/api/og?title=WCAG%203.1.4%20Abbreviations&section=WCAG",
        width: 1200,
        height: 630,
        alt: "WCAG 3.1.4 Abbreviations guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WCAG 3.1.4 Abbreviations — The abbr Element Guide",
    description:
      "A mechanism for identifying the expanded form of abbreviations must be available. First-use expansion, the abbr element, glossaries, and how to test 3.1.4.",
    images: ["/api/og?title=WCAG%203.1.4%20Abbreviations&section=WCAG"],
  },
}

const faqs = [
  {
    q: "What does WCAG 3.1.4 Abbreviations require?",
    a: "It requires that a mechanism for identifying the expanded form or meaning of abbreviations is available. Whenever content uses a shortened form — an acronym like NASA, an initialism like HTML, or a truncation like 'Dr.' — the reader must have a way to discover what it stands for or what it means: an expansion at first use, an <abbr> element, a link to a glossary, or a definition list. It is a Level AAA success criterion under Guideline 3.1 Readable, introduced in WCAG 2.0.",
  },
  {
    q: "What counts as an abbreviation under WCAG?",
    a: "WCAG defines an abbreviation as a shortened form of a word, phrase, or name where the abbreviation has not become part of the language. That includes initialisms (HTML, GDP), acronyms (NASA, WYSIWYG), and truncations (etc., approx., Dr.). It excludes shortened forms that are now ordinary words in their own right — 'laser' and 'scuba' began as acronyms but are dictionary words today — and names where the letters are the actual name rather than a shortening the organization still uses in full.",
  },
  {
    q: "Is the abbr element with a title attribute enough to pass 3.1.4?",
    a: "It is a recognized W3C technique (H28), so it can conform — but it is the weakest mechanism on its own. The title attribute's expansion is only exposed on mouse hover in most browsers: keyboard users can't trigger it, touch users can't hover, and screen readers vary in whether they announce it (many require a setting to be enabled). Treat <abbr title=\"…\"> as a useful semantic supplement, and pair it with a robust primary mechanism: expanding the abbreviation in text at first use, or linking it to a glossary entry.",
  },
  {
    q: "Does expanding an abbreviation the first time it appears satisfy the criterion?",
    a: "Yes — providing the expanded form immediately before or after the first occurrence ('Web Content Accessibility Guidelines (WCAG)') is the classic conforming technique (G97), and it is also just good writing. Two caveats from the understanding guidance: the abbreviation should be used consistently after that, and in contexts where users may land mid-document or content is re-ordered (search results, syndicated fragments), a glossary or <abbr> on later instances makes the expansion reachable from anywhere, not only from the top of the page.",
  },
  {
    q: "Do I need to expand extremely common abbreviations like HTML or USA?",
    a: "The criterion has no popularity exception — the exemption is only for shortened forms that have become words in the language (laser, scuba) or letters that are the actual name. In practice, audience matters for risk judgment: 'HTML' unexpanded on a developer-tools site will trouble no one, while the same letters on a beginners' course page deserve expansion. Since the cost of a first-use expansion or glossary link is near zero, the safe pattern is to expand everything once and let familiar readers skim past it.",
  },
  {
    q: "How does 3.1.4 relate to 3.1.3 Unusual Words?",
    a: "They are adjacent AAA criteria under Guideline 3.1 Readable, splitting the vocabulary problem. 3.1.4 covers shortened forms: the reader needs the expansion ('SLA' → 'service level agreement'). 3.1.3 covers meaning: the reader needs a definition of jargon, idioms, and words used in restricted senses. Note they often chain: expanding 'SLA' to 'service level agreement' satisfies 3.1.4, but if the reader still doesn't know what a service level agreement is, a 3.1.3-style definition finishes the job. A single glossary that gives expansion plus definition serves both.",
  },
]

export default function WCAG314Page() {
  return (
    <>
      <WCAGSEOEnhancements
        title="WCAG 3.1.4: Abbreviations"
        description="A mechanism for identifying the expanded form or meaning of abbreviations is available."
        criteria="3.1.4"
        level="AAA"
        principle="Understandable"
        guideline="3.1 Readable"
        url="https://accessibility.build/wcag/3-1-4"
        category="Readable"
        hasInteractiveDemo={false}
        relatedCriteria={["3.1.3", "3.1.5", "3.1.1"]}
      />

      <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <WCAGBreadcrumb items={[]} current="3.1.4 Abbreviations" />

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
                Expand your acronyms
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
              WCAG 3.1.4: Abbreviations
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              Every industry writes in shorthand — and every reader outside it
              pays the price. This criterion asks that{" "}
              <strong className="text-slate-900 dark:text-white">
                a mechanism be available to find the expanded form or meaning
                of every abbreviation
              </strong>
              : spell it out on first use, mark it up with{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-base">
                &lt;abbr&gt;
              </code>
              , or link it to a glossary. &ldquo;SC 1.4.3 re AA conformance
              per EN 301 549&rdquo; should never be a sentence a reader has to
              decode alone.
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
              A mechanism for identifying the expanded form or meaning of
              abbreviations is available.
            </blockquote>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4 text-sm">
              &ldquo;Abbreviation&rdquo; is a defined term: a shortened form of
              a word, phrase, or name{" "}
              <em>where the shortened form has not become part of the
              language</em>. Acronyms, initialisms, and truncations are in
              scope; words like &ldquo;laser&rdquo; that outgrew their origins
              are not. &ldquo;Expanded form <em>or meaning</em>&rdquo; matters
              too — for something like &ldquo;e.g.&rdquo;, the useful
              mechanism gives the meaning (&ldquo;for example&rdquo;), not the
              Latin expansion.
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
                <a className="hover:underline" href="#mechanisms">
                  Conforming mechanisms
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
                  Relationship to 3.1.3 and 3.1.5
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
              An unexpanded abbreviation is a small locked box in the middle of
              a sentence. Some readers can force it open from context; many
              cannot, and for a few groups the box is effectively welded shut.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  t: "People with cognitive disabilities",
                  d: "Decoding an abbreviation requires recalling or reconstructing its expansion — a working-memory task that an inline expansion removes entirely.",
                },
                {
                  t: "Screen reader listeners",
                  d: "Synthesizers guess: some spell 'NASA' letter by letter, others pronounce 'SC' as 'sc'. Hearing an expansion once anchors every later occurrence.",
                },
                {
                  t: "Non-native speakers",
                  d: "Abbreviations are language- and culture-bound. 'IRS', 'NHS', and 'GEZ' each mean nothing outside their country; the expansion travels, the initials do not.",
                },
                {
                  t: "Newcomers to any field",
                  d: "Onboarding docs, medical results, legal notices, government forms — the reader who most needs the content is precisely the one who does not know its shorthand yet.",
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

          {/* Mechanisms */}
          <section aria-labelledby="mechanisms" className="mb-12">
            <h2
              id="mechanisms"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Conforming mechanisms, strongest first
            </h2>
            <div className="space-y-4 mb-4">
              {[
                {
                  t: "1. Expand at first use (G97)",
                  d: "Write the full form with the abbreviation in parentheses the first time it appears: 'Web Content Accessibility Guidelines (WCAG)'. Visible to every user, in every browser, with every input method. This should be your default.",
                },
                {
                  t: "2. Link to a glossary or abbreviation list (G55/G62)",
                  d: "Each abbreviation links to its entry in a glossary on the same page or a dedicated page. Scales across a whole site, works for readers landing mid-document, and doubles as the 3.1.3 definitions mechanism.",
                },
                {
                  t: "3. The abbr element (H28)",
                  d: "<abbr title=\"…\"> attaches the expansion in markup. Semantically correct and a recognized technique — but title tooltips are hover-only and inconsistently announced by screen readers, so use it to supplement the first two mechanisms rather than replace them.",
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
              Whichever you choose, consistency is part of the mechanism: after
              expanding &ldquo;service level agreement (SLA)&rdquo;, keep
              writing &ldquo;SLA&rdquo; — do not alternate between the
              abbreviation, the full form, and a second abbreviation for the
              same thing.
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
              First-use expansion, then abbr for later mentions
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              The belt-and-braces pattern: visible expansion once, semantic
              markup afterwards so the expansion stays attached everywhere.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- ✗ Shorthand with no way in -->
<p>Your SLA guarantees 99.9% uptime. SLA credits apply below that.</p>

<!-- ✓ Expanded at first use; <abbr> carries it afterwards -->
<p>
  Your service level agreement (<abbr>SLA</abbr>) guarantees
  99.9% uptime.
  <abbr title="service level agreement">SLA</abbr> credits
  apply below that.
</p>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Link abbreviations to a glossary
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              For document sets full of shorthand — specs, legal, medical — a
              linked abbreviation list is reachable from any entry point, not
              just the first paragraph.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- ✓ In the running text -->
<p>
  Public-sector sites must meet
  <a href="/glossary#en301549"><abbr>EN 301 549</abbr></a>
  via <a href="/glossary#wcag"><abbr>WCAG</abbr></a> 2.2 AA.
</p>

<!-- ✓ On the glossary page -->
<dl>
  <dt id="wcag">WCAG</dt>
  <dd>Web Content Accessibility Guidelines — the W3C standard
      for accessible web content.</dd>

  <dt id="en301549">EN 301 549</dt>
  <dd>The European standard for ICT accessibility that
      incorporates WCAG for web content.</dd>
</dl>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Give the meaning when the expansion doesn&rsquo;t help
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              The criterion says expanded form <em>or meaning</em>. For Latin
              truncations and lexicalized forms, the meaning is the useful
              thing — or skip the abbreviation entirely.
            </p>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- ✓ Meaning, not the unhelpful Latin expansion -->
<p>Bring photo ID (<abbr title="for example">e.g.</abbr>,
   a passport or driving licence).</p>

<!-- ✓ Better still for plain language: no abbreviation at all -->
<p>Bring photo ID — for example, a passport or driving licence.</p>`}</code>
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
                "Abbreviations used throughout a page with no expansion, no glossary, and no abbr markup anywhere.",
                "Relying solely on <abbr title> tooltips — hover-only, unreachable by keyboard and touch, inconsistently announced by screen readers.",
                "Expanding on first use in a long document, then assuming readers who arrive mid-page via search or a fragment link saw it.",
                "Internal shorthand and product codenames ('the CSAT flow', 'PDP page') published to external audiences undefined.",
                "Inconsistent forms for the same thing — alternating 'SC', 'success criterion', and 'criterion' — so the first-use expansion never attaches to later mentions.",
                "A glossary that exists but is not linked from the content, or is missing the abbreviations the content actually uses.",
                "Ambiguous abbreviations with multiple readings ('Dr.' as Doctor or Drive, 'St.' as Saint or Street) left for the reader to disambiguate.",
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
              How to test for 3.1.4
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "List every abbreviation on the page",
                  d: "Scan for capital-letter clusters, truncations with periods, and unit-like shorthand. A regex pass (e.g. \\b[A-Z]{2,}\\b) over the content catches most candidates; a human pass catches 'Dr.', 'approx.', and friends.",
                },
                {
                  t: "Exclude only true dictionary words and names",
                  d: "Strike lexicalized forms (laser, scuba) and letters that are the actual name. Everything else — however famous — stays on the list for the mechanism check.",
                },
                {
                  t: "Verify a mechanism for each",
                  d: "For every remaining abbreviation confirm one of: expansion at first use, a link to a glossary entry containing it, or abbr markup — and that the expansion given is correct for this context.",
                },
                {
                  t: "Test the mechanism without a mouse",
                  d: "Reach every expansion by keyboard and on a touch screen. If the only route is a title-attribute hover tooltip, the mechanism fails real users even where it technically conforms — upgrade it.",
                },
                {
                  t: "Listen with a screen reader",
                  d: "Have NVDA or VoiceOver read the content. Note how each abbreviation is announced and confirm a user who mishears it can still reach the expansion through the visible mechanism.",
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
              Relationship to 3.1.3 and 3.1.5
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Guideline 3.1 Readable builds up from{" "}
              <Link
                href="/wcag/3-1-1"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                3.1.1 Language of Page
              </Link>{" "}
              (Level A — declare the language so text is pronounced correctly)
              to a trio of AAA comprehension criteria.{" "}
              <Link
                href="/wcag/3-1-3"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                3.1.3 Unusual Words
              </Link>{" "}
              handles meaning: jargon, idioms, and restricted senses need
              definitions. 3.1.4 handles form: shortened forms need
              expansions. 3.1.5 Reading Level handles the text as a whole:
              unavoidably complex writing needs a supplement or simpler
              version.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              They chain naturally: expand &ldquo;ARIA&rdquo; to
              &ldquo;Accessible Rich Internet Applications&rdquo; (3.1.4), and
              a newcomer may still need to know what that <em>is</em> (3.1.3),
              explained in words they can read (3.1.5). One well-maintained
              glossary, linked from content, is the cheapest way to serve all
              three at once.
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

          <CriterionLinks number="3.1.4" />
        </article>

        {/* Related content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <RelatedContent
            content="abbreviations abbr element acronym initialism expanded form first use expansion glossary title attribute unusual words reading level readable understandable WCAG 3.1.4 Level AAA"
            maxItems={6}
          />
        </section>
      </div>
    </>
  )
}
