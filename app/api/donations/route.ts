import { NextRequest } from "next/server";
import { getDonations, createDonation } from "@/services/donation-service";
import { donationSchema, donationInitSchema } from "@/lib/validations";
import { successResponse, handleApiError } from "@/lib/api-response";
import { initializePayment } from "@/lib/paystack";
import { generateDonationReference } from "@/lib/crypto";
import {
  withAuthValidation,
  getPaginationParams,
  requireAuth,
} from "@/lib/api-handlers";
import { config } from "@/lib/config";

export async function GET(request: NextRequest) {
  const user = await requireAuth(request, true);
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }
  const pagination = getPaginationParams(request);
  const result = await getDonations({ ...pagination });
  return successResponse(result);
}

export const POST = withAuthValidation(
  donationSchema,
  async (_request, _context, validated) => {
    const donation = await createDonation(validated);
    return successResponse(donation, 201);
  },
  true,
);

export const PUT = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const validated = donationInitSchema.parse(body);

    const existingDonation = await createDonation({
      amount: validated.amount,
      reference: generateDonationReference(),
      donorName: validated.donorName,
      donorEmail: validated.donorEmail,
      memberId: validated.memberId || undefined,
    });

    const payment = await initializePayment({
      email: validated.donorEmail,
      amount: validated.amount,
      reference: existingDonation.reference,
      callbackUrl: `${config.env.baseUrl}/donations/callback`,
      metadata: {
        donationId: existingDonation.id,
        donorName: validated.donorName,
        ...validated.metadata,
      },
    });

    return successResponse({
      authorizationUrl: payment.data.authorization_url,
      accessCode: payment.data.access_code,
      reference: payment.data.reference,
      donationId: existingDonation.id,
    });
  } catch (error) {
    return handleApiError(error);
  }
};
