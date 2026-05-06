"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";

interface EventsSectionProps {
  events: {
    id: string;
    title: string;
    date: string;
    location: string;
    description: string;
  }[];
}

export function EventsSection({ events }: EventsSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-20 sm:py-28 bg-muted/30">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end"
        >
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Upcoming Events
            </h2>
            <p className="mt-2 text-lg text-muted-foreground">
              Stay connected with our church community through upcoming
              gatherings.
            </p>
          </div>
          <Button asChild variant="outline" href="/events">
            <span className="flex items-center gap-2">
              View All Events
              <ArrowRight className="h-4 w-4" />
            </span>
          </Button>
        </motion.div>

        {events.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            No upcoming events at the moment.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.slice(0, 3).map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  href={`/events/${event.id}`}
                  className="group flex h-full flex-col overflow-hidden rounded-xl border border-border/40 bg-card shadow-sm transition-all hover:border-primary/20 hover:shadow-md"
                >
                  <div className="flex flex-1 flex-col p-6">
                    <div className="mb-4 flex items-center gap-3 text-sm text-muted-foreground">
                      <CalendarDays className="h-4 w-4" />
                      <span>{formatDate(event.date)}</span>
                    </div>

                    <h3 className="text-lg font-semibold group-hover:text-primary">
                      {event.title}
                    </h3>

                    <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>

                    <p className="mt-4 line-clamp-2 text-sm text-muted-foreground">
                      {event.description}
                    </p>
                  </div>

                  <div className="border-t border-border/40 px-6 py-4">
                    <span className="text-sm font-medium text-primary group-hover:underline">
                      Learn more
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
