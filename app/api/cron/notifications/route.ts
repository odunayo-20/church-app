import { NextRequest } from "next/server";
import { processNotifications } from "@/services/notification-service";
import { successResponse, errorResponse } from "@/lib/api-response";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    logger.error("CRON_SECRET not configured");
    return errorResponse("Server configuration error", 500);
  }

  if (authHeader !== `Bearer ${cronSecret}` && authHeader !== cronSecret) {
    logger.warn("Unauthorized cron job attempt");
    return errorResponse("Unauthorized", 401);
  }

  try {
    const result = await processNotifications();
    return successResponse(result);
  } catch (error) {
    logger.error("Cron job failed", error);
    return errorResponse("Notification processing failed", 500);
  }
}

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return errorResponse("Method not allowed", 405);
  }

  try {
    const result = await processNotifications();
    return successResponse(result);
  } catch {
    return errorResponse("Notification processing failed", 500);
  }
}
