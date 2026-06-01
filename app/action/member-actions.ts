"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { paginate, type PaginationParams, type PaginatedResult } from "@/lib/db-service";
import { memberSchema, memberUpdateSchema, type MemberInput } from "@/lib/validations";
import type { Member } from "@/types/models";
import { revalidatePath } from "next/cache";

const generateId = () => globalThis.crypto.randomUUID();

export async function getMembersAction(params: PaginationParams): Promise<PaginatedResult<Member>> {
  try {
    const supabase = await createAdminClient();
    const page = params.page || 1;
    const limit = params.limit || 10;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from("members")
      .select("*", { count: "exact" });

    if (params.search) {
      query = query.or(`name.like.%${params.search}%,email.like.%${params.search}%,phone.like.%${params.search}%`);
    }

    // Try ordering by createdAt first, fallback to created_at
    let { data, count, error } = await query
      .order("createdAt", { ascending: false })
      .range(from, to);

    if (error && error.message.includes('column "createdAt" does not exist')) {
      const fallback = await supabase
        .from("members")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(from, to);
      data = fallback.data;
      count = fallback.count;
      error = fallback.error;
    }

    if (error) throw error;

    return {
      data: (data || []).map((member: any) => ({
        id: member.id,
        name: member.name,
        email: member.email,
        phone: member.phone,
        birthday: member.birthday,
        anniversary: member.anniversary,
        createdAt: member.createdAt || member.created_at,
        updatedAt: member.updatedAt || member.updated_at,
      })),
      meta: {
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit),
      },
    };
  } catch (error) {
    console.error("Error fetching members:", error);
    throw new Error("Failed to fetch members");
  }
}

export async function getMemberByIdAction(id: string): Promise<Member> {
  try {
    const supabase = await createAdminClient();
    const { data, error } = await supabase
      .from("members")
      .select("*, donations(*)")
      .eq("id", id)
      .single();

    if (error) throw error;

    // Map snake_case or camelCase to camelCase
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      birthday: data.birthday,
      anniversary: data.anniversary,
      createdAt: data.createdAt || data.created_at,
      updatedAt: data.updatedAt || data.updated_at,
      donations: data.donations?.map((d: any) => ({
        id: d.id,
        amount: d.amount,
        status: d.status,
        reference: d.reference,
        memberId: d.memberId || d.member_id,
        createdAt: d.createdAt || d.created_at,
        updatedAt: d.updatedAt || d.updated_at,
      })) || [],
    };
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

// ── Self-service: get the current user's own member record ──────────────────
export async function getMemberProfileAction(): Promise<Member | null> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const adminClient = await createAdminClient();
    let { data, error } = await adminClient
      .from("members")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error) throw error;

    // Fallback: If no member links by user_id, check if one matches by email and link it
    if (!data && user.email) {
      const { data: byEmail, error: emailError } = await adminClient
        .from("members")
        .select("*")
        .eq("email", user.email)
        .maybeSingle();

      if (emailError) throw emailError;

      if (byEmail) {
        const { data: updatedMember, error: updateError } = await adminClient
          .from("members")
          .update({ user_id: user.id })
          .eq("id", byEmail.id)
          .select()
          .single();

        if (updateError) throw updateError;
        data = updatedMember;
      }
    }

    // Fallback: If still no member, check profiles to return a synthetic profile for staff
    if (!data) {
      const { data: profile } = await adminClient
        .from("profiles")
        .select("name, role")
        .eq("userId", user.id)
        .maybeSingle();

      if (profile && (profile.role === "admin" || profile.role === "media")) {
        return {
          id: "", // Synthetic ID
          name: profile.name || user.email?.split("@")[0] || "Staff",
          email: user.email || "",
          phone: "",
          birthday: null,
          anniversary: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }
      return null;
    }

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      birthday: data.birthday,
      anniversary: data.anniversary,
      createdAt: data.createdAt || data.created_at,
      updatedAt: data.updatedAt || data.updated_at,
    };
  } catch (error) {
    console.error("Error fetching member profile:", error);
    return null;
  }
}

// ── Self-service: update the current user's own member record ───────────────
export async function updateMemberProfileAction(
  data: Partial<MemberInput>
): Promise<Member> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const validatedData = memberUpdateSchema.parse(data);
    const adminClient = await createAdminClient();

    // Locate the member row linked to this auth user
    let { data: existing, error: findError } = await adminClient
      .from("members")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (findError) throw findError;

    // Fallback: Check if there's a member with the same email
    if (!existing && user.email) {
      const { data: byEmail, error: emailError } = await adminClient
        .from("members")
        .select("id")
        .eq("email", user.email)
        .maybeSingle();

      if (emailError) throw emailError;

      if (byEmail) {
        // Link it!
        await adminClient
          .from("members")
          .update({ user_id: user.id })
          .eq("id", byEmail.id);
        existing = byEmail;
      }
    }

    const updateData: Record<string, any> = {};
    if (validatedData.name !== undefined) updateData.name = validatedData.name;
    if (validatedData.phone !== undefined) updateData.phone = validatedData.phone || null;
    if (validatedData.birthday !== undefined) updateData.birthday = validatedData.birthday || null;
    if (validatedData.anniversary !== undefined) updateData.anniversary = validatedData.anniversary || null;
    updateData.updatedAt = new Date().toISOString();

    let member;

    if (existing) {
      // Ensure it is linked
      updateData.user_id = user.id;

      const { data: updatedMember, error } = await adminClient
        .from("members")
        .update(updateData)
        .eq("id", existing.id)
        .select()
        .single();

      if (error) throw error;
      member = updatedMember;
    } else {
      // Create new member on the fly!
      const insertData = {
        id: generateId(),
        name: validatedData.name || user.email?.split("@")[0] || "User",
        email: user.email || "",
        phone: validatedData.phone || null,
        birthday: validatedData.birthday || null,
        anniversary: validatedData.anniversary || null,
        user_id: user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const { data: insertedMember, error } = await adminClient
        .from("members")
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;
      member = insertedMember;
    }

    // Also update name in the profiles table if they have a profile record
    if (validatedData.name !== undefined) {
      const { data: profile } = await adminClient
        .from("profiles")
        .select("id")
        .eq("userId", user.id)
        .maybeSingle();

      if (profile) {
        await adminClient
          .from("profiles")
          .update({ name: validatedData.name, updated_at: new Date().toISOString() })
          .eq("userId", user.id);
      }
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/profile");
    revalidatePath("/admin/profile");
    
    return {
      id: member.id,
      name: member.name,
      email: member.email,
      phone: member.phone,
      birthday: member.birthday,
      anniversary: member.anniversary,
      createdAt: member.createdAt || member.created_at,
      updatedAt: member.updatedAt || member.updated_at,
    };
  } catch (error) {
    console.error("Error updating member profile:", error);
    throw error;
  }
}
