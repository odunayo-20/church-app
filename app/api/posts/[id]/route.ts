import { NextRequest } from "next/server";
import { getPostById, updatePost, deletePost } from "@/services/post-service";
import { postUpdateSchema } from "@/lib/validations";
import { successResponse, handleApiError } from "@/lib/api-response";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const post = await getPostById(id);

    if (!post) {
      return Response.json(
        { success: false, message: "Post not found" },
        { status: 404 },
      );
    }

    return successResponse(post);
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
    const validated = postUpdateSchema.parse(body);
    const post = await updatePost(id, validated);
    return successResponse(post);
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
    await deletePost(id);
    return Response.json({ success: true, message: "Post deleted" });
  } catch (error) {
    return handleApiError(error);
  }
}
