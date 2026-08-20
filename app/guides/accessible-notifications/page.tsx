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

const pageTitle = "Accessible Notifications & Toasts: A Complete Guide"
const pageDescription =
  "A toast asks a screen reader user to hear a message and act on it before it disappears, and those two demands pull against each other. This guide shows how to build notifications that everyone can perceive: the live region that has to exist before the message does, the role=status versus role=alert politeness fork, why auto-dismiss collides with WCAG 2.2.1 Timing Adjustable, why a toast must never steal focus, stacking without flooding, and status that never depends on color alone. Copy-ready HTML, JavaScript, and React mapped to WCAG 2.2 and 4.1.3 Status Messages."

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords: [
    "accessible notifications",
    "accessible toast",
    "toast accessibility",
    "accessible toast notification",
    "aria-live toast",
    "role status vs role alert",
    "snackbar accessibility",
    "aria-live polite vs assertive",
    "accessible notification react",
    "screen reader notification",
    "toast wcag",
    "wcag 4.1.3",
    "status messages",
    "live region toast",
    "auto dismiss accessibility",
    "notification focus management",
    "accessible alert banner",
    "react toast accessibility",
    "aria live region not announcing",
    "toast screen reader not reading",
  ],
  alternates: {
    canonical: "/guides/accessible-notifications",
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: "/guides/accessible-notifications",
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
    images: [`/api/og?title=${encodeURIComponent(pageTitle)}&section=Guide`],
  },
}

const breadcrumbs = [
  { name: "Home", url: "https://accessibility.build" },
  { name: "Guides", url: "https://accessibility.build/guides" },
  {
    name: "Accessible Notifications & Toasts",
    url: "https://accessibility.build/guides/accessible-notifications",
  },
]

const faqs = [
  {
    question: "Should a notification use role=\"status\" or role=\"alert\"?",
    answer:
      "It depends on whether the message can wait. role=\"status\" is an implicit polite live region: the screen reader finishes what it is saying and then reads the new text, which is right for confirmations, result counts, and progress. role=\"alert\" is an implicit assertive live region: it interrupts whatever the screen reader is saying, which is jarring and should be reserved for genuine errors and time-critical warnings such as a session about to expire. The mistake to avoid is making every toast assertive, because a screen reader user is then interrupted on every save and every small update. Default to polite, promote to assertive only when the message truly cannot wait, and use role=\"log\" when you are maintaining a running history like a chat transcript or an activity feed.",
  },
  {
    question: "Why is my toast not being announced by the screen reader?",
    answer:
      "The most common cause is that the live region and its text are created at the same moment. A screen reader only announces changes to a region that already existed in the accessibility tree, so if your code inserts a brand new element that carries both aria-live and the message at once, the region is often not observed in time and the message is silent. The fix is to ship an empty live region in the initial HTML, present on page load, and then set or append text into it when something happens. Also confirm the region is not hidden with display:none or visibility:hidden, which removes it from the accessibility tree entirely; use a visually hidden or sr-only class that keeps the element present. If repeated identical messages fail to re-announce, that is expected: a live region does not re-read text that has not changed, so clear it first and then set it again.",
  },
  {
    question: "Can a toast auto-dismiss and still be accessible?",
    answer:
      "A pure confirmation such as \"Draft saved\" can auto-dismiss, because the live region has already spoken the message and nothing is lost when the visual disappears. Even then, pause the dismiss timer while the pointer is hovering the toast and while keyboard focus is inside it, and always provide a manual close, so a returning user has time to read it. What must never auto-dismiss is a notification that carries an action or essential information: an Undo button, an error the user has to fix, or a warning they need to act on. Removing that on a timer is a time limit on content and collides with WCAG 2.2.1 Timing Adjustable, and it is unfair to keyboard and screen reader users who cannot always read and reach the control before it vanishes. If the user has to do something about it, do not put it on a timer.",
  },
  {
    question: "How long should a toast stay on screen?",
    answer:
      "There is no single correct number, and treating it as a fixed constant is how toasts become inaccessible. A message has to stay long enough to be read and, if it has a control, long enough to be reached with a keyboard, which depends on the length of the text and the person reading it. Common design systems suggest a range of a few seconds up to around ten, but those are starting points, not rules. The honest answer is that anything the user must act on should not be on a timer at all, and everything else should pause on hover and on keyboard focus and offer a manual dismiss. If you find yourself trying to pick the perfect duration for a toast that contains an action, that is the signal the content belongs in a persistent region rather than a disappearing one.",
  },
  {
    question: "Should a toast take keyboard focus so the screen reader notices it?",
    answer:
      "No. Moving focus to a toast is the wrong fix and it creates two new problems. It rips the user out of whatever they were doing, losing their place in a form or a list, and it strands focus inside a box that is often about to disappear on a timer, which can leave the user nowhere. The entire reason a live region exists is to announce a change without moving focus, and WCAG 4.1.3 Status Messages specifically requires that the change be presented without receiving focus. Keep focus where the user put it and let the polite or assertive region speak. The only time a notification legitimately takes focus is when it must interrupt the task and demand a response, and at that point it is not a toast at all: it is an alert dialog, built with the dialog pattern and its own focus management.",
  },
  {
    question: "What is the difference between a toast, an alert banner, and an alert dialog?",
    answer:
      "They sit on a scale of how much they demand from the user. A toast is transient and non-modal: it appears in a corner, announces itself through a polite live region, and disappears without ever taking focus, so it suits confirmations and low-stakes information. An alert banner is persistent and in the flow of the page: it stays until dismissed or resolved and is a good home for an error that must be read and fixed, often marked up with role=\"alert\" when it appears in response to a problem. An alert dialog is modal: it interrupts the task, takes focus, and blocks interaction with the rest of the page until the user responds, which is right for a destructive confirmation or a message that genuinely cannot be ignored. Choosing the right one comes down to whether the message can wait and whether the user has to act on it before continuing.",
  },
  {
    question: "Do accessible toast libraries like react-hot-toast, Sonner, or Radix Toast handle all of this?",
    answer:
      "A good library gets the hardest part right, which is the live region: it keeps a persistent region mounted and announces new toasts through it, so you avoid the create-the-region-and-the-text-together bug. But a library cannot make the design decisions for you. You still owe the politeness choice between polite confirmations and assertive errors, a pause on hover and on keyboard focus, a real named dismiss button, the rule that a toast carrying an action does not auto-dismiss, and status that does not depend on color alone. You also still owe testing: turn a screen reader on, trigger the toast, and listen. Treat the library as a correct plumbing layer, and audit the behavior you build on top of it exactly as you would a hand-rolled component.",
  },
  {
    question: "How do I announce the same message twice, like \"Copied\" clicked repeatedly?",
    answer:
      "A live region only announces content that has changed, so setting a region to the same text it already holds does nothing, and a user who clicks Copy twice hears the confirmation only once. The reliable trick is to clear the region and then set the text again as a separate change, giving the browser a moment in between. Set the region's text to an empty string, then on the next animation frame or after a very short timeout set it to the message. The screen reader now sees an empty region followed by a region with text, which reads as a change and is announced. This pattern is worth wrapping in a small announce helper so every repeated confirmation in your app re-announces correctly.",
  },
]

const antiPatterns = [
  {
    bad: "The live region and its text are created in the same step.",
    why: "A screen reader only announces changes to a region that already existed, so inserting a fresh element that carries both aria-live and the message at once is usually silent (fails 4.1.3).",
    fix: "Ship an empty live region in the initial HTML, present on load, and set or append text into it when the event happens.",
  },
  {
    bad: "Every toast uses role=\"alert\" or aria-live=\"assertive\".",
    why: "Assertive interrupts whatever the screen reader is saying, so a routine \"Saved\" cuts the user off mid-sentence and the interface feels hostile (weakens 4.1.3 even though it technically announces).",
    fix: "Default to role=\"status\" (polite) for confirmations and counts, and reserve assertive for genuine errors and time-critical warnings.",
  },
  {
    bad: "A toast with an Undo button auto-dismisses after a few seconds.",
    why: "A keyboard or screen reader user often cannot read the message and reach the action before it disappears, so the control is effectively unavailable (fails 2.2.1 and 2.1.1).",
    fix: "Never auto-dismiss a notification that carries an action or essential text; keep it until the user dismisses it, and pause any timer on hover and focus.",
  },
  {
    bad: "The toast moves focus to itself so the screen reader will notice it.",
    why: "It pulls the user out of their current task and strands focus in a box that is about to vanish, leaving them lost (fails 2.4.3 and works against 4.1.3, which requires announcement without a focus change).",
    fix: "Announce through a live region without moving focus; if the message truly must interrupt and demand a response, build it as an alert dialog instead.",
  },
  {
    bad: "Success and error are signaled only by the toast's color.",
    why: "A green or red background carries no meaning for color-blind users or for a screen reader, so the nature of the message is lost (fails 1.4.1).",
    fix: "Put the word Success or Error, or an icon with a text label, in the toast itself, and treat color as reinforcement rather than the message.",
  },
  {
    bad: "A fixed-position toast covers the control the user just focused.",
    why: "The keyboard user can no longer see the field or button they are operating, because the notification sits on top of it (fails 2.4.11 Focus Not Obscured).",
    fix: "Position the toast stack clear of interactive content, or shift it out of the way when it would overlap the element that has focus.",
  },
  {
    bad: "The dismiss control is a bare glyph in a div with an onClick.",
    why: "A div is not keyboard operable and an unlabeled times sign announces as nothing, so a keyboard and screen reader user cannot close the toast (fails 2.1.1 and 4.1.2).",
    fix: "Use a real button element with an accessible name such as \"Dismiss notification\", and hide the decorative glyph from assistive technology.",
  },
]

export default function AccessibleNotificationsGuidePage() {
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
                  <span
                    aria-current="page"
                    className="text-slate-900 dark:text-white font-medium"
                  >
                    Accessible Notifications &amp; Toasts
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
                Accessible Notifications &amp; Toasts
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                A toast asks a screen reader user to hear a message and act on it
                before it slides away, and those two demands pull against each
                other. This guide builds notifications everyone can perceive: the
                live region that has to exist{" "}
                <em>before</em> the message, the{" "}
                <code>role=&quot;status&quot;</code> versus{" "}
                <code>role=&quot;alert&quot;</code> politeness fork, why
                auto-dismiss collides with Timing Adjustable, why a toast must never
                take focus, stacking without flooding, and status that never rides
                on color alone. Copy-ready HTML, JavaScript, and React mapped to
                WCAG 2.2.
              </p>
            </div>
          </section>

          {/* The core idea */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                Decide the Pattern Before You Write the Markup
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Notifications go wrong before a single line of ARIA is written,
                  because teams reach for one component, the toast, to carry every
                  kind of message: a quiet confirmation, an urgent error, a
                  time-limited offer, an action the user is meant to take. Those are
                  not the same job, and forcing them into a corner box that fades on
                  a timer is what makes so many notification systems inaccessible.
                  Two questions sort out which pattern you actually need, and almost
                  every other decision in this guide follows from the answers.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The first question is about{" "}
                  <strong className="text-slate-900 dark:text-white">urgency</strong>
                  : can this message wait for the screen reader to finish its current
                  sentence, or must it interrupt? A saved draft or an updated result
                  count can wait, so it belongs in a polite live region. A form
                  submission that failed, or a session about to expire, cannot wait,
                  so it belongs in an assertive one. That is the politeness fork, and
                  it decides between <code>role=&quot;status&quot;</code> and{" "}
                  <code>role=&quot;alert&quot;</code>.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The second question is about{" "}
                  <strong className="text-slate-900 dark:text-white">
                    whether the user has to do something
                  </strong>
                  . Is the message fire and forget, like &ldquo;Draft
                  saved&rdquo;, or does it carry an action or essential information,
                  like an Undo button, an error to correct, or a warning to act on?
                  Fire-and-forget messages can be toasts that auto-dismiss. Anything
                  the user has to read and act on is not a fire-and-forget toast at
                  all, and putting it on a disappearing timer is the single most
                  common notification failure.
                </p>
                <div className="not-prose rounded-lg border border-teal-200 dark:border-teal-900/50 bg-teal-50 dark:bg-teal-950/20 p-5 my-6">
                  <p className="text-sm font-semibold text-teal-900 dark:text-teal-200 mb-2">
                    The two questions that decide the pattern
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Ask <em>can it wait?</em> and <em>must the user act on it?</em> If
                    it can wait and needs no action, it is a toast: a polite live
                    region that announces without taking focus and may auto-dismiss.
                    If it cannot wait, promote it to an assertive region so it
                    interrupts. If the user has to act on it, it does not belong on a
                    timer: keep it in a persistent alert banner, or, if it must block
                    the task until answered, an alert dialog. A sighted mouse user
                    might catch a message that flashes and fades; a keyboard or screen
                    reader user needs it to stay long enough to hear and reach.
                  </p>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Those two questions map onto three components. A{" "}
                  <strong className="text-slate-900 dark:text-white">toast</strong> is
                  transient and non-modal, announces through a polite region, and
                  never takes focus. An{" "}
                  <strong className="text-slate-900 dark:text-white">
                    alert banner
                  </strong>{" "}
                  is persistent and sits in the flow of the page until dismissed or
                  resolved, which suits an error the user must fix. An{" "}
                  <strong className="text-slate-900 dark:text-white">
                    alert dialog
                  </strong>{" "}
                  is modal: it interrupts, takes focus, and blocks the rest of the
                  page until answered, and it is built with the{" "}
                  <Link
                    href="/guides/accessible-dialog"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    dialog pattern
                  </Link>
                  , not the toast pattern. The rest of this guide is mostly about
                  building the toast correctly, because that is where the subtle bugs
                  live, but the escape hatch is always there: when a message needs a
                  response, stop reaching for a toast.
                </p>
              </div>
            </div>
          </section>

          {/* WCAG mapping */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <ShieldCheck className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                How Notifications Map to WCAG 2.2
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                No criterion says &ldquo;you must add toasts,&rdquo; but the moment
                the page changes without a reload, one criterion is written for
                exactly that situation. The highlighted row,{" "}
                <Link href="/wcag/4-1-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                  4.1.3 Status Messages
                </Link>
                , is the defining one: a change has to be announced to assistive
                technology without moving focus. Close behind it is{" "}
                <Link href="/wcag/2-2-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                  2.2.1 Timing Adjustable
                </Link>
                , the criterion that governs anything auto-dismissing on a timer. The
                rest of the table covers the controls inside a toast, keyboard
                access, color, contrast, reflow, and not obscuring what has focus.
              </p>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    WCAG 2.2 success criteria that apply to notifications and toasts,
                    their conformance level, and how each one applies
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
                        How it applies to notifications and toasts
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                    <tr className="bg-blue-50/60 dark:bg-blue-950/20">
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/4-1-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                          4.1.3 Status Messages
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">The notification is announced through a live region so a screen reader speaks it without the user&apos;s focus ever moving to it.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-2-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.2.1 Timing Adjustable
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">A toast that auto-dismisses sets a time limit on its content, so anything the user must read or act on has to be pausable, extendable, or free of a timer entirely.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/4-1-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                          4.1.2 Name, Role, Value
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">The dismiss control and any action inside the toast are real buttons with accessible names, not bare glyphs or clickable divs.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-1-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.1.1 Keyboard
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">A keyboard user can reach and operate the dismiss button and any action, and can do so before the toast disappears.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-4-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          1.4.1 Use of Color
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Whether a message is a success or an error is carried by text or a labeled icon, not by a green or red background alone.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-4-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                          1.4.3 Contrast (Minimum)
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">Toast text meets 4.5 to 1 against its own background, which is easy to miss when a tinted success or error surface sits behind pale text.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-4-11" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.4.11 Focus Not Obscured
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">A fixed-position toast does not cover the control that currently has keyboard focus, so the user can still see what they are operating.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-4-10" className="text-blue-600 dark:text-blue-400 hover:underline">
                          1.4.10 Reflow
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">At 320 pixels wide the toast reflows into the viewport and does not force horizontal scrolling or clip its text and controls.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-muted-foreground leading-relaxed mt-4 text-sm">
                Each criterion links to its full reference and interactive demo. The
                complete{" "}
                <Link
                  href="/wcag"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  WCAG 2.2 criteria
                </Link>{" "}
                are one click away.
              </p>
            </div>
          </section>

          {/* 1. The live region must exist first */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                1. The Live Region Has to Exist Before the Message Does
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  This is the bug that silently breaks more toasts than any other, and
                  it has nothing to do with the visible design. A screen reader
                  announces a live region by watching an element that is already in
                  the accessibility tree and speaking whatever text appears inside it.
                  If your code creates a fresh element that carries both the{" "}
                  <code>aria-live</code> attribute and the message text in the same
                  operation, the region is usually not being observed yet, and the
                  message is never spoken. The toast slides in, the sighted user sees
                  it, and the screen reader says nothing.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The fix is to separate the container from the content. Put an empty
                  live region into the initial HTML so it is present on page load, and
                  then set or append text into it when an event happens. The container
                  is what has to pre-exist; the message is the change the screen reader
                  reacts to.
                </p>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`<!-- In the initial HTML: present and EMPTY on load.
     This one region is the announcement layer for every toast.
     aria-atomic="false" so only the newly added toast is read,
     not the whole stack, when several are on screen. -->
<div
  id="toast-region"
  aria-live="polite"
  aria-atomic="false"
  class="toast-region"
></div>`}</code></pre>
                </div>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`const region = document.getElementById("toast-region")

function showToast(message) {
  // The region already exists, so appending a child is a change
  // the screen reader announces. Never create the region in here.
  const toast = document.createElement("div")
  toast.className = "toast"
  toast.textContent = message
  region.appendChild(toast)
  return toast
}

showToast("Draft saved.")`}</code></pre>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Two more details matter. Never hide the region with{" "}
                  <code>display:none</code> or <code>visibility:hidden</code>, because
                  that removes it from the accessibility tree and nothing inside it is
                  announced; if the announcement layer is visually separate from your
                  toasts, hide it with a visually hidden or <code>.sr-only</code> class
                  that keeps the element rendered. And do not flood the region with
                  rapid updates, such as an announcement on every one percent of an
                  upload, which turns the screen reader into a stutter; debounce to
                  meaningful milestones. The{" "}
                  <Link href="/wcag/4-1-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                    4.1.3 Status Messages
                  </Link>{" "}
                  reference covers the live-region mechanics in depth; this guide
                  builds the notification component on top of them.
                </p>
              </div>
            </div>
          </section>

          {/* 2. status vs alert vs log */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                2. role=&quot;status&quot; vs role=&quot;alert&quot; vs role=&quot;log&quot;: The Politeness Fork
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Once the region exists, its politeness decides how the announcement
                  reaches the user. There are two live-region roles you will reach for
                  most, plus a third for history, and each is a shorthand for an{" "}
                  <code>aria-live</code> value you could also set by hand.
                </p>
                <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 my-6 not-prose">
                  <table className="w-full text-sm text-left">
                    <caption className="sr-only">
                      Live region roles, the politeness each one implies, and when to
                      use it for a notification
                    </caption>
                    <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
                      <tr>
                        <th scope="col" className="px-4 py-3 font-semibold">Role</th>
                        <th scope="col" className="px-4 py-3 font-semibold">Implicit politeness</th>
                        <th scope="col" className="px-4 py-3 font-semibold">Use it for</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                      <tr>
                        <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white">role=&quot;status&quot;</th>
                        <td className="px-4 py-3">aria-live=&quot;polite&quot;</td>
                        <td className="px-4 py-3">Confirmations, result counts, progress. The screen reader finishes its sentence, then reads it. This is your default.</td>
                      </tr>
                      <tr>
                        <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white">role=&quot;alert&quot;</th>
                        <td className="px-4 py-3">aria-live=&quot;assertive&quot;</td>
                        <td className="px-4 py-3">Errors and time-critical warnings only. It interrupts whatever is being spoken, so use it sparingly.</td>
                      </tr>
                      <tr>
                        <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white">role=&quot;log&quot;</th>
                        <td className="px-4 py-3">aria-live=&quot;polite&quot;</td>
                        <td className="px-4 py-3">A running history where order matters, such as a chat transcript or an activity feed. New entries are added and read in sequence.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The temptation is to make everything assertive so nothing is missed.
                  Resist it. Assertive is an interruption, and an interface that cuts
                  the screen reader off on every save, every filter change, and every
                  minor update is exhausting to use even though it technically
                  announces. Default to <code>role=&quot;status&quot;</code>, and
                  promote a message to <code>role=&quot;alert&quot;</code> only when it
                  genuinely cannot wait: a failed submission, a lost connection, a
                  session about to time out. A practical setup is to keep two regions
                  in the DOM at all times, one polite and one assertive, and route each
                  message to the right one.
                </p>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`<!-- Polite: waits its turn. Most toasts live here. -->
<div role="status" class="sr-only" id="polite-region"></div>

<!-- Assertive: interrupts. Errors and urgent warnings only. -->
<div role="alert" class="sr-only" id="assertive-region"></div>`}</code></pre>
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                  Announcing the same message twice
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  A live region only announces text that has <em>changed</em>. If a
                  user clicks Copy twice, setting the region to
                  &ldquo;Copied&rdquo; a second time does nothing, because the text is
                  identical to what is already there. The reliable fix is to clear the
                  region and then set the text again as a separate change, with a beat
                  in between so the browser registers two distinct updates.
                </p>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`// Clear, then set on the next frame, so an identical message
// is seen as a change and re-announced.
function announce(region, message) {
  region.textContent = ""
  requestAnimationFrame(() => {
    region.textContent = message
  })
}

announce(politeRegion, "Copied to clipboard.")`}</code></pre>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Wrap this in a small helper and use it everywhere a confirmation can
                  repeat. It is the difference between a Copy button that reassures the
                  user each time and one that goes quiet after the first click.
                </p>
              </div>
            </div>
          </section>

          {/* 3. Auto-dismiss and 2.2.1 */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                3. Auto-Dismiss and the WCAG 2.2.1 Trap
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The defining feature of a toast, that it disappears on its own, is
                  also where it collides with accessibility. Removing content on a
                  timer is a time limit, and{" "}
                  <Link href="/wcag/2-2-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                    2.2.1 Timing Adjustable
                  </Link>{" "}
                  requires that time limits on content be adjustable unless they are
                  essential. Whether a given toast triggers that criterion depends
                  entirely on the second question from the top of this guide: does the
                  user have to read or act on it?
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  A pure confirmation is the safe case. &ldquo;Draft saved&rdquo; has
                  already been spoken by the live region the instant it appeared, so
                  when the visual fades a few seconds later, nothing is actually lost.
                  That kind of toast can auto-dismiss. Even then, do two things: pause
                  the timer while the pointer is over the toast and while keyboard
                  focus is inside it, so a returning user is not fighting the clock,
                  and always provide a manual close.
                </p>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`// A confirmation toast may auto-dismiss, but pause the timer on
// hover AND on keyboard focus, so it never vanishes while someone
// is reading it or reaching into it.
function autoDismiss(toast, ms) {
  let timer = window.setTimeout(() => toast.remove(), ms)
  const pause = () => window.clearTimeout(timer)
  const resume = () => {
    timer = window.setTimeout(() => toast.remove(), ms)
  }

  toast.addEventListener("mouseenter", pause)
  toast.addEventListener("mouseleave", resume)
  toast.addEventListener("focusin", pause)   // focus entered the toast
  toast.addEventListener("focusout", resume)
}

// Do NOT call this on a toast that holds an action or an error.`}</code></pre>
                </div>
                <div className="not-prose rounded-lg border border-amber-300 dark:border-amber-800/60 bg-amber-50 dark:bg-amber-950/20 p-5 my-6">
                  <p className="text-sm font-semibold text-amber-900 dark:text-amber-200 mb-2">
                    The line you cannot cross
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    A notification that carries an action or essential information must
                    not auto-dismiss. An Undo button, an error the user has to fix, a
                    warning they need to respond to: none of these should sit on a
                    timer, because a keyboard or screen reader user often cannot read
                    the message and reach the control before it is gone. If a toast has
                    a button, either it never times out, or it is not really a toast
                    and belongs in a persistent alert banner. When you catch yourself
                    hunting for the perfect number of seconds to display an actionable
                    toast, that is the pattern telling you it chose the wrong container.
                  </p>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  There is no universally correct duration. Design systems suggest
                  ranges from a few seconds up to around ten, but those are starting
                  points that assume a short, non-actionable message and an average
                  reader. Longer text needs longer, an action needs no timer at all,
                  and pausing on hover and focus is what turns a guess into something
                  fair.
                </p>
              </div>
            </div>
          </section>

          {/* 4. Focus and dismissal */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                4. A Toast Never Steals Focus
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  When a toast is silent for screen reader users, the instinct is to
                  move focus to it so it gets read. That is the wrong fix, and it is
                  worth being firm about. Moving focus rips the user out of whatever
                  they were doing, loses their place in the form or list they were
                  working through, and leaves focus stranded inside a box that is often
                  about to disappear on a timer. The whole reason a live region exists
                  is to announce a change{" "}
                  <em>without</em> moving focus, and{" "}
                  <Link href="/wcag/4-1-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                    4.1.3
                  </Link>{" "}
                  requires exactly that. Keep focus where the user put it, and let the
                  polite or assertive region speak.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                  The dismiss button is a real button
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  A toast that offers a close control needs a genuine{" "}
                  <code>&lt;button&gt;</code> with an accessible name, not a{" "}
                  <code>&lt;div&gt;</code> holding a times sign with an{" "}
                  <code>onClick</code>. A div is not in the tab order and announces as
                  nothing; a bare glyph gives the button no name. Because the visible
                  content already says what the message is, name the button by its
                  action and hide the decorative glyph.
                </p>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`<div class="toast" role="status">
  <p class="toast-message">Draft saved.</p>

  <!-- Real button, named by its action; the glyph is decorative. -->
  <button type="button" class="toast-close" aria-label="Dismiss notification">
    <svg aria-hidden="true" focusable="false" viewBox="0 0 20 20" width="20" height="20">
      <path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" stroke-width="2" fill="none" />
    </svg>
  </button>
</div>`}</code></pre>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  By convention, pressing Escape dismisses the most recent toast, which
                  is a small courtesy for keyboard users clearing a stack. When a toast
                  that held focus (because the user tabbed to its Undo or Close button)
                  is dismissed, send focus somewhere sensible, usually back to the
                  control that triggered the action, rather than letting it fall to the
                  top of the page.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                  When it should take focus, it is a dialog
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  There is one case where a notification legitimately takes focus and
                  blocks the page: when it must interrupt the task and force a response,
                  like a confirmation before deleting an account. That is not a toast.
                  It is an alert dialog, with <code>role=&quot;alertdialog&quot;</code>,
                  a focus move into it, a focus trap while it is open, and focus
                  restoration when it closes. Build it with the{" "}
                  <Link
                    href="/guides/accessible-dialog"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    accessible dialog guide
                  </Link>
                  , and for the mechanics of moving and restoring focus, see the{" "}
                  <Link
                    href="/guides/focus-management"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    focus management guide
                  </Link>
                  . The rule stays clean: toasts announce, dialogs interrupt.
                </p>
              </div>
            </div>
          </section>

          {/* 5. Stacking and queueing */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                5. Stacking, Queueing, and Not Flooding
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Real apps fire more than one notification at a time, and how you
                  handle the pile-up matters as much as any single toast. Do not create
                  a separate assertive region for each message; several assertive
                  regions talking over each other is chaos. Keep one polite region as
                  the announcement layer and append each new toast into it, and the
                  screen reader reads the additions in order. Reserve the assertive
                  region for the occasional error.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Visually, cap how many toasts are on screen at once. A tall column of
                  ten stacked toasts is noise for everyone and a wall of tab stops if
                  each has a control. Show a small number, queue the rest, and let them
                  advance as earlier ones dismiss. If toasts persist long enough to be
                  a group, give the stack a role such as{" "}
                  <code>region</code> with an accessible name like &ldquo;Notifications&rdquo;
                  so a screen reader user can find and review them, rather than relying
                  on the single spoken announcement.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Position deserves care too. Toasts usually sit fixed to a corner, and
                  a fixed element can cover the control the user just moved to with the
                  keyboard, which fails{" "}
                  <Link href="/wcag/2-4-11" className="text-blue-600 dark:text-blue-400 hover:underline">
                    2.4.11 Focus Not Obscured
                  </Link>
                  . Keep the toast area clear of interactive content, or shift it when
                  it would overlap what has focus. And because the toast is fixed, check
                  it at{" "}
                  <Link href="/wcag/1-4-10" className="text-blue-600 dark:text-blue-400 hover:underline">
                    320 pixels wide
                  </Link>
                  : it should reflow to fit the viewport, wrap its text, and keep its
                  close button reachable rather than spilling off the edge of a phone
                  screen.
                </p>
              </div>
            </div>
          </section>

          {/* 6. Color and contrast */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                6. Color, Contrast, and Not Signaling Status by Color Alone
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Notification systems lean hard on color: green for success, red for
                  error, amber for warning. Color is a fine reinforcement, but it can
                  never be the only thing that tells a user what kind of message this
                  is. A color-blind user may not distinguish the green toast from the
                  red one, and a screen reader announces the text, not the background,
                  so a toast whose only difference is its color says the same thing to
                  assistive technology whether it succeeded or failed. That is a{" "}
                  <Link href="/wcag/1-4-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.4.1 Use of Color
                  </Link>{" "}
                  failure.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The fix is to put the meaning in the content. Lead the message with a
                  word like Success or Error, or pair the colored surface with an icon
                  that has a text label, so the nature of the message survives without
                  color. If you use an icon and the adjacent text already conveys the
                  status, mark the icon <code>aria-hidden=&quot;true&quot;</code> so it
                  is not read twice.
                </p>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`<!-- The word "Error" carries the meaning; the color and icon
     only reinforce it. Nothing depends on red alone. -->
<div class="toast toast-error" role="alert">
  <span class="toast-icon" aria-hidden="true">!</span>
  <p><strong>Error:</strong> Payment could not be processed.</p>
  <button type="button" aria-label="Dismiss notification">...</button>
</div>`}</code></pre>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Do not forget plain contrast either. Tinted success and error
                  surfaces are often paired with pale text that looks fine to a
                  designer but drops below the{" "}
                  <Link href="/wcag/1-4-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                    4.5 to 1 contrast minimum
                  </Link>
                  . Check the toast text against its actual background, in both light
                  and dark themes, not against white.
                </p>
              </div>
            </div>
          </section>

          {/* 7. React */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                7. Notifications in React
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  React makes the pre-existing-region rule easy to get wrong, because
                  the natural instinct is to render a toast component only when there
                  is something to show. If the live region is inside that component, it
                  mounts together with its text, and you are back to the silent-toast
                  bug. The pattern that avoids it is a provider mounted once at the app
                  root, whose live region is always in the tree; individual toasts are
                  appended into it as state changes.
                </p>
                <div className="not-prose rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-950 overflow-x-auto my-4">
                  <pre className="p-4 text-sm text-slate-100"><code>{`// Mounted ONCE at the app root. The live regions are always in
// the tree, so appended toasts are announced in place.
function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const notify = useCallback((message, options) => {
    const tone = options && options.error ? "error" : "success"
    const id = crypto.randomUUID()
    setToasts((list) => [...list, { id, message, tone }])
  }, [])

  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={notify}>
      {children}

      {/* Polite region for confirmations. Present on every render. */}
      <div className="toast-stack" aria-live="polite" aria-atomic="false">
        {toasts
          .filter((t) => t.tone === "success")
          .map((t) => (
            <Toast key={t.id} toast={t} onDismiss={dismiss} />
          ))}
      </div>

      {/* Separate assertive region for errors only. */}
      <div className="toast-stack toast-stack-error" role="alert">
        {toasts
          .filter((t) => t.tone === "error")
          .map((t) => (
            <Toast key={t.id} toast={t} onDismiss={dismiss} />
          ))}
      </div>
    </ToastContext.Provider>
  )
}`}</code></pre>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Each <code>Toast</code> renders its message with a leading Success or
                  Error label, a real dismiss button named &ldquo;Dismiss
                  notification&rdquo;, and, for confirmations only, a timer that pauses
                  on <code>mouseenter</code> and <code>focusin</code>. Route errors to
                  the assertive region and everything else to the polite one, so
                  urgency is a property of the message rather than an afterthought.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You do not have to hand-build this. Libraries such as react-hot-toast,
                  Sonner, and Radix Toast keep a persistent region mounted for you and
                  handle the announcement plumbing, which is the part that is easy to
                  break. What they cannot decide for you is the politeness of each
                  message, the pause on hover and focus, the named dismiss control, the
                  rule that an actionable toast does not auto-dismiss, and status that
                  does not depend on color. Audit any toast library the same way you
                  would audit your own: turn a screen reader on, trigger a toast, and
                  listen. For the wider set of React patterns, the{" "}
                  <Link
                    href="/guides/react-accessibility"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    React accessibility guide
                  </Link>{" "}
                  covers announcing dynamic changes across the app, and the{" "}
                  <Link
                    href="/guides/accessible-ai-chat"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    accessible AI chat guide
                  </Link>{" "}
                  works the streaming case where announcements arrive continuously.
                </p>
              </div>
            </div>
          </section>

          {/* 8. Testing */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                8. Testing Notifications and Toasts
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Notifications are one of the areas where automated tools help least,
                  because the thing that matters, whether the announcement actually
                  fires and whether the user can act in time, only shows up with a
                  screen reader running and a keyboard in hand.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                  The screen reader pass
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  With NVDA, JAWS, or VoiceOver on, trigger each notification: save
                  something, submit with an error, run a search, start an upload. Each
                  change should be spoken once, without your focus moving, and without
                  stuttering through half-words. Confirm the error interrupts (assertive
                  is doing its job) while the routine confirmations wait their turn.
                  Fire the same confirmation twice and check it re-announces. Let an
                  auto-dismissing toast fade and confirm nothing essential was only in
                  that toast.
                </p>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mt-6 mb-3">
                  The keyboard and timing pass
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Trigger a toast that has an action or a close button and, using only
                  the keyboard, reach and operate it before it disappears. If you
                  cannot, the timer is too short or the toast should not be timed at
                  all. Hover a toast and confirm its timer pauses; tab into it and
                  confirm the same. Press Escape and confirm it dismisses. Then check
                  the visual layer: at 320 pixels the toast reflows and its close button
                  stays reachable, a fixed toast does not cover the focused control, the
                  text meets contrast against its own background, and the success or
                  error meaning survives with color removed.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Automated checkers earn their keep on the mechanical failures. axe and
                  WAVE can flag a missing accessible name on the dismiss button, a
                  clickable div, or contrast below the minimum. What they cannot tell
                  you is whether the announcement actually fired, whether assertive is
                  overused, or whether a keyboard user can reach the action before the
                  toast vanishes. Those are manual judgments, and they are the ones that
                  decide whether the notification works.
                </p>
              </div>
            </div>
          </section>

          {/* Anti-patterns */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                Common Notification Mistakes &amp; How to Fix Them
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                These are the errors that turn up most in notification audits. Almost
                all of them trace back to two habits: treating a toast as the container
                for every kind of message, and forgetting that a screen reader or
                keyboard user needs the message to survive long enough to hear and
                reach.
              </p>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    Common notification and toast anti-patterns, why each one fails,
                    and the fix
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
                The Accessible Notification &amp; Toast Checklist
              </h2>
              <ol className="space-y-4 text-muted-foreground leading-relaxed list-decimal pl-6">
                <li>
                  <strong className="text-slate-900 dark:text-white">The pattern is chosen on purpose.</strong>{" "}
                  Ask whether the message can wait and whether the user must act on it;
                  the answers decide toast, alert banner, or alert dialog.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">The live region exists before its first message.</strong>{" "}
                  An empty region is in the initial HTML; text is set or appended into
                  it, never created together with it.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Politeness matches urgency.</strong>{" "}
                  <code>role=&quot;status&quot;</code> for confirmations and counts,{" "}
                  <code>role=&quot;alert&quot;</code> only for errors and time-critical
                  warnings, <code>role=&quot;log&quot;</code> for a running history.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Nothing steals focus.</strong>{" "}
                  The live region announces in place; only a message that must interrupt
                  and demand a response becomes an alert dialog.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Auto-dismiss respects 2.2.1.</strong>{" "}
                  Pure confirmations may auto-hide, but the timer pauses on hover and
                  focus and a manual close is always offered.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Actionable and essential messages persist.</strong>{" "}
                  A toast holding an Undo, an error to fix, or a warning to answer is
                  never on a timer.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">The dismiss control is a real named button.</strong>{" "}
                  It is a <code>&lt;button&gt;</code> labelled by its action, the glyph
                  is hidden, and Escape dismisses.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Meaning is never color alone.</strong>{" "}
                  The toast says Success or Error in text or a labelled icon, and its
                  text meets 4.5 to 1 against its own background.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">The stack does not flood or obscure.</strong>{" "}
                  Additions queue in one polite region, the visible count is capped, and
                  a fixed toast stays clear of the focused control and reflows at 320
                  pixels.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Repeat messages re-announce.</strong>{" "}
                  An identical confirmation is spoken again by clearing the region and
                  setting the text on the next frame.
                </li>
              </ol>
            </div>
          </section>

          {/* CTA */}
          <section className="py-12 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <div className="rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20 p-8 text-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  Notifications Are a Live-Region Problem
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6 max-w-lg mx-auto">
                  The moment a notification has to interrupt and take focus, it is a
                  dialog. Read the criterion that governs announcing change without
                  moving focus, and see how a focus-managed dialog is built.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button asChild size="lg" className="gap-2">
                    <Link href="/wcag/4-1-3">
                      4.1.3 Status Messages
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="gap-2">
                    <Link href="/guides/accessible-dialog">
                      Accessible Dialog Guide
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
                content="accessible notifications accessible toast toast accessibility accessible toast notification aria-live toast role status vs role alert snackbar accessibility aria-live polite vs assertive accessible notification react screen reader notification toast wcag wcag 4.1.3 status messages live region toast auto dismiss accessibility notification focus management accessible alert banner react toast accessibility aria live region not announcing toast screen reader not reading role status role alert role log timing adjustable 2.2.1 focus not obscured 2.4.11 use of color name role value live region dialog"
              />
            </div>
          </section>
        </article>
      </div>
    </>
  )
}
