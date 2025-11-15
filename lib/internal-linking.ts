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