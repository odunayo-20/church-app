"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Heart, Users } from "lucide-react";

export function CtaSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="relative overflow-hidden bg-white py-24 sm:py-32 dark:bg-slate-950">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-3xl"
        >
          {/* Background image */}
          <div className="absolute inset-0">
            <Image
              src="/worship.png"
              alt="Worship service"
              fill
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-violet-900/70" />
          </div>

          {/* Decorative orbs */}
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-amber-400/15 blur-[80px]" />
          <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-rose-500/15 blur-[80px]" />

          {/* Content */}
          <div className="relative z-10 px-8 py-20 text-center sm:px-16 sm:py-28">
            {/* Icon */}
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-rose-500 shadow-lg shadow-amber-500/30">
              <Heart className="h-8 w-8 text-white" />
            </div>

            <h2 className="mx-auto max-w-3xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Be a Part of{" "}
              <span className="bg-gradient-to-r from-amber-300 to-rose-400 bg-clip-text text-transparent">
                Something Greater
              </span>
            </h2>

            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/65">
              Whether you&apos;re looking for a church home, want to serve, or
              simply need a community that cares — there&apos;s a place for you here.
            </p>

            {/* Buttons */}
            <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/about"
                id="cta-join-us"
                className="group inline-flex h-14 items-center gap-2.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 px-8 text-base font-semibold text-white shadow-xl shadow-amber-500/25 transition-all duration-300 hover:scale-105 hover:shadow-amber-500/50"
              >
                <Users className="h-5 w-5" />
                Join Our Community
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>

              <Link
                href="/donate"
                id="cta-give"
                className="group inline-flex h-14 items-center gap-2.5 rounded-full border border-white/20 bg-white/10 px-8 text-base font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-white/30 hover:bg-white/20"
              >
                <Heart className="h-5 w-5 text-rose-400" />
                Give Today
              </Link>
            </div>

            {/* Trust badges */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-white/40">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                No membership required
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                All are welcome
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                Sundays 9am &amp; 11am
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
