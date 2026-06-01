"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { paginate, type PaginationParams, type PaginatedResult } from "@/lib/db-service";
import { testimonySchema, testimonyUpdateSchema, type TestimonyInput } from "@/lib/validations";
import type { Testimony } from "@/types/models";
import { revalidatePath } from "next/cache";

const generateId = () => globalThis.crypto.randomUUID();

export interface TestimonyParams extends PaginationParams {
  status?: "pending" | "approved" | "rejected";
  isFeatured?: boolean;
}

export async function getTestimoniesAction(params: TestimonyParams): Promise<PaginatedResult<Testimony>> {
  try {
    const supabase = await createAdminClient();
    
    return await paginate<Testimony>("testimonies", params, {
      supabase,
      orderBy: { column: "createdAt", ascending: false },
      filters: (query) => {
        let q = query;
        if (params.status) {
          q = q.eq("status", params.status);
        }
        if (params.isFeatured !== undefined) {
          q = q.eq("isFeatured", params.isFeatured);
        }
        return q;
      },
    });
  } catch (error) {
    console.error("Error fetching testimonies:", error);
    throw new Error("Failed to fetch testimonies");
  }
}

export async function getTestimonyByIdAction(id: string): Promise<Testimony> {
  try {
    const supabase = await createAdminClient();
    const { data, error } = await supabase
      .from("testimonies")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error fetching testimony ${id}:`, error);
    throw new Error("Failed to fetch testimony");
  }
}

export async function createTestimonyAction(data: TestimonyInput): Promise<Testimony> {
  try {
    const validatedData = testimonySchema.parse(data);
    const supabase = await createAdminClient();
    
    const { data: testimony, error } = await supabase
      .from("testimonies")
      .insert({
        ...validatedData,
        id: generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    
    revalidatePath("/admin/testimonies");
    revalidatePath("/testimonies");
    return testimony;
  } catch (error) {
    console.error("Error creating testimony:", error);
    throw error;
  }
}

export async function updateTestimonyAction(id: string, data: Partial<TestimonyInput>): Promise<Testimony> {
  try {
    const validatedData = testimonyUpdateSchema.parse(data);
    const supabase = await createAdminClient();
    
    const { data: testimony, error } = await supabase
      .from("testimonies")
      .update({
        ...validatedData,
        updatedAt: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    
    revalidatePath("/admin/testimonies");
    revalidatePath("/testimonies");
    return testimony;
  } catch (error) {
    console.error("Error updating testimony:", error);
    throw error;
  }
}

export async function deleteTestimonyAction(id: string): Promise<{ success: true }> {
  try {
    const supabase = await createAdminClient();
    const { error } = await supabase.from("testimonies").delete().eq("id", id);

    if (error) throw error;
    
    revalidatePath("/admin/testimonies");
    revalidatePath("/testimonies");
    return { success: true };
  } catch (error) {
    console.error("Error deleting testimony:", error);
    throw new Error("Failed to delete testimony");
  }
}
