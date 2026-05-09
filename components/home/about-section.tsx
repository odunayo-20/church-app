"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const pillars = [
  "Spirit-led worship every Sunday at 9am & 11am",
  "Life groups for every age and stage of life",
  "Missions and outreach in our local community",
  "Children & youth programs rooted in Biblical truth",
  "Prayer, discipleship, and spiritual mentorship",
];

export function AboutSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-[#0b0f1a] py-24 sm:py-32"
    >
      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Glow orb */}
      <div className="pointer-events-none absolute -left-40 top-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-amber-600/10 blur-[100px]" />

      <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Text column */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Eyebrow */}
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-amber-400">
              Who We Are
            </span>

            <h2 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
              A Community Built on{" "}
              <span className="bg-gradient-to-r from-amber-400 to-rose-400 bg-clip-text text-transparent">
                God&apos;s Word
              </span>
            </h2>

            <p className="mt-6 text-lg leading-relaxed text-white/60">
              We are a vibrant, multi-generational community of believers
              committed to sharing God&apos;s love, building meaningful
              relationships, and making a lasting difference in our city and
              beyond.
            </p>

            {/* Checklist */}
            <ul className="mt-8 space-y-3">
              {pillars.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
                  <span className="text-sm font-medium text-white/70">{item}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Link
              href="/about"
              id="about-cta"
              className="group mt-10 inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/8 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-amber-400/40 hover:bg-amber-400/10 hover:text-amber-300"
            >
              Learn More About Us
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>

          {/* Photo collage column */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            {/* Decorative ring */}
            <div className="absolute -inset-4 rounded-3xl border border-amber-400/10" />

            <div className="grid grid-cols-2 gap-4">
              {/* Large top-left image */}
              <div className="relative col-span-1 row-span-2 overflow-hidden rounded-2xl">
                <Image
                  src="/community.png"
                  alt="Church community gathering"
                  width={400}
                  height={520}
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>

              {/* Top right */}
              <div className="relative overflow-hidden rounded-2xl aspect-square">
                <Image
                  src="/worship.png"
                  alt="Church worship service"
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>

              {/* Bottom right — stat card */}
              <div className="flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-rose-500 p-6 text-center text-white shadow-lg shadow-amber-500/20">
                <div className="text-4xl font-extrabold">20+</div>
                <div className="mt-1 text-sm font-medium opacity-90">Years Serving</div>
                <div className="mt-3 text-xs opacity-70">Our community has been growing together since 2004</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
