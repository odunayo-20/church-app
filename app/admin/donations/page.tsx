"use client";

import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { useDonations, useDonationStats, useAuth } from "@/hooks";
import { useState } from "react";
import type { Donation } from "@/types/models";
import { motion } from "framer-motion";
import {
  Search,
  Heart,
  DollarSign,
  Clock,
  AlertCircle,
  RefreshCcw,
  Filter,
  User,
  Calendar,
  CreditCard,
  ChevronDown,
} from "lucide-react";

const STATUS_FILTERS = [
  { label: "All Statuses", value: "" },
  { label: "Completed", value: "completed" },
  { label: "Pending", value: "pending" },
  { label: "Failed", value: "failed" },
  { label: "Refunded", value: "refunded" },
];

export default function AdminDonationsPage() {
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");

  const {
    data: donationsData,
    isLoading: isDonationsLoading,
    error: donationsError,
  } = useDonations({ page: 1, limit: 100 });
  const { data: statsData, isLoading: isStatsLoading } = useDonationStats();
  const { role, loading: authLoading } = useAuth();

  if (authLoading || isDonationsLoading || isStatsLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500/30 border-t-emerald-500" />
          <p className="text-sm font-medium text-muted-foreground">
            Loading donations data…
          </p>
        </div>
      </div>
    );
  }

  if (role !== "admin") {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10 text-red-500">
          <AlertCircle className="h-10 w-10" />
        </div>
        <h2 className="mt-6 text-2xl font-bold tracking-tight">Access Denied</h2>
        <p className="mt-2 max-w-sm text-muted-foreground">
          You do not have the required permissions to view donation records.
        </p>
        <Link
          href="/admin"
          className="mt-8 rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-slate-800"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const donations = donationsData?.data || [];
  const filteredDonations = donations.filter((d: Donation) => {
    const matchesStatus = !status || d.status === status;
    const matchesSearch =
      !search ||
      d.reference.toLowerCase().includes(search.toLowerCase()) ||
      (d.donorName &&
        d.donorName.toLowerCase().includes(search.toLowerCase())) ||
      (d.donorEmail &&
        d.donorEmail.toLowerCase().includes(search.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  if (donationsError) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex items-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-6 py-4 text-red-500">
          <AlertCircle className="h-5 w-5" />
          <p className="text-sm font-semibold">
            Error loading donations. Please try again.
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
          <h1 className="text-3xl font-bold tracking-tight">Donations</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Tracking the generosity that fuels our mission and outreach.
          </p>
        </div>
      </motion.div>

      {/* ── Statistics Grid ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <StatBox
          icon={<DollarSign className="h-6 w-6 text-emerald-500" />}
          label="Total Received"
          value={`₦${Number(statsData?.totalAmount || 0).toLocaleString()}`}
          bgColor="bg-emerald-500/10"
        />
        <StatBox
          icon={<Heart className="h-6 w-6 text-blue-500" />}
          label="Completed"
          value={statsData?.counts?.completed || 0}
          bgColor="bg-blue-500/10"
        />
        <StatBox
          icon={<Clock className="h-6 w-6 text-amber-500" />}
          label="Pending"
          value={statsData?.counts?.pending || 0}
          bgColor="bg-amber-500/10"
        />
        <StatBox
          icon={<AlertCircle className="h-6 w-6 text-rose-500" />}
          label="Failed/Refunded"
          value={
            (statsData?.counts?.failed || 0) +
            (statsData?.counts?.refunded || 0)
          }
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
            <div className="flex items-center gap-2 text-emerald-500">
              <CreditCard className="h-5 w-5" />
              <h2 className="font-semibold text-foreground">
                Transaction History
              </h2>
              <span className="ml-2 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-500">
                {filteredDonations.length}
              </span>
            </div>

            <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
              <div className="relative flex-1 sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search ref or donor..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-input bg-background/50 py-2 pl-9 pr-4 text-sm outline-none transition-all focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-input bg-background/50 py-2 pl-9 pr-10 text-sm outline-none transition-all focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                >
                  {STATUS_FILTERS.map((filter) => (
                    <option key={filter.value} value={filter.value}>
                      {filter.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
          </div>

          {filteredDonations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                <RefreshCcw className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold">No donations found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {search || status
                  ? "Try adjusting your search or filters."
                  : "You have no donation records yet."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/30 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  <tr>
                    <th className="px-6 py-4">Reference</th>
                    <th className="hidden px-6 py-4 sm:table-cell">Donor</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="hidden px-6 py-4 md:table-cell">Method</th>
                    <th className="hidden px-6 py-4 lg:table-cell text-right">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {filteredDonations.map((donation: Donation) => (
                    <tr
                      key={donation.id}
                      className="group transition-colors hover:bg-muted/20"
                    >
                      <td className="px-6 py-4">
                        <p className="font-mono text-xs font-semibold text-foreground/80 transition-colors group-hover:text-emerald-500">
                          {donation.reference}
                        </p>
                      </td>
                      <td className="hidden px-6 py-4 sm:table-cell">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                            <User className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {donation.member?.name ||
                                donation.donorName ||
                                "Anonymous"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {donation.donorEmail || donation.member?.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-bold text-foreground">
                          ₦{Number(donation.amount).toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <StatusBadge status={donation.status} />
                      </td>
                      <td className="hidden px-6 py-4 md:table-cell">
                        <span className="inline-flex items-center gap-1.5 rounded-lg border border-border/40 bg-muted/30 px-2.5 py-1 text-xs font-medium text-muted-foreground">
                          {donation.channel || donation.paymentMethod || "—"}
                        </span>
                      </td>
                      <td className="hidden px-6 py-4 lg:table-cell text-right">
                        <div className="flex items-center justify-end gap-2 text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>
                            {formatDate(donation.paidAt || donation.createdAt)}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
  value: string | number;
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
    completed:
      "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
    pending:
      "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
    failed:
      "bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400",
    refunded:
      "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400",
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
