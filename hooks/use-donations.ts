import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/lib/api/donations";
import type { PaginationParams } from "@/types/api";

const KEYS = {
  all: ["donations"] as const,
  lists: () => [...KEYS.all, "list"] as const,
  list: (params: PaginationParams) => [...KEYS.lists(), params] as const,
  details: () => [...KEYS.all, "detail"] as const,
  detail: (id: string) => [...KEYS.details(), id] as const,
};

export function useDonations(params?: PaginationParams) {
  return useQuery({
    queryKey: KEYS.list(params ?? {}),
    queryFn: () => api.getDonations(params),
  });
}

export function useDonation(id: string) {
  return useQuery({
    queryKey: KEYS.detail(id),
    queryFn: () => api.getDonationById(id),
    enabled: !!id,
  });
}

export function useCreateDonation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.createDonation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.lists() });
    },
  });
}

export function useUpdateDonation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      ...input
    }: { id: string } & Parameters<typeof api.updateDonation>[1]) =>
      api.updateDonation(id, input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: KEYS.detail(variables.id) });
    },
  });
}

export function useDeleteDonation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.deleteDonation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.lists() });
    },
  });
}

export const donationKeys = KEYS;
