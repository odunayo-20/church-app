import { NextRequest, NextResponse } from "next/server";
import { ZodSchema } from "zod";
import { handleApiError, errorResponse } from "@/lib/api-response";
import { getCurrentUser, type AuthUser } from "@/lib/auth";
import { config } from "@/lib/config";

export type ApiHandler = (
  request: NextRequest,
  context: { params: Promise<Record<string, string>> },
) => Promise<NextResponse>;

export type AuthenticatedHandler = (
  request: NextRequest,
  context: { params: Promise<Record<string, string>>; user: AuthUser },
) => Promise<NextResponse>;

export type ValidatedHandler<T> = (
  request: NextRequest,
  context: { params: Promise<Record<string, string>>; user: AuthUser },
  validated: T,
) => Promise<NextResponse>;

export async function requireAuth(
  request: NextRequest,
  requireAdmin = false,
): Promise<AuthUser | null> {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  if (requireAdmin && user.role !== "admin") {
    return null;
  }

  return user;
}

export function getPaginationParams(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  return {
    page: Math.max(1, parseInt(searchParams.get("page") ?? "1")),
    limit: Math.min(
      config.api.maxPageSize,
      Math.max(
        1,
        parseInt(
          searchParams.get("limit") ?? String(config.api.defaultPageSize),
        ),
      ),
    ),
    search: searchParams.get("search") ?? undefined,
  };
}

export function withAuth(
  handler: AuthenticatedHandler,
  requireAdmin = false,
): ApiHandler {
  return async (request, context) => {
    const user = await requireAuth(request, requireAdmin);
    if (!user) {
      return errorResponse(
        requireAdmin ? "Admin access required" : "Unauthorized",
        401,
      );
    }
    return handler(request, { ...context, user });
  };
}

export function withValidation<T>(
  schema: ZodSchema<T>,
  handler: (
    request: NextRequest,
    context: { params: Promise<Record<string, string>> },
    validated: T,
  ) => Promise<NextResponse>,
): ApiHandler {
  return async (request, context) => {
    try {
      const body = await request.json();
      const validated = schema.parse(body);
      return handler(request, context, validated);
    } catch (error) {
      return handleApiError(error);
    }
  };
}

export function withAuthValidation<T>(
  schema: ZodSchema<T>,
  handler: ValidatedHandler<T>,
  requireAdmin = false,
): ApiHandler {
  return async (request, context) => {
    const user = await requireAuth(request, requireAdmin);
    if (!user) {
      return errorResponse(
        requireAdmin ? "Admin access required" : "Unauthorized",
        401,
      );
    }

    try {
      const body = await request.json();
      const validated = schema.parse(body);
      return handler(request, { ...context, user }, validated);
    } catch (error) {
      return handleApiError(error);
    }
  };
}
