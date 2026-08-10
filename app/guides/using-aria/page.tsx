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

const pageTitle = "How to Use ARIA: Roles, States & Properties (The Right Way)"
const pageDescription =
  "Learn to use ARIA correctly instead of making things worse. The five rules of ARIA, when native HTML is the better choice, roles versus states versus properties, accessible names (aria-label vs aria-labelledby vs aria-describedby), landmark roles, the aria-hidden traps that break keyboard users, live regions, and the most common ARIA mistakes from real-world data, all mapped to WCAG 2.2 with copy-ready code."

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords: [
    "how to use aria",
    "using aria",
    "wai-aria",
    "aria roles states and properties",
    "aria roles",
    "five rules of aria",
    "rules of aria",
    "when not to use aria",
    "no aria is better than bad aria",
    "aria-label vs aria-labelledby",
    "aria-labelledby",
    "aria-describedby",
    "aria-hidden",
    "aria landmark roles",
    "aria live regions",
    "accessible name computation",
    "aria best practices",
    "wai-aria guide",
    "aria accessibility",
    "aria attributes",
  ],
  alternates: {
    canonical: "/guides/using-aria",
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: "/guides/using-aria",
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
    name: "How to Use ARIA",
    url: "https://accessibility.build/guides/using-aria",
  },
]

const faqs = [
  {
    question: "What is ARIA and what does it actually do?",
    answer:
      "ARIA stands for Accessible Rich Internet Applications. It is a set of HTML attributes, roles, states, and properties, that adjust the accessibility tree: the structured description of your page that browsers hand to assistive technology such as screen readers. That is the whole of what ARIA does. It changes what a screen reader announces. It does not add any behavior, keyboard support, focus management, or styling of its own. Adding role=\"button\" to a div makes a screen reader call it a button, but it does not make the div focusable, clickable by keyboard, or operable with Space and Enter. You still have to build all of that yourself. Because ARIA only changes semantics, using it wrongly makes a screen reader announce something that is not true, which is often worse than adding nothing at all.",
  },
  {
    question: "Why do pages that use ARIA have more accessibility errors?",
    answer:
      "The WebAIM Million analysis of the top one million home pages found that pages using ARIA averaged about 59 detected errors each, compared with about 42 on pages with no ARIA, roughly 40 percent more. That association is partly because ARIA-heavy pages tend to be more complex, but it also reflects a real pattern: ARIA is frequently applied incorrectly. A broken aria-labelledby reference, an aria-hidden on a focusable control, or a role that contradicts the element it sits on all create new failures that would not exist without the ARIA. The lesson is not to avoid ARIA, which is essential for custom widgets, but to treat every attribute as a promise your markup and JavaScript must keep. Used with discipline, ARIA is indispensable; sprinkled on for reassurance, it is a liability.",
  },
  {
    question: "What are the five rules of ARIA?",
    answer:
      "The W3C Using ARIA document sets out five rules. One: if a native HTML element or attribute already has the semantics and behavior you need, use it instead of recreating it with ARIA. Two: do not change native semantics unless you really have to, so do not put role=\"tab\" on a heading. Three: all interactive ARIA controls must be usable with the keyboard. Four: do not put role=\"presentation\" or aria-hidden=\"true\" on a focusable element, because that creates a control a keyboard user can reach but a screen reader cannot announce. Five: every interactive element must have an accessible name. If you follow only these five rules, you will avoid the large majority of ARIA mistakes.",
  },
  {
    question: "When should I not use ARIA?",
    answer:
      "Do not use ARIA when a native HTML element already does the job. A <button> is a better button than a <div role=\"button\">, because the browser gives you the role, keyboard operation, focus, and events for free. A native <nav>, <main>, <input type=\"checkbox\">, or <select> is more robust and better supported than any ARIA reconstruction. The saying no ARIA is better than bad ARIA captures the priority: correct native HTML beats ARIA, ARIA beats nothing, and incorrect ARIA is the worst of the three because it actively misinforms assistive technology. Reach for ARIA only when there is no native element for what you are building, such as a tab set, a combobox, a tree, or a live region.",
  },
  {
    question: "What is the difference between aria-label, aria-labelledby, and aria-describedby?",
    answer:
      "All three influence what a screen reader says, but they play different roles. aria-labelledby sets the accessible name by pointing at the id of visible text already on the page, and it wins over every other naming source. aria-label sets the accessible name from a string you write in the attribute, and it is for controls that have no visible text, such as an icon-only button. aria-describedby does not set the name at all; it adds an extra description, announced after the name, and is meant for hints, formatting instructions, or error messages. A good rule: prefer visible text referenced by aria-labelledby, use aria-label only when there is no visible text, and use aria-describedby for the supporting detail. Note also that aria-label and aria-labelledby are ignored on generic elements such as a plain div or span that has no interactive or landmark role.",
  },
  {
    question: "Does aria-hidden remove an element from the keyboard tab order?",
    answer:
      "No, and this is one of the most damaging ARIA mistakes. aria-hidden=\"true\" removes an element and everything inside it from the accessibility tree, so a screen reader will not announce it, but it does nothing to the visual display or the keyboard tab order. If you put aria-hidden on a link, a button, or any container that holds focusable controls, a keyboard user can still Tab onto those controls, but the screen reader stays silent, so a blind keyboard user lands on a control that seemingly does not exist. Never place aria-hidden on a focusable element or on an ancestor of one. If you genuinely need to hide interactive content, remove it from the tab order too, using the hidden attribute, display:none, or the inert attribute, all of which hide it from sight, from the accessibility tree, and from focus at once.",
  },
  {
    question: "Do I still need semantic HTML if I use ARIA?",
    answer:
      "Yes, more than ever. ARIA sits on top of HTML and only patches the accessibility tree; it does not replace the structure, behavior, and defaults that semantic HTML provides. Headings, lists, landmarks, form labels, buttons, and links carry meaning and behavior that assistive technology, browsers, and search engines all rely on, and that ARIA cannot fully reproduce. The most robust and maintainable pattern is semantic HTML as the foundation, with ARIA added only to fill the specific gaps native elements cannot, such as the state of a custom widget or an announcement in a live region. If you find yourself rebuilding a native element out of divs and ARIA, that is usually a sign to step back and use the native element.",
  },
  {
    question: "Will automated tools catch my ARIA mistakes?",
    answer:
      "They catch some, but not the most important ones. Scanners such as axe and WAVE reliably flag ARIA that is invalid or broken: misspelled attributes, non-existent role values, aria-labelledby or aria-describedby pointing at ids that do not exist, required parent or child roles that are missing, and aria-hidden on a focusable element. What they cannot judge is ARIA that is valid but wrong: a role=\"button\" on something that should be a link, an aria-label that contradicts the visible text, or a state such as aria-expanded that your JavaScript never updates. Those only surface when a person tests the page with a keyboard and a screen reader and inspects the accessibility tree in the browser developer tools. Automated testing is a first pass for ARIA, never the last word.",
  },
]

const antiPatterns = [
  {
    bad: "Rebuilding a native control out of a div plus an ARIA role.",
    why: "A <div role=\"button\"> has the role but none of the behavior: no focus, no keyboard, no events. You have to add all of it, and you usually miss some (violates rule 1, and 2.1.1).",
    fix: "Use the native element. A real <button> or <a href> gives you role, keyboard, focus, and events with zero ARIA.",
  },
  {
    bad: "aria-hidden=\"true\" on a focusable element or its container.",
    why: "The element stays in the tab order but vanishes from the accessibility tree, so a keyboard user reaches a control the screen reader never announces (rule 4).",
    fix: "Remove interactive content from focus too. Use the hidden attribute, display:none, or the inert attribute; reserve aria-hidden for decorative, non-focusable content.",
  },
  {
    bad: "aria-labelledby or aria-describedby pointing at an id that does not exist.",
    why: "A broken reference produces no name or description at all, so the control is left unnamed. This is one of the most common detected ARIA errors in the wild.",
    fix: "Confirm every referenced id is present and unique in the DOM, and keep the reference in sync when content is conditionally rendered.",
  },
  {
    bad: "aria-label on a plain div, span, or other element with no role.",
    why: "Generic elements without an interactive or landmark role do not take an accessible name, so the label is silently ignored and the content is lost.",
    fix: "Put the label on a real interactive element or landmark, or give the element the appropriate role first, then name it.",
  },
  {
    bad: "An accessible name that does not match the visible text.",
    why: "aria-label=\"Submit\" on a button that reads \"Send\" fails Label in Name (2.5.3): a speech-input user says \"Send\" and nothing happens.",
    fix: "Make the accessible name contain the visible label. Prefer aria-labelledby to the visible text, or match the aria-label to it exactly.",
  },
  {
    bad: "A widget role whose state is never updated in JavaScript.",
    why: "role=\"switch\" or aria-expanded that stays false while the control visibly changes tells the screen reader the opposite of what is true (fails 4.1.2).",
    fix: "Update the state attribute in the same code that changes the visual state, so aria-checked and aria-expanded always reflect reality.",
  },
  {
    bad: "Redundant roles on native elements: <button role=\"button\">, <nav role=\"navigation\">.",
    why: "The role duplicates what the element already exposes. It adds noise, and if the element and role ever disagree, the ARIA wins and can mislead.",
    fix: "Delete the redundant role. Native elements already carry their role; only add a role when you are changing or supplying semantics HTML cannot.",
  },
]

export default function UsingAriaGuidePage() {
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
                    How to Use ARIA
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
                How to Use ARIA: Roles, States &amp; Properties
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                ARIA is the most misused tool in accessibility. It does exactly
                one thing, adjust what a screen reader announces, and it adds no
                behavior of its own, so a wrong attribute makes your interface
                lie to assistive technology. This guide teaches the discipline
                that makes you the exception: the five rules of ARIA, when native
                HTML wins, how roles, states, and properties really work,
                accessible names, landmarks, the aria-hidden traps, and the
                mistakes that show up most in the wild. Mapped to WCAG 2.2, with
                copy-ready code.
              </p>
            </div>
          </section>

          {/* The evidence hook / what ARIA is */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                ARIA Changes Semantics, Nothing Else
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  ARIA (Accessible Rich Internet Applications) is a set of
                  attributes, <strong className="text-slate-900 dark:text-white">roles</strong>,{" "}
                  <strong className="text-slate-900 dark:text-white">states</strong>, and{" "}
                  <strong className="text-slate-900 dark:text-white">properties</strong>,
                  that modify the{" "}
                  <strong className="text-slate-900 dark:text-white">
                    accessibility tree
                  </strong>
                  : the structured model of your page that the browser builds and
                  hands to a screen reader or other assistive technology. Adjusting
                  that model is the entire job of ARIA. It does not make anything
                  focusable, keyboard operable, or clickable, and it changes no
                  pixels on screen.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  That single fact explains most ARIA failures. When you write{" "}
                  <code>&lt;div role=&quot;button&quot;&gt;</code>, a screen reader
                  will announce &ldquo;button,&rdquo; but the div is still not in
                  the tab order, still ignores the keyboard, and still fires no
                  activation on Enter or Space. You have promised a button and
                  delivered a decoration. A native{" "}
                  <code>&lt;button&gt;</code> would have given you the role, the
                  focusability, the keyboard behavior, and the click and key
                  events, all for free.
                </p>
                <div className="not-prose rounded-lg border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950/30 p-5 my-6">
                  <p className="text-sm font-semibold text-blue-900 dark:text-blue-200 mb-2">
                    The evidence: ARIA is associated with more errors, not fewer
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    In the{" "}
                    <Link
                      href="/research/state-of-accessibility"
                      className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                    >
                      WebAIM Million
                    </Link>{" "}
                    analysis of the top one million home pages, pages that used
                    ARIA averaged{" "}
                    <strong className="text-slate-900 dark:text-white">
                      59.1 detected errors
                    </strong>{" "}
                    each, versus{" "}
                    <strong className="text-slate-900 dark:text-white">42</strong>{" "}
                    on pages with no ARIA, about 40 percent more. Some of that gap
                    is greater page complexity, but a large part is ARIA applied
                    incorrectly. The takeaway is not to avoid ARIA, it is essential
                    for custom widgets, but to treat every attribute as a promise
                    your markup and JavaScript have to keep. That discipline is
                    what this guide is about.
                  </p>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Hold on to one priority ordering as you read, because everything
                  else follows from it:{" "}
                  <strong className="text-slate-900 dark:text-white">
                    correct native HTML beats ARIA, ARIA beats nothing, and
                    incorrect ARIA is worse than nothing
                  </strong>
                  , because it actively tells assistive technology something false.
                  This is the meaning of the community maxim{" "}
                  <em>no ARIA is better than bad ARIA</em>.
                </p>
              </div>
            </div>
          </section>

          {/* WCAG mapping */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <ShieldCheck className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                Which WCAG Criteria ARIA Serves
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                ARIA is how you satisfy the criteria that require correct semantics
                for assistive technology. The highlighted row,{" "}
                <Link href="/wcag/4-1-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                  4.1.2 Name, Role, Value
                </Link>
                , is the criterion ARIA exists to serve. Note the last row: ARIA
                does not make anything keyboard operable, so{" "}
                <Link href="/wcag/2-1-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                  2.1.1 Keyboard
                </Link>{" "}
                remains a separate obligation you meet in JavaScript.
              </p>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    WCAG 2.2 success criteria that ARIA helps you meet, their
                    conformance level, and the ARIA that applies
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
                        How ARIA applies
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                    <tr className="bg-blue-50/60 dark:bg-blue-950/20">
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/4-1-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                          4.1.2 Name, Role, Value
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Every control exposes a role, an accessible name, and its states and values. ARIA supplies the role and state for custom widgets that no native element covers.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-3-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          1.3.1 Info and Relationships
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Structure and relationships are conveyed in code. Landmark roles, aria-labelledby, and grouping roles expose relationships that visual layout alone does not.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/4-1-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                          4.1.3 Status Messages
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">Status updates are announced without moving focus. aria-live, role=status, and role=alert are the mechanism.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-5-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.5.3 Label in Name
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">The accessible name must contain the visible label text. An aria-label that omits or contradicts the visible words fails this.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-4-6" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.4.6 Headings and Labels
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">Names describe purpose. Whether the name comes from text, aria-label, or aria-labelledby, it has to be meaningful.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/3-3-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          3.3.1 Error Identification
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Errors are identified in text and tied to the field with aria-invalid and aria-describedby so a screen reader announces them.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-1-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          1.1.1 Non-text Content
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Meaningful non-text content has a text alternative. role=img with aria-label names an inline SVG; aria-hidden hides a decorative one.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-1-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.1.1 Keyboard
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">ARIA does not provide this. A custom widget with the right roles still needs keyboard handlers and focus management written by hand.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-muted-foreground leading-relaxed mt-4 text-sm">
                For the wording of every criterion, browse the{" "}
                <Link
                  href="/wcag"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  WCAG 2.2 reference
                </Link>
                . For a lookup of every role and attribute, the interactive{" "}
                <Link
                  href="/reference/aria"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  ARIA roles &amp; attributes reference
                </Link>{" "}
                is the companion to this guide.
              </p>
            </div>
          </section>

          {/* 1. The five rules of ARIA */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                1. The Five Rules of ARIA
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The W3C{" "}
                  <em>Using ARIA</em> document distills correct usage into five
                  rules. Internalize them and you will avoid the large majority of
                  the mistakes in this guide before you write a single attribute.
                </p>
                <ol className="text-muted-foreground leading-relaxed mb-4 list-decimal pl-6 space-y-3">
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Use native HTML if you can.
                    </strong>{" "}
                    If an element or attribute already has the role, state, and
                    behavior you need, use it rather than recreating it with ARIA.
                    A <code>&lt;button&gt;</code>, <code>&lt;nav&gt;</code>,{" "}
                    <code>&lt;input type=&quot;checkbox&quot;&gt;</code>, and{" "}
                    <code>&lt;select&gt;</code> are more robust than any
                    div-and-ARIA reconstruction.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Do not change native semantics unless you must.
                    </strong>{" "}
                    Do not put <code>role=&quot;tab&quot;</code> on an{" "}
                    <code>&lt;h2&gt;</code>. If you need a heading to also be a tab,
                    nest the semantics (<code>&lt;h2&gt;&lt;button role=&quot;tab&quot;&gt;...&lt;/button&gt;&lt;/h2&gt;</code>)
                    rather than overwriting the heading.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      All interactive ARIA controls must work with the keyboard.
                    </strong>{" "}
                    If you build a <code>role=&quot;slider&quot;</code> or{" "}
                    <code>role=&quot;menuitem&quot;</code>, it has to respond to the
                    expected keys and be reachable in the tab order. See the{" "}
                    <Link href="/guides/keyboard-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">
                      keyboard accessibility
                    </Link>{" "}
                    and{" "}
                    <Link href="/guides/focus-management" className="text-blue-600 dark:text-blue-400 hover:underline">
                      focus management
                    </Link>{" "}
                    guides.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Do not use role=&quot;presentation&quot; or
                      aria-hidden=&quot;true&quot; on a focusable element.
                    </strong>{" "}
                    Doing so creates a control a keyboard user can land on but a
                    screen reader will not announce. This is covered in depth in
                    section 5.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Every interactive element must have an accessible name.
                    </strong>{" "}
                    A control with an empty name is announced only by its role
                    (&ldquo;button,&rdquo; &ldquo;edit&rdquo;), which tells the user
                    nothing about what it does. Section 3 is all about names.
                  </li>
                </ol>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Rules one and two are about restraint, rules three and five are
                  obligations you take on the moment you add a widget role, and
                  rule four is the single most common serious bug. The rest of this
                  guide is these five rules in practice.
                </p>
              </div>
            </div>
          </section>

          {/* 2. Roles, states, and properties */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                2. Roles, States, and Properties
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  ARIA comes in three parts, and knowing which is which tells you
                  how to maintain each one.
                </p>
                <ul className="text-muted-foreground leading-relaxed mb-4 list-disc pl-6 space-y-2">
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Role
                    </strong>{" "}
                    is what the element <em>is</em>:{" "}
                    <code>role=&quot;dialog&quot;</code>,{" "}
                    <code>role=&quot;tablist&quot;</code>,{" "}
                    <code>role=&quot;navigation&quot;</code>. A role is usually set
                    once and rarely changes. It defines what the element means and
                    what states and properties are allowed on it.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      States
                    </strong>{" "}
                    are the current, changing condition of a control:{" "}
                    <code>aria-checked</code>, <code>aria-expanded</code>,{" "}
                    <code>aria-selected</code>, <code>aria-pressed</code>,{" "}
                    <code>aria-disabled</code>, <code>aria-current</code>. These
                    change as the user interacts, and{" "}
                    <strong className="text-slate-900 dark:text-white">
                      your JavaScript must update them
                    </strong>{" "}
                    in lockstep with the visual change, or the screen reader will
                    announce the wrong thing.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Properties
                    </strong>{" "}
                    are more stable characteristics and relationships:{" "}
                    <code>aria-label</code>, <code>aria-labelledby</code>,{" "}
                    <code>aria-describedby</code>, <code>aria-haspopup</code>,{" "}
                    <code>aria-controls</code>, <code>aria-required</code>. They
                    tend to be set once and left alone, though some, like{" "}
                    <code>aria-controls</code>, can update.
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Roles fall into a few families. The ones you touch most are{" "}
                  <strong className="text-slate-900 dark:text-white">widget roles</strong>{" "}
                  (button, tab, slider, menuitem, the interactive controls),{" "}
                  <strong className="text-slate-900 dark:text-white">landmark roles</strong>{" "}
                  (navigation, main, banner, the page regions, covered in section 4),{" "}
                  <strong className="text-slate-900 dark:text-white">document structure roles</strong>{" "}
                  (list, listitem, heading, table), and{" "}
                  <strong className="text-slate-900 dark:text-white">live region roles</strong>{" "}
                  (status, alert, log, covered in section 6). One family you should
                  never write as a value is{" "}
                  <strong className="text-slate-900 dark:text-white">abstract roles</strong>{" "}
                  such as <code>widget</code>, <code>composite</code>, or{" "}
                  <code>input</code>; they exist only to organize the specification
                  and are ignored on real elements.
                </p>
                <div className="not-prose rounded-lg border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/20 p-5 my-6">
                  <p className="text-sm font-semibold text-amber-900 dark:text-amber-200 mb-2">
                    A role overrides every native semantic on the element
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    This is the sharpest edge of ARIA. When you add a role, the
                    element&rsquo;s built-in meaning is <em>replaced</em>, not
                    supplemented. <code>&lt;a href role=&quot;button&quot;&gt;</code>{" "}
                    stops being announced as a link. <code>&lt;ul role=&quot;menu&quot;&gt;</code>{" "}
                    is no longer a list, and its <code>&lt;li&gt;</code> children
                    stop being list items. <code>&lt;table role=&quot;presentation&quot;&gt;</code>{" "}
                    loses all of its rows-and-cells meaning. That is sometimes
                    exactly what you want, but it means a careless role silently
                    strips real semantics, so add one only when you intend to change
                    what the element is.
                  </p>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Here is a state kept in sync, the way rule three of section 2
                  demands. The visual change and the ARIA change happen together, in
                  one place:
                </p>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`<button type="button" aria-expanded="false" aria-controls="panel">
  Details
</button>
<div id="panel" hidden>...</div>

<script>
  const btn = document.querySelector('button[aria-controls="panel"]');
  const panel = document.getElementById('panel');
  btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') === 'true';
    // Flip the visual state and the ARIA state in the same step
    btn.setAttribute('aria-expanded', String(!open));
    panel.hidden = open;
  });
</script>`}</code></pre>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Accessible names */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                3. Accessible Names: aria-label vs aria-labelledby vs aria-describedby
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The <strong className="text-slate-900 dark:text-white">accessible name</strong>{" "}
                  is the string a screen reader announces to identify a control, and
                  it is rule five of ARIA. The browser computes it through the{" "}
                  <strong className="text-slate-900 dark:text-white">
                    accessible name computation
                  </strong>
                  , which checks sources in a fixed priority order and uses the
                  first one it finds:
                </p>
                <ol className="text-muted-foreground leading-relaxed mb-4 list-decimal pl-6 space-y-1">
                  <li>
                    <code>aria-labelledby</code> (references the id of visible text;
                    wins over everything)
                  </li>
                  <li>
                    <code>aria-label</code> (a string you write in the attribute)
                  </li>
                  <li>
                    The native label: a <code>&lt;label&gt;</code> element, the
                    element&rsquo;s own text content, or an <code>alt</code>{" "}
                    attribute
                  </li>
                  <li>
                    <code>title</code> or <code>placeholder</code> as a last resort
                    (fragile, avoid relying on these)
                  </li>
                </ol>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                  Choosing between the three
                </h3>
                <ul className="text-muted-foreground leading-relaxed mb-4 list-disc pl-6 space-y-2">
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      aria-labelledby
                    </strong>{" "}
                    is your first choice when the label is{" "}
                    <em>already visible</em> on the page. It points at one or more
                    ids, and the browser stitches their text together, so the
                    accessible name stays perfectly in sync with what sighted users
                    read.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      aria-label
                    </strong>{" "}
                    is for controls with <em>no visible text</em>, the classic case
                    being an icon-only button. Because the string is invisible, it
                    is easy to let it drift out of date, and some browser translation
                    features have historically skipped it, so do not use it when
                    visible text exists.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      aria-describedby
                    </strong>{" "}
                    does <em>not</em> set the name. It adds an extra description,
                    announced after the name following a short pause, and it is for
                    hints, format requirements, and error messages, not for
                    identifying the control.
                  </li>
                </ul>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`<!-- Best: name from visible text, via aria-labelledby -->
<h2 id="billing">Billing address</h2>
<section role="group" aria-labelledby="billing"> ... </section>

<!-- Fine: no visible text, so aria-label names the icon button -->
<button type="button" aria-label="Close dialog">
  <svg aria-hidden="true" focusable="false"> ... </svg>
</button>

<!-- Name + description: the label names it, describedby adds the hint -->
<label for="pw">Password</label>
<input id="pw" type="password" aria-describedby="pw-hint">
<p id="pw-hint">At least 12 characters.</p>`}</code></pre>
                </div>
                <div className="not-prose rounded-lg border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/20 p-5 my-6">
                  <p className="text-sm font-semibold text-amber-900 dark:text-amber-200 mb-2">
                    Two traps that quietly lose the name
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                    <strong className="text-slate-900 dark:text-white">
                      Generic elements do not take a name.
                    </strong>{" "}
                    <code>aria-label</code> and <code>aria-labelledby</code> are
                    ignored on a plain <code>&lt;div&gt;</code> or{" "}
                    <code>&lt;span&gt;</code> that has no interactive or landmark
                    role. The label simply disappears. Put it on a real control, or
                    give the element a role first.
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    <strong className="text-slate-900 dark:text-white">
                      The name must contain the visible label.
                    </strong>{" "}
                    <Link href="/wcag/2-5-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                      2.5.3 Label in Name
                    </Link>{" "}
                    means a button that visually reads &ldquo;Send&rdquo; must not
                    have <code>aria-label=&quot;Submit&quot;</code>: a speech-input
                    user who says &ldquo;click Send&rdquo; would find nothing to
                    click. Match the accessible name to the visible words.
                  </p>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Name computation is the heart of{" "}
                  <Link href="/wcag/4-1-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                    4.1.2 Name, Role, Value
                  </Link>
                  ; that page walks the algorithm in more detail with a testing
                  workflow.
                </p>
              </div>
            </div>
          </section>

          {/* 4. Landmark roles */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                4. Landmark Roles: Structure You Mostly Get for Free
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Landmarks let screen reader users jump straight to the major
                  regions of a page, the navigation, the main content, the footer,
                  instead of reading through everything. The good news is that HTML5
                  gives you the important landmark roles automatically, so in most
                  cases you should not write the role at all:
                </p>
                <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 my-4">
                  <table className="w-full text-sm text-left">
                    <caption className="sr-only">
                      HTML5 elements and the ARIA landmark role each one exposes
                      automatically
                    </caption>
                    <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
                      <tr>
                        <th scope="col" className="px-4 py-3 font-semibold">HTML element</th>
                        <th scope="col" className="px-4 py-3 font-semibold">Implicit landmark role</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                      <tr>
                        <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white"><code>&lt;header&gt;</code> (top level)</th>
                        <td className="px-4 py-3"><code>banner</code></td>
                      </tr>
                      <tr>
                        <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white"><code>&lt;nav&gt;</code></th>
                        <td className="px-4 py-3"><code>navigation</code></td>
                      </tr>
                      <tr>
                        <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white"><code>&lt;main&gt;</code></th>
                        <td className="px-4 py-3"><code>main</code></td>
                      </tr>
                      <tr>
                        <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white"><code>&lt;aside&gt;</code></th>
                        <td className="px-4 py-3"><code>complementary</code></td>
                      </tr>
                      <tr>
                        <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white"><code>&lt;footer&gt;</code> (top level)</th>
                        <td className="px-4 py-3"><code>contentinfo</code></td>
                      </tr>
                      <tr>
                        <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white"><code>&lt;search&gt;</code></th>
                        <td className="px-4 py-3"><code>search</code></td>
                      </tr>
                      <tr>
                        <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white"><code>&lt;section&gt;</code> with a name</th>
                        <td className="px-4 py-3"><code>region</code></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You only need to write a landmark role explicitly when you are
                  stuck with non-semantic markup you cannot change, or when the
                  native element is not yet available in your target browsers (the{" "}
                  <code>&lt;search&gt;</code> element is recent, so{" "}
                  <code>role=&quot;search&quot;</code> on the form is still a common
                  fallback). Three rules keep landmarks useful:
                </p>
                <ul className="text-muted-foreground leading-relaxed mb-4 list-disc pl-6 space-y-2">
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Exactly one main.
                    </strong>{" "}
                    There should be a single <code>&lt;main&gt;</code> landmark per
                    page, wrapping the primary content.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Name repeated landmarks.
                    </strong>{" "}
                    If a page has more than one <code>&lt;nav&gt;</code> or{" "}
                    <code>&lt;aside&gt;</code>, give each a distinct accessible name
                    with <code>aria-label</code> or <code>aria-labelledby</code>{" "}
                    (&ldquo;Primary,&rdquo; &ldquo;Breadcrumb,&rdquo;
                    &ldquo;Footer&rdquo;) so the user can tell them apart.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Do not put the role name in the label.
                    </strong>{" "}
                    Write <code>aria-label=&quot;Primary&quot;</code>, not{" "}
                    <code>aria-label=&quot;Primary navigation&quot;</code>: the role
                    already says &ldquo;navigation,&rdquo; so the word would be
                    announced twice.
                  </li>
                </ul>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`<header>            <!-- banner -->
  <a href="/">Acme</a>
  <nav aria-label="Primary"> ... </nav>
</header>

<nav aria-label="Breadcrumb"> ... </nav>   <!-- named, so it is distinct -->

<main>              <!-- one per page -->
  <h1>Page title</h1>
  ...
</main>

<footer>            <!-- contentinfo -->
  <nav aria-label="Footer"> ... </nav>
</footer>`}</code></pre>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Landmarks help screen reader users, but keyboard users who do not
                  run a screen reader still need a visible{" "}
                  <strong className="text-slate-900 dark:text-white">
                    skip to main content
                  </strong>{" "}
                  link as the first focusable element, which satisfies{" "}
                  <Link href="/wcag/2-4-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                    2.4.1 Bypass Blocks
                  </Link>
                  . Landmarks and a skip link are complementary, not alternatives.
                </p>
              </div>
            </div>
          </section>

          {/* 5. aria-hidden and the traps */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                5. aria-hidden and How to Hide Things Correctly
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Rule four of ARIA gets its own section because breaking it is the
                  most common serious ARIA bug on the web.{" "}
                  <code>aria-hidden=&quot;true&quot;</code> removes an element{" "}
                  <em>and its entire subtree</em> from the accessibility tree, so a
                  screen reader will not announce it.{" "}
                  <strong className="text-slate-900 dark:text-white">
                    It does not change the visual display, and it does not remove
                    anything from the keyboard tab order.
                  </strong>
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  So if you place <code>aria-hidden=&quot;true&quot;</code> on a link,
                  a button, or any container that holds focusable controls, a
                  keyboard user can still Tab onto those controls, but the screen
                  reader stays completely silent. A blind keyboard user lands on
                  &ldquo;nothing,&rdquo; loses their place, and cannot tell what the
                  control does. Never put <code>aria-hidden</code> on a focusable
                  element or on an ancestor of one. If interactive content must be
                  hidden, remove it from focus at the same time.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The reliable way to reason about this is to know what each hiding
                  technique does to the three planes at once, sight, the
                  accessibility tree, and focus:
                </p>
                <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 my-4">
                  <table className="w-full text-sm text-left">
                    <caption className="sr-only">
                      How each hiding technique affects visibility, the
                      accessibility tree, and keyboard focus
                    </caption>
                    <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
                      <tr>
                        <th scope="col" className="px-4 py-3 font-semibold">Technique</th>
                        <th scope="col" className="px-4 py-3 font-semibold">Visible?</th>
                        <th scope="col" className="px-4 py-3 font-semibold">In a11y tree?</th>
                        <th scope="col" className="px-4 py-3 font-semibold">Focusable?</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                      <tr>
                        <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white"><code>hidden</code> / <code>display:none</code></th>
                        <td className="px-4 py-3">No</td>
                        <td className="px-4 py-3">No</td>
                        <td className="px-4 py-3">No</td>
                      </tr>
                      <tr>
                        <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white"><code>visibility:hidden</code></th>
                        <td className="px-4 py-3">No</td>
                        <td className="px-4 py-3">No</td>
                        <td className="px-4 py-3">No</td>
                      </tr>
                      <tr className="bg-amber-50/60 dark:bg-amber-950/20">
                        <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white"><code>aria-hidden=&quot;true&quot;</code></th>
                        <td className="px-4 py-3">Yes</td>
                        <td className="px-4 py-3">No</td>
                        <td className="px-4 py-3 font-semibold text-amber-700 dark:text-amber-300">Yes (the trap)</td>
                      </tr>
                      <tr>
                        <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white"><code>inert</code> attribute</th>
                        <td className="px-4 py-3">Yes</td>
                        <td className="px-4 py-3">No</td>
                        <td className="px-4 py-3">No</td>
                      </tr>
                      <tr>
                        <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white"><code>.sr-only</code> (clip / off-screen)</th>
                        <td className="px-4 py-3">No</td>
                        <td className="px-4 py-3">Yes</td>
                        <td className="px-4 py-3">Yes</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Read those rows as a toolbox. Use <code>hidden</code> or{" "}
                  <code>display:none</code> to hide something from everyone. Use{" "}
                  <code>inert</code> to keep content visible but non-interactive and
                  unread, which is exactly what you want for the background behind a
                  modal. Reserve <code>aria-hidden=&quot;true&quot;</code> for content
                  that is visible and <em>not</em> focusable, and that would be
                  redundant or noisy to a screen reader, such as a decorative icon
                  sitting beside visible text, or the &ldquo;/&rdquo; separators in a
                  breadcrumb. Use <code>.sr-only</code> for the opposite case: text
                  you want a screen reader to read but not display, like the hidden
                  label on a skip link.
                </p>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`<!-- Correct: decorative icon, not focusable, hidden from the screen reader -->
<button type="button">
  <svg aria-hidden="true" focusable="false"> ... </svg>
  Delete
</button>

<!-- WRONG: aria-hidden on a focusable link = a phantom the keyboard can reach -->
<a href="/cart" aria-hidden="true">Cart</a>

<!-- If a whole region must be hidden, use hidden or inert, not aria-hidden -->
<div inert>...background behind the modal...</div>`}</code></pre>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  One related tool: <code>role=&quot;presentation&quot;</code> (and its
                  synonym <code>role=&quot;none&quot;</code>) strips only the{" "}
                  <em>element&rsquo;s own</em> semantics while keeping its children
                  in the tree, which is how you tell a screen reader to ignore a
                  layout <code>&lt;table&gt;</code> without hiding its contents. That
                  is different from <code>aria-hidden</code>, which removes the whole
                  subtree.
                </p>
              </div>
            </div>
          </section>

          {/* 6. Live regions */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                6. Live Regions: Announcing Change Without Moving Focus
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  When something updates on the page without a full navigation, a
                  saved confirmation, a validation error, a search-result count, a
                  screen reader will not notice unless you tell it to.{" "}
                  <strong className="text-slate-900 dark:text-white">
                    Live regions
                  </strong>{" "}
                  are how ARIA announces these changes politely, without stealing
                  focus. This is the mechanism behind{" "}
                  <Link href="/wcag/4-1-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                    4.1.3 Status Messages
                  </Link>
                  .
                </p>
                <ul className="text-muted-foreground leading-relaxed mb-4 list-disc pl-6 space-y-2">
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      aria-live=&quot;polite&quot;
                    </strong>{" "}
                    (or <code>role=&quot;status&quot;</code>) waits for the screen
                    reader to finish what it is saying, then announces the change.
                    This is the default choice for almost everything.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      aria-live=&quot;assertive&quot;
                    </strong>{" "}
                    (or <code>role=&quot;alert&quot;</code>) interrupts immediately.
                    Reserve it for genuinely urgent, time-sensitive messages such as
                    a submission error, and use it sparingly.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      role=&quot;log&quot;
                    </strong>{" "}
                    is a polite region for content that appends over time, such as a
                    chat transcript.
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The single most important implementation detail:{" "}
                  <strong className="text-slate-900 dark:text-white">
                    the live region must already be in the DOM before you change its
                    text
                  </strong>
                  . If you insert the region and its message at the same time, most
                  screen readers treat it as initial content and stay silent. Render
                  an empty region on load, then write into it.
                </p>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`<!-- Mounted empty on load; you set textContent later -->
<div id="status" role="status" aria-live="polite" class="sr-only"></div>

<script>
  function announce(message) {
    document.getElementById('status').textContent = message;
  }
  // announce('Settings saved.');
</script>`}</code></pre>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Live regions have enough depth to fill their own guide. For the
                  full treatment, including the streaming case and how to re-announce
                  identical messages, see{" "}
                  <Link href="/wcag/4-1-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                    WCAG 4.1.3 Status Messages
                  </Link>
                  , the{" "}
                  <Link href="/guides/accessible-ai-chat" className="text-blue-600 dark:text-blue-400 hover:underline">
                    accessible AI chat guide
                  </Link>{" "}
                  (streaming without flooding the screen reader), and the{" "}
                  <Link href="/guides/accessible-form-validation" className="text-blue-600 dark:text-blue-400 hover:underline">
                    form validation guide
                  </Link>{" "}
                  (announcing errors without double-speaking).
                </p>
              </div>
            </div>
          </section>

          {/* 7. When to reach for a pattern guide (the hub) */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                7. Where ARIA Gets Hard: The Component Patterns
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  ARIA is easy for a single attribute and genuinely hard for a full
                  composite widget, where you have to combine roles, keep several
                  states in sync, manage focus with a roving tabindex or{" "}
                  <code>aria-activedescendant</code>, and wire up the keyboard. The
                  WAI-ARIA Authoring Practices define the correct recipe for each of
                  these, and each has its own build guide here. When you need one of
                  these components, start from its guide rather than assembling the
                  ARIA from memory:
                </p>
                <ul className="text-muted-foreground leading-relaxed mb-4 list-disc pl-6 space-y-1">
                  <li>
                    <Link href="/guides/accessible-tabs" className="text-blue-600 dark:text-blue-400 hover:underline">Tabs</Link>{" "}
                    and{" "}
                    <Link href="/guides/accessible-accordion" className="text-blue-600 dark:text-blue-400 hover:underline">accordions and disclosures</Link>
                  </li>
                  <li>
                    <Link href="/guides/accessible-combobox" className="text-blue-600 dark:text-blue-400 hover:underline">Comboboxes and autocomplete</Link>{" "}
                    and{" "}
                    <Link href="/guides/accessible-listbox" className="text-blue-600 dark:text-blue-400 hover:underline">listboxes</Link>
                  </li>
                  <li>
                    <Link href="/guides/accessible-menu" className="text-blue-600 dark:text-blue-400 hover:underline">Menus and menu buttons</Link>{" "}
                    and{" "}
                    <Link href="/guides/accessible-dialog" className="text-blue-600 dark:text-blue-400 hover:underline">dialogs and modals</Link>
                  </li>
                  <li>
                    <Link href="/guides/accessible-switch" className="text-blue-600 dark:text-blue-400 hover:underline">Switches and toggles</Link>{" "}
                    and{" "}
                    <Link href="/guides/accessible-slider" className="text-blue-600 dark:text-blue-400 hover:underline">sliders and range inputs</Link>
                  </li>
                  <li>
                    <Link href="/guides/accessible-tree-view" className="text-blue-600 dark:text-blue-400 hover:underline">Tree views</Link>{" "}
                    and{" "}
                    <Link href="/guides/accessible-data-grid" className="text-blue-600 dark:text-blue-400 hover:underline">data grids</Link>
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Notice how many of those guides open the same way: with a check on
                  whether you need the ARIA widget at all, because a native control
                  or a simpler pattern is often the right answer. That is rule one in
                  action. If you work in a framework, the{" "}
                  <Link href="/guides/react-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">React</Link>
                  ,{" "}
                  <Link href="/guides/vue-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">Vue</Link>
                  ,{" "}
                  <Link href="/guides/angular-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">Angular</Link>
                  , and{" "}
                  <Link href="/guides/svelte-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">Svelte</Link>{" "}
                  guides show how ARIA binds to reactive state in each one, and why a
                  headless component library often carries this weight better than a
                  hand-rolled widget.
                </p>
              </div>
            </div>
          </section>

          {/* 8. Testing */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                8. Testing Your ARIA
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  ARIA is uniquely easy to get wrong in ways that look fine, so it
                  needs a layered check.
                </p>
                <ul className="text-muted-foreground leading-relaxed mb-4 list-disc pl-6 space-y-2">
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Read the accessibility tree.
                    </strong>{" "}
                    Chrome and Firefox developer tools both show the computed name,
                    role, and states for any element. This is the fastest way to
                    confirm the browser sees what you intended, and to catch a name
                    that resolved to empty.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Run an automated scanner, but know its limits.
                    </strong>{" "}
                    Tools like axe and WAVE reliably flag <em>invalid</em> ARIA:
                    misspelled attributes, non-existent roles, broken{" "}
                    <code>aria-labelledby</code> references, missing required
                    children, and <code>aria-hidden</code> on a focusable element.
                    They cannot flag ARIA that is valid but <em>wrong</em>, such as a
                    role that misrepresents the control or a state your code never
                    updates. See{" "}
                    <Link href="/guides/automated-vs-manual-accessibility-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                      automated vs manual testing
                    </Link>
                    .
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Test with a real screen reader and the keyboard.
                    </strong>{" "}
                    Tab through the interface with a screen reader running and listen
                    to what each control announces, its name, its role, and its
                    changing state. This is the only way to catch the valid-but-wrong
                    class of bug. Follow the{" "}
                    <Link href="/guides/screen-reader-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                      screen reader testing guide
                    </Link>
                    .
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Look up anything you are unsure of.
                    </strong>{" "}
                    The interactive{" "}
                    <Link href="/reference/aria" className="text-blue-600 dark:text-blue-400 hover:underline">
                      ARIA roles and attributes reference
                    </Link>{" "}
                    lists what each role requires and what states it allows, so you
                    can confirm a role has its required parent, children, and
                    properties before you ship it.
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Fold all of this into your broader process with the{" "}
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
                Common ARIA Mistakes &amp; How to Fix Them
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                These are the ARIA errors that show up most often in real-world
                audits and in the WebAIM Million data. Each one comes from a good
                intention applied without the rule behind it.
              </p>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    Common ARIA anti-patterns, why each one fails, and the fix
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
                The ARIA Checklist
              </h2>
              <ol className="space-y-4 text-muted-foreground leading-relaxed list-decimal pl-6">
                <li>
                  <strong className="text-slate-900 dark:text-white">Native first.</strong>{" "}
                  Before adding any role, confirm no native HTML element already does
                  the job. If one does, use it and delete the ARIA.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">No redundant roles.</strong>{" "}
                  Remove roles that just repeat what the element already exposes
                  (<code>&lt;button role=&quot;button&quot;&gt;</code>).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Every control is named.</strong>{" "}
                  Each interactive element has a non-empty accessible name, and the
                  name contains the visible label (2.5.3).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">References resolve.</strong>{" "}
                  Every <code>aria-labelledby</code>, <code>aria-describedby</code>,
                  and <code>aria-controls</code> points at an id that exists and is
                  unique.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">States stay in sync.</strong>{" "}
                  Every <code>aria-expanded</code>, <code>aria-checked</code>,{" "}
                  <code>aria-selected</code>, and <code>aria-pressed</code> is
                  updated by the same code that changes the visual state.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Keyboard works.</strong>{" "}
                  Every interactive ARIA control is reachable and operable by keyboard
                  (2.1.1); ARIA did not provide this, your code did.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">No aria-hidden on focus.</strong>{" "}
                  No <code>aria-hidden=&quot;true&quot;</code> sits on, or wraps, a
                  focusable element; hidden interactive content is also removed from
                  the tab order.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Valid values only.</strong>{" "}
                  No misspelled attributes, no non-existent roles, and no abstract
                  roles used as values.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Landmarks are clean.</strong>{" "}
                  One <code>&lt;main&gt;</code>, repeated landmarks are individually
                  named, and native elements are used instead of explicit roles where
                  possible.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Verified in the tree.</strong>{" "}
                  You checked the computed name, role, and state in the browser
                  accessibility tree and confirmed the announcement with a screen
                  reader.
                </li>
              </ol>
            </div>
          </section>

          {/* CTA */}
          <section className="py-12 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <div className="rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20 p-8 text-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  Get the Semantics Right
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6 max-w-lg mx-auto">
                  Start from the criterion ARIA exists to serve, then keep the
                  interactive reference open while you build.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button asChild size="lg" className="gap-2">
                    <Link href="/wcag/4-1-2">
                      WCAG 4.1.2 Name, Role, Value
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="gap-2">
                    <Link href="/reference/aria">
                      ARIA Roles &amp; Attributes Reference
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
                content="how to use aria wai-aria aria roles states properties five rules of aria when not to use aria no aria is better than bad aria aria-label aria-labelledby aria-describedby accessible name computation aria-hidden landmark roles banner navigation main complementary contentinfo aria live regions role status role alert 4.1.2 name role value 1.3.1 info and relationships 4.1.3 status messages 2.5.3 label in name semantic html accessibility tree screen reader"
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
