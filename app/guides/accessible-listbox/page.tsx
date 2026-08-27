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
  List,
  Keyboard,
  ShieldCheck,
  ListChecks,
  Layers,
  GitBranch,
  AlertTriangle,
  Code2,
  MousePointer2,
  CheckSquare,
  Sparkles,
  Focus,
  Users,
} from "lucide-react"

const pageTitle = "Accessible Listbox Guide: role=listbox & Multi-Select"
const pageDescription =
  "Build an accessible listbox the right way: the role=listbox / option / group structure, single-select where selection follows focus, multi-select with aria-multiselectable and Space to toggle, aria-selected, the roving-tabindex vs aria-activedescendant focus choice, grouped and disabled options, type-ahead, and React — with copy-ready code mapped to WCAG 2.2, plus when a group of checkboxes or a native select is the better choice."

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords: [
    "accessible listbox",
    "role listbox",
    "role option",
    "aria listbox pattern",
    "wai-aria listbox pattern",
    "listbox keyboard navigation",
    "aria-selected",
    "aria-multiselectable",
    "multi-select accessibility",
    "single select listbox",
    "roving tabindex listbox",
    "aria-activedescendant listbox",
    "selection follows focus",
    "accessible multi-select",
    "listbox vs select",
    "listbox vs checkbox group",
    "accessible listbox react",
    "listbox group option",
    "wcag listbox",
  ],
  alternates: {
    canonical: "/guides/accessible-listbox",
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: "/guides/accessible-listbox",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: `/api/og?title=${encodeURIComponent("Accessible Listbox Guide")}&section=Guide`,
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
        url: `/api/og?title=${encodeURIComponent("Accessible Listbox Guide")}&section=Guide`,
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
    name: "Accessible Listbox Guide",
    url: "https://accessibility.build/guides/accessible-listbox",
  },
]

const faqs = [
  {
    question: "What is a listbox, and when should I use role=\"listbox\"?",
    answer:
      "A listbox is a widget that presents a set of choices the user selects from — one option in a single-select listbox, or several in a multi-select one. In ARIA it is a container with role=\"listbox\" holding children with role=\"option\", and the user moves a roving focus through the options with the arrow keys and selects with the state shown by aria-selected. Use it when you need a compact, scrollable list of choices that behaves as a single Tab stop — a settings picker, a list of items to act on, the popup a combobox opens. Do not reach for it as a default: for a handful of visible choices, native radio buttons (choose one) or checkboxes (choose several) are more familiar, need no JavaScript, and are harder to get wrong. A listbox earns its complexity when the options are many, need to scroll, or must live in one Tab stop.",
  },
  {
    question: "What is the difference between a listbox and a combobox?",
    answer:
      "A listbox is the list of options itself; a combobox is a text input paired with a popup — and that popup is usually a listbox. The crucial difference is where keyboard focus lives. In a standalone listbox, DOM focus moves into the list and onto the options (or a roving tabindex does), so the arrow keys act directly on the list. In a combobox, focus must stay in the input so the user can keep typing, so the list cannot take real focus; instead the input uses aria-activedescendant to point at the active option while the caret never leaves the input. So a listbox can use either the roving-tabindex model or the aria-activedescendant model, whereas a combobox's popup is forced to use aria-activedescendant. If your control has a text field the user types into to filter, you want the combobox pattern; if it is a list they arrow through and select from directly, you want this listbox pattern.",
  },
  {
    question: "Should I use a listbox or a group of checkboxes or radio buttons?",
    answer:
      "For most \"choose one\" and \"choose several\" problems, native radio buttons and checkboxes are the better answer. They are built into HTML, need no ARIA and no JavaScript for their semantics or keyboard support, are instantly familiar to every screen reader user, and cannot drift out of sync the way hand-built ARIA state can. A group of checkboxes in a labelled fieldset is almost always clearer than a multi-select listbox for a small, fully visible set of options. Reach for role=\"listbox\" specifically when a native control does not fit: the options are numerous and need to scroll inside a fixed height, the whole control must be a single Tab stop rather than one stop per option, or you are building the popup for a combobox or another composite widget. In short, a listbox is a specialised tool — prove that radios or checkboxes will not do the job before you take on the roving focus, the selection model, and the keyboard code a listbox requires.",
  },
  {
    question: "What is the difference between single-select and multi-select listboxes?",
    answer:
      "In a single-select listbox exactly one option is selected at a time, and selection normally follows focus: as the user arrows from option to option, the newly focused option becomes the selected one, so aria-selected=\"true\" moves with the focus, much like a native select does when its list is open. In a multi-select listbox — marked with aria-multiselectable=\"true\" on the listbox — focus and selection are separate: arrowing moves focus without changing what is selected, and the user presses Space to toggle the selected state of the focused option, so several options can carry aria-selected=\"true\" at once. Because they behave so differently, decide up front which one you are building. A good rule: make selection follow focus only in single-select, and only when selecting an option has no expensive side effect; if choosing an option triggers something costly, require an explicit Enter or Space to commit instead.",
  },
  {
    question: "What keyboard interactions does an accessible listbox need?",
    answer:
      "The listbox is one Tab stop. Once focus is inside, Down Arrow and Up Arrow move focus to the next and previous option, Home moves to the first option and End to the last, and typing a character (type-ahead) moves focus to the next option whose label starts with that character. In a single-select listbox, moving focus also moves the selection. In a multi-select listbox, Space toggles the selected state of the focused option, Shift+Down Arrow and Shift+Up Arrow extend a contiguous selection while moving focus, and Ctrl+A selects or clears all options. Tab and Shift+Tab move focus into and out of the whole listbox, never between its options. Every one of these must work with no pointer, or the listbox fails 2.1.1 Keyboard. The arrow keys stop at the first and last option — they do not wrap — and you must call preventDefault on the keys you handle so the page does not scroll underneath the list.",
  },
  {
    question: "Should a listbox use roving tabindex or aria-activedescendant?",
    answer:
      "Both are valid for a standalone listbox, and the choice is genuinely open — unlike a combobox popup, which must use aria-activedescendant because focus stays in the input. With roving tabindex, real DOM focus moves onto the options: exactly one option carries tabindex=\"0\" and the rest carry tabindex=\"-1\", and you move the 0 and call focus() as the user arrows. It gives you the browser's own focus ring for free and is the most robust choice for a self-contained listbox. With aria-activedescendant, DOM focus stays on the listbox container and an aria-activedescendant attribute on it points at the id of the active option, which you move as the user arrows; nothing in the list is ever really focused, so you must supply the visible \"active option\" style yourself in CSS. Prefer roving tabindex for a standalone listbox for its simplicity and native focus indicator; reach for aria-activedescendant when the list is virtualised, or when the same code also has to power a combobox where focus must remain elsewhere.",
  },
  {
    question: "How do I mark options as selected and disabled?",
    answer:
      "Selection is carried by aria-selected on each option — never by a CSS class or background colour alone. In a single-select listbox, put aria-selected=\"true\" on the one chosen option; the others need no aria-selected, or you can set it to \"false\". In a multi-select listbox, put aria-multiselectable=\"true\" on the listbox and give every selectable option an explicit aria-selected of \"true\" or \"false\" so a screen reader can announce the state of each. A disabled option carries aria-disabled=\"true\"; keep it in the arrow-key order so the user still learns it exists, but do not let it become selected. Whatever the visual design, pair the selected state with a non-colour cue — a checkmark, a filled checkbox, a bold outline — so the choice survives 1.4.1 Use of Color, and make sure the option's accessible name is its visible label so speech-input users can call it by the word they see.",
  },
  {
    question: "How do I test a listbox for accessibility?",
    answer:
      "Start with the keyboard and no mouse. Tab once — focus should land on the listbox (or its active option), and one more Tab should leave the listbox entirely; if Tab steps option by option, you have the every-option-tabindex-0 bug and no roving tabindex. Arrow up and down through the options, press Home and End, and type a letter to confirm type-ahead jumps to a matching option, checking the page never scrolls out from under you and the arrows stop at the ends rather than wrap. In a single-select listbox, confirm selection follows focus; in a multi-select one, confirm Space toggles the focused option and Shift+Arrow extends the selection. Then listen with a screen reader: each option should announce its label, its role as an option, its position in the set, and whether it is selected, and the listbox should announce its own name and, for multi-select, that more than one option can be chosen. Confirm selection is exposed through aria-selected and shown by more than colour, the focus indicator is clearly visible and reaches 3:1 contrast, and any pointer target is at least 24 by 24 CSS pixels. Layer axe-core on top for the mechanical checks, but the keyboard and screen reader passes are what decide whether the listbox actually works.",
  },
]

const keyboardRows = [
  {
    key: "Down Arrow",
    action:
      "Moves focus to the next option. In a single-select listbox, selection follows focus, so the newly focused option becomes the selected one. Stops at the last option — it does not wrap.",
  },
  {
    key: "Up Arrow",
    action:
      "Moves focus to the previous option (and, in single-select, moves the selection with it). Stops at the first option.",
  },
  {
    key: "Home",
    action: "Moves focus to the first option in the list.",
  },
  {
    key: "End",
    action: "Moves focus to the last option in the list.",
  },
  {
    key: "Type a character",
    action:
      "Type-ahead: moves focus to the next option whose label starts with the typed character. Typing several characters quickly matches a longer string.",
  },
  {
    key: "Space",
    action:
      "In a multi-select listbox, toggles the selected state (aria-selected) of the focused option. In a single-select listbox where selection does not follow focus, selects the focused option.",
  },
  {
    key: "Shift + Down / Up Arrow",
    action:
      "Multi-select only: moves focus to the next or previous option and toggles it into the selection, extending a contiguous range.",
  },
  {
    key: "Ctrl + A",
    action:
      "Multi-select only (optional but expected): selects all options, or clears the selection if everything is already selected.",
  },
  {
    key: "Shift + Space",
    action:
      "Multi-select only (optional): selects the contiguous run of options from the most recently selected option to the focused one.",
  },
  {
    key: "Tab / Shift + Tab",
    action:
      "Moves focus into and out of the whole listbox. The listbox is a single Tab stop; Tab never moves between the options — the arrow keys do that.",
  },
]

const attributeRows = [
  {
    element: "The listbox container",
    role: 'role="listbox" + aria-label / aria-labelledby',
    attrs:
      "The single Tab stop that holds the options; it needs an accessible name. Add aria-multiselectable=\"true\" when more than one option can be selected, and aria-orientation=\"horizontal\" for the rare side-by-side listbox (vertical is the default).",
  },
  {
    element: "Each option",
    role: 'role="option"',
    attrs:
      "One per choice. Carries aria-selected to say whether it is chosen, an aria-disabled when it cannot be selected, and — in the roving-tabindex model — the tabindex. Its accessible name should be its visible label.",
  },
  {
    element: "Selected state",
    role: "aria-selected",
    attrs:
      "\"true\" on a chosen option, \"false\" on an unchosen one. Required on every selectable option in a multi-select listbox; on the single chosen option in a single-select one. This — not a colour — is what a screen reader announces.",
  },
  {
    element: "Multiple selection",
    role: 'aria-multiselectable="true"',
    attrs:
      "On the listbox, when the user may select more than one option. Its presence tells assistive technology to expect several selected options and changes the expected keyboard model (Space toggles, Shift+Arrow extends).",
  },
  {
    element: "Disabled option",
    role: 'aria-disabled="true"',
    attrs:
      "On an option that exists but cannot be chosen. Keep it reachable by the arrow keys so the user learns it is there, but never let it take aria-selected.",
  },
  {
    element: "Option groups",
    role: 'role="group" + aria-label / aria-labelledby',
    attrs:
      "Wraps a run of related options under a heading (\"Fruit\", \"Vegetables\"). The group needs its own accessible name so the screen reader can announce which group an option belongs to.",
  },
  {
    element: "Roving focus",
    role: 'tabindex="0" / tabindex="-1"',
    attrs:
      "In the roving-tabindex model, exactly one option has tabindex=\"0\" and every other has tabindex=\"-1\"; the arrow keys move the 0 and call focus().",
  },
  {
    element: "Virtual focus (alternative)",
    role: "aria-activedescendant",
    attrs:
      "In the aria-activedescendant model, DOM focus stays on the listbox and this attribute on it points at the id of the active option. Use this or roving tabindex — not both.",
  },
]

const antiPatterns = [
  {
    bad: "Options are <div>s or <li>s with click handlers, not role=\"option\" inside a role=\"listbox\".",
    why: "A screen reader announces plain text with no role, no position in a set, and no selected state, so the user cannot tell it is a choosable list or what they have chosen (1.3.1, 4.1.2).",
    fix: "Use a container with role=\"listbox\" and children with role=\"option\", each exposing aria-selected.",
  },
  {
    bad: "Every option carries tabindex=\"0\".",
    why: "The listbox stops being a single Tab stop, so a keyboard user must Tab through every option to get past it and the arrow-key model never engages — a 200-option list becomes 200 Tab stops (2.1.1, 2.4.3).",
    fix: "Use roving tabindex: one option at tabindex=\"0\", every other at tabindex=\"-1\", moved by the arrow keys. Or use aria-activedescendant instead.",
  },
  {
    bad: "A multi-select listbox is built where a labelled group of checkboxes would do.",
    why: "It reinvents keyboard support, selection state, and focus management that native checkboxes give for free, and it is less familiar to screen reader users — more code and more risk for no benefit.",
    fix: "For a small, fully visible set of \"choose several\" options, use checkboxes in a <fieldset> with a <legend>. Reserve the listbox for long, scrolling, or single-Tab-stop lists.",
  },
  {
    bad: "The selected option is shown only by a background colour, with no aria-selected.",
    why: "A screen reader user never learns which option is chosen, and colour alone fails colour-blind users (1.4.1, 4.1.2).",
    fix: "Set aria-selected on the option and pair the colour with a non-colour cue such as a checkmark, a checkbox, or a bold outline.",
  },
  {
    bad: "DOM focus moves onto an option but aria-activedescendant is never updated (or vice versa).",
    why: "The two focus models are mixed, so the screen reader's idea of the active option drifts from the visible one and the user is told the wrong thing (4.1.2).",
    fix: "Pick one model. With roving tabindex, move tabindex and call focus(). With aria-activedescendant, keep focus on the listbox and move the attribute — never both.",
  },
  {
    bad: "Interactive controls — links, buttons, checkboxes — are nested inside role=\"option\" elements.",
    why: "A listbox option is a leaf; controls inside it are not reliably reachable or operable, and the option's own name becomes ambiguous (4.1.2).",
    fix: "Keep options as plain labels. If each row needs its own controls, you want a grid or a list of items, not a listbox — see the data grid guide.",
  },
]

export default function AccessibleListboxGuidePage() {
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
                    Accessible Listbox
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
                Accessible Listbox Guide
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                A listbox lets a user pick from a set of choices — one option, or
                several. This guide covers the{" "}
                <code>role=&quot;listbox&quot;</code> /{" "}
                <code>option</code> / <code>group</code> structure, single-select
                where selection follows focus, multi-select with{" "}
                <code>aria-multiselectable</code> and Space to toggle,{" "}
                <code>aria-selected</code>, the roving-tabindex vs{" "}
                <code>aria-activedescendant</code> focus choice, grouped and
                disabled options, type-ahead, and React — with copy-ready code
                mapped to WCAG 2.2, and the one question to ask before you build
                one at all.
              </p>
            </div>
          </section>

          {/* What & why */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                The Widget for Choosing From a Set
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  A listbox is the control you reach for when the user needs to
                  choose from a set of options that is too long, too dynamic, or
                  too dense for a row of radio buttons or checkboxes to hold
                  comfortably — a scrolling list of tags, a picker of file types,
                  the popup a{" "}
                  <Link href="/guides/accessible-combobox" className="text-blue-600 dark:text-blue-400 hover:underline">
                    combobox
                  </Link>{" "}
                  opens. On screen it is simply a list. What makes it a{" "}
                  <em>listbox</em> to assistive technology is a specific bundle of
                  semantics and a specific keyboard model: one Tab stop, arrow keys
                  that move a single roving focus through the options, and a
                  selected state carried by <code>aria-selected</code>.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The listbox has an ARIA pattern of its own —{" "}
                  <a
                    href="https://www.w3.org/WAI/ARIA/apg/patterns/listbox/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    the WAI-ARIA Authoring Practices Listbox pattern
                  </a>{" "}
                  — built from{" "}
                  <strong className="text-slate-900 dark:text-white">
                    <code>role=&quot;listbox&quot;</code> and{" "}
                    <code>role=&quot;option&quot;</code>
                  </strong>
                  , with <code>aria-selected</code> for what is chosen,{" "}
                  <code>aria-multiselectable</code> when more than one option can
                  be selected, <code>role=&quot;group&quot;</code> to cluster
                  related options, and <code>aria-disabled</code> for options that
                  cannot be picked. Like a{" "}
                  <Link href="/guides/accessible-tree-view" className="text-blue-600 dark:text-blue-400 hover:underline">
                    tree
                  </Link>{" "}
                  or a{" "}
                  <Link href="/guides/accessible-menu" className="text-blue-600 dark:text-blue-400 hover:underline">
                    menu
                  </Link>
                  , there is no single native element that gives you a fully
                  custom listbox — a native <code>&lt;select&gt;</code> is close
                  but styling and multi-select behaviour are where it runs out — so
                  the roles, the roving focus, and the keyboard model are yours to
                  wire up.
                </p>
                <div className="rounded-lg border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 p-5 my-6">
                  <p className="text-sm text-slate-800 dark:text-amber-100 leading-relaxed flex gap-3">
                    <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
                    <span>
                      <strong>
                        Before anything else: most &ldquo;choose one&rdquo; and
                        &ldquo;choose several&rdquo; problems are not listboxes.
                      </strong>{" "}
                      For a small, fully visible set of options, native{" "}
                      <Link href="/guides/accessible-forms" className="underline">
                        radio buttons or checkboxes
                      </Link>{" "}
                      are more familiar, need no JavaScript, and cannot drift out
                      of sync. Reserve <code>role=&quot;listbox&quot;</code> for
                      long, scrolling, or single-Tab-stop lists. Section 1 is the
                      decision.
                    </span>
                  </p>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  This guide walks that decision first, then the anatomy, the HTML
                  structure, the full keyboard model, the selection-follows-focus
                  behaviour that defines a single-select listbox, the separate
                  focus-and-selection model of a multi-select one, the
                  roving-tabindex vs <code>aria-activedescendant</code> focus
                  choice, grouped and disabled options, a React approach, and how
                  to test the result.
                </p>
              </div>
            </div>
          </section>

          {/* WCAG mapping */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <ShieldCheck className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                The WCAG 2.2 Criteria a Listbox Must Satisfy
              </h2>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    WCAG 2.2 success criteria that a correctly built listbox
                    satisfies and what each requires
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
                        What the listbox must do
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
                      <td className="px-4 py-3">The list, each option, its position in the set, its selected state, and any grouping are exposed programmatically — not implied by visual layout alone.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-1-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.1.1 Keyboard
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Every action — move between options, jump to first and last, type-ahead, select and, in multi-select, toggle and extend — works from the keyboard alone.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-4-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.4.3 Focus Order
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Roving tabindex (or aria-activedescendant) keeps the listbox a single Tab stop, and focus moves through the options in a predictable order.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-4-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          1.4.1 Use of Color
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Which option is selected is shown by more than colour — aria-selected plus a checkmark, checkbox, or outline, not a background tint alone.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-4-7" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.4.7 Focus Visible
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">The focused option shows a clearly visible indicator that is distinct from the selected-option styling.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-4-11" className="text-blue-600 dark:text-blue-400 hover:underline">
                          1.4.11 Non-text Contrast
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">The focus indicator, the selection indicator, and any checkmark or checkbox glyph each reach at least 3:1 against what they sit on.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-5-8" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.5.8 Target Size (Minimum)
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">Each option is a pointer target of at least 24 by 24 CSS pixels, so it can be tapped or clicked without precision.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/4-1-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                          4.1.2 Name, Role, Value
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">The listbox exposes its role and name; each option exposes the option role, its label, and its selected and disabled state.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-muted-foreground leading-relaxed mt-6">
                The criterion a listbox fails most often is{" "}
                <Link href="/wcag/4-1-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                  4.1.2 Name, Role, Value
                </Link>
                , because the selected state lives in a CSS class instead of{" "}
                <code>aria-selected</code>, so a screen reader user can see nothing
                is chosen — closely followed by{" "}
                <Link href="/wcag/2-1-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                  2.1.1 Keyboard
                </Link>{" "}
                when the arrow-key model was never wired up at all.
              </p>
            </div>
          </section>

          {/* Decision */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <GitBranch className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                1. Listbox, Radios, Checkboxes, or a Native Select?
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                A listbox asks you to own the roving focus, the selection model,
                and the whole keyboard contract. Reach for it only when a simpler,
                native control genuinely will not fit. For many things that{" "}
                <em>look</em> like they need a listbox, radio buttons, checkboxes,
                or a plain <code>&lt;select&gt;</code> are more robust and far less
                code. Match the control to the job before you build.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Radio buttons or checkboxes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      A{" "}
                      <strong className="text-slate-900 dark:text-white">small, fully visible set</strong>{" "}
                      of choices — pick one (radios) or several (checkboxes). Native
                      HTML in a <code>&lt;fieldset&gt;</code> with a{" "}
                      <code>&lt;legend&gt;</code>. No ARIA, no JavaScript, instantly
                      familiar. See the{" "}
                      <Link href="/guides/accessible-forms" className="text-blue-600 dark:text-blue-400 hover:underline">
                        forms guide
                      </Link>
                      .
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Native select</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      A{" "}
                      <strong className="text-slate-900 dark:text-white">choose-one dropdown</strong>{" "}
                      that does not need custom styling or rich option markup. A
                      native <code>&lt;select&gt;</code> gives you the popup, the
                      keyboard, and a real listbox under the hood — for free, on
                      every device.
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-blue-200 dark:border-blue-900">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Listbox</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      A{" "}
                      <strong className="text-slate-900 dark:text-white">long, scrolling, or single-Tab-stop list</strong>{" "}
                      of choices that needs custom styling or must live in one Tab
                      stop — or the popup a combobox opens.{" "}
                      <code>role=&quot;listbox&quot;</code>. This is what the guide
                      covers.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Combobox</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      The user{" "}
                      <strong className="text-slate-900 dark:text-white">types to filter</strong>{" "}
                      a list of suggestions. A text input paired with a listbox
                      popup, focus staying in the input. See the{" "}
                      <Link href="/guides/accessible-combobox" className="text-blue-600 dark:text-blue-400 hover:underline">
                        combobox guide
                      </Link>
                      .
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div className="rounded-lg border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/30 p-5 my-6">
                <p className="text-sm text-slate-800 dark:text-blue-100 leading-relaxed flex gap-3">
                  <Sparkles className="h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
                  <span>
                    <strong>
                      Why not a native <code>&lt;select multiple&gt;</code> for
                      multi-select?
                    </strong>{" "}
                    It is a real, accessible listbox — but its user experience is
                    notoriously poor: the box is small, users must hold Ctrl or
                    Shift to pick more than one, a stray click wipes the whole
                    selection, and on touch it is worse still. That awkwardness is{" "}
                    <em>why</em> custom multi-select listboxes exist. Even so, a
                    group of checkboxes usually beats both — reach for a custom
                    listbox only when the option count makes checkboxes unwieldy.
                  </span>
                </p>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                The single clearest tell:{" "}
                <strong className="text-slate-900 dark:text-white">would a handful of radio buttons or checkboxes fit on the page?</strong>{" "}
                If yes, use them — they are battle-tested and need no code. A
                listbox earns its cost only when the list is long enough to scroll,
                dynamic enough to need custom markup, or must behave as a single
                Tab stop. When in doubt, start with the native control and upgrade
                only if it genuinely will not do the job.
              </p>
            </div>
          </section>

          {/* Anatomy */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Layers className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                2. Anatomy: Roles, States, and Properties
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                A listbox is a small pattern with a strict rule at its centre: a
                <code>role=&quot;listbox&quot;</code> may contain only{" "}
                <code>role=&quot;option&quot;</code> children, or{" "}
                <code>role=&quot;group&quot;</code> wrappers that themselves contain
                options — nothing else. Here is the full set of roles and
                attributes and what each part is for.
              </p>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    The elements and attributes in an accessible listbox and what
                    each is for
                  </caption>
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">Element / concept</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Attribute</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Purpose</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                    {attributeRows.map((row, i) => (
                      <tr key={i}>
                        <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top">
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
                An option is a <em>leaf</em>: its accessible name should be its
                visible text, and it should not contain its own interactive
                controls. If each row needs a button or a link of its own, you are
                describing a{" "}
                <Link href="/guides/accessible-data-grid" className="text-blue-600 dark:text-blue-400 hover:underline">
                  grid
                </Link>{" "}
                or a plain list, not a listbox. For how each role and property
                surfaces to assistive technology, see the{" "}
                <Link href="/reference/aria" className="text-blue-600 dark:text-blue-400 hover:underline">
                  ARIA roles &amp; attributes reference
                </Link>
                .
              </p>
            </div>
          </section>

          {/* Structure */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Code2 className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                3. The HTML Structure
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Here is a single-select listbox built with a{" "}
                <code>&lt;ul&gt;</code> for the container and{" "}
                <code>&lt;li&gt;</code> for each option, using the roving-tabindex
                model. The listbox has an accessible name, exactly one option
                starts selected and in the Tab order, and the roles do the rest.
              </p>
              <pre className="overflow-x-auto rounded-lg bg-slate-900 dark:bg-slate-950 border border-slate-800 p-4 text-sm text-slate-100"><code>{`<label id="size-label">T-shirt size</label>
<ul
  role="listbox"
  aria-labelledby="size-label"
  tabindex="-1"          <!-- container is not the Tab stop; the option is -->
>
  <li role="option" id="size-s" tabindex="-1">Small</li>

  <!-- The one selected option, and the one in the Tab order to start. -->
  <li role="option" id="size-m" tabindex="0" aria-selected="true">Medium</li>

  <li role="option" id="size-l" tabindex="-1">Large</li>
  <li role="option" id="size-xl" tabindex="-1" aria-disabled="true">
    Extra Large (out of stock)
  </li>
</ul>`}</code></pre>
              <div className="rounded-lg border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/30 p-5 my-6">
                <p className="text-sm text-slate-800 dark:text-blue-100 leading-relaxed flex gap-3">
                  <Sparkles className="h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
                  <span>
                    <strong>
                      A <code>&lt;ul&gt;</code> with <code>role=&quot;listbox&quot;</code> loses
                      its list semantics — and that is expected.
                    </strong>{" "}
                    Once you put <code>role=&quot;listbox&quot;</code> on the{" "}
                    <code>&lt;ul&gt;</code> and <code>role=&quot;option&quot;</code>{" "}
                    on each <code>&lt;li&gt;</code>, the browser stops exposing them
                    as a plain list and exposes the listbox widget instead. That is
                    the whole point. Do not also try to keep the list semantics; a
                    listbox is a widget, not a list of content.
                  </span>
                </p>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                The container carries the accessible name (here via{" "}
                <code>aria-labelledby</code> pointing at the visible label). Every
                option needs a stable <code>id</code> if you use the{" "}
                <code>aria-activedescendant</code> model in section 7; with roving
                tabindex the ids are optional. The disabled option keeps its place
                in the list — the user still arrows to it and hears it is out of
                stock — but it can never take <code>aria-selected</code>.
              </p>
            </div>
          </section>

          {/* Keyboard */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Keyboard className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                4. The Keyboard Model
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                This is the contract that turns a styled list into a listbox, and
                there is no native element to implement it for you when you build a
                custom one. A list that responds only to Tab and a click is not a
                listbox; it is a set of clickable divs.
              </p>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    Keyboard commands a conformant listbox must support
                  </caption>
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">Key</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Expected behavior</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                    {keyboardRows.map((row, i) => (
                      <tr key={i}>
                        <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top whitespace-nowrap">
                          {row.key}
                        </th>
                        <td className="px-4 py-3 align-top">{row.action}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-muted-foreground leading-relaxed mt-6">
                The arrow keys stop at the edges — Down Arrow on the last option
                does nothing, it does not wrap to the top. For the wider keyboard
                contract every custom widget owes, and the roving-tabindex
                technique the next sections build on, see the{" "}
                <Link href="/guides/keyboard-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">
                  keyboard accessibility guide
                </Link>{" "}
                and the{" "}
                <Link href="/guides/focus-management" className="text-blue-600 dark:text-blue-400 hover:underline">
                  focus management guide
                </Link>
                .
              </p>
            </div>
          </section>

          {/* Single-select: selection follows focus */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Focus className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                5. Single-Select: Selection Follows Focus
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                In a single-select listbox, exactly one option is chosen at a time,
                and the defining behaviour is that{" "}
                <strong className="text-slate-900 dark:text-white">selection follows focus</strong>
                : as the user arrows from option to option, the newly focused
                option immediately becomes the selected one — <code>aria-selected</code>{" "}
                moves with the focus. It is the way a native{" "}
                <code>&lt;select&gt;</code> behaves while its list is open, and it
                is what a screen reader user expects from a &ldquo;choose one&rdquo;
                list.
              </p>
              <pre className="overflow-x-auto rounded-lg bg-slate-900 dark:bg-slate-950 border border-slate-800 p-4 text-sm text-slate-100"><code>{`const listbox = document.querySelector('[role="listbox"]')
const options = [...listbox.querySelectorAll('[role="option"]')]
let activeIndex = options.findIndex((o) => o.getAttribute("aria-selected") === "true")

function select(index) {
  const option = options[index]
  if (!option || option.getAttribute("aria-disabled") === "true") return

  // Single-select: exactly one aria-selected="true" at a time.
  options.forEach((o) => o.setAttribute("aria-selected", "false"))
  option.setAttribute("aria-selected", "true")

  // Roving tabindex: move the "0" and focus the new option.
  options[activeIndex]?.setAttribute("tabindex", "-1")
  option.setAttribute("tabindex", "0")
  option.focus()
  activeIndex = index
}

listbox.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowDown": select(activeIndex + 1); break   // selection follows focus
    case "ArrowUp":   select(activeIndex - 1); break
    case "Home":      select(0); break
    case "End":       select(options.length - 1); break
    default: return                                    // let type-ahead etc. run
  }
  e.preventDefault()   // <- stop the arrows scrolling the page
})`}</code></pre>
              <div className="rounded-lg border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 p-5 my-6">
                <p className="text-sm text-slate-800 dark:text-amber-100 leading-relaxed flex gap-3">
                  <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
                  <span>
                    <strong>
                      Do not make selection follow focus when selecting is
                      expensive.
                    </strong>{" "}
                    If choosing an option fires a network request, navigates, or
                    changes the page around it, moving the selection on every arrow
                    press is jarring and can trip{" "}
                    <Link href="/wcag/3-2-1" className="underline">
                      3.2.1 On Focus
                    </Link>
                    . In that case, let the arrows move focus only and require a
                    deliberate Enter or Space to commit — the same option the
                    multi-select model uses. Selection-follows-focus is for cheap,
                    side-effect-free choices.
                  </span>
                </p>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Note the closing <code>e.preventDefault()</code>: without it the
                arrow keys move the selection <em>and</em> scroll the page. And
                because the code sets every option to{" "}
                <code>aria-selected=&quot;false&quot;</code> before selecting one,
                the state can never drift into two options both claiming to be
                selected.
              </p>
            </div>
          </section>

          {/* Multi-select */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <CheckSquare className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                6. Multi-Select: Focus and Selection Are Separate
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                A multi-select listbox is marked with{" "}
                <strong className="text-slate-900 dark:text-white">
                  <code>aria-multiselectable=&quot;true&quot;</code>
                </strong>{" "}
                on the listbox, and it flips the model of the previous section on
                its head: focus and selection are now{" "}
                <em>separate</em>. Arrowing moves focus without changing what is
                selected; the user presses{" "}
                <strong className="text-slate-900 dark:text-white">Space</strong> to
                toggle the focused option, so any number of options can carry{" "}
                <code>aria-selected=&quot;true&quot;</code> at once. Every
                selectable option gets an explicit{" "}
                <code>true</code> or <code>false</code> so a screen reader can
                announce the state of each as the user moves through.
              </p>
              <pre className="overflow-x-auto rounded-lg bg-slate-900 dark:bg-slate-950 border border-slate-800 p-4 text-sm text-slate-100"><code>{`<ul role="listbox" aria-label="Toppings" aria-multiselectable="true">
  <li role="option" tabindex="0"  aria-selected="true">Mushrooms</li>
  <li role="option" tabindex="-1" aria-selected="false">Olives</li>
  <li role="option" tabindex="-1" aria-selected="true">Peppers</li>
  <li role="option" tabindex="-1" aria-selected="false">Onions</li>
</ul>`}</code></pre>
              <pre className="overflow-x-auto rounded-lg bg-slate-900 dark:bg-slate-950 border border-slate-800 p-4 text-sm text-slate-100 mt-4"><code>{`listbox.addEventListener("keydown", (e) => {
  const option = options[activeIndex]
  switch (e.key) {
    // Plain arrows move FOCUS only — the selection does not change.
    case "ArrowDown": if (!e.shiftKey) { moveFocus(activeIndex + 1); break }
                      moveFocus(activeIndex + 1); toggle(options[activeIndex]); break
    case "ArrowUp":   if (!e.shiftKey) { moveFocus(activeIndex - 1); break }
                      moveFocus(activeIndex - 1); toggle(options[activeIndex]); break

    // Space toggles the selected state of the focused option.
    case " ": toggle(option); break

    // Ctrl+A selects every option (or clears them if all are selected).
    case "a": case "A":
      if (e.ctrlKey) { toggleSelectAll(); break }
      return
    default: return   // let type-ahead and other keys through
  }
  e.preventDefault()
})

// Toggle one option's aria-selected between "true" and "false".
function toggle(option) {
  const selected = option.getAttribute("aria-selected") === "true"
  option.setAttribute("aria-selected", String(!selected))
}`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-6">
                Beyond Space, a full multi-select listbox supports{" "}
                <strong className="text-slate-900 dark:text-white">Shift+Down/Up Arrow</strong>{" "}
                to extend a contiguous selection while moving focus, and{" "}
                <strong className="text-slate-900 dark:text-white">Ctrl+A</strong>{" "}
                to select or clear everything — the conventions users already know
                from file managers and email clients. Because focus and selection
                are separate, the focus indicator and the selected styling must be
                visually distinct: a user needs to see both{" "}
                <em>where they are</em> and <em>what they have chosen</em> at the
                same time.
              </p>
              <div className="rounded-lg border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 p-5 my-6">
                <p className="text-sm text-slate-800 dark:text-amber-100 leading-relaxed flex gap-3">
                  <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
                  <span>
                    <strong>Multi-select is exactly where a checkbox group wins.</strong>{" "}
                    Before you build this, ask whether the options would fit as a{" "}
                    <Link href="/guides/accessible-forms" className="underline">
                      group of checkboxes
                    </Link>{" "}
                    in a <code>&lt;fieldset&gt;</code>. Checkboxes give you the
                    toggle, the keyboard, the visible checked state, and the screen
                    reader announcement for free, with no roving tabindex and no
                    <code> aria-multiselectable</code>. Choose the multi-select
                    listbox only when the list is long enough to need scrolling or
                    a single Tab stop.
                  </span>
                </p>
              </div>
            </div>
          </section>

          {/* Roving tabindex vs activedescendant */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <MousePointer2 className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                7. Roving Tabindex or aria-activedescendant?
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                A listbox is a <em>composite</em> widget: one Tab stop, with the
                arrow keys moving an internal focus. There are two ways to manage
                that internal focus, and for a{" "}
                <strong className="text-slate-900 dark:text-white">standalone listbox the choice is genuinely open</strong>{" "}
                — which is what sets it apart from a{" "}
                <Link href="/guides/accessible-combobox" className="text-blue-600 dark:text-blue-400 hover:underline">
                  combobox
                </Link>
                , whose popup is <em>forced</em> to use aria-activedescendant
                because focus has to stay in the text input.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                <Card className="border-blue-200 dark:border-blue-900">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Roving tabindex</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm text-muted-foreground leading-relaxed space-y-2 list-disc pl-5">
                      <li>Real DOM focus moves onto the options.</li>
                      <li>One option has <code>tabindex=&quot;0&quot;</code>, the rest <code>-1</code>; you move the 0 and call <code>focus()</code>.</li>
                      <li>You get the browser&apos;s own focus ring for free.</li>
                      <li><strong className="text-slate-900 dark:text-white">The default choice for a standalone listbox.</strong></li>
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">aria-activedescendant</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm text-muted-foreground leading-relaxed space-y-2 list-disc pl-5">
                      <li>DOM focus stays on the listbox container.</li>
                      <li>An <code>aria-activedescendant</code> attribute points at the active option&apos;s <code>id</code>.</li>
                      <li>Nothing is really focused, so you supply the &ldquo;active&rdquo; style in CSS.</li>
                      <li>Handy when the list is <strong className="text-slate-900 dark:text-white">virtualised</strong>, or shared with a combobox.</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
              <pre className="overflow-x-auto rounded-lg bg-slate-900 dark:bg-slate-950 border border-slate-800 p-4 text-sm text-slate-100"><code>{`<!-- The aria-activedescendant model: focus stays on the <ul>. -->
<ul
  role="listbox"
  aria-label="Country"
  tabindex="0"                          <!-- the listbox itself is focusable -->
  aria-activedescendant="country-fr"    <!-- points at the active option -->
>
  <li role="option" id="country-de">Germany</li>
  <li role="option" id="country-fr" aria-selected="true">France</li>
  <li role="option" id="country-it">Italy</li>
</ul>

<!-- On Arrow Down you move aria-activedescendant to the next id and move a
     CSS ".active" class to match — you never call .focus() on an option. -->`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-6">
                Prefer{" "}
                <strong className="text-slate-900 dark:text-white">roving tabindex</strong>{" "}
                for a self-contained listbox: it is simpler, and the native focus
                indicator satisfies{" "}
                <Link href="/wcag/2-4-7" className="text-blue-600 dark:text-blue-400 hover:underline">
                  2.4.7 Focus Visible
                </Link>{" "}
                without extra CSS. Reach for{" "}
                <strong className="text-slate-900 dark:text-white">aria-activedescendant</strong>{" "}
                when the list is virtualised (options come and go from the DOM as
                the user scrolls) or when the same component also powers a combobox
                where focus must live in the input. See{" "}
                <Link href="/guides/focus-management" className="text-blue-600 dark:text-blue-400 hover:underline">
                  focus management
                </Link>{" "}
                for both models side by side.
              </p>
            </div>
          </section>

          {/* Groups and disabled */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Users className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                8. Grouped and Disabled Options
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                When a list is long, you can cluster related options under headings
                — the analog of the native <code>&lt;optgroup&gt;</code>. Wrap each
                cluster in a{" "}
                <strong className="text-slate-900 dark:text-white">
                  <code>role=&quot;group&quot;</code>
                </strong>{" "}
                that has its own accessible name, so a screen reader can announce
                which group an option belongs to. The group label itself is not an
                option — the user never lands on it, and it can never be selected.
              </p>
              <pre className="overflow-x-auto rounded-lg bg-slate-900 dark:bg-slate-950 border border-slate-800 p-4 text-sm text-slate-100"><code>{`<ul role="listbox" aria-label="Choose an ingredient">
  <li role="group" aria-labelledby="grp-fruit">
    <span id="grp-fruit">Fruit</span>
    <ul>
      <li role="option" tabindex="0" aria-selected="true">Apricot</li>
      <li role="option" tabindex="-1">Cherry</li>
    </ul>
  </li>
  <li role="group" aria-labelledby="grp-veg">
    <span id="grp-veg">Vegetables</span>
    <ul>
      <li role="option" tabindex="-1">Carrot</li>
      <li role="option" tabindex="-1" aria-disabled="true">Kale (sold out)</li>
    </ul>
  </li>
</ul>`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-6">
                For a{" "}
                <strong className="text-slate-900 dark:text-white">disabled option</strong>
                , set <code>aria-disabled=&quot;true&quot;</code> and skip it when
                the user tries to select — but keep it in the arrow-key order. That
                last point is deliberate: if you remove a disabled option from the
                keyboard path entirely, a screen reader user never learns it exists,
                and &ldquo;Kale, sold out&rdquo; is useful information. Let them
                arrow onto it and hear it; just never let it become selected.
              </p>
              <div className="rounded-lg border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 p-5 my-6">
                <p className="text-sm text-slate-800 dark:text-amber-100 leading-relaxed flex gap-3">
                  <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
                  <span>
                    <strong>A disabled option must still meet contrast where it carries meaning.</strong>{" "}
                    Greying out is fine, but if the disabled label conveys
                    information the user needs — <em>why</em> it is unavailable —
                    keep its text readable rather than fading it below{" "}
                    <Link href="/wcag/1-4-3" className="underline">
                      1.4.3 Contrast
                    </Link>
                    . Disabled is not a licence to make text invisible.
                  </span>
                </p>
              </div>
            </div>
          </section>

          {/* React */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Code2 className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                9. Listboxes in React
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                In React you render the options from data and keep the active
                option and the selection in state, but the accessibility contract
                does not change: the roles, the roving <code>tabindex</code>, the
                keyboard handler, and <code>aria-selected</code> are all still
                yours to get right. Here is a single-select listbox where selection
                follows focus.
              </p>
              <pre className="overflow-x-auto rounded-lg bg-slate-900 dark:bg-slate-950 border border-slate-800 p-4 text-sm text-slate-100"><code>{`function Listbox({ label, options }) {
  const [active, setActive] = useState(0)   // index of the focused/selected option
  const refs = useRef([])

  function move(next) {
    if (next < 0 || next >= options.length) return   // stop at the edges
    setActive(next)
    refs.current[next]?.focus()                       // roving tabindex + focus
  }

  function onKeyDown(e) {
    const map = { ArrowDown: active + 1, ArrowUp: active - 1,
                  Home: 0, End: options.length - 1 }
    if (!(e.key in map)) return
    move(map[e.key])
    e.preventDefault()
  }

  return (
    <ul role="listbox" aria-label={label} onKeyDown={onKeyDown}>
      {options.map((opt, i) => (
        <li
          key={opt.id}
          ref={(el) => (refs.current[i] = el)}
          role="option"
          tabIndex={i === active ? 0 : -1}
          aria-selected={i === active}      {/* single-select: follows focus */}
          onClick={() => move(i)}
        >
          {opt.label}
        </li>
      ))}
    </ul>
  )
}`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-6">
                For production, lean on a well-tested implementation rather than
                hand-rolling the edge cases:{" "}
                <strong className="text-slate-900 dark:text-white">
                  React Aria&apos;s <code>useListBox</code> / <code>ListBox</code>
                </strong>{" "}
                gives you single- and multi-select, type-ahead, roving focus, and
                the full keyboard model already handled;{" "}
                <strong className="text-slate-900 dark:text-white">Headless UI&apos;s <code>Listbox</code></strong>{" "}
                and{" "}
                <strong className="text-slate-900 dark:text-white">Radix Select</strong>{" "}
                cover the common select-style cases. The same principles carry to
                other frameworks — see the{" "}
                <Link href="/guides/react-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">
                  React
                </Link>
                ,{" "}
                <Link href="/guides/vue-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Vue
                </Link>
                , and{" "}
                <Link href="/guides/angular-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Angular
                </Link>{" "}
                guides. Whatever you ship, verify it against the workflow below
                rather than trusting the README.
              </p>
            </div>
          </section>

          {/* Testing */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Keyboard className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                How to Test an Accessible Listbox
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Automated tools catch a missing role or an option with no
                accessible name, but almost everything that decides whether a
                listbox is usable — the arrow navigation, the selection model, the
                type-ahead — is a hands-on check that takes a couple of minutes.
              </p>
              <ol className="space-y-4 text-muted-foreground leading-relaxed list-decimal pl-6">
                <li>
                  <strong className="text-slate-900 dark:text-white">Tab exactly once.</strong>{" "}
                  Focus should land on the listbox or its active option, and one
                  more Tab should leave the listbox entirely. If Tab steps option
                  by option, you have the every-option-<code>tabindex=0</code> bug
                  and no roving tabindex.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Arrow, jump, and type.</strong>{" "}
                  Arrow up and down, press Home and End, and type a letter to
                  confirm type-ahead jumps to a matching option. The page must not
                  scroll while you do it, and the arrows must stop at the ends
                  rather than wrap.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Exercise the selection model.</strong>{" "}
                  In single-select, confirm selection follows focus (or that Enter
                  commits it, if you chose that). In multi-select, confirm Space
                  toggles the focused option and Shift+Arrow extends the selection.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Listen with a screen reader.</strong>{" "}
                  Each option should announce its label, its role, its position in
                  the set, and whether it is selected; the listbox should announce
                  its name and, for multi-select, that several options can be
                  chosen. The{" "}
                  <Link href="/guides/screen-reader-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                    screen reader testing guide
                  </Link>{" "}
                  has the commands for{" "}
                  <Link href="/guides/nvda-screen-reader-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                    NVDA
                  </Link>{" "}
                  and{" "}
                  <Link href="/guides/voiceover-screen-reader-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                    VoiceOver
                  </Link>
                  .
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Measure the visuals.</strong>{" "}
                  The focus indicator and the selection indicator each reach 3:1 (
                  <Link href="/wcag/1-4-11" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.4.11
                  </Link>
                  ) and are distinct from each other; selection is not colour alone (
                  <Link href="/wcag/1-4-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.4.1
                  </Link>
                  ); each option is at least 24&nbsp;&times;&nbsp;24 px as a pointer target (
                  <Link href="/wcag/2-5-8" className="text-blue-600 dark:text-blue-400 hover:underline">
                    2.5.8
                  </Link>
                  ).
                </li>
              </ol>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Layer automated checks on top with <code>axe-core</code>, and see{" "}
                <Link href="/guides/automated-vs-manual-accessibility-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                  automated vs manual testing
                </Link>{" "}
                for where each fits. Scan the live page with the{" "}
                <Link href="/tools/url-accessibility-auditor" className="text-blue-600 dark:text-blue-400 hover:underline">
                  URL accessibility auditor
                </Link>{" "}
                to catch a missing name, role, or state before it ships.
              </p>
            </div>
          </section>

          {/* Anti-patterns */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                Common Listbox Mistakes &amp; How to Fix Them
              </h2>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    Common accessible listbox anti-patterns, why they fail, and the
                    fix
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
                Accessible Listbox Checklist
              </h2>
              <ol className="space-y-4 text-muted-foreground leading-relaxed list-decimal pl-6">
                <li>
                  <strong className="text-slate-900 dark:text-white">Right control.</strong>{" "}
                  The options are long, scrolling, or must be one Tab stop. If a few
                  radios or checkboxes would fit, use those instead.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Roles and name.</strong>{" "}
                  <code>role=&quot;listbox&quot;</code> with an accessible name, and{" "}
                  <code>role=&quot;option&quot;</code> on every choice — options
                  only, no nested controls (
                  <Link href="/wcag/1-3-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.3.1
                  </Link>
                  ,{" "}
                  <Link href="/wcag/4-1-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                    4.1.2
                  </Link>
                  ).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">One Tab stop.</strong>{" "}
                  Roving tabindex (one option at <code>0</code>, the rest{" "}
                  <code>-1</code>) or <code>aria-activedescendant</code> — one model,
                  not both (
                  <Link href="/wcag/2-4-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                    2.4.3
                  </Link>
                  ).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Full keyboard.</strong>{" "}
                  Up/Down, Home/End, and type-ahead, with{" "}
                  <code>preventDefault</code> so the page does not scroll (
                  <Link href="/wcag/2-1-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                    2.1.1
                  </Link>
                  ).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Selection model.</strong>{" "}
                  Single-select: one <code>aria-selected</code>, selection follows
                  focus. Multi-select: <code>aria-multiselectable</code> on the
                  listbox, an explicit <code>true</code>/<code>false</code> on every
                  option, Space to toggle.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Selection shown, not just coloured.</strong>{" "}
                  A checkmark, checkbox, or outline alongside the colour, and the
                  focus indicator distinct from the selection indicator (
                  <Link href="/wcag/1-4-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.4.1
                  </Link>
                  ,{" "}
                  <Link href="/wcag/1-4-11" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.4.11
                  </Link>
                  ).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Disabled options handled.</strong>{" "}
                  <code>aria-disabled</code> on unavailable options, still reachable
                  by the arrows, never selectable, readable where the label carries
                  meaning.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Reachable targets.</strong>{" "}
                  Each option is at least 24&nbsp;&times;&nbsp;24 px as a pointer
                  target (
                  <Link href="/wcag/2-5-8" className="text-blue-600 dark:text-blue-400 hover:underline">
                    2.5.8
                  </Link>
                  ).
                </li>
              </ol>
              <p className="text-muted-foreground leading-relaxed mt-6">
                Work through the full{" "}
                <Link href="/checklists/wcag-2-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                  WCAG 2.2 checklist
                </Link>{" "}
                to see the listbox in the context of every other requirement.
              </p>
            </div>
          </section>

          {/* CTA */}
          <section className="py-12 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <div className="rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20 p-8 text-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  Check Your Listbox on a Live Page
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6 max-w-lg mx-auto">
                  Scan any page with our free axe-core-powered auditor to catch a
                  listbox with a missing role, options with no accessible name, or a
                  selected state that lives only in CSS — then run the Tab,
                  arrow-key, and Space passes above for the failures no scanner can
                  see.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button asChild size="lg" className="gap-2">
                    <Link href="/tools/url-accessibility-auditor">
                      Scan a Page Now
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="gap-2">
                    <Link href="/guides/accessible-combobox">
                      Accessible Combobox Guide
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
                content="accessible listbox role listbox option group aria-selected aria-multiselectable aria-activedescendant roving tabindex single select multi select selection follows focus type-ahead disabled option grouped options combobox menu tree data grid select radio checkbox focus management react accessible listbox wcag 1.3.1 2.1.1 2.4.3 2.4.7 1.4.1 1.4.11 2.5.8 4.1.2"
                title="Related Guides & Tools"
                maxItems={6}
                showDescriptions={true}
                excludeUrl="/guides/accessible-listbox"
              />
            </div>
          </section>
        </article>
      </div>
    </>
  )
}
