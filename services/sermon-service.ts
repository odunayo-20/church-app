import prisma from "@/lib/prisma";

export interface SermonInput {
  title: string;
  slug: string;
  description: string;
  sermonDate: Date;
  speaker: string;
  series?: string;
  audioUrl?: string;
  videoUrl?: string;
  duration?: number;
  imageUrl?: string;
  published?: boolean;
}

export interface SermonFilters {
  page?: number;
  limit?: number;
  search?: string;
  series?: string;
  speaker?: string;
}

export async function getSermons(filters: SermonFilters = {}) {
  const { page = 1, limit = 10, search, series, speaker } = filters;
  const skip = (page - 1) * limit;

  const where = {
    published: true,
    ...(search && {
      OR: [
        { title: { contains: search, mode: "insensitive" as const } },
        { speaker: { contains: search, mode: "insensitive" as const } },
        { series: { contains: search, mode: "insensitive" as const } },
      ],
    }),
    ...(series && {
      series: { contains: series, mode: "insensitive" as const },
    }),
    ...(speaker && {
      speaker: { contains: speaker, mode: "insensitive" as const },
    }),
  };

  const [sermons, total] = await Promise.all([
    prisma.sermon.findMany({
      where,
      orderBy: { sermonDate: "desc" },
      skip,
      take: limit,
    }),
    prisma.sermon.count({ where }),
  ]);

  return {
    sermons,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getSermonBySlug(slug: string) {
  return prisma.sermon.findUnique({
    where: { slug },
  });
}

export async function createSermon(data: SermonInput) {
  return prisma.sermon.create({
    data: {
      ...data,
      publishedAt: data.published ? new Date() : null,
    },
  });
}

export async function updateSermon(id: string, data: Partial<SermonInput>) {
  const updateData = { ...data };
  if (updateData.published && !data.publishedAt) {
    updateData.publishedAt = new Date();
  }
  return prisma.sermon.update({
    where: { id },
    data: updateData,
  });
}

export async function deleteSermon(id: string) {
  return prisma.sermon.delete({
    where: { id },
  });
}

export async function getSermonSeries() {
  const sermons = await prisma.sermon.findMany({
    where: { published: true, series: { not: null } },
    select: { series: true },
    distinct: ["series"],
    orderBy: { series: "asc" },
  });
  return sermons.map((s) => s.series as string);
}
