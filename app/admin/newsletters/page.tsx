"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { formatDate } from "@/lib/utils";
import { DeleteButton } from "@/components/admin/delete-button";
import { 
  useNewsletters, 
  useCreateNewsletter, 
  useUpdateNewsletter, 
  useDeleteNewsletter,
  useSendNewsletter,
  useAuth 
} from "@/hooks";
import { toast } from "sonner";
import type { Newsletter } from "@/types/models";
import {
  Search,
  Calendar,
  Eye,
  Plus,
  Send,
  FileText,
  Clock,
  CheckCircle2,
  MoreVertical,
  Edit2,
  Users,
  Mail
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { newsletterSchema } from "@/lib/validations";
import { TinyMCEEditor } from "@/components/ui/tinymce-editor";
import { Controller, useForm } from "react-hook-form";
import Link from "next/link";

export default function AdminNewslettersPage() {
  const [search, setSearch] = useState("");
  const [selectedNewsletter, setSelectedNewsletter] = useState<Newsletter | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const { data, isLoading, error } = useNewsletters({ page: 1, limit: 100 });
  const { role, loading: authLoading } = useAuth();
  
  const createMutation = useCreateNewsletter();
  const updateMutation = useUpdateNewsletter();
  const deleteMutation = useDeleteNewsletter();
  const sendMutation = useSendNewsletter();

  const { register, handleSubmit, reset, setValue, control, formState: { errors } } = useForm({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      subject: "",
      content: "",
      status: "draft"
    }
  });

  const onSubmit = async (formData: any) => {
    try {
      if (selectedNewsletter) {
        await updateMutation.mutateAsync({ id: selectedNewsletter.id, data: formData });
        toast.success("Newsletter updated successfully");
      } else {
        await createMutation.mutateAsync(formData);
        toast.success("Newsletter created successfully");
      }
      setIsModalOpen(false);
      reset();
      setSelectedNewsletter(null);
    } catch (error: any) {
      console.error("Newsletter form error:", error);
      toast.error(error.message || "An error occurred");
    }
  };

  const handleEdit = (nl: Newsletter) => {
    setSelectedNewsletter(nl);
    reset({
      subject: nl.subject,
      content: nl.content,
      status: nl.status
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Newsletter deleted successfully");
    } catch (error) {
      toast.error("Failed to delete newsletter");
    }
  };

  const handleSend = async (id: string) => {
    try {
      await sendMutation.mutateAsync(id);
      toast.success("Newsletter sent successfully to all subscribers!");
    } catch (error) {
      toast.error("Failed to send newsletter");
    }
  };

  const filteredNewsletters =
    data?.data?.filter(
      (nl: Newsletter) =>
        nl.subject.toLowerCase().includes(search.toLowerCase()) ||
        nl.content.toLowerCase().includes(search.toLowerCase()),
    ) || [];

  if (authLoading || isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500/30 border-t-amber-500" />
          <p className="text-sm font-medium text-muted-foreground">
            Loading newsletters…
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
            Error loading newsletters. Please try again.
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
          <h1 className="text-3xl font-bold tracking-tight">Newsletters</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create, manage and send newsletters to your community.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              setSelectedNewsletter(null);
              reset({
                subject: "",
                content: "",
                status: "draft"
              });
              setIsModalOpen(true);
            }}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 text-sm font-bold text-white shadow-lg shadow-amber-500/25 transition-all hover:bg-amber-600 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            Create Newsletter
          </button>
        </div>
      </motion.div>

      {/* ── Tabs ── */}
      <div className="flex border-b border-border">
        <div className="flex gap-8">
          <button
            className="border-b-2 border-amber-500 pb-4 text-sm font-bold text-amber-600"
          >
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Newsletters
            </div>
          </button>
          <Link
            href="/admin/newsletters/subscribers"
            className="pb-4 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Subscribers
            </div>
          </Link>
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
              <FileText className="h-5 w-5" />
              <h2 className="font-semibold text-foreground">Drafts & Sent</h2>
              <span className="ml-2 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-amber-700 border border-amber-500/20">
                {filteredNewsletters.length}
              </span>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search newsletters..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-input bg-background py-2 pl-9 pr-4 text-sm text-foreground outline-none transition-all focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 sm:w-64"
              />
            </div>
          </div>

          {filteredNewsletters.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
                <Mail className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold">No newsletters found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {search
                  ? "Try adjusting your search query."
                  : "Start by creating your first newsletter."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto pb-32">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  <tr>
                    <th className="px-6 py-4 font-bold">Subject</th>
                    <th className="px-6 py-4 font-bold">Status</th>
                    <th className="hidden px-6 py-4 lg:table-cell font-bold">Date Created</th>
                    <th className="sticky right-0 z-10 bg-muted/50 px-6 py-4 text-right font-bold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredNewsletters.map((nl: Newsletter, index: number) => (
                    <tr
                      key={nl.id}
                      className="group transition-colors hover:bg-muted/30"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold border bg-amber-50 border-amber-100 text-amber-700">
                            <FileText className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="font-semibold text-foreground transition-colors group-hover:text-amber-600">
                              {nl.subject}
                            </p>
                            <p className="text-xs text-muted-foreground line-clamp-1 max-w-md">
                              {nl.content.substring(0, 60)}...
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                         <StatusBadge status={nl.status} />
                      </td>
                      <td className="hidden px-6 py-4 lg:table-cell">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(nl.createdAt)}</span>
                        </div>
                      </td>
                      <td className={`sticky right-0 px-6 py-4 text-right transition-colors bg-card group-hover:bg-muted/30 ${activeMenuId === nl.id ? 'z-30' : 'z-10'}`}>
                        <div className="flex items-center justify-end gap-2">
                           <div className="relative">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveMenuId(activeMenuId === nl.id ? null : nl.id);
                                }}
                                className={`p-2 rounded-lg transition-colors ${activeMenuId === nl.id ? 'bg-muted text-foreground' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}`}
                              >
                                <MoreVertical className="h-4 w-4" />
                              </button>
                              
                              {activeMenuId === nl.id && (
                                <>
                                  <div 
                                    className="fixed inset-0 z-10" 
                                    onClick={() => setActiveMenuId(null)}
                                  />
                                  <div className={`absolute right-0 z-20 w-44 overflow-hidden rounded-xl border border-border bg-card shadow-lg ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-100 ${
                                    index > filteredNewsletters.length - 4 && filteredNewsletters.length > 4 ? 'bottom-full mb-1' : 'top-full mt-1'
                                  }`}>
                                    <button 
                                      onClick={() => {
                                        setSelectedNewsletter(nl);
                                        setIsViewModalOpen(true);
                                        setActiveMenuId(null);
                                      }}
                                      className="flex w-full items-center gap-2 px-4 py-2.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                                    >
                                      <Eye className="h-3.5 w-3.5" /> Preview
                                    </button>
                                    <button 
                                      onClick={() => {
                                        handleEdit(nl);
                                        setActiveMenuId(null);
                                      }}
                                      className="flex w-full items-center gap-2 px-4 py-2.5 text-xs font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                                    >
                                      <Edit2 className="h-3.5 w-3.5" /> Edit Draft
                                    </button>
                                    <div className="h-px bg-border my-1" />
                                    <button 
                                      onClick={() => {
                                        handleSend(nl.id);
                                        setActiveMenuId(null);
                                      }}
                                      disabled={nl.status === "sent"}
                                      className="flex w-full items-center gap-2 px-4 py-2.5 text-xs font-medium text-emerald-600 hover:bg-emerald-50 transition-colors disabled:opacity-50"
                                    >
                                      <Send className="h-3.5 w-3.5" /> Send to All
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>

                           <button 
                             onClick={() => handleEdit(nl)}
                             className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors hidden sm:flex"
                             title="Edit"
                           >
                             <Edit2 className="h-4 w-4" />
                           </button>

                           <DeleteButton
                             message="Are you sure you want to delete this newsletter?"
                             onDelete={() => handleDelete(nl.id)}
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

      {/* ── Create/Edit Modal ── */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedNewsletter(null);
          reset();
        }}
        title={selectedNewsletter ? "Edit Newsletter" : "Create Newsletter"}
        maxWidth="max-w-3xl"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Subject</label>
            <input
              {...register("subject")}
              placeholder="e.g. Weekly Community Update"
              className="w-full rounded-xl border border-input bg-background p-3 text-sm text-foreground outline-none transition-all focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20"
            />
            {errors.subject && <p className="text-xs text-rose-500 font-medium">{errors.subject.message as string}</p>}
          </div>

          <input type="hidden" {...register("status")} />

          <div className="space-y-2">
            <label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Content</label>
            <Controller
              key={selectedNewsletter?.id || 'new'}
              name="content"
              control={control}
              render={({ field }) => (
                <TinyMCEEditor
                  content={field.value}
                  onChange={field.onChange}
                  placeholder="Write your newsletter content here..."
                />
              )}
            />
            {errors.content && <p className="text-xs text-rose-500 font-medium">{errors.content.message as string}</p>}
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
              disabled={createMutation.isPending || updateMutation.isPending}
              className="rounded-xl bg-amber-500 px-8 py-2.5 text-sm font-bold text-white shadow-lg shadow-amber-500/25 transition-all hover:bg-amber-600 disabled:opacity-50"
            >
              {(createMutation.isPending || updateMutation.isPending) ? "Saving..." : "Save Newsletter"}
            </button>
          </div>
        </form>
      </Modal>

      {/* ── Preview Modal ── */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Newsletter Preview"
        maxWidth="max-w-3xl"
      >
        {selectedNewsletter && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-6">
              <div>
                <h4 className="text-2xl font-bold">{selectedNewsletter.subject}</h4>
                <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    Created: {formatDate(selectedNewsletter.createdAt)}
                  </div>
                  {selectedNewsletter.sentAt && (
                    <div className="flex items-center gap-1.5 text-emerald-600">
                      <Send className="h-4 w-4" />
                      Sent: {formatDate(selectedNewsletter.sentAt)}
                    </div>
                  )}
                </div>
              </div>
              <StatusBadge status={selectedNewsletter.status} />
            </div>

            <div className="prose prose-amber dark:prose-invert max-w-none rounded-2xl bg-muted/30 p-8">
               <div 
                 className="leading-relaxed text-foreground"
                 dangerouslySetInnerHTML={{ __html: selectedNewsletter.content }}
               />
            </div>

            <div className="flex items-center justify-between border-t border-border pt-6">
               <button 
                 onClick={() => setIsViewModalOpen(false)}
                 className="rounded-xl px-6 py-2.5 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
               >
                 Close Preview
               </button>
               
               <div className="flex gap-3">
                 <button 
                   onClick={() => {
                     setIsViewModalOpen(false);
                     handleEdit(selectedNewsletter);
                   }}
                   className="rounded-xl bg-muted px-6 py-2.5 text-sm font-bold text-foreground transition-all hover:bg-border"
                 >
                   Edit Draft
                 </button>
                 <button 
                   onClick={() => {
                     handleSend(selectedNewsletter.id);
                     setIsViewModalOpen(false);
                   }}
                   disabled={selectedNewsletter.status === "sent"}
                   className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-amber-500/25 transition-all hover:bg-amber-600 disabled:opacity-50"
                 >
                   <Send className="h-4 w-4" />
                   Send to All Subscribers
                 </button>
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
    draft: { 
      label: "Draft", 
      class: "bg-blue-500/10 text-blue-600 border-blue-500/20",
      icon: Clock
    },
    sent: { 
      label: "Sent", 
      class: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
      icon: CheckCircle2
    },
  };

  const config = configs[status] || configs.draft;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${config.class}`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}
