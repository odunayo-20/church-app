import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getDonationsAction, 
  getDonationByIdAction, 
  createDonationAction, 
  updateDonationAction, 
  deleteDonationAction,
  getDonationStatsAction,
  verifyDonationAction
} from "@/app/action/donation-actions";
import type { PaginationParams, PaginatedResult } from "@/types/api";
import type { Donation } from "@/types/models";

const KEYS = {
  all: ["donations"] as const,
  lists: () => [...KEYS.all, "list"] as const,
  list: (params: PaginationParams) => [...KEYS.lists(), params] as const,
  details: () => [...KEYS.all, "detail"] as const,
  detail: (id: string) => [...KEYS.details(), id] as const,
  stats: () => [...KEYS.all, "stats"] as const,
};

export function useDonations(params?: PaginationParams) {
  return useQuery<PaginatedResult<Donation>>({
    queryKey: KEYS.list(params ?? {}),
    queryFn: () => getDonationsAction(params ?? {}),
  });
}

export function useDonationStats() {
  return useQuery({
    queryKey: KEYS.stats(),
    queryFn: () => getDonationStatsAction(),
  });
}

export function useDonation(id: string) {
  return useQuery<Donation>({
    queryKey: KEYS.detail(id),
    queryFn: () => getDonationByIdAction(id),
    enabled: !!id,
  });
}

export function useCreateDonation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createDonationAction,
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
    }: { id: string } & Parameters<typeof updateDonationAction>[1]) =>
      updateDonationAction(id, input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: KEYS.detail(variables.id) });
    },
  });
}

export function useDeleteDonation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteDonationAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.lists() });
    },
  });
}

export function useVerifyDonation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: verifyDonationAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: donationKeys.all });
    },
  });
}

export const donationKeys = KEYS;
