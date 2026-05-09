"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { paginate, type PaginationParams, type PaginatedResult } from "@/lib/db-service";
import { memberSchema, memberUpdateSchema, type MemberInput } from "@/lib/validations";
import type { Member } from "@/types/models";
import { revalidatePath } from "next/cache";

const generateId = () => globalThis.crypto.randomUUID();

export async function getMembersAction(params: PaginationParams): Promise<PaginatedResult<Member>> {
  try {
    const result = await paginate<Member>("members", params, {
      orderBy: { column: "createdAt", ascending: false }
    });
    return result;
  } catch (error) {
    console.error("Error fetching members:", error);
    throw new Error("Failed to fetch members");
  }
}

export async function getMemberByIdAction(id: string): Promise<Member> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("members")
      .select("*, donations(*)")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error fetching member ${id}:`, error);
    throw new Error("Failed to fetch member");
  }
}

export async function createMemberAction(data: MemberInput): Promise<Member> {
  try {
    const validatedData = memberSchema.parse(data);
    const supabase = await createAdminClient();
    
    const insertData = {
      id: generateId(),
      name: validatedData.name,
      email: validatedData.email,
      phone: validatedData.phone || null,
      birthday: validatedData.birthday || null,
      anniversary: validatedData.anniversary || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const { data: member, error } = await supabase
      .from("members")
      .insert(insertData)
      .select()
      .single();

    if (error) throw error;
    
    revalidatePath("/admin/members");
    return member;
  } catch (error) {
    console.error("Error creating member:", error);
    throw error;
  }
}

export async function updateMemberAction(id: string, data: Partial<MemberInput>): Promise<Member> {
  try {
    const validatedData = memberUpdateSchema.parse(data);
    const supabase = await createAdminClient();
    
    const updateData: Record<string, any> = {};
    if (validatedData.name !== undefined) updateData.name = validatedData.name;
    if (validatedData.email !== undefined) updateData.email = validatedData.email;
    if (validatedData.phone !== undefined) updateData.phone = validatedData.phone || null;
    if (validatedData.birthday !== undefined) updateData.birthday = validatedData.birthday || null;
    if (validatedData.anniversary !== undefined) updateData.anniversary = validatedData.anniversary || null;
    
    updateData.updatedAt = new Date().toISOString();

    const { data: member, error } = await supabase
      .from("members")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    
    revalidatePath("/admin/members");
    return member;
  } catch (error) {
    console.error("Error updating member:", error);
    throw error;
  }
}

export async function deleteMemberAction(id: string): Promise<{ success: true }> {
  try {
    const supabase = await createAdminClient();
    const { error } = await supabase.from("members").delete().eq("id", id);

    if (error) throw error;
    
    revalidatePath("/admin/members");
    return { success: true };
  } catch (error) {
    console.error("Error deleting member:", error);
    throw new Error("Failed to delete member");
  }
}
