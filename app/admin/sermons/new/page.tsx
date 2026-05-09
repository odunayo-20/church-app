"use client";

import SermonForm from "@/components/sermons/sermon-form";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Video } from "lucide-react";

export default function NewSermonPage() {
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
            <Video className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">New Sermon</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Add a new sermon to the library
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
        <SermonForm />
      </motion.div>
    </div>
  );
}
