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
} from "lucide-react";
import {
  getMemberProfileAction,
  updateMemberProfileAction,
} from "@/app/action/member-actions";
import type { Member } from "@/types/models";

export default function ProfilePage() {
  const router = useRouter();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [birthday, setBirthday] = useState("");
  const [anniversary, setAnniversary] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getMemberProfileAction().then((m) => {
      if (m) {
        setMember(m);
        setName(m.name ?? "");
        setPhone(m.phone ?? "");
        // Dates come as ISO strings; extract just the date part for <input type="date">
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
      const msg = err instanceof Error ? err.message : "Failed to update profile";
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "mt-1.5 w-full rounded-xl border border-border/50 bg-muted/30 px-4 py-3 text-sm outline-none transition-all focus:border-amber-500/60 focus:ring-2 focus:ring-amber-500/20 placeholder:text-muted-foreground/50";

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500/30 border-t-amber-500" />
          <p className="text-sm text-muted-foreground">Loading your profile…</p>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-500/10 text-amber-500 mb-6">
          <User className="h-10 w-10" />
        </div>
        <h2 className="text-2xl font-bold">No Member Record Found</h2>
        <p className="mt-2 max-w-sm text-muted-foreground text-sm">
          Your account is not yet linked to a member record. Please contact an
          administrator.
        </p>
        <Link
          href="/dashboard"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-semibold text-white hover:bg-amber-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-10 px-4">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
          <div className="mt-4 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-rose-500 text-xl font-black text-white shadow-lg shadow-amber-500/20">
              {name.charAt(0).toUpperCase() || "?"}
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">
                My Profile
              </h1>
              <p className="text-sm text-muted-foreground">
                Update your personal details
              </p>
            </div>
          </div>
        </motion.div>

        {/* Form Card */}
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

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <User className="h-4 w-4 text-amber-500" />
                Full Name <span className="text-amber-500">*</span>
              </label>
              <input
                id="profile-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
                placeholder="e.g. John Adeyemi"
              />
            </div>

            {/* Email (read-only) */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                Email Address
              </label>
              <input
                type="email"
                value={member.email}
                readOnly
                className="mt-1.5 w-full cursor-not-allowed rounded-xl border border-border/30 bg-muted/50 px-4 py-3 text-sm text-muted-foreground"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Email cannot be changed here.
              </p>
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
                id="profile-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputClass}
                placeholder="+234 800 000 0000"
              />
            </div>

            {/* Birthday & Anniversary side-by-side */}
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
                  id="profile-birthday"
                  type="date"
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                  className={inputClass}
                  style={{ colorScheme: "dark" }}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  We&apos;ll send you birthday greetings 🎂
                </p>
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
                  id="profile-anniversary"
                  type="date"
                  value={anniversary}
                  onChange={(e) => setAnniversary(e.target.value)}
                  className={inputClass}
                  style={{ colorScheme: "dark" }}
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  We&apos;ll celebrate your special day 💍
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
              <Link
                href="/dashboard"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-border/40 bg-background px-6 text-sm font-semibold text-muted-foreground transition-all hover:bg-muted"
              >
                Cancel
              </Link>
              <button
                id="profile-save"
                type="submit"
                disabled={saving}
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

        {/* Info card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 rounded-2xl border border-amber-500/15 bg-amber-500/5 p-5 text-sm text-muted-foreground"
        >
          <p className="font-semibold text-amber-500 mb-1">Why this matters</p>
          <p>
            Your name and birthday help us personalise your experience —
            including birthday greetings and anniversary messages sent directly
            to your email. Your information is kept private and only used by the
            church team.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
