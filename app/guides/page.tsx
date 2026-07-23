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
  PlayCircle,
  Code2,
  Download,
  Clock,
  Signal,
  FileCode2,
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
  TextSearch,
  SquareMenu,
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

const comingSoonGuides = [
  {
    title: "ARIA Patterns Guide",
    description:
      "Comprehensive reference for WAI-ARIA design patterns including combobox, dialog, menu, tabs, and tree view with accessible implementations.",
    icon: FileCode2,
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

export default function GuidesPage() {
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
        <div className="container-wide pt-12 pb-16 md:pb-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-emerald-900 to-emerald-700 dark:from-white dark:via-emerald-200 dark:to-emerald-400 bg-clip-text text-transparent leading-tight">
              Accessibility Guides
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-3xl mx-auto leading-relaxed">
              In-depth, interactive guides that go beyond theory. Each guide
              includes live demos, real code examples, and downloadable
              checklists so you can apply what you learn immediately.
            </p>

            {/* Stats Bar */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-full">
                  <PlayCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  Interactive Demos
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                  <Code2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  Code Examples
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-full">
                  <Download className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  Free Downloads
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Guide Cards */}
      <section className="container-wide py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {guides.map((guide) => {
            const Icon = guide.icon
            return (
              <Card
                key={guide.title}
                className="group relative overflow-hidden border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                {/* Top accent line */}
                <div
                  className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${guide.gradient}`}
                />

                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`p-3 bg-gradient-to-r ${guide.gradient} rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={difficultyColors[guide.difficulty]}>
                        <Signal className="h-3 w-3 mr-1" />
                        {guide.difficulty}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="border-slate-200 dark:border-slate-700"
                      >
                        <Clock className="h-3 w-3 mr-1" />
                        {guide.readingTime}
                      </Badge>
                    </div>
                  </div>

                  <CardTitle className="text-xl text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {guide.title}
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400 leading-relaxed mt-2">
                    {guide.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0 space-y-4">
                  {/* Topic pills */}
                  <div className="flex flex-wrap gap-2">
                    {guide.topics.map((topic) => (
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
                    className="w-full group/btn border-emerald-200 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/50"
                  >
                    <Link href={guide.href}>
                      Read Guide
                      <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="container-wide pb-16 md:pb-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">
            Coming Soon
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {comingSoonGuides.map((guide) => {
              const Icon = guide.icon
              return (
                <Card
                  key={guide.title}
                  className="relative overflow-hidden border-slate-200 dark:border-slate-700 opacity-60"
                >
                  {/* Top accent line */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-700" />

                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-slate-200 dark:bg-slate-700 rounded-xl">
                        <Icon className="h-6 w-6 text-slate-500 dark:text-slate-400" />
                      </div>
                      <Badge
                        variant="outline"
                        className="border-slate-300 text-slate-500 dark:border-slate-600 dark:text-slate-400"
                      >
                        Coming Soon
                      </Badge>
                    </div>

                    <CardTitle className="text-xl text-slate-500 dark:text-slate-400">
                      {guide.title}
                    </CardTitle>
                    <CardDescription className="text-slate-400 dark:text-slate-500 leading-relaxed mt-2">
                      {guide.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

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
