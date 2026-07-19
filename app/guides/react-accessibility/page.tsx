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
  Boxes,
  Focus,
  Route,
  AlertCircle,
  KeyRound,
  Ear,
  Wand2,
  ListChecks,
  ShieldCheck,
  Bug,
  Component,
} from "lucide-react"

const pageTitle = "React Accessibility Guide"
const pageDescription =
  "Build accessible React apps: semantic JSX, focus management on route changes, accessible modals, ARIA in JSX, live-region announcements, accessible forms with useId, and testing with eslint-plugin-jsx-a11y, jest-axe, and Playwright — mapped to WCAG 2.2 AA."

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords: [
    "react accessibility",
    "accessible react components",
    "react a11y",
    "react aria",
    "react focus management",
    "react screen reader",
    "accessible react forms",
    "react useId label",
    "react route announcement",
    "eslint-plugin-jsx-a11y",
    "jest-axe",
    "react modal accessibility",
    "accessible react spa",
    "react keyboard accessibility",
    "wcag react",
    "next.js accessibility",
  ],
  alternates: {
    canonical: "/guides/react-accessibility",
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: "/guides/react-accessibility",
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
    name: "React Accessibility Guide",
    url: "https://accessibility.build/guides/react-accessibility",
  },
]

const faqs = [
  {
    question: "Is React accessible by default?",
    answer:
      "React itself is neutral — it renders whatever elements you write. If you write semantic HTML (button, a, nav, label, input, h1–h6), your app inherits the accessibility those elements already have. Problems come from React patterns, not React itself: div-and-span soup with onClick handlers, single-page navigation that never moves focus, dynamic content that screen readers never hear about, and custom widgets that reimplement native controls without keyboard support. This guide covers each of those. In short, React can be fully WCAG 2.2 AA accessible, but accessibility is something you build in, not something you get for free.",
  },
  {
    question: "How do I manage focus when the route changes in a React SPA?",
    answer:
      "In a traditional multi-page site, each navigation loads a new document and the browser resets focus to the top. A React single-page app swaps content without a full load, so focus stays wherever it was — often on a link inside the old page. That silently strands keyboard and screen reader users. The fix is to move focus to a sensible target after each route change: focus the new page's <h1> (with tabIndex={-1}) or a top-level main element, and announce the new page. Next.js App Router ships a built-in route announcer that reads the new document title on client navigation, but you still typically want to manage focus placement yourself for the clearest experience. This satisfies WCAG 2.4.3 Focus Order.",
  },
  {
    question: "How do I write ARIA attributes in JSX?",
    answer:
      "ARIA attributes keep their hyphens in JSX — you write aria-label, aria-describedby, aria-expanded, and role exactly as in HTML, unlike other DOM props such as className and htmlFor. Boolean ARIA states should be real booleans or strings depending on the attribute: aria-expanded={isOpen} works because React serialises the boolean to \"true\"/\"false\". Always prefer a native element with built-in semantics over adding a role; the first rule of ARIA is don't use ARIA if a native element will do. Our ARIA reference documents every role and state with copy-ready examples.",
  },
  {
    question: "What is useId and why does it matter for accessibility?",
    answer:
      "React's useId hook (React 18+) generates a stable, unique id that is consistent between server and client rendering. It is the correct way to wire a label to an input, or an input to its error message via aria-describedby, in a reusable component — because hardcoding an id breaks when the component is rendered more than once on a page, and generating a random id causes server/client hydration mismatches. Call useId once and derive related ids from it (for example inputId and errorId) so a single component instance keeps its associations intact.",
  },
  {
    question: "Do I need ARIA if I use a component library?",
    answer:
      "It depends on the library. Headless libraries built for accessibility — React Aria, Radix UI, Headless UI, Reach UI — implement the ARIA Authoring Practices patterns, keyboard interaction, and focus management for you, so you mostly supply labels and content. Purely visual libraries may render inaccessible markup that you still have to fix. Either way, never assume: test the real rendered output with a keyboard and a screen reader, because even good libraries can be misconfigured (an unlabeled icon button, a dialog without an accessible name).",
  },
  {
    question: "How do I test a React app for accessibility?",
    answer:
      "Use three layers. First, lint: eslint-plugin-jsx-a11y (bundled with Next.js's default ESLint config) catches many issues as you type, such as a missing alt or an onClick on a non-interactive element. Second, unit and integration tests: render components with React Testing Library — which encourages accessible queries like getByRole and getByLabelText — and assert on them with jest-axe to catch violations automatically. Third, end-to-end: run axe-core in Playwright or Cypress against real pages. None of these replace manual keyboard and screen reader testing, which is the only way to confirm the experience actually works.",
  },
]

const antiPatterns = [
  {
    bad: "<div onClick={...}> used as a button.",
    why: "Not focusable, not keyboard-operable, no role announced (WCAG 2.1.1, 4.1.2).",
    fix: "Use a real <button>. eslint-plugin-jsx-a11y flags this automatically.",
  },
  {
    bad: "Route changes that never move focus.",
    why: "Keyboard and screen reader users are stranded on the old page (2.4.3).",
    fix: "Focus the new page's <h1> or <main> after navigation.",
  },
  {
    bad: "Dynamic results/toasts updated silently.",
    why: "Screen readers never hear the change (4.1.3 Status Messages).",
    fix: "Render updates inside an aria-live region.",
  },
  {
    bad: "Hardcoded id on a reusable labeled input.",
    why: "Duplicate ids break label/error associations when reused.",
    fix: "Generate ids with the useId hook.",
  },
  {
    bad: "autoFocus and index-based key spread everywhere.",
    why: "Unexpected focus jumps and re-mount focus loss disorient users.",
    fix: "Move focus intentionally with refs at the right moment.",
  },
  {
    bad: "Modal that doesn't trap focus or restore it on close.",
    why: "Focus escapes behind the overlay; users get lost (2.4.3, 2.1.2).",
    fix: "Trap focus in the dialog, return it to the trigger on close.",
  },
]

export default function ReactAccessibilityGuidePage() {
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
                    React Accessibility
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
                React Accessibility: The Complete WCAG 2.2 Guide
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                React is accessible when you build it that way. This guide covers
                the patterns that actually trip React apps up — semantic JSX,
                focus on route changes, accessible modals, ARIA in JSX, live
                announcements, and forms with <code>useId</code> — with
                copy-ready components and a testing workflow that keeps them
                accessible.
              </p>
            </div>
          </section>

          {/* Why React is different */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                Why React Accessibility Is Different
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  React does not make a page inaccessible on its own — it renders
                  whatever elements you write. If you reach for a real{" "}
                  <code>&lt;button&gt;</code>, <code>&lt;a&gt;</code>,{" "}
                  <code>&lt;nav&gt;</code>, and <code>&lt;label&gt;</code>, you
                  inherit the keyboard behavior, focus handling, and screen
                  reader semantics those elements already ship with. The trouble
                  is that React makes it just as easy to render a{" "}
                  <code>&lt;div onClick&gt;</code> that looks like a button but
                  is invisible to assistive technology.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Three things about the React model create accessibility work
                  you would not have on a static site. First,{" "}
                  <strong className="text-slate-900 dark:text-white">
                    client-side routing
                  </strong>{" "}
                  swaps content without a full page load, so focus and screen
                  reader context are never reset unless you do it. Second,{" "}
                  <strong className="text-slate-900 dark:text-white">
                    dynamic rendering
                  </strong>{" "}
                  updates the DOM constantly — results, toasts, validation — and
                  none of it is announced unless you use a live region. Third,{" "}
                  <strong className="text-slate-900 dark:text-white">
                    component abstraction
                  </strong>{" "}
                  hides markup behind reusable components, so a single wrong
                  choice (a div for a button, a missing label) is repeated
                  everywhere it is used. Get these three right and most of React
                  accessibility falls into place. Working in another framework?
                  The same principles carry over to our{" "}
                  <Link
                    href="/guides/vue-accessibility"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Vue accessibility guide
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/guides/angular-accessibility"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Angular accessibility guide
                  </Link>
                  .
                </p>
              </div>
            </div>
          </section>

          {/* WCAG mapping */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <ShieldCheck className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                The WCAG 2.2 Criteria React Apps Break Most
              </h2>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    WCAG 2.2 success criteria most commonly failed by React
                    applications and what each requires
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
                        What it requires in React
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
                      <td className="px-4 py-3">Use semantic JSX; wire labels and errors with useId.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-1-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.1.1 Keyboard
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Interactive elements must be real buttons/links, not divs.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-1-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.1.2 No Keyboard Trap
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Modals trap focus deliberately and release it on close.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-4-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.4.3 Focus Order
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Move focus on route change and on open/close of overlays.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-4-7" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.4.7 Focus Visible
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">Never remove focus outlines without a visible replacement.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/3-3-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          3.3.1 Error Identification
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Tie validation messages to fields with aria-describedby.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/4-1-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                          4.1.2 Name, Role, Value
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Custom components expose an accessible name, role, and state.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/4-1-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                          4.1.3 Status Messages
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">Announce async updates through an aria-live region.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-muted-foreground leading-relaxed mt-4 text-sm">
                For the full list, see the{" "}
                <Link
                  href="/guides/wcag-2-2-aa-requirements"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  WCAG 2.2 Level AA requirements
                </Link>{" "}
                and the interactive{" "}
                <Link
                  href="/checklists/wcag-2-2"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  WCAG 2.2 checklist
                </Link>
                .
              </p>
            </div>
          </section>

          {/* 1. Semantic JSX */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Component className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                1. Write Semantic JSX First
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The single highest-impact rule in React accessibility: render the
                element that already does the job. A <code>&lt;button&gt;</code>{" "}
                is focusable, fires on Enter and Space, and announces its role. A{" "}
                <code>&lt;div onClick&gt;</code> does none of that until you add a
                role, <code>tabIndex</code>, and keyboard handlers by hand — and
                get all three exactly right.
              </p>
              <pre className="rounded-lg bg-slate-900 text-slate-100 text-sm p-4 overflow-x-auto"><code>{`// Inaccessible: not focusable, no keyboard, no role
<div className="btn" onClick={handleSave}>Save</div>

// Accessible: keyboard + role + focus for free
<button type="button" onClick={handleSave}>Save</button>

// Navigation is a list of links inside <nav>
<nav aria-label="Primary">
  <ul>
    <li><Link href="/pricing">Pricing</Link></li>
    <li><Link href="/guides">Guides</Link></li>
  </ul>
</nav>`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Use one <code>&lt;h1&gt;</code> per page and keep headings in
                order (<code>h1</code> &rarr; <code>h2</code> &rarr;{" "}
                <code>h3</code>) so screen reader users can navigate by heading.
                Wrap the primary content in <code>&lt;main&gt;</code>, and reach
                for <code>&lt;button&gt;</code> for actions and{" "}
                <code>&lt;a&gt;</code>/<code>&lt;Link&gt;</code> for navigation —
                the difference matters to assistive tech even when they look
                identical.
              </p>
            </div>
          </section>

          {/* 2. Focus on route change */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Route className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                2. Manage Focus on Route Changes
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                When a client-side route changes, the browser does not reset
                focus the way a full page load would. Keyboard and screen reader
                users are left on whatever link they clicked, now pointing at
                content that no longer exists. Move focus to the top of the new
                view — usually its heading.
              </p>
              <pre className="rounded-lg bg-slate-900 text-slate-100 text-sm p-4 overflow-x-auto"><code>{`// A route-aware heading that receives focus after navigation
import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"

export function PageHeading({ children }) {
  const ref = useRef(null)
  const pathname = usePathname()

  useEffect(() => {
    ref.current?.focus()
  }, [pathname])

  return (
    <h1 ref={ref} tabIndex={-1} className="outline-none">
      {children}
    </h1>
  )
}`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-4">
                <code>tabIndex=&#123;-1&#125;</code> lets the heading receive
                programmatic focus without adding it to the Tab order. Next.js
                App Router also ships a built-in route announcer that reads the
                new document <code>&lt;title&gt;</code> on navigation, so keeping
                page titles unique and descriptive is part of the same job. This
                satisfies{" "}
                <Link href="/wcag/2-4-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                  2.4.3 Focus Order
                </Link>
                . Provide a{" "}
                <Link href="/guides/keyboard-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">
                  skip link
                </Link>{" "}
                to <code>#main</code> as well.
              </p>
            </div>
          </section>

          {/* 3. Accessible modals / focus trap */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Focus className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                3. Accessible Modals &amp; Focus Trapping
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                A dialog is the classic React focus challenge. When it opens,
                focus must move into it; while open, focus must stay trapped
                inside; on close, focus must return to the control that opened
                it. The native <code>&lt;dialog&gt;</code> element handles most
                of this, and its <code>showModal()</code> method traps focus and
                supports Escape for you.
              </p>
              <pre className="rounded-lg bg-slate-900 text-slate-100 text-sm p-4 overflow-x-auto"><code>{`import { useEffect, useRef } from "react"

export function ConfirmDialog({ open, onClose, children }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    const node = dialogRef.current
    if (!node) return
    if (open) node.showModal()   // traps focus + enables Escape
    else node.close()
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="dialog-title"
      onClose={onClose}
      className="rounded-lg p-6 backdrop:bg-black/50"
    >
      <h2 id="dialog-title">Delete this project?</h2>
      {children}
      <button type="button" onClick={onClose}>Cancel</button>
    </dialog>
  )
}`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-4">
                If you build a custom overlay instead of using{" "}
                <code>&lt;dialog&gt;</code>, you must add <code>role="dialog"</code>,{" "}
                <code>aria-modal="true"</code>, an accessible name via{" "}
                <code>aria-labelledby</code>, a focus trap, Escape-to-close, and
                focus restoration yourself — which is exactly why headless
                libraries like Radix UI, React Aria, and Headless UI exist. See
                the{" "}
                <Link href="/learn/modals" className="text-blue-600 dark:text-blue-400 hover:underline">
                  accessible modal pattern
                </Link>{" "}
                for the full interaction spec.
              </p>
            </div>
          </section>

          {/* 4. Live regions */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Ear className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                4. Announce Dynamic Content with Live Regions
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                React updates the DOM silently. When search results load, a toast
                appears, or a form saves, a sighted user sees it instantly — a
                screen reader user hears nothing unless the change happens inside
                an <code>aria-live</code> region. Render a persistent live region
                and update its text.
              </p>
              <pre className="rounded-lg bg-slate-900 text-slate-100 text-sm p-4 overflow-x-auto"><code>{`function SearchResults({ status, results }) {
  return (
    <div>
      {/* Polite: announced when the user is idle, never interrupts */}
      <p aria-live="polite" className="sr-only">
        {status === "loading"
          ? "Searching…"
          : results.length + " results found"}
      </p>

      <ul>
        {results.map((r) => (
          <li key={r.id}>{r.title}</li>
        ))}
      </ul>
    </div>
  )
}`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Use <code>aria-live="polite"</code> for status updates and{" "}
                <code>aria-live="assertive"</code> only for urgent, interrupting
                messages like a session-timeout warning. The region must exist in
                the DOM <em>before</em> its text changes, so render it empty
                rather than mounting it on demand. This satisfies{" "}
                <Link href="/wcag/4-1-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                  4.1.3 Status Messages
                </Link>
                .
              </p>
            </div>
          </section>

          {/* 5. Accessible forms with useId */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <AlertCircle className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                5. Accessible Forms with useId
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                In a reusable input component you cannot hardcode an{" "}
                <code>id</code> — render it twice and the ids collide, breaking
                every label and error association. React&apos;s{" "}
                <code>useId</code> hook generates a stable, hydration-safe id.
                Derive the field and error ids from it and wire them with{" "}
                <code>htmlFor</code>, <code>aria-describedby</code>, and{" "}
                <code>aria-invalid</code>.
              </p>
              <pre className="rounded-lg bg-slate-900 text-slate-100 text-sm p-4 overflow-x-auto"><code>{`import { useId } from "react"

export function TextField({ label, error, ...props }) {
  const id = useId()
  const errorId = id + "-error"

  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        {...props}
      />
      {error && (
        <p id={errorId} className="text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Note the JSX specifics: use <code>htmlFor</code> (not{" "}
                <code>for</code>) and <code>className</code> (not{" "}
                <code>class</code>), but keep <code>aria-*</code> attributes
                hyphenated. Only set <code>aria-invalid</code> and{" "}
                <code>aria-describedby</code> when there is actually an error, so
                assistive tech is not told about a message that is not shown. For
                the full treatment of labels, grouping, validation, and error
                summaries, see the{" "}
                <Link href="/guides/accessible-forms" className="text-blue-600 dark:text-blue-400 hover:underline">
                  accessible forms guide
                </Link>
                .
              </p>
            </div>
          </section>

          {/* 6. ARIA in JSX + keyboard */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Wand2 className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                6. ARIA in JSX &amp; Custom Widgets
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                When you genuinely need a custom widget — a disclosure, a tab set,
                a combobox — ARIA describes its state to assistive technology.
                Follow the{" "}
                <a
                  href="https://www.w3.org/WAI/ARIA/apg/patterns/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  ARIA Authoring Practices patterns
                </a>{" "}
                exactly, and mirror the ARIA state in your React state.
              </p>
              <pre className="rounded-lg bg-slate-900 text-slate-100 text-sm p-4 overflow-x-auto"><code>{`function Disclosure({ label, children }) {
  const [open, setOpen] = useState(false)
  const panelId = useId()

  return (
    <>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((v) => !v)}
      >
        {label}
      </button>
      <div id={panelId} hidden={!open}>
        {children}
      </div>
    </>
  )
}`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Because the toggle is a real <code>&lt;button&gt;</code>, keyboard
                support and focus come free — you only add{" "}
                <code>aria-expanded</code> and <code>aria-controls</code> to
                describe the relationship. For widgets that need arrow-key
                navigation (tabs, menus, listboxes), implement a roving{" "}
                <code>tabIndex</code> and the documented key bindings. Our{" "}
                <Link href="/reference/aria" className="text-blue-600 dark:text-blue-400 hover:underline">
                  ARIA roles &amp; attributes reference
                </Link>{" "}
                lists the exact roles and states for each pattern.
              </p>
            </div>
          </section>

          {/* 7. Keyboard & SR cards */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-start gap-3 pb-3">
                    <div className="rounded-lg bg-blue-100 dark:bg-blue-900/30 p-2">
                      <KeyRound className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <CardTitle className="text-lg">Keyboard Rules for React</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm text-muted-foreground leading-relaxed list-disc pl-5 space-y-2">
                      <li>Interactive = real <code>&lt;button&gt;</code> or <code>&lt;a&gt;</code>, never a div.</li>
                      <li>Move focus with refs on open, close, and route change.</li>
                      <li>Trap focus in modals; restore it to the trigger on close.</li>
                      <li>Keep a visible focus outline (<Link href="/wcag/2-4-7" className="text-blue-600 dark:text-blue-400 hover:underline">2.4.7</Link>).</li>
                      <li>Roving <code>tabIndex</code> for arrow-key widgets.</li>
                    </ul>
                    <p className="text-sm text-muted-foreground mt-3">
                      See the{" "}
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
                      <Ear className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <CardTitle className="text-lg">Screen Reader Rules</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm text-muted-foreground leading-relaxed list-disc pl-5 space-y-2">
                      <li>Announce route changes and async updates via live regions.</li>
                      <li>Every control has an accessible name (label or <code>aria-label</code>).</li>
                      <li>Icon-only buttons need <code>aria-label</code>; decorative icons get <code>aria-hidden</code>.</li>
                      <li>Custom widgets expose role, name, and current value.</li>
                      <li>Images use meaningful <code>alt</code>, or <code>alt=""</code> if decorative.</li>
                    </ul>
                    <p className="text-sm text-muted-foreground mt-3">
                      Test with real AT — the{" "}
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

          {/* 8. Testing & tooling */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Bug className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                7. Testing &amp; Tooling
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Automated checks catch a meaningful share of issues and stop
                regressions — but they find roughly a third to a half of WCAG
                problems, so they supplement rather than replace manual testing.
                Layer three tools into your workflow:
              </p>
              <pre className="rounded-lg bg-slate-900 text-slate-100 text-sm p-4 overflow-x-auto"><code>{`// 1. Lint as you type — jsx-a11y ships with Next.js's ESLint config
//    Flags <img> without alt, onClick on non-interactive elements, etc.

// 2. Component tests: React Testing Library + jest-axe
import { render } from "@testing-library/react"
import { axe } from "jest-axe"

test("TextField has no axe violations", async () => {
  const { container } = render(
    <TextField label="Email" error="Enter a valid email" />
  )
  expect(await axe(container)).toHaveNoViolations()
})

// 3. End-to-end: axe-core in Playwright against real pages
import AxeBuilder from "@axe-core/playwright"

test("home page is accessible", async ({ page }) => {
  await page.goto("/")
  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations).toEqual([])
})`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-4">
                React Testing Library nudges you toward accessible queries —{" "}
                <code>getByRole</code> and <code>getByLabelText</code> only pass
                when the accessibility tree is correct, so writing tests this way
                surfaces missing names early. Finish every feature with a manual
                keyboard pass and a screen reader pass. Read our comparison of{" "}
                <Link href="/guides/automated-vs-manual-accessibility-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                  automated vs manual testing
                </Link>{" "}
                to see where each fits.
              </p>
            </div>
          </section>

          {/* Anti-patterns */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                Common React Mistakes &amp; How to Fix Them
              </h2>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    Common React accessibility anti-patterns, why they fail, and
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

          {/* Testing checklist */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <ListChecks className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                React Accessibility Checklist
              </h2>
              <ol className="space-y-4 text-muted-foreground leading-relaxed list-decimal pl-6">
                <li>
                  <strong className="text-slate-900 dark:text-white">Semantic elements.</strong>{" "}
                  Every clickable thing is a <code>&lt;button&gt;</code> or{" "}
                  <code>&lt;a&gt;</code>; headings are ordered; one{" "}
                  <code>&lt;h1&gt;</code> per view.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Focus on navigation.</strong>{" "}
                  Route changes move focus to the new heading or main region.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Overlays.</strong>{" "}
                  Modals trap focus, close on Escape, and restore focus to the
                  trigger.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Live regions.</strong>{" "}
                  Async results, toasts, and errors are announced.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Forms.</strong>{" "}
                  Labels tied with <code>useId</code>; errors linked with{" "}
                  <code>aria-describedby</code> and <code>aria-invalid</code>.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Names.</strong>{" "}
                  Icon-only buttons have <code>aria-label</code>; decorative
                  images use <code>alt=""</code>.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Automated + manual.</strong>{" "}
                  jsx-a11y + jest-axe in CI, plus a keyboard and screen reader
                  pass.
                </li>
              </ol>
              <p className="text-muted-foreground leading-relaxed mt-6">
                Scan the deployed build with our{" "}
                <Link href="/tools/url-accessibility-auditor" className="text-blue-600 dark:text-blue-400 hover:underline">
                  URL accessibility auditor
                </Link>{" "}
                and work through the full{" "}
                <Link href="/checklists/wcag-2-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                  WCAG 2.2 checklist
                </Link>
                .
              </p>
            </div>
          </section>

          {/* CTA */}
          <section className="py-12 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <div className="rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20 p-8 text-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  Audit Your React App in Seconds
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6 max-w-lg mx-auto">
                  Run any deployed React or Next.js page through our free
                  axe-core-powered auditor to catch missing names, unlabeled
                  controls, and contrast failures — then work through the manual
                  checks above.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button asChild size="lg" className="gap-2">
                    <Link href="/tools/url-accessibility-auditor">
                      Scan a Page Now
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="gap-2">
                    <Link href="/reference/aria">Open the ARIA Reference</Link>
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
                content="react accessibility jsx aria focus management route change modal live region useId accessible forms keyboard screen reader wcag 4.1.2 2.4.3 eslint-plugin-jsx-a11y jest-axe"
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
