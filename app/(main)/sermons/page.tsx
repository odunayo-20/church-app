import prisma from "@/lib/prisma";
import { SermonCard } from "@/components/sermons/sermon-card";
import { PageHeader } from "@/components/ui/page-header";
import { Video, Search } from "lucide-react";
import { Input } from "@/components/ui/form-elements";

export const dynamic = "force-dynamic";

export default async function SermonsPage() {
  const sermons = await prisma.sermon.findMany({
    where: { published: true },
    orderBy: { sermonDate: "desc" },
    take: 50,
  });

  const series = await prisma.sermon.findMany({
    where: { published: true, series: { not: null } },
    select: { series: true },
    distinct: ["series"],
    orderBy: { series: "asc" },
  });

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Sermon Library"
        description="Grow in faith through the powerful teaching of God's Word. Watch or listen to our recent messages."
        accent="The Word"
      />

      <section className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-10"
              placeholder="Search sermons by title or speaker..."
            />
          </div>

          {series.length > 0 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2 lg:pb-0">
              <span className="text-sm font-medium whitespace-nowrap">
                Series:
              </span>
              <div className="flex gap-2">
                <button className="rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-white">
                  All
                </button>
                {series.map((s) => (
                  <button
                    key={s.series!}
                    className="rounded-full border border-border/40 bg-card px-4 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
                  >
                    {s.series}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {sermons.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Video className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold">No sermons found</h3>
            <p className="mt-2 text-muted-foreground">
              Check back soon for new messages from our team.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {sermons.map((sermon) => (
              <SermonCard
                key={sermon.id}
                sermon={{
                  ...sermon,
                  sermonDate: sermon.sermonDate.toISOString(),
                  createdAt: sermon.createdAt.toISOString(),
                  updatedAt: sermon.updatedAt.toISOString(),
                }}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
