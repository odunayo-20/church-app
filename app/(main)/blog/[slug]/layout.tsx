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
  const { data: post } = await supabase
    .from("posts")
    .select("*, author:authorId(*)")
    .eq("slug", slug)
    .single();

  if (!post) {
    return { title: "Post Not Found" };
  }

  const previousImages = (await parent).openGraph?.images || [];
  const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  return {
    title: post.title,
    description: post.excerpt || post.content.substring(0, 160).replace(/<[^>]*>?/gm, ""),
    openGraph: {
      title: post.title,
      description: post.excerpt || post.content.substring(0, 160).replace(/<[^>]*>?/gm, ""),
      url: `${siteUrl}/blog/${post.slug}`,
      images: post.coverImage
        ? [{ url: post.coverImage }, ...previousImages]
        : previousImages,
      type: "article",
      publishedTime: post.publishedAt || post.createdAt,
      authors: post.author?.name ? [post.author.name] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || post.content.substring(0, 160).replace(/<[^>]*>?/gm, ""),
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

export default async function BlogLayout({ params, children }: Props) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("posts")
    .select("*, author:authorId(*)")
    .eq("slug", slug)
    .single();

  let schema = null;
  if (post) {
    const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    schema = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": post.title,
      "description": post.excerpt || post.content.substring(0, 160).replace(/<[^>]*>?/gm, ""),
      "image": post.coverImage ? [post.coverImage] : [],
      "datePublished": new Date(post.publishedAt || post.createdAt).toISOString(),
      "dateModified": new Date(post.updatedAt).toISOString(),
      "author": {
        "@type": "Person",
        "name": post.author?.name || "Grace Community"
      },
      "url": `${siteUrl}/blog/${post.slug}`
    };
  }

  return (
    <>
      {schema && <JsonLd data={schema} />}
      {children}
    </>
  );
}
