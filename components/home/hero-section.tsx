"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, PlayCircle, Users, Heart, BookOpen, Calendar } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.18, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

const stats = [
  { icon: Users, value: "2,400+", label: "Church Members" },
  { icon: Calendar, value: "50+", label: "Events Per Year" },
  { icon: BookOpen, value: "500+", label: "Sermons Archived" },
  { icon: Heart, value: "20+", label: "Years of Service" },
];

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-bg.png"
          alt="Church community background"
          fill
          className="object-cover object-center"
          priority
          quality={90}
        />
        {/* Layered dark overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/20" />
      </div>

      {/* Animated radial glow accent */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 h-[600px] w-[600px] rounded-full bg-amber-500/10 blur-[120px]" />

      {/* Main content */}
      <div className="relative z-10 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <motion.div
          className="mx-auto max-w-4xl text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Eyebrow */}
          <motion.div variants={itemVariants}>
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-5 py-1.5 text-sm font-semibold uppercase tracking-widest text-amber-300 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
              Welcome to Grace Community
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="mt-8 text-5xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-6xl lg:text-7xl xl:text-8xl"
          >
            A Place of{" "}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-amber-300 via-orange-300 to-rose-400 bg-clip-text text-transparent">
                Faith, Hope
              </span>
              <span className="absolute -bottom-2 left-0 right-0 h-px bg-gradient-to-r from-amber-300/0 via-amber-400/60 to-amber-300/0" />
            </span>
            {" "}& Love
          </motion.h1>

          {/* Subheading */}
          <motion.p
            variants={itemVariants}
            className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-white/70 sm:text-xl"
          >
            Join us every Sunday as we worship together, grow in faith, and
            build a community that transforms lives and serves our city.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={itemVariants}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link
              href="/events"
              id="hero-cta-primary"
              className="group inline-flex h-14 items-center gap-2.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 px-8 text-base font-semibold text-white shadow-lg shadow-amber-500/30 transition-all duration-300 hover:scale-105 hover:shadow-amber-500/50 hover:shadow-xl"
            >
              Join Us This Sunday
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <Link
              href="/sermons"
              id="hero-cta-secondary"
              className="group inline-flex h-14 items-center gap-2.5 rounded-full border border-white/25 bg-white/10 px-8 text-base font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white/20 hover:border-white/40"
            >
              <PlayCircle className="h-5 w-5 text-amber-300" />
              Watch Sermons
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Stats Strip */}
      <motion.div
        className="relative z-10 w-full mt-auto"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="border-t border-white/10 bg-black/50 backdrop-blur-md">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 divide-x divide-white/10 lg:grid-cols-4">
              {stats.map(({ icon: Icon, value, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-1.5 px-4 py-6 text-center sm:flex-row sm:gap-4 sm:text-left"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-400/15 text-amber-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{value}</div>
                    <div className="text-xs font-medium text-white/50">{label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}