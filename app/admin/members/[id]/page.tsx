"use client";

import { useMember, useAuth } from "@/hooks";
import { MemberEditForm } from "@/components/members/member-edit-form";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, AlertCircle, Calendar, Mail, Phone, CreditCard, History } from "lucide-react";
import Link from "next/link";
import { formatDate, formatCurrency } from "@/lib/utils";

export default function MemberDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: member, isLoading, error } = useMember(id);
  const { role, loading: authLoading } = useAuth();

  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500/30 border-t-blue-500" />
          <p className="text-sm font-medium text-muted-foreground">
            Loading member details…
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
          You do not have the required permissions to view member information.
        </p>
        <Link
          href="/admin/members"
          className="mt-8 rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-slate-800"
        >
          Back to Members
        </Link>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-6 py-4 text-red-500">
            <AlertCircle className="h-5 w-5" />
            <p className="text-sm font-semibold">
              Member not found or error loading.
            </p>
          </div>
          <Link
            href="/admin/members"
            className="text-sm font-medium text-blue-500 hover:underline"
          >
            Back to Members
          </Link>
        </div>
      </div>
    );
  }

  const totalDonated = member.donations?.reduce((sum, d) => sum + Number(d.amount), 0) || 0;

  return (
    <div className="space-y-8 pb-12">
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Link
          href="/admin/members"
          className="mb-4 inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Members
        </Link>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-xl font-bold text-blue-500">
                {member.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{member.name}</h1>
                <p className="text-sm text-muted-foreground">Member since {formatDate(member.createdAt)}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-border/40 bg-card px-4 py-2 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Total Donations</p>
              <p className="text-lg font-bold text-foreground">{formatCurrency(totalDonated)}</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* ── Left Column: Basic Info & Edit Form ── */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-2 space-y-8"
        >
          <div className="rounded-2xl border border-border/40 bg-card p-6 shadow-sm sm:p-8">
            <h2 className="mb-6 flex items-center gap-2 text-xl font-bold">
              <Mail className="h-5 w-5 text-blue-500" />
              Edit Information
            </h2>
            <MemberEditForm
              member={{
                id: member.id,
                name: member.name,
                email: member.email,
                phone: member.phone,
                birthday: member.birthday,
                anniversary: member.anniversary,
              }}
            />
          </div>
        </motion.div>

        {/* ── Right Column: Activity & Summary ── */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-8"
        >
          {/* Quick Contact Card */}
          <div className="rounded-2xl border border-border/40 bg-card p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-muted-foreground">Quick Contact</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <Mail className="h-4 w-4" />
                </div>
                <span className="font-medium">{member.email}</span>
              </div>
              {member.phone && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <Phone className="h-4 w-4" />
                  </div>
                  <span className="font-medium">{member.phone}</span>
                </div>
              )}
              {member.birthday && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <span className="font-medium">Birthday: {formatDate(member.birthday)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Donation History Card */}
          <div className="rounded-2xl border border-border/40 bg-card overflow-hidden shadow-sm">
            <div className="border-b border-border/40 bg-muted/20 px-6 py-4">
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted-foreground">
                <History className="h-4 w-4" />
                Recent Donations
              </h3>
            </div>
            <div className="divide-y divide-border/40">
              {member.donations && member.donations.length > 0 ? (
                member.donations.slice(0, 5).map((donation) => (
                  <div key={donation.id} className="px-6 py-4 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-foreground">{formatCurrency(donation.amount)}</p>
                      <p className="text-[10px] text-muted-foreground uppercase">{formatDate(donation.createdAt)}</p>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                      donation.status === "completed" ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"
                    }`}>
                      {donation.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <p className="text-sm text-muted-foreground">No donations found for this member.</p>
                </div>
              )}
            </div>
            {member.donations && member.donations.length > 5 && (
              <Link
                href="/admin/donations"
                className="block border-t border-border/40 bg-muted/10 py-3 text-center text-xs font-bold text-blue-500 hover:bg-muted/20 transition-colors"
              >
                View All Donations
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
