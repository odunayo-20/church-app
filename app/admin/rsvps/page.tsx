"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { formatDate } from "@/lib/utils";
import { DeleteButton } from "@/components/admin/delete-button";
import { useRsvps, useUpdateRsvpStatus, useDeleteRsvp, useAuth } from "@/hooks";
import { toast } from "sonner";
import type { Rsvp } from "@/types/models";
import {
  Globe,
  Search,
  Mail,
  Calendar,
  Eye,
  CheckCircle2,
  Clock,
  XCircle,
  MoreVertical,
  AlertCircle,
  Users,
  Plus,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { useEvents, useCreateRsvp } from "@/hooks";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { rsvpSchema, type RsvpInput } from "@/lib/validations";

export default function AdminRsvpsPage() {
  const searchParams = useSearchParams();
  const eventId = searchParams.get("eventId") || undefined;
  const [search, setSearch] = useState("");
  const [selectedRsvp, setSelectedRsvp] = useState<(Rsvp & { event: { title: string } }) | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  
  const { data, isLoading, error } = useRsvps({ page: 1, limit: 100, eventId });
  const { data: eventsData } = useEvents({ page: 1, limit: 50, upcoming: true });
  const { loading: authLoading } = useAuth();
  
  const deleteMutation = useDeleteRsvp();
  const updateMutation = useUpdateRsvpStatus();
  const createMutation = useCreateRsvp();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<RsvpInput & { eventId: string }>({
    resolver: zodResolver(rsvpSchema.extend({ eventId: z.string().min(1, "Event is required") })),
    defaultValues: {
      guests: 1,
      eventId: eventId || "",
    }
  });

  const onSubmit = async (formData: RsvpInput & { eventId: string }) => {
    try {
      const { eventId: targetEventId, ...rsvpData } = formData;
      await createMutation.mutateAsync({ eventId: targetEventId, data: rsvpData });
      toast.success("RSVP created successfully");
      setIsCreateModalOpen(false);
      reset();
    } catch (error) {
      toast.error("Failed to create RSVP");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("RSVP deleted successfully");
    } catch (error) {
      toast.error("Failed to delete RSVP");
    }
  };

  const handleStatusUpdate = async (id: string, status: Rsvp["status"]) => {
    try {
      await updateMutation.mutateAsync({ id, status });
      if (selectedRsvp?.id === id) {
        setSelectedRsvp({ ...selectedRsvp, status });
      }
      toast.success(`Status updated to ${status}`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const filteredRsvps =
    data?.data?.filter(
      (rsvp: any) =>
        rsvp.name.toLowerCase().includes(search.toLowerCase()) ||
        rsvp.email.toLowerCase().includes(search.toLowerCase()) ||
        rsvp.event.title.toLowerCase().includes(search.toLowerCase()),
    ) || [];

  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500/30 border-t-amber-500" />
          <p className="text-sm font-medium text-muted-foreground">
            Loading RSVPs…
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
            Error loading RSVPs. Please try again.
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
          <h1 className="text-3xl font-bold tracking-tight text-foreground">RSVP Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track and manage event attendance across the community.
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-amber-600 px-5 text-sm font-semibold text-white transition-all hover:bg-amber-700 active:scale-95 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Add RSVP
        </button>
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
              <Globe className="h-5 w-5" />
              <h2 className="font-semibold text-foreground">All RSVPs</h2>
              <span className="ml-2 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-amber-700 border border-amber-500/20">
                {filteredRsvps.length}
              </span>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name, email or event..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-input bg-background py-2 pl-9 pr-4 text-sm text-foreground outline-none transition-all focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 sm:w-80"
              />
            </div>
          </div>

          {filteredRsvps.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground border border-border">
                <Globe className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-foreground">No RSVPs found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {search
                  ? "Try adjusting your search query."
                  : "No RSVPs have been submitted yet."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-foreground/80">
                <thead className="bg-muted/50 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  <tr>
                    <th className="px-6 py-4 font-bold">Attendee</th>
                    <th className="hidden px-6 py-4 md:table-cell font-bold">Event</th>
                    <th className="hidden px-6 py-4 lg:table-cell font-bold">Status</th>
                    <th className="hidden px-6 py-4 xl:table-cell font-bold">Guests</th>
                    <th className="sticky right-0 z-10 bg-muted/90 px-6 py-4 text-right font-bold backdrop-blur-sm">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredRsvps.map((rsvp: any, index: number) => (
                    <tr
                      key={rsvp.id}
                      className="group transition-colors hover:bg-muted/30"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700 font-bold border border-amber-200">
                            {rsvp.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground transition-colors group-hover:text-amber-600">
                              {rsvp.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {rsvp.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="hidden px-6 py-4 md:table-cell">
                        <div className="flex flex-col gap-0.5">
                          <p className="font-medium text-foreground line-clamp-1">{rsvp.event.title}</p>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(rsvp.createdAt)}</span>
                          </div>
                        </div>
                      </td>
                      <td className="hidden px-6 py-4 lg:table-cell">
                        <StatusBadge status={rsvp.status} />
                      </td>
                      <td className="hidden px-6 py-4 xl:table-cell">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>{rsvp.guests} guest{rsvp.guests !== 1 ? 's' : ''}</span>
                        </div>
                      </td>
                      <td className={`sticky right-0 px-6 py-4 text-right transition-colors bg-card/95 backdrop-blur-sm group-hover:bg-muted/50 ${activeMenuId === rsvp.id ? 'z-30' : 'z-10'}`}>
                        <div className="flex items-center justify-end gap-2">
                           <div className="relative">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveMenuId(activeMenuId === rsvp.id ? null : rsvp.id);
                                }}
                                className={`p-2 rounded-lg transition-colors ${activeMenuId === rsvp.id ? 'bg-muted text-foreground' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}`}
                              >
                                <MoreVertical className="h-4 w-4" />
                              </button>
                              
                              {activeMenuId === rsvp.id && (
                                <>
                                  <div 
                                    className="fixed inset-0 z-10" 
                                    onClick={() => setActiveMenuId(null)}
                                  />
                                  <div className={`absolute right-0 z-20 w-44 overflow-hidden rounded-xl border border-border bg-card shadow-lg ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-100 ${
                                    index > filteredRsvps.length - 4 && filteredRsvps.length > 4 ? 'bottom-full mb-1' : 'top-full mt-1'
                                  }`}>
                                    <button 
                                      onClick={() => {
                                        setSelectedRsvp(rsvp);
                                        setActiveMenuId(null);
                                      }}
                                      className="flex w-full items-center gap-2 px-4 py-2.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                                    >
                                      <Eye className="h-3.5 w-3.5" /> View Details
                                    </button>
                                    <div className="h-px bg-border my-1" />
                                    <button 
                                      onClick={() => {
                                        handleStatusUpdate(rsvp.id, 'confirmed');
                                        setActiveMenuId(null);
                                      }}
                                      className="flex w-full items-center gap-2 px-4 py-2.5 text-xs font-medium text-emerald-600 hover:bg-emerald-50 transition-colors hover:text-white"
                                    >
                                      <CheckCircle2 className="h-3.5 w-3.5" /> Confirm RSVP
                                    </button>
                                    <button 
                                      onClick={() => {
                                        handleStatusUpdate(rsvp.id, 'pending');
                                        setActiveMenuId(null);
                                      }}
                                      className="flex w-full items-center gap-2 px-4 py-2.5 text-xs font-medium text-amber-600 hover:bg-amber-50 transition-colors hover:text-white"
                                    >
                                      <Clock className="h-3.5 w-3.5" /> Set Pending
                                    </button>
                                    <button 
                                      onClick={() => {
                                        handleStatusUpdate(rsvp.id, 'cancelled');
                                        setActiveMenuId(null);
                                      }}
                                      className="flex w-full items-center gap-2 px-4 py-2.5 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors hover:text-white"
                                    >
                                      <XCircle className="h-3.5 w-3.5" /> Cancel RSVP
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>

                           <button 
                             onClick={() => setSelectedRsvp(rsvp)}
                             className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors hidden md:flex"
                             title="Quick View"
                           >
                             <Eye className="h-4 w-4" />
                           </button>

                          <div className="hidden sm:flex">
                            <DeleteButton
                              message="Are you sure you want to delete this RSVP record?"
                              onDelete={() => handleDelete(rsvp.id)}
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
        isOpen={!!selectedRsvp}
        onClose={() => setSelectedRsvp(null)}
        title="RSVP Details"
        maxWidth="max-w-xl"
      >
        {selectedRsvp && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 text-2xl font-bold border border-amber-200">
                  {selectedRsvp.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-foreground">
                    {selectedRsvp.name}
                  </h4>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Mail className="h-3.5 w-3.5" />
                    {selectedRsvp.email}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <StatusBadge status={selectedRsvp.status} />
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  {formatDate(selectedRsvp.createdAt)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-muted/30 p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Event</p>
                <p className="mt-1 font-semibold text-foreground line-clamp-2">{selectedRsvp.event.title}</p>
              </div>
              <div className="rounded-2xl border border-border bg-muted/30 p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Party Size</p>
                <p className="mt-1 font-semibold text-foreground">
                  {selectedRsvp.guests} Guest{selectedRsvp.guests !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4 border-t border-border pt-6">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Update Status</p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleStatusUpdate(selectedRsvp.id, 'pending')}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all border ${selectedRsvp.status === 'pending' ? 'bg-amber-600 border-amber-600 text-white' : 'bg-amber-500/10 border-amber-500/20 text-amber-600 hover:bg-amber-600 hover:text-white'}`}
                  >
                    Pending
                  </button>
                  <button 
                    onClick={() => handleStatusUpdate(selectedRsvp.id, 'confirmed')}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all border ${selectedRsvp.status === 'confirmed' ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 hover:bg-emerald-600 hover:text-white'}`}
                  >
                    Confirm
                  </button>
                  <button 
                    onClick={() => handleStatusUpdate(selectedRsvp.id, 'cancelled')}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all border ${selectedRsvp.status === 'cancelled' ? 'bg-rose-600 border-rose-600 text-white' : 'bg-rose-500/10 border-rose-500/20 text-rose-600 hover:bg-rose-600 hover:text-white'}`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
              
              <div className="flex justify-end">
                <DeleteButton
                  message="Permanently delete this RSVP record?"
                  onDelete={async () => {
                    await handleDelete(selectedRsvp.id);
                    setSelectedRsvp(null);
                  }}
                  isLoading={deleteMutation.isPending}
                />
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Create Modal ── */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Add Manual RSVP"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Select Event</label>
            <select
              {...register("eventId")}
              className="w-full rounded-xl border border-input bg-background p-3 text-sm text-foreground outline-none focus:border-amber-500"
            >
              <option value="">Choose an event...</option>
              {eventsData?.data?.map((event: any) => (
                <option key={event.id} value={event.id}>
                  {event.title} ({formatDate(event.date)})
                </option>
              ))}
            </select>
            {errors.eventId && <p className="text-xs text-rose-600 font-medium">{errors.eventId.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Full Name</label>
            <input
              {...register("name")}
              placeholder="Attendee Name"
              className="w-full rounded-xl border border-input bg-background p-3 text-sm text-foreground outline-none focus:border-amber-500"
            />
            {errors.name && <p className="text-xs text-rose-600 font-medium">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email Address</label>
            <input
              {...register("email")}
              type="email"
              placeholder="attendee@example.com"
              className="w-full rounded-xl border border-input bg-background p-3 text-sm text-foreground outline-none focus:border-amber-500"
            />
            {errors.email && <p className="text-xs text-rose-600 font-medium">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Number of Guests</label>
            <input
              {...register("guests")}
              type="number"
              min="1"
              max="10"
              className="w-full rounded-xl border border-input bg-background p-3 text-sm text-foreground outline-none focus:border-amber-500"
            />
            {errors.guests && <p className="text-xs text-rose-600 font-medium">{errors.guests.message}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="rounded-xl px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="rounded-xl bg-amber-600 px-6 py-2 text-sm font-bold text-white shadow-sm hover:bg-amber-700 disabled:opacity-50 transition-all active:scale-95"
            >
              {createMutation.isPending ? "Adding..." : "Add Attendee"}
            </button>
          </div>
        </form>
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
    confirmed: { 
      label: "Confirmed", 
      class: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      icon: CheckCircle2
    },
    cancelled: { 
      label: "Cancelled", 
      class: "bg-rose-500/10 text-rose-400 border-rose-500/20",
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
