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