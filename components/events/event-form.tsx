"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface EventFormProps {
  event?: {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    imageUrl: string | null;
    rsvpEnabled: boolean;
    rsvpLimit: number | null;
  };
  isEditing?: boolean;
}

export function EventForm({ event, isEditing = false }: EventFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(event?.title ?? "");
  const [description, setDescription] = useState(event?.description ?? "");
  const [date, setDate] = useState(
    event?.date ? new Date(event.date).toISOString().slice(0, 16) : "",
  );
  const [location, setLocation] = useState(event?.location ?? "");
  const [imageUrl, setImageUrl] = useState(event?.imageUrl ?? "");
  const [rsvpEnabled, setRsvpEnabled] = useState(event?.rsvpEnabled ?? false);
  const [rsvpLimit, setRsvpLimit] = useState(
    event?.rsvpLimit?.toString() ?? "",
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    if (!description.trim()) {
      setError("Description is required");
      return;
    }
    if (!date) {
      setError("Date is required");
      return;
    }
    if (!location.trim()) {
      setError("Location is required");
      return;
    }

    setLoading(true);

    try {
      const url = isEditing ? `/api/events/${event!.id}` : "/api/events";
      const method = isEditing ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          date: new Date(date).toISOString(),
          location,
          imageUrl: imageUrl || null,
          rsvpEnabled,
          rsvpLimit: rsvpEnabled && rsvpLimit ? parseInt(rsvpLimit) : null,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Failed to save event");
      }

      router.push("/admin/events");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            placeholder="Event title"
            required
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            placeholder="Event description"
            rows={4}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Date & Time</label>
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            placeholder="Event location"
            required
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium">
            Image URL (optional)
          </label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            placeholder="https://example.com/image.jpg"
          />
        </div>
      </div>

      <div className="rounded-lg border border-border/40 p-4 space-y-4">
        <h3 className="text-sm font-medium">RSVP Settings</h3>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={rsvpEnabled}
            onChange={(e) => setRsvpEnabled(e.target.checked)}
            className="h-4 w-4 rounded border-input"
          />
          <span className="text-sm font-medium">
            Enable RSVP for this event
          </span>
        </label>

        {rsvpEnabled && (
          <div>
            <label className="block text-sm font-medium">
              Guest limit per RSVP (optional)
            </label>
            <input
              type="number"
              value={rsvpLimit}
              onChange={(e) => setRsvpLimit(e.target.value)}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Leave empty for unlimited"
              min="1"
            />
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Saving..." : isEditing ? "Update event" : "Create event"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
