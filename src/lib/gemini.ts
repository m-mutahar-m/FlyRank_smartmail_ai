import "server-only";
import { GoogleGenAI } from "@google/genai";
import {
  SmartMailRequest,
  SmartMailResponse,
  smartMailResponseSchema,
} from "@/types/email";

/**
 * Primary Gemini model identifier for SmartMail AI.
 * Using model 'gemini-3.6-flash'.
 */
export const GEMINI_MODEL = "gemini-3.6-flash";

/**
 * Server-only Gemini API Client factory.
 * Securely reads process.env.GEMINI_API_KEY.
 */
export function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === "" || apiKey === "your_gemini_api_key_here") {
    throw new Error("Server configuration error. Please ensure API credentials are set.");
  }

  return new GoogleGenAI({ apiKey });
}

/**
 * Safe JSON parsing fallback helper to strip markdown code fences if present.
 */
function cleanJsonResponse(rawText: string): string {
  return rawText
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

/**
 * Server-side service to process email generation or refinement requests
 * using the official Google Gen AI SDK.
 * Includes a 30-second execution timeout guard and clean error logging.
 */
export async function processSmartMailRequest(
  request: SmartMailRequest
): Promise<SmartMailResponse> {
  const ai = getGeminiClient();

  let prompt = "";

  if (request.mode === "generate") {
    prompt = `You are SmartMail AI, an elite email assistant for students and professionals.
Generate an articulate, well-structured, and context-aware email.

INPUT PARAMETERS:
- Recipient Type: ${request.recipientType}
- Email Purpose: ${request.purpose}
- Desired Tone: ${request.tone}
- User Context & Key Details: ${request.context}

STRICT CONSTRAINTS:
1. Never invent names, dates, companies, credentials, or unstated facts.
2. Use standard bracketed placeholders (e.g., [Recipient's Name], [Date]) for unspecified details.
3. Do not claim an action occurred if it was not explicitly stated in the context.
4. Keep the email reasonably concise, professional, and properly formatted.

You MUST respond strictly in valid JSON matching this schema:
{
  "subject": "Clear, concise email subject line",
  "email": "Full email body text including salutation and sign-off",
  "tone": "Detected tone description (e.g. Professional & Formal)",
  "professionalismScore": 95,
  "clarityScore": 90,
  "suggestions": ["Actionable suggestion 1", "Actionable suggestion 2"],
  "improvements": ["Key composition feature 1", "Key composition feature 2"]
}`;
  } else {
    prompt = `You are SmartMail AI, an elite email assistant for students and professionals.
Refine and elevate an existing email draft.

EXISTING EMAIL DRAFT:
"""
${request.existingDraft}
"""

STRICT CONSTRAINTS:
1. Preserve the original core meaning and intent completely.
2. Never invent names, dates, companies, credentials, or unstated facts.
3. Do not claim an action occurred if it was not mentioned in the draft.
4. Improve grammar, phrasing, flow, and clarity while keeping the email reasonably concise.

You MUST respond strictly in valid JSON matching this schema:
{
  "subject": "Improved or generated subject line",
  "email": "Refined email body text",
  "tone": "Detected tone description (e.g. Polished & Professional)",
  "professionalismScore": 98,
  "clarityScore": 95,
  "suggestions": ["Actionable suggestion for future drafting"],
  "improvements": ["Specific improvement 1 made to draft", "Specific improvement 2 made to draft"]
}`;
  }

  // 30-second execution timeout promise race to prevent premature request cancellation
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error("The request took too long to complete. Please try again."));
    }, 30000);
  });

  try {
    const apiCallPromise = ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const response = await Promise.race([apiCallPromise, timeoutPromise]);

    const rawText = response.text;
    if (!rawText) {
      throw new Error("Gemini API returned an empty response.");
    }

    const cleanedText = cleanJsonResponse(rawText);
    const jsonParsed = JSON.parse(cleanedText);
    return smartMailResponseSchema.parse(jsonParsed);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Gemini Failure Details:", errorMessage);
    throw error;
  }
}
