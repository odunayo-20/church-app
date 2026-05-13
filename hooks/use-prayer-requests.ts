import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPrayerRequestsAction,
  getPrayerRequestByIdAction,
  createPrayerRequestAction,
  updatePrayerRequestAction,
  deletePrayerRequestAction,
} from "@/app/action/prayer-actions";
import type { PrayerRequestInput } from "@/lib/validations";
import type { PaginationParams } from "@/lib/db-service";

export const prayerKeys = {
  all: ["prayer-requests"] as const,
  lists: () => [...prayerKeys.all, "list"] as const,
  list: (params: PaginationParams) => [...prayerKeys.lists(), params] as const,
  details: () => [...prayerKeys.lists(), "detail"] as const,
  detail: (id: string) => [...prayerKeys.details(), id] as const,
};

export function usePrayerRequests(params: PaginationParams = { page: 1, limit: 10 }) {
  return useQuery({
    queryKey: prayerKeys.list(params),
    queryFn: () => getPrayerRequestsAction(params),
  });
}

export function usePrayerRequest(id: string) {
  return useQuery({
    queryKey: prayerKeys.detail(id),
    queryFn: () => getPrayerRequestByIdAction(id),
    enabled: !!id,
  });
}

export function useCreatePrayerRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPrayerRequestAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: prayerKeys.lists() });
    },
  });
}

export function useUpdatePrayerRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PrayerRequestInput> }) =>
      updatePrayerRequestAction(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: prayerKeys.lists() });
      queryClient.invalidateQueries({ queryKey: prayerKeys.detail(id) });
    },
  });
}

export function useDeletePrayerRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePrayerRequestAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: prayerKeys.lists() });
    },
  });
}
