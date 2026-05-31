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



  return (
    <section ref={ref} className="bg-slate-50 py-24 sm:py-32 dark:bg-slate-900/50">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 32 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                className="h-full"
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/70 hover:border-teal-500/30 dark:border-slate-800 dark:bg-slate-900 dark:ring-white/5 dark:hover:border-teal-400/25"
                >
                  {/* Image */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-teal-400 to-indigo-500">
                    {post.coverImage && (
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                    {/* Reading time badge */}
                    <div className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-full bg-slate-950/60 border border-white/10 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md shadow-sm">
                      <Clock className="h-3 w-3 text-teal-400" />
                      {readingTime(post.content)} min read
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-6">
                    {post.publishedAt && (
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        {formatDate(post.publishedAt)}
                      </p>
                    )}
                    <h3 className="mt-3 text-lg font-bold leading-snug text-slate-900 transition-colors group-hover:text-teal-600 dark:text-white dark:group-hover:text-teal-400">
                      {post.title}
                    </h3>
                    <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                      {post.excerpt || stripHtml(post.content).slice(0, 180)}
                    </p>

                    {post.author?.name && (
                      <div className="mt-6 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                        <User className="h-4 w-4 text-slate-400" />
                        {post.author.name}
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
        </div>
      </div>
    </section>
  );
}
