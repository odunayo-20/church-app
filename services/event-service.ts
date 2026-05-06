import prisma from "@/lib/prisma";
import type { EventInput } from "@/lib/validations";
import { paginate, type PaginationParams } from "@/lib/db-service";

export async function getEvents(
  params: PaginationParams & { upcoming?: boolean },
) {
  if (params.upcoming) {
    const now = new Date();
    const events = await prisma.event.findMany({
      where: { date: { gte: now } },
      orderBy: { date: "asc" },
      take: params.limit ?? 10,
      skip: ((params.page ?? 1) - 1) * (params.limit ?? 10),
    });

    const total = await prisma.event.count({
      where: { date: { gte: now } },
    });

    return {
      data: events,
      pagination: {
        page: params.page ?? 1,
        limit: params.limit ?? 10,
        total,
        totalPages: Math.ceil(total / (params.limit ?? 10)),
      },
    };
  }

  return paginate("event", params);
}

export async function getEventById(id: string) {
  return prisma.event.findUnique({
    where: { id },
    include: {
      _count: {
        select: { rsvps: true },
      },
    },
  });
}

export async function createEvent(data: EventInput) {
  return prisma.event.create({
    data: {
      title: data.title,
      description: data.description,
      date: new Date(data.date),
      location: data.location,
      imageUrl: data.imageUrl || null,
      rsvpEnabled: data.rsvpEnabled ?? false,
      rsvpLimit: data.rsvpLimit ?? null,
    },
  });
}

export async function updateEvent(id: string, data: Partial<EventInput>) {
  const updateData: Record<string, unknown> = {};

  if (data.title !== undefined) updateData.title = data.title;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.date !== undefined) updateData.date = new Date(data.date);
  if (data.location !== undefined) updateData.location = data.location;
  if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl || null;
  if (data.rsvpEnabled !== undefined) updateData.rsvpEnabled = data.rsvpEnabled;
  if (data.rsvpLimit !== undefined) updateData.rsvpLimit = data.rsvpLimit;

  return prisma.event.update({
    where: { id },
    data: updateData,
  });
}

export async function deleteEvent(id: string) {
  return prisma.event.delete({
    where: { id },
  });
}
