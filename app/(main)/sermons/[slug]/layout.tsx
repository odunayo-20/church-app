import { Metadata, ResolvingMetadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { JsonLd } from "@/components/seo/json-ld";
import React from "react";

type Props = {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: sermon } = await supabase
    .from("sermons")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!sermon) {
    return { title: "Sermon Not Found" };
  }

  const previousImages = (await parent).openGraph?.images || [];
  const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  return {
    title: sermon.title,
    description: sermon.description?.substring(0, 160) || `Listen to ${sermon.title} by ${sermon.speaker}`,
    openGraph: {
      title: sermon.title,
      description: sermon.description?.substring(0, 160) || `Listen to ${sermon.title} by ${sermon.speaker}`,
      url: `${siteUrl}/sermons/${sermon.slug}`,
      images: sermon.imageUrl
        ? [{ url: sermon.imageUrl }, ...previousImages]
        : previousImages,
      type: "video.other",
    },
    twitter: {
      card: "summary_large_image",
      title: sermon.title,
      description: sermon.description?.substring(0, 160) || `Listen to ${sermon.title} by ${sermon.speaker}`,
      images: sermon.imageUrl ? [sermon.imageUrl] : [],
    },
  };
}

export default async function SermonLayout({ params, children }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: sermon } = await supabase
    .from("sermons")
    .select("*")
    .eq("slug", slug)
    .single();

  let schema = null;
  if (sermon) {
    const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    schema = {
      "@context": "https://schema.org",
      "@type": "VideoObject",
      "name": sermon.title,
      "description": sermon.description || `Listen to ${sermon.title} by ${sermon.speaker}`,
      "thumbnailUrl": sermon.imageUrl ? [sermon.imageUrl] : [],
      "uploadDate": new Date(sermon.sermonDate || sermon.createdAt).toISOString(),
      "duration": sermon.duration ? `PT${Math.floor(sermon.duration / 3600)}H${Math.floor((sermon.duration % 3600) / 60)}M${sermon.duration % 60}S` : undefined,
      "embedUrl": sermon.videoUrl || undefined,
      "author": {
        "@type": "Person",
        "name": sermon.speaker
      }
    };
  }

  return (
    <>
      {schema && <JsonLd data={schema} />}
      {children}
    </>
  );
}
