"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { SmartMailResponse } from "@/types/email";
import { AssistantMode } from "@/components/ModeSelector";

interface EmailResultProps {
  mode: AssistantMode;
  result: SmartMailResponse;
  onReset?: () => void;
}

export default function EmailResult({
  mode,
  result,
  onReset,
}: EmailResultProps) {
  const [copyFeedback, setCopyFeedback] = useState<{
    field: "subject" | "email" | "full" | null;
    status: "success" | "error" | null;
    message: string | null;
  }>({ field: null, status: null, message: null });

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const triggerCopy = async (
    text: string,
    field: "subject" | "email" | "full",
    successMessage: string
  ) => {
    // Clear any existing active timeout to prevent race conditions or repeating feedback
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for environments where Clipboard API is not available
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }

      setCopyFeedback({
        field,
        status: "success",
        message: successMessage,
      });

      timeoutRef.current = setTimeout(() => {
        setCopyFeedback({ field: null, status: null, message: null });
      }, 2500);
    } catch (err) {
      console.error("Clipboard copy failed:", err);
      setCopyFeedback({
        field,
        status: "error",
        message: "Failed to copy. Please copy manually.",
      });

      timeoutRef.current = setTimeout(() => {
        setCopyFeedback({ field: null, status: null, message: null });
      }, 3000);
    }
  };

  return (
    <article
      id="email-result-document"
      tabIndex={-1}
      aria-label="Generated Email Document Result"
      className="bg-paper-card border-2 border-vermillion-500/80 rounded-2xl p-6 sm:p-10 paper-shadow-lg space-y-8 relative animate-in fade-in slide-in-from-bottom-3 duration-300 motion-reduce:animate-none"
    >
      {/* Accessible Live Region for Screen Readers */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {copyFeedback.message}
      </div>

      {/* Airmail Stripe Top Accent Motif */}
      <div
        className="h-1.5 w-full rounded-t-xl absolute top-0 left-0 right-0"
        style={{
          backgroundImage: `repeating-linear-gradient(135deg, #C83E23 0, #C83E23 15px, #FAF7F2 15px, #FAF7F2 25px, #4A6B53 25px, #4A6B53 40px, #FAF7F2 40px, #FAF7F2 50px)`,
        }}
        aria-hidden="true"
      />

      {/* Header Bar */}
      <div className="pt-2 border-b border-paper-border pb-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-vermillion-100 border border-vermillion-500/30 text-vermillion-500 flex items-center justify-center p-2 shadow-sm">
            <Image
              src="/assets/envelope.svg"
              alt=""
              width={24}
              height={24}
              aria-hidden="true"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-vermillion-100 text-vermillion-600 text-[11px] font-semibold uppercase tracking-wider border border-vermillion-500/20">
                {mode === "generate" ? "Generated Email" : "Improved Draft"}
              </span>
              <span className="text-xs text-ink-500 font-mono">
                [Verified Output]
              </span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-ink-900 mt-1">
              Mail Studio Dispatch
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-sage-100 text-sage-600 text-xs font-semibold uppercase tracking-wider border border-sage-500/20">
            Tone: {result.tone}
          </span>
          <Image
            src="/assets/postage-stamp.svg"
            alt=""
            width={32}
            height={32}
            aria-hidden="true"
            className="hidden sm:block"
          />
        </div>
      </div>

      {/* Subject Line Document Block */}
      <div className="bg-paper-subtle border border-paper-border rounded-xl p-4 sm:p-5 space-y-2">
        <div className="flex items-center justify-between text-xs text-ink-500 uppercase tracking-wider font-semibold">
          <span className="flex items-center gap-1.5">
            <span className="text-vermillion-500 font-bold">Subject</span>
          </span>
          <button
            type="button"
            onClick={() =>
              triggerCopy(result.subject, "subject", "Subject copied")
            }
            aria-label="Copy subject line to clipboard"
            className={`font-semibold cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vermillion-600 rounded px-3 py-1 text-xs transition-all border ${
              copyFeedback.field === "subject" && copyFeedback.status === "success"
                ? "bg-sage-100 text-sage-600 border-sage-500/40"
                : copyFeedback.field === "subject" && copyFeedback.status === "error"
                ? "bg-vermillion-100 text-vermillion-600 border-vermillion-500/40"
                : "bg-paper-card text-ink-700 border-paper-border hover:bg-paper-subtle"
            }`}
          >
            {copyFeedback.field === "subject" && copyFeedback.status === "success" ? (
              <span className="flex items-center gap-1">
                <span aria-hidden="true">✓</span>
                <span>Subject copied</span>
              </span>
            ) : copyFeedback.field === "subject" && copyFeedback.status === "error" ? (
              <span className="flex items-center gap-1">
                <span aria-hidden="true">⚠️</span>
                <span>Failed to copy</span>
              </span>
            ) : (
              "Copy subject"
            )}
          </button>
        </div>
        <p className="font-serif text-base sm:text-lg font-bold text-ink-900 break-words leading-snug">
          {result.subject}
        </p>
      </div>

      {/* Email Body Document Block */}
      <div className="bg-paper-subtle border border-paper-border rounded-xl p-5 sm:p-6 space-y-3 relative postmark-texture">
        <div className="flex items-center justify-between text-xs text-ink-500 uppercase tracking-wider font-semibold border-b border-paper-border pb-3">
          <span className="flex items-center gap-1.5">
            <span className="text-ink-700 font-bold">Message Body</span>
          </span>
          <button
            type="button"
            onClick={() => triggerCopy(result.email, "email", "Email copied")}
            aria-label="Copy email message body to clipboard"
            className={`font-semibold cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vermillion-600 rounded px-3 py-1 text-xs transition-all border ${
              copyFeedback.field === "email" && copyFeedback.status === "success"
                ? "bg-sage-100 text-sage-600 border-sage-500/40"
                : copyFeedback.field === "email" && copyFeedback.status === "error"
                ? "bg-vermillion-100 text-vermillion-600 border-vermillion-500/40"
                : "bg-paper-card text-ink-700 border-paper-border hover:bg-paper-subtle"
            }`}
          >
            {copyFeedback.field === "email" && copyFeedback.status === "success" ? (
              <span className="flex items-center gap-1">
                <span aria-hidden="true">✓</span>
                <span>Email copied</span>
              </span>
            ) : copyFeedback.field === "email" && copyFeedback.status === "error" ? (
              <span className="flex items-center gap-1">
                <span aria-hidden="true">⚠️</span>
                <span>Failed to copy</span>
              </span>
            ) : (
              "Copy email"
            )}
          </button>
        </div>
        <div className="font-sans text-sm sm:text-base text-ink-900 whitespace-pre-wrap break-words leading-relaxed">
          {result.email}
        </div>
      </div>

      {/* Tone & Clarity Scores */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Professionalism Score */}
        <div className="bg-paper-subtle border border-paper-border rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-ink-700">
            <span>Professionalism Rating</span>
            <span className="font-mono text-vermillion-600 font-bold text-sm">
              {result.professionalismScore}/100
            </span>
          </div>
          <div className="w-full bg-paper-border rounded-full h-2 overflow-hidden">
            <div
              className="bg-vermillion-500 h-2 rounded-full transition-all duration-500 motion-reduce:transition-none"
              style={{ width: `${result.professionalismScore}%` }}
            />
          </div>
        </div>

        {/* Clarity Score */}
        <div className="bg-paper-subtle border border-paper-border rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-ink-700">
            <span>Clarity Rating</span>
            <span className="font-mono text-sage-600 font-bold text-sm">
              {result.clarityScore}/100
            </span>
          </div>
          <div className="w-full bg-paper-border rounded-full h-2 overflow-hidden">
            <div
              className="bg-sage-500 h-2 rounded-full transition-all duration-500 motion-reduce:transition-none"
              style={{ width: `${result.clarityScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Suggestions & Improvements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {result.suggestions && result.suggestions.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-ink-900 flex items-center gap-1.5">
              <span className="text-mustard-600" aria-hidden="true">💡</span> Actionable Suggestions
            </h4>
            <ul className="space-y-1.5 text-xs text-ink-700">
              {result.suggestions.map((suggestion, idx) => (
                <li
                  key={idx}
                  className="bg-paper-subtle p-2.5 rounded-lg border border-paper-border flex items-start gap-2"
                >
                  <span className="text-mustard-600 font-bold" aria-hidden="true">•</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {result.improvements && result.improvements.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-serif text-sm font-bold text-ink-900 flex items-center gap-1.5">
              <span className="text-sage-600" aria-hidden="true">✦</span> Improvements Made
            </h4>
            <ul className="space-y-1.5 text-xs text-ink-700">
              {result.improvements.map((improvement, idx) => (
                <li
                  key={idx}
                  className="bg-paper-subtle p-2.5 rounded-lg border border-paper-border flex items-start gap-2"
                >
                  <span className="text-sage-600 font-bold" aria-hidden="true">✓</span>
                  <span>{improvement}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Footer Action Bar */}
      <div className="pt-4 border-t border-paper-border flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={() =>
            triggerCopy(
              `Subject: ${result.subject}\n\n${result.email}`,
              "full",
              "Full email copied"
            )
          }
          aria-label="Copy full email with subject to clipboard"
          className="px-6 py-3 rounded-xl bg-vermillion-500 text-white font-medium text-xs shadow-sm hover:bg-vermillion-600 active:scale-[0.99] transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vermillion-600 cursor-pointer flex items-center gap-2"
        >
          <span>
            {copyFeedback.field === "full" && copyFeedback.status === "success" ? (
              <span className="flex items-center gap-1">
                <span aria-hidden="true">✓</span>
                <span>Full email copied</span>
              </span>
            ) : copyFeedback.field === "full" && copyFeedback.status === "error" ? (
              <span className="flex items-center gap-1">
                <span aria-hidden="true">⚠️</span>
                <span>Failed to copy</span>
              </span>
            ) : (
              "Copy Full Email"
            )}
          </span>
          <Image
            src="/assets/paper-plane.svg"
            alt=""
            width={16}
            height={16}
            aria-hidden="true"
            className="brightness-200"
          />
        </button>

        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="px-4 py-3 rounded-xl bg-paper-subtle border border-paper-border text-ink-700 font-medium text-xs hover:bg-paper-card transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vermillion-600 cursor-pointer"
          >
            Draft Another Email
          </button>
        )}
      </div>
    </article>
  );
}
