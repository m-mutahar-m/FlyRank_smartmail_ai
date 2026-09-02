import { z } from "zod";

/**
 * Zod schema for SmartMail AI assistant response payload.
 * Defines structured JSON data returned by the server-side Gemini API route.
 */
export const smartMailResponseSchema = z.object({
  subject: z.string().min(1, "Subject line cannot be empty."),
  email: z.string().min(1, "Email body content cannot be empty."),
  tone: z.string().min(1, "Tone description cannot be empty."),
  professionalismScore: z
    .number()
    .min(0, "Professionalism score must be between 0 and 100.")
    .max(100, "Professionalism score must be between 0 and 100."),
  clarityScore: z
    .number()
    .min(0, "Clarity score must be between 0 and 100.")
    .max(100, "Clarity score must be between 0 and 100."),
  suggestions: z.array(z.string()),
  improvements: z.array(z.string()),
});

/**
 * TypeScript type for SmartMail AI response inferred directly from Zod.
 */
export type SmartMailResponse = z.infer<typeof smartMailResponseSchema>;

/**
 * Zod schema for SmartMail API Requests (Generate Mode).
 */
export const generateApiRequestSchema = z.object({
  mode: z.literal("generate"),
  recipientType: z.string().min(1, "Recipient type is required."),
  purpose: z.string().min(1, "Purpose is required."),
  tone: z.string().min(1, "Tone is required."),
  context: z.string().trim().min(1, "Context is required."),
});

/**
 * Zod schema for SmartMail API Requests (Improve Mode).
 */
export const improveApiRequestSchema = z.object({
  mode: z.literal("improve"),
  existingDraft: z.string().trim().min(1, "Existing draft is required."),
});

/**
 * Discriminated union Zod schema for any SmartMail API Request.
 */
export const smartMailRequestSchema = z.discriminatedUnion("mode", [
  generateApiRequestSchema,
  improveApiRequestSchema,
]);

export type GenerateApiRequest = z.infer<typeof generateApiRequestSchema>;
export type ImproveApiRequest = z.infer<typeof improveApiRequestSchema>;
export type SmartMailRequest = z.infer<typeof smartMailRequestSchema>;
