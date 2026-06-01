/**
 * SiteSettings type and safe defaults.
 * ⚠️  NO server-only imports here — this file is imported by client components
 *    (settings-provider.tsx). Keep it free of next/headers, supabase/server, etc.
 *
 * The actual Supabase fetcher lives in lib/settings-server.ts (server-only).
 */

export interface SiteSettings {
  churchName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  facebookUrl: string;
  twitterUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
}

export const DEFAULT_SETTINGS: SiteSettings = {
  churchName: process.env.NEXT_PUBLIC_APP_NAME || "Grace Community",
  contactEmail: "hello@gracecommunity.org",
  contactPhone: "+234 800 123 4567",
  address: "123 Grace Avenue, Lagos, Nigeria",
  facebookUrl: "",
  twitterUrl: "",
  instagramUrl: "",
  youtubeUrl: "",
};
