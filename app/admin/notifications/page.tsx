import prisma from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminNotificationsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; status?: string }>;
}) {
  const { type, status } = await searchParams;

  const where = {
    ...(type ? { type } : {}),
    ...(status ? { status } : {}),
  };

  const [notifications, stats] = await Promise.all([
    prisma.notification.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { member: true },
      take: 50,
    }),
    prisma.notification.groupBy({
      by: ["status", "type"],
      _count: true,
    }),
  ]);

  const totalByStatus = stats.reduce(
    (acc, s) => {
      acc[s.status] = (acc[s.status] || 0) + s._count;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Notifications
        </h1>
        <p className="mt-1 text-muted-foreground">
          View notification history and status
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatBox
          label="Pending"
          value={totalByStatus.pending ?? 0}
          color="text-yellow-600"
        />
        <StatBox
          label="Sent"
          value={totalByStatus.sent ?? 0}
          color="text-green-600"
        />
        <StatBox
          label="Failed"
          value={totalByStatus.failed ?? 0}
          color="text-red-600"
        />
      </div>

      <div className="rounded-lg border border-border/40 bg-card shadow-sm">
        <div className="border-b border-border/40 p-4">
          <form className="flex gap-2">
            <select
              name="type"
              defaultValue={type}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">All Types</option>
              <option value="birthday">Birthday</option>
              <option value="anniversary">Anniversary</option>
              <option value="general">General</option>
            </select>
            <select
              name="status"
              defaultValue={status}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="sent">Sent</option>
              <option value="failed">Failed</option>
            </select>
          </form>
        </div>

        {notifications.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">No notifications found.</p>
          </div>
        ) : (
          <div className="divide-y divide-border/40">
            {notifications.map((notification) => (
              <div key={notification.id} className="flex items-start gap-4 p-4">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                    notification.status === "sent"
                      ? "bg-green-100 text-green-600"
                      : notification.status === "failed"
                        ? "bg-red-100 text-red-600"
                        : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">
                      {notification.member?.name || "Unknown"}
                    </p>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground capitalize">
                      {notification.type}
                    </span>
                    <StatusBadge status={notification.status} />
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {notification.message}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatDate(notification.createdAt)}
                    {notification.sentAt && (
                      <span className="ml-2">
                        · Sent: {formatDate(notification.sentAt)}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatBox({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color?: string;
}) {
  return (
    <div className="rounded-lg border border-border/40 bg-card p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${color || ""}`}>{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    sent: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    failed: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
        styles[status] || "bg-muted text-muted-foreground"
      }`}
    >
      {status}
    </span>
  );
}
