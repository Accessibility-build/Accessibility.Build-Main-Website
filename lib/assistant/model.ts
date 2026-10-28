import "server-only"
import { createOpenAICompatible } from "@ai-sdk/openai-compatible"

// One OpenRouter client for everything Curb calls: the answer and the intent classifier.
// The generic OpenAI-compatible provider, not @ai-sdk/openai: that one treats any model id it
// does not recognise as an OpenAI reasoning model, which drops temperature and sends the system
// prompt as a "developer" message. includeUsage makes streams report token counts.
export const openrouter = createOpenAICompatible({
  name: "openrouter",
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  headers: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "https://accessibility.build",
    "X-Title": "Accessibility.build Curb assistant",
  },
  includeUsage: true,
})

// Haiku through OpenRouter: the key is already configured for the site's other AI tools.
export const ASSISTANT_MODEL = process.env.ASSISTANT_MODEL || "anthropic/claude-haiku-5.5"
export const INTENT_MODEL = process.env.ASSISTANT_INTENT_MODEL || ASSISTANT_MODEL

/**
 * Haiku 5.5 reasons by default on OpenRouter, and the hidden reasoning counts against the
 * output limit: on longer buyer questions it used the whole budget and cut the visible answer
 * off mid-sentence. Curb's answers are short and grounded in supplied context, so reasoning is
 * switched off for both calls, which also makes them about a second faster.
 */
export const NO_REASONING = { openrouter: { reasoning: { enabled: false } } }
