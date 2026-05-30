import { getSermonsAction, getSermonSeriesAction } from "@/app/action/sermon-actions";
import { SermonsListClient } from "@/components/sermons/sermons-list-client";

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
