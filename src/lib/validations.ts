import { z } from "zod";

export const RECIPIENT_TYPES = [
  "Professor",
  "Recruiter",
  "Manager",
  "Client",
  "Coworker",
  "Other",
] as const;

export const EMAIL_PURPOSES = [
  "Job Application",
  "Meeting Request",
  "Follow-up",
  "Thank You",
  "Request",
  "Complaint",
  "Introduction",
  "Other",
] as const;

export const TONE_OPTIONS = [
  "Professional",
  "Friendly",
  "Formal",
  "Concise",
  "Warm",
] as const;

/**
 * Generate Mode Zod Validation Schema
 */
export const generateEmailSchema = z.object({
  recipientType: z.string().min(1, "Please select a recipient type."),
  purpose: z.string().min(1, "Please select an email purpose."),
  tone: z.string().min(1, "Please select a desired tone."),
  context: z
    .string()
    .trim()
    .min(1, "Please provide key details or context for your email.")
    .min(
      10,
      "Context is too short. Please enter at least 10 characters describing your email requirements."
    )
    .refine((val) => val.trim().split(/\s+/).filter(Boolean).length >= 3, {
      message: "Please provide meaningful context containing at least 3 words.",
    }),
});

export type GenerateEmailInput = z.infer<typeof generateEmailSchema>;

/**
 * Improve Mode Zod Validation Schema
 */
export const improveEmailSchema = z.object({
  existingDraft: z
    .string()
    .trim()
    .min(1, "Please paste your existing email draft.")
    .min(
      10,
      "Email draft is too short. Please provide a draft of at least 10 characters."
    )
    .refine((val) => val.trim().split(/\s+/).filter(Boolean).length >= 3, {
      message: "Please provide a meaningful draft containing at least 3 words.",
    }),
});

export type ImproveEmailInput = z.infer<typeof improveEmailSchema>;
