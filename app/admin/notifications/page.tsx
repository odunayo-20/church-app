"use client";

import { formatDate } from "@/lib/utils";
import {
  useNotifications,
  useNotificationStats,
  useProcessNotifications,
} from "@/hooks";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  Bell,
  Send,
  Clock,
  AlertCircle,
  Filter,
  ChevronDown,
  CheckCircle2,
  Gift,
  CalendarHeart,
  MessageSquare,
} from "lucide-react";

export default function AdminNotificationsPage() {
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");

  const {
    data: notifications,
    isLoading: isNotificationsLoading,
    error: notificationsError,
  } = useNotifications({ type, status });
  const { data: stats, isLoading: isStatsLoading } = useNotificationStats();
  const processMutation = useProcessNotifications();

  const handleProcess = async () => {
    try {
      await processMutation.mutateAsync();
      toast.success("Notifications processed successfully");
    } catch {
      toast.error("Failed to process notifications");
    }
  };

  if (isNotificationsLoading || isStatsLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500/30 border-t-blue-500" />
          <p className="text-sm font-medium text-muted-foreground">
            Loading notifications…
          </p>
        </div>
      </div>
    );
  }

  if (notificationsError) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex items-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-6 py-4 text-red-500">
          <AlertCircle className="h-5 w-5" />
          <p className="text-sm font-semibold">
            Error loading notifications. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View notification history and dispatch status
          </p>
        </div>
        <button
          onClick={handleProcess}
          disabled={processMutation.isPending}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:opacity-90 hover:shadow-blue-500/40 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {processMutation.isPending ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          {processMutation.isPending
            ? "Processing..."
            : "Process Notifications"}
        </button>
      </motion.div>

      {/* ── Statistics Grid ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid gap-4 sm:grid-cols-3"
      >
        <StatBox
          icon={<Clock className="h-6 w-6 text-amber-500" />}
          label="Pending"
          value={stats?.pending ?? 0}
          bgColor="bg-amber-500/10"
        />
        <StatBox
          icon={<CheckCircle2 className="h-6 w-6 text-emerald-500" />}
          label="Sent"
          value={stats?.sent ?? 0}
          bgColor="bg-emerald-500/10"
        />
        <StatBox
          icon={<AlertCircle className="h-6 w-6 text-rose-500" />}
          label="Failed"
          value={stats?.failed ?? 0}
          bgColor="bg-rose-500/10"
        />
      </motion.div>

      {/* ── Content ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="overflow-hidden rounded-2xl border border-border/40 bg-card shadow-sm">
          {/* Filters Bar */}
          <div className="flex flex-col gap-4 border-b border-border/40 bg-muted/20 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-blue-500">
              <Bell className="h-5 w-5" />
              <h2 className="font-semibold text-foreground">
                Notification Feed
              </h2>
              {notifications && (
                <span className="ml-2 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-bold text-blue-500">
                  {notifications.length}
                </span>
              )}
            </div>

            <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-input bg-background/50 py-2 pl-9 pr-10 text-sm outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">All Types</option>
                  <option value="birthday">Birthday</option>
                  <option value="anniversary">Anniversary</option>
                  <option value="general">General</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-input bg-background/50 py-2 pl-9 pr-10 text-sm outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="sent">Sent</option>
                  <option value="failed">Failed</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
          </div>

          {!notifications || notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
                <Bell className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold">No notifications found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {type || status
                  ? "Try adjusting your filters."
                  : "You have no notifications yet."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border/40">
              {notifications.map(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (notification: any) => {
                  // Determine icon based on type
                  let TypeIcon = MessageSquare;
                  if (notification.type === "birthday") TypeIcon = Gift;
                  if (notification.type === "anniversary")
                    TypeIcon = CalendarHeart;

                  // Determine colors based on status
                  let statusBg = "bg-amber-500/10";
                  let statusText = "text-amber-500";

                  if (notification.status === "sent") {
                    statusBg = "bg-emerald-500/10";
                    statusText = "text-emerald-500";
                  } else if (notification.status === "failed") {
                    statusBg = "bg-rose-500/10";
                    statusText = "text-rose-500";
                  }

                  return (
                    <div
                      key={notification.id}
                      className="flex flex-col gap-4 p-5 transition-colors hover:bg-muted/20 sm:flex-row sm:items-start"
                    >
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${statusBg} ${statusText}`}
                      >
                        <TypeIcon className="h-6 w-6" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-foreground">
                              {notification.member?.name || "Unknown User"}
                            </p>
                            <span className="rounded-md border border-border/40 bg-background px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground shadow-sm">
                              {notification.type}
                            </span>
                          </div>
                          <StatusBadge status={notification.status} />
                        </div>

                        <div className="mt-2 rounded-xl bg-muted/30 p-3">
                          <p className="text-sm text-foreground/90">
                            {notification.message}
                          </p>
                        </div>

                        <div className="mt-3 flex items-center gap-4 text-xs font-medium text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />
                            <span>
                              Created: {formatDate(notification.created_at)}
                            </span>
                          </div>
                          {notification.sent_at && (
                            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                              <Send className="h-3.5 w-3.5" />
                              <span>
                                Sent: {formatDate(notification.sent_at)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                },
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

function StatBox({
  icon,
  label,
  value,
  bgColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  bgColor: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-card p-6 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${bgColor}`}
        >
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    sent: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
    pending:
      "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
    failed:
      "bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400",
  };

  const styleClasses =
    styles[status?.toLowerCase()] ||
    "bg-muted text-muted-foreground border-border/40";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${styleClasses}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${styleClasses.split(" ")[0].replace("/10", "")}`}
      />
      {status || "Unknown"}
    </span>
  );
}
