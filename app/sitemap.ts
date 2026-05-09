import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

async function getDynamicRoutes() {
  try {
    const supabase = await createClient();

    const [
      { data: posts },
      { data: events }
    ] = await Promise.all([
      supabase.from("posts").select("slug, updatedAt").eq("published", true),
      supabase.from("events").select("id, updatedAt").gte("date", new Date().toISOString()),
    ]);

    const postRoutes = (posts || []).map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt),
      priority: 0.6,
    }));

    const eventRoutes = (events || []).map((event) => ({
      url: `${baseUrl}/events/${event.id}`,
      lastModified: new Date(event.updatedAt),
      priority: 0.5,
    }));

    return [...postRoutes, ...eventRoutes];
  } catch (error) {
    console.error("Sitemap dynamic routes error:", error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/events`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/donate`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  const dynamicRoutes = await getDynamicRoutes();

  return [...staticRoutes, ...dynamicRoutes];
}
