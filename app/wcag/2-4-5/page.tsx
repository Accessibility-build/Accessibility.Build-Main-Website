import type { Metadata } from "next"
import Link from "next/link"
import {
  ArticleStructuredData,
  BreadcrumbStructuredData,
} from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"
import { CriterionLinks } from "@/components/wcag/criterion-links"

export const metadata: Metadata = {
  title: "WCAG 2.4.5 Multiple Ways — Find Pages More Than 1 Way",
  description:
    "Complete guide to WCAG 2.4.5 Multiple Ways. What counts as a 'way' to locate a page, the process exception, pass/fail examples, code samples, and how to test Level AA.",
  keywords: [
    "WCAG 2.4.5",
    "Multiple Ways",
    "site search accessibility",
    "sitemap accessibility",
    "ways to locate a page",
    "navigation accessibility",
    "table of contents accessibility",
    "2.4.5 test",
    "process exception",
    "set of web pages",
    "Level AA",
    "WCAG 2.2",
    "navigable",
  ],
  alternates: {
    canonical: "/wcag/2-4-5",
  },
  openGraph: {
    title: "WCAG 2.4.5 Multiple Ways — Find Pages More Than 1 Way",
    description:
      "The definitive guide to WCAG 2.4.5: what counts as a 'way' to locate a page, which combinations pass, the exception for steps in a process, code samples, and how to test Level AA.",
    url: "/wcag/2-4-5",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: "/api/og?title=WCAG%202.4.5%20Multiple%20Ways&section=WCAG",
        width: 1200,
        height: 630,
        alt: "WCAG 2.4.5 Multiple Ways guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WCAG 2.4.5 Multiple Ways — The Complete Guide",
    description:
      "Users must have more than one way to locate a page within a set of pages. What counts as a way, the process exception, examples, and how to test 2.4.5 Level AA.",
    images: [
      {
        url: "/api/og?title=WCAG%202.4.5%20Multiple%20Ways&section=WCAG",
        width: 1200,
        height: 630,
      },
    ],
  },
}

const faqs = [
  {
    q: "What does WCAG 2.4.5 Multiple Ways require?",
    a: "It requires that more than one way is available to locate a web page within a set of web pages, except where the page is the result of, or a step in, a process. In practice, a site needs at least two independent mechanisms for finding any given page — for example a navigation menu plus a site search, or a search plus a sitemap. It is a Level AA success criterion introduced in WCAG 2.0 and unchanged in WCAG 2.1 and 2.2.",
  },
  {
    q: "What counts as a 'way' to locate a page under 2.4.5?",
    a: "The Understanding document lists several accepted techniques: links to related pages, a table of contents, a site map, a site search feature, and a list of links to all pages in the set. Primary navigation menus also count, because they are links that let users reach the pages of the site. Any two of these mechanisms, working independently, satisfy the criterion — you do not need all of them.",
  },
  {
    q: "What is the 'process' exception in 2.4.5?",
    a: "Pages that are the result of, or a step in, a process do not need multiple ways to reach them. The classic examples are the individual steps of a checkout — cart, shipping, payment, confirmation — or the results page of a multi-step form wizard. It makes no sense to reach the payment step from a sitemap without first providing shipping details, so WCAG explicitly exempts these pages. Every page outside such a process still needs at least two ways.",
  },
  {
    q: "Do I need both a site search and a sitemap to pass?",
    a: "No. You need any two independent mechanisms. A site whose every page is reachable through the main navigation menus and which also offers a site search passes. So does a site with navigation menus plus an HTML sitemap, or a documentation site with a table of contents plus a search box. Search plus sitemap is a popular combination because together they cover users who know what they want (search) and users who need to browse the structure (sitemap).",
  },
  {
    q: "Does the main navigation menu count as one of the two ways?",
    a: "Yes, provided the page in question is actually reachable through it — directly or via intermediate index pages that are linked from the navigation. A deep article that appears in no menu, no index, and no sitemap, and is only reachable by knowing its URL, is exactly the situation 2.4.5 exists to prevent. If navigation covers every page, you only need one more mechanism, such as search, to pass.",
  },
  {
    q: "How is 2.4.5 different from 2.4.8 Location?",
    a: "They are complementary criteria in the same guideline, 2.4 Navigable. 2.4.5 Multiple Ways (AA) is about reaching a page: users must have more than one route to find it. 2.4.8 Location (AAA) is about knowing where you are once you arrive: information about the user's position within the site, such as breadcrumbs, must be available. A breadcrumb trail can incidentally help with 2.4.5 too, because its links offer another way to navigate the hierarchy.",
  },
]

export default function WCAG245Page() {
  return (
    <>
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "WCAG Success Criteria", url: "https://accessibility.build/wcag" },
          {
            name: "2.4.5 Multiple Ways",
            url: "https://accessibility.build/wcag/2-4-5",
          },
        ]}
      />

      <ArticleStructuredData
        headline="WCAG 2.4.5 Multiple Ways: The Complete Guide to Providing More Than One Way to Find a Page"
        description="The definitive guide to WCAG 2.4.5 Multiple Ways: what counts as a 'way' to locate a page, which combinations pass, the exception for steps in a process, code samples, and testing methods."
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
        image="https://accessibility.build/api/og?title=WCAG%202.4.5%20Multiple%20Ways&section=WCAG"
        url="https://accessibility.build/wcag/2-4-5"
        wordCount={2700}
        keywords={[
          "WCAG 2.4.5",
          "Multiple Ways",
          "site search accessibility",
          "sitemap accessibility",
          "navigation accessibility",
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
                    2.4.5 Multiple Ways
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
                Principle 2: Operable
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                Guideline 2.4 Navigable
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
              WCAG 2.4.5: Multiple Ways
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              Different people find pages differently. Some drill through menus,
              some scan a sitemap, some type a query into search. This criterion
              requires that{" "}
              <strong className="text-slate-900 dark:text-white">
                every page in a site can be located in more than one way
              </strong>{" "}
              — so a user who struggles with one navigation mechanism always has
              another route to the same content. The only exemption is pages
              that are a step in, or the result of, a process.
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
              More than one way is available to locate a Web page within a set
              of Web pages except where the Web Page is the result of, or a step
              in, a process.
            </blockquote>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4 text-sm">
              Two phrases carry the weight here. <em>&ldquo;Set of Web pages&rdquo;</em>{" "}
              means the criterion applies to pages that belong to a site or
              collection — a standalone single page trivially conforms.{" "}
              <em>&ldquo;Result of, or a step in, a process&rdquo;</em> is the
              one exception: pages inside a sequence like a checkout do not need
              to be reachable out of order.
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
                  Why multiple ways matter
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#what-counts">
                  What counts as a &ldquo;way&rdquo;
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#exception">
                  The process exception
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
              Why multiple ways matter
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              A large, deeply nested navigation menu is easy for a sighted mouse
              user to skim — and exhausting for many others. A screen reader
              user has to step through menu items one by one; a keyboard-only
              user has to tab through every link before the one they want; a
              user with low vision who zooms to 400% sees only a small slice of
              a mega-menu at a time. For all of them, a search box that jumps
              straight to the target page is dramatically faster.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              The reverse is also true. Users with cognitive disabilities often
              find search hard to use well — it demands recalling and spelling
              the right keyword. For them, browsing a visible structure such as
              a sitemap, a table of contents, or well-organized menus is easier,
              because recognizing the right link is a lighter task than
              recalling the right word. Neither mechanism is universally better;
              that is exactly why the criterion asks for more than one.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Concretely, 2.4.5 helps screen reader and keyboard users skip long
              navigation paths, helps users with memory or attention limitations
              choose the mechanism that suits them, and rescues everyone from
              the &ldquo;orphan page&rdquo; problem — content that exists but
              can only be found if you already know its URL.
            </p>
          </section>

          {/* What counts */}
          <section aria-labelledby="what-counts" className="mb-12">
            <h2
              id="what-counts"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              What counts as a &ldquo;way&rdquo;
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              W3C&rsquo;s Understanding document for 2.4.5 lists the accepted
              techniques. Any <strong className="text-slate-900 dark:text-white">two</strong>{" "}
              of these, each independently able to lead a user to the page, are
              enough to conform:
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  t: "Site search",
                  d: "A search feature that indexes the site's pages and returns links to them. It must actually cover the content — a search that only queries products does not help locate help articles.",
                },
                {
                  t: "Site map",
                  d: "An HTML page listing links to the pages of the site, usually organized to mirror the site hierarchy. (An XML sitemap for crawlers does not count — users cannot navigate with it.)",
                },
                {
                  t: "Navigation menus",
                  d: "Primary and secondary navigation that links, directly or via linked index pages, to the pages of the site. If every page is reachable through the menus, navigation counts as one way.",
                },
                {
                  t: "Table of contents",
                  d: "For documentation sets and long multi-page resources: a contents page whose links lead to each part of the set.",
                },
                {
                  t: "Links between related pages",
                  d: "'Related articles', 'See also', or next/previous links that connect all pages in the set to each other.",
                },
                {
                  t: "List of all pages",
                  d: "An index page — an A–Z index, archive listing, or category listing — that links to every page in the collection.",
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
              The mechanisms must be genuinely usable as routes to the page. A
              search box that errors out, a sitemap that was last updated three
              redesigns ago, or a &ldquo;related links&rdquo; block that omits
              half the site each provide zero ways, not one.
            </p>
          </section>

          {/* Exception */}
          <section aria-labelledby="exception" className="mb-12">
            <h2
              id="exception"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              The process exception
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              The criterion exempts any page that is{" "}
              <strong className="text-slate-900 dark:text-white">
                the result of, or a step in, a process
              </strong>
              . WCAG defines a process as a series of user actions where each
              action is required in order to complete an activity. These pages
              only make sense in sequence, so requiring a second route to them
              would be meaningless or actively harmful:
            </p>
            <ul className="space-y-3 mb-4">
              {[
                "The shipping, payment, and confirmation steps of a checkout — you cannot pay for a cart you have not filled.",
                "Step 3 of a multi-page registration or application wizard.",
                "A search results page — it is the result of the search process, generated by the user's query.",
                "A bank transfer confirmation screen that exists only after the user has entered transfer details.",
              ].map((m) => (
                <li
                  key={m}
                  className="flex gap-3 rounded-lg border border-slate-200 dark:border-slate-800 p-4"
                >
                  <span aria-hidden="true" className="text-blue-500 font-bold">
                    →
                  </span>
                  <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {m}
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Be careful not to stretch the exception. The <em>entry point</em>{" "}
              of a process — the product page, the &ldquo;Open an
              account&rdquo; page, the search form itself — is not a step in the
              process and still needs multiple ways to be found. The exception
              covers only the pages inside the sequence.
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
                  t: "Navigation menus + site search",
                  d: "A marketing site where every page is reachable through the header navigation, and a search box in the header indexes all pages. Two independent ways — passes.",
                },
                {
                  pass: true,
                  t: "Table of contents + search on a docs site",
                  d: "A documentation set with a persistent sidebar table of contents linking every article, plus full-text search. Passes, even without an HTML sitemap.",
                },
                {
                  pass: true,
                  t: "Checkout steps reachable only in order",
                  d: "The payment step of a checkout appears in no menu, no sitemap, and no search results. Passes — it is a step in a process and is exempt.",
                },
                {
                  pass: false,
                  t: "Deep pages reachable only through menus",
                  d: "A site whose only navigation mechanism is its menu hierarchy: no search, no sitemap, no index pages, no related links. One way is not more than one way — fails.",
                },
                {
                  pass: false,
                  t: "Orphaned campaign landing pages",
                  d: "Marketing landing pages that are linked from paid ads only. They appear in no navigation, no sitemap, and are excluded from site search. Zero on-site ways to locate them — fails.",
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
              One route vs. two routes
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              2.4.5 is a site-architecture criterion, so the &ldquo;fix&rdquo;
              is adding a second mechanism. Here a header that offers only menus
              gains an accessible site search.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- ✗ The menu hierarchy is the only way to reach any page -->
<header>
  <nav aria-label="Main">
    <ul>
      <li><a href="/products">Products</a></li>
      <li><a href="/docs">Docs</a></li>
      <li><a href="/support">Support</a></li>
    </ul>
  </nav>
</header>

<!-- ✓ Menus plus a labelled site search: two independent ways -->
<header>
  <nav aria-label="Main">
    <ul>
      <li><a href="/products">Products</a></li>
      <li><a href="/docs">Docs</a></li>
      <li><a href="/support">Support</a></li>
    </ul>
  </nav>
  <search>
    <form action="/search" role="search">
      <label for="site-search">Search this site</label>
      <input id="site-search" type="search" name="q" />
      <button type="submit">Search</button>
    </form>
  </search>
</header>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              An HTML sitemap users can actually navigate
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              An XML sitemap serves crawlers, not people. A human-readable
              sitemap page is a plain list of links, grouped under headings that
              mirror the site structure, and linked from every page (typically
              the footer).
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- /sitemap — linked from the site-wide footer -->
<main>
  <h1>Site map</h1>
  <h2>Products</h2>
  <ul>
    <li><a href="/products/scanner">Accessibility Scanner</a></li>
    <li><a href="/products/monitor">Continuous Monitoring</a></li>
  </ul>
  <h2>Documentation</h2>
  <ul>
    <li><a href="/docs/getting-started">Getting started</a></li>
    <li><a href="/docs/api">API reference</a></li>
  </ul>
</main>

<footer>
  <a href="/sitemap">Site map</a>
</footer>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Related links as a second way
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              On content sites, a &ldquo;related articles&rdquo; block can be
              one of the two mechanisms — provided the links genuinely connect
              the whole set of pages, not just a favored few.
            </p>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<aside aria-labelledby="related-heading">
  <h2 id="related-heading">Related articles</h2>
  <ul>
    <li><a href="/blog/alt-text-guide">How to write alt text</a></li>
    <li><a href="/blog/focus-styles">Designing visible focus styles</a></li>
    <li><a href="/blog/aria-mistakes">Five common ARIA mistakes</a></li>
  </ul>
</aside>`}</code>
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
                "Relying on the navigation menu as the only mechanism — no search, no sitemap, no index pages, no related links.",
                "Orphan pages: content linked from nowhere on the site (email campaigns or ads only), so there are zero on-site ways to find it.",
                "A site search that does not index all pages in the set — help articles, blog posts, or legal pages missing from results, leaving those pages with only one way.",
                "Pointing to an XML sitemap as the second way. Crawler sitemaps are not a navigation mechanism for users; only a human-readable HTML sitemap counts.",
                "A stale HTML sitemap that no longer reflects the site, so newer pages effectively have a single route.",
                "Claiming the process exception too broadly — e.g. treating an entire account area or a product detail page as 'part of a process' when it is an ordinary destination page.",
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
              How to test for 2.4.5
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "Inventory the navigation mechanisms",
                  d: "List every mechanism the site offers: menus, search, HTML sitemap, tables of contents, index pages, related-links blocks, breadcrumbs. You need at least two that can lead to any given page.",
                },
                {
                  t: "Pick sample pages and find two routes to each",
                  d: "Choose a representative sample — deep pages, recent pages, and pages from each section. For each, demonstrate two genuinely independent routes: for example, reach it through the menus, then find it again via search. If any page has only one route, the criterion fails.",
                },
                {
                  t: "Verify the mechanisms actually work",
                  d: "Search for exact titles of your sample pages and confirm they appear in results. Open the sitemap and check it includes recent content. A broken or stale mechanism does not count as a way.",
                },
                {
                  t: "Check for orphan pages",
                  d: "Crawl the site or export the page list from your CMS and compare it against pages reachable from the homepage. Pages that only external campaigns link to are failures unless they are steps in a process.",
                },
                {
                  t: "Apply the process exception deliberately",
                  d: "For each page you exempt, confirm it is genuinely the result of, or a step in, a sequence of required actions — checkout steps, wizard steps, search results. Entry points to those processes are not exempt.",
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
              Automated scanners cannot evaluate 2.4.5 — it is a judgment about
              site architecture, not any single page&rsquo;s markup. Work
              through it as part of the full{" "}
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

          <CriterionLinks number="2.4.5" />
        </article>

        {/* Related content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <RelatedContent
            content="multiple ways to locate a page site search sitemap table of contents navigation menus related links orphan pages process exception set of web pages navigable WCAG 2.4.5 Level AA"
            maxItems={6}
          />
        </section>
      </div>
    </>
  )
}
