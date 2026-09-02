interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  details?: Record<string, string>;
}

export default function ErrorMessage({
  message,
  onRetry,
  details,
}: ErrorMessageProps) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      className="p-5 rounded-2xl bg-vermillion-50/90 border border-vermillion-500/30 text-ink-900 shadow-sm space-y-3 font-sans transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div
            className="w-8 h-8 rounded-xl bg-vermillion-100 text-vermillion-600 flex items-center justify-center font-bold text-sm shrink-0 border border-vermillion-500/20"
            aria-hidden="true"
          >
            ⚠️
          </div>
          <div className="space-y-1">
            <h4 className="font-serif text-base font-bold text-ink-900">
              Notice from Mail Studio
            </h4>
            <p className="text-xs text-ink-700 leading-relaxed font-medium">
              {message}
            </p>
          </div>
        </div>

        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="px-3.5 py-1.5 rounded-xl bg-vermillion-500 text-white font-medium text-xs shadow-sm hover:bg-vermillion-600 active:scale-[0.99] transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vermillion-600 shrink-0"
          >
            Try Again
          </button>
        )}
      </div>

      {details && Object.keys(details).length > 0 && (
        <div className="pt-2 border-t border-vermillion-500/20 text-xs space-y-1 text-ink-700 font-mono bg-paper-card/60 p-3 rounded-xl">
          {Object.entries(details).map(([field, err]) => (
            <p key={field}>
              <strong className="text-vermillion-600 uppercase">{field}:</strong> {err}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
