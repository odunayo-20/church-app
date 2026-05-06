import { NextRequest } from "next/server";
import {
  getDonationById,
  updateDonation,
  deleteDonation,
} from "@/services/donation-service";
import { donationUpdateSchema } from "@/lib/validations";
import { successResponse, handleApiError } from "@/lib/api-response";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const donation = await getDonationById(id);

    if (!donation) {
      return Response.json(
        { success: false, message: "Donation not found" },
        { status: 404 },
      );
    }

    return successResponse(donation);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validated = donationUpdateSchema.parse(body);
    const donation = await updateDonation(id, validated);
    return successResponse(donation);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await deleteDonation(id);
    return Response.json({ success: true, message: "Donation deleted" });
  } catch (error) {
    return handleApiError(error);
  }
}
