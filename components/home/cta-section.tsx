"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Users } from "lucide-react";

export function CtaSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-20 sm:py-28">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl bg-primary px-6 py-16 text-primary-foreground shadow-xl sm:px-12 sm:py-20"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,hsl(var(--primary)/0.8),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--primary)/0.6),transparent_50%)]" />

          <div className="relative mx-auto max-w-2xl text-center">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-white/10">
              <Heart className="h-7 w-7" />
            </div>

            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Be a Part of Something Greater
            </h2>

            <p className="mx-auto mt-4 max-w-lg text-lg text-primary-foreground/80">
              Whether you&apos;re looking for a church home, want to serve, or
              simply need a community that cares, there&apos;s a place for you
              here.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="bg-white text-primary hover:bg-white/90"
              >
                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Join Us
                </span>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
                href="/donate"
              >
                <span className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Give Today
                </span>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
