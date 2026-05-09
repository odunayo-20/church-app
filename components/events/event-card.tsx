import Link from "next/link";
import Image from "next/image";
import { MapPin, Clock, Users } from "lucide-react";
import type { Event } from "@/types/models";

interface EventCardProps {
  event: Event;
  variant?: "default" | "compact";
}

export function EventCard({ event, variant = "default" }: EventCardProps) {
  const eventDate = new Date(event.date);
  const isPast = eventDate < new Date();
  const month = eventDate.toLocaleString("default", { month: "short" });
  const day = eventDate.getDate();
  const weekday = eventDate.toLocaleString("default", { weekday: "short" });
  const timeStr = eventDate.toLocaleTimeString("default", { hour: "2-digit", minute: "2-digit" });

  if (variant === "compact") {
    return (
      <Link
        href={`/events/${event.id}`}
        className="flex items-start gap-4 rounded-xl border border-border/40 bg-card p-4 transition-all hover:border-amber-500/30 hover:bg-muted/30"
      >
        <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/15 to-rose-500/10 text-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500">{month}</span>
          <span className="text-xl font-black leading-tight">{day}</span>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold">{event.title}</h3>
          <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{event.location}</span>
          </p>
        </div>
        {isPast && (
          <span className="shrink-0 rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">Past</span>
        )}
      </Link>
    );
  }

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-border/40 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-border/60">
      {/* Thumbnail */}
      <Link href={`/events/${event.id}`} className="relative block aspect-video overflow-hidden">
        {event.imageUrl ? (
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-amber-500/10 to-rose-500/10">
            <div className="flex flex-col items-center justify-center rounded-2xl p-4 text-center">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-500">{month}</span>
              <span className="text-4xl font-black leading-tight">{day}</span>
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{weekday}</span>
            </div>
          </div>
        )}

        {/* Date badge overlay */}
        {event.imageUrl && (
          <div className="absolute left-3 top-3 flex flex-col items-center rounded-xl bg-black/60 px-3 py-2 text-center backdrop-blur-sm">
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400">{month}</span>
            <span className="text-xl font-black text-white leading-tight">{day}</span>
          </div>
        )}

        {isPast && (
          <span className="absolute right-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white/70 backdrop-blur-sm">
            Past
          </span>
        )}
      </Link>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <Link href={`/events/${event.id}`}>
          <h3 className="font-bold leading-snug transition-colors group-hover:text-amber-500">
            {event.title}
          </h3>
        </Link>

        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-2">
          {event.description}
        </p>

        {/* Meta */}
        <div className="mt-4 space-y-1.5 border-t border-border/40 pt-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 shrink-0 text-amber-500" />
            <span>{timeStr} · {weekday}, {month} {day}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-amber-500" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>

        {/* RSVP badge */}
        {event.rsvpEnabled && !isPast && (
          <div className="mt-4 flex items-center justify-between">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
              RSVP Open
            </span>
            {event._count?.rsvps !== undefined && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="h-3.5 w-3.5" />
                {event._count.rsvps} attending
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
