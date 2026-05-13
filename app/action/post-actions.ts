"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { paginate, type PaginationParams, type PaginatedResult } from "@/lib/db-service";
import { postSchema, postUpdateSchema, type PostInput } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import type { Post } from "@/types/models";
import { revalidatePath } from "next/cache";

const generateId = () => globalThis.crypto.randomUUID();

export async function getPostsAction(params: PaginationParams & { published?: boolean }): Promise<PaginatedResult<Post>> {
  try {
    const supabase = await createAdminClient();
    const result = await paginate<Post>("posts", params, {
      supabase,
      select: "id, title, slug, excerpt, coverImage, published, publishedAt, createdAt, authorId, author:profiles(name, avatarUrl)",
      filters: (query) => {
        if (params.published !== undefined) {
          return query.eq("published", params.published);
        }
        return query;
      },
      orderBy: { column: "createdAt", ascending: false },
    });
    return result;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw new Error("Failed to fetch posts");
  }
}

export async function getPostByIdAction(id: string): Promise<Post> {
  try {
    const supabase = await createAdminClient();
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error("Post not found");
    return data;
  } catch (error) {
    console.error(`Error fetching post ${id}:`, error);
    throw new Error("Failed to fetch post");
  }
}

export async function getPostBySlugAction(slug: string): Promise<Post> {
  try {
    const supabase = await createAdminClient();
    const { data, error } = await supabase
      .from("posts")
      .select("*, author:profiles(name, avatarUrl)")
      .eq("slug", slug)
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error("Post not found");
    return data;
  } catch (error) {
    console.error(`Error fetching post ${slug}:`, error);
    throw new Error("Failed to fetch post");
  }
}

export async function createPostAction(data: PostInput): Promise<Post> {
  try {
    const validatedData = postSchema.parse(data);
    const supabase = await createAdminClient(); // Bypass RLS for admin action
    const slug = validatedData.slug || slugify(validatedData.title);
    const coverImage = validatedData.coverImage || validatedData.image || null;

    const { data: post, error } = await supabase
      .from("posts")
      .insert({
        id: generateId(),
        title: validatedData.title,
        slug,
        excerpt: validatedData.excerpt ?? "",
        content: validatedData.content,
        coverImage: coverImage,
        published: validatedData.published ?? false,
        authorId: validatedData.authorId || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    
    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    return post;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
}

export async function updatePostAction(id: string, data: Partial<PostInput>): Promise<Post> {
  try {
    const validatedData = postUpdateSchema.parse(data);
    const supabase = await createAdminClient(); // Bypass RLS for admin action
    const updateData: Record<string, unknown> = {};

    if (validatedData.title !== undefined) {
      updateData.title = validatedData.title;
      if (!validatedData.slug) updateData.slug = slugify(validatedData.title);
    }
    if (validatedData.slug !== undefined) updateData.slug = slugify(validatedData.slug);
    if (validatedData.excerpt !== undefined) updateData.excerpt = validatedData.excerpt;
    if (validatedData.content !== undefined) updateData.content = validatedData.content;
    if (validatedData.coverImage !== undefined) updateData.coverImage = validatedData.coverImage;
    else if (validatedData.image !== undefined) updateData.coverImage = validatedData.image;
    if (validatedData.published !== undefined) {
      updateData.published = validatedData.published;
      if (validatedData.published) updateData.publishedAt = new Date().toISOString();
    }
    
    updateData.updatedAt = new Date().toISOString();

    const { data: post, error } = await supabase
      .from("posts")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    
    revalidatePath("/admin/blog");
    revalidatePath(`/blog/${post.slug}`);
    revalidatePath("/blog");
    return post;
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
}

export async function deletePostAction(id: string): Promise<boolean> {
  try {
    const supabase = await createAdminClient(); // Bypass RLS for admin action
    const { error } = await supabase.from("posts").delete().eq("id", id);

    if (error) throw error;
    
    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    return true;
  } catch (error) {
    console.error("Error deleting post:", error);
    throw new Error("Failed to delete post");
  }
}
