import { getEventsAction } from "@/app/action/event-actions";
import { getSermonsAction } from "@/app/action/sermon-actions";
import { getPostsAction } from "@/app/action/post-actions";
import { HeroSection } from "@/components/home/hero-section";
import { AboutSection } from "@/components/home/about-section";
import { EventsSection } from "@/components/home/events-section";
import { SermonsSection } from "@/components/home/sermons-section";
import { BlogSection } from "@/components/home/blog-section";
import { CtaSection } from "@/components/home/cta-section";

export const revalidate = 60; // Use Incremental Static Regeneration (ISR) to cache the page for 60 seconds

export default async function Home() {
  const [upcomingEvents, recentSermons, recentPosts] = await Promise.all([
    getEventsAction({ upcoming: true, limit: 3 }),
    getSermonsAction({ limit: 3 }),
    getPostsAction({ limit: 3 }),
  ]);

  const events = upcomingEvents.data || [];
  const sermons = recentSermons.data || [];
  const posts = recentPosts.data || [];

  return (
    <div className="flex flex-col">
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
