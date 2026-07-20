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
  AppWindow,
  Keyboard,
  ShieldCheck,
  ListChecks,
  Bug,
  Layers,
  MoveHorizontal,
  ToggleRight,
  Code2,
  Ear,
  AlertTriangle,
} from "lucide-react"

const pageTitle = "Accessible Tabs: The WAI-ARIA Tabs Pattern Guide"
const pageDescription =
  "Build accessible tabs the right way: the tablist, tab, and tabpanel roles, aria-selected and aria-controls, roving tabindex, arrow-key navigation, automatic vs manual activation, vertical tabs, and copy-ready HTML, JavaScript, and React — mapped to WCAG 2.2 with a testing workflow, common mistakes, and FAQs."

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords: [
    "accessible tabs",
    "aria tabs",
    "tabs pattern",
    "wai-aria tabs",
    "tablist",
    "tabpanel",
    "role tab",
    "aria-selected",
    "aria-controls",
    "tabs keyboard navigation",
    "accessible tab component",
    "roving tabindex tabs",
    "tabs arrow keys",
    "manual vs automatic activation",
    "vertical tabs accessibility",
    "react accessible tabs",
    "wcag tabs",
    "tab component accessibility",
  ],
  alternates: {
    canonical: "/guides/accessible-tabs",
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: "/guides/accessible-tabs",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: `/api/og?title=${encodeURIComponent("Accessible Tabs Guide")}&section=Guide`,
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
        url: `/api/og?title=${encodeURIComponent("Accessible Tabs Guide")}&section=Guide`,
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
    name: "Accessible Tabs Guide",
    url: "https://accessibility.build/guides/accessible-tabs",
  },
]

const faqs = [
  {
    question: "What ARIA roles do accessible tabs need?",
    answer:
      "An accessible tab set uses exactly three roles that work together. The container that holds the clickable tabs has role=\"tablist\". Each individual tab has role=\"tab\", and each content region has role=\"tabpanel\". These roles tell a screen reader \"this is a tab set,\" so it can announce \"tab, 2 of 4, selected\" and expose the correct keyboard model. On top of the roles you need the relationships and state: each tab points at its panel with aria-controls, each panel points back at its tab with aria-labelledby, the active tab carries aria-selected=\"true\" (and the rest aria-selected=\"false\"), and inactive panels are hidden. Roles without those states are only half the pattern — the screen reader would announce a tab but never say which one is selected.",
  },
  {
    question: "How should keyboard navigation work in a tab set?",
    answer:
      "The tab list is a single Tab stop. You press Tab once to move focus onto the active tab, then use the Arrow keys — Left/Right for horizontal tabs, Up/Down for vertical — to move between tabs. Home jumps to the first tab and End to the last. Pressing Tab again moves focus out of the tab list and into the active tab panel. This is the roving tabindex model: only one tab is in the Tab sequence at a time (tabindex=\"0\"), and the others are removed from it (tabindex=\"-1\") but reachable with the Arrow keys. The most common bug is making every tab tabbable, which forces keyboard users to press Tab through all of them and breaks the expected Arrow-key behavior.",
  },
  {
    question: "What is the difference between automatic and manual tab activation?",
    answer:
      "With automatic activation, a tab is selected the moment it receives focus — pressing the Arrow key both moves focus and shows the associated panel. With manual activation, the Arrow keys only move focus; the user then presses Enter or Space to actually select the tab and reveal its panel. The rule from the ARIA Authoring Practices Guide is about cost: use automatic activation when showing a panel is instant and has no side effects, because it is faster for everyone. Use manual activation when selecting a tab is expensive — it loads data over the network, moves focus, or would be disruptive to trigger on every arrow press. Both are conformant; the choice is a UX decision, not an accessibility one.",
  },
  {
    question: "Should the tab panel be focusable with tabindex=\"0\"?",
    answer:
      "It depends on what the panel contains. If a panel holds its own focusable content — links, form fields, buttons — you do not need to make the panel itself focusable; the user simply Tabs from the tab list into that content. If a panel is static text with nothing focusable inside, add tabindex=\"0\" to the panel so keyboard users can move focus into it, read it, and scroll it. Without that, a keyboard user pressing Tab would skip straight past the panel to the next control on the page, and someone relying on a screen reader's Tab key could miss the panel content. When in doubt, adding tabindex=\"0\" to the panel is the safe default recommended by the APG.",
  },
  {
    question: "Are tabs the same as in-page navigation links or an accordion?",
    answer:
      "No, and confusing them is a frequent mistake. The tabs pattern is for switching between panels of related content that live on the same page and share a heading area — like \"Description / Reviews / Shipping\" on a product page. If your \"tabs\" actually navigate to different URLs, they are navigation and should be a <nav> with real links, not role=\"tab\"; using the tab roles there misrepresents them to screen readers. An accordion is the better choice when content should be able to expand independently, when several sections may be open at once, or on narrow screens where a horizontal tab strip does not fit. Reach for tabs only when exactly one panel is visible at a time and the sections are peers.",
  },
  {
    question: "How do I make tabs accessible in React?",
    answer:
      "The roles, states, and keyboard model are identical to plain HTML — React just manages them with state. Track the active index in state, render role=\"tablist\"/\"tab\"/\"tabpanel\", set aria-selected and tabindex from whether each tab is active, generate stable ids with the useId hook to wire aria-controls and aria-labelledby, and handle onKeyDown for the Arrow, Home, and End keys, calling .focus() on the newly active tab via refs. The most reliable path in production is to use a headless, WAI-ARIA-tested library — Radix UI Tabs, React Aria Tabs, Headless UI, or Reach — which implements the full keyboard model and roving tabindex for you. Our React accessibility guide covers the ref and useId patterns you need if you build it by hand.",
  },
]

const attributeRows = [
  {
    element: "Tab list container",
    role: "role=\"tablist\"",
    attrs: "aria-label or aria-labelledby (name the set); optional aria-orientation=\"vertical\"",
  },
  {
    element: "Each tab",
    role: "role=\"tab\"",
    attrs: "id, aria-selected=\"true|false\", aria-controls=\"<panel-id>\", tabindex=\"0\" if selected else tabindex=\"-1\"",
  },
  {
    element: "Each tab panel",
    role: "role=\"tabpanel\"",
    attrs: "id, aria-labelledby=\"<tab-id>\", tabindex=\"0\" when it has no focusable content; hidden when inactive",
  },
]

const keyboardRows = [
  {
    key: "Tab",
    action:
      "Moves focus into the tab list onto the active tab; pressing it again moves focus out of the list to the active panel or next control.",
  },
  {
    key: "Right Arrow / Left Arrow",
    action:
      "In a horizontal tab list, moves focus to the next / previous tab, wrapping from last to first and back.",
  },
  {
    key: "Down Arrow / Up Arrow",
    action:
      "In a vertical tab list (aria-orientation=\"vertical\"), moves focus to the next / previous tab, wrapping.",
  },
  {
    key: "Home",
    action: "Moves focus to the first tab in the list.",
  },
  {
    key: "End",
    action: "Moves focus to the last tab in the list.",
  },
  {
    key: "Enter or Space",
    action:
      "Activates the focused tab (required only for manual activation; automatic activation selects on focus).",
  },
]

const antiPatterns = [
  {
    bad: "Using <div>s with click handlers and no roles.",
    why: "A screen reader announces nothing — no tab, no count, no selected state (4.1.2).",
    fix: "Add role=\"tablist\"/\"tab\"/\"tabpanel\" with aria-selected and aria-controls.",
  },
  {
    bad: "Every tab is in the Tab order (all tabindex=\"0\").",
    why: "Keyboard users must Tab through every tab; Arrow keys do nothing (2.1.1, 2.4.3).",
    fix: "Roving tabindex: only the selected tab is 0, the rest are -1; wire Arrow keys.",
  },
  {
    bad: "aria-selected never changes when the tab switches.",
    why: "The screen reader keeps announcing the wrong tab as selected (4.1.2).",
    fix: "Set aria-selected=\"true\" on the active tab and \"false\" on all others on every change.",
  },
  {
    bad: "Inactive panels are hidden with CSS opacity or off-screen only.",
    why: "They stay in the accessibility tree, so screen reader users hear all panels at once.",
    fix: "Add the hidden attribute (or display:none) to inactive panels so they leave the tree.",
  },
  {
    bad: "Tabs that actually change the URL / navigate.",
    why: "role=\"tab\" misrepresents links as tabs; breaks Back button and SR expectations.",
    fix: "Use a <nav> with real <a href> links, not the tabs pattern.",
  },
  {
    bad: "No aria-controls / aria-labelledby linking tab and panel.",
    why: "The relationship is lost; users can't tell which panel belongs to which tab (1.3.1).",
    fix: "Point each tab at its panel with aria-controls and each panel back with aria-labelledby.",
  },
]

export default function AccessibleTabsGuidePage() {
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
                    Accessible Tabs
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
                Accessible Tabs: The WAI-ARIA Tabs Pattern Guide
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Tabs are one of the most-copied and most-broken UI patterns on the
                web. This guide walks through the <code>tablist</code>,{" "}
                <code>tab</code>, and <code>tabpanel</code> roles, the roving{" "}
                <code>tabindex</code> keyboard model, automatic vs manual
                activation, and vertical tabs — with copy-ready HTML, JavaScript,
                and React mapped to WCAG 2.2.
              </p>
            </div>
          </section>

          {/* What & why */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                Why the Tabs Pattern Is So Easy to Get Wrong
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  A tab set looks trivial: a row of buttons, one panel visible at a
                  time. But native HTML has no <code>&lt;tabs&gt;</code> element, so
                  every tab component is a custom widget assembled from{" "}
                  <code>&lt;div&gt;</code>s, ARIA roles, and JavaScript. Miss any
                  one piece and the pattern silently degrades: a screen reader
                  announces four unlabeled buttons instead of &ldquo;tab, 1 of
                  4, selected,&rdquo; or a keyboard user has to press Tab through
                  every tab because the Arrow keys do nothing.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The good news is that the pattern is fully specified. The{" "}
                  <a
                    href="https://www.w3.org/WAI/ARIA/apg/patterns/tabs/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    WAI-ARIA Authoring Practices Tabs pattern
                  </a>{" "}
                  defines exactly which roles, states, and key bindings a
                  conformant tab set needs. This guide turns that specification into
                  working code you can paste in, and ties every requirement back to
                  the WCAG success criterion it satisfies.
                </p>
                <div className="rounded-lg border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 p-5 my-6">
                  <p className="text-sm text-slate-800 dark:text-amber-100 leading-relaxed flex gap-3">
                    <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
                    <span>
                      <strong>Use tabs only for same-page panels.</strong> If your
                      &ldquo;tabs&rdquo; navigate to different URLs, they are
                      navigation — use a <code>&lt;nav&gt;</code> with real{" "}
                      <code>&lt;a href&gt;</code> links, not{" "}
                      <code>role=&quot;tab&quot;</code>. If sections should expand
                      independently or several be open at once, use an accordion.
                      Tabs are for switching between peer panels where exactly one
                      is visible at a time.
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
                The WCAG 2.2 Criteria Accessible Tabs Satisfy
              </h2>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    WCAG 2.2 success criteria that a correctly built tab set
                    satisfies and what each requires
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
                        What the tabs pattern must do
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
                      <td className="px-4 py-3">Tab and panel are programmatically linked (aria-controls / aria-labelledby).</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-1-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.1.1 Keyboard
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Every tab is reachable and operable with Arrow, Home, End, and Enter/Space.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-4-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.4.3 Focus Order
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">The tab list is a single Tab stop; focus flows logically to the panel.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-4-7" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.4.7 Focus Visible
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">The focused tab shows a clear, visible focus indicator.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/3-2-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          3.2.1 On Focus
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">With manual activation, focusing a tab does not itself change context.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/4-1-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                          4.1.2 Name, Role, Value
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Correct tab/tablist/tabpanel roles and the aria-selected state are exposed.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-muted-foreground leading-relaxed mt-4 text-sm">
                See the full picture in the{" "}
                <Link href="/guides/wcag-2-2-aa-requirements" className="text-blue-600 dark:text-blue-400 hover:underline">
                  WCAG 2.2 Level AA requirements
                </Link>{" "}
                and work through the interactive{" "}
                <Link href="/checklists/wcag-2-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                  WCAG 2.2 checklist
                </Link>
                .
              </p>
            </div>
          </section>

          {/* 1. The three roles */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Layers className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                1. The Three Roles: tablist, tab &amp; tabpanel
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                An accessible tab set is built from three ARIA roles plus the states
                and relationships that connect them. Get this table right and the
                rest is keyboard behavior. Each tab points at the panel it controls
                with <code>aria-controls</code>; each panel points back at its tab
                with <code>aria-labelledby</code> so the panel inherits the tab&apos;s
                label.
              </p>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    The three roles in the tabs pattern and the ARIA attributes each
                    element needs
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
                        <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top whitespace-nowrap">
                          {row.element}
                        </th>
                        <td className="px-4 py-3 align-top font-mono text-xs">{row.role}</td>
                        <td className="px-4 py-3 align-top">{row.attrs}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Prefer a real <code>&lt;button&gt;</code> for each tab rather than a{" "}
                <code>&lt;div&gt;</code> with <code>role=&quot;tab&quot;</code>. A
                button is already keyboard operable and announced as interactive, so
                you inherit correct behavior and only layer the tab semantics on top.
                For the underlying meaning of each role and state, see the{" "}
                <Link href="/reference/aria" className="text-blue-600 dark:text-blue-400 hover:underline">
                  ARIA roles &amp; attributes reference
                </Link>
                .
              </p>
            </div>
          </section>

          {/* 2. Complete markup */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Code2 className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                2. The Complete Accessible Markup
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Here is a full, conformant tab set in plain HTML. Note the roving{" "}
                <code>tabindex</code> (only the selected tab is <code>0</code>), the{" "}
                <code>hidden</code> attribute on inactive panels, and the paired{" "}
                <code>aria-controls</code> / <code>aria-labelledby</code> ids.
              </p>
              <pre className="rounded-lg bg-slate-900 text-slate-100 text-sm p-4 overflow-x-auto"><code>{`<!-- Name the whole set for screen readers -->
<div class="tabs">
  <div role="tablist" aria-label="Account settings">
    <button role="tab" id="tab-profile"
            aria-selected="true"  aria-controls="panel-profile"
            tabindex="0">
      Profile
    </button>
    <button role="tab" id="tab-billing"
            aria-selected="false" aria-controls="panel-billing"
            tabindex="-1">
      Billing
    </button>
    <button role="tab" id="tab-security"
            aria-selected="false" aria-controls="panel-security"
            tabindex="-1">
      Security
    </button>
  </div>

  <!-- Static-content panels get tabindex="0" so they are focusable -->
  <div role="tabpanel" id="panel-profile"
       aria-labelledby="tab-profile" tabindex="0">
    <h3>Profile</h3>
    <p>Your public profile information.</p>
  </div>
  <div role="tabpanel" id="panel-billing"
       aria-labelledby="tab-billing" tabindex="0" hidden>
    <h3>Billing</h3>
    <p>Manage your subscription and invoices.</p>
  </div>
  <div role="tabpanel" id="panel-security"
       aria-labelledby="tab-security" tabindex="0" hidden>
    <h3>Security</h3>
    <p>Password and two-factor settings.</p>
  </div>
</div>`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Two details do a lot of work here. First,{" "}
                <code>aria-label</code> on the <code>tablist</code> names the set so
                a screen reader can say &ldquo;Account settings, tab list.&rdquo;
                Second, the <code>hidden</code> attribute — not just CSS opacity —
                removes inactive panels from the accessibility tree so users never
                hear all three panels stacked together. Hide inactive panels
                deliberately; see the{" "}
                <Link href="/guides/focus-management" className="text-blue-600 dark:text-blue-400 hover:underline">
                  focus management guide
                </Link>{" "}
                for why visibility and the accessibility tree must stay in sync.
              </p>
            </div>
          </section>

          {/* 3. Keyboard model */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Keyboard className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                3. The Keyboard Interaction Model
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                This is where most tab components fail. A tab list must be a{" "}
                <strong className="text-slate-900 dark:text-white">single Tab
                stop</strong>: you Tab onto the active tab, then the Arrow keys move
                between tabs, and Tab again leaves the list. That is the roving{" "}
                <code>tabindex</code> technique — exactly one tab is{" "}
                <code>tabindex=&quot;0&quot;</code> and the rest are{" "}
                <code>tabindex=&quot;-1&quot;</code>.
              </p>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    Keyboard keys and the action each performs in the tabs pattern
                  </caption>
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold whitespace-nowrap">Key</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-muted-foreground">
                    {keyboardRows.map((row, i) => (
                      <tr key={i}>
                        <th scope="row" className="px-4 py-3 font-medium text-slate-900 dark:text-white align-top whitespace-nowrap font-mono text-xs">
                          {row.key}
                        </th>
                        <td className="px-4 py-3 align-top">{row.action}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Wrapping is recommended but optional: Right Arrow on the last tab
                may move to the first, and Left Arrow on the first may move to the
                last. The single-Tab-stop rule is not optional — it is what makes a
                tab set feel native and satisfies{" "}
                <Link href="/wcag/2-4-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                  2.4.3 Focus Order
                </Link>
                . For the broader technique across menus and toolbars, see roving{" "}
                <code>tabindex</code> in the{" "}
                <Link href="/guides/keyboard-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">
                  keyboard accessibility guide
                </Link>
                .
              </p>
            </div>
          </section>

          {/* 4. Automatic vs manual activation */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <ToggleRight className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                4. Automatic vs Manual Activation
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                There are two conformant ways a tab becomes selected, and choosing
                between them is a UX decision, not an accessibility one. Both are
                allowed by the APG; the deciding question is how expensive it is to
                show a panel.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Card>
                  <CardHeader className="flex flex-row items-start gap-3 pb-3">
                    <div className="rounded-lg bg-green-100 dark:bg-green-900/30 p-2">
                      <MoveHorizontal className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <CardTitle className="text-lg">Automatic activation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                      The panel changes the instant a tab receives focus — one Arrow
                      press both moves focus and selects. Fastest for everyone.
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      <strong className="text-slate-900 dark:text-white">Use when</strong>{" "}
                      switching is instant and side-effect free — the panels are
                      already rendered in the DOM.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-start gap-3 pb-3">
                    <div className="rounded-lg bg-purple-100 dark:bg-purple-900/30 p-2">
                      <ToggleRight className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <CardTitle className="text-lg">Manual activation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                      Arrow keys move focus only; the user presses{" "}
                      <code>Enter</code> or <code>Space</code> to select and reveal
                      the panel.
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      <strong className="text-slate-900 dark:text-white">Use when</strong>{" "}
                      selecting a tab is expensive — it fetches data, moves focus,
                      or would be disruptive on every arrow press.
                    </p>
                  </CardContent>
                </Card>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Manual activation also keeps you safely inside{" "}
                <Link href="/wcag/3-2-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                  3.2.1 On Focus
                </Link>
                , because merely moving focus to a tab never triggers a change of
                context. When in doubt for a data-heavy interface, prefer manual.
              </p>
            </div>
          </section>

          {/* 5. Vanilla JS */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Code2 className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                5. Wiring It Up in Vanilla JavaScript
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                This handler implements the full keyboard model with roving{" "}
                <code>tabindex</code> and automatic activation. Swap to manual by
                only moving focus on Arrow keys and selecting on{" "}
                <code>Enter</code>/<code>Space</code>.
              </p>
              <pre className="rounded-lg bg-slate-900 text-slate-100 text-sm p-4 overflow-x-auto"><code>{`const tablist = document.querySelector('[role="tablist"]')
const tabs = [...tablist.querySelectorAll('[role="tab"]')]

function selectTab(newTab) {
  tabs.forEach((tab) => {
    const selected = tab === newTab
    tab.setAttribute("aria-selected", String(selected))
    tab.tabIndex = selected ? 0 : -1               // roving tabindex
    // Show the matching panel, hide the rest
    const panel = document.getElementById(tab.getAttribute("aria-controls"))
    panel.hidden = !selected
  })
}

tablist.addEventListener("keydown", (e) => {
  const current = tabs.indexOf(document.activeElement)
  if (current === -1) return
  let next = null

  switch (e.key) {
    case "ArrowRight": next = (current + 1) % tabs.length; break
    case "ArrowLeft":  next = (current - 1 + tabs.length) % tabs.length; break
    case "Home":       next = 0; break
    case "End":        next = tabs.length - 1; break
    default: return
  }
  e.preventDefault()
  tabs[next].focus()          // move DOM focus with the Arrow key
  selectTab(tabs[next])       // automatic activation — remove for manual
})

// Pointer users still click
tabs.forEach((tab) =>
  tab.addEventListener("click", () => { tab.focus(); selectTab(tab) })
)`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Notice that the same <code>selectTab()</code> function drives clicks,
                Arrow keys, Home, and End — one source of truth for{" "}
                <code>aria-selected</code>, <code>tabindex</code>, and panel
                visibility keeps the three from drifting out of sync, which is the
                usual cause of a screen reader announcing the wrong selected tab.
              </p>
            </div>
          </section>

          {/* 6. Vertical tabs */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <MoveHorizontal className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                6. Vertical Tabs &amp; aria-orientation
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                When a tab list is stacked vertically, tell assistive technology so
                it maps the Up/Down arrows to navigation instead of Left/Right. Add{" "}
                <code>aria-orientation=&quot;vertical&quot;</code> to the{" "}
                <code>tablist</code> and switch your key handler to{" "}
                <code>ArrowUp</code> / <code>ArrowDown</code>.
              </p>
              <pre className="rounded-lg bg-slate-900 text-slate-100 text-sm p-4 overflow-x-auto"><code>{`<div role="tablist"
     aria-label="Documentation sections"
     aria-orientation="vertical">
  <button role="tab" aria-selected="true"  tabindex="0"  ...>Getting started</button>
  <button role="tab" aria-selected="false" tabindex="-1" ...>API reference</button>
  <button role="tab" aria-selected="false" tabindex="-1" ...>Examples</button>
</div>

<!-- In the keydown handler, use ArrowUp / ArrowDown for vertical lists -->
case "ArrowDown": next = (current + 1) % tabs.length; break
case "ArrowUp":   next = (current - 1 + tabs.length) % tabs.length; break`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Horizontal is the default, so you only add{" "}
                <code>aria-orientation</code> for vertical lists. The visual
                orientation and the declared orientation must match — a vertical
                strip that still listens for Left/Right arrows will confuse anyone
                using a screen reader that announces the orientation.
              </p>
            </div>
          </section>

          {/* 7. React */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Code2 className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                7. Accessible Tabs in React
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The roles, states, and keyboard model are identical — React just
                derives them from state. Use the <code>useId</code> hook for stable{" "}
                <code>aria-controls</code> / <code>aria-labelledby</code> ids, and
                refs to move focus on Arrow keys.
              </p>
              <pre className="rounded-lg bg-slate-900 text-slate-100 text-sm p-4 overflow-x-auto"><code>{`function Tabs({ tabs }) {
  const [active, setActive] = React.useState(0)
  const uid = React.useId()
  const refs = React.useRef([])

  function onKeyDown(e) {
    const last = tabs.length - 1
    let next = null
    if (e.key === "ArrowRight") next = active === last ? 0 : active + 1
    else if (e.key === "ArrowLeft") next = active === 0 ? last : active - 1
    else if (e.key === "Home") next = 0
    else if (e.key === "End") next = last
    else return
    e.preventDefault()
    setActive(next)             // automatic activation
    refs.current[next]?.focus() // move focus with the arrow key
  }

  return (
    <div>
      <div role="tablist" aria-label="Settings" onKeyDown={onKeyDown}>
        {tabs.map((tab, i) => (
          <button
            key={i}
            ref={(el) => (refs.current[i] = el)}
            role="tab"
            id={\`\${uid}-tab-\${i}\`}
            aria-selected={active === i}
            aria-controls={\`\${uid}-panel-\${i}\`}
            tabIndex={active === i ? 0 : -1}
            onClick={() => setActive(i)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab, i) => (
        <div
          key={i}
          role="tabpanel"
          id={\`\${uid}-panel-\${i}\`}
          aria-labelledby={\`\${uid}-tab-\${i}\`}
          tabIndex={0}
          hidden={active !== i}
        >
          {tab.content}
        </div>
      ))}
    </div>
  )
}`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-4">
                In production, reach for a headless, WAI-ARIA-tested library —{" "}
                <strong className="text-slate-900 dark:text-white">Radix UI Tabs</strong>,{" "}
                <strong className="text-slate-900 dark:text-white">React Aria</strong>, or{" "}
                Headless UI — which ships the full keyboard model, roving{" "}
                <code>tabindex</code>, and orientation handling for you. The{" "}
                <Link href="/guides/react-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">
                  React accessibility guide
                </Link>{" "}
                covers the <code>useId</code> and ref patterns in depth, and the
                same approach applies in the{" "}
                <Link href="/guides/vue-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Vue
                </Link>{" "}
                and{" "}
                <Link href="/guides/angular-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Angular
                </Link>{" "}
                accessibility guides.
              </p>
            </div>
          </section>

          {/* Testing */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Bug className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                How to Test Accessible Tabs
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Automated scanners confirm the roles are present, but they cannot
                verify that the keyboard model works. Run this manual pass on every
                tab set:
              </p>
              <ol className="space-y-3 text-muted-foreground leading-relaxed list-decimal pl-6">
                <li>
                  <strong className="text-slate-900 dark:text-white">Tab into the list once.</strong>{" "}
                  Focus should land on the selected tab — not the first tab, and not
                  every tab in turn.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Press the Arrow keys.</strong>{" "}
                  Focus moves between tabs and (in automatic mode) the panel
                  switches; Home and End jump to the ends.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Press Tab again.</strong>{" "}
                  Focus leaves the tab list and lands in the active panel or its
                  first focusable control — never a hidden panel.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Listen with a screen reader.</strong>{" "}
                  You should hear the tab&apos;s name, &ldquo;tab,&rdquo; its
                  position (&ldquo;2 of 4&rdquo;), and &ldquo;selected&rdquo; on the
                  active one. Verify with the{" "}
                  <Link href="/guides/screen-reader-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                    screen reader testing guide
                  </Link>
                  .
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Confirm hidden panels are gone.</strong>{" "}
                  Inactive panel content should not be reachable by the virtual
                  cursor or the Tab key.
                </li>
              </ol>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Layer automated checks on top: <code>axe-core</code> flags
                missing or mismatched <code>aria-controls</code> targets and invalid
                role nesting. See{" "}
                <Link href="/guides/automated-vs-manual-accessibility-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                  automated vs manual testing
                </Link>{" "}
                for where each fits, then scan the live page with the{" "}
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
                Common Tab Mistakes &amp; How to Fix Them
              </h2>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    Common accessible-tabs anti-patterns, why they fail, and the fix
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
                Accessible Tabs Checklist
              </h2>
              <ol className="space-y-4 text-muted-foreground leading-relaxed list-decimal pl-6">
                <li>
                  <strong className="text-slate-900 dark:text-white">Right pattern.</strong>{" "}
                  Content is same-page peer panels — not links (use{" "}
                  <code>&lt;nav&gt;</code>) or independently expandable sections
                  (use an accordion).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Three roles.</strong>{" "}
                  <code>role=&quot;tablist&quot;</code> wraps{" "}
                  <code>role=&quot;tab&quot;</code> buttons; each panel is{" "}
                  <code>role=&quot;tabpanel&quot;</code>.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Named &amp; linked.</strong>{" "}
                  The list has <code>aria-label</code>; tabs use{" "}
                  <code>aria-controls</code> and panels use{" "}
                  <code>aria-labelledby</code>.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">State is live.</strong>{" "}
                  Exactly one tab has <code>aria-selected=&quot;true&quot;</code>,
                  updated on every switch.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Single Tab stop.</strong>{" "}
                  Roving <code>tabindex</code> — selected tab is{" "}
                  <code>0</code>, the rest <code>-1</code>; Arrow, Home, End wired.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Panels hidden properly.</strong>{" "}
                  Inactive panels use the <code>hidden</code> attribute so they
                  leave the accessibility tree.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Focus visible.</strong>{" "}
                  The focused tab shows a clear indicator (
                  <Link href="/wcag/2-4-7" className="text-blue-600 dark:text-blue-400 hover:underline">
                    2.4.7
                  </Link>
                  ).
                </li>
              </ol>
              <p className="text-muted-foreground leading-relaxed mt-6">
                Work through the full{" "}
                <Link href="/checklists/wcag-2-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                  WCAG 2.2 checklist
                </Link>{" "}
                to see tabs in the context of every other requirement.
              </p>
            </div>
          </section>

          {/* CTA */}
          <section className="py-12 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <div className="rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20 p-8 text-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  Check Your Tabs on a Live Page
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6 max-w-lg mx-auto">
                  Scan any page with our free axe-core-powered auditor to catch
                  missing roles, broken <code>aria-controls</code> targets, and
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
                content="accessible tabs aria tabs tablist tabpanel role tab aria-selected aria-controls roving tabindex keyboard navigation arrow keys automatic manual activation vertical tabs react tabs focus management keyboard accessibility screen reader wcag 4.1.2 2.1.1 2.4.3 aria pattern"
                title="Related Guides & Tools"
                maxItems={6}
                showDescriptions={true}
                excludeUrl="/guides/accessible-tabs"
              />
            </div>
          </section>
        </article>
      </div>
    </>
  )
}
