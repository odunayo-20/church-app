"use client";

import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { useDonations, useDonationStats, useAuth, useDeleteDonation } from "@/hooks";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import type { Donation } from "@/types/models";
import { motion } from "framer-motion";
import {
  Search, Heart, DollarSign, Clock, AlertCircle, RefreshCcw,
  Filter, Calendar, CreditCard, ChevronDown, MoreVertical,
  Eye, Mail, Trash2, TrendingUp,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { sendDonorMessageAction } from "@/app/action/donation-actions";

const STATUS_FILTERS = [
  { label: "All Statuses", value: "" },
  { label: "Completed", value: "completed" },
  { label: "Pending", value: "pending" },
  { label: "Failed", value: "failed" },
  { label: "Refunded", value: "refunded" },
];

export default function AdminDonationsPage() {
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [messageDonation, setMessageDonation] = useState<Donation | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: donationsData, isLoading: isDonationsLoading, error: donationsError } = useDonations({ page: 1, limit: 100 });
  const { data: statsData, isLoading: isStatsLoading } = useDonationStats();
  const { role, loading: authLoading } = useAuth();
  const deleteMutation = useDeleteDonation();

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      toast.success("Donation record deleted successfully");
      setDeleteId(null);
    } catch {
      toast.error("Failed to delete donation record");
    }
  };

  if (authLoading || isDonationsLoading || isStatsLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500/30 border-t-emerald-500" />
          <p className="text-sm font-medium text-muted-foreground">Loading donations data...</p>
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
        <p className="mt-2 max-w-sm text-muted-foreground">You do not have the required permissions to view donation records.</p>
        <Link href="/admin" className="mt-8 rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  if (donationsError) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex items-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-6 py-4 text-red-500">
          <AlertCircle className="h-5 w-5" />
          <p className="text-sm font-semibold">Error loading donations. Please try again.</p>
        </div>
      </div>
    );
  }

  const donations = donationsData?.data || [];
  const filteredDonations = donations.filter((d: Donation) => {
    const matchesStatus = !status || d.status === status;
    const matchesSearch =
      !search ||
      d.reference.toLowerCase().includes(search.toLowerCase()) ||
      (d.donorName && d.donorName.toLowerCase().includes(search.toLowerCase())) ||
      (d.donorEmail && d.donorEmail.toLowerCase().includes(search.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Donations</h1>
          <p className="mt-1 text-sm text-muted-foreground">Tracking the generosity that fuels our mission and outreach.</p>
        </div>
        <div className="flex items-center gap-2 self-start rounded-xl bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-600">
          <TrendingUp className="h-4 w-4" />
          {filteredDonations.length} records
        </div>
      </motion.div>

      {/* ── Stats ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
        className="grid gap-4 grid-cols-2 lg:grid-cols-4"
      >
        <StatBox icon={<DollarSign className="h-5 w-5 text-emerald-500" />} label="Total Received" value={`₦${Number(statsData?.totalAmount || 0).toLocaleString()}`} bgColor="bg-emerald-500/10" />
        <StatBox icon={<Heart className="h-5 w-5 text-blue-500" />} label="Completed" value={statsData?.counts?.completed || 0} bgColor="bg-blue-500/10" />
        <StatBox icon={<Clock className="h-5 w-5 text-amber-500" />} label="Pending" value={statsData?.counts?.pending || 0} bgColor="bg-amber-500/10" />
        <StatBox icon={<AlertCircle className="h-5 w-5 text-rose-500" />} label="Failed/Refunded" value={(statsData?.counts?.failed || 0) + (statsData?.counts?.refunded || 0)} bgColor="bg-rose-500/10" />
      </motion.div>

      {/* ── Table Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
        className="overflow-hidden rounded-2xl border border-border/40 bg-card shadow-sm"
      >
        {/* Filters */}
        <div className="flex flex-col gap-3 border-b border-border/40 bg-muted/20 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10">
              <CreditCard className="h-4 w-4 text-emerald-500" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground">Transaction History</h2>
              <p className="text-[11px] text-muted-foreground">{filteredDonations.length} records</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:max-w-sm sm:w-full">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text" placeholder="Search donor or ref…" value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 w-full rounded-lg border border-input bg-background/60 pl-8 pr-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30"
              />
            </div>
            <div className="relative shrink-0">
              <Filter className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <select value={status} onChange={(e) => setStatus(e.target.value)}
                className="h-9 appearance-none rounded-lg border border-input bg-background/60 pl-8 pr-7 text-sm outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30"
              >
                {STATUS_FILTERS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
        </div>

        {filteredDonations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
              <RefreshCcw className="h-7 w-7" />
            </div>
            <h3 className="text-base font-bold">No donations found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {search || status ? "Try adjusting your search or filters." : "You have no donation records yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/40 bg-muted/30">
                  <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground sm:px-5">Donor</th>
                  <th className="hidden px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground md:table-cell">Reference</th>
                  <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground sm:px-5">Amount</th>
                  <th className="px-4 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground sm:px-5">Status</th>
                  <th className="hidden px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground lg:table-cell">Method</th>
                  <th className="hidden px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground lg:table-cell">Date</th>
                  <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground sm:px-5">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {filteredDonations.map((donation: Donation) => (
                  <tr key={donation.id} className="group transition-colors hover:bg-muted/20">
                    <td className="px-4 py-3 sm:px-5">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-xs font-bold text-emerald-600">
                          {(donation.member?.name || donation.donorName || "A")[0].toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-[13px] font-semibold text-foreground max-w-[120px] sm:max-w-[180px]">
                            {donation.member?.name || donation.donorName || "Anonymous"}
                          </p>
                          <p className="truncate text-[11px] text-muted-foreground max-w-[120px] sm:max-w-[180px]">
                            {donation.donorEmail || donation.member?.email || "No email"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 md:table-cell">
                      <span className="font-mono text-[11px] font-semibold text-muted-foreground group-hover:text-emerald-600 transition-colors">
                        {donation.reference}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right sm:px-5">
                      <span className="text-[13px] font-bold text-foreground">₦{Number(donation.amount).toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-3 text-center sm:px-5">
                      <StatusBadge status={donation.status} />
                    </td>
                    <td className="hidden px-4 py-3 lg:table-cell">
                      <span className="inline-flex items-center gap-1 rounded-md border border-border/50 bg-muted/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                        {donation.channel || donation.paymentMethod || "—"}
                      </span>
                    </td>
                    <td className="hidden px-4 py-3 lg:table-cell">
                      <div className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5 shrink-0" />
                        {formatDate(donation.paidAt || donation.createdAt)}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right sm:px-5">
                      <ActionsMenu
                        donation={donation}
                        onView={() => setSelectedDonation(donation)}
                        onMessage={() => setMessageDonation(donation)}
                        onDelete={() => setDeleteId(donation.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* ── Receipt Modal ── */}
      <Modal isOpen={!!selectedDonation} onClose={() => setSelectedDonation(null)} title="Donation Receipt" maxWidth="max-w-lg">
        {selectedDonation && (
          <div className="space-y-6">
            <div className="flex flex-col items-center border-b border-dashed border-border pb-6 text-center">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
                <Heart className="h-7 w-7" />
              </div>
              <h3 className="text-lg font-bold">Donation Confirmed</h3>
              <p className="text-sm text-muted-foreground">Thank you for your support</p>
            </div>
            <div className="space-y-3">
              {[
                { label: "Reference", value: <span className="font-mono font-semibold text-xs">{selectedDonation.reference}</span> },
                { label: "Donor", value: selectedDonation.member?.name || selectedDonation.donorName || "Anonymous" },
                { label: "Email", value: selectedDonation.donorEmail || selectedDonation.member?.email || "—" },
                { label: "Status", value: <StatusBadge status={selectedDonation.status} /> },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
              <div className="flex items-center justify-between border-t border-border pt-3 text-sm">
                <span className="text-base font-bold">Amount</span>
                <span className="text-base font-bold text-emerald-600">₦{Number(selectedDonation.amount).toLocaleString()}</span>
              </div>
            </div>
            <div className="rounded-xl bg-muted/40 p-4 text-[11px] text-muted-foreground">
              <p className="mb-2 font-bold uppercase tracking-wider">Technical Details</p>
              <div className="grid grid-cols-2 gap-y-1.5 gap-x-4">
                <div>Gateway: {selectedDonation.gatewayReference || "—"}</div>
                <div>Channel: {selectedDonation.channel || "—"}</div>
                <div>Paid: {selectedDonation.paidAt ? formatDate(selectedDonation.paidAt) : "—"}</div>
                <div>Created: {formatDate(selectedDonation.createdAt)}</div>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => window.print()} className="rounded-xl border border-input px-4 py-2 text-sm font-semibold transition hover:bg-muted">Print Receipt</button>
              <button onClick={() => setSelectedDonation(null)} className="rounded-xl bg-slate-900 px-6 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">Close</button>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Send Message Modal ── */}
      <SendMessageModal donation={messageDonation} onClose={() => setMessageDonation(null)} />

      {/* ── Delete Modal ── */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Confirm Deletion" maxWidth="max-w-sm">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 text-rose-600">
            <Trash2 className="h-7 w-7" />
          </div>
          <h3 className="text-lg font-bold">Are you sure?</h3>
          <p className="mt-2 text-sm text-muted-foreground">This action cannot be undone. This donation record will be permanently deleted.</p>
          <div className="mt-6 flex gap-3">
            <button onClick={() => setDeleteId(null)} className="flex-1 rounded-xl border border-input py-2.5 text-sm font-semibold transition hover:bg-muted">Cancel</button>
            <button onClick={handleDelete} disabled={deleteMutation.isPending} className="flex-1 rounded-xl bg-rose-600 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:opacity-50">
              {deleteMutation.isPending ? "Deleting…" : "Delete"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

/* ── SendMessageModal ── */
function SendMessageModal({ donation, onClose }: { donation: Donation | null; onClose: () => void }) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (donation) {
      setSubject(`Regarding your donation: ${donation.reference}`);
      setMessage(`Dear ${donation.member?.name || donation.donorName || "Generous Donor"},\n\n`);
    }
  }, [donation]);

  const handleSend = async () => {
    if (!donation) return;
    if (!subject || !message) { toast.error("Please provide both subject and message"); return; }
    setIsSending(true);
    try {
      await sendDonorMessageAction(donation.id, subject, message);
      toast.success("Message sent successfully");
      onClose();
    } catch { toast.error("Failed to send message"); }
    finally { setIsSending(false); }
  };

  return (
    <Modal isOpen={!!donation} onClose={onClose} title="Send Message to Donor" maxWidth="max-w-xl">
      <div className="space-y-4">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">To</label>
          <div className="mt-1.5 rounded-xl border border-border/40 bg-muted/30 px-4 py-2.5 text-sm">
            {donation?.donorEmail || donation?.member?.email || "No email available"}
          </div>
        </div>
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Subject</label>
          <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)}
            className="mt-1.5 h-10 w-full rounded-xl border border-input bg-background/60 px-4 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30" />
        </div>
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Message</label>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={6} className="mt-1.5 w-full resize-none rounded-xl border border-input bg-background/60 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30" />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button onClick={onClose} className="rounded-xl border border-input px-5 py-2.5 text-sm font-semibold transition hover:bg-muted">Cancel</button>
          <button onClick={handleSend} disabled={isSending} className="rounded-xl bg-slate-900 px-7 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50">
            {isSending ? "Sending…" : "Send Message"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

/* ── ActionsMenu — portal-based to escape overflow clipping ── */
function ActionsMenu({ donation, onView, onMessage, onDelete }: {
  donation: Donation; onView: () => void; onMessage: () => void; onDelete: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});
  const btnRef = useRef<HTMLButtonElement>(null);

  const openMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const menuH = 120; // approx menu height
    setMenuStyle({
      position: "fixed",
      right: window.innerWidth - rect.right,
      ...(spaceBelow < menuH
        ? { bottom: window.innerHeight - rect.top + 4 }
        : { top: rect.bottom + 4 }),
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
          <div style={menuStyle} className="w-48 overflow-hidden rounded-xl border border-border bg-card shadow-xl ring-1 ring-black/5">
            <button onClick={() => { onView(); setIsOpen(false); }} className="flex w-full items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground">
              <Eye className="h-3.5 w-3.5" /> View Receipt
            </button>
            <button onClick={() => { onMessage(); setIsOpen(false); }} className="flex w-full items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground">
              <Mail className="h-3.5 w-3.5" /> Send Message
            </button>
            <div className="my-1 h-px bg-border" />
            <button onClick={() => { onDelete(); setIsOpen(false); }} className="flex w-full items-center gap-2.5 px-4 py-2.5 text-xs font-medium text-rose-600 transition hover:bg-rose-50">
              <Trash2 className="h-3.5 w-3.5" /> Delete Record
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
  const styles: Record<string, string> = {
    completed: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    pending: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    failed: "bg-rose-500/10 text-rose-600 border-rose-500/20",
    refunded: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  };
  const cls = styles[status?.toLowerCase()] || "bg-muted text-muted-foreground border-border/40";
  const dot = cls.split(" ").find((c) => c.startsWith("bg-"))?.replace("/10", "") ?? "bg-muted";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${cls}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {status || "Unknown"}
    </span>
  );
}

/* ── StatBox ── */
function StatBox({ icon, label, value, bgColor }: { icon: React.ReactNode; label: string; value: string | number; bgColor: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-card p-4 shadow-sm transition hover:shadow-md sm:p-5">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${bgColor}`}>{icon}</div>
        <div>
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <p className="mt-0.5 text-lg font-bold tracking-tight text-foreground sm:text-xl">{value}</p>
        </div>
      </div>
    </div>
  );
}
