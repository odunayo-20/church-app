import prisma from "@/lib/prisma";
import { HeroSection } from "@/components/home/hero-section";
import { AboutSection } from "@/components/home/about-section";
import { EventsSection } from "@/components/home/events-section";
import { SermonsSection } from "@/components/home/sermons-section";
import { BlogSection } from "@/components/home/blog-section";
import { CtaSection } from "@/components/home/cta-section";

export const dynamic = "force-dynamic";

export default async function Home() {
  const now = new Date();

  const [upcomingEvents, recentSermons, recentPosts] = await Promise.all([
    prisma.event.findMany({
      where: { date: { gte: now } },
      orderBy: { date: "asc" },
      take: 3,
      select: {
        id: true,
        title: true,
        description: true,
        date: true,
        location: true,
        imageUrl: true,
      },
    }),
    prisma.sermon.findMany({
      where: { published: true },
      orderBy: { sermonDate: "desc" },
      take: 3,
      select: {
        id: true,
        title: true,
        speaker: true,
        sermonDate: true,
        imageUrl: true,
        videoUrl: true,
        series: true,
      },
    }),
    prisma.post.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      take: 3,
      include: {
        author: {
          select: {
            name: true,
            avatarUrl: true,
          },
        },
      },
    }),
  ]);

  return (
    <div className="flex flex-col">
      <HeroSection />
      <AboutSection />
      <EventsSection
        events={upcomingEvents.map((e) => ({
          ...e,
          date: e.date.toISOString(),
        }))}
      />
      <SermonsSection
        sermons={recentSermons.map((s) => ({
          ...s,
          date: s.sermonDate.toISOString(),
        }))}
      />
      <BlogSection
        posts={recentPosts.map((p) => ({
          ...p,
          date: p.publishedAt?.toISOString() || p.createdAt.toISOString(),
          author: p.author?.name || "Grace Community",
          authorImage: p.author?.avatarUrl || null,
        }))}
      />
      <CtaSection />
    </div>
  );
}
