import { StatCardsSkeleton, TableSkeleton } from "@/components/ui/skeleton";

export default function AdminLoading() {
  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div>
        <div className="h-8 w-32 animate-pulse rounded bg-muted/50" />
        <div className="mt-2 h-4 w-64 animate-pulse rounded bg-muted/50" />
      </div>
      <StatCardsSkeleton />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="h-80 animate-pulse rounded-lg border border-border/40 bg-card" />
        </div>
        <div className="h-80 animate-pulse rounded-lg border border-border/40 bg-card" />
      </div>
      <TableSkeleton rows={5} />
    </div>
  );
}
