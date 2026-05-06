import { NextRequest } from "next/server";
import {
  getMemberById,
  updateMember,
  deleteMember,
} from "@/services/member-service";
import { memberUpdateSchema } from "@/lib/validations";
import { successResponse, handleApiError } from "@/lib/api-response";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const member = await getMemberById(id);

    if (!member) {
      return Response.json(
        { success: false, message: "Member not found" },
        { status: 404 },
      );
    }

    return successResponse(member);
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
    const validated = memberUpdateSchema.parse(body);
    const member = await updateMember(id, validated);
    return successResponse(member);
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
    await deleteMember(id);
    return Response.json({ success: true, message: "Member deleted" });
  } catch (error) {
    return handleApiError(error);
  }
}
