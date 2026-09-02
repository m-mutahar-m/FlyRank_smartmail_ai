import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "@/app/page";

const mockSuccessResponse = {
  success: true,
  data: {
    subject: "Meeting Request: Thesis Proposal Discussion",
    email: "Dear Prof. Smith,\n\nI hope this email finds you well. I would like to request a meeting...",
    tone: "Professional & Courteous",
    professionalismScore: 96,
    clarityScore: 94,
    suggestions: ["Include specific time options"],
    improvements: ["Polite closing", "Clear subject line"],
  },
};

describe("SmartMail AI Integration User Flow", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.clearAllMocks();
    Element.prototype.scrollIntoView = vi.fn();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("completes full successful email generation flow", async () => {
    const user = userEvent.setup();

    global.fetch = vi.fn().mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: async () => mockSuccessResponse,
      } as Response)
    );

    render(<Home />);

    // 1. Verify Generate mode is default active tab
    expect(screen.getByRole("tab", { name: /Generate Email/i })).toHaveAttribute("aria-selected", "true");

    // 2. User selects recipient type
    const recipientSelect = screen.getByLabelText(/1. Recipient Type/i);
    await user.selectOptions(recipientSelect, "Professor");

    // 3. User selects purpose
    const purposeSelect = screen.getByLabelText(/2. Email Purpose/i);
    await user.selectOptions(purposeSelect, "Meeting Request");

    // 4. User selects tone
    const toneButton = screen.getByRole("radio", { name: /Professional/i });
    await user.click(toneButton);

    // 5. User enters context
    const contextTextarea = screen.getByLabelText(/4. Key Details \/ Context/i);
    await user.type(contextTextarea, "Requesting a meeting next Tuesday morning to discuss my thesis proposal.");

    // 6. User clicks Generate email
    const generateBtn = screen.getByRole("button", { name: /Generate email/i });
    await user.click(generateBtn);

    // 7. Verify API mock was called with correct payload
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/generate-email",
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "generate",
          recipientType: "Professor",
          purpose: "Meeting Request",
          tone: "Professional",
          context: "Requesting a meeting next Tuesday morning to discuss my thesis proposal.",
        }),
      })
    );

    // 8 & 9. Verify generated email document appears
    await waitFor(() => {
      expect(screen.getByText("Meeting Request: Thesis Proposal Discussion")).toBeInTheDocument();
      expect(screen.getByText(/Dear Prof. Smith/i)).toBeInTheDocument();
    });

    // 10. Verify AI quality audit analysis panel appears
    expect(screen.getByText(/AI Read & Quality Audit/i)).toBeInTheDocument();
    expect(screen.getByText("96")).toBeInTheDocument();
    expect(screen.getByText("94")).toBeInTheDocument();
  });

  it("handles failure path, displays error message, preserves user input, and allows retry", async () => {
    const user = userEvent.setup();

    const fetchMock = vi
      .fn()
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: false,
          status: 503,
          json: async () => ({
            success: false,
            error: "Our writing assistant is unavailable right now. Please try again in a moment.",
          }),
        } as Response)
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: async () => mockSuccessResponse,
        } as Response)
      );

    global.fetch = fetchMock;

    render(<Home />);

    // 1. User fills the form
    const contextTextarea = screen.getByLabelText(/4. Key Details \/ Context/i);
    const userEnteredContext = "Requesting a meeting next Tuesday morning to discuss my thesis proposal.";
    await user.type(contextTextarea, userEnteredContext);

    // 2. User submits initial request
    const form = contextTextarea.closest("form")!;
    fireEvent.submit(form);

    // 3 & 4. Verify friendly error message appears
    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(
        screen.getByText(/Our writing assistant is unavailable right now/i)
      ).toBeInTheDocument();
    });

    // 5. Verify user's entered content remains intact
    expect(contextTextarea).toHaveValue(userEnteredContext);

    // 6. User retries by submitting form again
    fireEvent.submit(form);

    // Verify retry succeeds and results render
    await waitFor(() => {
      expect(screen.getByText("Meeting Request: Thesis Proposal Discussion")).toBeInTheDocument();
    });

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
