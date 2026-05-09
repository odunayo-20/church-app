"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { paginate, type PaginationParams, type PaginatedResult } from "@/lib/db-service";
import { sermonSchema, sermonUpdateSchema, type SermonInput } from "@/lib/validations";
import { slugify } from "@/lib/utils";
import type { Sermon } from "@/types/models";
import { revalidatePath } from "next/cache";

const generateId = () => globalThis.crypto.randomUUID();

export interface SermonFilters extends PaginationParams {
  series?: string;
  speaker?: string;
  topic?: string;
  query?: string;
}

export async function getSermonsAction(params: SermonFilters): Promise<PaginatedResult<Sermon>> {
  try {
    const supabase = await createAdminClient();
    const result = await paginate<Sermon>("sermons", params, {
      supabase,
      filters: (query) => {
        if (params.series) query.eq("series", params.series);
        if (params.speaker) query.ilike("speaker", `%${params.speaker}%`);
        if (params.topic) query.ilike("topic", `%${params.topic}%`);
        if (params.query) {
          query.or(`title.like.%${params.query}%,description.like.%${params.query}%`);
        }
        return query;
      },
      orderBy: { column: "sermonDate", ascending: false },
    });
    return result;
  } catch (error) {
    console.error("Error fetching sermons:", error);
    throw new Error("Failed to fetch sermons");
  }
}

export async function getSermonBySlugAction(slug: string): Promise<Sermon> {
  try {
    const decodedSlug = decodeURIComponent(slug);
    const supabase = await createAdminClient();
    const { data, error } = await supabase
      .from("sermons")
      .select("*")
      .eq("slug", decodedSlug)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error(`Error fetching sermon ${slug}:`, error);
    throw new Error("Failed to fetch sermon");
  }
}

export async function createSermonAction(data: SermonInput): Promise<Sermon> {
  try {
    const validatedData = sermonSchema.parse(data);
    const supabase = await createAdminClient();
    const slug = validatedData.slug || slugify(validatedData.title);

    const { data: sermon, error } = await supabase
      .from("sermons")
      .insert({
        id: generateId(),
        title: validatedData.title,
        slug,
        description: validatedData.description || null,
        speaker: validatedData.speaker,
        sermonDate: validatedData.sermonDate,
        series: validatedData.series || null,
        imageUrl: validatedData.imageUrl || null,
        audioUrl: validatedData.audioUrl || null,
        videoUrl: validatedData.videoUrl || null,
        publishedAt: validatedData.published ? new Date().toISOString() : null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    
    revalidatePath("/admin/sermons");
    revalidatePath("/sermons");
    return sermon;
  } catch (error) {
    console.error("Error creating sermon:", error);
    throw error;
  }
}

export async function updateSermonAction(id: string, data: Partial<SermonInput>): Promise<Sermon> {
  try {
    const validatedData = sermonUpdateSchema.parse(data);
    const supabase = await createAdminClient();
    const updateData: Record<string, any> = {};

    if (validatedData.title !== undefined) {
      updateData.title = validatedData.title;
      if (!validatedData.slug) updateData.slug = slugify(validatedData.title);
    }
    if (validatedData.slug !== undefined) updateData.slug = slugify(validatedData.slug);
    if (validatedData.description !== undefined) updateData.description = validatedData.description || null;
    if (validatedData.speaker !== undefined) updateData.speaker = validatedData.speaker;
    if (validatedData.sermonDate !== undefined) updateData.sermonDate = validatedData.sermonDate;
    if (validatedData.series !== undefined) updateData.series = validatedData.series || null;
    if (validatedData.imageUrl !== undefined) updateData.imageUrl = validatedData.imageUrl || null;
    if (validatedData.audioUrl !== undefined) updateData.audioUrl = validatedData.audioUrl || null;
    if (validatedData.videoUrl !== undefined) updateData.videoUrl = validatedData.videoUrl || null;
    if (validatedData.published !== undefined) {
      updateData.publishedAt = validatedData.published ? new Date().toISOString() : null;
    }
    
    updateData.updatedAt = new Date().toISOString();

    const { data: sermon, error } = await supabase
      .from("sermons")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    
    revalidatePath("/admin/sermons");
    revalidatePath(`/sermons/${sermon.slug}`);
    revalidatePath("/sermons");
    return sermon;
  } catch (error) {
    console.error("Error updating sermon:", error);
    throw error;
  }
}

export async function deleteSermonAction(id: string): Promise<boolean> {
  try {
    const supabase = await createAdminClient();
    const { error } = await supabase.from("sermons").delete().eq("id", id);

    if (error) throw error;
    
    revalidatePath("/admin/sermons");
    revalidatePath("/sermons");
    return true;
  } catch (error) {
    console.error("Error deleting sermon:", error);
    throw new Error("Failed to delete sermon");
  }
}

export async function getSermonSeriesAction() {
  try {
    const supabase = await createAdminClient();
    const { data, error } = await supabase
      .from("sermons")
      .select("series")
      .not("series", "is", null);

    if (error) throw error;
    return Array.from(new Set((data || []).map(s => s.series)));
  } catch (error) {
    console.error("Error fetching sermon series:", error);
    throw new Error("Failed to fetch sermon series");
  }
}
