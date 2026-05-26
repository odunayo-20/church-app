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
} from "lucide-react";
import {
  getMemberProfileAction,
  updateMemberProfileAction,
} from "@/app/action/member-actions";
import type { Member } from "@/types/models";
import { useAuth } from "@/hooks";

export default function AdminProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
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
    </div>
  );
}
