import type { Metadata } from "next"
import Link from "next/link"
import {
  CriteriaTable,
  ExplainerBlock,
  ExplainerProse,
  FailureList,
  KeyboardTable,
  PatternExplainer,
} from "@/components/learn/pattern-explainer"

const title = "Accessible Data Table Pattern"
const description =
  "Build accessible data tables: semantic markup, sortable columns with aria-sort, responsive layouts, row selection, and inline editing."

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/learn/table" },
  openGraph: {
    title,
    description,
    url: "/learn/table",
    images: [
      {
        url: `/api/og?title=${encodeURIComponent(title)}&section=Learn`,
        width: 1200,
        height: 630,
      },
    ],
  },
}

export default function TableLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <PatternExplainer id="table-explainer" title="Understanding the Data Table Pattern">
        <ExplainerProse>
          <p>
            A data table lays records out in rows and columns where the header
            cells give meaning to every data cell. Screen readers depend on that
            structure: as the user moves from cell to cell, the software reads
            the column and row headers alongside the value, which is how someone
            who cannot see the grid answers &quot;which column is this?&quot;.
            When the grid is built from divs, that relationship is gone and the
            table becomes a run of unrelated words.
          </p>
          <p>
            The demos above cover the five situations that come up in real
            products: a plain table with a caption and{" "}
            <code>&lt;th scope&gt;</code> headers; sortable columns where the
            header contains a real button and the <code>&lt;th&gt;</code>{" "}
            carries <code>aria-sort</code>; two responsive strategies, a
            focusable horizontal-scroll region and a stacked card layout built
            on a definition list; row selection with named checkboxes and an
            indeterminate select-all; and inline editing that moves focus into
            the input and back to the Edit button afterwards. Each demo pairs
            the working version with a live region that announces what
            changed.
          </p>
        </ExplainerProse>

        <ExplainerBlock title="WCAG 2.2 Success Criteria Involved">
          <CriteriaTable
            items={[
              { number: "1.3.1", note: "Header cells are th elements with scope, the table has a caption, and complex tables use headers and id so every cell maps to its headers." },
              { number: "4.1.2", note: "Sort controls are buttons with a name, aria-sort on the header reports the current direction, and checkboxes and edit fields have accessible names." },
              { number: "4.1.3", note: "Sorting, selection counts, and save or cancel results are announced through a live region because the change happens away from focus." },
              { number: "2.1.1", note: "Sort, select, and edit are keyboard operable, and a horizontally scrolling wrapper is focusable so it can be scrolled without a mouse." },
              { number: "1.4.1", note: "Sort direction and selected rows are shown by an icon or text plus aria state, never by colour alone." },
              { number: "1.4.10", note: "Data tables are the named exception to reflow at 320 CSS pixels, but the wrapper must scroll in two dimensions without hiding cells or dropping headers." },
              { number: "3.3.2", note: "Every row checkbox has a label naming the row, such as 'Select Alice Johnson', and the edit field is labelled with what is being edited." },
              { number: "2.4.7", note: "Buttons inside header cells, checkboxes, and edit inputs all show a visible focus indicator within the dense grid." },
              { number: "2.4.3", note: "Entering edit mode moves focus to the input; saving or cancelling returns it to the control that started the edit." },
            ]}
          />
        </ExplainerBlock>

        <ExplainerBlock title="Expected Keyboard Interaction">
          <KeyboardTable
            caption="Keyboard interaction for the data table demos"
            rows={[
              { keys: "Tab", action: "Moves between the interactive parts of the table: sort buttons, checkboxes, Edit buttons, and the scroll region. Plain data cells are not tab stops." },
              { keys: "Enter or Space", action: "Activates a sort button (cycling ascending, descending, unsorted), toggles a checkbox, or starts an edit." },
              { keys: "Enter in an edit field", action: "Saves the value and returns focus to the Edit button." },
              { keys: "Escape in an edit field", action: "Cancels the edit and returns focus to the Edit button." },
              { keys: "Arrow keys in the scroll region", action: "Scroll the table horizontally once the wrapper has focus." },
              { keys: "Screen reader table commands", action: "Move cell by cell with headers read aloud, for example Ctrl + Alt + arrows in NVDA and JAWS, or VO + arrows in VoiceOver. These come from the screen reader, not the page." },
            ]}
          />
        </ExplainerBlock>

        <ExplainerBlock title="The Failures We See Most Often">
          <FailureList
            items={[
              {
                title: "Div soup and missing headers.",
                detail: "A grid of divs, or a real table with td elements in the header row and no caption. Table navigation commands do nothing and no cell has context.",
              },
              {
                title: "Sort controls that are not controls.",
                detail: "A click handler on the th, an arrow icon with no text, and no aria-sort. Keyboard users cannot sort and screen reader users cannot tell which column is sorted or in which direction.",
              },
              {
                title: "Responsive layouts that destroy the structure.",
                detail: "Columns hidden on small screens, or cells restyled as blocks so the header association is lost. Scroll the intact table, or rebuild each row as a card with a definition list.",
              },
            ]}
          />
        </ExplainerBlock>

        <ExplainerProse>
          <p>
            The{" "}
            <Link href="/guides/accessible-data-tables" className="text-blue-600 dark:text-blue-400 hover:underline">
              accessible data tables guide
            </Link>{" "}
            covers complex headers, row and column groups, captions versus
            aria-label, and responsive strategies in depth. If your table needs
            arrow-key navigation between cells or editable cells everywhere,
            that is a data grid, a different widget with its own keyboard
            model; the{" "}
            <Link href="/guides/accessible-data-grid" className="text-blue-600 dark:text-blue-400 hover:underline">
              accessible data grid guide
            </Link>{" "}
            explains where the line falls.
          </p>
        </ExplainerProse>
      </PatternExplainer>
    </>
  )
}
