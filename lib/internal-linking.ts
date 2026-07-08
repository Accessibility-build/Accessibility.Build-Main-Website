// Smart Internal Linking System for SEO
// Automatically suggests relevant internal links based on content context

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
    description: 'Complete interactive checklist with all 78 WCAG 2.2 success criteria',
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

/**
 * Get related internal links for content
 */
export function getRelatedLinks(content: string, maxResults: number = 5): ContentMatch[] {
  const contentKeywords = content.toLowerCase().split(' ')
  const matches: ContentMatch[] = []
  
  INTERNAL_LINKS.forEach(link => {
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