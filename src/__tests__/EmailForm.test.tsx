import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import EmailForm from "@/components/EmailForm";

describe("EmailForm Component", () => {
  it("renders all form inputs and accessible labels properly in Generate mode", () => {
    const handleSubmit = vi.fn();
    render(<EmailForm mode="generate" onSubmit={handleSubmit} />);

    expect(screen.getByLabelText(/1. Recipient Type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/2. Email Purpose/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/3. Desired Tone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/4. Key Details \/ Context/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Generate email/i })).toBeInTheDocument();
  });

  it("renders existing email draft input in Improve mode", () => {
    const handleSubmit = vi.fn();
    render(<EmailForm mode="improve" onSubmit={handleSubmit} />);

    expect(screen.getByLabelText(/Existing Email Draft/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/1. Recipient Type/i)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Improve my email/i })).toBeInTheDocument();
  });

  it("displays client-side validation error when submitting short context in Generate mode", () => {
    const handleSubmit = vi.fn();
    render(<EmailForm mode="generate" onSubmit={handleSubmit} />);

    const contextInput = screen.getByLabelText(/4. Key Details \/ Context/i);
    fireEvent.change(contextInput, { target: { value: "Short" } });

    const submitBtn = screen.getByRole("button", { name: /Generate email/i });
    fireEvent.click(submitBtn);

    expect(handleSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("disables submit button and fields during loading state", () => {
    const handleSubmit = vi.fn();
    render(<EmailForm mode="generate" onSubmit={handleSubmit} isSubmitting={true} />);

    const submitBtn = screen.getByRole("button", { name: /Generating email.../i });
    expect(submitBtn).toBeDisabled();

    const recipientSelect = screen.getByLabelText(/1. Recipient Type/i);
    expect(recipientSelect).toBeDisabled();
  });
});
