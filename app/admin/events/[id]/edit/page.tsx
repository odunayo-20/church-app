import { redirect, notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { EventForm } from "@/components/events/event-form";

export const dynamic = "force-dynamic";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await getCurrentUser();
  if (!user || user.role !== "admin") {
    redirect("/auth/login");
  }

  const event = await prisma.event.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      description: true,
      date: true,
      location: true,
      imageUrl: true,
      rsvpEnabled: true,
      rsvpLimit: true,
    },
  });
  if (!event) {
    notFound();
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
          date: event.date.toISOString(),
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
