import { NextRequest } from "next/server";
import { getPosts, createPost } from "@/services/post-service";
import { postSchema } from "@/lib/validations";
import { successResponse } from "@/lib/api-response";
import { withAuthValidation, getPaginationParams } from "@/lib/api-handlers";

export async function GET(request: NextRequest) {
  const pagination = getPaginationParams(request);
  const result = await getPosts({ ...pagination });
  return successResponse(result);
}

export const POST = withAuthValidation(
  postSchema,
  async (_request, _context, validated) => {
    const post = await createPost(validated);
    return successResponse(post, 201);
  },
  true,
);
