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

const title = "Accessible Modal Dialog Pattern"
const description =
  "Build accessible modal dialogs with focus trapping, keyboard controls, backdrop and scroll handling, and proper screen reader announcements."

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/learn/modals" },
  openGraph: {
    title,
    description,
    url: "/learn/modals",
    images: [
      {
        url: `/api/og?title=${encodeURIComponent(title)}&section=Learn`,
        width: 1200,
        height: 630,
      },
    ],
  },
}

export default function ModalsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <PatternExplainer id="modal-explainer" title="Understanding the Modal Dialog Pattern">
        <ExplainerProse>
          <p>
            A modal dialog is a window layered over the page that takes over
            interaction until it is dismissed. While it is open, everything
            behind it should be inert: not focusable, not readable by a screen
            reader, and not scrollable. That takeover is exactly what makes the
            pattern risky. Done well it is a short, predictable interruption
            with an obvious exit. Done badly it is either a trap that keyboard
            users cannot leave or, more often, a layer that keyboard and screen
            reader users never reach because focus stayed on the page beneath
            it.
          </p>
          <p>
            The demo above implements the pattern by hand so each part is
            visible: a container with <code>role=&quot;dialog&quot;</code> and{" "}
            <code>aria-modal=&quot;true&quot;</code>, a heading referenced by{" "}
            <code>aria-labelledby</code>, focus moved into the container on
            open, Tab and Shift+Tab wrapped inside it, Escape and a labelled
            close button to dismiss, scrolling locked on the body, and focus
            returned to the button that opened it. The native{" "}
            <code>&lt;dialog&gt;</code> element with <code>showModal()</code>{" "}
            gives you most of this for free and is the better choice in new
            code.
          </p>
        </ExplainerProse>

        <ExplainerBlock title="WCAG 2.2 Success Criteria Involved">
          <CriteriaTable
            items={[
              { number: "2.1.1", note: "The dialog can be opened, operated, and closed with the keyboard alone." },
              { number: "2.1.2", note: "Holding focus inside the dialog is acceptable only because Escape and the close button let the user leave; without an exit, the trap is a failure." },
              { number: "2.4.3", note: "Focus moves into the dialog when it opens and back to the trigger when it closes, so the sequence stays meaningful." },
              { number: "2.4.7", note: "Every control inside the dialog, including the icon-only close button, shows a visible focus indicator." },
              { number: "4.1.2", note: "The dialog exposes its role, its modal state, and an accessible name taken from its heading." },
              { number: "1.3.1", note: "The title is a real heading and is programmatically associated with the dialog, not just placed near it." },
              { number: "3.2.1", note: "A dialog must not open merely because an element received focus; opening is a change of context and needs an explicit action." },
            ]}
          />
        </ExplainerBlock>

        <ExplainerBlock title="Expected Keyboard Interaction">
          <KeyboardTable
            caption="Keyboard interaction for a modal dialog"
            rows={[
              { keys: "Enter or Space", action: "On the trigger button: opens the dialog and moves focus inside it." },
              { keys: "Tab", action: "Moves to the next focusable control inside the dialog; from the last control it wraps to the first." },
              { keys: "Shift + Tab", action: "Moves to the previous control; from the first it wraps to the last." },
              { keys: "Escape", action: "Closes the dialog and returns focus to the element that opened it." },
              { keys: "Enter or Space", action: "On Confirm, Cancel, or Close: activates that control; Cancel and Close also return focus to the trigger." },
            ]}
          />
        </ExplainerBlock>

        <ExplainerBlock title="The Failures We See Most Often">
          <FailureList
            items={[
              {
                title: "Focus never enters the dialog.",
                detail: "The overlay is shown with CSS while focus stays on the page behind it, so a keyboard user keeps tabbing through content they cannot see and a screen reader never announces that anything opened.",
              },
              {
                title: "There is no keyboard exit.",
                detail: "No Escape handler, and a close control that is an icon in a span with no name. Mouse users click the backdrop; everyone else is stuck.",
              },
              {
                title: "Focus is not restored on close.",
                detail: "Closing the dialog drops focus to the top of the document. The user loses their place and has to tab back through the whole page to continue.",
              },
            ]}
          />
        </ExplainerBlock>

        <ExplainerProse>
          <p>
            The{" "}
            <Link href="/guides/accessible-dialog" className="text-blue-600 dark:text-blue-400 hover:underline">
              accessible dialog and modal guide
            </Link>{" "}
            goes further: the native <code>&lt;dialog&gt;</code> element and{" "}
            <code>showModal()</code>, where initial focus should land for
            confirmation dialogs versus forms, what to do when the trigger has
            been removed from the page, and when <code>alertdialog</code> is the
            right role.
          </p>
        </ExplainerProse>
      </PatternExplainer>
    </>
  )
}
