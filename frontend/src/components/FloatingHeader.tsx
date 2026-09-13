"use client";

import Link from "next/link";
import { TrendingUp } from "lucide-react";

export default function FloatingHeader() {
  return (
    <header className="mx-auto w-full max-w-6xl px-4 pt-4 sm:px-6 sm:pt-6">
      <div className="glass flex items-center justify-between gap-2 px-3 py-2 sm:px-5 sm:py-3">
        <Link href="/" className="flex min-w-0 shrink-0 items-center gap-2">
          <div className="bg-brand-gradient grid size-8 shrink-0 place-items-center rounded-lg text-white sm:size-9">
            <TrendingUp size={17} />
          </div>
          <span className="font-display whitespace-nowrap text-sm font-semibold sm:text-base">Expense Flow</span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm text-[oklch(22%_.04_250/0.7)]">
          <a href="#features" className="hover:text-foreground transition-colors">
            Features
          </a>
          <a href="#preview" className="hover:text-foreground transition-colors">
            Preview
          </a>
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/login"
            className="inline-flex min-h-11 items-center justify-center rounded-lg px-2.5 text-xs font-medium hover:bg-white/50 sm:rounded-xl sm:px-4 sm:text-sm"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="bg-brand-gradient inline-flex min-h-11 items-center justify-center rounded-lg px-3 text-xs font-semibold text-white shadow-md sm:rounded-xl sm:px-4 sm:text-sm"
          >
            <span className="sm:hidden">Start</span>
            <span className="hidden sm:inline">Get started</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
