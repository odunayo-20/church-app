"use client";

import { notFound, useParams } from "next/navigation";
import { formatDate, readingTime } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { usePostBySlug } from "@/hooks";
import { Clock, ArrowLeft, User, Calendar } from "lucide-react";

export default function PostPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data: post, isLoading, error } = usePostBySlug(slug);

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500/30 border-t-amber-500" />
          <p className="text-sm font-medium text-muted-foreground">Loading story…</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    notFound();
  }

  const minutes = readingTime(post.content);

  return (
    <div className="flex flex-col">

      {/* ── Article Hero ── */}
      <section className="relative overflow-hidden bg-slate-950 py-20 sm:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(38,100%,50%,0.10),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,hsl(355,100%,65%,0.08),transparent_55%)]" />

        <div className="container relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Link
              href="/blog"
              id="blog-back-link"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-white/50 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
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
              <Calendar className="h-3.5 w-3.5" />
              <time dateTime={post.publishedAt || post.createdAt}>
                {formatDate(post.publishedAt || post.createdAt)}
              </time>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {minutes} min read
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl"
          >
            {post.title}
          </motion.h1>

          {/* Excerpt */}
          {post.excerpt && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.22 }}
              className="mt-5 text-lg leading-relaxed text-white/60"
            >
              {post.excerpt}
            </motion.p>
          )}

          {/* Author */}
          {post.author && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.28 }}
              className="mt-8 flex items-center gap-3 border-t border-white/10 pt-6"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-amber-500 to-rose-500">
                {post.author.avatarUrl ? (
                  <Image
                    src={post.author.avatarUrl}
                    alt={post.author.name || "Author"}
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                ) : (
                  <User className="h-5 w-5 text-white" />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  {post.author.name || "Grace Community"}
                </p>
                <p className="text-xs text-white/40">Author</p>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* ── Cover Image ── */}
      {post.coverImage && (
        <div className="bg-slate-950">
          <div className="container mx-auto max-w-5xl px-4 pb-0 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.65, delay: 0.3 }}
              className="relative aspect-video w-full overflow-hidden rounded-3xl shadow-2xl"
            >
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </motion.div>
          </div>
        </div>
      )}

      {/* ── Article Content ── */}
      <article className="bg-background py-14 sm:py-20">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="prose prose-neutral dark:prose-invert
           prose-base sm:prose-lg max-w-3xl mx-auto
           prose-p:leading-relaxed
           prose-img:rounded-2xl prose-img:shadow-md
           prose-headings:scroll-mt-24"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Footer nav */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-16 border-t border-border/40 pt-10"
          >
            <Link
              href="/blog"
              id="blog-back-footer"
              className="inline-flex items-center gap-2 rounded-full border border-border/40 bg-card px-6 py-3 text-sm font-semibold transition-all hover:border-amber-500/40 hover:text-amber-500"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to all stories
            </Link>
          </motion.div>
        </div>
      </article>
    </div>
  );
}
