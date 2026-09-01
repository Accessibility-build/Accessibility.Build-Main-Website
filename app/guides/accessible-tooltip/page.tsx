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

const pageTitle = "Accessible Tooltips & Toggletips: A Complete Guide"
const pageDescription =
  "A tooltip and a toggletip look alike but are two different patterns, and choosing the wrong one is the most common accessibility bug in hover help. This guide draws the line: a tooltip is a supplement wired with aria-describedby that appears on hover and focus and holds only plain text, while a toggletip is a button plus a live region that reveals information the user asks for. It covers role=tooltip, why the title attribute is not an accessible tooltip, the rule that a tooltip can never contain a link or a button, naming an icon-only button, touch and reflow, and testing, with copy-ready HTML mapped to WCAG 2.2 and 1.4.13 Content on Hover or Focus."

export const metadata: Metadata = {
  title: pageTitle,
  description: clampDescription(pageDescription),
  keywords: [
    "accessible tooltip",
    "tooltip accessibility",
    "aria tooltip",
    "role tooltip",
    "accessible toggletip",
    "toggletip vs tooltip",
    "tooltip aria-describedby",
    "accessible tooltip html",
    "tooltip screen reader",
    "tooltip keyboard accessibility",
    "title attribute accessibility",
    "tooltip wcag",
    "wcag 1.4.13",
    "content on hover or focus",
    "tooltip focus hover",
    "accessible tooltip react",
    "tooltip role status",
    "tooltip vs popover",
    "tooltip on mobile",
    "icon button tooltip accessibility",
  ],
  alternates: {
    canonical: "/guides/accessible-tooltip",
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: "/guides/accessible-tooltip",
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
    name: "Accessible Tooltips & Toggletips",
    url: "https://accessibility.build/guides/accessible-tooltip",
  },
]

const faqs = [
  {
    question: "What is the difference between a tooltip and a toggletip?",
    answer:
      "A tooltip is a supplement that describes a control which already has its own name. It appears when the user hovers or focuses the control, it holds only plain text, and it is wired to the control with aria-describedby so a screen reader reads it after the control's name. A toggletip is different: it reveals information the user deliberately asks for by activating a button, such as an info icon next to a term. The button is the interactive element with its own label, and the revealed text goes into a live region so it is announced when it appears. The quick test is whether the extra text describes an existing control, in which case it is a tooltip, or whether it is new information the user requests, in which case it is a toggletip. Getting this choice wrong is the single most common accessibility bug in hover help.",
  },
  {
    question: "Is the title attribute an accessible tooltip?",
    answer:
      "No. The native title attribute produces a small tooltip on mouse hover, but it is not accessible as a general solution. A keyboard user cannot reliably bring it up because it does not appear on focus, a touch user never sees it at all because there is no hover on a touchscreen, its timing and position cannot be controlled, it cannot be styled, and screen readers announce it inconsistently. It also fails the 1.4.13 Content on Hover or Focus requirements, because you cannot make it hoverable, dismissible, or persistent. Use title only where it is genuinely appropriate, such as the title on an iframe, and never as the only place important information lives. Build a real tooltip with role=tooltip and aria-describedby, or a toggletip, instead.",
  },
  {
    question: "Can a tooltip contain a link or a button?",
    answer:
      "No, and this is the rule that breaks most custom tooltips. An element with role=tooltip is not a container you can move keyboard focus into, so any link, button, or form field placed inside it is unreachable by keyboard and screen reader users. A tooltip appears in response to hovering or focusing its trigger and disappears when that hover or focus leaves, which means there is no way to travel into it and operate a control without dismissing it. If the content needs interaction, it is not a tooltip. Use a popover or a dialog instead, which are designed to receive focus and hold interactive content. When you find yourself wanting a button inside a tooltip, that is the signal to change patterns.",
  },
  {
    question: "Should a tooltip use aria-describedby or aria-labelledby?",
    answer:
      "It depends on whether the control already has a name. When the control has its own visible label, for example a button that reads Save with a tooltip adding a keyboard shortcut, the tooltip is supplementary, so associate it with aria-describedby and a screen reader announces it after the name. When the control has no visible text of its own, for example an icon-only button, the accessible name has to come from somewhere, and a bare aria-describedby is not enough, because the control would announce as just button with a description and no name. In that case give the button a real name with aria-label or point aria-labelledby at the tooltip, and let the tooltip double as the visible-on-hover version of that name. The rule is that describedby adds detail to a control that is already named; it never substitutes for the name itself.",
  },
  {
    question: "How do I make a tooltip work on touchscreens?",
    answer:
      "You often cannot, and that is a reason to reconsider the pattern. Touchscreens have no hover state, so a tooltip that only appears on hover is invisible to a phone or tablet user. For anything that matters, use a toggletip instead, because it is triggered by a tap on a real button rather than by hovering, so it works the same on touch, mouse, and keyboard. If you keep a hover tooltip, make sure the information it carries is genuinely supplementary and available another way, never the only source. This is also why essential form instructions should sit in visible helper text associated with aria-describedby, not hidden inside a hover tooltip that a large group of users will never trigger.",
  },
  {
    question: "What are the 1.4.13 rules a tooltip has to meet?",
    answer:
      "WCAG 2.2 success criterion 1.4.13 Content on Hover or Focus applies to any content that appears on hover or focus and can be perceived and then goes away, which is exactly a tooltip. It sets three requirements. Dismissible: the user can dismiss the extra content without moving the pointer or the keyboard focus, usually by pressing Escape, so a tooltip that covers something cannot trap the reader. Hoverable: the user can move the pointer onto the tooltip itself without it disappearing, which matters when the tooltip contains text someone needs to read or a link the surrounding content refers to. Persistent: the content stays visible until the user moves hover or focus away, dismisses it, or the information is no longer valid, so it does not vanish on a timer. The criterion page on this site covers all three with runnable code.",
  },
  {
    question: "Does a tooltip need to appear on keyboard focus, not just hover?",
    answer:
      "Yes. A tooltip that only appears on mouse hover is invisible to keyboard users, who reach the trigger with Tab and never move a pointer over it. The criterion name itself is Content on Hover or Focus, and the focus half is not optional. Show the tooltip whenever the trigger is either hovered or focused, which in CSS means pairing a hover rule with a focus-visible rule, and in JavaScript means listening for focus and blur alongside mouseenter and mouseleave. Test it by tabbing to the trigger with the mouse untouched and confirming the tooltip appears, then pressing Escape and confirming it dismisses. If it only shows on hover, keyboard and screen reader users are getting none of the information.",
  },
  {
    question: "When should I not use a tooltip at all?",
    answer:
      "Do not use a tooltip for anything essential, because a tooltip is supplementary by definition: it hides on touch, it is easy to miss, and it depends on hover or focus that not everyone provides. Never put required form instructions, error messages, or the only copy of a piece of information inside a hover tooltip. Field instructions belong in visible helper text tied to the input with aria-describedby, so they are always on screen and always announced. An icon-only control needs a real accessible name, not just a tooltip that might not fire. And if the content is long, formatted, or interactive, a tooltip is the wrong container entirely; reach for a toggletip, a disclosure, or a dialog. A good rule is that if the interface stops working when the tooltip never appears, the information was in the wrong place.",
  },
]

const antiPatterns = [
  {
    bad: "The tooltip is the element's title attribute.",
    why: "A title tooltip does not appear on keyboard focus, never shows on touch, cannot be made dismissible or hoverable, and is announced inconsistently, so it fails 1.4.13 and reaches only some mouse users.",
    fix: "Build a real tooltip with role=tooltip and aria-describedby that shows on hover and focus, and reserve title for cases like an iframe title.",
  },
  {
    bad: "The tooltip only appears on mouse hover.",
    why: "Keyboard users reach the trigger with Tab and never move a pointer over it, so they get none of the information (fails 1.4.13, which is Content on Hover or Focus).",
    fix: "Show the tooltip on focus as well as hover, pairing a :focus-visible rule with the :hover rule, or focus and blur listeners with the mouse ones.",
  },
  {
    bad: "A link or button lives inside role=\"tooltip\".",
    why: "A tooltip cannot receive focus, so any control inside it is unreachable by keyboard and disappears the moment the user tries to move toward it (fails 2.1.1 and 4.1.2).",
    fix: "If the content needs interaction, it is not a tooltip; use a popover or a dialog, which are built to hold focus and interactive content.",
  },
  {
    bad: "Essential information exists only in a hover tooltip.",
    why: "A tooltip is supplementary and vanishes on touch and for many keyboard users, so putting a requirement or the only copy of something there hides it from a large group (weakens 1.3.1 and reliability of the task).",
    fix: "Move essential content into visible text, using aria-describedby on helper text for inputs, and keep tooltips for genuinely extra detail.",
  },
  {
    bad: "An icon-only button has a tooltip but no accessible name.",
    why: "aria-describedby adds a description, not a name, so the control announces as just \"button\" with a description and no label of its own (fails 4.1.2 and 2.4.4).",
    fix: "Give the button a real name with aria-label or aria-labelledby pointing at the tooltip text, then let the tooltip be the visible-on-hover version.",
  },
  {
    bad: "The tooltip hides as soon as the pointer moves toward it.",
    why: "A tooltip that is not hoverable or persistent cannot be read when it contains more than a couple of words, and one that cannot be dismissed can trap content underneath it (fails 1.4.13).",
    fix: "Cover the trigger and the tooltip with one hover container so the pointer can travel between them, keep it visible until hover or focus leaves, and let Escape dismiss it.",
  },
  {
    bad: "A toggletip injects its text with no live region.",
    why: "When the revealed content appears in an element that was not a live region, a screen reader is not told anything changed, so the user activates the button and hears nothing (fails 4.1.3).",
    fix: "Put the revealed text into an always-present element with role=\"status\", and set its text on activation so the change is announced politely.",
  },
]

export default function AccessibleTooltipGuidePage() {
  return (
    <>
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />
      <GuideArticleSchema route="/guides/accessible-tooltip" title={pageTitle} description={pageDescription} datePublished="2026-08-19" />
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
                    Accessible Tooltips &amp; Toggletips
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
                Accessible Tooltips &amp; Toggletips
              </h1>
              <PageByline route="/guides/accessible-tooltip" className="mb-5" />
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                A tooltip and a toggletip look almost identical on screen, yet they
                are two different patterns with two different rules, and picking the
                wrong one is the most common mistake in hover help. This guide draws
                the line, then covers building each correctly: <code>role=&quot;tooltip&quot;</code>{" "}
                wired with <code>aria-describedby</code>, why the <code>title</code>{" "}
                attribute is not a real tooltip, the rule that a tooltip can never
                hold a link or a button, naming an icon-only control, touch and
                reflow, and testing. Copy-ready HTML mapped to WCAG 2.2.
              </p>
            </div>
          </section>

          {/* The core idea */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                Tooltip or Toggletip? Decide That First
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Most accessible-tooltip advice on the web quietly covers two
                  different components under one name, which is why so many
                  implementations end up half right. Before you write any markup, sort
                  out which pattern you actually need, because the ARIA, the trigger,
                  and the way a screen reader announces the content all differ between
                  them.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  A <strong className="text-slate-900 dark:text-white">tooltip</strong>{" "}
                  is a supplement. It describes a control that already has its own
                  name, it appears when the user hovers or focuses that control, and it
                  holds nothing but a short piece of plain text. A button labelled Save
                  with a tooltip that adds &ldquo;Saves to your account (Ctrl+S)&rdquo;
                  is the classic case: the button is named on its own, and the tooltip
                  only adds detail. It is wired to the control with{" "}
                  <code>aria-describedby</code>, so a screen reader reads it after the
                  control&rsquo;s name and role.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  A <strong className="text-slate-900 dark:text-white">toggletip</strong>{" "}
                  reveals information the user deliberately asks for. The small info
                  icon next to a form label or a piece of jargon, the one you click to
                  learn what a term means, is a toggletip. The trigger is a real{" "}
                  <code>&lt;button&gt;</code> with its own name, and the revealed text
                  is placed in a live region so that activating the button announces it.
                  A toggletip is opened by a click or a tap rather than by hovering,
                  which is exactly why it keeps working on a touchscreen where a hover
                  tooltip does not.
                </p>
                <div className="not-prose rounded-lg border border-teal-200 dark:border-teal-900/50 bg-teal-50 dark:bg-teal-950/20 p-5 my-6">
                  <p className="text-sm font-semibold text-teal-900 dark:text-teal-200 mb-2">
                    The one question that decides everything
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Ask whether the extra text <em>describes a control that is already
                    there</em>, or whether it is <em>new information the user
                    requests</em>. If it describes an existing, named control, it is a
                    tooltip: use <code>aria-describedby</code>, and show it on hover and
                    focus. If it is information the user asks to see, it is a toggletip:
                    use a real button and a live region, and open it on click. Almost
                    every other decision in this guide follows from getting that one
                    right, and the most common tooltip bug is building one pattern when
                    you needed the other.
                  </p>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  One boundary sits above both patterns and is worth stating plainly:
                  a tooltip is supplementary, never essential. It hides on touch, it is
                  easy to miss, and it depends on a hover or focus that not everyone
                  provides. The moment a requirement, an error message, or the only
                  copy of some information lives inside a tooltip, the interface has a
                  hole in it. Keep essential content in visible text, and let tooltips
                  and toggletips carry the extra detail.
                </p>
              </div>
            </div>
          </section>

          {/* WCAG mapping */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <ShieldCheck className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                How Tooltips Map to WCAG 2.2
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                No criterion says &ldquo;you must add tooltips,&rdquo; but the moment
                content appears on hover or focus, one criterion is written for exactly
                that situation. The highlighted row,{" "}
                <Link href="/wcag/1-4-13" className="text-blue-600 dark:text-blue-400 hover:underline">
                  1.4.13 Content on Hover or Focus
                </Link>
                , is the defining one, and its three rules (dismissible, hoverable,
                persistent) are what separates a usable tooltip from one that fights
                the reader. The rest of the table covers the name and role, the
                keyboard, reflow, and, for a toggletip, the announcement.
              </p>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    WCAG 2.2 success criteria that apply to tooltips and toggletips,
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
                        How it applies to tooltips and toggletips
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                    <tr className="bg-blue-50/60 dark:bg-blue-950/20">
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-4-13" className="text-blue-600 dark:text-blue-400 hover:underline">
                          1.4.13 Content on Hover or Focus
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">The tooltip has to be dismissible with Escape, hoverable so the pointer can move onto it, and persistent so it does not vanish on a timer while the user reads it.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/4-1-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                          4.1.2 Name, Role, Value
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">The popup carries role=&quot;tooltip&quot;, the trigger keeps its own accessible name, and a toggletip button exposes its expanded state; the tooltip describes, it does not replace the name.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-3-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          1.3.1 Info and Relationships
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">The link between the trigger and its tooltip is made in the markup with aria-describedby or aria-labelledby, not implied only by visual proximity.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-1-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.1.1 Keyboard
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">The tooltip appears on keyboard focus, not hover alone, and a toggletip opens from a real button with Enter or Space; no content is trapped where a keyboard cannot reach it.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/4-1-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                          4.1.3 Status Messages
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">A toggletip reveals its text through a live region, so activating the button is announced without moving focus into the revealed content.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-4-10" className="text-blue-600 dark:text-blue-400 hover:underline">
                          1.4.10 Reflow
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">At 320 pixels wide and 400 percent zoom the tooltip reflows into the viewport instead of being clipped or forcing horizontal scrolling.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-4-4" className="text-blue-600 dark:text-blue-400 hover:underline">
                          1.4.4 Resize Text
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">Tooltip text scales with the page up to 200 percent without being cut off, so the popup must grow with its content rather than sit in a fixed box.</td>
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

          {/* 1. The tooltip */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                1. Building the Tooltip: role=&quot;tooltip&quot; and aria-describedby
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Start with the true tooltip, the supplement on an already-named
                  control. Three things carry the accessibility. The popup gets{" "}
                  <code>role=&quot;tooltip&quot;</code> so assistive technology knows
                  what it is. The trigger points at it with{" "}
                  <code>aria-describedby</code> so the two are associated in the
                  markup. And one wrapper covers both the trigger and the tooltip, so
                  the pointer can travel from the control onto the tooltip without
                  crossing a dead gap that would close it. Here is the whole pattern:
                </p>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`<span class="tooltip-wrapper">
  <button type="button" aria-describedby="save-tip">
    Save
  </button>

  <!-- role="tooltip" + a stable id the trigger describes.
       Plain text only: no links, no buttons, no fields. -->
  <span role="tooltip" id="save-tip" class="tooltip">
    Saves to your account. Shortcut: Ctrl+S.
  </span>
</span>`}</code></pre>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The <code>aria-describedby</code> is doing the load-bearing work.
                  Because the button already has the visible name Save, the tooltip is
                  extra detail, and a screen reader announces it as a description after
                  the name and role: &ldquo;Save, button, saves to your account,
                  shortcut Control S.&rdquo; That is the correct relationship for a
                  tooltip. The next section covers the different case where the control
                  has no name of its own.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                  Show it on focus, not only on hover
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The criterion is called Content on Hover <em>or Focus</em> for a
                  reason. A keyboard user reaches the trigger with Tab and never moves
                  a pointer over it, so a hover-only tooltip is completely invisible to
                  them. Reveal the tooltip whenever the trigger is hovered or focused,
                  which in CSS means pairing a focus rule with the hover rule and
                  covering both the trigger and the popup:
                </p>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`.tooltip {
  position: absolute;
  display: none;
  /* A small overlap means there is no gap to cross when the
     pointer moves from the trigger onto the tooltip. */
  margin-top: 4px;
}

/* Hoverable + Persistent: hovering anywhere in the wrapper
   keeps the tooltip open, and nothing hides it on a timer. */
.tooltip-wrapper:hover .tooltip,
.tooltip-wrapper:focus-within .tooltip {
  display: block;
}`}</code></pre>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Because the wrapper responds to both{" "}
                  <code>:hover</code> and <code>:focus-within</code>, the tooltip
                  appears for a mouse user who hovers and for a keyboard user who tabs
                  to the trigger, and it stays open while either the trigger or the
                  tooltip has hover or focus. That satisfies two of the three 1.4.13
                  rules for free: it is hoverable, because the wrapper covers the
                  tooltip too, and it is persistent, because only leaving hides it. The
                  third rule, dismissible, needs a few lines of script so Escape can
                  clear a tooltip that overlaps other content. The{" "}
                  <Link href="/wcag/1-4-13" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.4.13 Content on Hover or Focus
                  </Link>{" "}
                  reference walks through the dismissible handler in full; this guide
                  points you there rather than repeating it, because the criterion page
                  is the canonical home for those three rules.
                </p>
              </div>
            </div>
          </section>

          {/* 2. The title attribute */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                2. The title Attribute Is Not an Accessible Tooltip
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  It is tempting to reach for the native <code>title</code> attribute,
                  because the browser draws a little tooltip from it with no code at
                  all. Resist it. As a general tooltip mechanism the{" "}
                  <code>title</code> attribute fails almost everyone who is not using a
                  mouse, and it cannot be made to meet 1.4.13.
                </p>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`<!-- Do NOT rely on this as a tooltip -->
<button type="button" title="Saves to your account">Save</button>`}</code></pre>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Here is what goes wrong. It does not appear on keyboard focus, so a
                  keyboard user never sees it. It never shows on a touchscreen, because
                  there is no hover on touch, so every phone and tablet user is shut
                  out. You cannot control when it appears, how long it stays, or where
                  it sits, so it cannot be made dismissible, hoverable, or persistent.
                  It cannot be styled, so it ignores your color and contrast choices.
                  And screen readers treat it inconsistently: some read it, some do
                  not, some read it only when nothing else names the element. That last
                  behavior is the root of a related bug, where a <code>title</code>{" "}
                  becomes the accidental accessible name of a control and overrides
                  better text.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  There are a few places <code>title</code> is genuinely appropriate.
                  The <code>title</code> on an <code>&lt;iframe&gt;</code> gives the
                  frame an accessible name and is expected there. A <code>title</code>{" "}
                  on an abbreviation is a long-standing, if weak, convention. Outside
                  cases like these, if you want a tooltip, build one with{" "}
                  <code>role=&quot;tooltip&quot;</code> and{" "}
                  <code>aria-describedby</code> as shown above, and if you want
                  requested information, build a toggletip. Treat <code>title</code> as
                  a last-resort supplement that must never carry information a user
                  actually needs.
                </p>
              </div>
            </div>
          </section>

          {/* 3. No interactive content */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                3. The Rule That Breaks Most Tooltips: No Interactive Content
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  This is the constraint that quietly invalidates a large share of
                  custom tooltips, and it is worth understanding rather than just
                  memorizing. An element with <code>role=&quot;tooltip&quot;</code> is
                  not a container you can move keyboard focus into. It exists only for
                  as long as its trigger is hovered or focused, and it disappears the
                  instant that hover or focus moves elsewhere. So the moment a user
                  tries to travel into the tooltip to click a link or press a button
                  inside it, the focus leaves the trigger and the tooltip vanishes out
                  from under them.
                </p>
                <div className="not-prose rounded-lg border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/20 p-5 my-6">
                  <p className="text-sm font-semibold text-amber-900 dark:text-amber-200 mb-2">
                    If it needs a link or a button, it is not a tooltip
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    A tooltip holds plain, non-interactive text and nothing else. The
                    moment you want a link, a button, a form field, or a{" "}
                    <em>Learn more</em> action inside it, you have outgrown the pattern.
                    Interactive content belongs in a popover or a dialog, which are
                    built to receive focus and hold controls. Wanting a button in your
                    tooltip is not a styling problem to solve; it is the signal to
                    switch components.
                  </p>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The fix is to name the pattern correctly. If the content is a couple
                  of interactive controls that appear next to a trigger, that is a{" "}
                  <strong className="text-slate-900 dark:text-white">popover</strong>:
                  a non-modal container that receives focus and can be dismissed. If it
                  is a focused task that should hold the user until they finish or
                  cancel, that is a{" "}
                  <Link href="/guides/accessible-dialog" className="text-blue-600 dark:text-blue-400 hover:underline">
                    dialog
                  </Link>
                  , with a focus trap and a return of focus when it closes. Both are
                  designed for interaction in a way a tooltip never can be. Keep the
                  tooltip for what it is good at, a short line of descriptive text, and
                  reach for the right container the moment a control has to live inside.
                </p>
              </div>
            </div>
          </section>

          {/* 4. The toggletip */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                4. The Toggletip: a Button Plus a Live Region
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  When the extra content is information the user asks to see, rather
                  than a description of an existing control, you want a toggletip. The
                  familiar shape is a small info icon beside a label or a technical
                  term: the user activates it and a short explanation appears. Two
                  parts make it accessible, and they are different from a tooltip. The
                  trigger is a real <code>&lt;button&gt;</code> with its own accessible
                  name, because it is genuinely interactive. And the revealed text is
                  placed inside a live region, so that when it appears a screen reader
                  announces it, since focus does not move into it.
                </p>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`<span class="toggletip-wrapper">
  <button type="button"
          class="toggletip-trigger"
          aria-label="More information about APR">
    <span aria-hidden="true">i</span>
  </button>

  <!-- The live region is ALWAYS in the DOM, starting empty.
       role="status" is polite; it announces when populated. -->
  <span role="status" class="toggletip-bubble"></span>
</span>`}</code></pre>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The button carries its name with <code>aria-label</code>, and the
                  decorative <code>i</code> glyph is hidden with{" "}
                  <code>aria-hidden=&quot;true&quot;</code> so it is not read on its
                  own. The bubble is an always-present <code>role=&quot;status&quot;</code>{" "}
                  element that starts empty. The trick that makes the announcement fire
                  reliably is to clear it and then set its text on each activation, so
                  the live region genuinely changes and re-announces even if the user
                  opens the same toggletip twice:
                </p>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`const wrapper = document.querySelector(".toggletip-wrapper");
const trigger = wrapper.querySelector(".toggletip-trigger");
const bubble = wrapper.querySelector(".toggletip-bubble");
const message = "APR is the yearly cost of the loan as a percentage.";

trigger.addEventListener("click", () => {
  // Clear first, then set, so the live region always changes
  // and re-announces on repeat activations.
  bubble.textContent = "";
  window.requestAnimationFrame(() => {
    bubble.textContent = message;
  });
});

// Dismiss on Escape or when focus leaves the wrapper.
wrapper.addEventListener("keydown", (event) => {
  if (event.key === "Escape") bubble.textContent = "";
});
document.addEventListener("click", (event) => {
  if (!wrapper.contains(event.target)) bubble.textContent = "";
});`}</code></pre>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Notice what a toggletip buys you. Because it is triggered by a click
                  or a tap on a real button, it works the same on a touchscreen, a
                  mouse, and a keyboard, which a hover tooltip does not. Because the
                  content lives in a{" "}
                  <Link href="/wcag/4-1-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                    status live region
                  </Link>
                  , it is announced when it appears without you having to move focus.
                  And because the button is a real control, the keyboard and screen
                  reader support you need is mostly already there. For anything a user
                  might genuinely need to read, especially on mobile, a toggletip is
                  usually the safer choice than a hover tooltip.
                </p>
              </div>
            </div>
          </section>

          {/* 5. Naming vs describing */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                5. When the Tooltip Is the Only Label: Naming vs Describing
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Icon-only buttons, the toolbar of little glyphs with no visible text,
                  are where tooltips and accessible names get tangled. The instinct is
                  to slap an <code>aria-describedby</code> tooltip on the icon and call
                  it labelled. That is wrong, and the reason is the difference between{" "}
                  <em>naming</em> a control and <em>describing</em> it.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  A description is extra detail layered on top of a control that
                  already has a name. If an icon button has <em>no</em> visible text
                  and you give it only <code>aria-describedby</code>, it has a
                  description but still no name, so a screen reader announces it as
                  &ldquo;button&rdquo; followed by the description, with no label for
                  the control itself. That fails{" "}
                  <Link href="/wcag/4-1-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                    4.1.2 Name, Role, Value
                  </Link>{" "}
                  and{" "}
                  <Link href="/wcag/2-4-4" className="text-blue-600 dark:text-blue-400 hover:underline">
                    2.4.4 Link Purpose
                  </Link>
                  . The control needs a name first.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  There are two clean ways to do it. Give the button a real name with{" "}
                  <code>aria-label</code>, and let a separate tooltip be the
                  visible-on-hover copy of that same name. Or point the button&rsquo;s{" "}
                  <code>aria-labelledby</code> at the tooltip element, so the tooltip
                  text becomes the button&rsquo;s name and its visible presentation at
                  once:
                </p>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`<!-- Option A: aria-label names the button; the tooltip
     repeats it visually on hover and focus. -->
<span class="tooltip-wrapper">
  <button type="button" aria-label="Delete draft">
    <span aria-hidden="true">&#128465;</span>
  </button>
  <span role="tooltip" class="tooltip">Delete draft</span>
</span>

<!-- Option B: the tooltip IS the name via aria-labelledby.
     One source of truth for name and visible label. -->
<span class="tooltip-wrapper">
  <button type="button" aria-labelledby="del-tip">
    <span aria-hidden="true">&#128465;</span>
  </button>
  <span role="tooltip" id="del-tip" class="tooltip">Delete draft</span>
</span>`}</code></pre>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The rule to carry away is simple.{" "}
                  <code>aria-describedby</code> adds a description to a control that is{" "}
                  <em>already named</em>; it never substitutes for the name. Use it for
                  the extra detail on a Save button. When the control has no visible
                  text of its own, name it with <code>aria-label</code> or{" "}
                  <code>aria-labelledby</code> first, and treat any tooltip as the
                  visible echo of that name, not a replacement for it.
                </p>
              </div>
            </div>
          </section>

          {/* 6. Touch, positioning, reflow */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                6. Touch, Positioning, and Reflow
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-2 mb-3">
                  There is no hover on touch
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  A touchscreen has no hover state, so a tooltip that appears only on
                  hover is invisible to every phone and tablet user. This is not an
                  edge case; it is most of your traffic. If the information matters at
                  all, that is the signal to use a toggletip, which opens on a tap
                  because its trigger is a real button. Reserve hover tooltips for
                  detail that is genuinely optional and available another way, and never
                  let a hover tooltip be the only path to something a user needs.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                  Do not let it get clipped or cover what it explains
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  A tooltip that appears near the edge of the screen can be cut off by
                  an <code>overflow: hidden</code> ancestor or pushed outside the
                  viewport, so position it so it flips to the other side of the trigger
                  when there is not enough room, and make sure it is not trapped inside
                  a clipping container. Just as important, it must not permanently cover
                  the control it describes or the content the user was reading, which is
                  part of why 1.4.13 requires it to be dismissible with Escape.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                  Reflow and text scaling
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  At 320 pixels wide, or when a user zooms to 400 percent, the tooltip
                  has to reflow into the viewport rather than force horizontal
                  scrolling, which is{" "}
                  <Link href="/wcag/1-4-10" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.4.10 Reflow
                  </Link>
                  . Give it a sensible <code>max-width</code> and let it wrap, rather
                  than pinning it to a single line that runs off the screen. And when a
                  user increases the text size to 200 percent for{" "}
                  <Link href="/wcag/1-4-4" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.4.4 Resize Text
                  </Link>
                  , the box must grow with the text instead of clipping it, so avoid
                  fixed heights and hidden overflow on the tooltip itself. A tooltip
                  that looks tidy at default settings but truncates its own text at
                  200 percent zoom has simply moved the failure out of sight.
                </p>
              </div>
            </div>
          </section>

          {/* 7. Testing */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                7. Testing a Tooltip or Toggletip
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-2 mb-3">
                  Keyboard
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Tab to the trigger without touching the mouse. A tooltip must appear
                  on focus alone; if it does not, it is hover-only and broken for
                  keyboard users. Press Escape and confirm the tooltip dismisses while
                  focus stays on the trigger. Try to Tab <em>into</em> the tooltip:
                  focus should never land inside it, and if you find a link or button
                  in there, the pattern is wrong and needs to be a popover or dialog. A
                  toggletip should open with Enter or Space on its button and close on
                  Escape.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                  Screen reader
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  This is the test that catches the naming bugs. Focus the trigger and
                  listen. A tooltip on a named control should be read as a description
                  after the name and role, for example &ldquo;Save, button, saves to
                  your account.&rdquo; An icon-only control must announce a real name,
                  not just &ldquo;button&rdquo; with a trailing description; if you hear
                  no name, your <code>aria-describedby</code> is standing in for a label
                  it cannot provide. Activate a toggletip and confirm the revealed text
                  is spoken when it appears, which tells you the live region is working.
                  Verify with more than one reader if you can, using the{" "}
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
                  Hover, touch, and zoom
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Move the pointer from the trigger onto the tooltip and confirm it
                  stays open, which is the hoverable rule. Open the same page on a real
                  touchscreen and check whether the information is reachable at all; if
                  it is a hover tooltip, it will not be, which is your cue to make it a
                  toggletip. Then narrow the viewport to 320 pixels and zoom the text to
                  200 percent, and confirm the tooltip reflows and grows with its text
                  instead of being clipped.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                  What tools catch, and what they do not
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Automated checkers such as{" "}
                  <Link href="/guides/axe-vs-wave" className="text-blue-600 dark:text-blue-400 hover:underline">
                    axe and WAVE
                  </Link>{" "}
                  can flag a control with no accessible name and a misused role, and
                  those are worth catching. What they cannot judge is whether the
                  tooltip appears on focus, whether it is dismissible and hoverable,
                  whether a link is hiding inside it, or whether the content is
                  reachable on touch. As the{" "}
                  <Link href="/guides/automated-vs-manual-accessibility-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                    automated versus manual testing guide
                  </Link>{" "}
                  puts it, the machine gets you to valid markup and a person decides
                  whether the behavior is right. For where this fits in a full review,
                  see the{" "}
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
                Common Tooltip Mistakes &amp; How to Fix Them
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                These are the errors that turn up most in real tooltip audits. Most
                trace back to two habits: reaching for the wrong mechanism (the{" "}
                <code>title</code> attribute, hover with no focus), and asking a tooltip
                to do a job it cannot do (hold a control, carry essential text, or name
                an unlabeled button).
              </p>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    Common tooltip and toggletip anti-patterns, why each one fails, and
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
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <ListChecks className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                The Accessible Tooltip &amp; Toggletip Checklist
              </h2>
              <ol className="space-y-4 text-muted-foreground leading-relaxed list-decimal pl-6">
                <li>
                  <strong className="text-slate-900 dark:text-white">The pattern is chosen on purpose.</strong>{" "}
                  A tooltip for a description of a named control; a toggletip for
                  information the user requests. The choice drives everything else.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">The tooltip uses role and describedby.</strong>{" "}
                  The popup carries <code>role=&quot;tooltip&quot;</code> and the
                  trigger points at it with <code>aria-describedby</code>, so the
                  relationship is in the markup.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">It appears on focus, not only hover.</strong>{" "}
                  Tabbing to the trigger reveals the tooltip, so keyboard users get the
                  same information a mouse user does.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">It is dismissible, hoverable, and persistent.</strong>{" "}
                  Escape clears it, the pointer can move onto it without it closing, and
                  it stays until hover or focus leaves, satisfying 1.4.13.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">No interactive content inside.</strong>{" "}
                  The tooltip holds plain text only; any link, button, or field means
                  the content belongs in a popover or a dialog instead.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">The title attribute is not the tooltip.</strong>{" "}
                  Real tooltips are built markup, not a bare <code>title</code>, which
                  is reserved for cases like an iframe title.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Icon-only controls are named, not just described.</strong>{" "}
                  An unlabeled button gets a name from <code>aria-label</code> or{" "}
                  <code>aria-labelledby</code>; the tooltip is the visible echo, never
                  the only label.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">The toggletip announces its content.</strong>{" "}
                  Its trigger is a real button, and the revealed text sits in a{" "}
                  <code>role=&quot;status&quot;</code> live region that is populated on
                  activation.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Nothing essential lives in a tooltip.</strong>{" "}
                  Requirements, errors, and the only copy of information are in visible
                  text; the tooltip carries genuinely optional detail.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">It survives touch, reflow, and zoom.</strong>{" "}
                  The content is reachable on a touchscreen, and the tooltip reflows and
                  grows with its text at 320 pixels and 200 percent.
                </li>
              </ol>
            </div>
          </section>

          {/* CTA */}
          <section className="py-12 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <div className="rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20 p-8 text-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  Tooltips Live Next to Popovers and Dialogs
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6 max-w-lg mx-auto">
                  The moment a tooltip needs a control inside it, you have reached for a
                  dialog. See how a real focus-managed dialog is built, and read the
                  criterion that governs content appearing on hover or focus.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button asChild size="lg" className="gap-2">
                    <Link href="/guides/accessible-dialog">
                      Accessible Dialog Guide
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="gap-2">
                    <Link href="/wcag/1-4-13">
                      1.4.13 Content on Hover or Focus
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
                content="accessible tooltip tooltip accessibility aria tooltip role tooltip accessible toggletip toggletip vs tooltip tooltip aria-describedby accessible tooltip html tooltip screen reader tooltip keyboard accessibility title attribute accessibility tooltip wcag wcag 1.4.13 content on hover or focus tooltip focus hover accessible tooltip react tooltip role status tooltip vs popover tooltip on mobile icon button tooltip accessibility aria-describedby aria-labelledby name role value 4.1.2 1.3.1 2.1.1 4.1.3 status messages 1.4.10 reflow 1.4.4 resize text dialog popover live region"
              />
            </div>
          </section>
        </article>
      </div>
    </>
  )
}
