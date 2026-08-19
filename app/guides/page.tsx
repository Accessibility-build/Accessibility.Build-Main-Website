import type { Metadata } from "next"
import Link from "next/link"
import { BreadcrumbStructuredData } from "@/components/seo/structured-data"
import { RelatedContent } from "@/components/seo/related-content"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Keyboard,
  Focus,
  AudioLines,
  Ear,
  Smartphone,
  ArrowRight,
  Code2,
  Clock,
  Signal,
  FormInput,
  Palette,
  Search,
  Sparkles,
  Scale,
  HeartPulse,
  Gavel,
  DollarSign,
  Bot,
  ArrowLeftRight,
  ListChecks,
  Layers,
  FileText,
  GitCompareArrows,
  TestTubes,
  Braces,
  Component,
  ListCollapse,
  AppWindow,
  PanelTop,
  TextSearch,
  SquareMenu,
  ToggleRight,
  SlidersHorizontal,
  ListTree,
  Grid3x3,
  List,
  ShieldAlert,
  BarChart3,
  Captions,
  Flame,
  TabletSmartphone,
  MessagesSquare,
  Brain,
  Accessibility,
  Table,
  SkipForward,
  Mail,
  MapPinned,
  LayoutTemplate,
  Milestone,
  GalleryHorizontalEnd,
  MessageSquareText,
} from "lucide-react"
import { createMetadata } from "@/lib/metadata"

export const metadata: Metadata = {
  ...createMetadata({
    title: "Accessibility Guides & Interactive References",
    path: "/guides",
    description:
      "In-depth, interactive guides for web accessibility. Keyboard accessibility, screen reader testing, and more with live demos and downloadable checklists.",
    keywords: [
      "accessibility guides",
      "keyboard accessibility guide",
      "screen reader guide",
      "accessibility reference",
      "wcag implementation guides",
    ],
    type: "website",
  }),
}

const guides = [
  {
    title: "How to Use ARIA: Roles, States & Properties",
    description:
      "ARIA changes what a screen reader announces and nothing else, so a wrong attribute makes your interface lie to assistive technology. The cornerstone guide to using ARIA correctly: the five rules of ARIA, when native HTML wins, roles vs states vs properties, accessible names (aria-label vs aria-labelledby vs aria-describedby), landmark roles, the aria-hidden traps that break keyboard users, live regions, and the most common ARIA mistakes. Mapped to WCAG 2.2.",
    icon: Accessibility,
    difficulty: "Intermediate",
    readingTime: "24 min",
    topics: ["Five rules of ARIA", "Roles, states, properties", "aria-label vs labelledby", "aria-hidden", "Landmarks"],
    href: "/guides/using-aria",
    gradient: "from-sky-600 to-blue-700",
  },
  {
    title: "Accessible AI Chat Interfaces & Conversational UI",
    description:
      "Build accessible AI chat and chatbot interfaces: announce streaming responses without flooding the screen reader, structure the message log, keep focus in the composer, make Send, Stop, and per-message actions keyboard-operable, and render AI output as semantic HTML. Mapped to WCAG 2.2 with copy-ready React.",
    icon: MessagesSquare,
    difficulty: "Intermediate",
    readingTime: "22 min",
    topics: ["AI Chat", "Streaming", "Live Regions", "WCAG 4.1.3"],
    href: "/guides/accessible-ai-chat",
    gradient: "from-violet-600 to-fuchsia-600",
  },
  {
    title: "Fashion Nova's $5.15M Accessibility Settlement",
    description:
      "A case study of Alcazar v. Fashion Nova — the second-largest web accessibility settlement on record. The ADA and California Unruh Act claims, the class structure, WCAG 2.1 remediation terms, and what every online retailer should learn from it.",
    icon: Gavel,
    difficulty: "Beginner",
    readingTime: "10 min",
    topics: ["Case Study", "Unruh Act", "E-Commerce", "Settlements"],
    href: "/guides/fashion-nova-accessibility-settlement",
    gradient: "from-red-600 to-rose-600",
  },
  {
    title: "How Much Does an ADA Website Lawsuit Cost?",
    description:
      "A data-backed breakdown of what a web accessibility lawsuit really costs in 2026 — from $1K demand letters to a $5.15M class action — what drives the number up or down, and why proactive remediation is almost always the cheaper path.",
    icon: DollarSign,
    difficulty: "Beginner",
    readingTime: "10 min",
    topics: ["Settlement Costs", "ADA", "Risk", "ROI"],
    href: "/guides/ada-website-lawsuit-cost",
    gradient: "from-blue-600 to-cyan-600",
  },
  {
    title: "How AI Is Fueling ADA Website Lawsuits in 2026",
    description:
      "Generative AI and automated scanners have collapsed the cost of filing a web accessibility lawsuit. Why ~40% of 2025's federal cases were pro se, why 2026 is projected to top 5,500 filings, and how to protect your site from AI-assisted plaintiffs.",
    icon: Bot,
    difficulty: "Beginner",
    readingTime: "10 min",
    topics: ["AI", "Litigation Trends", "Pro Se", "2026"],
    href: "/guides/ai-accessibility-lawsuits",
    gradient: "from-purple-600 to-fuchsia-600",
  },
  {
    title: "DOJ Title II Deadline Extension",
    description:
      "Editorial analysis of the April 20, 2026 DOJ Interim Final Rule that pushed Title II web compliance to 2027 and 2028. What changed, what didn't, and why public entities should treat April 2026 as the real deadline.",
    icon: Scale,
    difficulty: "Intermediate",
    readingTime: "12 min",
    topics: ["ADA Title II", "WCAG 2.1 AA", "Public Sector", "Editorial"],
    href: "/guides/doj-title-ii-deadline-extension",
    gradient: "from-amber-600 to-red-600",
  },
  {
    title: "Section 504 Web Accessibility Deadline",
    description:
      "The HHS Section 504 web rule took effect May 11, 2026 — and was not extended. Who's covered, what WCAG 2.1 AA requires for healthcare entities, and a six-step recovery plan if you missed the deadline.",
    icon: HeartPulse,
    difficulty: "Intermediate",
    readingTime: "13 min",
    topics: ["Section 504", "Healthcare", "HHS", "WCAG 2.1 AA"],
    href: "/guides/section-504-web-accessibility-deadline",
    gradient: "from-emerald-600 to-teal-600",
  },
  {
    title: "WCAG 2.1 vs 2.2: What Changed",
    description:
      "Every difference between WCAG 2.1 and 2.2: the 9 new success criteria, the removal of 4.1.1 Parsing, a side-by-side comparison table, the legal context, and a practical migration plan from 2.1 AA to 2.2 AA.",
    icon: ArrowLeftRight,
    difficulty: "Beginner",
    readingTime: "12 min",
    topics: ["WCAG 2.2", "New Criteria", "Migration", "Comparison"],
    href: "/guides/wcag-2-1-vs-2-2",
    gradient: "from-indigo-600 to-blue-600",
  },
  {
    title: "WCAG 2.2 Level AA Requirements: Complete List",
    description:
      "What WCAG 2.2 AA conformance actually requires: all 55 Level A and AA success criteria in one checklist grouped by POUR principle, why AA is the legal standard worldwide, and how to verify conformance.",
    icon: ListChecks,
    difficulty: "Beginner",
    readingTime: "15 min",
    topics: ["WCAG 2.2 AA", "Checklist", "Conformance", "Legal Standard"],
    href: "/guides/wcag-2-2-aa-requirements",
    gradient: "from-blue-600 to-teal-600",
  },
  {
    title: "How to Audit a Website for Accessibility",
    description:
      "A nine-step process for performing a WCAG 2.2 Level AA audit on any website. Combines automated scanning, keyboard testing, screen reader review, and AI-assisted remediation, with a copy-ready checklist.",
    icon: Search,
    difficulty: "Beginner",
    readingTime: "15 min",
    topics: ["WCAG Audit", "Testing", "Remediation", "Checklist"],
    href: "/guides/how-to-audit-website-accessibility",
    gradient: "from-blue-600 to-indigo-600",
  },
  {
    title: "AI Accessibility Audit",
    description:
      "How AI-assisted audits compare to manual audits and automated scanners. Use cases for developers, QA, and compliance teams, plus a side-by-side breakdown of cost, speed, and coverage.",
    icon: Sparkles,
    difficulty: "Beginner",
    readingTime: "12 min",
    topics: ["AI Audit", "WCAG", "Automation", "Workflow"],
    href: "/guides/ai-accessibility-audit",
    gradient: "from-purple-600 to-pink-600",
  },
  {
    title: "Accessible Color Palette Guide",
    description:
      "Create WCAG-aware color systems for real UI states. Learn how to test buttons, cards, forms, alerts, links, charts, focus rings, disabled states, hover states, and dark mode before colors enter your design system.",
    icon: Palette,
    difficulty: "Beginner",
    readingTime: "20 min",
    topics: ["WCAG Contrast", "Design Tokens", "Dark Mode", "UI States"],
    href: "/guides/accessible-color-palettes",
    gradient: "from-blue-600 to-emerald-600",
  },
  {
    title: "Accessible Video & Media Players",
    description:
      "Accessible media is a stack of parallel alternatives: captions turn the audio into text, audio description turns the picture into sound, and a transcript covers everyone. Learn which alternatives your media owes (prerecorded vs live, audio vs picture), captions vs subtitles, WebVTT and the <track> element, when audio description is required, keyboard-operable players that never autoplay sound, embedded YouTube/Vimeo, and React.",
    icon: Captions,
    difficulty: "Intermediate",
    readingTime: "24 min",
    topics: ["Captions vs subtitles", "Transcripts", "Audio description", "WebVTT & track", "Keyboard player"],
    href: "/guides/accessible-video-player",
    gradient: "from-sky-600 to-indigo-700",
  },
  {
    title: "Accessible Charts & Data Visualization",
    description:
      "A chart is a picture of data — the accessible version is the data itself, as text. Learn the data table that is the real text alternative, choosing SVG vs canvas vs images, labelling an SVG with role=img and aria-labelledby, never coding a series by color alone, keeping axis labels as scalable text, keyboard-navigable interactive charts and hover-or-focus tooltips, and what charting libraries actually give you.",
    icon: BarChart3,
    difficulty: "Intermediate",
    readingTime: "22 min",
    topics: ["Data table alternative", "SVG role=img", "Color not alone", "1.4.13 tooltips", "Charting libraries"],
    href: "/guides/accessible-charts",
    gradient: "from-emerald-600 to-cyan-600",
  },
  {
    title: "Accessible Data Tables",
    description:
      "A data table is accessible when the markup says which cell is a header for which data. Learn the semantic table, caption, and th scope structure, when to use scope vs the headers and id method for complex tables, responsive tables that survive 320px, sortable tables with aria-sort and named row controls, and when a plain table beats an ARIA grid — with copy-ready HTML mapped to WCAG 2.2.",
    icon: Table,
    difficulty: "Intermediate",
    readingTime: "22 min",
    topics: ["th scope", "caption", "headers/id", "aria-sort", "Responsive tables"],
    href: "/guides/accessible-data-tables",
    gradient: "from-teal-600 to-emerald-700",
  },
  {
    title: "Accessible Email HTML",
    description:
      "Email clients force you into the nested-table, inline-CSS layouts the web abandoned, so email accessibility is about making that table soup read as a linear document. Learn role=\"presentation\" on layout tables, real semantic content inside them, the lang attribute templates forget, alt text that survives blocked images, bulletproof accessible buttons, single-column reflow, dark-mode contrast, and how to test an email with a screen reader, with copy-ready HTML mapped to WCAG 2.2.",
    icon: Mail,
    difficulty: "Intermediate",
    readingTime: "22 min",
    topics: ["role=presentation", "Alt text", "Bulletproof buttons", "lang attribute", "Dark mode"],
    href: "/guides/accessible-email",
    gradient: "from-blue-600 to-cyan-600",
  },
  {
    title: "Accessible Maps & Geospatial Content",
    description:
      "An interactive map is a picture of spatial data, so the accessible version is usually the same information delivered as text and controls, not the pixels. Learn how to decide what job the map is doing, build the map-plus-list pattern where the list is the source of truth, add titles to embedded maps, make markers and pan and zoom controls keyboard operable, provide a single-pointer alternative to dragging, write alt text for static maps, and make choropleth data maps accessible as charts, with copy-ready HTML mapped to WCAG 2.2.",
    icon: MapPinned,
    difficulty: "Intermediate",
    readingTime: "24 min",
    topics: ["Map + list pattern", "iframe title", "Keyboard pan/zoom", "Marker names", "Data maps"],
    href: "/guides/accessible-maps",
    gradient: "from-green-600 to-teal-700",
  },
  {
    title: "OKLCH + APCA Color Systems",
    description:
      "The complete deep-dive on building accessible color systems with OKLCH perceptual lightness, 11-stop scales, APCA grading, color-blindness simulation, and design-token exports to Tailwind, Figma, iOS, and Android.",
    icon: Sparkles,
    difficulty: "Advanced",
    readingTime: "12 min",
    topics: ["OKLCH", "APCA", "WCAG 3", "Design Tokens", "Color Blindness"],
    href: "/guides/oklch-apca-color-systems",
    gradient: "from-fuchsia-600 to-violet-600",
  },
  {
    title: "Accessible Typography (WCAG 2.2 + 3)",
    description:
      "Build typography systems that meet WCAG 2.2: modular type scales, fluid clamp() sizing, the 1.4.12 text-spacing override test, dyslexia & cognitive research, Flesch-Kincaid scoring, and token exports for every platform.",
    icon: Scale,
    difficulty: "Advanced",
    readingTime: "13 min",
    topics: ["Modular scale", "WCAG 1.4.12", "Fluid typography", "Dyslexia", "Design Tokens"],
    href: "/guides/accessible-typography-wcag",
    gradient: "from-sky-600 to-indigo-600",
  },
  {
    title: "Cognitive Accessibility & Plain Language",
    description:
      "Design for the largest and most varied group of disabled users, and the one checkers help least. Plain language and reading level, scannable structure, consistent navigation and help, less reliance on memory, and forgiving forms, mapped to the WCAG 2.2 cognitive criteria (3.2.6 Consistent Help, 3.3.7 Redundant Entry, 3.3.8 Accessible Authentication) and the W3C COGA guidance.",
    icon: Brain,
    difficulty: "Intermediate",
    readingTime: "26 min",
    topics: ["Plain language", "Reading level", "Consistent Help 3.2.6", "Redundant Entry 3.3.7", "Memory load"],
    href: "/guides/cognitive-accessibility",
    gradient: "from-violet-600 to-purple-700",
  },
  {
    title: "React Accessibility Guide",
    description:
      "Build accessible React apps: semantic JSX, focus management on route changes, accessible modals, ARIA in JSX, live-region announcements, forms with useId, and a testing workflow with eslint-plugin-jsx-a11y, jest-axe, and Playwright — mapped to WCAG 2.2 AA.",
    icon: Code2,
    difficulty: "Intermediate",
    readingTime: "20 min",
    topics: ["React", "Focus Management", "ARIA in JSX", "useId", "jest-axe"],
    href: "/guides/react-accessibility",
    gradient: "from-cyan-600 to-blue-600",
  },
  {
    title: "Angular Accessibility Guide",
    description:
      "Build accessible Angular apps: semantic templates, ARIA binding with [attr.aria-*], focus management on router navigation, dialogs with cdkTrapFocus, LiveAnnouncer for dynamic updates, accessible reactive forms, and testing with @angular-eslint, jasmine-axe, and Playwright — mapped to WCAG 2.2 AA.",
    icon: Braces,
    difficulty: "Intermediate",
    readingTime: "20 min",
    topics: ["Angular", "CDK a11y", "[attr.aria-*]", "Router Focus", "LiveAnnouncer"],
    href: "/guides/angular-accessibility",
    gradient: "from-rose-600 to-red-600",
  },
  {
    title: "Vue Accessibility Guide",
    description:
      "Build accessible Vue 3 apps: semantic templates, reactive :aria-* binding, focus on Vue Router navigation, dialogs with Teleport, live regions that actually announce, the $attrs fallthrough fix, accessible forms, and testing with eslint-plugin-vuejs-accessibility and vitest-axe — mapped to WCAG 2.2 AA.",
    icon: Component,
    difficulty: "Intermediate",
    readingTime: "20 min",
    topics: ["Vue 3", ":aria-*", "$attrs", "Teleport", "vitest-axe"],
    href: "/guides/vue-accessibility",
    gradient: "from-emerald-600 to-green-600",
  },
  {
    title: "Svelte Accessibility Guide",
    description:
      "Build accessible Svelte 5 and SvelteKit apps: the compiler's built-in a11y warnings, reactive ARIA with runes, focus traps packaged as use: actions, SvelteKit route announcements and focus, live regions that announce, accessible forms, and testing with svelte-check and vitest-axe — mapped to WCAG 2.2 AA.",
    icon: Flame,
    difficulty: "Intermediate",
    readingTime: "22 min",
    topics: ["Svelte 5", "a11y warnings", "use: actions", "SvelteKit", "svelte-check"],
    href: "/guides/svelte-accessibility",
    gradient: "from-orange-500 to-red-600",
  },
  {
    title: "Mobile Accessibility Guide",
    description:
      "Build accessible mobile apps and mobile web: touch target sizing, pointer gestures and cancellation, orientation and text scaling, native iOS (UIKit & SwiftUI), native Android (View & Jetpack Compose), mobile web, and VoiceOver + TalkBack testing — mapped to WCAG 2.2 AA and WCAG2ICT.",
    icon: TabletSmartphone,
    difficulty: "Intermediate",
    readingTime: "24 min",
    topics: ["iOS", "Android", "Touch Targets", "SwiftUI", "Compose"],
    href: "/guides/mobile-accessibility",
    gradient: "from-cyan-600 to-teal-600",
  },
  {
    title: "Accessible Forms Guide",
    description:
      "Build forms everyone can complete. Labels, required fields, inline validation, accessible error messages tied with aria-describedby, fieldset grouping, autocomplete, and multi-step patterns — mapped to WCAG 2.2 AA with copy-ready code.",
    icon: FormInput,
    difficulty: "Intermediate",
    readingTime: "22 min",
    topics: ["Labels", "Validation", "Error Messages", "WCAG 3.3.x"],
    href: "/guides/accessible-forms",
    gradient: "from-teal-600 to-cyan-600",
  },
  {
    title: "Accessible Form Validation & Error Handling",
    description:
      "Error handling is where forms fail. Learn when to validate (submit vs blur vs keystroke), tying an error to its field with aria-invalid and aria-describedby, the error-summary pattern with focus management, announcing errors through live regions without double-speaking, error suggestion and prevention, and WCAG 2.2's Redundant Entry and Accessible Authentication — mapped to WCAG 3.3.1 through 3.3.9.",
    icon: ShieldAlert,
    difficulty: "Intermediate",
    readingTime: "24 min",
    topics: ["When to validate", "aria-invalid", "Error summary", "Redundant Entry", "3.3.8 Auth"],
    href: "/guides/accessible-form-validation",
    gradient: "from-red-600 to-orange-600",
  },
  {
    title: "Complete Keyboard Accessibility Guide",
    description:
      "Master keyboard accessibility from fundamentals to advanced patterns. Learn focus management, skip navigation links, roving tabindex, and how to identify and fix keyboard traps with hands-on interactive demos.",
    icon: Keyboard,
    difficulty: "Intermediate",
    readingTime: "30 min",
    topics: ["Focus Management", "Skip Links", "Roving Tabindex", "Keyboard Traps"],
    href: "/guides/keyboard-accessibility",
    gradient: "from-emerald-600 to-teal-600",
  },
  {
    title: "Focus Management Guide",
    description:
      "The complete guide to managing keyboard focus: tabindex, :focus-visible, moving focus programmatically, focus traps, restoration, roving tabindex, skip links, and route-change focus — mapped to WCAG 2.2 (2.4.3, 2.4.7, 2.4.11) with copy-ready code.",
    icon: Focus,
    difficulty: "Intermediate",
    readingTime: "24 min",
    topics: ["tabindex", ":focus-visible", "Focus Traps", "Roving Tabindex", "WCAG 2.4.11"],
    href: "/guides/focus-management",
    gradient: "from-blue-600 to-indigo-600",
  },
  {
    title: "Skip Links & Bypass Blocks Guide",
    description:
      "Build a skip link that actually works: the first-focusable HTML, the visually-hidden-until-focused CSS, and the number one bug where the page scrolls but focus never moves because the target is not focusable. Plus landmarks and headings as the real bypass for screen reader users, multiple skip links, and skip links in single-page apps and React, mapped to WCAG 2.4.1.",
    icon: SkipForward,
    difficulty: "Beginner",
    readingTime: "18 min",
    topics: ["Skip Links", "Bypass Blocks", "tabindex -1", "Landmarks", "WCAG 2.4.1"],
    href: "/guides/skip-links",
    gradient: "from-sky-600 to-indigo-600",
  },
  {
    title: "ARIA Landmarks & Page Structure Guide",
    description:
      "The two maps a screen reader user navigates by: landmarks and headings. Covers the eight landmark roles and the HTML that provides them, the scoping rule almost everyone misses (header and footer are only landmarks at the top level), the section trap where a section is not a landmark until you name it, one main and naming repeated regions, the heading map and the HTML5 outline myth, and how real screen readers jump around by structure, mapped to WCAG 1.3.1.",
    icon: LayoutTemplate,
    difficulty: "Beginner",
    readingTime: "20 min",
    topics: ["ARIA Landmarks", "Semantic HTML", "Page Structure", "Heading Levels", "WCAG 1.3.1"],
    href: "/guides/landmarks-page-structure",
    gradient: "from-slate-600 to-blue-700",
  },
  {
    title: "Accessible Breadcrumb Navigation Guide",
    description:
      "A breadcrumb answers to two audiences at once: screen reader users through ARIA, and search engines through BreadcrumbList structured data. Covers the semantic markup (a named nav landmark wrapping an ordered list), marking the current page with aria-current, hiding the separators from assistive technology, keeping the visible trail and the structured data in sync, and truncating long trails on mobile without breaking either, mapped to WCAG 2.4.8.",
    icon: Milestone,
    difficulty: "Beginner",
    readingTime: "16 min",
    topics: ["Breadcrumbs", "aria-current", "BreadcrumbList Schema", "nav aria-label", "WCAG 2.4.8"],
    href: "/guides/accessible-breadcrumbs",
    gradient: "from-amber-600 to-orange-700",
  },
  {
    title: "Accessible Pagination Guide",
    description:
      "Pagination is navigation, not a widget: a named nav landmark wrapping a list of controls. Covers giving each control a name that says what it does so \"Go to page 3\" replaces a bare \"3\", marking the current page with aria-current, choosing links or buttons on purpose, the Previous and Next disabled-state trap, hiding the ellipsis while keeping pages reachable, and announcing the change in single-page apps, with the Load More and infinite-scroll alternatives, mapped to WCAG 2.4.4.",
    icon: GalleryHorizontalEnd,
    difficulty: "Beginner",
    readingTime: "18 min",
    topics: ["Pagination", "aria-current", "Link vs Button", "Load More", "WCAG 2.4.4"],
    href: "/guides/accessible-pagination",
    gradient: "from-violet-600 to-purple-700",
  },
  {
    title: "Accessible Tabs Guide",
    description:
      "Build tabs the right way with the WAI-ARIA Tabs pattern: the tablist, tab, and tabpanel roles, aria-selected and aria-controls, roving tabindex, arrow-key navigation, automatic vs manual activation, and vertical tabs — with copy-ready HTML, JavaScript, and React mapped to WCAG 2.2.",
    icon: AppWindow,
    difficulty: "Intermediate",
    readingTime: "18 min",
    topics: ["ARIA Tabs", "tablist / tabpanel", "Roving Tabindex", "aria-selected", "Arrow Keys"],
    href: "/guides/accessible-tabs",
    gradient: "from-indigo-600 to-violet-600",
  },
  {
    title: "Accessible Accordion & Disclosure Guide",
    description:
      "Build accordions and disclosure widgets the right way: the aria-expanded state, the button-in-heading structure, aria-controls, the native details and summary element, single vs multi-expand, and the keyboard model — with copy-ready HTML, JavaScript, and React mapped to WCAG 2.2.",
    icon: ListCollapse,
    difficulty: "Intermediate",
    readingTime: "16 min",
    topics: ["ARIA Disclosure", "aria-expanded", "details / summary", "Heading Structure", "Expand / Collapse"],
    href: "/guides/accessible-accordion",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    title: "Accessible Combobox & Autocomplete Guide",
    description:
      "Build autocomplete the right way with the WAI-ARIA Combobox pattern: role=combobox on the input, aria-expanded, aria-autocomplete, and the aria-activedescendant focus model that keeps focus in the field while arrow keys move a virtual highlight — with copy-ready HTML, JavaScript, and React mapped to WCAG 2.2.",
    icon: TextSearch,
    difficulty: "Advanced",
    readingTime: "20 min",
    topics: ["ARIA Combobox", "aria-activedescendant", "aria-autocomplete", "Listbox", "Typeahead"],
    href: "/guides/accessible-combobox",
    gradient: "from-sky-500 to-cyan-600",
  },
  {
    title: "Accessible Menu & Menu Button Guide",
    description:
      "Most dropdowns should not use role=menu at all. Learn when the WAI-ARIA Menu pattern applies, how to build a menu button with aria-haspopup and roving tabindex, how menuitemcheckbox and menuitemradio work, and the disclosure pattern your navigation dropdown should use instead.",
    icon: SquareMenu,
    difficulty: "Advanced",
    readingTime: "20 min",
    topics: ["ARIA Menu", "aria-haspopup", "Roving tabindex", "Menu Button", "Nav Dropdowns"],
    href: "/guides/accessible-menu",
    gradient: "from-fuchsia-600 to-purple-600",
  },
  {
    title: "Accessible Dialog & Modal Guide",
    description:
      "The hand-rolled focus trap is obsolete. Learn the native <dialog> element and showModal(), where initial focus really belongs (not the close button), focus restoration when the trigger is gone, the inert top layer, alertdialog, zero-JavaScript dialogs with commandfor, and scroll locking at 400% zoom.",
    icon: PanelTop,
    difficulty: "Advanced",
    readingTime: "20 min",
    topics: ["HTML dialog", "showModal", "Focus trap", "inert", "alertdialog"],
    href: "/guides/accessible-dialog",
    gradient: "from-violet-600 to-indigo-700",
  },
  {
    title: "Accessible Switch & Toggle Guide",
    description:
      "A toggle switch is not a checkbox. Learn when a switch is the right control and when a checkbox is, the native input type=checkbox role=switch path that needs almost no JavaScript, why the accessible name must stay fixed as the state moves, non-text contrast for the track and thumb, immediate-effect semantics, and React.",
    icon: ToggleRight,
    difficulty: "Intermediate",
    readingTime: "18 min",
    topics: ["role=switch", "aria-checked", "Switch vs checkbox", "Non-text contrast", "Toggle"],
    href: "/guides/accessible-switch",
    gradient: "from-teal-500 to-green-600",
  },
  {
    title: "Accessible Slider & Range Input Guide",
    description:
      "A slider is a value, not two states. Learn the native input type=range that gives you role=slider, keyboard, and click-to-set for free, the full arrow / Home / End / Page keyboard contract, aria-valuenow and the aria-valuetext that turns \"2\" into \"Medium\", the 2.5.7 dragging-alternative rule, and dual-thumb range sliders.",
    icon: SlidersHorizontal,
    difficulty: "Advanced",
    readingTime: "22 min",
    topics: ["role=slider", "aria-valuenow", "aria-valuetext", "Dragging Movements", "Range input"],
    href: "/guides/accessible-slider",
    gradient: "from-orange-500 to-rose-600",
  },
  {
    title: "Accessible Tree View Guide",
    description:
      "A tree view browses and selects nodes in a hierarchy. Learn the role=tree / treeitem / group structure, the roving-tabindex focus model, the context-sensitive Right and Left arrows that expand, collapse, and move between parent and child, aria-expanded, aria-selected, aria-level / setsize / posinset, single vs multi-select, and when a nested list of links is the better choice.",
    icon: ListTree,
    difficulty: "Advanced",
    readingTime: "22 min",
    topics: ["role=tree", "treeitem", "Roving tabindex", "aria-expanded", "aria-level"],
    href: "/guides/accessible-tree-view",
    gradient: "from-lime-500 to-emerald-600",
  },
  {
    title: "Accessible Data Grid Guide",
    description:
      "A data grid is a table the user operates, not one they read. Learn the role=grid / row / gridcell structure built on a real <table>, two-dimensional arrow-key navigation, roving tabindex, the two focus modes (Enter to enter a cell, Escape to leave), editable cells, selection, and aria-rowcount / rowindex / colindex for virtualized grids — plus when a plain semantic table is the better choice.",
    icon: Grid3x3,
    difficulty: "Advanced",
    readingTime: "24 min",
    topics: ["role=grid", "gridcell", "2-D navigation", "Actionable mode", "aria-rowindex"],
    href: "/guides/accessible-data-grid",
    gradient: "from-cyan-600 to-blue-700",
  },
  {
    title: "Accessible Listbox Guide",
    description:
      "A listbox lets a user pick from a set of choices — one, or several. Learn the role=listbox / option / group structure, single-select where selection follows focus, multi-select with aria-multiselectable and Space to toggle, aria-selected, the roving-tabindex vs aria-activedescendant focus choice, grouped and disabled options, type-ahead — and when a group of checkboxes or a native select is the better choice.",
    icon: List,
    difficulty: "Advanced",
    readingTime: "20 min",
    topics: ["role=listbox", "option", "aria-selected", "Multi-select", "Selection follows focus"],
    href: "/guides/accessible-listbox",
    gradient: "from-rose-500 to-pink-600",
  },
  {
    title: "Accessible Tooltip & Toggletip Guide",
    description:
      "A tooltip and a toggletip look alike but are two different patterns, and choosing wrong is the most common hover-help bug. Learn the fork: a tooltip is a supplement wired with aria-describedby that shows on hover and focus and holds only plain text, while a toggletip is a button plus a live region that reveals requested information. Covers role=tooltip, why the title attribute is not a tooltip, the rule that a tooltip can never hold a link or button, naming an icon-only control, touch and reflow, mapped to WCAG 1.4.13.",
    icon: MessageSquareText,
    difficulty: "Intermediate",
    readingTime: "18 min",
    topics: ["role=tooltip", "Toggletip", "aria-describedby", "1.4.13", "Hover or focus"],
    href: "/guides/accessible-tooltip",
    gradient: "from-cyan-600 to-sky-700",
  },
  {
    title: "Screen Reader Testing Guide",
    description:
      "A practical guide to testing your websites and applications with the most popular screen readers. Covers NVDA and JAWS on Windows, VoiceOver on macOS and iOS, and TalkBack on Android with step-by-step workflows.",
    icon: AudioLines,
    difficulty: "Intermediate",
    readingTime: "35 min",
    topics: ["NVDA", "JAWS", "VoiceOver", "TalkBack"],
    href: "/guides/screen-reader-testing",
    gradient: "from-violet-600 to-purple-600",
  },
  {
    title: "NVDA Screen Reader Testing Guide",
    description:
      "The complete guide to testing with NVDA, the free Windows screen reader: install and configure it, master browse vs focus mode, use the NVDA modifier key and Elements List, and run a repeatable testing workflow with a full keyboard command cheat sheet — mapped to WCAG 2.2 AA.",
    icon: Ear,
    difficulty: "Intermediate",
    readingTime: "18 min",
    topics: ["NVDA", "Browse Mode", "Focus Mode", "Cheat Sheet", "WCAG 4.1.2"],
    href: "/guides/nvda-screen-reader-testing",
    gradient: "from-purple-600 to-fuchsia-600",
  },
  {
    title: "VoiceOver Screen Reader Testing Guide",
    description:
      "The complete guide to testing with VoiceOver, Apple's built-in screen reader on macOS and iOS: turn it on, master the VO keys and the Rotor, use iPhone gestures, and run a repeatable testing workflow with full macOS and iOS command cheat sheets — mapped to WCAG 2.2 AA.",
    icon: Signal,
    difficulty: "Intermediate",
    readingTime: "18 min",
    topics: ["VoiceOver", "macOS", "iOS", "Rotor", "WCAG 4.1.2"],
    href: "/guides/voiceover-screen-reader-testing",
    gradient: "from-sky-600 to-blue-600",
  },
  {
    title: "JAWS Screen Reader Testing Guide",
    description:
      "The complete guide to testing with JAWS, the most widely used Windows screen reader: install it in demo mode, master the JAWS key, the Virtual Cursor and Forms Mode, quick navigation keys, and run a repeatable testing workflow with a full command cheat sheet — mapped to WCAG 2.2 AA.",
    icon: AudioLines,
    difficulty: "Intermediate",
    readingTime: "18 min",
    topics: ["JAWS", "Virtual Cursor", "Forms Mode", "Cheat Sheet", "WCAG 4.1.2"],
    href: "/guides/jaws-screen-reader-testing",
    gradient: "from-indigo-600 to-violet-600",
  },
  {
    title: "TalkBack Screen Reader Testing Guide",
    description:
      "The complete guide to testing with TalkBack, Android's built-in screen reader: turn it on, master explore by touch, swipe navigation, reading controls, and multi-finger gestures, and run a repeatable mobile testing workflow — mapped to WCAG 2.2 AA including Target Size and Pointer Gestures.",
    icon: Smartphone,
    difficulty: "Intermediate",
    readingTime: "18 min",
    topics: ["TalkBack", "Android", "Explore by Touch", "Reading Controls", "WCAG 2.5.8"],
    href: "/guides/talkback-screen-reader-testing",
    gradient: "from-teal-600 to-emerald-600",
  },
  {
    title: "Accessibility Overlays: Why They Fail",
    description:
      "An evidence-based look at accessibility overlay widgets — what they can and cannot fix, the lawsuit data on overlay-equipped sites, and what to do instead.",
    icon: Layers,
    difficulty: "Beginner",
    readingTime: "20 min",
    topics: ["Overlays", "Widgets", "Lawsuit Risk", "Remediation"],
    href: "/guides/accessibility-overlays",
    gradient: "from-red-600 to-orange-600",
  },
  {
    title: "Accessibility Overlay Alternatives",
    description:
      "Real alternatives to overlay widgets ranked by effort and impact — remediation, automated testing in CI, professional audits, and training, with a cost comparison.",
    icon: GitCompareArrows,
    difficulty: "Beginner",
    readingTime: "20 min",
    topics: ["Overlays", "Remediation", "Cost Comparison", "Migration"],
    href: "/guides/accessibility-overlay-alternatives",
    gradient: "from-orange-600 to-amber-600",
  },
  {
    title: "How to Make PDFs Accessible",
    description:
      "Complete guide to accessible PDFs — tags, headings, reading order, alt text, and PDF/UA conformance, plus how to test documents before you publish them.",
    icon: FileText,
    difficulty: "Intermediate",
    readingTime: "25 min",
    topics: ["Tagged PDF", "PDF/UA", "Reading Order", "Testing"],
    href: "/guides/pdf-accessibility",
    gradient: "from-rose-600 to-pink-600",
  },
  {
    title: "Automated vs Manual Accessibility Testing",
    description:
      "What automated scanners actually catch, what only manual testing finds, and how to combine both into a workflow that holds up in an audit.",
    icon: TestTubes,
    difficulty: "Beginner",
    readingTime: "20 min",
    topics: ["Automated Testing", "Manual Testing", "CI", "Workflow"],
    href: "/guides/automated-vs-manual-accessibility-testing",
    gradient: "from-cyan-600 to-blue-600",
  },
  {
    title: "axe vs WAVE: Testing Tools Compared",
    description:
      "A factual comparison of the two most popular accessibility testing tools — strengths, workflows, pricing, and when to use each (or both).",
    icon: Search,
    difficulty: "Beginner",
    readingTime: "15 min",
    topics: ["axe", "WAVE", "Tool Comparison", "Testing"],
    href: "/guides/axe-vs-wave",
    gradient: "from-blue-600 to-indigo-600",
  },
]

// Guides grouped into scannable categories. Membership is by href so the
// `guides` data array above stays the single source of truth; any guide not
// listed here still renders under "More Guides" so nothing is ever dropped.
const categories = [
  {
    slug: "standards",
    label: "Standards & Compliance",
    blurb:
      "Understand what WCAG 2.2 actually requires, and how the versions differ, before you build.",
    icon: ListChecks,
    hrefs: [
      "/guides/wcag-2-2-aa-requirements",
      "/guides/wcag-2-1-vs-2-2",
    ],
  },
  {
    slug: "testing",
    label: "Testing & Auditing",
    blurb:
      "Audit any site and pick the right tools, from automated scanners to hands-on manual review.",
    icon: TestTubes,
    hrefs: [
      "/guides/how-to-audit-website-accessibility",
      "/guides/ai-accessibility-audit",
      "/guides/automated-vs-manual-accessibility-testing",
      "/guides/axe-vs-wave",
    ],
  },
  {
    slug: "screen-readers",
    label: "Screen Reader Testing",
    blurb:
      "Test with the screen readers real users run — NVDA, JAWS, VoiceOver, and TalkBack.",
    icon: AudioLines,
    hrefs: [
      "/guides/screen-reader-testing",
      "/guides/nvda-screen-reader-testing",
      "/guides/jaws-screen-reader-testing",
      "/guides/voiceover-screen-reader-testing",
      "/guides/talkback-screen-reader-testing",
    ],
  },
  {
    slug: "foundations",
    label: "Forms, Keyboard & Focus",
    blurb:
      "The semantic structure and core interaction layer every accessible interface depends on.",
    icon: Keyboard,
    hrefs: [
      "/guides/accessible-forms",
      "/guides/accessible-form-validation",
      "/guides/keyboard-accessibility",
      "/guides/focus-management",
      "/guides/skip-links",
      "/guides/landmarks-page-structure",
      "/guides/accessible-breadcrumbs",
      "/guides/accessible-pagination",
    ],
  },
  {
    slug: "patterns",
    label: "ARIA Component Patterns",
    blurb:
      "Start with the rules of ARIA, then build the WAI-ARIA Authoring Practices components correctly, with copy-ready HTML, JavaScript, and React.",
    icon: Component,
    hrefs: [
      "/guides/using-aria",
      "/guides/accessible-tabs",
      "/guides/accessible-accordion",
      "/guides/accessible-combobox",
      "/guides/accessible-menu",
      "/guides/accessible-dialog",
      "/guides/accessible-switch",
      "/guides/accessible-slider",
      "/guides/accessible-tree-view",
      "/guides/accessible-data-grid",
      "/guides/accessible-listbox",
      "/guides/accessible-tooltip",
    ],
  },
  {
    slug: "frameworks",
    label: "Frameworks & Platforms",
    blurb:
      "Framework-specific accessibility for React, Angular, Vue, Svelte, native mobile, and AI-powered chat features.",
    icon: Code2,
    hrefs: [
      "/guides/react-accessibility",
      "/guides/angular-accessibility",
      "/guides/vue-accessibility",
      "/guides/svelte-accessibility",
      "/guides/mobile-accessibility",
      "/guides/accessible-ai-chat",
    ],
  },
  {
    slug: "design",
    label: "Design, Content & Media",
    blurb:
      "Color, typography, plain language, data visualization, data tables, media, and documents that work for everyone.",
    icon: Palette,
    hrefs: [
      "/guides/accessible-color-palettes",
      "/guides/oklch-apca-color-systems",
      "/guides/accessible-typography-wcag",
      "/guides/cognitive-accessibility",
      "/guides/accessible-charts",
      "/guides/accessible-data-tables",
      "/guides/accessible-email",
      "/guides/accessible-maps",
      "/guides/accessible-video-player",
      "/guides/pdf-accessibility",
    ],
  },
  {
    slug: "law",
    label: "Law & Litigation",
    blurb:
      "The lawsuits, settlements, and compliance deadlines shaping web accessibility in 2026.",
    icon: Scale,
    hrefs: [
      "/guides/fashion-nova-accessibility-settlement",
      "/guides/ada-website-lawsuit-cost",
      "/guides/ai-accessibility-lawsuits",
      "/guides/doj-title-ii-deadline-extension",
      "/guides/section-504-web-accessibility-deadline",
    ],
  },
  {
    slug: "overlays",
    label: "Accessibility Overlays",
    blurb:
      "Why accessibility overlay widgets fall short, and what to do instead.",
    icon: Layers,
    hrefs: [
      "/guides/accessibility-overlays",
      "/guides/accessibility-overlay-alternatives",
    ],
  },
]

const difficultyColors: Record<string, string> = {
  Beginner:
    "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
  Intermediate:
    "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
  Advanced:
    "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
}

function GuideCard({ guide }: { guide: (typeof guides)[number] }) {
  const Icon = guide.icon
  return (
    <Card className="group relative flex h-full flex-col overflow-hidden border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      {/* Top accent line */}
      <div
        className={`absolute top-0 left-0 h-1 w-full bg-gradient-to-r ${guide.gradient}`}
      />

      <CardHeader className="pb-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div
            className={`shrink-0 rounded-xl bg-gradient-to-r ${guide.gradient} p-2.5 shadow-lg transition-shadow duration-300 group-hover:shadow-xl`}
          >
            <Icon className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Badge className={difficultyColors[guide.difficulty]}>
              <Signal className="mr-1 h-3 w-3" />
              {guide.difficulty}
            </Badge>
            <Badge
              variant="outline"
              className="border-slate-200 dark:border-slate-700"
            >
              <Clock className="mr-1 h-3 w-3" />
              {guide.readingTime}
            </Badge>
          </div>
        </div>

        <CardTitle className="text-lg text-slate-900 dark:text-white transition-colors group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
          {guide.title}
        </CardTitle>
        <CardDescription className="mt-2 leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-3">
          {guide.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col pt-0">
        {/* Topic pills */}
        <div className="mb-4 flex flex-wrap gap-2">
          {guide.topics.slice(0, 4).map((topic) => (
            <Badge
              key={topic}
              variant="secondary"
              className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
            >
              {topic}
            </Badge>
          ))}
        </div>

        <Button
          asChild
          variant="outline"
          className="mt-auto w-full group/btn border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/50"
        >
          <Link href={guide.href}>
            Read Guide
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}

export default function GuidesPage() {
  const guidesByHref = new Map(guides.map((guide) => [guide.href, guide]))
  const categorizedHrefs = new Set(categories.flatMap((category) => category.hrefs))
  const uncategorized = guides.filter((guide) => !categorizedHrefs.has(guide.href))

  return (
    <div className="min-h-screen">
      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: "https://accessibility.build" },
          { name: "Guides", url: "https://accessibility.build/guides" },
        ]}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950 border-b border-slate-200 dark:border-slate-800">
        <div className="container-wide pt-12 pb-12 md:pb-16">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-6 bg-gradient-to-r from-slate-900 via-emerald-900 to-emerald-700 bg-clip-text text-4xl font-bold leading-tight text-transparent dark:from-white dark:via-emerald-200 dark:to-emerald-400 md:text-6xl">
              Accessibility Guides
            </h1>
            <p className="mx-auto mb-8 max-w-3xl text-lg leading-relaxed text-slate-600 dark:text-slate-400 md:text-xl">
              In-depth, practical guides that go beyond theory — real code, live
              patterns, and testing workflows you can apply immediately, every
              one mapped to WCAG 2.2 AA.
            </p>

            {/* Stats */}
            <div className="mb-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-600 dark:text-slate-400">
              <span>
                <strong className="text-slate-900 dark:text-white">
                  {guides.length}
                </strong>{" "}
                in-depth guides
              </span>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">
                &bull;
              </span>
              <span>
                <strong className="text-slate-900 dark:text-white">
                  {categories.length}
                </strong>{" "}
                topics
              </span>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">
                &bull;
              </span>
              <span>Mapped to WCAG 2.2 AA</span>
              <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">
                &bull;
              </span>
              <span>Free, no signup</span>
            </div>

            {/* Category jump navigation */}
            <nav aria-label="Guide categories">
              <ul className="flex flex-wrap items-center justify-center gap-2">
                {categories.map((category) => (
                  <li key={category.slug}>
                    <a
                      href={`#${category.slug}`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/70 px-3.5 py-1.5 text-sm font-medium text-slate-700 backdrop-blur transition-colors hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:border-emerald-700 dark:hover:bg-emerald-900/40 dark:hover:text-emerald-300"
                    >
                      {category.label}
                      <span className="text-xs text-slate-400 dark:text-slate-500">
                        {category.hrefs.length}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </section>

      {/* Categorized guide sections */}
      <div className="container-wide space-y-16 py-16 md:space-y-20 md:py-20">
        {categories.map((category) => {
          const CategoryIcon = category.icon
          const items = category.hrefs
            .map((href) => guidesByHref.get(href))
            .filter((guide): guide is (typeof guides)[number] => Boolean(guide))

          if (items.length === 0) return null

          return (
            <section key={category.slug} id={category.slug} className="scroll-mt-24">
              <div className="mb-8 border-b border-slate-200 pb-5 dark:border-slate-800">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
                    <CategoryIcon className="h-5 w-5" />
                  </span>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
                    {category.label}
                  </h2>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-sm font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    {items.length}
                  </span>
                </div>
                <p className="mt-3 max-w-3xl text-slate-600 dark:text-slate-400">
                  {category.blurb}
                </p>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {items.map((guide) => (
                  <GuideCard key={guide.href} guide={guide} />
                ))}
              </div>
            </section>
          )
        })}

        {uncategorized.length > 0 && (
          <section id="more" className="scroll-mt-24">
            <div className="mb-8 border-b border-slate-200 pb-5 dark:border-slate-800">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
                More Guides
              </h2>
              <p className="mt-3 max-w-3xl text-slate-600 dark:text-slate-400">
                Additional guides across the rest of the library.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {uncategorized.map((guide) => (
                <GuideCard key={guide.href} guide={guide} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Related Content */}
      <section className="container-wide pb-16 md:pb-20">
        <RelatedContent
          links={[
            {
              url: "/research",
              title: "Accessibility Research & Reports",
              description:
                "Original data-driven research on web accessibility trends.",
              type: "article",
            },
            {
              url: "/checklists",
              title: "WCAG Checklists",
              description:
                "Step-by-step checklists for WCAG 2.2 compliance.",
              type: "checklist",
            },
            {
              url: "/tools",
              title: "Accessibility Testing Tools",
              description:
                "Test your site with our free accessibility scanning tools.",
              type: "tool",
            },
          ]}
        />
      </section>
    </div>
  )
}
