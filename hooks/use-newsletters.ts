import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getNewsletterSubscribersAction,
  subscribeAction,
  unsubscribeAction,
  deleteSubscriberAction,
  getNewslettersAction,
  getNewsletterByIdAction,
  createNewsletterAction,
  updateNewsletterAction,
  deleteNewsletterAction,
  sendNewsletterAction,
} from "@/app/action/newsletter-actions";
import type { Newsletter, NewsletterSubscriber } from "@/types/models";
import type { PaginationParams } from "@/lib/db-service";

export const newsletterKeys = {
  all: ["newsletters"] as const,
  lists: () => [...newsletterKeys.all, "list"] as const,
  list: (params: PaginationParams) => [...newsletterKeys.lists(), params] as const,
  details: () => [...newsletterKeys.all, "detail"] as const,
  detail: (id: string) => [...newsletterKeys.details(), id] as const,
  subscribers: {
    all: ["newsletter-subscribers"] as const,
    lists: () => [...newsletterKeys.subscribers.all, "list"] as const,
    list: (params: PaginationParams) => [...newsletterKeys.subscribers.lists(), params] as const,
  }
};

// --- Subscriber Hooks ---

export function useNewsletterSubscribers(params: PaginationParams = { page: 1, limit: 10 }) {
  return useQuery({
    queryKey: newsletterKeys.subscribers.list(params),
    queryFn: () => getNewsletterSubscribersAction(params),
  });
}

export function useSubscribe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: subscribeAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: newsletterKeys.subscribers.all });
    },
  });
}

export function useDeleteSubscriber() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSubscriberAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: newsletterKeys.subscribers.all });
    },
  });
}

// --- Newsletter Hooks ---

export function useNewsletters(params: PaginationParams = { page: 1, limit: 10 }) {
  return useQuery({
    queryKey: newsletterKeys.list(params),
    queryFn: () => getNewslettersAction(params),
  });
}

export function useNewsletter(id: string) {
  return useQuery({
    queryKey: newsletterKeys.detail(id),
    queryFn: () => getNewsletterByIdAction(id),
    enabled: !!id,
  });
}

export function useCreateNewsletter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createNewsletterAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: newsletterKeys.all });
    },
  });
}

export function useUpdateNewsletter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateNewsletterAction(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: newsletterKeys.all });
      queryClient.setQueryData(newsletterKeys.detail(data.id), data);
    },
  });
}

export function useDeleteNewsletter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteNewsletterAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: newsletterKeys.all });
    },
  });
}

export function useSendNewsletter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendNewsletterAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: newsletterKeys.all });
      queryClient.invalidateQueries({ queryKey: newsletterKeys.details() });
    },
  });
}
