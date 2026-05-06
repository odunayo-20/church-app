import { NextRequest } from "next/server";
import {
  getEventById,
  updateEvent,
  deleteEvent,
} from "@/services/event-service";
import { eventUpdateSchema } from "@/lib/validations";
import {
  successResponse,
  errorResponse,
  handleApiError,
} from "@/lib/api-response";
import { withAuth, withValidation } from "@/lib/api-handlers";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const event = await getEventById(id);

    if (!event) {
      return errorResponse("Event not found", 404);
    }

    return successResponse(event);
  } catch (error) {
    return handleApiError(error);
  }
}

export const PATCH = withAuth(
  withValidation(eventUpdateSchema, async (_request, _context, validated) => {
    const { id } = await _context.params;
    const event = await updateEvent(id, validated);
    return successResponse(event);
  }),
  true,
);

export const DELETE = withAuth(async (_request, context) => {
  const { id } = await context.params;
  await deleteEvent(id);
  return successResponse({ message: "Event deleted successfully" });
}, true);
