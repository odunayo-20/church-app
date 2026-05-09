"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { formatDate } from "@/lib/utils";
import { MemberForm } from "@/components/members/member-form";
import { DeleteButton } from "@/components/admin/delete-button";
import { useMembers, useDeleteMember, useAuth } from "@/hooks";
import { useState } from "react";
import { toast } from "sonner";
import type { Member } from "@/types/models";
import {
  Users,
  Pencil,
  AlertCircle,
  Search,
  Mail,
  Phone,
  Calendar,
} from "lucide-react";

export default function AdminMembersPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading, error } = useMembers({ page: 1, limit: 100 });
  const { role, loading: authLoading } = useAuth();
  const deleteMemberMutation = useDeleteMember();

  const handleDelete = async (id: string) => {
    try {
      await deleteMemberMutation.mutateAsync(id);
      toast.success("Member deleted successfully");
    } catch (error) {
      toast.error("Failed to delete member");
    }
  };

  const filteredMembers =
    data?.data?.filter(
      (member: Member) =>
        member.name.toLowerCase().includes(search.toLowerCase()) ||
        member.email.toLowerCase().includes(search.toLowerCase()) ||
        (member.phone && member.phone.includes(search)),
    ) || [];

  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500/30 border-t-blue-500" />
          <p className="text-sm font-medium text-muted-foreground">
            Loading members…
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
          You do not have the required permissions to view the members list. Please contact your administrator if you believe this is an error.
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

  if (error) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex items-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-6 py-4 text-red-500">
          <AlertCircle className="h-5 w-5" />
          <p className="text-sm font-semibold">
            Error loading members. Please try again.
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
          <h1 className="text-3xl font-bold tracking-tight">Members</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Maintain deep connections with our growing community.
          </p>
        </div>
        <MemberForm />
      </motion.div>

      {/* ── Content ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="overflow-hidden rounded-2xl border border-border/40 bg-card shadow-sm">
          {/* Table Header area */}
          <div className="flex flex-col gap-4 border-b border-border/40 bg-muted/20 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-blue-500">
              <Users className="h-5 w-5" />
              <h2 className="font-semibold text-foreground">All Members</h2>
              <span className="ml-2 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-bold text-blue-500">
                {filteredMembers.length}
              </span>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search members..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-input bg-background/50 py-2 pl-9 pr-4 text-sm outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500 sm:w-64"
              />
            </div>
          </div>

          {filteredMembers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold">No members found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {search
                  ? "Try adjusting your search query."
                  : "Get started by adding your first member."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/30 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="hidden px-6 py-4 sm:table-cell">Contact</th>
                    <th className="hidden px-6 py-4 lg:table-cell">Joined</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {filteredMembers.map((member: Member) => (
                    <tr
                      key={member.id}
                      className="group transition-colors hover:bg-muted/20"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-sm font-bold text-blue-500">
                            {member.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground transition-colors group-hover:text-blue-500">
                              {member.name}
                            </p>
                            <p className="text-xs text-muted-foreground sm:hidden">
                              {member.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="hidden px-6 py-4 sm:table-cell">
                        <div className="flex flex-col gap-1 text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Mail className="h-3.5 w-3.5" />
                            <a
                              href={`mailto:${member.email}`}
                              className="hover:text-indigo-500 hover:underline"
                            >
                              {member.email}
                            </a>
                          </div>
                          {member.phone && (
                            <div className="flex items-center gap-1.5">
                              <Phone className="h-3.5 w-3.5" />
                              <a
                                href={`tel:${member.phone}`}
                                className="hover:text-indigo-500 hover:underline"
                              >
                                {member.phone}
                              </a>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="hidden px-6 py-4 lg:table-cell">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(member.createdAt)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/members/${member.id}`}
                            className="inline-flex h-8 items-center justify-center rounded-lg border border-border/40 bg-background px-3 text-xs font-medium text-muted-foreground transition-colors hover:border-blue-500/30 hover:bg-blue-500/10 hover:text-blue-500"
                            title="Edit"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Link>
                          <DeleteButton
                            message="Are you sure you want to delete this member?"
                            onDelete={() => handleDelete(member.id)}
                            isLoading={deleteMemberMutation.isPending}
                          />
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
