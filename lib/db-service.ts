import { createClient } from "@/lib/supabase/server";
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
  table: string,
  params: PaginationParams,
  options?: {
    select?: string;
    filters?: (query: any) => any;
    orderBy?: { column: string; ascending?: boolean };
    supabase?: any;
  },
): Promise<PaginatedResult<T>> {
  const supabase = options?.supabase || (await createClient());
  const page = Math.max(1, params.page ?? 1);
  const limit = Math.min(
    config.api.maxPageSize,
    Math.max(1, params.limit ?? config.api.defaultPageSize),
  );
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from(table)
    .select(options?.select ?? "*", { count: "exact" });

  if (params.search) {
    query = buildSearchQuery(query, params.search, table);
  }

  if (options?.filters) {
    query = options.filters(query);
  }

  const { column = "created_at", ascending = false } = options?.orderBy ?? {};
  query = query.order(column, { ascending });

  const { data, count, error } = await query.range(from, to);

  if (error) {
    throw error;
  }

  return {
    data: (data as T[]) || [],
    meta: buildPagination(page, limit, count ?? 0),
  };
}

function buildSearchQuery(query: any, search: string, table: string) {
  const searchFields: Record<string, string[]> = {
    members: ["name", "email", "phone"],
    donations: ["reference", "donorName", "donorEmail"],
    events: ["title", "description", "location"],
    posts: ["title", "excerpt"],
    notifications: ["message", "type"],
    profiles: ["name", "email"],
    prayer_requests: ["name", "email", "request"],
    contact_messages: ["name", "email", "subject", "message"],
    rsvps: ["name", "email"],
  };

  const fields = searchFields[table] ?? ["name", "email", "title"];
  const orString = fields.map((field) => `${field}.ilike.%${search}%`).join(",");

  return query.or(orString);
}

