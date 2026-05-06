import { NextRequest } from "next/server";
import { getEvents, createEvent } from "@/services/event-service";
import { eventSchema } from "@/lib/validations";
import { successResponse } from "@/lib/api-response";
import { withAuthValidation, getPaginationParams } from "@/lib/api-handlers";

export async function GET(request: NextRequest) {
  const pagination = getPaginationParams(request);
  const result = await getEvents({ ...pagination });
  return successResponse(result);
}

export const POST = withAuthValidation(
  eventSchema,
  async (_request, _context, validated) => {
    const event = await createEvent(validated);
    return successResponse(event, 201);
  },
  true,
);
