import Image from "next/image";

interface HeroSectionProps {
  onStartWriting?: () => void;
}

export default function HeroSection({ onStartWriting }: HeroSectionProps) {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative w-full max-w-6xl mx-auto px-4 sm:px-8 py-12 sm:py-20 flex flex-col justify-center"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Headline, Supporting Text, Primary CTA */}
        <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-left">
          {/* Editorial Badge */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-paper-subtle border border-paper-border text-xs font-medium text-ink-700 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-vermillion-500" aria-hidden="true" />
            <span className="font-semibold uppercase tracking-wider text-[11px] text-ink-700">
              SmartMail Studio
            </span>
            <span className="text-paper-border-dark" aria-hidden="true">|</span>
            <span className="text-ink-700">AI Companion for Students &amp; Professionals</span>
          </div>

          {/* Headline */}
          <h1
            id="hero-heading"
            className="text-4xl sm:text-6xl lg:text-7xl font-serif font-normal text-ink-900 leading-[1.12] tracking-tight"
          >
            Write it better.{" "}
            <span className="italic font-normal text-vermillion-500 block sm:inline">
              Send it smarter.
            </span>
          </h1>

          {/* Supporting Text */}
          <p className="text-lg sm:text-xl text-ink-700 leading-relaxed max-w-2xl font-normal">
            Turn rough thoughts into clear, thoughtful emails — or give an existing draft the polish it deserves.
          </p>

          {/* Primary CTA & Secondary Action */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <a
              href="#workspace"
              onClick={onStartWriting}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-vermillion-500 text-white font-medium text-base shadow-sm hover:bg-vermillion-600 active:scale-[0.99] transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vermillion-600 group cursor-pointer"
            >
              <span>Start writing</span>
              <Image
                src="/assets/paper-plane.svg"
                alt=""
                width={20}
                height={20}
                aria-hidden="true"
                className="brightness-200 group-hover:translate-x-1 transition-transform duration-200"
              />
            </a>

            <a
              href="#features"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-paper-card border border-paper-border text-ink-700 font-medium text-base hover:bg-paper-subtle transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vermillion-600"
            >
              Explore features
            </a>
          </div>

          {/* Micro Feature Bullet Details */}
          <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-ink-700 border-t border-paper-border/70">
            <span className="flex items-center gap-1.5">
              <span className="text-vermillion-500 font-bold" aria-hidden="true">✓</span> Rapid Drafting
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-mustard-700 font-bold" aria-hidden="true">✓</span> Draft Polishing
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-sage-600 font-bold" aria-hidden="true">✓</span> Tone Audit
            </span>
          </div>
        </div>

        {/* Right Column: Asymmetric Editorial Card Composition */}
        <div className="lg:col-span-5 relative">
          {/* Layered Accent Background Card */}
          <div
            className="absolute -inset-2 bg-paper-subtle rounded-3xl -rotate-2 border border-paper-border -z-10"
            aria-hidden="true"
          />

          {/* Main Paper Card */}
          <div className="bg-paper-card border border-paper-border rounded-2xl p-6 sm:p-8 paper-shadow-lg space-y-6 relative overflow-hidden rotate-1 hover:rotate-0 transition-transform duration-300">
            {/* Header Stamp Detail */}
            <div className="flex items-center justify-between border-b border-paper-subtle pb-4">
              <div className="flex items-center gap-2.5">
                <Image
                  src="/assets/postage-stamp.svg"
                  alt=""
                  width={38}
                  height={38}
                  aria-hidden="true"
                />
                <div>
                  <span className="text-xs font-serif font-bold text-ink-900 block">
                    Mail Studio Dispatch
                  </span>
                  <span className="text-[11px] text-ink-700 uppercase tracking-wider font-semibold">
                    Postmark #01
                  </span>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded bg-mustard-100 text-mustard-700 text-[11px] font-semibold tracking-wide uppercase border border-mustard-500/30">
                Draft Ready
              </span>
            </div>

            {/* Sample Stationery Note Preview */}
            <div className="bg-paper-subtle/70 border border-paper-border rounded-xl p-4 space-y-3 relative postmark-texture">
              <div className="flex items-center justify-between text-xs text-ink-700 font-mono">
                <span>To: Recipient</span>
                <span>Subj: Follow-up</span>
              </div>
              <p className="text-sm font-serif text-ink-900 italic leading-relaxed">
                &ldquo;Dear Dr. Aris, I am writing to express my appreciation for yesterday&apos;s discussion regarding the research assistant position...&rdquo;
              </p>
              <div className="flex items-center justify-between text-[11px] text-ink-700 pt-1">
                <span className="inline-flex items-center gap-1 text-sage-600 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-sage-500" aria-hidden="true" />
                  Tone: Professional &amp; Courteous
                </span>
                <span className="text-ink-700 font-medium">Clarity: 98%</span>
              </div>
            </div>

            {/* Card Footer Motif */}
            <div className="flex items-center justify-between text-xs text-ink-700 pt-1">
              <div className="flex items-center gap-2">
                <Image
                  src="/assets/envelope.svg"
                  alt=""
                  width={20}
                  height={20}
                  aria-hidden="true"
                />
                <span className="font-medium text-ink-700">SmartMail Assistant Engine</span>
              </div>
              <Image
                src="/assets/abstract-paper.svg"
                alt=""
                width={24}
                height={24}
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
