import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { formatDate, readingTime } from "@/lib/utils";
import Image from "next/image";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamic = "force-dynamic";

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;

  const post = await prisma.post.findUnique({
    where: { slug, published: true },
    include: {
      author: {
        select: {
          name: true,
          email: true,
          avatarUrl: true,
        },
      },
    },
  });

  if (!post) notFound();

  const minutes = readingTime(post.content);

  return (
    <article className="container mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-8">
        <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          <time
            dateTime={
              post.publishedAt?.toISOString() || post.createdAt.toISOString()
            }
          >
            {formatDate(post.publishedAt || post.createdAt)}
          </time>
          <span>&middot;</span>
          <span>{minutes} min read</span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {post.title}
        </h1>

        {post.excerpt && (
          <p className="mt-4 text-lg text-muted-foreground">{post.excerpt}</p>
        )}

        {(post.author?.name || post.author?.email) && (
          <div className="mt-6 flex items-center gap-3">
            {post.author.avatarUrl ? (
              <Image
                src={post.author.avatarUrl}
                alt={post.author.name || post.author.email}
                width={40}
                height={40}
                className="rounded-full"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                {(post.author.name || post.author.email)
                  .charAt(0)
                  .toUpperCase()}
              </div>
            )}
            <div>
              <p className="text-sm font-medium">
                {post.author.name || post.author.email}
              </p>
            </div>
          </div>
        )}
      </header>

      {post.coverImage && (
        <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-lg">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <div
        className="prose prose-sm sm:prose max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
}
