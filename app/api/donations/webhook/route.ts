import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
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

    if (event.event === "charge.success") {
      const data = event.data;
      const reference = data.reference;

      const existingDonation = await prisma.donation.findUnique({
        where: { reference },
      });

      if (!existingDonation) {
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
        await prisma.donation.update({
          where: { reference },
          data: { status: "failed" },
        });
        return errorResponse("Payment verification failed", 400);
      }

      await prisma.donation.update({
        where: { reference },
        data: {
          status: "completed",
          gatewayReference: data.gateway_response || undefined,
          paymentMethod: data.channel || undefined,
          channel: data.channel || undefined,
          paidAt: new Date(data.paid_at || data.createdAt),
          metadata: data,
        },
      });
    }

    return successResponse({ message: "Webhook processed" });
  } catch (error) {
    console.error("Webhook error:", error);
    return errorResponse("Webhook processing failed", 500);
  }
}
