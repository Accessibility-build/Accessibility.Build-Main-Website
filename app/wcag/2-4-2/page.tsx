import Link from "next/link"
import { createMetadata } from "@/lib/metadata"
import { BreadcrumbStructuredData } from "@/components/seo/structured-data"
import WCAGSEOEnhancements from "@/components/wcag/seo-enhancements"
import { CriterionLinks } from "@/components/wcag/criterion-links"
import PageTitleDemo from "./interactive-demo"

export const metadata = createMetadata({
  title: "WCAG 2.4.2 Page Titled — Descriptive Page Titles",
  path: "/wcag/2-4-2",
  description:
    "Master WCAG 2.4.2 Page Titled with interactive title analysis tools, SEO optimization techniques, and descriptive page title examples. Complete guide with live validation, title scoring, and implementation code for better user orientation.",
  keywords: [
    "WCAG 2.4.2",
    "Page Titled",
    "descriptive titles",
    "SEO",
    "accessibility",
    "Level A",
    "page titles",
    "web accessibility",
    "WCAG 2.2",
    "title optimization",
    "user orientation",
    "navigation",
    "document title",
  ],
  type: "article",
  image: "/api/og?title=WCAG%202.4.2%20Page%20Titled&section=WCAG",
})

const faqs = [
  {
    q: "What does WCAG 2.4.2 Page Titled require?",
    a: "It requires that web pages have titles that describe their topic or purpose. In HTML this is the <title> element in the document head, which browsers show in the tab, bookmarks, and history, and which screen readers announce first when a page loads. The title must exist and it must be meaningful — it should tell a user what page they are on and distinguish it from other pages on the site. It is a Level A success criterion, part of WCAG since 2.0, and one of the easiest to meet yet frequently overlooked in single-page apps and templated systems.",
  },
  {
    q: "Is the page title the same as the h1 heading?",
    a: "No, though they are related and often overlap in wording. The title is the <title> element in the head; it names the page for the browser tab, bookmarks, search results, and the screen reader's initial announcement, and it exists outside the visible page. The h1 is a visible heading at the top of the content. A page can pass 2.4.2 with a good <title> even if it has no h1, and vice versa — they are governed by different criteria (2.4.2 for the title, 1.3.1 and 2.4.6 for headings). Best practice is to keep them consistent so the tab and the on-page heading tell the same story.",
  },
  {
    q: "How does the title help screen reader users specifically?",
    a: "When a page loads, or when a screen reader user moves to a new page or tab, the very first thing announced is the document title. It is their orientation cue — the equivalent of a sighted user glancing at the tab or the top of the page to confirm they landed where they expected. If every page shares the same generic title, or the title is empty, the user hears no useful confirmation and cannot tell open tabs apart. A descriptive, unique title turns that first announcement into instant context.",
  },
  {
    q: "What makes a good page title?",
    a: "A good title is descriptive, unique, and front-loaded. Put the most specific, page-identifying information first, followed by the site or section name — for example 'Refund policy — Acme Support' rather than 'Acme Support — Refund policy'. Front-loading matters because titles get truncated in narrow browser tabs and in search results, and screen reader users hear the beginning first. Keep each page's title distinct from the others, and update it to reflect meaningful state changes such as a cart item count, a search query, or a form-error condition.",
  },
  {
    q: "Do titles need to be unique across the whole site?",
    a: "Uniqueness is strongly recommended but is not the literal wording of the criterion, which asks that the title describe the page's topic or purpose. In practice a description that genuinely identifies the page ends up being unique, because two different pages have two different purposes. Duplicate titles across many pages are a strong signal that the titles are generic rather than descriptive — users cannot tell tabs, bookmarks, or history entries apart. So while a rare coincidental duplicate is not an automatic failure, systematic duplication almost always indicates a real 2.4.2 problem.",
  },
  {
    q: "How do I handle titles in single-page apps that change views without a reload?",
    a: "Treat each view as its own page and update document.title whenever the route changes. Frameworks make this straightforward — Next.js exposes a metadata/title API per route, React Router apps commonly set the title in a route effect, and most routers have a title strategy. The key point is that a client-side navigation that does not update the title leaves screen reader users on a stale announcement and gives every view the same tab label. Setting the title on view change, and optionally announcing it via a live region, keeps orientation intact without full page reloads.",
  },
]

const htmlGood = `<!-- ✗ Missing, empty, or generic titles -->
<head>
  <!-- no title element at all -->
</head>

<head><title></title></head>

<head><title>Untitled Document</title></head>
<head><title>Home</title></head>   <!-- same on every page -->

<!-- ✓ Descriptive, unique, front-loaded titles -->
<head><title>Refund policy — Acme Support</title></head>
<head><title>Blue running shoes, size 10 — Acme Store</title></head>
<head><title>Search results for "invoice" (12 found) — Acme</title></head>`

const dynamicJs = `// Reflect meaningful page state in the title so it stays
// descriptive as the page changes.

// Cart item count
function setCartTitle(count) {
  document.title = count === 0
    ? "Your cart is empty — Acme Store"
    : \`Cart (\${count} item\${count === 1 ? "" : "s"}) — Acme Store\`;
}

// Search results
function setSearchTitle(query, resultCount) {
  document.title =
    \`Search results for "\${query}" (\${resultCount} found) — Acme\`;
}

// Surface a form error state so screen reader users notice on
// the title announcement, not only inline
function setFormTitle(hasErrors) {
  document.title = hasErrors
    ? "Please fix 2 errors — Checkout — Acme"
    : "Checkout — Acme";
}`

const nextMetadata = `// Next.js App Router: set a descriptive title per route.
// This renders a real <title> element on the server.
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund policy — Acme Support",
  description: "How and when to request a refund from Acme.",
};

// A layout can define a template so child routes append the
// site name automatically:
// title: { default: "Acme Support", template: "%s — Acme Support" }`

export default function WCAG242Page() {
  return (
    <>
      <WCAGSEOEnhancements
        title="WCAG 2.4.2: Page Titled"
        description="Web pages have titles that describe topic or purpose."
        criteria="2.4.2"
        level="A"
        principle="Operable"
        guideline="2.4 Navigable"
        url="https://accessibility.build/wcag/2-4-2"
        category="Navigation"
      />
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "WCAG Success Criteria", url: "https://accessibility.build/wcag" },
          { name: "2.4.2 Page Titled", url: "https://accessibility.build/wcag/2-4-2" },
        ]}
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
                    2.4.2 Page Titled
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
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                Level A
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                Principle 2: Operable
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                The first thing a screen reader announces
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
              WCAG 2.4.2: Page Titled
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              The page title is the label on the browser tab, the text saved to a
              bookmark, the headline in search results, and{" "}
              <strong className="text-slate-900 dark:text-white">
                the first thing a screen reader speaks when the page loads
              </strong>
              . This criterion asks for something small with an outsized effect: every
              page needs a title that describes what it is.
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
              Web pages have titles that describe topic or purpose.
            </blockquote>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4 text-sm">
              Two requirements hide in one sentence: a title must <em>exist</em>, and it
              must <em>describe</em> the page. An empty or missing title fails outright; a
              present-but-generic title like &ldquo;Untitled Document&rdquo; or
              &ldquo;Home&rdquo; on every page fails the descriptive half.
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
                <a className="hover:underline" href="#who-it-helps">
                  Who this helps
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#requirement">
                  What a good title looks like
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
                <a className="hover:underline" href="#demo">
                  Interactive demo
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

          {/* Who it helps */}
          <section aria-labelledby="who-it-helps" className="mb-12">
            <h2
              id="who-it-helps"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Who this helps
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              A descriptive title is a tiny piece of text that does orientation work for a
              wide range of people:
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  t: "Screen reader users",
                  d: "The title is announced first on page load and when switching tabs — it is the primary confirmation of 'where am I?' before any content is read.",
                },
                {
                  t: "People with many tabs open",
                  d: "Descriptive, unique titles let anyone distinguish between a dozen open tabs. Identical titles turn tab-switching into guesswork.",
                },
                {
                  t: "People with cognitive disabilities",
                  d: "A clear title reinforces context and reduces the memory load of tracking which page or step someone is on within a task.",
                },
                {
                  t: "Users returning via bookmarks or history",
                  d: "The title is what gets saved. A meaningful title makes bookmarks and history entries findable weeks later; 'Untitled' makes them useless.",
                },
                {
                  t: "Search and voice users",
                  d: "Search engines show the title as the result headline, and voice assistants read it. Good titles improve both discoverability and spoken navigation.",
                },
                {
                  t: "Everyone, at a glance",
                  d: "Sighted users read the tab to confirm a page loaded correctly. Descriptive titles make that glance informative instead of ambiguous.",
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

          {/* Requirement */}
          <section aria-labelledby="requirement" className="mb-12">
            <h2
              id="requirement"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              What a good title looks like
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              The criterion is short, so the craft is in the wording. Four habits turn a
              present title into a genuinely descriptive one:
            </p>
            <ul className="space-y-3 mb-6">
              {[
                {
                  t: "Describe the specific page",
                  d: "Name what this page is or does, not just the site. 'Refund policy — Acme Support' identifies the page; 'Acme Support' alone does not.",
                },
                {
                  t: "Make it unique",
                  d: "Each page should have a distinct title. Repeated titles are the clearest sign that the titles are generic rather than descriptive.",
                },
                {
                  t: "Front-load the important part",
                  d: "Put the page-identifying words first and the site name last. Titles get truncated in tabs and search results, and screen readers read the start first.",
                },
                {
                  t: "Reflect meaningful state",
                  d: "For dynamic pages, update the title to match the state: a cart count, a search query and result count, a step in a wizard, or an error condition.",
                },
              ].map((item) => (
                <li
                  key={item.t}
                  className="flex gap-3 rounded-lg border border-slate-200 dark:border-slate-800 p-4"
                >
                  <span aria-hidden="true" className="text-blue-500 font-bold">
                    →
                  </span>
                  <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    <strong className="text-slate-900 dark:text-white">{item.t}.</strong>{" "}
                    {item.d}
                  </span>
                </li>
              ))}
            </ul>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Title versus heading
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Do not confuse the page <em>title</em> (the{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">&lt;title&gt;</code>{" "}
              in the head, covered here) with the on-page{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">&lt;h1&gt;</code>{" "}
              heading (covered by{" "}
              <Link
                href="/wcag/2-4-6"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                2.4.6 Headings and Labels
              </Link>{" "}
              and{" "}
              <Link
                href="/wcag/1-3-1"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                1.3.1 Info and Relationships
              </Link>
              ). They serve different tools and can differ in wording, but keeping them
              consistent means the tab, the search result, and the top of the page all
              tell one story.
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
              <div className="rounded-xl border border-green-200 dark:border-green-900/40 bg-green-50 dark:bg-green-950/20 p-5">
                <h3 className="font-semibold text-green-800 dark:text-green-300 mb-3">
                  ✓ Passes 2.4.2
                </h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <li>&ldquo;Contact us — Acme Support&rdquo; on the contact page.</li>
                  <li>
                    &ldquo;Shopping cart (3 items) — Acme Store&rdquo; that updates with
                    the count.
                  </li>
                  <li>
                    &ldquo;How to create accessible forms — Acme Blog&rdquo; on an
                    article.
                  </li>
                  <li>
                    &ldquo;Error 404: page not found — Acme&rdquo; on a not-found page.
                  </li>
                  <li>A single-page app that updates the title on each view change.</li>
                </ul>
              </div>
              <div className="rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-5">
                <h3 className="font-semibold text-rose-800 dark:text-rose-300 mb-3">
                  ✗ Fails 2.4.2
                </h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <li>A missing or empty <code className="px-1 py-0.5 rounded bg-white/60 dark:bg-slate-800 font-mono text-xs">&lt;title&gt;</code> element.</li>
                  <li>&ldquo;Untitled Document&rdquo; — a leftover default.</li>
                  <li>&ldquo;Home&rdquo; or &ldquo;Page&rdquo; used identically across the whole site.</li>
                  <li>The site name only, with nothing identifying the page.</li>
                  <li>
                    An SPA view that keeps the previous route&rsquo;s title after
                    navigating.
                  </li>
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
              Generic vs. descriptive titles
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              The <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">&lt;title&gt;</code>{" "}
              lives in the document head. Front-load the page-specific part and append the
              site name.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{htmlGood}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Keep the title in sync with page state
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              When content changes without a reload, update{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">document.title</code>{" "}
              so the tab and the screen reader announcement stay accurate.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{dynamicJs}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Per-route titles in a framework
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Modern frameworks set the title per route. In the Next.js App Router, export
              a <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">metadata</code>{" "}
              object and use a template so every page appends the site name automatically.
            </p>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{nextMetadata}</code>
            </pre>
          </section>

          {/* Interactive demo */}
          <section aria-labelledby="demo" className="mb-12">
            <h2
              id="demo"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Interactive demo
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              Type a title, or pick one of the presets, to see how it would read in a
              browser tab and where it falls short of describing a page. The check is a
              heuristic — 2.4.2 ultimately depends on human judgment about whether the
              title fits the page.
            </p>
            <PageTitleDemo />
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
                "A missing or empty <title> element, so browsers fall back to the URL and screen readers announce nothing useful.",
                "Leftover default titles like 'Untitled Document', 'New Page', or the CMS template name.",
                "The same generic title ('Home', 'Page', the site name) on every page, so nothing is distinguishable.",
                "Only the site or brand name, with no words identifying the individual page.",
                "Site name front-loaded so the unique part is truncated in narrow tabs and search results.",
                "Single-page apps that never update document.title on client-side navigation, leaving a stale title.",
                "Titles stuffed with keywords for SEO at the expense of a clear, human-readable description.",
                "Error and status pages (404, 500, maintenance) left with the generic homepage title instead of describing the error.",
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
              How to test for 2.4.2
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "Read the browser tab and window title",
                  d: "Load the page and look at the tab. Is there a title at all, and does it tell you what this page is without seeing the content? An empty tab, a URL, or a default like 'Untitled' is an immediate failure.",
                },
                {
                  t: "Compare titles across pages",
                  d: "Open several pages of the site in tabs and check that each has a distinct, descriptive title. If the homepage, contact page, and a product page all read the same, the titles are generic.",
                },
                {
                  t: "Listen to the load announcement",
                  d: "With a screen reader running, load or refresh the page and confirm the announced title matches the page and would help you distinguish it from other open tabs.",
                },
                {
                  t: "Exercise dynamic and single-page views",
                  d: "For SPAs and stateful pages, navigate between views and change state (add to cart, run a search, trigger a form error). Confirm document.title updates to reflect each new view or state.",
                },
                {
                  t: "Run an automated check, then judge quality",
                  d: "axe DevTools, WAVE, and Lighthouse flag a missing or empty title reliably. They cannot tell whether a present title is actually descriptive, so finish with the manual reading checks above.",
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
              For a structured audit, work through the full{" "}
              <Link
                href="/checklists/wcag-2-2"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                WCAG 2.2 checklist
              </Link>
              .
            </p>
          </section>

          {/* Related criteria */}
          <CriterionLinks number="2.4.2" />

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
        </article>
      </div>
    </>
  )
}
