"use client";

import { usePost } from "@/hooks";
import PostForm from "@/components/blog/post-form-wrapper";
import { useParams } from "next/navigation";

export default function EditPostPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: post, isLoading, error } = usePost(id);

  if (isLoading) {
    return <div className="py-12 text-center">Loading post...</div>;
  }

  if (error || !post) {
    return <div className="py-12 text-center text-red-500">Post not found</div>;
  }

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
