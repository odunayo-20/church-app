"use client";

import { useState } from "react";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  const inputClass =
    "mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm shadow-sm outline-none transition-all placeholder:text-muted-foreground/60 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="text-sm font-semibold">
            Full Name <span className="text-amber-500">*</span>
          </label>
          <input
            id="contact-name"
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={inputClass}
            placeholder="Your full name"
          />
        </div>
        <div>
          <label htmlFor="contact-email" className="text-sm font-semibold">
            Email Address <span className="text-amber-500">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={inputClass}
            placeholder="your@email.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-subject" className="text-sm font-semibold">
          Subject <span className="text-amber-500">*</span>
        </label>
        <input
          id="contact-subject"
          type="text"
          required
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          className={inputClass}
          placeholder="What's this about?"
        />
      </div>

      <div>
        <label htmlFor="contact-message" className="text-sm font-semibold">
          Message <span className="text-amber-500">*</span>
        </label>
        <textarea
          id="contact-message"
          required
          rows={5}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className={`${inputClass} resize-none`}
          placeholder="Share your thoughts, questions, or prayer requests…"
        />
      </div>

      <button
        id="contact-submit"
        type="submit"
        disabled={status === "loading"}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 px-6 text-sm font-semibold text-white shadow-lg shadow-amber-500/25 transition-all hover:opacity-90 hover:shadow-amber-500/40 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {status === "loading" ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            Sending…
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Send Message
          </>
        )}
      </button>

      {status === "success" && (
        <div className="flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          Your message has been sent! We&apos;ll get back to you shortly.
        </div>
      )}

      {status === "error" && (
        <div className="flex items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
          <AlertCircle className="h-5 w-5 shrink-0" />
          Something went wrong. Please try again.
        </div>
      )}
    </form>
  );
}
