"use client";

import { useEvent } from "@/hooks";
import { EventForm } from "@/components/events/event-form";
import { useParams, notFound } from "next/navigation";

export default function EditEventPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: event, isLoading, error } = useEvent(id);

  if (isLoading) {
    return <div className="py-12 text-center">Loading event...</div>;
  }

  if (error || !event) {
    return <div className="py-12 text-center text-red-500">Event not found</div>;
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Edit Event</h1>
        <p className="mt-1 text-muted-foreground">Update your event details</p>
      </div>

      <EventForm
        event={{
          id: event.id,
          title: event.title,
          description: event.description,
          date: new Date(event.date).toISOString(),
          location: event.location,
          imageUrl: event.imageUrl,
          rsvpEnabled: event.rsvpEnabled,
          rsvpLimit: event.rsvpLimit,
        }}
        isEditing
      />
    </div>
  );
}
