import { buildLlmsResponse } from "@/lib/llms"

// Serves /llms.txt, the curated guide for AI answer engines. See lib/llms.ts.
export const revalidate = 3600

export function GET(): Promise<Response> {
  return buildLlmsResponse({ full: false })
}
