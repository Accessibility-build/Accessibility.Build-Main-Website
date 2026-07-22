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
  TextSearch,
  Keyboard,
  ShieldCheck,
  ListChecks,
  Bug,
  Layers,
  ChevronsUpDown,
  ListFilter,
  Code2,
  MousePointer,
  AlertTriangle,
} from "lucide-react"

const pageTitle = "Accessible Combobox & Autocomplete Guide (WAI-ARIA)"
const pageDescription =
  "Build an accessible combobox and autocomplete the right way: the role=combobox on the input, aria-expanded, aria-controls, aria-autocomplete, and the aria-activedescendant focus model that keeps focus in the input while arrow keys move a virtual highlight — with copy-ready HTML, JavaScript, and React mapped to WCAG 2.2, a testing workflow, common mistakes, and FAQs."

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords: [
    "accessible combobox",
    "combobox accessibility",
    "accessible autocomplete",
    "aria combobox pattern",
    "aria-activedescendant",
    "role combobox",
    "aria-autocomplete",
    "aria-expanded combobox",
    "aria-controls listbox",
    "typeahead accessibility",
    "autosuggest accessibility",
    "wai-aria combobox",
    "combobox keyboard navigation",
    "react accessible combobox",
    "datalist accessibility",
    "wcag combobox",
    "accessible search suggestions",
  ],
  alternates: {
    canonical: "/guides/accessible-combobox",
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: "/guides/accessible-combobox",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: `/api/og?title=${encodeURIComponent("Accessible Combobox Guide")}&section=Guide`,
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
        url: `/api/og?title=${encodeURIComponent("Accessible Combobox Guide")}&section=Guide`,
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
    name: "Accessible Combobox & Autocomplete Guide",
    url: "https://accessibility.build/guides/accessible-combobox",
  },
]

const faqs = [
  {
    question: "What is a combobox, and how is it different from a select or a search box?",
    answer:
      "A combobox is an input that is paired with a popup — almost always a listbox of options — so the user can either type to filter or pick from the list. It is the pattern behind autocomplete, typeahead, and autosuggest fields. It differs from a native select in that a select only lets you choose from a fixed list with no typing-to-filter and no custom option markup, and it differs from a plain search box in that a combobox exposes a structured set of suggestions the keyboard can move through, with the active suggestion announced. If your control is just a text field that submits a query, it is a search box, not a combobox — do not add combobox roles to it. Add them only when there is a real popup of options the user navigates.",
  },
  {
    question: "Where does role=\"combobox\" go — on the input or a wrapper div?",
    answer:
      "On the input itself. This is the single most important change between old and current ARIA. In ARIA 1.0 the combobox role went on a wrapper element that contained the input; that pattern is obsolete and has poor screen-reader support today. Since ARIA 1.1 and refined in 1.2, role=\"combobox\" belongs on the focusable text input (or on a button for a select-only combobox). The input then carries aria-expanded, aria-controls pointing at the popup, and aria-autocomplete. If you are copying a snippet that wraps an input in <div role=\"combobox\">, it is outdated — move the role onto the input.",
  },
  {
    question: "What does aria-activedescendant do, and why not just move focus into the list?",
    answer:
      "aria-activedescendant is the mechanism that makes a combobox work. Real DOM focus stays on the input the whole time so the user can keep typing; aria-activedescendant on the input points at the id of the option that is currently \"active\" (visually highlighted). When the user presses the Down arrow, you do not move focus — you change which option id aria-activedescendant references and move a CSS highlight class to match. The screen reader announces that option as if it were focused, but the caret never leaves the input. Moving real focus into the listbox instead would stop the user from typing and would break the whole editable-combobox interaction, so the pattern deliberately uses a virtual focus via aria-activedescendant.",
  },
  {
    question: "Can I use the native <datalist> element instead of building an ARIA combobox?",
    answer:
      "Sometimes, and you should consider it first. An <input> with a linked <datalist> gives you a browser-native autocomplete with zero JavaScript and reasonable keyboard and screen-reader support. It is a good fit for simple \"suggest from a list of plain strings\" cases like a country field. Its limits are real, though: you cannot style the dropdown or its options, options can only be plain text (no two-line results, icons, or grouping), the filtering and announcement behavior is inconsistent across browsers and screen readers, and you cannot control when the list opens. When you need styled results, rich option content, async suggestions, or predictable behavior across assistive technology, build the ARIA combobox — but reach for <datalist> when its constraints are acceptable.",
  },
  {
    question: "How do I announce how many suggestions are available?",
    answer:
      "Use a visually hidden live region — an element with aria-live=\"polite\" — separate from the listbox, and write a short message into it whenever the result count changes, such as \"8 results available\" or \"No results found\". Screen reader users cannot see the list appear, so without this announcement they have no idea whether typing produced any suggestions. Keep the message terse and debounce it so a fast typist is not flooded, and never put the count inside the listbox itself. This is what satisfies WCAG 4.1.3 Status Messages for the pattern, and it is the difference between an autocomplete that feels responsive to a screen reader user and one that feels silent and broken.",
  },
  {
    question: "Should I really build a combobox from scratch, or use a library?",
    answer:
      "For production, use a well-tested headless library. The combobox is the most error-prone ARIA pattern — the interplay of aria-expanded, aria-activedescendant, focus management, filtering, and announcements has many edge cases, and browser and screen-reader quirks are significant. Downshift, React Aria's useComboBox, Headless UI Combobox, and Radix Combobox all implement the pattern correctly and stay updated as ARIA guidance evolves. Build one by hand to understand the mechanics — this guide shows you how — but ship a library so you inherit years of bug fixes for the cases that are hard to test yourself.",
  },
]

const keyboardRows = [
  {
    key: "Down Arrow",
    action:
      "Opens the popup if closed and moves the active option to the first item; if already open, moves to the next option. Focus stays in the input — only aria-activedescendant changes.",
  },
  {
    key: "Up Arrow",
    action:
      "Opens the popup and moves to the last option, or moves to the previous option when open. Wraps or stops at the ends per your design.",
  },
  {
    key: "Enter",
    action:
      "Selects the active option: places its value in the input, closes the popup, and returns focus behavior to plain typing.",
  },
  {
    key: "Escape",
    action:
      "Closes the popup without changing the value. Pressing it again may clear the input, depending on the variant.",
  },
  {
    key: "Alt + Down Arrow",
    action:
      "Opens the popup without moving the active option — a way to reveal suggestions without committing to one.",
  },
  {
    key: "Home / End",
    action:
      "Moves the text caret to the start / end of the input value (an editable combobox is a real text field first).",
  },
  {
    key: "Printable characters",
    action:
      "Typed into the input as normal; your handler filters the options and updates the live-region result count.",
  },
  {
    key: "Tab",
    action:
      "Moves focus out of the combobox. Many implementations also select the active option on Tab; if so, do it predictably.",
  },
]

const attributeRows = [
  {
    element: "The text input",
    role: 'role="combobox"',
    attrs:
      'aria-expanded="true|false", aria-controls="<listbox-id>", aria-autocomplete="none|list|both", aria-activedescendant="<active-option-id>" when open. Labelled with <label for> or aria-labelledby.',
  },
  {
    element: "The popup",
    role: 'role="listbox"',
    attrs:
      'A unique id matching the input’s aria-controls. Given an accessible name (aria-label or aria-labelledby). Removed or hidden when collapsed.',
  },
  {
    element: "Each suggestion",
    role: 'role="option"',
    attrs:
      'A unique id (referenced by aria-activedescendant). aria-selected="true" on the chosen option. Contains the visible option text.',
  },
  {
    element: "Result announcer",
    role: 'aria-live="polite"',
    attrs:
      'A visually hidden region, separate from the listbox, updated with the result count ("8 results available") whenever filtering changes.',
  },
]

const antiPatterns = [
  {
    bad: 'role="combobox" placed on a wrapping <div> around the input.',
    why: "This is the obsolete ARIA 1.0 markup; modern screen readers do not announce it as an editable combobox (4.1.2).",
    fix: 'Put role="combobox" directly on the focusable <input> element, per ARIA 1.2.',
  },
  {
    bad: "Moving real DOM focus into the listbox on Arrow Down.",
    why: "The user can no longer type to filter, and the editable-combobox interaction breaks entirely (2.1.1).",
    fix: "Keep focus on the input; move a virtual highlight with aria-activedescendant instead.",
  },
  {
    bad: "No aria-expanded, or it never updates.",
    why: "The screen reader cannot tell whether the popup is open, so the user does not know suggestions exist (4.1.2).",
    fix: "Toggle aria-expanded between true and false every time the popup opens and closes.",
  },
  {
    bad: "Suggestions are <div>s with click handlers, not role=\"option\" in a listbox.",
    why: "There is no list semantics or option count, and the keyboard cannot reach them (1.3.1, 2.1.1).",
    fix: 'Use role="listbox" with role="option" children, each with a stable id.',
  },
  {
    bad: "The suggestion count is never announced.",
    why: "A screen reader user hears nothing when results appear or disappear — the field feels silent (4.1.3).",
    fix: 'Write "N results available" into a polite aria-live region on every filter change.',
  },
  {
    bad: "The input has only a placeholder, no real label.",
    why: "The placeholder disappears on focus and is not a reliable accessible name (1.3.1, 4.1.2).",
    fix: "Associate a persistent <label> (or aria-labelledby) with the combobox input.",
  },
]

export default function AccessibleComboboxGuidePage() {
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
                    Accessible Combobox
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
                Accessible Combobox &amp; Autocomplete Guide
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Autocomplete is the most misused pattern in ARIA. This guide
                covers <code>role=&quot;combobox&quot;</code> on the input,{" "}
                <code>aria-expanded</code>, <code>aria-autocomplete</code>, and
                the <code>aria-activedescendant</code> focus model that keeps
                focus in the field while the arrow keys move a virtual highlight
                — with copy-ready HTML, JavaScript, and React mapped to WCAG 2.2.
              </p>
            </div>
          </section>

          {/* What & why */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                Why the Combobox Is the Hardest ARIA Pattern to Get Right
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  A combobox is a text input joined to a popup list of
                  suggestions — the pattern behind every search autocomplete,
                  typeahead, tag picker, and country selector on the web. It
                  looks like a search box with a dropdown, so most teams build it
                  like one: a <code>&lt;div&gt;</code> of results under an input,
                  wired with click handlers. That version works for a mouse and
                  is invisible to everyone else. The keyboard cannot reach the
                  suggestions, the screen reader never learns the popup opened,
                  and the number of results is announced to no one.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  What makes the combobox genuinely hard is its focus model.
                  Unlike{" "}
                  <Link href="/guides/accessible-tabs" className="text-blue-600 dark:text-blue-400 hover:underline">
                    tabs
                  </Link>{" "}
                  or a menu, focus must never leave the input — the user has to
                  keep typing while moving through options. The pattern solves
                  this with <code>aria-activedescendant</code>: a virtual focus
                  that highlights an option without the caret ever leaving the
                  field. Get that one idea right and the rest falls into place.
                  The{" "}
                  <a
                    href="https://www.w3.org/WAI/ARIA/apg/patterns/combobox/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    WAI-ARIA Authoring Practices Combobox pattern
                  </a>{" "}
                  defines the roles, states, and keys; this guide turns them into
                  code you can paste in — and shows you when to skip ARIA and let
                  the browser do the work.
                </p>
                <div className="rounded-lg border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 p-5 my-6">
                  <p className="text-sm text-slate-800 dark:text-amber-100 leading-relaxed flex gap-3">
                    <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
                    <span>
                      <strong>Not everything with a dropdown is a combobox.</strong>{" "}
                      A search field that just submits a query is a search box —
                      leave the combobox roles off it. Add them only when there
                      is a real, navigable popup of options. Want a live,
                      hands-on version? Try the interactive{" "}
                      <Link href="/learn/search" className="underline font-medium">
                        accessible search &amp; combobox demo
                      </Link>
                      .
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
                The WCAG 2.2 Criteria a Combobox Must Satisfy
              </h2>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    WCAG 2.2 success criteria that a correctly built combobox or
                    autocomplete satisfies and what each requires
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
                        What the combobox must do
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
                      <td className="px-4 py-3">The input is a combobox, the popup is a listbox, and options are options — all set programmatically.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-1-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.1.1 Keyboard
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Open, filter, move through options, select, and dismiss — all from the keyboard alone.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-4-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.4.3 Focus Order
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Focus stays in the input; the popup does not trap or scatter focus.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-4-7" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.4.7 Focus Visible
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">The input shows a focus ring, and the active option has a clearly visible highlight.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/4-1-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                          4.1.2 Name, Role, Value
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">The combobox exposes its name, role, expanded state, and active-option value.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/4-1-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                          4.1.3 Status Messages
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">The number of available suggestions is announced without moving focus.</td>
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

          {/* Native datalist first */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <ListFilter className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                1. Consider the Native &lt;datalist&gt; First
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                There is no fully native combobox, but there is a native
                autocomplete: an <code>&lt;input&gt;</code> with a linked{" "}
                <code>&lt;datalist&gt;</code>. The browser renders and manages
                the suggestion list, handles the keyboard, and exposes it to
                assistive technology — with no JavaScript and no ARIA. For
                simple &ldquo;suggest from a list of plain strings&rdquo; cases,
                start here.
              </p>
              <pre className="rounded-lg bg-slate-900 text-slate-100 text-sm p-4 overflow-x-auto"><code>{`<!-- Native autocomplete: zero JavaScript, zero ARIA -->
<label for="country">Country</label>
<input id="country" name="country" list="country-options" />

<datalist id="country-options">
  <option value="Australia"></option>
  <option value="Brazil"></option>
  <option value="Canada"></option>
  <option value="Denmark"></option>
</datalist>`}</code></pre>
              <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-5 my-6">
                <p className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  When <code>&lt;datalist&gt;</code> is not enough
                </p>
                <ul className="text-sm text-muted-foreground leading-relaxed space-y-1 list-disc pl-5">
                  <li>You need to style the dropdown or its options — <code>&lt;datalist&gt;</code> is almost entirely unstyleable.</li>
                  <li>Options need rich content — two lines, an icon, a category heading, a &ldquo;no results&rdquo; state.</li>
                  <li>Suggestions are fetched asynchronously as the user types.</li>
                  <li>You need consistent, predictable behavior across browsers and screen readers, which <code>&lt;datalist&gt;</code> does not guarantee.</li>
                </ul>
                <p className="text-sm text-muted-foreground leading-relaxed mt-3">
                  When those apply, build the ARIA combobox below — and match the
                  native behavior as closely as you can.
                </p>
              </div>
            </div>
          </section>

          {/* Anatomy / roles */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Layers className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                2. Anatomy: The Roles, States, and Properties
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                An ARIA combobox has four parts: the input, the popup, the
                options, and a separate live region that announces the result
                count. The most important detail — the one that broke in older
                tutorials — is that <code>role=&quot;combobox&quot;</code> goes{" "}
                <strong className="text-slate-900 dark:text-white">on the
                input itself</strong>, not on a wrapper.
              </p>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    The elements in an ARIA combobox and the roles and attributes
                    each needs
                  </caption>
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">Element</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Role</th>
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
              <p className="text-muted-foreground leading-relaxed mt-6">
                The three <code>aria-autocomplete</code> values describe how
                typing relates to the list:{" "}
                <code>&quot;list&quot;</code> shows filtered suggestions in the
                popup (the common case),{" "}
                <code>&quot;both&quot;</code> also completes the input inline with
                the rest of the top match, and{" "}
                <code>&quot;none&quot;</code> means the list is not filtered by
                what you type. For how each attribute is exposed to assistive
                technology, see the{" "}
                <Link href="/reference/aria" className="text-blue-600 dark:text-blue-400 hover:underline">
                  ARIA roles &amp; attributes reference
                </Link>
                .
              </p>
            </div>
          </section>

          {/* The activedescendant focus model */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <MousePointer className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                3. The Heart of the Pattern: aria-activedescendant
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Every other composite widget you have built moves focus. Tabs and
                menus use{" "}
                <Link href="/guides/focus-management" className="text-blue-600 dark:text-blue-400 hover:underline">
                  roving tabindex
                </Link>{" "}
                — real focus hops from element to element. A combobox cannot do
                that, because the user must keep typing while browsing options.
                So it uses the opposite technique.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Roving tabindex (tabs, menus)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Real DOM focus moves. The focused element changes with{" "}
                      <code>element.focus()</code> and <code>tabindex</code>{" "}
                      flips between <code>0</code> and <code>-1</code>. There is
                      no text field to keep typing into.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Virtual focus (combobox)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Real focus stays on the input.{" "}
                      <code>aria-activedescendant</code> points at the active
                      option&apos;s id, and a CSS class shows the highlight. The
                      screen reader announces that option; the caret never
                      leaves the field.
                    </p>
                  </CardContent>
                </Card>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Concretely: when the popup is open and the user presses{" "}
                <code>Down</code>, you set{" "}
                <code>input.setAttribute(&quot;aria-activedescendant&quot;, optionId)</code>,
                add your <code>.is-active</code> class to that option, and scroll
                it into view. You do{" "}
                <strong className="text-slate-900 dark:text-white">not</strong>{" "}
                call <code>focus()</code> on the option. The referenced option
                must be a real descendant of the listbox the input controls, and
                it must have a stable, unique id.
              </p>
            </div>
          </section>

          {/* Full HTML markup */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Code2 className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                4. The Conformant HTML Markup
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Here is an editable combobox with list autocomplete in its open
                state, with the first option active. Note the{" "}
                <code>role=&quot;combobox&quot;</code> on the input, the paired{" "}
                <code>aria-controls</code> / <code>id</code>, and the separate{" "}
                <code>aria-live</code> region that is not inside the listbox.
              </p>
              <pre className="rounded-lg bg-slate-900 text-slate-100 text-sm p-4 overflow-x-auto"><code>{`<label id="fruit-label" for="fruit">Choose a fruit</label>

<input
  id="fruit"
  role="combobox"
  aria-labelledby="fruit-label"
  aria-controls="fruit-listbox"
  aria-expanded="true"
  aria-autocomplete="list"
  aria-activedescendant="fruit-opt-0"
  autocomplete="off"
  type="text"
/>

<ul id="fruit-listbox" role="listbox" aria-label="Fruit">
  <li id="fruit-opt-0" role="option" aria-selected="true">Apricot</li>
  <li id="fruit-opt-1" role="option">Avocado</li>
  <li id="fruit-opt-2" role="option">Banana</li>
</ul>

<!-- Separate polite live region for the result count -->
<div class="sr-only" aria-live="polite">3 results available</div>`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-4">
                When the popup is closed, set{" "}
                <code>aria-expanded=&quot;false&quot;</code>, remove{" "}
                <code>aria-activedescendant</code>, and hide (or remove) the
                listbox. Setting <code>autocomplete=&quot;off&quot;</code> on the
                input stops the browser&apos;s own autofill dropdown from
                colliding with yours.
              </p>
            </div>
          </section>

          {/* Keyboard model */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Keyboard className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                5. The Keyboard Interaction Model
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Because focus lives in a real text field, ordinary typing, the
                caret keys, and text selection must all keep working. The combobox
                keys layer on top of that — they never take over the input.
              </p>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    Keyboard keys and the action each performs in the combobox
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
                A select-only combobox (no typing, like a styled{" "}
                <code>&lt;select&gt;</code>) uses the same keys, but printable
                characters do first-letter matching instead of filtering, and the
                control is a <code>&lt;button&gt;</code> or a non-editable element
                with <code>role=&quot;combobox&quot;</code> rather than a text
                input.
              </p>
            </div>
          </section>

          {/* Vanilla JS */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Code2 className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                6. Wiring It Up in Vanilla JavaScript
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                This handler shows the core mechanics: filter on input, open and
                close the popup, move the active option with{" "}
                <code>aria-activedescendant</code>, select on{" "}
                <code>Enter</code>, and announce the count. It is deliberately
                minimal so the moving parts are visible.
              </p>
              <pre className="rounded-lg bg-slate-900 text-slate-100 text-sm p-4 overflow-x-auto"><code>{`const input = document.getElementById("fruit")
const listbox = document.getElementById("fruit-listbox")
const status = document.querySelector("[aria-live]")
const ALL = ["Apricot", "Avocado", "Banana", "Cherry", "Date"]
let activeIndex = -1
let options = []

function open() {
  input.setAttribute("aria-expanded", "true")
  listbox.hidden = false
}
function close() {
  input.setAttribute("aria-expanded", "false")
  input.removeAttribute("aria-activedescendant")
  listbox.hidden = true
  activeIndex = -1
}

function render(matches) {
  listbox.innerHTML = ""
  options = matches.map((label, i) => {
    const li = document.createElement("li")
    li.id = "fruit-opt-" + i
    li.role = "option"
    li.textContent = label
    li.addEventListener("click", () => select(i))
    listbox.append(li)
    return li
  })
  status.textContent = matches.length
    ? matches.length + " results available"
    : "No results found"
}

function setActive(i) {
  options.forEach((o) => o.classList.remove("is-active"))
  activeIndex = (i + options.length) % options.length
  const el = options[activeIndex]
  el.classList.add("is-active")
  el.setAttribute("aria-selected", "true")
  input.setAttribute("aria-activedescendant", el.id) // virtual focus
  el.scrollIntoView({ block: "nearest" })
}

function select(i) {
  input.value = options[i].textContent
  close()
}

input.addEventListener("input", () => {
  const q = input.value.toLowerCase()
  render(ALL.filter((x) => x.toLowerCase().includes(q)))
  open()
})

input.addEventListener("keydown", (e) => {
  const isOpen = input.getAttribute("aria-expanded") === "true"
  if (e.key === "ArrowDown") { e.preventDefault(); isOpen ? setActive(activeIndex + 1) : open() }
  else if (e.key === "ArrowUp") { e.preventDefault(); setActive(activeIndex - 1) }
  else if (e.key === "Enter" && activeIndex > -1) { e.preventDefault(); select(activeIndex) }
  else if (e.key === "Escape") { close() }
})`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Two details matter most:{" "}
                <code>setActive()</code> only ever changes{" "}
                <code>aria-activedescendant</code> and a class — it never calls{" "}
                <code>focus()</code> — and the result count is written into the
                polite live region on every filter, satisfying{" "}
                <Link href="/wcag/4-1-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                  4.1.3 Status Messages
                </Link>
                . Debounce that announcement for fast typists.
              </p>
            </div>
          </section>

          {/* React */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Code2 className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                7. In React: Reach for a Headless Library
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The combobox is the one pattern where hand-rolling in production
                is rarely worth it. The edge cases — async results, composition
                events for IME input, screen-reader quirks, virtualized long
                lists — are exactly what a mature library has already solved.
                Prefer a headless one so you keep full control of the markup and
                styling while inheriting correct semantics and keyboard handling.
              </p>
              <pre className="rounded-lg bg-slate-900 text-slate-100 text-sm p-4 overflow-x-auto"><code>{`// React Aria (Adobe) — correct ARIA combobox, your own styling
import { useComboBoxState } from "react-stately"
import { useComboBox, useFilter } from "react-aria"

function FruitCombobox(props) {
  const { contains } = useFilter({ sensitivity: "base" })
  const state = useComboBoxState({ ...props, defaultFilter: contains })
  const inputRef = React.useRef(null)
  const listBoxRef = React.useRef(null)
  const popoverRef = React.useRef(null)
  const { inputProps, listBoxProps, labelProps } = useComboBox(
    { ...props, inputRef, listBoxRef, popoverRef }, state,
  )
  // inputProps already includes role="combobox", aria-expanded,
  // aria-controls, aria-activedescendant, and the keyboard handlers.
  return (
    <div>
      <label {...labelProps}>{props.label}</label>
      <input {...inputProps} ref={inputRef} />
      {state.isOpen && <ListBox {...listBoxProps} state={state} listBoxRef={listBoxRef} />}
    </div>
  )
}`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Good options:{" "}
                <strong className="text-slate-900 dark:text-white">Downshift</strong>,{" "}
                <strong className="text-slate-900 dark:text-white">React Aria&apos;s useComboBox</strong>,{" "}
                <strong className="text-slate-900 dark:text-white">Headless UI Combobox</strong>, and{" "}
                <strong className="text-slate-900 dark:text-white">Radix</strong>.
                The{" "}
                <Link href="/guides/react-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">
                  React accessibility guide
                </Link>{" "}
                covers <code>useId</code> and live regions; the same libraries
                have equivalents for{" "}
                <Link href="/guides/vue-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Vue
                </Link>{" "}
                and{" "}
                <Link href="/guides/angular-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Angular
                </Link>
                .
              </p>
            </div>
          </section>

          {/* Testing */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Bug className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                How to Test an Accessible Combobox
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Automated scanners confirm the roles exist and{" "}
                <code>aria-controls</code> resolves, but only a manual pass proves
                the focus model and announcements actually work. Run this on every
                combobox:
              </p>
              <ol className="space-y-3 text-muted-foreground leading-relaxed list-decimal pl-6">
                <li>
                  <strong className="text-slate-900 dark:text-white">Operate it with the keyboard only.</strong>{" "}
                  Tab to the input, type to filter, arrow through options, Enter to
                  select, Escape to dismiss — no mouse, no dead ends.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Watch the caret.</strong>{" "}
                  As you arrow through options, the text cursor must stay in the
                  input. If focus jumps into the list, the{" "}
                  <code>aria-activedescendant</code> model is broken.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Listen with a screen reader.</strong>{" "}
                  You should hear &ldquo;combobox,&rdquo; the expanded state, each
                  active option as you arrow, and the result count when it changes.
                  Verify with the{" "}
                  <Link href="/guides/screen-reader-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                    screen reader testing guide
                  </Link>
                  .
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Filter to zero results.</strong>{" "}
                  A &ldquo;No results found&rdquo; message is announced, and there
                  is no stale active option left behind.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Check the label.</strong>{" "}
                  The combobox has a real, persistent accessible name — not just a
                  placeholder.
                </li>
              </ol>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Then layer automated checks on top with{" "}
                <code>axe-core</code>, and see{" "}
                <Link href="/guides/automated-vs-manual-accessibility-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                  automated vs manual testing
                </Link>{" "}
                for where each fits. Scan the live page with the{" "}
                <Link href="/tools/url-accessibility-auditor" className="text-blue-600 dark:text-blue-400 hover:underline">
                  URL accessibility auditor
                </Link>
                .
              </p>
            </div>
          </section>

          {/* Anti-patterns */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                Common Combobox Mistakes &amp; How to Fix Them
              </h2>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    Common accessible-combobox anti-patterns, why they fail, and
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
                Accessible Combobox Checklist
              </h2>
              <ol className="space-y-4 text-muted-foreground leading-relaxed list-decimal pl-6">
                <li>
                  <strong className="text-slate-900 dark:text-white">Right pattern.</strong>{" "}
                  There is a real, navigable popup of options — not just a search
                  field. If <code>&lt;datalist&gt;</code> fits, use it.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Role on the input.</strong>{" "}
                  <code>role=&quot;combobox&quot;</code> is on the focusable input,
                  not a wrapper, with <code>aria-controls</code> to the listbox.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">State is live.</strong>{" "}
                  <code>aria-expanded</code> flips true/false as the popup opens
                  and closes.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Virtual focus.</strong>{" "}
                  Arrow keys move <code>aria-activedescendant</code>; real focus
                  never leaves the input.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Options are options.</strong>{" "}
                  <code>role=&quot;listbox&quot;</code> with{" "}
                  <code>role=&quot;option&quot;</code> children, each with a stable
                  id and <code>aria-selected</code> on the chosen one.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Count announced.</strong>{" "}
                  A polite <code>aria-live</code> region reports results (
                  <Link href="/wcag/4-1-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                    4.1.3
                  </Link>
                  ).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Real label.</strong>{" "}
                  A persistent accessible name via <code>&lt;label&gt;</code> or{" "}
                  <code>aria-labelledby</code>.
                </li>
              </ol>
              <p className="text-muted-foreground leading-relaxed mt-6">
                Work through the full{" "}
                <Link href="/checklists/wcag-2-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                  WCAG 2.2 checklist
                </Link>{" "}
                to see the combobox in the context of every other requirement.
              </p>
            </div>
          </section>

          {/* CTA */}
          <section className="py-12 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <div className="rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20 p-8 text-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  Check Your Combobox on a Live Page
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6 max-w-lg mx-auto">
                  Scan any page with our free axe-core-powered auditor to catch a
                  missing <code>aria-expanded</code>, a broken{" "}
                  <code>aria-controls</code> target, or an input that is not a real
                  combobox — then run the manual keyboard pass above.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button asChild size="lg" className="gap-2">
                    <Link href="/tools/url-accessibility-auditor">
                      Scan a Page Now
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="gap-2">
                    <Link href="/learn/search">
                      Try the Interactive Demo
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
                content="accessible combobox autocomplete aria-activedescendant role combobox aria-expanded aria-controls aria-autocomplete listbox option typeahead autosuggest datalist search suggestions keyboard navigation focus management react combobox screen reader status messages live region wcag 4.1.2 4.1.3 2.1.1 aria pattern tabs accordion forms"
                title="Related Guides & Tools"
                maxItems={6}
                showDescriptions={true}
                excludeUrl="/guides/accessible-combobox"
              />
            </div>
          </section>
        </article>
      </div>
    </>
  )
}
