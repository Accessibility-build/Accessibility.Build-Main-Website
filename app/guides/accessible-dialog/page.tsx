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
  PanelTop,
  Keyboard,
  ShieldCheck,
  ListChecks,
  Layers,
  Focus,
  Code2,
  GitBranch,
  AlertTriangle,
  Undo2,
  Sparkles,
} from "lucide-react"

const pageTitle = "Accessible Dialog & Modal Guide (WAI-ARIA + <dialog>)"
const pageDescription =
  "You almost certainly do not need a hand-rolled focus trap any more. This guide covers the native <dialog> element and showModal(), where initial focus belongs (not the close button), focus restoration, the inert top layer, alertdialog, zero-JavaScript dialogs with command and commandfor, scroll locking, and React portals — with copy-ready code mapped to WCAG 2.2."

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords: [
    "accessible dialog",
    "accessible modal",
    "html dialog element",
    "showModal accessibility",
    "aria-modal",
    "role dialog",
    "role alertdialog",
    "focus trap accessibility",
    "modal focus management",
    "inert attribute",
    "dialog keyboard accessibility",
    "escape key close modal",
    "focus restoration modal",
    "react accessible modal",
    "commandfor dialog",
    "wai-aria dialog pattern",
    "wcag modal dialog",
    "modal scroll lock accessibility",
  ],
  alternates: {
    canonical: "/guides/accessible-dialog",
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: "/guides/accessible-dialog",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: `/api/og?title=${encodeURIComponent("Accessible Dialog & Modal Guide")}&section=Guide`,
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
        url: `/api/og?title=${encodeURIComponent("Accessible Dialog & Modal Guide")}&section=Guide`,
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
    name: "Accessible Dialog & Modal Guide",
    url: "https://accessibility.build/guides/accessible-dialog",
  },
]

const faqs = [
  {
    question: "Do I still need a focus trap for a modal dialog?",
    answer:
      "Not if you use the native <dialog> element with showModal(). Calling showModal() promotes the dialog into the browser's top layer and makes every other element in the document inert, which means content outside the dialog is not focusable, not clickable, and not reachable by assistive technology. Tab therefore cannot escape, because there is nothing outside to move to — you get the effect of a focus trap without writing one. Focus may still cycle out to browser UI such as the address bar, which is correct and expected behaviour that no dialog should prevent. You only need to build a trap yourself if you cannot use the native element, in which case you must combine role=\"dialog\", aria-modal=\"true\", the inert attribute on the background content, and your own Tab and Shift+Tab wrapping logic.",
  },
  {
    question: "Where should focus go when a dialog opens?",
    answer:
      "Onto the first thing the user needs, which is rarely the close button. The WAI-ARIA Authoring Practices give four cases. If the dialog is mostly interactive with few controls, focus the element the user is most likely to want, such as the first form field or the primary confirm button. If the dialog contains substantial reading content, focus a static element at the top — the heading with tabindex=\"-1\" — so the content is not scrolled past. If the action is destructive, focus the least destructive option so an accidental Enter press cannot delete anything. And if the dialog is a simple confirmation, focus the button that continues the workflow. In the native <dialog> element, express your choice with the autofocus attribute rather than leaving it to the browser's default.",
  },
  {
    question: "What happens if I do not set autofocus on a native dialog?",
    answer:
      "The browser follows the specification's dialog focusing steps: it looks for a descendant with the autofocus attribute, and if there is none it falls back to the dialog's focus delegate, which is effectively the first focusable descendant; if the dialog has no focusable descendant at all, focus lands on the <dialog> element itself. In practice the first focusable descendant is very often the ✕ close button in the corner, because that is where it sits in the markup. That is a poor landing spot — a screen reader user hears \"Close, button\" and learns nothing about what the dialog is for. Always set autofocus deliberately on the element that represents the dialog's purpose.",
  },
  {
    question: "Should I add role=\"dialog\" and aria-modal=\"true\" to a native <dialog> element?",
    answer:
      "No. A native <dialog> is already exposed with the dialog role, and browsers set the modal state for you: a dialog opened with showModal() is exposed as modal, while one opened with show() or the open attribute is exposed as non-modal. Adding the attributes by hand is redundant and, in the case of aria-modal, actively risky — it fights with the state the browser is already computing. You do still need to give the dialog an accessible name with aria-labelledby pointing at its heading, or aria-label if there is no visible title. The one role you may legitimately add is role=\"alertdialog\", which overrides the implicit dialog role for urgent messages that require a response.",
  },
  {
    question: "When should I use role=\"alertdialog\" instead of a plain dialog?",
    answer:
      "Use alertdialog when the dialog interrupts the user with an urgent message that needs an immediate response — a confirmation before deleting data, a session-expiry warning, a failed-payment notice. The role tells assistive technology to treat the contents as an alert, so screen readers announce the message text on open rather than waiting for the user to explore. It carries a requirement: an alertdialog must contain the message as descendant text, referenced by aria-describedby, and it must contain at least one focusable control. Do not use it for ordinary dialogs such as a settings panel or a sign-in form; the extra urgency is noise, and overusing it trains users to ignore it.",
  },
  {
    question: "Can I open a modal dialog without any JavaScript?",
    answer:
      "Yes, using the Invoker Commands attributes command and commandfor on a button. A button with commandfor=\"my-dialog\" and command=\"show-modal\" opens that dialog modally, and a button inside with command=\"close\" closes it — no event listeners, no script. The commands available for dialogs are show-modal, close, and request-close. This reached interoperable support across Chrome, Edge, Firefox, and Safari during 2025, so treat it as a progressive enhancement for now: ship the declarative markup, and keep a small JavaScript fallback that calls showModal() for older browsers. Accessibility is unaffected either way, because the button is a real button and the dialog is a real dialog.",
  },
  {
    question: "Why does the page behind my modal still scroll?",
    answer:
      "Because inertness is about focus and interaction, not scrolling. showModal() prevents the background from being focused or clicked, but a trackpad or mouse wheel over the backdrop can still scroll the document underneath in some browsers, which is disorienting and can push the dialog's own content out of view. The usual fix is to set overflow: hidden on the document element while the dialog is open and restore it on close. Be careful on iOS, where changing overflow on the body can jump the scroll position; capture and restore scrollTop if you see that. Never solve it by disabling scrolling inside the dialog itself — a long dialog must remain scrollable, or its content becomes unreachable at small viewport sizes and high zoom.",
  },
  {
    question: "How do I test a dialog for accessibility?",
    answer:
      "Six minutes of keyboard and screen reader work catches almost everything automated tools miss. Open the dialog from the keyboard and note where focus lands and what is announced. Press Tab repeatedly and confirm you never reach anything behind the dialog. Press Escape and confirm the dialog closes and focus returns to the exact button that opened it. Resize to a narrow viewport and zoom to 400% to confirm the dialog scrolls rather than clipping its buttons. Check that the focused element inside the dialog is never hidden behind a sticky header or the dialog's own footer, which is WCAG 2.4.11. Then run an automated scan for the mechanical failures — a missing accessible name, a broken aria-labelledby reference, or insufficient contrast on the backdrop overlay.",
  },
]

const keyboardRows = [
  {
    key: "Enter / Space (on the trigger)",
    action:
      "Opens the dialog and moves focus into it, onto the element you marked with autofocus.",
  },
  {
    key: "Tab",
    action:
      "Moves to the next focusable element inside the dialog, then cycles back to the first. Content behind the dialog is never reached.",
  },
  {
    key: "Shift + Tab",
    action:
      "Moves to the previous focusable element, cycling to the last when on the first.",
  },
  {
    key: "Escape",
    action:
      "Closes the dialog and returns focus to the element that opened it. Required for every modal, with no exceptions.",
  },
  {
    key: "Enter (on a default button)",
    action:
      "Activates the primary action. Never wire Enter to a destructive action that has no confirmation.",
  },
  {
    key: "Arrow keys",
    action:
      "Belong to the widgets inside the dialog — a listbox, a radio group — not to the dialog itself. A dialog is not a composite widget.",
  },
]

const attributeRows = [
  {
    element: "The dialog container",
    role: "<dialog> (role=\"dialog\" is implicit)",
    attrs:
      "aria-labelledby pointing at the dialog's heading, or aria-label when there is no visible title. Do not add aria-modal by hand — showModal() sets the modal state for you.",
  },
  {
    element: "The dialog heading",
    role: "<h2> (or the level that fits the page)",
    attrs:
      "A unique id that the container's aria-labelledby references. Every dialog needs a name; an unnamed dialog is announced as just \"dialog\".",
  },
  {
    element: "An urgent dialog",
    role: 'role="alertdialog"',
    attrs:
      "Overrides the implicit dialog role. Requires descendant message text referenced by aria-describedby and at least one focusable control.",
  },
  {
    element: "The initial focus target",
    role: "Any focusable element, or a heading with tabindex=\"-1\"",
    attrs:
      "autofocus, placed deliberately. Without it the browser falls back to the first focusable descendant, which is usually the wrong element.",
  },
  {
    element: "The trigger button",
    role: "<button> (no role needed)",
    attrs:
      "A clear accessible name describing what opens. aria-haspopup=\"dialog\" is optional and adds little; aria-expanded does not apply to modal dialogs.",
  },
  {
    element: "Background content",
    role: "No role change",
    attrs:
      "inert, but only if you are not using showModal(). The native modal path makes the rest of the document inert automatically.",
  },
]

const antiPatterns = [
  {
    bad: "A <div> with a class of .modal and no role or accessible name.",
    why: "Assistive technology has no idea a dialog opened; the content is announced as ordinary page content wherever it happens to sit in the DOM (1.3.1, 4.1.2).",
    fix: "Use <dialog> with showModal(), or role=\"dialog\" plus aria-modal=\"true\" and an accessible name.",
  },
  {
    bad: "Focus stays on the trigger button, or jumps to the top of the page, when the dialog opens.",
    why: "A keyboard user has to Tab blindly through the whole page to reach the dialog, and a screen reader user is never told it appeared (2.4.3).",
    fix: "Move focus into the dialog on open, onto the element marked with autofocus.",
  },
  {
    bad: "Focus is dumped on <body> when the dialog closes.",
    why: "The user loses their place entirely and restarts from the top of the document on the next Tab press (2.4.3).",
    fix: "Restore focus to the exact element that opened the dialog. The native element does this for you.",
  },
  {
    bad: "Escape does nothing, or closes the dialog only when a specific element has focus.",
    why: "The keyboard user has no reliable, consistent way out of the dialog (2.1.2).",
    fix: "Escape closes any modal from anywhere inside it. showModal() gives you this behaviour free.",
  },
  {
    bad: "Tab reaches links and buttons on the page behind the dialog.",
    why: "The user operates invisible controls they cannot see, and the modal promise is broken (2.4.3, 2.1.1).",
    fix: "Use showModal(), or apply inert to every sibling of the dialog and manage Tab wrapping yourself.",
  },
  {
    bad: "autofocus is on the ✕ close button.",
    why: "The first thing announced is \"Close, button\", which tells the user nothing about why the dialog appeared (2.4.3).",
    fix: "Put autofocus on the first field, the primary action, or the heading with tabindex=\"-1\".",
  },
  {
    bad: "The dialog is fixed-height with the buttons pinned below the fold.",
    why: "At 400% zoom or on a short viewport the confirm button is unreachable and the focused element is obscured (1.4.10, 2.4.11).",
    fix: "Cap the dialog with max-height and let its body scroll; keep the action row inside the scrollable box.",
  },
  {
    bad: "A dialog that opens automatically on page load and cannot be dismissed by keyboard.",
    why: "It becomes a keyboard trap on the very first interaction with the page (2.1.2).",
    fix: "Give every dialog a keyboard-reachable close control and Escape handling, whatever triggered it.",
  },
]

export default function AccessibleDialogGuidePage() {
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
                    Accessible Dialog
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
                Accessible Dialog &amp; Modal Guide
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                You almost certainly do not need a hand-rolled focus trap any
                more. This guide covers the native{" "}
                <code>&lt;dialog&gt;</code> element and{" "}
                <code>showModal()</code>, where initial focus really belongs,
                focus restoration, the inert top layer,{" "}
                <code>alertdialog</code>, scroll locking, and the ARIA fallback
                for when you cannot use the native element — with copy-ready
                code mapped to WCAG 2.2.
              </p>
            </div>
          </section>

          {/* What & why */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                The Focus Trap You Were Told to Build Is Now Obsolete
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  For most of the last decade, building an accessible modal
                  meant writing the same two hundred lines every time: query all
                  the focusable elements inside the container, remember the
                  first and the last, intercept every{" "}
                  <kbd>Tab</kbd> and <kbd>Shift</kbd>+<kbd>Tab</kbd> to wrap
                  focus around, hide the rest of the page from screen readers,
                  bolt on an <kbd>Escape</kbd> handler, and remember which
                  element to focus again on close. Every implementation got some
                  part of it wrong, usually the part where a newly rendered
                  button inside the dialog was never added to the focusable
                  list.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  That work is now done for you. The HTML{" "}
                  <code>&lt;dialog&gt;</code> element, opened with{" "}
                  <code>showModal()</code>, promotes itself into the browser
                  &apos;s{" "}
                  <strong className="text-slate-900 dark:text-white">
                    top layer
                  </strong>{" "}
                  and makes every other element in the document{" "}
                  <strong className="text-slate-900 dark:text-white">
                    inert
                  </strong>
                  . Content outside the dialog stops being focusable, clickable,
                  and reachable by assistive technology. Tab cannot escape,
                  because there is nowhere outside to go. Escape closes the
                  dialog. Focus returns to the element that opened it. None of
                  that is your code.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  So this guide spends its time on the parts that are still your
                  job, and that nearly every dialog on the web still gets wrong:
                  deciding whether you need a modal at all, choosing where
                  initial focus lands,{" "}
                  <em>naming</em> the dialog, keeping the focused control
                  visible at 400% zoom, and knowing when{" "}
                  <code>role=&quot;alertdialog&quot;</code> is warranted. It
                  follows the{" "}
                  <a
                    href="https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    WAI-ARIA Authoring Practices Modal Dialog pattern
                  </a>{" "}
                  and maps every requirement to WCAG 2.2. It also covers the
                  full ARIA fallback, because plenty of design systems still
                  cannot adopt the native element overnight.
                </p>
                <div className="rounded-lg border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 p-5 my-6">
                  <p className="text-sm text-slate-800 dark:text-amber-100 leading-relaxed flex gap-3">
                    <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
                    <span>
                      <strong>
                        The one thing the browser cannot decide for you: where
                        focus lands.
                      </strong>{" "}
                      Left to its own devices, the browser focuses the first
                      focusable element in the dialog — which is almost always
                      the <span aria-hidden="true">✕</span> close button in the
                      corner. Your user hears &ldquo;Close, button&rdquo; and
                      learns nothing. Set <code>autofocus</code> deliberately.
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
                The WCAG 2.2 Criteria a Dialog Must Satisfy
              </h2>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    WCAG 2.2 success criteria that a correctly built modal
                    dialog satisfies and what each requires
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
                        What the dialog must do
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
                      <td className="px-4 py-3">The dialog is exposed as a dialog, with a heading that names it and a programmatic label pointing at that heading.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-1-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.1.1 Keyboard
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Open, operate every control, and close — entirely from the keyboard, including the close affordance.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-1-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.1.2 No Keyboard Trap
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Escape always dismisses the dialog. A modal confines focus deliberately, which is allowed only because there is a way out.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-4-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.4.3 Focus Order
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Focus moves into the dialog on open and back to the triggering element on close, preserving the user&apos;s place.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-4-7" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.4.7 Focus Visible
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">Every control inside the dialog has a clearly visible focus indicator against the dialog&apos;s own background.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-4-11" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.4.11 Focus Not Obscured
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">The focused element is never hidden behind the dialog&apos;s sticky footer, its own header, or content the dialog overlays.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-4-10" className="text-blue-600 dark:text-blue-400 hover:underline">
                          1.4.10 Reflow
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">At 320 CSS pixels wide and 400% zoom the dialog scrolls in one direction; buttons never fall outside the viewport.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/4-1-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                          4.1.2 Name, Role, Value
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">The container exposes the dialog role and an accessible name; the modal state is conveyed to assistive technology.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-muted-foreground leading-relaxed mt-6">
                <Link href="/wcag/2-4-11" className="text-blue-600 dark:text-blue-400 hover:underline">
                  2.4.11 Focus Not Obscured
                </Link>{" "}
                is the criterion dialogs fail most often and audits catch least
                often, because it only shows up once the dialog body scrolls: a
                sticky action row at the bottom quietly covers the input you
                just tabbed to. Test it by tabbing through a long dialog at a
                short viewport height, not by reading the markup.
              </p>
            </div>
          </section>

          {/* Decision */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <GitBranch className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                1. First, Decide: Modal, Non-Modal, or Not a Dialog?
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                A modal is the most disruptive component in your interface. It
                takes the whole page away from the user until they deal with it,
                which is occasionally exactly right and usually a design shortcut.
                Make this decision before you write markup, because it determines
                everything about the keyboard contract you are signing up for.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Modal dialog</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      The user{" "}
                      <strong className="text-slate-900 dark:text-white">
                        must respond
                      </strong>{" "}
                      before continuing — confirm a deletion, complete a payment
                      step, resolve a conflict. Everything else goes inert.
                      Built with <code>showModal()</code>. This is what the rest
                      of the guide covers.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Non-modal dialog</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      A floating panel the user can{" "}
                      <strong className="text-slate-900 dark:text-white">
                        ignore
                      </strong>{" "}
                      while working — a find-in-page bar, a chat window. Built
                      with <code>show()</code>. It gets no focus trap and no
                      inert background, and it must never pretend to be modal.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Not a dialog at all</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      A dropdown of commands is a{" "}
                      <Link href="/guides/accessible-menu" className="text-blue-600 dark:text-blue-400 hover:underline">
                        menu
                      </Link>
                      ; expandable content is an{" "}
                      <Link href="/guides/accessible-accordion" className="text-blue-600 dark:text-blue-400 hover:underline">
                        accordion or disclosure
                      </Link>
                      ; a whole form is usually just a page. None of these should
                      take the page hostage.
                    </p>
                  </CardContent>
                </Card>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                One test settles it: if the user could reasonably want to read
                or copy something from the page behind your dialog while it is
                open, it should not be modal. Cookie banners, newsletter
                interstitials, and &ldquo;are you sure you want to leave&rdquo;
                prompts fail this test constantly — they block the content the
                user came for, and for someone using a screen reader or
                magnification the page has simply vanished.
              </p>
            </div>
          </section>

          {/* Native dialog */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <PanelTop className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                2. Start With the Native <code>&lt;dialog&gt;</code> Element
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                There are three ways to show a <code>&lt;dialog&gt;</code>, and
                only one of them produces a modal. Getting this wrong is the
                single most common native-dialog bug, because all three look
                identical on screen once you have styled them.
              </p>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 mb-6">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    The three ways to open a dialog element and what each does
                  </caption>
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">Method</th>
                      <th scope="col" className="px-4 py-3 font-semibold">What you get</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top whitespace-nowrap font-mono text-xs">
                        showModal()
                      </th>
                      <td className="px-4 py-3 align-top">
                        Top layer, inert background, <code>::backdrop</code>,
                        Escape-to-close, focus moved in on open and restored on
                        close, exposed as a modal dialog. This is the one you
                        want.
                      </td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top whitespace-nowrap font-mono text-xs">
                        show()
                      </th>
                      <td className="px-4 py-3 align-top">
                        A non-modal dialog. No top layer, no inert background,
                        no backdrop, and{" "}
                        <strong className="text-slate-900 dark:text-white">
                          no Escape handling
                        </strong>
                        . Correct for a floating panel, wrong for a modal.
                      </td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top whitespace-nowrap font-mono text-xs">
                        the open attribute
                      </th>
                      <td className="px-4 py-3 align-top">
                        Equivalent to <code>show()</code>. Toggling it by hand
                        is explicitly discouraged, and it will never give you
                        modal behaviour no matter how you style it.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Here is a complete, conformant modal. Every accessibility-relevant
                decision in it is commented.
              </p>
              <pre className="overflow-x-auto rounded-lg bg-slate-900 dark:bg-slate-950 border border-slate-800 p-4 text-sm text-slate-100"><code>{`<button type="button" id="edit-trigger">Edit profile</button>

<!-- No role="dialog" and no aria-modal: the element and showModal() handle both. -->
<dialog id="edit-dialog" aria-labelledby="edit-dialog-title">
  <form method="dialog">
    <h2 id="edit-dialog-title">Edit your profile</h2>

    <label for="display-name">Display name</label>
    <!-- autofocus goes on the first meaningful control, NOT the close button. -->
    <input id="display-name" name="displayName" type="text" autofocus>

    <label for="pronouns">Pronouns</label>
    <input id="pronouns" name="pronouns" type="text">

    <div class="dialog-actions">
      <!-- value is written to dialog.returnValue when the form closes the dialog. -->
      <button value="cancel" formmethod="dialog">Cancel</button>
      <button value="save" id="save-button">Save changes</button>
    </div>
  </form>
</dialog>`}</code></pre>
              <pre className="overflow-x-auto rounded-lg bg-slate-900 dark:bg-slate-950 border border-slate-800 p-4 text-sm text-slate-100 mt-4"><code>{`const trigger = document.getElementById("edit-trigger")
const dialog = document.getElementById("edit-dialog")
const saveButton = document.getElementById("save-button")

// showModal() - not show(), not dialog.open = true.
trigger.addEventListener("click", () => dialog.showModal())

saveButton.addEventListener("click", (event) => {
  event.preventDefault()
  // ...validate and persist...
  dialog.close("save") // close(value) sets returnValue.
})

// Fires on close(), on form method="dialog" submission, and on Escape.
dialog.addEventListener("close", () => {
  if (dialog.returnValue === "save") {
    // Announce the outcome in a live region - the dialog is gone,
    // so anything it "said" on the way out is gone with it.
    document.getElementById("status").textContent = "Profile updated."
  }
  // Focus restoration is automatic here. Only restore it manually
  // if the trigger was removed or re-rendered while the dialog was open.
})

// The user pressed Escape (or a light-dismiss). Call
// event.preventDefault() here ONLY if you have unsaved changes to protect,
// and immediately give them another way out.
dialog.addEventListener("cancel", (event) => {
  if (hasUnsavedChanges()) {
    event.preventDefault()
    showUnsavedChangesWarning()
  }
})`}</code></pre>
              <div className="rounded-lg border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/30 p-5 my-6">
                <p className="text-sm text-slate-800 dark:text-blue-100 leading-relaxed flex gap-3">
                  <Sparkles className="h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
                  <span>
                    <strong>
                      <code>form method=&quot;dialog&quot;</code> is the tidiest
                      close button you will ever write.
                    </strong>{" "}
                    A submit button inside such a form closes the dialog without
                    submitting anything to a server, saves the state of the form
                    controls, and sets <code>returnValue</code> to the button
                    &apos;s <code>value</code> — so a Cancel button needs no
                    JavaScript at all, and you can tell afterwards how the
                    dialog was dismissed.
                  </span>
                </p>
              </div>
            </div>
          </section>

          {/* Anatomy */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Layers className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                3. Anatomy: Roles, States, and Properties
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                A native dialog needs far less ARIA than the tutorials suggest.
                The rule of thumb: the browser supplies the role and the modal
                state, and you supply the{" "}
                <strong className="text-slate-900 dark:text-white">name</strong>{" "}
                and the{" "}
                <strong className="text-slate-900 dark:text-white">
                  focus intent
                </strong>
                .
              </p>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    The elements in an accessible dialog and the roles and
                    attributes each needs
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
                The most consequential row is the name. A dialog without an
                accessible name is announced as, simply, &ldquo;dialog&rdquo; —
                the user is told the page has been taken over and not told why.
                Point <code>aria-labelledby</code> at the visible heading so the
                two can never drift apart. For how each role and state is exposed
                to assistive technology, see the{" "}
                <Link href="/reference/aria" className="text-blue-600 dark:text-blue-400 hover:underline">
                  ARIA roles &amp; attributes reference
                </Link>
                .
              </p>
            </div>
          </section>

          {/* Focus placement */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Focus className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                4. Where Initial Focus Belongs (Not the Close Button)
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                When a dialog is shown, the browser runs the specification&apos;s
                dialog focusing steps: it looks for a descendant carrying the{" "}
                <code>autofocus</code> attribute and focuses that; failing that
                it focuses the dialog&apos;s focus delegate, which in practice
                is the first focusable descendant; and if the dialog contains
                nothing focusable at all, focus lands on the{" "}
                <code>&lt;dialog&gt;</code> element itself.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                That fallback is why so many dialogs open by announcing
                &ldquo;Close, button&rdquo;. The <span aria-hidden="true">✕</span>{" "}
                sits first in the markup because it sits top-right on screen, so
                it wins the default. Decide for yourself instead. The Authoring
                Practices give four cases:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Mostly interactive</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      A short form or a couple of buttons. Focus the control the
                      user came for — the first input, or the button that
                      continues the workflow. Put <code>autofocus</code> on it.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Substantial reading content</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Terms, a changelog, a long explanation. Focus a static
                      element at the very top — the heading with{" "}
                      <code>tabIndex=&#123;-1&#125;</code> — so the text is not
                      scrolled past before the user can read it.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Destructive action</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      &ldquo;Delete this workspace?&rdquo; Focus the{" "}
                      <strong className="text-slate-900 dark:text-white">
                        least destructive
                      </strong>{" "}
                      option, so a reflexive Enter press cancels rather than
                      destroys.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Simple confirmation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      A single OK or Continue. Focus that button — it is both the
                      most-used control and the way out, so it is the fastest
                      landing spot for everyone.
                    </p>
                  </CardContent>
                </Card>
              </div>
              <pre className="overflow-x-auto rounded-lg bg-slate-900 dark:bg-slate-950 border border-slate-800 p-4 text-sm text-slate-100"><code>{`<!-- Reading-heavy dialog: land on the heading so nothing scrolls past. -->
<dialog id="terms" aria-labelledby="terms-title">
  <h2 id="terms-title" tabindex="-1" autofocus>Updated terms of service</h2>
  <div class="dialog-body">
    <p>...several screens of text...</p>
  </div>
  <form method="dialog">
    <button value="decline">Decline</button>
    <button value="accept">Accept</button>
  </form>
</dialog>

<!-- Destructive dialog: land on Cancel, never on Delete. -->
<dialog id="confirm-delete" role="alertdialog"
        aria-labelledby="delete-title" aria-describedby="delete-desc">
  <h2 id="delete-title">Delete workspace?</h2>
  <p id="delete-desc">
    This permanently removes 42 projects and cannot be undone.
  </p>
  <form method="dialog">
    <button value="cancel" autofocus>Cancel</button>
    <button value="delete" class="danger">Delete workspace</button>
  </form>
</dialog>`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-6">
                <code>tabindex=&quot;-1&quot;</code> makes an element
                programmatically focusable without adding it to the tab
                sequence, which is exactly what you want on a heading — you can
                send focus there, and Tab will never stop on it again. The{" "}
                <Link href="/guides/focus-management" className="text-blue-600 dark:text-blue-400 hover:underline">
                  focus management guide
                </Link>{" "}
                covers that technique and its siblings in depth.
              </p>
            </div>
          </section>

          {/* Focus restoration */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Undo2 className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                5. Focus Restoration: The Half Everyone Forgets
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Moving focus into a dialog is the half that gets implemented.
                Putting it back is the half that gets skipped, and skipping it is
                worse than it sounds: when focus is lost, most browsers reset it
                to the document body, so the user&apos;s next Tab press starts
                again from the top of the page. Someone who opened a dialog from
                a button deep in a long table is returned to the site header,
                with no explanation.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The native element handles this: a <code>&lt;dialog&gt;</code>{" "}
                remembers the previously focused element when it opens and
                refocuses it when it closes, whether the close came from{" "}
                <code>close()</code>, a <code>method=&quot;dialog&quot;</code>{" "}
                form submission, or Escape. You get it free — but only while the
                trigger still exists.
              </p>
              <div className="rounded-lg border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 p-5 my-6">
                <p className="text-sm text-slate-800 dark:text-amber-100 leading-relaxed flex gap-3">
                  <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
                  <span>
                    <strong>
                      The case you have to handle: the trigger is gone.
                    </strong>{" "}
                    A &ldquo;Delete row&rdquo; button opens a confirmation, the
                    user confirms, and the row — including the button — is
                    removed from the DOM. There is nothing left to restore focus
                    to. Decide where focus should go next and send it there
                    explicitly: the next row, the table itself, or a status
                    message announcing what happened. The same applies whenever a
                    framework re-renders the trigger into a new DOM node.
                  </span>
                </p>
              </div>
              <pre className="overflow-x-auto rounded-lg bg-slate-900 dark:bg-slate-950 border border-slate-800 p-4 text-sm text-slate-100"><code>{`// Deleting the element that opened the dialog: choose the next
// focus target yourself, because the browser has nothing to restore to.
dialog.addEventListener("close", () => {
  if (dialog.returnValue !== "delete") return

  const row = document.getElementById(pendingRowId)
  const nextRow = row.nextElementSibling ?? row.previousElementSibling
  row.remove()

  // Prefer a sibling; fall back to the container so focus is never lost.
  const target = nextRow?.querySelector("button") ?? tableWrapper
  target.focus()

  // Removal is silent to a screen reader unless you say so.
  status.textContent = "Row deleted."
})`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-6">
                Note the live region in both examples. A dialog closing is not an
                announcement — whatever the dialog said disappears with it. If
                something happened as a result, put the outcome in an{" "}
                <code>aria-live=&quot;polite&quot;</code> region that already
                exists on the page, satisfying{" "}
                <Link href="/wcag/4-1-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                  4.1.3 Status Messages
                </Link>
                .
              </p>
            </div>
          </section>

          {/* Keyboard */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Keyboard className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                6. The Keyboard Model
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                A dialog is a container, not a composite widget, so its keyboard
                contract is short. Tab and Shift+Tab move within it and wrap;
                Escape gets you out. Everything else belongs to the controls
                inside.
              </p>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    Keyboard commands a conformant modal dialog must support
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
                Escape is not negotiable. It is the one key every user of every
                assistive technology tries first, and without it a modal is a
                keyboard trap under{" "}
                <Link href="/wcag/2-1-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                  2.1.2
                </Link>
                . If you cancel the <code>cancel</code> event to protect unsaved
                work, you must replace the exit you just removed with a visible,
                keyboard-reachable one in the same breath. For the wider keyboard
                contract every custom component owes, see the{" "}
                <Link href="/guides/keyboard-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">
                  keyboard accessibility guide
                </Link>
                .
              </p>
            </div>
          </section>

          {/* Inert / fallback */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <ShieldCheck className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                7. When You Cannot Use <code>&lt;dialog&gt;</code>: The ARIA Fallback
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Some design systems cannot adopt the native element yet — a
                custom animation pipeline, a positioning requirement the top
                layer fights, or simply a component with a thousand consumers.
                The fallback is well-defined, but you now own four things the
                browser was doing for you.
              </p>
              <ol className="space-y-4 text-muted-foreground leading-relaxed list-decimal pl-6 mb-6">
                <li>
                  <strong className="text-slate-900 dark:text-white">Declare it.</strong>{" "}
                  <code>role=&quot;dialog&quot;</code> plus{" "}
                  <code>aria-modal=&quot;true&quot;</code> on the container, with{" "}
                  <code>aria-labelledby</code> naming it.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Neutralise the background.</strong>{" "}
                  Put the <code>inert</code> attribute on every sibling of the
                  dialog — not on a shared ancestor, or you will inert the dialog
                  too. <code>inert</code> removes the subtree from the tab order,
                  from pointer events, and from the accessibility tree in one
                  attribute.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Wrap Tab yourself.</strong>{" "}
                  Compute the focusable elements each time the dialog opens — not
                  once at startup — and wrap from last to first and back.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Handle Escape and restoration.</strong>{" "}
                  Store <code>document.activeElement</code> before opening and
                  refocus it on close.
                </li>
              </ol>
              <pre className="overflow-x-auto rounded-lg bg-slate-900 dark:bg-slate-950 border border-slate-800 p-4 text-sm text-slate-100"><code>{`const FOCUSABLE = [
  "a[href]", "button:not([disabled])", "input:not([disabled])",
  "select:not([disabled])", "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",")

let previouslyFocused = null

function openDialog(dialog) {
  previouslyFocused = document.activeElement

  // inert every SIBLING of the dialog, never a shared ancestor.
  for (const sibling of dialog.parentElement.children) {
    if (sibling !== dialog) sibling.inert = true
  }

  dialog.hidden = false
  // Recompute on every open: the contents may have changed since last time.
  const focusables = dialog.querySelectorAll(FOCUSABLE)
  const target = dialog.querySelector("[data-autofocus]") ?? focusables[0]
  target?.focus()

  dialog.addEventListener("keydown", onKeydown)
}

function onKeydown(event) {
  const dialog = event.currentTarget
  if (event.key === "Escape") { closeDialog(dialog); return }
  if (event.key !== "Tab") return

  const focusables = Array.from(dialog.querySelectorAll(FOCUSABLE))
  if (focusables.length === 0) return
  const first = focusables[0]
  const last = focusables[focusables.length - 1]

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

function closeDialog(dialog) {
  dialog.hidden = true
  dialog.removeEventListener("keydown", onKeydown)
  for (const sibling of dialog.parentElement.children) sibling.inert = false
  previouslyFocused?.focus() // The step people forget.
}`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-6">
                Compare that to <code>dialog.showModal()</code> and the argument
                makes itself. Note too that the fallback&apos;s selector list is
                a permanent maintenance liability: it does not know about shadow
                DOM, about <code>contenteditable</code>, or about whatever
                becomes focusable next year. That is the class of bug the native
                element exists to delete.
              </p>
            </div>
          </section>

          {/* Declarative */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Sparkles className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                8. Dialogs With No JavaScript At All
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The Invoker Commands attributes <code>command</code> and{" "}
                <code>commandfor</code> let a button open and close a dialog
                declaratively, with no event listeners. They reached
                interoperable support across Chrome, Edge, Firefox, and Safari
                during 2025, which makes them a realistic progressive
                enhancement today rather than a future note.
              </p>
              <pre className="overflow-x-auto rounded-lg bg-slate-900 dark:bg-slate-950 border border-slate-800 p-4 text-sm text-slate-100"><code>{`<!-- Opens the dialog modally. No script involved. -->
<button type="button" command="show-modal" commandfor="prefs">
  Preferences
</button>

<dialog id="prefs" aria-labelledby="prefs-title">
  <h2 id="prefs-title">Preferences</h2>
  <!-- ...settings... -->

  <!-- "close" closes immediately; "request-close" fires the cancel
       event first, so unsaved-changes logic still gets a say. -->
  <button type="button" command="request-close" commandfor="prefs" autofocus>
    Done
  </button>
</dialog>`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-6">
                Three commands apply to dialogs:{" "}
                <code>show-modal</code>, <code>close</code>, and{" "}
                <code>request-close</code>. Because the trigger is a real{" "}
                <code>&lt;button&gt;</code> and the target is a real{" "}
                <code>&lt;dialog&gt;</code>, the accessibility semantics are
                identical to the scripted version — you are removing the
                JavaScript, not the semantics. In a browser that has not shipped
                the API, the button simply does nothing, so keep a small
                listener that calls <code>showModal()</code> as a fallback until
                your support baseline catches up.
              </p>
            </div>
          </section>

          {/* Backdrop, scroll, zoom */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Layers className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                9. Backdrop, Scroll Locking, and Small Viewports
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Three visual details decide whether the dialog is usable for
                people with low vision, and none of them are handled by the
                element for you.
              </p>
              <pre className="overflow-x-auto rounded-lg bg-slate-900 dark:bg-slate-950 border border-slate-800 p-4 text-sm text-slate-100"><code>{`/* The backdrop only exists for dialogs opened with showModal(). */
dialog::backdrop {
  background: rgb(15 23 42 / 0.6);
}

dialog {
  /* Never let the dialog exceed the viewport: at 400% zoom a
     fixed height puts the action buttons out of reach (1.4.10). */
  max-height: min(80vh, 40rem);
  max-width: min(90vw, 32rem);
  display: flex;
  flex-direction: column;
  padding: 0;
}

/* Scroll the BODY of the dialog, not the dialog itself, so the
   heading and action row stay put and stay reachable. */
.dialog-body {
  overflow-y: auto;
  padding: 1.5rem;
  /* Stops a sticky action row from covering the element you just
     tabbed to - WCAG 2.4.11 Focus Not Obscured. */
  scroll-padding-block-end: 4rem;
}

@media (prefers-reduced-motion: no-preference) {
  dialog[open] { animation: dialog-in 150ms ease-out; }
}`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-6 mb-4">
                <strong className="text-slate-900 dark:text-white">
                  Scroll locking.
                </strong>{" "}
                Inertness governs focus and interaction, not scrolling — a wheel
                or trackpad gesture over the backdrop can still scroll the page
                underneath, which is disorienting when the content you are
                reading is meant to be frozen. Set{" "}
                <code>overflow: hidden</code> on the document element while the
                dialog is open and restore the previous value on close. On iOS,
                watch for the scroll position jumping to the top; capture and
                restore it if you see that. Never remove scrolling from{" "}
                <em>inside</em> the dialog — a long dialog must scroll, or its
                content becomes unreachable at high zoom.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                <strong className="text-slate-900 dark:text-white">
                  Backdrop contrast.
                </strong>{" "}
                The backdrop dims the page, but the dialog&apos;s own text still
                has to meet{" "}
                <Link href="/wcag/1-4-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                  1.4.3 Contrast (Minimum)
                </Link>{" "}
                against the dialog surface — not against the dimmed page behind
                it. A translucent dialog panel over a busy backdrop is a
                reliable way to fail. Check the real rendered colours with the{" "}
                <Link href="/tools/contrast-checker" className="text-blue-600 dark:text-blue-400 hover:underline">
                  contrast checker
                </Link>
                .
              </p>
            </div>
          </section>

          {/* alertdialog */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <AlertTriangle className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                10. <code>alertdialog</code>: For Urgent Messages Only
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <code>role=&quot;alertdialog&quot;</code> is a dialog that also
                behaves like an alert: assistive technology announces its message
                on open rather than waiting for the user to explore. Use it for
                interruptions that demand an immediate decision — a destructive
                confirmation, a session about to expire, a payment that failed
                mid-checkout.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                It carries two obligations. The message must be descendant text
                referenced by <code>aria-describedby</code>, so there is
                something to announce, and the dialog must contain at least one
                focusable control, so the user can act on it. You can put the
                role directly on a native <code>&lt;dialog&gt;</code>; it
                overrides the implicit <code>dialog</code> role while leaving the
                modal behaviour of <code>showModal()</code> intact.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Use alertdialog</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      &ldquo;Delete 42 projects permanently?&rdquo; &bull;
                      &ldquo;Your session expires in 60 seconds.&rdquo; &bull;
                      &ldquo;Payment declined — your order was not placed.&rdquo;
                      Something has gone wrong, or is about to, and the user must
                      decide now.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Use a plain dialog</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Settings panels, sign-in forms, image lightboxes, filter
                      sheets, &ldquo;share this&rdquo; menus. The user opened it
                      on purpose and nothing is at stake. Overusing the urgent
                      role teaches people to ignore it.
                    </p>
                  </CardContent>
                </Card>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                A related trap: a timeout warning is not just an{" "}
                <code>alertdialog</code> problem. If a session can expire while
                the user is reading, you also owe them{" "}
                <Link href="/wcag/2-2-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                  2.2.1 Timing Adjustable
                </Link>{" "}
                — a way to extend the time, announced early enough to act on.
                Someone using a screen reader to complete a form may need several
                times the median session.
              </p>
            </div>
          </section>

          {/* React */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Code2 className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                11. Dialogs in React
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                React&apos;s instinct is to render the dialog conditionally and
                let state drive everything. That fights the native element,
                because <code>showModal()</code> is an imperative call, not a
                prop. Keep the element mounted and drive it through a ref in an
                effect — this way the browser&apos;s focus and inertness
                machinery still runs.
              </p>
              <pre className="overflow-x-auto rounded-lg bg-slate-900 dark:bg-slate-950 border border-slate-800 p-4 text-sm text-slate-100"><code>{`import { useEffect, useId, useRef } from "react"

function ConfirmDialog({ open, onClose, onConfirm, count }) {
  const ref = useRef(null)
  const titleId = useId()
  const descId = useId()

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    // Guard on dialog.open: calling showModal() on an open dialog throws.
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    // Always rendered - never conditionally mounted, or the browser
    // has no element to move focus into and nothing to restore from.
    <dialog
      ref={ref}
      role="alertdialog"
      aria-labelledby={titleId}
      aria-describedby={descId}
      // Fires for Escape and light-dismiss as well as close():
      // keep React state in sync or the dialog cannot reopen.
      onClose={onClose}
    >
      <h2 id={titleId}>Delete workspace?</h2>
      <p id={descId}>
        This permanently removes {count} projects and cannot be undone.
      </p>
      <div className="dialog-actions">
        {/* autofocus on the safe choice, not the destructive one. */}
        <button type="button" autoFocus onClick={onClose}>
          Cancel
        </button>
        <button type="button" className="danger" onClick={onConfirm}>
          Delete workspace
        </button>
      </div>
    </dialog>
  )
}`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-6">
                Two failure modes are worth naming.{" "}
                <strong className="text-slate-900 dark:text-white">
                  Conditional mounting
                </strong>{" "}
                — <code>&#123;open &amp;&amp; &lt;dialog&gt;&#125;</code> —
                destroys the element on close, so there is nothing left to
                restore focus from, and the user is dumped on{" "}
                <code>&lt;body&gt;</code>. And{" "}
                <strong className="text-slate-900 dark:text-white">
                  forgetting <code>onClose</code>
                </strong>{" "}
                lets Escape close the dialog visually while your{" "}
                <code>open</code> state still says <code>true</code>, so the next
                click on the trigger appears to do nothing.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                For production, headless libraries remain a reasonable choice —
                Radix UI&apos;s Dialog, React Aria&apos;s{" "}
                <code>useDialog</code>, and Headless UI&apos;s{" "}
                <code>Dialog</code> all implement the pattern and handle the
                edge cases across browsers. The same guidance applies in other
                frameworks: see the{" "}
                <Link href="/guides/vue-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Vue
                </Link>{" "}
                and{" "}
                <Link href="/guides/angular-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Angular
                </Link>{" "}
                guides, and the{" "}
                <Link href="/guides/react-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">
                  React accessibility guide
                </Link>{" "}
                for the surrounding patterns. Whatever you ship, verify it
                against the testing workflow below rather than trusting the
                README.
              </p>
            </div>
          </section>

          {/* Testing */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Keyboard className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                How to Test an Accessible Dialog
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Automated tools catch a missing accessible name and a broken{" "}
                <code>aria-labelledby</code> reference. Everything that decides
                whether the dialog is actually usable — where focus goes, whether
                you can get out, whether the buttons are reachable at zoom —
                takes six minutes by hand.
              </p>
              <ol className="space-y-4 text-muted-foreground leading-relaxed list-decimal pl-6">
                <li>
                  <strong className="text-slate-900 dark:text-white">Open it from the keyboard.</strong>{" "}
                  Tab to the trigger, press Enter, and note where focus lands.
                  If the answer is &ldquo;the close button&rdquo;, fix it before
                  going further.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Tab all the way round.</strong>{" "}
                  Keep pressing Tab past the last control. Focus must cycle back
                  into the dialog and must never reach a link or button on the
                  page behind it.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Press Escape.</strong>{" "}
                  The dialog closes and focus is back on the exact element that
                  opened it — not <code>&lt;body&gt;</code>, not the top of the
                  page.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Delete the trigger.</strong>{" "}
                  If the dialog&apos;s action removes its own trigger, run that
                  path and confirm focus lands somewhere deliberate rather than
                  being lost.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Zoom to 400% and narrow to 320px.</strong>{" "}
                  The dialog body scrolls, the action buttons stay reachable, and
                  the focused field is never hidden behind a sticky footer (
                  <Link href="/wcag/2-4-11" className="text-blue-600 dark:text-blue-400 hover:underline">
                    2.4.11
                  </Link>
                  ).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Listen with a screen reader.</strong>{" "}
                  You should hear the dialog&apos;s name on open, then the
                  focused element. Try to read the page behind it — you should
                  not be able to. The{" "}
                  <Link href="/guides/screen-reader-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                    screen reader testing guide
                  </Link>{" "}
                  has the commands.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Check the outcome is announced.</strong>{" "}
                  Complete the dialog&apos;s action and confirm the result
                  reaches a live region. A dialog that closes silently after
                  saving tells a screen reader user nothing.
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
                </Link>
                , and try the interactive{" "}
                <Link href="/learn/modals" className="text-blue-600 dark:text-blue-400 hover:underline">
                  modal dialog demo
                </Link>{" "}
                to feel the difference between a correct and a broken
                implementation.
              </p>
            </div>
          </section>

          {/* Anti-patterns */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                Common Dialog Mistakes &amp; How to Fix Them
              </h2>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    Common accessible-dialog anti-patterns, why they fail, and
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
                Accessible Dialog Checklist
              </h2>
              <ol className="space-y-4 text-muted-foreground leading-relaxed list-decimal pl-6">
                <li>
                  <strong className="text-slate-900 dark:text-white">Right pattern.</strong>{" "}
                  It genuinely needs to block the page. If the user could want the
                  content behind it, it is not a modal.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Native element.</strong>{" "}
                  <code>&lt;dialog&gt;</code> opened with{" "}
                  <code>showModal()</code> — never <code>show()</code>, never the{" "}
                  <code>open</code> attribute, for a modal.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">It has a name.</strong>{" "}
                  <code>aria-labelledby</code> points at the visible heading, or{" "}
                  <code>aria-label</code> when there is no title.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Focus lands deliberately.</strong>{" "}
                  <code>autofocus</code> is on the first meaningful control, the
                  heading, or the least destructive button — never the ✕.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Focus comes back.</strong>{" "}
                  The trigger regains focus on close, and you handle the case
                  where the trigger no longer exists.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Escape works everywhere.</strong>{" "}
                  From any element inside the dialog, satisfying{" "}
                  <Link href="/wcag/2-1-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                    2.1.2
                  </Link>
                  .
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Nothing behind is reachable.</strong>{" "}
                  Tab never escapes to the page; background content is inert, not
                  merely covered.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">It survives zoom.</strong>{" "}
                  The body scrolls, buttons stay reachable at 400%, and the
                  focused element is never obscured (
                  <Link href="/wcag/2-4-11" className="text-blue-600 dark:text-blue-400 hover:underline">
                    2.4.11
                  </Link>
                  ).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">The outcome is announced.</strong>{" "}
                  Whatever the dialog did is reported in a live region after it
                  closes.
                </li>
              </ol>
              <p className="text-muted-foreground leading-relaxed mt-6">
                Work through the full{" "}
                <Link href="/checklists/wcag-2-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                  WCAG 2.2 checklist
                </Link>{" "}
                to see the dialog in the context of every other requirement.
              </p>
            </div>
          </section>

          {/* CTA */}
          <section className="py-12 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <div className="rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20 p-8 text-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  Check Your Dialogs on a Live Page
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6 max-w-lg mx-auto">
                  Scan any page with our free axe-core-powered auditor to catch
                  an unnamed dialog, a broken{" "}
                  <code>aria-labelledby</code> reference, or insufficient
                  contrast inside the panel — then run the seven-step keyboard
                  pass above for the failures no scanner can see.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button asChild size="lg" className="gap-2">
                    <Link href="/tools/url-accessibility-auditor">
                      Scan a Page Now
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="gap-2">
                    <Link href="/guides/focus-management">
                      Focus Management Guide
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
                content="accessible dialog modal html dialog element showModal aria-modal role dialog alertdialog focus trap inert top layer focus management focus restoration escape key keyboard accessibility screen reader react modal commandfor invoker commands backdrop scroll lock wcag 2.1.2 2.4.3 2.4.11 4.1.2 aria pattern menu accordion combobox tabs"
                title="Related Guides & Tools"
                maxItems={6}
                showDescriptions={true}
                excludeUrl="/guides/accessible-dialog"
              />
            </div>
          </section>
        </article>
      </div>
    </>
  )
}
