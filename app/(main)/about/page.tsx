"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import {
  Heart,
  Users,
  BookOpen,
  Flame,
  Globe,
  Star,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const fade = (delay = 0): Variants => ({
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
});

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const values = [
  { icon: Flame, title: "Faith", color: "from-amber-500 to-orange-500", description: "We trust in God's power to guide every step, building our lives and decisions on the unshakeable foundation of His Word." },
  { icon: Users, title: "Community", color: "from-rose-500 to-pink-500", description: "We foster genuine, supportive relationships where every person is known, loved, and celebrated as family." },
  { icon: Heart, title: "Service", color: "from-red-500 to-rose-400", description: "We serve others with compassion and generosity, reflecting Christ's love in practical, transformative ways." },
  { icon: Star, title: "Worship", color: "from-yellow-500 to-amber-400", description: "We approach God with passion and reverence, making worship the heartbeat of everything we do." },
  { icon: BookOpen, title: "Growth", color: "from-emerald-500 to-teal-400", description: "We invest in spiritual growth through study, mentorship, and authentic community life." },
  { icon: Globe, title: "Outreach", color: "from-sky-500 to-blue-400", description: "We carry the Gospel beyond our walls, serving our city and partnering with missions around the world." },
];

const leadership = [
  {
    name: "Pastor John Adebayo",
    role: "Senior Pastor",
    initials: "JA",
    bio: "Pastor John has led our congregation for over 15 years with a heart for teaching, discipleship, and community transformation.",
    gradient: "from-amber-500 to-rose-500",
  },
  {
    name: "Pastor Jane Okafor",
    role: "Associate Pastor",
    initials: "JO",
    bio: "Pastor Jane oversees our youth ministry and women's programs, bringing passion, wisdom, and a deep love for people.",
    gradient: "from-rose-500 to-pink-500",
  },
  {
    name: "Elder Michael Eze",
    role: "Church Administrator",
    initials: "ME",
    bio: "Elder Michael manages day-to-day operations, ensuring our community runs with excellence and intentionality.",
    gradient: "from-orange-500 to-amber-400",
  },
];

const milestones = [
  { year: "2004", event: "Grace Community Church founded with 12 families." },
  { year: "2009", event: "Opened our first dedicated worship centre." },
  { year: "2015", event: "Launched our global mission partnerships." },
  { year: "2020", event: "Pioneered online worship during the pandemic, reaching 40+ countries." },
  { year: "2024", event: "20 years of faith, hope, and love. 2,400+ members strong." },
];

const beliefs = [
  "The Bible is the inspired, infallible Word of God",
  "Salvation through grace alone, through faith in Jesus Christ",
  "The Holy Spirit lives and works in every believer",
  "The local church is essential to God's plan for the world",
  "Every person has dignity and is made in God's image",
  "We are called to love God and love our neighbours",
];

export default function AboutPage() {
  return (
    <div className="flex flex-col">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-slate-950 py-28 sm:py-36">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,hsl(38,100%,50%,0.12),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,hsl(355,100%,65%,0.10),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] [background-size:64px_64px]" />

        <div className="container relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div variants={stagger} initial="hidden" animate="visible">
            <motion.span
              variants={fade(0)}
              className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-5 py-1.5 text-xs font-semibold uppercase tracking-widest text-amber-300"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
              Our Story
            </motion.span>

            <motion.h1
              variants={fade(0.1)}
              className="mt-6 text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl"
            >
              Built on{" "}
              <span className="bg-gradient-to-r from-amber-300 via-orange-300 to-rose-400 bg-clip-text text-transparent">
                Faith & Love
              </span>
            </motion.h1>

            <motion.p
              variants={fade(0.2)}
              className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/60 sm:text-xl"
            >
              Since 2004, Grace Community Church has been a sanctuary of belonging — a place where faith is strengthened, families are built, and lives are forever changed.
            </motion.p>

            <motion.div variants={fade(0.3)} className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href="/events"
                id="about-cta-visit"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 px-7 text-sm font-semibold text-white shadow-lg shadow-amber-500/30 transition-all hover:scale-105 hover:shadow-amber-500/50"
              >
                Plan a Visit <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                id="about-cta-contact"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-white/20 bg-white/8 px-7 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/15"
              >
                Contact Us
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Mission & Vision ── */}
      <section className="bg-background py-20 sm:py-28">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            {[
              {
                label: "Our Mission",
                color: "from-amber-500 to-orange-400",
                text: "To lead people into a growing, life-giving relationship with Jesus Christ — building a community where everyone is welcome, everyone belongs, and everyone has the opportunity to grow in faith, purpose, and love.",
              },
              {
                label: "Our Vision",
                color: "from-rose-500 to-pink-400",
                text: "A church that transforms lives from the inside out — strengthening families, renewing communities, and sending believers into the world as agents of hope, justice, and the Gospel.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true }}
                className="relative overflow-hidden rounded-3xl border border-border/40 bg-card p-8 shadow-sm lg:p-10"
              >
                <div className={`mb-4 inline-block rounded-full bg-gradient-to-r ${item.color} px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white`}>
                  {item.label}
                </div>
                <p className="text-lg leading-relaxed text-muted-foreground">{item.text}</p>
                <div className={`absolute -bottom-12 -right-12 h-40 w-40 rounded-full bg-gradient-to-r ${item.color} opacity-5 blur-2xl`} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Core Values ── */}
      <section className="bg-muted/30 py-20 sm:py-28">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            viewport={{ once: true }}
            className="mb-14 text-center"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-amber-500">What We Stand For</p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Our Core Values</h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              These six pillars shape every decision, programme, and relationship within our community.
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true }}
                className="group relative overflow-hidden rounded-2xl border border-border/40 bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${v.color} shadow-lg`}>
                  <v.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.description}</p>
                <div className={`absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-gradient-to-br ${v.color} opacity-0 blur-2xl transition-opacity group-hover:opacity-10`} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What We Believe ── */}
      <section className="bg-background py-20 sm:py-28">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
            >
              <p className="text-xs font-bold uppercase tracking-widest text-amber-500">Our Faith</p>
              <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">What We Believe</h2>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                Our beliefs are rooted in the timeless truths of Scripture. We are a Bible-believing, Christ-centred community, guided by the Holy Spirit in all we do.
              </p>
            </motion.div>

            <motion.ul
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-3"
            >
              {beliefs.map((b, i) => (
                <motion.li
                  key={b}
                  variants={fade(i * 0.06)}
                  className="flex items-start gap-3 rounded-xl border border-border/40 bg-card px-5 py-4"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
                  <span className="text-sm font-medium">{b}</span>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        </div>
      </section>

      {/* ── History Timeline ── */}
      <section className="bg-muted/30 py-20 sm:py-28">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            viewport={{ once: true }}
            className="mb-14 text-center"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-amber-500">Our Journey</p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">20 Years of Grace</h2>
          </motion.div>

          <div className="relative space-y-8 before:absolute before:left-[19px] before:top-2 before:h-full before:w-0.5 before:bg-border/60 sm:before:left-1/2 sm:before:-translate-x-0.5">
            {milestones.map((m, i) => (
              <motion.div
                key={m.year}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className={`relative flex gap-6 sm:items-center ${i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"}`}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-rose-500 text-xs font-bold text-white shadow-lg sm:mx-auto">
                  {m.year.slice(2)}
                </div>
                <div className={`flex-1 rounded-2xl border border-border/40 bg-card p-5 shadow-sm ${i % 2 === 0 ? "sm:mr-[calc(50%+1.5rem)]" : "sm:ml-[calc(50%+1.5rem)]"}`}>
                  <p className="text-xs font-bold uppercase tracking-widest text-amber-500">{m.year}</p>
                  <p className="mt-1 text-sm font-medium">{m.event}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Leadership ── */}
      <section className="bg-background py-20 sm:py-28">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            viewport={{ once: true }}
            className="mb-14 text-center"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-amber-500">The Team</p>
            <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Our Leadership</h2>
          </motion.div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {leadership.map((l, i) => (
              <motion.div
                key={l.name}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true }}
                className="group relative overflow-hidden rounded-3xl border border-border/40 bg-card p-8 shadow-sm text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className={`mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br ${l.gradient} text-2xl font-black text-white shadow-lg`}>
                  {l.initials}
                </div>
                <h3 className="text-xl font-bold">{l.name}</h3>
                <p className={`mt-1 inline-block bg-gradient-to-r ${l.gradient} bg-clip-text text-sm font-semibold text-transparent`}>
                  {l.role}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{l.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="relative overflow-hidden bg-slate-950 py-20 sm:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(38,100%,50%,0.1),transparent_65%)]" />
        <div className="container relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-extrabold text-white sm:text-5xl">
              Come{" "}
              <span className="bg-gradient-to-r from-amber-300 to-rose-400 bg-clip-text text-transparent">
                as You Are
              </span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-white/60">
              There's a seat at the table for you. Join us this Sunday and discover a community that will walk alongside you through every season of life.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/events"
                id="about-bottom-cta"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 px-8 text-sm font-semibold text-white shadow-lg shadow-amber-500/30 transition-all hover:scale-105"
              >
                Join Us This Sunday <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
