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

const title = "Accessible Pagination Pattern"
const description =
  "Make numbered pages, infinite scroll, load-more buttons, and cursor pagination accessible with keyboard support, focus management, and announcements."

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/learn/pagination" },
  openGraph: {
    title,
    description,
    url: "/learn/pagination",
    images: [
      {
        url: `/api/og?title=${encodeURIComponent(title)}&section=Learn`,
        width: 1200,
        height: 630,
      },
    ],
  },
}

export default function PaginationLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <PatternExplainer id="pagination-explainer" title="Understanding the Pagination Pattern">
        <ExplainerProse>
          <p>
            Pagination splits a long list into pages and gives the user a way to
            move between them: numbered links, Previous and Next, a Load More
            button, or automatic loading as the user scrolls. The controls are
            simple. The accessibility work is in three things the controls do
            not show on their own: telling the user where they are, telling
            them what changed, and putting keyboard focus somewhere sensible
            afterwards.
          </p>
          <p>
            The demo above builds numbered pagination as a{" "}
            <code>&lt;nav&gt;</code> landmark named &quot;Pagination&quot;
            containing a list of buttons, marks the current page with{" "}
            <code>aria-current=&quot;page&quot;</code>, gives every control a
            full name such as &quot;Go to page 3&quot;, hides the decorative
            ellipsis, and announces &quot;Page 3 of 10&quot; through a live
            region. The Load More section shows the other half of the pattern:
            after new items arrive, focus moves to the first of them so a
            keyboard user lands on the new content instead of at the button
            they just pressed.
          </p>
        </ExplainerProse>

        <ExplainerBlock title="WCAG 2.2 Success Criteria Involved">
          <CriteriaTable
            items={[
              { number: "1.3.1", note: "A named navigation landmark and a real list expose the structure that the visual row of numbers implies." },
              { number: "2.4.4", note: "Each control's name says what it does: 'Go to page 3', 'Previous page', not a bare number or an arrow glyph." },
              { number: "1.4.1", note: "The current page is identified by aria-current and a visual cue beyond colour, such as weight or a border." },
              { number: "4.1.3", note: "When the page changes without a reload, or more items load, the change is announced through a live region because focus did not move to it." },
              { number: "2.4.3", note: "After Load More, focus moves to the first new item; after a page change, it stays on the control or moves to the results heading." },
              { number: "2.5.8", note: "Page-number targets packed tightly together need 24 by 24 CSS pixels each, or spacing that keeps 24 pixel circles from overlapping." },
              { number: "2.4.1", note: "The landmark lets screen reader users jump straight to the pagination instead of reading through every result." },
              { number: "3.2.3", note: "The same pagination control appears in the same place on every listing page across the site." },
            ]}
          />
        </ExplainerBlock>

        <ExplainerBlock title="Expected Keyboard Interaction">
          <KeyboardTable
            caption="Keyboard interaction for pagination controls"
            rows={[
              { keys: "Tab", action: "Moves through Previous, each visible page number, and Next in reading order. Disabled Previous and Next remain in the page but are skipped." },
              { keys: "Shift + Tab", action: "Moves backwards through the same controls." },
              { keys: "Enter", action: "Follows a page link, or activates a page button, and triggers the page-change announcement." },
              { keys: "Space", action: "Activates a page control built as a button; links do not respond to Space." },
              { keys: "Enter or Space on Load More", action: "Loads the next batch, announces the count, and moves focus to the first new item." },
            ]}
          />
        </ExplainerBlock>

        <ExplainerBlock title="The Failures We See Most Often">
          <FailureList
            items={[
              {
                title: "Divs and spans with click handlers.",
                detail: "The numbers look like links but are not focusable, have no role, and cannot be activated from the keyboard. Use anchors when a page has a URL and buttons when it does not.",
              },
              {
                title: "Current page shown by colour only.",
                detail: "A filled background and nothing else. Without aria-current a screen reader hears a list of identical numbers, and a user who cannot distinguish the colour sees the same.",
              },
              {
                title: "Silent updates.",
                detail: "In a single-page app the results swap with no announcement, or infinite scroll keeps loading without telling anyone, and the footer becomes unreachable. Announce the change, and offer a Load More or View All alternative to endless scrolling.",
              },
            ]}
          />
        </ExplainerBlock>

        <ExplainerProse>
          <p>
            The{" "}
            <Link href="/guides/accessible-pagination" className="text-blue-600 dark:text-blue-400 hover:underline">
              accessible pagination guide
            </Link>{" "}
            covers the choice between links and buttons, URL and title updates
            for each page, how to handle very long page ranges, and the trade
            offs between numbered pages, Load More, and infinite scroll for
            different kinds of content.
          </p>
        </ExplainerProse>
      </PatternExplainer>
    </>
  )
}
