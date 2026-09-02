"use client";

import { useState } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import ModeSelector, { AssistantMode } from "@/components/ModeSelector";
import EmailForm, { EmailFormData } from "@/components/EmailForm";
import LoadingState from "@/components/LoadingState";
import EmailResult from "@/components/EmailResult";
import AnalysisPanel from "@/components/AnalysisPanel";
import { SmartMailResponse } from "@/types/email";

export default function Home() {
  const [activeMode, setActiveMode] = useState<AssistantMode>("generate");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [aiResponse, setAiResponse] = useState<SmartMailResponse | null>(null);

  const handleFormSubmit = async (formData: EmailFormData) => {
    setIsSubmitting(true);
    setServerError(null);
    setAiResponse(null);

    const payload =
      formData.mode === "generate"
        ? {
            mode: "generate" as const,
            recipientType: formData.recipientType,
            purpose: formData.purpose,
            tone: formData.tone,
            context: formData.context,
          }
        : {
            mode: "improve" as const,
            existingDraft: formData.existingDraft,
          };

    try {
      const response = await fetch("/api/generate-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        setServerError(
          resData.error ||
            "Our writing assistant is unavailable right now. Please try again in a moment."
        );
        setIsSubmitting(false);
        return;
      }

      setAiResponse(resData.data);
      setIsSubmitting(false);

      // Smooth scroll to output result section
      setTimeout(() => {
        const el = document.getElementById("results-section");
        el?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err: unknown) {
      console.error("Network or fetch exception caught:", err);
      setServerError(
        "We couldn't connect to SmartMail. Check your connection and try again."
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-paper-bg text-ink-900 font-sans selection:bg-vermillion-500 selection:text-white">
      {/* Reusable Header */}
      <Header />

      {/* Main Container */}
      <main className="flex-1 w-full">
        {/* Editorial Hero Section */}
        <HeroSection
          onStartWriting={() => {
            const el = document.getElementById("workspace");
            el?.scrollIntoView({ behavior: "smooth" });
          }}
        />

        {/* Mode Selector & Interactive Workspace */}
        <section
          id="workspace"
          aria-label="Mail Studio Workspace"
          className="max-w-6xl w-full mx-auto px-4 sm:px-8 py-12"
        >
          <div className="bg-paper-card border border-paper-border rounded-2xl p-6 sm:p-10 paper-shadow-lg space-y-8">
            <div className="border-b border-paper-border pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-ink-900">
                  Mail Studio Workspace
                </h2>
                <p className="text-sm text-ink-700 mt-1">
                  Choose an assistant mode to compose or refine your communication.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-paper-subtle border border-paper-border text-xs font-mono text-ink-700">
                  Active Mode:{" "}
                  <strong className="text-vermillion-600 font-semibold">
                    {activeMode === "generate" ? "Generate Email" : "Improve Draft"}
                  </strong>
                </span>
              </div>
            </div>

            {/* ModeSelector Component */}
            <ModeSelector
              activeMode={activeMode}
              onSelectMode={(mode) => {
                setActiveMode(mode);
                setServerError(null);
              }}
            />

            {/* Dynamic Content Panel: Keeps EmailForm mounted so state is never lost */}
            <div
              id={`panel-${activeMode}`}
              role="tabpanel"
              aria-labelledby={`tab-${activeMode}`}
              className="space-y-8"
            >
              {isSubmitting && <LoadingState mode={activeMode} />}

              <div className={isSubmitting ? "hidden" : "block"}>
                <EmailForm
                  mode={activeMode}
                  onSubmit={handleFormSubmit}
                  isSubmitting={isSubmitting}
                  serverError={serverError}
                />
              </div>
            </div>
          </div>
        </section>

        {/* AI Results & Quality Audit Section */}
        {aiResponse && !isSubmitting && (
          <section
            id="results-section"
            aria-label="Email Results and Quality Audit"
            className="max-w-6xl w-full mx-auto px-4 sm:px-8 py-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Primary Email Letter Document (7 cols desktop) */}
              <div className="lg:col-span-7">
                <EmailResult
                  mode={activeMode}
                  result={aiResponse}
                  onReset={() => setAiResponse(null)}
                />
              </div>

              {/* Editorial Quality Audit Report Panel (5 cols desktop) */}
              <div className="lg:col-span-5">
                <AnalysisPanel analysis={aiResponse} />
              </div>
            </div>
          </section>
        )}

        {/* Feature Overview Section */}
        <section
          id="features"
          aria-label="Key Features"
          className="max-w-6xl w-full mx-auto px-4 sm:px-8 py-12 border-t border-paper-border/60"
        >
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ink-900">
              Three Essential Tools in One Studio
            </h2>
            <p className="text-sm sm:text-base text-ink-700">
              Tailored for academics, job applicants, and busy professionals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Generate */}
            <article
              id="compose"
              className="bg-paper-card border border-paper-border rounded-2xl p-6 paper-shadow hover:paper-shadow-lg transition-all duration-200 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-vermillion-100 flex items-center justify-center border border-vermillion-500/20 group-hover:scale-105 transition-transform duration-200 p-2">
                  <Image
                    src="/assets/paper-plane.svg"
                    alt=""
                    width={32}
                    height={32}
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-ink-900 mb-1">
                    1. Compose &amp; Draft
                  </h3>
                  <p className="text-sm text-ink-700 leading-relaxed">
                    Transform raw bullet points into articulate, context-aware emails tailored to your recipient.
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-paper-subtle flex items-center justify-between text-xs text-ink-500 font-medium">
                <span>Smart Generation</span>
                <span className="text-vermillion-500 font-semibold group-hover:translate-x-1 transition-transform duration-200">
                  Ready &rarr;
                </span>
              </div>
            </article>

            {/* Card 2: Refine */}
            <article
              id="refine"
              className="bg-paper-card border border-paper-border rounded-2xl p-6 paper-shadow hover:paper-shadow-lg transition-all duration-200 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-mustard-100 flex items-center justify-center border border-mustard-500/20 group-hover:scale-105 transition-transform duration-200 p-2">
                  <Image
                    src="/assets/handwritten-note.svg"
                    alt=""
                    width={32}
                    height={32}
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-ink-900 mb-1">
                    2. Refine &amp; Elevate
                  </h3>
                  <p className="text-sm text-ink-700 leading-relaxed">
                    Enhance word choice, fix awkward phrasing, and polish existing drafts with instant feedback.
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-paper-subtle flex items-center justify-between text-xs text-ink-500 font-medium">
                <span>Draft Enhancement</span>
                <span className="text-mustard-600 font-semibold group-hover:translate-x-1 transition-transform duration-200">
                  Ready &rarr;
                </span>
              </div>
            </article>

            {/* Card 3: Analyze */}
            <article
              id="analyze"
              className="bg-paper-card border border-paper-border rounded-2xl p-6 paper-shadow hover:paper-shadow-lg transition-all duration-200 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-sage-100 flex items-center justify-center border border-sage-500/20 group-hover:scale-105 transition-transform duration-200 p-2">
                  <Image
                    src="/assets/abstract-paper.svg"
                    alt=""
                    width={32}
                    height={32}
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-ink-900 mb-1">
                    3. Tone &amp; Clarity Audit
                  </h3>
                  <p className="text-sm text-ink-700 leading-relaxed">
                    Evaluate professionalism score, clarity level, and emotional tone before clicking send.
                  </p>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-paper-subtle flex items-center justify-between text-xs text-ink-500 font-medium">
                <span>Tone Analysis</span>
                <span className="text-sage-600 font-semibold group-hover:translate-x-1 transition-transform duration-200">
                  Ready &rarr;
                </span>
              </div>
            </article>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-paper-border py-8 text-center text-xs text-ink-500 bg-paper-bg">
        <div className="max-w-6xl mx-auto px-4 space-y-2">
          <p className="font-serif text-sm font-semibold text-ink-700">
            SmartMail Studio &copy; {new Date().getFullYear()}
          </p>
          <p>
            Editorial Mail-Studio Design System • Preserved Form State &amp; Resilient Error Recovery • Next.js App Router
          </p>
        </div>
      </footer>
    </div>
  );
}
