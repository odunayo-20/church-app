import { getEventsAction } from "@/app/action/event-actions";
import { getSermonsAction } from "@/app/action/sermon-actions";
import { getPostsAction } from "@/app/action/post-actions";
import { HeroSection } from "@/components/home/hero-section";
import { AboutSection } from "@/components/home/about-section";
import { EventsSection } from "@/components/home/events-section";
import { SermonsSection } from "@/components/home/sermons-section";
import { BlogSection } from "@/components/home/blog-section";
import { CtaSection } from "@/components/home/cta-section";
import { JsonLd } from "@/components/seo/json-ld";

export const revalidate = 60; // Use Incremental Static Regeneration (ISR) to cache the page for 60 seconds

export default async function Home() {
  const [upcomingEvents, recentSermons, recentPosts] = await Promise.all([
    getEventsAction({ upcoming: true, limit: 3 }),
    getSermonsAction({ limit: 3, published: true }),
    getPostsAction({ limit: 3, published: true }),
  ]);

  const events = upcomingEvents.data || [];
  const sermons = recentSermons.data || [];
  const posts = recentPosts.data || [];

  const churchSchema = {
    "@context": "https://schema.org",
    "@type": "Church",
    "name": process.env.NEXT_PUBLIC_APP_NAME || "Church App",
    "url": process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
    "logo": `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/apple-touch-icon.png`,
    "image": `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/og-image.jpg`,
    "description": "A modern church management application for members, events, donations, and community engagement.",
    "telephone": "+1-555-0100", // Example placeholder
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "123 Faith Avenue",
      "addressLocality": "Graceville",
      "addressRegion": "CA",
      "postalCode": "90210",
      "addressCountry": "US"
    }
  };

  return (
    <div className="flex flex-col">
      <JsonLd data={churchSchema} />
      <HeroSection />
      <AboutSection />
      <EventsSection
        events={events.map((e: any) => ({
          ...e,
          date: e.date,
          imageUrl: e.imageUrl,
        }))}
      />
      <SermonsSection
        sermons={sermons.map((s: any) => ({
          ...s,
          date: s.sermonDate,
          imageUrl: s.imageUrl,
          videoUrl: s.videoUrl,
        }))}
      />
      <BlogSection
        posts={posts.map((p: any) => ({
          ...p,
          date: p.publishedAt || p.createdAt,
          author: p.author?.name || "Grace Community",
          authorImage: p.author?.avatarUrl || null,
          imageUrl: p.coverImage,
        }))}
      />
      <CtaSection />
    </div>
  );
}
