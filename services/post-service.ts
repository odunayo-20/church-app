import prisma from "@/lib/prisma";
import type { PostInput } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import { paginate, type PaginationParams } from "@/lib/db-service";

export async function getPosts(params: PaginationParams) {
  return paginate("post", params);
}

export async function getPostById(id: string) {
  return prisma.post.findUnique({
    where: { id },
  });
}

export async function createPost(data: PostInput) {
  const slug = data.slug || slugify(data.title);
  const coverImage = data.coverImage || data.image || null;

  return prisma.post.create({
    data: {
      title: data.title,
      slug,
      excerpt: data.excerpt ?? "",
      content: data.content,
      coverImage,
      published: data.published ?? false,
    },
  });
}

export async function updatePost(id: string, data: Partial<PostInput>) {
  const updateData: Record<string, unknown> = {};

  if (data.title !== undefined) updateData.title = data.title;
  if (data.slug !== undefined) updateData.slug = slugify(data.slug);
  if (data.excerpt !== undefined) updateData.excerpt = data.excerpt;
  if (data.content !== undefined) updateData.content = data.content;
  if (data.coverImage !== undefined) updateData.coverImage = data.coverImage;
  else if (data.image !== undefined) updateData.coverImage = data.image;
  if (data.published !== undefined) updateData.published = data.published;

  return prisma.post.update({
    where: { id },
    data: updateData,
  });
}

export async function deletePost(id: string) {
  return prisma.post.delete({
    where: { id },
  });
}
