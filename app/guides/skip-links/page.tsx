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

const pageTitle = "Skip Links & Bypass Blocks: The WCAG 2.4.1 Build Guide"
const pageDescription =
  "Build a skip link that actually works: the first-focusable-element HTML, the visually-hidden-until-focused CSS, and the number one bug where the page scrolls but keyboard focus never moves because the target is not focusable. Plus landmarks and headings as the real bypass for screen reader users, multiple skip links, skip links in single-page apps and React, and how to test bypass blocks. Copy-ready code mapped to WCAG 2.2 (2.4.1)."

export const metadata: Metadata = {
  title: pageTitle,
  description: clampDescription(pageDescription),
  keywords: [
    "skip links",
    "skip link",
    "skip to main content",
    "skip navigation",
    "bypass blocks",
    "wcag 2.4.1",
    "skip link not working",
    "skip link focus",
    "skip link tabindex -1",
    "visually hidden skip link",
    "skip link css",
    "skip navigation link",
    "landmark regions accessibility",
    "aria landmarks",
    "skip link react",
    "skip link single page app",
    "keyboard bypass repeated content",
    "skip link accessibility",
    "accessible skip link",
  ],
  alternates: {
    canonical: "/guides/skip-links",
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: "/guides/skip-links",
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
      {
        url: `/api/og?title=${encodeURIComponent(pageTitle)}&section=Guide`,
        width: 1200,
        height: 630,
      },
    ],
  },
}

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Guides", url: "https://accessibility.build/guides" },
  {
    name: "Skip Links & Bypass Blocks",
    url: "https://accessibility.build/guides/skip-links",
  },
]

const faqs = [
  {
    question: "What is a skip link and who is it actually for?",
    answer:
      "A skip link is a link, usually the first focusable element on the page, that jumps a keyboard user past repeated blocks such as the header and primary navigation straight to the main content. Its primary audience is narrower than most people assume: sighted keyboard users who do not run a screen reader. A screen reader user already has faster ways to bypass repeated content, jumping by landmark region or by heading, and rarely reaches for the skip link. A sighted keyboard user has none of those shortcuts, so without a skip link they must press Tab through every navigation link on every page just to reach the content. That is why the skip link must become visible when it receives focus: if it stays hidden, the one group it exists to serve cannot see that it is there.",
  },
  {
    question: "Why does my skip link scroll the page but not move keyboard focus?",
    answer:
      "This is the single most common skip-link bug, and it is not a CSS problem. Activating a link to a fragment such as #main-content moves keyboard focus to the target only if that target is an element that can receive focus. Links, buttons, and form fields can; a plain <main>, <div>, or <section> cannot by default. So the browser scrolls the target into view but leaves focus back at the top of the page, and the user's next Tab press sends them right back into the navigation they were trying to skip. The fix is to make the target focusable by adding tabindex=\"-1\" to it, for example <main id=\"main-content\" tabindex=\"-1\">. A value of -1 lets the element receive programmatic and click-driven focus without adding it to the normal Tab order. With that in place, activating the skip link both scrolls to and focuses the main content, and the next Tab continues from there.",
  },
  {
    question: "Does a skip link have to be visible?",
    answer:
      "It does not have to be visible all the time, but it must become visible when it receives keyboard focus. The standard pattern positions the link off-screen until it is focused, then brings it into view at the top of the page. What you must not do is hide it with display:none or visibility:hidden, because both remove the link from the tab order entirely, so a keyboard user can never reach it and the skip mechanism does nothing. A skip link that is always visible is perfectly valid too, and some design systems keep it on screen deliberately; hiding it until focus is a visual-design choice, not an accessibility requirement. The accessibility requirement is only that a keyboard user can reach it and see it when they do.",
  },
  {
    question: "Isn't a skip link redundant if I already have proper landmarks and headings?",
    answer:
      "No, because landmarks, headings, and skip links serve overlapping but different audiences. Landmark regions and a logical heading structure let screen reader users jump over repeated content, and they are the primary bypass mechanism for those users. But a sighted keyboard user who does not run a screen reader gets no benefit from landmarks or headings; their only fast way past the navigation is a skip link. Support also varies: landmark navigation is well supported in modern screen readers but not universal, so a skip link is the most reliable single technique. The right approach is to provide all three: a visible-on-focus skip link for keyboard users, correct landmark regions, and a sound heading outline. They reinforce each other rather than duplicate work.",
  },
  {
    question: "Where should the skip link go, and where should it point?",
    answer:
      "The skip link should be the very first focusable element in the DOM, so it is the first thing a keyboard user reaches when they press Tab on a fresh page. If a cookie banner, a logo link, or a search box comes before it in source order, the user has to tab through those first and the skip link loses much of its value. The target should be the start of the main content, normally the page's single <main> element or the primary content container. Give that target tabindex=\"-1\" so it can receive focus, point the link's href at its id, and confirm that activating the link both moves focus to the target and scrolls it into view. Pointing a skip link at a target that cannot receive focus is the usual reason a skip link appears to do nothing.",
  },
  {
    question: "How many skip links should a page have?",
    answer:
      "One well-placed skip link to the main content covers most pages. Add more only when a page has several distinct blocks of repeated content worth bypassing, for example a site with a mega-menu, a secondary toolbar, and a search region, where separate \"Skip to navigation\", \"Skip to search\", and \"Skip to main content\" links each save real effort. The first link should still be the skip-to-main-content one, since that is what most users want. You can also use the same idea inside content: a link that lets keyboard users jump over a very long data table, a large embedded widget, or an extended list of links is a legitimate bypass mechanism. Do not overdo it; a wall of skip links at the top of every page becomes its own block to tab through.",
  },
  {
    question: "How do skip links work in a single-page app or React?",
    answer:
      "The mechanics are the same, but single-page apps add a focus-management problem. When the user navigates client-side, the page does not reload, so browser focus stays wherever it was and the skip link's target may still point at the previous view. Two things fix this. First, keep a skip link as the first focusable element and point it at the main region as usual, so it works within any given view. Second, on each route change move focus deliberately to the new view's main region or its heading, so the user starts from the content rather than from stale focus, and so the skip link's target is the current one. In React that is a SkipLink component plus an effect that runs on navigation and calls focus() on the main element (which carries tabindex=\"-1\"). This overlaps with route-change focus management generally, covered in the focus management guide.",
  },
  {
    question: "How do I test that bypass blocks work?",
    answer:
      "Start with the keyboard, because that is the audience the skip link serves. Load the page, press Tab once, and confirm a visible skip link appears with a clear focus indicator. Activate it with Enter, then press Tab again and confirm the next focus stop is inside the main content, not back in the navigation; if it returns to the top, the target is missing tabindex=\"-1\". Then test the screen reader bypass: open the screen reader's list of landmarks and confirm there is one main region and that repeated regions such as multiple navs have distinct names, and open its list of headings and confirm the outline is logical with a single h1. Automated tools such as axe and WAVE can flag a missing main landmark or a page with no headings, but they cannot tell you whether the skip link actually moves focus, so the keyboard pass is essential.",
  },
]

const antiPatterns = [
  {
    bad: "Hiding the skip link with display:none or visibility:hidden.",
    why: "Both properties remove the link from the tab order, so a keyboard user can never reach it and the bypass mechanism does nothing at all (fails 2.4.1).",
    fix: "Position the link off-screen with a visually-hidden technique that keeps it focusable, then bring it into view on :focus. Never use display:none or visibility:hidden.",
  },
  {
    bad: "A skip link that never becomes visible when focused.",
    why: "The sighted keyboard user it exists to serve tabs onto an invisible link, sees focus apparently vanish, and has no idea the shortcut is there (fails 2.4.7 and undermines 2.4.1).",
    fix: "Move the link back on-screen on :focus with a clearly visible focus indicator, so pressing Tab once reveals it at the top of the page.",
  },
  {
    bad: "The target has no tabindex, so activating the link scrolls but does not move focus.",
    why: "A <main> or <div> cannot receive focus by default, so the browser scrolls to it but leaves keyboard focus at the top; the next Tab returns the user into the navigation (fails 2.4.3 and 2.1.1 in effect).",
    fix: "Add tabindex=\"-1\" to the target element so it can receive programmatic focus, and confirm focus actually lands there after activation.",
  },
  {
    bad: "The skip link is not the first focusable element on the page.",
    why: "If a cookie banner, logo link, or search field comes first in the DOM, the user must tab through them before reaching the skip link, which defeats much of its purpose.",
    fix: "Place the skip link as the very first focusable element in the document, ahead of the header and any other interactive chrome.",
  },
  {
    bad: "Relying on landmarks alone and shipping no skip link.",
    why: "Landmarks help screen reader users, but a sighted keyboard user who does not run a screen reader has no way to use them and is left tabbing through the whole header on every page.",
    fix: "Provide a visible-on-focus skip link in addition to correct landmarks and headings. The three mechanisms serve different audiences.",
  },
  {
    bad: "The skip target lands under a sticky header that hides it.",
    why: "Focus reaches the target, but a fixed or sticky header covers it, so a sighted keyboard user cannot see where focus went (fails 2.4.11 Focus Not Obscured).",
    fix: "Add scroll-margin-top to the target equal to the header height so it scrolls clear of the fixed header when focused.",
  },
]

export default function SkipLinksGuidePage() {
  return (
    <>
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />
      <GuideArticleSchema route="/guides/skip-links" title={pageTitle} description={pageDescription} datePublished="2026-08-12" />
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
                  <span className="text-slate-900 dark:text-white font-medium">
                    Skip Links &amp; Bypass Blocks
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
                Skip Links &amp; Bypass Blocks
              </h1>
              <PageByline route="/guides/skip-links" className="mb-5" />
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                A skip link exists mainly for one group of people: sighted
                keyboard users who never open a screen reader. Screen reader
                users bypass repeated content with landmarks and headings and
                rarely touch it. That single fact decides how you build one,
                where it goes, and why it must appear on focus. This guide covers
                the working skip link end to end, the number one bug that makes
                skip links silently fail, and the landmarks and headings that do
                the real bypass work. Mapped to WCAG 2.2, with copy-ready code.
              </p>
            </div>
          </section>

          {/* The core idea */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                What Bypass Blocks Actually Solves
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Nearly every page on a site repeats the same chrome at the top:
                  a logo, a primary navigation menu, maybe a search box and a row
                  of utility links. A mouse user ignores all of it and clicks
                  straight into the content. A keyboard user cannot. Without a way
                  to bypass those repeated blocks, they must press Tab through
                  every one of those links,{" "}
                  <em>on every page they visit</em>, before they reach anything
                  new.{" "}
                  <Link href="/wcag/2-4-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                    WCAG 2.4.1 Bypass Blocks
                  </Link>{" "}
                  (Level A) requires that a mechanism exists to skip that
                  repetition.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The criterion can be satisfied in three ways, and the most
                  important thing to understand before writing any code is that{" "}
                  <strong className="text-slate-900 dark:text-white">
                    the three mechanisms serve different people
                  </strong>
                  :
                </p>
                <ul className="text-muted-foreground leading-relaxed mb-4 list-disc pl-6 space-y-2">
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      A skip link
                    </strong>{" "}
                    is a link near the top of the page that jumps focus to the
                    main content. It is the only fast bypass available to a{" "}
                    <em>sighted keyboard user who does not run a screen reader</em>
                    , a group that includes people with motor disabilities, people
                    using switch access or a keyboard for speed, and anyone whose
                    mouse is unavailable.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Landmark regions
                    </strong>{" "}
                    let a screen reader user jump straight to <code>main</code>,{" "}
                    <code>navigation</code>, or any other region with a single
                    command. This is how most screen reader users actually bypass
                    repeated content.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      A logical heading structure
                    </strong>{" "}
                    lets a screen reader user move heading to heading, skimming the
                    page the way a sighted reader skims with their eyes.
                  </li>
                </ul>
                <div className="not-prose rounded-lg border border-teal-200 dark:border-teal-900/50 bg-teal-50 dark:bg-teal-950/20 p-5 my-6">
                  <p className="text-sm font-semibold text-teal-900 dark:text-teal-200 mb-2">
                    The reframe that decides everything
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    The skip link is for keyboard users who can see; landmarks and
                    headings are for screen reader users. Because its audience can
                    see, a skip link that stays hidden helps nobody, which is
                    exactly why it must become visible on focus. And because you
                    have two separate audiences, you owe all three mechanisms, not
                    one instead of the others. Provide a visible-on-focus skip
                    link <em>and</em> correct landmarks <em>and</em> a sound
                    heading outline.
                  </p>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The rest of this guide builds the skip link first, because it is
                  where the subtle failures live, then covers the landmarks and
                  headings that carry the bypass for screen reader users.
                </p>
              </div>
            </div>
          </section>

          {/* WCAG mapping */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <ShieldCheck className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                How Bypass Blocks Maps to WCAG 2.2
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                The highlighted row,{" "}
                <Link href="/wcag/2-4-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                  2.4.1 Bypass Blocks
                </Link>
                , is the criterion this guide serves. The rest are the criteria a
                working skip link, and the landmarks and headings behind it, must
                also satisfy, from moving focus in a logical order to keeping the
                target visible under a sticky header.
              </p>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    WCAG 2.2 success criteria that apply to skip links and bypass
                    blocks, their conformance level, and how each one applies
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
                        How it applies to bypassing blocks
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                    <tr className="bg-blue-50/60 dark:bg-blue-950/20">
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-4-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.4.1 Bypass Blocks
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">A mechanism must let users skip blocks of content repeated across pages. A skip link, landmark regions, or headings each qualify.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-3-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          1.3.1 Info and Relationships
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">When landmarks or headings are the bypass, the region and heading structure must exist in the markup, not just look like structure visually.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-4-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.4.3 Focus Order
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Activating the skip link must actually move focus to the target, in an order that preserves meaning. Focus that stays at the top is the classic failure.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-4-7" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.4.7 Focus Visible
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">When the skip link receives focus it must show a clearly visible focus indicator, which is what reveals a link hidden until focus.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-4-11" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.4.11 Focus Not Obscured
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">The skip link when shown, and the target once focused, must not be hidden behind a sticky or fixed header. New in WCAG 2.2.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/4-1-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                          4.1.2 Name, Role, Value
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Repeated landmarks of the same type, such as two nav regions, need distinct accessible names so a screen reader user can tell them apart.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-1-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.1.1 Keyboard
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">The skip mechanism must be operable by keyboard. In practice this means the target has to be able to receive keyboard focus.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-4-10" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.4.10 Section Headings
                        </Link>
                      </th>
                      <td className="px-4 py-3">AAA</td>
                      <td className="px-4 py-3">Organizing content under section headings is an additional way to bypass blocks, useful to keep in mind even though it sits at AAA.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-muted-foreground leading-relaxed mt-4 text-sm">
                For the full wording and an interactive demo of the core
                criterion, see the{" "}
                <Link
                  href="/wcag/2-4-1"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  WCAG 2.4.1 Bypass Blocks
                </Link>{" "}
                reference. The rest of the{" "}
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

          {/* 1. The minimum viable skip link */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                1. The Minimum Viable Skip Link
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  A working skip link is three small pieces of markup: a link that
                  is the first focusable element in the document, a target at the
                  start of the main content, and a CSS rule that reveals the link
                  on focus. Here is the whole thing:
                </p>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`<body>
  <!-- The very first focusable element on the page -->
  <a class="skip-link" href="#main-content">
    Skip to main content
  </a>

  <header>
    <a href="/">Acme</a>
    <nav aria-label="Primary">
      <!-- many links -->
    </nav>
  </header>

  <!-- The target: focusable because of tabindex="-1" -->
  <main id="main-content" tabindex="-1">
    <h1>Page title</h1>
    ...
  </main>
</body>`}</code></pre>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Two decisions in that markup carry the whole feature, and each
                  is worth naming:
                </p>
                <ul className="text-muted-foreground leading-relaxed mb-4 list-disc pl-6 space-y-2">
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      The link is first in the DOM.
                    </strong>{" "}
                    It sits before the <code>&lt;header&gt;</code>, so the first
                    time a keyboard user presses Tab on the page, this is what they
                    land on. Put anything focusable ahead of it, a logo link, a
                    cookie banner, and you have made them tab past that before they
                    can skip, which defeats the point.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      The target carries <code>tabindex=&quot;-1&quot;</code>.
                    </strong>{" "}
                    This is the piece teams leave out, and leaving it out is why so
                    many skip links half-work. The next section is entirely about
                    why it is load-bearing.
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The link text should say where it goes.{" "}
                  <code>Skip to main content</code> is clear and conventional.
                  Avoid vague text like <code>Skip</code> on its own, which does
                  not say skip to where.
                </p>
              </div>
            </div>
          </section>

          {/* 2. The CSS */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                2. The CSS: Hidden Until Focused, Never display:none
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The standard visual treatment keeps the skip link off-screen
                  until it is focused, then slides it into view at the top of the
                  page. The critical rule is that the hiding technique must{" "}
                  <strong className="text-slate-900 dark:text-white">
                    keep the link in the tab order
                  </strong>
                  . <code>display: none</code> and{" "}
                  <code>visibility: hidden</code> both remove an element from the
                  tab order, so a link hidden that way can never be reached and the
                  skip mechanism silently does nothing. Position it off-screen
                  instead:
                </p>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`.skip-link {
  position: absolute;
  left: 0;
  top: 0;
  /* Move it off-screen without removing it from the tab order */
  transform: translateY(-120%);
  padding: 0.75rem 1rem;
  background: #1d4ed8;
  color: #fff;
  border-radius: 0 0 0.375rem 0;
  z-index: 1000;
  transition: transform 0.15s ease-in-out;
}

/* Bring it into view when a keyboard user tabs onto it */
.skip-link:focus {
  transform: translateY(0);
  /* A visible focus indicator satisfies 2.4.7 */
  outline: 3px solid #fff;
  outline-offset: 2px;
}`}</code></pre>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  A <code>transform</code> keeps the element rendered and
                  focusable while pushing it out of sight, so it stays in the tab
                  order and animates back on focus. The older{" "}
                  <code>clip</code> or off-screen{" "}
                  <code>left: -9999px</code> techniques work too, as long as you
                  restore the link to a visible on-screen position on{" "}
                  <code>:focus</code>. Whichever you choose, the{" "}
                  <code>:focus</code> state must place a clearly visible link in a
                  predictable spot, usually the top-left corner, with an obvious
                  focus indicator.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Do not reuse a generic <code>.sr-only</code> or{" "}
                  <code>.visually-hidden</code> utility for a skip link unless it
                  has a paired <code>:focus</code> rule that brings the element
                  back on screen. Many such utilities are designed to keep content
                  permanently invisible, which is the opposite of what a skip link
                  needs: a screen-reader-only skip link that never appears fails
                  the sighted keyboard user it is meant to serve.
                </p>
              </div>
            </div>
          </section>

          {/* 3. The #1 bug: target must be focusable */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                3. The Number One Bug: the Target Must Be Focusable
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  This is the failure that hides in more skip links than any other,
                  and it is not visible on screen. When you click a link to a
                  fragment like <code>#main-content</code>, the browser scrolls the
                  matching element into view, but it moves keyboard focus to that
                  element{" "}
                  <strong className="text-slate-900 dark:text-white">
                    only if the element can receive focus
                  </strong>
                  . Links, buttons, and form fields can. A plain{" "}
                  <code>&lt;main&gt;</code>, <code>&lt;div&gt;</code>, or{" "}
                  <code>&lt;section&gt;</code> cannot. So the page scrolls, it{" "}
                  <em>looks</em> like the skip worked, and then the user presses
                  Tab and focus jumps back to the top of the page, straight into
                  the navigation they were trying to skip.
                </p>
                <div className="not-prose rounded-lg border border-teal-200 dark:border-teal-900/50 bg-teal-50 dark:bg-teal-950/20 p-5 my-6">
                  <p className="text-sm font-semibold text-teal-900 dark:text-teal-200 mb-2">
                    The one-line fix, and how to prove it worked
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Add <code>tabindex=&quot;-1&quot;</code> to the target:{" "}
                    <code>
                      &lt;main id=&quot;main-content&quot;
                      tabindex=&quot;-1&quot;&gt;
                    </code>
                    . A value of <code>-1</code> lets an element receive focus
                    programmatically or from a fragment link without adding it to
                    the normal Tab sequence. To prove it works, activate the skip
                    link, then press Tab once more: focus should move to the first
                    interactive element inside the main content, not back to the
                    top. If it returns to the top, the target is not focusable.
                  </p>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  <code>tabindex=&quot;-1&quot;</code> on a container is safe: it
                  does not make the element a Tab stop, it only makes it a valid
                  focus target. You may see a focus outline flash briefly on the{" "}
                  <code>&lt;main&gt;</code> when the skip fires; that is expected
                  and acceptable, and you can style the container&rsquo;s{" "}
                  <code>:focus</code> to suit. Do not, however, set{" "}
                  <code>outline: none</code> on it with nothing in its place, or
                  you remove the only cue that focus has moved.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                  Sticky headers: keep the focused target visible
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  If your header is <code>position: sticky</code> or{" "}
                  <code>fixed</code>, the target can end up scrolled to the very
                  top of the viewport and then covered by that header, so focus has
                  moved but the user cannot see where. That is a{" "}
                  <Link href="/wcag/2-4-11" className="text-blue-600 dark:text-blue-400 hover:underline">
                    2.4.11 Focus Not Obscured
                  </Link>{" "}
                  failure. Reserve space with{" "}
                  <code>scroll-margin-top</code> on the target so it stops below
                  the fixed header:
                </p>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`#main-content {
  /* Match this to the height of your sticky header */
  scroll-margin-top: 5rem;
}`}</code></pre>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  A related, more robust option is to point the skip link at the
                  page&rsquo;s <code>&lt;h1&gt;</code> rather than the{" "}
                  <code>&lt;main&gt;</code> wrapper, giving the heading the{" "}
                  <code>tabindex=&quot;-1&quot;</code> and the{" "}
                  <code>scroll-margin-top</code>. Landing on the heading means the
                  screen reader announces the page title as focus arrives, which is
                  a helpful confirmation of where the user now is.
                </p>
              </div>
            </div>
          </section>

          {/* 4. Landmarks */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                4. Landmarks: the Real Bypass for Screen Reader Users
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  A screen reader user rarely uses the skip link, because they have
                  something faster: landmark navigation. Screen readers let the
                  user pull up a list of every landmark region on the page and jump
                  straight to one, so reaching the main content is a single
                  command regardless of how much navigation sits above it. The
                  HTML5 sectioning elements map to landmark roles automatically,
                  which means you often get this for free by using the right
                  elements:
                </p>
                <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 my-4">
                  <table className="w-full text-sm text-left">
                    <caption className="sr-only">
                      HTML5 sectioning elements and the ARIA landmark roles they
                      map to
                    </caption>
                    <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
                      <tr>
                        <th scope="col" className="px-4 py-3 font-semibold">Element</th>
                        <th scope="col" className="px-4 py-3 font-semibold">Landmark role</th>
                        <th scope="col" className="px-4 py-3 font-semibold">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                      <tr>
                        <th scope="row" className="px-4 py-3 font-mono text-xs align-top">&lt;header&gt;</th>
                        <td className="px-4 py-3 align-top">banner</td>
                        <td className="px-4 py-3 align-top">Only when it is the page-level header, not inside an article or section.</td>
                      </tr>
                      <tr>
                        <th scope="row" className="px-4 py-3 font-mono text-xs align-top">&lt;nav&gt;</th>
                        <td className="px-4 py-3 align-top">navigation</td>
                        <td className="px-4 py-3 align-top">Give each nav a distinct name when a page has more than one.</td>
                      </tr>
                      <tr>
                        <th scope="row" className="px-4 py-3 font-mono text-xs align-top">&lt;main&gt;</th>
                        <td className="px-4 py-3 align-top">main</td>
                        <td className="px-4 py-3 align-top">Exactly one per page. This is the skip link&rsquo;s usual target.</td>
                      </tr>
                      <tr>
                        <th scope="row" className="px-4 py-3 font-mono text-xs align-top">&lt;aside&gt;</th>
                        <td className="px-4 py-3 align-top">complementary</td>
                        <td className="px-4 py-3 align-top">Sidebars and related content tangential to the main content.</td>
                      </tr>
                      <tr>
                        <th scope="row" className="px-4 py-3 font-mono text-xs align-top">&lt;footer&gt;</th>
                        <td className="px-4 py-3 align-top">contentinfo</td>
                        <td className="px-4 py-3 align-top">Only when it is the page-level footer.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Three rules keep landmarks useful rather than noisy:
                </p>
                <ul className="text-muted-foreground leading-relaxed mb-4 list-disc pl-6 space-y-2">
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      One <code>&lt;main&gt;</code> per page.
                    </strong>{" "}
                    The main landmark is the destination the whole bypass exists to
                    reach. More than one, or none, makes it ambiguous.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Name repeated landmarks.
                    </strong>{" "}
                    Two <code>&lt;nav&gt;</code> regions both announce as
                    &ldquo;navigation&rdquo; unless you distinguish them with{" "}
                    <code>aria-label</code>, for example{" "}
                    <code>aria-label=&quot;Primary&quot;</code> and{" "}
                    <code>aria-label=&quot;Footer&quot;</code>. This is the{" "}
                    <Link href="/wcag/4-1-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                      4.1.2
                    </Link>{" "}
                    tie-in.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Do not put the word &ldquo;navigation&rdquo; in a nav&rsquo;s
                      label.
                    </strong>{" "}
                    The role already says it, so{" "}
                    <code>aria-label=&quot;Primary navigation&quot;</code> is
                    announced as &ldquo;Primary navigation, navigation&rdquo;. Name
                    it <code>Primary</code>.
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Landmarks are part of the broader semantic structure covered by{" "}
                  <Link href="/guides/using-aria" className="text-blue-600 dark:text-blue-400 hover:underline">
                    using ARIA the right way
                  </Link>
                  ; the first rule there applies here too, prefer the native
                  <code>&lt;nav&gt;</code>, <code>&lt;main&gt;</code>, and{" "}
                  <code>&lt;aside&gt;</code> elements over{" "}
                  <code>role=&quot;navigation&quot;</code> and friends on a{" "}
                  <code>&lt;div&gt;</code>. For the full landmark model, the
                  scoping rule where a header or footer is only a landmark at the
                  top level, when a <code>&lt;section&gt;</code> becomes a region,
                  and how screen reader users jump between regions, see the{" "}
                  <Link href="/guides/landmarks-page-structure" className="text-blue-600 dark:text-blue-400 hover:underline">
                    landmarks and page structure guide
                  </Link>
                  .
                </p>
              </div>
            </div>
          </section>

          {/* 5. Headings */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                5. Headings as a Bypass Mechanism
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The third bypass mechanism is the one most people do not think of
                  as one: a logical heading structure. Screen reader users navigate
                  by heading constantly, jumping from one to the next to survey a
                  page and move quickly to the part they want. A page with a single{" "}
                  <code>&lt;h1&gt;</code> naming the page, and nested{" "}
                  <code>&lt;h2&gt;</code> and <code>&lt;h3&gt;</code> headings that
                  follow the content&rsquo;s outline, lets them skip straight past
                  repeated chrome to the first real heading of the content.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Two habits make headings work as a bypass:
                </p>
                <ul className="text-muted-foreground leading-relaxed mb-4 list-disc pl-6 space-y-2">
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      One <code>&lt;h1&gt;</code> that names the page.
                    </strong>{" "}
                    It should describe this page specifically, and it is a natural,
                    robust target for the skip link, since landing there announces
                    the page.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Do not skip levels.
                    </strong>{" "}
                    Go <code>&lt;h1&gt;</code> to <code>&lt;h2&gt;</code> to{" "}
                    <code>&lt;h3&gt;</code> in order. Jumping from{" "}
                    <code>&lt;h1&gt;</code> to <code>&lt;h4&gt;</code> breaks the
                    outline a screen reader user relies on to understand structure.
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Organizing content under headings is formally recognized as a
                  bypass technique in{" "}
                  <Link href="/wcag/2-4-10" className="text-blue-600 dark:text-blue-400 hover:underline">
                    2.4.10 Section Headings
                  </Link>
                  . That criterion sits at Level AAA, so it is not required for AA
                  conformance, but the heading navigation it describes is one of the
                  most-used features in every screen reader, so a sound heading
                  outline is worth building regardless of the level.
                </p>
              </div>
            </div>
          </section>

          {/* 6. More than one skip link */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                6. More Than One Skip Link, and Skipping Within Content
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  One skip link to the main content covers most pages. Some pages
                  have several distinct repeated blocks worth bypassing
                  separately, and there it is reasonable to offer more than one:
                </p>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`<a class="skip-link" href="#main-content">Skip to main content</a>
<a class="skip-link" href="#primary-nav">Skip to navigation</a>
<a class="skip-link" href="#site-search">Skip to search</a>`}</code></pre>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Keep the skip-to-main-content link first, because it is what most
                  users want, and make sure each target carries{" "}
                  <code>tabindex=&quot;-1&quot;</code> like any other skip target.
                  Resist the urge to add a link for every region; a stack of six
                  skip links becomes its own block of repeated content to tab past.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The same idea works <em>inside</em> content, not just at the top
                  of the page. If a page contains a very long data table, a large
                  interactive widget, or an extended list of links that a keyboard
                  user would otherwise have to tab all the way through, a short
                  &ldquo;skip over this table&rdquo; link placed just before it,
                  pointing to a focusable element just after it, is a legitimate
                  bypass. It is the same pattern, applied to a repeated or oversized
                  block in the body rather than the site chrome.
                </p>
              </div>
            </div>
          </section>

          {/* 7. SPA / React */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                7. Skip Links in Single-Page Apps and React
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The markup is the same in a single-page app, but client-side
                  routing adds a problem the static case does not have. When the
                  user navigates, the page does not reload, so keyboard focus stays
                  wherever it was, often on a link inside the navigation, and the
                  new view renders around that stale focus. The skip link still
                  helps within a view, but you now also owe deliberate focus
                  management on every route change.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  In React, that is a small <code>SkipLink</code> component plus an
                  effect that moves focus to the main region whenever the route
                  changes:
                </p>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`function SkipLink() {
  return (
    <a className="skip-link" href="#main-content">
      Skip to main content
    </a>
  )
}

// On each route change, move focus to the new view's main region
function useFocusMainOnRouteChange(pathname, mainRef) {
  useEffect(() => {
    mainRef.current?.focus()
  }, [pathname, mainRef])
}

function Layout({ children }) {
  const pathname = usePathname()
  const mainRef = useRef(null)
  useFocusMainOnRouteChange(pathname, mainRef)

  return (
    <>
      <SkipLink />
      <SiteHeader />
      <main id="main-content" tabIndex={-1} ref={mainRef}>
        {children}
      </main>
    </>
  )
}`}</code></pre>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The <code>&lt;main&gt;</code> keeps its{" "}
                  <code>tabIndex</code> of <code>-1</code> so both the skip link
                  and the route-change effect can focus it. Moving focus to the
                  main region on navigation also gives screen reader users a clear
                  signal that the view changed, which client-side routing otherwise
                  swallows. This is one facet of a broader topic; the{" "}
                  <Link href="/guides/focus-management" className="text-blue-600 dark:text-blue-400 hover:underline">
                    focus management guide
                  </Link>{" "}
                  covers route-change focus in depth, and the{" "}
                  <Link href="/guides/react-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">
                    React accessibility guide
                  </Link>{" "}
                  puts it in the context of a component architecture.
                </p>
              </div>
            </div>
          </section>

          {/* 8. Testing */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                8. Testing Bypass Blocks
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Because the most common skip-link failure is invisible on screen,
                  the keyboard test is the one that matters most, and no automated
                  tool can replace it.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-2 mb-3">
                  The keyboard test
                </h3>
                <ul className="text-muted-foreground leading-relaxed mb-4 list-disc pl-6 space-y-2">
                  <li>
                    Load the page and press <kbd>Tab</kbd> once. A visible skip link
                    should appear, with a clear focus indicator.
                  </li>
                  <li>
                    Press <kbd>Enter</kbd> to activate it, then press{" "}
                    <kbd>Tab</kbd> again. Focus should land on the first
                    interactive element <em>inside</em> the main content. If it
                    returns to the top of the page, the target is missing{" "}
                    <code>tabindex=&quot;-1&quot;</code>.
                  </li>
                  <li>
                    Confirm the revealed link and the focused target are not hidden
                    behind a sticky header (2.4.11).
                  </li>
                </ul>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                  The screen reader test
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Open the landmark list and the heading list, the two bypass
                  mechanisms screen reader users actually use. In{" "}
                  <Link href="/guides/nvda-screen-reader-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                    NVDA
                  </Link>{" "}
                  or{" "}
                  <Link href="/guides/jaws-screen-reader-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                    JAWS
                  </Link>
                  , open the elements list; in{" "}
                  <Link href="/guides/voiceover-screen-reader-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                    VoiceOver
                  </Link>
                  , use the rotor. Confirm there is exactly one main landmark, that
                  repeated regions have distinct names, and that the heading outline
                  is logical with a single <code>&lt;h1&gt;</code>.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                  Automated checks
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Scanners such as{" "}
                  <Link href="/guides/axe-vs-wave" className="text-blue-600 dark:text-blue-400 hover:underline">
                    axe and WAVE
                  </Link>{" "}
                  can flag a missing <code>&lt;main&gt;</code> landmark, a page with
                  no headings, or a heading level that skips, and those are worth
                  catching. What they cannot check is whether the skip link actually
                  moves focus, which is the failure that matters most, so treat a
                  clean automated report as necessary but not sufficient. The{" "}
                  <Link href="/guides/automated-vs-manual-accessibility-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                    automated versus manual testing guide
                  </Link>{" "}
                  explains where that line falls, and the{" "}
                  <Link href="/guides/how-to-audit-website-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">
                    website audit guide
                  </Link>{" "}
                  puts these steps in order.
                </p>
              </div>
            </div>
          </section>

          {/* Anti-patterns */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                Common Skip Link Mistakes &amp; How to Fix Them
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                These are the bypass-block errors that turn up most in real-world
                audits. Every one is a small decision with an outsized effect on
                whether keyboard users can actually get past your navigation.
              </p>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    Common skip link and bypass-block anti-patterns, why each one
                    fails, and the fix
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
                The Bypass Blocks Checklist
              </h2>
              <ol className="space-y-4 text-muted-foreground leading-relaxed list-decimal pl-6">
                <li>
                  <strong className="text-slate-900 dark:text-white">Skip link is first.</strong>{" "}
                  A skip-to-main-content link is the very first focusable element
                  in the DOM, ahead of the header and any other control.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">It appears on focus.</strong>{" "}
                  The link is hidden off-screen but comes into view with a visible
                  focus indicator when tabbed to, never using{" "}
                  <code>display:none</code> or <code>visibility:hidden</code>.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">The target is focusable.</strong>{" "}
                  The target carries <code>tabindex=&quot;-1&quot;</code> so
                  activating the link moves focus, not just scroll position.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Focus is verified.</strong>{" "}
                  Activating the link, then pressing Tab, moves focus into the main
                  content and not back to the top of the page.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">The target stays visible.</strong>{" "}
                  A sticky or fixed header does not cover the focused target;{" "}
                  <code>scroll-margin-top</code> clears it (2.4.11).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">One main landmark.</strong>{" "}
                  The page has exactly one <code>&lt;main&gt;</code>, plus{" "}
                  <code>&lt;header&gt;</code>, <code>&lt;nav&gt;</code>, and{" "}
                  <code>&lt;footer&gt;</code> as appropriate.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Repeated landmarks are named.</strong>{" "}
                  Multiple <code>&lt;nav&gt;</code> regions have distinct{" "}
                  <code>aria-label</code>s that do not include the word
                  &ldquo;navigation&rdquo;.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Headings form an outline.</strong>{" "}
                  A single <code>&lt;h1&gt;</code> names the page and heading levels
                  descend without skipping.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">SPA route changes move focus.</strong>{" "}
                  In a single-page app, each navigation moves focus to the new
                  view&rsquo;s main region or heading.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Tested by keyboard and screen reader.</strong>{" "}
                  The Tab test confirms focus moves; the landmark and heading lists
                  confirm the screen reader bypass.
                </li>
              </ol>
            </div>
          </section>

          {/* CTA */}
          <section className="py-12 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <div className="rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20 p-8 text-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  Get Past the Navigation
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6 max-w-lg mx-auto">
                  Start from the criterion this serves, then wire the focus
                  behaviour that makes a skip link, and every route change, land
                  where it should.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button asChild size="lg" className="gap-2">
                    <Link href="/wcag/2-4-1">
                      WCAG 2.4.1 Bypass Blocks
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="gap-2">
                    <Link href="/guides/focus-management">
                      Focus Management Guide
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
                content="skip links skip to main content skip navigation bypass blocks wcag 2.4.1 skip link tabindex -1 skip link focus target visually hidden skip link css landmark regions aria landmarks main navigation banner contentinfo headings section headings 2.4.10 focus management route change skip link react single page app keyboard accessibility focus order 2.4.3 focus not obscured 2.4.11"
                title="Related Guides & References"
                maxItems={6}
                showDescriptions={true}
              />
            </div>
          </section>
        </article>
      </div>
    </>
  )
}
