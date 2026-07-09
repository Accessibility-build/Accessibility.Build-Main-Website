import type { Metadata } from "next"
import Link from "next/link"
import WCAGSEOEnhancements from "@/components/wcag/seo-enhancements"
import WCAGBreadcrumb from "@/components/wcag/breadcrumb"
import { CriterionLinks } from "@/components/wcag/criterion-links"
import { RelatedContent } from "@/components/seo/related-content"

export const metadata: Metadata = {
  title: "WCAG 2.5.3 Label in Name — Match Visible Text",
  description:
    "Complete guide to WCAG 2.5.3 Label in Name. Why the accessible name must contain the visible label, how speech input users are affected, aria-label pitfalls, and how to test.",
  keywords: [
    "WCAG 2.5.3",
    "Label in Name",
    "accessible name",
    "visible label",
    "aria-label mismatch",
    "speech input accessibility",
    "voice control accessibility",
    "Dragon NaturallySpeaking",
    "Voice Control",
    "accessible name computation",
    "Level A",
    "WCAG 2.2",
    "input modalities",
  ],
  alternates: {
    canonical: "/wcag/2-5-3",
  },
  openGraph: {
    type: "website",
    title: "WCAG 2.5.3 Label in Name — Match Visible Text",
    description:
      "The accessible name must contain the text presented visually. How aria-label mismatches break voice control, code examples, common failures, and how to test WCAG 2.5.3.",
    url: "/wcag/2-5-3",
    images: [
      {
        url: "/api/og?title=WCAG%202.5.3%20Label%20in%20Name&section=WCAG",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WCAG 2.5.3 Label in Name — Match Visible Text",
    description:
      "Speech input users activate controls by their visible text. WCAG 2.5.3 requires the accessible name to contain that text — aria-label pitfalls, examples, and testing.",
  },
}

const faqs = [
  {
    q: "What does WCAG 2.5.3 Label in Name require?",
    a: "For user interface components whose labels include text or images of text, the accessible name — what assistive technologies announce and voice-control software matches against — must contain the text that is presented visually. If a button visibly says 'Send', its accessible name must include the word 'Send'. The name can contain more than the visible text, but it cannot omit or contradict it. It is a Level A criterion introduced in WCAG 2.1 and unchanged in WCAG 2.2.",
  },
  {
    q: "Why does Label in Name matter for speech input users?",
    a: "Voice-control software such as Dragon, Windows Voice Access, and Apple Voice Control lets users operate a page by speaking what they see: 'Click Send'. The software matches that phrase against each control's accessible name. If a button shows 'Send' but its aria-label is 'Submit message', saying 'Click Send' finds nothing — the user is talking to a control that, as far as the software knows, does not exist. The mismatch also confuses sighted screen reader users, who see one word and hear another.",
  },
  {
    q: "Does the accessible name have to exactly equal the visible label?",
    a: "No — it must contain it. An accessible name of 'Send message' for a button showing 'Send' passes, because 'Send' appears within the name. The W3C additionally recommends, as a best practice, putting the visible text at the start of the accessible name, because some speech-input tools work most reliably when the spoken phrase matches the beginning of the name. Exact match is the safest and simplest approach: for most controls, simply do not override the visible text at all.",
  },
  {
    q: "Which components does 2.5.3 apply to?",
    a: "Any user interface component with a label that includes text or an image of text: buttons, links, form fields with visible labels, tabs, menu items, and controls whose label is rendered as an image of words (like a logo-styled 'Checkout' button image). It does not apply to icon-only controls with no visible text — a magnifying-glass button with no text has no visible label to match, so 2.5.3 is satisfied vacuously (though 4.1.2 still requires it to have an accessible name, such as 'Search').",
  },
  {
    q: "Is punctuation or capitalization a problem for Label in Name?",
    a: "Generally no. The intent is that the words a sighted user reads are present in the name. Differences in case ('SUBMIT' vs 'Submit'), and symbols or punctuation that are not typically spoken (an ellipsis, a trailing colon, an asterisk marking a required field), do not cause failures. What matters is the spoken-word correspondence: a user saying the visible words should hit the control. Changing, reordering, or dropping actual words is where failures happen.",
  },
  {
    q: "How do I check a control's accessible name?",
    a: "Use the browser's accessibility inspector: in Chrome or Edge DevTools, select the element and open the Accessibility pane to see the 'Computed name' and which attribute or content produced it. Automated tools like axe DevTools include a specific 'label-in-name' style check (label-content-name-mismatch) that flags controls whose visible text is missing from the name. Finally, test the real experience: enable Voice Control (macOS/iOS) or Voice Access (Windows/Android) and speak the visible label of key controls.",
  },
]

export default function WCAG253Page() {
  return (
    <>
      <WCAGSEOEnhancements
        title="WCAG 2.5.3 Label in Name"
        description="For user interface components with labels that include text or images of text, the accessible name contains the text that is presented visually"
        criteria="2.5.3"
        level="A"
        principle="Operable"
        guideline="Input Modalities"
        url="https://accessibility.build/wcag/2-5-3"
        category="Input Modalities"
        wordCount={2700}
        timeToRead={9}
        hasInteractiveDemo={false}
        relatedCriteria={["4.1.2", "2.4.6", "1.1.1", "3.3.2"]}
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
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <WCAGBreadcrumb items={[]} current="2.5.3 Label in Name" />

          {/* Header */}
          <header className="mb-12">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                Level A
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Principle 2: Operable
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                Critical for voice control
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
              WCAG 2.5.3: Label in Name
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              Voice-control users operate a page by speaking what they see:
              &ldquo;Click Send.&rdquo; That only works if the words on the button are
              also in its accessible name. This criterion requires that{" "}
              <strong className="text-slate-900 dark:text-white">
                the accessible name of a control contains its visible text label
              </strong>
              . The most common failure is a well-meaning{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-lg">
                aria-label
              </code>{" "}
              that says something different from the text on screen.
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
              For user interface components with labels that include text or images of
              text, the name contains the text that is presented visually.
            </blockquote>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4 text-sm">
              The W3C adds a note: a best practice is to have the text of the label at
              the <em>start</em> of the name. &ldquo;Name&rdquo; here means the
              accessible name — the string assistive technologies compute for the
              component — and &ldquo;label&rdquo; means the text (or image of text)
              presented visually to identify it.
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
                <a className="hover:underline" href="#name-vs-label">
                  Accessible name vs. visible label
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

          {/* Who this helps */}
          <section aria-labelledby="who" className="mb-12">
            <h2
              id="who"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Who this helps
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              {[
                {
                  t: "Speech input users",
                  d: "People with motor disabilities — repetitive strain injury, spinal cord injury, tremor, limb difference — often drive the entire computer by voice with Dragon, Voice Control, or Voice Access. They target controls by speaking the visible text. A mismatched accessible name makes the control unreachable by voice.",
                },
                {
                  t: "Screen reader users with some vision",
                  d: "Many screen reader users can see the screen. When the button visibly says 'Search' but the screen reader announces 'Magnifier', the mismatch is disorienting and erodes trust in what is being announced.",
                },
                {
                  t: "People with cognitive disabilities",
                  d: "Consistency between what is seen, what is heard, and what must be said reduces cognitive load. One control, one name, everywhere.",
                },
                {
                  t: "Anyone using voice assistants hands-free",
                  d: "Situational users — driving, cooking, holding a child — increasingly rely on voice interaction. Label-in-name failures lock them out just as thoroughly.",
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
              Picture the failure from the user&rsquo;s side: the page shows a button
              labelled &ldquo;Send&rdquo;. The user says &ldquo;Click Send.&rdquo;
              Nothing happens, because a developer set{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                aria-label=&quot;Submit message&quot;
              </code>
              . The user tries again, louder. Then they fall back to a numbered grid
              overlay, speaking coordinates instead of words. A one-attribute mistake
              turned a two-second task into a workaround.
            </p>
          </section>

          {/* Name vs label */}
          <section aria-labelledby="name-vs-label" className="mb-12">
            <h2
              id="name-vs-label"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Accessible name vs. visible label
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Every interactive component has an{" "}
              <strong className="text-slate-900 dark:text-white">
                accessible name
              </strong>{" "}
              computed by the browser from, in priority order:{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                aria-labelledby
              </code>
              , then{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                aria-label
              </code>
              , then the associated{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                &lt;label&gt;
              </code>{" "}
              or the element&rsquo;s own text content (with{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                title
              </code>{" "}
              and{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                placeholder
              </code>{" "}
              as last resorts. The{" "}
              <strong className="text-slate-900 dark:text-white">visible label</strong>{" "}
              is whatever text a sighted user reads on or next to the control.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              When you write no ARIA at all, the accessible name <em>is</em> the
              visible text, and 2.5.3 passes automatically. The criterion only bites
              when the two diverge — almost always because{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                aria-label
              </code>{" "}
              or{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                aria-labelledby
              </code>{" "}
              overrides the visible text with different words.
            </p>
            <ul className="space-y-3">
              <li className="flex gap-3 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
                <span aria-hidden="true" className="text-blue-500 font-bold">
                  →
                </span>
                <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong className="text-slate-900 dark:text-white">
                    The name may extend the label.
                  </strong>{" "}
                  Visible &ldquo;Read more&rdquo; with accessible name &ldquo;Read
                  more about pricing&rdquo; passes — the visible words are all there,
                  at the start.
                </span>
              </li>
              <li className="flex gap-3 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
                <span aria-hidden="true" className="text-blue-500 font-bold">
                  →
                </span>
                <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong className="text-slate-900 dark:text-white">
                    The name may not replace the label.
                  </strong>{" "}
                  Visible &ldquo;Send&rdquo; with accessible name &ldquo;Submit
                  message&rdquo; fails — the word the user would speak is missing.
                </span>
              </li>
              <li className="flex gap-3 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
                <span aria-hidden="true" className="text-blue-500 font-bold">
                  →
                </span>
                <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong className="text-slate-900 dark:text-white">
                    Images of text count as visible labels.
                  </strong>{" "}
                  A button rendered as an image reading &ldquo;Checkout&rdquo; must
                  have &ldquo;Checkout&rdquo; in its alt text / accessible name.
                </span>
              </li>
              <li className="flex gap-3 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
                <span aria-hidden="true" className="text-blue-500 font-bold">
                  →
                </span>
                <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  <strong className="text-slate-900 dark:text-white">
                    Icon-only controls are out of scope
                  </strong>{" "}
                  — no visible text, nothing to match. They still need a sensible
                  accessible name under{" "}
                  <Link
                    href="/wcag/4-1-2"
                    className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                  >
                    4.1.2 Name, Role, Value
                  </Link>
                  .
                </span>
              </li>
            </ul>
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
              <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/20 p-5">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  <span aria-hidden="true" className="text-emerald-600 mr-2">
                    ✓
                  </span>
                  Pass: no ARIA override
                </h3>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                  A button contains the text &ldquo;Download invoice&rdquo; and has no
                  aria-label. The accessible name is the visible text. Saying
                  &ldquo;Click Download invoice&rdquo; works.
                </p>
              </div>
              <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/20 p-5">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  <span aria-hidden="true" className="text-emerald-600 mr-2">
                    ✓
                  </span>
                  Pass: name extends the visible label
                </h3>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                  A link shows &ldquo;Read more&rdquo; and its accessible name is
                  &ldquo;Read more about our security practices&rdquo;. The visible
                  words appear, at the start of the name — pass, and better link
                  purpose too.
                </p>
              </div>
              <div className="rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-5">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  <span aria-hidden="true" className="text-rose-500 mr-2">
                    ✗
                  </span>
                  Fail: aria-label replaces the visible text
                </h3>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                  A button shows &ldquo;Send&rdquo; but has{" "}
                  <code>aria-label=&quot;Submit message&quot;</code>. &ldquo;Send&rdquo;
                  is nowhere in the accessible name. &ldquo;Click Send&rdquo; fails for
                  voice users.
                </p>
              </div>
              <div className="rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-5">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  <span aria-hidden="true" className="text-rose-500 mr-2">
                    ✗
                  </span>
                  Fail: aria-labelledby points at the wrong text
                </h3>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                  A search field&rsquo;s visible label reads &ldquo;Search
                  products&rdquo;, but aria-labelledby references a heading that says
                  &ldquo;Catalog&rdquo;. The computed name omits the visible label
                  entirely.
                </p>
              </div>
              <div className="rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-5">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  <span aria-hidden="true" className="text-rose-500 mr-2">
                    ✗
                  </span>
                  Fail: image-of-text button with unrelated alt
                </h3>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                  An image button visibly reads &ldquo;Start free trial&rdquo; but its
                  alt text is &ldquo;cta-banner-v2&rdquo;. The visible words are absent
                  from the name — a double failure with{" "}
                  <Link
                    href="/wcag/1-1-1"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    1.1.1 Non-text Content
                  </Link>
                  .
                </p>
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
              The classic aria-label mismatch
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              If you add an aria-label to a control that already shows text, start it
              with the visible words — or better, do not add one at all.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- ✗ Fails: name "Submit message" does not contain visible "Send" -->
<button aria-label="Submit message">Send</button>

<!-- ✓ Passes: no override — the name is the visible text -->
<button>Send</button>

<!-- ✓ Passes: name extends the label, visible text first -->
<button aria-label="Send message to support">Send</button>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Extending repeated links accessibly (React)
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              The common pattern of disambiguating &ldquo;Read more&rdquo; links is
              fine — as long as the visible text stays at the start of the name.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`// ✗ Fails: visible "Read more" is missing from the name
function ArticleCard({ title, href }) {
  return <a href={href} aria-label={"Full article: " + title}>Read more</a>
}

// ✓ Passes: name starts with the visible label, then adds context
function ArticleCard({ title, href }) {
  return <a href={href} aria-label={"Read more: " + title}>Read more</a>
}

// ✓ Also passes: visually hidden extension keeps the DOM text intact
function ArticleCard({ title, href }) {
  return (
    <a href={href}>
      Read more<span className="sr-only"> about {title}</span>
    </a>
  )
}`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Form fields: keep label, name, and instructions aligned
            </h3>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- ✗ Fails: visible label says "Work email", name says "E-mail address" -->
<label for="em">Work email</label>
<input id="em" type="email" aria-label="E-mail address" />

<!-- ✓ Passes: the <label> element is the accessible name — one source of truth -->
<label for="work-email">Work email</label>
<input id="work-email" type="email" autocomplete="email" />`}</code>
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
                "aria-label text written independently of the visible text — 'Go' on screen, 'Submit search query' in the name.",
                "Localisation drift: the visible label gets translated or reworded during a redesign, but the hard-coded aria-label is never updated.",
                "aria-labelledby pointing to a nearby heading or tooltip instead of the control's own visible label.",
                "Adding context before the visible words ('Product page link: Read more') instead of after them — the label should be at the start of the name.",
                "Image buttons or images of text whose alt attribute is a filename or marketing description rather than the words shown in the image.",
                "Icon + text buttons where the accessible name is built from the icon's label only (e.g. name 'magnifier' for a button that visibly says 'Search').",
                "Design systems that expose a label prop for the accessible name separate from children, letting the two drift apart unnoticed.",
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
              How to test for 2.5.3
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "Run an automated scan first",
                  d: "axe DevTools and similar engines include a check (label-content-name-mismatch) that compares each control's visible text with its computed accessible name and flags names that omit the visible words. This catches most aria-label mismatches instantly.",
                },
                {
                  t: "Inspect computed names in DevTools",
                  d: "For each control with visible text and any aria-label/aria-labelledby, select it and open the Accessibility pane (Chrome/Edge/Firefox). Confirm the 'Name' value contains the visible text, ideally at the start.",
                },
                {
                  t: "Test with real voice control",
                  d: "Enable Voice Control on macOS/iOS or Voice Access on Windows/Android, or use Dragon if available. Speak 'Click <visible label>' for key controls — navigation, search, form submission. If the control does not activate, its name does not match.",
                },
                {
                  t: "Listen with a screen reader while looking at the screen",
                  d: "Tab through interactive elements with NVDA or VoiceOver running. Whenever what you hear does not include the words you see on the control, you have found a 2.5.3 candidate.",
                },
                {
                  t: "Audit ARIA usage in the codebase",
                  d: "Grep for aria-label and aria-labelledby on elements that also render visible text (buttons, links, labelled inputs). Each hit is a place where the name can drift from the label — verify or remove the override.",
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
              Then work through the rest of the{" "}
              <Link
                href="/checklists/wcag-2-2"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                WCAG 2.2 checklist
              </Link>{" "}
              — 2.5.3 pairs naturally with{" "}
              <Link
                href="/wcag/2-4-6"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                2.4.6 Headings and Labels
              </Link>
              , which asks whether those same labels are descriptive.
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

          <CriterionLinks number="2.5.3" />
        </article>

        {/* Related content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <RelatedContent
            content="label in name accessible name visible label aria-label mismatch speech input voice control Dragon voice access accessible name computation name role value WCAG 2.5.3 Level A input modalities"
            maxItems={6}
          />
        </section>
      </div>
    </>
  )
}
