import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions for using the Grace Community app and website.",
};

export default function TermsOfServicePage() {
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
            Terms of Service
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
              Welcome to Grace Community. These Terms of Service govern your access to and use of our website, mobile application, and related services. By accessing or using our services, you agree to be bound by these Terms.
            </p>

            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing our platform, registering an account, making a donation, or interacting with our content, you confirm that you have read, understood, and agree to these Terms. If you do not agree, please do not use our services.
            </p>

            <h2>2. User Accounts</h2>
            <p>
              Certain features, such as managing RSVPs and donations, require an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to provide accurate, current, and complete information during registration.
            </p>

            <h2>3. Privacy and Data Protection</h2>
            <p>
              Your privacy is important to us. Our <Link href="/privacy">Privacy Policy</Link> explains how we collect, use, and protect your personal data in compliance with GDPR. By using our services, you consent to our data practices as described in the Privacy Policy.
            </p>

            <h2>4. Donations</h2>
            <p>
              All donations made through our platform are voluntary and non-refundable unless required by law. We use secure third-party payment gateways. You agree to provide valid payment information and authorize us (or our payment processors) to charge your payment method for the donation amount.
            </p>

            <h2>5. User Conduct</h2>
            <p>You agree not to use our services to:</p>
            <ul>
              <li>Violate any local, national, or international law.</li>
              <li>Harass, abuse, or harm another person.</li>
              <li>Upload or transmit harmful code, viruses, or spam.</li>
              <li>Interfere with the operation or security of the platform.</li>
              <li>Submit false or misleading information.</li>
            </ul>

            <h2>6. Intellectual Property</h2>
            <p>
              All content on this platform, including sermons, articles, logos, graphics, and software, is the property of Grace Community or its content suppliers and is protected by copyright and intellectual property laws. You may access and use this content for personal, non-commercial purposes only.
            </p>

            <h2>7. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, Grace Community and its leaders, employees, and volunteers shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of our services. Our platform is provided on an "as is" and "as available" basis.
            </p>

            <h2>8. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will notify users of significant changes by posting an update on our website. Continued use of the services after changes are posted constitutes your acceptance of the revised Terms.
            </p>

            <h2>9. Contact Us</h2>
            <p>
              If you have any questions or concerns regarding these Terms, please contact us at:
            </p>
            <p>
              <strong>Email:</strong> legal@gracecommunity.org<br />
              <strong>Address:</strong> 123 Grace Avenue, Central District, Lagos, Nigeria
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
