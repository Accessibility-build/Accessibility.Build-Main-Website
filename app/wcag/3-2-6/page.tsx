import type { Metadata } from "next"
import Link from "next/link"
import {
  ArticleStructuredData,
  BreadcrumbStructuredData,
} from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"
import { CriterionLinks } from "@/components/wcag/criterion-links"

export const metadata: Metadata = {
  title: "WCAG 3.2.6 Consistent Help — Keep Help in One Place",
  description:
    "Complete guide to WCAG 3.2.6 Consistent Help. Learn why help mechanisms — contact details, chat, help links, self-help — must appear in the same relative order across pages, which help types are covered, copy-ready code, testing methods, and common mistakes.",
  keywords: [
    "WCAG 3.2.6",
    "Consistent Help",
    "help mechanism accessibility",
    "consistent navigation",
    "contact information accessibility",
    "help link placement",
    "chat widget accessibility",
    "cognitive accessibility",
    "consistent order",
    "Level A",
    "WCAG 2.2",
  ],
  alternates: {
    canonical: "https://accessibility.build/wcag/3-2-6",
  },
  openGraph: {
    title:
      "WCAG 3.2.6 Consistent Help — Keep Help in the Same Place on Every Page (Level A)",
    description:
      "The definitive guide to WCAG 3.2.6: when a help mechanism repeats across pages, it must appear in the same relative order. Which help types count, code, and testing.",
    url: "https://accessibility.build/wcag/3-2-6",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: "https://accessibility.build/api/og?title=WCAG%203.2.6%20Consistent%20Help&section=WCAG",
        width: 1200,
        height: 630,
        alt: "WCAG 3.2.6 Consistent Help guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WCAG 3.2.6 Consistent Help — Keep Help in the Same Place",
    description:
      "New in WCAG 2.2: if a help mechanism is available on multiple pages, keep it in the same relative order. The four help types, code, and how to test.",
  },
}

const helpTypes = [
  {
    name: "Human contact details",
    detail:
      "A phone number, email address, physical address, or social-media handle a user can use to reach a person. If your pages surface a support phone number or a contact email, that is a covered help mechanism and its placement must stay consistent.",
  },
  {
    name: "Human contact mechanism",
    detail:
      "A way to reach a person without publishing static contact details — a contact form, a messaging service, a Slack or Discord invite, or a callback request. It connects the user to a human, so it falls under the criterion when repeated across pages.",
  },
  {
    name: "Self-help option",
    detail:
      "A link or section that helps users help themselves — a Help or FAQ page, a support portal, a documentation hub, or a 'How do I…?' resource. When it appears on multiple pages, keep it in a consistent relative location.",
  },
  {
    name: "A fully automated contact mechanism",
    detail:
      "A chatbot or automated assistant that answers questions or resolves issues without a human. A persistent chat widget in the corner of every page is the classic example — and it must stay in a consistent relative order across the set of pages.",
  },
]

const faqs = [
  {
    q: "What does WCAG 3.2.6 Consistent Help require?",
    a: "WCAG 3.2.6 requires that if a web page contains one of four help mechanisms — human contact details, a human contact mechanism, a self-help option, or a fully automated contact mechanism (chatbot) — and that same help is available on multiple pages in a set, it must appear in the same relative order on each page, relative to the other content. It is a Level A success criterion, new in WCAG 2.2. It does not force you to add help; it only governs the placement of help you already offer.",
  },
  {
    q: "Does 3.2.6 mean I have to add a help link or contact page to my site?",
    a: "No. 3.2.6 does not require you to provide any help mechanism at all. It only applies when you already offer one of the four covered help types on more than one page. If you have no help mechanism, the criterion is met by default. But if you do have, say, a support chat widget or a 'Contact us' link that recurs across pages, those must be placed consistently.",
  },
  {
    q: "What does 'same relative order' actually mean?",
    a: "It means the help mechanism keeps its position relative to the other things on the page — not that it must sit at identical pixel coordinates. If your help link is the last item in the header on one page, it should be the last item in the header on every page in the set. The layout can reflow responsively; what must not change is the order in which the help appears relative to surrounding content. A help link that is in the top-right on one page and buried in the footer on the next fails.",
  },
  {
    q: "Does the help have to look the same on every page?",
    a: "The criterion is about location and order, not visual styling. It is fine for a chat widget to render slightly differently across breakpoints, or for a contact link to inherit page-specific theming, as long as it occupies the same relative position in the content order. Consistency of placement is what helps users build a reliable mental model of where to find help.",
  },
  {
    q: "How is 3.2.6 different from 3.2.3 Consistent Navigation?",
    a: "3.2.3 Consistent Navigation (AA) covers navigational components that repeat across pages — they must appear in the same relative order. 3.2.6 Consistent Help (A) applies the same 'same relative order' idea specifically to help mechanisms, and it is a lower conformance level (A). They are complementary: 3.2.3 keeps your nav predictable, 3.2.6 keeps your help predictable. A help link that is also a nav item should satisfy both.",
  },
  {
    q: "Does 3.2.6 apply to a single page or a set of pages?",
    a: "It applies across a set of web pages that share the help mechanism. On a single, standalone page there is no 'other page' to be consistent with, so the criterion is trivially satisfied. The value appears when a user moves between pages: they should not have to re-hunt for help each time. The 'set of pages' is typically the pages of one site or web app that carry the same help option.",
  },
  {
    q: "Why is inconsistent help placement an accessibility problem?",
    a: "Users with cognitive disabilities, low digital literacy, or anxiety rely on predictability. When the route to help moves around, finding assistance becomes its own puzzle — exactly when the user is already stuck and stressed. Consistent placement lets people learn once where help lives and return to it reliably. It also benefits screen reader and keyboard users, who otherwise have to re-scan each page's structure to relocate the help control.",
  },
]

export default function WCAG326Page() {
  return (
    <>
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          {
            name: "WCAG Success Criteria",
            url: "https://accessibility.build/wcag",
          },
          {
            name: "3.2.6 Consistent Help",
            url: "https://accessibility.build/wcag/3-2-6",
          },
        ]}
      />

      <ArticleStructuredData
        headline="WCAG 3.2.6 Consistent Help: The Complete Guide to Keeping Help in a Predictable Place"
        description="The definitive guide to WCAG 3.2.6 Consistent Help: why help mechanisms must appear in the same relative order across a set of pages, the four covered help types, code examples, testing methods, and common mistakes."
        author={{
          name: "Accessibility.build Team",
          url: "https://accessibility.build/about",
        }}
        publisher={{
          name: "Accessibility.build",
          logo: "https://accessibility.build/android-chrome-512x512.png",
        }}
        datePublished="2026-07-04"
        dateModified="2026-07-04"
        image="https://accessibility.build/api/og?title=WCAG%203.2.6%20Consistent%20Help&section=WCAG"
        url="https://accessibility.build/wcag/3-2-6"
        wordCount={2700}
        keywords={[
          "WCAG 3.2.6",
          "Consistent Help",
          "help mechanism",
          "consistent order",
          "contact information accessibility",
          "chat widget accessibility",
          "Level A",
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
                    3.2.6 Consistent Help
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
                Principle 3: Understandable
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300">
                New in WCAG 2.2
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
              WCAG 3.2.6: Consistent Help
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              When a user needs help, they shouldn&apos;t have to hunt for it. If
              your site offers a help mechanism — a contact number, a chat widget,
              a help link — on more than one page, this Level A criterion, new in
              WCAG 2.2, requires it to appear in the{" "}
              <strong className="text-slate-900 dark:text-white">
                same relative order
              </strong>{" "}
              on every page. It doesn&apos;t make you add help; it just makes the
              help you already offer <em>predictable</em>, so people can find it
              the same way every time.
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
              If a web page contains any of the following help mechanisms, and
              those mechanisms are repeated on multiple web pages within a set of
              web pages, they occur in the{" "}
              <strong>same relative order</strong> relative to other page content,
              unless a change is initiated by the user: human contact details;
              human contact mechanism; self-help option; a fully automated contact
              mechanism.
            </blockquote>
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
                  Why consistent help matters
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#help-types">
                  The four help mechanisms
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#relative-order">
                  What &quot;same relative order&quot; means
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#patterns">
                  Patterns that satisfy 3.2.6
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#code">
                  Code examples
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#mistakes">
                  Common mistakes
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#testing">
                  How to test
                </a>
              </li>
              <li>
                <a className="hover:underline" href="#related-criteria">
                  Related success criteria
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
              Why consistent help matters
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              People look for help precisely when they are already stuck. A user
              who cannot complete a form, understand a fee, or find a product is at
              the edge of giving up — and in that moment, the last thing they can
              afford is a second puzzle: <em>where did the help go?</em> When the
              route to assistance jumps around from page to page — top-right here,
              buried in the footer there, gone entirely on the checkout screen —
              finding help becomes its own task, layered on top of the problem the
              user already couldn&apos;t solve.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              For people with cognitive and learning disabilities, this is
              decisive. Predictable placement lets someone learn once where help
              lives and return to it reliably, without re-scanning every page.
              Users with anxiety are spared the stress of searching; users with low
              digital literacy are spared a hunt they may not win; screen reader
              and keyboard users are spared having to re-explore each page&apos;s
              structure to relocate a control they already found once.
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              3.2.6 asks for something modest and high-value: keep the help you
              offer in a consistent, predictable place. It is a sibling to{" "}
              <Link
                href="/wcag/3-3-7"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                3.3.7 Redundant Entry
              </Link>{" "}
              — the two Level A criteria WCAG 2.2 added to reduce cognitive load —
              and, because WCAG 2.2 AA is the reference standard for the{" "}
              <Link
                href="/guides/section-504-web-accessibility-deadline"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                DOJ Title II rule
              </Link>{" "}
              and the European Accessibility Act, it is also a compliance target.
            </p>
          </section>

          {/* Help types */}
          <section aria-labelledby="help-types" className="mb-12">
            <h2
              id="help-types"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              The four help mechanisms
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              3.2.6 applies only to these four kinds of help. If your pages carry
              one of them and it repeats across the set, its placement must be
              consistent. Note the criterion does not require you to <em>provide</em>{" "}
              any of these — only to place consistently whatever you do offer.
            </p>
            <div className="space-y-4">
              {helpTypes.map((c) => (
                <div
                  key={c.name}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 p-6"
                >
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                    {c.name}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    {c.detail}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Relative order */}
          <section aria-labelledby="relative-order" className="mb-12">
            <h2
              id="relative-order"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              What &quot;same relative order&quot; means
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              The requirement is about <strong>order relative to other content</strong>,
              not fixed pixel coordinates. Your layout can reflow responsively and
              your help control can restyle across breakpoints — what must stay
              stable is where the help sits in the sequence of page content.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-950/20 p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300 mb-3">
                  Passes
                </h3>
                <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                  <li>
                    A &quot;Contact support&quot; link that is always the last item
                    in the header, on every page.
                  </li>
                  <li>
                    A chat widget pinned to the same corner sitewide.
                  </li>
                  <li>
                    A help link that reflows from a top bar (desktop) into a menu
                    (mobile) but keeps its order within that menu across pages.
                  </li>
                  <li>
                    Help placement that only moves because the user chose to
                    reorder or collapse it.
                  </li>
                </ul>
              </div>
              <div className="rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/20 p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-rose-700 dark:text-rose-300 mb-3">
                  Fails
                </h3>
                <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                  <li>
                    A support number in the header on the home page but only in the
                    footer on the pricing page.
                  </li>
                  <li>
                    A chat bubble that appears bottom-right on most pages but
                    top-left during checkout.
                  </li>
                  <li>
                    A &quot;Help&quot; link that is first in the nav on one page and
                    last on another.
                  </li>
                  <li>
                    Help that vanishes entirely on the exact pages (checkout,
                    forms) where users need it most.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Patterns */}
          <section aria-labelledby="patterns" className="mb-12">
            <h2
              id="patterns"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Patterns that satisfy 3.2.6
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              The reliable way to meet 3.2.6 is to render your help mechanism from
              a single shared layout component, so its position is defined in one
              place and inherited by every page. Then it cannot drift.
            </p>
            <ul className="space-y-3">
              {[
                "Put the help link or contact detail in a shared header or footer component used by every page in the set — one source of truth for its position.",
                "Render persistent chat and support widgets from the root layout, not per-page, so they land in the same relative spot everywhere.",
                "Keep help present on high-stakes pages — checkout, sign-up, error, and form pages — not just marketing pages.",
                "If help lives in the navigation, keep it in the same position within the nav order (see 3.2.3 Consistent Navigation).",
                "When the layout reflows for mobile, preserve the help's order within its container rather than relocating it.",
              ].map((p) => (
                <li
                  key={p}
                  className="flex gap-3 rounded-lg border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/20 p-4"
                >
                  <span aria-hidden="true" className="text-emerald-600 font-bold">
                    ✓
                  </span>
                  <span className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {p}
                  </span>
                </li>
              ))}
            </ul>
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
              A shared header help link (one source of truth)
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Rendering the help link from a single header component that every
              page uses guarantees it keeps the same relative order automatically —
              you cannot forget it on one page or move it on another.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`// Header.tsx — used by every page in the set
export function Header() {
  return (
    <header>
      <nav aria-label="Primary">
        <a href="/">Home</a>
        <a href="/products">Products</a>
        <a href="/pricing">Pricing</a>
        {/* Help is always the last item in the nav,
            on every page — same relative order */}
        <a href="/help">Help &amp; contact</a>
      </nav>
    </header>
  )
}`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              A persistent chat widget rendered from the root layout
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Mounting the automated-contact widget in the app&apos;s root layout —
              not per page — keeps it in the same relative position across the whole
              set. Give it an accessible name so screen reader users can find it too.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`// app/layout.tsx (Next.js) — one mount, every page
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        {/* Automated help, same corner on every page */}
        <button
          type="button"
          className="support-chat"
          aria-label="Open support chat"
        >
          Chat with support
        </button>
      </body>
    </html>
  )
}`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Human contact details in a consistent footer
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Contact details expressed with semantic markup, rendered from a shared
              footer, satisfy both the &quot;same relative order&quot; requirement
              and good structure for assistive technology.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<footer>
  <h2>Need help?</h2>
  <address>
    Call us: <a href="tel:+18005551234">1-800-555-1234</a><br />
    Email: <a href="mailto:support@example.com">support@example.com</a>
  </address>
</footer>`}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Anti-pattern: help that moves between pages
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Defining the same help link separately on each page invites drift —
              here it is first in the nav on one page and dropped to the footer on
              another, which fails 3.2.6.
            </p>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{`<!-- home.html: help is first in the header nav -->
<nav><a href="/help">Help</a> <a href="/">Home</a> ...</nav>

<!-- checkout.html: help was moved to the footer -->
<nav><a href="/">Home</a> ...</nav>
<footer><a href="/help">Help</a></footer>
<!-- Different relative order across pages = 3.2.6 failure -->`}</code>
            </pre>
          </section>

          {/* Common mistakes */}
          <section aria-labelledby="mistakes" className="mb-12">
            <h2
              id="mistakes"
              className="text-3xl font-bold text-slate-900 dark:text-white mb-4"
            >
              Common mistakes
            </h2>
            <ul className="space-y-3">
              {[
                "Placing the help link in the header on marketing pages but only in the footer on app or checkout pages.",
                "Dropping the chat widget or contact info entirely on the exact pages where users get stuck — checkout, forms, error screens.",
                "Letting a chat bubble render in a different corner on some templates than others.",
                "Copy-pasting the help markup into each page separately, so it drifts out of order over time instead of coming from one shared component.",
                "Assuming 3.2.6 forces you to add a help mechanism — it only governs the placement of help you already provide.",
                "Reordering help during a responsive reflow so its position within its container changes from page to page.",
                "Treating 'same relative order' as 'identical pixel position' and over-engineering fixed coordinates instead of consistent content order.",
                "Providing help that is visible but not keyboard reachable or lacks an accessible name, so some users still cannot use it.",
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
              How to test for 3.2.6
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "Inventory your help mechanisms",
                  d: "Identify every help mechanism on the site: contact details, contact forms or messaging, help/FAQ links, and any chatbot or support widget. Note which of the four covered types each one is.",
                },
                {
                  t: "Check whether each repeats across pages",
                  d: "3.2.6 only bites when a help mechanism appears on multiple pages in a set. For each one that recurs, list the pages it appears on — this is the set you must keep consistent.",
                },
                {
                  t: "Compare relative order across several pages",
                  d: "Open a representative sample — home, a product or content page, checkout or sign-up, and an error page. For each recurring help mechanism, confirm it sits in the same position relative to surrounding content on every page.",
                },
                {
                  t: "Check the high-stakes pages specifically",
                  d: "Pay special attention to checkout, sign-up, form, and error pages. Help is most valuable there and most often missing or relocated. If it disappears or moves on those pages, that is a real failure.",
                },
                {
                  t: "Confirm the help control is itself accessible",
                  d: "Consistent placement only helps if users can operate the control. Reach each help mechanism with the keyboard alone, and confirm a screen reader announces a clear accessible name for it.",
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
              Consistent Help is a manual, cross-page check that automated tools
              rarely catch on their own — but you can pair it with a scan from the{" "}
              <Link
                href="/tools/url-accessibility-auditor"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                URL Accessibility Auditor
              </Link>{" "}
              and confirm assistive-technology behavior using the{" "}
              <Link
                href="/guides/screen-reader-testing"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Screen Reader Testing Guide
              </Link>
              .
            </p>
          </section>

          {/* Related criteria */}
          <div id="related-criteria">
            <CriterionLinks number="3.2.6" />
          </div>

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

        {/* Related content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <RelatedContent
            content="consistent help help mechanism contact details contact form chat widget chatbot self-help FAQ support link same relative order consistent navigation cognitive accessibility WCAG 3.2.6 Level A WCAG 2.2 understandable predictable"
            maxItems={6}
          />
        </section>
      </div>
    </>
  )
}
