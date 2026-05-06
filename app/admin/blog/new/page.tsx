import PostForm from "@/components/blog/post-form-wrapper";

export default function NewPostPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Create New Post</h1>
        <p className="mt-1 text-muted-foreground">
          Write and publish a new blog post
        </p>
      </div>

      <PostForm />
    </div>
  );
}
