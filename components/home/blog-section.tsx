"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatDate, readingTime, stripHtml } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock } from "lucide-react";

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
    <section ref={ref} className="py-20 sm:py-28 bg-muted/30">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end"
        >
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Latest from the Blog
            </h2>
            <p className="mt-2 text-lg text-muted-foreground">
              Insights, devotionals, and updates from our church community.
            </p>
          </div>
          <Button asChild variant="outline" href="/blog">
            <span className="flex items-center gap-2">
              All Posts
              <ArrowRight className="h-4 w-4" />
            </span>
          </Button>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <Link
              href={`/blog/${featured.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-xl border border-border/40 bg-card shadow-sm transition-all hover:border-primary/20 hover:shadow-md"
            >
              {featured.coverImage && (
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={featured.coverImage}
                    alt={featured.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col p-6">
                <div className="mb-3 flex items-center gap-3 text-sm text-muted-foreground">
                  <span>
                    {featured.publishedAt
                      ? formatDate(featured.publishedAt)
                      : ""}
                  </span>
                  <span>&middot;</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {readingTime(featured.content)} min read
                  </span>
                </div>
                <h3 className="text-xl font-semibold group-hover:text-primary">
                  {featured.title}
                </h3>
                <p className="mt-3 text-sm text-muted-foreground line-clamp-3">
                  {featured.excerpt ||
                    stripHtml(featured.content).slice(0, 150)}
                </p>
                {featured.author?.name && (
                  <p className="mt-4 text-sm font-medium">
                    By {featured.author.name}
                  </p>
                )}
              </div>
            </Link>
          </motion.div>

          <div className="flex flex-col gap-6">
            {gridPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: (index + 1) * 0.1 }}
              >
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex gap-4 rounded-xl border border-border/40 bg-card p-4 shadow-sm transition-all hover:border-primary/20 hover:shadow-md"
                >
                  {post.coverImage && (
                    <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-lg">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col justify-center">
                    <h3 className="text-base font-semibold group-hover:text-primary line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="mt-2 line-clamp-1 text-sm text-muted-foreground">
                      {post.excerpt || stripHtml(post.content).slice(0, 80)}
                    </p>
                    <div className="mt-2 text-xs text-muted-foreground">
                      {post.publishedAt ? formatDate(post.publishedAt) : ""}
                    </div>
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
