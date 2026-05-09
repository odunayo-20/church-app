import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { logger } from "@/lib/logger";

export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
    },
    { status },
  );
}

export function errorResponse(
  message: string,
  status = 400,
  errors?: Record<string, unknown>[],
) {
  return NextResponse.json(
    {
      success: false,
      message,
      ...(errors && { errors }),
    },
    { status },
  );
}

function extractZodIssues(error: ZodError) {
  if ("issues" in error && Array.isArray(error.issues)) {
    return (error.issues as unknown[]).map((err: unknown) => {
      const e = err as { path?: unknown[]; message?: string };
      return {
        field: (e.path ?? []).map((p) => String(p)).join("."),
        message: e.message ?? "Validation error",
      };
    });
  }
  if ("errors" in error && Array.isArray(error.errors)) {
    return (error.errors as unknown[]).map((err: unknown) => {
      const e = err as { path?: unknown[]; message?: string };
      return {
        field: (e.path ?? []).map((p) => String(p)).join("."),
        message: e.message ?? "Validation error",
      };
    });
  }
  return [{ field: "", message: "Validation failed" }];
}

export function handleZodError(error: ZodError) {
  const issues = extractZodIssues(error);
  return errorResponse("Validation failed", 422, issues);
}

export function handleApiError(error: unknown) {
  if (error instanceof ZodError) {
    return handleZodError(error);
  }

  if (error instanceof Error) {
    // Basic error handling
  }

  logger.error("Unhandled API error", error);
  return errorResponse("Internal server error", 500);
}
