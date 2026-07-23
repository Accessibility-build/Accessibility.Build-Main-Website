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
  SquareMenu,
  Keyboard,
  ShieldCheck,
  ListChecks,
  Navigation,
  Layers,
  MousePointerClick,
  Code2,
  GitBranch,
  AlertTriangle,
} from "lucide-react"

const pageTitle = "Accessible Menu & Menu Button Guide (WAI-ARIA)"
const pageDescription =
  "Most dropdowns on the web should not use role=\"menu\" at all. This guide covers when the WAI-ARIA Menu pattern applies, the menu button (aria-haspopup, aria-expanded), roving tabindex focus, menuitemcheckbox and menuitemradio, and the disclosure pattern that navigation dropdowns should use instead — with copy-ready HTML, JavaScript, and React mapped to WCAG 2.2."

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords: [
    "accessible menu",
    "accessible dropdown menu",
    "aria menu pattern",
    "role menu",
    "role menuitem",
    "menubar accessibility",
    "aria-haspopup",
    "menu button accessibility",
    "accessible navigation dropdown",
    "roving tabindex menu",
    "menuitemcheckbox",
    "menuitemradio",
    "wai-aria menu",
    "menu keyboard navigation",
    "react accessible menu",
    "disclosure navigation pattern",
    "wcag dropdown menu",
  ],
  alternates: {
    canonical: "/guides/accessible-menu",
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: "/guides/accessible-menu",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: `/api/og?title=${encodeURIComponent("Accessible Menu & Menu Button Guide")}&section=Guide`,
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
        url: `/api/og?title=${encodeURIComponent("Accessible Menu & Menu Button Guide")}&section=Guide`,
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
    name: "Accessible Menu & Menu Button Guide",
    url: "https://accessibility.build/guides/accessible-menu",
  },
]

const faqs = [
  {
    question: "Should my site navigation use role=\"menubar\" and role=\"menuitem\"?",
    answer:
      "Almost certainly not. The ARIA menu and menubar roles model an application menu — the File, Edit, and View menus of a desktop program — where each item runs a command inside the current application. A site navigation bar is a set of links to other pages, and links are exactly what it should expose. Wrapping your navigation in role=\"menubar\" replaces link semantics with menu semantics, so screen reader users lose the links list, lose the \"link\" announcement that tells them the item navigates, and gain a keyboard model where Tab no longer moves between items. Use a <nav> element containing a <ul> of <a> elements. Reach for role=\"menu\" only when the items are actions rather than destinations, such as a Copy / Duplicate / Delete row-action menu in an editor.",
  },
  {
    question: "What is the difference between a menu button and a disclosure?",
    answer:
      "Both are a button that reveals a hidden container, and from the outside they look identical. The difference is what is inside and how the keyboard behaves. A disclosure button carries aria-expanded and reveals arbitrary content — a list of links, a panel of text, a form — and the keyboard just keeps Tabbing through whatever is inside. A menu button carries aria-haspopup=\"menu\" plus aria-expanded and reveals a role=\"menu\" that contains only menu items; opening it moves focus into the menu, arrow keys move between items, the menu is a single Tab stop, and Escape closes it and returns focus to the button. If your dropdown holds navigation links, you want the disclosure. If it holds commands, you want the menu button.",
  },
  {
    question: "Can menu items be links with href?",
    answer:
      "You can put role=\"menuitem\" on an anchor, and the APG shows navigation menubars built that way, but it comes at a real cost: the role overrides the implicit link role, so assistive technology announces \"menu item\" instead of \"link\". The element disappears from the screen reader's list of links, and users lose the cue that activating it will leave the page. Right-click, middle-click, and open-in-new-tab still work in the browser but are no longer advertised. For a dropdown of destinations, the better answer is not to use the menu pattern at all — use a disclosure button revealing a plain <ul> of links, so every link stays a link.",
  },
  {
    question: "How does focus work inside an ARIA menu?",
    answer:
      "A menu is a composite widget: the whole menu is one stop in the page tab sequence, and the arrow keys move between items inside it. The standard technique is roving tabindex. Exactly one item has tabindex=\"0\" and every other item has tabindex=\"-1\"; when the user presses Down, you set the current item to tabindex=\"-1\", set the next item to tabindex=\"0\", and call focus() on it. Real DOM focus genuinely moves, which is the opposite of a combobox, where focus stays in the input and aria-activedescendant marks the active option. Opening the menu should move focus to the first item, and closing it with Escape must return focus to the button that opened it.",
  },
  {
    question: "Why does Tab close the menu instead of moving to the next item?",
    answer:
      "Because a menu is designed to be a single tab stop. Inside the menu, the arrow keys are the navigation mechanism, so Tab is free to mean what it means everywhere else on the page: leave this widget. In a menu opened from a menu button, pressing Tab closes the menu and moves focus onward through the normal tab sequence. This is also what keeps you clear of WCAG 2.1.2 No Keyboard Trap — a keyboard user always has two ways out, Escape to dismiss and return to the button, or Tab to move past. If Tab moved item to item, a ten-item menu would put ten stops in the tab order of every page it appears on.",
  },
  {
    question: "How do I add checkable options, like a sort order or a set of toggles?",
    answer:
      "Use role=\"menuitemcheckbox\" for independent toggles and role=\"menuitemradio\" for a set where exactly one option applies, and put aria-checked=\"true\" or \"false\" on each. Wrap a radio set in an element with role=\"group\" and give the group an accessible name with aria-label or aria-labelledby, so a screen reader announces the group's purpose before reading the options. Both roles behave like menu items for keyboard purposes — arrow keys move between them and Enter or Space activates — but activating a checkbox item toggles aria-checked rather than closing the menu, while a radio item sets itself to true and clears its siblings.",
  },
  {
    question: "Should I build a menu from scratch or use a library?",
    answer:
      "Build one by hand to understand the mechanics, then ship a library. The menu pattern has more moving parts than it first appears: roving tabindex, focus return on close, Escape and Tab handling, click-outside dismissal, first-character typeahead, checkable items, positioning that stays on screen, and submenu timing if you have submenus. Radix UI's DropdownMenu, React Aria's useMenu, and Headless UI's Menu all implement the pattern correctly, handle the positioning edge cases, and track changes in ARIA guidance. Note what they give you before you choose: if your dropdown is really navigation, most of these libraries also ship a disclosure or popover primitive that is the better fit.",
  },
]

const keyboardRows = [
  {
    key: "Enter / Space (on the button)",
    action:
      "Opens the menu and moves focus to the first menu item. This is the primary way the menu opens.",
  },
  {
    key: "Down Arrow (on the button)",
    action:
      "Opens the menu and moves focus to the first item. Up Arrow opens it and moves focus to the last item.",
  },
  {
    key: "Down / Up Arrow (in the menu)",
    action:
      "Moves focus to the next / previous menu item. Wrapping from last to first is optional but recommended.",
  },
  {
    key: "Home / End",
    action: "Moves focus to the first / last menu item.",
  },
  {
    key: "Escape",
    action:
      "Closes the menu and returns focus to the button that opened it. Required — this is the user's way out.",
  },
  {
    key: "Enter / Space (on an item)",
    action:
      "Activates the item. A plain menu item runs its action and closes the menu; a checkbox item toggles aria-checked.",
  },
  {
    key: "Tab",
    action:
      "Closes the menu and moves focus to the next element in the page tab sequence. The menu is a single tab stop.",
  },
  {
    key: "Printable characters",
    action:
      "Optional typeahead: moves focus to the next item whose label starts with that character. Valuable in long menus.",
  },
  {
    key: "Left / Right Arrow",
    action:
      "In a horizontal menubar, moves between top-level menus. In a vertical menu with submenus, opens and closes them.",
  },
]

const attributeRows = [
  {
    element: "The trigger button",
    role: "<button> (no role needed)",
    attrs:
      'aria-haspopup="menu", aria-expanded="true|false", aria-controls="<menu-id>". Has a visible label or an accessible name via aria-label.',
  },
  {
    element: "The popup container",
    role: 'role="menu"',
    attrs:
      'A unique id matching the button\'s aria-controls, and aria-labelledby pointing at the button so the menu is named. Hidden when collapsed.',
  },
  {
    element: "A command item",
    role: 'role="menuitem"',
    attrs:
      'tabindex="0" on the one active item, tabindex="-1" on the rest (roving tabindex). Contains the visible item label.',
  },
  {
    element: "A toggle item",
    role: 'role="menuitemcheckbox"',
    attrs:
      'aria-checked="true|false", toggled on activation. Use for independent on/off options that do not close the menu.',
  },
  {
    element: "A one-of-many item",
    role: 'role="menuitemradio"',
    attrs:
      'aria-checked="true|false", with only one true per group. Wrap the set in role="group" with an accessible name.',
  },
  {
    element: "A visual divider",
    role: 'role="separator"',
    attrs:
      "Groups items visually and semantically. Not focusable, and skipped by arrow-key navigation.",
  },
]

const antiPatterns = [
  {
    bad: 'role="menubar" and role="menuitem" on the site navigation.',
    why: "The roles override link semantics, so items are announced as menu items, vanish from the links list, and no longer signal that they navigate (1.3.1, 4.1.2).",
    fix: "Use <nav> with a <ul> of plain <a> links, and a disclosure button for any dropdown.",
  },
  {
    bad: 'role="menu" on a container with a search field, a heading, or paragraphs inside.',
    why: "A menu may only contain menu items, groups, and separators; other content is not reliably reachable or announced (1.3.1).",
    fix: "Use a non-menu popover or disclosure for mixed content, and keep role=\"menu\" for pure item lists.",
  },
  {
    bad: "Every menu item is in the tab sequence.",
    why: "A ten-item menu adds ten tab stops to the page, and the composite-widget keyboard model is lost (2.4.3).",
    fix: 'Use roving tabindex: one item at tabindex="0", the rest at tabindex="-1", arrow keys move focus.',
  },
  {
    bad: "Escape does not close the menu, or focus is left stranded when it does.",
    why: "The keyboard user has no reliable way out and can be trapped inside the widget (2.1.2, 2.4.3).",
    fix: "Escape closes the menu and returns focus to the trigger button, every time.",
  },
  {
    bad: "The button has no aria-expanded, or it never updates.",
    why: "Assistive technology cannot tell whether the menu is open, so the user does not know the content appeared (4.1.2).",
    fix: "Toggle aria-expanded on the button itself between true and false on every open and close.",
  },
  {
    bad: "The menu opens on hover only.",
    why: "Keyboard users cannot open it at all, and touch users get an unreliable tap-then-hover interaction (2.1.1).",
    fix: "Make click and Enter/Space open the menu. Treat hover as an enhancement, never the only trigger.",
  },
  {
    bad: "Focus stays on the button after the menu opens.",
    why: "Arrow keys appear to do nothing and a screen reader user is never taken to the items (2.4.3).",
    fix: "Move focus to the first menu item on open, and back to the button on close.",
  },
]

export default function AccessibleMenuGuidePage() {
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
                    Accessible Menu
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
                Accessible Menu &amp; Menu Button Guide
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Most dropdowns on the web should not use{" "}
                <code>role=&quot;menu&quot;</code> at all. This guide covers when
                the WAI-ARIA Menu pattern actually applies, the menu button
                built from <code>aria-haspopup</code> and{" "}
                <code>aria-expanded</code>, the roving-tabindex focus model, and
                the disclosure pattern your navigation dropdown should use
                instead — with copy-ready HTML, JavaScript, and React mapped to
                WCAG 2.2.
              </p>
            </div>
          </section>

          {/* What & why */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                The Most Over-Applied Role in ARIA
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Search for &ldquo;accessible dropdown menu&rdquo; and most of
                  what you find will tell you to add{" "}
                  <code>role=&quot;menu&quot;</code> and{" "}
                  <code>role=&quot;menuitem&quot;</code> to your navigation. That
                  advice is a decade old, it came from CSS framework
                  documentation rather than the specification, and following it
                  makes your navigation measurably worse for screen reader users
                  than plain, unstyled HTML would have been.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The ARIA menu roles model an{" "}
                  <strong className="text-slate-900 dark:text-white">
                    application menu
                  </strong>
                  : the File, Edit, and View menus at the top of a desktop
                  program, where each item runs a command inside the app you are
                  already in. They come with a specific contract — the menu is a
                  single stop in the tab order, arrow keys move between items,
                  and items are commands, not destinations. A site navigation bar
                  breaks every part of that contract. Its items are links to
                  other pages, and &ldquo;link&rdquo; is precisely the
                  information a screen reader user needs to hear.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  So this guide does two things. It teaches the real menu pattern
                  properly — the menu button, roving tabindex, checkable items,
                  and the keyboard model defined by the{" "}
                  <a
                    href="https://www.w3.org/WAI/ARIA/apg/patterns/menubar/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    WAI-ARIA Authoring Practices Menu and Menubar pattern
                  </a>{" "}
                  — because when you need a genuine command menu, you need to get
                  it right. And it shows you the much simpler pattern to use for
                  the case you probably actually have, which is a dropdown full
                  of links.
                </p>
                <div className="rounded-lg border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 p-5 my-6">
                  <p className="text-sm text-slate-800 dark:text-amber-100 leading-relaxed flex gap-3">
                    <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
                    <span>
                      <strong>
                        The one-sentence test: are the items commands or
                        destinations?
                      </strong>{" "}
                      Commands that act on the current page — Duplicate, Delete,
                      Sort by date — are a menu. Destinations that navigate
                      somewhere else are links, and they belong in a{" "}
                      <code>&lt;nav&gt;</code> with a{" "}
                      <Link
                        href="/guides/accessible-accordion"
                        className="underline font-medium"
                      >
                        disclosure button
                      </Link>{" "}
                      if they need to be hidden behind a toggle.
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
                The WCAG 2.2 Criteria a Menu Must Satisfy
              </h2>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    WCAG 2.2 success criteria that a correctly built menu or menu
                    button satisfies and what each requires
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
                        What the menu must do
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
                      <td className="px-4 py-3">Items are exposed with the role that matches what they do — menu items for commands, links for destinations.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-1-1" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.1.1 Keyboard
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Open, move through items, activate, and close — all from the keyboard, never hover-only.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-1-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.1.2 No Keyboard Trap
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Escape dismisses the menu and Tab moves past it, so focus is never stuck inside.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-4-3" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.4.3 Focus Order
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">Focus moves into the menu on open and returns to the trigger button on close.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-4-7" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.4.7 Focus Visible
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">The focused menu item has a clearly visible indicator, not just a faint hover tint.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/2-5-8" className="text-blue-600 dark:text-blue-400 hover:underline">
                          2.5.8 Target Size (Minimum)
                        </Link>
                      </th>
                      <td className="px-4 py-3">AA</td>
                      <td className="px-4 py-3">Menu items are at least 24 by 24 CSS pixels, or spaced so their targets do not overlap.</td>
                    </tr>
                    <tr>
                      <th scope="row" className="px-4 py-3 font-medium">
                        <Link href="/wcag/4-1-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                          4.1.2 Name, Role, Value
                        </Link>
                      </th>
                      <td className="px-4 py-3">A</td>
                      <td className="px-4 py-3">The button exposes its expanded state and popup type; checkable items expose <code>aria-checked</code>.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Decision */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <GitBranch className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                1. First, Decide: Menu, Disclosure, or Plain List?
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Three different patterns produce a button that reveals a
                dropdown. Picking the wrong one is the root cause of nearly every
                broken menu, so make this decision before you write a line of
                markup.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">ARIA menu button</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      The items are{" "}
                      <strong className="text-slate-900 dark:text-white">
                        commands
                      </strong>{" "}
                      acting on the current view — Duplicate, Export, Delete, Sort
                      by name. Single tab stop, arrow-key navigation,{" "}
                      <code>role=&quot;menu&quot;</code>. This is the pattern the
                      rest of this guide builds.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Disclosure button</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      The dropdown holds{" "}
                      <strong className="text-slate-900 dark:text-white">
                        links or mixed content
                      </strong>{" "}
                      — a navigation submenu, a filter panel, an account menu with
                      a heading. Just <code>aria-expanded</code> on a button, and
                      Tab keeps working normally.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">No dropdown at all</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Fewer than about five destinations that fit on screen? Show
                      them. A visible <code>&lt;nav&gt;</code> with a{" "}
                      <code>&lt;ul&gt;</code> of links needs no JavaScript, no
                      ARIA, and no focus management, and it is faster for
                      everyone.
                    </p>
                  </CardContent>
                </Card>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                The decision resembles the one between{" "}
                <Link href="/guides/accessible-tabs" className="text-blue-600 dark:text-blue-400 hover:underline">
                  tabs
                </Link>{" "}
                and an{" "}
                <Link href="/guides/accessible-accordion" className="text-blue-600 dark:text-blue-400 hover:underline">
                  accordion
                </Link>
                : the pattern you choose is a promise about how the keyboard will
                behave. Choose the one whose promise matches what your component
                actually is, then keep that promise exactly.
              </p>
            </div>
          </section>

          {/* Anatomy */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Layers className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                2. Anatomy: The Roles, States, and Properties
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                A menu button is two elements that reference each other: a real{" "}
                <code>&lt;button&gt;</code> that announces it owns a popup, and a
                container with <code>role=&quot;menu&quot;</code> that holds the
                items. One rule constrains everything else — a{" "}
                <code>role=&quot;menu&quot;</code> may only contain menu items,
                groups, and separators. Any other content you put inside is not
                reliably reachable.
              </p>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    The elements in an ARIA menu button and the roles and
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
              <p className="text-muted-foreground leading-relaxed mt-6">
                Two clarifications that trip people up.{" "}
                <code>aria-haspopup=&quot;true&quot;</code> is treated as
                identical to <code>aria-haspopup=&quot;menu&quot;</code>, so both
                are correct, but writing <code>menu</code> explicitly is clearer.
                And <code>role=&quot;menubar&quot;</code> is not a different
                widget — it is a menu laid out horizontally as a persistently
                visible bar of menu buttons, and it swaps the arrow-key axis so
                Left and Right move between top-level items. For how each role
                and state is exposed to assistive technology, see the{" "}
                <Link href="/reference/aria" className="text-blue-600 dark:text-blue-400 hover:underline">
                  ARIA roles &amp; attributes reference
                </Link>
                .
              </p>
            </div>
          </section>

          {/* Roving tabindex */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <MousePointerClick className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                3. Roving Tabindex: How Focus Moves Inside a Menu
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                A menu is a composite widget, which means the entire menu
                occupies{" "}
                <strong className="text-slate-900 dark:text-white">
                  one stop
                </strong>{" "}
                in the page tab sequence and the arrow keys move within it. The
                technique that delivers this is roving tabindex, and the menu is
                its canonical example.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Roving tabindex (menus, tabs)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Real DOM focus moves. Exactly one item has{" "}
                      <code>tabindex=&#123;0&#125;</code>; the rest have{" "}
                      <code>tabindex=&#123;-1&#125;</code>. On Down, you flip the
                      old item to <code>-1</code>, the new item to{" "}
                      <code>0</code>, and call <code>focus()</code> on it.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Virtual focus (combobox)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Focus never leaves the input;{" "}
                      <Link href="/guides/accessible-combobox" className="text-blue-600 dark:text-blue-400 hover:underline">
                        <code>aria-activedescendant</code>
                      </Link>{" "}
                      points at the active option&apos;s id. Used when the user
                      must keep typing — which a menu never requires.
                    </p>
                  </CardContent>
                </Card>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Menus use roving tabindex because there is no text field to
                protect: moving real focus is simpler, and it means{" "}
                <code>document.activeElement</code> always tells you the truth
                about where the user is. The consequence to remember is that{" "}
                <code>tabindex=&quot;-1&quot;</code> makes an element focusable
                by script but skipped by Tab — that is the whole trick.{" "}
                <Link href="/guides/focus-management" className="text-blue-600 dark:text-blue-400 hover:underline">
                  The focus management guide
                </Link>{" "}
                covers the technique in depth, including focus restoration, which
                a menu depends on when it closes.
              </p>
            </div>
          </section>

          {/* Full HTML markup */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Code2 className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                4. The Menu Button: Complete Conformant HTML
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Here is a full menu button in its open state, with the first item
                holding the roving <code>tabindex</code>. Note that the menu is
                named by the button through <code>aria-labelledby</code>, so a
                screen reader announces &ldquo;Actions menu&rdquo; rather than an
                anonymous list.
              </p>
              <pre className="overflow-x-auto rounded-lg bg-slate-900 dark:bg-slate-950 border border-slate-800 p-4 text-sm text-slate-100"><code>{`<button
  id="actions-button"
  aria-haspopup="menu"
  aria-expanded="true"
  aria-controls="actions-menu"
>
  Actions
</button>

<ul
  id="actions-menu"
  role="menu"
  aria-labelledby="actions-button"
>
  <li role="menuitem" tabindex="0">Duplicate</li>
  <li role="menuitem" tabindex="-1">Export as CSV</li>
  <li role="separator"></li>
  <li role="menuitem" tabindex="-1">Delete</li>
</ul>`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-4 mb-4">
                When the menu is closed, set{" "}
                <code>aria-expanded=&quot;false&quot;</code> on the button and
                hide the list with the <code>hidden</code> attribute or{" "}
                <code>display: none</code>. Do not hide it with{" "}
                <code>opacity: 0</code> or by moving it off screen — those leave
                the items focusable and reachable by a screen reader while
                invisible on screen.
              </p>
              <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-5 my-6">
                <p className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  Why <code>&lt;li role=&quot;menuitem&quot;&gt;</code> and not{" "}
                  <code>&lt;button&gt;</code>?
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Both work, and the APG uses both. The reason to prefer a
                  non-interactive element carrying the role is that{" "}
                  <code>role=&quot;menuitem&quot;</code> on a{" "}
                  <code>&lt;button&gt;</code> replaces the button role anyway, so
                  you gain nothing but keep the browser&apos;s default button
                  behaviors to fight. What you must not lose is the keyboard
                  handling: with a plain <code>&lt;li&gt;</code> you own Enter and
                  Space activation yourself. If you would rather inherit that for
                  free, use <code>&lt;button role=&quot;menuitem&quot;&gt;</code>{" "}
                  and strip its styling. Also note the{" "}
                  <code>&lt;ul&gt;</code> loses its list semantics once it
                  carries <code>role=&quot;menu&quot;</code>, which is expected —
                  a menu is not announced as a list.
                </p>
              </div>
            </div>
          </section>

          {/* Keyboard */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Keyboard className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                5. The Keyboard Model You Must Implement
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Choosing <code>role=&quot;menu&quot;</code> is a promise that
                these keys work. Users of screen readers and keyboard-only users
                recognise the pattern from operating-system menus and will expect
                every row of this table.
              </p>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    Keyboard commands a conformant menu button and menu must
                    support
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
                The two rows people skip are Escape and Tab, and they are the two
                that keep you clear of{" "}
                <Link href="/wcag/2-1-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                  2.1.2 No Keyboard Trap
                </Link>
                . A user must always have a way out of an open menu without
                activating anything in it. For the broader keyboard contract every
                custom widget owes, see the{" "}
                <Link href="/guides/keyboard-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">
                  keyboard accessibility guide
                </Link>
                .
              </p>
            </div>
          </section>

          {/* JavaScript */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Code2 className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                6. The JavaScript: Open, Move, Activate, Close
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The whole implementation comes down to four functions. Keep one
                source of truth for the open state so{" "}
                <code>aria-expanded</code>, the <code>hidden</code> attribute,
                and focus can never disagree.
              </p>
              <pre className="overflow-x-auto rounded-lg bg-slate-900 dark:bg-slate-950 border border-slate-800 p-4 text-sm text-slate-100"><code>{`const button = document.querySelector("#actions-button")
const menu = document.querySelector("#actions-menu")
const items = Array.from(menu.querySelectorAll('[role="menuitem"]'))

function openMenu(focusLast = false) {
  menu.hidden = false
  button.setAttribute("aria-expanded", "true")
  focusItem(focusLast ? items.length - 1 : 0)
}

function closeMenu(returnFocus = true) {
  menu.hidden = true
  button.setAttribute("aria-expanded", "false")
  // Focus restoration is not optional - without it the user is stranded.
  if (returnFocus) button.focus()
}

// Roving tabindex: exactly one item is tabbable at a time.
function focusItem(index) {
  items.forEach((item, i) => {
    item.tabIndex = i === index ? 0 : -1
  })
  items[index].focus()
}

button.addEventListener("click", () => {
  const isOpen = button.getAttribute("aria-expanded") === "true"
  isOpen ? closeMenu() : openMenu()
})

button.addEventListener("keydown", (event) => {
  if (event.key === "ArrowDown") { event.preventDefault(); openMenu() }
  if (event.key === "ArrowUp") { event.preventDefault(); openMenu(true) }
})

menu.addEventListener("keydown", (event) => {
  const current = items.indexOf(document.activeElement)

  switch (event.key) {
    case "ArrowDown":
      event.preventDefault()
      focusItem((current + 1) % items.length)
      break
    case "ArrowUp":
      event.preventDefault()
      focusItem((current - 1 + items.length) % items.length)
      break
    case "Home":
      event.preventDefault()
      focusItem(0)
      break
    case "End":
      event.preventDefault()
      focusItem(items.length - 1)
      break
    case "Escape":
      closeMenu()
      break
    case "Tab":
      // Let Tab do its normal thing, but do not restore focus to the button.
      closeMenu(false)
      break
    case "Enter":
    case " ":
      event.preventDefault()
      document.activeElement.click()
      closeMenu()
      break
  }
})

// Clicking outside closes the menu without stealing focus back.
document.addEventListener("pointerdown", (event) => {
  if (!menu.contains(event.target) && event.target !== button) {
    closeMenu(false)
  }
})`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Three details in that code are load-bearing.{" "}
                <code>preventDefault()</code> on the arrow keys stops the page
                from scrolling underneath the open menu. Escape restores focus to
                the button, but Tab deliberately does not, because Tab is already
                moving focus onward and pulling it back would fight the user.
                And <code>focusItem</code> updates{" "}
                <code>tabIndex</code> on every item before calling{" "}
                <code>focus()</code>, so the menu always exposes exactly one tab
                stop no matter where the user left it.
              </p>
            </div>
          </section>

          {/* Checkable items */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <ListChecks className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                7. Checkable Items: Toggles and One-of-Many Choices
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Menus frequently carry state — a sort order, a set of visible
                columns, a density setting. ARIA has two roles for this, and the
                distinction is the same as between an HTML checkbox and a radio
                group.
              </p>
              <pre className="overflow-x-auto rounded-lg bg-slate-900 dark:bg-slate-950 border border-slate-800 p-4 text-sm text-slate-100"><code>{`<ul id="view-menu" role="menu" aria-labelledby="view-button">
  <!-- Independent toggles: any combination may be checked. -->
  <li role="menuitemcheckbox" aria-checked="true" tabindex="0">
    Show archived
  </li>
  <li role="menuitemcheckbox" aria-checked="false" tabindex="-1">
    Show drafts
  </li>

  <li role="separator"></li>

  <!-- One-of-many: the group needs its own accessible name. -->
  <li role="group" aria-label="Sort by">
    <ul role="none">
      <li role="menuitemradio" aria-checked="true" tabindex="-1">Date</li>
      <li role="menuitemradio" aria-checked="false" tabindex="-1">Name</li>
      <li role="menuitemradio" aria-checked="false" tabindex="-1">Size</li>
    </ul>
  </li>
</ul>`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Activating a <code>menuitemcheckbox</code> flips its{" "}
                <code>aria-checked</code> and, by convention, leaves the menu
                open so the user can set several options at once. Activating a{" "}
                <code>menuitemradio</code> sets it to <code>true</code>, sets its
                siblings to <code>false</code>, and usually closes the menu since
                the choice is complete. Never convey the checked state with a tick
                icon alone — the icon is invisible to a screen reader, and{" "}
                <code>aria-checked</code> is what actually gets announced. The{" "}
                <code>role=&quot;none&quot;</code> on the inner list removes its
                list semantics so it does not interrupt the menu structure.
              </p>
            </div>
          </section>

          {/* Navigation disclosure */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Navigation className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                8. The Right Way to Build a Navigation Dropdown
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                This is the section most readers actually need. If your dropdown
                contains links to other pages, do not use any of the markup
                above. Use a disclosure button and leave the links as links —
                it is less code, and it is more accessible.
              </p>
              <pre className="overflow-x-auto rounded-lg bg-slate-900 dark:bg-slate-950 border border-slate-800 p-4 text-sm text-slate-100"><code>{`<nav aria-label="Main">
  <ul>
    <li><a href="/pricing">Pricing</a></li>
    <li>
      <button aria-expanded="false" aria-controls="resources-submenu">
        Resources
      </button>
      <ul id="resources-submenu" hidden>
        <li><a href="/guides">Guides</a></li>
        <li><a href="/checklists">Checklists</a></li>
        <li><a href="/tools">Tools</a></li>
      </ul>
    </li>
    <li><a href="/contact">Contact</a></li>
  </ul>
</nav>`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-4 mb-4">
                Count what you get for free. Every link is still announced as a
                link and still appears in the screen reader&apos;s links list. The
                surrounding <code>&lt;ul&gt;</code> still reports its item count.
                Tab moves through the revealed links in the obvious way, with no
                roving tabindex to maintain. There is no focus to move on open and
                none to restore on close. The entire JavaScript requirement is
                toggling <code>aria-expanded</code> and the{" "}
                <code>hidden</code> attribute, plus closing on Escape as a
                courtesy.
              </p>
              <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-5 my-6">
                <p className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  Finishing touches for a navigation disclosure
                </p>
                <ul className="text-sm text-muted-foreground leading-relaxed space-y-1 list-disc pl-5">
                  <li>Name the landmark with <code>aria-label</code> if the page has more than one <code>&lt;nav&gt;</code>, so users can tell them apart.</li>
                  <li>Mark the current page with <code>aria-current=&quot;page&quot;</code> on its link.</li>
                  <li>Close the open submenu on Escape and return focus to its toggle button.</li>
                  <li>Never open on hover alone; if you add hover, keep click and Enter working identically.</li>
                  <li>Make sure the toggle is a real <code>&lt;button&gt;</code>, not a <code>&lt;div&gt;</code> or an <code>&lt;a href=&quot;#&quot;&gt;</code>.</li>
                </ul>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                This is the same disclosure mechanic covered in depth by the{" "}
                <Link href="/guides/accessible-accordion" className="text-blue-600 dark:text-blue-400 hover:underline">
                  accordion and disclosure guide
                </Link>{" "}
                — one button, one <code>aria-expanded</code>, one hidden region.
                Navigation is simply its most common application.
              </p>
            </div>
          </section>

          {/* React */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Code2 className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                9. Menus in React
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                React changes nothing about the roles or the keyboard model, but
                it does change where the hard parts live. Focus has to be moved
                imperatively through refs after render, and the menu must be
                positioned so it never opens off screen. Here is the shape of a
                hand-rolled version:
              </p>
              <pre className="overflow-x-auto rounded-lg bg-slate-900 dark:bg-slate-950 border border-slate-800 p-4 text-sm text-slate-100"><code>{`function ActionsMenu({ items }) {
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const buttonRef = useRef(null)
  const itemRefs = useRef([])
  const menuId = useId()

  // Move real DOM focus whenever the active item changes.
  useEffect(() => {
    if (open) itemRefs.current[activeIndex]?.focus()
  }, [open, activeIndex])

  function close({ returnFocus = true } = {}) {
    setOpen(false)
    if (returnFocus) buttonRef.current?.focus()
  }

  function onMenuKeyDown(event) {
    if (event.key === "ArrowDown") {
      event.preventDefault()
      setActiveIndex((i) => (i + 1) % items.length)
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      setActiveIndex((i) => (i - 1 + items.length) % items.length)
    } else if (event.key === "Escape") {
      close()
    } else if (event.key === "Tab") {
      close({ returnFocus: false })
    }
  }

  return (
    <>
      <button
        ref={buttonRef}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => { setActiveIndex(0); setOpen((o) => !o) }}
      >
        Actions
      </button>

      {open && (
        <ul id={menuId} role="menu" onKeyDown={onMenuKeyDown}>
          {items.map((item, i) => (
            <li
              key={item.id}
              role="menuitem"
              ref={(el) => { itemRefs.current[i] = el }}
              tabIndex={i === activeIndex ? 0 : -1}
              onClick={() => { item.onSelect(); close() }}
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </>
  )
}`}</code></pre>
              <p className="text-muted-foreground leading-relaxed mt-4">
                That covers the mechanics, but it is not what you should ship.
                Production menus also need collision-aware positioning, portal
                rendering so the menu escapes <code>overflow: hidden</code>,
                click-outside handling, typeahead, and submenu timing.{" "}
                <a
                  href="https://www.radix-ui.com/primitives/docs/components/dropdown-menu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Radix DropdownMenu
                </a>
                , React Aria&apos;s <code>useMenu</code>, and Headless UI&apos;s{" "}
                <code>Menu</code> all implement the full pattern and keep pace
                with ARIA guidance. See the{" "}
                <Link href="/guides/react-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">
                  React accessibility guide
                </Link>{" "}
                for how these primitives fit into a component library, and the{" "}
                <Link href="/guides/vue-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Vue
                </Link>{" "}
                and{" "}
                <Link href="/guides/angular-accessibility" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Angular
                </Link>{" "}
                guides for their equivalents — Angular&apos;s{" "}
                <code>FocusKeyManager</code> in particular exists to implement
                exactly this roving-tabindex behavior.
              </p>
            </div>
          </section>

          {/* Submenus */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                10. Submenus, and Why to Think Twice
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                A submenu is a menu item that opens another menu. The markup is
                predictable — the parent item takes{" "}
                <code>aria-haspopup=&quot;menu&quot;</code> and{" "}
                <code>aria-expanded</code>, exactly like the trigger button, and
                owns a nested <code>role=&quot;menu&quot;</code>. Right Arrow
                opens the submenu and focuses its first item; Left Arrow closes it
                and returns focus to the parent item; Escape closes the whole
                chain.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The reason to hesitate is not the ARIA — it is everything around
                it. Submenus that open on hover need a forgiving delay so the
                pointer can travel diagonally without the menu snapping shut,
                which is difficult to tune and hostile to users with motor
                impairments. On touch screens there is no hover at all, so the
                interaction has to be redesigned. And nested menus quickly exceed
                the viewport, colliding with{" "}
                <Link href="/wcag/2-5-8" className="text-blue-600 dark:text-blue-400 hover:underline">
                  2.5.8 Target Size
                </Link>{" "}
                and reflow requirements on small screens.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Before adding a level, ask whether a flat menu with{" "}
                <code>role=&quot;separator&quot;</code> groups would carry the
                same information. It usually does, it is far easier to operate
                with a keyboard or a screen reader, and it removes an entire class
                of pointer-timing bugs. When you do need submenus, use a library
                — this is the part of the pattern that is genuinely hard to get
                right by hand.
              </p>
            </div>
          </section>

          {/* Testing */}
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <Keyboard className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                How to Test an Accessible Menu
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Automated tools catch a missing <code>aria-expanded</code> or an{" "}
                <code>aria-controls</code> that points at nothing. Everything that
                actually matters about a menu — where focus goes, whether you can
                escape — needs six minutes of manual testing.
              </p>
              <ol className="space-y-4 text-muted-foreground leading-relaxed list-decimal pl-6">
                <li>
                  <strong className="text-slate-900 dark:text-white">Put the mouse away.</strong>{" "}
                  Tab to the button, press Enter, and confirm the menu opens{" "}
                  <em>and</em> that focus lands on the first item.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Arrow through every item.</strong>{" "}
                  Focus should move visibly, wrap or stop consistently, and never
                  scroll the page behind the menu.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Press Escape.</strong>{" "}
                  The menu closes and focus is back on the button — not on{" "}
                  <code>&lt;body&gt;</code>, and not at the top of the page.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Press Tab from inside.</strong>{" "}
                  The menu closes and focus continues to the next element after
                  the button. Tab should never step through items one by one.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Count the tab stops.</strong>{" "}
                  With the menu closed, Tab past it. The whole component should
                  cost exactly one stop.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Listen with a screen reader.</strong>{" "}
                  You should hear the button&apos;s name, &ldquo;menu
                  pop-up,&rdquo; the collapsed or expanded state, and then each
                  item with its position. Use the{" "}
                  <Link href="/guides/screen-reader-testing" className="text-blue-600 dark:text-blue-400 hover:underline">
                    screen reader testing guide
                  </Link>{" "}
                  for the commands.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Check the links list.</strong>{" "}
                  If the dropdown holds navigation, open the screen reader&apos;s
                  links list. Missing entries mean{" "}
                  <code>role=&quot;menuitem&quot;</code> has eaten your link
                  semantics.
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
                .
              </p>
            </div>
          </section>

          {/* Anti-patterns */}
          <section className="py-10 px-4 sm:px-6 bg-slate-50 dark:bg-slate-900/40">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                Common Menu Mistakes &amp; How to Fix Them
              </h2>
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                <table className="w-full text-sm text-left">
                  <caption className="sr-only">
                    Common accessible-menu anti-patterns, why they fail, and the
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
          <section className="py-10 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                <ListChecks className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                Accessible Menu Checklist
              </h2>
              <ol className="space-y-4 text-muted-foreground leading-relaxed list-decimal pl-6">
                <li>
                  <strong className="text-slate-900 dark:text-white">Right pattern.</strong>{" "}
                  The items are commands, not links. If they navigate, it is a
                  disclosure with a <code>&lt;nav&gt;</code> of links instead.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Real button.</strong>{" "}
                  A native <code>&lt;button&gt;</code> with{" "}
                  <code>aria-haspopup=&quot;menu&quot;</code>,{" "}
                  <code>aria-expanded</code> that updates, and{" "}
                  <code>aria-controls</code>.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Clean menu contents.</strong>{" "}
                  <code>role=&quot;menu&quot;</code> holds only menu items,
                  groups, and separators — no headings, forms, or prose.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">One tab stop.</strong>{" "}
                  Roving <code>tabindex</code> — one item at <code>0</code>, the
                  rest at <code>-1</code> — with arrow keys moving focus.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Focus moves and returns.</strong>{" "}
                  Opening focuses the first item; Escape closes and restores focus
                  to the button.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Tab escapes.</strong>{" "}
                  Tab closes the menu and continues through the page, satisfying{" "}
                  <Link href="/wcag/2-1-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                    2.1.2
                  </Link>
                  .
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">State is announced.</strong>{" "}
                  Checkable items carry <code>aria-checked</code>, never a tick
                  icon alone.
                </li>
                <li>
                  <strong className="text-slate-900 dark:text-white">Visible focus, adequate targets.</strong>{" "}
                  A clear focus indicator on the active item, and items at least
                  24 by 24 CSS pixels (
                  <Link href="/wcag/2-5-8" className="text-blue-600 dark:text-blue-400 hover:underline">
                    2.5.8
                  </Link>
                  ).
                </li>
              </ol>
              <p className="text-muted-foreground leading-relaxed mt-6">
                Work through the full{" "}
                <Link href="/checklists/wcag-2-2" className="text-blue-600 dark:text-blue-400 hover:underline">
                  WCAG 2.2 checklist
                </Link>{" "}
                to see the menu in the context of every other requirement.
              </p>
            </div>
          </section>

          {/* CTA */}
          <section className="py-12 px-4 sm:px-6">
            <div className="container mx-auto max-w-4xl">
              <div className="rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/20 p-8 text-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  Check Your Menus on a Live Page
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6 max-w-lg mx-auto">
                  Scan any page with our free axe-core-powered auditor to catch a
                  missing <code>aria-expanded</code>, a broken{" "}
                  <code>aria-controls</code> target, or a{" "}
                  <code>role=&quot;menu&quot;</code> full of content that does not
                  belong in one — then run the seven-step keyboard pass above.
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
                content="accessible menu menu button dropdown role menu menuitem menubar aria-haspopup aria-expanded roving tabindex menuitemcheckbox menuitemradio navigation disclosure keyboard accessibility focus management escape key react menu screen reader wcag 4.1.2 2.1.1 2.1.2 aria pattern tabs accordion combobox"
                title="Related Guides & Tools"
                maxItems={6}
                showDescriptions={true}
                excludeUrl="/guides/accessible-menu"
              />
            </div>
          </section>
        </article>
      </div>
    </>
  )
}
