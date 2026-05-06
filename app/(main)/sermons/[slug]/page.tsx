import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface SermonPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: SermonPageProps): Promise<Metadata> {
  const { slug } = await params;
  const sermon = await prisma.sermon.findUnique({
    where: { slug },
  });

  if (!sermon) {
    return { title: "Sermon Not Found" };
  }

  return {
    title: `${sermon.title} | Sermons`,
    description: sermon.description.slice(0, 160),
  };
}

export default async function SermonPage({ params }: SermonPageProps) {
  const { slug } = await params;
  const sermon = await prisma.sermon.findUnique({
    where: { slug },
  });

  if (!sermon) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/sermons"
        className="mb-8 inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <svg
          className="mr-2 h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Sermons
      </Link>

      {sermon.imageUrl && (
        <div className="relative mb-8 h-64 w-full overflow-hidden rounded-lg sm:h-80">
          <Image
            src={sermon.imageUrl}
            alt={sermon.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <header className="mb-8">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span>{formatDate(sermon.sermonDate.toISOString())}</span>
          {sermon.duration && (
            <>
              <span>&middot;</span>
              <span>{formatDuration(sermon.duration)}</span>
            </>
          )}
          {sermon.series && (
            <>
              <span>&middot;</span>
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                {sermon.series}
              </span>
            </>
          )}
        </div>

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {sermon.title}
        </h1>

        <p className="mt-2 text-lg text-muted-foreground">{sermon.speaker}</p>
      </header>

      {sermon.videoUrl && (
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-semibold">Watch Sermon</h2>
          <div className="aspect-video overflow-hidden rounded-lg bg-black">
            <iframe
              src={sermon.videoUrl}
              title={sermon.title}
              className="h-full w-full"
              allowFullScreen
            />
          </div>
        </section>
      )}

      {sermon.audioUrl && (
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-semibold">Listen to Sermon</h2>
          <div className="rounded-lg border border-border/40 bg-card p-4 shadow-sm">
            <audio controls className="w-full" src={sermon.audioUrl}>
              Your browser does not support the audio element.
            </audio>
          </div>
        </section>
      )}

      {sermon.description && (
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-semibold">Description</h2>
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            {sermon.description.split("\n").map((paragraph, index) => (
              <p key={index} className="text-muted-foreground">
                {paragraph}
              </p>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}h`;
  }
  return `${minutes}m`;
}
