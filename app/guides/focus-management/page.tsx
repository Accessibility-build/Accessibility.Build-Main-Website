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
  Focus,
  Route,
  Eye,
  MousePointerClick,
  ListChecks,
  ShieldCheck,
  Bug,
  Undo2,
  MoveRight,
  KeyRound,
  EyeOff,
} from "lucide-react"

const pageTitle = "Focus Management: The Complete Accessibility Guide"
const pageDescription =
  "Master focus management for accessible web apps: tabindex, :focus-visible, moving focus programmatically, focus traps, focus restoration, roving tabindex, skip links, and route-change focus — with copy-ready code mapped to WCAG 2.2 (2.4.3, 2.4.7, 2.4.11)."

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords: [
    "focus management",
    "focus management accessibility",
    "tabindex",
    "focus-visible",
    "focus trap",
    "focus order",
    "wcag 2.4.3",
    "wcag 2.4.7 focus visible",
    "focus not obscured",
    "wcag 2.4.11",
    "roving tabindex",
    "skip link",
    "keyboard focus",
    "programmatic focus",
    "focus restoration",
    "element.focus",
    "accessible modal focus",
  ],
  alternates: {
    canonical: "/guides/focus-management",
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: "/guides/focus-management",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: `/api/og?title=${encodeURIComponent("Focus Management Guide")}&section=Guide`,
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
        url: `/api/og?title=${encodeURIComponent("Focus Management Guide")}&section=Guide`,
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
    name: "Focus Management Guide",
    url: "https://accessibility.build/guides/focus-management",
  },
]

const faqs = [
  {
    question: "What is focus management in web accessibility?",
    answer:
      "Focus management is the practice of controlling which element on a page is currently focused — the element that receives keyboard input and is highlighted by a focus indicator. For keyboard and screen reader users, focus is their cursor: it is how they know where they are and what they can interact with. Good focus management means the Tab order follows a logical reading sequence, the focused element is always visible, and focus is moved deliberately when the interface changes — a dialog opens, a route changes, content is inserted or removed. When focus is mishandled, users get silently stranded, lose their place, or are dumped back at the top of the page. It underpins WCAG 2.4.3 Focus Order, 2.4.7 Focus Visible, and 2.4.11 Focus Not Obscured.",
  },
  {
    question: "What is the difference between tabindex 0, -1, and a positive value?",
    answer:
      "tabindex=\"0\" inserts an element into the natural Tab order at its DOM position and makes it focusable — use it to make a genuinely custom interactive element reachable by keyboard. tabindex=\"-1\" makes an element focusable only programmatically (via element.focus()) but keeps it out of the Tab sequence — use it for headings, containers, or off-screen targets you want to move focus to but not tab to. A positive tabindex (1, 2, 3…) forces an explicit Tab order that overrides DOM order for the whole page; this is almost always a mistake because it is fragile, hard to maintain, and creates surprising jumps. The rule of thumb: never use a positive tabindex, use 0 sparingly on real custom controls, and use -1 for programmatic focus targets.",
  },
  {
    question: "What is a focus trap and when should I use one?",
    answer:
      "A focus trap keeps keyboard focus cycling inside a specific region so that Tab and Shift+Tab cannot move focus to content behind it. It is required for modal dialogs: while a modal is open, the rest of the page is inert, so focus must stay inside the dialog until it closes. The key distinction is intentional vs accidental. An intentional, escapable trap (a modal you can close with Escape) is correct and satisfies WCAG. An accidental trap — a widget that captures focus with no keyboard way out — fails WCAG 2.1.2 No Keyboard Trap. The native <dialog> element with showModal() implements a compliant, escapable focus trap for you, including Escape-to-close.",
  },
  {
    question: "What is :focus-visible and how is it different from :focus?",
    answer:
      "The :focus pseudo-class matches any focused element, including one focused by a mouse click, which is why removing outlines with :focus (or worse, outline: none globally) is so damaging — it hides the indicator from keyboard users too. The :focus-visible pseudo-class matches only when the browser heuristically determines a visible focus indicator is needed, which is essentially keyboard focus and not a plain mouse click. This lets you show a strong focus ring for keyboard users while not showing one on mouse click, giving you the visual polish designers often want without failing WCAG 2.4.7 Focus Visible. Always style :focus-visible, and never remove a focus indicator without providing a clearly visible replacement.",
  },
  {
    question: "How do I move focus without the page scrolling abruptly?",
    answer:
      "Call element.focus({ preventScroll: true }). By default, focusing an element scrolls it into view, which can cause a jarring jump when you move focus to something already visible or near the top. preventScroll: true moves focus without scrolling, letting you control scrolling separately (or not at all). This is useful when focusing a route heading, a skip-link target, or a status region. Be careful, though: if the focus target is off-screen, you must ensure the user can still see where focus went — never move focus to something invisible without also bringing it into view.",
  },
  {
    question: "When should I use roving tabindex instead of aria-activedescendant?",
    answer:
      "Both are techniques for making a composite widget — tabs, a menu, a listbox, a grid — expose a single Tab stop while arrow keys move between its items. With roving tabindex, exactly one item has tabindex=\"0\" (the rest are tabindex=\"-1\") and DOM focus actually moves as arrow keys are pressed; you update tabindex and call focus() on the newly active item. With aria-activedescendant, DOM focus stays on the container and you set aria-activedescendant to the id of the virtually-active child. Roving tabindex is simpler and works well for most menus, toolbars, and tab sets. aria-activedescendant suits cases where focus must remain on an input — such as a combobox where the text field keeps focus while options are navigated.",
  },
]

const antiPatterns = [
  {
    bad: "outline: none on :focus (or globally on *).",
    why: "Removes the only cue keyboard users have for where they are (WCAG 2.4.7).",
    fix: "Style :focus-visible with a visible ring; never remove without a replacement.",
  },
  {
    bad: "Positive tabindex values (tabindex=\"1\", \"2\"…).",
    why: "Overrides DOM order page-wide, creating fragile, surprising jumps (2.4.3).",
    fix: "Order the DOM logically; use only tabindex=\"0\" or \"-1\".",
  },
  {
    bad: "Dialog opens but focus stays on the page behind it.",
    why: "Keyboard users tab through hidden content; screen readers get lost (2.4.3).",
    fix: "Move focus into the dialog on open; trap it while open.",
  },
  {
    bad: "Menu or widget with no keyboard way out.",
    why: "Accidental keyboard trap — users are stuck (2.1.2 No Keyboard Trap).",
    fix: "Ensure Tab/Escape always releases focus; only modals trap intentionally.",
  },
  {
    bad: "Deleting the focused element without moving focus.",
    why: "Focus falls back to <body>; the user loses their place entirely.",
    fix: "Move focus to a sensible neighbor before removing the element.",
  },
  {
    bad: "Sticky header covering the focused field on scroll.",
    why: "Focused element is hidden behind fixed content (2.4.11 Focus Not Obscured).",
    fix: "Add scroll-margin-top or offset so focus stays visible below the header.",
  },
]

export default function FocusManagementGuidePage() {
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
                    Focus Management
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
                Implementation Guide &bull; Updated July 2026
              </Badge>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
                Focus Management: The Complete Accessibility Guide
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Focus is the keyboard user&apos;s cursor. This guide covers every
                part of managing it well — <code>tabindex</code>,{" "}
                <code>:focus-visible</code>, moving focus programmatically, focus
                traps, restoration, roving <code>tabindex</code>, skip links, and
                route-change focus — with copy-ready code mapped to WCAG 2.2.
              </p>
            </div>
          </section>

          {/* What & why */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                Why Focus Management Matters
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  A sighted mouse user can look anywhere and click anything. A
                  person using a keyboard, a switch device, or a screen reader
                  can only interact with{" "}
                  <strong className="text-slate-900 dark:text-white">
                    the one element that currently has focus
                  </strong>
                  . Focus is their cursor and their sense of place. When it moves
                  logically and stays visible, the interface is navigable. When it
                  jumps unexpectedly, disappears, or gets stuck, the interface
                  becomes unusable — no matter how good it looks.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Most focus bugs come from dynamic behavior that native HTML never
                  had to handle: a dialog opens and focus stays behind it, a single
                  page app changes route without resetting focus, a list item is
                  deleted and focus falls back to <code>&lt;body&gt;</code>, or a
                  designer removes the focus outline because it &ldquo;looks
                  cluttered.&rdquo; This guide works through each situation with a
                  concrete fix, and ties every technique back to the WCAG success
                  criteria it satisfies.
                </p>
              </div>
            </div>
          </section>

          {/* WCAG mapping */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <ShieldCheck className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                The WCAG 2.2 Criteria Focus Management Covers
              </h2>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    WCAG 2.2 success criteria that depend on correct focus
                    management and what each requires
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
                        What it requires
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-1-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.1.1 Keyboard
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Every interactive element is focusable and operable by keyboard.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-1-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.1.2 No Keyboard Trap
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Focus can always leave a component using the keyboard alone.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-4-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.4.3 Focus Order
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Focus order preserves meaning and operability (logical sequence).</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-4-7" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.4.7 Focus Visible
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">The keyboard focus indicator is always visible.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-4-11" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.4.11 Focus Not Obscured (Min)
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">The focused element is not entirely hidden by other content.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/3-2-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          3.2.1 On Focus
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Moving focus to a component does not trigger an unexpected change of context.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-muted-foreground leading-relaxed mt-4 text-sm">
                WCAG 2.2 added{" "}
                <Link href="/wcag/2-4-11" className="text-blue-600 dark:text-blue-400 hover:underline">
                  2.4.11 Focus Not Obscured (Minimum)
                </Link>{" "}
                at AA — a common failure with sticky headers and cookie banners.
                For the full picture see the{" "}
                <Link href="/guides/wcag-2-2-aa-requirements" className="text-blue-600 dark:text-blue-400 hover:underline">
                  WCAG 2.2 Level AA requirements
                </Link>{" "}
                and the interactive{" "}
                <Link href="/checklists/wcag-2-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                  WCAG 2.2 checklist
                </Link>
                .
              </p>
            </div>
          </section>

          {/* 1. Focus order & tabindex */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <MoveRight className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                1. Focus Order &amp; the tabindex Attribute
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The Tab order follows the DOM order by default. That is the single
                most important thing to get right: if your source order matches
                your visual reading order, focus order is correct for free. CSS
                that visually reorders content (<code>flex-direction</code>,{" "}
                <code>order</code>, <code>grid</code> placement) does{" "}
                <em>not</em> change focus order, so a mismatch between visual and
                DOM order is a classic{" "}
                <Link href="/wcag/2-4-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                  2.4.3
                </Link>{" "}
                failure. The <code>tabindex</code> attribute has exactly three
                meaningful uses:
              </p>
              <pre className="rounded-lg bg-slate-900 text-slate-100 text-sm p-4 overflow-x-auto"><code>{`<!-- tabindex="0": add a CUSTOM element to the natural Tab order -->
<div role="button" tabindex="0" onkeydown="/* handle Enter/Space */">
  Custom control
</div>

<!-- tabindex="-1": focusable ONLY via script, not in the Tab sequence -->
<h1 tabindex="-1">Page title we move focus to on route change</h1>

<!-- tabindex="1+": AVOID. Overrides DOM order for the whole page. -->
<input tabindex="3">  <!-- fragile, surprising, hard to maintain -->`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Prefer native interactive elements — <code>&lt;button&gt;</code>,{" "}
                <code>&lt;a href&gt;</code>, <code>&lt;input&gt;</code>,{" "}
                <code>&lt;select&gt;</code> — which are focusable and keyboard
                operable without any <code>tabindex</code> at all. Only reach for{" "}
                <code>tabindex=&#123;0&#125;</code> when you have genuinely built a
                custom control, and add the matching keyboard handlers. See the{" "}
                <Link href="/guides/keyboard-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">
                  keyboard accessibility guide
                </Link>{" "}
                for the full interaction model.
              </p>
            </div>
          </section>

          {/* 2. Focus visible */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Eye className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                2. Keep Focus Visible with :focus-visible
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The most common accessibility regression on the web is{" "}
                <code>outline: none</code>. Designers remove the focus ring
                because it appears on mouse click too, and it never comes back for
                keyboard users. The fix is <code>:focus-visible</code>, which the
                browser applies only when a visible indicator is warranted —
                effectively keyboard focus, not a plain mouse click.
              </p>
              <pre className="rounded-lg bg-slate-900 text-slate-100 text-sm p-4 overflow-x-auto"><code>{`/* Never do this — hides focus from keyboard users everywhere */
:focus { outline: none; }

/* Do this — a strong ring for keyboard users, quiet on mouse click */
:focus-visible {
  outline: 3px solid #2563eb;
  outline-offset: 2px;
  border-radius: 2px;
}

/* Optional: suppress the ring ONLY on mouse focus, keep it for keyboard */
:focus:not(:focus-visible) { outline: none; }`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Make the indicator obvious: aim for a contrast ratio of at least
                3:1 against adjacent colors, and give it enough thickness and
                offset to read clearly. A custom ring must be at least as visible
                as the browser default it replaces. This satisfies{" "}
                <Link href="/wcag/2-4-7" className="text-blue-600 dark:text-blue-400 hover:underline">
                  2.4.7 Focus Visible
                </Link>
                . Check your indicator colors with the{" "}
                <Link href="/tools/contrast-checker" className="text-blue-600 dark:text-blue-400 hover:underline">
                  contrast checker
                </Link>
                .
              </p>
            </div>
          </section>

          {/* 3. Moving focus programmatically */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <MousePointerClick className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                3. Moving Focus Programmatically
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                When the interface changes in a way the user did not directly
                trigger a focus for — new content appears, a step completes, a
                view swaps — you often need to move focus deliberately. Use{" "}
                <code>element.focus()</code>, and reach for{" "}
                <code>preventScroll</code> to avoid a jarring jump when the target
                is already on screen.
              </p>
              <pre className="rounded-lg bg-slate-900 text-slate-100 text-sm p-4 overflow-x-auto"><code>{`// Move focus to a heading or region after inserting content.
// The target needs tabindex="-1" so it can receive programmatic focus.
function focusTarget(el) {
  if (!el) return
  el.focus({ preventScroll: true })   // don't yank the viewport
  // If the target is off-screen, bring it into view intentionally:
  el.scrollIntoView({ block: "start", behavior: "smooth" })
}

// Example: after loading a new panel of results
const heading = document.querySelector("#results-heading")
focusTarget(heading)`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Two rules keep this safe. First, only move focus in response to a
                user action or a change the user asked for — moving focus out from
                under someone as they read is disorienting and can fail{" "}
                <Link href="/wcag/3-2-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                  3.2.1 On Focus
                </Link>
                . Second, never focus something the user cannot see. If you must
                announce a change without moving focus, use an{" "}
                <code>aria-live</code> region instead — covered in the{" "}
                <Link href="/reference/aria" className="text-blue-600 dark:text-blue-400 hover:underline">
                  ARIA reference
                </Link>
                .
              </p>
            </div>
          </section>

          {/* 4. Focus traps */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Focus className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                4. Focus Traps for Modal Dialogs
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                A modal takes over the screen, so while it is open, keyboard focus
                must stay inside it — Tab from the last control wraps to the first,
                Shift+Tab from the first wraps to the last, and the rest of the
                page is inert. This is the one place an intentional focus trap is
                correct. The native <code>&lt;dialog&gt;</code> element with{" "}
                <code>showModal()</code> implements the whole pattern for you,
                including Escape-to-close.
              </p>
              <pre className="rounded-lg bg-slate-900 text-slate-100 text-sm p-4 overflow-x-auto"><code>{`<dialog id="confirm" aria-labelledby="confirm-title">
  <h2 id="confirm-title">Delete this project?</h2>
  <p>This action cannot be undone.</p>
  <button value="cancel">Cancel</button>
  <button value="delete">Delete</button>
</dialog>

<script>
  const dialog = document.getElementById("confirm")
  // showModal() traps focus, makes the page inert, enables Escape,
  // and moves focus into the dialog automatically.
  openButton.addEventListener("click", () => dialog.showModal())
</script>`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-4">
                If you build a custom overlay instead, you must add{" "}
                <code>role=&quot;dialog&quot;</code>,{" "}
                <code>aria-modal=&quot;true&quot;</code>, an accessible name, a
                focus trap, Escape-to-close, and focus restoration yourself. Keep
                the trap <em>escapable</em> — a trap with no keyboard exit fails{" "}
                <Link href="/wcag/2-1-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                  2.1.2 No Keyboard Trap
                </Link>
                . React developers can see the ref-based version in the{" "}
                <Link href="/guides/react-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">
                  React accessibility guide
                </Link>
                .
              </p>
            </div>
          </section>

          {/* 5. Focus restoration */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Undo2 className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                5. Restore Focus When Things Close or Disappear
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Two situations demand that you put focus somewhere sensible.
                First, when a dialog, menu, or popover closes, focus must return
                to the control that opened it — otherwise it falls to{" "}
                <code>&lt;body&gt;</code> and the user restarts from the top.
                Second, when you remove the currently focused element (deleting a
                list row, dismissing a card), move focus to a neighbor{" "}
                <em>before</em> the element leaves the DOM.
              </p>
              <pre className="rounded-lg bg-slate-900 text-slate-100 text-sm p-4 overflow-x-auto"><code>{`// Pattern A: remember the opener, restore on close
let opener = null
function openMenu(trigger) {
  opener = trigger              // the button that opened the menu
  menu.hidden = false
  menu.querySelector("[role=menuitem]").focus()
}
function closeMenu() {
  menu.hidden = true
  opener?.focus()               // send focus back where it came from
}

// Pattern B: deleting the focused item — focus the next best thing first
function removeRow(row) {
  const next = row.nextElementSibling || row.previousElementSibling
  ;(next || row.closest("[data-list]")).focus()  // container is tabindex=-1
  row.remove()
}`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-4">
                For deletions, the container that receives fallback focus should
                have <code>tabindex=&#123;-1&#125;</code> and, ideally, an{" "}
                <code>aria-live</code> region announcing what was removed. This
                keeps the focus order coherent (
                <Link href="/wcag/2-4-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                  2.4.3
                </Link>
                ) and prevents the silent &ldquo;where did I go?&rdquo; moment
                that derails screen reader users.
              </p>
            </div>
          </section>

          {/* 6. Roving tabindex */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <KeyRound className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                6. Roving tabindex for Composite Widgets
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <Link href="/guides/accessible-tabs" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Tabs
                </Link>
                , toolbars, menus, and radio-style groups should be a{" "}
                <em>single</em> Tab stop — you Tab into the widget, then arrow keys
                move between its items, and Tab moves on to the next widget.
                Roving <code>tabindex</code> is the standard technique: exactly one
                item is <code>tabindex=&quot;0&quot;</code> at a time and the rest
                are <code>tabindex=&quot;-1&quot;</code>.
              </p>
              <pre className="rounded-lg bg-slate-900 text-slate-100 text-sm p-4 overflow-x-auto"><code>{`// Toolbar with roving tabindex: only the active button is tabbable.
const buttons = [...toolbar.querySelectorAll("button")]
let active = 0
buttons.forEach((b, i) => (b.tabIndex = i === 0 ? 0 : -1))

toolbar.addEventListener("keydown", (e) => {
  if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return
  buttons[active].tabIndex = -1                 // demote the old item
  active =
    e.key === "ArrowRight"
      ? (active + 1) % buttons.length
      : (active - 1 + buttons.length) % buttons.length
  buttons[active].tabIndex = 0                  // promote the new item
  buttons[active].focus()                       // move DOM focus with it
})`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-4">
                The alternative, <code>aria-activedescendant</code>, keeps DOM
                focus on the container and points at a virtually-active child by
                id — better when focus must stay on a text input, as in a{" "}
                <Link href="/guides/accessible-combobox" className="text-blue-600 dark:text-blue-400 hover:underline">
                  combobox
                </Link>
                . Follow the exact key bindings in the{" "}
                <a
                  href="https://www.w3.org/WAI/ARIA/apg/patterns/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  ARIA Authoring Practices patterns
                </a>{" "}
                and confirm the roles and states in our{" "}
                <Link href="/reference/aria" className="text-blue-600 dark:text-blue-400 hover:underline">
                  ARIA roles &amp; attributes reference
                </Link>
                .
              </p>
            </div>
          </section>

          {/* 7. Skip links & route change */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Route className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                7. Skip Links &amp; Focus on Navigation
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                A skip link lets keyboard users jump past a repeated header
                straight to the main content. It is the first focusable element on
                the page, visually hidden until focused, and it moves focus to a{" "}
                <code>&lt;main&gt;</code> target. In a single page app, you also
                need to move focus on route change, because swapping content
                client-side does not reset focus the way a full page load does.
              </p>
              <pre className="rounded-lg bg-slate-900 text-slate-100 text-sm p-4 overflow-x-auto"><code>{`<!-- Skip link: first in the DOM, revealed on focus -->
<a href="#main" class="skip-link">Skip to main content</a>
...
<main id="main" tabindex="-1">…</main>

<style>
  .skip-link {
    position: absolute;
    left: -9999px;          /* off-screen until focused */
  }
  .skip-link:focus {
    left: 1rem; top: 1rem;  /* pull into view on focus */
    z-index: 1000;
  }
</style>`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-4">
                On client-side navigation, move focus to the new view&apos;s{" "}
                <code>&lt;h1&gt;</code> (with{" "}
                <code>tabindex=&#123;-1&#125;</code>) or its{" "}
                <code>&lt;main&gt;</code> region so keyboard and screen reader
                users are not stranded on a stale link. This is a{" "}
                <Link href="/wcag/2-4-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                  2.4.3
                </Link>{" "}
                requirement; the framework-specific version is in the{" "}
                <Link href="/guides/react-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">
                  React accessibility guide
                </Link>
                .
              </p>
            </div>
          </section>

          {/* 8. Focus not obscured */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <EyeOff className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                8. Keep Focus Unobscured (WCAG 2.2)
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                New in WCAG 2.2,{" "}
                <Link href="/wcag/2-4-11" className="text-blue-600 dark:text-blue-400 hover:underline">
                  2.4.11 Focus Not Obscured (Minimum)
                </Link>{" "}
                requires that when an element receives focus, it is not{" "}
                <em>entirely</em> hidden by author-created content. The usual
                culprit is a sticky header or footer: you Tab to a field near the
                top of the viewport and the fixed header scrolls over it, so you
                cannot see what you are typing into. Reserve space with{" "}
                <code>scroll-margin-top</code>.
              </p>
              <pre className="rounded-lg bg-slate-900 text-slate-100 text-sm p-4 overflow-x-auto"><code>{`/* Sticky header 64px tall */
header { position: sticky; top: 0; height: 64px; }

/* When any element is scrolled to on focus, leave room for the header
   so it is never hidden underneath it. */
:target,
[tabindex],
a, button, input, select, textarea {
  scroll-margin-top: 80px;   /* header height + a little breathing room */
}`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Test it the way a user hits it: Tab through the whole page while
                slowly scrolling, and watch for any focused control that
                disappears behind fixed content. Cookie banners, chat widgets, and
                &ldquo;back to top&rdquo; buttons are frequent offenders. The
                stricter AAA version, 2.4.13 Focus Appearance, additionally sets a
                minimum size and contrast for the indicator itself.
              </p>
            </div>
          </section>

          {/* Keyboard & SR cards */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-start gap-3 pb-3">
                    <div className="rounded-lg bg-blue-100 dark:bg-blue-900/30 p-2">
                      <KeyRound className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <CardTitle className="text-lg">Focus Order Rules</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm text-muted-foreground leading-relaxed list-disc pl-5 space-y-2">
                      <li>DOM order = reading order; don&apos;t reorder with CSS alone.</li>
                      <li>Never use a positive <code>tabindex</code>.</li>
                      <li>Use <code>tabindex=&#123;-1&#125;</code> for programmatic targets only.</li>
                      <li>One Tab stop per composite widget (roving <code>tabindex</code>).</li>
                      <li>Restore focus to the trigger when overlays close.</li>
                    </ul>
                    <p className="text-sm text-muted-foreground mt-3">
                      More in the{" "}
                      <Link href="/guides/keyboard-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">
                        keyboard accessibility guide
                      </Link>
                      .
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-start gap-3 pb-3">
                    <div className="rounded-lg bg-purple-100 dark:bg-purple-900/30 p-2">
                      <Eye className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <CardTitle className="text-lg">Focus Visibility Rules</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm text-muted-foreground leading-relaxed list-disc pl-5 space-y-2">
                      <li>Style <code>:focus-visible</code>; never bare <code>outline: none</code>.</li>
                      <li>Indicator contrast at least 3:1 against neighbors.</li>
                      <li>Keep focus out from under sticky headers (2.4.11).</li>
                      <li>Focus a visible target; announce silent changes with live regions.</li>
                      <li>Don&apos;t change context just because focus arrives (3.2.1).</li>
                    </ul>
                    <p className="text-sm text-muted-foreground mt-3">
                      Verify with the{" "}
                      <Link href="/guides/screen-reader-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                        screen reader testing guide
                      </Link>
                      .
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Testing */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Bug className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                How to Test Focus Management
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Focus is one of the few things automated scanners can only
                partially check — they flag missing indicators and positive{" "}
                <code>tabindex</code>, but focus <em>order</em> and{" "}
                <em>restoration</em> need a human at the keyboard. Run this pass on
                every interactive view:
              </p>
              <ol className="space-y-3 text-muted-foreground leading-relaxed list-decimal pl-6">
                <li>
                  <strong className="text-slate-900 dark:text-white">Tab through the whole page.</strong>{" "}
                  Focus should move in reading order, and the focused element
                  should always be clearly visible.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Open and close every overlay.</strong>{" "}
                  Focus enters the dialog, is trapped inside, and returns to the
                  trigger on close (Escape and the close button both).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Operate composite widgets.</strong>{" "}
                  Tab reaches the widget once; arrow keys move within it; Tab moves
                  on.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Trigger dynamic changes.</strong>{" "}
                  Delete a row, load results, submit a form — confirm focus lands
                  somewhere sensible, not on <code>&lt;body&gt;</code>.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Scroll while tabbing.</strong>{" "}
                  No focused control hides behind a sticky header or banner.
                </li>
              </ol>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Layer in automated help: <code>axe-core</code> flags missing focus
                indicators and positive <code>tabindex</code>, and you can assert
                focus in end-to-end tests (
                <code>expect(page.locator(&quot;:focus&quot;)).toHaveText(...)</code>
                ). See{" "}
                <Link href="/guides/automated-vs-manual-accessibility-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                  automated vs manual testing
                </Link>{" "}
                for where each fits, then scan a live page with the{" "}
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
                Common Focus Mistakes &amp; How to Fix Them
              </h2>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    Common focus management anti-patterns, why they fail, and the
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
                Focus Management Checklist
              </h2>
              <ol className="space-y-4 text-muted-foreground leading-relaxed list-decimal pl-6">
                <li>
                  <strong className="text-slate-900 dark:text-white">Logical order.</strong>{" "}
                  Tab order matches the visual reading order; no positive{" "}
                  <code>tabindex</code>.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Always visible.</strong>{" "}
                  Every focusable element shows a clear{" "}
                  <code>:focus-visible</code> indicator with 3:1 contrast.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Overlays trap &amp; restore.</strong>{" "}
                  Modals move focus in, trap it, close on Escape, and return focus
                  to the trigger.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Widgets have one Tab stop.</strong>{" "}
                  Roving <code>tabindex</code> or{" "}
                  <code>aria-activedescendant</code> for tabs, menus, toolbars.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Navigation moves focus.</strong>{" "}
                  Skip link to <code>&lt;main&gt;</code>; route changes focus the
                  new heading.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Deletions relocate focus.</strong>{" "}
                  Removing the focused element moves focus to a neighbor first.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Nothing obscures focus.</strong>{" "}
                  Sticky headers and banners never cover the focused control (
                  <code>scroll-margin-top</code>).
                </li>
              </ol>
              <p className="text-muted-foreground leading-relaxed mt-6">
                Work through the full{" "}
                <Link href="/checklists/wcag-2-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                  WCAG 2.2 checklist
                </Link>{" "}
                to see focus in the context of every other requirement.
              </p>
            </div>
          </section>

          {/* CTA */}
          <section className="py-12 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <div className="rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20 p-8 text-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  Find Focus Issues on Your Site
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6 max-w-lg mx-auto">
                  Scan any page with our free axe-core-powered auditor to catch
                  missing focus indicators, positive <code>tabindex</code>, and
                  unlabeled controls — then run the manual keyboard pass above.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button asChild size="lg" className="gap-2">
                    <Link href="/tools/url-accessibility-auditor">
                      Scan a Page Now
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="gap-2">
                    <Link href="/guides/keyboard-accessibility">
                      Keyboard Accessibility Guide
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
                content="focus management tabindex focus-visible focus trap focus order roving tabindex skip link programmatic focus focus restoration keyboard accessibility screen reader wcag 2.4.3 2.4.7 2.4.11 2.1.2 modal dialog"
                title="Related Guides & Tools"
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
