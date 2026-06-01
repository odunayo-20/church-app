import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Our Story, Mission & Values",
  description: "Learn about Grace Community Church, our 20-year history, our core values, beliefs, and the leadership team guiding our mission.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
