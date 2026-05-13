"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { formatDate } from "@/lib/utils";
import { DeleteButton } from "@/components/admin/delete-button";
import { usePrayerRequests, useDeletePrayerRequest, useUpdatePrayerRequest, useAuth } from "@/hooks";
import { toast } from "sonner";
import type { PrayerRequest } from "@/types/models";
import {
  Heart,
  Pencil,
  AlertCircle,
  Search,
  Mail,
  Calendar,
  Eye,
  CheckCircle2,
  Clock,
  Trash2,
  MoreVertical,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";

export default function AdminPrayerRequestsPage() {
  const [search, setSearch] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<PrayerRequest | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const { data, isLoading, error } = usePrayerRequests({ page: 1, limit: 100 });
  const { role, loading: authLoading } = useAuth();
  const deleteMutation = useDeletePrayerRequest();
  const updateMutation = useUpdatePrayerRequest();

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Prayer request deleted successfully");
    } catch (error) {
      toast.error("Failed to delete prayer request");
    }
  };

  const handleStatusUpdate = async (id: string, status: "pending" | "prayed" | "answered") => {
    try {
      await updateMutation.mutateAsync({ id, data: { status } });
      if (selectedRequest?.id === id) {
        setSelectedRequest({ ...selectedRequest, status });
      }
      toast.success(`Status updated to ${status}`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const filteredRequests =
    data?.data?.filter(
      (req: PrayerRequest) =>
        (req.name?.toLowerCase().includes(search.toLowerCase()) || "") ||
        (req.email?.toLowerCase().includes(search.toLowerCase()) || "") ||
        req.request.toLowerCase().includes(search.toLowerCase()),
    ) || [];

  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-rose-500/30 border-t-rose-500" />
          <p className="text-sm font-medium text-muted-foreground">
            Loading prayer requests…
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
            Error loading prayer requests. Please try again.
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
          <h1 className="text-3xl font-bold tracking-tight">Prayer Requests</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Lifeline of the community — interceding for one another.
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
            <div className="flex items-center gap-2 text-rose-600">
              <Heart className="h-5 w-5" />
              <h2 className="font-semibold text-foreground">All Requests</h2>
              <span className="ml-2 rounded-full bg-rose-500/10 px-2.5 py-0.5 text-xs font-bold text-rose-700 border border-rose-500/20">
                {filteredRequests.length}
              </span>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search requests..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-input bg-background py-2 pl-9 pr-4 text-sm text-foreground outline-none transition-all focus:border-rose-500 focus:ring-1 focus:ring-rose-500/20 sm:w-64"
              />
            </div>
          </div>

          {filteredRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/10 text-rose-500">
                <Heart className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold">No requests found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {search
                  ? "Try adjusting your search query."
                  : "No prayer requests have been submitted yet."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  <tr>
                    <th className="px-6 py-4 font-bold">Requester</th>
                    <th className="hidden px-6 py-4 md:table-cell font-bold">Status</th>
                    <th className="hidden px-6 py-4 lg:table-cell font-bold">Submitted</th>
                    <th className="sticky right-0 z-10 bg-muted/90 px-6 py-4 text-right font-bold backdrop-blur-sm">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredRequests.map((req: PrayerRequest, index: number) => (
                    <tr
                      key={req.id}
                      className="group transition-colors hover:bg-muted/30"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold border ${req.isAnonymous ? 'bg-slate-50 border-slate-100 text-slate-600' : 'bg-rose-50 border-rose-100 text-rose-700'}`}>
                            {req.isAnonymous ? '?' : (req.name?.charAt(0).toUpperCase() || 'U')}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground transition-colors group-hover:text-rose-600">
                              {req.isAnonymous ? 'Anonymous' : (req.name || 'Unknown')}
                            </p>
                            {!req.isAnonymous && req.email && (
                              <p className="text-xs text-muted-foreground">
                                {req.email}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="hidden px-6 py-4 md:table-cell">
                        <div className="flex items-center">
                           <StatusBadge status={req.status} />
                        </div>
                      </td>
                      <td className="hidden px-6 py-4 lg:table-cell">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(req.createdAt)}</span>
                        </div>
                      </td>
                      <td className={`sticky right-0 px-6 py-4 text-right transition-colors bg-card/95 backdrop-blur-sm group-hover:bg-muted/50 ${activeMenuId === req.id ? 'z-30' : 'z-10'}`}>
                        <div className="flex items-center justify-end gap-2">
                           <div className="relative">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveMenuId(activeMenuId === req.id ? null : req.id);
                                }}
                                className={`p-2 rounded-lg transition-colors ${activeMenuId === req.id ? 'bg-muted text-foreground' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}`}
                              >
                                <MoreVertical className="h-4 w-4" />
                              </button>
                              
                              {activeMenuId === req.id && (
                                <>
                                  <div 
                                    className="fixed inset-0 z-10" 
                                    onClick={() => setActiveMenuId(null)}
                                  />
                                  <div className={`absolute right-0 z-20 w-40 overflow-hidden rounded-xl border border-border bg-card shadow-lg ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-100 ${
                                    index > filteredRequests.length - 4 && filteredRequests.length > 4 ? 'bottom-full mb-1' : 'top-full mt-1'
                                  }`}>
                                    <button 
                                      onClick={() => {
                                        setSelectedRequest(req);
                                        setActiveMenuId(null);
                                      }}
                                      className="flex w-full items-center gap-2 px-4 py-2.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                                    >
                                      <Eye className="h-3.5 w-3.5" /> View Details
                                    </button>
                                    <div className="h-px bg-border my-1" />
                                    <button 
                                      onClick={() => {
                                        handleStatusUpdate(req.id, 'pending');
                                        setActiveMenuId(null);
                                      }}
                                      className="flex w-full items-center gap-2 px-4 py-2.5 text-xs font-medium text-amber-600 hover:bg-amber-50 transition-colors hover:text-white"
                                    >
                                      <Clock className="h-3.5 w-3.5" /> Mark Pending
                                    </button>
                                    <button 
                                      onClick={() => {
                                        handleStatusUpdate(req.id, 'prayed');
                                        setActiveMenuId(null);
                                      }}
                                      className="flex w-full items-center gap-2 px-4 py-2.5 text-xs font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                                    >
                                      <CheckCircle2 className="h-3.5 w-3.5" /> Mark Prayed
                                    </button>
                                    <button 
                                      onClick={() => {
                                        handleStatusUpdate(req.id, 'answered');
                                        setActiveMenuId(null);
                                      }}
                                      className="flex w-full items-center gap-2 px-4 py-2.5 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                                    >
                                      <Heart className="h-3.5 w-3.5" /> Mark Answered
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>

                           <button 
                             onClick={() => setSelectedRequest(req)}
                             className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors hidden md:flex"
                             title="Quick View"
                           >
                             <Eye className="h-4 w-4" />
                           </button>

                           <div className="hidden sm:flex">
                             <DeleteButton
                               message="Are you sure you want to delete this prayer request?"
                               onDelete={() => handleDelete(req.id)}
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
          )}
        </div>
      </motion.div>

      {/* ── View Modal ── */}
      <Modal
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        title="Prayer Request Details"
        maxWidth="max-w-2xl"
      >
        {selectedRequest && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl text-xl font-bold ${selectedRequest.isAnonymous ? 'bg-slate-500/10 text-slate-500' : 'bg-rose-500/10 text-rose-500'}`}>
                  {selectedRequest.isAnonymous ? '?' : (selectedRequest.name?.charAt(0).toUpperCase() || 'U')}
                </div>
                <div>
                  <h4 className="text-lg font-bold">
                    {selectedRequest.isAnonymous ? 'Anonymous Request' : (selectedRequest.name || 'Unknown')}
                  </h4>
                  {!selectedRequest.isAnonymous && selectedRequest.email && (
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Mail className="h-3.5 w-3.5" />
                      {selectedRequest.email}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <StatusBadge status={selectedRequest.status} />
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  {formatDate(selectedRequest.createdAt)}
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-muted/30 p-6">
              <p className="whitespace-pre-wrap leading-relaxed text-foreground">
                {selectedRequest.request}
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-border/40 pt-6">
              <div className="flex items-center gap-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions:</p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleStatusUpdate(selectedRequest.id, 'pending')}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${selectedRequest.status === 'pending' ? 'bg-amber-500 text-white' : 'bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white'}`}
                  >
                    Pending
                  </button>
                  <button 
                    onClick={() => handleStatusUpdate(selectedRequest.id, 'prayed')}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${selectedRequest.status === 'prayed' ? 'bg-blue-500 text-white' : 'bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white'}`}
                  >
                    Prayed
                  </button>
                  <button 
                    onClick={() => handleStatusUpdate(selectedRequest.id, 'answered')}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${selectedRequest.status === 'answered' ? 'bg-emerald-500 text-white' : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white'}`}
                  >
                    Answered
                  </button>
                </div>
              </div>
              
              <DeleteButton
                message="Permanently delete this prayer request?"
                onDelete={async () => {
                  await handleDelete(selectedRequest.id);
                  setSelectedRequest(null);
                }}
                isLoading={deleteMutation.isPending}
              />
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
    prayed: { 
      label: "Prayed Over", 
      class: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      icon: CheckCircle2
    },
    answered: { 
      label: "Answered", 
      class: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      icon: Heart
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
