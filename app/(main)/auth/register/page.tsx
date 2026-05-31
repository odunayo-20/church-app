"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import {
  Church,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  Lock,
  Mail,
  CheckCircle2,
  User,
  Phone,
  CalendarDays,
} from "lucide-react";

export default function RegisterPage() {
  const [step, setStep] = useState<1 | 2>(1);

  // Step 1 — credentials
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Step 2 — profile
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [birthday, setBirthday] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabase =
    supabaseUrl && supabaseUrl.startsWith("http") ? createClient() : null;

  // ── Validate step 1 and advance ─────────────────────────────────
  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setStep(2);
  };

  // ── Final submit (step 2) ────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) {
      setError("Please enter your full name");
      return;
    }
    setLoading(true);
    try {
      // Call our server-side signUp to create both the Auth user, member row, and welcome email
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          name: name.trim(),
          phone: phone.trim() || undefined,
          birthday: birthday || undefined,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || "Registration failed");
      }

      setSuccess(true);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "An error occurred during registration"
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-all focus:border-amber-500/50 focus:bg-white/8 focus:ring-2 focus:ring-amber-500/20";

  // ── Success screen ───────────────────────────────────────────────
  if (success) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(38,100%,50%,0.10),transparent_55%)]" />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-md text-center"
        >
          <div className="h-1 w-full bg-gradient-to-r from-amber-500 to-rose-500" />
          <div className="p-10">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg">
              <CheckCircle2 className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-white">
              You&apos;re Almost In!
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-white/50">
              We&apos;ve sent a confirmation link to{" "}
              <span className="text-amber-400 font-semibold">{email}</span>.
              Check your inbox (and spam folder) to verify your email and
              complete your membership registration.
            </p>
            <p className="mt-2 text-xs text-white/30">
              A welcome email will arrive once you confirm.
            </p>
            <Link
              href="/auth/login"
              id="register-back-to-login"
              className="mt-8 inline-flex h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 px-8 text-sm font-semibold text-white shadow-lg shadow-amber-500/30 transition-all hover:opacity-90"
            >
              Back to Sign In <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-16">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(38,100%,50%,0.10),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,hsl(355,100%,65%,0.08),transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] [background-size:64px_64px]" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-md">
          <div className="h-1 w-full bg-gradient-to-r from-amber-500 to-rose-500" />
          <div className="p-8 sm:p-10">
            {/* Logo + Steps */}
            <div className="mb-8 flex flex-col items-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-rose-500 shadow-lg shadow-amber-500/30">
                <Church className="h-7 w-7 text-white" />
              </div>
              <h1 className="text-2xl font-extrabold text-white">
                Join the Community
              </h1>
              <p className="mt-1.5 text-sm text-white/50">
                {step === 1
                  ? "Create your free membership account"
                  : "Tell us a little about yourself"}
              </p>

              {/* Step indicator */}
              <div className="mt-5 flex items-center gap-3">
                {[1, 2].map((s) => (
                  <div
                    key={s}
                    className={`h-2 rounded-full transition-all duration-500 ${
                      s === step
                        ? "w-8 bg-amber-500"
                        : s < step
                        ? "w-2 bg-emerald-500"
                        : "w-2 bg-white/20"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mb-5 flex items-center gap-2.5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400"
                >
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {/* ── Step 1: Credentials ── */}
              {step === 1 && (
                <motion.form
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleStep1}
                  className="space-y-5"
                >
                  <div>
                    <label
                      htmlFor="register-email"
                      className="text-sm font-semibold text-white/80"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                      <input
                        id="register-email"
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
                    <label
                      htmlFor="register-password"
                      className="text-sm font-semibold text-white/80"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                      <input
                        id="register-password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={`${inputClass} pl-11 pr-12`}
                        placeholder="Min. 6 characters"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 transition-colors hover:text-white/60"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="register-confirm"
                      className="text-sm font-semibold text-white/80"
                    >
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                      <input
                        id="register-confirm"
                        type={showConfirm ? "text" : "password"}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`${inputClass} pl-11 pr-12`}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 transition-colors hover:text-white/60"
                      >
                        {showConfirm ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    id="register-next"
                    type="submit"
                    className="group mt-2 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 px-6 text-sm font-semibold text-white shadow-lg shadow-amber-500/30 transition-all hover:opacity-90 hover:shadow-amber-500/50"
                  >
                    Continue
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </motion.form>
              )}

              {/* ── Step 2: Profile ── */}
              {step === 2 && (
                <motion.form
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  <div>
                    <label
                      htmlFor="register-name"
                      className="text-sm font-semibold text-white/80"
                    >
                      Full Name <span className="text-amber-400">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                      <input
                        id="register-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={`${inputClass} pl-11`}
                        placeholder="e.g. John Adeyemi"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="register-phone"
                      className="text-sm font-semibold text-white/80"
                    >
                      Phone Number{" "}
                      <span className="text-white/30 font-normal">(optional)</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                      <input
                        id="register-phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={`${inputClass} pl-11`}
                        placeholder="+234 800 000 0000"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="register-birthday"
                      className="text-sm font-semibold text-white/80"
                    >
                      Birthday{" "}
                      <span className="text-white/30 font-normal">(optional — for greetings)</span>
                    </label>
                    <div className="relative">
                      <CalendarDays className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                      <input
                        id="register-birthday"
                        type="date"
                        value={birthday}
                        onChange={(e) => setBirthday(e.target.value)}
                        className={`${inputClass} pl-11`}
                        style={{ colorScheme: "dark" }}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 mt-2">
                    <button
                      type="button"
                      onClick={() => { setStep(1); setError(""); }}
                      className="h-12 flex-1 rounded-xl border border-white/10 bg-white/5 text-sm font-semibold text-white/60 transition-all hover:bg-white/10"
                    >
                      Back
                    </button>
                    <button
                      id="register-submit"
                      type="submit"
                      disabled={loading}
                      className="group h-12 flex-[2] inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 px-6 text-sm font-semibold text-white shadow-lg shadow-amber-500/30 transition-all hover:opacity-90 hover:shadow-amber-500/50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading ? (
                        <>
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                          Creating account…
                        </>
                      ) : (
                        <>
                          Create Account
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </>
                      )}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            <p className="mt-6 text-center text-sm text-white/40">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                id="register-login-link"
                className="font-semibold text-amber-400 transition-colors hover:text-amber-300"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
