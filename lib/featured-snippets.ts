// Featured Snippets Optimization System
// Automatically formats content to increase chances of appearing in Google Featured Snippets

interface FeaturedSnippetStructure {
  question: string
  answer: string
  type: 'paragraph' | 'list' | 'table' | 'step'
  keywords: string[]
  priority: number
}

interface OptimizedContent {
  structured: FeaturedSnippetStructure[]
  htmlOutput: string
  metaData: {
    totalQuestions: number
    highPriorityQuestions: number
    wordCount: number
    readabilityScore: number
  }
}

// High-value accessibility questions for Featured Snippets
const ACCESSIBILITY_QUESTIONS: FeaturedSnippetStructure[] = [
  {
    question: "What is WCAG 2.2?",
    answer: "WCAG 2.2 (Web Content Accessibility Guidelines 2.2) is the latest accessibility standard with 78 success criteria across 4 principles: Perceivable, Operable, Understandable, and Robust. It includes new criteria for mobile accessibility, focus appearance, and dragging movements.",
    type: 'paragraph',
    keywords: ['wcag 2.2', 'accessibility guidelines', 'success criteria', 'web accessibility'],
    priority: 10
  },
  {
    question: "How do I check color contrast for accessibility?",
    answer: "Use a color contrast checker tool to ensure your colors meet WCAG standards: 4.5:1 ratio for normal text (AA level) and 7:1 for AAA level. Large text needs 3:1 (AA) and 4.5:1 (AAA).",
    type: 'paragraph',
    keywords: ['color contrast', 'accessibility testing', 'wcag compliance', 'contrast ratio'],
    priority: 9
  },
  {
    question: "What are the 4 principles of accessibility?",
    answer: "The 4 WCAG principles are: 1) Perceivable - Information must be presentable in ways users can perceive, 2) Operable - Interface components must be operable, 3) Understandable - Information and UI operation must be understandable, 4) Robust - Content must be robust enough for various assistive technologies.",
    type: 'list',
    keywords: ['wcag principles', 'accessibility principles', 'pour principles'],
    priority: 10
  },
  {
    question: "How do I write good alt text for images?",
    answer: "Write descriptive alt text that conveys the purpose and content of images. Keep it concise (125 characters or less), avoid 'image of' or 'picture of', describe the function for interactive elements, and leave decorative images empty (alt='').",
    type: 'paragraph',
    keywords: ['alt text', 'image accessibility', 'screen readers', 'alternative text'],
    priority: 9
  },
  {
    question: "What is the difference between AA and AAA accessibility?",
    answer: "AA is the standard compliance level for most websites, requiring 4.5:1 color contrast and basic accessibility features. AAA is the highest level, requiring 7:1 contrast, additional language support, and enhanced usability features. Most organizations target AA compliance.",
    type: 'paragraph',
    keywords: ['aa vs aaa', 'accessibility levels', 'wcag compliance levels'],
    priority: 8
  },
  {
    question: "How do I make forms accessible?",
    answer: "Make forms accessible by: 1) Using proper labels for all inputs, 2) Providing clear error messages, 3) Grouping related fields with fieldsets, 4) Using ARIA attributes for complex interactions, 5) Ensuring keyboard navigation works, 6) Adding instructions and help text.",
    type: 'list',
    keywords: ['accessible forms', 'form accessibility', 'form labels', 'aria forms'],
    priority: 8
  },
  {
    question: "What is semantic HTML and why is it important for accessibility?",
    answer: "Semantic HTML uses elements that convey meaning about content structure (like <header>, <nav>, <main>, <article>). It's crucial for accessibility because screen readers rely on semantic structure to navigate and understand content hierarchy.",
    type: 'paragraph',
    keywords: ['semantic html', 'html accessibility', 'screen readers', 'html structure'],
    priority: 7
  },
  {
    question: "How do I test my website for accessibility?",
    answer: "Test accessibility using: 1) Automated tools like axe-core or WAVE, 2) Manual keyboard navigation testing, 3) Screen reader testing, 4) Color contrast analysis, 5) Focus management verification, 6) Professional accessibility audits.",
    type: 'list',
    keywords: ['accessibility testing', 'accessibility audit', 'website testing', 'a11y testing'],
    priority: 9
  }
]

/**
 * Format content for Featured Snippet optimization
 */
export function optimizeForFeaturedSnippets(content: string, focusKeywords: string[] = []): OptimizedContent {
  const relevantQuestions = findRelevantQuestions(content, focusKeywords)
  const htmlOutput = generateStructuredHTML(relevantQuestions)
  
  return {
    structured: relevantQuestions,
    htmlOutput,
    metaData: {
      totalQuestions: relevantQuestions.length,
      highPriorityQuestions: relevantQuestions.filter(q => q.priority >= 8).length,
      wordCount: content.split(' ').length,
      readabilityScore: calculateReadabilityScore(content)
    }
  }
}

/**
 * Find questions relevant to the content
 */
function findRelevantQuestions(content: string, keywords: string[]): FeaturedSnippetStructure[] {
  const contentLower = content.toLowerCase()
  const allKeywords = [...keywords.map(k => k.toLowerCase())]
  
  return ACCESSIBILITY_QUESTIONS.filter(question => {
    // Check if question keywords match content or provided keywords
    const keywordMatch = question.keywords.some(qk => 
      contentLower.includes(qk) || allKeywords.some(k => k.includes(qk) || qk.includes(k))
    )
    
    // Check if question text relates to content
    const questionWords = question.question.toLowerCase().split(' ')
    const contentMatch = questionWords.some(word => contentLower.includes(word))
    
    return keywordMatch || contentMatch
  }).sort((a, b) => b.priority - a.priority)
}

/**
 * Generate structured HTML for Featured Snippets
 */
function generateStructuredHTML(questions: FeaturedSnippetStructure[]): string {
  if (questions.length === 0) return ''
  
  let html = '<div class="featured-snippets-content">\n'
  
  questions.forEach((question, index) => {
    html += `  <div class="snippet-block" itemscope itemtype="https://schema.org/Question">\n`
    html += `    <h3 class="snippet-question" itemprop="name">${question.question}</h3>\n`
    
    if (question.type === 'list') {
      // Format as ordered list for step-by-step or numbered answers
      const listItems = question.answer.split(/\d+\)\s*/).filter(item => item.trim())
      html += `    <ol class="snippet-list" itemprop="acceptedAnswer" itemscope itemtype="https://schema.org/Answer">\n`
      html += `      <div itemprop="text">\n`
      listItems.forEach(item => {
        if (item.trim()) {
          html += `        <li>${item.trim()}</li>\n`
        }
      })
      html += `      </div>\n`
      html += `    </ol>\n`
    } else if (question.type === 'step') {
      // Format as step-by-step instructions
      const steps = question.answer.split(/\d+\)\s*/).filter(item => item.trim())
      html += `    <div class="snippet-steps" itemprop="acceptedAnswer" itemscope itemtype="https://schema.org/Answer">\n`
      html += `      <div itemprop="text">\n`
      steps.forEach((step, stepIndex) => {
        if (step.trim()) {
          html += `        <div class="step"><strong>Step ${stepIndex + 1}:</strong> ${step.trim()}</div>\n`
        }
      })
      html += `      </div>\n`
      html += `    </div>\n`
    } else {
      // Standard paragraph format
      html += `    <div class="snippet-answer" itemprop="acceptedAnswer" itemscope itemtype="https://schema.org/Answer">\n`
      html += `      <div itemprop="text">${question.answer}</div>\n`
      html += `    </div>\n`
    }
    
    html += `  </div>\n`
    if (index < questions.length - 1) html += `\n`
  })
  
  html += '</div>'
  return html
}

/**
 * Calculate readability score (simplified Flesch Reading Ease)
 */
function calculateReadabilityScore(text: string): number {
  const words = text.split(/\s+/).length
  const sentences = text.split(/[.!?]+/).length
  const syllables = text.split(/[aeiouAEIOU]/).length - 1
  
  if (words === 0 || sentences === 0) return 0
  
  const avgWordsPerSentence = words / sentences
  const avgSyllablesPerWord = syllables / words
  
  const score = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord)
  return Math.max(0, Math.min(100, Math.round(score)))
}

/**
 * Generate FAQ schema markup for Featured Snippets
 */
export function generateFAQSchema(questions: FeaturedSnippetStructure[]) {
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": questions.map(q => ({
      "@type": "Question",
      "name": q.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": q.answer
      }
    }))
  }
  
  return JSON.stringify(faqData, null, 2)
}

/**
 * Get question suggestions based on content
 */
export function getQuestionSuggestions(content: string, limit: number = 5): FeaturedSnippetStructure[] {
  const contentLower = content.toLowerCase()
  
  return ACCESSIBILITY_QUESTIONS.filter(question => {
    return question.keywords.some(keyword => contentLower.includes(keyword))
  }).slice(0, limit)
}

/**
 * Optimize existing FAQ content for Featured Snippets
 */
export function optimizeFAQContent(faqs: Array<{question: string, answer: string}>): string {
  let optimizedHTML = '<div class="faq-featured-snippets">\n'
  
  faqs.forEach((faq, index) => {
    optimizedHTML += `  <div class="faq-item" itemscope itemtype="https://schema.org/Question">\n`
    optimizedHTML += `    <h3 class="faq-question" itemprop="name">${faq.question}</h3>\n`
    optimizedHTML += `    <div class="faq-answer" itemprop="acceptedAnswer" itemscope itemtype="https://schema.org/Answer">\n`
    optimizedHTML += `      <div itemprop="text">${faq.answer}</div>\n`
    optimizedHTML += `    </div>\n`
    optimizedHTML += `  </div>\n`
    if (index < faqs.length - 1) optimizedHTML += `\n`
  })
  
  optimizedHTML += '</div>'
  return optimizedHTML
}

// Export types
export type { FeaturedSnippetStructure, OptimizedContent } 