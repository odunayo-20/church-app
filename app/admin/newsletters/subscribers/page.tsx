"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { formatDate } from "@/lib/utils";
import { DeleteButton } from "@/components/admin/delete-button";
import { 
  useNewsletterSubscribers, 
  useDeleteSubscriber,
  useSubscribe,
  useAuth 
} from "@/hooks";
import { toast } from "sonner";
import type { NewsletterSubscriber } from "@/types/models";
import {
  Users,
  Search,
  Calendar,
  Plus,
  CheckCircle2,
  XCircle,
  MoreVertical,
  UserPlus,
  Mail
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { newsletterSubscriberSchema } from "@/lib/validations";
import Link from "next/link";

export default function AdminSubscribersPage() {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const { data, isLoading, error } = useNewsletterSubscribers({ page: 1, limit: 100 });
  const { loading: authLoading } = useAuth();
  
  const subscribeMutation = useSubscribe();
  const deleteMutation = useDeleteSubscriber();

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(newsletterSubscriberSchema),
    defaultValues: {
      email: ""
    }
  });

  const onSubmit = async (formData: { email: string }) => {
    try {
      await subscribeMutation.mutateAsync(formData.email);
      toast.success("Subscriber added successfully");
      setIsModalOpen(false);
      reset();
    } catch (error) {
      toast.error("Failed to add subscriber");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Subscriber removed successfully");
    } catch (error) {
      toast.error("Failed to remove subscriber");
    }
  };

  const filteredSubscribers =
    data?.data?.filter(
      (sub: NewsletterSubscriber) =>
        sub.email.toLowerCase().includes(search.toLowerCase()),
    ) || [];

  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500/30 border-t-amber-500" />
          <p className="text-sm font-medium text-muted-foreground">
            Loading subscribers…
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex items-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-6 py-4 text-red-500">
          <p className="text-sm font-semibold">
            Error loading subscribers. Please try again.
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
          <h1 className="text-3xl font-bold tracking-tight">Newsletter Subscribers</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage the list of people who have subscribed to your newsletters.
          </p>
        </div>
        <button
          onClick={() => {
            reset();
            setIsModalOpen(true);
          }}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 text-sm font-bold text-white shadow-lg shadow-amber-500/25 transition-all hover:bg-amber-600 active:scale-95"
        >
          <UserPlus className="h-4 w-4" />
          Add Subscriber
        </button>
      </motion.div>

      {/* ── Tabs ── */}
      <div className="flex border-b border-border">
        <div className="flex gap-8">
          <Link
            href="/admin/newsletters"
            className="pb-4 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Newsletters
            </div>
          </Link>
          <button
            className="border-b-2 border-amber-500 pb-4 text-sm font-bold text-amber-600"
          >
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Subscribers
            </div>
          </button>
        </div>
      </div>

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
              <Users className="h-5 w-5" />
              <h2 className="font-semibold text-foreground">Active Members</h2>
              <span className="ml-2 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-amber-700 border border-amber-500/20">
                {filteredSubscribers.length}
              </span>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-input bg-background py-2 pl-9 pr-4 text-sm text-foreground outline-none transition-all focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 sm:w-64"
              />
            </div>
          </div>

          {filteredSubscribers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
                <Mail className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold">No subscribers found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {search
                  ? "Try adjusting your search query."
                  : "Your subscriber list is currently empty."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto pb-32">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  <tr>
                    <th className="px-6 py-4 font-bold">Email</th>
                    <th className="px-6 py-4 font-bold">Status</th>
                    <th className="hidden px-6 py-4 lg:table-cell font-bold">Joined Date</th>
                    <th className="sticky right-0 z-10 bg-muted/50 px-6 py-4 text-right font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredSubscribers.map((sub: NewsletterSubscriber, index: number) => (
                    <tr
                      key={sub.id}
                      className="group transition-colors hover:bg-muted/30"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold border bg-amber-50 border-amber-100 text-amber-700">
                            {sub.email.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground transition-colors group-hover:text-amber-600">
                              {sub.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                         <StatusBadge status={sub.status} />
                      </td>
                      <td className="hidden px-6 py-4 lg:table-cell">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(sub.createdAt)}</span>
                        </div>
                      </td>
                      <td className={`sticky right-0 px-6 py-4 text-right transition-colors bg-card group-hover:bg-muted/30 ${activeMenuId === sub.id ? 'z-30' : 'z-10'}`}>
                        <div className="flex items-center justify-end gap-2">
                           <div className="relative">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveMenuId(activeMenuId === sub.id ? null : sub.id);
                                }}
                                className={`p-2 rounded-lg transition-colors ${activeMenuId === sub.id ? 'bg-muted text-foreground' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}`}
                              >
                                <MoreVertical className="h-4 w-4" />
                              </button>
                              
                              {activeMenuId === sub.id && (
                                <>
                                  <div 
                                    className="fixed inset-0 z-10" 
                                    onClick={() => setActiveMenuId(null)}
                                  />
                                  <div className={`absolute right-0 z-20 w-40 overflow-hidden rounded-xl border border-border bg-card shadow-lg ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-100 ${
                                    index > filteredSubscribers.length - 4 && filteredSubscribers.length > 4 ? 'bottom-full mb-1' : 'top-full mt-1'
                                  }`}>
                                    <button 
                                      onClick={() => {
                                        window.location.href = `mailto:${sub.email}`;
                                        setActiveMenuId(null);
                                      }}
                                      className="flex w-full items-center gap-2 px-4 py-2.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                                    >
                                      <Mail className="h-3.5 w-3.5" /> Send Individual Email
                                    </button>
                                    <div className="h-px bg-border my-1" />
                                    <button 
                                      onClick={() => {
                                        handleDelete(sub.id);
                                        setActiveMenuId(null);
                                      }}
                                      className="flex w-full items-center gap-2 px-4 py-2.5 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                                    >
                                      <XCircle className="h-3.5 w-3.5" /> Remove Subscriber
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>

                           <DeleteButton
                             message="Are you sure you want to remove this subscriber?"
                             onDelete={() => handleDelete(sub.id)}
                             isLoading={deleteMutation.isPending}
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

      {/* ── Add Subscriber Modal ── */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          reset();
        }}
        title="Add Subscriber"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Email Address</label>
            <input
              {...register("email")}
              type="email"
              placeholder="e.g. member@example.com"
              className="w-full rounded-xl border border-input bg-background p-3 text-sm text-foreground outline-none transition-all focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20"
            />
            {errors.email && <p className="text-xs text-rose-500 font-medium">{errors.email.message as string}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="rounded-xl px-6 py-2.5 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={subscribeMutation.isPending}
              className="rounded-xl bg-amber-500 px-8 py-2.5 text-sm font-bold text-white shadow-lg shadow-amber-500/25 transition-all hover:bg-amber-600 disabled:opacity-50"
            >
              {subscribeMutation.isPending ? "Adding..." : "Add Subscriber"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const configs: Record<string, { label: string; class: string; icon: any }> = {
    active: { 
      label: "Active", 
      class: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
      icon: CheckCircle2
    },
    unsubscribed: { 
      label: "Unsubscribed", 
      class: "bg-rose-500/10 text-rose-600 border-rose-500/20",
      icon: XCircle
    },
  };

  const config = configs[status] || configs.active;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${config.class}`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}
