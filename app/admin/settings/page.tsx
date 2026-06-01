"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  ArrowLeft,
  Settings,
  Mail,
  Phone,
  MapPin,
  Building,
  Save,
  Loader2,
  Globe
} from "lucide-react";
import {
  getPlatformSettingsAction,
  updatePlatformSettingsAction,
} from "@/app/action/settings-actions";

export default function PlatformSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [churchName, setChurchName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [address, setAddress] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [twitterUrl, setTwitterUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");

  useEffect(() => {
    getPlatformSettingsAction().then((settings: any) => {
      if (settings) {
        setChurchName(settings.churchName || settings.church_name || "");
        setContactEmail(settings.contactEmail || settings.contact_email || "");
        setContactPhone(settings.contactPhone || settings.contact_phone || "");
        setAddress(settings.address || "");
        setFacebookUrl(settings.facebookUrl || settings.facebook_url || "");
        setTwitterUrl(settings.twitterUrl || settings.twitter_url || "");
        setInstagramUrl(settings.instagramUrl || settings.instagram_url || "");
      }
      setLoading(false);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updatePlatformSettingsAction({
        church_name: churchName,
        contact_email: contactEmail,
        contact_phone: contactPhone,
        address,
        facebook_url: facebookUrl,
        twitter_url: twitterUrl,
        instagram_url: instagramUrl,
      });
      toast.success("Platform settings updated successfully!");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to update platform settings");
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
          <p className="text-sm text-muted-foreground">Loading settings…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
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
            <Settings className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Platform Settings
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage global configurations and contact details
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
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* General Information */}
          <div className="space-y-6">
            <h2 className="text-lg font-bold border-b pb-2">General Information</h2>
            
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Building className="h-4 w-4 text-amber-500" />
                  Church/Organization Name <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={churchName}
                  onChange={(e) => setChurchName(e.target.value)}
                  className={inputClass}
                  placeholder="e.g. Grace Fellowship Church"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Mail className="h-4 w-4 text-amber-500" />
                  Contact Email <span className="text-amber-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className={inputClass}
                  placeholder="contact@church.com"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Phone className="h-4 w-4 text-amber-500" />
                  Contact Phone
                </label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className={inputClass}
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <MapPin className="h-4 w-4 text-amber-500" />
                  Physical Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={inputClass}
                  placeholder="123 Faith Avenue, City, State, ZIP"
                />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-6">
            <h2 className="text-lg font-bold border-b pb-2">Social Media Links</h2>
            
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Globe className="h-4 w-4 text-amber-500" />
                  Facebook URL
                </label>
                <input
                  type="url"
                  value={facebookUrl}
                  onChange={(e) => setFacebookUrl(e.target.value)}
                  className={inputClass}
                  placeholder="https://facebook.com/..."
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Globe className="h-4 w-4 text-amber-500" />
                  Twitter / X URL
                </label>
                <input
                  type="url"
                  value={twitterUrl}
                  onChange={(e) => setTwitterUrl(e.target.value)}
                  className={inputClass}
                  placeholder="https://twitter.com/..."
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Globe className="h-4 w-4 text-amber-500" />
                  Instagram URL
                </label>
                <input
                  type="url"
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                  className={inputClass}
                  placeholder="https://instagram.com/..."
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 pt-6 border-t sm:flex-row sm:justify-end">
            <Link
              href="/admin"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-border/40 bg-background px-6 text-sm font-semibold text-muted-foreground transition-all hover:bg-muted"
            >
              Cancel
            </Link>
            <button
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
                 <Save className="h-4 w-4" /> Save Settings
               </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
