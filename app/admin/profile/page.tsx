"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  ArrowLeft,
  User,
  Phone,
  CalendarDays,
  Heart,
  Save,
  Loader2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";
import {
  getMemberProfileAction,
  updateMemberProfileAction,
} from "@/app/action/member-actions";
import { updatePasswordAction } from "@/app/action/auth-actions";
import type { Member } from "@/types/models";
import { useAuth } from "@/hooks";

// Password strength helpers
function getStrength(pw: string): { score: number; label: string; color: string } {
  if (!pw) return { score: 0, label: "", color: "" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { score, label: "Very Weak", color: "bg-red-500" };
  if (score === 2) return { score, label: "Weak", color: "bg-orange-500" };
  if (score === 3) return { score, label: "Fair", color: "bg-yellow-500" };
  if (score === 4) return { score, label: "Strong", color: "bg-emerald-500" };
  return { score, label: "Very Strong", color: "bg-emerald-600" };
}

export default function AdminProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingPw, setSavingPw] = useState(false);

  // Profile form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [birthday, setBirthday] = useState("");
  const [anniversary, setAnniversary] = useState("");
  const [error, setError] = useState("");

  // Password form state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const strength = getStrength(newPassword);
  const passwordsMatch = !!(newPassword && confirmPassword && newPassword === confirmPassword);
  const passwordMismatch = !!(confirmPassword && newPassword !== confirmPassword);

  useEffect(() => {
    getMemberProfileAction().then((m) => {
      if (m) {
        setMember(m);
        setName(m.name ?? "");
        setPhone(m.phone ?? "");
        setBirthday(m.birthday ? m.birthday.toString().slice(0, 10) : "");
        setAnniversary(
          m.anniversary ? m.anniversary.toString().slice(0, 10) : ""
        );
      }
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) {
      setError("Full name is required.");
      return;
    }
    setSaving(true);
    try {
      await updateMemberProfileAction({
        name: name.trim(),
        phone: phone.trim() || undefined,
        birthday: birthday ? new Date(birthday) : null,
        anniversary: anniversary ? new Date(anniversary) : null,
      });
      toast.success("Profile updated successfully!");
      router.refresh();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to update profile";
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    setSavingPw(true);
    try {
      await updatePasswordAction(newPassword);
      toast.success("Password updated successfully!");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err.message || "Failed to update password.");
    } finally {
      setSavingPw(false);
    }
  };

  const inputClass =
    "mt-1.5 w-full rounded-xl border border-border/50 bg-muted/30 px-4 py-3 text-sm outline-none transition-all focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/20 placeholder:text-muted-foreground/50";

  if (authLoading || loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500/30 border-t-amber-500" />
          <p className="text-sm text-muted-foreground">Loading your profile…</p>
        </div>
      </div>
    );
  }

  const displayName = name || user?.email?.split("@")[0] || "Admin";
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
        <div className="mt-4 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-rose-500 text-xl font-black text-white shadow-lg shadow-amber-500/20">
            {initials}
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Your Profile
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage your personal information
            </p>
          </div>
        </div>
      </motion.div>

      {/* Profile Form Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="rounded-2xl border border-border/40 bg-card shadow-sm p-6 sm:p-8"
      >
        {error && (
          <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-500">
            {error}
          </div>
        )}

        {!member && !loading && (
          <div className="mb-5 rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-600">
            <strong>Note:</strong> Your admin account is not yet linked to a
            member record. Name changes here will be applied once the link is
            established. Contact your database administrator if this persists.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email (read-only from auth) */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Mail className="h-4 w-4 text-amber-500" />
              Email Address
            </label>
            <input
              type="email"
              value={user?.email ?? ""}
              readOnly
              className="mt-1.5 w-full cursor-not-allowed rounded-xl border border-border/30 bg-muted/50 px-4 py-3 text-sm text-muted-foreground"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Email is managed by your authentication provider.
            </p>
          </div>

          {/* Name */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <User className="h-4 w-4 text-amber-500" />
              Full Name <span className="text-amber-500">*</span>
            </label>
            <input
              id="admin-profile-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              placeholder="e.g. John Adeyemi"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Phone className="h-4 w-4 text-amber-500" />
              Phone Number{" "}
              <span className="font-normal text-muted-foreground">
                (optional)
              </span>
            </label>
            <input
              id="admin-profile-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClass}
              placeholder="+234 800 000 0000"
            />
          </div>

          {/* Birthday & Anniversary */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <CalendarDays className="h-4 w-4 text-amber-500" />
                Birthday{" "}
                <span className="font-normal text-muted-foreground">
                  (optional)
                </span>
              </label>
              <input
                id="admin-profile-birthday"
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                className={inputClass}
                style={{ colorScheme: "dark" }}
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Heart className="h-4 w-4 text-rose-500" />
                Anniversary{" "}
                <span className="font-normal text-muted-foreground">
                  (optional)
                </span>
              </label>
              <input
                id="admin-profile-anniversary"
                type="date"
                value={anniversary}
                onChange={(e) => setAnniversary(e.target.value)}
                className={inputClass}
                style={{ colorScheme: "dark" }}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
            <Link
              href="/admin"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-border/40 bg-background px-6 text-sm font-semibold text-muted-foreground transition-all hover:bg-muted"
            >
              Cancel
            </Link>
            <button
              id="admin-profile-save"
              type="submit"
              disabled={saving || !member}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 px-8 text-sm font-semibold text-white shadow-lg shadow-amber-500/25 transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Saving…
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" /> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>

      {/* Change Password Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="rounded-2xl border border-border/40 bg-card shadow-sm p-6 sm:p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
            <Lock className="h-5 w-5 text-amber-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">Change Password</h2>
            <p className="text-sm text-muted-foreground">
              Keep your account secure with a strong password
            </p>
          </div>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-5">
          {/* New Password */}
          <div>
            <label htmlFor="newPassword" className="flex items-center gap-2 text-sm font-semibold text-foreground">
              New Password <span className="text-amber-500">*</span>
            </label>
            <div className="relative mt-1.5">
              <input
                id="newPassword"
                name="newPassword"
                type={showNew ? "text" : "password"}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-xl border border-border/50 bg-muted/30 px-4 py-3 pr-11 text-sm outline-none transition-all focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/20 placeholder:text-muted-foreground/50"
                placeholder="Enter new password"
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {/* Password Strength Meter */}
            {newPassword && (
              <div className="mt-2 space-y-1.5">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                        i <= strength.score ? strength.color : "bg-muted"
                      }`}
                    />
                  ))}
                </div>
                <p className={`text-xs font-medium ${
                  strength.score <= 1 ? "text-red-500" :
                  strength.score === 2 ? "text-orange-500" :
                  strength.score === 3 ? "text-yellow-500" : "text-emerald-500"
                }`}>
                  {strength.label}
                  <span className="text-muted-foreground font-normal ml-1.5">
                    — use 12+ chars, uppercase, numbers &amp; symbols
                  </span>
                </p>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="flex items-center gap-2 text-sm font-semibold text-foreground">
              Confirm New Password <span className="text-amber-500">*</span>
            </label>
            <div className="relative mt-1.5">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirm ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full rounded-xl border bg-muted/30 px-4 py-3 pr-11 text-sm outline-none transition-all placeholder:text-muted-foreground/50 ${
                  passwordMismatch
                    ? "border-red-500/50 focus:border-red-500/60 focus:ring-2 focus:ring-red-500/20"
                    : passwordsMatch
                    ? "border-emerald-500/50 focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20"
                    : "border-border/50 focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/20"
                }`}
                placeholder="Confirm new password"
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {passwordMismatch && (
              <p className="mt-1.5 text-xs text-red-500">Passwords do not match.</p>
            )}
            {passwordsMatch && (
              <p className="mt-1.5 flex items-center gap-1 text-xs text-emerald-500">
                <ShieldCheck className="h-3.5 w-3.5" /> Passwords match
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              id="admin-change-password-btn"
              type="submit"
              disabled={savingPw || passwordMismatch}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 px-8 text-sm font-semibold text-white shadow-lg shadow-amber-500/25 transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {savingPw ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Updating…
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" /> Update Password
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
