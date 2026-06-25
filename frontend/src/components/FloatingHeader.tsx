"use client";

import Link from "next/link";
import { TrendingUp } from "lucide-react";

export default function FloatingHeader() {
  return (
    <header className="max-w-6xl mx-auto px-6 pt-6 w-full">
      <div className="glass px-5 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="bg-brand-gradient size-9 rounded-lg grid place-items-center text-white">
            <TrendingUp size={18} />
          </div>
          <span className="font-display font-semibold">Expense Flow</span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm text-[oklch(22%_.04_250/0.7)]">
          <a href="#features" className="hover:text-foreground transition-colors">
            Features
          </a>
          <a href="#preview" className="hover:text-foreground transition-colors">
            Preview
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium rounded-xl hover:bg-white/50 transition"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="bg-brand-gradient text-white px-4 py-2 text-sm font-medium rounded-xl shadow-md hover:opacity-90 transition"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}
