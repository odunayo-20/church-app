"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { formatDate } from "@/lib/utils";
import { DeleteButton } from "@/components/admin/delete-button";
import { useEvents, useDeleteEvent } from "@/hooks";
import { toast } from "sonner";
import {
  Calendar,
  Plus,
  MapPin,
  Eye,
  Pencil,
  AlertCircle,
} from "lucide-react";

export default function AdminEventsPage() {
  const { data, isLoading, error } = useEvents({ page: 1, limit: 100 });
  const deleteEventMutation = useDeleteEvent();

  const handleDelete = async (id: string) => {
    try {
      await deleteEventMutation.mutateAsync(id);
      toast.success("Event deleted successfully");
    } catch {
      toast.error("Failed to delete event");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500/30 border-t-amber-500" />
          <p className="text-sm font-medium text-muted-foreground">
            Loading events…
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex items-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-6 py-4 text-red-500">
          <AlertCircle className="h-5 w-5" />
          <p className="text-sm font-semibold">
            Error loading events. Please try again.
          </p>
        </div>
      </div>
    );
  }

  const events = data?.data || [];

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Events</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Curating experiences that bring our people together.
          </p>
        </div>
        <Link
          href="/admin/events/new"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-amber-600 px-5 text-sm font-semibold text-white transition-all hover:bg-amber-700 active:scale-95 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          New Event
        </Link>
      </motion.div>

      {/* ── Content ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          {/* Table Header area */}
          <div className="flex items-center justify-between border-b border-border bg-muted/30 px-6 py-4">
            <div className="flex items-center gap-2 text-amber-600">
              <Calendar className="h-5 w-5" />
              <h2 className="font-semibold text-foreground">All Events</h2>
              <span className="ml-2 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-amber-700 border border-amber-500/20">
                {events.length}
              </span>
            </div>
          </div>

          {events.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
                <Calendar className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold">No events yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Get started by scheduling your first event.
              </p>
              <Link
                href="/admin/events/new"
                className="mt-6 inline-flex h-10 items-center gap-2 rounded-xl border border-amber-500/30 px-5 text-sm font-semibold text-amber-500 transition-colors hover:bg-amber-500/10"
              >
                Create your first event
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  <tr>
                    <th className="px-6 py-4 font-bold">Event Details</th>
                    <th className="hidden px-6 py-4 md:table-cell font-bold">
                      Date & Time
                    </th>
                    <th className="hidden px-6 py-4 lg:table-cell font-bold">Location</th>
                    <th className="hidden px-6 py-4 text-center font-bold sm:table-cell">RSVPs</th>
                    <th className="px-6 py-4 text-right font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {events.map((event) => {
                    const isPast = new Date(event.date) < new Date();
                    return (
                      <tr
                        key={event.id}
                        className="group transition-colors hover:bg-muted/30"
                      >
                        <td className="px-6 py-4">
                          <p
                            className={`font-semibold transition-colors group-hover:text-amber-600 ${isPast ? "text-muted-foreground line-through decoration-muted-foreground/40" : "text-foreground"}`}
                          >
                            {event.title}
                          </p>
                          {event.rsvpEnabled && !isPast && (
                            <span className="mt-1.5 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              RSVP Open
                            </span>
                          )}
                        </td>
                        <td className="hidden px-6 py-4 md:table-cell">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span
                              className={
                                isPast
                                  ? "text-muted-foreground/60"
                                  : "text-foreground"
                              }
                            >
                              {formatDate(event.date)}
                            </span>
                          </div>
                          {isPast && (
                            <span className="mt-1 inline-block rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                              Past Event
                            </span>
                          )}
                        </td>
                        <td className="hidden px-6 py-4 lg:table-cell">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4 shrink-0" />
                            <span className="truncate max-w-[200px]">
                              {event.location}
                            </span>
                          </div>
                        </td>
                        <td className="hidden px-6 py-4 text-center sm:table-cell">
                          <Link 
                            href={`/admin/rsvps?eventId=${event.id}`}
                            className="inline-flex flex-col items-center justify-center group/rsvp"
                          >
                            <span
                              className={`text-lg font-bold leading-none transition-colors ${event._count?.rsvps > 0 ? "text-amber-600 group-hover/rsvp:text-amber-700" : "text-muted-foreground group-hover/rsvp:text-foreground"}`}
                            >
                              {event._count?.rsvps || 0}
                            </span>
                            <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground group-hover/rsvp:text-foreground transition-colors">
                              Guests
                            </span>
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/events/${event.id}`}
                              target="_blank"
                              className="inline-flex h-8 items-center justify-center rounded-lg border border-border bg-background px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground hidden md:flex"
                              title="View Live"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Link>
                            <Link
                              href={`/admin/events/${event.id}/edit`}
                              className="inline-flex h-8 items-center justify-center rounded-lg border border-border bg-background px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                              title="Edit"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Link>
                            <div className="hidden sm:flex">
                              <DeleteButton
                                message="Are you sure you want to delete this event?"
                                onDelete={() => handleDelete(event.id)}
                                isLoading={deleteEventMutation.isPending}
                              />
                            </div>
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
      </motion.div>
    </div>
  );
}
