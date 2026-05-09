import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { EventForm } from "@/components/events/event-form";

export const dynamic = "force-dynamic";

export default async function NewEventPage() {
  const user = await getCurrentUser();
  if (!user || (user.role !== "admin" && user.role !== "media")) {
    redirect("/auth/login");
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">New Event</h1>
        <p className="mt-1 text-muted-foreground">
          Create a new event for your church
        </p>
      </div>

      <EventForm />
    </div>
  );
}
