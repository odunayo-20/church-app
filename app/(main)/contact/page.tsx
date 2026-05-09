"use client";

import { ContactForm } from "@/components/contact/contact-form";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";

const fade = (delay = 0) => ({
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] } },
});

const serviceTimes = [
  { day: "Sunday Worship", time: "9:00 AM & 11:30 AM" },
  { day: "Wednesday Bible Study", time: "6:00 PM – 7:30 PM" },
  { day: "Friday Prayer Meeting", time: "6:00 PM – 7:00 PM" },
];

const contactItems = [
  {
    icon: MapPin,
    label: "Address",
    value: "123 Grace Avenue, Central District, Lagos, Nigeria",
    href: "https://maps.google.com",
    gradient: "from-amber-500 to-orange-400",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+234 800 123 4567",
    href: "tel:+2348001234567",
    gradient: "from-rose-500 to-pink-400",
  },
  {
    icon: Mail,
    label: "Email",
    value: "hello@gracecommunity.org",
    href: "mailto:hello@gracecommunity.org",
    gradient: "from-orange-500 to-amber-400",
  },
];

export default function ContactPage() {
  return (
    <div className="flex flex-col">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-slate-950 py-28 sm:py-36">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(38,100%,50%,0.12),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,hsl(355,100%,65%,0.10),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] [background-size:64px_64px]" />

        <div className="container relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div initial="hidden" animate="visible" className="flex flex-col items-center">
            <motion.span
              variants={fade(0)}
              className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-5 py-1.5 text-xs font-semibold uppercase tracking-widest text-amber-300"
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
              Get In Touch
            </motion.span>

            <motion.h1
              variants={fade(0.1)}
              className="mt-6 text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl"
            >
              We&apos;d Love to{" "}
              <span className="bg-gradient-to-r from-amber-300 via-orange-300 to-rose-400 bg-clip-text text-transparent">
                Hear From You
              </span>
            </motion.h1>

            <motion.p
              variants={fade(0.2)}
              className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/60"
            >
              Whether you have a question, a prayer request, or just want to say hello — our doors and inboxes are always open.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── Contact Cards ── */}
      <section className="bg-background py-12 sm:py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-5 sm:grid-cols-3">
            {contactItems.map((item, i) => (
              <motion.a
                key={item.label}
                href={item.href}
                target={item.label === "Address" ? "_blank" : undefined}
                rel={item.label === "Address" ? "noopener noreferrer" : undefined}
                id={`contact-${item.label.toLowerCase()}`}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.1 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="group relative flex flex-col items-center gap-3 overflow-hidden rounded-2xl border border-border/40 bg-card px-6 py-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${item.gradient} shadow-lg`}>
                  <item.icon className="h-6 w-6 text-white" />
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{item.label}</p>
                <p className="text-sm font-semibold">{item.value}</p>
                <div className={`absolute -bottom-10 -right-10 h-28 w-28 rounded-full bg-gradient-to-br ${item.gradient} opacity-0 blur-2xl transition-opacity group-hover:opacity-10`} />
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Form + Info ── */}
      <section className="bg-muted/30 py-16 sm:py-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-3">

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <div className="mb-8">
                <p className="text-xs font-bold uppercase tracking-widest text-amber-500">Drop Us a Line</p>
                <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Send Us a Message</h2>
                <p className="mt-3 text-muted-foreground">
                  Fill out the form and we&apos;ll get back to you within 24 hours.
                </p>
              </div>
              <div className="rounded-3xl border border-border/40 bg-card p-7 shadow-sm sm:p-10">
                <ContactForm />
              </div>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* Map placeholder */}
              <div className="overflow-hidden rounded-2xl border border-border/40 bg-card shadow-sm">
                <div className="flex aspect-video w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-amber-500/5 to-rose-500/5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-rose-500 shadow-lg">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <p className="text-sm font-medium">123 Grace Avenue</p>
                  <p className="text-xs text-muted-foreground">Lagos, Nigeria</p>
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    id="contact-map-link"
                    className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-amber-500 hover:text-amber-400"
                  >
                    Open in Maps <ArrowRight className="h-3 w-3" />
                  </a>
                </div>
              </div>

              {/* Service Times */}
              <div className="rounded-2xl border border-border/40 bg-card p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-400">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-bold">Service Times</h3>
                </div>
                <ul className="space-y-3">
                  {serviceTimes.map((item) => (
                    <li
                      key={item.day}
                      className="flex items-start justify-between gap-3 border-b border-border/40 pb-3 last:border-0 last:pb-0"
                    >
                      <span className="text-sm font-medium">{item.day}</span>
                      <span className="shrink-0 text-right text-sm text-amber-500 font-semibold">{item.time}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Quick links */}
              <div className="rounded-2xl border border-border/40 bg-card p-6 shadow-sm">
                <h3 className="mb-4 font-bold">Plan Your Visit</h3>
                <p className="mb-5 text-sm text-muted-foreground">
                  First time visiting? We&apos;d love to help you feel at home from the moment you arrive.
                </p>
                <Link
                  href="/events"
                  id="contact-sidebar-events"
                  className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 px-5 text-sm font-semibold text-white shadow-md shadow-amber-500/25 transition-all hover:opacity-90"
                >
                  View Upcoming Events <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
