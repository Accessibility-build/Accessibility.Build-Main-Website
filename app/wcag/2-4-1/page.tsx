import Link from "next/link"
import { createMetadata } from "@/lib/metadata"
import { BreadcrumbStructuredData } from "@/components/seo/structured-data"
import WCAGSEOEnhancements from "@/components/wcag/seo-enhancements"
import { CriterionLinks } from "@/components/wcag/criterion-links"
import BypassBlocksDemo from "./interactive-demo"

export const metadata = createMetadata({
  title: "WCAG 2.4.1 Bypass Blocks — Skip Links & Landmarks",
  path: "/wcag/2-4-1",
  description:
    "Master WCAG 2.4.1 Bypass Blocks with interactive skip link demos, navigation bypass mechanisms, and keyboard accessibility tools. Complete guide with live examples, focus tracking, and implementation code for efficient keyboard navigation.",
  keywords: [
    "WCAG 2.4.1",
    "Bypass Blocks",
    "skip links",
    "navigation",
    "keyboard accessibility",
    "Level A",
    "screen reader",
    "web accessibility",
    "WCAG 2.2",
    "focus management",
    "keyboard navigation",
    "landmarks",
    "skip navigation",
  ],
  type: "article",
  image: "/api/og?title=WCAG%202.4.1%20Bypass%20Blocks&section=WCAG",
})

const faqs = [
  {
    q: "What does WCAG 2.4.1 Bypass Blocks require?",
    a: "It requires that a mechanism is available to bypass blocks of content that are repeated on multiple web pages. The classic example is a header and primary navigation that appear identically on every page: a keyboard or screen reader user should not have to move through all of it again on each page just to reach the main content. The most common mechanism is a 'skip to main content' link, but properly used HTML landmarks (such as a <main> region) and a correct heading structure also satisfy the criterion because they give assistive technology users a way to jump over the repeated blocks. It is a Level A success criterion, part of WCAG since 2.0.",
  },
  {
    q: "Is a skip link the only way to satisfy 2.4.1?",
    a: "No. A skip link is the most reliable and widely supported technique, but it is not the only one. The criterion is satisfied by any mechanism that lets users bypass repeated blocks. Semantic landmark regions (header, nav, main, aside, footer, or their ARIA role equivalents) let screen reader users jump directly to a region. A logical heading structure lets them navigate by heading. In practice a skip link helps sighted keyboard users who do not use a screen reader, so it is best to provide a skip link and correct landmarks and headings together, rather than relying on landmarks alone.",
  },
  {
    q: "Does a skip link have to be visible?",
    a: "It does not have to be visible at all times, but it must become visible when it receives keyboard focus. The common and accessible pattern is to position the link off-screen until it is focused, then bring it into view. Hiding it with display:none or visibility:hidden removes it from the tab order entirely and fails the criterion, because a keyboard user can never reach it. A permanently invisible skip link that never appears on focus is a frequent, subtle failure: screen reader users may find it, but sighted keyboard users are left confused when focus seems to disappear.",
  },
  {
    q: "Where should the skip link go and where should it point?",
    a: "The skip link should be the very first focusable element in the DOM, so it is the first thing a keyboard user reaches when they press Tab. Its target should be the start of the main content — typically the <main> element or the primary content container. To make the jump work reliably across browsers, give the target a tabindex of -1 so it can programmatically receive focus, and make sure activating the link both moves focus to the target and scrolls it into view. Pointing a skip link at a target that cannot receive focus is a common reason skip links appear to 'do nothing'.",
  },
  {
    q: "How is 2.4.1 different from 2.4.2, 2.4.3, and 1.3.1?",
    a: "They are related but distinct. 2.4.1 Bypass Blocks is specifically about skipping repeated blocks such as banners and navigation. 2.4.2 Page Titled is about the page having a descriptive title. 2.4.3 Focus Order is about focus moving through the page in an order that preserves meaning. 1.3.1 Info and Relationships underpins 2.4.1 when you use landmarks or headings as the bypass mechanism — the landmark and heading structure must actually be marked up in code for assistive technology to use it. So correct semantic structure supports 2.4.1, but 2.4.1 has the narrower, specific job of providing a way past repeated content.",
  },
  {
    q: "Do single-page apps and sites with little repeated content still need this?",
    a: "The requirement is triggered by blocks of content repeated across pages. If a page genuinely has no repeated blocks, the criterion does not apply to it. In practice almost every multi-page site has a repeated header and navigation, so a skip mechanism is expected. Single-page applications should treat each distinct view as a 'page': if the same navigation region wraps every view, provide a skip link and manage focus so that when the view changes, users can still bypass the repeated chrome and reach the new main content.",
  },
]

const skipLinkHtml = `<!-- ✗ No bypass mechanism: keyboard users tab through
     the entire header and nav on every page -->
<body>
  <header>
    <img src="logo.svg" alt="Acme">
    <nav>
      <a href="/">Home</a>
      <a href="/about">About</a>
      <!-- …20 more links… -->
    </nav>
  </header>
  <div id="content">…</div>
</body>

<!-- ✓ A skip link is the first focusable element,
     targeting the main landmark -->
<body>
  <a class="skip-link" href="#main">Skip to main content</a>
  <header>
    <img src="logo.svg" alt="Acme">
    <nav aria-label="Primary">…</nav>
  </header>
  <main id="main" tabindex="-1">…</main>
</body>`

const skipLinkCss = `/* Off-screen until focused, then slides into view.
   Never use display:none — that removes it from the tab order. */
.skip-link {
  position: absolute;
  left: 8px;
  top: -48px;                 /* hidden above the viewport */
  z-index: 1000;
  background: #000;
  color: #fff;
  padding: 8px 12px;
  border-radius: 4px;
  text-decoration: none;
  transition: top 0.2s ease-in;
}

.skip-link:focus {
  top: 8px;                   /* revealed on keyboard focus */
  outline: 2px solid #fff;
  outline-offset: 2px;
}

/* The target must be able to receive programmatic focus */
main[tabindex="-1"]:focus {
  outline: none;
}`

const landmarksHtml = `<!-- ✓ Landmarks and headings give screen reader users
     their own way to bypass the repeated blocks -->
<header>
  <nav aria-label="Primary">…</nav>
</header>

<main>
  <h1>Quarterly report</h1>
  <section aria-labelledby="summary">
    <h2 id="summary">Summary</h2>
    …
  </section>
</main>

<aside aria-label="Related links">…</aside>
<footer>…</footer>`

export default function WCAG241Page() {
  return (
    <>
      <WCAGSEOEnhancements
        title="WCAG 2.4.1: Bypass Blocks"
        description="A mechanism is available to bypass blocks of content that are repeated on multiple Web pages."
        criteria="2.4.1"
        level="A"
        principle="Operable"
        guideline="2.4 Navigable"
        url="https://accessibility.build/wcag/2-4-1"
        category="Navigation"
      />
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "WCAG Success Criteria", url: "https://accessibility.build/wcag" },
          { name: "2.4.1 Bypass Blocks", url: "https://accessibility.build/wcag/2-4-1" },
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
                    2.4.1 Bypass Blocks
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
                Saves keyboard users on every page
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-5 tracking-tight">
              WCAG 2.4.1: Bypass Blocks
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              Sighted users glance past a site&rsquo;s header and menu in an instant.
              Keyboard and screen reader users cannot — without help they must move
              through every logo, search box, and navigation link{" "}
              <strong className="text-slate-900 dark:text-white">
                on every single page
              </strong>{" "}
              before they reach the content they came for. This criterion asks for one
              thing: a mechanism to jump straight past those repeated blocks.
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
              A mechanism is available to bypass blocks of content that are repeated on
              multiple Web pages.
            </blockquote>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mt-4 text-sm">
              Note the two key phrases. &ldquo;Blocks of content that are repeated&rdquo;
              means banners, navigation, sidebars — the chrome that wraps your unique
              content. &ldquo;A mechanism is available&rdquo; means you have latitude in
              how you provide it: a skip link, semantic landmark regions, or a proper
              heading structure all qualify.
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
                  Three ways to satisfy it
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
              Repeated blocks are pure overhead for anyone who moves through a page
              linearly rather than pointing at it. A bypass mechanism removes that
              overhead:
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  t: "Keyboard-only users",
                  d: "People who navigate with Tab and cannot use a mouse would otherwise tab through every header and nav link on each page before reaching the content.",
                },
                {
                  t: "Screen reader users",
                  d: "Landmarks and headings let them jump over repeated regions, and a visible skip link is a familiar, fast route straight to the main content.",
                },
                {
                  t: "Switch and voice-control users",
                  d: "People using switch devices or voice commands issue one action per stop. Skipping 20 repeated links means 20 fewer switch hits or spoken commands per page.",
                },
                {
                  t: "Users with motor disabilities",
                  d: "Every unnecessary tab stop is a repeated physical action. Reducing them lowers fatigue and the chance of error for people with limited mobility.",
                },
                {
                  t: "Screen magnifier users",
                  d: "At high zoom the header can fill the screen. A bypass mechanism moves the viewport straight to the content instead of forcing a slow scroll past the chrome.",
                },
                {
                  t: "Everyone, incidentally",
                  d: "Clean landmark and heading structure that satisfies this criterion also improves general navigation, in-page search, and how assistive tools understand the page.",
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
              Three ways to satisfy it
            </h2>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              The criterion asks only that a mechanism <em>exists</em>; it does not
              mandate a specific one. Three techniques each provide a valid bypass, and
              the strongest sites use them together:
            </p>
            <ul className="space-y-3 mb-6">
              {[
                {
                  t: "Skip links",
                  d: "A link — usually 'Skip to main content' — placed as the first focusable element, hidden until focused, that moves focus to the start of the content. This is the only technique that also helps sighted keyboard users who are not running a screen reader.",
                },
                {
                  t: "Landmark regions",
                  d: "Semantic HTML5 elements (header, nav, main, aside, footer) or their ARIA roles let screen reader users jump directly to a region. A single <main> is the anchor point that most 'skip to content' behaviour relies on.",
                },
                {
                  t: "Heading structure",
                  d: "A correct, hierarchical set of headings (one h1, then h2s and h3s) lets screen reader users navigate by heading and leap over repeated blocks to the first content heading.",
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
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              A skip link alone helps keyboard users but does nothing for someone
              navigating by landmark; landmarks alone help screen reader users but leave
              sighted keyboard users tabbing through the menu. Because the audiences
              barely overlap, provide a visible-on-focus skip link{" "}
              <em>and</em> correct landmarks and headings. Getting the underlying
              structure right also satisfies{" "}
              <Link
                href="/wcag/1-3-1"
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                1.3.1 Info and Relationships
              </Link>
              .
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
                  ✓ Passes 2.4.1
                </h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <li>
                    A skip link is the first focusable element, hidden off-screen and
                    revealed on keyboard focus, pointing at a focusable{" "}
                    <code className="px-1 py-0.5 rounded bg-white/60 dark:bg-slate-800 font-mono text-xs">&lt;main&gt;</code>.
                  </li>
                  <li>
                    The page uses <code className="px-1 py-0.5 rounded bg-white/60 dark:bg-slate-800 font-mono text-xs">header</code>,{" "}
                    <code className="px-1 py-0.5 rounded bg-white/60 dark:bg-slate-800 font-mono text-xs">nav</code>,{" "}
                    <code className="px-1 py-0.5 rounded bg-white/60 dark:bg-slate-800 font-mono text-xs">main</code>, and{" "}
                    <code className="px-1 py-0.5 rounded bg-white/60 dark:bg-slate-800 font-mono text-xs">footer</code> landmarks.
                  </li>
                  <li>
                    A logical heading structure lets a screen reader user jump to the
                    first content heading.
                  </li>
                  <li>
                    Activating the skip link both moves focus and scrolls the target into
                    view.
                  </li>
                </ul>
              </div>
              <div className="rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50 dark:bg-rose-950/20 p-5">
                <h3 className="font-semibold text-rose-800 dark:text-rose-300 mb-3">
                  ✗ Fails 2.4.1
                </h3>
                <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  <li>
                    No skip link, no landmarks, and a wall of{" "}
                    <code className="px-1 py-0.5 rounded bg-white/60 dark:bg-slate-800 font-mono text-xs">&lt;div&gt;</code>s —
                    users tab through the whole menu every page.
                  </li>
                  <li>
                    A skip link hidden with <code className="px-1 py-0.5 rounded bg-white/60 dark:bg-slate-800 font-mono text-xs">display:none</code>,
                    so it never enters the tab order.
                  </li>
                  <li>
                    A skip link that never becomes visible on focus, leaving sighted
                    keyboard users lost.
                  </li>
                  <li>
                    A skip link pointing at a target that cannot receive focus, so
                    activating it appears to do nothing.
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
              A skip link done right
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              The link must be the first focusable element and point at a target that can
              take focus. Give the target{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">tabindex=&quot;-1&quot;</code>{" "}
              so the browser can move focus to it.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{skipLinkHtml}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Hide it until focus, never with display:none
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Position the link off-screen and slide it into view on{" "}
              <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">:focus</code>.
              Using <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">display:none</code>{" "}
              or <code className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-sm">visibility:hidden</code>{" "}
              removes it from the tab order entirely.
            </p>
            <pre className="mb-6 overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{skipLinkCss}</code>
            </pre>

            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              Landmarks and headings as a bypass
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
              Even without a skip link, semantic regions and headings give screen reader
              users their own bypass routes. Label repeated regions so they are
              distinguishable.
            </p>
            <pre className="overflow-x-auto rounded-xl bg-slate-900 text-slate-100 p-5 text-sm leading-relaxed">
              <code>{landmarksHtml}</code>
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
              Tab into the first box to reveal a working skip link, then use the buttons
              in the second box to compare how many tab stops it takes to reach the
              content with and without a bypass mechanism.
            </p>
            <BypassBlocksDemo />
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
                "No bypass mechanism at all — no skip link, no landmarks, and headings that do not organize the content.",
                "A skip link hidden with display:none or visibility:hidden, which drops it out of the tab order so no keyboard user can reach it.",
                "A skip link that stays invisible even on focus, so sighted keyboard users see focus vanish with no explanation.",
                "A skip link that is not the first focusable element, forcing users through some repeated content before they can skip the rest.",
                "A skip link whose target has no tabindex=\"-1\", so focus never actually lands on the content and the link seems broken.",
                "Landmarks applied incorrectly — multiple unlabelled <nav> regions, or wrapping everything in a single generic region so nothing can be skipped to.",
                "A broken heading hierarchy (skipped levels, multiple h1s, headings used only for visual size) that defeats heading-based navigation.",
                "Skip link present on the homepage but missing on interior templates where the repeated navigation is just as long.",
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
              How to test for 2.4.1
            </h2>
            <ol className="space-y-4">
              {[
                {
                  t: "Load the page and press Tab once",
                  d: "With focus at the very top of the page, the first Tab should reveal a skip link. If nothing visible appears and focus jumps into the navigation, the bypass mechanism is missing or hidden incorrectly.",
                },
                {
                  t: "Activate the skip link",
                  d: "Press Enter on the skip link and confirm that focus moves to the start of the main content and the content scrolls into view. Press Tab again — the next stop should be inside the content, not back in the menu.",
                },
                {
                  t: "Check the landmark structure",
                  d: "Use a screen reader's landmarks list (or a browser extension that outlines landmarks) and confirm there is a single main region plus clearly labelled header, nav, and footer regions you can jump between.",
                },
                {
                  t: "Navigate by heading",
                  d: "Open the screen reader's headings list. Verify there is one h1 and a logical hierarchy, and that you can jump straight from the top of the page to the first content heading, bypassing the repeated blocks.",
                },
                {
                  t: "Run an automated scan, then judge quality",
                  d: "Tools like axe DevTools, WAVE, and Lighthouse can flag a missing main landmark or an empty heading. They cannot confirm a skip link actually works, so always follow up with the manual keyboard checks above.",
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
          <CriterionLinks number="2.4.1" />

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
