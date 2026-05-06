import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { rsvpSchema } from "@/lib/validations";
import {
  successResponse,
  errorResponse,
  handleApiError,
} from "@/lib/api-response";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        _count: {
          select: { rsvps: true },
        },
      },
    });

    if (!event) {
      return errorResponse("Event not found", 404);
    }

    if (!event.rsvpEnabled) {
      return errorResponse("RSVP is not enabled for this event", 400);
    }

    if (new Date(event.date) < new Date()) {
      return errorResponse("This event has already passed", 400);
    }

    if (event.rsvpLimit) {
      const totalGuests = await prisma.rsvp.aggregate({
        where: { eventId: id },
        _sum: { guests: true },
      });

      if ((totalGuests._sum.guests ?? 0) >= event.rsvpLimit) {
        return errorResponse("This event has reached its RSVP limit", 400);
      }
    }

    const body = await request.json();
    const validated = rsvpSchema.parse(body);

    const existingRsvp = await prisma.rsvp.findUnique({
      where: {
        eventId_email: {
          eventId: id,
          email: validated.email,
        },
      },
    });

    if (existingRsvp) {
      return errorResponse("You have already RSVPed to this event", 409);
    }

    const rsvp = await prisma.rsvp.create({
      data: {
        eventId: id,
        name: validated.name,
        email: validated.email,
        guests: validated.guests,
      },
    });

    return successResponse(rsvp, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
