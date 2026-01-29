import { NextRequest } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { errorLogger } from "@/lib/error-logger";
import { checkTrialLimit, recordTrialUsage } from "@/lib/trial-usage";
import OpenAI from "openai";
import { creditTransactions, db, toolUsage, users } from "@/lib/db";
import { eq } from "drizzle-orm";
import {
  isOpenRouterConfigured,
  isOpenRouterModel,
  openrouter,
} from "@/lib/openrouter";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY environment variable");
}

const DEFAULT_MODEL = "gpt-4o";
const CREDIT_COST = 2;
const MAX_AI_TOKENS = 4000;
const MAX_AI_TEMP = 0.25;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface RequestBody {
  componentType: string;
  framework: string;
  wcagVersion?: string;
  complianceLevel?: string;
  componentDescription: string;
  customRequirement?: string;
  unlimitedAccess?: boolean;
}

/**
 * SYSTEM PROMPT (strict JSON schema)
 */
const SYSTEM_PROMPT = `
You are an expert accessibility engineer and prompt engineer specializing in WCAG 2.2 AA compliance and production-ready UI component design. Produce ONE and ONLY ONE valid JSON object (no surrounding text, no markdown, no commentary) that exactly follows the schema and population rules below.

TOP-LEVEL SCHEMA (all keys must exist; return empty string "" or arrays with placeholders when required):
{
  "code": string,
  "detailed_code_analysis": {
    "code_breakdown": string,
    "accessibility_context": string,
    "real_world_example": string
  },
  "implementation_examples": {
    "basic_usage": string,
    "advanced_usage": string,
    "full_integration": string
  },
  "implementation_summary": [ string ],
  "accessibility_features": [ string ],
  "wcag_compliances": [ string ],
  "testing_guide": [ string ],
  "best_practices": [ string ],
  "common_mistakes_to_avoid": [ string ],
  "enhancement_suggestions": [ string ]
}

STRICT OUTPUT RULES:
1) Return EXACTLY one JSON object and nothing else. Use double quotes for keys/strings. No trailing commas.
2) Preserve newline characters inside string values where helpful (e.g., code) but DO NOT include markdown fences like \`\`\` or language tags.
3) If any array cannot be meaningfully populated from the generated code, include placeholder short strings ("") only to meet the minimum required length — do not output prose placeholders or example templates.
4) Arrays must contain only strings.
5) The "code" field must contain runnable, production-ready code for the specified framework. Inline comments are allowed if valid for the target language.
6) Multi-line string fields are allowed and expected for code and explanations.

FIELD SEMANTICS:
- "implementation_summary": an ordered checklist (array) of actionable steps. MUST contain between 2 and 6 entries.
- "accessibility_features": an array of 2-6 concise feature statements.
- "wcag_compliances": an array of 2-6 concise strings describing specific WCAG success criteria.
- "testing_guide": an array of 2-6 concrete test steps.
- "best_practices": an array of 2-6 short, actionable best-practice bullets.
- "common_mistakes_to_avoid": an array of 2-6 concise common pitfalls.
- "enhancement_suggestions": an array of 2-6 practical next-step enhancements.

VALIDATION RULES:
A) JSON must parse with JSON.parse().
B) "code" length must be > 0 characters.
C) Each array must have length between 2 and 6 inclusive.
D) "wcag_compliances" must include at least one entry that references a WCAG success criterion identifier.

Return only the JSON object and nothing else.
`;

function buildUserPrompt(
  componentType: string,
  framework: string,
  description: string,
  customRequirements: string,
  wcagVersion: string = "2.2",
  complianceLevel: string = "AA"
) {
  const versionNotes = {
    "2.0": "Focus on the original 12 guidelines and 61 success criteria.",
    "2.1": "Include mobile accessibility, cognitive accessibility basics, and motion sensitivity.",
    "2.2": "Include all 2.1 requirements plus: focus appearance, dragging movements, target size minimum, consistent help, redundant entry, and accessible authentication."
  };

  const levelNotes = {
    "A": "Essential requirements only.",
    "AA": "Standard web accessibility with color contrast and focus visible.",
    "AAA": "Enhanced accessibility with improved contrast and cognitive support."
  };

  return `
Produce the single JSON object for this request.

ComponentType: "${componentType}"
Framework: "${framework}"
WCAG Version: "${wcagVersion}"
Compliance Level: "${complianceLevel}"
Description: "${description}"
CustomRequirements: "${customRequirements || "None"}"

WCAG Version Notes: ${versionNotes[wcagVersion as keyof typeof versionNotes] || versionNotes["2.2"]}
Compliance Level Notes: ${levelNotes[complianceLevel as keyof typeof levelNotes] || levelNotes["AA"]}

Generate code that specifically targets WCAG ${wcagVersion} Level ${complianceLevel} compliance.
Return ONLY the JSON object (no explanation, no markdown).
`.trim();
}

/**
 * Streaming API Route Handler
 */
export async function POST(req: NextRequest) {
  const encoder = new TextEncoder();

  try {
    const body: RequestBody = await req.json();
    const user = await currentUser();

    // Send status updates via SSE
    const sendStatus = (controller: ReadableStreamDefaultController, message: string, phase: string) => {
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ type: "status", message, phase })}\n\n`)
      );
    };

    // Check access
    if (!body.unlimitedAccess && !user) {
      const trialStatus = await checkTrialLimit("accessibility_code_generator");
      if (!trialStatus.allowed) {
        return new Response(
          JSON.stringify({ error: trialStatus.message, code: "TRIAL_LIMIT_EXCEEDED" }),
          { status: 403, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    // Basic validation
    if (!body.componentType?.trim() || !body.framework?.trim() || !body.componentDescription?.trim()) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Check credits
    let userRecord = null;
    let currentCredits = 0;

    if (user && !body.unlimitedAccess) {
      [userRecord] = await db
        .select()
        .from(users)
        .where(eq(users.id, user.id))
        .limit(1);

      if (!userRecord) {
        return new Response(
          JSON.stringify({ error: "User not found" }),
          { status: 404, headers: { "Content-Type": "application/json" } }
        );
      }

      currentCredits = userRecord.credits;

      if (currentCredits < CREDIT_COST) {
        return new Response(
          JSON.stringify({ error: "Insufficient credits", code: "INSUFFICIENT_CREDITS" }),
          { status: 402, headers: { "Content-Type": "application/json" } }
        );
      }
    } else if (user) {
      [userRecord] = await db
        .select()
        .from(users)
        .where(eq(users.id, user.id))
        .limit(1);
      currentCredits = userRecord?.credits || 0;
    }

    // Build prompts
    const userPrompt = buildUserPrompt(
      body.componentType,
      body.framework,
      body.componentDescription,
      body.customRequirement || "",
      body.wcagVersion || "2.2",
      body.complianceLevel || "AA"
    );

    // Create streaming response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          sendStatus(controller, "Analyzing requirements...", "analyzing");

          const useOpenRouter = isOpenRouterModel(DEFAULT_MODEL);
          if (useOpenRouter && !isOpenRouterConfigured()) {
            throw new Error("OpenRouter API key not configured");
          }

          const client = useOpenRouter ? openrouter : openai;

          sendStatus(controller, "Generating accessible component...", "generating");

          const completion = await client.chat.completions.create({
            model: DEFAULT_MODEL,
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              { role: "user", content: userPrompt },
            ],
            temperature: MAX_AI_TEMP,
            max_completion_tokens: MAX_AI_TOKENS,
            stream: true,
          });

          let fullContent = "";

          sendStatus(controller, "Streaming response...", "streaming");

          for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
              fullContent += content;
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ type: "partial", content })}\n\n`)
              );
            }
          }

          sendStatus(controller, "Processing result...", "processing");

          // Parse and validate
          let cleanedResponse = fullContent.trim();
          const jsonMatch = cleanedResponse.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
          if (jsonMatch) {
            cleanedResponse = jsonMatch[1];
          }

          let parsedData;
          try {
            parsedData = JSON.parse(cleanedResponse);
          } catch {
            throw new Error("Invalid JSON response from AI");
          }

          // Handle credits
          if (user && userRecord && !body.unlimitedAccess) {
            const newBalance = currentCredits - CREDIT_COST;

            await Promise.all([
              db
                .update(users)
                .set({
                  credits: newBalance,
                  totalCreditsUsed: userRecord.totalCreditsUsed + CREDIT_COST,
                  updatedAt: new Date(),
                })
                .where(eq(users.id, user.id)),
              db.insert(creditTransactions).values({
                userId: userRecord.id,
                type: "usage",
                amount: -CREDIT_COST,
                balanceBefore: currentCredits,
                balanceAfter: newBalance,
                description: "AI Accessibility Code Generator (Streaming)",
                toolUsed: "accessibility_code_generator",
              }),
              db.insert(toolUsage).values({
                userId: userRecord.id,
                tool: "accessibility_code_generator",
                creditsUsed: CREDIT_COST,
                success: true,
              }),
            ]);

            parsedData.creditsUsed = CREDIT_COST;
            parsedData.remainingCredits = newBalance;
          } else if (!body.unlimitedAccess && !user) {
            await recordTrialUsage("accessibility_code_generator");
          }

          // Send complete result
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: "complete", result: parsedData })}\n\n`)
          );

          controller.close();
        } catch (error) {
          console.error("Streaming error:", error);
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: "error",
                error: error instanceof Error ? error.message : "An error occurred"
              })}\n\n`
            )
          );
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    console.error("Accessibility Code Generator Stream Error:", error);

    errorLogger.logMajorError("Streaming code generation failed", {
      component: "accessibility-code-generator-stream-api",
      userId: (await currentUser())?.id || "unknown",
      error: error instanceof Error ? error : new Error(String(error)),
    });

    return new Response(
      JSON.stringify({ error: "An error occurred while generating code" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
