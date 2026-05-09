"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import { ArrowRight, CalendarDays, MapPin, Clock } from "lucide-react";

interface EventsSectionProps {
  events: {
    id: string;
    title: string;
    date: string;
    location: string;
    description: string;
    imageUrl?: string | null;
  }[];
}

const PLACEHOLDER_GRADIENT = [
  "from-violet-600 to-indigo-600",
  "from-amber-500 to-rose-500",
  "from-emerald-500 to-teal-500",
];

export function EventsSection({ events }: EventsSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="bg-white py-24 sm:py-32 dark:bg-slate-950">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center"
        >
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-violet-600 dark:border-violet-900/50 dark:bg-violet-900/20 dark:text-violet-400">
              What&apos;s On
            </span>
            <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              Upcoming Events
            </h2>
            <p className="mt-3 text-lg text-slate-500 dark:text-slate-400">
              Stay connected through our upcoming gatherings.
            </p>
          </div>
          <Link
            href="/events"
            id="events-view-all"
            className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:border-violet-300 hover:text-violet-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-violet-700 dark:hover:text-violet-400"
          >
            View All Events
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {/* Cards */}
        {events.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 py-20 text-center text-slate-400 dark:border-slate-800">
            No upcoming events at the moment. Check back soon!
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.slice(0, 3).map((event, index) => {
              const gradient = PLACEHOLDER_GRADIENT[index % PLACEHOLDER_GRADIENT.length];
              const dateObj = new Date(event.date);
              const day = dateObj.getDate();
              const month = dateObj.toLocaleString("default", { month: "short" });

              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 32 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={`/events/${event.id}`}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/70 dark:border-slate-800 dark:bg-slate-900 dark:ring-white/5 dark:hover:shadow-slate-900/70"
                  >
                    {/* Image / Gradient placeholder */}
                    <div className={`relative h-48 overflow-hidden bg-gradient-to-br ${gradient}`}>
                      {event.imageUrl ? (
                        <Image
                          src={event.imageUrl}
                          alt={event.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center opacity-20">
                          <CalendarDays className="h-24 w-24 text-white" />
                        </div>
                      )}
                      {/* Date badge */}
                      <div className="absolute left-4 top-4 flex flex-col items-center rounded-xl bg-white/95 px-3 py-1.5 text-center shadow-md backdrop-blur-sm">
                        <span className="text-xl font-extrabold leading-none text-slate-900">{day}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{month}</span>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="text-lg font-bold text-slate-900 transition-colors group-hover:text-violet-600 dark:text-white dark:group-hover:text-violet-400">
                        {event.title}
                      </h3>

                      <div className="mt-3 space-y-1.5 text-sm text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-2">
                          <Clock className="h-3.5 w-3.5 shrink-0" />
                          <span>{formatDate(event.date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5 shrink-0" />
                          <span className="line-clamp-1">{event.location}</span>
                        </div>
                      </div>

                      <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                        {event.description}
                      </p>

                      <div className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-violet-600 dark:text-violet-400">
                        Learn more
                        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
