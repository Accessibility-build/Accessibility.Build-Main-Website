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
  Grid3x3,
  Keyboard,
  ShieldCheck,
  ListChecks,
  Layers,
  GitBranch,
  AlertTriangle,
  Code2,
  Move,
  Sparkles,
  MousePointer2,
  CheckSquare,
  Pencil,
  Rows3,
} from "lucide-react"

const pageTitle = "Accessible Data Grid Guide: role=grid & Keyboard Nav"
const pageDescription =
  "Build an accessible data grid the right way: the role=grid / row / gridcell / columnheader structure built on a real <table>, two-dimensional arrow-key navigation, roving tabindex, the two focus modes (navigation vs actionable — Enter to enter a cell, Escape to leave), editable cells, cell and row selection, aria-rowcount / aria-colcount / aria-rowindex / aria-colindex for virtualized grids, treegrid, and React — with copy-ready code mapped to WCAG 2.2, plus when a plain semantic table is the better choice."

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords: [
    "accessible data grid",
    "role grid",
    "role gridcell",
    "aria grid pattern",
    "wai-aria grid pattern",
    "data grid keyboard navigation",
    "grid arrow key navigation",
    "roving tabindex grid",
    "aria-colindex aria-rowindex",
    "aria-rowcount aria-colcount",
    "editable grid accessibility",
    "data grid accessibility",
    "accessible data table interactive",
    "grid vs table accessibility",
    "treegrid accessibility",
    "accessible data grid react",
    "spreadsheet accessibility",
    "wcag data grid",
  ],
  alternates: {
    canonical: "/guides/accessible-data-grid",
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: "/guides/accessible-data-grid",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: `/api/og?title=${encodeURIComponent("Accessible Data Grid Guide")}&section=Guide`,
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
        url: `/api/og?title=${encodeURIComponent("Accessible Data Grid Guide")}&section=Guide`,
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
    name: "Accessible Data Grid Guide",
    url: "https://accessibility.build/guides/accessible-data-grid",
  },
]

const faqs = [
  {
    question: "What is the difference between a data grid and a table?",
    answer:
      "A table (role=\"table\", or a plain <table> element) presents tabular data the user reads. A grid (role=\"grid\") is an interactive widget the user operates with the arrow keys, like a spreadsheet or an interactive data grid with editable cells, sortable columns, and controls inside the cells. The visible markup can look identical, but the interaction model is completely different: in a table, a screen reader user navigates with their assistive technology's own table-reading commands and every cell is exposed for reading; in a grid, the whole widget is a single Tab stop and the arrow keys move a roving focus between cells. Reach for role=\"grid\" only when the user genuinely navigates or edits cells — never on a table they simply read. Putting role=\"grid\" on a read-only data table switches on an arrow-key interaction model that you then have to implement in full, and if you don't, you have made the table worse, not better.",
  },
  {
    question: "When should I use role=\"grid\" instead of a plain <table>?",
    answer:
      "Use role=\"grid\" only when the user operates on the cells: navigating cell to cell with the arrow keys as though it were a spreadsheet, editing values in place, or moving through a dense matrix of interactive controls that you want to collapse into a single Tab stop with two-dimensional navigation. For everything else — a pricing table, a comparison table, a report, any tabular data the user reads and does not manipulate — use a plain semantic <table> with <th scope> headers. The native element gives you the header-to-cell relationships, the row and column structure, and the powerful table-reading commands screen reader users already know, all for free and with no JavaScript. A grid is a lot of behaviour to own — the full 2-D keyboard model, roving tabindex, the two focus modes, and the count and index properties when you virtualise — so only take it on when the interaction truly demands it.",
  },
  {
    question: "What keyboard interactions does an accessible data grid need?",
    answer:
      "The grid is one Tab stop. Once focus is inside, Right and Left Arrow move focus to the next and previous cell in the same row; Up and Down Arrow move to the cell above and below in the same column. Home moves to the first cell in the row and End to the last cell in the row; Ctrl+Home jumps to the first cell of the first row and Ctrl+End to the last cell of the last row. Page Down and Page Up may move by a screenful of rows. When a cell contains an interactive widget, Enter or F2 enters the cell (actionable mode) so Tab can move between the controls inside it, and Escape returns to navigation mode with focus back on the cell. In an editable grid, Enter or F2 opens the editor and Escape cancels it. Every one of these must work with no pointer, or the grid fails 2.1.1 Keyboard — and if there is no Escape out of actionable mode, it also fails 2.1.2 No Keyboard Trap.",
  },
  {
    question: "What are the two focus modes in a grid — navigation and actionable?",
    answer:
      "A grid manages focus in two modes because the arrow keys can only mean one thing at a time. In navigation mode, the arrow keys move focus from cell to cell across the grid, and each cell is a single stop. That is enough when a cell holds nothing interactive, or holds exactly one widget you can focus directly. The problem comes when a cell holds several focusable controls, or a widget that itself needs the arrow keys — a second grid, a slider, a listbox. You cannot let the same Right Arrow both move to the next cell and operate the widget. The answer is actionable mode: the user presses Enter or F2 on the cell to step inside it, at which point Tab and Shift+Tab move between the controls in that cell and the widget's own keys work normally; Escape steps back out to navigation mode with focus restored to the cell. Providing that Escape route is not optional — without it the user is trapped inside the cell and the grid fails 2.1.2 No Keyboard Trap.",
  },
  {
    question: "What is roving tabindex and why does a grid need it?",
    answer:
      "Roving tabindex is the focus-management technique that makes a composite widget a single Tab stop while its arrow keys move focus internally. Exactly one focusable element in the grid — one cell, or one widget inside a cell — carries tabindex=\"0\" and is in the Tab sequence; every other carries tabindex=\"-1\", which keeps it focusable by script but out of the Tab order. When the user presses an arrow, you set the old target to tabindex=\"-1\", set the new target to tabindex=\"0\", and call .focus() on it. Without this, a naive grid gives every cell or control tabindex=\"0\", so a keyboard user has to Tab through hundreds of cells to get past the widget and the arrow-key model never engages. A thousand-cell grid becomes a thousand Tab stops. Roving tabindex collapses that to one. The alternative model is aria-activedescendant, where DOM focus stays on the grid container and an attribute points at the active cell; both are valid, but roving tabindex is the more common choice for grids.",
  },
  {
    question: "Do I need aria-rowcount, aria-colcount, aria-rowindex, and aria-colindex?",
    answer:
      "You need them the moment the DOM does not contain the whole grid — that is, whenever you virtualise or paginate rows. When every row and cell is present, the browser can count them and work out each cell's position, so a screen reader can say \"row 4 of 20, column 2 of 6\" on its own. But a virtualised grid may have only the thirty visible rows in the DOM out of ten thousand, so the browser's count is wrong. Set aria-rowcount and aria-colcount on the grid to the real totals (use -1 when the total is genuinely unknown), and set aria-rowindex on each row and aria-colindex on each cell to its 1-based position in the full grid, not the DOM. Now the user hears \"row 4,500 of 10,000\" correctly. They are also useful when a row does not start at column 1 or skips columns. Think of them as the grid's version of the tree's aria-level, aria-setsize, and aria-posinset: the programmatic version of the position a sighted user reads from the scrollbar and the visible layout.",
  },
  {
    question: "How do I handle selection in a data grid?",
    answer:
      "Use aria-selected, the same property a listbox and a tree use, placed on whatever unit the user selects — the gridcell for cell selection, or the row for whole-row selection. For multiple selection, put aria-multiselectable=\"true\" on the role=\"grid\" container and give every selectable unit an explicit aria-selected of \"true\" or \"false\" so a screen reader can announce the state of each. Space typically toggles selection of the focused cell or row, Shift+Arrow extends a selection, and Ctrl+A selects all, mirroring the conventions of a spreadsheet. Whatever the model, never signal selection with a background colour alone: a screen reader user needs aria-selected, and a colour-blind user needs a non-colour cue such as a checkmark, a filled checkbox in a selection column, or a bold outline. If your grid is read-only and nothing is selectable, do not add aria-selected at all — an attribute that never changes only adds noise.",
  },
  {
    question: "How do I test a data grid for accessibility?",
    answer:
      "Start with the keyboard and no mouse. Tab once — focus should land on a single cell, and one more Tab should leave the grid entirely; if Tab steps cell by cell, you have the every-cell-tabindex-0 bug. Use the arrow keys to move in all four directions, Home and End along a row, and Ctrl+Home and Ctrl+End to the corners, confirming the page never scrolls out from under you. Where a cell has interactive content, press Enter to step in, Tab between the controls, and Escape to step back out — and make sure Escape always works, or you have a keyboard trap. Then listen with a screen reader: each cell should announce its content, its column header, and its position, and the grid should announce the correct row and column counts even when virtualised. Check that selection is exposed through aria-selected and shown by more than colour, that the focus indicator is clearly visible and reaches 3:1 contrast, and that any clickable target inside a cell is at least 24 by 24 CSS pixels. Layer axe-core on top for the mechanical checks, but the keyboard and screen reader passes are what decide whether the grid actually works.",
  },
]

const keyboardRows = [
  {
    key: "Right Arrow",
    action:
      "Moves focus one cell to the right, staying in the same row. Stops at the last cell of the row — it does not wrap to the next row.",
  },
  {
    key: "Left Arrow",
    action: "Moves focus one cell to the left, staying in the same row.",
  },
  {
    key: "Down Arrow",
    action: "Moves focus one cell down, staying in the same column.",
  },
  {
    key: "Up Arrow",
    action: "Moves focus one cell up, staying in the same column.",
  },
  {
    key: "Home",
    action: "Moves focus to the first cell in the current row.",
  },
  {
    key: "End",
    action: "Moves focus to the last cell in the current row.",
  },
  {
    key: "Ctrl + Home",
    action: "Moves focus to the first cell of the first row.",
  },
  {
    key: "Ctrl + End",
    action: "Moves focus to the last cell of the last row.",
  },
  {
    key: "Page Down / Page Up",
    action:
      "Optional: moves focus down or up by a set number of rows (an author-defined page), for moving quickly through a tall grid.",
  },
  {
    key: "Enter or F2",
    action:
      "On a cell with interactive content: enters actionable mode so Tab can move between the controls inside the cell. In an editable grid: opens the cell's editor.",
  },
  {
    key: "Escape",
    action:
      "Returns from actionable or edit mode to navigation mode, focus back on the cell. Cancels an in-progress edit. This is what keeps the grid from trapping focus.",
  },
  {
    key: "Space",
    action:
      "In a selectable grid, toggles selection of the focused cell or row (aria-selected). Shift+Arrow extends a selection; Ctrl+A selects all.",
  },
  {
    key: "Tab / Shift + Tab",
    action:
      "Moves focus into and out of the whole grid. The grid is a single Tab stop; inside actionable mode, Tab moves between a cell's own controls.",
  },
]

const attributeRows = [
  {
    element: "The grid container",
    role: 'role="grid" + aria-label / aria-labelledby',
    attrs:
      "Best applied to a real <table> element. A single Tab stop that needs an accessible name. Add aria-multiselectable=\"true\" when more than one cell or row can be selected, and aria-readonly=\"true\" when no cell is editable.",
  },
  {
    element: "Each row",
    role: 'role="row"',
    attrs:
      "One per row of cells (a <tr> already has this role implicitly). Carries aria-selected for row selection and aria-rowindex when the grid is virtualized.",
  },
  {
    element: "Row groups",
    role: 'role="rowgroup"',
    attrs:
      "Wraps the header rows and the body rows (<thead> and <tbody> provide this implicitly). Groups rows so structure is exposed to assistive technology.",
  },
  {
    element: "Column header",
    role: 'role="columnheader"',
    attrs:
      "The header cell at the top of a column (a <th scope=\"col\"> is this role). Names the column for every cell beneath it.",
  },
  {
    element: "Row header",
    role: 'role="rowheader"',
    attrs:
      "The header cell that labels a row, usually the first cell (a <th scope=\"row\"> is this role). Names the row for the cells across it.",
  },
  {
    element: "Data cell",
    role: 'role="gridcell"',
    attrs:
      "Every operable data cell (a <td> in a role=\"grid\" table takes this role). Holds the roving tabindex, aria-selected, aria-readonly, and — when virtualized — aria-colindex.",
  },
  {
    element: "Roving focus",
    role: 'tabindex="0" / tabindex="-1"',
    attrs:
      "Exactly one cell (or one widget inside a cell) has tabindex=\"0\"; every other has tabindex=\"-1\". The arrow keys move the 0 across the grid.",
  },
  {
    element: "Total size",
    role: "aria-rowcount / aria-colcount",
    attrs:
      "On the grid. The real total number of rows and columns when the DOM does not contain them all (virtualized grids). Use -1 when a total is genuinely unknown.",
  },
  {
    element: "Cell position",
    role: "aria-rowindex / aria-colindex",
    attrs:
      "The 1-based position of a row and a cell within the full grid, not the DOM. Required once rows are virtualized so the user hears \"row 4,500 of 10,000\".",
  },
]

const antiPatterns = [
  {
    bad: "role=\"grid\" slapped onto a plain data table the user only reads.",
    why: "It switches the widget from a readable table into an interactive one that demands an arrow-key model — and if that model is not implemented, the cells become far harder to reach than in the native table it replaced (2.1.1, 4.1.2 misuse).",
    fix: "Use a plain semantic <table> with <th scope> headers for tabular data. Reserve role=\"grid\" for when the user actually navigates or edits cells.",
  },
  {
    bad: "Every cell (or every control in the grid) has tabindex=\"0\".",
    why: "The grid stops being a single Tab stop, so a keyboard user must Tab through every cell to get past it and the arrow-key model never engages — a 1,000-cell grid is 1,000 Tab stops (2.1.1, 2.4.3).",
    fix: "Use roving tabindex: one cell at tabindex=\"0\", every other at tabindex=\"-1\", and the arrow keys move the 0.",
  },
  {
    bad: "A cell holds several controls, entered with Enter, but there is no Escape back to navigation mode.",
    why: "Once focus is inside the cell, Tab cycles its controls and the arrows do nothing at grid level, so the user cannot get back out to the rest of the grid — a keyboard trap (2.1.2).",
    fix: "Wire Escape (and Enter/F2 to enter) so actionable mode always has a way back to navigation mode.",
  },
  {
    bad: "Arrow keys move between cells but also scroll the page.",
    why: "The default scroll behaviour fires alongside the cell move, so the viewport jumps every time the user navigates, making the grid unusable by keyboard (2.1.1).",
    fix: "Call e.preventDefault() on every arrow branch you handle so the browser does not also scroll.",
  },
  {
    bad: "A virtualized grid shows 30 of 10,000 rows with no aria-rowcount or aria-rowindex.",
    why: "The screen reader counts only the rows in the DOM and announces \"row 4 of 30\", so the user has no idea where they are in the real data set (1.3.1, 4.1.2).",
    fix: "Set aria-rowcount / aria-colcount on the grid to the real totals and aria-rowindex / aria-colindex on each rendered row and cell.",
  },
  {
    bad: "The selected cell or row is shown only by a background colour, with no aria-selected.",
    why: "A screen reader user never learns which cells are selected, and colour alone fails colour-blind users (1.4.1, 4.1.2).",
    fix: "Set aria-selected on the cell or row and pair the colour with a non-colour cue such as a checkbox, a checkmark, or a bold outline.",
  },
]

export default function AccessibleDataGridGuidePage() {
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
                    Accessible Data Grid
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
                Accessible Data Grid Guide
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                A data grid lets a user navigate and operate a matrix of cells —
                a spreadsheet, an editable table, a dense grid of interactive
                controls. This guide covers the{" "}
                <code>role=&quot;grid&quot;</code> / <code>row</code> /{" "}
                <code>gridcell</code> structure built on a real{" "}
                <code>&lt;table&gt;</code>, two-dimensional arrow-key navigation,
                roving tabindex, the two focus modes (navigation vs actionable),
                editable cells, selection,{" "}
                <code>aria-rowcount</code> / <code>aria-colcount</code> /{" "}
                <code>aria-rowindex</code> / <code>aria-colindex</code> for
                virtualized grids, and React — with copy-ready code mapped to
                WCAG 2.2, and the one question to ask before you build one at all.
              </p>
            </div>
          </section>

          {/* What & why */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                The Widget Defined by Two-Dimensional Navigation
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  A data grid is the control you reach for when a table stops
                  being something the user reads and becomes something the user{" "}
                  <em>operates</em> — a spreadsheet they edit cell by cell, a data
                  grid with sortable columns and inline controls, a dense matrix
                  they walk with the arrow keys. On screen it can look exactly
                  like an ordinary table. What makes it a <em>grid</em> to
                  assistive technology is a specific bundle of semantics and a
                  specific keyboard model: one Tab stop, and arrow keys that move
                  a single roving focus in two dimensions — left and right along a
                  row, up and down a column.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The grid has an ARIA pattern of its own —{" "}
                  <a
                    href="https://www.w3.org/WAI/ARIA/apg/patterns/grid/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    the WAI-ARIA Authoring Practices Grid pattern
                  </a>{" "}
                  — built from{" "}
                  <strong className="text-slate-900 dark:text-white">
                    <code>role=&quot;grid&quot;</code>,{" "}
                    <code>role=&quot;row&quot;</code>,{" "}
                    <code>role=&quot;gridcell&quot;</code>, and the{" "}
                    <code>columnheader</code> / <code>rowheader</code> roles
                  </strong>
                  , with <code>aria-selected</code> for what is chosen,{" "}
                  <code>aria-readonly</code> where cells cannot be edited, and{" "}
                  <code>aria-rowcount</code>, <code>aria-colcount</code>,{" "}
                  <code>aria-rowindex</code> and <code>aria-colindex</code> to say
                  where each cell sits in the full data set. Unlike a{" "}
                  <Link href="/guides/accessible-slider" className="text-blue-600 dark:text-blue-400 hover:underline">
                    slider
                  </Link>{" "}
                  or a{" "}
                  <Link href="/guides/accessible-switch" className="text-blue-600 dark:text-blue-400 hover:underline">
                    switch
                  </Link>
                  , there is no single native element that gives you a grid — but,
                  crucially, you should still build it{" "}
                  <strong className="text-slate-900 dark:text-white">on top of a real <code>&lt;table&gt;</code></strong>, so
                  the header-and-cell relationships come for free and you add only
                  the interaction layer.
                </p>
                <div className="rounded-lg border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 p-5 my-6">
                  <p className="text-sm text-slate-800 dark:text-amber-100 leading-relaxed flex gap-3">
                    <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
                    <span>
                      <strong>
                        Before anything else: most data tables should not be
                        grids.
                      </strong>{" "}
                      If the user only <em>reads</em> the data — a pricing table, a
                      comparison, a report — use a plain semantic{" "}
                      <Link href="/learn/table" className="underline">
                        <code>&lt;table&gt;</code> with <code>&lt;th scope&gt;</code> headers
                      </Link>
                      . Reserve <code>role=&quot;grid&quot;</code> for when the
                      user navigates or edits cells with the keyboard. Section 1 is
                      the decision, and when a plain table is the answer, the{" "}
                      <Link href="/guides/accessible-data-tables" className="underline">
                        accessible data tables guide
                      </Link>{" "}
                      covers building it.
                    </span>
                  </p>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  This guide walks that decision first, then the anatomy, the DOM
                  structure on a real table, the full two-dimensional keyboard
                  model, the roving-tabindex focus engine, the two focus modes
                  (navigation vs actionable) that are the heart of the pattern,
                  editable cells, selection, the count and index properties that
                  make a virtualized grid usable, the <code>treegrid</code>{" "}
                  variant, a React approach, and how to test the result.
                </p>
              </div>
            </div>
          </section>

          {/* WCAG mapping */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <ShieldCheck className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                The WCAG 2.2 Criteria a Data Grid Must Satisfy
              </h2>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    WCAG 2.2 success criteria that a correctly built data grid
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
                        What the grid must do
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
                      <td className="px-4 py-3">Row and column structure, each cell&apos;s headers, its position in the full grid, and the selected state are exposed programmatically — not implied by visual layout alone.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-1-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.1.1 Keyboard
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Every action — move in all four directions, jump to row and grid ends, enter and edit cells, select — works from the keyboard alone.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-1-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.1.2 No Keyboard Trap
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Escape always returns from a cell&apos;s actionable or edit mode to navigation mode, and Tab moves focus out of the grid entirely — the arrows navigate, they never trap.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-4-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.4.3 Focus Order
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Roving tabindex keeps the grid a single Tab stop, and focus moves in a predictable order that matches the visual grid.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-4-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          1.4.1 Use of Color
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Which cell or row is selected is shown by more than colour — aria-selected plus a checkbox, checkmark, or outline, not a background tint alone.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-4-7" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.4.7 Focus Visible
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">The focused cell shows a clearly visible indicator that is distinct from the selected-cell styling.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-4-11" className="text-blue-600 dark:text-blue-400 hover:underline">
                          1.4.11 Non-text Contrast
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">The focus indicator, the selection indicator, and any control glyphs inside cells each reach at least 3:1 against what they sit on.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-5-8" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.5.8 Target Size (Minimum)
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">Any clickable target inside a cell — a sort button, a checkbox, an edit control — is at least 24 by 24 CSS pixels.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/4-1-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                          4.1.2 Name, Role, Value
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Each cell exposes the gridcell role, its content, its headers, and its state — selected, read-only, and its row and column position.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-muted-foreground leading-relaxed mt-6">
                The two criteria grids fail most often are{" "}
                <Link href="/wcag/2-1-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                  2.1.1 Keyboard
                </Link>{" "}
                — because the full two-dimensional model, with row and grid ends
                and the two focus modes, is a lot to wire and easy to leave
                half-built — and{" "}
                <Link href="/wcag/2-1-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                  2.1.2 No Keyboard Trap
                </Link>
                , when a user steps into a cell full of controls and finds there
                is no Escape back out.
              </p>
            </div>
          </section>

          {/* Decision */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <GitBranch className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                1. Grid, Table, or Treegrid?
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                A grid is one of the heaviest patterns in the ARIA toolkit — you
                own the roving focus, the two-dimensional keyboard model, the two
                focus modes, and the count and index properties. Reach for it only
                when the user genuinely operates on the cells. For many things
                that <em>look</em> like a grid, a plain table is more robust and
                far less code. Match the control to the job before you build.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Plain table</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      The user{" "}
                      <strong className="text-slate-900 dark:text-white">reads</strong>{" "}
                      the data — a pricing table, a comparison, a report. A native{" "}
                      <code>&lt;table&gt;</code> with{" "}
                      <code>&lt;th scope&gt;</code> headers. No roles, no
                      JavaScript. See the{" "}
                      <Link href="/learn/table" className="text-blue-600 dark:text-blue-400 hover:underline">
                        interactive tables demo
                      </Link>
                      .
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-blue-200 dark:border-blue-900">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Data grid</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      The user{" "}
                      <strong className="text-slate-900 dark:text-white">navigates or edits cells</strong>{" "}
                      with the arrow keys — a spreadsheet, an editable data grid, a
                      matrix of controls in one Tab stop.{" "}
                      <code>role=&quot;grid&quot;</code>. This is what the guide
                      covers.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Treegrid</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      A grid whose{" "}
                      <strong className="text-slate-900 dark:text-white">rows expand and collapse</strong>{" "}
                      — a message list grouped into threads, a hierarchical report.{" "}
                      <code>role=&quot;treegrid&quot;</code>: the grid model plus
                      the{" "}
                      <Link href="/guides/accessible-tree-view" className="text-blue-600 dark:text-blue-400 hover:underline">
                        tree
                      </Link>{" "}
                      expand logic. Section 10.
                    </p>
                  </CardContent>
                </Card>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                The single clearest tell:{" "}
                <strong className="text-slate-900 dark:text-white">does the user read the data, or navigate and operate the cells?</strong>{" "}
                If they read it, a native table is battle-tested, works without
                JavaScript, and gives screen reader users the powerful
                table-reading commands they already know. A grid earns its cost
                only when arrow-key cell navigation or in-place editing{" "}
                <em>is</em> the interaction: a spreadsheet, a data grid, a
                calendar of selectable days. When in doubt, start with the table
                and upgrade only if the interaction truly demands it.
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
                A grid carries the full structure of a table plus the state a
                widget needs. The good news is that a real{" "}
                <code>&lt;table&gt;</code> supplies most of the roles implicitly —{" "}
                <code>&lt;tr&gt;</code> is a <code>row</code>,{" "}
                <code>&lt;thead&gt;</code> and <code>&lt;tbody&gt;</code> are{" "}
                <code>rowgroup</code>s, and <code>&lt;th scope&gt;</code> is a{" "}
                <code>columnheader</code> or <code>rowheader</code> — so you mostly
                add the interaction attributes. Here is the full set and what each
                part is for.
              </p>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    The elements and attributes in an accessible data grid and
                    what each is for
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
                One important constraint: a grid row&apos;s cells must be direct
                children of the row, and a grid must not contain content that is
                not part of a row and cell — everything inside{" "}
                <code>role=&quot;grid&quot;</code> lives in a{" "}
                <code>row</code>, and every operable thing lives in a{" "}
                <code>gridcell</code> or a header cell. For how each role and
                property surfaces to assistive technology, see the{" "}
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
                3. The HTML Structure — Build on a Real Table
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Start from a semantic <code>&lt;table&gt;</code> and add{" "}
                <code>role=&quot;grid&quot;</code>. The{" "}
                <code>&lt;tr&gt;</code>, <code>&lt;thead&gt;</code>,{" "}
                <code>&lt;tbody&gt;</code>, and <code>&lt;th scope&gt;</code>{" "}
                elements already carry the right roles, so you inherit the
                header-and-cell relationships for free and layer the interaction
                on top. Exactly one cell — here the first data cell — starts at{" "}
                <code>tabindex=&quot;0&quot;</code>; every other operable cell is{" "}
                <code>tabindex=&quot;-1&quot;</code>.
              </p>
              <pre className="overflow-x-auto rounded-lg bg-slate-900 dark:bg-slate-950 border border-slate-800 p-4 text-sm text-slate-100"><code>{`<table role="grid" aria-label="Team members" aria-readonly="true">
  <thead>
    <tr>
      <th scope="col">Name</th>
      <th scope="col">Role</th>
      <th scope="col">Status</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <!-- The one cell in the Tab order to start with. -->
      <td tabindex="0">Alice Johnson</td>
      <td tabindex="-1">Frontend Developer</td>
      <td tabindex="-1">Active</td>
    </tr>
    <tr>
      <td tabindex="-1">Bob Smith</td>
      <td tabindex="-1">Product Manager</td>
      <td tabindex="-1">Busy</td>
    </tr>
  </tbody>
</table>`}</code></pre>
              <div className="rounded-lg border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/30 p-5 my-6">
                <p className="text-sm text-slate-800 dark:text-blue-100 leading-relaxed flex gap-3">
                  <Sparkles className="h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
                  <span>
                    <strong>
                      Building on a real <code>&lt;table&gt;</code> is the single
                      biggest favour you can do yourself.
                    </strong>{" "}
                    Because <code>&lt;th scope=&quot;col&quot;&gt;</code> and{" "}
                    <code>&lt;td&gt;</code> already establish the header-to-cell
                    relationships, a screen reader can announce the column header
                    with each cell without any extra ARIA. If you build the grid
                    from <code>&lt;div&gt;</code>s instead, you have to recreate
                    every one of those relationships by hand with{" "}
                    <code>role</code> attributes — more code and more to get
                    wrong.
                  </span>
                </p>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Put the roving <code>tabindex</code> on the cell itself when the
                cell holds plain text or a single widget. When a cell holds one
                interactive control — a link or a button — you can put the{" "}
                <code>tabindex=&quot;0&quot;</code>/<code>&quot;-1&quot;</code> on
                that control instead of the cell, so activating it needs no extra
                step. The next sections cover what happens when a cell holds{" "}
                <em>more</em> than one control.
              </p>
            </div>
          </section>

          {/* Keyboard */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Keyboard className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                4. The Two-Dimensional Keyboard Model
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                This is the contract that turns a table into a grid, and there is
                no native element to implement it for you — every key here is
                yours to wire up. A grid that responds only to Tab is not a grid;
                it is a table with the reading commands switched off.
              </p>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    Keyboard commands a conformant data grid must support
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
                The arrow keys stop at the edges — Right Arrow on the last cell of
                a row does nothing, it does not wrap around to the next row. For
                the wider keyboard contract every custom widget owes, and the
                roving-tabindex technique the next section builds on, see the{" "}
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

          {/* Roving tabindex */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <MousePointer2 className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                5. Roving Tabindex in Two Dimensions
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                A grid is a <em>composite</em> widget: it should be a single stop
                in the Tab order, and once focus is inside, the arrow keys move
                between cells. The technique that achieves this is roving
                tabindex. Exactly one cell carries{" "}
                <code>tabindex=&quot;0&quot;</code> and is in the Tab sequence;
                every other cell carries <code>tabindex=&quot;-1&quot;</code>,
                which keeps it focusable by script but out of the Tab order. When
                the user arrows to a new cell, you move the <code>0</code> — the
                only difference from a one-dimensional widget is that you track a
                row and a column, not a single index.
              </p>
              <pre className="overflow-x-auto rounded-lg bg-slate-900 dark:bg-slate-950 border border-slate-800 p-4 text-sm text-slate-100"><code>{`const grid = document.querySelector('[role="grid"]')
const rows = [...grid.querySelectorAll('tr')]

// The current cell, as [rowIndex, colIndex].
let active = [1, 0]   // skip the header row

function cellAt([r, c]) {
  return rows[r]?.querySelectorAll('th, td')[c]
}

// Move the roving tabindex="0" from the old cell to the new one.
function focusCell(next) {
  const target = cellAt(next)
  if (!target) return                              // off the edge: ignore
  cellAt(active)?.setAttribute("tabindex", "-1")   // old cell out of Tab order
  target.setAttribute("tabindex", "0")             // new cell into it
  target.focus()
  active = next
}

grid.addEventListener("keydown", (e) => {
  const [r, c] = active
  switch (e.key) {
    case "ArrowRight": focusCell([r, c + 1]); break
    case "ArrowLeft":  focusCell([r, c - 1]); break
    case "ArrowDown":  focusCell([r + 1, c]); break
    case "ArrowUp":    focusCell([r - 1, c]); break
    case "Home":       focusCell([r, 0]); break
    case "End":        focusCell([r, rows[r].cells.length - 1]); break
    default: return                                // let other keys through
  }
  e.preventDefault()   // <- stop the arrows scrolling the page
})`}</code></pre>
              <div className="rounded-lg border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 p-5 my-6">
                <p className="text-sm text-slate-800 dark:text-amber-100 leading-relaxed flex gap-3">
                  <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
                  <span>
                    <strong>
                      The number-one grid bug is giving every cell{" "}
                      <code>tabindex=&quot;0&quot;</code>.
                    </strong>{" "}
                    It looks like it works with a mouse, but now a keyboard user
                    has to Tab through every cell to get past the widget, and the
                    arrow-key model never runs. A grid with a thousand cells
                    becomes a thousand Tab stops. One <code>0</code>, the rest{" "}
                    <code>-1</code> — always. And note the closing{" "}
                    <code>e.preventDefault()</code>: without it the arrows move the
                    cell <em>and</em> scroll the page.
                  </span>
                </p>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                There is a second valid model,{" "}
                <strong className="text-slate-900 dark:text-white">
                  <code>aria-activedescendant</code>
                </strong>
                : DOM focus stays on the <code>role=&quot;grid&quot;</code>{" "}
                container and an <code>aria-activedescendant</code> attribute on it
                points at the <code>id</code> of the active cell, which you move as
                the user arrows. It can be simpler with virtualised data, but it
                puts the burden of a visible &ldquo;active cell&rdquo; style
                entirely on your CSS. Roving tabindex is the more common choice for
                grids and the one this guide uses. See{" "}
                <Link href="/guides/focus-management" className="text-blue-600 dark:text-blue-400 hover:underline">
                  focus management
                </Link>{" "}
                for both models side by side.
              </p>
            </div>
          </section>

          {/* Two focus modes */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Move className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                6. The Two Focus Modes — Navigation vs Actionable
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                This is the behaviour that makes a grid genuinely different from a
                tree or a listbox, and it is where most custom grids break. The
                arrow keys can only mean one thing at a time. When a cell holds
                several controls — or a widget that needs the arrows itself — you
                cannot let Right Arrow both move to the next cell and operate the
                widget. The grid solves this with two modes.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      Navigation mode
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm text-muted-foreground leading-relaxed space-y-2 list-disc pl-5">
                      <li>The default. Arrow keys move focus from cell to cell.</li>
                      <li>Each cell is a single stop, even if it contains controls.</li>
                      <li>Enough on its own when a cell is empty or holds exactly one focusable widget.</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      Actionable mode
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm text-muted-foreground leading-relaxed space-y-2 list-disc pl-5">
                      <li><strong className="text-slate-900 dark:text-white">Enter / F2</strong> steps into the focused cell.</li>
                      <li>Tab / Shift+Tab move between the cell&apos;s own controls; the widget&apos;s keys work normally.</li>
                      <li><strong className="text-slate-900 dark:text-white">Escape</strong> steps back out to navigation mode, focus on the cell.</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The rule of thumb is about how many focusable things a cell holds.
                If a cell holds{" "}
                <strong className="text-slate-900 dark:text-white">nothing interactive or a single widget</strong>
                , stay in navigation mode — put the roving tabindex on the cell or
                on that one widget and you are done. If a cell holds{" "}
                <strong className="text-slate-900 dark:text-white">two or more controls</strong>
                , or a control that itself needs the arrow keys, use actionable
                mode so the user can reach each control without the arrows being
                hijacked.
              </p>
              <pre className="overflow-x-auto rounded-lg bg-slate-900 dark:bg-slate-950 border border-slate-800 p-4 text-sm text-slate-100"><code>{`let mode = "navigation"

grid.addEventListener("keydown", (e) => {
  const cell = e.target.closest("th, td")
  if (!cell) return

  // --- Actionable mode: Tab moves between controls, Escape leaves. ---
  if (mode === "actionable") {
    if (e.key === "Escape") {
      mode = "navigation"
      cell.setAttribute("tabindex", "0")
      cell.focus()               // return focus to the cell itself
      e.preventDefault()
    }
    return                       // let Tab and the widget's own keys through
  }

  // --- Navigation mode ---
  switch (e.key) {
    case "ArrowRight": case "ArrowLeft":
    case "ArrowUp":    case "ArrowDown":
    case "Home":       case "End":
      moveFocus(e.key, cell)     // roving tabindex from section 5
      e.preventDefault()
      break

    case "Enter": case "F2": {
      // Step into a cell that has focusable content.
      const widget = cell.querySelector("a, button, input, select, textarea")
      if (widget) {
        mode = "actionable"
        widget.focus()
        e.preventDefault()
      }
      break
    }
  }
})`}</code></pre>
              <div className="rounded-lg border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 p-5 my-6">
                <p className="text-sm text-slate-800 dark:text-amber-100 leading-relaxed flex gap-3">
                  <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
                  <span>
                    <strong>Escape is not optional.</strong> The moment you let a
                    user step <em>into</em> a cell, you must give them a way back
                    <em> out</em>. If Enter enters actionable mode but nothing
                    returns to navigation mode, Tab just cycles the cell&apos;s
                    controls forever and the user is stuck — a keyboard trap that
                    fails{" "}
                    <Link href="/wcag/2-1-2" className="underline">
                      2.1.2 No Keyboard Trap
                    </Link>
                    . Wire Escape first, then Enter.
                  </span>
                </p>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                When a cell holds exactly one interactive control, you can skip the
                two-mode dance entirely: keep the roving{" "}
                <code>tabindex</code> on that control, and Enter or Space activates
                it as normal. The two-mode model is the price you pay only for
                cells that pack in more than one thing.
              </p>
            </div>
          </section>

          {/* Editable cells */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Pencil className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                7. Editable Cells
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                An editable grid is a special, common case of actionable mode. A
                read-only grid should say so with{" "}
                <code>aria-readonly=&quot;true&quot;</code> on the grid (or on the
                individual cells that cannot change). Where a cell{" "}
                <em>is</em> editable, the same keys apply: Enter or F2 opens the
                editor, Escape cancels and restores the original value, and
                committing the edit (often Enter again) returns to navigation mode
                and moves focus on.
              </p>
              <pre className="overflow-x-auto rounded-lg bg-slate-900 dark:bg-slate-950 border border-slate-800 p-4 text-sm text-slate-100"><code>{`// An editable cell in navigation mode.
<td tabindex="0" aria-readonly="false">$95,000</td>

// Enter / F2 swaps the text for an input, focus moves into it.
<td tabindex="-1">
  <input
    type="text"
    aria-label="Salary, Alice Johnson"
    value="95000"
  />
</td>

// Escape restores "$95,000" and returns focus to the cell (navigation mode).
// Enter commits the new value, returns to navigation mode, moves focus down.`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-6">
                Two details matter for a screen reader user. First, the editor
                needs its own accessible name — the column header alone is not
                enough once the cell text has been replaced by a bare input, so
                give it an <code>aria-label</code> that identifies both the field
                and the row (&ldquo;Salary, Alice Johnson&rdquo;). Second, if the
                edit can fail validation, surface the error with{" "}
                <code>aria-invalid</code> and an{" "}
                <code>aria-describedby</code> message, exactly as you would in a{" "}
                <Link href="/guides/accessible-forms" className="text-blue-600 dark:text-blue-400 hover:underline">
                  form
                </Link>{" "}
                — an editable grid cell is a form control that happens to live in a
                grid.
              </p>
            </div>
          </section>

          {/* Selection */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <CheckSquare className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                8. Selection: Cell, Row, and Range
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                A grid can let the user select cells, rows, or ranges, and the
                chosen state belongs on{" "}
                <strong className="text-slate-900 dark:text-white">
                  <code>aria-selected</code>
                </strong>{" "}
                — the same property a{" "}
                <Link href="/guides/accessible-listbox" className="text-blue-600 dark:text-blue-400 hover:underline">
                  listbox
                </Link>{" "}
                and a{" "}
                <Link href="/guides/accessible-tree-view" className="text-blue-600 dark:text-blue-400 hover:underline">
                  tree
                </Link>{" "}
                use — placed on whatever unit the user selects. Put{" "}
                <code>aria-selected</code> on the <code>gridcell</code> for cell
                selection, or on the <code>row</code> for whole-row selection.
              </p>
              <pre className="overflow-x-auto rounded-lg bg-slate-900 dark:bg-slate-950 border border-slate-800 p-4 text-sm text-slate-100"><code>{`<!-- Multi-select rows: aria-multiselectable on the grid, an explicit
     aria-selected on every row, and a real checkbox as the non-colour cue. -->
<table role="grid" aria-label="Invoices" aria-multiselectable="true">
  <tbody>
    <tr aria-selected="true">
      <td tabindex="0">
        <input type="checkbox" checked aria-label="Select invoice 1024" />
      </td>
      <td tabindex="-1">#1024</td>
      <td tabindex="-1">$420.00</td>
    </tr>
    <tr aria-selected="false">
      <td tabindex="-1">
        <input type="checkbox" aria-label="Select invoice 1025" />
      </td>
      <td tabindex="-1">#1025</td>
      <td tabindex="-1">$180.00</td>
    </tr>
  </tbody>
</table>`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-6">
                Set{" "}
                <code>aria-multiselectable=&quot;true&quot;</code> on the{" "}
                <code>role=&quot;grid&quot;</code> when more than one unit can be
                selected, and give <em>every</em> selectable unit an explicit{" "}
                <code>aria-selected</code> of <code>true</code> or{" "}
                <code>false</code> so a screen reader can announce the state of
                each. Space toggles the focused unit, Shift+Arrow extends a
                selection, and Ctrl+A selects all — the conventions a spreadsheet
                user already expects. If your grid is purely read-only and nothing
                is selectable, add no <code>aria-selected</code> at all; an
                attribute that never changes is only noise.
              </p>
              <div className="rounded-lg border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 p-5 my-6">
                <p className="text-sm text-slate-800 dark:text-amber-100 leading-relaxed flex gap-3">
                  <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
                  <span>
                    <strong>Never show selection by colour alone.</strong> A tinted
                    row means nothing to a screen reader without{" "}
                    <code>aria-selected</code>, and nothing to a colour-blind user
                    without a second cue. Pair the state with a checkbox, a
                    checkmark, or a bold outline so it survives both{" "}
                    <Link href="/wcag/1-4-1" className="underline">
                      1.4.1 Use of Color
                    </Link>{" "}
                    and{" "}
                    <Link href="/wcag/4-1-2" className="underline">
                      4.1.2
                    </Link>
                    .
                  </span>
                </p>
              </div>
            </div>
          </section>

          {/* Virtualized grids */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Rows3 className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                9. Telling the User Where They Are: Count and Index
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                A sighted user reads their position in a big grid from the
                scrollbar and the row numbers. A screen reader user gets that same
                orientation from four properties — and they become{" "}
                <strong className="text-slate-900 dark:text-white">essential the moment you virtualise or paginate</strong>
                , because then the DOM holds only the visible rows and the browser
                can no longer count the real data set.
              </p>
              <ul className="space-y-3 text-muted-foreground leading-relaxed list-disc pl-6 mb-6">
                <li>
                  <strong className="text-slate-900 dark:text-white">
                    <code>aria-rowcount</code> / <code>aria-colcount</code>
                  </strong>{" "}
                  — on the grid, the real total number of rows and columns. Set{" "}
                  <code>-1</code> when a total is genuinely unknown (an
                  infinite-scroll feed still loading).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">
                    <code>aria-rowindex</code>
                  </strong>{" "}
                  — on each row, its 1-based position in the full grid, so the user
                  hears &ldquo;row 4,500&rdquo; even though it is the third{" "}
                  <code>&lt;tr&gt;</code> in the DOM.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">
                    <code>aria-colindex</code>
                  </strong>{" "}
                  — on each cell, its 1-based column position in the full grid.
                  Also useful when a row does not start at column 1 or skips
                  columns.
                </li>
              </ul>
              <pre className="overflow-x-auto rounded-lg bg-slate-900 dark:bg-slate-950 border border-slate-800 p-4 text-sm text-slate-100"><code>{`<!-- A virtualized grid: 10,000 rows total, only a window rendered. -->
<table role="grid" aria-label="Transactions"
       aria-rowcount="10000" aria-colcount="4">
  <tbody>
    <tr aria-rowindex="4500">
      <td aria-colindex="1" tabindex="0">2026-07-28</td>
      <td aria-colindex="2" tabindex="-1">Acme Corp</td>
      <td aria-colindex="3" tabindex="-1">$1,240.00</td>
      <td aria-colindex="4" tabindex="-1">Paid</td>
    </tr>
    <!-- ...only the visible ~30 rows are in the DOM... -->
  </tbody>
</table>`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-6">
                When the whole grid is in the DOM, the browser computes counts and
                positions for you and you can skip these. But once you virtualise,
                only your <code>aria-rowcount</code> and{" "}
                <code>aria-rowindex</code> can tell the user &ldquo;row 4,500 of
                10,000&rdquo;. They are the grid&apos;s version of the{" "}
                <Link href="/guides/accessible-tree-view" className="text-blue-600 dark:text-blue-400 hover:underline">
                  tree&apos;s
                </Link>{" "}
                <code>aria-level</code>, <code>aria-setsize</code> and{" "}
                <code>aria-posinset</code>: the programmatic version of the
                position the layout shows a sighted user. Treat them as part of
                building a virtualized grid, not as polish.
              </p>
            </div>
          </section>

          {/* Treegrid */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <GitBranch className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                10. Treegrid: When Rows Expand and Collapse
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                A <strong className="text-slate-900 dark:text-white"><code>role=&quot;treegrid&quot;</code></strong>{" "}
                is a grid whose rows form a hierarchy that can expand and collapse —
                an email list grouped into threads, a file browser with columns, a
                financial report you drill into. It is the grid keyboard model plus
                the expand/collapse logic of a{" "}
                <Link href="/guides/accessible-tree-view" className="text-blue-600 dark:text-blue-400 hover:underline">
                  tree view
                </Link>
                : rows carry <code>aria-expanded</code> (on the parent rows only)
                and <code>aria-level</code>, and when focus is on the first column
                of a collapsible row, Right Arrow expands it and Left Arrow
                collapses it — the same context-sensitive arrow behaviour the tree
                guide covers in depth.
              </p>
              <pre className="overflow-x-auto rounded-lg bg-slate-900 dark:bg-slate-950 border border-slate-800 p-4 text-sm text-slate-100"><code>{`<table role="treegrid" aria-label="Threaded messages">
  <tbody>
    <tr aria-level="1" aria-expanded="true" aria-posinset="1" aria-setsize="2">
      <td tabindex="0">Re: Launch plan</td>
      <td tabindex="-1">Priya Shah</td>
      <td tabindex="-1">Jul 28</td>
    </tr>
    <tr aria-level="2" aria-posinset="1" aria-setsize="1">
      <td tabindex="-1">Re: Launch plan</td>
      <td tabindex="-1">Marco Diaz</td>
      <td tabindex="-1">Jul 28</td>
    </tr>
  </tbody>
</table>`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-6">
                Because a treegrid combines two of the hardest patterns on the
                web, it is the strongest case of all for reaching for a
                battle-tested implementation rather than hand-rolling one. If you
                do build it, read the{" "}
                <Link href="/guides/accessible-tree-view" className="text-blue-600 dark:text-blue-400 hover:underline">
                  tree view guide
                </Link>{" "}
                for the expand/collapse and focus-restoration details, then layer
                the grid&apos;s two-dimensional navigation on top.
              </p>
            </div>
          </section>

          {/* React */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Code2 className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                11. Data Grids in React
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                In React you render the grid from data and keep the active cell,
                the selection, and any edit state in state, but the accessibility
                contract does not change: the roles, the roving{" "}
                <code>tabindex</code>, the two-dimensional keyboard handler, the
                two focus modes, and the count and index properties are all still
                yours to get right.
              </p>
              <pre className="overflow-x-auto rounded-lg bg-slate-900 dark:bg-slate-950 border border-slate-800 p-4 text-sm text-slate-100"><code>{`function DataGrid({ columns, rows }) {
  // Track the active cell as [rowIndex, colIndex] for roving tabindex.
  const [active, setActive] = useState([0, 0])

  function onKeyDown(e) {
    const [r, c] = active
    const next = {
      ArrowRight: [r, c + 1], ArrowLeft: [r, c - 1],
      ArrowDown:  [r + 1, c], ArrowUp:   [r - 1, c],
    }[e.key]
    if (!next) return
    const [nr, nc] = next
    if (nr < 0 || nr >= rows.length || nc < 0 || nc >= columns.length) return
    setActive(next)          // re-render puts tabIndex=0 on the new cell...
    e.preventDefault()       // ...and the cell ref's effect calls .focus()
  }

  return (
    <table role="grid" aria-label="Report" onKeyDown={onKeyDown}>
      <tbody>
        {rows.map((row, r) => (
          <tr key={row.id}>
            {columns.map((col, c) => (
              <td
                key={col.key}
                tabIndex={active[0] === r && active[1] === c ? 0 : -1}
              >
                {row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-6">
                A data grid is one of the most complex widgets you can build, so
                the honest advice for production is to lean on a well-tested
                implementation:{" "}
                <strong className="text-slate-900 dark:text-white">
                  React Aria&apos;s <code>useTable</code> / <code>Table</code>
                </strong>{" "}
                gives you a fully interactive grid with the roving focus, the two
                focus modes, selection, and keyboard model already handled;{" "}
                <strong className="text-slate-900 dark:text-white">TanStack Table</strong>{" "}
                is a headless data layer you pair with the ARIA and keyboard code
                above; and grid libraries such as AG Grid ship an accessibility
                mode you should still verify. The same principles carry to other
                frameworks — see the{" "}
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
                How to Test an Accessible Data Grid
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Automated tools catch a missing role or a cell with no accessible
                name, but almost everything that decides whether a grid is usable —
                the two-dimensional navigation, the two focus modes, the escape
                from a cell — is a hands-on check that takes a few minutes.
              </p>
              <ol className="space-y-4 text-muted-foreground leading-relaxed list-decimal pl-6">
                <li>
                  <strong className="text-slate-900 dark:text-white">Tab exactly once.</strong>{" "}
                  Focus should land on a single cell, and one more Tab should leave
                  the grid entirely. If Tab steps cell by cell, you have the
                  every-cell-<code>tabindex=0</code> bug.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Navigate in two dimensions.</strong>{" "}
                  Arrow in all four directions, Home and End along a row, Ctrl+Home
                  and Ctrl+End to the corners. The page must not scroll while you
                  do it, and the arrows must stop at the edges rather than wrap.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Enter and escape a busy cell.</strong>{" "}
                  On a cell with controls, press Enter to step in, Tab between the
                  controls, then Escape to step back out to navigation mode. If
                  Escape does nothing, you have a keyboard trap (
                  <Link href="/wcag/2-1-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                    2.1.2
                  </Link>
                  ).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Listen with a screen reader.</strong>{" "}
                  Each cell should announce its content, its column header, and its
                  position; a virtualized grid should announce the real row and
                  column counts, not the DOM&apos;s. The{" "}
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
                  ); any clickable target inside a cell is at least 24&nbsp;&times;&nbsp;24 px (
                  <Link href="/wcag/2-5-8" className="text-blue-600 dark:text-blue-400 hover:underline">
                    2.5.8
                  </Link>
                  ); selection is not colour alone (
                  <Link href="/wcag/1-4-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.4.1
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
                Common Data Grid Mistakes &amp; How to Fix Them
              </h2>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    Common accessible data grid anti-patterns, why they fail, and
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
                Accessible Data Grid Checklist
              </h2>
              <ol className="space-y-4 text-muted-foreground leading-relaxed list-decimal pl-6">
                <li>
                  <strong className="text-slate-900 dark:text-white">Right control.</strong>{" "}
                  The user navigates or edits cells. If they only read the data,
                  use a plain semantic <code>&lt;table&gt;</code> instead.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Structure on a table.</strong>{" "}
                  <code>role=&quot;grid&quot;</code> on a real{" "}
                  <code>&lt;table&gt;</code>, with{" "}
                  <code>&lt;th scope&gt;</code> headers so the header-to-cell
                  relationships come for free (
                  <Link href="/wcag/1-3-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.3.1
                  </Link>
                  ).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">One Tab stop.</strong>{" "}
                  Roving tabindex: exactly one cell at{" "}
                  <code>tabindex=&quot;0&quot;</code>, the rest at{" "}
                  <code>-1</code> (
                  <Link href="/wcag/2-4-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                    2.4.3
                  </Link>
                  ).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Full 2-D keyboard.</strong>{" "}
                  All four arrows, Home/End, Ctrl+Home/End, with{" "}
                  <code>preventDefault</code> so the page does not scroll (
                  <Link href="/wcag/2-1-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                    2.1.1
                  </Link>
                  ).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Two focus modes.</strong>{" "}
                  Enter/F2 enters a busy cell, Escape always returns to navigation
                  mode — no keyboard trap (
                  <Link href="/wcag/2-1-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                    2.1.2
                  </Link>
                  ).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Position when virtualized.</strong>{" "}
                  <code>aria-rowcount</code> / <code>aria-colcount</code> on the
                  grid and <code>aria-rowindex</code> / <code>aria-colindex</code>{" "}
                  on rows and cells once the DOM no longer holds them all.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Selection exposed.</strong>{" "}
                  <code>aria-selected</code> on the selected cells or rows,{" "}
                  <code>aria-multiselectable</code> on the grid, and a non-colour
                  cue (
                  <Link href="/wcag/1-4-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.4.1
                  </Link>
                  ).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Visible and reachable.</strong>{" "}
                  The focus and selection indicators reach 3:1 (
                  <Link href="/wcag/1-4-11" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.4.11
                  </Link>
                  ); any target inside a cell is at least 24&nbsp;&times;&nbsp;24 px (
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
                to see the grid in the context of every other requirement.
              </p>
            </div>
          </section>

          {/* CTA */}
          <section className="py-12 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <div className="rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20 p-8 text-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  Check Your Data Grid on a Live Page
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6 max-w-lg mx-auto">
                  Scan any page with our free axe-core-powered auditor to catch a
                  grid with a missing role, cells with no accessible name, or a
                  wrong count — then run the Tab, arrow-key, and Enter/Escape
                  passes above for the failures no scanner can see.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button asChild size="lg" className="gap-2">
                    <Link href="/tools/url-accessibility-auditor">
                      Scan a Page Now
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="gap-2">
                    <Link href="/learn/table">
                      Interactive Tables Demo
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
                content="accessible data grid role grid gridcell row rowgroup columnheader rowheader aria-selected aria-readonly aria-multiselectable aria-rowcount aria-colcount aria-rowindex aria-colindex roving tabindex two dimensional keyboard navigation arrow keys navigation actionable mode editable cell treegrid virtualized grid table focus management tree view react accessible data grid wcag 1.3.1 2.1.1 2.1.2 2.4.3 2.4.7 1.4.11 2.5.8 4.1.2"
                title="Related Guides & Tools"
                maxItems={6}
                showDescriptions={true}
                excludeUrl="/guides/accessible-data-grid"
              />
            </div>
          </section>
        </article>
      </div>
    </>
  )
}
