"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import { requestPasswordReset } from "@/lib/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, ArrowLeft, KeyRound, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [otp, setOtp] = useState(["", "", "", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      await requestPasswordReset(email);
      setSubmitted(true);
      toast.success("Reset code sent successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to send reset code");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      const pasted = value.replace(/\D/g, "").slice(0, 8).split("");
      const newOtp = [...otp];
      for (let i = 0; i < pasted.length; i++) {
        if (index + i < 8) newOtp[index + i] = pasted[i];
      }
      setOtp(newOtp);
      const focusIndex = Math.min(index + pasted.length, 7);
      inputRefs.current[focusIndex]?.focus();
      return;
    }

    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 7) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const token = otp.join("");
    if (token.length !== 8) {
      setError("Please enter all 8 digits");
      return;
    }

    // Redirect to the reset-password page with email and token in query params.
    // We do NOT call verifyOtp here, so no cookies/session are generated yet!
    router.push(`/auth/reset-password?email=${encodeURIComponent(email)}&code=${encodeURIComponent(token)}`);
  };

  const inputClass =
    "mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-all focus:border-amber-500/50 focus:bg-white/8 focus:ring-2 focus:ring-amber-500/20";

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
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-md">
          {/* Top gradient bar */}
          <div className="h-1 w-full bg-gradient-to-r from-amber-500 to-rose-500" />

          <div className="p-8 sm:p-10">
            <div className="mb-8 flex flex-col items-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-rose-500 shadow-lg shadow-amber-500/30">
                <KeyRound className="h-7 w-7 text-white" />
              </div>
              <h1 className="text-2xl font-extrabold text-white">
                {!submitted ? "Forgot Password?" : "Enter Reset Code"}
              </h1>
              <p className="mt-1.5 text-sm text-white/50">
                {!submitted
                  ? "Enter your email to receive a password reset code."
                  : `We've sent an 8-digit code to ${email}`}
              </p>
            </div>

            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form
                  key="form-email"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleEmailSubmit}
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
                    <label htmlFor="email" className="text-sm font-semibold text-white/80">
                      Email Address
                    </label>
                    <div className="relative mt-1.5">
                      <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                      <input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        className={`${inputClass} pl-11`}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="group mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 px-6 text-sm font-semibold text-white shadow-lg shadow-amber-500/30 transition-all hover:opacity-90 hover:shadow-amber-500/50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        Sending Code...
                      </>
                    ) : (
                      "Send Reset Code"
                    )}
                  </button>
                </motion.form>
              ) : (
                <motion.form
                  key="form-otp"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleOtpSubmit}
                  className="space-y-6"
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

                  <div className="flex w-full gap-1.5 sm:gap-2">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={(el) => { inputRefs.current[index] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={8}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="aspect-square w-0 flex-1 rounded-lg border border-white/10 bg-white/5 text-center text-base font-bold text-white outline-none transition-all focus:border-amber-500/50 focus:bg-white/8 focus:ring-2 focus:ring-amber-500/20 sm:rounded-xl sm:text-xl"
                        disabled={loading}
                      />
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otp.join("").length !== 8}
                    className="group mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 px-6 text-sm font-semibold text-white shadow-lg shadow-amber-500/30 transition-all hover:opacity-90 hover:shadow-amber-500/50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        Verify Code
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </>
                    )}
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setOtp(["", "", "", "", "", "", "", ""]);
                        setError("");
                      }}
                      className="text-sm font-medium text-white/50 transition-colors hover:text-white"
                      disabled={loading}
                    >
                      Use a different email
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {!submitted && (
              <div className="mt-6 flex justify-center border-t border-white/10 pt-6">
                <Link
                  href="/auth/login"
                  className="group flex items-center text-sm font-medium text-white/50 transition-colors hover:text-white"
                >
                  <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  Back to Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

