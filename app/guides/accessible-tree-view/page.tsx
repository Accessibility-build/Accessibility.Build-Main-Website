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
  ListTree,
  Keyboard,
  ShieldCheck,
  ListChecks,
  Layers,
  GitBranch,
  AlertTriangle,
  Code2,
  MoveHorizontal,
  Sparkles,
  MousePointer2,
  CheckSquare,
} from "lucide-react"

const pageTitle = "Accessible Tree View Guide: role=tree & Roving Tabindex"
const pageDescription =
  "Build an accessible tree view the right way: the role=tree / treeitem / group structure, the roving-tabindex focus model, the context-sensitive Right and Left arrow keys that expand, collapse, and move between parent and child, aria-expanded, aria-selected, aria-level, aria-setsize and aria-posinset, single vs multi-select, type-ahead, and React — with copy-ready code mapped to WCAG 2.2, plus when a plain nested list of links is the better choice."

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords: [
    "accessible tree view",
    "role tree",
    "role treeitem",
    "aria tree pattern",
    "wai-aria tree view pattern",
    "tree view keyboard navigation",
    "roving tabindex tree",
    "aria-expanded tree",
    "aria-selected tree",
    "aria-level aria-setsize aria-posinset",
    "tree view accessibility",
    "file explorer accessibility",
    "accessible tree component react",
    "treeview screen reader",
    "multi-select tree accessibility",
    "nested list accessibility",
    "wcag tree view",
  ],
  alternates: {
    canonical: "/guides/accessible-tree-view",
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: "/guides/accessible-tree-view",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: `/api/og?title=${encodeURIComponent("Accessible Tree View Guide")}&section=Guide`,
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
        url: `/api/og?title=${encodeURIComponent("Accessible Tree View Guide")}&section=Guide`,
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
    name: "Accessible Tree View Guide",
    url: "https://accessibility.build/guides/accessible-tree-view",
  },
]

const faqs = [
  {
    question: "What is the difference between a tree view and a navigation menu?",
    answer:
      "A tree view (role=\"tree\") is for browsing and selecting items in a hierarchy — a file explorer, a folder structure, a category picker, a nested comment thread you can collapse. Navigation is different: a set of links that take you to pages. The two look alike because both can be nested and collapsible, but they carry different semantics and keyboard expectations. A tree is a single Tab stop that you drive with the arrow keys, and its nodes are announced as \"tree item, level 2, 3 of 5, expanded\". Navigation is a list of links you Tab through, announced as ordinary links. If your nodes are links to other pages, you almost certainly want a nested list of links inside a nav landmark — with aria-expanded disclosure buttons for the collapsible sections — not a tree. Reserve role=\"tree\" for when the user is operating on the hierarchy itself: expanding branches, selecting nodes, moving items around within one view.",
  },
  {
    question: "When should I use role=\"tree\" instead of a nested list of links?",
    answer:
      "Use a tree only when three things are true: the content is genuinely hierarchical, the user browses and selects nodes within a single view rather than navigating away, and you are prepared to implement the full keyboard model — roving tabindex, up and down to move, right and left to expand and collapse, Home, End, type-ahead, and Enter or Space to act. That is a lot of behaviour to own, and if you get it half-right you produce something worse than a plain list. A nested <ul> of <a> links, with a disclosure button (aria-expanded) toggling each collapsible branch, is more robust, needs far less JavaScript, and is what screen reader users expect for anything that behaves like navigation. Reach for the tree when the widget is a file browser, an org chart, a settings tree, or a data explorer where selecting and expanding nodes is the whole point.",
  },
  {
    question: "What keyboard interactions does an accessible tree view need?",
    answer:
      "The tree is one Tab stop. Once focus is inside, Down Arrow and Up Arrow move to the next and previous visible node. Right Arrow opens a closed parent (without moving focus), and on an already-open parent it moves focus to the first child; on a leaf it does nothing. Left Arrow closes an open parent, and on a closed node or a leaf it moves focus to the parent node. Home jumps to the first node and End to the last visible node. Enter activates the focused node — opens the file, follows the item. In a selection tree, Space toggles whether the focused node is selected. Typing a character (type-ahead) moves focus to the next node whose label starts with that character. Optionally, the asterisk key expands every sibling at the current level. Every one of these has to work with no pointer, or the tree fails 2.1.1 Keyboard.",
  },
  {
    question: "What do the Right and Left arrow keys do in a tree?",
    answer:
      "The Right and Left arrows are what make a tree a tree, and their behaviour is context-sensitive — the same key does different things depending on the focused node's state. Right Arrow on a closed parent expands it and leaves focus where it is; press Right again and, now that the node is open, focus moves to its first child. Right Arrow on a leaf node (one with no children) does nothing. Left Arrow on an open parent collapses it. Left Arrow on a node that is already closed, or on a leaf, moves focus up to its parent node. Left Arrow on a top-level closed node does nothing. This \"expand, then step in\" and \"collapse, then step out\" logic lets a keyboard user walk the whole hierarchy with two keys, and it is the single most common thing custom trees get wrong — many wire only Up and Down, leaving expand and collapse unreachable without a mouse.",
  },
  {
    question: "What is roving tabindex and why does a tree need it?",
    answer:
      "Roving tabindex is a focus-management technique where a composite widget is a single Tab stop, but internally focus roves between its items with the arrow keys. Exactly one node in the tree has tabindex=\"0\" — the current node — and every other node has tabindex=\"-1\", which keeps it focusable by script but out of the Tab sequence. When the user presses an arrow, you set the old node to tabindex=\"-1\", set the new node to tabindex=\"0\", and call .focus() on it. Without this, a naive tree gives every one of its nodes tabindex=\"0\", so a keyboard user has to Tab through hundreds of items to get past the widget, and the arrow-key model never engages. A tree with 400 files would be 400 Tab stops. Roving tabindex collapses that to one. The alternative model is aria-activedescendant, where DOM focus stays on the tree container and an attribute points at the active node; both are valid, but roving tabindex is the more common and more robust choice.",
  },
  {
    question: "Do I need aria-level, aria-setsize, and aria-posinset on tree items?",
    answer:
      "They tell a screen reader user where they are in the hierarchy, which is exactly the information a sighted user reads from indentation. aria-level is the 1-based depth: the root row is level 1, its children level 2, and so on, so the user hears \"level 3\" and knows how deep they have gone. aria-setsize and aria-posinset give position within the current branch — \"3 of 7\" — so the user knows how many siblings there are and which one this is. When the tree is fully present in the DOM and correctly nested with role=\"group\", some assistive technologies can infer level and position, but setting the attributes explicitly is the reliable choice and is essential the moment you virtualise or lazy-load nodes, because then the DOM no longer contains every sibling for the browser to count. Treat all three as part of a properly built tree rather than optional extras.",
  },
  {
    question: "How do I handle selection in a tree — aria-selected or aria-checked?",
    answer:
      "Use aria-selected. A tree is a selection widget, like a listbox, so the selected state belongs on aria-selected, not aria-checked (which is for checkboxes, switches, and menuitemcheckbox). In a single-select tree, one node carries aria-selected=\"true\" and the rest either carry \"false\" or omit it; activating a node with Enter selects it. For a multi-select tree, put aria-multiselectable=\"true\" on the role=\"tree\" container and give every node an explicit aria-selected of \"true\" or \"false\" so the user can hear the state of each; Space toggles the focused node, and the usual extensions — Shift+Arrow to extend, Ctrl+A to select all — apply. Whatever the model, never convey selection by background colour alone: a screen reader user needs aria-selected, and a colour-blind user needs a non-colour cue such as a check icon or bold label.",
  },
  {
    question: "How do I test a tree view for accessibility?",
    answer:
      "Start with the keyboard and no mouse at all. Tab once — focus should land on a single node, not step through every one. Use Down and Up to walk the visible nodes, Right to open a branch and step into it, Left to collapse and step back out, Home and End to jump to the ends, and a letter key to type-ahead to a node. Confirm the page never scrolls out from under you and that focus is always visible. Then listen with a screen reader: each node should announce its label, the word \"tree item\", its level, its position (\"3 of 7\"), and — for parents — whether it is expanded or collapsed, and — in a selection tree — whether it is selected. Collapse a branch while focus is on one of its children and confirm focus jumps to the parent rather than vanishing. Finally, check the visuals: the expand/collapse icon and the focus and selection indicators each need 3:1 contrast, and the clickable row or twisty needs a large enough target.",
  },
]

const keyboardRows = [
  {
    key: "Down Arrow",
    action:
      "Moves focus to the next visible node, reading top to bottom through the tree as it is currently expanded — it does not open or close anything.",
  },
  {
    key: "Up Arrow",
    action: "Moves focus to the previous visible node.",
  },
  {
    key: "Right Arrow",
    action:
      "On a closed parent: opens it, focus stays put. On an already-open parent: moves focus to its first child. On a leaf node: does nothing.",
  },
  {
    key: "Left Arrow",
    action:
      "On an open parent: closes it. On a closed node or a leaf: moves focus to the parent node. On a top-level closed node: does nothing.",
  },
  {
    key: "Home",
    action: "Moves focus to the first node in the tree.",
  },
  {
    key: "End",
    action: "Moves focus to the last node that is currently visible.",
  },
  {
    key: "Enter",
    action:
      "Activates the focused node — performs its default action, such as opening a file or choosing the item. May also toggle selection depending on the design.",
  },
  {
    key: "Space",
    action:
      "In a selection tree, toggles whether the focused node is selected (aria-selected).",
  },
  {
    key: "Type a character",
    action:
      "Type-ahead: moves focus to the next visible node whose label starts with the typed character(s), wrapping to the top if needed.",
  },
  {
    key: "* (asterisk)",
    action:
      "Optional: expands every closed sibling at the same level as the focused node.",
  },
  {
    key: "Tab / Shift + Tab",
    action:
      "Moves focus into and out of the whole tree. The tree is a single Tab stop; the arrows do the navigating inside it.",
  },
]

const attributeRows = [
  {
    element: "The tree container",
    role: 'role="tree" + aria-label / aria-labelledby',
    attrs:
      "The wrapper (usually a <ul>). A single Tab stop that needs an accessible name. Add aria-multiselectable=\"true\" when more than one node can be selected at once.",
  },
  {
    element: "Each node",
    role: 'role="treeitem"',
    attrs:
      "Every openable or selectable node (usually an <li>). Carries the node's state, level, and position.",
  },
  {
    element: "A parent's children",
    role: 'role="group"',
    attrs:
      "Wraps the set of child nodes of an expandable node (the nested <ul>) so the hierarchy and levels are exposed to assistive technology.",
  },
  {
    element: "Open / closed state",
    role: "aria-expanded",
    attrs:
      "On parent nodes only. \"false\" is a closed branch, \"true\" is open. Never place it on a leaf node — it announces something that cannot open.",
  },
  {
    element: "Selection state",
    role: "aria-selected",
    attrs:
      "Which node(s) are selected. One \"true\" in a single-select tree; an explicit \"true\"/\"false\" on every node in a multi-select tree.",
  },
  {
    element: "Depth",
    role: "aria-level",
    attrs:
      "The 1-based depth of the node. The root row is level 1, its children level 2, and so on — the audible version of indentation.",
  },
  {
    element: "Position in level",
    role: "aria-setsize / aria-posinset",
    attrs:
      "How many siblings share this branch and which one this is (\"3 of 7\"). Essential once nodes are virtualised or lazy-loaded.",
  },
  {
    element: "Roving focus",
    role: 'tabindex="0" / tabindex="-1"',
    attrs:
      "Exactly one node has tabindex=\"0\" (the current node); every other node has tabindex=\"-1\". The arrow keys move the 0.",
  },
]

const antiPatterns = [
  {
    bad: "A nested <ul>/<li> marked role=\"tree\" where every node has tabindex=\"0\".",
    why: "Every node becomes a Tab stop, so a keyboard user must Tab through the whole tree and the arrow-key model never engages — a 400-file tree is 400 Tab stops (2.1.1, 2.4.3).",
    fix: "Use roving tabindex: one node at tabindex=\"0\", every other at tabindex=\"-1\", and the arrow keys move focus.",
  },
  {
    bad: "role=\"tree\" used for the site's primary navigation menu of links.",
    why: "A tree implies hierarchical data the user operates on, and it strips the plain-link semantics screen reader users expect from navigation, forcing an arrow-key model on simple links (4.1.2 misuse).",
    fix: "Use a nested <ul> of <a> links inside a <nav>, with aria-expanded disclosure buttons for the collapsible sections. See the menu guide.",
  },
  {
    bad: "aria-expanded=\"false\" on a leaf node that has no children.",
    why: "The screen reader announces the node as \"collapsed\", so the user tries to open something that can never open (4.1.2).",
    fix: "Put aria-expanded on parent nodes only. Leaf nodes carry no aria-expanded at all.",
  },
  {
    bad: "Only Up and Down arrows are wired; Right and Left do nothing.",
    why: "Expanding and collapsing branches is unreachable by keyboard, so a keyboard-only user cannot open the tree's contents (2.1.1).",
    fix: "Implement the Right/Left logic — open-then-step-in, and collapse-then-step-out — as in the arrow-key section.",
  },
  {
    bad: "Child nodes sit in a plain <ul> with no role=\"group\".",
    why: "The hierarchy flattens: levels no longer line up with a real group, and the parent/child relationship is lost to assistive technology (1.3.1, 4.1.2).",
    fix: "Wrap every set of children in <ul role=\"group\">, nested inside the parent treeitem.",
  },
  {
    bad: "Collapsing a parent while focus is on one of its now-hidden children leaves focus on a hidden element.",
    why: "Focus lands on something display:none or is lost to <body>, dropping the user to the top of the page mid-task (2.4.3, 2.1.1).",
    fix: "On collapse, move focus to the parent node being collapsed before its children are hidden.",
  },
  {
    bad: "The selected node is shown only by a background colour, with no aria-selected.",
    why: "A screen reader user never learns which node is selected, and colour alone fails colour-blind users (1.4.1, 4.1.2).",
    fix: "Set aria-selected on the node and pair the colour with a non-colour cue such as a check icon or bold label.",
  },
]

export default function AccessibleTreeViewGuidePage() {
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
                    Accessible Tree View
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
                Accessible Tree View Guide
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                A tree view lets a user browse and select nodes in a hierarchy —
                a file explorer, a folder picker, a settings tree. This guide
                covers the <code>role=&quot;tree&quot;</code> /{" "}
                <code>treeitem</code> / <code>group</code> structure, the
                roving-tabindex focus model, the context-sensitive Right and Left
                arrows that expand, collapse, and move between parent and child,{" "}
                <code>aria-level</code>, <code>aria-setsize</code>,{" "}
                <code>aria-posinset</code>, selection, and React — with copy-ready
                code mapped to WCAG 2.2, and the one question to ask before you
                build one at all.
              </p>
            </div>
          </section>

          {/* What & why */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                The Widget Defined by Its Arrow Keys
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  A tree view is the control you reach for when the data is a
                  hierarchy the user needs to walk — folders inside folders, an
                  org chart, a category taxonomy, a nested set of settings. On
                  screen it is a column of indented rows with little twisties that
                  open and close branches. What makes it a <em>tree</em> to
                  assistive technology, and not just an indented list, is a
                  specific bundle of semantics and a specific keyboard model: one
                  Tab stop, arrow keys to move, and — the part that defines the
                  pattern — Right and Left arrows that expand and collapse
                  branches and step between a parent and its children.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The tree has an ARIA pattern of its own —{" "}
                  <a
                    href="https://www.w3.org/WAI/ARIA/apg/patterns/treeview/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    the WAI-ARIA Authoring Practices Tree View pattern
                  </a>{" "}
                  — built from{" "}
                  <strong className="text-slate-900 dark:text-white">
                    <code>role=&quot;tree&quot;</code>,{" "}
                    <code>role=&quot;treeitem&quot;</code>, and{" "}
                    <code>role=&quot;group&quot;</code>
                  </strong>
                  , with <code>aria-expanded</code> on the branches,{" "}
                  <code>aria-selected</code> for what is chosen, and{" "}
                  <code>aria-level</code>, <code>aria-setsize</code> and{" "}
                  <code>aria-posinset</code> to say where in the hierarchy each
                  node sits. Unlike a{" "}
                  <Link href="/guides/accessible-slider" className="text-blue-600 dark:text-blue-400 hover:underline">
                    slider
                  </Link>{" "}
                  or a{" "}
                  <Link href="/guides/accessible-switch" className="text-blue-600 dark:text-blue-400 hover:underline">
                    switch
                  </Link>
                  , there is no native HTML element that gives you a tree — you
                  build the whole thing, which is exactly why so many trees ship
                  broken.
                </p>
                <div className="rounded-lg border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 p-5 my-6">
                  <p className="text-sm text-slate-800 dark:text-amber-100 leading-relaxed flex gap-3">
                    <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
                    <span>
                      <strong>
                        Before anything else: most &ldquo;trees&rdquo; should not
                        be trees.
                      </strong>{" "}
                      If your nodes are links that navigate to pages, a nested
                      list of links with{" "}
                      <Link href="/guides/accessible-accordion" className="underline">
                        disclosure buttons
                      </Link>{" "}
                      is more robust and needs a fraction of the code. Reserve{" "}
                      <code>role=&quot;tree&quot;</code> for when the user
                      operates <em>on</em> the hierarchy — expanding, selecting,
                      browsing within one view. Section 1 is the decision.
                    </span>
                  </p>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  This guide walks that decision first, then the anatomy, the DOM
                  structure, the full keyboard model, the roving-tabindex focus
                  engine, the Right/Left arrow logic in depth, selection (single
                  and multi), the level and position properties, a React
                  approach, and how to test the result — because with no native
                  element to lean on, testing by hand is the only way to know a
                  tree actually works.
                </p>
              </div>
            </div>
          </section>

          {/* WCAG mapping */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <ShieldCheck className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                The WCAG 2.2 Criteria a Tree View Must Satisfy
              </h2>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    WCAG 2.2 success criteria that a correctly built tree view
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
                        What the tree must do
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
                      <td className="px-4 py-3">The hierarchy, each node&apos;s level and position, and the expanded and selected states are exposed programmatically, not implied by indentation alone.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-1-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.1.1 Keyboard
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Every action — move, expand, collapse, select, activate — works from the keyboard, including the Right and Left arrows most trees forget.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-1-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.1.2 No Keyboard Trap
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Tab moves focus into the tree and Tab moves it out again — the arrows navigate inside, they do not trap.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-4-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.4.3 Focus Order
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Roving tabindex keeps the tree a single Tab stop and focus never lands on a hidden node — collapsing a branch moves focus to its parent.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-4-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          1.4.1 Use of Color
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Which node is selected is shown by more than colour — aria-selected plus a check icon or bold label, not a background tint alone.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-4-7" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.4.7 Focus Visible
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">The focused node shows a clearly visible indicator that is distinct from the selected-node styling.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/1-4-11" className="text-blue-600 dark:text-blue-400 hover:underline">
                          1.4.11 Non-text Contrast
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">The expand/collapse twisty, the focus ring, and the selection indicator each reach at least 3:1 against what they sit on.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-5-8" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.5.8 Target Size (Minimum)
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">The clickable row or the expand twisty is at least 24 by 24 CSS pixels so it can be operated by touch and imprecise pointers.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/4-1-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                          4.1.2 Name, Role, Value
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Each node exposes the treeitem role, its own name, and its state — expanded/collapsed for parents, selected for chosen nodes.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-muted-foreground leading-relaxed mt-6">
                The criterion trees fail most often is{" "}
                <Link href="/wcag/2-1-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                  2.1.1 Keyboard
                </Link>
                , because the Right and Left arrow behaviour that expands,
                collapses, and steps between parent and child is genuinely fiddly
                and easy to skip — leaving branches that a mouse can open but a
                keyboard cannot. The second is{" "}
                <Link href="/wcag/2-4-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                  2.4.3 Focus Order
                </Link>
                , when a collapsing branch strands focus on a node that has just
                been hidden.
              </p>
            </div>
          </section>

          {/* Decision */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <GitBranch className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                1. Do You Even Need a Tree?
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                A tree is one of the heaviest patterns in the ARIA toolkit —
                there is no native element, so you own the roles, the roving
                focus, and the whole keyboard model. Reach for it only when the
                user genuinely operates on a hierarchy inside a single view. For
                many things that <em>look</em> like a tree, a simpler pattern is
                more robust and far less code. Match the control to the job
                before you build.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
                <Card className="border-blue-200 dark:border-blue-900">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Tree view</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      The user <strong className="text-slate-900 dark:text-white">browses and selects</strong>{" "}
                      nodes in a hierarchy within one view — a file explorer, a
                      folder picker, an org chart, a settings tree.{" "}
                      <code>role=&quot;tree&quot;</code>. This is what the guide
                      covers.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Nested nav links</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      The nodes are{" "}
                      <strong className="text-slate-900 dark:text-white">links that navigate</strong>{" "}
                      to pages — docs sidebars, category menus. A nested{" "}
                      <code>&lt;ul&gt;</code> of <code>&lt;a&gt;</code> in a{" "}
                      <code>&lt;nav&gt;</code>, with{" "}
                      <Link href="/guides/accessible-menu" className="text-blue-600 dark:text-blue-400 hover:underline">
                        disclosure buttons
                      </Link>{" "}
                      for collapsible sections.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Disclosure / accordion</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      A flat set of{" "}
                      <strong className="text-slate-900 dark:text-white">show/hide sections</strong>{" "}
                      with no real hierarchy — FAQs, panels. The{" "}
                      <Link href="/guides/accessible-accordion" className="text-blue-600 dark:text-blue-400 hover:underline">
                        accordion &amp; disclosure pattern
                      </Link>{" "}
                      with <code>aria-expanded</code>, no roving tabindex needed.
                    </p>
                  </CardContent>
                </Card>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                The single clearest tell: <strong className="text-slate-900 dark:text-white">do the nodes take you somewhere, or do you act on them here?</strong>{" "}
                Links that navigate want a nested list of links — that pattern is
                battle-tested, works without JavaScript, and matches what screen
                reader users expect. A tree earns its cost only when expanding and
                selecting nodes <em>is</em> the interaction: a two-pane file
                browser, a component inspector, a taxonomy editor. When in doubt,
                start with the list of links and upgrade only if the interaction
                truly demands it.
              </p>
            </div>
          </section>

          {/* Anatomy */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Layers className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                2. Anatomy: Roles, States, and Properties
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                A tree carries more structural information than almost any other
                widget, because every node has to broadcast not just what it is
                but where it sits: its depth, its position among siblings, whether
                it is open, and whether it is selected. Here is the full set and
                what each part is for.
              </p>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    The elements and attributes in an accessible tree view and
                    what each is for
                  </caption>
                  <thead className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">Element / concept</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Attribute</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Purpose</th>
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
                A subtlety worth calling out: a parent node&apos;s accessible name
                should be just its own label, not the text of everything beneath
                it. Keep each node&apos;s label in a single element (a{" "}
                <code>&lt;span&gt;</code> in the examples below) so it reads as
                &ldquo;Documents&rdquo;, and if your assistive technology reads the
                descendants too, give the parent an explicit{" "}
                <code>aria-label</code> or{" "}
                <code>aria-labelledby</code> pointing at that label. For how each
                role and property surfaces to assistive technology, see the{" "}
                <Link href="/reference/aria" className="text-blue-600 dark:text-blue-400 hover:underline">
                  ARIA roles &amp; attributes reference
                </Link>
                .
              </p>
            </div>
          </section>

          {/* Structure */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Code2 className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                3. The HTML Structure
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Build the tree from a nested list. The outer{" "}
                <code>&lt;ul&gt;</code> is the <code>role=&quot;tree&quot;</code>,
                each <code>&lt;li&gt;</code> is a{" "}
                <code>role=&quot;treeitem&quot;</code>, and the children of an
                expandable node live in a nested{" "}
                <code>&lt;ul role=&quot;group&quot;&gt;</code>. Parent nodes get{" "}
                <code>aria-expanded</code>; leaf nodes do not. Exactly one node —
                here the first — starts at <code>tabindex=&quot;0&quot;</code>.
              </p>
              <pre className="overflow-x-auto rounded-lg bg-slate-900 dark:bg-slate-950 border border-slate-800 p-4 text-sm text-slate-100"><code>{`<ul role="tree" aria-label="File system">
  <!-- A parent node: has aria-expanded and a role="group" of children. -->
  <li
    role="treeitem"
    aria-expanded="false"
    aria-level="1"
    aria-setsize="2"
    aria-posinset="1"
    tabindex="0"
  >
    <span class="tree__label">Documents</span>
    <ul role="group">
      <li role="treeitem" aria-level="2" aria-setsize="2" aria-posinset="1" tabindex="-1">
        <span class="tree__label">Resume.pdf</span>
      </li>
      <li role="treeitem" aria-level="2" aria-setsize="2" aria-posinset="2" tabindex="-1">
        <span class="tree__label">Cover-letter.pdf</span>
      </li>
    </ul>
  </li>

  <!-- A leaf node: NO aria-expanded, no group. -->
  <li role="treeitem" aria-level="1" aria-setsize="2" aria-posinset="2" tabindex="-1">
    <span class="tree__label">Readme.txt</span>
  </li>
</ul>`}</code></pre>
              <div className="rounded-lg border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/30 p-5 my-6">
                <p className="text-sm text-slate-800 dark:text-blue-100 leading-relaxed flex gap-3">
                  <Sparkles className="h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
                  <span>
                    <strong>
                      The <code>role=&quot;group&quot;</code> on the nested list
                      is not optional.
                    </strong>{" "}
                    It is what tells assistive technology that these{" "}
                    <code>&lt;li&gt;</code>s are the <em>children</em> of the node
                    above, rather than more siblings. Drop it and the tree
                    flattens: levels stop lining up and the parent/child
                    relationship disappears. Note also that{" "}
                    <code>aria-expanded</code> lives on the parent{" "}
                    <code>treeitem</code>, not on the group.
                  </span>
                </p>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                When a branch is collapsed, hide its <code>role=&quot;group&quot;</code>{" "}
                with <code>hidden</code> or <code>display:none</code> so its nodes
                leave the accessibility tree entirely — a collapsed branch&apos;s
                children must not be reachable by the arrow keys or a screen
                reader&apos;s virtual cursor. Set{" "}
                <code>aria-expanded=&quot;false&quot;</code> and hide the group
                together, as one operation.
              </p>
            </div>
          </section>

          {/* Keyboard */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Keyboard className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                4. The Keyboard Model
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                This is the contract that turns a nested list into a tree, and
                there is no native element to implement it for you — every key
                here is yours to wire up. A tree that responds only to Up and Down
                is not a tree; it is an inaccessible list with extra roles.
              </p>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    Keyboard commands a conformant tree view must support
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
                Note that &ldquo;visible node&rdquo; means visible <em>in the tree
                as currently expanded</em> — Down Arrow from an open folder goes
                to its first child, but from a closed folder it skips over the
                hidden children to the next sibling. For the wider contract every
                custom widget owes, and the roving-tabindex technique the next
                section builds on, see the{" "}
                <Link href="/guides/keyboard-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">
                  keyboard accessibility guide
                </Link>{" "}
                and the{" "}
                <Link href="/guides/focus-management" className="text-blue-600 dark:text-blue-400 hover:underline">
                  focus management guide
                </Link>
                .
              </p>
            </div>
          </section>

          {/* Roving tabindex */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <MousePointer2 className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                5. Roving Tabindex: One Tab Stop, Not Four Hundred
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                A tree is a <em>composite</em> widget: it should be a single stop
                in the Tab order, and once focus is inside, the arrow keys move
                between nodes. The technique that achieves this is roving
                tabindex. Exactly one node carries{" "}
                <code>tabindex=&quot;0&quot;</code> and is in the Tab sequence;
                every other node carries <code>tabindex=&quot;-1&quot;</code>,
                which keeps it focusable by script but out of the Tab order. When
                the user arrows to a new node, you move the <code>0</code>.
              </p>
              <pre className="overflow-x-auto rounded-lg bg-slate-900 dark:bg-slate-950 border border-slate-800 p-4 text-sm text-slate-100"><code>{`const tree = document.querySelector('[role="tree"]')

// Move focus from the current node to a target node.
function focusNode(target) {
  if (!target) return
  // Take the current node out of the Tab order...
  tree.querySelector('[tabindex="0"]')?.setAttribute("tabindex", "-1")
  // ...and put the target in it, then move real DOM focus there.
  target.setAttribute("tabindex", "0")
  target.focus()
}`}</code></pre>
              <div className="rounded-lg border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 p-5 my-6">
                <p className="text-sm text-slate-800 dark:text-amber-100 leading-relaxed flex gap-3">
                  <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
                  <span>
                    <strong>
                      The number-one tree bug is giving every node{" "}
                      <code>tabindex=&quot;0&quot;</code>.
                    </strong>{" "}
                    It looks like it works with a mouse, but now a keyboard user
                    has to Tab through every file to get past the widget, and the
                    arrow-key model never runs. A tree with four hundred nodes
                    becomes four hundred Tab stops. One <code>0</code>, the rest{" "}
                    <code>-1</code> — always.
                  </span>
                </p>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                There is a second valid model,{" "}
                <strong className="text-slate-900 dark:text-white">
                  <code>aria-activedescendant</code>
                </strong>
                : DOM focus stays on the <code>role=&quot;tree&quot;</code>{" "}
                container, and an <code>aria-activedescendant</code> attribute on
                it points at the <code>id</code> of the active node, which you
                move as the user arrows. It avoids shuffling <code>tabindex</code>{" "}
                and can be simpler with virtualised lists, but it puts the burden
                of a visible &ldquo;active&rdquo; style entirely on your CSS.
                Roving tabindex is the more common choice and the one the rest of
                this guide uses. See{" "}
                <Link href="/guides/focus-management" className="text-blue-600 dark:text-blue-400 hover:underline">
                  focus management
                </Link>{" "}
                for both models side by side.
              </p>
            </div>
          </section>

          {/* Right/Left arrow logic */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <MoveHorizontal className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                6. The Right and Left Arrows — the Logic That Defines a Tree
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                This is the behaviour that makes a tree a tree, and it is
                context-sensitive: the same key does different things depending on
                whether the focused node is a leaf, a closed parent, or an open
                parent. Get this right and a keyboard user can walk the entire
                hierarchy with two keys; get it wrong — or leave it out — and
                whole branches become mouse-only.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      Right Arrow
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm text-muted-foreground leading-relaxed space-y-2 list-disc pl-5">
                      <li><strong className="text-slate-900 dark:text-white">Closed parent:</strong> open it; focus stays.</li>
                      <li><strong className="text-slate-900 dark:text-white">Open parent:</strong> move focus to its first child.</li>
                      <li><strong className="text-slate-900 dark:text-white">Leaf:</strong> do nothing.</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      Left Arrow
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="text-sm text-muted-foreground leading-relaxed space-y-2 list-disc pl-5">
                      <li><strong className="text-slate-900 dark:text-white">Open parent:</strong> close it; focus stays.</li>
                      <li><strong className="text-slate-900 dark:text-white">Closed node or leaf:</strong> move focus to the parent node.</li>
                      <li><strong className="text-slate-900 dark:text-white">Top-level closed node:</strong> do nothing.</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
              <pre className="overflow-x-auto rounded-lg bg-slate-900 dark:bg-slate-950 border border-slate-800 p-4 text-sm text-slate-100"><code>{`tree.addEventListener("keydown", (e) => {
  const node = e.target.closest('[role="treeitem"]')
  if (!node) return

  const isParent = node.hasAttribute("aria-expanded")
  const isOpen = node.getAttribute("aria-expanded") === "true"

  switch (e.key) {
    case "ArrowDown": focusNode(nextVisibleNode(node)); break
    case "ArrowUp":   focusNode(previousVisibleNode(node)); break

    case "ArrowRight":
      if (isParent && !isOpen) setExpanded(node, true)        // open it
      else if (isParent && isOpen) focusNode(firstChild(node)) // step in
      // leaf: do nothing
      break

    case "ArrowLeft":
      if (isParent && isOpen) setExpanded(node, false)         // close it
      else focusNode(parentNode(node))                         // step out
      break

    case "Home": focusNode(firstNode()); break
    case "End":  focusNode(lastVisibleNode()); break
    case "Enter": activate(node); break
    case " ":     toggleSelected(node); break                 // selection trees
    default: return                                           // let other keys through
  }
  e.preventDefault()   // <- stop the arrows scrolling the page
})

// Expanding/collapsing is one operation: attribute + visibility together.
function setExpanded(node, open) {
  node.setAttribute("aria-expanded", String(open))
  node.querySelector(':scope > [role="group"]')?.toggleAttribute("hidden", !open)
}`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-6">
                Two details carry a lot of weight. First, the guard{" "}
                <code>node.hasAttribute(&quot;aria-expanded&quot;)</code> is how
                the code knows a node is a parent at all — which is exactly why{" "}
                <code>aria-expanded</code> must be present (even as{" "}
                <code>&quot;false&quot;</code>) on every parent and{" "}
                <em>absent</em> on every leaf. Second, the closing{" "}
                <code>e.preventDefault()</code> stops the arrow keys from
                scrolling the page instead of moving through the tree, the same
                trap custom{" "}
                <Link href="/guides/accessible-slider" className="text-blue-600 dark:text-blue-400 hover:underline">
                  sliders
                </Link>{" "}
                and{" "}
                <Link href="/guides/accessible-menu" className="text-blue-600 dark:text-blue-400 hover:underline">
                  menus
                </Link>{" "}
                fall into. And when you collapse a branch whose child holds focus,
                move focus to the parent first — never leave it on a node you are
                about to hide, which would break{" "}
                <Link href="/wcag/2-4-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                  2.4.3 Focus Order
                </Link>
                .
              </p>
            </div>
          </section>

          {/* Selection */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <CheckSquare className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                7. Selection: Single vs Multi-Select
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                A tree is a selection widget, so the chosen state belongs on{" "}
                <strong className="text-slate-900 dark:text-white">
                  <code>aria-selected</code>
                </strong>{" "}
                — not <code>aria-checked</code>, which is for checkboxes and
                switches. There are two models, and the difference is one
                attribute on the container plus how many nodes can be{" "}
                <code>true</code> at once.
              </p>
              <pre className="overflow-x-auto rounded-lg bg-slate-900 dark:bg-slate-950 border border-slate-800 p-4 text-sm text-slate-100"><code>{`<!-- Single-select: one node is aria-selected="true", Enter selects. -->
<ul role="tree" aria-label="Categories">
  <li role="treeitem" aria-selected="true"  aria-level="1" tabindex="0">Design</li>
  <li role="treeitem" aria-selected="false" aria-level="1" tabindex="-1">Engineering</li>
</ul>

<!-- Multi-select: aria-multiselectable on the tree, every node
     carries an explicit aria-selected, Space toggles the focused one. -->
<ul role="tree" aria-label="Files to export" aria-multiselectable="true">
  <li role="treeitem" aria-selected="true"  aria-level="1" tabindex="0">chart.png</li>
  <li role="treeitem" aria-selected="false" aria-level="1" tabindex="-1">data.csv</li>
  <li role="treeitem" aria-selected="true"  aria-level="1" tabindex="-1">notes.md</li>
</ul>`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-6">
                In a{" "}
                <strong className="text-slate-900 dark:text-white">single-select</strong>{" "}
                tree, one node is <code>aria-selected=&quot;true&quot;</code> and
                selecting another moves that <code>true</code>; Enter on a node
                selects it and performs its action. In a{" "}
                <strong className="text-slate-900 dark:text-white">multi-select</strong>{" "}
                tree, set <code>aria-multiselectable=&quot;true&quot;</code> on the{" "}
                <code>role=&quot;tree&quot;</code> and give{" "}
                <em>every</em> node an explicit{" "}
                <code>aria-selected</code> of <code>true</code> or{" "}
                <code>false</code> so a screen reader can announce the state of
                each. Space toggles the focused node, and the standard extensions —
                Shift+Down/Up to extend a range, Ctrl+A to select all — round it
                out.
              </p>
              <div className="rounded-lg border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 p-5 my-6">
                <p className="text-sm text-slate-800 dark:text-amber-100 leading-relaxed flex gap-3">
                  <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
                  <span>
                    <strong>Never show selection by colour alone.</strong> A tinted
                    row means nothing to a screen reader without{" "}
                    <code>aria-selected</code>, and nothing to a colour-blind user
                    without a second cue. Pair the state with a check icon, a bold
                    label, or a leading marker so it survives both{" "}
                    <Link href="/wcag/1-4-1" className="underline">
                      1.4.1 Use of Color
                    </Link>{" "}
                    and{" "}
                    <Link href="/wcag/4-1-2" className="underline">
                      4.1.2
                    </Link>
                    .
                  </span>
                </p>
              </div>
            </div>
          </section>

          {/* Level / position */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <ListTree className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                8. Telling the User Where They Are: Level and Position
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                A sighted user reads depth from indentation and position from the
                rows above and below. A screen reader user gets that same
                orientation from three properties, and without them a deep tree
                becomes a disorienting flat list of names with no sense of how
                far in or how far down you are.
              </p>
              <ul className="space-y-3 text-muted-foreground leading-relaxed list-disc pl-6 mb-6">
                <li>
                  <strong className="text-slate-900 dark:text-white">
                    <code>aria-level</code>
                  </strong>{" "}
                  — the 1-based depth. Root nodes are level 1, their children
                  level 2, and so on. The user hears &ldquo;level 3&rdquo; and
                  knows exactly how deep they have gone.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">
                    <code>aria-setsize</code>
                  </strong>{" "}
                  — how many siblings share this branch, so the user hears
                  &ldquo;of 7&rdquo;.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">
                    <code>aria-posinset</code>
                  </strong>{" "}
                  — which sibling this is, so the user hears &ldquo;3 of
                  7&rdquo;.
                </li>
              </ul>
              <p className="text-muted-foreground leading-relaxed">
                When the whole tree is in the DOM and correctly nested with{" "}
                <code>role=&quot;group&quot;</code>, some browsers can compute
                level and position for you — but setting all three explicitly is
                the reliable choice, and it becomes{" "}
                <strong className="text-slate-900 dark:text-white">mandatory</strong>{" "}
                the moment you{" "}
                <strong className="text-slate-900 dark:text-white">
                  virtualise or lazy-load
                </strong>{" "}
                nodes: once the DOM no longer contains every sibling, the browser
                has nothing to count, and only your <code>aria-setsize</code> and{" "}
                <code>aria-posinset</code> can tell the user &ldquo;3 of
                7,000&rdquo;. Treat them as part of building a tree, not as
                polish.
              </p>
            </div>
          </section>

          {/* React */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Code2 className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                9. Tree Views in React
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                In React you render the nodes from data and keep the expanded and
                selected sets in state, but the accessibility contract does not
                change: the roles, <code>aria-expanded</code>,{" "}
                <code>aria-selected</code>, the level and position properties, the
                roving <code>tabindex</code>, and the full keyboard handler are
                all still yours to get right. A recursive component maps cleanly
                onto the recursive structure.
              </p>
              <pre className="overflow-x-auto rounded-lg bg-slate-900 dark:bg-slate-950 border border-slate-800 p-4 text-sm text-slate-100"><code>{`function TreeNode({ node, level, posInSet, setSize, state }) {
  const isParent = node.children?.length > 0
  const isOpen = state.expanded.has(node.id)
  const isCurrent = state.tabbable === node.id

  return (
    <li
      role="treeitem"
      aria-expanded={isParent ? isOpen : undefined}   // parents only
      aria-selected={state.selected === node.id}
      aria-level={level}
      aria-posinset={posInSet}
      aria-setsize={setSize}
      tabIndex={isCurrent ? 0 : -1}                    // roving tabindex
    >
      <span className="tree__label">{node.label}</span>
      {isParent && isOpen && (
        <ul role="group">
          {node.children.map((child, i) => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              posInSet={i + 1}
              setSize={node.children.length}
              state={state}
            />
          ))}
        </ul>
      )}
    </li>
  )
}`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-6">
                Because this is so much surface area, the honest advice for
                production is to lean on a well-tested headless implementation:{" "}
                <strong className="text-slate-900 dark:text-white">
                  React Aria&apos;s <code>useTree</code> / <code>Tree</code>
                </strong>
                , or a mature component library&apos;s tree, implements the
                roving focus, the Right/Left logic, type-ahead, and selection with
                the edge cases already handled. The same principles carry to other
                frameworks — see the{" "}
                <Link href="/guides/react-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">
                  React
                </Link>
                ,{" "}
                <Link href="/guides/vue-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Vue
                </Link>
                , and{" "}
                <Link href="/guides/angular-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Angular
                </Link>{" "}
                guides. Whatever you ship, verify it against the workflow below
                rather than trusting the README.
              </p>
            </div>
          </section>

          {/* Testing */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Keyboard className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                How to Test an Accessible Tree View
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Automated tools catch a missing role or an{" "}
                <code>aria-expanded</code> on a leaf, but almost everything that
                decides whether a tree is usable — the roving focus, the
                Right/Left logic, the announcements — is a hands-on check that
                takes a few minutes.
              </p>
              <ol className="space-y-4 text-muted-foreground leading-relaxed list-decimal pl-6">
                <li>
                  <strong className="text-slate-900 dark:text-white">Tab exactly once.</strong>{" "}
                  Focus should land on a single node, and one more Tab should
                  leave the tree entirely. If Tab steps node by node, you have the
                  every-node-<code>tabindex=0</code> bug.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Walk it with the arrows.</strong>{" "}
                  Down and Up move between visible nodes; Right opens a branch and
                  then steps into it; Left collapses and then steps out to the
                  parent; Home and End jump to the ends. Type a letter and confirm
                  focus jumps to a matching node. The page must not scroll while
                  you do it.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Listen with a screen reader.</strong>{" "}
                  Each node should announce its label, &ldquo;tree item&rdquo;, its
                  level, its position (&ldquo;3 of 7&rdquo;), and — for parents —
                  expanded or collapsed, and — in a selection tree — selected or
                  not. The{" "}
                  <Link href="/guides/screen-reader-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                    screen reader testing guide
                  </Link>{" "}
                  has the commands for{" "}
                  <Link href="/guides/nvda-screen-reader-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                    NVDA
                  </Link>{" "}
                  and{" "}
                  <Link href="/guides/voiceover-screen-reader-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                    VoiceOver
                  </Link>
                  .
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Collapse a branch from inside it.</strong>{" "}
                  Focus a child, then collapse its parent (Left on the parent, or
                  a collapse-all). Focus must jump to the parent, never vanish to
                  the top of the page.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Measure the visuals.</strong>{" "}
                  The twisty icon, the focus ring, and the selection indicator each
                  reach 3:1 (
                  <Link href="/wcag/1-4-11" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.4.11
                  </Link>
                  ); the clickable row or twisty is at least 24&nbsp;&times;&nbsp;24 px (
                  <Link href="/wcag/2-5-8" className="text-blue-600 dark:text-blue-400 hover:underline">
                    2.5.8
                  </Link>
                  ); selection is not colour alone (
                  <Link href="/wcag/1-4-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.4.1
                  </Link>
                  ).
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
                </Link>{" "}
                to catch a missing name, role, or state before it ships.
              </p>
            </div>
          </section>

          {/* Anti-patterns */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                Common Tree View Mistakes &amp; How to Fix Them
              </h2>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    Common accessible tree view anti-patterns, why they fail, and
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
                Accessible Tree View Checklist
              </h2>
              <ol className="space-y-4 text-muted-foreground leading-relaxed list-decimal pl-6">
                <li>
                  <strong className="text-slate-900 dark:text-white">Right control.</strong>{" "}
                  The user operates on a hierarchy in one view. If the nodes are
                  links that navigate, use a nested list of links instead.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Structure.</strong>{" "}
                  <code>role=&quot;tree&quot;</code> on the container,{" "}
                  <code>role=&quot;treeitem&quot;</code> on every node,{" "}
                  <code>role=&quot;group&quot;</code> on every nested child list.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">State.</strong>{" "}
                  <code>aria-expanded</code> on parents only (never on leaves);{" "}
                  <code>aria-selected</code> for the chosen node(s) (
                  <Link href="/wcag/4-1-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                    4.1.2
                  </Link>
                  ).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Position.</strong>{" "}
                  <code>aria-level</code>, <code>aria-setsize</code>, and{" "}
                  <code>aria-posinset</code> on every node — required once you
                  virtualise.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">One Tab stop.</strong>{" "}
                  Roving tabindex: exactly one node at{" "}
                  <code>tabindex=&quot;0&quot;</code>, the rest at{" "}
                  <code>-1</code> (
                  <Link href="/wcag/2-4-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                    2.4.3
                  </Link>
                  ).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Full keyboard.</strong>{" "}
                  Up/Down, the Right/Left expand-collapse-and-move logic, Home,
                  End, type-ahead, Enter, and Space all work, with no page scroll (
                  <Link href="/wcag/2-1-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                    2.1.1
                  </Link>
                  ).
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Focus never lost.</strong>{" "}
                  Collapsing a branch moves focus to its parent, never onto a
                  hidden node.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Visible and reachable.</strong>{" "}
                  Twisty, focus ring, and selection each reach 3:1 (
                  <Link href="/wcag/1-4-11" className="text-blue-600 dark:text-blue-400 hover:underline">
                    1.4.11
                  </Link>
                  ); the target is at least 24&nbsp;&times;&nbsp;24 px (
                  <Link href="/wcag/2-5-8" className="text-blue-600 dark:text-blue-400 hover:underline">
                    2.5.8
                  </Link>
                  ); selection is not colour alone.
                </li>
              </ol>
              <p className="text-muted-foreground leading-relaxed mt-6">
                Work through the full{" "}
                <Link href="/checklists/wcag-2-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                  WCAG 2.2 checklist
                </Link>{" "}
                to see the tree in the context of every other requirement.
              </p>
            </div>
          </section>

          {/* CTA */}
          <section className="py-12 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <div className="rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20 p-8 text-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  Check Your Tree View on a Live Page
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6 max-w-lg mx-auto">
                  Scan any page with our free axe-core-powered auditor to catch a
                  tree with a missing role, an <code>aria-expanded</code> on a
                  leaf, or nodes with no accessible name — then run the Tab,
                  arrow-key, and collapse passes above for the failures no scanner
                  can see.
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
                content="accessible tree view role tree treeitem group aria-expanded aria-selected aria-level aria-setsize aria-posinset roving tabindex aria-activedescendant keyboard navigation right left arrow expand collapse type-ahead single-select multi-select aria-multiselectable file explorer nested list focus management menu accordion react accessible tree wcag 1.3.1 2.1.1 2.4.3 2.4.7 1.4.11 2.5.8 4.1.2"
                title="Related Guides & Tools"
                maxItems={6}
                showDescriptions={true}
                excludeUrl="/guides/accessible-tree-view"
              />
            </div>
          </section>
        </article>
      </div>
    </>
  )
}
