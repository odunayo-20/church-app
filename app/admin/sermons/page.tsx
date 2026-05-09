"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { formatDate } from "@/lib/utils";
import { DeleteButton } from "@/components/admin/delete-button";
import { useSermons, useDeleteSermon } from "@/hooks/use-sermons";
import { toast } from "sonner";
import {
  Video,
  Plus,
  ExternalLink,
  Pencil,
  Eye,
  AlertCircle,
  Calendar,
} from "lucide-react";

export default function AdminSermonsPage() {
  const { data, isLoading, error } = useSermons({ page: 1, limit: 100 });
  const deleteSermonMutation = useDeleteSermon();

  const handleDelete = async (id: string) => {
    try {
      await deleteSermonMutation.mutateAsync(id);
      toast.success("Sermon deleted successfully");
    } catch {
      toast.error("Failed to delete sermon");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500/30 border-t-indigo-500" />
          <p className="text-sm font-medium text-muted-foreground">
            Loading sermons…
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
            Error loading sermons. Please try again.
          </p>
        </div>
      </div>
    );
  }

  const sermons = data?.data || [];

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
          <h1 className="text-3xl font-bold tracking-tight">Sermons</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Preserving the word and sharing spiritual nourishment.
          </p>
        </div>
        <Link
          href="/admin/sermons/new"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all hover:opacity-90 hover:shadow-indigo-500/40"
        >
          <Plus className="h-4 w-4" />
          New Sermon
        </Link>
      </motion.div>

      {/* ── Content ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="overflow-hidden rounded-2xl border border-border/40 bg-card shadow-sm">
          {/* Table Header area */}
          <div className="flex items-center justify-between border-b border-border/40 bg-muted/20 px-6 py-4">
            <div className="flex items-center gap-2 text-indigo-500">
              <Video className="h-5 w-5" />
              <h2 className="font-semibold text-foreground">All Sermons</h2>
              <span className="ml-2 rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs font-bold text-indigo-500">
                {sermons.length}
              </span>
            </div>
          </div>

          {sermons.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-500">
                <Video className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold">No sermons yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Get started by adding your first sermon.
              </p>
              <Link
                href="/admin/sermons/new"
                className="mt-6 inline-flex h-10 items-center gap-2 rounded-xl border border-indigo-500/30 px-5 text-sm font-semibold text-indigo-500 transition-colors hover:bg-indigo-500/10"
              >
                Create your first sermon
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/30 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  <tr>
                    <th className="px-6 py-4">Title & Speaker</th>
                    <th className="px-6 py-4">Date & Series</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {sermons.map((sermon) => (
                    <tr
                      key={sermon.id}
                      className="group transition-colors hover:bg-muted/20"
                    >
                      <td className="px-6 py-4">
                        <p className="font-semibold text-foreground transition-colors group-hover:text-indigo-500">
                          {sermon.title}
                        </p>
                        <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                          <ExternalLink className="h-3 w-3" />
                          /sermons/{sermon.slug}
                        </div>
                        <p className="mt-1 text-xs font-medium text-foreground">
                          {sermon.speaker}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-1.5 text-sm text-foreground">
                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                            {formatDate(sermon.sermonDate)}
                          </div>
                          {sermon.series && (
                            <span className="inline-flex w-fit items-center rounded-md border border-border/40 bg-background px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground shadow-sm">
                              {sermon.series}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {sermon.publishedAt ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                            Draft
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/sermons/${sermon.slug}`}
                            target="_blank"
                            className="inline-flex h-8 items-center justify-center rounded-lg border border-border/40 bg-background px-3 text-xs font-medium text-muted-foreground transition-colors hover:border-blue-500/30 hover:bg-blue-500/10 hover:text-blue-500"
                            title="View Live"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Link>
                          <Link
                            href={`/admin/sermons/${sermon.slug}/edit`}
                            className="inline-flex h-8 items-center justify-center rounded-lg border border-border/40 bg-background px-3 text-xs font-medium text-muted-foreground transition-colors hover:border-amber-500/30 hover:bg-amber-500/10 hover:text-amber-500"
                            title="Edit"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Link>
                          <DeleteButton
                            message="Are you sure you want to delete this sermon?"
                            onDelete={() => handleDelete(sermon.id)}
                            isLoading={deleteSermonMutation.isPending}
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
