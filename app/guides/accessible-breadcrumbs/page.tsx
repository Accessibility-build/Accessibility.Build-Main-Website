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

const pageTitle = "Accessible Breadcrumb Navigation: A Complete Guide"
const pageDescription =
  "A breadcrumb trail shows where the current page sits in a site's hierarchy, and it answers to two audiences at once: screen reader users through ARIA, and search engines through BreadcrumbList structured data. This guide covers the semantic markup (a named nav landmark wrapping an ordered list), marking the current page with aria-current, hiding the separators from assistive technology, keeping the visible trail and the structured data in sync, and truncating long trails on mobile without breaking either. Copy-ready HTML and JSON-LD mapped to WCAG 2.2."

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords: [
    "accessible breadcrumbs",
    "breadcrumb accessibility",
    "aria breadcrumb",
    "breadcrumb navigation accessibility",
    "aria-current page",
    "aria-current breadcrumb",
    "breadcrumb aria-label",
    "accessible breadcrumb navigation",
    "breadcrumb separators accessibility",
    "breadcrumblist schema",
    "breadcrumb structured data",
    "breadcrumb ol vs ul",
    "breadcrumb wcag",
    "wcag 2.4.8 location",
    "breadcrumb screen reader",
    "accessible breadcrumb html",
    "breadcrumb current page",
    "responsive breadcrumbs accessibility",
    "breadcrumb truncation accessibility",
    "nav aria-label breadcrumb",
  ],
  alternates: {
    canonical: "/guides/accessible-breadcrumbs",
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: "/guides/accessible-breadcrumbs",
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
    images: [
      `/api/og?title=${encodeURIComponent(pageTitle)}&section=Guide`,
    ],
  },
}

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Guides", url: "https://accessibility.build/guides" },
  {
    name: "Accessible Breadcrumbs",
    url: "https://accessibility.build/guides/accessible-breadcrumbs",
  },
]

const faqs = [
  {
    question: "Should a breadcrumb use an ordered list or an unordered list?",
    answer:
      "An ordered list. The whole point of a breadcrumb is that the items run in a meaningful sequence, from the site root down to the current page, so an ol communicates that order to assistive technology in a way a ul does not. Some very well-known examples use a ul, and a screen reader user can still read them, but ol is the more correct choice because the position of each crumb in the trail carries meaning. Wrap the list in a nav element with an accessible name, put one li per crumb, and let the ordered list express the hierarchy.",
  },
  {
    question: "Do I need aria-label on the breadcrumb nav?",
    answer:
      "Yes, if the page has more than one navigation region, which almost every page does. A nav element exposes the navigation landmark, and two unnamed navigation landmarks both announce simply as navigation, so a screen reader user browsing the landmarks list cannot tell the breadcrumb apart from the main menu. Give it aria-label=\"Breadcrumb\", and it becomes Breadcrumb navigation in the landmarks list. Do not write aria-label=\"Breadcrumb navigation\", because the role already contributes the word navigation and the user would hear it twice. The single word Breadcrumb is the conventional and correct name.",
  },
  {
    question: "Should the last breadcrumb be a link?",
    answer:
      "It can be either a link to the current page or plain text, and both are accepted. What matters is that the current page is marked with aria-current=\"page\" so assistive technology announces it as the current location, and that it is not a link to a different page. The WAI-ARIA Authoring Practices example uses a link to the current page carrying aria-current=\"page\"; many teams instead render the last crumb as a plain span with aria-current=\"page\", which avoids a link that navigates to the page you are already on. Choose one, keep it consistent, and never distinguish the current crumb by bold or color alone.",
  },
  {
    question: "What is aria-current=\"page\" and where does it go?",
    answer:
      "aria-current is a state that marks the one item in a set that represents the user's current position, and the value page is the variant for the page within a navigation trail. In a breadcrumb it goes on the last crumb only, the one that names the page you are on. A screen reader announces that item as current page, which is how a non-visual user knows where the trail ends. Put it on exactly one crumb; putting aria-current on every crumb, or using it on more than one, defeats the purpose. The value should be page for breadcrumbs, not the generic aria-current=\"true\", because page is more precise, although true is still valid.",
  },
  {
    question: "How do I make breadcrumb separators accessible?",
    answer:
      "Treat the separators as decoration, because that is what they are. A slash, chevron, or arrow between crumbs conveys nothing that the list structure does not already convey, so it must not be read aloud. The cleanest technique is to draw the separator with CSS, using a ::before or ::after pseudo-element on each list item, so it never enters the accessibility tree at all. If the separator has to live in the markup, for example an inline SVG icon, give it aria-hidden=\"true\" (and focusable=\"false\" on an SVG) so screen readers skip it. Never place the separator inside the link text, and never leave a bare slash as real text, or users will hear Home slash Products slash Shoes.",
  },
  {
    question: "Are breadcrumbs required by WCAG?",
    answer:
      "No single criterion says every page must have a breadcrumb. Breadcrumbs are a technique, not a requirement. They are the standard way to satisfy 2.4.8 Location, which is a AAA criterion about helping users understand where they are within a set of pages, and they count as one of the ways to locate content under 2.4.5 Multiple Ways at AA (alongside site search and a sitemap). So while you are not obligated to use breadcrumbs, when you do, the markup has to meet the A and AA criteria that apply to any navigation: correct structure under 1.3.1, an accessible name and current state under 4.1.2, clear link text under 2.4.4, no reliance on color under 1.4.1, and a visible focus indicator under 2.4.7.",
  },
  {
    question: "Do breadcrumbs need structured data, and does it help SEO?",
    answer:
      "Structured data is separate from accessibility and serves a different consumer. The ARIA markup is read by screen readers; the BreadcrumbList JSON-LD is read by search engines, and it is what lets Google show a breadcrumb trail instead of a raw URL in the search result. Adding it is optional but worthwhile for discoverability. The rule that connects the two is that the structured data must describe the same trail the user can see on the page. Google requires breadcrumb markup to reflect visible content, so a BreadcrumbList that lists pages the breadcrumb does not show, or names them differently, is both a structured-data violation and a signal that your two representations have drifted apart. Generate the visible list and the JSON-LD from one source so they cannot disagree.",
  },
  {
    question: "How should breadcrumbs behave on a small screen?",
    answer:
      "Long trails have to fit narrow viewports without breaking the trail or the layout. The safe pattern is to keep every crumb in the DOM and collapse the middle of the trail visually, showing the root, an expandable control, and the last one or two crumbs, so it reads as Home, ellipsis, Current. The collapse control must be a real button with an accessible name such as Show full path, not a bare ellipsis that does nothing, and activating it should reveal the hidden crumbs. Do not solve the space problem by deleting the middle crumbs from the markup, because that removes them from the screen reader trail and from the structured data at the same time. Also make sure the row can wrap or scroll rather than forcing horizontal page scrolling, which would fail 1.4.10 Reflow.",
  },
]

const antiPatterns = [
  {
    bad: "The separator is real text, so a screen reader reads \"Home slash Products slash Shoes\".",
    why: "The slash, chevron, or arrow is decoration that conveys nothing the list already conveys, and reading it aloud clutters every crumb (weakens 1.3.1).",
    fix: "Draw separators with a CSS ::before or ::after pseudo-element, or if they must be in the markup, add aria-hidden=\"true\" (and focusable=\"false\" on an SVG).",
  },
  {
    bad: "The breadcrumb nav has no accessible name.",
    why: "It announces only as \"navigation,\" identical to the main menu and any other nav, so a screen reader user cannot pick it out of the landmarks list (fails 4.1.2).",
    fix: "Add aria-label=\"Breadcrumb\" to the nav, without the word navigation in the label since the role already supplies it.",
  },
  {
    bad: "The current page is unmarked, or is a link to a different page.",
    why: "Nothing tells a screen reader user which crumb is the page they are on, so the trail has no endpoint and the location cue is lost (weakens 1.3.1 and 4.1.2).",
    fix: "Mark the last crumb with aria-current=\"page\", and make it plain text or a link to the current page, never a link elsewhere.",
  },
  {
    bad: "The crumbs are divs and spans with no list.",
    why: "The trail has no programmatic structure and no item count, so assistive technology cannot present it as an ordered set (fails 1.3.1).",
    fix: "Use an ordered list: a nav wrapping an ol, with one li per crumb, so the sequence is exposed.",
  },
  {
    bad: "The current crumb is distinguished only by bold text or a color.",
    why: "A user who cannot perceive the color or weight gets no cue about which page is current, and a screen reader gets nothing at all (fails 1.4.1).",
    fix: "Convey the current page with aria-current=\"page\" plus a visible non-color cue, not styling alone.",
  },
  {
    bad: "The BreadcrumbList structured data lists a different trail than the one on screen.",
    why: "Google requires breadcrumb markup to match visible content, so a mismatch is a structured-data violation and a sign the two representations have drifted.",
    fix: "Generate the visible list and the JSON-LD from a single array of crumbs so they cannot disagree.",
  },
  {
    bad: "On mobile the middle crumbs are deleted from the markup to save space.",
    why: "Removing them from the DOM strips them from the screen reader trail and from the structured data, and an ellipsis with no control leaves nothing to expand.",
    fix: "Keep every crumb in the DOM and collapse the middle behind a real button with a name like \"Show full path,\" and let the row wrap or scroll.",
  },
]

export default function AccessibleBreadcrumbsGuidePage() {
  return (
    <>
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />
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
                    Accessible Breadcrumbs
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
                Implementation Guide &bull; Updated August 2026
              </Badge>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
                Accessible Breadcrumb Navigation
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                A breadcrumb trail is one of the most-copied patterns on the web,
                and almost every version gets it nearly right before tripping on a
                small set of specific mistakes. It also answers to two audiences at
                once: screen reader users, through ARIA, and search engines, through
                structured data. This guide covers the semantic markup, marking the
                current page with <code>aria-current</code>, hiding the separators
                from assistive technology, keeping the visible trail and the
                <code> BreadcrumbList</code> data in sync, and shrinking long trails
                on mobile without breaking either. Copy-ready HTML and JSON-LD
                mapped to WCAG 2.2.
              </p>
            </div>
          </section>

          {/* The core idea */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                Why a Breadcrumb Is an Accessibility Feature
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  A breadcrumb answers one question: where am I in this site? It
                  shows the path from the home page down through the hierarchy to
                  the page you are on, so a visitor who arrived from a search
                  result, deep inside a large site, can see the structure above
                  them and climb back up a level with a single click. That sense of
                  place is easy to take for granted when you can see the whole page
                  at once, and it is exactly what a screen reader user, moving
                  through content one element at a time, does not get for free.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  It is worth being precise about what a breadcrumb is, because the
                  name invites a misreading. A breadcrumb is a <em>location</em>{" "}
                  trail, not a <em>history</em> trail. It reflects the page&rsquo;s
                  fixed position in the site structure, the same on every visit, not
                  the sequence of pages this particular user happened to click
                  through to get here. The browser back button already handles
                  history. A breadcrumb is also not a progress indicator for a
                  multi-step form or checkout; that is a separate pattern with its
                  own markup. Keeping the trail to a genuine hierarchy is what makes
                  it predictable, and predictability is half of accessibility.
                </p>
                <div className="not-prose rounded-lg border border-teal-200 dark:border-teal-900/50 bg-teal-50 dark:bg-teal-950/20 p-5 my-6">
                  <p className="text-sm font-semibold text-teal-900 dark:text-teal-200 mb-2">
                    The idea that ties this guide together
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    A breadcrumb has to satisfy two separate contracts with two
                    different readers. The first is with assistive technology, and
                    it is written in ARIA: a named navigation landmark wrapping an
                    ordered list, with the current page marked by{" "}
                    <code>aria-current</code>. The second is with search engines,
                    and it is written as <code>BreadcrumbList</code> structured data,
                    which is what turns a raw URL into a breadcrumb trail in the
                    search result. These are independent. You can nail one and fail
                    the other, and because they are maintained in different places
                    they quietly drift apart. A good breadcrumb keeps both correct
                    and keeps them describing the same trail.
                  </p>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Breadcrumbs earn their place on sites with real depth: a store
                  with categories and subcategories, documentation with nested
                  topics, a knowledge base. On a flat site with a handful of
                  top-level pages they add clutter without adding orientation, so
                  this is a pattern to use where the hierarchy is deep enough to get
                  lost in. Where they do belong, they are a small, cheap addition
                  that helps everyone, and getting the markup right is mostly a
                  matter of a few semantic choices, which the rest of this guide
                  walks through.
                </p>
              </div>
            </div>
          </section>

          {/* WCAG mapping */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <ShieldCheck className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                How Breadcrumbs Map to WCAG 2.2
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                The highlighted row,{" "}
                <Link href="/wcag/2-4-8" className="text-blue-600 dark:text-blue-400 hover:underline">
                  2.4.8 Location
                </Link>
                , is the criterion breadcrumbs were invented to satisfy: helping a
                user understand where the current page sits within the site. It is a
                AAA enhancement, so it is optional, but the rest of the table is not.
                Once you choose to build a breadcrumb, it has to meet the A and AA
                criteria that apply to any piece of navigation, from correct
                structure to a visible focus ring.
              </p>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    WCAG 2.2 success criteria that apply to breadcrumb navigation,
                    their conformance level, and how each one applies
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
                        How it applies to breadcrumbs
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                    <tr className="bg-blue-50/60 dark:bg-blue-950/20">
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-4-8" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.4.8 Location
                        </Link>
                      </th>
                      <td className="px-4 py-3">AAA</td>
                      <td className="px-4 py-3">A breadcrumb is the standard technique for showing where the current page sits in the site hierarchy, which is exactly what this criterion asks for.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-3-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          1.3.1 Info and Relationships
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">The trail is an ordered list inside a named navigation region, and which crumb is current is exposed in the markup, not just implied by styling.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/4-1-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                          4.1.2 Name, Role, Value
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">The navigation landmark carries an accessible name, and the current page is conveyed as a state with aria-current=&quot;page&quot;, not as visual weight.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-4-4" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.4.4 Link Purpose (In Context)
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Each crumb&rsquo;s link text names the level it leads to, so the destination is clear from the link and its place in the trail.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-4-5" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.4.5 Multiple Ways
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">Breadcrumbs are one accepted way to locate a page within a set, counting alongside site search and a sitemap toward providing more than one route to content.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-4-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          1.4.1 Use of Color
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">The current crumb and the separators must not be distinguished by color alone; the current state comes from aria-current and a non-color cue.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-4-7" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.4.7 Focus Visible
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">Every crumb that is a link takes keyboard focus and shows a clearly visible focus indicator as the user tabs across the trail.</td>
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

          {/* 1. Minimum viable breadcrumb */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                1. The Minimum Viable Accessible Breadcrumb
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Almost all of a breadcrumb&rsquo;s accessibility comes from four
                  markup decisions, and none of them needs JavaScript. Wrap the
                  trail in a <code>&lt;nav&gt;</code> with an accessible name. Put
                  the crumbs in an <em>ordered</em> list, because their sequence
                  from root to current page is meaningful. Make every ancestor crumb
                  a link. Mark the final crumb, the current page, with{" "}
                  <code>aria-current=&quot;page&quot;</code>. Here is the whole
                  pattern:
                </p>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`<nav aria-label="Breadcrumb">
  <ol>
    <li><a href="/">Home</a></li>
    <li><a href="/shoes/">Shoes</a></li>
    <li><a href="/shoes/running/">Running</a></li>
    <li>
      <a href="/shoes/running/trailblazer/" aria-current="page">
        Trailblazer 3
      </a>
    </li>
  </ol>
</nav>`}</code></pre>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Each decision is doing real work. The{" "}
                  <code>&lt;nav aria-label=&quot;Breadcrumb&quot;&gt;</code> exposes
                  a{" "}
                  <Link href="/guides/landmarks-page-structure" className="text-blue-600 dark:text-blue-400 hover:underline">
                    navigation landmark
                  </Link>{" "}
                  with a distinct name, so a screen reader user can find and skip to
                  the breadcrumb, and can tell it apart from the main menu, which is
                  also a navigation landmark. Write the label as{" "}
                  <code>Breadcrumb</code>, not <code>Breadcrumb navigation</code>:
                  the role already contributes the word navigation, so the longer
                  label is announced as &ldquo;Breadcrumb navigation, navigation.&rdquo;
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The <code>&lt;ol&gt;</code> is deliberate. A breadcrumb is an
                  ordered sequence, home first and current page last, and the ordered
                  list is what carries that meaning to assistive technology. It also
                  gives the user an item count, so a screen reader can announce
                  &ldquo;list, four items&rdquo; and let them move crumb by crumb.
                  An unordered list works mechanically, and some famous design
                  systems ship one, but <code>&lt;ol&gt;</code> is the honest choice
                  for content whose order is the point.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Everything except the last crumb is a link that climbs one level
                  of the hierarchy. The last crumb names the current page and carries{" "}
                  <code>aria-current=&quot;page&quot;</code>, which section three
                  covers in full. That single attribute is what tells a non-visual
                  user which crumb is the end of the trail, and it is the piece most
                  breadcrumbs leave out.
                </p>
              </div>
            </div>
          </section>

          {/* 2. Separators */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                2. The Separators Are Decoration: the Number One Bug
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The most common breadcrumb accessibility bug is not a missing
                  attribute; it is the little slash, chevron, or arrow between the
                  crumbs. Those separators are purely visual. They tell a sighted
                  user where one crumb ends and the next begins, but the list
                  structure already conveys that to assistive technology, so the
                  separator conveys nothing new. When it is real text in the markup,
                  a screen reader dutifully reads it, and the trail comes out as
                  &ldquo;Home, slash, Shoes, slash, Running, slash, Trailblazer 3.&rdquo;
                  The fix is to make sure the separator never reaches the
                  accessibility tree.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                  Best: draw it with CSS
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The cleanest approach keeps the separator out of the DOM entirely,
                  by generating it with a CSS pseudo-element. Content added through{" "}
                  <code>::before</code> or <code>::after</code> is presentational and
                  is not exposed to assistive technology, so there is nothing for a
                  screen reader to read:
                </p>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`<nav aria-label="Breadcrumb">
  <ol class="breadcrumb">
    <li><a href="/">Home</a></li>
    <li><a href="/shoes/">Shoes</a></li>
    <li><span aria-current="page">Running</span></li>
  </ol>
</nav>

<style>
  .breadcrumb { display: flex; flex-wrap: wrap; list-style: none; }
  /* The separator is drawn before each crumb except the first. */
  .breadcrumb li + li::before {
    content: "/";
    margin: 0 0.5rem;
    color: #64748b;   /* decorative only */
  }
</style>`}</code></pre>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                  Acceptable: hide it with aria-hidden
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Sometimes the separator has to be in the markup, for example a
                  designed chevron delivered as an inline SVG. In that case, hide it
                  from assistive technology with{" "}
                  <code>aria-hidden=&quot;true&quot;</code>. For an inline SVG, also
                  add <code>focusable=&quot;false&quot;</code>, because in some
                  browsers an SVG can otherwise become a stray tab stop:
                </p>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`<ol class="breadcrumb">
  <li><a href="/">Home</a></li>
  <li aria-hidden="true">
    <svg aria-hidden="true" focusable="false" width="16" height="16"> ... </svg>
  </li>
  <li><a href="/shoes/">Shoes</a></li>
</ol>`}</code></pre>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Two rules apply whichever technique you use. Never put the
                  separator <em>inside</em> the link, or it becomes part of the link
                  text and, worse, part of the clickable target. And remember the
                  separators fall under{" "}
                  <Link href="/wcag/1-4-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.4.1 Use of Color
                  </Link>{" "}
                  only in the sense that they must never be the <em>only</em> thing
                  distinguishing crumbs; since the list already separates them
                  structurally, a decorative separator is safe as long as it is
                  hidden from assistive technology.
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
                  <code>aria-current</code> is a state that marks the single item in
                  a set that represents the user&rsquo;s current position. In a
                  breadcrumb it belongs on exactly one crumb, the last one, the page
                  you are on. A screen reader announces that crumb as &ldquo;current
                  page,&rdquo; which is how a non-visual user knows the trail has
                  reached its end. Leave it off and the last crumb is just another
                  item; put it on more than one crumb and it stops meaning anything.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Use the value <code>page</code>, not the generic{" "}
                  <code>true</code>. Both are valid, but <code>aria-current</code>{" "}
                  has several token values for different kinds of set, and{" "}
                  <code>page</code> is the one that means &ldquo;the current page in
                  a set of pages,&rdquo; which is precisely a breadcrumb:
                </p>
                <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 my-6">
                  <table className="w-full text-sm text-left">
                    <caption className="sr-only">
                      The token values of aria-current and what each one is for
                    </caption>
                    <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
                      <tr>
                        <th scope="col" className="px-4 py-3 font-semibold">Value</th>
                        <th scope="col" className="px-4 py-3 font-semibold">Use it for</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                      <tr>
                        <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top"><code>page</code></th>
                        <td className="px-4 py-3 align-top">The current page within a set of pages. This is the breadcrumb value, and also the one for the active link in a site menu.</td>
                      </tr>
                      <tr>
                        <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top"><code>step</code></th>
                        <td className="px-4 py-3 align-top">The current step in a multi-step process, such as a checkout progress indicator. Not a breadcrumb.</td>
                      </tr>
                      <tr>
                        <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top"><code>location</code></th>
                        <td className="px-4 py-3 align-top">The current location in a visual flow such as a diagram or map, where page does not fit.</td>
                      </tr>
                      <tr>
                        <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top"><code>true</code></th>
                        <td className="px-4 py-3 align-top">The current item when none of the specific tokens fits. Valid in a breadcrumb, but page is more precise.</td>
                      </tr>
                      <tr>
                        <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top"><code>date</code>, <code>time</code></th>
                        <td className="px-4 py-3 align-top">The current date or time within a calendar or scheduler.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                  Link or plain text?
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The current crumb can be a link to the current page or plain text,
                  and both are accepted. The{" "}
                  <Link href="/guides/using-aria" className="text-blue-600 dark:text-blue-400 hover:underline">
                    WAI-ARIA Authoring Practices
                  </Link>{" "}
                  example renders it as a link carrying{" "}
                  <code>aria-current=&quot;page&quot;</code>, which keeps every crumb
                  visually and behaviorally consistent. Many teams instead render the
                  last crumb as a plain <code>&lt;span&gt;</code> with{" "}
                  <code>aria-current=&quot;page&quot;</code>, on the reasoning that a
                  link to the page you are already on does nothing useful. Either is
                  fine; the two things that are not fine are leaving the current page
                  unmarked, and making it a link to some <em>other</em> page. What
                  matters is the state, not the element.
                </p>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`<!-- As a link (APG example) -->
<li><a href="/shoes/running/" aria-current="page">Running</a></li>

<!-- As plain text (also correct) -->
<li><span aria-current="page">Running</span></li>`}</code></pre>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  One caution that ties back to{" "}
                  <Link href="/wcag/1-4-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.4.1 Use of Color
                  </Link>
                  : do not let bold text or a color be the <em>only</em> signal that
                  a crumb is current. A sighted user who cannot perceive the weight
                  or hue, and every screen reader user, needs the state to come from{" "}
                  <code>aria-current</code>. Many designs also style the current
                  crumb with <code>aria-current</code> as the CSS hook, for example{" "}
                  <code>{`[aria-current="page"] { font-weight: 600; }`}</code>, which
                  keeps the visual and the programmatic cue from ever disagreeing.
                </p>
              </div>
            </div>
          </section>

          {/* 4. Structured data */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                4. The Second Contract: BreadcrumbList Structured Data
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The ARIA markup makes the breadcrumb work for people using
                  assistive technology. It does nothing for search engines, which
                  read a separate representation: <code>BreadcrumbList</code>{" "}
                  structured data. This is the markup that lets Google replace the
                  bare URL in a search result with a readable trail like{" "}
                  <em>Home &rsaquo; Shoes &rsaquo; Running</em>, and it is worth
                  adding on any site where breadcrumbs matter for discoverability.
                  The recommended format is JSON-LD, a script block that describes
                  the trail as data, kept separate from the visible HTML:
                </p>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home",    "item": "https://example.com/" },
    { "@type": "ListItem", "position": 2, "name": "Shoes",   "item": "https://example.com/shoes/" },
    { "@type": "ListItem", "position": 3, "name": "Running", "item": "https://example.com/shoes/running/" }
  ]
}
</script>`}</code></pre>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Each <code>ListItem</code> has a <code>position</code> counting
                  from one, a <code>name</code> that matches the crumb text, and an{" "}
                  <code>item</code> URL. The last item can omit its{" "}
                  <code>item</code> URL to signal the current page, though including
                  it is also accepted. This is exactly the shape the{" "}
                  <code>BreadcrumbStructuredData</code> component on this site emits
                  for every page, including this one, which you can confirm by
                  viewing source.
                </p>
                <div className="not-prose rounded-lg border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/20 p-5 my-6">
                  <p className="text-sm font-semibold text-amber-900 dark:text-amber-200 mb-2">
                    The rule that connects the two contracts
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    The structured data must describe the same trail the user can
                    see. Google&rsquo;s guidelines require breadcrumb markup to
                    reflect visible content, so a <code>BreadcrumbList</code> that
                    lists pages the on-screen breadcrumb does not show, or names them
                    differently, is a structured-data violation as well as a sign the
                    two representations have drifted. The failure mode is mundane:
                    someone updates the visible labels, or reorders the hierarchy, and
                    forgets the JSON-LD, so the accessible trail and the SEO trail
                    slowly diverge. The reliable defense is to generate both from one
                    source.
                  </p>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  In a component-based codebase that source is usually a single array
                  of crumbs that feeds both the rendered list and the JSON-LD, so
                  they cannot disagree by construction:
                </p>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`// One array of crumbs is the single source of truth.
const crumbs = [
  { name: "Home",    url: "/" },
  { name: "Shoes",   url: "/shoes/" },
  { name: "Running", url: "/shoes/running/" },
]

// The visible list and the BreadcrumbList JSON-LD both read from it,
// so the accessible trail and the SEO trail always match.
<nav aria-label="Breadcrumb">
  <ol>
    {crumbs.map((crumb, i) => {
      const isLast = i === crumbs.length - 1
      return (
        <li key={crumb.url}>
          {isLast
            ? <span aria-current="page">{crumb.name}</span>
            : <a href={crumb.url}>{crumb.name}</a>}
        </li>
      )
    })}
  </ol>
</nav>`}</code></pre>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You may also see breadcrumbs marked up inline with microdata or
                  RDFa attributes woven into the HTML. That still works, but JSON-LD
                  is the format Google recommends and the easiest to keep correct,
                  precisely because it lives in one place rather than being scattered
                  across the markup. Whichever you choose, the accessible HTML and
                  the structured data are two different jobs: the ARIA is for the
                  screen reader, the <code>BreadcrumbList</code> is for the crawler,
                  and neither one substitutes for the other.
                </p>
              </div>
            </div>
          </section>

          {/* 5. Truncation / responsive */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                5. Long Trails: Truncation and Responsive Breadcrumbs
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  A five-level trail does not fit a narrow phone screen, and the
                  usual answer is to collapse the middle, showing the root, an
                  ellipsis, and the last crumb or two, so it reads as{" "}
                  <em>Home &rsaquo; &hellip; &rsaquo; Trailblazer 3</em>. Done
                  carelessly, this quietly breaks both contracts at once, so it is
                  worth doing deliberately.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The rule is simple: collapse the trail visually, but keep every
                  crumb in the DOM. If you solve the space problem by deleting the
                  middle crumbs from the markup, you remove them from the screen
                  reader trail and from the <code>BreadcrumbList</code> data in the
                  same stroke, so a non-visual user and a search crawler both lose
                  the middle of the hierarchy. Instead, hide the middle crumbs with
                  CSS and expose them behind a control:
                </p>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`<nav aria-label="Breadcrumb">
  <ol>
    <li><a href="/">Home</a></li>

    <!-- A real button, not a bare ellipsis, reveals the hidden crumbs -->
    <li>
      <button type="button" aria-expanded="false" aria-controls="crumb-rest">
        <span aria-hidden="true">&hellip;</span>
        <span class="sr-only">Show full path</span>
      </button>
    </li>

    <!-- Present in the DOM, visually collapsed until expanded -->
    <li id="crumb-rest" hidden><a href="/shoes/">Shoes</a></li>
    <li><a href="/shoes/running/">Running</a></li>
    <li><span aria-current="page">Trailblazer 3</span></li>
  </ol>
</nav>`}</code></pre>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The collapse control has to be a real <code>&lt;button&gt;</code>{" "}
                  with an accessible name, here provided by an{" "}
                  <code>.sr-only</code> label because the visible glyph is only an
                  ellipsis. It carries <code>aria-expanded</code> so its state is
                  announced, and activating it reveals the hidden crumbs. That
                  behavior is a small disclosure widget; the{" "}
                  <Link href="/guides/accessible-accordion" className="text-blue-600 dark:text-blue-400 hover:underline">
                    accordion and disclosure guide
                  </Link>{" "}
                  covers the pattern in depth. A simpler alternative that avoids the
                  button entirely is to let the row wrap onto two lines, or to make
                  the breadcrumb a horizontally scrollable strip, keeping every crumb
                  visible and reachable.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Whatever the approach, the breadcrumb must not force the page to
                  scroll horizontally at 320 pixels wide, which would fail{" "}
                  <Link href="/wcag/1-4-10" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.4.10 Reflow
                  </Link>
                  , which keeps content usable when zoomed. Wrapping and a self-scrolling
                  strip both satisfy that; a trail that pushes the whole layout wider
                  than the viewport does not.
                </p>
              </div>
            </div>
          </section>

          {/* 6. How SR users experience it */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                6. What a Breadcrumb Sounds Like to a Screen Reader User
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  It helps to know what all of this markup adds up to at the other
                  end. A screen reader user rarely reads a page top to bottom; they
                  move by landmark and by list. Because the breadcrumb is a named
                  navigation landmark, it shows up in the landmarks list as
                  &ldquo;Breadcrumb navigation,&rdquo; and the user can jump straight
                  to it, exactly as covered in the{" "}
                  <Link href="/guides/landmarks-page-structure" className="text-blue-600 dark:text-blue-400 hover:underline">
                    landmarks and page structure guide
                  </Link>
                  .
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Inside it, a well-built trail is announced as an ordered list with a
                  known number of items, and each item reads as its link text with no
                  separator noise: &ldquo;Home, link. Shoes, link. Running, link.
                  Trailblazer 3, current page.&rdquo; That last phrase, current page,
                  is the payoff of <code>aria-current</code>, and it is the difference
                  between a user knowing they have reached the end of the trail and
                  wondering whether there is another crumb coming. Compare that to a
                  broken trail, where the same content might read as &ldquo;Home,
                  slash, Shoes, slash, Running, slash, Trailblazer 3&rdquo; with no
                  list, no current-page cue, and a slash after every word. The markup
                  choices in this guide are what separate the two.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The commands differ by screen reader:{" "}
                  <Link href="/guides/nvda-screen-reader-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                    NVDA
                  </Link>{" "}
                  and{" "}
                  <Link href="/guides/jaws-screen-reader-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                    JAWS
                  </Link>{" "}
                  reach the breadcrumb through the landmark and list navigation keys,
                  while{" "}
                  <Link href="/guides/voiceover-screen-reader-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                    VoiceOver
                  </Link>{" "}
                  uses the rotor. In every case the experience depends on the same few
                  attributes being present, which is why testing with a real screen
                  reader, covered next, is the check that matters.
                </p>
              </div>
            </div>
          </section>

          {/* 7. Testing */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                7. Testing a Breadcrumb
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-2 mb-3">
                  Keyboard
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Tab across the trail. Every ancestor crumb should take focus in
                  order, show a clearly visible focus indicator, and activate with
                  Enter. If the current crumb is plain text it is correctly skipped;
                  if it is a link, it takes focus like the others. If you built a
                  collapse control, it should be reachable by Tab, operable with
                  Enter or Space, and it should reveal the hidden crumbs when
                  activated.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                  Screen reader
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  This is the test that catches the real bugs. Open the landmarks
                  list and confirm the breadcrumb appears with its name, distinct
                  from the main navigation. Move into it and listen: you should hear
                  an ordered list, each crumb as its link text, the current page
                  announced as &ldquo;current page,&rdquo; and crucially{" "}
                  <em>no separators read aloud</em>. If you hear &ldquo;slash&rdquo;
                  between crumbs, your separators are not hidden. If you never hear
                  &ldquo;current page,&rdquo; the <code>aria-current</code> is missing.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                  Structured data
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Validate the <code>BreadcrumbList</code> JSON-LD with Google&rsquo;s
                  Rich Results Test or the Schema.org validator, and then do the check
                  no tool performs for you: read the structured data next to the
                  visible trail and confirm they list the same pages, in the same
                  order, with the same names.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                  What tools catch, and what they do not
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Automated checkers such as{" "}
                  <Link href="/guides/axe-vs-wave" className="text-blue-600 dark:text-blue-400 hover:underline">
                    axe and WAVE
                  </Link>{" "}
                  will flag a navigation landmark with no accessible name and other
                  mechanical faults, and the Rich Results Test will flag malformed
                  structured data. What none of them can judge is whether the trail is{" "}
                  <em>right</em>: whether it reflects the true hierarchy, whether the
                  current page is the one actually marked, whether the separators are
                  meaningfully hidden, or whether the visible trail and the JSON-LD
                  agree. As the{" "}
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
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                Common Breadcrumb Mistakes &amp; How to Fix Them
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                These are the errors that turn up most in real breadcrumb audits.
                Most come back to two habits: treating the separators as content
                instead of decoration, and letting the visible trail, the ARIA, and
                the structured data fall out of sync.
              </p>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    Common breadcrumb anti-patterns, why each one fails, and the fix
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
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <ListChecks className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                The Accessible Breadcrumb Checklist
              </h2>
              <ol className="space-y-4 text-muted-foreground leading-relaxed list-decimal pl-6">
                <li>
                  <strong className="text-slate-900 dark:text-white">Wrapped in a named landmark.</strong>{" "}
                  The trail sits inside{" "}
                  <code>&lt;nav aria-label=&quot;Breadcrumb&quot;&gt;</code>, so it is
                  a distinct navigation landmark, without the word navigation in the label.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">An ordered list.</strong>{" "}
                  The crumbs are an <code>&lt;ol&gt;</code> with one{" "}
                  <code>&lt;li&gt;</code> each, because the sequence from root to
                  current page is meaningful.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Ancestors are links.</strong>{" "}
                  Every crumb except the current page is a link that climbs one level
                  of the hierarchy, with clear text.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">The current page is marked.</strong>{" "}
                  The last crumb carries <code>aria-current=&quot;page&quot;</code>,
                  and it is either plain text or a link to the current page, never a
                  link elsewhere.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Separators are decorative.</strong>{" "}
                  The slash or chevron is drawn with CSS or hidden with{" "}
                  <code>aria-hidden=&quot;true&quot;</code>, and is never read aloud
                  or placed inside a link.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Not color alone.</strong>{" "}
                  The current crumb is conveyed by <code>aria-current</code> plus a
                  non-color cue, not by weight or hue on its own.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Focus is visible.</strong>{" "}
                  Each crumb link takes keyboard focus in order and shows a clearly
                  visible focus indicator.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Structured data matches.</strong>{" "}
                  The <code>BreadcrumbList</code> JSON-LD lists the same pages, in the
                  same order, with the same names as the visible trail.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Long trails collapse safely.</strong>{" "}
                  On small screens the middle crumbs stay in the DOM and collapse
                  behind a real button, and the row never forces horizontal page scrolling.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Verified with a screen reader.</strong>{" "}
                  The Breadcrumb landmark announces an ordered list, each crumb, and
                  the current page, with no separator noise.
                </li>
              </ol>
            </div>
          </section>

          {/* CTA */}
          <section className="py-12 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <div className="rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20 p-8 text-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  Breadcrumbs Are One Part of a Page&rsquo;s Structure
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6 max-w-lg mx-auto">
                  A breadcrumb is a named navigation landmark, so it sits inside the
                  wider system of landmarks and headings that a screen reader user
                  navigates by. See how the whole structure fits together, and the
                  criterion breadcrumbs exist to satisfy.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button asChild size="lg" className="gap-2">
                    <Link href="/guides/landmarks-page-structure">
                      Landmarks &amp; Page Structure Guide
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="gap-2">
                    <Link href="/wcag/2-4-8">
                      WCAG 2.4.8 Location
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
                content="accessible breadcrumbs breadcrumb accessibility aria breadcrumb breadcrumb navigation accessibility aria-current page aria-current breadcrumb breadcrumb aria-label accessible breadcrumb navigation breadcrumb separators accessibility breadcrumblist schema breadcrumb structured data breadcrumb ol vs ul breadcrumb wcag wcag 2.4.8 location breadcrumb screen reader accessible breadcrumb html breadcrumb current page responsive breadcrumbs accessibility breadcrumb truncation nav aria-label breadcrumb navigation landmark ordered list current page aria-current structured data json-ld schema.org breadcrumblist landmarks page structure info and relationships 1.3.1 2.4.8 2.4.5 2.4.4 4.1.2 1.4.1 2.4.7"
              />
            </div>
          </section>
        </article>
      </div>
    </>
  )
}
