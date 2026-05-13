"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getProfilesAction() {
  try {
    const supabase = await createAdminClient();
    
    // Profiles table has id, userId, email, name, avatarUrl, role, createdAt, updatedAt
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("createdAt", { ascending: false });

    if (error) {
      if (error.message.includes('column "createdAt" does not exist')) {
        const fallback = await supabase
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false });
        if (fallback.error) throw fallback.error;
        return fallback.data;
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error fetching profiles:", error);
    throw new Error("Failed to fetch profiles");
  }
}

export async function updateProfileRoleAction(id: string, role: string) {
  try {
    const supabase = await createAdminClient();
    
    const { data, error } = await supabase
      .from("profiles")
      .update({ role, updatedAt: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    
    revalidatePath("/admin/settings/roles");
    return data;
  } catch (error) {
    console.error("Error updating profile role:", error);
    throw new Error("Failed to update profile role");
  }
}
