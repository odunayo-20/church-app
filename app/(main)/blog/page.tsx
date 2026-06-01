import { getPostsAction } from "@/app/action/post-actions";
import { BlogListClient } from "@/components/blog/blog-list-client";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Church Blog | Stories, News, and Devotionals",
  description: "Read inspiring stories, stay updated with church news, and find spiritual encouragement through our latest devotionals and articles.",
};

export const revalidate = 600; // Use ISR to cache this page for 10 minutes

export default async function BlogPage() {
  const postsData = await getPostsAction({ page: 1, limit: 100, published: true });
  const posts = postsData.data || [];

  return <BlogListClient posts={posts} />;
}
