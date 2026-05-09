import { useQuery } from "@tanstack/react-query";
import { getDashboardDataAction } from "@/app/action/dashboard-actions";

export function useDashboardData() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: () => getDashboardDataAction(),
  });
}
