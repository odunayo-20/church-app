import { getSermonsAction, getSermonSeriesAction } from "@/app/action/sermon-actions";
import { SermonsListClient } from "@/components/sermons/sermons-list-client";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sermon Library | Watch & Listen to Recent Messages",
  description: "Browse our complete library of sermons and messages. Watch videos, listen to audio, and grow in your faith with our teaching series.",
};

export const revalidate = 600; // Use ISR to cache this page for 10 minutes

export default async function SermonsPage() {
  const [sermonsData, seriesData] = await Promise.all([
    getSermonsAction({ published: true }),
    getSermonSeriesAction(),
  ]);

  const initialSermons = sermonsData || { data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0 } };
  const initialSeries = (seriesData as string[]) || [];

  return (
    <SermonsListClient
      initialSermons={initialSermons}
      initialSeries={initialSeries}
    />
  );
}
