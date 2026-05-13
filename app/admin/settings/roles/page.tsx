"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useProfiles, useUpdateProfileRole } from "@/hooks/use-profiles";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { AlertCircle, Search, Shield, User, Camera, ShieldCheck } from "lucide-react";
import type { Profile } from "@/types/models";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export default function RolesManagementPage() {
  const [search, setSearch] = useState("");
  const { data: profiles, isLoading, error } = useProfiles();
  const { role: currentUserRole, loading: authLoading } = useAuth();
  const updateRoleMutation = useUpdateProfileRole();

  const handleRoleChange = async (id: string, newRole: string) => {
    try {
      await updateRoleMutation.mutateAsync({ id, role: newRole });
      toast.success(`Role updated to ${newRole}`);
    } catch (error) {
      toast.error("Failed to update role");
    }
  };

  const filteredProfiles =
    profiles?.filter(
      (profile: Profile) =>
        profile.name?.toLowerCase().includes(search.toLowerCase()) ||
        profile.email?.toLowerCase().includes(search.toLowerCase())
    ) || [];

  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500/30 border-t-blue-500" />
          <p className="text-sm font-medium text-muted-foreground">
            Loading roles...
          </p>
        </div>
      </div>
    );
  }

  if (currentUserRole !== "admin") {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-500/10 text-red-500">
          <AlertCircle className="h-10 w-10" />
        </div>
        <h2 className="mt-6 text-2xl font-bold tracking-tight">Access Denied</h2>
        <p className="mt-2 max-w-sm text-muted-foreground">
          You do not have the required permissions to manage roles. Please contact an administrator.
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
            Error loading profiles. Please try again.
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
          <h1 className="text-3xl font-bold tracking-tight">Roles Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Assign and manage access levels for registered users.
          </p>
        </div>
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
            <div className="flex items-center gap-2 text-indigo-500">
              <ShieldCheck className="h-5 w-5" />
              <h2 className="font-semibold text-foreground">All Users</h2>
              <span className="ml-2 rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs font-bold text-indigo-500">
                {filteredProfiles.length}
              </span>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search users..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-input bg-background/50 py-2 pl-9 pr-4 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 sm:w-64"
              />
            </div>
          </div>

          {filteredProfiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-500">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold">No users found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {search
                  ? "Try adjusting your search query."
                  : "There are no registered users yet."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/30 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="hidden px-6 py-4 sm:table-cell">Joined</th>
                    <th className="px-6 py-4">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {filteredProfiles.map((profile: Profile) => (
                    <tr
                      key={profile.id}
                      className="group transition-colors hover:bg-muted/20"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-sm font-bold text-indigo-500">
                            {profile.name ? profile.name.charAt(0).toUpperCase() : <User className="h-5 w-5" />}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground transition-colors group-hover:text-indigo-500">
                              {profile.name || "Unknown"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {profile.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="hidden px-6 py-4 sm:table-cell">
                        <span className="text-muted-foreground">
                          {formatDate(profile.createdAt)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative">
                          <select
                            disabled={updateRoleMutation.isPending}
                            value={profile.role}
                            onChange={(e) => handleRoleChange(profile.id, e.target.value)}
                            className="w-32 appearance-none rounded-lg border border-border/40 bg-background px-3 py-2 text-sm font-medium outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
                          >
                            <option value="admin">Admin</option>
                            <option value="media">Media</option>
                            <option value="member">Member</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                            <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
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
