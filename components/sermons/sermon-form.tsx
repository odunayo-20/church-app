"use client";

import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCreateSermon, useUpdateSermon } from "@/hooks/use-sermons";
import { sermonSchema, type SermonInput } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Loader2, Link as LinkIcon, RefreshCcw } from "lucide-react";
import { slugify } from "@/lib/utils";

interface SermonFormProps {
  sermon?: {
    id: string;
    title: string;
    slug?: string;
    description?: string | null;
    speaker: string;
    sermonDate: string | Date;
    series?: string | null;
    imageUrl?: string | null;
    audioUrl?: string | null;
    videoUrl?: string | null;
    published?: boolean | null;
  };
  isEditing?: boolean;
}

export default function SermonForm({ sermon, isEditing }: SermonFormProps) {
  const router = useRouter();
  const createMutation = useCreateSermon();
  const updateMutation = useUpdateSermon();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, dirtyFields },
  } = useForm<SermonInput>({
    resolver: zodResolver(sermonSchema),
    defaultValues: {
      title: sermon?.title || "",
      slug: sermon?.slug || "",
      description: sermon?.description || "",
      speaker: sermon?.speaker || "",
      sermonDate: (sermon?.sermonDate 
        ? new Date(sermon.sermonDate) 
        : new Date()).toISOString().split('T')[0] as any,
      series: sermon?.series || "",
      imageUrl: sermon?.imageUrl || "",
      audioUrl: sermon?.audioUrl || "",
      videoUrl: sermon?.videoUrl || "",
      published: sermon?.published || false,
    },
  });

  const title = watch("title");
  const slug = watch("slug");

  // Auto-generate slug from title
  useEffect(() => {
    // Auto-update if it's a new sermon OR if the title has been modified in edit mode
    if (title && (!isEditing || dirtyFields.title)) {
      setValue("slug", slugify(title), { shouldValidate: true });
    }
  }, [title, setValue, isEditing, dirtyFields.title]);

  const onSubmit = async (data: SermonInput) => {
    try {
      if (isEditing && sermon?.id) {
        await updateMutation.mutateAsync({
          id: sermon.id,
          ...data,
        });
        toast.success("Sermon updated successfully");
      } else {
        await createMutation.mutateAsync(data);
        toast.success("Sermon created successfully");
      }
      router.push("/admin/sermons");
    } catch {
      toast.error(
        isEditing ? "Failed to update sermon" : "Failed to create sermon",
      );
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Title *</label>
          <input
            {...register("title")}
            className="w-full rounded-xl border border-input bg-background/50 px-3 py-2 outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            placeholder="e.g., The Power of Faith"
          />
          {errors.title && (
            <p className="text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Slug</label>
            <button
              type="button"
              onClick={() => setValue("slug", slugify(title))}
              className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 hover:text-indigo-600 flex items-center gap-1"
            >
              <RefreshCcw className="h-3 w-3" />
              Regenerate
            </button>
          </div>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50">
              <LinkIcon className="h-4 w-4" />
            </div>
            <input
              {...register("slug")}
              className="w-full rounded-xl border border-input bg-background/50 pl-9 pr-3 py-2 outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-muted-foreground"
              placeholder="e.g., the-power-of-faith"
            />
          </div>
          {errors.slug && (
            <p className="text-sm text-red-500">{errors.slug.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Speaker *</label>
          <input
            {...register("speaker")}
            className="w-full rounded-xl border border-input bg-background/50 px-3 py-2 outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            placeholder="e.g., Pastor John"
          />
          {errors.speaker && (
            <p className="text-sm text-red-500">{errors.speaker.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Date *</label>
          <input
            type="date"
            {...register("sermonDate")}
            className="w-full rounded-xl border border-input bg-background/50 px-3 py-2 outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
          {errors.sermonDate && (
            <p className="text-sm text-red-500">{errors.sermonDate.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Series</label>
          <input
            {...register("series")}
            className="w-full rounded-xl border border-input bg-background/50 px-3 py-2 outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            placeholder="e.g., Faith Foundations"
          />
          {errors.series && (
            <p className="text-sm text-red-500">{errors.series.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Image URL</label>
          <input
            {...register("imageUrl")}
            className="w-full rounded-xl border border-input bg-background/50 px-3 py-2 outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            placeholder="https://..."
          />
          {errors.imageUrl && (
            <p className="text-sm text-red-500">{errors.imageUrl.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Video URL</label>
          <input
            {...register("videoUrl")}
            className="w-full rounded-xl border border-input bg-background/50 px-3 py-2 outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            placeholder="https://..."
          />
          {errors.videoUrl && (
            <p className="text-sm text-red-500">{errors.videoUrl.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Audio URL</label>
          <input
            {...register("audioUrl")}
            className="w-full rounded-xl border border-input bg-background/50 px-3 py-2 outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            placeholder="https://..."
          />
          {errors.audioUrl && (
            <p className="text-sm text-red-500">{errors.audioUrl.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <textarea
          {...register("description")}
          rows={4}
          className="w-full rounded-xl border border-input bg-background/50 px-3 py-2 outline-none transition-all focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          placeholder="Brief description of the sermon..."
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="published"
          {...register("published")}
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <label htmlFor="published" className="text-sm font-medium">
          Published
        </label>
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isPending}
          className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600"
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? "Save Changes" : "Create Sermon"}
        </Button>
      </div>
    </form>
  );
}
