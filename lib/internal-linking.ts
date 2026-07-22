// Smart Internal Linking System for SEO
// Automatically suggests relevant internal links based on content context

import { wcagCriteria } from "./wcag-data"
import { staticBlogPosts } from "./static-blog-posts"

interface InternalLink {
  url: string
  title: string
  description: string
  type: 'tool' | 'article' | 'resource' | 'checklist' | 'guide'
  keywords: string[]
  priority: number
}

interface ContentMatch {
  link: InternalLink
  relevanceScore: number
  matchedKeywords: string[]
}

// Comprehensive internal link database
const INTERNAL_LINKS: InternalLink[] = [
  // Tools
  {
    url: '/tools/accessibility-audit-helper',
    title: 'AI Accessibility Audit Helper',
    description: 'Expert WCAG analysis and accessibility guidance with AI',
    type: 'tool',
    keywords: ['accessibility', 'audit', 'wcag', 'ai', 'analysis', 'compliance', 'helper', 'testing'],
    priority: 10
  },
  {
    url: '/tools/heading-analyzer',
    title: 'Heading Structure Analyzer',
    description: 'Free tool to analyze H1-H6 heading hierarchy for SEO and accessibility',
    type: 'tool',
    keywords: ['heading', 'structure', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hierarchy', 'seo', 'semantic html'],
    priority: 9
  },
  {
    url: '/tools/contrast-checker',
    title: 'Color Contrast Checker',
    description: 'WCAG compliant color contrast ratio checker for accessibility',
    type: 'tool',
    keywords: ['color', 'contrast', 'ratio', 'wcag', 'accessibility', 'vision', 'colorblind'],
    priority: 8
  },
  {
    url: '/checklists/wcag-2-2',
    title: 'WCAG 2.2 Interactive Checklist',
    description: 'Complete interactive checklist with all 86 WCAG 2.2 success criteria',
    type: 'checklist',
    keywords: ['wcag 2.2', 'checklist', 'success criteria', 'compliance'],
    priority: 10
  },
  // Research Pages
  {
    url: '/research/state-of-accessibility',
    title: 'State of Web Accessibility Report',
    description: 'Annual data-driven research report on web accessibility across the top websites with interactive charts and downloadable data',
    type: 'resource',
    keywords: ['accessibility statistics', 'research', 'web accessibility data', 'audit results', 'accessibility report', 'state of accessibility', 'wcag violations', 'accessibility trends'],
    priority: 10
  },
  {
    url: '/research/accessibility-lawsuits',
    title: 'Accessibility Lawsuit Tracker',
    description: 'Updated statistics on ADA and accessibility lawsuits by year, industry, and jurisdiction with settlement cost data',
    type: 'resource',
    keywords: ['accessibility lawsuits', 'ada lawsuits', 'lawsuit tracker', 'accessibility legal', 'settlement costs', 'lawsuit statistics', 'ada compliance', 'litigation'],
    priority: 10
  },
  // Guides
  {
    url: '/guides/accessible-forms',
    title: 'Accessible Forms Guide',
    description: 'Build forms everyone can complete: labels, required fields, accessible validation and error messages, fieldset grouping, autocomplete, and multi-step patterns mapped to WCAG 2.2 AA',
    type: 'guide',
    keywords: ['accessible forms', 'form accessibility', 'accessible form validation', 'accessible error messages', 'form labels', 'aria-describedby', 'aria-invalid', 'fieldset legend', 'autocomplete', 'required fields', 'error prevention', 'wcag 3.3.1', 'wcag 3.3.2', 'multi-step forms'],
    priority: 9
  },
  {
    url: '/guides/keyboard-accessibility',
    title: 'Complete Keyboard Accessibility Guide',
    description: 'Definitive guide to keyboard accessibility with interactive demos, code examples, and testing checklists',
    type: 'guide',
    keywords: ['keyboard accessibility', 'focus management', 'skip links', 'keyboard navigation', 'tab order', 'roving tabindex', 'keyboard trap', 'focus trapping', 'wcag 2.1.1'],
    priority: 9
  },
  {
    url: '/guides/screen-reader-testing',
    title: 'Screen Reader Testing Guide',
    description: 'Comprehensive guide to testing with NVDA, JAWS, VoiceOver, and TalkBack with command references and testing procedures',
    type: 'guide',
    keywords: ['screen reader testing', 'nvda', 'jaws', 'voiceover', 'talkback', 'assistive technology', 'screen reader commands', 'accessibility testing'],
    priority: 9
  },
  // WCAG 3.0 Pages
  {
    url: '/wcag-3',
    title: 'WCAG 3.0 Guide: W3C Accessibility Guidelines 3.0',
    description: 'Comprehensive guide to WCAG 3.0 with overview, guidelines, comparison, key concepts, and preparation steps',
    type: 'guide',
    keywords: ['wcag 3.0', 'wcag 3', 'w3c accessibility guidelines', 'wcag 3.0 overview', 'accessibility standards', 'next generation wcag'],
    priority: 10
  },
  {
    url: '/wcag-3/guidelines',
    title: 'WCAG 3.0 Guideline Categories Explained',
    description: 'Deep dive into all 12 WCAG 3.0 guideline categories with examples and WCAG 2.x mapping',
    type: 'guide',
    keywords: ['wcag 3.0 guidelines', 'wcag 3 categories', 'wcag 3.0 12 categories', 'guideline categories', 'pour principles'],
    priority: 9
  },
  {
    url: '/wcag-3/comparison',
    title: 'WCAG 3.0 vs WCAG 2.2 Comparison',
    description: 'Side-by-side comparison of WCAG 3.0 and WCAG 2.2 covering conformance, scope, structure, and testing differences',
    type: 'guide',
    keywords: ['wcag 3 vs wcag 2', 'wcag comparison', 'wcag 3.0 differences', 'wcag 2.2 vs 3.0', 'conformance model'],
    priority: 9
  },
  {
    url: '/wcag-3/concepts',
    title: 'WCAG 3.0 Key Concepts and Terminology',
    description: 'Reference guide to WCAG 3.0 terminology: outcomes, methods, assertions, functional needs, and requirements',
    type: 'guide',
    keywords: ['wcag 3.0 concepts', 'wcag 3 terminology', 'outcomes', 'methods', 'assertions', 'functional needs', 'requirements'],
    priority: 8
  },
  {
    url: '/wcag-3/preparation',
    title: 'How to Prepare for WCAG 3.0',
    description: 'Practical action plan for teams and organizations to prepare for WCAG 3.0 transition',
    type: 'guide',
    keywords: ['prepare wcag 3.0', 'wcag 3 preparation', 'wcag 3 transition', 'wcag 3 action plan', 'accessibility roadmap'],
    priority: 8
  },
  // ROI Calculator Tool
  {
    url: '/tools/accessibility-roi-calculator',
    title: 'Accessibility ROI Calculator',
    description: 'Calculate the return on investment for accessibility improvements including lawsuit risk and revenue impact',
    type: 'tool',
    keywords: ['accessibility roi', 'business case accessibility', 'roi calculator', 'accessibility investment', 'cost benefit accessibility', 'lawsuit risk', 'accessibility budget'],
    priority: 8
  },
  // ARIA Roles & Attributes Reference
  {
    url: '/reference/aria',
    title: 'ARIA Roles & Attributes Reference',
    description: 'Interactive WAI-ARIA reference with searchable roles, attributes, live playground, screen reader behavior, and copy-paste patterns',
    type: 'guide',
    keywords: ['aria', 'aria roles', 'aria attributes', 'aria-label', 'aria-labelledby', 'wai-aria', 'cheat sheet', 'reference', 'playground', 'screen reader', 'aria-hidden', 'aria-expanded', 'accessibility tree'],
    priority: 10
  },
  // Accessibility Laws by Jurisdiction
  {
    url: '/research/accessibility-laws',
    title: 'Accessibility Laws by Jurisdiction',
    description: 'Global tracker of accessibility laws comparing WCAG requirements, penalties, and enforcement across 35+ jurisdictions',
    type: 'resource',
    keywords: ['accessibility laws', 'ada title ii', 'european accessibility act', 'eaa', 'section 508', 'wcag legal', 'accessibility regulations', 'web accessibility laws', 'accessibility compliance', 'ada deadline', 'unruh act', 'aoda'],
    priority: 10
  },
  // Overlay Detector Tool
  {
    url: '/tools/overlay-detector',
    title: 'Accessibility Overlay Detector',
    description: 'Check if a website uses an accessibility overlay widget and see real WCAG violations the overlay fails to fix',
    type: 'tool',
    keywords: ['overlay', 'widget', 'accessibe', 'userway', 'audioeye', 'equalweb', 'overlay detector', 'overlay detection', 'accessibility widget'],
    priority: 9
  },
  // PDF Accessibility Checker Tool
  {
    url: '/tools/pdf-accessibility-checker',
    title: 'PDF Accessibility Checker',
    description: 'Upload a PDF to check for WCAG and PDF/UA compliance with AI-powered fix suggestions',
    type: 'tool',
    keywords: ['pdf', 'pdf accessibility', 'document', 'tagged pdf', 'pdf/ua', 'pdf checker', 'pdf remediation', 'pdf structure', 'pdf audit'],
    priority: 9
  },
  // Accessibility Overlays Guide
  {
    url: '/guides/accessibility-overlays',
    title: 'Accessibility Overlays: Why They Fail & What To Do Instead',
    description: 'Expert guide on why accessibility overlays do not work and what alternatives provide real WCAG compliance',
    type: 'guide',
    keywords: ['overlay', 'accessibe', 'userway', 'audioeye', 'widget', 'overlay alternative', 'overlay fail', 'overlay lawsuit', 'accessibility overlay'],
    priority: 8
  },
  // PDF Accessibility Guide
  {
    url: '/guides/pdf-accessibility',
    title: 'How to Make PDFs Accessible: WCAG & PDF/UA Guide',
    description: 'Complete guide to creating accessible PDFs with proper tags, headings, alt text, and reading order',
    type: 'guide',
    keywords: ['pdf', 'accessible pdf', 'tagged pdf', 'pdf/ua', 'pdf wcag', 'pdf remediation', 'document accessibility', 'pdf heading', 'pdf alt text'],
    priority: 8
  },
  // WCAG 2.5.8 Target Size (Minimum)
  {
    url: '/wcag/2-5-8',
    title: 'WCAG 2.5.8 Target Size (Minimum) Guide',
    description: 'Complete guide to the 24×24 CSS pixel tap target rule, all five exceptions, the spacing technique, code examples, and testing methods',
    type: 'guide',
    keywords: ['target size', 'wcag 2.5.8', '24x24 pixels', 'tap target size', 'touch target size', 'minimum target size', 'pointer target', 'mobile accessibility', 'button size', 'clickable area', 'wcag 2.2', 'spacing exception'],
    priority: 9
  },
  // WCAG 4.1.2 Name, Role, Value
  {
    url: '/wcag/4-1-2',
    title: 'WCAG 4.1.2 Name, Role, Value Guide',
    description: 'Complete guide to name, role, state, and value for UI components — accessible name computation, native HTML vs ARIA, code examples, common failures, and testing',
    type: 'guide',
    keywords: ['name role value', 'wcag 4.1.2', 'accessible name', 'aria-label', 'aria-labelledby', 'aria-pressed', 'aria role', 'custom component accessibility', 'accessibility tree', 'screen reader', 'form label', 'programmatically determinable', 'robust accessibility'],
    priority: 9
  },
  // WCAG 3.3.2 Labels or Instructions
  {
    url: '/wcag/3-3-2',
    title: 'WCAG 3.3.2 Labels or Instructions Guide',
    description: 'Complete guide to accessible form labels — the four label association methods, why placeholders fail, required and format hints, code examples, and testing',
    type: 'guide',
    keywords: ['labels or instructions', 'wcag 3.3.2', 'form labels', 'accessible forms', 'label association', 'placeholder not a label', 'aria-label', 'aria-describedby', 'fieldset legend', 'required field', 'form accessibility', 'input label', 'missing form label', 'level a'],
    priority: 9
  },
  // WCAG 3.3.1 Error Identification
  {
    url: '/wcag/3-3-1',
    title: 'WCAG 3.3.1 Error Identification Guide',
    description: 'Complete guide to identifying form errors and describing them in text — aria-invalid, aria-describedby, error summaries, live regions, code examples, and testing',
    type: 'guide',
    keywords: ['error identification', 'wcag 3.3.1', 'accessible form errors', 'form validation accessibility', 'aria-invalid', 'aria-describedby', 'error message accessibility', 'error summary', 'role alert', 'aria-live errors', 'inline validation', 'level a', 'form accessibility'],
    priority: 9
  },
  // WCAG 2.4.7 Focus Visible
  {
    url: '/wcag/2-4-7',
    title: 'WCAG 2.4.7 Focus Visible Guide',
    description: 'Complete guide to visible keyboard focus indicators — why never to remove the outline, :focus-visible, contrast and thickness, forced-colors support, code examples, and testing',
    type: 'guide',
    keywords: ['focus visible', 'wcag 2.4.7', 'keyboard focus indicator', 'focus-visible', 'focus ring', 'outline none', 'visible focus', 'focus styles css', 'keyboard accessibility', 'focus management', 'tab key focus', 'focus indicator contrast', 'level aa', 'wcag 2.2'],
    priority: 9
  },
  // WCAG 4.1.3 Status Messages
  {
    url: '/wcag/4-1-3',
    title: 'WCAG 4.1.3 Status Messages Guide',
    description: 'Complete guide to announcing dynamic changes to screen readers without moving focus — ARIA live regions, role=status vs role=alert, toasts, form errors, result counts, code examples, and testing',
    type: 'guide',
    keywords: ['status messages', 'wcag 4.1.3', 'aria-live', 'role status', 'role alert', 'aria-live polite', 'aria-live assertive', 'live region', 'screen reader announcement', 'toast accessibility', 'form validation accessibility', 'aria-atomic', 'dynamic content', 'level aa', 'wcag 2.1'],
    priority: 9
  },
  // WCAG 1.4.12 Text Spacing
  {
    url: '/wcag/1-4-12',
    title: 'WCAG 1.4.12 Text Spacing Guide',
    description: 'Complete guide to the four text-spacing values users must be able to override — line height 1.5, paragraph spacing 2×, letter spacing 0.12, word spacing 0.16 — the test bookmarklet, why fixed-height containers clip text, CSS fixes, and testing',
    type: 'guide',
    keywords: ['text spacing', 'wcag 1.4.12', 'line height accessibility', 'letter spacing', 'word spacing', 'paragraph spacing', 'text spacing bookmarklet', 'fixed height clipping', 'line-height 1.5', 'min-height', 'overflow hidden', 'low vision', 'dyslexia', 'readability', 'distinguishable', 'level aa', 'wcag 2.1'],
    priority: 9
  },
  // WCAG 1.4.13 Content on Hover or Focus
  {
    url: '/wcag/1-4-13',
    title: 'WCAG 1.4.13 Content on Hover or Focus Guide',
    description: 'Complete guide to accessible tooltips and hover menus — the Dismissible, Hoverable, and Persistent conditions, why the title attribute fails, aria-describedby, copy-ready code, and testing',
    type: 'guide',
    keywords: ['content on hover or focus', 'wcag 1.4.13', 'accessible tooltip', 'tooltip accessibility', 'dismissible hoverable persistent', 'hover content accessibility', 'popover accessibility', 'hover menu accessibility', 'title attribute accessibility', 'aria-describedby tooltip', 'escape to dismiss', 'magnification accessibility', 'low vision', 'level aa', 'wcag 2.2'],
    priority: 9
  },
  // WCAG 2.4.11 Focus Not Obscured (Minimum)
  {
    url: '/wcag/2-4-11',
    title: 'WCAG 2.4.11 Focus Not Obscured (Minimum) Guide',
    description: 'Complete guide to keeping the keyboard-focused element visible — why sticky headers hide focus, the scroll-padding and scroll-margin fix, code examples, and testing',
    type: 'guide',
    keywords: ['focus not obscured', 'wcag 2.4.11', 'sticky header accessibility', 'scroll-padding', 'scroll-padding-top', 'scroll-margin', 'keyboard focus hidden', 'focus obscured', 'sticky footer', 'cookie banner accessibility', 'focus management', 'focus visible', 'keyboard accessibility', 'level aa', 'wcag 2.2'],
    priority: 9
  },
  // WCAG 2.5.7 Dragging Movements
  {
    url: '/wcag/2-5-7',
    title: 'WCAG 2.5.7 Dragging Movements Guide',
    description: 'Complete guide to providing a single-pointer alternative to every drag action — accessible patterns for sliders, sortable lists, kanban boards and maps, the two exceptions, code examples, and testing',
    type: 'guide',
    keywords: ['dragging movements', 'wcag 2.5.7', 'drag and drop accessibility', 'single pointer alternative', 'accessible drag and drop', 'sortable list accessibility', 'kanban accessibility', 'slider accessibility', 'reorder list accessibility', 'pointer input', 'motor disability', 'touch accessibility', 'level aa', 'wcag 2.2'],
    priority: 9
  },
  // WCAG 3.2.6 Consistent Help
  {
    url: '/wcag/3-2-6',
    title: 'WCAG 3.2.6 Consistent Help Guide',
    description: 'Complete guide to keeping help mechanisms in the same relative order across pages — the four covered help types, contact and chat placement, code examples, common mistakes, and testing',
    type: 'guide',
    keywords: ['consistent help', 'wcag 3.2.6', 'help mechanism accessibility', 'consistent navigation', 'contact information accessibility', 'help link placement', 'chat widget accessibility', 'chatbot accessibility', 'self-help option', 'same relative order', 'cognitive accessibility', 'predictable', 'level a', 'wcag 2.2'],
    priority: 9
  },
  // WCAG Success Criteria Hub
  {
    url: '/wcag',
    title: 'WCAG Success Criteria Guides',
    description: 'In-depth guides to WCAG Level A and AA success criteria with interactive examples, testing methods, and implementation code',
    type: 'guide',
    keywords: ['wcag', 'success criteria', 'wcag 2.2', 'level a', 'level aa', 'wcag guides', 'accessibility guidelines', 'wcag criteria'],
    priority: 9
  },
  // Fashion Nova Settlement Case Study
  {
    url: '/guides/fashion-nova-accessibility-settlement',
    title: 'The $5.15M Fashion Nova Web Accessibility Settlement',
    description: 'Case study of Alcazar v. Fashion Nova — the second-largest web accessibility settlement on record — and what it means for e-commerce',
    type: 'guide',
    keywords: ['fashion nova settlement', 'accessibility lawsuit', 'web accessibility class action', 'unruh act', 'ecommerce accessibility lawsuit', 'settlement', 'ada website settlement', 'litigation'],
    priority: 8
  },
  // ADA Website Lawsuit Cost Guide
  {
    url: '/guides/ada-website-lawsuit-cost',
    title: 'How Much Does an ADA Website Lawsuit Cost?',
    description: 'Data-backed breakdown of web accessibility lawsuit costs in 2026 — demand letters, settlements, judgments, class actions, and defense fees',
    type: 'guide',
    keywords: ['ada website lawsuit cost', 'accessibility lawsuit', 'settlement cost', 'settlement costs', 'lawsuit defense cost', 'ada compliance', 'litigation', 'roi', 'lawsuit risk'],
    priority: 8
  },
  // AI-Driven Accessibility Lawsuits
  {
    url: '/guides/ai-accessibility-lawsuits',
    title: 'How AI Is Fueling ADA Website Lawsuits in 2026',
    description: 'How generative AI and automated scanners collapsed the cost of filing a web accessibility lawsuit — the pro se surge, repeat defendants, and how to protect your site',
    type: 'guide',
    keywords: ['ai accessibility lawsuits', 'accessibility lawsuit', 'pro se', 'automated scanner', 'ada lawsuits', 'litigation', '2026 accessibility litigation', 'ada compliance', 'generative ai'],
    priority: 8
  }
]

// The rest of the database is generated from the site's data modules so new
// content is linkable without hand-maintaining this file.

const curatedUrls = new Set(INTERNAL_LINKS.map((l) => l.url))

// Every WCAG criterion page (skipping ones with richer curated entries above)
const wcagCriterionLinks: InternalLink[] = wcagCriteria
  .filter((c) => !curatedUrls.has(`/wcag/${c.number.replace(/\./g, "-")}`))
  .map((c) => ({
    url: `/wcag/${c.number.replace(/\./g, "-")}`,
    title: `WCAG ${c.number} ${c.title} Guide`,
    description: c.description,
    type: "guide" as const,
    keywords: [
      `wcag ${c.number}`,
      c.title.toLowerCase(),
      `level ${c.level.toLowerCase()}`,
      c.guideline.toLowerCase().replace(/^[\d.]+ /, ""),
      "wcag 2.2",
      "success criteria",
    ],
    priority: 7,
  }))

// Static blog posts (Sanity posts are surfaced via their own related-posts UI)
const blogLinks: InternalLink[] = staticBlogPosts.map((p) => ({
  url: `/blog/${p.slug}`,
  title: p.title,
  description: p.excerpt,
  type: "article" as const,
  keywords: [
    ...p.title.toLowerCase().split(" ").filter((w) => w.length > 3),
    p.category.toLowerCase(),
  ],
  priority: 6,
}))

const MORE_LINKS: InternalLink[] = [
  // Learn section
  { url: "/learn", title: "Accessible Component Patterns", description: "Interactive tutorials for building accessible UI components with live demos and code", type: "resource", keywords: ["component patterns", "accessible components", "ui patterns", "tutorials", "learn accessibility"], priority: 8 },
  { url: "/learn/table", title: "Accessible Data Table Pattern", description: "Build accessible data tables with semantic markup, sorting, and responsive behavior", type: "resource", keywords: ["accessible table", "data table", "table accessibility", "aria-sort", "semantic table"], priority: 7 },
  { url: "/learn/modals", title: "Accessible Modal Dialog Pattern", description: "Build accessible modal dialogs with focus trapping and keyboard controls", type: "resource", keywords: ["accessible modal", "dialog", "focus trap", "modal accessibility", "keyboard modal"], priority: 7 },
  { url: "/learn/carousels", title: "Accessible Carousel Pattern", description: "Build accessible carousels with keyboard navigation and reduced-motion support", type: "resource", keywords: ["accessible carousel", "slider accessibility", "carousel pattern", "reduced motion"], priority: 7 },
  { url: "/learn/pagination", title: "Accessible Pagination Pattern", description: "Accessible pagination, infinite scroll, and load-more patterns", type: "resource", keywords: ["accessible pagination", "infinite scroll accessibility", "pagination pattern"], priority: 7 },
  { url: "/learn/search", title: "Accessible Search Pattern", description: "Accessible search with ARIA combobox, announcements, and loading states", type: "resource", keywords: ["accessible search", "combobox", "autocomplete accessibility", "search pattern"], priority: 7 },
  // Compliance pages
  { url: "/compliance", title: "Accessibility Compliance & Laws Hub", description: "ADA, EAA, Section 508, EN 301 549, and state accessibility law guides", type: "resource", keywords: ["compliance", "accessibility laws", "legal requirements", "regulations"], priority: 8 },
  { url: "/compliance/ada", title: "ADA Website Compliance Guide", description: "ADA digital accessibility requirements, Title II and III, deadlines, and lawsuit risk", type: "guide", keywords: ["ada compliance", "ada website", "title ii", "title iii", "ada requirements", "doj rule"], priority: 9 },
  { url: "/compliance/eaa", title: "European Accessibility Act (EAA) Guide", description: "EAA compliance requirements, deadlines, scope, and how it relates to EN 301 549 and WCAG", type: "guide", keywords: ["eaa", "european accessibility act", "eu accessibility", "eaa compliance", "eaa deadline"], priority: 9 },
  { url: "/compliance/section-508", title: "Section 508 Compliance Guide", description: "Section 508 requirements for federal agencies and vendors, VPATs, and WCAG mapping", type: "guide", keywords: ["section 508", "508 compliance", "vpat", "federal accessibility", "government procurement"], priority: 8 },
  { url: "/compliance/en-301-549", title: "EN 301 549 Standard Guide", description: "The EU ICT accessibility standard explained — structure, WCAG relationship, and who needs it", type: "guide", keywords: ["en 301 549", "eu standard", "ict accessibility", "harmonized standard"], priority: 8 },
  { url: "/compliance/california", title: "California Website Accessibility & Unruh Act", description: "California web accessibility law — the Unruh Act, statutory damages, and lawsuit trends", type: "guide", keywords: ["california accessibility", "unruh act", "california ada", "unruh damages"], priority: 8 },
  { url: "/compliance/new-york", title: "New York Website Accessibility Laws", description: "New York web accessibility litigation landscape and state/city human rights laws", type: "guide", keywords: ["new york accessibility", "ny ada lawsuits", "nyshrl", "nychrl"], priority: 8 },
  // Industries
  { url: "/industries", title: "Accessibility by Industry", description: "Industry-specific accessibility compliance guides", type: "resource", keywords: ["industry accessibility", "sector compliance"], priority: 7 },
  { url: "/industries/ecommerce", title: "E-commerce Accessibility Guide", description: "WCAG and ADA compliance for online stores — product images, checkout, and lawsuit risk", type: "guide", keywords: ["ecommerce accessibility", "online store", "retail accessibility", "checkout accessibility", "shopify accessibility"], priority: 8 },
  { url: "/industries/healthcare", title: "Healthcare Website Accessibility Guide", description: "Accessibility compliance for healthcare — ADA, Section 1557, patient portals, telehealth", type: "guide", keywords: ["healthcare accessibility", "patient portal", "telehealth accessibility", "section 1557", "hospital website"], priority: 8 },
  { url: "/industries/education", title: "Education & EdTech Accessibility Guide", description: "Accessibility for schools and universities — Title II deadlines, Section 504, LMS content", type: "guide", keywords: ["education accessibility", "university accessibility", "edtech", "lms accessibility", "school website"], priority: 8 },
  { url: "/industries/government", title: "Government Web Accessibility Guide", description: "Section 508 and DOJ Title II requirements for government websites", type: "guide", keywords: ["government accessibility", "public sector", "title ii", "508 government", "municipal website"], priority: 8 },
  // Glossary + version/comparison guides
  { url: "/glossary", title: "Web Accessibility Glossary", description: "Plain-language definitions of 50+ accessibility terms", type: "resource", keywords: ["glossary", "definitions", "terminology", "what is", "accessibility terms"], priority: 7 },
  { url: "/guides/wcag-2-1-vs-2-2", title: "WCAG 2.1 vs 2.2: What Changed", description: "The 9 new success criteria, the removal of 4.1.1, and how to migrate to WCAG 2.2", type: "guide", keywords: ["wcag 2.1 vs 2.2", "wcag differences", "new wcag criteria", "wcag migration", "wcag 2.2 changes"], priority: 9 },
  { url: "/guides/wcag-2-2-aa-requirements", title: "WCAG 2.2 Level AA Requirements", description: "Complete list of every Level A and AA requirement for WCAG 2.2 conformance", type: "guide", keywords: ["wcag 2.2 aa", "aa requirements", "level aa checklist", "wcag conformance", "legal standard"], priority: 9 },
  { url: "/guides/react-accessibility", title: "React Accessibility Guide", description: "Semantic JSX, focus management, accessible modals, ARIA in JSX, live regions, forms with useId, and testing with jest-axe", type: "guide", keywords: ["react accessibility", "react a11y", "accessible react components", "react aria", "react focus management", "eslint-plugin-jsx-a11y", "jest-axe", "next.js accessibility"], priority: 9 },
  { url: "/guides/angular-accessibility", title: "Angular Accessibility Guide", description: "Semantic templates, ARIA binding with [attr.aria-*], focus on router navigation, dialogs with cdkTrapFocus, LiveAnnouncer, accessible reactive forms, and testing with @angular-eslint and jasmine-axe", type: "guide", keywords: ["angular accessibility", "angular a11y", "accessible angular components", "angular aria", "angular cdk a11y", "attr.aria-label", "angular focus management", "angular router focus", "liveannouncer", "cdktrapfocus", "angular reactive forms accessibility", "angular-eslint", "jasmine-axe", "wcag angular"], priority: 9 },
  { url: "/guides/vue-accessibility", title: "Vue Accessibility Guide", description: "Semantic templates, reactive :aria-* binding, focus on Vue Router navigation, dialogs with Teleport and focus traps, live regions with v-show, the inheritAttrs/$attrs fallthrough fix, accessible forms, and testing with eslint-plugin-vuejs-accessibility and vitest-axe", type: "guide", keywords: ["vue accessibility", "vue a11y", "vue 3 accessibility", "accessible vue components", "vue aria", "vue aria binding", "vue focus management", "vue router focus", "vue teleport dialog", "vue live region", "attribute fallthrough", "inheritattrs", "vue $attrs", "eslint-plugin-vuejs-accessibility", "vitest-axe", "wcag vue", "nuxt accessibility"], priority: 9 },
  { url: "/guides/focus-management", title: "Focus Management Guide", description: "tabindex, :focus-visible, focus traps, restoration, roving tabindex, skip links, and route-change focus — mapped to WCAG 2.2", type: "guide", keywords: ["focus management", "tabindex", "focus-visible", "focus trap", "focus order", "roving tabindex", "skip link", "programmatic focus", "focus restoration", "wcag 2.4.3", "wcag 2.4.7", "focus not obscured"], priority: 9 },
  { url: "/guides/accessible-tabs", title: "Accessible Tabs Guide", description: "Build tabs with the WAI-ARIA Tabs pattern: tablist, tab, and tabpanel roles, aria-selected and aria-controls, roving tabindex, arrow-key navigation, automatic vs manual activation, and vertical tabs — with HTML, JavaScript, and React mapped to WCAG 2.2", type: "guide", keywords: ["accessible tabs", "aria tabs", "tabs pattern", "wai-aria tabs", "tablist", "tabpanel", "role tab", "aria-selected", "aria-controls", "tabs keyboard navigation", "accessible tab component", "roving tabindex", "tabs arrow keys", "manual vs automatic activation", "vertical tabs", "react accessible tabs", "wcag tabs"], priority: 9 },
  { url: "/guides/accessible-accordion", title: "Accessible Accordion & Disclosure Guide", description: "Build accessible accordions and disclosure widgets: the aria-expanded state, button-in-heading structure, aria-controls, the native details and summary element, single vs multi-expand, and the keyboard model — with HTML, JavaScript, and React mapped to WCAG 2.2", type: "guide", keywords: ["accessible accordion", "accordion accessibility", "disclosure widget", "aria disclosure pattern", "aria-expanded", "accordion aria", "details summary accessibility", "html details element", "accessible collapsible", "expand collapse accessibility", "accordion keyboard navigation", "accordion heading structure", "react accessible accordion", "single expand accordion", "wcag accordion", "show hide content"], priority: 9 },
  { url: "/guides/accessible-combobox", title: "Accessible Combobox & Autocomplete Guide", description: "Build accessible autocomplete with the WAI-ARIA Combobox pattern: role=combobox on the input, aria-expanded, aria-controls, aria-autocomplete, and the aria-activedescendant virtual-focus model, plus the native datalist element, result-count announcements, and the keyboard model — with HTML, JavaScript, and React mapped to WCAG 2.2", type: "guide", keywords: ["accessible combobox", "combobox accessibility", "accessible autocomplete", "aria combobox pattern", "aria-activedescendant", "role combobox", "aria-autocomplete", "aria-controls listbox", "typeahead accessibility", "autosuggest accessibility", "wai-aria combobox", "combobox keyboard navigation", "react accessible combobox", "datalist accessibility", "accessible search suggestions", "listbox option", "wcag combobox"], priority: 9 },
  { url: "/guides/nvda-screen-reader-testing", title: "NVDA Screen Reader Testing Guide", description: "Test websites with NVDA, the free Windows screen reader: install, browse vs focus mode, the NVDA modifier key, Elements List, and a full keyboard command cheat sheet mapped to WCAG 2.2 AA", type: "guide", keywords: ["nvda", "nvda screen reader", "nvda testing", "how to use nvda", "nvda keyboard shortcuts", "nvda cheat sheet", "nvda browse mode", "nvda focus mode", "nvda modifier key", "screen reader testing", "elements list", "status messages", "wcag 4.1.2", "wcag 4.1.3"], priority: 9 },
  { url: "/guides/voiceover-screen-reader-testing", title: "VoiceOver Screen Reader Testing Guide", description: "Test websites with VoiceOver on macOS and iOS: turn it on, master the VO keys and the Rotor, use iPhone gestures, and run a repeatable testing workflow with full command cheat sheets mapped to WCAG 2.2 AA", type: "guide", keywords: ["voiceover", "voiceover screen reader", "voiceover testing", "how to use voiceover", "voiceover mac", "voiceover ios", "voiceover iphone", "voiceover keyboard shortcuts", "voiceover rotor", "vo keys", "voiceover gestures", "voiceover cheat sheet", "screen reader testing", "wcag 4.1.2", "wcag 4.1.3"], priority: 9 },
  { url: "/guides/jaws-screen-reader-testing", title: "JAWS Screen Reader Testing Guide", description: "Test websites with JAWS, the most used Windows screen reader: demo mode install, the JAWS key, Virtual Cursor vs Forms Mode, quick navigation keys, element lists, and a full command cheat sheet mapped to WCAG 2.2 AA", type: "guide", keywords: ["jaws", "jaws screen reader", "jaws testing", "how to use jaws", "jaws keyboard shortcuts", "jaws cheat sheet", "jaws commands", "jaws key", "jaws virtual cursor", "jaws forms mode", "jaws quick navigation keys", "freedom scientific", "jaws vs nvda", "screen reader testing", "wcag 4.1.2", "wcag 4.1.3"], priority: 9 },
  { url: "/guides/talkback-screen-reader-testing", title: "TalkBack Screen Reader Testing Guide", description: "Test websites with TalkBack, Android's built-in screen reader: explore by touch, swipe navigation, reading controls, multi-finger gestures, and a full workflow mapped to WCAG 2.2 AA including Target Size and Pointer Gestures", type: "guide", keywords: ["talkback", "talkback screen reader", "talkback testing", "how to use talkback", "talkback gestures", "talkback cheat sheet", "talkback reading controls", "android screen reader", "android accessibility", "explore by touch", "mobile accessibility testing", "talkback vs voiceover", "screen reader testing", "wcag 2.5.8", "wcag 2.5.1", "wcag 4.1.2"], priority: 9 },
  { url: "/guides/accessibility-overlay-alternatives", title: "Accessibility Overlay Alternatives", description: "Real alternatives to overlay widgets — remediation, testing, audits, and training", type: "guide", keywords: ["overlay alternatives", "accessibe alternative", "userway alternative", "overlay replacement", "instead of overlay"], priority: 8 },
  { url: "/guides/automated-vs-manual-accessibility-testing", title: "Automated vs Manual Accessibility Testing", description: "What automated scans catch, what only manual testing finds, and the hybrid workflow", type: "guide", keywords: ["automated testing", "manual testing", "accessibility testing comparison", "testing workflow", "ci testing"], priority: 8 },
  { url: "/guides/axe-vs-wave", title: "axe vs WAVE Comparison", description: "Factual comparison of the two most popular accessibility testing tools", type: "guide", keywords: ["axe", "wave", "axe vs wave", "testing tools", "axe-core", "webaim wave"], priority: 8 },
  { url: "/guides/how-to-audit-website-accessibility", title: "How to Audit Website Accessibility", description: "Step-by-step accessibility audit methodology", type: "guide", keywords: ["accessibility audit", "how to audit", "audit methodology", "wcag audit", "audit process"], priority: 8 },
  { url: "/guides/ai-accessibility-audit", title: "AI Accessibility Audit Guide", description: "How AI-assisted accessibility auditing works and where it fits", type: "guide", keywords: ["ai audit", "ai accessibility", "automated audit", "ai testing"], priority: 7 },
  { url: "/guides/doj-title-ii-deadline-extension", title: "DOJ Title II Deadline Guide", description: "The DOJ Title II web rule deadlines and what public entities must do", type: "guide", keywords: ["doj title ii", "title ii deadline", "wcag deadline", "public entities", "april 2026"], priority: 8 },
  { url: "/guides/section-504-web-accessibility-deadline", title: "Section 504 Web Accessibility Deadline", description: "Section 504 digital accessibility requirements and deadlines", type: "guide", keywords: ["section 504", "504 deadline", "hhs rule", "recipients federal funding"], priority: 7 },
  { url: "/guides/accessible-color-palettes", title: "Accessible Color Palettes Guide", description: "How to build WCAG-compliant color systems for design systems and dark mode", type: "guide", keywords: ["accessible colors", "color palette", "color system", "dark mode accessibility", "design tokens"], priority: 8 },
  { url: "/guides/oklch-apca-color-systems", title: "OKLCH & APCA Color Systems Guide", description: "Perceptual color spaces and next-gen contrast for accessible design systems", type: "guide", keywords: ["oklch", "apca", "perceptual color", "wcag 3 contrast", "color science"], priority: 7 },
  { url: "/guides/accessible-typography-wcag", title: "Accessible Typography Guide", description: "WCAG-compliant typography — type scales, spacing, readability, and dyslexia-friendly choices", type: "guide", keywords: ["accessible typography", "font accessibility", "type scale", "readability", "dyslexia fonts"], priority: 8 },
  // Checklists
  { url: "/checklists/wcag-2-2/aaa", title: "WCAG 2.2 Level AAA Checklist", description: "Checklist for all Level AAA success criteria", type: "checklist", keywords: ["aaa checklist", "level aaa", "enhanced accessibility"], priority: 7 },
  { url: "/checklists/interactive", title: "Interactive WCAG Checklist", description: "Track your WCAG 2.2 compliance progress interactively", type: "checklist", keywords: ["interactive checklist", "progress tracking", "compliance tracking"], priority: 7 },
  // Remaining on-topic tools
  { url: "/tools/alt-text-generator", title: "AI Alt Text Generator", description: "Generate accessible alt text for images with AI", type: "tool", keywords: ["alt text", "image accessibility", "alt text generator", "image description"], priority: 8 },
  { url: "/tools/mobile-accessibility-checker", title: "Mobile Accessibility Checker", description: "Check touch targets and mobile WCAG compliance", type: "tool", keywords: ["mobile accessibility", "touch targets", "mobile wcag", "tap target"], priority: 7 },
  { url: "/tools/color-palette-generator", title: "Accessible Color Palette Generator", description: "Generate WCAG-compliant color palettes with live UI preview", type: "tool", keywords: ["color palette generator", "accessible palette", "wcag colors"], priority: 7 },
  { url: "/tools/accessible-palette-studio", title: "Accessible Palette Studio", description: "OKLCH + APCA + WCAG color system builder with design tokens export", type: "tool", keywords: ["palette studio", "oklch generator", "apca palette", "design tokens"], priority: 7 },
  { url: "/tools/accessible-typography-studio", title: "Accessible Typography Studio", description: "WCAG + APCA type scale generator with readability analysis", type: "tool", keywords: ["typography studio", "type scale generator", "readability analyzer", "fluid typography"], priority: 7 },
  { url: "/tools/url-accessibility-auditor", title: "URL Accessibility Auditor", description: "Audit any URL with axe-core and AI analysis", type: "tool", keywords: ["url auditor", "website audit", "axe-core", "page audit"], priority: 8 },
  { url: "/tools/scope-checker", title: "Scope Checker", description: "Crawl a site to find URLs, documents, and page titles for audit scoping", type: "tool", keywords: ["scope checker", "site crawler", "audit scope", "url finder"], priority: 6 },
  { url: "/tools/accessibility-code-generator", title: "AI Accessibility Code Generator", description: "Generate WCAG-compliant component code with AI", type: "tool", keywords: ["code generator", "accessible code", "component generator"], priority: 7 },
  { url: "/tools/accessibility-report-generator", title: "Accessibility Report Generator", description: "Generate professional PDF and Excel accessibility reports", type: "tool", keywords: ["report generator", "audit report", "pdf report", "vpat"], priority: 6 },
  { url: "/tools/accessibility-statement-generator", title: "Accessibility Statement Generator", description: "Create a WCAG-conformant accessibility statement for your site", type: "tool", keywords: ["accessibility statement", "statement generator", "conformance statement"], priority: 7 },
  { url: "/tools/ada-compliance-risks", title: "ADA Compliance Risk Assessment", description: "Assess your legal risk with current lawsuit data", type: "tool", keywords: ["ada risk", "compliance risk", "lawsuit risk", "risk calculator"], priority: 7 },
  // Research + reference
  { url: "/research", title: "Accessibility Research Hub", description: "Original accessibility research, data, and reports", type: "resource", keywords: ["research", "accessibility data", "reports", "statistics"], priority: 7 },
  { url: "/services/accessibility-audits", title: "Professional Accessibility Audits", description: "Expert manual WCAG audits with prioritized remediation guidance", type: "resource", keywords: ["professional audit", "manual audit", "audit service", "expert audit", "wcag audit service"], priority: 8 },
]

const ALL_LINKS: InternalLink[] = [
  ...INTERNAL_LINKS,
  ...wcagCriterionLinks,
  ...blogLinks,
  ...MORE_LINKS,
]

/**
 * Get related internal links for content
 */
export function getRelatedLinks(content: string, maxResults: number = 5, excludeUrl?: string): ContentMatch[] {
  const contentKeywords = content.toLowerCase().split(' ')
  const matches: ContentMatch[] = []

  ALL_LINKS.forEach(link => {
    // A page is never "related" to itself.
    if (excludeUrl && link.url === excludeUrl) return

    let score = 0
    const matchedKeywords: string[] = []
    
    // Check for keyword matches
    contentKeywords.forEach(keyword => {
      link.keywords.forEach(linkKeyword => {
        if (keyword.includes(linkKeyword) || linkKeyword.includes(keyword)) {
          score += 2
          if (!matchedKeywords.includes(linkKeyword)) {
            matchedKeywords.push(linkKeyword)
          }
        }
      })
    })
    
    if (score > 0) {
      matches.push({
        link,
        relevanceScore: score,
        matchedKeywords
      })
    }
  })
  
  return matches
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, maxResults)
}

// Export types
export type { InternalLink, ContentMatch } 