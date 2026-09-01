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

const pageTitle = "Accessible Data Tables: Semantic HTML, scope & Headers"
const pageDescription =
  "Build data tables screen readers can read: the semantic table, caption, and th scope structure, when to use scope versus the headers and id attributes for complex tables, responsive tables that keep their meaning at 320px, sortable and interactive tables with aria-sort, and when a plain table beats an ARIA grid. Copy-ready HTML mapped to WCAG 2.2."

export const metadata: Metadata = {
  title: pageTitle,
  description: clampDescription(pageDescription),
  keywords: [
    "accessible data tables",
    "accessible tables",
    "html table accessibility",
    "table scope attribute",
    "th scope col row",
    "table caption accessibility",
    "headers id attribute table",
    "complex table accessibility",
    "responsive accessible table",
    "aria-sort",
    "sortable table accessibility",
    "screen reader table navigation",
    "data table vs layout table",
    "role=table",
    "wcag 1.3.1 tables",
    "semantic html table",
    "accessible table markup",
    "table header association",
    "accessible tables wcag",
  ],
  alternates: {
    canonical: "/guides/accessible-data-tables",
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: "/guides/accessible-data-tables",
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
    name: "Accessible Data Tables",
    url: "https://accessibility.build/guides/accessible-data-tables",
  },
]

const faqs = [
  {
    question: "What makes a data table accessible?",
    answer:
      "A data table is accessible when the markup encodes which cell is a header for which data, so a screen reader can tell the user what a value means as they move through the table. Three things do most of the work: use a real <table> element rather than a grid of divs, give it a <caption> so it has a name, and mark every header cell as a <th> with an explicit scope of col or row so each data cell is tied to its column and row headers. Sighted users infer these relationships from position and visual weight; a screen reader user gets them only from the code. Get the header associations right and the table reads correctly cell by cell. Everything else, from contrast to responsive behaviour, builds on that foundation.",
  },
  {
    question: "What is the difference between the scope attribute and the headers and id attributes?",
    answer:
      "Both associate data cells with their header cells, but they suit different tables. scope is the simple, preferred method for regular tables: put scope=\"col\" on each column header and scope=\"row\" on each row header, and the browser works out which headers apply to each cell from the grid position. It is concise and covers the vast majority of tables. The headers and id method is for genuinely complex tables where scope cannot express the relationships: give every header cell a unique id, then on each data cell list the ids of every header that applies in a space-separated headers attribute. It is explicit and handles any structure, including multi-level and irregular headers, but it is verbose and easy to get out of sync. The rule of thumb: reach for scope first, and only move to headers and id when a table has multiple header levels or spanning headers that scope cannot describe. If you find yourself needing headers and id, first ask whether the table could be split into simpler tables instead.",
  },
  {
    question: "Is a caption required on every table?",
    answer:
      "It is not strictly required by WCAG, but a <caption> is the single easiest accessibility win for a table and you should add one to every data table. The caption is the table's accessible name: it is announced when a screen reader user lands on the table, and it is what appears in the list of tables the user can jump between, so it is how they decide whether this table is the one they want. Without it, a table is announced only as \"table\" with no indication of what it holds. Put the <caption> as the very first child of the <table>; it renders as visible text above the table by default, which helps everyone, and you can style or visually hide it if the surrounding heading already names it, though a visible caption is usually better. A caption is far more reliable than the obsolete summary attribute, which you should not use.",
  },
  {
    question: "How do I make a wide table responsive without breaking its accessibility?",
    answer:
      "The safest approach is to keep the table intact and let it scroll horizontally inside a labelled container: wrap the <table> in a <div> with overflow-x set to auto, and make that wrapper focusable and named by giving it tabindex=\"0\", role=\"region\", and an aria-label such as \"Quarterly revenue, scrollable\". That keeps the full table semantics and lets keyboard users scroll it, which a plain overflow container does not allow. The other common approach, collapsing the table into stacked cards on small screens with CSS, is riskier: setting display:block or display:grid on the table, tr, th, and td elements removes their table roles from the accessibility tree, so the header associations vanish. If you use the card pattern, either re-add the roles explicitly with role=\"table\", role=\"row\", role=\"cell\", and so on, or make sure each value still reads with its label in the visible text. When in doubt, the scrollable region is the pattern that cannot silently break.",
  },
  {
    question: "Can I use divs with role=table instead of a real HTML table?",
    answer:
      "You can, but you almost never should. The ARIA table roles, role=\"table\", role=\"row\", role=\"cell\", role=\"columnheader\", role=\"rowheader\", and role=\"rowgroup\", exist for the rare case where you cannot use a real <table>, such as a virtualised table built from divs for performance. They make you rebuild by hand everything the native element gives you for free: the row and column structure, the header-to-cell relationships, and, when you virtualise, the aria-rowcount, aria-colcount, aria-rowindex, and aria-colindex properties so the user hears \"row 40 of 10,000\". Miss one and the table reads incorrectly. This is the first rule of ARIA in practice: if a native element does the job, use it. A real <table> with <th scope> is more robust, better supported, and less code than any div-based reconstruction, so reserve the ARIA roles for when there is truly no alternative.",
  },
  {
    question: "How do screen reader users actually read a table?",
    answer:
      "Screen readers have a dedicated table navigation mode. Instead of reading straight through in source order, the user moves cell by cell with a modifier plus the arrow keys: in NVDA and JAWS that is Ctrl plus Alt plus the arrow keys, and in VoiceOver it is Control plus Option plus the arrow keys while interacting with the table. As they move, the screen reader announces the contents of the cell along with its column and row headers, so moving right along a row reads \"Price, 19 dollars\" then \"Stock, 42\", and moving down a column re-announces the column header with each value. This only works when the headers are marked up as <th> with scope; if the header cells are plain <td>, the screen reader has nothing to announce and the user hears bare numbers with no idea what they mean. The user can also pull up a list of every table on the page, where each table is identified by its caption, and jump straight to the one they want.",
  },
  {
    question: "What is wrong with using a table for page layout?",
    answer:
      "Using a <table> to position page content, rather than to present tabular data, forces relationships onto content that has none. A screen reader announces it as a data table, tells the user how many rows and columns it has, and offers table navigation for what is really just a layout, which is confusing and slows them down. It also tends to fix the layout in a way that fails reflow at 1.4.10 and resize text at 1.4.4. Modern CSS with flexbox or grid does layout far better and keeps the reading order in the markup, so there is no reason to lay out a page with a table. If you have inherited a layout table you cannot remove, add role=\"presentation\" to strip its table semantics so assistive technology ignores the structure, but the real fix is to rebuild the layout in CSS. Reserve <table> for actual rows and columns of related data.",
  },
  {
    question: "When should I use a data grid instead of a plain table?",
    answer:
      "Use a plain semantic <table> whenever the user reads the data and, at most, sorts or selects rows: pricing tables, comparison tables, reports, dashboards, any tabular content. The native table gives a screen reader the header relationships and the powerful table-reading commands for free, with no JavaScript. Reach for role=\"grid\" only when the user operates on the cells as though the table were a spreadsheet: navigating cell to cell with the arrow keys, editing values in place, or working through a dense matrix of controls that you want to collapse into a single Tab stop with two-dimensional keyboard navigation. A grid is a large amount of behaviour to build and own, including the full arrow-key model, roving tabindex, and the navigation-versus-actionable focus modes, so only take it on when the interaction genuinely demands it. Adding sortable headers or row checkboxes to a table does not make it a grid; it is still a table the user reads.",
  },
]

const antiPatterns = [
  {
    bad: "Using a <table> to lay out a page instead of to present data.",
    why: "A screen reader announces layout content as a data table with a row and column count and offers table navigation for it, which is confusing and often fails reflow (1.4.10) and resize text (1.4.4).",
    fix: "Lay out pages with CSS grid or flexbox. If a layout table is unavoidable, add role=\"presentation\" so assistive technology ignores its structure.",
  },
  {
    bad: "Header cells marked up as bold <td> instead of <th>.",
    why: "A styled <td> looks like a header but carries no header semantics, so a screen reader never associates it with the data cells and reads the values with no context (fails 1.3.1).",
    fix: "Use <th> for every header cell, and give each one an explicit scope of col or row.",
  },
  {
    bad: "A <th> with no scope attribute.",
    why: "Without scope, assistive technology has to guess which cells the header applies to, and the guess is unreliable across screen readers, especially once the table has both column and row headers.",
    fix: "Add scope=\"col\" to column headers and scope=\"row\" to row headers so every association is explicit.",
  },
  {
    bad: "No <caption>, so the table has no name.",
    why: "The table is announced only as \"table\" and shows up unlabelled in the screen reader's list of tables, so the user cannot tell what it holds or which table to jump to (weakens 2.4.6).",
    fix: "Add a <caption> as the first child of the <table> describing what the data is. Style or visually hide it if a nearby heading already names it.",
  },
  {
    bad: "Setting display:block or display:grid on table, tr, and td for a responsive layout.",
    why: "Changing the display of table elements removes their table roles from the accessibility tree, so the header-to-cell relationships silently disappear even though the table still looks right.",
    fix: "Prefer wrapping the table in a labelled, focusable overflow-x scroll region. If you do reflow to cards, re-add role=\"table\", role=\"row\", and role=\"cell\", or ensure each value reads with its label.",
  },
  {
    bad: "role=\"grid\" applied to a table the user only reads.",
    why: "role=\"grid\" switches on an arrow-key interaction model you then have to implement in full; leave it unimplemented and you have made the table harder to use, not easier.",
    fix: "Use a plain <table> with <th scope> for data the user reads. Reserve role=\"grid\" for tables the user navigates or edits cell by cell.",
  },
  {
    bad: "Header information locked inside an image or a merged visual header with no markup.",
    why: "A column labelled only by a graphic, or a spanning header shown by visual grouping alone, gives a screen reader nothing to announce, so the relationship is lost (fails 1.1.1 and 1.3.1).",
    fix: "Put header text in real <th> cells. Use scope=\"colgroup\" or the headers and id method to express spanning headers, not visual grouping alone.",
  },
]

export default function AccessibleDataTablesGuidePage() {
  return (
    <>
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />
      <GuideArticleSchema route="/guides/accessible-data-tables" title={pageTitle} description={pageDescription} datePublished="2026-08-11" />
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
                    Accessible Data Tables
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
                Accessible Data Tables
              </h1>
              <PageByline route="/guides/accessible-data-tables" className="mb-5" />
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                A data table&rsquo;s accessibility lives almost entirely in one
                thing: whether the markup says which cell is a header for which
                data. Sighted users read that from position and weight; a screen
                reader user gets it only from the code. This guide covers the
                whole foundation, from the semantic table, caption, and{" "}
                <code>th scope</code> structure to complex headers, responsive
                tables that survive 320 pixels, sortable and interactive tables,
                and when a plain table beats an ARIA grid. Mapped to WCAG 2.2,
                with copy-ready HTML.
              </p>
            </div>
          </section>

          {/* The core idea */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                What Actually Makes a Table Accessible
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  A data table exists to communicate{" "}
                  <strong className="text-slate-900 dark:text-white">
                    relationships
                  </strong>
                  : this value belongs to this row and this column. A sighted
                  reader reconstructs those relationships instantly from the grid
                  layout, from the bold header row, from the fact that the leftmost
                  column reads like labels. None of that is available to a screen
                  reader unless the markup encodes it. The accessible version of a
                  table is not a caption bolted on afterwards or an ARIA attribute
                  sprinkled on top; it is a table whose header cells are marked as
                  header cells and tied to the data they describe.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  This matters because screen readers do not read a table straight
                  through. They offer a dedicated{" "}
                  <strong className="text-slate-900 dark:text-white">
                    table navigation mode
                  </strong>
                  : the user moves cell by cell with a modifier and the arrow
                  keys, and as they move, the software announces each value{" "}
                  <em>along with its column and row headers</em>. Moving across a
                  row might read &ldquo;Price, 19 dollars&rdquo; then
                  &ldquo;Stock, 42&rdquo;; moving down a column re-announces the
                  column header with each cell. That is only possible when the
                  headers are real <code>&lt;th&gt;</code> cells with a{" "}
                  <code>scope</code>. Mark the headers as plain <code>&lt;td&gt;</code>
                  , and the user hears a stream of bare numbers with no idea what
                  any of them mean.
                </p>
                <div className="not-prose rounded-lg border border-teal-200 dark:border-teal-900/50 bg-teal-50 dark:bg-teal-950/20 p-5 my-6">
                  <p className="text-sm font-semibold text-teal-900 dark:text-teal-200 mb-2">
                    The one test that matters
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Turn on a screen reader, move into the middle of your table,
                    and land on a single data cell. If the software tells you both
                    what the value is <em>and</em> which column and row it belongs
                    to, your header associations are correct. If it reads only the
                    raw value, the relationships are missing, and no amount of
                    styling will supply them.
                  </p>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  One distinction to settle first:{" "}
                  <strong className="text-slate-900 dark:text-white">
                    data tables versus layout tables
                  </strong>
                  . A data table presents rows and columns of related information.
                  A layout table abuses the <code>&lt;table&gt;</code> element to
                  position unrelated page content, a practice left over from the
                  pre-CSS web. This guide is entirely about data tables. Do not lay
                  out pages with tables: modern CSS grid and flexbox do it better
                  and keep the reading order honest. If you are stuck with a legacy
                  layout table, <code>role=&quot;presentation&quot;</code> strips
                  its table semantics so assistive technology ignores the
                  structure, but rebuilding it in CSS is the real fix. The one
                  place layout tables remain unavoidable is{" "}
                  <Link href="/guides/accessible-email" className="text-blue-600 dark:text-blue-400 hover:underline">
                    HTML email
                  </Link>
                  , where clients still require them and{" "}
                  <code>role=&quot;presentation&quot;</code> becomes the primary
                  accessibility technique rather than a legacy workaround.
                </p>
              </div>
            </div>
          </section>

          {/* WCAG mapping */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <ShieldCheck className="h-7 w-7 text-teal-600 dark:text-teal-400" />
                How Tables Map to WCAG 2.2
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                The highlighted row,{" "}
                <Link href="/wcag/1-3-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                  1.3.1 Info and Relationships
                </Link>
                , is the criterion this whole guide serves: the header-to-cell
                relationships shown visually must be present in the markup. The
                rest of the table covers the criteria a data table brushes up
                against, from naming the table to keeping it usable at 320 pixels.
              </p>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    WCAG 2.2 success criteria that apply to data tables, their
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
                        How it applies to tables
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                    <tr className="bg-blue-50/60 dark:bg-blue-950/20">
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-3-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          1.3.1 Info and Relationships
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">The header-to-cell relationships conveyed by layout must exist in code. This is what <code>&lt;th&gt;</code>, <code>scope</code>, and the headers and id method are for.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-3-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                          1.3.2 Meaningful Sequence
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">The reading order of the table in the DOM must make sense. Do not reorder rows or cells with CSS in a way the source order contradicts.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-4-6" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.4.6 Headings and Labels
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">The <code>&lt;caption&gt;</code> names the table and header cells describe their columns and rows. Names must be meaningful, not &ldquo;Column 1&rdquo;.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-4-10" className="text-blue-600 dark:text-blue-400 hover:underline">
                          1.4.10 Reflow
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">At 320 CSS pixels the table must not force two-dimensional scrolling of the whole page. A labelled horizontal scroll region for the table itself is the standard answer.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-1-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          1.1.1 Non-text Content
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Icons, status dots, and sparklines inside cells need a text alternative, or the value they encode is invisible to a screen reader.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-4-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          1.4.1 Use of Color
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">A cell whose meaning is carried by colour alone, a red figure for a loss, needs a second cue such as a sign, label, or icon with a name.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-4-11" className="text-blue-600 dark:text-blue-400 hover:underline">
                          1.4.11 Non-text Contrast
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">If borders or zebra striping are the only thing separating rows and columns, those visual boundaries must meet 3 to 1 against their background.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-1-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.1.1 Keyboard
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Sort buttons, row checkboxes, and per-row actions inside cells must be fully keyboard operable, and a scrollable table region must be reachable by keyboard.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-muted-foreground leading-relaxed mt-4 text-sm">
                For the full wording of each criterion, browse the{" "}
                <Link
                  href="/wcag"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  WCAG 2.2 reference
                </Link>
                . 1.3.1 is the one that fails most often on tables, almost always
                because header cells are marked as <code>&lt;td&gt;</code> or carry
                no <code>scope</code>.
              </p>
            </div>
          </section>

          {/* 1. The minimum viable accessible table */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                1. The Minimum Viable Accessible Table
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Most of a table&rsquo;s accessibility comes from using the
                  semantic elements HTML already gives you, in the right places.
                  The full set is small: <code>&lt;table&gt;</code> wraps
                  everything, <code>&lt;caption&gt;</code> names it,{" "}
                  <code>&lt;thead&gt;</code>, <code>&lt;tbody&gt;</code>, and{" "}
                  <code>&lt;tfoot&gt;</code> group the rows,{" "}
                  <code>&lt;tr&gt;</code> is a row, <code>&lt;th&gt;</code> is a
                  header cell, and <code>&lt;td&gt;</code> is a data cell. Here is
                  a complete, correct table with a header row:
                </p>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`<table>
  <caption>Q2 2026 sales by region</caption>
  <thead>
    <tr>
      <th scope="col">Region</th>
      <th scope="col">Units sold</th>
      <th scope="col">Revenue</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">North</th>
      <td>1,204</td>
      <td>$48,160</td>
    </tr>
    <tr>
      <th scope="row">South</th>
      <td>987</td>
      <td>$39,480</td>
    </tr>
    <tr>
      <th scope="row">West</th>
      <td>1,530</td>
      <td>$61,200</td>
    </tr>
  </tbody>
</table>`}</code></pre>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Three decisions in that markup carry the accessibility, and each
                  one is worth naming:
                </p>
                <ul className="text-muted-foreground leading-relaxed mb-4 list-disc pl-6 space-y-2">
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      The <code>&lt;caption&gt;</code> is the table&rsquo;s name.
                    </strong>{" "}
                    It must be the first child of <code>&lt;table&gt;</code>. A
                    screen reader announces it on entry and lists it in the
                    tables menu, so the user knows what they are looking at before
                    they explore. It renders as visible text above the table,
                    which helps everyone.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      The first row uses <code>&lt;th scope=&quot;col&quot;&gt;</code>.
                    </strong>{" "}
                    These are the column headers. <code>scope=&quot;col&quot;</code>{" "}
                    tells assistive technology that each one labels the whole
                    column beneath it.
                  </li>
                  <li>
                    <strong className="text-slate-900 dark:text-white">
                      Each row&rsquo;s first cell is a{" "}
                      <code>&lt;th scope=&quot;row&quot;&gt;</code>.
                    </strong>{" "}
                    &ldquo;North&rdquo;, &ldquo;South&rdquo;, and
                    &ldquo;West&rdquo; are not data, they are the labels for their
                    rows, so they are header cells too. This is the step teams
                    forget most: a table with a bold top row but plain{" "}
                    <code>&lt;td&gt;</code> down the left reads its numbers with a
                    column name but no row name.
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  A quick note on <code>&lt;thead&gt;</code> and{" "}
                  <code>&lt;tbody&gt;</code>: they group rows into structural
                  sections and are good practice, and <code>&lt;thead&gt;</code>{" "}
                  keeps header rows repeating when a long table prints. They are
                  not what associates headers with cells, though, that is the job
                  of <code>&lt;th&gt;</code> and <code>scope</code>. A table with
                  correct header cells but no <code>&lt;thead&gt;</code> is still
                  accessible; a table with a <code>&lt;thead&gt;</code> full of{" "}
                  <code>&lt;td&gt;</code> is not.
                </p>
              </div>
            </div>
          </section>

          {/* 2. scope, the load-bearing attribute */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                2. scope: The Load-Bearing Attribute
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  <code>scope</code> tells assistive technology the direction a
                  header cell applies. It takes four values, and two of them cover
                  almost every table:
                </p>
                <div className="not-prose overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 my-4">
                  <table className="w-full text-sm text-left">
                    <caption className="sr-only">
                      The four values of the scope attribute and when to use each
                    </caption>
                    <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
                      <tr>
                        <th scope="col" className="px-4 py-3 font-semibold">Value</th>
                        <th scope="col" className="px-4 py-3 font-semibold">The header applies to</th>
                        <th scope="col" className="px-4 py-3 font-semibold">Use it for</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                      <tr>
                        <th scope="row" className="px-4 py-3 font-mono text-xs align-top">scope=&quot;col&quot;</th>
                        <td className="px-4 py-3 align-top">Every data cell in its column</td>
                        <td className="px-4 py-3 align-top">The header row across the top of the table.</td>
                      </tr>
                      <tr>
                        <th scope="row" className="px-4 py-3 font-mono text-xs align-top">scope=&quot;row&quot;</th>
                        <td className="px-4 py-3 align-top">Every data cell in its row</td>
                        <td className="px-4 py-3 align-top">The label cell at the start of each row.</td>
                      </tr>
                      <tr>
                        <th scope="row" className="px-4 py-3 font-mono text-xs align-top">scope=&quot;colgroup&quot;</th>
                        <td className="px-4 py-3 align-top">A group of columns it spans</td>
                        <td className="px-4 py-3 align-top">A header that spans several columns via colspan.</td>
                      </tr>
                      <tr>
                        <th scope="row" className="px-4 py-3 font-mono text-xs align-top">scope=&quot;rowgroup&quot;</th>
                        <td className="px-4 py-3 align-top">A group of rows it spans</td>
                        <td className="px-4 py-3 align-top">A header that labels a block of rows via rowspan.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You might have heard that browsers can infer the scope from
                  position, so you can leave it off. Do not rely on that. The
                  inference is unreliable across screen readers, and it breaks down
                  precisely when the table gets interesting, once there are both
                  column headers and row headers, or a spanning header. The rule is
                  simple and worth making absolute:{" "}
                  <strong className="text-slate-900 dark:text-white">
                    every <code>&lt;th&gt;</code> gets a <code>scope</code>.
                  </strong>{" "}
                  It is a few characters that removes all ambiguity.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  When a header spans multiple columns, <code>colspan</code> paired
                  with <code>scope=&quot;colgroup&quot;</code> handles the common
                  case. Here a &ldquo;Contact&rdquo; header sits above two columns:
                </p>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`<table>
  <caption>Team directory</caption>
  <thead>
    <tr>
      <th scope="col">Name</th>
      <th scope="colgroup" colspan="2">Contact</th>
    </tr>
    <tr>
      <td></td>
      <th scope="col">Email</th>
      <th scope="col">Phone</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Alice Nguyen</th>
      <td>alice@example.com</td>
      <td>555-0142</td>
    </tr>
  </tbody>
</table>`}</code></pre>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Once a table has two header rows like this, though, you are at
                  the edge of what <code>scope</code> expresses cleanly. That is
                  the signal to look at the next section.
                </p>
              </div>
            </div>
          </section>

          {/* 3. Complex tables: headers and id */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                3. Complex Tables: the headers and id Method
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  When a table has multiple levels of headers, or headers that
                  apply to cells in a way the grid position cannot express,{" "}
                  <code>scope</code> runs out. The{" "}
                  <strong className="text-slate-900 dark:text-white">
                    headers and id method
                  </strong>{" "}
                  handles any structure. Give every header cell a unique{" "}
                  <code>id</code>, then on each data cell, list the ids of every
                  header that applies in a space-separated{" "}
                  <code>headers</code> attribute:
                </p>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`<table>
  <caption>Shipping cost by weight and zone</caption>
  <thead>
    <tr>
      <th id="weight" scope="col">Weight</th>
      <th id="zone-a" scope="col">Zone A</th>
      <th id="zone-b" scope="col">Zone B</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th id="w-light" scope="row" headers="weight">Under 1 kg</th>
      <td headers="w-light zone-a">$5</td>
      <td headers="w-light zone-b">$8</td>
    </tr>
    <tr>
      <th id="w-heavy" scope="row" headers="weight">1 to 5 kg</th>
      <td headers="w-heavy zone-a">$9</td>
      <td headers="w-heavy zone-b">$14</td>
    </tr>
  </tbody>
</table>`}</code></pre>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Now the <code>$14</code> cell announces &ldquo;1 to 5 kg, Zone
                  B, 14 dollars&rdquo; because its <code>headers</code> attribute
                  names both the row header and the column header explicitly. The
                  method is exhaustive and unambiguous. It is also verbose and
                  fragile: every id must be unique, every reference must resolve,
                  and it is easy to let them drift out of sync when the table
                  changes.
                </p>
                <div className="not-prose rounded-lg border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/20 p-5 my-6">
                  <p className="text-sm font-semibold text-amber-900 dark:text-amber-200 mb-2">
                    Before you reach for headers and id, try to simplify
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    A table complex enough to need the headers and id method is
                    usually hard for <em>everyone</em>, not just screen reader
                    users. More often than not, a table with several header levels
                    can be split into two or three simpler tables, each with its
                    own caption and a straightforward{" "}
                    <code>scope</code> structure. That is easier to build, easier
                    to maintain, and easier to read for all users. Treat headers
                    and id as the tool for the genuinely irreducible case, not the
                    default for anything with more than one header row.
                  </p>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Between the two extremes,{" "}
                  <code>scope=&quot;colgroup&quot;</code> and{" "}
                  <code>scope=&quot;rowgroup&quot;</code> cover many
                  &ldquo;grouped header&rdquo; tables without the id bookkeeping,
                  so try those before the full headers and id approach.
                </p>
              </div>
            </div>
          </section>

          {/* 4. Caption, description, empty cells */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                4. Naming, Describing, and Empty Cells
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-2 mb-3">
                  Caption is the name; add a description only if needed
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The <code>&lt;caption&gt;</code> gives the table its short name.
                  When a table also needs a longer explanation, how to read it, a
                  data source, a note about units, do not resurrect the obsolete{" "}
                  <code>summary</code> attribute, which HTML5 removed and modern
                  assistive technology ignores. Put the explanation in visible
                  prose near the table, or associate a paragraph with{" "}
                  <code>aria-describedby</code>:
                </p>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`<p id="table-note">
  Figures are in thousands and exclude refunds.
</p>
<table aria-describedby="table-note">
  <caption>Monthly active users, 2026</caption>
  ...
</table>`}</code></pre>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  A <code>&lt;figure&gt;</code> with a{" "}
                  <code>&lt;figcaption&gt;</code> wrapping the table is another
                  valid pattern when the table is a self-contained figure you
                  reference from the text. If the surrounding heading already names
                  the table, you can visually hide the caption with an{" "}
                  <code>sr-only</code> utility class rather than dropping it,
                  keeping the name for screen readers without visual duplication,
                  though a visible caption is usually the friendlier choice.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                  Empty cells
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  An empty <code>&lt;td&gt;</code> is announced as an empty cell,
                  which is fine when the value is genuinely absent, but ambiguous
                  when it means something specific like &ldquo;none&rdquo; or
                  &ldquo;not applicable&rdquo;. If the blank carries meaning, put
                  the meaning in the cell rather than leaving it empty, so a
                  screen reader user is not left guessing whether the data is zero,
                  unknown, or missing. The one empty cell that is expected and
                  correct is the top-left corner of a table with both column and
                  row headers, the intersection that labels nothing; leaving that{" "}
                  <code>&lt;td&gt;</code> or <code>&lt;th&gt;</code> empty is the
                  conventional, well-understood choice.
                </p>
              </div>
            </div>
          </section>

          {/* 5. Responsive tables */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                5. Responsive Tables Without Breaking the Semantics
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  This is where table accessibility most often goes wrong. A wide
                  table cannot simply shrink to fit a phone, and{" "}
                  <Link href="/wcag/1-4-10" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.4.10 Reflow
                  </Link>{" "}
                  says the page must not require two-dimensional scrolling at 320
                  CSS pixels. There are two mainstream answers, and one of them has
                  a hidden trap.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                  The safe default: a labelled scroll region
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Keep the table exactly as it is and let it scroll horizontally
                  inside a container. The important detail is making that container
                  a <em>focusable, named region</em> so keyboard users can scroll
                  it and screen reader users know what it is. A bare{" "}
                  <code>overflow-x: auto</code> div cannot be scrolled by keyboard;
                  adding <code>tabindex=&quot;0&quot;</code> and a label fixes that:
                </p>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`<div
  role="region"
  aria-label="Quarterly revenue, scrollable"
  tabindex="0"
  style="overflow-x: auto;"
>
  <table>
    <caption>Quarterly revenue by product line</caption>
    ...
  </table>
</div>`}</code></pre>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  This keeps the full table semantics intact, satisfies reflow by
                  scoping the scrolling to the table rather than the page, and is
                  reachable by keyboard. It is the pattern that cannot silently
                  break, and it should be your first choice.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                  The card pattern and its trap
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The other popular approach collapses each row into a stacked
                  &ldquo;card&rdquo; on narrow screens, with each value prefixed by
                  its column label via a CSS <code>::before</code> pseudo-element
                  fed from a <code>data-label</code> attribute. It can look great.
                  The trap is that it is usually built by setting{" "}
                  <code>display: block</code> (or <code>grid</code>) on the{" "}
                  <code>table</code>, <code>tr</code>, <code>th</code>, and{" "}
                  <code>td</code> elements, and{" "}
                  <strong className="text-slate-900 dark:text-white">
                    changing the display of a table element removes its table role
                    from the accessibility tree
                  </strong>
                  . The table still looks like a table, but a screen reader no
                  longer sees rows, columns, or header associations. You have
                  traded a scroll for a broken table.
                </p>
                <div className="not-prose rounded-lg border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/20 p-5 my-6">
                  <p className="text-sm font-semibold text-amber-900 dark:text-amber-200 mb-2">
                    If you use the card pattern, do one of these
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Either re-declare the roles explicitly, adding{" "}
                    <code>role=&quot;table&quot;</code> to the table,{" "}
                    <code>role=&quot;row&quot;</code> to each row,{" "}
                    <code>role=&quot;cell&quot;</code> to data cells, and{" "}
                    <code>role=&quot;columnheader&quot;</code> or{" "}
                    <code>role=&quot;rowheader&quot;</code> to headers, so the
                    display change does not strip them; or make sure the visible{" "}
                    <code>data-label</code> text carries each value&rsquo;s meaning
                    so the card reads correctly even without table semantics. Test
                    the result with a screen reader at mobile width, because the
                    breakage is completely invisible on screen.
                  </p>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  A related reflow tie-in:{" "}
                  <Link href="/wcag/1-4-5" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.4.5 Images of Text
                  </Link>{" "}
                  and{" "}
                  <Link href="/wcag/1-4-4" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.4.4 Resize Text
                  </Link>{" "}
                  both fail if you render the table as a fixed-width screenshot to
                  avoid the layout problem. Keep the table as real text and solve
                  the width with layout, never with an image.
                </p>
              </div>
            </div>
          </section>

          {/* 6. Sortable and interactive tables */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                6. Sortable and Interactive Tables
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Reading a table is one thing; sorting it, selecting rows, and
                  acting on them adds controls that each need their own
                  accessibility. The key point:{" "}
                  <strong className="text-slate-900 dark:text-white">
                    a sortable or selectable table is still a table
                  </strong>
                  , not a grid. You add controls inside a normal semantic table;
                  you do not switch on the <code>role=&quot;grid&quot;</code>{" "}
                  interaction model.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                  Sortable columns with aria-sort
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Put a real <code>&lt;button&gt;</code> inside the{" "}
                  <code>&lt;th&gt;</code> so the sort control is keyboard operable
                  (2.1.1), and set <code>aria-sort</code> on the{" "}
                  <code>&lt;th&gt;</code> to announce the current sort. Only one
                  column carries an active <code>aria-sort</code> value at a time;
                  the values are <code>ascending</code>, <code>descending</code>,{" "}
                  <code>none</code>, and <code>other</code>:
                </p>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`<th scope="col" aria-sort="ascending">
  <button type="button">
    Revenue
    <span aria-hidden="true">&#9650;</span>
  </button>
</th>
<th scope="col" aria-sort="none">
  <button type="button">Region</button>
</th>`}</code></pre>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  When the user activates the button, re-sort the rows, move{" "}
                  <code>aria-sort</code> to the newly active column (and set the
                  others back to <code>none</code>), and update the visible arrow.
                  The arrow glyph is decorative, so hide it from assistive
                  technology with <code>aria-hidden</code>: the sort state is
                  already conveyed by <code>aria-sort</code>, and doubling it up in
                  the button text would be noise. Some screen readers announce the
                  <code>aria-sort</code> change on their own; if you want to
                  guarantee feedback, mirror it in a{" "}
                  <Link href="/wcag/4-1-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                    polite live region
                  </Link>{" "}
                  such as &ldquo;Sorted by revenue, ascending&rdquo;.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                  Row selection and per-row actions
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  A checkbox or action button inside a cell must have an accessible
                  name that includes the row context, because a screen reader user
                  arriving on it out of order will not have read the row.
                  &ldquo;Select&rdquo; repeated down a column is useless;
                  &ldquo;Select row for Alice Nguyen&rdquo; is not. Build the name
                  from the row&rsquo;s header text with{" "}
                  <code>aria-label</code> or a visually hidden span:
                </p>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`<td>
  <button type="button" aria-label="Delete invoice INV-2041">
    <TrashIcon aria-hidden="true" />
  </button>
</td>`}</code></pre>
                </div>
                <div className="not-prose rounded-lg border border-teal-200 dark:border-teal-900/50 bg-teal-50 dark:bg-teal-950/20 p-5 my-6">
                  <p className="text-sm font-semibold text-teal-900 dark:text-teal-200 mb-2">
                    The line between a table and a grid
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    If the user reads, sorts, and clicks the occasional control,
                    keep a plain <code>&lt;table&gt;</code>: the screen reader
                    handles cell navigation for free, and each control is just a
                    normal focusable element in the Tab order. The moment the user
                    needs to <em>navigate cell to cell with the arrow keys</em> or
                    edit values in place, as in a spreadsheet, you have crossed
                    into grid territory and owe the full{" "}
                    <code>role=&quot;grid&quot;</code> keyboard model. That is a
                    much larger build, covered end to end in the{" "}
                    <Link href="/guides/accessible-data-grid" className="text-blue-600 dark:text-blue-400 hover:underline">
                      accessible data grid guide
                    </Link>
                    . Most tables never need it.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 7. ARIA table roles, the fallback */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                7. ARIA Table Roles: the Fallback, Not the Upgrade
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  ARIA provides a full set of table roles,{" "}
                  <code>role=&quot;table&quot;</code>,{" "}
                  <code>role=&quot;rowgroup&quot;</code>,{" "}
                  <code>role=&quot;row&quot;</code>,{" "}
                  <code>role=&quot;columnheader&quot;</code>,{" "}
                  <code>role=&quot;rowheader&quot;</code>, and{" "}
                  <code>role=&quot;cell&quot;</code>, that let you build a table out
                  of non-table elements such as divs. They exist for one situation:
                  when you genuinely cannot use a real{" "}
                  <code>&lt;table&gt;</code>, most often a virtualised table that
                  renders only the visible rows for performance and needs full
                  control over the DOM.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  This is the{" "}
                  <Link href="/guides/using-aria" className="text-blue-600 dark:text-blue-400 hover:underline">
                    first rule of ARIA
                  </Link>{" "}
                  in action: if a native element already does the job, use it
                  instead of rebuilding it. A div-based ARIA table makes you
                  reconstruct by hand everything <code>&lt;table&gt;</code> gives
                  you for free, and any gap breaks the reading:
                </p>
                <ul className="text-muted-foreground leading-relaxed mb-4 list-disc pl-6 space-y-2">
                  <li>
                    Every element must mirror the native structure exactly:{" "}
                    <code>role=&quot;row&quot;</code> only ever contains cells, and
                    every cell sits inside a row inside a rowgroup inside the table.
                  </li>
                  <li>
                    Header cells need{" "}
                    <code>role=&quot;columnheader&quot;</code> or{" "}
                    <code>role=&quot;rowheader&quot;</code>; the header-to-cell
                    association that <code>scope</code> gave you for free now has to
                    come from that structure.
                  </li>
                  <li>
                    Because a virtualised table has only some rows in the DOM, you
                    must add <code>aria-rowcount</code> and{" "}
                    <code>aria-colcount</code> on the table and{" "}
                    <code>aria-rowindex</code> and <code>aria-colindex</code> on the
                    rows and cells, so the user hears &ldquo;row 40 of
                    10,000&rdquo; instead of &ldquo;row 40 of 20&rdquo;.
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The verdict is the same one that runs through every part of this
                  guide: a real <code>&lt;table&gt;</code> with{" "}
                  <code>&lt;th scope&gt;</code> is more robust, better supported,
                  and less code than any div-and-ARIA reconstruction. Reach for the
                  ARIA table roles only when there is truly no alternative, and when
                  you do, mirror the native element precisely.
                </p>
              </div>
            </div>
          </section>

          {/* 8. Testing */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                8. Testing a Table
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Automated checkers and manual testing catch different problems,
                  and a table needs both.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-2 mb-3">
                  Automated: the first pass
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Scanners such as{" "}
                  <Link href="/guides/axe-vs-wave" className="text-blue-600 dark:text-blue-400 hover:underline">
                    axe and WAVE
                  </Link>{" "}
                  reliably flag the structural mistakes: a{" "}
                  <code>&lt;th&gt;</code> with an empty text, a table with no header
                  cells at all, a <code>headers</code> attribute pointing at an id
                  that does not exist, and a layout table used for data. They cannot
                  judge whether your header <em>labels</em> are meaningful or
                  whether <code>scope</code> points the right way, so treat a clean
                  automated report as necessary, not sufficient. See the{" "}
                  <Link href="/guides/automated-vs-manual-accessibility-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                    automated versus manual testing guide
                  </Link>{" "}
                  for where the line falls.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                  Manual: read it with a screen reader
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The definitive test is table navigation mode. Move cell by cell
                  and listen for the header being announced with each value:
                </p>
                <ul className="text-muted-foreground leading-relaxed mb-4 list-disc pl-6 space-y-2">
                  <li>
                    In{" "}
                    <Link href="/guides/nvda-screen-reader-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                      NVDA
                    </Link>{" "}
                    and{" "}
                    <Link href="/guides/jaws-screen-reader-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                      JAWS
                    </Link>
                    , move with Ctrl plus Alt plus the arrow keys. Moving right
                    should read the column header with the value; moving down
                    should re-announce it.
                  </li>
                  <li>
                    In{" "}
                    <Link href="/guides/voiceover-screen-reader-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                      VoiceOver
                    </Link>
                    , interact with the table and move with Control plus Option plus
                    the arrow keys.
                  </li>
                  <li>
                    Open the screen reader&rsquo;s list of tables (for example
                    NVDA&rsquo;s elements list) and confirm your table appears
                    there, named by its caption.
                  </li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Then check the non-screen-reader layers: zoom the browser to 400
                  percent and narrow the viewport to 320 pixels to confirm the
                  table reflows without trapping content, and Tab through the page
                  to confirm any scroll region, sort buttons, and row controls are
                  reachable and operable by keyboard. For the full end-to-end
                  routine, the{" "}
                  <Link href="/guides/how-to-audit-website-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">
                    website accessibility audit guide
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
                Common Table Mistakes &amp; How to Fix Them
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                These are the table errors that turn up most in real-world audits.
                Each one is a small markup decision with an outsized effect on
                whether the table reads at all.
              </p>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    Common data table anti-patterns, why each one fails, and the fix
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
                <ListChecks className="h-7 w-7 text-teal-600 dark:text-teal-400" />
                The Accessible Table Checklist
              </h2>
              <ol className="space-y-4 text-muted-foreground leading-relaxed list-decimal pl-6">
                <li>
                  <strong className="text-slate-900 dark:text-white">Real table, real data.</strong>{" "}
                  The content is genuine tabular data in a semantic{" "}
                  <code>&lt;table&gt;</code>, not a layout table and not a grid of
                  divs.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">It has a caption.</strong>{" "}
                  A <code>&lt;caption&gt;</code> is the first child of the table and
                  names what the data is.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Headers are <code>&lt;th&gt;</code>.</strong>{" "}
                  Every column header and every row label is a{" "}
                  <code>&lt;th&gt;</code>, never a styled <code>&lt;td&gt;</code>.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Every <code>&lt;th&gt;</code> has a scope.</strong>{" "}
                  <code>scope=&quot;col&quot;</code> on column headers,{" "}
                  <code>scope=&quot;row&quot;</code> on row headers, colgroup or
                  rowgroup on spanning headers.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Complex tables are justified.</strong>{" "}
                  You used headers and id only where <code>scope</code> could not
                  express the structure, and considered splitting the table first.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Meaningful cell content.</strong>{" "}
                  Icons and colour-coded cells have text alternatives; blanks that
                  mean something say so; colour is never the only cue.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">It reflows.</strong>{" "}
                  At 320 pixels the table scrolls inside a labelled, focusable
                  region, or reflows to cards without losing its semantics.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Controls are named and keyboard operable.</strong>{" "}
                  Sort buttons, row checkboxes, and actions work by keyboard and
                  carry the row context in their accessible name.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">ARIA roles only if forced.</strong>{" "}
                  You reached for <code>role=&quot;table&quot;</code> only when a
                  native table was impossible, and mirrored its structure exactly.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Verified with a screen reader.</strong>{" "}
                  In table navigation mode, a single cell announces its value with
                  its column and row headers.
                </li>
              </ol>
            </div>
          </section>

          {/* CTA */}
          <section className="py-12 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <div className="rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20 p-8 text-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  Get the Relationships Right
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6 max-w-lg mx-auto">
                  Start from the criterion tables exist to serve, then decide
                  whether you need a table the user reads or a grid the user
                  operates.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button asChild size="lg" className="gap-2">
                    <Link href="/wcag/1-3-1">
                      WCAG 1.3.1 Info and Relationships
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="gap-2">
                    <Link href="/guides/accessible-data-grid">
                      Accessible Data Grid Guide
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
                content="accessible data tables html table accessibility th scope col row table caption headers id attribute complex table responsive accessible table aria-sort sortable table screen reader table navigation data table vs layout table role=table semantic html table header association 1.3.1 info and relationships 1.4.10 reflow 2.4.6 headings and labels data grid using aria"
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
