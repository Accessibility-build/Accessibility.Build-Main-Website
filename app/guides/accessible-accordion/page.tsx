import type { Metadata } from "next"
import Link from "next/link"
import {
  BreadcrumbStructuredData,
  FAQStructuredData,
} from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  ListCollapse,
  Keyboard,
  ShieldCheck,
  ListChecks,
  Bug,
  Layers,
  ChevronsDownUp,
  UnfoldVertical,
  Code2,
  Heading,
  AlertTriangle,
} from "lucide-react"

const pageTitle = "Accessible Accordion & Disclosure Pattern Guide"
const pageDescription =
  "Build accessible accordions and disclosure widgets the right way: the aria-expanded state, button-in-heading structure, aria-controls, the native details and summary element, single vs multi-expand, and the keyboard model — with copy-ready HTML, JavaScript, and React mapped to WCAG 2.2, a testing workflow, common mistakes, and FAQs."

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords: [
    "accessible accordion",
    "accordion accessibility",
    "disclosure widget",
    "aria disclosure pattern",
    "aria-expanded",
    "accordion aria",
    "details summary accessibility",
    "html details element",
    "accessible collapsible",
    "expand collapse accessibility",
    "accordion keyboard navigation",
    "accordion heading structure",
    "react accessible accordion",
    "single expand accordion",
    "wcag accordion",
    "accordion aria-controls",
    "show hide content accessibility",
  ],
  alternates: {
    canonical: "/guides/accessible-accordion",
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: "/guides/accessible-accordion",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: `/api/og?title=${encodeURIComponent("Accessible Accordion Guide")}&section=Guide`,
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
        url: `/api/og?title=${encodeURIComponent("Accessible Accordion Guide")}&section=Guide`,
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
    name: "Accessible Accordion & Disclosure Guide",
    url: "https://accessibility.build/guides/accessible-accordion",
  },
]

const faqs = [
  {
    question: "What is the difference between a disclosure and an accordion?",
    answer:
      "A disclosure is the atomic pattern: a single button that shows or hides one region of content, like a \"Read more\" toggle or an expandable filter. An accordion is a set of disclosures grouped under headings, where each header expands its own panel — the classic FAQ list is an accordion. The accessibility building blocks are the same: a real button with aria-expanded that controls a region. The accordion just adds one rule on top — each header button must be wrapped in a real heading element (h2, h3, and so on) so screen reader users can jump between sections with heading navigation. If you only ever have one expandable region, you have a disclosure, not an accordion, and you do not need the heading wrapper.",
  },
  {
    question: "What does aria-expanded do, and where does it go?",
    answer:
      "aria-expanded is the single most important attribute in this pattern, and the most commonly forgotten. It goes on the button the user activates — never on the panel — and it announces the current state: aria-expanded=\"true\" when the region is open, aria-expanded=\"false\" when it is collapsed. A screen reader reads it as part of the control, so the user hears \"Shipping, collapsed, button\" and knows that pressing it will reveal content. Without aria-expanded, the button is announced with no state at all: the user cannot tell whether activating it opens something, closes something, or navigates away. You must update the attribute in JavaScript every time you toggle the region — a static aria-expanded=\"false\" that never changes is as broken as having none.",
  },
  {
    question: "Should I use the native details and summary elements or build my own?",
    answer:
      "Reach for the native details and summary elements first. They give you a fully keyboard-operable, screen-reader-announced disclosure with zero JavaScript: the summary is the toggle, the browser manages the open state and exposes it to assistive technology, and Enter and Space work automatically. Build a custom ARIA disclosure only when details cannot do what you need — for example, when you need to animate the open and close transition (details snaps open), style the disclosure triangle beyond what the marker allows, control the exact markup of the heading, or coordinate an accordion where opening one section closes another with shared state and framework rendering. When you do build your own, you are re-implementing what details gives you for free, so match its behavior exactly: a button, aria-expanded, and a controlled region.",
  },
  {
    question: "Do accordion headers need to be real headings?",
    answer:
      "Yes. In a true accordion — several collapsible sections in a list — each toggle should be a button wrapped in a heading element: <h3><button aria-expanded>...</button></h3>. The heading level should reflect the section's place in the page's outline, so if the accordion sits under an h2, its headers are h3s. This matters because screen reader users navigate long pages by pulling up a list of headings or pressing the \"next heading\" key; if the accordion headers are plain buttons with no heading, the whole section is invisible to that navigation and users have to Tab through everything. A single standalone disclosure does not need a heading wrapper — the heading requirement is specific to the accordion, where the headers are structural landmarks in the content.",
  },
  {
    question: "What keyboard support does an accordion need?",
    answer:
      "The only required keys are Enter and Space to toggle the focused header — and if each header is a real button, you get both for free. Tab moves between the header buttons in document order, exactly like any other set of buttons, so an accordion needs no roving tabindex. The ARIA Authoring Practices Guide lists optional enhancements for accordions with many sections: Up and Down arrows to move focus between headers, Home and End to jump to the first and last header, and sometimes Ctrl+Page Up/Down. These are nice-to-have, not required, and unlike the tabs pattern they must not be the only way to reach a header — Tab always has to work. Keep it simple: real buttons plus correct aria-expanded is a conformant accordion.",
  },
  {
    question: "Should an accordion allow multiple panels open at once?",
    answer:
      "That is a UX decision, and both are accessible. A multi-expand accordion lets the user open any number of panels independently and is usually the friendlier default — it lets people compare sections and never hides content they just opened. A single-expand (exclusive) accordion opens one panel and closes the others; it keeps a long list compact but can be frustrating because opening section four silently collapses section two. If you do build an exclusive accordion, never disable the open header's button — the user should still be able to collapse the current section — and make sure aria-expanded is updated on both the newly opened and the automatically closed headers. Modern browsers also support exclusive behavior natively with the name attribute on grouped details elements.",
  },
]

const keyboardRows = [
  {
    key: "Tab",
    action:
      "Moves focus to the next header button, and out of the accordion when past the last one. Every header is in the normal Tab order — no roving tabindex.",
  },
  {
    key: "Enter or Space",
    action:
      "Toggles the focused header: expands its panel if collapsed, collapses it if open. Free when the header is a real <button>.",
  },
  {
    key: "Down Arrow / Up Arrow",
    action:
      "Optional (APG): moves focus to the next / previous header button without leaving the accordion. A convenience for accordions with many sections, never the only way in.",
  },
  {
    key: "Home / End",
    action:
      "Optional (APG): moves focus to the first / last header button in the accordion.",
  },
]

const attributeRows = [
  {
    element: "Each header",
    role: "<h3> wrapping a <button>",
    attrs:
      "The heading level fits the page outline; the button holds aria-expanded and aria-controls.",
  },
  {
    element: "Each toggle button",
    role: "native <button>",
    attrs:
      "aria-expanded=\"true|false\" (current state); aria-controls=\"<panel-id>\" (the region it shows/hides).",
  },
  {
    element: "Each panel",
    role: "role=\"region\" (optional)",
    attrs:
      "id matching the button's aria-controls; aria-labelledby=\"<button-id>\"; hidden when collapsed.",
  },
]

const antiPatterns = [
  {
    bad: "A <div> with an onClick handler as the toggle.",
    why: "It is not focusable or keyboard-operable, and a screen reader announces nothing (2.1.1, 4.1.2).",
    fix: "Use a real <button>. It is focusable, Enter/Space work, and it is announced as a control.",
  },
  {
    bad: "No aria-expanded on the toggle.",
    why: "The user cannot tell if the section is open or closed, or that the button reveals content (4.1.2).",
    fix: "Add aria-expanded and flip it true/false in JS every time you toggle the panel.",
  },
  {
    bad: "aria-expanded put on the panel instead of the button.",
    why: "State is announced on the wrong element; the button stays stateless to assistive tech.",
    fix: "aria-expanded always lives on the interactive control the user activates — the button.",
  },
  {
    bad: "Accordion headers are buttons with no heading wrapper.",
    why: "Screen reader heading navigation skips every section; the structure is invisible (1.3.1).",
    fix: "Wrap each header button in a heading: <h3><button aria-expanded>...</button></h3>.",
  },
  {
    bad: "Collapsed panels hidden with height:0 or opacity only.",
    why: "The content stays in the accessibility tree, so screen reader and Tab users still reach it.",
    fix: "Use the hidden attribute or display:none so collapsed content leaves the tree entirely.",
  },
  {
    bad: "A rotating chevron is the only signal that a section is open.",
    why: "The visual-only cue is invisible to screen readers and can fail contrast (1.4.1, 4.1.2).",
    fix: "Convey state with aria-expanded; the icon is decorative (aria-hidden) reinforcement only.",
  },
]

export default function AccessibleAccordionGuidePage() {
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
                  <span className="text-slate-900 dark:text-white font-medium">
                    Accessible Accordion
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
                Component Pattern Guide &bull; Updated July 2026
              </Badge>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
                Accessible Accordion &amp; Disclosure Pattern Guide
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Accordions and &ldquo;show more&rdquo; toggles are everywhere —
                and quietly broken almost as often. This guide covers the{" "}
                <code>aria-expanded</code> state, the button-in-heading
                structure, the native <code>&lt;details&gt;</code> element, and
                single vs multi-expand behavior, with copy-ready HTML,
                JavaScript, and React mapped to WCAG 2.2.
              </p>
            </div>
          </section>

          {/* What & why */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                Why Expand/Collapse Widgets Are So Often Wrong
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  A disclosure looks like the simplest interactive widget on the
                  page: click a header, content appears. That simplicity is a
                  trap. The most common build is a <code>&lt;div&gt;</code> with
                  an <code>onClick</code> that toggles a CSS class — which gives
                  a mouse user exactly what they expect and gives everyone else
                  nothing. The toggle is not focusable, the keyboard cannot
                  operate it, and a screen reader never announces whether the
                  section is open, closed, or a control at all.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Getting it right takes three things: a real{" "}
                  <code>&lt;button&gt;</code>, the <code>aria-expanded</code>{" "}
                  state kept in sync as the region opens and closes, and — for a
                  multi-section accordion — each button wrapped in a heading so
                  the structure is navigable. The{" "}
                  <a
                    href="https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    WAI-ARIA Authoring Practices Disclosure pattern
                  </a>{" "}
                  and its{" "}
                  <a
                    href="https://www.w3.org/WAI/ARIA/apg/patterns/accordion/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Accordion pattern
                  </a>{" "}
                  specify exactly what each needs. This guide turns both into
                  code you can paste in — and shows you when to skip ARIA
                  entirely and let the browser do the work.
                </p>
                <div className="rounded-lg border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 p-5 my-6">
                  <p className="text-sm text-slate-800 dark:text-amber-100 leading-relaxed flex gap-3">
                    <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
                    <span>
                      <strong>Try the native element first.</strong> If you do
                      not need to animate the transition or precisely control the
                      markup, <code>&lt;details&gt;</code> and{" "}
                      <code>&lt;summary&gt;</code> give you a fully accessible
                      disclosure with no JavaScript and no ARIA. Build a custom
                      widget only when the native one genuinely cannot do the
                      job.
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* WCAG mapping */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <ShieldCheck className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                The WCAG 2.2 Criteria Accordions Satisfy
              </h2>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    WCAG 2.2 success criteria that a correctly built accordion or
                    disclosure satisfies and what each requires
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
                        What the accordion must do
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-3-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          1.3.1 Info &amp; Relationships
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Headers are real headings; each button is linked to the region it controls.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-1-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.1.1 Keyboard
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Every header is reachable and toggles with Enter and Space.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-4-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.4.3 Focus Order
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Focus moves through headers in a logical order; opening a panel keeps focus on its header.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-4-7" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.4.7 Focus Visible
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">The focused header shows a clear, visible focus indicator.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/4-1-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                          4.1.2 Name, Role, Value
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">The button exposes its name, the button role, and the live aria-expanded state.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-muted-foreground leading-relaxed mt-4 text-sm">
                See the full picture in the{" "}
                <Link href="/guides/wcag-2-2-aa-requirements" className="text-blue-600 dark:text-blue-400 hover:underline">
                  WCAG 2.2 Level AA requirements
                </Link>{" "}
                and work through the interactive{" "}
                <Link href="/checklists/wcag-2-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                  WCAG 2.2 checklist
                </Link>
                .
              </p>
            </div>
          </section>

          {/* Disclosure vs Accordion vs Tabs */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Layers className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                Disclosure, Accordion, or Tabs? Pick the Right Pattern
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                These three patterns look similar but mean different things to
                assistive technology. Choosing the wrong one is itself an
                accessibility bug, because it misrepresents the structure. Match
                the pattern to how the content actually behaves.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-start gap-3 pb-3">
                    <div className="rounded-lg bg-blue-100 dark:bg-blue-900/30 p-2">
                      <ChevronsDownUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <CardTitle className="text-lg">Disclosure</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      <strong className="text-slate-900 dark:text-white">One</strong>{" "}
                      button that shows or hides a single region — &ldquo;Read
                      more,&rdquo; an expandable filter, a details toggle. No
                      grouping, no headings required.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-start gap-3 pb-3">
                    <div className="rounded-lg bg-violet-100 dark:bg-violet-900/30 p-2">
                      <ListCollapse className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                    </div>
                    <CardTitle className="text-lg">Accordion</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      <strong className="text-slate-900 dark:text-white">Several</strong>{" "}
                      disclosures grouped under headings — an FAQ list, stacked
                      settings sections. Sections can expand independently; each
                      header is a real heading.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-start gap-3 pb-3">
                    <div className="rounded-lg bg-indigo-100 dark:bg-indigo-900/30 p-2">
                      <Layers className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <CardTitle className="text-lg">Tabs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      <strong className="text-slate-900 dark:text-white">Exactly one</strong>{" "}
                      panel of related peer content visible at a time, with a
                      roving-tabindex tab strip. Use the{" "}
                      <Link href="/guides/accessible-tabs" className="text-blue-600 dark:text-blue-400 hover:underline">
                        tabs pattern
                      </Link>{" "}
                      instead.
                    </p>
                  </CardContent>
                </Card>
              </div>
              <p className="text-muted-foreground leading-relaxed mt-6">
                Rule of thumb: if sections can be open at the same time, or the
                content should stack and reflow on a narrow screen, use an
                accordion. If the sections are peers and only one should ever
                show, and they share a heading area, use tabs. If there is just
                one thing to reveal, it is a disclosure.
              </p>
            </div>
          </section>

          {/* 1. Native details/summary */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <UnfoldVertical className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                1. Start With the Native &lt;details&gt; Element
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Before writing a single line of ARIA, ask whether{" "}
                <code>&lt;details&gt;</code> and <code>&lt;summary&gt;</code> can
                do the job. They ship a complete, accessible disclosure: the{" "}
                <code>&lt;summary&gt;</code> is the toggle, the browser tracks the
                open state and exposes it to assistive technology, and keyboard
                support works out of the box. No <code>aria-expanded</code>, no
                click handler, no state to keep in sync.
              </p>
              <pre className="rounded-lg bg-slate-900 text-slate-100 text-sm p-4 overflow-x-auto"><code>{`<!-- A complete, accessible disclosure — zero JavaScript -->
<details>
  <summary>Shipping &amp; returns</summary>
  <p>
    Orders ship within two business days. Returns are free
    within 30 days of delivery.
  </p>
</details>

<!-- Add the "open" attribute to render it expanded by default -->
<details open>
  <summary>What sizes are available?</summary>
  <p>We stock XS through 3XL in every colourway.</p>
</details>`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Modern browsers even support an exclusive accordion natively:
                give a group of <code>&lt;details&gt;</code> elements the same{" "}
                <code>name</code> attribute and opening one closes the others —
                no JavaScript required.
              </p>
              <pre className="rounded-lg bg-slate-900 text-slate-100 text-sm p-4 overflow-x-auto mt-4"><code>{`<!-- Shared name = only one open at a time (Chrome/Edge/Safari/Firefox 2024+) -->
<details name="faq"><summary>How do refunds work?</summary><p>...</p></details>
<details name="faq"><summary>Where do you ship?</summary><p>...</p></details>
<details name="faq"><summary>Can I change my order?</summary><p>...</p></details>`}</code></pre>
              <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-5 my-6">
                <p className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  When the native element is not enough
                </p>
                <ul className="text-sm text-muted-foreground leading-relaxed space-y-1 list-disc pl-5">
                  <li>You need to animate the open/close transition (native <code>&lt;details&gt;</code> snaps open instantly).</li>
                  <li>You need full control over the header markup, or the toggle must be a heading that contains other elements.</li>
                  <li>Your framework owns the open state and rendering (React, Vue, Angular) and you want it in component state.</li>
                  <li>You need behavior <code>&lt;details&gt;</code> does not model — e.g. a &ldquo;collapse all&rdquo; control tied to shared state.</li>
                </ul>
                <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                  In those cases, build the ARIA disclosure below — but remember
                  you are re-creating what the browser gave you for free, so
                  match its behavior exactly.
                </p>
              </div>
            </div>
          </section>

          {/* 2. ARIA disclosure */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Code2 className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                2. The ARIA Disclosure: A Button + aria-expanded
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                When you build your own, the disclosure is just two elements: a
                real <code>&lt;button&gt;</code> and the region it controls. The
                button carries <code>aria-expanded</code> to announce the state
                and <code>aria-controls</code> to point at the region. Collapse
                the region with the <code>hidden</code> attribute so it leaves
                the accessibility tree entirely.
              </p>
              <pre className="rounded-lg bg-slate-900 text-slate-100 text-sm p-4 overflow-x-auto"><code>{`<button aria-expanded="false" aria-controls="more-details">
  More product details
</button>
<div id="more-details" hidden>
  <p>Full specifications, materials, and care instructions…</p>
</div>`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-4">
                That is the entire pattern. <code>aria-expanded="false"</code>{" "}
                tells a screen reader the button is collapsed, so it announces
                &ldquo;More product details, collapsed, button.&rdquo; The one
                job of your JavaScript is to flip <code>aria-expanded</code> and
                toggle <code>hidden</code> together, every time — the state on
                the button and the visibility of the region must never drift
                apart.
              </p>
            </div>
          </section>

          {/* 3. The accordion */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Heading className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                3. The Accordion: Disclosures Wrapped in Headings
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                An accordion is a group of disclosures, and it adds one
                structural rule: each toggle button must live inside a real
                heading element. That is what lets a screen reader user pull up
                the page&apos;s heading list and jump straight to any section —
                the single most useful way to navigate a long accordion.
              </p>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 mb-6">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    The elements in an accordion and the ARIA attributes each
                    needs
                  </caption>
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">Element</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Markup</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Key attributes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                    {attributeRows.map((row, i) => (
                      <tr key={i}>
                        <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top whitespace-nowrap">
                          {row.element}
                        </th>
                        <td className="px-4 py-3 align-top font-mono text-xs">{row.role}</td>
                        <td className="px-4 py-3 align-top">{row.attrs}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Here is a complete, conformant accordion. Note the{" "}
                <code>&lt;h3&gt;</code> wrapping every button, the paired{" "}
                <code>aria-controls</code> / <code>aria-labelledby</code> ids,
                and the <code>hidden</code> attribute on collapsed panels.
              </p>
              <pre className="rounded-lg bg-slate-900 text-slate-100 text-sm p-4 overflow-x-auto"><code>{`<div class="accordion">
  <h3>
    <button id="acc-ship" aria-expanded="true"
            aria-controls="panel-ship">
      Shipping &amp; delivery
    </button>
  </h3>
  <div id="panel-ship" role="region" aria-labelledby="acc-ship">
    <p>Orders ship within two business days…</p>
  </div>

  <h3>
    <button id="acc-returns" aria-expanded="false"
            aria-controls="panel-returns">
      Returns &amp; refunds
    </button>
  </h3>
  <div id="panel-returns" role="region"
       aria-labelledby="acc-returns" hidden>
    <p>Free returns within 30 days…</p>
  </div>

  <h3>
    <button id="acc-warranty" aria-expanded="false"
            aria-controls="panel-warranty">
      Warranty
    </button>
  </h3>
  <div id="panel-warranty" role="region"
       aria-labelledby="acc-warranty" hidden>
    <p>Two-year limited warranty on all products…</p>
  </div>
</div>`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-4">
                The <code>role="region"</code> and{" "}
                <code>aria-labelledby</code> on each panel are a recommended
                enhancement, not strictly required: they turn each open panel
                into a named landmark the user can navigate to. On accordions
                with many panels this can add landmark noise, so the APG suggests
                reserving <code>role="region"</code> for accordions with a small
                number of sections. The heading wrapper, however, is not
                optional. Set the heading level to fit the page outline — see the{" "}
                <Link href="/reference/aria" className="text-blue-600 dark:text-blue-400 hover:underline">
                  ARIA roles &amp; attributes reference
                </Link>{" "}
                for how each attribute is exposed.
              </p>
            </div>
          </section>

          {/* 4. Keyboard model */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Keyboard className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                4. The Keyboard Interaction Model
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The good news: an accordion built from real buttons needs almost
                no keyboard code. Because each header is a native{" "}
                <code>&lt;button&gt;</code>, <code>Tab</code> reaches it and{" "}
                <code>Enter</code> / <code>Space</code> toggle it for free —
                there is <strong className="text-slate-900 dark:text-white">no
                roving tabindex</strong> here, unlike the tabs pattern. Arrow-key
                navigation between headers is an optional convenience.
              </p>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    Keyboard keys and the action each performs in the accordion
                    pattern
                  </caption>
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold whitespace-nowrap">Key</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                    {keyboardRows.map((row, i) => (
                      <tr key={i}>
                        <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top whitespace-nowrap font-mono text-xs">
                          {row.key}
                        </th>
                        <td className="px-4 py-3 align-top">{row.action}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-muted-foreground leading-relaxed mt-4">
                The critical difference from tabs: in an accordion,{" "}
                <code>Tab</code> must always move between headers, and the Arrow
                keys are extra. In tabs, the Arrow keys are the primary
                navigation and the whole strip is a single Tab stop. Do not copy
                the roving-tabindex model from the{" "}
                <Link href="/guides/accessible-tabs" className="text-blue-600 dark:text-blue-400 hover:underline">
                  tabs guide
                </Link>{" "}
                into an accordion — see the broader technique in the{" "}
                <Link href="/guides/keyboard-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">
                  keyboard accessibility guide
                </Link>
                , and the{" "}
                <Link href="/guides/accessible-menu" className="text-blue-600 dark:text-blue-400 hover:underline">
                  menu and menu button guide
                </Link>{" "}
                for the disclosure-based pattern a navigation dropdown should use.
              </p>
            </div>
          </section>

          {/* 5. Vanilla JS */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Code2 className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                5. Wiring It Up in Vanilla JavaScript
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                This handler toggles any accordion header. One function reads and
                flips <code>aria-expanded</code> and the panel&apos;s{" "}
                <code>hidden</code> attribute together — the single source of
                truth that keeps state and visibility in sync.
              </p>
              <pre className="rounded-lg bg-slate-900 text-slate-100 text-sm p-4 overflow-x-auto"><code>{`const accordion = document.querySelector(".accordion")
const headers = [...accordion.querySelectorAll("button[aria-controls]")]

function toggle(button) {
  const expanded = button.getAttribute("aria-expanded") === "true"
  button.setAttribute("aria-expanded", String(!expanded))
  const panel = document.getElementById(button.getAttribute("aria-controls"))
  panel.hidden = expanded          // was open -> now hidden, and vice-versa
}

headers.forEach((button) => {
  // Enter/Space come free with a real <button>; just handle the toggle
  button.addEventListener("click", () => toggle(button))
})

// Optional APG enhancement: Up/Down/Home/End move focus between headers
accordion.addEventListener("keydown", (e) => {
  const i = headers.indexOf(document.activeElement)
  if (i === -1) return
  let next = null
  if (e.key === "ArrowDown") next = (i + 1) % headers.length
  else if (e.key === "ArrowUp") next = (i - 1 + headers.length) % headers.length
  else if (e.key === "Home") next = 0
  else if (e.key === "End") next = headers.length - 1
  else return
  e.preventDefault()
  headers[next].focus()            // Tab still works — this is extra, not required
})`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-4">
                For an exclusive (single-expand) accordion, collapse the others
                inside <code>toggle()</code> before opening the new one — and
                never disable the open header&apos;s button, so the user can
                always collapse the current section.
              </p>
            </div>
          </section>

          {/* 6. React */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Code2 className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                6. An Accessible Accordion in React
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The roles and states are identical — React derives them from
                state. Track which panels are open in a <code>Set</code> (so
                multiple can expand), generate stable ids with{" "}
                <code>useId</code>, and render the heading wrapper explicitly.
              </p>
              <pre className="rounded-lg bg-slate-900 text-slate-100 text-sm p-4 overflow-x-auto"><code>{`function Accordion({ items }) {
  const [open, setOpen] = React.useState(() => new Set([0]))
  const uid = React.useId()

  function toggle(i) {
    setOpen((prev) => {
      const next = new Set(prev)          // multi-expand
      next.has(i) ? next.delete(i) : next.add(i)
      return next
      // For single-expand: return next.has(i) ? new Set() : new Set([i])
    })
  }

  return (
    <div>
      {items.map((item, i) => {
        const isOpen = open.has(i)
        return (
          <div key={i}>
            <h3>
              <button
                id={\`\${uid}-h-\${i}\`}
                aria-expanded={isOpen}
                aria-controls={\`\${uid}-p-\${i}\`}
                onClick={() => toggle(i)}
              >
                {item.title}
              </button>
            </h3>
            <div
              id={\`\${uid}-p-\${i}\`}
              role="region"
              aria-labelledby={\`\${uid}-h-\${i}\`}
              hidden={!isOpen}
            >
              {item.content}
            </div>
          </div>
        )
      })}
    </div>
  )
}`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-4">
                In production, a headless, WAI-ARIA-tested library —{" "}
                <strong className="text-slate-900 dark:text-white">Radix UI Accordion</strong>,{" "}
                <strong className="text-slate-900 dark:text-white">React Aria Disclosure</strong>, or{" "}
                Headless UI — ships the state, heading structure, and optional
                keyboard handling for you. The{" "}
                <Link href="/guides/react-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">
                  React accessibility guide
                </Link>{" "}
                covers the <code>useId</code> pattern in depth, and the same
                approach applies in the{" "}
                <Link href="/guides/vue-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Vue
                </Link>{" "}
                and{" "}
                <Link href="/guides/angular-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Angular
                </Link>{" "}
                accessibility guides.
              </p>
            </div>
          </section>

          {/* 7. Single vs multi expand */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <ChevronsDownUp className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                7. Single-Expand vs Multi-Expand
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Whether one panel or many can be open at once is a UX decision —
                both are fully accessible. The choice changes how forgiving the
                accordion feels, not whether it conforms.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Card>
                  <CardHeader className="flex flex-row items-start gap-3 pb-3">
                    <div className="rounded-lg bg-green-100 dark:bg-green-900/30 p-2">
                      <UnfoldVertical className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <CardTitle className="text-lg">Multi-expand</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                      Any number of panels can be open independently. The
                      friendlier default — nothing the user opened ever
                      disappears on its own.
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      <strong className="text-slate-900 dark:text-white">Use for</strong>{" "}
                      FAQs, settings, and documentation where people compare or
                      scan across sections.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-start gap-3 pb-3">
                    <div className="rounded-lg bg-purple-100 dark:bg-purple-900/30 p-2">
                      <ChevronsDownUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <CardTitle className="text-lg">Single-expand</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                      Opening one panel collapses the rest. Keeps a long list
                      compact, but can surprise users when a section they opened
                      silently closes.
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      <strong className="text-slate-900 dark:text-white">Use for</strong>{" "}
                      space-constrained UIs — but never disable the open
                      header&apos;s button, and update aria-expanded on the
                      closed panel too.
                    </p>
                  </CardContent>
                </Card>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                The one accessibility trap in single-expand mode is the auto-close:
                when opening panel four closes panel two, panel two&apos;s{" "}
                <code>aria-expanded</code> must flip back to{" "}
                <code>&quot;false&quot;</code> and its content must gain the{" "}
                <code>hidden</code> attribute — otherwise a screen reader still
                thinks it is open. If you only need exclusive behavior and no
                animation, the native <code>&lt;details name&gt;</code> approach
                from section 1 handles all of this for you.
              </p>
            </div>
          </section>

          {/* Testing */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Bug className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                How to Test an Accessible Accordion
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Automated scanners can confirm a button exists and{" "}
                <code>aria-controls</code> points at a real id, but they cannot
                tell you the state stays in sync. Run this manual pass on every
                accordion:
              </p>
              <ol className="space-y-3 text-muted-foreground leading-relaxed list-decimal pl-6">
                <li>
                  <strong className="text-slate-900 dark:text-white">Tab to each header.</strong>{" "}
                  Every toggle receives focus with a visible indicator, in reading
                  order — no header is skipped or trapped.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Press Enter, then Space.</strong>{" "}
                  Both expand and collapse the panel. Focus stays on the header
                  after toggling — it does not jump into the panel.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Listen with a screen reader.</strong>{" "}
                  You should hear the header&apos;s name, &ldquo;button,&rdquo;
                  and &ldquo;collapsed&rdquo; or &ldquo;expanded&rdquo; that
                  flips as you toggle. Verify with the{" "}
                  <Link href="/guides/screen-reader-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                    screen reader testing guide
                  </Link>
                  .
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Pull up the heading list.</strong>{" "}
                  Each section appears as a heading at the right level, so the
                  user can jump straight to it.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Confirm collapsed content is gone.</strong>{" "}
                  A collapsed panel is unreachable by Tab and by the virtual
                  cursor — proof it left the accessibility tree.
                </li>
              </ol>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Then layer automated checks on top: <code>axe-core</code> flags a
                missing <code>aria-controls</code> target or an{" "}
                <code>aria-expanded</code> on a non-interactive element. See{" "}
                <Link href="/guides/automated-vs-manual-accessibility-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                  automated vs manual testing
                </Link>{" "}
                for where each fits, then scan the live page with the{" "}
                <Link href="/tools/url-accessibility-auditor" className="text-blue-600 dark:text-blue-400 hover:underline">
                  URL accessibility auditor
                </Link>
                .
              </p>
            </div>
          </section>

          {/* Anti-patterns */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                Common Accordion Mistakes &amp; How to Fix Them
              </h2>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    Common accessible-accordion anti-patterns, why they fail, and
                    the fix
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
                Accessible Accordion Checklist
              </h2>
              <ol className="space-y-4 text-muted-foreground leading-relaxed list-decimal pl-6">
                <li>
                  <strong className="text-slate-900 dark:text-white">Right pattern.</strong>{" "}
                  Sections can expand independently — not one-at-a-time peer
                  panels (use{" "}
                  <Link href="/guides/accessible-tabs" className="text-blue-600 dark:text-blue-400 hover:underline">
                    tabs
                  </Link>
                  ). Consider native <code>&lt;details&gt;</code> first.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Real buttons.</strong>{" "}
                  Every toggle is a <code>&lt;button&gt;</code>, so it is
                  focusable and Enter/Space work with no extra code.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">State is live.</strong>{" "}
                  <code>aria-expanded</code> sits on the button and flips{" "}
                  <code>true</code>/<code>false</code> on every toggle.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Headings wrap toggles.</strong>{" "}
                  Each header is <code>&lt;h3&gt;&lt;button&gt;…&lt;/button&gt;&lt;/h3&gt;</code>{" "}
                  at a level that fits the page outline.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Linked regions.</strong>{" "}
                  <code>aria-controls</code> points at each panel id; panels use{" "}
                  <code>aria-labelledby</code> back to their button.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Collapsed = hidden.</strong>{" "}
                  Closed panels use the <code>hidden</code> attribute so they
                  leave the accessibility tree.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Focus visible.</strong>{" "}
                  The focused header shows a clear indicator (
                  <Link href="/wcag/2-4-7" className="text-blue-600 dark:text-blue-400 hover:underline">
                    2.4.7
                  </Link>
                  ).
                </li>
              </ol>
              <p className="text-muted-foreground leading-relaxed mt-6">
                Work through the full{" "}
                <Link href="/checklists/wcag-2-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                  WCAG 2.2 checklist
                </Link>{" "}
                to see accordions in the context of every other requirement.
              </p>
            </div>
          </section>

          {/* CTA */}
          <section className="py-12 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <div className="rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20 p-8 text-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  Check Your Accordion on a Live Page
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6 max-w-lg mx-auto">
                  Scan any page with our free axe-core-powered auditor to catch a
                  missing <code>aria-expanded</code>, a broken{" "}
                  <code>aria-controls</code> target, or a toggle that is not a
                  real button — then run the manual keyboard pass above.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button asChild size="lg" className="gap-2">
                    <Link href="/tools/url-accessibility-auditor">
                      Scan a Page Now
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="gap-2">
                    <Link href="/guides/accessible-tabs">
                      Accessible Tabs Guide
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
                content="accessible accordion disclosure widget aria-expanded aria-controls details summary element collapsible expand collapse button heading structure single multi expand keyboard navigation react accordion focus management keyboard accessibility screen reader wcag 4.1.2 2.1.1 1.3.1 aria pattern tabs"
                title="Related Guides & Tools"
                maxItems={6}
                showDescriptions={true}
                excludeUrl="/guides/accessible-accordion"
              />
            </div>
          </section>
        </article>
      </div>
    </>
  )
}
