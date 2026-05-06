import prisma from "@/lib/prisma";
import { EventCard } from "@/components/events/event-card";
import { PageHeader } from "@/components/ui/page-header";
import { Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  const now = new Date();

  const upcomingEvents = await prisma.event.findMany({
    where: { date: { gte: now } },
    orderBy: { date: "asc" },
    select: {
      id: true,
      title: true,
      description: true,
      date: true,
      location: true,
      imageUrl: true,
      rsvpEnabled: true,
      rsvpLimit: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: { rsvps: true },
      },
    },
  });

  const pastEvents = await prisma.event.findMany({
    where: { date: { lt: now } },
    orderBy: { date: "desc" },
    take: 6,
    select: {
      id: true,
      title: true,
      description: true,
      date: true,
      location: true,
      imageUrl: true,
      rsvpEnabled: true,
      rsvpLimit: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Church Events"
        description="Join us for worship, community gatherings, and special events. There's always a place for you here."
        accent="Community"
      />

      <section className="container mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12 flex items-center gap-4">
          <div className="h-px flex-1 bg-border/40" />
          <h2 className="text-2xl font-bold tracking-tight">Upcoming Events</h2>
          <div className="h-px flex-1 bg-border/40" />
        </div>

        {upcomingEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold">No upcoming events</h3>
            <p className="mt-2 text-muted-foreground">
              We&apos;re planning some exciting things! Check back soon.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((event) => (
              <EventCard
                key={event.id}
                event={{
                  ...event,
                  date: event.date.toISOString(),
                  createdAt: event.createdAt.toISOString(),
                  updatedAt: event.updatedAt.toISOString(),
                }}
              />
            ))}
          </div>
        )}

        {pastEvents.length > 0 && (
          <div className="mt-24">
            <div className="mb-12 flex items-center gap-4">
              <div className="h-px flex-1 bg-border/40" />
              <h2 className="text-2xl font-bold tracking-tight text-muted-foreground">
                Past Events
              </h2>
              <div className="h-px flex-1 bg-border/40" />
            </div>
            <div className="grid gap-8 opacity-70 grayscale-[0.5] sm:grid-cols-2 lg:grid-cols-3">
              {pastEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={{
                    ...event,
                    date: event.date.toISOString(),
                    createdAt: event.createdAt.toISOString(),
                    updatedAt: event.updatedAt.toISOString(),
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
