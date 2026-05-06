import Link from "next/link";
import Image from "next/image";
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

  if (variant === "compact") {
    return (
      <Link
        href={`/events/${event.id}`}
        className="flex items-start gap-4 rounded-lg border border-border/40 p-4 transition-colors hover:bg-muted/25"
      >
        <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-md bg-primary/10 text-center">
          <span className="text-xs font-medium uppercase text-primary">
            {month}
          </span>
          <span className="text-xl font-bold">{day}</span>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-medium truncate">{event.title}</h3>
          <p className="text-sm text-muted-foreground">{event.location}</p>
        </div>
        {isPast && (
          <span className="shrink-0 rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
            Past
          </span>
        )}
      </Link>
    );
  }

  return (
    <div className="group overflow-hidden rounded-lg border border-border/40 bg-card shadow-sm transition-all hover:shadow-md">
      {event.imageUrl ? (
        <Link
          href={`/events/${event.id}`}
          className="relative block aspect-video overflow-hidden"
        >
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        </Link>
      ) : (
        <Link
          href={`/events/${event.id}`}
          className="flex aspect-video items-center justify-center bg-primary/5"
        >
          <div className="flex flex-col items-center justify-center rounded-md bg-primary/10 text-center">
            <span className="text-sm font-medium uppercase text-primary">
              {month}
            </span>
            <span className="text-3xl font-bold">{day}</span>
          </div>
        </Link>
      )}

      <div className="p-4">
        <Link href={`/events/${event.id}`}>
          <h3 className="font-medium transition-colors group-hover:text-primary">
            {event.title}
          </h3>
        </Link>

        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
          {event.description}
        </p>

        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="truncate">{event.location}</span>
          </div>

          {isPast && (
            <span className="shrink-0 rounded-full bg-muted px-2 py-1 text-xs">
              Past
            </span>
          )}
        </div>

        {event.rsvpEnabled && (
          <div className="mt-3 flex items-center gap-2">
            <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
              RSVP Open
            </span>
            {event._count?.rsvps !== undefined && (
              <span className="text-xs text-muted-foreground">
                {event._count.rsvps} attending
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
