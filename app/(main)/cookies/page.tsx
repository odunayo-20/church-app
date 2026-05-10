import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Information about how we use cookies and tracking technologies.",
};

export default function CookiePolicyPage() {
  const lastUpdated = "May 10, 2026";

  return (
    <div className="flex flex-col bg-background">
      <section className="relative overflow-hidden bg-slate-950 py-16 sm:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(38,100%,50%,0.10),transparent_55%)]" />
        <div className="container relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-amber-500 transition-colors hover:text-amber-400"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Cookie Policy
          </h1>
          <p className="mt-4 text-lg text-white/60">
            Last updated: {lastUpdated}
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="prose prose-neutral dark:prose-invert prose-base max-w-none prose-headings:scroll-mt-24">
            <p>
              This Cookie Policy explains how Grace Community uses cookies and similar tracking technologies on our website and application. It explains what these technologies are, why we use them, and your rights to control our use of them.
            </p>

            <h2>1. What are cookies?</h2>
            <p>
              Cookies are small data files that are placed on your computer or mobile device when you visit a website. They are widely used by website owners to make their websites work, or to work more efficiently, as well as to provide reporting information.
            </p>

            <h2>2. How do we use cookies?</h2>
            <p>We use cookies for several reasons. Some cookies are required for technical reasons for our website to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies enable us to track and target the interests of our users to enhance the experience on our website. We categorize them as follows:</p>

            <h3>Essential Cookies</h3>
            <p>
              These cookies are strictly necessary to provide you with services available through our website and to use some of its features, such as access to secure areas. Because these cookies are strictly necessary to deliver the website, you cannot refuse them without impacting how our site functions.
            </p>

            <h3>Analytics & Performance Cookies</h3>
            <p>
              These cookies collect information that is used either in aggregate form to help us understand how our website is being used, or how effective our communications are. This helps us customize our website and application for you. We only use these cookies with your consent.
            </p>

            <h3>Marketing & Targeting Cookies</h3>
            <p>
              These cookies are used to make advertising messages more relevant to you. They perform functions like preventing the same ad from continuously reappearing, ensuring that ads are properly displayed for advertisers, and in some cases selecting advertisements that are based on your interests. We only use these cookies with your consent.
            </p>

            <h2>3. Managing Your Cookie Preferences</h2>
            <p>
              You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences when you first visit our site via the Cookie Consent Banner. You can also change your preferences at any time by clearing your browser cookies and refreshing the page to trigger the banner again.
            </p>
            <p>
              In addition, most web browsers allow some control of most cookies through the browser settings. To find out more about cookies, including how to see what cookies have been set and how to manage and delete them, visit <a href="https://www.aboutcookies.org" target="_blank" rel="noopener noreferrer">aboutcookies.org</a> or <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer">allaboutcookies.org</a>.
            </p>

            <h2>4. Updates to this Policy</h2>
            <p>
              We may update this Cookie Policy from time to time in order to reflect changes to the cookies we use or for other operational, legal, or regulatory reasons. Please revisit this Cookie Policy regularly to stay informed.
            </p>

            <h2>5. Contact Us</h2>
            <p>
              If you have any questions about our use of cookies or other technologies, please contact us at:
            </p>
            <p>
              <strong>Email:</strong> privacy@gracecommunity.org
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
