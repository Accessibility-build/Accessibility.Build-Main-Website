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
    // We already appear for these head terms but rank poorly on them, so the
    // tool needs to win the internal link whenever a page mentions contrast.
    keywords: [
      'color', 'contrast', 'ratio', 'wcag', 'accessibility', 'vision', 'colorblind',
      'contrast checker', 'color contrast checker', 'colour contrast checker',
      'wcag contrast checker', 'contrast ratio', 'contrast ratio checker',
      'aa contrast', 'aaa contrast', 'non-text contrast', '4.5:1', '3:1',
      'apca', 'check color contrast', 'accessibility color checker',
    ],
    priority: 9
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
    url: '/research/accessibility-by-technology',
    title: 'Web Accessibility by Technology Stack',
    description: 'Average detected accessibility errors per home page by CMS, JavaScript framework, library, web framework, and ecommerce platform, measured across one million sites in February 2026',
    type: 'resource',
    keywords: ['most accessible cms', 'cms accessibility', 'wordpress accessibility', 'drupal accessibility', 'squarespace accessibility', 'wix accessibility', 'shopify accessibility', 'magento accessibility', 'accessible javascript framework', 'react accessibility statistics', 'vue accessibility statistics', 'astro accessibility', 'next.js accessibility', 'jquery accessibility', 'bootstrap accessibility', 'carousel accessibility', 'javascript library accessibility', 'platform accessibility comparison', 'accessibility by technology'],
    priority: 9
  },
  {
    url: '/research/accessibility-by-industry',
    title: 'Web Accessibility by Industry',
    description: 'Average detected accessibility errors per home page across 29 industry sectors and 17 languages, showing why regulated sectors such as government and education lead while retail trails',
    type: 'resource',
    keywords: ['accessibility by industry', 'accessibility by sector', 'government website accessibility', 'ecommerce accessibility statistics', 'healthcare website accessibility', 'education website accessibility', 'retail accessibility', 'industry benchmark', 'sector accessibility comparison', 'accessibility statistics by industry', 'wcag compliance by industry'],
    priority: 9
  },
  {
    url: '/research/disability-statistics',
    title: 'US Disability Prevalence',
    description: 'How many adults report a disability, prevalence by type from cognitive to vision, and the 2016 to 2022 trend, from CDC BRFSS data',
    type: 'resource',
    keywords: ['disability statistics', 'how many people have a disability', 'disability prevalence', 'percentage of adults with disabilities', 'cdc disability data', 'cognitive disability statistics', 'vision impairment statistics', 'hearing loss statistics', 'mobility disability', 'disability by type', 'accessibility business case', 'disability demographics'],
    priority: 10
  },
  {
    url: '/research/section-508-assessment',
    title: 'Section 508 Federal Agency Assessment',
    description: 'How United States federal agencies scored on accessibility conformance, policy, acquisition, and testing in the FY2025 governmentwide Section 508 assessment, with all 60 agencies ranked',
    type: 'resource',
    keywords: ['section 508 assessment', 'federal agency accessibility', 'section 508 compliance statistics', 'government accessibility data', 'accessibility conformance index', 'gsa section 508 report', 'federal accessibility scorecard', 'government website accessibility'],
    priority: 9
  },
  {
    url: '/research/accessibility-salary',
    title: 'Digital Accessibility Salary Report',
    description: 'What digital accessibility professionals earn by country, experience, work location, organisation size, and role, from the WebAIM global salary survey',
    type: 'resource',
    keywords: ['accessibility salary', 'digital accessibility salary', 'a11y salary', 'accessibility specialist salary', 'accessibility jobs', 'accessibility career', 'accessibility consultant rates', 'webaim salary survey', 'accessibility pay'],
    priority: 9
  },
  {
    url: '/research/european-accessibility-act',
    title: 'European Accessibility Act Tracker',
    description: 'Every EAA statutory date quoted from Directive (EU) 2019/882, national transposition measures for all 27 Member States, and the status of enforcement data',
    type: 'resource',
    keywords: ['european accessibility act', 'eaa deadline', 'eaa transposition', 'directive 2019/882', 'eaa enforcement', 'eu accessibility law', '28 june 2025', 'eaa member states', 'eaa compliance date'],
    priority: 9
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
    description: 'Complete guide to name, role, state, and value for UI components: accessible name computation, native HTML vs ARIA, code examples, common failures, and testing',
    type: 'guide',
    keywords: ['name role value', 'wcag 4.1.2', 'accessible name', 'aria-label', 'aria-labelledby', 'aria-pressed', 'aria role', 'custom component accessibility', 'accessibility tree', 'screen reader', 'form label', 'programmatically determinable', 'robust accessibility'],
    priority: 9
  },
  // WCAG 3.3.2 Labels or Instructions
  {
    url: '/wcag/3-3-2',
    title: 'WCAG 3.3.2 Labels or Instructions Guide',
    description: 'Complete guide to accessible form labels: the four label association methods, why placeholders fail, required and format hints, code examples, and testing',
    type: 'guide',
    keywords: ['labels or instructions', 'wcag 3.3.2', 'form labels', 'accessible forms', 'label association', 'placeholder not a label', 'aria-label', 'aria-describedby', 'fieldset legend', 'required field', 'form accessibility', 'input label', 'missing form label', 'level a'],
    priority: 9
  },
  // WCAG 3.3.1 Error Identification
  {
    url: '/wcag/3-3-1',
    title: 'WCAG 3.3.1 Error Identification Guide',
    description: 'Complete guide to identifying form errors and describing them in text: aria-invalid, aria-describedby, error summaries, live regions, code examples, and testing',
    type: 'guide',
    keywords: ['error identification', 'wcag 3.3.1', 'accessible form errors', 'form validation accessibility', 'aria-invalid', 'aria-describedby', 'error message accessibility', 'error summary', 'role alert', 'aria-live errors', 'inline validation', 'level a', 'form accessibility'],
    priority: 9
  },
  // WCAG 2.4.7 Focus Visible
  {
    url: '/wcag/2-4-7',
    title: 'WCAG 2.4.7 Focus Visible Guide',
    description: 'Complete guide to visible keyboard focus indicators: why never to remove the outline, :focus-visible, contrast and thickness, forced-colors support, code examples, and testing',
    type: 'guide',
    keywords: ['focus visible', 'wcag 2.4.7', 'keyboard focus indicator', 'focus-visible', 'focus ring', 'outline none', 'visible focus', 'focus styles css', 'keyboard accessibility', 'focus management', 'tab key focus', 'focus indicator contrast', 'level aa', 'wcag 2.2'],
    priority: 9
  },
  // WCAG 4.1.3 Status Messages
  {
    url: '/wcag/4-1-3',
    title: 'WCAG 4.1.3 Status Messages Guide',
    description: 'Complete guide to announcing dynamic changes to screen readers without moving focus: ARIA live regions, role=status vs role=alert, toasts, form errors, result counts, code examples, and testing',
    type: 'guide',
    keywords: ['status messages', 'wcag 4.1.3', 'aria-live', 'role status', 'role alert', 'aria-live polite', 'aria-live assertive', 'live region', 'screen reader announcement', 'toast accessibility', 'form validation accessibility', 'aria-atomic', 'dynamic content', 'level aa', 'wcag 2.1'],
    priority: 9
  },
  // WCAG 1.4.12 Text Spacing
  {
    url: '/wcag/1-4-12',
    title: 'WCAG 1.4.12 Text Spacing Guide',
    description: 'Complete guide to the four text-spacing values users must be able to override (line height 1.5, paragraph spacing 2×, letter spacing 0.12, word spacing 0.16), plus the test bookmarklet, why fixed-height containers clip text, CSS fixes, and testing',
    type: 'guide',
    keywords: ['text spacing', 'wcag 1.4.12', 'line height accessibility', 'letter spacing', 'word spacing', 'paragraph spacing', 'text spacing bookmarklet', 'fixed height clipping', 'line-height 1.5', 'min-height', 'overflow hidden', 'low vision', 'dyslexia', 'readability', 'distinguishable', 'level aa', 'wcag 2.1'],
    priority: 9
  },
  // WCAG 1.4.13 Content on Hover or Focus
  {
    url: '/wcag/1-4-13',
    title: 'WCAG 1.4.13 Content on Hover or Focus Guide',
    description: 'Complete guide to accessible tooltips and hover menus: the Dismissible, Hoverable, and Persistent conditions, why the title attribute fails, aria-describedby, copy-ready code, and testing',
    type: 'guide',
    keywords: ['content on hover or focus', 'wcag 1.4.13', 'accessible tooltip', 'tooltip accessibility', 'dismissible hoverable persistent', 'hover content accessibility', 'popover accessibility', 'hover menu accessibility', 'title attribute accessibility', 'aria-describedby tooltip', 'escape to dismiss', 'magnification accessibility', 'low vision', 'level aa', 'wcag 2.2'],
    priority: 9
  },
  // WCAG 2.4.11 Focus Not Obscured (Minimum)
  {
    url: '/wcag/2-4-11',
    title: 'WCAG 2.4.11 Focus Not Obscured (Minimum) Guide',
    description: 'Complete guide to keeping the keyboard-focused element visible: why sticky headers hide focus, the scroll-padding and scroll-margin fix, code examples, and testing',
    type: 'guide',
    keywords: ['focus not obscured', 'wcag 2.4.11', 'sticky header accessibility', 'scroll-padding', 'scroll-padding-top', 'scroll-margin', 'keyboard focus hidden', 'focus obscured', 'sticky footer', 'cookie banner accessibility', 'focus management', 'focus visible', 'keyboard accessibility', 'level aa', 'wcag 2.2'],
    priority: 9
  },
  // WCAG 2.5.7 Dragging Movements
  {
    url: '/wcag/2-5-7',
    title: 'WCAG 2.5.7 Dragging Movements Guide',
    description: 'Complete guide to providing a single-pointer alternative to every drag action: accessible patterns for sliders, sortable lists, kanban boards and maps, the two exceptions, code examples, and testing',
    type: 'guide',
    keywords: ['dragging movements', 'wcag 2.5.7', 'drag and drop accessibility', 'single pointer alternative', 'accessible drag and drop', 'sortable list accessibility', 'kanban accessibility', 'slider accessibility', 'reorder list accessibility', 'pointer input', 'motor disability', 'touch accessibility', 'level aa', 'wcag 2.2'],
    priority: 9
  },
  // WCAG 3.2.6 Consistent Help
  {
    url: '/wcag/3-2-6',
    title: 'WCAG 3.2.6 Consistent Help Guide',
    description: 'Complete guide to keeping help mechanisms in the same relative order across pages: the four covered help types, contact and chat placement, code examples, common mistakes, and testing',
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
    description: 'Case study of Alcazar v. Fashion Nova, the second-largest web accessibility settlement on record, and what it means for e-commerce',
    type: 'guide',
    keywords: ['fashion nova settlement', 'accessibility lawsuit', 'web accessibility class action', 'unruh act', 'ecommerce accessibility lawsuit', 'settlement', 'ada website settlement', 'litigation'],
    priority: 8
  },
  // ADA Website Lawsuit Cost Guide
  {
    url: '/guides/ada-website-lawsuit-cost',
    title: 'How Much Does an ADA Website Lawsuit Cost?',
    description: 'Data-backed breakdown of web accessibility lawsuit costs in 2026: demand letters, settlements, judgments, class actions, and defense fees',
    type: 'guide',
    keywords: ['ada website lawsuit cost', 'accessibility lawsuit', 'settlement cost', 'settlement costs', 'lawsuit defense cost', 'ada compliance', 'litigation', 'roi', 'lawsuit risk'],
    priority: 8
  },
  // AI-Driven Accessibility Lawsuits
  {
    url: '/guides/ai-accessibility-lawsuits',
    title: 'How AI Is Fueling ADA Website Lawsuits in 2026',
    description: 'How generative AI and automated scanners collapsed the cost of filing a web accessibility lawsuit: the pro se surge, repeat defendants, and how to protect your site',
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
  { url: "/compliance/en-301-549", title: "EN 301 549 Standard Guide", description: "The EU ICT accessibility standard explained: structure, WCAG relationship, and who needs it", type: "guide", keywords: ["en 301 549", "eu standard", "ict accessibility", "harmonized standard"], priority: 8 },
  { url: "/compliance/california", title: "California Website Accessibility & Unruh Act", description: "California web accessibility law: the Unruh Act, statutory damages, and lawsuit trends", type: "guide", keywords: ["california accessibility", "unruh act", "california ada", "unruh damages"], priority: 8 },
  { url: "/compliance/new-york", title: "New York Website Accessibility Laws", description: "New York web accessibility litigation landscape and state/city human rights laws", type: "guide", keywords: ["new york accessibility", "ny ada lawsuits", "nyshrl", "nychrl"], priority: 8 },
  // Industries
  { url: "/industries", title: "Accessibility by Industry", description: "Industry-specific accessibility compliance guides", type: "resource", keywords: ["industry accessibility", "sector compliance"], priority: 7 },
  { url: "/industries/ecommerce", title: "E-commerce Accessibility Guide", description: "WCAG and ADA compliance for online stores: product images, checkout, and lawsuit risk", type: "guide", keywords: ["ecommerce accessibility", "online store", "retail accessibility", "checkout accessibility", "shopify accessibility"], priority: 8 },
  { url: "/industries/healthcare", title: "Healthcare Website Accessibility Guide", description: "Accessibility compliance for healthcare: ADA, Section 1557, patient portals, telehealth", type: "guide", keywords: ["healthcare accessibility", "patient portal", "telehealth accessibility", "section 1557", "hospital website"], priority: 8 },
  { url: "/industries/education", title: "Education & EdTech Accessibility Guide", description: "Accessibility for schools and universities: Title II deadlines, Section 504, LMS content", type: "guide", keywords: ["education accessibility", "university accessibility", "edtech", "lms accessibility", "school website"], priority: 8 },
  { url: "/industries/government", title: "Government Web Accessibility Guide", description: "Section 508 and DOJ Title II requirements for government websites", type: "guide", keywords: ["government accessibility", "public sector", "title ii", "508 government", "municipal website"], priority: 8 },
  // Glossary + version/comparison guides
  { url: "/glossary", title: "Web Accessibility Glossary", description: "Plain-language definitions of 50+ accessibility terms", type: "resource", keywords: ["glossary", "definitions", "terminology", "what is", "accessibility terms"], priority: 7 },
  { url: "/guides/wcag-2-1-vs-2-2", title: "WCAG 2.1 vs 2.2: What Changed", description: "The 9 new success criteria, the removal of 4.1.1, and how to migrate to WCAG 2.2", type: "guide", keywords: ["wcag 2.1 vs 2.2", "wcag differences", "new wcag criteria", "wcag migration", "wcag 2.2 changes"], priority: 9 },
  { url: "/guides/wcag-2-2-aa-requirements", title: "WCAG 2.2 Level AA Requirements", description: "Complete list of every Level A and AA requirement for WCAG 2.2 conformance", type: "guide", keywords: ["wcag 2.2 aa", "aa requirements", "level aa checklist", "wcag conformance", "legal standard"], priority: 9 },
  { url: "/guides/react-accessibility", title: "React Accessibility Guide", description: "Semantic JSX, focus management, accessible modals, ARIA in JSX, live regions, forms with useId, and testing with jest-axe", type: "guide", keywords: ["react accessibility", "react a11y", "accessible react components", "react aria", "react focus management", "eslint-plugin-jsx-a11y", "jest-axe", "next.js accessibility"], priority: 9 },
  { url: "/guides/angular-accessibility", title: "Angular Accessibility Guide", description: "Semantic templates, ARIA binding with [attr.aria-*], focus on router navigation, dialogs with cdkTrapFocus, LiveAnnouncer, accessible reactive forms, and testing with @angular-eslint and jasmine-axe", type: "guide", keywords: ["angular accessibility", "angular a11y", "accessible angular components", "angular aria", "angular cdk a11y", "attr.aria-label", "angular focus management", "angular router focus", "liveannouncer", "cdktrapfocus", "angular reactive forms accessibility", "angular-eslint", "jasmine-axe", "wcag angular"], priority: 9 },
  { url: "/guides/vue-accessibility", title: "Vue Accessibility Guide", description: "Semantic templates, reactive :aria-* binding, focus on Vue Router navigation, dialogs with Teleport and focus traps, live regions with v-show, the inheritAttrs/$attrs fallthrough fix, accessible forms, and testing with eslint-plugin-vuejs-accessibility and vitest-axe", type: "guide", keywords: ["vue accessibility", "vue a11y", "vue 3 accessibility", "accessible vue components", "vue aria", "vue aria binding", "vue focus management", "vue router focus", "vue teleport dialog", "vue live region", "attribute fallthrough", "inheritattrs", "vue $attrs", "eslint-plugin-vuejs-accessibility", "vitest-axe", "wcag vue", "nuxt accessibility"], priority: 9 },
  { url: "/guides/svelte-accessibility", title: "Svelte Accessibility Guide", description: "Semantic markup, the Svelte compiler's built-in a11y warnings, reactive ARIA with runes, focus traps packaged as use: actions, SvelteKit route announcements and focus management, live regions that announce, accessible forms with bind:value, and testing with svelte-check and vitest-axe", type: "guide", keywords: ["svelte accessibility", "sveltekit accessibility", "svelte a11y", "svelte 5 accessibility", "accessible svelte components", "svelte aria", "svelte compiler a11y warnings", "svelte focus management", "sveltekit router focus", "sveltekit route announcements", "svelte use action focus trap", "svelte live region", "svelte accessible forms", "eslint-plugin-svelte", "svelte-check", "wcag svelte"], priority: 9 },
  { url: "/guides/mobile-accessibility", title: "Mobile Accessibility Guide", description: "Touch target sizing, pointer gestures and cancellation, orientation and text scaling, native iOS accessibility (UIKit and SwiftUI), native Android accessibility (View and Jetpack Compose), mobile web, and VoiceOver and TalkBack testing, mapped to WCAG 2.2 AA and WCAG2ICT", type: "guide", keywords: ["mobile accessibility", "mobile app accessibility", "ios accessibility", "android accessibility", "accessible mobile app", "swiftui accessibility", "uikit accessibility", "jetpack compose accessibility", "touch target size", "mobile wcag", "wcag2ict", "voiceover accessibility", "talkback accessibility", "dynamic type", "pointer gestures", "mobile web accessibility", "accessible touch targets", "wcag mobile"], priority: 9 },
  { url: "/guides/accessible-ai-chat", title: "Accessible AI Chat Interfaces Guide", description: "Build accessible AI chat and chatbot interfaces: announce streaming responses without flooding the screen reader, structure the message log with role=log, keep focus in the composer, make Send, Stop, and per-message actions keyboard-operable, and render AI output as semantic HTML, mapped to WCAG 2.2 with React", type: "guide", keywords: ["accessible ai chat", "accessible chatbot", "conversational ui accessibility", "ai chat accessibility", "chatbot accessibility", "streaming response accessibility", "aria-live chat", "role log chat", "accessible chat interface", "screen reader chatbot", "accessible ai assistant", "ai chat wcag", "live region streaming", "accessible llm interface", "chat focus management", "accessible conversational ai", "wcag 4.1.3", "status messages"], priority: 9 },
  { url: "/guides/cognitive-accessibility", title: "Cognitive Accessibility & Plain Language Guide", description: "Design for cognitive accessibility: plain language and reading level, scannable structure, consistent navigation and help, reduced memory load, and forgiving forms, mapped to the WCAG 2.2 cognitive criteria (3.2.6 Consistent Help, 3.3.7 Redundant Entry, 3.3.8 Accessible Authentication) and the W3C COGA guidance", type: "guide", keywords: ["cognitive accessibility", "plain language", "cognitive disability accessibility", "accessible content", "wcag cognitive", "coga", "making content usable", "readability accessibility", "reading level", "memory load accessibility", "accessible authentication", "redundant entry", "consistent help", "neurodiversity web accessibility", "low literacy accessibility", "dyslexia web content", "attention accessibility", "plain language guidelines", "wcag 3.3.8", "wcag 3.3.7"], priority: 9 },
  { url: "/guides/using-aria", title: "How to Use ARIA: Roles, States & Properties", description: "The cornerstone guide to using ARIA correctly: the five rules of ARIA, when native HTML wins, roles vs states vs properties, accessible names (aria-label vs aria-labelledby vs aria-describedby), landmark roles, the aria-hidden traps that break keyboard users, live regions, and the most common ARIA mistakes, mapped to WCAG 2.2", type: "guide", keywords: ["how to use aria", "using aria", "wai-aria", "aria roles states and properties", "aria roles", "five rules of aria", "rules of aria", "when not to use aria", "no aria is better than bad aria", "aria-label vs aria-labelledby", "aria-labelledby", "aria-describedby", "aria-hidden", "aria landmark roles", "aria live regions", "accessible name computation", "aria best practices", "wai-aria guide", "aria accessibility", "aria attributes"], priority: 9 },
  { url: "/guides/focus-management", title: "Focus Management Guide", description: "tabindex, :focus-visible, focus traps, restoration, roving tabindex, skip links, and route-change focus, mapped to WCAG 2.2", type: "guide", keywords: ["focus management", "tabindex", "focus-visible", "focus trap", "focus order", "roving tabindex", "skip link", "programmatic focus", "focus restoration", "wcag 2.4.3", "wcag 2.4.7", "focus not obscured"], priority: 9 },
  { url: "/guides/accessible-tabs", title: "Accessible Tabs Guide", description: "Build tabs with the WAI-ARIA Tabs pattern: tablist, tab, and tabpanel roles, aria-selected and aria-controls, roving tabindex, arrow-key navigation, automatic vs manual activation, and vertical tabs, with HTML, JavaScript, and React mapped to WCAG 2.2", type: "guide", keywords: ["accessible tabs", "aria tabs", "tabs pattern", "wai-aria tabs", "tablist", "tabpanel", "role tab", "aria-selected", "aria-controls", "tabs keyboard navigation", "accessible tab component", "roving tabindex", "tabs arrow keys", "manual vs automatic activation", "vertical tabs", "react accessible tabs", "wcag tabs"], priority: 9 },
  { url: "/guides/accessible-accordion", title: "Accessible Accordion & Disclosure Guide", description: "Build accessible accordions and disclosure widgets: the aria-expanded state, button-in-heading structure, aria-controls, the native details and summary element, single vs multi-expand, and the keyboard model, with HTML, JavaScript, and React mapped to WCAG 2.2", type: "guide", keywords: ["accessible accordion", "accordion accessibility", "disclosure widget", "aria disclosure pattern", "aria-expanded", "accordion aria", "details summary accessibility", "html details element", "accessible collapsible", "expand collapse accessibility", "accordion keyboard navigation", "accordion heading structure", "react accessible accordion", "single expand accordion", "wcag accordion", "show hide content"], priority: 9 },
  { url: "/guides/accessible-dialog", title: "Accessible Dialog & Modal Guide", description: "Build modal dialogs with the native <dialog> element and showModal(): where initial focus belongs, focus restoration when the trigger is removed, the inert top layer that replaces hand-rolled focus traps, alertdialog, declarative dialogs with command and commandfor, scroll locking and 400% zoom, plus the full ARIA fallback, mapped to WCAG 2.2", type: "guide", keywords: ["accessible dialog", "accessible modal", "html dialog element", "showModal accessibility", "aria-modal", "role dialog", "role alertdialog", "focus trap accessibility", "modal focus management", "inert attribute", "dialog keyboard accessibility", "escape key close modal", "focus restoration modal", "react accessible modal", "commandfor dialog", "wai-aria dialog pattern", "modal scroll lock accessibility"], priority: 9 },
  { url: "/guides/accessible-switch", title: "Accessible Switch & Toggle Guide", description: "When a toggle switch is the right control and when a checkbox is, the native input type=checkbox role=switch path that needs almost no JavaScript, keeping the accessible name fixed as the state moves, non-text contrast for the track and thumb, target size, immediate-effect semantics under 3.2.2 On Input, and React, with copy-ready code mapped to WCAG 2.2", type: "guide", keywords: ["accessible switch", "accessible toggle", "toggle switch accessibility", "role switch", "aria-checked", "switch vs checkbox", "aria switch pattern", "toggle button accessibility", "on off switch accessibility", "wai-aria switch pattern", "switch keyboard accessibility", "react accessible switch", "switch screen reader", "non-text contrast switch", "switch aria label", "wcag toggle switch"], priority: 9 },
  { url: "/guides/accessible-slider", title: "Accessible Slider & Range Input Guide", description: "Build accessible sliders and range inputs: the native <input type=range> that gives role=slider, keyboard, and click-to-set for free; the arrow / Home / End / Page keyboard contract; aria-valuenow, aria-valuemin, aria-valuemax and the aria-valuetext that turns a number into a readable value; the 2.5.7 dragging-movements alternative; dual-thumb range sliders; and React, mapped to WCAG 2.2", type: "guide", keywords: ["accessible slider", "accessible range input", "accessible range slider", "role slider", "aria-valuenow", "aria-valuetext", "aria-valuemin", "aria-valuemax", "input type range accessibility", "slider keyboard accessibility", "dual thumb range slider", "price range slider accessibility", "volume slider accessibility", "wai-aria slider pattern", "slider screen reader", "dragging movements", "react accessible slider", "wcag slider"], priority: 9 },
  { url: "/guides/accessible-tree-view", title: "Accessible Tree View Guide", description: "Build an accessible tree view: the role=tree / treeitem / group structure, the roving-tabindex focus model, the context-sensitive Right and Left arrows that expand, collapse, and move between parent and child, aria-expanded, aria-selected, aria-level, aria-setsize and aria-posinset, single vs multi-select, type-ahead, and React, mapped to WCAG 2.2, plus when a nested list of links is the better choice", type: "guide", keywords: ["accessible tree view", "role tree", "role treeitem", "aria tree pattern", "wai-aria tree view pattern", "tree view keyboard navigation", "roving tabindex tree", "aria-expanded tree", "aria-selected tree", "aria-level", "aria-setsize", "aria-posinset", "tree view accessibility", "file explorer accessibility", "accessible tree component react", "multi-select tree accessibility", "nested list accessibility", "wcag tree view"], priority: 9 },
  { url: "/guides/accessible-data-grid", title: "Accessible Data Grid Guide", description: "Build an accessible data grid: the role=grid / row / gridcell / columnheader structure built on a real <table>, two-dimensional arrow-key navigation, roving tabindex, the two focus modes (navigation vs actionable: Enter to enter a cell, Escape to leave), editable cells, cell and row selection, aria-rowcount / aria-colcount / aria-rowindex / aria-colindex for virtualized grids, treegrid, and React, mapped to WCAG 2.2, plus when a plain semantic table is the better choice", type: "guide", keywords: ["accessible data grid", "role grid", "role gridcell", "aria grid pattern", "wai-aria grid pattern", "data grid keyboard navigation", "grid arrow key navigation", "roving tabindex grid", "aria-colindex", "aria-rowindex", "aria-rowcount", "aria-colcount", "editable grid accessibility", "data grid accessibility", "accessible data table interactive", "grid vs table accessibility", "treegrid accessibility", "accessible data grid react", "spreadsheet accessibility", "wcag data grid"], priority: 9 },
  { url: "/guides/accessible-listbox", title: "Accessible Listbox Guide", description: "Build an accessible listbox: the role=listbox / option / group structure, single-select where selection follows focus, multi-select with aria-multiselectable and Space to toggle, aria-selected, the roving-tabindex vs aria-activedescendant focus choice, grouped and disabled options, type-ahead, and React, mapped to WCAG 2.2, plus when a group of checkboxes or a native select is the better choice", type: "guide", keywords: ["accessible listbox", "role listbox", "role option", "aria listbox pattern", "wai-aria listbox pattern", "listbox keyboard navigation", "aria-selected", "aria-multiselectable", "multi-select accessibility", "single select listbox", "roving tabindex listbox", "aria-activedescendant listbox", "selection follows focus", "accessible multi-select", "listbox vs select", "listbox vs checkbox group", "accessible listbox react", "listbox group option", "wcag listbox"], priority: 9 },
  { url: "/guides/accessible-form-validation", title: "Accessible Form Validation & Error Handling Guide", description: "Handle form errors so everyone can recover: when to validate (submit vs blur vs keystroke), tying an error to its field with aria-invalid and aria-describedby, the error-summary pattern with focus management, announcing inline errors through live regions without double-speaking, error suggestion and prevention, and WCAG 2.2's Redundant Entry and Accessible Authentication, mapped to WCAG 3.3.1 through 3.3.9 with React examples", type: "guide", keywords: ["accessible form validation", "accessible error messages", "form error accessibility", "aria-invalid", "aria-describedby", "aria-errormessage", "error summary pattern", "form validation accessibility", "inline validation accessibility", "aria-live form errors", "role alert form", "when to validate a form", "error identification", "error suggestion", "error prevention", "redundant entry", "accessible authentication", "novalidate", "constraint validation api", "accessible form errors react", "wcag 3.3.1", "wcag 3.3.3", "wcag 3.3.4", "wcag 3.3.7", "wcag 3.3.8", "screen reader form errors"], priority: 9 },
  { url: "/guides/accessible-menu", title: "Accessible Menu & Menu Button Guide", description: "When the WAI-ARIA Menu pattern applies and when it does not: the menu button built from aria-haspopup and aria-expanded, the roving-tabindex focus model, menuitemcheckbox and menuitemradio, submenus, and the disclosure pattern navigation dropdowns should use instead, with HTML, JavaScript, and React mapped to WCAG 2.2", type: "guide", keywords: ["accessible menu", "accessible dropdown menu", "aria menu pattern", "role menu", "role menuitem", "menubar accessibility", "aria-haspopup", "menu button accessibility", "accessible navigation dropdown", "roving tabindex menu", "menuitemcheckbox", "menuitemradio", "wai-aria menu", "menu keyboard navigation", "react accessible menu", "disclosure navigation pattern", "dropdown accessibility"], priority: 9 },
  { url: "/guides/accessible-combobox", title: "Accessible Combobox & Autocomplete Guide", description: "Build accessible autocomplete with the WAI-ARIA Combobox pattern: role=combobox on the input, aria-expanded, aria-controls, aria-autocomplete, and the aria-activedescendant virtual-focus model, plus the native datalist element, result-count announcements, and the keyboard model, with HTML, JavaScript, and React mapped to WCAG 2.2", type: "guide", keywords: ["accessible combobox", "combobox accessibility", "accessible autocomplete", "aria combobox pattern", "aria-activedescendant", "role combobox", "aria-autocomplete", "aria-controls listbox", "typeahead accessibility", "autosuggest accessibility", "wai-aria combobox", "combobox keyboard navigation", "react accessible combobox", "datalist accessibility", "accessible search suggestions", "listbox option", "wcag combobox"], priority: 9 },
  { url: "/guides/nvda-screen-reader-testing", title: "NVDA Screen Reader Testing Guide", description: "Test websites with NVDA, the free Windows screen reader: install, browse vs focus mode, the NVDA modifier key, Elements List, and a full keyboard command cheat sheet mapped to WCAG 2.2 AA", type: "guide", keywords: ["nvda", "nvda screen reader", "nvda testing", "how to use nvda", "nvda keyboard shortcuts", "nvda cheat sheet", "nvda browse mode", "nvda focus mode", "nvda modifier key", "screen reader testing", "elements list", "status messages", "wcag 4.1.2", "wcag 4.1.3"], priority: 9 },
  { url: "/guides/voiceover-screen-reader-testing", title: "VoiceOver Screen Reader Testing Guide", description: "Test websites with VoiceOver on macOS and iOS: turn it on, master the VO keys and the Rotor, use iPhone gestures, and run a repeatable testing workflow with full command cheat sheets mapped to WCAG 2.2 AA", type: "guide", keywords: ["voiceover", "voiceover screen reader", "voiceover testing", "how to use voiceover", "voiceover mac", "voiceover ios", "voiceover iphone", "voiceover keyboard shortcuts", "voiceover rotor", "vo keys", "voiceover gestures", "voiceover cheat sheet", "screen reader testing", "wcag 4.1.2", "wcag 4.1.3"], priority: 9 },
  { url: "/guides/jaws-screen-reader-testing", title: "JAWS Screen Reader Testing Guide", description: "Test websites with JAWS, the most used Windows screen reader: demo mode install, the JAWS key, Virtual Cursor vs Forms Mode, quick navigation keys, element lists, and a full command cheat sheet mapped to WCAG 2.2 AA", type: "guide", keywords: ["jaws", "jaws screen reader", "jaws testing", "how to use jaws", "jaws keyboard shortcuts", "jaws cheat sheet", "jaws commands", "jaws key", "jaws virtual cursor", "jaws forms mode", "jaws quick navigation keys", "freedom scientific", "jaws vs nvda", "screen reader testing", "wcag 4.1.2", "wcag 4.1.3"], priority: 9 },
  { url: "/guides/talkback-screen-reader-testing", title: "TalkBack Screen Reader Testing Guide", description: "Test websites with TalkBack, Android's built-in screen reader: explore by touch, swipe navigation, reading controls, multi-finger gestures, and a full workflow mapped to WCAG 2.2 AA including Target Size and Pointer Gestures", type: "guide", keywords: ["talkback", "talkback screen reader", "talkback testing", "how to use talkback", "talkback gestures", "talkback cheat sheet", "talkback reading controls", "android screen reader", "android accessibility", "explore by touch", "mobile accessibility testing", "talkback vs voiceover", "screen reader testing", "wcag 2.5.8", "wcag 2.5.1", "wcag 4.1.2"], priority: 9 },
  { url: "/guides/accessibility-overlay-alternatives", title: "Accessibility Overlay Alternatives", description: "Real alternatives to overlay widgets: remediation, testing, audits, and training", type: "guide", keywords: ["overlay alternatives", "accessibe alternative", "userway alternative", "overlay replacement", "instead of overlay"], priority: 8 },
  { url: "/guides/automated-vs-manual-accessibility-testing", title: "Automated vs Manual Accessibility Testing", description: "What automated scans catch, what only manual testing finds, and the hybrid workflow", type: "guide", keywords: ["automated testing", "manual testing", "accessibility testing comparison", "testing workflow", "ci testing"], priority: 8 },
  { url: "/guides/axe-vs-wave", title: "axe vs WAVE Comparison", description: "Factual comparison of the two most popular accessibility testing tools", type: "guide", keywords: ["axe", "wave", "axe vs wave", "testing tools", "axe-core", "webaim wave"], priority: 8 },
  { url: "/guides/how-to-audit-website-accessibility", title: "How to Audit Website Accessibility", description: "Step-by-step accessibility audit methodology", type: "guide", keywords: ["accessibility audit", "how to audit", "audit methodology", "wcag audit", "audit process"], priority: 8 },
  { url: "/guides/ai-accessibility-audit", title: "AI Accessibility Audit Guide", description: "How AI-assisted accessibility auditing works and where it fits", type: "guide", keywords: ["ai audit", "ai accessibility", "automated audit", "ai testing"], priority: 7 },
  { url: "/guides/doj-title-ii-deadline-extension", title: "DOJ Title II Deadline Guide", description: "The DOJ Title II web rule deadlines and what public entities must do", type: "guide", keywords: ["doj title ii", "title ii deadline", "wcag deadline", "public entities", "april 2026"], priority: 8 },
  { url: "/guides/section-504-web-accessibility-deadline", title: "Section 504 Web Accessibility Deadline", description: "Section 504 digital accessibility requirements and deadlines", type: "guide", keywords: ["section 504", "504 deadline", "hhs rule", "recipients federal funding"], priority: 7 },
  { url: "/guides/accessible-color-palettes", title: "Accessible Color Palettes Guide", description: "How to build WCAG-compliant color systems for design systems and dark mode", type: "guide", keywords: ["accessible colors", "color palette", "color system", "dark mode accessibility", "design tokens"], priority: 8 },
  { url: "/guides/accessible-charts", title: "Accessible Charts & Data Visualization Guide", description: "Make charts, graphs, and dashboards accessible: the data table that is the real text alternative, SVG vs canvas vs images, labelling an SVG with role=img and aria-labelledby, never coding a series by colour alone, scalable axis text, keyboard-navigable interactive charts and hover-or-focus tooltips, what charting libraries give you, and React, mapped to WCAG 2.2", type: "guide", keywords: ["accessible charts", "accessible data visualization", "accessible graphs", "chart accessibility", "svg accessibility", "screen reader charts", "accessible bar chart", "chart alt text", "accessible data table chart", "figure figcaption chart", "color blind friendly charts", "accessible chart colors", "chart aria label", "svg role img", "svg title desc", "canvas chart accessibility", "d3 accessibility", "chart.js accessibility", "recharts accessibility", "highcharts accessibility", "accessible dashboard", "wcag charts", "images of text charts"], priority: 9 },
  { url: "/guides/accessible-data-tables", title: "Accessible Data Tables Guide", description: "Build data tables screen readers can read: the semantic table, caption, and th scope structure, scope vs the headers and id method for complex tables, responsive tables that keep their meaning at 320px, sortable and interactive tables with aria-sort and named row controls, ARIA table roles as a fallback, and when a plain table beats a grid, mapped to WCAG 2.2", type: "guide", keywords: ["accessible data tables", "accessible tables", "html table accessibility", "table scope attribute", "th scope col row", "table caption accessibility", "headers id attribute table", "complex table accessibility", "responsive accessible table", "aria-sort", "sortable table accessibility", "screen reader table navigation", "data table vs layout table", "role table", "wcag 1.3.1 tables", "semantic html table", "accessible table markup", "table header association", "accessible tables wcag"], priority: 9 },
  { url: "/guides/skip-links", title: "Skip Links & Bypass Blocks Guide", description: "Build a skip link that actually works: the first-focusable HTML, the visually-hidden-until-focused CSS, and the number one bug where the page scrolls but keyboard focus never moves because the target is not focusable. Plus landmarks and headings as the real bypass for screen reader users, multiple skip links, skip links in single-page apps and React, and how to test bypass blocks, mapped to WCAG 2.4.1", type: "guide", keywords: ["skip links", "skip link", "skip to main content", "skip navigation", "bypass blocks", "wcag 2.4.1", "skip link not working", "skip link focus", "skip link tabindex -1", "visually hidden skip link", "skip link css", "skip navigation link", "landmark regions accessibility", "aria landmarks", "skip link react", "skip link single page app", "keyboard bypass repeated content", "accessible skip link"], priority: 8 },
  { url: "/guides/landmarks-page-structure", title: "ARIA Landmarks & Page Structure Guide", description: "Landmarks and headings are the two maps a screen reader user navigates by, so an accessible page has to put its structure in the markup. Covers the eight landmark roles and the HTML that provides them, the scoping rule where header and footer are only landmarks at the top level, the section trap where a section is not a landmark until it has an accessible name, one main and naming repeated regions, the heading map and the debunked HTML5 document outline, complete coverage and reading order, and how NVDA, JAWS, and VoiceOver navigate by structure, mapped to WCAG 2.2", type: "guide", keywords: ["aria landmarks", "landmark roles", "html landmarks", "page structure accessibility", "semantic html accessibility", "accessible page structure", "landmark regions", "banner landmark", "main landmark", "navigation landmark", "complementary landmark", "contentinfo landmark", "region role", "search landmark", "section vs region aria", "html5 sectioning elements", "html5 document outline", "heading structure accessibility", "one main per page", "how to label landmarks", "screen reader landmark navigation", "semantic html", "wcag 1.3.1"], priority: 8 },
  { url: "/guides/accessible-breadcrumbs", title: "Accessible Breadcrumb Navigation Guide", description: "A breadcrumb trail shows where the current page sits in a site's hierarchy, and it answers to two audiences at once: screen reader users through ARIA, and search engines through BreadcrumbList structured data. Covers the semantic markup of a named nav landmark wrapping an ordered list, marking the current page with aria-current, hiding the separators from assistive technology, keeping the visible trail and the structured data in sync, and truncating long trails on mobile without breaking either, mapped to WCAG 2.4.8", type: "guide", keywords: ["accessible breadcrumbs", "breadcrumb accessibility", "aria breadcrumb", "breadcrumb navigation accessibility", "aria-current page", "aria-current breadcrumb", "breadcrumb aria-label", "accessible breadcrumb navigation", "breadcrumb separators accessibility", "breadcrumblist schema", "breadcrumb structured data", "breadcrumb ol vs ul", "breadcrumb wcag", "wcag 2.4.8 location", "breadcrumb screen reader", "accessible breadcrumb html", "breadcrumb current page", "responsive breadcrumbs accessibility", "nav aria-label breadcrumb"], priority: 8 },
  { url: "/guides/accessible-pagination", title: "Accessible Pagination Guide", description: "Pagination breaks a long list across pages, and it is navigation rather than a widget: a named nav landmark wrapping a list of controls. Covers giving each control an accessible name so 'Go to page 3' replaces a bare '3', marking the current page with aria-current, choosing links or buttons deliberately, the Previous and Next disabled-state trap where aria-disabled does not disable, hiding the ellipsis while keeping every page reachable, announcing the page change in single-page apps through a live region, and the Load More and infinite-scroll alternatives, mapped to WCAG 2.4.4", type: "guide", keywords: ["accessible pagination", "pagination accessibility", "aria pagination", "accessible pagination html", "pagination aria-current", "nav aria-label pagination", "pagination screen reader", "pagination previous next accessibility", "aria-disabled pagination", "accessible page numbers", "pagination link vs button", "accessible load more", "infinite scroll accessibility", "pagination wcag", "pagination link purpose", "pagination current page", "accessible pagination react", "pagination live region", "pagination keyboard accessibility", "pagination ellipsis accessibility"], priority: 8 },
  { url: "/guides/accessible-tooltip", title: "Accessible Tooltip & Toggletip Guide", description: "A tooltip and a toggletip look alike but are two different patterns, and choosing the wrong one is the most common accessibility bug in hover help. A tooltip is a supplement wired with aria-describedby that appears on hover and focus and holds only plain text; a toggletip is a button plus a live region that reveals information the user requests. Covers role=tooltip, why the title attribute is not an accessible tooltip, the rule that a tooltip can never contain a link or a button, naming an icon-only button versus describing it, touch and reflow, and testing, mapped to WCAG 1.4.13 Content on Hover or Focus", type: "guide", keywords: ["accessible tooltip", "tooltip accessibility", "aria tooltip", "role tooltip", "accessible toggletip", "toggletip vs tooltip", "tooltip aria-describedby", "accessible tooltip html", "tooltip screen reader", "tooltip keyboard accessibility", "title attribute accessibility", "tooltip wcag", "wcag 1.4.13", "content on hover or focus", "tooltip focus hover", "accessible tooltip react", "tooltip role status", "tooltip vs popover", "tooltip on mobile", "icon button tooltip accessibility"], priority: 8 },
  { url: "/guides/accessible-email", title: "Accessible Email HTML Guide", description: "Email clients force you into the nested-table, inline-CSS layouts the web abandoned, so email accessibility is about making that table soup read as a linear document. Covers role=presentation on layout tables, real semantic content, the lang attribute email templates forget, alt text that survives blocked images, bulletproof accessible buttons, descriptive links, single-column reflow, dark-mode contrast, the preheader, the plain-text alternative, and how to test an email with a screen reader, mapped to WCAG 2.2", type: "guide", keywords: ["accessible email", "email accessibility", "accessible html email", "accessible email design", "email accessibility best practices", "role presentation email table", "email layout table accessibility", "email alt text", "accessible email button", "bulletproof button accessibility", "email lang attribute", "email dark mode accessibility", "email preheader accessibility", "screen reader email", "wcag email", "accessible newsletter", "accessible marketing email"], priority: 8 },
  { url: "/guides/accessible-maps", title: "Accessible Maps & Geospatial Content Guide", description: "An interactive map is a picture of spatial data, so the accessible version is usually the same information delivered as text and structured controls. Covers deciding what job the map is doing, the map-plus-list pattern where the list is the source of truth, titles on embedded map iframes, keyboard-operable pan and zoom, markers as real named controls, single-pointer alternatives to dragging, static maps and alt text, and choropleth data maps as charts, mapped to WCAG 2.2", type: "guide", keywords: ["accessible maps", "map accessibility", "accessible interactive map", "accessible store locator", "google maps accessibility", "leaflet accessibility", "mapbox accessibility", "keyboard accessible map", "accessible map alternative", "map alt text", "accessible data map", "choropleth accessibility", "screen reader map", "embedded map accessibility", "accessible location finder", "map marker accessibility", "geospatial accessibility", "wcag maps"], priority: 8 },
  { url: "/guides/accessible-video-player", title: "Accessible Video & Media Player Guide", description: "Make video and audio accessible: which alternatives your media owes (captions, transcript, audio description) by prerecorded-vs-live and where the information lives, captions vs subtitles, WebVTT and the track element, when audio description is required (1.2.3 vs 1.2.5), transcripts as the underrated hero, keyboard-operable players that never autoplay sound, embedded YouTube and Vimeo, and React, mapped to WCAG 2.2", type: "guide", keywords: ["accessible video player", "accessible media", "video accessibility", "captions vs subtitles", "closed captions", "webvtt", "track element", "html5 video accessibility", "audio description", "video transcript accessibility", "descriptive transcript", "live captions", "cart captioning", "accessible audio player", "podcast transcript accessibility", "autoplay accessibility", "keyboard accessible video controls", "youtube video accessibility", "vimeo accessibility", "iframe title video", "media accessibility wcag", "wcag 1.2.1", "wcag 1.2.2", "wcag 1.2.5", "react accessible video"], priority: 9 },
  { url: "/guides/oklch-apca-color-systems", title: "OKLCH & APCA Color Systems Guide", description: "Perceptual color spaces and next-gen contrast for accessible design systems", type: "guide", keywords: ["oklch", "apca", "perceptual color", "wcag 3 contrast", "color science"], priority: 7 },
  { url: "/guides/accessible-typography-wcag", title: "Accessible Typography Guide", description: "WCAG-compliant typography: type scales, spacing, readability, and dyslexia-friendly choices", type: "guide", keywords: ["accessible typography", "font accessibility", "type scale", "readability", "dyslexia fonts"], priority: 8 },
  // Checklists
  { url: "/checklists/wcag-2-2/aaa", title: "WCAG 2.2 Level AAA Checklist", description: "Checklist for all Level AAA success criteria", type: "checklist", keywords: ["aaa checklist", "level aaa", "enhanced accessibility"], priority: 7 },
  { url: "/checklists/interactive", title: "Interactive WCAG Checklist", description: "Track your WCAG 2.2 compliance progress interactively", type: "checklist", keywords: ["interactive checklist", "progress tracking", "compliance tracking"], priority: 7 },
  // Remaining on-topic tools
  { url: "/tools/alt-text-generator", title: "AI Alt Text Generator", description: "Generate accessible alt text for images with AI", type: "tool", keywords: ["alt text", "image accessibility", "alt text generator", "image description"], priority: 8 },
  { url: "/tools/mobile-accessibility-checker", title: "Mobile Accessibility Checker", description: "Check touch targets and mobile WCAG compliance", type: "tool", keywords: ["mobile accessibility", "touch targets", "mobile wcag", "tap target"], priority: 7 },
  // The colour tools are the site's highest-traffic entry points (they carry
  // almost all organic clicks), so they get top priority and full keyword
  // coverage of the palette/colour query cluster rather than three terms each.
  { url: "/tools/color-palette-generator", title: "Accessible Color Palette Generator", description: "Generate WCAG-compliant color palettes with live UI preview", type: "tool", keywords: ["color palette generator", "accessible color palette generator", "accessible palette", "accessible colors", "wcag colors", "wcag color palette", "wcag color palette generator", "color palette builder", "accessible color scheme", "accessible color combinations", "ada color palette", "508 compliant colors", "dark mode palette", "color tokens", "tailwind colors", "colour palette generator", "accessible colour palette"], priority: 9 },
  { url: "/tools/accessible-palette-studio", title: "Accessible Palette Studio", description: "OKLCH + APCA + WCAG color system builder with design tokens export", type: "tool", keywords: ["palette studio", "oklch generator", "oklch", "apca palette", "apca contrast", "design tokens", "color system builder", "accessible design system colors", "perceptual color space"], priority: 9 },
  { url: "/tools/accessible-typography-studio", title: "Accessible Typography Studio", description: "WCAG + APCA type scale generator with readability analysis", type: "tool", keywords: ["typography studio", "type scale generator", "readability analyzer", "fluid typography", "accessible typography", "font size accessibility", "line height accessibility", "wcag text spacing"], priority: 9 },
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