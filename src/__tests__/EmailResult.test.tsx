import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import EmailResult from "@/components/EmailResult";

const mockResult = {
  subject: "Meeting Request: Thesis Proposal Discussion",
  email: "Dear Prof. Smith,\n\nI hope this email finds you well. I would like to request a meeting...",
  tone: "Professional & Formal",
  professionalismScore: 96,
  clarityScore: 92,
  suggestions: ["Add a preferred time window"],
  improvements: ["Clear subject line", "Polite closing"],
};

const writeTextMock = vi.fn().mockResolvedValue(undefined);

describe("EmailResult Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    writeTextMock.mockResolvedValue(undefined);

    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: writeTextMock,
      },
      writable: true,
      configurable: true,
    });
  });

  it("renders subject, email body, tone badge, and rating scores", () => {
    render(<EmailResult mode="generate" result={mockResult} />);

    expect(screen.getByText("Meeting Request: Thesis Proposal Discussion")).toBeInTheDocument();
    expect(screen.getByText(/Dear Prof. Smith/i)).toBeInTheDocument();
    expect(screen.getByText(/Tone: Professional & Formal/i)).toBeInTheDocument();
    expect(screen.getByText("96/100")).toBeInTheDocument();
    expect(screen.getByText("92/100")).toBeInTheDocument();
  });

  it("handles copy subject button interaction and displays accessible status feedback", async () => {
    render(<EmailResult mode="generate" result={mockResult} />);

    const copySubjectBtn = screen.getByRole("button", { name: /Copy subject line to clipboard/i });

    await act(async () => {
      fireEvent.click(copySubjectBtn);
      await Promise.resolve();
    });

    expect(writeTextMock).toHaveBeenCalledWith(mockResult.subject);
    expect(screen.getAllByText("Subject copied").length).toBeGreaterThan(0);
  });

  it("handles copy email body button interaction and displays accessible status feedback", async () => {
    render(<EmailResult mode="generate" result={mockResult} />);

    const copyEmailBtn = screen.getByRole("button", { name: /Copy email message body to clipboard/i });

    await act(async () => {
      fireEvent.click(copyEmailBtn);
      await Promise.resolve();
    });

    expect(writeTextMock).toHaveBeenCalledWith(mockResult.email);
    expect(screen.getAllByText("Email copied").length).toBeGreaterThan(0);
  });
});
