import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/lib/api/events";
import type { PaginationParams } from "@/types/api";

const KEYS = {
  all: ["events"] as const,
  lists: () => [...KEYS.all, "list"] as const,
  list: (params: PaginationParams) => [...KEYS.lists(), params] as const,
  details: () => [...KEYS.all, "detail"] as const,
  detail: (id: string) => [...KEYS.details(), id] as const,
  rsvps: () => [...KEYS.all, "rsvps"] as const,
  rsvp: (eventId: string) => [...KEYS.rsvps(), eventId] as const,
};

export function useEvents(params?: PaginationParams & { upcoming?: boolean }) {
  return useQuery({
    queryKey: KEYS.list(params ?? {}),
    queryFn: () => api.getEvents(params),
  });
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: KEYS.detail(id),
    queryFn: () => api.getEventById(id),
    enabled: !!id,
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.lists() });
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      ...input
    }: { id: string } & Parameters<typeof api.updateEvent>[1]) =>
      api.updateEvent(id, input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: KEYS.detail(variables.id) });
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.lists() });
    },
  });
}

export function useSubmitRsvp(eventId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { name: string; email: string; guests: number }) =>
      api.submitRsvp(eventId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.detail(eventId) });
    },
  });
}

export const eventKeys = KEYS;
