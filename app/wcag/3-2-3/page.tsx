import type { Metadata } from "next"
import Link from "next/link"
import {
  ArticleStructuredData,
  BreadcrumbStructuredData,
} from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"
import { CriterionLinks } from "@/components/wcag/criterion-links"

export const metadata: Metadata = {
  title: "WCAG 3.2.3 Consistent Navigation — Same Nav Order",
  description:
    "Complete guide to WCAG 3.2.3 Consistent Navigation. Why repeated navigation must keep the same relative order on every page, pass/fail examples, code, and testing.",
  keywords: [
    "WCAG 3.2.3",
    "Consistent Navigation",
    "same relative order",
    "predictable navigation",
    "navigation accessibility",
    "repeated navigation mechanisms",
    "3.2.3 test",
    "consistent menus",
    "cognitive accessibility navigation",
    "set of web pages",
    "Level AA",
    "WCAG 2.2",
    "predictable",
  ],
  alternates: {
    canonical: "/wcag/3-2-3",
  },
  openGraph: {
    title: "WCAG 3.2.3 Consistent Navigation — Same Nav Order",
    description:
      "The definitive guide to WCAG 3.2.3: what 'same relative order' really means, what may change between pages, pass/fail examples, template code, and how to test Level AA.",
    url: "/wcag/3-2-3",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: "/api/og?title=WCAG%203.2.3%20Consistent%20Navigation&section=WCAG",
        width: 1200,
        height: 630,
        alt: "WCAG 3.2.3 Consistent Navigation guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WCAG 3.2.3 Consistent Navigation — The Complete Guide",
    description:
      "Repeated navigation must appear in the same relative order on every page — unless the user changes it. What that means in practice and how to test 3.2.3 Level AA.",
    images: [
      {
        url: "/api/og?title=WCAG%203.2.3%20Consistent%20Navigation&section=WCAG",
        width: 1200,
        height: 630,
      },
    ],
  },
}

const faqs = [
  {
    q: "What does WCAG 3.2.3 Consistent Navigation require?",
    a: "It requires that navigational mechanisms repeated on multiple web pages within a set of web pages occur in the same relative order each time they are repeated, unless a change is initiated by the user. In plain terms: if your header menu, footer links, sidebar, search box, and skip link appear on many pages, they must appear in the same order on all of them. It is a Level AA success criterion under Guideline 3.2 Predictable, introduced in WCAG 2.0 and unchanged in 2.1 and 2.2.",
  },
  {
    q: "What does 'same relative order' actually mean?",
    a: "Relative order is about sequence, not identity. Items may be added or removed between pages — a 'Admin' item that only appears for admins, or a sub-menu that expands in the current section — as long as the items that do repeat stay in the same order relative to each other. If the menu is Home, Products, Pricing, Contact on one page, it must not become Products, Home, Contact, Pricing on another. Inserting 'Docs' between Products and Pricing on some pages is fine.",
  },
  {
    q: "Who benefits from consistent navigation?",
    a: "Users with cognitive limitations, low vision, and blindness benefit most. People who rely on spatial memory or muscle memory — including screen magnifier users who only see a small part of the page — learn where controls live and go there without re-scanning. Screen reader users build a mental model of the page structure and use shortcuts based on it. People with cognitive disabilities avoid the heavy cost of re-learning each page's layout. When navigation reshuffles between pages, all of that learned efficiency is destroyed.",
  },
  {
    q: "Can I add or remove menu items on some pages without failing 3.2.3?",
    a: "Yes. The criterion governs the order of repeated items, not their presence. A page may omit items that are irrelevant to it, and a section may add local sub-navigation. What fails is reordering: the repeated items must keep the same sequence relative to one another everywhere they appear. Note that how those items are named is a separate criterion — 3.2.4 Consistent Identification requires components with the same function to be labelled consistently.",
  },
  {
    q: "What does 'unless a change is initiated by the user' mean?",
    a: "If the user themselves reorders the navigation — choosing a different sort order, pinning favorite items to the top, switching to a compact layout, or otherwise customizing via a mechanism the site provides — that is not a failure. The criterion targets changes the site makes unilaterally between pages. A preference the user set and can unset keeps the experience predictable, because the change was their own choice.",
  },
  {
    q: "How is 3.2.3 different from 3.2.4 Consistent Identification?",
    a: "They are sibling criteria under Guideline 3.2 Predictable, both Level AA, and they cover different dimensions of consistency. 3.2.3 is about position and order: repeated navigational mechanisms keep the same relative order across pages. 3.2.4 is about naming: components with the same functionality are identified the same way (same labels, same icons, same alt text) across pages. A menu that keeps its order but renames 'Search' to 'Find' on half the pages passes 3.2.3 and fails 3.2.4 — and vice versa.",
  },
]

export default function WCAG323Page() {
  return (
    <>
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "WCAG Success Criteria", url: "https://accessibility.build/wcag" },
          {
            name: "3.2.3 Consistent Navigation",
            url: "https://accessibility.build/wcag/3-2-3",
          },
        ]}
      />

      <ArticleStructuredData
        headline="WCAG 3.2.3 Consistent Navigation: The Complete Guide to Keeping Navigation in the Same Relative Order"
        description="The definitive guide to WCAG 3.2.3 Consistent Navigation: what 'same relative order' really means, what may change between pages, pass/fail examples, template code, and testing methods."
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
        image="https://accessibility.build/api/og?title=WCAG%203.2.3%20Consistent%20Navigation&section=WCAG"
        url="https://accessibility.build/wcag/3-2-3"
        wordCount={2700}
        keywords={[
          "WCAG 3.2.3",
          "Consistent Navigation",
          "same relative order",
          "predictable navigation",
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
                    3.2.3 Consistent Navigation
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
                Guideline 3.2 Predictable
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
              WCAG 3.2.3: Consistent Navigation
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              Users learn where things are. The search box top right, the skip
              link first, Home before Products before Pricing. This criterion
              protects that learning:{" "}
              <strong className="text-slate-900 dark:text-white">
                navigation repeated across pages must keep the same relative
                order on every page
              </strong>
              . Items can be added or dropped — but the ones that repeat must
              never be shuffled, unless the user reorders them.
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
              Navigational mechanisms that are repeated on multiple Web pages
              within a set of Web pages occur in the same relative order each
              time they are repeated, unless a change is initiated by the user.
            </blockquote>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4 text-sm">
              Three scoping notes. It applies to <em>repeated</em> mechanisms
              (headers, footers, sidebars, search, skip links) within a{" "}
              <em>set of pages</em> — a single standalone page conforms
              automatically. It demands the same <em>relative</em> order, not
              identical menus. And user-initiated changes are explicitly
              allowed.
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
                  Why consistency matters
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#relative-order">
                  What &ldquo;same relative order&rdquo; means
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
              Why consistency matters
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              Predictability is an accessibility feature. A screen magnifier
              user at high zoom sees perhaps a tenth of the page at once; after
              a few pages they stop scanning and go straight to where the search
              box <em>was last time</em>. A screen reader user learns that the
              fourth link in the header is Pricing and jumps there by count. A
              user with a cognitive disability builds a routine: skip link,
              menu, content. Every one of these strategies depends on the page
              behaving the same way each time.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              When a template reshuffles between sections — search moves from
              header to sidebar, the footer link order changes, the menu is
              alphabetized on some pages and by popularity on others — those
              users pay the full cost of learning the layout again on every
              page. For someone who reads slowly, navigates by memory, or
              fatigues quickly, that cost can make the site effectively
              unusable.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Consistent order also compounds with other criteria: a skip link
              that is always first (
              <Link
                href="/wcag/2-4-1"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                2.4.1 Bypass Blocks
              </Link>
              ), a logical focus order (
              <Link
                href="/wcag/2-4-3"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                2.4.3 Focus Order
              </Link>
              ), and consistent naming (
              <Link
                href="/wcag/3-2-4"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                3.2.4 Consistent Identification
              </Link>
              ) together make a site feel learnable instead of hostile.
            </p>
          </section>

          {/* Relative order */}
          <section aria-labelledby="relative-order" className="mb-12">
            <h2
              id="relative-order"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              What &ldquo;same relative order&rdquo; means
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              The phrase is precise:{" "}
              <strong className="text-slate-900 dark:text-white">
                relative order, not identical content
              </strong>
              . Repeated items must keep their sequence with respect to each
              other; the set of items may vary between pages.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/20 p-5">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  <span aria-hidden="true" className="text-emerald-600 mr-1">
                    ✓
                  </span>
                  Allowed between pages
                </h3>
                <ul className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-2 list-disc pl-5">
                  <li>Adding items: a section inserts local sub-navigation.</li>
                  <li>
                    Removing items: pages omit links that do not apply to them.
                  </li>
                  <li>
                    Expanding or collapsing: the current section&rsquo;s
                    sub-menu is open, others closed.
                  </li>
                  <li>
                    User-initiated changes: the user pins, sorts, or customizes
                    the navigation.
                  </li>
                </ul>
              </div>
              <div className="rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-5">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  <span aria-hidden="true" className="text-rose-500 mr-1">
                    ✗
                  </span>
                  Not allowed between pages
                </h3>
                <ul className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed space-y-2 list-disc pl-5">
                  <li>
                    Reordering repeated links: Home–Products–Pricing on one
                    page, Pricing–Home–Products on another.
                  </li>
                  <li>
                    Relocating repeated mechanisms in the reading order: search
                    before the menu here, after it there.
                  </li>
                  <li>
                    Different sort logic per template: alphabetical menu on blog
                    pages, popularity-sorted elsewhere.
                  </li>
                  <li>
                    Skip link first on some pages, buried mid-header on others.
                  </li>
                </ul>
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Order here means DOM and reading order, not just visual layout. A
              responsive design may present the same list as a horizontal bar on
              desktop and a hamburger drawer on mobile without failing —
              provided the sequence of the repeated items, as encountered by
              keyboard and screen reader, stays the same.
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
                  t: "Shared layout component on every page",
                  d: "A site renders header, navigation, and footer from one layout template, so every page presents skip link, logo, menu, and search in the same sequence. Passes.",
                },
                {
                  pass: true,
                  t: "Section adds a local sub-menu",
                  d: "The Docs section shows an extra sidebar of doc pages that other sections lack. The repeated global navigation keeps its order; the addition is fine. Passes.",
                },
                {
                  pass: true,
                  t: "User pins favorite items to the top",
                  d: "A dashboard lets each user pin their most-used sections to the top of the navigation. The change is initiated by the user, so the exception applies. Passes.",
                },
                {
                  pass: false,
                  t: "Search moves between templates",
                  d: "On the homepage the search field is the last element in the header; on article pages it precedes the menu in the reading order. A repeated mechanism changes relative position. Fails.",
                },
                {
                  pass: false,
                  t: "Footer links shuffled per page",
                  d: "The footer lists About, Careers, Privacy, Terms — but each template hard-codes its own copy in a different order. Repeated links reordered between pages. Fails.",
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
              Per-page markup vs. one shared layout
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              The most reliable technique is structural: render repeated
              navigation from a single shared template or component, so it{" "}
              <em>cannot</em> drift between pages.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- ✗ Each page hand-codes its own header — order drifts -->
<!-- home.html -->
<header>
  <nav><a href="/">Home</a> <a href="/pricing">Pricing</a>
       <a href="/products">Products</a></nav>
</header>
<!-- about.html -->
<header>
  <nav><a href="/products">Products</a> <a href="/">Home</a>
       <a href="/pricing">Pricing</a></nav>
</header>

<!-- ✓ One layout component renders navigation everywhere -->
// app/layout.tsx (Next.js)
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <a href="#main" className="skip-link">Skip to content</a>
        <SiteHeader />   {/* same order on every page */}
        <main id="main">{children}</main>
        <SiteFooter />   {/* same order on every page */}
      </body>
    </html>
  )
}`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Navigation data as a single source of truth
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Drive menus and footers from one ordered data structure. Pages may
              filter items out, but never re-sort them — filtering preserves
              relative order; sorting destroys it.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`// nav-items.ts — one canonical order for the whole site
export const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/docs", label: "Docs" },
  { href: "/pricing", label: "Pricing" },
  { href: "/admin", label: "Admin", requires: "admin" },
]

// ✓ Filtering keeps relative order — Admin simply disappears
const visible = NAV_ITEMS.filter(
  (item) => !item.requires || user.roles.includes(item.requires)
)

// ✗ Re-sorting per page breaks 3.2.3
const broken = [...NAV_ITEMS].sort((a, b) =>
  pageViews[b.href] - pageViews[a.href] // "popular first" on some pages
)`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              User-initiated reordering is allowed
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Offering the user an explicit control that reorders navigation is
              fine — the exception in the normative text covers exactly this.
            </p>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- ✓ The user chooses the order; the site persists their choice -->
<nav aria-label="Your workspaces">
  <label for="nav-sort">Sort workspaces</label>
  <select id="nav-sort" name="nav-sort">
    <option value="default">Default order</option>
    <option value="alpha">Alphabetical</option>
    <option value="recent">Recently used</option>
  </select>
  <ul id="workspace-list">…</ul>
</nav>`}</code>
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
                "Hand-coded headers or footers per template that list the same links in different orders on different pages.",
                "Auto-sorting repeated navigation differently per context — alphabetical here, most-popular there — without the user asking for it.",
                "Moving a repeated mechanism to a different position in the reading order between templates: search before the menu on one page, after it on another.",
                "A skip link that is the first focusable element on most pages but missing or placed mid-header on others.",
                "Redesigning one section's navigation in isolation, so half the site uses the new order and half the old.",
                "DOM order that contradicts visual order on some templates only — CSS keeps things looking consistent while keyboard and screen reader order silently changes.",
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
              How to test for 3.2.3
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "List the repeated navigational mechanisms",
                  d: "Identify everything that recurs across pages: skip links, header menu, search, breadcrumbs, sidebar navigation, footer link groups, 'back to top' controls.",
                },
                {
                  t: "Sample pages from every template",
                  d: "Pick pages built from each distinct template or layout — homepage, listing pages, detail pages, blog, docs, account area. Inconsistencies live between templates, not within one.",
                },
                {
                  t: "Compare the order of repeated items",
                  d: "For each mechanism, note the sequence of its items on each sampled page and compare. Added or removed items are fine; any change in the relative order of the repeated items is a failure.",
                },
                {
                  t: "Verify the reading order, not just the pixels",
                  d: "Tab through each sampled page and, with a screen reader, walk the header and footer. The keyboard/announcement order is what must be consistent — CSS can make different DOM orders look identical.",
                },
                {
                  t: "Attribute any differences",
                  d: "Where order does differ, check whether the user initiated it via an explicit preference or control. If the site changed it unilaterally, 3.2.3 fails.",
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
              Like the other Predictable criteria, this is a cross-page,
              manual comparison that automated single-page scanners cannot
              perform. Fold it into your template review and the full{" "}
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

          <CriterionLinks number="3.2.3" />
        </article>

        {/* Related content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <RelatedContent
            content="consistent navigation same relative order repeated navigational mechanisms predictable navigation menus footer links skip link template layout cognitive accessibility WCAG 3.2.3 Level AA"
            maxItems={6}
          />
        </section>
      </div>
    </>
  )
}
