"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { paginate, type PaginationParams, type PaginatedResult } from "@/lib/db-service";
import { donationSchema, donationUpdateSchema, type DonationInput } from "@/lib/validations";
import type { Donation } from "@/types/models";
import { revalidatePath } from "next/cache";
import { verifyPayment } from "@/lib/paystack";

const generateId = () => globalThis.crypto.randomUUID();

export async function getDonationsAction(params: PaginationParams): Promise<PaginatedResult<Donation>> {
  try {
    const result = await paginate<Donation>("donations", params, {
      select: "*, member:members(*)",
      orderBy: { column: "createdAt", ascending: false }
    });
    return result;
  } catch (error) {
    console.error("Error fetching donations:", error);
    throw new Error("Failed to fetch donations");
  }
}

export async function getDonationByIdAction(id: string): Promise<Donation> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("donations")
      .select("*, member:members(*)")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error fetching donation ${id}:`, error);
    throw new Error("Failed to fetch donation");
  }
}

export async function getDonationByReferenceAction(reference: string): Promise<Donation | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("donations")
      .select("*, member:members(*)")
      .eq("reference", reference)
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error fetching donation ref ${reference}:`, error);
    throw new Error("Failed to fetch donation");
  }
}

export async function createDonationAction(data: DonationInput): Promise<Donation> {
  try {
    const validatedData = donationSchema.parse(data);
    const supabase = await createAdminClient();
    const { data: donation, error } = await supabase
      .from("donations")
      .insert({
        id: generateId(),
        amount: validatedData.amount,
        reference: validatedData.reference,
        status: validatedData.status ?? "pending",
        memberId: validatedData.memberId || null,
        donorName: validatedData.donorName ?? null,
        donorEmail: validatedData.donorEmail ?? null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    
    revalidatePath("/admin/donations");
    return donation;
  } catch (error) {
    console.error("Error creating donation:", error);
    throw error;
  }
}

export async function updateDonationAction(id: string, data: Partial<DonationInput>): Promise<Donation> {
  try {
    const validatedData = donationUpdateSchema.parse(data);
    const supabase = await createAdminClient();
    
    const updateData: Record<string, any> = {};
    if (validatedData.amount !== undefined) updateData.amount = validatedData.amount;
    if (validatedData.reference !== undefined) updateData.reference = validatedData.reference;
    if (validatedData.status !== undefined) updateData.status = validatedData.status;
    if (validatedData.memberId !== undefined) updateData.memberId = validatedData.memberId || null;
    if (validatedData.donorName !== undefined) updateData.donorName = validatedData.donorName || null;
    if (validatedData.donorEmail !== undefined) updateData.donorEmail = validatedData.donorEmail || null;
    
    updateData.updatedAt = new Date().toISOString();

    const { data: donation, error } = await supabase
      .from("donations")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    
    revalidatePath("/admin/donations");
    return donation;
  } catch (error) {
    console.error("Error updating donation:", error);
    throw error;
  }
}

export async function updateDonationStatusAction(
  reference: string,
  status: "completed" | "failed" | "refunded",
  gatewayData?: {
    gatewayReference?: string;
    paymentMethod?: string;
    channel?: string;
    paidAt?: Date;
    metadata?: Record<string, unknown>;
  },
): Promise<Donation> {
  try {
    const supabase = await createAdminClient();
    const { metadata, ...rest } = gatewayData ?? {};
    
    const updateData: Record<string, any> = {
      status,
      updatedAt: new Date().toISOString(),
    };

    if (rest.gatewayReference) updateData.gatewayReference = rest.gatewayReference;
    if (rest.paymentMethod) updateData.paymentMethod = rest.paymentMethod;
    if (rest.channel) updateData.channel = rest.channel;
    if (rest.paidAt) updateData.paidAt = rest.paidAt.toISOString();

    if (metadata) {
      updateData.metadata = metadata;
    }

    const { data: donation, error } = await supabase
      .from("donations")
      .update(updateData)
      .eq("reference", reference)
      .select()
      .single();

    if (error) throw error;
    
    revalidatePath("/admin/donations");
    return donation;
  } catch (error) {
    console.error("Error updating donation status:", error);
    throw error;
  }
}

export async function verifyDonationAction(reference: string) {
  try {
    const result = await verifyPayment(reference);
    if (result.status) {
      const data = result.data as any;
      return await updateDonationStatusAction(reference, "completed", {
        gatewayReference: data.gateway_response || null,
        paymentMethod: data.channel || null,
        channel: data.channel || null,
        paidAt: new Date(data.paid_at || data.created_at),
        metadata: data,
      });
    }
    throw new Error("Payment verification failed");
  } catch (error) {
    console.error("Error verifying donation:", error);
    await updateDonationStatusAction(reference, "failed");
    throw error;
  }
}

export async function deleteDonationAction(id: string): Promise<boolean> {
  try {
    const supabase = await createAdminClient();
    const { error } = await supabase.from("donations").delete().eq("id", id);

    if (error) throw error;
    
    revalidatePath("/admin/donations");
    return true;
  } catch (error) {
    console.error("Error deleting donation:", error);
    throw new Error("Failed to delete donation");
  }
}

export async function getDonationStatsAction() {
  try {
    const supabase = await createAdminClient();
    
    const { data: stats, error } = await supabase
      .from("donations")
      .select("status, amount");

    if (error) throw error;

    const summary = (stats || []).reduce((acc, d) => {
      acc.totalAmount = (acc.totalAmount || 0) + (d.status === "completed" ? Number(d.amount) : 0);
      acc.counts = acc.counts || {};
      acc.counts[d.status] = (acc.counts[d.status] || 0) + 1;
      return acc;
    }, { totalAmount: 0, counts: {} as Record<string, number> });

    return summary;
  } catch (error) {
    console.error("Error fetching donation stats:", error);
    throw new Error("Failed to fetch donation stats");
  }
}
