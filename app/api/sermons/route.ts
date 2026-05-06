import { NextRequest } from "next/server";
import { getSermons } from "@/services/sermon-service";
import { successResponse } from "@/lib/api-response";
import { getPaginationParams } from "@/lib/api-handlers";

export async function GET(request: NextRequest) {
  const pagination = getPaginationParams(request);
  const { searchParams } = new URL(request.url);
  const series = searchParams.get("series") ?? undefined;
  const speaker = searchParams.get("speaker") ?? undefined;

  const result = await getSermons({
    ...pagination,
    search: pagination.search,
    series,
    speaker,
  });

  return successResponse(result);
}
