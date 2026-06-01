/**
 * Server-only settings fetcher.
 * ⚠️  DO NOT import this from client components — it depends on next/headers.
 *    Use getSiteSettings() only from Server Components, layouts, and Route Handlers.
 *
 * Client components receive settings via SiteSettingsProvider (React context).
 */

import { createClient } from "@/lib/supabase/server";
import { type SiteSettings, DEFAULT_SETTINGS } from "@/lib/settings";
import { unstable_noStore as noStore } from "next/cache";

/**
 * Fetches platform settings from Supabase and normalizes to camelCase.
 * Falls back to DEFAULT_SETTINGS if the table is missing or empty.
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  noStore(); // Explicitly opt out of Next.js fetch caching
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .limit(1)
      .maybeSingle();

    console.log("🔥 [getSiteSettings] DB Fetch Result:", { data, error });

    if (error || !data) return DEFAULT_SETTINGS;

    return {
      churchName:   data.church_name   || DEFAULT_SETTINGS.churchName,
      contactEmail: data.contact_email || DEFAULT_SETTINGS.contactEmail,
      contactPhone: data.contact_phone || DEFAULT_SETTINGS.contactPhone,
      address:      data.address       || DEFAULT_SETTINGS.address,
      facebookUrl:  data.facebook_url  || "",
      twitterUrl:   data.twitter_url   || "",
      instagramUrl: data.instagram_url || "",
      youtubeUrl:   data.youtube_url   || "",
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}
