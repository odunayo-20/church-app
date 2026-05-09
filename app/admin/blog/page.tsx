"use client";

import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { DeleteButton } from "@/components/admin/delete-button";
import { usePosts, useDeletePost } from "@/hooks";
import { toast } from "sonner"; // Assuming sonner is used, if not I'll check

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
    return <div className="container mx-auto px-4 py-12 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-12 text-center text-red-500">Error loading posts</div>;
  }

  const posts = data?.data || [];

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blog Posts</h1>
          <p className="mt-1 text-muted-foreground">Manage your blog posts</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">No posts yet.</p>
          <Link
            href="/admin/blog/new"
            className="mt-4 inline-block text-sm text-primary hover:underline"
          >
            Create your first post
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-border/40">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">Title</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                <th className="hidden px-4 py-3 text-left text-sm font-medium md:table-cell">
                  Created
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-muted/25">
                  <td className="px-4 py-3">
                    <p className="font-medium">{post.title}</p>
                    <p className="text-xs text-muted-foreground">/blog/{post.slug}</p>
                  </td>
                  <td className="px-4 py-3">
                    {post.published ? (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                        Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="hidden px-4 py-3 text-sm text-muted-foreground md:table-cell">
                    {formatDate(post.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-sm text-primary hover:underline"
                        target="_blank"
                      >
                        View
                      </Link>
                      <Link
                        href={`/admin/blog/${post.id}/edit`}
                        className="text-sm text-primary hover:underline"
                      >
                        Edit
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
      )}
    </div>
  );
}
