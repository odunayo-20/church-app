"use client";

import { useState } from "react";
import { useSubmitRsvp } from "@/hooks";
import { User, Mail, Users, CheckCircle2, AlertCircle } from "lucide-react";

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
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const rsvpMutation = useSubmitRsvp(eventId);

  const maxGuests = rsvpLimit ?? 10;
  const remaining = rsvpLimit ? rsvpLimit - currentRsvps : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!name.trim()) { setError("Name is required"); return; }
    if (!email.trim()) { setError("Email is required"); return; }

    try {
      await rsvpMutation.mutateAsync({ name, email, guests });
      setSuccess(true);
      setName("");
      setEmail("");
      setGuests(1);
    } catch (err: any) {
      setError(err.message || "Failed to submit RSVP");
    }
  };

  const inputClass =
    "mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 pl-10 text-sm shadow-sm outline-none transition-all placeholder:text-muted-foreground/60 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20";

  if (success) {
    return (
      <div className="flex flex-col items-center py-4 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-bold text-foreground">RSVP Confirmed!</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Thank you! We look forward to seeing you at the event.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-6 text-sm font-semibold text-amber-500 transition-colors hover:text-amber-600"
        >
          Submit another RSVP
        </button>
      </div>
    );
  }

  if (remaining !== null && remaining <= 0) {
    return (
      <div className="rounded-xl border border-border/40 bg-muted/50 p-6 text-center shadow-inner">
        <p className="font-semibold text-foreground">Event is Full</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Sorry, this event has reached its RSVP limit.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm font-medium text-red-500">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <div>
        <label className="text-sm font-semibold">Full Name</label>
        <div className="relative">
          <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            placeholder="John Doe"
            required
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold">Email Address</label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            placeholder="your@email.com"
            required
          />
        </div>
      </div>

      <div>
        <label className="flex items-center justify-between text-sm font-semibold">
          <span>Number of Guests</span>
          {rsvpLimit && (
            <span className="text-xs font-medium text-amber-500">
              {remaining} spots left
            </span>
          )}
        </label>
        <div className="relative mt-1.5">
          <Users className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="number"
            value={guests}
            onChange={(e) => setGuests(parseInt(e.target.value))}
            className={inputClass}
            min="1"
            max={Math.min(maxGuests, remaining ?? maxGuests)}
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={rsvpMutation.isPending}
        className="mt-2 w-full rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-500/25 transition-all hover:opacity-90 hover:shadow-amber-500/40 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {rsvpMutation.isPending ? "Submitting…" : "RSVP Now"}
      </button>
    </form>
  );
}
