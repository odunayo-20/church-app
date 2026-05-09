"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { formatDate, readingTime, stripHtml } from "@/lib/utils";
import { ArrowRight, User, Clock, BookOpen } from "lucide-react";
import { usePosts } from "@/hooks";
import type { Post } from "@/types/models";

const fade = (delay = 0) => ({
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] } },
});

function AuthorRow({ post }: { post: Post }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-amber-500 to-rose-500">
        {post.author?.avatarUrl ? (
          <Image src={post.author.avatarUrl} alt={post.author.name || ""} width={28} height={28} className="object-cover" />
        ) : (
          <User className="h-3.5 w-3.5 text-white" />
        )}
      </div>
      <span className="text-xs font-semibold text-muted-foreground">
        {post.author?.name || "Grace Community"}
      </span>
    </div>
  );
}

export default function BlogPage() {
  const { data, isLoading, error } = usePosts({ page: 1, limit: 100, published: true });

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500/30 border-t-amber-500" />
          <p className="text-sm font-medium text-muted-foreground">Loading stories…</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-center">
        <div>
          <p className="text-lg font-semibold text-destructive">Could not load stories.</p>
          <p className="mt-1 text-sm text-muted-foreground">Please try again later.</p>
        </div>
      </div>
    );
  }

  const posts = data.data;
  const featuredPost = posts[0];
  const otherPosts = posts.slice(1);

  return (
    <div className="flex flex-col">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-slate-950 py-28 sm:py-36">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,hsl(38,100%,50%,0.12),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,hsl(355,100%,65%,0.10),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] [background-size:64px_64px]" />

        <div className="container relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div initial="hidden" animate="visible" className="flex flex-col items-center">
            <motion.span
              variants={fade(0)}
              className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-5 py-1.5 text-xs font-semibold uppercase tracking-widest text-amber-300"
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
              Blog &amp; News
            </motion.span>

            <motion.h1
              variants={fade(0.1)}
              className="mt-6 text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl"
            >
              Community{" "}
              <span className="bg-gradient-to-r from-amber-300 via-orange-300 to-rose-400 bg-clip-text text-transparent">
                Stories
              </span>
            </motion.h1>

            <motion.p
              variants={fade(0.2)}
              className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/60"
            >
              Encouraging stories, spiritual insights, and updates from the heart of our church community.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── Posts ── */}
      <section className="bg-background py-16 sm:py-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {posts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-rose-500 shadow-lg">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold">No Stories Yet</h2>
              <p className="mt-3 max-w-md text-muted-foreground">
                Our writers are crafting something beautiful. Check back soon for stories from our community.
              </p>
            </motion.div>
          ) : (
            <div className="space-y-20">

              {/* Featured Post */}
              {featuredPost && (
                <motion.div
                  initial={{ opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="group relative overflow-hidden rounded-3xl border border-border/40 bg-card shadow-md transition-all duration-300 hover:shadow-xl"
                >
                  <div className="grid gap-0 lg:grid-cols-2">
                    {/* Image */}
                    <div className="relative min-h-[280px] lg:min-h-[420px]">
                      {featuredPost.coverImage ? (
                        <Image
                          src={featuredPost.coverImage}
                          alt={featuredPost.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-500/10 to-rose-500/10">
                          <BookOpen className="h-16 w-16 text-amber-500/30" />
                        </div>
                      )}
                      {/* Featured badge */}
                      <span className="absolute left-4 top-4 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 px-3 py-1 text-xs font-bold text-white shadow">
                        Featured
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col justify-center p-8 lg:p-12">
                      <div className="mb-4 flex items-center gap-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        <time>{formatDate(featuredPost.publishedAt || featuredPost.createdAt)}</time>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {readingTime(featuredPost.content)} min read
                        </span>
                      </div>

                      <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">
                        <Link
                          href={`/blog/${featuredPost.slug}`}
                          id={`blog-featured-${featuredPost.id}`}
                          className="transition-colors hover:text-amber-500"
                        >
                          {featuredPost.title}
                        </Link>
                      </h2>

                      <p className="mt-5 text-base leading-relaxed text-muted-foreground line-clamp-3">
                        {featuredPost.excerpt || stripHtml(featuredPost.content).slice(0, 220) + "…"}
                      </p>

                      <div className="mt-8 flex items-center justify-between border-t border-border/40 pt-6">
                        <AuthorRow post={featuredPost} />
                        <Link
                          href={`/blog/${featuredPost.slug}`}
                          className="inline-flex h-10 items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 px-5 text-sm font-semibold text-white shadow-md shadow-amber-500/25 transition-all hover:scale-105"
                        >
                          Read Story <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Grid */}
              {otherPosts.length > 0 && (
                <div>
                  <div className="mb-10 flex items-center gap-4">
                    <div className="h-px flex-1 bg-border/40" />
                    <h2 className="text-lg font-bold uppercase tracking-widest text-muted-foreground">More Stories</h2>
                    <div className="h-px flex-1 bg-border/40" />
                  </div>

                  <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {otherPosts.map((post: Post, i: number) => (
                      <motion.article
                        key={post.id}
                        initial={{ opacity: 0, y: 32 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                        viewport={{ once: true }}
                        className="group flex flex-col overflow-hidden rounded-2xl border border-border/40 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                      >
                        {/* Thumbnail */}
                        <div className="relative aspect-[16/9] overflow-hidden">
                          {post.coverImage ? (
                            <Image
                              src={post.coverImage}
                              alt={post.title}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-amber-500/8 to-rose-500/8">
                              <BookOpen className="h-10 w-10 text-amber-500/25" />
                            </div>
                          )}
                        </div>

                        {/* Body */}
                        <div className="flex flex-1 flex-col p-6">
                          <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                            <time>{formatDate(post.publishedAt || post.createdAt)}</time>
                            <span>·</span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {readingTime(post.content)} min
                            </span>
                          </div>

                          <h3 className="text-lg font-bold leading-snug transition-colors group-hover:text-amber-500">
                            <Link href={`/blog/${post.slug}`} id={`blog-card-${post.id}`}>
                              {post.title}
                            </Link>
                          </h3>

                          <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                            {post.excerpt || stripHtml(post.content).slice(0, 130) + "…"}
                          </p>

                          <div className="mt-6 flex items-center justify-between border-t border-border/40 pt-5">
                            <AuthorRow post={post} />
                            <Link
                              href={`/blog/${post.slug}`}
                              className="inline-flex items-center gap-1 text-xs font-bold text-amber-500 transition-all hover:gap-2 hover:text-amber-400"
                            >
                              Read <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                          </div>
                        </div>
                      </motion.article>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
