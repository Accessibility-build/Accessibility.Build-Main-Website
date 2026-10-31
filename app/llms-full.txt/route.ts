import { buildLlmsResponse } from "@/lib/llms"

// Serves /llms-full.txt, the complete list behind /llms.txt. See lib/llms.ts.
export const revalidate = 3600

export function GET(): Promise<Response> {
  return buildLlmsResponse({ full: true })
}
