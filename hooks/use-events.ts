import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getEventsAction, 
  getEventByIdAction, 
  createEventAction, 
  updateEventAction, 
  deleteEventAction,
  submitRsvpAction
} from "@/app/action/event-actions";
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
    queryFn: () => getEventsAction(params ?? {}),
  });
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: KEYS.detail(id),
    queryFn: () => getEventByIdAction(id),
    enabled: !!id,
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEventAction,
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
    }: { id: string } & Parameters<typeof updateEventAction>[1]) =>
      updateEventAction(id, input),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: KEYS.detail(variables.id) });
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteEventAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.lists() });
    },
  });
}

export function useSubmitRsvp(eventId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { name: string; email: string; guests: number }) =>
      submitRsvpAction(eventId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.detail(eventId) });
    },
  });
}

export const eventKeys = KEYS;
