import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/lib/api/members";
import type { PaginationParams } from "@/types/api";

const KEYS = {
  all: ["members"] as const,
  lists: () => [...KEYS.all, "list"] as const,
  list: (params: PaginationParams) => [...KEYS.lists(), params] as const,
  details: () => [...KEYS.all, "detail"] as const,
  detail: (id: string) => [...KEYS.details(), id] as const,
};

export function useMembers(params?: PaginationParams) {
  return useQuery({
    queryKey: KEYS.list(params ?? {}),
    queryFn: () => api.getMembers(params),
  });
}

export function useMember(id: string) {
  return useQuery({
    queryKey: KEYS.detail(id),
    queryFn: () => api.getMemberById(id),
    enabled: !!id,
  });
}

export function useCreateMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.createMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.lists() });
    },
  });
}

export function useUpdateMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      ...input
    }: { id: string } & Parameters<typeof api.updateMember>[1]) =>
      api.updateMember(id, input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: KEYS.detail(variables.id) });
    },
  });
}

export function useDeleteMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.deleteMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.lists() });
    },
  });
}

export const memberKeys = KEYS;
