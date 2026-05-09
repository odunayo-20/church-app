"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateEvent, useUpdateEvent } from "@/hooks";
import { toast } from "sonner";
import { Calendar as CalendarIcon, MapPin, Type, AlignLeft, Image as ImageIcon, Send, Users, AlertCircle, Loader2 } from "lucide-react";

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
  const createMutation = useCreateEvent();
  const updateMutation = useUpdateEvent();

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
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) { setError("Title is required"); return; }
    if (!description.trim()) { setError("Description is required"); return; }
    if (!date) { setError("Date is required"); return; }
    if (!location.trim()) { setError("Location is required"); return; }

    try {
      const eventData = {
        title,
        description,
        date: new Date(date),
        location,
        imageUrl: imageUrl || undefined,
        rsvpEnabled,
        rsvpLimit: rsvpEnabled && rsvpLimit ? parseInt(rsvpLimit) : null,
      };

      if (isEditing && event) {
        await updateMutation.mutateAsync({ id: event.id, ...eventData });
        toast.success("Event updated successfully");
      } else {
        await createMutation.mutateAsync(eventData);
        toast.success("Event created successfully");
      }

      router.push("/admin/events");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to save event");
      toast.error("Failed to save event");
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;
  const inputClass =
    "mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 pl-10 text-sm shadow-sm outline-none transition-all placeholder:text-muted-foreground/60 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20";
  const textareaClass =
    "mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 pl-10 text-sm shadow-sm outline-none transition-all placeholder:text-muted-foreground/60 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm font-medium text-red-500">
          <AlertCircle className="h-5 w-5 shrink-0" />
          {error}
        </div>
      )}

      {/* Basic Info */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="text-sm font-semibold text-foreground">Event Title</label>
          <div className="relative">
            <Type className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClass}
              placeholder="e.g. Sunday Morning Service"
              required
            />
          </div>
        </div>

        <div className="sm:col-span-2">
          <label className="text-sm font-semibold text-foreground">Description</label>
          <div className="relative">
            <AlignLeft className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={textareaClass}
              placeholder="What is this event about?"
              rows={4}
              required
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-foreground">Date & Time</label>
          <div className="relative">
            <CalendarIcon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={inputClass}
              required
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-foreground">Location</label>
          <div className="relative">
            <MapPin className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={inputClass}
              placeholder="Main Sanctuary or Address"
              required
            />
          </div>
        </div>

        <div className="sm:col-span-2">
          <label className="text-sm font-semibold text-foreground">Image URL (optional)</label>
          <div className="relative">
            <ImageIcon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className={inputClass}
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground ml-1">
            Provide a direct link to an image. Leave blank to use a default layout.
          </p>
        </div>
      </div>

      {/* RSVP Settings */}
      <div className="rounded-2xl border border-border/40 bg-muted/20 p-6 space-y-6">
        <div className="flex items-center gap-2 border-b border-border/40 pb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
            <Users className="h-4 w-4" />
          </div>
          <h3 className="font-semibold text-foreground">RSVP Settings</h3>
        </div>

        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={rsvpEnabled}
            onChange={(e) => setRsvpEnabled(e.target.checked)}
            className="h-5 w-5 rounded border-input accent-emerald-500"
          />
          <div>
            <p className="font-semibold text-foreground">Enable RSVP for this event</p>
            <p className="text-xs text-muted-foreground">Allow members to register and reserve their spots.</p>
          </div>
        </label>

        {rsvpEnabled && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <label className="text-sm font-semibold text-foreground">
              Guest limit per RSVP (optional)
            </label>
            <input
              type="number"
              value={rsvpLimit}
              onChange={(e) => setRsvpLimit(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 text-sm shadow-sm outline-none transition-all placeholder:text-muted-foreground/60 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 sm:max-w-xs"
              placeholder="Leave empty for unlimited"
              min="1"
            />
            <p className="mt-1.5 text-xs text-muted-foreground">
              The maximum number of people a single user can register for (e.g. 5 family members).
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex w-full gap-3 sm:justify-end">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 rounded-xl border border-border/40 bg-background px-6 py-2.5 text-sm font-semibold transition-colors hover:bg-muted/50 sm:flex-none"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="group flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-amber-500/25 transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving…
            </>
          ) : isEditing ? (
            <>
              <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              Update Event
            </>
          ) : (
            <>
              <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              Create Event
            </>
          )}
        </button>
      </div>
    </form>
  );
}
