"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { unsubscribeAction } from "@/app/action/newsletter-actions";
import { Church, CheckCircle2, XCircle, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [status, setStatus] = useState<"loading" | "success" | "error" | "no-email">("loading");

  useEffect(() => {
    if (!email) {
      setStatus("no-email");
      return;
    }

    const performUnsubscribe = async () => {
      try {
        await unsubscribeAction(email);
        setStatus("success");
      } catch (error) {
        console.error("Unsubscribe error:", error);
        setStatus("error");
      }
    };

    performUnsubscribe();
  }, [email]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-20 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/50 p-8 shadow-2xl backdrop-blur-xl"
      >
        <div className="mb-8 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-rose-500 shadow-lg shadow-amber-500/20">
            <Church className="h-8 w-8 text-white" />
          </div>
        </div>

        {status === "loading" && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
            </div>
            <h1 className="text-2xl font-bold text-white">Unsubscribing...</h1>
            <p className="text-white/60">Please wait while we process your request.</p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4 animate-in fade-in zoom-in duration-500">
            <div className="flex justify-center text-emerald-500">
              <CheckCircle2 className="h-12 w-12" />
            </div>
            <h1 className="text-2xl font-bold text-white">Unsubscribed</h1>
            <p className="text-white/60">
              You have been successfully unsubscribed from our newsletter. 
              We're sorry to see you go!
            </p>
            <div className="pt-6">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-xl bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10"
              >
                Return to Home
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}

        {(status === "error" || status === "no-email") && (
          <div className="space-y-4 animate-in fade-in zoom-in duration-500">
            <div className="flex justify-center text-rose-500">
              <XCircle className="h-12 w-12" />
            </div>
            <h1 className="text-2xl font-bold text-white">Something went wrong</h1>
            <p className="text-white/60">
              {status === "no-email" 
                ? "We couldn't find an email address to unsubscribe." 
                : "We encountered an error while processing your request. Please try again later or contact us directly."}
            </p>
            <div className="pt-6">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-amber-500/25 transition-all hover:bg-amber-600"
              >
                Contact Support
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    }>
      <UnsubscribeContent />
    </Suspense>
  );
}
