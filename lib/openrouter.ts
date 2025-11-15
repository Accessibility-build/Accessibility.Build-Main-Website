import OpenAI from 'openai'
import { createOpenAI, openai } from '@ai-sdk/openai'

// OpenRouter client configuration
export const openrouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    "X-Title": "Accessibility Audit Helper",
  },
})

// OpenRouter client for AI SDK
export const openrouterAI = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  headers: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    "X-Title": "Accessibility Audit Helper",
  },
})

// Claude model configurations available through OpenRouter
export const CLAUDE_MODELS = [
  {
    id: 'anthropic/claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet',
    description: 'Most capable Claude model, excellent for complex analysis',
    provider: 'openrouter'
  },
  {
    id: 'anthropic/claude-sonnet-4',
    name: 'Claude Sonnet 4',
    description: 'Latest Claude model with enhanced capabilities',
    provider: 'openrouter'
  },
  {
    id: 'anthropic/claude-3-haiku',
    name: 'Claude 3 Haiku',
    description: 'Fast and efficient Claude model',
    provider: 'openrouter'
  }
]

// Google models - Multimodal capabilities
export const GEMINI_MODELS = [
  {
    id: 'google/gemini-2.0-flash-001',
    name: 'Gemini 2.0 Flash',
    description: 'Google\'s latest fast multimodal model',
    provider: 'openrouter'
  },
  {
    id: 'google/gemini-pro-1.5',
    name: 'Gemini Pro 1.5',
    description: 'Advanced multimodal model with large context',
    provider: 'openrouter'
  }
]

// Meta AI models - Open source excellence
export const META_MODELS = [
  {
    id: 'meta-llama/llama-3.3-70b-instruct',
    name: 'Llama 3.3 70B',
    description: 'Meta\'s latest open-source model',
    provider: 'openrouter'
  },
  {
    id: 'meta-llama/llama-3.1-405b-instruct',
    name: 'Llama 3.1 405B',
    description: 'Meta\'s largest open-source model',
    provider: 'openrouter'
  }
]

// DeepSeek models - Great value for money (Corrected IDs)
export const DEEPSEEK_MODELS = [
  {
    id: 'deepseek/deepseek-chat-v3.1',
    name: 'DeepSeek Chat V3.1',
    description: 'Latest DeepSeek model, great value',
    provider: 'openrouter'
  },
  {
    id: 'deepseek/deepseek-r1',
    name: 'DeepSeek R1',
    description: 'Reasoning model, cost-effective',
    provider: 'openrouter'
  }
]

// Other popular models available through OpenRouter
export const OTHER_OPENROUTER_MODELS = [
  {
    id: 'mistralai/mistral-large-2407',
    name: 'Mistral Large',
    description: 'European AI, balanced performance',
    provider: 'openrouter'
  }
]

// Helper function to determine if a model uses OpenRouter
export function isOpenRouterModel(modelId: string): boolean {
  return modelId.includes('/') || 
         CLAUDE_MODELS.some(model => model.id === modelId) || 
         GEMINI_MODELS.some(model => model.id === modelId) ||
         META_MODELS.some(model => model.id === modelId) ||
         DEEPSEEK_MODELS.some(model => model.id === modelId) ||
         OTHER_OPENROUTER_MODELS.some(model => model.id === modelId)
}

// Helper function to get the appropriate client for a model
export function getModelClient(modelId: string) {
  return isOpenRouterModel(modelId) ? openrouter : null
}

// Helper function to check if OpenRouter is configured
export function isOpenRouterConfigured(): boolean {
  return !!process.env.OPENROUTER_API_KEY
}

// Helper function to get the appropriate AI SDK model
export function getAIModel(modelId?: string) {
  const selectedModel = modelId || process.env.DEFAULT_AI_MODEL || 'gpt-4o'
  
  if (isOpenRouterModel(selectedModel) && isOpenRouterConfigured()) {
    return openrouterAI(selectedModel)
  }
  
  // Default to OpenAI for non-OpenRouter models
  return openai(selectedModel.includes('/') ? 'gpt-4o' : selectedModel)
}
