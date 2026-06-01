import { Metadata, ResolvingMetadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { JsonLd } from "@/components/seo/json-ld";
import React from "react";

type Props = {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single();

  if (!event) {
    return { title: "Event Not Found" };
  }

  const previousImages = (await parent).openGraph?.images || [];
  const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  return {
    title: event.title,
    description: event.description.substring(0, 160),
    openGraph: {
      title: event.title,
      description: event.description.substring(0, 160),
      url: `${siteUrl}/events/${event.id}`,
      images: event.imageUrl
        ? [{ url: event.imageUrl }, ...previousImages]
        : previousImages,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: event.title,
      description: event.description.substring(0, 160),
      images: event.imageUrl ? [event.imageUrl] : [],
    },
  };
}

export default async function EventLayout({ params, children }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single();

  let schema = null;
  if (event) {
    const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    schema = {
      "@context": "https://schema.org",
      "@type": "Event",
      "name": event.title,
      "startDate": new Date(event.date).toISOString(),
      "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
      "eventStatus": "https://schema.org/EventScheduled",
      "location": {
        "@type": "Place",
        "name": event.location,
        "address": {
          "@type": "Text",
          "text": event.location
        }
      },
      "image": event.imageUrl ? [event.imageUrl] : [],
      "description": event.description,
      "url": `${siteUrl}/events/${event.id}`
    };
  }

  return (
    <>
      {schema && <JsonLd data={schema} />}
      {children}
    </>
  );
}
