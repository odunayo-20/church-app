"use client";

import { formatDate } from "@/lib/utils";
import { useDonations, useDonationStats } from "@/hooks";
import { useState } from "react";
import type { Donation } from "@/types/models";

const STATUS_FILTERS = [
  { label: "All", value: "" },
  { label: "Completed", value: "completed" },
  { label: "Pending", value: "pending" },
  { label: "Failed", value: "failed" },
  { label: "Refunded", value: "refunded" },
];

export default function AdminDonationsPage() {
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");

  const { data: donationsData, isLoading: isDonationsLoading } = useDonations({ page: 1, limit: 100 });
  const { data: statsData, isLoading: isStatsLoading } = useDonationStats();

  const donations = donationsData?.data || [];
  const filteredDonations = donations.filter(d => {
    const matchesStatus = !status || d.status === status;
    const matchesSearch = !search || 
      d.reference.toLowerCase().includes(search.toLowerCase()) ||
      (d.donorName && d.donorName.toLowerCase().includes(search.toLowerCase())) ||
      (d.donorEmail && d.donorEmail.toLowerCase().includes(search.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  if (isDonationsLoading || isStatsLoading) {
    return <div className="py-12 text-center">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Donations
        </h1>
        <p className="mt-1 text-muted-foreground">
          View and manage donation history
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatBox
          label="Total Received"
          value={`₦${Number(statsData?.totalAmount || 0).toLocaleString()}`}
        />
        <StatBox label="Completed" value={statsData?.counts?.completed || 0} />
        <StatBox label="Pending" value={statsData?.counts?.pending || 0} />
        <StatBox label="Failed" value={statsData?.counts?.failed || 0} />
      </div>

      <div className="rounded-lg border border-border/40 bg-card shadow-sm">
        <div className="border-b border-border/40 p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex flex-1 gap-2">
              <input
                type="text"
                placeholder="Search by reference or donor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm sm:w-64"
              />
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {STATUS_FILTERS.map((filter) => (
                  <option key={filter.value} value={filter.value}>
                    {filter.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {filteredDonations.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">No donations found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">Reference</th>
                  <th className="hidden px-4 py-3 text-left text-sm font-medium sm:table-cell">
                    Donor
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Amount</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                  <th className="hidden px-4 py-3 text-left text-sm font-medium md:table-cell">
                    Method
                  </th>
                  <th className="hidden px-4 py-3 text-left text-sm font-medium lg:table-cell">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredDonations.map((donation: Donation) => (
                  <tr key={donation.id} className="hover:bg-muted/25">
                    <td className="px-4 py-3">
                      <p className="truncate font-mono text-sm">
                        {donation.reference}
                      </p>
                    </td>
                    <td className="hidden px-4 py-3 text-sm sm:table-cell">
                      <div>
                        <p className="font-medium">
                          {donation.member?.name ||
                            donation.donorName ||
                            "Anonymous"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {donation.donorEmail || donation.member?.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium">
                      ₦{Number(donation.amount).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={donation.status} />
                    </td>
                    <td className="hidden px-4 py-3 text-sm text-muted-foreground md:table-cell">
                      {donation.channel || donation.paymentMethod || "—"}
                    </td>
                    <td className="hidden px-4 py-3 text-sm text-muted-foreground lg:table-cell">
                      {formatDate(donation.paidAt || donation.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-border/40 bg-card p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-bold">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    completed: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    failed: "bg-red-100 text-red-800",
    refunded: "bg-gray-100 text-gray-800",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium capitalize ${
        styles[status] || "bg-muted text-muted-foreground"
      }`}
    >
      {status}
    </span>
  );
}
