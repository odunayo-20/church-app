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
    if (error.name === "PrismaClientKnownRequestError") {
      const prismaError = error as unknown as Record<string, unknown>;
      const code = prismaError.code as string | undefined;

      if (code === "P2025") {
        return errorResponse("Record not found", 404);
      }
      if (code === "P2002") {
        const target = (prismaError.meta as Record<string, unknown> | undefined)
          ?.target as string[] | undefined;
        const field = target?.join(", ") ?? "value";
        return errorResponse(`A record with this ${field} already exists`, 409);
      }
      if (code === "P2003") {
        return errorResponse("Invalid reference to related record", 400);
      }
    }

    if (error.name === "PrismaClientValidationError") {
      return errorResponse("Invalid data provided", 400);
    }
  }

  logger.error("Unhandled API error", error);
  return errorResponse("Internal server error", 500);
}
