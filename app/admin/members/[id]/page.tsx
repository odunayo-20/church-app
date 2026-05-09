"use client";

import { useMember, useAuth } from "@/hooks";
import { MemberEditForm } from "@/components/members/member-edit-form";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function EditMemberPage() {
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
          You do not have the required permissions to edit member information.
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

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Link
          href="/admin/members"
          className="mb-4 inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Members
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Member</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Update information for {member.name}
          </p>
        </div>
      </motion.div>

      {/* ── Form Content ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="rounded-2xl border border-border/40 bg-card p-6 shadow-sm sm:p-8"
      >
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
      </motion.div>
    </div>
  );
}
