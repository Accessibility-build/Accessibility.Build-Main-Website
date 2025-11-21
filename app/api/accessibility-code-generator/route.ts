import { NextRequest, NextResponse } from "next/server";
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
const CREDIT_COST = 2; // cost per successful generation (adjustable)
const MAX_AI_TOKENS = 4000; // model token limit (tune as needed)
const MAX_AI_TEMP = 0.25; // model temprature (tune as needed)

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface RequestBody {
  componentType: string;
  framework: string;
  componentDescription: string;
  customRequirement?: string;
  unlimitedAccess?: boolean;
}

interface ResponseBody {
  code: string;
  detailed_code_analysis: {
    code_breakdown: string;
    accessibility_context: string;
    real_world_example: string;
  };
  implementation_examples: {
    basic_usage: string;
    advanced_usage: string;
    full_integration: string;
  };
  implementation_summary: [string];
  accessibility_features: [string];
  wcag_compliances: [string];
  testing_guide: [string];
  best_practices: [string];
  common_mistakes_to_avoid: [string];
  enhancement_suggestions: [string];
  creditsUsed: number;
  remainingCredits: number;
  trialStatus?: {
    usageCount: number;
    remainingUses: number;
    limitReached: boolean;
  };
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
5) The “code” field must contain runnable, production-ready code for the specified framework. Inline comments are allowed if valid for the target language.
6) Multi-line string fields are allowed and expected for code and explanations.

FIELD SEMANTICS (model must generate these dynamically from the produced code — DO NOT echo or reuse example items the developer previously supplied):
- "implementation_summary": an ordered checklist (array) of actionable steps (imperative sentences) required to integrate, configure, and maintain the generated component in a real project (installation, theming, focus styles, validation hooks, testing/CI, monitoring/analytics where relevant). MUST contain between 2 and 6 entries.
- "accessibility_features": an array of 2-6 concise feature statements that describe accessibility behaviors implemented in the code (e.g., focus management, ARIA usage, live regions, high-contrast tokens). Derive these from the actual code you output.
- "wcag_compliances": an array of 2-6 concise strings describing specific WCAG 2.2 success criteria addressed by this code and a short justification (e.g., "2.1.1 Keyboard — all interactive controls operable by keyboard"). Derive these directly from code and analysis.
- "testing_guide": an array of 2-6 concrete test steps or recipes (manual and automated) tailored to the generated code (keyboard sequences, screen reader checks, Axe/Lighthouse assertions, expected outcomes). Each entry should be a single actionable test step or short test recipe.
- "best_practices": an array of 2-6 short, actionable best-practice bullets applied or recommended for this component (semantic HTML first, ARIA only when required, design tokens for contrast, etc.). Derive from decisions in code.
- "common_mistakes_to_avoid": an array of 2-6 concise common pitfalls directly relevant to this component and how to avoid them (e.g., using non-semantic elements without role, removing focus styles). Derive from code and likely misuse scenarios.
- "enhancement_suggestions": an array of 2-6 practical next-step enhancements (progressive enhancement, CI accessibility tests, high-contrast mode, localization/RTL support, etc.) relevant to this implementation.

POPULATION RULES & FORMATTING:
- For each of the arrays above, generate between 2 and 6 items. If fewer than 2 substantive items apply, pad with empty-string entries ("") until you reach 2. Never return more than 6 items — if more apply, select the 2-6 most relevant.
- Items must be concise (one sentence or short phrase) and actionable — suitable for display in a developer UI and for programmatic consumption.
- Do not include the example items the user previously provided; you should *understand* them and generate new items based on the generated code, not echo them verbatim.
- For "wcag_compliances" prefer a small identifier plus short justification (e.g., "1.4.3 Contrast (Minimum) — color tokens ensure 4.5:1 for normal text").
- For "testing_guide" include expected outcomes and the tool or method (e.g., "Keyboard: Tab through controls — focus order logical; expected: focus moves in meaningful sequence.").

VALIDATION RULES (model MUST enforce before returning):
A) JSON must parse with JSON.parse().
B) "code" length must be > 0 characters.
C) Each of these arrays must have length between 2 and 6 inclusive:
   - implementation_summary
   - accessibility_features
   - wcag_compliances
   - testing_guide
   - best_practices
   - common_mistakes_to_avoid
   - enhancement_suggestions
D) "wcag_compliances" must include at least one entry that references a WCAG 2.2 success criterion identifier.

FAILURE / RECOVERY SCHEMA:
If ANY validation fails, return a valid JSON object following the same top-level schema with these specifics:
- "code": ""
- "detailed_code_analysis": { "code_breakdown": "", "accessibility_context": "", "real_world_example": "" }
- "implementation_examples": { "basic_usage": "", "advanced_usage": "", "full_integration": "" }
- For each constrained array above, return an array that meets the length constraints by using empty-string placeholders if necessary (e.g., ["", ""]).

ADDITIONAL RULES:
- Do not output PII or external URLs.
- Ensure keyboard behaviors and focus management are present in both code and documentation fields where appropriate.
- Return only the JSON object and nothing else.
`;

/**
 * Build user prompt for a specific request instance
 */
function buildUserPrompt(
  componentType: string,
  framework: string,
  description: string,
  customRequirements: string
) {
  return `
Produce the single JSON object described in the system prompt for this request.

ComponentType: "${componentType}"
Framework: "${framework}"
Description: "${description}"
CustomRequirements: "${customRequirements || "None"}"

Important:
- Dynamically generate the listed arrays from the produced code and analysis.
- For these arrays, generate between 2 and 6 items each: implementation_summary, accessibility_features, wcag_compliances, testing_guide, best_practices, common_mistakes_to_avoid, enhancement_suggestions.
- If fewer than 2 meaningful items apply for any array, pad that array with empty-string placeholders ("") up to 2 items; do not exceed 6 items.
- Ensure each wcag_compliances entry references a WCAG 2.2 success criterion identifier and short justification.
- Validate locally (as described in the system prompt) that the JSON is syntactically correct and that all constraints are satisfied before returning. If validation fails, return the required recovery JSON as specified.

Return ONLY the JSON object (no explanation, no markdown).
`.trim();
}

/**
 * Validate AI output against the constraints defined in the prompt.
 * Returns an object { ok: boolean, reason?: string }.
 */
function validateAiOutput(aiResponse: any): { ok: boolean; reason?: string } {
  const requiredTopLevelKeys = [
    "code",
    "detailed_code_analysis",
    "implementation_examples",
    "implementation_summary",
    "accessibility_features",
    "wcag_compliances",
    "testing_guide",
    "best_practices",
    "common_mistakes_to_avoid",
    "enhancement_suggestions",
  ];

  // basic presence checks
  for (const key of requiredTopLevelKeys) {
    if (!(key in aiResponse)) {
      return { ok: false, reason: `missing_top_level_key:${key}` };
    }
  }

  // code length
  if (
    typeof aiResponse.code !== "string" ||
    aiResponse.code.trim().length == 0
  ) {
    return { ok: false, reason: "code_too_short" };
  }

  // arrays that must be 2-6 in length
  const arrayKeys = [
    "implementation_summary",
    "accessibility_features",
    "wcag_compliances",
    "testing_guide",
    "best_practices",
    "common_mistakes_to_avoid",
    "enhancement_suggestions",
  ];

  for (const k of arrayKeys) {
    if (!Array.isArray(aiResponse[k])) {
      return { ok: false, reason: `not_array:${k}` };
    }
    if (aiResponse[k].length < 2) {
      return { ok: false, reason: `array_too_short:${k}` };
    }
    if (aiResponse[k].length > 6) {
      return { ok: false, reason: `array_too_long:${k}` };
    }
    // ensure items are strings
    for (const item of aiResponse[k]) {
      if (typeof item !== "string") {
        return { ok: false, reason: `array_item_not_string:${k}` };
      }
    }
  }

  // wcag_compliances must include at least one entry referencing a WCAG-style identifier (e.g., "1.4.3" or "2.1.1")
  const wcagMentioned = aiResponse.wcag_compliances.some((entry: string) =>
    /\d+\.\d+(\.\d+)?/.test(entry)
  );
  if (!wcagMentioned) {
    return { ok: false, reason: "wcag_identifier_missing" };
  }

  // detailed_code_analysis structure checks
  if (
    !aiResponse.detailed_code_analysis ||
    typeof aiResponse.detailed_code_analysis.code_breakdown !== "string" ||
    typeof aiResponse.detailed_code_analysis.accessibility_context !==
      "string" ||
    typeof aiResponse.detailed_code_analysis.real_world_example !== "string"
  ) {
    return { ok: false, reason: "invalid_detailed_code_analysis" };
  }

  // implementation_examples structure checks
  if (
    !aiResponse.implementation_examples ||
    typeof aiResponse.implementation_examples.basic_usage !== "string" ||
    typeof aiResponse.implementation_examples.advanced_usage !== "string" ||
    typeof aiResponse.implementation_examples.full_integration !== "string"
  ) {
    return { ok: false, reason: "invalid_implementation_examples" };
  }

  return { ok: true };
}

/**
 * Build recovery JSON object to return on validation or parsing failure.
 * Provide arrays padded to minimum lengths with empty strings where needed.
 */
function buildRecoveryJson(reason: string) {
  const padArray = (n = 2) => Array(n).fill("");
  return {
    code: "",
    detailed_code_analysis: {
      code_breakdown: "",
      accessibility_context: "",
      real_world_example: "",
    },
    implementation_examples: {
      basic_usage: "",
      advanced_usage: "",
      full_integration: "",
    },
    implementation_summary: padArray(2),
    accessibility_features: padArray(2),
    wcag_compliances: padArray(2),
    testing_guide: padArray(2),
    best_practices: padArray(2),
    common_mistakes_to_avoid: padArray(2),
    enhancement_suggestions: padArray(2),
  };
}

/**
 * API Route Handler
 * Deduct credits and create DB records for a successful/failed attempt.
 */
export async function POST(req: NextRequest) {
  try {
    // Parse body
    const body: RequestBody = await req.json();

    // Check user authenticated
    const user = await currentUser();

    // Check for unlimited access first - bypass all other checks
    if (body.unlimitedAccess) {
      console.log("🚀 Unlimited access active - bypassing all limits");
    } else {
      // Only check limits if unlimited access is not provided
      // If not authenticated, check trial usage
      if (!user) {
        const trialStatus = await checkTrialLimit(
          "accessibility_code_generator"
        );
        if (!trialStatus.allowed) {
          return NextResponse.json(
            {
              error: trialStatus.message,
              code: "TRIAL_LIMIT_EXCEEDED",
              trialStatus,
            },
            { status: 403 }
          );
        }
      }
    }

    // Basic validation
    if (!body.componentType?.trim()) {
      return NextResponse.json(
        {
          error: "Invalid or missing componentType.",
        },
        { status: 400 }
      );
    }

    if (!body.framework?.trim()) {
      return NextResponse.json(
        {
          error: "Invalid or missing framework",
        },
        { status: 400 }
      );
    }

    if (!body.componentDescription?.trim()) {
      return NextResponse.json(
        {
          error: "Description is required.",
        },
        { status: 400 }
      );
    }

    // Check user credits (only for authenticated users without unlimited access)
    let userRecord = null;
    let currentCredits = 0;

    if (user && !body.unlimitedAccess) {
      [userRecord] = await db
        .select()
        .from(users)
        .where(eq(users.id, user.id))
        .limit(1);

      if (!userRecord) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      currentCredits = userRecord.credits;

      if (currentCredits < CREDIT_COST) {
        return NextResponse.json(
          {
            error: `Insufficient credits. You need ${CREDIT_COST} credit${
              CREDIT_COST > 1 ? "s" : ""
            } but have ${currentCredits}.`,
            code: "INSUFFICIENT_CREDITS",
          },
          { status: 402 }
        );
      }
    } else if (user) {
      // Get user record for unlimited access users (for logging purposes)
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
      body.customRequirement!
    );

    // Call model
    const useOpenRouter = isOpenRouterModel(DEFAULT_MODEL);

    if (useOpenRouter && !isOpenRouterConfigured()) {
      throw new Error(
        "OpenRouter API key not configured. Please add OPENROUTER_API_KEY to your environment variables."
      );
    }

    const client = useOpenRouter ? openrouter : openai;
    const baseParams = {
      model: DEFAULT_MODEL,
      messages: [
        { role: "system" as const, content: SYSTEM_PROMPT },
        { role: "user" as const, content: userPrompt },
      ],
    };

    // Create completion with model-specific parameters
    const completion = await client.chat.completions.create({
      ...baseParams,
      temperature: MAX_AI_TEMP,
      max_completion_tokens: MAX_AI_TOKENS,
    });

    // Trim leading/trailing whitespace
    const responseText = completion.choices[0]?.message?.content?.trim();

    if (!responseText) {
      throw new Error("No response from AI model");
    }

    // Extract JSON from markdown code blocks if present
    let cleanedResponse = responseText;
    const jsonMatch = responseText.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
    if (jsonMatch) {
      cleanedResponse = jsonMatch[1];
    }

    // Parsing
    let parsedData: any;
    try {
      parsedData = JSON.parse(cleanedResponse);
    } catch (err) {
      // AI did not return valid JSON
      errorLogger.logMinorError("AI returned invalid JSON", {
        component: "generate-accessible-code-api",
        userId: user?.id ?? "unknown",
        error: String(err),
        rawResponse: responseText,
      });

      const recovery = buildRecoveryJson("ai_response_not_json");

      return NextResponse.json(recovery, { status: 200 });
    }

    // validate parsed object against rules
    const validationResult = validateAiOutput(parsedData);

    if (!validationResult.ok) {
      // model violated validation rules: return recovery schema
      errorLogger.logMinorError("AI output failed server validation", {
        component: "generate-accessible-code-api",
        userId: user?.id ?? "unknown",
        validationReason: validationResult.reason,
        rawParsedPreview: JSON.stringify(parsedData),
      });

      const recovery = buildRecoveryJson(validationResult.reason!);
      return NextResponse.json(recovery, { status: 200 });
    }

    // Handle credit deduction and logging based on user type
    if (user && userRecord && !body.unlimitedAccess) {
      // Deduct credit and record transaction for authenticated users (skip for unlimited access)
      const newBalance = currentCredits - CREDIT_COST;

      await Promise.all([
        // Update user credits
        db
          .update(users)
          .set({
            credits: newBalance,
            totalCreditsUsed: userRecord.totalCreditsUsed + CREDIT_COST,
            updatedAt: new Date(),
          })
          .where(eq(users.id, user.id)),

        // Record credit transaction
        db.insert(creditTransactions).values({
          userId: userRecord.id,
          type: "usage",
          amount: -CREDIT_COST,
          balanceBefore: currentCredits,
          balanceAfter: newBalance,
          description: "AI Accessibility Code Generator",
          toolUsed: "accessibility_code_generator",
          metadata: {
            componentType: body.componentType,
            framework: body.framework,
            componentDescription: body.componentDescription?.substring?.(
              0,
              100
            ),
            customRequirement: body.customRequirement?.substring?.(0, 100),
          },
        }),

        // Record tool usage
        db.insert(toolUsage).values({
          userId: userRecord.id,
          tool: "accessibility_code_generator",
          creditsUsed: CREDIT_COST,
          inputData: {
            componentType: body.componentType,
            framework: body.framework,
            componentDescription: body.componentDescription?.substring?.(
              0,
              100
            ),
            customRequirement: body.customRequirement?.substring?.(0, 100),
          },
          success: true,
        }),
      ]);

      // Prepare final response for authenticated users
      const result: ResponseBody = {
        ...parsedData,
        creditsUsed: CREDIT_COST,
        remainingCredits: newBalance,
      };

      return NextResponse.json(result);
    } else if (body.unlimitedAccess) {
      // Unlimited access - no credits or trial usage recording
      console.log("⚡ Processing with unlimited access - no limits applied");

      const result: ResponseBody = {
        ...parsedData,
        creditsUsed: 0,
        remainingCredits: user && userRecord ? userRecord.credits : 0,
        unlimitedAccess: true,
      };

      return NextResponse.json(result);
    } else {
      // Record trial usage for non-authenticated users without unlimited access
      await recordTrialUsage("accessibility_code_generator");

      // Prepare final response for trial users
      const result: ResponseBody = {
        ...parsedData,
        creditsUsed: 0,
        remainingCredits: 0,
        trialStatus: {
          usageCount: 0,
          remainingUses: 0,
          limitReached: false,
        },
      };

      return NextResponse.json(result);
    }
  } catch (error) {
    console.error("Accessibility Code Generator Error:", error);

    errorLogger.logMajorError("Accessibility code generation failed", {
      component: "accessibility-code-generator-api",
      userId: (await currentUser())?.id || "unknown",
      error: error instanceof Error ? error : new Error(String(error)),
    });

    if (error instanceof Error) {
      if (
        error.message.includes("insufficient_quota") ||
        error.message.includes("rate_limit")
      ) {
        return NextResponse.json(
          {
            error:
              "AI service temporarily unavailable. Please try again in a few minutes.",
          },
          { status: 503 }
        );
      }
      if (
        error.message.includes("No response from AI model") ||
        error.message.includes("Invalid response format")
      ) {
        return NextResponse.json(
          {
            error:
              "Unable to process the analysis. Please try rephrasing your component description.",
          },
          { status: 422 }
        );
      }
    }

    return NextResponse.json(
      {
        error:
          "An error occurred while generating accessible component code. Please try again.",
      },
      { status: 500 }
    );
  }
}
