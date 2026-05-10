import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How we collect, use, and protect your personal information in compliance with GDPR.",
};

export default function PrivacyPolicyPage() {
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
            Privacy Policy
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
              At Grace Community, we are committed to protecting your privacy and ensuring the security of your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you interact with our website, app, and services, in compliance with the General Data Protection Regulation (GDPR) and other applicable data protection laws.
            </p>

            <h2>1. Information We Collect</h2>
            <p>We may collect and process the following personal data about you:</p>
            <ul>
              <li><strong>Contact Information:</strong> Name, email address, phone number, and physical address when you register, contact us, or fill out forms (e.g., prayer requests).</li>
              <li><strong>Financial Information:</strong> Payment details when you make a donation. Note: We use secure third-party payment processors (e.g., Paystack) and do not store your full credit card details.</li>
              <li><strong>Account Information:</strong> Login credentials if you create a member account.</li>
              <li><strong>Usage Data:</strong> Information about how you use our website, collected via cookies and analytics tools (see our <Link href="/cookies">Cookie Policy</Link>).</li>
              <li><strong>Special Category Data:</strong> In some cases, such as prayer requests or pastoral care, you may voluntarily share sensitive information revealing religious beliefs or health conditions. We only process this with your explicit consent.</li>
            </ul>

            <h2>2. How We Use Your Information</h2>
            <p>We use your personal data for the following purposes:</p>
            <ul>
              <li>To provide and manage our services, including event registrations, RSVPs, and member accounts.</li>
              <li>To process donations and provide giving statements.</li>
              <li>To communicate with you regarding church news, updates, and events (if you have opted in).</li>
              <li>To respond to your inquiries, prayer requests, and support needs.</li>
              <li>To improve our website, app, and community services.</li>
              <li>To comply with legal obligations.</li>
            </ul>

            <h2>3. Legal Basis for Processing</h2>
            <p>Under GDPR, we process your data under the following lawful bases:</p>
            <ul>
              <li><strong>Consent:</strong> When you have explicitly given us permission to process your data for a specific purpose (e.g., subscribing to a newsletter, submitting a prayer request).</li>
              <li><strong>Contract:</strong> When processing is necessary for the performance of a contract with you (e.g., event registration).</li>
              <li><strong>Legal Obligation:</strong> When we are required to comply with the law (e.g., tax reporting for donations).</li>
              <li><strong>Legitimate Interests:</strong> When processing is necessary for our legitimate interests in operating the church, provided these do not override your fundamental rights.</li>
            </ul>

            <h2>4. Data Sharing and Security</h2>
            <p>
              We do not sell, rent, or trade your personal information. We may share your data with trusted third-party service providers (such as payment processors and email service providers) strictly for the purpose of operating our services. We implement robust technical and organizational measures to protect your data against unauthorized access, loss, or alteration.
            </p>

            <h2>5. Your Rights</h2>
            <p>As a data subject, you have the right to:</p>
            <ul>
              <li>Access the personal data we hold about you.</li>
              <li>Request correction of inaccurate or incomplete data.</li>
              <li>Request erasure of your data (the "right to be forgotten").</li>
              <li>Restrict or object to our processing of your data.</li>
              <li>Request data portability.</li>
              <li>Withdraw your consent at any time.</li>
            </ul>

            <h2>6. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or wish to exercise your data rights, please contact our Data Protection Officer at:
            </p>
            <p>
              <strong>Email:</strong> privacy@gracecommunity.org<br />
              <strong>Address:</strong> 123 Grace Avenue, Central District, Lagos, Nigeria
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
