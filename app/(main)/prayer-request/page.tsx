"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Send, CheckCircle2, AlertCircle, HandHeart, ShieldCheck, Users } from "lucide-react";
import { createPrayerRequestAction } from "@/app/action/prayer-actions";

const fade = (delay = 0) => ({
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
});

const promises = [
  { icon: HandHeart, title: "Prayed Over", desc: "Our prayer team personally prays over every request submitted." },
  { icon: ShieldCheck, title: "Confidential", desc: "Your request is kept in strict confidence by our care team." },
  { icon: Users, title: "Community Support", desc: "You are never alone — our community stands with you." },
];

export default function PrayerRequestPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [request, setRequest] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    
    try {
      await createPrayerRequestAction({
        name: anonymous ? null : name,
        email: anonymous ? null : email,
        request,
        isAnonymous: anonymous,
        status: "pending",
      });
      setStatus("success");
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  const inputClass =
    "mt-1.5 w-full rounded-xl border border-border/40 bg-card px-4 py-3 text-sm shadow-sm outline-none transition-all placeholder:text-muted-foreground/60 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20";

  return (
    <div className="flex flex-col">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-slate-950 py-28 sm:py-36">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,hsl(355,100%,65%,0.12),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,hsl(38,100%,50%,0.10),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] [background-size:64px_64px]" />

        <div className="container relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div initial="hidden" animate="visible" className="flex flex-col items-center">
            <motion.div
              variants={fade(0)}
              className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 shadow-lg shadow-rose-500/30"
            >
              <Heart className="h-8 w-8 text-white" />
            </motion.div>

            <motion.span
              variants={fade(0.05)}
              className="inline-flex items-center gap-2 rounded-full border border-rose-400/30 bg-rose-400/10 px-5 py-1.5 text-xs font-semibold uppercase tracking-widest text-rose-300"
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-rose-400" />
              Community Care
            </motion.span>

            <motion.h1
              variants={fade(0.1)}
              className="mt-6 text-5xl font-extrabold tracking-tight text-white sm:text-6xl"
            >
              Submit a{" "}
              <span className="bg-gradient-to-r from-rose-300 via-pink-300 to-amber-400 bg-clip-text text-transparent">
                Prayer Request
              </span>
            </motion.h1>

            <motion.p
              variants={fade(0.2)}
              className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/60"
            >
              We believe in the power of prayer. Share your heart with us and our team will lift you up before God.
            </motion.p>

            <motion.p
              variants={fade(0.28)}
              className="mt-5 text-sm italic text-white/35"
            >
              &ldquo;For where two or three are gathered together in My name, I am there in the midst of them.&rdquo; — Matthew 18:20
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── Promises row ── */}
      <section className="border-b border-border/40 bg-muted/30 py-10">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-3">
            {promises.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.1, duration: 0.5 }}
                className="flex items-start gap-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-400 shadow-md">
                  <p.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-sm">{p.title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{p.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Form ── */}
      <section className="bg-background py-16 sm:py-24">
        <div className="container mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden rounded-3xl border border-border/40 bg-card shadow-xl"
          >
            {/* Top bar */}
            <div className="h-1 w-full bg-gradient-to-r from-rose-500 to-pink-500" />

            <div className="p-8 sm:p-10">
              {status === "success" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center py-8 text-center"
                >
                  <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg">
                    <CheckCircle2 className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold">Request Received</h2>
                  <p className="mt-3 max-w-sm text-muted-foreground">
                    Thank you for trusting us with your prayer request. Our team will begin praying for you right away.
                  </p>
                  <button
                    id="prayer-reset"
                    onClick={() => { setStatus("idle"); setName(""); setEmail(""); setRequest(""); setAnonymous(false); }}
                    className="mt-8 inline-flex h-11 items-center gap-2 rounded-xl border border-border/40 px-6 text-sm font-semibold transition-all hover:border-rose-500/30 hover:text-rose-500"
                  >
                    Submit Another Request
                  </button>
                </motion.div>
              ) : (
                <>
                  <div className="mb-7 text-center">
                    <h2 className="text-2xl font-bold">How can we pray for you?</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Your request will be handled with care and confidentiality.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {status === "error" && (
                      <div className="flex items-center gap-2.5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-500">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        Something went wrong. Please try again.
                      </div>
                    )}

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="prayer-name" className="text-sm font-semibold">
                          Name <span className="text-muted-foreground font-normal">(optional)</span>
                        </label>
                        <input
                          id="prayer-name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className={inputClass}
                          placeholder="Your name"
                          disabled={anonymous}
                        />
                      </div>
                      <div>
                        <label htmlFor="prayer-email" className="text-sm font-semibold">
                          Email <span className="text-muted-foreground font-normal">(optional)</span>
                        </label>
                        <input
                          id="prayer-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className={inputClass}
                          placeholder="your@email.com"
                          disabled={anonymous}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="prayer-request" className="text-sm font-semibold">
                        Your Prayer Request <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        id="prayer-request"
                        required
                        rows={5}
                        value={request}
                        onChange={(e) => setRequest(e.target.value)}
                        className={`${inputClass} resize-none`}
                        placeholder="Tell us what you would like us to pray for…"
                      />
                    </div>

                    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border/40 bg-muted/30 px-4 py-3.5 transition-colors hover:bg-muted/50">
                      <input
                        id="prayer-anonymous"
                        type="checkbox"
                        checked={anonymous}
                        onChange={(e) => {
                          setAnonymous(e.target.checked);
                          if (e.target.checked) { setName(""); setEmail(""); }
                        }}
                        className="h-4 w-4 rounded border-input accent-rose-500"
                      />
                      <span className="text-sm text-muted-foreground">
                        Keep my request anonymous (shared only with the prayer team)
                      </span>
                    </label>

                    <button
                      id="prayer-submit"
                      type="submit"
                      disabled={status === "loading"}
                      className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 px-6 text-sm font-semibold text-white shadow-lg shadow-rose-500/25 transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {status === "loading" ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                          Submitting…
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Submit Prayer Request
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
