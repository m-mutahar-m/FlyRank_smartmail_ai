import { describe, it, expect, vi, beforeEach } from "vitest";
import { processSmartMailRequest, GEMINI_MODEL } from "@/lib/gemini";
import { SmartMailRequest } from "@/types/email";

// Mock @google/genai SDK class constructor
const mockGenerateContent = vi.fn();

vi.mock("@google/genai", () => {
  return {
    GoogleGenAI: vi.fn().mockImplementation(function (this: { models: { generateContent: typeof mockGenerateContent } }) {
      this.models = {
        generateContent: mockGenerateContent,
      };
    }),
  };
});

describe("Gemini Server Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.GEMINI_API_KEY = "test_api_key_123";
  });

  it("should process generate mode request and return validated output", async () => {
    const mockOutput = {
      subject: "Meeting Request: Thesis Proposal Discussion",
      email: "Dear Prof. Smith,\n\nI hope this email finds you well...",
      tone: "Professional & Courteous",
      professionalismScore: 95,
      clarityScore: 92,
      suggestions: ["Add a specific time slot option"],
      improvements: ["Clear subject line", "Polite closing"],
    };

    mockGenerateContent.mockResolvedValueOnce({
      text: JSON.stringify(mockOutput),
    });

    const requestPayload: SmartMailRequest = {
      mode: "generate",
      recipientType: "Professor",
      purpose: "Meeting Request",
      tone: "Professional",
      context: "Requesting a meeting next Tuesday morning to discuss thesis proposal.",
    };

    const response = await processSmartMailRequest(requestPayload);

    expect(response.subject).toBe(mockOutput.subject);
    expect(response.professionalismScore).toBe(95);
    expect(mockGenerateContent).toHaveBeenCalledWith(
      expect.objectContaining({
        model: GEMINI_MODEL,
        config: { responseMimeType: "application/json" },
      })
    );
  });

  it("should throw error if GEMINI_API_KEY is missing", async () => {
    delete process.env.GEMINI_API_KEY;

    const requestPayload: SmartMailRequest = {
      mode: "improve",
      existingDraft: "Hi Prof Smith, checking in on my paper draft status.",
    };

    await expect(processSmartMailRequest(requestPayload)).rejects.toThrow(
      "Server configuration error"
    );
  });
});
