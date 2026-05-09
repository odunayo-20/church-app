"use client";

import { motion } from "framer-motion";
import { EventCard } from "@/components/events/event-card";
import { Calendar, Clock, MapPin } from "lucide-react";
import { useEvents } from "@/hooks";

const fade = (delay = 0) => ({
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
});

export default function EventsPage() {
  const { data: upcomingData, isLoading: isUpcomingLoading } = useEvents({ upcoming: true });
  const { data: pastData, isLoading: isPastLoading } = useEvents({ page: 1, limit: 6 });

  if (isUpcomingLoading || isPastLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500/30 border-t-amber-500" />
          <p className="text-sm font-medium text-muted-foreground">Loading events…</p>
        </div>
      </div>
    );
  }

  const upcomingEvents = upcomingData?.data || [];
  const pastEvents = (pastData?.data || []).filter((e: any) => new Date(e.date) < new Date());

  return (
    <div className="flex flex-col">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-slate-950 py-28 sm:py-36">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,hsl(38,100%,50%,0.12),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,hsl(355,100%,65%,0.10),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] [background-size:64px_64px]" />

        <div className="container relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div initial="hidden" animate="visible" className="flex flex-col items-center">
            <motion.span
              variants={fade(0)}
              className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-5 py-1.5 text-xs font-semibold uppercase tracking-widest text-amber-300"
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
              Community
            </motion.span>

            <motion.h1
              variants={fade(0.1)}
              className="mt-6 text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl"
            >
              Church{" "}
              <span className="bg-gradient-to-r from-amber-300 via-orange-300 to-rose-400 bg-clip-text text-transparent">
                Events
              </span>
            </motion.h1>

            <motion.p
              variants={fade(0.2)}
              className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/60"
            >
              Join us for worship, community gatherings, and special celebrations. There&apos;s always a place for you here.
            </motion.p>

            {/* Quick info pills */}
            <motion.div variants={fade(0.3)} className="mt-8 flex flex-wrap justify-center gap-3">
              {[
                { icon: Clock, text: "Sundays 9 AM & 11:30 AM" },
                { icon: MapPin, text: "123 Grace Avenue, Lagos" },
                { icon: Calendar, text: "50+ events per year" },
              ].map(({ icon: Icon, text }) => (
                <span key={text} className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white/70 backdrop-blur-sm">
                  <Icon className="h-3.5 w-3.5 text-amber-400" />
                  {text}
                </span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Upcoming Events ── */}
      <section className="bg-background py-16 sm:py-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Section label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <p className="text-xs font-bold uppercase tracking-widest text-amber-500">What&apos;s On</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Upcoming Events</h2>
            <div className="mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-amber-500 to-rose-500" />
          </motion.div>

          {upcomingEvents.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-rose-500 shadow-lg">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold">No Upcoming Events</h3>
              <p className="mt-3 max-w-md text-muted-foreground">
                We&apos;re planning some exciting things! Check back soon.
              </p>
            </motion.div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {upcomingEvents.map((event: any, i: number) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  viewport={{ once: true }}
                >
                  <EventCard event={event} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Past Events ── */}
      {pastEvents.length > 0 && (
        <section className="bg-muted/30 py-16 sm:py-24">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Archive</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-muted-foreground sm:text-4xl">Past Events</h2>
              <div className="mt-4 h-1 w-16 rounded-full bg-border" />
            </motion.div>

            <div className="grid gap-8 opacity-70 grayscale-[0.4] sm:grid-cols-2 lg:grid-cols-3">
              {pastEvents.map((event: any, i: number) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                  viewport={{ once: true }}
                >
                  <EventCard event={event} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
