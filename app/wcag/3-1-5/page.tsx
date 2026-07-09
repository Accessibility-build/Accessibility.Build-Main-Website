import type { Metadata } from "next"
import Link from "next/link"
import WCAGSEOEnhancements from "@/components/wcag/seo-enhancements"
import WCAGBreadcrumb from "@/components/wcag/breadcrumb"
import { CriterionLinks } from "@/components/wcag/criterion-links"

export const metadata: Metadata = {
  title: "WCAG 3.1.5 Reading Level — Plain Language Guide",
  description:
    "Guide to WCAG 3.1.5 Reading Level: the lower secondary education benchmark, Flesch-Kincaid and other readability scores, supplemental content, and how to test.",
  keywords: [
    "WCAG 3.1.5",
    "Reading Level",
    "plain language accessibility",
    "readability accessibility",
    "Flesch-Kincaid grade level",
    "lower secondary education level",
    "easy read content",
    "cognitive accessibility",
    "readability score",
    "Level AAA",
    "WCAG 2.2",
    "readable",
  ],
  alternates: {
    canonical: "/wcag/3-1-5",
  },
  openGraph: {
    title: "WCAG 3.1.5 Reading Level — Write for Lower Secondary Education (Level AAA)",
    description:
      "The definitive guide to WCAG 3.1.5: when text demands more than a lower-secondary reading level, provide supplemental content or a simpler version. Readability scoring, techniques, and testing.",
    url: "/wcag/3-1-5",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: "/api/og?title=WCAG%203.1.5%20Reading%20Level&section=WCAG",
        width: 1200,
        height: 630,
        alt: "WCAG 3.1.5 Reading Level guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WCAG 3.1.5 Reading Level — Plain Language, Measured",
    description:
      "Text harder than lower-secondary level needs supplemental content or a simpler version. How to measure with Flesch-Kincaid, write plainly, and test 3.1.5 Level AAA.",
    images: [
      {
        url: "/api/og?title=WCAG%203.1.5%20Reading%20Level&section=WCAG",
        width: 1200,
        height: 630,
      },
    ],
  },
}

const faqs = [
  {
    q: "What does WCAG 3.1.5 Reading Level require?",
    a: "When text requires reading ability more advanced than the lower secondary education level — after removing proper names and titles — supplemental content or an alternative version at that level must be available. Lower secondary education corresponds to roughly seven to nine years of schooling (about grades 7–9 in the US, ages 12–15), following UNESCO's ISCED classification. It is a Level AAA success criterion under Guideline 3.1 Readable. Importantly, it does not ban complex text; it requires an easier route to the same information.",
  },
  {
    q: "Does 3.1.5 mean I have to dumb down technical or legal content?",
    a: "No. The criterion explicitly allows the main content to remain as complex as its subject demands — a research paper stays a research paper. What it asks is that when the text exceeds the lower-secondary threshold, you add support: a plain-language summary, an abstract written simply, diagrams or illustrations that convey the key points, an audio version, or a separate easy-read edition. Readers who need the simpler path get one; expert readers lose nothing.",
  },
  {
    q: "How do I measure reading level for 3.1.5?",
    a: "Use established readability formulas. For English, Flesch-Kincaid Grade Level and Flesch Reading Ease are the most common; SMOG, Gunning Fog, Coleman-Liau, and Dale-Chall are alternatives, and many languages have their own adapted formulas. A Flesch-Kincaid grade of about 9 or below (Reading Ease roughly 60+) approximates the lower-secondary benchmark. Remove proper names and titles first, as the criterion instructs, since you cannot simplify someone's name. Formulas are estimates — pair the score with human review.",
  },
  {
    q: "What counts as 'supplemental content' under 3.1.5?",
    a: "Anything that helps a reader who struggles with the original text reach the same information: a short plain-language summary at the top of the page, charts, infographics or illustrations of the main points, a step-by-step visual walkthrough, a glossary of the difficult terms, an audio recording of the content read aloud, or a full alternative easy-read version linked prominently. The supplement must cover the substance of the content, not just restate the headline.",
  },
  {
    q: "Does 3.1.5 apply to every page on a site?",
    a: "It applies to text content that requires reading ability beyond lower secondary level. Short navigation labels, product names, and simple UI copy usually sit below the threshold already. The pages that typically trigger it are dense ones: terms of service, medical and financial explanations, government guidance, insurance policies, and long-form technical documentation. For conformance claims, remember that AAA criteria are assessed per page — each page with complex text needs its supplement or alternative.",
  },
  {
    q: "Who benefits from meeting 3.1.5?",
    a: "People with reading disabilities such as dyslexia, people with cognitive and learning disabilities, people with memory or attention impairments, Deaf readers for whom written language is a second language after sign language, readers with lower literacy, and anyone reading in a non-native language. That last group alone is enormous — plain language consistently improves comprehension, task completion, and satisfaction for all readers, which is why governments increasingly mandate it regardless of WCAG.",
  },
]

export default function WCAG315Page() {
  return (
    <>
      <WCAGSEOEnhancements
        title="WCAG 3.1.5: Reading Level"
        description="When text requires reading ability more advanced than the lower secondary education level, supplemental content or an alternative version is available"
        criteria="3.1.5"
        level="AAA"
        principle="Understandable"
        guideline="3.1 Readable"
        url="https://accessibility.build/wcag/3-1-5"
        category="Readable"
        relatedCriteria={["3.1.1", "3.1.6", "1.4.12", "2.4.6"]}
      />

      <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <WCAGBreadcrumb items={[]} current="3.1.5 Reading Level" />

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
                Cognitive accessibility
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
              WCAG 3.1.5: Reading Level
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              A page can pass every technical check and still be unusable if nobody can
              understand the words. This criterion sets a measurable bar:{" "}
              <strong className="text-slate-900 dark:text-white">
                if your text demands more reading ability than lower secondary
                education (roughly 7–9 years of schooling), provide supplemental
                content or a simpler version
              </strong>
              . It is the closest WCAG comes to a plain-language requirement.
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
              When text requires reading ability more advanced than the lower secondary
              education level after removal of proper names and titles, supplemental
              content, or a version that does not require reading ability more advanced
              than the lower secondary education level, is available.
            </blockquote>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4 text-sm">
              Two details matter. Proper names and titles are excluded before you
              assess difficulty — you cannot simplify &ldquo;Kierkegaard&rdquo; or a
              statute&rsquo;s official name. And the remedy is additive: you may keep
              the complex original as long as an easier path to the same information
              exists.
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
                <a className="hover:underline" href="#benchmark">
                  The lower-secondary benchmark
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#pass-fail">
                  Pass and fail examples
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#writing">
                  Writing to the level (with examples)
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#testing">
                  How to test with readability scores
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#failures">
                  Common failures
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
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Reading is a stack of skills — decoding letterforms, holding a sentence
              in working memory, mapping vocabulary to meaning, tracking references
              across paragraphs. A disability affecting any layer of that stack makes
              dense prose a barrier as real as a missing ramp.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              {[
                {
                  t: "People with dyslexia and reading disabilities",
                  d: "Decoding costs them far more effort per word, so long sentences and rare vocabulary exhaust the budget before meaning arrives. Shorter sentences and common words leave capacity for comprehension.",
                },
                {
                  t: "People with cognitive and learning disabilities",
                  d: "Nested clauses, abstractions, and implied logic demand working memory and inference. Concrete wording, one idea per sentence, and explicit structure keep the content reachable.",
                },
                {
                  t: "Deaf readers and sign language users",
                  d: "For many Deaf people, the written national language is a second language learned after sign language. Idioms and complex written syntax translate poorly; plain structure translates well.",
                },
                {
                  t: "Non-native speakers and low-literacy readers",
                  d: "About half of adults in many countries read below the level most legal and medical text is written at. Plain language is the difference between completing a task and abandoning it.",
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
              The payoff is universal: usability studies consistently show plain
              language improves speed and comprehension for expert readers too. Nobody
              has ever complained that a terms-of-service page was too easy to
              understand.
            </p>
          </section>

          {/* Benchmark */}
          <section aria-labelledby="benchmark" className="mb-12">
            <h2
              id="benchmark"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              The lower-secondary benchmark
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              &ldquo;Lower secondary education level&rdquo; comes from UNESCO&rsquo;s
              International Standard Classification of Education (ISCED): the stage
              that begins after roughly six years of primary school and ends about nine
              years after schooling starts. In US terms that is approximately grades
              7–9, ages 12–15. WCAG chose an international education standard rather
              than any single country&rsquo;s grade system so the criterion works
              across languages.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              If your text, with proper names and titles set aside, demands more than
              that, you satisfy the criterion by providing <em>either</em>:
            </p>
            <ul className="space-y-3 mb-4">
              <li className="flex gap-3 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
                <span aria-hidden="true" className="text-purple-500 font-bold">
                  1
                </span>
                <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong className="text-slate-900 dark:text-white">
                    Supplemental content
                  </strong>{" "}
                  alongside the original — a plain-language summary covering the key
                  points, illustrations, charts or diagrams of the main ideas, a visual
                  step-by-step guide, or an audio version read aloud.
                </span>
              </li>
              <li className="flex gap-3 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
                <span aria-hidden="true" className="text-purple-500 font-bold">
                  2
                </span>
                <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong className="text-slate-900 dark:text-white">
                    An alternative version
                  </strong>{" "}
                  of the whole content written at lower-secondary level — an
                  &ldquo;easy read&rdquo; or plain-language edition, discoverable from
                  the original (a clearly labelled link at the top works well).
                </span>
              </li>
            </ul>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              There are no exceptions clauses in this criterion — but note the trigger
              condition does the scoping: text that is already readable at
              lower-secondary level requires nothing extra, and proper names and titles
              never count against you.
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
                  ✓ Passes 3.1.5
                </h3>
                <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <li>
                    A medical journal article preceded by a plain-language
                    &ldquo;What this study found&rdquo; summary.
                  </li>
                  <li>
                    An insurance policy page with a linked easy-read version covering
                    every section in simple sentences.
                  </li>
                  <li>
                    A tax-filing guide whose complex rules are accompanied by a
                    flowchart and worked visual examples.
                  </li>
                  <li>
                    Government legislation published with an official plain-language
                    explainer of what the law means in practice.
                  </li>
                  <li>
                    A blog post that scores at grade 8 on Flesch-Kincaid — already
                    below the threshold, nothing extra needed.
                  </li>
                </ul>
              </div>
              <div className="rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-5">
                <h3 className="font-semibold text-rose-800 dark:text-rose-300 mb-3">
                  ✗ Fails 3.1.5
                </h3>
                <ul className="space-y-3 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <li>
                    Terms of service written at postgraduate reading level with no
                    summary or simplified version anywhere.
                  </li>
                  <li>
                    A patient-information page dense with unexplained clinical
                    terminology and no plain-language alternative.
                  </li>
                  <li>
                    A benefits application whose instructions score at grade 14, with
                    the &ldquo;help&rdquo; link leading to equally dense text.
                  </li>
                  <li>
                    A one-line marketing summary bolted onto a 5,000-word contract —
                    supplements must cover the substance, not just exist.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Writing */}
          <section aria-labelledby="writing" className="mb-12">
            <h2
              id="writing"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Writing to the level (with examples)
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              The mechanics of plain language are well established: prefer short
              sentences (aim under ~20 words), common words over jargon, active voice,
              one idea per sentence, concrete examples, and generous structure —
              headings, lists, and summaries. Watch the transformation:
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`✗ Grade ~16 (fails the threshold, needs a supplement):
"Remuneration disbursements shall be effectuated subsequent to
the finalization of the verification procedures referenced in
Section 4.2, contingent upon satisfactory documentation."

✓ Grade ~6 (passes outright):
"We will pay you after we check your documents.
Section 4.2 explains what we check."`}</code>
            </pre>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              When the original must stay complex, add a labelled plain-language
              summary and link the two versions both ways:
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<article>
  <h1>Data Processing Agreement</h1>

  <section aria-labelledby="summary-heading" class="plain-summary">
    <h2 id="summary-heading">Summary in plain language</h2>
    <ul>
      <li>We store your data in the EU.</li>
      <li>We never sell your data.</li>
      <li>You can ask us to delete it at any time.</li>
    </ul>
    <p><a href="/legal/dpa-easy-read">Read the full easy-read version</a></p>
  </section>

  <section aria-labelledby="full-heading">
    <h2 id="full-heading">Full legal text</h2>
    <!-- the unavoidable legal language lives here -->
  </section>
</article>`}</code>
            </pre>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Supplements do not have to be prose. A diagram often outperforms a
              rewritten paragraph — pair it with a text alternative so it stays
              accessible:
            </p>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<figure>
  <img src="/img/claims-process.svg"
       alt="How a claim works: 1. You send the form.
            2. We check it within 5 days. 3. We pay you." />
  <figcaption>The three steps of a claim, illustrated.</figcaption>
</figure>

<audio controls src="/audio/claims-guide.mp3">
  <a href="/audio/claims-guide.mp3">Listen to this guide (MP3)</a>
</audio>`}</code>
            </pre>
          </section>

          {/* Testing */}
          <section aria-labelledby="testing" className="mb-12">
            <h2
              id="testing"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              How to test with readability scores
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "Extract the text and strip proper names and titles",
                  d: "Copy the main content of the page. The criterion tells you to remove proper names (people, places, products) and titles (of documents, laws, works) before assessing — they are unavoidable and inflate scores unfairly.",
                },
                {
                  t: "Run a readability formula appropriate to the language",
                  d: "For English, Flesch-Kincaid Grade Level is the standard: a score of about 9 or below approximates lower-secondary level (Flesch Reading Ease roughly 60 or higher). SMOG, Gunning Fog, and Coleman-Liau are useful cross-checks; other languages have adapted formulas (e.g. Flesch-Douma for Dutch, Fernández-Huerta for Spanish).",
                },
                {
                  t: "Score representative passages, not just the intro",
                  d: "Introductions are usually the friendliest text on the page. Sample the dense middle sections — eligibility rules, technical procedures, legal clauses — because that is where the criterion is failed.",
                },
                {
                  t: "If any passage exceeds the level, look for the remedy",
                  d: "Check whether supplemental content (plain summary, diagrams, audio) or a full lower-secondary alternative version exists and actually covers the same information. A supplement that omits the substance does not count.",
                },
                {
                  t: "Sanity-check with humans",
                  d: "Formulas count syllables and sentence lengths; they cannot detect ambiguity, idiom, or missing context. Ask someone unfamiliar with the domain to read the text and explain it back. Plain-language testing with real users is the gold standard.",
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
              You can score your copy right now: the{" "}
              <Link
                href="/tools/accessible-typography-studio"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Accessible Typography Studio
              </Link>{" "}
              includes a readability analyzer that computes Flesch-Kincaid and related
              metrics as you paste in text — useful for checking a page against the
              lower-secondary threshold while you also tune its typography. Then work
              through the rest of the{" "}
              <Link
                href="/checklists/wcag-2-2"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                WCAG 2.2 checklist
              </Link>
              .
            </p>
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
                "Publishing legal, medical, or financial content at university reading level with no summary, diagram, or easy-read alternative at all.",
                "Writing a 'summary' that is just the first paragraph of the same dense prose, rather than a genuine plain-language restatement.",
                "Providing a simplified version that quietly omits obligations, exceptions, or costs — the easy version must carry the same substance.",
                "Hiding the plain-language version so deep in the footer that the readers who need it never find it.",
                "Relying on jargon and unexplained acronyms ('per the SLA, RPO targets apply') even in the supposedly simple version.",
                "Assuming a readability score alone proves comprehension — short sentences full of ambiguity still fail readers, and testers should flag them.",
                "Treating the criterion as a ban on complexity and refusing to publish necessary technical detail, instead of adding the supplemental path.",
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

          {/* Relationship */}
          <section aria-labelledby="siblings" className="mb-12">
            <h2
              id="siblings"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Relationship to other criteria
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Guideline 3.1 Readable builds up in layers.{" "}
              <Link href="/wcag/3-1-1" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                3.1.1 Language of Page
              </Link>{" "}
              (A) and 3.1.2 Language of Parts (AA) make sure assistive technology
              pronounces the words correctly. The AAA tier then addresses whether the
              words can be <em>understood</em>: 3.1.3 Unusual Words and 3.1.4
              Abbreviations require mechanisms to explain jargon and acronyms, 3.1.5
              sets the overall reading-level bar, and{" "}
              <Link href="/wcag/3-1-6" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                3.1.6 Pronunciation
              </Link>{" "}
              handles words whose meaning depends on how they are pronounced.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Reading level also interacts with presentation: text that meets{" "}
              <Link href="/wcag/1-4-12" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                1.4.12 Text Spacing
              </Link>{" "}
              (AA) and is organized under descriptive{" "}
              <Link href="/wcag/2-4-6" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                2.4.6 Headings and Labels
              </Link>{" "}
              (AA) is dramatically easier to process for exactly the same readers this
              criterion protects. Plain words, breathable typography, and honest
              headings are one project, not three.
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

          <CriterionLinks number="3.1.5" />
        </article>
      </div>
    </>
  )
}
