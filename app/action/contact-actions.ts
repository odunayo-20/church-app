"use server";

import { createAdminClient } from "@/lib/supabase/server";
import { paginate, type PaginationParams, type PaginatedResult } from "@/lib/db-service";
import { contactMessageUpdateSchema } from "@/lib/validations";
import type { ContactMessage } from "@/types/models";
import { revalidatePath } from "next/cache";
import type { ContactMessageInput } from "@/lib/validations";

export async function getContactMessagesAction(params: PaginationParams): Promise<PaginatedResult<ContactMessage>> {
  try {
    const supabase = await createAdminClient();
    const result = await paginate<any>("contact_messages", params, {
      supabase,
      orderBy: { column: "created_at", ascending: false },
    });

    return {
      ...result,
      data: result.data.map((msg: any) => ({
        ...msg,
        createdAt: msg.created_at,
        updatedAt: msg.updated_at,
      })) as ContactMessage[],
    };
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    throw new Error("Failed to fetch contact messages");
  }
}

export async function getContactMessageByIdAction(id: string): Promise<ContactMessage> {
  try {
    const supabase = await createAdminClient();
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return {
      ...data,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    } as ContactMessage;
  } catch (error) {
    console.error(`Error fetching contact message ${id}:`, error);
    throw new Error("Failed to fetch contact message");
  }
}

export async function updateContactMessageAction(id: string, data: Partial<ContactMessageInput>): Promise<ContactMessage> {
  try {
    const validatedData = contactMessageUpdateSchema.parse(data);
    const supabase = await createAdminClient();
    
    const { data: request, error } = await supabase
      .from("contact_messages")
      .update({
        ...validatedData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    
    revalidatePath("/admin/contacts");
    return {
      ...request,
      createdAt: request.created_at,
      updatedAt: request.updated_at,
    } as ContactMessage;
  } catch (error) {
    console.error("Error updating contact message:", error);
    throw error;
  }
}

export async function deleteContactMessageAction(id: string): Promise<{ success: true }> {
  try {
    const supabase = await createAdminClient();
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);

    if (error) throw error;
    
    revalidatePath("/admin/contacts");
    return { success: true };
  } catch (error) {
    console.error("Error deleting contact message:", error);
    throw new Error("Failed to delete contact message");
  }
}
