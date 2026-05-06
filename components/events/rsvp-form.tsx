"use client";

import { useState } from "react";

interface RsvpFormProps {
  eventId: string;
  rsvpLimit?: number | null;
  currentRsvps?: number;
}

export function RsvpForm({
  eventId,
  rsvpLimit,
  currentRsvps = 0,
}: RsvpFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const maxGuests = rsvpLimit ?? 10;
  const remaining = rsvpLimit ? rsvpLimit - currentRsvps : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`/api/events/${eventId}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, guests }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Failed to submit RSVP");
      }

      setSuccess(true);
      setName("");
      setEmail("");
      setGuests(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit RSVP");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center">
        <svg
          className="mx-auto h-12 w-12 text-green-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-green-900">
          RSVP Submitted!
        </h3>
        <p className="mt-1 text-sm text-green-700">
          We look forward to seeing you at the event.
        </p>
      </div>
    );
  }

  if (remaining !== null && remaining <= 0) {
    return (
      <div className="rounded-lg border border-border/40 bg-muted/50 p-6 text-center">
        <p className="text-muted-foreground">
          Sorry, this event has reached its RSVP limit.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          placeholder="Your name"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          placeholder="your@email.com"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">
          Number of Guests
          {rsvpLimit && (
            <span className="ml-2 text-xs text-muted-foreground">
              ({remaining} spots remaining)
            </span>
          )}
        </label>
        <input
          type="number"
          value={guests}
          onChange={(e) => setGuests(parseInt(e.target.value))}
          className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          min="1"
          max={Math.min(maxGuests, remaining ?? maxGuests)}
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Submitting..." : "RSVP Now"}
      </button>
    </form>
  );
}
