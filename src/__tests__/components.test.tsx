import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ModeSelector from "@/components/ModeSelector";
import EmailForm from "@/components/EmailForm";
import ErrorMessage from "@/components/ErrorMessage";
import EmailResult from "@/components/EmailResult";

describe("UI Components Tests", () => {
  describe("ModeSelector", () => {
    it("renders both Generate Email and Improve Draft tabs", () => {
      const handleSelect = vi.fn();
      render(<ModeSelector activeMode="generate" onSelectMode={handleSelect} />);

      expect(screen.getByRole("tab", { name: /Generate Email/i })).toBeInTheDocument();
      expect(screen.getByRole("tab", { name: /Improve Draft/i })).toBeInTheDocument();
    });

    it("triggers onSelectMode when tab is clicked", () => {
      const handleSelect = vi.fn();
      render(<ModeSelector activeMode="generate" onSelectMode={handleSelect} />);

      const improveTab = screen.getByRole("tab", { name: /Improve Draft/i });
      fireEvent.click(improveTab);

      expect(handleSelect).toHaveBeenCalledWith("improve");
    });
  });

  describe("ErrorMessage", () => {
    it("renders alert message with role='alert'", () => {
      render(<ErrorMessage message="Server error occurred" />);

      const alertBanner = screen.getByRole("alert");
      expect(alertBanner).toBeInTheDocument();
      expect(screen.getByText("Server error occurred")).toBeInTheDocument();
    });

    it("triggers onRetry callback when Try Again button is clicked", () => {
      const handleRetry = vi.fn();
      render(<ErrorMessage message="Temporary error" onRetry={handleRetry} />);

      const retryBtn = screen.getByRole("button", { name: /Try Again/i });
      fireEvent.click(retryBtn);

      expect(handleRetry).toHaveBeenCalledTimes(1);
    });
  });

  describe("EmailForm", () => {
    it("displays validation error when submitting context shorter than 10 chars", () => {
      const handleSubmit = vi.fn();
      render(<EmailForm mode="generate" onSubmit={handleSubmit} />);

      const contextTextarea = screen.getByLabelText(/4. Key Details \/ Context/i);
      fireEvent.change(contextTextarea, { target: { value: "Short" } });

      const submitButton = screen.getByRole("button", { name: /Generate email/i });
      fireEvent.click(submitButton);

      expect(handleSubmit).not.toHaveBeenCalled();
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
  });

  describe("EmailResult", () => {
    it("renders generated subject and email body", () => {
      const mockResult = {
        subject: "Follow-up on Application",
        email: "Dear Hiring Team,\n\nI am following up on my application...",
        tone: "Professional",
        professionalismScore: 90,
        clarityScore: 88,
        suggestions: ["Add phone number"],
        improvements: ["Clear subject"],
      };

      render(<EmailResult mode="generate" result={mockResult} />);

      expect(screen.getByText("Follow-up on Application")).toBeInTheDocument();
      expect(screen.getByText(/I am following up on my application/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Copy subject/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Copy email/i })).toBeInTheDocument();
    });
  });
});
