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

const title = "Accessible Search Pattern"
const description =
  "Build accessible search with the ARIA combobox pattern: keyboard controls, live result announcements, and loading and empty states done right."

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/learn/search" },
  openGraph: {
    title,
    description,
    url: "/learn/search",
    images: [
      {
        url: `/api/og?title=${encodeURIComponent(title)}&section=Learn`,
        width: 1200,
        height: 630,
      },
    ],
  },
}

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <PatternExplainer id="search-explainer" title="Understanding the Search and Autocomplete Pattern">
        <ExplainerProse>
          <p>
            A search box that offers suggestions as you type is a combobox: a
            text input combined with a popup list of options that filters on
            every keystroke. The WAI-ARIA combobox pattern defines the roles and
            states that make the relationship between the two parts explicit.
            The demo above uses the list-autocomplete variant, where the popup
            is a listbox, the options are not editable, and keyboard focus stays
            in the input the whole time so the user can keep typing while they
            browse.
          </p>
          <p>
            That last point is the heart of the pattern. Instead of moving
            focus into the list, the input carries{" "}
            <code>aria-activedescendant</code>, which names the option that is
            currently highlighted. The screen reader announces the highlighted
            option while the caret, and real focus, never leave the text field.
            The input also reports whether the popup is open with{" "}
            <code>aria-expanded</code> and points at it with{" "}
            <code>aria-controls</code>, and a polite live region announces how
            many results are available, or that there are none, because
            nothing else would tell a screen reader user that the list had
            appeared.
          </p>
        </ExplainerProse>

        <ExplainerBlock title="WCAG 2.2 Success Criteria Involved">
          <CriteriaTable
            items={[
              { number: "4.1.2", note: "The input has role combobox with aria-expanded, aria-controls, and aria-activedescendant; the popup is a listbox of options with aria-selected on the highlighted one." },
              { number: "3.3.2", note: "The field has a label. Placeholder text is not a label; it disappears when the user types and is often too faint to read." },
              { number: "2.1.1", note: "Every option can be reached and chosen with the keyboard; a mouse-only click handler on the list items is a failure." },
              { number: "4.1.3", note: "Result counts, 'no results', and 'loading' are announced through a live region because focus stays in the input and does not reach the list." },
              { number: "3.2.2", note: "Typing must not submit the form or navigate away on its own; choosing a suggestion fills the field and leaves the user in control." },
              { number: "2.4.7", note: "The input shows a focus indicator, and the highlighted option is visually distinct from the others in a way that is not colour alone." },
              { number: "1.3.1", note: "The option list is a real list with listbox and option semantics, not a set of divs styled to look like one." },
              { number: "2.4.6", note: "The label says what can be searched so the user knows what kind of text to enter." },
            ]}
          />
        </ExplainerBlock>

        <ExplainerBlock title="Expected Keyboard Interaction">
          <KeyboardTable
            caption="Keyboard interaction for the search combobox demo"
            rows={[
              { keys: "Typing", action: "Filters the options and opens the popup when there is a query; the count is announced." },
              { keys: "Down arrow", action: "Highlights the next option and wraps from the last to the first. The caret does not move because the default is prevented." },
              { keys: "Up arrow", action: "Highlights the previous option and wraps from the first to the last." },
              { keys: "Enter", action: "Chooses the highlighted option: the input takes its value, the popup closes, and the selection is announced." },
              { keys: "Escape", action: "Closes the popup and clears the highlight; the typed text is kept." },
              { keys: "Tab", action: "Leaves the field for the next control; the popup closes without changing the value." },
            ]}
          />
        </ExplainerBlock>

        <ExplainerBlock title="The Failures We See Most Often">
          <FailureList
            items={[
              {
                title: "Missing state attributes.",
                detail: "The input is a plain text field with a list drawn beneath it. Without aria-expanded, aria-controls, and aria-activedescendant a screen reader hears 'edit text' and nothing about the suggestions.",
              },
              {
                title: "Results that are never announced.",
                detail: "Sighted users see the list appear. Screen reader users hear nothing, keep typing, and never learn there were matches, or that there were none.",
              },
              {
                title: "Arrow keys that fight the input.",
                detail: "Either real focus is moved into the list so typing stops working, or the arrow key default is not prevented and the caret jumps to the start or end of the text while the highlight moves.",
              },
            ]}
          />
        </ExplainerBlock>

        <ExplainerProse>
          <p>
            The{" "}
            <Link href="/guides/accessible-combobox" className="text-blue-600 dark:text-blue-400 hover:underline">
              accessible combobox guide
            </Link>{" "}
            covers the other variants of the pattern, including editable
            comboboxes and select-only ones, the difference between
            aria-activedescendant and moving focus, debouncing and loading
            states, and how the native <code>&lt;datalist&gt;</code> compares.
          </p>
        </ExplainerProse>
      </PatternExplainer>
    </>
  )
}
