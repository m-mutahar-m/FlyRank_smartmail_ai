"use client";

import { useState, FormEvent } from "react";
import Image from "next/image";
import { AssistantMode } from "@/components/ModeSelector";
import ErrorMessage from "@/components/ErrorMessage";
import {
  generateEmailSchema,
  improveEmailSchema,
  RECIPIENT_TYPES,
  EMAIL_PURPOSES,
  TONE_OPTIONS,
  GenerateEmailInput,
  ImproveEmailInput,
} from "@/lib/validations";

export type EmailFormData =
  | ({ mode: "generate" } & GenerateEmailInput)
  | ({ mode: "improve" } & ImproveEmailInput);

interface EmailFormProps {
  mode: AssistantMode;
  onSubmit: (data: EmailFormData) => Promise<void> | void;
  isSubmitting?: boolean;
  serverError?: string | null;
}

export default function EmailForm({
  mode,
  onSubmit,
  isSubmitting = false,
  serverError = null,
}: EmailFormProps) {
  // Generate Mode State (Preserved across mode toggles & error retries)
  const [recipientType, setRecipientType] = useState<string>("Professor");
  const [purpose, setPurpose] = useState<string>("Meeting Request");
  const [tone, setTone] = useState<string>("Professional");
  const [generateContext, setGenerateContext] = useState<string>("");

  // Improve Mode State (Preserved across mode toggles & error retries)
  const [existingDraft, setExistingDraft] = useState<string>("");

  // Client-side Validation Error State
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return; // Prevent double submissions

    if (mode === "generate") {
      const result = generateEmailSchema.safeParse({
        recipientType,
        purpose,
        tone,
        context: generateContext,
      });

      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.issues.forEach((issue) => {
          if (issue.path[0]) {
            fieldErrors[issue.path[0].toString()] = issue.message;
          }
        });
        setErrors(fieldErrors);
        return;
      }

      setErrors({});
      onSubmit({
        mode: "generate",
        ...result.data,
      });
    } else {
      const result = improveEmailSchema.safeParse({
        existingDraft,
      });

      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.issues.forEach((issue) => {
          if (issue.path[0]) {
            fieldErrors[issue.path[0].toString()] = issue.message;
          }
        });
        setErrors(fieldErrors);
        return;
      }

      setErrors({});
      onSubmit({
        mode: "improve",
        ...result.data,
      });
    }
  };

  const clearFieldError = (fieldName: string) => {
    if (errors[fieldName]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[fieldName];
        return updated;
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label={mode === "generate" ? "Generate Email Form" : "Improve Email Form"}
      className="space-y-6 bg-paper-card border border-paper-border rounded-2xl p-6 sm:p-8 paper-shadow-lg transition-all duration-200"
    >
      <div className="border-b border-paper-border pb-4 flex items-center justify-between">
        <div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-ink-900">
            {mode === "generate" ? "Generate Email Draft" : "Improve Existing Email"}
          </h3>
          <p className="text-xs text-ink-500 mt-0.5">
            {mode === "generate"
              ? "Fill in key details below to craft a fresh, articulate email."
              : "Paste your existing email draft to refine tone, fix awkward phrasing, and enhance clarity."}
          </p>
        </div>
        <span className="px-2.5 py-1 rounded bg-vermillion-100 text-vermillion-600 text-xs font-semibold uppercase tracking-wider border border-vermillion-500/20 hidden sm:inline">
          {mode === "generate" ? "Form Mode 01" : "Form Mode 02"}
        </span>
      </div>

      {/* Reusable Editorial Error Message Banner */}
      {serverError && (
        <ErrorMessage
          message={serverError}
          onRetry={() => {
            handleSubmit({ preventDefault: () => {} } as FormEvent);
          }}
        />
      )}

      {mode === "generate" ? (
        /* Generate Mode Fields */
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Recipient Type */}
            <div className="space-y-2">
              <label
                htmlFor="recipient-type"
                className="block text-xs font-semibold uppercase tracking-wider text-ink-700"
              >
                1. Recipient Type <span className="text-vermillion-500" aria-hidden="true">*</span>
              </label>
              <select
                id="recipient-type"
                disabled={isSubmitting}
                value={recipientType}
                onChange={(e) => {
                  setRecipientType(e.target.value);
                  clearFieldError("recipientType");
                }}
                aria-invalid={Boolean(errors.recipientType)}
                aria-describedby={
                  errors.recipientType ? "recipientType-error" : "recipientType-help"
                }
                className={`w-full px-4 py-2.5 rounded-xl bg-paper-subtle text-ink-900 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vermillion-600 transition-colors cursor-pointer disabled:opacity-60 ${
                  errors.recipientType
                    ? "border-2 border-vermillion-500 bg-vermillion-50/50"
                    : "border border-paper-border"
                }`}
              >
                {RECIPIENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.recipientType ? (
                <p
                  id="recipientType-error"
                  role="alert"
                  className="text-xs font-semibold text-vermillion-600 flex items-center gap-1.5 pt-0.5"
                >
                  <span aria-hidden="true">⚠️</span>
                  <span>{errors.recipientType}</span>
                </p>
              ) : (
                <p id="recipientType-help" className="text-[11px] text-ink-500">
                  Helps calibrate salutation, etiquette, and structure.
                </p>
              )}
            </div>

            {/* 2. Email Purpose */}
            <div className="space-y-2">
              <label
                htmlFor="email-purpose"
                className="block text-xs font-semibold uppercase tracking-wider text-ink-700"
              >
                2. Email Purpose <span className="text-vermillion-500" aria-hidden="true">*</span>
              </label>
              <select
                id="email-purpose"
                disabled={isSubmitting}
                value={purpose}
                onChange={(e) => {
                  setPurpose(e.target.value);
                  clearFieldError("purpose");
                }}
                aria-invalid={Boolean(errors.purpose)}
                aria-describedby={errors.purpose ? "purpose-error" : "purpose-help"}
                className={`w-full px-4 py-2.5 rounded-xl bg-paper-subtle text-ink-900 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vermillion-600 transition-colors cursor-pointer disabled:opacity-60 ${
                  errors.purpose
                    ? "border-2 border-vermillion-500 bg-vermillion-50/50"
                    : "border border-paper-border"
                }`}
              >
                {EMAIL_PURPOSES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              {errors.purpose ? (
                <p
                  id="purpose-error"
                  role="alert"
                  className="text-xs font-semibold text-vermillion-600 flex items-center gap-1.5 pt-0.5"
                >
                  <span aria-hidden="true">⚠️</span>
                  <span>{errors.purpose}</span>
                </p>
              ) : (
                <p id="purpose-help" className="text-[11px] text-ink-500">
                  Establishes the primary objective and call-to-action.
                </p>
              )}
            </div>
          </div>

          {/* 3. Desired Tone */}
          <div className="space-y-2">
            <label
              id="tone-group-label"
              className="block text-xs font-semibold uppercase tracking-wider text-ink-700"
            >
              3. Desired Tone <span className="text-vermillion-500" aria-hidden="true">*</span>
            </label>
            <div
              role="radiogroup"
              aria-labelledby="tone-group-label"
              aria-invalid={Boolean(errors.tone)}
              aria-describedby={errors.tone ? "tone-error" : undefined}
              className="flex flex-wrap gap-2 pt-1"
            >
              {TONE_OPTIONS.map((t) => {
                const isSelected = tone === t;
                return (
                  <button
                    key={t}
                    type="button"
                    role="radio"
                    disabled={isSubmitting}
                    aria-checked={isSelected}
                    onClick={() => {
                      setTone(t);
                      clearFieldError("tone");
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vermillion-600 disabled:opacity-60 ${
                      isSelected
                        ? "bg-vermillion-500 text-white border-2 border-vermillion-600 shadow-sm"
                        : "bg-paper-subtle text-ink-700 hover:bg-paper-card border border-paper-border"
                    }`}
                  >
                    {isSelected ? "✓ " : ""}
                    {t}
                  </button>
                );
              })}
            </div>
            {errors.tone && (
              <p
                id="tone-error"
                role="alert"
                className="text-xs font-semibold text-vermillion-600 flex items-center gap-1.5 pt-0.5"
              >
                <span aria-hidden="true">⚠️</span>
                <span>{errors.tone}</span>
              </p>
            )}
          </div>

          {/* 4. Context Textarea */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="email-context"
                className="block text-xs font-semibold uppercase tracking-wider text-ink-700"
              >
                4. Key Details / Context <span className="text-vermillion-500" aria-hidden="true">*</span>
              </label>
              <span className="text-[11px] text-ink-500 font-mono">
                {generateContext.length} characters
              </span>
            </div>

            <textarea
              id="email-context"
              rows={4}
              disabled={isSubmitting}
              value={generateContext}
              onChange={(e) => {
                setGenerateContext(e.target.value);
                clearFieldError("context");
              }}
              aria-invalid={Boolean(errors.context)}
              aria-describedby={errors.context ? "context-error" : "context-help"}
              placeholder="e.g., Requesting a meeting with Prof. Smith next Tuesday morning to discuss my thesis proposal on machine learning..."
              className={`w-full p-4 rounded-xl bg-paper-subtle text-ink-900 text-sm placeholder:text-ink-300 leading-relaxed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vermillion-600 transition-colors disabled:opacity-60 ${
                errors.context
                  ? "border-2 border-vermillion-500 bg-vermillion-50/50"
                  : "border border-paper-border"
              }`}
            />

            {errors.context ? (
              <p
                id="context-error"
                role="alert"
                className="text-xs font-semibold text-vermillion-600 flex items-center gap-1.5 pt-0.5"
              >
                <span aria-hidden="true">⚠️</span>
                <span>{errors.context}</span>
              </p>
            ) : (
              <p id="context-help" className="text-[11px] text-ink-500">
                Mention any specific dates, names, or key points you wish to include. Must contain at least 10 characters.
              </p>
            )}
          </div>
        </>
      ) : (
        /* Improve Mode Fields */
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="existing-draft"
              className="block text-xs font-semibold uppercase tracking-wider text-ink-700"
            >
              Existing Email Draft <span className="text-vermillion-500" aria-hidden="true">*</span>
            </label>
            <span className="text-[11px] text-ink-500 font-mono">
              {existingDraft.length} characters
            </span>
          </div>

          <textarea
            id="existing-draft"
            rows={7}
            disabled={isSubmitting}
            value={existingDraft}
            onChange={(e) => {
              setExistingDraft(e.target.value);
              clearFieldError("existingDraft");
            }}
            aria-invalid={Boolean(errors.existingDraft)}
            aria-describedby={errors.existingDraft ? "draft-error" : "draft-help"}
            placeholder="Paste your existing email draft here (e.g., 'Hi Prof, I wanted to check if you had time to look at my paper draft from last week...'). SmartMail AI will enhance tone, polish word choices, and improve clarity."
            className={`w-full p-4 rounded-xl bg-paper-subtle text-ink-900 text-sm placeholder:text-ink-300 leading-relaxed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vermillion-600 transition-colors disabled:opacity-60 ${
              errors.existingDraft
                ? "border-2 border-vermillion-500 bg-vermillion-50/50"
                : "border border-paper-border"
            }`}
          />

          {errors.existingDraft ? (
            <p
              id="draft-error"
              role="alert"
              className="text-xs font-semibold text-vermillion-600 flex items-center gap-1.5 pt-0.5"
            >
              <span aria-hidden="true">⚠️</span>
              <span>{errors.existingDraft}</span>
            </p>
          ) : (
            <p id="draft-help" className="text-[11px] text-ink-500">
              Paste the draft you wish to refine. Must contain at least 10 characters.
            </p>
          )}
        </div>
      )}

      {/* Primary Action Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-vermillion-500 text-white font-semibold text-sm shadow-sm hover:bg-vermillion-600 active:scale-[0.99] disabled:opacity-50 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vermillion-600 cursor-pointer group"
        >
          <span>
            {isSubmitting
              ? mode === "generate"
                ? "Generating email..."
                : "Improving email..."
              : mode === "generate"
              ? "Generate email"
              : "Improve my email"}
          </span>
          <Image
            src={mode === "generate" ? "/assets/paper-plane.svg" : "/assets/handwritten-note.svg"}
            alt=""
            width={18}
            height={18}
            aria-hidden="true"
            className="brightness-200 group-hover:translate-x-1 transition-transform duration-200"
          />
        </button>
      </div>
    </form>
  );
}
