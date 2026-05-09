"use client";

import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { formatDate } from "@/lib/utils";
import { useSermon } from "@/hooks";
import { ArrowLeft, Clock, Calendar, User, Video, Headphones } from "lucide-react";

export default function SermonPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data: sermon, isLoading, error } = useSermon(slug);

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-500/30 border-t-violet-500" />
          <p className="text-sm font-medium text-muted-foreground">Loading sermon…</p>
        </div>
      </div>
    );
  }

  if (error || !sermon) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-center">
        <div>
          <p className="text-lg font-semibold text-destructive">Sermon not found.</p>
          <p className="mt-1 text-sm text-muted-foreground">The message you are looking for does not exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">

      {/* ── Article Hero ── */}
      <section className="relative overflow-hidden bg-slate-950 py-20 sm:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(262,100%,65%,0.10),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,hsl(38,100%,50%,0.08),transparent_55%)]" />

        <div className="container relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link
              href="/sermons"
              id="sermon-back-link"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-white/50 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Library
            </Link>
          </motion.div>

          {/* Meta row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-8 flex flex-wrap items-center gap-4 text-xs font-semibold uppercase tracking-widest text-white/40"
          >
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-violet-400" />
              <time dateTime={sermon.sermonDate}>
                {formatDate(sermon.sermonDate)}
              </time>
            </span>
            {sermon.duration && (
              <>
                <span>·</span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-violet-400" />
                  {formatDuration(sermon.duration)}
                </span>
              </>
            )}
            {sermon.series && (
              <>
                <span>·</span>
                <span className="rounded-full bg-violet-500/20 px-2.5 py-0.5 text-xs font-bold text-violet-300 border border-violet-500/30">
                  {sermon.series}
                </span>
              </>
            )}
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl"
          >
            {sermon.title}
          </motion.h1>

          {/* Author */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.28 }}
            className="mt-8 flex items-center gap-3 border-t border-white/10 pt-6"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-violet-500 to-purple-500 shadow-md">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                {sermon.speaker}
              </p>
              <p className="text-xs text-white/40">Speaker</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Main Content ── */}
      <section className="bg-background py-14 sm:py-20">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">

          {/* Video Player */}
          {sermon.videoUrl && (
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.2 }}
              className="mb-12 overflow-hidden rounded-3xl border border-border/40 bg-slate-950 shadow-xl"
            >
              <div className="border-b border-white/10 bg-white/5 px-4 py-3 flex items-center gap-2">
                <Video className="h-4 w-4 text-violet-400" />
                <span className="text-xs font-semibold uppercase tracking-widest text-white/70">Watch Message</span>
              </div>
              <div className="aspect-video w-full bg-black">
                <iframe
                  src={sermon.videoUrl}
                  title={sermon.title}
                  className="h-full w-full"
                  allowFullScreen
                />
              </div>
            </motion.div>
          )}

          {/* Cover Image Fallback (If no video) */}
          {!sermon.videoUrl && sermon.imageUrl && (
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.2 }}
              className="relative mb-12 aspect-video w-full overflow-hidden rounded-3xl shadow-xl border border-border/40"
            >
              <Image
                src={sermon.imageUrl}
                alt={sermon.title}
                fill
                className="object-cover"
                priority
              />
            </motion.div>
          )}

          <div className="grid gap-12 lg:grid-cols-3">
            {/* Left Col: Description */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h2 className="text-2xl font-bold tracking-tight">About this Message</h2>
                <div className="mt-6 prose prose-base sm:prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-violet-500 hover:prose-a:text-violet-600 text-muted-foreground">
                  {sermon.description ? (
                    sermon.description.split("\n").map((paragraph: string, index: number) => (
                      <p key={index}>{paragraph}</p>
                    ))
                  ) : (
                    <p className="italic text-muted-foreground/60">No description provided for this message.</p>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Right Col: Audio & Sidebar */}
            <div>
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="sticky top-24 space-y-6"
              >
                {/* Audio Player */}
                {sermon.audioUrl && (
                  <div className="rounded-2xl border border-border/40 bg-card p-5 shadow-sm">
                    <div className="mb-4 flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10">
                        <Headphones className="h-4 w-4 text-violet-500" />
                      </div>
                      <h3 className="font-semibold">Listen Audio</h3>
                    </div>
                    <audio controls className="w-full" src={sermon.audioUrl}>
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                )}
                
                {/* Share/Actions */}
                <div className="rounded-2xl border border-border/40 bg-card p-5 shadow-sm">
                  <h3 className="mb-4 font-semibold">Share this Message</h3>
                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: sermon.title,
                          url: window.location.href,
                        }).catch(console.error);
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                        alert("Link copied to clipboard!");
                      }
                    }}
                    className="w-full rounded-xl border border-border/40 bg-muted/30 px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-muted/50 hover:text-violet-500"
                  >
                    Copy Link
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}h`;
  }
  return `${minutes}m`;
}
