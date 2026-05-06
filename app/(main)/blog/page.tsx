import Link from "next/link";
import prisma from "@/lib/prisma";
import { formatDate, readingTime, stripHtml } from "@/lib/utils";
import Image from "next/image";
import { PageHeader } from "@/components/ui/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, User, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      content: true,
      coverImage: true,
      publishedAt: true,
      createdAt: true,
      author: {
        select: {
          name: true,
          avatarUrl: true,
        },
      },
    },
  });

  const featuredPost = posts[0];
  const otherPosts = posts.slice(1);

  return (
    <div className="flex flex-col">
      <PageHeader
        title="Community Stories"
        description="Encouraging stories, spiritual insights, and updates from the life of our church."
        accent="Blog & News"
      />

      <section className="container mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {posts.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-muted-foreground text-lg">
              No posts yet. Check back soon for stories from our community.
            </p>
          </div>
        ) : (
          <div className="space-y-16">
            {featuredPost && (
              <div className="group relative overflow-hidden rounded-3xl border border-border/40 bg-card shadow-lg transition-all hover:shadow-xl">
                <div className="grid gap-0 lg:grid-cols-2">
                  <div className="relative aspect-video lg:aspect-auto">
                    {featuredPost.coverImage ? (
                      <Image
                        src={featuredPost.coverImage}
                        alt={featuredPost.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-full w-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-bold">
                          Featured Story
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col justify-center p-8 lg:p-12">
                    <div className="mb-4 flex items-center gap-4 text-xs font-medium text-muted-foreground uppercase tracking-widest">
                      <span className="text-accent font-bold">Featured</span>
                      <span>&middot;</span>
                      <time>
                        {formatDate(
                          featuredPost.publishedAt || featuredPost.createdAt,
                        )}
                      </time>
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight lg:text-4xl">
                      <Link
                        href={`/blog/${featuredPost.slug}`}
                        className="hover:text-primary transition-colors"
                      >
                        {featuredPost.title}
                      </Link>
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground line-clamp-3">
                      {featuredPost.excerpt ||
                        stripHtml(featuredPost.content).slice(0, 200) + "..."}
                    </p>
                    <div className="mt-8 flex items-center gap-4 border-t border-border/40 pt-8">
                      <div className="flex h-10 w-10 overflow-hidden rounded-full bg-muted">
                        {featuredPost.author?.avatarUrl ? (
                          <Image
                            src={featuredPost.author.avatarUrl}
                            alt={featuredPost.author.name || ""}
                            width={40}
                            height={40}
                          />
                        ) : (
                          <User className="m-auto h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">
                          {featuredPost.author?.name || "Grace Community"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {readingTime(featuredPost.content)} min read
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {otherPosts.length > 0 && (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {otherPosts.map((post) => (
                  <article
                    key={post.id}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-border/40 bg-card shadow-sm transition-all hover:shadow-md"
                  >
                    {post.coverImage && (
                      <div className="relative aspect-[16/9] overflow-hidden">
                        <Image
                          src={post.coverImage}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-6">
                      <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider">
                        <time>
                          {formatDate(post.publishedAt || post.createdAt)}
                        </time>
                        <span>&middot;</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {readingTime(post.content)} min
                        </span>
                      </div>
                      <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h3>
                      <p className="mt-2 flex-1 text-sm text-muted-foreground line-clamp-3">
                        {post.excerpt ||
                          stripHtml(post.content).slice(0, 120) + "..."}
                      </p>
                      <div className="mt-6 flex items-center justify-between border-t border-border/40 pt-6">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 overflow-hidden rounded-full bg-muted">
                            {post.author?.avatarUrl ? (
                              <Image
                                src={post.author.avatarUrl}
                                alt={post.author.name || ""}
                                width={24}
                                height={24}
                              />
                            ) : (
                              <User className="h-3 w-3 m-auto text-muted-foreground" />
                            )}
                          </div>
                          <span className="text-xs font-medium text-muted-foreground">
                            {post.author?.name || "Grace Community"}
                          </span>
                        </div>
                        <Link
                          href={`/blog/${post.slug}`}
                          className="text-sm font-bold text-primary flex items-center gap-1 hover:underline"
                        >
                          Read more
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
