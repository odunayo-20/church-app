"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, Send, CheckCircle2, AlertCircle, Sparkles, MessageSquare, Star, Plus } from "lucide-react";
import { useTestimonies, useCreateTestimony } from "@/hooks";
import { formatDate } from "@/lib/utils";
import type { Testimony } from "@/types/models";
import type { PaginatedResult } from "@/lib/db-service";

const fade = (delay = 0) => ({
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
});

export function TestimoniesClient({ initialData }: { initialData: PaginatedResult<Testimony> }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const { data, isLoading, error } = useTestimonies({ status: "approved", page: 1, limit: 50 }, initialData);
  const createMutation = useCreateTestimony();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("loading");

    try {
      await createMutation.mutateAsync({
        name,
        email: email || null,
        title,
        content,
        status: "pending",
        isFeatured: false,
      });
      setFormStatus("success");
      setName("");
      setEmail("");
      setTitle("");
      setContent("");
    } catch (err) {
      console.error(err);
      setFormStatus("error");
    }
  };

  const inputClass =
    "mt-1.5 w-full rounded-xl border border-border/40 bg-card px-4 py-3 text-sm shadow-sm outline-none transition-all placeholder:text-muted-foreground/60 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 text-foreground";

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden bg-slate-950 py-24 sm:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,hsl(38,100%,50%,0.15),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,hsl(14,100%,50%,0.08),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] [background-size:64px_64px]" />

        <div className="container relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div initial="hidden" animate="visible" className="flex flex-col items-center">
            <motion.div
              variants={fade(0)}
              className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-rose-500 shadow-lg shadow-amber-500/30"
            >
              <Quote className="h-8 w-8 text-white" />
            </motion.div>

            <motion.span
              variants={fade(0.05)}
              className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-5 py-1.5 text-xs font-semibold uppercase tracking-widest text-amber-300"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Victory & Praise
            </motion.span>

            <motion.h1
              variants={fade(0.1)}
              className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-6xl"
            >
              Stories of{" "}
              <span className="bg-gradient-to-r from-amber-300 via-amber-200 to-rose-400 bg-clip-text text-transparent">
                God&apos;s Goodness
              </span>
            </motion.h1>

            <motion.p
              variants={fade(0.2)}
              className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/70"
            >
              Celebrate what God is doing in our community. Share your testimony to encourage others and build faith!
            </motion.p>

            <motion.div variants={fade(0.3)} className="mt-8 flex flex-wrap gap-4 justify-center">
              <button
                onClick={() => setShowForm(!showForm)}
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 px-6 text-sm font-semibold text-white shadow-lg shadow-amber-500/25 transition-all hover:opacity-90 hover:scale-[1.02]"
              >
                <Plus className="h-4 w-4" /> Share Your Story
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-3">
          
          {/* ── Testimonies Grid / Main List ── */}
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-amber-500" />
              Approved Testimonies
            </h2>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500/20 border-t-amber-500" />
                <p className="mt-3 text-sm text-muted-foreground">Loading testimonies...</p>
              </div>
            ) : error ? (
              <div className="flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/5 px-6 py-4 text-red-500">
                <AlertCircle className="h-5 w-5" />
                <p className="text-sm font-medium">Failed to load testimonies. Please check back later.</p>
              </div>
            ) : !data?.data || data.data.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-12 text-center">
                <p className="text-muted-foreground">No testimonies have been shared yet.</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="mt-4 text-sm font-bold text-amber-500 hover:text-amber-600"
                >
                  Be the first to share!
                </button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
                {data.data.map((t: Testimony, index: number) => (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative overflow-hidden rounded-2xl border border-border/40 bg-card p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    {t.isFeatured && (
                      <div className="absolute top-4 right-4 flex items-center gap-1 text-xs font-bold text-amber-550 bg-amber-500/10 border border-amber-500/20 rounded-full px-2.5 py-0.5">
                        <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                        Featured
                      </div>
                    )}
                    <div>
                      <Quote className="h-8 w-8 text-amber-500/20 mb-3" />
                      <h3 className="text-lg font-bold text-foreground leading-snug">{t.title}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                        {t.content}
                      </p>
                    </div>
                    <div className="mt-6 border-t border-border/40 pt-4 flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/10 text-xs font-bold text-amber-700">
                        {t.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-foreground">{t.name}</p>
                        <p className="text-[10px] text-muted-foreground">{formatDate(t.createdAt)}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* ── Submission Sidebar / Form ── */}
          <div className="lg:col-span-1">
            <AnimatePresence mode="wait">
              {(showForm || formStatus === "success") && (
                <motion.div
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 24 }}
                  transition={{ duration: 0.4 }}
                  className="sticky top-24 overflow-hidden rounded-3xl border border-border/40 bg-card shadow-xl"
                >
                  <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 to-rose-500" />
                  
                  <div className="p-6 sm:p-8">
                    {formStatus === "success" ? (
                      <div className="flex flex-col items-center py-6 text-center">
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg">
                          <CheckCircle2 className="h-7 w-7 text-white" />
                        </div>
                        <h3 className="text-xl font-bold">Praise Submitted!</h3>
                        <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                          Thank you for sharing your story of victory! Our team will review your testimony, and it will be visible on the board shortly.
                        </p>
                        <button
                          onClick={() => {
                            setFormStatus("idle");
                            setShowForm(false);
                          }}
                          className="mt-6 inline-flex h-10 items-center justify-center rounded-xl border border-border px-5 text-sm font-semibold hover:border-amber-500 hover:text-amber-500 transition-colors"
                        >
                          Close Panel
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="mb-6">
                          <h3 className="text-xl font-bold">Share your testimony</h3>
                          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                            How did God show up for you? Share it to build faith in the community. Note: All testimonies are moderated before publishing.
                          </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                          {formStatus === "error" && (
                            <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-500">
                              <AlertCircle className="h-4 w-4 shrink-0" />
                              An error occurred. Please try again.
                            </div>
                          )}

                          <div>
                            <label htmlFor="testimony-name" className="text-xs font-semibold text-foreground">
                              Name <span className="text-rose-500">*</span>
                            </label>
                            <input
                              id="testimony-name"
                              type="text"
                              required
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              className={inputClass}
                              placeholder="Your name"
                            />
                          </div>

                          <div>
                            <label htmlFor="testimony-email" className="text-xs font-semibold text-foreground">
                              Email <span className="text-muted-foreground font-normal">(optional)</span>
                            </label>
                            <input
                              id="testimony-email"
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className={inputClass}
                              placeholder="your@email.com"
                            />
                          </div>

                          <div>
                            <label htmlFor="testimony-title" className="text-xs font-semibold text-foreground">
                              Title <span className="text-rose-500">*</span>
                            </label>
                            <input
                              id="testimony-title"
                              type="text"
                              required
                              value={title}
                              onChange={(e) => setTitle(e.target.value)}
                              className={inputClass}
                              placeholder="e.g. Healed from illness, Job breakthrough"
                            />
                          </div>

                          <div>
                            <label htmlFor="testimony-content" className="text-xs font-semibold text-foreground">
                              Your Testimony <span className="text-rose-500">*</span>
                            </label>
                            <textarea
                              id="testimony-content"
                              required
                              rows={5}
                              value={content}
                              onChange={(e) => setContent(e.target.value)}
                              className={`${inputClass} resize-none`}
                              placeholder="Describe your story of praise..."
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={formStatus === "loading"}
                            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 px-6 text-sm font-semibold text-white shadow-lg shadow-amber-500/25 transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {formStatus === "loading" ? (
                              <>
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                                Submitting…
                              </>
                            ) : (
                              <>
                                <Send className="h-4 w-4" />
                                Submit Testimony
                              </>
                            )}
                          </button>
                        </form>
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!showForm && formStatus !== "success" && (
              <div className="sticky top-24 rounded-3xl border border-dashed border-border p-8 text-center bg-card/40 backdrop-blur-sm">
                <Quote className="mx-auto h-8 w-8 text-amber-500/25 mb-4 animate-bounce" />
                <h3 className="font-bold text-lg">Have a story of praise?</h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  God is doing amazing things in our lives every day. Take a moment to encourage someone else by telling your story.
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="mt-5 inline-flex h-10 items-center justify-center rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 px-5 text-xs font-bold text-white shadow-md transition-all hover:scale-[1.02]"
                >
                  <Plus className="h-3.5 w-3.5" /> Share Testimony
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
