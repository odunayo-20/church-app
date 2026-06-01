"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { formatDate } from "@/lib/utils";
import { DeleteButton } from "@/components/admin/delete-button";
import { useTestimonies, useDeleteTestimony, useUpdateTestimony, useAuth } from "@/hooks";
import { toast } from "sonner";
import type { Testimony } from "@/types/models";
import {
  MessageSquare,
  AlertCircle,
  Search,
  Mail,
  Calendar,
  Eye,
  CheckCircle2,
  Clock,
  XCircle,
  Star,
  MoreVertical,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";

export default function AdminTestimoniesPage() {
  const [search, setSearch] = useState("");
  const [selectedTestimony, setSelectedTestimony] = useState<Testimony | null>(null);
  const [activeActionTestimony, setActiveActionTestimony] = useState<Testimony | null>(null);
  const { data, isLoading, error } = useTestimonies({ page: 1, limit: 100 });
  const { role, loading: authLoading } = useAuth();
  const deleteMutation = useDeleteTestimony();
  const updateMutation = useUpdateTestimony();

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Testimony deleted successfully");
    } catch (error) {
      toast.error("Failed to delete testimony");
    }
  };

  const handleStatusUpdate = async (id: string, status: "pending" | "approved" | "rejected") => {
    try {
      await updateMutation.mutateAsync({ id, data: { status } });
      if (selectedTestimony?.id === id) {
        setSelectedTestimony({ ...selectedTestimony, status });
      }
      toast.success(`Status updated to ${status}`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleToggleFeatured = async (id: string, currentFeatured: boolean) => {
    try {
      await updateMutation.mutateAsync({ id, data: { isFeatured: !currentFeatured } });
      if (selectedTestimony?.id === id) {
        setSelectedTestimony({ ...selectedTestimony, isFeatured: !currentFeatured });
      }
      toast.success(!currentFeatured ? "Testimony featured!" : "Testimony unfeatured!");
    } catch (error) {
      toast.error("Failed to update featured state");
    }
  };

  const filteredTestimonies =
    data?.data?.filter(
      (testimony: Testimony) =>
        testimony.name.toLowerCase().includes(search.toLowerCase()) ||
        (testimony.email?.toLowerCase().includes(search.toLowerCase()) || "") ||
        testimony.title.toLowerCase().includes(search.toLowerCase()) ||
        testimony.content.toLowerCase().includes(search.toLowerCase()),
    ) || [];

  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500/30 border-t-amber-500" />
          <p className="text-sm font-medium text-muted-foreground">
            Loading testimonies…
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex items-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-6 py-4 text-red-500">
          <AlertCircle className="h-5 w-5" />
          <p className="text-sm font-semibold">
            Error loading testimonies. Please try again.
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
          <h1 className="text-3xl font-bold tracking-tight">Testimonies</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Moderating community testimonies and featured stories of God's goodness.
          </p>
        </div>
      </motion.div>

      {/* ── Content ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          {/* Table Header area */}
          <div className="flex flex-col gap-4 border-b border-border bg-muted/30 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-amber-600">
              <MessageSquare className="h-5 w-5" />
              <h2 className="font-semibold text-foreground">All Submissions</h2>
              <span className="ml-2 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-amber-700 border border-amber-500/20">
                {filteredTestimonies.length}
              </span>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search testimonies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-input bg-background py-2 pl-9 pr-4 text-sm text-foreground outline-none transition-all focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 sm:w-64"
              />
            </div>
          </div>

          {filteredTestimonies.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
                <MessageSquare className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold">No testimonies found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {search
                  ? "Try adjusting your search query."
                  : "No testimonies have been submitted yet."}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop View Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-sm font-sans">
                  <thead className="bg-muted/50 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    <tr>
                      <th className="px-6 py-4 font-bold">Contributor</th>
                      <th className="px-6 py-4 font-bold">Title</th>
                      <th className="hidden px-6 py-4 md:table-cell font-bold">Status</th>
                      <th className="hidden px-6 py-4 md:table-cell font-bold">Featured</th>
                      <th className="hidden px-6 py-4 lg:table-cell font-bold">Submitted</th>
                      <th className="sticky right-0 z-10 bg-muted/90 px-6 py-4 text-right font-bold backdrop-blur-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredTestimonies.map((testimony: Testimony) => (
                      <tr
                        key={testimony.id}
                        className="group transition-colors hover:bg-muted/30"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold border bg-amber-50 border-amber-100 text-amber-700">
                              {testimony.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-foreground transition-colors group-hover:text-amber-600">
                                {testimony.name}
                              </p>
                              {testimony.email && (
                                <p className="text-xs text-muted-foreground">
                                  {testimony.email}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 max-w-[200px] truncate">
                          <span className="font-medium text-foreground">{testimony.title}</span>
                        </td>
                        <td className="hidden px-6 py-4 md:table-cell">
                          <div className="flex items-center">
                            <StatusBadge status={testimony.status} />
                          </div>
                        </td>
                        <td className="hidden px-6 py-4 md:table-cell">
                          <button
                            onClick={() => handleToggleFeatured(testimony.id, testimony.isFeatured)}
                            className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors ${testimony.isFeatured
                                ? "bg-amber-500/10 border-amber-500/20 border text-amber-500 hover:bg-amber-500/25"
                                : "border-border hover:bg-muted text-muted-foreground hover:text-foreground"
                              }`}
                            title={testimony.isFeatured ? "Unfeature testimony" : "Feature testimony"}
                          >
                            <Star className={`h-4 w-4 ${testimony.isFeatured ? "fill-amber-500" : ""}`} />
                          </button>
                        </td>
                        <td className="hidden px-6 py-4 lg:table-cell">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(testimony.createdAt)}</span>
                          </div>
                        </td>
                        <td className="sticky right-0 px-6 py-4 text-right transition-colors bg-card/95 backdrop-blur-sm group-hover:bg-muted/50 z-10">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveActionTestimony(testimony);
                              }}
                              className="p-2 rounded-lg transition-colors hover:bg-muted text-muted-foreground hover:text-foreground"
                              title="Actions"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </button>

                            <button
                              onClick={() => setSelectedTestimony(testimony)}
                              className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors hidden md:flex"
                              title="Quick View"
                            >
                              <Eye className="h-4 w-4" />
                            </button>

                            <div className="hidden sm:flex">
                              <DeleteButton
                                message="Are you sure you want to delete this testimony?"
                                onDelete={() => handleDelete(testimony.id)}
                                isLoading={deleteMutation.isPending}
                              />
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile View Cards */}
              <div className="block md:hidden divide-y divide-border-/40">
                {filteredTestimonies.map((testimony: Testimony) => (
                  <div key={testimony.id} className="p-4 space-y-4 hover:bg-muted/10 transition-colors">
                    {/* Contributor Avatar, Name, Email and Status */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold border bg-amber-50 border-amber-100 text-amber-700">
                          {testimony.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-semibold text-foreground truncate max-w-[150px] sm:max-w-[200px]">
                            {testimony.name}
                          </h4>
                          {testimony.email && (
                            <p className="text-xs text-muted-foreground truncate max-w-[150px] sm:max-w-[200px]">
                              {testimony.email}
                            </p>
                          )}
                        </div>
                      </div>
                      <StatusBadge status={testimony.status} />
                    </div>

                    {/* Title & Preview Content */}
                    <div className="space-y-1">
                      <h5 className="font-semibold text-sm text-foreground line-clamp-1">{testimony.title}</h5>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {testimony.content}
                      </p>
                    </div>

                    {/* Metadata & Actions Strip */}
                    <div className="flex items-center justify-between pt-2">
                      {/* Date Submitted */}
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{formatDate(testimony.createdAt)}</span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        {/* Quick View Button */}
                        <button
                          onClick={() => setSelectedTestimony(testimony)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>

                        {/* Toggle Featured Star */}
                        <button
                          onClick={() => handleToggleFeatured(testimony.id, testimony.isFeatured)}
                          className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors ${testimony.isFeatured
                              ? "bg-amber-500/10 border-amber-500/20 border text-amber-500 hover:bg-amber-500/25"
                              : "border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted"
                            }`}
                          title={testimony.isFeatured ? "Unfeature testimony" : "Feature testimony"}
                        >
                          <Star className={`h-4 w-4 ${testimony.isFeatured ? "fill-amber-500 text-amber-500" : ""}`} />
                        </button>

                        {/* Moderation Controls Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveActionTestimony(testimony);
                          }}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                          title="Actions"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>

                        {/* Delete Button */}
                        <DeleteButton
                          message="Are you sure you want to delete this testimony?"
                          onDelete={() => handleDelete(testimony.id)}
                          isLoading={deleteMutation.isPending}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </motion.div>

      {/* ── View Modal ── */}
      <Modal
        isOpen={!!selectedTestimony}
        onClose={() => setSelectedTestimony(null)}
        title="Testimony Details"
        maxWidth="max-w-2xl"
      >
        {selectedTestimony && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl text-xl font-bold bg-amber-500/10 text-amber-500">
                  {selectedTestimony.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-lg font-bold">
                    {selectedTestimony.name}
                  </h4>
                  {selectedTestimony.email && (
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Mail className="h-3.5 w-3.5" />
                      {selectedTestimony.email}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <StatusBadge status={selectedTestimony.status} />
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  {formatDate(selectedTestimony.createdAt)}
                </div>
              </div>
            </div>

            <div className="border-t border-border-/40 pt-4">
              <h3 className="text-lg font-bold text-foreground">{selectedTestimony.title}</h3>
            </div>

            <div className="rounded-2xl bg-muted/30 p-6">
              <p className="whitespace-pre-wrap leading-relaxed text-foreground">
                {selectedTestimony.content}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between border-t border-border-/40 pt-6 gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Moderation:</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatusUpdate(selectedTestimony.id, 'pending')}
                      className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${selectedTestimony.status === 'pending' ? 'bg-amber-550 text-white bg-amber-500' : 'bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white'}`}
                    >
                      Pending
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(selectedTestimony.id, 'approved')}
                      className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${selectedTestimony.status === 'approved' ? 'bg-emerald-500 text-white' : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white'}`}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(selectedTestimony.id, 'rejected')}
                      className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${selectedTestimony.status === 'rejected' ? 'bg-rose-500 text-white' : 'bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white'}`}
                    >
                      Reject
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 border-l border-border pl-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Feature:</span>
                  <button
                    onClick={() => handleToggleFeatured(selectedTestimony.id, selectedTestimony.isFeatured)}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${selectedTestimony.isFeatured ? 'bg-amber-500/20 text-amber-600 border border-amber-500/30' : 'bg-muted text-muted-foreground hover:bg-muted/70'}`}
                  >
                    <Star className={`h-3.5 w-3.5 ${selectedTestimony.isFeatured ? "fill-amber-500 text-amber-500" : ""}`} />
                    {selectedTestimony.isFeatured ? "Featured" : "Not Featured"}
                  </button>
                </div>
              </div>

              <DeleteButton
                message="Permanently delete this testimony?"
                onDelete={async () => {
                  await handleDelete(selectedTestimony.id);
                  setSelectedTestimony(null);
                }}
                isLoading={deleteMutation.isPending}
              />
            </div>
          </div>
        )}
      </Modal>

      {/* ── Actions Menu Modal ── */}
      <Modal
        isOpen={!!activeActionTestimony}
        onClose={() => setActiveActionTestimony(null)}
        title="Testimony Options"
        maxWidth="max-w-sm"
      >
        {activeActionTestimony && (
          <div className="space-y-6">
            {/* Header info */}
            <div className="flex items-center gap-3 pb-4 border-b border-border/40">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-base font-bold bg-amber-50 border border-amber-100 text-amber-700 dark:bg-amber-950/20 dark:border-amber-900/30">
                {activeActionTestimony.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <h4 className="font-semibold text-foreground truncate text-sm">
                  {activeActionTestimony.name}
                </h4>
                <p className="text-xs text-muted-foreground truncate">
                  {activeActionTestimony.title}
                </p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-2">
              <button
                onClick={() => {
                  setSelectedTestimony(activeActionTestimony);
                  setActiveActionTestimony(null);
                }}
                className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-foreground bg-muted/40 hover:bg-muted dark:hover:bg-muted/80 transition-all border border-border/30 hover:border-border"
              >
                <Eye className="h-4 w-4 text-muted-foreground" />
                View Full Details
              </button>

              <div className="h-px bg-border/40 my-1" />

              <button
                onClick={() => {
                  handleStatusUpdate(activeActionTestimony.id, 'pending');
                  setActiveActionTestimony(null);
                }}
                className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-amber-600 bg-amber-500/5 hover:bg-amber-500/10 dark:text-amber-400 dark:bg-amber-500/10 dark:hover:bg-amber-500/20 transition-all border border-transparent hover:border-amber-500/20"
              >
                <Clock className="h-4 w-4" />
                Mark Pending
              </button>

              <button
                onClick={() => {
                  handleStatusUpdate(activeActionTestimony.id, 'approved');
                  setActiveActionTestimony(null);
                }}
                className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-emerald-600 bg-emerald-500/5 hover:bg-emerald-500/10 dark:text-emerald-400 dark:bg-emerald-500/10 dark:hover:bg-emerald-500/20 transition-all border border-transparent hover:border-emerald-500/20"
              >
                <CheckCircle2 className="h-4 w-4" />
                Approve Testimony
              </button>

              <button
                onClick={() => {
                  handleStatusUpdate(activeActionTestimony.id, 'rejected');
                  setActiveActionTestimony(null);
                }}
                className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-rose-600 bg-rose-500/5 hover:bg-rose-500/10 dark:text-rose-400 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 transition-all border border-transparent hover:border-rose-500/20"
              >
                <XCircle className="h-4 w-4" />
                Reject Testimony
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const configs: Record<string, { label: string; class: string; icon: any }> = {
    pending: {
      label: "Pending",
      class: "bg-amber-500/10 text-amber-500 border-amber-500/20",
      icon: Clock
    },
    approved: {
      label: "Approved",
      class: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      icon: CheckCircle2
    },
    rejected: {
      label: "Rejected",
      class: "bg-rose-500/10 text-rose-500 border-rose-500/20",
      icon: XCircle
    },
  };

  const config = configs[status] || configs.pending;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${config.class}`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}
