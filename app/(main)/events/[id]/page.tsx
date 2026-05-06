import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { RsvpForm } from "@/components/events/rsvp-form";

export const dynamic = "force-dynamic";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id },
    include: {
      _count: {
        select: { rsvps: true },
      },
    },
  });

  if (!event) {
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
    <div className="container mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/events"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
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
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Events
      </Link>

      {event.imageUrl && (
        <div className="relative mb-8 aspect-video overflow-hidden rounded-lg">
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{event.title}</h1>

          <div className="mt-4 space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>
                {formattedDate} at {formattedTime}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <svg
                className="h-5 w-5"
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
              <span>{event.location}</span>
            </div>

            {event.rsvpEnabled && (
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span>{event._count.rsvps} attending</span>
              </div>
            )}
          </div>

          <div className="prose prose-sm mt-6 max-w-none">
            <p className="whitespace-pre-wrap text-foreground">
              {event.description}
            </p>
          </div>

          {isPast && (
            <div className="mt-6 rounded-lg border border-border/40 bg-muted/50 p-4 text-center">
              <p className="text-sm text-muted-foreground">
                This event has already passed.
              </p>
            </div>
          )}
        </div>

        {!isPast && event.rsvpEnabled && (
          <aside className="w-full lg:w-80">
            <div className="sticky top-8 rounded-lg border border-border/40 bg-card p-6 shadow-sm">
              <h2 className="text-lg font-semibold">RSVP</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Reserve your spot at this event
              </p>
              <div className="mt-4">
                <RsvpForm
                  eventId={event.id}
                  rsvpLimit={event.rsvpLimit}
                  currentRsvps={event._count.rsvps}
                />
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
