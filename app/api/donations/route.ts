import { NextRequest } from "next/server";
import { initializePayment } from "@/lib/paystack";
import { createDonationAction } from "@/app/action/donation-actions";
import { successResponse, errorResponse } from "@/lib/api-response";
import { config } from "@/lib/config";

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, donorName, donorEmail, memberId, metadata } = body;

    if (!amount || !donorName || !donorEmail) {
      return errorResponse("Missing required fields", 400);
    }

    const reference = `DN-${Math.random().toString(36).substring(2)}-${Date.now()}`;

    // 1. Create pending donation record via our action logic
    await createDonationAction({
      amount,
      reference,
      donorName,
      donorEmail,
      memberId,
      status: "pending",
    });

    // 2. Initialize Paystack payment
    const callbackUrl = `${config.env.baseUrl}/donations/callback`;
    const paystackResponse = await initializePayment({
      email: donorEmail,
      amount,
      reference,
      callbackUrl,
      metadata: {
        ...metadata,
        donorName,
        donorEmail,
        memberId,
      },
    });

    if (!paystackResponse.status) {
      return errorResponse(paystackResponse.message, 400);
    }

    return successResponse({
      authorizationUrl: paystackResponse.data.authorization_url,
      reference,
    });
  } catch (error) {
    console.error("Donation initialization error:", error);
    return errorResponse("Failed to initialize payment", 500);
  }
}
