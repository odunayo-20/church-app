"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { formatDate } from "@/lib/utils";
import { DeleteButton } from "@/components/admin/delete-button";
import { useContactMessages, useDeleteContactMessage, useUpdateContactMessage, useAuth } from "@/hooks";
import { toast } from "sonner";
import type { ContactMessage } from "@/types/models";
import {
  Mail,
  Search,
  Calendar,
  Eye,
  CheckCircle2,
  Clock,
  Trash2,
  MoreVertical,
  Reply,
  MessageSquare
} from "lucide-react";
import { Modal } from "@/components/ui/modal";

export default function AdminContactsPage() {
  const [search, setSearch] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const { data, isLoading, error } = useContactMessages({ page: 1, limit: 100 });
  const { role, loading: authLoading } = useAuth();
  const deleteMutation = useDeleteContactMessage();
  const updateMutation = useUpdateContactMessage();

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Message deleted successfully");
    } catch (error) {
      toast.error("Failed to delete message");
    }
  };

  const handleStatusUpdate = async (id: string, status: "unread" | "read" | "replied") => {
    try {
      await updateMutation.mutateAsync({ id, data: { status } });
      if (selectedMessage?.id === id) {
        setSelectedMessage({ ...selectedMessage, status });
      }
      toast.success(`Message marked as ${status}`);
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const filteredMessages =
    data?.data?.filter(
      (msg: ContactMessage) =>
        msg.name.toLowerCase().includes(search.toLowerCase()) ||
        msg.email.toLowerCase().includes(search.toLowerCase()) ||
        msg.subject.toLowerCase().includes(search.toLowerCase()),
    ) || [];

  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500/30 border-t-amber-500" />
          <p className="text-sm font-medium text-muted-foreground">
            Loading messages…
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
            Error loading messages. Please try again.
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
          <h1 className="text-3xl font-bold tracking-tight">Contact Messages</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage inquiries, feedback, and messages from the community.
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
              <Mail className="h-5 w-5" />
              <h2 className="font-semibold text-foreground">Inbox</h2>
              <span className="ml-2 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-amber-700 border border-amber-500/20">
                {filteredMessages.length}
              </span>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search messages..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-input bg-background py-2 pl-9 pr-4 text-sm text-foreground outline-none transition-all focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 sm:w-64"
              />
            </div>
          </div>

          {filteredMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
                <MessageSquare className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold">No messages found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {search
                  ? "Try adjusting your search query."
                  : "Your inbox is empty."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto pb-32">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  <tr>
                    <th className="px-6 py-4 font-bold">Sender</th>
                    <th className="px-6 py-4 font-bold">Subject</th>
                    <th className="hidden px-6 py-4 md:table-cell font-bold">Status</th>
                    <th className="hidden px-6 py-4 lg:table-cell font-bold">Date</th>
                    <th className="sticky right-0 z-10 bg-muted/50 px-6 py-4 text-right font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredMessages.map((msg: ContactMessage, index: number) => (
                    <tr
                      key={msg.id}
                      className={`group transition-colors hover:bg-muted/30 ${msg.status === 'unread' ? 'bg-amber-50/30 dark:bg-amber-500/5' : ''}`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold border bg-amber-50 border-amber-100 text-amber-700">
                            {msg.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className={`text-foreground transition-colors group-hover:text-amber-600 ${msg.status === 'unread' ? 'font-bold' : 'font-semibold'}`}>
                              {msg.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {msg.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className={`px-6 py-4 ${msg.status === 'unread' ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                        {msg.subject.length > 40 ? msg.subject.substring(0, 40) + "..." : msg.subject}
                      </td>
                      <td className="hidden px-6 py-4 md:table-cell">
                        <div className="flex items-center">
                           <StatusBadge status={msg.status} />
                        </div>
                      </td>
                      <td className="hidden px-6 py-4 lg:table-cell">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(msg.createdAt)}</span>
                        </div>
                      </td>
                      <td className={`sticky right-0 px-6 py-4 text-right transition-colors bg-card group-hover:bg-muted/30 ${activeMenuId === msg.id ? 'z-30' : 'z-10'}`}>
                        <div className="flex items-center justify-end gap-2">
                           <div className="relative">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveMenuId(activeMenuId === msg.id ? null : msg.id);
                                }}
                                className={`p-2 rounded-lg transition-colors ${activeMenuId === msg.id ? 'bg-muted text-foreground' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}`}
                              >
                                <MoreVertical className="h-4 w-4" />
                              </button>
                              
                              {activeMenuId === msg.id && (
                                <>
                                  <div 
                                    className="fixed inset-0 z-10" 
                                    onClick={() => setActiveMenuId(null)}
                                  />
                                  <div className={`absolute right-0 z-20 w-40 overflow-hidden rounded-xl border border-border bg-card shadow-lg ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-100 ${
                                    index > filteredMessages.length - 4 && filteredMessages.length > 4 ? 'bottom-full mb-1' : 'top-full mt-1'
                                  }`}>
                                    <button 
                                      onClick={() => {
                                        setSelectedMessage(msg);
                                        if (msg.status === "unread") {
                                          handleStatusUpdate(msg.id, "read");
                                        }
                                        setActiveMenuId(null);
                                      }}
                                      className="flex w-full items-center gap-2 px-4 py-2.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                                    >
                                      <Eye className="h-3.5 w-3.5" /> View Details
                                    </button>
                                    <div className="h-px bg-border my-1" />
                                    <button 
                                      onClick={() => {
                                        handleStatusUpdate(msg.id, 'unread');
                                        setActiveMenuId(null);
                                      }}
                                      className="flex w-full items-center gap-2 px-4 py-2.5 text-xs font-medium text-amber-600 hover:bg-amber-50 transition-colors hover:text-amber-700"
                                    >
                                      <Mail className="h-3.5 w-3.5" /> Mark Unread
                                    </button>
                                    <button 
                                      onClick={() => {
                                        handleStatusUpdate(msg.id, 'read');
                                        setActiveMenuId(null);
                                      }}
                                      className="flex w-full items-center gap-2 px-4 py-2.5 text-xs font-medium text-blue-600 hover:bg-blue-50 transition-colors hover:text-blue-700"
                                    >
                                      <CheckCircle2 className="h-3.5 w-3.5" /> Mark Read
                                    </button>
                                    <button 
                                      onClick={() => {
                                        handleStatusUpdate(msg.id, 'replied');
                                        setActiveMenuId(null);
                                      }}
                                      className="flex w-full items-center gap-2 px-4 py-2.5 text-xs font-medium text-emerald-600 hover:bg-emerald-50 transition-colors hover:text-emerald-700"
                                    >
                                      <Reply className="h-3.5 w-3.5" /> Mark Replied
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>

                           <button 
                             onClick={() => {
                               setSelectedMessage(msg);
                               if (msg.status === "unread") {
                                 handleStatusUpdate(msg.id, "read");
                               }
                             }}
                             className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors hidden sm:flex"
                             title="Read"
                           >
                             <Eye className="h-4 w-4" />
                           </button>

                           <DeleteButton
                             message="Are you sure you want to delete this message?"
                             onDelete={() => handleDelete(msg.id)}
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

      {/* ── View Modal ── */}
      <Modal
        isOpen={!!selectedMessage}
        onClose={() => setSelectedMessage(null)}
        title="Message Details"
        maxWidth="max-w-2xl"
      >
        {selectedMessage && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-xl font-bold text-amber-500">
                  {selectedMessage.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-lg font-bold">{selectedMessage.name}</h4>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Mail className="h-3.5 w-3.5" />
                    <a href={`mailto:${selectedMessage.email}`} className="hover:text-amber-500 hover:underline">
                      {selectedMessage.email}
                    </a>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <StatusBadge status={selectedMessage.status} />
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  {formatDate(selectedMessage.createdAt)}
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-2xl bg-muted/30 p-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Subject</p>
                <p className="mt-1 font-semibold text-foreground">{selectedMessage.subject}</p>
              </div>
              <div className="h-px bg-border/40" />
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">Message</p>
                <p className="whitespace-pre-wrap leading-relaxed text-foreground">
                  {selectedMessage.message}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-border/40 pt-6">
              <div className="flex items-center gap-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions:</p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleStatusUpdate(selectedMessage.id, 'unread')}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${selectedMessage.status === 'unread' ? 'bg-amber-500 text-white' : 'bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white'}`}
                  >
                    Unread
                  </button>
                  <button 
                    onClick={() => handleStatusUpdate(selectedMessage.id, 'read')}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${selectedMessage.status === 'read' ? 'bg-blue-500 text-white' : 'bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white'}`}
                  >
                    Read
                  </button>
                  <button 
                    onClick={() => handleStatusUpdate(selectedMessage.id, 'replied')}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${selectedMessage.status === 'replied' ? 'bg-emerald-500 text-white' : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white'}`}
                  >
                    Replied
                  </button>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                  onClick={() => handleStatusUpdate(selectedMessage.id, 'replied')}
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-sm font-bold text-white shadow-md shadow-amber-500/20 transition-colors hover:bg-amber-600"
                >
                  <Reply className="h-4 w-4" /> Reply
                </a>
                <DeleteButton
                  message="Permanently delete this message?"
                  onDelete={async () => {
                    await handleDelete(selectedMessage.id);
                    setSelectedMessage(null);
                  }}
                  isLoading={deleteMutation.isPending}
                />
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const configs: Record<string, { label: string; class: string; icon: any }> = {
    unread: { 
      label: "Unread", 
      class: "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
      icon: Mail
    },
    read: { 
      label: "Read", 
      class: "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400",
      icon: CheckCircle2
    },
    replied: { 
      label: "Replied", 
      class: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
      icon: Reply
    },
  };

  const config = configs[status] || configs.unread;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${config.class}`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}
