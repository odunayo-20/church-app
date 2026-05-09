"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Church, Eye, EyeOff, AlertCircle, ArrowRight, Lock, Mail } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabase = supabaseUrl && supabaseUrl.startsWith("http") ? createClient() : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!supabase) throw new Error("Supabase not configured");
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      let redirectTo = searchParams.get("redirectedFrom");
      if (!redirectTo) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("userId", data.user.id)
          .single();
        redirectTo = profile?.role === "admin" || profile?.role === "media" ? "/admin" : "/dashboard";
      }

      router.push(redirectTo);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-all focus:border-amber-500/50 focus:bg-white/8 focus:ring-2 focus:ring-amber-500/20";

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2.5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400"
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </motion.div>
      )}

      <div>
        <label htmlFor="login-email" className="text-sm font-semibold text-white/80">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
          <input
            id="login-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`${inputClass} pl-11`}
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="login-password" className="text-sm font-semibold text-white/80">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
          <input
            id="login-password"
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`${inputClass} pl-11 pr-12`}
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 transition-colors hover:text-white/60"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <button
        id="login-submit"
        type="submit"
        disabled={loading}
        className="group mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 px-6 text-sm font-semibold text-white shadow-lg shadow-amber-500/30 transition-all hover:opacity-90 hover:shadow-amber-500/50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            Signing in…
          </>
        ) : (
          <>
            Sign In
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </>
        )}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-16">
      {/* Background glows */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,hsl(38,100%,50%,0.10),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,hsl(355,100%,65%,0.08),transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] [background-size:64px_64px]" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Card */}
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-md">
          {/* Top gradient bar */}
          <div className="h-1 w-full bg-gradient-to-r from-amber-500 to-rose-500" />

          <div className="p-8 sm:p-10">
            {/* Logo */}
            <div className="mb-8 flex flex-col items-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-rose-500 shadow-lg shadow-amber-500/30">
                <Church className="h-7 w-7 text-white" />
              </div>
              <h1 className="text-2xl font-extrabold text-white">Welcome Back</h1>
              <p className="mt-1.5 text-sm text-white/50">
                Sign in to your Grace Community account
              </p>
            </div>

            <Suspense>
              <LoginForm />
            </Suspense>

            <p className="mt-6 text-center text-sm text-white/40">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/register"
                id="login-register-link"
                className="font-semibold text-amber-400 transition-colors hover:text-amber-300"
              >
                Create one free
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
