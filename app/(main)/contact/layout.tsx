import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | Get in Touch & Service Times",
  description: "Connect with our church. Find our location, service times, contact information, and send us a message or prayer request.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
