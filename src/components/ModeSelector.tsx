"use client";

import { KeyboardEvent, useRef } from "react";
import Image from "next/image";

export type AssistantMode = "generate" | "improve";

interface ModeOption {
  id: AssistantMode;
  title: string;
  subtitle: string;
  iconSrc: string;
  badgeText: string;
}

const modeOptions: ModeOption[] = [
  {
    id: "generate",
    title: "Generate Email",
    subtitle: "Draft a new email from key details or bullet points",
    iconSrc: "/assets/paper-plane.svg",
    badgeText: "Mode 01",
  },
  {
    id: "improve",
    title: "Improve Draft",
    subtitle: "Refine tone, clarity, and phrasing of an existing draft",
    iconSrc: "/assets/handwritten-note.svg",
    badgeText: "Mode 02",
  },
];

interface ModeSelectorProps {
  activeMode: AssistantMode;
  onSelectMode: (mode: AssistantMode) => void;
}

export default function ModeSelector({
  activeMode,
  onSelectMode,
}: ModeSelectorProps) {
  const tabRefs = useRef<{ [key in AssistantMode]?: HTMLButtonElement | null }>({});

  const handleKeyDown = (
    e: KeyboardEvent<HTMLButtonElement>,
    currentId: AssistantMode
  ) => {
    const currentIndex = modeOptions.findIndex((opt) => opt.id === currentId);
    let nextIndex = currentIndex;

    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      nextIndex = (currentIndex + 1) % modeOptions.length;
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      nextIndex = (currentIndex - 1 + modeOptions.length) % modeOptions.length;
    } else if (e.key === "Home") {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === "End") {
      e.preventDefault();
      nextIndex = modeOptions.length - 1;
    }

    if (nextIndex !== currentIndex) {
      const nextMode = modeOptions[nextIndex].id;
      onSelectMode(nextMode);
      tabRefs.current[nextMode]?.focus();
    }
  };

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <label
          id="mode-selector-label"
          className="text-xs font-semibold uppercase tracking-wider text-ink-500 font-sans flex items-center gap-1.5"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-vermillion-500" aria-hidden="true" />
          Select Assistant Mode
        </label>
        <span className="text-[11px] text-ink-500 font-mono hidden sm:inline">
          [Mode: {activeMode === "generate" ? "01 — Composition" : "02 — Refinement"}]
        </span>
      </div>

      <div
        role="tablist"
        aria-labelledby="mode-selector-label"
        aria-orientation="horizontal"
        className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-1.5 bg-paper-subtle rounded-2xl border border-paper-border"
      >
        {modeOptions.map((option) => {
          const isSelected = activeMode === option.id;
          return (
            <button
              key={option.id}
              id={`tab-${option.id}`}
              ref={(el) => {
                tabRefs.current[option.id] = el;
              }}
              role="tab"
              type="button"
              aria-selected={isSelected}
              aria-controls={`panel-${option.id}`}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => onSelectMode(option.id)}
              onKeyDown={(e) => handleKeyDown(e, option.id)}
              className={`relative flex items-start gap-3.5 p-4 rounded-xl text-left transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vermillion-600 ${
                isSelected
                  ? "bg-paper-card text-ink-900 border-2 border-vermillion-500 paper-shadow-lg"
                  : "bg-transparent text-ink-700 hover:bg-paper-card/60 border-2 border-transparent"
              }`}
            >
              {/* Icon Container */}
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center p-2 shrink-0 transition-colors ${
                  isSelected
                    ? "bg-vermillion-100 border border-vermillion-500/30"
                    : "bg-paper-card border border-paper-border"
                }`}
              >
                <Image
                  src={option.iconSrc}
                  alt=""
                  width={24}
                  height={24}
                  aria-hidden="true"
                />
              </div>

              {/* Title & Subtitle */}
              <div className="flex-1 min-w-0 pr-6">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-serif font-bold text-base sm:text-lg leading-snug text-ink-900">
                    {option.title}
                  </span>
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${
                      isSelected
                        ? "bg-vermillion-500 text-white border-vermillion-600"
                        : "bg-paper-subtle text-ink-500 border-paper-border"
                    }`}
                  >
                    {option.badgeText}
                  </span>
                </div>
                <p className="text-xs text-ink-500 leading-relaxed truncate">
                  {option.subtitle}
                </p>
              </div>

              {/* Non-Color Dependent Active Checkmark Indicator */}
              <div className="absolute top-4 right-4 flex items-center justify-center">
                {isSelected ? (
                  <span
                    className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-vermillion-500 text-white text-xs font-bold shadow-sm"
                    aria-label="Selected mode"
                  >
                    ✓
                  </span>
                ) : (
                  <span
                    className="inline-block w-4 h-4 rounded-full border border-paper-border-dark bg-paper-card"
                    aria-hidden="true"
                  />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
