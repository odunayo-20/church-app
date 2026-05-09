import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getMembersAction, 
  getMemberByIdAction, 
  createMemberAction, 
  updateMemberAction, 
  deleteMemberAction 
} from "@/app/action/member-actions";
import type { PaginationParams, PaginatedResult } from "@/types/api";
import type { Member } from "@/types/models";

const KEYS = {
  all: ["members"] as const,
  lists: () => [...KEYS.all, "list"] as const,
  list: (params: PaginationParams) => [...KEYS.lists(), params] as const,
  details: () => [...KEYS.all, "detail"] as const,
  detail: (id: string) => [...KEYS.details(), id] as const,
};

export function useMembers(params?: PaginationParams) {
  return useQuery<PaginatedResult<Member>>({
    queryKey: KEYS.list(params ?? {}),
    queryFn: () => getMembersAction(params ?? {}),
  });
}

export function useMember(id: string) {
  return useQuery<Member>({
    queryKey: KEYS.detail(id),
    queryFn: () => getMemberByIdAction(id),
    enabled: !!id,
  });
}

export function useCreateMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMemberAction,
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
    }: { id: string } & Parameters<typeof updateMemberAction>[1]) =>
      updateMemberAction(id, input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: KEYS.detail(variables.id) });
    },
  });
}

export function useDeleteMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMemberAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.lists() });
    },
  });
}

export const memberKeys = KEYS;
