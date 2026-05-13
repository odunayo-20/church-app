"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { formatDate } from "@/lib/utils";
import { DeleteButton } from "@/components/admin/delete-button";
import { usePosts, useDeletePost } from "@/hooks";
import { toast } from "sonner";
import { FileText, Plus, ExternalLink, Pencil, Search, Eye, AlertCircle } from "lucide-react";

export default function AdminBlogPage() {
  const { data, isLoading, error } = usePosts({ page: 1, limit: 100 });
  const deletePostMutation = useDeletePost();

  const handleDelete = async (id: string) => {
    try {
      await deletePostMutation.mutateAsync(id);
      toast.success("Post deleted successfully");
    } catch (error) {
      toast.error("Failed to delete post");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-rose-500/30 border-t-rose-500" />
          <p className="text-sm font-medium text-muted-foreground">Loading posts…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex items-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-6 py-4 text-red-500">
          <AlertCircle className="h-5 w-5" />
          <p className="text-sm font-semibold">Error loading posts. Please try again.</p>
        </div>
      </div>
    );
  }

  const posts = data?.data || [];

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
          <h1 className="text-3xl font-bold tracking-tight">Blog Posts</h1>
          <p className="mt-1 text-sm text-muted-foreground">Share wisdom, stories, and updates with our global family.</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 px-5 text-sm font-semibold text-white shadow-lg shadow-rose-500/25 transition-all hover:opacity-90 hover:shadow-rose-500/40"
        >
          <Plus className="h-4 w-4" />
          New Post
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
            <div className="flex items-center gap-2 text-rose-500">
              <FileText className="h-5 w-5" />
              <h2 className="font-semibold text-foreground">All Posts</h2>
              <span className="ml-2 rounded-full bg-rose-500/10 px-2.5 py-0.5 text-xs font-bold text-rose-500">
                {posts.length}
              </span>
            </div>
          </div>

          {posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/10 text-rose-500">
                <FileText className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold">No posts yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">Get started by creating your first blog post.</p>
              <Link
                href="/admin/blog/new"
                className="mt-6 inline-flex h-10 items-center gap-2 rounded-xl border border-rose-500/30 px-5 text-sm font-semibold text-rose-500 transition-colors hover:bg-rose-500/10"
              >
                Create your first post
              </Link>
            </div>
          ) : (
            <div>
              {/* ── Mobile Card View ── */}
              <div className="divide-y divide-border/40 md:hidden">
                {posts.map((post) => (
                  <div key={post.id} className="p-5 space-y-4 transition-colors hover:bg-muted/10">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <p className="font-bold text-foreground leading-tight">{post.title}</p>
                        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                          <ExternalLink className="h-3 w-3" />
                          <span className="truncate max-w-[150px]">/blog/{post.slug}</span>
                        </div>
                        <p className="text-[10px] font-medium text-muted-foreground pt-1">
                          {formatDate(post.createdAt)}
                        </p>
                      </div>
                      {post.published ? (
                        <span className="shrink-0 inline-flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" title="Published" />
                      ) : (
                        <span className="shrink-0 inline-flex h-2 w-2 rounded-full bg-amber-500" title="Draft" />
                      )}
                    </div>
                    
                    <div className="flex items-center justify-end gap-3 pt-2">
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/40 bg-background text-muted-foreground"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/admin/blog/${post.id}/edit`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-border/40 bg-background text-muted-foreground"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <DeleteButton 
                        message="Are you sure you want to delete this post?" 
                        onDelete={() => handleDelete(post.id)}
                        isLoading={deletePostMutation.isPending}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Desktop Table View ── */}
              <div className="hidden md:block">
                <table className="w-full text-left text-sm">
                  <thead className="bg-muted/30 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    <tr>
                      <th className="px-6 py-4">Title & Slug</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="hidden px-6 py-4 md:table-cell">Created</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {posts.map((post) => (
                      <tr key={post.id} className="group transition-colors hover:bg-muted/20">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-foreground transition-colors group-hover:text-rose-500">{post.title}</p>
                          <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                            <ExternalLink className="h-3 w-3" />
                            /blog/{post.slug}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {post.published ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-600">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              Published
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-600">
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                              Draft
                            </span>
                          )}
                        </td>
                        <td className="hidden px-6 py-4 text-muted-foreground md:table-cell">
                          {formatDate(post.createdAt)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/blog/${post.slug}`}
                              target="_blank"
                              className="inline-flex h-8 items-center justify-center rounded-lg border border-border/40 bg-background px-3 text-xs font-medium text-muted-foreground transition-colors hover:border-blue-500/30 hover:bg-blue-500/10 hover:text-blue-500"
                              title="View Live"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Link>
                            <Link
                              href={`/admin/blog/${post.id}/edit`}
                              className="inline-flex h-8 items-center justify-center rounded-lg border border-border/40 bg-background px-3 text-xs font-medium text-muted-foreground transition-colors hover:border-amber-500/30 hover:bg-amber-500/10 hover:text-amber-500"
                              title="Edit"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Link>
                            <DeleteButton 
                              message="Are you sure you want to delete this post?" 
                              onDelete={() => handleDelete(post.id)}
                              isLoading={deletePostMutation.isPending}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
