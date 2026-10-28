// Model prices for the /admin/assistant cost estimate. Shared by the server stats and the
// admin page, so it must stay free of server-only imports.

/** OpenRouter list prices in US dollars per million tokens. */
export const MODEL_PRICING: Record<string, { input: number; output: number }> = {
  "anthropic/claude-haiku-5.5": { input: 0.1, output: 0.5 },
  "anthropic/claude-sonnet-5.5": { input: 2, output: 10 },
}

export const MODEL_PRICING_NOTE =
  "Estimated from token counts at OpenRouter list prices (Claude Haiku 5.5: $0.10 per million input tokens, $0.50 per million output tokens, checked October 2026). The OpenRouter invoice is the final figure."
