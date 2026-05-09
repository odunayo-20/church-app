"use client";

import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { DeleteButton } from "@/components/admin/delete-button";
import { useEvents, useDeleteEvent } from "@/hooks";
import { toast } from "sonner";

export default function AdminEventsPage() {
  const { data, isLoading, error } = useEvents({ page: 1, limit: 100 });
  const deleteEventMutation = useDeleteEvent();

  const handleDelete = async (id: string) => {
    try {
      await deleteEventMutation.mutateAsync(id);
      toast.success("Event deleted successfully");
    } catch (error) {
      toast.error("Failed to delete event");
    }
  };

  if (isLoading) {
    return <div className="container mx-auto px-4 py-12 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-12 text-center text-red-500">Error loading events</div>;
  }

  const events = data?.data || [];

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Events</h1>
          <p className="mt-1 text-muted-foreground">Manage your events</p>
        </div>
        <Link
          href="/admin/events/new"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          New Event
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">No events yet.</p>
          <Link
            href="/admin/events/new"
            className="mt-4 inline-block text-sm text-primary hover:underline"
          >
            Create your first event
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border/40">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">Title</th>
                <th className="hidden px-4 py-3 text-left text-sm font-medium md:table-cell">
                  Date
                </th>
                <th className="hidden px-4 py-3 text-left text-sm font-medium lg:table-cell">
                  Location
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">RSVPs</th>
                <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {events.map((event) => {
                const isPast = new Date(event.date) < new Date();
                return (
                  <tr key={event.id} className="hover:bg-muted/25">
                    <td className="px-4 py-3">
                      <p className="font-medium">{event.title}</p>
                      {event.rsvpEnabled && (
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                          RSVP Open
                        </span>
                      )}
                    </td>
                    <td className="hidden px-4 py-3 text-sm md:table-cell">
                      <span className={isPast ? "text-muted-foreground" : ""}>
                        {formatDate(event.date)}
                      </span>
                      {isPast && (
                        <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                          Past
                        </span>
                      )}
                    </td>
                    <td className="hidden px-4 py-3 text-sm text-muted-foreground lg:table-cell">
                      {event.location}
                    </td>
                    <td className="px-4 py-3 text-sm">{event._count?.rsvps || 0}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/events/${event.id}`}
                          className="text-sm text-primary hover:underline"
                          target="_blank"
                        >
                          View
                        </Link>
                        <Link
                          href={`/admin/events/${event.id}/edit`}
                          className="text-sm text-primary hover:underline"
                        >
                          Edit
                        </Link>
                        <DeleteButton 
                          message="Are you sure you want to delete this event?" 
                          onDelete={() => handleDelete(event.id)}
                          isLoading={deleteEventMutation.isPending}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
