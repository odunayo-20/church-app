import apiClient from "@/lib/api-client";
import type { Member } from "@/types/models";
import type { ApiResponse, PaginatedResult } from "@/types/api";

export async function getMembers(params?: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  const { data } = await apiClient.get<ApiResponse<PaginatedResult<Member>>>(
    "/api/members",
    { params },
  );
  return data;
}

export async function getMemberById(id: string) {
  const { data } = await apiClient.get<ApiResponse<Member>>(
    `/api/members/${id}`,
  );
  return data;
}

export async function createMember(input: {
  name: string;
  email: string;
  phone?: string;
  birthday?: string;
  anniversary?: string;
}) {
  const { data } = await apiClient.post<ApiResponse<Member>>(
    "/api/members",
    input,
  );
  return data;
}

export async function updateMember(
  id: string,
  input: Partial<{
    name: string;
    email: string;
    phone: string;
    birthday: string;
    anniversary: string;
  }>,
) {
  const { data } = await apiClient.patch<ApiResponse<Member>>(
    `/api/members/${id}`,
    input,
  );
  return data;
}

export async function deleteMember(id: string) {
  const { data } = await apiClient.delete<ApiResponse<unknown>>(
    `/api/members/${id}`,
  );
  return data;
}
