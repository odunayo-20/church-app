"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { SermonCard } from "@/components/sermons/sermon-card";
import { Video, Search, SlidersHorizontal } from "lucide-react";
import { useSermons, useSermonSeries } from "@/hooks";

export default function SermonsPage() {
  const [search, setSearch] = useState("");
  const [selectedSeries, setSelectedSeries] = useState("All");

  const { data: sermonsData, isLoading: isSermonsLoading } = useSermons({
    search,
    series: selectedSeries === "All" ? undefined : selectedSeries,
  });
  const { data: seriesData, isLoading: isSeriesLoading } = useSermonSeries();

  const isLoading = isSermonsLoading || isSeriesLoading;
  const sermons = sermonsData?.data || [];
  const series = seriesData || [];

  return (
    <div className="flex flex-col">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-slate-950 py-28 sm:py-36">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(262,100%,65%,0.10),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,hsl(38,100%,50%,0.10),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] [background-size:64px_64px]" />

        <div className="container relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-400/10 px-5 py-1.5 text-xs font-semibold uppercase tracking-widest text-violet-300">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-400" />
              The Word
            </span>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="mt-6 text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl"
            >
              Sermon{" "}
              <span className="bg-gradient-to-r from-violet-300 via-purple-300 to-amber-400 bg-clip-text text-transparent">
                Library
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.2 }}
              className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/60"
            >
              Grow in faith through the powerful teaching of God&apos;s Word. Watch or listen to messages from our archive.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── Search & Filter bar ── */}
      <section className="sticky top-0 z-20 border-b border-border/40 bg-background/90 backdrop-blur-md py-4 shadow-sm">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Search */}
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="sermons-search"
                type="search"
                placeholder="Search by title or speaker…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-10 w-full rounded-xl border border-border/40 bg-card pl-10 pr-4 text-sm outline-none transition-all focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20"
              />
            </div>

            {/* Series filter pills */}
            {series.length > 0 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-0.5">
                <SlidersHorizontal className="h-4 w-4 shrink-0 text-muted-foreground" />
                <div className="flex gap-2">
                  <button
                    id="series-all"
                    onClick={() => setSelectedSeries("All")}
                    className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                      selectedSeries === "All"
                        ? "bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-md shadow-violet-500/25"
                        : "border border-border/40 bg-card text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    All
                  </button>
                  {series.map((s: string) => (
                    <button
                      key={s}
                      id={`series-${s.toLowerCase().replace(/\s+/g, "-")}`}
                      onClick={() => setSelectedSeries(s)}
                      className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                        selectedSeries === s
                          ? "bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-md shadow-violet-500/25"
                          : "border border-border/40 bg-card text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Sermon Grid ── */}
      <section className="bg-background py-12 sm:py-16">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex min-h-[40vh] items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-violet-500/30 border-t-violet-500" />
                <p className="text-sm font-medium text-muted-foreground">Loading sermons…</p>
              </div>
            </div>
          ) : sermons.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 shadow-lg">
                <Video className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold">No Sermons Found</h3>
              <p className="mt-3 max-w-md text-muted-foreground">
                {search ? `No results for "${search}". Try a different search term.` : "Check back soon for new messages from our team."}
              </p>
              {search && (
                <button
                  onClick={() => { setSearch(""); setSelectedSeries("All"); }}
                  className="mt-6 rounded-full border border-border/40 px-5 py-2.5 text-sm font-semibold transition-all hover:border-violet-500/40 hover:text-violet-500"
                >
                  Clear Filters
                </button>
              )}
            </motion.div>
          ) : (
            <>
              <p className="mb-8 text-sm text-muted-foreground">
                Showing <span className="font-semibold text-foreground">{sermons.length}</span> sermon{sermons.length !== 1 ? "s" : ""}
                {selectedSeries !== "All" && <span> in <span className="font-semibold text-violet-500">{selectedSeries}</span></span>}
                {search && <span> matching <span className="font-semibold">&ldquo;{search}&rdquo;</span></span>}
              </p>
              <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
                {sermons.map((sermon: any, i: number) => (
                  <motion.div
                    key={sermon.id}
                    initial={{ opacity: 0, y: 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                    viewport={{ once: true }}
                  >
                    <SermonCard sermon={sermon} />
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
