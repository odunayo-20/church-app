"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { MediaImagePicker } from "@/components/ui/media-image-picker";
import { slugify } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useCreatePost, useUpdatePost } from "@/hooks";
import { toast } from "sonner";
import { Type, Link as LinkIcon, AlignLeft, Image as ImageIcon, Send, AlertCircle, Eye, Loader2 } from "lucide-react";

const TinyMCEEditor = dynamic(
  () => import("@/components/ui/tinymce-editor").then((mod) => ({ default: mod.TinyMCEEditor })),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[400px] w-full rounded-2xl" />,
  },
);

interface PostFormProps {
  post?: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage: string | null;
    published: boolean;
  };
  isEditing?: boolean;
}

export function PostForm({ post, isEditing = false }: PostFormProps) {
  const router = useRouter();
  const createMutation = useCreatePost();
  const updateMutation = useUpdatePost();

  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [coverImage, setCoverImage] = useState(post?.coverImage ?? "");
  const [published, setPublished] = useState(post?.published ?? false);
  const [error, setError] = useState("");

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!isEditing) {
      setSlug(slugify(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) { setError("Title is required"); return; }
    if (!slug.trim()) { setError("Slug is required"); return; }
    if (!content.trim()) { setError("Content is required"); return; }

    try {
      const postData = {
        title,
        slug,
        excerpt,
        content,
        coverImage: coverImage || undefined,
        published,
      };

      if (isEditing && post) {
        await updateMutation.mutateAsync({ id: post.id, ...postData });
        toast.success("Post updated successfully");
      } else {
        await createMutation.mutateAsync(postData);
        toast.success("Post created successfully");
      }

      router.push("/admin/blog");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to save post");
      toast.error("Failed to save post");
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;
  const inputClass =
    "mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-2.5 pl-10 text-sm shadow-sm outline-none transition-all placeholder:text-muted-foreground/60 focus:border-rose-500/50 focus:ring-2 focus:ring-rose-500/20";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm font-medium text-red-500">
          <AlertCircle className="h-5 w-5 shrink-0" />
          {error}
        </div>
      )}

      {/* Basic Info */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="text-sm font-semibold text-foreground">Post Title</label>
          <div className="relative">
            <Type className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className={inputClass}
              placeholder="Give your post a catchy title"
              required
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-foreground">URL Slug</label>
          <div className="relative">
            <LinkIcon className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(slugify(e.target.value))}
              className={inputClass}
              placeholder="post-url-slug"
              required
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-foreground">Short Excerpt</label>
          <div className="relative">
            <AlignLeft className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className={inputClass}
              placeholder="Brief summary for the blog feed"
            />
          </div>
        </div>
      </div>

      {/* Cover Image */}
      <div>
        <div className="mb-2">
          <MediaImagePicker
            label="Cover Image"
            value={coverImage}
            onChange={setCoverImage}
            accentColor="rose"
            hint="Pick a cover photo from your media library."
          />
        </div>
      </div>

      {/* Editor */}
      <div>
        <label className="mb-2 block text-sm font-semibold text-foreground">Content Body</label>
        <TinyMCEEditor
          content={content}
          onChange={setContent}
          placeholder="Write your post content here..."
          minHeight={450}
        />
      </div>

      {/* Status & Actions */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-border/40 bg-muted/20 p-6">
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="h-5 w-5 rounded border-input accent-rose-500"
          />
          <div>
            <p className="font-semibold text-foreground">Publish Immediately</p>
            <p className="text-xs text-muted-foreground">Make this post live to the public upon saving.</p>
          </div>
        </label>

        <div className="flex w-full gap-3 sm:w-auto">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 rounded-xl border border-border/40 bg-background px-6 py-2.5 text-sm font-semibold transition-colors hover:bg-muted/50 sm:flex-none"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="group flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-rose-500/25 transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving…
              </>
            ) : isEditing ? (
              <>
                <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                Update Post
              </>
            ) : (
              <>
                <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                Create Post
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
