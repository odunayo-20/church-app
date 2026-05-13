import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProfilesAction, updateProfileRoleAction } from "@/app/action/profile-actions";
import { toast } from "sonner";
import type { Profile } from "@/types/models";

export const profileKeys = {
  all: ["profiles"] as const,
  lists: () => [...profileKeys.all, "list"] as const,
};

export function useProfiles() {
  return useQuery({
    queryKey: profileKeys.lists(),
    queryFn: () => getProfilesAction(),
  });
}

export function useUpdateProfileRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      updateProfileRoleAction(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.all });
    },
    onError: (error) => {
      console.error("Failed to update role:", error);
    },
  });
}
