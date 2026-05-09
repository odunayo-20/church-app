"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatDate, readingTime, stripHtml } from "@/lib/utils";
import { ArrowRight, Clock, User } from "lucide-react";

interface BlogSectionProps {
  posts: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage: string | null;
    publishedAt: string | null;
    author: { name: string | null } | null;
  }[];
}

export function BlogSection({ posts }: BlogSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  if (posts.length === 0) {
    return null;
  }

  const featured = posts[0];
  const gridPosts = posts.slice(1, 4);

  return (
    <section ref={ref} className="bg-slate-50 py-24 sm:py-32 dark:bg-slate-900/50">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center"
        >
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-teal-600 dark:border-teal-900/50 dark:bg-teal-900/20 dark:text-teal-400">
              From the Blog
            </span>
            <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl">
              Latest Insights
            </h2>
            <p className="mt-3 text-lg text-slate-500 dark:text-slate-400">
              Devotionals, updates, and community stories.
            </p>
          </div>
          <Link
            href="/blog"
            id="blog-view-all"
            className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-300 hover:border-teal-300 hover:text-teal-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-teal-700 dark:hover:text-teal-400"
          >
            All Posts
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-5">
          {/* Featured post — 3 cols */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, y: 32 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              href={`/blog/${featured.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/70 dark:border-slate-800 dark:bg-slate-900 dark:ring-white/5"
            >
              {/* Image */}
              <div className="relative h-72 overflow-hidden bg-gradient-to-br from-teal-400 to-indigo-500">
                {featured.coverImage ? (
                  <Image
                    src={featured.coverImage}
                    alt={featured.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                {/* Reading time badge */}
                <div className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                  <Clock className="h-3 w-3" />
                  {readingTime(featured.content)} min read
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-7">
                {featured.publishedAt && (
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {formatDate(featured.publishedAt)}
                  </p>
                )}
                <h3 className="mt-3 text-2xl font-bold leading-snug text-slate-900 transition-colors group-hover:text-teal-600 dark:text-white dark:group-hover:text-teal-400">
                  {featured.title}
                </h3>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  {featured.excerpt || stripHtml(featured.content).slice(0, 180)}
                </p>

                {featured.author?.name && (
                  <div className="mt-6 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <User className="h-4 w-4 text-slate-400" />
                    {featured.author.name}
                  </div>
                )}
              </div>
            </Link>
          </motion.div>

          {/* Side posts — 2 cols */}
          <div className="flex flex-col gap-5 lg:col-span-2">
            {gridPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, x: 32 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: (index + 1) * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex h-full gap-4 overflow-hidden rounded-2xl border border-slate-100 bg-white p-4 shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/70 dark:border-slate-800 dark:bg-slate-900 dark:ring-white/5"
                >
                  {post.coverImage && (
                    <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="flex min-w-0 flex-col justify-center">
                    {post.publishedAt && (
                      <p className="text-xs font-medium text-slate-400">
                        {formatDate(post.publishedAt)}
                      </p>
                    )}
                    <h3 className="mt-1 line-clamp-2 text-sm font-bold leading-snug text-slate-900 transition-colors group-hover:text-teal-600 dark:text-white dark:group-hover:text-teal-400">
                      {post.title}
                    </h3>
                    <p className="mt-1 line-clamp-1 text-xs text-slate-400">
                      {post.excerpt || stripHtml(post.content).slice(0, 70)}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
