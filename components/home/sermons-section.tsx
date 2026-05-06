"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, PlayCircle } from "lucide-react";

interface SermonsSectionProps {
  sermons: {
    id: string;
    title: string;
    slug: string;
    speaker: string;
    sermonDate: string;
    imageUrl: string | null;
    series: string | null;
  }[];
}

export function SermonsSection({ sermons }: SermonsSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-20 sm:py-28">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end"
        >
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Recent Sermons
            </h2>
            <p className="mt-2 text-lg text-muted-foreground">
              Listen to our latest messages and grow in your faith journey.
            </p>
          </div>
          <Button asChild variant="outline" href="/sermons">
            <span className="flex items-center gap-2">
              All Sermons
              <ArrowRight className="h-4 w-4" />
            </span>
          </Button>
        </motion.div>

        {sermons.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            No sermons available yet. Check back soon!
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sermons.slice(0, 3).map((sermon, index) => (
              <motion.div
                key={sermon.id}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  href={`/sermons/${sermon.slug}`}
                  className="group block overflow-hidden rounded-xl border border-border/40 bg-card shadow-sm transition-all hover:border-primary/20 hover:shadow-md"
                >
                  <div className="relative aspect-video overflow-hidden bg-primary/5">
                    {sermon.imageUrl ? (
                      <Image
                        src={sermon.imageUrl}
                        alt={sermon.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <PlayCircle className="h-16 w-16 text-primary/40" />
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                      <div className="rounded-full bg-white/90 p-3 shadow-lg">
                        <PlayCircle className="h-8 w-8 text-primary" />
                      </div>
                    </div>
                  </div>

                  <div className="p-5">
                    {sermon.series && (
                      <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                        {sermon.series}
                      </span>
                    )}
                    <h3 className="mt-3 text-lg font-semibold group-hover:text-primary line-clamp-2">
                      {sermon.title}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {sermon.speaker}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
