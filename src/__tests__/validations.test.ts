import { describe, it, expect } from "vitest";
import { generateEmailSchema, improveEmailSchema } from "@/lib/validations";

describe("Form Validation Schemas", () => {
  describe("generateEmailSchema", () => {
    it("should accept valid generate email input", () => {
      const input = {
        recipientType: "Professor",
        purpose: "Meeting Request",
        tone: "Professional",
        context: "Requesting a meeting next Tuesday to discuss thesis research.",
      };

      const result = generateEmailSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it("should reject context shorter than 10 characters", () => {
      const input = {
        recipientType: "Professor",
        purpose: "Meeting Request",
        tone: "Professional",
        context: "Short",
      };

      const result = generateEmailSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it("should reject context with less than 3 words", () => {
      const input = {
        recipientType: "Professor",
        purpose: "Meeting Request",
        tone: "Professional",
        context: "SingleWordThatIsLongEnough",
      };

      const result = generateEmailSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });

  describe("improveEmailSchema", () => {
    it("should accept valid existing email draft", () => {
      const input = {
        existingDraft: "Hi Prof Smith, I wanted to check if you had time to meet about my draft.",
      };

      const result = improveEmailSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it("should reject whitespace-only draft", () => {
      const input = {
        existingDraft: "            ",
      };

      const result = improveEmailSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });
});
