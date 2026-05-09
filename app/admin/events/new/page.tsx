import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { EventForm } from "@/components/events/event-form";
import Link from "next/link";
import { ArrowLeft, CalendarPlus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function NewEventPage() {
  const user = await getCurrentUser();
  if (!user || (user.role !== "admin" && user.role !== "media")) {
    redirect("/auth/login");
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="animate-in fade-in slide-in-from-top-4 duration-500">
        <Link
          href="/admin/events"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-amber-500"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Events
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-md">
            <CalendarPlus className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Create New Event
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Schedule a new event for your church community.
            </p>
          </div>
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150 rounded-2xl border border-border/40 bg-card shadow-sm p-6 sm:p-8">
        <EventForm />
      </div>
    </div>
  );
}
