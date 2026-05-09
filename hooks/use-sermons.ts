import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getSermonsAction, 
  getSermonBySlugAction, 
  createSermonAction, 
  updateSermonAction, 
  deleteSermonAction,
  getSermonSeriesAction
} from "@/app/action/sermon-actions";
import type { SermonFilters } from "@/app/action/sermon-actions";

const KEYS = {
  all: ["sermons"] as const,
  lists: () => [...KEYS.all, "list"] as const,
  list: (filters: SermonFilters) => [...KEYS.lists(), filters] as const,
  details: () => [...KEYS.all, "detail"] as const,
  detail: (slug: string) => [...KEYS.details(), slug] as const,
  series: () => [...KEYS.all, "series"] as const,
};

export function useSermons(filters: SermonFilters = {}) {
  return useQuery({
    queryKey: KEYS.list(filters),
    queryFn: () => getSermonsAction(filters),
  });
}

export function useSermon(slug: string) {
  return useQuery({
    queryKey: KEYS.detail(slug),
    queryFn: () => getSermonBySlugAction(slug),
    enabled: !!slug,
  });
}

export function useSermonSeries() {
  return useQuery({
    queryKey: KEYS.series(),
    queryFn: () => getSermonSeriesAction(),
  });
}

export function useCreateSermon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSermonAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.lists() });
    },
  });
}

export function useUpdateSermon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      ...input
    }: { id: string } & Parameters<typeof updateSermonAction>[1]) =>
      updateSermonAction(id, input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: KEYS.lists() });
      // We don't have slug here easily, but usually we invalidate all lists
    },
  });
}

export function useDeleteSermon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSermonAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.lists() });
    },
  });
}

export const sermonKeys = KEYS;
