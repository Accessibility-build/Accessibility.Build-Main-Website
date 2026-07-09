import type { Metadata } from "next"
import Link from "next/link"
import WCAGSEOEnhancements from "@/components/wcag/seo-enhancements"
import WCAGBreadcrumb from "@/components/wcag/breadcrumb"
import { CriterionLinks } from "@/components/wcag/criterion-links"
import { RelatedContent } from "@/components/seo/related-content"

export const metadata: Metadata = {
  title: "WCAG 2.4.9 Link Purpose (Link Only) — AAA Guide",
  description:
    "WCAG 2.4.9 requires every link's purpose to be clear from its link text alone. Learn how it goes beyond 2.4.4, see pass/fail examples, and how to test it.",
  keywords: [
    "WCAG 2.4.9",
    "Link Purpose Link Only",
    "descriptive link text",
    "link text alone",
    "click here accessibility",
    "read more links",
    "screen reader links list",
    "2.4.9 test",
    "Level AAA",
    "WCAG 2.2",
    "navigable",
  ],
  alternates: {
    canonical: "/wcag/2-4-9",
  },
  openGraph: {
    title: "WCAG 2.4.9 Link Purpose (Link Only) — AAA Guide",
    description:
      "Every link must make sense from its text alone — no surrounding context required. How 2.4.9 strengthens 2.4.4, with examples, fixes, and testing steps.",
    url: "/wcag/2-4-9",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: "/api/og?title=WCAG%202.4.9%20Link%20Purpose%20(Link%20Only)&section=WCAG",
        width: 1200,
        height: 630,
        alt: "WCAG 2.4.9 Link Purpose (Link Only) guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WCAG 2.4.9 Link Purpose (Link Only) — AAA Guide",
    description:
      "Link text must describe the link's purpose on its own — 'Read more' and 'Click here' fail. Examples, fixes, and how to test WCAG 2.4.9 at Level AAA.",
    images: [
      "/api/og?title=WCAG%202.4.9%20Link%20Purpose%20(Link%20Only)&section=WCAG",
    ],
  },
}

const faqs = [
  {
    q: "What does WCAG 2.4.9 Link Purpose (Link Only) require?",
    a: "It requires that a mechanism is available to allow the purpose of each link to be identified from the link text alone, except where the purpose would be ambiguous to users in general. In plain terms: someone reading nothing but the words inside the link — with no surrounding sentence, heading, or list item — should understand where the link goes or what it does. It is a Level AAA success criterion under Guideline 2.4 Navigable, introduced in WCAG 2.0 and unchanged in WCAG 2.1 and 2.2.",
  },
  {
    q: "How is 2.4.9 different from 2.4.4 Link Purpose (In Context)?",
    a: "2.4.4 (Level A) allows the link's purpose to be determined from the link text together with its programmatically determined context — the surrounding sentence, the enclosing list item or table cell, or a preceding heading. 2.4.9 (Level AAA) removes that allowance: the link text alone must do the job. A 'Read more' link inside a paragraph about pricing can pass 2.4.4 because the paragraph supplies context, but it fails 2.4.9 because 'Read more' by itself describes nothing.",
  },
  {
    q: "What does 'a mechanism is available' mean in 2.4.9?",
    a: "The criterion is satisfied either by making all link text self-describing by default, or by providing a mechanism — such as a user preference or toggle — that lets users switch to a view where every link is understandable from its text alone. In practice, almost every team simply writes descriptive link text, because maintaining a second 'verbose links' mode is far more work than writing good links in the first place. The mechanism wording exists so that authors who want terse links for general users can still conform.",
  },
  {
    q: "What is the 'ambiguous to users in general' exception?",
    a: "If the purpose of a link cannot be known by anyone until they follow it — sighted or not — the link is exempt. The classic example is a link on the word 'guess' in a game, or a mystery link that is deliberately unlabeled for all users equally. The exception covers content where ambiguity is the point, not content where the author simply failed to write a clear label. A 'Click here' link is not ambiguous by design; it is just underspecified, so it does not qualify.",
  },
  {
    q: "Does an aria-label or visually hidden text satisfy 2.4.9?",
    a: "Yes. The 'link text' that must describe the purpose is the link's accessible name, so extending it with visually hidden text (a screen-reader-only span) or an aria-label counts. Two cautions: first, if you use aria-label it must include the visible text of the link so speech-input users can still activate it (2.5.3 Label in Name); second, hidden text helps screen reader users but not sighted users scanning the page, so visible descriptive text is the stronger solution when design allows.",
  },
  {
    q: "Do URLs used as link text pass 2.4.9?",
    a: "Usually not in any meaningful way. A short, human-readable URL such as example.com/pricing arguably describes its destination, but long tracking-laden URLs read out character by character are unintelligible in a screen reader's links list. Best practice is to always link real words that describe the destination — 'Accessibility.build pricing page' — rather than the raw address, unless the document's purpose is specifically to display the URL itself (for example, in citation formats).",
  },
]

export default function WCAG249Page() {
  return (
    <>
      <WCAGSEOEnhancements
        title="WCAG 2.4.9: Link Purpose (Link Only)"
        description="The purpose of each link can be identified from the link text alone."
        criteria="2.4.9"
        level="AAA"
        principle="Operable"
        guideline="2.4 Navigable"
        url="https://accessibility.build/wcag/2-4-9"
        category="Navigable"
        hasInteractiveDemo={false}
        relatedCriteria={["2.4.4", "2.4.6", "2.5.3"]}
      />

      <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <WCAGBreadcrumb items={[]} current="2.4.9 Link Purpose (Link Only)" />

          {/* Header */}
          <header className="mb-12">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                Level AAA
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Principle 2: Operable
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                The AAA version of 2.4.4
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
              WCAG 2.4.9: Link Purpose (Link Only)
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              Screen reader users routinely pull up a list of every link on a
              page and read it out of context. This criterion asks that{" "}
              <strong className="text-slate-900 dark:text-white">
                each link&rsquo;s purpose be clear from the link text alone
              </strong>{" "}
              — no surrounding sentence, no nearby heading, no guessing.
              &ldquo;Read more&rdquo; and &ldquo;Click here&rdquo; fail on their
              own; &ldquo;Read the 2026 accessibility lawsuit report&rdquo;
              passes anywhere.
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
              A mechanism is available to allow the purpose of each link to be
              identified from link text alone, except where the purpose of the
              link would be ambiguous to users in general.
            </blockquote>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4 text-sm">
              Two details matter. &ldquo;A mechanism is available&rdquo; means
              you can either write self-describing links everywhere or offer a
              setting that switches to fully descriptive links — in practice,
              nearly everyone does the former. And the exception applies only
              when a link is ambiguous <em>to everyone</em>, sighted users
              included, such as a deliberate mystery link in a game.
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
                <a className="hover:underline" href="#vs-244">
                  How 2.4.9 goes beyond 2.4.4
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
              Who this helps and why
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Links are the web&rsquo;s primary navigation unit, and several
              groups of users interact with them stripped of all visual
              context. When every link describes itself, these users move
              through a site as quickly as anyone else; when links read
              &ldquo;here&rdquo;, &ldquo;more&rdquo;, and &ldquo;this
              page&rdquo;, navigation becomes a guessing game.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  t: "Screen reader users",
                  d: "The links list (NVDA/JAWS elements list, VoiceOver rotor) shows every link's text with zero surrounding context. Ten 'Read more' entries are indistinguishable.",
                },
                {
                  t: "Speech input users",
                  d: "Users of Dragon or Voice Control activate links by speaking their text. 'Click read the pricing guide' works; three identical 'Click here' targets collide.",
                },
                {
                  t: "People with cognitive disabilities",
                  d: "Self-describing links reduce working-memory load: no need to re-read the paragraph to figure out what a vague link will do before committing to it.",
                },
                {
                  t: "Screen magnifier users",
                  d: "At high zoom only a small slice of the page is visible. A link that depends on a sentence two viewport-widths away is effectively context-free for them too.",
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

          {/* vs 2.4.4 */}
          <section aria-labelledby="vs-244" className="mb-12">
            <h2
              id="vs-244"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              How 2.4.9 goes beyond 2.4.4
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              WCAG has two link-purpose criteria, and the difference between
              them is exactly one word: <em>context</em>.
            </p>
            <ul className="space-y-3 mb-4">
              <li className="flex gap-3 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
                <span aria-hidden="true" className="text-blue-500 font-bold">
                  →
                </span>
                <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  <Link
                    href="/wcag/2-4-4"
                    className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                  >
                    2.4.4 Link Purpose (In Context)
                  </Link>{" "}
                  (Level A) — the purpose must be determinable from the link
                  text <em>or</em> from the text plus its programmatically
                  determined context: the enclosing sentence, paragraph, list
                  item, table cell, or a preceding heading.
                </span>
              </li>
              <li className="flex gap-3 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
                <span aria-hidden="true" className="text-purple-500 font-bold">
                  →
                </span>
                <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong className="text-slate-900 dark:text-white">
                    2.4.9 Link Purpose (Link Only)
                  </strong>{" "}
                  (Level AAA) — the link text <em>alone</em> must identify the
                  purpose. Context no longer rescues a vague link.
                </span>
              </li>
            </ul>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Why the stricter bar? Because &ldquo;programmatically determined
              context&rdquo; is only convenient to consume when you are reading
              the page linearly. A screen reader user who jumps straight into a
              links list, or tabs from link to link, hears the link text in
              isolation — retrieving the context means backtracking through
              surrounding content, which is slow and disorienting. 2.4.9
              guarantees the fast path works.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              A practical consequence: any page that passes 2.4.9 automatically
              passes 2.4.4, so teams aiming for the best experience often adopt
              &ldquo;every link self-describing&rdquo; as a content style rule
              and satisfy both at once. It also reinforces{" "}
              <Link
                href="/wcag/2-4-6"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                2.4.6 Headings and Labels
              </Link>
              , since link text acting as a control label must be descriptive
              there too.
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
            <div className="space-y-3 mb-4">
              {[
                {
                  pass: false,
                  text: "'Click here' at the end of a sentence describing a whitepaper. The sentence explains it — the link text does not, so it fails 2.4.9 even though it passes 2.4.4.",
                },
                {
                  pass: false,
                  text: "A blog index with a 'Read more' link under each post excerpt. In the links list, every entry reads identically.",
                },
                {
                  pass: false,
                  text: "A table of quarterly reports where each row's link is just 'PDF'. The row supplies the quarter; the link text alone does not.",
                },
                {
                  pass: true,
                  text: "'Download the Q3 2026 financial report (PDF, 2 MB)' — destination, format, and size all in the link text.",
                },
                {
                  pass: true,
                  text: "A 'Read more' link whose accessible name is extended with visually hidden text to 'Read more about our security practices'.",
                },
                {
                  pass: true,
                  text: "A riddle page where the answer link is deliberately labeled 'Reveal your surprise' — ambiguous to all users equally, so the exception applies.",
                },
              ].map((item) => (
                <div
                  key={item.text}
                  className={`flex gap-3 rounded-lg border p-4 ${
                    item.pass
                      ? "border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/20"
                      : "border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`font-bold ${
                      item.pass ? "text-emerald-600" : "text-rose-500"
                    }`}
                  >
                    {item.pass ? "✓" : "✗"}
                  </span>
                  <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {item.text}
                  </span>
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
              Put the purpose in the visible link text
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              The strongest technique needs no ARIA at all: link the words that
              describe the destination instead of a filler phrase.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- ✗ The sentence carries the meaning; the link does not -->
<p>
  Our 2026 lawsuit report is now available.
  <a href="/reports/2026">Click here</a> to read it.
</p>

<!-- ✓ The link text alone identifies the purpose -->
<p>
  Read the
  <a href="/reports/2026">2026 accessibility lawsuit report</a>
  for the full data.
</p>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Extend repeated card links with hidden text
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Card grids often want short visible labels. Extend the accessible
              name with a visually hidden span so each link is unique and
              self-describing out of context.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- ✗ Three indistinguishable links in the links list -->
<a href="/blog/alt-text">Read more</a>
<a href="/blog/focus-styles">Read more</a>
<a href="/blog/aria-labels">Read more</a>

<!-- ✓ Visible design unchanged; accessible names complete -->
<a href="/blog/alt-text">
  Read more<span class="sr-only"> about writing alt text</span>
</a>
<a href="/blog/focus-styles">
  Read more<span class="sr-only"> about visible focus styles</span>
</a>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              If you use aria-label, include the visible text
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                aria-label
              </code>{" "}
              replaces the link&rsquo;s name entirely. To keep speech-input
              users working (2.5.3 Label in Name), the label must contain the
              text users can see.
            </p>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- ✗ Visible text 'More' is not in the accessible name -->
<a href="/pricing" aria-label="Pricing details">More</a>

<!-- ✓ Accessible name starts with the visible text -->
<a href="/pricing" aria-label="More about pricing plans">More</a>`}</code>
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
                "'Click here', 'here', 'more', 'this page', and 'link' as link text — the canonical failures, regardless of how clear the surrounding sentence is.",
                "Repeated 'Read more' / 'Learn more' links on card or blog listings with no per-link differentiation in the accessible name.",
                "Raw URLs as link text — long query-string-laden addresses are meaningless when read aloud in a links list.",
                "File links labeled only by format or action: 'PDF', 'Download', 'View' — without naming which document they open.",
                "Icon-only links (arrow, chevron, external-link icon) with no accessible name at all, which also fail 2.4.4 and 4.1.2.",
                "aria-label text that contradicts or omits the visible link text, breaking speech-input activation (2.5.3).",
                "Linking a whole card via an empty anchor stretched over it, leaving the accessible name empty or set to 'card'.",
                "Relying on the title attribute to carry the purpose — it is not reliably exposed to keyboard, touch, or screen reader users.",
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
              How to test for 2.4.9
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "Pull up the links list",
                  d: "Open the screen reader's list of links (Insert+F7 in NVDA/JAWS, the VoiceOver rotor's Links view) or run a browser extension that extracts every link's accessible name. This is exactly the out-of-context view 2.4.9 protects.",
                },
                {
                  t: "Read each name in isolation",
                  d: "For every entry ask one question: if this were the only thing I could read, would I know where the link goes or what it does? 'Read the returns policy' passes; 'Read more' does not.",
                },
                {
                  t: "Check duplicates point to the same place",
                  d: "Identical link text is acceptable only when the links share the same destination (a logo and a 'Home' link, say). Identical text pointing at different URLs is an automatic failure.",
                },
                {
                  t: "Verify accessible names, not just visible text",
                  d: "Inspect links that use aria-label, aria-labelledby, or hidden spans in the browser's accessibility panel. Confirm the computed name is self-describing and includes the visible text.",
                },
                {
                  t: "Apply the ambiguity exception sparingly",
                  d: "Only exempt links whose purpose is deliberately unknown to every user — mystery or game links. A vague label produced by sloppy copywriting never qualifies for the exception.",
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
              Automated tools can list links and flag empty names, but judging
              whether the words describe the purpose is a human review. Work
              through the full{" "}
              <Link
                href="/checklists/wcag-2-2"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                WCAG 2.2 checklist
              </Link>{" "}
              to cover the neighbouring criteria at the same time.
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

          <CriterionLinks number="2.4.9" />
        </article>

        {/* Related content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <RelatedContent
            content="link purpose link only descriptive link text click here read more links screen reader links list speech input link text alone accessible name aria-label label in name navigable WCAG 2.4.9 Level AAA"
            maxItems={6}
          />
        </section>
      </div>
    </>
  )
}
