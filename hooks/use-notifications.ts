import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getNotificationsAction, 
  getNotificationStatsAction,
  processNotificationsAction
} from "@/app/action/notification-actions";

const KEYS = {
  all: ["notifications"] as const,
  lists: () => [...KEYS.all, "list"] as const,
  list: (filters: any) => [...KEYS.lists(), filters] as const,
  stats: () => [...KEYS.all, "stats"] as const,
};

export function useNotifications(filters: any = {}) {
  return useQuery({
    queryKey: KEYS.list(filters),
    queryFn: () => getNotificationsAction(filters),
    refetchOnWindowFocus: false,
  });
}

export function useNotificationStats() {
  return useQuery({
    queryKey: KEYS.stats(),
    queryFn: () => getNotificationStatsAction(),
    refetchOnWindowFocus: false,
  });
}

export function useProcessNotifications() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: processNotificationsAction,
    onSuccess: () => {
      // Invalidate both the list and stats so they refresh after processing
      queryClient.invalidateQueries({ queryKey: KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: KEYS.stats() });
    },
  });
}

export const notificationKeys = KEYS;
