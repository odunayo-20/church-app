import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";

interface SermonCardProps {
  sermon: {
    id: string;
    title: string;
    slug: string;
    description: string;
    sermonDate: string;
    speaker: string;
    series: string | null;
    audioUrl: string | null;
    videoUrl: string | null;
    duration: number | null;
    imageUrl: string | null;
  };
}

export function SermonCard({ sermon }: SermonCardProps) {
  const formattedDate = formatDate(sermon.sermonDate);
  const hasMedia = sermon.audioUrl || sermon.videoUrl;

  return (
    <Link
      href={`/sermons/${sermon.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/40 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-rose-500/35 hover:shadow-rose-500/5"
    >
      {sermon.imageUrl ? (
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={sermon.imageUrl}
            alt={sermon.title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="flex aspect-video w-full items-center justify-center bg-gradient-to-br from-rose-500/10 via-rose-500/5 to-violet-500/10">
          <svg
            className="h-12 w-12 text-rose-500/30"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m0 0a7 7 0 017-7m0 0a7 7 0 017 7m0 0a7 7 0 01-7 7m0 0a7 7 0 017-7"
            />
          </svg>
        </div>
      )}

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
          <span>{formattedDate}</span>
          {sermon.duration && (
            <>
              <span>&middot;</span>
              <span>{formatDuration(sermon.duration)}</span>
            </>
          )}
        </div>

        <h3 className="text-lg font-semibold line-clamp-2 group-hover:text-primary">
          {sermon.title}
        </h3>

        <p className="mt-1 text-sm text-muted-foreground">{sermon.speaker}</p>

        {sermon.series && (
          <span className="mt-2 inline-flex self-start rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
            {sermon.series}
          </span>
        )}

        <div className="mt-auto pt-4">
          <span className="text-sm font-medium text-primary group-hover:underline">
            {hasMedia ? "Watch / Listen" : "Read more"}
          </span>
        </div>
      </div>
    </Link>
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
