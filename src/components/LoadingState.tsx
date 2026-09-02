import Image from "next/image";
import { AssistantMode } from "@/components/ModeSelector";

interface LoadingStateProps {
  mode?: AssistantMode;
  message?: string;
}

export default function LoadingState({
  mode = "generate",
  message,
}: LoadingStateProps) {
  const defaultMessage =
    mode === "generate"
      ? "Crafting your email with care & precision..."
      : "Polishing your draft for clarity & tone...";

  const displayMessage = message || defaultMessage;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="bg-paper-card border border-paper-border rounded-2xl p-8 sm:p-12 paper-shadow-lg text-center space-y-6 relative overflow-hidden"
    >
      {/* Background Postmark Texture Surface */}
      <div className="postal-stamp-border rounded-xl p-8 sm:p-10 bg-paper-subtle/50 postmark-texture space-y-5">
        {/* Floating Paper Plane Motif */}
        <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-vermillion-100 border border-vermillion-500/30 text-vermillion-500 shadow-sm mx-auto p-3">
          <div className="animate-paper-float motion-reduce:animate-none">
            <Image
              src="/assets/paper-plane.svg"
              alt=""
              width={40}
              height={40}
              aria-hidden="true"
            />
          </div>
          {/* Subtle pulse ring */}
          <span
            className="absolute -inset-1 rounded-2xl border border-vermillion-500/20 animate-ping motion-reduce:animate-none -z-10"
            aria-hidden="true"
          />
        </div>

        {/* Loading Announcement & Subtitle */}
        <div className="space-y-2 max-w-md mx-auto">
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-ink-900 leading-snug">
            {displayMessage}
          </h3>
          <p className="text-xs text-ink-500 leading-relaxed font-sans">
            SmartMail AI is processing your request using server-side intelligence to ensure appropriate tone, structure, and clarity.
          </p>
        </div>

        {/* Tactile Progress Indicator Dots */}
        <div
          className="flex items-center justify-center gap-1.5 pt-2"
          aria-hidden="true"
        >
          <span className="w-2 h-2 rounded-full bg-vermillion-500 animate-pulse motion-reduce:animate-none" />
          <span className="w-2 h-2 rounded-full bg-mustard-500 animate-pulse [animation-delay:200ms] motion-reduce:animate-none" />
          <span className="w-2 h-2 rounded-full bg-sage-500 animate-pulse [animation-delay:400ms] motion-reduce:animate-none" />
        </div>
      </div>
    </div>
  );
}
