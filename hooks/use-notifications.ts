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
  });
}

export function useNotificationStats() {
  return useQuery({
    queryKey: KEYS.stats(),
    queryFn: () => getNotificationStatsAction(),
  });
}

export function useProcessNotifications() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: processNotificationsAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEYS.lists() });
    },
  });
}

export const notificationKeys = KEYS;
