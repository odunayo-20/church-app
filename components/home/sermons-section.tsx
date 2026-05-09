"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, PlayCircle, Mic } from "lucide-react";

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
    <section ref={ref} className="relative overflow-hidden bg-[#080c14] py-24 sm:py-32">
      {/* Glow */}
      <div className="pointer-events-none absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-rose-600/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-violet-700/10 blur-[100px]" />

      <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center"
        >
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-rose-500/25 bg-rose-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-rose-400">
              Messages
            </span>
            <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              Recent Sermons
            </h2>
            <p className="mt-3 text-lg text-white/50">
              Listen to our latest messages and grow in your faith journey.
            </p>
          </div>
          <Link
            href="/sermons"
            id="sermons-view-all"
            className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white/80 transition-all duration-300 hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-300"
          >
            All Sermons
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {sermons.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 py-20 text-center text-white/30">
            No sermons available yet. Check back soon!
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sermons.slice(0, 3).map((sermon, index) => (
              <motion.div
                key={sermon.id}
                initial={{ opacity: 0, y: 32 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  href={`/sermons/${sermon.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-white/8 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-rose-500/30 hover:bg-white/8 hover:shadow-2xl hover:shadow-rose-500/10"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video overflow-hidden bg-white/5">
                    {sermon.imageUrl ? (
                      <Image
                        src={sermon.imageUrl}
                        alt={sermon.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-rose-900/40 to-violet-900/40">
                        <Mic className="h-16 w-16 text-white/20" />
                      </div>
                    )}
                    {/* Play overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 shadow-2xl shadow-black/30 transition-transform duration-300 group-hover:scale-110">
                        <PlayCircle className="h-9 w-9 text-rose-500" />
                      </div>
                    </div>
                    {/* Series badge */}
                    {sermon.series && (
                      <div className="absolute left-3 top-3">
                        <span className="rounded-full bg-rose-500 px-3 py-1 text-xs font-bold text-white shadow-md">
                          {sermon.series}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <h3 className="line-clamp-2 text-base font-bold leading-snug text-white transition-colors group-hover:text-rose-300">
                      {sermon.title}
                    </h3>
                    <div className="mt-2 flex items-center gap-2 text-sm text-white/40">
                      <Mic className="h-3.5 w-3.5" />
                      <span>{sermon.speaker}</span>
                    </div>
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
