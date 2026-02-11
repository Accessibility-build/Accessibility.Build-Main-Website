import { NextRequest } from 'next/server'
import OpenAI from 'openai'
import { currentUser } from '@clerk/nextjs/server'
import { checkTrialLimit, recordTrialUsage } from '@/lib/trial-usage'
import { openrouter, isOpenRouterModel, isOpenRouterConfigured } from '@/lib/openrouter'
import { getUserCredits, useCredits } from '@/lib/credits'
import { hasServerUnlimitedAccess } from '@/lib/unlimited-access-server'

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable')
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface RequestBody {
  issueDescription: string
  codeSnippet?: string | null
  techStack?: string | null
  componentType?: string | null
  unlimitedAccess?: boolean
  selectedModel?: string
}

function createAnalysisPrompt(data: RequestBody): string {
  const hasCodeSnippet = data.codeSnippet && data.codeSnippet.trim().length > 0
  
  return `Hey there! I'm working on making my application more accessible and I've run into an issue that I could really use your expertise on. I'd love a comprehensive analysis that helps me not just fix this, but understand it deeply.

🔍 THE ACCESSIBILITY ISSUE I'VE DISCOVERED:
${data.issueDescription}

${hasCodeSnippet ? `📝 HERE'S THE RELEVANT CODE:
\`\`\`
${data.codeSnippet}
\`\`\`` : ''}

${data.techStack ? `⚙️ TECH STACK: ${data.techStack}` : ''}
${data.componentType ? `🧩 COMPONENT TYPE: ${data.componentType}` : ''}

What would be incredibly helpful:
• Help me understand exactly which WCAG guidelines this impacts and why
• Paint a picture of how this affects real users - I want to understand the human impact
• Walk me through a comprehensive solution I can implement with confidence
• Show me how to properly test this fix to ensure it actually works
• Share any insights about common pitfalls or edge cases I should watch out for
${!hasCodeSnippet ? `• Since I haven't included specific code, please provide practical HTML/ARIA examples I can adapt
• Show me the progression from basic semantic HTML to enhanced ARIA implementation
• Give me multiple approaches so I can choose what fits best with my architecture` : ''}
• Help me understand the broader accessibility principles at play here

I'm looking for the kind of thorough, thoughtful analysis that will help me become a better accessibility-minded developer. Please be as comprehensive and educational as possible!

Please structure your response to cover:
- A clear, descriptive title and severity assessment
- What's currently happening vs. what should happen
- Detailed explanation of how this impacts different types of users
- Specific WCAG criteria and why they apply
- Step-by-step implementation guidance
- Practical code examples I can adapt
- Comprehensive testing strategies
- Additional resources and best practices

Write in a warm, conversational tone like you're mentoring a colleague. I want to learn not just the fix, but the deeper principles behind it. Be as thorough and educational as you can while keeping everything practical and actionable!

Please provide your analysis in this JSON format (just JSON, nothing else):

{
  "issueTitle": "Simple, clear title like you'd write in a bug ticket",
  "severity": "critical|high|medium|low",
  "actualResult": "What's happening now that's broken",
  "expectedResult": "What should happen instead",
  "userImpact": "How this affects real users - screen reader users, keyboard users, etc.",
  "wcagCriteria": [
    {
      "criterion": "WCAG rule this breaks (like '1.4.3 Contrast (Minimum)')",
      "level": "A|AA|AAA",
      "description": "Why this rule applies here"
    }
  ],
  "recommendations": "How to fix this - practical steps and approach",
  "codeExample": "${!hasCodeSnippet ? 'Working HTML/ARIA code example I can copy and use' : 'Fixed version of the code with proper accessibility (or null if not needed)'}",
  "implementationSteps": [
    "Step 1: Do this first",
    "Step 2: Then do this",
    "Step 3: Test it like this",
    "Step 4: Make sure it works"
  ],
  "testingChecklist": [
    "Try it with a screen reader (NVDA or JAWS)",
    "Check keyboard navigation works",
    "Zoom to 200% and see if it still works",
    "Test with voice control if you can",
    "Try on mobile with screen reader",
    "Run axe-core to catch other issues",
    "Get someone to test it if possible"
  ],
  "relatedResources": [
    {
      "title": "WCAG docs for this issue",
      "url": "https://www.w3.org/WAI/WCAG22/Understanding/[relevant-criterion]/"
    },
    {
      "title": "ARIA patterns that might help",
      "url": "https://www.w3.org/WAI/ARIA/apg/patterns/[relevant-pattern]/"
    }
  ]
}

Please make your response comprehensive and educational:
• Write in a warm, conversational tone like you're mentoring a colleague
• Include detailed explanations that help me understand the "why" behind each recommendation
• Provide specific, practical code examples I can actually use
• Share insights about how different users experience these issues
• Give me thorough testing strategies so I can be confident in my fixes
• Include any relevant tips, gotchas, or best practices you've learned
• Help me see the bigger picture of how this fits into overall accessibility strategy

Remember: I want to learn and grow as an accessibility-minded developer, so please be as thorough and educational as you can while keeping it practical and actionable!`
}

export async function POST(req: NextRequest) {
  const encoder = new TextEncoder()
  
  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Send initial connection message
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'connected' })}\n\n`))

        const body: RequestBody = await req.json()
        const user = await currentUser()
        const hasUnlimitedAccess = await hasServerUnlimitedAccess()

        if (hasUnlimitedAccess) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
            type: 'status', 
            message: '🚀 Unlimited access active - bypassing all limits...' 
          })}\n\n`))
        } else {
          if (!user) {
            const trialStatus = await checkTrialLimit('accessibility_audit_helper')
            if (!trialStatus.allowed) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
                type: 'error', 
                error: trialStatus.message,
                code: "TRIAL_LIMIT_EXCEEDED",
                trialStatus: {
                  remaining: trialStatus.remaining,
                  resetTime: trialStatus.resetTime
                }
              })}\n\n`))
              controller.close()
              return
            }
          }
        }
        
        if (!body.issueDescription?.trim()) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
            type: 'error', 
            error: 'Issue description is required' 
          })}\n\n`))
          controller.close()
          return
        }

        if (user && !hasUnlimitedAccess) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
            type: 'status', 
            message: 'Checking credits...' 
          })}\n\n`))
        }

        // Send analysis start message
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
          type: 'status', 
          message: 'Starting AI analysis...' 
        })}\n\n`))

        // Generate analysis using OpenAI streaming
        const prompt = createAnalysisPrompt(body)
        
        const selectedModel = hasUnlimitedAccess ? (body.selectedModel || "gpt-4o") : "gpt-4o"
        const isReasoningModel = selectedModel.includes('o1') || selectedModel.includes('o3')
        const useOpenRouter = isOpenRouterModel(selectedModel)
        
        // Check if OpenRouter is configured when needed
        if (useOpenRouter && !isOpenRouterConfigured()) {
          throw new Error('OpenRouter API key not configured. Please add OPENROUTER_API_KEY to your environment variables.')
        }
        
        // Select the appropriate client
        const client = useOpenRouter ? openrouter : openai
        
        // Create base parameters (temperature not supported by reasoning models)
        const baseParams = {
          model: selectedModel,
          messages: [
            {
              role: "system" as const,
              content: `You're a passionate accessibility expert who genuinely cares about making the web inclusive for everyone. Think of yourself as a friendly mentor who's been in the trenches for years, helping developers create amazing accessible experiences.

Your personality:
- Enthusiastic but not overwhelming - you love what you do and it shows
- Patient and understanding - everyone's learning journey is different
- Practical and solution-focused - you always provide actionable next steps
- Encouraging - you celebrate progress and help people feel confident
- Thorough - you explain the "why" behind accessibility, not just the "how"

Your communication style:
- Write like you're having a conversation with a colleague over coffee
- Use real-world examples and analogies that make complex concepts click
- Share insights about how different users actually experience the web
- Be specific about the impact - help developers understand who benefits from fixes
- Include encouraging words and acknowledge when something is tricky
- Use a warm, conversational tone while staying professional

${!body.codeSnippet?.trim() ? 'When someone describes an issue without code, paint a clear picture with practical HTML and ARIA examples. Start with semantic HTML foundations, then show how ARIA enhances the experience. Include before/after comparisons when helpful.' : 'When reviewing code, be constructive and specific. Point out what\'s working well, then guide them through improvements step by step.'}

Remember: You're not just fixing code, you're helping create a more inclusive web. Make your responses comprehensive, engaging, and genuinely helpful - the kind of advice you'd want to receive yourself.`
            },
            {
              role: "user" as const,
              content: prompt
            }
          ],
          stream: true as const,
        }

        // Create completion with model-specific parameters
        const completion = isReasoningModel 
          ? await client.chat.completions.create({
              ...baseParams,
              max_completion_tokens: 4000  // Increased for more comprehensive responses
              // No temperature for reasoning models
            })
          : await client.chat.completions.create({
              ...baseParams,
              temperature: 0.8,  // Slightly higher for more natural, conversational responses
              max_tokens: 4000   // Increased for more detailed explanations
            })

        let fullResponse = ''
        
        // Stream the AI response
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content || ''
          if (content) {
            fullResponse += content
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
              type: 'partial', 
              content: content 
            })}\n\n`))
          }
        }

        // Parse the complete response
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
          type: 'status', 
          message: 'Processing analysis...' 
        })}\n\n`))

        // Extract JSON from markdown code blocks if present
        let cleanedResponse = fullResponse.trim()
        const jsonMatch = fullResponse.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/)
        if (jsonMatch) {
          cleanedResponse = jsonMatch[1]
        }

        let analysisData: any
        try {
          analysisData = JSON.parse(cleanedResponse)
        } catch (parseError) {
          console.error('Failed to parse OpenAI response:', fullResponse)
          console.error('Cleaned response:', cleanedResponse)
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
            type: 'error', 
            error: 'Unable to process the analysis. Please try rephrasing your issue description.' 
          })}\n\n`))
          controller.close()
          return
        }

        // Validate response structure
        const requiredFields = ['issueTitle', 'severity', 'actualResult', 'expectedResult', 'userImpact', 'wcagCriteria', 'recommendations', 'implementationSteps', 'testingChecklist']
        const missingFields = requiredFields.filter(field => !analysisData[field])
        
        if (missingFields.length > 0) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
            type: 'error', 
            error: `Incomplete analysis received. Missing: ${missingFields.join(', ')}` 
          })}\n\n`))
          controller.close()
          return
        }

        // Ensure arrays are properly formatted
        if (!Array.isArray(analysisData.wcagCriteria)) analysisData.wcagCriteria = []
        if (!Array.isArray(analysisData.implementationSteps)) analysisData.implementationSteps = []
        if (!Array.isArray(analysisData.testingChecklist)) analysisData.testingChecklist = []
        if (!Array.isArray(analysisData.relatedResources)) analysisData.relatedResources = []

        // Validate severity
        const validSeverities = ['critical', 'high', 'medium', 'low']
        if (!validSeverities.includes(analysisData.severity)) {
          analysisData.severity = 'medium'
        }

        // Handle credit/trial usage based on user type
        let result: any
        
        if (user && !hasUnlimitedAccess) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
            type: 'status', 
            message: 'Updating credits...' 
          })}\n\n`))
          const creditResult = await useCredits(
            'accessibility_audit_helper',
            {
              issueDescription: body.issueDescription.substring(0, 200),
              techStack: body.techStack,
              componentType: body.componentType,
            },
            {
              issueTitle: analysisData.issueTitle,
              severity: analysisData.severity,
              wcagCriteriaCount: analysisData.wcagCriteria.length,
            },
            user.id
          )

          // Prepare result for authenticated users with credit deduction
          result = {
            ...analysisData,
            creditsUsed: creditResult.creditsUsed,
            remainingCredits: creditResult.remainingCredits
          }
        } else if (hasUnlimitedAccess) {
          // Unlimited access - no credits or trial usage recording
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
            type: 'status', 
            message: '⚡ Processing with unlimited access - no limits applied' 
          })}\n\n`))

          result = {
            ...analysisData,
            creditsUsed: 0,
            remainingCredits: user ? await getUserCredits(user.id) : 0,
            unlimitedAccess: true
          }
        } else if (!user) {
          // Record trial usage for non-authenticated users without unlimited access
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
            type: 'status', 
            message: 'Recording trial usage...' 
          })}\n\n`))

          await recordTrialUsage('accessibility_audit_helper')

          // Prepare result for trial users
          result = {
            ...analysisData,
            creditsUsed: 0,
            remainingCredits: 0,
            trialStatus: {
              usageCount: 0,
              remainingUses: 0,
              limitReached: false
            }
          }
        } else {
          throw new Error('User not found')
        }

        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
          type: 'complete', 
          result: result 
        })}\n\n`))
        
        controller.close()

      } catch (error) {
        console.error('Error in streaming accessibility analysis:', error)
        
        let errorMessage = 'An error occurred while analyzing the accessibility issue. Please try again.'
        let errorCode: string | undefined
        
        if (error instanceof Error) {
          if (error.message.includes('Insufficient credits')) {
            errorMessage = error.message
            errorCode = 'INSUFFICIENT_CREDITS'
          } else if (error.message.includes('insufficient_quota') || error.message.includes('rate_limit')) {
            errorMessage = 'AI service temporarily unavailable. Please try again in a few minutes.'
          } else if (error.message.includes('Invalid response format')) {
            errorMessage = 'Unable to process the analysis. Please try rephrasing your issue description.'
          } else if (error.message.includes('User not found')) {
            errorMessage = 'User not found'
          }
        }

        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
          type: 'error', 
          error: errorMessage,
          code: errorCode
        })}\n\n`))
        controller.close()
      }
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
} 
