import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'
import { 
  WebsiteClassification, 
  WEBSITE_INDICATORS, 
  COMPLIANCE_REQUIREMENTS,
  INDUSTRY_BENCHMARKS 
} from './accessibility-intelligence'

interface PageAnalysisData {
  title: string
  url: string
  metaDescription?: string
  headings: string[]
  content: string
  links: string[]
  images: number
  forms: number
}

export async function classifyWebsite(
  pageData: PageAnalysisData,
  pageContent: string = ''
): Promise<WebsiteClassification> {
  try {
    // First, try rule-based classification
    const ruleBasedResult = performRuleBasedClassification(pageData)
    
    // Then enhance with AI analysis
    const aiEnhancedResult = await enhanceWithAIClassification(pageData, ruleBasedResult, pageContent)
    
    return aiEnhancedResult
  } catch (error) {
    console.error('Website classification failed:', error)
    // Fallback to rule-based only
    return performRuleBasedClassification(pageData)
  }
}

function performRuleBasedClassification(pageData: PageAnalysisData): WebsiteClassification {
  const { title, url, content, links } = pageData
  
  // Combine all text for analysis
  const allText = `${title} ${url} ${content} ${links.join(' ')}`.toLowerCase()
  
  // Score each website type based on keyword presence
  const scores: Record<string, number> = {}
  
  Object.entries(WEBSITE_INDICATORS).forEach(([type, indicators]) => {
    scores[type] = indicators.reduce((score, indicator) => {
      const matches = (allText.match(new RegExp(indicator, 'gi')) || []).length
      return score + matches
    }, 0)
  })
  
  // Find the highest scoring type
  const bestMatch = Object.entries(scores).reduce((best, [type, score]) => 
    score > best.score ? { type, score } : best
  , { type: 'other', score: 0 })
  
  // Calculate confidence based on score and presence of strong indicators
  const totalWords = allText.split(' ').length
  const confidence = Math.min(95, Math.max(20, (bestMatch.score / totalWords) * 1000))
  
  // Determine target audience based on content patterns
  const targetAudience = determineTargetAudience(allText)
  
  // Get compliance requirements for this type
  const complianceRequirements = COMPLIANCE_REQUIREMENTS[bestMatch.type as keyof typeof COMPLIANCE_REQUIREMENTS] || ['WCAG 2.1 AA', 'ADA']
  
  // Extract indicators found
  const foundIndicators = WEBSITE_INDICATORS[bestMatch.type as keyof typeof WEBSITE_INDICATORS]?.filter(
    indicator => allText.includes(indicator)
  ) || []
  
  return {
    type: bestMatch.type as WebsiteClassification['type'],
    industry: mapTypeToIndustry(bestMatch.type),
    confidence: Math.round(confidence),
    indicators: foundIndicators.slice(0, 5), // Top 5 indicators
    targetAudience,
    complianceRequirements
  }
}

async function enhanceWithAIClassification(
  pageData: PageAnalysisData,
  ruleBasedResult: WebsiteClassification,
  pageContent: string = ''
): Promise<WebsiteClassification> {
  try {
    const prompt = `Analyze this website and classify its type and industry:

WEBSITE DATA:
- URL: ${pageData.url}
- Title: ${pageData.title}
- Meta Description: ${pageData.metaDescription || 'N/A'}
- Content Sample: ${pageData.content.substring(0, 1000)}
- Number of Forms: ${pageData.forms}
- Number of Images: ${pageData.images}
- Key Links: ${pageData.links.slice(0, 10).join(', ')}

RULE-BASED ANALYSIS:
- Detected Type: ${ruleBasedResult.type}
- Confidence: ${ruleBasedResult.confidence}%
- Found Indicators: ${ruleBasedResult.indicators.join(', ')}

Please provide a refined analysis considering:
1. Website primary purpose and business model
2. Target audience (B2B, B2C, or mixed)
3. Industry-specific characteristics
4. Compliance requirements based on industry
5. Confidence level (1-100)

Respond in JSON format:
{
  "type": "ecommerce|saas|content|government|education|healthcare|finance|nonprofit|portfolio|other",
  "industry": "specific industry name",
  "confidence": 85,
  "indicators": ["key indicators found"],
  "targetAudience": "b2b|b2c|mixed",
  "complianceRequirements": ["relevant compliance standards"],
  "reasoning": "explanation of classification"
}`

    const { text } = await generateText({
      model: openai('gpt-4o'),
      messages: [
        {
          role: 'system',
          content: 'You are an expert web analyst specializing in website classification and business model identification. Provide accurate, detailed analysis based on website content and structure.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      maxTokens: 500,
      temperature: 0.3,
    })

    // Parse AI response
    const cleanedResponse = text.replace(/```(?:json)?\s*/, '').replace(/```\s*$/, '')
    const aiResult = JSON.parse(cleanedResponse)
    
    // Combine rule-based and AI results with weighted confidence
    const finalConfidence = Math.round((ruleBasedResult.confidence * 0.4) + (aiResult.confidence * 0.6))
    
    return {
      type: aiResult.type || ruleBasedResult.type,
      industry: aiResult.industry || ruleBasedResult.industry,
      confidence: Math.min(95, finalConfidence),
      indicators: [...new Set([...ruleBasedResult.indicators, ...aiResult.indicators])].slice(0, 8),
      targetAudience: aiResult.targetAudience || ruleBasedResult.targetAudience,
      complianceRequirements: aiResult.complianceRequirements || ruleBasedResult.complianceRequirements
    }
    
  } catch (error) {
    console.error('AI classification enhancement failed:', error)
    return ruleBasedResult
  }
}

function determineTargetAudience(content: string): 'b2b' | 'b2c' | 'mixed' {
  const b2bIndicators = ['enterprise', 'business', 'api', 'integration', 'dashboard', 'admin', 'corporate', 'solution']
  const b2cIndicators = ['customer', 'personal', 'individual', 'family', 'home', 'consumer', 'retail']
  
  const b2bScore = b2bIndicators.reduce((score, indicator) => 
    score + (content.match(new RegExp(indicator, 'gi')) || []).length, 0
  )
  
  const b2cScore = b2cIndicators.reduce((score, indicator) => 
    score + (content.match(new RegExp(indicator, 'gi')) || []).length, 0
  )
  
  if (b2bScore > b2cScore * 1.5) return 'b2b'
  if (b2cScore > b2bScore * 1.5) return 'b2c'
  return 'mixed'
}

function mapTypeToIndustry(type: string): string {
  const industryMap: Record<string, string> = {
    ecommerce: 'Retail & E-commerce',
    saas: 'Software & Technology',
    content: 'Media & Publishing',
    government: 'Government & Public Sector',
    education: 'Education & Training',
    healthcare: 'Healthcare & Medical',
    finance: 'Financial Services',
    nonprofit: 'Non-profit & Charity',
    portfolio: 'Creative & Professional Services',
    other: 'General Business'
  }
  
  return industryMap[type] || 'General Business'
}

export async function extractPageAnalysisData(page: any): Promise<PageAnalysisData> {
  try {
    // Extract structured data from the page
    const pageData = await page.evaluate(() => {
      // Get title
      const title = document.title || ''
      
      // Get meta description
      const metaDesc = document.querySelector('meta[name="description"]')?.getAttribute('content') || ''
      
      // Get headings
      const headings = Array.from(document.querySelectorAll('h1, h2, h3')).map(h => h.textContent?.trim() || '').filter(Boolean)
      
      // Get main content (avoid nav, footer, sidebar)
      const contentElements = document.querySelectorAll('main, article, .content, [role="main"]')
      let content = ''
      if (contentElements.length > 0) {
        content = Array.from(contentElements).map(el => el.textContent?.trim() || '').join(' ')
      } else {
        // Fallback: get body content but exclude common non-content areas
        const body = document.body.cloneNode(true) as HTMLElement
        const excludeSelectors = ['nav', 'header', 'footer', '.nav', '.header', '.footer', '.sidebar', '.menu']
        excludeSelectors.forEach(selector => {
          body.querySelectorAll(selector).forEach(el => el.remove())
        })
        content = body.textContent?.trim() || ''
      }
      
      // Get important links
      const links = Array.from(document.querySelectorAll('a[href]')).map(a => a.textContent?.trim() || '').filter(Boolean)
      
      // Count images and forms
      const images = document.querySelectorAll('img').length
      const forms = document.querySelectorAll('form').length
      
      return {
        title,
        metaDescription: metaDesc,
        headings: headings.slice(0, 10), // Top 10 headings
        content: content.substring(0, 2000), // First 2000 chars
        links: links.slice(0, 20), // Top 20 link texts
        images,
        forms
      }
    })
    
    return {
      ...pageData,
      url: page.url()
    }
  } catch (error) {
    console.error('Failed to extract page analysis data:', error)
    return {
      title: '',
      url: page.url(),
      headings: [],
      content: '',
      links: [],
      images: 0,
      forms: 0
    }
  }
}

export function getIndustryBenchmark(websiteType: string) {
  const benchmark = INDUSTRY_BENCHMARKS[websiteType as keyof typeof INDUSTRY_BENCHMARKS]
  
  if (!benchmark) {
    return {
      averageScore: 75,
      topQuartile: 88,
      marketPosition: 'average' as const,
      improvementOpportunity: 25
    }
  }
  
  return {
    ...benchmark,
    marketPosition: 'average' as const,
    improvementOpportunity: 100 - benchmark.averageScore
  }
} 
 
 