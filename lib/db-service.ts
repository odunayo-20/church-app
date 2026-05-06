import prisma from "@/lib/prisma";
import { config } from "@/lib/config";

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

type PrismaModel = {
  findMany: (args: unknown) => Promise<unknown[]>;
  count: (args: unknown) => Promise<number>;
};

function getModel(modelName: string): PrismaModel {
  const model = (prisma as unknown as Record<string, PrismaModel>)[modelName];
  if (!model) {
    throw new Error(`Model ${modelName} not found`);
  }
  return model;
}

function buildPagination(
  page: number,
  limit: number,
  total: number,
): PaginatedResult<never>["meta"] {
  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

export async function paginate<T>(
  model: string,
  params: PaginationParams,
  options?: {
    where?: Record<string, unknown>;
    orderBy?: Record<string, unknown>;
    include?: Record<string, unknown>;
    select?: Record<string, unknown>;
  },
): Promise<PaginatedResult<T>> {
  const page = Math.max(1, params.page ?? 1);
  const limit = Math.min(
    config.api.maxPageSize,
    Math.max(1, params.limit ?? config.api.defaultPageSize),
  );
  const skip = (page - 1) * limit;

  const modelClient = getModel(model);

  const baseWhere = options?.where ?? {};
  const searchWhere = buildSearchWhere(params.search, model);
  const where =
    Object.keys(searchWhere).length > 0
      ? { ...baseWhere, ...searchWhere }
      : baseWhere;

  const orderBy = options?.orderBy ?? { createdAt: "desc" };

  const queryArgs = {
    where,
    skip,
    take: limit,
    orderBy,
    ...(options?.include && { include: options.include }),
    ...(options?.select && { select: options.select }),
  };

  const [data, total] = await Promise.all([
    modelClient.findMany(queryArgs),
    modelClient.count({ where }),
  ]);

  return {
    data: data as T[],
    meta: buildPagination(page, limit, total),
  };
}

function buildSearchWhere(
  search: string | undefined,
  model: string,
): Record<string, unknown> {
  if (!search) return {};

  const searchFields: Record<string, string[]> = {
    member: ["name", "email", "phone"],
    donation: ["reference", "donorName", "donorEmail"],
    event: ["title", "description", "location"],
    post: ["title", "excerpt"],
    notification: ["message", "type"],
    profile: ["name", "email"],
  };

  const fields = searchFields[model] ?? ["name", "email", "title"];

  return {
    OR: fields.map((field) => ({
      [field]: { contains: search },
    })),
  };
}
