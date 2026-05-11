"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { paginate, type PaginationParams, type PaginatedResult } from "@/lib/db-service";
import { donationSchema, donationUpdateSchema, type DonationInput } from "@/lib/validations";
import type { Donation } from "@/types/models";
import { revalidatePath } from "next/cache";
import { verifyPayment } from "@/lib/paystack";

// --- Helpers ---

const mapDonation = (d: any): Donation => ({
  ...d,
  memberId: d.member_id,
  donorName: d.donor_name,
  donorEmail: d.donor_email,
  gatewayReference: d.gateway_reference,
  paymentMethod: d.payment_method,
  paidAt: d.paid_at,
  createdAt: d.created_at,
  updatedAt: d.updated_at,
  member: d.member ? {
    ...d.member,
    createdAt: d.member.created_at,
    updatedAt: d.member.updated_at,
  } : undefined
});

// --- Actions ---

export async function getDonationsAction(params: PaginationParams): Promise<PaginatedResult<Donation>> {
  try {
    const supabase = await createAdminClient();
    const result = await paginate<any>("donations", params, {
      supabase,
      select: "*, member:members(*)",
      orderBy: { column: "created_at", ascending: false }
    });

    return {
      ...result,
      data: result.data.map(mapDonation)
    };
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
    return mapDonation(data);
  } catch (error) {
    console.error(`Error fetching donation ${id}:`, error);
    throw new Error("Failed to fetch donation");
  }
}

export async function createDonationAction(data: DonationInput): Promise<Donation> {
  try {
    const validatedData = donationSchema.parse(data);
    const supabase = await createAdminClient();
    
    const now = new Date().toISOString();
    const { data: donation, error } = await supabase
      .from("donations")
      .insert({
        id: globalThis.crypto.randomUUID(),
        amount: validatedData.amount,
        reference: validatedData.reference,
        status: validatedData.status ?? "pending",
        member_id: validatedData.memberId || null,
        donor_name: validatedData.donorName ?? null,
        donor_email: validatedData.donorEmail ?? null,
        created_at: now,
        updated_at: now,
      })
      .select()
      .single();

    if (error) throw error;
    
    revalidatePath("/admin/donations");
    return mapDonation(donation);
  } catch (error) {
    console.error("Error creating donation:", error);
    throw error;
  }
}

export async function updateDonationAction(id: string, data: Partial<DonationInput>): Promise<Donation> {
  try {
    const validatedData = donationUpdateSchema.parse(data);
    const supabase = await createAdminClient();
    
    const updateData: any = {};
    if (validatedData.amount !== undefined) updateData.amount = validatedData.amount;
    if (validatedData.reference !== undefined) updateData.reference = validatedData.reference;
    if (validatedData.status !== undefined) updateData.status = validatedData.status;
    if (validatedData.memberId !== undefined) updateData.member_id = validatedData.memberId || null;
    if (validatedData.donorName !== undefined) updateData.donor_name = validatedData.donorName || null;
    if (validatedData.donorEmail !== undefined) updateData.donor_email = validatedData.donorEmail || null;

    const { data: donation, error } = await supabase
      .from("donations")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    
    revalidatePath("/admin/donations");
    return mapDonation(donation);
  } catch (error) {
    console.error("Error updating donation:", error);
    throw error;
  }
}

import { donationReceiptEmail } from "@/lib/email-templates";
import { sendEmail } from "@/lib/email";

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
    
    // 1. Fetch current status and donor info to avoid double-emails
    const { data: currentDonation, error: fetchError } = await supabase
      .from("donations")
      .select("*")
      .eq("reference", reference)
      .single();

    if (fetchError) throw fetchError;

    const { metadata, ...rest } = gatewayData ?? {};
    
    const updateData: any = {
      status,
    };

    if (rest.gatewayReference) updateData.gateway_reference = rest.gatewayReference;
    if (rest.paymentMethod) updateData.payment_method = rest.paymentMethod;
    if (rest.channel) updateData.channel = rest.channel;
    if (rest.paidAt) updateData.paid_at = rest.paidAt.toISOString();
    if (metadata) updateData.metadata = metadata;

    const { data: updatedDonation, error: updateError } = await supabase
      .from("donations")
      .update(updateData)
      .eq("reference", reference)
      .select()
      .single();

    if (updateError) throw updateError;

    // 2. Send "Thank You" email if status just became 'completed'
    if (currentDonation.status !== "completed" && status === "completed") {
      const emailTemplate = donationReceiptEmail(
        updatedDonation.donor_name || "Generous Donor",
        Number(updatedDonation.amount),
        updatedDonation.reference
      );

      await sendEmail({
        to: updatedDonation.donor_email,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
      });
    }
    
    revalidatePath("/admin/donations");
    return mapDonation(updatedDonation);
  } catch (error) {
    console.error("Error updating donation status:", error);
    throw error;
  }
}

export async function verifyDonationAction(reference: string) {
  try {
    const supabase = await createAdminClient();
    
    // 1. Check if already completed to avoid double processing
    const { data: existing } = await supabase
      .from("donations")
      .select("status")
      .eq("reference", reference)
      .single();

    if (existing?.status === "completed") {
      return { success: true, message: "Donation already verified" };
    }

    // 2. Verify with Paystack
    const result = await verifyPayment(reference);
    if (result.status) {
      const data = result.data as any;
      
      // 3. Update with full metadata
      return await updateDonationStatusAction(reference, "completed", {
        gatewayReference: data.reference || null, // Paystack's transaction reference
        paymentMethod: data.channel || null,
        channel: data.channel || null,
        paidAt: data.paid_at ? new Date(data.paid_at) : new Date(),
        metadata: data,
      });
    }
    throw new Error("Payment verification failed");
  } catch (error) {
    console.error("Error verifying donation:", error);
    // Only mark as failed if it wasn't already completed
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
