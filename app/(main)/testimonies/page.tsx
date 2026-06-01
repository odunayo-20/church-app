import { TestimoniesClient } from "./testimonies-client";
import { getTestimoniesAction } from "@/app/action/testimony-actions";
import { Metadata } from "next";

// Statically generate this route and revalidate it every hour (3600 seconds)
// Note: It also instantly revalidates via revalidatePath when a testimony is created or updated
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Testimonies | " + (process.env.NEXT_PUBLIC_APP_NAME || "Grace Community"),
  description: "Celebrate what God is doing in our community. Read inspiring stories and share your own testimony.",
};

export default async function TestimoniesPage() {
  // Fetch initial testimonies on the server for SEO and fast initial load
  const initialData = await getTestimoniesAction({ status: "approved", page: 1, limit: 50 });

  return <TestimoniesClient initialData={initialData} />;
}
