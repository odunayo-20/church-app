import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import PostForm from "@/components/blog/post-form-wrapper";

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: { id },
  });

  if (!post) notFound();

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Edit Post</h1>
        <p className="mt-1 text-muted-foreground">Update your blog post</p>
      </div>

      <PostForm
        post={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          coverImage: post.coverImage,
          published: post.published,
        }}
        isEditing
      />
    </div>
  );
}
