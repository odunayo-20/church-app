"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const PostForm = dynamic(
  () => import("./post-form").then((mod) => mod.PostForm),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[600px] w-full" />,
  },
);

export default PostForm;
