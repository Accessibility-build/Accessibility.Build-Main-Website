import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { BreadcrumbStructuredData } from "@/components/seo/structured-data"

export const metadata: Metadata = {
  title: "Web Accessibility Glossary: 50+ Terms Explained",
  description:
    "Plain-language definitions of 50+ web accessibility terms — WCAG, ARIA, alt text, screen readers, VPAT, EAA, Section 508, and more — in one A-Z glossary.",
  keywords: [
    "accessibility glossary",
    "web accessibility terms",
    "what is wcag",
    "what is aria",
    "what is alt text",
    "what is a screen reader",
    "what is a vpat",
    "accessibility definitions",
    "a11y glossary",
    "wcag terminology",
  ],
  alternates: {
    canonical: "/glossary",
  },
  openGraph: {
    title: "Web Accessibility Glossary: 50+ Terms Explained",
    description:
      "Plain-language definitions of 50+ web accessibility terms — WCAG, ARIA, alt text, screen readers, VPAT, EAA, Section 508, and more — in one A-Z glossary.",
    url: "https://accessibility.build/glossary",
    type: "article",
    siteName: "Accessibility.build",
    images: [
      {
        url: "/api/og?title=Web%20Accessibility%20Glossary&section=Reference",
        width: 1200,
        height: 630,
        alt: "Web Accessibility Glossary",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Web Accessibility Glossary: 50+ Terms Explained",
    description:
      "Plain-language definitions of 50+ web accessibility terms — WCAG, ARIA, alt text, screen readers, VPAT, EAA, Section 508, and more — in one A-Z glossary.",
    images: [
      {
        url: "/api/og?title=Web%20Accessibility%20Glossary&section=Reference",
        width: 1200,
        height: 630,
      },
    ],
  },
}

interface GlossaryTerm {
  term: string
  id: string
  // Definition text. Internal links use [text](/path) markdown-style syntax and
  // are rendered as Next.js <Link> elements; the syntax is stripped for JSON-LD.
  definition: string
}

const terms: GlossaryTerm[] = [
  {
    term: "Accessibility Overlay",
    id: "accessibility-overlay",
    definition:
      "A third-party widget or script that claims to make a website accessible automatically by injecting JavaScript fixes at page load. Overlays cannot repair the underlying code, frequently interfere with screen readers and keyboard navigation, and sites using them are still regularly named in accessibility lawsuits. Read our [guide to accessibility overlays](/guides/accessibility-overlays) before considering one.",
  },
  {
    term: "Accessibility Statement",
    id: "accessibility-statement",
    definition:
      "A public page that describes an organization's commitment to accessibility, the standard it targets (usually WCAG 2.1 or 2.2 AA), any known limitations, and how users can report barriers. Many laws, including the European Accessibility Act and the EU Web Accessibility Directive, require one. You can create one in minutes with our [accessibility statement generator](/tools/accessibility-statement-generator).",
  },
  {
    term: "Accessibility Tree",
    id: "accessibility-tree",
    definition:
      "A simplified, parallel version of the DOM that the browser builds and exposes to assistive technology. Each node carries an element's name, role, state, and properties — a screen reader reads this tree, not your raw HTML. Semantic markup and correct ARIA usage are what keep the accessibility tree accurate.",
  },
  {
    term: "Accessible Name",
    id: "accessible-name",
    definition:
      "The text label that assistive technology announces for an element, such as \"Search\" for a magnifying-glass button. It is computed from sources like element content, the alt attribute, an associated <label>, aria-labelledby, or aria-label, following the accessible name computation algorithm. Every interactive element needs one; see our [ARIA reference](/reference/aria) for how the naming attributes work.",
  },
  {
    term: "ADA (Americans with Disabilities Act)",
    id: "ada",
    definition:
      "The landmark 1990 US civil rights law prohibiting discrimination against people with disabilities. Courts have widely applied Title III (public accommodations) to websites and apps, making the ADA the legal basis for most US digital accessibility lawsuits. A 2024 Department of Justice rule also requires state and local governments to meet WCAG 2.1 AA under Title II.",
  },
  {
    term: "Alt Text (Alternative Text)",
    id: "alt-text",
    definition:
      "A short text description of an image, supplied through the alt attribute, that screen readers announce in place of the image and that displays if the image fails to load. Good alt text conveys the image's purpose in context; purely decorative images should get an empty alt=\"\" so they are skipped. Try our [alt text generator](/tools/alt-text-generator) to write better descriptions faster.",
  },
  {
    term: "APCA (Accessible Perceptual Contrast Algorithm)",
    id: "apca",
    definition:
      "A modern contrast model, developed as a candidate method for WCAG 3, that scores text contrast on a perceptual lightness scale (Lc) instead of WCAG 2's simple luminance ratio. APCA accounts for font size, weight, and polarity (light-on-dark vs dark-on-light), so it better matches how people actually perceive readability. It is not yet a normative requirement — WCAG 2 ratios still govern conformance, which you can test with our [contrast checker](/tools/contrast-checker).",
  },
  {
    term: "ARIA (Accessible Rich Internet Applications)",
    id: "aria",
    definition:
      "A W3C specification (formally WAI-ARIA) of roles, states, and properties that supplement HTML so custom widgets and dynamic content make sense to assistive technology. ARIA only changes what screen readers perceive — it adds no keyboard behavior — so the first rule of ARIA is to prefer native HTML elements when they exist. Explore every role and attribute in our interactive [ARIA reference](/reference/aria).",
  },
  {
    term: "Assistive Technology (AT)",
    id: "assistive-technology",
    definition:
      "Any hardware or software that people with disabilities use to operate computers and browse the web. Examples include screen readers, screen magnifiers, refreshable braille displays, switch devices, eye trackers, and voice control software. Accessible websites work because they expose structure and semantics that assistive technology can interpret.",
  },
  {
    term: "ATAG (Authoring Tool Accessibility Guidelines)",
    id: "atag",
    definition:
      "W3C guidelines for the tools people use to create web content — CMSs, page builders, WYSIWYG editors, and code editors. ATAG 2.0 has two parts: the authoring tool's own interface must be accessible, and the tool should help authors produce accessible content, for example by prompting for alt text.",
  },
  {
    term: "Audio Description",
    id: "audio-description",
    definition:
      "Additional narration added to video that describes important visual information — actions, on-screen text, scene changes — for people who are blind or have low vision. WCAG Success Criterion 1.2.5 (Level AA) requires audio description for prerecorded video content. Descriptions are usually timed to fit natural pauses in dialogue.",
  },
  {
    term: "Captions (Open vs Closed)",
    id: "captions",
    definition:
      "Text versions of the spoken audio and important sounds in video, displayed in sync with playback, primarily for people who are deaf or hard of hearing. Closed captions can be turned on and off by the viewer, while open captions are permanently burned into the video image. WCAG Success Criterion 1.2.2 (Level A) requires captions for prerecorded video with audio.",
  },
  {
    term: "Cognitive Accessibility",
    id: "cognitive-accessibility",
    definition:
      "Designing content so it works for people with cognitive and learning disabilities, including memory, attention, reading, and executive-function differences. Practical techniques include plain language, consistent navigation, generous time limits, clear error messages, and avoiding unnecessary complexity. The W3C's COGA task force publishes detailed guidance in \"Making Content Usable for People with Cognitive and Learning Disabilities.\"",
  },
  {
    term: "Color Contrast Ratio",
    id: "color-contrast-ratio",
    definition:
      "A measure of the luminance difference between foreground text and its background, expressed on a scale from 1:1 (identical) to 21:1 (black on white). WCAG 2 Level AA requires at least 4.5:1 for normal text and 3:1 for large text; user interface components and graphics need 3:1. Measure any color pair instantly with our [color contrast checker](/tools/contrast-checker).",
  },
  {
    term: "Conformance Level (A / AA / AAA)",
    id: "conformance-level",
    definition:
      "WCAG's three tiers of conformance. Level A covers the most basic barriers, Level AA is the standard referenced by virtually every law and contract worldwide, and Level AAA is the strictest tier, which even the W3C says may not be achievable for all content. Conformance is cumulative — meeting AA means meeting every A and AA success criterion. See how the levels fit together in our [WCAG hub](/wcag).",
  },
  {
    term: "EAA (European Accessibility Act)",
    id: "eaa",
    definition:
      "An EU directive (2019/882) that requires a wide range of private-sector products and services — e-commerce, banking, e-books, transport, telecoms, and more — to be accessible. Its obligations have applied to new products and services since June 28, 2025. For websites and apps, conformance is demonstrated against EN 301 549, which incorporates WCAG 2.1 Level AA.",
  },
  {
    term: "EN 301 549",
    id: "en-301-549",
    definition:
      "The European standard for accessibility of information and communication technology, covering websites, apps, documents, hardware, and support services. Its web requirements incorporate WCAG 2.1 Level AA. It is the harmonized standard used to show compliance with both the EU Web Accessibility Directive and the European Accessibility Act.",
  },
  {
    term: "Focus Indicator",
    id: "focus-indicator",
    definition:
      "The visible outline, ring, or highlight that shows which element currently has keyboard focus. WCAG Success Criterion 2.4.7 requires a visible focus indicator, and WCAG 2.2 adds minimum size and contrast expectations in 2.4.11 (Focus Not Obscured) and the AAA-level 2.4.13 (Focus Appearance). Never remove the outline without providing a clearly visible replacement — see our [keyboard accessibility guide](/guides/keyboard-accessibility) for patterns.",
  },
  {
    term: "Focus Order",
    id: "focus-order",
    definition:
      "The sequence in which interactive elements receive keyboard focus as a user presses Tab. WCAG Success Criterion 2.4.3 requires that this order preserve meaning and operability — focus should move in a way that matches the logical reading order, which usually means keeping DOM order aligned with visual order.",
  },
  {
    term: "Focus Trap (Keyboard Trap)",
    id: "focus-trap",
    definition:
      "A situation where keyboard focus enters a component and cannot leave using the keyboard alone, which violates WCAG Success Criterion 2.1.2. The one intentional exception is a modal dialog, which deliberately contains focus while open but must always be dismissible with Escape and return focus to the triggering element on close.",
  },
  {
    term: "Heading Structure",
    id: "heading-structure",
    definition:
      "The hierarchical outline created by h1–h6 elements. Screen reader users routinely navigate by jumping between headings, so a page should have one h1, use lower levels to nest subtopics, and avoid skipping levels (such as jumping from h2 to h4). Headings must be real heading elements, not just bold text.",
  },
  {
    term: "High Contrast Mode (Forced Colors)",
    id: "high-contrast-mode",
    definition:
      "An operating-system feature — most notably Windows Contrast Themes — that replaces a site's colors with a limited, user-chosen palette to improve readability. Browsers expose it to CSS through the forced-colors media query and system color keywords. Designs should not rely on background images or subtle color differences alone, because forced-colors mode strips many of them away.",
  },
  {
    term: "Inclusive Design",
    id: "inclusive-design",
    definition:
      "A design methodology that considers the full range of human diversity — ability, language, culture, age, and circumstance — from the start of a project rather than retrofitting fixes later. It overlaps with accessibility but is broader: solving for permanent disabilities (one arm) also helps temporary (arm injury) and situational (holding a baby) limitations.",
  },
  {
    term: "Keyboard Accessibility",
    id: "keyboard-accessibility",
    definition:
      "The principle that every piece of functionality must be operable with a keyboard alone, without requiring a mouse or specific timing (WCAG Success Criterion 2.1.1). It is foundational because screen readers, switch devices, and many other assistive technologies all drive the page through keyboard-style input. Our [complete keyboard accessibility guide](/guides/keyboard-accessibility) covers testing and common fixes.",
  },
  {
    term: "Landmark Regions",
    id: "landmark-regions",
    definition:
      "Major page areas — banner, navigation, main, complementary, contentinfo, search — that assistive technology users can jump between directly. HTML5 elements like <header>, <nav>, <main>, <aside>, and <footer> create landmarks automatically. Every page should have exactly one main landmark, and repeated landmarks (like multiple navs) should be given distinguishing labels; see the landmark roles in our [ARIA reference](/reference/aria).",
  },
  {
    term: "Live Region",
    id: "live-region",
    definition:
      "A page area marked with aria-live (or a role like status or alert) whose content changes are announced automatically by screen readers, even when focus is elsewhere. Use aria-live=\"polite\" for non-urgent updates such as search-result counts, and assertive (or role=\"alert\") only for critical messages, because assertive announcements interrupt whatever the user is doing.",
  },
  {
    term: "Name, Role, Value",
    id: "name-role-value",
    definition:
      "The requirement (WCAG Success Criterion 4.1.2) that every user interface component exposes its accessible name, its role (button, checkbox, tab), and its current states and values to assistive technology. Native HTML elements do this for free; custom widgets built from divs must supply all three through ARIA and keep them updated as state changes.",
  },
  {
    term: "PDF/UA",
    id: "pdf-ua",
    definition:
      "The ISO 14289 standard for universally accessible PDF documents. A conforming PDF is fully tagged with a logical structure tree, includes alternative text for images, marks the document language, and sets a correct reading order so screen readers can navigate it like a web page. Check your documents with our [PDF accessibility checker](/tools/pdf-accessibility-checker).",
  },
  {
    term: "POUR",
    id: "pour",
    definition:
      "The four principles that organize all of WCAG: Perceivable, Operable, Understandable, and Robust. Content must be perceivable through more than one sense, operable by keyboard and other inputs, understandable in language and behavior, and robust enough to work with current and future assistive technologies. Every [WCAG success criterion](/wcag) lives under one of these four principles.",
  },
  {
    term: "prefers-reduced-motion",
    id: "prefers-reduced-motion",
    definition:
      "A CSS media query that detects when a user has asked their operating system to minimize animation, often because motion triggers vestibular disorders, migraines, or nausea. Sites should use it to disable or tone down parallax effects, auto-playing animation, and large transitions. It complements WCAG 2.3.3 (Animation from Interactions).",
  },
  {
    term: "Programmatically Determined",
    id: "programmatically-determined",
    definition:
      "A phrase used throughout WCAG meaning that information can be reliably extracted by software — including assistive technology — from the markup itself, rather than existing only visually. A label is programmatically determined when it is linked with a <label> element or ARIA attribute; a heading is programmatically determined when it uses an actual heading tag rather than large bold text.",
  },
  {
    term: "Screen Magnifier",
    id: "screen-magnifier",
    definition:
      "Software that enlarges a portion of the screen, used by people with low vision. Examples include ZoomText, Windows Magnifier, and macOS Zoom. Because magnifier users see only a small slice of the page at a time, placing error messages or updates far from the user's point of focus can make them easy to miss entirely.",
  },
  {
    term: "Screen Reader",
    id: "screen-reader",
    definition:
      "Software that converts on-screen content into synthesized speech or braille output, used primarily by people who are blind or have low vision. Major screen readers include JAWS and NVDA on Windows, VoiceOver on Apple platforms, and TalkBack on Android. They navigate via the accessibility tree, so semantics matter more than visuals — learn how to test in our [screen reader testing guide](/guides/screen-reader-testing).",
  },
  {
    term: "Section 508",
    id: "section-508",
    definition:
      "A US federal law (part of the Rehabilitation Act) requiring federal agencies to make their electronic and information technology accessible, which in practice extends to vendors selling to the government. The 2017 \"refresh\" of the Section 508 standards incorporates WCAG 2.0 Level AA as the technical benchmark for web content.",
  },
  {
    term: "Semantic HTML",
    id: "semantic-html",
    definition:
      "Using HTML elements for their intended meaning — <button> for buttons, <nav> for navigation, <table> for tabular data — instead of generic <div> and <span> containers styled to look the part. Semantic elements come with built-in roles, keyboard behavior, and accessibility tree entries for free. Our [accessible component patterns](/learn) show semantic-first implementations of common UI.",
  },
  {
    term: "Skip Link",
    id: "skip-link",
    definition:
      "A link, usually the first focusable element on a page, that lets keyboard users jump straight to the main content instead of tabbing through the entire header and navigation on every page. It is typically visually hidden until it receives focus. Skip links are the classic technique for WCAG Success Criterion 2.4.1 (Bypass Blocks).",
  },
  {
    term: "Success Criterion",
    id: "success-criterion",
    definition:
      "A single testable requirement in WCAG, identified by number and name — for example, 1.4.3 Contrast (Minimum). Each success criterion is assigned a conformance level (A, AA, or AAA) and is written so that testers can objectively determine pass or fail. WCAG 2.2 contains 86 success criteria in total; browse them all in our [WCAG reference](/wcag).",
  },
  {
    term: "Switch Access",
    id: "switch-access",
    definition:
      "An input method for people with significant motor disabilities that uses one or more physical switches — pressed by hand, head, foot, or breath — instead of a keyboard or mouse. Software scans through interface options and the user activates a switch to select. Switch access depends entirely on content being keyboard-operable, since switches map to keyboard-style focus and activation.",
  },
  {
    term: "Tab Order",
    id: "tab-order",
    definition:
      "The order in which focus moves through interactive elements when the user presses the Tab key. By default it follows DOM source order, which is why placing elements visually with CSS while leaving the DOM in a different order creates confusing navigation. Tab order should always match the expected visual and logical reading order.",
  },
  {
    term: "tabindex",
    id: "tabindex",
    definition:
      "An HTML attribute that controls whether and how an element participates in keyboard focus. tabindex=\"0\" adds an element to the natural tab order, tabindex=\"-1\" makes it focusable only via script (useful for moving focus to headings or dialogs), and positive values like tabindex=\"5\" override natural order and are strongly discouraged because they create unpredictable jumps.",
  },
  {
    term: "Text Spacing",
    id: "text-spacing",
    definition:
      "WCAG Success Criterion 1.4.12 requires that content lose nothing when users override typography to at least: line height 1.5× the font size, paragraph spacing 2×, letter spacing 0.12×, and word spacing 0.16×. People with dyslexia and low vision often apply these overrides, so layouts must not clip or overlap text when spacing grows.",
  },
  {
    term: "Touch Target",
    id: "touch-target",
    definition:
      "The tappable area of an interactive control on a touch screen. WCAG 2.2 Success Criterion 2.5.8 (Level AA) requires targets to be at least 24×24 CSS pixels or have equivalent spacing, while the AAA-level 2.5.5 recommends 44×44. Small, tightly packed targets are a major barrier for people with tremors or limited dexterity — our [WCAG 2.2 checklist](/checklists/wcag-2-2) covers the new criteria.",
  },
  {
    term: "Transcript",
    id: "transcript",
    definition:
      "A full text version of the spoken and important non-speech audio in a recording. Transcripts are the only way audio-only content (like podcasts) reaches deaf users, they help deafblind users via braille, and they make media searchable and skimmable for everyone. WCAG 1.2.1 requires a text alternative for prerecorded audio-only content.",
  },
  {
    term: "Unruh Act",
    id: "unruh-act",
    definition:
      "California's civil rights act, which prohibits discrimination by businesses and treats any ADA violation as an Unruh violation. Because it allows statutory damages of at least $4,000 per violation plus attorney's fees, it is a primary reason such a large share of US web accessibility lawsuits are filed in California courts.",
  },
  {
    term: "User Agent",
    id: "user-agent",
    definition:
      "Any software that retrieves and presents web content on behalf of a user — browsers, media players, and even assistive technologies acting alongside them. The W3C's User Agent Accessibility Guidelines (UAAG) cover this layer, complementing WCAG (content) and ATAG (authoring tools).",
  },
  {
    term: "Voice Control",
    id: "voice-control",
    definition:
      "Assistive technology that lets people operate a device by speaking commands, such as Dragon NaturallySpeaking, Apple Voice Control, or Android Voice Access. Users typically say the visible label of a control (\"click Submit\"), which is why WCAG 2.5.3 (Label in Name) requires an element's accessible name to contain its visible text.",
  },
  {
    term: "VPAT (Voluntary Product Accessibility Template)",
    id: "vpat",
    definition:
      "A standardized template, published by the Information Technology Industry Council, that vendors fill out to report how well their product meets accessibility standards. The completed document is called an Accessibility Conformance Report (ACR). Editions exist for WCAG, US Section 508, EU EN 301 549, and a combined international version, and procurement teams routinely request one before purchase.",
  },
  {
    term: "WAI (Web Accessibility Initiative)",
    id: "wai",
    definition:
      "The group within the W3C that develops web accessibility standards and resources. WAI produces WCAG for content, ATAG for authoring tools, UAAG for browsers, and the WAI-ARIA specification for rich applications, along with widely used educational material and the ARIA Authoring Practices Guide.",
  },
  {
    term: "WCAG (Web Content Accessibility Guidelines)",
    id: "wcag",
    definition:
      "The international standard for accessible web content, published by the W3C. WCAG 2.2 (2023) is the current version, organized under the four POUR principles into testable success criteria at levels A, AA, and AAA; WCAG 2.1 AA remains the benchmark cited by most laws. Browse every criterion in our [WCAG reference](/wcag) or work through the [WCAG 2.2 checklist](/checklists/wcag-2-2).",
  },
  {
    term: "Web Accessibility Audit",
    id: "web-accessibility-audit",
    definition:
      "A systematic evaluation of a website or app against an accessibility standard, usually WCAG 2.1 or 2.2 AA. A thorough audit combines automated scanning (which finds roughly a third of issues) with manual keyboard testing and [screen reader testing](/guides/screen-reader-testing), and produces a prioritized report of failures with remediation guidance.",
  },
  {
    term: "Zoom and Reflow",
    id: "zoom-and-reflow",
    definition:
      "WCAG Success Criterion 1.4.10 requires that content reflow — rewrap into a single column without two-dimensional scrolling — when zoomed to 400% on a 1280px-wide screen (equivalent to a 320px viewport). Responsive design generally achieves this, but fixed-width layouts, data tables, and text in images commonly break it, forcing low-vision users to scroll horizontally for every line.",
  },
]

const SITE_URL = "https://accessibility.build"
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")

const LINK_PATTERN = /\[([^\]]+)\]\(([^)]+)\)/g

function stripLinks(text: string): string {
  return text.replace(LINK_PATTERN, "$1")
}

function renderDefinition(text: string) {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g)
  return parts.map((part, index) => {
    const match = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part)
    if (match) {
      return (
        <Link
          key={index}
          href={match[2]}
          className="text-blue-600 dark:text-blue-400 font-medium underline underline-offset-2 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
        >
          {match[1]}
        </Link>
      )
    }
    return <span key={index}>{part}</span>
  })
}

function groupByLetter(list: GlossaryTerm[]): Map<string, GlossaryTerm[]> {
  const groups = new Map<string, GlossaryTerm[]>()
  for (const entry of list) {
    const letter = entry.term.charAt(0).toUpperCase()
    const group = groups.get(letter) ?? []
    group.push(entry)
    groups.set(letter, group)
  }
  return groups
}

const groupedTerms = groupByLetter(terms)

const definedTermSetSchema = {
  "@context": "https://schema.org",
  "@type": "DefinedTermSet",
  "@id": `${SITE_URL}/glossary`,
  name: "Web Accessibility Glossary",
  description:
    "Plain-language definitions of 50+ web accessibility terms, from ARIA and alt text to WCAG, VPAT, and the European Accessibility Act.",
  url: `${SITE_URL}/glossary`,
  inLanguage: "en-US",
  publisher: {
    "@type": "Organization",
    name: "Accessibility.build",
    url: SITE_URL,
  },
  hasDefinedTerm: terms.map((entry) => ({
    "@type": "DefinedTerm",
    name: entry.term,
    description: stripLinks(entry.definition),
    url: `${SITE_URL}/glossary#${entry.id}`,
    inDefinedTermSet: `${SITE_URL}/glossary`,
  })),
}

export default function GlossaryPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermSetSchema) }}
      />

      <BreadcrumbStructuredData
        breadcrumbs={[
          { name: "Home", url: SITE_URL },
          { name: "Glossary", url: `${SITE_URL}/glossary` },
        ]}
      />

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
                  <span className="text-slate-900 dark:text-white font-medium">
                    Glossary
                  </span>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        {/* Hero */}
        <header className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
            Web Accessibility Glossary
          </h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            Plain-language definitions of {terms.length}+ terms you will meet in
            accessibility work — standards like WCAG and EN 301 549, technologies
            like ARIA and screen readers, and legal concepts like the ADA, Section
            508, and the European Accessibility Act. Jump to a letter below or
            scroll through the full list.
          </p>
        </header>

        {/* A-Z jump navigation */}
        <nav
          aria-label="Glossary letters"
          className="sticky top-0 z-20 bg-white/95 dark:bg-slate-950/95 backdrop-blur border-y border-slate-200 dark:border-slate-800"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <ul className="flex flex-wrap gap-1">
              {LETTERS.map((letter) => {
                const hasTerms = groupedTerms.has(letter)
                return (
                  <li key={letter}>
                    {hasTerms ? (
                      <a
                        href={`#letter-${letter.toLowerCase()}`}
                        className="flex items-center justify-center w-8 h-8 rounded-md text-sm font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                      >
                        {letter}
                      </a>
                    ) : (
                      <span
                        aria-hidden="true"
                        className="flex items-center justify-center w-8 h-8 rounded-md text-sm font-medium text-slate-300 dark:text-slate-700"
                      >
                        {letter}
                      </span>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        </nav>

        {/* Glossary sections */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {LETTERS.filter((letter) => groupedTerms.has(letter)).map((letter) => (
            <section
              key={letter}
              id={`letter-${letter.toLowerCase()}`}
              aria-labelledby={`heading-letter-${letter.toLowerCase()}`}
              className="mb-12 scroll-mt-20"
            >
              <h2
                id={`heading-letter-${letter.toLowerCase()}`}
                className="text-3xl font-bold text-slate-900 dark:text-white border-b-2 border-blue-600 dark:border-blue-500 pb-2 mb-6"
              >
                {letter}
              </h2>
              <div className="space-y-4">
                {(groupedTerms.get(letter) ?? []).map((entry) => (
                  <Card
                    key={entry.id}
                    className="border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50"
                  >
                    <CardContent className="p-6">
                      <h3
                        id={entry.id}
                        className="text-xl font-semibold text-slate-900 dark:text-white scroll-mt-20"
                      >
                        <a
                          href={`#${entry.id}`}
                          className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          {entry.term}
                        </a>
                      </h3>
                      <p className="mt-3 text-slate-600 dark:text-slate-400 leading-relaxed">
                        {renderDefinition(entry.definition)}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          ))}

          {/* Footer CTA */}
          <section className="mt-4 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/40 p-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Put the vocabulary to work
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400 leading-relaxed">
              Now that you know the terms, dig into the details: browse every
              success criterion in the{" "}
              <Link
                href="/wcag"
                className="text-blue-600 dark:text-blue-400 font-medium underline underline-offset-2 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
              >
                WCAG reference
              </Link>
              , learn accessible component patterns in{" "}
              <Link
                href="/learn"
                className="text-blue-600 dark:text-blue-400 font-medium underline underline-offset-2 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
              >
                Learn
              </Link>
              , or test your site with our free accessibility tools.
            </p>
          </section>
        </main>
      </div>
    </>
  )
}
