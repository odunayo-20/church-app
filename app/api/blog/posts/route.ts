import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import {
  successResponse,
  errorResponse,
  handleApiError,
} from "@/lib/api-response";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "10");
    const published = searchParams.get("published");

    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (published === "true") {
      where.published = true;
    } else if (published === "false") {
      where.published = false;
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          published: true,
          publishedAt: true,
          createdAt: true,
          coverImage: true,
          author: {
            select: { name: true, email: true },
          },
        },
      }),
      prisma.post.count({ where }),
    ]);

    return successResponse({
      data: posts,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.title) {
      return errorResponse("Title is required", 400);
    }
    if (!body.content) {
      return errorResponse("Content is required", 400);
    }

    const slug = body.slug || slugify(body.title);

    const existing = await prisma.post.findUnique({ where: { slug } });
    if (existing) {
      return errorResponse("A post with this slug already exists", 409);
    }

    const data = {
      title: body.title,
      slug,
      excerpt: body.excerpt ?? "",
      content: body.content,
      coverImage: body.coverImage ?? null,
      published: body.published ?? false,
      publishedAt: body.published ? new Date() : null,
    };

    const post = await prisma.post.create({ data });
    return successResponse(post, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
