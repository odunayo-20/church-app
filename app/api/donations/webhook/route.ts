import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { verifyPaystackWebhookSignature } from "@/lib/crypto";
import { successResponse, errorResponse } from "@/lib/api-response";
import { verifyPayment } from "@/lib/paystack";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text();
    const signature = request.headers.get("x-paystack-signature");

    if (!signature) {
      return errorResponse("Missing webhook signature", 400);
    }

    const isValid = verifyPaystackWebhookSignature(
      payload,
      signature,
      process.env.PAYSTACK_WEBHOOK_SECRET!,
    );

    if (!isValid) {
      return errorResponse("Invalid webhook signature", 401);
    }

    const event = JSON.parse(payload);
    const supabase = await createAdminClient();

    if (event.event === "charge.success") {
      const data = event.data;
      const reference = data.reference;

      const { data: existingDonation, error: fetchError } = await supabase
        .from("donations")
        .select("*")
        .eq("reference", reference)
        .single();

      if (fetchError || !existingDonation) {
        return errorResponse("Donation not found", 404);
      }

      if (existingDonation.status === "completed") {
        return successResponse({ message: "Donation already processed" });
      }

      const verification = await verifyPayment(reference);

      if (
        !verification.status ||
        verification.data.amount !==
          Math.round(Number(existingDonation.amount) * 100)
      ) {
        await supabase
          .from("donations")
          .update({ status: "failed" })
          .eq("reference", reference);
        return errorResponse("Payment verification failed", 400);
      }

      await supabase
        .from("donations")
        .update({
          status: "completed",
          gatewayReference: data.gateway_response || null,
          paymentMethod: data.channel || null,
          channel: data.channel || null,
          paidAt: new Date(data.paid_at || data.created_at).toISOString(),
          metadata: data,
        })
        .eq("reference", reference);
    }

    return successResponse({ message: "Webhook processed" });
  } catch (error) {
    console.error("Webhook error:", error);
    return errorResponse("Webhook processing failed", 500);
  }
}
