"use client";

import { useEffect } from "react";
import Image from "next/image";

/**
 * Next.js App Router Application-level Error Boundary.
 * Catches unexpected React rendering exceptions safely.
 */
export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log unexpected rendering error internally (never expose stack traces in the UI)
    console.error("SmartMail Studio UI Rendering Exception:", error);
  }, [error]);

  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      className="min-h-screen flex items-center justify-center p-4 sm:p-8 bg-paper-bg text-ink-900 font-sans selection:bg-vermillion-500 selection:text-white"
    >
      <div className="max-w-md w-full bg-paper-card border-2 border-vermillion-500/50 rounded-2xl p-6 sm:p-8 paper-shadow-lg text-center space-y-6 relative overflow-hidden">
        {/* Airmail stripe accent motif */}
        <div
          className="h-1.5 w-full rounded-t-xl absolute top-0 left-0 right-0"
          style={{
            backgroundImage: `repeating-linear-gradient(135deg, #C83E23 0, #C83E23 15px, #FAF7F2 15px, #FAF7F2 25px, #4A6B53 25px, #4A6B53 40px, #FAF7F2 40px, #FAF7F2 50px)`,
          }}
          aria-hidden="true"
        />

        {/* Envelope Motif */}
        <div className="w-16 h-16 rounded-2xl bg-vermillion-100 border border-vermillion-500/30 text-vermillion-600 flex items-center justify-center mx-auto p-3 shadow-sm">
          <Image
            src="/assets/envelope.svg"
            alt=""
            width={36}
            height={36}
            aria-hidden="true"
          />
        </div>

        {/* Friendly Explanation */}
        <div className="space-y-2">
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-ink-900">
            Something Went Wrong
          </h1>
          <p className="text-xs sm:text-sm text-ink-700 leading-relaxed font-medium">
            SmartMail Studio encountered an unexpected rendering error. Your session and draft context remain safe.
          </p>
        </div>

        {/* Recovery Action Triggers */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-vermillion-500 text-white font-semibold text-xs shadow-sm hover:bg-vermillion-600 active:scale-[0.99] transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vermillion-600 cursor-pointer"
          >
            Try Again
          </button>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-paper-subtle border border-paper-border text-ink-700 font-medium text-xs hover:bg-paper-card transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vermillion-600 cursor-pointer"
          >
            Reload Page
          </button>
        </div>

        <p className="text-[10px] text-ink-500 uppercase tracking-wider font-mono">
          SmartMail Studio • Error Recovery Guard
        </p>
      </div>
    </div>
  );
}
