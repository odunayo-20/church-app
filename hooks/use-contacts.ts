import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getContactMessagesAction,
  getContactMessageByIdAction,
  updateContactMessageAction,
  deleteContactMessageAction,
} from "@/app/action/contact-actions";
import type { ContactMessage } from "@/types/models";
import type { ContactMessageInput } from "@/lib/validations";
import type { PaginationParams } from "@/lib/db-service";

export const contactKeys = {
  all: ["contacts"] as const,
  lists: () => [...contactKeys.all, "list"] as const,
  list: (params: PaginationParams) => [...contactKeys.lists(), params] as const,
  details: () => [...contactKeys.all, "detail"] as const,
  detail: (id: string) => [...contactKeys.details(), id] as const,
};

export function useContactMessages(
  params: PaginationParams = { page: 1, limit: 10 }
) {
  return useQuery({
    queryKey: contactKeys.list(params),
    queryFn: () => getContactMessagesAction(params),
    placeholderData: (prev) => prev,
  });
}

export function useContactMessage(id: string) {
  return useQuery({
    queryKey: contactKeys.detail(id),
    queryFn: () => getContactMessageByIdAction(id),
    enabled: !!id,
  });
}

export function useUpdateContactMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ContactMessageInput> }) =>
      updateContactMessageAction(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: contactKeys.lists() });
      queryClient.setQueryData(contactKeys.detail(data.id), data);

       queryClient.invalidateQueries({
    queryKey: contactKeys.lists(),
  });
  
    },
  });
}

export function useDeleteContactMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteContactMessageAction,
    onSuccess: (_, id) => {
     
      queryClient.removeQueries({ queryKey: contactKeys.detail(id) });

       queryClient.invalidateQueries({ queryKey: contactKeys.lists() });
    },
  });
}
