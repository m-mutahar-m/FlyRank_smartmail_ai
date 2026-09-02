import Image from "next/image";
import { SmartMailResponse } from "@/types/email";

interface AnalysisPanelProps {
  analysis: SmartMailResponse;
}

export default function AnalysisPanel({ analysis }: AnalysisPanelProps) {
  return (
    <aside
      aria-label="AI Read and Quality Audit"
      className="bg-paper-card border border-paper-border rounded-2xl p-6 sm:p-8 paper-shadow-lg space-y-6 relative postmark-texture"
    >
      {/* Audit Header */}
      <div className="border-b border-paper-border pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sage-100 border border-sage-500/30 text-sage-600 flex items-center justify-center p-2 shadow-sm">
            <Image
              src="/assets/abstract-paper.svg"
              alt=""
              width={22}
              height={22}
              aria-hidden="true"
            />
          </div>
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-500 block">
              Editorial Inspection
            </span>
            <h3 className="font-serif text-xl font-bold text-ink-900">
              AI Read &amp; Quality Audit
            </h3>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded bg-sage-100 text-sage-600 text-[11px] font-semibold uppercase tracking-wider border border-sage-500/20">
          Passed
        </span>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Professionalism Score */}
        <div
          className="bg-paper-subtle border border-paper-border rounded-xl p-3.5 space-y-1.5"
          aria-label={`Professionalism score: ${analysis.professionalismScore} out of 100`}
        >
          <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-500 block">
            Professionalism
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-2xl font-bold text-vermillion-600">
              {analysis.professionalismScore}
            </span>
            <span className="text-xs text-ink-500 font-mono">/ 100</span>
          </div>
          <div className="w-full bg-paper-border rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-vermillion-500 h-1.5 rounded-full transition-all duration-500 motion-reduce:transition-none"
              style={{ width: `${analysis.professionalismScore}%` }}
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Clarity Score */}
        <div
          className="bg-paper-subtle border border-paper-border rounded-xl p-3.5 space-y-1.5"
          aria-label={`Clarity score: ${analysis.clarityScore} out of 100`}
        >
          <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-500 block">
            Clarity
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-2xl font-bold text-sage-600">
              {analysis.clarityScore}
            </span>
            <span className="text-xs text-ink-500 font-mono">/ 100</span>
          </div>
          <div className="w-full bg-paper-border rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-sage-500 h-1.5 rounded-full transition-all duration-500 motion-reduce:transition-none"
              style={{ width: `${analysis.clarityScore}%` }}
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Detected Tone */}
        <div className="bg-paper-subtle border border-paper-border rounded-xl p-3.5 space-y-1.5 flex flex-col justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-500 block">
            Detected Tone
          </span>
          <p className="font-serif text-sm font-bold text-ink-900 truncate">
            {analysis.tone}
          </p>
          <span className="text-[10px] text-ink-500 uppercase tracking-wider">
            Calibrated Tone
          </span>
        </div>
      </div>

      {/* Worth Tweaking Section */}
      {analysis.suggestions && analysis.suggestions.length > 0 && (
        <div className="space-y-3 pt-2 border-t border-paper-border">
          <h4 className="font-serif text-base font-bold text-ink-900 flex items-center gap-2">
            <span className="text-mustard-600" aria-hidden="true">💡</span> Worth Tweaking
          </h4>
          <ul className="space-y-2 text-xs text-ink-700">
            {analysis.suggestions.map((suggestion, idx) => (
              <li
                key={idx}
                className="bg-paper-subtle p-3 rounded-xl border border-paper-border flex items-start gap-2.5 leading-relaxed"
              >
                <span className="text-mustard-600 font-bold shrink-0 mt-0.5" aria-hidden="true">
                  •
                </span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* What Changed / Key Highlights Section */}
      {analysis.improvements && analysis.improvements.length > 0 && (
        <div className="space-y-3 pt-2 border-t border-paper-border">
          <h4 className="font-serif text-base font-bold text-ink-900 flex items-center gap-2">
            <span className="text-sage-600" aria-hidden="true">✦</span> What Changed / Key Highlights
          </h4>
          <ul className="space-y-2 text-xs text-ink-700">
            {analysis.improvements.map((improvement, idx) => (
              <li
                key={idx}
                className="bg-paper-subtle p-3 rounded-xl border border-paper-border flex items-start gap-2.5 leading-relaxed"
              >
                <span className="text-sage-600 font-bold shrink-0 mt-0.5" aria-hidden="true">
                  ✓
                </span>
                <span>{improvement}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}
