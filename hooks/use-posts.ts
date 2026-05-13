import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPostsAction,
  getPostByIdAction,
  getPostBySlugAction,
  createPostAction,
  updatePostAction,
  deletePostAction,
} from "@/app/action/post-actions";
import type { PaginationParams, PaginatedResult } from "@/types/api";
import type { Post } from "@/types/models";

const KEYS = {
  all: ["posts"] as const,

  lists: () => [...KEYS.all, "list"] as const,

  list: (params: PaginationParams & { published?: boolean }) =>
    [...KEYS.lists(), params] as const,

  details: () => [...KEYS.all, "detail"] as const,

  detail: (id: string) => [...KEYS.details(), id] as const,

  slug: (slug: string) => [...KEYS.all, "slug", slug] as const,
};

export function usePosts(params?: PaginationParams & { published?: boolean }) {
  return useQuery<PaginatedResult<Post>>({
    queryKey: KEYS.list(params ?? {}),
    queryFn: () => getPostsAction(params ?? {}),
    placeholderData: (prev) => prev,
  });
}

export function usePost(id: string) {
  return useQuery<Post>({
    queryKey: KEYS.detail(id),
    queryFn: () => getPostByIdAction(id),
    enabled: !!id,
  });
}

export function usePostBySlug(slug: string) {
  return useQuery<Post>({
    queryKey: KEYS.slug(slug),
    queryFn: () => getPostBySlugAction(slug),
    enabled: !!slug,
    placeholderData: (prev) => prev,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPostAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.lists() });
    },
  });
}

export function useUpdatePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      ...input
    }: { id: string } & Parameters<typeof updatePostAction>[1]) =>
      updatePostAction(id, input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: KEYS.detail(variables.id) });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePostAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.lists() });
    },
  });
}

export const postKeys = KEYS;
