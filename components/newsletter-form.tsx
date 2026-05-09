"use client";

import { ArrowRight } from "lucide-react";

export function NewsletterForm() {
  return (
    <form
      id="footer-newsletter-form"
      onSubmit={(e) => e.preventDefault()}
      className="flex w-full max-w-md gap-2"
    >
      <input
        id="footer-newsletter-email"
        type="email"
        placeholder="your@email.com"
        className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-amber-400/50 focus:bg-white/8"
      />
      <button
        id="footer-newsletter-submit"
        type="submit"
        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-500/25 transition-all duration-300 hover:opacity-90 hover:shadow-amber-500/40"
      >
        Subscribe
        <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
}
