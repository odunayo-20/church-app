"use client";

import { formatDate } from "@/lib/utils";
import {
  useNotifications,
  useNotificationStats,
  useProcessNotifications,
} from "@/hooks";
import { useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
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
  Calendar,
  RefreshCw,
  X,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

type ProcessResult = {
  birthday: { processed: number; success: number; failed: number };
  anniversary: { processed: number; success: number; failed: number };
  eventReminder: { processed: number; success: number; failed: number; skipped?: number };
};

export default function AdminNotificationsPage() {
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [processResult, setProcessResult] = useState<ProcessResult | null>(null);
  const [showResultPanel, setShowResultPanel] = useState(false);

  const {
    data: notifications,
    isLoading: isNotificationsLoading,
    error: notificationsError,
    refetch: refetchNotifications,
  } = useNotifications({ type, status });

  const { data: stats, isLoading: isStatsLoading, refetch: refetchStats } =
    useNotificationStats();

  const processMutation = useProcessNotifications();

  const handleProcess = async () => {
    try {
      const result = await processMutation.mutateAsync();
      // Manually cast since action returns full result
      setProcessResult(result as unknown as ProcessResult);
      setShowResultPanel(true);
      const totalSent =
        (result.birthday?.success ?? 0) +
        (result.anniversary?.success ?? 0) +
        (result.eventReminder?.success ?? 0);
      const totalFailed =
        (result.birthday?.failed ?? 0) +
        (result.anniversary?.failed ?? 0) +
        (result.eventReminder?.failed ?? 0);
      if (totalSent > 0) {
        toast.success(`${totalSent} notification${totalSent > 1 ? "s" : ""} sent successfully!`);
      } else if (totalFailed > 0) {
        toast.error(`${totalFailed} notification${totalFailed > 1 ? "s" : ""} failed to send.`);
      } else {
        toast.info("No notifications to process right now.");
      }
      // Refetch data
      refetchNotifications();
      refetchStats();
    } catch (e: any) {
      toast.error(e?.message ?? "Failed to process notifications");
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
        <div className="flex max-w-md flex-col items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-8 py-6 text-center">
          <AlertCircle className="h-8 w-8 text-red-500" />
          <div>
            <p className="font-semibold text-red-500">Error loading notifications</p>
            <p className="mt-1 text-sm text-muted-foreground">
              The notifications table may be missing required columns. Run{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono text-foreground">
                supabase-notifications-migration.sql
              </code>{" "}
              in your Supabase SQL editor to apply the schema update.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const totalProcessed =
    (processResult?.birthday.processed ?? 0) +
    (processResult?.anniversary.processed ?? 0) +
    (processResult?.eventReminder.processed ?? 0);
  const totalSent =
    (processResult?.birthday.success ?? 0) +
    (processResult?.anniversary.success ?? 0) +
    (processResult?.eventReminder.success ?? 0);
  const totalFailed =
    (processResult?.birthday.failed ?? 0) +
    (processResult?.anniversary.failed ?? 0) +
    (processResult?.eventReminder.failed ?? 0);
  const totalSkipped = processResult?.eventReminder.skipped ?? 0;

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
            Manage and dispatch member notifications
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => { refetchNotifications(); refetchStats(); }}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border/60 bg-background px-4 text-sm font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </button>
          <button
            onClick={handleProcess}
            disabled={processMutation.isPending}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:opacity-90 hover:shadow-blue-500/40 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {processMutation.isPending ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            ) : (
              <Zap className="h-4 w-4" />
            )}
            {processMutation.isPending ? "Processing…" : "Process Now"}
          </button>
        </div>
      </motion.div>

      {/* ── Process Result Panel ── */}
      <AnimatePresence>
        {showResultPanel && processResult && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.35 }}
            className="relative overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-transparent p-6"
          >
            <button
              onClick={() => setShowResultPanel(false)}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/15 text-blue-500">
                <TrendingUp className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Processing Complete</p>
                <p className="text-xs text-muted-foreground">
                  {totalProcessed} member{totalProcessed !== 1 ? "s" : ""} evaluated
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <ResultCard
                label="Sent"
                value={totalSent}
                color="text-emerald-500"
                bg="bg-emerald-500/10"
                icon={<CheckCircle2 className="h-4 w-4" />}
              />
              <ResultCard
                label="Failed"
                value={totalFailed}
                color="text-rose-500"
                bg="bg-rose-500/10"
                icon={<AlertCircle className="h-4 w-4" />}
              />
              <ResultCard
                label="Skipped"
                value={totalSkipped}
                color="text-amber-500"
                bg="bg-amber-500/10"
                icon={<Clock className="h-4 w-4" />}
              />
              <ResultCard
                label="Total"
                value={totalProcessed}
                color="text-blue-500"
                bg="bg-blue-500/10"
                icon={<Users className="h-4 w-4" />}
              />
            </div>

            {/* Breakdown by type */}
            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
              <TypeBreakdown
                icon={<Gift className="h-3.5 w-3.5" />}
                label="🎂 Birthday"
                result={processResult.birthday}
                color="text-amber-500"
              />
              <TypeBreakdown
                icon={<CalendarHeart className="h-3.5 w-3.5" />}
                label="💍 Anniversary"
                result={processResult.anniversary}
                color="text-pink-500"
              />
              <TypeBreakdown
                icon={<Calendar className="h-3.5 w-3.5" />}
                label="📅 Events"
                result={processResult.eventReminder}
                color="text-indigo-500"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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

      {/* ── Notification Feed ── */}
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
              <h2 className="font-semibold text-foreground">Notification Feed</h2>
              {notifications && notifications.length > 0 && (
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
                  <option value="event_reminder">Event Reminder</option>
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
                  : 'Click "Process Now" to dispatch today\'s notifications.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border/40">
              {notifications.map(
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (notification: any, idx: number) => {
                  let TypeIcon = MessageSquare;
                  if (notification.type === "birthday") TypeIcon = Gift;
                  if (notification.type === "anniversary") TypeIcon = CalendarHeart;
                  if (notification.type === "event_reminder") TypeIcon = Calendar;

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
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25, delay: idx * 0.03 }}
                      className="flex flex-col gap-4 p-5 transition-colors hover:bg-muted/20 sm:flex-row sm:items-start"
                    >
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${statusBg} ${statusText}`}
                      >
                        <TypeIcon className="h-5 w-5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-foreground">
                              {notification.members?.name || "Unknown User"}
                            </p>
                            <span className="rounded-md border border-border/40 bg-background px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                              {notification.type?.replace("_", " ")}
                            </span>
                          </div>
                          <StatusBadge status={notification.status} />
                        </div>

                        {notification.members?.email && (
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {notification.members.email}
                          </p>
                        )}

                        <div className="mt-2 rounded-xl bg-muted/30 p-3">
                          <p className="text-sm text-foreground/90">
                            {notification.message}
                          </p>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-medium text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />
                            <span>Created: {formatDate(notification.createdAt)}</span>
                          </div>
                          {notification.sentAt && (
                            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                              <Send className="h-3.5 w-3.5" />
                              <span>Sent: {formatDate(notification.sentAt)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
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

/* ── Sub-components ── */

function ResultCard({
  label,
  value,
  color,
  bg,
  icon,
}: {
  label: string;
  value: number;
  color: string;
  bg: string;
  icon: React.ReactNode;
}) {
  return (
    <div className={`flex items-center gap-3 rounded-xl ${bg} px-4 py-3`}>
      <span className={color}>{icon}</span>
      <div>
        <p className={`text-xl font-bold ${color}`}>{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

function TypeBreakdown({
  label,
  result,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  result: { processed: number; success: number; failed: number };
  color: string;
}) {
  return (
    <div className="rounded-xl border border-border/30 bg-background/50 px-4 py-3">
      <p className="mb-2 text-xs font-semibold text-muted-foreground">{label}</p>
      <div className="flex items-center gap-3 text-xs">
        <span className="text-emerald-500">✓ {result.success} sent</span>
        {result.failed > 0 && (
          <span className="text-rose-500">✗ {result.failed} failed</span>
        )}
        {result.processed === 0 && (
          <span className="text-muted-foreground">No matches today</span>
        )}
      </div>
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
    pending: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
    failed: "bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400",
  };

  const styleClasses =
    styles[status?.toLowerCase()] || "bg-muted text-muted-foreground border-border/40";
  const dotColor = styleClasses.split(" ")[0].replace("/10", "");

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${styleClasses}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
      {status || "Unknown"}
    </span>
  );
}
