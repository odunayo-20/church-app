import apiClient from "@/lib/api-client";
import type { Post } from "@/types/models";
import type { ApiResponse, PaginatedResult } from "@/types/api";

export async function getPosts(params?: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  const { data } = await apiClient.get<ApiResponse<PaginatedResult<Post>>>(
    "/api/posts",
    { params },
  );
  return data;
}

export async function getPostById(id: string) {
  const { data } = await apiClient.get<ApiResponse<Post>>(`/api/posts/${id}`);
  return data;
}

export async function createPost(input: {
  title: string;
  content: string;
  image?: string;
}) {
  const { data } = await apiClient.post<ApiResponse<Post>>("/api/posts", input);
  return data;
}

export async function updatePost(
  id: string,
  input: Partial<{
    title: string;
    content: string;
    image: string;
  }>,
) {
  const { data } = await apiClient.patch<ApiResponse<Post>>(
    `/api/posts/${id}`,
    input,
  );
  return data;
}

export async function deletePost(id: string) {
  const { data } = await apiClient.delete<ApiResponse<unknown>>(
    `/api/posts/${id}`,
  );
  return data;
}
