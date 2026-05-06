import { NextRequest } from "next/server";
import { getMembers, createMember } from "@/services/member-service";
import { memberSchema } from "@/lib/validations";
import { successResponse } from "@/lib/api-response";
import { withAuthValidation, getPaginationParams } from "@/lib/api-handlers";

export async function GET(request: NextRequest) {
  const pagination = getPaginationParams(request);
  const result = await getMembers({ ...pagination });
  return successResponse(result);
}

export const POST = withAuthValidation(
  memberSchema,
  async (_request, _context, validated) => {
    const member = await createMember(validated);
    return successResponse(member, 201);
  },
  true,
);
