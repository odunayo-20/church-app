"use client";

import { useState, Suspense } from "react";
import { toast } from "sonner";
import { resetPasswordWithOtp } from "@/lib/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email") || "";
  const code = searchParams.get("code") || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !code) {
      setError("Missing reset code or email. Please request a new code.");
      return;
    }
    if (!password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      // Call the atomic verify + update + signout server action
      await resetPasswordWithOtp(email, code, password);
      
      setSuccess(true);
      toast.success("Password updated successfully!");
      // Redirect to login after 2.5 seconds
      setTimeout(() => {
        router.push("/auth/login");
      }, 2500);
    } catch (err: any) {
      setError(err.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-all focus:border-emerald-500/50 focus:bg-white/8 focus:ring-2 focus:ring-emerald-500/20";

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-16">
      {/* Background glows */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,hsl(150,100%,40%,0.10),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,hsl(180,100%,50%,0.08),transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] [background-size:64px_64px]" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-md">
          {/* Top gradient bar */}
          <div className="h-1 w-full bg-gradient-to-r from-emerald-500 to-teal-500" />

          <div className="p-8 sm:p-10">
            <div className="mb-8 flex flex-col items-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/30">
                <Lock className="h-7 w-7 text-white" />
              </div>
              <h1 className="text-2xl font-extrabold text-white">Set New Password</h1>
              <p className="mt-1.5 text-sm text-white/50">
                {!email || !code
                  ? "Invalid reset link parameters. Please request a new recovery email."
                  : "Please enter your new password below. Make it strong!"}
              </p>
            </div>

            <AnimatePresence mode="wait">
              {!email || !code ? (
                <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-center text-sm text-red-400">
                  <AlertCircle className="mx-auto mb-2 h-8 w-8" />
                  <p className="font-semibold">Invalid Reset Link</p>
                  <p className="mt-1 text-white/60">This page requires a valid recovery email and code context. Please request a new recovery code.</p>
                </div>
              ) : !success ? (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
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
                    <label htmlFor="password" className="text-sm font-semibold text-white/80">
                      New Password
                    </label>
                    <div className="relative mt-1.5">
                      <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                      <input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        className={`${inputClass} pl-11`}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                        minLength={6}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="text-sm font-semibold text-white/80">
                      Confirm Password
                    </label>
                    <div className="relative mt-1.5">
                      <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                      <input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        className={`${inputClass} pl-11`}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        disabled={loading}
                        minLength={6}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="group mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:opacity-90 hover:shadow-emerald-500/50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        Updating Password...
                      </>
                    ) : (
                      "Update Password"
                    )}
                  </button>
                </motion.form>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-6 text-center"
                >
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 font-semibold text-emerald-400">Password Updated!</h3>
                  <p className="text-sm text-white/60">
                    Your password has been changed successfully. Redirecting you to login...
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <span className="h-8 w-8 animate-spin rounded-full border-4 border-white/30 border-t-white" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
