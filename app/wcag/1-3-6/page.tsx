import type { Metadata } from "next"
import Link from "next/link"
import WCAGSEOEnhancements from "@/components/wcag/seo-enhancements"
import WCAGBreadcrumb from "@/components/wcag/breadcrumb"
import { CriterionLinks } from "@/components/wcag/criterion-links"

export const metadata: Metadata = {
  title: "WCAG 1.3.6 Identify Purpose — AAA Guide",
  description:
    "WCAG 1.3.6 requires that the purpose of UI components, icons, and regions can be programmatically determined — enabling personalization. Techniques and testing.",
  keywords: [
    "WCAG 1.3.6",
    "Identify Purpose",
    "programmatically determined purpose",
    "personalization semantics",
    "ARIA landmarks",
    "autocomplete attributes",
    "cognitive accessibility",
    "symbol support AAC",
    "Level AAA",
    "WCAG 2.2",
  ],
  alternates: {
    canonical: "/wcag/1-3-6",
  },
  openGraph: {
    title: "WCAG 1.3.6 Identify Purpose — AAA Guide",
    description:
      "Make the purpose of UI components, icons, and regions machine-readable so user agents can personalize the interface. Landmarks, autocomplete, and testing for 1.3.6.",
    url: "/wcag/1-3-6",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: "/api/og?title=WCAG%201.3.6%20Identify%20Purpose&section=WCAG",
        width: 1200,
        height: 630,
        alt: "WCAG 1.3.6 Identify Purpose guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WCAG 1.3.6 Identify Purpose — AAA Guide",
    description:
      "Make the purpose of UI components, icons, and regions machine-readable so user agents can personalize the interface. Techniques and testing for 1.3.6.",
    images: ["/api/og?title=WCAG%201.3.6%20Identify%20Purpose&section=WCAG"],
  },
}

const faqs = [
  {
    q: "What does WCAG 1.3.6 Identify Purpose require?",
    a: "It requires that, in content implemented using markup languages, the purpose of user interface components, icons, and regions can be programmatically determined. In other words, machines — browsers, assistive technologies, personalization tools — must be able to work out not just what an element is (a button, a link) but what it is for (search, save, navigation, advertising). It is a Level AAA success criterion introduced in WCAG 2.1 alongside 1.3.5 Identify Input Purpose.",
  },
  {
    q: "How is 1.3.6 different from 1.3.5 Identify Input Purpose?",
    a: "1.3.5 (Level AA) is narrow: it applies only to input fields that collect information about the user, and it is satisfied by the HTML autocomplete attribute using its fixed token list (name, email, tel, and so on). 1.3.6 (Level AAA) generalizes the idea to the whole interface: buttons, links, icons, and page regions should all expose their purpose programmatically. Meeting 1.3.5 is a prerequisite step; 1.3.6 extends the same machine-readability to everything interactive plus regions and iconography.",
  },
  {
    q: "Why does exposing purpose matter — who uses it?",
    a: "The target beneficiaries are people with cognitive and learning disabilities who rely on personalization. When purposes are machine-readable, a browser extension or user agent can swap familiar symbols in for buttons (crucial for people who use AAC symbol sets), hide everything except the functions the user needs to reduce distraction, relabel controls with vocabulary the user knows, and keep the same icon for 'search' or 'home' identical across every site the user visits. None of that is possible when purpose lives only in visual design.",
  },
  {
    q: "What concrete techniques satisfy 1.3.6 today?",
    a: "Three layers: first, semantic HTML and ARIA landmarks — header, nav, main, aside, footer, role=search — so every region's purpose is exposed. Second, autocomplete tokens on user-data inputs, plus clear programmatic names on all controls and icons (aria-label, alt text) that state function rather than appearance. Third, where you want to go further, metadata vocabularies designed for personalization, such as the W3C WAI-Adapt (formerly 'personalization semantics') attributes, which can annotate elements with standardized purposes and symbol codes. WAI-Adapt is still maturing, so landmarks plus autocomplete plus good accessible names are the practical core.",
  },
  {
    q: "Does every icon need special markup under 1.3.6?",
    a: "Every meaningful icon needs a programmatically determinable purpose. Often that is simply a good accessible name: an SVG magnifier inside a button labelled 'Search' already exposes its purpose. Decorative icons should be hidden from the accessibility tree (aria-hidden=\"true\" or empty alt) so they do not add noise. The failure case is an icon-only control with no accessible name, or one named after its appearance ('magnifying glass') instead of its function ('search').",
  },
  {
    q: "Is 1.3.6 testable with automated tools?",
    a: "Partially. Tools can verify that landmarks exist, that all content sits inside a landmark, that autocomplete tokens are valid, and that controls have accessible names. What they cannot judge is whether the exposed purpose is correct and complete — whether the region marked navigation really is navigation, or whether an icon's name states its function. That review is manual: walk the accessibility tree and ask, for each component, icon, and region, 'could software act on this purpose?'",
  },
]

export default function WCAG136Page() {
  return (
    <>
      <WCAGSEOEnhancements
        title="WCAG 1.3.6: Identify Purpose"
        description="In content implemented using markup languages, the purpose of user interface components, icons, and regions can be programmatically determined."
        criteria="1.3.6"
        level="AAA"
        principle="Perceivable"
        guideline="1.3 Adaptable"
        url="https://accessibility.build/wcag/1-3-6"
        category="Adaptable"
        relatedCriteria={["1.3.1", "1.3.5", "4.1.2"]}
      />

      <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <WCAGBreadcrumb items={[]} current="1.3.6 Identify Purpose" />

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
                Guideline 1.3 Adaptable
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
              WCAG 1.3.6: Identify Purpose
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              Personalization tools can replace buttons with familiar symbols, strip away
              distractions, and keep &ldquo;search&rdquo; looking identical on every site
              — but only if the markup tells them what each thing is <em>for</em>. This
              AAA criterion asks that{" "}
              <strong className="text-slate-900 dark:text-white">
                the purpose of UI components, icons, and regions be programmatically
                determinable
              </strong>
              .
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
              In content implemented using markup languages, the purpose of User
              Interface Components, icons, and regions can be programmatically
              determined.
            </blockquote>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4 text-sm">
              The scope is markup languages — HTML above all. Purpose must be readable by
              software, not merely inferable by a human looking at the pixels.
            </p>
          </section>

          {/* AAA context */}
          <section aria-labelledby="aaa-context" className="mb-12">
            <h2
              id="aaa-context"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              AAA context: from input fields to the whole interface
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              WCAG 2.1 introduced a pair of criteria about machine-readable purpose. At
              Level AA, 1.3.5 Identify Input Purpose covers one well-standardized slice:
              form fields that collect data about the user, solvable today with{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                autocomplete
              </code>{" "}
              tokens. 1.3.6 is the ambitious AAA generalization: every user interface
              component, icon, and region should expose its purpose.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              It sits at AAA partly because the tooling is still evolving. Landmarks and
              accessible names are mature; a standardized vocabulary for &ldquo;this
              button&rsquo;s purpose is <em>compose message</em>&rdquo; is the mission of
              the W3C&rsquo;s WAI-Adapt specifications, which are not yet widely
              implemented. You can still make real progress today with semantics that
              already exist — and that progress is exactly what this criterion rewards.
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
                  t: "People who use symbols to communicate",
                  d: "Users of AAC symbol sets can have tools overlay familiar symbols onto controls — but only when the control's purpose is exposed in the markup.",
                },
                {
                  t: "People with memory or attention limitations",
                  d: "Personalization agents can hide non-essential regions (promos, secondary nav) and surface only the functions the user needs, reducing cognitive load.",
                },
                {
                  t: "People who depend on consistency",
                  d: "When purpose is machine-readable, a user's tools can render 'search', 'home', and 'help' identically on every website, instead of each site's bespoke iconography.",
                },
                {
                  t: "Screen reader and switch users",
                  d: "Landmarks let users jump straight to navigation, search, or main content; well-named controls make scanning and voice control reliable.",
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

          {/* The three targets */}
          <section aria-labelledby="requirement" className="mb-12">
            <h2
              id="requirement"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              The three targets: components, icons, regions
            </h2>
            <ul className="space-y-3 mb-6">
              {[
                "User interface components — buttons, links, inputs, and widgets must expose what they do. Accessible names that state function ('Search', 'Add to cart'), correct roles, and autocomplete tokens on user-data fields all contribute.",
                "Icons — every meaningful icon needs a programmatic purpose, usually via its accessible name. Name the function, not the picture: 'Delete', not 'trash can'. Purely decorative icons should be hidden from the accessibility tree.",
                "Regions — each area of the page should declare its purpose through landmarks: banner, navigation, search, main, complementary, contentinfo. All content should live inside a landmark so software can filter or reorganize the page.",
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
                  <li>A page fully structured with landmarks; nothing floats outside them.</li>
                  <li>Icon buttons whose accessible names state their function.</li>
                  <li>User-data inputs carrying correct autocomplete tokens.</li>
                </ul>
              </div>
              <div className="rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-5">
                <h3 className="font-semibold text-rose-800 dark:text-rose-300 mb-2">
                  ✗ Fails
                </h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed list-disc pl-4">
                  <li>A div-only layout where no region declares any purpose.</li>
                  <li>Icon-only controls with no accessible name, or names describing appearance.</li>
                  <li>Purpose conveyed exclusively by position and visual styling.</li>
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
              1. Regions: landmark every area of the page
            </h3>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<header>                        <!-- role: banner -->
  <nav aria-label="Primary">    <!-- role: navigation -->
    …
  </nav>
  <search>                      <!-- role: search (or role="search") -->
    <form action="/search">…</form>
  </search>
</header>

<main>                          <!-- role: main -->
  <article>…</article>
  <aside aria-label="Related links">…</aside>  <!-- complementary -->
</main>

<footer>…</footer>              <!-- role: contentinfo -->`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              2. Components and icons: purpose in the accessible name
            </h3>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- ✗ Icon-only, purpose locked in the pixels -->
<button><svg viewBox="0 0 24 24">…</svg></button>

<!-- ✓ Function exposed programmatically -->
<button aria-label="Search">
  <svg viewBox="0 0 24 24" aria-hidden="true">…</svg>
</button>

<!-- ✓ Input purpose exposed with autocomplete (also 1.3.5) -->
<label for="email">Email address</label>
<input id="email" type="email" autocomplete="email" />

<label for="tel">Phone number</label>
<input id="tel" type="tel" autocomplete="tel" />`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              3. Going further: WAI-Adapt personalization attributes
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              The W3C WAI-Adapt (Content Module) drafts define attributes that annotate
              elements with standardized purposes and symbol codes, letting user agents
              swap in each person&rsquo;s own vocabulary. Support is experimental — treat
              it as progressive enhancement on top of the semantics above.
            </p>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- Draft WAI-Adapt syntax: standardized purpose + symbol code -->
<button type="submit" adapt-purpose="send">Send message</button>

<span adapt-symbol="13621">cup of tea</span>

<!-- Distraction marking lets tools simplify the page -->
<aside adapt-distraction="sensory">…autoplaying promo…</aside>`}</code>
            </pre>
          </section>

          {/* Testing */}
          <section aria-labelledby="testing" className="mb-12">
            <h2
              id="testing"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              How to test for 1.3.6
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "Map the landmarks",
                  d: "Use a screen reader's landmarks list or a browser extension (e.g. Accessibility Insights, the Landmarks extension) to view the region structure. Every visible area should belong to a landmark whose type matches its purpose, and repeated landmark types need distinguishing labels.",
                },
                {
                  t: "Walk the accessibility tree for controls and icons",
                  d: "In browser DevTools, inspect each interactive element. Confirm it has an accessible name that states its function, and that decorative graphics are hidden. An icon named after its appearance rather than its action is a finding.",
                },
                {
                  t: "Audit autocomplete tokens",
                  d: "For every field collecting the user's own data, verify a valid, correct autocomplete token is present (this is also the 1.3.5 test). Automated tools such as axe flag invalid tokens.",
                },
                {
                  t: "Try purpose-driven navigation",
                  d: "With a screen reader, jump by landmark and by form control. Ask at each stop: does the announced role, name, and region type tell me what this is for without looking at the screen?",
                },
                {
                  t: "Simulate a personalization pass",
                  d: "Thought experiment (or a real tool if you use one): could software reliably hide everything except navigation and main content, or replace every control with a symbol, using only your markup? Wherever the answer is no, purpose is not programmatically determinable.",
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
                "Div-and-class layouts with no landmarks, so no region exposes any purpose to software.",
                "Icon-only buttons with no accessible name — the purpose exists only in the visual design.",
                "Accessible names that describe appearance ('hamburger', 'magnifying glass') instead of function ('menu', 'search').",
                "Missing or wrong autocomplete tokens on fields that collect the user's name, email, address, or phone.",
                "Multiple nav landmarks with no aria-label to distinguish primary navigation from breadcrumbs or footer links.",
                "Meaningful content left outside every landmark, where region-based filtering tools will lose it.",
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

          <CriterionLinks number="1.3.6" />
        </article>
      </div>
    </>
  )
}
