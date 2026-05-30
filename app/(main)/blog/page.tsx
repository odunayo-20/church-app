import { getPostsAction } from "@/app/action/post-actions";
import { BlogListClient } from "@/components/blog/blog-list-client";

export const revalidate = 600; // Use ISR to cache this page for 10 minutes

export default async function BlogPage() {
  const postsData = await getPostsAction({ page: 1, limit: 100, published: true });
  const posts = postsData.data || [];

  return <BlogListClient posts={posts} />;
}
