import { NextRequest } from "next/server";
import { verifyPayment } from "@/lib/paystack";
import {
  successResponse,
  errorResponse,
  handleApiError,
} from "@/lib/api-response";
import {
  getDonationByReference,
  updateDonationStatus,
} from "@/services/donation-service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get("reference");

    if (!reference) {
      return errorResponse("Missing reference parameter", 400);
    }

    const existingDonation = await getDonationByReference(reference);

    if (!existingDonation) {
      return errorResponse("Donation not found", 404);
    }

    if (existingDonation.status === "completed") {
      return successResponse(existingDonation);
    }

    const verification = await verifyPayment(reference);

    if (!verification.status) {
      await updateDonationStatus(reference, "failed");
      return errorResponse("Payment verification failed", 400);
    }

    const data = verification.data as unknown as Record<string, unknown>;

    await updateDonationStatus(reference, "completed", {
      gatewayReference: (data.gateway_response as string) || undefined,
      paymentMethod: (data.channel as string) || undefined,
      channel: (data.channel as string) || undefined,
      paidAt: new Date((data.paid_at as string) || Date.now()),
      metadata: data,
    });

    const updatedDonation = await getDonationByReference(reference);

    return successResponse(updatedDonation);
  } catch (error) {
    return handleApiError(error);
  }
}
