"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { formatDate } from "@/lib/utils";
import { DashboardCharts } from "@/components/admin/dashboard-charts";
import { useDashboardData, useAuth } from "@/hooks";
import { Users, CreditCard, Calendar, FileText, ArrowRight, TrendingUp, Globe } from "lucide-react";

export default function AdminDashboardPage() {
  const { role, loading: authLoading } = useAuth();
  const { data, isLoading: dataLoading, error } = useDashboardData();

  const isLoading = authLoading || dataLoading;
  const isMedia = role === "media";

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500/30 border-t-amber-500" />
          <p className="text-sm font-medium text-muted-foreground">Loading dashboard data…</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-6 py-4 text-center">
          <p className="text-sm font-semibold text-red-500">Error loading dashboard data</p>
        </div>
      </div>
    );
  }

  const {
    memberCount,
    donationCount,
    eventCount,
    postCount,
    monthlyDonations,
    recentDonations,
    upcomingEvents,
  } = data;

  const totalDonations = monthlyDonations.reduce(
    (sum, d) => sum + Number(d.amount),
    0,
  );

  const chartData = monthlyDonations.map((d: any) => ({
    date: formatDate(d.paidAt),
    amount: Number(d.amount),
  }));

  return (
    <div className="space-y-8">
      {/* ── Page Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your central hub for community impact and ministry growth.
          </p>
        </div>
      </motion.div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {!isMedia && (
          <StatCard
            title="Total Members"
            value={memberCount}
            href="/admin/members"
            icon={<Users className="h-5 w-5" />}
            color="blue"
            delay={0.1}
          />
        )}
        {!isMedia && (
          <StatCard
            title="Total Donations"
            value={donationCount}
            href="/admin/donations"
            icon={<CreditCard className="h-5 w-5" />}
            color="emerald"
            delay={0.15}
          />
        )}
        <StatCard
          title="Upcoming Events"
          value={eventCount}
          href="/admin/events"
          icon={<Calendar className="h-5 w-5" />}
          color="amber"
          delay={0.2}
        />
        <StatCard
          title="Published Posts"
          value={postCount}
          href="/admin/blog"
          icon={<FileText className="h-5 w-5" />}
          color="rose"
          delay={0.25}
        />
        <StatCard
          title="Total RSVPs"
          value={data.rsvpCount || 0}
          href="/admin/rsvps"
          icon={<Globe className="h-5 w-5" />}
          color="indigo"
          delay={0.3}
        />
      </div>

      {/* ── Charts & Events ── */}
      <div className="grid gap-6 lg:grid-cols-3">
        {!isMedia && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-2 overflow-hidden rounded-2xl border border-border/40 bg-card shadow-sm"
          >
            <div className="border-b border-border/40 bg-muted/20 px-6 py-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              <h2 className="font-semibold">Donation Trends</h2>
            </div>
            <div className="p-6">
              <DashboardCharts data={chartData} total={totalDonations} />
            </div>
          </motion.div>
        )}
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className={isMedia ? "lg:col-span-3" : ""}
        >
          <UpcomingEventsList events={upcomingEvents} />
        </motion.div>
      </div>

      {/* ── Recent Donations ── */}
      {!isMedia && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <RecentDonationsList donations={recentDonations} />
        </motion.div>
      )}
    </div>
  );
}

function StatCard({
  title,
  value,
  href,
  icon,
  color,
  delay,
}: {
  title: string;
  value: number;
  href: string;
  icon: React.ReactNode;
  color: string;
  delay: number;
}) {
  const colorConfigs: Record<string, string> = {
    blue: "text-blue-600 bg-blue-50 border-blue-100",
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
    amber: "text-amber-600 bg-amber-50 border-amber-100",
    rose: "text-rose-600 bg-rose-50 border-rose-100",
    indigo: "text-indigo-600 bg-indigo-50 border-indigo-100",
  };

  const config = colorConfigs[color] || colorConfigs.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <Link
        href={href}
        className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:border-muted-foreground/20 hover:shadow-md"
      >
        <div className="mb-4 flex items-center justify-between">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl border ${config} shadow-sm`}>
            {icon}
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors group-hover:bg-foreground group-hover:text-background">
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          {title}
        </p>
        <p className="mt-1 text-3xl font-bold tracking-tight text-foreground">
          {value.toLocaleString()}
        </p>
      </Link>
    </motion.div>
  );
}

function UpcomingEventsList({ events }: { events: any[] }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border/40 bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border/40 bg-muted/20 px-6 py-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-amber-500" />
          <h2 className="font-semibold">Upcoming Events</h2>
        </div>
        <Link
          href="/admin/events"
          className="text-xs font-semibold text-amber-500 transition-colors hover:text-amber-600"
        >
          View All
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="flex flex-1 items-center justify-center p-6 text-sm text-muted-foreground">
          No upcoming events
        </div>
      ) : (
        <div className="flex-1 divide-y divide-border/40 overflow-y-auto">
          {events.map((event) => (
            <div key={event.id} className="group flex items-start gap-4 p-4 transition-colors hover:bg-muted/30">
              <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <span className="text-[10px] font-bold uppercase">
                  {new Date(event.date).toLocaleString("default", { month: "short" })}
                </span>
                <span className="text-lg font-black leading-none">
                  {new Date(event.date).getDate()}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold transition-colors group-hover:text-amber-500">
                  {event.title}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {event.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RecentDonationsList({ donations }: { donations: any[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/40 bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border/40 bg-muted/20 px-6 py-4">
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-emerald-500" />
          <h2 className="font-semibold">Recent Donations</h2>
        </div>
        <Link
          href="/admin/donations"
          className="text-xs font-semibold text-emerald-500 transition-colors hover:text-emerald-600"
        >
          View All
        </Link>
      </div>

      {donations.length === 0 ? (
        <div className="p-6 text-center text-sm text-muted-foreground">
          No donations yet
        </div>
      ) : (
        <div className="divide-y divide-border/40">
          {donations.map((donation) => {
            const name = donation.member?.name || donation.donorName || "Anonymous";
            const initial = name.charAt(0).toUpperCase();

            return (
              <div key={donation.id} className="flex items-center justify-between p-4 transition-colors hover:bg-muted/30 sm:px-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    {initial}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{name}</p>
                    <p className="text-xs text-muted-foreground">
                      {donation.paidAt ? formatDate(donation.paidAt) : "Pending"}
                    </p>
                  </div>
                </div>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  ₦{Number(donation.amount).toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
