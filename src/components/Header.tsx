"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: "Studio", href: "#studio" },
  { label: "Compose", href: "#compose" },
  { label: "Refine", href: "#refine" },
  { label: "Analyze", href: "#analyze" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-paper-border bg-paper-bg/95 backdrop-blur-md transition-colors">
      {/* Airmail Stripe Top Accent Motif */}
      <div
        className="h-1.5 w-full"
        style={{
          backgroundImage: `repeating-linear-gradient(135deg, #C83E23 0, #C83E23 15px, #FAF7F2 15px, #FAF7F2 25px, #4A6B53 25px, #4A6B53 40px, #FAF7F2 40px, #FAF7F2 50px)`,
        }}
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
        {/* Logo / Wordmark */}
        <Link
          href="/"
          className="flex items-center gap-3 group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vermillion-600 rounded-xl"
          aria-label="SmartMail AI Studio - Home"
        >
          <div className="h-10 w-10 rounded-xl bg-vermillion-100 flex items-center justify-center border border-vermillion-500/20 shadow-sm p-1.5 group-hover:bg-vermillion-500 transition-colors duration-200">
            <Image
              src="/assets/envelope.svg"
              alt=""
              width={28}
              height={28}
              aria-hidden="true"
              className="group-hover:brightness-200 transition-all duration-200"
            />
          </div>
          <div>
            <span className="font-serif font-bold text-2xl tracking-tight text-ink-900 group-hover:text-vermillion-600 transition-colors">
              SmartMail <span className="text-vermillion-500 font-normal italic">Studio</span>
            </span>
            <p className="text-[11px] text-ink-500 tracking-wider uppercase font-semibold">
              AI Email Companion
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-6 text-sm font-medium text-ink-700">
            {navItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="hover:text-vermillion-600 transition-colors py-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vermillion-600 rounded-md"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="h-4 w-px bg-paper-border-dark" aria-hidden="true" />

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-paper-subtle text-ink-700 border border-paper-border text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-sage-500" aria-hidden="true"></span>
              System Ready
            </span>
          </div>
        </nav>

        {/* Mobile Menu Toggle Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="md:hidden inline-flex items-center justify-center p-2.5 rounded-xl border border-paper-border bg-paper-card text-ink-900 hover:bg-paper-subtle transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vermillion-600 cursor-pointer"
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
          aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            aria-hidden="true"
          >
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile Main Navigation"
          className="md:hidden border-t border-paper-border bg-paper-card px-4 pt-4 pb-6 space-y-4 shadow-lg animate-in slide-in-from-top-2 duration-200"
        >
          <ul className="space-y-2 text-base font-medium text-ink-900">
            {navItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg hover:bg-paper-subtle hover:text-vermillion-600 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vermillion-600"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="pt-3 border-t border-paper-border flex items-center justify-between text-xs text-ink-500">
            <span>Mail System Operational</span>
            <span className="px-2 py-0.5 rounded bg-sage-100 text-sage-600 font-semibold uppercase">
              v0.1.0
            </span>
          </div>
        </nav>
      )}
    </header>
  );
}
