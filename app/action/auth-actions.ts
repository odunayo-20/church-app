"use server";

import { createClient } from "@/lib/supabase/server";

export async function updatePasswordAction(password: string) {
  try {
    const supabase = await createClient();
    
    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      throw error;
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error updating password:", error);
    throw new Error(error.message || "Failed to update password");
  }
}

export async function signOutAction() {
  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error("Error signing out:", error);
    throw new Error(error.message || "Failed to sign out");
  }
}
