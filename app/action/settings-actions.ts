"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getPlatformSettingsAction() {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No settings found, return default
        return null;
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error fetching platform settings:", error);
    return null;
  }
}

export async function updatePlatformSettingsAction(settings: any) {
  try {
    const supabase = await createAdminClient();
    
    // Attempt to update first (assuming id = 1 or single row exists)
    const { data: existing } = await supabase.from("settings").select("id").limit(1);
    
    let result;
    if (existing && existing.length > 0) {
      const { data, error } = await supabase
        .from("settings")
        .update({ ...settings, updated_at: new Date().toISOString() })
        .eq("id", existing[0].id)
        .select()
        .single();
        
      if (error) throw error;
      result = data;
    } else {
      const { data, error } = await supabase
        .from("settings")
        .insert([{ ...settings, id: 1 }])
        .select()
        .single();
        
      if (error) throw error;
      result = data;
    }

    // Crucial: tell Next.js to clear the cache for the layout so the frontend updates immediately
    revalidatePath("/", "layout");

    return { success: true, data: result };
  } catch (error: any) {
    console.error("Error updating platform settings:", error);
    throw new Error(error.message || "Failed to update platform settings");
  }
}
