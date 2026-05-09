"use client";

import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { RsvpForm } from "@/components/events/rsvp-form";
import { useEvent } from "@/hooks";
import { ArrowLeft, Calendar, Clock, MapPin, Users, Info } from "lucide-react";

export default function EventDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: event, isLoading, error } = useEvent(id);

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500/30 border-t-amber-500" />
          <p className="text-sm font-medium text-muted-foreground">Loading event details…</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    notFound();
  }

  const eventDate = new Date(event.date);
  const isPast = eventDate < new Date();
  const formattedDate = eventDate.toLocaleDateString("default", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = eventDate.toLocaleTimeString("default", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex flex-col">

      {/* ── Event Hero ── */}
      <section className="relative overflow-hidden bg-slate-950 py-20 sm:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(38,100%,50%,0.10),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,hsl(355,100%,65%,0.08),transparent_55%)]" />

        <div className="container relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link
              href="/events"
              id="event-back-link"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-white/50 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Events
            </Link>
          </motion.div>

          <div className="mt-8 grid gap-10 lg:grid-cols-5 lg:items-end">
            <div className="lg:col-span-3">
              {/* Meta row */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex flex-wrap items-center gap-4 text-xs font-semibold uppercase tracking-widest text-white/40"
              >
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-amber-400" />
                  {formattedDate}
                </span>
                {isPast && (
                  <>
                    <span>·</span>
                    <span className="rounded-full bg-white/10 px-2.5 py-0.5 font-bold text-white/70 backdrop-blur-md">
                      Past Event
                    </span>
                  </>
                )}
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl"
              >
                {event.title}
              </motion.h1>
            </div>

            {/* Quick Info Sidebar inside hero */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2 space-y-3 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-medium text-white/40 uppercase tracking-widest">Time</p>
                  <p className="text-sm font-semibold text-white">{formattedTime}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-medium text-white/40 uppercase tracking-widest">Location</p>
                  <p className="text-sm font-semibold text-white">{event.location}</p>
                </div>
              </div>
              {event.rsvpEnabled && (
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-white/40 uppercase tracking-widest">Attending</p>
                    <p className="text-sm font-semibold text-white">{event._count?.rsvps || 0} People</p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Main Content ── */}
      <section className="bg-background py-14 sm:py-20">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          
          {/* Cover Image */}
          {event.imageUrl && (
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.2 }}
              className="relative mb-12 aspect-video w-full overflow-hidden rounded-3xl shadow-xl border border-border/40"
            >
              <Image
                src={event.imageUrl}
                alt={event.title}
                fill
                className="object-cover"
                priority
              />
            </motion.div>
          )}

          <div className="grid gap-12 lg:grid-cols-3">
            {/* Left Col: Description */}
            <div className="lg:col-span-2 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="mb-6 flex items-center gap-2">
                  <Info className="h-5 w-5 text-amber-500" />
                  <h2 className="text-2xl font-bold tracking-tight">About this Event</h2>
                </div>
                
                <div className="prose prose-base sm:prose-lg max-w-none text-muted-foreground prose-a:text-amber-500 hover:prose-a:text-amber-600">
                  <p className="whitespace-pre-wrap">{event.description}</p>
                </div>
              </motion.div>
            </div>

            {/* Right Col: RSVP Form */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="sticky top-24"
              >
                {isPast ? (
                  <div className="overflow-hidden rounded-3xl border border-border/40 bg-card shadow-lg text-center p-8">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <h3 className="font-bold">Event Ended</h3>
                    <p className="mt-2 text-sm text-muted-foreground">This event has already taken place.</p>
                  </div>
                ) : event.rsvpEnabled ? (
                  <div className="overflow-hidden rounded-3xl border border-border/40 bg-card shadow-xl">
                    <div className="h-1 w-full bg-gradient-to-r from-amber-500 to-rose-500" />
                    <div className="p-6 sm:p-8">
                      <h2 className="text-xl font-bold">Reserve Your Spot</h2>
                      <p className="mt-1 text-sm text-muted-foreground mb-6">
                        Please fill out the form below to RSVP.
                      </p>
                      <RsvpForm
                        eventId={event.id}
                        rsvpLimit={event.rsvpLimit}
                        currentRsvps={event._count?.rsvps || 0}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-3xl border border-border/40 bg-card shadow-lg text-center p-8">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/20 to-rose-500/20">
                      <Users className="h-5 w-5 text-amber-500" />
                    </div>
                    <h3 className="font-bold">No RSVP Required</h3>
                    <p className="mt-2 text-sm text-muted-foreground">Just show up! All are welcome.</p>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
