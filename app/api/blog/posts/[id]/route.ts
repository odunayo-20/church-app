import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import {
  successResponse,
  errorResponse,
  handleApiError,
} from "@/lib/api-response";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: { name: true, email: true, avatarUrl: true },
        },
      },
    });

    if (!post) {
      return errorResponse("Post not found", 404);
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

    const existing = await prisma.post.findUnique({ where: { id } });
    if (!existing) {
      return errorResponse("Post not found", 404);
    }

    if (body.slug && body.slug !== existing.slug) {
      const duplicate = await prisma.post.findUnique({
        where: { slug: body.slug },
      });
      if (duplicate) {
        return errorResponse("A post with this slug already exists", 409);
      }
    }

    const slug = body.slug ? slugify(body.slug) : undefined;

    if (slug && slug !== existing.slug) {
      const duplicate = await prisma.post.findUnique({
        where: { slug },
      });
      if (duplicate) {
        return errorResponse("A post with this slug already exists", 409);
      }
    }

    const data = {
      ...(body.title !== undefined && { title: body.title }),
      ...(slug !== undefined && { slug }),
      ...(body.excerpt !== undefined && { excerpt: body.excerpt }),
      ...(body.content !== undefined && { content: body.content }),
      ...(body.coverImage !== undefined && { coverImage: body.coverImage }),
      ...(body.published !== undefined && {
        published: body.published,
        ...(body.published &&
          !existing.published && {
            publishedAt: new Date(),
          }),
      }),
    };

    const post = await prisma.post.update({ where: { id }, data });
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

    const existing = await prisma.post.findUnique({ where: { id } });
    if (!existing) {
      return errorResponse("Post not found", 404);
    }

    await prisma.post.delete({ where: { id } });
    return successResponse({ message: "Post deleted" });
  } catch (error) {
    return handleApiError(error);
  }
}
