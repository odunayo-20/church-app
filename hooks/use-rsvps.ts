"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getRsvpsAction, 
  updateRsvpStatusAction, 
  deleteRsvpAction,
  submitRsvpAction 
} from "@/app/action/event-actions";
import type { PaginationParams } from "@/lib/db-service";
import type { Rsvp } from "@/types/models";
import type { RsvpInput } from "@/lib/validations";

export const rsvpKeys = {
  all: ["rsvps"] as const,
  lists: () => [...rsvpKeys.all, "list"] as const,
  list: (params: PaginationParams & { eventId?: string }) => [...rsvpKeys.lists(), params] as const,
};

export function useRsvps(params: PaginationParams & { eventId?: string }) {
  return useQuery({
    queryKey: rsvpKeys.list(params),
    queryFn: () => getRsvpsAction(params),
  });
}

export function useCreateRsvp() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ eventId, data }: { eventId: string; data: RsvpInput }) => 
      submitRsvpAction(eventId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: rsvpKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ["events", "detail", variables.eventId] });
    },
  });
}

export function useUpdateRsvpStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Rsvp["status"] }) => 
      updateRsvpStatusAction(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rsvpKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

export function useDeleteRsvp() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteRsvpAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: rsvpKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}
