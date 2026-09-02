import { NextResponse } from "next/server";
import { smartMailRequestSchema } from "@/types/email";
import { processSmartMailRequest } from "@/lib/gemini";

/**
 * POST /api/generate-email
 *
 * Secure Next.js API Route for SmartMail AI.
 * Handles both Email Generation and Draft Improvement modes.
 * Maps specific error cases to user-friendly resilience messages.
 */
export async function POST(request: Request) {
  try {
    // 1. Parse JSON body safely
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Please tell us a little more about what you want to say.",
        },
        { status: 400 }
      );
    }

    // 2. Validate input using Zod request schema (supports generate & improve modes)
    const validationResult = smartMailRequestSchema.safeParse(body);

    if (!validationResult.success) {
      const fieldErrors: Record<string, string> = {};
      validationResult.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0].toString()] = issue.message;
        } else {
          fieldErrors.general = issue.message;
        }
      });

      return NextResponse.json(
        {
          success: false,
          error: "Please tell us a little more about what you want to say.",
          details: fieldErrors,
        },
        { status: 400 }
      );
    }

    // 3. Process email request via server-side Gemini service
    const aiResponse = await processSmartMailRequest(validationResult.data);

    // 4. Return validated safe data payload
    return NextResponse.json(
      {
        success: true,
        data: aiResponse,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    // Log exact server error internally (never leak to client response)
    console.error("Gemini API Route Error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    const lowerMessage = errorMessage.toLowerCase();

    // Missing GEMINI_API_KEY (500)
    if (
      errorMessage.includes("GEMINI_API_KEY") ||
      !process.env.GEMINI_API_KEY
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Server configuration error. Please ensure API credentials are set.",
        },
        { status: 500 }
      );
    }

    // Timeout (15s limit) (504)
    if (
      lowerMessage.includes("took too long") ||
      lowerMessage.includes("timeout")
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "The request took too long to complete. Please try again.",
        },
        { status: 504 }
      );
    }

    // Rate limit / quota exceeded (429)
    if (
      errorMessage.includes("429") ||
      lowerMessage.includes("rate limit") ||
      lowerMessage.includes("quota")
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "SmartMail is a little busy right now. Please wait a moment and try again.",
        },
        { status: 429 }
      );
    }

    // Service Unavailable / Unreachable (503)
    if (
      errorMessage.includes("503") ||
      errorMessage.includes("502") ||
      lowerMessage.includes("fetch failed") ||
      lowerMessage.includes("unavailable")
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Our writing assistant is unavailable right now. Please try again in a moment.",
        },
        { status: 503 }
      );
    }

    // Malformed JSON / Zod parse failure (500)
    if (
      lowerMessage.includes("unexpected response structure") ||
      lowerMessage.includes("json") ||
      lowerMessage.includes("zod")
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "We received an unexpected response structure. Please try again.",
        },
        { status: 500 }
      );
    }

    // Default Fallback
    return NextResponse.json(
      {
        success: false,
        error:
          "Our writing assistant is unavailable right now. Please try again in a moment.",
      },
      { status: 500 }
    );
  }
}
