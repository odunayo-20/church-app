import type { Metadata } from "next";
import "./../globals.css";
import { QueryProvider } from "@/components/providers/query-provider";
import { SiteSettingsProvider } from "@/components/providers/settings-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CookieConsent } from "@/components/cookie-consent";
import { getSiteSettings } from "@/lib/settings-server";

const siteName = process.env.NEXT_PUBLIC_APP_NAME || "Church App";
const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description:
    "A modern church management application for members, events, donations, and community engagement.",
  keywords: ["church", "community", "events", "donations", "members", "blog"],
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName,
    title: siteName,
    description:
      "A modern church management application for members, events, donations, and community engagement.",
    images: [
      {
        url: `${siteUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: siteName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description:
      "A modern church management application for members, events, donations, and community engagement.",
    images: [`${siteUrl}/og-image.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch once server-side — no client waterfalls
  const settings = await getSiteSettings();

  return (
    <html
      lang="en"
      className={`h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <QueryProvider>
          <SiteSettingsProvider settings={settings}>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <CookieConsent />
          </SiteSettingsProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
