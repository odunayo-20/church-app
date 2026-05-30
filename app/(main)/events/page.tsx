import { getEventsAction } from "@/app/action/event-actions";
import { EventsListClient } from "@/components/events/events-list-client";

export const revalidate = 600; // Use ISR to cache this page for 10 minutes

export default async function EventsPage() {
  const [upcomingData, pastData] = await Promise.all([
    getEventsAction({ upcoming: true }),
    getEventsAction({ page: 1, limit: 6 }),
  ]);

  const upcomingEvents = upcomingData.data || [];
  const pastEvents = (pastData.data || []).filter(
    (e: any) => new Date(e.date) < new Date()
  );

  return (
    <EventsListClient
      upcomingEvents={upcomingEvents}
      pastEvents={pastEvents}
    />
  );
}
