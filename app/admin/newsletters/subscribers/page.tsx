"use client";

import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { formatDate } from "@/lib/utils";
import { useNewsletterSubscribers, useDeleteSubscriber, useSubscribe, useAuth } from "@/hooks";
import { toast } from "sonner";
import type { NewsletterSubscriber } from "@/types/models";
import { Users, Search, Calendar, CheckCircle2, XCircle, MoreVertical, UserPlus, Mail, AlertCircle, Trash2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { newsletterSubscriberSchema } from "@/lib/validations";
import Link from "next/link";

export default function AdminSubscribersPage() {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const { data, isLoading, error } = useNewsletterSubscribers({ page: 1, limit: 100 });
  const { loading: authLoading } = useAuth();
  const subscribeMutation = useSubscribe();
  const deleteMutation = useDeleteSubscriber();

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(newsletterSubscriberSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (formData: { email: string }) => {
    try {
      await subscribeMutation.mutateAsync(formData.email);
      toast.success("Subscriber added successfully");
      setIsModalOpen(false);
      reset();
    } catch {
      toast.error("Failed to add subscriber");
    }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await deleteMutation.mutateAsync(deleteTargetId);
      toast.success("Subscriber removed successfully");
      setDeleteTargetId(null);
    } catch {
      toast.error("Failed to remove subscriber");
    }
  };

  const filteredSubscribers =
    data?.data?.filter((sub: NewsletterSubscriber) =>
      sub.email.toLowerCase().includes(search.toLowerCase()),
    ) || [];

  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500/30 border-t-amber-500" />
          <p className="text-sm font-medium text-muted-foreground">Loading subscribers…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex items-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-6 py-4 text-red-500">
          <AlertCircle className="h-5 w-5" />
          <p className="text-sm font-semibold">Error loading subscribers. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Newsletter Subscribers</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage the list of people who have subscribed to your newsletters.
          </p>
        </div>
        <button
          onClick={() => { reset(); setIsModalOpen(true); }}
          className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-xl bg-amber-500 px-6 text-sm font-bold text-white shadow-lg shadow-amber-500/25 transition-all hover:bg-amber-600 active:scale-95 sm:self-auto"
        >
          <UserPlus className="h-4 w-4" />
          Add Subscriber
        </button>
      </motion.div>

      {/* ── Tabs ── */}
      <div className="flex border-b border-border">
        <div className="flex gap-8">
          <Link href="/admin/newsletters" className="pb-4 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Newsletters
            </div>
          </Link>
          <button className="border-b-2 border-amber-500 pb-4 text-sm font-bold text-amber-600">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Subscribers
            </div>
          </button>
        </div>
      </div>

      {/* ── Table Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
        className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
      >
        {/* Toolbar */}
        <div className="flex flex-col gap-3 border-b border-border bg-muted/20 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10">
              <Users className="h-4 w-4 text-amber-600" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">Active Members</h2>
              <p className="text-[11px] text-muted-foreground">{filteredSubscribers.length} subscribers</p>
            </div>
          </div>
          <div className="relative sm:w-64">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-full rounded-lg border border-input bg-background/60 pl-8 pr-3 text-sm outline-none transition focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30"
            />
          </div>
        </div>

        {filteredSubscribers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
              <Mail className="h-7 w-7" />
            </div>
            <h3 className="text-base font-bold">No subscribers found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {search ? "Try adjusting your search query." : "Your subscriber list is currently empty."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/40 bg-muted/30">
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground sm:px-5">Email</th>
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground sm:px-5">Status</th>
                  <th className="hidden px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground lg:table-cell">Joined</th>
                  <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground sm:px-5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {filteredSubscribers.map((sub: NewsletterSubscriber) => (
                  <tr key={sub.id} className="group transition-colors hover:bg-muted/20">
                    <td className="px-4 py-3 sm:px-5">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-amber-200 bg-amber-50 text-xs font-bold text-amber-700">
                          {sub.email.charAt(0).toUpperCase()}
                        </div>
                        <span className="truncate text-[13px] font-semibold text-foreground transition-colors group-hover:text-amber-600 max-w-[160px] sm:max-w-xs">
                          {sub.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 sm:px-5">
                      <StatusBadge status={sub.status} />
                    </td>
                    <td className="hidden px-4 py-3 lg:table-cell">
                      <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5 shrink-0" />
                        {formatDate(sub.createdAt)}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right sm:px-5">
                      <SubscriberActionsMenu
                        email={sub.email}
                        onDelete={() => setDeleteTargetId(sub.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* ── Add Subscriber Modal ── */}
      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); reset(); }} title="Add Subscriber" maxWidth="max-w-md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email Address</label>
            <input
              {...register("email")}
              type="email"
              placeholder="e.g. member@example.com"
              className="h-10 w-full rounded-xl border border-input bg-background px-4 text-sm outline-none transition focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30"
            />
            {errors.email && <p className="text-xs font-medium text-rose-500">{errors.email.message as string}</p>}
          </div>
          <div className="flex justify-end gap-3 border-t border-border pt-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl px-5 py-2.5 text-sm font-semibold text-muted-foreground transition hover:text-foreground">Cancel</button>
            <button type="submit" disabled={subscribeMutation.isPending} className="rounded-xl bg-amber-500 px-7 py-2.5 text-sm font-bold text-white shadow-md shadow-amber-500/25 transition hover:bg-amber-600 disabled:opacity-50">
              {subscribeMutation.isPending ? "Adding…" : "Add Subscriber"}
            </button>
          </div>
        </form>
      </Modal>

      {/* ── Delete Confirmation Modal ── */}
      <Modal isOpen={!!deleteTargetId} onClose={() => setDeleteTargetId(null)} title="Remove Subscriber" maxWidth="max-w-sm">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 text-rose-600">
            <Trash2 className="h-7 w-7" />
          </div>
          <h3 className="text-lg font-bold">Are you sure?</h3>
          <p className="mt-2 text-sm text-muted-foreground">This subscriber will be permanently removed from your mailing list.</p>
          <div className="mt-6 flex gap-3">
            <button onClick={() => setDeleteTargetId(null)} className="flex-1 rounded-xl border border-input py-2.5 text-sm font-semibold transition hover:bg-muted">Cancel</button>
            <button onClick={handleDelete} disabled={deleteMutation.isPending} className="flex-1 rounded-xl bg-rose-600 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:opacity-50">
              {deleteMutation.isPending ? "Removing…" : "Remove"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

/* ── Portal-based Actions Menu ── */
function SubscriberActionsMenu({ email, onDelete }: { email: string; onDelete: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});
  const btnRef = useRef<HTMLButtonElement>(null);

  const openMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    setMenuStyle({
      position: "fixed",
      right: window.innerWidth - rect.right,
      ...(spaceBelow < 100 ? { bottom: window.innerHeight - rect.top + 4 } : { top: rect.bottom + 4 }),
      zIndex: 9999,
    });
    setIsOpen((v) => !v);
  };

  return (
    <div className="relative inline-block">
      <button
        ref={btnRef}
        onClick={openMenu}
        className={`rounded-lg p-1.5 transition-colors ${isOpen ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {isOpen && typeof document !== "undefined" && createPortal(
        <>
          <div className="fixed inset-0" style={{ zIndex: 9998 }} onClick={() => setIsOpen(false)} />
          <div style={menuStyle} className="w-44 overflow-hidden rounded-xl border border-border bg-card shadow-xl ring-1 ring-black/5">
            <button
              onClick={() => { window.location.href = `mailto:${email}`; setIsOpen(false); }}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <Mail className="h-3.5 w-3.5" /> Send Email
            </button>
            <div className="my-1 h-px bg-border" />
            <button
              onClick={() => { onDelete(); setIsOpen(false); }}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-rose-600 transition hover:bg-rose-50"
            >
              <Trash2 className="h-3.5 w-3.5" /> Remove Subscriber
            </button>
          </div>
        </>,
        document.body,
      )}
    </div>
  );
}

/* ── StatusBadge ── */
function StatusBadge({ status }: { status: string }) {
  const configs: Record<string, { label: string; cls: string; Icon: React.ElementType }> = {
    active: { label: "Active", cls: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20", Icon: CheckCircle2 },
    unsubscribed: { label: "Unsubscribed", cls: "bg-rose-500/10 text-rose-600 border-rose-500/20", Icon: XCircle },
  };
  const config = configs[status] ?? configs.active;
  const { Icon } = config;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${config.cls}`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}
