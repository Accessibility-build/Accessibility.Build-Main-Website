// Advanced Image Optimization and Alt Text System
// Handles image SEO, performance optimization, and accessibility

interface ImageSEOData {
  src: string
  alt: string
  title?: string
  caption?: string
  description?: string
  keywords: string[]
  contextualKeywords: string[]
  priority: 'high' | 'medium' | 'low'
  loading: 'eager' | 'lazy'
  fetchPriority?: 'high' | 'low' | 'auto'
}

interface OptimizedImageProps {
  original: ImageSEOData
  optimized: {
    webp: string
    avif?: string
    placeholder: string
    blurDataURL: string
  }
  dimensions: {
    width: number
    height: number
    aspectRatio: string
  }
  seoScore: number
  accessibilityScore: number
}

// Context-aware alt text templates
const ALT_TEXT_TEMPLATES = {
  'tool-screenshot': {
    template: "Screenshot of {toolName} showing {functionality} with {visualElements}",
    keywords: ['screenshot', 'interface', 'dashboard', 'tool'],
    required: ['toolName', 'functionality']
  },
  'accessibility-diagram': {
    template: "Diagram illustrating {concept} for {audience} showing {keyElements}",
    keywords: ['diagram', 'illustration', 'chart', 'visual guide'],
    required: ['concept', 'keyElements']
  },
  'wcag-guideline': {
    template: "Visual example of {guidelineName} {successCriteria} showing {goodPractice} vs {badPractice}",
    keywords: ['wcag', 'guideline', 'example', 'best practice'],
    required: ['guidelineName', 'goodPractice']
  },
  'before-after': {
    template: "{beforeState} vs {afterState} comparison showing {improvement} in {context}",
    keywords: ['before', 'after', 'comparison', 'improvement'],
    required: ['beforeState', 'afterState', 'improvement']
  },
  'hero-image': {
    template: "{primarySubject} representing {theme} with {visualElements} in {style} style",
    keywords: ['hero', 'banner', 'header', 'featured'],
    required: ['primarySubject', 'theme']
  }
}

// Smart alt text generation based on context
export function generateContextualAltText(
  imageType: keyof typeof ALT_TEXT_TEMPLATES,
  context: Record<string, string>,
  fallbackDescription?: string
): string {
  const template = ALT_TEXT_TEMPLATES[imageType]
  
  if (!template) {
    return fallbackDescription || "Image related to accessibility and web development"
  }
  
  // Check if all required fields are provided
  const missingRequired = template.required.filter(field => !context[field])
  if (missingRequired.length > 0) {
    return fallbackDescription || "Image related to accessibility and web development"
  }
  
  // Replace template placeholders
  let altText = template.template
  Object.entries(context).forEach(([key, value]) => {
    altText = altText.replace(new RegExp(`{${key}}`, 'g'), value)
  })
  
  // Clean up any remaining placeholders
  altText = altText.replace(/{[^}]+}/g, '').replace(/\s+/g, ' ').trim()
  
  return altText
}

// Image SEO optimization
export function optimizeImageForSEO(imageData: Partial<ImageSEOData>): ImageSEOData {
  const optimized: ImageSEOData = {
    src: imageData.src || '',
    alt: imageData.alt || '',
    keywords: imageData.keywords || [],
    contextualKeywords: [],
    priority: 'medium',
    loading: 'lazy',
    ...imageData
  }
  
  // Enhance alt text if it's too basic
  if (optimized.alt.length < 10 || /^image|picture|photo$/i.test(optimized.alt)) {
    optimized.alt = enhanceAltText(optimized.alt, optimized.keywords, optimized.src)
  }
  
  // Generate contextual keywords from alt text and title
  optimized.contextualKeywords = extractContextualKeywords(
    [optimized.alt, optimized.title, optimized.description].join(' ')
  )
  
  // Determine loading strategy
  optimized.loading = determineLoadingStrategy(optimized.priority, optimized.src)
  
  return optimized
}

// Enhance basic alt text with SEO keywords
function enhanceAltText(basicAlt: string, keywords: string[], src: string): string {
  // Extract filename information
  const filename = src.split('/').pop()?.split('.')[0] || ''
  const filenameKeywords = filename.split(/[-_]/).filter(word => word.length > 2)
  
  // If alt text is empty or generic, create from filename + keywords
  if (!basicAlt || /^image|picture|photo$/i.test(basicAlt)) {
    const relevantKeywords = [...keywords, ...filenameKeywords].slice(0, 3)
    return `Image showing ${relevantKeywords.join(', ')}`
  }
  
  // Enhance existing alt text with keywords if they're not already included
  let enhanced = basicAlt
  keywords.forEach(keyword => {
    if (!enhanced.toLowerCase().includes(keyword.toLowerCase())) {
      // Add keyword naturally
      if (enhanced.toLowerCase().includes('showing') || enhanced.toLowerCase().includes('of')) {
        enhanced = enhanced.replace(/(showing|of)/i, `$1 ${keyword}`)
      } else {
        enhanced += ` related to ${keyword}`
      }
    }
  })
  
  return enhanced.slice(0, 125) // Keep under recommended length
}

// Extract contextual keywords from text
function extractContextualKeywords(text: string): string[] {
  const accessibilityTerms = [
    'accessibility', 'a11y', 'wcag', 'ada', 'inclusive design',
    'screen reader', 'keyboard navigation', 'color contrast',
    'alt text', 'aria', 'semantic html', 'focus management',
    'usability', 'disability', 'assistive technology',
    'compliance', 'testing', 'audit', 'guidelines'
  ]
  
  const foundTerms: string[] = []
  const textLower = text.toLowerCase()
  
  accessibilityTerms.forEach(term => {
    if (textLower.includes(term)) {
      foundTerms.push(term)
    }
  })
  
  return foundTerms
}

// Determine optimal loading strategy
function determineLoadingStrategy(priority: 'high' | 'medium' | 'low', src: string): 'eager' | 'lazy' {
  // Above-the-fold images should load eagerly
  if (priority === 'high') return 'eager'
  
  // Hero images and critical images load eagerly
  if (src.includes('hero') || src.includes('banner') || src.includes('logo')) {
    return 'eager'
  }
  
  return 'lazy'
}

// Generate structured data for images
export function generateImageStructuredData(imageData: ImageSEOData) {
  return {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    "url": imageData.src,
    "description": imageData.alt,
    "name": imageData.title || imageData.alt,
    "caption": imageData.caption,
    "keywords": imageData.keywords.join(', '),
    "contentUrl": imageData.src,
    "encodingFormat": getImageFormat(imageData.src),
    "about": {
      "@type": "Thing",
      "name": "Web Accessibility",
      "sameAs": "https://en.wikipedia.org/wiki/Web_accessibility"
    }
  }
}

// Get image format from URL
function getImageFormat(src: string): string {
  const extension = src.split('.').pop()?.toLowerCase()
  const formatMap: Record<string, string> = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'webp': 'image/webp',
    'avif': 'image/avif',
    'svg': 'image/svg+xml'
  }
  return formatMap[extension || 'jpg'] || 'image/jpeg'
}

// Calculate image SEO score
export function calculateImageSEOScore(imageData: ImageSEOData): number {
  let score = 0
  
  // Alt text quality (0-30 points)
  if (imageData.alt) {
    if (imageData.alt.length >= 10 && imageData.alt.length <= 125) score += 20
    if (imageData.keywords.some(k => imageData.alt.toLowerCase().includes(k.toLowerCase()))) score += 10
  }
  
  // Title attribute (0-10 points)
  if (imageData.title) score += 10
  
  // Caption/description (0-10 points)
  if (imageData.caption || imageData.description) score += 10
  
  // Keywords relevance (0-20 points)
  if (imageData.keywords.length >= 2) score += 10
  if (imageData.contextualKeywords.length >= 1) score += 10
  
  // File naming (0-10 points)
  const filename = imageData.src.split('/').pop() || ''
  if (filename.includes('-') || filename.includes('_')) score += 5
  if (imageData.keywords.some(k => filename.toLowerCase().includes(k.toLowerCase()))) score += 5
  
  // Loading optimization (0-10 points)
  if (imageData.loading === 'lazy' && imageData.priority !== 'high') score += 5
  if (imageData.loading === 'eager' && imageData.priority === 'high') score += 5
  if (imageData.fetchPriority) score += 5
  
  // Format optimization (0-10 points)
  if (imageData.src.includes('.webp') || imageData.src.includes('.avif')) score += 10
  
  return score
}

// Image accessibility audit
export function auditImageAccessibility(imageData: ImageSEOData) {
  const issues: string[] = []
  const warnings: string[] = []
  const suggestions: string[] = []
  
  // Alt text checks
  if (!imageData.alt) {
    issues.push("Missing alt text - critical for screen readers")
  } else {
    if (imageData.alt.length < 10) {
      warnings.push("Alt text is very short - consider adding more description")
    }
    if (imageData.alt.length > 125) {
      warnings.push("Alt text is longer than recommended 125 characters")
    }
    if (/^image|picture|photo$/i.test(imageData.alt)) {
      issues.push("Alt text is too generic - describe the actual content")
    }
  }
  
  // Context checks
  if (imageData.keywords.length === 0) {
    suggestions.push("Add relevant keywords to improve SEO")
  }
  
  if (!imageData.title && imageData.priority === 'high') {
    suggestions.push("Consider adding title attribute for high-priority images")
  }
  
  // Performance checks
  if (imageData.loading === 'eager' && imageData.priority !== 'high') {
    warnings.push("Consider lazy loading for non-critical images")
  }
  
  return {
    issues,
    warnings,
    suggestions,
    overallScore: calculateImageSEOScore(imageData)
  }
}

// Export types
export type { ImageSEOData, OptimizedImageProps } 