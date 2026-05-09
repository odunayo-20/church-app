"use client";

import { useSermon } from "@/hooks";
import SermonForm from "@/components/sermons/sermon-form";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Pencil, AlertCircle } from "lucide-react";

export default function EditSermonPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data: sermon, isLoading, error } = useSermon(slug);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500/30 border-t-indigo-500" />
          <p className="text-sm font-medium text-muted-foreground">
            Loading sermon details…
          </p>
        </div>
      </div>
    );
  }

  if (error || !sermon) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="flex items-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-6 py-4 text-red-500">
          <AlertCircle className="h-5 w-5" />
          <p className="text-sm font-semibold">
            Sermon not found. It may have been deleted.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Link
          href="/admin/sermons"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-indigo-500"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Sermons
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-md">
            <Pencil className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Edit Sermon</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Update details for{" "}
              <span className="font-semibold text-foreground">
                &quot;{sermon.title}&quot;
              </span>
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="rounded-2xl border border-border/40 bg-card shadow-sm p-6 sm:p-8"
      >
        <SermonForm
          sermon={{
            id: sermon.id,
            title: sermon.title,
            slug: sermon.slug,
            description: sermon.description,
            speaker: sermon.speaker,
            sermonDate: sermon.sermonDate,
            series: sermon.series,
            imageUrl: sermon.imageUrl,
            audioUrl: sermon.audioUrl,
            videoUrl: sermon.videoUrl,
            published: sermon.publishedAt !== null,
          }}
          isEditing
        />
      </motion.div>
    </div>
  );
}
