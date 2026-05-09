"use client";

import { motion } from "framer-motion";
import { DonationForm } from "@/components/donations/donation-form";
import {
  Heart, Users, Globe, Sparkles, ShieldCheck, ArrowRight, HandCoins,
} from "lucide-react";
import Link from "next/link";

const fade = (delay = 0) => ({
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] } },
});

const benefits = [
  { icon: Heart, gradient: "from-rose-500 to-pink-400", title: "Community Outreach", desc: "Feeding programmes and local community support initiatives that transform lives every week." },
  { icon: Sparkles, gradient: "from-amber-500 to-orange-400", title: "Youth & Kids Ministry", desc: "Developing the next generation through faith-based education and mentorship." },
  { icon: Globe, gradient: "from-sky-500 to-blue-400", title: "Global Missions", desc: "Supporting outreach partners across 10+ countries spreading the Gospel worldwide." },
  { icon: Users, gradient: "from-emerald-500 to-teal-400", title: "Church Growth", desc: "Enhancing our worship experience, facilities, and pastoral care for our growing family." },
];

const stats = [
  { value: "₦12M+", label: "Given This Year" },
  { value: "400+", label: "Families Supported" },
  { value: "10+", label: "Mission Partners" },
  { value: "100%", label: "Transparent Giving" },
];

export default function DonatePage() {
  return (
    <div className="flex flex-col">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-slate-950 py-28 sm:py-36">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,hsl(142,72%,45%,0.10),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,hsl(38,100%,50%,0.10),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] [background-size:64px_64px]" />

        <div className="container relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div initial="hidden" animate="visible" className="flex flex-col items-center">
            <motion.span
              variants={fade(0)}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-5 py-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-300"
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              Giving
            </motion.span>

            <motion.h1
              variants={fade(0.1)}
              className="mt-6 text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl"
            >
              Support Our{" "}
              <span className="bg-gradient-to-r from-emerald-300 via-teal-300 to-amber-400 bg-clip-text text-transparent">
                Mission
              </span>
            </motion.h1>

            <motion.p
              variants={fade(0.2)}
              className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/60"
            >
              Your generosity enables us to serve our community, support those in need, and carry the message of hope further than ever before.
            </motion.p>

            <motion.p
              variants={fade(0.28)}
              className="mt-5 text-sm italic text-white/30"
            >
              &ldquo;Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver.&rdquo; — 2 Corinthians 9:7
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section className="border-b border-border/40 bg-muted/30 py-10">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
                className="text-center"
              >
                <p className="text-2xl font-black text-emerald-500 sm:text-3xl">{s.value}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main Section ── */}
      <section className="bg-background py-16 sm:py-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-2 lg:items-start">
            {/* Left: Why give */}
            <div className="space-y-10">
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true }}
              >
                <p className="text-xs font-bold uppercase tracking-widest text-emerald-500">Your Impact</p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Why Your Giving Matters</h2>
                <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                  When you give to Grace Community, you&apos;re not just supporting a building — you&apos;re investing in lives transformed by the power of God.
                </p>
              </motion.div>

              <div className="grid gap-6 sm:grid-cols-2">
                {benefits.map((b, i) => (
                  <motion.div
                    key={b.title}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] }}
                    viewport={{ once: true }}
                    className="group flex gap-4"
                  >
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${b.gradient} shadow-md transition-transform duration-300 group-hover:scale-110`}>
                      <b.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold">{b.title}</h4>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{b.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Security trust card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="flex items-start gap-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400 shadow-md">
                  <ShieldCheck className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-emerald-600 dark:text-emerald-400">Secure &amp; Transparent</h4>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    All donations are processed securely via Paystack. We provide annual contribution statements for your records.
                  </p>
                </div>
              </motion.div>

              {/* Other ways to give */}
              <div className="rounded-2xl border border-border/40 bg-card p-5">
                <h4 className="mb-3 font-bold">Other Ways to Give</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p><span className="font-semibold text-foreground">Bank Transfer:</span> Grace Community Church — GTBank 0123456789</p>
                  <p><span className="font-semibold text-foreground">In Person:</span> Offering envelopes available at all services</p>
                </div>
                <Link
                  href="/contact"
                  id="donate-contact-link"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-500 transition-colors hover:text-emerald-400"
                >
                  Questions? Contact us <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Right: Donation form */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
              className="lg:sticky lg:top-24"
            >
              <div className="overflow-hidden rounded-3xl border border-border/40 bg-card shadow-xl">
                <div className="h-1 w-full bg-gradient-to-r from-emerald-500 to-teal-400" />
                <div className="p-7 sm:p-9">
                  <div className="mb-7 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400 shadow-md">
                      <HandCoins className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Make a Donation</h2>
                      <p className="text-sm text-muted-foreground">Choose amount or enter custom</p>
                    </div>
                  </div>
                  <DonationForm />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
