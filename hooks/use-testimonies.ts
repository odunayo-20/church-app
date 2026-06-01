import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTestimoniesAction,
  getTestimonyByIdAction,
  createTestimonyAction,
  updateTestimonyAction,
  deleteTestimonyAction,
  type TestimonyParams,
} from "@/app/action/testimony-actions";
import type { TestimonyInput } from "@/lib/validations";

export const testimonyKeys = {
  all: ["testimonies"] as const,
  lists: () => [...testimonyKeys.all, "list"] as const,
  list: (params: TestimonyParams) => [...testimonyKeys.lists(), params] as const,
  details: () => [...testimonyKeys.lists(), "detail"] as const,
  detail: (id: string) => [...testimonyKeys.details(), id] as const,
};

export function useTestimonies(
  params: TestimonyParams = { page: 1, limit: 10 },
  initialData?: any
) {
  return useQuery({
    queryKey: testimonyKeys.list(params),
    queryFn: () => getTestimoniesAction(params),
    ...(initialData ? { initialData } : {}),
  });
}

export function useTestimony(id: string) {
  return useQuery({
    queryKey: testimonyKeys.detail(id),
    queryFn: () => getTestimonyByIdAction(id),
    enabled: !!id,
  });
}

export function useCreateTestimony() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTestimonyAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: testimonyKeys.lists() });
    },
  });
}

export function useUpdateTestimony() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<TestimonyInput> }) =>
      updateTestimonyAction(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: testimonyKeys.lists() });
      queryClient.invalidateQueries({ queryKey: testimonyKeys.detail(id) });
    },
  });
}

export function useDeleteTestimony() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTestimonyAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: testimonyKeys.lists() });
    },
  });
}
