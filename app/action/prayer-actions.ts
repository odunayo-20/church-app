"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { paginate, type PaginationParams, type PaginatedResult } from "@/lib/db-service";
import { prayerRequestSchema, prayerRequestUpdateSchema, type PrayerRequestInput } from "@/lib/validations";
import type { PrayerRequest } from "@/types/models";
import { revalidatePath } from "next/cache";

const generateId = () => globalThis.crypto.randomUUID();

export async function getPrayerRequestsAction(params: PaginationParams): Promise<PaginatedResult<PrayerRequest>> {
  try {
    const supabase = await createAdminClient();
    return await paginate<PrayerRequest>("prayer_requests", params, {
      supabase,
      orderBy: { column: "createdAt", ascending: false },
    });
  } catch (error) {
    console.error("Error fetching prayer requests:", error);
    throw new Error("Failed to fetch prayer requests");
  }
}

export async function getPrayerRequestByIdAction(id: string): Promise<PrayerRequest> {
  try {
    const supabase = await createAdminClient();
    const { data, error } = await supabase
      .from("prayer_requests")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error fetching prayer request ${id}:`, error);
    throw new Error("Failed to fetch prayer request");
  }
}

export async function createPrayerRequestAction(data: PrayerRequestInput): Promise<PrayerRequest> {
  try {
    const validatedData = prayerRequestSchema.parse(data);
    const supabase = await createAdminClient(); // Using admin client because public might not have insert permissions
    
    const { data: request, error } = await supabase
      .from("prayer_requests")
      .insert({
        ...validatedData,
        id: generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    
    revalidatePath("/admin/prayer-requests");
    return request;
  } catch (error) {
    console.error("Error creating prayer request:", error);
    throw error;
  }
}

export async function updatePrayerRequestAction(id: string, data: Partial<PrayerRequestInput>): Promise<PrayerRequest> {
  try {
    const validatedData = prayerRequestUpdateSchema.parse(data);
    const supabase = await createAdminClient();
    
    const { data: request, error } = await supabase
      .from("prayer_requests")
      .update({
        ...validatedData,
        updatedAt: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    
    revalidatePath("/admin/prayer-requests");
    return request;
  } catch (error) {
    console.error("Error updating prayer request:", error);
    throw error;
  }
}

export async function deletePrayerRequestAction(id: string): Promise<{ success: true }> {
  try {
    const supabase = await createAdminClient();
    const { error } = await supabase.from("prayer_requests").delete().eq("id", id);

    if (error) throw error;
    
    revalidatePath("/admin/prayer-requests");
    return { success: true };
  } catch (error) {
    console.error("Error deleting prayer request:", error);
    throw new Error("Failed to delete prayer request");
  }
}
