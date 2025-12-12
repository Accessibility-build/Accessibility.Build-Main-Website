import { NextResponse } from "next/server";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { currentUser } from "@clerk/nextjs/server";
import { hasEnoughCredits, useCredits } from "@/lib/credits";
import { errorLogger } from "@/lib/error-logger";
import { checkTrialLimit, recordTrialUsage } from "@/lib/trial-usage";

export async function POST(req: Request) {
  let user: Awaited<ReturnType<typeof currentUser>> = null;

  try {
    // Check authentication
    user = await currentUser();

    // If not authenticated, check trial usage
    if (!user) {
      const trialStatus = await checkTrialLimit("alt_text_generator");
      if (!trialStatus.allowed) {
        return NextResponse.json(
          {
            error: trialStatus.message,
            code: "TRIAL_LIMIT_EXCEEDED",
            trialStatus: {
              remaining: trialStatus.remaining,
              resetTime: trialStatus.resetTime,
            },
          },
          { status: 403 }
        );
      }
    }

    // Parse and validate request body
    const body = await req.json();
    const {
      imageUrl,
      context,
      lengthPreference = "medium",
      targetWordCount = 40,
    } = body;

    if (!imageUrl) {
      return NextResponse.json(
        {
          error:
            "Image is required. Please upload an image or provide a valid image URL.",
        },
        { status: 400 }
      );
    }

    // Validate image format
    const isBase64 = imageUrl.startsWith("data:image/");
    const isHttpUrl =
      imageUrl.startsWith("http://") || imageUrl.startsWith("https://");

    if (!isBase64 && !isHttpUrl) {
      return NextResponse.json(
        {
          error:
            "Invalid image format. Please provide a valid image URL or upload an image file.",
        },
        { status: 400 }
      );
    }

    // Check credit availability (only for authenticated users)
    if (user) {
      const hasCredits = await hasEnoughCredits("alt_text_generator", user.id);
      if (!hasCredits) {
        return NextResponse.json(
          {
            error:
              "Insufficient credits. You need 1 credit to generate alt text.",
            code: "INSUFFICIENT_CREDITS",
          },
          { status: 402 }
        );
      }
    }

    // Construct enhanced prompt for better alt text generation with length preference
    const getSystemPrompt = (lengthStyle: string, wordCount: number) => {
      let lengthGuideline = "";

      switch (lengthStyle) {
        case "short":
          lengthGuideline = `Create CONCISE alt text (approximately ${wordCount} words). Focus only on the most essential visual elements.`;
          break;
        case "medium":
          lengthGuideline = `Create moderately detailed alt text (approximately ${wordCount} words). Balance brevity with useful detail.`;
          break;
        case "long":
          lengthGuideline = `Create detailed alt text (approximately ${wordCount} words). Include important visual details and context.`;
          break;
        case "comprehensive":
          lengthGuideline = `Create comprehensive alt text (approximately ${wordCount} words). Provide thorough descriptions suitable for detailed analysis.`;
          break;
        case "custom":
          lengthGuideline = `Create alt text with approximately ${wordCount} words. Adjust detail level accordingly.`;
          break;
        default:
          lengthGuideline = `Create moderately detailed alt text (approximately ${wordCount} words).`;
      }

      return `You are an expert accessibility consultant specializing in creating alt text for images. ${lengthGuideline}

Your alt text should:
1. Focus on what's important for understanding the image's purpose
2. Include relevant visual details that convey meaning
3. Be written in a natural, flowing style
4. Avoid redundant phrases like "image of" or "picture of"
5. Include any visible text if it's important to the content
6. Describe emotions, actions, and context when relevant

Guidelines:
- If the image contains important text, include it
- Focus on elements that convey the image's main message or purpose
- Use active voice when describing actions
- Be specific about colors, objects, and people when relevant to the content
- Consider the context and purpose of where this image will be used
- Aim for approximately ${wordCount} words in your response`;
    };

    const systemPrompt = getSystemPrompt(lengthPreference, targetWordCount);

    let userPrompt =
      "Please generate concise, descriptive alt text for this image.";

    if (context && context.trim()) {
      userPrompt += `\n\nContext: ${context.trim()}\n\nPlease tailor the alt text to be appropriate for this specific use case.`;
    }

    userPrompt += "\n\nRespond with only the alt text, nothing else.";

    const startTime = Date.now();

    // Calculate appropriate token limit based on target word count
    // Roughly 1.3 tokens per word, with some buffer
    const calculateMaxTokens = (wordCount: number) => {
      const baseTokens = Math.max(
        50,
        Math.min(1000, Math.ceil(wordCount * 1.5))
      );
      return baseTokens;
    };

    const maxTokens = calculateMaxTokens(targetWordCount);

    // Generate alt text using OpenAI GPT-4 Vision (latest model)
    const { text: altText } = await generateText({
      model: openai("gpt-4o"), // Using GPT-4o (latest vision model)
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: [
            { type: "text", text: userPrompt },
            {
              type: "image",
              image: imageUrl,
            },
          ],
        },
      ],
      maxTokens: maxTokens, // Dynamic token limit based on desired length
      temperature: 0.3, // Lower temperature for more consistent, focused results
    });

    const processingTime = Date.now() - startTime;

    // Clean up the alt text (remove quotes, extra whitespace, etc.)
    const cleanedAltText = altText
      .replace(/^["']|["']$/g, "") // Remove surrounding quotes
      .replace(/\s+/g, " ") // Replace multiple spaces with single space
      .trim();

    // Validate the generated alt text
    if (!cleanedAltText || cleanedAltText.length < 10) {
      throw new Error("Generated alt text is too short or empty");
    }

    // Count words in the generated alt text
    const wordCount = cleanedAltText.split(/\s+/).length;

    // Set reasonable maximum character limit (approximately 7000 characters for 1000 words)
    const maxCharacters = Math.max(500, targetWordCount * 7);

    if (cleanedAltText.length > maxCharacters) {
      // If too long, truncate at the last complete sentence
      const truncated = cleanedAltText.substring(0, maxCharacters - 100);
      const lastPeriod = truncated.lastIndexOf(".");
      const lastComma = truncated.lastIndexOf(",");
      const cutPoint = Math.max(lastPeriod, lastComma);

      const finalAltText =
        cutPoint > 50 ? truncated.substring(0, cutPoint + 1) : truncated;

      // Log usage and consume credits (for authenticated users) or record trial usage
      if (user) {
        const creditResult = await useCredits(
          "alt_text_generator",
          {
            imageUrl: isBase64 ? "[Base64 Image]" : imageUrl,
            context,
            lengthPreference,
            targetWordCount,
            originalLength: cleanedAltText.length,
            truncated: true,
          },
          {
            altText: finalAltText,
            originalAltText: cleanedAltText,
            processingTime,
            wordCount: finalAltText.split(/\s+/).length,
          },
          user.id
        );

        return NextResponse.json({
          altText: finalAltText,
          creditsUsed: creditResult.creditsUsed,
          remainingCredits: creditResult.remainingCredits,
          note: "Alt text was slightly shortened for optimal length",
        });
      } else {
        // Record trial usage
        await recordTrialUsage("alt_text_generator");

        return NextResponse.json({
          altText: finalAltText,
          note: "Alt text was slightly shortened for optimal length",
        });
      }
    }

    // Log usage and consume credits (for authenticated users) or record trial usage
    if (user) {
      const creditResult = await useCredits(
        "alt_text_generator",
        {
          imageUrl: isBase64 ? "[Base64 Image]" : imageUrl,
          context,
          lengthPreference,
          targetWordCount,
          characterCount: cleanedAltText.length,
        },
        {
          altText: cleanedAltText,
          processingTime,
          wordCount: cleanedAltText.split(/\s+/).length,
        },
        user.id
      );

      return NextResponse.json({
        altText: cleanedAltText,
        creditsUsed: creditResult.creditsUsed,
        remainingCredits: creditResult.remainingCredits,
        wordCount: cleanedAltText.split(/\s+/).length,
        lengthPreference: lengthPreference,
      });
    } else {
      // Record trial usage
      await recordTrialUsage("alt_text_generator");

      return NextResponse.json({
        altText: cleanedAltText,
        wordCount: cleanedAltText.split(/\s+/).length,
        lengthPreference: lengthPreference,
      });
    }
  } catch (error) {
    console.error("Error generating alt text:", error);

    // Enhanced error logging
    errorLogger.logMajorError("Alt text generation failed", {
      component: "generate-alt-text-api",
      error: error instanceof Error ? error : new Error(String(error)),
      userId: user?.id || "unknown",
    });

    // Handle specific OpenAI errors
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        return NextResponse.json(
          {
            error:
              "Service configuration error. Our team has been notified. Please try again in a few minutes.",
          },
          { status: 500 }
        );
      }

      if (
        error.message.includes("rate limit") ||
        error.message.includes("quota")
      ) {
        return NextResponse.json(
          {
            error:
              "Our AI service is temporarily busy. Please try again in a moment.",
          },
          { status: 429 }
        );
      }

      if (
        error.message.includes("content filter") ||
        error.message.includes("safety")
      ) {
        return NextResponse.json(
          {
            error:
              "This image cannot be processed due to content restrictions. Please try a different image.",
          },
          { status: 400 }
        );
      }

      if (error.message.includes("image") && error.message.includes("format")) {
        return NextResponse.json(
          {
            error:
              "Unsupported image format. Please use JPG, PNG, GIF, or WebP format.",
          },
          { status: 400 }
        );
      }

      if (error.message.includes("Insufficient credits")) {
        return NextResponse.json(
          {
            error: error.message,
            code: "INSUFFICIENT_CREDITS",
          },
          { status: 402 }
        );
      }

      // Log specific error details for debugging
      if (
        error.message.includes("too short") ||
        error.message.includes("empty")
      ) {
        errorLogger.logMinorError(
          "Alt text generation produced invalid output",
          {
            component: "generate-alt-text-api",
            userId: user?.id,
            error: error.message,
          }
        );
        return NextResponse.json(
          {
            error:
              "Failed to generate meaningful alt text. Please try with a different image or add more context.",
          },
          { status: 500 }
        );
      }
    }

    // Generic error response
    return NextResponse.json(
      {
        error:
          "Failed to generate alt text. Please check your image and try again.",
      },
      { status: 500 }
    );
  }
}
