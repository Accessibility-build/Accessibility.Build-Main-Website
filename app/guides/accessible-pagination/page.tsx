import type { Metadata } from "next"
import Link from "next/link"
import {
  BreadcrumbStructuredData,
  FAQStructuredData,
} from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, ShieldCheck, ListChecks } from "lucide-react"
import { PageByline } from "@/components/seo/page-byline"
import { GuideArticleSchema } from "@/components/seo/guide-article-schema"
import { clampDescription } from "@/lib/metadata"

const pageTitle = "Accessible Pagination: A Complete Guide"
const pageDescription =
  "Pagination breaks a long list across numbered pages, and building it accessibly comes down to a handful of markup choices: a named nav landmark wrapping a list of controls, an accessible name on every control so \"Go to page 3\" replaces a bare \"3\", the current page marked with aria-current, a deliberate answer to whether each control is a link or a button, and a live region that announces the page change in a single-page app. This guide covers classic numbered pagination, Previous and Next with their disabled-state trap, truncation and the ellipsis, and the Load More and infinite-scroll alternatives, with copy-ready HTML mapped to WCAG 2.2."

export const metadata: Metadata = {
  title: pageTitle,
  description: clampDescription(pageDescription),
  keywords: [
    "accessible pagination",
    "pagination accessibility",
    "aria pagination",
    "accessible pagination html",
    "pagination aria-current",
    "nav aria-label pagination",
    "pagination screen reader",
    "pagination previous next accessibility",
    "aria-disabled pagination",
    "accessible page numbers",
    "pagination link vs button",
    "accessible load more",
    "infinite scroll accessibility",
    "pagination wcag",
    "pagination link purpose",
    "pagination current page",
    "accessible pagination react",
    "pagination live region",
    "pagination keyboard accessibility",
    "pagination ellipsis accessibility",
  ],
  alternates: {
    canonical: "/guides/accessible-pagination",
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: "/guides/accessible-pagination",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: `/api/og?title=${encodeURIComponent(pageTitle)}&section=Guide`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
    images: [`/api/og?title=${encodeURIComponent(pageTitle)}&section=Guide`],
  },
}

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Guides", url: "https://accessibility.build/guides" },
  {
    name: "Accessible Pagination",
    url: "https://accessibility.build/guides/accessible-pagination",
  },
]

const faqs = [
  {
    question: "Should pagination use links or buttons?",
    answer:
      "It depends on whether each page is a real address. When the site is server-rendered and page two lives at a URL like /articles?page=2, use links, because links are crawlable, bookmarkable, open in a new tab, and work with the browser back button. When you have a single-page app that swaps the results in place without a full navigation, use buttons, and pair them with a live region so the change is announced. The choices that fail are a div or span with a click handler, which no keyboard user can reach; a link that does not actually navigate anywhere; and a button where the page ought to have a shareable URL. Decide by asking whether the page has an address of its own.",
  },
  {
    question: "What accessible name should a page number control have?",
    answer:
      "Not the bare number. A control that reads only \"3\" is announced as \"3, link\" or \"3, button\", which gives a screen reader user no clue that activating it changes the page. Give each control a name that states the action, such as \"Go to page 3\", and let the current one announce as the current page through aria-current. Supply the name with aria-label, or with visually hidden text inside the control, for example a span with class sr-only reading \"Go to page \" before the visible \"3\". Previous and Next controls, especially icon-only ones, need names too: \"Previous page\" and \"Next page\".",
  },
  {
    question: "How do I mark the current page in pagination?",
    answer:
      "Put aria-current=\"page\" on the single control that represents the page you are on, and on no other. A screen reader then announces that control as the current page, which is how a non-visual user knows where they are in the set. Do not signal the current page with a colored background or bold weight alone, because a user who cannot perceive the color and every screen reader user would get nothing. Pair aria-current with a visible non-color cue, and you can use the attribute itself as the CSS hook, styling [aria-current=\"page\"], so the visual state and the programmatic state can never drift apart.",
  },
  {
    question: "How should disabled Previous and Next controls behave?",
    answer:
      "On the first page Previous has nowhere to go, and on the last page Next does not either, so those controls need an unavailable state. You cannot truly disable an anchor element, so the accessible options are to render Previous and Next as buttons and use the native disabled attribute, which removes them from the tab order and announces them as unavailable, or to keep them perceivable with aria-disabled=\"true\" and then prevent the action in your own handler, because aria-disabled communicates the state but does not stop activation on its own. Whichever you choose, keep the control in a stable position so the row does not jump between pages; rendering Previous and Next as buttons that disable at the ends is the simplest reliable choice.",
  },
  {
    question: "Is the ellipsis in \"1 2 3 ... 10\" an accessibility problem?",
    answer:
      "The ellipsis is decoration that marks a gap in the range of page numbers, and it should be hidden from assistive technology with aria-hidden=\"true\" so a screen reader does not read \"ellipsis\" between the numbers. What actually matters is that the pages the gap stands for remain reachable. Keep the first page, the last page, the current page, and a small window of pages around the current one as real controls, so a keyboard or screen reader user can always reach the pages they need even though not every number is shown at once. The ellipsis is only a visual shorthand; it must never be the reason a page becomes unreachable.",
  },
  {
    question: "How do I announce a page change in a single-page app?",
    answer:
      "In a single-page app the results can change while the browser performs no full page load, so a screen reader has nothing to announce and the user may not realize the page turned. Fix this by announcing the change yourself through an always-present polite live region that updates to read \"Page 3 of 10\", or by moving focus to the results heading, or by updating the document title. Choose one of these; doing two at once tends to double-announce. It also helps everyone to expose a short status such as \"Showing 21 to 40 of 200\" so users know where they are within the whole set, not just which page number is active.",
  },
  {
    question: "Is pagination better than infinite scroll for accessibility?",
    answer:
      "Usually, yes. Numbered pagination gives a clear structure, pages you can bookmark, a footer you can actually reach, and a way to jump to a specific page, all of which infinite scroll takes away. Infinite scroll adds real problems: screen reader users are not told that new content loaded unless you announce it, keyboard users can struggle to reach a footer that keeps moving further down, and no one can bookmark or return to a position. If you do use infinite scroll, announce the loading and loaded states through a live region and offer an alternative such as a Load More button or classic pagination. A Load More button is a good middle ground, because it is user-initiated, easy to announce, and a natural place to move focus to the first new item.",
  },
  {
    question: "Do I still need rel=\"next\" and rel=\"prev\"?",
    answer:
      "They are optional and low-stakes today. Google confirmed in 2019 that it no longer uses rel=\"next\" and rel=\"prev\" as an indexing signal, so they are not required for search, and they were never an accessibility feature, because screen readers do not depend on them. They do no harm and a handful of tools still read them, but the accessibility of a pager comes from the visible, named, keyboard-operable controls and the current-page state, not from these link relations. Spend your effort on the nav landmark, the accessible names, and the aria-current state rather than on the link header.",
  },
]

const antiPatterns = [
  {
    bad: "The page controls are <div>s with onClick handlers.",
    why: "Divs are not focusable or operable by keyboard and expose no role, so a keyboard user cannot reach them and a screen reader announces nothing useful (fails 2.1.1 and 4.1.2).",
    fix: "Use a real <a> for links to pages, or a <button> for in-place changes; never a div or span with a click handler.",
  },
  {
    bad: "The pagination has no landmark or accessible name.",
    why: "There is no navigation region to find, so a screen reader user cannot jump to the pager or tell it apart from other navigation (weakens 1.3.1 and 4.1.2).",
    fix: "Wrap the controls in <nav aria-label=\"Pagination\">, giving the landmark a distinct name without the word navigation in it.",
  },
  {
    bad: "Page controls are labelled with only the bare number, like \"3\".",
    why: "A screen reader announces \"3, link\" with no indication that it changes the page, so the purpose is unclear out of context (fails 2.4.4).",
    fix: "Give each control a name that states the action, such as \"Go to page 3\", via aria-label or visually hidden text.",
  },
  {
    bad: "Previous and Next are icon-only with no accessible name.",
    why: "The control announces as just \"button\" or \"link\", so its purpose is lost to anyone who cannot see the arrow (fails 2.4.4 and 4.1.2).",
    fix: "Give the icon control the accessible name \"Previous page\" or \"Next page\", and hide the decorative glyph with aria-hidden.",
  },
  {
    bad: "The current page is shown only with a colored background.",
    why: "A user who cannot perceive the color, and every screen reader user, gets no cue about which page is current (fails 1.4.1 and weakens 1.3.1).",
    fix: "Mark it with aria-current=\"page\" plus a visible non-color cue, and use [aria-current] as the styling hook so the two cannot disagree.",
  },
  {
    bad: "In a single-page app the results swap with no announcement.",
    why: "Without a full page load a screen reader user is not told the content changed, so they do not know the page turned (fails 4.1.3).",
    fix: "Announce \"Page 3 of 10\" through a polite live region, or move focus to the results heading, or update the document title.",
  },
  {
    bad: "Tiny number and arrow targets sit a few pixels apart.",
    why: "Controls smaller than 24 by 24 CSS pixels are hard to hit for people with motor differences and on touch screens, and crowded targets get mis-tapped (fails 2.5.8).",
    fix: "Give each control at least a 24 by 24 pixel target, 44 is better, with enough spacing that adjacent pages are not mistaken for one another.",
  },
]

export default function AccessiblePaginationGuidePage() {
  return (
    <>
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />
      <GuideArticleSchema route="/guides/accessible-pagination" title={pageTitle} description={pageDescription} datePublished="2026-08-18" />
      <FAQStructuredData faqs={faqs} />

      <div className="min-h-screen pt-12 bg-white dark:bg-slate-950">
        {/* Breadcrumb Navigation */}
        <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
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
                    href="/guides"
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    Guides
                  </Link>
                </li>
                <li aria-hidden="true" className="text-slate-400">
                  /
                </li>
                <li>
                  <span
                    aria-current="page"
                    className="text-slate-900 dark:text-white font-medium"
                  >
                    Accessible Pagination
                  </span>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        <article>
          {/* Hero */}
          <section className="pt-12 pb-8 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl text-center">
              <Badge variant="secondary" className="mb-4 text-sm px-3 py-1">
                Implementation Guide
              </Badge>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
                Accessible Pagination
              </h1>
              <PageByline route="/guides/accessible-pagination" className="mb-5" />
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Pagination is one of the most common ways to break a long list of
                results across pages, and almost every version gets the visual part
                right while missing the parts a screen reader and a keyboard depend
                on. This guide covers the semantic markup, giving each control a name
                that says what it does instead of a bare number, marking the current
                page with <code>aria-current</code>, choosing links or buttons on
                purpose, handling the Previous and Next disabled states, and
                announcing the change in single-page apps. Copy-ready HTML mapped to
                WCAG 2.2.
              </p>
            </div>
          </section>

          {/* The core idea */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                Pagination Is Navigation, Not a Widget
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  It is easy to think of a pager as a small interactive component,
                  something like a slider or a menu that needs a special set of ARIA
                  roles and a keyboard model of its own. It is not. Pagination is a
                  set of navigation controls: a row of links or buttons that each move
                  you to a different page of the same list. There is no{" "}
                  <code>role=&quot;pagination&quot;</code>, and the WAI-ARIA Authoring
                  Practices do not define a pagination widget, because the pieces you
                  need already exist. A named{" "}
                  <Link href="/guides/landmarks-page-structure" className="text-blue-600 dark:text-blue-400 hover:underline">
                    navigation landmark
                  </Link>
                  , a list, ordinary links or buttons, and the{" "}
                  <code>aria-current</code> state do the whole job.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Because the parts are ordinary, the mistakes are ordinary too, and
                  they come from treating the pager as decoration rather than
                  navigation. The number 3 becomes a styled <code>&lt;div&gt;</code>{" "}
                  that a keyboard cannot reach. The arrows become icons with no name.
                  The active page is a colored box that a screen reader cannot see.
                  Each of these is a small omission, and together they turn a simple
                  navigation control into something a large group of users cannot
                  operate at all.
                </p>
                <div className="not-prose rounded-lg border border-teal-200 dark:border-teal-900/50 bg-teal-50 dark:bg-teal-950/20 p-5 my-6">
                  <p className="text-sm font-semibold text-teal-900 dark:text-teal-200 mb-2">
                    The decision that shapes the rest of this guide
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Before anything else, decide whether each page is a real address.
                    If page two lives at a URL of its own, the controls should be{" "}
                    <em>links</em>, so they are crawlable, bookmarkable, and work with
                    the back button. If the results swap in place in a single-page app
                    with no navigation, the controls should be <em>buttons</em>, and
                    you owe a live region to announce the change, because nothing else
                    will. Links go to pages; buttons change state. Almost every other
                    choice in this guide follows from getting that one right.
                  </p>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The reward for getting it right is that pagination is genuinely good
                  for accessibility, more so than the infinite scroll it often
                  competes with. It gives structure you can bookmark, a footer you can
                  reach, and a way to jump to a known page, which is exactly what a
                  keyboard or screen reader user wants when they are working through a
                  long set of results. The rest of this guide is the handful of markup
                  choices that deliver it. There is also an{" "}
                  <Link href="/learn/pagination" className="text-blue-600 dark:text-blue-400 hover:underline">
                    interactive pagination demo
                  </Link>{" "}
                  on this site that lets you hear the difference between the accessible
                  and inaccessible versions.
                </p>
              </div>
            </div>
          </section>

          {/* WCAG mapping */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <ShieldCheck className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                How Pagination Maps to WCAG 2.2
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                No single criterion mandates pagination, but once you build one it has
                to meet the criteria that apply to any set of navigation controls. The
                highlighted row,{" "}
                <Link href="/wcag/2-4-4" className="text-blue-600 dark:text-blue-400 hover:underline">
                  2.4.4 Link Purpose
                </Link>
                , is the one pagination most characteristically fails, because a
                control labelled with only a number does not say where it goes. The
                rest of the table covers the structure, the keyboard, the current
                state, and, for single-page apps, the announcement.
              </p>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    WCAG 2.2 success criteria that apply to pagination, their
                    conformance level, and how each one applies
                  </caption>
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        Criterion
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        Level
                      </th>
                      <th scope="col" className="px-4 py-3 font-semibold">
                        How it applies to pagination
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                    <tr className="bg-blue-50/60 dark:bg-blue-950/20">
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-4-4" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.4.4 Link Purpose (In Context)
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Each control&rsquo;s name has to state what it does, so &ldquo;Go to page 3,&rdquo; &ldquo;Previous page,&rdquo; and &ldquo;Next page&rdquo; replace a bare number or an unlabeled arrow.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-3-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          1.3.1 Info and Relationships
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">The pager is a list of controls inside a named navigation region, and which page is current is exposed in the markup, not implied by styling alone.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/4-1-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                          4.1.2 Name, Role, Value
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">The navigation landmark carries an accessible name, each control has a real role as a link or button, and the current page is conveyed as a state with aria-current.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-1-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.1.1 Keyboard
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Every control is reachable and operable by keyboard, which real links and buttons give for free and div click handlers do not.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-4-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          1.4.1 Use of Color
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">The current page must not be distinguished by color alone; the state comes from aria-current plus a non-color cue such as an outline or weight.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-4-7" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.4.7 Focus Visible
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">Each control shows a clearly visible focus indicator as the user tabs across the row of pages.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-5-8" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.5.8 Target Size (Minimum)
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">Page numbers and arrows are notoriously small; each control needs at least a 24 by 24 pixel target so it can be hit reliably.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/4-1-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                          4.1.3 Status Messages
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">In a single-page app the page change and the &ldquo;showing X to Y of Z&rdquo; status must be announced through a live region without moving focus.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-muted-foreground leading-relaxed mt-4 text-sm">
                Each criterion links to its full reference and interactive demo. The
                complete{" "}
                <Link
                  href="/wcag"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  WCAG 2.2 criteria
                </Link>{" "}
                are one click away.
              </p>
            </div>
          </section>

          {/* 1. Minimum viable pagination */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                1. The Minimum Viable Accessible Pager
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Start with the server-rendered case, where each page has its own
                  URL, because it needs no JavaScript and shows the whole structure
                  clearly. Four decisions carry almost all of the accessibility. Wrap
                  the controls in a <code>&lt;nav&gt;</code> with an accessible name.
                  Put the controls in a list. Make each page a link with a descriptive
                  name. Mark the current page with{" "}
                  <code>aria-current=&quot;page&quot;</code>. Here is the whole
                  pattern:
                </p>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`<nav aria-label="Pagination">
  <ul>
    <li>
      <a href="?page=1" aria-label="Go to previous page" rel="prev">
        <span aria-hidden="true">&lsaquo;</span>
        <span class="sr-only">Previous page</span>
      </a>
    </li>
    <li><a href="?page=1" aria-label="Go to page 1">1</a></li>
    <li>
      <a href="?page=2" aria-current="page" aria-label="Page 2, current page">
        2
      </a>
    </li>
    <li><a href="?page=3" aria-label="Go to page 3">3</a></li>
    <li>
      <a href="?page=3" aria-label="Go to next page" rel="next">
        <span class="sr-only">Next page</span>
        <span aria-hidden="true">&rsaquo;</span>
      </a>
    </li>
  </ul>
</nav>`}</code></pre>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Every decision is doing real work. The{" "}
                  <code>&lt;nav aria-label=&quot;Pagination&quot;&gt;</code> exposes a
                  navigation landmark with a distinct name, so a screen reader user
                  can find the pager and tell it apart from the main menu, which is
                  also a navigation landmark. Write the label as{" "}
                  <code>Pagination</code>, not <code>Pagination navigation</code>,
                  because the role already contributes the word navigation and the
                  longer label is announced as &ldquo;Pagination navigation,
                  navigation.&rdquo;
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The list gives the pager structure and an item count, so a screen
                  reader can announce &ldquo;list, five items&rdquo; and let the user
                  move control by control. An ordered list{" "}
                  (<code>&lt;ol&gt;</code>) is the most honest choice, because the
                  pages run in sequence, but an unordered list is common and widely
                  accepted; the load-bearing parts are the landmark, the names, and the
                  current-page state, not which list element you pick. Each page is a
                  link that carries a descriptive name, which the next section covers
                  in full, and the current page adds{" "}
                  <code>aria-current=&quot;page&quot;</code>, covered in section three.
                  That is a complete, accessible pager before a single line of script.
                </p>
              </div>
            </div>
          </section>

          {/* 2. Descriptive names */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                2. &ldquo;3&rdquo; Is Not a Label: Naming Every Control
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The signature pagination bug is the bare number. A control whose only
                  text is <code>3</code> is announced as &ldquo;3, link&rdquo; or
                  &ldquo;3, button,&rdquo; which tells a screen reader user nothing
                  about what it does. Out of the visual context of a row of page
                  numbers, a lone digit has no meaning, and that is exactly the case{" "}
                  <Link href="/wcag/2-4-4" className="text-blue-600 dark:text-blue-400 hover:underline">
                    2.4.4 Link Purpose
                  </Link>{" "}
                  is about. Every control in the pager needs a name that states the
                  action, and there are two clean ways to provide one.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                  Option A: aria-label
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The simplest approach puts the full name in an{" "}
                  <code>aria-label</code>, while the visible content stays the short
                  number. The visible &ldquo;3&rdquo; is what a sighted user reads; the
                  label is what a screen reader announces:
                </p>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`<a href="?page=3" aria-label="Go to page 3">3</a>`}</code></pre>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  One caution: an <code>aria-label</code> completely overrides the
                  visible text for the accessible name, so make sure the label still
                  contains the visible word or number. Because a sighted speech-input
                  user says what they see, an accessible name that starts with the
                  visible text keeps them able to say &ldquo;click 3&rdquo; and hit the
                  control, which is the point of{" "}
                  <Link href="/wcag/2-5-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                    2.5.3 Label in Name
                  </Link>
                  . &ldquo;Go to page 3&rdquo; contains the 3, so it is safe.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                  Option B: visually hidden text
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The other approach keeps the accessible name in real text, hidden
                  visually with an <code>.sr-only</code> utility, so the control reads
                  its full name to a screen reader while the eye sees only the number.
                  This avoids overriding the visible text at all:
                </p>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`<a href="?page=3">
  <span class="sr-only">Go to page </span>3
</a>

<!-- The .sr-only class hides text visually but keeps it for
     assistive technology. Never use display:none or
     visibility:hidden here, which remove it from the
     accessibility tree entirely. -->
<style>
  .sr-only {
    position: absolute;
    width: 1px; height: 1px;
    padding: 0; margin: -1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap; border: 0;
  }
</style>`}</code></pre>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Previous and Next deserve special attention, because they are usually
                  rendered as icon-only arrows, and an arrow with no text is announced
                  as nothing more than &ldquo;link&rdquo; or &ldquo;button.&rdquo; Give
                  each one an accessible name, &ldquo;Previous page&rdquo; and
                  &ldquo;Next page,&rdquo; and hide the decorative glyph with{" "}
                  <code>aria-hidden=&quot;true&quot;</code> so the screen reader does
                  not try to read the character. The pattern is exactly the one shown
                  in section one: a visible arrow marked <code>aria-hidden</code>{" "}
                  sitting beside an <code>.sr-only</code> name, or an{" "}
                  <code>aria-label</code> on the control. Either way, the arrow carries
                  a name that says where it goes.
                </p>
              </div>
            </div>
          </section>

          {/* 3. aria-current */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                3. Marking the Current Page with aria-current
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  A pager without a current-page marker leaves a screen reader user
                  unable to tell which page they are on, and it is the single most
                  common thing missing after descriptive names.{" "}
                  <code>aria-current</code> is the state that fixes it: it marks the one
                  control in the set that represents the user&rsquo;s current position.
                  In a pager it belongs on exactly one control, the number of the page
                  you are viewing, and a screen reader announces that control as
                  &ldquo;current page.&rdquo; Put it on more than one and it stops
                  meaning anything.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Use the value <code>page</code>, not the generic <code>true</code>.
                  Both are valid, but <code>aria-current</code> has several token
                  values for different kinds of set, and <code>page</code> is the one
                  that means &ldquo;the current page in a set of pages,&rdquo; which is
                  precisely a pager. It is the same value a breadcrumb and a site menu
                  use to mark the current page; the{" "}
                  <Link href="/guides/accessible-breadcrumbs" className="text-blue-600 dark:text-blue-400 hover:underline">
                    accessible breadcrumbs guide
                  </Link>{" "}
                  covers the full set of token values, if you want the reference.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                  A link to the page you are on, or plain text?
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The current page can be a link that carries{" "}
                  <code>aria-current=&quot;page&quot;</code> or a non-interactive
                  element, and both are accepted. Rendering it as a link keeps the row
                  visually and behaviorally uniform, and a link to the page you are
                  already on simply reloads it, which is harmless. Some teams instead
                  render the current page as a plain <code>&lt;span&gt;</code> with{" "}
                  <code>aria-current=&quot;page&quot;</code>, on the reasoning that a
                  link to the current page does nothing useful. Either is fine; the two
                  things that are not fine are leaving the current page unmarked, and
                  marking it only with a colored background:
                </p>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`<!-- As a link -->
<li><a href="?page=2" aria-current="page" aria-label="Page 2, current page">2</a></li>

<!-- As plain text (also correct) -->
<li><span aria-current="page" aria-label="Page 2, current page">2</span></li>`}</code></pre>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Do not let a background color be the only signal that a page is
                  current, which would fail{" "}
                  <Link href="/wcag/1-4-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.4.1 Use of Color
                  </Link>
                  . Pair <code>aria-current</code> with a visible cue that does not rely
                  on hue, such as an outline, an underline, or a bolder weight, and
                  drive that styling from the attribute itself so the visual and
                  programmatic states can never disagree:
                </p>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`/* Style the current page from the attribute, so the visual
   cue and the announced state are always in sync. */
[aria-current="page"] {
  font-weight: 700;
  outline: 2px solid currentColor;
  outline-offset: 2px;
}`}</code></pre>
                </div>
              </div>
            </div>
          </section>

          {/* 4. Links or buttons */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                4. Links or Buttons, and the Disabled-State Trap
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The choice between a link and a button is not a style preference; it
                  reflects what the control actually does.{" "}
                  <strong className="text-slate-900 dark:text-white">
                    Use a link when the page has its own URL.
                  </strong>{" "}
                  If page two is a real address like{" "}
                  <code>/articles?page=2</code>, a link is correct: it can be
                  bookmarked, opened in a new tab, followed by a crawler, and reached
                  with the browser back button, all of which a button throws away.{" "}
                  <strong className="text-slate-900 dark:text-white">
                    Use a button when the results change in place.
                  </strong>{" "}
                  In a single-page app that swaps the list without navigating, there is
                  no new URL to link to, so a button is the honest element, and you owe
                  the live-region announcement covered in section six. The failure
                  modes are a link that does not navigate, a button where a shareable
                  URL belongs, and worst of all a <code>&lt;div&gt;</code> with a click
                  handler, which is neither.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                  The disabled Previous and Next trap
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  On the first page, Previous has nowhere to go; on the last page,
                  Next does not either. Conveying that unavailable state is where pagers
                  most often go wrong, and the reason is a real HTML limitation:{" "}
                  <strong className="text-slate-900 dark:text-white">
                    you cannot disable an anchor.
                  </strong>{" "}
                  There is no <code>disabled</code> attribute for <code>&lt;a&gt;</code>{" "}
                  that removes it from the tab order and marks it unavailable the way it
                  does for a button. That leaves two correct patterns.
                </p>
                <div className="not-prose rounded-lg border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/20 p-5 my-6">
                  <p className="text-sm font-semibold text-amber-900 dark:text-amber-200 mb-2">
                    aria-disabled does not disable anything
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    <code>aria-disabled=&quot;true&quot;</code> tells assistive
                    technology that a control is unavailable, but it does{" "}
                    <em>not</em> stop the control from being activated, and it does not
                    remove it from the tab order. If you mark a link or button
                    aria-disabled and do nothing else, a user can still click it or
                    press Enter on it and trigger the action. Whenever you use
                    aria-disabled, you must also prevent the action in your own
                    handler. It is a promise you have to keep in code.
                  </p>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The simplest reliable pattern is to render Previous and Next as{" "}
                  <em>buttons</em> and use the native <code>disabled</code> attribute
                  at the ends of the range. A disabled button is removed from the tab
                  order and announced as dimmed, with no extra code:
                </p>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`<!-- On page 1: Previous is a disabled button, cleanly unavailable -->
<button type="button" disabled aria-label="Previous page">
  <span aria-hidden="true">&lsaquo;</span>
</button>`}</code></pre>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  If Previous and Next have to be links, because each page is a real
                  URL, the cleanest option is to simply not render a link when there is
                  nowhere to go, replacing it with a non-focusable{" "}
                  <code>&lt;span&gt;</code> that keeps the layout stable. If you would
                  rather keep the control present and perceivable, mark it{" "}
                  <code>aria-disabled=&quot;true&quot;</code> and prevent the
                  navigation, remembering the rule in the callout above:
                </p>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`<!-- Present but unavailable. The handler must block activation,
     because aria-disabled alone does not. -->
<a href="?page=1"
   aria-disabled="true"
   aria-label="Previous page"
   onclick="if (this.getAttribute('aria-disabled') === 'true') return false;">
  <span aria-hidden="true">&lsaquo;</span>
</a>`}</code></pre>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Whichever approach you take, keep the control in a stable position so
                  the whole row does not shift left and right as the user pages through,
                  which is disorienting for everyone and especially for a user zoomed in
                  or navigating by touch.
                </p>
              </div>
            </div>
          </section>

          {/* 5. Truncation / ellipsis */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                5. Long Ranges: Truncation and the Ellipsis
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  A hundred pages will not fit in a row, so a pager shows a window of
                  numbers with the middle collapsed to an ellipsis, reading as{" "}
                  <em>1 2 3 &hellip; 42 43 44 &hellip; 99 100</em>. Two things have to
                  be true for that to stay accessible: the ellipsis must not be read
                  aloud, and the pages it hides must still be reachable.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The ellipsis is decoration. It marks a gap in the sequence, and a
                  screen reader announcing &ldquo;ellipsis&rdquo; between page numbers
                  adds only noise, so hide it with{" "}
                  <code>aria-hidden=&quot;true&quot;</code>. Because it is not a
                  control, it is not focusable and should never be a link or a button:
                </p>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`<nav aria-label="Pagination">
  <ul>
    <li><a href="?page=1" aria-label="Go to page 1">1</a></li>
    <li><a href="?page=2" aria-label="Go to page 2">2</a></li>

    <!-- Decoration only: not a control, hidden from screen readers -->
    <li aria-hidden="true">&hellip;</li>

    <li><a href="?page=42" aria-current="page" aria-label="Page 42, current page">42</a></li>
    <li><a href="?page=43" aria-label="Go to page 43">43</a></li>

    <li aria-hidden="true">&hellip;</li>

    <li><a href="?page=100" aria-label="Go to page 100">100</a></li>
  </ul>
</nav>`}</code></pre>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The more important rule is about reachability. The point of the
                  ellipsis is that not every page number is shown, but that must never
                  mean a page becomes unreachable. Always keep the first page, the last
                  page, the current page, and a small window of pages on either side of
                  the current one as real controls, so a keyboard or screen reader user
                  can move through the set without a page being stranded behind the
                  gap. If a user needs a page that is not in the visible window, the
                  Next control walks them toward it, and the window slides as they go.
                  What you must not do is drop pages so aggressively that a page in the
                  middle has no control that reaches it.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Finally, make sure the row of numbers does not force the page to
                  scroll horizontally at 320 pixels wide, which would fail{" "}
                  <Link href="/wcag/1-4-10" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.4.10 Reflow
                  </Link>
                  . On a narrow screen, a compact window such as{" "}
                  <em>Previous, 42, Next</em> with a &ldquo;page 42 of 100&rdquo; label
                  is often clearer than a long strip of numbers, and it keeps the pager
                  inside the viewport.
                </p>
              </div>
            </div>
          </section>

          {/* 6. SPA announcements */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                6. Announcing the Change in Single-Page Apps
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  When pagination is buttons that swap the results in place, a new
                  problem appears that the server-rendered version never has: nothing
                  reloads, so a screen reader has no event to announce, and the user
                  may press Next and have no idea whether anything happened. This is the
                  case{" "}
                  <Link href="/wcag/4-1-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                    4.1.3 Status Messages
                  </Link>{" "}
                  exists for, and the fix is to announce the change yourself. There are
                  three accepted ways, and you should pick one rather than combine them,
                  because two announcements at once talk over each other.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The most common is a polite live region. Keep an always-mounted,
                  visually hidden element with <code>aria-live=&quot;polite&quot;</code>{" "}
                  in the DOM, and update its text to the new page when the results
                  change. It must be present before the update, not created at the
                  moment of the change, or the first announcement is missed:
                </p>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`// React: an always-present polite live region announces each page.
function Pager({ page, totalPages, onGoTo }) {
  return (
    <>
      {/* Announced politely on every page change. Always mounted. */}
      <div aria-live="polite" className="sr-only">
        {"Page " + page + " of " + totalPages}
      </div>

      <nav aria-label="Pagination">
        <ul>
          <li>
            <button
              type="button"
              disabled={page === 1}
              aria-label="Previous page"
              onClick={() => onGoTo(page - 1)}
            >
              <span aria-hidden="true">&lsaquo;</span>
            </button>
          </li>
          {/* ...number buttons, current one carries aria-current="page"... */}
          <li>
            <button
              type="button"
              disabled={page === totalPages}
              aria-label="Next page"
              onClick={() => onGoTo(page + 1)}
            >
              <span aria-hidden="true">&rsaquo;</span>
            </button>
          </li>
        </ul>
      </nav>
    </>
  )
}`}</code></pre>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The two alternatives are to move focus to the results heading after
                  the page changes, which announces the heading and lands the user at
                  the top of the new results (give the heading{" "}
                  <code>tabindex=&quot;-1&quot;</code> so it can receive focus), or to
                  update the document <code>&lt;title&gt;</code>, which some screen
                  readers announce on change. Moving focus is the strongest for
                  keyboard users because it also repositions them, but it is more
                  intrusive; the{" "}
                  <Link href="/guides/focus-management" className="text-blue-600 dark:text-blue-400 hover:underline">
                    focus management guide
                  </Link>{" "}
                  covers the mechanics of moving focus without losing the user.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Whichever you choose, add a plain status that tells everyone where
                  they are in the whole set, not just the page number. A short{" "}
                  <code>role=&quot;status&quot;</code> region reading &ldquo;Showing 21
                  to 40 of 200 results&rdquo; is useful to sighted users as ordinary
                  text and is announced to screen reader users as a status message, so
                  the same element serves both. Place it near the results, update it
                  when the page changes, and you have given the set a sense of scale
                  that a row of numbers alone does not convey.
                </p>
              </div>
            </div>
          </section>

          {/* 7. Load more / infinite scroll */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                7. The Alternatives: Load More and Infinite Scroll
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Numbered pages are not the only way to break up a long list. Two
                  common alternatives, a Load More button and infinite scroll, append
                  content to the current view instead of replacing it, and they change
                  the accessibility problem from &ldquo;announce the new page&rdquo; to
                  &ldquo;announce that more content arrived, and help the user find
                  it.&rdquo;
                </p>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                  Load More: the accessible middle ground
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  A Load More button is the friendliest of the three patterns, because
                  the user chooses when to load, so the moment is predictable and you
                  own a clear place to manage focus. When the new items arrive, do two
                  things: announce the result through a live region (&ldquo;Loaded 10
                  more articles, 30 of 200&rdquo;), and move focus to the first new
                  item so a keyboard or screen reader user lands on the new content
                  rather than being left at the button. The first new item needs{" "}
                  <code>tabindex=&quot;-1&quot;</code> so it can receive programmatic
                  focus:
                </p>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`// After appending, move focus to the first new item.
async function handleLoadMore() {
  const firstNewIndex = items.length
  const more = await fetchMore()
  setItems(items.concat(more))
  setStatus("Loaded " + more.length + " more, " +
            (items.length + more.length) + " of " + total)

  // After the new items render, focus the first one.
  requestAnimationFrame(() => {
    itemRefs.current[firstNewIndex]?.focus()
  })
}

// The first new item is programmatically focusable:
// <li tabIndex={-1} ref={el => (itemRefs.current[i] = el)}> ... </li>`}</code></pre>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  While the fetch is in flight, disable the button and change its text
                  to &ldquo;Loading&hellip;&rdquo; so it cannot be pressed twice and so
                  the state is announced. This is the same discipline as the page-change
                  live region above, and the{" "}
                  <Link href="/learn/pagination" className="text-blue-600 dark:text-blue-400 hover:underline">
                    interactive demo
                  </Link>{" "}
                  shows both the Load More and infinite-scroll versions running.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                  Infinite scroll: use it carefully, and provide an alternative
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Infinite scroll loads more content automatically as the user nears the
                  bottom, and it carries the most accessibility risk of the three
                  patterns. A screen reader user is not told that new items appeared
                  unless you announce it through a live region. A keyboard user can be
                  unable to reach the footer at all, because it keeps moving further
                  down as new content loads. And no one can bookmark a position or
                  return to where they were. If you adopt it anyway, announce the
                  loading and loaded states politely, make sure a keyboard user can Tab
                  past the feed to whatever follows it, and provide an explicit
                  alternative, whether that is a Load More button, a &ldquo;view
                  all&rdquo; link, or classic pagination. The pattern that appends
                  articles as you scroll has its own ARIA support in{" "}
                  <code>role=&quot;feed&quot;</code>, but for most lists a Load More
                  button is simpler and kinder. For the focus and live-region details
                  these patterns share, see the{" "}
                  <Link href="/guides/focus-management" className="text-blue-600 dark:text-blue-400 hover:underline">
                    focus management guide
                  </Link>{" "}
                  and the{" "}
                  <Link href="/wcag/4-1-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                    4.1.3 Status Messages
                  </Link>{" "}
                  reference.
                </p>
              </div>
            </div>
          </section>

          {/* 8. Testing */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                8. Testing a Pager
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-2 mb-3">
                  Keyboard
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Tab through the pager. Every control, the numbers and the Previous and
                  Next arrows, should take focus in order, show a clearly visible focus
                  indicator, and activate with Enter, plus Space if it is a button. A
                  disabled Previous or Next should be skipped by Tab, not focusable and
                  dead. If any control is unreachable by keyboard, it is almost
                  certainly a <code>&lt;div&gt;</code> or <code>&lt;span&gt;</code> with
                  a click handler rather than a real link or button.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                  Screen reader
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  This is the test that catches the real bugs. Open the landmarks list
                  and confirm the pager appears as &ldquo;Pagination,&rdquo; distinct
                  from the main navigation. Move into it and listen: each control should
                  announce a name that states its action (&ldquo;Go to page 3,&rdquo;
                  &ldquo;Next page&rdquo;), not a bare number or a lone &ldquo;button,&rdquo;
                  and the current page should announce as &ldquo;current page.&rdquo; In
                  a single-page app, activate Next and confirm you hear &ldquo;Page 3 of
                  10&rdquo; or land on the results heading. If you hear a number with no
                  context, your names are missing; if you never hear &ldquo;current
                  page,&rdquo; the <code>aria-current</code> is not there. Verify with
                  more than one reader if you can, using the{" "}
                  <Link href="/guides/nvda-screen-reader-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                    NVDA
                  </Link>{" "}
                  and{" "}
                  <Link href="/guides/voiceover-screen-reader-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                    VoiceOver
                  </Link>{" "}
                  guides.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                  Target size and reflow
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Check that each control is at least a 24 by 24 pixel target and that
                  adjacent pages are spaced so they are not mis-tapped, which matters
                  most on touch. Then narrow the viewport to 320 pixels or zoom to 400
                  percent and confirm the pager reflows instead of forcing horizontal
                  scrolling, collapsing to a compact window if it needs to.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                  What tools catch, and what they do not
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Automated checkers such as{" "}
                  <Link href="/guides/axe-vs-wave" className="text-blue-600 dark:text-blue-400 hover:underline">
                    axe and WAVE
                  </Link>{" "}
                  will flag a navigation landmark with no accessible name, a control
                  with no name at all, and a target that is too small. What they cannot
                  judge is whether the trail of names is <em>right</em>: whether the
                  current page is the one actually marked, whether the announcement
                  fires when the page changes, or whether a truncated page is still
                  reachable. As the{" "}
                  <Link href="/guides/automated-vs-manual-accessibility-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                    automated versus manual testing guide
                  </Link>{" "}
                  puts it, the machine gets you to valid markup and a person decides
                  whether it is correct. For where this fits in a full review, see the{" "}
                  <Link href="/guides/how-to-audit-website-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">
                    accessibility audit guide
                  </Link>
                  .
                </p>
              </div>
            </div>
          </section>

          {/* Anti-patterns */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                Common Pagination Mistakes &amp; How to Fix Them
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                These are the errors that turn up most in real pagination audits. Most
                come back to two habits: building the controls out of the wrong
                elements, and labelling them with a number or an arrow instead of a
                name that says what they do.
              </p>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    Common pagination anti-patterns, why each one fails, and the fix
                  </caption>
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">Anti-pattern</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Why it fails</th>
                      <th scope="col" className="px-4 py-3 font-semibold">The fix</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                    {antiPatterns.map((row, i) => (
                      <tr key={i}>
                        <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top">
                          {row.bad}
                        </th>
                        <td className="px-4 py-3 align-top">{row.why}</td>
                        <td className="px-4 py-3 align-top">{row.fix}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Checklist */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <ListChecks className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                The Accessible Pagination Checklist
              </h2>
              <ol className="space-y-4 text-muted-foreground leading-relaxed list-decimal pl-6">
                <li>
                  <strong className="text-slate-900 dark:text-white">Wrapped in a named landmark.</strong>{" "}
                  The pager sits inside{" "}
                  <code>&lt;nav aria-label=&quot;Pagination&quot;&gt;</code>, so it is a
                  distinct navigation landmark, without the word navigation in the label.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">A list of controls.</strong>{" "}
                  The controls are a list, one <code>&lt;li&gt;</code> each, so
                  assistive technology can present them as a counted set.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Links or buttons, chosen on purpose.</strong>{" "}
                  Links when each page has a real URL; buttons when the results change
                  in place; never a div or span with a click handler.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Every control is named.</strong>{" "}
                  &ldquo;Go to page 3,&rdquo; &ldquo;Previous page,&rdquo; and
                  &ldquo;Next page&rdquo; replace bare numbers and unlabeled arrows, via
                  <code> aria-label</code> or visually hidden text.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">The current page is marked.</strong>{" "}
                  Exactly one control carries <code>aria-current=&quot;page&quot;</code>,
                  with a visible non-color cue, never a colored background alone.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Previous and Next handle their ends.</strong>{" "}
                  At the first and last page they are a disabled button, or an
                  aria-disabled control whose action is prevented, held in a stable
                  position.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">The ellipsis is hidden, pages stay reachable.</strong>{" "}
                  The ellipsis carries <code>aria-hidden=&quot;true&quot;</code>, and the
                  first, last, current, and surrounding pages are always real controls.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Focus is visible and targets are big enough.</strong>{" "}
                  Each control shows a clear focus indicator and is at least a 24 by 24
                  pixel target.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Single-page changes are announced.</strong>{" "}
                  A live region says &ldquo;Page 3 of 10,&rdquo; or focus moves to the
                  results heading, plus a &ldquo;showing X to Y of Z&rdquo; status.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Verified with a screen reader.</strong>{" "}
                  The Pagination landmark is findable, each control&rsquo;s name states
                  its action, and the current page announces as current.
                </li>
              </ol>
            </div>
          </section>

          {/* CTA */}
          <section className="py-12 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <div className="rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20 p-8 text-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  Pagination Is One of a Family of Navigation Patterns
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6 max-w-lg mx-auto">
                  A pager is a named navigation landmark built on <code>aria-current</code>,
                  the same foundation as a breadcrumb trail. See its sibling pattern,
                  and try the live version of every pagination pattern in the
                  interactive demo.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button asChild size="lg" className="gap-2">
                    <Link href="/guides/accessible-breadcrumbs">
                      Accessible Breadcrumbs Guide
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="gap-2">
                    <Link href="/learn/pagination">
                      Interactive Pagination Demo
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="py-12 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl font-bold mb-6 text-center text-slate-900 dark:text-white">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {faqs.map((item, i) => (
                  <details key={i} className="group border rounded-lg p-4 bg-card">
                    <summary className="cursor-pointer font-medium list-none flex items-center justify-between">
                      {item.question}
                      <span className="ml-2 text-muted-foreground group-open:rotate-180 transition-transform">
                        &#9662;
                      </span>
                    </summary>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                      {item.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          {/* Related Content */}
          <section className="pb-12 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <RelatedContent
                content="accessible pagination pagination accessibility aria pagination accessible pagination html pagination aria-current nav aria-label pagination pagination screen reader pagination previous next accessibility aria-disabled pagination accessible page numbers pagination link vs button accessible load more infinite scroll accessibility pagination wcag pagination link purpose pagination current page accessible pagination react pagination live region pagination keyboard accessibility pagination ellipsis accessibility navigation landmark aria-current page link purpose 2.4.4 1.3.1 4.1.2 2.1.1 1.4.1 2.4.7 2.5.8 4.1.3 status messages breadcrumbs focus management load more button"
              />
            </div>
          </section>
        </article>
      </div>
    </>
  )
}
