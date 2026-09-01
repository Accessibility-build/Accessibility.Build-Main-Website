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
  Route,
  AlertCircle,
  KeyRound,
  Ear,
  Radio,
  ListChecks,
  ShieldCheck,
  Bug,
  Component,
  Braces,
  Puzzle,
  TriangleAlert,
  Boxes,
} from "lucide-react"
import { PageByline } from "@/components/seo/page-byline"
import { GuideArticleSchema } from "@/components/seo/guide-article-schema"
import { clampDescription } from "@/lib/metadata"

const pageTitle = "Svelte Accessibility Guide"
const pageDescription =
  "Build accessible Svelte 5 and SvelteKit apps: semantic markup, the compiler's built-in a11y warnings, reactive ARIA binding, focus traps packaged as use: actions, SvelteKit route announcements and focus management, live regions that actually announce, accessible forms with bind:value, and testing with svelte-check, eslint-plugin-svelte, and vitest-axe — mapped to WCAG 2.2 AA."

export const metadata: Metadata = {
  title: pageTitle,
  description: clampDescription(pageDescription),
  keywords: [
    "svelte accessibility",
    "sveltekit accessibility",
    "svelte a11y",
    "svelte 5 accessibility",
    "accessible svelte components",
    "svelte aria",
    "svelte compiler a11y warnings",
    "svelte a11y warnings",
    "svelte focus management",
    "sveltekit router focus",
    "sveltekit route announcements",
    "svelte use action focus trap",
    "svelte live region",
    "svelte accessible forms",
    "eslint-plugin-svelte accessibility",
    "svelte-check a11y",
    "svelte screen reader",
    "wcag svelte",
  ],
  alternates: {
    canonical: "/guides/svelte-accessibility",
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: "/guides/svelte-accessibility",
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
    name: "Svelte Accessibility Guide",
    url: "https://accessibility.build/guides/svelte-accessibility",
  },
]

const faqs = [
  {
    question: "Is Svelte accessible by default?",
    answer:
      "Svelte renders whatever markup you write, so if you reach for semantic elements (button, a, nav, label, input, h1–h6) you inherit their keyboard behavior and screen reader semantics for free. Svelte goes one step further than most frameworks: its compiler ships built-in accessibility checks and prints a11y warnings at compile time when it spots problems like an image without alt text, a click handler on a non-interactive div, or a label with no associated control. Those warnings catch a meaningful slice of issues before the code ever runs — but they only see static markup, so dynamic ARIA, focus management on navigation, and live-region announcements are still on you. Svelte can be fully WCAG 2.2 AA accessible; it is something you build in, not something you get for free.",
  },
  {
    question: "What are Svelte's a11y warnings and should I disable them?",
    answer:
      "When the Svelte compiler analyzes your markup it emits warnings whose codes start with a11y_ — for example a11y_missing_attribute (an img with no alt), a11y_click_events_have_key_events (an on:click element with no keyboard handler), a11y_no_static_element_interactions (a handler on a div or span that has no role), a11y_label_has_associated_control, and a11y_media_has_caption. They show in your terminal during dev and build and in your editor through the Svelte extension. Treat them as bugs to fix, not noise to silence. You can suppress a single line with a <!-- svelte-ignore a11y_… --> comment, but only do that when you have a documented, verified reason — a suppressed warning is an accessibility defect you have chosen to keep. Never disable the whole category.",
  },
  {
    question: "How do I bind ARIA attributes reactively in Svelte?",
    answer:
      "Write the attribute directly in markup with a curly-brace expression: aria-expanded={isOpen} renders aria-expanded=\"true\" or \"false\" because Svelte stringifies the boolean. The key rule is what happens with empty values: when the expression is null or undefined, Svelte omits the attribute entirely. That lets you write aria-describedby={hasError ? 'email-error' : undefined} so the attribute only appears when there is genuinely an error. For token attributes bind the token, not a bare boolean — aria-current={isActive ? 'page' : undefined}, not aria-current={isActive}, which renders the less useful aria-current=\"true\". In Svelte 5, drive these from runes such as $state and $derived.",
  },
  {
    question: "How do I package focus management as a Svelte action?",
    answer:
      "A Svelte action is a function you attach to an element with use:name. The compiler calls it with the DOM node when the element mounts, and you return an object with an optional destroy() that runs on unmount. That lifecycle makes actions the idiomatic Svelte home for accessibility behavior that needs a real element — a focus trap, click-outside-to-close, or moving focus on mount. You write use:trapFocus on your dialog once, and the action owns adding the keydown listener, cycling Tab and Shift+Tab inside the dialog, and cleaning the listener up on close. It keeps the behavior reusable and testable instead of scattered across component lifecycles.",
  },
  {
    question: "Does SvelteKit handle focus and announcements on navigation?",
    answer:
      "More than most SPA routers. After each client-side navigation SvelteKit announces the new page in a visually hidden live region that reads the page's document title, and it resets focus to the body element so keyboard and screen reader users start from the top of the new page (unless an element on the page has autofocus). Two things follow: give every route a unique, descriptive title via svelte:head, because that title is literally what gets announced; and if you want focus to land somewhere more useful than body — the main region or the new h1 — customize it with afterNavigate from $app/navigation. Pair that with a skip link. This supports WCAG 2.4.3 Focus Order.",
  },
  {
    question: "How do I test a Svelte app for accessibility?",
    answer:
      "Use four layers. First, the compiler: its a11y warnings run every build, and svelte-check surfaces them in CI so they fail the pipeline. Second, lint: eslint-plugin-svelte adds further static rules on top of the compiler. Third, component tests: render components with @testing-library/svelte — which pushes you toward accessible queries like getByRole and getByLabelText — and assert with vitest-axe (or jest-axe) using the toHaveNoViolations matcher. Fourth, end-to-end: run axe-core through @axe-core/playwright against real routes. None of these replace a manual keyboard and screen reader pass, which is the only way to confirm the experience actually works.",
  },
]

const antiPatterns = [
  {
    bad: "<div on:click={...}> used as a button.",
    why: "Not focusable, no keyboard, no role — and the compiler already warned you (WCAG 2.1.1, 4.1.2).",
    fix: "Use a real <button>. Fix a11y_click_events_have_key_events; don't svelte-ignore it.",
  },
  {
    bad: "Suppressing an a11y_ warning to ship faster.",
    why: "A silenced warning is a real defect kept on purpose (varies by rule).",
    fix: "Fix the markup. Reserve <!-- svelte-ignore --> for documented, verified exceptions.",
  },
  {
    bad: "Live region added with {#if} when the message appears.",
    why: "The region didn't exist before the change, so nothing is announced (4.1.3).",
    fix: "Keep an always-mounted aria-live region and only change its text.",
  },
  {
    bad: "Routes without a unique <svelte:head><title>.",
    why: "SvelteKit's navigation announcement reads the title — a blank or duplicate title says nothing useful (2.4.3).",
    fix: "Set a descriptive per-page title in svelte:head.",
  },
  {
    bad: "Hand-rolled dialog with no focus trap or restoration.",
    why: "Focus escapes behind the overlay and never returns (2.1.2, 2.4.3).",
    fix: "Package the trap as a use:trapFocus action, or use a headless library (Bits UI / Melt UI).",
  },
  {
    bad: "Form errors not tied to their input.",
    why: "Screen reader users hear the field but not why it failed (3.3.1).",
    fix: "Bind aria-invalid and aria-describedby to the message, undefined when valid.",
  },
]

export default function SvelteAccessibilityGuidePage() {
  return (
    <>
      <BreadcrumbStructuredData breadcrumbs={breadcrumbs} />
      <GuideArticleSchema route="/guides/svelte-accessibility" title={pageTitle} description={pageDescription} datePublished="2026-07-18" />
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
                    Svelte Accessibility
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
                Svelte Accessibility: The Complete WCAG 2.2 Guide
              </h1>
              <PageByline route="/guides/svelte-accessibility" className="mb-5" />
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Svelte is the one framework whose compiler warns you about
                accessibility as you type. This guide covers the patterns that
                actually trip Svelte 5 and SvelteKit apps up: reading the{" "}
                <code>a11y_*</code> warnings instead of silencing them, reactive
                ARIA with runes, focus traps packaged as <code>use:</code>{" "}
                actions, SvelteKit route announcements and focus, live regions
                that announce, and accessible forms — with copy-ready code and a
                testing workflow that keeps it accessible.
              </p>
            </div>
          </section>

          {/* Why Svelte is different */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                Why Svelte Accessibility Is Different
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Svelte does not make a page inaccessible on its own — it
                  compiles whatever markup you write. Reach for a real{" "}
                  <code>&lt;button&gt;</code>, <code>&lt;a&gt;</code>,{" "}
                  <code>&lt;nav&gt;</code>, and <code>&lt;label&gt;</code> and you
                  inherit the keyboard behavior, focus handling, and screen
                  reader semantics those elements already provide. What sets
                  Svelte apart from React, Vue, and Angular is that its{" "}
                  <strong className="text-slate-900 dark:text-white">
                    compiler ships accessibility checks
                  </strong>
                  : write an image with no <code>alt</code> or an{" "}
                  <code>on:click</code> on a bare <code>&lt;div&gt;</code> and
                  Svelte prints a warning at compile time, before the code runs.
                  No other mainstream framework does this out of the box.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Those warnings are a floor, not a ceiling — they only see
                  static markup. Three things about the Svelte model create
                  accessibility work the compiler cannot check for you. First,{" "}
                  <strong className="text-slate-900 dark:text-white">
                    client-side routing
                  </strong>{" "}
                  in SvelteKit swaps the page without a full load; SvelteKit
                  handles more of this than most routers, but focus intent is
                  still yours to refine. Second,{" "}
                  <strong className="text-slate-900 dark:text-white">
                    reactivity
                  </strong>{" "}
                  updates the DOM constantly — results, toasts, validation — and
                  none of it is announced unless it happens inside a live region.
                  Third,{" "}
                  <strong className="text-slate-900 dark:text-white">
                    components
                  </strong>{" "}
                  hide markup behind reusable pieces, so one wrong choice (a div
                  for a button, a missing label) repeats everywhere it is used.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Get the compiler warnings, reactive ARIA, focus with{" "}
                  <code>use:</code> actions, and SvelteKit&apos;s navigation
                  behavior right and most of Svelte accessibility falls into
                  place. If you also work in another framework, the same
                  principles map cleanly onto our{" "}
                  <Link
                    href="/guides/react-accessibility"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    React accessibility guide
                  </Link>
                  ,{" "}
                  <Link
                    href="/guides/vue-accessibility"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Vue accessibility guide
                  </Link>
                  , and{" "}
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
                The WCAG 2.2 Criteria Svelte Apps Break Most
              </h2>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    WCAG 2.2 success criteria most commonly failed by Svelte and
                    SvelteKit applications and what each requires
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
                        What it requires in Svelte
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
                      <td className="px-4 py-3">Use semantic markup; heed <code>a11y_label_has_associated_control</code>.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-1-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.1.1 Keyboard
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Interactive elements are real buttons/links, not <code>on:click</code> divs.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-1-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.1.2 No Keyboard Trap
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">A <code>use:trapFocus</code> action traps focus deliberately and releases it on close.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-4-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.4.3 Focus Order
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Refine focus with <code>afterNavigate</code>; open/close overlays move focus.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-4-7" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.4.7 Focus Visible
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">Keep a visible focus outline; never remove it without a replacement.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/3-3-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          3.3.1 Error Identification
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Tie validation messages to fields with <code>aria-describedby</code>.</td>
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
                      <td className="px-4 py-3">Announce async updates in an always-mounted <code>aria-live</code> region.</td>
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

          {/* 1. Semantic markup first */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Component className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                1. Write Semantic Markup First
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The single highest-impact rule in Svelte accessibility: render
                the element that already does the job. A{" "}
                <code>&lt;button&gt;</code> is focusable, fires on Enter and
                Space, and announces its role. A <code>&lt;div on:click&gt;</code>{" "}
                does none of that until you add a role, <code>tabindex</code>, and
                keyboard handlers by hand — and Svelte will warn you about every
                one of those omissions as you go.
              </p>
              <pre className="rounded-lg bg-slate-900 text-slate-100 text-sm p-4 overflow-x-auto"><code>{`<!-- Inaccessible: not focusable, no keyboard, no role.
     Svelte warns: a11y_no_static_element_interactions
                   a11y_click_events_have_key_events -->
<div class="btn" on:click={save}>Save</div>

<!-- Accessible: keyboard + role + focus for free -->
<button type="button" on:click={save}>Save</button>

<!-- Navigation is a list of links inside <nav> -->
<nav aria-label="Primary">
  <ul>
    <li><a href="/pricing">Pricing</a></li>
    <li><a href="/guides">Guides</a></li>
  </ul>
</nav>`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Use one <code>&lt;h1&gt;</code> per page and keep headings in
                order (<code>h1</code> &rarr; <code>h2</code> &rarr;{" "}
                <code>h3</code>) so screen reader users can navigate by heading.
                Wrap the routed content in <code>&lt;main&gt;</code>, and reach
                for <code>&lt;button&gt;</code> for actions and{" "}
                <code>&lt;a href&gt;</code> for navigation — in SvelteKit a plain{" "}
                <code>&lt;a&gt;</code> is automatically enhanced into a
                client-side navigation, so you rarely need a special link
                component. The difference between a button and a link matters to
                assistive tech even when they look identical.
              </p>
            </div>
          </section>

          {/* 2. Compile-time a11y warnings — the marquee */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <TriangleAlert className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                2. Read the Compiler&apos;s <code>a11y_*</code> Warnings
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                This is Svelte&apos;s signature accessibility advantage. As the
                compiler analyzes your markup it emits warnings whose codes begin
                with <code>a11y_</code> whenever it sees a likely accessibility
                bug. They print in your terminal during <code>dev</code> and{" "}
                <code>build</code>, and appear inline in your editor through the
                Svelte extension — so you find the problem while writing the
                component, not after an audit. No other mainstream framework
                checks accessibility at compile time.
              </p>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 mb-4">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    A selection of Svelte compiler accessibility warnings, what
                    each one flags, and the fix
                  </caption>
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">Warning code</th>
                      <th scope="col" className="px-4 py-3 font-semibold">What it flags</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium"><code>a11y_missing_attribute</code></th>
                      <td className="px-4 py-3">An <code>&lt;img&gt;</code> with no <code>alt</code>, an <code>&lt;a&gt;</code> with no <code>href</code>, and similar required attributes.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium"><code>a11y_click_events_have_key_events</code></th>
                      <td className="px-4 py-3">An <code>on:click</code> on an element with no keyboard handler.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium"><code>a11y_no_static_element_interactions</code></th>
                      <td className="px-4 py-3">A handler on a non-interactive element (<code>div</code>, <code>span</code>) that has no <code>role</code>.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium"><code>a11y_label_has_associated_control</code></th>
                      <td className="px-4 py-3">A <code>&lt;label&gt;</code> not linked to a control via <code>for</code> or by wrapping it.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium"><code>a11y_media_has_caption</code></th>
                      <td className="px-4 py-3">A <code>&lt;video&gt;</code> with no <code>&lt;track kind=&quot;captions&quot;&gt;</code>.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium"><code>a11y_positive_tabindex</code></th>
                      <td className="px-4 py-3">A <code>tabindex</code> greater than zero, which breaks the natural focus order.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium"><code>a11y_no_redundant_roles</code></th>
                      <td className="px-4 py-3">A role that duplicates an element&apos;s implicit one (<code>&lt;button role=&quot;button&quot;&gt;</code>).</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium"><code>a11y_role_has_required_aria_props</code></th>
                      <td className="px-4 py-3">A <code>role</code> that is missing the ARIA properties it requires.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Treat every <code>a11y_</code> warning as a bug to fix, not noise
                to hide. Svelte lets you suppress a single line with a comment,
                but that comment is a promise that you have checked the case and
                it is genuinely a false positive:
              </p>
              <pre className="rounded-lg bg-slate-900 text-slate-100 text-sm p-4 overflow-x-auto"><code>{`<!-- Only after you have verified this specific case is safe.
     A suppressed warning is an accessibility defect you keep on purpose. -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div role="presentation" on:click={dismiss}>...</div>`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Run <code>svelte-check</code> in CI so these warnings fail the
                build instead of scrolling past in a log. The compiler only sees
                static markup, though — it cannot know whether your dialog traps
                focus or your toast is announced, which is what the rest of this
                guide covers. Every role and state the warnings mention is
                documented in our{" "}
                <Link href="/reference/aria" className="text-blue-600 dark:text-blue-400 hover:underline">
                  ARIA roles &amp; attributes reference
                </Link>
                .
              </p>
            </div>
          </section>

          {/* 3. Reactive ARIA */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Braces className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                3. Bind ARIA Reactively with Runes
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Svelte sets ARIA attributes with an ordinary curly-brace
                expression in markup, and it stringifies booleans for you —{" "}
                <code>aria-expanded=&#123;isOpen&#125;</code> renders{" "}
                <code>aria-expanded=&quot;true&quot;</code> or{" "}
                <code>&quot;false&quot;</code>. The rule that trips teams up is
                what Svelte does with <em>empty</em> values: when an expression is{" "}
                <code>null</code> or <code>undefined</code>, Svelte omits the
                attribute entirely. In Svelte 5 you drive these from runes.
              </p>
              <pre className="rounded-lg bg-slate-900 text-slate-100 text-sm p-4 overflow-x-auto"><code>{`<script lang="ts">
  let isOpen = $state(false)
  let email = $state("")
  // $derived recomputes whenever email changes
  let hasError = $derived(email.length > 0 && !email.includes("@"))
</script>

<!-- Boolean state: renders aria-expanded="true" / "false" -->
<button aria-expanded={isOpen} aria-controls="panel" on:click={() => (isOpen = !isOpen)}>
  Menu
</button>

<!-- Conditional attribute: present only when there is an error,
     omitted entirely when the expression is undefined -->
<input
  aria-invalid={hasError || undefined}
  aria-describedby={hasError ? "email-error" : undefined}
/>

<!-- Token attributes: bind the token, not a bare boolean -->
<a aria-current={isActive ? "page" : undefined} {href}>Home</a>`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Bind <code>undefined</code> (or <code>null</code>) when you want
                an attribute to disappear — binding <code>false</code> renders the
                literal string <code>aria-invalid=&quot;false&quot;</code>, which
                is correct for a true/false ARIA state but wrong for attributes
                like <code>aria-describedby</code> that should simply be absent.
                For token attributes such as <code>aria-current</code>, bind the
                token (<code>&quot;page&quot;</code>) rather than a boolean so
                screen readers announce the right thing. <code>$derived</code>{" "}
                keeps computed ARIA state in sync without a manual watcher.
              </p>
            </div>
          </section>

          {/* 4. use: actions — the marquee Svelte pattern */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Puzzle className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                4. Package Focus Behavior as a <code>use:</code> Action
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                A Svelte <strong className="text-slate-900 dark:text-white">action</strong>{" "}
                is a function you attach to an element with <code>use:name</code>.
                Svelte calls it with the real DOM node when the element mounts and
                runs the <code>destroy()</code> you return when it unmounts. That
                lifecycle makes actions the idiomatic Svelte home for
                accessibility behavior that needs a live element — a focus trap,
                click-outside-to-close, or moving focus on open. You write the
                logic once and reuse it with a single attribute.
              </p>
              <pre className="rounded-lg bg-slate-900 text-slate-100 text-sm p-4 overflow-x-auto"><code>{`// actions/trapFocus.ts — a reusable focus trap
export function trapFocus(node: HTMLElement) {
  const previouslyFocused = document.activeElement as HTMLElement | null

  const selector =
    'a[href], button:not([disabled]), input:not([disabled]), ' +
    'select, textarea, [tabindex]:not([tabindex="-1"])'
  const focusable = () =>
    Array.from(node.querySelectorAll<HTMLElement>(selector))

  // Move focus into the dialog when it opens
  focusable()[0]?.focus()

  function onKeydown(e: KeyboardEvent) {
    if (e.key !== "Tab") return
    const items = focusable()
    const first = items[0]
    const last = items[items.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      last.focus()
      e.preventDefault()
    } else if (!e.shiftKey && document.activeElement === last) {
      first.focus()
      e.preventDefault()
    }
  }

  node.addEventListener("keydown", onKeydown)

  return {
    destroy() {
      node.removeEventListener("keydown", onKeydown)
      previouslyFocused?.focus() // restore focus to what opened the dialog
    },
  }
}`}</code></pre>
              <pre className="rounded-lg bg-slate-900 text-slate-100 text-sm p-4 overflow-x-auto mt-3"><code>{`<script lang="ts">
  import { trapFocus } from "./actions/trapFocus"
  let open = $state(false)
</script>

<button type="button" on:click={() => (open = true)}>Delete project</button>

{#if open}
  <div class="backdrop" on:click={() => (open = false)}></div>
  <div
    role="dialog"
    aria-modal="true"
    aria-labelledby="dialog-title"
    use:trapFocus
    on:keydown={(e) => e.key === "Escape" && (open = false)}
  >
    <h2 id="dialog-title">Delete this project?</h2>
    <p>This action cannot be undone.</p>
    <button type="button" on:click={() => (open = false)}>Cancel</button>
    <button type="button" on:click={confirm}>Delete</button>
  </div>
{/if}`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Because the action&apos;s <code>destroy()</code> runs the moment
                the <code>&#123;#if&#125;</code> removes the dialog, focus
                restoration is automatic — no lifecycle bookkeeping in the
                component. You still supply <code>role=&quot;dialog&quot;</code>,{" "}
                <code>aria-modal=&quot;true&quot;</code>, an accessible name via{" "}
                <code>aria-labelledby</code>, and Escape-to-close. For production
                dialogs, headless libraries such as{" "}
                <a
                  href="https://bits-ui.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Bits UI
                </a>{" "}
                and Melt UI ship a fully accessible <code>Dialog</code> so you
                rarely hand-roll one. See the{" "}
                <Link href="/learn/modals" className="text-blue-600 dark:text-blue-400 hover:underline">
                  accessible modal pattern
                </Link>{" "}
                for the full interaction spec and the{" "}
                <Link href="/guides/focus-management" className="text-blue-600 dark:text-blue-400 hover:underline">
                  focus management guide
                </Link>{" "}
                for traps and restoration in depth.
              </p>
            </div>
          </section>

          {/* 5. SvelteKit routing */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Route className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                5. SvelteKit Route Announcements &amp; Focus
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Here SvelteKit does more for you than most SPA routers. After
                each client-side navigation it{" "}
                <strong className="text-slate-900 dark:text-white">
                  announces the new page
                </strong>{" "}
                in a visually hidden live region that reads the page&apos;s
                document title, and it{" "}
                <strong className="text-slate-900 dark:text-white">
                  resets focus to <code>&lt;body&gt;</code>
                </strong>{" "}
                so keyboard and screen reader users start from the top of the new
                page (unless an element has <code>autofocus</code>). Two things
                follow from that.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                First, because the announcement reads the title,{" "}
                <strong className="text-slate-900 dark:text-white">
                  every route needs a unique, descriptive title
                </strong>
                . A blank or duplicated title makes the announcement useless.
                Set it per page with <code>&lt;svelte:head&gt;</code>:
              </p>
              <pre className="rounded-lg bg-slate-900 text-slate-100 text-sm p-4 overflow-x-auto"><code>{`<!-- src/routes/pricing/+page.svelte -->
<svelte:head>
  <title>Pricing — Acme</title>
  <meta name="description" content="Simple, transparent pricing." />
</svelte:head>`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mb-4 mt-4">
                Second, focus landing on <code>&lt;body&gt;</code> is safe but
                blunt. To move it somewhere more useful — the{" "}
                <code>&lt;main&gt;</code> region or the new{" "}
                <code>&lt;h1&gt;</code> — customize it with{" "}
                <code>afterNavigate</code> from <code>$app/navigation</code> in
                your root layout, and pair it with a skip link:
              </p>
              <pre className="rounded-lg bg-slate-900 text-slate-100 text-sm p-4 overflow-x-auto"><code>{`<!-- src/routes/+layout.svelte -->
<script lang="ts">
  import { afterNavigate } from "$app/navigation"

  afterNavigate(() => {
    const main = document.getElementById("main")
    main?.focus()
  })
</script>

<a class="skip-link" href="#main">Skip to main content</a>
<nav aria-label="Primary"><!-- ... --></nav>

<main id="main" tabindex="-1">
  <slot />
</main>`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-4">
                <code>tabindex=&quot;-1&quot;</code> lets{" "}
                <code>&lt;main&gt;</code> receive programmatic focus without
                adding it to the Tab order. This supports{" "}
                <Link href="/wcag/2-4-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                  2.4.3 Focus Order
                </Link>{" "}
                and depends on a working{" "}
                <Link href="/guides/keyboard-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">
                  skip link
                </Link>
                . Because SvelteKit already handles the announcement, resist
                adding a second one for navigation — you would double-announce
                every page change.
              </p>
            </div>
          </section>

          {/* 6. Live regions: the {#if} trap */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Radio className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                6. Announce Dynamic Content (and the <code>&#123;#if&#125;</code> Trap)
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Reactivity updates the DOM silently. When search results load, a
                toast appears, or a form saves, a sighted user sees it instantly —
                a screen reader user hears nothing unless the change happens
                inside an <code>aria-live</code> region. The catch is the same one
                every framework hits: a screen reader only announces a live region
                that already existed in the DOM <em>before</em> its content
                changed. Mount that region with <code>&#123;#if&#125;</code> at
                the moment the message appears and nothing is announced.
              </p>
              <pre className="rounded-lg bg-slate-900 text-slate-100 text-sm p-4 overflow-x-auto"><code>{`<!-- Broken: the region is created at the same moment as its text,
     so the browser treats it as initial content, not an update -->
{#if message}
  <p aria-live="polite">{message}</p>
{/if}

<!-- Correct: the region is always in the DOM; only its text changes -->
<p aria-live="polite" class="sr-only">{message}</p>`}</code></pre>
              <pre className="rounded-lg bg-slate-900 text-slate-100 text-sm p-4 overflow-x-auto mt-3"><code>{`// lib/announcer.svelte.ts — one persistent region for the whole app
export const announcer = $state({ message: "" })

export function announce(text: string) {
  announcer.message = ""              // reset so identical messages re-announce
  requestAnimationFrame(() => {
    announcer.message = text
  })
}`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Render one always-mounted, visually hidden region near the root of
                your layout (
                <code>&lt;p aria-live=&quot;polite&quot; class=&quot;sr-only&quot;&gt;&#123;announcer.message&#125;&lt;/p&gt;</code>
                ) and call <code>announce()</code> from anywhere. Resetting the
                text before setting it again forces a re-announcement even when
                the new message is identical to the last. Reserve{" "}
                <code>aria-live=&quot;assertive&quot;</code> for urgent,
                interrupting messages such as a session-timeout warning. This
                satisfies{" "}
                <Link href="/wcag/4-1-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                  4.1.3 Status Messages
                </Link>
                .
              </p>
            </div>
          </section>

          {/* Svelte a11y toolkit callout */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <Card className="border-blue-200 dark:border-blue-800">
                <CardHeader className="flex flex-row items-start gap-3 pb-3">
                  <div className="rounded-lg bg-blue-100 dark:bg-blue-900/30 p-2">
                    <Boxes className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <CardTitle className="text-lg">
                    The Svelte accessibility toolkit
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                    Svelte does the first layer itself in the compiler; a small,
                    well-supported ecosystem covers the rest:
                  </p>
                  <ul className="text-sm text-muted-foreground leading-relaxed list-disc pl-5 space-y-2">
                    <li>
                      <strong>The Svelte compiler</strong> — built-in{" "}
                      <code>a11y_*</code> warnings, no configuration required.
                    </li>
                    <li>
                      <code>svelte-check</code> — runs the compiler diagnostics
                      (including a11y warnings) in CI so they fail the build.
                    </li>
                    <li>
                      <code>eslint-plugin-svelte</code> — adds further static lint
                      rules on top of the compiler.
                    </li>
                    <li>
                      <strong>Bits UI</strong> / <strong>Melt UI</strong> —
                      unstyled, accessible dialog, menu, combobox, tabs, and
                      listbox primitives with keyboard and ARIA built in.
                    </li>
                    <li>
                      <code>@testing-library/svelte</code> +{" "}
                      <code>vitest-axe</code> — component tests that assert against
                      the accessibility tree.
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* 7. Accessible forms */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <AlertCircle className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                7. Accessible Forms with <code>bind:value</code>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                <code>bind:value</code> handles the data binding, but says nothing
                about accessibility. Associate every input with a{" "}
                <code>&lt;label&gt;</code> (the compiler&apos;s{" "}
                <code>a11y_label_has_associated_control</code> warning enforces
                this), then link the error message with{" "}
                <code>aria-describedby</code> and mark the field with{" "}
                <code>aria-invalid</code> — binding <code>undefined</code> so the
                attributes disappear when the field is valid.
              </p>
              <pre className="rounded-lg bg-slate-900 text-slate-100 text-sm p-4 overflow-x-auto"><code>{`<script lang="ts">
  let email = $state("")
  let touched = $state(false)
  let invalid = $derived(touched && !/^[^@]+@[^@]+\\.[^@]+$/.test(email))
</script>

<form on:submit|preventDefault={submit}>
  <label for="email">Email</label>
  <input
    id="email"
    type="email"
    bind:value={email}
    on:blur={() => (touched = true)}
    aria-invalid={invalid || undefined}
    aria-describedby={invalid ? "email-error" : undefined}
  />
  {#if invalid}
    <p id="email-error" class="error">Enter a valid email address.</p>
  {/if}

  <button type="submit">Create account</button>
</form>`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Never rely on a placeholder as the label — it disappears on input
                and usually fails contrast. Only surface{" "}
                <code>aria-invalid</code> and <code>aria-describedby</code> once
                the user has touched the field (here, on <code>blur</code>), so
                assistive tech is not told about an error before it is shown. The
                error text sits inside a <code>&#123;#if&#125;</code> — that is
                fine, because <code>aria-describedby</code> resolves the id when it
                exists; it is only <em>live regions</em> that must stay mounted.
                For labels, <code>&lt;fieldset&gt;</code> grouping, validation
                timing, and error summaries, see the{" "}
                <Link href="/guides/accessible-forms" className="text-blue-600 dark:text-blue-400 hover:underline">
                  accessible forms guide
                </Link>{" "}
                and the{" "}
                <Link href="/guides/accessible-form-validation" className="text-blue-600 dark:text-blue-400 hover:underline">
                  form validation &amp; error handling guide
                </Link>
                .
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
                    <CardTitle className="text-lg">Keyboard Rules for Svelte</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm text-muted-foreground leading-relaxed list-disc pl-5 space-y-2">
                      <li>Interactive = real <code>&lt;button&gt;</code> or <code>&lt;a&gt;</code>, never an <code>on:click</code> div.</li>
                      <li>Refine focus on navigation with <code>afterNavigate</code>; move it on overlay open/close.</li>
                      <li>Trap focus in dialogs with a <code>use:trapFocus</code> action; restore it on close.</li>
                      <li>Keep a visible focus outline (<Link href="/wcag/2-4-7" className="text-blue-600 dark:text-blue-400 hover:underline">2.4.7</Link>).</li>
                      <li>Roving <code>tabindex</code> for arrow-key widgets (tabs, menus, listboxes).</li>
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
                      <li>Give every route a unique <code>&lt;svelte:head&gt;&lt;title&gt;</code> — SvelteKit announces it.</li>
                      <li>Announce async updates via an always-mounted live region.</li>
                      <li>Every control has an accessible name (label or <code>aria-label</code>).</li>
                      <li>Icon-only buttons need a name; decorative icons get <code>aria-hidden=&quot;true&quot;</code>.</li>
                      <li>Images use meaningful <code>alt</code>, or <code>alt=&quot;&quot;</code> if decorative.</li>
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
                8. Testing &amp; Tooling
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Automated checks catch a meaningful share of issues and stop
                regressions — but they find roughly a third to a half of WCAG
                problems, so they supplement rather than replace manual testing.
                Svelte gives you an extra automated layer for free in the
                compiler; layer these into your workflow:
              </p>
              <pre className="rounded-lg bg-slate-900 text-slate-100 text-sm p-4 overflow-x-auto"><code>{`# 1. The compiler + svelte-check — a11y warnings fail the build
svelte-check --fail-on-warnings

# 2. Lint on top of the compiler — eslint-plugin-svelte
#    In eslint.config.js, extend the svelte recommended config.`}</code></pre>
              <pre className="rounded-lg bg-slate-900 text-slate-100 text-sm p-4 overflow-x-auto mt-3"><code>{`// 3. Component tests: @testing-library/svelte + vitest-axe
import { render } from "@testing-library/svelte"
import { axe } from "vitest-axe"
import TextField from "./TextField.svelte"

it("TextField has no axe violations", async () => {
  const { container } = render(TextField, { props: { label: "Email", id: "email" } })
  expect(await axe(container)).toHaveNoViolations()
})

// 4. End-to-end: axe-core in Playwright against real routes
import AxeBuilder from "@axe-core/playwright"

test("home page is accessible", async ({ page }) => {
  await page.goto("/")
  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations).toEqual([])
})`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Svelte Testing Library nudges you toward accessible queries —{" "}
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
                Common Svelte Mistakes &amp; How to Fix Them
              </h2>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    Common Svelte accessibility anti-patterns, why they fail, and
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
                          <code>{row.bad}</code>
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
                Svelte Accessibility Checklist
              </h2>
              <ol className="space-y-4 text-muted-foreground leading-relaxed list-decimal pl-6">
                <li>
                  <strong className="text-slate-900 dark:text-white">Zero a11y warnings.</strong>{" "}
                  The build has no unresolved <code>a11y_*</code> warnings;{" "}
                  <code>svelte-check</code> runs in CI and any{" "}
                  <code>svelte-ignore</code> is documented.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Semantic markup.</strong>{" "}
                  Every clickable thing is a <code>&lt;button&gt;</code> or{" "}
                  <code>&lt;a href&gt;</code>; headings ordered; one{" "}
                  <code>&lt;h1&gt;</code> per page.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Reactive ARIA.</strong>{" "}
                  Dynamic ARIA uses <code>&#123;expression&#125;</code> bindings
                  and <code>undefined</code> to remove attributes when off.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Focus behavior.</strong>{" "}
                  Traps and restoration are packaged as <code>use:</code> actions;
                  overlays move focus in and back out.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Route titles &amp; focus.</strong>{" "}
                  Every route sets a unique <code>&lt;svelte:head&gt;&lt;title&gt;</code>;{" "}
                  <code>afterNavigate</code> refines focus; a skip link exists.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Live regions.</strong>{" "}
                  Async results and errors announce from an always-mounted{" "}
                  <code>aria-live</code> region (not <code>&#123;#if&#125;</code>).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Forms.</strong>{" "}
                  Labels associated; errors linked with{" "}
                  <code>aria-describedby</code> and <code>aria-invalid</code>.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Automated + manual.</strong>{" "}
                  Compiler + eslint-plugin-svelte + vitest-axe in CI, plus a
                  keyboard and screen reader pass.
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
                  Audit Your Svelte App in Seconds
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6 max-w-lg mx-auto">
                  Run any deployed Svelte or SvelteKit page through our free
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
                content="svelte accessibility sveltekit template markup aria reactive binding runes $state $derived compile-time a11y warnings svelte-check use action focus trap trapfocus afterNavigate route announcements focus management live region {#if} accessible forms bind:value keyboard screen reader wcag 4.1.2 2.4.3 4.1.3 eslint-plugin-svelte vitest-axe react vue angular accessibility"
                title="Related Guides & Tools"
                maxItems={6}
                showDescriptions={true}
                excludeUrl="/guides/svelte-accessibility"
              />
            </div>
          </section>
        </article>
      </div>
    </>
  )
}
