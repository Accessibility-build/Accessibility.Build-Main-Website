import type { Metadata } from "next"
import Link from "next/link"
import WCAGSEOEnhancements from "@/components/wcag/seo-enhancements"
import WCAGBreadcrumb from "@/components/wcag/breadcrumb"
import { FAQStructuredData } from "@/components/seo/structured-data"
import { CriterionLinks } from "@/components/wcag/criterion-links"

export const metadata: Metadata = {
  title: "WCAG 2.4.8 Location — Show Users Where They Are",
  description:
    "WCAG 2.4.8 Location explained: give users information about where they are within a site — breadcrumbs, aria-current navigation, and site maps. Code and testing.",
  keywords: [
    "WCAG 2.4.8",
    "Location",
    "breadcrumb accessibility",
    "aria-current page",
    "site map accessibility",
    "orientation within site",
    "navigation highlighting",
    "Level AAA",
    "WCAG 2.2",
  ],
  alternates: {
    canonical: "/wcag/2-4-8",
  },
  openGraph: {
    title: "WCAG 2.4.8 Location — Show Users Where They Are",
    description:
      "Information about the user's location within a set of pages must be available. Breadcrumb patterns, aria-current, and site maps — with code and testing steps.",
    url: "/wcag/2-4-8",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: "/api/og?title=WCAG%202.4.8%20Location&section=WCAG",
        width: 1200,
        height: 630,
        alt: "WCAG 2.4.8 Location guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WCAG 2.4.8 Location — Show Users Where They Are",
    description:
      "Breadcrumbs, aria-current navigation, and site maps: how to tell users where they are within a site, and how to test WCAG 2.4.8.",
    images: [
      {
        url: "/api/og?title=WCAG%202.4.8%20Location&section=WCAG",
        width: 1200,
        height: 630,
      },
    ],
  },
}

const faqs = [
  {
    question: "What does WCAG 2.4.8 Location require?",
    answer:
      "It requires that information about the user's location within a set of web pages is available. In other words, on any page of a multi-page site, users should be able to work out where they are relative to the whole — which section they are in, and how this page relates to the site's structure. Breadcrumb trails, highlighted navigation with aria-current, descriptive page titles that include the section, and site maps are the standard ways to provide it. It is a Level AAA criterion under Guideline 2.4 Navigable.",
  },
  {
    question: "Is a breadcrumb trail required to pass 2.4.8?",
    answer:
      "No single technique is mandated — the requirement is that location information is available by some means. A breadcrumb trail is the most direct technique (W3C technique G65), but indicating the current page within a persistent navigation menu (G128), stating the parent section, providing a site map (G63), or even a clear 'you are here' text line can satisfy it. Breadcrumbs are popular because they simultaneously show position and provide one-click escape routes to each ancestor level.",
  },
  {
    question: "How should a breadcrumb be marked up accessibly?",
    answer:
      "Use a nav element labelled 'Breadcrumb' containing an ordered list of links, with aria-current='page' on the final item representing the current page. The nav label lets screen reader users find it in the landmarks list; the ordered list conveys the hierarchy ('list, 3 items'); and aria-current tells them which item is the page they are on. Visual separators like slashes or chevrons should be decorative (CSS or aria-hidden) so they are not read aloud.",
  },
  {
    question: "How does 2.4.8 relate to 2.4.2 Page Titled and 2.4.5 Multiple Ways?",
    answer:
      "They form the orientation cluster of Guideline 2.4. 2.4.2 (A) requires each page to have a title describing its topic or purpose — a title like 'Warranty — Support — Acme' already carries location information. 2.4.5 (AA) requires more than one way to find a page (search, site map, navigation). 2.4.8 (AAA) completes the picture: once you have arrived, the page must tell you where you are within the whole. A site with structured titles, consistent navigation that marks the current section, and breadcrumbs typically satisfies all three.",
  },
  {
    question: "Who benefits from location information?",
    answer:
      "People with short-term memory or attention disabilities who lose track of how they got to a page; screen reader users who land deep in a site from a search result and need context without visually scanning the layout; people with cognitive disabilities who rely on consistent orientation cues to build a mental model of the site; and frankly everyone arriving from search engines — around half of sessions start on a deep page, not the home page. Location cues turn 'lost in the middle of a site' into 'oriented and one click from anywhere above me'.",
  },
  {
    question: "Does 2.4.8 apply to single-page applications and checkout flows?",
    answer:
      "Yes, wherever there is a 'set of web pages' or an equivalent set of views. In an SPA, each routed view should still expose location: update the document title, keep the navigation's aria-current in sync with the route, and render breadcrumbs for hierarchical content. For linear processes like checkouts, a step indicator ('Step 2 of 4: Shipping address') is the location information — it tells users where they are within the set of steps, which is exactly the intent of the criterion.",
  },
]

export default function WCAG248Page() {
  return (
    <>
      <WCAGSEOEnhancements
        title="WCAG 2.4.8: Location"
        description="Information about the user's location within a set of web pages is available."
        criteria="2.4.8"
        level="AAA"
        principle="Operable"
        guideline="2.4 Navigable"
        url="https://accessibility.build/wcag/2-4-8"
        category="Navigable"
        relatedCriteria={["2.4.2", "2.4.4", "2.4.6"]}
      />
      <FAQStructuredData faqs={faqs} />

      <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <WCAGBreadcrumb items={[]} current="2.4.8 Location" />

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
                Guideline 2.4 Navigable
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
              WCAG 2.4.8: Location
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              Half of your visitors never see your home page — they arrive from a
              search engine, deep inside the site, with no idea how this page relates
              to anything else.{" "}
              <strong className="text-slate-900 dark:text-white">
                2.4.8 requires that information about the user&rsquo;s location
                within a set of pages is available
              </strong>
              : a breadcrumb trail, a navigation menu that marks the current section,
              a step indicator — some reliable answer to the question &ldquo;where am
              I?&rdquo;
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
              Information about the user&rsquo;s location within a set of Web pages
              is available.
            </blockquote>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4 text-sm">
              &ldquo;Available&rdquo; is deliberately open: no specific widget is
              mandated. Breadcrumbs, current-page markers in navigation, section-
              bearing page titles, site maps, and step indicators are all valid
              routes — what matters is that a user on any page can determine where
              that page sits within the whole.
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
              <li><a className="hover:underline" href="#who">Who this helps</a></li>
              <li><a className="hover:underline" href="#techniques">Techniques that satisfy 2.4.8</a></li>
              <li><a className="hover:underline" href="#code">Code examples</a></li>
              <li><a className="hover:underline" href="#examples">Pass and fail examples</a></li>
              <li><a className="hover:underline" href="#mistakes">Common failures</a></li>
              <li><a className="hover:underline" href="#testing">How to test</a></li>
              <li><a className="hover:underline" href="#faq">FAQ</a></li>
            </ul>
          </nav>

          {/* Who */}
          <section aria-labelledby="who" className="mb-12">
            <h2 id="who" className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Who this helps
            </h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              {[
                {
                  t: "People with memory or attention disabilities",
                  d: "Losing the thread of 'how did I get here?' mid-task is routine; location cues let them re-orient instantly instead of starting over.",
                },
                {
                  t: "Screen reader users",
                  d: "Without a visual gestalt of the layout, a labelled breadcrumb landmark or an announced 'current page' item is the fastest answer to 'where am I?'",
                },
                {
                  t: "People with cognitive disabilities",
                  d: "Consistent orientation cues — the same breadcrumb, the same highlighted nav — make a large site learnable rather than a maze.",
                },
                {
                  t: "Search and link arrivals",
                  d: "Anyone landing on a deep page from Google, a chat message, or a bookmark gets context and one-click paths to broader levels.",
                },
              ].map((item) => (
                <div key={item.t} className="rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{item.t}</h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{item.d}</p>
                </div>
              ))}
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              As a bonus, the same structures feed search engines: breadcrumb markup
              is displayed directly in search results, improving click-through — one
              of the clearest cases where accessibility work and SEO are the same
              work.
            </p>
          </section>

          {/* Techniques */}
          <section aria-labelledby="techniques" className="mb-12">
            <h2 id="techniques" className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Techniques that satisfy 2.4.8
            </h2>
            <ul className="space-y-3">
              {[
                {
                  t: "Breadcrumb trail (G65)",
                  d: "Shows the hierarchical path — Home / Support / Warranty — with each ancestor as a link. Position plus escape routes in one compact strip.",
                },
                {
                  t: "Current page indicated in navigation (G128)",
                  d: "The persistent menu marks the active section and page, visually and with aria-current, so orientation travels with the navigation itself.",
                },
                {
                  t: "Page titles that carry the hierarchy (G127 + 2.4.2)",
                  d: "A title like 'Warranty — Support — Acme' locates the page in the tab bar, bookmarks, history, and the first thing a screen reader announces.",
                },
                {
                  t: "Site map (G63)",
                  d: "A dedicated page showing the full structure gives users a reference map; linking to it from every page provides on-demand orientation.",
                },
                {
                  t: "Step indicators for linear processes",
                  d: "'Step 2 of 4: Shipping' locates the user within a defined sequence — the location principle applied to flows instead of hierarchies.",
                },
              ].map((item) => (
                <li key={item.t} className="flex gap-3 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
                  <span aria-hidden="true" className="text-purple-500 font-bold">→</span>
                  <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    <strong className="text-slate-900 dark:text-white">{item.t}</strong> — {item.d}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Code */}
          <section aria-labelledby="code" className="mb-12">
            <h2 id="code" className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Code examples
            </h2>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              An accessible breadcrumb trail
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              A labelled nav landmark, an ordered list for the hierarchy,{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                aria-current=&quot;page&quot;
              </code>{" "}
              on the final crumb, and decorative separators kept out of the
              accessibility tree.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<nav aria-label="Breadcrumb">
  <ol class="breadcrumb">
    <li><a href="/">Home</a></li>
    <li><a href="/support">Support</a></li>
    <li><a href="/support/returns">Returns &amp; refunds</a></li>
    <li aria-current="page">Warranty claims</li>
  </ol>
</nav>

<style>
  .breadcrumb { display: flex; flex-wrap: wrap; gap: .5rem; list-style: none; }
  /* Separator is pure decoration — CSS content is not exposed as text
     to most screen readers, and never part of the link names */
  .breadcrumb li + li::before { content: "/"; margin-inline-end: .5rem; }
  .breadcrumb [aria-current="page"] { font-weight: 600; }
</style>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Marking the current page in site navigation
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">
                aria-current=&quot;page&quot;
              </code>{" "}
              is announced by screen readers (&ldquo;current page&rdquo;); pair it
              with a visual treatment that does not rely on color alone.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<nav aria-label="Main">
  <ul>
    <li><a href="/products">Products</a></li>
    <li><a href="/docs" aria-current="page">Documentation</a></li>
    <li><a href="/pricing">Pricing</a></li>
  </ul>
</nav>

<style>
  /* Visible marker beyond color: underline + weight */
  nav [aria-current="page"] {
    font-weight: 700;
    text-decoration: underline;
    text-underline-offset: 4px;
  }
</style>

<!-- SPA note: keep it in sync with the route -->
<script>
  function markCurrent(pathname) {
    document.querySelectorAll("nav [aria-current]")
      .forEach((el) => el.removeAttribute("aria-current"));
    document
      .querySelector(\`nav a[href="\${pathname}"]\`)
      ?.setAttribute("aria-current", "page");
    // And update the title: "Documentation — Acme"
  }
</script>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Breadcrumb structured data (bonus for search)
            </h3>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home",
      "item": "https://example.com/" },
    { "@type": "ListItem", "position": 2, "name": "Support",
      "item": "https://example.com/support" },
    { "@type": "ListItem", "position": 3, "name": "Warranty claims" }
  ]
}
</script>`}</code>
            </pre>
          </section>

          {/* Examples */}
          <section aria-labelledby="examples" className="mb-12">
            <h2 id="examples" className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Pass and fail examples
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/20 p-5">
                <h3 className="font-semibold text-emerald-800 dark:text-emerald-300 mb-2">✓ Passes 2.4.8</h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed list-disc pl-4">
                  <li>A documentation site with a breadcrumb on every article plus a sidebar tree that highlights the current page.</li>
                  <li>An e-commerce product page showing Home / Audio / Headphones / [Product], with each ancestor linked.</li>
                  <li>A checkout with a visible, announced &ldquo;Step 3 of 4: Payment&rdquo; indicator.</li>
                  <li>A small site whose persistent nav marks the current page with aria-current and a visible underline — sufficient on its own for a flat structure.</li>
                </ul>
              </div>
              <div className="rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-5">
                <h3 className="font-semibold text-rose-800 dark:text-rose-300 mb-2">✗ Fails 2.4.8</h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed list-disc pl-4">
                  <li>A deep knowledge-base article reachable from search with no breadcrumb, no highlighted nav, and a title that names only the article.</li>
                  <li>A multi-level store where category pages give no indication of which department you are browsing.</li>
                  <li>An SPA that swaps views without updating the title or the navigation&rsquo;s current-page marker — every view claims to be nowhere.</li>
                  <li>A breadcrumb rendered as plain text with separators baked into link names (&ldquo;Home &gt;&rdquo;), unlabeled and unusable as a landmark.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Common failures */}
          <section aria-labelledby="mistakes" className="mb-12">
            <h2 id="mistakes" className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Common failures
            </h2>
            <ul className="space-y-3">
              {[
                "No location information at all on deep pages — the site assumes everyone starts at the home page and remembers the route.",
                "Breadcrumbs that exist visually but are inaccessible: no nav landmark or label, separators read aloud as part of link text, or no aria-current on the final item.",
                "Current-page indication by color alone in navigation, invisible to users who cannot perceive the color difference (and to screen readers without aria-current).",
                "SPAs that update the view but not the document title or navigation state, so assistive technology has no location signal after the first route change.",
                "Breadcrumbs showing the user's click history instead of the site hierarchy — location means where the page lives, not how this visitor wandered to it.",
                "Inconsistent placement or structure of the location cue across sections, undermining the very orientation habit it should build (see 3.2.3 Consistent Navigation).",
                "Step indicators that are purely visual graphics with no text alternative announcing the current step and total.",
              ].map((m) => (
                <li key={m} className="flex gap-3 rounded-lg border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-4">
                  <span aria-hidden="true" className="text-rose-500 font-bold">✗</span>
                  <span className="text-slate-700 dark:text-slate-300 leading-relaxed">{m}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Testing */}
          <section aria-labelledby="testing" className="mb-12">
            <h2 id="testing" className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              How to test for 2.4.8
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "Deep-link into the site cold",
                  d: "Open several deep pages directly, as a search engine would deliver them. On each, answer three questions using only what the page shows: What section am I in? What is one level up? How do I get to the top?",
                },
                {
                  t: "Check every hierarchical level",
                  d: "Walk one full branch — home, section, subsection, detail page — and confirm the location cue (breadcrumb, nav highlight, title) is present and accurate at each level, not just on leaf pages.",
                },
                {
                  t: "Inspect the markup",
                  d: "Breadcrumb inside a labelled <nav>, hierarchy as a list, aria-current='page' on the current item, separators decorative. Navigation current-page markers must exist in the accessibility tree, not just in CSS.",
                },
                {
                  t: "Listen with a screen reader",
                  d: "From page load: does the title announce the section? Can you find a 'Breadcrumb' landmark? Does the current nav item announce 'current page'? Orientation must be perceivable non-visually.",
                },
                {
                  t: "Test dynamic navigation",
                  d: "In SPAs and filtered views, navigate between routes and confirm the title, breadcrumb, and aria-current update in step. Also verify checkout or wizard steps announce their position ('Step 2 of 4').",
                },
              ].map((step, i) => (
                <li key={step.t} className="flex gap-4 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{step.t}</h3>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{step.d}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-5">
              Related criteria to verify together:{" "}
              <Link href="/wcag/2-4-2" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                2.4.2 Page Titled
              </Link>{" "}
              (titles carry the location into tabs and history) and{" "}
              <Link href="/wcag/2-4-6" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                2.4.6 Headings and Labels
              </Link>{" "}
              (the h1 should confirm where the user landed). Then continue with the
              full{" "}
              <Link href="/checklists/wcag-2-2" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                WCAG 2.2 checklist
              </Link>
              .
            </p>
          </section>

          {/* FAQ */}
          <section aria-labelledby="faq" className="mb-4">
            <h2 id="faq" className="text-3xl font-bold text-slate-900 dark:text-white mb-6">
              Frequently asked questions
            </h2>
            <div className="space-y-4">
              {faqs.map((f) => (
                <details
                  key={f.question}
                  className="group rounded-xl border border-slate-200 dark:border-slate-800 p-5 [&_summary]:cursor-pointer"
                >
                  <summary className="font-semibold text-slate-900 dark:text-white list-none flex items-center justify-between gap-4">
                    {f.question}
                    <span aria-hidden="true" className="text-slate-400 group-open:rotate-180 transition-transform">
                      ▾
                    </span>
                  </summary>
                  <p className="mt-3 text-slate-600 dark:text-slate-300 leading-relaxed">{f.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <CriterionLinks number="2.4.8" />
        </article>
      </div>
    </>
  )
}
